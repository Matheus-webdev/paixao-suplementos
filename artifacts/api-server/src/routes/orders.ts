import { Router, type IRouter } from "express";
import {
  db, cartItemsTable, productsTable, addressesTable, ordersTable, orderItemsTable,
  usersTable, PAYMENT_METHODS,
} from "@workspace/db";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "../lib/auth";
import { notifyOrderCreated } from "../lib/telegram";

const router: IRouter = Router();

router.use(requireAuth);

const createOrderSchema = z.object({
  addressId: z.string().uuid(),
  paymentMethod: z.enum(PAYMENT_METHODS),
  installments: z.number().int().min(1).max(24).default(1),
  paymentData: z.record(z.string(), z.unknown()).default({}),
  notes: z.string().max(500).optional(),
});

router.post("/", async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." });
    return;
  }
  const userId = req.session.userId!;
  const { addressId, paymentMethod, installments, paymentData, notes } = parsed.data;

  const [address] = await db.select().from(addressesTable)
    .where(and(eq(addressesTable.id, addressId), eq(addressesTable.userId, userId))).limit(1);
  if (!address) {
    res.status(400).json({ error: "Endereço inválido." });
    return;
  }

  const items = await db.select({
    id: cartItemsTable.id,
    quantity: cartItemsTable.quantity,
    flavor: cartItemsTable.flavor,
    product: productsTable,
  }).from(cartItemsTable)
    .innerJoin(productsTable, eq(productsTable.id, cartItemsTable.productId))
    .where(eq(cartItemsTable.userId, userId));

  if (items.length === 0) {
    res.status(400).json({ error: "Seu carrinho está vazio." });
    return;
  }

  const subtotal = items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);
  const total = subtotal; // shipping/discounts can be added later

  // Sanitize payment data — never store full card numbers
  const safePaymentData: Record<string, unknown> = {};
  if (paymentData["cardholder"]) safePaymentData["cardholder"] = paymentData["cardholder"];
  if (typeof paymentData["cardNumber"] === "string") {
    const num = paymentData["cardNumber"].replace(/\D/g, "");
    safePaymentData["cardLast4"] = num.slice(-4);
    safePaymentData["cardBrand"] = paymentData["cardBrand"] ?? null;
  }
  if (paymentData["cpf"]) safePaymentData["cpf"] = paymentData["cpf"];

  // Online payment methods (MP Checkout Pro) start as "Aguardando Pagamento"
  const mpMethods: string[] = ["pix", "credito"];
  const initialStatus = mpMethods.includes(paymentMethod) ? "Aguardando Pagamento" : "Preparando";

  const result = await db.transaction(async (tx) => {
    const [order] = await tx.insert(ordersTable).values({
      userId,
      addressId: address.id,
      addressSnapshot: {
        firstName: address.firstName,
        lastName: address.lastName,
        cep: address.cep,
        street: address.street,
        number: address.number,
        complement: address.complement,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        phone: address.phone,
      },
      paymentMethod,
      paymentData: safePaymentData,
      installments,
      subtotal: subtotal.toFixed(2),
      total: total.toFixed(2),
      status: initialStatus,
      notes: notes ?? null,
    }).returning();

    if (!order) throw new Error("Failed to create order");

    await tx.insert(orderItemsTable).values(items.map((i) => ({
      orderId: order.id,
      productId: i.product.id,
      productName: i.product.name,
      brand: i.product.brand,
      flavor: i.flavor,
      unitPrice: i.product.price,
      quantity: i.quantity,
      image: i.product.image,
    })));

    await tx.delete(cartItemsTable).where(eq(cartItemsTable.userId, userId));

    return order;
  });

  res.status(201).json({ order: result });

  // Fire-and-forget: notify owner via Telegram (no await, won't block response)
  void (async () => {
    try {
      const [user] = await db.select({ name: usersTable.name, phone: addressesTable.phone })
        .from(usersTable)
        .leftJoin(addressesTable, eq(addressesTable.id, address.id))
        .where(eq(usersTable.id, userId)).limit(1);
      await notifyOrderCreated(
        {
          orderNumber: result.orderNumber,
          total: result.total,
          paymentMethod: result.paymentMethod,
          status: result.status,
          installments: result.installments,
          customerName: user?.name ?? "Cliente",
          customerPhone: address.phone,
          city: address.city,
          state: address.state,
        },
        items.map((i) => ({
          productName: i.product.name,
          brand: i.product.brand,
          flavor: i.flavor,
          quantity: i.quantity,
          unitPrice: i.product.price,
        })),
      );
    } catch (err) {
      req.log.error({ err }, "notifyOrderCreated failed");
    }
  })();
});

router.get("/", async (req, res) => {
  const list = await db.select().from(ordersTable)
    .where(eq(ordersTable.userId, req.session.userId!))
    .orderBy(desc(ordersTable.createdAt));
  res.json({ orders: list });
});

// Customer confirms they received the order — moves it from "Enviado" to "Entregue"
router.post("/:id/confirm-delivery", async (req, res) => {
  const userId = req.session.userId!;
  const orderId = req.params["id"]!;
  const [order] = await db.select().from(ordersTable)
    .where(and(eq(ordersTable.id, orderId), eq(ordersTable.userId, userId))).limit(1);
  if (!order) { res.status(404).json({ error: "Pedido não encontrado." }); return; }
  if (order.status !== "Enviado") {
    res.status(400).json({ error: "Só é possível confirmar o recebimento de pedidos enviados." });
    return;
  }
  await db.update(ordersTable)
    .set({ status: "Entregue", updatedAt: new Date() })
    .where(eq(ordersTable.id, orderId));
  res.json({ ok: true });
});

router.get("/:id", async (req, res) => {
  const userId = req.session.userId!;
  const [order] = await db.select().from(ordersTable)
    .where(and(eq(ordersTable.id, req.params["id"]!), eq(ordersTable.userId, userId))).limit(1);
  if (!order) {
    res.status(404).json({ error: "Pedido não encontrado." });
    return;
  }
  const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
  res.json({ order, items });
});

export default router;

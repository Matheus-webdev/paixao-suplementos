import { Router, type IRouter } from "express";
import { db, ordersTable, orderItemsTable, usersTable, ORDER_STATUSES, updateOrderStatusSchema } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";

const router: IRouter = Router();

router.use(requireAdmin);

router.get("/orders", async (_req, res) => {
  const list = await db.select({
    id: ordersTable.id,
    orderNumber: ordersTable.orderNumber,
    status: ordersTable.status,
    paymentMethod: ordersTable.paymentMethod,
    installments: ordersTable.installments,
    subtotal: ordersTable.subtotal,
    total: ordersTable.total,
    addressSnapshot: ordersTable.addressSnapshot,
    notes: ordersTable.notes,
    createdAt: ordersTable.createdAt,
    updatedAt: ordersTable.updatedAt,
    customerId: usersTable.id,
    customerName: usersTable.name,
    customerEmail: usersTable.email,
  }).from(ordersTable)
    .innerJoin(usersTable, eq(usersTable.id, ordersTable.userId))
    .orderBy(desc(ordersTable.createdAt));

  // Attach items
  const itemsByOrder = new Map<string, typeof items>();
  const items = list.length > 0
    ? await db.select().from(orderItemsTable)
    : [];
  for (const item of items) {
    const arr = itemsByOrder.get(item.orderId) ?? [];
    arr.push(item);
    itemsByOrder.set(item.orderId, arr);
  }
  res.json({
    orders: list.map((o) => ({ ...o, items: itemsByOrder.get(o.id) ?? [] })),
  });
});

router.patch("/orders/:id/status", async (req, res) => {
  const parsed = updateOrderStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: `Status deve ser um dos: ${ORDER_STATUSES.join(", ")}` });
    return;
  }
  const [updated] = await db.update(ordersTable)
    .set({ status: parsed.data.status, updatedAt: new Date() })
    .where(eq(ordersTable.id, req.params["id"]!))
    .returning({ id: ordersTable.id });
  if (!updated) {
    res.status(404).json({ error: "Pedido não encontrado." });
    return;
  }
  res.json({ ok: true });
});

router.delete("/orders/:id", async (req, res) => {
  const [deleted] = await db.delete(ordersTable)
    .where(eq(ordersTable.id, req.params["id"]!))
    .returning({ id: ordersTable.id });
  if (!deleted) {
    res.status(404).json({ error: "Pedido não encontrado." });
    return;
  }
  res.json({ ok: true });
});

export default router;

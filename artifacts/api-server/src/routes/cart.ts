import { Router, type IRouter } from "express";
import { db, cartItemsTable, productsTable, insertCartItemSchema } from "@workspace/db";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  const items = await db.select({
    id: cartItemsTable.id,
    productId: cartItemsTable.productId,
    flavor: cartItemsTable.flavor,
    quantity: cartItemsTable.quantity,
    product: productsTable,
  }).from(cartItemsTable)
    .innerJoin(productsTable, eq(productsTable.id, cartItemsTable.productId))
    .where(eq(cartItemsTable.userId, req.session.userId!))
    .orderBy(cartItemsTable.createdAt);
  const subtotal = items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);
  res.json({ items, subtotal: subtotal.toFixed(2) });
});

router.post("/", async (req, res) => {
  const parsed = insertCartItemSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." });
    return;
  }
  const userId = req.session.userId!;
  const { productId, flavor, quantity } = parsed.data;
  const [product] = await db.select({ id: productsTable.id }).from(productsTable)
    .where(and(eq(productsTable.id, productId), eq(productsTable.isActive, true))).limit(1);
  if (!product) {
    res.status(404).json({ error: "Produto não encontrado." });
    return;
  }
  // Upsert: if exists, increment qty; else insert
  await db.insert(cartItemsTable).values({
    userId,
    productId,
    flavor: flavor ?? null,
    quantity,
  }).onConflictDoUpdate({
    target: [cartItemsTable.userId, cartItemsTable.productId, cartItemsTable.flavor],
    set: { quantity: sql`${cartItemsTable.quantity} + ${quantity}` },
  });
  res.status(201).json({ ok: true });
});

const updateQtySchema = z.object({ quantity: z.number().int().min(1).max(99) });

router.patch("/:id", async (req, res) => {
  const parsed = updateQtySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Quantidade inválida." });
    return;
  }
  const userId = req.session.userId!;
  const [updated] = await db.update(cartItemsTable)
    .set({ quantity: parsed.data.quantity })
    .where(and(eq(cartItemsTable.id, req.params["id"]!), eq(cartItemsTable.userId, userId)))
    .returning({ id: cartItemsTable.id });
  if (!updated) {
    res.status(404).json({ error: "Item não encontrado." });
    return;
  }
  res.json({ ok: true });
});

router.delete("/:id", async (req, res) => {
  const userId = req.session.userId!;
  const [deleted] = await db.delete(cartItemsTable)
    .where(and(eq(cartItemsTable.id, req.params["id"]!), eq(cartItemsTable.userId, userId)))
    .returning({ id: cartItemsTable.id });
  if (!deleted) {
    res.status(404).json({ error: "Item não encontrado." });
    return;
  }
  res.json({ ok: true });
});

router.delete("/", async (req, res) => {
  await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, req.session.userId!));
  res.json({ ok: true });
});

export default router;

import { Router, type IRouter } from "express";
import { db, addressesTable, insertAddressSchema } from "@workspace/db";
import { and, desc, eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth";

const router: IRouter = Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  const list = await db.select().from(addressesTable)
    .where(eq(addressesTable.userId, req.session.userId!))
    .orderBy(desc(addressesTable.isDefault), desc(addressesTable.createdAt));
  res.json({ addresses: list });
});

router.post("/", async (req, res) => {
  const parsed = insertAddressSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos." });
    return;
  }
  const userId = req.session.userId!;
  const data = parsed.data;
  // If marked default, unset previous defaults
  if (data.isDefault) {
    await db.update(addressesTable).set({ isDefault: false }).where(eq(addressesTable.userId, userId));
  } else {
    // If first address, force default
    const existing = await db.select({ id: addressesTable.id }).from(addressesTable).where(eq(addressesTable.userId, userId)).limit(1);
    if (existing.length === 0) data.isDefault = true;
  }
  const [created] = await db.insert(addressesTable).values({ ...data, userId }).returning();
  res.status(201).json({ address: created });
});

router.delete("/:id", async (req, res) => {
  const userId = req.session.userId!;
  const id = req.params["id"]!;
  const [deleted] = await db.delete(addressesTable)
    .where(and(eq(addressesTable.id, id), eq(addressesTable.userId, userId)))
    .returning({ id: addressesTable.id, isDefault: addressesTable.isDefault });
  if (!deleted) {
    res.status(404).json({ error: "Endereço não encontrado." });
    return;
  }
  // Promote any remaining address to default if we deleted the default
  if (deleted.isDefault) {
    const [next] = await db.select({ id: addressesTable.id }).from(addressesTable)
      .where(eq(addressesTable.userId, userId)).orderBy(desc(addressesTable.createdAt)).limit(1);
    if (next) {
      await db.update(addressesTable).set({ isDefault: true }).where(eq(addressesTable.id, next.id));
    }
  }
  res.json({ ok: true });
});

router.patch("/:id/default", async (req, res) => {
  const userId = req.session.userId!;
  const id = req.params["id"]!;
  const [exists] = await db.select({ id: addressesTable.id }).from(addressesTable)
    .where(and(eq(addressesTable.id, id), eq(addressesTable.userId, userId))).limit(1);
  if (!exists) {
    res.status(404).json({ error: "Endereço não encontrado." });
    return;
  }
  await db.update(addressesTable).set({ isDefault: false }).where(eq(addressesTable.userId, userId));
  await db.update(addressesTable).set({ isDefault: true }).where(eq(addressesTable.id, id));
  res.json({ ok: true });
});

export default router;

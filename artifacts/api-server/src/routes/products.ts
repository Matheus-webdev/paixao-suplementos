import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (_req, res) => {
  const list = await db.select().from(productsTable).where(eq(productsTable.isActive, true)).orderBy(productsTable.createdAt);
  res.json({ products: list });
});

router.get("/:slug", async (req, res) => {
  const [product] = await db.select().from(productsTable)
    .where(and(eq(productsTable.slug, req.params["slug"]!), eq(productsTable.isActive, true)))
    .limit(1);
  if (!product) {
    res.status(404).json({ error: "Produto não encontrado." });
    return;
  }
  res.json({ product });
});

export default router;

import { integer, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { z } from "zod";
import { usersTable } from "./users";
import { productsTable } from "./products";

export const cartItemsTable = pgTable(
  "cart_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => productsTable.id, { onDelete: "cascade" }),
    flavor: text("flavor"),
    quantity: integer("quantity").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("uq_cart_user_product_flavor").on(t.userId, t.productId, t.flavor)],
);

export const insertCartItemSchema = z.object({
  productId: z.string().uuid(),
  flavor: z.string().nullable().optional(),
  quantity: z.number().int().min(1).max(99),
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItemsTable.$inferSelect;

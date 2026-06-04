import { integer, jsonb, numeric, pgTable, serial, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { usersTable } from "./users";
import { addressesTable } from "./addresses";
import { productsTable } from "./products";

export const ORDER_STATUSES = ["Aguardando Pagamento", "Pago", "Preparando", "Pronto", "Enviado", "Entregue", "Cancelado"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = ["pix", "credito", "nubank", "credito_pix", "dois_cartoes"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export type AddressSnapshot = {
  firstName: string; lastName: string; cep: string; street: string; number: string;
  complement?: string | null; neighborhood: string; city: string; state: string; phone: string;
};

export const ordersTable = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: serial("order_number").notNull().unique(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "restrict" }),
  addressId: uuid("address_id").references(() => addressesTable.id, { onDelete: "set null" }),
  addressSnapshot: jsonb("address_snapshot").$type<AddressSnapshot>().notNull(),
  paymentMethod: varchar("payment_method", { length: 32 }).notNull(),
  paymentData: jsonb("payment_data").$type<Record<string, unknown>>().notNull().default({}),
  installments: integer("installments").notNull().default(1),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 32 }).notNull().default("Preparando"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItemsTable = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => ordersTable.id, { onDelete: "cascade" }),
  productId: uuid("product_id").references(() => productsTable.id, { onDelete: "set null" }),
  productName: text("product_name").notNull(),
  brand: varchar("brand", { length: 64 }).notNull(),
  flavor: text("flavor"),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  image: text("image"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export type Order = typeof ordersTable.$inferSelect;
export type OrderItem = typeof orderItemsTable.$inferSelect;

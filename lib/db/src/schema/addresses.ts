import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";
import { usersTable } from "./users";

export const addressesTable = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  firstName: varchar("first_name", { length: 80 }).notNull(),
  lastName: varchar("last_name", { length: 80 }).notNull(),
  cep: varchar("cep", { length: 9 }).notNull(),
  street: text("street").notNull(),
  number: varchar("number", { length: 20 }).notNull(),
  complement: text("complement"),
  neighborhood: text("neighborhood").notNull(),
  city: text("city").notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAddressSchema = z.object({
  firstName: z.string().min(1, "Informe o nome."),
  lastName: z.string().min(1, "Informe o sobrenome."),
  cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido."),
  street: z.string().min(1, "Informe o endereço."),
  number: z.string().min(1, "Informe o número."),
  complement: z.string().optional().nullable(),
  neighborhood: z.string().min(1, "Informe o bairro."),
  city: z.string().min(1, "Informe a cidade."),
  state: z.string().length(2, "Informe a UF (2 letras)."),
  phone: z.string().min(8, "Informe um telefone válido."),
  isDefault: z.boolean().optional().default(false),
});

export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type Address = typeof addressesTable.$inferSelect;

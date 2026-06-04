import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";

// connect-pg-simple compatible session store table.
export const sessionsTable = pgTable(
  "session",
  {
    sid: text("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire", { precision: 6 }).notNull(),
  },
  (t) => [index("IDX_session_expire").on(t.expire)],
);

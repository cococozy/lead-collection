import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const leads = pgTable("leads", {
  id: serial().primaryKey(),
  name: text().notNull(),
  phone: text().notNull(),
  email: text().notNull().unique(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const leads = pgTable("leads", {
  id: serial().primaryKey(),
  name: text().notNull(),
  phone: text().notNull(),
  email: text().notNull().unique(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

export const leadNotes = pgTable("lead_notes", {
  id: serial().primaryKey(),
  leadId: integer()
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),
  content: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
});

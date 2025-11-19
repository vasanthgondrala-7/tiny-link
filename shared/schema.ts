import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const links = pgTable("links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 8 }).notNull().unique(),
  targetUrl: text("target_url").notNull(),
  clicks: integer("clicks").notNull().default(0),
  lastClicked: timestamp("last_clicked"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertLinkSchema = createInsertSchema(links, {
  targetUrl: z.string().url({ message: "Please enter a valid URL" }),
  code: z
    .string()
    .regex(/^[A-Za-z0-9]{6,8}$/, "Code must be 6-8 alphanumeric characters")
    .optional(),
}).omit({
  id: true,
  clicks: true,
  lastClicked: true,
  createdAt: true,
});

export type InsertLink = z.infer<typeof insertLinkSchema>;
export type Link = typeof links.$inferSelect;

import { relations } from "drizzle-orm";
import { boolean, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const draws = pgTable("draws", {
  id: uuid(),
});

export const drawNames = pgTable("draw_names", {
  id: uuid(),
  drawId: uuid("draw_id")
    .notNull()
    .references(() => draws.id),
  name: text().notNull(),
  match: text().notNull(),
  is_redeemed: boolean().notNull().default(false),
});

export const drawsRelations = relations(draws, ({ many }) => ({
  drawNames: many(drawNames),
}));

export const drawNamesRelations = relations(drawNames, ({ one }) => ({
  draw: one(draws, {
    fields: [drawNames.drawId],
    references: [draws.id],
  }),
}));

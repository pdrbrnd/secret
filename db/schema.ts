import { relations } from "drizzle-orm";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";

const createId = () => {
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const nanoid = customAlphabet(alphabet, 14);

  return nanoid();
};

export const draws = pgTable("draws", {
  id: text().primaryKey().notNull().$defaultFn(createId),
});

export const drawNames = pgTable("draw_names", {
  id: text().primaryKey().notNull().$defaultFn(createId),
  drawId: text("draw_id")
    .notNull()
    .references(() => draws.id, { onDelete: "cascade" }),
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

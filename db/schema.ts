import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const notes = sqliteTable("notes", {
  id: text("id").primaryKey(),
  title: text("title"),
  note_audio_url: text("note_audio_url").notNull(),
  note_text: text("note_text"),
  created_at: text("created_at").notNull(),
});

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;

import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core'

export const todos = pgTable('todos', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  isCompleted: boolean().notNull(),
  title: text('title').notNull(),
  createdAt: timestamp({
    withTimezone: true,
  }).defaultNow().notNull(),
  updatedAt: timestamp({
    withTimezone: true,
  }).defaultNow().notNull().$onUpdate(() => new Date()),
})

import { orderItems, restaurant } from '.'
import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'

import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  priceInCents: integer('price_in_cents').notNull(),
  restaurantId: text('restaurant_id')
    .notNull()
    .references(() => restaurant.id, {
      onDelete: 'cascade',
    }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const productsRelations = relations(products, ({ one, many }) => {
  return {
    restaurant: one(restaurant, {
      fields: [products.restaurantId],
      references: [restaurant.id],
      relationName: 'products_restaurant',
    }),
    ordersItems: many(orderItems),
  }
})

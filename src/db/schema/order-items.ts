import { orders, products } from '.'
import { createId } from '@paralleldrive/cuid2'

import { integer, pgTable, text } from 'drizzle-orm/pg-core'

export const orderItems = pgTable('order-items', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  orderId: text()
    .notNull()
    .references(() => orders.id, {
      onDelete: 'cascade',
    }),
  productId: text('product_id').references(() => products.id, {
    onDelete: 'set default',
  }),
  priceInCents: integer('price_in_cents').notNull(),
  quantity: integer('quantity').notNull(),
})

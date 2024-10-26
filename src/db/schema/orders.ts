import { restaurant, user } from '.'
import { createId } from '@paralleldrive/cuid2'

import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'processing',
  'delivering',
  'delivered',
  'canceled',
])

export const orders = pgTable('orders', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  customerId: text('customer_id').references(() => user.id, {
    onDelete: 'set null',
  }),
  restaurantId: text('restaurant_id')
    .notNull()
    .references(() => restaurant.id, {
      onDelete: 'cascade',
    }),
  status: orderStatusEnum('status').default('pending').notNull(),
  totalInCents: integer('total_in_cents').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

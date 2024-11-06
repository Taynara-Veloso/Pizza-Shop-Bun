import { orders, restaurant } from '.'
import { relations } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'

import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['manager', 'customer'])

export const user = pgTable('users', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  role: userRoleEnum('role').default('customer').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const userRelations = relations(user, ({ one, many }) => {
  return {
    managedRestaurant: one(restaurant, {
      fields: [user.id],
      references: [restaurant.managerId],
      relationName: 'user_managed_restaurant',
    }),
    orders: many(orders),
  }
})

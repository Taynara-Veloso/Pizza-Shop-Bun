import { Elysia, t } from 'elysia'
import { auth } from '../auth/auth-jwt'
import { db } from '../../db/connection'
import { orders, user } from '../../db/schema'
import { createSelectSchema } from 'drizzle-typebox'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { and, count, eq, getTableColumns, ilike } from 'drizzle-orm'

/* 
  ilike = verifica se o valor é como qualquer outro valor, 
  sem distinção entre maiúsculas e minúsculas
*/

export const getOrders = new Elysia().use(auth).get(
  '/orders',
  async ({ getCurrentUser, query }) => {
    const { restaurantId } = await getCurrentUser()
    const { customerName, orderId, status, pageIndex } = query

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const orderTableColumns = getTableColumns(orders)

    const baseQuery = db
      .select(orderTableColumns)
      .from(orders)
      .innerJoin(user, eq(user.id, orders.customerId))
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          orderId ? ilike(orders.id, `%${orderId}%`) : undefined,
          status ? eq(orders.id, status) : undefined,
          customerName ? ilike(user.name, `%${customerName}%`) : undefined,
        ),
      )

    const [amountOfOrdersQuery, allOrders] = await Promise.all([
      db.select({ count: count() }).from(baseQuery.as('base_query')),
      db
        .select()
        .from(baseQuery.as('base_query'))
        .offset(pageIndex * 10)
        .limit(10),
    ])

    /*  
      Outra maneira de desestruturar:
      const [[{ count: amountOfOrders }], allOrders] = await Promise.all([...])
    */
    const amountOfOrders = amountOfOrdersQuery[0].count

    return {
      orders: allOrders,
      meta: {
        pageIndex,
        perPage: 10,
        totalCount: amountOfOrders,
      },
    }
  },
  {
    query: t.Object({
      customerName: t.Optional(t.String()),
      orderId: t.Optional(t.String()),
      status: t.Optional(createSelectSchema(orders).properties.status),
      pageIndex: t.Numeric({ minimum: 0 }),
    }),
  },
)

import { eq } from 'drizzle-orm'
import Elysia, { t } from 'elysia'
import { auth } from '../auth/auth-jwt'
import { db } from '../../db/connection'
import { orders } from '../../db/schema'
import { UnauthorizedError } from '../errors/unauthorized-error'

// cancelar pedidos
export const cancelOrder = new Elysia().use(auth).patch(
  '/orders/:orderId/cancel',
  async ({ getCurrentUser, params, set }) => {
    const { orderId } = params
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }

    const order = await db.query.orders.findFirst({
      where(fields, { eq, and }) {
        return and(
          eq(fields.id, orderId),
          eq(fields.restaurantId, restaurantId),
        )
      },
    })

    if (!order) {
      set.status = 400

      return { message: 'Order not found.' }
    }

    if (!['pending', 'processing'].includes(order.status)) {
      set.status = 400

      return {
        message: 'You cannot cancel orders once they have been shipped.',
      }
    }

    await db
      .update(orders)
      .set({ status: 'canceled' })
      .where(eq(orders.id, orderId))
  },
  {
    params: t.Object({
      orderId: t.String(),
    }),
  },
)

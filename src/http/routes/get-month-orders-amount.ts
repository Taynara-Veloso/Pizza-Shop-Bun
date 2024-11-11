import dayjs from 'dayjs'
import Elysia from 'elysia'
import { auth } from '../auth/auth-jwt'
import { db } from '../../db/connection'
import { orders } from '../../db/schema'
import { and, count, eq, gte, sql } from 'drizzle-orm'
import { UnauthorizedError } from '../errors/unauthorized-error'

// obter o valor dos pedidos mensais
export const getMonthOrdersAmount = new Elysia()
  .use(auth)
  .get('/metrics/month-orders-amount', async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }
    // dia atual
    const today = dayjs()
    // último mês
    const lastMonth = today.subtract(1, 'month')
    // início do último mês
    const startOfLastMonth = lastMonth.startOf('month')

    // Pedidos por mês
    const ordersPerMonth = await db
      .select({
        monthWithYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
        amount: count(),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(orders.createdAt, startOfLastMonth.toDate()),
        ),
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`)

    // mês atual com ano
    const currentMonthWithYear = today.format('YYYY-MM')

    // último mês com ano
    const lastMonthWithYear = lastMonth.format('YYYY-MM')

    // Quantidade de pedidos no mês atual
    const currentMonthOrdersAmount = ordersPerMonth.find((orderPerMonth) => {
      return orderPerMonth.monthWithYear === currentMonthWithYear
    })
    // Quantidade de pedidos no último mês
    const lastMonthOrdersAmount = ordersPerMonth.find((orderPerMonth) => {
      return orderPerMonth.monthWithYear === lastMonthWithYear
    })

    // diferença do último mês
    const diffFromLastMonth =
      currentMonthOrdersAmount && lastMonthOrdersAmount
        ? (currentMonthOrdersAmount.amount * 100) / lastMonthOrdersAmount.amount
        : null

    return {
      amount: currentMonthOrdersAmount?.amount || 0,
      diffFromLastMonth: diffFromLastMonth
        ? Number((diffFromLastMonth - 100).toFixed(2))
        : 0,
    }
  })

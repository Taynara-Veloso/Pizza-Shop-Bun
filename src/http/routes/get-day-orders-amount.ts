import dayjs from 'dayjs'
import Elysia from 'elysia'
import { auth } from '../auth/auth-jwt'
import { db } from '../../db/connection'
import { orders } from '../../db/schema'
import { and, count, eq, gte, sql } from 'drizzle-orm'
import { UnauthorizedError } from '../errors/unauthorized-error'

// obter valor dos pedidos diários
export const getDayOrdersAmount = new Elysia()
  .use(auth)
  .get('/metrics/day-orders-amount', async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }
    // dia atual
    const today = dayjs()
    // ontem
    const yesterday = today.subtract(1, 'day')
    // início de ontem
    const startOfYesterday = yesterday.startOf('day')

    // Pedidos por dia
    const ordersPerDay = await db
      .select({
        dayWithMonthAndYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`,
        amount: count(),
      })
      .from(orders)
      .where(
        and(
          eq(orders.restaurantId, restaurantId),
          gte(orders.createdAt, startOfYesterday.toDate()),
        ),
      )
      .groupBy(sql`TO_CHAR(${orders.createdAt}, 'YYYY-MM-DD')`)

    // Data de hoje com mês e ano
    const todayWithMonthAndYear = today.format('YYYY-MM-DD')

    // Data de ontem com mês e ano
    const yesterdayWithMonthAndYear = yesterday.format('YYYY-MM-DD')

    // Quantidade de pedidos de hoje
    const todayOrdersAmount = ordersPerDay.find((orderPerDay) => {
      return orderPerDay.dayWithMonthAndYear === todayWithMonthAndYear
    })
    // Quantidade de pedidos de ontem
    const yesterdayOrdersAmount = ordersPerDay.find((orderPerDay) => {
      return orderPerDay.dayWithMonthAndYear === yesterdayWithMonthAndYear
    })

    // diferença de ontem
    const diffFromYesterday =
      todayOrdersAmount && yesterdayOrdersAmount
        ? (todayOrdersAmount.amount * 100) / yesterdayOrdersAmount.amount
        : null

    return {
      amount: todayOrdersAmount?.amount || 0,
      diffFromYesterday: diffFromYesterday
        ? Number((diffFromYesterday - 100).toFixed(2))
        : 0,
    }
  })

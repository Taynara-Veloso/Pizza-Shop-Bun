import dayjs from 'dayjs'
import Elysia from 'elysia'
import { auth } from '../auth/auth-jwt'
import { db } from '../../db/connection'
import { orders } from '../../db/schema'
import { and, eq, gte, sql, sum } from 'drizzle-orm'
import { UnauthorizedError } from '../errors/unauthorized-error'

export const getMonthReceipt = new Elysia()
  .use(auth)
  .get('/metrics/month-receipt', async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UnauthorizedError()
    }
    // dia atual
    const today = dayjs()
    // mês passado apartir do dia atual
    const lastMonth = today.subtract(1, 'month')
    // início do mês passado
    const startOfLastMonth = lastMonth.startOf('month')

    // Receita dos meses
    const monthsReceipts = await db
      .select({
        monthWithYear: sql<string>`TO_CHAR(${orders.createdAt}, 'YYYY-MM')`,
        receipt: sum(orders.totalInCents).mapWith(Number),
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

    // recibo do mês atual
    const currentMonthReceipt = monthsReceipts.find((monthReceipt) => {
      return monthReceipt.monthWithYear === currentMonthWithYear
    })
    // recibo do último mês
    const lastMonthReceipt = monthsReceipts.find((monthReceipt) => {
      return monthReceipt.monthWithYear === lastMonthWithYear
    })

    // diferença do mês passado
    const diffFromLastMonth =
      currentMonthReceipt && lastMonthReceipt
        ? (currentMonthReceipt.receipt * 100) / lastMonthReceipt.receipt
        : null

    return {
      receipt: currentMonthReceipt?.receipt || 0,
      diffFromLastMonth: diffFromLastMonth
        ? Number((diffFromLastMonth - 100).toFixed(2))
        : 0,
    }
  })

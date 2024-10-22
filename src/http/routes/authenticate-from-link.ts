import dayjs from 'dayjs'
import { eq } from 'drizzle-orm'
import { Elysia, t } from 'elysia'
import { auth } from '../auth/auth-jwt'
import { db } from '../../db/connection'
import { authLinks } from '../../db/schema'
/* 
  eq = comparar se dois valores são iguais.
  ne = Not equal comparar se dois valores não são iguais.
  gt = o valor do campo é maior que o valor especificado.
  gte = o valor do campo é maior ou igual ao valor especificado.
  lt = o valor do campo é menor que o valor especificado.
  lte = o valor do campo é menor ou igual ao valor especificado.
*/

// autenticador de link
export const authenticateFromLinks = new Elysia().use(auth).get(
  '/auth-links/authenticate',
  async ({ query, signUserToken }) => {
    const { code, redirect } = query

    const authLinkFromCode = await db.query.authLinks.findFirst({
      where(fields, { eq }) {
        return eq(fields.code, code)
      },
    })

    if (!authLinkFromCode) {
      throw new Error('Auth link not found')
    }

    const daysSinceAuthLinkWasCreated = dayjs().diff(
      authLinkFromCode.createdAt,
      'days',
    )

    if (daysSinceAuthLinkWasCreated > 7) {
      throw new Error('Auth link expired, please generate a new one')
    }

    const managedRestaurant = await db.query.restaurant.findFirst({
      where(fields, { eq }) {
        return eq(fields.managerId, authLinkFromCode.userId)
      },
    })

    await signUserToken({
      sub: authLinkFromCode.userId,
      restaurantId: managedRestaurant?.id,
    })

    await db.delete(authLinks).where(eq(authLinks.code, code))

    return redirect
  },
  {
    query: t.Object({
      code: t.String(),
      redirect: t.String(),
    }),
  },
)

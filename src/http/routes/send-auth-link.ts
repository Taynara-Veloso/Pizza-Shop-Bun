import { authLinks } from './../../db/schema/auth-links'
import { Elysia, t } from 'elysia'
import { db } from '../../db/connection'
import { createId } from '@paralleldrive/cuid2'
import { env } from '../../env'
/* 
  eq = comparar se dois valores são iguais.
  ne = Not equal comparar se dois valores não são iguais.
  gt = o valor do campo é maior que o valor especificado.
  gte = o valor do campo é maior ou igual ao valor especificado.
  lt = o valor do campo é menor que o valor especificado.
  lte = o valor do campo é menor ou igual ao valor especificado.
*/
export const sendAuthLinks = new Elysia().post(
  '/authenticate',
  async ({ body }) => {
    const { email } = body

    const userFromEmail = await db.query.user.findFirst({
      where(fields, { eq }) {
        return eq(fields.email, email)
      },
    })

    if (!userFromEmail) {
      throw new Error('User not found')
    }

    const authLinkCode = createId()

    await db.insert(authLinks).values({
      userId: userFromEmail.id,
      code: authLinkCode,
    })

    // Enviar um e-mail

    const authLink = new URL('/auth-links/authenticate', env.API_BASE_URL)

    authLink.searchParams.set('code', authLinkCode)
    // http://localhost:3333/auth-links/authenticate?code=qzug7mlo9ih3125l382qec0u&redirect=http%3A%2F%2Flocalhost%3A5173
    authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)

    console.log(authLink.toString())
  },
  {
    body: t.Object({
      email: t.String({ format: 'email' }),
    }),
  },
)

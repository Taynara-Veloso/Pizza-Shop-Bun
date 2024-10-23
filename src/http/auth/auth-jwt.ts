import jwt from '@elysiajs/jwt'
import { env } from '../../env'
import { Elysia, t, type Static } from 'elysia'

const jwtPayload = t.Object({
  sub: t.String(),
  restaurantId: t.Optional(t.String()),
})

export const auth = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: env.JWT_SECRET_KEY,
      schema: jwtPayload,
    }),
  )
  .derive({ as: 'scoped' }, ({ jwt, cookie, cookie: { auth } }) => {
    return {
      signUserToken: async (payload: Static<typeof jwtPayload>) => {
        const token = await jwt.sign(payload)

        console.log('Gerando Token JWT', token) // Log para ver o token gerado

        auth.set({
          value: token,
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 7 Dias
          path: '/',
        })
      },

      signOutDeleteCookie: () => {
        auth.remove()
      },

      getCurrentUser: async () => {
        const authCookie = cookie.auth?.value

        if (!authCookie) {
          throw new Error('Cookie not found')
        }

        const payload = await jwt.verify(authCookie)

        if (!payload) {
          throw new Error('Unauthorized.')
        }

        return {
          userId: payload.sub,
          restaurantId: payload.restaurantId,
        }
      },
    }
  })

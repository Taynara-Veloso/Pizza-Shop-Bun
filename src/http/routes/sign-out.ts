import Elysia from 'elysia'
import { auth } from '../auth/auth-jwt'

export const signOut = new Elysia()
  .use(auth)
  .post('/sign-out', async ({ cookie, cookie: { cookiesignOut } }) => {
    cookiesignOut.remove()
    delete cookie.cookiesignOut
  })

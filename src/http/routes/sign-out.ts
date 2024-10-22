import Elysia from 'elysia'
import { auth } from '../auth/auth-jwt'

export const signOut = new Elysia()
  .use(auth)
  .post('/sign-out', async ({ signOutDeleteCookie }) => {
    signOutDeleteCookie()

    console.log('signOutDeleteCookie:', signOutDeleteCookie) // Checar se está definido

    if (!signOutDeleteCookie) {
      throw new Error('signOutDeleteCookie is not available')
    }
  })

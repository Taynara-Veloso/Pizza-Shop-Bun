import Elysia from 'elysia'
import { auth } from '../auth/auth-jwt'
import { DeleteUnavailableCookieError } from '../errors/delete-unavailable-cookie'

export const signOut = new Elysia()
  .error({
    DELETEUNAVAILABLECOOKIE: DeleteUnavailableCookieError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'DELETEUNAVAILABLECOOKIE':
        set.status = 204
        return { code, message: error.message }
    }
  })
  .use(auth)
  .post('/sign-out', async ({ signOutDeleteCookie }) => {
    signOutDeleteCookie()

    console.log('signOutDeleteCookie:', signOutDeleteCookie) // Checar se está definido

    if (!signOutDeleteCookie) {
      throw new DeleteUnavailableCookieError()
    }
  })

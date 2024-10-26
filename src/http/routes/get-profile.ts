import { Elysia } from 'elysia'
import { auth } from '../auth/auth-jwt'
import { db } from '../../db/connection'
import { UserNotFoundError } from '../errors/user-not-found'

export const getProfile = new Elysia()
  .use(auth)
  .error({
    USERNOTFOUND: UserNotFoundError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'USERNOTFOUND':
        set.status = 404
        return { code, message: error.message }
    }
  })
  .get('/me', async ({ getCurrentUser }) => {
    const { userId } = await getCurrentUser()

    const user = await db.query.user.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, userId)
      },
    })

    if (!user) {
      throw new UserNotFoundError()
    }

    return user
  })

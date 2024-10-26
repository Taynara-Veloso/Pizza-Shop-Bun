import { Elysia } from 'elysia'
import { auth } from '../auth/auth-jwt'
import { db } from '../../db/connection'
import { UserNotFoundError } from '../errors/user-not-found'

// obter restaurante gerenciado
export const getManagedRestaurant = new Elysia()
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
  .get('/managed-restaurant', async ({ getCurrentUser }) => {
    const { restaurantId } = await getCurrentUser()

    if (!restaurantId) {
      throw new UserNotFoundError()
    }

    const managedRestaurant = await db.query.restaurant.findFirst({
      where(fields, { eq }) {
        return eq(fields.id, restaurantId)
      },
    })

    return managedRestaurant
  })

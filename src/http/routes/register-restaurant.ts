import { restaurant, user } from '../../db/schema'
import { db } from '../../db/connection'
import { Elysia, t } from 'elysia'

export const registerRestaurants = new Elysia().post(
  '/restaurants',
  async ({ body, set }) => {
    const { restaurantName, managerName, email, phone } = body

    const [manager] = await db
      .insert(user)
      .values({
        name: managerName,
        email,
        phone,
        role: 'manager',
      })
      .returning({
        id: user.id,
      })

    await db.insert(restaurant).values({
      name: restaurantName,
      managerId: manager.id,
    })

    set.status = 204 // resposta de sucesso que não retorna valor
  },
  {
    body: t.Object({
      restaurantName: t.String(),
      managerName: t.String(),
      email: t.String(),
      phone: t.String({ format: 'email' }),
    }),
  },
)

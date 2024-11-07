import { Elysia } from 'elysia'

import { signOut } from './routes/sign-out'
import { getProfile } from './routes/get-profile'
import { cancelOrder } from './routes/cancel-order'
import { approveOrder } from './routes/approve-order'
import { deliverOrder } from './routes/deliver-order'
import { dispatchOrder } from './routes/dispatch-order'
import { sendAuthLinks } from './routes/send-auth-link'
import { getOrderDetails } from './routes/get-order-details'
import { registerRestaurants } from './routes/register-restaurant'
import { getManagedRestaurant } from './routes/get-managed-restaurant'
import { authenticateFromLinks } from './routes/authenticate-from-link'

const app = new Elysia()
  .use(registerRestaurants)
  .use(sendAuthLinks)
  .use(authenticateFromLinks)
  .use(signOut)
  .use(getProfile)
  .use(getManagedRestaurant)
  .use(getOrderDetails)
  .use(approveOrder)
  .use(dispatchOrder)
  .use(deliverOrder)
  .use(cancelOrder)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION':
        set.status = error.status
        return error.toResponse()

      default: {
        console.error(error)
        return new Response(null, { status: 500 })
      }
    }
  })

app.listen(3333, () => {
  console.log('🧅 Http server running')
})

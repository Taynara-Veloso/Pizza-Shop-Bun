import { Elysia } from 'elysia'

import { signOut } from './routes/sign-out'
import { getOrders } from './routes/get-orders'
import { getProfile } from './routes/get-profile'
import { cancelOrder } from './routes/cancel-order'
import { approveOrder } from './routes/approve-order'
import { deliverOrder } from './routes/deliver-order'
import { dispatchOrder } from './routes/dispatch-order'
import { sendAuthLinks } from './routes/send-auth-link'
import { getOrderDetails } from './routes/get-order-details'
import { getMonthReceipt } from './routes/get-month-receipt'
import { getPopularProducts } from './routes/get-popular-products'
import { registerRestaurants } from './routes/register-restaurant'
import { getDayOrdersAmount } from './routes/get-day-orders-amount'
import { getManagedRestaurant } from './routes/get-managed-restaurant'
import { getMonthOrdersAmount } from './routes/get-month-orders-amount'
import { authenticateFromLinks } from './routes/authenticate-from-link'
import { getDailyReceiptInPeriod } from './routes/get-daily-receipt-in-period'
import { getMonthCanceledOrdersAmount } from './routes/get-month-canceled-orders-amount'

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
  .use(getOrders)
  .use(getMonthReceipt)
  .use(getDayOrdersAmount)
  .use(getMonthOrdersAmount)
  .use(getMonthCanceledOrdersAmount)
  .use(getPopularProducts)
  .use(getDailyReceiptInPeriod)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION': {
        set.status = error.status
        return error.toResponse()
      }
      case 'NOT_FOUND': {
        return new Response(null, { status: 404 })
      }
      default: {
        console.error(error)
        return new Response(null, { status: 500 })
      }
    }
  })

app.listen(3333, () => {
  console.log('🧅 Http server running')
})

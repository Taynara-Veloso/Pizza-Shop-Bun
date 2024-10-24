import { Elysia } from 'elysia'

import { signOut } from './routes/sign-out'
import { getProfile } from './routes/get-profile'
import { sendAuthLinks } from './routes/send-auth-link'
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

app.listen(3333, () => {
  console.log('🧅 Http server running')
})

import { Elysia } from 'elysia'
import { signOut } from './routes/sign-out'
import { sendAuthLinks } from './routes/send-auth-link'
import { registerRestaurants } from './routes/register-restaurant'
import { authenticateFromLinks } from './routes/authenticate-from-link'
import { getProfile } from './routes/get-profile'

const app = new Elysia()
  .use(registerRestaurants)
  .use(sendAuthLinks)
  .use(authenticateFromLinks)
  .use(signOut)
  .use(getProfile)

app.listen(3333, () => {
  console.log('🧅 Http server running')
})

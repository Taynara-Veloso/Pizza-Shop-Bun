import { Elysia } from 'elysia'
import { sendAuthLinks } from './routes/send-auth-link'
import { registerRestaurants } from './routes/register-restaurant'
import { authenticateFromLinks } from './routes/authenticate-from-link'

const app = new Elysia()
  .use(registerRestaurants)
  .use(sendAuthLinks)
  .use(authenticateFromLinks)

app.listen(3333, () => {
  console.log('🧅 Http server running')
})

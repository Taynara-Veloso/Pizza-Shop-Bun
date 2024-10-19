import { Elysia } from 'elysia'
import { registerRestaurants } from './routes/register-restaurant'
import { sendAuthLinks } from './routes/send-auth-link'

const app = new Elysia().use(registerRestaurants).use(sendAuthLinks)

app.listen(3333, () => {
  console.log('🧅 Http server running')
})

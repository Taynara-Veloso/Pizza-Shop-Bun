import { faker } from '@faker-js/faker'
import { user, restaurant } from './schema'
import { db } from './connection'
import chalk from 'chalk'

/* 
  Reset database
*/

await db.delete(user)
await db.delete(restaurant)

console.log(chalk.yellowBright('🎲 Database reset!'))

/* 
  Create customers
*/
await db.insert(user).values([
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer',
  },
  {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'customer',
  },
])

console.log(chalk.green('✅ Created customer!'))

/* 
  Create manager
*/
const [manager] = await db
  .insert(user)
  .values([
    {
      name: faker.person.fullName(),
      email: 'admin@admin.com',
      role: 'manager',
    },
  ])
  .returning({
    id: user.id,
  })

console.log(chalk.green('✅ Created manager!'))

/* 
  Create restaurant
*/
await db.insert(restaurant).values([
  {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    managerId: manager.id,
  },
])

console.log(chalk.yellow('🍕 Created restaurant!'))

console.log(chalk.greenBright('🟢 Database seeded successfully!!'))

process.exit()

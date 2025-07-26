import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Users with Profiles
  console.log('Seeding users...')
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
      profile: {
        create: {
          loyaltyPoints: 100,
          tier: 'BRONZE'
        }
      }
    }
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      profile: {
        create: {
          loyaltyPoints: 250,
          tier: 'SILVER'
        }
      }
    }
  })

  // Create Products
  console.log('Seeding products...')
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Small Coffee',
        description: 'Freshly brewed arabica coffee',
        price: 3.50,
        category: 'Coffee'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Large Coffee',
        description: '16oz freshly brewed arabica coffee',
        price: 4.50,
        category: 'Coffee'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Croissant',
        description: 'Buttery flaky pastry',
        price: 2.75,
        category: 'Bakery'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Muffin',
        description: 'Blueberry muffin',
        price: 3.25,
        category: 'Bakery'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Branded Travel Mug',
        description: 'Insulated stainless steel mug',
        price: 15.99,
        category: 'Merchandise'
      }
    })
  ])

  // Create Rewards
  console.log('Seeding rewards...')
  const rewards = await Promise.all([
    prisma.reward.create({
      data: {
        name: 'Free Small Coffee',
        description: 'Redeem for one free small coffee',
        pointsCost: 50
      }
    }),
    prisma.reward.create({
      data: {
        name: '20% Off Merchandise',
        description: '20% discount on any merchandise item',
        pointsCost: 100
      }
    }),
    prisma.reward.create({
      data: {
        name: '$10 Off Transaction',
        description: '$10 off your next purchase',
        pointsCost: 200
      }
    })
  ])

  console.log('✅ Seeding complete!')
  console.log('Created users:', user1.id, user2.id)
  console.log('Created products:', products.map(p => p.id))
  console.log('Created rewards:', rewards.map(r => r.id))
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

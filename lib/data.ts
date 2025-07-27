import { prisma } from './prisma'

export async function getProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true }
  })
  return products
}

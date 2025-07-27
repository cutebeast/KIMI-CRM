// lib/prisma.ts

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // Optional: for debugging, shows queries in the server console
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
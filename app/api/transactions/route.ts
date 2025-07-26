import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, items } = body

    if (!userId || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const result = await prisma.$transaction(async (tx) => {
      // Calculate total amount
      let totalAmount = 0
      const transactionItems = []

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        })

        if (!product) {
          throw new Error(`Product ${item.productId} not found`)
        }

        const itemTotal = product.price.toNumber() * item.quantity
        totalAmount += itemTotal

        transactionItems.push({
          productId: item.productId,
          quantity: item.quantity,
          priceAtTime: product.price
        })
      }

      // Create transaction
      const transaction = await tx.transaction.create({
        data: {
          userId,
          totalAmount,
          items: {
            create: transactionItems
          }
        }
      })

      // Award loyalty points
      await tx.profile.update({
        where: { userId },
        data: {
          loyaltyPoints: {
            increment: Math.floor(totalAmount)
          }
        }
      })

      return transaction
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Transaction error:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}

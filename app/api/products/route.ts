import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/data'

export async function GET() {
  console.log("--- SERVER LOG --- DATABASE_URL:", process.env.DATABASE_URL);
  try {
    const products = await getProducts()
    const serializedProducts = products.map(product => ({
      ...product,
      price: product.price.toString()
    }))
    return NextResponse.json(serializedProducts)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

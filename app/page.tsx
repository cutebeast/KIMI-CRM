'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import AuthStatus from '@/components/AuthStatus'
import ShoppingCart from '@/components/ShoppingCart'
import type { Product, CartItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export default function HomePage() {
  const { data: session } = useSession()
  const [cart, setCart] = useState<CartItem[]>([])
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error)
  }, [])

  const addToCart = (product: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const handleCheckout = async () => {
    if (!session?.user?.id) {
      alert('Please log in to checkout')
      return
    }

    const checkoutData = {
      userId: session.user.id,
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    }

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
      })

      if (response.ok) {
        setCart([])
        alert('Purchase successful! Points awarded.')
      } else {
        const errorData = await response.json()
        alert(`Checkout failed: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Checkout failed: Network error')
    }
  }

  // products.price is already a string from the API

  return (
    <div className="container mx-auto p-4">
      <AuthStatus />
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Products grid */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg font-semibold">
                  ${Number(product.price).toFixed(2)}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="destructive" className="w-full" onClick={() => addToCart(product)}>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Shopping Cart */}
        <div>
          <ShoppingCart cartItems={cart} onCheckout={handleCheckout} />
        </div>
      </div>
    </div>
  )
}

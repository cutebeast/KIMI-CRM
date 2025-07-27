'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import AuthStatus from '@/components/AuthStatus'
import ShoppingCart from '@/components/ShoppingCart'

export default function HomePage() {
  const { data: session } = useSession()
  const [cart, setCart] = useState([])
  const [products, setProducts] = useState([])

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

  const productsWithStringPrices = products.map(product => ({
    ...product,
    price: product.price.toString()
  }))

  return (
    <div>
      <AuthStatus />
      <h1>Our Products</h1>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center'
      }}>
        {productsWithStringPrices.map((product: any) => (
          <div key={product.id} style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            margin: '10px',
            width: '250px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{product.name}</h2>
            <p style={{ margin: 0, fontWeight: 'bold', color: '#2c5aa0' }}>
              ${parseFloat(product.price).toFixed(2)}
            </p>
            <button onClick={() => addToCart(product)} style={{ marginTop: '10px' }}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <ShoppingCart cartItems={cart} onCheckout={handleCheckout} />
    </div>
  )
}

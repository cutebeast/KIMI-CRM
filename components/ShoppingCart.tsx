'use client'

interface CartItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface ShoppingCartProps {
  cartItems: CartItem[]
  onCheckout: () => void
}

export default function ShoppingCart({ cartItems, onCheckout }: ShoppingCartProps) {
  const total = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} - {item.quantity} x ${Number(item.price).toFixed(2)}
              </li>
            ))}
          </ul>
          <p>Total: ${total.toFixed(2)}</p>
          <button onClick={onCheckout}>Checkout</button>
        </div>
      )}
    </div>
  )
}

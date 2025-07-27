export interface Product {
  id: string
  name: string
  price: string
}

export interface CartItem extends Product {
  quantity: number
}

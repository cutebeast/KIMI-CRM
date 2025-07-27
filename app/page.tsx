import { getProducts } from '@/lib/data'

export default async function HomePage() {
  try {
    const products = await getProducts()
    
    if (!Array.isArray(products) || products.length === 0) {
      return (
        <div>
          <h1>Our Products</h1>
          <p>No products available</p>
        </div>
      )
    }

    const productsWithStringPrices = products.map(product => ({
      ...product,
      price: product.price.toString()
    }))

    return (
      <div>
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
            </div>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return (
      <div>
        <h1>Our Products</h1>
        <p>Error loading products: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    )
  }
}

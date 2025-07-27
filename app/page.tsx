export default async function HomePage() {
  const response = await fetch('/api/products', { cache: 'no-store' });
  const products = await response.json();

  return (
    <div>
      <h1>Our Products</h1>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center'
      }}>
        {products.map((product: any) => (
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
  );
}

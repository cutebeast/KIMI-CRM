export default async function HomePage() {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' });
    
    if (!response.ok) {
      console.error(`API call failed: ${response.status} ${response.statusText}`);
      return (
        <div>
          <h1>Our Products</h1>
          <p>Error loading products: {response.statusText}</p>
        </div>
      );
    }
    
    const products = await response.json();
    
    if (!Array.isArray(products)) {
      console.error('Invalid response format:', products);
      return (
        <div>
          <h1>Our Products</h1>
          <p>No products available</p>
        </div>
      );
    }

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
  } catch (error) {
    console.error('Error fetching products:', error);
    return (
      <div>
        <h1>Our Products</h1>
        <p>Error loading products: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}

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

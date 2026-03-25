export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Cab Booking Backend API</h1>
        <p>Backend service is running successfully!</p>
        <p>API endpoints available at /api/*</p>
      </div>
    </div>
  )
}
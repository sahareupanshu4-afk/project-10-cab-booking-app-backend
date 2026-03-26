import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cab Booking Backend API',
  description: 'Backend API service for Cab Booking App',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

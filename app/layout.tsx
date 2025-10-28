import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/cart-provider'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Azure Horizon - A peaceful place to escape stress.',
  description: 'Discover harmony and elegance at Azure Horizon. From peaceful retreats surrounded by nature to indulgent luxury experiences, every moment is designed to refresh your soul.',
  generator: 'v0.app',
  icons: {
    icon: '/favicon.ico',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <CartProvider>
            <main className="min-h-screen bg-background font-sans antialiased">
              {children}
            </main>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

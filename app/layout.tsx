import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sales & Inventory Analytics Dashboard',
  description: 'Professional analytics platform for sales performance and inventory management - Built by Afaq Ahmad',
  generator: 'Analytics Dashboard',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950">
        {children}
      </body>
    </html>
  )
}

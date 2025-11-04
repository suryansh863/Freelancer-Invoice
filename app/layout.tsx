import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Freelance Invoice Tracker - Built for Indian Freelancers',
  description: 'Simple, compliant invoicing & effortless payments. GST-compliant invoices, automatic TDS calculations, and UPI payment links for Indian freelancers.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
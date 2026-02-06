// Root layout with providers

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReMake - Entrepreneur Social Platform',
  description: 'Connect with founders, find mentors, and discover opportunities in the entrepreneurial community.',
  keywords: ['entrepreneurship', 'startups', 'mentorship', 'networking', 'founders'],
  authors: [{ name: 'ReMake Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
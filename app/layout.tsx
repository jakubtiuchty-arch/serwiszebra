import { Inter } from 'next/font/google'
import './globals.css'
import { metadata as seoMetadata, viewport as seoViewport } from './metadata'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = seoMetadata
export const viewport = seoViewport

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className={inter.className}>
      <head>
        {/* Preload critical fonts and images */}
        <link
          rel="preload"
          as="image"
          href="/takma_logo_1.png"
          fetchPriority="high"
        />
      </head>
      <body className="antialiased">
        {/* Skip link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none"
        >
          Przejdź do treści
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
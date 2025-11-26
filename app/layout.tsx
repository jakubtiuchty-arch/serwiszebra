import { Inter } from 'next/font/google'
import './globals.css'
import { metadata as seoMetadata } from './metadata'
import { Analytics } from '@vercel/analytics/react'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = seoMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className={inter.className}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
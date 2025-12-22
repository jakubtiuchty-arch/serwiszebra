import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { metadata as seoMetadata, viewport as seoViewport } from './metadata'
import { Analytics } from '@vercel/analytics/next'

const GA_MEASUREMENT_ID = 'G-JVWERC1N4J'

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
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Preload critical fonts and images */}
        <link
          rel="preload"
          as="image"
          href="/takma_logo_1.png"
          fetchPriority="high"
        />
      </head>
      <body className="antialiased">
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        
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
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Serwis Zebra - Profesjonalny serwis drukarek i terminali',
  description: 'Asystent AI pomoże Ci zdiagnozować problem z urządzeniem Zebra w sekundach. Certyfikowany serwis, 15+ lat doświadczenia.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl" className={inter.className}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
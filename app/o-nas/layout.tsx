import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'O nas | TAKMA - Serwis Zebra | 25 lat doświadczenia',
  description: 'Poznaj firmę TAKMA - od 25 lat dostarczamy i serwisujemy urządzenia AutoID. Od Psion, przez Symbol i Motorolę, aż po Zebra. Autoryzowane centrum serwisowe Zebra.',
  keywords: ['TAKMA', 'serwis Zebra', 'autoryzowany serwis', 'historia firmy', 'AutoID', '25 lat doświadczenia'],
  openGraph: {
    title: 'O nas | TAKMA - Serwis Zebra',
    description: 'Od 25 lat na rynku. Dziesiątki tysięcy urządzeń. Autoryzowane centrum serwisowe Zebra od 2023.',
    type: 'website',
  }
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}




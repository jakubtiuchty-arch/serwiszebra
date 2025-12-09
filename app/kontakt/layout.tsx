import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt | TAKMA - Serwis Zebra',
  description: 'Skontaktuj się z nami. TAKMA - autoryzowany serwis Zebra. Adres, telefon, email, godziny otwarcia. Serwis drukarek etykiet i terminali Zebra.',
  keywords: ['kontakt', 'TAKMA', 'serwis Zebra', 'adres', 'telefon', 'email', 'godziny otwarcia'],
  openGraph: {
    title: 'Kontakt | TAKMA - Serwis Zebra',
    description: 'Skontaktuj się z autoryzowanym serwisem Zebra. Telefon, email, adres siedziby.',
    type: 'website',
  }
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}



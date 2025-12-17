import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Polityka Prywatności | Serwis Zebra - TAKMA',
  description: 'Polityka prywatności serwisu serwiszebra.pl. Informacje o przetwarzaniu danych osobowych, RODO, cookies i prawach użytkownika.',
  openGraph: {
    title: 'Polityka Prywatności | Serwis Zebra',
    description: 'Polityka prywatności serwisu serwiszebra.pl. Przetwarzanie danych zgodne z RODO.',
  },
}

export default function PolitykaPrywatnosciLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}








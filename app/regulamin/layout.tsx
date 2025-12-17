import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Regulamin serwisu | Serwis Zebra - TAKMA',
  description: 'Regulamin świadczenia usług serwisowych przez autoryzowany serwis Zebra - TAKMA. Zasady naprawy, gwarancja, płatności, transport.',
  openGraph: {
    title: 'Regulamin serwisu | Serwis Zebra',
    description: 'Regulamin świadczenia usług serwisowych przez autoryzowany serwis Zebra - TAKMA.',
  },
}

export default function RegulaminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}








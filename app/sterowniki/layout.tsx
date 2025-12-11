import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sterowniki drukarek Zebra dla Windows | Pobierz ZDesigner Driver',
  description: 'Pobierz oficjalny sterownik ZDesigner do drukarek etykiet Zebra. Obsługuje Windows 10, 11 i Server. Ponad 120 modeli: ZD420, ZD620, ZT410, ZQ520 i więcej. Instrukcja instalacji.',
  keywords: [
    'sterownik zebra',
    'driver zebra windows',
    'zdesigner driver',
    'sterownik zd420',
    'sterownik zd620',
    'sterownik zt410',
    'zebra printer driver',
    'sterownik drukarki zebra windows 11',
    'jak zainstalować drukarkę zebra',
    'pobierz sterownik zebra'
  ],
  openGraph: {
    title: 'Sterowniki drukarek Zebra dla Windows | Pobierz ZDesigner Driver',
    description: 'Pobierz oficjalny sterownik ZDesigner do drukarek etykiet Zebra. Obsługuje Windows 10, 11 i Server.',
    type: 'website',
  }
}

export default function DriversLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}


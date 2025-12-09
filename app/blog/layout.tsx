import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Poradniki i aktualności | Serwis Zebra',
  description: 'Praktyczne poradniki o drukarkach etykiet, terminalach i skanerach Zebra. Troubleshooting, konserwacja, porównania modeli. Wiedza od certyfikowanych techników.',
  keywords: [
    'blog zebra',
    'poradniki zebra',
    'drukarka zebra poradnik',
    'naprawa drukarki zebra',
    'troubleshooting zebra',
    'serwis zebra blog'
  ],
  openGraph: {
    title: 'Blog - Poradniki i aktualności | Serwis Zebra',
    description: 'Praktyczne poradniki o drukarkach etykiet, terminalach i skanerach Zebra. Wiedza od certyfikowanych techników.',
    type: 'website',
    url: 'https://serwiszebra.pl/blog',
    siteName: 'Serwis Zebra',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Poradniki i aktualności | Serwis Zebra',
    description: 'Praktyczne poradniki o drukarkach etykiet, terminalach i skanerach Zebra.',
  },
  alternates: {
    canonical: 'https://serwiszebra.pl/blog'
  }
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}




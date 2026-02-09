/** @type {import('next').NextConfig} */
const nextConfig = {
  // Zwiększony timeout dla dużych stron (default: 60s)
  staticPageGenerationTimeout: 180,
  
  // Redirecty 301 dla zmienionych URL-i
  async redirects() {
    return [
      {
        source: '/blog/zebra-tc501-tc701-terminal-mobilny-ai-premiera-2026',
        destination: '/blog/zebra-tc501-tc701-specyfikacja-cena-premiera',
        permanent: true, // 301 redirect
      },
      {
        source: '/drukarki',
        destination: '/serwis-drukarek-zebra',
        permanent: true, // 301 redirect
      },
      {
        source: '/terminale',
        destination: '/serwis-terminali-zebra',
        permanent: true, // 301 redirect
      },
      {
        source: '/skanery',
        destination: '/serwis-skanerow-zebra',
        permanent: true, // 301 redirect
      },
      {
        source: '/tablety',
        destination: '/serwis-tabletow-zebra',
        permanent: true, // 301 redirect
      },
    ]
  },
  
  images: {
    // Formaty z lepszą kompresją
    formats: ['image/avif', 'image/webp'],
    // Rozmiary dla responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimalizuj czas ładowania
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 dni cache
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'iivrcn6hzy1qdquuhksu.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'fivrcnshzylqdquuhkeu.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.worldvectorlogo.com',
      },
      {
        protocol: 'https',
        hostname: 'static.przelewy24.pl',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
}

module.exports = nextConfig
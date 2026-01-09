/** @type {import('next').NextConfig} */
const nextConfig = {
  // Zwiększony timeout dla dużych stron (default: 60s)
  staticPageGenerationTimeout: 180,
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
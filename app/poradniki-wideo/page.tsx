'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import { 
  Play, 
  Clock, 
  Eye, 
  Filter,
  Printer,
  Smartphone,
  ScanBarcode,
  Search,
  ChevronRight,
  PlayCircle,
  X
} from 'lucide-react'

type VideoCategory = 'wszystkie' | 'drukarki' | 'terminale' | 'skanery'

interface Video {
  id: string
  title: string
  description: string
  youtubeId: string
  thumbnail: string
  duration: string
  category: VideoCategory
  tags: string[]
  featured?: boolean
}

// Filmy poradnikowe - prawdziwe materiały serwisowe
const videos: Video[] = [
  {
    id: '1',
    title: 'Jak używać odklejaka etykiet w Zebra ZD220 / ZD230',
    description: 'Poradnik pokazujący jak prawidłowo używać odklejaka etykiet (label dispenser / peel-off) w drukarkach Zebra ZD220 i ZD230. Konfiguracja i użycie krok po kroku.',
    youtubeId: 'qrMRD7N49fY',
    thumbnail: '/zd220_zd230_odlejak_yt.jpeg',
    duration: '2:30',
    category: 'drukarki',
    tags: ['ZD220', 'ZD230', 'odklejak', 'label dispenser', 'peel-off'],
    featured: true
  },
  {
    id: '2',
    title: 'Przyciski, porty i złącza w Zebra ZD220 / ZD230',
    description: 'Omówienie przycisków, portów komunikacyjnych (USB, Ethernet, Serial) oraz gniazda zasilania w drukarkach ZD220 i ZD230.',
    youtubeId: '6Pbi_A8fAnU',
    thumbnail: '/Funkcje drukarki - jak rozpoznać funkcje i możliwości urządzenia Zebra ZD220_ZD230d.jpeg',
    duration: '3:00',
    category: 'drukarki',
    tags: ['ZD220', 'ZD230', 'przyciski', 'porty', 'USB', 'zasilanie'],
  },
  {
    id: '9',
    title: 'Porty i złącza w Zebra ZD421t',
    description: 'Omówienie portów komunikacyjnych w drukarce termotransferowej Zebra ZD421t: USB Host, USB Device, Ethernet, Serial. Podłączenie i konfiguracja.',
    youtubeId: 'LCzG5DxX9Nk',
    thumbnail: '/zd421t_porty.jpeg',
    duration: '4:15',
    category: 'drukarki',
    tags: ['ZD421t', 'porty', 'USB', 'Ethernet', 'Serial', 'złącza'],
  },
  {
    id: '10',
    title: 'Self-test w Zebra ZD421d / ZD421t - wydruk konfiguracji',
    description: 'Jak wykonać self-test (wydruk testowy) w drukarkach Zebra ZD421d i ZD421t. Sprawdź konfigurację, ustawienia i stan drukarki jednym przyciskiem.',
    youtubeId: '5NEmpFMtZx8',
    thumbnail: '/seltest_zd421d_t.jpeg',
    duration: '2:45',
    category: 'drukarki',
    tags: ['ZD421d', 'ZD421t', 'self-test', 'konfiguracja', 'wydruk testowy'],
  },
  {
    id: '11',
    title: 'Kalibracja czujnika mediów w Zebra ZD220 / ZD230',
    description: 'Jak przeprowadzić kalibrację czujnika etykiet w drukarkach Zebra ZD220 i ZD230. Rozwiązanie problemów z wykrywaniem etykiet i pustymi wydrukami.',
    youtubeId: 'l03OFhvhWxY',
    thumbnail: '/kalibracja_zd220_zd230.jpeg',
    duration: '3:30',
    category: 'drukarki',
    tags: ['ZD220', 'ZD230', 'kalibracja', 'czujnik mediów', 'etykiety'],
  },
  {
    id: '12',
    title: 'Konfiguracja sieci LAN w drukarkach Zebra',
    description: 'Jak skonfigurować połączenie sieciowe Ethernet (LAN) w drukarkach Zebra. Ustawienia IP, DHCP, maska podsieci i brama domyślna.',
    youtubeId: 'PwC9AJpV-l0',
    thumbnail: '/lan_all.jpeg',
    duration: '5:00',
    category: 'drukarki',
    tags: ['LAN', 'Ethernet', 'sieć', 'IP', 'DHCP', 'konfiguracja'],
  },
  {
    id: '13',
    title: 'Blady wydruk w Zebra ZD421t - jak rozwiązać problem',
    description: 'Rozwiązanie problemu zbyt jasnego, bladego wydruku w drukarce termotransferowej ZD421t. Ustawienia ciemności, prędkości i czyszczenie głowicy.',
    youtubeId: 'mtawoQxhYmU',
    thumbnail: '/blady_wydruk_zd421t.jpeg',
    duration: '4:00',
    category: 'drukarki',
    tags: ['ZD421t', 'blady wydruk', 'jakość druku', 'ciemność', 'darkness'],
  },
  {
    id: '14',
    title: 'Montaż modułu Ethernet w drukarkach Zebra',
    description: 'Jak zamontować moduł sieciowy Ethernet w drukarkach Zebra. Instalacja krok po kroku, podłączenie i konfiguracja połączenia LAN.',
    youtubeId: 'd-CNBSrBzGQ',
    thumbnail: '/motaż_eth.jpeg',
    duration: '6:00',
    category: 'drukarki',
    tags: ['Ethernet', 'montaż', 'moduł sieciowy', 'LAN', 'instalacja'],
  },
  {
    id: '15',
    title: 'Konfiguracja WiFi w Zebra ZD421',
    description: 'Jak skonfigurować połączenie bezprzewodowe WiFi w drukarce Zebra ZD421. Połączenie z siecią WLAN, ustawienia SSID i hasła.',
    youtubeId: 'lF-pJbhYeVM',
    thumbnail: '/wifi_zd421.jpeg',
    duration: '5:30',
    category: 'drukarki',
    tags: ['ZD421', 'WiFi', 'WLAN', 'bezprzewodowe', 'konfiguracja sieci'],
  },
  {
    id: '3',
    title: 'Kalibracja drukarki Zebra ZD420 - krok po kroku',
    description: 'Kompletny poradnik kalibracji czujnika mediów w drukarce ZD420. Rozwiązanie problemu pustych etykiet.',
    youtubeId: 'dQw4w9WgXcQ', // placeholder - zamień na prawdziwe ID
    thumbnail: '/video-thumb-placeholder.jpg',
    duration: '5:32',
    category: 'drukarki',
    tags: ['ZD420', 'kalibracja', 'czujnik mediów'],
  },
  {
    id: '4',
    title: 'Wymiana głowicy drukującej w Zebra ZT410',
    description: 'Jak bezpiecznie wymienić głowicę drukującą w drukarce przemysłowej ZT410.',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: '/video-thumb-placeholder.jpg',
    duration: '8:15',
    category: 'drukarki',
    tags: ['ZT410', 'głowica', 'wymiana']
  },
  {
    id: '5',
    title: 'Reset fabryczny terminala Zebra TC52',
    description: 'Jak przywrócić ustawienia fabryczne w terminalu TC52. Enterprise Reset vs Factory Reset.',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: '/video-thumb-placeholder.jpg',
    duration: '4:20',
    category: 'terminale',
    tags: ['TC52', 'reset', 'factory reset']
  },
  {
    id: '6',
    title: 'Konfiguracja DataWedge - podstawy',
    description: 'Wprowadzenie do DataWedge - jak skonfigurować skanowanie kodów w terminalach Zebra.',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: '/video-thumb-placeholder.jpg',
    duration: '12:45',
    category: 'terminale',
    tags: ['DataWedge', 'konfiguracja', 'skanowanie'],
  },
  {
    id: '7',
    title: 'Parowanie skanera DS2278 ze stacją',
    description: 'Jak sparować skaner bezprzewodowy DS2278 z cradle\'em. Rozwiązywanie problemów z połączeniem.',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: '/video-thumb-placeholder.jpg',
    duration: '3:55',
    category: 'skanery',
    tags: ['DS2278', 'parowanie', 'Bluetooth']
  },
  {
    id: '8',
    title: 'Czyszczenie głowicy drukującej',
    description: 'Prawidłowe czyszczenie głowicy drukującej - przedłuż żywotność drukarki Zebra.',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnail: '/video-thumb-placeholder.jpg',
    duration: '6:10',
    category: 'drukarki',
    tags: ['czyszczenie', 'konserwacja', 'głowica']
  },
]

const categories = [
  { id: 'wszystkie' as VideoCategory, label: 'Wszystkie', icon: Filter, count: videos.length },
  { id: 'drukarki' as VideoCategory, label: 'Drukarki', icon: Printer, count: videos.filter(v => v.category === 'drukarki').length },
  { id: 'terminale' as VideoCategory, label: 'Terminale', icon: Smartphone, count: videos.filter(v => v.category === 'terminale').length },
  { id: 'skanery' as VideoCategory, label: 'Skanery', icon: ScanBarcode, count: videos.filter(v => v.category === 'skanery').length },
]

// Modal do odtwarzania video
function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-5xl" onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors flex items-center gap-2 text-sm"
        >
          Zamknij <X className="w-5 h-5" />
        </button>
        
        {/* Video player */}
        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        
        {/* Video info */}
        <div className="mt-4 text-white">
          <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
          <p className="text-white/70 text-sm">{video.description}</p>
        </div>
      </div>
    </div>
  )
}

// Karta video
function VideoCard({ video, onClick, featured = false }: { video: Video; onClick: () => void; featured?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 text-left ${
        featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      {/* Thumbnail */}
      <div className={`relative bg-gradient-to-br from-slate-800 to-slate-900 ${featured ? 'aspect-video' : 'aspect-video'}`}>
        {/* Thumbnail image */}
        {video.thumbnail && !video.thumbnail.includes('placeholder') ? (
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20" />
        )}
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/95 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
            <Play className="w-7 h-7 md:w-8 md:h-8 text-gray-900 ml-1" fill="currentColor" />
          </div>
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded-md flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {video.duration}
        </div>
        
        {/* Category badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 text-gray-900 text-xs font-medium rounded-full capitalize">
          {video.category}
        </div>
        
        {/* Featured badge */}
        {featured && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
            ⭐ Polecane
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      
      {/* Content */}
      <div className="p-4 md:p-5">
        <h3 className={`font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 ${
          featured ? 'text-lg md:text-xl' : 'text-base'
        }`}>
          {video.title}
        </h3>
        <p className={`text-gray-600 line-clamp-2 ${featured ? 'text-sm md:text-base' : 'text-sm'}`}>
          {video.description}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {video.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}

export default function VideoTutorialsPage() {
  const [activeCategory, setActiveCategory] = useState<VideoCategory>('wszystkie')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  const filteredVideos = videos.filter(video => {
    const matchesCategory = activeCategory === 'wszystkie' || video.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredVideos = filteredVideos.filter(v => v.featured)
  const regularVideos = filteredVideos.filter(v => !v.featured)

  return (
    <>
      {/* Schema.org VideoObject */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: videos.map((video, idx) => ({
              '@type': 'VideoObject',
              position: idx + 1,
              name: video.title,
              description: video.description,
              thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
              uploadDate: '2025-01-01',
              duration: `PT${video.duration.replace(':', 'M')}S`,
              embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
              publisher: {
                '@type': 'Organization',
                name: 'TAKMA - Serwis Zebra',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://www.serwis-zebry.pl/takma_logo_1.png'
                }
              }
            }))
          })
        }}
      />

      <div className="min-h-screen bg-white">
        <Header currentPage="other" />

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">Strona główna</Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">Poradniki wideo</span>
            </nav>
          </div>
        </div>

        {/* Hero - WOW effect */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 sm:py-20 md:py-28 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating video icons */}
            <div className="absolute top-20 left-[10%] w-20 h-20 bg-blue-500/10 rounded-2xl rotate-12 animate-pulse" />
            <div className="absolute top-40 right-[15%] w-16 h-16 bg-indigo-500/10 rounded-xl -rotate-12 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-20 left-[20%] w-24 h-24 bg-purple-500/10 rounded-2xl rotate-6 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-32 right-[25%] w-14 h-14 bg-blue-500/10 rounded-lg -rotate-6 animate-pulse" style={{ animationDelay: '1.5s' }} />
            
            {/* Gradient orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
            
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
              <PlayCircle className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white/90">Poradniki video</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Naucz się sam,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                napraw szybciej
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Poradniki video od autoryzowanego serwisu Zebra. Kalibracja, konfiguracja, 
              rozwiązywanie problemów - wszystko krok po kroku.
            </p>

            {/* Search bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Szukaj poradnika... (np. kalibracja ZD420)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white">{videos.length}</div>
                <div className="text-sm text-slate-400">Poradników</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white">3</div>
                <div className="text-sm text-slate-400">Kategorie</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white">∞</div>
                <div className="text-sm text-slate-400">Darmowe</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories filter */}
        <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 py-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gray-900 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20' : 'bg-gray-200'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Videos grid */}
        <section className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredVideos.length === 0 ? (
              <div className="text-center py-16">
                <PlayCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Brak wyników</h3>
                <p className="text-gray-500">Nie znaleziono poradników pasujących do wyszukiwania.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Featured videos first */}
                {featuredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    featured
                    onClick={() => setSelectedVideo(video)}
                  />
                ))}
                {/* Regular videos */}
                {regularVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onClick={() => setSelectedVideo(video)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
              Nie znalazłeś rozwiązania?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Skorzystaj z naszego ChatAI lub zgłoś urządzenie do autoryzowanego serwisu Zebra.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
              >
                Zapytaj ChatAI
              </Link>
              <Link
                href="/#formularz"
                className="px-6 py-3 bg-white text-gray-900 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Zgłoś naprawę
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-500 text-xs">
              © 2025 TAKMA - Serwis Zebra. Wszystkie prawa zastrzeżone.
            </p>
          </div>
        </footer>

        {/* Video Modal */}
        {selectedVideo && (
          <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
        )}
      </div>
    </>
  )
}


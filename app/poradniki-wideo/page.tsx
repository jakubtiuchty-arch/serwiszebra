'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import { 
  Play, 
  Clock, 
  Filter,
  Printer,
  Smartphone,
  ScanBarcode,
  Search,
  ChevronRight,
  PlayCircle,
  X,
  Tablet
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
    id: '23',
    title: 'Dyrektywa RED - co oznacza dla drukarek Zebra?',
    description: 'Wyjaśnienie europejskiej dyrektywy radiowej RED (Radio Equipment Directive) i jej wpływu na drukarki etykiet Zebra z modułami WiFi i Bluetooth. Certyfikacja CE, zgodność i wymogi prawne.',
    youtubeId: 'j0PRe-dGXBM',
    thumbnail: '/drukarki-zebra-dyrektywa-red.jpeg',
    duration: '5:00',
    category: 'drukarki',
    tags: ['RED', 'dyrektywa', 'certyfikacja', 'CE', 'WiFi', 'Bluetooth', 'regulacje'],
    featured: true
  },
  {
    id: '1',
    title: 'Jak używać odklejaka etykiet w Zebra ZD220 / ZD230',
    description: 'Poradnik pokazujący jak prawidłowo używać odklejaka etykiet (label dispenser / peel-off) w drukarkach Zebra ZD220 i ZD230. Konfiguracja i użycie krok po kroku.',
    youtubeId: 'qrMRD7N49fY',
    thumbnail: '/zd220_zd230_odlejak_yt.jpeg',
    duration: '2:30',
    category: 'drukarki',
    tags: ['ZD220', 'ZD230', 'odklejak', 'label dispenser', 'peel-off'],
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
    id: '16',
    title: 'Montaż odklejaka etykiet w Zebra ZD421',
    description: 'Jak zamontować moduł odklejaka etykiet (label dispenser / peel-off) w drukarce Zebra ZD421. Instalacja i konfiguracja krok po kroku.',
    youtubeId: 'hzBiOxz-QbI',
    thumbnail: '/montaż_odklejak_zd421.jpeg',
    duration: '4:30',
    category: 'drukarki',
    tags: ['ZD421', 'odklejak', 'label dispenser', 'peel-off', 'montaż'],
  },
  {
    id: '17',
    title: 'Wymiana głowicy drukującej w Zebra ZD421',
    description: 'Jak wymienić głowicę drukującą w drukarce Zebra ZD421. Instrukcja krok po kroku demontażu starej i montażu nowej głowicy termicznej.',
    youtubeId: 'Q3Mt2LUwm6g',
    thumbnail: '/wymiana_głowicy_zd421.jpeg',
    duration: '5:00',
    category: 'drukarki',
    tags: ['ZD421', 'głowica', 'wymiana głowicy', 'printhead', 'naprawa'],
  },
  {
    id: '18',
    title: 'Używanie noża (cuttera) w drukarkach Zebra',
    description: 'Jak prawidłowo używać wbudowanego noża do cięcia etykiet w drukarkach Zebra. Konfiguracja trybu cięcia, konserwacja i rozwiązywanie problemów.',
    youtubeId: 'tSKUHfDkaZU',
    thumbnail: '/używanie_noża.jpeg',
    duration: '4:30',
    category: 'drukarki',
    tags: ['cutter', 'nóż', 'cięcie etykiet', 'konfiguracja', 'konserwacja'],
  },
  {
    id: '19',
    title: 'Wymiana wałka dociskowego w drukarkach Zebra ZD',
    description: 'Instrukcja wymiany wałka dociskowego (platen roller) w drukarkach Zebra serii ZD. Krok po kroku jak bezpiecznie wymienić wałek i przywrócić jakość wydruku.',
    youtubeId: 'jphduV-XSOg',
    thumbnail: '/wymiana_wałka_zd.jpeg',
    duration: '5:00',
    category: 'drukarki',
    tags: ['ZD', 'wałek dociskowy', 'platen roller', 'wymiana', 'jakość wydruku', 'naprawa'],
  },
  {
    id: '20',
    title: 'Zakładanie etykiet w Zebra ZD220d / ZD230d',
    description: 'Jak prawidłowo założyć rolkę etykiet w drukarkach Zebra ZD220d i ZD230d. Instrukcja krok po kroku - prowadzenie taśmy, ustawienie prowadnic i zamknięcie pokrywy.',
    youtubeId: 'xhtuxOwwOyY',
    thumbnail: '/zakładanie_etykiet_zd220d_zd230d.jpeg',
    duration: '3:00',
    category: 'drukarki',
    tags: ['ZD220d', 'ZD230d', 'zakładanie etykiet', 'media loading', 'rolka etykiet'],
  },
  {
    id: '21',
    title: 'Zakładanie taśmy transferowej w Zebra ZD421t',
    description: 'Jak prawidłowo założyć taśmę transferową (ribbon) w drukarce termotransferowej Zebra ZD421t. Instrukcja krok po kroku - prowadzenie taśmy, nawijanie i konfiguracja.',
    youtubeId: '0cU4YJuI00c',
    thumbnail: '/zakładanie_taśmy_zd421t.jpeg',
    duration: '4:00',
    category: 'drukarki',
    tags: ['ZD421t', 'taśma transferowa', 'ribbon', 'termotransfer', 'zakładanie taśmy'],
  },
  {
    id: '22',
    title: 'Zakładanie etykiet w Zebra ZD421t',
    description: 'Jak prawidłowo założyć rolkę etykiet w drukarce termotransferowej Zebra ZD421t. Instrukcja krok po kroku - prowadzenie etykiet przez prowadnice, ustawienie czujnika i zamknięcie pokrywy.',
    youtubeId: '-VtXee8Cn3k',
    thumbnail: '/jak-zalozyc-etykiety-do-drukarki-zebra-zd421t.jpeg',
    duration: '3:30',
    category: 'drukarki',
    tags: ['ZD421t', 'zakładanie etykiet', 'media loading', 'rolka etykiet', 'termotransfer'],
  },
]

const categories = [
  { id: 'wszystkie' as VideoCategory, label: 'Wszystkie', shortLabel: 'Wszystkie', icon: Filter, count: videos.length },
  { id: 'drukarki' as VideoCategory, label: 'Drukarki', shortLabel: 'Drukarki', icon: Printer, count: videos.filter(v => v.category === 'drukarki').length },
  { id: 'terminale' as VideoCategory, label: 'Terminale', shortLabel: 'Terminale', icon: Smartphone, count: videos.filter(v => v.category === 'terminale').length },
  { id: 'skanery' as VideoCategory, label: 'Skanery', shortLabel: 'Skanery', icon: ScanBarcode, count: videos.filter(v => v.category === 'skanery').length },
]

// Modal do odtwarzania video - zoptymalizowany dla mobile
function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div className="relative w-full h-full md:h-auto md:max-w-4xl md:p-4" onClick={e => e.stopPropagation()}>
        {/* Close button - większy na mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white/90 hover:text-white hover:bg-black/70 transition-all"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Video player - pełna szerokość na mobile */}
        <div className="relative w-full h-full md:h-auto md:aspect-video bg-black md:rounded-2xl overflow-hidden flex items-center">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&playsinline=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full md:rounded-2xl"
          />
        </div>
        
        {/* Video info - ukryte na mobile w trybie pełnoekranowym */}
        <div className="hidden md:block mt-4 text-white px-2">
          <h3 className="text-lg font-semibold mb-1">{video.title}</h3>
          <p className="text-white/60 text-sm line-clamp-2">{video.description}</p>
        </div>
      </div>
    </div>
  )
}

// Karta video - kompaktowa na mobile
function VideoCard({ video, onClick, featured = false }: { video: Video; onClick: () => void; featured?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 text-left active:scale-[0.98] ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      {/* Thumbnail */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 aspect-video">
        {/* Thumbnail image - zoptymalizowane z Next.js Image */}
        {video.thumbnail && !video.thumbnail.includes('placeholder') ? (
          <Image 
            src={video.thumbnail} 
            alt={video.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            loading="lazy"
            quality={75}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20" />
        )}
        
        {/* Play button overlay - mniejszy na mobile */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/95 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-900 ml-0.5" fill="currentColor" />
          </div>
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-[10px] sm:text-xs font-medium rounded flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          {video.duration}
        </div>
        
        {/* Featured badge */}
        {featured && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] sm:text-xs font-bold rounded-full">
            ⭐ Polecane
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      
      {/* Content - kompaktowy na mobile */}
      <div className="p-3 sm:p-4">
        <h3 className={`font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm sm:text-base ${
          featured ? 'md:text-lg' : ''
        }`}>
          {video.title}
        </h3>
        
        {/* Opis - ukryty na mobile */}
        <p className="hidden sm:block text-gray-500 text-xs sm:text-sm line-clamp-2 mt-1">
          {video.description}
        </p>
        
        {/* Tags - mniej tagów na mobile */}
        <div className="flex flex-wrap gap-1 mt-2">
          {video.tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] sm:text-xs rounded">
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
            name: 'Poradniki wideo Zebra - Kalibracja, konfiguracja, naprawa',
            description: 'Darmowe poradniki wideo do drukarek Zebra od autoryzowanego serwisu',
            numberOfItems: videos.length,
            itemListElement: videos.map((video, idx) => ({
              '@type': 'VideoObject',
              position: idx + 1,
              name: video.title,
              description: video.description,
              thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
              uploadDate: '2025-01-01',
              duration: `PT${video.duration.replace(':', 'M')}S`,
              contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
              embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
              publisher: {
                '@type': 'Organization',
                name: 'TAKMA - Serwis Zebra',
                url: 'https://www.serwis-zebry.pl',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://www.serwis-zebry.pl/takma_logo_1.png'
                }
              }
            }))
          })
        }}
      />
      
      {/* Schema.org FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Jak skalibrować drukarkę Zebra ZD220 / ZD230?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Aby skalibrować drukarkę Zebra ZD220 lub ZD230, wyłącz drukarkę, przytrzymaj przycisk Feed i włącz zasilanie. Trzymaj przycisk aż dioda mignie 2 razy, następnie puść. Drukarka automatycznie wykryje etykiety i przeprowadzi kalibrację.'
                }
              },
              {
                '@type': 'Question',
                name: 'Dlaczego drukarka Zebra drukuje blado?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Blady wydruk może być spowodowany: zbyt niskim ustawieniem ciemności (darkness), za szybką prędkością druku, zużytą głowicą drukującą lub nieodpowiednimi etykietami. Zwiększ wartość darkness lub wyczyść głowicę alkoholem izopropylowym.'
                }
              },
              {
                '@type': 'Question',
                name: 'Jak zrobić reset fabryczny terminala Zebra TC52?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'W terminalu TC52 dostępne są dwa rodzaje resetów: Enterprise Reset (zachowuje dane firmowe) i Factory Reset (usuwa wszystko). Aby wykonać reset, wejdź w Ustawienia → System → Opcje resetowania lub użyj kombinacji przycisków podczas uruchamiania urządzenia.'
                }
              },
              {
                '@type': 'Question',
                name: 'Jak skonfigurować DataWedge w terminalach Zebra?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'DataWedge to aplikacja Zebra do konfiguracji skanowania kodów. Otwórz aplikację DataWedge, utwórz nowy profil, przypisz go do swojej aplikacji i skonfiguruj format wyjściowy (Keyboard, Intent, IP). Możesz też ustawić prefiksy, sufiksy i typ kodów do skanowania.'
                }
              },
              {
                '@type': 'Question',
                name: 'Jak sparować skaner Bluetooth Zebra z cradle\'em?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Aby sparować skaner bezprzewodowy (np. DS2278, DS3678) ze stacją bazową, zeskanuj kod parowania znajdujący się na spodzie cradle\'a lub w instrukcji. Skaner potwierdzi połączenie sygnałem dźwiękowym. W razie problemów wykonaj reset skanera i powtórz procedurę.'
                }
              },
              {
                '@type': 'Question',
                name: 'Jak skonfigurować tablet Zebra ET40/ET45 do sieci WiFi?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Wejdź w Ustawienia → Sieć i internet → WiFi. Włącz WiFi i wybierz swoją sieć z listy. Wprowadź hasło i zapisz. Dla sieci firmowych (WPA2-Enterprise) może być wymagana konfiguracja certyfikatów lub integracja z MDM (Mobile Device Management).'
                }
              },
              {
                '@type': 'Question',
                name: 'Jak często wymieniać głowicę drukującą w drukarce Zebra?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Żywotność głowicy drukującej wynosi średnio 1-3 miliony cm wydruku. Regularne czyszczenie alkoholem izopropylowym przedłuża jej żywotność. Wymiana jest konieczna gdy pojawiają się białe pionowe linie lub trwałe smugi na wydruku.'
                }
              }
            ]
          })
        }}
      />
      
      {/* Schema.org BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Strona główna',
                item: 'https://www.serwis-zebry.pl'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Poradniki wideo',
                item: 'https://www.serwis-zebry.pl/poradniki-wideo'
              }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <Header currentPage="other" />

        {/* Breadcrumb - kompaktowy */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
              <Link href="/" className="hover:text-blue-600">Strona główna</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">Poradniki wideo</span>
            </nav>
          </div>
        </div>

        {/* Hero - kompaktowy na mobile */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 sm:py-12 md:py-16 overflow-hidden">
          {/* Background elements - ukryte na mobile */}
          <div className="hidden sm:block absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
            {/* Badge - mniejszy na mobile */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 sm:mb-6">
              <PlayCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
              <span className="text-xs sm:text-sm font-medium text-white/90">Poradniki video</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Naucz się sam,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                napraw szybciej
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2">
              Poradniki video od autoryzowanego serwisu Zebra. Kalibracja, konfiguracja, 
              rozwiązywanie problemów - krok po kroku.
            </p>

            {/* Search bar - pełna szerokość na mobile */}
            <div className="max-w-md mx-auto px-2">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Szukaj poradnika..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm sm:text-base placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Stats - kompaktowe na mobile */}
            <div className="flex justify-center gap-6 sm:gap-10 mt-6 sm:mt-10">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{videos.length}</div>
                <div className="text-[10px] sm:text-xs text-slate-400">Poradników</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">3</div>
                <div className="text-[10px] sm:text-xs text-slate-400">Kategorie</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">∞</div>
                <div className="text-[10px] sm:text-xs text-slate-400">Darmowe</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories filter - horizontal scroll na mobile */}
        <section className="sticky top-0 z-30 bg-white border-b border-gray-200 py-2.5 sm:py-3">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 sm:overflow-visible sm:justify-center scrollbar-hide">
              {categories.map((cat) => {
                const Icon = cat.icon
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                      isActive
                        ? 'bg-gray-900 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="sm:inline">{cat.shortLabel}</span>
                    <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full ${
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

        {/* Videos grid - 2 kolumny na mobile */}
        <section className="py-4 sm:py-8 md:py-12">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <PlayCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Brak wyników</h3>
                <p className="text-gray-500 text-sm">Nie znaleziono poradników pasujących do wyszukiwania.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
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

        {/* SEO Content Section */}
        <section className="py-8 sm:py-12 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
              Darmowe poradniki wideo do urządzeń Zebra
            </h2>
            
            <div className="prose prose-sm sm:prose max-w-none text-gray-600">
              <p className="mb-4">
                Nasze <strong>poradniki wideo</strong> to kompleksowe instrukcje obsługi i naprawy urządzeń Zebra - 
                <strong>drukarek etykiet, terminali mobilnych, skanerów kodów kreskowych i tabletów przemysłowych</strong>. 
                Materiały przygotowane przez <strong>autoryzowany serwis Zebra</strong> zawierają szczegółowe wyjaśnienia 
                krok po kroku, dzięki którym samodzielnie rozwiążesz najczęstsze problemy.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 my-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-base flex items-center gap-2">
                    <Printer className="w-4 h-4 text-blue-600" />
                    Drukarki etykiet
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Kalibracja czujnika mediów</strong> w ZD220, ZD230, ZD420, ZD421. Wymiana głowicy drukującej, 
                    konfiguracja WiFi i Ethernet, montaż odklejaka etykiet i cuttera. Rozwiązywanie problemów z wydrukiem.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-base flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    Terminale mobilne
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Konfiguracja DataWedge</strong> w TC52, TC72, TC21, MC3300. Reset fabryczny (Factory/Enterprise Reset), 
                    aktualizacja systemu Android, wymiana baterii i rozwiązywanie problemów z ekranem dotykowym.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-base flex items-center gap-2">
                    <ScanBarcode className="w-4 h-4 text-blue-600" />
                    Skanery kodów
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Parowanie skanerów Bluetooth</strong> DS2208, DS3678, DS8178, LI3678. Konfiguracja z cradle'em, 
                    programowanie kodami konfiguracyjnymi, reset skanera i rozwiązywanie problemów z połączeniem.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-base flex items-center gap-2">
                    <Tablet className="w-4 h-4 text-blue-600" />
                    Tablety przemysłowe
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Konfiguracja tabletów</strong> ET40, ET45, ET51, ET56, L10. Połączenie WiFi i GSM/LTE, 
                    stacje dokujące, zarządzanie MDM i rozwiązywanie problemów z ładowaniem i baterią.
                  </p>
                </div>
              </div>
              
              <p className="mb-4">
                Wszystkie poradniki są <strong>całkowicie darmowe</strong> i dostępne bez rejestracji. 
                Filmy dotyczą najpopularniejszych modeli: drukarki <strong>ZD220, ZD230, ZD421, ZT410</strong>, 
                terminale <strong>TC52, TC72, MC3300</strong>, skanery <strong>DS2208, DS3678</strong> 
                i tablety <strong>ET40, ET45</strong>. Regularnie dodajemy nowe materiały!
              </p>
              
              <p className="text-sm text-gray-500">
                Jeśli mimo obejrzenia poradnika problem nadal występuje, skorzystaj z naszego <Link href="/" className="text-blue-600 hover:underline">ChatAI do diagnostyki</Link> lub 
                zgłoś urządzenie do <Link href="/#formularz" className="text-blue-600 hover:underline">autoryzowanego serwisu gwarancyjnego Zebra</Link>. 
                Oferujemy naprawy z darmowym odbiorem kurierem z całej Polski.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SEO Section */}
        <section className="py-8 sm:py-12 bg-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
              Najczęściej zadawane pytania o urządzenia Zebra
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              {/* Drukarki */}
              <details className="bg-white rounded-xl p-4 border border-gray-200 group">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                  Jak skalibrować drukarkę Zebra ZD220 / ZD230?
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-gray-600">
                  Aby skalibrować drukarkę Zebra ZD220 lub ZD230, wyłącz drukarkę, przytrzymaj przycisk Feed i włącz zasilanie. 
                  Trzymaj przycisk aż dioda mignie 2 razy, następnie puść. Drukarka automatycznie wykryje etykiety i przeprowadzi kalibrację.
                </p>
              </details>
              
              <details className="bg-white rounded-xl p-4 border border-gray-200 group">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                  Dlaczego drukarka Zebra drukuje blado?
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-gray-600">
                  Blady wydruk może być spowodowany: zbyt niskim ustawieniem ciemności (darkness), 
                  za szybką prędkością druku, zużytą głowicą drukującą lub nieodpowiednimi etykietami. 
                  Zwiększ wartość darkness lub wyczyść głowicę alkoholem izopropylowym.
                </p>
              </details>
              
              {/* Terminale */}
              <details className="bg-white rounded-xl p-4 border border-gray-200 group">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                  Jak zrobić reset fabryczny terminala Zebra TC52?
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-gray-600">
                  W terminalu TC52 dostępne są dwa rodzaje resetów: Enterprise Reset (zachowuje dane firmowe) i Factory Reset (usuwa wszystko). 
                  Aby wykonać reset, wejdź w Ustawienia → System → Opcje resetowania lub użyj kombinacji przycisków podczas uruchamiania urządzenia.
                </p>
              </details>
              
              <details className="bg-white rounded-xl p-4 border border-gray-200 group">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                  Jak skonfigurować DataWedge w terminalach Zebra?
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-gray-600">
                  DataWedge to aplikacja Zebra do konfiguracji skanowania kodów. Otwórz aplikację DataWedge, utwórz nowy profil, 
                  przypisz go do swojej aplikacji i skonfiguruj format wyjściowy (Keyboard, Intent, IP). 
                  Możesz też ustawić prefiksy, sufiksy i typ kodów do skanowania.
                </p>
              </details>
              
              {/* Skanery */}
              <details className="bg-white rounded-xl p-4 border border-gray-200 group">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                  Jak sparować skaner Bluetooth Zebra z cradle'em?
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-gray-600">
                  Aby sparować skaner bezprzewodowy (np. DS2278, DS3678) ze stacją bazową, zeskanuj kod parowania znajdujący się 
                  na spodzie cradle'a lub w instrukcji. Skaner potwierdzi połączenie sygnałem dźwiękowym. 
                  W razie problemów wykonaj reset skanera i powtórz procedurę.
                </p>
              </details>
              
              {/* Tablety */}
              <details className="bg-white rounded-xl p-4 border border-gray-200 group">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                  Jak skonfigurować tablet Zebra ET40/ET45 do sieci WiFi?
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-gray-600">
                  Wejdź w Ustawienia → Sieć i internet → WiFi. Włącz WiFi i wybierz swoją sieć z listy. 
                  Wprowadź hasło i zapisz. Dla sieci firmowych (WPA2-Enterprise) może być wymagana konfiguracja certyfikatów 
                  lub integracja z MDM (Mobile Device Management).
                </p>
              </details>
              
              <details className="bg-white rounded-xl p-4 border border-gray-200 group">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                  Jak często wymieniać głowicę drukującą w drukarce Zebra?
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-gray-600">
                  Żywotność głowicy drukującej wynosi średnio 1-3 miliony cm wydruku. Regularne czyszczenie alkoholem izopropylowym 
                  przedłuża jej żywotność. Wymiana jest konieczna gdy pojawiają się białe pionowe linie lub trwałe smugi na wydruku.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA - kompaktowy na mobile */}
        <section className="py-8 sm:py-12 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
              Nie znalazłeś rozwiązania?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-xl mx-auto">
              Skorzystaj z ChatAI lub zgłoś urządzenie do autoryzowanego serwisu gwarancyjnego Zebra.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/"
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gray-900 text-white text-sm sm:text-base font-medium rounded-xl hover:bg-gray-800 transition-colors"
              >
                Zapytaj ChatAI
              </Link>
              <Link
                href="/#formularz"
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-gray-900 text-sm sm:text-base font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Zgłoś naprawę
              </Link>
            </div>
          </div>
        </section>

        {/* Footer - kompaktowy */}
        <footer className="bg-gray-900 text-white py-4 sm:py-6">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-500 text-[10px] sm:text-xs">
              © 2025-2026 TAKMA - Serwis Zebra. Wszystkie prawa zastrzeżone.
            </p>
          </div>
        </footer>

        {/* Video Modal */}
        {selectedVideo && (
          <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
        )}
      </div>

      {/* Custom scrollbar hide for mobile filters */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  )
}

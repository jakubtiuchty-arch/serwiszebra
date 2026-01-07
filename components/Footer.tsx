'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, Clock, Sparkles } from 'lucide-react'
import { trackPhoneClick, trackEmailClick, trackExternalLink } from '@/lib/analytics'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950"></div>
      
      {/* Floating orbs - subtle */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/[0.02] rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 right-20 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

      {/* Duży napis SERWIS ZEBRA w tle */}
      <div className="absolute left-0 right-0 bottom-0 flex items-end justify-center pointer-events-none" style={{ transform: 'translateY(20%)' }}>
        <h2 className="text-[4rem] sm:text-[7rem] md:text-[12rem] lg:text-[16rem] font-black tracking-tighter whitespace-nowrap leading-none bg-gradient-to-t from-white/[0.07] via-white/[0.02] to-transparent bg-clip-text text-transparent select-none">
          SERWIS ZEBRA
        </h2>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-white">
        {/* Top section with logo and CTA */}
        <div className="border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
              {/* Logo + certyfikaty */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="w-32 sm:w-40 h-12 sm:h-16 relative">
                  <Image 
                    src="/takma_logo_1.png" 
                    alt="TAKMA - Autoryzowany serwis Zebra" 
                    width={160}
                    height={64}
                    className="object-contain w-full h-full brightness-0 invert" 
                  />
                </div>
                <div className="hidden sm:block h-12 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                {/* Certyfikaty - na mobile pod logo, na sm+ obok */}
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-16 sm:w-20 h-12 sm:h-16 relative opacity-80 hover:opacity-100 transition-opacity">
                    <Image 
                      src="/premier-partner-1.png" 
                      alt="Zebra Premier Partner - Certyfikowany partner Zebra Technologies" 
                      width={80}
                      height={64}
                      className="object-contain w-full h-full" 
                    />
                  </div>
                  <div className="w-16 sm:w-20 h-12 sm:h-16 relative opacity-80 hover:opacity-100 transition-opacity">
                    <Image 
                      src="/repair_specialist.png" 
                      alt="Zebra Repair Specialist - Certyfikowany serwis napraw" 
                      width={80}
                      height={64}
                      className="object-contain w-full h-full" 
                    />
                  </div>
                </div>
              </div>
              {/* Przyciski kontaktowe */}
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
                <a href="tel:+48601619898" onClick={() => trackPhoneClick('footer')} className="group flex items-center gap-2 sm:gap-2.5 px-3 sm:px-5 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl transition-all duration-300">
                  <div className="w-7 sm:w-8 h-7 sm:h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium">+48 601 619 898</span>
                </a>
                <a href="mailto:serwis@takma.com.pl" onClick={() => trackEmailClick('footer')} className="group flex items-center gap-2 sm:gap-2.5 px-3 sm:px-5 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl transition-all duration-300">
                  <div className="w-7 sm:w-8 h-7 sm:h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium hidden sm:inline">serwis@takma.com.pl</span>
                  <span className="text-xs sm:text-sm font-medium sm:hidden">Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Links section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
            {/* Nawigacja */}
            <div className="text-center">
              <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3 sm:mb-5">Serwis</h4>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { href: '/', label: 'Strona główna' },
                  { href: '/drukarki', label: 'Serwis drukarek' },
                  { href: '/terminale', label: 'Serwis terminali' },
                  { href: '/skanery', label: 'Serwis skanerów' },
                  { href: '/tablety', label: 'Serwis tabletów' },
                  { href: '/instrukcje', label: 'Instrukcje' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Miasta */}
            <div className="text-center">
              <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3 sm:mb-5">Miasta</h4>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { href: '/serwis-zebra/warszawa', label: 'Warszawa' },
                  { href: '/serwis-zebra/krakow', label: 'Kraków' },
                  { href: '/serwis-zebra/wroclaw', label: 'Wrocław' },
                  { href: '/serwis-zebra/poznan', label: 'Poznań' },
                  { href: '/serwis-zebra/gdansk', label: 'Gdańsk' },
                  { href: '/serwis-zebra/katowice', label: 'Katowice' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Informacje */}
            <div className="text-center">
              <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3 sm:mb-5">Informacje</h4>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { href: '/blog', label: 'Blog' },
                  { href: '/sterowniki', label: 'Sterowniki' },
                  { href: '/faq', label: 'FAQ' },
                  { href: '/o-nas', label: 'O nas' },
                  { href: '/kontakt', label: 'Kontakt' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Godziny & AI */}
            <div className="text-center flex flex-col items-center">
              <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3 sm:mb-5">Dostępność</h4>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 sm:w-8 h-7 sm:h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm text-white font-medium">Pon - Pt</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">7:30 - 15:30</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 sm:w-8 h-7 sm:h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                    <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-400" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  </div>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm text-white font-medium">Chat AI</p>
                    <p className="text-[10px] sm:text-xs text-gray-400">Online 24/7</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Płatności */}
            <div className="text-center flex flex-col items-center">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 sm:mb-5">Płatności</h4>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                {[
                  { src: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg', alt: 'Stripe', w: 50, h: 20, cls: 'h-4 sm:h-5' },
                  { src: '/P24_logo.png', alt: 'Przelewy24', w: 70, h: 20, cls: 'h-4 sm:h-5' },
                  { src: '/blik_logo.png', alt: 'BLIK', w: 80, h: 32, cls: 'h-7 sm:h-9' },
                ].map((pay) => (
                  <Image 
                    key={pay.alt} 
                    src={pay.src} 
                    alt={pay.alt} 
                    width={pay.w} 
                    height={pay.h} 
                    className={`${pay.cls} w-auto object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-6">
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-6">
              
              {/* Lewa: Copyright */}
              <div className="md:flex-1 text-center md:text-left order-2 md:order-none">
                <p className="text-xs text-gray-500">
                  © 2025 <span className="text-gray-400">TAKMA</span> - Serwis Zebra.<br className="block sm:hidden" /> Wszystkie prawa zastrzeżone.
                </p>
              </div>

              {/* Środek: Linki (absolutnie wyśrodkowane na desktopie) */}
              <div className="flex items-center justify-center gap-6 sm:gap-8 text-xs text-gray-500 md:absolute md:left-1/2 md:-translate-x-1/2 order-3 md:order-none border-t md:border-t-0 border-white/5 pt-6 md:pt-0 w-full md:w-auto">
                <Link href="/regulamin" className="hover:text-white transition-colors">Regulamin</Link>
                <Link href="/polityka-prywatnosci" className="hover:text-white transition-colors">Polityka prywatności</Link>
              </div>

              {/* Prawa: Made by qba.dev */}
              <div className="md:flex-1 flex justify-center md:justify-end order-1 md:order-none">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors">
                  <span className="text-[10px] text-gray-600 font-medium tracking-tight">Crafted with</span>
                  <span className="text-red-400/80 animate-pulse text-[10px]">♥</span>
                  <span className="text-[10px] text-gray-600 font-medium tracking-tight">by</span>
                  <a 
                    href="https://qba.dev" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => trackExternalLink('https://qba.dev', 'qba.dev')}
                    className="group relative inline-flex items-center ml-0.5"
                  >
                    <span className="absolute inset-0 bg-blue-500/20 rounded-md blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="relative flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-900 rounded border border-white/10 group-hover:border-blue-400/50 transition-all duration-300">
                      <span className="text-blue-400/80 font-mono text-[9px]">&lt;</span>
                      <span className="text-[10px] font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        qba.dev
                      </span>
                      <span className="text-blue-400/80 font-mono text-[9px]">/&gt;</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


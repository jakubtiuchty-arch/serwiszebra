'use client'

import { Fragment, useState } from 'react'
import Link from 'next/link'
import {
  ChevronRight,
  BookOpen,
  Info,
  Play,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { PolishManual, PolishManualVideo } from '@/lib/polish-manuals'
import PolishManualPdfButton from './PolishManualPdfButton'
import FunnelBanners from './FunnelBanners'

interface ScannerVariant {
  variantName: string
  rows: { label: string; value: string }[]
}

interface PolishManualContentProps {
  polishManual: PolishManual
  modelSlug: string
  modelName: string
  variant?: ScannerVariant | null
}

/**
 * Poradniki wideo w rozdziale instrukcji. Odtwarzacz YouTube ładuje się dopiero
 * po kliknięciu miniatury — instrukcje otwiera się często z wyszukiwarki, więc
 * strona nie może ciągnąć skryptów i ciasteczek serwisu wideo przy każdym wejściu.
 */
function WideoRozdzialu({ videos }: { videos: PolishManualVideo[] }) {
  const [odtwarzane, setOdtwarzane] = useState<string | null>(null)

  return (
    <div className="mt-5 border-t border-gray-200 pt-5 sm:mt-6 sm:pt-6">
      <h3 className="mb-3 text-sm font-semibold text-gray-900 sm:text-base">
        {videos.length > 1 ? 'Zobacz na wideo' : 'Zobacz na wideo'}
      </h3>
      <div className={`grid gap-3 sm:gap-4 ${videos.length > 1 ? 'sm:grid-cols-2' : ''}`}>
        {videos.map((v) => {
          const miniatura = v.thumbnail || `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`
          return (
            <figure key={v.youtubeId} className="overflow-hidden rounded-lg border border-gray-200">
              <div className="relative aspect-video bg-gray-900">
                {odtwarzane === v.youtubeId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?autoplay=1&rel=0&playsinline=1`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setOdtwarzane(v.youtubeId)}
                    aria-label={`Odtwórz film: ${v.title}`}
                    className="group absolute inset-0 h-full w-full"
                  >
                    {/* Miniatura z repo albo kadr z YouTube — zwykły img, bez remotePatterns */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={miniatura}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                    />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 shadow-lg transition group-hover:scale-110 sm:h-14 sm:w-14">
                        <Play className="ml-0.5 h-5 w-5 text-white sm:h-6 sm:w-6" fill="white" />
                      </span>
                    </span>
                  </button>
                )}
              </div>
              <figcaption className="px-3 py-2 text-sm text-gray-800">{v.title}</figcaption>
            </figure>
          )
        })}
      </div>
    </div>
  )
}

export default function PolishManualContent({ polishManual, modelSlug, modelName, variant }: PolishManualContentProps) {
  // Baner lejka po sekcji „Rozwiązywanie problemów"; gdy jej brak — po ostatniej sekcji (zawsze widoczny).
  const troubleshootingIndex = polishManual.sections.findIndex((s) => /rozwiązywanie problemów/i.test(s.title))
  const bannerAfterIndex = troubleshootingIndex >= 0 ? troubleshootingIndex : polishManual.sections.length - 1

  return (
    <>
      {/* Dane wariantu — indywidualne dla dokładnego modelu (np. DS3608ER) */}
      {variant && (
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="font-bold text-gray-900 text-sm sm:text-base mb-1">
            {modelName} — wariant {variant.variantName}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            Dane specyficzne dla tego modelu. Obsługa, konfiguracja i konserwacja — jak w sekcjach poniżej.
          </p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {variant.rows.map((row, i) => (
              <div key={i} className="flex justify-between gap-3 border-b border-gray-100 py-1.5 last:border-0">
                <dt className="text-xs sm:text-sm text-gray-500 flex-shrink-0">{row.label}</dt>
                <dd className="text-xs sm:text-sm font-medium text-gray-900 text-right">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Table of Contents */}
      <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            Spis treści
          </h2>
          <PolishManualPdfButton manual={polishManual} />
        </div>
        <nav className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
          {polishManual.sections.map((section, index) => (
            <a
              key={index}
              href={`#section-${index}`}
              className="flex items-center gap-2 p-2 sm:p-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0">
                {index + 1}
              </span>
              <span className="text-xs sm:text-sm leading-tight">{section.title.replace(/^\d+\.\s*/, '')}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Content Sections */}
      <div className="space-y-4 sm:space-y-8">
        {polishManual.sections.map((section, index) => (
          <Fragment key={index}>
          <article
            id={`section-${index}`}
            className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden scroll-mt-20 sm:scroll-mt-24"
          >
            <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="text-base sm:text-xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <span className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                  {index + 1}
                </span>
                <span className="leading-tight">{section.title.replace(/^\d+\.\s*/, '')}</span>
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({children}) => (
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-4 sm:mt-6 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
                      {children}
                    </h2>
                  ),
                  h3: ({children}) => (
                    <h3 className="text-base sm:text-lg font-semibold text-blue-800 mt-4 sm:mt-5 mb-2 sm:mb-3">
                      {children}
                    </h3>
                  ),
                  p: ({children}) => (
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                      {children}
                    </p>
                  ),
                  strong: ({children}) => (
                    <strong className="font-semibold text-gray-900">
                      {children}
                    </strong>
                  ),
                  ul: ({children}) => (
                    <ul className="my-3 sm:my-4 pl-4 sm:pl-6 list-disc space-y-1.5 sm:space-y-2">
                      {children}
                    </ul>
                  ),
                  ol: ({children}) => (
                    <ol className="my-3 sm:my-4 pl-4 sm:pl-6 list-decimal space-y-1.5 sm:space-y-2">
                      {children}
                    </ol>
                  ),
                  li: ({children}) => (
                    <li className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {children}
                    </li>
                  ),
                  table: ({children}) => (
                    <div className="my-4 sm:my-6 -mx-4 sm:mx-0 overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm border-collapse border border-gray-300 min-w-[300px]">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({children}) => (
                    <thead className="bg-gray-100">
                      {children}
                    </thead>
                  ),
                  th: ({children}) => (
                    <th className="p-2 sm:p-3 text-left font-semibold text-gray-900 border border-gray-300 whitespace-nowrap">
                      {children}
                    </th>
                  ),
                  td: ({children}) => (
                    <td className="p-2 sm:p-3 border border-gray-200 text-gray-700">
                      {children}
                    </td>
                  ),
                  tr: ({children}) => (
                    <tr className="even:bg-gray-50">
                      {children}
                    </tr>
                  ),
                  blockquote: ({children}) => (
                    <blockquote className="border-l-4 border-amber-400 bg-amber-50 p-3 sm:p-4 my-3 sm:my-4 rounded-r-lg text-amber-800 text-sm sm:text-base">
                      {children}
                    </blockquote>
                  ),
                  code: ({children, className}) => {
                    const isInline = !className
                    return isInline ? (
                      <code className="bg-gray-100 px-1 sm:px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono text-blue-700 break-all">
                        {children}
                      </code>
                    ) : (
                      <code className={className}>
                        {children}
                      </code>
                    )
                  },
                  a: ({children, href}) => (
                    <a href={href} className="text-blue-600 underline hover:text-blue-800 break-words">
                      {children}
                    </a>
                  ),
                }}
              >
                {section.content}
              </ReactMarkdown>

              {section.videos && section.videos.length > 0 && (
                <WideoRozdzialu videos={section.videos} />
              )}
            </div>
          </article>
          {index === bannerAfterIndex && (
            <FunnelBanners model={modelName} />
          )}
          </Fragment>
        ))}
      </div>

      {/* Footer info */}
      <div className="mt-6 sm:mt-8 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
            <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Potrzebujesz pełnej dokumentacji?</h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              Ta instrukcja zawiera skrócone, najważniejsze informacje po polsku. 
              Pełna dokumentacja producenta (w języku angielskim) dostępna jest na stronie modelu.
            </p>
            <Link
              href={`/instrukcje/${modelSlug}`}
              className="inline-flex items-center gap-1.5 sm:gap-2 text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm"
            >
              <span className="sm:hidden">Pełna dokumentacja</span>
              <span className="hidden sm:inline">Zobacz pełną dokumentację {modelName}</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 sm:mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col items-center text-center sm:text-left sm:flex-row sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-1">Masz problem z {modelName}?</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Nasz serwis pomoże – diagnostyka AI 24/7 lub zgłoszenie naprawy</p>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              href="/#czat"
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors text-xs sm:text-sm text-center"
            >
              Czat z AI
            </Link>
            <Link
              href="/#formularz"
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-xs sm:text-sm text-center"
            >
              Zgłoś naprawę
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}


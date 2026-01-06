'use client'

import Link from 'next/link'
import { 
  ChevronRight, 
  BookOpen,
  Info,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { PolishManual } from '@/lib/polish-manuals'
import PolishManualPdfButton from './PolishManualPdfButton'

interface PolishManualContentProps {
  polishManual: PolishManual
  modelSlug: string
  modelName: string
}

export default function PolishManualContent({ polishManual, modelSlug, modelName }: PolishManualContentProps) {
  return (
    <>
      {/* Table of Contents */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Spis treści
          </h2>
          <PolishManualPdfButton manual={polishManual} />
        </div>
        <nav className="grid md:grid-cols-2 gap-2">
          {polishManual.sections.map((section, index) => (
            <a
              key={index}
              href={`#section-${index}`}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <span className="text-sm">{section.title.replace(/^\d+\.\s*/, '')}</span>
            </a>
          ))}
        </nav>
      </div>

      {/* Content Sections */}
      <div className="space-y-8">
        {polishManual.sections.map((section, index) => (
          <article
            key={index}
            id={`section-${index}`}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden scroll-mt-24"
          >
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                {section.title.replace(/^\d+\.\s*/, '')}
              </h2>
            </div>
            <div className="p-6">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({children}) => (
                    <h2 className="text-xl font-bold text-gray-900 mt-6 mb-4 pb-2 border-b border-gray-200">
                      {children}
                    </h2>
                  ),
                      h3: ({children}) => (
                        <h3 className="text-lg font-semibold text-blue-800 mt-5 mb-3">
                          {children}
                        </h3>
                      ),
                  p: ({children}) => (
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {children}
                    </p>
                  ),
                  strong: ({children}) => (
                    <strong className="font-semibold text-gray-900">
                      {children}
                    </strong>
                  ),
                  ul: ({children}) => (
                    <ul className="my-4 pl-6 list-disc space-y-2">
                      {children}
                    </ul>
                  ),
                  ol: ({children}) => (
                    <ol className="my-4 pl-6 list-decimal space-y-2">
                      {children}
                    </ol>
                  ),
                  li: ({children}) => (
                    <li className="text-gray-700 leading-relaxed">
                      {children}
                    </li>
                  ),
                  table: ({children}) => (
                    <div className="my-6 overflow-x-auto">
                      <table className="w-full text-sm border-collapse border border-gray-300">
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
                    <th className="p-3 text-left font-semibold text-gray-900 border border-gray-300">
                      {children}
                    </th>
                  ),
                  td: ({children}) => (
                    <td className="p-3 border border-gray-200 text-gray-700">
                      {children}
                    </td>
                  ),
                  tr: ({children}) => (
                    <tr className="even:bg-gray-50">
                      {children}
                    </tr>
                  ),
                      blockquote: ({children}) => (
                        <blockquote className="border-l-4 border-amber-400 bg-amber-50 p-4 my-4 rounded-r-lg text-amber-800">
                          {children}
                        </blockquote>
                      ),
                  code: ({children, className}) => {
                    const isInline = !className
                    return isInline ? (
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-blue-700">
                        {children}
                      </code>
                    ) : (
                      <code className={className}>
                        {children}
                      </code>
                    )
                  },
                  a: ({children, href}) => (
                    <a href={href} className="text-blue-600 underline hover:text-blue-800">
                      {children}
                    </a>
                  ),
                }}
              >
                {section.content}
              </ReactMarkdown>
            </div>
            </article>
          ))}
      </div>

      {/* Footer info */}
      <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Info className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Potrzebujesz pełnej dokumentacji?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Ta instrukcja zawiera skrócone, najważniejsze informacje po polsku. 
              Pełna dokumentacja producenta (w języku angielskim) dostępna jest na stronie modelu.
            </p>
            <Link
              href={`/instrukcje/${modelSlug}`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Zobacz pełną dokumentację {modelName}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg mb-1">Masz problem z {modelName}?</h3>
            <p className="text-gray-400 text-sm">Nasz serwis pomoże – diagnostyka AI 24/7 lub zgłoszenie naprawy</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/#czat"
              className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
            >
              Czat z AI
            </Link>
            <Link
              href="/#formularz"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              Zgłoś naprawę
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}


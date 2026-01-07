'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import type { PolishManual } from '@/lib/polish-manuals'
import { trackManualPDFDownload } from '@/lib/analytics'

interface PolishManualPdfButtonProps {
  manual: PolishManual
}

export default function PolishManualPdfButton({ manual }: PolishManualPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    setIsGenerating(true)
    trackManualPDFDownload(manual.model, 'pl')
    
    try {
      // Otwórz nowe okno z wersją do druku
      const printWindow = window.open('', '_blank', 'width=800,height=600')
      
      if (!printWindow) {
        alert('Nie udało się otworzyć okna. Sprawdź ustawienia blokowania wyskakujących okienek.')
        return
      }

      // Generuj HTML do druku
      const htmlContent = generatePrintHtml(manual)
      
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      
      // Poczekaj na załadowanie i wywołaj drukowanie
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
        }, 500)
      }
      
    } catch (error) {
      console.error('Błąd generowania PDF:', error)
      alert('Wystąpił błąd. Spróbuj ponownie.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Przygotowywanie...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Pobierz PDF
        </>
      )}
    </button>
  )
}

// Funkcja generująca HTML do druku
function generatePrintHtml(manual: PolishManual): string {
  const sectionsHtml = manual.sections.map((section, index) => {
    const contentHtml = parseMarkdownToHtml(section.content)
    return `
      <div class="section">
        <div class="section-header">
          <span class="section-number">${index + 1}</span>
          <span class="section-title">${section.title.replace(/^\d+\.\s*/, '')}</span>
        </div>
        <div class="section-content">
          ${contentHtml}
        </div>
      </div>
    `
  }).join('')

  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>${manual.title}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 11px;
      line-height: 1.5;
      color: #1f2937;
      margin: 0;
      padding: 0;
    }
    
    .header {
      border-bottom: 3px solid #dc2626;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    
    .header-flag {
      font-size: 10px;
      color: #dc2626;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    
    .header-title {
      font-size: 20px;
      font-weight: bold;
      color: #111827;
      margin: 0 0 6px 0;
    }
    
    .header-meta {
      font-size: 9px;
      color: #6b7280;
    }
    
    .section {
      margin-bottom: 16px;
      page-break-inside: avoid;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 6px;
      margin-bottom: 10px;
    }
    
    .section-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      background-color: #2563eb;
      color: white;
      border-radius: 50%;
      font-size: 11px;
      font-weight: bold;
    }
    
    .section-title {
      font-size: 13px;
      font-weight: bold;
      color: #111827;
    }
    
    .section-content {
      padding-left: 6px;
    }
    
    h3 {
      font-size: 11px;
      font-weight: bold;
      color: #1e40af;
      margin: 12px 0 6px 0;
    }
    
    p {
      margin: 0 0 8px 0;
    }
    
    ul, ol {
      margin: 8px 0;
      padding-left: 20px;
    }
    
    li {
      margin-bottom: 4px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 10px;
    }
    
    th, td {
      border: 1px solid #d1d5db;
      padding: 6px 8px;
      text-align: left;
    }
    
    th {
      background-color: #f3f4f6;
      font-weight: bold;
    }
    
    tr:nth-child(even) {
      background-color: #f9fafb;
    }
    
    .warning {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 8px 12px;
      margin: 10px 0;
      font-size: 10px;
      color: #92400e;
    }
    
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      border-top: 1px solid #e5e7eb;
      padding: 8px 15mm;
      font-size: 8px;
      color: #9ca3af;
      display: flex;
      justify-content: space-between;
      background: white;
    }
    
    @media print {
      .footer {
        position: fixed;
        bottom: 0;
      }
      
      body {
        padding-bottom: 30px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-flag">🇵🇱 Instrukcja po polsku</div>
    <h1 class="header-title">${manual.title}</h1>
    <div class="header-meta">
      Źródło: ${manual.sourceDocument} | Aktualizacja: ${manual.lastUpdated} | serwis-zebry.pl
    </div>
  </div>
  
  ${sectionsHtml}
  
  <div class="footer">
    <span>© serwis-zebry.pl - Autoryzowany serwis Zebra | Tel: +48 601 619 898</span>
  </div>
</body>
</html>
  `
}

// Prosta funkcja parsująca markdown na HTML
function parseMarkdownToHtml(content: string): string {
  const lines = content.trim().split('\n')
  let html = ''
  let inList = false
  let listType: 'ul' | 'ol' | null = null
  let inTable = false
  let tableHtml = ''
  let isFirstTableRow = true

  for (const line of lines) {
    const trimmed = line.trim()
    
    // Pusta linia
    if (!trimmed) {
      if (inList) {
        html += listType === 'ul' ? '</ul>' : '</ol>'
        inList = false
        listType = null
      }
      if (inTable) {
        html += tableHtml + '</tbody></table>'
        inTable = false
        tableHtml = ''
        isFirstTableRow = true
      }
      continue
    }

    // Tabela
    if (trimmed.startsWith('|')) {
      if (inList) {
        html += listType === 'ul' ? '</ul>' : '</ol>'
        inList = false
        listType = null
      }
      
      // Separator tabeli
      if (trimmed.includes('---')) {
        continue
      }
      
      const cells = trimmed.split('|').filter(c => c.trim()).map(c => 
        c.trim().replace(/\*\*/g, '')
      )
      
      if (!inTable) {
        html += '<table><thead><tr>'
        cells.forEach(cell => {
          html += `<th>${cell}</th>`
        })
        html += '</tr></thead><tbody>'
        inTable = true
        isFirstTableRow = false
      } else {
        tableHtml += '<tr>'
        cells.forEach(cell => {
          tableHtml += `<td>${cell}</td>`
        })
        tableHtml += '</tr>'
      }
      continue
    } else if (inTable) {
      html += tableHtml + '</tbody></table>'
      inTable = false
      tableHtml = ''
      isFirstTableRow = true
    }

    // Nagłówek H3
    if (trimmed.startsWith('### ')) {
      if (inList) {
        html += listType === 'ul' ? '</ul>' : '</ol>'
        inList = false
        listType = null
      }
      html += `<h3>${trimmed.replace('### ', '').replace(/\*\*/g, '')}</h3>`
      continue
    }

    // Blockquote / Warning
    if (trimmed.startsWith('>')) {
      if (inList) {
        html += listType === 'ul' ? '</ul>' : '</ol>'
        inList = false
        listType = null
      }
      const text = trimmed.replace(/^>\s*/, '').replace(/\*\*/g, '')
      html += `<div class="warning">${text}</div>`
      continue
    }

    // Lista numerowana
    if (/^\d+\.\s/.test(trimmed)) {
      if (!inList || listType !== 'ol') {
        if (inList) {
          html += listType === 'ul' ? '</ul>' : '</ol>'
        }
        html += '<ol>'
        inList = true
        listType = 'ol'
      }
      const text = trimmed.replace(/^\d+\.\s*/, '').replace(/\*\*/g, '<strong>').replace(/\*\*/g, '</strong>')
      html += `<li>${processBold(text)}</li>`
      continue
    }

    // Lista punktowana
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        if (inList) {
          html += listType === 'ul' ? '</ul>' : '</ol>'
        }
        html += '<ul>'
        inList = true
        listType = 'ul'
      }
      const text = trimmed.replace(/^[-*]\s*/, '')
      html += `<li>${processBold(text)}</li>`
      continue
    }

    // Zwykły paragraf
    if (inList) {
      html += listType === 'ul' ? '</ul>' : '</ol>'
      inList = false
      listType = null
    }
    
    if (trimmed) {
      html += `<p>${processBold(trimmed)}</p>`
    }
  }

  // Zamknij otwarte listy/tabele
  if (inList) {
    html += listType === 'ul' ? '</ul>' : '</ol>'
  }
  if (inTable) {
    html += tableHtml + '</tbody></table>'
  }

  return html
}

// Zamienia **tekst** na <strong>tekst</strong>
function processBold(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
}

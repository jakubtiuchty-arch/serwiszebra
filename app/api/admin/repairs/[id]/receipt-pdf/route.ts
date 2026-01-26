import { NextRequest, NextResponse } from 'next/server'
import { requireAdminServer } from '@/lib/auth-server'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = await requireAdminServer()
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const repairId = params.id

    // Pobierz dane naprawy
    const { data: repair, error: repairError } = await supabase
      .from('repair_requests')
      .select('*')
      .eq('id', repairId)
      .single()

    if (repairError || !repair) {
      return NextResponse.json({ error: 'Zgłoszenie nie znalezione' }, { status: 404 })
    }

    // Generuj HTML dla PDF
    const html = generateReceiptHtml(repair)

    // Zwróć HTML (frontend może użyć window.print() do PDF)
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="potwierdzenie-${repair.repair_number || repairId}.html"`
      }
    })
  } catch (error) {
    console.error('Error generating receipt:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateReceiptHtml(repair: any): string {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return format(new Date(dateStr), 'd MMMM yyyy, HH:mm', { locale: pl })
  }

  const formatDateShort = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return format(new Date(dateStr), 'd.MM.yyyy', { locale: pl })
  }

  // Numer zgłoszenia - używamy repair_number lub generujemy z daty
  const repairNumber = repair.repair_number || 
    format(new Date(repair.created_at), 'yyyyMMddHHmm')

  // Generowanie kodu kreskowego Code 128 jako SVG
  const barcodeValue = repairNumber
  const barcodeSvg = generateCode128Svg(barcodeValue)

  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Potwierdzenie przyjęcia - #${repairNumber}</title>
  <style>
    @page {
      size: A4;
      margin: 10mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #1f2937;
      background: white;
    }
    
    .container {
      max-width: 210mm;
      margin: 0 auto;
      padding: 8mm;
    }
    
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 6mm;
      padding-bottom: 4mm;
      border-bottom: 2px solid #1f2937;
    }
    
    .logo-section h1 {
      font-size: 20pt;
      font-weight: 700;
      color: #1f2937;
      letter-spacing: -0.5px;
    }
    
    .logo-section .subtitle {
      font-size: 9pt;
      color: #6b7280;
      margin-top: 1mm;
    }
    
    .barcode-section {
      text-align: center;
    }
    
    .barcode-section .barcode-label {
      font-size: 8pt;
      color: #6b7280;
      margin-bottom: 2mm;
    }
    
    .barcode-section .barcode-number {
      font-size: 14pt;
      font-weight: 700;
      color: #1f2937;
      font-family: 'Courier New', monospace;
      margin-top: 2mm;
    }
    
    /* Title */
    .document-title {
      text-align: center;
      margin: 6mm 0;
    }
    
    .document-title h2 {
      font-size: 14pt;
      font-weight: 600;
      color: #1f2937;
      text-transform: uppercase;
      letter-spacing: normal;
    }
    
    .document-title .date {
      font-size: 10pt;
      color: #6b7280;
      margin-top: 2mm;
    }
    
    /* Sections */
    .section {
      margin-bottom: 5mm;
      border: 1px solid #e5e7eb;
      border-radius: 2mm;
      overflow: hidden;
    }
    
    .section-title {
      font-size: 9pt;
      font-weight: 600;
      color: white;
      background: #374151;
      padding: 2mm 3mm;
      text-transform: uppercase;
      letter-spacing: normal;
    }
    
    .section-content {
      padding: 3mm;
      background: #f9fafb;
    }
    
    /* Data table */
    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .data-table td {
      padding: 1.5mm 2mm;
      vertical-align: top;
      font-size: 10pt;
    }
    
    .data-table .label {
      width: 35%;
      color: #6b7280;
      font-weight: 500;
    }
    
    .data-table .value {
      color: #1f2937;
      font-weight: 500;
    }
    
    /* Problem box */
    .problem-box {
      background: #fef3c7;
      border: 1px solid #fcd34d;
      border-radius: 2mm;
      padding: 3mm;
      margin-top: 2mm;
    }
    
    .problem-box h4 {
      font-size: 9pt;
      font-weight: 600;
      color: #92400e;
      margin-bottom: 2mm;
    }
    
    .problem-box p {
      font-size: 10pt;
      line-height: 1.5;
      white-space: pre-wrap;
      color: #78350f;
    }
    
    /* Two columns */
    .two-columns {
      display: flex;
      gap: 4mm;
    }
    
    .column {
      flex: 1;
    }
    
    /* Info box */
    .info-box {
      background: #eff6ff;
      border: 1px solid #93c5fd;
      border-radius: 2mm;
      padding: 3mm;
      margin-top: 4mm;
    }
    
    .info-box h4 {
      font-size: 9pt;
      font-weight: 600;
      color: #1e40af;
      margin-bottom: 2mm;
    }
    
    .info-box ul {
      font-size: 9pt;
      color: #1e40af;
      padding-left: 5mm;
    }
    
    .info-box li {
      margin-bottom: 1mm;
    }
    
    /* Footer */
    .footer {
      margin-top: 6mm;
      padding-top: 4mm;
      border-top: 1px solid #e5e7eb;
    }
    
    .footer-info {
      font-size: 8pt;
      color: #9ca3af;
      text-align: center;
      margin-bottom: 4mm;
    }
    
    /* Barcode SVG */
    .barcode-svg {
      max-width: 60mm;
      height: auto;
    }
    
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      
      .no-print {
        display: none !important;
      }
    }
    
    /* Print button */
    .print-button {
      position: fixed;
      top: 10mm;
      right: 10mm;
      background: #2563eb;
      color: white;
      border: none;
      padding: 3mm 6mm;
      border-radius: 2mm;
      font-size: 10pt;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 2mm;
    }
    
    .print-button:hover {
      background: #1d4ed8;
    }
  </style>
</head>
<body>
  <button class="print-button no-print" onclick="window.print()">🖨️ Drukuj / Zapisz PDF</button>
  
  <div class="container">
    <!-- Header z logo i kodem kreskowym -->
    <div class="header">
      <div class="logo-section">
        <h1>TAKMA</h1>
        <div class="subtitle">Autoryzowany Serwis Zebra</div>
        <div class="subtitle">ul. Poświęcka 1a, 51-128 Wrocław</div>
        <div class="subtitle">Tel: 601 619 898</div>
      </div>
      <div class="barcode-section">
        <div class="barcode-label">NUMER ZGŁOSZENIA</div>
        ${barcodeSvg}
        <div class="barcode-number">#${repairNumber}</div>
      </div>
    </div>
    
    <!-- Tytuł dokumentu -->
    <div class="document-title">
      <h2>Potwierdzenie przyjęcia urządzenia do serwisu</h2>
      <div class="date">Data zgłoszenia: ${formatDate(repair.created_at)}</div>
    </div>
    
    <!-- Dane klienta i urządzenia -->
    <div class="two-columns">
      <div class="column">
        <div class="section">
          <div class="section-title">Dane klienta</div>
          <div class="section-content">
            <table class="data-table">
              <tr>
                <td class="label">Imię i nazwisko:</td>
                <td class="value">${repair.first_name} ${repair.last_name}</td>
              </tr>
              ${repair.company ? `
              <tr>
                <td class="label">Firma:</td>
                <td class="value">${repair.company}</td>
              </tr>
              ` : ''}
              <tr>
                <td class="label">Telefon:</td>
                <td class="value">${repair.phone}</td>
              </tr>
              <tr>
                <td class="label">Email:</td>
                <td class="value">${repair.email}</td>
              </tr>
              <tr>
                <td class="label">Adres:</td>
                <td class="value">${repair.street || '-'}<br>${repair.zip_code || ''} ${repair.city || ''}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      
      <div class="column">
        <div class="section">
          <div class="section-title">Dane urządzenia</div>
          <div class="section-content">
            <table class="data-table">
              <tr>
                <td class="label">Model:</td>
                <td class="value" style="font-weight: 700; font-size: 11pt;">${repair.device_model}</td>
              </tr>
              ${repair.device_serial_number ? `
              <tr>
                <td class="label">Numer seryjny:</td>
                <td class="value" style="font-family: monospace;">${repair.device_serial_number}</td>
              </tr>
              ` : ''}
              <tr>
                <td class="label">Typ urządzenia:</td>
                <td class="value">${repair.device_type || 'Drukarka etykiet'}</td>
              </tr>
              <tr>
                <td class="label">Typ naprawy:</td>
                <td class="value">${repair.repair_type === 'warranty' ? 'Gwarancyjna' : 'Płatna'}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Opis problemu -->
    <div class="section">
      <div class="section-title">Opis zgłoszonego problemu</div>
      <div class="section-content">
        <div class="problem-box">
          <h4>Opis usterki podany przez klienta:</h4>
          <p>${repair.issue_description || 'Brak opisu problemu.'}</p>
        </div>
      </div>
    </div>
    
    <!-- Informacje dla klienta -->
    <div class="info-box">
      <h4>Informacje dla klienta:</h4>
      <ul>
        <li>Diagnoza urządzenia zostanie wykonana w ciągu 2-3 dni roboczych.</li>
        <li>Po diagnozie otrzymasz wycenę naprawy na podany adres e-mail.</li>
        <li>Status naprawy możesz śledzić w panelu klienta: <strong>serwis-zebry.pl/panel-klienta</strong></li>
        <li>W razie pytań zadzwoń: <strong>601 619 898</strong></li>
      </ul>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-info">
        <strong>TAKMA Tadeusz Tiuchty</strong> | NIP: 9151004377 | ul. Poświęcka 1a, 51-128 Wrocław<br>
        www.serwis-zebry.pl | serwis@takma.com.pl<br>
        Dokument wygenerowany: ${format(new Date(), 'd.MM.yyyy HH:mm', { locale: pl })}
      </div>
    </div>
  </div>
</body>
</html>
`
}

// Generator kodu kreskowego Code 128 jako SVG
function generateCode128Svg(text: string): string {
  // Code 128 character set B (ASCII 32-127)
  const CODE128_CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'
  
  const CODE128_PATTERNS: Record<number, string> = {
    0: '11011001100', 1: '11001101100', 2: '11001100110', 3: '10010011000',
    4: '10010001100', 5: '10001001100', 6: '10011001000', 7: '10011000100',
    8: '10001100100', 9: '11001001000', 10: '11001000100', 11: '11000100100',
    12: '10110011100', 13: '10011011100', 14: '10011001110', 15: '10111001100',
    16: '10011101100', 17: '10011100110', 18: '11001110010', 19: '11001011100',
    20: '11001001110', 21: '11011100100', 22: '11001110100', 23: '11101101110',
    24: '11101001100', 25: '11100101100', 26: '11100100110', 27: '11101100100',
    28: '11100110100', 29: '11100110010', 30: '11011011000', 31: '11011000110',
    32: '11000110110', 33: '10100011000', 34: '10001011000', 35: '10001000110',
    36: '10110001000', 37: '10001101000', 38: '10001100010', 39: '11010001000',
    40: '11000101000', 41: '11000100010', 42: '10110111000', 43: '10110001110',
    44: '10001101110', 45: '10111011000', 46: '10111000110', 47: '10001110110',
    48: '11101110110', 49: '11010001110', 50: '11000101110', 51: '11011101000',
    52: '11011100010', 53: '11011101110', 54: '11101011000', 55: '11101000110',
    56: '11100010110', 57: '11101101000', 58: '11101100010', 59: '11100011010',
    60: '11101111010', 61: '11001000010', 62: '11110001010', 63: '10100110000',
    64: '10100001100', 65: '10010110000', 66: '10010000110', 67: '10000101100',
    68: '10000100110', 69: '10110010000', 70: '10110000100', 71: '10011010000',
    72: '10011000010', 73: '10000110100', 74: '10000110010', 75: '11000010010',
    76: '11001010000', 77: '11110111010', 78: '11000010100', 79: '10001111010',
    80: '10100111100', 81: '10010111100', 82: '10010011110', 83: '10111100100',
    84: '10011110100', 85: '10011110010', 86: '11110100100', 87: '11110010100',
    88: '11110010010', 89: '11011011110', 90: '11011110110', 91: '11110110110',
    92: '10101111000', 93: '10100011110', 94: '10001011110', 95: '10111101000',
    96: '10111100010', 97: '11110101000', 98: '11110100010', 99: '10111011110',
    100: '10111101110', 101: '11101011110', 102: '11110101110',
    103: '11010000100', // START B
    104: '11010010000', // START C
    105: '11010011100', // START A
    106: '1100011101011' // STOP
  }

  // Koduj tekst
  let pattern = CODE128_PATTERNS[104] // START B
  let checksum = 104
  
  for (let i = 0; i < text.length; i++) {
    const charIndex = CODE128_CHARS.indexOf(text[i])
    if (charIndex >= 0) {
      pattern += CODE128_PATTERNS[charIndex]
      checksum += charIndex * (i + 1)
    }
  }
  
  // Dodaj checksum
  const checksumValue = checksum % 103
  pattern += CODE128_PATTERNS[checksumValue]
  
  // Dodaj STOP
  pattern += CODE128_PATTERNS[106]

  // Generuj SVG
  const barWidth = 1
  const height = 40
  let x = 10 // margin
  let svgBars = ''
  
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === '1') {
      // Znajdź długość ciągu 1-ek
      let width = 1
      while (i + width < pattern.length && pattern[i + width] === '1') {
        width++
      }
      svgBars += `<rect x="${x}" y="0" width="${width * barWidth}" height="${height}" fill="#000"/>`
      x += width * barWidth
      i += width - 1
    } else {
      // Znajdź długość ciągu 0-ek
      let width = 1
      while (i + width < pattern.length && pattern[i + width] === '0') {
        width++
      }
      x += width * barWidth
      i += width - 1
    }
  }
  
  const totalWidth = x + 10 // margin

  return `<svg class="barcode-svg" viewBox="0 0 ${totalWidth} ${height}" xmlns="http://www.w3.org/2000/svg">
    ${svgBars}
  </svg>`
}


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

    const formatDate = (dateStr: string | null) => {
      if (!dateStr) return '-'
      return format(new Date(dateStr), 'd MMMM yyyy, HH:mm', { locale: pl })
    }

    // Numer zgłoszenia
    const repairNumber = repair.repair_number || 
      format(new Date(repair.created_at), 'yyyyMMddHHmm')

    // Pobierz base URL z requestu
    const url = new URL(request.url)
    const baseUrl = `${url.protocol}//${url.host}`

    // Generowanie kodu kreskowego Code 128 jako SVG
    const barcodeSvg = generateCode128Svg(repairNumber)

    const html = `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Potwierdzenie przyjęcia - #${repairNumber}</title>
  <style>
    @media print {
      .no-print { display: none !important; }
      body { padding: 20px; margin: 0; }
    }
    @page { 
      size: A4; 
      margin: 15mm;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      font-size: 11px; 
      line-height: 1.4;
      color: #333;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      background: white;
    }
    .print-controls {
      background: #2563eb;
      color: white;
      padding: 15px 20px;
      margin-bottom: 20px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .print-btn {
      background: white;
      color: #2563eb;
      border: none;
      padding: 10px 25px;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      font-size: 14px;
    }
    .print-btn:hover { background: #f0f0f0; }
    .document { background: white; }
    
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 3px solid #1f2937;
    }
    .logo-section h1 { font-size: 26px; font-weight: 700; color: #1f2937; margin-bottom: 5px; }
    .logo-section .subtitle { font-size: 11px; color: #6b7280; margin-bottom: 2px; }
    
    .barcode-section { text-align: center; }
    .barcode-label { font-size: 10px; color: #6b7280; margin-bottom: 5px; }
    .barcode-number { font-size: 18px; font-weight: 700; color: #1f2937; font-family: monospace; margin-top: 5px; }
    .barcode-svg { max-width: 180px; height: auto; }
    
    .document-title { text-align: center; margin: 25px 0; }
    .document-title h2 { font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 8px; }
    .document-title .date { font-size: 12px; color: #6b7280; }
    
    .two-columns { display: flex; gap: 20px; margin-bottom: 25px; }
    .column { flex: 1; }
    
    .section { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
    .section-title { 
      font-size: 11px; 
      font-weight: 600; 
      color: white; 
      background: #374151; 
      padding: 8px 12px;
    }
    .section-content { padding: 12px; background: #f9fafb; }
    
    .data-row { display: flex; margin-bottom: 8px; font-size: 11px; }
    .data-label { width: 120px; color: #6b7280; }
    .data-value { color: #1f2937; font-weight: 500; }
    .data-value.bold { font-weight: 700; font-size: 13px; }
    
    .problem-section { margin-bottom: 25px; }
    .problem-box { 
      background: #fef3c7; 
      border: 1px solid #fcd34d; 
      border-radius: 8px; 
      padding: 12px;
    }
    .problem-title { font-size: 10px; font-weight: 600; color: #92400e; margin-bottom: 8px; }
    .problem-text { font-size: 11px; line-height: 1.6; color: #78350f; white-space: pre-wrap; }
    
    .info-box { 
      background: #eff6ff; 
      border: 1px solid #93c5fd; 
      border-radius: 8px; 
      padding: 15px;
      margin-bottom: 25px;
    }
    .info-title { font-size: 11px; font-weight: 600; color: #1e40af; margin-bottom: 10px; }
    .info-list { font-size: 11px; color: #1e40af; padding-left: 20px; }
    .info-list li { margin-bottom: 5px; }
    
    .footer { 
      text-align: center; 
      color: #9ca3af; 
      font-size: 9px; 
      padding-top: 15px;
      border-top: 1px solid #e5e7eb;
    }
    .footer p { margin-bottom: 3px; }
  </style>
</head>
<body>
  <div class="print-controls no-print">
    <div>
      <strong>Potwierdzenie #${repairNumber}</strong> - Kliknij przycisk aby wydrukować
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Drukuj / Zapisz PDF</button>
  </div>

  <div class="document">
    <div class="header">
      <div class="logo-section">
        <h1>TAKMA</h1>
        <div class="subtitle">Autoryzowany Serwis Zebra</div>
        <div class="subtitle">ul. Poświęcka 1a, 51-128 Wrocław</div>
        <div class="subtitle">Tel: 601 619 898 | serwis@takma.com.pl</div>
      </div>
      <div class="barcode-section">
        <div class="barcode-label">NUMER ZGŁOSZENIA</div>
        ${barcodeSvg}
        <div class="barcode-number">#${repairNumber}</div>
      </div>
    </div>
    
    <div class="document-title">
      <h2>POTWIERDZENIE PRZYJĘCIA URZĄDZENIA DO SERWISU</h2>
      <div class="date">Data zgłoszenia: ${formatDate(repair.created_at)}</div>
    </div>
    
    <div class="two-columns">
      <div class="column">
        <div class="section">
          <div class="section-title">DANE KLIENTA</div>
          <div class="section-content">
            <div class="data-row">
              <span class="data-label">Imię i nazwisko:</span>
              <span class="data-value">${repair.first_name} ${repair.last_name}</span>
            </div>
            ${repair.company ? `
            <div class="data-row">
              <span class="data-label">Firma:</span>
              <span class="data-value">${repair.company}</span>
            </div>
            ` : ''}
            <div class="data-row">
              <span class="data-label">Telefon:</span>
              <span class="data-value">${repair.phone}</span>
            </div>
            <div class="data-row">
              <span class="data-label">Email:</span>
              <span class="data-value">${repair.email}</span>
            </div>
            ${repair.street ? `
            <div class="data-row">
              <span class="data-label">Adres:</span>
              <span class="data-value">${repair.street}<br>${repair.zip_code || ''} ${repair.city || ''}</span>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
      
      <div class="column">
        <div class="section">
          <div class="section-title">DANE URZĄDZENIA</div>
          <div class="section-content">
            <div class="data-row">
              <span class="data-label">Model:</span>
              <span class="data-value bold">${repair.device_model}</span>
            </div>
            ${repair.serial_number ? `
            <div class="data-row">
              <span class="data-label">Numer seryjny:</span>
              <span class="data-value" style="font-family: monospace;">${repair.serial_number}</span>
            </div>
            ` : ''}
            <div class="data-row">
              <span class="data-label">Typ urządzenia:</span>
              <span class="data-value">${repair.device_type || 'terminal'}</span>
            </div>
            <div class="data-row">
              <span class="data-label">Typ naprawy:</span>
              <span class="data-value">${repair.repair_type === 'warranty' ? 'Gwarancyjna' : 'Płatna'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="problem-section">
      <div class="section">
        <div class="section-title">OPIS ZGŁOSZONEGO PROBLEMU</div>
        <div class="section-content">
          <div class="problem-box">
            <div class="problem-title">OPIS USTERKI PODANY PRZEZ KLIENTA:</div>
            <div class="problem-text">${repair.issue_description || 'Brak opisu problemu.'}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="info-box">
      <div class="info-title">INFORMACJE DLA KLIENTA:</div>
      <ul class="info-list">
        <li>Diagnoza urządzenia zostanie wykonana w ciągu 2-3 dni roboczych.</li>
        <li>Po diagnozie otrzymasz wycenę naprawy na podany adres e-mail.</li>
        <li>Status naprawy możesz śledzić w panelu klienta: <strong>serwis-zebry.pl/panel-klienta</strong></li>
        <li>W razie pytań zadzwoń: <strong>601 619 898</strong></li>
      </ul>
    </div>
    
    <div class="footer">
      <p><strong>TAKMA Tadeusz Tiuchty</strong> | NIP: 9151004377 | ul. Poświęcka 1a, 51-128 Wrocław</p>
      <p>www.serwis-zebry.pl | serwis@takma.com.pl</p>
      <p>Dokument wygenerowany: ${format(new Date(), 'd.MM.yyyy HH:mm', { locale: pl })}</p>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    }
  </script>
</body>
</html>
`

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

// Generator kodu kreskowego Code 128 jako SVG
function generateCode128Svg(text: string): string {
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

  let pattern = CODE128_PATTERNS[104] // START B
  let checksum = 104
  
  for (let i = 0; i < text.length; i++) {
    const charIndex = CODE128_CHARS.indexOf(text[i])
    if (charIndex >= 0) {
      pattern += CODE128_PATTERNS[charIndex]
      checksum += charIndex * (i + 1)
    }
  }
  
  const checksumValue = checksum % 103
  pattern += CODE128_PATTERNS[checksumValue]
  pattern += CODE128_PATTERNS[106]

  const barWidth = 1
  const height = 40
  let x = 10
  let svgBars = ''
  
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === '1') {
      let width = 1
      while (i + width < pattern.length && pattern[i + width] === '1') {
        width++
      }
      svgBars += `<rect x="${x}" y="0" width="${width * barWidth}" height="${height}" fill="#000"/>`
      x += width * barWidth
      i += width - 1
    } else {
      let width = 1
      while (i + width < pattern.length && pattern[i + width] === '0') {
        width++
      }
      x += width * barWidth
      i += width - 1
    }
  }
  
  const totalWidth = x + 10

  return `<svg class="barcode-svg" viewBox="0 0 ${totalWidth} ${height}" xmlns="http://www.w3.org/2000/svg">
    ${svgBars}
  </svg>`
}

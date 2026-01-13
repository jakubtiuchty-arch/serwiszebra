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
    const html = generateServiceReportHtml(repair)

    // Zwróć HTML (frontend może użyć window.print() lub biblioteki do PDF)
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="raport-serwisowy-${repair.repair_number || repairId}.html"`
      }
    })
  } catch (error) {
    console.error('Error generating service report:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateServiceReportHtml(repair: any): string {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return format(new Date(dateStr), 'd MMMM yyyy', { locale: pl })
  }

  const formatPrice = (price: number | null) => {
    if (!price) return '-'
    return price.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł'
  }

  const isWarranty = repair.repair_type === 'warranty'
  const repairTypeLabel = isWarranty ? 'Naprawa gwarancyjna' : 'Naprawa płatna'

  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Raport serwisowy - ${repair.repair_number}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #1f2937;
      background: white;
    }
    
    .container {
      max-width: 210mm;
      margin: 0 auto;
      padding: 10mm;
    }
    
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8mm;
      padding-bottom: 5mm;
      border-bottom: 2px solid #1f2937;
    }
    
    .logo-section h1 {
      font-size: 18pt;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 2mm;
    }
    
    .logo-section p {
      font-size: 9pt;
      color: #6b7280;
    }
    
    .report-info {
      text-align: right;
    }
    
    .report-info h2 {
      font-size: 14pt;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 2mm;
    }
    
    .report-info .number {
      font-size: 12pt;
      font-weight: 700;
      color: #2563eb;
      font-family: monospace;
    }
    
    .report-info .date {
      font-size: 9pt;
      color: #6b7280;
      margin-top: 1mm;
    }
    
    /* Sections */
    .section {
      margin-bottom: 6mm;
    }
    
    .section-title {
      font-size: 11pt;
      font-weight: 600;
      color: #1f2937;
      background: #f3f4f6;
      padding: 2mm 3mm;
      margin-bottom: 3mm;
      border-left: 3px solid #2563eb;
    }
    
    .section-content {
      padding: 0 3mm;
    }
    
    /* Two columns */
    .two-columns {
      display: flex;
      gap: 5mm;
    }
    
    .column {
      flex: 1;
    }
    
    /* Data rows */
    .data-row {
      display: flex;
      margin-bottom: 1.5mm;
      font-size: 10pt;
    }
    
    .data-label {
      width: 40%;
      color: #6b7280;
      flex-shrink: 0;
    }
    
    .data-value {
      flex: 1;
      font-weight: 500;
      color: #1f2937;
    }
    
    /* Problem description */
    .description-box {
      background: #fef3c7;
      border: 1px solid #fcd34d;
      border-radius: 3mm;
      padding: 3mm;
      margin-bottom: 4mm;
    }
    
    .description-box.diagnosis {
      background: #dbeafe;
      border-color: #93c5fd;
    }
    
    .description-box h4 {
      font-size: 9pt;
      font-weight: 600;
      color: #92400e;
      margin-bottom: 2mm;
      text-transform: uppercase;
    }
    
    .description-box.diagnosis h4 {
      color: #1e40af;
    }
    
    .description-box p {
      font-size: 10pt;
      line-height: 1.5;
      white-space: pre-wrap;
    }
    
    /* Price box */
    .price-box {
      background: ${isWarranty ? '#d1fae5' : '#eff6ff'};
      border: 1px solid ${isWarranty ? '#6ee7b7' : '#93c5fd'};
      border-radius: 3mm;
      padding: 4mm;
      text-align: center;
    }
    
    .price-box .label {
      font-size: 9pt;
      color: #6b7280;
      margin-bottom: 1mm;
    }
    
    .price-box .amount {
      font-size: 16pt;
      font-weight: 700;
      color: ${isWarranty ? '#059669' : '#1f2937'};
    }
    
    .warranty-badge {
      display: inline-block;
      background: #059669;
      color: white;
      padding: 1mm 3mm;
      border-radius: 2mm;
      font-size: 9pt;
      font-weight: 600;
      margin-top: 2mm;
    }
    
    /* Footer */
    .footer {
      margin-top: 10mm;
      padding-top: 5mm;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 8pt;
      color: #9ca3af;
    }
    
    .footer strong {
      color: #6b7280;
    }
    
    /* Signature area */
    .signature-area {
      margin-top: 15mm;
      display: flex;
      justify-content: space-between;
    }
    
    .signature-box {
      width: 45%;
      text-align: center;
    }
    
    .signature-line {
      border-top: 1px solid #9ca3af;
      margin-top: 15mm;
      padding-top: 2mm;
      font-size: 9pt;
      color: #6b7280;
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
    }
    
    .print-button:hover {
      background: #1d4ed8;
    }
  </style>
</head>
<body>
  <button class="print-button no-print" onclick="window.print()">🖨️ Drukuj PDF</button>
  
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="logo-section">
        <h1>TAKMA</h1>
        <p>Autoryzowany Serwis Zebra</p>
        <p>ul. Poświęcka 1a, 51-128 Wrocław</p>
        <p>Tel: 726 151 515 | serwis@takma.com.pl</p>
      </div>
      <div class="report-info">
        <h2>RAPORT SERWISOWY</h2>
        <div class="number">#${repair.repair_number || repair.id.split('-')[0].toUpperCase()}</div>
        <div class="date">Data zgłoszenia: ${formatDate(repair.created_at)}</div>
      </div>
    </div>
    
    <!-- Dane klienta i urządzenia -->
    <div class="two-columns">
      <div class="column">
        <div class="section">
          <div class="section-title">Dane klienta</div>
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
            <div class="data-row">
              <span class="data-label">Adres:</span>
              <span class="data-value">${repair.street || ''}, ${repair.zip_code || ''} ${repair.city || ''}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="column">
        <div class="section">
          <div class="section-title">Dane urządzenia</div>
          <div class="section-content">
            <div class="data-row">
              <span class="data-label">Model:</span>
              <span class="data-value">${repair.device_model}</span>
            </div>
            ${repair.serial_number ? `
            <div class="data-row">
              <span class="data-label">Numer seryjny:</span>
              <span class="data-value">${repair.serial_number}</span>
            </div>
            ` : ''}
            ${repair.purchase_date ? `
            <div class="data-row">
              <span class="data-label">Data zakupu:</span>
              <span class="data-value">${formatDate(repair.purchase_date)}</span>
            </div>
            ` : ''}
            <div class="data-row">
              <span class="data-label">Typ naprawy:</span>
              <span class="data-value">${repairTypeLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Zgłoszony problem -->
    <div class="section">
      <div class="section-title">Zgłoszony problem</div>
      <div class="section-content">
        <div class="description-box">
          <h4>Opis usterki zgłoszonej przez klienta</h4>
          <p>${repair.issue_description || '-'}</p>
        </div>
      </div>
    </div>
    
    <!-- Diagnoza i wykonane prace -->
    <div class="section">
      <div class="section-title">Diagnoza serwisu i wykonane prace</div>
      <div class="section-content">
        <div class="description-box diagnosis">
          <h4>Przeprowadzone czynności serwisowe</h4>
          <p>${repair.service_notes || 'Brak informacji o wykonanych pracach.'}</p>
        </div>
      </div>
    </div>
    
    <!-- Koszt naprawy -->
    <div class="section">
      <div class="section-title">Koszt naprawy</div>
      <div class="section-content">
        <div class="price-box">
          ${isWarranty ? `
            <div class="label">Naprawa gwarancyjna</div>
            <div class="amount">0,00 zł</div>
            <div class="warranty-badge">GWARANCJA</div>
          ` : `
            <div class="label">Kwota do zapłaty (brutto)</div>
            <div class="amount">${formatPrice(repair.final_price || repair.estimated_price)}</div>
            ${repair.paid_at ? `<div style="font-size: 9pt; color: #059669; margin-top: 2mm;">✓ Opłacono ${formatDate(repair.paid_at)}</div>` : ''}
          `}
        </div>
      </div>
    </div>
    
    <!-- Podpisy -->
    <div class="signature-area">
      <div class="signature-box">
        <div class="signature-line">Podpis serwisu</div>
      </div>
      <div class="signature-box">
        <div class="signature-line">Podpis klienta (przy odbiorze)</div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p><strong>TAKMA Tadeusz Tiuchty</strong> | ul. Poświęcka 1a, 51-128 Wrocław | NIP: 9151004377</p>
      <p>www.serwis-zebry.pl | serwis@takma.com.pl | Tel: 726 151 515</p>
      <p style="margin-top: 2mm;">Dokument wygenerowany automatycznie dnia ${format(new Date(), 'd MMMM yyyy, HH:mm', { locale: pl })}</p>
    </div>
  </div>
</body>
</html>
`
}


import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const repairId = params.id

    // Sprawdź użytkownika
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Pobierz zgłoszenie
    const { data: repair, error: repairError } = await supabase
      .from('repair_requests')
      .select('*')
      .eq('id', repairId)
      .single()

    if (repairError || !repair) {
      return new NextResponse('Zgłoszenie nie znalezione', { status: 404 })
    }
    
    // Sprawdź uprawnienia: user_id musi się zgadzać LUB email musi się zgadzać (dla gości)
    const isOwner = repair.user_id === user.id
    const isEmailMatch = repair.email && user.email === repair.email
    
    if (!isOwner && !isEmailMatch) {
      return new NextResponse('Brak dostępu do tego zgłoszenia', { status: 403 })
    }

    const shortId = repair.id.split('-')[0].toUpperCase()
    const amount = repair.final_price || repair.estimated_price || 0
    const today = new Date().toLocaleDateString('pl-PL')
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pl-PL')

    // Pobierz base URL z requestu
    const url = new URL(request.url)
    const baseUrl = `${url.protocol}//${url.host}`

    // Generuj HTML z przyciskiem drukowania i auto-print
    const html = `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Pro Forma #${shortId} - TAKMA Serwis Zebra</title>
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
    .document {
      background: white;
    }
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 3px solid #2563eb;
    }
    .logo-section { }
    .logos-row {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .logo-img { height: 55px; width: auto; }
    .badge-img { height: 45px; width: auto; }
    .repair-img { height: 50px; width: auto; }
    .doc-title { text-align: right; }
    .doc-title h1 { font-size: 26px; color: #1e3a5f; margin-bottom: 5px; letter-spacing: 2px; }
    .doc-title .number { font-size: 12px; color: #666; }
    
    .parties { display: flex; justify-content: space-between; margin-bottom: 25px; }
    .party { width: 47%; }
    .party-title { 
      font-weight: bold; 
      color: #2563eb; 
      margin-bottom: 8px; 
      font-size: 10px; 
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 5px;
    }
    .party-name { font-weight: bold; font-size: 13px; margin-bottom: 4px; }
    .party-text { font-size: 11px; margin-bottom: 2px; color: #444; }
    
    .dates { 
      display: flex; 
      justify-content: space-between; 
      margin-bottom: 25px;
      padding: 12px 15px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }
    .date-item { text-align: center; flex: 1; }
    .date-label { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .date-value { font-weight: bold; font-size: 13px; margin-top: 3px; }
    
    table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
    th { 
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white; 
      padding: 10px 12px; 
      text-align: left; 
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    .amount { text-align: right; font-weight: bold; }
    .service-name { font-weight: 600; color: #1e3a5f; }
    .service-notes { font-size: 10px; color: #64748b; margin-top: 4px; }
    
    .summary { 
      display: flex; 
      justify-content: flex-end; 
      margin-bottom: 25px;
    }
    .summary-box { 
      width: 220px; 
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      padding: 15px; 
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 11px; }
    .summary-total { 
      font-size: 16px; 
      font-weight: bold; 
      color: #2563eb; 
      border-top: 2px solid #2563eb; 
      padding-top: 10px; 
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
    }
    
    .bank-details { 
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      padding: 18px; 
      border-radius: 8px; 
      margin-bottom: 25px;
      border: 1px solid #93c5fd;
    }
    .bank-title { font-weight: bold; color: #1e40af; margin-bottom: 12px; font-size: 12px; }
    .bank-row { display: flex; margin-bottom: 6px; }
    .bank-label { width: 110px; color: #475569; font-size: 11px; }
    .bank-value { font-weight: 600; font-size: 11px; }
    .bank-account { font-family: 'Courier New', monospace; font-size: 13px; letter-spacing: 1px; color: #1e40af; }
    
    .footer { 
      text-align: center; 
      color: #64748b; 
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
      <strong>Pro Forma #${shortId}</strong> - Kliknij przycisk aby wydrukować
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Drukuj</button>
  </div>

  <div class="document">
    <div class="header">
      <div class="logo-section">
        <div class="logos-row">
          <img src="${baseUrl}/takma_logo_1.png" alt="TAKMA" class="logo-img" />
          <img src="${baseUrl}/premier-partner-1.png" alt="Premier Partner" class="badge-img" />
          <img src="${baseUrl}/repair_specialist.png" alt="Repair Specialist" class="repair-img" />
        </div>
      </div>
      <div class="doc-title">
        <h1>PRO FORMA</h1>
        <div class="number">Nr: PF/${shortId}/${new Date().getFullYear()}</div>
      </div>
    </div>

    <div class="parties">
      <div class="party">
        <div class="party-title">Sprzedawca</div>
        <div class="party-name">TAKMA Tadeusz Tiuchty</div>
        <div class="party-text">ul. Poświęcka 1a</div>
        <div class="party-text">51-128 Wrocław</div>
        <div class="party-text">NIP: 9151004377</div>
      </div>
      <div class="party">
        <div class="party-title">Nabywca</div>
        <div class="party-name">${repair.first_name} ${repair.last_name}</div>
        ${repair.company ? `<div class="party-text"><strong>${repair.company}</strong></div>` : ''}
        ${repair.street ? `<div class="party-text">${repair.street}</div>` : ''}
        <div class="party-text">${repair.zip_code || ''} ${repair.city || ''}</div>
        ${repair.nip ? `<div class="party-text"><strong>NIP: ${repair.nip}</strong></div>` : ''}
        <div class="party-text">Email: ${repair.email}</div>
      </div>
    </div>

    <div class="dates">
      <div class="date-item">
        <div class="date-label">Data wystawienia</div>
        <div class="date-value">${today}</div>
      </div>
      <div class="date-item">
        <div class="date-label">Termin płatności</div>
        <div class="date-value">${dueDate}</div>
      </div>
      <div class="date-item">
        <div class="date-label">Nr zgłoszenia</div>
        <div class="date-value">#${shortId}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 35px;">Lp.</th>
          <th>Opis usługi</th>
          <th style="width: 60px;">Ilość</th>
          <th style="width: 90px; text-align: right;">Cena netto</th>
          <th style="width: 50px; text-align: center;">VAT</th>
          <th style="width: 90px; text-align: right;">Brutto</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>
            <div class="service-name">Naprawa urządzenia ${repair.device_model}</div>
            ${repair.price_notes ? `<div class="service-notes">${repair.price_notes}</div>` : ''}
          </td>
          <td>1 szt.</td>
          <td class="amount">${(amount / 1.23).toFixed(2)} zł</td>
          <td style="text-align: center;">23%</td>
          <td class="amount">${amount.toFixed(2)} zł</td>
        </tr>
      </tbody>
    </table>

    <div class="summary">
      <div class="summary-box">
        <div class="summary-row">
          <span>Wartość netto:</span>
          <span>${(amount / 1.23).toFixed(2)} zł</span>
        </div>
        <div class="summary-row">
          <span>VAT 23%:</span>
          <span>${(amount - amount / 1.23).toFixed(2)} zł</span>
        </div>
        <div class="summary-total">
          <span>Do zapłaty:</span>
          <span>${amount.toFixed(2)} zł</span>
        </div>
      </div>
    </div>

    <div class="bank-details">
      <div class="bank-title">Dane do przelewu</div>
      <div class="bank-row">
        <span class="bank-label">Odbiorca:</span>
        <span class="bank-value">TAKMA Tadeusz Tiuchty, ul. Poświęcka 1a, 51-128 Wrocław</span>
      </div>
      <div class="bank-row">
        <span class="bank-label">Bank:</span>
        <span class="bank-value">PKO BP</span>
      </div>
      <div class="bank-row">
        <span class="bank-label">Nr konta:</span>
        <span class="bank-value bank-account">39 1020 5297 0000 1902 0283 3069</span>
      </div>
      <div class="bank-row">
        <span class="bank-label">Tytuł przelewu:</span>
        <span class="bank-value">Naprawa #${shortId}</span>
      </div>
    </div>

    <div class="footer">
      <p>Dokument wygenerowany automatycznie przez system serwis-zebry.pl</p>
      <p>Pro forma nie jest dokumentem księgowym. Faktura VAT zostanie wystawiona po zaksięgowaniu płatności.</p>
    </div>
  </div>

  <script>
    // Auto-open print dialog
    window.onload = function() {
      // Daj chwilę na załadowanie
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
      },
    })

  } catch (error: any) {
    console.error('❌ Error generating Pro Forma PDF:', error)
    return new NextResponse('Internal server error: ' + error.message, { status: 500 })
  }
}


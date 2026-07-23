import { NextRequest, NextResponse } from 'next/server'
import { requireAdminServer } from '@/lib/auth-server'
import { createPureServiceClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = await requireAdminServer()
    if (!adminCheck || !adminCheck.isAdmin) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const supabase = createPureServiceClient()
    const { data: rental, error } = await supabase
      .from('rentals')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !rental) {
      return new NextResponse('Wypożyczenie nie znalezione', { status: 404 })
    }

    const rentedDate = new Date(rental.rented_at).toLocaleDateString('pl-PL')
    const due = new Date(rental.rented_at)
    due.setDate(due.getDate() + 14)
    const dueDate = due.toLocaleDateString('pl-PL')

    const html = `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Protokół wypożyczenia ${rental.rental_number} - TAKMA</title>
  <style>
    @media print {
      .no-print { display: none !important; }
      /* margines strony = 0 usuwa nagłówki/stopki przeglądarki (data, URL, numeracja);
         marginesy wydruku robi padding body. Na wydruku treść na całą szerokość A4 */
      body { padding: 12mm 15mm; margin: 0; max-width: none; }
      /* podpisy i stopka przyklejone do dołu strony A4 */
      .page-bottom {
        position: fixed;
        bottom: 12mm;
        left: 15mm;
        right: 15mm;
      }
    }
    @page { size: A4; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 12px;
      color: #1f2937;
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    .print-bar {
      background: #2563eb;
      color: white;
      border-radius: 10px;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }
    .print-bar button {
      background: white;
      color: #2563eb;
      border: none;
      border-radius: 8px;
      padding: 10px 18px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 3px solid #2563eb;
      padding-bottom: 14px;
      margin-bottom: 20px;
    }
    .header h1 { font-size: 20px; color: #1e3a8a; }
    .header .nr { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .brand img { height: 62px; width: auto; display: block; }
    .cols { display: flex; gap: 24px; margin-bottom: 20px; }
    .col { flex: 1; }
    .col h3 {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #2563eb;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 4px;
      margin-bottom: 8px;
    }
    .col p { line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; margin-bottom: 20px; }
    th {
      background: #2563eb;
      color: white;
      text-align: left;
      padding: 8px 10px;
      font-size: 10px;
      text-transform: uppercase;
    }
    td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
    .terms {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 14px 16px;
      margin-bottom: 28px;
    }
    .terms h3 { font-size: 11px; margin-bottom: 8px; color: #111827; }
    .terms ol { padding-left: 18px; line-height: 1.7; color: #374151; }
    .signatures { display: flex; gap: 40px; margin-top: 48px; }
    .sig { flex: 1; text-align: center; }
    .sig .line { border-top: 1px solid #9ca3af; margin-bottom: 6px; }
    .sig p { font-size: 10px; color: #6b7280; }
    .footer {
      margin-top: 40px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      font-size: 9px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <strong>Protokół ${rental.rental_number} — wydrukuj 2 egzemplarze i dołącz do przesyłki</strong>
    <button onclick="window.print()">🖨 Drukuj / Zapisz PDF</button>
  </div>

  <div class="header">
    <div class="brand">
      <img src="/takma_logo_1.png" alt="TAKMA Centrum Systemów Mobilnych">
    </div>
    <div style="text-align: right;">
      <h1>PROTOKÓŁ WYPOŻYCZENIA SPRZĘTU</h1>
      <div class="nr">Nr: ${rental.rental_number} &nbsp;·&nbsp; Data: ${rentedDate}</div>
    </div>
  </div>

  <div class="cols">
    <div class="col">
      <h3>Wypożyczający (serwis)</h3>
      <p>
        <strong>TAKMA Tadeusz Tiuchty</strong><br>
        ul. Poświęcka 1a, 51-128 Wrocław<br>
        NIP: 9151004377<br>
        Tel: +48 607 819 688<br>
        Email: serwis@takma.com.pl
      </p>
    </div>
    <div class="col">
      <h3>Korzystający (klient)</h3>
      <p>
        <strong>${rental.customer_name}</strong><br>
        ${rental.company ? `${rental.company}<br>` : ''}
        ${rental.email ? `Email: ${rental.email}<br>` : ''}
        ${rental.phone ? `Tel: ${rental.phone}` : ''}
      </p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Urządzenie</th>
        <th>Numer seryjny</th>
        <th>Data wypożyczenia</th>
        <th>Termin zwrotu</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>${rental.device_model}</strong></td>
        <td style="font-family: monospace;">${rental.serial_number}</td>
        <td>${rentedDate}</td>
        <td><strong>${dueDate}</strong></td>
      </tr>
      ${rental.notes ? `
      <tr>
        <td colspan="4" style="color: #6b7280;"><strong>Uwagi / wyposażenie:</strong> ${rental.notes}</td>
      </tr>` : ''}
    </tbody>
  </table>

  <div class="page-bottom">
    <div class="terms">
      <h3>Warunki wypożyczenia</h3>
      <ol>
        <li>Sprzęt pozostaje własnością TAKMA Tadeusz Tiuchty i zostaje wypożyczony nieodpłatnie na czas 14 dni.</li>
        <li>Korzystający zobowiązuje się zwrócić sprzęt w terminie do <strong>${dueDate}</strong> lub niezwłocznie na wezwanie serwisu — kompletny i w stanie niepogorszonym.</li>
        <li>Korzystający odpowiada za uszkodzenie, zniszczenie lub utratę sprzętu w okresie wypożyczenia do wysokości kosztów naprawy lub odtworzenia sprzętu.</li>
        <li>Podpisany protokół należy odesłać do serwisu niezwłocznie po otrzymaniu sprzętu.</li>
      </ol>
    </div>

    <div class="signatures">
      <div class="sig">
        <div style="height: 40px;"></div>
        <div class="line"></div>
        <p>Data i podpis wydającego (serwis)</p>
      </div>
      <div class="sig">
        <div style="height: 40px;"></div>
        <div class="line"></div>
        <p>Data i podpis Korzystającego (klient)</p>
      </div>
    </div>

    <div class="footer">
      TAKMA Tadeusz Tiuchty · ul. Poświęcka 1a, 51-128 Wrocław · NIP: 9151004377 · www.takma.com.pl
    </div>
  </div>
</body>
</html>
`

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (error: any) {
    console.error('❌ Error in GET /api/admin/rentals/[id]/print:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}

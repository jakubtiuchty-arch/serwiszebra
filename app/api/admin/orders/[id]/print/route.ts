import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const orderId = params.id

    // Pobierz zamówienie
    const { data: order, error: orderError } = await supabase
      .from('shop_orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return new NextResponse('Zamówienie nie znalezione', { status: 404 })
    }

    const items = order.items || []

    const customerData = {
      companyName: order.company_name,
      nip: order.nip,
      contactName: order.contact_name,
      email: order.email,
      phone: order.phone,
      street: `${order.street} ${order.house_number}${order.apartment_number ? '/' + order.apartment_number : ''}`,
      city: order.city,
      postalCode: order.postal_code,
      notes: order.notes
    }

    const subtotalNetto = items.reduce((sum: number, item: any) => sum + ((item.priceNetto || item.price) * item.quantity), 0)
    const subtotalBrutto = items.reduce((sum: number, item: any) => sum + ((item.priceBrutto || item.price_brutto) * item.quantity), 0)
    const vatAmount = subtotalBrutto - subtotalNetto

    const shortId = order.order_number || orderId.split('-')[0].toUpperCase()
    const orderDate = new Date(order.created_at).toLocaleDateString('pl-PL')

    const url = new URL(request.url)
    const baseUrl = `${url.protocol}//${url.host}`

    // Status mapping
    const statusLabels: Record<string, string> = {
      new: 'Nowe',
      confirmed: 'Potwierdzone',
      processing: 'W realizacji',
      shipped: 'Wysłane',
      delivered: 'Dostarczone',
      completed: 'Zrealizowane',
      cancelled: 'Anulowane'
    }
    const statusLabel = statusLabels[order.status] || order.status

    const itemsRows = items.map((item: any, index: number) => {
      const priceNetto = item.priceNetto || item.price
      const priceBrutto = item.priceBrutto || item.price_brutto
      const totalNetto = priceNetto * item.quantity
      const totalBrutto = priceBrutto * item.quantity

      return `
        <tr>
          <td>${index + 1}</td>
          <td>
            <div class="service-name">${item.name}</div>
            ${item.sku ? `<div class="service-notes">PN: ${item.sku}</div>` : ''}
          </td>
          <td>${item.quantity} szt.</td>
          <td class="amount">${priceNetto.toFixed(2)} zł</td>
          <td style="text-align: center;">23%</td>
          <td class="amount">${totalNetto.toFixed(2)} zł</td>
          <td class="amount">${totalBrutto.toFixed(2)} zł</td>
        </tr>
      `
    }).join('')

    const html = `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Zamówienie ${shortId} - TAKMA Sklep</title>
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
    .logos-row {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .logo-img { height: 55px; width: auto; }
    .badge-img { height: 45px; width: auto; }
    .doc-title { text-align: right; }
    .doc-title h1 { font-size: 24px; color: #1e3a5f; margin-bottom: 5px; letter-spacing: 1px; }
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

    .info-bar {
      display: flex;
      justify-content: space-between;
      margin-bottom: 25px;
      padding: 12px 15px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 6px;
      border: 1px solid #e2e8f0;
    }
    .info-item { text-align: center; flex: 1; }
    .info-label { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    .info-value { font-weight: bold; font-size: 13px; margin-top: 3px; }
    .status-badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }

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

    .delivery-info {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
      border: 1px solid #86efac;
    }
    .delivery-title { font-weight: bold; color: #166534; margin-bottom: 8px; font-size: 12px; }
    .delivery-row { display: flex; margin-bottom: 4px; }
    .delivery-label { width: 130px; color: #475569; font-size: 11px; }
    .delivery-value { font-weight: 600; font-size: 11px; }

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
      <strong>Zamówienie ${shortId}</strong> - Kliknij przycisk aby wydrukować lub zapisać jako PDF
    </div>
    <button class="print-btn" onclick="window.print()">🖨️ Drukuj / Zapisz PDF</button>
  </div>

  <div class="document">
    <div class="header">
      <div class="logo-section">
        <div class="logos-row">
          <img src="${baseUrl}/takma_logo_1.png" alt="TAKMA" class="logo-img" />
          <img src="${baseUrl}/premier-partner-1.png" alt="Premier Partner" class="badge-img" />
        </div>
      </div>
      <div class="doc-title">
        <h1>ZAMÓWIENIE</h1>
        <div class="number">Nr: ${shortId}</div>
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
        <div class="party-name">${customerData.companyName}</div>
        ${customerData.contactName ? `<div class="party-text">${customerData.contactName}</div>` : ''}
        <div class="party-text">${customerData.street}</div>
        <div class="party-text">${customerData.postalCode} ${customerData.city}</div>
        <div class="party-text"><strong>NIP: ${customerData.nip}</strong></div>
        <div class="party-text">Email: ${customerData.email}</div>
        ${customerData.phone ? `<div class="party-text">Tel: ${customerData.phone}</div>` : ''}
      </div>
    </div>

    <div class="info-bar">
      <div class="info-item">
        <div class="info-label">Data złożenia</div>
        <div class="info-value">${orderDate}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Status</div>
        <div class="info-value">${statusLabel}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Nr zamówienia</div>
        <div class="info-value">${shortId}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width: 35px;">Lp.</th>
          <th>Nazwa produktu</th>
          <th style="width: 60px;">Ilość</th>
          <th style="width: 90px; text-align: right;">Cena netto</th>
          <th style="width: 50px; text-align: center;">VAT</th>
          <th style="width: 90px; text-align: right;">Netto</th>
          <th style="width: 90px; text-align: right;">Brutto</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div class="summary">
      <div class="summary-box">
        <div class="summary-row">
          <span>Wartość netto:</span>
          <span>${subtotalNetto.toFixed(2)} zł</span>
        </div>
        <div class="summary-row">
          <span>VAT 23%:</span>
          <span>${vatAmount.toFixed(2)} zł</span>
        </div>
        <div class="summary-total">
          <span>Razem brutto:</span>
          <span>${subtotalBrutto.toFixed(2)} zł</span>
        </div>
      </div>
    </div>

    ${order.tracking_number || order.courier_name ? `
    <div class="delivery-info">
      <div class="delivery-title">Informacje o dostawie</div>
      ${order.courier_name ? `
      <div class="delivery-row">
        <span class="delivery-label">Kurier:</span>
        <span class="delivery-value">${order.courier_name}</span>
      </div>` : ''}
      ${order.tracking_number ? `
      <div class="delivery-row">
        <span class="delivery-label">Nr przesyłki:</span>
        <span class="delivery-value">${order.tracking_number}</span>
      </div>` : ''}
    </div>
    ` : ''}

    ${customerData.notes ? `
    <div style="background: #fef3c7; padding: 12px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #fcd34d;">
      <strong style="color: #92400e;">Uwagi do zamówienia:</strong>
      <p style="margin-top: 5px; color: #78350f;">${customerData.notes}</p>
    </div>
    ` : ''}

    <div class="footer">
      <p>Dokument wygenerowany automatycznie przez system serwis-zebry.pl</p>
      <p style="margin-top: 8px;">TAKMA - Autoryzowany Serwis i Dystrybutor Zebra Technologies</p>
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
      },
    })

  } catch (error: any) {
    console.error('Error generating order print:', error)
    return new NextResponse('Internal server error: ' + error.message, { status: 500 })
  }
}

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderEmailData {
  orderNumber: string
  customerEmail: string
  customerName: string
  companyName: string
  items: Array<{
    name: string
    sku: string
    quantity: number
    price: number
    price_brutto: number
  }>
  subtotalBrutto: number
  deliveryCostBrutto: number
  totalBrutto: number
  paymentMethod: string
  deliveryMethod: string
  customer: {
    street: string
    postalCode: string
    city: string
    phone: string
  }
  proformaPdf?: Buffer
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  try {
    // Email do klienta
    const customerEmail = await resend.emails.send({
      from: 'TAKMA Serwis <zamowienia@serwiszebra.pl>',
      to: data.customerEmail,
      subject: `Potwierdzenie zamówienia ${data.orderNumber}`,
      html: generateOrderEmailHTML(data),
      attachments: data.proformaPdf ? [{
        filename: `faktura-proforma-${data.orderNumber.replace(/\//g, '-')}.pdf`,
        content: data.proformaPdf
      }] : []
    })
    
    // Email powiadomienia dla firmy
    const notificationEmail = await resend.emails.send({
      from: 'System Zamówień <system@serwiszebra.pl>',
      to: 'zamowienia@serwiszebra.pl', // Twój email
      subject: `Nowe zamówienie ${data.orderNumber} - ${data.companyName}`,
      html: generateNotificationEmailHTML(data)
    })
    
    return { customerEmail, notificationEmail }
    
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

function generateOrderEmailHTML(data: OrderEmailData): string {
  const itemsRows = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="font-weight: 600; color: #111827;">${item.name}</div>
        <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">PN: ${item.sku}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        ${item.price_brutto.toFixed(2)} zł
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
        ${(item.price_brutto * item.quantity).toFixed(2)} zł
      </td>
    </tr>
  `).join('')

  const deliveryText = data.deliveryMethod === 'courier' 
    ? 'Dostawa kurierem DPD/InPost' 
    : 'Odbiór osobisty'

  const paymentText = data.paymentMethod === 'proforma' 
    ? 'Faktura pro forma (w załączniku)'
    : data.paymentMethod === 'bankTransfer'
    ? 'Przelew bankowy'
    : 'Płatność online'

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        
        <!-- Header -->
        <div style="background-color: #111827; padding: 32px 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">
            TAKMA SERWIS
          </h1>
          <p style="color: #e5e7eb; margin: 8px 0 0 0; font-size: 14px;">
            Autoryzowany Serwis Zebra
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 32px 24px;">
          
          <!-- Success message -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background-color: #10b981; width: 64px; height: 64px; border-radius: 50%; margin-bottom: 16px;">
              <div style="color: white; font-size: 32px; line-height: 64px;">✓</div>
            </div>
            <h2 style="margin: 0 0 8px 0; font-size: 24px; color: #111827;">
              Dziękujemy za zamówienie!
            </h2>
            <p style="margin: 0; color: #6b7280;">
              Twoje zamówienie zostało przyjęte do realizacji
            </p>
          </div>

          <!-- Order info -->
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%;">
              <tr>
                <td style="color: #6b7280; font-size: 14px;">Numer zamówienia:</td>
                <td style="text-align: right; font-weight: 600; color: #111827;">${data.orderNumber}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding-top: 8px;">Data:</td>
                <td style="text-align: right; padding-top: 8px;">${new Date().toLocaleDateString('pl-PL')}</td>
              </tr>
            </table>
          </div>

          <!-- Items -->
          <h3 style="margin: 0 0 16px 0; font-size: 18px; color: #111827;">
            Zamówione produkty
          </h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #374151; text-transform: uppercase;">
                  Produkt
                </th>
                <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: 600; color: #374151; text-transform: uppercase;">
                  Ilość
                </th>
                <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #374151; text-transform: uppercase;">
                  Cena
                </th>
                <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #374151; text-transform: uppercase;">
                  Wartość
                </th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                  <div style="color: #111827;">${deliveryText}</div>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
                  1
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                  ${data.deliveryCostBrutto.toFixed(2)} zł
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
                  ${data.deliveryCostBrutto.toFixed(2)} zł
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 16px 12px; text-align: right; font-size: 18px; font-weight: 700; color: #111827;">
                  SUMA:
                </td>
                <td style="padding: 16px 12px; text-align: right; font-size: 18px; font-weight: 700; color: #059669;">
                  ${data.totalBrutto.toFixed(2)} zł
                </td>
              </tr>
            </tfoot>
          </table>

          <!-- Delivery & Payment info -->
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #92400e;">
              Informacje o dostawie i płatności
            </h4>
            <table style="width: 100%;">
              <tr>
                <td style="color: #92400e; font-size: 14px; padding: 4px 0;">Sposób dostawy:</td>
                <td style="text-align: right; font-weight: 600; color: #451a03;">${deliveryText}</td>
              </tr>
              <tr>
                <td style="color: #92400e; font-size: 14px; padding: 4px 0;">Metoda płatności:</td>
                <td style="text-align: right; font-weight: 600; color: #451a03;">${paymentText}</td>
              </tr>
              <tr>
                <td style="color: #92400e; font-size: 14px; padding: 4px 0;">Adres dostawy:</td>
                <td style="text-align: right; color: #451a03;">
                  ${data.customer.street}<br>
                  ${data.customer.postalCode} ${data.customer.city}
                </td>
              </tr>
            </table>
          </div>

          <!-- Payment instructions -->
          ${data.paymentMethod === 'bankTransfer' || data.paymentMethod === 'proforma' ? `
            <div style="background-color: #dbeafe; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
              <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #1e40af;">
                Dane do przelewu
              </h4>
              <table style="width: 100%;">
                <tr>
                  <td style="color: #1e40af; font-size: 14px; padding: 4px 0;">Odbiorca:</td>
                  <td style="text-align: right; font-weight: 600; color: #1e3a8a;">TAKMA Tadeusz Tiuchty</td>
                </tr>
                <tr>
                  <td style="color: #1e40af; font-size: 14px; padding: 4px 0;">Numer konta:</td>
                  <td style="text-align: right; font-weight: 600; color: #1e3a8a;">39 1020 5297 0000 1902 0283 3069</td>
                </tr>
                <tr>
                  <td style="color: #1e40af; font-size: 14px; padding: 4px 0;">Bank:</td>
                  <td style="text-align: right; color: #1e3a8a;">PKO Bank Polski</td>
                </tr>
                <tr>
                  <td style="color: #1e40af; font-size: 14px; padding: 4px 0;">Tytuł:</td>
                  <td style="text-align: right; font-weight: 600; color: #1e3a8a;">Zamówienie ${data.orderNumber}</td>
                </tr>
                <tr>
                  <td style="color: #1e40af; font-size: 14px; padding: 4px 0;">Kwota:</td>
                  <td style="text-align: right; font-weight: 700; font-size: 16px; color: #1e3a8a;">${data.totalBrutto.toFixed(2)} zł</td>
                </tr>
              </table>
            </div>
          ` : ''}

          <!-- Contact -->
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0 0 8px 0;">Masz pytania? Skontaktuj się z nami:</p>
            <p style="margin: 0;">
              <strong>Tel:</strong> +48 607 819 688<br>
              <strong>Email:</strong> zamowienia@serwiszebra.pl
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 24px; text-align: center; color: #6b7280; font-size: 12px;">
          <p style="margin: 0 0 4px 0;">
            TAKMA Tadeusz Tiuchty | ul. Poświęcka 1a, 51-128 Wrocław
          </p>
          <p style="margin: 0;">
            NIP: 9151004377 | www.serwiszebra.pl
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}

function generateNotificationEmailHTML(data: OrderEmailData): string {
  const itemsList = data.items.map(item => 
    `• ${item.name} (${item.sku}) - ${item.quantity} szt.`
  ).join('\n')

  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif;">
      <h2>Nowe zamówienie ${data.orderNumber}</h2>
      
      <h3>Dane klienta:</h3>
      <p>
        <strong>Firma:</strong> ${data.companyName}<br>
        <strong>Osoba:</strong> ${data.customerName}<br>
        <strong>Email:</strong> ${data.customerEmail}<br>
        <strong>Telefon:</strong> ${data.customer.phone}<br>
        <strong>Adres:</strong> ${data.customer.street}, ${data.customer.postalCode} ${data.customer.city}
      </p>
      
      <h3>Zamówione produkty:</h3>
      <pre>${itemsList}</pre>
      
      <h3>Podsumowanie:</h3>
      <p>
        <strong>Dostawa:</strong> ${data.deliveryMethod === 'courier' ? 'Kurier' : 'Odbiór osobisty'}<br>
        <strong>Płatność:</strong> ${data.paymentMethod}<br>
        <strong>Suma:</strong> ${data.totalBrutto.toFixed(2)} zł
      </p>
    </body>
    </html>
  `
}
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// URL bazowy dla obrazków w emailach (hostowane na serwiszebra.pl)
const EMAIL_ASSETS_URL = 'https://serwiszebra.pl'

// Wspólny header dla wszystkich maili do klientów - z logotypami hostowanymi na serwerze
function getEmailHeader(): string {
  return `
    <!-- Header -->
    <div style="background-color: #111827; padding: 20px 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <!-- Lewa strona: Logo TAKMA + odznaki partnerskie -->
          <td style="text-align: left; vertical-align: middle;">
            <img src="${EMAIL_ASSETS_URL}/takma_logo_1.png" alt="TAKMA" style="height: 28px; width: auto; display: inline-block; vertical-align: middle;">
            <img src="${EMAIL_ASSETS_URL}/premier-partner-1.png" alt="Zebra Premier Partner" style="height: 24px; width: auto; display: inline-block; vertical-align: middle; margin-left: 12px;">
            <img src="${EMAIL_ASSETS_URL}/repair_specialist.png" alt="Repair Specialist" style="height: 24px; width: auto; display: inline-block; vertical-align: middle; margin-left: 8px;">
          </td>
          <!-- Prawa strona: Serwis Zebra -->
          <td style="text-align: right; vertical-align: middle;">
            <span style="color: white; font-size: 20px; font-weight: 700; letter-spacing: 1px;">
              SERWIS ZEBRA
            </span>
          </td>
        </tr>
      </table>
    </div>
  `
}

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
      from: 'SERWIS ZEBRA <zamowienia@serwiszebra.pl>',
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
    SERWIS ZEBRA
  </h1>
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
            NIP: 9151004377 &nbsp;|&nbsp; www.serwiszebra.pl
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
// ========== EMAIL O WYSYŁCE NAPRAWY ==========

interface RepairShippedEmailData {
  customerEmail: string
  customerName: string
  repairId: string
  deviceModel: string
  courierName: string
  trackingNumber: string
  trackingUrl: string
}

export async function sendRepairShippedEmail(data: RepairShippedEmailData) {
  try {
    const email = await resend.emails.send({
      from: 'Serwis Zebra <serwis@serwiszebra.pl>',
      to: data.customerEmail,
      subject: `Twoje urządzenie zostało wysłane! - ${data.deviceModel}`,
      html: generateRepairShippedHTML(data)
    })
    
    console.log('[Email] Repair shipped email sent:', email)
    return email
    
  } catch (error) {
    console.error('[Email] Error sending repair shipped email:', error)
    throw error
  }
}

function generateRepairShippedHTML(data: RepairShippedEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        
${getEmailHeader()}

        <!-- Content -->
        <div style="padding: 32px 24px;">
          
          <!-- Success message -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background-color: #10b981; width: 64px; height: 64px; border-radius: 50%; margin-bottom: 16px;">
              <div style="color: white; font-size: 32px; line-height: 64px;">✓</div>
            </div>
            <h2 style="margin: 0 0 8px 0; font-size: 24px; color: #111827;">
              Twoje urządzenie jest w drodze!
            </h2>
            <p style="margin: 0; color: #6b7280;">
              Naprawa zakończona - wysyłamy Twoje urządzenie
            </p>
          </div>

          <!-- Device info -->
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%;">
              <tr>
                <td style="color: #6b7280; font-size: 14px;">Urządzenie:</td>
                <td style="text-align: right; font-weight: 600; color: #111827;">${data.deviceModel}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding-top: 8px;">Nr zgłoszenia:</td>
                <td style="text-align: right; padding-top: 8px; font-family: monospace;">${data.repairId}</td>
              </tr>
            </table>
          </div>

          <!-- Tracking info -->
          <div style="background-color: #dbeafe; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #1e40af;">
              Śledzenie przesyłki
            </h4>
            <table style="width: 100%;">
              <tr>
                <td style="color: #1e40af; font-size: 14px; padding: 4px 0;">Kurier:</td>
                <td style="text-align: right; font-weight: 600; color: #1e3a8a;">${data.courierName}</td>
              </tr>
              <tr>
                <td style="color: #1e40af; font-size: 14px; padding: 4px 0;">Numer przesyłki:</td>
                <td style="text-align: right; font-weight: 600; color: #1e3a8a; font-family: monospace;">${data.trackingNumber}</td>
              </tr>
            </table>
            
            <div style="text-align: center; margin-top: 16px;">
              <a href="${data.trackingUrl}" 
                 style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                Śledź przesyłkę
              </a>
            </div>
          </div>

          <!-- Delivery info -->
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h4 style="margin: 0 0 8px 0; font-size: 16px; color: #92400e;">
              Szacowany czas dostawy
            </h4>
            <p style="margin: 0; color: #451a03; font-weight: 600;">
              1-2 dni robocze
            </p>
          </div>

          <!-- Contact -->
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0 0 8px 0;">Masz pytania? Skontaktuj się z nami:</p>
            <p style="margin: 0;">
              <strong>Tel:</strong> +48 607 819 688<br>
              <strong>Email:</strong> serwis@serwiszebra.pl
            </p>
          </div>

        </div>

      </div>
    </body>
    </html>
  `
}

// ========== EMAIL O GOTOWEJ WYCENIE - DO KLIENTA ==========

interface QuoteReadyEmailData {
  to: string
  customerName: string
  repairId: string
  deviceModel: string
  amount: number
  notes?: string
}

export async function sendQuoteReadyEmail(data: QuoteReadyEmailData) {
  try {
    const shortId = data.repairId.split('-')[0].toUpperCase()
    
    const email = await resend.emails.send({
      from: 'Serwis Zebra <serwis@serwiszebra.pl>',
      to: data.to,
      subject: `Wycena naprawy gotowa - ${data.deviceModel} #${shortId}`,
      html: generateQuoteReadyHTML(data, shortId)
    })
    
    console.log('[Email] Quote ready email sent to customer:', email)
    return email
    
  } catch (error) {
    console.error('[Email] Error sending quote ready email:', error)
    throw error
  }
}

function generateQuoteReadyHTML(data: QuoteReadyEmailData, shortId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        
${getEmailHeader()}

        <!-- Content -->
        <div style="padding: 32px 24px;">
          
          <!-- Icon -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background-color: #f59e0b; width: 64px; height: 64px; border-radius: 50%; margin-bottom: 16px;">
              <div style="color: white; font-size: 32px; line-height: 64px;">$</div>
            </div>
            <h2 style="margin: 0 0 8px 0; font-size: 24px; color: #111827;">
              Wycena gotowa!
            </h2>
            <p style="margin: 0; color: #6b7280;">
              Zaakceptuj wycenę, aby rozpocząć naprawę
            </p>
          </div>

          <!-- Quote info -->
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%;">
              <tr>
                <td style="color: #6b7280; font-size: 14px;">Nr zgłoszenia:</td>
                <td style="text-align: right; font-weight: 600; color: #111827; font-family: monospace;">#${shortId}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding-top: 8px;">Urządzenie:</td>
                <td style="text-align: right; padding-top: 8px; font-weight: 600;">${data.deviceModel}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding-top: 12px;">Koszt naprawy:</td>
                <td style="text-align: right; padding-top: 12px; font-weight: 700; font-size: 24px; color: #059669;">${(data.amount || 0).toFixed(2)} zł</td>
              </tr>
            </table>
          </div>

          ${data.notes ? `
          <!-- Notes -->
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #92400e;">Notatka od serwisu:</h4>
            <p style="margin: 0; color: #451a03; font-size: 14px;">${data.notes}</p>
          </div>
          ` : ''}

          <!-- Next steps -->
          <div style="background-color: #dbeafe; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #1e40af;">
              Co dalej?
            </h4>
            <ol style="margin: 0; padding-left: 20px; color: #1e3a8a; font-size: 14px; line-height: 1.8;">
              <li>Zaloguj się do Panelu Klienta</li>
              <li>Zaakceptuj wycenę</li>
              <li>Wybierz metodę płatności (karta/BLIK lub przelew)</li>
              <li>Po opłaceniu rozpoczniemy naprawę!</li>
            </ol>
          </div>

          <!-- CTA -->
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://serwiszebra.pl/panel/naprawa/${data.repairId}" 
               style="display: inline-block; background-color: #f59e0b; color: white; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              Zaakceptuj wycenę
            </a>
          </div>

          <!-- Contact -->
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0 0 8px 0;">Masz pytania? Skontaktuj się z nami:</p>
            <p style="margin: 0;">
              <strong>Tel:</strong> +48 607 819 688<br>
              <strong>Email:</strong> serwis@serwiszebra.pl
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 24px; text-align: center; color: #6b7280; font-size: 12px;">
          <p style="margin: 0 0 4px 0;">
            TAKMA Tadeusz Tiuchty | ul. Poświęcka 1a, 51-128 Wrocław
          </p>
          <p style="margin: 0;">
            NIP: 9151004377 &nbsp;|&nbsp; www.serwiszebra.pl
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}

// ========== EMAIL O PRO FORMIE - DO ADMINA ==========

interface ProFormaAdminEmailData {
  to: string
  repairId: string
  customerName: string
  deviceModel: string
  amount: number
}

export async function sendProFormaAdminEmail(data: ProFormaAdminEmailData) {
  try {
    const shortId = data.repairId.split('-')[0].toUpperCase()
    
    const email = await resend.emails.send({
      from: 'System Serwisowy <system@serwiszebra.pl>',
      to: data.to,
      subject: `📄 Pro Forma wybrana - naprawa #${shortId}`,
      html: generateProFormaAdminHTML(data, shortId)
    })
    
    console.log('[Email] Pro Forma admin notification sent:', email)
    return email
    
  } catch (error) {
    console.error('[Email] Error sending Pro Forma admin email:', error)
    throw error
  }
}

function generateProFormaAdminHTML(data: ProFormaAdminEmailData, shortId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px;">
        
        <div style="background-color: #f59e0b; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0;">📄 Klient wybrał Pro Forma</h2>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">Szczegóły naprawy:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Nr zgłoszenia:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-family: monospace;">#${shortId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Klient:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Urządzenie:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${data.deviceModel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Kwota:</strong></td>
              <td style="padding: 8px 0; font-weight: bold; color: #059669;">${data.amount.toFixed(2)} zł</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; color: #92400e;">
            ⏳ Oczekiwanie na przelew od klienta. Po zaksięgowaniu wpłaty zmień status na "W naprawie".
          </p>
        </div>

        <div style="text-align: center;">
          <a href="https://serwiszebra.pl/admin/zgloszenie/${data.repairId}" 
             style="display: inline-block; background-color: #111827; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Przejdź do zgłoszenia
          </a>
        </div>

      </div>
    </body>
    </html>
  `
}

// ========== EMAIL O OPŁACONEJ NAPRAWIE - KLIENT ==========

interface RepairPaidEmailData {
  to: string
  customerName: string
  repairId: string
  deviceModel: string
  amount: number
}

export async function sendRepairPaidEmail(data: RepairPaidEmailData) {
  try {
    const shortId = data.repairId.split('-')[0].toUpperCase()
    
    const email = await resend.emails.send({
      from: 'Serwis Zebra <serwis@serwiszebra.pl>',
      to: data.to,
      subject: `Płatność potwierdzona - naprawa ${data.deviceModel}`,
      html: generateRepairPaidClientHTML(data, shortId)
    })
    
    console.log('[Email] Repair paid confirmation sent to client:', email)
    return email
    
  } catch (error) {
    console.error('[Email] Error sending repair paid email to client:', error)
    throw error
  }
}

function generateRepairPaidClientHTML(data: RepairPaidEmailData, shortId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        
${getEmailHeader()}

        <!-- Content -->
        <div style="padding: 32px 24px;">
          
          <!-- Success message -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background-color: #10b981; width: 64px; height: 64px; border-radius: 50%; margin-bottom: 16px;">
              <div style="color: white; font-size: 32px; line-height: 64px;">✓</div>
            </div>
            <h2 style="margin: 0 0 8px 0; font-size: 24px; color: #111827;">
              Płatność otrzymana!
            </h2>
            <p style="margin: 0; color: #6b7280;">
              Rozpoczynamy naprawę Twojego urządzenia
            </p>
          </div>

          <!-- Payment info -->
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%;">
              <tr>
                <td style="color: #6b7280; font-size: 14px;">Urządzenie:</td>
                <td style="text-align: right; font-weight: 600; color: #111827;">${data.deviceModel}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding-top: 8px;">Nr zgłoszenia:</td>
                <td style="text-align: right; padding-top: 8px; font-family: monospace;">#${shortId}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding-top: 8px;">Kwota:</td>
                <td style="text-align: right; padding-top: 8px; font-weight: 700; font-size: 18px; color: #059669;">${data.amount.toFixed(2)} zł</td>
              </tr>
            </table>
          </div>

          <!-- Status info -->
          <div style="background-color: #dbeafe; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h4 style="margin: 0 0 8px 0; font-size: 16px; color: #1e40af;">
              Status naprawy: W naprawie
            </h4>
            <p style="margin: 0; color: #1e3a8a; font-size: 14px;">
              Twoje urządzenie jest obecnie naprawiane przez naszych specjalistów. Otrzymasz powiadomienie, gdy naprawa zostanie zakończona.
            </p>
          </div>

          <!-- Track repair -->
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://serwiszebra.pl/panel" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Sprawdź status w panelu
            </a>
          </div>

          <!-- Contact -->
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0 0 8px 0;">Masz pytania? Skontaktuj się z nami:</p>
            <p style="margin: 0;">
              <strong>Tel:</strong> +48 607 819 688<br>
              <strong>Email:</strong> serwis@serwiszebra.pl
            </p>
          </div>

        </div>

      </div>
    </body>
    </html>
  `
}

// ========== EMAIL O OPŁACONEJ NAPRAWIE - ADMIN ==========

interface RepairPaidAdminEmailData {
  to: string
  repairId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  deviceModel: string
  amount: number
}

export async function sendRepairPaidAdminEmail(data: RepairPaidAdminEmailData) {
  try {
    const shortId = data.repairId.split('-')[0].toUpperCase()
    
    const email = await resend.emails.send({
      from: 'System Serwisowy <system@serwiszebra.pl>',
      to: data.to,
      subject: `Płatność otrzymana - naprawa #${shortId}`,
      html: generateRepairPaidAdminHTML(data, shortId)
    })
    
    console.log('[Email] Repair paid notification sent to admin:', email)
    return email
    
  } catch (error) {
    console.error('[Email] Error sending repair paid email to admin:', error)
    throw error
  }
}

function generateRepairPaidAdminHTML(data: RepairPaidAdminEmailData, shortId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="background-color: #10b981; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0;">Płatność otrzymana</h2>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">Szczegóły naprawy:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0;"><strong>Nr zgłoszenia:</strong></td>
              <td style="padding: 8px 0; font-family: monospace;">#${shortId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Urządzenie:</strong></td>
              <td style="padding: 8px 0;">${data.deviceModel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Kwota:</strong></td>
              <td style="padding: 8px 0; font-size: 18px; font-weight: bold; color: #059669;">${data.amount.toFixed(2)} zł</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">Dane klienta:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0;"><strong>Imię i nazwisko:</strong></td>
              <td style="padding: 8px 0;">${data.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Email:</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${data.customerEmail}" style="color: #2563eb;">${data.customerEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Telefon:</strong></td>
              <td style="padding: 8px 0;"><a href="tel:${data.customerPhone}" style="color: #2563eb;">${data.customerPhone}</a></td>
            </tr>
          </table>
        </div>

        <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; color: #1e40af;">
            Status zgłoszenia został automatycznie zmieniony na "W naprawie". Sprawdź szczegóły w panelu administracyjnym.
          </p>
        </div>

        <div style="text-align: center;">
          <a href="https://serwiszebra.pl/admin" 
             style="display: inline-block; background-color: #111827; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Przejdź do panelu admina
          </a>
        </div>

      </div>
    </body>
    </html>
  `
}

// ========== EMAIL PO ZGŁOSZENIU NAPRAWY - KLIENT ==========

interface RepairSubmittedEmailData {
  to: string
  customerName: string
  repairId: string
  deviceType: string
  deviceModel: string
  problemDescription: string
  isWarranty: boolean
}

export async function sendRepairSubmittedEmail(data: RepairSubmittedEmailData) {
  try {
    const shortId = data.repairId.split('-')[0].toUpperCase()
    
    const email = await resend.emails.send({
      from: 'Serwis Zebra <serwis@serwiszebra.pl>',
      to: data.to,
      subject: `Zgłoszenie naprawy przyjęte - ${data.deviceModel} #${shortId}`,
      html: generateRepairSubmittedHTML(data, shortId)
    })
    
    console.log('[Email] Repair submitted confirmation sent:', email)
    return email
    
  } catch (error) {
    console.error('[Email] Error sending repair submitted email:', error)
    throw error
  }
}

function generateRepairSubmittedHTML(data: RepairSubmittedEmailData, shortId: string): string {
  const deviceTypeText = data.deviceType === 'printer' ? 'Drukarka' 
    : data.deviceType === 'terminal' ? 'Terminal' 
    : data.deviceType === 'scanner' ? 'Skaner' 
    : data.deviceType === 'tablet' ? 'Tablet'
    : 'Urządzenie'

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        
        ${getEmailHeader()}

        <!-- Content -->
        <div style="padding: 32px 24px;">
          
          <!-- Success message -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background-color: #10b981; width: 64px; height: 64px; border-radius: 50%; margin-bottom: 16px;">
              <div style="color: white; font-size: 32px; line-height: 64px;">✓</div>
            </div>
            <h2 style="margin: 0 0 8px 0; font-size: 24px; color: #111827;">
              Zgłoszenie przyjęte!
            </h2>
            <p style="margin: 0; color: #6b7280;">
              Dziękujemy za zgłoszenie naprawy
            </p>
          </div>

          <!-- Repair info -->
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%;">
              <tr>
                <td style="color: #6b7280; font-size: 14px;">Nr zgłoszenia:</td>
                <td style="text-align: right; font-weight: 600; color: #111827; font-family: monospace;">#${shortId}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding-top: 8px;">Typ urządzenia:</td>
                <td style="text-align: right; padding-top: 8px;">${deviceTypeText}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding-top: 8px;">Model:</td>
                <td style="text-align: right; padding-top: 8px; font-weight: 600;">${data.deviceModel}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding-top: 8px;">Typ naprawy:</td>
                <td style="text-align: right; padding-top: 8px;">
                  <span style="background-color: ${data.isWarranty ? '#dbeafe' : '#f3f4f6'}; color: ${data.isWarranty ? '#1e40af' : '#374151'}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                    ${data.isWarranty ? 'Gwarancyjna' : 'Płatna'}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <!-- Problem description -->
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #92400e; text-transform: uppercase;">
              Opis problemu
            </h4>
            <p style="margin: 0; color: #451a03; font-size: 14px; line-height: 1.5;">
              ${data.problemDescription}
            </p>
          </div>

          <!-- Next steps -->
          <div style="background-color: #dbeafe; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #1e40af;">
              Jak przebiega naprawa?
            </h4>
            <ol style="margin: 0; padding-left: 20px; color: #1e3a8a; font-size: 14px; line-height: 1.8;">
              <li>Spakuj urządzenie — kurier odbierze je pod wskazanym adresem</li>
              <li>Przeprowadzimy szczegółową diagnostykę</li>
              <li>Wyślemy Ci wycenę do akceptacji</li>
              <li>Po Twojej zgodzie i płatności zajmiemy się naprawą</li>
              <li>Gotowe urządzenie wróci do Ciebie kurierem</li>
            </ol>
          </div>

          <!-- Info about panel -->
          <div style="background-color: #dbeafe; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <p style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px;">
              <strong>Śledź postępy naprawy w swoim panelu klienta</strong>
            </p>
            <p style="margin: 0; color: #3b82f6; font-size: 13px;">
              Tam znajdziesz aktualny status, chat z serwisem i wszystkie szczegóły zgłoszenia.
            </p>
          </div>

          <!-- CTA button -->
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://serwiszebra.pl/panel" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Przejdź do panelu
            </a>
          </div>

          <!-- Contact -->
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0 0 8px 0;">Masz pytania? Skontaktuj się z nami:</p>
            <p style="margin: 0;">
              <strong>Tel:</strong> +48 607 819 688<br>
              <strong>Email:</strong> serwis@serwiszebra.pl
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 24px; text-align: center; color: #6b7280; font-size: 12px;">
          <p style="margin: 0 0 4px 0;">
            TAKMA Tadeusz Tiuchty | ul. Poświęcka 1a, 51-128 Wrocław
          </p>
          <p style="margin: 0;">
            NIP: 9151004377 &nbsp;|&nbsp; www.serwiszebra.pl
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}

// ========== EMAIL PO ZGŁOSZENIU NAPRAWY - ADMIN ==========

interface RepairSubmittedAdminEmailData {
  to: string
  repairId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  deviceType: string
  deviceModel: string
  problemDescription: string
  isWarranty: boolean
  priority: string
}

export async function sendRepairSubmittedAdminEmail(data: RepairSubmittedAdminEmailData) {
  try {
    const shortId = data.repairId.split('-')[0].toUpperCase()
    
    const email = await resend.emails.send({
      from: 'System Serwisowy <system@serwiszebra.pl>',
      to: data.to,
      subject: `Nowe zgłoszenie naprawy #${shortId} - ${data.deviceModel}`,
      html: generateRepairSubmittedAdminHTML(data, shortId)
    })
    
    console.log('[Email] Repair submitted notification sent to admin:', email)
    return email
    
  } catch (error) {
    console.error('[Email] Error sending repair submitted email to admin:', error)
    throw error
  }
}

function generateRepairSubmittedAdminHTML(data: RepairSubmittedAdminEmailData, shortId: string): string {
  const priorityColors: Record<string, string> = {
    'low': '#6b7280',
    'normal': '#2563eb',
    'high': '#f59e0b',
    'critical': '#dc2626'
  }
  const priorityLabels: Record<string, string> = {
    'low': 'Niski',
    'normal': 'Zwykły',
    'high': 'Wysoki',
    'critical': 'Krytyczny'
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="background-color: #2563eb; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0;">Nowe zgłoszenie naprawy</h2>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="margin-top: 0;">Szczegóły zgłoszenia:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0;"><strong>Nr zgłoszenia:</strong></td>
              <td style="padding: 8px 0; font-family: monospace;">#${shortId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Urządzenie:</strong></td>
              <td style="padding: 8px 0;">${data.deviceModel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Typ naprawy:</strong></td>
              <td style="padding: 8px 0;">
                <span style="background-color: ${data.isWarranty ? '#dbeafe' : '#f3f4f6'}; color: ${data.isWarranty ? '#1e40af' : '#374151'}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                  ${data.isWarranty ? 'GWARANCJA' : 'PŁATNA'}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Priorytet:</strong></td>
              <td style="padding: 8px 0;">
                <span style="color: ${priorityColors[data.priority] || '#6b7280'}; font-weight: 600;">
                  ${priorityLabels[data.priority] || data.priority}
                </span>
              </td>
            </tr>
          </table>
        </div>

        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 8px 0; color: #92400e;">Opis problemu:</h4>
          <p style="margin: 0; color: #451a03;">${data.problemDescription}</p>
        </div>

        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 8px 0; color: #166534;">Dane klienta:</h4>
          <p style="margin: 0; color: #166534;">
            <strong>Imię i nazwisko:</strong> ${data.customerName}<br>
            <strong>Email:</strong> ${data.customerEmail}<br>
            <strong>Telefon:</strong> ${data.customerPhone}
          </p>
        </div>

        <!-- WYMAGANA AKCJA - BARDZO WIDOCZNE -->
        <div style="background-color: #dc2626; padding: 24px; border-radius: 8px; text-align: center; border: 3px solid #991b1b;">
          <h3 style="margin: 0 0 12px 0; color: white; font-size: 20px; text-transform: uppercase; letter-spacing: 1px;">
            WYMAGANA AKCJA
          </h3>
          <p style="margin: 0 0 16px 0; color: white; font-size: 16px; font-weight: 500;">
            Zaloguj się do panelu admina i <strong style="text-decoration: underline;">ZAMÓW KURIERA</strong> po odbiór urządzenia!
          </p>
          <a href="https://serwiszebra.pl/admin/zgloszenie/${data.repairId}" 
             style="display: inline-block; background-color: white; color: #dc2626; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; text-transform: uppercase;">
            ZAMÓW KURIERA TERAZ
          </a>
        </div>

      </div>
    </body>
    </html>
  `
}

// ========== EMAIL PO REJESTRACJI ==========

interface WelcomeEmailData {
  to: string
  customerName: string
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  try {
    const email = await resend.emails.send({
      from: 'Serwis Zebra <serwis@serwiszebra.pl>',
      to: data.to,
      subject: `Witamy w Serwis Zebra!`,
      html: generateWelcomeHTML(data)
    })
    
    console.log('[Email] Welcome email sent:', email)
    return email
    
  } catch (error) {
    console.error('[Email] Error sending welcome email:', error)
    throw error
  }
}

function generateWelcomeHTML(data: WelcomeEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        
${getEmailHeader()}

        <!-- Content -->
        <div style="padding: 32px 24px;">
          
          <!-- Welcome message -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background-color: #10b981; width: 64px; height: 64px; border-radius: 50%; margin-bottom: 16px;">
              <div style="color: white; font-size: 32px; line-height: 64px;">✓</div>
            </div>
            <h2 style="margin: 0 0 8px 0; font-size: 24px; color: #111827;">
              Witamy, ${data.customerName}!
            </h2>
            <p style="margin: 0; color: #6b7280;">
              Twoje konto zostało utworzone pomyślnie
            </p>
          </div>

          <!-- Features -->
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h4 style="margin: 0 0 16px 0; font-size: 16px; color: #111827;">
              Co możesz zrobić w Panelu Klienta?
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 14px; line-height: 2;">
              <li>📋 Śledzić status wszystkich napraw w czasie rzeczywistym</li>
              <li>💬 Komunikować się z serwisem przez chat</li>
              <li>📄 Akceptować wyceny i opłacać naprawy online</li>
              <li>Zamawiać kuriera po odbiór urządzenia</li>
              <li>📊 Przeglądać historię napraw</li>
            </ul>
          </div>

          <!-- CTA -->
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://serwiszebra.pl/panel" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Przejdź do Panelu Klienta
            </a>
          </div>

          <!-- Info box -->
          <div style="background-color: #dbeafe; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h4 style="margin: 0 0 8px 0; font-size: 16px; color: #1e40af;">
              Autoryzowany Serwis Zebra
            </h4>
            <p style="margin: 0; color: #1e3a8a; font-size: 14px;">
              Jesteśmy oficjalnym partnerem serwisowym Zebra Technologies. Naprawiamy drukarki etykiet, terminale mobilne, skanery i tablety.
            </p>
          </div>

          <!-- Contact -->
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0 0 8px 0;">Potrzebujesz pomocy?</p>
            <p style="margin: 0;">
              <strong>Tel:</strong> +48 601 619 898<br>
              <strong>Email:</strong> serwis@serwiszebra.pl
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 24px; text-align: center; color: #6b7280; font-size: 12px;">
          <p style="margin: 0 0 4px 0;">
            TAKMA Tadeusz Tiuchty | ul. Poświęcka 1a, 51-128 Wrocław
          </p>
          <p style="margin: 0;">
            NIP: 9151004377 &nbsp;|&nbsp; www.serwiszebra.pl
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}

// ========== EMAIL PO AKCEPTACJI WYCENY ==========

interface QuoteAcceptedEmailData {
  to: string
  customerName: string
  repairId: string
  deviceModel: string
  amount: number
}

export async function sendQuoteAcceptedEmail(data: QuoteAcceptedEmailData) {
  try {
    const shortId = data.repairId.split('-')[0].toUpperCase()
    
    const email = await resend.emails.send({
      from: 'Serwis Zebra <serwis@serwiszebra.pl>',
      to: data.to,
      subject: `Wycena zaakceptowana - ${data.deviceModel} #${shortId}`,
      html: generateQuoteAcceptedHTML(data, shortId)
    })
    
    console.log('[Email] Quote accepted email sent:', email)
    return email
    
  } catch (error) {
    console.error('[Email] Error sending quote accepted email:', error)
    throw error
  }
}

function generateQuoteAcceptedHTML(data: QuoteAcceptedEmailData, shortId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        
${getEmailHeader()}

        <!-- Content -->
        <div style="padding: 32px 24px;">
          
          <!-- Success message -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background-color: #10b981; width: 64px; height: 64px; border-radius: 50%; margin-bottom: 16px;">
              <div style="color: white; font-size: 32px; line-height: 64px;">✓</div>
            </div>
            <h2 style="margin: 0 0 8px 0; font-size: 24px; color: #111827;">
              Wycena zaakceptowana!
            </h2>
            <p style="margin: 0; color: #6b7280;">
              Dziękujemy za akceptację wyceny
            </p>
          </div>

          <!-- Quote info -->
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%;">
              <tr>
                <td style="color: #6b7280; font-size: 14px;">Nr zgłoszenia:</td>
                <td style="text-align: right; font-weight: 600; color: #111827; font-family: monospace;">#${shortId}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding-top: 8px;">Urządzenie:</td>
                <td style="text-align: right; padding-top: 8px; font-weight: 600;">${data.deviceModel}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding-top: 8px;">Kwota do zapłaty:</td>
                <td style="text-align: right; padding-top: 8px; font-weight: 700; font-size: 20px; color: #059669;">${data.amount.toFixed(2)} zł</td>
              </tr>
            </table>
          </div>

          <!-- Payment info -->
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #92400e;">
              Oczekujemy na płatność
            </h4>
            <p style="margin: 0 0 16px 0; color: #451a03; font-size: 14px;">
              Aby rozpocząć naprawę, opłać wycenę w Panelu Klienta lub przelewem na konto:
            </p>
            <table style="width: 100%;">
              <tr>
                <td style="color: #92400e; font-size: 14px; padding: 4px 0;">Odbiorca:</td>
                <td style="text-align: right; font-weight: 600; color: #451a03;">TAKMA Tadeusz Tiuchty</td>
              </tr>
              <tr>
                <td style="color: #92400e; font-size: 14px; padding: 4px 0;">Nr konta:</td>
                <td style="text-align: right; font-weight: 600; color: #451a03; font-size: 12px;">39 1020 5297 0000 1902 0283 3069</td>
              </tr>
              <tr>
                <td style="color: #92400e; font-size: 14px; padding: 4px 0;">Tytuł:</td>
                <td style="text-align: right; font-weight: 600; color: #451a03;">Naprawa #${shortId}</td>
              </tr>
            </table>
          </div>

          <!-- CTA -->
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://serwiszebra.pl/panel" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Opłać w Panelu Klienta
            </a>
          </div>

          <!-- Contact -->
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0 0 8px 0;">Masz pytania?</p>
            <p style="margin: 0;">
              <strong>Tel:</strong> +48 601 619 898<br>
              <strong>Email:</strong> serwis@serwiszebra.pl
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 24px; text-align: center; color: #6b7280; font-size: 12px;">
          <p style="margin: 0 0 4px 0;">
            TAKMA Tadeusz Tiuchty | ul. Poświęcka 1a, 51-128 Wrocław
          </p>
          <p style="margin: 0;">
            NIP: 9151004377 &nbsp;|&nbsp; www.serwiszebra.pl
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}

// ========== EMAIL PO AKCEPTACJI WYCENY - ADMIN ==========

interface QuoteAcceptedAdminEmailData {
  to: string
  repairId: string
  customerName: string
  deviceModel: string
  amount: number
}

export async function sendQuoteAcceptedAdminEmail(data: QuoteAcceptedAdminEmailData) {
  try {
    const shortId = data.repairId.split('-')[0].toUpperCase()
    
    const email = await resend.emails.send({
      from: 'System Serwisowy <system@serwiszebra.pl>',
      to: data.to,
      subject: `✅ Wycena zaakceptowana - #${shortId}`,
      html: generateQuoteAcceptedAdminHTML(data, shortId)
    })
    
    console.log('[Email] Quote accepted notification sent to admin:', email)
    return email
    
  } catch (error) {
    console.error('[Email] Error sending quote accepted email to admin:', error)
    throw error
  }
}

function generateQuoteAcceptedAdminHTML(data: QuoteAcceptedAdminEmailData, shortId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <div style="background-color: #10b981; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0;">✅ Wycena zaakceptowana</h2>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0;"><strong>Nr zgłoszenia:</strong></td>
              <td style="padding: 8px 0; font-family: monospace;">#${shortId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Klient:</strong></td>
              <td style="padding: 8px 0;">${data.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Urządzenie:</strong></td>
              <td style="padding: 8px 0;">${data.deviceModel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>Kwota:</strong></td>
              <td style="padding: 8px 0; font-size: 18px; font-weight: bold; color: #059669;">${data.amount.toFixed(2)} zł</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; color: #92400e;">
            ⏳ Oczekiwanie na płatność od klienta. Po otrzymaniu płatności status zmieni się automatycznie na "W naprawie".
          </p>
        </div>

        <div style="text-align: center;">
          <a href="https://serwiszebra.pl/admin/zgloszenie/${data.repairId}" 
             style="display: inline-block; background-color: #111827; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            Zobacz zgłoszenie
          </a>
        </div>

      </div>
    </body>
    </html>
  `
}

// ========== EMAIL O ZMIANIE STATUSU NAPRAWY ==========

interface RepairStatusChangedEmailData {
  to: string
  customerName: string
  repairId: string
  deviceModel: string
  oldStatus: string
  newStatus: string
  note?: string
}

export async function sendRepairStatusChangedEmail(data: RepairStatusChangedEmailData) {
  try {
    const shortId = data.repairId.split('-')[0].toUpperCase()
    
    const email = await resend.emails.send({
      from: 'Serwis Zebra <serwis@serwiszebra.pl>',
      to: data.to,
      subject: `Status naprawy zmieniony - ${data.deviceModel} #${shortId}`,
      html: generateRepairStatusChangedHTML(data, shortId)
    })
    
    console.log('[Email] Repair status changed email sent:', email)
    return email
    
  } catch (error) {
    console.error('[Email] Error sending repair status changed email:', error)
    throw error
  }
}

function generateRepairStatusChangedHTML(data: RepairStatusChangedEmailData, shortId: string): string {
  const statusLabels: Record<string, string> = {
    'nowe': 'Nowe',
    'odebrane': 'Odebrane',
    'diagnoza': 'Diagnoza',
    'wycena': 'Wycena do akceptacji',
    'oczekiwanie_na_platnosc': 'Oczekiwanie na płatność',
    'w_naprawie': 'W naprawie',
    'naprawione': 'Naprawione',
    'wyslane': 'Wysłane',
    'zakonczone': 'Zakończone',
    'anulowane': 'Anulowane'
  }

  const statusColors: Record<string, string> = {
    'nowe': '#2563eb',
    'odebrane': '#8b5cf6',
    'diagnoza': '#f59e0b',
    'wycena': '#f59e0b',
    'oczekiwanie_na_platnosc': '#f59e0b',
    'w_naprawie': '#8b5cf6',
    'naprawione': '#10b981',
    'wyslane': '#10b981',
    'zakonczone': '#10b981',
    'anulowane': '#dc2626'
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        
${getEmailHeader()}

        <!-- Content -->
        <div style="padding: 32px 24px;">
          
          <!-- Status message -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background-color: ${statusColors[data.newStatus] || '#2563eb'}; width: 64px; height: 64px; border-radius: 50%; margin-bottom: 16px;">
              <div style="color: white; font-size: 32px; line-height: 64px;">📋</div>
            </div>
            <h2 style="margin: 0 0 8px 0; font-size: 24px; color: #111827;">
              Status naprawy zmieniony
            </h2>
            <p style="margin: 0; color: #6b7280;">
              ${data.deviceModel} • #${shortId}
            </p>
          </div>

          <!-- Status change -->
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <div style="display: inline-block; padding: 8px 16px; background-color: #e5e7eb; color: #6b7280; border-radius: 6px; font-size: 14px; text-decoration: line-through;">
              ${statusLabels[data.oldStatus] || data.oldStatus}
            </div>
            <div style="display: inline-block; margin: 0 12px; color: #9ca3af;">→</div>
            <div style="display: inline-block; padding: 8px 16px; background-color: ${statusColors[data.newStatus] || '#2563eb'}; color: white; border-radius: 6px; font-size: 14px; font-weight: 600;">
              ${statusLabels[data.newStatus] || data.newStatus}
            </div>
          </div>

          ${data.note ? `
          <!-- Note -->
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #92400e; text-transform: uppercase;">
              Notatka od serwisu
            </h4>
            <p style="margin: 0; color: #451a03; font-size: 14px;">
              ${data.note}
            </p>
          </div>
          ` : ''}

          <!-- CTA -->
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://serwiszebra.pl/panel" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Sprawdź szczegóły
            </a>
          </div>

          <!-- Contact -->
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0 0 8px 0;">Masz pytania?</p>
            <p style="margin: 0;">
              <strong>Tel:</strong> +48 601 619 898<br>
              <strong>Email:</strong> serwis@serwiszebra.pl
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 24px; text-align: center; color: #6b7280; font-size: 12px;">
          <p style="margin: 0 0 4px 0;">
            TAKMA Tadeusz Tiuchty | ul. Poświęcka 1a, 51-128 Wrocław
          </p>
          <p style="margin: 0;">
            NIP: 9151004377 &nbsp;|&nbsp; www.serwiszebra.pl
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}

// ========== EMAIL O PRO FORMA ==========

interface ProFormaEmailData {
  to: string
  customerName: string
  repairId: string
  deviceModel: string
  amount: number
  proformaNumber: string
}

export async function sendProFormaEmail(data: ProFormaEmailData) {
  try {
    const shortId = data.repairId.split('-')[0].toUpperCase()
    
    const email = await resend.emails.send({
      from: 'Serwis Zebra <serwis@serwiszebra.pl>',
      to: data.to,
      subject: `Faktura Pro Forma - naprawa #${shortId}`,
      html: generateProFormaHTML(data, shortId)
    })
    
    console.log('[Email] Pro Forma email sent:', email)
    return email
    
  } catch (error) {
    console.error('[Email] Error sending Pro Forma email:', error)
    throw error
  }
}

// ========== EMAIL O NOWEJ WIADOMOŚCI NA CZACIE ==========

interface NewChatMessageEmailData {
  to: string
  customerName: string
  repairId: string
  deviceModel: string
  senderName: string
  messagePreview: string
  isToAdmin: boolean
}

export async function sendNewChatMessageEmail(data: NewChatMessageEmailData) {
  try {
    const shortId = data.repairId.split('-')[0].toUpperCase()
    
    const email = await resend.emails.send({
      from: 'Serwis Zebra <serwis@serwiszebra.pl>',
      to: data.to,
      subject: `Nowa wiadomość - naprawa #${shortId}`,
      html: generateNewChatMessageHTML(data, shortId)
    })
    
    console.log('[Email] New chat message email sent:', email)
    return email
    
  } catch (error) {
    console.error('[Email] Error sending new chat message email:', error)
    throw error
  }
}

function generateNewChatMessageHTML(data: NewChatMessageEmailData, shortId: string): string {
  const panelUrl = data.isToAdmin 
    ? `https://serwiszebra.pl/admin/zgloszenie/${data.repairId}`
    : `https://serwiszebra.pl/panel/naprawa/${data.repairId}`

  const senderColor = data.isToAdmin ? '#10b981' : '#2563eb'
  const senderLabel = data.isToAdmin ? 'Klient' : 'Serwis Zebra'

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        
${getEmailHeader()}

        <!-- Content -->
        <div style="padding: 32px 24px;">
          
          <!-- Message icon -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background-color: ${senderColor}; width: 64px; height: 64px; border-radius: 50%; margin-bottom: 16px;">
              <div style="color: white; font-size: 32px; line-height: 64px;">💬</div>
            </div>
            <h2 style="margin: 0 0 8px 0; font-size: 24px; color: #111827;">
              Nowa wiadomość w czacie
            </h2>
            <p style="margin: 0; color: #6b7280;">
              Masz nową wiadomość dotyczącą naprawy
            </p>
          </div>

          <!-- Repair info -->
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%;">
              <tr>
                <td style="color: #6b7280; font-size: 14px;">Nr zgłoszenia:</td>
                <td style="text-align: right; font-weight: 600; color: #111827; font-family: monospace;">#${shortId}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding-top: 8px;">Urządzenie:</td>
                <td style="text-align: right; padding-top: 8px; font-weight: 600;">${data.deviceModel}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding-top: 8px;">Od:</td>
                <td style="text-align: right; padding-top: 8px;">
                  <span style="background-color: ${senderColor}20; color: ${senderColor}; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                    ${senderLabel}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <!-- Message preview -->
          <div style="background-color: #dbeafe; border-radius: 8px; padding: 20px; margin-bottom: 24px; border-left: 4px solid ${senderColor};">
            <div style="margin-bottom: 8px;">
              <span style="font-weight: 600; color: #1e40af; font-size: 14px;">${data.senderName}</span>
              <span style="color: #6b7280; font-size: 12px; margin-left: 8px;">napisał(a):</span>
            </div>
            <p style="margin: 0; color: #1e3a8a; font-size: 15px; line-height: 1.6; font-style: italic;">
              "${data.messagePreview}"
            </p>
          </div>

          <!-- CTA -->
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${panelUrl}" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              Odpowiedz w panelu
            </a>
          </div>

          <!-- Info -->
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
            <p style="margin: 0; color: #92400e; font-size: 13px;">
              ⚠️ Nie odpowiadaj na tego maila - użyj chatu w panelu serwisowym.
            </p>
          </div>

          <!-- Contact -->
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0 0 8px 0;">Masz pytania? Skontaktuj się z nami:</p>
            <p style="margin: 0;">
              <strong>Tel:</strong> +48 607 819 688<br>
              <strong>Email:</strong> serwis@serwiszebra.pl
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 24px; text-align: center; color: #6b7280; font-size: 12px;">
          <p style="margin: 0 0 4px 0;">
            TAKMA Tadeusz Tiuchty | ul. Poświęcka 1a, 51-128 Wrocław
          </p>
          <p style="margin: 0;">
            NIP: 9151004377 &nbsp;|&nbsp; www.serwiszebra.pl
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}

function generateProFormaHTML(data: ProFormaEmailData, shortId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        
${getEmailHeader()}

        <!-- Content -->
        <div style="padding: 32px 24px;">
          
          <!-- Message -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background-color: #2563eb; width: 64px; height: 64px; border-radius: 50%; margin-bottom: 16px;">
              <div style="color: white; font-size: 32px; line-height: 64px;">📄</div>
            </div>
            <h2 style="margin: 0 0 8px 0; font-size: 24px; color: #111827;">
              Faktura Pro Forma
            </h2>
            <p style="margin: 0; color: #6b7280;">
              ${data.deviceModel} • #${shortId}
            </p>
          </div>

          <!-- Pro Forma info -->
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%;">
              <tr>
                <td style="color: #6b7280; font-size: 14px;">Nr Pro Forma:</td>
                <td style="text-align: right; font-weight: 600; color: #111827;">${data.proformaNumber}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding-top: 8px;">Nr zgłoszenia:</td>
                <td style="text-align: right; padding-top: 8px; font-family: monospace;">#${shortId}</td>
              </tr>
              <tr>
                <td style="color: #6b7280; font-size: 14px; padding-top: 8px;">Kwota do zapłaty:</td>
                <td style="text-align: right; padding-top: 8px; font-weight: 700; font-size: 20px; color: #059669;">${data.amount.toFixed(2)} zł</td>
              </tr>
            </table>
          </div>

          <!-- Payment info -->
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
                <td style="color: #1e40af; font-size: 14px; padding: 4px 0;">Nr konta:</td>
                <td style="text-align: right; font-weight: 600; color: #1e3a8a; font-size: 12px;">39 1020 5297 0000 1902 0283 3069</td>
              </tr>
              <tr>
                <td style="color: #1e40af; font-size: 14px; padding: 4px 0;">Bank:</td>
                <td style="text-align: right; color: #1e3a8a;">PKO Bank Polski</td>
              </tr>
              <tr>
                <td style="color: #1e40af; font-size: 14px; padding: 4px 0;">Tytuł:</td>
                <td style="text-align: right; font-weight: 600; color: #1e3a8a;">Pro Forma ${data.proformaNumber}</td>
              </tr>
            </table>
          </div>

          <!-- Important note -->
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>Ważne:</strong> Po dokonaniu przelewu wyślij potwierdzenie przez chat w Panelu Klienta. Przyspieszy to rozpoczęcie naprawy.
            </p>
          </div>

          <!-- CTA -->
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="https://serwiszebra.pl/panel" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Przejdź do Panelu
            </a>
          </div>

          <!-- Contact -->
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0 0 8px 0;">Masz pytania?</p>
            <p style="margin: 0;">
              <strong>Tel:</strong> +48 601 619 898<br>
              <strong>Email:</strong> serwis@serwiszebra.pl
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 24px; text-align: center; color: #6b7280; font-size: 12px;">
          <p style="margin: 0 0 4px 0;">
            TAKMA Tadeusz Tiuchty | ul. Poświęcka 1a, 51-128 Wrocław
          </p>
          <p style="margin: 0;">
            NIP: 9151004377 &nbsp;|&nbsp; www.serwiszebra.pl
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}

// ========== EMAIL O DOSTARCZENIU PACZKI DO SERWISU ==========

interface PackageReceivedEmailData {
  to: string
  customerName: string
  repairId: string
  deviceModel: string
  trackingNumber?: string
  courierStatus?: string
}

export async function sendPackageReceivedEmail(data: PackageReceivedEmailData) {
  try {
    const shortId = data.repairId.split('-')[0].toUpperCase()
    
    const email = await resend.emails.send({
      from: 'Serwis Zebra <serwis@serwiszebra.pl>',
      to: data.to,
      subject: `Paczka dostarczona do serwisu - ${data.deviceModel} #${shortId}`,
      html: generatePackageReceivedHTML(data, shortId)
    })
    
    console.log('[Email] Package received email sent:', email)
    return email
    
  } catch (error) {
    console.error('[Email] Error sending package received email:', error)
    throw error
  }
}

function generatePackageReceivedHTML(data: PackageReceivedEmailData, shortId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white;">
        
${getEmailHeader()}

        <!-- Content -->
        <div style="padding: 32px 24px;">
          
          <!-- Success icon -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background-color: #10b981; width: 64px; height: 64px; border-radius: 50%; margin-bottom: 16px;">
              <div style="color: white; font-size: 32px; line-height: 64px;">&#10003;</div>
            </div>
            <h2 style="margin: 0 0 8px 0; font-size: 24px; color: #111827;">
              Paczka dotarła do serwisu
            </h2>
            <p style="margin: 0; color: #6b7280;">
              ${data.deviceModel} • #${shortId}
            </p>
          </div>

          <!-- Info box -->
          <div style="background-color: #ecfdf5; border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid #a7f3d0;">
            <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #047857;">
              Twoje urządzenie jest już u nas
            </h4>
            <p style="margin: 0; color: #065f46; font-size: 14px; line-height: 1.6;">
              Przesyłka z Twoim urządzeniem <strong>${data.deviceModel}</strong> została dostarczona do naszego serwisu. 
              Rozpoczynamy proces diagnozy.
            </p>
          </div>

          <!-- What's next -->
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h4 style="margin: 0 0 12px 0; font-size: 14px; color: #374151; text-transform: uppercase;">
              Co dalej?
            </h4>
            <ol style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 1.8;">
              <li>Przeprowadzimy szczegółową diagnozę urządzenia</li>
              <li>Otrzymasz wycenę naprawy do akceptacji</li>
              <li>Po akceptacji i płatności naprawimy urządzenie</li>
              <li>Odeślemy naprawione urządzenie kurierem</li>
            </ol>
          </div>

          ${data.trackingNumber ? `
          <!-- Tracking info -->
          <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">Numer przesyłki</p>
            <p style="margin: 0; font-family: monospace; font-size: 14px; color: #374151;">${data.trackingNumber}</p>
          </div>
          ` : ''}

          <!-- Contact -->
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0 0 8px 0;">Masz pytania? Skontaktuj się z nami:</p>
            <p style="margin: 0;">
              <strong>Tel:</strong> +48 601 619 898<br>
              <strong>Email:</strong> serwis@serwiszebra.pl
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 24px; text-align: center; color: #6b7280; font-size: 12px;">
          <p style="margin: 0 0 4px 0;">
            TAKMA Tadeusz Tiuchty | ul. Poświęcka 1a, 51-128 Wrocław
          </p>
          <p style="margin: 0;">
            NIP: 9151004377 &nbsp;|&nbsp; www.serwiszebra.pl
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}
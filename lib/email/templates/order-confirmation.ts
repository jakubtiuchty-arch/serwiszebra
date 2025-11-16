interface OrderItem {
  name: string
  quantity: number
  price: number
  total: number
}

interface OrderConfirmationEmailParams {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  customerCompany?: string
  customerNIP?: string
  deliveryAddress?: {
    street: string
    city: string
    postalCode: string
  }
  items: OrderItem[]
  subtotal: number
  deliveryCost: number
  vat: number
  total: number
  deliveryMethod: string
  paymentMethod: string
  orderDate: string
}

export const generateOrderConfirmationEmail = (params: OrderConfirmationEmailParams): string => {
  const {
    orderNumber,
    customerName,
    customerEmail,
    customerPhone,
    customerCompany,
    customerNIP,
    deliveryAddress,
    items,
    subtotal,
    deliveryCost,
    vat,
    total,
    deliveryMethod,
    paymentMethod,
    orderDate
  } = params

  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Potwierdzenie zamówienia</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- Main container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          
          <!-- Success icon -->
          <tr>
            <td style="padding: 50px 40px 30px; text-align: center;">
              <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; position: relative; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                  <path d="M5 13l4 4L19 7" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              
              <h1 style="margin: 24px 0 8px; color: #111827; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                Dziękujemy za zamówienie!
              </h1>
              <p style="margin: 0; color: #6b7280; font-size: 15px;">
                Twoje zamówienie zostało przyjęte do realizacji
              </p>
            </td>
          </tr>

          <!-- Order number -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center;">
                <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Numer zamówienia</p>
                <p style="margin: 0 0 12px; color: #111827; font-size: 32px; font-weight: 800; letter-spacing: -1px;">${orderNumber}</p>
                <p style="margin: 0; color: #6b7280; font-size: 14px;">${orderDate}</p>
              </div>
            </td>
          </tr>

          <!-- Customer & Delivery - TWO COLUMNS -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <!-- LEFT: Customer -->
                  <td width="50%" style="padding-right: 10px; vertical-align: top;">
                    <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                      <div style="background-color: #f9fafb; padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #111827; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Zamawiający</p>
                      </div>
                      <div style="padding: 16px;">
                        <p style="margin: 0 0 12px; color: #111827; font-size: 15px; font-weight: 700; line-height: 1.3;">${customerCompany || 'Firma'}</p>
                        ${deliveryAddress ? `
                        <p style="margin: 0 0 2px; color: #6b7280; font-size: 13px; line-height: 1.5;">
                          ${deliveryAddress.street}
                        </p>
                        <p style="margin: 0 0 12px; color: #6b7280; font-size: 13px; line-height: 1.5;">
                          ${deliveryAddress.postalCode} ${deliveryAddress.city}
                        </p>
                        ` : ''}
                        ${customerNIP ? `
                        <p style="margin: 0; color: #111827; font-size: 13px; font-weight: 600;">
                          NIP: ${customerNIP}
                        </p>
                        ` : ''}
                      </div>
                    </div>
                  </td>

                  <!-- RIGHT: Delivery -->
                  <td width="50%" style="padding-left: 10px; vertical-align: top;">
                    <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                      <div style="background-color: #f9fafb; padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #111827; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Dostawa</p>
                      </div>
                      <div style="padding: 16px;">
                        ${customerName ? `
                        <p style="margin: 0 0 12px; color: #111827; font-size: 14px; font-weight: 700;">${customerName}</p>
                        ` : ''}
                        ${deliveryAddress ? `
                        <p style="margin: 0 0 2px; color: #6b7280; font-size: 13px; line-height: 1.5;">
                          ${deliveryAddress.street}
                        </p>
                        <p style="margin: 0 0 12px; color: #6b7280; font-size: 13px; line-height: 1.5;">
                          ${deliveryAddress.postalCode} ${deliveryAddress.city}
                        </p>
                        ` : ''}
                        ${customerEmail ? `
                        <p style="margin: 0 0 4px; color: #6b7280; font-size: 12px;">
                          ${customerEmail}
                        </p>
                        ` : ''}
                        ${customerPhone ? `
                        <p style="margin: 0; color: #6b7280; font-size: 12px;">${customerPhone}</p>
                        ` : ''}
                      </div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery & Payment info -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right: 10px;">
                    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px;">
                      <p style="margin: 0 0 4px; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; font-weight: 700;">Sposób dostawy</p>
                      <p style="margin: 0; color: #111827; font-size: 14px; font-weight: 600;">${deliveryMethod}</p>
                    </div>
                  </td>
                  <td width="50%" style="padding-left: 10px;">
                    <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 14px;">
                      <p style="margin: 0 0 4px; color: #6b7280; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; font-weight: 700;">Płatność</p>
                      <p style="margin: 0; color: #111827; font-size: 14px; font-weight: 600;">${paymentMethod}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Products -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr>
                    <th style="background-color: #f9fafb; padding: 12px 16px; text-align: left; border-bottom: 1px solid #e5e7eb;">
                      <p style="margin: 0; color: #111827; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Produkt</p>
                    </th>
                    <th style="background-color: #f9fafb; padding: 12px 16px; text-align: center; border-bottom: 1px solid #e5e7eb; width: 70px;">
                      <p style="margin: 0; color: #111827; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Ilość</p>
                    </th>
                    <th style="background-color: #f9fafb; padding: 12px 16px; text-align: right; border-bottom: 1px solid #e5e7eb; width: 100px;">
                      <p style="margin: 0; color: #111827; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Wartość</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${items.map((item, index) => `
                    <tr>
                      <td style="padding: 14px 16px; border-bottom: ${index < items.length - 1 ? '1px solid #f3f4f6' : 'none'};">
                        <p style="margin: 0; color: #111827; font-size: 14px; font-weight: 600; line-height: 1.4;">${item.name}</p>
                      </td>
                      <td style="padding: 14px 16px; text-align: center; border-bottom: ${index < items.length - 1 ? '1px solid #f3f4f6' : 'none'};">
                        <p style="margin: 0; color: #6b7280; font-size: 14px; font-weight: 600;">${item.quantity}</p>
                      </td>
                      <td style="padding: 14px 16px; text-align: right; border-bottom: ${index < items.length - 1 ? '1px solid #f3f4f6' : 'none'};">
                        <p style="margin: 0; color: #111827; font-size: 14px; font-weight: 700;">${item.total.toFixed(2)} zł</p>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Summary -->
          <tr>
            <td style="padding: 0 40px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 12px 16px; background-color: #ffffff;">
                    <p style="margin: 0; color: #6b7280; font-size: 13px; font-weight: 500;">Suma netto</p>
                  </td>
                  <td style="padding: 12px 16px; text-align: right; background-color: #ffffff;">
                    <p style="margin: 0; color: #111827; font-size: 13px; font-weight: 700;">${subtotal.toFixed(2)} zł</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #f9fafb; border-top: 1px solid #f3f4f6;">
                    <p style="margin: 0; color: #6b7280; font-size: 13px; font-weight: 500;">Dostawa</p>
                  </td>
                  <td style="padding: 12px 16px; text-align: right; background-color: #f9fafb; border-top: 1px solid #f3f4f6;">
                    <p style="margin: 0; color: #111827; font-size: 13px; font-weight: 700;">${deliveryCost.toFixed(2)} zł</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #ffffff; border-top: 1px solid #f3f4f6;">
                    <p style="margin: 0; color: #6b7280; font-size: 13px; font-weight: 500;">VAT (23%)</p>
                  </td>
                  <td style="padding: 12px 16px; text-align: right; background-color: #ffffff; border-top: 1px solid #f3f4f6;">
                    <p style="margin: 0; color: #111827; font-size: 13px; font-weight: 700;">${vat.toFixed(2)} zł</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px; background-color: #d1fae5; border-top: 2px solid #10b981;">
                    <p style="margin: 0; color: #065f46; font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3px;">Razem brutto</p>
                  </td>
                  <td style="padding: 16px; text-align: right; background-color: #d1fae5; border-top: 2px solid #10b981;">
                    <p style="margin: 0; color: #047857; font-size: 22px; font-weight: 800;">${total.toFixed(2)} zł</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 40px 40px; text-align: center;">
              <a href="https://serwiszebra.pl/panel/zamowienia" 
                 style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                Sprawdź status zamówienia
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0 0 12px; color: #111827; font-size: 14px; font-weight: 600;">
                Pytania? Skontaktuj się z nami
              </p>
              <p style="margin: 0 0 4px;">
                <a href="mailto:zamowienia@serwiszebra.pl" style="color: #10b981; text-decoration: none; font-weight: 600; font-size: 14px;">sklep@serwiszebra.pl</a>
              </p>
              <p style="margin: 0;">
                <a href="tel:+48 607 819 688" style="color: #10b981; text-decoration: none; font-weight: 600; font-size: 14px;">+48 123 456 789</a>
              </p>
              <p style="margin: 16px 0 0; color: #9ca3af; font-size: 12px;">
                © 2025 serwiszebra.pl · Autoryzowany Serwis Zebra
              </p>
            </td>
          </tr>

        </table>
        
      </td>
    </tr>
  </table>

</body>
</html>
  `
}
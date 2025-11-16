export function getShippingNotificationEmail({
  orderNumber,
  trackingNumber,
  courierName,
  customerName
}: {
  orderNumber: string
  trackingNumber: string
  courierName: string
  customerName: string
}) {
  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Przesyłka wysłana</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- Main container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          
          <!-- Truck icon (green gradient) -->
          <tr>
            <td style="padding: 50px 40px 30px; text-align: center;">
              <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; position: relative; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                  <path d="M1 3h15v13H1z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 8h4l3 3v5h-7V8z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="5.5" cy="18.5" r="2.5" stroke="#ffffff" stroke-width="2"/>
                  <circle cx="18.5" cy="18.5" r="2.5" stroke="#ffffff" stroke-width="2"/>
                </svg>
              </div>
              
              <h1 style="margin: 24px 0 8px; color: #111827; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                Przesyłka wysłana!
              </h1>
              <p style="margin: 0; color: #6b7280; font-size: 15px;">
                Twoje zamówienie jest w drodze do Ciebie
              </p>
            </td>
          </tr>

          <!-- Order number -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background-color: #f9fafb; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center;">
                <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Numer zamówienia</p>
                <p style="margin: 0; color: #111827; font-size: 32px; font-weight: 800; letter-spacing: -1px;">${orderNumber.split('/').pop()}</p>
              </div>
            </td>
          </tr>

          <!-- Courier & Tracking -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="background-color: #f9fafb; padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #111827; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Kurier</p>
                  </td>
                  <td style="background-color: #f9fafb; padding: 12px 16px; text-align: right; border-bottom: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #111827; font-size: 14px; font-weight: 700;">${courierName}</p>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 16px; background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-top: 2px solid #10b981;">
                    <p style="margin: 0 0 8px; color: #065f46; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; text-align: center;">Numer przesyłki</p>
                    <p style="margin: 0; color: #064e3b; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; font-family: 'Courier New', monospace; text-align: center;">${trackingNumber}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Info box -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="30" style="vertical-align: top; padding-right: 12px;">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="#f59e0b" stroke-width="2"/>
                        <path d="M12 16v-4M12 8h.01" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
                      </svg>
                    </td>
                    <td style="vertical-align: top;">
                      <p style="margin: 0 0 8px; color: #92400e; font-size: 13px; font-weight: 700;">
                        Czas dostawy
                      </p>
                      <p style="margin: 0; color: #78350f; font-size: 13px; line-height: 1.6;">
                        Przesyłka powinna dotrzeć w ciągu <strong>1-2 dni roboczych</strong>. Możesz śledzić jej status w panelu klienta.
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 40px 40px; text-align: center;">
              <a href="https://serwiszebraprod.vercel.app/panel/zamowienia"
                 style="display: inline-block; background: linear-gradient(135deg, #86efac 0%, #4ade80 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                Śledź przesyłkę
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
                <a href="mailto:zamowienia@serwiszebra.pl" style="color: #10b981; text-decoration: none; font-weight: 600; font-size: 14px;">zamowienia@serwiszebra.pl</a>
              </p>
              <p style="margin: 0;">
                <a href="tel:+48607819688" style="color: #10b981; text-decoration: none; font-weight: 600; font-size: 14px;">+48 607 819 688</a>
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
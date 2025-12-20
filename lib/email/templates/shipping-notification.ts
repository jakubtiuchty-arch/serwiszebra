import { getTrackingUrl, formatCourierName } from '@/lib/tracking-links'

interface ShippingNotificationData {
  orderNumber: string
  trackingNumber: string
  courierName: string
  customerName: string
}

export function generateShippingNotificationEmail(data: ShippingNotificationData): string {
  const { orderNumber, trackingNumber, courierName, customerName } = data
  const trackingUrl = getTrackingUrl(courierName, trackingNumber)
  const formattedCourier = formatCourierName(courierName)

  return `
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Przesyłka wysłana - serwis-zebry.pl</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center;">
              <!-- Truck Icon SVG -->
              <div style="margin-bottom: 20px;">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: inline-block;">
                  <rect x="1" y="6" width="15" height="11" rx="2" stroke="white" stroke-width="2" fill="rgba(255,255,255,0.2)"/>
                  <path d="M16 8h3l3 3v6h-2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <circle cx="5.5" cy="19.5" r="2.5" stroke="white" stroke-width="2" fill="white"/>
                  <circle cx="18.5" cy="19.5" r="2.5" stroke="white" stroke-width="2" fill="white"/>
                </svg>
              </div>
              <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                Przesyłka wysłana!
              </h1>
              <p style="margin: 12px 0 0; color: rgba(255,255,255,0.9); font-size: 18px; font-weight: 500;">
                Twoje zamówienie jest w drodze
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="background-color: white; padding: 40px;">
              
              <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
                Witaj <strong>${customerName}</strong>,
              </p>

              <p style="margin: 0 0 32px; color: #374151; font-size: 16px; line-height: 1.6;">
                Twoje zamówienie zostało nadane przez kuriera <strong>${formattedCourier}</strong> i jest w drodze do Ciebie.
              </p>

              <!-- Order Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; margin-bottom: 24px; border: 2px solid #86efac;">
                <tr>
                  <td style="padding: 24px;">
                    
                    <!-- Order Number -->
                    <div style="margin-bottom: 16px;">
                      <p style="margin: 0 0 4px; color: #059669; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                        Numer zamówienia
                      </p>
                      <p style="margin: 0; color: #065f46; font-size: 20px; font-weight: 700;">
                        #${orderNumber.slice(-6)}
                      </p>
                    </div>

                    <!-- Courier -->
                    <div style="margin-bottom: 16px;">
                      <p style="margin: 0 0 4px; color: #059669; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                        Kurier
                      </p>
                      <p style="margin: 0; color: #065f46; font-size: 16px; font-weight: 600;">
                        ${formattedCourier}
                      </p>
                    </div>

                    <!-- Tracking Number -->
                    <div>
                      <p style="margin: 0 0 4px; color: #059669; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                        Numer przesyłki
                      </p>
                      <p style="margin: 0; color: #065f46; font-size: 16px; font-weight: 700; font-family: 'Courier New', monospace; background-color: rgba(6, 95, 70, 0.1); padding: 8px 12px; border-radius: 6px; display: inline-block;">
                        ${trackingNumber}
                      </p>
                    </div>

                  </td>
                </tr>
              </table>

              <!-- Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; margin-bottom: 32px; border-left: 4px solid #10b981;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6;">
                      <strong style="color: #059669;">⏱️ Przewidywany czas dostawy:</strong><br>
                      1-2 dni robocze od daty wysyłki
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  ${trackingUrl ? `
                  <td style="padding-right: 8px;">
                    <a href="${trackingUrl}" style="display: block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; text-decoration: none; padding: 16px 24px; border-radius: 12px; font-weight: 600; font-size: 16px; text-align: center; box-shadow: 0 4px 6px -1px rgba(139, 92, 246, 0.3);">
                      🔍 Śledź u kuriera →
                    </a>
                  </td>
                  ` : ''}
                  <td style="padding-left: ${trackingUrl ? '8px' : '0'};">
                    <a href="https://www.serwis-zebry.pl/klient/zamowienia" style="display: block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 16px 24px; border-radius: 12px; font-weight: 600; font-size: 16px; text-align: center; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);">
                      📦 Moje zamówienia →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="border-top: 2px solid #e5e7eb; margin: 32px 0;"></div>

              <!-- Footer Info -->
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">
                Masz pytania? Skontaktuj się z nami:
              </p>
              <p style="margin: 0 0 4px; color: #374151; font-size: 14px;">
                <strong>📧 Email:</strong> <a href="mailto:zamowienia@serwis-zebry.pl" style="color: #10b981; text-decoration: none;">zamowienia@serwis-zebry.pl</a>
              </p>
              <p style="margin: 0; color: #374151; font-size: 14px;">
                <strong>📞 Telefon:</strong> <a href="tel:+48607819688" style="color: #10b981; text-decoration: none;">+48 607 819 688</a>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 24px 40px; text-align: center;">
              <p style="margin: 0 0 8px; color: rgba(255,255,255,0.9); font-size: 14px;">
                <strong>serwis-zebry.pl</strong>
              </p>
              <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 12px;">
                Profesjonalny serwis urządzeń Zebra
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
// Zebra Browser Print - drukowanie etykiet ZPL z przeglądarki
// Wymaga zainstalowanego Zebra Browser Print na komputerze
// Download: https://www.zebra.com/us/en/support-downloads/printer-software/browser-print.html

interface ZebraPrinter {
  name: string
  uid: string
  connection: string
  deviceType: string
  version: string
  provider: string
}

interface BrowserPrintResponse {
  printer?: ZebraPrinter[]
}

// Sprawdź czy Zebra Browser Print jest dostępny
export async function checkZebraBrowserPrint(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:9100/available', {
      method: 'GET',
      mode: 'cors',
    })
    return response.ok
  } catch {
    return false
  }
}

// Pobierz listę dostępnych drukarek Zebra
export async function getZebraPrinters(): Promise<ZebraPrinter[]> {
  try {
    const response = await fetch('http://localhost:9100/available', {
      method: 'GET',
      mode: 'cors',
    })
    
    if (!response.ok) {
      throw new Error('Zebra Browser Print nie jest dostępny')
    }
    
    const data: BrowserPrintResponse = await response.json()
    return data.printer || []
  } catch (error) {
    console.error('Błąd pobierania drukarek Zebra:', error)
    return []
  }
}

// Pobierz domyślną drukarkę Zebra
export async function getDefaultZebraPrinter(): Promise<ZebraPrinter | null> {
  try {
    const response = await fetch('http://localhost:9100/default?type=printer', {
      method: 'GET',
      mode: 'cors',
    })
    
    if (!response.ok) {
      return null
    }
    
    const printer: ZebraPrinter = await response.json()
    return printer
  } catch {
    return null
  }
}

// Wyślij ZPL do drukarki
export async function printZPL(printerUid: string, zplCode: string): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:9100/write`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({
        device: { uid: printerUid },
        data: zplCode
      })
    })
    
    return response.ok
  } catch (error) {
    console.error('Błąd drukowania:', error)
    return false
  }
}

// Generuj etykietę ZPL dla przesyłki kurierskiej
export function generateShippingLabelZPL(data: {
  trackingNumber: string
  courierName: string
  senderName: string
  senderStreet: string
  senderCity: string
  senderPostal: string
  senderPhone: string
  recipientName: string
  recipientStreet: string
  recipientCity: string
  recipientPostal: string
  recipientPhone: string
  packageContent?: string
  repairNumber?: string
}): string {
  // Etykieta 10x15 cm (4x6 cali) - standardowy rozmiar etykiety kurierskiej
  // Rozdzielczość 203 DPI
  
  const zpl = `
^XA
^CI28
^PW812
^LL1218

^FO20,20
^GB772,1178,3^FS

^FO30,30
^A0N,45,45^FD${data.courierName.toUpperCase()}^FS

^FO30,90
^BY3
^BCN,120,Y,N,N
^FD${data.trackingNumber}^FS

^FO30,250
^A0N,28,28^FDNADAWCA:^FS

^FO30,285
^A0N,32,32^FDTAKMA TADEUSZ TIUCHTY^FS

^FO30,325
^A0N,26,26^FDul. Poswiecka 1a^FS

^FO30,355
^A0N,26,26^FD51-128 Wroclaw^FS

^FO30,385
^A0N,24,24^FDTel: 726 151 515^FS

^FO30,440
^GB752,3,3^FS

^FO30,460
^A0N,28,28^FDODBIORCA:^FS

^FO30,500
^A0N,36,36^FD${data.recipientName.substring(0, 35)}^FS

^FO30,545
^A0N,30,30^FD${data.recipientStreet.substring(0, 40)}^FS

^FO30,585
^A0N,34,34^FD${data.recipientPostal} ${data.recipientCity}^FS

^FO30,630
^A0N,28,28^FDTel: ${data.recipientPhone}^FS

^FO30,690
^GB752,3,3^FS

^FO30,710
^A0N,24,24^FDZAWARTOSC:^FS

^FO30,745
^A0N,28,28^FD${(data.packageContent || 'Urzadzenie do naprawy').substring(0, 45)}^FS

${data.repairNumber ? `
^FO30,800
^A0N,24,24^FDNR ZGLOSZENIA: ${data.repairNumber}^FS
` : ''}

^FO500,900
^BQN,2,6
^FDQA,${data.trackingNumber}^FS

^FO30,1100
^A0N,20,20^FDSERWIS ZEBRA - www.serwis-zebry.pl^FS

^FO30,1130
^A0N,18,18^FDWydrukowano: ${new Date().toLocaleDateString('pl-PL')} ${new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}^FS

^XZ
`.trim()

  return zpl
}

// Alternatywna metoda - drukuj przez okno dialogowe systemu (fallback)
export function printZPLviaDialog(zplCode: string, filename: string = 'etykieta.zpl'): void {
  const blob = new Blob([zplCode], { type: 'application/x-zpl' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}


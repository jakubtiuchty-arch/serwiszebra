import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

interface ReceiptData {
  repairNumber: string
  repairId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  customerCompany?: string | null
  customerStreet?: string | null
  customerCity?: string | null
  customerZipCode?: string | null
  deviceModel: string
  deviceSerialNumber?: string | null
  deviceType?: string | null
  issueDescription: string
  repairType: 'paid' | 'warranty' | 'warranty_rejected'
  createdAt: string
}

// Funkcja formatująca typ urządzenia z wielkiej litery
function formatDeviceType(type: string | null | undefined): string {
  if (!type) return 'Terminal'
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
}

export async function generateReceiptPDF(data: ReceiptData): Promise<Buffer> {
  // Dynamic import dla pdfmake (obsługuje polskie znaki!)
  const pdfMake = require('pdfmake/build/pdfmake')
  const pdfFonts = require('pdfmake/build/vfs_fonts')
  pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts.vfs
  
  const {
    repairNumber,
    customerName,
    customerEmail,
    customerPhone,
    customerCompany,
    customerStreet,
    customerCity,
    customerZipCode,
    deviceModel,
    deviceSerialNumber,
    deviceType,
    issueDescription,
    repairType,
    createdAt
  } = data

  const formattedDate = format(new Date(createdAt), 'd MMMM yyyy, HH:mm', { locale: pl })

  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 40],
    
    content: [
      // === HEADER ===
      {
        columns: [
          {
            width: '60%',
            stack: [
              { text: 'TAKMA', style: 'logo' },
              { text: 'Autoryzowany Serwis Zebra', style: 'subtitle' },
              { text: 'ul. Poświęcka 1a, 51-128 Wrocław', style: 'subtitle' },
              { text: 'Tel: 601 619 898 | serwis@takma.com.pl', style: 'subtitle' }
            ]
          },
          {
            width: '40%',
            alignment: 'right',
            stack: [
              { text: 'NUMER ZGŁOSZENIA', style: 'labelSmall' },
              { text: `#${repairNumber}`, style: 'repairNumber' }
            ]
          }
        ]
      },
      
      // Linia
      { canvas: [{ type: 'line', x1: 0, y1: 10, x2: 515, y2: 10, lineWidth: 2, lineColor: '#1f2937' }], margin: [0, 10, 0, 20] },
      
      // === TYTUŁ ===
      { text: 'POTWIERDZENIE PRZYJĘCIA URZĄDZENIA DO SERWISU', style: 'title', alignment: 'center' },
      { text: `Data zgłoszenia: ${formattedDate}`, style: 'dateText', alignment: 'center', margin: [0, 5, 0, 20] },
      
      // === DANE KLIENTA I URZĄDZENIA ===
      {
        columns: [
          {
            width: '48%',
            stack: [
              { text: 'DANE KLIENTA', style: 'sectionHeader', fillColor: '#374151', color: 'white', margin: [8, 6, 8, 6] },
              {
                table: {
                  widths: ['40%', '60%'],
                  body: [
                    [{ text: 'Imię i nazwisko:', style: 'label' }, { text: customerName, style: 'value' }],
                    ...(customerCompany ? [[{ text: 'Firma:', style: 'label' }, { text: customerCompany, style: 'value' }]] : []),
                    [{ text: 'Telefon:', style: 'label' }, { text: customerPhone, style: 'value' }],
                    [{ text: 'Email:', style: 'label' }, { text: customerEmail, style: 'value' }],
                    ...(customerStreet ? [[{ text: 'Adres:', style: 'label' }, { text: `${customerStreet}\n${customerZipCode || ''} ${customerCity || ''}`, style: 'value' }]] : [])
                  ]
                },
                layout: {
                  fillColor: () => '#f9fafb',
                  hLineWidth: () => 0,
                  vLineWidth: () => 0,
                  paddingLeft: () => 8,
                  paddingRight: () => 8,
                  paddingTop: () => 4,
                  paddingBottom: () => 4
                }
              }
            ]
          },
          { width: '4%', text: '' },
          {
            width: '48%',
            stack: [
              { text: 'DANE URZĄDZENIA', style: 'sectionHeader', fillColor: '#374151', color: 'white', margin: [8, 6, 8, 6] },
              {
                table: {
                  widths: ['40%', '60%'],
                  body: [
                    [{ text: 'Model:', style: 'label' }, { text: deviceModel, style: 'valueBold' }],
                    ...(deviceSerialNumber ? [[{ text: 'Numer seryjny:', style: 'label' }, { text: deviceSerialNumber, style: 'valueMono' }]] : []),
                    [{ text: 'Typ urządzenia:', style: 'label' }, { text: formatDeviceType(deviceType), style: 'value' }],
                    [{ text: 'Typ naprawy:', style: 'label' }, { text: repairType === 'warranty' ? 'Gwarancyjna' : 'Płatna', style: 'value' }]
                  ]
                },
                layout: {
                  fillColor: () => '#f9fafb',
                  hLineWidth: () => 0,
                  vLineWidth: () => 0,
                  paddingLeft: () => 8,
                  paddingRight: () => 8,
                  paddingTop: () => 4,
                  paddingBottom: () => 4
                }
              }
            ]
          }
        ],
        margin: [0, 0, 0, 20]
      },
      
      // === OPIS PROBLEMU ===
      { text: 'OPIS ZGŁOSZONEGO PROBLEMU', style: 'sectionHeader', fillColor: '#374151', color: 'white', margin: [8, 6, 8, 6] },
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                stack: [
                  { text: 'OPIS USTERKI PODANY PRZEZ KLIENTA:', style: 'problemLabel' },
                  { text: issueDescription || 'Brak opisu problemu.', style: 'problemText' }
                ],
                fillColor: '#fef3c7',
                margin: [10, 10, 10, 10]
              }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => '#fcd34d',
          vLineColor: () => '#fcd34d'
        },
        margin: [0, 0, 0, 20]
      },
      
      // === INFORMACJE DLA KLIENTA ===
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                stack: [
                  { text: 'INFORMACJE DLA KLIENTA:', style: 'infoTitle' },
                  { text: '• Diagnoza urządzenia zostanie wykonana w ciągu 2-3 dni roboczych.', style: 'infoText' },
                  { text: '• Po diagnozie otrzymasz wycenę naprawy na podany adres e-mail.', style: 'infoText' },
                  { text: '• Status naprawy możesz śledzić w panelu klienta: serwis-zebry.pl/panel-klienta', style: 'infoText' },
                  { text: '• W razie pytań zadzwoń: 601 619 898', style: 'infoText' }
                ],
                fillColor: '#eff6ff',
                margin: [12, 12, 12, 12]
              }
            ]
          ]
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          hLineColor: () => '#93c5fd',
          vLineColor: () => '#93c5fd'
        },
        margin: [0, 0, 0, 30]
      },
      
      // === FOOTER ===
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' }], margin: [0, 0, 0, 10] },
      { text: 'TAKMA Tadeusz Tiuchty | NIP: 9151004377 | ul. Poświęcka 1a, 51-128 Wrocław', style: 'footer', alignment: 'center' },
      { text: 'www.serwis-zebry.pl | serwis@takma.com.pl', style: 'footer', alignment: 'center' },
      { text: `Dokument wygenerowany: ${format(new Date(), 'd.MM.yyyy HH:mm', { locale: pl })}`, style: 'footer', alignment: 'center' }
    ],
    
    styles: {
      logo: { fontSize: 24, bold: true, color: '#1f2937' },
      subtitle: { fontSize: 9, color: '#6b7280', margin: [0, 2, 0, 0] },
      labelSmall: { fontSize: 9, color: '#6b7280' },
      repairNumber: { fontSize: 18, bold: true, color: '#1f2937', margin: [0, 5, 0, 0] },
      title: { fontSize: 14, bold: true, color: '#1f2937' },
      dateText: { fontSize: 10, color: '#6b7280' },
      sectionHeader: { fontSize: 9, bold: true },
      label: { fontSize: 9, color: '#6b7280' },
      value: { fontSize: 9, color: '#1f2937' },
      valueBold: { fontSize: 11, bold: true, color: '#1f2937' },
      valueMono: { fontSize: 9, color: '#1f2937', font: 'Courier' },
      problemLabel: { fontSize: 8, bold: true, color: '#92400e', margin: [0, 0, 0, 5] },
      problemText: { fontSize: 10, color: '#78350f', lineHeight: 1.4 },
      infoTitle: { fontSize: 9, bold: true, color: '#1e40af', margin: [0, 0, 0, 8] },
      infoText: { fontSize: 9, color: '#1e40af', margin: [0, 2, 0, 2] },
      footer: { fontSize: 8, color: '#9ca3af', margin: [0, 2, 0, 0] }
    },
    
    defaultStyle: {
      font: 'Roboto'
    }
  }

  // Generuj PDF
  const pdfDocGenerator = pdfMake.createPdf(docDefinition)
  
  // Użyj getBuffer dla Node.js (async)
  return new Promise<Buffer>((resolve, reject) => {
    pdfDocGenerator.getBuffer((buffer: Buffer) => {
      resolve(Buffer.from(buffer))
    })
  })
}

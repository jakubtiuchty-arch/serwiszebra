interface CartItem {
  id: string
  name: string
  sku: string
  price: number
  price_brutto: number
  quantity: number
}

interface CustomerData {
  companyName: string
  nip: string
  email: string
  phone: string
  street: string
  city: string
  postalCode: string
  notes?: string
}

interface ProformaData {
  invoiceNumber: string
  invoiceDate: string
  paymentDue: string
  customer: CustomerData
  items: CartItem[]
  deliveryMethod: 'courier' | 'osobisty'
  deliveryCost: number
  deliveryCostBrutto: number
}

export async function generateProformaPDF(data: ProformaData) {
  // Dynamic import dla Next.js
  const pdfMake = (await import('pdfmake/build/pdfmake')).default
  const pdfFonts = (await import('pdfmake/build/vfs_fonts')).default
  
  pdfMake.vfs = pdfFonts.vfs
  
  const {
    invoiceNumber,
    invoiceDate,
    paymentDue,
    customer,
    items,
    deliveryMethod,
    deliveryCost,
    deliveryCostBrutto
  } = data

  // Reszta kodu bez zmian...
  // Calculate totals
  const subtotalNetto = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const subtotalBrutto = items.reduce((sum, item) => sum + (item.price_brutto * item.quantity), 0)
  const vatAmount = subtotalBrutto - subtotalNetto
  
  const totalNetto = subtotalNetto + deliveryCost
  const totalBrutto = subtotalBrutto + deliveryCostBrutto
  const totalVat = totalBrutto - totalNetto

  // Build table rows
  const tableBody = [
    // Header
    [
      { text: 'Lp.', style: 'tableHeader', alignment: 'center' },
      { text: 'Nazwa produktu', style: 'tableHeader' },
      { text: 'PN', style: 'tableHeader', alignment: 'center' },
      { text: 'Ilość', style: 'tableHeader', alignment: 'center' },
      { text: 'Cena netto', style: 'tableHeader', alignment: 'right' },
      { text: 'Wartość netto', style: 'tableHeader', alignment: 'right' }
    ],
    // Items
    ...items.map((item, index) => [
      { text: (index + 1).toString(), alignment: 'center' },
      { text: item.name },
      { text: item.sku, alignment: 'center', fontSize: 9 },
      { text: item.quantity.toString(), alignment: 'center' },
      { text: `${item.price.toFixed(2)} zł`, alignment: 'right' },
      { text: `${(item.price * item.quantity).toFixed(2)} zł`, alignment: 'right', bold: true }
    ]),
    // Delivery
    [
      { text: (items.length + 1).toString(), alignment: 'center' },
      { text: deliveryMethod === 'courier' ? 'Dostawa - Kurier DPD/InPost' : 'Odbiór osobisty (ul. Poświęcka 1a, Wrocław)' },
      { text: '-', alignment: 'center' },
      { text: '1', alignment: 'center' },
      { text: `${deliveryCost.toFixed(2)} zł`, alignment: 'right' },
      { text: `${deliveryCost.toFixed(2)} zł`, alignment: 'right', bold: true }
    ]
  ]

  const docDefinition: any = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    
    content: [
      // Header
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: 'FAKTURA PRO FORMA', style: 'header', margin: [0, 0, 0, 5] },
              { text: `Nr ${invoiceNumber}`, style: 'invoiceNumber' }
            ]
          },
          {
            width: 'auto',
            stack: [
              { text: 'Data wystawienia:', fontSize: 9, color: '#666' },
              { text: invoiceDate, fontSize: 11, bold: true, margin: [0, 2, 0, 8] },
              { text: 'Termin płatności:', fontSize: 9, color: '#666' },
              { text: paymentDue, fontSize: 11, bold: true, color: '#d97706', margin: [0, 2, 0, 0] }
            ]
          }
        ],
        margin: [0, 0, 0, 30]
      },

      // Seller and Buyer
      {
        columns: [
          {
            width: '48%',
            stack: [
              { text: 'SPRZEDAWCA', style: 'sectionHeader' },
              { text: 'TAKMA Tadeusz Tiuchty', bold: true, fontSize: 12, margin: [0, 8, 0, 4] },
              { text: 'ul. Poświęcka 1a', fontSize: 10, margin: [0, 0, 0, 2] },
              { text: '51-128 Wrocław', fontSize: 10, margin: [0, 0, 0, 8] },
              { text: 'NIP: 9151004377', fontSize: 10, margin: [0, 0, 0, 2] }
            ]
          },
          {
            width: '4%',
            text: ''
          },
          {
            width: '48%',
            stack: [
              { text: 'NABYWCA', style: 'sectionHeader' },
              { text: customer.companyName, bold: true, fontSize: 12, margin: [0, 8, 0, 4] },
              { text: customer.street, fontSize: 10, margin: [0, 0, 0, 2] },
              { text: `${customer.postalCode} ${customer.city}`, fontSize: 10, margin: [0, 0, 0, 8] },
              { text: `NIP: ${customer.nip}`, fontSize: 10, margin: [0, 0, 0, 2] },
              { text: `Email: ${customer.email}`, fontSize: 10, margin: [0, 0, 0, 2] },
              { text: `Tel: ${customer.phone}`, fontSize: 10, margin: [0, 0, 0, 2] }
            ]
          }
        ],
        margin: [0, 0, 0, 30]
      },

      // Items table
      {
        table: {
          headerRows: 1,
          widths: [30, '*', 80, 40, 70, 80],
          body: tableBody
        },
        layout: {
          fillColor: (rowIndex: number) => {
            return rowIndex === 0 ? '#f3f4f6' : null
          },
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#e5e7eb',
          vLineColor: () => '#e5e7eb',
          paddingTop: () => 8,
          paddingBottom: () => 8,
          paddingLeft: () => 8,
          paddingRight: () => 8
        },
        margin: [0, 0, 0, 20]
      },

      // Summary
      {
        columns: [
          { width: '*', text: '' },
          {
            width: 240,
            table: {
              widths: ['*', 80],
              body: [
                [
                  { text: 'Suma netto:', alignment: 'right', fontSize: 10, color: '#666' },
                  { text: `${totalNetto.toFixed(2)} zł`, alignment: 'right', fontSize: 11, bold: true }
                ],
                [
                  { text: 'VAT (23%):', alignment: 'right', fontSize: 10, color: '#666' },
                  { text: `${totalVat.toFixed(2)} zł`, alignment: 'right', fontSize: 11, bold: true }
                ],
                [
                  { text: 'SUMA BRUTTO:', alignment: 'right', fontSize: 12, bold: true },
                  { text: `${totalBrutto.toFixed(2)} zł`, alignment: 'right', fontSize: 14, bold: true, color: '#059669' }
                ]
              ]
            },
            layout: 'noBorders'
          }
        ],
        margin: [0, 0, 0, 30]
      },

      // Payment info
      {
        stack: [
          { text: 'DANE DO PRZELEWU', style: 'sectionHeader', margin: [0, 0, 0, 12] },
          {
            table: {
              widths: [120, '*'],
              body: [
                [
                  { text: 'Odbiorca:', fontSize: 10, bold: true },
                  { text: 'TAKMA Tadeusz Tiuchty', fontSize: 10 }
                ],
                [
                  { text: 'Numer konta:', fontSize: 10, bold: true },
                  { text: '39 1020 5297 0000 1902 0283 3069', fontSize: 10, color: '#059669', bold: true }
                ],
                [
                  { text: 'Bank:', fontSize: 10, bold: true },
                  { text: 'PKO Bank Polski', fontSize: 10 }
                ],
                [
                  { text: 'Tytuł przelewu:', fontSize: 10, bold: true },
                  { text: `Faktura pro forma ${invoiceNumber}`, fontSize: 10, color: '#d97706' }
                ],
                [
                  { text: 'Kwota:', fontSize: 10, bold: true },
                  { text: `${totalBrutto.toFixed(2)} zł`, fontSize: 11, bold: true, color: '#059669' }
                ]
              ]
            },
            layout: {
              hLineWidth: () => 0,
              vLineWidth: () => 0,
              paddingTop: () => 4,
              paddingBottom: () => 4,
              paddingLeft: () => 0,
              paddingRight: () => 0
            }
          }
        ],
        margin: [0, 0, 0, 20]
      },

      // Notes
      customer.notes ? {
        stack: [
          { text: 'UWAGI DO ZAMÓWIENIA', style: 'sectionHeader', margin: [0, 0, 0, 8] },
          { 
            text: customer.notes, 
            fontSize: 9, 
            color: '#666',
            italics: true,
            background: '#fef3c7',
            margin: [0, 0, 0, 20]
          }
        ]
      } : {},

      // Footer info
      {
        stack: [
          { 
            text: 'Informacje dodatkowe:', 
            fontSize: 9, 
            bold: true, 
            margin: [0, 0, 0, 6] 
          },
          { 
            text: '• Faktura pro forma jest dokumentem informacyjnym i nie stanowi podstawy do odliczenia VAT.', 
            fontSize: 8, 
            color: '#666',
            margin: [0, 0, 0, 3]
          },
          { 
            text: '• Po zaksięgowaniu płatności zostanie wystawiona faktura VAT.', 
            fontSize: 8, 
            color: '#666',
            margin: [0, 0, 0, 3]
          },
          { 
            text: deliveryMethod === 'courier' 
              ? '• Urządzenie zostanie wysłane kurierem po zaksięgowaniu płatności na koncie.' 
              : '• Urządzenie będzie gotowe do odbioru po zaksięgowaniu płatności. Odbiór osobisty: ul. Poświęcka 1a, 51-128 Wrocław.',
            fontSize: 8, 
            color: '#666',
            margin: [0, 0, 0, 3]
          },
          { 
            text: '• Kontakt: tel. +48 607 819 688, email: takma@takma.com.pl', 
            fontSize: 8, 
            color: '#666',
            margin: [0, 0, 0, 0]
          }
        ],
        margin: [0, 20, 0, 0]
      }
    ],

    styles: {
      header: {
        fontSize: 22,
        bold: true,
        color: '#1f2937'
      },
      invoiceNumber: {
        fontSize: 14,
        color: '#6b7280',
        bold: true
      },
      sectionHeader: {
        fontSize: 10,
        bold: true,
        color: '#059669',
        decoration: 'underline'
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: '#374151'
      }
    },

    defaultStyle: {
      fontSize: 10
    }
  }

  return pdfMake.createPdf(docDefinition)
}
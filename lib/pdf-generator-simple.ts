import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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

export function generateProformaPDF(data: ProformaData) {
  const doc = new jsPDF()
  
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

  // Calculate totals
  const subtotalNetto = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const subtotalBrutto = items.reduce((sum, item) => sum + (item.price_brutto * item.quantity), 0)
  const totalNetto = subtotalNetto + deliveryCost
  const totalBrutto = subtotalBrutto + deliveryCostBrutto
  const totalVat = totalBrutto - totalNetto

  // Header
  doc.setFontSize(22)
  doc.text('FAKTURA PRO FORMA', 20, 30)
  doc.setFontSize(14)
  doc.text(`Nr ${invoiceNumber}`, 20, 40)
  
  doc.setFontSize(10)
  doc.text(`Data wystawienia: ${invoiceDate}`, 140, 30)
  doc.text(`Termin płatności: ${paymentDue}`, 140, 40)

  // Seller and Buyer
  doc.setFontSize(12)
  doc.text('SPRZEDAWCA', 20, 60)
  doc.setFontSize(10)
  doc.text('TAKMA Tadeusz Tiuchty', 20, 70)
  doc.text('ul. Poświęcka 1a', 20, 77)
  doc.text('51-128 Wrocław', 20, 84)
  doc.text('NIP: 9151004377', 20, 91)

  doc.setFontSize(12)
  doc.text('NABYWCA', 110, 60)
  doc.setFontSize(10)
  doc.text(customer.companyName, 110, 70)
  doc.text(customer.street, 110, 77)
  doc.text(`${customer.postalCode} ${customer.city}`, 110, 84)
  doc.text(`NIP: ${customer.nip}`, 110, 91)
  doc.text(`Email: ${customer.email}`, 110, 98)
  doc.text(`Tel: ${customer.phone}`, 110, 105)

  // Items table
  const tableData = items.map((item, index) => [
    (index + 1).toString(),
    item.name,
    item.sku,
    item.quantity.toString(),
    `${item.price.toFixed(2)} zł`,
    `${(item.price * item.quantity).toFixed(2)} zł`
  ])

  // Add delivery row
  tableData.push([
    (items.length + 1).toString(),
    deliveryMethod === 'courier' ? 'Dostawa - Kurier DPD/InPost' : 'Odbiór osobisty',
    '-',
    '1',
    `${deliveryCost.toFixed(2)} zł`,
    `${deliveryCost.toFixed(2)} zł`
  ])

  autoTable(doc, {
    head: [['Lp.', 'Nazwa produktu', 'PN', 'Ilość', 'Cena netto', 'Wartość netto']],
    body: tableData,
    startY: 115,
    theme: 'grid',
    headStyles: { fillColor: [243, 244, 246], textColor: [0, 0, 0] }
  })

  // Get final Y position
  let finalY = 150
  const pageHeight = doc.internal.pageSize.height
  
  // Calculate position after table
  if ((doc as any).lastAutoTable) {
    finalY = (doc as any).lastAutoTable.finalY || 150
  }

  // Summary
  doc.text(`Suma netto: ${totalNetto.toFixed(2)} zł`, 140, finalY + 15)
  doc.text(`VAT (23%): ${totalVat.toFixed(2)} zł`, 140, finalY + 22)
  doc.setFontSize(12)
  doc.text(`SUMA BRUTTO: ${totalBrutto.toFixed(2)} zł`, 140, finalY + 30)

  // Payment info
  doc.setFontSize(12)
  doc.text('DANE DO PRZELEWU', 20, finalY + 50)
  doc.setFontSize(10)
  doc.text('Odbiorca: TAKMA Tadeusz Tiuchty', 20, finalY + 60)
  doc.text('Numer konta: 39 1020 5297 0000 1902 0283 3069', 20, finalY + 67)
  doc.text('Bank: PKO Bank Polski', 20, finalY + 74)
  doc.text(`Tytuł przelewu: Faktura pro forma ${invoiceNumber}`, 20, finalY + 81)
  doc.text(`Kwota: ${totalBrutto.toFixed(2)} zł`, 20, finalY + 88)

  // Add notes if present
  if (customer.notes) {
    doc.setFontSize(12)
    doc.text('UWAGI DO ZAMÓWIENIA:', 20, finalY + 105)
    doc.setFontSize(10)
    
    // Split long notes into multiple lines
    const splitNotes = doc.splitTextToSize(customer.notes, 170)
    doc.text(splitNotes, 20, finalY + 115)
  }

  return doc
}
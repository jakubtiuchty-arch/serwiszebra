import jsPDF from 'jspdf'
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

export function generateReceiptPDF(data: ReceiptData): Buffer {
  const doc = new jsPDF()
  
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
  const shortDate = format(new Date(createdAt), 'dd.MM.yyyy', { locale: pl })

  // === HEADER ===
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('TAKMA', 20, 25)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Autoryzowany Serwis Zebra', 20, 32)
  doc.text('ul. Poświęcka 1a, 51-128 Wrocław', 20, 38)
  doc.text('Tel: 601 619 898 | serwis@takma.com.pl', 20, 44)

  // Numer zgłoszenia po prawej
  doc.setFontSize(10)
  doc.text('NUMER ZGŁOSZENIA', 150, 20)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(`#${repairNumber}`, 150, 30)
  
  // Linia pod headerem
  doc.setDrawColor(31, 41, 55)
  doc.setLineWidth(0.5)
  doc.line(20, 50, 190, 50)

  // === TYTUŁ DOKUMENTU ===
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('POTWIERDZENIE PRZYJĘCIA URZĄDZENIA DO SERWISU', 105, 62, { align: 'center' })
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Data zgłoszenia: ${formattedDate}`, 105, 70, { align: 'center' })

  // === DANE KLIENTA ===
  let yPos = 85
  
  doc.setFillColor(55, 65, 81)
  doc.rect(20, yPos - 5, 80, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('DANE KLIENTA', 22, yPos)
  doc.setTextColor(0, 0, 0)
  
  yPos += 10
  doc.setFillColor(249, 250, 251)
  doc.rect(20, yPos - 3, 80, 45, 'F')
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  
  doc.text('Imię i nazwisko:', 22, yPos + 5)
  doc.setFont('helvetica', 'bold')
  doc.text(customerName, 55, yPos + 5)
  
  doc.setFont('helvetica', 'normal')
  if (customerCompany) {
    doc.text('Firma:', 22, yPos + 12)
    doc.text(customerCompany, 55, yPos + 12)
  }
  
  doc.text('Telefon:', 22, yPos + 19)
  doc.text(customerPhone, 55, yPos + 19)
  
  doc.text('Email:', 22, yPos + 26)
  doc.text(customerEmail, 55, yPos + 26)
  
  if (customerStreet) {
    doc.text('Adres:', 22, yPos + 33)
    const address = `${customerStreet}, ${customerZipCode || ''} ${customerCity || ''}`
    doc.text(address.substring(0, 40), 55, yPos + 33)
  }

  // === DANE URZĄDZENIA ===
  yPos = 85
  
  doc.setFillColor(55, 65, 81)
  doc.rect(110, yPos - 5, 80, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('DANE URZĄDZENIA', 112, yPos)
  doc.setTextColor(0, 0, 0)
  
  yPos += 10
  doc.setFillColor(249, 250, 251)
  doc.rect(110, yPos - 3, 80, 45, 'F')
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  
  doc.text('Model:', 112, yPos + 5)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(deviceModel, 145, yPos + 5)
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  
  if (deviceSerialNumber) {
    doc.text('Numer seryjny:', 112, yPos + 12)
    doc.text(deviceSerialNumber, 145, yPos + 12)
  }
  
  doc.text('Typ urządzenia:', 112, yPos + 19)
  doc.text(deviceType || 'Drukarka etykiet', 145, yPos + 19)
  
  doc.text('Typ naprawy:', 112, yPos + 26)
  const repairTypeLabel = repairType === 'warranty' ? 'Gwarancyjna' : 'Płatna'
  doc.text(repairTypeLabel, 145, yPos + 26)

  // === OPIS PROBLEMU ===
  yPos = 145
  
  doc.setFillColor(55, 65, 81)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text('OPIS ZGŁOSZONEGO PROBLEMU', 22, yPos + 5)
  doc.setTextColor(0, 0, 0)
  
  yPos += 12
  doc.setFillColor(254, 243, 199)
  doc.setDrawColor(252, 211, 77)
  doc.rect(20, yPos, 170, 35, 'FD')
  
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(146, 64, 14)
  doc.text('OPIS USTERKI PODANY PRZEZ KLIENTA:', 22, yPos + 6)
  
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(120, 53, 15)
  const issueLines = doc.splitTextToSize(issueDescription || 'Brak opisu problemu.', 165)
  doc.text(issueLines, 22, yPos + 13)

  // === INFORMACJE DLA KLIENTA ===
  yPos = 200
  
  doc.setFillColor(239, 246, 255)
  doc.setDrawColor(147, 197, 253)
  doc.rect(20, yPos, 170, 40, 'FD')
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 64, 175)
  doc.text('INFORMACJE DLA KLIENTA:', 22, yPos + 7)
  
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('• Diagnoza urządzenia zostanie wykonana w ciągu 2-3 dni roboczych.', 22, yPos + 15)
  doc.text('• Po diagnozie otrzymasz wycenę naprawy na podany adres e-mail.', 22, yPos + 22)
  doc.text('• Status naprawy możesz śledzić w panelu klienta: serwis-zebry.pl/panel-klienta', 22, yPos + 29)
  doc.text('• W razie pytań zadzwoń: 601 619 898', 22, yPos + 36)

  // === FOOTER ===
  doc.setTextColor(156, 163, 175)
  yPos = 255
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('TAKMA Tadeusz Tiuchty | NIP: 9151004377 | ul. Poświęcka 1a, 51-128 Wrocław', 105, yPos, { align: 'center' })
  doc.text('www.serwis-zebry.pl | serwis@takma.com.pl', 105, yPos + 5, { align: 'center' })
  doc.text(`Dokument wygenerowany: ${format(new Date(), 'd.MM.yyyy HH:mm', { locale: pl })}`, 105, yPos + 10, { align: 'center' })

  // Zwróć jako Buffer
  const pdfOutput = doc.output('arraybuffer')
  return Buffer.from(pdfOutput)
}


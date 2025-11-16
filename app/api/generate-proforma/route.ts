import { NextRequest, NextResponse } from 'next/server'
import { generateProformaPDF } from '@/lib/pdf-generator-simple'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      customer,
      items,
      deliveryMethod
    } = body

    // Validate required fields
    if (!customer || !items || !deliveryMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate invoice number
    const invoiceNumber = `PF/${new Date().getFullYear()}/${Date.now().toString().slice(-6)}`
    
    // Calculate dates
    const today = new Date()
    const invoiceDate = today.toLocaleDateString('pl-PL')
    
    const paymentDueDate = new Date(today)
    paymentDueDate.setDate(paymentDueDate.getDate() + 14)
    const paymentDue = paymentDueDate.toLocaleDateString('pl-PL')

    // Calculate delivery costs (0 for personal pickup, 20 for courier)
    const deliveryCost = deliveryMethod === 'courier' ? 20.00 : 0.00
    const deliveryCostBrutto = deliveryMethod === 'courier' ? 24.60 : 0.00

    // Generate PDF
    const pdfDoc = generateProformaPDF({
      invoiceNumber,
      invoiceDate,
      paymentDue,
      customer,
      items,
      deliveryMethod,
      deliveryCost,
      deliveryCostBrutto
    })

    // Create buffer from PDF
    const pdfBuffer = Buffer.from(pdfDoc.output('arraybuffer'))

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="faktura-proforma-${invoiceNumber.replace(/\//g, '-')}.pdf"`
      }
    })
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}
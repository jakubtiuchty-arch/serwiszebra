import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const sendEmail = async ({
  to,
  subject,
  html
}: {
  to: string
  subject: string
  html: string
}) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Sklep serwis-zebry.pl <sklep@serwis-zebry.pl>',
      to: [to],
      subject: subject,
      html: html
    })

    if (error) {
      console.error('❌ Email error:', error)
      return { success: false, error }
    }

    console.log('✅ Email sent:', data?.id)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Email exception:', error)
    return { success: false, error }
  }
}
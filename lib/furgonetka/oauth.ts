// lib/furgonetka/oauth.ts

interface FurgonetkaTokenResponse {
  token_type: string
  expires_in: number
  access_token: string
}

let cachedToken: string | null = null
let tokenExpiresAt: number = 0

/**
 * Pobiera token dostępowy z Furgonetka API (OAuth2 Client Credentials)
 * Token jest cache'owany i odświeżany automatycznie po wygaśnięciu
 */
export async function getFurgonetkaAccessToken(): Promise<string> {
  // Sprawdź czy mamy ważny token w cache
  const now = Date.now()
  if (cachedToken && tokenExpiresAt > now) {
    return cachedToken
  }

  // Pobierz nowy token
  const clientId = process.env.FURGONETKA_CLIENT_ID!
  const clientSecret = process.env.FURGONETKA_CLIENT_SECRET!

  if (!clientId || !clientSecret) {
    throw new Error('Missing FURGONETKA_CLIENT_ID or FURGONETKA_CLIENT_SECRET')
  }

  // Encode credentials do Base64
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const response = await fetch('https://api.furgonetka.pl/oauth/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      scope: 'api',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get Furgonetka access token: ${error}`)
  }

  const data: FurgonetkaTokenResponse = await response.json()

  // Cache token (expires_in jest w sekundach, odejmujemy 5 minut bufor)
  cachedToken = data.access_token
  tokenExpiresAt = now + (data.expires_in - 300) * 1000

  console.log('✅ Furgonetka token obtained, expires in:', data.expires_in, 'seconds')

  return cachedToken
}
/**
 * Zgłoszenia przyjęte w biurze nie zawsze mają adres e-mail — klient zostawia
 * sam numer telefonu. Kolumna `repair_requests.email` jest NOT NULL, więc
 * zapisujemy wtedy adres w zarezerwowanej domenie `.invalid` (RFC 2606).
 * Taki adres nigdy nie istnieje, więc nie ma do kogo wysłać i nie generujemy
 * odbić, które psułyby reputację nadawcy.
 */
export function isPlaceholderEmail(email?: string | null): boolean {
  return !email || email.trim().toLowerCase().endsWith('.invalid')
}

/** Adres nadaje się do wysyłki, gdy w ogóle istnieje i nie jest zaślepką */
export function canReceiveEmail(email?: string | null): boolean {
  return !isPlaceholderEmail(email)
}

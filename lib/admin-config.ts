// ================================================
// Konfiguracja uprawnień administratorów
// ================================================

/**
 * Lista emaili superadminów - mają pełny dostęp do wszystkich funkcji panelu admin
 */
export const SUPERADMIN_EMAILS = [
  'jakub.tiuchty@gmail.com',
  // Dodaj tutaj więcej superadminów jeśli potrzeba
]

/**
 * Lista emaili zwykłych administratorów - mają ograniczony dostęp
 * Dostęp: Dashboard, Użytkownicy, Instrukcje PDF
 * Brak dostępu: Sklep (Produkty, Zamówienia), AI & RAG
 */
export const ADMIN_EMAILS = [
  'wojcik@takma.com.pl',
  'zuchnicki@takma.com.pl',
  'serwis@takma.com.pl',
]

/**
 * Sprawdza czy email należy do superadmina
 */
export function isSuperAdmin(email: string | undefined | null): boolean {
  if (!email) return false
  return SUPERADMIN_EMAILS.includes(email.toLowerCase())
}

/**
 * Sprawdza czy email należy do zwykłego admina
 */
export function isRegularAdmin(email: string | undefined | null): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

/**
 * Sekcje dostępne dla zwykłych adminów
 */
export const REGULAR_ADMIN_ALLOWED_SECTIONS = [
  '/admin',           // Dashboard
  '/admin/zgloszenie', // Szczegóły zgłoszeń (część Dashboard)
  '/admin/uzytkownicy', // Użytkownicy
  '/admin/instrukcje',  // Instrukcje PDF
]

/**
 * Sprawdza czy dana ścieżka jest dozwolona dla zwykłego admina
 */
export function isPathAllowedForRegularAdmin(pathname: string): boolean {
  return REGULAR_ADMIN_ALLOWED_SECTIONS.some(section => 
    pathname === section || pathname.startsWith(section + '/')
  )
}


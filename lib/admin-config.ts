// ================================================
// Konfiguracja uprawnień administratorów
// ================================================

/**
 * Lista emaili superadminów - mają pełny dostęp do wszystkich funkcji panelu admin
 */
export const SUPERADMIN_EMAILS = [
  'jakub.tiuchty@gmail.com',
  'jakub.tiuchty@takma.com.pl',
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
  'handlowy@takma.com.pl',
]

/**
 * Administratorzy handlowi - oprócz uprawnień zwykłego admina mają też
 * dostęp do Sklepu (Produkty, Zamówienia). Nie mają dostępu do AI/RAG ani analityki.
 */
export const SHOP_ADMIN_EMAILS = [
  'handlowy@takma.com.pl',
]

/**
 * Czy email ma dostęp do sekcji Sklepu (Produkty, Zamówienia).
 * Superadmin ma zawsze, dodatkowo administratorzy handlowi.
 */
export function hasShopAccess(email: string | undefined | null): boolean {
  if (!email) return false
  const e = email.toLowerCase()
  return SUPERADMIN_EMAILS.includes(e) || SHOP_ADMIN_EMAILS.includes(e)
}

/** Ścieżki Sklepu dostępne dla administratorów handlowych */
export const SHOP_ADMIN_ALLOWED_SECTIONS = [
  '/admin/zamowienia',
  '/admin/produkty',
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


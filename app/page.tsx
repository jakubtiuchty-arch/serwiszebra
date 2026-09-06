import HomePage from '@/components/HomePage'
import { pobierzOpinieGoogle } from '@/lib/google-reviews'

/**
 * Strona główna. Właściwa treść to komponent kliencki `components/HomePage`
 * (formularz, czat, modale); ten plik jest serwerowy, żeby pobrać opinie
 * z Google po stronie serwera i oddać je w HTML — patrz lib/google-reviews.ts.
 */
export const revalidate = 21600

export default async function Page() {
  const opinie = await pobierzOpinieGoogle()
  return <HomePage opinie={opinie} />
}

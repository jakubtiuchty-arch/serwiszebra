-- Strefa płatności — 24.09.2026
-- Uruchomić w Supabase → SQL Editor (projekt serwiszebra_prod), całość naraz.
--
-- 1. Status „oplacone” (webhook Stripe i potwierdzenie płatności ustawiają go od 19.09)
--    oraz statusy gwarancyjne, których używa panel, a których baza nie znała.
--    Lista zgodna z lib/statusy-napraw.ts. Jeśli jakiś istniejący wiersz ma status
--    spoza listy, ADD CONSTRAINT się nie wykona i nic się nie zmieni (transakcja).

BEGIN;

ALTER TABLE public.repair_requests DROP CONSTRAINT repair_requests_status_check;

ALTER TABLE public.repair_requests ADD CONSTRAINT repair_requests_status_check CHECK (status IN (
  'nowe',
  'odbior_od_klienta',
  'odebrane',
  'diagnoza',
  'wycena',
  'proforma',
  'oplacone',
  'w_naprawie',
  'zakonczone',
  'wyslane',
  'anulowane',
  'weryfikacja_gwarancji',
  'gwarancja_potwierdzona',
  'gwarancja_odrzucona'
));

-- 2. Odczyt ograniczenia dla codziennej kontroli (/api/cron/kontrola-platnosci).
--    Tylko do odczytu, wyłącznie dla klucza serwisowego.

CREATE OR REPLACE FUNCTION public.dozwolone_statusy_napraw()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT pg_get_constraintdef(c.oid)
  FROM pg_constraint c
  WHERE c.conname = 'repair_requests_status_check'
    AND c.conrelid = 'public.repair_requests'::regclass
$$;

REVOKE ALL ON FUNCTION public.dozwolone_statusy_napraw() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dozwolone_statusy_napraw() TO service_role;

COMMIT;

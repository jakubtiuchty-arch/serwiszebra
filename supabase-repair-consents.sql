-- Zgody klienta przy zgłoszeniu naprawy.
-- Do tej pory checkboxy „Polityka Prywatności (RODO)" i „Regulamin Serwisu" były sprawdzane
-- wyłącznie w przeglądarce — nie trafiały ani do API, ani do bazy. Brak dowodu zgody.

ALTER TABLE repair_requests ADD COLUMN IF NOT EXISTS privacy_consent BOOLEAN DEFAULT false;
ALTER TABLE repair_requests ADD COLUMN IF NOT EXISTS terms_consent   BOOLEAN DEFAULT false;
ALTER TABLE repair_requests ADD COLUMN IF NOT EXISTS consents_at     TIMESTAMPTZ;

COMMENT ON COLUMN repair_requests.privacy_consent IS 'Zgoda na przetwarzanie danych (RODO) zaznaczona w kroku 5 formularza';
COMMENT ON COLUMN repair_requests.terms_consent   IS 'Akceptacja Regulaminu Serwisu zaznaczona w kroku 5 formularza';
COMMENT ON COLUMN repair_requests.consents_at     IS 'Moment wysłania formularza ze zgodami (dowód czasowy)';

-- Zgłoszenia sprzed wdrożenia zostają z NULL w consents_at — świadomie, żeby dało się je
-- odróżnić od tych, przy których zgodę faktycznie zarejestrowano.


-- ── Numer zgłoszenia: miejsce na sufiks antykolizyjny ─────────────────────────
-- repair_number miał format YYYYMMDDHHmm (dokładnie 12 znaków), więc dwa zgłoszenia
-- z tej samej minuty dostawały ten sam numer. Nowy format to YYYYMMDDHHmm + 2 cyfry.
-- Do czasu uruchomienia tego ALTER-a kod sam wraca do starego, 12-znakowego numeru.

ALTER TABLE repair_requests ALTER COLUMN repair_number TYPE VARCHAR(20);

COMMENT ON COLUMN repair_requests.repair_number IS 'YYYYMMDDHHmm + 2 cyfry losowe (sufiks przeciw kolizjom w tej samej minucie)';

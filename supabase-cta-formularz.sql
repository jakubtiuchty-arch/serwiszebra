-- Lejek przycisku „Wyślij do serwisu" po kliknięciu (23.09.2026).
-- Z 13 kliknięć od 18.08 wyszło 9 zgłoszeń, a o pozostałych nie wiadomo nic — brak zdarzeń kroków
-- formularza i błędów walidacji. Zgłoszeń wysłanych ręcznie po rozmowie nie dało się powiązać z czatem.
--
-- Kod działa także PRZED tą migracją: nowe zdarzenia odbijają się od CHECK i endpoint zwraca 200
-- „skipped", a zapis chat_session_id jest osobnym update'em, którego błąd tylko logujemy.

-- 1. Nowe zdarzenia: form_step (udane przejście kroku), form_error (walidacja: numer kroku i nazwy pól, bez wartości)
DO $$
DECLARE c text;
BEGIN
  FOR c IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.chat_cta_events'::regclass AND contype = 'c'
  LOOP
    EXECUTE format('ALTER TABLE public.chat_cta_events DROP CONSTRAINT %I', c);
  END LOOP;
END $$;

ALTER TABLE public.chat_cta_events
  ADD CONSTRAINT chat_cta_events_event_check
  CHECK (event IN ('shown', 'clicked', 'prefill_applied', 'form_submitted', 'form_step', 'form_error'));

COMMENT ON TABLE public.chat_cta_events IS
  'Lejek CTA w czacie: shown → clicked → prefill_applied → form_step/form_error → form_submitted';

-- 2. Powiązanie zgłoszenia z rozmową z czatem (także gdy klient wypełnił formularz sam, bez przycisku)
ALTER TABLE public.repair_requests ADD COLUMN IF NOT EXISTS chat_session_id TEXT;
CREATE INDEX IF NOT EXISTS idx_repair_requests_chat_session ON public.repair_requests(chat_session_id);
COMMENT ON COLUMN public.repair_requests.chat_session_id IS
  'chat_logs.session_id rozmowy z asystentem, po której wysłano zgłoszenie (sessionStorage w przeglądarce, do 2 h)';

-- Notatka wewnętrzna serwisu na zgłoszeniu naprawy.
-- Uruchom w Supabase SQL Editor.
--
-- To NIE jest `service_notes` — tamte klient widzi w swoim panelu i w raporcie
-- serwisowym. Tutaj trafia wiedza warsztatowa, której klientowi pokazywać nie
-- musimy: co naprawdę było robione, czego próbowano, na co uważać przy tym
-- modelu. Kolumna jest wycinana z odpowiedzi API dla wszystkich poza adminem
-- (lib/repair-internal.ts).

alter table repair_requests add column if not exists internal_notes text;

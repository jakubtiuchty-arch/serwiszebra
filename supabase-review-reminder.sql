-- Drugie, jednorazowe przypomnienie o opinii — wysyłane ~10 dni po pierwszym.
--
-- Osobne kolumny, a nie nadpisywanie `review_request_sent`, bo musimy widzieć,
-- czy klient dostał JEDNO czy DWA maile. Trzeciego nie wysyłamy nigdy.

ALTER TABLE repair_requests
  ADD COLUMN IF NOT EXISTS review_reminder_sent     BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS review_reminder_sent_at  TIMESTAMPTZ;

-- Wyszukiwanie kandydatów: pierwszy mail wysłany, drugi jeszcze nie
CREATE INDEX IF NOT EXISTS repair_requests_review_reminder_idx
  ON repair_requests (review_request_sent_at)
  WHERE review_request_sent = true AND review_reminder_sent IS NOT true;

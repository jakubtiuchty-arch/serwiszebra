-- Lejek CTA „Wyślij do serwisu" w czacie AI.
-- Do tej pory nic nie zapisywało wyświetleń ani kliknięć przycisku — liczbę wyświetleń
-- trzeba było odtwarzać z logiki komponentu i logów rozmów.

CREATE TABLE IF NOT EXISTS chat_cta_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL CHECK (event IN ('shown', 'clicked', 'prefill_applied', 'form_submitted')),
  session_id TEXT,
  log_id UUID,
  meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_cta_events_created_at ON chat_cta_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_cta_events_session ON chat_cta_events(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_cta_events_event ON chat_cta_events(event);

COMMENT ON TABLE chat_cta_events IS 'Lejek CTA w czacie: shown → clicked → prefill_applied → form_submitted';
COMMENT ON COLUMN chat_cta_events.log_id IS 'chat_logs.id odpowiedzi, przy której pokazano CTA';
COMMENT ON COLUMN chat_cta_events.meta IS 'form_submitted: { repairId, prefilledFields[] }';

-- Dzienny lejek do szybkiego podglądu
CREATE OR REPLACE VIEW chat_cta_funnel AS
SELECT
  DATE(created_at) AS date,
  COUNT(*) FILTER (WHERE event = 'shown')           AS shown,
  COUNT(*) FILTER (WHERE event = 'clicked')          AS clicked,
  COUNT(*) FILTER (WHERE event = 'prefill_applied')  AS prefill_applied,
  COUNT(*) FILTER (WHERE event = 'form_submitted')   AS submitted,
  COUNT(DISTINCT session_id) FILTER (WHERE event = 'shown') AS sessions_with_cta
FROM chat_cta_events
GROUP BY DATE(created_at)
ORDER BY date DESC;

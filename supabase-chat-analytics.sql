-- Dodaj kolumny do kategoryzacji i oceny AI
ALTER TABLE chat_logs 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS ai_quality_score INTEGER CHECK (ai_quality_score >= 1 AND ai_quality_score <= 5),
ADD COLUMN IF NOT EXISTS ai_quality_issues TEXT[];

-- Indeks dla kategorii
CREATE INDEX IF NOT EXISTS idx_chat_logs_category ON chat_logs(category);

-- Indeks dla jakości AI
CREATE INDEX IF NOT EXISTS idx_chat_logs_ai_quality ON chat_logs(ai_quality_score);

-- Widok dla codziennych raportów
CREATE OR REPLACE VIEW chat_daily_report AS
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_conversations,
  COUNT(CASE WHEN rag_context_found THEN 1 END) as rag_hits,
  ROUND(AVG(response_time_ms)) as avg_response_time,
  COUNT(CASE WHEN quality_rating >= 4 THEN 1 END) as good_responses,
  COUNT(CASE WHEN quality_rating <= 2 THEN 1 END) as bad_responses,
  COUNT(CASE WHEN quality_rating IS NOT NULL THEN 1 END) as reviewed,
  COUNT(CASE WHEN category IS NOT NULL THEN 1 END) as categorized,
  ROUND(AVG(ai_quality_score), 1) as avg_ai_quality
FROM chat_logs
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Widok dla statystyk kategorii
CREATE OR REPLACE VIEW chat_category_stats AS
SELECT
  category,
  COUNT(*) as count,
  ROUND(AVG(quality_rating), 1) as avg_rating,
  ROUND(AVG(ai_quality_score), 1) as avg_ai_quality,
  COUNT(CASE WHEN rag_context_found THEN 1 END) as rag_hits
FROM chat_logs
WHERE category IS NOT NULL
GROUP BY category
ORDER BY count DESC;

COMMENT ON COLUMN chat_logs.category IS 'Kategoria pytania (printer_error, terminal_issue, scanner_problem, etc.)';
COMMENT ON COLUMN chat_logs.ai_quality_score IS 'Automatyczna ocena jakości odpowiedzi AI (1-5)';
COMMENT ON COLUMN chat_logs.ai_quality_issues IS 'Lista problemów wykrytych w odpowiedzi AI';








-- Tabela do logowania konwersacji z AI
CREATE TABLE IF NOT EXISTS chat_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  rag_context_found BOOLEAN DEFAULT false,
  rag_similarity_score DECIMAL(3,2),
  model_used TEXT DEFAULT 'gemini-3-pro-preview',
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),

  -- Pola do review przez człowieka
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  is_correct BOOLEAN,
  human_feedback TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT,

  -- Metadata
  user_ip TEXT,
  user_agent TEXT
);

-- Indeksy dla szybkiego wyszukiwania
CREATE INDEX IF NOT EXISTS idx_chat_logs_session_id ON chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_created_at ON chat_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_logs_quality_rating ON chat_logs(quality_rating);
CREATE INDEX IF NOT EXISTS idx_chat_logs_is_correct ON chat_logs(is_correct);

-- Tabela do śledzenia sesji użytkowników
CREATE TABLE IF NOT EXISTS chat_sessions (
  session_id TEXT PRIMARY KEY,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  total_messages INTEGER DEFAULT 0,
  converted_to_repair BOOLEAN DEFAULT false,
  user_ip TEXT,
  user_agent TEXT
);

-- Widok ze statystykami
CREATE OR REPLACE VIEW chat_analytics AS
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_conversations,
  AVG(response_time_ms) as avg_response_time,
  COUNT(CASE WHEN rag_context_found THEN 1 END) as rag_hits,
  COUNT(CASE WHEN quality_rating >= 4 THEN 1 END) as good_responses,
  COUNT(CASE WHEN quality_rating <= 2 THEN 1 END) as bad_responses,
  AVG(quality_rating) as avg_rating
FROM chat_logs
WHERE quality_rating IS NOT NULL
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Funkcja do czyszczenia starych logów (opcjonalnie, dla GDPR)
CREATE OR REPLACE FUNCTION cleanup_old_chat_logs()
RETURNS void AS $$
BEGIN
  -- Usuń logi starsze niż 90 dni (dostosuj według potrzeb)
  DELETE FROM chat_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE chat_logs IS 'Logi wszystkich konwersacji z AI chatbotem do analizy i uczenia';
COMMENT ON TABLE chat_sessions IS 'Sesje użytkowników z podstawowymi metrykami';
COMMENT ON VIEW chat_analytics IS 'Dzienny agregat statystyk konwersacji';

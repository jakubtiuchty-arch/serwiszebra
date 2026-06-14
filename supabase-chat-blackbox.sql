-- "Czarna skrzynka" — zapis diagnostyczny dla każdej odpowiedzi chata.
-- Pozwala przy 👎 zobaczyć DLACZEGO: jakiej instrukcji chat użył, jak dobrze pasowała, jakiego urządzenia dotyczyło pytanie.

ALTER TABLE chat_logs ADD COLUMN IF NOT EXISTS detected_model TEXT;   -- wykryty model urządzenia, np. "ZD421t" (NULL = nie wykryto)
ALTER TABLE chat_logs ADD COLUMN IF NOT EXISTS rag_sources JSONB;     -- [{ "manual": "ZD421_Manual", "page": 12, "sim": 0.523 }, ...] posortowane malejąco
-- rag_similarity_score (DECIMAL(3,2)) już istnieje — wpisujemy w nie NAJLEPSZE dopasowanie (top sim)

CREATE INDEX IF NOT EXISTS idx_chat_logs_detected_model ON chat_logs(detected_model);
CREATE INDEX IF NOT EXISTS idx_chat_logs_rag_similarity ON chat_logs(rag_similarity_score);

COMMENT ON COLUMN chat_logs.detected_model IS 'Wykryty model urządzenia z pytania (detectPrinterModel). NULL = brak.';
COMMENT ON COLUMN chat_logs.rag_sources IS 'Fragmenty instrukcji użyte przez AI: manual, strona, similarity (0-1). Pusta tablica = RAG nic nie znalazł.';

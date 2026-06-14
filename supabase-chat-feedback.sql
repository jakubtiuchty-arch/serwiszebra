-- Ocena odpowiedzi przez UŻYTKOWNIKA KOŃCOWEGO (kciuk 👍 / 👎)
-- Osobne kolumny od review admina (quality_rating / is_correct), żeby się nie nadpisywały.

ALTER TABLE chat_logs ADD COLUMN IF NOT EXISTS user_rating SMALLINT;            -- 1 = 👍 pomocne, -1 = 👎 niepomocne, NULL = brak oceny
ALTER TABLE chat_logs ADD COLUMN IF NOT EXISTS user_feedback_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN chat_logs.user_rating IS 'Ocena użytkownika końcowego: 1 = pomocne (👍), -1 = niepomocne (👎). NULL = brak oceny.';

CREATE INDEX IF NOT EXISTS idx_chat_logs_user_rating ON chat_logs(user_rating);

-- ================================================
-- Moduł POCZTA — skrzynka serwis@takma.com.pl w panelu admina
-- Wątki, wiadomości (IMAP pull), szkice odpowiedzi AI, stan synchronizacji
-- Uruchom w Supabase SQL Editor.
-- ================================================

-- Wątki korespondencji (grupowanie po Message-ID/References lub email+temat)
CREATE TABLE IF NOT EXISTS mail_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  last_message_at TIMESTAMPTZ,
  -- new = nowy mail bez szkicu | drafted = szkic AI gotowy | replied = odpowiedziano | archived | spam
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mail_threads_status ON mail_threads(status);
CREATE INDEX IF NOT EXISTS idx_mail_threads_customer ON mail_threads(customer_email);
CREATE INDEX IF NOT EXISTS idx_mail_threads_last_msg ON mail_threads(last_message_at DESC);

-- Pojedyncze wiadomości (przychodzące z IMAP i wysłane z panelu)
CREATE TABLE IF NOT EXISTS mail_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES mail_threads(id) ON DELETE CASCADE,
  direction TEXT NOT NULL, -- inbound | outbound
  message_id TEXT UNIQUE,  -- nagłówek Message-ID (dedupe przy ponownym imporcie)
  in_reply_to TEXT,
  imap_uid BIGINT,
  from_email TEXT,
  from_name TEXT,
  to_email TEXT,
  subject TEXT,
  body_text TEXT,
  body_html TEXT,
  is_automated BOOLEAN NOT NULL DEFAULT false, -- newsletter/powiadomienie — bez szkicu AI
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mail_messages_thread ON mail_messages(thread_id, sent_at);
CREATE INDEX IF NOT EXISTS idx_mail_messages_message_id ON mail_messages(message_id);

-- Szkice odpowiedzi AI (osobno od wiadomości — pętla jakości: ai_draft vs edited_draft)
CREATE TABLE IF NOT EXISTS mail_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES mail_threads(id) ON DELETE CASCADE,
  message_id UUID REFERENCES mail_messages(id) ON DELETE CASCADE, -- na którą wiadomość odpowiada
  ai_draft TEXT,
  edited_draft TEXT,
  context JSONB, -- co AI wiedziało (naprawy, zamówienia klienta)
  status TEXT NOT NULL DEFAULT 'proposed', -- proposed | sent | discarded
  sent_by TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mail_drafts_thread ON mail_drafts(thread_id, created_at DESC);

-- Stan synchronizacji IMAP (jeden wiersz)
CREATE TABLE IF NOT EXISTS mail_sync_state (
  id INT PRIMARY KEY DEFAULT 1,
  uidvalidity BIGINT,
  last_uid BIGINT NOT NULL DEFAULT 0,
  last_sync_at TIMESTAMPTZ,
  CONSTRAINT mail_sync_state_single CHECK (id = 1)
);

-- RLS: dostęp wyłącznie przez service role (API admina po requireAdminServer)
ALTER TABLE mail_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE mail_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mail_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mail_sync_state ENABLE ROW LEVEL SECURITY;

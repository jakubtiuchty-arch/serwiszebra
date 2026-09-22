-- Pełny tekst każdego dokumentu, gotowy do wklejenia do promptu.
--
-- PO CO: czat dostaje dziś PIĘĆ fragmentów po 1000 znaków, czyli ~1% instrukcji, wybrane przez
-- podobieństwo wektorowe. Pomiar z 22.09.2026 na 14 prawdziwych pytaniach z archiwum: cała
-- instrukcja w kontekście bije te pięć wycinków 18 głosów do 8 w ślepej ocenie, zawiera właściwą
-- procedurę 10 razy częściej (10/28 wobec 1/28) i NIE jest wolniejsza (mediana czasu do pierwszego
-- znaku 6,4 s wobec 8,0 s, bo odpada budowanie zapytania i embedding).
--
-- DLACZEGO OSOBNA TABELA, a nie sklejanie z manuals_documents przy każdym żądaniu: złożenie
-- instrukcji ZT411 to pobranie 887 wierszy i sklejenie ich w pamięci. To ma się dziać RAZ,
-- przy ingeście, a nie przy każdym pytaniu klienta.
--
-- Jeden wiersz = jeden dokument źródłowy (PDF), nie jeden model. Model bywa opisany kilkoma
-- dokumentami naraz: ZC100 ma katalog części, service manual oraz instrukcje użytkownika
-- angielską i polską. Klucz (manual_name, source_file) pozwala je składać w dowolnej kolejności
-- i wymieniać pojedynczo.
--
-- Uruchomić w edytorze SQL Supabase, potem: node scripts/build-manuals-full-text.mjs

CREATE TABLE IF NOT EXISTS manuals_full_text (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manual_name  TEXT NOT NULL,              -- jak w manuals_documents, np. "ZD421_Manual"
  source_file  TEXT NOT NULL,              -- nazwa pliku PDF, np. "zd421_zd621-service-manual.pdf"
  doc_type     TEXT,                       -- service | parts | userguide | stare (stary wsad bez metadanych)
  lang         TEXT,                       -- en | pl — wykryte po znakach diakrytycznych
  content      TEXT NOT NULL,              -- pełny tekst dokumentu, zakładki między fragmentami zdjęte
  chars        INTEGER NOT NULL,           -- długość w znakach
  tokens_est   INTEGER,                    -- szacunek: angielski /4,4  polski /3,1 (zmierzone 22.09.2026)
  chunk_count  INTEGER,                    -- z ilu fragmentów manuals_documents złożony
  page_from    INTEGER,
  page_to      INTEGER,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (manual_name, source_file)
);

-- Główne zapytanie czatu: „daj wszystkie dokumenty tego modelu".
CREATE INDEX IF NOT EXISTS idx_manuals_full_text_manual ON manuals_full_text(manual_name);
-- Kolejność wklejania do promptu: katalog części, potem serwisowy, potem instrukcje użytkownika.
CREATE INDEX IF NOT EXISTS idx_manuals_full_text_typ ON manuals_full_text(manual_name, doc_type);

COMMENT ON TABLE  manuals_full_text            IS 'Pełny tekst dokumentów do wklejenia w prompt czatu. Budowany z manuals_documents przez scripts/build-manuals-full-text.mjs.';
COMMENT ON COLUMN manuals_full_text.source_file IS 'Ten sam identyfikator co metadata->>source_file w manuals_documents — po nim idzie przebudowa pojedynczego dokumentu.';
COMMENT ON COLUMN manuals_full_text.tokens_est  IS 'Szacunek, nie pomiar. Zmierzone 22.09.2026 na usage.prompt_tokens: angielski 4,1-4,5 zn/tok, polski 3,0-3,2.';
COMMENT ON COLUMN manuals_full_text.doc_type    IS 'service = manual serwisowy, parts = katalog części, userguide = instrukcja użytkownika, stare = wsad sprzed 22.09.2026 bez metadanych.';

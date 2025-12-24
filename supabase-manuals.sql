-- =====================================================
-- TABELA: manuals (Instrukcje obsługi urządzeń Zebra)
-- =====================================================

CREATE TABLE IF NOT EXISTS manuals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Podstawowe dane modelu
  model VARCHAR(50) NOT NULL,           -- np. "ZD420", "TC21", "DS2208"
  name VARCHAR(100) NOT NULL,           -- np. "Zebra ZD420 - Drukarka etykiet"
  category VARCHAR(50) NOT NULL,        -- drukarki-etykiet, drukarki-kart, drukarki-mobilne, terminale, skanery, tablety
  image_url VARCHAR(255),               -- URL do zdjęcia urządzenia
  description TEXT,                     -- Krótki opis urządzenia
  
  -- Dokumenty (JSONB dla elastyczności)
  documents JSONB DEFAULT '{}',
  -- Struktura:
  -- {
  --   "quickStart": { "url": "https://...", "lang": "pl", "title": "Szybki start" },
  --   "userGuide": { "url": "https://...", "lang": "en", "title": "User Guide" },
  --   "programming": { "url": "https://...", "lang": "en", "title": "ZPL Manual" },
  --   "service": { "url": "https://...", "lang": "en", "title": "Service Manual" },
  --   "videos": [{ "url": "https://youtube.com/...", "title": "Kalibracja" }]
  -- }
  
  -- SEO
  keywords TEXT[],                      -- Słowa kluczowe dla SEO
  
  -- Flagi
  is_popular BOOLEAN DEFAULT FALSE,     -- Czy wyróżniony/popularny
  is_active BOOLEAN DEFAULT TRUE,       -- Czy aktywny (widoczny)
  
  -- Sortowanie
  sort_order INTEGER DEFAULT 0
);

-- Indeksy
CREATE INDEX idx_manuals_category ON manuals(category);
CREATE INDEX idx_manuals_model ON manuals(model);
CREATE INDEX idx_manuals_is_active ON manuals(is_active);
CREATE INDEX idx_manuals_is_popular ON manuals(is_popular);

-- Trigger do aktualizacji updated_at
CREATE OR REPLACE FUNCTION update_manuals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_manuals_updated_at
  BEFORE UPDATE ON manuals
  FOR EACH ROW
  EXECUTE FUNCTION update_manuals_updated_at();

-- =====================================================
-- DANE TESTOWE (6 modeli - po jednym z kategorii)
-- =====================================================

INSERT INTO manuals (model, name, category, image_url, description, documents, keywords, is_popular, sort_order) VALUES

-- 1. Drukarki etykiet - ZD420
('ZD420', 'Zebra ZD420 - Drukarka etykiet biurkowa', 'drukarki-etykiet', 
 '/manuals/zd420.png',
 'Popularna drukarka etykiet termiczna/termotransferowa. Idealna do logistyki, magazynów i handlu detalicznego.',
 '{
   "quickStart": {"url": "https://www.zebra.com/content/dam/zebra_new_ia/en-us/manuals/printers/desktop/zd420/zd420-qsg-en.pdf", "lang": "en", "title": "Quick Start Guide"},
   "userGuide": {"url": "https://www.zebra.com/content/dam/zebra_new_ia/en-us/manuals/printers/desktop/zd420/zd420-ug-en.pdf", "lang": "en", "title": "User Guide"},
   "programming": {"url": "https://www.zebra.com/content/dam/zebra_new_ia/en-us/manuals/printers/common/programming/zpl-zbi2-pm-en.pdf", "lang": "en", "title": "ZPL Programming Guide"},
   "videos": [{"url": "https://www.youtube.com/watch?v=l03OFhvhWxY", "title": "Kalibracja ZD420"}]
 }',
 ARRAY['instrukcja zd420', 'zebra zd420 manual', 'zd420 user guide', 'drukarka zebra zd420', 'zd420 kalibracja'],
 TRUE, 10),

-- 2. Drukarki kart - ZC300
('ZC300', 'Zebra ZC300 - Drukarka kart plastikowych', 'drukarki-kart',
 '/manuals/zc300.png', 
 'Profesjonalna drukarka kart ID. Druk jednostronny, enkoder magnetyczny opcjonalny.',
 '{
   "quickStart": {"url": "https://www.zebra.com/content/dam/zebra_new_ia/en-us/manuals/printers/card/zc100-zc300/zc300-qsg-en.pdf", "lang": "en", "title": "Quick Start Guide"},
   "userGuide": {"url": "https://www.zebra.com/content/dam/zebra_new_ia/en-us/manuals/printers/card/zc100-zc300/zc300-ug-en.pdf", "lang": "en", "title": "User Guide"},
   "videos": []
 }',
 ARRAY['instrukcja zc300', 'zebra zc300 manual', 'drukarka kart zc300', 'zc300 user guide'],
 TRUE, 20),

-- 3. Drukarki mobilne - ZQ630
('ZQ630', 'Zebra ZQ630 - Drukarka mobilna 4"', 'drukarki-mobilne',
 '/manuals/zq630.png',
 'Wytrzymała drukarka mobilna dla kurierów i pracowników terenowych. Druk 4" (102mm).',
 '{
   "quickStart": {"url": "https://www.zebra.com/content/dam/zebra_new_ia/en-us/manuals/printers/mobile/zq600/zq630-qsg-en.pdf", "lang": "en", "title": "Quick Start Guide"},
   "userGuide": {"url": "https://www.zebra.com/content/dam/zebra_new_ia/en-us/manuals/printers/mobile/zq600/zq630-ug-en.pdf", "lang": "en", "title": "User Guide"},
   "videos": []
 }',
 ARRAY['instrukcja zq630', 'zebra zq630 manual', 'drukarka mobilna zq630', 'zq630 kurier'],
 TRUE, 30),

-- 4. Terminale - TC21
('TC21', 'Zebra TC21 - Terminal mobilny', 'terminale',
 '/manuals/tc21.png',
 'Lekki i wytrzymały terminal mobilny Android. Popularny w magazynach i handlu.',
 '{
   "quickStart": {"url": "https://www.zebra.com/content/dam/zebra_new_ia/en-us/manuals/mobile-computers/handheld/tc2x/tc21-qsg-en.pdf", "lang": "en", "title": "Quick Start Guide"},
   "userGuide": {"url": "https://www.zebra.com/content/dam/zebra_new_ia/en-us/manuals/mobile-computers/handheld/tc2x/tc21-ug-en.pdf", "lang": "en", "title": "User Guide"},
   "programming": {"url": "https://techdocs.zebra.com/datawedge/", "lang": "en", "title": "DataWedge Documentation"},
   "videos": []
 }',
 ARRAY['instrukcja tc21', 'zebra tc21 manual', 'terminal tc21', 'tc21 user guide', 'tc21 datawedge'],
 TRUE, 40),

-- 5. Skanery - DS2208
('DS2208', 'Zebra DS2208 - Skaner kodów kreskowych', 'skanery',
 '/manuals/ds2208.png',
 'Uniwersalny skaner 2D do kas, magazynów i aptek. Czyta wszystkie kody kreskowe.',
 '{
   "quickStart": {"url": "https://www.zebra.com/content/dam/zebra_new_ia/en-us/manuals/barcode-scanners/ds2200/ds2208-qsg-en.pdf", "lang": "en", "title": "Quick Start Guide"},
   "userGuide": {"url": "https://www.zebra.com/content/dam/zebra_new_ia/en-us/manuals/barcode-scanners/ds2200/ds2208-prg-en.pdf", "lang": "en", "title": "Product Reference Guide"},
   "videos": []
 }',
 ARRAY['instrukcja ds2208', 'zebra ds2208 manual', 'skaner ds2208', 'ds2208 konfiguracja'],
 TRUE, 50),

-- 6. Tablety - L10
('L10', 'Zebra L10 (XSlate) - Tablet przemysłowy', 'tablety',
 '/manuals/l10.png',
 'Wytrzymały tablet 10" dla służb ratowniczych i pracowników terenowych. IP65, upadki z 1.5m.',
 '{
   "quickStart": {"url": "https://www.zebra.com/content/dam/zebra_new_ia/en-us/manuals/tablets/l10/l10-qsg-en.pdf", "lang": "en", "title": "Quick Start Guide"},
   "userGuide": {"url": "https://www.zebra.com/content/dam/zebra_new_ia/en-us/manuals/tablets/l10/l10-ug-en.pdf", "lang": "en", "title": "User Guide"},
   "videos": []
 }',
 ARRAY['instrukcja l10', 'zebra l10 manual', 'tablet l10', 'xslate l10', 'l10 ambulans'],
 TRUE, 60);

-- RLS (Row Level Security) - publiczny dostęp do odczytu
ALTER TABLE manuals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Manuals are viewable by everyone" ON manuals
  FOR SELECT USING (is_active = TRUE);

-- Admini mogą edytować przez service_role key (w API routes)
-- Lub dodaj własną politykę dopasowaną do struktury profiles


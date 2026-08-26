-- Cache cen i stanów od trzech dystrybutorów (Ingram, BlueStar, Jarltech).
--
-- Do tej pory sklep pytał ich API przy każdym renderze karty. Przy karcie
-- urządzenia z wariantami i blokiem akcesoriów to ~18 zapytań na jedną odsłonę,
-- każde do trzech dystrybutorów — stąd 429 od Ingrama. Teraz odpytuje ich cron,
-- a strona czyta gotowy wiersz.
--
-- Wzorzec przeniesiony z takma.com.pl (tam tabela StockCache w Prismie).

CREATE TABLE IF NOT EXISTS stock_cache (
  part_number    TEXT PRIMARY KEY,
  found          BOOLEAN NOT NULL DEFAULT false,

  -- Ceny sprzedaży w PLN (już z marżą). NULL = żaden dystrybutor nie podał ceny.
  price          NUMERIC(10,2),
  price_brutto   NUMERIC(10,2),
  -- Cena zakupu, od której liczona była marża — do kontroli i alertów
  purchase_price NUMERIC(10,2),
  -- Z którego dystrybutora pochodzi cena: ingram | bluestar | jarltech
  price_source   TEXT,

  stock_pl       INTEGER NOT NULL DEFAULT 0,
  stock_eu       INTEGER NOT NULL DEFAULT 0,
  in_delivery    INTEGER NOT NULL DEFAULT 0,
  total_stock    INTEGER NOT NULL DEFAULT 0,

  availability   TEXT NOT NULL DEFAULT 'unavailable',  -- available | on-order | unavailable
  delivery_text  TEXT,

  -- Którzy dystrybutorzy odpowiedzieli w ostatnim przebiegu — do diagnostyki awarii
  sources        JSONB NOT NULL DEFAULT '{}'::jsonb,

  last_sync      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cron bierze do odświeżenia najpierw te bez ceny, potem najdawniej odświeżane
CREATE INDEX IF NOT EXISTS stock_cache_last_sync_idx ON stock_cache (last_sync);
CREATE INDEX IF NOT EXISTS stock_cache_price_null_idx ON stock_cache ((price IS NULL));

-- Bez polityk = dostęp wyłącznie przez service role (cron i API serwera).
-- Klient nigdy nie czyta tej tabeli bezpośrednio.
ALTER TABLE stock_cache ENABLE ROW LEVEL SECURITY;

-- Log przebiegów crona — żeby dało się zobaczyć, że dystrybutor leżał
CREATE TABLE IF NOT EXISTS stock_sync_log (
  id                BIGSERIAL PRIMARY KEY,
  started_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_seconds  INTEGER,
  total_pns         INTEGER,
  synced            INTEGER,
  found             INTEGER,
  errors            INTEGER,
  -- Ile paczek zwróciło błąd per dystrybutor
  distributor_errors JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- PN-y, przy których cena jednego ze źródeł była odstająca
  suspect_prices    JSONB NOT NULL DEFAULT '[]'::jsonb
);

ALTER TABLE stock_sync_log ENABLE ROW LEVEL SECURITY;

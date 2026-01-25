-- Dodaj kolumny dla integracji z Ingram Micro
-- Uruchom to w Supabase SQL Editor

-- Dodaj kolumny do tabeli orders
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS ingram_order_number TEXT,
ADD COLUMN IF NOT EXISTS ingram_order_date TIMESTAMPTZ;

-- Utwórz indeks dla szybkiego wyszukiwania
CREATE INDEX IF NOT EXISTS idx_orders_ingram_order_number 
ON orders(ingram_order_number) 
WHERE ingram_order_number IS NOT NULL;

-- Komentarze dla dokumentacji
COMMENT ON COLUMN orders.ingram_order_number IS 'Numer zamówienia w Ingram Micro (automatyczne zamówienia głowic)';
COMMENT ON COLUMN orders.ingram_order_date IS 'Data złożenia zamówienia w Ingram Micro';

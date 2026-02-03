-- Dodaj kolumny dla integracji Stripe w tabeli shop_orders
-- Uruchom w Supabase SQL Editor

-- Kolumna na ID sesji Stripe Checkout
ALTER TABLE shop_orders 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- Kolumna na ID płatności Stripe
ALTER TABLE shop_orders 
ADD COLUMN IF NOT EXISTS stripe_payment_id TEXT;

-- Kolumna na datę płatności
ALTER TABLE shop_orders 
ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

-- Kolumna na status zamówienia (jeśli nie istnieje)
ALTER TABLE shop_orders 
ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'new';

-- Upewnij się że payment_status może przyjąć odpowiednie wartości
-- (pending, processing, succeeded, failed)
-- Jeśli kolumna nie istnieje:
ALTER TABLE shop_orders 
ADD COLUMN IF NOT EXISTS payment_status TEXT;

-- Indeksy dla szybkiego wyszukiwania
CREATE INDEX IF NOT EXISTS idx_shop_orders_stripe_session_id ON shop_orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_shop_orders_stripe_payment_id ON shop_orders(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_shop_orders_payment_status ON shop_orders(payment_status);

-- Weryfikacja - pokaż strukturę tabeli
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'shop_orders'
ORDER BY ordinal_position;

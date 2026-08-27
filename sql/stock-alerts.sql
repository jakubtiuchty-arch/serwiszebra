-- Powiadomienia „produkt znowu dostępny" — zapisy klientów z kart produktów.
-- Cron stock-sync po każdym przebiegu sprawdza niepowiadomione wpisy i wysyła
-- maila, gdy numer wrócił na stan (świeży wiersz stock_cache z total_stock > 0).
create table if not exists stock_alerts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  sku text not null,
  product_name text not null default '',
  product_url text not null default '',
  created_at timestamptz not null default now(),
  notified_at timestamptz,
  unique (email, sku)
);

-- RLS bez polityk = dostęp wyłącznie kluczem service role (jak stock_cache)
alter table stock_alerts enable row level security;

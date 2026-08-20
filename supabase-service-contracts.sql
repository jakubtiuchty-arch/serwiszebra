-- Kontrakty serwisowe kupowane w sklepie (3 lata opieki nad jedną drukarką)
-- Uruchom w Supabase SQL Editor.
--
-- Kontrakt jest przypisany do KONKRETNEGO urządzenia, dlatego numer seryjny jest
-- obowiązkowy — bez niego nie wiemy, co obejmuje ochrona, gdy sprzęt wraca do serwisu.

-- 1. Produkt w tabeli products.
--    product_type = 'kontrakt' trzyma go poza listingami części (te filtrują po
--    typach: glowica, walek, akumulator, zasilacz, konwerter), a jednocześnie
--    pozwala pobrać go po slugu i włożyć do zwykłego koszyka.
insert into products (
  name, slug, category, product_type, sku,
  price, price_brutto, vat_rate,
  description, stock, is_active, manufacturer, meta_title, meta_description
)
values (
  'Kontrakt serwisowy Zebra — 3 lata opieki',
  'kontrakt-serwisowy-3-lata',
  'uslugi',
  'kontrakt',
  'KTR-3Y',
  599.00,
  736.77,
  23,
  'Trzy lata opieki serwisowej nad jedną drukarką Zebra: odbiór kurierem i odesłanie w cenie, diagnostyka i robocizna bez dopłat, naprawa w 48 godzin roboczych, urządzenie zastępcze w miarę dostępności, przegląd z czyszczeniem raz w roku, głowica i pozostałe części 40% taniej.',
  999,
  true,
  'TAKMA',
  'Kontrakt serwisowy Zebra na 3 lata — 599 zł netto',
  'Trzy lata opieki nad drukarką Zebra bez rachunków za robociznę. Odbiór kurierem, naprawa w 48 h, części 40% taniej. Kupujesz online, podajesz numer seryjny.'
)
on conflict (slug) do nothing;

-- 2. Rejestr wykupionych kontraktów — jeden wiersz na jedno urządzenie.
create table if not exists service_contracts (
  id uuid primary key default gen_random_uuid(),
  contract_number text unique not null,             -- KTR-YYYYMMDD-XXXX
  order_id uuid references shop_orders (id),        -- zamówienie, z którego powstał
  order_number text,

  -- Dane nabywcy przepisane z zamówienia, żeby kontrakt czytało się bez joinów
  company_name text,
  nip text,
  contact_name text,
  email text,
  phone text,

  device_model text not null,
  serial_number text not null,

  starts_at date,                                   -- ustawiane w dniu opłacenia
  ends_at date,                                     -- starts_at + 3 lata
  price_netto numeric(10, 2) not null default 599,
  price_brutto numeric(10, 2) not null default 736.77,

  -- pending: zamówienie złożone, jeszcze nieopłacone
  -- active:  opłacone, ochrona biegnie
  status text not null default 'pending'
    check (status in ('pending', 'active', 'expired', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Po numerze seryjnym sprawdzamy pokrycie, gdy sprzęt trafia na warsztat
create index if not exists service_contracts_serial_idx on service_contracts (upper(serial_number));
create index if not exists service_contracts_status_idx on service_contracts (status);
create index if not exists service_contracts_ends_at_idx on service_contracts (ends_at);

-- RLS włączone bez polityk = dostęp wyłącznie przez service role (API serwera)
alter table service_contracts enable row level security;

-- Wypożyczenia sprzętu (urządzenia zastępcze / wypożyczenia dla klientów)
-- Uruchom w Supabase SQL Editor

create table if not exists rentals (
  id uuid primary key default gen_random_uuid(),
  rental_number text unique not null,               -- WYP-YYYYMMDDHHmm
  customer_name text not null,
  company text,
  email text,
  phone text,
  device_model text not null,
  serial_number text not null,                      -- lub 'NIECZYTELNY'
  repair_number text,                               -- powiązane zgłoszenie naprawy (opcjonalnie)
  rented_at timestamptz not null default now(),     -- data wypożyczenia
  return_requested_at timestamptz,                  -- kiedy wysłano wezwanie do zwrotu (po 14 dniach)
  last_reminder_at timestamptz,                     -- ostatnie przypomnienie do serwisu (co 7 dni)
  returned_at timestamptz,                          -- kiedy pracownik odznaczył "odebrano"
  status text not null default 'active' check (status in ('active', 'return_requested', 'returned')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rentals_status_idx on rentals (status);
create index if not exists rentals_rented_at_idx on rentals (rented_at desc);

-- RLS włączone bez polityk = dostęp tylko przez service role (API admina)
alter table rentals enable row level security;

-- Podpisany protokół wypożyczenia (ścieżka w prywatnym buckecie rental-docs)
-- (osobne ALTER, żeby zadziałało też na już utworzonej tabeli)
alter table rentals add column if not exists signed_document_path text;

-- Dodanie wałków dociskowych do drukarek Zebra ZD421/ZD621
-- Cena zakupu: 24.85 EUR * 4.30 = 106.86 PLN
-- Marża 30%: 138.91 PLN netto
-- VAT 23%: 170.86 PLN brutto

-- Kategoria: walek_dociskowy
-- Typ drukarki: biurkowe (ZD421, ZD621)

INSERT INTO products (
  name,
  slug,
  sku,
  product_type,
  category,
  manufacturer,
  is_active,
  device_model,
  compatible_models,
  resolution_dpi,
  purchase_price_netto,
  margin_percent,
  price,
  vat_rate,
  price_brutto,
  stock,
  lead_time_days,
  description,
  description_long,
  meta_title,
  meta_description
) VALUES
-- 1. Wałek dociskowy 203dpi do ZD421T
(
  'Wałek dociskowy 203dpi do drukarki Zebra ZD421t',
  'walek-dociskowy-203dpi-zebra-zd421t',
  'P1112640-216',
  'walek',
  'czesci-zamienne',
  'Zebra',
  true,
  'ZD421t',
  ARRAY['ZD421t'],
  203,
  106.86,
  30,
  138.92,
  23,
  170.87,
  0,
  5,
  'Oryginalny wałek dociskowy (platen roller) 203dpi do drukarki etykiet Zebra ZD421t. Część zamienna zapewniająca prawidłowy docisk i transport etykiet.',
  'Oryginalny wałek dociskowy Zebra (Kit, Platen Roller 203 dpi) do drukarki termotransferowej ZD421t.

Wałek dociskowy to kluczowy element drukarki odpowiedzialny za prawidłowy docisk i transport nośnika (etykiet, taśm). Regularna wymiana wałka zapewnia:
- Równomierne dociskanie etykiet do głowicy drukującej
- Prawidłowy transport nośnika bez poślizgu
- Wysoką jakość wydruku bez smug i nierówności
- Dłuższą żywotność głowicy drukującej

Zalecana wymiana co 1-2 lata intensywnej eksploatacji lub przy widocznych oznakach zużycia (nierówny wydruk, ślady na etykietach).

Numer katalogowy Zebra: P1112640-216',
  'Wałek dociskowy 203dpi Zebra ZD421t - P1112640-216 | Oryginalny platen roller',
  'Oryginalny wałek dociskowy 203dpi do drukarki Zebra ZD421t. Numer katalogowy P1112640-216. Gwarancja kompatybilności. Szybka wysyłka.'
),

-- 2. Wałek dociskowy 300dpi do ZD421T
(
  'Wałek dociskowy 300dpi do drukarki Zebra ZD421t',
  'walek-dociskowy-300dpi-zebra-zd421t',
  'P1112640-217',
  'walek',
  'czesci-zamienne',
  'Zebra',
  true,
  'ZD421t',
  ARRAY['ZD421t'],
  300,
  106.86,
  30,
  138.92,
  23,
  170.87,
  0,
  5,
  'Oryginalny wałek dociskowy (platen roller) 300dpi do drukarki etykiet Zebra ZD421t. Część zamienna zapewniająca prawidłowy docisk i transport etykiet.',
  'Oryginalny wałek dociskowy Zebra (Kit, Platen Roller 300 dpi) do drukarki termotransferowej ZD421t.

Wałek dociskowy to kluczowy element drukarki odpowiedzialny za prawidłowy docisk i transport nośnika (etykiet, taśm). Regularna wymiana wałka zapewnia:
- Równomierne dociskanie etykiet do głowicy drukującej
- Prawidłowy transport nośnika bez poślizgu
- Wysoką jakość wydruku bez smug i nierówności
- Dłuższą żywotność głowicy drukującej

Zalecana wymiana co 1-2 lata intensywnej eksploatacji lub przy widocznych oznakach zużycia (nierówny wydruk, ślady na etykietach).

Numer katalogowy Zebra: P1112640-217',
  'Wałek dociskowy 300dpi Zebra ZD421t - P1112640-217 | Oryginalny platen roller',
  'Oryginalny wałek dociskowy 300dpi do drukarki Zebra ZD421t. Numer katalogowy P1112640-217. Gwarancja kompatybilności. Szybka wysyłka.'
),

-- 3. Wałek dociskowy 203dpi do ZD421D/ZD621D
(
  'Wałek dociskowy 203dpi do drukarki Zebra ZD421d / ZD621d',
  'walek-dociskowy-203dpi-zebra-zd421d-zd621d',
  'P1112640-061',
  'walek',
  'czesci-zamienne',
  'Zebra',
  true,
  'ZD421d / ZD621d',
  ARRAY['ZD421d', 'ZD621d'],
  203,
  106.86,
  30,
  138.92,
  23,
  170.87,
  0,
  5,
  'Oryginalny wałek dociskowy (platen roller) 203dpi do drukarek etykiet Zebra ZD421d i ZD621d. Część zamienna zapewniająca prawidłowy docisk i transport etykiet.',
  'Oryginalny wałek dociskowy Zebra (Kit, Platen Roller 203 dpi) do drukarek termicznych bezpośrednich ZD421d i ZD621d.

Wałek dociskowy to kluczowy element drukarki odpowiedzialny za prawidłowy docisk i transport nośnika (etykiet, taśm). Regularna wymiana wałka zapewnia:
- Równomierne dociskanie etykiet do głowicy drukującej
- Prawidłowy transport nośnika bez poślizgu
- Wysoką jakość wydruku bez smug i nierówności
- Dłuższą żywotność głowicy drukującej

Kompatybilność:
- Zebra ZD421d (druk termiczny bezpośredni)
- Zebra ZD621d (druk termiczny bezpośredni)

Zalecana wymiana co 1-2 lata intensywnej eksploatacji lub przy widocznych oznakach zużycia.

Numer katalogowy Zebra: P1112640-061',
  'Wałek dociskowy 203dpi Zebra ZD421d ZD621d - P1112640-061 | Oryginalny platen roller',
  'Oryginalny wałek dociskowy 203dpi do drukarek Zebra ZD421d i ZD621d. Numer katalogowy P1112640-061. Gwarancja kompatybilności.'
),

-- 4. Wałek dociskowy 300dpi do ZD421D/ZD621D
(
  'Wałek dociskowy 300dpi do drukarki Zebra ZD421d / ZD621d',
  'walek-dociskowy-300dpi-zebra-zd421d-zd621d',
  'P1112640-062',
  'walek',
  'czesci-zamienne',
  'Zebra',
  true,
  'ZD421d / ZD621d',
  ARRAY['ZD421d', 'ZD621d'],
  300,
  106.86,
  30,
  138.92,
  23,
  170.87,
  0,
  5,
  'Oryginalny wałek dociskowy (platen roller) 300dpi do drukarek etykiet Zebra ZD421d i ZD621d. Część zamienna zapewniająca prawidłowy docisk i transport etykiet.',
  'Oryginalny wałek dociskowy Zebra (Kit, Platen Roller 300 dpi) do drukarek termicznych bezpośrednich ZD421d i ZD621d.

Wałek dociskowy to kluczowy element drukarki odpowiedzialny za prawidłowy docisk i transport nośnika (etykiet, taśm). Regularna wymiana wałka zapewnia:
- Równomierne dociskanie etykiet do głowicy drukującej
- Prawidłowy transport nośnika bez poślizgu
- Wysoką jakość wydruku bez smug i nierówności
- Dłuższą żywotność głowicy drukującej

Kompatybilność:
- Zebra ZD421d (druk termiczny bezpośredni)
- Zebra ZD621d (druk termiczny bezpośredni)

Zalecana wymiana co 1-2 lata intensywnej eksploatacji lub przy widocznych oznakach zużycia.

Numer katalogowy Zebra: P1112640-062',
  'Wałek dociskowy 300dpi Zebra ZD421d ZD621d - P1112640-062 | Oryginalny platen roller',
  'Oryginalny wałek dociskowy 300dpi do drukarek Zebra ZD421d i ZD621d. Numer katalogowy P1112640-062. Gwarancja kompatybilności.'
);

-- Sprawdź dodane produkty
SELECT name, sku, price, price_brutto, device_model, resolution_dpi 
FROM products 
WHERE product_type = 'walek'
ORDER BY created_at DESC;

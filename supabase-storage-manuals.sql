-- =====================================================
-- STORAGE: Bucket 'manuals' dla instrukcji PDF
-- =====================================================

-- 1. Utwórz bucket 'manuals' (publiczny do odczytu)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'manuals',
  'manuals',
  true,  -- publiczny dostęp do odczytu
  52428800,  -- 50MB limit na plik
  ARRAY['application/pdf']::text[]  -- tylko PDF
)
ON CONFLICT (id) DO NOTHING;

-- 2. Polityka: każdy może czytać pliki
CREATE POLICY "Public read access for manuals" ON storage.objects
  FOR SELECT USING (bucket_id = 'manuals');

-- 3. Polityka: tylko autoryzowani mogą uploadować (przez service_role)
-- Upload będzie przez Supabase Dashboard lub API z service_role key

-- =====================================================
-- GOTOWE!
-- Teraz możesz uploadować pliki przez:
-- 1. Supabase Dashboard → Storage → manuals → Upload
-- 2. Nazewnictwo: MODEL_TYP_JEZYK.pdf
--    Przykłady:
--    - ZD420_quickstart_en.pdf
--    - ZD420_userguide_pl.pdf
--    - TC21_programming_en.pdf
--    - DS2208_service_en.pdf
-- 
-- Po uploadzie wywołaj sync:
-- POST /api/admin/manuals/sync
-- =====================================================


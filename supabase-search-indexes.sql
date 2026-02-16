-- =============================================
-- Mega Inteligentna Wyszukiwarka Sklepu
-- Uruchom w Supabase SQL Editor
-- =============================================

-- 1. Włącz pg_trgm (trigram similarity)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. GIN trigram indexy na tekstowe kolumny
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_sku_trgm ON products USING gin (sku gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_device_model_trgm ON products USING gin (device_model gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_description_trgm ON products USING gin (description gin_trgm_ops);

-- 3. B-tree indexy na kolumny filtrów
CREATE INDEX IF NOT EXISTS idx_products_product_type ON products (product_type);
CREATE INDEX IF NOT EXISTS idx_products_resolution_dpi ON products (resolution_dpi);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_price ON products (price);

-- 4. Funkcja search_products z relevance scoring
CREATE OR REPLACE FUNCTION search_products(
  search_query text DEFAULT '',
  filter_product_type text DEFAULT NULL,
  filter_resolution int DEFAULT NULL,
  filter_device_model text DEFAULT NULL,
  sort_mode text DEFAULT 'relevance',
  result_limit int DEFAULT 50
)
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  category text,
  product_type text,
  device_model text,
  resolution_dpi int,
  price numeric,
  price_brutto numeric,
  description text,
  stock int,
  sku text,
  compatible_models text[],
  image_url text,
  attributes jsonb,
  is_active boolean,
  relevance_score float
)
LANGUAGE plpgsql
AS $$
DECLARE
  q text;
BEGIN
  q := lower(trim(search_query));

  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.slug,
    p.category,
    p.product_type,
    p.device_model,
    p.resolution_dpi,
    p.price,
    p.price_brutto,
    p.description,
    p.stock,
    p.sku,
    p.compatible_models,
    p.image_url,
    p.attributes,
    p.is_active,
    -- Relevance scoring
    (
      -- SKU exact match = 100
      CASE WHEN lower(p.sku) = q THEN 100
      -- SKU prefix match = 80
           WHEN lower(p.sku) LIKE q || '%' THEN 80
      -- SKU contains = 60
           WHEN lower(p.sku) LIKE '%' || q || '%' THEN 60
           ELSE 0
      END
      +
      -- device_model exact match = 70
      CASE WHEN lower(p.device_model) = q THEN 70
      -- device_model contains = 40
           WHEN lower(p.device_model) LIKE '%' || q || '%' THEN 40
           ELSE 0
      END
      +
      -- name trigram similarity * 50
      (similarity(lower(p.name), q) * 50)
      +
      -- compatible_models array match = 30
      CASE WHEN q = ANY(SELECT lower(unnest(p.compatible_models))) THEN 30
           ELSE 0
      END
      +
      -- description similarity * 10
      (similarity(lower(COALESCE(p.description, '')), q) * 10)
    )::float AS relevance_score
  FROM products p
  WHERE p.is_active = true
    -- Filters
    AND (filter_product_type IS NULL OR p.product_type = filter_product_type)
    AND (filter_resolution IS NULL OR p.resolution_dpi = filter_resolution)
    AND (filter_device_model IS NULL OR lower(p.device_model) LIKE '%' || lower(filter_device_model) || '%')
    -- Search: match if query is empty OR any field matches
    AND (
      q = '' OR
      lower(p.sku) LIKE '%' || q || '%' OR
      lower(p.name) LIKE '%' || q || '%' OR
      lower(p.device_model) LIKE '%' || q || '%' OR
      similarity(lower(p.name), q) > 0.1 OR
      similarity(lower(COALESCE(p.description, '')), q) > 0.05 OR
      q = ANY(SELECT lower(unnest(p.compatible_models)))
    )
  ORDER BY
    CASE WHEN sort_mode = 'price_asc' THEN p.price END ASC NULLS LAST,
    CASE WHEN sort_mode = 'price_desc' THEN p.price END DESC NULLS LAST,
    CASE WHEN sort_mode = 'relevance' OR sort_mode NOT IN ('price_asc', 'price_desc', 'name') THEN
      (
        CASE WHEN lower(p.sku) = q THEN 100
             WHEN lower(p.sku) LIKE q || '%' THEN 80
             WHEN lower(p.sku) LIKE '%' || q || '%' THEN 60
             ELSE 0 END
        + CASE WHEN lower(p.device_model) = q THEN 70
               WHEN lower(p.device_model) LIKE '%' || q || '%' THEN 40
               ELSE 0 END
        + (similarity(lower(p.name), q) * 50)
        + CASE WHEN q = ANY(SELECT lower(unnest(p.compatible_models))) THEN 30 ELSE 0 END
        + (similarity(lower(COALESCE(p.description, '')), q) * 10)
      )
    END DESC NULLS LAST,
    CASE WHEN sort_mode = 'name' THEN p.name END ASC NULLS LAST,
    p.name ASC
  LIMIT result_limit;
END;
$$;

-- 5. Funkcja autocomplete_products (lekka, max 8 wyników, pogrupowane)
DROP FUNCTION IF EXISTS autocomplete_products(text, integer);
CREATE OR REPLACE FUNCTION autocomplete_products(
  query_text text DEFAULT '',
  max_results int DEFAULT 8
)
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  product_type text,
  device_model text,
  resolution_dpi int,
  price numeric,
  price_brutto numeric,
  sku text,
  image_url text,
  stock int,
  attributes jsonb,
  match_type text,
  relevance float
)
LANGUAGE plpgsql
AS $$
DECLARE
  q text;
BEGIN
  q := lower(trim(query_text));

  IF q = '' OR length(q) < 2 THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.slug,
    p.product_type,
    p.device_model,
    p.resolution_dpi,
    p.price,
    p.price_brutto,
    p.sku,
    p.image_url,
    p.stock,
    p.attributes,
    -- Determine match type
    CASE
      WHEN lower(p.sku) LIKE q || '%' THEN 'sku'
      WHEN lower(p.sku) LIKE '%' || q || '%' THEN 'sku'
      WHEN lower(p.device_model) LIKE '%' || q || '%' THEN 'model'
      WHEN similarity(lower(p.name), q) > 0.2 THEN 'name'
      ELSE 'other'
    END AS match_type,
    -- Relevance
    (
      CASE WHEN lower(p.sku) = q THEN 100
           WHEN lower(p.sku) LIKE q || '%' THEN 80
           WHEN lower(p.sku) LIKE '%' || q || '%' THEN 60
           ELSE 0 END
      + CASE WHEN lower(p.device_model) = q THEN 70
             WHEN lower(p.device_model) LIKE '%' || q || '%' THEN 40
             ELSE 0 END
      + (similarity(lower(p.name), q) * 50)
    )::float AS relevance
  FROM products p
  WHERE p.is_active = true
    AND (
      lower(p.sku) LIKE '%' || q || '%' OR
      lower(p.name) LIKE '%' || q || '%' OR
      lower(p.device_model) LIKE '%' || q || '%' OR
      similarity(lower(p.name), q) > 0.15
    )
  ORDER BY relevance DESC, p.name ASC
  LIMIT max_results;
END;
$$;

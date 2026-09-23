-- Rozmowy z czatem i zapisy na powiadomienia o dostępności: dostęp WYŁĄCZNIE przez klucz serwisowy.
--
-- Do 23.09.2026 tabela chat_logs była czytelna publicznym kluczem anon (jest w kodzie strony):
-- każdy mógł pobrać przez PostgREST wszystkie rozmowy klientów z czatu razem z adresami IP
-- (1561 tur w dniu sprawdzenia), a także widoki statystyk czatu. To samo dotyczyło e-maili
-- w stock_notifications. Blokada w API (/api/chat-logs, commit c4d05ac) nie wystarczała,
-- bo bazę dało się odpytać z pominięciem API.
--
-- Bezpieczne dla aplikacji: wszystkie odczyty i zapisy tych tabel idą przez klucz serwisowy
-- (app/api/chat, app/api/chat-logs/*, app/api/admin/chat-analytics, crony chat-alerts,
-- chat-report, chat-heartbeat, check-stock-notifications, app/api/shop/stock-notify),
-- a service_role omija RLS i uprawnienia ról anon/authenticated.
--
-- NIE obejmuje shop_orders, returns, return_items — też są czytelne kluczem anon, ale checkout,
-- weryfikacja płatności i zwroty korzystają z klienta z kluczem anon (lib/supabase/server.ts
-- createClient). Najpierw trzeba przepisać te trasy na klucz serwisowy, dopiero potem odebrać
-- uprawnienia — inaczej przestaną działać zakupy.

ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.chat_logs FROM anon, authenticated;

-- Widoki działają z uprawnieniami właściciela i omijają RLS tabeli — odbieramy je osobno
REVOKE ALL ON public.chat_daily_report, public.chat_category_stats, public.chat_analytics FROM anon, authenticated;

ALTER TABLE public.stock_notifications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.stock_notifications FROM anon, authenticated;

-- Sprawdzenie po uruchomieniu (kluczem anon, np. curl z nagłówkiem apikey): zapytania
-- /rest/v1/chat_logs, /chat_daily_report, /chat_category_stats, /stock_notifications
-- mają zwracać 401 (permission denied), a czat na stronie ma działać bez zmian.

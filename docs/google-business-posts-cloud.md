# Cotygodniowe wpisy Google — wdrożenie

## Stan na 22 września 2026

- Wniosek o dostęp do Google Business Profile API dla projektu `takma-analytics` (numer `361053001566`) i wizytówki „TAKMA - Autoryzowany Serwis Zebra” wysłany. Zgłoszenie: `5-0818000041282`.
- Google podał 7–10 dni roboczych na rozpatrzenie.
- Tabela `public.google_business_post_runs` i publiczny zasobnik `gbp-post-images` zostały utworzone w projekcie Supabase `serwiszebra.pl`.
- Harmonogram Vercel uruchamia trasę o 07:00 i 08:00 UTC w poniedziałek; trasa działa tylko o 09:00 czasu Europe/Warsaw. Obsługuje zmianę czasu.
- `GBP_AUTOPUBLISH_ENABLED` musi mieć wartość `true`, aby cokolwiek opublikować. Domyślnie zadanie jest wyłączone.

## Po zatwierdzeniu API przez Google

1. W projekcie `takma-analytics` włącz Google My Business API oraz Account Management i Business Information API, jeżeli są wymagane.
2. Utwórz klienta OAuth 2.0. Autoryzuj konto będące menedżerem wizytówki ze scope `https://www.googleapis.com/auth/business.manage` i uzyskaj refresh token. Token i client secret trzymaj wyłącznie w sekretach Vercel.
3. Odczytaj identyfikatory konta i lokalizacji przez API (`accounts.list` oraz `accounts.locations.list`) i upewnij się, że lokalizacja to dokładnie „TAKMA - Autoryzowany Serwis Zebra”.
4. Ustaw w projekcie Vercel `serwiszebra_prod` (Production): `GBP_OAUTH_CLIENT_ID`, `GBP_OAUTH_CLIENT_SECRET`, `GBP_OAUTH_REFRESH_TOKEN`, `GBP_ACCOUNT_ID`, `GBP_LOCATION_ID`. Istniejące `OPENAI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` i `CRON_SECRET` są już skonfigurowane.
5. Wdróż kod. Przed włączeniem publikacji wykonaj wyłącznie odczyt API konta, lokalizacji i ostatnich wpisów oraz sprawdź, czy token działa.
6. Ustaw `GBP_AUTOPUBLISH_ENABLED=true`, wykonaj nowe wdrożenie, a po pierwszej udanej publikacji wyłącz dotychczasowe lokalne zadanie Codex `cotygodniowy-wpis-google-serwis-zebra`, aby nie powstały dwa wpisy.

## Zachowanie awaryjne

- Brak kluczy lub dostępu API powoduje błąd; wpis nie jest publikowany.
- Wiersz z datą poniedziałku jest blokadą przed duplikatami. Po nieudanej próbie wymagane jest ręczne sprawdzenie wizytówki przed usunięciem tego wiersza i ponowieniem.
- Tekst i grafika są generowane automatycznie. Grafika przechodzi kontrolę obrazu; wpis bez grafiki nie jest publikowany.
- Błędy widać w logach Vercel i w tabeli `google_business_post_runs`. Obecnie brak osobnego powiadomienia e-mail o błędzie.

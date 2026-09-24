# serwis-zebry.pl — zasady pracy w tym repo

## Komendy w terminalu

**NIGDY nie kończ komendy Bash znakiem `&`.** Uruchamianie procesu w tle przez `... &`
wywołuje monit uprawnień („This command uses the `&` background operator"), którego
lista dozwolonych komend w `.claude/settings.local.json` NIE omija — i użytkownik musi
go ręcznie zatwierdzać.

Zamiast tego:
- serwer deweloperski, serwer produkcyjny, długie zadania → `Bash` z parametrem
  `run_in_background: true`,
- zatrzymanie: osobna komenda `lsof -ti:PORT | xargs kill -9`.

`&&` i `||` są bezpieczne — problem dotyczy wyłącznie samotnego `&` na końcu polecenia.

## Serwery

- **Dev zawsze na porcie 3002**: `npm run dev -- -p 3002`.
- Pomiary layoutu i zrzuty ekranu **tylko na buildzie** (`npm run build` + `npx next start -p 3003`)
  — serwer deweloperski serwuje niekompletny CSS i wyniki są nieprawdziwe.
- Po zakończeniu pomiarów zwolnić port 3003.

## Po każdej zmianie w kodzie

1. `npx tsc --noEmit`
2. `rm -rf .next && npm run build`
3. commit + push
4. restart deva na 3002 (webpack cache Next.js potrafi się zepsuć)

## Strefa płatności — tylko za zgodą Jakuba

Pliki z `scripts/strefa-platnosci/sciezki.txt` (webhook Stripe, płatności napraw, P24,
zmiana statusu zgłoszenia, `lib/stripe`), każdy kod zapisujący `payment_status`,
zapisy w Stripe i zmiany w tabelach zgłoszeń/zamówień.

1. **Przed zmianą** napisz Jakubowi: co zmieniasz, co może przestać działać
   (płatność, webhook, zapis w bazie, maile, statusy), czy baza przyjmie nowe wartości
   (ograniczenia CHECK — lista statusów w `lib/statusy-napraw.ts` i w bazie), jak to sprawdzisz.
   Czekaj na wyraźne „tak”. Hook `.claude/hooks/strefa-platnosci.py` i tak zatrzyma edycję.
2. **Nigdy** nie mieszaj zmian płatności z innymi w jednym commicie. Opis commita mówi wprost,
   co zmienia się w płatnościach.
3. Commit musi mieć linię `Zgoda-platnosci: tak` — bez niej Vercel **nie zbuduje** deployu
   (`scripts/strefa-platnosci/vercel-ignore.sh`).
4. Nowy status zgłoszenia: najpierw SQL w bazie (ograniczenie `repair_requests_status_check`),
   potem `lib/statusy-napraw.ts`, dopiero potem kod, który go zapisuje.

Powód: 19.09.2026 commit „Czat: badge…” zmienił status po płatności na `oplacone`, którego baza
nie znała. Webhook połykał błąd, wpłaty nie zapisywały się przez 5 dni, klient zapłacił dwa razy.
Kontrola: cron `/api/cron/kontrola-platnosci` (codziennie 7:30) i przegląd AI na GitHubie
(`.github/workflows/przeglad-dzienny.yml`).

## Karty produktów

Budowa karty urządzenia: `.claude/skills/karta-produktu/SKILL.md` — pełna checklista
(dane w Supabase, treść w `lib/device-content.tsx`, schema, sitemapy, most z instrukcji,
zasilenie cache po deployu).

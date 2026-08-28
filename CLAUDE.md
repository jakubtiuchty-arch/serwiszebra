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

## Karty produktów

Budowa karty urządzenia: `.claude/skills/karta-produktu/SKILL.md` — pełna checklista
(dane w Supabase, treść w `lib/device-content.tsx`, schema, sitemapy, most z instrukcji,
zasilenie cache po deployu).

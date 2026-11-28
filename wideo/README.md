# Filmy na YouTube (Remotion)

Osobny projekt, poza buildem strony (`wideo/` jest wyłączone w głównym `tsconfig.json`).
Materiały filmu leżą przy scenariuszu: `docs/youtube/<film>/` — `plansze/*.png`, `sceny.json`,
`scenariusz.md`, `napisy-pl.srt`, później lektor (`lektor.mp3`).

```bash
cd wideo
npm install
npm run studio                       # podgląd w przeglądarce, przewijanie po klatkach
npx remotion render src/index.ts Film01-SkanerEnterTab out/film-01.mp4
node scripts/napisy-srt.mjs 01-skaner-enter-tab   # napisy SRT na YouTube z sceny.json
```

W kontenerze w chmurze dodaj `--browser-executable=/opt/pw-browsers/chromium`.

## Nowy film

1. Katalog `docs/youtube/NN-nazwa/` z planszami `plansze/p01.png…` (1920×1080 albo 3840×2160).
2. `sceny.json` jak w filmie 01: czasy scen, plansza, tekst lektora, `kod: true` dla plansz z kodami.
3. Wpis w tablicy `FILMY` w `src/Root.tsx`.

## Zasady

- Plansza z kodem do zeskanowania (`kod: true`) stoi nieruchomo — bez zbliżenia. Każdy ruch to
  rozmyte kreski po kompresji YouTube.
- Napisy w filmie (`src/napisy.ts`) i plik SRT (`scripts/napisy-srt.mjs`) dzielą tekst tak samo.
  Zmiana w jednym = zmiana w drugim.
- Lektor: `lektor.mp3` w katalogu filmu i prop `lektor: 'lektor.mp3'` (w Studio albo w `Root.tsx`).

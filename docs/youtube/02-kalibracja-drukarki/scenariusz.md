# Film 02 — Kalibracja drukarki Zebra

**Źródło:** Twój scenariusz pod lektora AI + wpis [Kalibracja drukarki Zebra - kompletny poradnik krok po kroku](https://www.serwis-zebry.pl/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku)
**Format:** 16:9, ok. 4:40 (598 słów lektora + 12 s ekranu końcowego)
**Plansze:** `plansze/q01.png` … `plansze/q14.png` (4K) · źródło: `plansze/plansze.html`
**Dane do Remotion:** `sceny.json` · **Napisy:** `napisy-pl.srt`
**Zdjęcia urządzeń:** prawdziwe zdjęcia ze sklepu (`public/sklep_photo/urzadzenia/`): ZD421t, ZD220d, ZT411, ZT610. GK420 nie ma w sklepie, plansza q04 pokazuje ZD220 z dopiskiem modeli.

## Poprawki względem Twojego scenariusza

Sprawdziłem każdą procedurę z treścią strony (wpis o kalibracji, instrukcje PL modeli, cennik, regulamin). Zmienione:

1. **ZT610 i ZT620:** ścieżka `Menu › Print › Sensors › Manual Calibration` dotyczy tylko wersji z ekranem dotykowym. Instrukcje ZT610/ZT620 na stronie opisują `TOOLS › MEDIA/RIBBON CAL` albo PAUSE + CANCEL. Lektor mówi teraz o obu wersjach.
2. **Usunięte „PAUSE + FEED + CANCEL” dla ZT411/ZT421.** Jest tylko w jednym zdaniu wpisu na blogu. Instrukcje ZT411/ZT421 na stronie tego nie mają, a ta sama kombinacja jest w nich podana dla ZD421 i ZD621.
3. **„Odpowiada komendzie ~JC”:** nic na stronie nie potwierdza, że Calibrate Media w Zebra Setup Utilities wysyła akurat ~JC. Na planszy ~JC zostało jako osobna informacja (komenda kalibracji ZPL), lektor tego nie łączy.
4. **„Darmowa wycena”** → „wycena przed rozpoczęciem prac”. Diagnostyka jest bezpłatna tylko przy zleceniu naprawy (przy rezygnacji 99 zł netto, wg cennika i regulaminu). Kurier bezpłatny przy zgłoszeniu przez formularz online.
5. **„Włączenie z FEED uruchamia wgrywanie firmware”** → „tryb serwisowy”. W GK420 wpis podaje „firmware albo diagnostykę komunikacji”, a wpis o serwisie GK420 mówi o trybie DUMP.

Dodane z wpisu na blogu: „Nowa rolka takich samych etykiet kalibracji nie wymaga” (q02) i „Wyłącz drukarkę” przed czyszczeniem czujnika (q10).

## Scenariusz

Czasy szacunkowe (2,3 słowa/s). Po wygenerowaniu lektora zastąpią je długości nagrań scen.

| Czas | Plansza | Lektor |
|---|---|---|
| 0:00–0:25 | **q01** | Drukarka etykiet Zebra wypluwa puste etykiety, przesuwa wydruk albo mruga czerwoną diodą? Najczęściej pomaga kalibracja czujnika etykiet. W modelach ZD411, ZD421, ZD611, ZD621, ZD420 i ZD620 przytrzymaj razem PAUSE i CANCEL przez dwie sekundy. W GK420, GX420, GC420, ZD220 i ZD230 przytrzymaj FEED i puść po dwóch mignięciach diody. Ten poradnik przygotował autoryzowany serwis Zebra, serwis-zebry.pl. |
| 0:25–0:42 | **q02** | Kalibracja uczy drukarkę rozpoznawać rodzaj etykiety, jej początek i długość. Zrób ją po zmianie rozmiaru etykiet, po założeniu rolki od innego producenta i po wymianie głowicy albo wałka dociskowego. Nowa rolka takich samych etykiet kalibracji nie wymaga. |
| 0:42–1:08 | **q03** | Zaczynamy od serii biurkowej: ZD411, ZD421, ZD611, ZD621 oraz starszych ZD420 i ZD620. Załaduj etykiety, a w modelach termotransferowych także taśmę. Zamknij pokrywę i poczekaj, aż dioda STATUS zaświeci na zielono. Przytrzymaj razem PAUSE i CANCEL przez dwie sekundy i puść. Drukarka wysunie kilka etykiet i zapisze ustawienia. Naciśnij raz FEED. Jeśli wyjdzie dokładnie jedna etykieta, kalibracja się udała. |
| 1:08–1:23 | **q04** | W GK420d, GK420t, GX420, GC420 oraz ZD220 i ZD230 kalibrację robisz samym przyciskiem FEED, przy włączonej drukarce. Przytrzymaj FEED. Po pierwszym mignięciu drukarka wydrukuje konfigurację, więc trzymaj dalej. Po drugim mignięciu od razu puść. |
| 1:23–1:46 | **q05** | Nie trzymaj przycisku za długo. W ZD220 i ZD230 trzy mignięcia, a w GK420 cztery mignięcia przywracają ustawienia fabryczne. Nie włączaj też drukarki z wciśniętym FEED, bo uruchomisz tryb serwisowy, a nie kalibrację. Przy etykietach z nadrukiem wstępnym w GK420 puść FEED po siedmiu mignięciach. Drukarka zrobi wtedy pełną kalibrację ręczną. |
| 1:46–2:11 | **q06** | Drukarki przemysłowe ZT411 i ZT421 mają ekran dotykowy. Wybierz Menu, potem Print, Sensors i Manual Calibration, a następnie dotknij Start Calibration. Postępuj według komunikatów na ekranie i na końcu naciśnij PAUSE. Tak samo zrobisz to w ZT610 i ZT620 z ekranem dotykowym. W wersjach bez ekranu dotykowego wybierz w menu TOOLS, a potem MEDIA RIBBON CAL. |
| 2:11–2:38 | **q07** | W starszych modelach ZT220, ZT230, ZT410, ZT420 i ZT510 przy gotowej drukarce przytrzymaj PAUSE i CANCEL przez dwie sekundy. Otwórz głowicę i zdejmij etykiety z około dwudziestu centymetrów rolki, tak żeby między czujnikami został sam podkład. Wyjmij taśmę, zamknij głowicę i naciśnij PAUSE. Gdy drukarka zmierzy podkład, otwórz głowicę, wsuń etykietę pod czujnik, załóż taśmę, zamknij głowicę i znowu naciśnij PAUSE. |
| 2:38–2:46 | **q08** | Drukarka po kalibracji dalej wypluwa puste etykiety albo mruga na czerwono z błędem Media Out? Sprawdź cztery rzeczy. |
| 2:46–3:14 | **q09** | Pierwsza: rodzaj czujnika i jego położenie. Etykiety z przerwą czyta czujnik przerwy, czyli transmisyjny. Etykiety z czarnym paskiem na spodzie wymagają czujnika czarnego znacznika. Przy wąskich etykietach albo znaczniku poza środkiem przesuń ruchomy czujnik tak, żeby trafiał w przerwę lub znacznik. Ruchomy czujnik mają drukarki serii ZD oraz ZT411, ZT421, ZT510 i ZT610. W ZT220, ZT230, ZT410 i ZT420 czujnik jest stały. |
| 3:14–3:27 | **q10** | Druga: brud. Pył z etykiet i klej zasłaniają czujnik. Wyłącz drukarkę i przedmuchaj czujnik sprężonym powietrzem. Przy mocnym zabrudzeniu przetrzyj go delikatnie wacikiem z alkoholem izopropylowym dziewięćdziesiąt dziewięć procent. |
| 3:27–3:44 | **q11** | Trzecia: nietypowe albo przezroczyste etykiety. Użyj darmowego programu Zebra Setup Utilities. Wybierz drukarkę, kliknij Open Printer Tools, wejdź w zakładkę Action, wybierz Calibrate Media i kliknij Send. W zakładce Printing ustawisz ręcznie rodzaj nośnika i długość etykiety. |
| 3:44–3:57 | **q12** | Czwarta: kalibracja przechodzi, a wydruk dalej ucieka. Sprawdź marginesy w sterowniku, czyli Label Top i Left Position, oraz wałek dociskowy. Zużyty albo brudny wałek sprawia, że etykieta się ślizga. |
| 3:57–4:17 | **q13** | Kiedy przestać resetować? Jeśli po wyczyszczeniu czujnika i próbie z inną, sprawdzoną rolką dioda dalej mruga na czerwono, a drukarka nie widzi etykiet, uszkodzony jest najpewniej czujnik, płyta główna albo oprogramowanie. Wymiana czujnika kosztuje orientacyjnie od stu pięćdziesięciu do pięciuset pięćdziesięciu złotych, zależnie od modelu. |
| 4:17–4:40 | **q14** | Naprawę zgłosisz na serwis-zebry.pl. Kurier odbierze drukarkę bezpłatnie, a wycenę dostaniesz przed rozpoczęciem prac. Pełną tabelę kalibracji wszystkich modeli znajdziesz w linku w opisie. |

## Co dograć (opcjonalnie)

Film działa na samych planszach. Prawdziwe ujęcia podniosą wiarygodność:

- ZD421: palce na PAUSE + CANCEL, wysuwające się etykiety, FEED → jedna etykieta (q03).
- ZD220 albo GK420: trzymanie FEED z widocznym miganiem diody (q04).
- ZT411: dotykanie kolejnych pozycji menu (q06).
- Przesuwanie ruchomego czujnika i czyszczenie sprężonym powietrzem (q09, q10).

## YouTube

**Tytuł (polecam Twoją propozycję 2, pod objawy i odpowiedzi AI):**
Jak skalibrować drukarkę Zebra? Puste etykiety, przesunięty wydruk, czerwona dioda

**Opis:**

```
Kalibracja drukarki Zebra: w ZD411, ZD421, ZD611, ZD621, ZD420 i ZD620 przytrzymaj PAUSE + CANCEL przez 2 s. W GK420, GX420, GC420, ZD220 i ZD230 przytrzymaj FEED i puść po 2 mignięciach. W ZT411 i ZT421: Menu › Print › Sensors › Manual Calibration.

📄 Pełna tabela kalibracji wszystkich modeli i komendy ZPL:
https://www.serwis-zebry.pl/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku

0:00 Szybka odpowiedź: przyciski kalibracji
0:25 Kiedy kalibrować
0:42 ZD411, ZD421, ZD611, ZD621, ZD420, ZD620
1:08 GK420, GX420, GC420, ZD220, ZD230
1:23 Uwaga: nie trzymaj FEED do resetu
1:46 ZT411, ZT421, ZT610, ZT620
2:11 ZT220, ZT230, ZT410, ZT420, ZT510
2:38 Kalibracja nie pomogła: 4 przyczyny
3:57 Kiedy to usterka sprzętowa

Drukarka dalej nie widzi etykiet? Jesteśmy autoryzowanym serwisem Zebra (TAKMA, Wrocław).
🔧 Zgłoszenie naprawy: https://www.serwis-zebry.pl/formularz
📞 +48 601 619 898

#Zebra #DrukarkaEtykiet #ZD421
```

**Tagi:** kalibracja drukarki zebra, zebra zd421 kalibracja, gk420d kalibracja, zd220 kalibracja, zt411 kalibracja, zebra puste etykiety, zebra media out, zebra czerwona dioda, smartcal zebra, czujnik etykiet zebra, zebra setup utilities kalibracja

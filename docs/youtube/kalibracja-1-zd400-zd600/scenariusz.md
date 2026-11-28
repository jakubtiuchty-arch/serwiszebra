# Kalibracja 1/5 — seria ZD400 / ZD600 (ZD411, ZD421, ZD611, ZD621, ZD420, ZD620)

**Źródło:** Twój scenariusz + wpis [Kalibracja drukarki Zebra](https://www.serwis-zebry.pl/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku), sekcja „Seria ZD”, i instrukcja PL ZD621
**Format:** 16:9, ok. 2:03 (245 słów lektora + 12 s ekranu końcowego)
**Plansze:** `plansze/r01.png` … `r07.png` (4K) · źródło: `plansze/plansze.html` · **Remotion:** `sceny.json` · **Napisy:** `napisy-pl.srt`
**Zdjęcia:** ZD421t, ZD421t otwarta (pomarańczowy suwak czujnika), ZD621t z ekranem dotykowym i prawdziwe zbliżenie panelu ZD621 (ten sam układ przycisków co ZD421) z zaznaczonymi PAUSE, CANCEL i STATUS.

## Sprawdzone z treścią strony

Wszystkie kroki zgadzają się z wpisem o kalibracji (sekcja „Seria ZD”) i instrukcją ZD621: PAUSE + CANCEL 2 s, koniec przy zielonej diodzie STATUS, test FEED, wskazówka o tej samej rolce, ścieżka Menu › Print › Sensors › Manual Calibration, czujnik na środku dla etykiet z przerwą.

Zmienione względem Twojego tekstu:
1. **„Darmowa wycena”** → „wycenę dostaniesz przed naprawą” (lektor, plansza i opis). Diagnostyka jest bezpłatna tylko przy zleceniu naprawy, przy rezygnacji 99 zł netto.
2. **„Kliknij w film diagnostyczny na ekranie”** → „obejrzyj nasz film o tym, co zrobić, gdy kalibracja nie działa”. Film 5 jeszcze nie istnieje. Po jego publikacji podepniesz go jako element ekranu końcowego (lewa połowa planszy r07 jest na to pusta), a lektor dalej pasuje.
3. **Opis:** „Zebra Premier Partner, Printer Repair Specialist” → „Zebra Premier Partner Repair Specialist”, tak jak w opisie firmy na stronie.

## Scenariusz

| Czas | Plansza | Lektor |
|---|---|---|
| 0:00–0:12 | **r01** | Twoja drukarka Zebra ZD421, ZD411, ZD621 albo starsza ZD420 wypluwa puste etykiety lub przesuwa wydruk? Autoryzowany serwis serwis-zebry.pl pokazuje, jak uruchomić kalibrację SmartCal w dziesięć sekund. |
| 0:12–0:22 | **r02** | Załaduj etykiety, a w modelach termotransferowych także taśmę barwiącą. Zamknij pokrywę i poczekaj, aż dioda STATUS zaświeci na stałe na zielono. |
| 0:22–0:36 | **r03** | Następnie przytrzymaj jednocześnie przyciski PAUSE i CANCEL przez dwie sekundy i puść. Drukarka wysunie kilka etykiet, zmierzy ich długość i sama dopasuje czujnik. Kalibracja kończy się, gdy dioda STATUS znów świeci na zielono. |
| 0:36–0:57 | **r04** | Aby sprawdzić wynik, naciśnij raz przycisk FEED. Jeśli wysunie się dokładnie jedna etykieta, drukarka jest gotowa do pracy. Wskazówka: po założeniu rolki dokładnie takich samych etykiet, od tego samego producenta i w tym samym rozmiarze, kalibracja nie jest potrzebna. Wystarczy raz lub dwa razy nacisnąć FEED. |
| 0:57–1:09 | **r05** | Modele z ekranem dotykowym, jak Zebra ZD621, mają też kreator kalibracji ręcznej. Wejdź w Menu, potem Print, Sensors i Manual Calibration, i postępuj według poleceń na ekranie. |
| 1:09–1:27 | **r06** | Pamiętaj też o ruchomym czujniku etykiet, który ma cała seria ZD. Przy standardowych etykietach z przerwą czujnik zostaje na środku. Jeśli używasz etykiet z czarnym znacznikiem albo z nacięciem poza środkiem, przesuń czujnik dokładnie pod znacznik i powtórz kalibrację. |
| 1:27–2:03 | **r07** | Jeśli mimo kalibracji dioda dalej mruga na czerwono albo wysuwają się puste etykiety, obejrzyj nasz film o tym, co zrobić, gdy kalibracja nie działa. Pokazujemy w nim czyszczenie czujnika i kalibrację przez Zebra Setup Utilities. A jeśli podejrzewasz uszkodzony czujnik, zgłoś naprawę na serwis-zebry.pl. Kurier odbierze drukarkę bezpłatnie, a wycenę dostaniesz przed naprawą. |

## YouTube

**Tytuł (polecam Twój nr 2 — objaw + model + przyciski, pod pytania do AI):**
Zebra ZD421 wypluwa puste etykiety? Kalibracja przyciskami PAUSE + CANCEL

**Opis:**

```
Aby skalibrować drukarkę Zebra ZD411, ZD421, ZD611, ZD621, ZD420 lub ZD620, przy włączonym urządzeniu (zielona dioda STATUS) przytrzymaj jednocześnie przyciski PAUSE i CANCEL przez 2 sekundy i puść. Drukarka wysunie kilka etykiet i sama zmierzy nośnik.

📖 Pełny poradnik z tabelą wszystkich modeli i komendami ZPL:
https://www.serwis-zebry.pl/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku

🔧 Kalibracja nie pomaga lub mruga czerwona dioda? Zgłoś naprawę w autoryzowanym serwisie Zebra (bezpłatny odbiór kurierem, wycena przed naprawą):
https://www.serwis-zebry.pl

⏱️ Rozdziały:
0:00 Kalibracja serii Zebra ZD400 i ZD600 – kiedy wykonać
0:12 Auto-kalibracja SmartCal (PAUSE + CANCEL przez 2 sekundy)
0:57 Kalibracja ręczna ZD621 (ekran dotykowy) i ustawienie ruchomego sensora
1:27 Co zrobić, gdy kalibracja nie działa – serwis Zebra

🖨️ Obsługiwane modele: Zebra ZD411, ZD421, ZD611, ZD621, ZD420, ZD620 (wersje termiczne d i termotransferowe t).
Autoryzowany serwis Zebra (Zebra Premier Partner Repair Specialist).
```

Rozdziały mają czasy z szacunku. Po nagraniu lektora przeliczę je z prawdziwych długości.

**Tagi:** kalibracja zebra zd421, zd421 puste etykiety, zebra smartcal, zd411 kalibracja, zd621 kalibracja, zd420 kalibracja, zebra pause cancel, zebra czerwona dioda, czujnik etykiet zebra, kalibracja drukarki zebra

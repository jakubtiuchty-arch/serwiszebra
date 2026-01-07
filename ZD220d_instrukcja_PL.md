# Instrukcja obsługi drukarki Zebra ZD220d

**Drukarka termiczna bezpośrednia (Direct Thermal) – seria ekonomiczna**

---

## 1. Podstawowe informacje

### O drukarce ZD220d

Zebra ZD220d to kompaktowa, ekonomiczna drukarka etykiet z serii ZD200. Wykorzystuje technologię druku termicznego bezpośredniego – **nie wymaga taśmy barwiącej (ribbonu)**. Drukarka przeznaczona jest do podstawowych zastosowań etykietowania.

### Parametry techniczne

| Parametr | Wartość |
|----------|---------|
| Technologia druku | Termiczny bezpośredni |
| Rozdzielczość | 203 dpi |
| Prędkość druku | do 152 mm/s (6 cali/s) |
| Szerokość druku | do 104 mm (4 cale) |
| Maks. średnica rolki | 127 mm (5 cali) |
| Średnica wewnętrzna gilzy | 12,7 mm / 25,4 mm |
| Pamięć wewnętrzna | min. 50 MB |

### Złącza

- USB 2.0 (standard)

### Cechy charakterystyczne

- Konstrukcja OpenAccess – łatwe ładowanie materiałów
- Prosty interfejs – jeden przycisk FEED i wskaźnik LED
- Kompatybilność z językami ZPL i EPL
- Obsługa czcionek Unicode i TrueType

---

## 2. Rozpakowanie i instalacja

### Zawartość opakowania

- Drukarka ZD220d
- Zasilacz sieciowy z kablem
- Kabel USB
- Skrócona instrukcja obsługi

### Wybór lokalizacji

- Umieść drukarkę na płaskiej, stabilnej powierzchni
- Zapewnij dostęp do gniazdka elektrycznego
- Zostaw miejsce na otwieranie pokrywy
- Unikaj bezpośredniego światła słonecznego i źródeł ciepła
- Zalecana temperatura pracy: 5°C – 41°C

### Podłączenie zasilania

1. Podłącz zasilacz do gniazda DC z tyłu drukarki
2. Podłącz kabel zasilający do zasilacza
3. Podłącz kabel do gniazdka elektrycznego
4. Zielona dioda na zasilaczu oznacza prawidłowe podłączenie

---

## 3. Ładowanie materiałów eksploatacyjnych

### Obsługiwane typy materiałów

- **Etykiety z przerwą (gap)** – etykiety samoprzylepne na podkładzie
- **Etykiety z czarnym znacznikiem (black mark)** – znacznik z tyłu materiału
- **Materiał ciągły** – do druku paragonów i rachunków

> **Ważne:** Drukarka ZD220d wymaga materiałów termoczułych (direct thermal). Sprawdź czy materiał reaguje na ciepło – przesuń paznokciem po powierzchni. Jeśli pojawi się ciemny ślad, materiał jest odpowiedni.

### Procedura ładowania etykiet

1. **Otwórz drukarkę** – pociągnij zatrzaski zwalniające ku przodowi i unieś pokrywę

2. **Rozsuń prowadnice rolki** – chwyć prowadnice i rozsuń je na boki

3. **Włóż rolkę etykiet** – umieść rolkę między prowadnicami tak, aby etykiety wychodziły spodem rolki. Strona do zadruku musi być skierowana w górę

4. **Przeprowadź materiał** – przeciągnij etykiety pod prowadnicami materiału, nad wałkiem napędowym

5. **Ustaw czujnik ruchomy** (w zależności od typu materiału):
   - Dla etykiet z przerwą (gap): czujnik w pozycji środkowej
   - Dla etykiet z czarnym znacznikiem: przesuń czujnik nad znacznik na spodzie materiału

6. **Zamknij pokrywę** – dociśnij pokrywę aż do usłyszenia kliknięcia zatrzasków

---

## 4. Podstawowa obsługa i kalibracja

### Panel sterowania

Drukarka posiada minimalistyczny interfejs:

| Element | Funkcja |
|---------|---------|
| **Przycisk POWER** | Włączanie/wyłączanie drukarki |
| **Przycisk FEED** | Wysuw etykiety / funkcje specjalne |
| **Wskaźnik STATUS** | Informacja o stanie drukarki (LED trójkolorowy) |

### Wskaźnik STATUS – znaczenie kolorów

| Kolor | Stan | Znaczenie |
|-------|------|-----------|
| Zielony | Świeci | Drukarka gotowa |
| Zielony | Mruga | Komunikacja / przetwarzanie danych |
| Zielony | Podwójne mrugnięcie | Drukarka w trybie PAUSE |
| Czerwony | Mruga | Brak materiału / otwarta pokrywa / błąd |
| Pomarańczowy | Mruga | Przegrzanie – drukarka się chłodzi |
| Czerwony-Czerwony-Zielony | Mruga | Krytyczny błąd – wymagana interwencja |

### Włączanie drukarki

1. Upewnij się, że materiał jest załadowany
2. Naciśnij przycisk **POWER** (krótko, poniżej 2 sekund)
3. Wskaźnik STATUS zaświeci na pomarańczowo podczas uruchamiania
4. Po chwili wskaźnik zmieni się na zielony – drukarka gotowa

### Wyłączanie drukarki

Naciśnij i przytrzymaj przycisk **POWER** przez 4-9 sekund.

### Kalibracja SmartCal (automatyczna)

Po załadowaniu nowego typu materiału wykonaj kalibrację:

1. Upewnij się, że drukarka jest włączona i gotowa (STATUS = zielony)
2. Naciśnij i przytrzymaj przycisk **FEED** przez 2 sekundy
3. Wskaźnik STATUS mrugnięcie raz – kontynuuj trzymanie
4. Poczekaj na drugie i trzecie mrugnięcie, potem natychmiast zwolnij przycisk
5. Drukarka wysunie kilka etykiet i wykona kalibrację
6. Po zakończeniu wskaźnik STATUS zaświeci na zielono

### Druk testowy (raport konfiguracji)

1. Drukarka musi być włączona i gotowa (STATUS = zielony)
2. Naciśnij i przytrzymaj **FEED** przez około 2 sekundy
3. Gdy wskaźnik STATUS mrugnięcie raz – natychmiast zwolnij przycisk
4. Drukarka wydrukuje raport konfiguracji

---

## 5. Podłączenie do komputera

### Wymagane sterowniki

Przed podłączeniem drukarki zainstaluj sterowniki **Zebra Setup Utilities** ze strony: [zebra.com/setup](https://zebra.com/setup)

### Połączenie USB

1. **Najpierw** zainstaluj sterowniki Zebra Setup Utilities na komputerze
2. Podłącz kabel USB do drukarki (drukarka wyłączona)
3. Podłącz kabel USB do komputera
4. Uruchom Zebra Setup Utilities
5. Włącz drukarkę gdy kreator instalacji o to poprosi
6. Postępuj zgodnie z instrukcjami na ekranie

> **Ważne:** Jeśli podłączyłeś drukarkę przed instalacją sterowników, odłącz kabel USB, zainstaluj sterowniki, a następnie podłącz ponownie.

---

## 6. Konserwacja i czyszczenie

### Harmonogram czyszczenia

| Element | Częstotliwość |
|---------|---------------|
| Głowica drukująca | Co 5 rolek materiału |
| Ścieżka materiału | W razie potrzeby |
| Czujniki | W razie problemów z detekcją |
| Wałek napędowy | W razie potrzeby |

### Potrzebne materiały

- Pisak czyszczący Zebra lub patyczki nasączone alkoholem izopropylowym (90%)
- Bezpyłowe ściereczki
- Sprężone powietrze (w puszce)

> **Uwaga:** Nie używaj sprężarki powietrza – może wprowadzić zanieczyszczenia do drukarki.

### Czyszczenie głowicy drukującej

> **Ostrzeżenie:** Głowica może być gorąca! Poczekaj aż ostygnie przed czyszczeniem.

1. Wyłącz drukarkę i otwórz pokrywę
2. Wyjmij materiał
3. Przetrzyj ciemny pasek głowicy pisakiem czyszczącym lub wacikiem nasączonym alkoholem
4. Czyść od środka ku zewnętrznym krawędziom
5. Poczekaj około 1 minuty aż alkohol wyschnie
6. Załaduj materiał i zamknij pokrywę

### Czyszczenie czujników

1. Wyłącz drukarkę i otwórz pokrywę
2. Zlokalizuj ruchomy czujnik (pod ścieżką materiału)
3. **Nie czyść okienka czujnika** – czyść tylko kanał, w którym się przesuwa
4. Delikatnie przedmuchaj sprężonym powietrzem
5. Poczekaj aż wyschnie

### Czyszczenie wałka napędowego

1. Obróć wałek ręcznie i przetrzyj go ściereczką nasączoną alkoholem
2. Nie używaj ostrych przedmiotów
3. W razie uszkodzenia – wymień wałek

---

## 7. Rozwiązywanie problemów

### Wskaźnik STATUS mruga na czerwono

| Problem | Rozwiązanie |
|---------|-------------|
| Otwarta pokrywa | Zamknij pokrywę – dociśnij aż zatrzaśnie |
| Brak materiału | Załaduj nową rolkę etykiet |
| Błąd czujnika | Sprawdź pozycję czujnika, wykonaj kalibrację SmartCal |

### Brak wydruku na etykiecie

- Sprawdź czy materiał jest termoczuły (direct thermal)
- Sprawdź czy materiał jest załadowany stroną do druku w górę
- Zwiększ ciemność druku w ustawieniach
- Wyczyść głowicę drukującą

### Zniekształcony wydruk lub przesunięta pozycja

- Wykonaj kalibrację SmartCal
- Sprawdź ustawienie czujnika materiału
- Sprawdź czy prowadnice są prawidłowo ustawione
- Wyczyść czujniki

### Drukarka nie reaguje na polecenia

1. Sprawdź połączenie kablowe USB
2. Sprawdź czy wskaźnik STATUS jest zielony
3. Zrestartuj drukarkę (wyłącz na 10 sekund i włącz ponownie)
4. Sprawdź kolejkę druku w systemie Windows

### Etykiety nie są wykrywane (ciągły wysuw)

- Sprawdź typ materiału w ustawieniach drukarki
- Ustaw czujnik w odpowiedniej pozycji dla typu materiału
- Wykonaj kalibrację SmartCal
- Wyczyść czujniki

### Wskaźnik mruga na pomarańczowo

Drukarka jest przegrzana – poczekaj aż ostygnie. Upewnij się, że wokół drukarki jest odpowiednia wentylacja.

### Zacięcie materiału

1. Wyłącz drukarkę
2. Otwórz pokrywę
3. Delikatnie usuń zacięty materiał
4. Sprawdź czy nic nie pozostało w ścieżce materiału
5. Załaduj materiał ponownie

---

## Dane kontaktowe serwisu

**Autoryzowany serwis Zebra w Polsce**

serwis-zebra.pl

---

*Dokument opracowany na podstawie oficjalnej dokumentacji Zebra Technologies.*  
*Wersja: 1.0 | Data: Styczeń 2025*

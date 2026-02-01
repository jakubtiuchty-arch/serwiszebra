# Instrukcja Serwisowa Drukarki

## Direct Thermal G-Series™
### Biurkowa Drukarka Termiczna

---

**Numer dokumentu:** 980617-001 Rev. 1  
**Data:** 28/08/2008

---

## Informacje prawne

©2008 ZIH Corp. Prawa autorskie do niniejszej instrukcji oraz oprogramowania i/lub firmware'u drukarki etykiet należą do ZIH Corp. Nieautoryzowane powielanie tej instrukcji lub oprogramowania i/lub firmware'u drukarki etykiet może skutkować karą pozbawienia wolności do jednego roku oraz grzywną do 10 000 USD (17 U.S.C.506). Naruszający prawa autorskie mogą ponosić odpowiedzialność cywilną. Wszystkie znaki towarowe i zastrzeżone znaki towarowe są własnością ich odpowiednich właścicieli. Wszelkie prawa zastrzeżone.

Ten produkt może zawierać programy ZPL®, ZPL II® i ZebraLink™; układ Element Energy Equalizer™; E3®; oraz czcionki Monotype Imaging. Oprogramowanie ©ZIH corp. Wszelkie prawa zastrzeżone na całym świecie.

### Oświadczenie o zgodności z FCC

To urządzenie jest zgodne z zasadami Części 15. Działanie podlega następującym dwóm warunkom:
1. To urządzenie nie może powodować szkodliwych zakłóceń, oraz
2. To urządzenie musi akceptować wszelkie odbierane zakłócenia, w tym zakłócenia mogące powodować niepożądane działanie.

### Drukarki G-Series - Ostrzeżenie laserowe

> ⚠️ **UWAGA: PRODUKT LASEROWY KLASY 1M**
> 
> - Oglądanie wyjścia lasera za pomocą niektórych przyrządów optycznych (np. lup, szkieł powiększających i mikroskopów) w odległości 100 mm może stanowić zagrożenie dla oczu.
> - Użycie elementów sterujących lub regulacji, lub wykonywanie procedur innych niż określone w niniejszym dokumencie, może skutkować narażeniem na niebezpieczne promieniowanie.
> - Nie manipulować ani nie próbować naprawiać żadnego czujnika wewnątrz tego produktu. Wewnątrz nie ma czujników nadających się do serwisowania.
> - Nie patrzeć w czujniki szczeliny (Web) lub dyspensera (Peel). Unikać możliwego narażenia na niebezpieczne promieniowanie laserowe.

### Zarządzanie środowiskowe

♻️ Nie wyrzucać tego produktu wraz z niesortowanymi odpadami komunalnymi. Produkt nadaje się do recyklingu i powinien być poddany recyklingowi zgodnie z lokalnymi standardami.

Więcej informacji: www.zebra.com/environment

---

## Kontakt

### Adresy pocztowe

**Zebra Technologies Corporation**  
333 Corporate Woods Parkway  
Vernon Hills, Illinois 60061.3109 USA  
Telefon: +1 847.634.6700  
Faks: +1 847.913.8766

**Zebra Technologies Europe Limited**  
Dukes Meadow  
Millboard Road  
Bourne End  
Buckinghamshire SL8 5XF, UK  
Telefon: +44 (0)1628 556000  
Faks: +44 (0)1628 556001

### Wsparcie techniczne

Strona: www.zebra.com/SS/service_support.htm

Numer telefonu USA: +1 847.913.2259  
Numer telefonu UK/Międzynarodowy: +44 (0)1628 556000

### Powiązane dokumenty

- Podręcznik użytkownika GX420d
- Podręcznik użytkownika GK420d
- Przewodnik programowania ZPL II®
- Przewodnik programisty EPL®

---

## Spis treści

1. [Wprowadzenie](#1-wprowadzenie)
2. [Konserwacja](#2-konserwacja)
3. [Rozwiązywanie problemów](#3-rozwiązywanie-problemów)
4. [Wymagane narzędzia](#4-wymagane-narzędzia)
5. [Wymiana części](#5-wymiana-części)
6. [Prowadzenie kabli](#6-prowadzenie-kabli)

---

## 1. Wprowadzenie

Jeśli jesteś inżynierem terenowym lub technikiem, ta instrukcja pomoże Ci w rutynowej konserwacji, rozwiązywaniu problemów i procedurach wymiany części do naprawy.

Postępuj zgodnie z procedurami wymiany części tak dokładnie, jak to możliwe. Jeśli nie jesteś pewien jakiejkolwiek procedury, skontaktuj się z przedstawicielem serwisu lub zadzwoń do grupy wsparcia technicznego produktów w Zebra Technologies Corporation.

Zebra Technologies posiada wszystkie części zamienne do drukarki. Upewnij się, że Twoja placówka posiada wystarczającą ilość części do drukarki, aby planowana konserwacja mogła odbywać się terminowo.

### Modele

Istnieje kilka modeli drukarki, z których każdy wygląda podobnie, ale ma różne moduły zasilania i firmware:

- **Drukarki GX** mają zasilacze 100 watów
- **Drukarki GK** mają zasilacze 70 watów
- Zasilacz 100 W drukarki GX w pełni obsługuje oba modele, ale zasilacz 70 W drukarki GK może powodować zacięcia lub słaby druk, jeśli jest używany w drukarkach GX

### Pakowanie

Drukarki są wysyłane w kartonach i zawinięte w worek ochronny. Zachowaj wszystkie materiały opakowaniowe na wypadek konieczności ponownej wysyłki drukarki lub przechowywania jej przez dłuższy czas.

### Przygotowanie obszaru roboczego bezpiecznego elektrostatycznie

Przygotuj obszar roboczy bezpieczny elektrostatycznie przed otwarciem drukarki do naprawy. Obszar musi zawierać odpowiednio uziemioną przewodzącą matę amortyzującą do trzymania drukarki oraz przewodzącą opaskę na nadgarstek dla technika. Urządzenia ochronne ESD są dostępne w większości sklepów z elektroniką lub kontaktując się z korporacją 3M pod numerem (800) 328-1368.

### Ochrona środowiskowa i przed wstrząsami

Ekstremalne wahania temperatury i wilgotności lub niewłaściwe obchodzenie się mogą uszkodzić drukarkę i zasilacz.

**Poczekaj 30 minut lub więcej** przed otwarciem plastikowej torby drukarki. Ten czas pozwala drukarce ustabilizować temperaturę, szczególnie po przechowywaniu w chłodnym, suchym miejscu, a następnie umieszczeniu w cieplejszym, bardziej wilgotnym miejscu. Ciepłe, wilgotne powietrze kondensuje się na chłodnych komponentach drukarki i ta kondensacja może uszkodzić komponenty.

**Przenoś drukarkę ostrożnie.** Uszkodzenia mechaniczne mogą z pewnością wynikać z upadków lub nieostrożnego obchodzenia się.

---

## 2. Konserwacja

Ta sekcja zawiera procedury rutynowego czyszczenia i konserwacji.

### Materiały czyszczące

Podczas czyszczenia drukarki użyj jednego z następujących materiałów, który najlepiej odpowiada Twoim potrzebom:

| Materiały czyszczące | Ilość zamówienia | Przeznaczenie |
|---------------------|------------------|---------------|
| Pisaki czyszczące (105950-035) | Zestaw 12 szt. | Czyszczenie głowicy drukującej |
| Waciki czyszczące (105909-057) | Zestaw 25 szt. | Czyszczenie ścieżki mediów, prowadnic i czujników |

Materiały czyszczące można zakupić na stronie www.zipzebra.com.

### Harmonogram czyszczenia

| Część drukarki | Metoda | Częstotliwość |
|----------------|--------|---------------|
| Głowica drukująca | Pozwól głowicy ostygnąć przez minutę, następnie użyj nowego pisaka czyszczącego do przetarcia ciemnej linii na głowicy, czyszcząc od środka do zewnętrznych krawędzi | Po każdej rolce mediów |
| Wałek dociskowy | Wyjmij wałek dociskowy do czyszczenia. Dokładnie oczyść wałek 90% alkoholem medycznym i wacikiem czyszczącym lub szmatką bez włókien | W razie potrzeby |
| Listwa odrywająca | Dokładnie oczyść 90% alkoholem medycznym i wacikiem czyszczącym bez włókien. Pozwól alkoholowi wyparować i drukarce całkowicie wyschnąć | W razie potrzeby |
| Ścieżka mediów | Jak wyżej | W razie potrzeby |
| Zewnętrzna część | Szmatka zwilżona wodą | W razie potrzeby |
| Wewnętrzna część | Delikatnie wyszczotkuj drukarkę | W razie potrzeby |

> ⚠️ **UWAGA:** Kleje i materiał mediów mogą z czasem przenosić się na komponenty drukarki wzdłuż ścieżki mediów, w tym na wałek dociskowy i głowicę drukującą. Ta warstwa może gromadzić kurz i zanieczyszczenia. Brak czyszczenia głowicy drukującej, ścieżki mediów i wałka dociskowego może spowodować nieumyślną utratę etykiet, zacięcia etykiet i możliwe uszkodzenie drukarki.

> ℹ️ **WAŻNE:** Użycie zbyt dużej ilości alkoholu może spowodować zanieczyszczenie komponentów elektronicznych, wymagając znacznie dłuższego czasu schnięcia, zanim drukarka będzie prawidłowo działać.

### Czyszczenie głowicy drukującej

Zawsze używaj nowego pisaka czyszczącego na głowicy drukującej (stary pisak przenosi zanieczyszczenia z poprzedniego użycia, które mogą uszkodzić głowicę drukującą).

Podczas ładowania nowego medium możesz również wyczyścić głowicę drukującą.

> ⚠️ **UWAGA:** Głowica drukująca nagrzewa się podczas drukowania. Aby chronić przed uszkodzeniem głowicy drukującej i ryzykiem obrażeń ciała, unikaj dotykania głowicy drukującej. Używaj tylko pisaka czyszczącego do wykonywania konserwacji.

**Procedura:**

1. Przetrzyj pisakiem czyszczącym ciemny obszar głowicy drukującej. Czyść od środka na zewnątrz. Spowoduje to przesunięcie kleju przeniesionego z krawędzi mediów na głowicę drukującą poza ścieżkę mediów.
2. Poczekaj jedną minutę przed zamknięciem drukarki.

### Zagadnienia dotyczące ścieżki mediów

Użyj wacika czyszczącego, aby usunąć zanieczyszczenia, kurz lub skorupę nagromadzoną na uchwytach, prowadnicach i powierzchniach ścieżki mediów.

**Procedura:**

1. Użyj alkoholu w waciku czyszczącym, aby namoczyć zanieczyszczenia i rozpuścić klej.
2. Przetrzyj żebra, aby usunąć nagromadzone zanieczyszczenia.
3. Przetrzyj wewnętrzne krawędzie obu prowadnic krawędziowych, aby usunąć nagromadzone osady.
4. Poczekaj jedną minutę przed zamknięciem drukarki.

Wyrzuć wacik czyszczący po użyciu.

**Elementy do wyczyszczenia:**
- Prowadnice mediów
- Żebra
- Wałek dociskowy
- Listwa odrywająca
- Wałek dociskowy dyspensera

### Czyszczenie czujników

Kurz może gromadzić się na czujnikach mediów.

**Procedura:**

1. Delikatnie usuń kurz szczotką; w razie potrzeby użyj suchego wacika do usunięcia kurzu. Jeśli pozostają kleje lub inne zanieczyszczenia, użyj wacika zwilżonego alkoholem, aby je rozpuścić.
2. Użyj suchego wacika, aby usunąć wszelkie pozostałości po pierwszym czyszczeniu.
3. Powtórz kroki 1 i 2 w razie potrzeby, aż wszystkie osady i smugi zostaną usunięte z czujnika.

**Lokalizacja czujników:**
- Czujnik czarnej linii
- Czujnik szczeliny
- Czujnik pobrania etykiety

### Czyszczenie wałka dociskowego

Standardowy wałek dociskowy (napędowy) normalnie nie wymaga czyszczenia. Kurz papierowy i podkładowy może się gromadzić bez wpływu na operacje drukowania. Zanieczyszczenia na wałku dociskowym mogą uszkodzić głowicę drukującą lub powodować ślizganie się lub przyleganie mediów podczas drukowania. Klej, brud, ogólny kurz, oleje i inne zanieczyszczenia należy natychmiast czyścić z wałka dociskowego.

Oczyść wałek dociskowy (i ścieżkę mediów), gdy drukarka ma znacząco gorszą wydajność, jakość druku lub obsługę mediów. Wałek dociskowy jest powierzchnią drukującą i napędową dla mediów. Jeśli przyleganie lub zacięcia nadal występują nawet po czyszczeniu, musisz wymienić wałek dociskowy.

Wałek dociskowy można czyścić wacikiem bez włókien (takim jak Texpad) lub czystą, suchą szmatką bez włókien, lekko zwilżoną alkoholem medycznym (90% czystości lub lepszym).

**Procedura usunięcia:**

1. Otwórz pokrywę (i drzwi dyspensera). Usuń media z obszaru wałka dociskowego.
2. Naciśnij zatrzaski po prawej i lewej stronie na zewnątrz. Następnie obróć je do góry.
3. Wyjmij wałek dociskowy z dolnej ramy drukarki.
4. Oczyść wałek dociskowy wacikiem zwilżonym alkoholem. Czyść od środka na zewnątrz. Powtarzaj ten proces, aż cała powierzchnia wałka zostanie oczyszczona. Jeśli wystąpiło duże nagromadzenie kleju lub zacięcie etykiet, powtórz z nowym wacikiem, aby usunąć pozostałe zanieczyszczenia. Kleje i oleje mogą być rozcieńczone przez początkowe czyszczenie, ale nie całkowicie usunięte.

**Procedura instalacji:**

1. Upewnij się, że łożyska są prawidłowo umieszczone na wale wałka dociskowego.
2. Wyrównaj wałek dociskowy z przekładnią po lewej stronie i opuść go do dolnej ramy drukarki.
3. Obróć zatrzaski z powrotem i zatrzaśnij je na miejscu.

Pozwól drukarce wyschnąć przez jedną minutę przed zamknięciem drzwi dyspensera, pokrywy mediów lub załadowaniem etykiet.

### Inna konserwacja drukarki

Nie ma procedur konserwacji na poziomie użytkownika wykraczających poza te szczegółowo opisane w tej sekcji. Zobacz sekcję Rozwiązywanie problemów, aby uzyskać więcej informacji na temat diagnozowania problemów z drukarką i drukowaniem.

---

## 3. Rozwiązywanie problemów

Ta sekcja zawiera informacje o raportowaniu błędów drukarki, które mogą być potrzebne do rozwiązywania problemów z drukarką. Uwzględnione są różne testy diagnostyczne.

### Opisy lampki statusu

| Status LED | Kolor | Status drukarki | Nr rozwiązania |
|-----------|-------|-----------------|----------------|
| Wyłączona | - | Wyłączona | 1 |
| Stałe świecenie | Zielony | Włączona | 2 |
| Stałe świecenie | Bursztynowy | Zatrzymana | 3 |
| Miganie | Zielony | Normalna praca | 4 |
| Miganie | Czerwony | Zatrzymana | 5 |
| Podwójne miganie | Zielony | Wstrzymana | 6 |
| Miganie | Bursztynowy | Wstrzymana | 7 |
| Naprzemienne miganie | Zielony i czerwony | Wymaga serwisu | 8 |
| Miganie czerwone, czerwone i zielone | - | Wymaga serwisu | 9 |

### Rozwiązania błędów lampki statusu

#### 1. Drukarka nie otrzymuje zasilania

- Czy włączyłeś zasilanie drukarki?
- Sprawdź połączenia zasilania od gniazdka ściennego do zasilacza i od zasilacza do drukarki.
- Odłącz drukarkę od gniazdka ściennego na 30 sekund, a następnie ponownie podłącz drukarkę do gniazdka ściennego.

#### 2. Drukarka jest włączona i w stanie bezczynności

Nie jest wymagana żadna akcja.

#### 3. Drukarka nie przeszła autotestu po włączeniu (POST)

- Jeśli ten błąd występuje zaraz po włączeniu drukarki, skontaktuj się z autoryzowanym sprzedawcą w celu uzyskania pomocy. Gdy drukarka działa normalnie, lampka statusu drukarki będzie bursztynowa przez około 10 sekund, zanim zmieni się na zieloną (stałą lub migającą).

**Błąd pamięci:**
- Jeśli ten błąd występuje po drukowaniu, wyłącz i włącz zasilanie drukarki, a następnie wznów drukowanie.

**Głowica drukująca musi się ochłodzić:**
- Jeśli ten błąd nadal występuje, wyłącz zasilanie drukarki na pięć minut lub dłużej, a następnie włącz. Jeśli bursztynowa lampka nie ustępuje, drukarka wymaga serwisu.

#### 4. Drukarka odbiera dane

Gdy wszystkie dane zostaną odebrane, dioda statusu zmieni się na zieloną i drukarka automatycznie wznowi pracę.

#### 5. Brak mediów lub głowica drukująca jest otwarta

**Brak mediów:**
- Postępuj zgodnie z instrukcjami ładowania mediów w podręczniku użytkownika, a następnie naciśnij przycisk podawania, aby wznowić drukowanie.

**Głowica drukująca jest otwarta:**
- Zamknij górną pokrywę, a następnie naciśnij przycisk podawania, aby wznowić drukowanie.

#### 6. Drukarka jest wstrzymana

Naciśnij przycisk podawania, aby wznowić drukowanie.

#### 7. Głowica drukująca ma nadmierną temperaturę

Drukowanie zatrzyma się, aż głowica drukująca ochłodzi się do akceptowalnej temperatury drukowania. Gdy to nastąpi, drukarka automatycznie wznowi pracę.

#### 8. Pamięć FLASH nie jest zaprogramowana

Zwróć drukarkę do autoryzowanego sprzedawcy.

#### 9. Głowica drukująca lub silnik ma krytyczną awarię

Zwróć drukarkę do autoryzowanego sprzedawcy.

### Problemy z jakością druku

#### Brak wydruku na etykiecie

- Media mogą nie być mediami termicznymi bezpośrednimi. Zobacz sekcję Określanie typów mediów termicznych.
- Czy media są prawidłowo załadowane? Postępuj zgodnie z instrukcjami ładowania mediów rolkowych w podręczniku użytkownika.

#### Wydrukowany obraz nie wygląda prawidłowo

- Głowica drukująca jest brudna. Oczyść głowicę drukującą.
- Głowica drukująca ma zbyt niską temperaturę.
- Dostosuj ciemność druku i/lub prędkość drukowania:
  - Użyj poleceń ^PR (prędkość) i ~SD (ciemność) opisanych w Przewodniku programowania ZPL
  - Użyj poleceń D (ciemność/gęstość) i S (prędkość) w Przewodniku programisty EPL
  - Ręcznie dostosuj ciemność druku za pomocą sekwencji sześciu błysków w trybach przycisku podawania
  - Sterownik drukarki Windows lub oprogramowanie aplikacji może zmienić te ustawienia i może wymagać zmiany w celu optymalizacji jakości druku
- Używane media są niekompatybilne z drukarką. Upewnij się, że używasz zalecanych mediów do swojej aplikacji i zawsze używaj etykiet i przywieszek zatwierdzonych przez Zebra.
- Sprawdź, czy zasilacz drukarki ma moc wyjściową 100 W DC dla modeli drukarek GX.
- Głowica drukująca jest zużyta. Głowica drukująca jest częścią eksploatacyjną i zużywa się z powodu tarcia między mediami a głowicą drukującą. Używanie niezatwierdzonych mediów może skrócić żywotność lub uszkodzić głowicę drukującą. Wymień głowicę drukującą.
- Wałek dociskowy może wymagać czyszczenia lub wymiany. Wałek dociskowy (napędowy) może tracić przyczepność z powodu:
  - Ciał obcych przyczepionych do jego powierzchni
  - Gumowa gładka powierzchnia stała się wypolerowana i śliska
  - Uszkodzenie normalnie gładkiej i płaskiej powierzchni drukującej, np. nacięcia nożem

#### Długie ścieżki brakującego druku (puste pionowe linie) na kilku etykietach

- Głowica drukująca jest brudna. Oczyść głowicę drukującą.
- Elementy głowicy drukującej są uszkodzone. Wymień głowicę drukującą.

#### Drukowanie nie rozpoczyna się od góry etykiety lub błędne drukowanie od jednej do trzech etykiet

- Media mogą nie być prawidłowo nawleczone. Postępuj zgodnie z instrukcjami ładowania mediów rolkowych w podręczniku użytkownika.
- Drukarka wymaga kalibracji. Zapoznaj się z sekwencją dwóch błysków w trybach przycisku podawania.
- **Formaty etykiet ZPL** - Może nie być aktywowany prawidłowy czujnik mediów. Ręczna kalibracja wybiera metodę wykrywania mediów dla używanych etykiet (zapoznaj się z poleceniem ^MN w Przewodniku programowania ZPL).
- **Formaty etykiet ZPL** - Sprawdź, czy polecenie Label Top (^LT) jest prawidłowo ustawione dla Twojej aplikacji (sprawdź Przewodnik programowania ZPL).
- **Formaty etykiet EPL** - Może nie być aktywowany prawidłowy czujnik mediów do wydawania etykiet, wykrywania czarnej linii lub nacięć, lub wykrywania szczeliny/wstęgi. Ręczna kalibracja wybiera metodę wykrywania mediów dla używanych etykiet (zapoznaj się z poleceniami O i Q w Przewodniku programisty EPL).
- **Formaty etykiet EPL** - Sprawdź, czy polecenie Set Label Length (Q) jest prawidłowo ustawione dla Twojej aplikacji (sprawdź Przewodnik programisty EPL).

#### Format etykiety ZPL został wysłany, ale nie został rozpoznany przez drukarkę

- Czy drukarka jest w trybie pauzy? Jeśli tak, naciśnij przycisk podawania.
- Jeśli dioda statusu świeci lub miga, zapoznaj się z opisami lampki statusu.
- Upewnij się, że kabel danych jest prawidłowo zainstalowany.
- Wystąpił problem z komunikacją. Najpierw upewnij się, że na komputerze jest wybrany prawidłowy port komunikacyjny. Zapoznaj się z sekcją Komunikacja z drukarką w podręczniku użytkownika.
- Sprawdź prawidłowy prefiks formatu i sterowania na drukarce, czy pasują do tego, co używasz w programowanym formacie etykiety ZPL. Domyślny prefiks formatu (COMMAND CHAR) to znak daszka (^), a prefiks sterowania (CONTROL CHAR) to tylda (~). Sprawdź znaki na wydruku etykiety statusu konfiguracji. Zapoznaj się z sekwencją jednego błysku w trybach przycisku podawania, aby wydrukować tę etykietę.

#### Format etykiety EPL został wysłany, ale nie został rozpoznany przez drukarkę

- Czy drukarka jest w trybie pauzy? Jeśli tak, naciśnij przycisk podawania.
- Jeśli drukarka ma włączone wydawanie etykiet, drukarka może czekać na usunięcie etykiety. Podkład/wstęga musi być prawidłowo nawleczona przez mechanizm wydawania etykiet (peeler), aby prawidłowo działać w trybie wydawania etykiet, zapoznaj się z opcją dyspensera etykiet w podręczniku użytkownika.
- Jeśli dioda statusu świeci lub miga, zapoznaj się z opisami lampki statusu.
- Upewnij się, że kabel danych jest prawidłowo zainstalowany.
- Wystąpił problem z komunikacją. Najpierw upewnij się, że na komputerze jest wybrany prawidłowy port komunikacyjny (USB). Zapoznaj się z sekcją Komunikacja z drukarką w podręczniku użytkownika.

### Określanie konfiguracji drukarki

Drukarka używa etykiety statusu konfiguracji drukarki ZPL do raportowania statusu konfiguracji drukarki dla operacji EPL i ZPL. Etykieta w stylu ZPL zapewnia bardziej intuicyjne i funkcjonalnie opisowe konwencje nazewnictwa niż etykieta statusu drukarki w stylu EPL.

Status operacyjny (ciemność, prędkość, typ mediów itp.), zainstalowane opcje drukarki (sieć, ustawienia interfejsu, obcinarka itp.) oraz informacje opisowe drukarki (numer seryjny, nazwa modelu, wersja firmware itp.) są zawarte na etykiecie statusu.

Aby uzyskać etykietę statusu konfiguracji drukarki w stylu EPL, wyślij do drukarki polecenie EPL U. Zobacz przewodnik programisty EPL, aby uzyskać więcej informacji na temat różnych poleceń EPL U i interpretacji ustawień wyświetlanych na tych etykietach.

Etykieta statusu konfiguracji drukarki może być zlokalizowana w maksymalnie 16 językach. Użyj polecenia programowania ZPL ^KD, aby zmodyfikować wyświetlany język dla większości elementów statusu na tej etykiecie.

### Drukowanie termiczne

> ⚠️ **UWAGA:** Głowica drukująca nagrzewa się podczas drukowania. Aby chronić przed uszkodzeniem głowicy drukującej i ryzykiem obrażeń ciała, unikaj dotykania głowicy drukującej. Używaj tylko pisaka czyszczącego do wykonywania konserwacji głowicy drukującej.

> ⚠️ **UWAGA:** Wyładowanie energii elektrostatycznej, która gromadzi się na powierzchni ludzkiego ciała lub innych powierzchniach, może uszkodzić lub zniszczyć głowicę drukującą lub komponenty elektroniczne używane w tym urządzeniu. Musisz przestrzegać procedur bezpiecznych elektrostatycznie podczas pracy z głowicą drukującą lub komponentami elektronicznymi pod górną pokrywą.

### Tryby drukowania

Możesz obsługiwać tę drukarkę w wielu różnych trybach i konfiguracjach mediów:

- **Drukowanie termiczne bezpośrednie** (które wykorzystuje media wrażliwe na ciepło do drukowania)
- **Standardowy tryb odrywania** pozwala odrywać każdą etykietę (lub drukować seryjnie pasek etykiet) po wydrukowaniu
- **Tryb wydawania etykiet:** Jeśli zainstalowany jest opcjonalny dyspenzer, materiał podkładowy może być oddzielany od etykiety podczas drukowania. Po usunięciu tej etykiety drukowana jest następna.
- **Cięcie mediów:** Jeśli zainstalowana jest opcjonalna obcinarka mediów, drukarka może ciąć podkład etykiety między etykietami, papier paragonowy lub materiał przywieszek w zależności od zakupionej opcji obcinarki.
- **Autonomiczne:** Drukarka może działać w trybie autonomicznym (niepodłączona do komputera) przy użyciu funkcji automatycznego uruchamiania formatu etykiety drukarki (opartej na programowaniu) lub przy użyciu urządzenia wprowadzania danych. Ten tryb obsługuje urządzenia wprowadzania danych, takie jak skanery, wagi, Zebra KDU Plus lub KDU (Keyboard Display Unit) z adapterem KDU itp., przez port szeregowy drukarki.
- **Współdzielone drukowanie sieciowe:** Drukarki skonfigurowane z opcją interfejsu Ethernet zawierają wewnętrzny serwer druku ze stroną konfiguracyjną drukarki ZebraLink i oprogramowaniem ZebraNet Bridge do zarządzania i monitorowania statusu drukarek Zebra w sieci.

### Typy mediów do druku

Twoja drukarka może używać różnych typów mediów:

- **Media standardowe** — Większość standardowych (nieciągłych) mediów używa kleju z tyłu, który przykleja poszczególne etykiety lub ciągłą długość etykiet do podkładu.
- **Media ciągłe w rolce** — Większość mediów ciągłych w rolce to media termiczne bezpośrednie (podobne do papieru faksowego) i są używane do drukowania paragonów lub biletów.
- **Media bez podkładu** — Etykiety bez podkładu mają klej z tyłu, ale są nawinięte na rdzeń bez podkładu. Media są zazwyczaj perforowane i mogą mieć czarne znaczniki na dolnej powierzchni mediów wskazujące separacje etykiet. Górna powierzchnia etykiet bez podkładu ma specjalną powłokę, która zapobiega przyleganiu etykiet do siebie. Drukarka musi być wyposażona w specjalną opcję bez podkładu, aby móc używać mediów bez podkładu, aby zapobiec przyleganiu mediów do drukarki.
- **Materiał przywieszek** — Przywieszki są zwykle wykonane z ciężkiego papieru (do 0,0075 cala/0,19 mm grubości). Materiał przywieszek nie ma kleju ani podkładu i jest zwykle perforowany między przywieszkami.

> ℹ️ **WAŻNE:** Zebra zdecydowanie zaleca używanie materiałów eksploatacyjnych marki Zebra dla ciągłego drukowania wysokiej jakości. Szeroka gama papieru, polipropylenu, poliestru i winylu została specjalnie zaprojektowana, aby zwiększyć możliwości drukowania drukarki i zapobiec przedwczesnemu zużyciu głowicy drukującej. Aby zakupić materiały eksploatacyjne, odwiedź http://www.zebra.com/howtobuy.

#### Tabela typów mediów rolkowych i składanych

| Typ mediów | Opis |
|-----------|------|
| **Media nieciągłe w rolce** | Media rolkowe są nawinięte na rdzeń o średnicy od 1 do 3 cali (25 do 76 mm). Etykiety mają klej z tyłu, który przykleja je do podkładu, i są oddzielone szczelinami, otworami, nacięciami lub czarnymi znacznikami. Przywieszki są oddzielone perforacjami. Poszczególne etykiety są oddzielone jedną lub kilkoma z następujących metod: media ze szczelinami oddzielają etykiety szczelinami, otworami lub nacięciami; media ze znacznikami czarnymi używają wcześniej wydrukowanych czarnych znaczników na tylnej stronie mediów; media perforowane mają perforacje. |
| **Media nieciągłe składane** | Media składane są złożone w kształt zygzaka. Media składane mogą mieć te same separacje etykiet co media nieciągłe w rolce. Separacje powinny znajdować się na lub w pobliżu zgięć. |
| **Media ciągłe w rolce** | Media ciągłe w rolce nie mają szczelin, otworów, nacięć ani czarnych znaczników wskazujących separacje etykiet. Pozwala to na drukowanie obrazu w dowolnym miejscu na etykiecie. Czasami obcinarka jest używana do odcinania poszczególnych etykiet. W przypadku mediów ciągłych używaj czujnika transmisyjnego (szczeliny), aby drukarka mogła wykryć, kiedy media się skończą. |

### Określanie typów mediów termicznych

Media do transferu termicznego wymagają taśmy do drukowania, podczas gdy media termiczne bezpośrednie nie. Aby określić, czy taśma musi być używana z konkretnym medium, wykonaj test zarysowania mediów.

**Aby wykonać test zarysowania mediów:**

1. Podrap powierzchnię drukującą mediów paznokciem lub nasadką długopisu. Naciśnij mocno i szybko, przeciągając po powierzchni mediów. Media termiczne bezpośrednie są chemicznie przetworzone, aby drukować (eksponować) pod wpływem ciepła. Ta metoda testowa wykorzystuje ciepło tarcia do wyeksponowania mediów.

2. Czy na mediach pojawił się czarny ślad?

| Jeśli czarny ślad... | Wtedy media są... |
|---------------------|-------------------|
| Nie pojawia się na mediach | Termiczne transferowe. Wymagana jest taśma. |
| Pojawia się na mediach | Termiczne bezpośrednie. Taśma nie jest wymagana. |

### Wymiana materiałów eksploatacyjnych

Jeśli etykiety lub taśma skończą się podczas drukowania, pozostaw drukarkę włączoną podczas ponownego ładowania (utrata danych nastąpi, jeśli wyłączysz drukarkę). Po załadowaniu nowej rolki etykiet lub taśmy naciśnij przycisk podawania, aby wznowić.

Zawsze używaj wysokiej jakości, zatwierdzonych etykiet, przywieszek i taśm. Jeśli używane są etykiety z klejem z tyłu, które nie leżą płasko na podkładzie, odsłonięte krawędzie mogą przylegać do prowadnic etykiet i wałków wewnątrz drukarki, powodując oddzielanie się etykiety od podkładu i zacięcie drukarki. Trwałe uszkodzenie głowicy drukującej może nastąpić, jeśli używana jest niezatwierdzona taśma, ponieważ może być nawinięta nieprawidłowo dla drukarki lub zawierać chemikalia korozyjne dla głowicy drukującej.

### Dostosowywanie szerokości druku

Szerokość druku musi być ustawiona, gdy:
- Używasz drukarki po raz pierwszy
- Nastąpiła zmiana szerokości mediów

Szerokość druku może być ustawiona przez:
- Sterownik drukarki Windows lub oprogramowanie aplikacji, takie jak Zebra Designer
- Sekwencję pięciu błysków w trybach przycisku podawania
- Sterowanie operacjami drukarki za pomocą programowania ZPL; zapoznaj się z poleceniem Print Width (^PW) (sprawdź Przewodnik programowania ZPL)
- Sterowanie operacjami drukarki za pomocą programowania EPL Page Mode, zapoznaj się z poleceniem Set Label Width (q) (sprawdź Przewodnik programisty EPL)

### Dostosowywanie jakości druku

Na jakość druku wpływa ciepło lub gęstość (ustawienie) głowicy drukującej, prędkość drukowania i typ używanych mediów. Tylko przez eksperymentowanie znajdziesz optymalne połączenie dla swojej aplikacji.

Względne ustawienie ciemności (lub gęstości) może być kontrolowane przez:
- Sekwencję sześciu błysków w trybach przycisku podawania. Spowoduje to nadpisanie wszelkich zaprogramowanych ustawień ciemności/gęstości ZPL i EPL.
- Polecenie Set Darkness (~SD) ZPL (sprawdź Przewodnik programowania ZPL)
- Polecenie Density (D) EPL (sprawdź Przewodnik programisty EPL)

Jeśli okaże się, że prędkość drukowania wymaga dostosowania, użyj:
- Sterownika drukarki Windows lub oprogramowania aplikacji, takiego jak Zebra Designer
- Polecenia Print Rate (^PR) (sprawdź Przewodnik programowania ZPL)
- Polecenia Speed Select (S) (sprawdź Przewodnik programisty EPL)

> ℹ️ **UWAGA:** Producenci mediów mogą mieć konkretne zalecenia dotyczące ustawień prędkości dla Twojej drukarki i mediów. Niektóre typy mediów mają niższe maksymalne prędkości niż maksymalna prędkość Twojej drukarki.

### Wykrywanie mediów

Drukarka serii G ma automatyczną zdolność wykrywania mediów. Drukarka jest zaprojektowana do ciągłego sprawdzania i dostosowywania wykrywania długości mediów dla drobnych zmian. Po rozpoczęciu drukowania lub podawania mediów drukarka ciągle sprawdza i dostosowuje wykrywanie mediów, aby dostosować się do drobnych zmian parametrów mediów od etykiety do etykiety na rolce i od rolki do rolki mediów. Drukarka automatycznie zainicjuje kalibrację długości mediów, jeśli oczekiwana długość mediów lub odległość między etykietami przekroczyła akceptowalny zakres zmienności podczas rozpoczynania zadania drukowania lub podawania mediów. Automatyczne wykrywanie mediów w drukarkach serii G działa tak samo dla operacji drukarki wykorzystujących formaty etykiet i programowanie EPL i ZPL.

Jeśli drukarka nie wykryje etykiet lub czarnych linii (lub nacięć przy wykrywaniu czarnych linii) po podaniu mediów o domyślnej maksymalnej długości etykiety 39 cali (1 metr), drukarka przełączy się w tryb mediów ciągłych (paragonu). Drukarka zachowa te ustawienia do momentu zmiany przez oprogramowanie, programowanie lub ręczną kalibrację z innymi mediami.

Opcjonalnie drukarka może być ustawiona na wykonanie krótkiej kalibracji mediów po włączeniu zasilania lub zamknięciu drukarki z włączonym zasilaniem. Drukarka poda wtedy do trzech etykiet podczas kalibracji.

Ustawienia mediów drukarki można zweryfikować, drukując etykietę konfiguracji drukarki. Zobacz ręczną kalibrację, aby uzyskać więcej szczegółów.

Maksymalny dystans, który automatyczne wykrywanie typu mediów i wykrywanie sprawdzi, można zmniejszyć za pomocą polecenia ZPL Maximum Label Length (^ML). Zaleca się, aby ta odległość była ustawiona na nie mniej niż dwukrotność najdłuższej drukowanej etykiety. Jeśli największa drukowana etykieta ma rozmiar 4 na 6 cali, maksymalny dystans wykrywania długości etykiety (mediów) może być zmniejszony z domyślnej odległości 39 cali do 12 cali.

Jeśli drukarka ma trudności z automatycznym wykryciem typu mediów i automatyczną kalibracją, zobacz sekcję Ręczna kalibracja, aby wykonać obszerną kalibrację. Obejmuje ona wydrukowany wykres działania czujnika dla Twoich mediów. Ta metoda wyłącza automatyczną zdolność wykrywania mediów drukarki, dopóki domyślne parametry drukarki nie zostaną zresetowane do ustawień fabrycznych za pomocą trybu przycisku podawania z czterema błyskami. Zobacz tryby przycisku podawania, aby uzyskać więcej szczegółów.

### Ręczna kalibracja

Ręczna kalibracja jest zalecana, gdy używasz mediów z nadrukiem lub jeśli drukarka nie będzie prawidłowo automatycznie kalibrować.

**Procedura:**

1. Upewnij się, że media są załadowane.
2. Włącz zasilanie drukarki.
3. Naciśnij i przytrzymaj przycisk podawania, aż zielona lampka statusu mignie raz, potem dwa razy, a następnie kontynuuj, aż grupy błysków osiągną grupę siedmiu błysków. Zwolnij przycisk podawania.
4. Drukarka ustawi czujnik mediów dla używanego podkładu etykiety. Po wykonaniu tego dostosowania rolka automatycznie będzie podawana, aż etykieta znajdzie się przy głowicy drukującej. Wydrukowany zostanie profil ustawień czujnika mediów. Po zakończeniu drukarka zapisze nowe ustawienia w pamięci i drukarka będzie gotowa do normalnej pracy.
5. Naciśnij przycisk podawania. Jedna cała pusta etykieta zostanie podana. Jeśli tak się nie stanie, spróbuj przywrócić ustawienia domyślne (zapoznaj się z sekwencją czterech błysków w trybach przycisku podawania) i ponownie skalibruj drukarkę.

> ℹ️ **UWAGA:** Wykonanie ręcznej kalibracji wyłącza funkcję automatycznej kalibracji. Aby powrócić do automatycznej kalibracji, przywróć ustawienia domyślne drukarki (zapoznaj się z sekwencją czterech błysków w trybach przycisku podawania).

### Testy rozwiązywania problemów

#### Drukowanie etykiety konfiguracji

Aby wydrukować listę bieżącej konfiguracji drukarki, zapoznaj się z sekwencją jednego błysku w trybach przycisku podawania.

#### Ponowna kalibracja

Ponownie skalibruj drukarkę, jeśli zaczyna wykazywać nietypowe objawy, takie jak pomijanie etykiet. Zapoznaj się z sekwencją dwóch błysków w trybach przycisku podawania.

### Resetowanie wartości domyślnych fabrycznych

Czasami zresetowanie drukarki do ustawień fabrycznych może rozwiązać niektóre problemy. Zapoznaj się z sekwencją czterech błysków w trybach przycisku podawania.

### Diagnostyka komunikacji

Jeśli występuje problem z przesyłaniem danych między komputerem a drukarką, spróbuj przełączyć drukarkę w tryb diagnostyki komunikacji. Drukarka wydrukuje znaki ASCII i ich odpowiednie wartości szesnastkowe dla wszelkich danych otrzymanych z komputera hosta.

Istnieje kilka sposobów wejścia w tryb zrzutu danych szesnastkowych:
- Polecenie ZPL ~JD
- Polecenie EPL dump
- Podczas włączania z naciśniętym przyciskiem podawania. Zapoznaj się z procedurą trybu wyłączenia zasilania w trybach przycisku podawania.

Drukarka wydrukuje "Now in DUMP" i przejdzie do góry następnej etykiety.

Puste linie między liniami danych to miejsca, gdzie rejestrowane są błędy obsługi danych portu szeregowego i Bluetooth. Błędy to:
- F = Błąd ramki
- P = Błąd parzystości
- N = Błąd szumu
- O = Błąd przepełnienia danych

Aby wyjść z trybu diagnostycznego i wznowić drukowanie, wyłącz, a następnie włącz drukarkę. Alternatywną metodą wyjścia z trybu diagnostycznego jest naciskanie przycisku podawania tyle razy, ile potrzeba do wyczyszczenia bufora poleceń drukarki i wydrukowania "Out of DUMP" na etykiecie.

### Tryby przycisku podawania

#### Tryb wyłączenia zasilania (Tryb diagnostyki komunikacji)

Z wyłączonym zasilaniem drukarki naciśnij i przytrzymaj przycisk podawania, jednocześnie włączając zasilanie.

| Sekwencja błysków | Akcja |
|-------------------|-------|
| **Szybkie czerwone miganie** | **Tryb pobierania firmware'u** - Drukarka zaczyna szybko migać na czerwono, aby oznaczyć wejście w tryb pobierania firmware'u. Zwolnienie przycisku podawania tutaj rozpocznie inicjalizację drukarki do pobrania. Drukarka jest gotowa do rozpoczęcia pobierania firmware'u, gdy lampka statusu zacznie wolno migać między czerwonym a zielonym. Zobacz sekcję Wysyłanie plików do drukarki w podręczniku użytkownika, aby uzyskać więcej informacji na temat korzystania z narzędzia pobierania firmware'u (i plików) dostępnego do użytku z tą drukarką. Aktualizacje firmware'u dla Twojej drukarki, jeśli są dostępne, są publikowane na stronie Zebra: www.zebra.com |
| **Bursztynowy** | **Tryb normalnych operacji** - Drukarka kontynuuje normalną inicjalizację drukarki. Zwolnienie przycisku podawania tutaj pozwoli drukarce normalnie się uruchomić bez pobierania firmware'u lub działania w trybie diagnostyki komunikacji. |
| **Zielony** | **Tryb diagnostyki komunikacji (Dump)** - Zwolnij przycisk podawania natychmiast po tym, jak lampka statusu drukarki zmieni się na zieloną. Drukarka wydrukuje "Now in DUMP" na górze etykiety, a następnie przejdzie do następnej etykiety. Po wydrukowaniu pierwszej etykiety drukarka automatycznie wejdzie w tryb diagnostyczny, w którym drukarka drukuje dosłowną reprezentację wszystkich danych następnie otrzymanych. Aby wyjść z trybu diagnostycznego i wznowić drukowanie, wyłącz, a następnie włącz drukarkę. Alternatywną metodą wyjścia z trybu diagnostycznego jest naciskanie przycisku podawania tyle razy, ile potrzeba do wyczyszczenia bufora poleceń drukarki i wydrukowania "Out of DUMP" na etykiecie. |

#### Tryby włączonego zasilania

Z włączonym zasilaniem drukarki i zamkniętą górną pokrywą naciśnij i przytrzymaj przycisk podawania przez kilka sekund. Zielona dioda statusu mignie kilka razy w sekwencji. Poniższe wyjaśnienie pokazuje, co się dzieje, gdy zwolnisz klawisz po określonej liczbie błysków i przed rozpoczęciem następnej sekwencji błysków.

| Sekwencja błysków | Akcja |
|-------------------|-------|
| ★ | **Status konfiguracji** - Drukuje szczegółową etykietę statusu konfiguracji drukarki. Etykieta może być używana do weryfikacji drukowania, pomocy w konfiguracji komunikacji drukarki z komputerem, konserwacji, rozwiązywaniu problemów i pomocy w komunikacji z obsługą klienta. |
| ★★ | **Standardowa kalibracja mediów** - Drukarka wykrywa i ustawia typ mediów i długość mediów oraz dostosowuje czujniki mediów dla optymalnej wydajności z zainstalowanymi mediami. Drukarka poda od jednej do czterech etykiet. *Uwaga: Użytkownicy zaznajomieni z drukarką biurkową Zebra EPL używają tego trybu podawania, aby zastąpić kalibrację AutoSensing po włączeniu zasilania.* |
| ★★★ | **Konfiguracja portu szeregowego** - Dotyczy tylko drukarek z portami interfejsu szeregowego. Aby zresetować parametry komunikacji: Naciśnij i zwolnij przycisk podawania, gdy dioda szybko miga na bursztynowo i zielono. Dla synchronizacji autobaud: Wyślij sekwencję poleceń ^XA^XZ do drukarki, gdy dioda szybko miga na bursztynowo i zielono. Gdy drukarka i host są zsynchronizowane, dioda zmieni się na stałą zieloną. *UWAGA: Podczas synchronizacji autobaud nie zostaną wydrukowane żadne etykiety.* |
| ★★★★ | **Ustawienia fabryczne** - Resetuje drukarkę do domyślnych ustawień fabrycznych i trybów. Zobacz etykietę konfiguracji, aby uzyskać listę głównych ustawień, na które wpływa ta opcja trybu podawania. Inne ustawienia, które są ustawiane, przeglądane i kontrolowane wyłącznie przez programowanie, są również resetowane. Drukarka następnie wykonuje standardową kalibrację mediów. Po wejściu drukarki w tryb ustawień fabrycznych lampka statusu zmieni się na bursztynową na trzy (3) sekundy. W tym czasie możesz zrobić dwie rzeczy: Nie robić nic i drukarka automatycznie zresetuje ustawienia fabryczne jak opisano powyżej LUB nacisnąć i przytrzymać przycisk podawania, aby wejść w tryby resetowania ustawień fabrycznych dla opcji sieciowych drukarki (Ethernet, Wi-Fi lub Bluetooth). Zwolnienie przycisku po pierwszym błysku resetuje tylko opcje fabryczne sieci. Zwolnienie przycisku po drugiej sekwencji błysków (dwa błyski) zresetuje tylko ustawienia drukarki. Zwolnienie przycisku po trzeciej sekwencji błysków (trzy błyski) zresetuje zarówno ustawienia drukarki, jak i sieci. |
| ★★★★★ | **Dostosowanie szerokości druku** - Drukuje serię pól zaczynając od minimalnej szerokości druku i kończąc na maksymalnej szerokości druku drukarki w przyrostach 4 mm. Naciśnij przycisk podawania raz, gdy drukarka osiągnie żądaną maksymalną szerokość druku. *Uwaga: sterownik drukarki i aplikacje mogą nadpisać to ustawienie.* |
| ★★★★★★ | **Dostosowanie ciemności druku (gęstości)** - Drukuje serię wzorów symulacji kodu kreskowego, zaczynając od minimalnej ciemności (gęstości druku/ciepła) i kończąc na maksymalnej ciemności drukarki w przyrostach cztery (4) przy użyciu wartości zakresu ciemności ustawień ZPL. Naciśnij przycisk podawania raz, gdy wzór jest wyraźny i czytelny. Nie kontynuuj zwiększania ustawienia ciemności. Szerokości linii kodu kreskowego mogą ulec zniekształceniu, zmniejszając czytelność. *Uwaga: sterownik drukarki i aplikacje mogą nadpisać to ustawienie.* |
| ★★★★★★★ | **Ręczna kalibracja mediów** - Drukarka przeprowadza obszerne testy w celu wykrycia i ustawienia typu mediów i długości mediów, a następnie dostosowuje czujniki mediów dla optymalnej wydajności z zainstalowanymi mediami. Ręczna kalibracja jest zalecana, gdy używasz mediów z nadrukiem, drukujesz na podkładzie lub jeśli drukarka nie będzie prawidłowo automatycznie kalibrować. Wydrukowany zostanie graficzny profil wykrywania mediów. |

Jeśli przycisk podawania pozostanie naciśnięty po sekwencji 8 błysków, drukarka wyjdzie z trybu konfiguracji po zwolnieniu przycisku podawania.

---

## 4. Wymagane narzędzia

🔧 **NARZĘDZIA:** Używaj następujących narzędzi podczas wykonywania procedur wymiany:

- Śrubokręt krzyżakowy #0
- Śrubokręt krzyżakowy #1
- Mały śrubokręt płaski
- Szczypce płaskie (ostronoskie)
- Pisak WD-40 'No Mess' do konserwacji obcinarki
- Pisak do czyszczenia głowicy drukującej
- Waciki bez włókien
- Ściereczki bez włókien, takie jak Kim-Wipes

---

## 5. Wymiana części

W przypadku konieczności wymiany części zamiennej przejrzyj drzewo decyzyjne ścieżki naprawy, aby zobaczyć, które procedury należy wykonać. Przeczytaj kroki w wymaganych procedurach, aby usunąć starą część i zainstalować nową. Inne wymagane procedury mogą obejmować czyszczenie lub inną konserwację po wymianie części zamiennej.

### Ścieżka naprawy - Drzewo decyzyjne

**Komponenty wymienne:**

| Lokalizacja | Komponenty |
|-------------|------------|
| Zewnętrzne | Okno, tabliczka znamionowa, głowica drukująca |
| Dolna obudowa | Główna płyta logiki (PCBA), bezpiecznik, bateria zegara czasu rzeczywistego |
| Panel tylny | Moduł Ethernet (PCBA), Bluetooth (PCBA), 802.11g (PCBA) |
| Górna obudowa | Przełącznik podawania (PCBA), bezprzewodowy LCD (PCBA) |
| Mechanizm wewnętrzny | Silnik, wałek dociskowy, czujniki mediów (górny i dolny, stały i ruchomy), czujnik głowicy podniesionej |
| Opcje | Obcinarka, dyspenzer |

### Wymiana wałka dociskowego

#### Usuwanie

Otwórz drukarkę i usuń wszelkie media.

1. Otwórz drzwi dyspensera (peelera), jeśli opcja dyspensera jest zainstalowana.
2. Naciśnij zatrzaski po prawej i lewej stronie łożysk wałka dociskowego lekko na zewnątrz, aby zwolnić blokadę, a następnie obróć je do góry.
3. Wyjmij wałek dociskowy z dolnej ramy drukarki.

#### Instalacja

1. Upewnij się, że łożyska są prawidłowo zorientowane na wale wałka dociskowego i wciśnij przekładnię na wał wałka dociskowego.
2. Wyrównaj wałek dociskowy z przekładnią po lewej stronie i opuść go do dolnej ramy drukarki.
3. Obróć zatrzaski z powrotem i zatrzaśnij je na miejscu.

### Wymiana głowicy drukującej

W przypadku konieczności wymiany głowicy drukującej przeczytaj procedurę i przejrzyj kroki usuwania i instalacji przed faktyczną wymianą głowicy drukującej.

> ⚠️ **UWAGA:** Przygotuj swój obszar roboczy, chroniąc przed wyładowaniami elektrostatycznymi. Twój obszar roboczy musi być bezpieczny elektrostatycznie i zawierać odpowiednio uziemioną przewodzącą matę amortyzującą do trzymania drukarki oraz przewodzącą opaskę na nadgarstek dla siebie.

> ⚠️ **UWAGA:** Wyłącz zasilanie drukarki i odłącz kabel zasilający przed wymianą głowicy drukującej.

> ⚠️ **UWAGA:** Pozwól głowicy drukującej całkowicie ostygnąć przed próbą jej usunięcia.

Przed wykonaniem kroków tej procedury otwórz drukarkę, pociągając zatrzaski zwalniające do przodu, a następnie podnosząc górną pokrywę.

#### Usuwanie

1. Naciśnij zatrzask po prawej stronie głowicy drukującej w prawo.
2. Pociągnij głowicę drukującą do przodu i w razie potrzeby wyciągnij ją z górnej obudowy.
3. Odłącz oba zestawy przewodów głowicy drukującej od ich złączy.

#### Instalacja

1. Wyrównaj głowicę drukującą, aby podłączyć lewe i prawe złącza do zestawów przewodów.
2. Wsuń głowicę drukującą w lewą stronę i wpasuj ją w zatrzask po prawej stronie.
3. Oczyść głowicę drukującą.

Ponownie załaduj media. Podłącz kabel zasilający, włącz drukarkę i wydrukuj raport statusu, aby upewnić się, że działa prawidłowo.

### Wymiana okna

#### Usuwanie

Otwórz drukarkę i usuń wszelkie media.

1. Użyj śrubokręta krzyżakowego #0, aby poluzować śrubę trzymającą tylną część okna do pokrywy drukarki. Śruba często pozostaje uwięziona na miejscu.
2. Od tyłu ostrożnie podnieś okno, a następnie pociągnij je do tyłu, tak aby przednie zatrzaski wysunęły się z pokrywy.

#### Instalacja

1. Wyrównaj przedni zatrzask do przodu pokrywy i wsuń go na miejsce.
2. Opuść tylną część okna na miejsce. Sprawdź wyrównanie i umieszczenie okna na pokrywie.
3. Umieść śrubę z powrotem na miejscu i użyj śrubokręta krzyżakowego #0, aby ją dokręcić.

### Wymiana dolnej obudowy i panelu tylnego

> ⚠️ **UWAGA:** Przygotuj swój obszar roboczy, chroniąc przed wyładowaniami elektrostatycznymi. Twój obszar roboczy musi być bezpieczny elektrostatycznie i zawierać odpowiednio uziemioną przewodzącą matę amortyzującą do trzymania drukarki oraz przewodzącą opaskę na nadgarstek dla siebie.

#### Usuwanie

Okno drukarki musi być usunięte przed kontynuowaniem.

1. Odwróć drukarkę. Użyj śrubokręta krzyżakowego #1, aby poluzować trzy śruby trzymające dolną obudowę do wewnętrznego mechanizmu. *Uwaga: W przypadku drukarek z zainstalowaną opcją obcinarki, osłona obcinarki musi być najpierw usunięta.*
2. Podnieś przód dolnej obudowy od drukarki.
3. Umieść dolną obudowę pionowo na nóżkach. Od wewnątrz delikatnie naciśnij górę panelu tylnego, aż odskoczy od dolnej obudowy.

#### Instalacja

1. Opuść dolną obudowę na spód drukarki. Zacznij od tyłu, wkładając złącza interfejsu w tylną część dolnej obudowy, a następnie wyrównaj ją do podwozia. *Uwaga - nie instaluj jeszcze panelu tylnego na dolnej obudowie.*
2. Przymocuj dolną obudowę do drukarki trzema (3) śrubami za pomocą śrubokręta krzyżakowego #1.
3. Umieść drukarkę pionowo na nóżkach. Od tyłu wyrównaj "haki" panelu tylnego (i złącza interfejsu) do dolnej obudowy. Wciśnij panel tylny prosto do drukarki i zatrzaśnij go na miejscu.
4. Sprawdzając wyrównanie wokół włącznika zasilania i gniazda, naciśnij górę panelu tylnego, aż zatrzaśnie się na miejscu.

### Wymiana głównej płyty drukowanej (PCBA)

> ⚠️ **UWAGA:** Przygotuj swój obszar roboczy, chroniąc przed wyładowaniami elektrostatycznymi. Twój obszar roboczy musi być bezpieczny elektrostatycznie i zawierać odpowiednio uziemioną przewodzącą matę amortyzującą do trzymania drukarki oraz przewodzącą opaskę na nadgarstek dla siebie.

Musisz usunąć okno i dolną obudowę przed wykonaniem tej procedury.

#### Usuwanie

1. Od spodu użyj śrubokręta krzyżakowego #1, aby poluzować śrubę trzymającą główną płytę PCBA do wewnętrznego mechanizmu.
2. Ostrożnie podnieś główną płytę PCBA od drukarki, aby odłączyć przewody, wiązki i taśmy kablowe z jednej strony drukarki, a następnie z drugiej. Dla złączy kabli taśmowych pociągnij zatrzask w górę, aby odblokować złącza.

#### Instalacja

1. Od spodu sprawdź przewody, wiązki i taśmy kablowe i wyrównaj główną płytę PCBA nad kołkami montażowymi na wewnętrznym mechanizmie.
2. Podłącz silnik drukarki, czujniki, głowicę drukującą i kable uziemiające do głównej płyty PCBA. Z podniesioną (otwartą) blokadą wsuń taśmy kablowe do złącza. Strona obwodu jest skierowana do otwartej strony blokady. Wciśnij blokadę w dół, aby zablokować kabel. Sprawdź, czy wszystkie są bezpiecznie podłączone.
3. Opuść główną płytę PCBA na kołki montażowe.
4. Umieść śrubę z powrotem na miejscu i użyj śrubokręta krzyżakowego #1, aby ją dokręcić.

Zmontuj ponownie drukarkę. Ponownie załaduj media. Podłącz zasilanie, włącz drukarkę i wydrukuj raport statusu, aby upewnić się, że działa prawidłowo.

### Wymiana baterii

> ⚠️ **UWAGA:** Przygotuj swój obszar roboczy, chroniąc przed wyładowaniami elektrostatycznymi. Twój obszar roboczy musi być bezpieczny elektrostatycznie i zawierać odpowiednio uziemioną przewodzącą matę amortyzującą do trzymania drukarki oraz przewodzącą opaskę na nadgarstek dla siebie.

> ⚠️ **UWAGA:** Ryzyko wybuchu w przypadku wymiany baterii na niewłaściwy typ.

> ⚠️ **UWAGA:** Ryzyko wybuchu: NIE wrzucać do ognia.

> ℹ️ **UWAGA:** Ta bateria musi być utylizowana zgodnie z lokalnymi przepisami.

Opcja zegara czasu rzeczywistego ma wymienną baterię. Zapoznaj się z wymaganiami dotyczącymi bezpieczeństwa i utylizacji odpadów niebezpiecznych w Twojej społeczności lokalnej.

Musisz usunąć dolną obudowę i główną płytę logiki przed wykonaniem tej procedury.

#### Usuwanie

1. Zlokalizuj opcję zegara czasu rzeczywistego na głównej płycie logiki (w pobliżu przodu).
2. Użyj zakończonego nieprzewodzącego tępego narzędzia (takiego jak trzonek wacika bawełnianego), aby wypchnąć baterię z jej gniazda.

#### Instalacja

**Sprawdź wyrównanie baterii! Biegun dodatni jest na górze! Zauważ symbol plusa (+).**

1. Włóż baterię do jej gniazda na płytce zegara czasu rzeczywistego.

Wymień główną płytę logiki i dolną obudowę. Ponownie załaduj media. Podłącz zasilanie, włącz drukarkę i wydrukuj raport statusu, aby upewnić się, że działa prawidłowo.

### Wymiana bezpiecznika

> ⚠️ **UWAGA:** Przygotuj swój obszar roboczy, chroniąc przed wyładowaniami elektrostatycznymi. Twój obszar roboczy musi być bezpieczny elektrostatycznie i zawierać odpowiednio uziemioną przewodzącą matę amortyzującą do trzymania drukarki oraz przewodzącą opaskę na nadgarstek dla siebie.

Musisz usunąć dolną obudowę i główną płytę logiki przed wykonaniem tej procedury.

#### Usuwanie

1. Zlokalizuj bezpiecznik na górze głównej płyty logiki w pobliżu złączy interfejsu.
2. Użyj pęsety, aby chwycić bezpiecznik i wyciągnąć go z gniazda.

#### Instalacja

Nie ma obaw dotyczących polaryzacji.

1. Opuść bezpiecznik do jego gniazda.
2. Upewnij się, że jest całkowicie osadzony.

Wymień główną płytę logiki i dolną obudowę. Ponownie załaduj media. Podłącz zasilanie, włącz drukarkę i wydrukuj raport statusu, aby upewnić się, że działa prawidłowo.

### Wymiana czujnika głowicy podniesionej

> ⚠️ **UWAGA:** Przygotuj swój obszar roboczy, chroniąc przed wyładowaniami elektrostatycznymi. Twój obszar roboczy musi być bezpieczny elektrostatycznie i zawierać odpowiednio uziemioną przewodzącą matę amortyzującą do trzymania drukarki oraz przewodzącą opaskę na nadgarstek dla siebie.

Musisz usunąć okno, dolną obudowę i główną płytę PCBA przed wykonaniem tej procedury.

#### Usuwanie

Czujnik głowicy podniesionej znajduje się po prawej stronie drukarki w kierunku przodu komory mediów.

1. Od spodu użyj śrubokręta krzyżakowego #1, aby poluzować śrubę trzymającą czujnik głowicy podniesionej do wewnętrznego mechanizmu.
2. Ostrożnie podnieś czujnik i jego wiązkę przewodów od drukarki.

#### Instalacja

1. Od spodu wyrównaj czujnik na miejscu z nacięciem na zewnętrznym zatrzasku i przyciskiem skierowanym do przodu drukarki.
2. Umieść śrubę z powrotem na miejscu i użyj śrubokręta krzyżakowego #1, aby ją dokręcić.

Zmontuj ponownie drukarkę. Ponownie załaduj media. Podłącz zasilanie, włącz drukarkę i wydrukuj raport statusu, aby upewnić się, że działa prawidłowo.

### Wymiana dyspensera i czujnika pobrania etykiety

> ⚠️ **UWAGA:** Przygotuj swój obszar roboczy, chroniąc przed wyładowaniami elektrostatycznymi. Twój obszar roboczy musi być bezpieczny elektrostatycznie i zawierać odpowiednio uziemioną przewodzącą matę amortyzującą do trzymania drukarki oraz przewodzącą opaskę na nadgarstek dla siebie.

Musisz usunąć okno, dolną obudowę i główną płytę PCBA przed wykonaniem tej procedury. Aby wymienić listwę odrywającą dyspensera, usuń wałek dociskowy.

#### Usuwanie - Dyspenzer

Dyspenzer i jego czujnik znajdują się z przodu drukarki przy wyjściu mediów.

1. Otwórz dyspenzer.
2. Ostrożnie odciągnij lewą stronę dyspensera od drukarki.
3. Wysuń prawą stronę od drukarki i wyciągnij z nią wiązkę przewodów. Ostrożnie złóż wiązkę przewodów przy złączu i przesuń złącze przez ścianę drukarki.

#### Instalacja - Dyspenzer

1. Ostrożnie złóż wiązkę przewodów przy złączu i przesuń złącze przez ścianę wewnętrznego mechanizmu.
2. Pociągnij wiązkę przewodów i doprowadź prawą stronę dyspensera do jej otworu montażowego.
3. Delikatnie zegnij lewą stronę wewnętrznego mechanizmu, aby zatrzasnąć lewą stronę dyspensera na miejscu.
4. Przetestuj ruch dyspensera, aby upewnić się, że działa prawidłowo. Sprawdź, czy zatrzaskuje się i blokuje po zamknięciu, otwierając i zamykając drzwi dyspensera kilka razy.

Zmontuj ponownie drukarkę. Ponownie załaduj media. Podłącz zasilanie, włącz drukarkę i wydrukuj raport statusu, aby upewnić się, że działa prawidłowo.

#### Usuwanie - Listwa odrywająca

Drzwi dyspensera i wałek dociskowy muszą być najpierw usunięte.

1. Używając tylko rąk, zegnij listwę odrywającą w dół pośrodku, jednocześnie popychając lewy koniec do góry, stosując kontrolowany, mocny nacisk.

#### Instalacja - Listwa odrywająca

1. Włóż prawą stronę listwy odrywającej do podwozia drukarki.
2. Przesuń lewą stronę listwy odrywającej w dół do podwozia.

### Wymiana obcinarki

> ⚠️ **UWAGA:** Przygotuj swój obszar roboczy, chroniąc przed wyładowaniami elektrostatycznymi. Twój obszar roboczy musi być bezpieczny elektrostatycznie i zawierać odpowiednio uziemioną przewodzącą matę amortyzującą do trzymania drukarki oraz przewodzącą opaskę na nadgarstek dla siebie.

Musisz usunąć okno, dolną obudowę i główną płytę PCBA przed wykonaniem tej procedury.

#### Usuwanie

Obcinarka znajduje się z przodu drukarki i jest wyjściem mediów.

1. **Z procedury wymiany dolnej obudowy:** Usuń dwie śruby ze spodu osłony obcinarki. Odchyl osłonę na zewnątrz i z góry korpusu obcinarki. Usuń dolną obudowę. Usuń główną płytę PCBA.
2. Usuń cztery śruby (dwie z każdej strony) mocujące obcinarkę do podwozia.
3. Wysuń obcinarkę od drukarki. Odłącz zielony przewód uziemiający obcinarki od złącza sprzęgającego uziemienie (który jest również podłączony do głównej płyty PCBA i silnika).
4. Ostrożnie złóż wiązkę przewodów przy złączu i przesuń złącze i przewód uziemiający przez ścianę drukarki.

#### Instalacja

1. Ostrożnie złóż wiązkę przewodów przy złączu i przesuń złącze i przewód uziemiający przez ścianę wewnętrznego mechanizmu.
2. Podłącz ponownie zielony przewód uziemiający obcinarki do złącza sprzęgającego uziemienie.
3. Pociągnij wiązkę przewodów naprężając ją, jednocześnie wsuwając obcinarkę w przód drukarki. Wyrównaj cztery otwory na śruby na wsporniku obcinarki do podwozia. Ponownie przymocuj obcinarkę czterema śrubami.
4. Podłącz wiązkę przewodów obcinarki do głównej płyty PCBA. Podłącz ponownie pozostałe złącza przewodów do głównej płyty PCBA. Ponownie przymocuj główną płytę PCBA śrubą.
5. Ponownie przymocuj dolną obudowę.
6. Ponownie przymocuj osłonę obcinarki.

Zmontuj ponownie drukarkę. Ponownie załaduj media. Podłącz zasilanie, włącz drukarkę i wydrukuj raport statusu, aby upewnić się, że działa prawidłowo.

### Wymiana silnika

> ⚠️ **UWAGA:** Przygotuj swój obszar roboczy, chroniąc przed wyładowaniami elektrostatycznymi. Twój obszar roboczy musi być bezpieczny elektrostatycznie i zawierać odpowiednio uziemioną przewodzącą matę amortyzującą do trzymania drukarki oraz przewodzącą opaskę na nadgarstek dla siebie.

Musisz usunąć okno, dolną obudowę i główną płytę PCBA przed wykonaniem tej procedury.

#### Usuwanie

Silnik znajduje się po prawej stronie drukarki pod komorą mediów.

1. Użyj śrubokręta krzyżakowego #1, aby usunąć zacisk uziemiający z silnika.
2. Trzymając silnik, usuń dwie śruby mocujące silnik do podwozia drukarki. Wysuń silnik z podwozia.

#### Instalacja

1. Wyrównaj silnik na miejscu, upewniając się, że jego przekładnie zazębiają się z przekładniami przenoszonymi, a następnie wyrównaj otwory montażowe silnika z silnikiem.
2. Umieść śruby z powrotem na miejscu i użyj śrubokręta krzyżakowego #1, aby je dokręcić.
3. Przymocuj zacisk uziemiający i przewód uziemiający (zielony) do silnika. Obróć zacisk, aż zatrzyma się na obudowie zatrzasku na podwoziu druku.

Zmontuj ponownie drukarkę. Ponownie załaduj media. Podłącz zasilanie, włącz drukarkę i wydrukuj raport statusu, aby upewnić się, że działa prawidłowo.

### Wymiana dolnego czujnika mediów (stałego)

> ⚠️ **UWAGA:** Przygotuj swój obszar roboczy, chroniąc przed wyładowaniami elektrostatycznymi. Twój obszar roboczy musi być bezpieczny elektrostatycznie i zawierać odpowiednio uziemioną przewodzącą matę amortyzującą do trzymania drukarki oraz przewodzącą opaskę na nadgarstek dla siebie.

Musisz usunąć okno, dolną obudowę i główną płytę PCBA przed wykonaniem tej procedury.

#### Usuwanie

Dolny czujnik mediów (do wykrywania szczelin i czarnych linii) znajduje się w centrum drukarki w kierunku przodu komory mediów.

1. Od spodu użyj szczypiec lub płaskiego śrubokręta, aby podnieść element mocujący wciskany trzymający czujnik do wewnętrznego mechanizmu. Element mocujący musi być podniesiony prosto w górę małego plastikowego kołka, w przeciwnym razie kołek może zostać uszkodzony.
2. Podnieś czujnik i jego taśmę kablową z kołka i od drukarki.

#### Instalacja

1. Od spodu wyrównaj czujnik na miejscu z jego taśmą kablową po prawej stronie.
2. Umieść element mocujący z powrotem na miejscu i wciśnij go na kołek, aby go dokręcić. Mały klucz nasadowy sześciokątny jest dobrym wyborem narzędzia do wciśnięcia elementu mocującego mocno na kołek.

Zmontuj ponownie drukarkę. Ponownie załaduj media. Podłącz zasilanie, włącz drukarkę i wydrukuj raport statusu, aby upewnić się, że działa prawidłowo.

### Wymiana dolnego czujnika mediów (ruchomego)

> ⚠️ **UWAGA:** Przygotuj swój obszar roboczy, chroniąc przed wyładowaniami elektrostatycznymi. Twój obszar roboczy musi być bezpieczny elektrostatycznie i zawierać odpowiednio uziemioną przewodzącą matę amortyzującą do trzymania drukarki oraz przewodzącą opaskę na nadgarstek dla siebie.

Musisz usunąć okno, dolną obudowę, główną płytę PCBA i silnik przed wykonaniem tej procedury.

#### Usuwanie

Dolny czujnik mediów (do wykrywania szczelin i czarnych linii) znajduje się w centrum drukarki w kierunku przodu komory mediów.

1. Od spodu usuń dwie śruby mocujące wspornik suwakowy czujnika i
2. Podnieś czujnik i jego taśmę kablową flex. Delikatnie wyciągnij kabel z zacisku.

#### Instalacja

1. Umieść czujnik we wsporniku suwakowym.
2. Od spodu wyrównaj wspornik i czujnik do podwozia drukarki.
3. Ponownie przymocuj wspornik do podwozia dwoma śrubami. Sprawdź, czy czujnik przesuwa się przez cały zakres regulacji bez zacięć.
4. Utwórz pętlę na taśmie kablowej flex i wsuń kabel do zacisku. Zacisk można lekko i tymczasowo odgiąć, aby ułatwić montaż. Dostosuj pętlę, aby czujnik mógł łatwo przesuwać się przez pełny zakres regulacji.

Zmontuj ponownie drukarkę. Ponownie załaduj media. Podłącz zasilanie, włącz drukarkę i wydrukuj raport statusu, aby upewnić się, że działa prawidłowo.

### Wymiana górnej obudowy i PCBA przełącznika podawania

> ⚠️ **UWAGA:** Przygotuj swój obszar roboczy, chroniąc przed wyładowaniami elektrostatycznymi. Twój obszar roboczy musi być bezpieczny elektrostatycznie i zawierać odpowiednio uziemioną przewodzącą matę amortyzującą do trzymania drukarki oraz przewodzącą opaskę na nadgarstek dla siebie.

Musisz usunąć okno przed wykonaniem tej procedury.

#### Usuwanie

1. Otwórz drukarkę.
2. Od wewnątrz górnej połowy drukarki użyj śrubokręta krzyżakowego #1, aby usunąć sześć śrub trzymających górną obudowę do górnej ramy wewnętrznego mechanizmu.
3. Ostrożnie opuść zdemontowaną pokrywę, aby zamknąć drukarkę.
4. Ostrożnie podnieś lewą krawędź górnej obudowy od drukarki i odwróć ją otwierając, obracając na prawej stronie. Prawa strona jest połączona wiązkami przewodów z podwoziem drukarki.

**Teraz masz dostęp do PCBA przełącznika podawania lub LCD i górnych czujników mediów.**

5. Usuń dwie śruby mocujące PCBA przełącznika podawania do górnej obudowy.
6. Zwolnij blokady na taśmach kablowych i wyciągnij kable.
7. **Tylko górna pokrywa** - Wyciągnij kabel z zacisku mocującego go do górnej obudowy. Podnieś górną obudowę od drukarki.

#### Instalacja

1. Podłącz PCBA przełącznika podawania do górnej obudowy dwoma (2) śrubami.
2. Trzymaj prawą krawędź górnej obudowy blisko górnej ramy wewnętrznego mechanizmu. Włóż taśmę kablową czujnika do PCBA przełącznika podawania. Odsłonięte palce obwodu taśmy kablowej są skierowane do wnętrza górnej pokrywy.
3. **Tylko górna pokrywa** - Przymocuj aluminiowy zacisk z podkładką piankową około 2 cale (5 cm) od końca długiej taśmy kablowej przełącznika podawania. Z taśmą kablową wyrównaną równolegle do boku drukarki (bez skręceń w kablu) umieść zacisk z ramieniem skierowanym w dół i pianką ramienia skierowaną na zewnątrz. Złóż ramię na taśmie kablowej. Złóż podstawę zacisku z podkładką piankową w złożone ramię.
4. **Tylko górna pokrywa** - Otwórz blokadę kabla złącza przełącznika podawania. Obróć taśmę kablową o pół obrotu zgodnie z ruchem wskazówek zegara i włóż taśmę kablową do złącza z odsłoniętymi palcami obwodu skierowanymi do otwartej strony blokady złącza (tył drukarki). Zablokuj złącze.
5. **Tylko górna pokrywa** - Zdejmij podkład z pianki zacisku i przymocuj zacisk do wewnętrznej strony górnej obudowy. Umieść zacisk około pół cala od słupka i dolnej krawędzi (gdy drukarka jest zamknięta) górnej obudowy. Obszar ma teksturowaną powierzchnię. Sprawdź, czy taśma kablowa jest prosta w złączu i nie została wyciągnięta.
6. Sprawdź, czy obie taśmy kablowe są nadal włożone prosto do złączy i nie zostały wyciągnięte.
7. Odwróć obudowę na górę podwozia i dopasuj górną obudowę do drukarki. Uważaj, aby nie przyciąć kabli lub nie wyciągnąć złączy z PCBA przełącznika podawania.
8. Ostrożnie otwórz drukarkę, trzymając górną obudowę przy górnej ramie.
9. Umieść sześć (6) śrub z powrotem na miejscu i użyj śrubokręta krzyżakowego #1, aby je dokręcić.

Zmontuj ponownie drukarkę. Ponownie załaduj media. Podłącz zasilanie, włącz drukarkę i wydrukuj raport statusu, aby upewnić się, że działa prawidłowo.

### Wymiana bezprzewodowej płytki LCD PCBA

> ⚠️ **UWAGA:** Przygotuj swój obszar roboczy, chroniąc przed wyładowaniami elektrostatycznymi. Twój obszar roboczy musi być bezpieczny elektrostatycznie i zawierać odpowiednio uziemioną przewodzącą matę amortyzującą do trzymania drukarki oraz przewodzącą opaskę na nadgarstek dla siebie.

Musisz usunąć okno i górną pokrywę przed wykonaniem tej procedury.

#### Usuwanie

1. Usuń dwie śruby mocujące LCD PCBA do górnej obudowy.
2. Zwolnij blokady na trzech taśmach kablowych i wyciągnij kable, aby uwolnić PCBA.
3. **Dla modeli drukarek Wi-Fi 802.11 b/g:** Odłącz antenę od LCD PCBA.

#### Instalacja

1. Otwórz blokady kabli trzech złączy kabli. Włóż taśmy kablowe flex do złączy ze stykami (palcami) kabli skierowanymi do LCD PCBA. Zablokuj złącza.
2. **Dla modeli drukarek Wi-Fi 802.11 b/g:** Podłącz antenę do LCD PCBA.
3. Sprawdź, czy wszystkie taśmy kablowe są nadal włożone prosto w złącza i nie zostały wyciągnięte.
4. Odwróć płytkę drukowaną i zamontuj do podwozia drukarki. Zabezpiecz ją dwoma śrubami.

Zmontuj ponownie drukarkę. Ponownie załaduj media. Podłącz zasilanie, włącz drukarkę i wydrukuj raport statusu, aby upewnić się, że działa prawidłowo.

### Wymiana górnego czujnika mediów

> ⚠️ **UWAGA:** Przygotuj swój obszar roboczy, chroniąc przed wyładowaniami elektrostatycznymi. Twój obszar roboczy musi być bezpieczny elektrostatycznie i zawierać odpowiednio uziemioną przewodzącą matę amortyzującą do trzymania drukarki oraz przewodzącą opaskę na nadgarstek dla siebie.

Musisz usunąć okno i górną obudowę przed wykonaniem tej procedury.

#### Usuwanie

Górny czujnik transmisyjny (szczeliny) znajduje się w centrum drukarki na górnej ramie wewnętrznego mechanizmu.

1. Użyj szczypiec lub płaskiego śrubokręta, aby podnieść element mocujący wciskany trzymający czujnik do wewnętrznego mechanizmu. Element mocujący musi być podniesiony prosto w górę małego plastikowego kołka, w przeciwnym razie kołek może zostać uszkodzony.
2. Odłącz taśmę kablową czujnika od PCBA przełącznika podawania zamontowanego na górnej obudowie.

#### Instalacja

1. Wyrównaj czujnik na miejscu z jego taśmą kablową do tyłu i skierowaną w dół do drukarki.
2. Umieść nowy element mocujący z powrotem na miejscu i wciśnij go na kołek, aby go dokręcić. Mały klucz nasadowy sześciokątny jest dobrym wyborem narzędzia do wciśnięcia elementu mocującego mocno na kołek.
3. Podłącz taśmę kablową do PCBA przełącznika podawania. Obwody taśmy są skierowane do środka podwozia.

Zmontuj ponownie drukarkę. Ponownie załaduj media. Podłącz zasilanie, włącz drukarkę i wydrukuj raport statusu, aby upewnić się, że działa prawidłowo.

### Wymiana wewnętrznego mechanizmu

> ⚠️ **UWAGA:** Przygotuj swój obszar roboczy, chroniąc przed wyładowaniami elektrostatycznymi. Twój obszar roboczy musi być bezpieczny elektrostatycznie i zawierać odpowiednio uziemioną przewodzącą matę amortyzującą do trzymania drukarki oraz przewodzącą opaskę na nadgarstek dla siebie.

Wewnętrzny mechanizm obejmuje górną i dolną wewnętrzną ramę, silnik i czujniki. Musisz usunąć dolną obudowę, główną płytę PCBA, głowicę drukującą, okno i górną obudowę (w tym przełącznik podawania). Zapoznaj się z tymi procedurami.

---

## 6. Prowadzenie kabli

### Mechanizm druku

Poniższe zdjęcia pokazują prowadzenie kabli dla komponentów elektronicznych drukarki na wewnętrznym mechanizmie drukarki.

#### Złącza na głównej płycie PCBA

| Złącze | Lokalizacja |
|--------|-------------|
| Głowica drukująca | Prawa strona płyty |
| Interfejsy | Dolna część płyty |
| Włącznik zasilania i wejście | Prawa dolna część |
| Opcjonalna obcinarka | Góra płyty |
| Nieużywane w drukarkach termicznych bezpośrednich | Lewa strona |
| Przełącznik podawania i górny czujnik szczeliny i czarnej linii | Lewa dolna część |
| Czujnik głowicy podniesionej | Środkowa lewa część |
| LCD i bezprzewodowy | Lewa strona |
| Opcjonalne połączenie zegara czasu rzeczywistego | Góra płyty |
| Opcjonalne połączenie | Góra płyty |
| Złącze dyspensera | Środek płyty |
| Silnik | Prawa strona |

#### Główne komponenty i ich lokalizacje

**Górna część mechanizmu:**
- Kabel PCBA przełącznika podawania
- PCBA przełącznika podawania
- Kabel górnego czujnika szczeliny

**Dolna część mechanizmu:**
- Dolny czujnik czarnej linii/szczeliny
- Czujnik głowicy podniesionej
- Dyspenzer (Peel)
- Złącze dyspensera
- Złącze górnego czujnika szczeliny
- Złącze czujnika głowicy podniesionej
- Złącze czujnika czarnej linii
- Główna płyta drukowana (PCBA)
- Kabel uziemiający
- Silnik
- Wiązka przewodów silnika
- Wiązka przewodów głowicy drukującej
- Czujnik pobrania etykiety (dyspenzer)

---

## Notatki

_______________________________________________________________________

_______________________________________________________________________

_______________________________________________________________________

_______________________________________________________________________

_______________________________________________________________________

_______________________________________________________________________

_______________________________________________________________________

---

*Dokument przetłumaczony z języka angielskiego. Oryginał: Zebra Technologies Corporation, Direct Thermal G-Series™ Printer Service Manual, 980617-001 Rev. 1, 28/08/2008*

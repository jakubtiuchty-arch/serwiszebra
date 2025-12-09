cu# Kompletna baza wiedzy terminali mobilnych Zebra dla serwiszebra.pl

## Obsługiwane modele: TC21, TC22, MC33, MC34, MC93, MC94, MC22, TC26, TC27, TC8000

Ta kompleksowa baza wiedzy zawiera wszystkie problemy klientów, pytania, kody błędów i scenariusze troubleshootingu zorganizowane do szkolenia chatbota AI.

---

# SEKCJA 1: PROBLEMY SPRZĘTOWE

## 1.1 Problemy z ekranem

### Pęknięty/uszkodzony ekran
**Pytania klientów:**
- "Ekran mojego TC21/TC22/MC33 pękł po upadku"
- "Wyświetlacz ma pęknięcie, ale częściowo działa"
- "Czy mogę wymienić ekran?"

**Szczegóły techniczne:**
- Wymiana ekranu wymaga oryginalnego lub certyfikowanego zespołu LCD+digitizer
- Taśmy połączeniowe są delikatne i podatne na uszkodzenia podczas wymiany
- Po wymianie ekranu mogą pojawić się białe kropki lub czarny ekran (normalne podczas kalibracji)
- Nieprofesjonalna instalacja niezalecana
- Uszkodzenia przypadkowe NIE są objęte standardową gwarancją - wymaga pakietu OneCare comprehensive

### Niedziałający ekran dotykowy
**Pytania klientów:**
- "Ekran dotykowy losowo przestaje reagować"
- "Dotyk nie działa po rejestracji MDM"
- "Ekran nie reaguje w niektórych miejscach"
- "Dotyk jest przesunięty względem miejsca naciśnięcia"

**Szczegóły techniczne:**
- **Zakłócenia elektrostatyczne**: Częste w suchym środowisku; słabe uziemienie urządzenia powoduje zakłócenia elektrostatyczne
- **Rozwiązanie**: Wyłącz tryb rękawiczkowy przez ADB: `adb shell settings put system touch_glove_mode 0`
- **Naprawa uziemienia**: Podłącz goły miedziany przewód od portu USB-C do uziemionej metalowej powierzchni
- Wyczyść ekran miękką ściereczką bez kłaczków, aby usunąć brud/odciski palców wpływające na czułość
- TC51 specyficznie: Ekran dotykowy może przestać działać po rejestracji MDM (SOTI MobiControl) - problem niekompatybilności firmware
- Wykonaj soft reset: Przytrzymaj przycisk Power przez 10 sekund
- Przekalibruj ekran dotykowy: Ustawienia > Wyświetlacz > Ustawienia dotyku (jeśli dostępne)

### Migotanie wyświetlacza/Czarny ekran
**Pytania klientów:**
- "Ekran robi się czarny, ale urządzenie nadal działa"
- "Wyświetlacz migocze sporadycznie"
- "Urządzenie wibruje, ale ekran jest czarny"

**Szczegóły techniczne:**
- Może wskazywać na wadliwy LCD lub luźną taśmę wyświetlacza
- Wykonaj hard reset: Power + Scan + Volume Up przez 4+ sekundy
- Jeśli ekran czarny, ale LED/dźwięki działają, prawdopodobnie potrzebna wymiana wyświetlacza
- Sprawdź wskaźniki zalania wodą
- Podłącz do ADB: jeśli urządzenie wykryte, ale wyświetlacz czarny, prawdopodobnie problem sprzętowy

### Martwe piksele/Defekty wyświetlacza
**Pytania klientów:**
- "Widzę martwe miejsca/piksele na ekranie"
- "Części wyświetlacza pokazują złe kolory"

**Szczegóły techniczne:**
- Martwe piksele wskazują na defekt LCD wymagający wymiany ekranu
- Zniekształcenie pikseli, zamrożony LCD lub złe kolory = wadliwy zespół wyświetlacza
- Wady produkcyjne objęte gwarancją

### Problemy z folią ochronną
**Pytania klientów:**
- "Folia ochronna zakłóca dotyk"
- "Folia ochronna powoduje problemy z czułością"

**Szczegóły techniczne:**
- Usuń folie transportowe przed pierwszym użyciem
- Folie ochronne mogą wpływać na czułość dotyku - używaj folii zatwierdzonych przez Zebra
- Dostępne ustawienia trybu dotyku dla różnych scenariuszy

---

## 1.2 Problemy z baterią

### Bateria się nie ładuje
**Pytania klientów:**
- "Moja bateria w ogóle się nie ładuje"
- "Urządzenie nie ładuje się w stacji dokującej"
- "LED miga wolno na czerwono co 4 sekundy"
- "Bateria pokazuje ładowanie, ale procent się nie zwiększa"

**Szczegóły techniczne:**
- **LED miga wolno na czerwono (co 4 sekundy)**: Bateria osiągnęła koniec żywotności - wymień natychmiast
- Sprawdź czy bateria jest prawidłowo osadzona ze słyszalnym kliknięciem
- Sprawdź port ładowania pod kątem kurzu/zanieczyszczeń - wyczyść sprężonym powietrzem
- **UWAGA**: Nie używaj metalowych przedmiotów, płynów (oprócz alkoholu izopropylowego) ani ostrych przedmiotów do czyszczenia portów
- Sprawdź czy zasilacz jest prawidłowo podłączony
- Przetestuj z innym kablem USB-C lub innym akcesorium ładującym
- Bateria nie ładuje się gdy temperatura jest powyżej 40°C lub poniżej 5°C

### Kody wskaźników LED ładowania (wszystkie modele)
| Zachowanie LED | Status |
|----------------|--------|
| Wyłączony | Nie ładuje / Brak zasilania stacji |
| Stały bursztynowy | Ładowanie w toku / Wstępne ładowanie słabej baterii |
| Migający bursztynowy | Normalny cykl ładowania |
| Stały zielony | Ładowanie zakończone |
| Migający czerwony | Błąd ładowania / Usterka baterii |
| Naprzemienny czerwony/bursztynowy | Temperatura zbyt wysoka lub zbyt niska |
| Wolne czerwone mignięcie (4 sek) | Koniec żywotności baterii - wymień |

### Spuchnięta bateria
**Pytania klientów:**
- "Moja bateria wydaje się spuchnięta/napęczniała"
- "Bateria już nie pasuje prawidłowo"
- "Tylna pokrywa urządzenia się nie zamyka"

**Szczegóły techniczne:**
- **NATYCHMIAST przestań używać** - spuchnięte baterie stanowią zagrożenie bezpieczeństwa
- Nie próbuj ładować spuchniętych baterii
- Zutylizuj prawidłowo zgodnie z lokalnymi przepisami
- Wymień na oryginalną baterię Zebra PowerPrecision/PowerPrecision+
- Nie objęte gwarancją - normalne zużycie/kwestia bezpieczeństwa

### Szybkie rozładowywanie baterii
**Pytania klientów:**
- "Bateria rozładowuje się za szybko"
- "Bateria wytrzymuje tylko kilka godzin"
- "Dlaczego moja bateria tak krótko działa?"

**Szczegóły techniczne:**
- Standardowa bateria powinna wytrzymać ~10 godzin przy normalnym użytkowaniu
- Rozszerzona bateria MC93: ~14 godzin przy pełnym naładowaniu
- **Rozwiązania:**
  - Zmniejsz jasność ekranu (Szybkie ustawienia > suwak jasności)
  - Włącz tryb oszczędzania baterii: Ustawienia > Bateria > Oszczędzanie baterii
  - Zmniejsz czas wygaszania ekranu (zalecane 30 sekund)
  - Wyłącz nieużywane radia (WiFi, Bluetooth) gdy niepotrzebne
  - Odinstaluj aplikacje firm trzecich z Google Play zwiększające zużycie
  - Zamknij aplikacje działające w tle
- Żywotność baterii maleje z czasem - wymień po 12-18 miesiącach codziennego użytkowania
- Modele z siecią komórkową (TC26/TC27) rozładowują się szybciej przez radio WAN

### Bateria nie rozpoznana
**Pytania klientów:**
- "Urządzenie nie wykrywa baterii"
- "Bateria pokazuje się jako nieobecna"
- "Błąd: Brak baterii"

**Szczegóły techniczne:**
- Wyczyść styki baterii i urządzenia alkoholem izopropylowym
- Włóż baterię ponownie - upewnij się, że oba zatrzaski wracają do pozycji ze słyszalnym kliknięciem
- Sprawdź czy piny baterii nie są wygięte/uszkodzone
- Spróbuj ze sprawdzoną baterią, aby wyizolować problem
- Sprawdź stan baterii: Ustawienia > Informacje o telefonie > Informacje o baterii

### Nieprawidłowy procent baterii
**Pytania klientów:**
- "Bateria pokazuje 50%, ale się wyłącza"
- "Procent baterii skacze chaotycznie"
- "Urządzenie wyłącza się przy 20-30% baterii"

**Szczegóły techniczne:**
- Przekalibruj przez pełne rozładowanie, potem naładowanie do 100% (powtórz 2-3 razy)
- Baterie PowerPrecision+ zapewniają lepszą dokładność stanu naładowania
- Sprawdź stan baterii w aplikacji Battery Manager
- Stare baterie mogą raportować niedokładne procenty - wymień jeśli >18 miesięcy
- Bateria osiąga status "Wycofana" przy ~400 cyklach ładowania

### Bateria rozszerzona vs standardowa
**Pytania klientów:**
- "Której baterii powinienem używać?"
- "Jaka jest różnica między typami baterii?"
- "Rozszerzona bateria nie ładuje się prawidłowo"

**Szczegóły techniczne:**
- **Bateria standardowa**: ~3 godziny do 90%, ~10 godzin pracy
- **Bateria rozszerzona**: ~4 godziny do 90%, ~14 godzin pracy
- TC8000: 6700mAh PowerPrecision+ dla pracy na trzy zmiany
- Dostępny tryb hot-swap: Wyświetlacz wyłącza się, urządzenie wchodzi w tryb niskiego poboru mocy na ~5 minut

---

## 1.3 Problemy ze skanerem

### Brak wiązki/Skaner nie działa
**Pytania klientów:**
- "Skaner nie emituje lasera/światła"
- "Brak czerwonej wiązki po naciśnięciu spustu"
- "Skaner nie wyzwala skanowania"
- "Naciśnięcie przycisku skanowania nic nie robi"

**Szczegóły techniczne:**
- Sprawdź czy aplikacja obsługująca skanowanie jest otwarta z polem tekstowym w fokusie
- Sprawdź czy skaner jest włączony w ustawieniach DataWedge
- Sprawdź czy przycisk spustu jest prawidłowo przypisany: Ustawienia > Ustawienia przycisków
- Uruchom aplikację Device Diagnostics > Test skanera
- Zrestartuj urządzenie, aby wyczyścić tymczasowe błędy
- Sprawdź czy okienko skanera nie jest fizycznie uszkodzone

### Słabe skanowanie/Przerywane skanowanie
**Pytania klientów:**
- "Skaner działa tylko czasami"
- "Muszę skanować wielokrotnie, żeby odczytać"
- "Skaner działa z niektórych odległości, ale nie z innych"
- "Kody kreskowe dekodują się niespójnie"

**Szczegóły techniczne:**
- Wyczyść okienko skanera ściereczką bez kłaczków i alkoholem izopropylowym
- Sprawdź czy na okienku skanera nie ma zarysowań
- Upewnij się, że kod kreskowy jest w obszarze celownika
- Przetestuj ze sprawdzonym kodem kreskowym, aby wykluczyć jakość etykiety
- Sprawdź warunki oświetleniowe (unikaj bezpośredniego światła słonecznego na kodzie)
- Sprawdź kalibrację skanera w DataWedge

### Problemy specyficzne dla silników skanera
**SE4710 (TC21/TC22/TC26/TC27):**
- Imager standardowego zasięgu
- Dobry do handlu detalicznego/lekkich zastosowań
- Jeśli zawodzi: Najpierw sprawdź zanieczyszczenie soczewki

**SE4750 (MC33/MC34/MC93):**
- Opcje standardowego i średniego zasięgu
- Zasięg pracy 30%+ dalej niż poprzednicy
- Obsługuje inteligentne obrazowanie PRZM
- Zasięg SR: do 92 cm
- Zasięg MR: do 6 m

**SE4850 (MC93/MC94/konfiguracje TC8000):**
- Rozszerzony zasięg: Od kontaktu do 21,3 m
- Idealny do środowisk magazynowych/przemysłowych
- Jeśli nie czyta z odległości: Sprawdź uszkodzoną soczewkę lub awarię silnika skanera

### Nie można skanować niektórych typów kodów kreskowych
**Pytania klientów:**
- "Nie czyta kodów 2D"
- "Kody QR się nie skanują"
- "Niektóre kody się skanują, inne nie"
- "Urządzenie nie skanuje kodów Data Matrix"

**Szczegóły techniczne:**
- Sprawdź czy typ kodu jest włączony w profilu DataWedge
- Imagery (SE47xx, SE48xx) czytają zarówno kody 1D jak i 2D
- Skanery laserowe (SE965) czytają tylko kody 1D
- Sprawdź jakość kodu kreskowego - uszkodzony/słaby druk może się nie dekodować
- Upewnij się, że prawidłowa symbologia jest włączona: DataWedge > Profil > Wejście skanera > Dekodery
- Popularne symbologie: Code 128, Code 39, EAN-13, UPC-A, QR Code, Data Matrix

### Zarysowania okienka skanera
**Pytania klientów:**
- "Zarysowania wpływają na wydajność skanowania"
- "Czy można wymienić okienko skanera?"
- "Okienko skanera jest uszkodzone"

**Szczegóły techniczne:**
- Zarysowania powierzchniowe mogą pogorszyć wydajność skanowania
- Głębokie zarysowania wymagają wymiany okienka (naprawa serwisowa)
- Używaj folii ochronnej zaprojektowanej dla okienka skanera
- Regularnie czyść, aby zapobiec zarysowaniom od zanieczyszczeń
- Szkło Corning Gorilla Glass chroni okienko skanera w większości modeli

### Problemy z przyciskiem spustu
**Pytania klientów:**
- "Przycisk spustu się zablokował"
- "Spust nie reaguje"
- "Przerywana aktywacja spustu"
- "Spust jest luźny/zepsuty"

**Szczegóły techniczne:**
- Sprawdź czy wokół mechanizmu spustu nie ma zanieczyszczeń
- MC33/MC34 konfiguracja pistoletowa: Mechaniczne zużycie spustu częste (oceniane na 3 miliony naciśnięć)
- Jeśli przycisk jest fizycznie zablokowany, wymaga naprawy sprzętowej
- Przetestuj z bocznymi przyciskami skanowania, aby sprawdzić czy silnik skanera działa
- Przepisz skanowanie do innego przycisku: Ustawienia > Ustawienia przycisków

---

## 1.4 Problemy z ładowaniem

### Stacja dokująca nie ładuje
**Pytania klientów:**
- "Urządzenie nie ładuje się w stacji"
- "LED stacji nie świeci"
- "Stacja wielostanowiskowa nie rozpoznaje urządzeń"

**Szczegóły techniczne:**
- Sprawdź czy stacja ma zasilanie (sprawdź wskaźniki LED)
- Sprawdź połączenia zasilania: Gniazdko > Zasilacz > Kabel DC > Stacja
- Wyczyść styki stacji alkoholem, wykonując ruchy tam-z powrotem
- Delikatnie dociśnij urządzenie, aby zapewnić prawidłowy kontakt
- Przetestuj z innym gniazdem stacji
- MC93/MC94 ShareCradle wymaga specyficznego zasilacza (PWR-BGA12V108W0WW)

### Uszkodzony port USB
**Pytania klientów:**
- "Port USB-C uszkodzony/luźny"
- "Kabel ładowania nie trzyma się"
- "Port jest fizycznie zepsuty"
- "USB-C nie jest rozpoznawany"

**Szczegóły techniczne:**
- Sprawdź czy piny w złączu USB-C nie są wygięte/złamane
- Sprawdź czy w porcie nie ma zanieczyszczeń - wyczyść sprężonym powietrzem
- Luźne połączenia wskazują na zużycie - używaj zamiast tego ładowania przez stację
- Wymiana portu wymaga profesjonalnej naprawy
- Nie używaj metalowych przedmiotów do czyszczenia portu

### Przegrzewanie się portu ładowania
**Pytania klientów:**
- "Port USB-C bardzo się nagrzewa"
- "Urządzenie gorące podczas ładowania"
- "Ładowanie zatrzymuje się z powodu temperatury"

**Szczegóły techniczne:**
- **Przyczyny:**
  - Utlenione styki zwiększające opór
  - Niezgodność protokołów (QC 3.0 vs PD 3.0)
- **Rozwiązania:**
  - Wyczyść port wykałaczką/sprężonym powietrzem
  - Używaj ładowarki kompatybilnej z PD 3.0
  - Pozwól urządzeniu ostygnąć przed wznowieniem ładowania
- Urządzenie może naprzemiennie włączać/wyłączać ładowanie przy ~37°C, aby zarządzać temperaturą

### Wolne ładowanie
**Pytania klientów:**
- "Urządzenie ładuje się wieczność"
- "Ładowanie znacznie wolniejsze niż zwykle"

**Szczegóły techniczne:**
- Bateria standardowa: Od pustej do 90% w ~3 godziny (TC21/TC22)
- Bateria rozszerzona: Od pustej do 90% w ~4 godziny
- Ładuj w temperaturach 5°C-40°C dla optymalnych wyników
- Ładuj w trybie uśpienia dla najszybszego ładowania
- Używaj tylko zatwierdzonych przez Zebra ładowarek i kabli
- Sprawdź czy kable/zasilacze nie są uszkodzone

### Problemy z pinami pogo
**Pytania klientów:**
- "Piny pogo nie stykają się"
- "Piny stacji uszkodzone lub brudne"
- "Urządzenie nie łączy się z akcesoriami"

**Szczegóły techniczne:**
- Wyczyść piny pogo na spodzie urządzenia alkoholem izopropylowym
- Sprawdź piny pogo stacji pod kątem uszkodzeń/korozji
- Wygięte piny wymagają naprawy/wymiany stacji
- Upewnij się, że piny sprężynują po naciśnięciu

---

## 1.5 Awarie przycisków

### Problemy z przyciskiem zasilania
**Pytania klientów:**
- "Przycisk zasilania nie reaguje"
- "Przycisk zasilania się zablokował"
- "Nie mogę włączyć urządzenia przyciskiem zasilania"

**Szczegóły techniczne:**
- Spróbuj hard reset: Power + Scan + Volume Up przez 4+ sekundy (zależy od modelu)
- TC52/TC57: Power + lewy scan + Volume Up przez 4+ sekundy
- MC93: Sprawdź czy przycisk nie jest fizycznie zablokowany przez zanieczyszczenia
- Jeśli przycisk fizycznie uszkodzony, wymaga naprawy sprzętowej
- Alternatywa: Użyj połączenia USB do wyzwolenia rozruchu

### Problemy z przyciskiem PTT (Push-to-Talk)
**Pytania klientów:**
- "Przycisk PTT nie działa"
- "Przycisk komunikacji głosowej zepsuty"

**Szczegóły techniczne:**
- Sprawdź mapowanie przycisku w Ustawienia > Ustawienia przycisków
- Sprawdź czy aplikacja PTT jest prawidłowo skonfigurowana
- Oczyść obszar wokół przycisku z zanieczyszczeń
- Przetestuj z alternatywną konfiguracją przycisku

### Niedziałające przyciski głośności
**Pytania klientów:**
- "Przyciski głośności nie reagują"
- "Nie mogę regulować głośności przyciskami sprzętowymi"

**Szczegóły techniczne:**
- Przetestuj regulację głośności przez kontrolki na ekranie, aby wyizolować problem sprzętowy
- Sprawdź konfigurację przycisków w ustawieniach
- Fizyczne uszkodzenie przycisku wymaga naprawy
- Oczyść obszar wokół przycisków sprężonym powietrzem

### Programowalne przyciski boczne
**Pytania klientów:**
- "Przyciski boczne nie robią tego, co powinny"
- "Jak przeprogramować przyciski?"

**Szczegóły techniczne:**
- Konfiguruj przez: Ustawienia > Ustawienia przycisków lub DataWedge
- Przyciski można przypisać do różnych funkcji: Wyzwalacz skanowania, PTT, Głośność, Niestandardowe aplikacje
- Zresetuj do domyślnych, jeśli źle skonfigurowane

---

## 1.6 Problemy z głośnikiem/mikrofonem

### Brak dźwięku/Wyciszony dźwięk
**Pytania klientów:**
- "Brak dźwięku z głośnika"
- "Urządzenie nie wydaje dźwięku"
- "Nie słyszę powiadomień"
- "Sygnał skanera nie działa"

**Szczegóły techniczne:**
- Sprawdź czy głośność nie jest wyciszona: Przesuń w dół, sprawdź ikony głośności
- Zwiększ głośność systemową przez przyciski sprzętowe lub ustawienia
- Sprawdź czy głośność multimediów nie jest ustawiona na zero
- Sprawdź czy dźwięk nie jest kierowany do urządzenia Bluetooth
- Zrestartuj urządzenie, aby zresetować system audio
- Jeśli brak dźwięku z jakiegokolwiek źródła, głośnik może być uszkodzony
- Sprawdź czy tryb Nie przeszkadzać nie blokuje dźwięków

### Zniekształcony dźwięk
**Pytania klientów:**
- "Dźwięk jest zniekształcony/zgarniany"
- "Głośnik brzmi jak przepalony"

**Szczegóły techniczne:**
- Wyczyść kratkę głośnika, aby usunąć zanieczyszczenia
- Zmniejsz głośność - wysoka głośność może powodować zniekształcenia
- Jeśli zniekształcenie przy wszystkich poziomach głośności, głośnik może być uszkodzony
- Zalanie wodą może powodować problemy z głośnikiem

### Mikrofon nie rejestruje głosu
**Pytania klientów:**
- "Inni nie słyszą mnie podczas rozmów"
- "Polecenia głosowe nie działają"
- "Mikrofon nie nagrywa"

**Szczegóły techniczne:**
- Sprawdź uprawnienia mikrofonu dla aplikacji
- Oczyść otwór mikrofonu (mały otwór w pobliżu głośnika)
- Inna aplikacja może kontrolować mikrofon - zamknij inne aplikacje
- TC77 specyficznie: Luźna taśma mikrofonu - wymaga śrubokręta T5 do ponownego osadzenia
- Jeśli całkowita awaria mikrofonu, potrzebna naprawa sprzętowa

---

## 1.7 Problemy z kamerą

### Rozmyte zdjęcia
**Pytania klientów:**
- "Kamera robi rozmyte zdjęcia"
- "Zdjęcia nie są ostre"

**Szczegóły techniczne:**
- Wyczyść obiektyw kamery ściereczką z mikrofibry
- Sprawdź czy na osłonie obiektywu nie ma zarysowań
- Zapewnij odpowiednie oświetlenie
- Włącz stabilizację obrazu: Ustawienia kamery > Stabilizacja obrazu > Wł.
- Trzymaj urządzenie stabilnie podczas robienia zdjęć

### Awarie aplikacji kamery
**Pytania klientów:**
- "Aplikacja kamery nieoczekiwanie się zamyka"
- "Kamera wymusza zamknięcie po otwarciu"

**Szczegóły techniczne:**
- Wyczyść pamięć podręczną aplikacji kamery: Ustawienia > Aplikacje > Kamera > Wyczyść pamięć podręczną
- Wyczyść dane aplikacji kamery (może zresetować ustawienia)
- Wymuś zatrzymanie aplikacji kamery, potem otwórz ponownie
- Zrestartuj urządzenie
- Sprawdź aktualizacje firmware

### Latarka nie działa
**Pytania klientów:**
- "Latarka nie chce się włączyć"
- "Lampa LED nie działa dla kamery"

**Szczegóły techniczne:**
- Niski poziom baterii może wyłączyć lampę (naładuj powyżej 50%)
- Sprawdź czy inna aplikacja nie używa lampy
- Przełącz latarkę w Szybkich ustawieniach
- Wyczyść pamięć podręczną i dane kamery
- Jeśli awaria sprzętowa, LED lampy może wymagać wymiany

---

## 1.8 Uszkodzenia fizyczne

### Pęknięcia obudowy
**Pytania klientów:**
- "Obudowa jest pęknięta"
- "Zewnętrzna część urządzenia uszkodzona"
- "Czy pęknięta obudowa wpłynie na wodoodporność?"

**Szczegóły techniczne:**
- Pęknięta obudowa może naruszyć klasę IP
- Pęknięcia powierzchniowe mogą nie wpływać na funkcję, ale zmniejszają trwałość
- Głębokie pęknięcia w pobliżu portów/uszczelek powinny być naprawione
- TC8000: Oceniany na upadki z 2,4 m na beton
- MC93: Upadki z 3 m na beton, 6000 obrotów bębna

### Ocena uszkodzeń po upadku
**Pytania klientów:**
- "Urządzenie spadło, co powinienem sprawdzić?"
- "Jak się dowiedzieć, czy upadek spowodował wewnętrzne uszkodzenia?"

**Lista kontrolna po upadku:**
1. Sprawdź ekran pod kątem pęknięć lub problemów z wyświetlaniem
2. Przetestuj wszystkie przyciski
3. Zweryfikuj funkcjonalność skanera
4. Sprawdź osadzenie baterii
5. Przetestuj wszystkie porty
6. Zweryfikuj kalibrację ekranu dotykowego
7. Przetestuj kamerę/latarkę
8. Sprawdź czy nie słychać grzechotania (uszkodzenie wewnętrznych komponentów)
9. Zweryfikuj łączność WiFi/Bluetooth

---

## 1.9 Antena/Sprzęt łączności

### Objawy uszkodzenia anteny WiFi
**Pytania klientów:**
- "Sygnał WiFi bardzo słaby"
- "Nie mogę połączyć się z sieciami"
- "WiFi pokazuje się jako wyłączone"
- "Częste rozłączenia"

**Szczegóły techniczne:**
- Słaby sygnał na krótkich dystansach wskazuje na uszkodzenie anteny
- Problem TC51: WiFi wyświetlane jako "Wyłączone" bez pokazywanych sieci = prawdopodobnie awaria sprzętowa
- TC8000: Domyślnie używa tylko kanałów 36, 40, 44, 48 na 5GHz
- Urządzenia Zebra mogą nie mieć włączonych kanałów UNII-2
- **Rozwiązywanie problemów:**
  - Włącz zaawansowane logowanie WiFi
  - Spróbuj zarówno sieci 2,4GHz jak i 5GHz
  - Zaktualizuj firmware
  - Wyłącz 802.11r/k/v na problematycznych SSID

### Problemy z anteną komórkową (modele WAN: TC26, TC27)
**Pytania klientów:**
- "Brak sygnału komórkowego"
- "Połączenie danych ciągle się zrywa"
- "SIM nie wykryty"

**Szczegóły techniczne:**
- Sprawdź czy SIM jest prawidłowo zainstalowany i aktywowany
- Sprawdź ustawienia APN dla operatora
- TC26/TC27: Obsługuje 4G/5G w zależności od modelu
- Uszkodzenie anteny zmniejsza siłę sygnału
- Może wymagać aktywacji eSIM dla niektórych modeli

---

# SEKCJA 2: PROBLEMY Z OPROGRAMOWANIEM/KONFIGURACJĄ

## 2.1 Konfiguracja DataWedge

### Czym jest DataWedge?
**Pytania klientów:**
- "Czym jest DataWedge?"
- "Jak skonfigurować skanowanie dla mojej aplikacji?"
- "Dlaczego zeskanowane dane nie trafiają do mojej aplikacji?"

**Szczegóły techniczne:**
DataWedge to preinstalowana usługa przechwytywania danych Zebra, która umożliwia dowolnej aplikacji pozyskiwanie danych z kodów kreskowych bez programowania. Kluczowe komponenty:
- **Wtyczki wejścia**: Skaner kodów kreskowych, kamera, skaner Bluetooth
- **Wtyczki przetwarzania**: Podstawowe/Zaawansowane formatowanie danych
- **Wtyczki wyjścia**: Keystroke (klawiatura), Intent, IP (TCP/UDP)

### Tworzenie i zarządzanie profilami
**Pytania klientów:**
- "Jak utworzyć nowy profil DataWedge?"
- "Moja aplikacja nie używa prawidłowego profilu DataWedge"
- "Czym jest Profile0?"

**Szczegóły techniczne:**
1. Otwórz aplikację DataWedge
2. Dotknij menu hamburger → "Nowy profil"
3. Wprowadź nazwę profilu i dotknij OK
4. W "Powiązane aplikacje" → "Nowa aplikacja/aktywność"
5. Wybierz nazwę pakietu docelowej aplikacji
6. Włącz pożądane wejście i wyjście
7. Upewnij się, że "Profil włączony" jest zaznaczone

**Profile0**: Domyślny profil stosowany do aplikacji niepowiązanych z konkretnym profilem.

### Konfiguracja symbologii/dekoderów
**Pytania klientów:**
- "Jak włączyć/wyłączyć określone typy kodów kreskowych?"
- "Dlaczego moje urządzenie nie skanuje kodów QR?"
- "Jak włączyć skanowanie Data Matrix?"

**Szczegóły techniczne:**
1. Otwórz profil → Wejście kodów kreskowych → Dekodery
2. Zaznacz/odznacz pożądane symbologie
3. Popularne symbologie: Code 128, Code 39, EAN-13, UPC-A, QR Code, Data Matrix
4. **Najlepsza praktyka**: Wyłącz nieużywane dekodery, aby poprawić szybkość skanowania

### Konfiguracja wyjścia
**Pytania klientów:**
- "Jak sprawić, żeby zeskanowane dane pojawiały się w polu tekstowym?"
- "Jak wysłać dane skanowania do mojej niestandardowej aplikacji?"
- "Jak dodać prefiks lub sufiks do zeskanowanych danych?"

**Wyjście Keystroke:**
- Dane pojawiają się automatycznie w polach tekstowych
- Skonfiguruj opóźnienie między znakami dla wolnych aplikacji

**Wyjście Intent:**
- Dla niestandardowych aplikacji, które programowo odbierają dane skanowania
- Skonfiguruj: Akcja Intent, Kategoria Intent, Metoda dostarczania Intent

**Podstawowe formatowanie danych:**
- Dodaj prefiks/sufiks do danych
- Wyślij TAB lub ENTER po skanowaniu
- Konwertuj na szesnastkowy

### Rozwiązywanie problemów z DataWedge
**Pytania klientów:**
- "DataWedge nie wysyła danych do mojej aplikacji"
- "Skaner nie działa z określonymi aplikacjami"
- "DataWedge wyłączony/nie działa"

**Rozwiązania:**
1. Sprawdź czy profil jest włączony i powiązany z aplikacją
2. Sprawdź czy DataWedge jest globalnie włączony (Ustawienia → DataWedge włączony)
3. Sprawdź czy metoda wyjścia jest włączona (Keystroke/Intent)
4. Sprawdź czy aplikacja nie jest na "Liście wyłączonych aplikacji"
5. Dla Intent: sprawdź czy string akcji pasuje do filtra intent aplikacji
6. Przywróć DataWedge do domyślnych: Menu → Ustawienia → Przywróć

### Import/Eksport profili DataWedge
**Pytania klientów:**
- "Jak zrobić kopię zapasową profili DataWedge?"
- "Jak przenieść ustawienia DataWedge na inne urządzenie?"

**Eksport:**
1. Otwórz DataWedge → Menu → Ustawienia
2. Dotknij "Eksport" (eksportuje całą konfigurację jako datawedge.db)
3. Domyślna ścieżka: /storage/sdcard0/Android/data/com.symbol.datawedge/files/

**Import:**
1. DataWedge → Ustawienia → "Import"
2. Przejdź do pliku .db
3. Ustawienia natychmiast nadpisują istniejącą konfigurację

---

## 2.2 Problemy z systemem Android

### Procedury aktualizacji systemu
**Pytania klientów:**
- "Jak zaktualizować system operacyjny?"
- "Czym jest LifeGuard for Android?"
- "Jak zainstalować aktualizację firmware?"

**Metody aktualizacji:**
1. **LifeGuard OTA**: Włącz automatyczne aktualizacje przez Ustawienia lub system EMM
2. **Karta SD**: Pobierz ZIP z zebra.com/support, skopiuj na kartę SD, zastosuj przez recovery
3. **ADB Sideload**: Podłącz do komputera, `adb sideload [nazwa_pliku].zip`
4. **StageNow**: Twórz profile aktualizacji wdrażane przez kod kreskowy
5. **System EMM**: Wypychaj aktualizacje przez Workspace ONE, SOTI, Intune

### Obsługa wersji Android
| Model | Wersje Android |
|-------|----------------|
| TC21/TC26 | Android 10, 11, 13 |
| TC22/TC27 | Android 13+ |
| MC33 | Android 7.1, 8.1 |
| MC3300x | Android 10, 11, 13 |
| MC93 | Android 8.1, 10, 11, 13 |
| MC94 | Android 13+ |
| MC22 | Android 11, 13 |
| TC8000 | Android 4.4, 5.1, 6.0 |

### GMS vs Non-GMS
**Pytania klientów:**
- "Jaka jest różnica między GMS a non-GMS?"
- "Moje urządzenie nie ma Sklepu Google Play"

**GMS (Google Mobile Services):**
- Zawiera Sklep Google Play, Gmail, Mapy, Chrome
- Obsługuje API Google Play Services
- LifeGuard OTA dostępny tylko dla urządzeń GMS

**Non-GMS (AOSP):**
- Brak preinstalowanych aplikacji Google
- Aplikacje muszą być instalowane ręcznie
- Używane w Chinach i wdrożeniach wrażliwych na prywatność

---

## 2.3 Procedury resetu fabrycznego

### Wszystkie metody resetu
**Pytania klientów:**
- "Jak zresetować urządzenie do ustawień fabrycznych?"
- "Jaka jest różnica między Enterprise Reset a Factory Reset?"
- "Jak zresetować, jeśli urządzenie się nie uruchamia?"

**Metoda 1: Menu ustawień**
1. Ustawienia > System > Opcje resetowania
2. Dotknij "Wymaż wszystkie dane (reset fabryczny)"
3. Potwierdź dwukrotnie

**Metoda 2: Tryb Recovery**
| Model | Kombinacja klawiszy |
|-------|---------------------|
| TC21/TC26, TC22/TC27 | Przytrzymaj przycisk PTT podczas restartu |
| MC22/MC27 | Przytrzymaj przycisk P1 podczas restartu |
| MC3300x | Przytrzymaj spust (pistolet) lub prawy przycisk skanowania |
| MC93/MC94 | Przytrzymaj spust podczas restartu |
| TC8000 | Power + Center Scan + Trigger (4 sek) |

**Enterprise Reset vs Factory Reset:**
- **Enterprise Reset**: Kasuje /data, ZACHOWUJE partycję /enterprise (konfiguracje, certyfikaty)
- **Factory Reset**: Kasuje WSZYSTKIE partycje, przywraca stan fabryczny

### Problemy z FRP (Factory Reset Protection)
**Pytania klientów:**
- "Jestem zablokowany przez FRP"
- "Urządzenie prosi o konto Google po resecie"
- "Jak ominąć blokadę FRP?"

**Szczegóły techniczne:**
- FRP aktywuje się, gdy konto Google było dodane przed resetem
- Wymaga oryginalnych danych uwierzytelniających Google do odblokowania
- **Zapobieganie**: Usuń konto Google PRZED resetem
- **WAŻNE**: NIE MA narzędzia Zebra do obejścia FRP

---

## 2.4 Tryb Recovery

### Jak wejść do trybu Recovery
**Pytania klientów:**
- "Jak wejść do trybu recovery?"
- "Urządzenie pokazuje 'No command' - co robić?"

**Standardowa procedura:**
1. Wyłącz urządzenie całkowicie
2. Naciśnij kombinację klawiszy podczas włączania
3. Trzymaj aż pojawi się menu recovery

**Naprawa błędu "No command":**
1. Naciśnij i przytrzymaj przycisk Power
2. Trzymając Power, dotknij raz Volume Up
3. Puść oba - pojawi się menu recovery

### Opcje menu Recovery
- **Reboot system now**: Normalny restart
- **Apply update from ADB**: Instalacja aktualizacji przez sideload
- **Apply update from SD card**: Instalacja z karty microSD
- **Wipe data/factory reset**: Pełny reset
- **Wipe cache partition**: Wyczyść tylko dane w pamięci podręcznej

---

## 2.5 Problemy z uruchamianiem

### Pętla rozruchowa (Boot Loop)
**Pytania klientów:**
- "Urządzenie ciągle się restartuje"
- "Utknęło w pętli rozruchowej"
- "Urządzenie nie uruchamia się w pełni"

**Rozwiązania (próbuj po kolei):**
1. Poczekaj 10-15 minut (niektóre aktualizacje powodują wydłużony rozruch)
2. Hard reset (Power + Vol Down 10 sek)
3. Uruchom w recovery, wyczyść pamięć podręczną
4. Uruchom w recovery, reset fabryczny
5. Wgraj pełny system z karty SD

### Zatrzymanie na logo
**Pytania klientów:**
- "Urządzenie zatrzymało się na logo Zebra"
- "Nie przechodzi poza logo Android"
- "Uruchamianie trwa wieczność"

**Rozwiązania:**
1. Wymuś wyłączenie (przytrzymaj Power 20 sek)
2. Spróbuj wejść w tryb recovery
3. Podłącz do ładowarki - może to problem z baterią
4. Wyczyść partycję pamięci podręcznej
5. Jeśli zawodzi, wykonaj reset fabryczny

### Urządzenie się nie włącza
**Pytania klientów:**
- "Urządzenie w ogóle się nie włącza"
- "Naciśnięcie przycisku zasilania nic nie daje"

**Rozwiązywanie problemów:**
1. Podłącz do ładowarki, poczekaj 30 minut
2. Spróbuj z inną sprawdzoną baterią
3. Sprawdź wskaźniki LED
4. Hard reset: Power + wszystkie przyciski głośności 30 sekund
5. Spróbuj bez baterii na zasilaniu USB
6. Jeśli brak reakcji: prawdopodobnie awaria sprzętowa

---

## 2.6 Łączność WiFi

### Problemy z połączeniem
**Pytania klientów:**
- "Połączenie WiFi często się zrywa"
- "Nie mogę połączyć się z siecią WiFi"
- "WiFi pokazuje 'Zapisane', ale się nie łączy"
- "Błąd uwierzytelniania"

**Rozwiązania:**
1. Sprawdź prawidłowe hasło
2. Zapomnij sieć i połącz ponownie
3. Sprawdź czy tryb samolotowy jest WYŁĄCZONY
4. Zrestartuj WiFi: Ustawienia → WiFi → Przełącz WYŁ./WŁ.
5. Sprawdź czy sieć nie jest ukryta
6. Sprawdź czy na routerze nie jest włączone filtrowanie MAC
7. Skonfiguruj statyczny IP, jeśli problemy z DHCP

### WiFi korporacyjne (802.1x)
**Pytania klientów:**
- "Jak skonfigurować EAP-TLS?"
- "Uwierzytelnianie WiFi korporacyjnego nie działa"
- "Jak zainstalować certyfikaty WiFi?"

**Konfiguracja EAP-TLS:**
- Wymaga zainstalowanego certyfikatu klienta
- Wymaga certyfikatu CA do walidacji serwera
- Konfiguruj przez StageNow WiFi Manager

**Konfiguracja PEAP:**
- Tryb bezpieczeństwa: Korporacyjny
- Uwierzytelnianie: PEAP-MSCHAPV2
- Wprowadź nazwę użytkownika i hasło
- Certyfikat CA: Opcjonalny, ale zalecany

### Problemy z roamingiem
**Pytania klientów:**
- "Słaby roaming między punktami dostępowymi"
- "WiFi zrywa się podczas chodzenia po magazynie"

**Rozwiązania:**
1. Włącz 802.11k (Neighbor Reports)
2. Włącz 802.11r (Fast Transition)
3. Włącz 802.11v (BSS Transition)
4. Przez Fusion Settings na urządzeniach Zebra
5. Skonfiguruj AP do obsługi 802.11r/k/v

---

## 2.7 Problemy z Bluetooth

### Problemy z parowaniem
**Pytania klientów:**
- "Urządzenie nie chce się sparować z urządzeniem Bluetooth"
- "Parowanie Bluetooth nie działa"
- "Nie mogę znaleźć urządzenia na liście Bluetooth"

**Rozwiązania:**
1. Upewnij się, że urządzenie docelowe jest w trybie parowania/wykrywalnym
2. Sprawdź czy urządzenia są w zasięgu (<10 metrów)
3. Usuń istniejące parowanie i sparuj ponownie
4. Zrestartuj Bluetooth na obu urządzeniach
5. Wyczyść pamięć podręczną Bluetooth: Ustawienia > Aplikacje > Bluetooth > Wyczyść pamięć podręczną

### Parowanie drukarek (serie ZQ, ZD)
**Pytania klientów:**
- "Jak sparować drukarkę Zebra?"
- "Drukarka sparowana, ale nie drukuje"
- "Połączenie Bluetooth z drukarką się zrywa"

**Użycie NFC Tap-to-Pair:**
1. Dotknij urządzeniem logo NFC drukarki
2. Potwierdź kod parowania
3. Dotknij Sparuj

**Parowanie ręczne:**
1. Ustaw drukarkę w trybie parowania (przytrzymaj FEED 5 sekund)
2. Ustawienia > Podłączone urządzenia > Sparuj nowe urządzenie
3. Wybierz drukarkę, potwierdź kod

**Rozwiązywanie problemów z zrywaniem połączenia:**
- Sprawdź czy urządzenia pozostają w zasięgu
- Sprawdź poziom baterii drukarki
- Sprawdź czy nie ma zakłóceń

### Parowanie skanera pierścieniowego (RS5100)
**Pytania klientów:**
- "Jak sparować skaner pierścieniowy RS5100?"
- "Skaner pierścieniowy sparowany, ale nie skanuje"

**NFC Tap-to-Pair:**
1. Włącz NFC i Bluetooth
2. Wyrównaj ikony NFC na skanerze i komputerze mobilnym
3. LED miga na niebiesko podczas łączenia
4. Powiadomienie toast potwierdza parowanie

**Jeśli sparowany, ale nie skanuje:**
- Wyłącz parametr Host Trigger (atrybut #790)
- Sprawdź czy DataWedge jest skonfigurowany dla skanera pierścieniowego
- Spróbuj warm boot po konfiguracji

---

## 2.8 Problemy z siecią komórkową/WAN (TC26, TC27)

### Problemy z kartą SIM
**Pytania klientów:**
- "Karta SIM nie wykryta"
- "Błąd: Brak SIM"
- "Błąd karty SIM"

**Rozwiązania:**
1. Wyłącz urządzenie
2. Wyjmij baterię
3. Sprawdź orientację SIM (styki skierowane w dół)
4. Delikatnie wyczyść styki SIM
5. Sprawdź czy SIM jest aktywny u operatora
6. Spróbuj SIM w innym urządzeniu

### Brak sygnału/Problemy z danymi
**Pytania klientów:**
- "Brak sygnału komórkowego"
- "Dane nie działają mimo sygnału"
- "Tylko połączenia alarmowe"

**Rozwiązania:**
1. Sprawdź czy SIM jest aktywowany
2. Sprawdź zasięg w okolicy
3. Przełącz tryb samolotowy wł./wył.
4. Sprawdź konfigurację APN:
   - Ustawienia > Sieć > Sieć komórkowa > Nazwy punktów dostępu
   - Utwórz nowy APN z ustawieniami operatora
5. Wybierz sieć ręcznie, jeśli potrzeba

---

## 2.9 Rejestracja MDM

### SOTI MobiControl
**Pytania klientów:**
- "Jak zarejestrować urządzenie w SOTI?"
- "Agent SOTI nie komunikuje się"

**Metody rejestracji:**
1. Rejestracja kodem kreskowym StageNow
2. Ręcznie: Pobierz agenta, wprowadź URL serwera
3. Rejestracja kodem QR

### VMware Workspace ONE
**Pytania klientów:**
- "Jak zarejestrować w Workspace ONE?"
- "Rejestracja Hub nie działa"

**Wymagania:**
- Workspace ONE Intelligent Hub wersja 8.2+
- Android 7.1+ z MX 7.1+ dla rejestracji StageNow

### Microsoft Intune
**Pytania klientów:**
- "Jak zarejestrować urządzenie Zebra w Intune?"
- "Company Portal nie działa"

**Metody:**
1. Z Google Play: Pobierz Company Portal, zaloguj się
2. Bez Google Play: Użyj StageNow do instalacji i uruchomienia
3. Android Enterprise: Rejestracja kodem QR lub zero-touch

### Rozwiązywanie problemów MDM
**Pytania klientów:**
- "Polityki nie są stosowane"
- "Blokada MDM po resecie fabrycznym"
- "Urządzenie nie chce się zarejestrować"

**Rozwiązania:**
- Sprawdź łączność z internetem
- Wymuś synchronizację w agencie MDM
- Sprawdź czy urządzenie jest w prawidłowej grupie
- Dla zero-touch: Urządzenie automatycznie re-rejestruje się po resecie fabrycznym
- Sprawdź czy konto Google nie powoduje blokady FRP

---

## 2.10 Konfiguracja StageNow

### Czym jest StageNow?
**Pytania klientów:**
- "Czym jest StageNow?"
- "Jak utworzyć kody kreskowe staging?"

**Szczegóły techniczne:**
StageNow to darmowe narzędzie staging Zebra, które tworzy kody kreskowe konfiguracyjne dla:
- Konfiguracji WiFi
- Instalacji aplikacji
- Aktualizacji systemu
- Rejestracji MDM
- Ustawień urządzenia

### Problemy ze stagingiem
**Pytania klientów:**
- "Urządzenie nie chce skanować kodów StageNow"
- "Staging StageNow nie działa"
- "Błąd: Profil niekompletny"

**Rozwiązania:**
1. Upewnij się, że klient StageNow jest otwarty na urządzeniu
2. Sprawdź czy profil DataWedge dla StageNow nie jest uszkodzony
3. Sprawdź kompatybilność wersji MX (MX profilu ≤ MX urządzenia)
4. Sprawdź jakość kodu kreskowego (nie za mały)
5. Dla wyświetlaczy LCD: Włącz tryb LCD na skanerze
6. Przejrzyj log staging pod kątem konkretnych błędów

---

## 2.11 Problemy z pamięcią

### Pełna pamięć wewnętrzna
**Pytania klientów:**
- "Kończy się miejsce na dane"
- "Nie mogę zainstalować aplikacji przez brak pamięci"
- "Jak zwolnić miejsce?"

**Rozwiązania:**
1. Wyczyść pamięć podręczną aplikacji: Ustawienia > Aplikacje > [Aplikacja] > Wyczyść pamięć podręczną
2. Wyczyść wszystkie dane w pamięci podręcznej: Ustawienia > Pamięć > Dane w pamięci podręcznej
3. Usuń stare pobrane pliki
4. Odinstaluj nieużywane aplikacje
5. Przenieś aplikacje na kartę SD (jeśli obsługiwane)
6. Wyczyść logi DataWedge (mogą się rozrosnąć)

### Problemy z kartą SD
**Pytania klientów:**
- "Karta SD nie rozpoznana"
- "Formatowanie karty SD nie powiodło się"
- "Uszkodzenie danych na karcie SD"

**Rozwiązania:**
1. Wyjmij i włóż kartę ponownie
2. Spróbuj z inną kartą
3. Sprawdź kompatybilność (32GB = FAT32, 64GB+ = exFAT)
4. Wyczyść slot sprężonym powietrzem
5. Najpierw sformatuj kartę na komputerze
6. Używaj kart SD klasy przemysłowej dla niezawodności

---

# SEKCJA 3: KODY BŁĘDÓW I KOMUNIKATY

## 3.1 Kody błędów DataWedge

| Kod błędu | Znaczenie | Rozwiązanie |
|-----------|-----------|-------------|
| APP_ALREADY_ASSOCIATED | Aplikacja powiązana z innym profilem | Najpierw usuń powiązanie z istniejącego profilu |
| DATAWEDGE_DISABLED | DataWedge jest wyłączony | Włącz DataWedge w ustawieniach |
| INPUT_NOT_ENABLED | Wtyczka kodów kreskowych wyłączona | Włącz wejście skanera w profilu |
| PROFILE_NOT_FOUND | Profil nie istnieje | Utwórz profil lub sprawdź nazwę |
| SCANNER_ALREADY_DISABLED | Skaner już wyłączony | Sprawdź status przed poleceniem |
| SCANNER_ENABLE_FAILED | Błąd włączania skanera | Zrestartuj DataWedge; zrestartuj urządzenie |
| SCANNER_IN_USE | Inna aplikacja używa skanera | Zamknij konfliktującą aplikację |

## 3.2 Wskaźniki LED ładowania

| Stan LED | Znaczenie | Działanie |
|----------|-----------|-----------|
| Wyłączony | Nie ładuje/brak zasilania | Sprawdź połączenie zasilania |
| Stały bursztynowy | Ładowanie w toku | Normalne - czekaj |
| Stały zielony | Ładowanie zakończone | Gotowe do użycia |
| Migający czerwony (szybko) | Błąd ładowania | Sprawdź temperaturę, włóż urządzenie ponownie |
| Migający czerwony (wolno, 4 sek) | Koniec żywotności baterii | Wymień baterię |
| Naprzemienny czerwony/bursztynowy | Temperatura poza zakresem | Przenieś do normalnego środowiska temperaturowego |

## 3.3 Komunikaty błędów rozruchu

| Błąd | Znaczenie | Rozwiązanie |
|------|-----------|-------------|
| "No command" | Tryb recovery czeka | Przytrzymaj Power, dotknij Volume Up |
| "System UI has stopped" | Proces UI się zawiesił | Zrestartuj; wyczyść pamięć podręczną System UI |
| "Android is starting" (pętla) | Rozruch nie powiódł się | Wyczyść pamięć podręczną; reset fabryczny |
| "Optimizing apps" (zawieszone) | Optymalizacja DEX zamrożona | Poczekaj 30 min; reset fabryczny |
| Błąd dm-verity | Weryfikacja systemu nie powiodła się | Wgraj oficjalny firmware |

## 3.4 Komunikaty błędów WiFi

| Błąd | Znaczenie | Rozwiązanie |
|------|-----------|-------------|
| "Błąd uwierzytelniania" | Złe hasło/zabezpieczenia | Sprawdź dane uwierzytelniające |
| "Uzyskiwanie adresu IP" (zawieszone) | Problem z DHCP | Sprawdź serwer DHCP; spróbuj statyczny IP |
| "Połączono, brak internetu" | WiFi działa, brak WAN | Sprawdź ustawienia proxy/DNS |
| "Zapisane" (nie łączy się) | Połączenie wielokrotnie nieudane | Zapomnij i połącz ponownie |
| Błędy certyfikatów | Nieprawidłowy/brakujący certyfikat | Zainstaluj prawidłowe certyfikaty |

## 3.5 Komunikaty błędów sieci komórkowej (modele WAN)

| Błąd | Znaczenie | Rozwiązanie |
|------|-----------|-------------|
| "Brak usługi" | Nie wykryto sieci | Sprawdź SIM; sprawdź zasięg |
| "Tylko połączenia alarmowe" | Sieć niedostępna | Sprawdź aktywację SIM |
| "Błąd karty SIM" | SIM nie wykryty | Włóż SIM ponownie; wyczyść styki |
| "SIM nie provisionowany" | SIM nie aktywowany | Skontaktuj się z operatorem |

---

# SEKCJA 4: PROBLEMY SPECYFICZNE DLA MODELI

## 4.1 TC21/TC22 (tylko Wi-Fi)

### Kluczowe różnice
| Funkcja | TC21 | TC22 |
|---------|------|------|
| Wyświetlacz | 5" HD | 6" FHD+ |
| Wi-Fi | Wi-Fi 5 | Wi-Fi 6E |
| Status | **EOL** lut 2025 | Aktualny |

### Typowe problemy TC21/TC22
- **LED baterii miga wolno na czerwono (4 sek)** = Koniec żywotności, wymień baterię
- **Rozładowywanie baterii**: Zmniejsz jasność, zamknij nieużywane aplikacje
- **Kalibracja skanera**: DataWedge > Profil > Narzędzie kalibracji
- Standardowa bateria ~10 godzin pracy

### Akcesoria TC21/TC22
- Akcesoria NIE są kompatybilne między TC21 i TC22 (zmienił się format)
- Dostępne stacje 1-stanowiskowe i 5-stanowiskowe
- Ochronna osłona umożliwia ochronę przy upadku z 1,5 m

---

## 4.2 TC26/TC27 (Wi-Fi + sieć komórkowa)

### Kluczowe różnice
| Funkcja | TC26 | TC27 |
|---------|------|------|
| Sieć komórkowa | 4G LTE | 5G + 4G |
| Status | **EOL** lut 2025 | Aktualny |

### Problemy specyficzne dla sieci komórkowej
- **Instalacja SIM**: Pod baterią, sprawdź orientację
- **Konfiguracja APN**: Wymagana dla połączenia danych
- **VoLTE**: Zapewnia najlepszą jakość głosu
- **Rozładowywanie baterii przez sieć komórkową**: Używaj rozszerzonej baterii dla modeli WAN
- **Problemy GPS**: Wymaga czystego nieba dla początkowego namierzenia

---

## 4.3 MC33/MC34 (uchwyt pistoletowy vs prosty)

### Typy konfiguracji
1. **Konfiguracja pistoletowa**: Uchwyt pistoletowy ze spustem
2. **Straight Shooter**: Styl prostokątny z bocznymi przyciskami

### Typowe problemy MC33/MC34
- **Zużycie spustu**: Oceniany na 3 miliony naciśnięć, może wymagać wymiany
- **Wymiana paska ręki pistoletu**: Numer części SG-MC33-HDSTPG-01
- **Opcje skanera**: SE4750 (standardowy), SE4850 (rozszerzony zasięg)
- **Problemy z klawiaturą**: Funkcje alternatywne oznaczone kolorami (niebieski/pomarańczowy)

### Kompatybilność baterii
- Baterie MC34 kompatybilne z MC3300/MC3300ax
- Starsze baterie MC33 działają z MC34 z obniżoną ochroną IP

---

## 4.4 MC93/MC94 (skaner rozszerzonego zasięgu)

### Kluczowe różnice
| Funkcja | MC93 | MC94 |
|---------|------|------|
| Skaner | SE4850 (21 m) | SE58 (30+ m) |
| Odporność na upadek | 2,4 m | 3,6 m |
| Status | **EOL** marzec 2025 | Aktualny |

### Problemy z rozszerzonym zasięgiem
- **SE4850**: Zasięg od 8 cm do 21 m
- **SE58**: Zasięg od kontaktu do 30+ m
- **Celowanie**: SE58 używa zielonego lasera (7x bardziej widoczny)
- **Skanowanie na odległość**: Jakość druku kodu kreskowego krytyczna przy dużych odległościach

### Akcesoria MC93/MC94
- MC9400 w pełni wstecznie kompatybilny ze WSZYSTKIMI akcesoriami MC9300
- Model mroźniczy ma podgrzewane okienko skanera
- Pasek na rękę NIE jest dołączony do MC9400 (sprzedawany osobno)

---

## 4.5 MC22 (kompaktowy komputer mobilny)

### Kluczowe specyfikacje
- Wyświetlacz 4" WVGA
- Wewnętrzny imager SE4100
- Klawiatura 34-klawiszowa
- Ochrona IP65, upadki z 1,5 m

### MC22 vs MC33/MC34
- Bardziej kompaktowy format
- Lżejsze skanowanie (SE4100 vs SE4750)
- Niższa specyfikacja wytrzymałości
- Odpowiedni dla MŚP/lekkiego przemysłu

---

## 4.6 TC8000/TC8300 (unikalny format)

### Unikalna konstrukcja
- Ekran skierowany do użytkownika podczas skanowania (bez przechylania)
- 14% wzrost produktywności vs tradycyjne formaty
- 33% lżejszy niż tradycyjne urządzenia pistoletowe

### Problemy TC8000/TC8300
- **Skanowanie bez użycia rąk**: Czujnik zbliżeniowy wyzwala w kaburze/uchwycie
- **Dwa tryby skanowania**: Zbliżeniowy (15 cm) i średni (60 cm)
- **Pasek na rękę**: NIE jest dołączony do TC8300 (sprzedawany osobno)
- **Hard reset**: Power + Trigger + PTT (5 sekund)

### Status
- TC8000: **EOL** kwiecień 2021, wsparcie kończy się czerwiec 2026
- TC8300: Aktualna generacja

---

# SEKCJA 5: AKCESORIA I PERYFERIA

## 5.1 Stacje dokujące

### Rozwiązywanie problemów ze stacjami
**Pytania klientów:**
- "Urządzenie nie ładuje się w stacji"
- "LED stacji nie świeci"
- "Problemy ze stacją wielostanowiskową"

**Rozwiązania:**
1. Sprawdź czy stacja jest podłączona do zasilania
2. Wyczyść styki alkoholem izopropylowym
3. Upewnij się, że urządzenie jest prawidłowo osadzone
4. Przetestuj inny slot
5. Spróbuj z innym zasilaczem

### Konfiguracja stacji Ethernet
- Konfiguruj: Ustawienia > Sieć i internet
- Ustaw proxy, jeśli wymagane
- Skonfiguruj statyczny IP, jeśli nie używasz DHCP
- Sprawdź wskaźniki LED Ethernet pod kątem statusu połączenia

---

## 5.2 Uchwyty samochodowe

### Typy uchwytów
- Stacje kompatybilne z RAM Mount
- Uchwyty z szybkim odłączaniem (wymiana w 10 sekund)
- Zestawy montażowe do wózków widłowych
- Opcje zasilane vs niezasilane

### Problemy z zasilaniem w pojazdach
**Pytania klientów:**
- "Urządzenie nie ładuje się w pojeździe"
- "Wibracje powodują rozłączenia"

**Rozwiązania:**
- Sprawdź kompatybilność 12-48V DC
- Sprawdź połączenia bezpieczników
- Użyj podkładek antywibracyjnych
- Prowadź kable, aby zapobiec naprężeniom

---

## 5.3 Peryferia zewnętrzne

### Parowanie skanera pierścieniowego (RS5100)
1. Włącz NFC i Bluetooth
2. Wyrównaj ikony NFC
3. Poczekaj na niebieski LED i sygnał dźwiękowy połączenia
4. Skonfiguruj w DataWedge

### Parowanie drukarek Zebra
1. Włącz Bluetooth na drukarce (przytrzymaj FEED 5 sek)
2. Sparuj przez Ustawienia > Bluetooth
3. Potwierdź kod parowania
4. Skonfiguruj w aplikacji drukowania

### Zestawy słuchawkowe
- **Bluetooth**: BlueParrott, Zebra HS3100
- **Przewodowe**: HDST-USBC-PTT1-01 z przyciskiem PTT
- **Konfiguracja**: Zainstaluj Zebra Communication Central dla PTT

---

## 5.4 Ładowarki baterii

### 4-stanowiskowa ładowarka baterii
**Wskaźniki LED:**
- Migający bursztynowy: Ładowanie
- Stały zielony: Pełne naładowanie
- Wolno migający czerwony: Koniec żywotności

**Czasy ładowania:**
- Standardowa: Mniej niż 3 godziny (0-80%)
- Rozszerzona: Dłuższy czas wymagany

---

# SEKCJA 6: PROCEDURY KONSERWACJI

## 6.1 Procedury czyszczenia

### Ekran i okienko skanera
1. Wyłącz urządzenie
2. Użyj miękkiej ściereczki bez kłaczków
3. Nawilż alkoholem izopropylowym
4. Delikatnie przetrzyj powierzchnię
5. Pozwól całkowicie wyschnąć

### Styki ładowania
1. Odłącz zasilanie od stacji
2. Zanurz bawełniany aplikator w alkoholu izopropylowym
3. Przetrzyj ruchem tam-z powrotem po złączach
4. Usuń pozostałości bawełny
5. Pozwól wyschnąć 10-30 minut

### Zatwierdzone środki czyszczące
- Alkohol izopropylowy (70%+)
- Środki dezynfekujące specyficzne dla urządzenia według przewodnika czyszczenia Zebra
- **Nigdy nie używaj**: Środków ściernych, ostrych chemikaliów, nadmiaru płynów

---

## 6.2 Harmonogramy konserwacji

### Konserwacja codzienna
1. Przetrzyj ekran i obudowę
2. Sprawdź poziom baterii, włóż do ładowarki
3. Sprawdź pod kątem uszkodzeń fizycznych
4. Wyczyść okienko skanera, jeśli potrzeba

### Konserwacja tygodniowa
1. Głębokie czyszczenie wszystkich powierzchni
2. Wyczyść styki ładowania
3. Sprawdź akcesoria pod kątem zużycia
4. Sprawdź stan baterii przez DDT
5. Zweryfikuj działanie wszystkich funkcji

---

## 6.3 Cykl życia baterii

### Sprawdzanie stanu baterii
1. Otwórz Zebra Device Diagnostic Tool
2. Wybierz Test baterii
3. Zobacz: Liczba cykli, pojemność, status wycofania

### Kiedy wymienić baterię
- Liczba cykli przekracza 400
- DDT pokazuje status "Wycofana"
- LED miga wolno na czerwono (4 sek)
- Znaczące skrócenie czasu pracy

### Funkcje PowerPrecision+
- Miernik stanu zdrowia
- Modelowanie elektryczne w czasie rzeczywistym
- Śledzenie impedancji
- Porównanie z nową baterią bazową

---

## 6.4 Aktualizacje firmware

### Sprawdzanie aktualnej wersji
Ustawienia > System > Informacje o telefonie > Komponenty SW

### Metody aktualizacji
1. **LifeGuard OTA**: Przez EMM/MDM
2. **Karta SD**: Pobierz ZIP, zastosuj przez recovery
3. **ADB Sideload**: `adb sideload [nazwa_pliku].zip`
4. **OEMConfig**: Przez MDM dla MX 9.1+

### Rozwiązywanie problemów z aktualizacją
- Upewnij się, że bateria >50%
- Sprawdź integralność pliku
- Sprawdź kompatybilność SPL
- Spróbuj innej metody aktualizacji

---

## 6.5 Narzędzia diagnostyczne

### Testy Device Diagnostic Tool (DDT)
- **Audio**: Test mikrofonu i głośnika
- **Bateria**: Pojemność, cykle, status zdrowia
- **Bluetooth**: Test cyklu zasilania radia
- **Przyciski**: PTT, spusty, przyciski głośności
- **Skaner**: Weryfikacja skanowania kodów kreskowych
- **WiFi**: Test połączenia i radia
- **Ekran dotykowy**: Weryfikacja dotyku na siatce

### Uruchamianie DDT
1. Uruchom aplikację Device Diagnostic Tool
2. Dotknij "Uruchom testy" dla wszystkich testów
3. Lub dotknij poszczególnych kategorii testów
4. Zielony = Przeszedł, Czerwony = Nie przeszedł

---

# SEKCJA 7: SERWIS I GWARANCJA

## 7.1 Zakres gwarancji

### Co jest objęte
- Wady sprzętowe w materiałach i wykonaniu
- Wady produkcyjne
- Awarie komponentów przy normalnym użytkowaniu

### Co NIE jest objęte
- Normalne zużycie
- Uszkodzenia przypadkowe (upadki, zalanie)
- Uszkodzenia fizyczne z niewłaściwego użytkowania
- Nieautoryzowane naprawy
- Problemy z oprogramowaniem

### Okres gwarancji
- **Komputery mobilne**: 12 miesięcy od wysyłki
- **Baterie**: 12 miesięcy od daty produkcji
- **Akcesoria z numerem seryjnym**: 90 dni
- **Wsparcie techniczne**: 90 dni (standardowe)

### Sprawdzanie statusu gwarancji
- Narzędzie sprawdzania gwarancji Zebra: https://supportcommunity.zebra.com/s/warrantycheck
- Wprowadź numer seryjny urządzenia

---

## 7.2 Umowy serwisowe Zebra OneCare

### OneCare SV (Special Value)
- Naprawa w 5 dni roboczych
- 2 lata wsparcia technicznego
- Pokrycie wad producenta
- Aktualizacje bezpieczeństwa LifeGuard
- Najbardziej ekonomiczna opcja

### OneCare Essential
- Naprawa w 3 dni robocze
- Wsparcie telefoniczne 8x5
- Kompleksowe pokrycie (uszkodzenia przypadkowe, zużycie)
- Wymiana urządzenia, jeśli naprawa nieekonomiczna

### OneCare Select
- Wsparcie telefoniczne 24/7 w 17 językach
- Wymiana następnego dnia roboczego
- Program wymiany z wyprzedzeniem
- Konfiguracja urządzenia w zestawie

---

## 7.3 Proces naprawy

### Zgłaszanie naprawy
1. Zarejestruj się na portalu Zebra Repair Order
2. Wprowadź numer seryjny urządzenia
3. Opisz problem (max 200 znaków)
4. Wyślij i otrzymaj numer RMA
5. Wyślij urządzenie z dokumentacją RMA

### Przed wysłaniem urządzenia
**USUŃ:**
- Karty SIM
- Karty SD
- Baterie
- Wszystkie akcesoria

**ZRÓB KOPIĘ ZAPASOWĄ:**
- Wszystkich danych i ustawień
- Urządzenie zostanie zresetowane do ustawień fabrycznych

### Czasy realizacji napraw
- **OneCare SV**: 5 dni roboczych
- **OneCare Essential**: 3 dni robocze
- **OneCare Select**: Następny dzień roboczy / wymiana z wyprzedzeniem

---

## 7.4 Typowe koszty napraw

### Naprawy za incydent
- Obejmują opłatę za usługi diagnostyczne Tier 1
- Wycena podana podczas zgłoszenia
- Ostateczny koszt może się zmienić po inspekcji

### Decyzja o kosztach
- Jeśli naprawa >50% kosztu nowego urządzenia, rozważ wymianę
- OneCare: Naprawa nieekonomiczna = zapewniona wymiana
- GO Zebra Trade-In: Rabaty do 650$ za urządzenie

---

## 7.5 Po naprawie

### Wymagana konfiguracja urządzenia
- Ukończ Kreator konfiguracji Android
- Zainstaluj aplikacje
- Skonfiguruj ustawienia sieci
- Ponownie zarejestruj w MDM
- Przywróć ustawienia specyficzne dla lokalizacji

### Gwarancja na naprawę
- Pozostała część oryginalnej gwarancji LUB 90 dni (cokolwiek dłuższe)
- 30-dniowa gwarancja na powtórną naprawę tego samego problemu

---

## 7.6 Rozwiązywanie problemów przed naprawą

### Spróbuj najpierw tego
1. Uruchom Device Diagnostic Tool
2. Wykonaj soft reset (Power > Restart)
3. Wykonaj hard reset, jeśli urządzenie nie reaguje
4. Sprawdź/wymień baterię
5. Zaktualizuj firmware
6. Enterprise Reset (zachowuje ustawienia korporacyjne)
7. Factory Reset (ostateczność)

### Określanie czy potrzebna naprawa
- **DDT zielone wyniki**: Może nie wymagać naprawy
- **DDT czerwone wyniki**: Prawdopodobnie wymaga naprawy
- Wiele problemów to problemy z oprogramowaniem/konfiguracją

---

## 7.7 Informacje kontaktowe

### Kanały wsparcia
- **Portal napraw**: Zgłaszanie 24/7
- **Telefon**: Regionalne numery na zebra.com
- **Email (EMEA)**: contact.emea@zebra.com
- **Czat**: Dostępny w godzinach pracy

### Godziny wsparcia
- **OneCare Select**: 24/7
- **OneCare Essential**: 8x5 godziny pracy
- **Standardowe**: Godziny pracy

### Zasoby online
- **TechDocs**: techdocs.zebra.com
- **Support Community**: Baza wiedzy, fora
- **Przewodnik Device Diagnostic Tool**

---

## 7.8 Programy wymiany i odkupu

### GO Zebra Trade-In
- Rabaty 25$-650$ w zależności od modelu
- Akceptuje urządzenia Zebra ORAZ konkurencji
- Stosowany do zakupu nowych urządzeń Zebra

### Device Buy-Back
- Sprzedaj starsze urządzenia z powrotem do Zebra
- Część programu Circular Economy
- Ceny zależne od stanu

### Ścieżki upgrade
- TC21 → TC22
- TC26 → TC27
- MC93 → MC94
- TC8000 → TC8300

---

# SEKCJA 8: TABELE SZYBKIEGO ODNIESIENIA

## Kombinacje Hard Reset

| Model | Hard Reset |
|-------|------------|
| TC21/TC26 | Power + Vol Down 10s |
| TC22/TC27 | Power + Vol Down 10s |
| MC22/MC27 | Power 15s |
| MC3300x | Power + 1 + 9 klawisze 5s |
| MC93/MC94 | Power + 1 + 9 klawisze 5s |
| TC8000/TC8300 | Power + Scan + Trigger 4s |

## Wejście do trybu Recovery

| Model | Wejście do Recovery |
|-------|---------------------|
| TC21/TC26, TC22/TC27 | Power + Vol Down, przytrzymaj PTT |
| MC22/MC27 | Power + Vol Down, przytrzymaj P1 |
| MC3300x | Power + Vol Down, przytrzymaj trigger |
| MC93/MC94 | Power + Vol Down, przytrzymaj trigger |
| TC8000 | Power + Vol Down |

## Status wycofania z produkcji (EOL)

| Model | Ostatnia sprzedaż | Koniec wsparcia |
|-------|-------------------|-----------------|
| TC21/TC26 | Lut 2025 | Marzec 2028 |
| MC93 | Marzec 2025 | Czerwiec 2030 |
| TC8000 | Kwiecień 2021 | Czerwiec 2026 |

---

*Ta baza wiedzy została skompilowana z oficjalnej dokumentacji Zebra Technologies dla chatbota obsługi klienta serwiszebra.pl. Informacje aktualne na grudzień 2025.*

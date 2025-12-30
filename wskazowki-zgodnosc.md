# Wskazowki dot. zgodnosci - regulamin i polityka prywatnosci

Uwaga: To nie jest porada prawna. Ponizsze uwagi maja charakter informacyjny.
Zakres: analiza tresci z `app/regulamin/page.tsx` i `app/polityka-prywatnosci/page.tsx`.

## Najwazniejsze ryzyka (od najwiekszych)
- Ograniczenie odpowiedzialnosci tylko do winy umyslnej/razacego niedbalstwa oraz limit do wartosci uslugi - ryzyko klauzul abuzywnych w relacji B2C. `app/regulamin/page.tsx:223`, `app/regulamin/page.tsx:230`
- Wybor sadu wlasciwego dla siedziby przedsiebiorcy - ryzyko klauzuli niedozwolonej w B2C. `app/regulamin/page.tsx:257`
- Ceny tylko netto przy definicji klienta obejmujacej osoby fizyczne - dla konsumentow powinny byc ceny brutto (z VAT). `app/regulamin/page.tsx:145`, `app/regulamin/page.tsx:147`, `app/regulamin/page.tsx:155`, `app/regulamin/page.tsx:165`
- Brak informacji o prawie odstapienia od umowy zawartej na odleglosc (termin, wyjatki, koszty, wzor formularza) - wymagania ustawy o prawach konsumenta. `app/regulamin/page.tsx`
- Utylizacja nieodebranych urzadzen po 30 dniach bez opisanej procedury przechowania i wezwac - ryzyko niezgodnosci z zasadami dot. rzeczy powierzonych. `app/regulamin/page.tsx:231`

## Istotne braki / niescislosci
- Regulamin nie opisuje uslug elektronicznych (konto, panel klienta, chat AI): wymagania techniczne, zakazy tresci bezprawnych, tryb reklamacji e-uslug (UŚUDE). `app/regulamin/page.tsx`
- Brak informacji, ze gwarancja nie wylacza ani nie ogranicza ustawowych uprawnien klienta (istotne w B2C). `app/regulamin/page.tsx:180`
- Sekcja odbiorcow danych i transferow: z jednej strony podmioty typu Vercel/Stripe/Google/OpenAI, z drugiej "brak transferu poza EOG" i odwolanie do "Privacy Shield" (nieobowiazujace). `app/polityka-prywatnosci/page.tsx:205`, `app/polityka-prywatnosci/page.tsx:215`
- Braki informacyjne z art. 13 RODO: prawo do cofniecia zgody, informacja czy podanie danych jest obowiazkowe oraz konsekwencje niepodania, informacja o profilowaniu/automatycznym podejmowaniu decyzji (nawet jesli nie wystepuje). `app/polityka-prywatnosci/page.tsx:243`
- Cookies/analityka: wymagana jest zgoda i mozliwosc jej wycofania; sama informacja o ustawieniach przegladarki jest niewystarczajaca. Warto dodac liste cookies i czasy przechowywania. `app/polityka-prywatnosci/page.tsx:287`

## Nizsze ryzyka / do doprecyzowania
- Termin reklamacji "14 dni roboczych" bywa mniej korzystny niz 14 dni kalendarzowych w niektorych reżimach konsumenckich. `app/regulamin/page.tsx:209`
- Daty "ostatniej aktualizacji" w 2025 r. - warto potwierdzic aktualnosc i spojnosc z faktycznym stanem. `app/regulamin/page.tsx:36`, `app/polityka-prywatnosci/page.tsx:36`

## Pytania, ktore zmieniaja ocene
- Czy swiadczysz uslugi konsumentom (B2C), czy tylko B2B?
- Czy umowa jest zawierana na odleglosc (formularz/online) i czy naprawa startuje "od razu" po zlozeniu zlecenia?
- Jakie dokladnie narzedzia analityczne/cookie-baner sa uzywane i czy jest realny mechanizm zgody?
- Czy dane trafiaja do USA (Vercel/Stripe/GA/OpenAI) i na jakiej podstawie transferu?

## Sugerowane nastepne kroki
1. Jesli B2C: uzupelnic regulamin o obowiazkowe informacje konsumenckie (odstapienie, wyjatki, wzor formularza, ADR/ODR, zasady uslug elektronicznych, ceny brutto).
2. Zaktualizowac polityke prywatnosci zgodnie z art. 13 RODO i urealnic sekcje transferow (DPF/SCC zamiast "Privacy Shield").
3. Doprecyzowac polityke cookies (zgody, lista, czasy zycia, sposob wycofania zgody).

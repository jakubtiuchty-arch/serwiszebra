'use client'

import Link from 'next/link'
import { ArrowLeft, FileText, Shield, Truck, CreditCard, AlertTriangle, Scale, ChevronRight } from 'lucide-react'

export default function RegulaminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Strona główna</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Regulamin</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Powrót do strony głównej
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Regulamin serwisu</h1>
              <p className="text-gray-400 mt-1">Ostatnia aktualizacja: 5 grudnia 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Spis treści */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-10">
          <h2 className="font-semibold text-gray-900 mb-3">Spis treści</h2>
          <ol className="grid sm:grid-cols-2 gap-2 text-sm text-blue-700">
            <li><a href="#postanowienia" className="hover:underline">1. Postanowienia ogólne</a></li>
            <li><a href="#definicje" className="hover:underline">2. Definicje</a></li>
            <li><a href="#uslugi" className="hover:underline">3. Zakres usług</a></li>
            <li><a href="#zlecenie" className="hover:underline">4. Zlecenie naprawy</a></li>
            <li><a href="#ceny" className="hover:underline">5. Ceny i płatności</a></li>
            <li><a href="#transport" className="hover:underline">6. Transport i dostawa</a></li>
            <li><a href="#gwarancja" className="hover:underline">7. Gwarancja na naprawę</a></li>
            <li><a href="#reklamacje" className="hover:underline">8. Reklamacje</a></li>
            <li><a href="#odpowiedzialnosc" className="hover:underline">9. Odpowiedzialność</a></li>
            <li><a href="#dane" className="hover:underline">10. Ochrona danych osobowych</a></li>
            <li><a href="#uslugi-elektroniczne" className="hover:underline">11. Usługi elektroniczne</a></li>
            <li className="sm:col-span-2 pt-2 mt-1 border-t border-blue-200 font-semibold text-gray-700">Sprzedaż produktów (sklep internetowy)</li>
            <li><a href="#sklep" className="hover:underline">12. Sklep internetowy</a></li>
            <li><a href="#zamowienia" className="hover:underline">13. Zamówienia i zawarcie umowy</a></li>
            <li><a href="#ceny-produkty" className="hover:underline">14. Ceny i płatności (produkty)</a></li>
            <li><a href="#dostawa-produkty" className="hover:underline">15. Dostawa produktów</a></li>
            <li><a href="#odstapienie" className="hover:underline">16. Prawo odstąpienia od umowy</a></li>
            <li><a href="#reklamacje-produkty" className="hover:underline">17. Reklamacje produktów</a></li>
            <li><a href="#pozasadowe" className="hover:underline">18. Pozasądowe rozpatrywanie sporów</a></li>
            <li><a href="#postanowienia-koncowe" className="hover:underline">19. Postanowienia końcowe</a></li>
          </ol>
        </div>

        <div className="prose prose-gray max-w-none">
          {/* §1 */}
          <section id="postanowienia" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 m-0">§1. Postanowienia ogólne</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>1.1. Niniejszy Regulamin określa zasady świadczenia usług serwisowych oraz sprzedaży produktów przez <strong>TAKMA Tadeusz Tiuchty</strong> z siedzibą we Wrocławiu (51-128), ul. Poświęcka 1a, NIP: 9151004377, REGON: 932677161, prowadzącego działalność gospodarczą wpisaną do Centralnej Ewidencji i Informacji o Działalności Gospodarczej (CEIDG), zwanego dalej odpowiednio „Serwisem" lub „Sprzedawcą".</p>
              <p>1.2. Serwis jest autoryzowanym partnerem serwisowym Zebra Technologies (Zebra Premier Partner Repair Specialist) i specjalizuje się w naprawie urządzeń marki Zebra: drukarek etykiet, terminali mobilnych oraz skanerów kodów kreskowych.</p>
              <p>1.3. Korzystanie z usług Serwisu oznacza akceptację niniejszego Regulaminu.</p>
              <p>1.4. Regulamin jest dostępny na stronie internetowej <a href="https://www.serwis-zebry.pl/regulamin" className="text-blue-600 hover:underline">serwis-zebry.pl/regulamin</a> i może być w każdej chwili pobrany oraz wydrukowany.</p>
            </div>
          </section>

          {/* §2 */}
          <section id="definicje" className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">§2. Definicje</h2>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p><strong>Klient</strong> – osoba fizyczna, osoba prawna lub jednostka organizacyjna nieposiadająca osobowości prawnej, która zleca Serwisowi wykonanie usługi naprawy.</p>
              <p><strong>Urządzenie</strong> – drukarka etykiet, terminal mobilny, skaner kodów kreskowych lub inne urządzenie marki Zebra Technologies przekazane do naprawy.</p>
              <p><strong>Zlecenie naprawy</strong> – zgłoszenie serwisowe złożone przez Klienta za pośrednictwem formularza na stronie, emaila lub telefonicznie.</p>
              <p><strong>Diagnostyka</strong> – czynności mające na celu ustalenie przyczyny usterki oraz zakresu niezbędnej naprawy.</p>
              <p><strong>Wycena</strong> – dokument określający koszt naprawy przesyłany Klientowi do akceptacji.</p>
            </div>
          </section>

          {/* §3 */}
          <section id="uslugi" className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">§3. Zakres usług</h2>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>3.1. Serwis świadczy usługi w zakresie:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Naprawy drukarek etykiet Zebra (serie ZD, ZT, GK, GX i inne)</li>
                <li>Naprawy terminali mobilnych Zebra (serie TC, MC, WT i inne)</li>
                <li>Naprawy skanerów kodów kreskowych Zebra</li>
                <li>Wymiany części eksploatacyjnych (głowice, wałki, baterie)</li>
                <li>Czyszczenia i konserwacji urządzeń</li>
                <li>Kalibracji i konfiguracji</li>
              </ul>
              <p>3.2. Serwis zastrzega sobie prawo do odmowy przyjęcia urządzenia do naprawy w przypadku:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Urządzeń innych marek niż Zebra Technologies</li>
                <li>Urządzeń z uszkodzeniami mechanicznymi uniemożliwiającymi naprawę</li>
                <li>Urządzeń, dla których nie są dostępne części zamienne</li>
              </ul>
            </div>
          </section>

          {/* §4 */}
          <section id="zlecenie" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 m-0">§4. Zlecenie naprawy</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>4.1. Zlecenie naprawy można złożyć poprzez:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Formularz na stronie serwis-zebry.pl</li>
                <li>Email: serwis@takma.com.pl</li>
                <li>Telefon: +48 601 619 898</li>
              </ul>
              <p>4.2. Po złożeniu zlecenia Klient otrzymuje potwierdzenie wraz z numerem zgłoszenia.</p>
              <p>4.3. Kurier odbiera urządzenie z adresu Klienta w terminie 1-2 dni roboczych. Koszt transportu do serwisu pokrywa Serwis.</p>
              <p>4.4. Po otrzymaniu urządzenia Serwis przeprowadza diagnostykę w ciągu 24-48 godzin roboczych.</p>
              <p>4.5. Po diagnostyce Klient otrzymuje szczegółową wycenę naprawy do akceptacji.</p>
              <p>4.6. Klient ma 7 dni na akceptację lub odrzucenie wyceny. Brak odpowiedzi w tym terminie traktowany jest jako rezygnacja z naprawy.</p>
            </div>
          </section>

          {/* §5 */}
          <section id="ceny" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 m-0">§5. Ceny i płatności</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>5.1. Wszystkie ceny podane na stronie są cenami netto i należy do nich doliczyć podatek VAT 23%.</p>
              <p>5.2. <strong>Diagnostyka jest bezpłatna</strong> w przypadku akceptacji wyceny i realizacji naprawy.</p>
              <p>5.3. W przypadku rezygnacji z naprawy po wykonaniu diagnostyki, Klient ponosi koszt diagnostyki w wysokości <strong>99 zł netto</strong>.</p>
              <p>5.4. Płatność może być dokonana:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Przelewem na rachunek bankowy (przedpłata lub po naprawie dla stałych klientów)</li>
                <li>Kartą płatniczą online (Stripe, Przelewy24, BLIK)</li>
                <li>Za pobraniem przy odbiorze urządzenia</li>
              </ul>
              <p>5.5. Termin płatności faktury wynosi 7 dni od daty wystawienia, chyba że strony ustalą inaczej.</p>
              <p>5.6. W przypadku naprawy ekspresowej (1-2 dni robocze) doliczana jest opłata w wysokości 50 zł netto.</p>
            </div>
          </section>

          {/* §6 */}
          <section id="transport" className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">§6. Transport i dostawa</h2>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>6.1. Transport urządzenia do serwisu jest <strong>bezpłatny</strong> - kurier odbiera sprzęt z adresu Klienta.</p>
              <p>6.2. Transport urządzenia z powrotem do Klienta jest wliczony w cenę naprawy.</p>
              <p>6.3. W przypadku rezygnacji z naprawy, Klient ponosi koszt transportu zwrotnego w wysokości 25 zł netto.</p>
              <p>6.4. Urządzenie powinno być odpowiednio zabezpieczone na czas transportu. Serwis nie ponosi odpowiedzialności za uszkodzenia powstałe w wyniku niewłaściwego opakowania przez Klienta.</p>
              <p>6.5. Standardowy czas dostawy wynosi 1-2 dni robocze na terenie Polski.</p>
            </div>
          </section>

          {/* §7 */}
          <section id="gwarancja" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 m-0">§7. Gwarancja na naprawę</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>7.1. Na wykonaną naprawę Serwis udziela <strong>12-miesięcznej gwarancji</strong>.</p>
              <p>7.2. Gwarancja obejmuje:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Ponowne wystąpienie tej samej usterki</li>
                <li>Wady użytych części zamiennych</li>
                <li>Błędy w wykonaniu naprawy</li>
              </ul>
              <p>7.3. Gwarancja nie obejmuje:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Uszkodzeń mechanicznych powstałych po naprawie</li>
                <li>Uszkodzeń wynikających z nieprawidłowej eksploatacji</li>
                <li>Materiałów eksploatacyjnych (etykiety, ribbon)</li>
                <li>Usterek niezwiązanych z wykonaną naprawą</li>
              </ul>
              <p>7.4. W przypadku uzasadnionej reklamacji gwarancyjnej, naprawa wykonywana jest bezpłatnie.</p>
            </div>
          </section>

          {/* §8 */}
          <section id="reklamacje" className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">§8. Reklamacje</h2>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>8.1. Reklamacje można składać:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Emailem na adres: serwis@takma.com.pl</li>
                <li>Telefonicznie: +48 601 619 898</li>
                <li>Poprzez panel klienta na stronie serwis-zebry.pl</li>
              </ul>
              <p>8.2. Reklamacja powinna zawierać: numer zlecenia, opis problemu, dane kontaktowe.</p>
              <p>8.3. Serwis rozpatruje reklamacje w terminie 14 dni roboczych od daty otrzymania.</p>
              <p>8.4. O wyniku rozpatrzenia reklamacji Klient zostanie poinformowany drogą mailową lub telefonicznie.</p>
            </div>
          </section>

          {/* §9 */}
          <section id="odpowiedzialnosc" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 m-0">§9. Odpowiedzialność</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>9.1. Serwis odpowiada za szkody wyrządzone Klientowi wyłącznie w przypadku umyślnego działania lub rażącego niedbalstwa.</p>
              <p>9.2. Serwis nie ponosi odpowiedzialności za:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Dane zapisane na urządzeniu - Klient powinien wykonać kopię zapasową przed wysłaniem</li>
                <li>Utratę korzyści wynikającą z braku dostępu do urządzenia w czasie naprawy</li>
                <li>Uszkodzenia powstałe w transporcie z winy przewoźnika</li>
              </ul>
              <p>9.3. Maksymalna odpowiedzialność Serwisu ograniczona jest do wartości wykonanej usługi.</p>
              <p>9.4. W przypadku nieodebrania sprzętu po zakończeniu naprawy, po uprzednim poinformowaniu Klienta i wskazaniu ostatecznego terminu odbioru, Serwis zastrzega sobie prawo do naliczania opłaty magazynowej w wysokości 10,00 zł netto (12,30 zł brutto) za każdy dzień przechowywania, licząc od dnia następującego po upływie wyznaczonego terminu.</p>
            </div>
          </section>

          {/* §10 */}
          <section id="dane" className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">§10. Ochrona danych osobowych</h2>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>10.1. Administratorem danych osobowych jest TAKMA Tadeusz Tiuchty z siedzibą we Wrocławiu (51-128), ul. Poświęcka 1a, NIP: 9151004377.</p>
              <p>10.2. Dane osobowe przetwarzane są w celu realizacji usług serwisowych, na podstawie art. 6 ust. 1 lit. b RODO.</p>
              <p>10.3. Klient ma prawo do: dostępu do danych, sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz wniesienia sprzeciwu.</p>
              <p>10.4. Szczegółowe informacje o przetwarzaniu danych osobowych znajdują się w <Link href="/polityka-prywatnosci" className="text-blue-600 hover:underline">Polityce Prywatności</Link>.</p>
            </div>
          </section>

          {/* §11 - Usługi elektroniczne */}
          <section id="uslugi-elektroniczne" className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">§11. Usługi elektroniczne</h2>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>11.1. W ramach serwisu świadczymy następujące usługi drogą elektroniczną:</p>
              
              <p className="font-medium text-gray-900 mt-4">Konto użytkownika (Panel klienta)</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Umowa o świadczenie usługi konta zawierana jest na czas nieokreślony z chwilą rejestracji</li>
                <li>Konto umożliwia: śledzenie statusu napraw, przeglądanie historii zleceń, komunikację z serwisem, akceptację wycen</li>
                <li>Klient może w każdej chwili usunąć konto poprzez kontakt z serwisem lub opcję w panelu</li>
                <li>Usunięcie konta nie wpływa na wcześniej zawarte umowy naprawy</li>
              </ul>

              <p className="font-medium text-gray-900 mt-4">Asystent AI (Chat)</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Chat AI służy do wstępnej diagnostyki i udzielania informacji o usługach</li>
                <li>Odpowiedzi generowane przez AI mają charakter informacyjny i nie stanowią wiążącej oferty</li>
                <li>Ostateczna wycena i warunki naprawy ustalane są przez pracowników serwisu</li>
                <li>Rozmowy z AI mogą być przechowywane w celu poprawy jakości usługi (szczegóły w Polityce Prywatności)</li>
              </ul>

              <p className="font-medium text-gray-900 mt-4">Wymagania techniczne</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Przeglądarka internetowa z obsługą JavaScript (Chrome, Firefox, Safari, Edge)</li>
                <li>Połączenie z Internetem</li>
                <li>Aktywny adres email</li>
              </ul>

              <p className="font-medium text-gray-900 mt-4">Reklamacje usług elektronicznych</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Reklamacje dotyczące działania serwisu można zgłaszać na: serwis@takma.com.pl</li>
                <li>Reklamacja powinna zawierać opis problemu i dane kontaktowe</li>
                <li>Odpowiedź na reklamację udzielana jest w terminie 14 dni</li>
              </ul>

              <p className="mt-4">11.2. Zakazane jest dostarczanie przez Klienta treści o charakterze bezprawnym, w szczególności:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Treści naruszających prawa osób trzecich</li>
                <li>Treści obraźliwych lub wulgarnych</li>
                <li>Prób zakłócenia działania serwisu</li>
              </ul>
            </div>
          </section>

          {/* Część II — Sklep internetowy */}
          <div className="my-10 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="text-sm text-gray-700 m-0"><strong>Część II — Sprzedaż produktów w sklepie internetowym.</strong> Poniższe postanowienia (§12–§18) dotyczą sprzedaży produktów fizycznych (części zamiennych, akcesoriów, materiałów eksploatacyjnych) za pośrednictwem sklepu internetowego pod adresem serwis-zebry.pl/sklep.</p>
          </div>

          {/* §12 */}
          <section id="sklep" className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">§12. Sklep internetowy — postanowienia i definicje</h2>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>12.1. Sprzedawca prowadzi sklep internetowy dostępny pod adresem <a href="https://www.serwis-zebry.pl/sklep" className="text-blue-600 hover:underline">serwis-zebry.pl/sklep</a>, w którym oferuje sprzedaż produktów fizycznych — części zamiennych, akcesoriów oraz materiałów eksploatacyjnych do urządzeń marki Zebra Technologies.</p>
              <p>12.2. Definicje stosowane w niniejszej części Regulaminu:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Sklep</strong> – sklep internetowy Sprzedawcy dostępny pod adresem serwis-zebry.pl/sklep.</li>
                <li><strong>Sprzedawca</strong> – TAKMA Tadeusz Tiuchty, ul. Poświęcka 1a, 51-128 Wrocław, NIP 9151004377.</li>
                <li><strong>Produkt</strong> – rzecz ruchoma oferowana do sprzedaży w Sklepie (m.in. głowice drukujące, wałki, akumulatory, zasilacze, konwertery DPI, akcesoria).</li>
                <li><strong>Klient</strong> – osoba dokonująca zakupu w Sklepie.</li>
                <li><strong>Konsument</strong> – osoba fizyczna dokonująca zakupu niezwiązanego bezpośrednio z jej działalnością gospodarczą lub zawodową (art. 22<sup>1</sup> Kodeksu cywilnego).</li>
                <li><strong>Przedsiębiorca na prawach konsumenta</strong> – osoba fizyczna zawierająca umowę bezpośrednio związaną z jej działalnością gospodarczą, gdy umowa nie ma dla niej charakteru zawodowego (art. 7aa ustawy o prawach konsumenta).</li>
                <li><strong>Zamówienie</strong> – oświadczenie woli Klienta zmierzające bezpośrednio do zawarcia Umowy sprzedaży Produktu.</li>
                <li><strong>Umowa sprzedaży</strong> – umowa sprzedaży Produktu zawierana na odległość między Klientem a Sprzedawcą.</li>
              </ul>
              <p>12.3. Informacje o Produktach prezentowane w Sklepie stanowią zaproszenie do zawarcia umowy w rozumieniu art. 71 Kodeksu cywilnego, a nie ofertę.</p>
            </div>
          </section>

          {/* §13 */}
          <section id="zamowienia" className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">§13. Zamówienia i zawarcie umowy sprzedaży</h2>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>13.1. Zamówienia w Sklepie można składać przez całą dobę, 7 dni w tygodniu.</p>
              <p>13.2. W celu złożenia Zamówienia Klient dodaje Produkty do koszyka, podaje dane niezbędne do realizacji i dostawy, wybiera sposób dostawy oraz płatności, a następnie składa Zamówienie przyciskiem oznaczonym jako wiążący się z obowiązkiem zapłaty.</p>
              <p>13.3. Złożenie Zamówienia stanowi ofertę zawarcia Umowy sprzedaży. Umowa sprzedaży zostaje zawarta z chwilą otrzymania przez Klienta — na podany adres e-mail — potwierdzenia przyjęcia Zamówienia do realizacji.</p>
              <p>13.4. Warunkiem realizacji Zamówienia jest podanie prawdziwych i kompletnych danych kontaktowych oraz adresowych.</p>
              <p>13.5. Utrwalenie i udostępnienie treści Umowy sprzedaży następuje przez przesłanie Klientowi potwierdzenia Zamówienia na adres e-mail oraz dołączenie dowodu sprzedaży do przesyłki.</p>
            </div>
          </section>

          {/* §14 */}
          <section id="ceny-produkty" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 m-0">§14. Ceny i płatności (produkty)</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>14.1. Ceny Produktów podane są w złotych polskich. Przy każdym Produkcie wskazana jest cena netto oraz cena brutto (zawierająca podatek VAT).</p>
              <p>14.2. Ceną wiążącą jest cena obowiązująca w chwili złożenia Zamówienia. Cena nie obejmuje kosztów dostawy, które wskazywane są odrębnie w trakcie składania Zamówienia.</p>
              <p>14.3. Klient może wybrać następujące formy płatności:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>szybki przelew online, BLIK lub karta płatnicza za pośrednictwem systemu <strong>Przelewy24</strong>;</li>
                <li>przelew tradycyjny na rachunek bankowy Sprzedawcy.</li>
              </ul>
              <p>14.4. Operatorem płatności Przelewy24 jest <strong>PayPro S.A.</strong> z siedzibą w Poznaniu (ul. Pastelowa 8, 60-198 Poznań), wpisana do rejestru przedsiębiorców Krajowego Rejestru Sądowego pod numerem KRS 0000347935, NIP 7792369887, REGON 301345068.</p>
              <p>14.5. Przy płatności online Klient jest przekierowywany na stronę operatora płatności. Realizacja Zamówienia rozpoczyna się po zaksięgowaniu płatności (a w przypadku przelewu tradycyjnego — po wpływie środków na rachunek Sprzedawcy).</p>
              <p>14.6. Do każdego Zamówienia Sprzedawca wystawia dokument sprzedaży (paragon lub fakturę VAT) zgodnie z danymi podanymi przez Klienta.</p>
            </div>
          </section>

          {/* §15 */}
          <section id="dostawa-produkty" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 m-0">§15. Dostawa produktów</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>15.1. Produkty dostarczane są na terytorium Rzeczypospolitej Polskiej za pośrednictwem firmy kurierskiej.</p>
              <p>15.2. Koszt dostawy wskazywany jest Klientowi w trakcie składania Zamówienia, przed jego potwierdzeniem.</p>
              <p>15.3. Produkty dostępne w magazynie wysyłane są w ciągu 24 godzin (1 dnia roboczego) od zaksięgowania płatności; orientacyjny czas doręczenia przez kuriera wynosi 1–2 dni robocze. Dla Produktów sprowadzanych na zamówienie termin realizacji podawany jest indywidualnie.</p>
              <p>15.4. W razie nieobecności Klienta kurier podejmuje ponowną próbę doręczenia lub pozostawia awizo zgodnie z regulaminem przewoźnika.</p>
              <p>15.5. Zaleca się sprawdzenie przesyłki przy odbiorze. W przypadku stwierdzenia uszkodzenia opakowania zaleca się sporządzenie protokołu szkody w obecności kuriera — ułatwia to dochodzenie ewentualnych roszczeń.</p>
            </div>
          </section>

          {/* §16 */}
          <section id="odstapienie" className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">§16. Prawo odstąpienia od umowy</h2>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>16.1. Konsument oraz Przedsiębiorca na prawach konsumenta, który zawarł umowę na odległość, może w terminie <strong>14 dni</strong> odstąpić od niej bez podawania przyczyny i bez ponoszenia kosztów, z wyjątkiem kosztów wskazanych w pkt 16.6.</p>
              <p>16.2. Bieg terminu rozpoczyna się od dnia objęcia Produktu w posiadanie przez Konsumenta lub wskazaną przez niego osobę trzecią inną niż przewoźnik.</p>
              <p>16.3. Aby skorzystać z prawa odstąpienia, należy złożyć Sprzedawcy jednoznaczne oświadczenie, np. pismem wysłanym pocztą na adres siedziby lub pocztą elektroniczną na adres <a href="mailto:serwis@takma.com.pl" className="text-blue-600 hover:underline">serwis@takma.com.pl</a>. Można skorzystać z wzoru formularza zamieszczonego poniżej, nie jest to jednak obowiązkowe.</p>
              <p>16.4. Do zachowania terminu wystarczy wysłanie oświadczenia przed jego upływem.</p>
              <p>16.5. Sprzedawca niezwłocznie, nie później niż w terminie 14 dni od otrzymania oświadczenia o odstąpieniu, zwraca wszystkie otrzymane płatności, w tym koszty dostawy (z wyjątkiem dodatkowych kosztów wynikających z wybranego przez Konsumenta sposobu dostawy innego niż najtańszy zwykły sposób oferowany przez Sprzedawcę). Zwrot następuje przy użyciu takiego samego sposobu płatności, jakiego użył Konsument, chyba że Konsument wyraźnie zgodził się na inne rozwiązanie, które nie wiąże się dla niego z żadnymi kosztami.</p>
              <p>16.6. Sprzedawca może wstrzymać się ze zwrotem płatności do chwili otrzymania Produktu z powrotem lub dostarczenia przez Konsumenta dowodu jego odesłania, w zależności od tego, które zdarzenie nastąpi wcześniej. Konsument ponosi bezpośrednie koszty zwrotu Produktu oraz odpowiada za zmniejszenie wartości Produktu wynikające z korzystania z niego w sposób wykraczający poza konieczny do stwierdzenia jego charakteru, cech i funkcjonowania.</p>
              <p>16.7. Konsument ma obowiązek zwrócić Produkt Sprzedawcy (na adres: TAKMA Tadeusz Tiuchty, ul. Poświęcka 1a, 51-128 Wrocław) niezwłocznie, nie później niż w terminie 14 dni od dnia odstąpienia od umowy.</p>
              <p>16.8. Prawo odstąpienia nie przysługuje m.in. w odniesieniu do umowy, w której przedmiotem świadczenia jest Produkt nieprefabrykowany, wyprodukowany według specyfikacji Konsumenta lub służący zaspokojeniu jego zindywidualizowanych potrzeb, oraz w pozostałych przypadkach wskazanych w art. 38 ustawy o prawach konsumenta.</p>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-4">
                <p className="font-semibold text-gray-900 mb-2">Wzór formularza odstąpienia od umowy</p>
                <p className="text-xs text-gray-500 mb-3">(formularz należy wypełnić i odesłać tylko w przypadku chęci odstąpienia od umowy)</p>
                <ul className="list-none space-y-1.5">
                  <li>Adresat: TAKMA Tadeusz Tiuchty, ul. Poświęcka 1a, 51-128 Wrocław, e-mail: serwis@takma.com.pl</li>
                  <li>Ja/My niniejszym informuję/informujemy o moim/naszym odstąpieniu od umowy sprzedaży następujących Produktów: ...........................................</li>
                  <li>Data zawarcia umowy / odbioru: ...........................................</li>
                  <li>Imię i nazwisko konsumenta(-ów): ...........................................</li>
                  <li>Adres konsumenta(-ów): ...........................................</li>
                  <li>Data: ...........................................</li>
                  <li>Podpis konsumenta(-ów) (tylko jeżeli formularz jest przesyłany w wersji papierowej): ...........................................</li>
                </ul>
              </div>
            </div>
          </section>

          {/* §17 */}
          <section id="reklamacje-produkty" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 m-0">§17. Reklamacje produktów</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>17.1. Sprzedawca ma obowiązek dostarczyć Produkt zgodny z Umową sprzedaży.</p>
              <p>17.2. W stosunku do Konsumentów oraz Przedsiębiorców na prawach konsumenta odpowiedzialność Sprzedawcy za brak zgodności Produktu z umową regulują przepisy rozdziału 5a ustawy o prawach konsumenta. Sprzedawca odpowiada za brak zgodności Produktu z umową istniejący w chwili jego dostarczenia i ujawniony w ciągu dwóch lat od tej chwili.</p>
              <p>17.3. W razie braku zgodności Produktu z umową Konsument może żądać jego naprawy lub wymiany. Jeżeli naprawa lub wymiana są niemożliwe albo wymagałyby nadmiernych kosztów, Konsument może złożyć oświadczenie o obniżeniu ceny albo o odstąpieniu od umowy na zasadach określonych w ustawie.</p>
              <p>17.4. W stosunku do Klientów niebędących Konsumentami (przedsiębiorców) stosuje się przepisy o rękojmi zawarte w Kodeksie cywilnym; odpowiedzialność Sprzedawcy z tytułu rękojmi wobec takich Klientów zostaje wyłączona w zakresie dozwolonym przez prawo.</p>
              <p>17.5. Reklamację Produktu można złożyć pocztą elektroniczną na adres <a href="mailto:serwis@takma.com.pl" className="text-blue-600 hover:underline">serwis@takma.com.pl</a> lub pisemnie na adres siedziby Sprzedawcy. Reklamacja powinna zawierać dane Klienta, numer Zamówienia, opis stwierdzonej niezgodności oraz żądanie Klienta.</p>
              <p>17.6. Sprzedawca rozpatruje reklamację w terminie 14 dni od dnia jej otrzymania. Brak ustosunkowania się Sprzedawcy w tym terminie oznacza uznanie reklamacji Konsumenta za uzasadnioną.</p>
              <p>17.7. Niezależnie od powyższego, na Produkty może być udzielona gwarancja producenta (Zebra Technologies) na okres 12 miesięcy; szczegółowe warunki gwarancji określa producent. Gwarancja nie wyłącza ani nie ogranicza uprawnień Konsumenta wynikających z przepisów o braku zgodności towaru z umową.</p>
            </div>
          </section>

          {/* §18 */}
          <section id="pozasadowe" className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">§18. Pozasądowe sposoby rozpatrywania reklamacji i dochodzenia roszczeń</h2>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>18.1. Konsument ma możliwość skorzystania z pozasądowych sposobów rozpatrywania reklamacji i dochodzenia roszczeń, m.in. poprzez: wniosek o rozstrzygnięcie sporu do stałego polubownego sądu konsumenckiego, wniosek do wojewódzkiego inspektora Inspekcji Handlowej o wszczęcie postępowania mediacyjnego, a także pomoc powiatowego (miejskiego) rzecznika konsumentów lub organizacji społecznej, do której zadań statutowych należy ochrona konsumentów.</p>
              <p>18.2. Pod adresem <a href="https://ec.europa.eu/consumers/odr" className="text-blue-600 hover:underline">ec.europa.eu/consumers/odr</a> dostępna jest unijna platforma internetowego systemu rozstrzygania sporów (platforma ODR). Adres e-mail Sprzedawcy do kontaktu: serwis@takma.com.pl.</p>
              <p>18.3. Szczegółowe informacje o pozasądowych sposobach rozpatrywania reklamacji i dochodzenia roszczeń dostępne są w siedzibach i na stronach internetowych powiatowych (miejskich) rzeczników konsumentów, Wojewódzkich Inspektoratów Inspekcji Handlowej oraz Urzędu Ochrony Konkurencji i Konsumentów (<a href="https://www.uokik.gov.pl" className="text-blue-600 hover:underline">uokik.gov.pl</a>).</p>
            </div>
          </section>

          {/* §19 */}
          <section id="postanowienia-koncowe" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 m-0">§19. Postanowienia końcowe</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>19.1. W sprawach nieuregulowanych niniejszym Regulaminem stosuje się powszechnie obowiązujące przepisy prawa polskiego, w szczególności Kodeksu cywilnego oraz ustawy o prawach konsumenta.</p>
              <p>19.2. Serwis zastrzega sobie prawo do zmiany Regulaminu. O zmianach Klienci zostaną poinformowani poprzez publikację nowej wersji na stronie oraz email do zarejestrowanych użytkowników. Do Zamówień złożonych przed wejściem w życie zmian stosuje się Regulamin w brzmieniu dotychczasowym.</p>
              <p>19.3. Wszelkie spory wynikające z realizacji usług lub umów sprzedaży rozstrzygane będą przez sąd właściwy dla siedziby Serwisu. Postanowienie to nie dotyczy Konsumentów — właściwość sądu w sporach z udziałem Konsumenta ustalana jest na zasadach ogólnych wynikających z przepisów prawa.</p>
              <p>19.4. Regulamin wchodzi w życie z dniem 5 grudnia 2025 roku.</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Masz pytania dotyczące regulaminu?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a 
                href="mailto:serwis@takma.com.pl" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                serwis@takma.com.pl
              </a>
              <a 
                href="tel:+48601619898" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                +48 601 619 898
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}










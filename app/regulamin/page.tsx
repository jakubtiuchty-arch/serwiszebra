'use client'

import Link from 'next/link'
import { ArrowLeft, FileText, Shield, Truck, CreditCard, AlertTriangle, Scale } from 'lucide-react'

export default function RegulaminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
            <li><a href="#postanowienia-koncowe" className="hover:underline">11. Postanowienia końcowe</a></li>
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
              <p>1.1. Niniejszy Regulamin określa zasady świadczenia usług serwisowych przez firmę <strong>TAKMA</strong> z siedzibą we Wrocławiu (51-128), ul. Poświęcka 1a, NIP: 915-100-43-77, REGON: 932677161, zwaną dalej „Serwisem".</p>
              <p>1.2. Serwis jest autoryzowanym partnerem serwisowym Zebra Technologies (Zebra Premier Partner Repair Specialist) i specjalizuje się w naprawie urządzeń marki Zebra: drukarek etykiet, terminali mobilnych oraz skanerów kodów kreskowych.</p>
              <p>1.3. Korzystanie z usług Serwisu oznacza akceptację niniejszego Regulaminu.</p>
              <p>1.4. Regulamin jest dostępny na stronie internetowej <a href="https://serwiszebra.pl/regulamin" className="text-blue-600 hover:underline">serwiszebra.pl/regulamin</a> i może być w każdej chwili pobrany oraz wydrukowany.</p>
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
                <li>Formularz na stronie serwiszebra.pl</li>
                <li>Email: serwis@serwiszebra.pl</li>
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
                <li>Emailem na adres: serwis@serwiszebra.pl</li>
                <li>Telefonicznie: +48 601 619 898</li>
                <li>Poprzez panel klienta na stronie serwiszebra.pl</li>
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
              <p>9.4. Urządzenia nieodebrane w terminie 30 dni od zakończenia naprawy lub rezygnacji mogą zostać zutylizowane po uprzednim powiadomieniu Klienta.</p>
            </div>
          </section>

          {/* §10 */}
          <section id="dane" className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">§10. Ochrona danych osobowych</h2>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>10.1. Administratorem danych osobowych jest TAKMA z siedzibą we Wrocławiu.</p>
              <p>10.2. Dane osobowe przetwarzane są w celu realizacji usług serwisowych, na podstawie art. 6 ust. 1 lit. b RODO.</p>
              <p>10.3. Klient ma prawo do: dostępu do danych, sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz wniesienia sprzeciwu.</p>
              <p>10.4. Szczegółowe informacje o przetwarzaniu danych osobowych znajdują się w <Link href="/polityka-prywatnosci" className="text-blue-600 hover:underline">Polityce Prywatności</Link>.</p>
            </div>
          </section>

          {/* §11 */}
          <section id="postanowienia-koncowe" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-gray-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 m-0">§11. Postanowienia końcowe</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>11.1. W sprawach nieuregulowanych niniejszym Regulaminem stosuje się przepisy Kodeksu Cywilnego.</p>
              <p>11.2. Serwis zastrzega sobie prawo do zmiany Regulaminu. O zmianach Klienci zostaną poinformowani poprzez publikację nowej wersji na stronie.</p>
              <p>11.3. Wszelkie spory wynikające z realizacji usług rozstrzygane będą przez sąd właściwy dla siedziby Serwisu.</p>
              <p>11.4. Regulamin wchodzi w życie z dniem 5 grudnia 2025 roku.</p>
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
                href="mailto:serwis@serwiszebra.pl" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                serwis@serwiszebra.pl
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







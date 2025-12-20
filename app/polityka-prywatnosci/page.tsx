'use client'

import Link from 'next/link'
import { ArrowLeft, Shield, Eye, Lock, Database, Cookie, Mail, UserCheck } from 'lucide-react'

export default function PolitykaPrywatnosciPage() {
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
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Polityka Prywatności</h1>
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
            <li><a href="#administrator" className="hover:underline">1. Administrator danych</a></li>
            <li><a href="#zakres" className="hover:underline">2. Zakres danych</a></li>
            <li><a href="#cele" className="hover:underline">3. Cele przetwarzania</a></li>
            <li><a href="#podstawy" className="hover:underline">4. Podstawy prawne</a></li>
            <li><a href="#odbiorcy" className="hover:underline">5. Odbiorcy danych</a></li>
            <li><a href="#okres" className="hover:underline">6. Okres przechowywania</a></li>
            <li><a href="#prawa" className="hover:underline">7. Prawa użytkownika</a></li>
            <li><a href="#cookies" className="hover:underline">8. Pliki cookies</a></li>
            <li><a href="#bezpieczenstwo" className="hover:underline">9. Bezpieczeństwo</a></li>
            <li><a href="#zmiany" className="hover:underline">10. Zmiany polityki</a></li>
          </ol>
        </div>

        <div className="prose prose-gray max-w-none">
          {/* Wstęp */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-10">
            <p className="text-sm text-gray-600 m-0">
              Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych 
              przekazanych przez Użytkowników w związku z korzystaniem z usług serwisu <strong>serwis-zebry.pl</strong>, 
              prowadzonego przez firmę TAKMA. Dbamy o Twoją prywatność i bezpieczeństwo danych zgodnie 
              z Rozporządzeniem RODO.
            </p>
          </div>

          {/* §1 */}
          <section id="administrator" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 m-0">§1. Administrator danych osobowych</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>1.1. Administratorem danych osobowych jest:</p>
              <div className="bg-gray-50 rounded-lg p-4 ml-4">
                <p className="font-semibold text-gray-900 mb-1">TAKMA</p>
                <p className="text-gray-600">ul. Poświęcka 1a</p>
                <p className="text-gray-600">51-128 Wrocław</p>
                <p className="text-gray-600">NIP: 915-100-43-77</p>
                <p className="text-gray-600">REGON: 932677161</p>
              </div>
              <p>1.2. Kontakt w sprawach dotyczących danych osobowych:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Email: <a href="mailto:serwis@serwis-zebry.pl" className="text-blue-600 hover:underline">serwis@serwis-zebry.pl</a></li>
                <li>Telefon: <a href="tel:+48601619898" className="text-blue-600 hover:underline">+48 601 619 898</a></li>
                <li>Adres korespondencyjny: ul. Poświęcka 1a, 51-128 Wrocław</li>
              </ul>
            </div>
          </section>

          {/* §2 */}
          <section id="zakres" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 m-0">§2. Zakres zbieranych danych</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>2.1. W ramach korzystania z serwisu zbieramy następujące dane:</p>
              
              <p className="font-medium text-gray-900 mt-4">Dane podawane przez użytkownika:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Imię i nazwisko</li>
                <li>Adres email</li>
                <li>Numer telefonu</li>
                <li>Adres (ulica, kod pocztowy, miasto)</li>
                <li>Nazwa firmy i NIP (dla klientów biznesowych)</li>
                <li>Dane urządzenia (model, numer seryjny, opis usterki)</li>
              </ul>

              <p className="font-medium text-gray-900 mt-4">Dane zbierane automatycznie:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Adres IP</li>
                <li>Typ przeglądarki i systemu operacyjnego</li>
                <li>Dane o aktywności na stronie (odwiedzane podstrony, czas wizyty)</li>
                <li>Źródło wejścia na stronę</li>
                <li>Pliki cookies (szczegóły w §8)</li>
              </ul>

              <p className="font-medium text-gray-900 mt-4">Dane z czatu AI:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Treść rozmów z asystentem AI</li>
                <li>Identyfikator sesji</li>
                <li>Czas i data rozmowy</li>
              </ul>
            </div>
          </section>

          {/* §3 */}
          <section id="cele" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 m-0">§3. Cele przetwarzania danych</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>3.1. Dane osobowe przetwarzane są w następujących celach:</p>
              
              <div className="space-y-4 mt-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-2">Realizacja usług serwisowych</p>
                  <p className="text-sm">Przyjmowanie zgłoszeń, diagnostyka, naprawa urządzeń, kontakt w sprawie zlecenia, wystawianie faktur.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-2">Obsługa konta użytkownika</p>
                  <p className="text-sm">Rejestracja, logowanie, zarządzanie historią zgłoszeń, śledzenie statusu napraw.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-2">Komunikacja</p>
                  <p className="text-sm">Odpowiadanie na zapytania, powiadomienia o statusie naprawy, informacje techniczne.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-2">Ulepszanie usług</p>
                  <p className="text-sm">Analiza rozmów z czatem AI w celu poprawy jakości odpowiedzi, statystyki korzystania z serwisu.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-2">Marketing (za zgodą)</p>
                  <p className="text-sm">Wysyłka newslettera, informacje o promocjach i nowościach - wyłącznie po wyrażeniu zgody.</p>
                </div>
              </div>
            </div>
          </section>

          {/* §4 */}
          <section id="podstawy" className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">§4. Podstawy prawne przetwarzania</h2>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>4.1. Dane osobowe przetwarzane są na podstawie:</p>
              <ul className="list-none ml-0 space-y-3 mt-4">
                <li className="flex gap-3">
                  <span className="font-mono text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Art. 6 ust. 1 lit. b</span>
                  <span>Wykonanie umowy (realizacja usług serwisowych)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Art. 6 ust. 1 lit. c</span>
                  <span>Obowiązek prawny (księgowość, faktury)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Art. 6 ust. 1 lit. f</span>
                  <span>Prawnie uzasadniony interes (analityka, ulepszanie usług)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Art. 6 ust. 1 lit. a</span>
                  <span>Zgoda (marketing, newsletter)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* §5 */}
          <section id="odbiorcy" className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">§5. Odbiorcy danych</h2>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>5.1. Dane osobowe mogą być przekazywane następującym podmiotom:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Firmy kurierskie</strong> - w celu realizacji wysyłki urządzeń</li>
                <li><strong>Operatorzy płatności</strong> - Stripe, Przelewy24 - w celu obsługi płatności</li>
                <li><strong>Dostawcy usług IT</strong> - hosting (Vercel), baza danych (Supabase)</li>
                <li><strong>Dostawcy usług AI</strong> - Google, OpenAI - w zakresie czatu AI</li>
                <li><strong>Biuro rachunkowe</strong> - w celu prowadzenia księgowości</li>
              </ul>
              <p>5.2. Dane nie są przekazywane do państw trzecich poza EOG, z wyjątkiem usług chmurowych posiadających odpowiednie zabezpieczenia (SCC, Privacy Shield).</p>
            </div>
          </section>

          {/* §6 */}
          <section id="okres" className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">§6. Okres przechowywania danych</h2>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>6.1. Dane przechowywane są przez okres:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Dane zlecenia</strong> - 5 lat od zakończenia naprawy (wymogi podatkowe)</li>
                <li><strong>Dane konta</strong> - do czasu usunięcia konta przez użytkownika</li>
                <li><strong>Dane z czatu AI</strong> - 90 dni (automatyczne usuwanie)</li>
                <li><strong>Dane marketingowe</strong> - do wycofania zgody</li>
                <li><strong>Logi serwera</strong> - 30 dni</li>
              </ul>
              <p>6.2. Po upływie okresu przechowywania dane są trwale usuwane lub anonimizowane.</p>
            </div>
          </section>

          {/* §7 */}
          <section id="prawa" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 m-0">§7. Prawa użytkownika</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>7.1. Zgodnie z RODO przysługują Ci następujące prawa:</p>
              
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-1">Prawo dostępu</p>
                  <p className="text-xs">Możesz uzyskać informację, jakie Twoje dane przetwarzamy.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-1">Prawo sprostowania</p>
                  <p className="text-xs">Możesz poprawić nieprawidłowe lub uzupełnić niekompletne dane.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-1">Prawo usunięcia</p>
                  <p className="text-xs">Możesz żądać usunięcia danych („prawo do bycia zapomnianym").</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-1">Prawo ograniczenia</p>
                  <p className="text-xs">Możesz ograniczyć przetwarzanie w określonych przypadkach.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-1">Prawo przenoszenia</p>
                  <p className="text-xs">Możesz otrzymać swoje dane w formacie nadającym się do odczytu.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-1">Prawo sprzeciwu</p>
                  <p className="text-xs">Możesz sprzeciwić się przetwarzaniu w celach marketingowych.</p>
                </div>
              </div>

              <p className="mt-4">7.2. Aby skorzystać z praw, skontaktuj się z nami: <a href="mailto:serwis@serwis-zebry.pl" className="text-blue-600 hover:underline">serwis@serwis-zebry.pl</a></p>
              <p>7.3. Masz prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych (UODO).</p>
            </div>
          </section>

          {/* §8 */}
          <section id="cookies" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Cookie className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 m-0">§8. Pliki cookies</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>8.1. Serwis wykorzystuje pliki cookies w następujących celach:</p>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-xs font-medium bg-green-200 text-green-800 px-2 py-0.5 rounded">Niezbędne</span>
                  <p className="text-sm">Sesja użytkownika, koszyk, preferencje - niezbędne do działania serwisu.</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-xs font-medium bg-blue-200 text-blue-800 px-2 py-0.5 rounded">Analityczne</span>
                  <p className="text-sm">Google Analytics - statystyki odwiedzin (anonimowe).</p>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-xs font-medium bg-purple-200 text-purple-800 px-2 py-0.5 rounded">Funkcjonalne</span>
                  <p className="text-sm">Zapamiętywanie preferencji, sesja czatu AI.</p>
                </div>
              </div>

              <p>8.2. Możesz zarządzać cookies w ustawieniach przeglądarki. Wyłączenie cookies może ograniczyć funkcjonalność serwisu.</p>
              <p>8.3. Szczegółowa lista cookies dostępna jest w ustawieniach prywatności przeglądarki.</p>
            </div>
          </section>

          {/* §9 */}
          <section id="bezpieczenstwo" className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 m-0">§9. Bezpieczeństwo danych</h2>
            </div>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>9.1. Stosujemy następujące środki bezpieczeństwa:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Szyfrowanie SSL/TLS dla wszystkich połączeń</li>
                <li>Szyfrowanie danych w bazie (at-rest encryption)</li>
                <li>Regularne kopie zapasowe</li>
                <li>Kontrola dostępu (role i uprawnienia)</li>
                <li>Monitorowanie i audyty bezpieczeństwa</li>
                <li>Bezpieczne przechowywanie haseł (bcrypt)</li>
              </ul>
              <p>9.2. Pomimo stosowania zabezpieczeń, żaden system nie jest w 100% bezpieczny. W przypadku naruszenia danych, poinformujemy Cię zgodnie z wymogami RODO.</p>
            </div>
          </section>

          {/* §10 */}
          <section id="zmiany" className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">§10. Zmiany Polityki Prywatności</h2>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>10.1. Zastrzegamy sobie prawo do zmiany niniejszej Polityki Prywatności.</p>
              <p>10.2. O istotnych zmianach poinformujemy poprzez:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Powiadomienie na stronie głównej serwisu</li>
                <li>Email do zarejestrowanych użytkowników</li>
              </ul>
              <p>10.3. Aktualna wersja Polityki jest zawsze dostępna pod adresem: <a href="https://www.serwis-zebry.pl/polityka-prywatnosci" className="text-blue-600 hover:underline">serwis-zebry.pl/polityka-prywatnosci</a></p>
              <p>10.4. Data ostatniej aktualizacji: <strong>5 grudnia 2025</strong></p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Masz pytania dotyczące prywatności?</p>
                <p className="text-sm text-gray-600 mb-4">
                  Skontaktuj się z nami w sprawie danych osobowych, praw RODO lub usunięcia konta.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="mailto:serwis@serwis-zebry.pl" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    serwis@serwis-zebry.pl
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
      </div>
    </div>
  )
}


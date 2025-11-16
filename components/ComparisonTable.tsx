import { Check, X } from 'lucide-react'

interface Benefit {
  text: string
  highlight?: boolean // Orange highlight for special features
}

const benefits: Benefit[] = [
  { text: 'Status naprawy na żywo' },
  { text: 'Historia wszystkich serwisów' },
  { text: 'Bezpośredni chat z serwisem' },
  { text: 'Automatyczne powiadomienia email' },
  { text: 'Faktury VAT dostępne od ręki' },
  { text: 'Płatność online kartą (Visa/Mastercard)', highlight: true },
  { text: 'Szybkie płatności (BLIK, Przelewy24)', highlight: true },
  { text: 'Ekskluzywne promocje na sprzęt', highlight: true },
  { text: 'Rabaty na części zamienne', highlight: true },
  { text: 'Dostęp do materiałów eksploatacyjnych', highlight: true },
]

export function ComparisonTable() {
  return (
    <div className="grid md:grid-cols-2 gap-4 mb-8">
      {/* LEFT COLUMN - WITH ACCOUNT */}
      <div className="border-2 border-orange-500 rounded-xl p-6 bg-orange-50">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
            <Check className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Z KONTEM</h3>
            <p className="text-sm text-gray-600">Pełny dostęp</p>
          </div>
        </div>

        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <li
              key={index}
              className={`flex items-start gap-2 text-sm ${
                benefit.highlight ? 'font-semibold text-orange-700' : 'text-gray-700'
              }`}
            >
              <Check
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  benefit.highlight ? 'text-orange-600' : 'text-green-600'
                }`}
                strokeWidth={2.5}
              />
              <span>{benefit.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT COLUMN - WITHOUT ACCOUNT */}
      <div className="border-2 border-gray-300 rounded-xl p-6 bg-gray-50">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center">
            <X className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">BEZ KONTA</h3>
            <p className="text-sm text-gray-600">Ograniczony dostęp</p>
          </div>
        </div>

        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-gray-500"
            >
              <X
                className="w-5 h-5 flex-shrink-0 mt-0.5 text-gray-400"
                strokeWidth={2.5}
              />
              <span className="line-through">
                {benefit.text.replace('na żywo', 'tylko tracking przez link')
                  .replace('wszystkich serwisów', 'brak historii')
                  .replace('Bezpośredni chat', 'Tylko email/telefon')
                  .replace('Automatyczne powiadomienia', 'Brak powiadomień')
                  .replace('dostępne od ręki', 'prośba każdorazowo')
                  .replace('Płatność online', 'Tylko przelew tradycyjny')
                  .replace('Szybkie płatności', 'Brak szybkich płatności')
                  .replace('Ekskluzywne promocje', 'Brak promocji')
                  .replace('Rabaty', 'Brak rabatów')
                  .replace('Dostęp do materiałów', 'Brak dostępu')}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
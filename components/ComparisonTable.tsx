import { Check, X } from 'lucide-react'

interface Benefit {
  text: string
  textShort: string
  highlight?: boolean
}

const benefits: Benefit[] = [
  { text: 'Status naprawy na żywo', textShort: 'Status na żywo' },
  { text: 'Historia serwisów', textShort: 'Historia' },
  { text: 'Chat z serwisem', textShort: 'Chat' },
  { text: 'Powiadomienia email', textShort: 'Powiadomienia' },
  { text: 'Płatność BLIK/kartą', textShort: 'BLIK/karta', highlight: true },
]

export function ComparisonTable() {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {/* LEFT COLUMN - WITH ACCOUNT */}
      <div className="border-2 border-orange-400 rounded-xl p-3 sm:p-4 bg-orange-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500 flex items-center justify-center">
            <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />
          </div>
          <h3 className="font-bold text-xs sm:text-sm text-gray-900">Z KONTEM</h3>
        </div>

        <ul className="space-y-1.5 sm:space-y-2">
          {benefits.map((benefit, index) => (
            <li
              key={index}
              className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm ${
                benefit.highlight ? 'font-semibold text-orange-700' : 'text-gray-700'
              }`}
            >
              <Check
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${
                  benefit.highlight ? 'text-orange-600' : 'text-green-600'
                }`}
                strokeWidth={3}
              />
              <span className="hidden sm:inline">{benefit.text}</span>
              <span className="sm:hidden">{benefit.textShort}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT COLUMN - WITHOUT ACCOUNT */}
      <div className="border-2 border-gray-300 rounded-xl p-3 sm:p-4 bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-400 flex items-center justify-center">
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />
          </div>
          <h3 className="font-bold text-xs sm:text-sm text-gray-900">BEZ KONTA</h3>
        </div>

        <ul className="space-y-1.5 sm:space-y-2">
          {benefits.map((_, index) => (
            <li
              key={index}
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={3} />
              <span>—</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
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
    <div className="grid grid-cols-2 gap-2 mb-3">
      {/* LEFT COLUMN - WITH ACCOUNT */}
      <div className="border border-orange-400 rounded-lg p-2.5 bg-orange-50">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </div>
          <h3 className="font-bold text-xs text-gray-900">Z KONTEM</h3>
        </div>

        <ul className="space-y-1">
          {benefits.map((benefit, index) => (
            <li
              key={index}
              className={`flex items-center gap-1 text-[10px] ${
                benefit.highlight ? 'font-semibold text-orange-700' : 'text-gray-700'
              }`}
            >
              <Check
                className={`w-3 h-3 flex-shrink-0 ${
                  benefit.highlight ? 'text-orange-600' : 'text-green-600'
                }`}
                strokeWidth={3}
              />
              <span>{benefit.textShort}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT COLUMN - WITHOUT ACCOUNT */}
      <div className="border border-gray-300 rounded-lg p-2.5 bg-gray-50">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
            <X className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </div>
          <h3 className="font-bold text-xs text-gray-900">BEZ KONTA</h3>
        </div>

        <ul className="space-y-1">
          {benefits.map((_, index) => (
            <li
              key={index}
              className="flex items-center gap-1 text-[10px] text-gray-400"
            >
              <X className="w-3 h-3 flex-shrink-0" strokeWidth={3} />
              <span>—</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
interface StatusBadgeProps {
  status: 'nowe' | 'odebrane' | 'diagnoza' | 'wycena' | 'w_naprawie' | 'zakonczone' | 'wyslane' | 'anulowane'
  size?: 'sm' | 'md' | 'lg'
}

const STATUS_CONFIG = {
  nowe: {
    label: 'Nowe zgłoszenie',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  odebrane: {
    label: 'Odebrane',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  diagnoza: {
    label: 'W diagnozie',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  wycena: {
    label: 'Oczekuje na wycenę',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  w_naprawie: {
    label: 'W naprawie',
    className: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  zakonczone: {
    label: 'Zakończone',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  wyslane: {
    label: 'Wysłane',
    className: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  anulowane: {
    label: 'Anulowane',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
}

const SIZE_CONFIG = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2',
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const sizeClass = SIZE_CONFIG[size]

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.className} ${sizeClass}`}
    >
      {config.label}
    </span>
  )
}
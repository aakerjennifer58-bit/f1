import { cn } from '@/lib/utils'

interface TierCardProps {
  limit: number
  fee: number
  isSelected: boolean
  isPopular?: boolean
  onClick: () => void
}

export function TierCard({ limit, fee, isSelected, isPopular, onClick }: TierCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-start p-5 rounded-xl border transition-all text-left w-full',
        isSelected
          ? 'border-l-4 border-l-green-500 border-t-gray-100 border-r-gray-100 border-b-gray-100 bg-green-50/30'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
      )}
    >
      {isPopular && (
        <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
          Most popular
        </span>
      )}
      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
        New limit
      </span>
      <span className={cn(
        'text-2xl font-bold mt-0.5',
        isSelected ? 'text-green-600' : 'text-gray-900'
      )}>
        Ksh {limit.toLocaleString()}
      </span>
      <span className="text-sm text-gray-500 mt-1">
        Fee <span className="font-semibold text-gray-700">Ksh {fee.toLocaleString()}</span>
      </span>
    </button>
  )
}

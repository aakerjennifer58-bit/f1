import { useState } from 'react'
import { TierCard } from '@/components/TierCard'
import { PaymentForm } from '@/components/PaymentForm'

const TIERS = [
  { limit: 3000, fee: 49 },
  { limit: 5000, fee: 99 },
  { limit: 6500, fee: 119 },
  { limit: 7500, fee: 150 },
  { limit: 10000, fee: 240 },
  { limit: 12500, fee: 360 },
  { limit: 16000, fee: 450 },
  { limit: 21000, fee: 570 },
  { limit: 25500, fee: 670, popular: true },
  { limit: 30000, fee: 780, popular: true },
  { limit: 35000, fee: 910 },
  { limit: 40000, fee: 1050 },
  { limit: 45000, fee: 1200 },
  { limit: 50000, fee: 1400 },
  { limit: 60000, fee: 1600 },
  { limit: 70000, fee: 2000 },
]

export default function App() {
  const [selectedTier, setSelectedTier] = useState(4) // Default to Ksh 10,000

  const selected = TIERS[selectedTier]

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Boost your{' '}
            <span className="bg-gradient-to-r from-green-500 to-orange-400 bg-clip-text text-transparent">
              Fuliza Limit
            </span>
          </h1>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">
            Choose your target limit, fill in your details and complete a secure payment to upgrade instantly.
          </p>
        </div>

        {/* Tier Grid */}
        <section aria-label="Available limits" className="grid grid-cols-2 gap-4">
          {TIERS.map((tier, index) => (
            <TierCard
              key={tier.limit}
              limit={tier.limit}
              fee={tier.fee}
              isSelected={selectedTier === index}
              isPopular={tier.popular}
              onClick={() => setSelectedTier(index)}
            />
          ))}
        </section>

        {/* Payment Form */}
        <section aria-label="Your details and payment">
          <PaymentForm selectedLimit={selected.limit} selectedFee={selected.fee} />
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 mt-10 max-w-xl mx-auto leading-relaxed">
          Fuliza Boost is an independent service designed to support users with M-PESA-related payment and limit-review services. Safaricom and M-PESA are registered trademarks of their respective owners.
        </footer>
      </div>
    </main>
  )
}

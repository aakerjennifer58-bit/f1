import { useState } from 'react'
import { TierCard } from '@/components/TierCard'
import { PaymentForm } from '@/components/PaymentForm'
import { SocialProof } from '@/components/SocialProof'
import { SplashScreen } from '@/components/SplashScreen'

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
  const [selectedTier, setSelectedTier] = useState(4)
  const selected = TIERS[selectedTier]

  return (
    <>
      <SplashScreen />
      <SocialProof />

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-slate-200/50">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-lg font-bold text-white shadow-lg">
                F
              </span>
              <span className="absolute -right-1 -top-1 size-3 rounded-full bg-orange-400 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900">FULIZA BOOST</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Limit Upgrade Service</span>
            </div>
          </div>
          <button className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200">
            Help
          </button>
        </div>
      </header>

      <main className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <section className="card-dark relative overflow-hidden mb-8">
            <div className="absolute inset-0 shimmer pointer-events-none" />
            <div className="relative">
              <div className="mb-4 flex items-center gap-2">
                <span className="badge bg-green-500/20 text-green-400">
                  <span className="size-1.5 rounded-full bg-green-400 animate-pulse" />
                  Instant Upgrade
                </span>
                <span className="badge bg-white/10 text-white/80">
                  M-Pesa
                </span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight">
                Boost Your{' '}
                <span className="text-green-400">Fuliza Limit</span>
              </h1>
              <p className="mt-2 text-white/70">
                Upgrade to up to Ksh 70,000 instantly
              </p>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                <div>
                  <p className="text-2xl font-bold text-green-400">250K+</p>
                  <p className="text-xs text-white/50">Upgrades Done</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">5min</p>
                  <p className="text-xs text-white/50">Avg. Time</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">4.8★</p>
                  <p className="text-xs text-white/50">User Rating</p>
                </div>
              </div>
            </div>
          </section>

          {/* Tier Selection */}
          <section className="mb-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Select Your Target Limit
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
            </div>
          </section>

          {/* Payment Form */}
          <section>
            <PaymentForm selectedLimit={selected.limit} selectedFee={selected.fee} />
          </section>

          {/* Trust Badges */}
          <section className="mt-8 rounded-2xl bg-slate-100/50 p-6">
            <div className="flex justify-center gap-8 mb-4">
              <div className="flex flex-col items-center gap-1">
                <span className="grid size-10 place-items-center rounded-full bg-white text-lg shadow">🔐</span>
                <span className="text-[10px] font-medium text-slate-500">Secure</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="grid size-10 place-items-center rounded-full bg-white text-lg shadow">⚡</span>
                <span className="text-[10px] font-medium text-slate-500">Instant</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="grid size-10 place-items-center rounded-full bg-white text-lg shadow">✓</span>
                <span className="text-[10px] font-medium text-slate-500">Verified</span>
              </div>
            </div>
            <p className="text-center text-xs text-slate-400">
              Trusted by over 250,000 Kenyans for Fuliza limit upgrades
            </p>
          </section>

          {/* Footer */}
          <footer className="text-center mt-10 space-y-4">
            <div className="flex justify-center gap-6 text-xs font-medium text-slate-400">
              <a href="#" className="hover:text-green-600">Privacy</a>
              <a href="#" className="hover:text-green-600">Terms</a>
              <a href="#" className="hover:text-green-600">Contact</a>
            </div>
            <p className="text-[10px] text-slate-400 max-w-md mx-auto leading-relaxed">
              Fuliza Boost is an independent service. Safaricom, Fuliza and M-PESA are registered trademarks of their respective owners.
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}

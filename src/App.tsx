import { useState, useEffect } from 'react'
import { TierCard } from '@/components/TierCard'
import { PaymentForm } from '@/components/PaymentForm'
import { SocialProof } from '@/components/SocialProof'
import { SplashScreen } from '@/components/SplashScreen'
import { Reviews } from '@/pages/Reviews'

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
  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [page, setPage] = useState(window.location.hash === '#reviews' ? 'reviews' : 'home')
  const selected = selectedTier !== null ? TIERS[selectedTier] : null

  useEffect(() => {
    const handleHash = () => setPage(window.location.hash === '#reviews' ? 'reviews' : 'home')
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const handleSelectTier = (index: number) => {
    setSelectedTier(index)
    setShowPayment(true)
  }

  if (page === 'reviews') return <Reviews />

  return (
    <>
      <SplashScreen />
      <SocialProof />

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-slate-200/50">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Safaricom" className="h-10 object-contain" />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900">FULIZA BOOST</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Limit Upgrade Service</span>
            </div>
          </div>
          <a href="mailto:hello@fulizaincreaseboost.com" className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200">
            Help
          </a>
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
                <img src="/mpesa.png" alt="Lipa Na M-Pesa" className="h-6 object-contain" />
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
                <a href="#reviews" className="block hover:opacity-80 transition">
                  <p className="text-2xl font-bold text-green-400">4.8★</p>
                  <p className="text-xs text-white/50 underline">Reviews</p>
                </a>
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
                  onClick={() => handleSelectTier(index)}
                />
              ))}
            </div>
          </section>

          {/* Payment Modal */}
          {showPayment && selected && (
            <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 pt-8 pb-8">
              <div className="card w-full max-w-md relative my-auto max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setShowPayment(false)}
                  className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
                >
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="mb-4 pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900">Complete Payment</h3>
                  <p className="text-sm text-slate-500">Target limit: <span className="font-semibold text-green-600">Ksh {selected.limit.toLocaleString()}</span></p>
                </div>

                <PaymentForm selectedLimit={selected.limit} selectedFee={selected.fee} />

                <button
                  onClick={() => setShowPayment(false)}
                  className="mt-4 w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Change Limit
                </button>
              </div>
            </div>
          )}

          {/* Trust Badges */}
          <section className="mt-8 rounded-2xl bg-slate-100/50 p-6">
            <div className="flex justify-center gap-8 mb-4">
              <div className="flex flex-col items-center gap-1">
                <span className="grid size-10 place-items-center rounded-full bg-white text-green-600 shadow">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <span className="text-[10px] font-medium text-slate-500">Secure</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="grid size-10 place-items-center rounded-full bg-white text-green-600 shadow">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <span className="text-[10px] font-medium text-slate-500">Instant</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="grid size-10 place-items-center rounded-full bg-white text-green-600 shadow">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
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
              <a href="mailto:hello@fulizaincreaseboost.com" className="hover:text-green-600">Contact</a>
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">
              <a href="mailto:hello@fulizaincreaseboost.com" className="hover:text-green-600">hello@fulizaincreaseboost.com</a>
            </p>
            <p className="text-[10px] text-slate-400 max-w-md mx-auto leading-relaxed">
              Fuliza Boost is an independent service. Safaricom, Fuliza and M-PESA are registered trademarks of their respective owners.
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}

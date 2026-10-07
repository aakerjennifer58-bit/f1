import { useEffect, useState } from 'react'

// ponytail: 100 random masked phones + Fuliza limits for social proof
const PROOFS = Array.from({ length: 100 }, () => {
  const prefix = ['07', '01'][Math.floor(Math.random() * 2)]
  const mid = Math.floor(Math.random() * 90 + 10)
  const end = Math.floor(Math.random() * 90 + 10)
  const limits = [3000, 5000, 6500, 7500, 10000, 12500, 16000, 21000, 25500, 30000, 35000, 40000, 45000, 50000, 60000, 70000]
  const limit = limits[Math.floor(Math.random() * limits.length)]
  return { phone: `${prefix}${mid}****${end}`, limit }
})

export function SocialProof() {
  const [current, setCurrent] = useState<typeof PROOFS[0] | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let idx = Math.floor(Math.random() * PROOFS.length)

    const show = () => {
      idx = (idx + 1) % PROOFS.length
      setCurrent(PROOFS[idx])
      setVisible(true)
      setTimeout(() => setVisible(false), 3000)
    }

    show()
    const interval = setInterval(show, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!current || !visible) return null

  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 animate-fade-in">
      <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
        <span className="grid size-6 place-items-center rounded-full bg-white/20 text-xs">✓</span>
        <span>{current.phone} boosted to <b>Ksh {current.limit.toLocaleString()}</b></span>
      </div>
    </div>
  )
}

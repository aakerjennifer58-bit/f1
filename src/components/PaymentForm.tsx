import { useState } from 'react'

interface PaymentFormProps {
  selectedLimit: number
  selectedFee: number
}

type Step = 'form' | 'waiting' | 'success' | 'failed'

const API_URL = import.meta.env.VITE_API_URL || '/api/mpesa'

const isSafaricom = (p: string) => /^(?:\+?254|0)(?:7\d{8}|1[01]\d{7})$/.test(p.replace(/\s/g, ''))

export function PaymentForm({ selectedLimit, selectedFee }: PaymentFormProps) {
  const [fullName, setFullName] = useState('')
  const [idNumber, setIdNumber] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [step, setStep] = useState<Step>('form')
  const [error, setError] = useState('')
  const [receipt, setReceipt] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isSafaricom(phoneNumber)) {
      setError('Enter a valid Safaricom number, e.g. 0712 345 678')
      return
    }

    setError('')
    setStep('waiting')

    const reference = `FLZ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

    try {
      const res = await fetch(`${API_URL}?action=initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          amount: selectedFee,
          reference,
          meta: { limit: selectedLimit, name: fullName, id: idNumber }
        })
      })

      const data = await res.json()

      if (!data.ok) {
        setError(data.error || 'Failed to initiate payment')
        setStep('failed')
        return
      }

      pollPaymentStatus(data.checkout_id)
    } catch {
      setError('Network error. Please try again.')
      setStep('failed')
    }
  }

  const pollPaymentStatus = async (checkoutId: string) => {
    let attempts = 0
    const maxAttempts = 60

    const poll = async () => {
      attempts++

      try {
        const res = await fetch(`${API_URL}?action=status&checkout_id=${checkoutId}`)
        const data = await res.json()

        if (data.status === 'paid') {
          setReceipt(data.receipt || '')
          setStep('success')
          return
        }

        if (data.status === 'failed' || data.status === 'cancelled') {
          setError(data.message || 'Payment was cancelled or failed')
          setStep('failed')
          return
        }

        if (attempts < maxAttempts) {
          setTimeout(poll, 2000)
        } else {
          setError('Payment timed out. If you paid, please contact support.')
          setStep('failed')
        }
      } catch {
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000)
        }
      }
    }

    setTimeout(poll, 3000)
  }

  const retry = () => {
    setStep('form')
    setError('')
  }

  if (step === 'waiting') {
    return (
      <div className="card py-10 text-center">
        <div className="mx-auto size-16 mb-6 relative">
          <div className="absolute inset-0 rounded-full border-4 border-green-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Check Your Phone</h2>
        <div className="bg-slate-900 rounded-xl p-4 mt-4 text-left max-w-xs mx-auto">
          <p className="text-xs text-slate-400">M-PESA</p>
          <p className="mt-1 text-sm text-white">Pay Ksh {selectedFee.toLocaleString()} to FULIZA BOOST?</p>
          <p className="mt-1 text-xs text-slate-400">Enter M-PESA PIN on your phone</p>
        </div>
        <p className="text-sm text-slate-500 mt-4">Waiting for payment confirmation...</p>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="card py-10 text-center">
        <div className="mx-auto size-16 grid place-items-center rounded-full bg-green-500 text-3xl text-white mb-4 animate-float">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
        <p className="text-slate-500">Ksh {selectedFee.toLocaleString()} received</p>
        {receipt && <p className="text-xs text-slate-400 mt-1">Receipt: {receipt}</p>}

        <div className="rounded-xl bg-green-50 border border-green-100 p-4 mt-6 max-w-xs mx-auto">
          <p className="text-sm text-slate-500">Your new Fuliza limit</p>
          <p className="text-3xl font-bold text-green-600">Ksh {selectedLimit.toLocaleString()}</p>
        </div>

        <p className="text-xs text-slate-400 mt-4">Your limit will be updated within 24 hours</p>
      </div>
    )
  }

  if (step === 'failed') {
    return (
      <div className="card py-10 text-center">
        <div className="mx-auto size-16 grid place-items-center rounded-full bg-red-500 text-3xl text-white mb-4">✗</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Payment Failed</h2>
        <p className="text-sm text-slate-500 mb-6">{error || 'The payment was not completed.'}</p>
        <button onClick={retry} className="btn max-w-xs mx-auto">Try Again</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="flex items-start justify-between mb-6 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Complete Payment</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Upgrade to Ksh {selectedLimit.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Amount</p>
          <p className="text-2xl font-bold text-green-600">Ksh {selectedFee.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Full Name (as on ID)
          </label>
          <input
            className="input"
            placeholder="Jane Wanjiku Mwangi"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            ID Number
          </label>
          <input
            className="input"
            placeholder="12345678"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            pattern="[0-9]{7,8}"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            M-Pesa Phone Number
          </label>
          <input
            className="input"
            placeholder="0712 345 678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button type="submit" className="btn text-lg font-bold">
          Pay Ksh {selectedFee.toLocaleString()}
        </button>
      </div>
    </form>
  )
}

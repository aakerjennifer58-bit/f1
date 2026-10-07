import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
      <div className="bg-gray-50/80 rounded-2xl p-6 mt-8 text-center">
        <div className="mx-auto size-10 animate-spin rounded-full border-4 border-green-500 border-t-transparent mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Check your phone</h2>
        <div className="bg-gray-900 rounded-xl p-4 mt-4 text-left text-white max-w-xs mx-auto">
          <p className="text-xs text-gray-400">M-PESA</p>
          <p className="mt-1 text-sm">Pay Ksh {selectedFee.toLocaleString()} to FULIZA BOOST?</p>
          <p className="mt-1 text-xs text-gray-400">Enter M-PESA PIN on your phone</p>
        </div>
        <p className="text-sm text-gray-500 mt-4">Enter your M-Pesa PIN to complete payment.</p>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="bg-gray-50/80 rounded-2xl p-6 mt-8 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-green-500 text-3xl text-white mb-4">✓</div>
        <h2 className="text-xl font-semibold text-gray-900">Payment Successful!</h2>
        <p className="text-gray-500 mt-2">
          Ksh {selectedFee.toLocaleString()} paid successfully.
        </p>
        {receipt && <p className="text-xs text-gray-400 mt-1">Receipt: {receipt}</p>}
        <p className="text-sm mt-4">
          Your Fuliza limit of <strong>Ksh {selectedLimit.toLocaleString()}</strong> is being processed.
        </p>
        <p className="text-xs text-gray-400 mt-2">You will receive an SMS confirmation shortly.</p>
      </div>
    )
  }

  if (step === 'failed') {
    return (
      <div className="bg-gray-50/80 rounded-2xl p-6 mt-8 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-red-500 text-3xl text-white mb-4">✗</div>
        <h2 className="text-xl font-semibold text-gray-900">Payment Failed</h2>
        <p className="text-sm text-gray-500 mt-2">{error || 'The payment was not completed.'}</p>
        <Button onClick={retry} className="mt-4">Try Again</Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50/80 rounded-2xl p-6 mt-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Complete payment</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            New limit Ksh {selectedLimit.toLocaleString()} · Fee Ksh {selectedFee.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Amount to pay</p>
          <p className="text-xl font-bold text-green-600">Ksh {selectedFee.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Names (as in ID)
          </label>
          <Input
            placeholder="Jane Wanjiku Mwangi"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <p className="text-xs text-gray-400 mt-1.5">
            Enter your full names as they appear on your ID.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            ID Number
          </label>
          <Input
            placeholder="12345678"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            pattern="[0-9]{7,8}"
            required
          />
          <p className="text-xs text-gray-400 mt-1.5">
            Enter your Kenyan National ID number (7-8 digits).
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            M-Pesa Phone Number
          </label>
          <Input
            placeholder="0712345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <p className="text-xs text-gray-400 mt-1.5">
            Formats accepted: 07XXXXXXXX, 01XXXXXXXX or 2547XXXXXXXX.
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" size="lg" className="w-full mt-2">
          Pay Ksh {selectedFee.toLocaleString()} with M-Pesa
        </Button>
      </div>
    </form>
  )
}

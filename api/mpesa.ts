import type { VercelRequest, VercelResponse } from '@vercel/node'

const MPESA = {
  consumerKey: process.env.MPESA_CONSUMER_KEY || '',
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
  shortcode: process.env.MPESA_SHORTCODE || '',
  passkey: process.env.MPESA_PASSKEY || '',
  till: process.env.MPESA_TILL || '',
  callbackUrl: process.env.MPESA_CALLBACK_URL || '',
  env: process.env.MPESA_ENV || 'live',
}

const host = () => MPESA.env === 'sandbox'
  ? 'https://sandbox.safaricom.co.ke'
  : 'https://api.safaricom.co.ke'

const formatPhone = (raw: string): string | null => {
  let d = raw.replace(/\D+/g, '')
  if (!d) return null
  if (d.startsWith('254')) {
    // already international
  } else if (d.startsWith('0')) {
    d = '254' + d.slice(1)
  } else if (/^[17]/.test(d)) {
    d = '254' + d
  }
  return /^254[17]\d{8}$/.test(d) ? d : null
}

async function getToken(): Promise<{ token: string } | { error: string }> {
  if (!MPESA.consumerKey || !MPESA.consumerSecret) {
    return { error: 'Missing MPESA_CONSUMER_KEY or MPESA_CONSUMER_SECRET in environment' }
  }
  const auth = Buffer.from(`${MPESA.consumerKey}:${MPESA.consumerSecret}`).toString('base64')
  const res = await fetch(`${host()}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` }
  })
  const data = await res.json()
  if (!res.ok || !data.access_token) {
    return { error: data.errorMessage || data.error_description || `Auth failed: HTTP ${res.status}` }
  }
  return { token: data.access_token }
}

async function stkPush(phone: string, amount: number, reference: string, meta: Record<string, unknown> = {}) {
  // Check required env vars
  const missing = ['consumerKey', 'consumerSecret', 'shortcode', 'passkey', 'till', 'callbackUrl']
    .filter(k => !MPESA[k as keyof typeof MPESA])
  if (missing.length) return { ok: false, error: `Missing env: ${missing.map(k => 'MPESA_' + k.replace(/([A-Z])/g, '_$1').toUpperCase()).join(', ')}` }

  const msisdn = formatPhone(phone)
  if (!msisdn) return { ok: false, error: 'Invalid phone number' }
  if (amount < 1) return { ok: false, error: 'Amount must be at least 1' }

  const auth = await getToken()
  if ('error' in auth) return { ok: false, error: auth.error }
  const token = auth.token

  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
  const password = Buffer.from(`${MPESA.shortcode}${MPESA.passkey}${timestamp}`).toString('base64')

  const transactionType = MPESA.till !== MPESA.shortcode
    ? 'CustomerBuyGoodsOnline'
    : 'CustomerPayBillOnline'

  const res = await fetch(`${host()}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      BusinessShortCode: MPESA.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: transactionType,
      Amount: amount,
      PartyA: msisdn,
      PartyB: MPESA.till,
      PhoneNumber: msisdn,
      CallBackURL: MPESA.callbackUrl,
      AccountReference: reference.slice(0, 12),
      TransactionDesc: reference.slice(0, 12),
    })
  })

  const data = await res.json()

  if (!res.ok || data.ResponseCode !== '0' || !data.CheckoutRequestID) {
    const why = data.errorMessage || data.ResponseDescription || data.errorCode || `HTTP ${res.status}`
    // ponytail: show raw error for debugging
    return { ok: false, error: why }
  }

  return {
    ok: true,
    checkout_id: data.CheckoutRequestID,
    message: data.CustomerMessage || 'Check your phone and enter M-Pesa PIN'
  }
}

async function queryStatus(checkoutId: string) {
  const auth = await getToken()
  if ('error' in auth) return { ok: false, error: auth.error }
  const token = auth.token

  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)
  const password = Buffer.from(`${MPESA.shortcode}${MPESA.passkey}${timestamp}`).toString('base64')

  const res = await fetch(`${host()}/mpesa/stkpushquery/v1/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      BusinessShortCode: MPESA.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutId,
    })
  })

  const data = await res.json()

  if (data.ResultCode === '0') {
    return { ok: true, status: 'paid', receipt: data.MpesaReceiptNumber || '' }
  } else if (data.ResultCode === '1032') {
    return { ok: true, status: 'cancelled', message: 'Payment was cancelled' }
  } else if (data.ResultCode === '1037') {
    return { ok: true, status: 'timeout', message: 'Payment timed out' }
  } else if (data.errorCode === '500.001.1001') {
    return { ok: true, status: 'pending', message: 'Still processing' }
  }

  return { ok: true, status: 'pending', message: data.ResultDesc || 'Processing' }
}

// In-memory store for demo. Use Vercel KV or database in production.
const payments: Map<string, { status: string; receipt?: string; amount: number; phone: string }> = new Map()

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const action = req.query.action as string

  try {
    switch (action) {
      case 'initiate': {
        if (req.method !== 'POST') {
          return res.status(405).json({ ok: false, error: 'POST only' })
        }
        const { phone, amount, reference, meta } = req.body
        const result = await stkPush(phone, amount, reference, meta)

        if (result.ok && result.checkout_id) {
          payments.set(result.checkout_id, { status: 'pending', amount, phone })
        }

        return res.status(result.ok ? 200 : 422).json(result)
      }

      case 'status': {
        const checkoutId = req.query.checkout_id as string
        if (!checkoutId) {
          return res.status(400).json({ ok: false, error: 'checkout_id required' })
        }

        // Query Safaricom directly
        const result = await queryStatus(checkoutId)

        if (result.status === 'paid') {
          payments.set(checkoutId, { ...payments.get(checkoutId)!, status: 'paid', receipt: result.receipt })
        }

        return res.json(result)
      }

      case 'callback': {
        // Safaricom callback
        const body = req.body?.Body?.stkCallback
        if (!body) {
          return res.json({ ResultCode: 0, ResultDesc: 'Accepted' })
        }

        const checkoutId = body.CheckoutRequestID
        if (body.ResultCode === 0) {
          const items: Record<string, unknown> = {}
          for (const item of body.CallbackMetadata?.Item || []) {
            items[item.Name] = item.Value
          }
          payments.set(checkoutId, {
            ...payments.get(checkoutId)!,
            status: 'paid',
            receipt: String(items.MpesaReceiptNumber || '')
          })
        } else {
          const existing = payments.get(checkoutId)
          if (existing) {
            payments.set(checkoutId, { ...existing, status: 'failed' })
          }
        }

        return res.json({ ResultCode: 0, ResultDesc: 'Accepted' })
      }

      default:
        return res.status(400).json({ ok: false, error: 'Invalid action' })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}

import { useState } from 'react'

const FIRST_NAMES = ['John', 'Mary', 'James', 'Grace', 'Peter', 'Faith', 'David', 'Esther', 'Joseph', 'Sarah', 'Michael', 'Ann', 'Daniel', 'Joyce', 'Samuel', 'Nancy', 'Patrick', 'Lucy', 'George', 'Rose', 'Brian', 'Jane', 'Kevin', 'Mercy', 'Charles', 'Beatrice', 'Francis', 'Caroline', 'Vincent', 'Margaret', 'Paul', 'Winnie', 'Robert', 'Gladys', 'Stephen', 'Alice', 'Anthony', 'Florence', 'Martin', 'Eunice']

const COMMENTS_EN = [
  "This service is amazing! Got my limit increased within minutes.",
  "Very fast and reliable. Recommended to all my friends.",
  "I was skeptical at first but it actually works!",
  "Best Fuliza upgrade service I've found. No delays.",
  "Customer service is excellent. They helped me through the process.",
  "My limit went from 3k to 25k in just one day!",
  "Trusted service. Have used it 3 times now.",
  "Quick and efficient. Money well spent.",
  "Finally a service that delivers what it promises.",
  "The process was so simple. Just pay and wait.",
  "Got my upgrade notification same day!",
  "Legit service. Don't hesitate to use it.",
  "Was able to access more Fuliza when I needed it most.",
  "Highly recommend this to anyone struggling with low limits.",
  "Professional service from start to finish.",
  "My Fuliza limit doubled after using this service.",
  "Fast processing. Received confirmation within hours.",
  "This saved me during an emergency. Thank you!",
  "Real service with real results. 5 stars!",
  "Payment was secure and upgrade was quick.",
  "Better than I expected. Will use again.",
  "Genuine service. Limit increased as promised.",
  "Easy process, fast results. Very happy!",
  "Worth every shilling. My limit is now 40k!",
  "Smooth experience from payment to upgrade.",
]

const COMMENTS_SW = [
  "Huduma nzuri sana! Limit yangu iliongezeka haraka.",
  "Wameniongezea limit yangu kwa masaa machache tu.",
  "Asante sana! Nilikuwa na shida na limit ndogo.",
  "Huduma ya kuaminika. Nimeshawaambia marafiki wangu.",
  "Pesa yangu ilitumika vizuri. Limit imeongezeka!",
  "Haraka sana! Sikutarajia kupata matokeo haya.",
  "Watu wazuri na huduma nzuri. Nashukuru!",
  "Limit yangu iliongezeka kutoka 5k hadi 30k!",
  "Sio uongo! Huduma hii ni halisi kabisa.",
  "Nimefurahi sana na matokeo. Asanteni!",
  "Kazi nzuri! Mmeokoa familia yangu wakati wa dharura.",
  "Huduma ya kweli. Sio kama zingine za uongo.",
  "Wanafanya kazi yao vizuri. Hongera!",
  "Mimi nilisita mwanzoni lakini nimeridhika sasa.",
  "Limit yangu imeongezeka mara mbili. Asante!",
  "Urahisi wa kulipa na kupata matokeo. Poa!",
  "Nawapendekezea wote wenye limit ndogo.",
  "Hawakuchelewesha. Nilipata upgrade siku ile ile.",
  "Wataalamu wazuri. Wanajibu maswali yote.",
  "Fuliza yangu sasa ni 50k! Sina maneno!",
]

const MIXED_COMMENTS = [
  "Huduma nzuri! Very fast and reliable.",
  "Amazing service! Wameongeza limit yangu haraka sana.",
  "I was worried at first lakini it actually worked!",
  "Best service! Asante sana for helping me.",
  "Quick processing! Nilipata upgrade same day.",
  "Legit kabisa! My limit increased in hours.",
  "Customer service ni poa. They explained everything.",
  "Nawareccomend to everyone! Very trustworthy.",
  "Paid 670 bob na my limit went to 25k!",
  "Wamefanya kazi nzuri! Will definitely use again.",
  "Fast and efficient! Hakuna delays kabisa.",
  "My experience was great! Asante sana team.",
  "Nilisita lakini now I'm a happy customer!",
  "Genuine service! Sio scam like others.",
  "Worth it completely! Limit yangu ni sasa 45k.",
]

function generateReviews(count: number) {
  const reviews = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
    const lastInitial = String.fromCharCode(65 + Math.floor(Math.random() * 26))

    let comment: string
    const langChoice = Math.random()
    if (langChoice < 0.4) {
      comment = COMMENTS_EN[Math.floor(Math.random() * COMMENTS_EN.length)]
    } else if (langChoice < 0.7) {
      comment = COMMENTS_SW[Math.floor(Math.random() * COMMENTS_SW.length)]
    } else {
      comment = MIXED_COMMENTS[Math.floor(Math.random() * MIXED_COMMENTS.length)]
    }

    const rating = Math.random() < 0.7 ? 5 : 4

    // Time: spread over last 90 days with more recent reviews
    const daysAgo = Math.floor(Math.pow(Math.random(), 1.5) * 90)
    const hoursAgo = Math.floor(Math.random() * 24)
    const timestamp = now - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000)

    reviews.push({
      id: i + 1,
      name: `${firstName} ${lastInitial}.`,
      rating,
      comment,
      timestamp,
      verified: Math.random() < 0.85,
    })
  }

  return reviews.sort((a, b) => b.timestamp - a.timestamp)
}

function formatTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  if (weeks < 4) return `${weeks}w ago`
  return `${months}mo ago`
}

const REVIEWS = generateReviews(215)

export function Reviews() {
  const [visibleCount, setVisibleCount] = useState(20)

  const avgRating = (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length).toFixed(1)
  const fiveStarCount = REVIEWS.filter(r => r.rating === 5).length
  const fourStarCount = REVIEWS.filter(r => r.rating === 4).length

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Customer Reviews</h1>
          <p className="text-slate-500">What our customers say about Fuliza Boost</p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-slate-900">{avgRating}</span>
                <div className="flex text-yellow-400">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="size-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-1">{REVIEWS.length} verified reviews</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">5 star</span>
                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(fiveStarCount / REVIEWS.length) * 100}%` }} />
                </div>
                <span className="text-slate-700 font-medium">{fiveStarCount}</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-1">
                <span className="text-slate-500">4 star</span>
                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(fourStarCount / REVIEWS.length) * 100}%` }} />
                </div>
                <span className="text-slate-700 font-medium">{fourStarCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {REVIEWS.slice(0, visibleCount).map(review => (
            <div key={review.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                    {review.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{review.name}</span>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Verified</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex text-yellow-400">
                        {[1,2,3,4,5].map(i => (
                          <svg key={i} className={`size-3.5 ${i <= review.rating ? 'text-yellow-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">{formatTime(review.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Load More */}
        {visibleCount < REVIEWS.length && (
          <button
            onClick={() => setVisibleCount(v => Math.min(v + 20, REVIEWS.length))}
            className="w-full mt-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition"
          >
            Load More Reviews ({REVIEWS.length - visibleCount} remaining)
          </button>
        )}

        {/* Back Link */}
        <a href="/" className="block text-center mt-6 text-green-600 font-medium hover:underline">
          ← Back to Home
        </a>
      </div>
    </div>
  )
}

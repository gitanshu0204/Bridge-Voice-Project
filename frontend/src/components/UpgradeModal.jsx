import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function UpgradeModal({ feature, onClose }) {
  const navigate = useNavigate()
  const [billing, setBilling] = useState('monthly')
  const [email, setEmail] = useState('')
  const [notified, setNotified] = useState(false)
  const [visiblePlans, setVisiblePlans] = useState([])
  const [showHeader, setShowHeader] = useState(false)
  const [showFooter, setShowFooter] = useState(false)

  const featureNames = {
    chat: 'AI Chat',
    grammar: 'Grammar Checker',
    pronunciation: 'Pronunciation Scorer',
    interview: 'Interview Simulator',
    quiz_ai: 'AI Quiz',
    daily_challenge: 'Daily Challenge'
  }

  const limits = {
    chat: 10,
    grammar: 5,
    pronunciation: 5,
    interview: 3,
    quiz_ai: 3,
    daily_challenge: 3
  }

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      icon: '🌱',
      color: 'from-gray-600 to-gray-800',
      borderColor: 'border-gray-700',
      cta: 'Current Plan',
      ctaDisabled: true,
      features: [
        `${featureNames[feature]} — ${limits[feature]}/day`,
        'Basic Dictionary & Translator',
        'Culture Guide',
        'Level 1 & 2 Quiz only',
      ]
    },
    {
      name: 'Pro',
      price: { monthly: 9.99, yearly: 7.99 },
      icon: '🚀',
      color: 'from-purple-600 to-blue-600',
      borderColor: 'border-purple-500',
      popular: true,
      cta: 'Start 7-Day Free Trial',
      features: [
        `Unlimited ${featureNames[feature]}`,
        'Unlimited All Features',
        'Company-Specific Interviews',
        'AI Quiz Generation',
        'All 5 Quiz Levels',
        'Conversation History',
      ]
    },
    {
      name: 'Premium',
      price: { monthly: 19.99, yearly: 15.99 },
      icon: '👑',
      color: 'from-yellow-600 to-orange-600',
      borderColor: 'border-yellow-500',
      cta: 'Get Premium',
      features: [
        'Everything in Pro',
        'Priority AI Speed (3x faster)',
        'Weekly AI Progress Report',
        'Custom Learning Path',
        'Certificate of Completion',
        '1-on-1 AI Tutoring',
      ]
    }
  ]

  // Animate in one by one
  useEffect(() => {
    // Show header first
    setTimeout(() => setShowHeader(true), 100)

    // Show each plan one by one
    setTimeout(() => setVisiblePlans([0]), 400)
    setTimeout(() => setVisiblePlans([0, 1]), 800)
    setTimeout(() => setVisiblePlans([0, 1, 2]), 1200)

    // Show footer last
    setTimeout(() => setShowFooter(true), 1600)
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative max-w-4xl w-full my-4">

        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-20"></div>

        <div className="relative bg-gray-900 border border-purple-700 rounded-3xl p-8 shadow-2xl">

          {/* Header — fades in first */}
          <div className={`text-center mb-8 transition-all duration-700 ${
            showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl shadow-purple-900">
              🚀
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Daily Limit Reached!</h3>
            <p className="text-gray-400">
              You've used all{' '}
              <span className="text-white font-semibold">{limits[feature]} free {featureNames[feature]}</span>{' '}
              sessions for today.
            </p>

            <div className="inline-flex items-center gap-2 bg-blue-900 bg-opacity-20 border border-blue-800 rounded-full px-4 py-2 mt-3">
              <span className="text-blue-300 text-sm">🔄 Free limit resets tomorrow at midnight</span>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
              <button
                onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
                className={`w-12 h-6 rounded-full transition-all relative ${
                  billing === 'yearly' ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-700'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
                  billing === 'yearly' ? 'translate-x-7' : 'translate-x-1'
                }`}></div>
              </button>
              <span className={`text-sm font-medium ${billing === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
                Yearly
                <span className="ml-2 bg-green-900 bg-opacity-50 border border-green-700 text-green-400 text-xs px-2 py-0.5 rounded-full">
                  Save 20%
                </span>
              </span>
            </div>
          </div>

          {/* Plans — slide in one by one */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative bg-gray-800 border-2 ${plan.borderColor} rounded-2xl p-5 transition-all duration-700 ${
                  visiblePlans.includes(i)
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-12 scale-95'
                } ${plan.popular ? 'shadow-xl shadow-purple-900' : ''}`}
              >
                {/* Glow for popular */}
                {plan.popular && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-10 -z-10"></div>
                )}

                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      ⭐ MOST POPULAR
                    </span>
                  </div>
                )}

                {/* Animated Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center text-2xl mb-3 shadow-lg transition-all duration-500 ${
                  visiblePlans.includes(i) ? 'rotate-0 scale-100' : 'rotate-12 scale-75'
                }`}>
                  {plan.icon}
                </div>

                <h4 className="font-bold text-white text-lg mb-1">{plan.name}</h4>

                {/* Price */}
                <div className="mb-4">
                  {plan.price.monthly === 0 ? (
                    <p className="text-3xl font-bold text-white">Free</p>
                  ) : (
                    <div>
                      <div className="flex items-end gap-1">
                        <span className="text-gray-400">$</span>
                        <span className="text-3xl font-bold text-white">
                          {billing === 'yearly' ? plan.price.yearly : plan.price.monthly}
                        </span>
                        <span className="text-gray-400 text-xs mb-1">/mo</span>
                      </div>
                      {billing === 'yearly' && (
                        <p className="text-green-400 text-xs mt-0.5">
                          Save ${((plan.price.monthly - plan.price.yearly) * 12).toFixed(0)}/year
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Features — staggered animation */}
                <ul className="space-y-2 mb-5">
                  {plan.features.map((f, j) => (
                    <li
                      key={j}
                      className={`flex items-start gap-2 text-xs text-gray-300 transition-all duration-500 ${
                        visiblePlans.includes(i)
                          ? 'opacity-100 translate-x-0'
                          : 'opacity-0 -translate-x-4'
                      }`}
                      style={{ transitionDelay: `${j * 100}ms` }}
                    >
                      <span className="text-green-400 mt-0.5 flex-shrink-0">✅</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => {
                    if (!plan.ctaDisabled) {
                      navigate('/pricing')
                      onClose()
                    }
                  }}
                  disabled={plan.ctaDisabled}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg ${
                    plan.ctaDisabled
                      ? 'bg-gray-700 border border-gray-600 text-gray-400 cursor-default'
                      : `bg-gradient-to-r ${plan.color} text-white hover:opacity-90 hover:scale-105`
                  } ${visiblePlans.includes(i) ? 'opacity-100' : 'opacity-0'}`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Footer — fades in last */}
          <div className={`transition-all duration-700 ${
            showFooter ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {!notified ? (
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 mb-4">
                <p className="text-gray-300 text-sm font-medium mb-3 text-center">
                  🔔 Get notified when payments launch + 20% discount!
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition text-sm"
                  />
                  <button
                    onClick={() => { if (email) setNotified(true) }}
                    disabled={!email}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl font-medium text-sm transition disabled:opacity-50"
                  >
                    Notify Me
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-green-900 bg-opacity-30 border border-green-700 rounded-2xl p-4 mb-4 text-center">
                <p className="text-green-400 font-bold">✅ You're on the waitlist!</p>
                <p className="text-gray-400 text-sm mt-1">We'll notify you at {email} when payments launch!</p>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-300 text-sm transition"
              >
                I'll wait until tomorrow
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default UpgradeModal
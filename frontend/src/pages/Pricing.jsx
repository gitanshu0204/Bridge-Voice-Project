import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { getUsageStats } from '../utils/usageTracker'

function Pricing() {
  const navigate = useNavigate()
  const [billing, setBilling] = useState('monthly')
  const [showModal, setShowModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [email, setEmail] = useState('')
  const [notified, setNotified] = useState(false)
  const usageStats = getUsageStats()

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      icon: '🌱',
      color: 'from-gray-600 to-gray-800',
      borderColor: 'border-gray-700',
      glowColor: 'shadow-gray-900',
      description: 'Perfect for getting started',
      cta: 'Current Plan',
      ctaDisabled: true,
      features: [
        { text: 'AI Chat — 10 messages/day', included: true },
        { text: 'Grammar Checker — 5/day', included: true },
        { text: 'Quiz — Level 1 & 2 only', included: true },
        { text: 'Dictionary & Translator', included: true },
        { text: 'Daily Challenge — 3/day', included: true },
        { text: 'Culture Guide', included: true },
        { text: 'Pronunciation Scorer — 5/day', included: true },
        { text: 'Interview Simulator — 3/day', included: true },
        { text: 'Company-Specific Interview', included: false },
        { text: 'AI Quiz Generation', included: false },
        { text: 'Conversation History', included: false },
        { text: 'Priority AI Speed', included: false },
      ]
    },
    {
      name: 'Pro',
      price: { monthly: 9.99, yearly: 7.99 },
      icon: '🚀',
      color: 'from-purple-600 to-blue-600',
      borderColor: 'border-purple-500',
      glowColor: 'shadow-purple-900',
      description: 'Most popular for serious learners',
      cta: 'Start 7-Day Free Trial',
      popular: true,
      features: [
        { text: 'Unlimited AI Chat', included: true },
        { text: 'Unlimited Grammar Checker', included: true },
        { text: 'Quiz — All 5 Levels', included: true },
        { text: 'Dictionary & Translator', included: true },
        { text: 'Unlimited Daily Challenges', included: true },
        { text: 'Culture Guide', included: true },
        { text: 'Unlimited Pronunciation Scorer', included: true },
        { text: 'Unlimited Interview Simulator', included: true },
        { text: 'Company-Specific Interview', included: true },
        { text: 'AI Quiz Generation', included: true },
        { text: 'Conversation History', included: true },
        { text: 'Priority AI Speed', included: false },
      ]
    },
    {
      name: 'Premium',
      price: { monthly: 19.99, yearly: 15.99 },
      icon: '👑',
      color: 'from-yellow-600 to-orange-600',
      borderColor: 'border-yellow-500',
      glowColor: 'shadow-yellow-900',
      description: 'For maximum results',
      cta: 'Get Premium',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Priority AI Speed (3x faster)', included: true },
        { text: 'Advanced Analytics', included: true },
        { text: 'Weekly AI Progress Report', included: true },
        { text: 'Custom Learning Path', included: true },
        { text: 'Certificate of Completion', included: true },
        { text: '1-on-1 AI Tutoring', included: true },
        { text: 'Resume Review Feature', included: true },
        { text: 'Job Application Assistant', included: true },
        { text: 'Offline Mode', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Early Access to New Features', included: true },
      ]
    }
  ]

  const faqs = [
    { q: 'Can I cancel anytime?', a: 'Yes! Cancel anytime with no questions asked. Your access continues until the end of your billing period.' },
    { q: 'Is my payment secure?', a: 'Yes! We use Stripe for secure payment processing. We never store your card details.' },
    { q: 'What happens when I hit the free limit?', a: 'You will see an upgrade prompt. You can still use other free features until the next day when limits reset.' },
    { q: 'Do you offer student discounts?', a: 'Yes! Students get 50% off Pro plan. Contact us with your student email for the discount code.' },
    { q: 'Is there a free trial for Pro?', a: 'Yes! New users get a 7-day free trial of Pro — no credit card required.' },
  ]

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-purple-900 bg-opacity-30 border border-purple-700 rounded-full px-4 py-2 mb-4">
            <span className="text-purple-400 text-sm font-medium">💎 Simple Pricing</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-3">
            Invest in Your{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              English Future
            </span>
          </h2>
          <p className="text-gray-400 text-lg">Start free, upgrade when you need more. Cancel anytime.</p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-white' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
              className={`w-14 h-7 rounded-full transition-all relative ${
                billing === 'yearly'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                  : 'bg-gray-700'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${
                billing === 'yearly' ? 'translate-x-8' : 'translate-x-1'
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

        {/* Usage Stats */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="font-bold text-gray-200 mb-4">📊 Your Daily Usage (Free Plan)</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: 'chat', label: 'AI Chat', icon: '🗣️' },
              { key: 'grammar', label: 'Grammar', icon: '✍️' },
              { key: 'pronunciation', label: 'Pronunciation', icon: '🎤' },
              { key: 'interview', label: 'Interview', icon: '💼' },
              { key: 'quiz_ai', label: 'AI Quiz', icon: '🧠' },
              { key: 'daily_challenge', label: 'Daily Challenge', icon: '🎯' },
            ].map((item, i) => {
              const stat = usageStats[item.key]
              const percentage = (stat.used / stat.limit) * 100
              return (
                <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span className="text-xs text-gray-400 font-medium">{item.label}</span>
                    </div>
                    <span className={`text-xs font-bold ${
                      percentage >= 100 ? 'text-red-400' :
                      percentage >= 70 ? 'text-orange-400' : 'text-green-400'
                    }`}>{stat.used}/{stat.limit}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        percentage >= 100 ? 'bg-red-500' :
                        percentage >= 70 ? 'bg-orange-500' : 'bg-gradient-to-r from-purple-600 to-blue-600'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative bg-gray-900 border-2 ${plan.borderColor} rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] shadow-2xl ${plan.glowColor} ${
                plan.popular ? 'md:-mt-4 md:mb-4' : ''
              }`}
            >
              {/* Glow */}
              {plan.popular && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-10 -z-10"></div>
              )}

              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    ⭐ MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className={`w-14 h-14 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg hover:scale-110 transition`}>
                {plan.icon}
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-gray-800">
                {plan.price.monthly === 0 ? (
                  <div>
                    <p className="text-5xl font-bold text-white">Free</p>
                    <p className="text-gray-500 text-sm mt-1">Forever</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-end gap-1">
                      <span className="text-gray-400 text-lg">$</span>
                      <span className="text-5xl font-bold text-white">
                        {billing === 'yearly' ? plan.price.yearly : plan.price.monthly}
                      </span>
                      <span className="text-gray-400 text-sm mb-1">/mo</span>
                    </div>
                    {billing === 'yearly' && (
                      <p className="text-green-400 text-xs mt-1">
                        Billed ${(plan.price.yearly * 12).toFixed(0)}/year — Save ${((plan.price.monthly - plan.price.yearly) * 12).toFixed(0)}!
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  if (!plan.ctaDisabled) {
                    setSelectedPlan(plan)
                    setShowModal(true)
                  }
                }}
                disabled={plan.ctaDisabled}
                className={`w-full py-3 rounded-xl font-bold transition mb-6 shadow-lg ${
                  plan.ctaDisabled
                    ? 'bg-gray-800 border border-gray-600 text-gray-400 cursor-default'
                    : `bg-gradient-to-r ${plan.color} text-white hover:opacity-90 hover:scale-105`
                }`}
              >
                {plan.cta}
              </button>

              {/* Features */}
              <div className="space-y-2.5">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <span className={`text-sm flex-shrink-0 ${feature.included ? 'text-green-400' : 'text-gray-700'}`}>
                      {feature.included ? '✅' : '❌'}
                    </span>
                    <p className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-600'}`}>
                      {feature.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🔒', title: 'Secure Payments', desc: 'Powered by Stripe' },
            { icon: '🔄', title: 'Cancel Anytime', desc: 'No contracts or fees' },
            { icon: '🎓', title: 'Student Discount', desc: '50% off Pro plan' },
            { icon: '⚡', title: '7-Day Free Trial', desc: 'No credit card needed' },
          ].map((badge, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center hover:border-gray-600 hover:scale-105 transition group">
              <p className="text-3xl mb-2 group-hover:scale-110 transition">{badge.icon}</p>
              <p className="font-semibold text-gray-200 text-sm">{badge.title}</p>
              <p className="text-gray-500 text-xs mt-0.5">{badge.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="font-bold text-gray-200 text-xl mb-6 text-center">❓ Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition">
                <p className="font-semibold text-gray-200 mb-1 text-sm">Q: {faq.q}</p>
                <p className="text-gray-400 text-sm">A: {faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Upgrade Modal */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-20"></div>
            <div className="relative bg-gray-900 border border-purple-700 rounded-3xl p-8 shadow-2xl">

              <div className={`w-16 h-16 bg-gradient-to-br ${selectedPlan.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-xl`}>
                {selectedPlan.icon}
              </div>
              <h3 className="text-2xl font-bold text-white text-center mb-2">Upgrade to {selectedPlan.name}</h3>
              <p className="text-gray-400 text-center text-sm mb-6">
                ${billing === 'yearly' ? selectedPlan.price.yearly : selectedPlan.price.monthly}/month
                {billing === 'yearly' ? ' billed yearly' : ''}
              </p>

              <div className="bg-yellow-900 bg-opacity-20 border border-yellow-800 rounded-xl p-4 mb-6 text-center">
                <p className="text-yellow-400 font-semibold">🚧 Coming Soon!</p>
                <p className="text-gray-400 text-sm mt-1">Payment is being set up. Join the waitlist for early access and a special discount!</p>
              </div>

              {!notified ? (
                <div className="space-y-3 mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email for early access..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition"
                  />
                  <button
                    onClick={() => { if (email) setNotified(true) }}
                    disabled={!email}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl font-bold transition disabled:opacity-50"
                  >
                    🔔 Notify Me + Get 20% Discount
                  </button>
                </div>
              ) : (
                <div className="bg-green-900 bg-opacity-30 border border-green-700 rounded-xl p-4 mb-4 text-center">
                  <p className="text-green-400 font-bold">✅ You're on the waitlist!</p>
                  <p className="text-gray-400 text-sm mt-1">We'll notify you at {email} when payments launch!</p>
                </div>
              )}

              <button
                onClick={() => { setShowModal(false); setNotified(false); setEmail('') }}
                className="w-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white py-2 rounded-xl transition text-sm"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  )
}

export default Pricing
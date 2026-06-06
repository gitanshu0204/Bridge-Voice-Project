import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logo'

function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    language_background: [],
    proficiency_level: '',
    goals: '',
    daily_goal: ''
  })

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleFinish = () => {
    navigate('/dashboard')
  }

  const steps = [
    { number: 1, title: 'Native Language' },
    { number: 2, title: 'English Level' },
    { number: 3, title: 'Your Goal' },
    { number: 4, title: 'Daily Practice' },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">

      <div className="flex items-center gap-2 mb-8">
        <Logo size={24} />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">BridgeVoice</h1>
      </div>

      <div className="w-full max-w-lg">

        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                  step >= s.number
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gray-800 text-gray-500 border border-gray-700'
                }`}>
                  {step > s.number ? '✓' : s.number}
                </div>
                <p className={`text-xs mt-1 ${step >= s.number ? 'text-purple-400' : 'text-gray-600'}`}>
                  {s.title}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-16 mx-2 mb-4 ${step > s.number ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-800'}`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">What is your native language?</h2>
              <p className="text-gray-400 mb-2">We'll personalize your learning experience</p>
              <p className="text-purple-400 text-sm mb-6">You can select multiple languages!</p>
              <div className="grid grid-cols-2 gap-3">
                {['Hindi', 'Mandarin', 'Arabic', 'Spanish', 'Punjabi', 'French', 'Tagalog', 'Urdu', 'Portuguese', 'Korean', 'Japanese', 'Other'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      const current = formData.language_background
                      if (current.includes(lang)) {
                        handleChange('language_background', current.filter(l => l !== lang))
                      } else {
                        handleChange('language_background', [...current, lang])
                      }
                    }}
                    className={`py-3 rounded-xl border font-medium transition flex items-center justify-between px-4 ${
                      formData.language_background.includes(lang)
                        ? 'border-purple-500 bg-purple-900 bg-opacity-30 text-purple-300'
                        : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                    }`}
                  >
                    {lang}
                    {formData.language_background.includes(lang) && <span>✓</span>}
                  </button>
                ))}
              </div>
              {formData.language_background.length > 0 && (
                <p className="text-green-400 text-sm mt-4">
                  ✅ Selected: {formData.language_background.join(', ')}
                </p>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">What is your English level?</h2>
              <p className="text-gray-400 mb-6">Be honest — we'll adapt to your needs</p>
              <div className="space-y-3">
                {[
                  { level: 'Beginner', desc: 'I know very little English', icon: '🌱' },
                  { level: 'Elementary', desc: 'I know basic words and phrases', icon: '📗' },
                  { level: 'Intermediate', desc: 'I can have simple conversations', icon: '📘' },
                  { level: 'Advanced', desc: 'I am fairly confident in English', icon: '📙' },
                ].map(({ level, desc, icon }) => (
                  <button
                    key={level}
                    onClick={() => handleChange('proficiency_level', level)}
                    className={`w-full py-4 px-5 rounded-xl border text-left transition flex items-center gap-4 ${
                      formData.proficiency_level === level
                        ? 'border-purple-500 bg-purple-900 bg-opacity-30'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <span className="text-2xl">{icon}</span>
                    <div>
                      <p className="font-medium text-white">{level}</p>
                      <p className="text-sm text-gray-400">{desc}</p>
                    </div>
                    {formData.proficiency_level === level && (
                      <span className="ml-auto text-purple-400">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">What is your main goal?</h2>
              <p className="text-gray-400 mb-6">We'll focus your practice on what matters most</p>
              <div className="space-y-3">
                {[
                  { goal: 'Job Interview Practice', icon: '💼' },
                  { goal: 'Everyday Conversation', icon: '💬' },
                  { goal: 'Academic English', icon: '📚' },
                  { goal: 'Business English', icon: '🏢' },
                  { goal: 'Canadian Culture', icon: '🍁' },
                  { goal: 'Making Friends', icon: '🤝' },
                ].map(({ goal, icon }) => (
                  <button
                    key={goal}
                    onClick={() => handleChange('goals', goal)}
                    className={`w-full py-3 px-5 rounded-xl border text-left transition flex items-center gap-3 ${
                      formData.goals === goal
                        ? 'border-purple-500 bg-purple-900 bg-opacity-30'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <span className="text-xl">{icon}</span>
                    <p className="font-medium text-white">{goal}</p>
                    {formData.goals === goal && (
                      <span className="ml-auto text-purple-400">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">How much time can you practice daily?</h2>
              <p className="text-gray-400 mb-6">Consistency is the key to improvement!</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {['5 minutes', '10 minutes', '20 minutes', '30+ minutes'].map(time => (
                  <button
                    key={time}
                    onClick={() => handleChange('daily_goal', time)}
                    className={`py-4 rounded-xl border font-medium transition ${
                      formData.daily_goal === time
                        ? 'border-purple-500 bg-purple-900 bg-opacity-30 text-purple-300'
                        : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              {formData.daily_goal && (
                <div className="bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700 rounded-xl p-4 text-center">
                  <p className="text-purple-300 font-semibold">🎉 You are all set!</p>
                  <p className="text-gray-400 text-sm mt-1">Your personalized learning path is ready</p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition"
              >
                ← Back
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && formData.language_background.length === 0) ||
                  (step === 2 && !formData.proficiency_level) ||
                  (step === 3 && !formData.goals)
                }
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium transition disabled:opacity-50"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!formData.daily_goal}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium transition disabled:opacity-50"
              >
                Let's Go! 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function GrammarChecker() {
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeExample, setActiveExample] = useState(null)

  const commonErrors = [
    { wrong: 'I am going to store', correct: 'I am going to the store', rule: 'Use "the" before specific places', category: 'Articles', icon: '📌' },
    { wrong: 'She don\'t like coffee', correct: 'She doesn\'t like coffee', rule: 'Use "doesn\'t" with he/she/it', category: 'Subject-Verb', icon: '⚡' },
    { wrong: 'I have went there', correct: 'I have gone there', rule: 'Use past participle after "have"', category: 'Tense', icon: '⏰' },
    { wrong: 'He is more taller', correct: 'He is taller', rule: 'Don\'t use "more" with -er adjectives', category: 'Comparison', icon: '📊' },
    { wrong: 'I am boring', correct: 'I am bored', rule: 'Use -ed for feelings, -ing for things', category: 'Adjectives', icon: '😊' },
    { wrong: 'Since 3 years', correct: 'For 3 years', rule: 'Use "for" with duration, "since" with time point', category: 'Prepositions', icon: '🔗' },
  ]

  const grammarTips = [
    { title: 'Articles', tip: 'Use "a/an" for first mention, "the" for specific things', icon: '📝' },
    { title: 'Tenses', tip: 'Match your tense to the time: past, present, or future', icon: '⏰' },
    { title: 'Prepositions', tip: 'In (enclosed), On (surface), At (specific point)', icon: '📍' },
    { title: 'Plurals', tip: 'Most nouns add -s, but some are irregular (child → children)', icon: '📚' },
  ]

  const checkGrammar = async () => {
    if (!inputText.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      })
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setResult({
        corrected: inputText,
        errors: [],
        score: 100,
        feedback: 'Could not connect to server. Please make sure backend is running.'
      })
    }
    setLoading(false)
  }

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-CA'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 70) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreGradient = (score) => {
    if (score >= 90) return 'from-green-600 to-green-400'
    if (score >= 70) return 'from-orange-600 to-orange-400'
    return 'from-red-600 to-red-400'
  }

  const getScoreLabel = (score) => {
    if (score >= 90) return { label: 'Excellent!', emoji: '🌟' }
    if (score >= 80) return { label: 'Great Job!', emoji: '👍' }
    if (score >= 70) return { label: 'Good Effort!', emoji: '💪' }
    if (score >= 60) return { label: 'Keep Practicing!', emoji: '📚' }
    return { label: 'Needs Work!', emoji: '🔄' }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">✍️ Grammar Checker</h2>
            <p className="text-gray-400 mt-1">Get instant AI-powered grammar corrections and explanations</p>
          </div>
          <div className="flex items-center gap-2 bg-green-900 bg-opacity-30 border border-green-800 rounded-xl px-3 py-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-green-400 text-xs font-medium">LanguageTool API</p>
          </div>
        </div>

        {/* Grammar Tips - Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {grammarTips.map((tip, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex-shrink-0 w-48 hover:border-purple-700 transition group">
              <p className="text-2xl mb-2 group-hover:scale-110 transition">{tip.icon}</p>
              <p className="font-bold text-gray-200 text-sm mb-1">{tip.title}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{tip.tip}</p>
            </div>
          ))}
        </div>

        {/* Main Input Card - 3D Effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-10"></div>
          <div className="relative bg-gray-900 border border-gray-700 rounded-3xl overflow-hidden shadow-2xl">

            <div className="p-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-gray-400">Type or paste your text:</label>
                <div className="flex gap-2">
                  {inputText && (
                    <button
                      onClick={() => speakText(inputText)}
                      className="text-gray-500 hover:text-purple-400 transition text-sm flex items-center gap-1"
                    >
                      🔊 Listen
                    </button>
                  )}
                  <span className="text-xs text-gray-600">{inputText.length} chars • {inputText.split(' ').filter(w => w).length} words</span>
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Example: I am going to store yesterday to buyed some milk and she don't like coffee..."
                rows={6}
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition resize-none text-base leading-relaxed"
              />

              <div className="flex gap-3 mt-4">
                <button
                  onClick={checkGrammar}
                  disabled={loading || !inputText.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3.5 rounded-xl font-bold text-lg transition disabled:opacity-50 shadow-lg shadow-purple-900"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Checking...
                    </span>
                  ) : '✅ Check Grammar'}
                </button>
                <button
                  onClick={() => { setInputText(''); setResult(null) }}
                  className="bg-gray-800 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white px-5 py-3.5 rounded-xl transition font-medium"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">

            {/* Score Card - 3D */}
            <div className="relative transform hover:scale-[1.01] transition">
              <div className={`absolute inset-0 bg-gradient-to-r ${getScoreGradient(result.score)} rounded-3xl blur-xl opacity-20`}></div>
              <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-6 flex items-center gap-6">

                {/* Circular Score */}
                <div className="relative flex-shrink-0">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#1f2937" strokeWidth="8"/>
                    <circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke="url(#resGrad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(result.score / 100) * 264} 264`}
                      strokeDashoffset="66"
                      transform="rotate(-90 50 50)"
                    />
                    <defs>
                      <linearGradient id="resGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={result.score >= 90 ? '#16a34a' : result.score >= 70 ? '#ea580c' : '#dc2626'}/>
                        <stop offset="100%" stopColor={result.score >= 90 ? '#4ade80' : result.score >= 70 ? '#fb923c' : '#f87171'}/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <p className={`text-2xl font-bold ${getScoreColor(result.score)}`}>{result.score}%</p>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-3xl">{getScoreLabel(result.score).emoji}</p>
                    <p className="text-2xl font-bold text-white">{getScoreLabel(result.score).label}</p>
                  </div>
                  <p className="text-gray-400 leading-relaxed">{result.feedback}</p>
                  {result.errors && (
                    <div className="flex gap-4 mt-3">
                      <span className="text-green-400 text-sm font-medium">✅ {result.errors.length === 0 ? 'No errors found!' : `${result.errors.length} error${result.errors.length !== 1 ? 's' : ''} found`}</span>
                      {result.score === 100 && <span className="text-yellow-400 text-sm">🏆 Perfect score!</span>}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => speakText(result.corrected)}
                    className="bg-gray-800 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white p-3 rounded-xl transition"
                  >
                    🔊
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(result.corrected)}
                    className="bg-gray-800 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white p-3 rounded-xl transition"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>

            {/* Corrected Text */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold text-gray-200 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-900 bg-opacity-50 border border-green-700 rounded-full flex items-center justify-center text-xs">✓</span>
                Corrected Version
              </h3>
              <div className="bg-green-900 bg-opacity-10 border border-green-800 rounded-xl p-4">
                <p className="text-gray-200 leading-relaxed text-base">{result.corrected}</p>
              </div>
            </div>

            {/* Errors */}
            {result.errors && result.errors.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="font-bold text-gray-200 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-red-900 bg-opacity-50 border border-red-700 rounded-full flex items-center justify-center text-xs text-red-400">!</span>
                  Errors Found ({result.errors.length})
                </h3>
                <div className="space-y-3">
                  {result.errors.map((error, i) => (
                    <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-red-400 line-through text-sm bg-red-900 bg-opacity-20 px-2 py-0.5 rounded">{error.wrong}</span>
                        <span className="text-gray-600">→</span>
                        <span className="text-green-400 font-medium text-sm bg-green-900 bg-opacity-20 px-2 py-0.5 rounded">{error.correct}</span>
                      </div>
                      <p className="text-xs text-purple-400 flex items-center gap-1">
                        <span>📌</span>
                        {error.rule}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Common Mistakes */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="font-bold text-gray-200 mb-2">📚 Common Grammar Mistakes</h3>
          <p className="text-gray-500 text-sm mb-5">Click any example to load it into the checker!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commonErrors.map((item, i) => (
              <button
                key={i}
                onClick={() => { setInputText(item.wrong); setResult(null) }}
                className={`border rounded-xl p-4 text-left transition hover:scale-[1.02] group ${
                  activeExample === i
                    ? 'border-purple-500 bg-purple-900 bg-opacity-20'
                    : 'border-gray-800 hover:border-gray-600 bg-gray-800 bg-opacity-50'
                }`}
                onMouseEnter={() => setActiveExample(i)}
                onMouseLeave={() => setActiveExample(null)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>{item.icon}</span>
                  <span className="text-xs font-semibold text-purple-400 uppercase">{item.category}</span>
                </div>
                <div className="flex gap-2 mb-1 flex-wrap">
                  <span className="text-red-400 line-through text-sm">❌ {item.wrong}</span>
                </div>
                <div className="flex gap-2 mb-2 flex-wrap">
                  <span className="text-green-400 font-medium text-sm">✅ {item.correct}</span>
                </div>
                <p className="text-xs text-gray-500">{item.rule}</p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default GrammarChecker
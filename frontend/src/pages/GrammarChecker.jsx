import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function GrammarChecker() {
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeExample, setActiveExample] = useState(null)
  const [copied, setCopied] = useState(false)
  const [nativeLanguage, setNativeLanguage] = useState('English')

  const commonErrors = [
    { wrong: 'I am going to store', correct: 'I am going to the store', rule: 'Use "the" before specific places', category: 'Articles' },
    { wrong: 'She don\'t like coffee', correct: 'She doesn\'t like coffee', rule: 'Use "doesn\'t" with he/she/it', category: 'Subject-Verb' },
    { wrong: 'I have went there', correct: 'I have gone there', rule: 'Use past participle after "have"', category: 'Tense' },
    { wrong: 'He is more taller', correct: 'He is taller', rule: 'Don\'t use "more" with -er adjectives', category: 'Comparison' },
    { wrong: 'I am boring', correct: 'I am bored', rule: 'Use -ed for feelings, -ing for things', category: 'Adjectives' },
    { wrong: 'Since 3 years', correct: 'For 3 years', rule: 'Use "for" with duration, "since" with time point', category: 'Prepositions' },
  ]

  const checkGrammar = async () => {
    if (!inputText.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, native_language: nativeLanguage })
      })
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setResult({
        corrected: inputText,
        errors: [],
        score: 100,
        feedback: 'Could not connect to server. Please make sure backend is running.',
        feedback_native: '',
        grammar_tip: ''
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

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreLabel = (score) => {
    if (score >= 90) return { label: 'Excellent', emoji: '🌟' }
    if (score >= 80) return { label: 'Great Job', emoji: '👍' }
    if (score >= 70) return { label: 'Good Effort', emoji: '💪' }
    if (score >= 60) return { label: 'Keep Practicing', emoji: '📚' }
    return { label: 'Needs Work', emoji: '🔄' }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Hero */}
        <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 opacity-60"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
          <div className="relative p-8 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">AI-Powered Grammar Assistant</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Grammar Checker</h2>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                Get instant grammar corrections with AI explanations in your native language.
              </p>
              <div className="flex items-center gap-4 mt-4">
                {[
                  { value: 'Instant', label: 'Corrections' },
                  { value: 'AI', label: 'Explanations' },
                  { value: '8', label: 'Languages' },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-lg font-bold text-purple-400">{stat.value}</p>
                    <p className="text-gray-500 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block text-8xl opacity-10">✍️</div>
          </div>
        </div>

        {/* Input Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-semibold text-gray-300">Your Text</p>
              {inputText && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600">
                    {inputText.split(' ').filter(w => w).length} words
                  </span>
                  <button
                    onClick={() => speakText(inputText)}
                    className="text-gray-600 hover:text-purple-400 transition text-sm"
                  >
                    🔊
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs text-gray-500 flex-shrink-0">Explain errors in:</p>
              {['English', 'Hindi', 'Punjabi', 'Mandarin', 'Arabic', 'Spanish', 'French', 'Urdu'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setNativeLanguage(lang)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    nativeLanguage === lang
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                      : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <div className="p-5">
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Type or paste your text here... e.g. I am going to store yesterday to buyed some milk"
              rows={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition resize-none text-sm leading-relaxed"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={checkGrammar}
                disabled={loading || !inputText.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition disabled:opacity-40 shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Checking...</span>
                  </>
                ) : (
                  <>✅ Check Grammar</>
                )}
              </button>
              <button
                onClick={() => { setInputText(''); setResult(null) }}
                className="px-5 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition text-sm font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">

            {/* Score Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <p className="font-bold text-white">Results</p>
                <div className="flex items-center gap-3">
                  <span className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}%
                  </span>
                  <span className="text-lg">{getScoreLabel(result.score).emoji}</span>
                </div>
              </div>

              {/* Score Bar */}
              <div className="px-6 py-4 border-b border-gray-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">Grammar Score</span>
                  <span className={`text-xs font-bold ${getScoreColor(result.score)}`}>
                    {getScoreLabel(result.score).label}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${
                      result.score >= 90 ? 'bg-green-500' :
                      result.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${result.score}%` }}
                  ></div>
                </div>
              </div>

              {/* Corrected Text */}
              <div className="p-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Corrected Version</p>
                <div className="relative pl-4 border-l-2 border-green-600">
                  <p className="text-gray-200 text-sm leading-relaxed">{result.corrected}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => speakText(result.corrected)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition text-xs font-medium"
                  >
                    🔊 Listen
                  </button>
                  <button
                    onClick={() => copyText(result.corrected)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition text-xs font-medium"
                  >
                    {copied ? '✅ Copied!' : '📋 Copy'}
                  </button>
                </div>
              </div>
            </div>

            {/* Errors */}
            {result.errors && result.errors.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                  <p className="font-bold text-white">Errors Found</p>
                  <span className="text-xs bg-red-900 bg-opacity-30 border border-red-800 text-red-400 px-3 py-1 rounded-full">
                    {result.errors.length} issue{result.errors.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="divide-y divide-gray-800">
                  {result.errors.map((error, i) => (
                    <div key={i} className="px-6 py-4">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-red-400 line-through text-sm bg-red-900 bg-opacity-20 border border-red-900 px-2 py-0.5 rounded">
                          {error.wrong}
                        </span>
                        <span className="text-gray-600 text-xs">→</span>
                        <span className="text-green-400 font-medium text-sm bg-green-900 bg-opacity-20 border border-green-900 px-2 py-0.5 rounded">
                          {error.correct}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs flex items-center gap-1.5">
                        <span>📌</span>
                        {error.rule}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback */}
            {result.feedback && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                  <p className="font-bold text-white">AI Feedback</p>
                </div>
                <div className="p-6 space-y-4">

                  {/* English Feedback */}
                  <div className="relative pl-4 border-l-2 border-purple-600">
                    <p className="text-gray-300 text-sm leading-relaxed">{result.feedback}</p>
                  </div>

                  {/* Native Language Explanation */}
                  {result.feedback_native && (
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                      <p className="text-xs font-bold text-purple-400 mb-2 flex items-center gap-1.5">
                        <span>🌍</span>
                        Explanation in {result.native_language}:
                      </p>
                      <p className="text-gray-300 text-sm leading-relaxed">{result.feedback_native}</p>
                    </div>
                  )}

                  {/* Grammar Tip */}
                  {result.grammar_tip && (
                    <div className="flex items-start gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
                      <span className="text-yellow-500 text-sm mt-0.5 flex-shrink-0">💡</span>
                      <p className="text-gray-400 text-sm">{result.grammar_tip}</p>
                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
        )}

        {/* Common Mistakes */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <p className="font-bold text-white">Common Grammar Mistakes</p>
            <p className="text-gray-500 text-xs mt-0.5">Click any example to load it into the checker</p>
          </div>
          <div className="divide-y divide-gray-800">
            {commonErrors.map((item, i) => (
              <button
                key={i}
                onClick={() => { setInputText(item.wrong); setResult(null) }}
                className="w-full text-left px-6 py-4 hover:bg-gray-800 transition group"
                onMouseEnter={() => setActiveExample(i)}
                onMouseLeave={() => setActiveExample(null)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-red-400 line-through text-sm">❌ {item.wrong}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-400 text-sm">✅ {item.correct}</span>
                    </div>
                    <p className="text-gray-600 text-xs flex items-center gap-1.5">
                      <span>📌</span> {item.rule}
                    </p>
                  </div>
                  <span className="text-xs text-gray-600 bg-gray-800 border border-gray-700 px-2 py-0.5 rounded-full flex-shrink-0">
                    {item.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default GrammarChecker
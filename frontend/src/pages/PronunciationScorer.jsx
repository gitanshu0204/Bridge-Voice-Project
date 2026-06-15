import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { addXP } from '../utils/xpTracker'
import { logActivity } from '../utils/activityTracker'

function PronunciationScorer() {
  const navigate = useNavigate()
  const [stage, setStage] = useState('select')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('Hindi')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [listening, setListening] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [scores, setScores] = useState([])
  const [levelItems, setLevelItems] = useState([])
  const [generatingLevel, setGeneratingLevel] = useState(false)
  const [showNative, setShowNative] = useState(false)
  const recognitionRef = useRef(null)

  const levels = [
    { id: 'Beginner', icon: '🌱', desc: 'Simple words and basic greetings' },
    { id: 'Intermediate', icon: '📘', desc: 'Workplace and daily phrases' },
    { id: 'Advanced', icon: '📙', desc: 'Complex professional sentences' },
    { id: 'Canadian', icon: '🍁', desc: 'Canadian words and expressions' },
  ]

  const nativeLanguages = [
    { name: 'Hindi', flag: '🇮🇳' },
    { name: 'Punjabi', flag: '🇮🇳' },
    { name: 'Mandarin', flag: '🇨🇳' },
    { name: 'Arabic', flag: '🇸🇦' },
    { name: 'Spanish', flag: '🇪🇸' },
    { name: 'French', flag: '🇫🇷' },
    { name: 'Tagalog', flag: '🇵🇭' },
    { name: 'Urdu', flag: '🇵🇰' },
    { name: 'Portuguese', flag: '🇧🇷' },
    { name: 'Korean', flag: '🇰🇷' },
    { name: 'Japanese', flag: '🇯🇵' },
    { name: 'German', flag: '🇩🇪' },
  ]

  const generateLevel = async (levelId) => {
    setSelectedLevel(levelId)
    setGeneratingLevel(true)
    setStage('practice')
    setCurrentIndex(0)
    setScores([])
    setResult(null)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/pronunciation/generate-level', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: levelId,
          native_language: nativeLanguage
        })
      })
      const data = await response.json()
      setLevelItems(data.items)
    } catch (err) {
      setLevelItems([
        { text: 'Hello', tip: 'heh-LOH', note: 'Common greeting' },
        { text: 'Thank you', tip: 'THANK yoo', note: 'Polite expression' },
        { text: 'Please', tip: 'PLEEZ', note: 'Polite request word' },
        { text: 'Sorry', tip: 'SAW-ree', note: 'Apology word' },
        { text: 'Excuse me', tip: 'ex-KYOOZ mee', note: 'Getting attention' },
      ])
    }
    setGeneratingLevel(false)
  }

  const currentItem = levelItems[currentIndex]

  const speakTarget = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-CA'
      utterance.rate = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Please use Google Chrome for speech recognition.')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = 'en-US'
    recognitionRef.current.onstart = () => setListening(true)
    recognitionRef.current.onend = () => setListening(false)
    recognitionRef.current.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript.toLowerCase().trim()
      await analyzeProunciation(spokenText)
    }
    recognitionRef.current.onerror = () => {
      setListening(false)
      alert('Could not hear you. Please try again.')
    }
    recognitionRef.current.start()
  }

  const analyzeProunciation = async (spokenText) => {
    setLoading(true)
    const targetText = currentItem.text.toLowerCase()
    const targetWords = targetText.split(' ')
    const spokenWords = spokenText.split(' ')

    let correctWords = 0
    const wordResults = targetWords.map(word => {
      const spoken = spokenWords.find(w =>
        w === word || w.includes(word.slice(0, -1)) || word.includes(w.slice(0, -1))
      )
      const correct = spoken !== undefined
      if (correct) correctWords++
      return { word, correct, spoken: spoken || '?' }
    })

    const score = Math.round((correctWords / targetWords.length) * 100)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/pronunciation-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: currentItem.text,
          spoken: spokenText,
          score,
          wrong_words: wordResults.filter(w => !w.correct).map(w => w.word),
          native_language: nativeLanguage
        })
      })
      const data = await response.json()
      setResult({ score, spokenText, wordResults, ...data })

      logActivity({ type: 'pronunciation', score, detail: `"${currentItem.text}"` })

      if (score >= 80) {
        addXP(5, `Pronunciation: "${currentItem.text}"`)
      }
    } catch (err) {
      setResult({
        score,
        spokenText,
        wordResults,
        feedback: score >= 80 ? "Great pronunciation!" : "Keep practicing!",
        feedback_native: "",
        tips: ["Practice daily", "Listen first then speak"],
        tips_native: []
      })
    }
    setLoading(false)
  }

  const nextItem = () => {
    if (result) setScores(prev => [...prev, result.score])
    setResult(null)
    setShowNative(false)
    if (currentIndex + 1 < levelItems.length) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setStage('complete')
    }
  }

  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Hero */}
        <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 opacity-60"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
          <div className="relative p-8 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">AI Powered • Multilingual</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Pronunciation Scorer</h2>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                AI generates practice questions specific to your native language. Get feedback and tips translated into your language!
              </p>
              <div className="flex items-center gap-4 mt-4">
                {[
                  { value: '4', label: 'AI Levels' },
                  { value: '12', label: 'Languages' },
                  { value: 'Live', label: 'Feedback' },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-lg font-bold text-purple-400">{stat.value}</p>
                    <p className="text-gray-500 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block text-8xl opacity-10">🎤</div>
          </div>
        </div>

        {stage === 'select' && (
          <div className="space-y-4">

            {/* Language Selector */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Native Language</p>
                <p className="text-gray-600 text-xs mt-0.5">AI will generate questions and feedback in your language</p>
              </div>
              <div className="p-4 grid grid-cols-4 md:grid-cols-6 gap-2">
                {nativeLanguages.map(lang => (
                  <button
                    key={lang.name}
                    onClick={() => setNativeLanguage(lang.name)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition ${
                      nativeLanguage === lang.name
                        ? 'border-purple-500 bg-purple-900 bg-opacity-30'
                        : 'border-gray-700 hover:border-gray-500 bg-gray-800 bg-opacity-50'
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-xs text-gray-400">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">How It Works</p>
              </div>
              <div className="p-5 grid grid-cols-3 gap-4">
                {[
                  { icon: '🤖', title: 'AI Generates', desc: 'Questions tailored for your language' },
                  { icon: '🎤', title: 'You Speak', desc: 'Read the phrase out loud' },
                  { icon: '📊', title: 'Get Score', desc: 'Feedback in your language' },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl mb-2">{item.icon}</p>
                    <p className="font-semibold text-white text-sm">{item.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Level Selection */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Difficulty Level</p>
                <p className="text-gray-600 text-xs mt-0.5">AI generates 10 unique questions every time for {nativeLanguage} speakers</p>
              </div>
              <div className="p-4 space-y-3">
                {levels.map((level, i) => (
                  <button
                    key={i}
                    onClick={() => generateLevel(level.id)}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 border-gray-800 hover:border-purple-700 hover:bg-purple-900 hover:bg-opacity-10 transition group text-left"
                  >
                    <span className="text-2xl group-hover:scale-110 transition">{level.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-white">{level.id}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{level.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs bg-purple-900 bg-opacity-30 border border-purple-800 text-purple-400 px-2 py-0.5 rounded-full">
                        🤖 AI Generated
                      </span>
                      <span className="text-gray-600 group-hover:text-purple-400 transition">→</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {stage === 'practice' && (
          <div className="space-y-4">

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedLevel} Level</h2>
                <p className="text-gray-500 text-sm mt-0.5">🤖 AI Generated for {nativeLanguage} speakers</p>
              </div>
              <button
                onClick={() => setStage('select')}
                className="text-gray-600 hover:text-white transition text-sm"
              >
                ✕ Exit
              </button>
            </div>

            {generatingLevel ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center">
                <div className="w-12 h-12 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-300 font-medium">AI is generating your practice questions...</p>
                <p className="text-gray-600 text-sm mt-1">Tailoring {selectedLevel} level for {nativeLanguage} speakers</p>
              </div>
            ) : levelItems.length > 0 && (
              <div className="space-y-4">

                {/* Progress */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${(currentIndex / levelItems.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{currentIndex + 1}/{levelItems.length}</span>
                  {scores.length > 0 && (
                    <span className="text-xs text-purple-400 font-bold">
                      Avg: {Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)}%
                    </span>
                  )}
                </div>

                {/* Phrase Card */}
                <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-purple-600"></div>
                  <div className="p-6 pl-8">
                    <p className="text-xs text-gray-500 mb-3">Say this out loud:</p>
                    <h3 className="text-3xl font-bold text-white mb-3">"{currentItem?.text}"</h3>
                    <p className="text-purple-400 text-sm mb-4">🗣️ {currentItem?.tip}</p>
                    {currentItem?.note && (
                      <div className="flex items-start gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5">
                        <span className="text-yellow-500 text-sm mt-0.5">💡</span>
                        <p className="text-gray-400 text-xs">{currentItem.note}</p>
                      </div>
                    )}
                    <button
                      onClick={() => speakTarget(currentItem?.text)}
                      className="mt-4 flex items-center gap-2 text-gray-500 hover:text-purple-400 transition text-sm"
                    >
                      🔊 Hear correct pronunciation
                    </button>
                  </div>
                </div>

                {/* Microphone */}
                {!result && !loading && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                    <button
                      onClick={startListening}
                      disabled={listening}
                      className={`w-20 h-20 rounded-full text-3xl transition shadow-2xl mx-auto flex items-center justify-center ${
                        listening
                          ? 'bg-red-600 animate-pulse shadow-red-900/50'
                          : 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/50'
                      }`}
                    >
                      🎤
                    </button>
                    <p className="text-gray-500 text-sm mt-4">
                      {listening ? '🔴 Listening... speak now!' : 'Click the microphone and speak'}
                    </p>
                  </div>
                )}

                {/* Loading */}
                {loading && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                    <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="text-gray-400">Analysing your pronunciation...</p>
                  </div>
                )}

                {/* Result */}
                {result && (
                  <div className="space-y-4">

                    {/* Score */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                        <p className="font-bold text-white">Your Score</p>
                        <span className={`text-3xl font-bold ${
                          result.score >= 80 ? 'text-green-400' :
                          result.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>{result.score}%</span>
                      </div>
                      <div className="p-5 space-y-4">

                        {/* Score Bar */}
                        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              result.score >= 80 ? 'bg-green-500' :
                              result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${result.score}%` }}
                          ></div>
                        </div>

                        {/* Word by Word */}
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Word by word:</p>
                          <div className="flex flex-wrap gap-2">
                            {result.wordResults?.map((w, i) => (
                              <span
                                key={i}
                                className={`px-3 py-1 rounded-full text-sm font-medium border ${
                                  w.correct
                                    ? 'bg-green-900 bg-opacity-30 border-green-800 text-green-300'
                                    : 'bg-red-900 bg-opacity-30 border-red-800 text-red-300'
                                }`}
                              >
                                {w.correct ? '✅' : '❌'} {w.word}
                              </span>
                            ))}
                          </div>
                        </div>

                        <p className="text-gray-500 text-xs">You said: <span className="text-gray-300">"{result.spokenText}"</span></p>
                      </div>
                    </div>

                    {/* AI Feedback */}
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                        <p className="font-bold text-white flex items-center gap-2">
                          <span className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-xs">🤖</span>
                          AI Feedback
                        </p>
                        <button
                          onClick={() => setShowNative(!showNative)}
                          className={`text-xs px-3 py-1.5 rounded-xl border transition ${
                            showNative
                              ? 'border-purple-600 bg-purple-900 bg-opacity-30 text-purple-300'
                              : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                          }`}
                        >
                          🌍 {showNative ? 'Show English' : `Show ${nativeLanguage}`}
                        </button>
                      </div>
                      <div className="p-5 space-y-4">

                        {/* Feedback */}
                        <div className="relative pl-4 border-l-2 border-purple-600">
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {showNative && result.feedback_native ? result.feedback_native : result.feedback}
                          </p>
                        </div>

                        {/* Tips */}
                        {result.tips && result.tips.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tips to Improve:</p>
                            {(showNative && result.tips_native?.length > 0 ? result.tips_native : result.tips).map((tip, i) => (
                              <div key={i} className="flex items-start gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5">
                                <span className="text-yellow-500 text-sm mt-0.5 flex-shrink-0">💡</span>
                                <p className="text-gray-400 text-sm">{tip}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setResult(null)}
                        className="flex-1 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white py-3 rounded-xl font-medium transition text-sm"
                      >
                        🔄 Try Again
                      </button>
                      <button
                        onClick={nextItem}
                        className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-purple-900/40"
                      >
                        {currentIndex + 1 === levelItems.length ? 'See Results 🎉' : 'Next →'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {stage === 'complete' && (
          <div className="space-y-5">

            {/* Result Card */}
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 opacity-50"></div>
              <div className="relative p-8 text-center">
                <p className="text-5xl mb-4">
                  {avgScore >= 80 ? '🏆' : avgScore >= 60 ? '🌟' : '💪'}
                </p>
                <h2 className="text-2xl font-bold text-white mb-1">Session Complete!</h2>
                <div className={`text-6xl font-bold my-3 ${
                  avgScore >= 80 ? 'text-green-400' :
                  avgScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>{avgScore}%</div>
                <p className="text-gray-500 text-sm">{selectedLevel} • {nativeLanguage} • AI Generated</p>
                <p className="text-gray-300 mt-2">
                  {avgScore >= 80 ? 'Excellent! You sound like a native speaker!' :
                   avgScore >= 60 ? 'Good job! Keep practicing to improve!' :
                   'Keep going! Pronunciation takes time and practice!'}
                </p>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <p className="font-bold text-white">Score Breakdown</p>
              </div>
              <div className="divide-y divide-gray-800">
                {levelItems.map((item, i) => (
                  <div key={i} className="px-6 py-3 flex items-center gap-4">
                    <p className="text-gray-300 text-sm flex-1 truncate">"{item.text}"</p>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="w-20 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            (scores[i] || 0) >= 80 ? 'bg-green-500' :
                            (scores[i] || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${scores[i] || 0}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-bold w-10 text-right ${
                        (scores[i] || 0) >= 80 ? 'text-green-400' :
                        (scores[i] || 0) >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>{scores[i] || 0}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setStage('select'); setScores([]) }}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-purple-900/40"
              >
                Practice Again 🔄
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white py-3 rounded-xl font-bold transition"
              >
                Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}

export default PronunciationScorer
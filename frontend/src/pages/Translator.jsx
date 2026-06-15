import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { addXP } from '../utils/xpTracker'
import { logActivity } from '../utils/activityTracker'

function Translator() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('translator')
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [fromLang, setFromLang] = useState('auto')
  const [toLang, setToLang] = useState('en')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState([])

  // Quiz states
  const [quizLang, setQuizLang] = useState('Hindi')
  const [quizDifficulty, setQuizDifficulty] = useState('Medium')
  const [quizQuestions, setQuizQuestions] = useState([])
  const [quizGenerating, setQuizGenerating] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [quizResult, setQuizResult] = useState(null)
  const [checkingAnswer, setCheckingAnswer] = useState(false)
  const [quizStage, setQuizStage] = useState('setup')
  const [scores, setScores] = useState([])
  const [showAnswer, setShowAnswer] = useState(false)

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'zh', name: 'Mandarin', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'tl', name: 'Tagalog', flag: '🇵🇭' },
    { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
    { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  ]

  const commonPhrases = [
    { english: 'How are you?', context: 'Greeting', icon: '👋' },
    { english: 'Can you help me please?', context: 'Asking for help', icon: '🙏' },
    { english: 'Where is the nearest hospital?', context: 'Emergency', icon: '🏥' },
    { english: 'How much does this cost?', context: 'Shopping', icon: '🛒' },
    { english: 'I would like to apply for this job.', context: 'Job', icon: '💼' },
    { english: 'Could you repeat that please?', context: 'Conversation', icon: '🗣️' },
    { english: 'I need to see a doctor.', context: 'Healthcare', icon: '👨‍⚕️' },
    { english: 'Where is the nearest subway station?', context: 'Transport', icon: '🚇' },
  ]

  const getLangInfo = (code) => {
    return languages.find(l => l.code === code) || { name: 'Auto', flag: '🌐' }
  }

  const translate = async () => {
    if (!inputText.trim()) return
    setLoading(true)
    setTranslatedText('')
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(inputText)}`
      )
      const data = await response.json()
      const translated = data[0].map(item => item[0]).join('')
      setTranslatedText(translated)
      setHistory(prev => [{
        input: inputText,
        output: translated,
        from: fromLang,
        to: toLang,
        time: new Date().toLocaleTimeString()
      }, ...prev.slice(0, 4)])
    } catch (err) {
      setTranslatedText('Could not connect. Please try again!')
    }
    setLoading(false)
  }

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      window.speechSynthesis.speak(utterance)
    }
  }

  const swapLanguages = () => {
    if (fromLang === 'auto') return
    setFromLang(toLang)
    setToLang(fromLang)
    setInputText(translatedText)
    setTranslatedText(inputText)
  }

  const copyText = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateQuiz = async () => {
    setQuizGenerating(true)
    setQuizQuestions([])
    setCurrentQ(0)
    setScores([])
    setQuizResult(null)
    setUserAnswer('')
    setShowAnswer(false)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/translator-quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          native_language: quizLang,
          difficulty: quizDifficulty
        })
      })
      const data = await response.json()
      if (data.questions && data.questions.length > 0) {
        setQuizQuestions(data.questions)
        setQuizStage('quiz')
      } else {
        throw new Error('No questions returned')
      }
    } catch (err) {
      console.log('Quiz generation error', err)
      alert('Could not generate quiz. Please try again!')
    }
    setQuizGenerating(false)
  }

  const checkAnswer = async () => {
    if (!userAnswer.trim()) return
    setCheckingAnswer(true)
    const currentQuestion = quizQuestions[currentQ]
    try {
      const response = await fetch('http://127.0.0.1:8000/api/translator-quiz/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          native_text: currentQuestion.native,
          user_answer: userAnswer,
          correct_answer: currentQuestion.english,
          native_language: quizLang
        })
      })
      const data = await response.json()
      setQuizResult(data)
      setScores(prev => [...prev, data.score])
      setShowAnswer(true)

      logActivity({ type: 'translation', score: data.score, detail: currentQuestion.english })

      if (data.score >= 70) {
        addXP(5, `Translation Quiz: ${currentQuestion.english}`)
      }
    } catch (err) {
      setQuizResult({
        score: 60,
        correct: false,
        feedback: 'Could not check your answer. Please try again.',
        feedback_native: '',
        correction: currentQuestion.english,
        tip: 'Keep practicing!'
      })
      setScores(prev => [...prev, 60])
      setShowAnswer(true)
    }
    setCheckingAnswer(false)
  }

  const nextQuestion = () => {
    if (currentQ + 1 < quizQuestions.length) {
      setCurrentQ(prev => prev + 1)
      setUserAnswer('')
      setQuizResult(null)
      setShowAnswer(false)
    } else {
      setQuizStage('result')
    }
  }

  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0

  const quizLanguages = [
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
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Instant Translation + AI Quiz</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Translator</h2>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                Translate between English and 15+ languages instantly. Then test yourself with AI-generated translation quizzes!
              </p>
              <div className="flex items-center gap-4 mt-4">
                {[
                  { value: '15+', label: 'Languages' },
                  { value: 'AI', label: 'Quiz' },
                  { value: 'Free', label: 'No Limits' },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-lg font-bold text-purple-400">{stat.value}</p>
                    <p className="text-gray-500 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block text-8xl opacity-10">🌍</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-1.5 flex gap-1">
          <button
            onClick={() => setActiveTab('translator')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'translator'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🌍 Translator
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'quiz'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🧠 Translation Quiz
          </button>
        </div>

        {/* TRANSLATOR TAB */}
        {activeTab === 'translator' && (
          <div className="space-y-4">

            {/* Main Translator */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">

              {/* Language Selector */}
              <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-3">
                <select
                  value={fromLang}
                  onChange={e => setFromLang(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition text-sm"
                >
                  <option value="auto">🌐 Auto Detect</option>
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                  ))}
                </select>

                <button
                  onClick={swapLanguages}
                  className="w-10 h-10 bg-gray-800 border border-gray-700 hover:border-purple-500 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition flex-shrink-0"
                >
                  ⇄
                </button>

                <select
                  value={toLang}
                  onChange={e => setToLang(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition text-sm"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                  ))}
                </select>
              </div>

              {/* Text Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-800">
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{getLangInfo(fromLang).flag}</span>
                    <span className="text-xs font-medium text-gray-500">
                      {fromLang === 'auto' ? 'Auto Detect' : getLangInfo(fromLang).name}
                    </span>
                  </div>
                  <textarea
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Type or paste text to translate..."
                    rows={5}
                    className="w-full bg-transparent text-white placeholder-gray-600 focus:outline-none resize-none text-sm leading-relaxed"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-700">{inputText.length} chars</p>
                    <div className="flex gap-2">
                      {inputText && (
                        <>
                          <button onClick={() => speakText(inputText, fromLang)} className="text-gray-600 hover:text-purple-400 transition">🔊</button>
                          <button onClick={() => setInputText('')} className="text-gray-600 hover:text-red-400 transition text-xs">✕</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-gray-800 bg-opacity-30">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{getLangInfo(toLang).flag}</span>
                    <span className="text-xs font-medium text-gray-500">{getLangInfo(toLang).name}</span>
                  </div>
                  {loading ? (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-4 h-4 border border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500 text-sm">Translating...</span>
                    </div>
                  ) : (
                    <p className={`text-sm leading-relaxed ${translatedText ? 'text-white' : 'text-gray-600'}`}>
                      {translatedText || 'Translation will appear here...'}
                    </p>
                  )}
                  {translatedText && (
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => speakText(translatedText, toLang)} className="text-gray-600 hover:text-purple-400 transition">🔊</button>
                      <button onClick={() => copyText(translatedText)} className="text-gray-600 hover:text-green-400 transition text-xs flex items-center gap-1">
                        {copied ? '✅ Copied!' : '📋 Copy'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 py-4 border-t border-gray-800">
                <button
                  onClick={translate}
                  disabled={loading || !inputText.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition disabled:opacity-40 shadow-lg shadow-purple-900/40"
                >
                  Translate {getLangInfo(toLang).flag}
                </button>
              </div>
            </div>

            {/* Recent History */}
            {history.length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-800">
                  <p className="font-semibold text-white text-sm">🕐 Recent Translations</p>
                </div>
                <div className="divide-y divide-gray-800">
                  {history.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => { setInputText(item.input); setTranslatedText(item.output); setFromLang(item.from); setToLang(item.to) }}
                      className="w-full flex items-center gap-4 px-5 py-3 hover:bg-gray-800 transition text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-300 text-xs truncate">{item.input}</p>
                        <p className="text-purple-400 text-xs truncate mt-0.5">{item.output}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-xs text-gray-600">{getLangInfo(item.from).flag} → {getLangInfo(item.to).flag}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Common Phrases */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center">
                <p className="font-semibold text-white text-sm">💬 Common Phrases</p>
                <p className="text-gray-600 text-xs">Click to translate</p>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                {commonPhrases.map((phrase, i) => (
                  <button
                    key={i}
                    onClick={() => setInputText(phrase.english)}
                    className="flex items-center gap-3 border border-gray-800 hover:border-gray-600 rounded-xl p-3 text-left transition group"
                  >
                    <span className="text-xl group-hover:scale-110 transition">{phrase.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-200 text-xs truncate">{phrase.english}</p>
                      <p className="text-xs text-purple-400 mt-0.5">{phrase.context}</p>
                    </div>
                    <span className="text-gray-700 group-hover:text-gray-400 transition text-xs">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* QUIZ TAB */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">

            {quizStage === 'setup' && (
              <div className="space-y-4">

                {/* Quiz Intro */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-800">
                    <h3 className="font-bold text-white text-lg">Translation Quiz</h3>
                    <p className="text-gray-500 text-sm mt-0.5">AI shows you a sentence in your language — you translate it to English!</p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { icon: '🤖', title: 'AI Generated', desc: 'New questions every time' },
                        { icon: '🌍', title: '12 Languages', desc: 'Your native language' },
                        { icon: '📊', title: 'Instant Score', desc: 'AI checks your answers' },
                      ].map((item, i) => (
                        <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
                          <p className="text-2xl mb-2">{item.icon}</p>
                          <p className="font-semibold text-white text-xs">{item.title}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Language Selection */}
                    <div className="mb-5">
                      <p className="text-sm font-semibold text-gray-300 mb-3">Your Native Language:</p>
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {quizLanguages.map(lang => (
                          <button
                            key={lang.name}
                            onClick={() => setQuizLang(lang.name)}
                            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border transition ${
                              quizLang === lang.name
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

                    {/* Difficulty */}
                    <div className="mb-6">
                      <p className="text-sm font-semibold text-gray-300 mb-3">Difficulty:</p>
                      <div className="flex gap-3">
                        {[
                          { level: 'Easy', desc: 'Basic everyday sentences' },
                          { level: 'Medium', desc: 'Workplace phrases' },
                          { level: 'Hard', desc: 'Complex sentences' },
                        ].map(d => (
                          <button
                            key={d.level}
                            onClick={() => setQuizDifficulty(d.level)}
                            className={`flex-1 py-3 rounded-xl border-2 transition text-center ${
                              quizDifficulty === d.level
                                ? 'border-purple-500 bg-purple-900 bg-opacity-30'
                                : 'border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            <p className="font-bold text-white text-sm">{d.level}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{d.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={generateQuiz}
                      disabled={quizGenerating}
                      className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3.5 rounded-xl font-bold transition disabled:opacity-40 shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2"
                    >
                      {quizGenerating ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          <span>Generating Quiz...</span>
                        </>
                      ) : (
                        `🤖 Generate ${quizLang} → English Quiz`
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {quizStage === 'quiz' && quizQuestions.length > 0 && (
              <div className="space-y-4">

                {/* Progress */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Question {currentQ + 1} of {quizQuestions.length}</span>
                    <span className="text-xs bg-purple-900 bg-opacity-50 border border-purple-800 text-purple-300 px-2 py-0.5 rounded-full">
                      🤖 {quizLang} → English
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full transition-all"
                      style={{ width: `${(currentQ / quizQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                    <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                      {quizLang} → English
                    </span>
                    {quizQuestions[currentQ]?.hint && (
                      <span className="text-xs text-gray-600">💡 {quizQuestions[currentQ]?.hint}</span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="relative pl-4 border-l-2 border-purple-600 mb-5">
                      <p className="text-xs text-gray-500 mb-1">Translate this to English:</p>
                      <p className="text-white text-xl font-medium">{quizQuestions[currentQ]?.native}</p>
                    </div>

                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Your Translation in English:
                    </label>
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={e => setUserAnswer(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && !showAnswer && userAnswer.trim() && checkAnswer()}
                      placeholder="Type translation in English..."
                      disabled={showAnswer}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition text-sm disabled:opacity-60"
                    />

                    {!showAnswer && (
                      <button
                        onClick={checkAnswer}
                        disabled={!userAnswer.trim() || checkingAnswer}
                        className="w-full mt-3 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition disabled:opacity-40 flex items-center justify-center gap-2"
                      >
                        {checkingAnswer ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>AI is checking...</span>
                          </>
                        ) : '✅ Check Answer'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Result */}
                {showAnswer && quizResult && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                      <p className="font-bold text-white">AI Feedback</p>
                      <span className={`text-2xl font-bold ${
                        quizResult.score >= 80 ? 'text-green-400' :
                        quizResult.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>{quizResult.score}%</span>
                    </div>
                    <div className="p-6 space-y-4">

                      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                        <p className="text-xs font-bold text-green-400 mb-1">✅ Correct Answer:</p>
                        <p className="text-white font-medium">{quizResult.correction || quizQuestions[currentQ]?.english}</p>
                      </div>

                      {/* English Feedback */}
                      <div className="relative pl-4 border-l-2 border-purple-600">
                        <p className="text-xs font-bold text-purple-400 mb-1">Feedback (English):</p>
                        <p className="text-gray-300 text-sm">{quizResult.feedback}</p>
                      </div>

                      {/* Native Language Feedback */}
                      {quizResult.feedback_native && (
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                          <p className="text-xs font-bold text-purple-400 mb-1">🌍 Feedback ({quizLang}):</p>
                          <p className="text-gray-300 text-sm leading-relaxed">{quizResult.feedback_native}</p>
                        </div>
                      )}

                      {quizResult.tip && (
                        <div className="flex items-start gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
                          <span className="text-yellow-500 text-sm mt-0.5">💡</span>
                          <p className="text-gray-400 text-sm">{quizResult.tip}</p>
                        </div>
                      )}

                      <button
                        onClick={nextQuestion}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition"
                      >
                        {currentQ + 1 === quizQuestions.length ? 'See Results 🎉' : 'Next Question →'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {quizStage === 'result' && (
              <div className="space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="relative p-8 text-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 opacity-50"></div>
                    <div className="relative">
                      <p className="text-5xl mb-4">
                        {avgScore >= 80 ? '🏆' : avgScore >= 60 ? '🌟' : '💪'}
                      </p>
                      <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
                      <div className={`text-5xl font-bold mb-2 ${
                        avgScore >= 80 ? 'text-green-400' :
                        avgScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>{avgScore}%</div>
                      <p className="text-gray-400 text-sm">
                        {quizLang} → English • {quizDifficulty}
                      </p>
                      <p className="text-gray-300 mt-2">
                        {avgScore >= 80 ? 'Excellent translation skills!' :
                         avgScore >= 60 ? 'Good effort! Keep practicing!' :
                         'Keep going! Practice makes perfect!'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-800">
                    <p className="font-bold text-white">Question Breakdown</p>
                  </div>
                  <div className="divide-y divide-gray-800">
                    {quizQuestions.map((q, i) => (
                      <div key={i} className="px-6 py-3 flex justify-between items-center">
                        <p className="text-gray-300 text-sm flex-1 pr-4 truncate">Q{i+1}: {q.native}</p>
                        <span className={`text-sm font-bold flex-shrink-0 ${
                          (scores[i] || 0) >= 80 ? 'text-green-400' :
                          (scores[i] || 0) >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>{scores[i] || 0}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setQuizStage('setup'); setScores([]) }}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition"
                  >
                    Try Again 🔄
                  </button>
                  <button
                    onClick={() => setActiveTab('translator')}
                    className="flex-1 bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white py-3 rounded-xl font-bold transition"
                  >
                    Back to Translator
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </Layout>
  )
}

export default Translator
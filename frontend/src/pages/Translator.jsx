import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function Translator() {
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [fromLang, setFromLang] = useState('auto')
  const [toLang, setToLang] = useState('en')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState([])

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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">🌍 Translator</h2>
          <p className="text-gray-400 mt-1">Translate between English and 15+ languages instantly</p>
        </div>

        {/* Main Translator Card - 3D Effect */}
        <div className="relative transform transition-all duration-300 hover:scale-[1.01]">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative bg-gray-900 border border-gray-700 rounded-3xl overflow-hidden shadow-2xl">

            {/* Language Selector Bar */}
            <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center gap-4">
              <select
                value={fromLang}
                onChange={e => setFromLang(e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition font-medium"
              >
                <option value="auto">🌐 Auto Detect</option>
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                ))}
              </select>

              <button
                onClick={swapLanguages}
                className="w-12 h-12 bg-gray-900 border border-gray-700 hover:border-purple-500 hover:bg-purple-900 hover:bg-opacity-30 rounded-xl flex items-center justify-center text-xl transition group flex-shrink-0"
              >
                <span className="group-hover:rotate-180 transition-transform duration-300">⇄</span>
              </button>

              <select
                value={toLang}
                onChange={e => setToLang(e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition font-medium"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                ))}
              </select>
            </div>

            {/* Text Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-700">

              {/* Input */}
              <div className="relative p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{getLangInfo(fromLang).flag}</span>
                  <span className="text-gray-400 text-sm font-medium">{fromLang === 'auto' ? 'Auto Detect' : getLangInfo(fromLang).name}</span>
                </div>
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Type or paste text to translate..."
                  rows={6}
                  className="w-full bg-transparent text-white placeholder-gray-600 focus:outline-none resize-none text-lg"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-600">{inputText.length} characters</p>
                  <div className="flex gap-2">
                    {inputText && (
                      <button
                        onClick={() => speakText(inputText, fromLang)}
                        className="text-gray-500 hover:text-purple-400 transition text-xl"
                      >
                        🔊
                      </button>
                    )}
                    {inputText && (
                      <button
                        onClick={() => setInputText('')}
                        className="text-gray-500 hover:text-red-400 transition"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Output */}
              <div className="relative p-4 bg-gray-800 bg-opacity-50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{getLangInfo(toLang).flag}</span>
                  <span className="text-gray-400 text-sm font-medium">{getLangInfo(toLang).name}</span>
                </div>
                {loading ? (
                  <div className="flex items-center gap-2 mt-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                ) : (
                  <p className={`text-lg leading-relaxed ${translatedText ? 'text-white' : 'text-gray-600'}`}>
                    {translatedText || 'Translation will appear here...'}
                  </p>
                )}
                {translatedText && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => speakText(translatedText, toLang)}
                      className="text-gray-500 hover:text-purple-400 transition text-xl"
                    >
                      🔊
                    </button>
                    <button
                      onClick={() => copyText(translatedText)}
                      className="text-gray-500 hover:text-green-400 transition text-sm flex items-center gap-1"
                    >
                      {copied ? '✅ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Translate Button */}
            <div className="border-t border-gray-700 p-4">
              <button
                onClick={translate}
                disabled={loading || !inputText.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3.5 rounded-xl font-bold text-lg transition disabled:opacity-50 shadow-lg shadow-purple-900"
              >
                {loading ? 'Translating...' : `Translate to ${getLangInfo(toLang).name} ${getLangInfo(toLang).flag}`}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Translations */}
        {history.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="font-bold text-gray-200 mb-4">🕐 Recent Translations</h3>
            <div className="space-y-3">
              {history.map((item, i) => (
                <div
                  key={i}
                  onClick={() => { setInputText(item.input); setTranslatedText(item.output); setFromLang(item.from); setToLang(item.to) }}
                  className="flex items-center gap-4 bg-gray-800 border border-gray-700 hover:border-gray-500 rounded-xl px-4 py-3 cursor-pointer transition group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-sm truncate">{item.input}</p>
                    <p className="text-purple-400 text-xs truncate mt-0.5">{item.output}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-600">{getLangInfo(item.from).flag} → {getLangInfo(item.to).flag}</span>
                    <span className="text-xs text-gray-600">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Phrases */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-gray-200">💬 Common Phrases for Newcomers</h3>
            <p className="text-gray-600 text-xs">Click to translate instantly</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commonPhrases.map((phrase, i) => (
              <button
                key={i}
                onClick={() => { setInputText(phrase.english); setFromLang('en') }}
                className="flex items-center gap-3 border border-gray-800 hover:border-purple-700 hover:bg-purple-900 hover:bg-opacity-10 rounded-xl p-4 text-left transition group"
              >
                <span className="text-2xl group-hover:scale-110 transition">{phrase.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-200 text-sm truncate">{phrase.english}</p>
                  <p className="text-xs text-purple-400 mt-0.5">{phrase.context}</p>
                </div>
                <span className="text-gray-600 group-hover:text-purple-400 transition">→</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default Translator
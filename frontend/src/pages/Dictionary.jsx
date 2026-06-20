import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function Dictionary() {
  const navigate = useNavigate()
  const [searchWord, setSearchWord] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedWords, setSavedWords] = useState([])
  const [savedWordsLoading, setSavedWordsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('search')
  const [flipped, setFlipped] = useState(null)

  // Word of the Day
  const [wordOfTheDay, setWordOfTheDay] = useState(null)
  const [wotdLoading, setWotdLoading] = useState(true)

  // Quiz states
  const [quizWord, setQuizWord] = useState(null)
  const [quizOptions, setQuizOptions] = useState([])
  const [quizSelected, setQuizSelected] = useState(null)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [quizTotal, setQuizTotal] = useState(0)
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizExplanation, setQuizExplanation] = useState('')

  const trendingWords = [
    'Perseverance', 'Resilient', 'Proactive', 'Articulate', 'Ambitious'
  ]

  useEffect(() => {
    loadWordOfDay()
    loadSavedWords()
  }, [])

  const loadWordOfDay = async () => {
    const today = new Date().toISOString().split('T')[0]
    const cached = localStorage.getItem(`wordOfDay_${today}`)

    if (cached) {
      setWordOfTheDay(JSON.parse(cached))
      setWotdLoading(false)
      return
    }

    setWotdLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/word-of-day/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ native_language: 'English' })
      })
      const data = await response.json()
      localStorage.setItem(`wordOfDay_${today}`, JSON.stringify(data))
      setWordOfTheDay(data)
    } catch (err) {
      console.log('Could not load word of the day')
    }
    setWotdLoading(false)
  }

  const loadSavedWords = async () => {
    const email = localStorage.getItem('email')
    if (!email) return
    setSavedWordsLoading(true)
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/saved-words?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      setSavedWords(data)
    } catch (err) {
      console.log('Could not load saved words')
    }
    setSavedWordsLoading(false)
  }

  const searchDictionary = async (word = searchWord) => {
    if (!word.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      const data = await response.json()
      if (response.ok && data.length > 0) {
        const entry = data[0]
        setResult({
          word: entry.word,
          phonetic: entry.phonetic || '',
          meanings: entry.meanings.slice(0, 3).map(m => ({
            partOfSpeech: m.partOfSpeech,
            definition: m.definitions[0].definition,
            example: m.definitions[0].example || '',
            synonyms: m.synonyms?.slice(0, 4) || []
          }))
        })

        const email = localStorage.getItem('email')
        if (email) {
          fetch('http://127.0.0.1:8000/api/dictionary/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_email: email, word: entry.word })
          }).catch(() => {})
        }
      } else {
        setError('Word not found. Try another word!')
      }
    } catch (err) {
      setError('Could not connect. Please try again!')
    }
    setLoading(false)
  }

  const saveWord = async () => {
    if (!result) return
    const alreadySaved = savedWords.find(w => w.word.toLowerCase() === result.word.toLowerCase())
    if (alreadySaved) return

    const email = localStorage.getItem('email')
    if (!email) return

    const newWord = {
      word: result.word,
      meaning: result.meanings[0].definition,
      example: result.meanings[0].example,
      partOfSpeech: result.meanings[0].partOfSpeech
    }

    setSavedWords(prev => [newWord, ...prev])

    try {
      await fetch('http://127.0.0.1:8000/api/saved-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: email, ...newWord })
      })
      loadSavedWords()
    } catch (err) {
      console.log('Could not save word', err)
    }
  }

  const removeWord = async (wordObj) => {
    setSavedWords(prev => prev.filter(w => w.word !== wordObj.word))

    const email = localStorage.getItem('email')
    if (!email || !wordObj.id) return

    try {
      await fetch(`http://127.0.0.1:8000/api/saved-words/${wordObj.id}?email=${encodeURIComponent(email)}`, {
        method: 'DELETE'
      })
    } catch (err) {
      console.log('Could not remove word', err)
    }
  }

  const saveWordOfDay = async () => {
    if (!wordOfTheDay) return
    const alreadySaved = savedWords.find(w => w.word.toLowerCase() === wordOfTheDay.word.toLowerCase())
    if (alreadySaved) return

    const email = localStorage.getItem('email')
    if (!email) return

    const newWord = {
      word: wordOfTheDay.word,
      meaning: wordOfTheDay.meaning,
      example: wordOfTheDay.example,
      partOfSpeech: wordOfTheDay.partOfSpeech
    }

    setSavedWords(prev => [newWord, ...prev])

    try {
      await fetch('http://127.0.0.1:8000/api/saved-words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: email, ...newWord })
      })
      loadSavedWords()
    } catch (err) {
      console.log('Could not save word', err)
    }
  }

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'en-CA'
      utterance.rate = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }

  const generateQuiz = async () => {
    setQuizLoading(true)
    setQuizSelected(null)
    setQuizAnswered(false)
    setQuizExplanation('')

    const wordsToUse = savedWords.length >= 4 ? savedWords : [
      ...savedWords,
      { word: 'Perseverance', meaning: 'Continued effort despite difficulty', partOfSpeech: 'noun' },
      { word: 'Resilient', meaning: 'Able to recover quickly from difficulties', partOfSpeech: 'adjective' },
      { word: 'Articulate', meaning: 'Able to express ideas clearly', partOfSpeech: 'adjective' },
      { word: 'Proactive', meaning: 'Taking action before problems occur', partOfSpeech: 'adjective' },
      { word: 'Etiquette', meaning: 'Rules of polite behavior', partOfSpeech: 'noun' },
    ]

    const shuffled = [...wordsToUse].sort(() => Math.random() - 0.5)
    const correct = shuffled[0]
    const wrongOptions = shuffled.slice(1, 4).map(w => w.meaning)
    const allOptions = [correct.meaning, ...wrongOptions].sort(() => Math.random() - 0.5)

    setQuizWord(correct)
    setQuizOptions(allOptions)
    setQuizLoading(false)
  }

  const handleQuizAnswer = async (option) => {
    if (quizAnswered) return
    setQuizSelected(option)
    setQuizAnswered(true)

    const isCorrect = option === quizWord.meaning
    if (isCorrect) setQuizScore(prev => prev + 1)
    setQuizTotal(prev => prev + 1)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/quiz/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: quizWord.word,
          correct_answer: quizWord.meaning,
          user_answer: option,
          native_language: 'English'
        })
      })
      const data = await response.json()
      setQuizExplanation(data.explanation)
    } catch (err) {
      setQuizExplanation(`${quizWord.word}: ${quizWord.meaning}. ${isCorrect ? 'Great job!' : 'Keep practicing!'}`)
    }
  }

  const getPosColor = (pos) => {
    const colors = {
      'noun': 'text-blue-400 bg-blue-900 bg-opacity-20 border-blue-800',
      'verb': 'text-green-400 bg-green-900 bg-opacity-20 border-green-800',
      'adjective': 'text-purple-400 bg-purple-900 bg-opacity-20 border-purple-800',
      'adverb': 'text-yellow-400 bg-yellow-900 bg-opacity-20 border-yellow-800',
    }
    return colors[pos] || 'text-gray-400 bg-gray-800 border-gray-700'
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
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">English Dictionary + Quiz</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Dictionary</h2>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                Search any English word for definitions, pronunciation and examples. Save words and test yourself with AI quizzes!
              </p>
              <div className="flex items-center gap-4 mt-4">
                {[
                  { value: '170K+', label: 'Words' },
                  { value: savedWords.length.toString(), label: 'Saved' },
                  { value: 'AI', label: 'Quiz' },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-lg font-bold text-purple-400">{stat.value}</p>
                    <p className="text-gray-500 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block text-8xl opacity-10">📖</div>
          </div>
        </div>

        {/* Word of the Day */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">🤖 AI Word of the Day</p>
            </div>
            {wordOfTheDay && !wotdLoading && (
              <div className="flex gap-2">
                <button
                  onClick={() => speakWord(wordOfTheDay.word)}
                  className="text-gray-600 hover:text-purple-400 transition"
                >
                  🔊
                </button>
                <button
                  onClick={saveWordOfDay}
                  className="text-gray-600 hover:text-yellow-400 transition"
                >
                  ⭐
                </button>
              </div>
            )}
          </div>

          {wotdLoading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm">AI is picking today's word...</p>
            </div>
          ) : wordOfTheDay ? (
            <div className="p-6">
              <div className="relative pl-4 border-l-2 border-purple-600">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-3xl font-bold text-white">{wordOfTheDay.word}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getPosColor(wordOfTheDay.partOfSpeech)}`}>
                    {wordOfTheDay.partOfSpeech}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-1">{wordOfTheDay.pronunciation}</p>
                <p className="text-gray-200 mb-2">{wordOfTheDay.meaning}</p>
                <p className="text-gray-500 text-sm italic">"{wordOfTheDay.example}"</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {wordOfTheDay.synonyms?.map((syn, i) => (
                  <button
                    key={i}
                    onClick={() => { setSearchWord(syn); setActiveTab('search'); searchDictionary(syn) }}
                    className="bg-gray-800 border border-gray-700 hover:border-purple-500 text-gray-400 hover:text-white px-3 py-1 rounded-full text-xs transition"
                  >
                    {syn}
                  </button>
                ))}
              </div>
              <div className="flex items-start gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 mt-4">
                <span className="text-yellow-500 text-sm mt-0.5">💡</span>
                <p className="text-gray-400 text-sm">{wordOfTheDay.tip}</p>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 text-sm">Could not load word of the day</div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-1.5 flex gap-1">
          {[
            { id: 'search', label: '🔍 Search' },
            { id: 'saved', label: `⭐ Saved (${savedWords.length})` },
            { id: 'quiz', label: '🧠 Word Quiz' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                if (tab.id === 'quiz' && !quizWord) generateQuiz()
              }}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* SEARCH TAB */}
        {activeTab === 'search' && (
          <div className="space-y-4">

            {/* Search Bar */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="p-5">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={searchWord}
                      onChange={e => setSearchWord(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && searchDictionary()}
                      placeholder="Search any English word..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition text-sm pr-10"
                    />
                    {searchWord && (
                      <button
                        onClick={() => speakWord(searchWord)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-purple-400 transition"
                      >
                        🔊
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => searchDictionary()}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 rounded-xl font-bold transition disabled:opacity-40 shadow-lg shadow-purple-900/40"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin block"></span>
                    ) : '🔍'}
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <p className="text-xs text-gray-600">Try:</p>
                  {trendingWords.map(word => (
                    <button
                      key={word}
                      onClick={() => { setSearchWord(word); searchDictionary(word) }}
                      className="text-xs bg-gray-800 border border-gray-700 hover:border-purple-500 text-gray-400 hover:text-white px-3 py-1 rounded-full transition"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-gray-900 border border-red-800 rounded-2xl px-5 py-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {result && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-3xl font-bold text-white">{result.word}</h3>
                      <button
                        onClick={() => speakWord(result.word)}
                        className="text-gray-600 hover:text-purple-400 transition text-xl"
                      >
                        🔊
                      </button>
                    </div>
                    {result.phonetic && (
                      <p className="text-gray-500 text-sm">{result.phonetic}</p>
                    )}
                  </div>
                  <button
                    onClick={saveWord}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow-lg shadow-purple-900/40"
                  >
                    ⭐ Save
                  </button>
                </div>

                <div className="divide-y divide-gray-800">
                  {result.meanings.map((meaning, i) => (
                    <div key={i} className="px-6 py-5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border mb-3 inline-block ${getPosColor(meaning.partOfSpeech)}`}>
                        {meaning.partOfSpeech}
                      </span>
                      <div className="relative pl-4 border-l-2 border-purple-600">
                        <p className="text-gray-200 text-sm leading-relaxed mb-2">{meaning.definition}</p>
                        {meaning.example && (
                          <p className="text-gray-500 text-xs italic">"{meaning.example}"</p>
                        )}
                      </div>
                      {meaning.synonyms.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          <p className="text-xs text-gray-600 mt-0.5">Synonyms:</p>
                          {meaning.synonyms.map((syn, j) => (
                            <button
                              key={j}
                              onClick={() => { setSearchWord(syn); searchDictionary(syn) }}
                              className="text-xs bg-gray-800 border border-gray-700 hover:border-purple-500 text-gray-400 hover:text-white px-2 py-0.5 rounded-full transition"
                            >
                              {syn}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!result && !error && !loading && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                <p className="text-5xl mb-4 opacity-20">📖</p>
                <p className="text-gray-500 text-sm">Search any English word to see its definition, pronunciation and examples</p>
              </div>
            )}
          </div>
        )}

        {/* SAVED TAB */}
        {activeTab === 'saved' && (
          <div>
            {savedWordsLoading ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 flex justify-center">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : savedWords.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                <p className="text-5xl mb-4 opacity-20">⭐</p>
                <p className="text-gray-400 font-medium mb-1">No saved words yet</p>
                <p className="text-gray-600 text-sm">Search and save words to build your vocabulary list</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {savedWords.map((word, i) => (
                  <div
                    key={word.id || i}
                    onClick={() => setFlipped(flipped === i ? null : i)}
                    className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl p-5 cursor-pointer transition group"
                  >
                    {flipped !== i ? (
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-xl font-bold text-white">{word.word}</h4>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border mt-1 inline-block ${getPosColor(word.partOfSpeech)}`}>
                              {word.partOfSpeech}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); speakWord(word.word) }}
                              className="text-gray-600 hover:text-purple-400 transition"
                            >
                              🔊
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeWord(word) }}
                              className="text-gray-700 hover:text-red-400 transition"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        <div className="relative pl-3 border-l-2 border-purple-600">
                          <p className="text-gray-400 text-sm">{word.meaning}</p>
                        </div>
                        <p className="text-purple-400 text-xs mt-3">👆 Tap to see example</p>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-xl font-bold text-white mb-3">{word.word}</h4>
                        <div className="relative pl-3 border-l-2 border-purple-600">
                          <p className="text-gray-400 text-sm italic">"{word.example || 'No example available'}"</p>
                        </div>
                        <p className="text-purple-400 text-xs mt-3">👆 Tap to flip back</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* QUIZ TAB */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">

            {/* Quiz Header */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">Word Quiz</p>
                  <p className="text-gray-500 text-xs mt-0.5">Test your vocabulary knowledge</p>
                </div>
                <div className="flex items-center gap-3">
                  {quizTotal > 0 && (
                    <span className="text-sm font-bold text-purple-400">
                      {quizScore}/{quizTotal} correct
                    </span>
                  )}
                  <button
                    onClick={generateQuiz}
                    disabled={quizLoading}
                    className="bg-gray-800 border border-gray-700 hover:border-purple-500 text-gray-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium transition"
                  >
                    {quizLoading ? '...' : '🔄 New Question'}
                  </button>
                </div>
              </div>

              {quizWord && (
                <div className="p-6">
                  <div className="relative pl-4 border-l-2 border-purple-600 mb-6">
                    <p className="text-xs text-gray-500 mb-1">What does this word mean?</p>
                    <div className="flex items-center gap-3">
                      <h3 className="text-3xl font-bold text-white">{quizWord.word}</h3>
                      <button
                        onClick={() => speakWord(quizWord.word)}
                        className="text-gray-600 hover:text-purple-400 transition"
                      >
                        🔊
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-5">
                    {quizOptions.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuizAnswer(option)}
                        className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition text-sm font-medium ${
                          !quizAnswered
                            ? 'border-gray-700 bg-gray-800 hover:border-gray-500 text-gray-200'
                            : option === quizWord.meaning
                            ? 'border-green-500 bg-green-900 bg-opacity-20 text-green-300'
                            : option === quizSelected
                            ? 'border-red-500 bg-red-900 bg-opacity-20 text-red-300'
                            : 'border-gray-800 bg-gray-900 text-gray-600'
                        }`}
                      >
                        {option}
                        {quizAnswered && option === quizWord.meaning && ' ✅'}
                        {quizAnswered && option === quizSelected && option !== quizWord.meaning && ' ❌'}
                      </button>
                    ))}
                  </div>

                  {quizAnswered && (
                    <div className="space-y-3">
                      {quizExplanation && (
                        <div className="relative pl-4 border-l-2 border-purple-600 bg-gray-800 border border-gray-700 rounded-xl p-4">
                          <p className="text-xs font-bold text-purple-400 mb-1">🤖 AI Explanation</p>
                          <p className="text-gray-300 text-sm leading-relaxed">{quizExplanation}</p>
                        </div>
                      )}
                      <button
                        onClick={generateQuiz}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition"
                      >
                        Next Word →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {savedWords.length < 4 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
                <p className="text-gray-400 text-sm mb-2">Save more words to make the quiz harder!</p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                >
                  Search Words →
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </Layout>
  )
}

export default Dictionary
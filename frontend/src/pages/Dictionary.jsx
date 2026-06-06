import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function Dictionary() {
  const navigate = useNavigate()
  const [searchWord, setSearchWord] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [savedWords, setSavedWords] = useState([
    { word: 'Confident', meaning: 'Feeling sure about yourself', example: 'She was confident during the interview.', partOfSpeech: 'adjective' },
    { word: 'Fluent', meaning: 'Able to speak a language easily', example: 'He speaks fluent English.', partOfSpeech: 'adjective' },
    { word: 'Etiquette', meaning: 'Rules of polite behavior', example: 'Workplace etiquette is important in Canada.', partOfSpeech: 'noun' },
  ])
  const [activeTab, setActiveTab] = useState('search')
  const [flipped, setFlipped] = useState(null)

  const wordOfTheDay = {
    word: 'Perseverance',
    pronunciation: '/ˌpɜːrsɪˈvɪərəns/',
    partOfSpeech: 'noun',
    meaning: 'Continued effort to do something despite difficulty or failure',
    example: 'Her perseverance helped her learn English in just 6 months.',
    synonyms: ['persistence', 'determination', 'resilience'],
    tip: 'Use this word in job interviews to describe your work ethic!'
  }

  const trendingWords = [
    { word: 'Networking', hint: 'Professional relationships' },
    { word: 'Resilient', hint: 'Bouncing back from difficulty' },
    { word: 'Proactive', hint: 'Acting before problems occur' },
    { word: 'Articulate', hint: 'Expressing ideas clearly' },
    { word: 'Ambitious', hint: 'Having strong goals' },
  ]

  const searchDictionary = async () => {
    if (!searchWord.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`)
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
      } else {
        setError('Word not found. Try another word!')
      }
    } catch (err) {
      setError('Could not connect. Please try again!')
    }
    setLoading(false)
  }

  const saveWord = () => {
    if (!result) return
    const alreadySaved = savedWords.find(w => w.word.toLowerCase() === result.word.toLowerCase())
    if (alreadySaved) return
    setSavedWords(prev => [...prev, {
      word: result.word,
      meaning: result.meanings[0].definition,
      example: result.meanings[0].example,
      partOfSpeech: result.meanings[0].partOfSpeech
    }])
  }

  const removeWord = (word) => {
    setSavedWords(prev => prev.filter(w => w.word !== word))
  }

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'en-CA'
      utterance.rate = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }

  const getPosColor = (pos) => {
    const colors = {
      'noun': 'bg-blue-900 bg-opacity-50 border-blue-700 text-blue-300',
      'verb': 'bg-green-900 bg-opacity-50 border-green-700 text-green-300',
      'adjective': 'bg-purple-900 bg-opacity-50 border-purple-700 text-purple-300',
      'adverb': 'bg-orange-900 bg-opacity-50 border-orange-700 text-orange-300',
    }
    return colors[pos] || 'bg-gray-800 border-gray-700 text-gray-300'
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">📖 Dictionary</h2>
            <p className="text-gray-400 mt-1">Search words, save vocabulary and master pronunciation</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/quiz')}
              className="bg-purple-900 bg-opacity-50 border border-purple-700 text-purple-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              🧠 Take Quiz
            </button>
          </div>
        </div>

        {/* Word of the Day - 3D Card */}
        <div className="relative group perspective-1000">
          <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 border border-purple-700 rounded-3xl p-8 overflow-hidden transform transition-transform duration-500 hover:scale-[1.02] shadow-2xl shadow-purple-900">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600 rounded-full filter blur-3xl opacity-10"></div>

            <div className="relative flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-yellow-500 bg-opacity-20 border border-yellow-500 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full">✨ WORD OF THE DAY</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getPosColor(wordOfTheDay.partOfSpeech)}`}>
                    {wordOfTheDay.partOfSpeech}
                  </span>
                </div>

                <h3 className="text-5xl font-bold text-white mb-2 tracking-tight">{wordOfTheDay.word}</h3>
                <p className="text-purple-300 text-lg mb-4">{wordOfTheDay.pronunciation}</p>
                <p className="text-gray-200 text-lg mb-3 leading-relaxed">{wordOfTheDay.meaning}</p>
                <p className="text-gray-400 italic mb-4">"{wordOfTheDay.example}"</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {wordOfTheDay.synonyms.map((syn, i) => (
                    <span
                      key={i}
                      onClick={() => { setSearchWord(syn); setActiveTab('search') }}
                      className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white border-opacity-20 text-gray-300 px-3 py-1 rounded-full text-sm cursor-pointer transition"
                    >
                      {syn}
                    </span>
                  ))}
                </div>

                <p className="text-yellow-400 text-sm">💡 {wordOfTheDay.tip}</p>
              </div>

              <div className="flex flex-col gap-2 ml-4">
                <button
                  onClick={() => speakWord(wordOfTheDay.word)}
                  className="w-12 h-12 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl flex items-center justify-center text-xl transition"
                >
                  🔊
                </button>
                <button
                  onClick={() => setSavedWords(prev =>
                    prev.find(w => w.word === wordOfTheDay.word) ? prev :
                    [...prev, { word: wordOfTheDay.word, meaning: wordOfTheDay.meaning, example: wordOfTheDay.example, partOfSpeech: wordOfTheDay.partOfSpeech }]
                  )}
                  className="w-12 h-12 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl flex items-center justify-center text-xl transition"
                >
                  ⭐
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchWord}
                onChange={e => setSearchWord(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && searchDictionary()}
                placeholder="Search any English word..."
                className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition text-lg pr-16"
              />
              {searchWord && (
                <button
                  onClick={() => speakWord(searchWord)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 transition text-xl"
                >
                  🔊
                </button>
              )}
            </div>
            <button
              onClick={searchDictionary}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-4 rounded-2xl transition disabled:opacity-50 font-bold text-lg shadow-lg shadow-purple-900"
            >
              {loading ? '...' : '🔍'}
            </button>
          </div>

          {/* Trending Words */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <p className="text-gray-600 text-xs mt-1">Trending:</p>
            {trendingWords.map((w, i) => (
              <button
                key={i}
                onClick={() => { setSearchWord(w.word); setActiveTab('search') }}
                className="bg-gray-900 border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white px-3 py-1 rounded-full text-xs transition"
              >
                {w.word}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {['search', 'saved'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-medium capitalize transition text-sm ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {tab === 'search' ? '🔍 Search Results' : `⭐ Saved Words (${savedWords.length})`}
            </button>
          ))}
        </div>

        {activeTab === 'search' && (
          <div>
            {error && (
              <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-400 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="flex gap-2 justify-center mb-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <p className="text-gray-500">Searching dictionary...</p>
              </div>
            )}

            {result && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                {/* Word Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 border-b border-gray-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-4xl font-bold text-white mb-2">{result.word}</h3>
                      {result.phonetic && (
                        <p className="text-gray-400 text-lg">{result.phonetic}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => speakWord(result.word)}
                        className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-xl flex items-center justify-center text-xl transition"
                      >
                        🔊
                      </button>
                      <button
                        onClick={saveWord}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-3 rounded-xl transition font-medium text-sm"
                      >
                        ⭐ Save
                      </button>
                    </div>
                  </div>
                </div>

                {/* Meanings */}
                <div className="p-6 space-y-5">
                  {result.meanings.map((meaning, i) => (
                    <div key={i} className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getPosColor(meaning.partOfSpeech)}`}>
                          {meaning.partOfSpeech}
                        </span>
                        <div className="flex-1 h-px bg-gray-800"></div>
                      </div>

                      <p className="text-gray-200 text-lg leading-relaxed mb-2">{meaning.definition}</p>

                      {meaning.example && (
                        <div className="bg-gray-800 border-l-4 border-purple-500 rounded-r-xl px-4 py-3 mb-3">
                          <p className="text-gray-400 italic text-sm">"{meaning.example}"</p>
                        </div>
                      )}

                      {meaning.synonyms.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <p className="text-gray-600 text-xs mt-1">Synonyms:</p>
                          {meaning.synonyms.map((syn, j) => (
                            <button
                              key={j}
                              onClick={() => { setSearchWord(syn); searchDictionary() }}
                              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white px-3 py-1 rounded-full text-xs transition"
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
              <div className="text-center py-16">
                <div className="text-8xl mb-6 animate-pulse">📖</div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">Search any English word</h3>
                <p className="text-gray-600 mb-6">Get definitions, pronunciation, examples and synonyms instantly</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  {['Perseverance', 'Etiquette', 'Confident', 'Ambitious', 'Resilient'].map(word => (
                    <button
                      key={word}
                      onClick={() => { setSearchWord(word); searchDictionary() }}
                      className="bg-gray-900 border border-gray-700 hover:border-purple-500 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-sm transition"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            {savedWords.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">⭐</div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">No saved words yet!</h3>
                <p className="text-gray-600">Search and save words to build your personal vocabulary list</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedWords.map((word, i) => (
                  <div
                    key={i}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition group cursor-pointer"
                    onClick={() => setFlipped(flipped === i ? null : i)}
                  >
                    {flipped !== i ? (
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="text-xl font-bold text-white">{word.word}</h4>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border mt-1 inline-block ${getPosColor(word.partOfSpeech)}`}>
                              {word.partOfSpeech}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); speakWord(word.word) }}
                              className="text-gray-500 hover:text-purple-400 transition text-xl"
                            >
                              🔊
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeWord(word.word) }}
                              className="text-gray-600 hover:text-red-400 transition"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm">{word.meaning}</p>
                        <p className="text-purple-400 text-xs mt-3">👆 Tap to see example</p>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-xl font-bold text-white mb-3">{word.word}</h4>
                        <div className="bg-gray-800 border-l-4 border-purple-500 rounded-r-xl px-4 py-3">
                          <p className="text-gray-300 italic text-sm">"{word.example || 'No example available'}"</p>
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

      </div>
    </Layout>
  )
}

export default Dictionary
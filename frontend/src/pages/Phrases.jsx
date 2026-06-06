import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function Phrases() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('workplace')
  const [expandedPhrase, setExpandedPhrase] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [savedPhrases, setSavedPhrases] = useState([])
  const [showSaved, setShowSaved] = useState(false)
  const [aiMode, setAiMode] = useState(null)
  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [userPractice, setUserPractice] = useState('')
  const [nativeLanguage, setNativeLanguage] = useState('Hindi')

  const categories = [
    { id: 'workplace', icon: '🏢', title: 'Workplace', color: 'from-purple-600 to-purple-800', count: 10 },
    { id: 'social', icon: '🤝', title: 'Social', color: 'from-blue-600 to-blue-800', count: 7 },
    { id: 'canadian', icon: '🍁', title: 'Canadian', color: 'from-red-600 to-red-800', count: 7 },
    { id: 'interview', icon: '💼', title: 'Interview', color: 'from-green-600 to-green-800', count: 7 },
    { id: 'daily', icon: '☀️', title: 'Daily Life', color: 'from-yellow-600 to-yellow-800', count: 6 },
    { id: 'slang', icon: '😎', title: 'Slang', color: 'from-pink-600 to-pink-800', count: 6 },
  ]

  const phrases = {
    workplace: [
      { phrase: 'Touch base', meaning: 'To make contact or check in with someone', example: 'Let\'s touch base tomorrow to discuss the project.', tip: 'Use this when you want to have a quick meeting or call.', level: 'Common' },
      { phrase: 'On the same page', meaning: 'Everyone understands and agrees on something', example: 'Before we start, let\'s make sure we\'re all on the same page.', tip: 'Very common in meetings and team discussions.', level: 'Essential' },
      { phrase: 'Give me a heads up', meaning: 'Warn or inform someone in advance', example: 'Give me a heads up before the client arrives.', tip: 'Use this to ask someone to notify you early.', level: 'Common' },
      { phrase: 'Circle back', meaning: 'Return to a topic or person later', example: 'Let\'s circle back to this issue after the meeting.', tip: 'Common way to say you\'ll discuss something later.', level: 'Common' },
      { phrase: 'Take it offline', meaning: 'Discuss something privately outside the meeting', example: 'This is a detailed topic — let\'s take it offline.', tip: 'Use when a topic needs more time than the meeting allows.', level: 'Professional' },
      { phrase: 'Bandwidth', meaning: 'The capacity or time someone has to do work', example: 'Do you have the bandwidth to take on this project?', tip: 'Used to ask if someone has enough time or energy.', level: 'Professional' },
      { phrase: 'Low hanging fruit', meaning: 'Easy tasks or goals that can be achieved quickly', example: 'Let\'s tackle the low hanging fruit first.', tip: 'Use when suggesting starting with the easiest tasks.', level: 'Common' },
      { phrase: 'Move the needle', meaning: 'To make a noticeable difference or progress', example: 'We need a strategy that will really move the needle.', tip: 'Common in business discussions about results.', level: 'Professional' },
      { phrase: 'Deep dive', meaning: 'A thorough examination of a subject', example: 'Let\'s do a deep dive into the sales data.', tip: 'Use when you want to analyze something in detail.', level: 'Common' },
      { phrase: 'Action item', meaning: 'A task that someone needs to complete', example: 'The action item from today\'s meeting is to send the report.', tip: 'Very common in meetings and emails.', level: 'Essential' },
    ],
    social: [
      { phrase: 'How\'s it going?', meaning: 'A casual greeting asking how you are', example: 'Hey! How\'s it going?', tip: 'More casual than "How are you?" — very common in Canada.', level: 'Essential' },
      { phrase: 'No worries', meaning: 'It\'s okay, don\'t be concerned', example: 'Sorry I\'m late! — No worries, we just started!', tip: 'Canadians use this constantly instead of "you\'re welcome".', level: 'Essential' },
      { phrase: 'For sure', meaning: 'Definitely, absolutely', example: 'Are you coming to the party? For sure!', tip: 'Very Canadian way to say yes enthusiastically.', level: 'Essential' },
      { phrase: 'Hang out', meaning: 'Spend time with someone casually', example: 'Want to hang out this weekend?', tip: 'Use when inviting friends to spend time together.', level: 'Common' },
      { phrase: 'My bad', meaning: 'My mistake, I apologize', example: 'Oh my bad, I forgot to text you!', tip: 'Very casual way to apologize.', level: 'Common' },
      { phrase: 'Rain check', meaning: 'Postpone plans to do something later', example: 'I can\'t make it tonight — can I take a rain check?', tip: 'Use when you can\'t attend something but want to reschedule.', level: 'Common' },
      { phrase: 'Catch up', meaning: 'Talk with someone you haven\'t seen in a while', example: 'We should catch up over coffee sometime!', tip: 'Very common when reconnecting with old friends.', level: 'Essential' },
    ],
    canadian: [
      { phrase: 'Double double', meaning: 'Coffee with two creams and two sugars at Tim Hortons', example: 'I\'ll have a double double please.', tip: 'Ordering this makes you sound like a true Canadian!', level: 'Must Know' },
      { phrase: 'Toque', meaning: 'A warm knitted hat worn in winter', example: 'Don\'t forget your toque — it\'s freezing outside!', tip: 'Pronounced "TOOOK". Every Canadian owns one!', level: 'Must Know' },
      { phrase: 'Eh?', meaning: 'A question tag meaning "right?" or "don\'t you think?"', example: 'Great game last night, eh?', tip: 'The most famous Canadian expression!', level: 'Must Know' },
      { phrase: 'Loonie and Toonie', meaning: 'Canadian one dollar and two dollar coins', example: 'Do you have a loonie for the parking meter?', tip: 'Loonie = $1 coin, Toonie = $2 coin.', level: 'Must Know' },
      { phrase: 'Hydro', meaning: 'Electricity or the electricity bill', example: 'Did you pay the hydro bill this month?', tip: 'Canadians call electricity "hydro" — don\'t be confused!', level: 'Must Know' },
      { phrase: 'Pop', meaning: 'Carbonated soft drink (soda)', example: 'Can I get a pop with my meal?', tip: 'Canadians say "pop" not "soda"!', level: 'Must Know' },
      { phrase: 'Kerfuffle', meaning: 'A commotion or fuss about something', example: 'There was a big kerfuffle at the office today.', tip: 'Very Canadian word for a small dramatic situation.', level: 'Fun' },
    ],
    interview: [
      { phrase: 'I\'m a team player', meaning: 'I work well with others', example: 'I consider myself a team player who communicates openly.', tip: 'Almost every interviewer expects to hear this!', level: 'Essential' },
      { phrase: 'Outside the box', meaning: 'Thinking creatively and differently', example: 'I like to think outside the box to find new solutions.', tip: 'Shows creativity and problem-solving skills.', level: 'Common' },
      { phrase: 'Track record', meaning: 'History of past achievements', example: 'I have a strong track record of meeting deadlines.', tip: 'Use to talk about your past work achievements.', level: 'Professional' },
      { phrase: 'Hit the ground running', meaning: 'Start something quickly and energetically', example: 'I\'m ready to hit the ground running from day one.', tip: 'Shows enthusiasm and readiness to start immediately.', level: 'Common' },
      { phrase: 'Self-starter', meaning: 'Someone who works independently without being told', example: 'I\'m a self-starter who takes initiative on projects.', tip: 'Shows you don\'t need constant supervision.', level: 'Essential' },
      { phrase: 'People person', meaning: 'Someone who enjoys working with others', example: 'I\'m a people person who loves building relationships.', tip: 'Great for customer service and team roles.', level: 'Common' },
      { phrase: 'Wear many hats', meaning: 'Handle many different responsibilities', example: 'I\'m comfortable wearing many hats in a small team.', tip: 'Shows flexibility and willingness to do various tasks.', level: 'Common' },
    ],
    daily: [
      { phrase: 'Bear with me', meaning: 'Please be patient with me', example: 'Bear with me while I find the right document.', tip: 'Very polite way to ask for patience.', level: 'Common' },
      { phrase: 'In a nutshell', meaning: 'To summarize briefly', example: 'In a nutshell, we need to improve our service.', tip: 'Use when giving a quick summary.', level: 'Common' },
      { phrase: 'On the fence', meaning: 'Undecided or neutral about something', example: 'I\'m still on the fence about which apartment to choose.', tip: 'Use when you haven\'t made a decision yet.', level: 'Common' },
      { phrase: 'Under the weather', meaning: 'Feeling sick or unwell', example: 'I\'m feeling a bit under the weather today.', tip: 'Polite way to say you\'re sick without details.', level: 'Essential' },
      { phrase: 'Cost an arm and a leg', meaning: 'Very expensive', example: 'That apartment costs an arm and a leg!', tip: 'Very common expression for expensive things.', level: 'Common' },
      { phrase: 'Once in a blue moon', meaning: 'Very rarely', example: 'We only go out for dinner once in a blue moon.', tip: 'Use to describe something that happens very rarely.', level: 'Common' },
    ],
    slang: [
      { phrase: 'Lit', meaning: 'Exciting, amazing, or fun', example: 'That concert was absolutely lit!', tip: 'Popular among younger Canadians.', level: 'Casual' },
      { phrase: 'Vibe', meaning: 'The feeling or atmosphere of something', example: 'This coffee shop has a really good vibe.', tip: 'Used to describe atmosphere or someone\'s energy.', level: 'Casual' },
      { phrase: 'GOAT', meaning: 'Greatest Of All Time', example: 'Wayne Gretzky is the GOAT of hockey.', tip: 'Used to praise someone as the absolute best.', level: 'Casual' },
      { phrase: 'Lowkey', meaning: 'Secretly or quietly, not making a big deal', example: 'I lowkey love Tim Hortons coffee.', tip: 'Use when admitting something casually.', level: 'Casual' },
      { phrase: 'No cap', meaning: 'I\'m not lying, I\'m being serious', example: 'That was the best poutine I\'ve ever had, no cap.', tip: 'Use to emphasize you\'re telling the truth.', level: 'Casual' },
      { phrase: 'Ghosting', meaning: 'Suddenly stopping all communication with someone', example: 'He just ghosted me after three dates!', tip: 'Very common in dating and social media context.', level: 'Casual' },
    ]
  }

  const phraseOfTheDay = {
    phrase: 'Hit the ground running',
    meaning: 'Start something quickly and with great energy',
    example: 'I want someone who can hit the ground running from day one.',
    category: 'Interview',
    tip: 'Use this in job interviews to show you are ready to start immediately!'
  }

  const allPhrases = Object.values(phrases).flat()
  const filteredPhrases = searchTerm
    ? allPhrases.filter(p =>
        p.phrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.meaning.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : phrases[activeCategory]

  const speakPhrase = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-CA'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleSave = (phrase) => {
    setSavedPhrases(prev =>
      prev.find(p => p.phrase === phrase.phrase)
        ? prev.filter(p => p.phrase !== phrase.phrase)
        : [...prev, phrase]
    )
  }

  const isSaved = (phrase) => savedPhrases.find(p => p.phrase === phrase.phrase)

  const callAI = async (phrase, meaning, action, userResponse = '') => {
    setAiLoading(true)
    setAiResponse('')
    try {
      const response = await fetch('http://127.0.0.1:8000/api/phrase-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phrase,
          meaning,
          action,
          user_response: userResponse,
          native_language: nativeLanguage
        })
      })
      const data = await response.json()
      setAiResponse(data.response)
    } catch (err) {
      setAiResponse('Could not connect. Please make sure backend is running!')
    }
    setAiLoading(false)
  }

  const getLevelColor = (level) => {
    const colors = {
      'Essential': 'bg-green-900 bg-opacity-50 border-green-700 text-green-300',
      'Must Know': 'bg-red-900 bg-opacity-50 border-red-700 text-red-300',
      'Common': 'bg-blue-900 bg-opacity-50 border-blue-700 text-blue-300',
      'Professional': 'bg-purple-900 bg-opacity-50 border-purple-700 text-purple-300',
      'Casual': 'bg-orange-900 bg-opacity-50 border-orange-700 text-orange-300',
      'Fun': 'bg-pink-900 bg-opacity-50 border-pink-700 text-pink-300',
    }
    return colors[level] || 'bg-gray-800 border-gray-700 text-gray-300'
  }

  const currentCategory = categories.find(c => c.id === activeCategory)

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">💬 English Phrases</h2>
            <p className="text-gray-400 mt-1">Master Canadian idioms, workplace phrases and everyday expressions</p>
          </div>
          {savedPhrases.length > 0 && (
            <button
              onClick={() => setShowSaved(!showSaved)}
              className="bg-purple-900 bg-opacity-50 border border-purple-700 text-purple-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition"
            >
              ⭐ Saved ({savedPhrases.length})
            </button>
          )}
        </div>

        {/* Phrase of the Day - 3D Card */}
        <div className="relative transform hover:scale-[1.01] transition duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-gray-900 border border-purple-700 rounded-3xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600 rounded-full filter blur-3xl opacity-10"></div>
            <div className="relative flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-yellow-500 bg-opacity-20 border border-yellow-500 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full">✨ PHRASE OF THE DAY</span>
                  <span className="bg-green-900 bg-opacity-50 border border-green-700 text-green-300 text-xs font-bold px-3 py-1 rounded-full">Interview</span>
                </div>
                <h3 className="text-4xl font-bold text-white mb-3">"{phraseOfTheDay.phrase}"</h3>
                <p className="text-gray-300 text-lg mb-3">{phraseOfTheDay.meaning}</p>
                <p className="text-gray-400 italic mb-4">"{phraseOfTheDay.example}"</p>
                <p className="text-yellow-400 text-sm">💡 {phraseOfTheDay.tip}</p>
              </div>
              <button
                onClick={() => speakPhrase(phraseOfTheDay.phrase)}
                className="w-12 h-12 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-xl flex items-center justify-center text-xl transition ml-4"
              >
                🔊
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search any phrase or idiom..."
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition text-base pl-12"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl">🔍</span>
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition">✕</button>
          )}
        </div>

        {/* Saved Phrases */}
        {showSaved && savedPhrases.length > 0 && (
          <div className="bg-purple-900 bg-opacity-20 border border-purple-700 rounded-2xl p-5">
            <h3 className="font-bold text-purple-300 mb-4">⭐ Saved Phrases ({savedPhrases.length})</h3>
            <div className="space-y-2">
              {savedPhrases.map((p, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-semibold text-white text-sm">"{p.phrase}"</p>
                    <p className="text-gray-500 text-xs mt-0.5">{p.meaning}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => speakPhrase(p.phrase)} className="text-gray-500 hover:text-purple-400 transition">🔊</button>
                    <button onClick={() => toggleSave(p)} className="text-yellow-400 hover:text-gray-400 transition">⭐</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Cards */}
        {!searchTerm && (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setExpandedPhrase(null); setAiMode(null); setAiResponse('') }}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl transition group overflow-hidden ${activeCategory === cat.id ? 'scale-105 shadow-xl' : 'hover:scale-105'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} ${activeCategory === cat.id ? 'opacity-100' : 'opacity-30 group-hover:opacity-60'} transition rounded-2xl`}></div>
                <span className="relative text-2xl group-hover:scale-110 transition">{cat.icon}</span>
                <span className="relative text-xs font-bold text-white">{cat.title}</span>
                <span className="relative text-xs text-white text-opacity-70">{cat.count} phrases</span>
              </button>
            ))}
          </div>
        )}

        {/* Category Header */}
        {!searchTerm && currentCategory && (
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${currentCategory.color} rounded-xl flex items-center justify-center text-xl`}>
              {currentCategory.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-200">{currentCategory.title} Phrases</h3>
              <p className="text-gray-500 text-xs">{currentCategory.count} expressions to master</p>
            </div>
          </div>
        )}

        {searchTerm && (
          <p className="text-gray-400 text-sm">{filteredPhrases.length} results for "{searchTerm}"</p>
        )}

        {/* Phrases List */}
        <div className="space-y-3">
          {filteredPhrases.map((item, i) => (
            <div
              key={i}
              className={`bg-gray-900 border rounded-2xl overflow-hidden transition group ${
                expandedPhrase === i ? 'border-purple-700 shadow-lg shadow-purple-900' : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              <button
                onClick={() => {
                  setExpandedPhrase(expandedPhrase === i ? null : i)
                  setAiMode(null)
                  setAiResponse('')
                  setUserPractice('')
                }}
                className="w-full text-left px-6 py-4 flex justify-between items-center"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); speakPhrase(item.phrase) }}
                    className="text-gray-600 hover:text-purple-400 transition flex-shrink-0 text-xl"
                  >
                    🔊
                  </button>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-base">"{item.phrase}"</p>
                    <p className="text-gray-500 text-sm truncate mt-0.5">{item.meaning}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border hidden md:block ${getLevelColor(item.level)}`}>
                    {item.level}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSave(item) }}
                    className={`transition text-xl ${isSaved(item) ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`}
                  >
                    {isSaved(item) ? '⭐' : '☆'}
                  </button>
                  <span className={`text-gray-500 text-xl transition-transform duration-300 ${expandedPhrase === i ? 'rotate-180' : ''}`}>▾</span>
                </div>
              </button>

              {expandedPhrase === i && (
                <div className="border-t border-gray-800 px-6 pb-5 pt-4 space-y-4">

                  <div className="bg-blue-900 bg-opacity-20 border border-blue-800 rounded-xl px-5 py-4">
                    <p className="text-xs font-semibold text-blue-400 mb-2">💬 Example:</p>
                    <p className="text-gray-200 italic">"{item.example}"</p>
                    <button
                      onClick={() => speakPhrase(item.example)}
                      className="text-blue-400 hover:text-blue-300 text-xs mt-2 transition"
                    >
                      🔊 Hear example
                    </button>
                  </div>

                  <div className="bg-yellow-900 bg-opacity-20 border border-yellow-800 rounded-xl px-5 py-4">
                    <p className="text-xs font-semibold text-yellow-400 mb-2">💡 When to use it:</p>
                    <p className="text-gray-300 text-sm">{item.tip}</p>
                  </div>

                  {/* AI Practice Section */}
                  <div className="bg-purple-900 bg-opacity-20 border border-purple-700 rounded-xl p-4">
                    <p className="text-sm font-bold text-purple-300 mb-3">🤖 Practice with AI</p>

                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-xs text-gray-500">Your language:</p>
                      <select
                        value={nativeLanguage}
                        onChange={e => setNativeLanguage(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-purple-500"
                      >
                        {['Hindi', 'Punjabi', 'Mandarin', 'Arabic', 'Spanish', 'French', 'Tagalog', 'Urdu', 'Portuguese', 'Korean'].map(lang => (
                          <option key={lang}>{lang}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => { setAiMode(`explain-${i}`); callAI(item.phrase, item.meaning, 'explain') }}
                        className="bg-blue-900 bg-opacity-50 border border-blue-700 text-blue-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                      >
                        📖 Explain
                      </button>
                      <button
                        onClick={() => { setAiMode(`translate-${i}`); callAI(item.phrase, item.meaning, 'translate') }}
                        className="bg-green-900 bg-opacity-50 border border-green-700 text-green-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                      >
                        🌍 Translate
                      </button>
                      <button
                        onClick={() => { setAiMode(`practice-${i}`); callAI(item.phrase, item.meaning, 'practice') }}
                        className="bg-orange-900 bg-opacity-50 border border-orange-700 text-orange-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                      >
                        ✍️ Practice
                      </button>
                    </div>

                    {aiLoading && aiMode && aiMode.endsWith(`-${i}`) && (
                      <div className="flex gap-2 mt-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    )}

                    {aiResponse && aiMode && aiMode.endsWith(`-${i}`) && !aiLoading && (
                      <div className="mt-3 space-y-3">
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">{aiResponse}</p>
                        </div>

                        {aiMode.startsWith('practice') && (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={userPractice}
                              onChange={e => setUserPractice(e.target.value)}
                              placeholder="Write your sentence using this phrase..."
                              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition text-sm"
                            />
                            <button
                              onClick={() => { setAiMode(`check-${i}`); callAI(item.phrase, item.meaning, 'check', userPractice) }}
                              disabled={!userPractice.trim()}
                              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-50"
                            >
                              ✅ Check my answer
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => toggleSave(item)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition border ${
                        isSaved(item)
                          ? 'bg-yellow-900 bg-opacity-30 border-yellow-700 text-yellow-300'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-yellow-700 hover:text-yellow-300'
                      }`}
                    >
                      {isSaved(item) ? '⭐ Saved' : '☆ Save Phrase'}
                    </button>
                    <button
                      onClick={() => speakPhrase(item.phrase)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-800 border border-gray-700 text-gray-400 hover:border-purple-700 hover:text-purple-300 transition"
                    >
                      🔊 Pronounce
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredPhrases.length === 0 && (
            <div className="text-center py-16">
              <p className="text-6xl mb-4">🔍</p>
              <p className="text-gray-400 text-lg">No phrases found for "{searchTerm}"</p>
              <button onClick={() => setSearchTerm('')} className="text-purple-400 hover:text-purple-300 text-sm mt-2 transition">
                Clear search
              </button>
            </div>
          )}
        </div>

      </div>
    </Layout>
  )
}

export default Phrases
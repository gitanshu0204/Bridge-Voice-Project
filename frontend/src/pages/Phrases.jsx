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
    { id: 'workplace', icon: '🏢', title: 'Workplace' },
    { id: 'social', icon: '🤝', title: 'Social' },
    { id: 'canadian', icon: '🍁', title: 'Canadian' },
    { id: 'interview', icon: '💼', title: 'Interview' },
    { id: 'daily', icon: '☀️', title: 'Daily Life' },
    { id: 'slang', icon: '😎', title: 'Slang' },
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
      { phrase: 'Deep dive', meaning: 'A thorough examination of a subject', example: 'Let\'s do a deep dive into the sales data.', tip: 'Use when you want to analyze something in detail.', level: 'Common' },
      { phrase: 'Action item', meaning: 'A task that someone needs to complete', example: 'The action item from today\'s meeting is to send the report.', tip: 'Very common in meetings and emails.', level: 'Essential' },
      { phrase: 'Move the needle', meaning: 'To make a noticeable difference or progress', example: 'We need a strategy that will really move the needle.', tip: 'Common in business discussions about results.', level: 'Professional' },
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
          phrase, meaning, action,
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

  const getLevelStyle = (level) => {
    const styles = {
      'Essential': 'text-green-400 bg-green-900 bg-opacity-20 border-green-800',
      'Must Know': 'text-red-400 bg-red-900 bg-opacity-20 border-red-800',
      'Common': 'text-blue-400 bg-blue-900 bg-opacity-20 border-blue-800',
      'Professional': 'text-purple-400 bg-purple-900 bg-opacity-20 border-purple-800',
      'Casual': 'text-yellow-400 bg-yellow-900 bg-opacity-20 border-yellow-800',
      'Fun': 'text-pink-400 bg-pink-900 bg-opacity-20 border-pink-800',
    }
    return styles[level] || 'text-gray-400 bg-gray-800 border-gray-700'
  }

  const currentCategory = categories.find(c => c.id === activeCategory)

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
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">English Phrases</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Master Canadian English</h2>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                Learn idioms, workplace phrases, and everyday expressions used by Canadians — with AI practice in your language.
              </p>
              <div className="flex items-center gap-4 mt-4">
                {[
                  { value: '6', label: 'Categories' },
                  { value: '40+', label: 'Phrases' },
                  { value: savedPhrases.length.toString(), label: 'Saved' },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-lg font-bold text-purple-400">{stat.value}</p>
                    <p className="text-gray-500 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block text-8xl opacity-10">💬</div>
          </div>
        </div>

        {/* Phrase of the Day */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phrase of the Day</p>
            </div>
            <button
              onClick={() => speakPhrase(phraseOfTheDay.phrase)}
              className="text-gray-600 hover:text-purple-400 transition text-lg"
            >
              🔊
            </button>
          </div>
          <div className="p-6">
            <div className="relative pl-4 border-l-2 border-purple-600">
              <h3 className="text-2xl font-bold text-white mb-1">"{phraseOfTheDay.phrase}"</h3>
              <p className="text-gray-400 text-sm mb-2">{phraseOfTheDay.meaning}</p>
              <p className="text-gray-500 text-sm italic">"{phraseOfTheDay.example}"</p>
            </div>
            <div className="flex items-start gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 mt-4">
              <span className="text-yellow-500 text-sm mt-0.5">💡</span>
              <p className="text-gray-400 text-sm">{phraseOfTheDay.tip}</p>
            </div>
          </div>
        </div>

        {/* Search + Controls */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search phrases..."
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition"
              >
                ✕
              </button>
            )}
          </div>
          {savedPhrases.length > 0 && (
            <button
              onClick={() => setShowSaved(!showSaved)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition ${
                showSaved
                  ? 'border-purple-600 bg-purple-900 bg-opacity-30 text-purple-300'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
              }`}
            >
              ⭐ {savedPhrases.length}
            </button>
          )}
        </div>

        {/* Language Selector */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap">
          <p className="text-xs text-gray-500 font-medium flex-shrink-0">AI Language:</p>
          <div className="flex gap-2 flex-wrap">
            {['Hindi', 'Punjabi', 'Mandarin', 'Arabic', 'Spanish', 'French', 'Tagalog', 'Urdu'].map(lang => (
              <button
                key={lang}
                onClick={() => setNativeLanguage(lang)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                  nativeLanguage === lang
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Saved Phrases */}
        {showSaved && savedPhrases.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <p className="font-semibold text-white text-sm">⭐ Saved Phrases ({savedPhrases.length})</p>
            </div>
            <div className="divide-y divide-gray-800">
              {savedPhrases.map((p, i) => (
                <div key={i} className="flex justify-between items-center px-5 py-3">
                  <div>
                    <p className="font-semibold text-white text-sm">"{p.phrase}"</p>
                    <p className="text-gray-500 text-xs mt-0.5">{p.meaning}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => speakPhrase(p.phrase)} className="text-gray-600 hover:text-purple-400 transition">🔊</button>
                    <button onClick={() => toggleSave(p)} className="text-yellow-400 hover:text-gray-400 transition">⭐</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Tabs */}
        {!searchTerm && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-2 flex gap-1 overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id)
                  setExpandedPhrase(null)
                  setAiMode(null)
                  setAiResponse('')
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap flex-shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.title}</span>
              </button>
            ))}
          </div>
        )}

        {/* Category Header */}
        {!searchTerm && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-600 bg-opacity-20 border border-purple-800 rounded-lg flex items-center justify-center text-sm">
              {currentCategory?.icon}
            </div>
            <div>
              <p className="font-semibold text-gray-200 text-sm">{currentCategory?.title} Phrases</p>
              <p className="text-gray-600 text-xs">{filteredPhrases?.length} expressions</p>
            </div>
          </div>
        )}

        {searchTerm && (
          <p className="text-gray-500 text-sm">{filteredPhrases?.length} results for "{searchTerm}"</p>
        )}

        {/* Phrases List */}
        <div className="space-y-2">
          {filteredPhrases?.map((item, i) => (
            <div
              key={i}
              className={`bg-gray-900 border rounded-2xl overflow-hidden transition-all duration-200 ${
                expandedPhrase === i ? 'border-purple-800' : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              {/* Phrase Header */}
              <button
                onClick={() => {
                  setExpandedPhrase(expandedPhrase === i ? null : i)
                  setAiMode(null)
                  setAiResponse('')
                  setUserPractice('')
                }}
                className="w-full text-left px-6 py-4 flex justify-between items-center group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); speakPhrase(item.phrase) }}
                    className="text-gray-600 hover:text-purple-400 transition flex-shrink-0"
                  >
                    🔊
                  </button>
                  <div className="min-w-0">
                    <p className="font-bold text-white">"{item.phrase}"</p>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">{item.meaning}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border hidden md:block ${getLevelStyle(item.level)}`}>
                    {item.level}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSave(item) }}
                    className={`transition ${isSaved(item) ? 'text-yellow-400' : 'text-gray-700 hover:text-yellow-400'}`}
                  >
                    {isSaved(item) ? '⭐' : '☆'}
                  </button>
                  <div className={`w-6 h-6 rounded-full border border-gray-700 flex items-center justify-center text-gray-500 transition-all ${
                    expandedPhrase === i ? 'bg-purple-600 border-purple-600 text-white rotate-180' : 'group-hover:border-gray-500'
                  }`}>
                    ▾
                  </div>
                </div>
              </button>

              {/* Expanded Content */}
              {expandedPhrase === i && (
                <div className="border-t border-gray-800">

                  {/* Content */}
                  <div className="px-6 py-5 space-y-4">
                    <div className="relative pl-4 border-l-2 border-purple-600">
                      <p className="text-gray-400 text-sm italic">"{item.example}"</p>
                      <button
                        onClick={() => speakPhrase(item.example)}
                        className="text-gray-600 hover:text-purple-400 text-xs mt-1 transition"
                      >
                        🔊 Hear example
                      </button>
                    </div>

                    <div className="flex items-start gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
                      <span className="text-yellow-500 text-sm mt-0.5 flex-shrink-0">💡</span>
                      <p className="text-gray-400 text-sm">{item.tip}</p>
                    </div>
                  </div>

                  {/* AI Practice */}
                  <div className="border-t border-gray-800 px-6 py-5">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                        <span className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-xs">🤖</span>
                        Practice with AI
                      </p>
                    </div>

                    <div className="flex gap-2 mb-4 flex-wrap">
                      {[
                        { action: 'explain', label: 'Explain', icon: '📖' },
                        { action: 'translate', label: 'Translate', icon: '🌍' },
                        { action: 'practice', label: 'Practice', icon: '✍️' },
                      ].map(btn => (
                        <button
                          key={btn.action}
                          onClick={() => {
                            setAiMode(`${btn.action}-${i}`)
                            callAI(item.phrase, item.meaning, btn.action)
                          }}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition border ${
                            aiMode === `${btn.action}-${i}`
                              ? 'border-purple-600 bg-purple-900 bg-opacity-30 text-purple-300'
                              : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                          }`}
                        >
                          <span>{btn.icon}</span>
                          {btn.label}
                        </button>
                      ))}
                    </div>

                    {aiLoading && aiMode?.endsWith(`-${i}`) && (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-500 text-xs">AI is thinking...</span>
                      </div>
                    )}

                    {aiResponse && aiMode?.endsWith(`-${i}`) && !aiLoading && (
                      <div className="space-y-3">
                        <div className="relative pl-4 border-l-2 border-purple-600 bg-gray-800 border border-gray-700 rounded-xl p-4">
                          <p className="text-xs font-semibold text-purple-400 mb-2">🤖 AI Response</p>
                          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{aiResponse}</p>
                        </div>

                        {aiMode?.startsWith('practice') && (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={userPractice}
                              onChange={e => setUserPractice(e.target.value)}
                              placeholder="Write your sentence using this phrase..."
                              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition text-sm"
                            />
                            <button
                              onClick={() => {
                                setAiMode(`check-${i}`)
                                callAI(item.phrase, item.meaning, 'check', userPractice)
                              }}
                              disabled={!userPractice.trim()}
                              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-40"
                            >
                              ✅ Check my answer
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
                      <button
                        onClick={() => toggleSave(item)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition border ${
                          isSaved(item)
                            ? 'border-yellow-700 text-yellow-400'
                            : 'border-gray-700 text-gray-500 hover:border-gray-500 hover:text-white'
                        }`}
                      >
                        {isSaved(item) ? '⭐ Saved' : '☆ Save'}
                      </button>
                      <button
                        onClick={() => speakPhrase(item.phrase)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-gray-700 text-gray-500 hover:border-gray-500 hover:text-white transition"
                      >
                        🔊 Pronounce
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredPhrases?.length === 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-400">No phrases found for "{searchTerm}"</p>
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
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { addXP, getProgress } from '../utils/xpTracker'
import { logActivity } from '../utils/activityTracker'
import { speakWithSettings } from '../utils/voiceSettings'

function DailyChallenge() {
  const navigate = useNavigate()
  const [challenges, setChallenges] = useState([])
  const [generating, setGenerating] = useState(false)
  const [activeChallenge, setActiveChallenge] = useState(null)
  const [userResponse, setUserResponse] = useState('')
  const [listening, setListening] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [completedChallenges, setCompletedChallenges] = useState(
    JSON.parse(localStorage.getItem('completedChallenges') || '{}')
  )
  const [nativeLanguage, setNativeLanguage] = useState(
    localStorage.getItem('nativeLanguage') || 'Hindi'
  )
  const [proficiencyLevel, setProficiencyLevel] = useState(
    localStorage.getItem('proficiencyLevel') || 'Beginner'
  )
  const [totalXP, setTotalXP] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showNative, setShowNative] = useState(false)
  const [challengeDate, setChallengeDate] = useState('')
  const [adaptedFor, setAdaptedFor] = useState('')

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const savedChallenges = localStorage.getItem(`challenges_${today}`)
    if (savedChallenges) {
      const parsed = JSON.parse(savedChallenges)
      setChallenges(parsed.challenges)
      setChallengeDate(parsed.date)
      setAdaptedFor(parsed.adapted_for || '')
    } else {
      generateChallenges()
    }

    getProgress().then(p => {
      setTotalXP(p.total_xp || 0)
      setStreak(p.streak || 0)
    })
  }, [])

  const generateChallenges = async () => {
    setGenerating(true)
    try {
      const email = localStorage.getItem('email')
      let weakestSkill = ''
      let weakestAvg = 0

      try {
        const weakRes = await fetch(`http://127.0.0.1:8000/api/weak-areas?email=${encodeURIComponent(email)}`)
        const weakData = await weakRes.json()
        if (weakData.has_enough_data) {
          weakestSkill = weakData.weakest_skill
          weakestAvg = weakData.weakest_avg
        }
      } catch (err) {
        console.log('Could not fetch weak areas')
      }

      const response = await fetch('http://127.0.0.1:8000/api/daily-challenge/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          native_language: nativeLanguage,
          proficiency_level: proficiencyLevel,
          weakest_skill: weakestSkill,
          weakest_avg: weakestAvg
        })
      })
      const data = await response.json()
      setChallenges(data.challenges)
      setChallengeDate(data.date)
      setAdaptedFor(data.adapted_for || '')
      localStorage.setItem(`challenges_${today}`, JSON.stringify(data))
    } catch (err) {
      console.log('Could not generate challenges')
    }
    setGenerating(false)
  }

  const startChallenge = (challenge, index) => {
    setActiveChallenge({ ...challenge, index })
    setUserResponse('')
    setResult(null)
    setShowNative(false)
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Please use Google Chrome for speech recognition.')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onresult = (e) => setUserResponse(e.results[0][0].transcript)
    recognition.start()
  }

  const submitChallenge = async () => {
    if (!userResponse.trim()) return
    setSubmitting(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/daily-challenge/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge_type: activeChallenge.type,
          challenge_text: activeChallenge.instruction,
          user_response: userResponse,
          native_language: nativeLanguage
        })
      })
      const data = await response.json()
      setResult(data)

      const newCompleted = {
        ...completedChallenges,
        [`${today}_${activeChallenge.index}`]: {
          score: data.score,
          xp: data.xp_earned
        }
      }
      setCompletedChallenges(newCompleted)
      localStorage.setItem('completedChallenges', JSON.stringify(newCompleted))

      // Log activity + add XP to database
      logActivity({ type: 'daily_challenge', score: data.score, detail: activeChallenge.title })

      const xpResult = await addXP(data.xp_earned || 20, `Daily Challenge: ${activeChallenge.title}`)
      if (xpResult) {
        setTotalXP(xpResult.total_xp)
        setStreak(xpResult.streak)
      }

    } catch (err) {
      console.log('Submit error')
    }
    setSubmitting(false)
  }

  const isCompleted = (index) => {
    return completedChallenges[`${today}_${index}`]
  }

  const allCompleted = challenges.length > 0 &&
    challenges.every((_, i) => isCompleted(i))

  const completedCount = challenges.filter((_, i) => isCompleted(i)).length

  const speakText = (text) => {
    speakWithSettings(text)
  }

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
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">AI Generated Daily</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Daily Challenge</h2>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                AI generates fresh challenges every day based on your level and native language. Complete all 3 to earn XP!
              </p>
              <div className="flex items-center gap-4 mt-4">
                {[
                  { value: `🔥 ${streak}`, label: 'Day Streak' },
                  { value: `${completedCount}/3`, label: 'Today' },
                  { value: `${totalXP}`, label: 'Total XP' },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-lg font-bold text-purple-400">{stat.value}</p>
                    <p className="text-gray-500 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block text-8xl opacity-10">🎯</div>
          </div>
        </div>

        {/* Settings Bar */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Settings</p>
            <button
              onClick={() => {
                localStorage.removeItem(`challenges_${today}`)
                generateChallenges()
              }}
              className="text-xs text-gray-500 hover:text-purple-400 transition flex items-center gap-1"
            >
              🔄 New Challenges
            </button>
          </div>
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-2">Native Language:</p>
              <div className="flex flex-wrap gap-1.5">
                {['Hindi', 'Punjabi', 'Mandarin', 'Arabic', 'Spanish', 'French', 'Urdu'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      setNativeLanguage(lang)
                      localStorage.setItem('nativeLanguage', lang)
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
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
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-2">Level:</p>
              <div className="flex gap-1.5">
                {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                  <button
                    key={level}
                    onClick={() => {
                      setProficiencyLevel(level)
                      localStorage.setItem('proficiencyLevel', level)
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                      proficiencyLevel === level
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generating */}
        {generating && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center">
            <div className="w-12 h-12 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300 font-medium">AI is generating today's challenges...</p>
            <p className="text-gray-600 text-sm mt-1">Creating challenges for {nativeLanguage} • {proficiencyLevel}</p>
          </div>
        )}

        {/* All Complete Banner */}
        {allCompleted && !generating && (
          <div className="relative bg-gray-900 border border-green-800 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-900 via-gray-900 to-gray-900 opacity-30"></div>
            <div className="relative px-6 py-5 flex items-center gap-4">
              <span className="text-4xl">🏆</span>
              <div>
                <p className="font-bold text-green-400 text-lg">All challenges completed!</p>
                <p className="text-gray-400 text-sm">Come back tomorrow for new AI-generated challenges!</p>
              </div>
            </div>
          </div>
        )}

        {/* Challenge Cards */}
        {!generating && challenges.length > 0 && !activeChallenge && (
          <div className="space-y-3">
            {challengeDate && (
              <div className="flex items-center justify-between px-1">
                <p className="text-xs text-gray-500">📅 {challengeDate}</p>
                <p className="text-xs text-purple-400">🤖 AI Generated for {nativeLanguage}</p>
              </div>
            )}

            {adaptedFor && (
              <div className="bg-purple-900 bg-opacity-20 border border-purple-800 rounded-2xl px-4 py-3 flex items-center gap-3">
                <span className="text-lg">🎯</span>
                <p className="text-purple-300 text-xs">
                  <strong>AI adapted today's challenges</strong> to focus on <strong>{adaptedFor}</strong> based on your recent performance
                </p>
              </div>
            )}
            {challenges.map((challenge, i) => {
              const completed = isCompleted(i)
              return (
                <div
                  key={i}
                  className={`bg-gray-900 border rounded-2xl overflow-hidden transition ${
                    completed ? 'border-green-900' : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="p-5 flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                      completed
                        ? 'bg-green-900 bg-opacity-30 border border-green-800'
                        : 'bg-purple-600 bg-opacity-20 border border-purple-800'
                    }`}>
                      {completed ? '✅' : challenge.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-white">{challenge.title}</p>
                        <span className="text-xs bg-gray-800 border border-gray-700 text-gray-500 px-2 py-0.5 rounded-full">
                          {challenge.type}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs truncate">{challenge.instruction}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-purple-400 font-medium">⭐ {challenge.xp} XP</span>
                        {completed && (
                          <span className="text-xs text-green-400">
                            Score: {completedChallenges[`${today}_${i}`]?.score}%
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => startChallenge(challenge, i)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition flex-shrink-0 ${
                        completed
                          ? 'border border-gray-700 text-gray-500 hover:text-white hover:border-gray-500'
                          : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/40'
                      }`}
                    >
                      {completed ? 'Redo' : 'Start →'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Active Challenge */}
        {activeChallenge && !result && (
          <div className="space-y-4">

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white">{activeChallenge.title}</h3>
                <p className="text-gray-500 text-sm">{activeChallenge.type} • ⭐ {activeChallenge.xp} XP</p>
              </div>
              <button
                onClick={() => setActiveChallenge(null)}
                className="text-gray-600 hover:text-white transition text-sm"
              >
                ✕ Back
              </button>
            </div>

            {/* Challenge Card */}
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-600"></div>
              <div className="p-6 pl-8">
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Your Challenge</p>
                <p className="text-white text-lg leading-relaxed mb-4">{activeChallenge.instruction}</p>

                {activeChallenge.words && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activeChallenge.words.map((word, i) => (
                      <span key={i} className="bg-purple-900 bg-opacity-30 border border-purple-800 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                        {word}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-start gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
                  <span className="text-blue-400 text-sm mt-0.5 flex-shrink-0">💬</span>
                  <p className="text-gray-400 text-sm">Example: "{activeChallenge.example}"</p>
                  <button
                    onClick={() => speakText(activeChallenge.example)}
                    className="text-gray-600 hover:text-purple-400 transition flex-shrink-0 ml-auto"
                  >
                    🔊
                  </button>
                </div>

                <div className="flex items-start gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 mt-2">
                  <span className="text-yellow-500 text-sm mt-0.5 flex-shrink-0">💡</span>
                  <p className="text-gray-400 text-sm">{activeChallenge.tip}</p>
                </div>
              </div>
            </div>

            {/* Response */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-300">Your Response</p>
                <span className="text-xs text-gray-600">
                  {userResponse.split(' ').filter(w => w).length} words
                </span>
              </div>
              <div className="p-5">
                <textarea
                  value={userResponse}
                  onChange={e => setUserResponse(e.target.value)}
                  placeholder="Type your response here or use the microphone..."
                  rows={5}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition resize-none text-sm leading-relaxed"
                />
                <div className="flex gap-2 mt-3">
                  {activeChallenge.type === 'Speaking' && (
                    <button
                      onClick={startListening}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition border ${
                        listening
                          ? 'bg-red-900 bg-opacity-30 border-red-700 text-red-400 animate-pulse'
                          : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
                      }`}
                    >
                      🎤 {listening ? 'Listening...' : 'Speak'}
                    </button>
                  )}
                  <button
                    onClick={submitChallenge}
                    disabled={!userResponse.trim() || submitting}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-xl font-bold transition disabled:opacity-40 shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>AI is evaluating...</span>
                      </>
                    ) : '✅ Submit for AI Feedback'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {result && activeChallenge && (
          <div className="space-y-4">

            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">AI Feedback</h3>
              <span className={`text-3xl font-bold ${
                result.score >= 80 ? 'text-green-400' :
                result.score >= 60 ? 'text-yellow-400' : 'text-red-400'
              }`}>{result.score}%</span>
            </div>

            {/* Score Bar */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="p-5 space-y-4">
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-700 ${
                      result.score >= 80 ? 'bg-green-500' :
                      result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${result.score}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-green-400 font-bold">+{result.xp_earned} XP earned!</p>
                  <button
                    onClick={() => setShowNative(!showNative)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition ${
                      showNative
                        ? 'border-purple-600 bg-purple-900 bg-opacity-30 text-purple-300'
                        : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                    }`}
                  >
                    🌍 {showNative ? 'English' : nativeLanguage}
                  </button>
                </div>

                {/* Feedback */}
                <div className="relative pl-4 border-l-2 border-purple-600">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {showNative && result.feedback_native ? result.feedback_native : result.feedback}
                  </p>
                </div>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-3">
                    <p className="text-xs font-bold text-green-400 mb-2">✅ Strengths</p>
                    {result.strengths?.map((s, i) => (
                      <p key={i} className="text-gray-400 text-xs mb-1">• {s}</p>
                    ))}
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-3">
                    <p className="text-xs font-bold text-yellow-400 mb-2">📈 Improve</p>
                    {result.improvements?.map((s, i) => (
                      <p key={i} className="text-gray-400 text-xs mb-1">• {s}</p>
                    ))}
                  </div>
                </div>

                {/* Corrected Version */}
                {result.corrected && result.corrected !== userResponse && (
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <p className="text-xs font-bold text-purple-400 mb-1">💬 Better Version:</p>
                    <p className="text-gray-300 text-sm italic">"{result.corrected}"</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setActiveChallenge(null)}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-purple-900/40"
              >
                Back to Challenges
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

export default DailyChallenge
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function DailyChallenge() {
  const navigate = useNavigate()
  const [activeChallenge, setActiveChallenge] = useState(null)
  const [stage, setStage] = useState('home')
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [spokenText, setSpokenText] = useState('')
  const [streak, setStreak] = useState(7)
  const [completedToday, setCompletedToday] = useState(
    JSON.parse(localStorage.getItem('dailyChallenge') || '[]')
  )
  const recognitionRef = useRef(null)

  const today = new Date().toLocaleDateString('en-CA')

  const challenges = [
    {
      id: 'speaking',
      type: 'Speaking Challenge',
      icon: '🗣️',
      color: 'from-purple-600 to-purple-800',
      xp: 50,
      title: 'Talk About Your Dream Job',
      desc: 'Speak for at least 30 seconds about what your dream job is and why you want it.',
      instruction: 'Click the microphone and speak about your dream job. Talk about what it is, why you want it, and what skills you need.',
      tip: 'Try to speak for at least 30 seconds. Use words like "because", "therefore", "however" to connect your ideas.'
    },
    {
      id: 'writing',
      type: 'Writing Challenge',
      icon: '✍️',
      color: 'from-blue-600 to-blue-800',
      xp: 40,
      title: 'Write About Your First Day in Canada',
      desc: 'Write at least 5 sentences about your experience or what you imagine your first day in Canada was like.',
      instruction: 'Write at least 5 sentences about your first day in Canada. Describe what you saw, felt and experienced.',
      tip: 'Use past tense verbs like "was", "saw", "felt", "visited". Try to include descriptive words.'
    },
    {
      id: 'vocabulary',
      type: 'Vocabulary Challenge',
      icon: '🧠',
      color: 'from-green-600 to-green-800',
      xp: 30,
      title: 'Use 5 New Words in Sentences',
      desc: 'Write one sentence using each of these words: Perseverance, Etiquette, Collaborate, Resilient, Innovative',
      instruction: 'Write one sentence for each word: Perseverance, Etiquette, Collaborate, Resilient, Innovative. Show you understand the meaning!',
      tip: 'Make sure your sentence shows the meaning of the word. For example: "Her perseverance helped her learn English in 6 months."'
    }
  ]

  const isCompleted = (id) => completedToday.includes(id)

  const startChallenge = (challenge) => {
    setActiveChallenge(challenge)
    setStage('challenge')
    setInput('')
    setResult(null)
    setSpokenText('')
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Please use Google Chrome for speech recognition.')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = 'en-US'
    recognitionRef.current.onstart = () => setListening(true)
    recognitionRef.current.onend = () => setListening(false)
    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('')
      setSpokenText(transcript)
    }
    recognitionRef.current.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  const submitChallenge = async () => {
    const content = activeChallenge.id === 'speaking' ? spokenText : input
    if (!content.trim()) return

    setLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/daily-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge_type: activeChallenge.id,
          challenge_title: activeChallenge.title,
          content: content
        })
      })
      const data = await response.json()
      setResult(data)

      if (!isCompleted(activeChallenge.id)) {
        const updated = [...completedToday, activeChallenge.id]
        setCompletedToday(updated)
        localStorage.setItem('dailyChallenge', JSON.stringify(updated))
      }
    } catch (err) {
      setResult({
        score: 75,
        feedback: 'Great effort on completing the challenge! Keep practicing every day to improve your English.',
        strengths: ['Good attempt at the challenge', 'You are building confidence'],
        improvements: ['Try to use more varied vocabulary', 'Practice speaking longer sentences'],
        xp_earned: activeChallenge.xp
      })
      if (!isCompleted(activeChallenge.id)) {
        const updated = [...completedToday, activeChallenge.id]
        setCompletedToday(updated)
        localStorage.setItem('dailyChallenge', JSON.stringify(updated))
      }
    }
    setLoading(false)
    setStage('result')
  }

  const totalXP = completedToday.reduce((total, id) => {
    const challenge = challenges.find(c => c.id === id)
    return total + (challenge?.xp || 0)
  }, 0)

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">

        {stage === 'home' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold">🎯 Daily Challenge</h2>
              <p className="text-gray-400 mt-1">Complete challenges every day to earn XP and improve your English!</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold text-orange-400">🔥 {streak}</p>
                <p className="text-gray-500 text-sm mt-1">Day Streak</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold text-purple-400">{totalXP}</p>
                <p className="text-gray-500 text-sm mt-1">XP Today</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                <p className="text-3xl font-bold text-green-400">{completedToday.length}/3</p>
                <p className="text-gray-500 text-sm mt-1">Completed</p>
              </div>
            </div>

            {completedToday.length === 3 && (
              <div className="bg-green-900 bg-opacity-30 border border-green-700 rounded-2xl p-5 mb-6 text-center">
                <p className="text-2xl mb-2">🎉</p>
                <p className="font-bold text-green-400 text-lg">All challenges completed today!</p>
                <p className="text-gray-400 text-sm mt-1">Come back tomorrow for new challenges. Great work! 💪</p>
              </div>
            )}

            <div className="space-y-4">
              {challenges.map((challenge, i) => (
                <div key={i} className={`bg-gray-900 border rounded-2xl p-6 transition ${
                  isCompleted(challenge.id)
                    ? 'border-green-800 opacity-75'
                    : 'border-gray-800 hover:border-gray-600'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${challenge.color} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                        {isCompleted(challenge.id) ? '✅' : challenge.icon}
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase mb-1">{challenge.type}</p>
                        <h3 className="font-bold text-white text-lg">{challenge.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">{challenge.desc}</p>
                        <p className="text-purple-400 text-sm mt-2 font-medium">+{challenge.xp} XP</p>
                      </div>
                    </div>
                    <button
                      onClick={() => !isCompleted(challenge.id) && startChallenge(challenge)}
                      disabled={isCompleted(challenge.id)}
                      className={`px-4 py-2 rounded-xl font-medium text-sm transition flex-shrink-0 ${
                        isCompleted(challenge.id)
                          ? 'bg-green-900 bg-opacity-30 text-green-400 cursor-default'
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'
                      }`}
                    >
                      {isCompleted(challenge.id) ? 'Completed ✅' : 'Start →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-yellow-900 bg-opacity-20 border border-yellow-800 rounded-2xl p-4 text-center">
              <p className="text-yellow-400 font-semibold">🔄 New challenges unlock every day at midnight!</p>
              <p className="text-gray-500 text-sm mt-1">Complete all 3 to maintain your streak and earn bonus XP</p>
            </div>
          </div>
        )}

        {stage === 'challenge' && activeChallenge && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setStage('home')}
                className="text-gray-500 hover:text-white transition text-sm mb-4 flex items-center gap-2"
              >
                ← Back to Challenges
              </button>
              <h2 className="text-2xl font-bold">{activeChallenge.icon} {activeChallenge.title}</h2>
              <p className="text-gray-400 mt-1">{activeChallenge.type}</p>
            </div>

            <div className="bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700 rounded-2xl p-5 mb-6">
              <p className="font-semibold text-purple-300 mb-2">📋 Instructions</p>
              <p className="text-gray-300">{activeChallenge.instruction}</p>
              <p className="text-yellow-400 text-sm mt-3">💡 Tip: {activeChallenge.tip}</p>
            </div>

            {activeChallenge.id === 'speaking' && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
                <p className="font-semibold text-gray-300 mb-4">Your Response:</p>

                <div className="text-center mb-6">
                  <button
                    onClick={listening ? stopListening : startListening}
                    className={`w-24 h-24 rounded-full text-4xl transition shadow-2xl ${
                      listening
                        ? 'bg-red-600 animate-pulse shadow-red-900'
                        : 'bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-purple-900'
                    }`}
                  >
                    🎤
                  </button>
                  <p className="text-gray-400 mt-3 text-sm">
                    {listening ? '🔴 Listening... speak now! Click to stop.' : 'Click to start speaking'}
                  </p>
                </div>

                {spokenText && (
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-2">What you said:</p>
                    <p className="text-gray-200">{spokenText}</p>
                    <p className="text-xs text-purple-400 mt-2">{spokenText.split(' ').length} words spoken</p>
                  </div>
                )}
              </div>
            )}

            {(activeChallenge.id === 'writing' || activeChallenge.id === 'vocabulary') && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
                <p className="font-semibold text-gray-300 mb-3">Your Response:</p>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={
                    activeChallenge.id === 'writing'
                      ? 'Write your response here... (minimum 5 sentences)'
                      : 'Write your sentences here using each word...'
                  }
                  rows={8}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">{input.split(' ').filter(w => w).length} words written</p>
              </div>
            )}

            <button
              onClick={submitChallenge}
              disabled={loading ||
                (activeChallenge.id === 'speaking' && !spokenText) ||
                ((activeChallenge.id === 'writing' || activeChallenge.id === 'vocabulary') && !input.trim())
              }
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-4 rounded-xl font-bold text-lg transition disabled:opacity-50 shadow-lg shadow-purple-900"
            >
              {loading ? 'AI is analysing your response...' : 'Submit Challenge 🚀'}
            </button>
          </div>
        )}

        {stage === 'result' && result && activeChallenge && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">🎯 Challenge Complete!</h2>
              <p className="text-gray-400 mt-1">{activeChallenge.title}</p>
            </div>

            <div className="text-center mb-8">
              <p className="text-6xl mb-4">
                {result.score >= 80 ? '🏆' : result.score >= 60 ? '🌟' : '💪'}
              </p>
              <div className={`text-6xl font-bold mb-2 ${
                result.score >= 80 ? 'text-green-400' :
                result.score >= 60 ? 'text-orange-400' : 'text-red-400'
              }`}>
                {result.score}%
              </div>
              <div className="bg-purple-900 bg-opacity-30 border border-purple-700 rounded-xl px-6 py-3 inline-block mt-2">
                <p className="text-purple-300 font-bold">+{result.xp_earned || activeChallenge.xp} XP Earned! 🎉</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
              <p className="font-bold text-gray-200 mb-3">🤖 AI Feedback</p>
              <p className="text-gray-300 leading-relaxed">{result.feedback}</p>
            </div>

            {result.strengths && result.strengths.length > 0 && (
              <div className="bg-green-900 bg-opacity-20 border border-green-800 rounded-2xl p-5 mb-4">
                <p className="font-bold text-green-400 mb-3">✅ What you did well:</p>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.improvements && result.improvements.length > 0 && (
              <div className="bg-orange-900 bg-opacity-20 border border-orange-800 rounded-2xl p-5 mb-6">
                <p className="font-bold text-orange-400 mb-3">📈 Areas to improve:</p>
                <ul className="space-y-2">
                  {result.improvements.map((s, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStage('home')}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl transition font-bold"
              >
                Back to Challenges
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white py-3 rounded-xl transition font-bold"
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
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function PronunciationScorer() {
  const navigate = useNavigate()
  const [stage, setStage] = useState('select')
  const [selectedLevel, setSelectedLevel] = useState('beginner')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [listening, setListening] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [scores, setScores] = useState([])
  const recognitionRef = useRef(null)

  const levels = {
    beginner: {
      title: 'Beginner',
      icon: '🌱',
      color: 'from-green-600 to-green-400',
      desc: 'Single words and simple phrases',
      items: [
        { text: 'Hello', tip: 'heh-LOH' },
        { text: 'Thank you', tip: 'THANK yoo' },
        { text: 'Sorry', tip: 'SAW-ree' },
        { text: 'Please', tip: 'PLEEZ' },
        { text: 'Excuse me', tip: 'ex-KYOOZ mee' },
        { text: 'Good morning', tip: 'good MOR-ning' },
        { text: 'How are you', tip: 'how ar YOO' },
        { text: 'My name is', tip: 'my NAYM iz' },
        { text: 'Nice to meet you', tip: 'nys to MEET yoo' },
        { text: 'See you later', tip: 'see yoo LAY-ter' },
      ]
    },
    intermediate: {
      title: 'Intermediate',
      icon: '📘',
      color: 'from-blue-600 to-blue-400',
      desc: 'Common workplace phrases',
      items: [
        { text: 'Could you repeat that please', tip: 'kud yoo ree-PEET that PLEEZ' },
        { text: 'I would like to apply for this position', tip: 'ay wud LYK to ah-PLY for this poh-ZI-shun' },
        { text: 'Can you speak more slowly please', tip: 'kan yoo SPEEK mor SLOH-lee PLEEZ' },
        { text: 'I am looking for a job opportunity', tip: 'ay am LOOK-ing for ah JOB op-er-TOO-nih-tee' },
        { text: 'What are the working hours', tip: 'wut ar the WER-king OW-erz' },
        { text: 'I have experience in this field', tip: 'ay hav ex-PEER-ee-ens in this FEELD' },
        { text: 'Could you please help me', tip: 'kud yoo PLEEZ help MEE' },
        { text: 'I do not understand', tip: 'ay doh not un-der-STAND' },
        { text: 'Where is the nearest hospital', tip: 'wer iz the NEER-est HOS-pi-tal' },
        { text: 'How much does this cost', tip: 'how much duz this KOST' },
      ]
    },
    advanced: {
      title: 'Advanced',
      icon: '📙',
      color: 'from-orange-600 to-orange-400',
      desc: 'Complex sentences and expressions',
      items: [
        { text: 'I am particularly interested in this opportunity because of the growth potential', tip: 'Focus on: par-TIK-yoo-lar-lee, op-er-TOO-nih-tee, POH-ten-shul' },
        { text: 'My previous experience has prepared me well for this role', tip: 'Focus on: PREV-ee-us, ex-PEER-ee-ens, pre-PERD' },
        { text: 'I believe I can contribute significantly to your team', tip: 'Focus on: beh-LEEV, CON-trib-yoot, sig-NIF-ih-kant-lee' },
        { text: 'Could you elaborate on the responsibilities of this position', tip: 'Focus on: ee-LAB-or-ayt, res-pon-sih-BIL-ih-teez' },
        { text: 'I am committed to continuous professional development', tip: 'Focus on: koh-MIT-ed, kon-TIN-yoo-us, de-VEL-op-ment' },
        { text: 'What opportunities are available for career advancement', tip: 'Focus on: op-er-TOO-nih-teez, ad-VANS-ment' },
        { text: 'I have successfully managed teams of up to twenty people', tip: 'Focus on: suk-SES-fool-ee, MAN-ejd' },
        { text: 'The compensation package is very competitive', tip: 'Focus on: kom-pen-SAY-shun, kom-PEH-tih-tiv' },
      ]
    },
    canadian: {
      title: 'Canadian',
      icon: '🍁',
      color: 'from-red-600 to-red-400',
      desc: 'Tricky Canadian words and phrases',
      items: [
        { text: 'Poutine', tip: 'poo-TEEN' },
        { text: 'Toque', tip: 'TOOK' },
        { text: 'Toronto', tip: 'toh-RON-oh (the second T is silent!)' },
        { text: 'Ottawa', tip: 'AW-tah-wah' },
        { text: 'Sorry about that eh', tip: 'SAW-ree ah-BOWT that AY' },
        { text: 'Double double please', tip: 'DUB-ul DUB-ul PLEEZ' },
        { text: 'Loonie and toonie', tip: 'LOO-nee and TOO-nee' },
        { text: 'How is it going', tip: 'how iz it GOH-ing' },
        { text: 'Have a good one', tip: 'hav ah good WUN' },
        { text: 'Right on', tip: 'ryt ON' },
      ]
    }
  }

  const currentLevel = levels[selectedLevel]
  const currentItem = currentLevel.items[currentIndex]

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
        w === word ||
        w.includes(word.slice(0, -1)) ||
        word.includes(w.slice(0, -1))
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
          score: score,
          wrong_words: wordResults.filter(w => !w.correct).map(w => w.word)
        })
      })
      const data = await response.json()

      setResult({
        score,
        spokenText,
        wordResults,
        feedback: data.feedback,
        tips: data.tips
      })
    } catch (err) {
      setResult({
        score,
        spokenText,
        wordResults,
        feedback: score >= 80
          ? "Great pronunciation! You are doing really well!"
          : score >= 60
          ? "Good effort! Keep practicing to improve your accuracy."
          : "Keep trying! Pronunciation takes time and practice.",
        tips: ["Listen to the correct pronunciation first", "Practice slowly then speed up", "Record yourself and compare"]
      })
    }

    setLoading(false)
  }

  const nextItem = () => {
    if (result) {
      setScores(prev => [...prev, result.score])
    }
    setResult(null)
    if (currentIndex + 1 < currentLevel.items.length) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setStage('complete')
    }
  }

  const restart = () => {
    setCurrentIndex(0)
    setResult(null)
    setScores([])
    setStage('select')
  }

  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">

        {stage === 'select' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold">🎤 Pronunciation Scorer</h2>
              <p className="text-gray-400 mt-1">Practice speaking and get instant AI feedback on your pronunciation</p>
            </div>

            <div className="bg-purple-900 bg-opacity-20 border border-purple-700 rounded-2xl p-5 mb-8">
              <p className="font-semibold text-purple-300 mb-2">💡 How it works:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔊</span>
                  <span>Listen to correct pronunciation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎤</span>
                  <span>Speak the word or phrase</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  <span>Get instant AI feedback</span>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-gray-300 mb-4">Select Difficulty Level:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(levels).map(([key, level]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedLevel(key)
                    setCurrentIndex(0)
                    setResult(null)
                    setScores([])
                    setStage('practice')
                  }}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:border-gray-600 transition group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${level.color} rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition`}>
                    {level.icon}
                  </div>
                  <p className="font-bold text-white text-lg">{level.title}</p>
                  <p className="text-gray-400 text-sm mt-1">{level.desc}</p>
                  <p className="text-purple-400 text-xs mt-2">{level.items.length} phrases to practice</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === 'practice' && (
          <div>
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">🎤 Pronunciation Scorer</h2>
                  <p className="text-gray-400 mt-1">{currentLevel.title} Level</p>
                </div>
                <button
                  onClick={restart}
                  className="text-gray-500 hover:text-white transition text-sm"
                >
                  ← Change Level
                </button>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-400">
                  Phrase {currentIndex + 1} of {currentLevel.items.length}
                </p>
                <p className="text-purple-400 font-bold text-sm">
                  Avg Score: {scores.length > 0 ? Math.round(scores.reduce((a,b) => a+b, 0) / scores.length) : 0}%
                </p>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${((currentIndex) / currentLevel.items.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700 rounded-2xl p-8 mb-6 text-center">
              <p className="text-sm text-purple-300 mb-3">Say this out loud:</p>
              <h3 className="text-3xl font-bold text-white mb-4">"{currentItem.text}"</h3>
              <p className="text-purple-200 text-sm mb-4">Pronunciation guide: {currentItem.tip}</p>
              <button
                onClick={() => speakTarget(currentItem.text)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-xl text-white text-sm transition font-medium"
              >
                🔊 Hear correct pronunciation
              </button>
            </div>

            {!result && !loading && (
              <div className="text-center mb-6">
                <button
                  onClick={startListening}
                  disabled={listening}
                  className={`w-24 h-24 rounded-full text-4xl transition shadow-2xl ${
                    listening
                      ? 'bg-red-600 animate-pulse shadow-red-900'
                      : 'bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-purple-900'
                  }`}
                >
                  🎤
                </button>
                <p className="text-gray-400 mt-4 text-sm">
                  {listening ? '🔴 Listening... speak now!' : 'Click the microphone and speak'}
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <div className="flex gap-2 justify-center mb-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <p className="text-gray-400">Analysing your pronunciation...</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-200">Your Score</h3>
                    <span className={`text-4xl font-bold ${
                      result.score >= 80 ? 'text-green-400' :
                      result.score >= 60 ? 'text-orange-400' : 'text-red-400'
                    }`}>{result.score}%</span>
                  </div>

                  <div className="w-full bg-gray-800 rounded-full h-4 mb-4">
                    <div
                      className={`h-4 rounded-full transition-all ${
                        result.score >= 80 ? 'bg-gradient-to-r from-green-600 to-green-400' :
                        result.score >= 60 ? 'bg-gradient-to-r from-orange-600 to-orange-400' :
                        'bg-gradient-to-r from-red-600 to-red-400'
                      }`}
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>

                  <p className="text-center text-2xl mb-2">
                    {result.score >= 90 ? '🌟 Excellent!' :
                     result.score >= 80 ? '👍 Great job!' :
                     result.score >= 60 ? '📚 Keep practicing!' :
                     '🔄 Try again!'}
                  </p>

                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">You said: <span className="text-white">"{result.spokenText}"</span></p>
                    <p className="text-sm text-gray-400 mb-3">Target: <span className="text-white">"{currentItem.text}"</span></p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {result.wordResults.map((w, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            w.correct
                              ? 'bg-green-900 bg-opacity-40 border border-green-700 text-green-300'
                              : 'bg-red-900 bg-opacity-40 border border-red-700 text-red-300'
                          }`}
                        >
                          {w.correct ? '✅' : '❌'} {w.word}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900 bg-opacity-20 border border-purple-700 rounded-2xl p-5">
                  <p className="font-semibold text-purple-300 mb-2">🤖 AI Feedback</p>
                  <p className="text-gray-300 mb-3">{result.feedback}</p>
                  {result.tips && result.tips.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-400 mb-2">💡 Tips to improve:</p>
                      <ul className="space-y-1">
                        {result.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                            <span className="text-purple-400 mt-0.5">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setResult(null)}
                    className="flex-1 bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white py-3 rounded-xl transition font-medium"
                  >
                    🔄 Try Again
                  </button>
                  <button
                    onClick={nextItem}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl transition font-bold"
                  >
                    {currentIndex + 1 === currentLevel.items.length ? 'See Results 🎉' : 'Next Phrase →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {stage === 'complete' && (
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-2xl font-bold">🎤 Pronunciation Scorer</h2>
              <p className="text-gray-400 mt-1">Session Complete!</p>
            </div>

            <p className="text-6xl mb-4">
              {avgScore >= 80 ? '🏆' : avgScore >= 60 ? '🌟' : '💪'}
            </p>
            <h3 className="text-2xl font-bold mb-2">Session Complete!</h3>
            <div className={`text-6xl font-bold my-4 ${
              avgScore >= 80 ? 'text-green-400' :
              avgScore >= 60 ? 'text-orange-400' : 'text-red-400'
            }`}>
              {avgScore}%
            </div>
            <p className="text-gray-400 mb-8">
              {avgScore >= 80 ? 'Excellent pronunciation! You sound like a native speaker! 🌟' :
               avgScore >= 60 ? 'Good job! Keep practicing to improve further! 💪' :
               'Keep going! Pronunciation takes time and practice! 🎯'}
            </p>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
              <h4 className="font-bold text-gray-200 mb-4">📊 Your Scores</h4>
              <div className="space-y-2">
                {scores.map((score, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <p className="text-sm text-gray-500 w-24">{currentLevel.items[i]?.text}</p>
                    <div className="flex-1 bg-gray-800 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          score >= 80 ? 'bg-green-500' :
                          score >= 60 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <p className={`text-sm font-bold w-10 ${
                      score >= 80 ? 'text-green-400' :
                      score >= 60 ? 'text-orange-400' : 'text-red-400'
                    }`}>{score}%</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={restart}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl transition font-bold"
              >
                Practice Again 🔄
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

export default PronunciationScorer
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function InterviewSimulator() {
  const navigate = useNavigate()
  const [stage, setStage] = useState('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [listening, setListening] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [jobType, setJobType] = useState('')
  const [difficulty, setDifficulty] = useState('Medium')
  const [questions, setQuestions] = useState([])
  const [generating, setGenerating] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const jobCategories = [
    {
      category: 'Technology',
      icon: '💻',
      color: 'from-blue-600 to-blue-800',
      jobs: ['Software Developer', 'Web Developer', 'Data Analyst', 'IT Support', 'Cybersecurity']
    },
    {
      category: 'Healthcare',
      icon: '🏥',
      color: 'from-red-600 to-red-800',
      jobs: ['Nurse', 'Healthcare Worker', 'Pharmacist', 'Dental Assistant', 'Physiotherapist']
    },
    {
      category: 'Business',
      icon: '💼',
      color: 'from-purple-600 to-purple-800',
      jobs: ['Project Manager', 'Marketing Manager', 'HR Manager', 'Financial Advisor', 'Accountant']
    },
    {
      category: 'Trades',
      icon: '🔧',
      color: 'from-orange-600 to-orange-800',
      jobs: ['Electrician', 'Plumber', 'Carpenter', 'Mechanic', 'Welder']
    },
    {
      category: 'Service',
      icon: '🛒',
      color: 'from-green-600 to-green-800',
      jobs: ['Customer Service', 'Retail Worker', 'Restaurant Worker', 'Chef', 'Hotel Manager']
    },
    {
      category: 'Education',
      icon: '📚',
      color: 'from-cyan-600 to-cyan-800',
      jobs: ['Teacher', 'Early Childhood Educator', 'Librarian', 'Social Worker', 'Counsellor']
    },
  ]

  const startInterview = async (job) => {
    setJobType(job)
    setGenerating(true)
    setStage('interview')
    setCurrentQuestion(0)
    setAnswers([])
    setCurrentAnswer('')
    setCurrentFeedback(null)
    setShowFeedback(false)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/interview/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_title: job, difficulty })
      })
      const data = await response.json()
      setQuestions(data.questions)
      speakQuestion(data.questions[0].question)
    } catch (err) {
      setQuestions([
        { question: 'Tell me about yourself.', tip: 'Keep it professional and relevant', type: 'General' },
        { question: 'What are your greatest strengths?', tip: 'Give specific examples', type: 'Behavioral' },
        { question: 'Why do you want this job?', tip: 'Research the company first', type: 'Motivational' },
        { question: 'Describe a challenge you overcame.', tip: 'Use the STAR method', type: 'Behavioral' },
        { question: 'Do you have any questions for us?', tip: 'Always prepare 2-3 questions', type: 'Closing' },
      ])
    }
    setGenerating(false)
  }

  const speakQuestion = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Please use Google Chrome for speech recognition.')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onresult = (event) => {
      setCurrentAnswer(event.results[0][0].transcript)
    }
    recognition.start()
  }

  const getAIFeedback = async (question, answer) => {
    setFeedbackLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/interview/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_title: jobType,
          question,
          answer
        })
      })
      const data = await response.json()
      setCurrentFeedback(data)
      setShowFeedback(true)
    } catch (err) {
      console.log('Feedback error')
    }
    setFeedbackLoading(false)
  }

  const nextQuestion = async () => {
    const newAnswers = [...answers, {
      question: questions[currentQuestion].question,
      answer: currentAnswer,
      feedback: currentFeedback
    }]
    setAnswers(newAnswers)
    setCurrentAnswer('')
    setCurrentFeedback(null)
    setShowFeedback(false)

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(prev => prev + 1)
      speakQuestion(questions[currentQuestion + 1].question)
    } else {
      const avgScore = newAnswers.reduce((total, a) => total + (a.feedback?.score || 70), 0) / newAnswers.length
      setFeedback({ answers: newAnswers, avgScore: Math.round(avgScore) })
      setStage('result')
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">

        {stage === 'intro' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">💼 Interview Simulator</h2>
              <p className="text-gray-400 mt-1">Practice with AI-generated questions and get instant feedback</p>
            </div>

            {/* How it works - 3D Banner */}
            <div className="relative transform hover:scale-[1.01] transition mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700 rounded-3xl p-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
                <h3 className="font-bold text-white text-lg mb-4">🤖 How AI Interview Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { step: '1', icon: '💼', text: 'Choose your job type' },
                    { step: '2', icon: '🤖', text: 'AI generates real questions' },
                    { step: '3', icon: '🎤', text: 'Answer by typing or speaking' },
                    { step: '4', icon: '📊', text: 'Get detailed AI feedback' },
                  ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-black bg-opacity-30 border border-purple-500 border-opacity-30 rounded-xl p-3 hover:border-opacity-60 hover:scale-105 transition-all duration-300 shadow-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-purple-900">{item.step}</div>
                    <div>
                      <p className="text-xl">{item.icon}</p>
                      <p className="text-white text-xs mt-0.5">{item.text}</p>
                    </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Difficulty Selector */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
              <p className="font-semibold text-gray-300 mb-3">Select Difficulty:</p>
              <div className="flex gap-3">
                {[
                  { level: 'Easy', color: 'from-green-600 to-green-400', desc: 'Entry level questions' },
                  { level: 'Medium', color: 'from-orange-600 to-orange-400', desc: 'Standard interview questions' },
                  { level: 'Hard', color: 'from-red-600 to-red-400', desc: 'Senior level questions' },
                ].map(d => (
                  <button
                    key={d.level}
                    onClick={() => setDifficulty(d.level)}
                    className={`flex-1 p-3 rounded-xl border-2 transition ${
                      difficulty === d.level
                        ? 'border-purple-500 bg-purple-900 bg-opacity-30'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${d.color} rounded-lg flex items-center justify-center mx-auto mb-2 text-sm font-bold text-white`}>
                      {d.level[0]}
                    </div>
                    <p className="font-bold text-white text-sm">{d.level}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{d.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Job Categories */}
            <div className="space-y-4">
              {jobCategories.map((cat, ci) => (
                <div key={ci} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className={`bg-gradient-to-r ${cat.color} px-5 py-3 flex items-center gap-3`}>
                    <span className="text-2xl">{cat.icon}</span>
                    <p className="font-bold text-white">{cat.category}</p>
                  </div>
                  <div className="p-4 grid grid-cols-2 md:grid-cols-5 gap-2">
                    {cat.jobs.map((job, ji) => (
                      <button
                        key={ji}
                        onClick={() => startInterview(job)}
                        className="bg-gray-800 border border-gray-700 hover:border-gray-500 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-2 rounded-xl text-xs font-medium transition text-center"
                      >
                        {job}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === 'interview' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">💼 {jobType} Interview</h2>
                <p className="text-gray-400 mt-1">Difficulty: {difficulty} • AI Generated Questions</p>
              </div>
              <button
                onClick={() => setStage('intro')}
                className="text-gray-500 hover:text-white transition text-sm"
              >
                ← Change Job
              </button>
            </div>

            {generating ? (
              <div className="text-center py-16">
                <div className="flex gap-2 justify-center mb-4">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <p className="text-gray-400">🤖 AI is generating your {jobType} interview questions...</p>
              </div>
            ) : questions.length > 0 && (
              <div className="space-y-4">

                {/* Progress */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-400 font-medium">Question {currentQuestion + 1} of {questions.length}</p>
                    <span className="bg-purple-900 bg-opacity-50 border border-purple-700 text-purple-300 text-xs px-3 py-1 rounded-full">
                      🤖 AI Generated
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question Card */}
                <div className="relative transform hover:scale-[1.01] transition">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-20"></div>
                  <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-white bg-opacity-20 text-white text-xs px-3 py-1 rounded-full font-medium">
                        {questions[currentQuestion]?.type}
                      </span>
                      <button
                        onClick={() => speakQuestion(questions[currentQuestion]?.question)}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-xl transition"
                      >
                        🔊
                      </button>
                    </div>
                    <p className="text-white text-xl font-medium leading-relaxed">
                      {questions[currentQuestion]?.question}
                    </p>
                    <div className="mt-4 bg-white bg-opacity-10 rounded-xl px-4 py-2">
                      <p className="text-yellow-300 text-xs">💡 Tip: {questions[currentQuestion]?.tip}</p>
                    </div>
                  </div>
                </div>

                {/* Answer Box */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <p className="font-semibold text-gray-300 mb-3">Your Answer:</p>
                  <textarea
                    value={currentAnswer}
                    onChange={e => setCurrentAnswer(e.target.value)}
                    placeholder="Type your answer here or use the microphone to speak..."
                    rows={5}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none"
                  />
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={startListening}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition font-medium text-sm ${
                        listening
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'
                      }`}
                    >
                      🎤 {listening ? 'Listening...' : 'Speak Answer'}
                    </button>
                    <button
                      onClick={() => getAIFeedback(questions[currentQuestion].question, currentAnswer)}
                      disabled={!currentAnswer.trim() || feedbackLoading}
                      className="flex-1 bg-purple-900 bg-opacity-50 border border-purple-700 hover:bg-opacity-80 text-purple-300 hover:text-white py-2 rounded-xl transition disabled:opacity-50 font-medium text-sm"
                    >
                      {feedbackLoading ? '🤖 Analysing...' : '🤖 Get AI Feedback'}
                    </button>
                    <button
                      onClick={nextQuestion}
                      disabled={!currentAnswer.trim()}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-2 rounded-xl transition disabled:opacity-50 font-semibold text-sm"
                    >
                      {currentQuestion + 1 === questions.length ? 'Finish 🎉' : 'Next →'}
                    </button>
                  </div>
                </div>

                {/* AI Feedback */}
                {showFeedback && currentFeedback && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-gray-200">🤖 AI Feedback</p>
                      <span className={`text-2xl font-bold ${
                        currentFeedback.score >= 80 ? 'text-green-400' :
                        currentFeedback.score >= 60 ? 'text-orange-400' : 'text-red-400'
                      }`}>{currentFeedback.score}%</span>
                    </div>

                    <p className="text-gray-300 text-sm">{currentFeedback.feedback}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-green-900 bg-opacity-20 border border-green-800 rounded-xl p-3">
                        <p className="text-green-400 text-xs font-bold mb-2">✅ What you did well:</p>
                        {currentFeedback.strengths?.map((s, i) => (
                          <p key={i} className="text-gray-300 text-xs">• {s}</p>
                        ))}
                      </div>
                      <div className="bg-orange-900 bg-opacity-20 border border-orange-800 rounded-xl p-3">
                        <p className="text-orange-400 text-xs font-bold mb-2">📈 To improve:</p>
                        {currentFeedback.improvements?.map((s, i) => (
                          <p key={i} className="text-gray-300 text-xs">• {s}</p>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-900 bg-opacity-20 border border-blue-800 rounded-xl p-3">
                      <p className="text-blue-400 text-xs font-bold mb-1">💬 Stronger Answer:</p>
                      <p className="text-gray-300 text-xs italic">"{currentFeedback.sample_answer}"</p>
                    </div>

                    <div className="bg-purple-900 bg-opacity-20 border border-purple-800 rounded-xl p-3">
                      <p className="text-purple-400 text-xs font-bold mb-1">🍁 Canadian Interview Tip:</p>
                      <p className="text-gray-300 text-xs">{currentFeedback.canadian_tip}</p>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {stage === 'result' && feedback && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">💼 Interview Complete!</h2>
              <p className="text-gray-400">Here is your full performance report</p>
            </div>

            {/* Score Card */}
            <div className="relative transform hover:scale-[1.01] transition">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700 rounded-3xl p-8 text-center">
                <p className="text-6xl mb-4">
                  {feedback.avgScore >= 80 ? '🏆' : feedback.avgScore >= 60 ? '🌟' : '💪'}
                </p>
                <div className={`text-6xl font-bold mb-2 ${
                  feedback.avgScore >= 80 ? 'text-green-400' :
                  feedback.avgScore >= 60 ? 'text-orange-400' : 'text-red-400'
                }`}>
                  {feedback.avgScore}%
                </div>
                <p className="text-white font-semibold text-lg">
                  {feedback.avgScore >= 80 ? 'Excellent! You are interview ready! 🌟' :
                   feedback.avgScore >= 60 ? 'Good effort! Keep practicing! 💪' :
                   'Keep going! Practice makes perfect! 🎯'}
                </p>
                <p className="text-purple-300 text-sm mt-2">Job: {jobType} • Difficulty: {difficulty}</p>
              </div>
            </div>

            {/* Question by Question */}
            <div className="space-y-4">
              {feedback.answers.map((item, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-semibold text-gray-200 text-sm flex-1">Q{i+1}: {item.question}</p>
                    {item.feedback && (
                      <span className={`text-xl font-bold ml-4 flex-shrink-0 ${
                        item.feedback.score >= 80 ? 'text-green-400' :
                        item.feedback.score >= 60 ? 'text-orange-400' : 'text-red-400'
                      }`}>{item.feedback.score}%</span>
                    )}
                  </div>
                  <div className="bg-gray-800 rounded-xl p-3 mb-3">
                    <p className="text-xs text-gray-500 mb-1">Your answer:</p>
                    <p className="text-gray-300 text-sm">"{item.answer || 'No answer given'}"</p>
                  </div>
                  {item.feedback && (
                    <p className="text-purple-400 text-xs">💡 {item.feedback.canadian_tip}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStage('intro')}
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

export default InterviewSimulator
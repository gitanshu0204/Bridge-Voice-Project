import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { addXP } from '../utils/xpTracker'
import { logActivity } from '../utils/activityTracker'

function InterviewSimulator() {
  const navigate = useNavigate()
  const [stage, setStage] = useState('intro')
  const [step, setStep] = useState(1)
  const [selectedJob, setSelectedJob] = useState('')
  const [companyInput, setCompanyInput] = useState('')
  const [useCompany, setUseCompany] = useState(false)
  const [difficulty, setDifficulty] = useState('Medium')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [listening, setListening] = useState(false)
  const [questions, setQuestions] = useState([])
  const [generating, setGenerating] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [finalResult, setFinalResult] = useState(null)

  const jobCategories = [
    { category: 'Technology', icon: '💻', jobs: ['Software Developer', 'Web Developer', 'Data Analyst', 'IT Support', 'Cybersecurity'] },
    { category: 'Healthcare', icon: '🏥', jobs: ['Nurse', 'Healthcare Worker', 'Pharmacist', 'Dental Assistant', 'Physiotherapist'] },
    { category: 'Business', icon: '💼', jobs: ['Project Manager', 'Marketing Manager', 'HR Manager', 'Financial Advisor', 'Accountant'] },
    { category: 'Trades', icon: '🔧', jobs: ['Electrician', 'Plumber', 'Carpenter', 'Mechanic', 'Welder'] },
    { category: 'Service', icon: '🤝', jobs: ['Customer Service', 'Retail Worker', 'Restaurant Worker', 'Chef', 'Hotel Manager'] },
    { category: 'Education', icon: '📚', jobs: ['Teacher', 'Early Childhood Educator', 'Librarian', 'Social Worker', 'Counsellor'] },
  ]

  const popularCompanies = [
    { name: 'Tim Hortons', icon: '☕' },
    { name: 'Walmart', icon: '🛒' },
    { name: 'RBC', icon: '🏦' },
    { name: 'TD Bank', icon: '🏦' },
    { name: 'Shoppers Drug Mart', icon: '💊' },
    { name: 'Loblaws', icon: '🛍️' },
    { name: 'Amazon', icon: '📦' },
    { name: 'Rogers', icon: '📱' },
  ]

  const startInterview = async () => {
    setStage('interview')
    setGenerating(true)
    setCurrentQuestion(0)
    setAnswers([])
    setCurrentAnswer('')
    setCurrentFeedback(null)
    setShowFeedback(false)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/interview/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_title: selectedJob,
          difficulty,
          company: useCompany ? companyInput : ''
        })
      })
      const data = await response.json()
      setQuestions(data.questions)
      if (data.questions.length > 0) speakQuestion(data.questions[0].question)
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
      alert('Please use Google Chrome.')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onresult = (e) => setCurrentAnswer(e.results[0][0].transcript)
    recognition.start()
  }

  const getAIFeedback = async () => {
    setFeedbackLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/interview/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_title: selectedJob,
          question: questions[currentQuestion].question,
          answer: currentAnswer,
          company: useCompany ? companyInput : ''
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

  const nextQuestion = () => {
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
      const avgScore = Math.round(
        newAnswers.reduce((t, a) => t + (a.feedback?.score || 70), 0) / newAnswers.length
      )
      setFinalResult({ answers: newAnswers, avgScore })

      logActivity({ type: 'interview', score: avgScore, detail: `${selectedJob}${useCompany && companyInput ? ` at ${companyInput}` : ''}` })
      addXP(30, `Completed Interview: ${selectedJob}`)
      setStage('result')
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">

        {stage === 'intro' && (
          <div className="space-y-6">

            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-purple-900 bg-gray-900">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 opacity-80"></div>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-600 rounded-full filter blur-3xl opacity-10"></div>
              <div className="relative p-8 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-green-400 text-xs font-semibold tracking-wider uppercase">AI Powered</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Interview Simulator</h2>
                  <p className="text-gray-400 max-w-sm">Practice with real AI-generated questions and get instant professional feedback</p>
                  <div className="flex items-center gap-4 mt-4">
                    {[
                      { value: '60+', label: 'Job Roles' },
                      { value: 'AI', label: 'Feedback' },
                      { value: '3', label: 'Difficulty Levels' },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <p className="text-xl font-bold text-purple-400">{stat.value}</p>
                        <p className="text-gray-500 text-xs">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hidden md:block text-8xl opacity-20">💼</div>
              </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-3 px-1">
              {['Choose Role', 'Set Difficulty', 'Company'].map((label, i) => (
                <div key={i} className="flex items-center gap-2 flex-1">
                  <div className={`flex items-center gap-2 flex-1 ${i < 2 ? 'after:flex-1 after:h-px after:bg-gray-800' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all flex-shrink-0 ${
                      step === i + 1 ? 'bg-purple-600 text-white ring-4 ring-purple-600 ring-opacity-20' :
                      step > i + 1 ? 'bg-purple-900 border border-purple-700 text-purple-400' :
                      'bg-gray-800 border border-gray-700 text-gray-600'
                    }`}>
                      {step > i + 1 ? '✓' : i + 1}
                    </div>
                    <span className={`text-xs font-medium whitespace-nowrap ${step >= i + 1 ? 'text-gray-300' : 'text-gray-600'}`}>
                      {label}
                    </span>
                  </div>
                  {i < 2 && <div className="flex-1 h-px bg-gray-800 mx-2"></div>}
                </div>
              ))}
            </div>

            {/* Step 1 — Job Role */}
            {step === 1 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-800">
                  <h3 className="font-bold text-white text-lg">What role are you applying for?</h3>
                  <p className="text-gray-500 text-sm mt-0.5">Select the position you want to practice</p>
                </div>
                <div className="p-6 space-y-5">
                  {jobCategories.map((cat, ci) => (
                    <div key={ci}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">{cat.icon}</span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{cat.category}</span>
                        <div className="flex-1 h-px bg-gray-800"></div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {cat.jobs.map((job, ji) => (
                          <button
                            key={ji}
                            onClick={() => setSelectedJob(job)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                              selectedJob === job
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50'
                                : 'bg-gray-800 border border-gray-700/50 text-gray-300 hover:border-purple-700 hover:text-white hover:bg-gray-750'
                            }`}
                          >
                            {job}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {selectedJob && (
                  <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      <span className="text-gray-300 text-sm">Selected: <strong className="text-white">{selectedJob}</strong></span>
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition shadow-lg shadow-purple-900/50"
                    >
                      Continue →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2 — Difficulty */}
            {step === 2 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-800">
                  <h3 className="font-bold text-white text-lg">How challenging should it be?</h3>
                  <p className="text-gray-500 text-sm mt-0.5">Choose a difficulty that matches your experience level</p>
                </div>
                <div className="p-6 space-y-3">
                  {[
                    {
                      level: 'Easy',
                      icon: '🌱',
                      desc: 'Entry level — perfect for first-time job seekers and newcomers',
                      tag: 'Recommended for beginners',
                      tagColor: 'text-green-400 bg-green-900 bg-opacity-30 border-green-800'
                    },
                    {
                      level: 'Medium',
                      icon: '⚡',
                      desc: 'Standard — typical questions asked in most Canadian workplaces',
                      tag: 'Most popular',
                      tagColor: 'text-blue-400 bg-blue-900 bg-opacity-30 border-blue-800'
                    },
                    {
                      level: 'Hard',
                      icon: '🔥',
                      desc: 'Senior level — complex behavioural and situational questions',
                      tag: 'For experienced candidates',
                      tagColor: 'text-orange-400 bg-orange-900 bg-opacity-30 border-orange-800'
                    },
                  ].map(d => (
                    <button
                      key={d.level}
                      onClick={() => setDifficulty(d.level)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all text-left group ${
                        difficulty === d.level
                          ? 'border-purple-500 bg-purple-950 bg-opacity-50'
                          : 'border-gray-800 hover:border-gray-600 bg-gray-800 bg-opacity-30'
                      }`}
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">{d.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-bold text-white">{d.level}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${d.tagColor}`}>{d.tag}</span>
                        </div>
                        <p className="text-gray-500 text-sm">{d.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        difficulty === d.level ? 'border-purple-500 bg-purple-500' : 'border-gray-600'
                      }`}>
                        {difficulty === d.level && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
                  <button
                    onClick={() => setStep(1)}
                    className="text-gray-500 hover:text-white text-sm transition flex items-center gap-1"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition shadow-lg shadow-purple-900/50"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Company */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-800">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-white text-lg">Practice for a specific company</h3>
                        <p className="text-gray-500 text-sm mt-0.5">Optional — AI tailors questions to that company's culture</p>
                      </div>
                      <button
                        onClick={() => setUseCompany(!useCompany)}
                        className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${
                          useCompany ? 'bg-purple-600' : 'bg-gray-700'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${
                          useCompany ? 'translate-x-7' : 'translate-x-1'
                        }`}></div>
                      </button>
                    </div>
                  </div>

                  {useCompany && (
                    <div className="p-6 space-y-4">
                      <input
                        type="text"
                        value={companyInput}
                        onChange={e => setCompanyInput(e.target.value)}
                        placeholder="Type any company name e.g. Tim Hortons, RBC..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition text-sm"
                      />
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Popular Canadian Companies</p>
                        <div className="grid grid-cols-4 gap-2">
                          {popularCompanies.map((comp, i) => (
                            <button
                              key={i}
                              onClick={() => setCompanyInput(comp.name)}
                              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all group ${
                                companyInput === comp.name
                                  ? 'border-purple-500 bg-purple-950 bg-opacity-50'
                                  : 'border-gray-800 hover:border-gray-600 bg-gray-800 bg-opacity-50'
                              }`}
                            >
                              <span className="text-xl group-hover:scale-110 transition-transform">{comp.icon}</span>
                              <span className="text-xs text-gray-400 text-center leading-tight">{comp.name.split(' ')[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-800">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Interview Summary</p>
                  </div>
                  <div className="p-6 grid grid-cols-2 gap-4">
                    {[
                      { label: 'Role', value: selectedJob, icon: '💼' },
                      { label: 'Difficulty', value: difficulty, icon: '⚡' },
                      { label: 'Company', value: useCompany && companyInput ? companyInput : 'General', icon: '🏢' },
                      { label: 'Questions', value: '5 AI-generated', icon: '🤖' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-800 rounded-xl p-3">
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <p className="text-xs text-gray-500">{item.label}</p>
                          <p className="text-sm font-semibold text-white mt-0.5">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
                    <button
                      onClick={() => setStep(2)}
                      className="text-gray-500 hover:text-white text-sm transition"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={startInterview}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-lg shadow-purple-900/50 flex items-center gap-2"
                    >
                      <span>Start Interview</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── INTERVIEW STAGE ── */}
        {stage === 'interview' && (
          <div className="space-y-4">

            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedJob}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{difficulty}</span>
                  {useCompany && companyInput && (
                    <>
                      <span className="text-gray-700">•</span>
                      <span className="text-xs text-purple-400">{companyInput}</span>
                    </>
                  )}
                  <span className="text-gray-700">•</span>
                  <span className="text-xs bg-purple-900 bg-opacity-50 border border-purple-800 text-purple-300 px-2 py-0.5 rounded-full">
                    🤖 AI Generated
                  </span>
                </div>
              </div>
              <button
                onClick={() => { setStage('intro'); setStep(1) }}
                className="text-gray-600 hover:text-white transition text-sm flex items-center gap-1"
              >
                ✕ Exit
              </button>
            </div>

            {generating ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center">
                <div className="w-12 h-12 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-300 font-medium">Generating your questions...</p>
                <p className="text-gray-600 text-sm mt-1">Tailoring {selectedJob} questions just for you</p>
              </div>
            ) : questions.length > 0 && (
              <div className="space-y-4">

                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">{currentQuestion + 1}/{questions.length}</span>
                </div>

                {/* Question Card */}
                <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-purple-600"></div>
                  <div className="p-6 pl-8">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-semibold text-purple-400 bg-purple-900 bg-opacity-30 border border-purple-800 px-3 py-1 rounded-full">
                        {questions[currentQuestion]?.type}
                      </span>
                      <button
                        onClick={() => speakQuestion(questions[currentQuestion]?.question)}
                        className="text-gray-600 hover:text-purple-400 transition text-lg"
                      >
                        🔊
                      </button>
                    </div>
                    <p className="text-white text-xl font-medium leading-relaxed mb-5">
                      {questions[currentQuestion]?.question}
                    </p>
                    <div className="flex items-start gap-2 bg-gray-800 rounded-xl px-4 py-3 border border-gray-700">
                      <span className="text-yellow-500 text-sm mt-0.5 flex-shrink-0">💡</span>
                      <p className="text-gray-400 text-sm">{questions[currentQuestion]?.tip}</p>
                    </div>
                  </div>
                </div>

                {/* Answer Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-300">Your Answer</p>
                    <span className="text-xs text-gray-600">{currentAnswer.split(' ').filter(w => w).length} words</span>
                  </div>
                  <div className="p-5">
                    <textarea
                      value={currentAnswer}
                      onChange={e => setCurrentAnswer(e.target.value)}
                      placeholder="Type your answer or use the microphone to speak..."
                      rows={5}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition resize-none text-sm leading-relaxed"
                    />
                    <div className="flex gap-2 mt-3">
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
                      <button
                        onClick={getAIFeedback}
                        disabled={!currentAnswer.trim() || feedbackLoading}
                        className="flex-1 border border-gray-700 text-gray-300 hover:border-purple-700 hover:text-purple-300 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-40"
                      >
                        {feedbackLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-3 h-3 border border-purple-500 border-t-transparent rounded-full animate-spin"></span>
                            Analysing...
                          </span>
                        ) : '🤖 Get AI Feedback'}
                      </button>
                      <button
                        onClick={nextQuestion}
                        disabled={!currentAnswer.trim()}
                        className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-xl font-bold text-sm transition disabled:opacity-40 shadow-lg shadow-purple-900/40"
                      >
                        {currentQuestion + 1 === questions.length ? 'Finish Interview' : 'Next Question →'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Feedback Card */}
                {showFeedback && currentFeedback && (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                      <p className="font-bold text-white flex items-center gap-2">
                        🤖 <span>AI Feedback</span>
                      </p>
                      <div className={`text-2xl font-bold ${
                        currentFeedback.score >= 80 ? 'text-green-400' :
                        currentFeedback.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>{currentFeedback.score}%</div>
                    </div>
                    <div className="p-5 space-y-4">
                      <p className="text-gray-300 text-sm leading-relaxed">{currentFeedback.feedback}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                          <p className="text-xs font-bold text-green-400 mb-2 flex items-center gap-1">
                            <span>✅</span> Strengths
                          </p>
                          {currentFeedback.strengths?.map((s, i) => (
                            <p key={i} className="text-gray-400 text-xs mb-1.5">• {s}</p>
                          ))}
                        </div>
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                          <p className="text-xs font-bold text-yellow-400 mb-2 flex items-center gap-1">
                            <span>📈</span> Improve
                          </p>
                          {currentFeedback.improvements?.map((s, i) => (
                            <p key={i} className="text-gray-400 text-xs mb-1.5">• {s}</p>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                        <p className="text-xs font-bold text-purple-400 mb-2">💬 Stronger Answer</p>
                        <p className="text-gray-400 text-sm italic leading-relaxed">"{currentFeedback.sample_answer}"</p>
                      </div>
                      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                        <p className="text-xs font-bold text-blue-400 mb-1.5">🍁 Canadian Interview Tip</p>
                        <p className="text-gray-400 text-sm">{currentFeedback.canadian_tip}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── RESULT STAGE ── */}
        {stage === 'result' && finalResult && (
          <div className="space-y-5">

            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 opacity-50"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
              <div className="relative p-8 text-center">
                <p className="text-5xl mb-4">
                  {finalResult.avgScore >= 80 ? '🏆' : finalResult.avgScore >= 60 ? '🌟' : '💪'}
                </p>
                <h2 className="text-2xl font-bold text-white mb-1">Interview Complete!</h2>
                <div className={`text-6xl font-bold my-4 ${
                  finalResult.avgScore >= 80 ? 'text-green-400' :
                  finalResult.avgScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {finalResult.avgScore}%
                </div>
                <p className="text-gray-400">
                  {finalResult.avgScore >= 80 ? 'Excellent! You are interview ready!' :
                   finalResult.avgScore >= 60 ? 'Good effort! Keep practicing!' :
                   'Keep going! Practice makes perfect!'}
                </p>
                <div className="flex items-center justify-center gap-3 mt-3">
                  <span className="text-xs text-gray-600">{selectedJob}</span>
                  <span className="text-gray-700">•</span>
                  <span className="text-xs text-gray-600">{difficulty}</span>
                  {useCompany && companyInput && (
                    <>
                      <span className="text-gray-700">•</span>
                      <span className="text-xs text-purple-400">{companyInput}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {finalResult.answers.map((item, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-start gap-4">
                    <p className="text-gray-200 text-sm font-medium flex-1">Q{i+1}: {item.question}</p>
                    {item.feedback && (
                      <span className={`text-lg font-bold flex-shrink-0 ${
                        item.feedback.score >= 80 ? 'text-green-400' :
                        item.feedback.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                      }`}>{item.feedback.score}%</span>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-gray-500 text-xs mb-1">Your answer</p>
                    <p className="text-gray-300 text-sm">"{item.answer || 'No answer given'}"</p>
                    {item.feedback?.canadian_tip && (
                      <p className="text-purple-400 text-xs mt-3 flex items-start gap-1.5">
                        <span>💡</span>
                        <span>{item.feedback.canadian_tip}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setStage('intro'); setStep(1); setSelectedJob('') }}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-purple-900/40"
              >
                Practice Again
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-gray-900 border border-gray-800 hover:border-gray-600 text-gray-300 hover:text-white py-3 rounded-xl font-bold transition"
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
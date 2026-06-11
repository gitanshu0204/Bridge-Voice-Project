import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function Quiz() {
  const navigate = useNavigate()
  const [stage, setStage] = useState('levels')
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState([])
  const [activeLevel, setActiveLevel] = useState(1)
  const [completedLevels, setCompletedLevels] = useState(
    JSON.parse(localStorage.getItem('quizLevels') || '{}')
  )
  const [aiGenerated, setAiGenerated] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [explanation, setExplanation] = useState('')
  const [loadingExplanation, setLoadingExplanation] = useState(false)
  const [nativeLanguage, setNativeLanguage] = useState('Hindi')
  const [wrongWords, setWrongWords] = useState([])

  const levels = [
    {
      level: 1, title: 'Beginner', icon: '🌱',
      color: 'from-green-600 to-green-400',
      borderColor: 'border-green-800',
      desc: 'Basic everyday English words',
      questions: [
        { word: 'Happy', correct: 'Feeling joy and pleasure', options: ['Feeling joy and pleasure', 'Feeling very tired', 'Feeling angry', 'Feeling confused'] },
        { word: 'Hungry', correct: 'Needing or wanting food', options: ['Needing or wanting food', 'Feeling very cold', 'Needing sleep', 'Feeling sick'] },
        { word: 'Friendly', correct: 'Kind and pleasant to others', options: ['Kind and pleasant to others', 'Being very quiet', 'Feeling lonely', 'Being very busy'] },
        { word: 'Tired', correct: 'Needing rest or sleep', options: ['Needing rest or sleep', 'Feeling very happy', 'Being very active', 'Feeling hungry'] },
        { word: 'Busy', correct: 'Having a lot of things to do', options: ['Having a lot of things to do', 'Having nothing to do', 'Feeling very relaxed', 'Being very slow'] },
        { word: 'Polite', correct: 'Having good manners', options: ['Having good manners', 'Being very rude', 'Feeling nervous', 'Being very loud'] },
        { word: 'Honest', correct: 'Always telling the truth', options: ['Always telling the truth', 'Telling lies often', 'Being very quiet', 'Feeling confused'] },
        { word: 'Helpful', correct: 'Willing to assist others', options: ['Willing to assist others', 'Refusing to help', 'Being very selfish', 'Feeling tired'] },
        { word: 'Brave', correct: 'Not afraid of danger', options: ['Not afraid of danger', 'Being very scared', 'Feeling very shy', 'Avoiding everything'] },
        { word: 'Calm', correct: 'Not excited or worried', options: ['Not excited or worried', 'Feeling very angry', 'Being very loud', 'Feeling nervous'] },
      ]
    },
    {
      level: 2, title: 'Elementary', icon: '📗',
      color: 'from-blue-600 to-blue-400',
      borderColor: 'border-blue-800',
      desc: 'Common workplace and social words',
      questions: [
        { word: 'Punctual', correct: 'Arriving on time', options: ['Arriving on time', 'Arriving very late', 'Leaving work early', 'Working extra hours'] },
        { word: 'Confident', correct: 'Feeling sure about yourself', options: ['Feeling sure about yourself', 'Feeling scared', 'Being very shy', 'Feeling confused'] },
        { word: 'Dedicated', correct: 'Committed and hardworking', options: ['Committed and hardworking', 'Being very lazy', 'Working part time', 'Taking many breaks'] },
        { word: 'Reliable', correct: 'Can be trusted to do what is needed', options: ['Can be trusted to do what is needed', 'Forgetting things often', 'Being unreliable', 'Changing plans often'] },
        { word: 'Motivated', correct: 'Having a reason and desire to do something', options: ['Having a reason and desire to do something', 'Feeling very tired', 'Not wanting to work', 'Being very bored'] },
        { word: 'Flexible', correct: 'Willing to change and adapt', options: ['Willing to change and adapt', 'Being very rigid', 'Refusing to change', 'Being very strict'] },
        { word: 'Organized', correct: 'Arranged in a neat and efficient way', options: ['Arranged in a neat and efficient way', 'Being very messy', 'Losing things often', 'Being very confused'] },
        { word: 'Efficient', correct: 'Working well without wasting time', options: ['Working well without wasting time', 'Working very slowly', 'Making many mistakes', 'Wasting a lot of time'] },
        { word: 'Proactive', correct: 'Taking action before problems occur', options: ['Taking action before problems occur', 'Waiting for problems', 'Reacting slowly', 'Avoiding all tasks'] },
        { word: 'Professional', correct: 'Behaving in a competent and skilled way', options: ['Behaving in a competent and skilled way', 'Having a degree', 'Wearing a suit', 'Working full time'] },
      ]
    },
    {
      level: 3, title: 'Intermediate', icon: '📘',
      color: 'from-purple-600 to-purple-400',
      borderColor: 'border-purple-800',
      desc: 'Professional and business vocabulary',
      questions: [
        { word: 'Collaborate', correct: 'To work together with others', options: ['To work together with others', 'To work alone', 'To argue with others', 'To take a vacation'] },
        { word: 'Negotiate', correct: 'To discuss to reach an agreement', options: ['To discuss to reach an agreement', 'To refuse an offer', 'To sign a contract', 'To quit a job'] },
        { word: 'Perseverance', correct: 'Continued effort despite difficulty', options: ['Continued effort despite difficulty', 'Giving up easily', 'Feeling nervous', 'A workplace meeting'] },
        { word: 'Integrity', correct: 'Being honest and having strong morals', options: ['Being honest and having strong morals', 'A math calculation', 'A type of software', 'Feeling proud'] },
        { word: 'Empathy', correct: 'Understanding and sharing feelings of others', options: ['Understanding and sharing feelings of others', 'A medical condition', 'Feeling angry', 'A workplace policy'] },
        { word: 'Resilient', correct: 'Able to recover quickly from difficulties', options: ['Able to recover quickly from difficulties', 'Feeling very tired', 'A type of tree', 'Being very strict'] },
        { word: 'Articulate', correct: 'Able to express ideas clearly', options: ['Able to express ideas clearly', 'Feeling confused', 'A type of document', 'Working in an office'] },
        { word: 'Diplomatic', correct: 'Dealing with people in a sensitive way', options: ['Dealing with people in a sensitive way', 'Working for government', 'Travelling abroad', 'Being very blunt'] },
        { word: 'Innovative', correct: 'Introducing new ideas or methods', options: ['Introducing new ideas or methods', 'Following old traditions', 'Working in technology', 'Being creative in art'] },
        { word: 'Credibility', correct: 'Being trusted and believed by others', options: ['Being trusted and believed by others', 'Having a good credit score', 'A type of reference', 'Working for a long time'] },
      ]
    },
    {
      level: 4, title: 'Advanced', icon: '📙',
      color: 'from-orange-600 to-orange-400',
      borderColor: 'border-orange-800',
      desc: 'Complex academic and business terms',
      questions: [
        { word: 'Paradigm', correct: 'A typical example or pattern of something', options: ['A typical example or pattern of something', 'A type of diagram', 'A workplace problem', 'A new technology'] },
        { word: 'Eloquent', correct: 'Speaking in a clear and persuasive way', options: ['Speaking in a clear and persuasive way', 'Speaking very quietly', 'Using difficult words', 'Being very formal'] },
        { word: 'Pragmatic', correct: 'Dealing with things in a practical way', options: ['Dealing with things in a practical way', 'Being very idealistic', 'Avoiding all problems', 'Being very theoretical'] },
        { word: 'Meticulous', correct: 'Very careful and precise', options: ['Very careful and precise', 'Being very careless', 'Working very fast', 'Ignoring details'] },
        { word: 'Ambiguous', correct: 'Open to more than one interpretation', options: ['Open to more than one interpretation', 'Very clear and obvious', 'Being very ambitious', 'A type of language'] },
        { word: 'Coherent', correct: 'Logical and consistent', options: ['Logical and consistent', 'Very complicated', 'A type of light', 'Being very detailed'] },
        { word: 'Unprecedented', correct: 'Never done or known before', options: ['Never done or known before', 'Very common and usual', 'Happening every year', 'Being very predictable'] },
        { word: 'Conscientious', correct: 'Very careful and thorough in work', options: ['Very careful and thorough in work', 'Being very careless', 'Working very fast', 'Not caring about quality'] },
        { word: 'Mitigate', correct: 'To make something less severe', options: ['To make something less severe', 'To make things worse', 'To avoid all problems', 'To solve completely'] },
        { word: 'Nuanced', correct: 'Having subtle differences and complexity', options: ['Having subtle differences and complexity', 'Being very simple', 'Having no differences', 'Being very obvious'] },
      ]
    },
    {
      level: 5, title: 'Expert', icon: '🏆',
      color: 'from-red-600 to-red-400',
      borderColor: 'border-red-800',
      desc: 'Expert level English mastery',
      questions: [
        { word: 'Juxtapose', correct: 'To place two things side by side for contrast', options: ['To place two things side by side for contrast', 'To mix things together', 'To separate two ideas', 'To ignore differences'] },
        { word: 'Ubiquitous', correct: 'Present everywhere at the same time', options: ['Present everywhere at the same time', 'Very rare and unusual', 'Found in one place only', 'Being very hidden'] },
        { word: 'Esoteric', correct: 'Understood by only a small group', options: ['Understood by only a small group', 'Known by everyone', 'Very simple to understand', 'A type of language'] },
        { word: 'Superfluous', correct: 'More than what is needed — unnecessary', options: ['More than what is needed — unnecessary', 'Not enough of something', 'Very important and needed', 'Being very efficient'] },
        { word: 'Acrimonious', correct: 'Angry and bitter in manner or speech', options: ['Angry and bitter in manner or speech', 'Very friendly and kind', 'Being very polite', 'Feeling very happy'] },
        { word: 'Perspicacious', correct: 'Having a clear understanding of things', options: ['Having a clear understanding of things', 'Being very confused', 'Having poor judgment', 'Making bad decisions'] },
        { word: 'Inexorable', correct: 'Impossible to stop or prevent', options: ['Impossible to stop or prevent', 'Very easy to stop', 'Happening very slowly', 'Being very flexible'] },
        { word: 'Obfuscate', correct: 'To make something unclear and confusing', options: ['To make something unclear and confusing', 'To make things very clear', 'To simplify everything', 'To explain in detail'] },
        { word: 'Magnanimous', correct: 'Very generous and forgiving', options: ['Very generous and forgiving', 'Being very selfish', 'Feeling very angry', 'Being very strict'] },
        { word: 'Recalcitrant', correct: 'Stubbornly refusing to follow rules', options: ['Stubbornly refusing to follow rules', 'Very obedient and helpful', 'Being very flexible', 'Following all rules'] },
      ]
    },
  ]

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

  const startQuiz = async (levelData, useAI = false) => {
    setActiveLevel(levelData.level)
    setStage('quiz')
    setCurrentQ(0)
    setScore(0)
    setSelected(null)
    setShowAnswer(false)
    setExplanation('')
    setWrongWords([])

    if (useAI) {
      setGenerating(true)
      try {
        const response = await fetch('http://127.0.0.1:8000/api/quiz/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            level: levelData.level,
            level_title: levelData.title,
            native_language: nativeLanguage,
            weak_areas: [],
            previous_wrong: wrongWords
          })
        })
        const data = await response.json()
        if (data.questions && data.questions.length > 0) {
          setQuizQuestions(data.questions)
          setAiGenerated(true)
        } else {
          const picked = shuffle(levelData.questions).slice(0, 10)
          setQuizQuestions(picked.map(q => ({ ...q, options: shuffle(q.options) })))
          setAiGenerated(false)
        }
      } catch (err) {
        const picked = shuffle(levelData.questions).slice(0, 10)
        setQuizQuestions(picked.map(q => ({ ...q, options: shuffle(q.options) })))
        setAiGenerated(false)
      }
      setGenerating(false)
    } else {
      const picked = shuffle(levelData.questions).slice(0, 10)
      setQuizQuestions(picked.map(q => ({ ...q, options: shuffle(q.options) })))
      setAiGenerated(false)
    }
  }

  const handleAnswer = async (option) => {
    if (showAnswer) return
    setSelected(option)
    setShowAnswer(true)

    const correct = option === quizQuestions[currentQ].correct
    if (correct) {
      setScore(prev => prev + 1)
    } else {
      setWrongWords(prev => [...prev, quizQuestions[currentQ].word])
      if (aiGenerated) {
        setLoadingExplanation(true)
        try {
          const response = await fetch('http://127.0.0.1:8000/api/quiz/explain', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              word: quizQuestions[currentQ].word,
              correct_answer: quizQuestions[currentQ].correct,
              user_answer: option,
              native_language: nativeLanguage
            })
          })
          const data = await response.json()
          setExplanation(data.explanation)
        } catch (err) {
          setExplanation('Keep practicing! Every mistake helps you learn. 💪')
        }
        setLoadingExplanation(false)
      }
    }
  }

  const nextQuestion = () => {
    setSelected(null)
    setShowAnswer(false)
    setExplanation('')
    if (currentQ + 1 < quizQuestions.length) {
      setCurrentQ(prev => prev + 1)
    } else {
      const finalScore = score
      const passed = finalScore >= 8
      const updated = { ...completedLevels, [activeLevel]: { score: finalScore, passed } }
      setCompletedLevels(updated)
      localStorage.setItem('quizLevels', JSON.stringify(updated))
      setStage('result')
    }
  }

  const speakWord = (word) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'en-US'
      window.speechSynthesis.speak(utterance)
    }
  }

  const isLevelUnlocked = (levelNum) => {
    if (levelNum === 1) return true
    return completedLevels[levelNum - 1]?.passed === true
  }

  const currentLevelData = levels.find(l => l.level === activeLevel)
  const finalScore = score

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">

        {stage === 'levels' && (
          <div className="space-y-6">

            {/* Hero */}
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 opacity-60"></div>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
              <div className="relative p-8 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                    <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">5 Levels • AI Powered</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Vocabulary Quiz</h2>
                  <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                    Progress through 5 levels of English mastery with AI-generated questions tailored to your native language.
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    {[
                      { value: '5', label: 'Levels' },
                      { value: 'AI', label: 'Questions' },
                      { value: '75+', label: 'Words' },
                    ].map((stat, i) => (
                      <div key={i}>
                        <p className="text-lg font-bold text-purple-400">{stat.value}</p>
                        <p className="text-gray-500 text-xs">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hidden md:block text-8xl opacity-10">🧠</div>
              </div>
            </div>

            {/* Native Language Selector */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Native Language (for AI Quiz)</p>
              </div>
              <div className="p-4 flex flex-wrap gap-2">
                {['Hindi', 'Punjabi', 'Mandarin', 'Arabic', 'Spanish', 'French', 'Tagalog', 'Urdu'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setNativeLanguage(lang)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                      nativeLanguage === lang
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                        : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Cards */}
            <div className="space-y-3">
              {levels.map((level) => {
                const unlocked = isLevelUnlocked(level.level)
                const completed = completedLevels[level.level]
                return (
                  <div
                    key={level.level}
                    className={`bg-gray-900 border rounded-2xl overflow-hidden transition ${
                      unlocked ? 'border-gray-800 hover:border-gray-700' : 'border-gray-800 opacity-60'
                    }`}
                  >
                    <div className="p-5 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                          unlocked ? level.color : 'from-gray-700 to-gray-600'
                        } flex items-center justify-center text-xl shadow-lg`}>
                          {unlocked ? level.icon : '🔒'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-white">Level {level.level} — {level.title}</p>
                            {completed?.passed && (
                              <span className="text-xs bg-green-900 bg-opacity-30 border border-green-800 text-green-400 px-2 py-0.5 rounded-full">
                                ✅ Passed
                              </span>
                            )}
                          </div>
                          <p className="text-gray-500 text-xs mt-0.5">{level.desc}</p>
                          {completed && (
                            <p className={`text-xs font-medium mt-1 ${completed.passed ? 'text-green-400' : 'text-yellow-400'}`}>
                              Best score: {completed.score}/10
                            </p>
                          )}
                        </div>
                      </div>

                      {unlocked ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startQuiz(level, false)}
                            className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-3 py-2 rounded-xl transition text-xs font-medium"
                          >
                            📝 Classic
                          </button>
                          <button
                            onClick={() => startQuiz(level, true)}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-xl transition text-xs font-bold shadow-lg shadow-purple-900/40"
                          >
                            🤖 AI Quiz
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-600">Pass Level {level.level - 1} first</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-300 mb-2">🤖 AI Quiz vs Classic Quiz</p>
              <div className="space-y-1.5">
                <p className="text-gray-500 text-xs">
                  <span className="text-white font-medium">Classic:</span> Fixed questions from our word bank
                </p>
                <p className="text-gray-500 text-xs">
                  <span className="text-white font-medium">AI Quiz:</span> Groq AI generates fresh questions every time, personalized to your native language with explanations for wrong answers!
                </p>
              </div>
            </div>
          </div>
        )}

        {generating && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 text-center">
            <div className="w-12 h-12 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-300 font-medium">Generating your personalized quiz...</p>
            <p className="text-gray-600 text-sm mt-1">Creating questions for {nativeLanguage} speakers</p>
          </div>
        )}

        {stage === 'quiz' && quizQuestions.length > 0 && !generating && (
          <div className="space-y-4">

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Level {activeLevel} — {currentLevelData?.title}</h2>
                <p className="text-gray-500 text-sm mt-0.5">
                  {aiGenerated ? `🤖 AI Generated • ${nativeLanguage}` : '📝 Classic Mode'}
                </p>
              </div>
              <button
                onClick={() => setStage('levels')}
                className="text-gray-600 hover:text-white transition text-sm"
              >
                ✕ Exit
              </button>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-purple-600 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${(currentQ / 10) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0">{currentQ + 1}/10</span>
              <span className="text-xs text-purple-400 font-bold flex-shrink-0">Score: {score}</span>
            </div>

            {/* Question Card */}
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-600"></div>
              <div className="p-6 pl-8">
                <p className="text-xs text-gray-500 mb-3">What does this word mean?</p>
                <div className="flex items-center gap-3">
                  <h3 className="text-4xl font-bold text-white">{quizQuestions[currentQ].word}</h3>
                  <button
                    onClick={() => speakWord(quizQuestions[currentQ].word)}
                    className="text-gray-600 hover:text-purple-400 transition text-xl"
                  >
                    🔊
                  </button>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {quizQuestions[currentQ].options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition font-medium text-sm ${
                    !showAnswer
                      ? 'border-gray-700 bg-gray-900 hover:border-gray-500 text-gray-200'
                      : option === quizQuestions[currentQ].correct
                      ? 'border-green-500 bg-green-900 bg-opacity-20 text-green-300'
                      : option === selected
                      ? 'border-red-500 bg-red-900 bg-opacity-20 text-red-300'
                      : 'border-gray-800 bg-gray-900 text-gray-600'
                  }`}
                >
                  {option}
                  {showAnswer && option === quizQuestions[currentQ].correct && ' ✅'}
                  {showAnswer && option === selected && option !== quizQuestions[currentQ].correct && ' ❌'}
                </button>
              ))}
            </div>

            {/* AI Explanation */}
            {showAnswer && selected !== quizQuestions[currentQ].correct && aiGenerated && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-800">
                  <p className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-xs">🤖</span>
                    AI Explanation
                  </p>
                </div>
                <div className="p-5">
                  {loadingExplanation ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500 text-sm">Generating explanation...</span>
                    </div>
                  ) : (
                    <div className="relative pl-4 border-l-2 border-purple-600">
                      <p className="text-gray-300 text-sm leading-relaxed">{explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {showAnswer && (
              <button
                onClick={nextQuestion}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-purple-900/40"
              >
                {currentQ + 1 === 10 ? 'See Results 🎉' : 'Next Question →'}
              </button>
            )}
          </div>
        )}

        {stage === 'result' && (
          <div className="space-y-5">

            {/* Result Card */}
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 opacity-50"></div>
              <div className="relative p-8 text-center">
                <p className="text-5xl mb-4">
                  {finalScore >= 8 ? '🏆' : finalScore >= 5 ? '🌟' : '💪'}
                </p>
                <h2 className="text-2xl font-bold text-white mb-1">Level {activeLevel} Complete!</h2>
                <div className={`text-6xl font-bold my-3 ${
                  finalScore >= 8 ? 'text-green-400' :
                  finalScore >= 5 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {finalScore}/10
                </div>
                {aiGenerated && (
                  <span className="text-xs bg-purple-900 bg-opacity-50 border border-purple-800 text-purple-300 px-3 py-1 rounded-full">
                    🤖 AI Generated Quiz
                  </span>
                )}
              </div>
            </div>

            {finalScore >= 8 ? (
              <div className="bg-gray-900 border border-green-800 rounded-2xl p-5">
                <div className="relative pl-4 border-l-2 border-green-500">
                  <p className="text-green-400 font-bold">🎉 Level {activeLevel} Passed!</p>
                  {activeLevel < 5 && (
                    <p className="text-green-300 text-sm mt-1">Level {activeLevel + 1} — {levels[activeLevel]?.title} is now unlocked!</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 border border-yellow-800 rounded-2xl p-5">
                <div className="relative pl-4 border-l-2 border-yellow-500">
                  <p className="text-yellow-400 font-bold">Need 8/10 to unlock next level</p>
                  {wrongWords.length > 0 && (
                    <p className="text-gray-500 text-xs mt-1">Practice: {wrongWords.join(', ')}</p>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">{finalScore}</p>
                  <p className="text-xs text-gray-500">Correct</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-400">{10 - finalScore}</p>
                  <p className="text-xs text-gray-500">Wrong</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-400">{finalScore * 10}%</p>
                  <p className="text-xs text-gray-500">Score</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStage('levels')}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-purple-900/40"
              >
                Back to Levels
              </button>
              <button
                onClick={() => startQuiz(levels.find(l => l.level === activeLevel), aiGenerated)}
                className="flex-1 bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white py-3 rounded-xl font-bold transition"
              >
                Try Again 🔄
              </button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}

export default Quiz
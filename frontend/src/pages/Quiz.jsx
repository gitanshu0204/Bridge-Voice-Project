import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../assets/logo'

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

  const levels = [
    {
      level: 1, title: 'Beginner', icon: '🌱', color: 'from-green-600 to-green-400',
      borderColor: 'border-green-800', bgColor: 'bg-green-900',
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
        { word: 'Curious', correct: 'Wanting to know or learn things', options: ['Wanting to know or learn things', 'Not interested in anything', 'Feeling very bored', 'Being very quiet'] },
        { word: 'Grateful', correct: 'Feeling thankful', options: ['Feeling thankful', 'Feeling very angry', 'Being ungrateful', 'Feeling confused'] },
        { word: 'Patient', correct: 'Able to wait without getting upset', options: ['Able to wait without getting upset', 'Getting angry quickly', 'Being in a hurry', 'Feeling very nervous'] },
        { word: 'Careful', correct: 'Giving attention to avoid mistakes', options: ['Giving attention to avoid mistakes', 'Being very careless', 'Working very fast', 'Ignoring details'] },
        { word: 'Excited', correct: 'Feeling very enthusiastic and eager', options: ['Feeling very enthusiastic and eager', 'Feeling very bored', 'Being very calm', 'Feeling very sad'] },
      ]
    },
    {
      level: 2, title: 'Elementary', icon: '📗', color: 'from-blue-600 to-blue-400',
      borderColor: 'border-blue-800', bgColor: 'bg-blue-900',
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
        { word: 'Respectful', correct: 'Showing consideration for others', options: ['Showing consideration for others', 'Being very rude', 'Ignoring people', 'Being very selfish'] },
        { word: 'Proactive', correct: 'Taking action before problems occur', options: ['Taking action before problems occur', 'Waiting for problems', 'Reacting slowly', 'Avoiding all tasks'] },
        { word: 'Adaptable', correct: 'Able to change to suit new conditions', options: ['Able to change to suit new conditions', 'Refusing to change', 'Being very stubborn', 'Staying the same always'] },
        { word: 'Initiative', correct: 'Taking action without being told', options: ['Taking action without being told', 'Waiting for instructions', 'Being very passive', 'Avoiding responsibility'] },
        { word: 'Networking', correct: 'Building professional relationships', options: ['Building professional relationships', 'Using the internet', 'Setting up computers', 'Attending school'] },
        { word: 'Feedback', correct: 'Information about how well you are doing', options: ['Information about how well you are doing', 'A microphone sound', 'Complaining about work', 'A performance bonus'] },
        { word: 'Professional', correct: 'Behaving in a competent and skilled way', options: ['Behaving in a competent and skilled way', 'Having a degree', 'Wearing a suit', 'Working full time'] },
      ]
    },
    {
      level: 3, title: 'Intermediate', icon: '📘', color: 'from-purple-600 to-purple-400',
      borderColor: 'border-purple-800', bgColor: 'bg-purple-900',
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
        { word: 'Assertive', correct: 'Confidently expressing your opinions', options: ['Confidently expressing your opinions', 'Being very aggressive', 'Staying quiet', 'Following all rules'] },
        { word: 'Innovative', correct: 'Introducing new ideas or methods', options: ['Introducing new ideas or methods', 'Following old traditions', 'Working in technology', 'Being creative in art'] },
        { word: 'Transparency', correct: 'Being open and honest about everything', options: ['Being open and honest about everything', 'Being invisible', 'Working from home', 'Being very quiet'] },
        { word: 'Accountability', correct: 'Taking responsibility for your actions', options: ['Taking responsibility for your actions', 'Working as accountant', 'Keeping financial records', 'Managing a team'] },
        { word: 'Mentorship', correct: 'Guidance given by an experienced person', options: ['Guidance given by an experienced person', 'A type of job title', 'A new employee program', 'A workplace rule'] },
        { word: 'Constructive', correct: 'Helpful and intended to improve something', options: ['Helpful and intended to improve something', 'Related to construction', 'Being negative', 'Criticizing harshly'] },
        { word: 'Credibility', correct: 'Being trusted and believed by others', options: ['Being trusted and believed by others', 'Having a good credit score', 'A type of reference', 'Working for a long time'] },
      ]
    },
    {
      level: 4, title: 'Advanced', icon: '📙', color: 'from-orange-600 to-orange-400',
      borderColor: 'border-orange-800', bgColor: 'bg-orange-900',
      desc: 'Complex academic and business terms',
      questions: [
        { word: 'Paradigm', correct: 'A typical example or pattern of something', options: ['A typical example or pattern of something', 'A type of diagram', 'A workplace problem', 'A new technology'] },
        { word: 'Eloquent', correct: 'Speaking in a clear and persuasive way', options: ['Speaking in a clear and persuasive way', 'Speaking very quietly', 'Using difficult words', 'Being very formal'] },
        { word: 'Pragmatic', correct: 'Dealing with things in a practical way', options: ['Dealing with things in a practical way', 'Being very idealistic', 'Avoiding all problems', 'Being very theoretical'] },
        { word: 'Leverage', correct: 'To use something to maximum advantage', options: ['To use something to maximum advantage', 'To lift heavy objects', 'A financial tool', 'To negotiate salary'] },
        { word: 'Streamline', correct: 'To make a process simpler and more efficient', options: ['To make a process simpler and more efficient', 'To design a logo', 'To work faster', 'To reduce staff'] },
        { word: 'Facilitate', correct: 'To make a process easier', options: ['To make a process easier', 'To make things harder', 'To build a facility', 'To manage a team'] },
        { word: 'Synthesize', correct: 'To combine different ideas into a whole', options: ['To combine different ideas into a whole', 'To analyze separately', 'A chemistry process', 'To simplify everything'] },
        { word: 'Ambiguous', correct: 'Open to more than one interpretation', options: ['Open to more than one interpretation', 'Very clear and obvious', 'Being very ambitious', 'A type of language'] },
        { word: 'Meticulous', correct: 'Very careful and precise', options: ['Very careful and precise', 'Being very careless', 'Working very fast', 'Ignoring details'] },
        { word: 'Coherent', correct: 'Logical and consistent', options: ['Logical and consistent', 'Very complicated', 'A type of light', 'Being very detailed'] },
        { word: 'Unprecedented', correct: 'Never done or known before', options: ['Never done or known before', 'Very common and usual', 'Happening every year', 'Being very predictable'] },
        { word: 'Nuanced', correct: 'Having subtle differences and complexity', options: ['Having subtle differences and complexity', 'Being very simple', 'Having no differences', 'Being very obvious'] },
        { word: 'Conscientious', correct: 'Very careful and thorough in work', options: ['Very careful and thorough in work', 'Being very careless', 'Working very fast', 'Not caring about quality'] },
        { word: 'Mitigate', correct: 'To make something less severe', options: ['To make something less severe', 'To make things worse', 'To avoid all problems', 'To solve completely'] },
        { word: 'Pervasive', correct: 'Spreading widely throughout an area', options: ['Spreading widely throughout an area', 'Being very limited', 'Staying in one place', 'Being very small'] },
      ]
    },
    {
      level: 5, title: 'Expert', icon: '🏆', color: 'from-red-600 to-red-400',
      borderColor: 'border-red-800', bgColor: 'bg-red-900',
      desc: 'Expert level English mastery',
      questions: [
        { word: 'Juxtapose', correct: 'To place two things side by side for contrast', options: ['To place two things side by side for contrast', 'To mix things together', 'To separate two ideas', 'To ignore differences'] },
        { word: 'Equivocal', correct: 'Open to more than one meaning — uncertain', options: ['Open to more than one meaning — uncertain', 'Very clear and direct', 'Being very honest', 'Having one meaning only'] },
        { word: 'Ubiquitous', correct: 'Present everywhere at the same time', options: ['Present everywhere at the same time', 'Very rare and unusual', 'Found in one place only', 'Being very hidden'] },
        { word: 'Proliferate', correct: 'To increase rapidly in number', options: ['To increase rapidly in number', 'To decrease slowly', 'To stay the same', 'To disappear completely'] },
        { word: 'Dichotomy', correct: 'A division into two opposite things', options: ['A division into two opposite things', 'Three equal parts', 'A type of dictionary', 'A complex problem'] },
        { word: 'Esoteric', correct: 'Understood by only a small group', options: ['Understood by only a small group', 'Known by everyone', 'Very simple to understand', 'A type of language'] },
        { word: 'Tangential', correct: 'Only slightly connected to the main topic', options: ['Only slightly connected to the main topic', 'Directly related to topic', 'A mathematical term', 'Being very focused'] },
        { word: 'Superfluous', correct: 'More than what is needed — unnecessary', options: ['More than what is needed — unnecessary', 'Not enough of something', 'Very important and needed', 'Being very efficient'] },
        { word: 'Acrimonious', correct: 'Angry and bitter in manner or speech', options: ['Angry and bitter in manner or speech', 'Very friendly and kind', 'Being very polite', 'Feeling very happy'] },
        { word: 'Perspicacious', correct: 'Having a clear understanding of things', options: ['Having a clear understanding of things', 'Being very confused', 'Having poor judgment', 'Making bad decisions'] },
        { word: 'Inexorable', correct: 'Impossible to stop or prevent', options: ['Impossible to stop or prevent', 'Very easy to stop', 'Happening very slowly', 'Being very flexible'] },
        { word: 'Sycophant', correct: 'Someone who flatters powerful people for gain', options: ['Someone who flatters powerful people for gain', 'A type of scientist', 'A strong leader', 'Someone very honest'] },
        { word: 'Obfuscate', correct: 'To make something unclear and confusing', options: ['To make something unclear and confusing', 'To make things very clear', 'To simplify everything', 'To explain in detail'] },
        { word: 'Magnanimous', correct: 'Very generous and forgiving', options: ['Very generous and forgiving', 'Being very selfish', 'Feeling very angry', 'Being very strict'] },
        { word: 'Recalcitrant', correct: 'Stubbornly refusing to follow rules', options: ['Stubbornly refusing to follow rules', 'Very obedient and helpful', 'Being very flexible', 'Following all rules'] },
      ]
    },
  ]

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

  const startQuiz = (levelData) => {
    const picked = shuffle(levelData.questions).slice(0, 10)
    const withShuffledOptions = picked.map(q => ({ ...q, options: shuffle(q.options) }))
    setQuizQuestions(withShuffledOptions)
    setActiveLevel(levelData.level)
    setStage('quiz')
    setCurrentQ(0)
    setScore(0)
    setSelected(null)
    setShowAnswer(false)
  }

  const handleAnswer = (option) => {
    if (showAnswer) return
    setSelected(option)
    setShowAnswer(true)
    if (option === quizQuestions[currentQ].correct) {
      setScore(prev => prev + 1)
    }
  }

  const nextQuestion = () => {
    setSelected(null)
    setShowAnswer(false)
    if (currentQ + 1 < quizQuestions.length) {
      setCurrentQ(prev => prev + 1)
    } else {
      const finalScore = score + (selected === quizQuestions[currentQ].correct ? 1 : 0)
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
    <div className="min-h-screen bg-gray-950 text-white">

      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo size={18} />
          <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">BridgeVoice</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-400 hover:text-white transition text-sm">Dashboard</Link>
          <Link to="/dictionary" className="text-gray-400 hover:text-white transition text-sm">Dictionary</Link>
          <button
            onClick={() => { localStorage.clear(); navigate('/') }}
            className="bg-red-900 bg-opacity-50 hover:bg-opacity-80 text-red-400 px-4 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {stage === 'levels' && (
          <div>
            <div className="text-center mb-8">
              <p className="text-5xl mb-3">🧠</p>
              <h2 className="text-2xl font-bold">Vocabulary Quiz</h2>
              <p className="text-gray-400 mt-1">Progress through 5 levels of English mastery!</p>
              <p className="text-sm text-purple-400 mt-1">Score 8/10 or higher to unlock the next level</p>
            </div>

            <div className="space-y-4">
              {levels.map((level) => {
                const unlocked = isLevelUnlocked(level.level)
                const completed = completedLevels[level.level]
                return (
                  <div key={level.level} className={`bg-gray-900 rounded-2xl p-5 border ${unlocked ? level.borderColor : 'border-gray-800'} ${!unlocked && 'opacity-60'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${unlocked ? level.color : 'from-gray-700 to-gray-600'} flex items-center justify-center text-xl`}>
                          {unlocked ? level.icon : '🔒'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-200">Level {level.level} — {level.title}</p>
                          <p className="text-sm text-gray-500">{level.desc}</p>
                          {completed && (
                            <p className={`text-xs font-semibold mt-1 ${completed.passed ? 'text-green-400' : 'text-orange-400'}`}>
                              {completed.passed ? `✅ Passed with ${completed.score}/10` : `❌ Score: ${completed.score}/10 — Try again!`}
                            </p>
                          )}
                        </div>
                      </div>
                      {unlocked ? (
                        <button
                          onClick={() => startQuiz(level)}
                          className={`bg-gradient-to-r ${level.color} text-white px-4 py-2 rounded-xl hover:opacity-90 transition font-medium text-sm`}
                        >
                          {completed?.passed ? 'Retry' : 'Start'}
                        </button>
                      ) : (
                        <p className="text-sm text-gray-600">Pass Level {level.level - 1} first</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {stage === 'quiz' && quizQuestions.length > 0 && (
          <div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-400 text-sm">
                  Level {activeLevel} — {currentLevelData?.title} | Q{currentQ + 1}/10
                </p>
                <p className="text-purple-400 font-bold">Score: {score}</p>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${(currentQ / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className={`bg-gradient-to-br ${currentLevelData?.color} rounded-2xl p-8 mb-6 text-center`}>
              <p className="text-sm text-white text-opacity-80 mb-2">What does this word mean?</p>
              <div className="flex items-center justify-center gap-3">
                <h3 className="text-4xl font-bold text-white">{quizQuestions[currentQ].word}</h3>
                <button
                  onClick={() => speakWord(quizQuestions[currentQ].word)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition"
                >
                  🔊
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {quizQuestions[currentQ].options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition font-medium ${
                    !showAnswer
                      ? 'border-gray-700 bg-gray-900 hover:border-gray-500 text-gray-200'
                      : option === quizQuestions[currentQ].correct
                      ? 'border-green-500 bg-green-900 bg-opacity-30 text-green-300'
                      : option === selected
                      ? 'border-red-500 bg-red-900 bg-opacity-30 text-red-300'
                      : 'border-gray-800 bg-gray-900 text-gray-500'
                  }`}
                >
                  {option}
                  {showAnswer && option === quizQuestions[currentQ].correct && ' ✅'}
                  {showAnswer && option === selected && option !== quizQuestions[currentQ].correct && ' ❌'}
                </button>
              ))}
            </div>

            {showAnswer && (
              <button
                onClick={nextQuestion}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl transition font-bold"
              >
                {currentQ + 1 === 10 ? 'See Results 🎉' : 'Next Question →'}
              </button>
            )}
          </div>
        )}

        {stage === 'result' && (
          <div className="text-center">
            <p className="text-6xl mb-4">
              {finalScore >= 8 ? '🏆' : finalScore >= 5 ? '🌟' : '💪'}
            </p>
            <h2 className="text-2xl font-bold mb-2">Level {activeLevel} Complete!</h2>
            <div className={`text-6xl font-bold my-4 ${
              finalScore >= 8 ? 'text-green-400' :
              finalScore >= 5 ? 'text-orange-400' : 'text-red-400'
            }`}>
              {finalScore}/10
            </div>

            {finalScore >= 8 ? (
              <div className="bg-green-900 bg-opacity-30 border border-green-700 rounded-xl p-4 mb-6">
                <p className="text-green-400 font-bold text-lg">🎉 Level {activeLevel} Passed!</p>
                {activeLevel < 5 && (
                  <p className="text-green-300 text-sm mt-1">Level {activeLevel + 1} — {levels[activeLevel]?.title} is now unlocked!</p>
                )}
              </div>
            ) : (
              <div className="bg-orange-900 bg-opacity-30 border border-orange-700 rounded-xl p-4 mb-6">
                <p className="text-orange-400 font-bold">Need 8/10 to unlock next level</p>
                <p className="text-orange-300 text-sm mt-1">Keep practicing! You can do it! 💪</p>
              </div>
            )}

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">{finalScore}</p>
                  <p className="text-sm text-gray-500">Correct</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-400">{10 - finalScore}</p>
                  <p className="text-sm text-gray-500">Wrong</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-400">{finalScore * 10}%</p>
                  <p className="text-sm text-gray-500">Score</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStage('levels')}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl transition font-bold"
              >
                Back to Levels
              </button>
              <button
                onClick={() => startQuiz(levels.find(l => l.level === activeLevel))}
                className="flex-1 bg-gray-900 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white py-3 rounded-xl transition font-bold"
              >
                Try Again 🔄
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Quiz
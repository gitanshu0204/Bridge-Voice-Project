import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { fetchActivityLog, getRecentActivity, getTotalSessions, getOverallAvgScore } from '../utils/activityTracker'
import { getProgress } from '../utils/xpTracker'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [greeting, setGreeting] = useState('')
  const [totalXP, setTotalXP] = useState(0)
  const [streak, setStreak] = useState(0)
  const [totalSessions, setTotalSessions] = useState(0)
  const [avgScore, setAvgScore] = useState(0)
  const [recentSessions, setRecentSessions] = useState([])

  const tips = [
    'Practice speaking out loud every day, even if just for 5 minutes. Consistency beats duration!',
    'When you learn a new word, use it in 3 sentences immediately to remember it better.',
    'Canadians say "sorry" constantly — even when it\'s not their fault. Embrace it!',
    'Watch Canadian TV shows with subtitles to improve listening skills naturally.',
    'Don\'t be afraid to ask someone to repeat themselves — it\'s completely normal!',
    'A "double double" at Tim Hortons means 2 creams and 2 sugars — now you know!',
  ]

  const todayTip = tips[new Date().getDay() % tips.length]

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 17) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')

    const email = localStorage.getItem('email')
    if (!email) { navigate('/login'); return }

    fetch(`http://127.0.0.1:8000/api/users/profile?email=${email}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() => setUser({ full_name: 'User' }))

    getProgress().then(p => {
      setTotalXP(p.total_xp || 0)
      setStreak(p.streak || 0)
    })

    fetchActivityLog().then(log => {
      setTotalSessions(getTotalSessions(log))
      setAvgScore(getOverallAvgScore(log))
      setRecentSessions(getRecentActivity(log, 3))
    })
  }, [])

  const firstName = user?.full_name?.split(' ')[0] || 'User'

  const quickActions = [
    { icon: '🗣️', label: 'AI Chat', desc: 'Practice conversation', path: '/chat' },
    { icon: '🎯', label: 'Daily Challenge', desc: 'Earn XP today', path: '/daily' },
    { icon: '🎤', label: 'Pronunciation', desc: 'Score your speaking', path: '/pronunciation' },
    { icon: '💼', label: 'Interview Prep', desc: '60+ job types', path: '/interview' },
    { icon: '✍️', label: 'Grammar Check', desc: 'Fix your writing', path: '/grammar' },
    { icon: '🧠', label: 'Vocabulary Quiz', desc: '5 difficulty levels', path: '/quiz' },
    { icon: '🌍', label: 'Translator', desc: '15+ languages', path: '/translator' },
    { icon: '📖', label: 'Dictionary', desc: '170K+ words', path: '/dictionary' },
  ]

  const scenarios = [
    { icon: '💼', title: 'Job Interview', desc: 'Practice interview questions', students: '2.3k', path: '/interview' },
    { icon: '🛒', title: 'Grocery Store', desc: 'Everyday shopping vocabulary', students: '1.8k', path: '/chat' },
    { icon: '🏥', title: 'Doctor Visit', desc: 'Medical conversations', students: '1.2k', path: '/chat' },
    { icon: '🏦', title: 'Bank Visit', desc: 'Banking conversations', students: '980', path: '/chat' },
    { icon: '🏢', title: 'Workplace Chat', desc: 'Professional office talk', students: '1.5k', path: '/chat' },
    { icon: '🤝', title: 'Making Friends', desc: 'Casual social conversations', students: '2.1k', path: '/chat' },
  ]

  const getLevel = (xp) => {
    if (xp >= 1000) return { level: 10, title: 'Master' }
    if (xp >= 500) return { level: 7, title: 'Advanced' }
    if (xp >= 300) return { level: 5, title: 'Intermediate' }
    if (xp >= 100) return { level: 3, title: 'Elementary' }
    return { level: 1, title: 'Beginner' }
  }

  const userLevel = getLevel(totalXP)

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Hero Welcome Banner */}
        <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 opacity-80"></div>
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-600 rounded-full filter blur-3xl opacity-5"></div>
          <div className="relative p-8 flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm mb-1">{greeting} 👋</p>
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome back, <span className="text-purple-400">{firstName}!</span>
              </h2>
              <p className="text-gray-400 text-sm mb-5">
                {streak > 0
                  ? `You're on a 🔥 ${streak} day streak! Keep it up to unlock new badges.`
                  : 'Start practicing today to build your streak!'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/chat')}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-lg shadow-purple-900/40 flex items-center gap-2"
                >
                  🗣️ Start Practicing
                </button>
                <button
                  onClick={() => navigate('/daily')}
                  className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
                >
                  🎯 Daily Challenge
                </button>
              </div>
            </div>
            <div className="hidden md:block text-right">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl flex flex-col items-center justify-center shadow-xl mx-auto mb-2">
                <p className="text-2xl">🏅</p>
                <p className="text-white text-xs font-bold">Lv.{userLevel.level}</p>
              </div>
              <p className="text-gray-500 text-xs">{userLevel.title}</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '🔥', value: streak, label: 'Day Streak', sub: streak > 0 ? 'Keep going!' : 'Start today' },
            { icon: '⭐', value: totalXP, label: 'Total XP', sub: `Level ${userLevel.level}` },
            { icon: '🎯', value: totalSessions, label: 'Sessions', sub: 'All time' },
            { icon: '📊', value: totalSessions > 0 ? `${avgScore}%` : '—', label: 'Avg Score', sub: totalSessions > 0 ? 'All time' : 'No data yet' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition">
              <p className="text-2xl mb-2">{stat.icon}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
              <p className="text-gray-600 text-xs mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <p className="font-bold text-white">Quick Actions</p>
            <p className="text-gray-500 text-xs mt-0.5">Jump into any feature instantly</p>
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-800 hover:border-purple-700 hover:bg-purple-900 hover:bg-opacity-10 transition group text-left"
              >
                <span className="text-xl group-hover:scale-110 transition flex-shrink-0">{action.icon}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-200 text-sm group-hover:text-white transition truncate">{action.label}</p>
                  <p className="text-gray-600 text-xs truncate">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Practice Scenarios + Recent Sessions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Practice Scenarios */}
          <div className="md:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <p className="font-bold text-white">Practice Scenarios</p>
              <button
                onClick={() => navigate('/chat')}
                className="text-purple-400 hover:text-purple-300 text-xs transition"
              >
                View all →
              </button>
            </div>
            <div className="p-4 grid grid-cols-2 gap-2">
              {scenarios.map((s, i) => (
                <button
                  key={i}
                  onClick={() => navigate(s.path)}
                  className="flex items-start gap-3 p-3 rounded-xl border border-gray-800 hover:border-gray-700 hover:bg-gray-800 transition text-left group"
                >
                  <div className="w-9 h-9 bg-purple-600 bg-opacity-20 border border-purple-800 rounded-lg flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition">
                    {s.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-200 text-xs group-hover:text-white transition">{s.title}</p>
                    <p className="text-gray-600 text-xs mt-0.5 truncate">{s.desc}</p>
                    <p className="text-purple-500 text-xs mt-1">{s.students} practicing</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">

            {/* Recent Sessions */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800">
                <p className="font-bold text-white text-sm">Recent Sessions</p>
              </div>
              {recentSessions.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-2xl mb-2 opacity-30">📋</p>
                  <p className="text-gray-600 text-xs">No sessions yet — complete an activity to see it here!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {recentSessions.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3">
                      <span className="text-lg">{s.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-300 text-xs font-medium truncate">{s.action}</p>
                        <p className="text-gray-600 text-xs truncate">{s.scenario} • {s.time}</p>
                      </div>
                      <span className={`text-xs font-bold flex-shrink-0 ${
                        parseInt(s.score) >= 85 ? 'text-green-400' :
                        parseInt(s.score) >= 70 ? 'text-yellow-400' : 'text-red-400'
                      }`}>{s.score}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="px-5 py-3 border-t border-gray-800">
                <button
                  onClick={() => navigate('/progress')}
                  className="text-purple-400 hover:text-purple-300 text-xs transition"
                >
                  View all progress →
                </button>
              </div>
            </div>

            {/* Tip of the Day */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                <p className="font-bold text-white text-sm">Tip of the Day</p>
              </div>
              <div className="p-5">
                <div className="relative pl-3 border-l-2 border-purple-600">
                  <p className="text-gray-400 text-xs leading-relaxed">"{todayTip}"</p>
                </div>
                <div className="mt-4 space-y-1.5">
                  {[
                    { icon: '🎯', text: 'Complete your daily challenge', path: '/daily' },
                    { icon: '🎤', text: 'Try pronunciation scorer', path: '/pronunciation' },
                    { icon: '📖', text: 'Learn 3 new words today', path: '/dictionary' },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => navigate(item.path)}
                      className="w-full flex items-center gap-2 text-left hover:bg-gray-800 px-2 py-1.5 rounded-lg transition"
                    >
                      <span className="text-sm">{item.icon}</span>
                      <p className="text-gray-500 text-xs hover:text-gray-300 transition">{item.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  )
}

export default Dashboard
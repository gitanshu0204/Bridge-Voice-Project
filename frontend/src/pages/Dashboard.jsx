import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const email = localStorage.getItem('email')
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetch(`http://127.0.0.1:8000/api/users/profile?email=${email}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.log(err))

    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good Morning')
    else if (hour < 17) setGreeting('Good Afternoon')
    else setGreeting('Good Evening')
  }, [])

  const quickActions = [
    { icon: '🗣️', label: 'Start AI Chat', desc: 'Practice conversation', to: '/chat', color: 'from-purple-600 to-blue-600' },
    { icon: '🎯', label: 'Daily Challenge', desc: 'Earn bonus XP', to: '/daily', color: 'from-orange-600 to-red-600' },
    { icon: '🎤', label: 'Pronunciation', desc: 'Score your speaking', to: '/pronunciation', color: 'from-green-600 to-teal-600' },
    { icon: '💼', label: 'Interview Prep', desc: '60+ job types', to: '/interview', color: 'from-blue-600 to-cyan-600' },
  ]

  const scenarios = [
    { title: 'Job Interview', icon: '💼', desc: 'Practice interview questions', color: 'from-purple-600 to-purple-800', students: '2.3k' },
    { title: 'Grocery Store', icon: '🛒', desc: 'Everyday shopping vocabulary', color: 'from-blue-600 to-blue-800', students: '1.8k' },
    { title: 'Doctor Visit', icon: '🏥', desc: 'Medical conversations', color: 'from-red-600 to-red-800', students: '1.2k' },
    { title: 'Bank Visit', icon: '🏦', desc: 'Banking conversations', color: 'from-yellow-600 to-yellow-800', students: '980' },
    { title: 'Workplace Chat', icon: '🏢', desc: 'Professional office talk', color: 'from-green-600 to-green-800', students: '1.5k' },
    { title: 'Making Friends', icon: '🤝', desc: 'Casual social conversations', color: 'from-pink-600 to-pink-800', students: '2.1k' },
  ]

  const stats = [
    { label: 'Day Streak', value: '🔥 7', color: 'text-orange-400', bg: 'bg-orange-900 bg-opacity-20 border-orange-800' },
    { label: 'Total XP', value: '340', color: 'text-purple-400', bg: 'bg-purple-900 bg-opacity-20 border-purple-800' },
    { label: 'Sessions', value: '12', color: 'text-blue-400', bg: 'bg-blue-900 bg-opacity-20 border-blue-800' },
    { label: 'Level', value: 'Inter...', color: 'text-green-400', bg: 'bg-green-900 bg-opacity-20 border-green-800' },
  ]

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-gray-900 rounded-3xl p-8 overflow-hidden border border-purple-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-700 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-blue-700 rounded-full filter blur-3xl opacity-20"></div>
          <div className="relative">
            <p className="text-purple-300 font-medium mb-1">{greeting}! 👋</p>
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome back, <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{user?.full_name?.split(' ')[0] || 'Learner'}</span>!
            </h2>
            <p className="text-gray-400 mb-6">You are on a 7 day streak! Keep it up to unlock new badges 🏆</p>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => navigate('/chat')}
                className="bg-white text-gray-900 px-5 py-2.5 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg text-sm"
              >
                🗣️ Start Practicing
              </button>
              <button
                onClick={() => navigate('/daily')}
                className="bg-white bg-opacity-10 hover:bg-opacity-20 text-white border border-white border-opacity-20 px-5 py-2.5 rounded-xl font-medium transition text-sm"
              >
                🎯 Daily Challenge
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className={`border rounded-2xl p-4 text-center ${stat.bg} transition hover:scale-105`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-bold text-gray-200 mb-4">⚡ Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.to)}
                className={`bg-gradient-to-br ${action.color} rounded-2xl p-5 text-left hover:opacity-90 hover:shadow-xl transition group`}
              >
                <p className="text-3xl mb-3 group-hover:scale-110 transition">{action.icon}</p>
                <p className="font-bold text-white text-sm">{action.label}</p>
                <p className="text-white text-opacity-70 text-xs mt-1">{action.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Daily Goal */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-gray-200">📅 Daily Goal</h3>
              <p className="text-gray-500 text-sm mt-1">Complete 3 sessions today</p>
            </div>
            <span className="text-purple-400 font-bold text-sm bg-purple-900 bg-opacity-30 border border-purple-800 px-3 py-1 rounded-full">1/3 done</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all" style={{ width: '33%' }}></div>
          </div>
          <p className="text-gray-600 text-xs">Complete 2 more sessions to reach your daily goal and earn 50 bonus XP!</p>
        </div>

        {/* Practice Scenarios */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-200">🎭 Practice Scenarios</h3>
            <p className="text-gray-500 text-sm">Click any to start</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scenarios.map((scenario, i) => (
              <button
                key={i}
                onClick={() => navigate('/chat')}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-left hover:border-gray-600 hover:shadow-xl transition group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${scenario.color} opacity-0 group-hover:opacity-10 transition`}></div>
                <div className={`w-12 h-12 bg-gradient-to-br ${scenario.color} rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition`}>
                  {scenario.icon}
                </div>
                <p className="font-semibold text-white">{scenario.title}</p>
                <p className="text-sm text-gray-400 mt-1">{scenario.desc}</p>
                <p className="text-xs text-purple-400 mt-2">{scenario.students} students practicing</p>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Badges */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="font-bold text-gray-200 mb-4">🏆 Recent Badges</h3>
            <div className="space-y-3">
              {[
                { badge: '🌟', name: 'First Session', color: 'from-yellow-600 to-yellow-800' },
                { badge: '🔥', name: '7 Day Streak', color: 'from-orange-600 to-orange-800' },
                { badge: '💬', name: '10 Chats', color: 'from-blue-600 to-blue-800' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-xl`}>
                    {item.badge}
                  </div>
                  <p className="text-gray-300 text-sm font-medium">{item.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="font-bold text-gray-200 mb-4">📅 Recent Sessions</h3>
            <div className="space-y-3">
              {[
                { scenario: 'Job Interview', date: 'Today', score: 85, color: 'text-green-400' },
                { scenario: 'Grocery Store', date: 'Yesterday', score: 92, color: 'text-green-400' },
                { scenario: 'Doctor Visit', date: '2 days ago', score: 78, color: 'text-orange-400' },
              ].map((session, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-300 text-sm">{session.scenario}</p>
                    <p className="text-xs text-gray-500">{session.date}</p>
                  </div>
                  <span className={`font-bold text-sm ${session.color}`}>{session.score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Tips */}
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 border border-purple-700 rounded-2xl p-5">
            <h3 className="font-bold text-white mb-4">💡 Tip of the Day</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              "Practice speaking out loud every day, even if just for 5 minutes. Consistency is more important than duration!"
            </p>
            <div className="space-y-2">
              {[
                '🎯 Complete your daily challenge',
                '🎤 Try pronunciation scorer',
                '📖 Learn 3 new words today',
              ].map((tip, i) => (
                <p key={i} className="text-purple-200 text-xs flex items-center gap-2">{tip}</p>
              ))}
            </div>
          </div>

        </div>

      </div>
    </Layout>
  )
}

export default Dashboard
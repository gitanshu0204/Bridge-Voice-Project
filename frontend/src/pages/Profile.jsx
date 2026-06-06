import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email')
    if (!token) {
      navigate('/login')
      return
    }
    fetch(`http://127.0.0.1:8000/api/users/profile?email=${email}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.log(err))
  }, [])

  if (!user) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex gap-2">
        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  )

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">

        <div className="mb-6">
          <h2 className="text-2xl font-bold">👤 Profile</h2>
          <p className="text-gray-400 mt-1">Your personal information and achievements</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-3xl font-bold">
              {user.full_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user.full_name}</h2>
              <p className="text-gray-400">{user.email}</p>
              <span className="inline-block mt-2 bg-purple-900 bg-opacity-50 border border-purple-700 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                {user.proficiency_level || 'Beginner'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Native Language</p>
              <p className="font-semibold text-white">{user.language_background || 'Not set'}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">English Level</p>
              <p className="font-semibold text-white">{user.proficiency_level || 'Not set'}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Learning Goal</p>
              <p className="font-semibold text-white">{user.goals || 'Not set'}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-200 mb-4">📊 Your Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '12', label: 'Total Sessions', color: 'text-blue-400' },
              { value: '🔥 7', label: 'Day Streak', color: 'text-orange-400' },
              { value: '340', label: 'Total XP', color: 'text-purple-400' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-200 mb-4">🏆 Badges</h3>
          <div className="flex gap-3 flex-wrap">
            {[
              { badge: '🌟', name: 'First Session', desc: 'Completed first conversation' },
              { badge: '🔥', name: '7 Day Streak', desc: 'Practiced 7 days in a row' },
              { badge: '💬', name: '10 Chats', desc: 'Completed 10 conversations' },
              { badge: '🍁', name: 'Canada Ready', desc: 'Completed culture module' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center w-28">
                <p className="text-3xl">{item.badge}</p>
                <p className="text-xs font-semibold text-gray-300 mt-1">{item.name}</p>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-200 mb-4">⚙️ Quick Links</h3>
          <div className="space-y-3">
            {[
              { icon: '⚙️', label: 'Settings', to: '/settings' },
              { icon: '💼', label: 'Interview Simulator', to: '/interview' },
              { icon: '👥', label: 'Community', to: '/community' },
              { icon: '📊', label: 'Progress', to: '/progress' },
            ].map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-700 hover:border-gray-500 hover:bg-gray-800 transition text-gray-300 hover:text-white"
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                <span className="ml-auto text-gray-600">→</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default Profile
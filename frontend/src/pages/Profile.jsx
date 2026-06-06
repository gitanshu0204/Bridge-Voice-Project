import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || null)
  const [activeTab, setActiveTab] = useState('overview')
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef(null)

  const stats = [
    { label: 'Total Sessions', value: '15', icon: '🎯', color: 'from-purple-600 to-purple-400' },
    { label: 'Day Streak', value: '🔥 7', icon: '⚡', color: 'from-orange-600 to-orange-400' },
    { label: 'Total XP', value: '340', icon: '⭐', color: 'from-yellow-600 to-yellow-400' },
    { label: 'Avg Score', value: '83%', icon: '📊', color: 'from-green-600 to-green-400' },
    { label: 'Words Learned', value: '124', icon: '📖', color: 'from-blue-600 to-blue-400' },
    { label: 'Badges', value: '4', icon: '🏆', color: 'from-pink-600 to-pink-400' },
  ]

  const badges = [
    { badge: '🌟', name: 'First Session', desc: 'Completed first conversation', earned: true, date: 'May 28' },
    { badge: '🔥', name: '7 Day Streak', desc: 'Practiced 7 days in a row', earned: true, date: 'June 3' },
    { badge: '💬', name: '10 Chats', desc: 'Completed 10 conversations', earned: true, date: 'June 4' },
    { badge: '🍁', name: 'Canada Ready', desc: 'Completed culture module', earned: true, date: 'June 5' },
    { badge: '🏆', name: '30 Day Streak', desc: 'Practice 30 days in a row', earned: false, date: '' },
    { badge: '🧠', name: 'Quiz Master', desc: 'Pass all 5 quiz levels', earned: false, date: '' },
    { badge: '💼', name: 'Interview Pro', desc: 'Complete 10 interviews', earned: false, date: '' },
    { badge: '🎤', name: 'Pronunciation Pro', desc: 'Score 90%+ on pronunciation', earned: false, date: '' },
  ]

  const recentActivity = [
    { icon: '🗣️', action: 'Completed AI Chat', scenario: 'Job Interview', score: '85%', time: 'Today' },
    { icon: '🎯', action: 'Daily Challenge', scenario: 'Speaking Challenge', score: '78%', time: 'Today' },
    { icon: '🎤', action: 'Pronunciation Practice', scenario: 'Intermediate Level', score: '82%', time: 'Yesterday' },
    { icon: '🧠', action: 'Vocabulary Quiz', scenario: 'Level 3 — Intermediate', score: '90%', time: 'Yesterday' },
    { icon: '✍️', action: 'Grammar Check', scenario: 'Workplace Email', score: '95%', time: '2 days ago' },
  ]

  useEffect(() => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email')
    if (!token) {
      navigate('/login')
      return
    }
    fetch(`http://127.0.0.1:8000/api/users/profile?email=${email}`)
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setEditData(data)
      })
      .catch(err => console.log(err))
  }, [])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be smaller than 2MB!')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      setProfilePic(reader.result)
      localStorage.setItem('profilePic', reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    setUser({ ...user, ...editData })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const removePhoto = () => {
    setProfilePic(null)
    localStorage.removeItem('profilePic')
  }

  if (!user) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex gap-2">
        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  )

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Success Toast */}
        {saved && (
          <div className="fixed top-6 right-6 z-50 bg-green-900 border border-green-700 text-green-300 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <span className="text-xl">✅</span>
            <p className="font-semibold">Profile updated successfully!</p>
          </div>
        )}

        {/* Profile Header - 3D Card */}
        <div className="relative transform hover:scale-[1.01] transition duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 border border-purple-700 rounded-3xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-700 rounded-full filter blur-3xl opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-700 rounded-full filter blur-3xl opacity-10"></div>

            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">

              {/* Profile Picture */}
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-500 shadow-2xl shadow-purple-900">
                  {profilePic ? (
                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-4xl font-bold text-white">
                      {user.full_name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 w-9 h-9 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition border-2 border-gray-900"
                >
                  📷
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                {editing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editData.full_name || ''}
                      onChange={e => setEditData({ ...editData, full_name: e.target.value })}
                      className="bg-gray-800 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition w-full"
                      placeholder="Full Name"
                    />
                    <input
                      type="text"
                      value={editData.goals || ''}
                      onChange={e => setEditData({ ...editData, goals: e.target.value })}
                      className="bg-gray-800 border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition w-full"
                      placeholder="Your Goal"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                      >
                        ✅ Save
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="bg-gray-800 border border-gray-700 text-gray-400 px-4 py-2 rounded-xl text-sm transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-3xl font-bold text-white mb-1">{user.full_name}</h2>
                    <p className="text-gray-400 mb-3">{user.email}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                      <span className="bg-purple-900 bg-opacity-50 border border-purple-700 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                        {user.proficiency_level || 'Beginner'}
                      </span>
                      <span className="bg-blue-900 bg-opacity-50 border border-blue-700 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                        🍁 Ontario, Canada
                      </span>
                      <span className="bg-green-900 bg-opacity-50 border border-green-700 text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                        🔥 7 Day Streak
                      </span>
                    </div>
                    <div className="flex gap-3 justify-center md:justify-start">
                      <button
                        onClick={() => setEditing(true)}
                        className="bg-gray-800 border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                      >
                        ✏️ Edit Profile
                      </button>
                      {profilePic && (
                        <button
                          onClick={removePhoto}
                          className="bg-red-900 bg-opacity-30 border border-red-800 text-red-400 hover:text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                        >
                          🗑️ Remove Photo
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Level Badge */}
              <div className="flex-shrink-0 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl flex flex-col items-center justify-center shadow-xl shadow-orange-900 hover:scale-110 transition">
                  <p className="text-2xl">🏅</p>
                  <p className="text-white text-xs font-bold mt-1">Level 5</p>
                </div>
                <p className="text-gray-500 text-xs mt-2">340 XP</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-3 text-center hover:border-gray-600 hover:scale-105 transition group">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-xl mx-auto mb-2 group-hover:scale-110 transition shadow-lg`}>
                {stat.icon}
              </div>
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'overview', label: '👤 Overview' },
            { id: 'badges', label: '🏆 Badges' },
            { id: 'activity', label: '📅 Activity' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-medium transition text-sm ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Learning Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-gray-200 text-lg">📚 Learning Profile</h3>
              {[
                { label: 'Native Language', value: user.language_background || 'Not set', icon: '🌍' },
                { label: 'English Level', value: user.proficiency_level || 'Not set', icon: '📊' },
                { label: 'Learning Goal', value: user.goals || 'Not set', icon: '🎯' },
                { label: 'Member Since', value: 'May 2026', icon: '📅' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 hover:border-gray-600 transition">
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="font-semibold text-white text-sm mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly Progress */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold text-gray-200 text-lg mb-4">📈 This Week</h3>
              <div className="space-y-3">
                {[
                  { label: 'Sessions Completed', value: 5, max: 7, color: 'from-purple-600 to-blue-600' },
                  { label: 'Daily Challenges', value: 3, max: 7, color: 'from-orange-600 to-red-600' },
                  { label: 'Quiz Questions', value: 20, max: 30, color: 'from-green-600 to-teal-600' },
                  { label: 'Pronunciation Score', value: 82, max: 100, color: 'from-blue-600 to-cyan-600' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <p className="text-gray-400 text-xs">{item.label}</p>
                      <p className="text-gray-300 text-xs font-medium">{item.value}/{item.max}</p>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all`}
                        style={{ width: `${(item.value / item.max) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700 rounded-xl p-4 text-center">
                <p className="text-purple-300 text-sm font-semibold">🎯 Daily Goal Progress</p>
                <p className="text-white text-2xl font-bold mt-1">1/3 sessions</p>
                <p className="text-gray-400 text-xs mt-1">Complete 2 more today!</p>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'badges' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((item, i) => (
                <div
                  key={i}
                  className={`rounded-2xl p-5 text-center border transition hover:scale-105 ${
                    item.earned
                      ? 'bg-gray-900 border-gray-700 hover:border-purple-600 shadow-lg'
                      : 'bg-gray-900 border-gray-800 opacity-50'
                  }`}
                >
                  <p className={`text-4xl mb-3 ${!item.earned && 'grayscale'}`}>{item.badge}</p>
                  <p className="font-bold text-white text-sm">{item.name}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
                  {item.earned ? (
                    <p className="text-green-400 text-xs mt-2 font-medium">✅ Earned {item.date}</p>
                  ) : (
                    <p className="text-gray-600 text-xs mt-2">🔒 Not yet earned</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-200 mb-4">📅 Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-200 text-sm">{item.action}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{item.scenario} • {item.time}</p>
                  </div>
                  <span className={`font-bold text-sm ${
                    parseInt(item.score) >= 85 ? 'text-green-400' :
                    parseInt(item.score) >= 70 ? 'text-orange-400' : 'text-red-400'
                  }`}>{item.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}

export default Profile
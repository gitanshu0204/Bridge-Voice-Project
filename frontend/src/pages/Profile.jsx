import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { fetchActivityLog, getRecentActivity, getTotalSessions, getOverallAvgScore } from '../utils/activityTracker'
import { getProgress } from '../utils/xpTracker'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [profilePic, setProfilePic] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef(null)

  const [totalXP, setTotalXP] = useState(0)
  const [streak, setStreak] = useState(0)
  const [totalSessions, setTotalSessions] = useState(0)
  const [overallAvgScore, setOverallAvgScore] = useState(0)
  const [recentActivity, setRecentActivity] = useState([])
  const [fullLog, setFullLog] = useState([])
  const [wordCount, setWordCount] = useState(0)

  const stats = [
    { label: 'Sessions', value: totalSessions, icon: '🎯' },
    { label: 'Day Streak', value: `🔥 ${streak}`, icon: '⚡' },
    { label: 'Total XP', value: totalXP, icon: '⭐' },
    { label: 'Avg Score', value: totalSessions > 0 ? `${overallAvgScore}%` : '—', icon: '📊' },
    { label: 'Words', value: wordCount, icon: '📖' },
    { label: 'Badges', value: '4', icon: '🏆' },
  ]

  const quizLevels = JSON.parse(localStorage.getItem('quizLevels') || '{}')
  const allQuizLevelsPassed = [1, 2, 3, 4, 5].every(lvl => quizLevels[lvl]?.passed)
  const interviewCount = fullLog.filter(e => e.type === 'interview').length
  const hasHighPronunciation = fullLog.some(e => e.type === 'pronunciation' && e.score >= 90)
  const hasFirstActivity = fullLog.length > 0

  const badges = [
    { badge: '🌟', name: 'First Session', desc: 'Completed your first scored activity', earned: hasFirstActivity, date: hasFirstActivity ? 'Earned' : '' },
    { badge: '🔥', name: '7 Day Streak', desc: 'Practiced 7 days in a row', earned: streak >= 7, date: streak >= 7 ? 'Earned' : '' },
    { badge: '🎯', name: '10 Sessions', desc: 'Completed 10 scored activities', earned: totalSessions >= 10, date: totalSessions >= 10 ? 'Earned' : '' },
    { badge: '🏆', name: '30 Day Streak', desc: 'Practice 30 days in a row', earned: streak >= 30, date: streak >= 30 ? 'Earned' : '' },
    { badge: '🧠', name: 'Quiz Master', desc: 'Pass all 5 quiz levels', earned: allQuizLevelsPassed, date: allQuizLevelsPassed ? 'Earned' : '' },
    { badge: '💼', name: 'Interview Pro', desc: 'Complete 10 interviews', earned: interviewCount >= 10, date: interviewCount >= 10 ? 'Earned' : '' },
    { badge: '🎤', name: 'Pronunciation Pro', desc: 'Score 90%+ on pronunciation', earned: hasHighPronunciation, date: hasHighPronunciation ? 'Earned' : '' },
  ]

  const earnedBadgeCount = badges.filter(b => b.earned).length

  const getWeeklyProgress = (log) => {
    const days = []
    const today = new Date()
    const currentDayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Calculate Monday of this week
    const monday = new Date(today)
    const diffToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek
    monday.setDate(today.getDate() + diffToMonday)

    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      const dateStr = d.toISOString().split('T')[0]
      const hasActivity = log.some(e => e.date === dateStr)
      days.push({ day: dayLabels[i], done: hasActivity })
    }
    return days
  }

  const weeklyProgress = getWeeklyProgress(fullLog)

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
        if (data.profile_picture) {
          setProfilePic(data.profile_picture)
        }
      })
      .catch(err => console.log(err))

    getProgress().then(p => {
      setTotalXP(p.total_xp || 0)
      setStreak(p.streak || 0)
    })

    fetchActivityLog().then(log => {
      setTotalSessions(getTotalSessions(log))
      setOverallAvgScore(getOverallAvgScore(log))
      setRecentActivity(getRecentActivity(log, 5))
      setFullLog(log)
    })

    fetch(`http://127.0.0.1:8000/api/dictionary/count?email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => setWordCount(data.unique_words || 0))
      .catch(() => setWordCount(0))
  }, [])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB!')
      return
    }
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result
      setProfilePic(base64)

      const email = localStorage.getItem('email')
      try {
        await fetch(`http://127.0.0.1:8000/api/users/profile?email=${encodeURIComponent(email)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile_picture: base64 })
        })
      } catch (err) {
        console.log('Could not save profile picture', err)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    setUser({ ...user, ...editData })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const removePhoto = async () => {
    setProfilePic(null)

    const email = localStorage.getItem('email')
    try {
      await fetch(`http://127.0.0.1:8000/api/users/profile?email=${encodeURIComponent(email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_picture: '' })
      })
    } catch (err) {
      console.log('Could not remove profile picture', err)
    }
  }

  const getLevel = (xp) => {
    if (xp >= 1000) return { level: 10, title: 'Master' }
    if (xp >= 500) return { level: 7, title: 'Advanced' }
    if (xp >= 300) return { level: 5, title: 'Intermediate' }
    if (xp >= 100) return { level: 3, title: 'Elementary' }
    return { level: 1, title: 'Beginner' }
  }

  const userLevel = getLevel(totalXP)
  const nextLevelXP = userLevel.level >= 10 ? 1000 : [100, 200, 300, 500, 700, 1000][userLevel.level - 1]
  const xpProgress = Math.min((totalXP / nextLevelXP) * 100, 100)

  if (!user) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Success Toast */}
        {saved && (
          <div className="fixed top-6 right-6 z-50 bg-green-900 border border-green-700 text-green-300 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <span>✅</span>
            <p className="font-semibold text-sm">Profile updated successfully!</p>
          </div>
        )}

        {/* Hero */}
        <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 opacity-60"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
          <div className="relative p-8 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Your Profile</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">My Profile</h2>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                Track your English learning journey, manage your account and view your achievements.
              </p>
              <div className="flex items-center gap-4 mt-4">
                {[
                  { value: `Level ${userLevel.level}`, label: userLevel.title },
                  { value: `${totalXP} XP`, label: 'Earned' },
                  { value: `🔥 ${streak}`, label: 'Day Streak' },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-lg font-bold text-purple-400">{stat.value}</p>
                    <p className="text-gray-500 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block text-8xl opacity-10">👤</div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-purple-700 shadow-xl shadow-purple-900/30">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-3xl font-bold text-white">
                    {user.full_name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 hover:bg-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg transition text-sm"
              >
                📷
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              {editing ? (
                <div className="space-y-3 max-w-sm">
                  <input
                    type="text"
                    value={editData.full_name || ''}
                    onChange={e => setEditData({ ...editData, full_name: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition text-sm"
                    placeholder="Full Name"
                  />
                  <input
                    type="text"
                    value={editData.goals || ''}
                    onChange={e => setEditData({ ...editData, goals: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition text-sm"
                    placeholder="Your Goal"
                  />
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition">
                      Save
                    </button>
                    <button onClick={() => setEditing(false)} className="border border-gray-700 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-sm transition">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-1">{user.full_name}</h3>
                  <p className="text-gray-500 text-sm mb-3">{user.email}</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    <span className="bg-purple-900 bg-opacity-40 border border-purple-800 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
                      {user.proficiency_level || 'Beginner'}
                    </span>
                    <span className="bg-gray-800 border border-gray-700 text-gray-400 px-3 py-1 rounded-full text-xs font-medium">
                      🍁 Ontario, Canada
                    </span>
                    <span className="bg-gray-800 border border-gray-700 text-gray-400 px-3 py-1 rounded-full text-xs font-medium">
                      🌍 {user.language_background || 'Not set'}
                    </span>
                  </div>
                  <div className="flex gap-2 justify-center md:justify-start">
                    <button
                      onClick={() => setEditing(true)}
                      className="border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white px-4 py-2 rounded-xl text-xs font-medium transition"
                    >
                      ✏️ Edit Profile
                    </button>
                    {profilePic && (
                      <button
                        onClick={removePhoto}
                        className="border border-gray-800 text-gray-600 hover:text-red-400 hover:border-red-800 px-4 py-2 rounded-xl text-xs font-medium transition"
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
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl flex flex-col items-center justify-center shadow-xl shadow-orange-900/30 hover:scale-105 transition mx-auto mb-2">
                <p className="text-xl">🏅</p>
                <p className="text-white text-xs font-bold">Lv.{userLevel.level}</p>
              </div>
              <p className="text-gray-500 text-xs">{userLevel.title}</p>
              <div className="mt-2 w-16 bg-gray-800 rounded-full h-1.5 overflow-hidden mx-auto">
                <div
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 h-1.5 rounded-full transition-all"
                  style={{ width: `${xpProgress}%` }}
                ></div>
              </div>
              <p className="text-gray-600 text-xs mt-1">{totalXP}/{nextLevelXP} XP</p>
            </div>
          </div>

          {/* Weekly Streak */}
          <div className="border-t border-gray-800 px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">This Week</p>
              <p className="text-xs text-purple-400">🔥 {streak} day streak</p>
            </div>
            <div className="flex gap-2">
              {weeklyProgress.map((day, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-full h-8 rounded-lg flex items-center justify-center text-xs transition ${
                    day.done
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 border border-gray-700 text-gray-600'
                  }`}>
                    {day.done ? '✓' : '·'}
                  </div>
                  <p className="text-xs text-gray-600">{day.day}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center hover:border-gray-700 transition">
              <p className="text-xl mb-1">{stat.icon}</p>
              <p className="text-lg font-bold text-white">{stat.label === 'Badges' ? earnedBadgeCount : stat.value}</p>
              <p className="text-gray-600 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-1.5 flex gap-1">
          {[
            { id: 'overview', label: '👤 Overview' },
            { id: 'badges', label: '🏆 Badges' },
            { id: 'activity', label: '📅 Activity' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Learning Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800">
                <p className="font-bold text-white text-sm">📚 Learning Profile</p>
              </div>
              <div className="divide-y divide-gray-800">
                {[
                  { label: 'Native Language', value: user.language_background || 'Not set', icon: '🌍' },
                  { label: 'English Level', value: user.proficiency_level || 'Not set', icon: '📊' },
                  { label: 'Learning Goal', value: user.goals || 'Not set', icon: '🎯' },
                  { label: 'Member Since', value: 'May 2026', icon: '📅' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-800 transition">
                    <span className="text-lg">{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="font-semibold text-white text-sm mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Preview */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center">
                <p className="font-bold text-white text-sm">📅 Recent Activity</p>
                {recentActivity.length > 0 && (
                  <button
                    onClick={() => setActiveTab('activity')}
                    className="text-purple-400 hover:text-purple-300 text-xs transition"
                  >
                    View all →
                  </button>
                )}
              </div>
              {recentActivity.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-3xl mb-2 opacity-30">📋</p>
                  <p className="text-gray-600 text-xs">No activity yet — complete a quiz, grammar check, pronunciation or interview to see it here!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {recentActivity.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3">
                      <div className="w-9 h-9 bg-purple-600 bg-opacity-20 border border-purple-800 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-200 text-sm">{item.action}</p>
                        <p className="text-gray-500 text-xs mt-0.5 truncate">{item.scenario} • {item.time}</p>
                      </div>
                      <span className={`font-bold text-sm flex-shrink-0 ${
                        parseInt(item.score) >= 85 ? 'text-green-400' :
                        parseInt(item.score) >= 70 ? 'text-yellow-400' : 'text-red-400'
                      }`}>{item.score}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {badges.map((item, i) => (
              <div
                key={i}
                className={`bg-gray-900 border rounded-2xl p-5 text-center transition hover:scale-105 ${
                  item.earned
                    ? 'border-gray-700 hover:border-purple-700'
                    : 'border-gray-800 opacity-50'
                }`}
              >
                <p className={`text-4xl mb-3 ${!item.earned && 'grayscale'}`}>{item.badge}</p>
                <p className="font-bold text-white text-sm">{item.name}</p>
                <p className="text-gray-500 text-xs mt-1 leading-tight">{item.desc}</p>
                {item.earned ? (
                  <p className="text-green-400 text-xs mt-2 font-medium">✅ {item.date}</p>
                ) : (
                  <p className="text-gray-700 text-xs mt-2">🔒 Locked</p>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <p className="font-bold text-white">Recent Activity</p>
            </div>
            {recentActivity.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-4xl mb-3 opacity-30">📅</p>
                <p className="text-gray-400 font-medium mb-1">No activity yet</p>
                <p className="text-gray-600 text-sm">Complete activities to see your history here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-800 transition">
                    <div className="w-10 h-10 bg-purple-600 bg-opacity-20 border border-purple-800 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-200 text-sm">{item.action}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{item.scenario} • {item.time}</p>
                    </div>
                    <span className={`font-bold text-sm flex-shrink-0 ${
                      parseInt(item.score) >= 85 ? 'text-green-400' :
                      parseInt(item.score) >= 70 ? 'text-yellow-400' : 'text-red-400'
                    }`}>{item.score}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </Layout>
  )
}

export default Profile
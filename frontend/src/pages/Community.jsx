import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

function Community() {
  const [activeTab, setActiveTab] = useState('feed')
  const [newPost, setNewPost] = useState('')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [user, setUser] = useState(null)

  const email = localStorage.getItem('email')

  const [leaderboard, setLeaderboard] = useState([])
  const [leaderboardLoading, setLeaderboardLoading] = useState(true)

  const studyBuddies = [
    { name: 'Priya S.', level: 'Intermediate', language: 'Hindi', goal: 'Job Interview', online: true },
    { name: 'Carlos M.', level: 'Beginner', language: 'Spanish', goal: 'Everyday Conversation', online: true },
    { name: 'Fatima A.', level: 'Advanced', language: 'Arabic', goal: 'Business English', online: false },
    { name: 'Yuki T.', level: 'Intermediate', language: 'Japanese', goal: 'Academic English', online: true },
  ]

  useEffect(() => {
    if (email) {
      fetch(`http://127.0.0.1:8000/api/users/profile?email=${email}`)
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(() => setUser({ full_name: 'User' }))
    }
    fetchPosts()
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    setLeaderboardLoading(true)
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/leaderboard?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      setLeaderboard(data)
    } catch (err) {
      console.log('Could not fetch leaderboard')
    }
    setLeaderboardLoading(false)
  }

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/posts')
      const data = await response.json()
      setPosts(data)
    } catch (err) {
      console.log('Could not fetch posts')
    }
    setLoading(false)
  }

  const handlePost = async () => {
    if (!newPost.trim()) return
    setPosting(true)
    try {
      await fetch('http://127.0.0.1:8000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: email, content: newPost })
      })
      setNewPost('')
      fetchPosts()
    } catch (err) {
      console.log('Could not post')
    }
    setPosting(false)
  }

  const handleLike = async (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p))
    try {
      await fetch(`http://127.0.0.1:8000/api/posts/${id}/like`, { method: 'POST' })
    } catch (err) {
      console.log('Could not like')
    }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/posts/${id}?user_email=${encodeURIComponent(email)}`, {
        method: 'DELETE'
      })
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.log('Could not delete')
    }
  }

  const formatTime = (dateStr) => {
    const date = new Date(dateStr.replace(' ', 'T'))
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays}d ago`
  }

  const avatarColors = [
    'from-purple-600 to-blue-600',
    'from-green-600 to-teal-600',
    'from-orange-600 to-red-600',
    'from-pink-600 to-purple-600',
    'from-blue-600 to-cyan-600',
    'from-yellow-600 to-orange-600',
  ]

  const getColor = (str) => {
    const hash = str.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return avatarColors[hash % avatarColors.length]
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Hero */}
        <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 opacity-60"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
          <div className="relative p-8 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Connect & Share</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Community</h2>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                Share your progress, celebrate wins and connect with other English learners.
              </p>
            </div>
            <div className="hidden md:block text-8xl opacity-10">👥</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-1.5 flex gap-1">
          {[
            { id: 'feed', label: '📰 Feed' },
            { id: 'leaderboard', label: '🏆 Leaderboard' },
            { id: 'buddies', label: '🤝 Study Buddies' },
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

        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <div className="space-y-4">

            {/* Post Box */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {user?.full_name?.charAt(0).toUpperCase() || '?'}
                </div>
                <textarea
                  value={newPost}
                  onChange={e => setNewPost(e.target.value)}
                  placeholder="Share your progress, tips or questions with the community..."
                  rows={3}
                  maxLength={500}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none text-sm"
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-xs">{newPost.length}/500</p>
                <button
                  onClick={handlePost}
                  disabled={!newPost.trim() || posting}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-xl transition disabled:opacity-40 font-medium text-sm shadow-lg shadow-purple-900/40"
                >
                  {posting ? 'Posting...' : 'Post 📢'}
                </button>
              </div>
            </div>

            {/* Posts */}
            {loading ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 flex justify-center">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                <p className="text-4xl mb-3 opacity-20">📰</p>
                <p className="font-bold text-gray-300 mb-1">No posts yet</p>
                <p className="text-gray-500 text-sm">Be the first to share something with the community!</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getColor(post.full_name)} flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}>
                      {post.full_name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-200 text-sm truncate">{post.full_name}</p>
                      <p className="text-xs text-gray-500">{formatTime(post.created_at)}</p>
                    </div>
                    {post.user_email === email && (
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-gray-600 hover:text-red-400 transition text-xs flex-shrink-0"
                      >
                        🗑️
                      </button>
                    )}
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>

                  <div className="flex items-center gap-1 pt-3 border-t border-gray-800">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition text-xs font-medium text-gray-500 hover:text-purple-400 hover:bg-gray-800"
                    >
                      👍 {post.likes}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <p className="font-bold text-white">🏆 Top Learners</p>
                <p className="text-gray-500 text-xs mt-0.5">Ranked by total XP earned</p>
              </div>
              {leaderboardLoading ? (
                <div className="p-12 flex justify-center">
                  <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-4xl mb-3 opacity-20">🏆</p>
                  <p className="font-bold text-gray-300 mb-1">No rankings yet</p>
                  <p className="text-gray-500 text-sm">Complete activities to earn XP and appear here!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {leaderboard.map((u) => {
                    const badge = u.rank === 1 ? '🏆' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : null
                    return (
                      <div
                        key={u.rank}
                        className={`flex items-center gap-4 px-6 py-3 transition ${
                          u.is_you ? 'bg-purple-900 bg-opacity-20 border-l-4 border-purple-500' : 'hover:bg-gray-800'
                        }`}
                      >
                        <p className="text-lg font-bold w-8 text-center text-gray-400">{badge || `#${u.rank}`}</p>
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getColor(u.name)} flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0`}>
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-200 text-sm truncate">
                            {u.name} {u.is_you && <span className="text-purple-400 text-xs">(You)</span>}
                          </p>
                          <p className="text-xs text-gray-500">🔥 {u.streak} day streak</p>
                        </div>
                        <p className="font-bold text-purple-400 text-sm flex-shrink-0">{u.xp} XP</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STUDY BUDDIES TAB — placeholder data */}
        {activeTab === 'buddies' && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="font-bold text-white mb-1">🤝 Find Your Study Buddy</p>
              <p className="text-gray-500 text-sm">Sample profiles — real matching coming soon</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {studyBuddies.map((buddy, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getColor(buddy.name)} flex items-center justify-center text-white font-bold shadow-lg`}>
                        {buddy.name.charAt(0)}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${buddy.online ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-200 text-sm">{buddy.name}</p>
                      <p className="text-xs text-gray-500">{buddy.language} speaker • {buddy.level}</p>
                    </div>
                  </div>
                  <p className="text-purple-400 text-xs mb-3">🎯 {buddy.goal}</p>
                  <button className="w-full bg-gray-800 border border-gray-700 hover:border-purple-600 text-gray-300 hover:text-white py-2 rounded-xl transition text-xs font-medium">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}

export default Community
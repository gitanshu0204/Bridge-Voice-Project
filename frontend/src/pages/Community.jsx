import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function Community() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('feed')
  const [newPost, setNewPost] = useState('')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [user, setUser] = useState(null)

  const email = localStorage.getItem('email')

  const [leaderboard, setLeaderboard] = useState([])
  const [leaderboardLoading, setLeaderboardLoading] = useState(true)

  const [studyBuddies, setStudyBuddies] = useState([])
  const [buddiesLoading, setBuddiesLoading] = useState(true)
  const [incomingRequests, setIncomingRequests] = useState([])
  const [sentRequests, setSentRequests] = useState([])
  const [requestsLoading, setRequestsLoading] = useState(true)

  const [connectedBuddies, setConnectedBuddies] = useState([])
  const [activeChatBuddy, setActiveChatBuddy] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (email) {
      fetch(`http://127.0.0.1:8000/api/users/profile?email=${email}`)
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(() => setUser({ full_name: 'User' }))
    }
    fetchPosts()
    fetchLeaderboard()
    fetchStudyBuddies()
    fetchRequests()
    fetchConnectedBuddies()
  }, [])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    if (!activeChatBuddy) return
    const interval = setInterval(() => {
      fetchMessages(activeChatBuddy.email)
    }, 10000)
    return () => clearInterval(interval)
  }, [activeChatBuddy])

  const fetchConnectedBuddies = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/study-buddies/connected?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      setConnectedBuddies(data)
    } catch (err) {
      console.log('Could not fetch connected buddies')
    }
  }

  const fetchMessages = async (buddyEmail) => {
    setMessagesLoading(true)
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/messages/${encodeURIComponent(buddyEmail)}?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      setMessages(data)
    } catch (err) {
      console.log('Could not fetch messages')
    }
    setMessagesLoading(false)
  }

  const openChat = (buddy) => {
    navigate('/chat/buddy', { state: { buddy } })
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChatBuddy) return
    setSendingMessage(true)
    const content = newMessage.trim()
    setNewMessage('')

    setMessages(prev => [...prev, {
      id: Date.now(),
      from_email: email,
      content,
      created_at: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      is_mine: true
    }])

    try {
      await fetch('http://127.0.0.1:8000/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_email: email,
          to_email: activeChatBuddy.email,
          content
        })
      })
    } catch (err) {
      console.log('Could not send message')
    }
    setSendingMessage(false)
  }

  const fetchStudyBuddies = async () => {
    setBuddiesLoading(true)
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/study-buddies?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      setStudyBuddies(data)
    } catch (err) {
      console.log('Could not fetch study buddies')
    }
    setBuddiesLoading(false)
  }

  const fetchRequests = async () => {
    setRequestsLoading(true)
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/study-buddies/requests?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      setIncomingRequests(data.incoming || [])
      setSentRequests(data.sent || [])
    } catch (err) {
      console.log('Could not fetch requests')
    }
    setRequestsLoading(false)
  }

  const sendRequest = async (toEmail) => {
    try {
      await fetch('http://127.0.0.1:8000/api/study-buddies/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_email: email, to_email: toEmail })
      })
      fetchRequests()
    } catch (err) {
      console.log('Could not send request')
    }
  }

  const respondToRequest = async (requestId, action) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/study-buddies/request/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, email })
      })
      fetchRequests()
      fetchConnectedBuddies()
    } catch (err) {
      console.log('Could not respond to request')
    }
  }

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
    } catch (err) { console.log('Could not like') }
  }

  const handleDelete = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/posts/${id}?user_email=${encodeURIComponent(email)}`, { method: 'DELETE' })
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch (err) { console.log('Could not delete') }
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
    const hash = (str || 'U').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return avatarColors[hash % avatarColors.length]
  }

  const getCompatibilityLabel = (score) => {
    if (score >= 5) return { label: '⭐ Best Match', color: 'text-green-400' }
    if (score >= 3) return { label: '✅ Good Match', color: 'text-blue-400' }
    return { label: '🔵 Potential Match', color: 'text-gray-400' }
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
            {
              id: 'buddies',
              label: incomingRequests.length > 0
                ? `🤝 Study Buddies 🔴`
                : '🤝 Study Buddies'
            },
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

            {loading ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 flex justify-center">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                <p className="text-4xl mb-3 opacity-20">📰</p>
                <p className="font-bold text-gray-300 mb-1">No posts yet</p>
                <p className="text-gray-500 text-sm">Be the first to share something!</p>
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
                      <button onClick={() => handleDelete(post.id)} className="text-gray-600 hover:text-red-400 transition text-xs flex-shrink-0">🗑️</button>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>
                  <div className="flex items-center gap-1 pt-3 border-t border-gray-800">
                    <button onClick={() => handleLike(post.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition text-xs font-medium text-gray-500 hover:text-purple-400 hover:bg-gray-800">
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
                  <p className="text-gray-500 text-sm">Complete activities to earn XP!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {leaderboard.map((u) => {
                    const badge = u.rank === 1 ? '🏆' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : null
                    return (
                      <div key={u.rank} className={`flex items-center gap-4 px-6 py-3 transition ${u.is_you ? 'bg-purple-900 bg-opacity-20 border-l-4 border-purple-500' : 'hover:bg-gray-800'}`}>
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

        {/* STUDY BUDDIES TAB */}
        {activeTab === 'buddies' && (
          <div className="space-y-6">

            {/* ===== MY STUDY BUDDIES ===== */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-900 bg-opacity-50 border border-green-800 rounded-xl flex items-center justify-center text-sm">✅</div>
                  <div>
                    <p className="font-bold text-white text-sm">My Study Buddies</p>
                    <p className="text-gray-500 text-xs">{connectedBuddies.length} connected</p>
                  </div>
                </div>
                {connectedBuddies.length > 0 && (
                  <span className="bg-green-900 bg-opacity-40 border border-green-800 text-green-400 text-xs px-2.5 py-1 rounded-full font-medium">
                    {connectedBuddies.length} Active
                  </span>
                )}
              </div>

              {connectedBuddies.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <p className="text-4xl mb-3 opacity-20">🤝</p>
                  <p className="text-gray-400 font-medium text-sm mb-1">No study buddies yet</p>
                  <p className="text-gray-600 text-xs">Send a connection request below to start learning together</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {connectedBuddies.map((buddy, i) => (
                    <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-800 transition">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getColor(buddy.full_name)} flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}>
                        {buddy.initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-sm">{buddy.full_name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{buddy.language_background} speaker • {buddy.proficiency_level}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                          <span className="text-xs text-green-400">Connected</span>
                        </div>
                      </div>
                      <button
                        onClick={() => openChat(buddy)}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg shadow-purple-900/30 flex items-center gap-1.5 flex-shrink-0"
                      >
                        💬 Message
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ===== PENDING REQUESTS ===== */}
            {incomingRequests.length > 0 && (
              <div className="bg-gray-900 border border-yellow-900 border-opacity-50 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-900 bg-opacity-50 border border-yellow-800 rounded-xl flex items-center justify-center text-sm">📬</div>
                    <div>
                      <p className="font-bold text-white text-sm">Connection Requests</p>
                      <p className="text-gray-500 text-xs">People who want to study with you</p>
                    </div>
                  </div>
                  <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold animate-pulse">
                    {incomingRequests.length} New
                  </span>
                </div>
                <div className="divide-y divide-gray-800">
                  {incomingRequests.map((req, i) => (
                    <div key={i} className="px-6 py-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${getColor(req.from_name)} flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0`}>
                          {req.from_name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-sm">{req.from_name}</p>
                          <p className="text-xs text-gray-500">{req.from_language} speaker • {req.from_level}</p>
                          {req.from_goals && (
                            <p className="text-xs text-purple-400 mt-0.5">🎯 {req.from_goals}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => respondToRequest(req.id, 'accept')}
                          className="flex-1 bg-green-700 hover:bg-green-600 text-white py-2 rounded-xl text-xs font-bold transition"
                        >
                          ✅ Accept Request
                        </button>
                        <button
                          onClick={() => respondToRequest(req.id, 'reject')}
                          className="flex-1 bg-gray-800 hover:bg-red-900 border border-gray-700 hover:border-red-700 text-gray-400 hover:text-red-400 py-2 rounded-xl text-xs font-bold transition"
                        >
                          ❌ Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===== AI SUGGESTIONS ===== */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-900 bg-opacity-50 border border-purple-800 rounded-xl flex items-center justify-center text-sm">🤖</div>
                  <div>
                    <p className="font-bold text-white text-sm">AI Suggested Buddies</p>
                    <p className="text-gray-500 text-xs">Matched by level, language and goals</p>
                  </div>
                </div>
              </div>

              {buddiesLoading ? (
                <div className="p-12 flex justify-center">
                  <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (() => {
                const suggestions = studyBuddies.filter(
                  buddy => !connectedBuddies.some(b => b.email === buddy.email)
                )

                if (suggestions.length === 0) return (
                  <div className="px-6 py-10 text-center">
                    <p className="text-4xl mb-3 opacity-20">🔍</p>
                    <p className="text-gray-400 font-medium text-sm mb-1">No suggestions available</p>
                    <p className="text-gray-600 text-xs">You're connected with everyone! Invite more friends to join BridgeVoice.</p>
                  </div>
                )

                return (
                  <div className="divide-y divide-gray-800">
                    {suggestions.map((buddy, i) => {
                      const compat = getCompatibilityLabel(buddy.compatibility_score)
                      const sentReq = sentRequests.find(r => r.to_email === buddy.email)
                      const reqStatus = sentReq?.status

                      return (
                        <div key={i} className="px-6 py-4 hover:bg-gray-800 transition">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getColor(buddy.full_name)} flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}>
                              {buddy.initial}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-white text-sm">{buddy.full_name}</p>
                                <span className={`text-xs font-medium ${compat.color}`}>{compat.label}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">{buddy.language_background} speaker • {buddy.proficiency_level}</p>
                              <p className="text-xs text-purple-400 mt-0.5">🎯 {buddy.goals}</p>
                            </div>
                          </div>

                          {!reqStatus && (
                            <button
                              onClick={() => sendRequest(buddy.email)}
                              className="w-full bg-gray-800 border border-gray-700 hover:border-purple-600 hover:bg-purple-900 hover:bg-opacity-20 text-gray-300 hover:text-white py-2 rounded-xl transition text-xs font-medium"
                            >
                              🤝 Send Connection Request
                            </button>
                          )}
                          {reqStatus === 'pending' && (
                            <div className="w-full bg-yellow-900 bg-opacity-20 border border-yellow-800 text-yellow-400 py-2 rounded-xl text-xs font-medium text-center">
                              ⏳ Request Sent — Waiting for response
                            </div>
                          )}
                          {reqStatus === 'rejected' && (
                            <div className="w-full bg-gray-800 border border-gray-700 text-gray-600 py-2 rounded-xl text-xs font-medium text-center">
                              ❌ Request Declined
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )
              })()}

              {/* How it works footer */}
              <div className="px-6 py-4 border-t border-gray-800 bg-purple-900 bg-opacity-5 flex items-start gap-3">
                <span className="text-sm flex-shrink-0">🤖</span>
                <p className="text-gray-500 text-xs leading-relaxed">
                  <span className="text-purple-400 font-medium">How AI matching works: </span>
                  Similar proficiency levels, different native languages, and shared goals score higher. Best matches appear first.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ===== CHAT MODAL ===== */}
      {activeChatBuddy && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md h-[600px] flex flex-col">
            <div className="absolute inset-0 bg-purple-900 rounded-2xl blur-xl opacity-10"></div>
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden">

              {/* Chat Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800 flex-shrink-0">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getColor(activeChatBuddy.full_name)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                  {activeChatBuddy.initial}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-sm">{activeChatBuddy.full_name}</p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    <p className="text-xs text-gray-500">Study Buddy • {activeChatBuddy.proficiency_level}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setActiveChatBuddy(null); setMessages([]) }}
                  className="text-gray-500 hover:text-white transition text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messagesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-3xl mb-3">👋</p>
                    <p className="text-gray-400 font-medium text-sm">Start a conversation!</p>
                    <p className="text-gray-600 text-xs mt-1">
                      Say hi to {activeChatBuddy.full_name.split(' ')[0]} and start practicing English together
                    </p>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
                      {!msg.is_mine && (
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${getColor(activeChatBuddy.full_name)} flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-1`}>
                          {activeChatBuddy.initial}
                        </div>
                      )}
                      <div className={`max-w-xs ${msg.is_mine ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.is_mine
                            ? 'bg-purple-600 text-white rounded-br-sm'
                            : 'bg-gray-800 text-gray-200 rounded-bl-sm'
                        }`}>
                          {msg.content}
                        </div>
                        <p className="text-gray-600 text-xs mt-1 px-1">{msg.created_at}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="px-4 py-3 border-t border-gray-800 flex gap-2 flex-shrink-0">
                <input
                  type="text"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder={`Message ${activeChatBuddy.full_name.split(' ')[0]}...`}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition text-sm"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl transition disabled:opacity-40 font-bold text-sm flex-shrink-0"
                >
                  {sendingMessage ? '...' : '→'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </Layout>
  )
}

export default Community
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../assets/logo'

function Community() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('feed')
  const [newPost, setNewPost] = useState('')
  const [posts, setPosts] = useState([
    { id: 1, name: 'Priya S.', avatar: 'P', time: '2 mins ago', content: 'Just completed my first job interview practice! Feeling much more confident now 💪', likes: 12, liked: false, comments: 3 },
    { id: 2, name: 'Wei L.', avatar: 'W', time: '15 mins ago', content: 'Reached 30 day streak today! BridgeVoice has helped me so much 🔥', likes: 28, liked: false, comments: 7 },
    { id: 3, name: 'Ahmed K.', avatar: 'A', time: '1 hour ago', content: 'The Doctor Visit scenario really helped me communicate better at my appointment today!', likes: 19, liked: false, comments: 4 },
    { id: 4, name: 'Maria G.', avatar: 'M', time: '2 hours ago', content: 'Tips for newcomers: Practice the grocery store scenario first — it builds confidence fast! 🛒', likes: 35, liked: false, comments: 11 },
    { id: 5, name: 'Jin P.', avatar: 'J', time: '3 hours ago', content: 'Got my first job offer in Canada today! BridgeVoice interview practice really helped me prepare 🍁', likes: 87, liked: false, comments: 23 },
  ])

  const leaderboard = [
    { rank: 1, name: 'Jin P.', avatar: 'J', xp: 2840, streak: 45, badge: '🏆' },
    { rank: 2, name: 'Maria G.', avatar: 'M', xp: 2650, streak: 38, badge: '🥈' },
    { rank: 3, name: 'Wei L.', avatar: 'W', xp: 2340, streak: 30, badge: '🥉' },
    { rank: 4, name: 'Ahmed K.', avatar: 'A', xp: 1980, streak: 22, badge: '' },
    { rank: 5, name: 'Priya S.', avatar: 'P', xp: 1750, streak: 18, badge: '' },
    { rank: 6, name: 'You', avatar: 'G', xp: 340, streak: 7, badge: '' },
  ]

  const studyBuddies = [
    { name: 'Priya S.', level: 'Intermediate', language: 'Hindi', goal: 'Job Interview', online: true },
    { name: 'Carlos M.', level: 'Beginner', language: 'Spanish', goal: 'Everyday Conversation', online: true },
    { name: 'Fatima A.', level: 'Advanced', language: 'Arabic', goal: 'Business English', online: false },
    { name: 'Yuki T.', level: 'Intermediate', language: 'Japanese', goal: 'Academic English', online: true },
  ]

  const handleLike = (id) => {
    setPosts(prev => prev.map(post =>
      post.id === id
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  const handlePost = () => {
    if (!newPost.trim()) return
    setPosts(prev => [{
      id: prev.length + 1,
      name: 'You', avatar: 'G', time: 'Just now',
      content: newPost, likes: 0, liked: false, comments: 0
    }, ...prev])
    setNewPost('')
  }

  const avatarColors = ['from-purple-600 to-blue-600', 'from-green-600 to-teal-600', 'from-orange-600 to-red-600', 'from-pink-600 to-purple-600', 'from-blue-600 to-cyan-600']

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo size={18} />
          <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">BridgeVoice</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-400 hover:text-white transition text-sm">Dashboard</Link>
          <button
            onClick={() => { localStorage.clear(); navigate('/') }}
            className="bg-red-900 bg-opacity-50 hover:bg-opacity-80 text-red-400 px-4 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h2 className="text-2xl font-bold">👥 Community</h2>
          <p className="text-gray-400 mt-1">Connect with other English learners across Canada</p>
        </div>

        <div className="flex gap-2 mb-6">
          {[
            { id: 'feed', label: '📰 Feed' },
            { id: 'leaderboard', label: '🏆 Leaderboard' },
            { id: 'buddies', label: '🤝 Study Buddies' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-medium transition text-sm ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'feed' && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <textarea
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                placeholder="Share your progress or tips with the community..."
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none text-sm"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handlePost}
                  disabled={!newPost.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-5 py-2 rounded-xl transition disabled:opacity-50 font-medium text-sm"
                >
                  Post 📢
                </button>
              </div>
            </div>

            {posts.map((post, i) => (
              <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold`}>
                    {post.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200">{post.name}</p>
                    <p className="text-xs text-gray-500">{post.time}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 text-sm font-medium transition ${
                      post.liked ? 'text-purple-400' : 'text-gray-500 hover:text-purple-400'
                    }`}
                  >
                    👍 {post.likes}
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-400 transition">
                    💬 {post.comments}
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-400 transition">
                    🔗 Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-4 text-center border-b border-gray-800">
              <p className="font-bold text-lg">🏆 Weekly Leaderboard</p>
              <p className="text-gray-400 text-sm">Top learners this week</p>
            </div>
            <div className="divide-y divide-gray-800">
              {leaderboard.map((user, i) => (
                <div key={i} className={`flex items-center gap-4 p-4 ${user.name === 'You' ? 'bg-purple-900 bg-opacity-20' : 'hover:bg-gray-800'} transition`}>
                  <p className="text-xl font-bold text-gray-400 w-8">{user.badge || user.rank}</p>
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold`}>
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-200">{user.name} {user.name === 'You' ? '(You)' : ''}</p>
                    <p className="text-xs text-gray-500">🔥 {user.streak} day streak</p>
                  </div>
                  <p className="font-bold text-purple-400">{user.xp} XP</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'buddies' && (
          <div className="space-y-4">
            <div className="bg-purple-900 bg-opacity-20 border border-purple-800 rounded-xl p-4">
              <p className="font-semibold text-purple-300">🤝 Find a Study Buddy</p>
              <p className="text-sm text-gray-400 mt-1">Practice English with other learners at your level!</p>
            </div>
            {studyBuddies.map((buddy, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex justify-between items-center hover:border-gray-600 transition">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-lg`}>
                      {buddy.name.charAt(0)}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${buddy.online ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-200">{buddy.name}</p>
                    <p className="text-xs text-gray-500">{buddy.language} speaker • {buddy.level}</p>
                    <p className="text-xs text-purple-400">Goal: {buddy.goal}</p>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl transition text-sm font-medium">
                  Connect
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Community
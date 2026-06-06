import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function Community() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('feed')
  const [newPost, setNewPost] = useState('')
  const [posts, setPosts] = useState([
    { id: 1, name: 'Priya S.', avatar: 'P', time: '2 mins ago', content: 'Just completed my first job interview practice! Feeling much more confident now 💪', likes: 12, liked: false, comments: 3, color: 'from-purple-600 to-blue-600' },
    { id: 2, name: 'Wei L.', avatar: 'W', time: '15 mins ago', content: 'Reached 30 day streak today! BridgeVoice has helped me so much 🔥', likes: 28, liked: false, comments: 7, color: 'from-green-600 to-teal-600' },
    { id: 3, name: 'Ahmed K.', avatar: 'A', time: '1 hour ago', content: 'The Doctor Visit scenario really helped me communicate better at my appointment today!', likes: 19, liked: false, comments: 4, color: 'from-orange-600 to-red-600' },
    { id: 4, name: 'Maria G.', avatar: 'M', time: '2 hours ago', content: 'Tips for newcomers: Practice the grocery store scenario first — it builds confidence fast! 🛒', likes: 35, liked: false, comments: 11, color: 'from-pink-600 to-purple-600' },
    { id: 5, name: 'Jin P.', avatar: 'J', time: '3 hours ago', content: 'Got my first job offer in Canada today! BridgeVoice interview practice really helped me prepare 🍁', likes: 87, liked: false, comments: 23, color: 'from-blue-600 to-cyan-600' },
  ])

  const leaderboard = [
    { rank: 1, name: 'Jin P.', avatar: 'J', xp: 2840, streak: 45, badge: '🏆', color: 'from-yellow-600 to-yellow-400' },
    { rank: 2, name: 'Maria G.', avatar: 'M', xp: 2650, streak: 38, badge: '🥈', color: 'from-gray-500 to-gray-400' },
    { rank: 3, name: 'Wei L.', avatar: 'W', xp: 2340, streak: 30, badge: '🥉', color: 'from-orange-700 to-orange-500' },
    { rank: 4, name: 'Ahmed K.', avatar: 'A', xp: 1980, streak: 22, badge: '', color: 'from-purple-600 to-blue-600' },
    { rank: 5, name: 'Priya S.', avatar: 'P', xp: 1750, streak: 18, badge: '', color: 'from-green-600 to-teal-600' },
    { rank: 6, name: 'You', avatar: 'G', xp: 340, streak: 7, badge: '', color: 'from-blue-600 to-purple-600' },
  ]

  const studyBuddies = [
    { name: 'Priya S.', level: 'Intermediate', language: 'Hindi', goal: 'Job Interview', online: true, color: 'from-purple-600 to-blue-600' },
    { name: 'Carlos M.', level: 'Beginner', language: 'Spanish', goal: 'Everyday Conversation', online: true, color: 'from-green-600 to-teal-600' },
    { name: 'Fatima A.', level: 'Advanced', language: 'Arabic', goal: 'Business English', online: false, color: 'from-orange-600 to-red-600' },
    { name: 'Yuki T.', level: 'Intermediate', language: 'Japanese', goal: 'Academic English', online: true, color: 'from-pink-600 to-purple-600' },
    { name: 'David C.', level: 'Elementary', language: 'Mandarin', goal: 'Making Friends', online: false, color: 'from-blue-600 to-cyan-600' },
    { name: 'Sofia R.', level: 'Advanced', language: 'Portuguese', goal: 'Business English', online: true, color: 'from-yellow-600 to-orange-600' },
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
      content: newPost, likes: 0, liked: false, comments: 0,
      color: 'from-purple-600 to-blue-600'
    }, ...prev])
    setNewPost('')
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">👥 Community</h2>
          <p className="text-gray-400 mt-1">Connect with English learners across Canada</p>
        </div>

        {/* Stats Banner */}
        <div className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-gray-900 border border-purple-800 rounded-3xl p-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-700 rounded-full filter blur-3xl opacity-20"></div>
          <div className="grid grid-cols-3 gap-4 relative">
            {[
              { value: '10K+', label: 'Active Learners', icon: '👥' },
              { value: '50K+', label: 'Posts Shared', icon: '📝' },
              { value: '95%', label: 'Success Rate', icon: '🏆' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl mb-1">{stat.icon}</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
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
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900'
                  : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'feed' && (
          <div className="space-y-4">

            {/* Post Box */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                  G
                </div>
                <textarea
                  value={newPost}
                  onChange={e => setNewPost(e.target.value)}
                  placeholder="Share your progress, tips or questions with the community..."
                  rows={3}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition resize-none text-sm"
                />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button className="text-gray-500 hover:text-purple-400 transition text-sm">📷 Photo</button>
                  <button className="text-gray-500 hover:text-purple-400 transition text-sm">🏆 Achievement</button>
                </div>
                <button
                  onClick={handlePost}
                  disabled={!newPost.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-5 py-2 rounded-xl transition disabled:opacity-50 font-medium text-sm"
                >
                  Post 📢
                </button>
              </div>
            </div>

            {/* Posts */}
            {posts.map((post) => (
              <div key={post.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${post.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {post.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-200">{post.name}</p>
                    <p className="text-xs text-gray-500">{post.time}</p>
                  </div>
                  <button className="text-gray-600 hover:text-gray-400 transition">•••</button>
                </div>

                <p className="text-gray-300 leading-relaxed mb-4">{post.content}</p>

                <div className="flex items-center gap-1 pt-3 border-t border-gray-800">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition text-sm font-medium ${
                      post.liked
                        ? 'text-purple-400 bg-purple-900 bg-opacity-30'
                        : 'text-gray-500 hover:text-purple-400 hover:bg-gray-800'
                    }`}
                  >
                    👍 {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-gray-800 transition text-sm font-medium">
                    💬 {post.comments}
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-500 hover:text-green-400 hover:bg-gray-800 transition text-sm font-medium">
                    🔗 Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-4">

            {/* Top 3 Podium */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold text-gray-200 mb-6 text-center">🏆 This Week's Top Learners</h3>
              <div className="flex items-end justify-center gap-4 mb-6">
                {/* 2nd Place */}
                <div className="text-center">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${leaderboard[1].color} flex items-center justify-center text-white font-bold text-xl mx-auto mb-2 shadow-lg`}>
                    {leaderboard[1].avatar}
                  </div>
                  <p className="text-gray-300 text-sm font-medium">{leaderboard[1].name}</p>
                  <p className="text-gray-500 text-xs">{leaderboard[1].xp} XP</p>
                  <div className="bg-gray-700 h-16 w-16 rounded-t-xl mx-auto mt-2 flex items-end justify-center pb-2">
                    <p className="text-2xl">🥈</p>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${leaderboard[0].color} flex items-center justify-center text-white font-bold text-2xl mx-auto mb-2 shadow-xl ring-4 ring-yellow-500 ring-opacity-50`}>
                    {leaderboard[0].avatar}
                  </div>
                  <p className="text-gray-200 text-sm font-bold">{leaderboard[0].name}</p>
                  <p className="text-yellow-400 text-xs font-medium">{leaderboard[0].xp} XP</p>
                  <div className="bg-gradient-to-t from-yellow-700 to-yellow-600 h-24 w-16 rounded-t-xl mx-auto mt-2 flex items-end justify-center pb-2">
                    <p className="text-2xl">🏆</p>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="text-center">
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${leaderboard[2].color} flex items-center justify-center text-white font-bold text-xl mx-auto mb-2 shadow-lg`}>
                    {leaderboard[2].avatar}
                  </div>
                  <p className="text-gray-300 text-sm font-medium">{leaderboard[2].name}</p>
                  <p className="text-gray-500 text-xs">{leaderboard[2].xp} XP</p>
                  <div className="bg-orange-800 h-12 w-16 rounded-t-xl mx-auto mt-2 flex items-end justify-center pb-2">
                    <p className="text-2xl">🥉</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Leaderboard */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="divide-y divide-gray-800">
                {leaderboard.map((user, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 transition ${
                    user.name === 'You'
                      ? 'bg-purple-900 bg-opacity-20 border-l-4 border-purple-500'
                      : 'hover:bg-gray-800'
                  }`}>
                    <p className="text-xl font-bold w-8 text-center">{user.badge || `#${user.rank}`}</p>
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-200">{user.name} {user.name === 'You' && <span className="text-purple-400 text-xs">(You)</span>}</p>
                      <p className="text-xs text-gray-500">🔥 {user.streak} day streak</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-purple-400">{user.xp} XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'buddies' && (
          <div className="space-y-4">

            <div className="bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-1">🤝 Find Your Study Buddy</h3>
              <p className="text-gray-400 text-sm">Practice English with learners at your level from around the world!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studyBuddies.map((buddy, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 hover:shadow-xl transition group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${buddy.color} flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition`}>
                        {buddy.name.charAt(0)}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-gray-900 ${buddy.online ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-200">{buddy.name}</p>
                      <p className="text-xs text-gray-500">{buddy.language} speaker</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border mt-1 inline-block ${
                        buddy.online
                          ? 'bg-green-900 bg-opacity-40 border-green-700 text-green-300'
                          : 'bg-gray-800 border-gray-700 text-gray-500'
                      }`}>
                        {buddy.online ? '🟢 Online' : '⚫ Offline'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Level</span>
                      <span className="text-gray-300 font-medium">{buddy.level}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Goal</span>
                      <span className="text-purple-400 font-medium">{buddy.goal}</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-2 rounded-xl transition text-sm font-medium">
                    Connect 🤝
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
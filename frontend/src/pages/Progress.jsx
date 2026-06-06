import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function Progress() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [animatedScores, setAnimatedScores] = useState({})

  const weeklyData = [
    { day: 'Mon', score: 75, sessions: 2 },
    { day: 'Tue', score: 80, sessions: 1 },
    { day: 'Wed', score: 85, sessions: 3 },
    { day: 'Thu', score: 78, sessions: 2 },
    { day: 'Fri', score: 90, sessions: 4 },
    { day: 'Sat', score: 88, sessions: 1 },
    { day: 'Sun', score: 92, sessions: 2 },
  ]

  const skills = [
    { name: 'Grammar', score: 75, icon: '✍️', color: 'from-purple-600 to-purple-400', tip: 'Focus on tense consistency' },
    { name: 'Pronunciation', score: 60, icon: '🎤', color: 'from-blue-600 to-blue-400', tip: 'Practice vowel sounds daily' },
    { name: 'Vocabulary', score: 85, icon: '📖', color: 'from-green-600 to-green-400', tip: 'Learn 3 new words daily' },
    { name: 'Fluency', score: 70, icon: '💬', color: 'from-orange-600 to-orange-400', tip: 'Speak without pausing' },
    { name: 'Confidence', score: 80, icon: '💪', color: 'from-pink-600 to-pink-400', tip: 'Practice daily challenges' },
    { name: 'Listening', score: 88, icon: '👂', color: 'from-cyan-600 to-cyan-400', tip: 'Watch English videos' },
  ]

  const sessions = [
    { scenario: 'Job Interview', date: 'Today', score: 85, duration: '12 mins', feedback: 'Great eye contact phrases! Work on past tense.', icon: '💼' },
    { scenario: 'Grocery Store', date: 'Yesterday', score: 92, duration: '8 mins', feedback: 'Excellent vocabulary! Very natural conversation.', icon: '🛒' },
    { scenario: 'Doctor Visit', date: '2 days ago', score: 78, duration: '15 mins', feedback: 'Good effort! Practice medical terms more.', icon: '🏥' },
    { scenario: 'Bank Visit', date: '3 days ago', score: 88, duration: '10 mins', feedback: 'Very polite and professional tone!', icon: '🏦' },
    { scenario: 'Workplace Chat', date: '4 days ago', score: 71, duration: '9 mins', feedback: 'Work on formal vs informal language.', icon: '🏢' },
  ]

  const maxScore = Math.max(...weeklyData.map(d => d.score))

  const overallScore = Math.round(skills.reduce((a, b) => a + b.score, 0) / skills.length)

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-400'
    if (score >= 70) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreBg = (score) => {
    if (score >= 85) return 'from-green-600 to-green-400'
    if (score >= 70) return 'from-orange-600 to-orange-400'
    return 'from-red-600 to-red-400'
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">📊 Your Progress</h2>
            <p className="text-gray-400 mt-1">Track your English learning journey</p>
          </div>
          <button
            onClick={() => navigate('/chat')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl font-medium text-sm transition"
          >
            + New Session
          </button>
        </div>

        {/* Overall Score Card */}
        <div className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-gray-900 rounded-3xl p-8 border border-purple-800 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-700 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-700 rounded-full filter blur-3xl opacity-20"></div>

          <div className="relative flex flex-col md:flex-row items-center gap-8">

            {/* Circular Score */}
            <div className="relative flex items-center justify-center">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="#1f2937" strokeWidth="12"/>
                <circle
                  cx="80" cy="80" r="70"
                  fill="none"
                  stroke="url(#scoreGrad)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(overallScore / 100) * 440} 440`}
                  strokeDashoffset="110"
                  transform="rotate(-90 80 80)"
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9333ea"/>
                    <stop offset="100%" stopColor="#3b82f6"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute text-center">
                <p className="text-4xl font-bold text-white">{overallScore}%</p>
                <p className="text-gray-400 text-xs">Overall</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Total Sessions', value: '15', icon: '🎯', color: 'text-purple-400' },
                { label: 'Average Score', value: '83%', icon: '📊', color: 'text-blue-400' },
                { label: 'Day Streak', value: '🔥 7', icon: '⚡', color: 'text-orange-400' },
                { label: 'Total Practice', value: '2.5h', icon: '⏱️', color: 'text-green-400' },
                { label: 'Words Learned', value: '124', icon: '📖', color: 'text-pink-400' },
                { label: 'Badges Earned', value: '3', icon: '🏆', color: 'text-yellow-400' },
              ].map((stat, i) => (
                <div key={i} className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl p-3 text-center hover:bg-opacity-10 transition">
                  <p className="text-2xl mb-1">{stat.icon}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { id: 'overview', label: '📈 Overview' },
            { id: 'skills', label: '🧠 Skills' },
            { id: 'history', label: '📅 History' },
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
          <div className="space-y-6">

            {/* Weekly Chart */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-200">📈 This Week's Performance</h3>
                <span className="text-green-400 text-sm font-medium bg-green-900 bg-opacity-30 border border-green-800 px-3 py-1 rounded-full">
                  ↑ 12% vs last week
                </span>
              </div>

              <div className="flex items-end gap-3 h-48">
                {weeklyData.map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="relative w-full flex flex-col items-center">
                      <div className="opacity-0 group-hover:opacity-100 transition absolute -top-8 bg-gray-800 border border-gray-700 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10">
                        {d.score}% • {d.sessions} sessions
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-purple-600 to-blue-400 rounded-t-xl transition-all hover:from-purple-500 hover:to-blue-300 cursor-pointer relative overflow-hidden"
                        style={{ height: `${(d.score / maxScore) * 160}px` }}
                      >
                        <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition"></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">{d.day}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence Over Time */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="font-bold text-gray-200 mb-6">🎯 Confidence Growth</h3>
              <div className="space-y-4">
                {[
                  { week: 'Week 1', score: 55, label: 'Starting out' },
                  { week: 'Week 2', score: 65, label: 'Getting better' },
                  { week: 'Week 3', score: 72, label: 'Building confidence' },
                  { week: 'Week 4', score: 83, label: 'Great progress!' },
                ].map((w, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <p className="text-sm text-gray-500 w-16 flex-shrink-0">{w.week}</p>
                    <div className="flex-1 bg-gray-800 rounded-full h-4 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-500 h-4 rounded-full transition-all relative"
                        style={{ width: `${w.score}%` }}
                      >
                        <div className="absolute inset-0 bg-white opacity-20 rounded-full"></div>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-gray-300 w-10">{w.score}%</p>
                    <p className="text-xs text-gray-600 w-32 hidden md:block">{w.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6">

            {/* Skill Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${skill.color} rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition`}>
                        {skill.icon}
                      </div>
                      <p className="font-bold text-gray-200">{skill.name}</p>
                    </div>
                    <span className={`text-2xl font-bold ${getScoreColor(skill.score)}`}>
                      {skill.score}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-800 rounded-full h-3 mb-3 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${skill.color} h-3 rounded-full transition-all relative`}
                      style={{ width: `${skill.score}%` }}
                    >
                      <div className="absolute inset-0 bg-white opacity-20 rounded-full"></div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">💡 {skill.tip}</p>
                </div>
              ))}
            </div>

            {/* AI Recommendation */}
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white bg-opacity-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  🤖
                </div>
                <div>
                  <p className="font-bold text-white mb-2">AI Learning Recommendation</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    Your pronunciation score is lowest at 60%. Based on your learning pattern, I recommend practicing the <strong className="text-white">Doctor Visit</strong> scenario 3 times this week. It focuses on clear speech and will help improve your pronunciation significantly!
                  </p>
                  <button
                    onClick={() => navigate('/pronunciation')}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                  >
                    🎤 Practice Pronunciation →
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            {sessions.map((session, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-600 transition group">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getScoreBg(session.score)} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition`}>
                      {session.icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-200">{session.scenario}</p>
                      <p className="text-xs text-gray-500 mt-1">{session.date} • {session.duration}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getScoreColor(session.score)}`}>{session.score}%</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {session.score >= 85 ? '🌟 Excellent' : session.score >= 70 ? '👍 Good' : '📚 Practice more'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-500 mb-1">AI Feedback:</p>
                  <p className="text-sm text-gray-300">💬 {session.feedback}</p>
                </div>

                <div className="mt-3 w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${getScoreBg(session.score)} h-2 rounded-full`}
                    style={{ width: `${session.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  )
}

export default Progress
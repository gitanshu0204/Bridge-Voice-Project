import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function Progress() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

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
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score) => {
    if (score >= 85) return 'bg-green-500'
    if (score >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Hero */}
        <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 opacity-60"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
          <div className="relative p-8 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Your Journey</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Progress Tracker</h2>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                Track your English learning journey, see your improvement and get AI-powered recommendations.
              </p>
              <div className="flex items-center gap-4 mt-4">
                {[
                  { value: '15', label: 'Sessions' },
                  { value: '83%', label: 'Avg Score' },
                  { value: '🔥 7', label: 'Day Streak' },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-lg font-bold text-purple-400">{stat.value}</p>
                    <p className="text-gray-500 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block text-8xl opacity-10">📊</div>
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <p className="font-bold text-white">Overall Score</p>
            <button
              onClick={() => navigate('/chat')}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition"
            >
              + New Session
            </button>
          </div>
          <div className="p-6 flex flex-col md:flex-row items-center gap-8">

            {/* Circular Score */}
            <div className="relative flex-shrink-0">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" fill="none" stroke="#1f2937" strokeWidth="10"/>
                <circle
                  cx="70" cy="70" r="60"
                  fill="none"
                  stroke="url(#scoreGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(overallScore / 100) * 377} 377`}
                  strokeDashoffset="94"
                  transform="rotate(-90 70 70)"
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9333ea"/>
                    <stop offset="100%" stopColor="#3b82f6"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <p className="text-3xl font-bold text-white">{overallScore}%</p>
                <p className="text-gray-500 text-xs">Overall</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-3 gap-3 w-full">
              {[
                { label: 'Total Sessions', value: '15', icon: '🎯' },
                { label: 'Average Score', value: '83%', icon: '📊' },
                { label: 'Day Streak', value: '🔥 7', icon: '⚡' },
                { label: 'Total Practice', value: '2.5h', icon: '⏱️' },
                { label: 'Words Learned', value: '124', icon: '📖' },
                { label: 'Badges Earned', value: '4', icon: '🏆' },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center hover:border-gray-600 transition">
                  <p className="text-lg mb-0.5">{stat.icon}</p>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-gray-500 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-1.5 flex gap-1">
          {[
            { id: 'overview', label: '📈 Overview' },
            { id: 'skills', label: '🧠 Skills' },
            { id: 'history', label: '📅 History' },
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
          <div className="space-y-4">

            {/* Weekly Chart */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <p className="font-bold text-white">This Week</p>
                <span className="text-xs text-green-400 bg-green-900 bg-opacity-30 border border-green-800 px-3 py-1 rounded-full">
                  ↑ 12% vs last week
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-end gap-3 h-40">
                  {weeklyData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="relative w-full flex flex-col items-center">
                        <div className="opacity-0 group-hover:opacity-100 transition absolute -top-7 bg-gray-800 border border-gray-700 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10">
                          {d.score}%
                        </div>
                        <div
                          className="w-full bg-purple-600 rounded-t-lg transition-all hover:bg-purple-500 cursor-pointer"
                          style={{ height: `${(d.score / maxScore) * 130}px` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">{d.day}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Confidence Over Time */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <p className="font-bold text-white">Confidence Growth</p>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { week: 'Week 1', score: 55, label: 'Starting out' },
                  { week: 'Week 2', score: 65, label: 'Getting better' },
                  { week: 'Week 3', score: 72, label: 'Building confidence' },
                  { week: 'Week 4', score: 83, label: 'Great progress!' },
                ].map((w, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <p className="text-xs text-gray-500 w-14 flex-shrink-0">{w.week}</p>
                    <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${w.score}%` }}
                      ></div>
                    </div>
                    <p className="text-xs font-bold text-gray-300 w-8">{w.score}%</p>
                    <p className="text-xs text-gray-600 w-28 hidden md:block">{w.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <p className="font-bold text-white">Skill Breakdown</p>
              </div>
              <div className="p-6 space-y-5">
                {skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span>{skill.icon}</span>
                        <p className="font-medium text-gray-300 text-sm">{skill.name}</p>
                      </div>
                      <p className={`text-sm font-bold ${getScoreColor(skill.score)}`}>{skill.score}%</p>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${skill.color} h-2 rounded-full transition-all`}
                        style={{ width: `${skill.score}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-600 text-xs mt-1">💡 {skill.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <p className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-xs">🤖</span>
                  AI Recommendation
                </p>
              </div>
              <div className="p-6">
                <div className="relative pl-4 border-l-2 border-purple-600">
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    Your pronunciation score is lowest at 60%. Based on your learning pattern, I recommend practicing the <strong className="text-white">Pronunciation Scorer</strong> 3 times this week. It focuses on clear speech and will help you improve significantly!
                  </p>
                  <button
                    onClick={() => navigate('/pronunciation')}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                  >
                    Practice Pronunciation →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <p className="font-bold text-white">Session History</p>
            </div>
            <div className="divide-y divide-gray-800">
              {sessions.map((session, i) => (
                <div key={i} className="px-6 py-4 hover:bg-gray-800 transition">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-purple-600 bg-opacity-20 border border-purple-800 rounded-xl flex items-center justify-center text-lg">
                        {session.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-200 text-sm">{session.scenario}</p>
                        <p className="text-xs text-gray-500">{session.date} • {session.duration}</p>
                      </div>
                    </div>
                    <span className={`text-xl font-bold ${getScoreColor(session.score)}`}>
                      {session.score}%
                    </span>
                  </div>
                  <div className="ml-12">
                    <p className="text-gray-500 text-xs mb-2">💬 {session.feedback}</p>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`${getScoreBg(session.score)} h-1.5 rounded-full`}
                        style={{ width: `${session.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}

export default Progress
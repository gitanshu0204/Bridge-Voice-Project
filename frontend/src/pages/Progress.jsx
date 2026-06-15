import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { fetchActivityLog, getWeeklyScores, getSkillBreakdown, getOverallAvgScore, getTotalSessions } from '../utils/activityTracker'
import { getProgress } from '../utils/xpTracker'

function Progress() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [activityLog, setActivityLog] = useState([])
  const [streak, setStreak] = useState(0)
  const [totalXP, setTotalXP] = useState(0)

  useEffect(() => {
    getProgress().then(p => {
      setStreak(p.streak || 0)
      setTotalXP(p.total_xp || 0)
    })
    fetchActivityLog().then(log => setActivityLog(log))
  }, [])

  const weeklyData = getWeeklyScores(activityLog)
  const skills = getSkillBreakdown(activityLog)
  const overallScore = getOverallAvgScore(activityLog)
  const totalSessions = getTotalSessions(activityLog)

  const skillTips = {
    Grammar: 'Practice grammar checks regularly to spot patterns in your mistakes',
    Pronunciation: 'Repeat tricky words slowly, then speed up gradually',
    Vocabulary: 'Review words you got wrong — repetition builds memory',
    Interview: 'Practice answering with the STAR method for structure',
    Translation: 'Read sentences fully before translating — context matters',
  }

  const skillColors = ['from-purple-600 to-purple-400', 'from-blue-600 to-blue-400', 'from-green-600 to-green-400', 'from-orange-600 to-orange-400', 'from-pink-600 to-pink-400']

  const maxWeeklyScore = Math.max(...weeklyData.map(d => d.score), 1)

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    if (score === 0) return 'text-gray-600'
    return 'text-red-400'
  }

  const getScoreBg = (score) => {
    if (score >= 85) return 'bg-green-500'
    if (score >= 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const typeIcons = {
    grammar: '✍️',
    pronunciation: '🎤',
    quiz: '🧠',
    interview: '💼',
    translation: '🌍',
    daily_challenge: '🎯',
  }

  const typeLabels = {
    grammar: 'Grammar Check',
    pronunciation: 'Pronunciation',
    quiz: 'Vocabulary Quiz',
    interview: 'Interview Practice',
    translation: 'Translation Quiz',
    daily_challenge: 'Daily Challenge',
  }

  const formatRelativeDate = (dateStr) => {
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yStr = yesterday.toISOString().split('T')[0]
    if (dateStr === today) return 'Today'
    if (dateStr === yStr) return 'Yesterday'
    const date = new Date(dateStr)
    const diffDays = Math.round((new Date(today) - date) / (1000 * 60 * 60 * 24))
    return `${diffDays} days ago`
  }

  // Find weakest skill for AI recommendation
  const skillsWithData = skills.filter(s => s.count > 0)
  const weakestSkill = skillsWithData.length > 0
    ? skillsWithData.reduce((min, s) => s.score < min.score ? s : min, skillsWithData[0])
    : null

  const recommendationPaths = {
    Grammar: '/grammar',
    Pronunciation: '/pronunciation',
    Vocabulary: '/quiz',
    Interview: '/interview',
    Translation: '/translator',
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
                  { value: totalSessions, label: 'Sessions' },
                  { value: totalSessions > 0 ? `${overallScore}%` : '—', label: 'Avg Score' },
                  { value: `🔥 ${streak}`, label: 'Day Streak' },
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
                <p className="text-3xl font-bold text-white">{totalSessions > 0 ? `${overallScore}%` : '—'}</p>
                <p className="text-gray-500 text-xs">Overall</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex-1 grid grid-cols-3 gap-3 w-full">
              {[
                { label: 'Total Sessions', value: totalSessions, icon: '🎯' },
                { label: 'Average Score', value: totalSessions > 0 ? `${overallScore}%` : '—', icon: '📊' },
                { label: 'Day Streak', value: `🔥 ${streak}`, icon: '⚡' },
                { label: 'Total XP', value: totalXP, icon: '⭐' },
                { label: 'Best Skill', value: skillsWithData.length > 0 ? skillsWithData.reduce((max, s) => s.score > max.score ? s : max, skillsWithData[0]).name : '—', icon: '🏆' },
                { label: 'Needs Work', value: weakestSkill ? weakestSkill.name : '—', icon: '📈' },
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
              <div className="px-6 py-4 border-b border-gray-800">
                <p className="font-bold text-white">This Week</p>
                <p className="text-gray-500 text-xs mt-0.5">Average score per day based on your activity</p>
              </div>
              <div className="p-6">
                {totalSessions === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-3xl mb-2 opacity-30">📊</p>
                    <p className="text-gray-600 text-sm">Complete activities to see your weekly chart</p>
                  </div>
                ) : (
                  <div className="flex items-end gap-3 h-40">
                    {weeklyData.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="relative w-full flex flex-col items-center justify-end" style={{ height: '130px' }}>
                          {d.score > 0 && (
                            <div className="opacity-0 group-hover:opacity-100 transition absolute -top-7 bg-gray-800 border border-gray-700 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap z-10">
                              {d.score}% ({d.sessions} session{d.sessions !== 1 ? 's' : ''})
                            </div>
                          )}
                          <div
                            className={`w-full rounded-t-lg transition-all hover:bg-purple-500 cursor-pointer ${
                              d.score > 0 ? 'bg-purple-600' : 'bg-gray-800'
                            }`}
                            style={{ height: `${d.score > 0 ? (d.score / maxWeeklyScore) * 130 : 4}px` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500">{d.day}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Activity Breakdown */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <p className="font-bold text-white">Activity Breakdown</p>
                <p className="text-gray-500 text-xs mt-0.5">Number of sessions completed per feature</p>
              </div>
              <div className="p-6">
                {skillsWithData.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-3xl mb-2 opacity-30">🎯</p>
                    <p className="text-gray-600 text-sm">No activities completed yet</p>
                    <p className="text-gray-700 text-xs mt-1">Try Grammar Check, Pronunciation, Quiz, Interview or Translation Quiz</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {skills.map((skill, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2">
                            <span>{skill.icon}</span>
                            <p className="font-medium text-gray-300 text-sm">{skill.name}</p>
                          </div>
                          <p className="text-gray-500 text-xs">{skill.count} session{skill.count !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`bg-gradient-to-r ${skillColors[i % skillColors.length]} h-2 rounded-full transition-all`}
                            style={{ width: `${Math.min((skill.count / Math.max(...skills.map(s => s.count), 1)) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <p className="font-bold text-white">Skill Breakdown</p>
                <p className="text-gray-500 text-xs mt-0.5">Average score per skill based on your sessions</p>
              </div>
              <div className="p-6 space-y-5">
                {skills.map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span>{skill.icon}</span>
                        <p className="font-medium text-gray-300 text-sm">{skill.name}</p>
                        {skill.count > 0 && (
                          <span className="text-gray-600 text-xs">({skill.count} session{skill.count !== 1 ? 's' : ''})</span>
                        )}
                      </div>
                      <p className={`text-sm font-bold ${getScoreColor(skill.score)}`}>
                        {skill.count > 0 ? `${skill.score}%` : '—'}
                      </p>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${skillColors[i % skillColors.length]} h-2 rounded-full transition-all`}
                        style={{ width: `${skill.score}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-600 text-xs mt-1">
                      {skill.count > 0 ? `💡 ${skillTips[skill.name]}` : `Not practiced yet — try ${skill.name}!`}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <p className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-xs">🤖</span>
                  Recommendation
                </p>
              </div>
              <div className="p-6">
                <div className="relative pl-4 border-l-2 border-purple-600">
                  {weakestSkill ? (
                    <>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        Your <strong className="text-white">{weakestSkill.name}</strong> score is lowest at {weakestSkill.score}%. Based on your activity, I recommend practicing this area more this week to bring up your overall score!
                      </p>
                      <button
                        onClick={() => navigate(recommendationPaths[weakestSkill.name])}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                      >
                        Practice {weakestSkill.name} →
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        You haven't completed any scored activities yet. Try Grammar Check, Pronunciation Scorer, Vocabulary Quiz, Interview Simulator or Translation Quiz to start tracking your progress!
                      </p>
                      <button
                        onClick={() => navigate('/grammar')}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                      >
                        Get Started →
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-800">
              <p className="font-bold text-white">Session History</p>
              <p className="text-gray-500 text-xs mt-0.5">Your last {activityLog.length} sessions</p>
            </div>
            {activityLog.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-4xl mb-3 opacity-30">📅</p>
                <p className="text-gray-400 font-medium mb-1">No session history yet</p>
                <p className="text-gray-600 text-sm">Complete activities to build your history</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800">
                {activityLog.map((session, i) => (
                  <div key={i} className="px-6 py-4 hover:bg-gray-800 transition">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-purple-600 bg-opacity-20 border border-purple-800 rounded-xl flex items-center justify-center text-lg">
                          {typeIcons[session.type] || '📌'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-200 text-sm">{typeLabels[session.type] || session.type}</p>
                          <p className="text-xs text-gray-500">{formatRelativeDate(session.date)} {session.detail && `• ${session.detail}`}</p>
                        </div>
                      </div>
                      <span className={`text-xl font-bold ${getScoreColor(session.score)}`}>
                        {session.score}%
                      </span>
                    </div>
                    <div className="ml-12">
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
            )}
          </div>
        )}

      </div>
    </Layout>
  )
}

export default Progress
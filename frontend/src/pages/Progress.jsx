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

  // AI Insights states
  const [insights, setInsights] = useState(null)
  const [insightsLoading, setInsightsLoading] = useState(false)
  const [insightsError, setInsightsError] = useState('')
  const [insightsGenerated, setInsightsGenerated] = useState(false)

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

  const skillColors = [
    'from-purple-600 to-purple-400',
    'from-blue-600 to-blue-400',
    'from-green-600 to-green-400',
    'from-orange-600 to-orange-400',
    'from-pink-600 to-pink-400'
  ]

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

  const skillsWithData = skills.filter(s => s.count > 0)
  const weakestSkill = skillsWithData.length > 0
    ? skillsWithData.reduce((min, s) => s.score < min.score ? s : min, skillsWithData[0])
    : null
  const strongestSkill = skillsWithData.length > 0
    ? skillsWithData.reduce((max, s) => s.score > max.score ? s : max, skillsWithData[0])
    : null

  const recommendationPaths = {
    Grammar: '/grammar',
    Pronunciation: '/pronunciation',
    Vocabulary: '/quiz',
    Interview: '/interview',
    Translation: '/translator',
  }

  // === AI INSIGHTS ===
  const generateInsights = async () => {
    if (activityLog.length < 3) {
      setInsightsError('You need at least 3 completed sessions before AI can analyze your progress. Keep practicing!')
      return
    }

    setInsightsLoading(true)
    setInsightsError('')
    setInsights(null)

    try {
      const email = localStorage.getItem('email')
      const proficiencyLevel = localStorage.getItem('proficiencyLevel') || 'Beginner'
      const nativeLanguage = localStorage.getItem('nativeLanguage') || 'English'

      // Build skill summary for the prompt
      const skillSummary = skillsWithData.map(s =>
        `${s.name}: ${s.count} sessions, average score ${s.score}%`
      ).join('\n')

      // Build recent sessions summary
      const recentSessions = activityLog.slice(0, 10).map(s =>
        `${typeLabels[s.type] || s.type}: ${s.score}% on ${s.date}`
      ).join('\n')

      // Weekly trend
      const weeklyWithData = weeklyData.filter(d => d.score > 0)
      const weeklyTrend = weeklyWithData.length > 1
        ? weeklyWithData[weeklyWithData.length - 1].score > weeklyWithData[0].score
          ? 'improving'
          : 'declining'
        : 'stable'

      const response = await fetch('http://127.0.0.1:8000/api/chat/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill_summary: skillSummary,
          recent_sessions: recentSessions,
          overall_score: overallScore,
          total_sessions: totalSessions,
          streak: streak,
          total_xp: totalXP,
          weekly_trend: weeklyTrend,
          proficiency_level: proficiencyLevel,
          native_language: nativeLanguage,
          weakest_skill: weakestSkill?.name || '',
          strongest_skill: strongestSkill?.name || '',
        })
      })

      const data = await response.json()
      setInsights(data)
      setInsightsGenerated(true)

    } catch (err) {
      setInsightsError('Could not generate insights. Make sure the backend is running!')
    }
    setInsightsLoading(false)
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

            <div className="flex-1 grid grid-cols-3 gap-3 w-full">
              {[
                { label: 'Total Sessions', value: totalSessions, icon: '🎯' },
                { label: 'Average Score', value: totalSessions > 0 ? `${overallScore}%` : '—', icon: '📊' },
                { label: 'Day Streak', value: `🔥 ${streak}`, icon: '⚡' },
                { label: 'Total XP', value: totalXP, icon: '⭐' },
                { label: 'Best Skill', value: strongestSkill ? strongestSkill.name : '—', icon: '🏆' },
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

        {/* Tabs — now with AI Insights */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-1.5 flex gap-1">
          {[
            { id: 'overview', label: '📈 Overview' },
            { id: 'skills', label: '🧠 Skills' },
            { id: 'history', label: '📅 History' },
            { id: 'insights', label: '🤖 AI Insights' },
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
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

        {/* Skills Tab */}
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

        {/* History Tab */}
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

        {/* ===== AI INSIGHTS TAB ===== */}
        {activeTab === 'insights' && (
          <div className="space-y-4">

            {/* Intro Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center text-sm">🤖</div>
                  <div>
                    <p className="font-bold text-white text-sm">AI Learning Insights</p>
                    <p className="text-gray-500 text-xs">Powered by LLaMA 3.3 via Groq</p>
                  </div>
                </div>
                <button
                  onClick={generateInsights}
                  disabled={insightsLoading}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center gap-2"
                >
                  {insightsLoading ? (
                    <>
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing...
                    </>
                  ) : insightsGenerated ? '🔄 Refresh Insights' : '✨ Generate Insights'}
                </button>
              </div>

              <div className="p-6">
                {/* Not enough data */}
                {insightsError && (
                  <div className="bg-yellow-900 bg-opacity-20 border border-yellow-800 rounded-xl px-4 py-3 flex items-start gap-3">
                    <span className="text-yellow-400 text-lg flex-shrink-0">⚠️</span>
                    <p className="text-yellow-300 text-sm">{insightsError}</p>
                  </div>
                )}

                {/* Loading */}
                {insightsLoading && (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <div className="w-12 h-12 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-center">
                      <p className="text-gray-300 font-medium text-sm">AI is analyzing your learning data...</p>
                      <p className="text-gray-500 text-xs mt-1">Reviewing {activityLog.length} sessions across {skillsWithData.length} skills</p>
                    </div>
                  </div>
                )}

                {/* Empty state — not yet generated */}
                {!insightsLoading && !insights && !insightsError && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-purple-600 bg-opacity-20 border border-purple-800 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                      🤖
                    </div>
                    <p className="text-white font-bold mb-2">Ready to Analyze Your Progress</p>
                    <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed mb-2">
                      AI will analyze your {activityLog.length} sessions, identify patterns, and give you a personalized learning report with specific recommendations.
                    </p>
                    <p className="text-gray-600 text-xs">Click "Generate Insights" to get started</p>
                  </div>
                )}

                {/* Insights Results */}
                {insights && !insightsLoading && (
                  <div className="space-y-5">

                    {/* Overall Assessment */}
                    {insights.overall_assessment && (
                      <div className="bg-purple-900 bg-opacity-20 border border-purple-800 rounded-2xl p-5">
                        <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">📋 Overall Assessment</p>
                        <p className="text-gray-200 text-sm leading-relaxed">{insights.overall_assessment}</p>
                      </div>
                    )}

                    {/* Strengths + Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      {/* Strengths */}
                      {insights.strengths && insights.strengths.length > 0 && (
                        <div className="bg-green-900 bg-opacity-10 border border-green-900 rounded-2xl p-5">
                          <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-3">✅ Your Strengths</p>
                          <div className="space-y-2">
                            {insights.strengths.map((s, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="text-green-400 text-sm mt-0.5 flex-shrink-0">•</span>
                                <p className="text-gray-300 text-sm">{s}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Areas to Improve */}
                      {insights.areas_to_improve && insights.areas_to_improve.length > 0 && (
                        <div className="bg-orange-900 bg-opacity-10 border border-orange-900 rounded-2xl p-5">
                          <p className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">⚠️ Areas to Improve</p>
                          <div className="space-y-2">
                            {insights.areas_to_improve.map((a, i) => (
                              <div key={i} className="flex items-start gap-2">
                                <span className="text-orange-400 text-sm mt-0.5 flex-shrink-0">•</span>
                                <p className="text-gray-300 text-sm">{a}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Trend Analysis */}
                    {insights.trend_analysis && (
                      <div className="bg-blue-900 bg-opacity-10 border border-blue-900 rounded-2xl p-5">
                        <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">📈 Trend Analysis</p>
                        <p className="text-gray-300 text-sm leading-relaxed">{insights.trend_analysis}</p>
                      </div>
                    )}

                    {/* Weekly Focus */}
                    {insights.weekly_focus && insights.weekly_focus.length > 0 && (
                      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">🎯 This Week's Focus Plan</p>
                        <div className="space-y-3">
                          {insights.weekly_focus.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3">
                              <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                                {i + 1}
                              </div>
                              <p className="text-gray-300 text-sm">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Motivational Message */}
                    {insights.motivational_message && (
                      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-5 flex items-start gap-4">
                        <span className="text-3xl flex-shrink-0">💪</span>
                        <div>
                          <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Message from your AI Coach</p>
                          <p className="text-gray-300 text-sm leading-relaxed italic">"{insights.motivational_message}"</p>
                        </div>
                      </div>
                    )}

                    {/* Quick Action Buttons */}
                    {insights.recommended_action && (
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => navigate(recommendationPaths[weakestSkill?.name] || '/daily')}
                          className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition"
                        >
                          🎯 Start Recommended Practice
                        </button>
                        <button
                          onClick={() => navigate('/daily')}
                          className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-5 py-2.5 rounded-xl text-sm font-medium transition"
                        >
                          📅 Today's Challenge
                        </button>
                      </div>
                    )}

                    {/* Generated timestamp */}
                    <p className="text-gray-700 text-xs text-center">
                      Generated by LLaMA 3.3-70B via Groq • {new Date().toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}

export default Progress
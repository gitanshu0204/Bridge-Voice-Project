const API = 'http://127.0.0.1:8000/api'

const typeLabels = {
  grammar: { label: 'Grammar Check', icon: '✍️' },
  pronunciation: { label: 'Pronunciation', icon: '🎤' },
  quiz: { label: 'Vocabulary Quiz', icon: '🧠' },
  interview: { label: 'Interview Practice', icon: '💼' },
  translation: { label: 'Translation Quiz', icon: '🌍' },
  daily_challenge: { label: 'Daily Challenge', icon: '🎯' },
}

export const logActivity = async ({ type, score, detail = '' }) => {
  const email = localStorage.getItem('email')
  if (!email) return

  try {
    await fetch(`${API}/activity/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: email, type, score, detail })
    })
  } catch (err) {
    console.log('logActivity error:', err)
  }
}

export const fetchActivityLog = async () => {
  const email = localStorage.getItem('email')
  if (!email) return []

  try {
    const res = await fetch(`${API}/activity/log?email=${encodeURIComponent(email)}`)
    return await res.json()
  } catch (err) {
    console.log('fetchActivityLog error:', err)
    return []
  }
}

// ---- Helper computations (take a log array, no fetching) ----

export const getRecentActivity = (log, n = 5) => {
  return log.slice(0, n).map(entry => ({
    icon: typeLabels[entry.type]?.icon || '📌',
    action: typeLabels[entry.type]?.label || entry.type,
    scenario: entry.detail,
    score: `${entry.score}%`,
    time: formatRelativeDate(entry.date),
  }))
}

export const getTotalSessions = (log) => log.length

export const getOverallAvgScore = (log) => {
  if (log.length === 0) return 0
  const total = log.reduce((sum, e) => sum + e.score, 0)
  return Math.round(total / log.length)
}

export const getSkillBreakdown = (log) => {
  const skills = {
    grammar: { name: 'Grammar', icon: '✍️', scores: [] },
    pronunciation: { name: 'Pronunciation', icon: '🎤', scores: [] },
    quiz: { name: 'Vocabulary', icon: '📖', scores: [] },
    interview: { name: 'Interview', icon: '💼', scores: [] },
    translation: { name: 'Translation', icon: '🌍', scores: [] },
  }

  log.forEach(entry => {
    if (skills[entry.type]) {
      skills[entry.type].scores.push(entry.score)
    }
  })

  return Object.entries(skills).map(([key, val]) => ({
    name: val.name,
    icon: val.icon,
    score: val.scores.length > 0
      ? Math.round(val.scores.reduce((a, b) => a + b, 0) / val.scores.length)
      : 0,
    count: val.scores.length,
  }))
}

export const getWeeklyScores = (log) => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })

    const dayEntries = log.filter(e => e.date === dateStr)
    const avgScore = dayEntries.length > 0
      ? Math.round(dayEntries.reduce((sum, e) => sum + e.score, 0) / dayEntries.length)
      : 0

    days.push({ day: dayName, score: avgScore, sessions: dayEntries.length })
  }
  return days
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
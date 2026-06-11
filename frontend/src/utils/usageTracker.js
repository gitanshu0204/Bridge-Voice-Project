const LIMITS = {
  free: {
    chat: 10,
    grammar: 5,
    pronunciation: 5,
    interview: 3,
    quiz_ai: 3,
    daily_challenge: 3,
  }
}

const getToday = () => new Date().toISOString().split('T')[0]

export const checkLimit = (feature) => {
  const plan = localStorage.getItem('plan') || 'free'
  if (plan !== 'free') return { allowed: true, remaining: 999, limit: 999 }

  const today = getToday()
  const key = `usage_${feature}_${today}`
  const used = parseInt(localStorage.getItem(key) || '0')
  const limit = LIMITS.free[feature] || 999
  const remaining = limit - used

  return {
    allowed: remaining > 0,
    remaining,
    limit,
    used
  }
}

export const trackUsage = (feature) => {
  const today = getToday()
  const key = `usage_${feature}_${today}`
  const used = parseInt(localStorage.getItem(key) || '0')
  localStorage.setItem(key, used + 1)
}

export const getUsageStats = () => {
  const today = getToday()
  const features = ['chat', 'grammar', 'pronunciation', 'interview', 'quiz_ai', 'daily_challenge']
  const stats = {}
  features.forEach(f => {
    const used = parseInt(localStorage.getItem(`usage_${f}_${today}`) || '0')
    const limit = LIMITS.free[f] || 999
    stats[f] = { used, limit, remaining: limit - used }
  })
  return stats
}
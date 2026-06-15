const API = 'http://127.0.0.1:8000/api'

export const addXP = async (amount, reason = '') => {
  const email = localStorage.getItem('email')
  if (!email) return null

  try {
    const res = await fetch(`${API}/progress/add-xp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_email: email, amount, reason })
    })
    return await res.json()
  } catch (err) {
    console.log('addXP error:', err)
    return null
  }
}

export const getProgress = async () => {
  const email = localStorage.getItem('email')
  if (!email) return { total_xp: 0, streak: 0, last_active_date: null }

  try {
    const res = await fetch(`${API}/progress?email=${encodeURIComponent(email)}`)
    return await res.json()
  } catch (err) {
    console.log('getProgress error:', err)
    return { total_xp: 0, streak: 0, last_active_date: null }
  }
}
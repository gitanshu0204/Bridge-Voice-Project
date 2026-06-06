import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../assets/logo'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('email', formData.email)
        navigate('/dashboard')
      } else {
        setError(data.detail || 'Login failed')
      }
    } catch (err) {
      setError('Cannot connect to server. Make sure backend is running.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* Left Side — Branding */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gray-900 border-r border-gray-800 px-12">
        <Logo size={40} />
        <h1 className="text-4xl font-bold mt-6 mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          BridgeVoice
        </h1>
        <p className="text-gray-400 text-center text-lg leading-relaxed max-w-sm">
          Your AI-powered English conversation partner. Practice, improve and build confidence every day.
        </p>

        <div className="mt-12 space-y-4 w-full max-w-sm">
          {[
            { icon: '🗣️', text: 'AI conversation practice' },
            { icon: '📊', text: 'Track your progress' },
            { icon: '🏆', text: 'Earn badges and XP' },
            { icon: '💼', text: '60+ interview scenarios' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3">
              <span className="text-xl">{item.icon}</span>
              <p className="text-gray-300 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side — Login Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8">
        <div className="w-full max-w-md">

          <div className="md:hidden flex justify-center mb-8">
            <Logo size={24} />
          </div>

          <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
          <p className="text-gray-400 mb-8">Login to continue your English journey</p>

          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Your password"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl font-bold text-lg transition disabled:opacity-50 shadow-lg shadow-purple-900"
            >
              {loading ? 'Logging in...' : 'Login →'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium">
              Create one free
            </Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Login
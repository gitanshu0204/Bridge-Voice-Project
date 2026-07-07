import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function AnimatedBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
    }))

    let gradientAngle = 0

    const draw = () => {
      gradientAngle += 0.003
      const x1 = canvas.width / 2 + Math.cos(gradientAngle) * canvas.width * 0.4
      const y1 = canvas.height / 2 + Math.sin(gradientAngle) * canvas.height * 0.4
      const x2 = canvas.width / 2 + Math.cos(gradientAngle + Math.PI) * canvas.width * 0.4
      const y2 = canvas.height / 2 + Math.sin(gradientAngle + Math.PI) * canvas.height * 0.4

      const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
      gradient.addColorStop(0, '#0f0720')
      gradient.addColorStop(0.3, '#1a0a2e')
      gradient.addColorStop(0.6, '#0d1117')
      gradient.addColorStop(1, '#0a1628')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const blobs = [
        { x: canvas.width * 0.3, y: canvas.height * 0.3, color: 'rgba(147, 51, 234, 0.10)' },
        { x: canvas.width * 0.8, y: canvas.height * 0.7, color: 'rgba(59, 130, 246, 0.10)' },
        { x: canvas.width * 0.5, y: canvas.height * 0.5, color: 'rgba(139, 92, 246, 0.06)' },
      ]
      blobs.forEach(blob => {
        const blobGrad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, 280)
        blobGrad.addColorStop(0, blob.color)
        blobGrad.addColorStop(1, 'transparent')
        ctx.fillStyle = blobGrad
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(167, 139, 250, ${p.opacity})`
        ctx.fill()
      })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 80) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  )
}

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
    <div className="min-h-screen text-white flex">

      {/* LEFT SIDE — solid dark, branding */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gray-900 border-r border-gray-800 px-12">

        {/* Animated SVG Logo — TOP */}
        <svg width="340" height="130" viewBox="0 0 680 300" className="mb-2">
          <defs>
            <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#9333ea' }} />
              <stop offset="100%" style={{ stopColor: '#3b82f6' }} />
            </linearGradient>
            <style>{`
              @keyframes growUp {
                0% { transform: scaleY(0); opacity: 0; }
                100% { transform: scaleY(1); opacity: 1; }
              }
              .lbar { transform-origin: bottom; animation: growUp 0.4s ease forwards; opacity: 0; }
              .lb1{animation-delay:0.1s}.lb2{animation-delay:0.2s}.lb3{animation-delay:0.3s}
              .lb4{animation-delay:0.4s}.lb5{animation-delay:0.5s}.lb6{animation-delay:0.6s}
              .lb7{animation-delay:0.7s}.lb8{animation-delay:0.8s}.lb9{animation-delay:0.9s}
              .lb10{animation-delay:1.0s}.lb11{animation-delay:1.1s}.lb12{animation-delay:1.2s}
              @keyframes fadeIn { 0%{opacity:0} 100%{opacity:1} }
              .lland { animation: fadeIn 0.5s ease forwards; opacity: 0; }
              .ll1{animation-delay:0s}.ll2{animation-delay:1.3s}
            `}</style>
          </defs>
          <rect className="lland ll1" x="170" y="148" width="50" height="12" rx="6" fill="url(#lg1)"/>
          <rect className="lland ll2" x="460" y="148" width="50" height="12" rx="6" fill="url(#lg1)"/>
          <rect className="lbar lb1" x="228" y="138" width="14" height="22" rx="4" fill="#9333ea"/>
          <rect className="lbar lb2" x="248" y="128" width="14" height="32" rx="4" fill="#9333ea"/>
          <rect className="lbar lb3" x="268" y="115" width="14" height="45" rx="4" fill="#8b2fe8"/>
          <rect className="lbar lb4" x="288" y="105" width="14" height="55" rx="4" fill="#7c3aed"/>
          <rect className="lbar lb5" x="308" y="98" width="14" height="62" rx="4" fill="url(#lg1)"/>
          <rect className="lbar lb6" x="328" y="94" width="14" height="66" rx="4" fill="url(#lg1)"/>
          <rect className="lbar lb7" x="348" y="94" width="14" height="66" rx="4" fill="url(#lg1)"/>
          <rect className="lbar lb8" x="368" y="98" width="14" height="62" rx="4" fill="url(#lg1)"/>
          <rect className="lbar lb9" x="388" y="105" width="14" height="55" rx="4" fill="#3b82f6"/>
          <rect className="lbar lb10" x="408" y="115" width="14" height="45" rx="4" fill="#3b82f6"/>
          <rect className="lbar lb11" x="428" y="128" width="14" height="32" rx="4" fill="#3b82f6"/>
          <rect className="lbar lb12" x="448" y="138" width="14" height="22" rx="4" fill="#3b82f6"/>
        </svg>

        {/* BridgeVoice text BELOW logo */}
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          BridgeVoice
        </h1>
        <p className="text-gray-400 text-center text-lg leading-relaxed max-w-sm mb-10">
          Your AI-powered English conversation partner. Practice, improve and build confidence every day.
        </p>

        {/* Feature list */}
        <div className="w-full max-w-sm space-y-3">
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

      {/* RIGHT SIDE — animated background + form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 relative overflow-hidden">

        {/* Animated background only on right */}
        <AnimatedBackground />

        {/* Form on top */}
        <div className="relative z-10 w-full max-w-md px-8">

          <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md border border-gray-700 border-opacity-50 rounded-3xl p-8 shadow-2xl">

            <h2 className="text-3xl font-bold mb-2">Welcome back! 👋</h2>
            <p className="text-gray-400 mb-8">Login to continue your English journey</p>

            {error && (
              <div className="bg-red-900 bg-opacity-50 border border-red-700 text-red-300 px-4 py-3 rounded-xl mb-6 text-sm">
                ❌ {error}
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
                  className="w-full bg-gray-800 bg-opacity-80 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Your password"
                    className="w-full bg-gray-800 bg-opacity-80 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition text-sm"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl font-bold text-lg transition disabled:opacity-50 shadow-lg shadow-purple-900/50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Logging in...
                  </span>
                ) : 'Login →'}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium">
                Create one free
              </Link>
            </p>

          </div>

          <div className="flex items-center justify-center gap-6 mt-5">
            {['🔒 Secure', '🆓 Free Forever', '🍁 For Canada'].map((badge, i) => (
              <p key={i} className="text-gray-600 text-xs">{badge}</p>
            ))}
          </div>

        </div>
      </div>

    </div>
  )
}

export default Login
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Logo from '../assets/logo'

function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [userPic, setUserPic] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const email = localStorage.getItem('email')
    if (!email) return

    // Load from localStorage first for instant display
    const cachedPic = localStorage.getItem('userProfilePic')
    if (cachedPic) setUserPic(cachedPic)

    fetch(`http://127.0.0.1:8000/api/users/profile?email=${email}`)
      .then(res => res.json())
      .then(data => {
        setUserName(data.full_name || '')
        const pic = data.profile_picture || null
        setUserPic(pic)
        if (pic) {
          localStorage.setItem('userProfilePic', pic)
        } else {
          localStorage.removeItem('userProfilePic')
        }
      })
      .catch(() => setUserName(''))

    // Listen for avatar updates via custom event instead of polling
    const handleAvatarUpdate = () => {
      const newPic = localStorage.getItem('userProfilePic')
      setUserPic(newPic || null)
    }
    window.addEventListener('avatarUpdated', handleAvatarUpdate)
    return () => window.removeEventListener('avatarUpdated', handleAvatarUpdate)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initial = userName ? userName.charAt(0).toUpperCase() : '?'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    localStorage.removeItem('userProfilePic')
    navigate('/')
  }

  const navItems = [
    { section: 'MAIN', items: [
      { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
      { to: '/chat', icon: '🗣️', label: 'AI Chat' },
      { to: '/daily', icon: '🎯', label: 'Daily Challenge' },
      { to: '/progress', icon: '📊', label: 'Progress' },
    ]},
    { section: 'LEARN', items: [
      { to: '/dictionary', icon: '📖', label: 'Dictionary' },
      { to: '/translator', icon: '🌍', label: 'Translator' },
      { to: '/grammar', icon: '✍️', label: 'Grammar' },
      { to: '/phrases', icon: '💬', label: 'Phrases' },
      { to: '/quiz', icon: '🧠', label: 'Quiz' },
      { to: '/pronunciation', icon: '🎤', label: 'Pronunciation' },
    ]},
    { section: 'PRACTICE', items: [
      { to: '/interview', icon: '💼', label: 'Interview' },
      { to: '/culture', icon: '🍁', label: 'Culture Guide' },
    ]},
    { section: 'COMMUNITY', items: [
      { to: '/community', icon: '👥', label: 'Community' },
    ]},
    { section: 'ACCOUNT', items: [
      { to: '/profile', icon: '👤', label: 'Profile' },
      { to: '/settings', icon: '⚙️', label: 'Settings' },
      { to: '/pricing', icon: '💎', label: 'Upgrade' },
    ]},
  ]

  const isActive = (path) => location.pathname === path

  const themeColors = {
    'purple-blue': ['#7c3aed', '#2563eb'],
    'pink-purple': ['#ec4899', '#7c3aed'],
    'blue-cyan': ['#3b82f6', '#06b6d4'],
    'green-teal': ['#22c55e', '#14b8a6'],
    'orange-red': ['#f97316', '#ef4444'],
    'yellow-orange': ['#facc15', '#f97316'],
    'teal-blue': ['#2dd4bf', '#3b82f6'],
    'red-pink': ['#ef4444', '#ec4899'],
    'indigo-purple': ['#4f46e5', '#9333ea'],
    'green-blue': ['#10b981', '#3b82f6'],
    'purple-pink': ['#c084fc', '#f472b6'],
    'cyan-green': ['#06b6d4', '#22c55e'],
  }

  const getAvatarStyle = () => {
    if (userPic?.startsWith('theme:')) {
      const id = userPic.replace('theme:', '')
      const colors = themeColors[id] || ['#7c3aed', '#2563eb']
      return { background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }
    }
    return { background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 z-50 transition-all duration-300 flex flex-col
        ${collapsed ? 'w-16' : 'w-60'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* Logo */}
        <div className={`flex items-center gap-3 p-4 border-b border-gray-800 ${collapsed ? 'justify-center' : ''}`}>
          <Logo size={16} />
          {!collapsed && (
            <span className="font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent text-lg">
              BridgeVoice
            </span>
          )}
        </div>

        {/* Nav Items */}
        <nav
          className="flex-1 overflow-y-auto py-4 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`nav::-webkit-scrollbar { display: none; }`}</style>
          {navItems.map((section, si) => (
            <div key={si} className="mb-4">
              {!collapsed && (
                <p className="text-xs text-gray-600 font-semibold px-3 mb-2 tracking-wider">
                  {section.section}
                </p>
              )}
              {section.items.map((item, ii) => (
                <Link
                  key={ii}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition group relative ${
                    isActive(item.to)
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                  {collapsed && (
                    <div className="absolute left-14 bg-gray-800 border border-gray-700 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-red-400 hover:bg-red-900 hover:bg-opacity-20 transition ${collapsed ? 'justify-center' : ''}`}
          >
            <span className="text-xl">🚪</span>
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center p-2 m-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition text-gray-400 hover:text-white"
        >
          {collapsed ? '→' : '←'}
        </button>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'md:ml-16' : 'md:ml-60'}`}>

        {/* Top Bar */}
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-400 hover:text-white transition"
          >
            ☰
          </button>

          <div className="flex items-center gap-3 ml-auto relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold hover:opacity-80 transition"
              style={getAvatarStyle()}
            >
              {userPic && !userPic.startsWith('theme:') ? (
                <img src={userPic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white">{initial}</span>
              )}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-10 w-52 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-gray-800">
                  <p className="text-sm font-semibold text-white truncate">{userName || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{localStorage.getItem('email')}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
                  >
                    <span>👤</span> Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
                  >
                    <span>⚙️</span> Settings
                  </Link>
                  <Link
                    to="/progress"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
                  >
                    <span>📊</span> Progress
                  </Link>
                </div>
                <div className="border-t border-gray-800 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900 hover:bg-opacity-20 transition w-full text-left"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
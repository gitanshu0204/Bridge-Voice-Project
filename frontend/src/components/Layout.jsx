import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Logo from '../assets/logo'

function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
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
    ]},
  ]

  const isActive = (path) => location.pathname === path

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
        <nav className="flex-1 overflow-y-auto py-4 px-2">
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

          <div className="flex items-center gap-3 ml-auto">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold">
              G
            </div>
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
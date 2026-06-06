import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function Settings() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState('notifications')
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('bridgevoice_settings')
    return saved ? JSON.parse(saved) : {
      emailNotifications: true,
      practiceReminder: true,
      reminderTime: '09:00',
      reminderEmail: '',
      soundEffects: true,
      autoSpeak: true,
      language: 'English',
      privacy: 'public',
      dailyGoal: '3',
      theme: 'dark',
      fontSize: 'medium',
      showProgress: true,
      weeklyReport: false,
    }
  })

  useEffect(() => {
    applyTheme(settings.theme)
    applyFontSize(settings.fontSize)
  }, [])

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('bridgevoice_theme', theme)
  }

  const applyFontSize = (size) => {
    document.documentElement.setAttribute('data-fontsize', size)
    localStorage.setItem('bridgevoice_fontsize', size)
  }

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    if (key === 'theme') applyTheme(value)
    if (key === 'fontSize') applyFontSize(value)
  }

  const handleSave = () => {
    localStorage.setItem('bridgevoice_settings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    if (settings.practiceReminder && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('BridgeVoice Reminder Set! 🎯', {
            body: `You'll be reminded to practice at ${settings.reminderTime} every day!`,
            icon: '/favicon.ico'
          })
        }
      })
    }
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure? This cannot be undone!')) {
      localStorage.clear()
      navigate('/')
    }
  }

  const Toggle = ({ keyName, size = 'normal' }) => (
    <button
      onClick={() => handleToggle(keyName)}
      className={`rounded-full transition-all duration-300 relative flex-shrink-0 ${
        size === 'large' ? 'w-16 h-8' : 'w-12 h-6'
      } ${settings[keyName]
        ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-900'
        : 'bg-gray-700'
      }`}
    >
      <div className={`bg-white rounded-full shadow-md absolute top-1 transition-all duration-300 ${
        size === 'large'
          ? `w-6 h-6 ${settings[keyName] ? 'translate-x-9' : 'translate-x-1'}`
          : `w-4 h-4 ${settings[keyName] ? 'translate-x-7' : 'translate-x-1'}`
      }`}></div>
    </button>
  )

  const sections = [
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'appearance', icon: '🎨', label: 'Appearance' },
    { id: 'audio', icon: '🔊', label: 'Audio' },
    { id: 'learning', icon: '🎯', label: 'Learning' },
    { id: 'privacy', icon: '🔒', label: 'Privacy' },
    { id: 'account', icon: '👤', label: 'Account' },
  ]

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">⚙️ Settings</h2>
            <p className="text-gray-400 mt-1">Customize your BridgeVoice experience</p>
          </div>
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-purple-900"
          >
            💾 Save Changes
          </button>
        </div>

        {/* Success Toast */}
        {saved && (
          <div className="fixed top-6 right-6 z-50 bg-green-900 border border-green-700 text-green-300 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
            <span className="text-xl">✅</span>
            <p className="font-semibold">Settings saved successfully!</p>
          </div>
        )}

        {/* Theme Quick Toggle - 3D Card */}
        <div className="relative transform hover:scale-[1.01] transition duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-20"></div>
          <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-3xl p-6">
            <p className="font-bold text-gray-200 mb-4 text-lg">🎨 Quick Theme Switch</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChange('theme', 'dark')}
                className={`p-4 rounded-2xl border-2 transition flex items-center gap-3 ${
                  settings.theme === 'dark'
                    ? 'border-purple-500 bg-purple-900 bg-opacity-30'
                    : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="w-10 h-10 bg-gray-950 rounded-xl border border-gray-700 flex items-center justify-center text-xl">🌙</div>
                <div className="text-left">
                  <p className="font-bold text-white">Dark Mode</p>
                  <p className="text-xs text-gray-400">Easy on the eyes</p>
                </div>
                {settings.theme === 'dark' && <span className="ml-auto text-purple-400">✓</span>}
              </button>
              <button
                onClick={() => handleChange('theme', 'light')}
                className={`p-4 rounded-2xl border-2 transition flex items-center gap-3 ${
                  settings.theme === 'light'
                    ? 'border-yellow-500 bg-yellow-900 bg-opacity-20'
                    : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <div className="w-10 h-10 bg-yellow-100 rounded-xl border border-yellow-300 flex items-center justify-center text-xl">☀️</div>
                <div className="text-left">
                  <p className="font-bold text-white">Light Mode</p>
                  <p className="text-xs text-gray-400">Bright and clear</p>
                </div>
                {settings.theme === 'light' && <span className="ml-auto text-yellow-400">✓</span>}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">

          {/* Sidebar Navigation */}
          <div className="w-48 flex-shrink-0 space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-left ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span>{section.icon}</span>
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="flex-1 space-y-4">

            {activeSection === 'notifications' && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
                <h3 className="font-bold text-gray-200 text-lg flex items-center gap-2">
                  🔔 Notification Settings
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-800">
                    <div>
                      <p className="font-medium text-gray-200">Email Notifications</p>
                      <p className="text-xs text-gray-500 mt-0.5">Receive weekly progress reports by email</p>
                    </div>
                    <Toggle keyName="emailNotifications" />
                  </div>

                  {settings.emailNotifications && (
                    <div className="bg-gray-800 rounded-xl p-4">
                      <label className="text-sm text-gray-400 mb-2 block">Your Email Address:</label>
                      <input
                        type="email"
                        value={settings.reminderEmail}
                        onChange={e => handleChange('reminderEmail', e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition text-sm"
                      />
                    </div>
                  )}

                  <div className="flex justify-between items-center py-3 border-b border-gray-800">
                    <div>
                      <p className="font-medium text-gray-200">Daily Practice Reminder</p>
                      <p className="text-xs text-gray-500 mt-0.5">Browser notification to remind you to practice</p>
                    </div>
                    <Toggle keyName="practiceReminder" />
                  </div>

                  {settings.practiceReminder && (
                    <div className="bg-gray-800 rounded-xl p-4">
                      <label className="text-sm text-gray-400 mb-2 block">Reminder Time:</label>
                      <input
                        type="time"
                        value={settings.reminderTime}
                        onChange={e => handleChange('reminderTime', e.target.value)}
                        className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition"
                      />
                      <p className="text-xs text-purple-400 mt-2">💡 Click Save to activate browser notification!</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-3 border-b border-gray-800">
                    <div>
                      <p className="font-medium text-gray-200">Weekly Progress Report</p>
                      <p className="text-xs text-gray-500 mt-0.5">Get a summary of your weekly achievements</p>
                    </div>
                    <Toggle keyName="weeklyReport" />
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <div>
                      <p className="font-medium text-gray-200">Show Progress on Dashboard</p>
                      <p className="text-xs text-gray-500 mt-0.5">Display your stats on the main dashboard</p>
                    </div>
                    <Toggle keyName="showProgress" />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
                <h3 className="font-bold text-gray-200 text-lg">🎨 Appearance Settings</h3>

                <div>
                  <p className="font-medium text-gray-300 mb-3">Font Size</p>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { key: 'small', label: 'Small', size: 'text-xs' },
                      { key: 'medium', label: 'Medium', size: 'text-sm' },
                      { key: 'large', label: 'Large', size: 'text-base' },
                      { key: 'xlarge', label: 'X-Large', size: 'text-lg' },
                    ].map(option => (
                      <button
                        key={option.key}
                        onClick={() => handleChange('fontSize', option.key)}
                        className={`p-3 rounded-xl border-2 transition text-center ${
                          settings.fontSize === option.key
                            ? 'border-purple-500 bg-purple-900 bg-opacity-30'
                            : 'border-gray-700 hover:border-gray-500'
                        }`}
                      >
                        <p className={`font-bold text-white ${option.size}`}>Aa</p>
                        <p className="text-xs text-gray-400 mt-1">{option.label}</p>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-purple-400 mt-2">💡 Font size changes instantly when you click!</p>
                </div>

                <div className="border-t border-gray-800 pt-4">
                  <p className="font-medium text-gray-300 mb-3">Interface Language</p>
                  <select
                    value={settings.language}
                    onChange={e => handleChange('language', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition"
                  >
                    {['English', 'Hindi', 'Mandarin', 'Arabic', 'Spanish', 'Punjabi', 'French'].map(lang => (
                      <option key={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {activeSection === 'audio' && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
                <h3 className="font-bold text-gray-200 text-lg">🔊 Audio Settings</h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-800">
                    <div>
                      <p className="font-medium text-gray-200">Sound Effects</p>
                      <p className="text-xs text-gray-500 mt-0.5">Play sounds for achievements and correct answers</p>
                    </div>
                    <Toggle keyName="soundEffects" />
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <div>
                      <p className="font-medium text-gray-200">Auto-Speak AI Responses</p>
                      <p className="text-xs text-gray-500 mt-0.5">AI automatically reads responses aloud in chat</p>
                    </div>
                    <Toggle keyName="autoSpeak" />
                  </div>
                </div>

                <div className="bg-purple-900 bg-opacity-20 border border-purple-700 rounded-xl p-4">
                  <p className="text-purple-300 text-sm font-medium mb-1">🎤 Test Your Audio</p>
                  <p className="text-gray-400 text-xs mb-3">Click to hear a sample pronunciation</p>
                  <button
                    onClick={() => {
                      if ('speechSynthesis' in window) {
                        const u = new SpeechSynthesisUtterance('Hello! Welcome to BridgeVoice. Your audio is working perfectly!')
                        u.lang = 'en-CA'
                        window.speechSynthesis.speak(u)
                      }
                    }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition hover:opacity-90"
                  >
                    🔊 Test Audio
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'learning' && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
                <h3 className="font-bold text-gray-200 text-lg">🎯 Learning Preferences</h3>

                <div>
                  <p className="font-medium text-gray-300 mb-3">Daily Session Goal</p>
                  <div className="grid grid-cols-5 gap-3">
                    {['1', '2', '3', '5', '10'].map(num => (
                      <button
                        key={num}
                        onClick={() => handleChange('dailyGoal', num)}
                        className={`p-3 rounded-xl border-2 transition text-center ${
                          settings.dailyGoal === num
                            ? 'border-purple-500 bg-purple-900 bg-opacity-30'
                            : 'border-gray-700 hover:border-gray-500'
                        }`}
                      >
                        <p className="text-xl font-bold text-white">{num}</p>
                        <p className="text-xs text-gray-400 mt-1">session{num !== '1' ? 's' : ''}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-4">
                  <p className="font-medium text-gray-300 mb-2">Current Goal</p>
                  <div className="bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-white">{settings.dailyGoal}</p>
                    <p className="text-purple-300 text-sm">session{settings.dailyGoal !== '1' ? 's' : ''} per day</p>
                    <div className="w-full bg-gray-800 rounded-full h-2 mt-3">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                        style={{ width: `${(1 / parseInt(settings.dailyGoal)) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-400 text-xs mt-2">1/{settings.dailyGoal} completed today</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
                <h3 className="font-bold text-gray-200 text-lg">🔒 Privacy Settings</h3>

                <div>
                  <p className="font-medium text-gray-300 mb-3">Profile Visibility</p>
                  <div className="space-y-3">
                    {[
                      { value: 'public', label: 'Everyone', desc: 'Anyone on BridgeVoice can see your profile', icon: '🌍' },
                      { value: 'buddies', label: 'Study Buddies Only', desc: 'Only your connected study buddies', icon: '🤝' },
                      { value: 'private', label: 'Private', desc: 'Nobody can see your profile', icon: '🔒' },
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleChange('privacy', option.value)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left ${
                          settings.privacy === option.value
                            ? 'border-purple-500 bg-purple-900 bg-opacity-20'
                            : 'border-gray-700 hover:border-gray-500'
                        }`}
                      >
                        <span className="text-2xl">{option.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium text-white">{option.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{option.desc}</p>
                        </div>
                        {settings.privacy === option.value && <span className="text-purple-400">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'account' && (
              <div className="space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
                  <h3 className="font-bold text-gray-200 text-lg">👤 Account Settings</h3>
                  {[
                    { icon: '🔒', label: 'Change Password', desc: 'Update your account password' },
                    { icon: '📧', label: 'Change Email', desc: 'Update your email address' },
                    { icon: '📥', label: 'Download My Data', desc: 'Export all your learning data' },
                    { icon: '🔄', label: 'Reset Progress', desc: 'Start your learning journey fresh' },
                  ].map((item, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center gap-4 px-4 py-3 rounded-xl border border-gray-700 hover:border-gray-500 hover:bg-gray-800 transition group"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-200 text-sm">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <span className="text-gray-600 group-hover:text-gray-400 transition">→</span>
                    </button>
                  ))}
                </div>

                <div className="bg-red-900 bg-opacity-10 border border-red-900 rounded-2xl p-6">
                  <h3 className="font-bold text-red-400 text-lg mb-4">⚠️ Danger Zone</h3>
                  <p className="text-gray-400 text-sm mb-4">Once you delete your account all your data will be permanently removed. This action cannot be undone!</p>
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-900 bg-opacity-30 hover:bg-opacity-50 border border-red-700 text-red-400 px-5 py-3 rounded-xl transition font-medium w-full"
                  >
                    🗑️ Delete My Account
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Save Button Bottom */}
        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-4 rounded-2xl font-bold text-lg transition shadow-xl shadow-purple-900"
        >
          💾 Save All Settings
        </button>

      </div>
    </Layout>
  )
}

export default Settings
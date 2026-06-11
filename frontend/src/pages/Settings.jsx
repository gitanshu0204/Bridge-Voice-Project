import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function Settings() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [settings, setSettings] = useState({
    notifications: localStorage.getItem('notif') !== 'false',
    dailyReminder: localStorage.getItem('dailyReminder') !== 'false',
    soundEffects: localStorage.getItem('soundEffects') !== 'false',
    autoSpeak: localStorage.getItem('autoSpeak') !== 'false',
    darkMode: true,
    fontSize: localStorage.getItem('fontSize') || 'Medium',
    language: localStorage.getItem('appLanguage') || 'English',
    nativeLanguage: localStorage.getItem('nativeLanguage') || 'Hindi',
    proficiencyLevel: localStorage.getItem('proficiencyLevel') || 'Beginner',
    dailyGoal: localStorage.getItem('dailyGoal') || '3',
    reminderTime: localStorage.getItem('reminderTime') || '09:00',
  })

  const toggle = (key) => {
    const newVal = !settings[key]
    setSettings(prev => ({ ...prev, [key]: newVal }))
    localStorage.setItem(key, newVal.toString())
  }

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    localStorage.setItem(key, value)
  }

  const saveSettings = () => {
    Object.entries(settings).forEach(([key, value]) => {
      localStorage.setItem(key, value.toString())
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const clearData = () => {
    const keep = ['token', 'email', 'profilePic']
    const toRemove = Object.keys(localStorage).filter(k => !keep.includes(k))
    toRemove.forEach(k => localStorage.removeItem(k))
    setShowDeleteModal(false)
    navigate('/dashboard')
  }

  const Toggle = ({ value, onToggle }) => (
    <button
      onClick={onToggle}
      className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${
        value ? 'bg-purple-600' : 'bg-gray-700'
      }`}
    >
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm ${
        value ? 'translate-x-6' : 'translate-x-1'
      }`}></div>
    </button>
  )

  const SettingRow = ({ icon, title, desc, children }) => (
    <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-800 transition">
      <div className="flex items-center gap-3 flex-1 min-w-0 mr-4">
        <span className="text-xl flex-shrink-0">{icon}</span>
        <div className="min-w-0">
          <p className="font-medium text-gray-200 text-sm">{title}</p>
          {desc && <p className="text-gray-500 text-xs mt-0.5">{desc}</p>}
        </div>
      </div>
      {children}
    </div>
  )

  const SectionHeader = ({ title }) => (
    <div className="px-5 py-3 border-b border-gray-800">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
    </div>
  )

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Success Toast */}
        {saved && (
          <div className="fixed top-6 right-6 z-50 bg-green-900 border border-green-700 text-green-300 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <span>✅</span>
            <p className="font-semibold text-sm">Settings saved!</p>
          </div>
        )}

        {/* Hero */}
        <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 opacity-60"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
          <div className="relative p-8 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Preferences</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
              <p className="text-gray-400 text-sm max-w-md leading-relaxed">
                Customize your BridgeVoice experience. All changes are saved automatically.
              </p>
            </div>
            <div className="hidden md:block text-8xl opacity-10">⚙️</div>
          </div>
        </div>

        {/* Learning Settings */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <SectionHeader title="Learning Preferences" />

          <SettingRow
            icon="🌍"
            title="Native Language"
            desc="Your first language — used for AI explanations"
          >
            <select
              value={settings.nativeLanguage}
              onChange={e => updateSetting('nativeLanguage', e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition text-xs"
            >
              {['Hindi', 'Punjabi', 'Mandarin', 'Arabic', 'Spanish', 'French', 'Tagalog', 'Urdu', 'Portuguese', 'Korean'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </SettingRow>

          <div className="border-t border-gray-800">
            <SettingRow
              icon="📊"
              title="English Level"
              desc="Used to personalize your challenges and quizzes"
            >
              <select
                value={settings.proficiencyLevel}
                onChange={e => updateSetting('proficiencyLevel', e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition text-xs"
              >
                {['Beginner', 'Elementary', 'Intermediate', 'Advanced'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </SettingRow>
          </div>

          <div className="border-t border-gray-800">
            <SettingRow
              icon="🎯"
              title="Daily Goal"
              desc="How many sessions you want to complete each day"
            >
              <select
                value={settings.dailyGoal}
                onChange={e => updateSetting('dailyGoal', e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition text-xs"
              >
                {['1', '2', '3', '5', '10'].map(n => (
                  <option key={n} value={n}>{n} session{n !== '1' ? 's' : ''}/day</option>
                ))}
              </select>
            </SettingRow>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <SectionHeader title="Notifications" />

          <SettingRow
            icon="🔔"
            title="Push Notifications"
            desc="Get notified about your progress and streaks"
          >
            <Toggle value={settings.notifications} onToggle={() => toggle('notifications')} />
          </SettingRow>

          <div className="border-t border-gray-800">
            <SettingRow
              icon="⏰"
              title="Daily Reminder"
              desc="Remind me to practice every day"
            >
              <Toggle value={settings.dailyReminder} onToggle={() => toggle('dailyReminder')} />
            </SettingRow>
          </div>

          {settings.dailyReminder && (
            <div className="border-t border-gray-800">
              <SettingRow
                icon="🕐"
                title="Reminder Time"
                desc="What time should we remind you?"
              >
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={e => updateSetting('reminderTime', e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition text-xs"
                />
              </SettingRow>
            </div>
          )}
        </div>

        {/* Audio Settings */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <SectionHeader title="Audio" />

          <SettingRow
            icon="🔊"
            title="Sound Effects"
            desc="Play sounds for correct and wrong answers"
          >
            <Toggle value={settings.soundEffects} onToggle={() => toggle('soundEffects')} />
          </SettingRow>

          <div className="border-t border-gray-800">
            <SettingRow
              icon="🤖"
              title="Auto Speak"
              desc="AI automatically reads responses out loud"
            >
              <Toggle value={settings.autoSpeak} onToggle={() => toggle('autoSpeak')} />
            </SettingRow>
          </div>
        </div>

        {/* Display */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <SectionHeader title="Display" />

          <SettingRow
            icon="🌙"
            title="Dark Mode"
            desc="BridgeVoice looks best in dark mode"
          >
            <Toggle value={settings.darkMode} onToggle={() => toggle('darkMode')} />
          </SettingRow>

          <div className="border-t border-gray-800">
            <SettingRow
              icon="🔤"
              title="Font Size"
              desc="Adjust the text size across the app"
            >
              <div className="flex gap-1">
                {['Small', 'Medium', 'Large'].map(size => (
                  <button
                    key={size}
                    onClick={() => updateSetting('fontSize', size)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      settings.fontSize === size
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </SettingRow>
          </div>
        </div>

        {/* Account */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <SectionHeader title="Account" />

          <SettingRow
            icon="👤"
            title="Edit Profile"
            desc="Update your name, photo and learning goals"
          >
            <button
              onClick={() => navigate('/profile')}
              className="border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium transition"
            >
              Go →
            </button>
          </SettingRow>

          <div className="border-t border-gray-800">
            <SettingRow
              icon="💎"
              title="Upgrade Plan"
              desc="Unlock unlimited access to all features"
            >
              <button
                onClick={() => navigate('/pricing')}
                className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition"
              >
                Upgrade
              </button>
            </SettingRow>
          </div>

          <div className="border-t border-gray-800">
            <SettingRow
              icon="🔑"
              title="Change Password"
              desc="Update your account password"
            >
              <button className="border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium transition">
                Change
              </button>
            </SettingRow>
          </div>

          <div className="border-t border-gray-800">
            <SettingRow
              icon="📤"
              title="Sign Out"
              desc="Sign out of your BridgeVoice account"
            >
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  localStorage.removeItem('email')
                  navigate('/login')
                }}
                className="border border-gray-700 hover:border-red-800 text-gray-400 hover:text-red-400 px-3 py-1.5 rounded-xl text-xs font-medium transition"
              >
                Sign Out
              </button>
            </SettingRow>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-gray-900 border border-red-900 border-opacity-50 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-red-900 border-opacity-30">
            <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Danger Zone</p>
          </div>
          <SettingRow
            icon="🗑️"
            title="Clear All Data"
            desc="Delete all your progress, XP and saved data — cannot be undone"
          >
            <button
              onClick={() => setShowDeleteModal(true)}
              className="border border-red-900 text-red-500 hover:bg-red-900 hover:bg-opacity-20 px-3 py-1.5 rounded-xl text-xs font-medium transition"
            >
              Clear
            </button>
          </SettingRow>
        </div>

        {/* Save Button */}
        <button
          onClick={saveSettings}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3.5 rounded-2xl font-bold transition shadow-lg shadow-purple-900/40"
        >
          💾 Save All Settings
        </button>

        {/* App Info */}
        <div className="text-center space-y-1 pb-4">
          <p className="text-gray-600 text-xs">BridgeVoice v1.0.0</p>
          <p className="text-gray-700 text-xs">Built with ❤️ for newcomers to Canada</p>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-sm w-full">
            <div className="absolute inset-0 bg-red-900 rounded-2xl blur-xl opacity-10"></div>
            <div className="relative bg-gray-900 border border-red-800 rounded-2xl p-6 shadow-2xl">
              <p className="text-3xl text-center mb-3">⚠️</p>
              <h3 className="text-lg font-bold text-white text-center mb-2">Clear All Data?</h3>
              <p className="text-gray-400 text-sm text-center mb-5">
                This will delete all your XP, progress, saved words and challenge history. This cannot be undone!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 border border-gray-700 text-gray-300 hover:text-white py-2.5 rounded-xl text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={clearData}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl text-sm font-bold transition"
                >
                  Yes, Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </Layout>
  )
}

export default Settings
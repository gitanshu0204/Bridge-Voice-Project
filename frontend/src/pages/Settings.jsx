import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function Settings() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    practiceReminder: true,
    reminderTime: '09:00',
    soundEffects: true,
    autoSpeak: true,
    language: 'English',
    privacy: 'public',
    dailyGoal: '3',
  })

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone!')) {
      localStorage.clear()
      navigate('/')
    }
  }

  const Toggle = ({ keyName }) => (
    <button
      onClick={() => handleToggle(keyName)}
      className={`w-12 h-6 rounded-full transition-colors relative ${
        settings[keyName] ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-700'
      }`}
    >
      <div className={`w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-transform ${
        settings[keyName] ? 'translate-x-7' : 'translate-x-1'
      }`}></div>
    </button>
  )

  const SettingRow = ({ label, desc, children }) => (
    <div className="flex justify-between items-center py-4 border-b border-gray-800 last:border-0">
      <div>
        <p className="font-medium text-gray-200">{label}</p>
        {desc && <p className="text-sm text-gray-500 mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  )

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">

        <div className="mb-6">
          <h2 className="text-2xl font-bold">⚙️ Settings</h2>
          <p className="text-gray-400 mt-1">Customize your BridgeVoice experience</p>
        </div>

        {saved && (
          <div className="bg-green-900 bg-opacity-30 border border-green-700 text-green-400 px-4 py-3 rounded-xl mb-6 font-medium">
            ✅ Settings saved successfully!
          </div>
        )}

        <div className="space-y-4">

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-200 mb-2">🔔 Notifications</h3>
            <SettingRow label="Email Notifications" desc="Receive progress updates by email">
              <Toggle keyName="emailNotifications" />
            </SettingRow>
            <SettingRow label="Daily Practice Reminder" desc="Get reminded to practice every day">
              <Toggle keyName="practiceReminder" />
            </SettingRow>
            {settings.practiceReminder && (
              <SettingRow label="Reminder Time" desc="When to remind you">
                <input
                  type="time"
                  value={settings.reminderTime}
                  onChange={e => handleChange('reminderTime', e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </SettingRow>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-200 mb-2">🔊 Audio</h3>
            <SettingRow label="Sound Effects" desc="Play sounds for achievements">
              <Toggle keyName="soundEffects" />
            </SettingRow>
            <SettingRow label="Auto Speak AI Responses" desc="AI reads responses aloud">
              <Toggle keyName="autoSpeak" />
            </SettingRow>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-200 mb-2">🎯 Learning</h3>
            <SettingRow label="Daily Session Goal" desc="How many sessions per day">
              <select
                value={settings.dailyGoal}
                onChange={e => handleChange('dailyGoal', e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="1">1 session</option>
                <option value="2">2 sessions</option>
                <option value="3">3 sessions</option>
                <option value="5">5 sessions</option>
                <option value="10">10 sessions</option>
              </select>
            </SettingRow>
            <SettingRow label="Interface Language" desc="Language for menus and buttons">
              <select
                value={settings.language}
                onChange={e => handleChange('language', e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Mandarin</option>
                <option>Arabic</option>
                <option>Spanish</option>
                <option>Punjabi</option>
                <option>French</option>
              </select>
            </SettingRow>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-200 mb-2">🔒 Privacy</h3>
            <SettingRow label="Profile Visibility" desc="Who can see your profile">
              <select
                value={settings.privacy}
                onChange={e => handleChange('privacy', e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="public">Everyone</option>
                <option value="buddies">Study Buddies Only</option>
                <option value="private">Private</option>
              </select>
            </SettingRow>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-200 mb-4">🔑 Account</h3>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-700 hover:border-gray-500 hover:bg-gray-800 transition text-gray-300 font-medium">
                🔒 Change Password
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-700 hover:border-gray-500 hover:bg-gray-800 transition text-gray-300 font-medium">
                📧 Change Email
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl border border-gray-700 hover:border-gray-500 hover:bg-gray-800 transition text-gray-300 font-medium">
                📥 Download My Data
              </button>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-red-400 mb-4">⚠️ Danger Zone</h3>
            <button
              onClick={handleDeleteAccount}
              className="w-full text-left px-4 py-3 rounded-xl border border-red-900 hover:border-red-700 hover:bg-red-900 hover:bg-opacity-20 transition text-red-400 font-medium"
            >
              🗑️ Delete Account
            </button>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-purple-900"
          >
            Save Settings ✅
          </button>

        </div>
      </div>
    </Layout>
  )
}

export default Settings
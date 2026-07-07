import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Layout from '../components/Layout'

function StudyBuddyChat() {
  const navigate = useNavigate()
  const location = useLocation()
  const buddy = location.state?.buddy
  const email = localStorage.getItem('email')

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messagesLoading, setMessagesLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!buddy) { navigate('/community'); return }
    fetch(`http://127.0.0.1:8000/api/users/profile?email=${email}`)
      .then(res => res.json())
      .then(data => setUserName(data.full_name || 'You'))

    fetchMessages()
    const interval = setInterval(fetchMessages, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/messages/${encodeURIComponent(buddy.email)}?email=${encodeURIComponent(email)}`
      )
      const data = await response.json()
      setMessages(data)
    } catch (err) {
      console.log('Could not fetch messages')
    }
    setMessagesLoading(false)
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return
    setSendingMessage(true)
    const content = newMessage.trim()
    setNewMessage('')

    setMessages(prev => [...prev, {
      id: Date.now(),
      from_email: email,
      content,
      created_at: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      is_mine: true
    }])

    try {
      await fetch('http://127.0.0.1:8000/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from_email: email, to_email: buddy.email, content })
      })
    } catch (err) {
      console.log('Could not send message')
    }
    setSendingMessage(false)
  }

  const avatarColors = [
    'from-purple-600 to-blue-600',
    'from-green-600 to-teal-600',
    'from-orange-600 to-red-600',
    'from-pink-600 to-purple-600',
    'from-blue-600 to-cyan-600',
    'from-yellow-600 to-orange-600',
  ]

  const getColor = (str) => {
    const hash = (str || 'U').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    return avatarColors[hash % avatarColors.length]
  }

  if (!buddy) return null

  return (
    <Layout>
      <div className="max-w-3xl mx-auto h-[calc(100vh-120px)] flex flex-col">

        {/* Chat Header */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4 flex items-center gap-4 mb-4 flex-shrink-0">
          <button
            onClick={() => navigate('/community', { state: { tab: 'buddies' } })}
            className="text-gray-500 hover:text-white transition text-sm flex-shrink-0"
          >
            ← Back
          </button>
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getColor(buddy.full_name)} flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}>
            {buddy.initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white">{buddy.full_name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              <p className="text-xs text-gray-500">{buddy.language_background} speaker • {buddy.proficiency_level} • Study Buddy</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-purple-900 bg-opacity-30 border border-purple-800 rounded-xl px-3 py-1.5">
              <p className="text-purple-400 text-xs font-medium">🤝 Connected</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messagesLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${getColor(buddy.full_name)} flex items-center justify-center text-white font-bold text-3xl shadow-xl mb-4`}>
                  {buddy.initial}
                </div>
                <p className="text-white font-bold text-lg mb-1">{buddy.full_name}</p>
                <p className="text-gray-500 text-sm mb-1">{buddy.language_background} speaker • {buddy.proficiency_level}</p>
                {buddy.goals && <p className="text-purple-400 text-sm mb-6">🎯 {buddy.goals}</p>}
                <div className="bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4 max-w-sm">
                  <p className="text-gray-300 text-sm font-medium mb-1">👋 Say hello!</p>
                  <p className="text-gray-500 text-xs">This is the beginning of your conversation with {buddy.full_name.split(' ')[0]}. Start practicing English together!</p>
                </div>
              </div>
            ) : (
              <>
                {/* Date separator */}
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-gray-800"></div>
                  <p className="text-gray-600 text-xs">Today</p>
                  <div className="flex-1 h-px bg-gray-800"></div>
                </div>

                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                    {!msg.is_mine && (
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${getColor(buddy.full_name)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {buddy.initial}
                      </div>
                    )}
                    <div className={`flex flex-col ${msg.is_mine ? 'items-end' : 'items-start'} max-w-sm`}>
                      {!msg.is_mine && (
                        <p className="text-xs text-gray-600 mb-1 ml-1">{buddy.full_name.split(' ')[0]}</p>
                      )}
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.is_mine
                          ? 'bg-purple-600 text-white rounded-br-sm shadow-lg shadow-purple-900/30'
                          : 'bg-gray-800 border border-gray-700 text-gray-200 rounded-bl-sm'
                      }`}>
                        {msg.content}
                      </div>
                      <p className="text-gray-600 text-xs mt-1 px-1">{msg.created_at}</p>
                    </div>
                    {msg.is_mine && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {userName?.charAt(0).toUpperCase() || 'Y'}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Bar */}
          <div className="px-5 py-4 border-t border-gray-800 flex gap-3 items-center flex-shrink-0">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={`Message ${buddy.full_name.split(' ')[0]}...`}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sendingMessage}
              className="bg-purple-600 hover:bg-purple-500 text-white w-11 h-11 rounded-xl transition disabled:opacity-40 font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-900/30"
            >
              {sendingMessage ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : '→'}
            </button>
          </div>
        </div>

      </div>
    </Layout>
  )
}

export default StudyBuddyChat
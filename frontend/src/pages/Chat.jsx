import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { checkLimit, trackUsage } from '../utils/usageTracker'
import UpgradeModal from '../components/UpgradeModal'

function Chat() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('chat')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your BridgeVoice AI conversation partner. I'm here to help you practice English. What scenario would you like to practice today? You can type or use the microphone button to speak!"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [scenario, setScenario] = useState('General Conversation')
  const [conversations, setConversations] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (activeTab === 'history') fetchConversations()
  }, [activeTab])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchConversations = async () => {
    setHistoryLoading(true)
    const email = localStorage.getItem('email')
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/conversations/${email}`)
      const data = await response.json()
      setConversations(data)
    } catch (err) {
      console.log('Could not fetch conversations')
    }
    setHistoryLoading(false)
  }

  const saveConversation = async () => {
    if (messages.length <= 1) return
    const email = localStorage.getItem('email')
    try {
      await fetch('http://127.0.0.1:8000/api/conversations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: email,
          scenario: scenario,
          messages: messages
        })
      })
      setMessages([{
        role: 'assistant',
        content: "Hello! I'm your BridgeVoice AI conversation partner. What scenario would you like to practice today?"
      }])
      setActiveTab('history')
      fetchConversations()
    } catch (err) {
      console.log('Could not save conversation')
    }
  }

  const deleteConversation = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/conversations/${id}`, { method: 'DELETE' })
      setConversations(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.log('Could not delete')
    }
  }

  const sendMessage = async (text) => {
    if (!text.trim()) return

    const limit = checkLimit('chat')
    if (!limit.allowed) {
      setShowUpgrade(true)
      return
    }
    trackUsage('chat')

    const userMessage = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, scenario })
      })
      const data = await response.json()
      const aiReply = data.reply || "I'm sorry, I couldn't understand that. Could you try again?"
      setMessages(prev => [...prev, { role: 'assistant', content: aiReply }])
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiReply)
        utterance.rate = 0.9
        window.speechSynthesis.speak(utterance)
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please check your connection and try again!"
      }])
    }
    setLoading(false)
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Please use Google Chrome for speech recognition.')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = 'en-US'
    recognitionRef.current.onstart = () => setListening(true)
    recognitionRef.current.onend = () => setListening(false)
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      sendMessage(transcript)
    }
    recognitionRef.current.onerror = () => {
      setListening(false)
      alert('Could not hear you. Please try again.')
    }
    recognitionRef.current.start()
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const getScenarioIcon = (scenario) => {
    const icons = {
      'Job Interview': '💼',
      'Grocery Store': '🛒',
      'Doctor Visit': '🏥',
      'Bank Visit': '🏦',
      'Workplace Chat': '🏢',
      'General Conversation': '💬',
    }
    return icons[scenario] || '💬'
  }

  const chatLimit = checkLimit('chat')

  const scenarios = [
    { label: 'General Conversation', icon: '💬' },
    { label: 'Job Interview', icon: '💼' },
    { label: 'Grocery Store', icon: '🛒' },
    { label: 'Doctor Visit', icon: '🏥' },
    { label: 'Bank Visit', icon: '🏦' },
    { label: 'Workplace Chat', icon: '🏢' },
  ]

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-4">

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white">AI Conversation</h2>
            <p className="text-gray-400 text-sm mt-1">Practice English with your AI conversation partner</p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium ${
            chatLimit.remaining <= 2
              ? 'bg-red-900 bg-opacity-20 border-red-800 text-red-400'
              : chatLimit.remaining <= 5
              ? 'bg-yellow-900 bg-opacity-20 border-yellow-800 text-yellow-400'
              : 'bg-green-900 bg-opacity-20 border-green-800 text-green-400'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            {chatLimit.remaining}/{chatLimit.limit} left today
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-1.5 flex gap-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'chat'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📜 History {conversations.length > 0 && `(${conversations.length})`}
          </button>
        </div>

        {activeTab === 'chat' && (
          <>
            {/* Scenario Selector */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-800">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select Scenario</p>
              </div>
              <div className="p-3 flex gap-2 flex-wrap">
                {scenarios.map(s => (
                  <button
                    key={s.label}
                    onClick={() => setScenario(s.label)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                      scenario === s.label
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                        : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">

              {/* Active scenario indicator */}
              <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-xs text-gray-400 font-medium">{scenario}</span>
                </div>
                <button
                  onClick={saveConversation}
                  disabled={messages.length <= 1}
                  className="text-xs text-gray-500 hover:text-green-400 transition disabled:opacity-30 flex items-center gap-1"
                >
                  💾 Save
                </button>
              </div>

              {/* Messages */}
              <div className="overflow-y-auto p-4 space-y-4" style={{ maxHeight: '420px', minHeight: '300px' }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white mr-2 flex-shrink-0 mt-1">
                        AI
                      </div>
                    )}
                    <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white rounded-br-sm'
                        : 'bg-gray-800 border border-gray-700 text-gray-200 rounded-bl-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white mr-2 flex-shrink-0">
                      AI
                    </div>
                    <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1.5 items-center">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-800 p-4">
                <div className="flex gap-2 items-center">
                  <button
                    onClick={listening ? stopListening : startListening}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition flex-shrink-0 ${
                      listening
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
                    }`}
                  >
                    🎤
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={listening ? 'Listening...' : 'Type a message or click 🎤 to speak...'}
                    disabled={listening || loading}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition text-sm"
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || loading}
                    className="w-10 h-10 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition disabled:opacity-40 flex-shrink-0 shadow-lg shadow-purple-900/40"
                  >
                    →
                  </button>
                </div>
                {listening && (
                  <p className="text-center text-red-400 text-xs mt-2 animate-pulse">
                    🔴 Listening... speak now!
                  </p>
                )}
              </div>
            </div>

            {/* Quick Phrases */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-800">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Phrases</p>
              </div>
              <div className="p-3 flex gap-2 flex-wrap">
                {[
                  'Hello, nice to meet you!',
                  'Could you repeat that?',
                  "I don't understand",
                  'Can you speak slower?',
                  'Thank you very much!',
                ].map(phrase => (
                  <button
                    key={phrase}
                    onClick={() => sendMessage(phrase)}
                    className="px-3 py-1.5 rounded-xl text-xs text-gray-400 hover:text-white bg-gray-800 border border-gray-700 hover:border-gray-500 transition"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div>
            {historyLoading ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 flex justify-center">
                <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
                <p className="text-4xl mb-4">💬</p>
                <p className="font-bold text-gray-300 mb-2">No conversations saved yet</p>
                <p className="text-gray-500 text-sm mb-4">Start chatting and click Save to keep your history</p>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                >
                  Start Chatting →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-500 text-xs">{conversations.length} saved conversation{conversations.length !== 1 ? 's' : ''}</p>
                {conversations.map((conv) => (
                  <div key={conv.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition">
                    <div className="flex justify-between items-center p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-600 bg-opacity-20 border border-purple-800 rounded-xl flex items-center justify-center text-xl">
                          {getScenarioIcon(conv.scenario)}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{conv.scenario}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{conv.created_at} • {conv.messages.length} messages</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setExpanded(expanded === conv.id ? null : conv.id)}
                          className="text-xs border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 px-3 py-1.5 rounded-xl transition"
                        >
                          {expanded === conv.id ? 'Hide' : 'View'}
                        </button>
                        <button
                          onClick={() => deleteConversation(conv.id)}
                          className="text-xs border border-gray-800 text-gray-600 hover:text-red-400 hover:border-red-800 px-3 py-1.5 rounded-xl transition"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {expanded === conv.id && (
                      <div className="border-t border-gray-800 p-4 space-y-3 max-h-72 overflow-y-auto">
                        {conv.messages.map((msg, j) => (
                          <div key={j} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-3 py-2 rounded-xl text-xs leading-relaxed ${
                              msg.role === 'user'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-800 border border-gray-700 text-gray-300'
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {showUpgrade && (
        <UpgradeModal feature="chat" onClose={() => setShowUpgrade(false)} />
      )}

    </Layout>
  )
}

export default Chat
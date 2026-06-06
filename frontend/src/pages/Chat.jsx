import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

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
    if (activeTab === 'history') {
      fetchConversations()
    }
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
        content: "Hello! I'm your BridgeVoice AI conversation partner. I'm here to help you practice English. What scenario would you like to practice today?"
      }])
      setActiveTab('history')
      fetchConversations()
    } catch (err) {
      console.log('Could not save conversation')
    }
  }

  const deleteConversation = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/conversations/${id}`, {
        method: 'DELETE'
      })
      setConversations(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.log('Could not delete')
    }
  }

  const sendMessage = async (text) => {
    if (!text.trim()) return
    const userMessage = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, scenario: scenario })
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

  return (
    <Layout>
      <div className="max-w-3xl mx-auto flex flex-col gap-4">

        <div>
          <h2 className="text-2xl font-bold">🗣️ AI Conversation</h2>
          <p className="text-gray-400 mt-1">Practice English with your AI conversation partner</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            💬 Current Chat
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            📜 History {conversations.length > 0 && `(${conversations.length})`}
          </button>
        </div>

        {activeTab === 'chat' && (
          <>
            {/* Scenario Selector */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <p className="text-sm text-gray-400 mb-3 font-medium">Select Scenario:</p>
              <div className="flex gap-2 flex-wrap">
                {['General Conversation', 'Job Interview', 'Grocery Store', 'Doctor Visit', 'Bank Visit', 'Workplace Chat'].map(s => (
                  <button
                    key={s}
                    onClick={() => setScenario(s)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                      scenario === s
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Window */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl flex flex-col" style={{ minHeight: '400px' }}>
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '450px' }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-800 text-gray-200 rounded-bl-sm border border-gray-700'
                    }`}>
                      {msg.role === 'assistant' && (
                        <p className="text-xs font-semibold text-purple-400 mb-1">🤖 BridgeVoice AI</p>
                      )}
                      {msg.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-gray-800 p-4">
                <div className="flex gap-2 items-center">
                  <button
                    onClick={listening ? stopListening : startListening}
                    className={`p-3 rounded-full transition ${
                      listening
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    🎤
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={listening ? '🎤 Listening...' : 'Type your message or click 🎤 to speak...'}
                    disabled={listening || loading}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition text-sm"
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || loading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2 rounded-xl transition disabled:opacity-50 font-medium text-sm"
                  >
                    Send
                  </button>
                </div>
                {listening && (
                  <p className="text-center text-red-400 text-xs mt-2 animate-pulse">
                    🔴 Listening... speak now!
                  </p>
                )}
              </div>
            </div>

            {/* Save & Quick Phrases */}
            <div className="flex gap-3">
              <button
                onClick={saveConversation}
                disabled={messages.length <= 1}
                className="bg-green-900 bg-opacity-30 border border-green-700 hover:bg-opacity-50 text-green-400 px-4 py-2 rounded-xl transition text-sm font-medium disabled:opacity-50"
              >
                💾 Save Conversation
              </button>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <p className="text-sm font-semibold text-gray-400 mb-2">💡 Quick Phrases:</p>
              <div className="flex gap-2 flex-wrap">
                {['Hello, nice to meet you!', 'Could you repeat that?', "I don't understand", 'Can you speak slower?'].map(phrase => (
                  <button
                    key={phrase}
                    onClick={() => sendMessage(phrase)}
                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1 rounded-full text-xs transition border border-gray-700"
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
              <div className="flex justify-center py-12">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-5xl mb-4">💬</p>
                <p className="font-bold text-gray-300 mb-2">No conversations saved yet!</p>
                <p className="text-gray-500 text-sm mb-4">Start chatting and click "Save Conversation" to see your history here.</p>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-xl font-medium transition text-sm"
                >
                  Start Chatting →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-500 text-sm">{conversations.length} conversation{conversations.length !== 1 ? 's' : ''} saved</p>
                {conversations.map((conv) => (
                  <div key={conv.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition">
                    <div className="flex justify-between items-center p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-xl">
                          {getScenarioIcon(conv.scenario)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{conv.scenario}</p>
                          <p className="text-xs text-gray-500">{conv.created_at}</p>
                          <p className="text-xs text-purple-400">{conv.messages.length} messages</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setExpanded(expanded === conv.id ? null : conv.id)}
                          className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1.5 rounded-xl transition text-xs"
                        >
                          {expanded === conv.id ? 'Hide' : 'View'}
                        </button>
                        <button
                          onClick={() => deleteConversation(conv.id)}
                          className="bg-red-900 bg-opacity-30 hover:bg-opacity-50 text-red-400 px-3 py-1.5 rounded-xl transition text-xs"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {expanded === conv.id && (
                      <div className="border-t border-gray-800 p-4 space-y-3 max-h-80 overflow-y-auto">
                        {conv.messages.map((msg, j) => (
                          <div key={j} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-3 py-2 rounded-xl text-xs leading-relaxed ${
                              msg.role === 'user'
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                : 'bg-gray-800 text-gray-300 border border-gray-700'
                            }`}>
                              {msg.role === 'assistant' && (
                                <p className="text-purple-400 font-semibold mb-1 text-xs">🤖 AI</p>
                              )}
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
    </Layout>
  )
}

export default Chat
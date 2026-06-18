import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">

        {/* Animated 404 */}
        <div className="relative mb-8">
          <p className="text-9xl font-black text-gray-900 select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-6xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              404
            </p>
          </div>
        </div>

        <p className="text-5xl mb-4">🗺️</p>
        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Looks like this page doesn't exist or was moved. Let's get you back on track with your English learning!
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-purple-900/40"
          >
            🏠 Go to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white px-6 py-3 rounded-xl font-medium transition"
          >
            ← Go Back
          </button>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {[
            { icon: '🗣️', label: 'AI Chat', path: '/chat' },
            { icon: '🎯', label: 'Daily Challenge', path: '/daily' },
            { icon: '🧠', label: 'Quiz', path: '/quiz' },
            { icon: '🎤', label: 'Pronunciation', path: '/pronunciation' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-800 hover:border-purple-700 rounded-xl text-xs text-gray-400 hover:text-white transition"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}

export default NotFound
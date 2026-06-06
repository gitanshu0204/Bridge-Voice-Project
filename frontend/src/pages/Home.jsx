import { useNavigate } from 'react-router-dom'
import Logo from '../assets/logo'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950 bg-opacity-80 backdrop-blur-md border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo size={20} />
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">BridgeVoice</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="text-gray-300 hover:text-white transition font-medium"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-5 py-2 rounded-full font-semibold transition shadow-lg shadow-purple-900"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-gray-950 to-gray-950 opacity-50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-700 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-blue-700 rounded-full filter blur-3xl opacity-20"></div>

        <div className="relative max-w-4xl mx-auto">

          {/* Animated Logo */}
          <div className="flex justify-center mb-8">
            <svg width="320" height="120" viewBox="0 0 680 300" role="img">
              <defs>
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor:'#9333ea'}}/>
                  <stop offset="100%" style={{stopColor:'#3b82f6'}}/>
                </linearGradient>
                <style>{`
                  @keyframes growUp {
                    0% { transform: scaleY(0); opacity: 0; }
                    100% { transform: scaleY(1); opacity: 1; }
                  }
                  .bar { transform-origin: bottom; animation: growUp 0.4s ease forwards; opacity: 0; }
                  .b1 { animation-delay: 0.1s; }
                  .b2 { animation-delay: 0.2s; }
                  .b3 { animation-delay: 0.3s; }
                  .b4 { animation-delay: 0.4s; }
                  .b5 { animation-delay: 0.5s; }
                  .b6 { animation-delay: 0.6s; }
                  .b7 { animation-delay: 0.7s; }
                  .b8 { animation-delay: 0.8s; }
                  .b9 { animation-delay: 0.9s; }
                  .b10 { animation-delay: 1.0s; }
                  .b11 { animation-delay: 1.1s; }
                  .b12 { animation-delay: 1.2s; }
                  @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                  }
                  .land { animation: fadeIn 0.5s ease forwards; opacity: 0; }
                  .l1 { animation-delay: 0s; }
                  .l2 { animation-delay: 1.3s; }
                  @keyframes slideUp {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                  }
                  .hero-text { animation: slideUp 0.6s ease forwards; opacity: 0; animation-delay: 1.5s; }
                  .hero-sub { animation: slideUp 0.6s ease forwards; opacity: 0; animation-delay: 1.7s; }
                  .hero-btn { animation: slideUp 0.6s ease forwards; opacity: 0; animation-delay: 1.9s; }
                  .hero-stats { animation: slideUp 0.6s ease forwards; opacity: 0; animation-delay: 2.1s; }
                `}</style>
              </defs>

              <rect className="land l1" x="170" y="148" width="50" height="12" rx="6" fill="url(#g1)"/>
              <rect className="land l2" x="460" y="148" width="50" height="12" rx="6" fill="url(#g1)"/>

              <rect className="bar b1" x="228" y="138" width="14" height="22" rx="4" fill="#9333ea"/>
              <rect className="bar b2" x="248" y="128" width="14" height="32" rx="4" fill="#9333ea"/>
              <rect className="bar b3" x="268" y="115" width="14" height="45" rx="4" fill="#8b2fe8"/>
              <rect className="bar b4" x="288" y="105" width="14" height="55" rx="4" fill="#7c3aed"/>
              <rect className="bar b5" x="308" y="98" width="14" height="62" rx="4" fill="url(#g1)"/>
              <rect className="bar b6" x="328" y="94" width="14" height="66" rx="4" fill="url(#g1)"/>
              <rect className="bar b7" x="348" y="94" width="14" height="66" rx="4" fill="url(#g1)"/>
              <rect className="bar b8" x="368" y="98" width="14" height="62" rx="4" fill="url(#g1)"/>
              <rect className="bar b9" x="388" y="105" width="14" height="55" rx="4" fill="#3b82f6"/>
              <rect className="bar b10" x="408" y="115" width="14" height="45" rx="4" fill="#3b82f6"/>
              <rect className="bar b11" x="428" y="128" width="14" height="32" rx="4" fill="#3b82f6"/>
              <rect className="bar b12" x="448" y="138" width="14" height="22" rx="4" fill="#3b82f6"/>
            </svg>
          </div>

          <div className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-full px-4 py-2 mb-8 text-sm text-gray-300 hero-text">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            AI-Powered English Learning Platform
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight hero-text">
            Speak English
            <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              With Confidence
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed hero-sub">
            Practice real conversations with AI, build vocabulary, track your progress and connect with learners — all in one powerful platform.
          </p>

          <div className="flex gap-4 justify-center flex-wrap hero-btn">
            <button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg transition shadow-2xl shadow-purple-900 hover:shadow-purple-800"
            >
              Start for Free 🚀
            </button>
            <button
              onClick={() => navigate('/login')}
              className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-4 rounded-full font-bold text-lg transition"
            >
              Login →
            </button>
          </div>

          <div className="flex justify-center gap-8 mt-12 text-center hero-stats">
            {[
              { number: '10K+', label: 'Active Learners' },
              { number: '50+', label: 'Practice Scenarios' },
              { number: '95%', label: 'Success Rate' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{stat.number}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need to
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"> Master English</span>
          </h2>
          <p className="text-gray-400 text-lg">One platform. All the tools. Zero excuses.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🗣️', title: 'AI Conversations', desc: 'Practice real scenarios like job interviews, doctor visits and everyday situations with our AI partner', color: 'from-purple-600 to-purple-800' },
            { icon: '🎤', title: 'Voice Practice', desc: 'Speak directly and get instant feedback on your pronunciation, confidence and fluency', color: 'from-blue-600 to-blue-800' },
            { icon: '📊', title: 'Progress Tracking', desc: 'See your improvement with detailed analytics, skill breakdowns and weekly reports', color: 'from-cyan-600 to-cyan-800' },
            { icon: '🏆', title: 'Gamification', desc: 'Stay motivated with XP points, levels, badges and daily challenges', color: 'from-yellow-600 to-orange-700' },
            { icon: '🌍', title: 'Built-in Translator', desc: 'Instantly translate between English and 12 languages without leaving the app', color: 'from-green-600 to-green-800' },
            { icon: '💼', title: 'Interview Simulator', desc: 'Practice for 60+ job types with real interview questions and AI feedback', color: 'from-pink-600 to-pink-800' },
          ].map((feature, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition group">
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition`}>
                {feature.icon}
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">How It <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Works</span></h2>
          <p className="text-gray-400 mb-16">Get started in minutes</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up for free and tell us your language background and goals', icon: '👤' },
              { step: '02', title: 'Start Practicing', desc: 'Choose a scenario and start talking with our AI conversation partner', icon: '🎯' },
              { step: '03', title: 'Track Progress', desc: 'See your scores improve and unlock new levels as you get better', icon: '📈' },
            ].map((item, i) => (
              <div key={i}>
                <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <div className="text-purple-400 font-bold text-sm mb-2">STEP {item.step}</div>
                  <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-900 to-blue-900 border border-purple-700 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-4">Ready to Build Confidence?</h2>
            <p className="text-gray-300 mb-8 text-lg">Join thousands of learners improving their English every day</p>
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-gray-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-2xl"
            >
              Create Free Account 🚀
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Logo size={16} />
          <span className="font-semibold text-gray-400">BridgeVoice</span>
        </div>
        © 2026 BridgeVoice — AI-Powered English Learning 🍁
      </footer>

    </div>
  )
}

export default Home
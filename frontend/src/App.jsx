import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Progress from './pages/Progress'
import Dictionary from './pages/Dictionary'
import Translator from './pages/Translator'
import Community from './pages/Community'
import InterviewSimulator from './pages/InterviewSimulator'
import Settings from './pages/Settings'
import CultureGuide from './pages/CultureGuide'
import Quiz from './pages/Quiz'
import Phrases from './pages/Phrases'
import GrammarChecker from './pages/GrammarChecker'
import PronunciationScorer from './pages/PronunciationScorer'
import DailyChallenge from './pages/DailyChallenge'
import Pricing from './pages/Pricing'
import NotFound from './pages/NotFound'
import ScrollToTop from './components/ScrollToTop'
import StudyBuddyChat from './pages/StudyBuddyChat'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/translator" element={<Translator />} />
        <Route path="/community" element={<Community />} />
        <Route path="/interview" element={<InterviewSimulator />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/culture" element={<CultureGuide />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/phrases" element={<Phrases />} />
        <Route path="/grammar" element={<GrammarChecker />} />
        <Route path="/pronunciation" element={<PronunciationScorer />} />
        <Route path="/daily" element={<DailyChallenge />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/chat/buddy" element={<StudyBuddyChat />} />
      </Routes>
    </Router>
  )
}

export default App
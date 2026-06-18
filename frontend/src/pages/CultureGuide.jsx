import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function CultureGuide() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('workplace')
  const [expandedItem, setExpandedItem] = useState(null)
  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiMode, setAiMode] = useState(null)
  const [nativeLanguage, setNativeLanguage] = useState('Hindi')
  const [userQuestion, setUserQuestion] = useState('')

  const categories = [
    { id: 'workplace', icon: '🏢', title: 'Workplace' },
    { id: 'social', icon: '🤝', title: 'Social Life' },
    { id: 'holidays', icon: '🍁', title: 'Holidays' },
    { id: 'food', icon: '🍽️', title: 'Food' },
    { id: 'transport', icon: '🚌', title: 'Transport' },
    { id: 'healthcare', icon: '🏥', title: 'Healthcare' },
    { id: 'education', icon: '📚', title: 'Education' },
    { id: 'banking', icon: '🏦', title: 'Banking' },
  ]

  const content = {
    workplace: [
      { title: 'Punctuality is Very Important', icon: '⏰', content: 'In Canada, being on time is a sign of respect. Always arrive 5-10 minutes early for job interviews and meetings. If you are going to be late, always call or text ahead to let people know.', tip: 'Set two alarms for important meetings!' },
      { title: 'First Name Culture', icon: '👋', content: 'Canadians are very informal at work. Most workplaces use first names even with managers and bosses. You can call your manager by their first name unless they tell you otherwise.', tip: 'If unsure, ask "What would you like me to call you?"' },
      { title: 'Work-Life Balance', icon: '⚖️', content: 'Canadians value work-life balance. It is normal to leave work exactly at 5pm. You are not expected to work unpaid overtime. Taking your lunch break is encouraged and normal.', tip: 'Always take your full lunch break!' },
      { title: 'Saying Sorry', icon: '🙏', content: 'Canadians say sorry very often — even when something is not their fault. If you bump into someone, both people will say sorry! This is just polite Canadian culture.', tip: 'When in doubt, say sorry and smile!' },
      { title: 'Email Etiquette', icon: '📧', content: 'Always start emails with "Hi [Name]," and end with "Thank you" or "Best regards". Keep emails short and professional. Reply to emails within 24 hours.', tip: 'Always proofread before sending!' },
      { title: 'Feedback Culture', icon: '💬', content: 'Canadians give feedback in a very polite and indirect way. Instead of saying "This is wrong", they say "I think this could be improved". Always be open to feedback.', tip: 'Take feedback as an opportunity to grow!' },
    ],
    social: [
      { title: 'Small Talk is Important', icon: '☁️', content: 'Canadians love small talk — talking about weather, sports (especially hockey!), and weekend plans. Common phrases: "How was your weekend?" "Cold enough for you?"', tip: 'Learn about hockey — it is Canada\'s favourite sport!' },
      { title: 'Personal Space', icon: '↔️', content: 'Canadians like personal space — about an arm\'s length distance when talking. They greet with a handshake, not a kiss on the cheek like some cultures. Good friends may hug.', tip: 'A firm handshake and eye contact makes a great first impression!' },
      { title: 'Tipping Culture', icon: '💰', content: 'Tipping is expected in Canada. Restaurant servers: 15-20%. Hair stylists: 15-20%. Taxi/Uber drivers: 10-15%. Not tipping is considered rude.', tip: 'A quick way: move the decimal and multiply by 1.5 for 15%' },
      { title: 'Diversity and Inclusion', icon: '🌍', content: 'Canada is very multicultural and proud of it. Canadians are generally very welcoming of different cultures, religions and backgrounds. Discrimination is taken very seriously.', tip: 'Share your culture! Canadians love learning about other cultures.' },
      { title: 'Queuing', icon: '🚶', content: 'Canadians take queuing very seriously. Always stand in line and wait your turn. Cutting in line is considered very rude.', tip: 'If you accidentally cut a line, apologize immediately!' },
      { title: 'Holding Doors Open', icon: '🚪', content: 'It is very common and polite to hold the door open for the person behind you. If someone holds a door for you, always say "Thank you".', tip: 'Always say thank you when someone holds a door!' },
    ],
    holidays: [
      { title: 'Canada Day — July 1st', icon: '🎆', content: 'Canada\'s birthday! Celebrates when Canada became a country in 1867. There are fireworks, parades and outdoor events everywhere. Wear red and white!', tip: 'Great day to meet neighbours and explore your city!' },
      { title: 'Thanksgiving — October', icon: '🦃', content: 'Canadian Thanksgiving is in October. Families gather for a big meal with turkey, stuffing and pumpkin pie. It is about being grateful.', tip: 'If invited to someone\'s Thanksgiving, bring a dessert or wine!' },
      { title: 'Christmas — December 25th', icon: '🎄', content: 'Very widely celebrated even by non-Christians. Most businesses close. Gift giving, family dinners and decorations are common. Many Canadians say "Happy Holidays" to be inclusive.', tip: 'Say "Happy Holidays" to be inclusive to everyone!' },
      { title: 'Remembrance Day — November 11th', icon: '🌹', content: 'A very solemn day to honour soldiers who died in wars. Many people wear a red poppy pin. There is a moment of silence at 11am. Most stores close.', tip: 'Wear a red poppy and observe the moment of silence at 11am.' },
      { title: 'Halloween — October 31st', icon: '🎃', content: 'Children dress in costumes and go door-to-door saying "Trick or Treat" for candy. Adults also celebrate with parties. Decorating your home is common and fun.', tip: 'Buy candy to give to children who knock on your door!' },
    ],
    food: [
      { title: 'Poutine', icon: '🍟', content: 'Canada\'s most famous dish! French fries topped with cheese curds and brown gravy. Originally from Quebec but now found everywhere. A must-try Canadian experience!', tip: 'Try it from a local diner for the authentic experience!' },
      { title: 'Tim Hortons', icon: '☕', content: 'Tim Hortons is more than a coffee shop — it is a Canadian institution! "Double double" means coffee with two creams and two sugars. Timbits are small donut holes.', tip: 'Ordering a "double double" makes you sound like a true Canadian!' },
      { title: 'Dining Out Tips', icon: '🍽️', content: 'Tax is not included in menu prices — expect to pay 13% HST on top. Tipping 15-20% is expected. Splitting bills is very common and normal to ask for.', tip: 'Ask "Can we get separate bills?" when dining with friends!' },
      { title: 'Grocery Shopping', icon: '🛒', content: 'Bring your own reusable bags — stores charge for plastic bags. Most stores are open 7 days a week. Farmers markets are popular on weekends for fresh local produce.', tip: 'Keep reusable bags by your door so you never forget them!' },
    ],
    transport: [
      { title: 'Public Transit', icon: '🚌', content: 'Most cities have buses and subways. Buy a monthly pass to save money. Always give up your seat to elderly, pregnant or disabled passengers.', tip: 'Get a transit app like Transit App to track buses in real time!' },
      { title: 'Driving in Canada', icon: '🚗', content: 'Drive on the right side of the road. Speed limits are in km/h. Right turn on red is allowed in most provinces except Quebec. Winter tires are mandatory in some provinces.', tip: 'Get your G1 license as soon as possible if you plan to drive!' },
      { title: 'Winter Driving', icon: '❄️', content: 'Canadian winters are serious. Roads get very icy and snowy. Give extra space between cars. Drive slowly and carefully in winter conditions.', tip: 'Take a winter driving course — it could save your life!' },
      { title: 'Uber and Lyft', icon: '📱', content: 'Uber and Lyft are widely available in Canadian cities. They are safe and reliable. Always check the driver\'s rating and confirm the car model before getting in.', tip: 'Share your trip details with someone when travelling alone at night!' },
    ],
    healthcare: [
      { title: 'OHIP — Free Healthcare', icon: '💊', content: 'Ontario Health Insurance Plan (OHIP) gives you free doctor visits and hospital care. Apply for your health card as soon as you arrive. Takes about 3 months to activate.', tip: 'Apply for your health card on your first week in Ontario!' },
      { title: 'Finding a Family Doctor', icon: '👨‍⚕️', content: 'Having a family doctor (GP) is very important. Use Health Care Connect to find one. Walk-in clinics are available if you don\'t have a doctor yet.', tip: 'Register with Health Care Connect at ontario.ca' },
      { title: 'Calling 911', icon: '🚨', content: 'Call 911 for police, fire or medical emergencies only. For non-emergencies call your local police non-emergency line. Calling 911 for non-emergencies can result in a fine.', tip: 'Save your local non-emergency police number in your phone!' },
      { title: 'Pharmacy', icon: '💉', content: 'Pharmacists in Canada are very helpful. You can ask them questions about medications for free. Many common medications require a prescription from a doctor.', tip: 'Shoppers Drug Mart and Rexall are common pharmacy chains!' },
    ],
    education: [
      { title: 'School System', icon: '🏫', content: 'School is free from Kindergarten to Grade 12. Children must attend school until age 16. School year runs September to June.', tip: 'Register your children for school as soon as you arrive!' },
      { title: 'College vs University', icon: '🎓', content: 'College offers practical 2-3 year programs. University offers 4-year degree programs. Both are respected. College is often better for getting a job quickly.', tip: 'Research both options carefully before deciding!' },
      { title: 'Free English Classes', icon: '📝', content: 'Free English classes (LINC) are available for newcomers. Settlement agencies offer free programs. Libraries also offer free English conversation groups.', tip: 'Search for LINC classes in your city — they are completely free!' },
      { title: 'Credential Recognition', icon: '📜', content: 'Your foreign degree may need to be assessed. Use World Education Services (WES) to get your credentials evaluated. This is important for professional jobs.', tip: 'Get your WES assessment done early — it takes several weeks!' },
    ],
    banking: [
      { title: 'Opening a Bank Account', icon: '🏦', content: 'You need a bank account to receive salary, pay rent and bills. Bring your passport and proof of address. Major banks: TD, RBC, Scotiabank, BMO, CIBC. Most offer newcomer packages.', tip: 'TD and RBC have excellent newcomer banking packages!' },
      { title: 'Building Credit Score', icon: '📊', content: 'Your credit score is very important in Canada for renting, loans and phones. Start building credit by getting a secured credit card. Always pay your full balance on time.', tip: 'Never miss a credit card payment — it seriously damages your score!' },
      { title: 'E-Transfer', icon: '💸', content: 'Interac e-Transfer is the most common way to send money between Canadian bank accounts. It is instant, free and very safe. Used for splitting bills, paying rent etc.', tip: 'Set up e-Transfer autodeposit so money goes straight to your account!' },
      { title: 'Taxes in Canada', icon: '🧾', content: 'Everyone must file taxes by April 30th every year. Use free tax software like SimpleTax or visit a free tax clinic. You may get money back called a tax refund!', tip: 'File your taxes even if you earned very little — you may get money back!' },
    ],
  }

  const callAI = async (topic, topicContent, action, question = '') => {
    setAiLoading(true)
    setAiResponse('')
    try {
      const response = await fetch('http://127.0.0.1:8000/api/culture-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          content: topicContent,
          action,
          native_language: nativeLanguage,
          question
        })
      })
      const data = await response.json()
      setAiResponse(data.response)
    } catch (err) {
      setAiResponse('Could not connect. Please make sure backend is running!')
    }
    setAiLoading(false)
  }

  const currentCategory = categories.find(c => c.id === activeCategory)

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Hero */}
        <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-gray-900 opacity-60"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>
          <div className="relative p-8 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-red-400">🍁</span>
                <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Canadian Culture Guide</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome to Canada</h2>
              <p className="text-gray-400 max-w-md text-sm leading-relaxed">
                Everything you need to know about Canadian culture, workplace etiquette, and daily life — with AI explanations in your language.
              </p>
              <div className="flex items-center gap-4 mt-4">
                {[
                  { value: '8', label: 'Categories' },
                  { value: '40+', label: 'Topics' },
                  { value: 'AI', label: 'Powered' },
                ].map((stat, i) => (
                  <div key={i}>
                    <p className="text-lg font-bold text-purple-400">{stat.value}</p>
                    <p className="text-gray-500 text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block text-8xl opacity-10">🍁</div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 flex items-center gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Language</p>
            <p className="text-gray-600 text-xs mt-0.5">Explanations will be in your language</p>
          </div>
          <div className="flex gap-2 flex-wrap flex-1">
            {['Hindi', 'Punjabi', 'Mandarin', 'Arabic', 'Spanish', 'French', 'Tagalog', 'Urdu'].map(lang => (
              <button
                key={lang}
                onClick={() => setNativeLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  nativeLanguage === lang
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                    : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs with Arrow Navigation */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-2 flex items-center gap-1">

          {/* Left Arrow */}
          <button
            onClick={() => {
              const container = document.getElementById('category-tabs')
              container.scrollBy({ left: -200, behavior: 'smooth' })
            }}
            className="flex-shrink-0 w-8 h-8 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition"
          >
            ←
          </button>

          {/* Tabs */}
          <div
            id="category-tabs"
            className="flex gap-1 overflow-x-auto flex-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`#category-tabs::-webkit-scrollbar { display: none; }`}</style>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id)
                  setExpandedItem(null)
                  setAiMode(null)
                  setAiResponse('')
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap flex-shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.title}</span>
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => {
              const container = document.getElementById('category-tabs')
              container.scrollBy({ left: 200, behavior: 'smooth' })
            }}
            className="flex-shrink-0 w-8 h-8 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition"
          >
            →
          </button>
        </div>

        {/* Category Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 bg-opacity-20 border border-purple-800 rounded-xl flex items-center justify-center text-xl">
            {currentCategory?.icon}
          </div>
          <div>
            <h3 className="font-bold text-white">{currentCategory?.title}</h3>
            <p className="text-gray-500 text-xs">{content[activeCategory]?.length} topics • Click to expand and get AI help</p>
          </div>
        </div>

        {/* Topics */}
        <div className="space-y-2">
          {content[activeCategory]?.map((item, i) => (
            <div
              key={i}
              className={`bg-gray-900 border rounded-2xl overflow-hidden transition-all duration-200 ${
                expandedItem === i
                  ? 'border-purple-800'
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              {/* Topic Header */}
              <button
                onClick={() => {
                  setExpandedItem(expandedItem === i ? null : i)
                  setAiMode(null)
                  setAiResponse('')
                  setUserQuestion('')
                }}
                className="w-full text-left px-6 py-4 flex justify-between items-center group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-200 group-hover:text-white transition-colors">{item.title}</p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border border-gray-700 flex items-center justify-center text-gray-500 transition-all ${
                  expandedItem === i ? 'bg-purple-600 border-purple-600 text-white rotate-180' : 'group-hover:border-gray-500'
                }`}>
                  ▾
                </div>
              </button>

              {/* Expanded Content */}
              {expandedItem === i && (
                <div className="border-t border-gray-800">

                  {/* Main Content */}
                  <div className="px-6 py-5">
                    <div className="relative pl-4 border-l-2 border-purple-600">
                      <p className="text-gray-300 text-sm leading-relaxed">{item.content}</p>
                    </div>

                    <div className="flex items-start gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 mt-4">
                      <span className="text-yellow-500 text-sm mt-0.5 flex-shrink-0">💡</span>
                      <p className="text-gray-400 text-sm">{item.tip}</p>
                    </div>
                  </div>

                  {/* AI Section */}
                  <div className="border-t border-gray-800 px-6 py-5">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                        <span className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-xs">🤖</span>
                        Ask AI About This
                      </p>
                    </div>

                    <div className="flex gap-2 mb-4 flex-wrap">
                      {[
                        { action: 'explain', label: 'Explain Simply', icon: '📖' },
                        { action: 'translate', label: `In ${nativeLanguage}`, icon: '🌍' },
                        { action: 'compare', label: 'Compare Cultures', icon: '🔄' },
                      ].map(btn => (
                        <button
                          key={btn.action}
                          onClick={() => {
                            setAiMode(`${btn.action}-${i}`)
                            callAI(item.title, item.content, btn.action)
                          }}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition border ${
                            aiMode === `${btn.action}-${i}`
                              ? 'border-purple-600 bg-purple-900 bg-opacity-30 text-purple-300'
                              : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                          }`}
                        >
                          <span>{btn.icon}</span>
                          {btn.label}
                        </button>
                      ))}
                    </div>

                    {/* Custom Question */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={userQuestion}
                        onChange={e => setUserQuestion(e.target.value)}
                        onKeyPress={e => {
                          if (e.key === 'Enter' && userQuestion.trim()) {
                            setAiMode(`question-${i}`)
                            callAI(item.title, item.content, 'question', userQuestion)
                          }
                        }}
                        placeholder="Ask anything about this topic..."
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition text-xs"
                      />
                      <button
                        onClick={() => {
                          if (userQuestion.trim()) {
                            setAiMode(`question-${i}`)
                            callAI(item.title, item.content, 'question', userQuestion)
                          }
                        }}
                        disabled={!userQuestion.trim()}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition disabled:opacity-40"
                      >
                        Ask
                      </button>
                    </div>

                    {/* AI Loading */}
                    {aiLoading && aiMode?.endsWith(`-${i}`) && (
                      <div className="flex items-center gap-2 mt-4">
                        <div className="w-4 h-4 border border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-500 text-xs">AI is thinking...</span>
                      </div>
                    )}

                    {/* AI Response */}
                    {aiResponse && aiMode?.endsWith(`-${i}`) && !aiLoading && (
                      <div className="mt-4 relative pl-4 border-l-2 border-purple-600 bg-gray-800 border border-gray-700 rounded-xl p-4">
                        <p className="text-xs font-semibold text-purple-400 mb-2">🤖 AI Response</p>
                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{aiResponse}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </Layout>
  )
}

export default CultureGuide
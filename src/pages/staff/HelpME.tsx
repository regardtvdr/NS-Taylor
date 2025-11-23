import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, Bot, User, HelpCircle, X } from 'lucide-react'
import { format } from 'date-fns'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const HelpME = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your help assistant. I can answer questions about how to use the staff portal. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
  }, [])

  const knowledgeBase: Record<string, string[]> = {
    dashboard: [
      'The Dashboard shows key metrics: Today\'s Appointments, Revenue Today, Deposits Collected, and No-Shows Saved.',
      'You can see a mini calendar with booking indicators - dots show days with appointments.',
      'The "Next 7 Appointments" section shows upcoming appointments with quick action buttons.',
      'Use the calendar to navigate to different dates and see booking counts.',
    ],
    booking: [
      'To create a booking, click "Add Walk-In" or use the quick book buttons on the Calendar page.',
      'The booking form has 3 steps: Patient Information, Service & Dentist Selection, and Date/Time Selection.',
      'You can select multiple consecutive time slots (1x, 2x, or 3x) for longer procedures.',
      'Select a service from the dropdown and choose which dentist the patient wants to see.',
      'After selecting a date, choose a start time and duration. The system will book consecutive slots automatically.',
    ],
    today: [
      'The Today page shows all appointments for today in a timeline view.',
      'You can switch between "Timeline" and "Hourly by Dentist" views using the toggle buttons.',
      'In Timeline view, you can drag and drop appointments to reorder them.',
      'Use the action buttons to call patients, send WhatsApp messages, or mark them as arrived.',
      'Keyboard shortcuts: Press "A" for Arrived, "N" for No-Show, "W" for WhatsApp.',
      'The Hourly view shows appointments organized by time slot and dentist for easy scheduling.',
    ],
    calendar: [
      'The Calendar page shows a monthly view with booking indicators on each day.',
      'Click any date to see hourly availability and bookings for that day.',
      'Use the dentist dropdown to filter by specific dentist or view all dentists.',
      'Empty time slots show "Book [Dentist Name]" buttons for quick booking.',
      'You can mark days as leave/vacation for dentists - these will be blocked from bookings.',
      'The calendar allows booking up to 2 months in advance.',
      'Days with bookings show dots - more dots mean more appointments.',
    ],
    manage: [
      'The Manage page (formerly Schedule) lets you search, reschedule, and delete appointments.',
      'Use the search bar to find appointments by patient name, service, dentist, phone, or email.',
      'Filter by date using the calendar picker, or leave it as "All Dates" to see everything.',
      'Click the reschedule button (pencil icon) to change an appointment\'s date or time.',
      'Click the delete button (trash icon) to remove an appointment - you\'ll be asked to confirm.',
      'Each appointment card shows patient info, service, dentist, date, time, and deposit status.',
    ],
    analytics: [
      'The Analytics page shows graphs and charts about appointment data.',
      'You can see hourly breakdowns of how busy each dentist will be.',
      'A pie chart shows the types of appointments scheduled for the day.',
      'Use the dentist dropdown to filter analytics by specific dentist.',
    ],
    'multi-slot': [
      'When creating a booking, you can select 1x, 2x, or 3x duration buttons.',
      '1x = 30 minutes, 2x = 60 minutes, 3x = 90 minutes.',
      'After selecting duration, click a start time - the system will automatically book consecutive slots.',
      'Selected slots are highlighted in blue, with the start slot marked with a green checkmark.',
      'This is useful for longer procedures like root canals or comprehensive consultations.',
    ],
    leave: [
      'On the Calendar page, select a dentist from the dropdown.',
      'Click on a date in the calendar to view its details.',
      'In the sidebar, click "Mark as Leave Day" to block that date for the selected dentist.',
      'Leave days are shown with a red background and X icon on the calendar.',
      'Patients cannot book appointments on leave days for that dentist.',
      'Click "Remove Leave Day" to unblock a date.',
    ],
    reschedule: [
      'Go to the Manage page and search for the appointment you want to reschedule.',
      'Click the reschedule button (pencil icon) on the appointment card.',
      'Select a new date from the calendar picker.',
      'Choose a new time slot from the available options.',
      'Click "Confirm Reschedule" to save the changes.',
      'The patient will be notified of the change (when notifications are implemented).',
    ],
    delete: [
      'Go to the Manage page and search for the appointment you want to delete.',
      'Click the delete button (trash icon) on the appointment card.',
      'A confirmation dialog will appear showing the appointment details.',
      'Click "Delete Appointment" to confirm, or "Cancel" to go back.',
      'Deleted appointments cannot be recovered, so be careful!',
    ],
    search: [
      'On the Manage page, use the search bar at the top.',
      'You can search by patient name, service name, dentist name, phone number, or email.',
      'The search works in real-time as you type.',
      'Combine search with date filtering to narrow down results.',
      'Clear the search to see all appointments again.',
    ],
    navigation: [
      'Dashboard: Overview of today\'s metrics and upcoming appointments.',
      'Today: View and manage today\'s appointments in timeline or hourly format.',
      'Calendar: Monthly calendar view with booking management and availability.',
      'Manage: Search, reschedule, and delete appointments.',
      'Analytics: View graphs and statistics about appointments.',
      'HelpME!: This help page with the chatbot assistant.',
    ],
  }

  const getResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Check for specific topics
    if (lowerMessage.includes('dashboard') || lowerMessage.includes('metrics') || lowerMessage.includes('overview')) {
      return `Here's how the Dashboard works:\n\n${knowledgeBase.dashboard.join('\n\n')}`
    }

    if (lowerMessage.includes('booking') || lowerMessage.includes('create') || lowerMessage.includes('new appointment') || lowerMessage.includes('add')) {
      return `Here's how to create bookings:\n\n${knowledgeBase.booking.join('\n\n')}`
    }

    if (lowerMessage.includes('today') || lowerMessage.includes('timeline') || lowerMessage.includes('hourly')) {
      return `Here's how the Today page works:\n\n${knowledgeBase.today.join('\n\n')}`
    }

    if (lowerMessage.includes('calendar') || lowerMessage.includes('monthly') || lowerMessage.includes('availability')) {
      return `Here's how the Calendar page works:\n\n${knowledgeBase.calendar.join('\n\n')}`
    }

    if (lowerMessage.includes('manage') || lowerMessage.includes('schedule') || lowerMessage.includes('search')) {
      return `Here's how the Manage page works:\n\n${knowledgeBase.manage.join('\n\n')}`
    }

    if (lowerMessage.includes('analytics') || lowerMessage.includes('graph') || lowerMessage.includes('chart') || lowerMessage.includes('statistics')) {
      return `Here's how Analytics works:\n\n${knowledgeBase.analytics.join('\n\n')}`
    }

    if (lowerMessage.includes('multi') || lowerMessage.includes('slot') || lowerMessage.includes('duration') || lowerMessage.includes('longer')) {
      return `Here's how multi-slot bookings work:\n\n${knowledgeBase['multi-slot'].join('\n\n')}`
    }

    if (lowerMessage.includes('leave') || lowerMessage.includes('vacation') || lowerMessage.includes('block')) {
      return `Here's how to manage leave days:\n\n${knowledgeBase.leave.join('\n\n')}`
    }

    if (lowerMessage.includes('reschedule') || lowerMessage.includes('change') || lowerMessage.includes('move')) {
      return `Here's how to reschedule appointments:\n\n${knowledgeBase.reschedule.join('\n\n')}`
    }

    if (lowerMessage.includes('delete') || lowerMessage.includes('remove') || lowerMessage.includes('cancel')) {
      return `Here's how to delete appointments:\n\n${knowledgeBase.delete.join('\n\n')}`
    }

    if (lowerMessage.includes('how do i') || lowerMessage.includes('how to') || lowerMessage.includes('help')) {
      return `I can help you with:\n\n• Creating bookings\n• Managing appointments (Today page)\n• Using the Calendar\n• Rescheduling appointments\n• Deleting appointments\n• Managing leave days\n• Multi-slot bookings\n• Using Analytics\n• Navigation\n\nWhat specific feature would you like to know about?`
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm here to help you navigate the staff portal. You can ask me about:\n\n• How to create bookings\n• Using the Dashboard\n• Managing today's appointments\n• Calendar features\n• Rescheduling or deleting appointments\n• And much more!\n\nWhat would you like to know?"
    }

    // Default response
    return `I understand you're asking about "${userMessage}". Let me help you with that!\n\nHere are some things I can help with:\n\n• Dashboard features and metrics\n• Creating and managing bookings\n• Using the Today page\n• Calendar navigation and booking\n• Rescheduling appointments\n• Deleting appointments\n• Managing leave days\n• Multi-slot bookings\n• Analytics and reports\n\nTry asking something like:\n• "How do I create a booking?"\n• "How does the calendar work?"\n• "How do I reschedule an appointment?"\n• "What is multi-slot booking?"`
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate thinking time
    setTimeout(() => {
      const response = getResponse(userMessage.content)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickQuestions = [
    'How do I create a booking?',
    'How does the calendar work?',
    'How do I reschedule an appointment?',
    'What is multi-slot booking?',
    'How do I manage leave days?',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-8 pb-24 md:pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-800 dark:text-gray-100">
                HelpME!
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Your AI assistant for the staff portal</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setInput(question)
                  inputRef.current?.focus()
                }}
                className="px-3 py-2 sm:px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-[44px]"
              >
                {question}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-white dark:bg-gray-800 p-0 overflow-hidden border-2 border-gray-800"
        >
          {/* Messages */}
          <div className="h-[400px] md:h-[500px] overflow-y-auto p-4 md:p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-gray-800 dark:bg-gray-700 text-white'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`flex-1 rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-gray-800 dark:bg-gray-700 text-white'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="whitespace-pre-line text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div
                      className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-gray-300 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {format(message.timestamp, 'HH:mm')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start space-x-3"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3 md:p-4 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about using the staff portal..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 focus:border-transparent text-base min-h-[44px]"
                  disabled={isLoading}
                />
                <MessageCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className={`p-3 rounded-lg transition-colors ${
                  !input.trim() || isLoading
                    ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gray-800 dark:bg-gray-600 text-white hover:bg-gray-900 dark:hover:bg-gray-500'
                }`}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HelpME


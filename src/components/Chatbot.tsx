import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { DENTISTS } from '../utils/constants'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! 👋 Welcome to Premium Dental Practice. I'm here to help answer any questions you might have. Whether you need help booking an appointment, understanding our services, finding our location, or anything else about our practice - I'm here to assist. Take your time, and feel free to ask me anything. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim()

    // Greetings - Check first (with more variations for older users)
    if (
      lowerMessage.includes('hello') || 
      lowerMessage.includes('hi') || 
      lowerMessage.includes('hey') || 
      lowerMessage.includes('good morning') || 
      lowerMessage.includes('good afternoon') ||
      lowerMessage.includes('good evening') ||
      lowerMessage.includes('good day') ||
      lowerMessage.includes('greetings') ||
      lowerMessage === 'hey' ||
      lowerMessage === 'hi' ||
      lowerMessage === 'hello' ||
      lowerMessage.startsWith('hi ') ||
      lowerMessage.startsWith('hey ') ||
      lowerMessage.startsWith('hello ') ||
      lowerMessage === 'hii' ||
      lowerMessage === 'hiii' ||
      lowerMessage === 'hallo' ||
      lowerMessage === 'howdy'
    ) {
      return "Hello! Welcome to Premium Dental Practice. I'm here to help you with any questions you might have. Whether you need help booking an appointment, understanding our services, or finding information about our practice - I'm here to assist. What would you like to know?"
    }

    // Thank you responses - Check early (with more variations)
    if (
      lowerMessage.includes('thank') || 
      lowerMessage.includes('thanks') ||
      lowerMessage.includes('appreciate') ||
      lowerMessage.includes('grateful') ||
      lowerMessage.includes('much obliged') ||
      lowerMessage === 'ty' ||
      lowerMessage === 'thx' ||
      lowerMessage === 'tnx' ||
      lowerMessage.startsWith('thank you') ||
      lowerMessage.startsWith('thanks ') ||
      lowerMessage === 'thank you' ||
      lowerMessage === 'thanks' ||
      lowerMessage === 'thank' ||
      lowerMessage.includes('bless you')
    ) {
      return "You're very welcome! 😊 I'm happy I could help. Please don't hesitate to ask if you have any other questions. I'm here to assist you with anything you need about our dental practice."
    }

    // Goodbye/Farewell
    if (
      lowerMessage.includes('bye') || 
      lowerMessage.includes('goodbye') ||
      lowerMessage.includes('see you') ||
      lowerMessage.includes('farewell') ||
      lowerMessage === 'bye' ||
      lowerMessage.startsWith('bye ') ||
      lowerMessage.includes('have a good') ||
      lowerMessage.includes('take care')
    ) {
      return "Goodbye! Have a wonderful day. Feel free to come back if you have any more questions. We look forward to helping you with your dental care needs!"
    }

    // Booking related (expanded for older users and more variations)
    if (
      lowerMessage.includes('book') || 
      lowerMessage.includes('appointment') || 
      lowerMessage.includes('schedule') ||
      lowerMessage.includes('make an appointment') ||
      lowerMessage.includes('set up') ||
      lowerMessage.includes('arrange') ||
      lowerMessage.includes('come in') ||
      lowerMessage.includes('visit') ||
      lowerMessage.includes('see a dentist') ||
      lowerMessage.includes('see the dentist') ||
      lowerMessage.includes('come see') ||
      lowerMessage.includes('make appointment') ||
      lowerMessage.includes('need to see') ||
      lowerMessage.includes('when can i')
    ) {
      if (lowerMessage.includes('recurring') || lowerMessage.includes('repeat') || lowerMessage.includes('regular') || lowerMessage.includes('every week') || lowerMessage.includes('every month') || lowerMessage.includes('regular appointment')) {
        return "Yes! We offer recurring appointments for patients who need regular visits. When booking, you can set up appointments to repeat daily, weekly, monthly, or yearly. This is perfect for regular cleanings, orthodontic adjustments, or ongoing treatments. The system will automatically schedule your appointments based on your preference. Just let our staff know when you book, or call us at +27 11 123 4567 to set up recurring appointments."
      }
      if (lowerMessage.includes('returning') || lowerMessage.includes('been here before') || lowerMessage.includes('previous patient') || lowerMessage.includes('regular patient')) {
        return "Welcome back! If you've booked with us before, our staff can quickly find your information to make booking faster. When you call us at +27 11 123 4567, they can pull up your previous appointments and medical history to streamline the process. You can also book online again - just use the same contact information, and we'll have your details on file."
      }
      if (lowerMessage.includes('how') || lowerMessage.includes('where') || lowerMessage.includes('what do i')) {
        return "Booking an appointment is easy! Here's how: 1) Click the 'Book Appointment' button at the top of the page, 2) Choose the service you need (like cleaning, consultation, etc.), 3) Select your preferred dentist, 4) Pick a date and time that works for you, 5) Fill in your name, email, and phone number. That's it! The whole process takes just a few minutes. Payment is made on the day of your visit. Would you like help with any specific step?"
      }
      if (lowerMessage.includes('online') || lowerMessage.includes('website') || lowerMessage.includes('internet')) {
        return "Yes, you can book online right here on our website! Just click the 'Book Appointment' button in the top menu. If you're not comfortable with online booking, you can also call us at +27 11 123 4567 and we'll be happy to help you over the phone."
      }
      return "To book an appointment, simply click the 'Book Appointment' button at the top of this page. You'll go through a few easy steps: choose your service, pick your dentist, select a date and time, and provide your contact information. No payment is required upfront - you'll pay on the day of your appointment. Don't worry - it's very straightforward, and if you need help, you can always call us at +27 11 123 4567."
    }

    // Pricing and Payment related (updated - no deposit required)
    if (
      lowerMessage.includes('deposit') || 
      lowerMessage.includes('payment') || 
      lowerMessage.includes('pay') ||
      lowerMessage.includes('money') ||
      lowerMessage.includes('cost') ||
      lowerMessage.includes('price') ||
      lowerMessage.includes('how much') ||
      lowerMessage.includes('fee') ||
      lowerMessage.includes('charge') ||
      lowerMessage.includes('credit card') ||
      lowerMessage.includes('card required')
    ) {
      if (lowerMessage.includes('how much') || lowerMessage.includes('what is') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return "Our services range from R650 for Teeth Cleaning to R3500 for Root Canal Treatment. The exact price depends on the service you choose. You can see all service prices on our homepage or during the booking process. Payment is made on the day of your appointment - we accept cash, card, and medical aid."
      }
      if (lowerMessage.includes('when') || lowerMessage.includes('how to pay') || lowerMessage.includes('payment method')) {
        return "Payment is made on the day of your appointment. We accept cash, card payments, and direct medical aid claims (subject to verification). There's no deposit required when booking - you simply pay when you come in for your visit."
      }
      if (lowerMessage.includes('deposit') || lowerMessage.includes('required')) {
        return "No deposit is required to book an appointment. You simply pay for your service on the day of your visit. We accept cash, card, and medical aid payments."
      }
      return "Payment is made on the day of your appointment. We accept cash, card payments, and medical aid. There's no deposit or upfront payment required when booking - you simply pay when you come in for your visit."
    }

    // Services (expanded with more variations and explanations)
    if (
      lowerMessage.includes('service') || 
      lowerMessage.includes('treatment') || 
      lowerMessage.includes('what do you offer') ||
      lowerMessage.includes('what can you do') ||
      lowerMessage.includes('what services') ||
      lowerMessage.includes('what treatments') ||
      lowerMessage.includes('do you do') ||
      lowerMessage.includes('offer') ||
      lowerMessage.includes('cleaning') ||
      lowerMessage.includes('checkup') ||
      lowerMessage.includes('examination') ||
      lowerMessage.includes('whitening') ||
      lowerMessage.includes('implant') ||
      lowerMessage.includes('root canal') ||
      lowerMessage.includes('filling') ||
      lowerMessage.includes('crown') ||
      lowerMessage.includes('extraction') ||
      lowerMessage.includes('tooth pulled')
    ) {
      if (lowerMessage.includes('cleaning') || lowerMessage.includes('clean') || lowerMessage.includes('scale')) {
        return "Yes, we do teeth cleaning! Our Teeth Cleaning & Polish service costs R650 and takes about 45 minutes. This includes professional cleaning, scaling (removing tartar), and a fluoride treatment to protect your teeth. It's recommended every 6 months to keep your teeth and gums healthy."
      }
      if (lowerMessage.includes('checkup') || lowerMessage.includes('examination') || lowerMessage.includes('consultation')) {
        return "We offer Comprehensive Consultations for R850. This includes a full oral examination, X-rays if needed, and a personalized treatment plan. The consultation takes about 60 minutes and helps us understand your dental health needs."
      }
      if (lowerMessage.includes('whitening') || lowerMessage.includes('white')) {
        return "Yes, we offer professional Teeth Whitening for R2500. This is an in-office treatment that takes about 90 minutes and gives you noticeably whiter teeth. It's much more effective than over-the-counter products."
      }
      if (lowerMessage.includes('implant')) {
        return "We offer Dental Implant Consultations for R1200. During this 60-minute consultation, we'll assess whether implants are right for you and create a treatment plan. Implants are a great solution for replacing missing teeth."
      }
      if (lowerMessage.includes('root canal')) {
        return "Yes, we perform Root Canal Treatment for R3500. This procedure saves your tooth when the nerve is damaged or infected. It takes about 2 hours and is much more comfortable than it used to be with modern techniques."
      }
      if (lowerMessage.includes('emergency') || lowerMessage.includes('pain') || lowerMessage.includes('urgent')) {
        return "We offer Emergency Visits for R950. These 30-minute appointments are for urgent dental problems like severe pain, trauma, or infections. If you have a dental emergency, please call us at +27 11 123 4567."
      }
      return "We offer a full range of dental services: Comprehensive Consultation (R850), Teeth Cleaning & Polish (R650), Teeth Whitening (R2500), Dental Implant Consultation (R1200), Root Canal Treatment (R3500), and Emergency Visits (R950). We also do fillings, crowns, extractions, and more. What specific treatment are you interested in?"
    }

    // Dentists (expanded with more context)
    if (
      lowerMessage.includes('dentist') || 
      lowerMessage.includes('doctor') || 
      lowerMessage.includes('who') ||
      lowerMessage.includes('dental professional') ||
      lowerMessage.includes('practitioner') ||
      lowerMessage.includes('who will') ||
      lowerMessage.includes('who does') ||
      lowerMessage.includes('which dentist')
    ) {
      if (lowerMessage.includes('best') || lowerMessage.includes('recommend') || lowerMessage.includes('which one')) {
        return "All our dentists are highly qualified and experienced! Dr. Sarah Johnson specializes in general dentistry (12 years experience), Dr. Michael Chen is our expert in orthodontics and implants (15 years), and Dr. Emily Williams focuses on cosmetic and restorative work (10 years). During booking, you can see their specializations and choose who you'd like to see. They're all excellent!"
      }
      return "We have three wonderful, experienced dentists: Dr. Sarah Johnson specializes in General Dentistry with 12 years of experience, Dr. Michael Chen is our expert in Orthodontics & Implants with 15 years of experience, and Dr. Emily Williams focuses on Cosmetic & Restorative dentistry with 10 years of experience. You can choose your preferred dentist when you book your appointment. They're all highly qualified and caring professionals."
    }

    // Location (expanded with directions and parking info)
    if (
      lowerMessage.includes('location') || 
      lowerMessage.includes('address') || 
      lowerMessage.includes('where') || 
      lowerMessage.includes('find') ||
      lowerMessage.includes('directions') ||
      lowerMessage.includes('how to get') ||
      lowerMessage.includes('parking') ||
      lowerMessage.includes('park') ||
      lowerMessage.includes('drive') ||
      lowerMessage.includes('located')
    ) {
      if (lowerMessage.includes('parking') || lowerMessage.includes('park')) {
        return "Yes, we have secure parking available on-site! There's plenty of parking space, so you won't have to worry about finding a spot. The parking is free for our patients."
      }
      if (lowerMessage.includes('directions') || lowerMessage.includes('how to get') || lowerMessage.includes('drive')) {
        return "We're located at 123 Medical Boulevard, Sandton, Johannesburg 2196. We're just off the M1 highway, making us easy to reach. You can get directions by visiting our Location page - there's a Google Maps link that will give you turn-by-turn directions from your location."
      }
      return "We're located at 123 Medical Boulevard, Sandton, Johannesburg 2196, South Africa. We have secure parking on-site. You can find us easily on Google Maps - just visit the 'Location' page in the top menu, and you'll see a map with directions. We're conveniently located just off the M1 highway."
    }

    // Hours (expanded with more variations)
    if (
      lowerMessage.includes('hours') || 
      lowerMessage.includes('open') || 
      lowerMessage.includes('time') || 
      lowerMessage.includes('when') ||
      lowerMessage.includes('what time') ||
      lowerMessage.includes('closed') ||
      lowerMessage.includes('available') ||
      lowerMessage.includes('weekend') ||
      lowerMessage.includes('saturday') ||
      lowerMessage.includes('sunday') ||
      lowerMessage.includes('monday') ||
      lowerMessage.includes('friday')
    ) {
      if (lowerMessage.includes('weekend') || lowerMessage.includes('saturday') || lowerMessage.includes('sunday')) {
        return "We're closed on weekends (Saturday and Sunday) to allow our team to rest and spend time with their families. However, for dental emergencies, you can call our emergency line at +27 11 123 4567, and we'll do our best to help."
      }
      if (lowerMessage.includes('today') || lowerMessage.includes('now')) {
        return "We're open Monday to Friday from 8:00 AM to 5:00 PM. If you're calling outside these hours, please leave a message or call our emergency line at +27 11 123 4567 for urgent dental issues."
      }
      return "Our practice is open Monday to Friday from 8:00 AM to 5:00 PM. We're closed on weekends. For dental emergencies outside these hours, please call +27 11 123 4567 and we'll assist you."
    }

    // Contact (expanded with more options)
    if (
      lowerMessage.includes('contact') || 
      lowerMessage.includes('phone') || 
      lowerMessage.includes('email') || 
      lowerMessage.includes('call') ||
      lowerMessage.includes('number') ||
      lowerMessage.includes('reach') ||
      lowerMessage.includes('speak to') ||
      lowerMessage.includes('talk to') ||
      lowerMessage.includes('get in touch')
    ) {
      if (lowerMessage.includes('phone') || lowerMessage.includes('call') || lowerMessage.includes('number')) {
        return "Our phone number is +27 11 123 4567. You can call us Monday to Friday between 8:00 AM and 5:00 PM. If you call outside these hours, please leave a message and we'll get back to you. For emergencies, you can also call this number."
      }
      if (lowerMessage.includes('email') || lowerMessage.includes('e-mail')) {
        return "Our email address is info@premiumdental.co.za. You can send us an email anytime, and we'll respond within 24 hours during business days. You can also use the Contact page on our website to send us a message directly."
      }
      return "You can reach us in several ways: Phone us at +27 11 123 4567 (Monday-Friday, 8 AM - 5 PM), Email us at info@premiumdental.co.za, or visit our Contact page to send us a message through the website. We're here to help!"
    }

    // Cancellation
    if (lowerMessage.includes('cancel') || lowerMessage.includes('reschedule') || lowerMessage.includes('change')) {
      if (lowerMessage.includes('policy') || lowerMessage.includes('billed') || lowerMessage.includes('charge')) {
        return "Our cancellation policy requires that all cancellations be made at least 1 hour before your scheduled appointment time. If you cancel less than 1 hour before your appointment or fail to show up, you will be billed for the appointment. You can cancel using the link in your confirmation email or by calling us at +27 11 123 4567."
      }
      return "To cancel or reschedule your appointment, you'll receive a cancellation link in your confirmation email. Click the link to access the cancellation portal where you can manage your appointment. Please note: cancellations must be made at least 1 hour before your appointment time, otherwise you will be billed."
    }

    // Reminders
    if (lowerMessage.includes('reminder') || lowerMessage.includes('notification') || lowerMessage.includes('alert')) {
      return "We offer appointment reminders via SMS, WhatsApp, and Google Calendar. You can select your preferred reminder methods during the booking process in the Patient Details step."
    }

    // Pricing
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much') || lowerMessage.includes('fee')) {
      return "Our services range from R650 for Teeth Cleaning to R3500 for Root Canal Treatment. The exact price depends on the service you choose. You can see all service prices on our homepage or during the booking process. Payment is made on the day of your appointment - no deposit required."
    }

    // Emergency
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('pain') || lowerMessage.includes('hurt')) {
      return "For dental emergencies, we offer Emergency Visit appointments (R950, 30 minutes). For urgent care outside business hours, please call +27 11 123 4567. We're here to help with dental pain and trauma."
    }

    // Insurance
    if (lowerMessage.includes('insurance') || lowerMessage.includes('medical aid') || lowerMessage.includes('cover')) {
      return "We accept most major medical aid schemes. Please bring your medical aid card to your appointment. You can contact us at +27 11 123 4567 to verify if your specific medical aid is accepted."
    }

    // General help
    if (lowerMessage.includes('help') || lowerMessage.includes('stuck') || lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
      return "I'm here to help! You can ask me about: booking appointments (including recurring appointments for regular visits), our services, pricing, location, operating hours, contact information, returning patient benefits, or anything else about our practice. What would you like to know?"
    }

    // Confirmation/Yes responses
    if (
      lowerMessage === 'yes' ||
      lowerMessage === 'yeah' ||
      lowerMessage === 'yep' ||
      lowerMessage === 'yup' ||
      lowerMessage === 'ok' ||
      lowerMessage === 'okay' ||
      lowerMessage === 'sure' ||
      lowerMessage === 'alright' ||
      lowerMessage.startsWith('yes ') ||
      lowerMessage.startsWith('yeah ')
    ) {
      return "Great! What would you like to know more about? I can help with booking, services, pricing, location, hours, or anything else about our dental practice."
    }

    // No/Negative responses
    if (
      lowerMessage === 'no' ||
      lowerMessage === 'nope' ||
      lowerMessage === 'nah' ||
      lowerMessage.startsWith('no ') ||
      lowerMessage.startsWith('not ')
    ) {
      return "That's perfectly fine! Is there anything else I can help you with? I'm here to answer any questions about our dental practice."
    }

    // Confusion/Don't understand
    if (
      lowerMessage.includes("don't understand") ||
      lowerMessage.includes('confused') ||
      lowerMessage.includes('unclear') ||
      lowerMessage.includes('not sure') ||
      lowerMessage.includes('what do you mean')
    ) {
      return "I understand - let me try to explain things more clearly. What specifically would you like help with? I can walk you through booking an appointment, explain our services, help you find our location, or answer questions about pricing. What's on your mind?"
    }

    // Technology/Website help (for older users)
    if (
      lowerMessage.includes('website') ||
      lowerMessage.includes('internet') ||
      lowerMessage.includes('online') ||
      lowerMessage.includes('computer') ||
      lowerMessage.includes('not good with') ||
      lowerMessage.includes('not comfortable') ||
      lowerMessage.includes('difficult') ||
      lowerMessage.includes('complicated') ||
      lowerMessage.includes('confusing')
    ) {
      return "I completely understand - technology can be confusing! Don't worry, you don't have to use the website if you're not comfortable. You can always call us directly at +27 11 123 4567, and our friendly staff will help you book an appointment over the phone. We're here Monday to Friday, 8 AM to 5 PM. Would you like our phone number?"
    }

    // About page / Practice information
    if (
      lowerMessage.includes('about') ||
      lowerMessage.includes('practice') ||
      lowerMessage.includes('mission') ||
      lowerMessage.includes('who are you') ||
      lowerMessage.includes('tell me about') ||
      lowerMessage.includes('what is premium dental')
    ) {
      if (lowerMessage.includes('mission') || lowerMessage.includes('values') || lowerMessage.includes('believe')) {
        return "Our mission at Premium Dental is to provide exceptional dental services in a comfortable, modern environment while making the booking process as simple and convenient as possible. We believe everyone deserves access to world-class dental care. We've revolutionized the appointment booking experience with our innovative online platform, reducing no-shows by 42% and ensuring every patient receives the care they need when they need it."
      }
      return "Premium Dental Practice is a premier dental practice in South Africa, dedicated to providing exceptional dental care with a focus on patient comfort and satisfaction. We're an award-winning practice with an expert team of highly qualified dentists. We use modern technology and state-of-the-art equipment to provide patient-centered care. You can learn more about us on our 'About Us' page in the top menu."
    }

    // Team / Dentists - more specific questions
    if (
      lowerMessage.includes('team') ||
      lowerMessage.includes('staff') ||
      lowerMessage.includes('sarah johnson') ||
      lowerMessage.includes('michael chen') ||
      lowerMessage.includes('emily williams') ||
      lowerMessage.includes('qualifications') ||
      lowerMessage.includes('experience') ||
      lowerMessage.includes('specialist') ||
      lowerMessage.includes('specialization')
    ) {
      if (lowerMessage.includes('sarah') || (lowerMessage.includes('johnson') && !lowerMessage.includes('michael'))) {
        return "Dr. Sarah Johnson specializes in General Dentistry with 12 years of experience. She has a BDS and MDS degree and is specialized in preventive care and cosmetic dentistry. She has a 4.9 rating with 234 reviews. You can learn more about her and our other dentists on the 'Our Team' page."
      }
      if (lowerMessage.includes('michael') || lowerMessage.includes('chen')) {
        return "Dr. Michael Chen is our expert in Orthodontics & Implants with 15 years of experience. He has a BDS, MDS, and PhD degree and is known for precision and patient care. He has a 4.8 rating with 189 reviews. You can learn more about him and our other dentists on the 'Our Team' page."
      }
      if (lowerMessage.includes('emily') || lowerMessage.includes('williams')) {
        return "Dr. Emily Williams specializes in Cosmetic & Restorative dentistry with 10 years of experience. She has a BDS and MDS degree and is passionate about creating beautiful smiles through advanced cosmetic and restorative procedures. She has a 4.9 rating with 156 reviews. You can learn more about her and our other dentists on the 'Our Team' page."
      }
      return `We have three excellent dentists: ${DENTISTS.map(d => `${d.name} (${d.specialization}, ${d.experience} years)`).join(', ')}. All are highly qualified and experienced. You can read more about each dentist, their qualifications, and patient reviews on the 'Our Team' page in the top menu.`
    }

    // Reviews / Testimonials
    if (
      lowerMessage.includes('review') ||
      lowerMessage.includes('testimonial') ||
      lowerMessage.includes('rating') ||
      lowerMessage.includes('feedback') ||
      lowerMessage.includes('what do patients say') ||
      lowerMessage.includes('patient experience')
    ) {
      return "We're proud to have excellent patient reviews! Our dentists have ratings between 4.8 and 4.9 stars, with hundreds of satisfied patients. Patients consistently praise our professional service, modern technology, seamless booking process, and caring staff. You can read patient testimonials on our homepage in the 'What Our Patients Say' section."
    }

    // Contact page questions
    if (
      lowerMessage.includes('contact page') ||
      lowerMessage.includes('send message') ||
      lowerMessage.includes('contact form') ||
      lowerMessage.includes('get in touch')
    ) {
      return "You can contact us in several ways: 1) Use the Contact page on our website to send us a message directly, 2) Call us at +27 11 123 4567 (Monday-Friday, 8 AM - 5 PM), 3) Email us at info@premiumdental.co.za, or 4) Visit us at 123 Medical Boulevard, Sandton, Johannesburg. For emergencies outside business hours, call our emergency line at +27 11 123 4567."
    }

    // Location page / Directions
    if (
      lowerMessage.includes('location page') ||
      lowerMessage.includes('directions') ||
      lowerMessage.includes('how to get there') ||
      lowerMessage.includes('map') ||
      lowerMessage.includes('gautrain') ||
      lowerMessage.includes('public transport') ||
      lowerMessage.includes('car') ||
      lowerMessage.includes('parking')
    ) {
      if (lowerMessage.includes('gautrain') || lowerMessage.includes('public transport') || lowerMessage.includes('train') || lowerMessage.includes('bus')) {
        return "We're easily accessible via public transport! The practice is just 5 minutes walk from the Gautrain Sandton Station. Multiple bus routes also serve the area. Visit our Location page for more details and a map."
      }
      if (lowerMessage.includes('car') || lowerMessage.includes('drive') || lowerMessage.includes('highway')) {
        return "We're located on Medical Boulevard in Sandton, with easy access from the N1 and M1 highways. We have free parking available on-site for all patients. Visit our Location page for detailed directions and a Google Maps link."
      }
      return "Visit our Location page in the top menu for detailed information about finding us, including a Google Maps link, directions by car and public transport, parking information, and our full address: 123 Medical Boulevard, Sandton, Johannesburg 2196, South Africa."
    }

    // Privacy Policy / Terms of Service
    if (
      lowerMessage.includes('privacy') ||
      lowerMessage.includes('data') ||
      lowerMessage.includes('information') ||
      lowerMessage.includes('popia') ||
      lowerMessage.includes('cpa') ||
      lowerMessage.includes('ecta') ||
      lowerMessage.includes('personal information') ||
      lowerMessage.includes('data protection')
    ) {
      if (lowerMessage.includes('terms') || lowerMessage.includes('service') || lowerMessage.includes('agreement')) {
        return "Our Terms of Service cover appointment booking, cancellation policies, payment terms, and your rights as a consumer under the Consumer Protection Act (CPA). You can read the full Terms of Service by clicking 'Terms of Service' in the footer or visiting /terms on our website."
      }
      return "We take your privacy seriously and comply with POPIA (Protection of Personal Information Act), CPA (Consumer Protection Act), and ECTA (Electronic Communications and Transactions Act). We only collect necessary information for providing dental services and managing appointments. You can read our full Privacy Policy by clicking 'Privacy Policy' in the footer or visiting /privacy on our website. Our Information Officer is Dr. Jane Smith (privacy@premiumdental.co.za)."
    }

    // What to expect / First visit
    if (
      lowerMessage.includes('what to expect') ||
      lowerMessage.includes('first visit') ||
      lowerMessage.includes('first appointment') ||
      lowerMessage.includes('what happens') ||
      lowerMessage.includes('what should i bring') ||
      lowerMessage.includes('prepare') ||
      lowerMessage.includes('arrive')
    ) {
      if (lowerMessage.includes('bring') || lowerMessage.includes('need')) {
        return "For your first visit, please bring: 1) Your ID or passport, 2) Your medical aid card (if applicable), 3) A list of any medications you're taking, 4) Any previous dental X-rays if you have them. Arrive 10-15 minutes early to complete any necessary paperwork."
      }
      return "During your first visit, you'll have a comprehensive consultation where we'll examine your oral health, take X-rays if needed, and create a personalized treatment plan. The consultation takes about 60 minutes. Our friendly staff will make you feel comfortable, and you'll have time to ask any questions. We use modern, pain-free techniques to ensure your comfort."
    }

    // Follow-up care / After treatment
    if (
      lowerMessage.includes('follow up') ||
      lowerMessage.includes('after treatment') ||
      lowerMessage.includes('after care') ||
      lowerMessage.includes('recovery') ||
      lowerMessage.includes('post treatment')
    ) {
      return "After your treatment, we'll provide you with detailed after-care instructions. Depending on your procedure, you may need a follow-up appointment. We'll schedule this before you leave. If you have any questions or concerns after your visit, don't hesitate to call us at +27 11 123 4567."
    }

    // Payment methods - more detailed
    if (
      lowerMessage.includes('ozow') ||
      lowerMessage.includes('payfast') ||
      lowerMessage.includes('payment method') ||
      lowerMessage.includes('how to pay') ||
      lowerMessage.includes('bank transfer') ||
      lowerMessage.includes('eft') ||
      lowerMessage.includes('cash')
    ) {
      return "Payment is made on the day of your appointment. We accept cash, card payments (credit and debit), and direct medical aid claims (subject to verification). There's no deposit or upfront payment required when booking - you simply pay when you come in for your visit."
    }

    // Website navigation / Pages
    if (
      lowerMessage.includes('page') ||
      lowerMessage.includes('menu') ||
      lowerMessage.includes('navigate') ||
      lowerMessage.includes('where is') ||
      lowerMessage.includes('find') ||
      lowerMessage.includes('homepage') ||
      lowerMessage.includes('home page')
    ) {
      if (lowerMessage.includes('home') || lowerMessage.includes('main')) {
        return "The homepage shows our services, patient testimonials, and information about our practice. You can book an appointment, learn about our team, or explore our services from there. Click 'Home' in the top menu to return to the homepage."
      }
      return "Our website has several pages: Home (services and testimonials), About Us (our mission and practice info), Our Team (meet our dentists), Book Appointment (booking portal), Location (directions and map), and Contact (contact form and information). Use the top menu to navigate between pages."
    }

    // Accessibility / Special needs
    if (
      lowerMessage.includes('accessibility') ||
      lowerMessage.includes('disabled') ||
      lowerMessage.includes('wheelchair') ||
      lowerMessage.includes('special needs') ||
      lowerMessage.includes('accommodation')
    ) {
      return "We're committed to making our practice accessible to everyone. Our facility is wheelchair accessible, and we have parking close to the entrance. If you have specific accessibility needs, please let us know when booking, and we'll make sure everything is arranged for your comfort. Call us at +27 11 123 4567 to discuss any special requirements."
    }

    // Booking process - more detailed steps
    if (
      lowerMessage.includes('step') ||
      lowerMessage.includes('process') ||
      lowerMessage.includes('how does booking work') ||
      lowerMessage.includes('walkthrough')
    ) {
      if (lowerMessage.includes('recurring') || lowerMessage.includes('repeat')) {
        return "For recurring appointments, the process is: 1) Choose your service, 2) Select your dentist, 3) Pick your first appointment date and time, 4) Choose how often you want to repeat (daily, weekly, monthly, or yearly), 5) Set when the recurring appointments should end (never, on a specific date, or after a certain number of visits), 6) Enter your contact details. That's it! The system will automatically schedule all your future appointments based on your preferences. Payment is made on the day of each appointment."
      }
      return "The booking process has 4 simple steps: 1) Choose your service (cleaning, consultation, etc.), 2) Select your preferred dentist (or we can assign one), 3) Pick a date and time from available slots, 4) Enter your contact details (name, email, phone). That's it! You'll receive a confirmation email with all the details. Payment is made on the day of your appointment - no deposit required. The whole process takes just a few minutes! For regular visits, you can also set up recurring appointments."
    }

    // Specific service questions
    if (
      lowerMessage.includes('filling') ||
      lowerMessage.includes('crown') ||
      lowerMessage.includes('extraction') ||
      lowerMessage.includes('braces') ||
      lowerMessage.includes('orthodontic') ||
      lowerMessage.includes('cosmetic')
    ) {
      if (lowerMessage.includes('filling')) {
        return "Yes, we do fillings! Fillings are used to repair cavities and restore damaged teeth. The cost depends on the size and material used. During your consultation, we'll assess what's needed and provide a detailed treatment plan with pricing."
      }
      if (lowerMessage.includes('crown')) {
        return "Yes, we provide dental crowns! Crowns are used to restore damaged or weakened teeth. The cost varies depending on the material and complexity. We'll discuss your options during your consultation."
      }
      if (lowerMessage.includes('extraction') || lowerMessage.includes('remove tooth') || lowerMessage.includes('pull tooth')) {
        return "Yes, we perform tooth extractions when necessary. We use modern techniques to make the procedure as comfortable as possible. The cost depends on the complexity of the extraction. We'll discuss this during your consultation."
      }
      if (lowerMessage.includes('braces') || lowerMessage.includes('orthodontic')) {
        return "Dr. Michael Chen specializes in orthodontics, including braces and other orthodontic treatments. We offer consultations to assess your needs and create a treatment plan. Book a consultation to discuss your orthodontic options."
      }
      if (lowerMessage.includes('cosmetic')) {
        return "Dr. Emily Williams specializes in cosmetic dentistry, including teeth whitening, veneers, and smile makeovers. We offer professional teeth whitening (R2500) and various cosmetic procedures. Book a consultation to discuss your cosmetic dental goals."
      }
    }

    // Cancellation policy - more detailed
    if (
      lowerMessage.includes('cancellation policy') ||
      lowerMessage.includes('refund') ||
      lowerMessage.includes('24 hours') ||
      lowerMessage.includes('no show')
    ) {
      if (lowerMessage.includes('recurring') || lowerMessage.includes('repeat')) {
        return "For recurring appointments, you can cancel individual appointments or the entire series. All cancellations must be made at least 1 hour before the scheduled appointment time, otherwise you will be billed. To cancel a recurring series, contact us at +27 11 123 4567 at least 1 hour before the next scheduled appointment."
      }
      return "Our cancellation policy: All cancellations must be made at least 1 hour before your scheduled appointment time. If you cancel less than 1 hour before your appointment or fail to show up, you will be billed for the appointment. You can reschedule free of charge if done at least 1 hour in advance. Use the cancellation link in your confirmation email to manage your appointment, or call us at +27 11 123 4567."
    }

    // Default response (more helpful and conversational)
    return "I want to make sure I help you properly. Could you tell me a bit more about what you're looking for? I can help with: booking an appointment (including setting up recurring appointments for regular visits), our services and what we offer, pricing and costs, finding our location, our opening hours, our team of dentists, contact information, privacy and terms, returning patient information, or anything else about our practice. What would be most helpful for you?"
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    // Simulate bot thinking delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 500)
  }

  const handleQuickQuestion = (question: string) => {
    setInputValue(question)
    setTimeout(() => {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: question,
        sender: 'user',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])

      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: getBotResponse(question),
          sender: 'bot',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botResponse])
      }, 500)
    }, 100)
  }

  const quickQuestions = [
    'How do I book an appointment?',
    'What services do you offer?',
    'Where are you located?',
    'What are your opening hours?',
    'Who are your dentists?',
    'When do I pay for my appointment?',
  ]

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 md:right-6 w-12 h-12 md:w-14 md:h-14 bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-gray-900 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 md:bottom-24 right-4 md:right-6 w-[calc(100vw-2rem)] md:w-96 h-[calc(100vh-6rem)] md:h-[600px] max-h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50"
          >
            {/* Header */}
            <div className="bg-gray-800 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Premium Dental Assistant</h3>
                  <p className="text-xs text-gray-300">We're here to help</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user'
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {message.sender === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full transition-colors border border-gray-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 bg-gray-800 text-white rounded-lg flex items-center justify-center hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Chatbot


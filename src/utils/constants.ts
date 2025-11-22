import { Service, Review, Dentist } from '../types'

export const SERVICES: Service[] = [
  {
    id: '1',
    name: 'Comprehensive Consultation',
    description: 'Full oral examination, X-rays, and treatment plan',
    duration: 60,
    price: 850,
    icon: 'stethoscope',
  },
  {
    id: '2',
    name: 'Teeth Cleaning & Polish',
    description: 'Professional cleaning, scaling, and fluoride treatment',
    duration: 45,
    price: 650,
    icon: 'sparkles',
  },
  {
    id: '3',
    name: 'Teeth Whitening',
    description: 'In-office professional whitening treatment',
    duration: 90,
    price: 2500,
    icon: 'sun',
  },
  {
    id: '4',
    name: 'Dental Implant Consultation',
    description: 'Assessment and planning for dental implants',
    duration: 60,
    price: 1200,
    icon: 'tooth',
  },
  {
    id: '5',
    name: 'Root Canal Treatment',
    description: 'Endodontic treatment to save your tooth',
    duration: 120,
    price: 3500,
    icon: 'syringe',
  },
  {
    id: '6',
    name: 'Emergency Visit',
    description: 'Urgent dental care for pain or trauma',
    duration: 30,
    price: 950,
    icon: 'alert-circle',
  },
]

export const REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    rating: 5,
    comment: 'Absolutely exceptional service! The booking process was seamless and the staff made me feel so comfortable. Best dental experience I\'ve had.',
    date: '2024-01-15',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: '2',
    name: 'James Thompson',
    rating: 5,
    comment: 'Professional, modern, and efficient. The online booking saved me so much time, and the reminder system is brilliant. Highly recommend!',
    date: '2024-01-10',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: '3',
    name: 'Emma Wilson',
    rating: 5,
    comment: 'The practice is beautiful and the technology they use is impressive. My teeth have never looked better. Worth every rand!',
    date: '2024-01-05',
    avatar: 'https://i.pravatar.cc/150?img=33',
  },
  {
    id: '4',
    name: 'Michael Brown',
    rating: 5,
    comment: 'From booking to treatment, everything was perfect. The deposit system ensures appointments are kept, which is great for everyone.',
    date: '2023-12-28',
    avatar: 'https://i.pravatar.cc/150?img=20',
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    rating: 5,
    comment: 'I was nervous about dental work, but the team put me at ease. The booking portal is user-friendly and the whole experience was top-notch.',
    date: '2023-12-20',
    avatar: 'https://i.pravatar.cc/150?img=45',
  },
]

export const DENTISTS: Dentist[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'General Dentistry',
    experience: 12,
    rating: 4.9,
    reviews: 234,
    qualifications: 'BDS, MDS',
    bio: 'Specialized in preventive care and cosmetic dentistry with over 12 years of experience.',
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Orthodontics & Implants',
    experience: 15,
    rating: 4.8,
    reviews: 189,
    qualifications: 'BDS, MDS, PhD',
    bio: 'Expert in orthodontic treatments and dental implants. Known for precision and patient care.',
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: '3',
    name: 'Dr. Emily Williams',
    specialization: 'Cosmetic & Restorative',
    experience: 10,
    rating: 4.9,
    reviews: 156,
    qualifications: 'BDS, MDS',
    bio: 'Passionate about creating beautiful smiles through advanced cosmetic and restorative procedures.',
    avatar: 'https://i.pravatar.cc/150?img=33',
  },
]

export const DEPOSIT_AMOUNT = 50
export const TRUST_BADGES = [
  'SSL Secured',
  'Powered by Google Firebase',
  '42% fewer no-shows',
  'R50 deposit secures your appointment',
]


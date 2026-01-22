import { Service, Review, Dentist, Staff } from '../types'

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
    comment: 'From consultation to treatment, everything was perfect. The professional service and care are exceptional.',
    date: '2023-12-28',
    avatar: 'https://i.pravatar.cc/150?img=20',
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    rating: 5,
    comment: 'I was nervous about dental work, but the team put me at ease. The whole experience was top-notch and professional.',
    date: '2023-12-20',
    avatar: 'https://i.pravatar.cc/150?img=45',
  },
]

export const DENTISTS: Dentist[] = [
  // Ruimsig Branch
  {
    id: '1',
    name: 'Dr Stefan Victor',
    specialization: 'Fixed Prosthodontics & Restorative Care',
    experience: 12,
    rating: 4.9,
    reviews: 234,
    qualifications: 'BDS, MDS',
    bio: 'Dr Stefan Victor is an experienced dentist, passionate about fixed prosthodontics and restorative care—turning smiles back to life, one tooth at a time. He practices at both our Ruimsig and Weltevreden Park locations.',
    branch: 'Both',
  },
  {
    id: '2',
    name: 'Dr Rivesh Singh',
    specialization: 'Oral Surgery',
    experience: 15,
    rating: 4.8,
    reviews: 189,
    qualifications: 'BDS, MDS',
    bio: 'Dr Rivesh Singh has a keen interest in oral surgery and a strong passion for providing great quality treatment without compromising patient care. He practices at both our Ruimsig and Weltevreden Park locations.',
    branch: 'Both',
  },
  {
    id: '3',
    name: 'Dr Ritesh Singh',
    specialization: 'General & Restorative Dentistry',
    experience: 10,
    rating: 4.9,
    reviews: 156,
    qualifications: 'BDS, MDS',
    bio: 'Dr Ritesh Singh is an experienced practitioner with experience in crown and bridge work, dentures, fillings, and root canal treatments. He is passionate about helping patients achieve confident smiles and a better quality of life through attentive, high-quality care. He practices at both our Ruimsig and Weltevreden Park locations.',
    branch: 'Both',
  },
]

export const RUIMSIG_STAFF: Staff[] = [
  {
    id: '1',
    name: 'Leneach',
    role: 'Reception & Administration',
    bio: 'Leneach is committed to ensuring that all our patients receive a warm welcome, whilst attending to all our bookings and general enquiries, making sure every patient is well cared for.',
    branch: 'Ruimsig',
  },
  {
    id: '2',
    name: 'Zanele',
    role: 'Dental Assistant',
    bio: "Zanele's steady hands help our docs sail through treatments effortlessly whilst ensuring maximum patient comfort.",
    branch: 'Ruimsig',
  },
  {
    id: '3',
    name: 'Rose',
    role: 'Cleaner & CSSD Manager',
    bio: 'Rose keeps our space spotless, so smiles stay bright!',
    branch: 'Ruimsig',
  },
]

export const TRUST_BADGES = [
  'SSL Secured',
  'Professional Service',
  'Modern Technology',
  'Patient-Centered Care',
]


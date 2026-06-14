export const SITE_URL = 'https://drnstaylor.co.za'
export const SITE_NAME = 'Dr. NS Taylor and Associates Inc.'
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`

export interface PageSEOConfig {
  title: string
  description: string
  path: string
  keywords?: string
  jsonLd?: Record<string, unknown>
}

const DEFAULT: PageSEOConfig = {
  title: `Dentist Roodepoort – Trusted Dental Care Near You | DR NS Taylor & Associates Inc`,
  description:
    'Trusted dentist in Roodepoort with branches in Ruimsig and Weltevreden Park. Family-friendly general and cosmetic dental care for all ages. Book your appointment today.',
  path: '/',
}

const PAGE_SEO: Record<string, PageSEOConfig> = {
  '/': DEFAULT,
  '/about': {
    title: `About Us | Family Dental Practice | ${SITE_NAME}`,
    description:
      'Learn about Dr. NS Taylor & Associates Inc.—a family-oriented dental practice in Roodepoort offering compassionate, comprehensive care for patients of all ages.',
    path: '/about',
  },
  '/team': {
    title: `Our Dental Team | Experienced Dentists | ${SITE_NAME}`,
    description:
      'Meet our experienced dentists and support team at Ruimsig and Weltevreden Park. General, cosmetic, paediatric and restorative dental specialists.',
    path: '/team',
  },
  '/location': {
    title: `Dental Practice Locations | Ruimsig & Weltevreden Park | ${SITE_NAME}`,
    description:
      'Find Dr. NS Taylor & Associates in Ruimsig and Weltevreden Park, Roodepoort. Addresses, directions, maps and contact details for both branches.',
    path: '/location',
  },
  '/contact': {
    title: `Contact Us | Book a Dentist Appointment | ${SITE_NAME}`,
    description:
      'Contact our Ruimsig and Weltevreden Park dental practices. Phone, email and hours for appointments, enquiries and emergency dental care.',
    path: '/contact',
  },
  '/privacy': {
    title: `Privacy Policy | ${SITE_NAME}`,
    description:
      'Privacy policy for Dr. NS Taylor & Associates Inc. How we collect, use and protect your personal and health information.',
    path: '/privacy',
  },
  '/terms': {
    title: `Terms of Service | ${SITE_NAME}`,
    description:
      'Terms of service for using the Dr. NS Taylor & Associates Inc. website and appointment booking services.',
    path: '/terms',
  },
  '/dentist-krugersdorp': {
    title: `Dentist Krugersdorp – Trusted Dental Care | DR NS Taylor & Associates Inc`,
    description:
      'Trusted dentist in Krugersdorp offering general, cosmetic and restorative dental care. Patient-focused treatment at Dr. NS Taylor & Associates Inc. Book your appointment today.',
    path: '/dentist-krugersdorp',
    keywords:
      'dentist Krugersdorp, dentist near me Krugersdorp, dental practice Krugersdorp, cosmetic dentist Krugersdorp, general dentistry Krugersdorp, teeth whitening Krugersdorp, root canal Krugersdorp, Dr NS Taylor',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${SITE_URL}/dentist-krugersdorp#webpage`,
      url: `${SITE_URL}/dentist-krugersdorp`,
      name: 'Dentist Krugersdorp – Trusted Dental Care at Dr. NS Taylor & Associates Inc.',
      description:
        'Trusted dentist in Krugersdorp offering general, cosmetic and restorative dental care for individuals and families across Krugersdorp and surrounding areas.',
      inLanguage: 'en-ZA',
      isPartOf: { '@id': `${SITE_URL}/#organization` },
      about: {
        '@type': 'Dentist',
        name: SITE_NAME,
        areaServed: { '@type': 'City', name: 'Krugersdorp' },
      },
    },
  },
}

export function getPageSEO(pathname: string): PageSEOConfig {
  const path = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname
  return PAGE_SEO[path] ?? DEFAULT
}

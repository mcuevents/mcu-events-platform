export const siteConfig = {
  name: 'MCU (Mentor Crew Units) Creations',
  shortName: 'MCU Creations',
  foundedYear: 2026,
  description:
    'MCU (Mentor Crew Units) Creations is a Coimbatore-based startup founded in 2026, focused on event management and creating meaningful experiences for businesses, organizations and communities.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mcucreations.com',
  ogImage: '/logo.jpeg',
  contacts: {
    primaryPhone: '7010377731',
    secondaryPhone: '700667500',
    phone: '7010377731',
    email: 'info@mcucreations.com',
    address: '3rd Floor, Masakalipalayam, Ram Lakshman Nagar, Uppilipalayam, Coimbatore, Tamil Nadu - 641004, India',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    pincode: '641004',
    country: 'India',
    instagram: 'https://instagram.com/mcucreations',
    facebook: 'https://facebook.com/mcucreations',
    linkedin: 'https://linkedin.com/company/mcucreations',
    youtube: 'https://youtube.com/mcucreations',
  },

  /**
   * Helper function to generate clean canonical URLs for SEO
   */
  getCanonicalUrl: (path: string = ''): string => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mcucreations.com';
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl.replace(/\/$/, '')}${cleanPath}`;
  },
};

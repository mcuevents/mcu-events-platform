import {
  GlobalSiteSettings,
  GeneralSettings,
  ContactSettings,
  SocialAccountItem,
  BrandingSettings,
  FooterSettings,
  GlobalSEOSettings,
  AnalyticsSettings,
  MaintenanceSettings,
  AnnouncementSettings,
  GlobalCTASettings,
} from '@/types/globalSettings';

/* ==========================================================================
   DEFAULT PRODUCTION GLOBAL SETTINGS
   ========================================================================== */

export const defaultGeneralSettings: GeneralSettings = {
  siteName: 'MCU Creations',
  siteDescription:
    'MCU (Mentor Crew Units) Creations is a Coimbatore-based startup founded in 2026, focused on event management and digital engagement. We aim to create meaningful event experiences while helping businesses build stronger connections through social media platforms such as Instagram and Facebook.',
  companyName: 'MCU (Mentor Crew Units) Creations',
  defaultLanguage: 'en',
  defaultTimezone: 'Asia/Kolkata',
  websiteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://mcucreations.com',
};

export const defaultContactSettings: ContactSettings = {
  primaryPhone: '7010377731',
  secondaryPhone: '700667500',
  primaryEmail: 'mcuevents26@gmail.com',
  secondaryEmail: 'events@mcucreations.com',
  whatsappNumber: '7010377731',
  whatsappDefaultMessage: 'Hello MCU Creations, I would like to enquire about your event management and digital marketing services.',
  businessAddress: '3rd Floor, Masakalipalayam, Ram Lakshman Nagar, Uppilipalayam',
  city: 'Coimbatore',
  state: 'Tamil Nadu',
  country: 'India',
  pincode: '641004',
  businessHours: [
    { day: 'monday', label: 'Monday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
    { day: 'tuesday', label: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
    { day: 'wednesday', label: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
    { day: 'thursday', label: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
    { day: 'friday', label: 'Friday', isOpen: true, openTime: '09:00', closeTime: '19:00' },
    { day: 'saturday', label: 'Saturday', isOpen: true, openTime: '09:30', closeTime: '18:00' },
    { day: 'sunday', label: 'Sunday', isOpen: false, openTime: '10:00', closeTime: '14:00' },
  ],
};

export const defaultSocialSettings: SocialAccountItem[] = [
  {
    id: 'soc-1',
    platform: 'instagram',
    platformName: 'Instagram',
    url: 'https://instagram.com/mcucreations',
    enabled: true,
    displayOrder: 1,
  },
  {
    id: 'soc-2',
    platform: 'facebook',
    platformName: 'Facebook',
    url: 'https://facebook.com/mcucreations',
    enabled: true,
    displayOrder: 2,
  },
  {
    id: 'soc-3',
    platform: 'linkedin',
    platformName: 'LinkedIn',
    url: 'https://linkedin.com/company/mcucreations',
    enabled: true,
    displayOrder: 3,
  },
  {
    id: 'soc-4',
    platform: 'youtube',
    platformName: 'YouTube',
    url: 'https://youtube.com/@mcucreations',
    enabled: true,
    displayOrder: 4,
  },
];

export const defaultBrandingSettings: BrandingSettings = {
  primaryLogoUrl: '/logo.jpeg',
  footerLogoUrl: '/logo.jpeg',
  faviconUrl: '/favicon.ico',
  lightLogoUrl: '/logo.jpeg',
  darkLogoUrl: '/logo.jpeg',
  brandColors: {
    primaryColor: '#E6A817', // Gold Accent
    secondaryColor: '#0B0F19', // Dark Slate
    accentColor: '#3B82F6', // Blue Accent
  },
};

export const defaultFooterSettings: FooterSettings = {
  footerDescription:
    'MCU (Mentor Crew Units) Creations is a Coimbatore-based startup founded in 2026, focused on event management and digital engagement across social media platforms like Instagram and Facebook.',
  copyrightText: '© {year} MCU (Mentor Crew Units) Creations. All rights reserved. Founded in 2026.',
  ctaEnabled: true,
  ctaText: 'Have an Upcoming Event or Campaign?',
  ctaUrl: '/contact',
  linkGroups: [
    {
      id: 'grp-1',
      groupTitle: 'Company',
      links: [
        { id: 'lnk-1', label: 'About Us', url: '/about', displayOrder: 1, isPublished: true },
        { id: 'lnk-2', label: 'Services', url: '/services', displayOrder: 2, isPublished: true },
        { id: 'lnk-3', label: 'Contact Us', url: '/contact', displayOrder: 3, isPublished: true },
      ],
    },
    {
      id: 'grp-2',
      groupTitle: 'Services',
      links: [
        { id: 'lnk-4', label: 'Event Management', url: '/services', displayOrder: 1, isPublished: true },
        { id: 'lnk-5', label: 'Digital Marketing', url: '/services', displayOrder: 2, isPublished: true },
        { id: 'lnk-6', label: 'Social Media Engagement', url: '/services', displayOrder: 3, isPublished: true },
      ],
    },
    {
      id: 'grp-3',
      groupTitle: 'Get in Touch',
      links: [
        { id: 'lnk-7', label: 'Upcoming Events', url: '/events', displayOrder: 1, isPublished: true },
        { id: 'lnk-8', label: 'Business Enquiries', url: '/contact', displayOrder: 2, isPublished: true },
      ],
    },
  ],
};

export const defaultSEOSettings: GlobalSEOSettings = {
  defaultTitle: 'MCU (Mentor Crew Units) Creations | Event Management & Digital Marketing',
  titleTemplate: '%s | MCU Creations',
  defaultMetaDescription:
    'MCU (Mentor Crew Units) Creations is a Coimbatore-based startup founded in 2026, focused on event management and social media engagement across Instagram and Facebook.',
  defaultKeywords: [
    'MCU Creations',
    'MCU (Mentor Crew Units) Creations',
    'Event Management Coimbatore',
    'Digital Marketing Coimbatore',
    'Social Media Engagement',
    'Instagram Marketing',
    'Facebook Campaigns',
  ],
  defaultOgImage: '/logo.jpeg',
  twitterCardType: 'summary_large_image',
  twitterImage: '/logo.jpeg',
  canonicalBaseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://mcucreations.com',
  robotsAllowAll: true,
  pageRules: [
    {
      path: '/',
      pageName: 'Home',
      metaTitle: 'MCU (Mentor Crew Units) Creations — Event Management & Digital Engagement',
      metaDescription: 'Coimbatore-based startup founded in 2026, focused on event management and digital engagement.',
      ogTitle: 'MCU (Mentor Crew Units) Creations',
      ogDescription: 'Event management and digital engagement startup based in Coimbatore.',
    },
    {
      path: '/events',
      pageName: 'Events Directory',
      metaTitle: 'Events & Expos | MCU Creations',
      metaDescription: 'Explore events and conferences organized and managed by MCU Creations.',
    },
    {
      path: '/about',
      pageName: 'About Us',
      metaTitle: 'About Us | MCU (Mentor Crew Units) Creations',
      metaDescription: 'Learn about MCU (Mentor Crew Units) Creations, a Coimbatore startup founded in 2026.',
    },
    {
      path: '/services',
      pageName: 'Services & Capabilities',
      metaTitle: 'Services & Capabilities | MCU Creations',
      metaDescription: 'Event management, digital marketing, and social media engagement for Instagram and Facebook.',
    },
    {
      path: '/contact',
      pageName: 'Contact Us',
      metaTitle: 'Contact Us | MCU (Mentor Crew Units) Creations',
      metaDescription: 'Connect with MCU Creations in Coimbatore for event management and social media marketing.',
    },
  ],
};

export const defaultAnalyticsSettings: AnalyticsSettings = {
  enabled: false,
  googleAnalyticsId: '',
  googleTagManagerId: '',
  metaPixelId: '',
};

export const defaultMaintenanceSettings: MaintenanceSettings = {
  enabled: false,
  title: 'Website Scheduled Maintenance',
  description: 'We are currently upgrading our event registration systems and server infrastructure. We will be back online shortly.',
  contactEmail: 'mcuevents26@gmail.com',
  contactPhone: '7010377731',
  expectedEndTime: '',
};

export const defaultAnnouncementSettings: AnnouncementSettings = {
  enabled: true,
  badgeText: 'HOT EVENT',
  text: '🔥 Tamil Nadu Franchise & Business Expo 2026 — Early Bird Visitor Passes Now Live!',
  linkUrl: '/events/tamil-nadu-franchise-expo-2026',
  linkText: 'Book Tickets',
};

export const defaultGlobalCTASettings: GlobalCTASettings = {
  enabled: true,
  text: 'Book an Exhibitor Stall',
  url: '/exhibitors',
  subtext: 'Join 150+ national brands at South India’s biggest expo',
};

export const defaultCompleteGlobalSettings: GlobalSiteSettings = {
  general: defaultGeneralSettings,
  contact: defaultContactSettings,
  social: defaultSocialSettings,
  branding: defaultBrandingSettings,
  footer: defaultFooterSettings,
  seo: defaultSEOSettings,
  analytics: defaultAnalyticsSettings,
  maintenance: defaultMaintenanceSettings,
  announcement: defaultAnnouncementSettings,
  globalCta: defaultGlobalCTASettings,
};

// In-Memory Session Fallback
export let sessionGlobalSiteSettings: GlobalSiteSettings = {
  ...defaultCompleteGlobalSettings,
};

/* ==========================================================================
   GLOBAL SETTINGS ACCESSOR
   ========================================================================== */

export async function getGlobalSettings(): Promise<GlobalSiteSettings> {
  return sessionGlobalSiteSettings;
}

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
    'MCU (Mentor Crew Units) Creations is a Coimbatore-based startup founded in 2026, focused exclusively on event management, event planning, venue coordination, and delivering memorable event experiences.',
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
  whatsappDefaultMessage: 'Hello MCU Creations, I would like to enquire about your event management services.',
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
    url: 'https://youtube.com/mcucreations',
    enabled: true,
    displayOrder: 4,
  },
];

export const defaultBrandingSettings: BrandingSettings = {
  primaryLogoUrl: '/logo.png',
  footerLogoUrl: '/logo.png',
  faviconUrl: '/favicon.svg',
  lightLogoUrl: '/logo.png',
  darkLogoUrl: '/logo.png',
  brandColors: {
    primaryColor: '#B88932',
    secondaryColor: '#2B2118',
    accentColor: '#D4B06A',
  },
};

export const defaultFooterSettings: FooterSettings = {
  footerDescription:
    'MCU (Mentor Crew Units) Creations is a Coimbatore-based event-management startup founded in 2026, focused on planning, coordinating, and delivering memorable event experiences.',
  copyrightText: '© 2026 MCU (Mentor Crew Units) Creations. All rights reserved. Founded in 2026.',
  ctaEnabled: true,
  ctaText: 'Planning an Event in Coimbatore?',
  ctaUrl: '/contact',
  linkGroups: [
    {
      id: 'grp-1',
      groupTitle: 'Navigation',
      links: [
        { id: 'lnk-1', label: 'Home', url: '/', displayOrder: 1, isPublished: true },
        { id: 'lnk-2', label: 'About Us', url: '/about', displayOrder: 2, isPublished: true },
        { id: 'lnk-3', label: 'Services', url: '/services', displayOrder: 3, isPublished: true },
      ],
    },
    {
      id: 'grp-2',
      groupTitle: 'Capabilities',
      links: [
        { id: 'lnk-4', label: 'Concept & Planning', url: '/services', displayOrder: 1, isPublished: true },
        { id: 'lnk-5', label: 'Event Coordination', url: '/services', displayOrder: 2, isPublished: true },
        { id: 'lnk-6', label: 'On-Ground Management', url: '/services', displayOrder: 3, isPublished: true },
      ],
    },
    {
      id: 'grp-3',
      groupTitle: 'Get in Touch',
      links: [
        { id: 'lnk-7', label: 'Upcoming Events', url: '/events', displayOrder: 1, isPublished: true },
        { id: 'lnk-8', label: 'Contact Us', url: '/contact', displayOrder: 2, isPublished: true },
      ],
    },
  ],
};

export const defaultSEOSettings: GlobalSEOSettings = {
  defaultTitle: 'MCU (Mentor Crew Units) Creations | Event Management',
  titleTemplate: '%s | MCU Creations',
  defaultMetaDescription:
    'MCU (Mentor Crew Units) Creations is a Coimbatore-based startup founded in 2026, focused on event management, event planning, and on-ground coordination.',
  defaultKeywords: [
    'MCU Creations',
    'MCU (Mentor Crew Units) Creations',
    'Event Management Coimbatore',
    'Event Planning Coimbatore',
    'Corporate Events Tamil Nadu',
    'Expos and Conclaves Coimbatore',
  ],
  defaultOgImage: '/logo.png',
  twitterCardType: 'summary_large_image',
  twitterImage: '/logo.png',
  canonicalBaseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://mcucreations.com',
  robotsAllowAll: true,
  pageRules: [
    {
      path: '/',
      pageName: 'Home',
      metaTitle: 'MCU (Mentor Crew Units) Creations — Event Management',
      metaDescription: 'Coimbatore-based startup founded in 2026, focused on event management and coordination.',
      ogTitle: 'MCU (Mentor Crew Units) Creations',
      ogDescription: 'Event management startup based in Coimbatore.',
    },
    {
      path: '/events',
      pageName: 'Events Directory',
      metaTitle: 'Events & Calendar | MCU Creations',
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
      metaDescription: 'Event management, concept planning, vendor coordination, and on-ground execution.',
    },
    {
      path: '/contact',
      pageName: 'Contact Us',
      metaTitle: 'Contact Us | MCU (Mentor Crew Units) Creations',
      metaDescription: 'Connect with MCU Creations in Coimbatore for event management and planning.',
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

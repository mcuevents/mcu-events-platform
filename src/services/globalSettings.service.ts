import { createClient } from '@/lib/supabase/client';
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
  primaryEmail: 'info@mcucreations.com',
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
  contactEmail: 'info@mcucreations.com',
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
   VALIDATION HELPERS
   ========================================================================== */

export function isValidUrl(urlStr: string): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false;
  const lower = urlStr.trim().toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.includes('<script')
  ) {
    return false;
  }
  if (urlStr.startsWith('/') || urlStr.startsWith('#') || urlStr.startsWith('mailto:') || urlStr.startsWith('tel:')) {
    return true;
  }
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isValidHexColor(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex.trim());
}

export function formatWhatsAppUrl(phoneNumber: string, message?: string): string {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMsg = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanNumber}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
}

export function getProductionUrl(path: string = ''): string {
  const base = sessionGlobalSiteSettings.general.websiteUrl || 'https://mcucreations.com';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base.replace(/\/$/, '')}${cleanPath}`;
}

/* ==========================================================================
   CRUD SERVICES FOR GLOBAL SETTINGS
   ========================================================================== */

export async function getGlobalSettings(): Promise<GlobalSiteSettings> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('site_settings').select('*');

    if (error || !data || data.length === 0) {
      return sessionGlobalSiteSettings;
    }

    const settingsMap: Record<string, any> = {};
    data.forEach((row: any) => {
      settingsMap[row.key] = row.value;
    });

    const merged: GlobalSiteSettings = {
      general: { ...defaultGeneralSettings, ...(settingsMap['general_settings'] || {}) },
      contact: { ...defaultContactSettings, ...(settingsMap['contact_settings'] || {}) },
      social: Array.isArray(settingsMap['social_settings']) ? settingsMap['social_settings'] : defaultSocialSettings,
      branding: { ...defaultBrandingSettings, ...(settingsMap['branding_settings'] || {}) },
      footer: { ...defaultFooterSettings, ...(settingsMap['footer_settings'] || {}) },
      seo: { ...defaultSEOSettings, ...(settingsMap['seo_settings'] || {}) },
      analytics: { ...defaultAnalyticsSettings, ...(settingsMap['analytics_settings'] || {}) },
      maintenance: { ...defaultMaintenanceSettings, ...(settingsMap['maintenance_settings'] || {}) },
      announcement: { ...defaultAnnouncementSettings, ...(settingsMap['announcement_settings'] || {}) },
      globalCta: { ...defaultGlobalCTASettings, ...(settingsMap['cta_settings'] || {}) },
    };

    sessionGlobalSiteSettings = merged;
    return merged;
  } catch {
    return sessionGlobalSiteSettings;
  }
}

async function saveSettingKey(key: string, value: any): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    await supabase.from('site_settings').upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || `Failed to persist ${key}` };
  }
}

export async function updateGeneralSettings(data: GeneralSettings): Promise<{ success: boolean; error?: string }> {
  if (!data.siteName.trim()) return { success: false, error: 'Site name cannot be empty.' };
  if (!isValidUrl(data.websiteUrl)) return { success: false, error: 'Website URL must be a valid HTTPS URL.' };

  sessionGlobalSiteSettings.general = data;
  return saveSettingKey('general_settings', data);
}

export async function updateContactSettings(data: ContactSettings): Promise<{ success: boolean; error?: string }> {
  if (!data.primaryPhone.trim()) return { success: false, error: 'Primary phone is required.' };
  if (!data.primaryEmail.trim() || !data.primaryEmail.includes('@')) {
    return { success: false, error: 'Valid primary contact email is required.' };
  }

  sessionGlobalSiteSettings.contact = data;
  return saveSettingKey('contact_settings', data);
}

export async function updateSocialSettings(data: SocialAccountItem[]): Promise<{ success: boolean; error?: string }> {
  for (const item of data) {
    if (item.enabled && item.url && !isValidUrl(item.url)) {
      return { success: false, error: `Invalid URL format for ${item.platformName}` };
    }
  }

  sessionGlobalSiteSettings.social = data;
  return saveSettingKey('social_settings', data);
}

export async function updateBrandingSettings(data: BrandingSettings): Promise<{ success: boolean; error?: string }> {
  if (!isValidHexColor(data.brandColors.primaryColor)) {
    return { success: false, error: 'Primary brand color must be a valid hex code (e.g. #E6A817).' };
  }

  sessionGlobalSiteSettings.branding = data;
  return saveSettingKey('branding_settings', data);
}

export async function updateFooterSettings(data: FooterSettings): Promise<{ success: boolean; error?: string }> {
  sessionGlobalSiteSettings.footer = data;
  return saveSettingKey('footer_settings', data);
}

export async function updateSEOSettings(data: GlobalSEOSettings): Promise<{ success: boolean; error?: string }> {
  sessionGlobalSiteSettings.seo = data;
  return saveSettingKey('seo_settings', data);
}

export async function updateAnalyticsSettings(data: AnalyticsSettings): Promise<{ success: boolean; error?: string }> {
  sessionGlobalSiteSettings.analytics = data;
  return saveSettingKey('analytics_settings', data);
}

export async function updateMaintenanceSettings(data: MaintenanceSettings): Promise<{ success: boolean; error?: string }> {
  sessionGlobalSiteSettings.maintenance = data;
  return saveSettingKey('maintenance_settings', data);
}

export async function updateAnnouncementSettings(data: AnnouncementSettings): Promise<{ success: boolean; error?: string }> {
  sessionGlobalSiteSettings.announcement = data;
  return saveSettingKey('announcement_settings', data);
}

export async function updateGlobalCTASettings(data: GlobalCTASettings): Promise<{ success: boolean; error?: string }> {
  sessionGlobalSiteSettings.globalCta = data;
  return saveSettingKey('cta_settings', data);
}

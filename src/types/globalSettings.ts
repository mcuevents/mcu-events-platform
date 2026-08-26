import { AdminRole } from './auth';

/* ==========================================================================
   PART A — GENERAL & CONTACT SETTINGS
   ========================================================================== */

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  companyName: string;
  defaultLanguage: string;
  defaultTimezone: string;
  websiteUrl: string;
}

export interface DayBusinessHours {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  label: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface ContactSettings {
  primaryPhone: string;
  secondaryPhone?: string;
  primaryEmail: string;
  secondaryEmail?: string;
  whatsappNumber: string;
  whatsappDefaultMessage?: string;
  businessAddress: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  businessHours: DayBusinessHours[];
}

/* ==========================================================================
   PART B — SOCIAL MEDIA SETTINGS
   ========================================================================== */

export type SocialPlatform =
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'linkedin'
  | 'twitter'
  | 'whatsapp'
  | 'threads'
  | 'other';

export interface SocialAccountItem {
  id: string;
  platform: SocialPlatform;
  platformName: string;
  url: string;
  enabled: boolean;
  displayOrder: number;
}

/* ==========================================================================
   PART C — BRANDING SETTINGS
   ========================================================================== */

export interface BrandColors {
  primaryColor: string; // e.g. #E6A817 (Gold)
  secondaryColor: string; // e.g. #0B0F19 (Dark)
  accentColor: string; // e.g. #3B82F6 (Blue)
}

export interface BrandingSettings {
  primaryLogoUrl: string;
  footerLogoUrl?: string;
  faviconUrl?: string;
  lightLogoUrl?: string;
  darkLogoUrl?: string;
  brandColors: BrandColors;
}

/* ==========================================================================
   PART D — FOOTER CMS SETTINGS
   ========================================================================== */

export interface FooterLinkItem {
  id: string;
  label: string;
  url: string;
  displayOrder: number;
  isPublished: boolean;
}

export interface FooterLinkGroup {
  id: string;
  groupTitle: string;
  links: FooterLinkItem[];
}

export interface FooterSettings {
  footerDescription: string;
  copyrightText: string;
  ctaEnabled: boolean;
  ctaText: string;
  ctaUrl: string;
  linkGroups: FooterLinkGroup[];
}

/* ==========================================================================
   PART E & F — GLOBAL SEO & OPEN GRAPH SETTINGS
   ========================================================================== */

export interface PageSEORule {
  path: string;
  pageName: string;
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  noIndex?: boolean;
  noFollow?: boolean;
}

export interface GlobalSEOSettings {
  defaultTitle: string;
  titleTemplate: string;
  defaultMetaDescription: string;
  defaultKeywords: string[];
  defaultOgImage: string;
  twitterCardType: 'summary' | 'summary_large_image';
  twitterImage?: string;
  canonicalBaseUrl: string;
  robotsAllowAll: boolean;
  pageRules: PageSEORule[];
}

/* ==========================================================================
   PART J — ANALYTICS SETTINGS
   ========================================================================== */

export interface AnalyticsSettings {
  enabled: boolean;
  googleAnalyticsId?: string; // G-XXXXXXXXXX
  googleTagManagerId?: string; // GTM-XXXXXXX
  metaPixelId?: string;
}

/* ==========================================================================
   PART K — SITE-WIDE / MAINTENANCE / ANNOUNCEMENT SETTINGS
   ========================================================================== */

export interface MaintenanceSettings {
  enabled: boolean;
  title: string;
  description: string;
  contactEmail?: string;
  contactPhone?: string;
  expectedEndTime?: string;
}

export interface AnnouncementSettings {
  enabled: boolean;
  text: string;
  linkUrl?: string;
  linkText?: string;
  badgeText?: string;
}

export interface GlobalCTASettings {
  enabled: boolean;
  text: string;
  url: string;
  subtext?: string;
}

/* ==========================================================================
   COMPLETE GLOBAL SITE SETTINGS AGGREGATE
   ========================================================================== */

export interface GlobalSiteSettings {
  general: GeneralSettings;
  contact: ContactSettings;
  social: SocialAccountItem[];
  branding: BrandingSettings;
  footer: FooterSettings;
  seo: GlobalSEOSettings;
  analytics: AnalyticsSettings;
  maintenance: MaintenanceSettings;
  announcement: AnnouncementSettings;
  globalCta: GlobalCTASettings;
}

import { AdminRole } from './auth';
import type { PageSEORule } from './globalSettings';

export interface HeroSectionConfig {
  eyebrowBadge: string;
  title: string;
  highlightWord: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  bannerBackground: 'dark-gradient' | 'cosmic-mesh' | 'gold-accent' | 'cinematic-glow';
}

export interface StatCounterItem {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  iconName?: string;
  displayOrder: number;
}

export interface SpotlightConfig {
  enabled: boolean;
  eventId?: string;
  customBadge?: string;
  customCtaText?: string;
}

export interface SectionsVisibilityConfig {
  hero: boolean;
  featuredEvents: boolean;
  whyChooseUs: boolean;
  services: boolean;
  videos: boolean;
  testimonials: boolean;
  partners: boolean;
  ctaBanner: boolean;
}

export interface HomepageConfig {
  hero: HeroSectionConfig;
  stats: StatCounterItem[];
  spotlight: SpotlightConfig;
  sectionsVisibility: SectionsVisibilityConfig;
}

export interface SocialChannelsConfig {
  instagramUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  whatsappWidgetEnabled: boolean;
  activeCampaignHashtag: string;
}

export interface SiteSEOConfig {
  global: {
    siteName: string;
    titleTemplate: string;
    defaultDescription: string;
    defaultKeywords: string[];
    ogImageUrl?: string;
    twitterHandle?: string;
    googleAnalyticsId?: string;
    googleTagManagerId?: string;
    metaPixelId?: string;
  };
  pages: PageSEORule[];
}

export interface PlatformSettings {
  companyName: string;
  legalName: string;
  contactEmail: string;
  supportPhone: string;
  headquartersAddress: string;
  gstNumber?: string;
  businessHours: string;
  maintenanceMode: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  avatarUrl?: string;
  createdAt?: string;
  lastSignInAt?: string;
}

export interface InviteAdminFormData {
  email: string;
  fullName: string;
  role: AdminRole;
}

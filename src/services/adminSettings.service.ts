import { createClient } from '@/lib/supabase/client';
import {
  HomepageConfig,
  SocialChannelsConfig,
  SiteSEOConfig,
  PlatformSettings,
  AdminUser,
  InviteAdminFormData,
} from '@/types/settings';
import { AdminRole } from '@/types/auth';

// 1. Initial Mock Settings Defaults
export const defaultHomepageConfig: HomepageConfig = {
  hero: {
    eyebrowBadge: '🔥 South India’s #1 Business & Franchise Expos',
    title: 'Transforming Business Summits into',
    highlightWord: 'Unmatched Growth Engines',
    subtitle:
      'We curate, engineer, and promote mega-scale B2B trade exhibitions, franchise conclaves, and high-impact digital marketing funnels across Tamil Nadu.',
    primaryCtaText: 'Explore Upcoming Expos',
    primaryCtaUrl: '/events',
    secondaryCtaText: 'Partner & Sponsor',
    secondaryCtaUrl: '/contact',
    bannerBackground: 'dark-gradient',
  },
  stats: [
    { id: 'st-1', label: 'Verified Footfall', value: '50K+', suffix: 'Delegates', iconName: 'Users', displayOrder: 1 },
    { id: 'st-2', label: 'LOIs Signed', value: '₹120Cr+', suffix: 'Investment', iconName: 'TrendingUp', displayOrder: 2 },
    { id: 'st-3', label: 'Exhibitor Stalls', value: '500+', suffix: 'Brands', iconName: 'Store', displayOrder: 3 },
    { id: 'st-4', label: 'Mega Expos', value: '25+', suffix: 'Conducted', iconName: 'Award', displayOrder: 4 },
  ],
  spotlight: {
    enabled: true,
    eventId: 'evt-1',
    customBadge: 'FLAGSHIP UPCOMING EXPO',
    customCtaText: 'Book VIP Pass Now',
  },
  sectionsVisibility: {
    hero: true,
    featuredEvents: true,
    whyChooseUs: true,
    services: true,
    videos: true,
    testimonials: true,
    partners: true,
    ctaBanner: true,
  },
};

export const defaultSocialConfig: SocialChannelsConfig = {
  instagramUrl: 'https://instagram.com/mcucreations',
  youtubeUrl: 'https://youtube.com/@mcucreations',
  linkedinUrl: 'https://linkedin.com/company/mcucreations',
  facebookUrl: 'https://facebook.com/mcucreations',
  twitterUrl: 'https://x.com/mcucreations',
  whatsappNumber: '+919842188900',
  whatsappDefaultMessage: 'Hi MCU Creations, I would like to enquire about upcoming expos and sponsorship opportunities.',
  whatsappWidgetEnabled: true,
  activeCampaignHashtag: '#TNFranchiseExpo2026',
};

export const defaultSiteSEOConfig: SiteSEOConfig = {
  global: {
    siteName: 'MCU Creations',
    titleTemplate: '%s | MCU Creations - Premier Event Management & Expos',
    defaultDescription:
      'MCU Creations delivers premier B2B trade expos, franchise summits, turnkey event management, and omnichannel digital marketing solutions across South India.',
    defaultKeywords: [
      'Event Management Coimbatore',
      'Tamil Nadu Franchise Expo',
      'B2B Trade Shows India',
      'Corporate Event Organizers',
      'Digital Marketing Agency',
      'Stall Fabrication CODISSIA',
    ],
    ogImageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    twitterHandle: '@mcucreations',
    googleAnalyticsId: 'G-MCU9876543',
    googleTagManagerId: 'GTM-MCU2026',
    metaPixelId: '1092837465928172',
  },
  pages: [
    {
      path: '/',
      pageName: 'Home',
      metaTitle: 'MCU Creations | Premier Event Management, B2B Expos & Marketing',
      metaDescription: 'South India’s leading B2B franchise expo organizer, corporate event managers, and full-funnel digital marketing powerhouse.',
      keywords: ['Expos in Tamil Nadu', 'Franchise Expo Coimbatore', 'Event Organizers Chennai'],
    },
    {
      path: '/events',
      pageName: 'Events & Expos Directory',
      metaTitle: 'Upcoming & Past Business Expos | MCU Creations',
      metaDescription: 'Browse upcoming trade shows, franchise summits, technology conclaves, and secure your delegate visitor passes online.',
      keywords: ['Buy Expo Tickets', 'Coimbatore Events', 'Trade Fairs 2026'],
    },
    {
      path: '/services',
      pageName: 'Services & Verticals',
      metaTitle: 'Turnkey Event Execution & Digital Growth Services | MCU Creations',
      metaDescription: 'Discover our core capabilities: mega stage fabrication, high-throughput ticketing, viral reel production, and sponsor acquisition.',
      keywords: ['Stall Design', 'Line Array Sound Systems', 'Expo Video Production'],
    },
    {
      path: '/gallery',
      pageName: 'Photo Gallery',
      metaTitle: 'Photo Showcase & Expo Moments | MCU Creations',
      metaDescription: 'Explore high-resolution event photography from past inaugural ceremonies, exhibitor pavilions, VIP networking, and gala awards.',
    },
    {
      path: '/blog',
      pageName: 'Insights & Articles',
      metaTitle: 'B2B Marketing & Franchise Insights | MCU Creations Blog',
      metaDescription: 'Actionable trade show strategies, exhibitor lead generation guides, and regional industrial growth retrospectives.',
    },
    {
      path: '/contact',
      pageName: 'Contact & Enquiries',
      metaTitle: 'Get in Touch | Book Stalls & Event Enquiries | MCU Creations',
      metaDescription: 'Connect with our operations command desk in Coimbatore and Chennai for sponsorship, exhibitor stalls, or event partnerships.',
    },
  ],
};

export const defaultPlatformSettings: PlatformSettings = {
  companyName: 'MCU (Mentor Crew Units) Creations',
  legalName: 'MCU (Mentor Crew Units) Creations',
  contactEmail: 'info@mcucreations.com',
  supportPhone: '7010377731 / 700667500',
  headquartersAddress: '3rd Floor, Masakalipalayam, Ram Lakshman Nagar, Uppilipalayam, Coimbatore, Tamil Nadu - 641004, India',
  gstNumber: '33AAACM0192Q1ZV',
  businessHours: 'Monday – Saturday: 09:00 AM – 07:00 PM IST',
  maintenanceMode: false,
};

export const mockAdminUsers: AdminUser[] = [
  {
    id: 'usr-1',
    email: 'ragul@mcucreations.com',
    fullName: 'M. Ragul',
    role: 'super_admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-08-01T00:00:00Z',
    lastSignInAt: '2026-08-20T08:30:00Z',
  },
  {
    id: 'usr-2',
    email: 'karthik@mcucreations.com',
    fullName: 'Karthik Raja',
    role: 'event_manager',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-08-05T00:00:00Z',
    lastSignInAt: '2026-08-19T17:15:00Z',
  },
  {
    id: 'usr-3',
    email: 'ananya@mcucreations.com',
    fullName: 'Ananya Ramesh',
    role: 'content_manager',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-08-08T00:00:00Z',
    lastSignInAt: '2026-08-19T14:40:00Z',
  },
];

// Session in-memory cache
export let sessionHomepageConfig: HomepageConfig = { ...defaultHomepageConfig };
export let sessionSocialConfig: SocialChannelsConfig = { ...defaultSocialConfig };
export let sessionSiteSEOConfig: SiteSEOConfig = { ...defaultSiteSEOConfig };
export let sessionPlatformSettings: PlatformSettings = { ...defaultPlatformSettings };
export let sessionAdminUsers: AdminUser[] = [...mockAdminUsers];

/* ==========================================================================
   HOMEPAGE CMS SERVICE
   ========================================================================== */

export async function getHomepageConfig(): Promise<HomepageConfig> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'homepage_config').single();
    if (error || !data?.value) return sessionHomepageConfig;
    return data.value as HomepageConfig;
  } catch {
    return sessionHomepageConfig;
  }
}

export async function updateHomepageConfig(
  data: Partial<HomepageConfig>
): Promise<{ success: boolean; config?: HomepageConfig; error?: string }> {
  try {
    sessionHomepageConfig = { ...sessionHomepageConfig, ...data };
    const supabase = createClient();
    await supabase.from('site_settings').upsert({
      key: 'homepage_config',
      value: sessionHomepageConfig,
      updated_at: new Date().toISOString(),
    });
    return { success: true, config: sessionHomepageConfig };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save homepage settings.' };
  }
}

/* ==========================================================================
   SOCIAL CHANNELS CMS SERVICE
   ========================================================================== */

export async function getSocialChannelsConfig(): Promise<SocialChannelsConfig> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'social_config').single();
    if (error || !data?.value) return sessionSocialConfig;
    return data.value as SocialChannelsConfig;
  } catch {
    return sessionSocialConfig;
  }
}

export async function updateSocialChannelsConfig(
  data: Partial<SocialChannelsConfig>
): Promise<{ success: boolean; config?: SocialChannelsConfig; error?: string }> {
  try {
    sessionSocialConfig = { ...sessionSocialConfig, ...data };
    const supabase = createClient();
    await supabase.from('site_settings').upsert({
      key: 'social_config',
      value: sessionSocialConfig,
      updated_at: new Date().toISOString(),
    });
    return { success: true, config: sessionSocialConfig };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save social channel settings.' };
  }
}

/* ==========================================================================
   SEO & METADATA CMS SERVICE
   ========================================================================== */

export async function getSiteSEOConfig(): Promise<SiteSEOConfig> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'seo_config').single();
    if (error || !data?.value) return sessionSiteSEOConfig;
    return data.value as SiteSEOConfig;
  } catch {
    return sessionSiteSEOConfig;
  }
}

export async function updateSiteSEOConfig(
  data: Partial<SiteSEOConfig>
): Promise<{ success: boolean; config?: SiteSEOConfig; error?: string }> {
  try {
    sessionSiteSEOConfig = { ...sessionSiteSEOConfig, ...data };
    const supabase = createClient();
    await supabase.from('site_settings').upsert({
      key: 'seo_config',
      value: sessionSiteSEOConfig,
      updated_at: new Date().toISOString(),
    });
    return { success: true, config: sessionSiteSEOConfig };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save SEO metadata settings.' };
  }
}

/* ==========================================================================
   PLATFORM & SECURITY SETTINGS SERVICE
   ========================================================================== */

export async function getPlatformSettings(): Promise<PlatformSettings> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'platform_settings').single();
    if (error || !data?.value) return sessionPlatformSettings;
    return data.value as PlatformSettings;
  } catch {
    return sessionPlatformSettings;
  }
}

export async function updatePlatformSettings(
  data: Partial<PlatformSettings>
): Promise<{ success: boolean; settings?: PlatformSettings; error?: string }> {
  try {
    sessionPlatformSettings = { ...sessionPlatformSettings, ...data };
    const supabase = createClient();
    await supabase.from('site_settings').upsert({
      key: 'platform_settings',
      value: sessionPlatformSettings,
      updated_at: new Date().toISOString(),
    });
    return { success: true, settings: sessionPlatformSettings };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to save platform settings.' };
  }
}

/* ==========================================================================
   ADMIN USER ACCOUNTS SERVICE
   ========================================================================== */

export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: true });
    if (error || !data || data.length === 0) {
      return sessionAdminUsers;
    }
    return data.map((d: any) => ({
      id: d.id,
      email: d.email,
      fullName: d.full_name || d.email.split('@')[0],
      role: d.role,
      avatarUrl: d.avatar_url,
      createdAt: d.created_at,
    }));
  } catch {
    return sessionAdminUsers;
  }
}

export async function inviteAdminUser(
  data: InviteAdminFormData
): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
  try {
    const newUser: AdminUser = {
      id: `usr-${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      createdAt: new Date().toISOString(),
      lastSignInAt: 'Invitation Pending',
    };

    sessionAdminUsers.push(newUser);
    return { success: true, user: newUser };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to invite administrator.' };
  }
}

export async function updateAdminUserRole(
  userId: string,
  role: AdminRole
): Promise<{ success: boolean; error?: string }> {
  try {
    const idx = sessionAdminUsers.findIndex((u) => u.id === userId);
    if (idx !== -1) {
      sessionAdminUsers[idx].role = role;
    }
    const supabase = createClient();
    await supabase.from('profiles').update({ role }).eq('id', userId);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update user role.' };
  }
}

export async function removeAdminUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    sessionAdminUsers = sessionAdminUsers.filter((u) => u.id !== userId);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to remove user account.' };
  }
}

export async function getStorageBucketsStatus(): Promise<
  { name: string; isPublic: boolean; fileCount: number; sizeFormatted: string; status: 'healthy' | 'warning' }[]
> {
  return [
    { name: 'media-gallery', isPublic: true, fileCount: 142, sizeFormatted: '48.6 MB', status: 'healthy' },
    { name: 'event-banners', isPublic: true, fileCount: 38, sizeFormatted: '22.4 MB', status: 'healthy' },
    { name: 'sponsor-logos', isPublic: true, fileCount: 86, sizeFormatted: '14.1 MB', status: 'healthy' },
    { name: 'team-avatars', isPublic: true, fileCount: 24, sizeFormatted: '6.8 MB', status: 'healthy' },
    { name: 'contracts-invoices', isPublic: false, fileCount: 520, sizeFormatted: '112.5 MB', status: 'healthy' },
  ];
}

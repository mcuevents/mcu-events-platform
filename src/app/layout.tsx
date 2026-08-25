import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans, Cinzel, Caveat } from 'next/font/google';
import { siteConfig } from '@/config/site';
import { OrganizationJsonLd } from '@/components/shared/JsonLd';
import { AnalyticsScripts } from '@/components/shared/AnalyticsScripts';
import './globals.css';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Event Management`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: [
    'MCU Creations',
    'MCU (Mentor Crew Units) Creations',
    'Event Management Coimbatore',
    'Event Planning Coimbatore',
    'Corporate Events Tamil Nadu',
    'Expos and Conclaves Coimbatore',
    'Event Management Startup 2026',
  ],
  authors: [{ name: 'MCU Creations Team', url: siteConfig.url }],
  creator: 'MCU (Mentor Crew Units) Creations',
  publisher: 'MCU (Mentor Crew Units) Creations',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteConfig.getCanonicalUrl('/'),
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.shortName,
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: `${siteConfig.url}/logo.jpeg`,
        width: 1200,
        height: 630,
        alt: 'MCU Creations Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/logo.jpeg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${playfair.variable} ${cinzel.variable} ${caveat.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[#FCFBF8] text-[#2B2118] font-sans antialiased selection:bg-[#B88932] selection:text-white">
        <OrganizationJsonLd />
        <AnalyticsScripts />
        {children}
      </body>
    </html>
  );
}

import React from 'react';
import { siteConfig } from '@/config/site';

export interface JsonLdProps {
  data: Record<string, any>;
}

export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export const OrganizationJsonLd: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MCU (Mentor Crew Units) Creations',
    alternateName: 'MCU Creations',
    foundingDate: '2026',
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.jpeg`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-7010377731',
        contactType: 'customer service',
        email: siteConfig.contacts.email,
        areaServed: 'IN',
        availableLanguage: ['en', 'ta'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+91-700667500',
        contactType: 'customer service',
        email: siteConfig.contacts.email,
        areaServed: 'IN',
        availableLanguage: ['en', 'ta'],
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '3rd Floor, Masakalipalayam, Ram Lakshman Nagar, Uppilipalayam',
      addressLocality: 'Coimbatore',
      addressRegion: 'Tamil Nadu',
      postalCode: '641004',
      addressCountry: 'IN',
    },
    sameAs: [
      siteConfig.contacts.instagram,
      siteConfig.contacts.facebook,
      siteConfig.contacts.linkedin,
      siteConfig.contacts.youtube,
    ],
  };

  return <JsonLd data={schema} />;
};

export const LocalBusinessJsonLd: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'MCU (Mentor Crew Units) Creations',
    alternateName: 'MCU Creations',
    foundingDate: '2026',
    image: `${siteConfig.url}/logo.jpeg`,
    url: siteConfig.url,
    telephone: '+91-7010377731',
    email: siteConfig.contacts.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '3rd Floor, Masakalipalayam, Ram Lakshman Nagar, Uppilipalayam',
      addressLocality: 'Coimbatore',
      addressRegion: 'Tamil Nadu',
      postalCode: '641004',
      addressCountry: 'IN',
    },
  };

  return <JsonLd data={schema} />;
};

export interface EventJsonLdProps {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  locationName: string;
  locationAddress: string;
  city: string;
  imageUrl?: string;
  url: string;
}

export const EventJsonLd: React.FC<EventJsonLdProps> = ({
  name,
  description,
  startDate,
  endDate,
  locationName,
  locationAddress,
  city,
  imageUrl,
  url,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: locationName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: locationAddress,
        addressLocality: city,
        addressRegion: 'Tamil Nadu',
        addressCountry: 'IN',
      },
    },
    image: imageUrl ? [imageUrl] : undefined,
    url,
    organizer: {
      '@type': 'Organization',
      name: 'MCU (Mentor Crew Units) Creations',
      url: siteConfig.url,
    },
  };

  return <JsonLd data={schema} />;
};

export interface ArticleJsonLdProps {
  headline: string;
  description: string;
  imageUrl?: string;
  authorName: string;
  publishedDate: string;
  modifiedDate?: string;
  url: string;
}

export const ArticleJsonLd: React.FC<ArticleJsonLdProps> = ({
  headline,
  description,
  imageUrl,
  authorName,
  publishedDate,
  modifiedDate,
  url,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image: imageUrl ? [imageUrl] : undefined,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'MCU (Mentor Crew Units) Creations',
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.jpeg`,
      },
    },
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return <JsonLd data={schema} />;
};

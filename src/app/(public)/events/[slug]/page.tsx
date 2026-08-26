import React from 'react';
import { notFound } from 'next/navigation';
import { Container, Section, Card, Button } from '@/components/ui';
import { getEventBySlug } from '@/services/events.service';
import { formatDate } from '@/lib/utils';
import {
  Calendar,
  MapPin,
  Building,
  Sparkles,
  ArrowLeft,
  Clock,
  CheckCircle2,
  ExternalLink,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { EventDetailClient } from '@/components/events/EventDetailClient';
import { EventSpeakers } from '@/components/events/EventSpeakers';
import { EventSponsors } from '@/components/events/EventSponsors';
import { EventExhibitors } from '@/components/events/EventExhibitors';
import { EventFaqs } from '@/components/events/EventFaqs';
import { EventGallery } from '@/components/events/EventGallery';
import { EventShareBar } from '@/components/events/EventShareBar';
import { PartnerCard } from '@/components/shared/PartnerCard';

interface EventDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  if (!event || event.status === 'draft') {
    return {
      title: 'Event Not Found | MCU Creations',
      description: 'The requested event could not be found.',
    };
  }

  return {
    title: `${event.title} | MCU Creations`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      type: 'article',
      url: siteConfig.getCanonicalUrl(`/events/${params.slug}`),
      images: event.bannerImage ? [{ url: event.bannerImage, width: 1200, height: 630, alt: event.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.description,
      images: event.bannerImage ? [event.bannerImage] : [],
    },
    alternates: {
      canonical: siteConfig.getCanonicalUrl(`/events/${params.slug}`),
    },
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const event = await getEventBySlug(params.slug);

  if (!event || event.status === 'draft') {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus:
      event.status === 'cancelled'
        ? 'https://schema.org/EventCancelled'
        : event.status === 'postponed'
        ? 'https://schema.org/EventPostponed'
        : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.locationName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.address,
        addressLocality: event.city,
        addressRegion: event.state || 'Tamil Nadu',
        addressCountry: event.country || 'India',
      },
    },
    image: [event.bannerImage],
    organizer: {
      '@type': 'Organization',
      name: event.organizerName,
      url: siteConfig.url,
    },
    offers: event.ticketTypes?.map((t) => ({
      '@type': 'Offer',
      name: t.name,
      price: t.price,
      priceCurrency: t.currency || 'INR',
      availability: event.registrationOpen
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
      url: siteConfig.getCanonicalUrl(`/events/${params.slug}`),
    })),
  };

  const getStatusBadge = () => {
    switch (event.status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/30 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B8860B]" />
            <span>Upcoming Event</span>
          </span>
        );
      case 'ongoing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 animate-pulse shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Live Happening Now</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F5EFEB] text-[#7A6D62] border border-[#E0D4C5]">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#8C7D73]" />
            <span>Event Concluded</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#FAF8F5]">
      {/* Inject JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Hero Showcase Banner */}
      <div className="relative bg-gradient-to-b from-[#FAF8F5] via-[#F8F4EE] to-[#FAF8F5] border-b border-[#EAE0D5] overflow-hidden py-14 lg:py-20">
        <Container className="relative z-10">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#665A52] hover:text-[#B8860B] mb-6 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Events</span>
          </Link>

          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#B8860B]/10 text-[#B8860B] border border-[#B8860B]/20 font-mono">
                {event.category}
              </span>
              {getStatusBadge()}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#2D231E] leading-tight">
              {event.title}
            </h1>

            <p className="text-base sm:text-lg text-[#665A52] leading-relaxed max-w-3xl">
              {event.description}
            </p>

            {/* Quick Hero Metadata Chips */}
            <div className="pt-4 flex flex-wrap gap-3 text-xs sm:text-sm text-[#5A4E45]">
              <div className="flex items-center gap-2 bg-white border border-[#EAE0D5] px-4 py-2.5 rounded-full shadow-sm">
                <Calendar className="h-4 w-4 text-[#B8860B] shrink-0" />
                <span>
                  {formatDate(event.startDate)} – {formatDate(event.endDate)}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-[#EAE0D5] px-4 py-2.5 rounded-full shadow-sm">
                <MapPin className="h-4 w-4 text-[#B8860B] shrink-0" />
                <span>
                  {event.locationName}, {event.city}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-[#EAE0D5] px-4 py-2.5 rounded-full shadow-sm">
                <Building className="h-4 w-4 text-[#B8860B] shrink-0" />
                <span>Organized by {event.organizerName}</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 2. Main Content Grid */}
      <Section spacing="md">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-10">
              {/* Event Information Key Panel */}
              <Card className="p-6 sm:p-8 border-[#EAE0D5] bg-white shadow-sm">
                <h2 className="font-serif text-lg font-bold text-[#2D231E] mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#B8860B]" />
                  <span>Event Overview & Schedule Specs</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE0D5]">
                    <span className="text-[#8C7D73] block font-medium">Dates & Times</span>
                    <p className="font-bold text-[#2D231E]">
                      {formatDate(event.startDate)} to {formatDate(event.endDate)}
                    </p>
                    <p className="text-[11px] text-[#70645B]">09:30 AM – 06:30 PM Daily</p>
                  </div>

                  <div className="space-y-1 bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE0D5]">
                    <span className="text-[#8C7D73] block font-medium">Official Venue</span>
                    <p className="font-bold text-[#2D231E]">{event.locationName}</p>
                    <p className="text-[11px] text-[#70645B] truncate">
                      {event.address}, {event.city}, {event.state || 'Tamil Nadu'}
                    </p>
                  </div>

                  <div className="space-y-1 bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE0D5]">
                    <span className="text-[#8C7D73] block font-medium">Organizer Contact</span>
                    <p className="font-bold text-[#2D231E]">{event.organizerName}</p>
                    <p className="text-[11px] text-[#70645B]">{event.organizerContact}</p>
                  </div>

                  <div className="space-y-1 bg-[#FAF8F5] p-4 rounded-xl border border-[#EAE0D5]">
                    <span className="text-[#8C7D73] block font-medium">Registration Status</span>
                    <p className="font-bold text-[#B8860B]">
                      {event.registrationOpen && event.status === 'upcoming'
                        ? 'Online Booking Active'
                        : 'Registration Concluded'}
                    </p>
                    <p className="text-[11px] text-[#70645B]">Badge Generation at Entrance</p>
                  </div>
                </div>

                {event.googleMapsUrl && (
                  <div className="pt-4 mt-4 border-t border-[#F2ECE4] flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs text-[#665A52] font-medium">Find directions to the venue:</span>
                    <a
                      href={event.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8860B] hover:text-[#8E671E] underline underline-offset-4"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      <span>View on Google Maps</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </Card>

              {/* About the Event */}
              <Card className="p-6 sm:p-8 border-[#EAE0D5] bg-white shadow-sm">
                <h2 className="font-serif text-xl font-bold text-[#2D231E] mb-4">About the Event</h2>
                {event.content ? (
                  <div
                    className="prose max-w-none text-[#5C4F45] leading-relaxed space-y-4 text-sm sm:text-base [&>h3]:text-[#2D231E] [&>h3]:font-serif [&>h3]:font-bold [&>h3]:text-lg [&>h4]:text-[#B8860B] [&>h4]:font-bold [&>h4]:text-sm [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5"
                    dangerouslySetInnerHTML={{ __html: event.content }}
                  />
                ) : (
                  <p className="text-sm text-[#5C4F45] leading-relaxed">{event.description}</p>
                )}
              </Card>

              {/* Event Highlights */}
              {event.highlights && event.highlights.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-[#2D231E] flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#B8860B]" />
                    <span>Key Highlights & Attractions</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {event.highlights.map((h, idx) => (
                      <Card key={idx} className="p-5 border-[#EAE0D5] bg-white hover:border-[#C59B27]/40 transition-colors shadow-sm">
                        <h4 className="font-serif text-sm font-bold text-[#2D231E]">{h.title}</h4>
                        <p className="text-xs text-[#665A52] mt-1 leading-relaxed">{h.description}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Speakers Section */}
              <EventSpeakers speakers={event.speakers} />

              {/* Exhibitors Directory */}
              <EventExhibitors exhibitors={event.exhibitors} />

              {/* Sponsors Showcase */}
              <EventSponsors sponsors={event.sponsors} />

              {/* Associated Institutional Partners */}
              {event.partners && event.partners.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-serif text-xl font-bold text-[#2D231E] flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[#B8860B]" />
                    <span>Institutional & Venue Partners</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {event.partners.map((partner) => (
                      <PartnerCard key={partner.id} partner={partner} />
                    ))}
                  </div>
                </div>
              )}

              {/* Event FAQs Accordion */}
              <EventFaqs faqs={event.faqs} />

              {/* Photo Gallery */}
              <EventGallery images={event.galleryImages} eventTitle={event.title} />

              {/* Social Sharing Bar */}
              <EventShareBar title={event.title} slug={event.slug} />
            </div>

            {/* Right Column: Pass Reservation / Registration */}
            <div>
              <div className="sticky top-24 space-y-6">
                <EventDetailClient event={event} />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Event } from '@/types/events';
import { getAdminEventById, publishEvent } from '@/services/adminEvents.service';
import { Container, Section, Card, Button, Badge } from '@/components/ui';
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
  Phone,
  Mail,
  HelpCircle,
  Globe,
  Lock,
  Edit3,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { EventDetailClient } from '@/components/events/EventDetailClient';
import { EventSpeakers } from '@/components/events/EventSpeakers';
import { EventSponsors } from '@/components/events/EventSponsors';
import { EventExhibitors } from '@/components/events/EventExhibitors';
import { EventFaqs } from '@/components/events/EventFaqs';
import { EventGallery } from '@/components/events/EventGallery';
import { EventShareBar } from '@/components/events/EventShareBar';
import { PartnerCard } from '@/components/shared/PartnerCard';

interface EventPreviewPageProps {
  params: { id: string };
}

export default function EventPreviewPage({ params }: EventPreviewPageProps) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const res = await getAdminEventById(params.id);
      setEvent(res);
      setIsLoading(false);
    }
    load();
  }, [params.id]);

  const handlePublishNow = async () => {
    if (!event) return;
    setIsPublishing(true);
    const res = await publishEvent(event.id);
    setIsPublishing(false);
    if (res.success) {
      setPublishFeedback('Event is now published live!');
      setTimeout(() => {
        router.push(`/events/${event.slug}`);
      }, 1000);
    } else {
      setPublishFeedback(res.error || 'Failed to publish.');
    }
  };

  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-3 text-dark-400">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
        <p className="text-xs">Loading authentic draft preview...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-32 max-w-md mx-auto text-center space-y-4">
        <h2 className="text-lg font-bold text-white">Event Not Found</h2>
        <Link href="/admin/events">
          <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Event Portfolio
          </Button>
        </Link>
      </div>
    );
  }

  const isPublished = event.isPublished || (event.status !== 'draft' && event.isPublished !== false);

  return (
    <div className="min-h-screen bg-dark-950 text-white pb-20">
      {/* 1. Authenticated Admin Draft Preview Banner */}
      <div className="sticky top-0 z-50 bg-amber-500/15 backdrop-blur-md border-b border-amber-500/30 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-amber-200 shadow-xl">
        <div className="flex items-center gap-2 font-medium">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            <strong>Authenticated Admin Preview Mode:</strong> This page shows the exact live layout for draft &quot;{event.title}&quot;.
          </span>
          <Badge variant={isPublished ? 'green' : 'amber'} size="sm">
            {isPublished ? 'Live on Site' : 'Draft Only'}
          </Badge>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/admin/events/${event.id}/edit`}>
            <Button variant="outline" size="sm" leftIcon={<Edit3 className="h-3.5 w-3.5" />}>
              Edit in CMS
            </Button>
          </Link>

          {!isPublished && (
            <Button
              variant="primary"
              size="sm"
              onClick={handlePublishNow}
              isLoading={isPublishing}
              leftIcon={<Globe className="h-3.5 w-3.5" />}
            >
              Publish Live Now
            </Button>
          )}

          <Link href="/admin/events">
            <Button variant="ghost" size="sm">
              Exit Preview
            </Button>
          </Link>
        </div>
      </div>

      {publishFeedback && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/30 py-2 px-4 text-center text-xs text-emerald-300 font-bold">
          {publishFeedback}
        </div>
      )}

      {/* 2. Hero Section */}
      <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-dark-800">
        <div className="absolute inset-0 z-0 opacity-25">
          <Image
            src={event.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80'}
            alt={event.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/60 to-transparent" />
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="gold" size="md">
                {event.category.toUpperCase()}
              </Badge>
              <Badge variant={event.status === 'upcoming' ? 'green' : 'amber'} size="md">
                {event.status === 'upcoming' ? 'UPCOMING EXPO' : event.status.toUpperCase()}
              </Badge>
              {event.isFeatured && (
                <Badge variant="gold" size="md">
                  ★ FEATURED EXPO
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {event.title}
            </h1>

            <p className="text-base sm:text-lg text-dark-300 max-w-3xl leading-relaxed">
              {event.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-dark-800/80 text-sm">
              <div className="flex items-center gap-3 text-dark-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dark-900/80 border border-dark-800 text-brand-400 shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-dark-400 uppercase font-semibold">Event Dates</div>
                  <div className="font-bold text-white">{formatDate(event.startDate)} - {formatDate(event.endDate)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-dark-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dark-900/80 border border-dark-800 text-brand-400 shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-dark-400 uppercase font-semibold">Timings</div>
                  <div className="font-bold text-white">{event.startTime || '09:30 AM'} - {event.endTime || '06:30 PM'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-dark-300">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dark-900/80 border border-dark-800 text-brand-400 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-dark-400 uppercase font-semibold">Venue Location</div>
                  <div className="font-bold text-white truncate max-w-[200px]">{event.locationName}, {event.city}</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* 3. Event Detail Body Content */}
      <Section className="py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Main Content Column (8 cols) */}
            <div className="lg:col-span-8 space-y-12">
              {/* Event Overview */}
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                  <Sparkles className="h-6 w-6 text-brand-400" />
                  <span>Event Overview & Synopsis</span>
                </h2>
                <div className="prose prose-invert max-w-none text-dark-300 space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>{event.content || event.description}</p>
                </div>
              </div>

              {/* Event Highlights */}
              {event.highlights && event.highlights.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                    <Sparkles className="h-6 w-6 text-brand-400" />
                    <span>Key Expo Highlights</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {event.highlights.map((hl, i) => (
                      <Card key={i} className="p-5 border-dark-800 bg-dark-900/50 space-y-2">
                        <div className="flex items-center gap-2 text-brand-400 font-bold text-base">
                          <CheckCircle2 className="h-5 w-5 shrink-0" />
                          <span>{hl.title}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-dark-400 leading-relaxed">
                          {hl.description}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Speakers */}
              {event.speakers && event.speakers.length > 0 && (
                <EventSpeakers speakers={event.speakers} />
              )}

              {/* Exhibitors */}
              {event.exhibitors && event.exhibitors.length > 0 && (
                <EventExhibitors exhibitors={event.exhibitors} />
              )}

              {/* Sponsors */}
              {event.sponsors && event.sponsors.length > 0 && (
                <EventSponsors sponsors={event.sponsors} />
              )}

              {/* Partners */}
              {event.partners && event.partners.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                    <Building className="h-6 w-6 text-brand-400" />
                    <span>Alliance Partners</span>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {event.partners.map((partner) => (
                      <PartnerCard key={partner.id} partner={partner} />
                    ))}
                  </div>
                </div>
              )}

              {/* Photo Gallery */}
              {event.galleryImages && event.galleryImages.length > 0 && (
                <EventGallery images={event.galleryImages} eventTitle={event.title} />
              )}

              {/* FAQs */}
              {event.faqs && event.faqs.length > 0 && (
                <EventFaqs faqs={event.faqs} />
              )}
            </div>

            {/* Sticky Sidebar Registration / Ticket Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <EventDetailClient event={event} />

              {/* Spatial Location & Address Card */}
              <Card className="p-6 border-dark-800 bg-dark-900/60 space-y-4">
                <div className="flex items-center gap-2.5 text-white font-bold text-base">
                  <MapPin className="h-5 w-5 text-brand-400" />
                  <span>Venue Address</span>
                </div>
                <div className="text-xs sm:text-sm text-dark-300 space-y-1">
                  <div className="font-semibold text-white">{event.locationName}</div>
                  <div>{event.address}</div>
                  <div>{event.city}, {event.state || 'Tamil Nadu'} - {event.pincode || '641014'}</div>
                  <div className="text-dark-400">{event.country || 'India'}</div>
                </div>

                {event.googleMapsUrl && (
                  <a
                    href={event.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300 pt-2"
                  >
                    <span>Get Google Maps Directions</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

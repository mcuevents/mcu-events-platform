'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Select } from '@/components/ui';
import { Card } from '@/components/ui';
import { AdminEventFormData, Event, EventStatus } from '@/types/events';
import { eventSchema } from '@/lib/validations';
import { EventBasicInfoSection } from './EventBasicInfoSection';
import { EventDateTimeSection } from './EventDateTimeSection';
import { EventLocationSection } from './EventLocationSection';
import { EventMediaSection } from './EventMediaSection';
import { EventPassesSection } from './EventPassesSection';
import { EventHighlightsSection } from './EventHighlightsSection';
import { EventSpeakersSection } from './EventSpeakersSection';
import { EventAlliancesSection } from './EventAlliancesSection';
import { EventFaqsSection } from './EventFaqsSection';
import {
  Save,
  Globe,
  Eye,
  ArrowLeft,
  Star,
  CheckCircle2,
  AlertCircle,
  Ticket,
  MessageSquare,
  Lock,
} from 'lucide-react';

interface EventFormProps {
  initialData?: Event;
  onSubmit: (data: AdminEventFormData, publish: boolean) => Promise<{ success: boolean; error?: string }>;
  isEditing?: boolean;
}

export function EventForm({
  initialData,
  onSubmit,
  isEditing = false,
}: EventFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<AdminEventFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    category: initialData?.category || 'exhibition',
    status: initialData?.status || 'draft',
    startDate: initialData?.startDate || new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    endDate: initialData?.endDate || new Date(Date.now() + 86400000 * 17).toISOString().split('T')[0],
    startTime: initialData?.startTime || '09:30',
    endTime: initialData?.endTime || '18:30',
    locationName: initialData?.locationName || '',
    address: initialData?.address || '',
    city: initialData?.city || 'Coimbatore',
    state: initialData?.state || 'Tamil Nadu',
    country: initialData?.country || 'India',
    pincode: initialData?.pincode || '',
    bannerImage: initialData?.bannerImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80',
    featuredImage: initialData?.featuredImage || '',
    galleryImages: initialData?.galleryImages || [],
    ticketTypes: initialData?.ticketTypes || [
      {
        id: 't-default',
        name: 'General Delegate Pass',
        price: 0,
        currency: 'INR',
        available: 1000,
        description: 'Complimentary full-day access to all exhibition booths & keynote halls.',
      },
    ],
    isFeatured: initialData?.isFeatured || false,
    isPublished: initialData?.isPublished || false,
    isArchived: initialData?.isArchived || false,
    registrationOpen: initialData?.registrationOpen !== false,
    registrationEnabled: initialData?.registrationEnabled !== false,
    registrationStartDate: initialData?.registrationStartDate || '',
    registrationEndDate: initialData?.registrationEndDate || '',
    googleMapsUrl: initialData?.googleMapsUrl || '',
    externalRegistrationUrl: initialData?.externalRegistrationUrl || '',
    organizerName: initialData?.organizerName || 'MCU Creations',
    organizerContact: initialData?.organizerContact || '+91 98421 12345',
    organizerEmail: initialData?.organizerEmail || 'events@mcucreations.in',
    speakers: initialData?.speakers || [],
    exhibitors: initialData?.exhibitors || [],
    sponsors: initialData?.sponsors || [],
    partners: initialData?.partners || [],
    faqs: initialData?.faqs || [],
    highlights: initialData?.highlights || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'media' | 'passes' | 'speakers' | 'alliances' | 'faqs'>('details');

  const handleUpdate = (updates: Partial<AdminEventFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setFormFeedback(null);
  };

  const validateForm = (forPublishing: boolean = false) => {
    setErrors({});
    const result = eventSchema.safeParse(formData);

    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        if (e.path[0]) {
          errMap[e.path[0].toString()] = e.message;
        }
      });
      setErrors(errMap);
      return false;
    }

    if (forPublishing) {
      if (!formData.title || !formData.startDate || !formData.locationName || !formData.bannerImage) {
        setFormFeedback({
          type: 'error',
          message: 'Cannot publish event. Please verify Title, Start Date, Venue Name, and Hero Banner Image are filled.',
        });
        return false;
      }
    }

    return true;
  };

  const handleSaveDraft = async () => {
    if (!validateForm(false)) {
      setFormFeedback({
        type: 'error',
        message: 'Please resolve the highlighted field validation errors before saving.',
      });
      return;
    }

    setIsSubmitting(true);
    setFormFeedback(null);

    const res = await onSubmit({ ...formData, isPublished: false }, false);
    setIsSubmitting(false);

    if (res.success) {
      setFormFeedback({
        type: 'success',
        message: 'Event draft saved successfully.',
      });
    } else {
      setFormFeedback({
        type: 'error',
        message: res.error || 'Failed to save event draft.',
      });
    }
  };

  const handlePublish = async () => {
    if (!validateForm(true)) {
      return;
    }

    setIsSubmitting(true);
    setFormFeedback(null);

    const publishStatus: EventStatus = formData.status === 'draft' ? 'upcoming' : formData.status;
    const res = await onSubmit({ ...formData, isPublished: true, status: publishStatus }, true);
    setIsSubmitting(false);

    if (res.success) {
      setFormFeedback({
        type: 'success',
        message: 'Event published successfully and is now live on the public website.',
      });
    } else {
      setFormFeedback({
        type: 'error',
        message: res.error || 'Failed to publish event.',
      });
    }
  };

  const isPublished = formData.isPublished || (formData.status !== 'draft' && formData.isPublished !== false);

  return (
    <div className="space-y-6">
      {/* Top Sticky Action Bar */}
      <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3.5 bg-dark-950/90 backdrop-blur-md border-b border-dark-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/admin/events">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Back to Events">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white truncate">
                {formData.title || 'New Event Draft'}
              </h1>
              <Badge variant={isPublished ? 'green' : 'amber'} size="sm">
                {isPublished ? 'Live on Site' : 'Draft Only'}
              </Badge>
            </div>
            <p className="text-[11px] text-dark-400 truncate">
              {isEditing ? `Editing Event: /events/${formData.slug || 'slug'}` : 'Creating new trade expo'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Featured Toggle */}
          <button
            type="button"
            onClick={() => handleUpdate({ isFeatured: !formData.isFeatured })}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              formData.isFeatured
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-dark-900 text-dark-400 border-dark-800 hover:text-white'
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${formData.isFeatured ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">Featured</span>
          </button>

          {/* Status Dropdown */}
          <div className="w-32">
            <Select
              value={formData.status}
              onChange={(e) => handleUpdate({ status: e.target.value as EventStatus })}
              options={[
                { label: 'Upcoming', value: 'upcoming' },
                { label: 'Ongoing', value: 'ongoing' },
                { label: 'Completed', value: 'completed' },
                { label: 'Draft', value: 'draft' },
                { label: 'Postponed', value: 'postponed' },
                { label: 'Cancelled', value: 'cancelled' },
              ]}
            />
          </div>

          {/* Preview Button */}
          {initialData?.id && (
            <Link
              href={isPublished ? `/events/${formData.slug}` : `/admin/events/${initialData.id}/preview`}
              target="_blank"
            >
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Eye className="h-3.5 w-3.5 text-brand-400" />}
              >
                Preview
              </Button>
            </Link>
          )}

          {/* Save Draft */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            isLoading={isSubmitting}
            leftIcon={<Save className="h-3.5 w-3.5" />}
          >
            Save Draft
          </Button>

          {/* Publish Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={handlePublish}
            isLoading={isSubmitting}
            leftIcon={<Globe className="h-3.5 w-3.5" />}
          >
            {isPublished ? 'Update Live' : 'Publish Live'}
          </Button>
        </div>
      </div>

      {/* Overview Statistics Banner (if editing existing event) */}
      {isEditing && initialData && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-dark-900/60 border border-dark-800 text-xs">
          <Link
            href={`/admin/registrations?event=${initialData.id}`}
            className="flex items-center gap-2.5 hover:bg-dark-950/60 p-1.5 rounded-xl transition-colors group"
            title="View filtered delegate manifest"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-105 transition-transform">
              <Ticket className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-dark-400 uppercase font-semibold">Registered Passes</div>
              <div className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                {initialData.registrationCount || 0} Delegates →
              </div>
            </div>
          </Link>

          <Link
            href={`/admin/enquiries?event=${initialData.id}`}
            className="flex items-center gap-2.5 hover:bg-dark-950/60 p-1.5 rounded-xl transition-colors group"
            title="View inbound event leads"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-105 transition-transform">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-dark-400 uppercase font-semibold">Inbound Leads</div>
              <div className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">
                {initialData.enquiryCount || 0} Enquiries →
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-dark-400 uppercase font-semibold">Visibility Status</div>
              <div className="font-bold text-white text-sm">{isPublished ? 'Published Live' : 'Internal Draft'}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <div className="text-[10px] text-dark-400 uppercase font-semibold">Pass Bookings</div>
              <div className="font-bold text-white text-sm">{formData.registrationEnabled !== false ? 'Active' : 'Disabled'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Banner */}
      {formFeedback && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2.5 text-xs ${
            formFeedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/40 border-red-500/30 text-red-300'
          }`}
        >
          {formFeedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
          )}
          <span>{formFeedback.message}</span>
        </div>
      )}

      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-dark-800">
        {[
          { key: 'details', label: '1. Basic Info & Dates' },
          { key: 'media', label: '2. Media & Gallery' },
          { key: 'passes', label: '3. Passes & Tickets' },
          { key: 'speakers', label: `4. Speakers (${formData.speakers?.length || 0})` },
          { key: 'alliances', label: `5. Sponsors & Exhibitors` },
          { key: 'faqs', label: `6. FAQs (${formData.faqs?.length || 0})` },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === t.key
                ? 'bg-brand-500 text-dark-950 shadow'
                : 'text-dark-400 hover:text-white hover:bg-dark-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {activeTab === 'details' && (
          <div className="space-y-6">
            <EventBasicInfoSection formData={formData} onChange={handleUpdate} errors={errors} />
            <EventDateTimeSection formData={formData} onChange={handleUpdate} errors={errors} />
            <EventLocationSection formData={formData} onChange={handleUpdate} errors={errors} />
            <EventHighlightsSection formData={formData} onChange={handleUpdate} />
          </div>
        )}

        {activeTab === 'media' && (
          <EventMediaSection formData={formData} onChange={handleUpdate} errors={errors} />
        )}

        {activeTab === 'passes' && (
          <EventPassesSection formData={formData} onChange={handleUpdate} errors={errors} />
        )}

        {activeTab === 'speakers' && (
          <EventSpeakersSection formData={formData} onChange={handleUpdate} />
        )}

        {activeTab === 'alliances' && (
          <EventAlliancesSection formData={formData} onChange={handleUpdate} />
        )}

        {activeTab === 'faqs' && (
          <EventFaqsSection formData={formData} onChange={handleUpdate} />
        )}
      </div>

      {/* Bottom Sticky Action Footer */}
      <div className="p-4 rounded-2xl bg-dark-900/80 border border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-dark-400 text-center sm:text-left">
          Ready to make this event live? Click <strong>Publish Live</strong> to make it accessible at{' '}
          <span className="text-brand-400 font-mono">/events/{formData.slug || 'slug'}</span>.
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={handleSaveDraft} isLoading={isSubmitting}>
            Save Draft
          </Button>

          <Button variant="primary" size="sm" onClick={handlePublish} isLoading={isSubmitting}>
            {isPublished ? 'Update Live Event' : 'Publish Live Event'}
          </Button>
        </div>
      </div>
    </div>
  );
}

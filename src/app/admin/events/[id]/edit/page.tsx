'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { EventForm } from '@/components/admin/events/EventForm';
import { getAdminEventById, updateEvent } from '@/services/adminEvents.service';
import { AdminEventFormData, Event } from '@/types/events';
import { Button } from '@/components/ui';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';

interface EditEventPageProps {
  params: {
    id: string;
  };
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      setIsLoading(true);
      const res = await getAdminEventById(params.id);
      setEvent(res);
      setIsLoading(false);
    }
    loadEvent();
  }, [params.id]);

  const handleUpdate = async (
    data: AdminEventFormData,
    publish: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    const payload: Partial<AdminEventFormData> = {
      ...data,
      isPublished: publish,
      status: publish && data.status === 'draft' ? 'upcoming' : data.status,
    };

    const res = await updateEvent(params.id, payload);
    if (res.success && res.event) {
      setEvent(res.event);
      return { success: true };
    }

    return { success: false, error: res.error || 'Failed to update event.' };
  };

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3 text-dark-400">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
        <p className="text-xs">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-24 max-w-md mx-auto text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dark-900 border border-dark-800 text-dark-400 mx-auto">
          <Calendar className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-white">Event Not Found</h2>
        <p className="text-xs text-dark-400">
          The requested event record could not be found or may have been deleted.
        </p>
        <Link href="/admin/events">
          <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Event Portfolio
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <EventForm initialData={event} onSubmit={handleUpdate} isEditing={true} />
    </div>
  );
}

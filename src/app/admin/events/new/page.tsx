'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { EventForm } from '@/components/admin/events/EventForm';
import { createEvent } from '@/services/adminEvents.service';
import { AdminEventFormData } from '@/types/events';

export default function NewEventPage() {
  const router = useRouter();

  const handleCreate = async (
    data: AdminEventFormData,
    publish: boolean
  ): Promise<{ success: boolean; error?: string }> => {
    const payload: AdminEventFormData = {
      ...data,
      isPublished: publish,
      status: publish && data.status === 'draft' ? 'upcoming' : data.status,
    };

    const res = await createEvent(payload);
    if (res.success && res.event) {
      setTimeout(() => {
        router.push('/admin/events');
      }, 1200);
      return { success: true };
    }

    return { success: false, error: res.error || 'Failed to create event.' };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <EventForm onSubmit={handleCreate} isEditing={false} />
    </div>
  );
}

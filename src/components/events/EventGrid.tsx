import React from 'react';
import { Event } from '@/types';
import { EventCard } from './EventCard';
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/States';
import { Calendar } from 'lucide-react';

export interface EventGridProps {
  events: Event[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  isLoading = false,
  error = null,
  onRetry,
  emptyTitle = 'No Events Found',
  emptyDescription = 'There are currently no events matching your criteria.',
}) => {
  if (isLoading) {
    return <LoadingState label="Fetching events list..." className="py-16" />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Events"
        description={error}
        onRetry={onRetry}
        className="py-12"
      />
    );
  }

  if (!events || events.length === 0) {
    return (
      <EmptyState
        icon={<Calendar className="h-6 w-6 text-brand-400" />}
        title={emptyTitle}
        description={emptyDescription}
        className="py-12"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </div>
  );
};

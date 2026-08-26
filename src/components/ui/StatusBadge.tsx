import React from 'react';
import { Badge } from './badge';
import { EventStatus } from '@/types/events';
import { EnquiryStatus } from '@/types/enquiries';

export interface StatusBadgeProps {
  status: EventStatus | EnquiryStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  switch (status.toLowerCase()) {
    case 'upcoming':
      return <Badge variant="gold" className={className}>Upcoming</Badge>;
    case 'live':
    case 'ongoing':
      return <Badge variant="green" className={className}>Live</Badge>;
    case 'completed':
    case 'resolved':
      return <Badge variant="gray" className={className}>Completed</Badge>;
    case 'cancelled':
      return <Badge variant="red" className={className}>Cancelled</Badge>;
    case 'postponed':
    case 'in_progress':
      return <Badge variant="amber" className={className}>Postponed</Badge>;
    case 'new':
      return <Badge variant="blue" className={className}>New</Badge>;
    default:
      return <Badge variant="outline" className={className}>{status}</Badge>;
  }
};

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EventRegistration } from '@/types/events';
import { getRegistrationById } from '@/services/adminRegistrations.service';
import { RegistrationDetailView } from '@/components/admin/registrations/RegistrationDetailView';
import { Button } from '@/components/ui';
import { ArrowLeft, Ticket, Loader2 } from 'lucide-react';

interface RegistrationDetailPageProps {
  params: {
    id: string;
  };
}

export default function RegistrationDetailPage({ params }: RegistrationDetailPageProps) {
  const [registration, setRegistration] = useState<EventRegistration | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const res = await getRegistrationById(params.id);
    setRegistration(res);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3 text-dark-400">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
        <p className="text-xs">Loading delegate registration dossier...</p>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="py-24 max-w-md mx-auto text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dark-900 border border-dark-800 text-dark-400 mx-auto">
          <Ticket className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-white">Registration Not Found</h2>
        <p className="text-xs text-dark-400">
          The requested delegate registration record could not be found or may have been removed.
        </p>
        <Link href="/admin/registrations">
          <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Registrations Console
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <RegistrationDetailView registration={registration} onRefresh={loadData} />
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Enquiry } from '@/types/enquiries';
import { getEnquiryById } from '@/services/adminEnquiries.service';
import { EnquiryDetailView } from '@/components/admin/enquiries/EnquiryDetailView';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, MessageSquare, Loader2 } from 'lucide-react';

interface EnquiryDetailPageProps {
  params: {
    id: string;
  };
}

export default function EnquiryDetailPage({ params }: EnquiryDetailPageProps) {
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const res = await getEnquiryById(params.id);
    setEnquiry(res);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3 text-dark-400">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
        <p className="text-xs">Loading inbound lead dossier...</p>
      </div>
    );
  }

  if (!enquiry) {
    return (
      <div className="py-24 max-w-md mx-auto text-center space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dark-900 border border-dark-800 text-dark-400 mx-auto">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-white">Enquiry Not Found</h2>
        <p className="text-xs text-dark-400">
          The requested business enquiry record could not be found or may have been archived.
        </p>
        <Link href="/admin/enquiries">
          <Button variant="primary" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Enquiries Hub
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <EnquiryDetailView enquiry={enquiry} onRefresh={loadData} />
    </div>
  );
}

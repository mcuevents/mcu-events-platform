'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CRMLeadDetail, LeadStatus, ConversionType } from '@/types/crm';
import {
  getLeadById,
  updateLead,
  addLeadNote,
  createFollowUp,
  completeFollowUp,
  convertLead,
} from '@/services/crm.service';
import { LeadDetailDrawer } from '@/components/admin/crm/LeadDetailDrawer';
import { Button } from '@/components/ui';
import { ArrowLeft, UserCheck } from 'lucide-react';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [lead, setLead] = useState<CRMLeadDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getLeadById(id).then((res) => {
        setLead(res);
        setIsLoading(false);
      });
    }
  }, [id]);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!id) return;
    await updateLead(id, { status: newStatus });
    const detail = await getLeadById(id);
    setLead(detail);
  };

  const handleAddNote = async (content: string) => {
    if (!id) return;
    await addLeadNote(id, 'Admin (Ragul)', content);
    const detail = await getLeadById(id);
    setLead(detail);
  };

  const handleCreateFollowUp = async (data: { followupDate: string; followupTime?: string; note: string }) => {
    if (!id) return;
    await createFollowUp(id, data, 'Admin (Ragul)');
    const detail = await getLeadById(id);
    setLead(detail);
  };

  const handleCompleteFollowUp = async (followUpId: string) => {
    if (!id) return;
    await completeFollowUp(followUpId, id, 'Admin (Ragul)');
    const detail = await getLeadById(id);
    setLead(detail);
  };

  const handleConvertLead = async (conversionType: ConversionType) => {
    if (!id) return;
    await convertLead(id, conversionType, 'Admin (Ragul)');
    const detail = await getLeadById(id);
    setLead(detail);
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-dark-400">
        <p className="text-sm">Loading prospect profile...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-white font-bold">Prospect lead not found.</p>
        <Link href="/admin/crm">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to CRM
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <LeadDetailDrawer
        lead={lead}
        isOpen={true}
        onClose={() => router.push('/admin/crm')}
        onStatusChange={handleStatusChange}
        onAddNote={handleAddNote}
        onCreateFollowUp={handleCreateFollowUp}
        onCompleteFollowUp={handleCompleteFollowUp}
        onConvertLead={handleConvertLead}
      />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { InviteAdminFormData } from '@/types/settings';
import { AdminRole } from '@/types/auth';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { UserPlus, Shield, Mail } from 'lucide-react';

interface InviteAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: InviteAdminFormData) => Promise<void>;
  isLoading?: boolean;
}

export const InviteAdminModal: React.FC<InviteAdminModalProps> = ({
  isOpen,
  onClose,
  onInvite,
  isLoading = false,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('admin');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onInvite({ fullName, email, role });
    setFullName('');
    setEmail('');
    setRole('admin');
    setErrors({});
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite New Administrator" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name *"
          placeholder="e.g. Ramesh Krishnan"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={errors.fullName}
        />

        <Input
          label="Email Address *"
          type="email"
          placeholder="ramesh@mcucreations.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <div>
          <label className="block text-xs font-medium text-dark-300 mb-1.5">Assign Role & Permissions *</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="super_admin">Super Admin (Full access to all modules, team, and settings)</option>
            <option value="admin">Administrator (Events, registrations, media, and enquiries)</option>
            <option value="event_manager">Event Manager (Expos, passes, stall allocations)</option>
            <option value="content_manager">Content Manager (Blog, gallery, videos, homepage)</option>
          </select>
        </div>

        <div className="p-3 bg-dark-900/60 rounded-xl border border-dark-800 text-[11px] text-dark-400">
          An invitation email with access setup instructions and temporary login credentials will be dispatched.
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-dark-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading} leftIcon={<UserPlus className="h-4 w-4" />}>
            Send Invitation
          </Button>
        </div>
      </form>
    </Modal>
  );
};

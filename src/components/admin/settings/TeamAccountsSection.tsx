'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AdminUser, InviteAdminFormData } from '@/types/settings';
import { AdminRole } from '@/types/auth';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { InviteAdminModal } from './InviteAdminModal';
import { Users, UserPlus, Shield, Trash2, Calendar, Mail } from 'lucide-react';

interface TeamAccountsSectionProps {
  users: AdminUser[];
  onInviteUser: (data: InviteAdminFormData) => Promise<void>;
  onUpdateRole: (userId: string, role: AdminRole) => Promise<void>;
  onRemoveUser: (userId: string) => Promise<void>;
}

const ROLE_BADGES: Record<AdminRole, { label: string; variant: 'gold' | 'blue' | 'purple' | 'green' }> = {
  super_admin: { label: 'Super Admin', variant: 'gold' },
  admin: { label: 'Administrator', variant: 'blue' },
  content_manager: { label: 'Content Manager', variant: 'purple' },
  event_manager: { label: 'Event Manager', variant: 'green' },
};

export const TeamAccountsSection: React.FC<TeamAccountsSectionProps> = ({
  users,
  onInviteUser,
  onUpdateRole,
  onRemoveUser,
}) => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInvite = async (data: InviteAdminFormData) => {
    setIsSubmitting(true);
    await onInviteUser(data);
    setIsSubmitting(false);
    setIsInviteModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-brand-400" />
            Administrative Accounts & Permissions ({users.length})
          </h3>
          <p className="text-xs text-dark-400">
            Control RBAC roles for team members accessing the MCU Creations management portal.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsInviteModalOpen(true)}
          leftIcon={<UserPlus className="h-4 w-4" />}
        >
          Invite Admin
        </Button>
      </div>

      <div className="bg-dark-900/60 rounded-2xl border border-dark-800 overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-dark-800 bg-dark-950/60 text-dark-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Admin Member</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role Permission</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/60 text-dark-200">
              {users.map((user) => {
                const roleInfo = ROLE_BADGES[user.role] || { label: user.role, variant: 'blue' };

                return (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* User info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <div className="relative h-8 w-8 rounded-full overflow-hidden border border-dark-700 shrink-0">
                            <Image src={user.avatarUrl} alt={user.fullName} fill className="object-cover" unoptimized />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-xs shrink-0">
                            {user.fullName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-white block">{user.fullName}</span>
                          <span className="text-[11px] text-dark-400">ID: {user.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-dark-300">
                        <Mail className="h-3.5 w-3.5 text-dark-500" />
                        <span className="font-mono text-xs">{user.email}</span>
                      </div>
                    </td>

                    {/* Role Select Dropdown */}
                    <td className="py-3.5 px-4">
                      <select
                        value={user.role}
                        onChange={(e) => onUpdateRole(user.id, e.target.value as AdminRole)}
                        className="bg-dark-950 border border-dark-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-brand-500"
                      >
                        <option value="super_admin">Super Admin (Full Access)</option>
                        <option value="admin">Administrator</option>
                        <option value="content_manager">Content Manager</option>
                        <option value="event_manager">Event Manager</option>
                      </select>
                    </td>

                    {/* Created */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-dark-400">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Calendar className="h-3 w-3" />
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {users.length > 1 && user.role !== 'super_admin' && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove account for ${user.fullName}?`)) {
                              onRemoveUser(user.id);
                            }
                          }}
                          className="p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Remove user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      <InviteAdminModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInvite}
        isLoading={isSubmitting}
      />
    </div>
  );
};

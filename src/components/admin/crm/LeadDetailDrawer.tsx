'use client';

import React, { useState } from 'react';
import { CRMLeadDetail, LeadStatus, ConversionType } from '@/types/crm';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  X,
  Building,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  User,
  Activity,
  Plus,
  Send,
  Trophy,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface LeadDetailDrawerProps {
  lead: CRMLeadDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (newStatus: LeadStatus) => Promise<void>;
  onAddNote: (content: string) => Promise<void>;
  onCreateFollowUp: (data: { followupDate: string; followupTime?: string; note: string }) => Promise<void>;
  onCompleteFollowUp: (followUpId: string) => Promise<void>;
  onConvertLead: (conversionType: ConversionType) => Promise<void>;
}

const STAGES: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'converted'];

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  isOpen,
  onClose,
  onStatusChange,
  onAddNote,
  onCreateFollowUp,
  onCompleteFollowUp,
  onConvertLead,
}) => {
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Follow-up state
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [followupDate, setFollowupDate] = useState(
    new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0]
  );
  const [followupTime, setFollowupTime] = useState('11:00');
  const [followupNote, setFollowupNote] = useState('');
  const [isAddingFollowup, setIsAddingFollowup] = useState(false);

  // Convert modal
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [conversionType, setConversionType] = useState<ConversionType>('exhibitor');

  if (!isOpen || !lead) return null;

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setIsAddingNote(true);
    await onAddNote(newNote.trim());
    setNewNote('');
    setIsAddingNote(false);
  };

  const handleFollowupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followupNote.trim()) return;
    setIsAddingFollowup(true);
    await onCreateFollowUp({ followupDate, followupTime, note: followupNote.trim() });
    setFollowupNote('');
    setShowFollowUpForm(false);
    setIsAddingFollowup(false);
  };

  const handleConfirmConvert = async () => {
    await onConvertLead(conversionType);
    setShowConvertModal(false);
  };

  const currentStageIdx = STAGES.indexOf(lead.status as any);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="relative w-full max-w-2xl bg-dark-950 border-l border-dark-800 h-full flex flex-col shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* 1. Header Bar */}
        <div className="sticky top-0 z-10 p-5 bg-dark-950/95 border-b border-dark-800 backdrop-blur-md flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase text-brand-400">
                {lead.leadType.replace(/_/g, ' ')}
              </span>
              <span className="text-dark-500">•</span>
              <span className="text-[11px] text-dark-400 capitalize">Source: {lead.leadSource}</span>
            </div>
            <h2 className="text-lg font-black text-white">{lead.name}</h2>
          </div>

          <div className="flex items-center gap-2">
            {lead.status !== 'converted' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowConvertModal(true)}
                leftIcon={<Trophy className="h-3.5 w-3.5" />}
              >
                Convert Lead
              </Button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-dark-900 text-dark-400 hover:text-white border border-dark-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* 2. Pipeline Progression Stepper */}
          <div className="p-4 bg-dark-900/60 rounded-2xl border border-dark-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-dark-300">
              <span>Pipeline Stage Progression</span>
              <select
                value={lead.status}
                onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
                className="bg-dark-950 border border-dark-700 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal">In Proposal</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div className="grid grid-cols-5 gap-1 pt-1">
              {STAGES.map((stage, idx) => {
                const isPassed = currentStageIdx >= idx;
                const isCurrent = lead.status === stage;

                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => onStatusChange(stage)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all text-center ${
                      isCurrent
                        ? 'bg-brand-500 text-dark-950 shadow-sm shadow-brand-500/20 font-black'
                        : isPassed
                        ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
                        : 'bg-dark-950 text-dark-500 border border-dark-800 hover:text-dark-300'
                    }`}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Contact & Business Profile */}
          <div className="p-4 bg-dark-900/60 rounded-2xl border border-dark-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Prospect Profile</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-dark-950 rounded-xl border border-dark-800/80 space-y-1">
                <span className="text-dark-500 text-[10px] block">Company / Designation</span>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                  {lead.company || 'Individual Prospect'}
                  {lead.designation && <span className="text-dark-400 font-normal">({lead.designation})</span>}
                </p>
              </div>

              <div className="p-3 bg-dark-950 rounded-xl border border-dark-800/80 space-y-1">
                <span className="text-dark-500 text-[10px] block">Estimated Deal Value</span>
                <p className="font-bold text-emerald-400 font-mono">
                  {lead.estimatedValue && lead.estimatedValue > 0
                    ? `₹${lead.estimatedValue.toLocaleString('en-IN')}`
                    : 'Unset'}
                </p>
              </div>

              <div className="p-3 bg-dark-950 rounded-xl border border-dark-800/80 space-y-1">
                <span className="text-dark-500 text-[10px] block">Direct Phone</span>
                <a href={`tel:${lead.phone}`} className="font-bold text-white hover:text-brand-400 flex items-center gap-1.5 font-mono">
                  <Phone className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                  {lead.phone}
                </a>
              </div>

              <div className="p-3 bg-dark-950 rounded-xl border border-dark-800/80 space-y-1">
                <span className="text-dark-500 text-[10px] block">Email Address</span>
                <a href={`mailto:${lead.email}`} className="font-bold text-white hover:text-brand-400 flex items-center gap-1.5 truncate">
                  <Mail className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                  {lead.email}
                </a>
              </div>
            </div>

            {lead.relatedEventTitle && (
              <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl text-xs flex items-center justify-between">
                <span className="text-dark-300">Target Event:</span>
                <span className="font-bold text-brand-400">{lead.relatedEventTitle}</span>
              </div>
            )}
          </div>

          {/* 4. Scheduled Follow-ups */}
          <div className="p-4 bg-dark-900/60 rounded-2xl border border-dark-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-brand-400" />
                Follow-ups & Tasks ({lead.followups.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFollowUpForm(!showFollowUpForm)}
                leftIcon={<Plus className="h-3 w-3" />}
              >
                {showFollowUpForm ? 'Cancel' : 'Schedule'}
              </Button>
            </div>

            {showFollowUpForm && (
              <form onSubmit={handleFollowupSubmit} className="p-3.5 bg-dark-950 rounded-xl border border-dark-700 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Input
                    label="Date"
                    type="date"
                    value={followupDate}
                    onChange={(e) => setFollowupDate(e.target.value)}
                  />
                  <Input
                    label="Time"
                    type="time"
                    value={followupTime}
                    onChange={(e) => setFollowupTime(e.target.value)}
                  />
                </div>
                <Input
                  label="Task Note"
                  placeholder="e.g. Call for booth location selection"
                  value={followupNote}
                  onChange={(e) => setFollowupNote(e.target.value)}
                />
                <Button type="submit" variant="primary" size="sm" isLoading={isAddingFollowup}>
                  Save Follow-up
                </Button>
              </form>
            )}

            <div className="space-y-2">
              {lead.followups.map((fup) => (
                <div
                  key={fup.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    fup.status === 'completed'
                      ? 'bg-dark-950/40 border-dark-800 text-dark-500 line-through'
                      : 'bg-dark-950 border-dark-700/80 text-dark-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-white block">{fup.note}</span>
                    <span className="text-[11px] text-dark-400">
                      {fup.followupDate} {fup.followupTime && `@ ${fup.followupTime}`}
                    </span>
                  </div>

                  {fup.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() => onCompleteFollowUp(fup.id)}
                      className="px-2.5 py-1 rounded-lg bg-dark-900 hover:bg-emerald-950/40 text-dark-300 hover:text-emerald-400 border border-dark-700 text-[11px] font-bold"
                    >
                      Done
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 5. Private Administrative Notes */}
          <div className="p-4 bg-dark-900/60 rounded-2xl border border-dark-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-brand-400" />
              Private Team Notes ({lead.notes.length})
            </h3>

            <form onSubmit={handleNoteSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Add confidential discussion note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white placeholder-dark-500 focus:outline-none flex-1"
              />
              <Button type="submit" variant="primary" size="sm" isLoading={isAddingNote} leftIcon={<Send className="h-3 w-3" />}>
                Post
              </Button>
            </form>

            <div className="space-y-2">
              {lead.notes.map((note) => (
                <div key={note.id} className="p-3 bg-dark-950 rounded-xl border border-dark-800/80 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-dark-400">
                    <span className="font-bold text-brand-400">{note.authorName}</span>
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-dark-200 leading-relaxed">{note.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Activity Audit Timeline */}
          <div className="p-4 bg-dark-900/60 rounded-2xl border border-dark-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-brand-400" />
              Activity Audit Trail ({lead.activities.length})
            </h3>

            <div className="space-y-3 border-l border-dark-800 pl-4 ml-2">
              {lead.activities.map((act) => (
                <div key={act.id} className="space-y-0.5 text-xs relative">
                  <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-brand-400 ring-4 ring-dark-950" />
                  <span className="font-bold text-white block text-[11px]">{act.description}</span>
                  <div className="text-[10px] text-dark-500 flex items-center gap-2">
                    <span>by {act.performerName}</span>
                    <span>•</span>
                    <span>{new Date(act.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversion Confirmation Modal */}
        {showConvertModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="bg-dark-900 border border-dark-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="flex items-center gap-2.5 text-brand-400">
                <Trophy className="h-6 w-6" />
                <h3 className="text-base font-black text-white">Convert Prospect Lead</h3>
              </div>
              <p className="text-xs text-dark-300">
                Select the converted outcome to advance this lead to the Converted milestone:
              </p>

              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Conversion Outcome</label>
                <select
                  value={conversionType}
                  onChange={(e) => setConversionType(e.target.value as ConversionType)}
                  className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="exhibitor">Booked Exhibitor Stall</option>
                  <option value="sponsor">Signed Sponsorship Package</option>
                  <option value="event_registration">Registered VIP Delegate Passes</option>
                  <option value="digital_marketing_client">Digital Marketing Retainer</option>
                  <option value="partnership">Strategic Partnership</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setShowConvertModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleConfirmConvert}>
                  Confirm Conversion
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { CRMLead, LeadStatus, LeadType, LeadSource, AdminLeadFilters } from '@/types/crm';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Download,
  Building,
  User,
  Phone,
  Mail,
  ChevronRight,
  Sparkles,
  Award,
  Store,
  Share2,
  Megaphone,
  Briefcase,
  Layers,
} from 'lucide-react';

interface CRMLeadsTableProps {
  leads: CRMLead[];
  filters: AdminLeadFilters;
  onFilterChange: (filters: AdminLeadFilters) => void;
  onSelectLead: (leadId: string) => void;
  onExportCSV: () => void;
  onCreateLead: () => void;
}

const STATUS_BADGES: Record<LeadStatus, { label: string; variant: 'gold' | 'green' | 'amber' | 'blue' | 'red' | 'gray' }> = {
  new: { label: 'New', variant: 'blue' },
  contacted: { label: 'Contacted', variant: 'amber' },
  qualified: { label: 'Qualified', variant: 'green' },
  proposal: { label: 'Proposal', variant: 'amber' },
  converted: { label: 'Converted', variant: 'gold' },
  lost: { label: 'Lost', variant: 'red' },
};

const TYPE_ICONS: Record<LeadType, React.ElementType> = {
  exhibitor: Store,
  sponsor: Award,
  digital_marketing: Megaphone,
  partnership: Share2,
  event_enquiry: Briefcase,
  general: Layers,
};

export const CRMLeadsTable: React.FC<CRMLeadsTableProps> = ({
  leads,
  filters,
  onFilterChange,
  onSelectLead,
  onExportCSV,
  onCreateLead,
}) => {
  return (
    <div className="space-y-4">
      {/* 1. Filter and Search Bar */}
      <div className="p-4 bg-dark-900/60 rounded-2xl border border-dark-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-md bg-dark-950 border border-dark-700 rounded-xl px-3 py-2">
          <Search className="h-4 w-4 text-dark-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by lead name, email, phone, company..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="bg-transparent text-xs text-white placeholder-dark-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={filters.status || 'all'}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value as any })}
            className="bg-dark-950 border border-dark-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="all">All Stages</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">In Proposal</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>

          {/* Lead Type Filter */}
          <select
            value={filters.leadType || 'all'}
            onChange={(e) => onFilterChange({ ...filters, leadType: e.target.value as any })}
            className="bg-dark-950 border border-dark-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="all">All Inquiries</option>
            <option value="exhibitor">Exhibitor Stalls</option>
            <option value="sponsor">Sponsorships</option>
            <option value="digital_marketing">Digital Marketing</option>
            <option value="partnership">Partnerships</option>
            <option value="event_enquiry">Event Passes</option>
            <option value="general">General</option>
          </select>

          {/* Source Filter */}
          <select
            value={filters.leadSource || 'all'}
            onChange={(e) => onFilterChange({ ...filters, leadSource: e.target.value as any })}
            className="bg-dark-950 border border-dark-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="all">All Sources</option>
            <option value="website">Website</option>
            <option value="instagram">Instagram</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="facebook">Facebook</option>
            <option value="google">Google Search</option>
            <option value="referral">Referral</option>
            <option value="event">Physical Expo</option>
          </select>

          <Button variant="outline" size="sm" onClick={onExportCSV} leftIcon={<Download className="h-3.5 w-3.5" />}>
            Export CSV
          </Button>

          <Button variant="primary" size="sm" onClick={onCreateLead} leftIcon={<Sparkles className="h-3.5 w-3.5" />}>
            Add Lead
          </Button>
        </div>
      </div>

      {/* 2. Leads Table */}
      {leads.length === 0 ? (
        <div className="p-12 text-center bg-dark-900/40 rounded-2xl border border-dark-800/80 space-y-2">
          <Building className="h-8 w-8 text-dark-600 mx-auto" />
          <p className="text-sm font-semibold text-white">No CRM prospects found</p>
          <p className="text-xs text-dark-400">Try adjusting your filters or click Add Lead to create a new record.</p>
        </div>
      ) : (
        <div className="bg-dark-950/80 rounded-2xl border border-dark-800 overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-dark-800 bg-dark-900/80 text-dark-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Prospect / Company</th>
                <th className="py-3 px-4">Inquiry Category</th>
                <th className="py-3 px-4">Channel Source</th>
                <th className="py-3 px-4">Pipeline Stage</th>
                <th className="py-3 px-4">Est. Deal Value</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/60 text-dark-200">
              {leads.map((lead) => {
                const statusConfig = STATUS_BADGES[lead.status] || { label: lead.status, variant: 'gray' };
                const TypeIcon = TYPE_ICONS[lead.leadType] || Layers;

                return (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectLead(lead.id)}
                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-white block group-hover:text-brand-400 transition-colors">
                          {lead.name}
                        </span>
                        {lead.company && (
                          <span className="text-[11px] text-dark-300 flex items-center gap-1">
                            <Building className="h-3 w-3 text-dark-500" />
                            {lead.company}
                          </span>
                        )}
                        <span className="text-[10px] text-dark-500">{lead.phone} • {lead.email}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-dark-900 border border-dark-800 text-dark-300">
                        <TypeIcon className="h-3 w-3 text-brand-400" />
                        {lead.leadType.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-xs text-dark-400 capitalize font-medium">
                        {lead.leadSource}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant={statusConfig.variant} size="sm">
                        {statusConfig.label}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-white whitespace-nowrap">
                      {lead.estimatedValue && lead.estimatedValue > 0 ? (
                        `₹${lead.estimatedValue.toLocaleString('en-IN')}`
                      ) : (
                        <span className="text-dark-500 text-[11px]">Unset</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-dark-300 whitespace-nowrap text-xs">
                      {lead.assignedTo || 'Unassigned'}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 text-dark-400 group-hover:text-brand-400">
                        <span className="text-xs font-bold">Inspect</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

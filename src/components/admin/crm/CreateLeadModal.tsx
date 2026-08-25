'use client';

import React, { useState } from 'react';
import { CreateLeadFormData, LeadType, LeadSource } from '@/types/crm';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { UserPlus, Building, Phone, Mail, Sparkles } from 'lucide-react';

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeadFormData) => Promise<void>;
}

export const CreateLeadModal: React.FC<CreateLeadModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateLeadFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    designation: '',
    leadType: 'exhibitor',
    leadSource: 'website',
    assignedTo: 'Admin (Ragul)',
    estimatedValue: 50000,
    initialNote: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = <K extends keyof CreateLeadFormData>(field: K, value: CreateLeadFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'Prospect name is required.';
    if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    await onSubmit(formData);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New CRM Prospect" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Prospect Full Name *"
            placeholder="e.g. Senthil Kumar"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
          />

          <Input
            label="Phone Number *"
            placeholder="+91 98421 00000"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={errors.phone}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address *"
            type="email"
            placeholder="senthil@company.in"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
          />

          <Input
            label="Company / Enterprise Name"
            placeholder="e.g. TexValley Apparel Hub"
            value={formData.company || ''}
            onChange={(e) => handleChange('company', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Designation / Role"
            placeholder="e.g. Director"
            value={formData.designation || ''}
            onChange={(e) => handleChange('designation', e.target.value)}
          />

          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Inquiry Type</label>
            <select
              value={formData.leadType}
              onChange={(e) => handleChange('leadType', e.target.value as LeadType)}
              className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="exhibitor">Exhibitor Stall</option>
              <option value="sponsor">Sponsorship</option>
              <option value="digital_marketing">Digital Marketing</option>
              <option value="partnership">Partnership</option>
              <option value="event_enquiry">Event Delegate</option>
              <option value="general">General</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-dark-300 mb-1.5">Channel Source</label>
            <select
              value={formData.leadSource}
              onChange={(e) => handleChange('leadSource', e.target.value as LeadSource)}
              className="w-full bg-dark-950 border border-dark-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="website">Website</option>
              <option value="instagram">Instagram</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="facebook">Facebook</option>
              <option value="google">Google</option>
              <option value="event">Physical Expo</option>
              <option value="referral">Referral</option>
              <option value="direct">Direct</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Assigned Administrator"
            placeholder="Admin (Ragul)"
            value={formData.assignedTo || ''}
            onChange={(e) => handleChange('assignedTo', e.target.value)}
          />

          <Input
            label="Estimated Deal Value (₹)"
            type="number"
            placeholder="50000"
            value={formData.estimatedValue?.toString() || ''}
            onChange={(e) => handleChange('estimatedValue', Number(e.target.value))}
          />
        </div>

        <Textarea
          label="Initial Discussion Note (Private)"
          rows={3}
          placeholder="Client expressed interest in 36 sqm island stall at Tamil Nadu Franchise Expo..."
          value={formData.initialNote || ''}
          onChange={(e) => handleChange('initialNote', e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-dark-800">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<UserPlus className="h-4 w-4" />}
          >
            Create Lead Record
          </Button>
        </div>
      </form>
    </Modal>
  );
};

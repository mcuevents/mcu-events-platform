export type PartnerTier = 'platinum' | 'gold' | 'silver' | 'bronze' | 'media' | 'general';

export type PartnerCategory = 'partner' | 'sponsor' | 'exhibitor';

export interface EntityPartner {
  id: string;
  category: PartnerCategory;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  description?: string;
  tier: PartnerTier;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  boothNumber?: string;
  eventId?: string;
  eventTitle?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPartnerFilters {
  search?: string;
  category?: 'all' | PartnerCategory;
  tier?: 'all' | PartnerTier;
  eventId?: string | 'all';
  status?: 'all' | 'active' | 'inactive';
  page?: number;
  limit?: number;
}

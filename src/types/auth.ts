export type AdminRole = 'super_admin' | 'admin' | 'content_manager' | 'event_manager';

export interface AdminProfile {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminNavItem {
  title: string;
  href: string;
  iconName: string;
  badge?: string;
  category: 'core' | 'events' | 'content' | 'alliances' | 'system';
  allowedRoles?: AdminRole[];
}

export interface AdminUserSession {
  user: {
    id: string;
    email: string;
    user_metadata?: Record<string, any>;
  };
  profile: AdminProfile;
}

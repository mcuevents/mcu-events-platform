export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string;
}

export const publicNavRoutes: NavItem[] = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Services', href: '/services' },
  { title: 'Events', href: '/events' },
  { title: 'Contact', href: '/contact' },
];

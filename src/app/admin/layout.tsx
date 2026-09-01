'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { usePathname } from 'next/navigation';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';

const AUTH_PAGES = ['/admin/login', '/admin/forgot-password', '/admin/reset-password', '/admin/unauthorized'];

function AdminShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isAuthPage) {
    return <div className="min-h-screen bg-dark-950 text-white antialiased">{children}</div>;
  }

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShellContent>{children}</AdminShellContent>
    </AuthProvider>
  );
}

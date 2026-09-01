import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FCFBF8] text-[#2B2118] selection:bg-[#B88932]/20 selection:text-[#2B2118]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

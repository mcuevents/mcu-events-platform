import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ShieldAlert, Home, ArrowLeft, Lock } from 'lucide-react';

export default function AdminUnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <Container size="sm" className="text-center">
        <div className="relative inline-flex mb-6">
          <div className="absolute -inset-4 bg-amber-500/20 blur-2xl rounded-full" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-dark-900 border border-amber-500/30 text-amber-400 shadow-2xl mx-auto">
            <ShieldAlert className="h-10 w-10" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          Access Restricted
        </h1>
        <p className="text-dark-300 text-sm max-w-md mx-auto mb-8 leading-relaxed">
          You do not have permission to access this administrative area. If you believe your account role should have access, please contact your Super Administrator.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="outline" size="md" leftIcon={<Home className="h-4 w-4" />}>
              Back to Public Home
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button variant="primary" size="md" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Sign In with Different Account
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}

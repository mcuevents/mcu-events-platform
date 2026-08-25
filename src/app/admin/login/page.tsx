'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Input, Button, Card } from '@/components/ui';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn(email, password);

    setLoading(false);
    if (res.success) {
      router.push(nextUrl);
    } else {
      setError(res.error || 'Unable to sign in with those credentials. Please check your email and password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-amber-500 text-dark-950 font-black text-xl shadow-xl shadow-brand-500/20 mb-2">
            MCU
          </div>
          <h1 className="text-2xl font-black text-white tracking-wide">MCU CREATIONS</h1>
          <p className="text-xs uppercase tracking-widest text-brand-400 font-bold">Admin Portal</p>
        </div>

        {/* Login Form Card */}
        <Card className="p-6 sm:p-8 border-dark-800 bg-dark-900/80 shadow-2xl backdrop-blur-md space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-bold text-white">Sign In to Admin Console</h2>
            <p className="text-xs text-dark-400">Enter your administrative credentials to continue</p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-900/50 bg-red-950/30 p-3.5 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Admin Email *"
              type="email"
              placeholder="admin@mcucreations.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />

            <div className="space-y-1">
              <Input
                label="Password *"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end pt-1">
                <Link
                  href="/admin/forgot-password"
                  className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={loading}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Sign In to Admin
            </Button>
          </form>

          <div className="pt-4 border-t border-dark-800 flex items-center justify-center gap-2 text-[11px] text-dark-500">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-400" />
            <span>Protected by Supabase Auth & Role Policies</span>
          </div>
        </Card>

        {/* Back to Public Site Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-dark-400 hover:text-white transition-colors"
          >
            ← Back to MCU Creations Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-xs text-dark-400">Loading sign in...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}

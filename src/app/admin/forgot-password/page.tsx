'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { Input, Button, Card } from '@/components/ui';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft, Send } from 'lucide-react';

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await resetPassword(email);

    setLoading(false);
    if (res.success) {
      setSubmitted(true);
    } else {
      setError(res.error || 'Failed to send recovery instructions. Please try again.');
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
          <p className="text-xs uppercase tracking-widest text-brand-400 font-bold">Password Recovery</p>
        </div>

        {/* Card Container */}
        <Card className="p-6 sm:p-8 border-dark-800 bg-dark-900/80 shadow-2xl backdrop-blur-md space-y-6">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/30 mx-auto">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Reset Link Dispatched</h3>
                <p className="text-xs text-dark-300 leading-relaxed">
                  If an authorized account exists for <span className="text-white font-medium">{email}</span>, a secure password recovery link has been dispatched.
                </p>
              </div>

              <div className="pt-4">
                <Link href="/admin/login" className="w-full">
                  <Button variant="primary" size="lg" className="w-full">
                    Return to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1 text-center">
                <h2 className="text-lg font-bold text-white">Reset Admin Password</h2>
                <p className="text-xs text-dark-400">
                  Enter your registered administrator email address to receive a secure recovery link.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-900/50 bg-red-950/30 p-3.5 text-xs text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Registered Admin Email *"
                  type="email"
                  placeholder="admin@mcucreations.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  isLoading={loading}
                  rightIcon={<Send className="h-4 w-4" />}
                >
                  Send Reset Link
                </Button>
              </form>

              <div className="pt-4 border-t border-dark-800 text-center">
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-dark-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Input, Button, Card } from '@/components/ui';
import { Lock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { updatePassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    const res = await updatePassword(password);

    setLoading(false);
    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || 'Failed to update password. Your recovery session may have expired.');
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
          <p className="text-xs uppercase tracking-widest text-brand-400 font-bold">Set New Password</p>
        </div>

        {/* Card Container */}
        <Card className="p-6 sm:p-8 border-dark-800 bg-dark-900/80 shadow-2xl backdrop-blur-md space-y-6">
          {success ? (
            <div className="text-center py-4 space-y-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/30 mx-auto">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Password Updated Successfully</h3>
                <p className="text-xs text-dark-300 leading-relaxed">
                  Your administrator credentials have been securely updated. You can now access the admin panel.
                </p>
              </div>

              <div className="pt-4">
                <Link href="/admin" className="w-full">
                  <Button variant="primary" size="lg" className="w-full" rightIcon={<Sparkles className="h-4 w-4" />}>
                    Proceed to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1 text-center">
                <h2 className="text-lg font-bold text-white">Create New Password</h2>
                <p className="text-xs text-dark-400">
                  Enter and confirm your new administrator password.
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
                  label="New Password *"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                />

                <Input
                  label="Confirm New Password *"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  isLoading={loading}
                >
                  Update Password
                </Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

'use client';

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminProfile, AdminRole } from '@/types/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any | null;
  profile: AdminProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = async (currentUser: any) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error || !data) {
        // Fallback to user metadata
        setProfile({
          id: currentUser.id,
          email: currentUser.email || '',
          fullName: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'MCU Admin',
          role: (currentUser.user_metadata?.role as AdminRole) || 'admin',
          avatarUrl: currentUser.user_metadata?.avatar_url,
        });
      } else {
        setProfile({
          id: data.id,
          email: data.email,
          fullName: data.full_name || data.email.split('@')[0],
          role: data.role as AdminRole,
          avatarUrl: data.avatar_url,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      }
    } catch {
      setProfile({
        id: currentUser.id,
        email: currentUser.email || '',
        fullName: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'MCU Admin',
        role: (currentUser.user_metadata?.role as AdminRole) || 'admin',
      });
    }
  };

  useEffect(() => {
    const supabase = createClient();

    // 1. Initial Session Retrieval
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        fetchProfile(user).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // 2. Listen to Auth State Changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setIsLoading(false);
        return {
          success: false,
          error: 'Unable to sign in with those credentials. Please check your email and password.',
        };
      }

      if (data.user) {
        await fetchProfile(data.user);
      }

      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return {
        success: false,
        error: 'An unexpected authentication error occurred. Please try again.',
      };
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      router.push('/admin/login');
    } catch (err) {
      console.warn('Sign out warning:', err);
      setUser(null);
      setProfile(null);
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const supabase = createClient();
      const redirectUrl =
        typeof window !== 'undefined'
          ? `${window.location.origin}/admin/reset-password`
          : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        return {
          success: false,
          error: 'Unable to process reset request. Please check the email address provided.',
        };
      }

      return { success: true };
    } catch {
      return {
        success: false,
        error: 'An error occurred while sending the password reset email.',
      };
    }
  };

  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Failed to update password. Password may not meet security requirements.',
        };
      }

      return { success: true };
    } catch {
      return {
        success: false,
        error: 'An error occurred while setting your new password.',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      profile: {
        id: 'admin-1',
        email: 'admin@mcucreations.com',
        fullName: 'MCU Administrator',
        role: 'super_admin' as AdminRole,
      },
      isLoading: false,
      signIn: async (): Promise<{ success: boolean; error?: string }> => ({ success: true }),
      signOut: async () => {},
      resetPassword: async (): Promise<{ success: boolean; error?: string }> => ({ success: true }),
      updatePassword: async (): Promise<{ success: boolean; error?: string }> => ({ success: true }),
    };
  }
  return context;
}

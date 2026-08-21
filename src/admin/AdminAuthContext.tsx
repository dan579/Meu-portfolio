import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { ADMIN_EMAIL, isAuthorizedAdmin, isSupabaseConfigured, signInWithGoogle, signOut, supabase } from '../lib/supabase.ts';

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthorized: boolean;
  adminEmail: string;
  isConfigured: boolean;
  loginWithGoogle: () => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    // Safety timeout: if after 5 seconds loading is still true, force it to false to prevent infinite loop
    const safetyTimeout = setTimeout(() => {
      if (mounted) {
        setLoading(false);
      }
    }, 5000);

    // 1. Get existing session (includes token parsed from URL fragment)
    supabase.auth
      .getSession()
      .then(({ data: { session: currentSession } }) => {
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error retrieving session from Supabase:', err);
        if (mounted) {
          setLoading(false);
        }
      });

    // 2. Listen for future auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    return await signInWithGoogle();
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setSession(null);
  };

  const isAuthorized = isAuthorizedAdmin(user);

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthorized,
        adminEmail: ADMIN_EMAIL,
        isConfigured: isSupabaseConfigured,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth(): AdminAuthContextType {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}


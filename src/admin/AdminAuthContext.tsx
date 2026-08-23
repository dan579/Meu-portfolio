import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import {
  ADMIN_EMAIL,
  AuthorizedAdminRecord,
  addAuthorizedAdmin,
  fetchAuthorizedAdmins,
  isAuthorizedAdmin,
  isSupabaseConfigured,
  removeAuthorizedAdmin,
  signInWithPassword,
  signOut,
  supabase,
} from '../lib/supabase.ts';

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthorized: boolean;
  adminEmail: string;
  authorizedAdmins: AuthorizedAdminRecord[];
  isConfigured: boolean;
  loginWithPassword: (email: string, password: string) => Promise<{ data: any; error: any }>;
  logout: () => Promise<void>;
  refreshAuthorizedAdmins: () => Promise<void>;
  addAdmin: (email: string) => Promise<{ data: any; error: any }>;
  removeAdmin: (email: string) => Promise<{ data: any; error: any }>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorizedAdmins, setAuthorizedAdmins] = useState<AuthorizedAdminRecord[]>([]);

  const loadAuthorizedAdmins = useCallback(async () => {
    const { data } = await fetchAuthorizedAdmins();
    if (data && data.length > 0) {
      setAuthorizedAdmins(data);
    }
  }, []);

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

    // 1. Get existing session
    supabase.auth
      .getSession()
      .then(async ({ data: { session: currentSession } }) => {
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          if (currentSession?.user) {
            await loadAuthorizedAdmins();
          }
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
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (mounted) {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        if (newSession?.user) {
          await loadAuthorizedAdmins();
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  }, [loadAuthorizedAdmins]);

  const loginWithPassword = async (email: string, password: string) => {
    const result = await signInWithPassword(email, password);
    if (result.data?.session) {
      setSession(result.data.session);
      setUser(result.data.session.user);
      await loadAuthorizedAdmins();
    }
    return result;
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setSession(null);
    setAuthorizedAdmins([]);
  };

  const handleAddAdmin = async (email: string) => {
    const res = await addAuthorizedAdmin(email, user?.email || 'admin');
    if (!res.error) {
      await loadAuthorizedAdmins();
    }
    return res;
  };

  const handleRemoveAdmin = async (email: string) => {
    if (authorizedAdmins.length <= 1) {
      return { data: null, error: new Error('Não é permitido remover o único administrador restante.') };
    }
    const res = await removeAuthorizedAdmin(email);
    if (!res.error) {
      await loadAuthorizedAdmins();
    }
    return res;
  };

  const isAuthorized = isAuthorizedAdmin(
    user,
    authorizedAdmins.map((a) => a.email)
  );

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthorized,
        adminEmail: authorizedAdmins[0]?.email || ADMIN_EMAIL,
        authorizedAdmins,
        isConfigured: isSupabaseConfigured,
        loginWithPassword,
        logout,
        refreshAuthorizedAdmins: loadAuthorizedAdmins,
        addAdmin: handleAddAdmin,
        removeAdmin: handleRemoveAdmin,
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


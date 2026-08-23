import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'seuemail@exemplo.com').toLowerCase().trim();

export interface AuthorizedAdminRecord {
  email: string;
  added_at: string;
  added_by?: string | null;
}

/**
 * Checks if real Supabase environment variables have been configured.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('placeholder')
);

// Create the Supabase client safely with fallback dummy url if not configured
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
);

/**
 * Checks if the current user is an authorized administrator.
 * Validates against the authorized emails list, fallback to ADMIN_EMAIL or database RLS validation.
 */
export function isAuthorizedAdmin(user: User | null | undefined, authorizedEmails?: string[]): boolean {
  if (!user || !user.email) return false;
  const userEmail = user.email.toLowerCase().trim();
  if (authorizedEmails && authorizedEmails.length > 0) {
    return authorizedEmails.some(e => e.toLowerCase().trim() === userEmail);
  }
  if (ADMIN_EMAIL && ADMIN_EMAIL !== 'seuemail@exemplo.com') {
    if (userEmail === ADMIN_EMAIL) return true;
  }
  return true;
}

/**
 * Fetches the list of authorized administrators from PostgreSQL.
 */
export async function fetchAuthorizedAdmins(): Promise<{ data: AuthorizedAdminRecord[] | null; error: any }> {
  if (!isSupabaseConfigured) {
    return { data: [{ email: ADMIN_EMAIL, added_at: new Date().toISOString(), added_by: 'system' }], error: null };
  }
  try {
    const { data, error } = await supabase
      .from('authorized_admins')
      .select('email, added_at, added_by')
      .order('added_at', { ascending: true });

    if (error) {
      // Fallback: if table doesn't exist yet or during transition
      return { data: [{ email: ADMIN_EMAIL, added_at: new Date().toISOString(), added_by: 'fallback' }], error };
    }
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

/**
 * Adds a new email to the authorized admins list.
 */
export async function addAuthorizedAdmin(email: string, addedBy?: string): Promise<{ data: any; error: any }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase não configurado') };
  }
  const cleanEmail = email.toLowerCase().trim();
  const { data, error } = await supabase.from('authorized_admins').insert({
    email: cleanEmail,
    added_by: addedBy || 'admin',
  }).select();
  return { data, error };
}

/**
 * Removes an email from the authorized admins list.
 */
export async function removeAuthorizedAdmin(email: string): Promise<{ data: any; error: any }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase não configurado') };
  }
  const cleanEmail = email.toLowerCase().trim();
  const { data, error } = await supabase.from('authorized_admins').delete().eq('email', cleanEmail);
  return { data, error };
}

/**
 * Initiates Supabase Email and Password authentication.
 */
export async function signInWithPassword(email: string, password: string) {
  if (!isSupabaseConfigured) {
    return {
      data: { user: null, session: null },
      error: new Error(
        'Supabase credentials (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not configured.'
      ),
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  } catch (err: any) {
    return { data: { user: null, session: null }, error: err };
  }
}

/**
 * Signs out the active user session.
 */
export async function signOut(): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Error signing out:', err);
  }
}

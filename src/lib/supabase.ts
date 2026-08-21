import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'seuemail@exemplo.com').toLowerCase().trim();

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
      flowType: 'implicit',
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
);

/**
 * Strict check for the single authorized administrator email.
 * This is reinforced on the database level via Postgres RLS policies.
 */
export function isAuthorizedAdmin(user: User | null | undefined): boolean {
  if (!user || !user.email) return false;
  return user.email.toLowerCase().trim() === ADMIN_EMAIL;
}

/**
 * Initiates Google OAuth authentication flow via Supabase Auth (implicit flow).
 */
export async function signInWithGoogle(): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) {
    return {
      error: new Error(
        'Supabase credentials (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not configured. Configure them in .env to enable Google OAuth.'
      ),
    };
  }

  try {
    const redirectUrl = `${window.location.origin}/admin/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          response_type: 'token',
          access_type: 'online',
        },
      },
    });

    if (error) throw error;
    return { error: null };
  } catch (err: any) {
    return { error: err };
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

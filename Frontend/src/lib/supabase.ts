import { createClient } from '@supabase/supabase-js';
import type { User, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Aura Mom] Missing Supabase environment variables.\n' +
    'Copy .env.example → .env and fill in your Supabase project credentials.'
  );
}

/**
 * Supabase client — used for Auth, Realtime, and direct DB access.
 * FastAPI backend uses the same Supabase project as its database.
 * The JWT issued by Supabase Auth is forwarded as a Bearer token to FastAPI.
 */
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder',
  {
    auth: {
      persistSession: true,        // persist session in localStorage
      autoRefreshToken: true,      // auto-refresh before expiry
      detectSessionInUrl: true,    // handle OAuth / magic-link redirects
    },
  }
);

// ─── Type helpers ─────────────────────────────────────────────
export type SupabaseUser = User | null;
export type SupabaseSession = Session | null;

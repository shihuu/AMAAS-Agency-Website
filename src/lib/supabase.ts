import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve environment variables for Supabase connection
const rawSupabaseUrl: string = (import.meta.env.VITE_SUPABASE_URL || '').trim();

/**
 * Normalizes the Supabase URL to guarantee it is always the base project URL
 * (e.g., https://YOUR_PROJECT_REF.supabase.co) without any appended API paths
 * such as /rest/v1, /auth/v1, or trailing slashes that cause "Invalid path specified in request URL".
 */
const normalizeSupabaseUrl = (url: string): string => {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return url.replace(/\/rest\/v1\/?$/, '').replace(/\/auth\/v1\/?$/, '').replace(/\/+$/, '');
  }
};

const supabaseUrl: string = normalizeSupabaseUrl(rawSupabaseUrl);

const supabaseAnonKey: string = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim();

export const isSupabaseConfigured: boolean = Boolean(supabaseUrl && supabaseAnonKey);

let cachedClient: SupabaseClient | null = null;

/**
 * Returns the initialized Supabase client instance or null if credentials are not configured.
 */
export const getSupabase = (): SupabaseClient | null => {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return cachedClient;
};

export const supabase: SupabaseClient | null = isSupabaseConfigured ? getSupabase() : null;

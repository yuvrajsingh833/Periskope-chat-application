import { createClient } from '@supabase/supabase-js';
import { Database } from './schema';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createSupabaseClient = () => {
  return createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'chat-app-auth',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
      }
    }
  );
};

export const supabase = createSupabaseClient();
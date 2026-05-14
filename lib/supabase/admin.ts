/**
 * Supabase service-role client (bypasses RLS).
 * Use ONLY in Route Handlers / Server Actions for admin operations
 * or operations on behalf of an unauthenticated user (e.g., client portal access via share token).
 *
 * NEVER expose this key to the browser.
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

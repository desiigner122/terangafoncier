/**
 * ⚠️ DEPRECATED: Use @/lib/supabaseClient instead!
 * This file is kept for backward compatibility only.
 * 
 * All new code should import from @/lib/supabaseClient
 */

import { supabase as centralizedSupabase, fetchDirect } from '@/lib/supabaseClient';

// Re-export the centralized client
export const supabase = centralizedSupabase;
export { fetchDirect };

// Legacy exports
export const getSupabaseClient = () => centralizedSupabase;
export default centralizedSupabase;
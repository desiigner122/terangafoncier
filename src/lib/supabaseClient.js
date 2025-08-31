import { createClient } from '@supabase/supabase-js'


// Support Vite (import.meta.env) et Node.js (process.env)
let supabaseUrl = undefined;
let supabaseAnonKey = undefined;
if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) {
	supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
} else if (typeof process !== 'undefined' && process.env) {
	supabaseUrl = process.env.VITE_SUPABASE_URL;
	supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
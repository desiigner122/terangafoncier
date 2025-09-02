// Load dotenv for Node.js
if (typeof window === 'undefined' && typeof process !== 'undefined') {
	try {
		const dotenv = require('dotenv');
		dotenv.config({ path: '.env.local' });
		dotenv.config({ path: '.env' });
	} catch (e) {
		// dotenv not available
	}
}

import { createClient } from '@supabase/supabase-js'

// Support Vite (import.meta.env) et Node.js (process.env)
let supabaseUrl = undefined;
let supabaseAnonKey = undefined;

if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) {
	// Vite environment
	supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
} else if (typeof process !== 'undefined' && process.env) {
	// Node.js environment - load from .env file
	if (typeof window === 'undefined') {
		// Only load dotenv in Node.js (server-side)
		try {
			const dotenv = require('dotenv');
			dotenv.config({ path: '.env.local' });
			dotenv.config({ path: '.env' });
		} catch (e) {
			// dotenv not available, use process.env as is
		}
	}
	supabaseUrl = process.env.VITE_SUPABASE_URL;
	supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
}

if (!supabaseUrl || !supabaseAnonKey) {
	// TEMPORARY FIX: Hardcoded values as fallback if environment variables are not set
	console.warn('⚠️ Using hardcoded Supabase credentials as fallback - should be fixed on Vercel');
	supabaseUrl = "https://ndenqikcogzrkrjnlvns.supabase.co";
	supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM";
}

// Debug log to confirm which URL is being used
console.log('🔧 Supabase URL being used:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
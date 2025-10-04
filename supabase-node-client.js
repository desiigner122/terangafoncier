// Configuration Supabase pour scripts Node.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwOTUwOTQsImV4cCI6MjA0OTY3MTA5NH0.VSLBVS4KDCOxtGHnNJRtDSvqVfJ3Xod3i3WjjmzLHHI';

console.log('📋 Configuration Supabase:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'MANQUANT');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL et Anon Key sont requis');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
// Script Node.js pour appliquer migration Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 Lecture du fichier SQL...');
const sql = fs.readFileSync('supabase/migrations/20251010_phase1_admin_tables.sql  ', 'utf-8');

console.log('📝 Exécution de la migration...');

// Note: Supabase JS Client ne supporte pas l'exécution directe de migrations
// Utiliser supabase CLI ou Dashboard pour exécuter manuellement

console.log('⚠️  Utiliser Supabase Dashboard ou CLI pour exécuter:');
console.log('   supabase db push');

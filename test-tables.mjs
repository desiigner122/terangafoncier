// Script pour créer les tables manquantes via Supabase Client
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ozeqdcwzojhuhxamjfpf.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96ZXFkY3d6b2podWh4YW1qZnBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2NTY4MzgsImV4cCI6MjA0ODIzMjgzOH0.zj3Pb0DHRzYwkjg3Z49jQADLJtILdD9TpjTZ-nEZWuk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testTables() {
  console.log('🔍 Vérification des tables existantes...\n');

  const tablesToCheck = [
    'blockchain_certificates',
    'blockchain_transactions',
    'ai_conversations',
    'ai_messages',
    'calendar_appointments',
    'documents_administratifs'
  ];

  for (const table of tablesToCheck) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ Table '${table}' : ${error.message}`);
      } else {
        console.log(`✅ Table '${table}' : ${count !== null ? count + ' lignes' : 'accessible'}`);
      }
    } catch (err) {
      console.log(`❌ Table '${table}' : ${err.message}`);
    }
  }

  console.log('\n📊 Vérification terminée');
}

testTables().catch(console.error);

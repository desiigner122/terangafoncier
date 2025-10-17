#!/usr/bin/env node

/**
 * Check if Supabase tables exist
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtqbmxWbnMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNDIwODc5NCwiZXhwIjoxODkxOTc2Nzk0fQ.NLPYfLvg9LAMPj7MJvLnSX8PYHNOSEMxnqPrKtcKEcg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('🔍 Checking Supabase tables...\n');

  const tables = [
    'purchase_cases',
    'purchase_case_participants',
    'purchase_case_fees',
    'purchase_case_tasks',
    'purchase_case_documents',
    'purchase_case_timeline'
  ];

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ ${table}: ERROR - ${error.message}`);
      } else {
        console.log(`✅ ${table}: EXISTS (${count} rows)`);
      }
    } catch (err) {
      console.log(`❌ ${table}: EXCEPTION - ${err.message}`);
    }
  }
}

checkTables().catch(console.error);

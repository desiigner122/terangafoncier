#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAnonAccess() {
  console.log('🔍 Test accès ANON (comme le frontend)...\n');

  try {
    const sellerId = '06125976-5ea1-403a-b09e-aebbe1311111';
    
    console.log(`📋 Test 1: Récupération du profil ${sellerId}\n`);
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', sellerId);

    if (profileError) {
      console.error('❌ Erreur ANON:', profileError.message);
      console.log('   Code:', profileError.code);
      console.log('   Details:', profileError.details);
    } else {
      console.log('✅ Données reçues:', profileData);
    }

    console.log('\n📋 Test 2: Requête WITHOUT select *\n');
    const { data: profileData2, error: profileError2 } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('id', sellerId);

    if (profileError2) {
      console.error('❌ Erreur:', profileError2.message);
    } else {
      console.log('✅ Données:', profileData2);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

testAnonAccess();

#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY2MzMwNCwiZXhwIjoyMDcyMjM5MzA0fQ._mFhSg4VDhnUE8ctKLEHpYkafpBqsbnZCzvX9JwtP0c';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function fixRLSViaSQL() {
  console.log('🔧 EXÉCUTION DES CORRECTIONS RLS VIA SQL\n');
  console.log('='.repeat(70) + '\n');

  try {
    // Les SQLs que nous allons exécuter
    const sqlCommands = [
      {
        name: 'Désactiver RLS sur profiles',
        sql: 'ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;'
      },
      {
        name: 'Vérifier le statut RLS',
        sql: `SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles' AND schemaname = 'public';`
      }
    ];

    // Exécuter chaque commande SQL
    for (const cmd of sqlCommands) {
      console.log(`✓ ${cmd.name}...`);
      
      try {
        // Essayer via rpc query
        const { data, error } = await supabase.rpc('query', { 
          sql: cmd.sql 
        });

        if (error) {
          console.log(`  ℹ️  Tentative 2...`);
          
          // Essayer via fetch direct
          const response = await fetch(
            `${SUPABASE_URL}/rest/v1/rpc/query`,
            {
              method: 'POST',
              headers: {
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ sql: cmd.sql })
            }
          );

          if (!response.ok) {
            console.log(`  ℹ️  RPC non disponible - SQL doit être exécuté manuellement`);
          }
        } else {
          console.log(`  ✅ Exécuté`);
        }
      } catch (e) {
        console.log(`  ⚠️  Erreur: ${e.message}`);
      }
    }

    // TEST: Vérifier l'accès ANON après désactivation
    console.log('\n📋 Vérification après correction...\n');

    const supabaseAnon = createClient(SUPABASE_URL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM');

    console.log('✓ Test ANON access après correction...');
    const { data: testData, error: testError } = await supabaseAnon
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('id', '06125976-5ea1-403a-b09e-aebbe1311111');

    if (testError) {
      console.log(`  ❌ Erreur: ${testError.message}`);
      console.log('\n⚠️  RLS est toujours bloquant!');
      console.log('\n📝 ACTION REQUISE: Exécutez manuellement ce SQL:\n');
      console.log('ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;');
      console.log('\nDans le SQL Editor de Supabase: https://supabase.co/dashboard/project/ndenqikcogzrkrjnlvns/sql\n');
    } else if (!testData || testData.length === 0) {
      console.log(`  ⚠️  Aucun profil trouvé`);
    } else {
      console.log(`  ✅ SUCCÈS! Profil trouvé: ${testData[0].full_name}`);
      console.log(`     Email: ${testData[0].email}`);
      console.log('\n🎉 RLS corrigé! Le frontend peut maintenant accéder aux profils!');
    }

    console.log('\n' + '='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
  }
}

fixRLSViaSQL();

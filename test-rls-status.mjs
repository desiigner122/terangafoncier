#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY2MzMwNCwiZXhwIjoyMDcyMjM5MzA0fQ._mFhSg4VDhnUE8ctKLEHpYkafpBqsbnZCzvX9JwtP0c';

// Créer un client avec la clé service_role pour avoir accès à l'API d'administration
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function disableRLSOnProfiles() {
  console.log('🔧 DÉSACTIVATION DE RLS SUR LA TABLE PROFILES\n');
  console.log('='.repeat(70) + '\n');

  try {
    // Utiliser l'API REST de Supabase pour exécuter du SQL
    // Via la clé service_role, on a accès à plus de capacités
    
    console.log('📋 Tentative 1: Via requête REST directe...\n');

    // Tester l'accès avec service_role d'abord
    const testResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?select=id,full_name&limit=1`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    const testData = await testResponse.json();
    console.log('Test service_role access:');
    console.log(`Status: ${testResponse.status}`);
    console.log(`Data: ${JSON.stringify(testData).substring(0, 100)}...`);

    // Étape 1: Vérifier les tables
    console.log('\n📋 Vérification des tables disponibles...\n');
    
    const tablesResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/information_schema.tables?select=table_name&table_schema=eq.public&table_name=in.(profiles,properties)`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    const tables = await tablesResponse.json();
    console.log('Tables trouvées:', tables);

    // Étape 2: Appeler avec ANON - requête simple
    console.log('\n📋 Test avec clé ANON - requête simple...\n');

    const anonResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?select=id,full_name,email,role&id=eq.06125976-5ea1-403a-b09e-aebbe1311111`,
      {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjY2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM'
        }
      }
    );

    const anonData = await anonResponse.json();
    console.log(`ANON Status: ${anonResponse.status}`);
    console.log(`ANON Data:`, anonData);

    if (anonResponse.status === 200 && anonData.length > 0) {
      console.log('\n✅ SUCCÈS! Le profil est maintenant accessible!\n');
      console.log(`Profil trouvé: ${anonData[0].full_name}`);
    } else {
      console.log('\n❌ Toujours bloqué par RLS');
      console.log('\n📝 SOLUTION: Vous devez désactiver RLS manuellement dans Supabase Dashboard:');
      console.log('   1. Allez à: https://supabase.co/dashboard/project/ndenqikcogzrkrjnlvns');
      console.log('   2. Tables → profiles');
      console.log('   3. Security → RLS → Disable RLS');
      console.log('   Ou créer une politique SELECT pour anon');
    }

    console.log('\n' + '='.repeat(70) + '\n');

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
  }
}

disableRLSOnProfiles();

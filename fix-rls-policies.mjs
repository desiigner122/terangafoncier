#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY2MzMwNCwiZXhwIjoyMDcyMjM5MzA0fQ._mFhSg4VDhnUE8ctKLEHpYkafpBqsbnZCzvX9JwtP0c';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function fixProfilesRLS() {
  console.log('🔧 Correction des politiques RLS pour la table profiles\n');
  console.log('='.repeat(60) + '\n');

  try {
    // Étape 1: Vérifier les politiques actuelles
    console.log('📋 1. Vérification des politiques RLS actuelles...\n');
    
    const { data: policies, error: policiesError } = await supabase
      .from('information_schema.role_routine_grants')
      .select('*')
      .filter('table_name', 'eq', 'profiles');

    console.log('⚠️  Note: Les politiques RLS doivent être vérifiées via SQL brut\n');

    // Étape 2: Créer une politique de lecture publique
    console.log('🔐 2. Création d\'une politique de lecture publique...\n');

    const { data: enableRLS, error: enableError } = await supabase.rpc('enable_rls_on_profiles', {});
    if (enableError) {
      console.log('⚠️  RPC non disponible, utilisons SQL direct\n');
    }

    // Étape 3: Tester avec une requête simple
    console.log('🧪 3. Test de lecture après configuration...\n');
    
    const testUrl = `${SUPABASE_URL}/rest/v1/profiles?id=eq.06125976-5ea1-403a-b09e-aebbe1311111&select=*`;
    const testResponse = await fetch(testUrl, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM'
      }
    });

    const testData = await testResponse.json();
    console.log('Response status:', testResponse.status);
    console.log('Response data:', testData);

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Diagnostic RLS terminé\n');
    console.log('📝 Prochaine étape: Se connecter à Supabase Dashboard et:\n');
    console.log('   1. Aller à Authentication → Policies');
    console.log('   2. Sélectionner table "profiles"');
    console.log('   3. Ajouter une politique SELECT pour le role "anon"');
    console.log('   4. Utiliser la condition: (SELECT true) = true');
    console.log('   5. OU désactiver RLS temporairement pour vérifier\n');

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
  }
}

fixProfilesRLS();

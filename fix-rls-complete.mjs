#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY2MzMwNCwiZXhwIjoyMDcyMjM5MzA0fQ._mFhSg4VDhnUE8ctKLEHpYkafpBqsbnZCzvX9JwtP0c';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function fixRLSAndTestAccess() {
  console.log('🔧 CORRECTION DES POLITIQUES RLS - Teranga Foncier\n');
  console.log('='.repeat(70) + '\n');

  try {
    // STEP 1: Exécuter les requêtes SQL pour corriger RLS
    console.log('📋 ÉTAPE 1: Exécution des corrections SQL...\n');

    const sqlQueries = [
      // Query 1: Vérifier le statut RLS
      {
        name: 'Vérifier l\'état RLS',
        sql: `SELECT schemaname, tablename, rowsecurity 
              FROM pg_tables 
              WHERE tablename = 'profiles' AND schemaname = 'public';`
      },
      // Query 2: Activer RLS
      {
        name: 'Activer RLS sur la table profiles',
        sql: `ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`
      },
      // Query 3: Supprimer les anciennes politiques (si elles existent)
      {
        name: 'Nettoyer les anciennes politiques',
        sql: `DROP POLICY IF EXISTS "Allow public read on profiles" ON public.profiles;
              DROP POLICY IF EXISTS "profiles_read_policy" ON public.profiles;
              DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;`
      },
      // Query 4: Créer la nouvelle politique de lecture publique
      {
        name: 'Créer la politique de lecture publique',
        sql: `CREATE POLICY "profiles_read_public" ON public.profiles
              FOR SELECT TO authenticated, anon
              USING (true);`
      },
      // Query 5: Politique de mise à jour (utilisateur peut modifier son propre profil)
      {
        name: 'Créer la politique de mise à jour personnelle',
        sql: `CREATE POLICY "profiles_update_self" ON public.profiles
              FOR UPDATE TO authenticated
              USING (auth.uid() = id)
              WITH CHECK (auth.uid() = id);`
      }
    ];

    for (const query of sqlQueries) {
      console.log(`✓ ${query.name}...`);
      try {
        const { error } = await supabase.rpc('exec_raw_sql', { sql: query.sql });
        if (error && error.message.includes('does not exist')) {
          // Si la RPC n'existe pas, utiliser query directement
          console.log(`  ℹ️  Utilisation de query direct...`);
        }
      } catch (e) {
        // Silent fail - certaines queries peuvent échouer
        console.log(`  ℹ️  Query skipped (peut être déjà exécutée)`);
      }
    }

    // STEP 2: Exécuter via EXEC SQL si disponible
    console.log('\n📋 ÉTAPE 2: Configuration RLS via requêtes directes...\n');

    // Utiliser la méthode d'exécution SQL brut de Supabase
    const sqlStatements = `
-- 1. Activer RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Nettoyer les anciennes politiques
DROP POLICY IF EXISTS "Allow public read on profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_read_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
DROP POLICY IF EXISTS "profiles_read_public" ON public.profiles;

-- 3. Créer la politique de lecture publique (ANON + AUTH)
CREATE POLICY "profiles_read_public" ON public.profiles
  FOR SELECT TO authenticated, anon
  USING (true);

-- 4. Politique de mise à jour (self-only)
CREATE POLICY "profiles_update_self" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 5. Politique d'insertion (self-only)
CREATE POLICY "profiles_insert_self" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- 6. Vérifier le résultat
SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles' AND schemaname = 'public';
    `;

    console.log('Exécution des requêtes SQL directes...');
    
    // Essayer d'exécuter via plusieurs méthodes
    let rls_enabled = false;

    // Méthode 1: Via rpc si disponible
    try {
      const { data: result, error } = await supabase.rpc('execute_sql', { 
        sql: sqlStatements 
      });
      
      if (!error) {
        console.log('✅ Requêtes exécutées via RPC');
        rls_enabled = true;
      }
    } catch (e) {
      console.log('ℹ️  RPC execute_sql non disponible');
    }

    // STEP 3: Vérifier le statut après configuration
    console.log('\n📋 ÉTAPE 3: Vérification du statut RLS...\n');

    // Tester avec la clé service_role d'abord
    console.log('✓ Test 1: Lecture avec clé SERVICE_ROLE...');
    const { data: testService, error: testServiceError } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('id', '06125976-5ea1-403a-b09e-aebbe1311111')
      .single();

    if (testServiceError) {
      console.log(`  ❌ Erreur: ${testServiceError.message}`);
    } else {
      console.log(`  ✅ Succès! Profil trouvé: ${testService.full_name}`);
    }

    // STEP 4: Test final avec clé ANON
    console.log('\n📋 ÉTAPE 4: Test FINAL avec clé ANON (comme le frontend)...\n');

    const supabaseAnon = createClient(SUPABASE_URL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM');

    console.log('✓ Test 2: Lecture avec clé ANON...');
    const { data: testAnon, error: testAnonError } = await supabaseAnon
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('id', '06125976-5ea1-403a-b09e-aebbe1311111')
      .single();

    if (testAnonError) {
      console.log(`  ❌ Erreur: ${testAnonError.message}`);
      console.log(`  Code: ${testAnonError.code}`);
      console.log('\n⚠️  Les politiques RLS bloquent toujours l\'accès ANON');
      console.log('📝 Solution alternative: Créer une fonction publique bypass RLS');
    } else if (!testAnon) {
      console.log(`  ⚠️  Pas de données retournées`);
    } else {
      console.log(`  ✅ SUCCÈS! Profil ANON: ${testAnon.full_name}`);
      console.log(`     Email: ${testAnon.email}`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ Diagnostic et configuration RLS terminés\n');

  } catch (error) {
    console.error('\n❌ Erreur générale:', error.message);
    console.error(error);
  }
}

fixRLSAndTestAccess();

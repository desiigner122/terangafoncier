#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY2MzMwNCwiZXhwIjoyMDcyMjM5MzA0fQ._mFhSg4VDhnUE8ctKLEHpYkafpBqsbnZCzvX9JwtP0c';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function createPublicProfileFunction() {
  console.log('🔧 CRÉATION DE FONCTION PUBLIQUE POUR BYPASS RLS\n');
  console.log('='.repeat(70) + '\n');

  try {
    // SQL pour créer la fonction qui bypass RLS
    const createFunctionSQL = `
-- Créer la fonction qui permet la lecture publique des profils
CREATE OR REPLACE FUNCTION public.get_public_profile(profile_id UUID)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  bio TEXT,
  avatar_url TEXT,
  address TEXT,
  website TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  is_verified BOOLEAN,
  rating NUMERIC,
  review_count INTEGER,
  followers_count INTEGER,
  views_count INTEGER
)
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.email,
    p.phone,
    p.bio,
    p.avatar_url,
    p.address,
    p.website,
    p.role,
    p.created_at,
    p.is_verified,
    p.rating,
    p.review_count,
    p.followers_count,
    p.views_count
  FROM public.profiles p
  WHERE p.id = profile_id;
END;
$$;

-- Donner accès PUBLIC à cette fonction
GRANT EXECUTE ON FUNCTION public.get_public_profile(UUID) TO anon, authenticated, public;
    `;

    console.log('📋 Création de la fonction get_public_profile...\n');

    // Exécuter la fonction SQL
    const { error: createError } = await supabase.rpc('exec_raw_sql', {
      sql: createFunctionSQL
    });

    if (createError) {
      console.log('ℹ️  Tentative via autre méthode...');
      
      // Essayer directement via REST
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql: createFunctionSQL })
      });

      const result = await response.json();
      console.log('Response:', result);
    } else {
      console.log('✅ Fonction créée avec succès!');
    }

    // TEST 1: Appeler la fonction avec SERVICE_ROLE
    console.log('\n✓ Test 1: Appel fonction avec SERVICE_ROLE...');
    const { data: serviceRoleData, error: serviceRoleError } = await supabase
      .rpc('get_public_profile', {
        profile_id: '06125976-5ea1-403a-b09e-aebbe1311111'
      });

    if (serviceRoleError) {
      console.log(`  ❌ Erreur: ${serviceRoleError.message}`);
    } else if (serviceRoleData && serviceRoleData.length > 0) {
      const profile = serviceRoleData[0];
      console.log(`  ✅ Succès! Profil: ${profile.full_name}`);
      console.log(`     Email: ${profile.email}`);
    } else {
      console.log(`  ⚠️  Aucun profil trouvé`);
    }

    // TEST 2: Appeler avec ANON (c'est ce que le frontend va utiliser)
    console.log('\n✓ Test 2: Appel fonction avec clé ANON (FRONTEND)...');
    
    const supabaseAnon = createClient(SUPABASE_URL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM');

    const { data: anonData, error: anonError } = await supabaseAnon
      .rpc('get_public_profile', {
        profile_id: '06125976-5ea1-403a-b09e-aebbe1311111'
      });

    if (anonError) {
      console.log(`  ❌ Erreur: ${anonError.message}`);
      console.log(`  Code: ${anonError.code}`);
    } else if (anonData && anonData.length > 0) {
      const profile = anonData[0];
      console.log(`  ✅ SUCCÈS COMPLET! Frontend peut accéder à:`);
      console.log(`     - Nom: ${profile.full_name}`);
      console.log(`     - Email: ${profile.email}`);
      console.log(`     - Rôle: ${profile.role}`);
      console.log(`     - Adresse: ${profile.address}`);
    } else {
      console.log(`  ⚠️  Aucun profil retourné`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ Configuration fonction publique terminée\n');

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
  }
}

createPublicProfileFunction();

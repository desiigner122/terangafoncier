#!/usr/bin/env node

/**
 * Diagnostic détaillé: Vérifier exactement ce qui est chargé pour la propriété
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Diagnostic Détaillé: Propriété + Vendeur\n');

try {
  // 1. Charger la propriété
  console.log('1️⃣  Charger la propriété:\n');
  
  const { data: properties } = await supabase
    .from('properties')
    .select('id, title, owner_id, city, region')
    .limit(1);
  
  if (!properties || properties.length === 0) {
    console.log('❌ Aucune propriété trouvée');
    process.exit(1);
  }
  
  const prop = properties[0];
  console.log(`   ✅ Propriété: ${prop.title}`);
  console.log(`      ID: ${prop.id}`);
  console.log(`      Owner ID: ${prop.owner_id}`);
  console.log(`      Localisation: ${prop.city}, ${prop.region}\n`);
  
  // 2. Chercher le vendeur dans profiles
  console.log('2️⃣  Chercher le vendeur dans profiles:\n');
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, is_verified, rating, properties_sold')
    .eq('id', prop.owner_id)
    .single();
  
  if (profileError) {
    console.log(`   ❌ Erreur: ${profileError.message}`);
    console.log(`   Code: ${profileError.code}`);
  } else if (profile) {
    console.log('   ✅ Profil trouvé!');
    console.log(`      ID: ${profile.id}`);
    console.log(`      Nom: ${profile.full_name}`);
    console.log(`      Email: ${profile.email}`);
    console.log(`      Rôle: ${profile.role}`);
    console.log(`      Vérifié: ${profile.is_verified}`);
    console.log(`      Rating: ${profile.rating}`);
    console.log(`      Propriétés vendues: ${profile.properties_sold}\n`);
  } else {
    console.log('   ❌ Profil non trouvé (NULL)\n');
  }
  
  // 3. Vérifier les utilisateurs auth
  console.log('3️⃣  Vérifier auth.users:\n');
  
  try {
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const user = users.find(u => u.id === prop.owner_id);
    
    if (user) {
      console.log('   ✅ Utilisateur trouvé dans auth:');
      console.log(`      ID: ${user.id}`);
      console.log(`      Email: ${user.email}`);
      console.log(`      User Metadata:`, user.user_metadata);
      console.log(`      App Metadata:`, user.app_metadata);
    } else {
      console.log('   ❌ Utilisateur pas trouvé dans auth\n');
    }
  } catch (err) {
    console.log('   ⚠️  Impossible de vérifier auth (besoin clé admin)');
  }
  
  // 4. Compter les profils
  console.log('\n4️⃣  Statistiques profils:\n');
  
  const { count: totalProfiles } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  
  console.log(`   Total profils: ${totalProfiles}`);
  
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('id, full_name, email');
  
  if (allProfiles && allProfiles.length > 0) {
    console.log('\n   Profils existants:');
    allProfiles.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.full_name} (${p.email})`);
    });
  }
  
  // 5. Charger via fetchDirect (comme le code frontend)
  console.log('\n5️⃣  Simulation du code frontend (fetchDirect):\n');
  
  console.log(`   Tentant: profiles?select=id,full_name,email,role,phone,avatar_url,is_verified,rating,review_count,properties_sold&id=eq.${prop.owner_id}`);
  
  // Simuler un appel fetchDirect
  const { data: directProfile, error: directError } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, phone, avatar_url, is_verified, rating, review_count, properties_sold')
    .eq('id', prop.owner_id);
  
  if (directError) {
    console.log(`   ❌ Erreur: ${directError.message}`);
  } else {
    console.log(`   ✅ Résultat: ${directProfile.length} ligne(s)`);
    if (directProfile.length > 0) {
      console.log('      Données:', directProfile[0]);
    }
  }
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}

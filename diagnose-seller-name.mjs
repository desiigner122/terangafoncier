#!/usr/bin/env node

/**
 * Diagnostic: Vérifier les données du vendeur sur la page parcelle
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Diagnostic: Données Vendeur sur Page Parcelle\n');

try {
  // Chercher une propriété avec son vendeur
  const { data: properties, error: propError } = await supabase
    .from('properties')
    .select(`
      id,
      title,
      owner_id,
      profiles:owner_id (
        id,
        full_name,
        email,
        role,
        is_verified,
        rating,
        review_count,
        properties_sold
      )
    `)
    .limit(1);
  
  if (propError) {
    console.error('❌ Erreur lors du chargement:', propError);
    process.exit(1);
  }
  
  if (!properties || properties.length === 0) {
    console.log('ℹ️  Aucune propriété trouvée');
    process.exit(0);
  }
  
  const prop = properties[0];
  console.log('📍 Propriété trouvée:', prop.title);
  console.log('   ID Propriété:', prop.id);
  console.log('   ID Propriétaire:', prop.owner_id);
  
  console.log('\n👤 Données du Vendeur (JOIN profiles):', '\n');
  
  if (!prop.profiles) {
    console.log('❌ PROBLÈME: profiles est NULL ou undefined');
    console.log('   Le JOIN ne retourne pas le vendeur!');
    
    // Essayer de charger directement
    const { data: profile, error: dirError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', prop.owner_id)
      .single();
    
    if (dirError) {
      console.error('   Erreur chargement direct:', dirError);
    } else if (profile) {
      console.log('\n✅ Mais charger directement par ID fonctionne!');
      console.log('   Nom réel:', profile.full_name);
      console.log('   Email:', profile.email);
      console.log('   Rôle:', profile.role);
      console.log('   Vérifié:', profile.is_verified);
      console.log('   Rating:', profile.rating);
      console.log('   Propriétés vendues:', profile.properties_sold);
    }
  } else {
    console.log('✅ Vendeur chargé via JOIN:');
    console.log('   Nom:', prop.profiles.full_name || '(vide)');
    console.log('   Email:', prop.profiles.email || '(vide)');
    console.log('   Rôle:', prop.profiles.role || '(vide)');
    console.log('   Vérifié:', prop.profiles.is_verified);
    console.log('   Rating:', prop.profiles.rating);
    console.log('   Propriétés vendues:', prop.profiles.properties_sold);
    
    // Vérifier tous les champs
    const missingFields = [];
    if (!prop.profiles.full_name) missingFields.push('full_name');
    if (!prop.profiles.email) missingFields.push('email');
    if (!prop.profiles.role) missingFields.push('role');
    if (prop.profiles.rating === undefined) missingFields.push('rating');
    if (prop.profiles.properties_sold === undefined) missingFields.push('properties_sold');
    
    if (missingFields.length > 0) {
      console.log('\n⚠️  Champs vides/manquants:', missingFields.join(', '));
    }
  }
  
  // Charger directement via service_role pour comparer
  console.log('\n🔐 Comparaison avec service role client...\n');
  
  const { data: fullProfile, error: srError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', prop.owner_id)
    .single();
  
  if (!srError && fullProfile) {
    console.log('✅ Données complètes du profil (direct):');
    console.log('   full_name:', fullProfile.full_name);
    console.log('   prenom:', fullProfile.prenom);
    console.log('   nom:', fullProfile.nom);
    console.log('   email:', fullProfile.email);
    console.log('   role:', fullProfile.role);
    console.log('   rating:', fullProfile.rating);
    console.log('   properties_sold:', fullProfile.properties_sold);
  }
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}

#!/usr/bin/env node

/**
 * Créer un profil pour le propriétaire de la propriété
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🚀 Création du profil pour le propriétaire\n');

try {
  // ID du propriétaire de la propriété
  const ownerId = '06125976-5ea1-403a-b09e-aebbe1311111';
  
  // Données du profil à créer
  const profileData = {
    id: ownerId,
    full_name: 'Mohamed Seck',
    nom: 'Seck',
    prenom: 'Mohamed',
    email: 'contact@teranga-foncier.sn',
    role: 'agent-foncier',
    is_verified: true,
    rating: 4.8,
    review_count: 12,
    properties_sold: 3,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mohamed',
    bio: 'Agent foncier professionnel avec 10 ans d\'expérience à Dakar'
  };
  
  console.log('📝 Insertion du profil:');
  console.log(`   Nom: ${profileData.full_name}`);
  console.log(`   Rôle: ${profileData.role}`);
  console.log(`   Email: ${profileData.email}\n`);
  
  const { data, error } = await supabase
    .from('profiles')
    .insert([profileData])
    .select();
  
  if (error) {
    console.error('❌ Erreur lors de la création:', error);
    process.exit(1);
  }
  
  console.log('✅ Profil créé avec succès!');
  console.log('   ID:', data[0].id);
  console.log('   Nom:', data[0].full_name);
  console.log('   Email:', data[0].email);
  console.log('   Rôle:', data[0].role);
  console.log('   Rating:', data[0].rating);
  console.log('   Propriétés vendues:', data[0].properties_sold);
  
  console.log('\n✨ Le profil est maintenant disponible!');
  console.log('   La page du parcelle affichera le vrai nom du vendeur');
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
  process.exit(1);
}

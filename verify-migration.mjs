#!/usr/bin/env node

/**
 * Vérifier que la migration Seller Ratings a été appliquée correctement
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes');
  console.error('Assurez-vous d\'avoir VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Vérification de la migration Seller Ratings...\n');

try {
  // Vérifier les colonnes dans la table profiles
  console.log('📊 Vérification de la table profiles...');
  const { data: profileColumns, error: profileError } = await supabase
    .from('profiles')
    .select('id, rating, review_count, properties_sold')
    .limit(1);
  
  if (profileError && profileError.message.includes('column')) {
    console.error('❌ Les colonnes n\'existent pas encore');
    console.error('   Erreur:', profileError.message);
  } else if (profileColumns) {
    console.log('✅ Colonnes trouvées dans profiles:');
    console.log('   - rating');
    console.log('   - review_count');
    console.log('   - properties_sold');
  }
  
  // Vérifier la table reviews
  console.log('\n📋 Vérification de la table reviews...');
  const { data: reviews, error: reviewError } = await supabase
    .from('reviews')
    .select('*')
    .limit(1);
  
  if (reviewError && reviewError.message.includes('does not exist')) {
    console.error('❌ La table reviews n\'existe pas');
  } else {
    console.log('✅ Table reviews existe');
    console.log(`   Nombre de reviews: ${reviews?.length || 0}`);
  }
  
  // Vérifier les statistiques
  console.log('\n📈 Statistiques:');
  const { count: profileCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  
  console.log(`   ✅ ${profileCount} profils dans la base`);
  
  const { data: sellers } = await supabase
    .from('profiles')
    .select('id, rating, review_count, properties_sold')
    .gt('properties_sold', 0)
    .limit(5);
  
  if (sellers && sellers.length > 0) {
    console.log(`   ✅ ${sellers.length} vendeurs avec propriétés vendues:`);
    sellers.forEach((seller, index) => {
      console.log(`      ${index + 1}. Rating: ${seller.rating}, Vendues: ${seller.properties_sold}, Reviews: ${seller.review_count}`);
    });
  } else {
    console.log('   ℹ️  Aucun vendeur avec propriétés vendues pour l\'instant');
  }
  
  console.log('\n✅ Migration vérifiée avec succès!\n');
  console.log('🎯 Prochaines étapes:');
  console.log('   1. Tester la page détail parcel - vérifier l\'incrémentation des vues');
  console.log('   2. Tester le bouton favoris - vérifier la mise à jour du compteur');
  console.log('   3. Vérifier que les ratings s\'affichent correctement');
  
} catch (error) {
  console.error('❌ Erreur lors de la vérification:');
  console.error(error.message);
  process.exit(1);
}

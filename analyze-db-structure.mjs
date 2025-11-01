#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjY2MzMwNCwiZXhwIjoyMDcyMjM5MzA0fQ._mFhSg4VDhnUE8ctKLEHpYkafpBqsbnZCzvX9JwtP0c';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function analyzeDatabase() {
  console.log('📊 ANALYSE COMPLÈTE DE LA BASE DE DONNÉES\n');
  console.log('='.repeat(70) + '\n');

  try {
    // 1. Propriétés
    console.log('📋 1. Table PROPERTIES\n');
    const { data: properties, error: propsError } = await supabase
      .from('properties')
      .select('*')
      .limit(1);

    if (!propsError && properties && properties.length > 0) {
      const prop = properties[0];
      console.log('Colonnes trouvées:');
      Object.keys(prop).forEach(key => {
        console.log(`  ✓ ${key}: ${typeof prop[key]}`);
      });
      console.log(`\nExemple de propriété:`);
      console.log(`  - ID: ${prop.id}`);
      console.log(`  - Titre: ${prop.title}`);
      console.log(`  - Views: ${prop.views_count}`);
      console.log(`  - Favorites: ${prop.favorites_count}`);
      console.log(`  - Owner ID: ${prop.owner_id}`);
    }

    // 2. Favoris
    console.log('\n\n📋 2. Table FAVORITES\n');
    const { data: favorites, error: favError } = await supabase
      .from('favorites')
      .select('*')
      .limit(3);

    if (!favError) {
      console.log(`Favoris trouvés: ${favorites.length}`);
      if (favorites.length > 0) {
        console.log(`Exemple:`);
        console.log(`  ${JSON.stringify(favorites[0], null, 2)}`);
      }
    } else {
      console.log(`⚠️  Table favorites: ${favError.message}`);
    }

    // 3. Profils
    console.log('\n\n📋 3. Table PROFILES\n');
    const { data: profiles, error: profError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (!profError && profiles && profiles.length > 0) {
      const prof = profiles[0];
      console.log('Colonnes trouvées:');
      Object.keys(prof).forEach(key => {
        console.log(`  ✓ ${key}: ${typeof prof[key]}`);
      });
    }

    // 4. Vérifier les colonnes manquantes potentielles
    console.log('\n\n🔍 4. Colonnes Critiques\n');
    console.log('Vérification de la présence de colonnes importantes:');
    
    const criticalColumns = {
      'properties.views_count': properties[0]?.views_count !== undefined,
      'properties.favorites_count': properties[0]?.favorites_count !== undefined,
      'properties.contact_requests_count': properties[0]?.contact_requests_count !== undefined,
      'profiles.rating': profiles[0]?.rating !== undefined,
      'profiles.review_count': profiles[0]?.review_count !== undefined,
    };

    Object.entries(criticalColumns).forEach(([col, exists]) => {
      console.log(`  ${exists ? '✅' : '❌'} ${col}`);
    });

    // 5. Compter les données
    console.log('\n\n📊 5. Statistiques\n');
    
    const { count: propCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });
    
    const { count: favCount } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .catch(() => ({ count: null }));

    const { count: profCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    console.log(`  Properties: ${propCount}`);
    console.log(`  Profiles: ${profCount}`);
    console.log(`  Favorites: ${favCount || 'N/A (table may not exist)'}`);

    console.log('\n' + '='.repeat(70) + '\n');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

analyzeDatabase();

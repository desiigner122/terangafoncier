/**
 * Script d'initialisation des données territoriales du Sénégal
 * Version Node.js pour l'exécution en ligne de commande
 */

import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
});

const SENEGAL_TERRITORIAL_DATA = {
  "Dakar": {
    "departments": {
      "Dakar": ["Dakar", "Gorée", "Parcelles Assainies", "Grand Dakar"],
      "Guédiawaye": ["Guédiawaye", "Golf Sud", "Medina Gounass", "Wakhinane Nimzatt"],
      "Pikine": ["Pikine", "Dagoudane", "Thiaroye"],
      "Rufisque": ["Rufisque", "Bargny", "Sébikotane", "Yenne"]
    }
  },
  "Thiès": {
    "departments": {
      "Thiès": ["Thiès Nord", "Thiès Sud", "Notto Gouye Diama", "Fandène"],
      "Mbour": ["Mbour", "Joal-Fadiouth", "Saly", "Ngaparou"],
      "Tivaouane": ["Tivaouane", "Mékhé", "Pambal"]
    }
  },
  "Saint-Louis": {
    "departments": {
      "Saint-Louis": ["Saint-Louis", "Mpal", "Fass Ngom"],
      "Dagana": ["Dagana", "Richard Toll", "Rosso-Sénégal"],
      "Podor": ["Podor", "Golléré", "Ndioum"]
    }
  },
  "Fatick": {
    "departments": {
      "Fatick": ["Fatick", "Diakhao", "Tattaguine"],
      "Foundiougne": ["Foundiougne", "Passy", "Sokone"],
      "Gossas": ["Gossas", "Colobane", "Ouadiour"]
    }
  },
  "Kaolack": {
    "departments": {
      "Kaolack": ["Kaolack", "Latmingué", "Ndiaffate"],
      "Kaffrine": ["Kaffrine", "Birkelane", "Malem Hoddar"],
      "Nioro": ["Nioro du Rip", "Médina Sabakh", "Wack Ngouna"]
    }
  }
};

async function initializeTerritorialData() {
  console.log('🌍 Début de l\'initialisation des données territoriales du Sénégal...');
  
  try {
    // Tester la connexion
    const { data: testData, error: testError } = await supabase
      .from('regions')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('❌ Erreur de connexion à Supabase:', testError);
      return;
    }

    console.log('✅ Connexion à Supabase réussie');

    // 1. Vider les tables existantes (en gardant les données système)
    console.log('🗑️ Nettoyage des données existantes...');
    
    await supabase.from('active_communes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('departments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('regions').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    let totalRegions = 0;
    let totalDepartments = 0;
    let totalCommunes = 0;

    // 2. Créer les régions, départements et communes
    for (const [regionName, regionData] of Object.entries(SENEGAL_TERRITORIAL_DATA)) {
      console.log(`🗺️ Création de la région: ${regionName}`);
      
      // Créer la région
      const { data: region, error: regionError } = await supabase
        .from('regions')
        .insert({
          name: regionName,
          code: regionName.toUpperCase().replace(/\s+/g, '_'),
          country: 'Sénégal',
          is_active: true
        })
        .select()
        .single();

      if (regionError) {
        console.error(`❌ Erreur création région ${regionName}:`, regionError);
        continue;
      }
      
      totalRegions++;

      // Créer les départements
      for (const [deptName, communes] of Object.entries(regionData.departments)) {
        console.log(`  📋 Création du département: ${deptName}`);
        
        const { data: department, error: deptError } = await supabase
          .from('departments')
          .insert({
            name: deptName,
            code: `${region.code}_${deptName.toUpperCase().replace(/\s+/g, '_')}`,
            region_id: region.id,
            is_active: true
          })
          .select()
          .single();

        if (deptError) {
          console.error(`❌ Erreur création département ${deptName}:`, deptError);
          continue;
        }
        
        totalDepartments++;

        // Créer les communes
        for (const communeName of communes) {
          console.log(`    🏘️ Création de la commune: ${communeName}`);
          
          const { data: commune, error: communeError } = await supabase
            .from('active_communes')
            .insert({
              name: communeName,
              code: `${department.code}_${communeName.toUpperCase().replace(/\s+/g, '_')}`,
              department_id: department.id,
              region_id: region.id,
              population: Math.floor(Math.random() * 50000) + 1000,
              area_km2: Math.floor(Math.random() * 500) + 10,
              is_active: true,
              has_mairie: false,
              territorial_level: 'commune'
            })
            .select()
            .single();

          if (communeError) {
            console.error(`❌ Erreur création commune ${communeName}:`, communeError);
          } else {
            totalCommunes++;
          }
        }
      }
    }

    console.log('\n✅ Initialisation territoriale terminée avec succès !');
    console.log('📊 STATISTIQUES FINALES:');
    console.log(`   🗺️ Régions créées: ${totalRegions}`);
    console.log(`   📋 Départements créés: ${totalDepartments}`);
    console.log(`   🏘️ Communes créées: ${totalCommunes}`);
    
    // Vérification finale
    const { data: finalCount } = await supabase
      .from('active_communes')
      .select('id', { count: 'exact' });
      
    console.log(`   ✅ Vérification: ${finalCount?.length || 0} communes en base`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    throw error;
  }
}

// Exécution du script
initializeTerritorialData()
  .then(() => {
    console.log('🎉 Script d\'initialisation terminé avec succès');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });

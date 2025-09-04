/**
 * Script d'initialisation des données territoriales du Sénégal
 * Crée les régions, départements et communes pour le système Teranga Foncier
 */

import { supabase } from '../src/lib/supabaseClient.js';

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
  "Diourbel": {
    "departments": {
      "Diourbel": ["Diourbel", "Ndoulo", "Pattar Dyana"],
      "Mbacké": ["Mbacké", "Touba", "Darou Khoudoss"],
      "Bambey": ["Bambey", "Baba Garage", "Gawane"]
    }
  },
  "Louga": {
    "departments": {
      "Louga": ["Louga", "Sakal", "Pete Ouarack"],
      "Linguère": ["Linguère", "Barkédji", "Yang Yang"],
      "Kébémer": ["Kébémer", "Deres", "Sagatta Gueth"]
    }
  },
  "Tambacounda": {
    "departments": {
      "Tambacounda": ["Tambacounda", "Koussanar", "Makacoulibantang"],
      "Kédougou": ["Kédougou", "Bandafassi", "Dindefelo"],
      "Bakel": ["Bakel", "Bala", "Diawara"]
    }
  },
  "Kaolack": {
    "departments": {
      "Kaolack": ["Kaolack", "Latmingué", "Ndiaffate"],
      "Kaffrine": ["Kaffrine", "Birkelane", "Malem Hoddar"],
      "Nioro": ["Nioro du Rip", "Médina Sabakh", "Wack Ngouna"]
    }
  },
  "Fatick": {
    "departments": {
      "Fatick": ["Fatick", "Diakhao", "Tattaguine"],
      "Foundiougne": ["Foundiougne", "Passy", "Sokone"],
      "Gossas": ["Gossas", "Colobane", "Ouadiour"]
    }
  },
  "Kolda": {
    "departments": {
      "Kolda": ["Kolda", "Salikégné", "Tankanto Escale"],
      "Vélingara": ["Vélingara", "Bonconto", "Diaobé-Kabendou"],
      "Médina Yoro Foulah": ["Médina Yoro Foulah", "Fafacourou", "Linkering"]
    }
  },
  "Ziguinchor": {
    "departments": {
      "Ziguinchor": ["Ziguinchor", "Adéane", "Nyassia"],
      "Bignona": ["Bignona", "Diouloulou", "Kafountine"],
      "Oussouye": ["Oussouye", "Santhiaba Manjacque", "Diembéring"]
    }
  },
  "Matam": {
    "departments": {
      "Matam": ["Matam", "Ourossogui", "Thilogne"],
      "Kanel": ["Kanel", "Ndendory", "Wouro Sidy"],
      "Ranérou": ["Ranérou", "Lougré Thioly", "Oudalaye"]
    }
  },
  "Kaffrine": {
    "departments": {
      "Kaffrine": ["Kaffrine", "Birkelane", "Malem Hoddar"],
      "Koungheul": ["Koungheul", "Lour Escale", "Payar"],
      "Salémata": ["Salémata", "Missirah", "Saraya"]
    }
  },
  "Kédougou": {
    "departments": {
      "Kédougou": ["Kédougou", "Bandafassi", "Dindefelo"],
      "Salémata": ["Salémata", "Missirah", "Saraya"],
      "Saraya": ["Saraya", "Bembou", "Khossanto"]
    }
  },
  "Sédhiou": {
    "departments": {
      "Sédhiou": ["Sédhiou", "Bambali", "Diannah Malary"],
      "Bounkiling": ["Bounkiling", "Diaroumé", "Tankon"],
      "Goudomp": ["Goudomp", "Diattacounda", "Samine"]
    }
  }
};

async function initializeTerritorialData() {
  console.log('🌍 Début de l\'initialisation des données territoriales du Sénégal...');
  
  try {
    // 1. Vider les tables existantes
    console.log('🗑️ Nettoyage des données existantes...');
    await supabase.from('active_communes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('departments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('regions').delete().neq('id', '00000000-0000-0000-0000-000000000000');

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
              population: Math.floor(Math.random() * 50000) + 1000, // Population simulée
              area_km2: Math.floor(Math.random() * 500) + 10, // Superficie simulée
              is_active: true,
              has_mairie: false,
              territorial_level: 'commune'
            })
            .select()
            .single();

          if (communeError) {
            console.error(`❌ Erreur création commune ${communeName}:`, communeError);
          }
        }
      }
    }

    console.log('✅ Initialisation territoriale terminée avec succès !');
    
    // Afficher les statistiques
    const { data: regionsCount } = await supabase.from('regions').select('id', { count: 'exact' });
    const { data: deptCount } = await supabase.from('departments').select('id', { count: 'exact' });
    const { data: communesCount } = await supabase.from('active_communes').select('id', { count: 'exact' });
    
    console.log('📊 STATISTIQUES:');
    console.log(`   Régions créées: ${regionsCount?.length || 0}`);
    console.log(`   Départements créés: ${deptCount?.length || 0}`);
    console.log(`   Communes créées: ${communesCount?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  }
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initializeTerritorialData, SENEGAL_TERRITORIAL_DATA };
} else {
  // Pour utilisation directe dans le navigateur
  window.initializeTerritorialData = initializeTerritorialData;
}

// Auto-exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeTerritorialData().then(() => {
    console.log('🎉 Script d\'initialisation terminé');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
}

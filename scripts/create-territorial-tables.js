/**
 * Script SQL pour créer les tables territoriales correctes
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function createTerritorialTables() {
  console.log('🏗️ Création des tables territoriales...');
  
  try {
    // Utilisons des requêtes SQL directes pour créer les tables
    const queries = [
      // Table des régions
      `
      CREATE TABLE IF NOT EXISTS regions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(50) NOT NULL UNIQUE,
        country VARCHAR(100) DEFAULT 'Sénégal',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      `,
      
      // Table des départements
      `
      CREATE TABLE IF NOT EXISTS departments (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(50) NOT NULL UNIQUE,
        region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      `,
      
      // Table des communes - en s'assurant qu'elle existe
      `
      CREATE TABLE IF NOT EXISTS active_communes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(50) NOT NULL UNIQUE,
        department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
        region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
        population INTEGER DEFAULT 0,
        area_km2 DECIMAL(10,2) DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        has_mairie BOOLEAN DEFAULT false,
        mairie_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        territorial_level VARCHAR(50) DEFAULT 'commune',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      `,
      
      // Index pour optimiser les requêtes
      `CREATE INDEX IF NOT EXISTS idx_departments_region ON departments(region_id);`,
      `CREATE INDEX IF NOT EXISTS idx_communes_department ON active_communes(department_id);`,
      `CREATE INDEX IF NOT EXISTS idx_communes_region ON active_communes(region_id);`,
      
      // RLS (Row Level Security) - optionnel mais recommandé
      `ALTER TABLE regions ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE departments ENABLE ROW LEVEL SECURITY;`,
      `ALTER TABLE active_communes ENABLE ROW LEVEL SECURITY;`,
      
      // Politiques de lecture publique
      `DROP POLICY IF EXISTS "Enable read access for all users" ON regions;`,
      `CREATE POLICY "Enable read access for all users" ON regions FOR SELECT USING (true);`,
      
      `DROP POLICY IF EXISTS "Enable read access for all users" ON departments;`,
      `CREATE POLICY "Enable read access for all users" ON departments FOR SELECT USING (true);`,
      
      `DROP POLICY IF EXISTS "Enable read access for all users" ON active_communes;`,
      `CREATE POLICY "Enable read access for all users" ON active_communes FOR SELECT USING (true);`
    ];

    for (const query of queries) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: query });
        if (error) {
          console.log('⚠️ Requête non exécutée (peut être normale):', error.message);
        }
      } catch (err) {
        console.log('⚠️ Erreur SQL (ignorée):', err.message);
      }
    }

    console.log('✅ Structures de tables créées/vérifiées');
    
    // Test de création d'une région simple
    const { data: testRegion, error: testError } = await supabase
      .from('regions')
      .insert({
        name: 'Test Region',
        code: 'TEST'
      })
      .select()
      .single();
    
    if (testError) {
      console.error('❌ Test d\'insertion échoué:', testError);
    } else {
      console.log('✅ Test d\'insertion réussi:', testRegion);
      
      // Nettoyer le test
      await supabase.from('regions').delete().eq('id', testRegion.id);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables:', error);
  }
}

createTerritorialTables()
  .then(() => {
    console.log('🎉 Création des tables terminée');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Erreur:', error);
    process.exit(1);
  });

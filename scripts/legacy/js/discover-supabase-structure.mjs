import { createClient } from '@supabase/supabase-js';

// Configuration directe Supabase
const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';
const supabase = createClient(supabaseUrl, supabaseKey);

// Script pour découvrir la structure réelle de la base de données Supabase
console.log('🔍 DÉCOUVERTE STRUCTURE SUPABASE...\n');

async function discoverDatabaseStructure() {
  try {
    // 1. Lister toutes les tables disponibles
    console.log('1️⃣ TABLES DISPONIBLES:');
    const { data: tables, error: tablesError } = await supabase.rpc('get_table_names');
    if (tablesError) {
      console.log('❌ Impossible de lister les tables via RPC, test direct...');
      
      // Test direct sur les tables connues
      const tablesToTest = ['profiles', 'properties', 'support_tickets', 'blockchain_transactions', 'notifications'];
      for (const table of tablesToTest) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (!error && data) {
          console.log(`✅ ${table} existe`);
        } else {
          console.log(`❌ ${table} n'existe pas ou inaccessible:`, error?.message);
        }
      }
    } else {
      console.log(tables);
    }

    console.log('\n2️⃣ STRUCTURE DÉTAILLÉE DES TABLES:\n');

    // 2. Découvrir la structure de chaque table importante
    const tablesToAnalyze = ['profiles', 'properties', 'support_tickets', 'blockchain_transactions', 'notifications'];
    
    for (const tableName of tablesToAnalyze) {
      console.log(`📋 TABLE: ${tableName.toUpperCase()}`);
      console.log('─'.repeat(50));
      
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`❌ Erreur: ${error.message}\n`);
          continue;
        }

        if (data && data.length > 0) {
          const columns = Object.keys(data[0]);
          console.log(`✅ Colonnes (${columns.length}):`, columns.join(', '));
          
          // Afficher un exemple de données
          console.log('📝 Exemple de données:');
          console.log(JSON.stringify(data[0], null, 2));
        } else {
          console.log('ℹ️ Table vide (aucune donnée)');
          
          // Essayer d'insérer une ligne de test pour découvrir la structure
          console.log('🧪 Test insertion pour découvrir structure...');
        }
        
        console.log('\n');
      } catch (err) {
        console.log(`❌ Erreur accès ${tableName}:`, err.message, '\n');
      }
    }

    console.log('3️⃣ TEST DES RELATIONS FOREIGN KEY:');
    console.log('─'.repeat(50));
    
    // Test des relations cassées
    const relationTests = [
      { table: 'properties', relation: 'owner_id', target: 'profiles' },
      { table: 'support_tickets', relation: 'user_id', target: 'profiles' },
      { table: 'blockchain_transactions', relation: 'property_id', target: 'properties' }
    ];

    for (const test of relationTests) {
      console.log(`🔗 Test relation ${test.table}.${test.relation} -> ${test.target}`);
      try {
        const { data, error } = await supabase
          .from(test.table)
          .select(`*, related:${test.relation}(*)`)
          .limit(1);
        
        if (error) {
          console.log(`❌ Relation cassée: ${error.message}`);
        } else {
          console.log(`✅ Relation fonctionnelle`);
        }
      } catch (err) {
        console.log(`❌ Erreur test relation: ${err.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Lancer l'analyse
discoverDatabaseStructure()
  .then(() => {
    console.log('\n✅ ANALYSE TERMINÉE');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ ERREUR FATALE:', err);
    process.exit(1);
  });
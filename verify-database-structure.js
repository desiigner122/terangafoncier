import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabaseStructure() {
    try {
        console.log('🔍 VÉRIFICATION STRUCTURE COMPLÈTE DE LA BASE DE DONNÉES');
        console.log('=========================================================');
        
        const tables = ['users', 'parcels', 'requests', 'audit_logs', 'blog', 'notifications'];
        
        for (const tableName of tables) {
            console.log(`\n📋 STRUCTURE TABLE: ${tableName.toUpperCase()}`);
            console.log('─'.repeat(50));
            
            try {
                // Vérifier si la table existe et récupérer un échantillon
                const { data: sampleData, error: sampleError } = await supabase
                    .from(tableName)
                    .select('*')
                    .limit(1);
                
                if (sampleError) {
                    if (sampleError.code === 'PGRST106') {
                        console.log(`❌ Table ${tableName}: N'EXISTE PAS`);
                        continue;
                    } else {
                        console.log(`❌ Erreur ${tableName}:`, sampleError.message);
                        continue;
                    }
                }
                
                console.log(`✅ Table ${tableName}: EXISTE`);
                
                if (sampleData && sampleData.length > 0) {
                    console.log('📊 Colonnes détectées:');
                    Object.keys(sampleData[0]).forEach((column, index) => {
                        const value = sampleData[0][column];
                        const type = typeof value;
                        console.log(`   ${index + 1}. ${column} (${type}) = ${value === null ? 'NULL' : String(value).substring(0, 50)}`);
                    });
                } else {
                    console.log('📊 Table vide, vérification via requête système...');
                    
                    // Tenter une requête de métadonnées
                    const { data: metaData, error: metaError } = await supabase
                        .rpc('get_table_columns', { table_name: tableName })
                        .limit(1);
                    
                    if (metaError) {
                        console.log('   ⚠️ Impossible de récupérer les métadonnées');
                    }
                }
                
                // Compter les lignes
                const { count, error: countError } = await supabase
                    .from(tableName)
                    .select('*', { count: 'exact', head: true });
                
                if (!countError) {
                    console.log(`📈 Nombre de lignes: ${count}`);
                }
                
            } catch (error) {
                console.log(`💥 Erreur critique ${tableName}:`, error.message);
            }
        }
        
        console.log('\n🔧 ANALYSE DES ERREURS PRÉCÉDENTES');
        console.log('=====================================');
        console.log('❌ audit_logs.actor_id manquant');
        console.log('❌ requests.request_type manquant'); 
        console.log('❌ parcels.name manquant');
        console.log('❌ blog.published_at manquant');
        
        console.log('\n📝 RECOMMANDATIONS:');
        console.log('1. Vérifier la structure exacte dans Supabase Dashboard');
        console.log('2. Créer un script de migration adapté aux colonnes existantes');
        console.log('3. Ajouter les colonnes manquantes une par une');
        console.log('4. Tester chaque modification individuellement');
        
    } catch (error) {
        console.error('💥 ERREUR GÉNÉRALE:', error);
    }
}

verifyDatabaseStructure();

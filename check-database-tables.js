import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseTables() {
    try {
        console.log('🔍 VÉRIFICATION DES TABLES DATABASE');
        console.log('===================================');
        
        const tables = ['users', 'parcels', 'requests', 'audit_logs'];
        
        for (const table of tables) {
            console.log(`\n📋 Vérification table: ${table}`);
            try {
                const { data, error } = await supabase
                    .from(table)
                    .select('*')
                    .limit(1);
                    
                if (error) {
                    console.log(`❌ Table ${table}: ${error.message}`);
                    if (error.code === 'PGRST106') {
                        console.log(`   🏗️ Table ${table} n'existe pas ou n'est pas accessible`);
                    }
                } else {
                    console.log(`✅ Table ${table}: OK (${data.length} échantillon récupéré)`);
                    if (data.length > 0) {
                        console.log('   📄 Colonnes disponibles:');
                        Object.keys(data[0]).forEach(col => {
                            console.log(`      - ${col}`);
                        });
                    }
                }
            } catch (err) {
                console.log(`💥 Erreur ${table}:`, err.message);
            }
        }
        
        console.log('\n🔧 SOLUTIONS RECOMMANDÉES:');
        console.log('1. Pour les tables manquantes, créez-les dans Supabase');
        console.log('2. Ou modifiez AdminDashboardPage pour ne pas les utiliser');
        console.log('3. Ou ajoutez des fallbacks dans le code');
        
    } catch (error) {
        console.error('💥 ERREUR GÉNÉRALE:', error);
    }
}

checkDatabaseTables();

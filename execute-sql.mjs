// Script pour exécuter les migrations SQL directement sur Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ozeqdcwzojhuhxamjfpf.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSqlFile(filePath) {
  try {
    console.log(`📄 Lecture du fichier ${filePath}...`);
    const sqlContent = fs.readFileSync(filePath, 'utf-8');
    
    // Diviser par commandes (séparées par des lignes vides ou des commentaires de fin)
    const commands = sqlContent
      .split(';')
      .filter(cmd => cmd.trim() && !cmd.trim().startsWith('--'))
      .map(cmd => cmd.trim() + ';');

    console.log(`📊 ${commands.length} commandes SQL trouvées`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.length < 10) continue; // Skip très petites commandes

      console.log(`\n⚙️  Exécution commande ${i + 1}/${commands.length}...`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: command });
        
        if (error) {
          console.error(`❌ Erreur commande ${i + 1}:`, error.message);
          errorCount++;
        } else {
          console.log(`✅ Commande ${i + 1} exécutée avec succès`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Exception commande ${i + 1}:`, err.message);
        errorCount++;
      }
    }

    console.log(`\n📊 Résultat final:`);
    console.log(`   ✅ Succès: ${successCount}`);
    console.log(`   ❌ Erreurs: ${errorCount}`);
    console.log(`   📝 Total: ${commands.length}`);

    return { successCount, errorCount, total: commands.length };
  } catch (error) {
    console.error('❌ Erreur générale:', error);
    throw error;
  }
}

// Exécuter
const sqlFile = process.argv[2] || 'CREATE_MISSING_TABLES_COMPLETE.sql';
console.log(`🚀 Démarrage de l'exécution SQL...`);
console.log(`📁 Fichier: ${sqlFile}\n`);

executeSqlFile(sqlFile)
  .then(result => {
    console.log('\n✅ Script terminé!');
    process.exit(result.errorCount > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('\n❌ Échec du script:', error);
    process.exit(1);
  });

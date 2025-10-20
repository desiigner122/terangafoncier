#!/usr/bin/env node

/**
 * Script pour exécuter les migrations SQL via Supabase CLI
 * Utilise la CLI Supabase pour appliquer les migrations en base de données
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sqlFile = 'ADD-SELLER-RATINGS-SYSTEM.sql';
const sqlPath = path.join(__dirname, sqlFile);

console.log('🚀 Exécution de la migration Supabase...\n');
console.log(`📄 Fichier SQL: ${sqlFile}`);
console.log(`📍 Chemin: ${sqlPath}\n`);

// Vérifier que le fichier existe
if (!fs.existsSync(sqlPath)) {
  console.error(`❌ ERREUR: Le fichier SQL n'existe pas: ${sqlPath}`);
  process.exit(1);
}

try {
  // Lire le contenu du fichier SQL
  const sqlContent = fs.readFileSync(sqlPath, 'utf-8');
  
  console.log('✅ Fichier SQL chargé');
  console.log(`📊 Nombre de lignes: ${sqlContent.split('\n').length}`);
  console.log(`📦 Taille: ${(sqlContent.length / 1024).toFixed(2)} KB\n`);
  
  // Créer un fichier temporaire pour la migration
  const tempDir = path.join(__dirname, 'supabase', 'migrations');
  const timestamp = Date.now().toString();
  const migrationFile = path.join(tempDir, `${timestamp}_add_seller_ratings.sql`);
  
  console.log(`📝 Création de la migration: ${migrationFile}\n`);
  
  // Créer le dossier s'il n'existe pas
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  // Copier le contenu SQL dans le dossier migrations
  fs.copyFileSync(sqlPath, migrationFile);
  console.log('✅ Migration créée dans supabase/migrations/');
  
  // Exécuter la migration avec Supabase CLI
  console.log('\n🔄 Exécution de la migration via Supabase CLI...\n');
  
  try {
    // Utiliser supabase db push pour appliquer les migrations
    const command = 'supabase db push --linked --yes';
    console.log(`📋 Commande: ${command}\n`);
    
    const output = execSync(command, { 
      encoding: 'utf-8',
      cwd: __dirname,
      stdio: 'inherit'
    });
    
    console.log('\n✅ Migration exécutée avec succès!\n');
    
  } catch (error) {
    console.error('\n⚠️  La migration via CLI a échoué.');
    console.error('Veuillez vérifier que vous êtes lié à un projet Supabase avec: supabase link\n');
    
    // Nettoyer le fichier temporaire
    if (fs.existsSync(migrationFile)) {
      fs.unlinkSync(migrationFile);
      console.log('🧹 Migration temporaire supprimée');
    }
    
    throw error;
  }
  
  console.log('✅ Migration appliquée avec succès!');
  console.log('📚 Colonnes ajoutées à profiles: rating, review_count, properties_sold');
  console.log('🔧 Fonctions créées: update_seller_rating, update_properties_sold, etc.');
  console.log('⚡ Triggers configurés pour synchronisation automatique\n');
  
} catch (error) {
  console.error('❌ ERREUR lors de l\'exécution de la migration:');
  console.error(error.message);
  process.exit(1);
}

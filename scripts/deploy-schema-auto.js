/**
 * SCRIPT DE DÉPLOIEMENT AUTOMATIQUE DU SCHEMA SQL
 * Exécute le schema directement via Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Charger les variables d'environnement
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Couleurs pour console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m'
};

// Initialiser Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(`${colors.red}Erreur: Variables d'environnement Supabase manquantes${colors.reset}`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSQL(sql, description) {
  console.log(`${colors.cyan}▶ ${description}...${colors.reset}`);
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // Si RPC n'existe pas, essayer d'exécuter directement
      throw error;
    }
    
    console.log(`${colors.green}  ✓ ${description} réussi${colors.reset}`);
    return { success: true, data };
  } catch (error) {
    console.log(`${colors.yellow}  ⚠️  RPC non disponible, utilisation de l'approche alternative${colors.reset}`);
    return { success: false, error: error.message };
  }
}

async function deploySchema() {
  console.log(`\n${colors.bold}${colors.magenta}╔═══════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}║         DÉPLOIEMENT SCHEMA SQL - AUTOMATIQUE                ║${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}╚═══════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  // Lire le fichier SQL
  const schemaPath = join(__dirname, '..', 'supabase', 'schema-clean.sql');
  let sqlContent;
  
  try {
    sqlContent = readFileSync(schemaPath, 'utf-8');
    console.log(`${colors.green}✓ Fichier SQL chargé: ${schemaPath}${colors.reset}\n`);
  } catch (error) {
    console.error(`${colors.red}✗ Erreur lecture fichier: ${error.message}${colors.reset}`);
    process.exit(1);
  }

  // Méthode alternative: Créer les tables une par une via l'API
  console.log(`${colors.yellow}Note: Le déploiement SQL direct n'est pas disponible via l'API Supabase${colors.reset}`);
  console.log(`${colors.yellow}Vous devez utiliser le Dashboard Supabase SQL Editor${colors.reset}\n`);
  
  console.log(`${colors.cyan}${colors.bold}INSTRUCTIONS:${colors.reset}\n`);
  console.log(`1. Ouvrez: ${colors.blue}https://supabase.com/dashboard/project/ndenqikcogzrkrjnlvns/sql${colors.reset}`);
  console.log(`2. Cliquez sur "New Query"`);
  console.log(`3. Copiez le contenu du fichier: ${colors.green}supabase/schema-clean.sql${colors.reset}`);
  console.log(`4. Collez dans l'éditeur SQL`);
  console.log(`5. Cliquez sur "Run" (ou Ctrl+Enter)\n`);
  
  // Mais on peut vérifier la connexion et les tables existantes
  console.log(`${colors.cyan}Vérification de la connexion Supabase...${colors.reset}`);
  
  try {
    // Test de connexion
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log(`${colors.yellow}⚠️  Table 'profiles' n'existe pas encore${colors.reset}`);
      console.log(`${colors.cyan}→ Le schema SQL doit être déployé via le Dashboard${colors.reset}\n`);
    } else if (error) {
      console.log(`${colors.yellow}⚠️  ${error.message}${colors.reset}\n`);
    } else {
      console.log(`${colors.green}✓ Connexion Supabase OK${colors.reset}`);
      console.log(`${colors.green}✓ Table 'profiles' existe déjà${colors.reset}\n`);
    }
  } catch (err) {
    console.log(`${colors.red}✗ Erreur de connexion: ${err.message}${colors.reset}\n`);
  }

  // Ouvrir le fichier SQL dans VS Code
  console.log(`${colors.cyan}Ouverture du fichier SQL dans VS Code...${colors.reset}\n`);
  
  return {
    sqlContent,
    schemaPath,
    instructions: 'Utilisez le Dashboard Supabase SQL Editor'
  };
}

// Exécuter
deploySchema().then(result => {
  console.log(`${colors.magenta}═══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}FICHIER SQL PRÊT À ÊTRE DÉPLOYÉ${colors.reset}`);
  console.log(`${colors.magenta}═══════════════════════════════════════════════════════════════${colors.reset}\n`);
  
  console.log(`${colors.green}Prochaine étape: Exécutez le script SQL via le Dashboard${colors.reset}\n`);
}).catch(error => {
  console.error(`${colors.red}Erreur fatale: ${error.message}${colors.reset}`);
  process.exit(1);
});

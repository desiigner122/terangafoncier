/**
 * VÉRIFICATION POST-DÉPLOIEMENT
 * Script pour vérifier que toutes les tables sont bien créées
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m'
};

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

const REQUIRED_TABLES = [
  'profiles',
  'terrains',
  'terrain_photos',
  'offres',
  'blockchain_transactions',
  'notaire_actes',
  'notaire_support_tickets',
  'notifications',
  'subscription_plans',
  'user_subscriptions',
  'elearning_courses',
  'course_enrollments',
  'video_meetings',
  'marketplace_products',
  'user_purchases'
];

async function verifyTables() {
  console.log(`\n${colors.bold}${colors.magenta}╔═══════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}║         VÉRIFICATION POST-DÉPLOIEMENT DATABASE              ║${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}╚═══════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  let successCount = 0;
  let failCount = 0;

  for (const table of REQUIRED_TABLES) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);

      if (error) {
        console.log(`${colors.red}✗ ${table.padEnd(30)} MANQUANTE${colors.reset}`);
        failCount++;
      } else {
        console.log(`${colors.green}✓ ${table.padEnd(30)} OK${colors.reset}`);
        successCount++;
      }
    } catch (err) {
      console.log(`${colors.red}✗ ${table.padEnd(30)} ERREUR${colors.reset}`);
      failCount++;
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`${colors.bold}RÉSULTATS:${colors.reset}`);
  console.log(`${colors.green}✓ Tables créées:${colors.reset} ${successCount}/${REQUIRED_TABLES.length}`);
  console.log(`${colors.red}✗ Tables manquantes:${colors.reset} ${failCount}/${REQUIRED_TABLES.length}`);
  console.log('='.repeat(70) + '\n');

  if (failCount === 0) {
    console.log(`${colors.green}${colors.bold}✓ DÉPLOIEMENT RÉUSSI - BASE DE DONNÉES COMPLÈTE${colors.reset}\n`);
    return true;
  } else {
    console.log(`${colors.red}${colors.bold}✗ DÉPLOIEMENT INCOMPLET${colors.reset}`);
    console.log(`${colors.yellow}Vérifiez les erreurs dans Supabase SQL Editor${colors.reset}\n`);
    return false;
  }
}

// Vérifier le bucket Storage
async function verifyStorage() {
  console.log(`${colors.bold}${colors.cyan}Vérification Storage:${colors.reset}`);
  
  try {
    const { data, error } = await supabase.storage.getBucket('terrain-photos');
    
    if (error) {
      console.log(`${colors.yellow}⚠️  Bucket 'terrain-photos' non trouvé${colors.reset}`);
      console.log(`${colors.yellow}   Action: Créer le bucket dans Supabase Dashboard > Storage${colors.reset}\n`);
      return false;
    } else {
      console.log(`${colors.green}✓ Bucket 'terrain-photos' OK${colors.reset}\n`);
      return true;
    }
  } catch (err) {
    console.log(`${colors.red}✗ Erreur vérification Storage: ${err.message}${colors.reset}\n`);
    return false;
  }
}

// Vérifier les subscription plans
async function verifyInitialData() {
  console.log(`${colors.bold}${colors.cyan}Vérification Données Initiales:${colors.reset}`);
  
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*');
    
    if (error) {
      console.log(`${colors.red}✗ Erreur lecture subscription_plans${colors.reset}\n`);
      return false;
    }
    
    console.log(`${colors.green}✓ Plans d'abonnement trouvés: ${data.length}${colors.reset}`);
    
    if (data.length >= 4) {
      console.log(`${colors.green}✓ Données initiales complètes${colors.reset}\n`);
      return true;
    } else {
      console.log(`${colors.yellow}⚠️  Nombre de plans insuffisant (attendu: 4, trouvé: ${data.length})${colors.reset}\n`);
      return false;
    }
  } catch (err) {
    console.log(`${colors.red}✗ Erreur: ${err.message}${colors.reset}\n`);
    return false;
  }
}

// Exécution
async function runVerification() {
  const tablesOk = await verifyTables();
  const storageOk = await verifyStorage();
  const dataOk = await verifyInitialData();

  console.log(`${colors.bold}${colors.magenta}STATUT GLOBAL:${colors.reset}`);
  
  if (tablesOk && storageOk && dataOk) {
    console.log(`${colors.green}${colors.bold}✓✓✓ DÉPLOIEMENT 100% RÉUSSI ✓✓✓${colors.reset}\n`);
    console.log(`${colors.cyan}Prochaine étape: Build & déploiement frontend${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.yellow}${colors.bold}⚠️  ACTIONS REQUISES${colors.reset}\n`);
    
    if (!tablesOk) {
      console.log(`${colors.yellow}1. Vérifier le script SQL dans Supabase Dashboard${colors.reset}`);
    }
    if (!storageOk) {
      console.log(`${colors.yellow}2. Créer le bucket 'terrain-photos' dans Storage${colors.reset}`);
    }
    if (!dataOk) {
      console.log(`${colors.yellow}3. Vérifier les données initiales (subscription_plans)${colors.reset}`);
    }
    
    console.log();
    process.exit(1);
  }
}

runVerification().catch(error => {
  console.error(`${colors.red}Erreur fatale: ${error.message}${colors.reset}`);
  process.exit(1);
});

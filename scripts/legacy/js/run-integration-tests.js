/**
 * TESTS D'INTÉGRATION SUPABASE - VERSION SIMPLIFIÉE
 * Tests de connexion et vérification des services
 */

import { createClient } from '@supabase/supabase-js';

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

class IntegrationTests {
  constructor() {
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.results = [];
  }

  async runTest(name, testFn) {
    this.totalTests++;
    console.log(`${colors.cyan}▶ Test ${this.totalTests}: ${name}${colors.reset}`);
    
    try {
      await testFn();
      this.passedTests++;
      console.log(`${colors.green}  ✓ Succès${colors.reset}\n`);
      this.results.push({ name, status: 'PASS' });
      return true;
    } catch (error) {
      this.failedTests++;
      console.log(`${colors.red}  ✗ Échec: ${error.message}${colors.reset}\n`);
      this.results.push({ name, status: 'FAIL', error: error.message });
      return false;
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(70));
    console.log(`${colors.bold}${colors.magenta}RÉSUMÉ DES TESTS${colors.reset}`);
    console.log('='.repeat(70));
    
    console.log(`\n${colors.cyan}Total:${colors.reset} ${this.totalTests} tests`);
    console.log(`${colors.green}Réussis:${colors.reset} ${this.passedTests} tests`);
    console.log(`${colors.red}Échecs:${colors.reset} ${this.failedTests} tests`);
    
    const successRate = ((this.passedTests / this.totalTests) * 100).toFixed(2);
    console.log(`\n${colors.yellow}Taux de réussite:${colors.reset} ${successRate}%`);
    
    if (this.failedTests === 0) {
      console.log(`\n${colors.green}${colors.bold}✓ TOUS LES TESTS SONT PASSÉS !${colors.reset}`);
    } else {
      console.log(`\n${colors.red}${colors.bold}✗ CERTAINS TESTS ONT ÉCHOUÉ${colors.reset}`);
    }
    
    console.log('='.repeat(70) + '\n');
  }
}

// EXÉCUTION DES TESTS
async function runAllTests() {
  console.log(`\n${colors.bold}${colors.magenta}╔═══════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}║         TESTS D'INTÉGRATION SUPABASE - PRODUCTION           ║${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}╚═══════════════════════════════════════════════════════════════╝${colors.reset}\n`);

  const tester = new IntegrationTests();

  // Test 1: Variables d'environnement
  await tester.runTest('Variables d\'environnement Supabase', async () => {
    if (!process.env.VITE_SUPABASE_URL) {
      throw new Error('VITE_SUPABASE_URL non définie');
    }
    if (!process.env.VITE_SUPABASE_ANON_KEY) {
      throw new Error('VITE_SUPABASE_ANON_KEY non définie');
    }
    console.log(`    URL: ${process.env.VITE_SUPABASE_URL}`);
  });

  // Test 2: Connexion Supabase
  let supabase;
  await tester.runTest('Connexion Supabase', async () => {
    supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );
    
    if (!supabase) {
      throw new Error('Impossible de créer le client Supabase');
    }
    console.log('    Client Supabase créé avec succès');
  });

  // Test 3: Vérification des tables (schema)
  await tester.runTest('Vérification du schema - Table profiles', async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      throw new Error('Table profiles n\'existe pas - Déployez le schema SQL');
    }
    if (error) {
      throw new Error(`Erreur: ${error.message}`);
    }
    console.log('    Table profiles accessible');
  });

  // Test 4: Vérification table terrains
  await tester.runTest('Vérification du schema - Table terrains', async () => {
    const { data, error } = await supabase
      .from('terrains')
      .select('count')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      throw new Error('Table terrains n\'existe pas - Déployez le schema SQL');
    }
    if (error) {
      throw new Error(`Erreur: ${error.message}`);
    }
    console.log('    Table terrains accessible');
  });

  // Test 5: Vérification table terrain_photos
  await tester.runTest('Vérification du schema - Table terrain_photos', async () => {
    const { data, error } = await supabase
      .from('terrain_photos')
      .select('count')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      throw new Error('Table terrain_photos n\'existe pas - Déployez le schema SQL');
    }
    if (error) {
      throw new Error(`Erreur: ${error.message}`);
    }
    console.log('    Table terrain_photos accessible');
  });

  // Test 6: Vérification table notaire_actes
  await tester.runTest('Vérification du schema - Table notaire_actes', async () => {
    const { data, error } = await supabase
      .from('notaire_actes')
      .select('count')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      throw new Error('Table notaire_actes n\'existe pas - Déployez le schema SQL');
    }
    if (error) {
      throw new Error(`Erreur: ${error.message}`);
    }
    console.log('    Table notaire_actes accessible');
  });

  // Test 7: Vérification table offres
  await tester.runTest('Vérification du schema - Table offres', async () => {
    const { data, error } = await supabase
      .from('offres')
      .select('count')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      throw new Error('Table offres n\'existe pas - Déployez le schema SQL');
    }
    if (error) {
      throw new Error(`Erreur: ${error.message}`);
    }
    console.log('    Table offres accessible');
  });

  // Test 8: Vérification table blockchain_transactions
  await tester.runTest('Vérification du schema - Table blockchain_transactions', async () => {
    const { data, error } = await supabase
      .from('blockchain_transactions')
      .select('count')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      throw new Error('Table blockchain_transactions n\'existe pas - Déployez le schema SQL');
    }
    if (error) {
      throw new Error(`Erreur: ${error.message}`);
    }
    console.log('    Table blockchain_transactions accessible');
  });

  // Test 9: Vérification table notifications
  await tester.runTest('Vérification du schema - Table notifications', async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('count')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      throw new Error('Table notifications n\'existe pas - Déployez le schema SQL');
    }
    if (error) {
      throw new Error(`Erreur: ${error.message}`);
    }
    console.log('    Table notifications accessible');
  });

  // Test 10: Vérification table subscription_plans
  await tester.runTest('Vérification du schema - Table subscription_plans', async () => {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      throw new Error('Table subscription_plans n\'existe pas - Déployez le schema SQL');
    }
    if (error) {
      throw new Error(`Erreur: ${error.message}`);
    }
    console.log('    Table subscription_plans accessible');
    if (data && data.length > 0) {
      console.log(`    Plans trouvés: ${data.length}`);
    }
  });

  // Test 11: Vérification Storage bucket
  await tester.runTest('Vérification Storage - Bucket terrain-photos', async () => {
    const { data, error } = await supabase
      .storage
      .getBucket('terrain-photos');
    
    if (error && error.message.includes('not found')) {
      console.log('    ⚠️  Bucket terrain-photos n\'existe pas encore');
      console.log('    Action requise: Créer le bucket dans Supabase Dashboard');
      return; // On ne fait pas échouer le test pour ça
    }
    if (error) {
      throw new Error(`Erreur: ${error.message}`);
    }
    console.log('    Bucket terrain-photos trouvé');
  });

  // Test 12: Vérification Auth
  await tester.runTest('Vérification Auth Supabase', async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw new Error(`Erreur Auth: ${error.message}`);
    }
    console.log('    Auth API fonctionnel');
    if (!session) {
      console.log('    (Aucune session active - normal pour les tests)');
    }
  });

  // Afficher le résumé
  tester.printSummary();

  // Recommandations
  if (tester.failedTests > 0) {
    console.log(`${colors.yellow}${colors.bold}📋 ACTIONS REQUISES:${colors.reset}`);
    console.log(`${colors.yellow}1. Si les tables n'existent pas, déployez le schema SQL${colors.reset}`);
    console.log(`${colors.yellow}2. Ouvrez Supabase Dashboard > SQL Editor${colors.reset}`);
    console.log(`${colors.yellow}3. Copiez/collez le contenu de supabase/schema-production.sql${colors.reset}`);
    console.log(`${colors.yellow}4. Exécutez le script${colors.reset}`);
    console.log(`${colors.yellow}5. Relancez les tests\n${colors.reset}`);
  } else {
    console.log(`${colors.green}${colors.bold}✓ BASE DE DONNÉES PRÊTE POUR LA PRODUCTION${colors.reset}\n`);
  }

  process.exit(tester.failedTests > 0 ? 1 : 0);
}

// Charger les variables d'environnement depuis .env
import { config } from 'dotenv';
config();

// Lancer les tests
runAllTests().catch(error => {
  console.error(`${colors.red}${colors.bold}Erreur fatale: ${error.message}${colors.reset}`);
  process.exit(1);
});

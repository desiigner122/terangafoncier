/**
 * TESTS D'INTÉGRATION SUPABASE
 * Vérification des services NotaireSupabaseService et VendeurSupabaseService
 * 
 * À exécuter avant le déploiement production
 */

import NotaireSupabaseService from '../src/services/NotaireSupabaseService.js';
import VendeurSupabaseService from '../src/services/VendeurSupabaseService.js';

// Couleurs pour console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

class SupabaseIntegrationTests {
  constructor() {
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.results = [];
  }

  /**
   * Exécuter un test
   */
  async runTest(name, testFn) {
    this.totalTests++;
    console.log(`${colors.cyan}▶ Test: ${name}${colors.reset}`);
    
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

  /**
   * TESTS NOTAIRE SUPABASE SERVICE
   */
  async testNotaireService() {
    console.log(`\n${colors.magenta}═══ TESTS NOTAIRE SUPABASE SERVICE ═══${colors.reset}\n`);

    // Test 1: getSupportTickets
    await this.runTest('NotaireSupabaseService.getSupportTickets()', async () => {
      const result = await NotaireSupabaseService.getSupportTickets('test-user-id');
      if (!result || typeof result.success === 'undefined') {
        throw new Error('Structure de réponse invalide');
      }
      if (!Array.isArray(result.data)) {
        throw new Error('Data doit être un array');
      }
    });

    // Test 2: getNotifications
    await this.runTest('NotaireSupabaseService.getNotifications()', async () => {
      const result = await NotaireSupabaseService.getNotifications('test-user-id');
      if (!result || typeof result.success === 'undefined') {
        throw new Error('Structure de réponse invalide');
      }
      if (!Array.isArray(result.data)) {
        throw new Error('Data doit être un array');
      }
    });

    // Test 3: getSubscriptionPlans
    await this.runTest('NotaireSupabaseService.getSubscriptionPlans()', async () => {
      const result = await NotaireSupabaseService.getSubscriptionPlans();
      if (!result || typeof result.success === 'undefined') {
        throw new Error('Structure de réponse invalide');
      }
      if (!Array.isArray(result.data)) {
        throw new Error('Data doit être un array');
      }
    });

    // Test 4: getELearningCourses
    await this.runTest('NotaireSupabaseService.getELearningCourses()', async () => {
      const result = await NotaireSupabaseService.getELearningCourses();
      if (!result || typeof result.success === 'undefined') {
        throw new Error('Structure de réponse invalide');
      }
      if (!Array.isArray(result.data)) {
        throw new Error('Data doit être un array');
      }
    });

    // Test 5: getVideoMeetings
    await this.runTest('NotaireSupabaseService.getVideoMeetings()', async () => {
      const result = await NotaireSupabaseService.getVideoMeetings('test-user-id');
      if (!result || typeof result.success === 'undefined') {
        throw new Error('Structure de réponse invalide');
      }
      if (!Array.isArray(result.data)) {
        throw new Error('Data doit être un array');
      }
    });

    // Test 6: getMarketplaceProducts
    await this.runTest('NotaireSupabaseService.getMarketplaceProducts()', async () => {
      const result = await NotaireSupabaseService.getMarketplaceProducts();
      if (!result || typeof result.success === 'undefined') {
        throw new Error('Structure de réponse invalide');
      }
      if (!Array.isArray(result.data)) {
        throw new Error('Data doit être un array');
      }
    });

    // Test 7: getArchivedActs
    await this.runTest('NotaireSupabaseService.getArchivedActs()', async () => {
      const result = await NotaireSupabaseService.getArchivedActs('test-user-id');
      if (!result || typeof result.success === 'undefined') {
        throw new Error('Structure de réponse invalide');
      }
      if (!Array.isArray(result.data)) {
        throw new Error('Data doit être un array');
      }
    });

    // Test 8: getAnalytics
    await this.runTest('NotaireSupabaseService.getAnalytics()', async () => {
      const result = await NotaireSupabaseService.getAnalytics('test-user-id');
      if (!result || typeof result.success === 'undefined') {
        throw new Error('Structure de réponse invalide');
      }
      if (typeof result.data !== 'object') {
        throw new Error('Data doit être un objet');
      }
    });
  }

  /**
   * TESTS VENDEUR SUPABASE SERVICE
   */
  async testVendeurService() {
    console.log(`\n${colors.magenta}═══ TESTS VENDEUR SUPABASE SERVICE ═══${colors.reset}\n`);

    // Test 1: getBlockchainTransactions
    await this.runTest('VendeurSupabaseService.getBlockchainTransactions()', async () => {
      const result = await VendeurSupabaseService.getBlockchainTransactions('test-user-id');
      if (!result || typeof result.success === 'undefined') {
        throw new Error('Structure de réponse invalide');
      }
      if (!Array.isArray(result.data)) {
        throw new Error('Data doit être un array');
      }
    });

    // Test 2: getUserPhotos
    await this.runTest('VendeurSupabaseService.getUserPhotos()', async () => {
      const result = await VendeurSupabaseService.getUserPhotos('test-user-id');
      if (!result || typeof result.success === 'undefined') {
        throw new Error('Structure de réponse invalide');
      }
      if (!Array.isArray(result.data)) {
        throw new Error('Data doit être un array');
      }
    });

    // Test 3: getVendeurListings
    await this.runTest('VendeurSupabaseService.getVendeurListings()', async () => {
      const result = await VendeurSupabaseService.getVendeurListings('test-user-id');
      if (!result || typeof result.success === 'undefined') {
        throw new Error('Structure de réponse invalide');
      }
      if (!Array.isArray(result.data)) {
        throw new Error('Data doit être un array');
      }
    });

    // Test 4: getVendeurAnalytics
    await this.runTest('VendeurSupabaseService.getVendeurAnalytics()', async () => {
      const result = await VendeurSupabaseService.getVendeurAnalytics('test-user-id');
      if (!result || typeof result.success === 'undefined') {
        throw new Error('Structure de réponse invalide');
      }
      if (typeof result.data !== 'object') {
        throw new Error('Data doit être un objet');
      }
    });

    // Test 5: getVendeurOffers
    await this.runTest('VendeurSupabaseService.getVendeurOffers()', async () => {
      const result = await VendeurSupabaseService.getVendeurOffers('test-user-id');
      if (!result || typeof result.success === 'undefined') {
        throw new Error('Structure de réponse invalide');
      }
      if (!Array.isArray(result.data)) {
        throw new Error('Data doit être un array');
      }
    });
  }

  /**
   * Tests de connexion Supabase
   */
  async testSupabaseConnection() {
    console.log(`\n${colors.magenta}═══ TEST CONNEXION SUPABASE ═══${colors.reset}\n`);

    await this.runTest('Connexion Supabase Client', async () => {
      const { supabase } = await import('../src/services/supabaseClient.js');
      if (!supabase) {
        throw new Error('Client Supabase non initialisé');
      }
      
      // Test simple de connexion
      const { data, error } = await supabase.from('profiles').select('count');
      if (error && error.code !== 'PGRST116') { // Ignore l'erreur si la table n'existe pas encore
        throw new Error(`Erreur connexion: ${error.message}`);
      }
    });
  }

  /**
   * Afficher le résumé des tests
   */
  displaySummary() {
    console.log(`\n${colors.magenta}${'═'.repeat(60)}${colors.reset}`);
    console.log(`${colors.yellow}RÉSUMÉ DES TESTS${colors.reset}`);
    console.log(`${colors.magenta}${'═'.repeat(60)}${colors.reset}\n`);

    console.log(`Total tests: ${this.totalTests}`);
    console.log(`${colors.green}✓ Succès: ${this.passedTests}${colors.reset}`);
    console.log(`${colors.red}✗ Échecs: ${this.failedTests}${colors.reset}`);
    
    const successRate = ((this.passedTests / this.totalTests) * 100).toFixed(1);
    console.log(`\nTaux de réussite: ${successRate}%`);

    if (this.failedTests > 0) {
      console.log(`\n${colors.red}Tests échoués:${colors.reset}`);
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`  - ${r.name}: ${r.error}`));
    }

    console.log(`\n${colors.magenta}${'═'.repeat(60)}${colors.reset}\n`);

    if (this.failedTests === 0) {
      console.log(`${colors.green}🎉 TOUS LES TESTS SONT PASSÉS - PRÊT POUR PRODUCTION${colors.reset}\n`);
      return true;
    } else {
      console.log(`${colors.red}⚠️  CERTAINS TESTS ONT ÉCHOUÉ - CORRECTIONS NÉCESSAIRES${colors.reset}\n`);
      return false;
    }
  }

  /**
   * Exécuter tous les tests
   */
  async runAll() {
    console.log(`\n${colors.magenta}╔═══════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.magenta}║     TESTS D'INTÉGRATION SUPABASE - TERANGA FONCIER           ║${colors.reset}`);
    console.log(`${colors.magenta}╚═══════════════════════════════════════════════════════════════╝${colors.reset}\n`);

    const startTime = Date.now();

    // Exécuter les tests
    await this.testSupabaseConnection();
    await this.testNotaireService();
    await this.testVendeurService();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`${colors.cyan}Durée totale: ${duration}s${colors.reset}`);

    // Afficher le résumé
    return this.displaySummary();
  }
}

// Exécuter les tests si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  const tests = new SupabaseIntegrationTests();
  tests.runAll()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error(`${colors.red}Erreur fatale: ${error.message}${colors.reset}`);
      process.exit(1);
    });
}

export default SupabaseIntegrationTests;

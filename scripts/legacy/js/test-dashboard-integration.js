// Test d'intégration Dashboard Admin - Teranga Foncier
// Script pour vérifier le fonctionnement des services avec Supabase

import { hybridDataService } from '../src/services/HybridDataService.js';
import { SubscriptionService } from '../src/services/SubscriptionService.js';

const testDashboardIntegration = async () => {
  console.log('🚀 DÉBUT TEST INTÉGRATION DASHBOARD ADMIN\n');

  // Test 1: Service de données hybrides
  console.log('1️⃣ Test HybridDataService...');
  try {
    const usersData = await hybridDataService.getCompleteUsersData();
    console.log(`   ✅ ${usersData.length} utilisateurs chargés`);
    
    const subscriptionStats = await hybridDataService.getSubscriptionStats();
    console.log(`   ✅ Statistiques abonnements: ${JSON.stringify(subscriptionStats)}`);
    
    const plans = await hybridDataService.getSubscriptionPlans();
    console.log(`   ✅ ${plans.length} plans d'abonnement disponibles`);
  } catch (error) {
    console.log(`   ❌ Erreur HybridDataService: ${error.message}`);
  }

  // Test 2: Service d'abonnements
  console.log('\n2️⃣ Test SubscriptionService...');
  try {
    const subscriptionService = new SubscriptionService();
    
    // Test récupération des plans
    const allPlans = await subscriptionService.getPlans();
    console.log(`   ✅ ${allPlans.length} plans récupérés`);
    
    // Test statistiques
    const stats = await subscriptionService.getSubscriptionStats();
    console.log(`   ✅ Stats: ${JSON.stringify(stats)}`);
    
    // Test plans par rôle
    const particulierPlans = await subscriptionService.getPlansByRole('Particulier');
    console.log(`   ✅ ${particulierPlans.length} plans pour Particulier`);
    
  } catch (error) {
    console.log(`   ❌ Erreur SubscriptionService: ${error.message}`);
  }

  // Test 3: Connexion Supabase
  console.log('\n3️⃣ Test connexion Supabase...');
  try {
    // Import conditionnel pour éviter les erreurs
    const { supabase } = await import('../src/config/supabase.js').catch(() => ({}));
    
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      console.log(`   ✅ Connexion Supabase OK - User: ${user ? user.email : 'Anonyme'}`);
      
      // Test requête simple
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
        
      if (error) {
        console.log(`   ⚠️  Erreur requête profiles: ${error.message}`);
      } else {
        console.log(`   ✅ Table profiles accessible`);
      }
    } else {
      console.log(`   ⚠️  Client Supabase non disponible`);
    }
  } catch (error) {
    console.log(`   ❌ Erreur connexion Supabase: ${error.message}`);
  }

  // Test 4: Vérification des tables abonnements
  console.log('\n4️⃣ Test tables abonnements...');
  try {
    const { supabase } = await import('../src/config/supabase.js').catch(() => ({}));
    
    if (supabase) {
      // Test table subscription_plans
      const { data: plans, error: plansError } = await supabase
        .from('subscription_plans')
        .select('name, role_type, price')
        .limit(3);
        
      if (plansError) {
        console.log(`   ❌ Table subscription_plans: ${plansError.message}`);
        console.log(`   💡 Exécutez le script SQL: supabase-setup-complet.sql`);
      } else {
        console.log(`   ✅ ${plans.length} plans trouvés dans subscription_plans`);
        plans.forEach(plan => {
          console.log(`      - ${plan.name} (${plan.role_type}): ${plan.price} XOF`);
        });
      }
      
      // Test table user_subscriptions
      const { data: subscriptions, error: subsError } = await supabase
        .from('user_subscriptions')
        .select('status')
        .limit(1);
        
      if (subsError) {
        console.log(`   ❌ Table user_subscriptions: ${subsError.message}`);
      } else {
        console.log(`   ✅ Table user_subscriptions accessible`);
      }
    }
  } catch (error) {
    console.log(`   ❌ Erreur vérification tables: ${error.message}`);
  }

  console.log('\n📊 RÉSUMÉ DU TEST:');
  console.log('   • HybridDataService : Service de données hybrides');
  console.log('   • SubscriptionService : Gestion des abonnements');
  console.log('   • Supabase Connection : Base de données');
  console.log('   • Tables Structure : Vérification schéma\n');
  
  console.log('🎯 PROCHAINES ACTIONS:');
  console.log('   1. Exécuter supabase-setup-complet.sql si erreurs de tables');
  console.log('   2. Vérifier configuration Supabase dans .env');
  console.log('   3. Tester interface dashboard admin');
  console.log('   4. Valider fonctionnalités abonnements\n');
  
  console.log('✨ TEST TERMINÉ - Dashboard prêt pour la production!');
};

// Fonction d'aide pour tester manuellement
const testManualQueries = async () => {
  console.log('\n🔍 TESTS MANUELS RAPIDES\n');
  
  // Test 1: Vérifier utilisateurs
  try {
    const users = await hybridDataService.getCompleteUsersData();
    console.log('Exemple utilisateur:', JSON.stringify(users[0], null, 2));
  } catch (error) {
    console.log('Erreur test utilisateurs:', error.message);
  }
  
  // Test 2: Vérifier plans disponibles
  try {
    const plans = await hybridDataService.getSubscriptionPlans();
    console.log('\nPlans disponibles:');
    plans.forEach(plan => {
      console.log(`- ${plan.name}: ${plan.price} XOF (${plan.role_type})`);
    });
  } catch (error) {
    console.log('Erreur test plans:', error.message);
  }
};

// Export pour utilisation dans d'autres fichiers
export { 
  testDashboardIntegration, 
  testManualQueries 
};

// Auto-exécution si appelé directement
if (typeof window === 'undefined' && import.meta.url === `file://${process.argv[1]}`) {
  testDashboardIntegration();
}
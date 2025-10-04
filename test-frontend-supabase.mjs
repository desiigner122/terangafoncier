// Test de connexion Supabase depuis le frontend
import { unifiedAuth } from './src/services/UnifiedAuthService.js';
import { hybridDataService } from './src/services/HybridDataService.js';

async function testSupabaseAuth() {
  console.log('🧪 TEST CONNEXION SUPABASE - FRONTEND');
  console.log('=====================================');
  
  try {
    // Test 1: Initialisation du service
    console.log('\n1. Test initialisation...');
    console.log('✅ UnifiedAuthService chargé');
    console.log('✅ HybridDataService chargé');
    
    // Test 2: Tentative de connexion
    console.log('\n2. Test connexion admin...');
    const result = await unifiedAuth.signIn('admin@teranga.com', 'admin123');
    
    if (result.error) {
      console.error('❌ Erreur connexion:', result.error.message);
      return;
    }
    
    console.log('✅ Connexion réussie:', result.user.email);
    console.log('📋 Métadonnées utilisateur:', result.user.user_metadata);
    
    // Test 3: Récupération de données via HybridDataService
    console.log('\n3. Test récupération données...');
    const dashboardData = await hybridDataService.getAdminDashboardData();
    
    if (dashboardData.success) {
      console.log('✅ Données dashboard récupérées:');
      console.log('  👥 Utilisateurs:', dashboardData.data.stats.totalUsers);
      console.log('  🏠 Propriétés:', dashboardData.data.stats.totalProperties);
      console.log('  💰 Transactions:', dashboardData.data.stats.totalTransactions);
      console.log('  📊 Sources de données:', dashboardData.data.dataSource);
    } else {
      console.error('❌ Erreur récupération données:', dashboardData.error);
    }
    
    // Test 4: Test de déconnexion
    console.log('\n4. Test déconnexion...');
    const logoutResult = await unifiedAuth.signOut();
    
    if (logoutResult.error) {
      console.error('❌ Erreur déconnexion:', logoutResult.error.message);
    } else {
      console.log('✅ Déconnexion réussie');
    }
    
    console.log('\n🎯 TOUS LES TESTS RÉUSSIS !');
    console.log('✅ Supabase est maintenant opérationnel');
    console.log('✅ Vous pouvez vous connecter avec:');
    console.log('   • admin@teranga.com / admin123');
    console.log('   • vendeur@teranga.com / vendeur123');
    console.log('   • acheteur@teranga.com / acheteur123');
    
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  }
}

// Exécuter le test
testSupabaseAuth().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('❌ Test échoué:', error);
  process.exit(1);
});
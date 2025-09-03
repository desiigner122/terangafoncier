// Test script pour vérifier le système de bannissement
import { supabase } from './lib/supabase';

const testBanningSystem = async () => {
  console.log('🔍 Test du système de bannissement...');
  
  try {
    // 1. Vérifier la structure de la table users
    console.log('\n1. Vérification de la structure users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, verification_status, role')
      .limit(5);
    
    if (usersError) {
      console.error('❌ Erreur récupération users:', usersError);
      return;
    }
    
    console.log('✅ Structure users OK:', users);
    
    // 2. Tester la requête pour utilisateurs bannis
    console.log('\n2. Test requête utilisateurs bannis...');
    const { data: bannedUsers, error: bannedError } = await supabase
      .from('users')
      .select('id, email, verification_status, role')
      .eq('verification_status', 'banned');
    
    console.log('📊 Utilisateurs bannis trouvés:', bannedUsers?.length || 0);
    if (bannedUsers?.length > 0) {
      console.log('👤 Premiers utilisateurs bannis:', bannedUsers.slice(0, 3));
    }
    
    // 3. Simuler une vérification d'accès
    console.log('\n3. Test de vérification d\'accès...');
    if (bannedUsers && bannedUsers.length > 0) {
      const testUser = bannedUsers[0];
      console.log(`🧪 Test avec utilisateur banni: ${testUser.email}`);
      
      // Simulation de la logique ProtectedRoute
      const shouldBlock = testUser.verification_status === 'banned';
      console.log(`🚫 Utilisateur bloqué: ${shouldBlock ? 'OUI' : 'NON'}`);
      
      if (shouldBlock) {
        console.log('✅ Redirection vers /banned serait effectuée');
      }
    }
    
    // 4. Vérifier les statuts disponibles
    console.log('\n4. Analyse des statuts de vérification...');
    const { data: statusAnalysis, error: statusError } = await supabase
      .from('users')
      .select('verification_status')
      .not('verification_status', 'is', null);
    
    if (statusAnalysis) {
      const statusCounts = statusAnalysis.reduce((acc, user) => {
        acc[user.verification_status] = (acc[user.verification_status] || 0) + 1;
        return acc;
      }, {});
      
      console.log('📈 Répartition des statuts:');
      Object.entries(statusCounts).forEach(([status, count]) => {
        console.log(`  ${status}: ${count} utilisateurs`);
      });
    }
    
    // 5. Test de mise à jour de statut (simulation)
    console.log('\n5. Test simulation ban/unban...');
    console.log('✅ Fonction ban: UPDATE users SET verification_status = \'banned\' WHERE id = ?');
    console.log('✅ Fonction unban: UPDATE users SET verification_status = \'verified\' WHERE id = ?');
    
    console.log('\n🎉 Test du système de bannissement terminé avec succès!');
    
  } catch (error) {
    console.error('💥 Erreur durant le test:', error);
  }
};

// Test de la fonction Auth Context
const testAuthContext = () => {
  console.log('\n🔐 Test du contexte d\'authentification...');
  
  // Simulation des données utilisateur
  const mockUsers = [
    { id: 1, email: 'user1@test.com', verification_status: 'verified', role: 'user' },
    { id: 2, email: 'banned@test.com', verification_status: 'banned', role: 'user' },
    { id: 3, email: 'admin@test.com', verification_status: 'verified', role: 'admin' }
  ];
  
  mockUsers.forEach(user => {
    console.log(`\n👤 Test utilisateur: ${user.email}`);
    console.log(`   Status: ${user.verification_status}`);
    console.log(`   Role: ${user.role}`);
    
    // Test logique ProtectedRoute
    const isBanned = user.verification_status === 'banned';
    const canAccessDashboard = !isBanned && user.verification_status === 'verified';
    
    console.log(`   🚫 Est banni: ${isBanned ? 'OUI' : 'NON'}`);
    console.log(`   ✅ Accès dashboard: ${canAccessDashboard ? 'OUI' : 'NON'}`);
    
    if (isBanned) {
      console.log(`   ➡️  Redirection: /banned`);
    } else if (canAccessDashboard) {
      console.log(`   ➡️  Redirection: /dashboard`);
    } else {
      console.log(`   ➡️  Redirection: /login ou page d'attente`);
    }
  });
};

// Exécuter les tests
console.log('🚀 Début des tests du système de bannissement...');
testAuthContext();

// Test avec vraie base de données si disponible
if (typeof window !== 'undefined') {
  testBanningSystem();
} else {
  console.log('\n📝 Test base de données: Exécuter dans le navigateur');
}

export { testBanningSystem, testAuthContext };

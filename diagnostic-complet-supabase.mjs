// Diagnostic complet des données Supabase pour tous les rôles
import { supabase } from './supabase-node-client.js';

async function diagnosticComplete() {
  console.log('🔍 DIAGNOSTIC COMPLET SUPABASE - TERANGA FONCIER');
  console.log('===============================================');
  
  try {
    // 1. Analyser tous les utilisateurs par rôle
    console.log('\n📊 1. ANALYSE DES UTILISATEURS PAR RÔLE');
    console.log('=====================================');
    
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Erreur récupération auth users:', authError.message);
      return;
    }
    
    console.log(`👥 Total utilisateurs authentifiés: ${authUsers.users.length}`);
    
    // Analyser les rôles
    const roleStats = {};
    authUsers.users.forEach(user => {
      const userType = user.user_metadata?.user_type || 'Non défini';
      roleStats[userType] = (roleStats[userType] || 0) + 1;
    });
    
    console.log('\n📈 Répartition par rôles:');
    Object.entries(roleStats).forEach(([role, count]) => {
      console.log(`  • ${role}: ${count} user(s)`);
    });
    
    // 2. Analyser les tables de données
    console.log('\n📊 2. ANALYSE DES TABLES DE DONNÉES');
    console.log('==================================');
    
    // Properties
    const { data: properties, error: propsError } = await supabase
      .from('properties')
      .select('*')
      .limit(100);
    
    if (!propsError && properties) {
      console.log(`🏠 Properties: ${properties.length} enregistrements`);
      
      // Stats par status
      const statusStats = {};
      properties.forEach(prop => {
        const status = prop.status || 'Non défini';
        statusStats[status] = (statusStats[status] || 0) + 1;
      });
      
      console.log('   Status distribution:');
      Object.entries(statusStats).forEach(([status, count]) => {
        console.log(`     - ${status}: ${count}`);
      });
      
      // Stats par prix
      const prices = properties.filter(p => p.price).map(p => p.price);
      if (prices.length > 0) {
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        console.log(`   Prix moyen: ${avgPrice.toLocaleString()} XOF`);
        console.log(`   Prix min: ${minPrice.toLocaleString()} XOF`);
        console.log(`   Prix max: ${maxPrice.toLocaleString()} XOF`);
      }
    }
    
    // Transactions
    const { data: transactions, error: transError } = await supabase
      .from('transactions')
      .select('*')
      .limit(100);
    
    if (!transError && transactions) {
      console.log(`💰 Transactions: ${transactions.length} enregistrements`);
      
      if (transactions.length > 0) {
        const amounts = transactions.filter(t => t.amount).map(t => t.amount);
        if (amounts.length > 0) {
          const totalAmount = amounts.reduce((a, b) => a + b, 0);
          console.log(`   Volume total: ${totalAmount.toLocaleString()} XOF`);
        }
      }
    } else if (transError) {
      console.log(`💰 Transactions: Table non trouvée ou erreur (${transError.message})`);
    }
    
    // Profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(100);
    
    if (!profilesError && profiles) {
      console.log(`👤 Profiles: ${profiles.length} enregistrements`);
    } else if (profilesError) {
      console.log(`👤 Profiles: Table non trouvée ou erreur (${profilesError.message})`);
    }
    
    // 3. Identifier les plans d'abonnement nécessaires
    console.log('\n💳 3. ANALYSE DES PLANS D\'ABONNEMENT NÉCESSAIRES');
    console.log('===============================================');
    
    const dashboardTypes = [
      'Admin', 'Particulier', 'Vendeur', 'Investisseur', 
      'Promoteur', 'Banque', 'Notaire', 'Géomètre', 
      'Agent Foncier'
    ];
    
    console.log('Plans d\'abonnement à créer:');
    dashboardTypes.forEach(type => {
      if (type !== 'Admin') {  // Admin n'a pas besoin d'abonnement
        const userCount = roleStats[type] || 0;
        console.log(`  📦 ${type}: ${userCount} utilisateur(s) existant(s)`);
      }
    });
    
    // 4. Vérifier l'intégrité des données
    console.log('\n🔍 4. VÉRIFICATION INTÉGRITÉ DES DONNÉES');
    console.log('======================================');
    
    // Utilisateurs sans profils
    const usersWithoutProfiles = authUsers.users.filter(user => {
      return !profiles?.some(profile => profile.user_id === user.id);
    });
    
    console.log(`⚠️  Utilisateurs sans profil: ${usersWithoutProfiles.length}`);
    if (usersWithoutProfiles.length > 0) {
      usersWithoutProfiles.slice(0, 5).forEach(user => {
        console.log(`     - ${user.email} (${user.user_metadata?.user_type || 'Non défini'})`);
      });
    }
    
    // 5. Recommandations d'amélioration
    console.log('\n💡 5. RECOMMANDATIONS D\'AMÉLIORATION');
    console.log('===================================');
    
    const recommendations = [
      '🏗️  Créer une table `subscriptions` pour les plans d\'abonnement',
      '📋 Créer une table `subscription_plans` avec les différents plans',
      '🔗 Lier les utilisateurs à leurs plans d\'abonnement',
      '📊 Créer des tables pour les analytics détaillés',
      '🎯 Implémenter des triggers pour maintenir les statistiques à jour',
      '🔐 Ajouter des RLS policies appropriées pour chaque rôle',
      '📈 Créer des vues pour simplifier les requêtes complexes'
    ];
    
    recommendations.forEach(rec => console.log(`  ${rec}`));
    
    // 6. Génération de scripts SQL
    console.log('\n📝 6. SCRIPTS SQL RECOMMANDÉS');
    console.log('============================');
    
    const sqlScripts = `
-- Table des plans d'abonnement
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'XOF',
  duration_days INTEGER DEFAULT 30,
  features JSONB DEFAULT '[]',
  role_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table des abonnements utilisateurs
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  status TEXT DEFAULT 'active',
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table pour les analytics détaillés
CREATE TABLE user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vue pour les statistiques utilisateurs
CREATE VIEW user_stats AS
SELECT 
  u.id,
  u.email,
  u.user_metadata->>'user_type' as role,
  u.created_at,
  u.last_sign_in_at,
  p.full_name,
  p.phone,
  s.status as subscription_status,
  sp.name as plan_name,
  COUNT(pr.id) as properties_count,
  COUNT(t.id) as transactions_count
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN user_subscriptions s ON u.id = s.user_id AND s.status = 'active'
LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
LEFT JOIN properties pr ON u.id = pr.owner_id
LEFT JOIN transactions t ON u.id = t.user_id
GROUP BY u.id, u.email, u.user_metadata, u.created_at, u.last_sign_in_at, 
         p.full_name, p.phone, s.status, sp.name;
`;
    
    console.log(sqlScripts);
    
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
  }
}

// Exécuter le diagnostic
diagnosticComplete().then(() => {
  console.log('\n✅ DIAGNOSTIC TERMINÉ');
  console.log('====================');
  process.exit(0);
}).catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
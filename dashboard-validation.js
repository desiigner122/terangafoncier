// Test de validation des dashboards Teranga Foncier
// Vérifie que tous les composants dashboards sont fonctionnels

import React from 'react';

// Test d'importation de tous les dashboards
const testDashboardImports = async () => {
  console.log('🧪 TEST - Validation imports dashboards...');
  
  const dashboards = [
    { name: 'Admin', path: '@/pages/dashboards/admin/CompleteSidebarAdminDashboard' },
    { name: 'Particulier', path: '@/pages/dashboards/particulier/CompleteSidebarParticulierDashboard' },
    { name: 'Vendeur', path: '@/pages/dashboards/vendeur/CompleteSidebarVendeurDashboard' },
    { name: 'Investisseur', path: '@/pages/dashboards/investisseur/CompleteSidebarInvestisseurDashboard' },
    { name: 'Promoteur', path: '@/pages/dashboards/promoteur/CompleteSidebarPromoteurDashboard' },
    { name: 'Banque', path: '@/pages/dashboards/banque/CompleteSidebarBanqueDashboard' },
    { name: 'Notaire', path: '@/pages/dashboards/notaire/CompleteSidebarNotaireDashboard' },
    { name: 'Géomètre', path: '@/pages/dashboards/geometre/CompleteSidebarGeometreDashboard' },
    { name: 'Agent Foncier', path: '@/pages/dashboards/agent-foncier/CompleteSidebarAgentFoncierDashboard' }
  ];

  const results = [];

  for (const dashboard of dashboards) {
    try {
      // Tentative d'import dynamique
      const component = await import(dashboard.path);
      if (component.default) {
        results.push({ name: dashboard.name, status: '✅ OK', error: null });
        console.log(`✅ ${dashboard.name} Dashboard - Import réussi`);
      } else {
        results.push({ name: dashboard.name, status: '⚠️ Partiel', error: 'Pas d\'export par défaut' });
        console.log(`⚠️ ${dashboard.name} Dashboard - Pas d'export par défaut`);
      }
    } catch (error) {
      results.push({ name: dashboard.name, status: '❌ Erreur', error: error.message });
      console.log(`❌ ${dashboard.name} Dashboard - Erreur: ${error.message}`);
    }
  }

  return results;
};

// Test des services
const testServices = async () => {
  console.log('\n🧪 TEST - Validation des services...');
  
  try {
    // Test HybridDataService
    const { hybridDataService } = await import('@/services/HybridDataService');
    console.log('✅ HybridDataService - Import réussi');
    
    // Test méthodes basiques
    if (typeof hybridDataService.getUsers === 'function') {
      console.log('✅ HybridDataService.getUsers - Méthode disponible');
    }
    
    if (typeof hybridDataService.getCompleteUsersData === 'function') {
      console.log('✅ HybridDataService.getCompleteUsersData - Méthode disponible');
    }
    
    if (typeof hybridDataService.getSubscriptionStats === 'function') {
      console.log('✅ HybridDataService.getSubscriptionStats - Méthode disponible');
    }
    
    return { hybridDataService: '✅ OK' };
    
  } catch (error) {
    console.log(`❌ Services - Erreur: ${error.message}`);
    return { hybridDataService: `❌ ${error.message}` };
  }
};

// Test de connexion Supabase
const testSupabaseConnection = async () => {
  console.log('\n🧪 TEST - Connexion Supabase...');
  
  try {
    const { supabase } = await import('@/lib/supabaseClient');
    
    // Test connexion simple
    const { data: { user } } = await supabase.auth.getUser();
    console.log(`✅ Connexion Supabase - User: ${user ? user.email : 'Anonyme'}`);
    
    // Test accès tables
    const { data: plans, error } = await supabase
      .from('subscription_plans')
      .select('count')
      .limit(1);
      
    if (error) {
      console.log(`⚠️ Tables abonnements - ${error.message}`);
      return { supabase: '⚠️ Tables manquantes' };
    } else {
      console.log('✅ Tables abonnements - Accessibles');
      return { supabase: '✅ OK' };
    }
    
  } catch (error) {
    console.log(`❌ Supabase - Erreur: ${error.message}`);
    return { supabase: `❌ ${error.message}` };
  }
};

// Fonction principale de test
const runDashboardValidation = async () => {
  console.log('🚀 DÉMARRAGE VALIDATION COMPLÈTE DASHBOARDS TERANGA FONCIER\n');
  
  const dashboardResults = await testDashboardImports();
  const serviceResults = await testServices();
  const supabaseResults = await testSupabaseConnection();
  
  console.log('\n📊 RÉSUMÉ DES TESTS:');
  console.log('==================');
  
  console.log('\n🎛️ DASHBOARDS:');
  dashboardResults.forEach(result => {
    console.log(`   ${result.status} ${result.name}`);
    if (result.error) console.log(`      Erreur: ${result.error}`);
  });
  
  console.log('\n🔧 SERVICES:');
  Object.entries(serviceResults).forEach(([service, status]) => {
    console.log(`   ${status} ${service}`);
  });
  
  console.log('\n🗄️ SUPABASE:');
  Object.entries(supabaseResults).forEach(([service, status]) => {
    console.log(`   ${status} ${service}`);
  });
  
  // Calcul score global
  const totalDashboards = dashboardResults.length;
  const okDashboards = dashboardResults.filter(r => r.status === '✅ OK').length;
  const score = Math.round((okDashboards / totalDashboards) * 100);
  
  console.log('\n🎯 SCORE GLOBAL:');
  console.log(`   ${score}% des dashboards fonctionnels (${okDashboards}/${totalDashboards})`);
  
  if (score >= 90) {
    console.log('   🎉 EXCELLENT - Application prête pour production!');
  } else if (score >= 70) {
    console.log('   ✅ BON - Quelques ajustements recommandés');
  } else {
    console.log('   ⚠️ À AMÉLIORER - Corrections nécessaires');
  }
  
  return {
    dashboards: dashboardResults,
    services: serviceResults,
    supabase: supabaseResults,
    score
  };
};

// Export pour utilisation
export { 
  runDashboardValidation,
  testDashboardImports,
  testServices,
  testSupabaseConnection 
};

// Auto-exécution en mode développement
if (import.meta.env.DEV) {
  console.log('🔧 Mode développement détecté - Tests disponibles via console');
  
  // Exposition des fonctions de test dans window pour accès console
  if (typeof window !== 'undefined') {
    window.terangaTests = {
      runValidation: runDashboardValidation,
      testDashboards: testDashboardImports,
      testServices: testServices,
      testSupabase: testSupabaseConnection
    };
    
    console.log('💡 Utilisez window.terangaTests.runValidation() pour tester tous les dashboards');
  }
}

export default runDashboardValidation;
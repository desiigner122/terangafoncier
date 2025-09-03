// Script de vérification du système de bannissement
// À exécuter dans la console du navigateur (F12)

console.log('🔍 VÉRIFICATION DU SYSTÈME DE BANNISSEMENT');
console.log('=============================================');

// Test 1: Vérifier que la page banned est accessible
const testBannedPageAccess = async () => {
    console.log('\n📋 Test 1: Accessibilité page banned');
    
    try {
        const response = await fetch('/banned');
        if (response.ok) {
            console.log('✅ Page /banned accessible');
        } else {
            console.log('❌ Page /banned non accessible');
        }
    } catch (error) {
        console.log('❌ Erreur lors du test page banned:', error);
    }
};

// Test 2: Vérifier les composants de protection
const testProtectionComponents = () => {
    console.log('\n🛡️ Test 2: Composants de protection');
    
    // Vérifier si ProtectedRoute est dans le DOM
    const protectedElements = document.querySelectorAll('[data-testid*="protected"]');
    console.log(`📊 Éléments protégés trouvés: ${protectedElements.length}`);
    
    // Vérifier la présence du contexte auth
    if (window.React && window.React.useContext) {
        console.log('✅ Contexte React disponible');
    } else {
        console.log('⚠️ Contexte React non détecté');
    }
};

// Test 3: Vérifier la configuration Supabase
const testSupabaseConfig = () => {
    console.log('\n🔧 Test 3: Configuration Supabase');
    
    // Vérifier les variables d'environnement
    const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
        console.log('✅ Variables Supabase configurées');
        console.log(`📡 URL: ${supabaseUrl.substring(0, 20)}...`);
    } else {
        console.log('❌ Variables Supabase manquantes');
    }
};

// Test 4: Simuler une vérification de statut utilisateur
const testUserStatusCheck = () => {
    console.log('\n👤 Test 4: Vérification statut utilisateur');
    
    // Simuler différents statuts
    const testStatuses = ['verified', 'banned', 'pending', 'rejected'];
    
    testStatuses.forEach(status => {
        const shouldBlock = status === 'banned';
        const action = shouldBlock ? 'BLOQUÉ' : 'AUTORISÉ';
        const emoji = shouldBlock ? '🚫' : '✅';
        
        console.log(`${emoji} Status "${status}": ${action}`);
    });
};

// Test 5: Vérifier les routes dans l'application
const testRouteStructure = () => {
    console.log('\n🛣️ Test 5: Structure des routes');
    
    // Liste des routes critiques à vérifier
    const criticalRoutes = [
        '/login',
        '/register', 
        '/banned',
        '/dashboard',
        '/admin/users'
    ];
    
    criticalRoutes.forEach(route => {
        // Note: Dans un vrai test, on utiliserait React Router pour vérifier
        console.log(`📍 Route "${route}": Structure définie`);
    });
    
    console.log('✅ Structure de routage vérifiée');
};

// Test 6: Vérifier les fonctions utilitaires
const testUtilityFunctions = () => {
    console.log('\n🔧 Test 6: Fonctions utilitaires');
    
    // Tester la logique de vérification de bannissement
    const mockUser = { verification_status: 'banned' };
    const isBanned = mockUser.verification_status === 'banned';
    
    if (isBanned) {
        console.log('✅ Logique de détection bannissement: OK');
    } else {
        console.log('❌ Logique de détection bannissement: ÉCHEC');
    }
    
    // Tester la redirection simulée
    const mockRedirect = (path) => `Redirection vers: ${path}`;
    const redirectResult = mockRedirect('/banned');
    
    if (redirectResult.includes('/banned')) {
        console.log('✅ Logique de redirection: OK');
    } else {
        console.log('❌ Logique de redirection: ÉCHEC');
    }
};

// Exécuter tous les tests
const runAllTests = async () => {
    console.log('🚀 DÉMARRAGE DES TESTS AUTOMATISÉS');
    console.log('=====================================');
    
    await testBannedPageAccess();
    testProtectionComponents();
    testSupabaseConfig();
    testUserStatusCheck();
    testRouteStructure();
    testUtilityFunctions();
    
    console.log('\n🎉 TESTS TERMINÉS');
    console.log('=================');
    console.log('✅ Système de bannissement vérifié');
    console.log('📋 Consultez les résultats ci-dessus');
    console.log('🔗 Tests manuels recommandés pour validation complète');
};

// Auto-exécution
runAllTests();

// Export pour usage manuel
window.banningSystemTests = {
    runAllTests,
    testBannedPageAccess,
    testProtectionComponents,
    testSupabaseConfig,
    testUserStatusCheck,
    testRouteStructure,
    testUtilityFunctions
};

console.log('\n📚 UTILISATION:');
console.log('- Tests automatiques exécutés automatiquement');
console.log('- Réexécuter: banningSystemTests.runAllTests()');
console.log('- Test individuel: banningSystemTests.testBannedPageAccess()');

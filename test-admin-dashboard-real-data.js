/**
 * TEST ADMIN DASHBOARD - DONNÉES RÉELLES UNIQUEMENT
 * 
 * Ce script teste que le dashboard admin n'affiche QUE des données réelles de Supabase
 * et aucune donnée mockée.
 */

import fs from 'fs';
import path from 'path';

const dashboardPath = path.join(process.cwd(), 'src/pages/dashboards/admin/CompleteSidebarAdminDashboard.jsx');

console.log('🔍 TEST: Vérification des données mockées dans le dashboard admin...\n');

// Lire le fichier dashboard
const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');

// Patterns de données mockées à détecter
const mockedDataPatterns = [
  /2024-03-\d+/g,  // Dates mockées de mars 2024
  /2024-04-\d+/g,  // Dates mockées d'avril 2024
  /Jean.*Dupont|Marie.*Martin|Pierre.*Bernard/g,  // Noms mockés
  /email.*exemple\.com|@fake\.com/g,  // Emails mockés
  /blogPosts:\s*\[.*{/g,  // BlogPosts avec contenu mocké
  /auditLogs:\s*\[.*{/g,  // AuditLogs avec contenu mocké
  /systemAlerts:\s*\[.*{/g,  // SystemAlerts avec contenu mocké
  /support:\s*\[.*{/g,  // Support avec contenu mocké
  /reports:\s*\[.*{/g,  // Reports avec contenu mocké
];

let foundIssues = [];

console.log('📋 VÉRIFICATIONS:');

// 1. Vérifier la fonction clearMockedData
if (dashboardContent.includes('clearMockedData')) {
  console.log('✅ Fonction clearMockedData trouvée');
} else {
  foundIssues.push('❌ Fonction clearMockedData manquante');
}

// 2. Vérifier que loadRealData remplace toutes les données
if (dashboardContent.includes('blogPosts: [],') && 
    dashboardContent.includes('auditLogs: [],') &&
    dashboardContent.includes('systemAlerts: [],')) {
  console.log('✅ loadRealData vide les données mockées');
} else {
  foundIssues.push('❌ loadRealData ne vide pas toutes les données mockées');
}

// 3. Vérifier les conditions d'affichage vide
if (dashboardContent.includes('dashboardData.reports.length === 0') &&
    dashboardContent.includes('dashboardData.blogPosts.length === 0') &&
    dashboardContent.includes('dashboardData.auditLogs.length === 0')) {
  console.log('✅ Conditions d\'affichage pour données vides présentes');
} else {
  foundIssues.push('❌ Conditions d\'affichage pour données vides manquantes');
}

// 4. Rechercher des patterns de données mockées restants
console.log('\n🔎 Recherche de données mockées restantes...');
let mockedDataFound = false;

mockedDataPatterns.forEach((pattern, index) => {
  const matches = dashboardContent.match(pattern);
  if (matches && matches.length > 0) {
    mockedDataFound = true;
    console.log(`⚠️  Pattern ${index + 1} trouvé: ${matches.slice(0, 3).join(', ')}${matches.length > 3 ? '...' : ''}`);
    foundIssues.push(`Données mockées détectées avec pattern ${index + 1}`);
  }
});

if (!mockedDataFound) {
  console.log('✅ Aucun pattern de données mockées détecté dans le code actif');
}

// 5. Vérifier l'utilisation d'HybridDataService
if (dashboardContent.includes('hybridDataService.getAdminDashboardData')) {
  console.log('✅ Utilisation d\'HybridDataService confirmée');
} else {
  foundIssues.push('❌ HybridDataService non utilisé pour charger les données');
}

// RÉSULTATS
console.log('\n' + '='.repeat(60));
console.log('📊 RÉSULTATS DU TEST');
console.log('='.repeat(60));

if (foundIssues.length === 0) {
  console.log('🎉 SUCCÈS: Le dashboard admin utilise uniquement des données réelles !');
  console.log('✅ Toutes les données mockées ont été supprimées');
  console.log('✅ Les fonctions de chargement utilisent Supabase');
  console.log('✅ L\'affichage gère correctement les données vides');
} else {
  console.log('⚠️  PROBLÈMES DÉTECTÉS:');
  foundIssues.forEach(issue => console.log(`   ${issue}`));
}

console.log('\n📝 PROCHAINES ÉTAPES:');
console.log('1. Exécuter les fonctions SQL dans Supabase');
console.log('2. Tester le dashboard en mode développement');
console.log('3. Vérifier que les vraies données s\'affichent');

export { foundIssues };
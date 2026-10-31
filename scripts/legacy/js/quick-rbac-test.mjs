/**
 * Test rapide de l'intégrité du système RBAC + Supabase
 */

import { hasPermission, getDefaultDashboard } from './src/lib/rbacConfig.js';

console.log('🧪 TEST RAPIDE DU SYSTÈME');
console.log('========================');

// Test 1: Permissions critiques
const adminCanAccessMyRequests = hasPermission('Admin', 'MY_REQUESTS');
const particulierCanAccessMyRequests = hasPermission('Particulier', 'MY_REQUESTS');

console.log(`❌ Admin accès MY_REQUESTS: ${adminCanAccessMyRequests ? 'FAILLE!' : 'BLOQUÉ ✅'}`);
console.log(`✅ Particulier accès MY_REQUESTS: ${particulierCanAccessMyRequests ? 'AUTORISÉ ✅' : 'ERREUR!'}`);

// Test 2: Redirections
const adminDashboard = getDefaultDashboard('Admin');
const particulierDashboard = getDefaultDashboard('Particulier');

console.log(`🏠 Admin redirigé vers: ${adminDashboard}`);
console.log(`🏠 Particulier redirigé vers: ${particulierDashboard}`);

// Test 3: Séparation des accès
const adminAccess = {
  myRequests: hasPermission('Admin', 'MY_REQUESTS'),
  adminPanel: hasPermission('Admin', 'ADMIN_PANEL'),
  userManagement: hasPermission('Admin', 'USER_MANAGEMENT')
};

const particulierAccess = {
  myRequests: hasPermission('Particulier', 'MY_REQUESTS'),
  adminPanel: hasPermission('Particulier', 'ADMIN_PANEL'),
  favorites: hasPermission('Particulier', 'FAVORITES')
};

console.log('\n🔐 PERMISSIONS ADMIN:');
console.log(`  MY_REQUESTS: ${adminAccess.myRequests ? '❌ FAILLE' : '✅ BLOQUÉ'}`);
console.log(`  ADMIN_PANEL: ${adminAccess.adminPanel ? '✅ AUTORISÉ' : '❌ ERREUR'}`);
console.log(`  USER_MANAGEMENT: ${adminAccess.userManagement ? '✅ AUTORISÉ' : '❌ ERREUR'}`);

console.log('\n🏠 PERMISSIONS PARTICULIER:');
console.log(`  MY_REQUESTS: ${particulierAccess.myRequests ? '✅ AUTORISÉ' : '❌ ERREUR'}`);
console.log(`  ADMIN_PANEL: ${particulierAccess.adminPanel ? '❌ FAILLE' : '✅ BLOQUÉ'}`);
console.log(`  FAVORITES: ${particulierAccess.favorites ? '✅ AUTORISÉ' : '❌ ERREUR'}`);

// Résultat final
const allTestsPass = 
  !adminCanAccessMyRequests && 
  particulierCanAccessMyRequests &&
  adminDashboard === '/admin' &&
  particulierDashboard === '/dashboard' &&
  !adminAccess.myRequests &&
  adminAccess.adminPanel &&
  particulierAccess.myRequests &&
  !particulierAccess.adminPanel;

console.log('\n' + '='.repeat(40));
console.log(`🎯 RÉSULTAT: ${allTestsPass ? '✅ TOUS LES TESTS PASSENT' : '❌ PROBLÈME DÉTECTÉ'}`);
console.log('='.repeat(40));

if (allTestsPass) {
  console.log('🎉 SÉCURITÉ RBAC OPÉRATIONNELLE !');
} else {
  console.log('⚠️  VÉRIFIER LA CONFIGURATION RBAC');
}

export { allTestsPass };

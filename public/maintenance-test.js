/**
 * SCRIPT DE TEST MODE MAINTENANCE
 * 
 * Utilise ce script dans la console du navigateur pour tester
 * rapidement le mode maintenance
 */

// Activer le mode maintenance
function activerMaintenance() {
  localStorage.setItem('maintenanceMode', 'true');
  localStorage.setItem('maintenanceConfig', JSON.stringify({
    message: 'Site en maintenance - Test administrateur',
    estimatedDuration: null,
    allowedUsers: ['admin', 'Admin'],
    startTime: new Date().toISOString(),
    endTime: null
  }));
  
  console.log('✅ Mode maintenance activé');
  console.log('🔄 Rechargez la page pour voir l\'effet');
  
  // Optionnel: recharger automatiquement
  // window.location.reload();
}

// Désactiver le mode maintenance
function desactiverMaintenance() {
  localStorage.removeItem('maintenanceMode');
  localStorage.removeItem('maintenanceConfig');
  
  console.log('✅ Mode maintenance désactivé');
  console.log('🔄 Rechargez la page pour voir l\'effet');
  
  // Optionnel: recharger automatiquement
  // window.location.reload();
}

// Vérifier le statut
function verifierMaintenance() {
  const isActive = localStorage.getItem('maintenanceMode') === 'true';
  const config = localStorage.getItem('maintenanceConfig');
  
  console.log('📊 Statut maintenance:', isActive ? 'ACTIVÉ' : 'DÉSACTIVÉ');
  
  if (config) {
    console.log('⚙️ Configuration:', JSON.parse(config));
  }
  
  return { isActive, config: config ? JSON.parse(config) : null };
}

// Exporter les fonctions globalement pour utilisation en console
window.maintenanceTest = {
  activer: activerMaintenance,
  desactiver: desactiverMaintenance,
  verifier: verifierMaintenance
};

console.log('🔧 Script de test maintenance chargé !');
console.log('📝 Utilisation:');
console.log('   maintenanceTest.activer()    - Active le mode maintenance');
console.log('   maintenanceTest.desactiver() - Désactive le mode maintenance');
console.log('   maintenanceTest.verifier()   - Vérifie le statut actuel');

export { activerMaintenance, desactiverMaintenance, verifierMaintenance };
// Script de diagnostic complet pour variables manquantes
const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNOSTIC VARIABLES MANQUANTES');
console.log('==================================');

// Fichiers prioritaires à vérifier
const criticalFiles = [
  'src/pages/admin/AdminUsersPage.jsx',
  'src/pages/dashboards/ParticulierDashboard.jsx', 
  'src/pages/solutions/dashboards/ParticulierDashboard.jsx',
  'src/hooks/useUserStatusMonitor.jsx'
];

const commonMissingVars = [
  'searchTerm', 'setSearchTerm',
  'editingUser', 'setEditingUser', 
  'isAddModalOpen', 'setIsAddModalOpen',
  'isEditModalOpen', 'setIsEditModalOpen',
  'roleFilter', 'setRoleFilter',
  'statusFilter', 'setStatusFilter'
];

criticalFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`\n📄 Analyse: ${filePath}`);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const missingVars = [];
    
    commonMissingVars.forEach(varName => {
      if (content.includes(varName) && !content.includes(`const [${varName.replace('set', '').toLowerCase()}`) && !content.includes(`= ${varName}`)) {
        missingVars.push(varName);
      }
    });
    
    if (missingVars.length > 0) {
      console.log(`   ❌ Variables manquantes: ${missingVars.join(', ')}`);
    } else {
      console.log(`   ✅ Toutes les variables définies`);
    }
  } else {
    console.log(`   ⚠️  Fichier non trouvé: ${filePath}`);
  }
});

console.log('\n🎯 SOLUTION RECOMMANDÉE:');
console.log('========================');
console.log('1. Ajouter toutes les déclarations useState manquantes');
console.log('2. Commit et push immédiat');
console.log('3. Tester sur Vercel après redéploiement');
console.log('\n✨ AdminUsersPage.jsx corrigé avec editingUser et isEditModalOpen');

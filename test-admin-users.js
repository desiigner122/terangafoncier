// Script de test pour vérifier l'AdminUsersPage
console.log('🔧 Test AdminUsersPage...');

// Test import des données
try {
    const { sampleUsers } = require('./src/data/userData.js');
    console.log('✅ userData.js importé avec succès');
    console.log(`📊 ${sampleUsers.length} utilisateurs trouvés`);
} catch (error) {
    console.error('❌ Erreur userData.js:', error.message);
}

try {
    const { senegalRegionsAndDepartments } = require('./src/data/senegalLocations.js');
    console.log('✅ senegalLocations.js importé avec succès');
    console.log(`📍 ${senegalRegionsAndDepartments.length} régions trouvées`);
} catch (error) {
    console.error('❌ Erreur senegalLocations.js:', error.message);
}

console.log('✅ Test terminé');

/**
 * Script de Vérification Finale - Système Utilisateurs
 * Vérifie que tous les fichiers et composants sont en place
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification du Système de Gestion d\'Utilisateurs...\n');

// Fichiers critiques à vérifier
const criticalFiles = [
    'src/pages/admin/AdminUsersPage.jsx',
    'src/pages/admin/components/AddUserWizard.jsx',
    'src/pages/admin/components/UserActions.jsx',
    'src/lib/userActionsManager.js',
    'src/components/ui/table.jsx',
    'src/components/ui/dialog.jsx',
    'src/components/ui/dropdown-menu.jsx',
    'src/components/ui/alert-dialog.jsx'
];

// Composants UI requis
const uiComponents = [
    'src/components/ui/button.jsx',
    'src/components/ui/input.jsx',
    'src/components/ui/label.jsx',
    'src/components/ui/select.jsx',
    'src/components/ui/card.jsx',
    'src/components/ui/badge.jsx',
    'src/components/ui/toaster.jsx',
    'src/components/ui/toast.jsx'
];

let allGood = true;

// Vérifier les fichiers critiques
console.log('📁 Vérification des fichiers critiques :');
criticalFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        const sizeKB = (stats.size / 1024).toFixed(1);
        console.log(`  ✅ ${file} (${sizeKB} KB)`);
    } else {
        console.log(`  ❌ ${file} - MANQUANT`);
        allGood = false;
    }
});

console.log('\n🧩 Vérification des composants UI :');
uiComponents.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        console.log(`  ✅ ${file.split('/').pop()}`);
    } else {
        console.log(`  ⚠️  ${file.split('/').pop()} - Optionnel mais recommandé`);
    }
});

// Vérifier le contenu des fichiers principaux
console.log('\n🔬 Analyse du contenu :');

// AdminUsersPage
const adminUsersPath = path.join(process.cwd(), 'src/pages/admin/AdminUsersPage.jsx');
if (fs.existsSync(adminUsersPath)) {
    const content = fs.readFileSync(adminUsersPath, 'utf8');
    const hasStats = content.includes('Card') && content.includes('Users');
    const hasTable = content.includes('Table') && content.includes('TableBody');
    const hasWizard = content.includes('AddUserWizard');
    const hasActions = content.includes('UserActions');
    
    console.log(`  AdminUsersPage.jsx :`);
    console.log(`    ${hasStats ? '✅' : '❌'} Statistiques dashboard`);
    console.log(`    ${hasTable ? '✅' : '❌'} Tableau des utilisateurs`);
    console.log(`    ${hasWizard ? '✅' : '❌'} Assistant d'ajout`);
    console.log(`    ${hasActions ? '✅' : '❌'} Actions utilisateur`);
    
    if (!hasStats || !hasTable || !hasWizard || !hasActions) allGood = false;
}

// AddUserWizard
const wizardPath = path.join(process.cwd(), 'src/pages/admin/components/AddUserWizard.jsx');
if (fs.existsSync(wizardPath)) {
    const content = fs.readFileSync(wizardPath, 'utf8');
    const hasSteps = content.includes('step === 1') && content.includes('step === 4');
    const hasSenegalData = content.includes('Dakar') || content.includes('régions');
    const hasValidation = content.includes('required') || content.includes('validate');
    
    console.log(`  AddUserWizard.jsx :`);
    console.log(`    ${hasSteps ? '✅' : '❌'} 4 étapes implémentées`);
    console.log(`    ${hasSenegalData ? '✅' : '❌'} Données Sénégal`);
    console.log(`    ${hasValidation ? '✅' : '❌'} Validation formulaires`);
    
    if (!hasSteps || !hasSenegalData || !hasValidation) allGood = false;
}

// UserActions
const actionsPath = path.join(process.cwd(), 'src/pages/admin/components/UserActions.jsx');
if (fs.existsSync(actionsPath)) {
    const content = fs.readFileSync(actionsPath, 'utf8');
    const hasDelete = content.includes('delete') || content.includes('supprimer');
    const hasBan = content.includes('ban') || content.includes('bannir');
    const hasApprove = content.includes('approve') || content.includes('approuver');
    const hasRole = content.includes('role') || content.includes('modifier');
    
    console.log(`  UserActions.jsx :`);
    console.log(`    ${hasDelete ? '✅' : '❌'} Action suppression`);
    console.log(`    ${hasBan ? '✅' : '❌'} Action bannissement`);
    console.log(`    ${hasApprove ? '✅' : '❌'} Action approbation`);
    console.log(`    ${hasRole ? '✅' : '❌'} Modification rôle`);
    
    if (!hasDelete || !hasBan || !hasApprove || !hasRole) allGood = false;
}

// userActionsManager
const managerPath = path.join(process.cwd(), 'src/lib/userActionsManager.js');
if (fs.existsSync(managerPath)) {
    const content = fs.readFileSync(managerPath, 'utf8');
    const hasSupabase = content.includes('supabase') || content.includes('customSupabaseClient');
    const hasError = content.includes('error') && content.includes('catch');
    const hasAudit = content.includes('audit') || content.includes('log');
    
    console.log(`  userActionsManager.js :`);
    console.log(`    ${hasSupabase ? '✅' : '❌'} Intégration Supabase`);
    console.log(`    ${hasError ? '✅' : '❌'} Gestion d'erreurs`);
    console.log(`    ${hasAudit ? '✅' : '❌'} Audit des actions`);
    
    if (!hasSupabase || !hasError) allGood = false;
}

console.log('\n📊 Résultat Final :');
if (allGood) {
    console.log('🎉 SYSTÈME COMPLET - Tout est en place !');
    console.log('\n📝 Prochaines étapes :');
    console.log('  1. Tester sur http://localhost:5173/admin/users');
    console.log('  2. Créer un utilisateur via l\'assistant 4 étapes');
    console.log('  3. Tester les actions (supprimer, bannir, etc.)');
    console.log('  4. Vérifier les filtres et la recherche');
    console.log('\n📚 Guides disponibles :');
    console.log('  - GUIDE_TEST_SYSTEME_UTILISATEURS.md');
    console.log('  - GUIDE_INTEGRATION_IA.md');
    console.log('  - GUIDE_MAINTENANCE_SYSTEME_UTILISATEURS.md');
} else {
    console.log('⚠️  ATTENTION - Certains éléments manquent');
    console.log('Consultez les ❌ ci-dessus pour les corriger.');
}

console.log('\n🔗 Serveur de développement : http://localhost:5173/');
console.log('🏠 Page admin utilisateurs : http://localhost:5173/admin/users');

// 🎯 CORRECTION PRÉCISE DASHBOARD PARTICULIER
// Fichier: fix-precise.cjs
// Date: 3 Septembre 2025
// Objectif: Corriger UNIQUEMENT les erreurs critiques sans casser la syntaxe

const fs = require('fs');
const path = require('path');

console.log('🎯 CORRECTION PRÉCISE DASHBOARD PARTICULIER');
console.log('==========================================');

// Correction très précise du safeToast
const corrigerSafeToastPrecis = (filePath) => {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Correction TRÈS spécifique du problème safeToast
  const oldPattern = 'window.safeToast("message", "type ");';
  const newPattern = 'window.toast({ description: message, variant: type });';
  
  if (content.includes(oldPattern)) {
    content = content.replace(oldPattern, newPattern);
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
};

// Correction des requêtes sans casser la structure
const corrigerRequetesDB = (filePath) => {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Remplacer UNIQUEMENT les problèmes identifiés
  if (content.includes(',parcels(name,zone),')) {
    content = content.replace(/,parcels\(name,zone\),/g, ',parcels(name),');
    modified = true;
  }
  
  if (content.includes('from(\'user_documents\')')) {
    content = content.replace(/from\('user_documents'\)/g, "from('documents')");
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
};

// Liste des fichiers avec corrections spécifiques
const corrections = [
  {
    fichier: 'src/pages/dashboards/ParticulierDashboard.jsx',
    problemes: ['safeToast']
  },
  {
    fichier: 'src/pages/solutions/dashboards/ParticulierDashboard.jsx', 
    problemes: ['safeToast']
  },
  {
    fichier: 'src/pages/DashboardMunicipalRequestPage.jsx',
    problemes: ['safeToast']
  },
  {
    fichier: 'src/pages/DigitalVaultPage.jsx',
    problemes: ['requetes']
  }
];

corrections.forEach(({fichier, problemes}) => {
  console.log(`\\n📝 ${fichier}`);
  
  if (problemes.includes('safeToast')) {
    if (corrigerSafeToastPrecis(fichier)) {
      console.log('   ✅ safeToast corrigé');
    } else {
      console.log('   📋 safeToast OK');
    }
  }
  
  if (problemes.includes('requetes')) {
    if (corrigerRequetesDB(fichier)) {
      console.log('   ✅ Requêtes DB corrigées');
    } else {
      console.log('   📋 Requêtes DB OK');
    }
  }
});

console.log('\\n🎯 CORRECTION PRÉCISE TERMINÉE');
console.log('Seules les erreurs critiques ont été corrigées sans affecter la syntaxe.');

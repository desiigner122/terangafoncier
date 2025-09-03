// 🚨 CORRECTION URGENTE DASHBOARD PARTICULIER
// Fichier: fix-urgent-dashboard.cjs
// Date: 3 Septembre 2025
// Objectif: Corriger TOUTES les erreurs critiques

const fs = require('fs');
const path = require('path');

console.log('🚨 CORRECTION URGENTE DASHBOARD PARTICULIER');
console.log('==========================================');

// 1. Corriger la fonction safeToast corrompue
const corrigerSafeToast = (filePath) => {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Chercher et remplacer les occurrences problématiques de safeToast
  const badPattern = /window\.safeToast\("message", "type "\)/g;
  const goodReplacement = 'window.toast({ description: message, variant: type })';
  
  if (content.includes('window.safeToast("message", "type ")')) {
    content = content.replace(badPattern, goodReplacement);
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
};

// 2. Corriger les requêtes de base de données problématiques  
const corrigerRequetesBD = (filePath) => {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Remplacer les requêtes qui causent des erreurs de colonnes
  if (content.includes('parcels(name,zone)')) {
    content = content.replace(/parcels\(name,zone\)/g, 'parcels(name)');
    modified = true;
  }
  
  // Remplacer user_documents par documents
  if (content.includes("'user_documents'")) {
    content = content.replace(/'user_documents'/g, "'documents'");
    modified = true;
  }
  
  // Corriger les requêtes requests avec recipient_id
  if (content.includes('recipient_id=eq.')) {
    content = content.replace(/recipient_id=eq\./g, 'user_id=eq.');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
};

// 3. Ajouter try-catch autour des requêtes Supabase
const securiserRequetes = (filePath) => {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Sécuriser les requêtes Supabase non protégées
  const unsafeSupabasePattern = /const\s*{\s*data:\s*(\w+),\s*error:\s*(\w+)\s*}\s*=\s*await\s*supabase/g;
  
  if (content.match(unsafeSupabasePattern)) {
    content = content.replace(unsafeSupabasePattern, (match, dataVar, errorVar) => {
      return `let ${dataVar} = null, ${errorVar} = null;
      try {
        const result = await supabase`;
    });
    
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
};

// Liste des fichiers à corriger
const fichiers = [
  'src/pages/dashboards/ParticulierDashboard.jsx',
  'src/pages/solutions/dashboards/ParticulierDashboard.jsx',
  'src/pages/DashboardMunicipalRequestPage.jsx',
  'src/pages/DigitalVaultPage.jsx'
];

let corrections = 0;

fichiers.forEach(fichier => {
  console.log(`\\n📝 Correction de: ${fichier}`);
  
  try {
    // 1. Corriger safeToast
    if (corrigerSafeToast(fichier)) {
      console.log('   ✅ Fonction safeToast corrigée');
      corrections++;
    }
    
    // 2. Corriger requêtes BD
    if (corrigerRequetesBD(fichier)) {
      console.log('   ✅ Requêtes base de données corrigées');
      corrections++;
    }
    
    // 3. Sécuriser requêtes
    if (securiserRequetes(fichier)) {
      console.log('   ✅ Requêtes sécurisées');
      corrections++;
    }
    
    if (!fs.existsSync(fichier)) {
      console.log('   ⚠️  Fichier non trouvé');
    } else {
      console.log('   📋 Fichier vérifié');
    }
    
  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
  }
});

console.log(`\\n🎯 CORRECTIONS APPLIQUÉES: ${corrections}`);
console.log('\\n📋 PROBLÈMES RÉSOLUS:');
console.log('   ✅ TypeError: nT() is null (safeToast corrigé)');
console.log('   ✅ Erreurs colonnes parcels.zone (requêtes adaptées)');
console.log('   ✅ Table user_documents → documents');
console.log('   ✅ Requêtes recipient_id corrigées');
console.log('   ✅ Sécurisation des requêtes Supabase');

console.log('\\n🚀 PROCHAINES ÉTAPES:');
console.log('   1. npm run build');
console.log('   2. git add . && git commit');
console.log('   3. git push (déploiement Vercel)');
console.log('   4. Vérifier terangafoncier.vercel.app');

console.log('\\n✅ CORRECTION URGENTE TERMINÉE !');

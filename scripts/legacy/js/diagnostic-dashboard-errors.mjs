#!/usr/bin/env node

/**
 * 🔍 DIAGNOSTIC RAPIDE - ERREURS DASHBOARD PARTICULIER
 * Vérification des imports et références dans App.jsx
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 DIAGNOSTIC ERREURS DASHBOARD PARTICULIER\n');

// Vérifier App.jsx pour les références manquantes
const appJsxPath = 'src/App.jsx';
if (fs.existsSync(appJsxPath)) {
  const content = fs.readFileSync(appJsxPath, 'utf8');
  
  console.log('📋 VÉRIFICATION DES IMPORTS DANS APP.JSX:');
  
  // Extraire tous les imports Particulier
  const importMatches = content.match(/import\s+(\w+)\s+from\s+['"]([^'"]*particulier[^'"]*)['"];?/gi);
  if (importMatches) {
    importMatches.forEach((match, index) => {
      const [, componentName, importPath] = match.match(/import\s+(\w+)\s+from\s+['"]([^'"]*)['"]/);
      const fullPath = importPath.replace('@/', 'src/');
      const filePath = fullPath.endsWith('.jsx') ? fullPath : `${fullPath}.jsx`;
      
      const exists = fs.existsSync(filePath);
      console.log(`  ${exists ? '✅' : '❌'} ${componentName}: ${filePath} ${exists ? '(OK)' : '(MANQUANT)'}`);
    });
  }
  
  console.log('\n📋 VÉRIFICATION DES USAGES DANS LES ROUTES:');
  
  // Chercher les usages de composants dans les routes
  const routeMatches = content.match(/<Route[^>]*element={[^}]*<(\w*Particulier\w*)[^>]*>/g);
  if (routeMatches) {
    const usedComponents = new Set();
    routeMatches.forEach(match => {
      const componentMatch = match.match(/<(\w*Particulier\w*)/);
      if (componentMatch) {
        usedComponents.add(componentMatch[1]);
      }
    });
    
    usedComponents.forEach(component => {
      const isImported = content.includes(`import ${component} from`);
      console.log(`  ${isImported ? '✅' : '❌'} ${component}: ${isImported ? 'Importé' : 'NON IMPORTÉ ⚠️'}`);
    });
  }
  
  console.log('\n📋 VÉRIFICATION DES FICHIERS FONCTIONNELS:');
  
  const functionalFiles = [
    'src/pages/dashboards/particulier/ParticulierZonesCommunales_FUNCTIONAL.jsx',
    'src/pages/dashboards/particulier/ParticulierNotifications_FUNCTIONAL.jsx',
    'src/pages/dashboards/particulier/ParticulierDocuments_FUNCTIONAL.jsx',
    'src/pages/dashboards/particulier/ParticulierSettings_FUNCTIONAL.jsx'
  ];
  
  functionalFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✅' : '❌'} ${path.basename(file)}: ${exists ? 'OK' : 'MANQUANT'}`);
  });
  
  console.log('\n📋 VÉRIFICATION SERVICE SUPABASE:');
  const supabaseService = 'src/services/supabaseClient.js';
  const supabaseExists = fs.existsSync(supabaseService);
  console.log(`  ${supabaseExists ? '✅' : '❌'} supabaseClient.js: ${supabaseExists ? 'OK' : 'MANQUANT'}`);
  
  if (supabaseExists) {
    const supabaseContent = fs.readFileSync(supabaseService, 'utf8');
    const hasExport = supabaseContent.includes('export');
    const hasCreateClient = supabaseContent.includes('createClient');
    console.log(`    - Export: ${hasExport ? '✅' : '❌'}`);
    console.log(`    - CreateClient: ${hasCreateClient ? '✅' : '❌'}`);
  }
  
} else {
  console.log('❌ App.jsx non trouvé!');
}

console.log('\n🎯 RÉSUMÉ:');
console.log('- Vérifiez que tous les composants ❌ sont corrigés');
console.log('- Redémarrez le serveur après les corrections');
console.log('- Les erreurs Multiple GoTrueClient devraient disparaître avec le service centralisé');

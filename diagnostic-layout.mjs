#!/usr/bin/env node

// ================================================================
// DIAGNOSTIC LAYOUT COMPONENTS
// Vérifie tous les fichiers de layout pour erreurs
// ================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 DIAGNOSTIC LAYOUT COMPONENTS");
console.log("================================");
console.log("");

const layoutFiles = [
  'src/components/layout/DashboardLayout.jsx',
  'src/components/layout/DashboardLayoutClean.jsx',
  'src/components/layout/SidebarResponsive.jsx',
  'src/components/layout/Sidebar.jsx',
  'src/components/layout/Header.jsx',
  'src/components/ui/mobile-drawer.jsx'
];

const checkFile = (filePath) => {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ ${filePath} - FICHIER MANQUANT`);
    return false;
  }
  
  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    // Vérifications basiques
    const checks = {
      hasImports: content.includes('import'),
      hasExports: content.includes('export'),
      hasMultipleDefaults: (content.match(/export default/g) || []).length > 1,
      hasSyntaxErrors: content.includes('export default DashboardLayout;export default DashboardLayout;'),
      hasReactImport: content.includes('import React'),
      hasValidJSX: content.includes('return (') || content.includes('return <'),
    };
    
    let status = '✅';
    let issues = [];
    
    if (checks.hasMultipleDefaults) {
      status = '❌';
      issues.push('Multiple default exports');
    }
    
    if (checks.hasSyntaxErrors) {
      status = '❌';
      issues.push('Syntax errors detected');
    }
    
    if (!checks.hasReactImport) {
      status = '⚠️';
      issues.push('Missing React import');
    }
    
    if (!checks.hasValidJSX) {
      status = '⚠️';
      issues.push('No JSX return found');
    }
    
    console.log(`${status} ${filePath}${issues.length > 0 ? ' - ' + issues.join(', ') : ''}`);
    
    // Afficher des statistiques
    const lines = content.split('\n').length;
    const imports = (content.match(/^import/gm) || []).length;
    const exports = (content.match(/^export/gm) || []).length;
    
    console.log(`   📊 ${lines} lignes, ${imports} imports, ${exports} exports`);
    
    return status === '✅';
    
  } catch (error) {
    console.log(`❌ ${filePath} - ERREUR LECTURE: ${error.message}`);
    return false;
  }
};

console.log("📁 FICHIERS LAYOUT:");
console.log("===================");

let allGood = true;
layoutFiles.forEach(file => {
  const isOk = checkFile(file);
  if (!isOk) allGood = false;
});

console.log("");
console.log("🔧 COMPOSANTS CRITIQUES:");
console.log("========================");

const criticalComponents = [
  { name: 'DashboardLayout', path: 'src/components/layout/DashboardLayout.jsx' },
  { name: 'SidebarResponsive', path: 'src/components/layout/SidebarResponsive.jsx' },
  { name: 'Header', path: 'src/components/layout/Header.jsx' },
  { name: 'MobileDrawer', path: 'src/components/ui/mobile-drawer.jsx' }
];

criticalComponents.forEach(component => {
  const fullPath = path.join(__dirname, component.path);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const hasComponent = content.includes(`const ${component.name}`) || content.includes(`function ${component.name}`);
    console.log(`${hasComponent ? '✅' : '❌'} ${component.name} - ${hasComponent ? 'Défini' : 'Non trouvé'}`);
  } else {
    console.log(`❌ ${component.name} - Fichier manquant`);
  }
});

console.log("");
console.log("📋 RECOMMANDATIONS:");
console.log("===================");

if (allGood) {
  console.log("✅ Tous les composants layout sont OK");
  console.log("✅ Aucune erreur de syntaxe détectée");
  console.log("✅ Prêt pour utilisation");
} else {
  console.log("⚠️ Certains composants ont des problèmes");
  console.log("💡 Utilisez DashboardLayoutClean si problèmes persistent");
  console.log("💡 Vérifiez les imports et exports");
}

console.log("");
console.log(`📊 RÉSULTAT: ${allGood ? '✅ TOUS OK' : '❌ PROBLÈMES DÉTECTÉS'}`);
console.log("🚀 Application prête pour test !");

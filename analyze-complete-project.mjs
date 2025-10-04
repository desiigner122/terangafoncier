#!/usr/bin/env node

/**
 * 🔍 ANALYSE EXHAUSTIVE TERANGA FONCIER
 * Script pour mapper TOUTES les fonctionnalités et créer l'API complète
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 ANALYSE EXHAUSTIVE TERANGA FONCIER - API COMPLÈTE');
console.log('='.repeat(80));

// Structure pour collecter toutes les fonctionnalités
const analysis = {
  pages: {
    public: [],
    dashboards: {},
    auth: [],
    profiles: []
  },
  services: [],
  hooks: [],
  components: [],
  dataModels: new Set(),
  apiEndpoints: new Set(),
  roles: new Set()
};

// Fonction pour analyser un fichier
function analyzeFile(filePath, content) {
  const relativePath = path.relative(__dirname, filePath);
  const fileName = path.basename(filePath, path.extname(filePath));
  
  // Identifier le type de fichier
  if (relativePath.includes('/pages/')) {
    if (relativePath.includes('/dashboards/')) {
      // Dashboards spécialisés
      const dashboardMatch = relativePath.match(/dashboards\/([^\/]+)/);
      const role = dashboardMatch ? dashboardMatch[1] : 'unknown';
      if (!analysis.pages.dashboards[role]) {
        analysis.pages.dashboards[role] = [];
      }
      analysis.pages.dashboards[role].push({
        name: fileName,
        path: relativePath,
        features: extractFeatures(content)
      });
      analysis.roles.add(role);
    } else if (relativePath.includes('Login') || relativePath.includes('Register') || relativePath.includes('Auth')) {
      // Pages d'authentification
      analysis.pages.auth.push({
        name: fileName,
        path: relativePath,
        features: extractFeatures(content)
      });
    } else if (relativePath.includes('/profiles/')) {
      // Pages de profils
      analysis.pages.profiles.push({
        name: fileName,
        path: relativePath,
        features: extractFeatures(content)
      });
    } else {
      // Pages publiques
      analysis.pages.public.push({
        name: fileName,
        path: relativePath,
        features: extractFeatures(content)
      });
    }
  } else if (relativePath.includes('/services/')) {
    // Services
    analysis.services.push({
      name: fileName,
      path: relativePath,
      methods: extractMethods(content)
    });
  } else if (relativePath.includes('/hooks/')) {
    // Hooks React
    analysis.hooks.push({
      name: fileName,
      path: relativePath,
      functions: extractHookFunctions(content)
    });
  }

  // Extraire les modèles de données
  extractDataModels(content, analysis.dataModels);
  
  // Extraire les endpoints API
  extractApiEndpoints(content, analysis.apiEndpoints);
}

// Fonction pour extraire les fonctionnalités d'une page
function extractFeatures(content) {
  const features = [];
  
  // Recherche de CRUD operations
  if (content.includes('useState') || content.includes('useEffect')) features.push('state_management');
  if (content.includes('fetch') || content.includes('axios') || content.includes('api')) features.push('api_calls');
  if (content.includes('create') || content.includes('Create') || content.includes('POST')) features.push('create');
  if (content.includes('update') || content.includes('Update') || content.includes('PUT')) features.push('update');
  if (content.includes('delete') || content.includes('Delete') || content.includes('DELETE')) features.push('delete');
  if (content.includes('get') || content.includes('fetch') || content.includes('GET')) features.push('read');
  
  // Fonctionnalités spécifiques
  if (content.includes('upload') || content.includes('Upload')) features.push('file_upload');
  if (content.includes('payment') || content.includes('Payment')) features.push('payment');
  if (content.includes('notification') || content.includes('Notification')) features.push('notifications');
  if (content.includes('chart') || content.includes('Chart') || content.includes('analytics')) features.push('analytics');
  if (content.includes('map') || content.includes('Map') || content.includes('geolocation')) features.push('mapping');
  if (content.includes('search') || content.includes('Search') || content.includes('filter')) features.push('search');
  if (content.includes('export') || content.includes('Export') || content.includes('download')) features.push('export');
  if (content.includes('blockchain') || content.includes('Blockchain')) features.push('blockchain');
  if (content.includes('ai') || content.includes('AI') || content.includes('artificial')) features.push('ai');
  
  return features;
}

// Fonction pour extraire les méthodes de service
function extractMethods(content) {
  const methods = [];
  const methodRegex = /(?:export\s+)?(?:const\s+|function\s+|async\s+function\s+)([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    methods.push(match[1]);
  }
  return methods;
}

// Fonction pour extraire les fonctions de hooks
function extractHookFunctions(content) {
  const functions = [];
  const hookRegex = /use[A-Z][a-zA-Z0-9]*/g;
  let match;
  while ((match = hookRegex.exec(content)) !== null) {
    functions.push(match[0]);
  }
  return functions;
}

// Fonction pour extraire les modèles de données
function extractDataModels(content, dataModels) {
  // Recherche d'objets de données
  const objectPatterns = [
    /interface\s+([A-Z][a-zA-Z0-9]*)/g,
    /type\s+([A-Z][a-zA-Z0-9]*)/g,
    /class\s+([A-Z][a-zA-Z0-9]*)/g,
    /const\s+([a-zA-Z][a-zA-Z0-9]*Schema)/g
  ];
  
  objectPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      dataModels.add(match[1]);
    }
  });

  // Modèles métier identifiés dans le code
  const businessModels = [
    'User', 'Property', 'Transaction', 'Payment', 'Agent', 'Commission',
    'Project', 'Investment', 'Loan', 'Document', 'Contract', 'Notification',
    'Municipality', 'Land', 'Survey', 'Certificate', 'Portfolio', 'Client'
  ];
  
  businessModels.forEach(model => {
    if (content.includes(model)) {
      dataModels.add(model);
    }
  });
}

// Fonction pour extraire les endpoints API
function extractApiEndpoints(content, apiEndpoints) {
  const endpointPatterns = [
    /['"`]\/api\/([^'"`]+)['"`]/g,
    /fetch\s*\(\s*['"`]([^'"`]+)['"`]/g,
    /axios\.[a-z]+\s*\(\s*['"`]([^'"`]+)['"`]/g
  ];
  
  endpointPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      apiEndpoints.add(match[1]);
    }
  });
}

// Fonction récursive pour scanner les fichiers
function scanDirectory(dir) {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      scanDirectory(fullPath);
    } else if (stat.isFile() && /\.(jsx?|tsx?)$/.test(item)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        analyzeFile(fullPath, content);
      } catch (error) {
        console.log(`⚠️ Erreur lecture ${fullPath}: ${error.message}`);
      }
    }
  });
}

// Démarrer l'analyse
const srcDir = path.join(__dirname, 'src');
console.log(`📂 Analyse du dossier: ${srcDir}\n`);

scanDirectory(srcDir);

// Afficher les résultats
console.log('📊 RÉSULTATS DE L\'ANALYSE');
console.log('='.repeat(50));

console.log(`\n🌐 PAGES PUBLIQUES (${analysis.pages.public.length}):`);
analysis.pages.public.forEach(page => {
  console.log(`  📄 ${page.name}`);
  if (page.features.length > 0) {
    console.log(`     Fonctionnalités: ${page.features.join(', ')}`);
  }
});

console.log(`\n🔐 PAGES D'AUTHENTIFICATION (${analysis.pages.auth.length}):`);
analysis.pages.auth.forEach(page => {
  console.log(`  🔑 ${page.name}`);
  if (page.features.length > 0) {
    console.log(`     Fonctionnalités: ${page.features.join(', ')}`);
  }
});

console.log(`\n👤 PAGES DE PROFILS (${analysis.pages.profiles.length}):`);
analysis.pages.profiles.forEach(page => {
  console.log(`  👤 ${page.name}`);
  if (page.features.length > 0) {
    console.log(`     Fonctionnalités: ${page.features.join(', ')}`);
  }
});

console.log(`\n📊 DASHBOARDS PAR RÔLE:`);
Object.keys(analysis.pages.dashboards).forEach(role => {
  console.log(`  🎭 ${role.toUpperCase()} (${analysis.pages.dashboards[role].length} pages):`);
  analysis.pages.dashboards[role].forEach(page => {
    console.log(`    📄 ${page.name}`);
    if (page.features.length > 0) {
      console.log(`       Fonctionnalités: ${page.features.join(', ')}`);
    }
  });
});

console.log(`\n⚙️ SERVICES (${analysis.services.length}):`);
analysis.services.forEach(service => {
  console.log(`  🔧 ${service.name}`);
  if (service.methods.length > 0) {
    console.log(`     Méthodes: ${service.methods.slice(0, 5).join(', ')}${service.methods.length > 5 ? '...' : ''}`);
  }
});

console.log(`\n🪝 HOOKS REACT (${analysis.hooks.length}):`);
analysis.hooks.forEach(hook => {
  console.log(`  🪝 ${hook.name}`);
});

console.log(`\n📋 MODÈLES DE DONNÉES IDENTIFIÉS (${analysis.dataModels.size}):`);
Array.from(analysis.dataModels).sort().forEach(model => {
  console.log(`  📊 ${model}`);
});

console.log(`\n🌐 ENDPOINTS API DÉTECTÉS (${analysis.apiEndpoints.size}):`);
Array.from(analysis.apiEndpoints).sort().forEach(endpoint => {
  console.log(`  🔗 ${endpoint}`);
});

console.log(`\n🎭 RÔLES IDENTIFIÉS (${analysis.roles.size}):`);
Array.from(analysis.roles).sort().forEach(role => {
  console.log(`  👤 ${role}`);
});

// Sauvegarder l'analyse dans un fichier JSON
const analysisFile = path.join(__dirname, 'backend', 'COMPLETE_PROJECT_ANALYSIS.json');
fs.writeFileSync(analysisFile, JSON.stringify(analysis, null, 2));

console.log(`\n💾 Analyse sauvegardée dans: ${analysisFile}`);
console.log('\n🎯 PROCHAINE ÉTAPE: Créer l\'API complète basée sur cette analyse!');
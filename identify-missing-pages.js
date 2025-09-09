import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔍 SCRIPT D'IDENTIFICATION DES PAGES MANQUANTES
// ===============================================

console.log('🔍 ANALYSE DES IMPORTS MANQUANTS - TERANGA FONCIER');
console.log('==================================================\n');

const missingFiles = new Set();
const existingFiles = new Set();

// Fonction pour analyser récursivement un fichier et ses imports
function analyzeFile(filePath, depth = 0) {
  const indent = '  '.repeat(depth);
  
  if (!fs.existsSync(filePath)) {
    console.log(`${indent}❌ Fichier manquant: ${filePath}`);
    missingFiles.add(filePath);
    return;
  }

  if (existingFiles.has(filePath)) {
    return; // Déjà analysé
  }

  existingFiles.add(filePath);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Regex pour trouver les imports
    const importRegex = /import\s+(?:(?:\{[^}]*\}|\w+)\s+from\s+)?['"`]([^'"`]+)['"`]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1];
      
      // Ignorer les imports de node_modules, relatifs compliqués, ou externes
      if (importPath.startsWith('@/') || importPath.startsWith('./') || importPath.startsWith('../')) {
        let resolvedPath;
        
        if (importPath.startsWith('@/')) {
          // Alias @ -> src/
          resolvedPath = path.resolve(__dirname, 'src', importPath.substring(2));
        } else {
          // Import relatif
          const dir = path.dirname(filePath);
          resolvedPath = path.resolve(dir, importPath);
        }

        // Essayer avec différentes extensions
        const extensions = ['', '.js', '.jsx', '.ts', '.tsx'];
        let found = false;

        for (const ext of extensions) {
          const fullPath = resolvedPath + ext;
          if (fs.existsSync(fullPath)) {
            if (depth < 2) { // Limiter la profondeur pour éviter la récursion infinie
              analyzeFile(fullPath, depth + 1);
            }
            found = true;
            break;
          }
        }

        if (!found) {
          // Vérifier si c'est un dossier avec index
          const indexPath = path.join(resolvedPath, 'index.jsx');
          if (fs.existsSync(indexPath)) {
            if (depth < 2) {
              analyzeFile(indexPath, depth + 1);
            }
            found = true;
          }
        }

        if (!found) {
          const missingPath = resolvedPath + '.jsx';
          console.log(`${indent}❌ Import manquant: ${importPath} -> ${missingPath}`);
          missingFiles.add(missingPath);
        }
      }
    }
  } catch (error) {
    console.log(`${indent}⚠️  Erreur lecture: ${filePath} - ${error.message}`);
  }
}

// Points d'entrée à analyser
const entryPoints = [
  'src/App.jsx',
  'src/main.jsx',
  'src/components/DashboardRoutes.jsx'
];

console.log('📂 Analyse des points d\'entrée...\n');

entryPoints.forEach(entry => {
  const fullPath = path.resolve(__dirname, entry);
  console.log(`🔍 Analyse: ${entry}`);
  analyzeFile(fullPath);
  console.log('');
});

// Afficher le résumé
console.log('\n📊 RÉSUMÉ DE L\'ANALYSE');
console.log('========================');
console.log(`✅ Fichiers existants analysés: ${existingFiles.size}`);
console.log(`❌ Fichiers manquants détectés: ${missingFiles.size}\n`);

if (missingFiles.size > 0) {
  console.log('📋 LISTE DES FICHIERS MANQUANTS:');
  console.log('=================================');
  
  const sortedMissing = Array.from(missingFiles).sort();
  
  // Grouper par type/dossier
  const groups = {};
  sortedMissing.forEach(file => {
    const relativePath = path.relative(__dirname, file);
    const parts = relativePath.split(path.sep);
    
    if (parts.includes('dashboards')) {
      const dashboardType = parts[parts.indexOf('dashboards') + 1] || 'main';
      const groupKey = `Dashboard ${dashboardType}`;
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(relativePath);
    } else if (parts.includes('components')) {
      if (!groups['Components']) groups['Components'] = [];
      groups['Components'].push(relativePath);
    } else if (parts.includes('pages')) {
      if (!groups['Pages']) groups['Pages'] = [];
      groups['Pages'].push(relativePath);
    } else {
      if (!groups['Autres']) groups['Autres'] = [];
      groups['Autres'].push(relativePath);
    }
  });

  Object.entries(groups).forEach(([groupName, files]) => {
    console.log(`\n📁 ${groupName}:`);
    files.forEach(file => {
      console.log(`   ❌ ${file}`);
    });
  });
}

// Générer un script de création automatique
if (missingFiles.size > 0) {
  console.log('\n🔧 GÉNÉRATION DU SCRIPT DE CRÉATION...');
  
  const createScript = `import fs from 'fs';
import path from 'path';

// Script généré automatiquement pour créer les fichiers manquants
// Date de génération: ${new Date().toLocaleString('fr-FR')}

const createMissingFile = (filePath, content) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content);
  console.log(\`✅ Créé: \${filePath}\`);
};

// Template React basique
const createReactComponent = (componentName) => {
  return \`import React from 'react';
import { motion } from 'framer-motion';

const \${componentName} = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          \${componentName}
        </h1>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <p className="text-gray-600">
            Cette page est en cours de développement.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default \${componentName};
\`;
};

// Fichiers à créer
const filesToCreate = [
${Array.from(missingFiles).map(file => {
  const relativePath = path.relative(__dirname, file);
  const componentName = path.basename(file, path.extname(file));
  return `  { path: '${relativePath}', component: '${componentName}' }`;
}).join(',\n')}
];

console.log('🚀 Création des fichiers manquants...');

filesToCreate.forEach(({ path: filePath, component }) => {
  const content = createReactComponent(component);
  createMissingFile(filePath, content);
});

console.log(\`\\n🎉 \${filesToCreate.length} fichiers créés avec succès!\`);
console.log('✅ Vous pouvez maintenant relancer le build.');
`;

  fs.writeFileSync('create-missing-files-auto.js', createScript);
  console.log('✅ Script de création automatique généré: create-missing-files-auto.js');
  
  console.log('\n🚀 PROCHAINES ÉTAPES:');
  console.log('=====================');
  console.log('1. Exécuter: node create-missing-files-auto.js');
  console.log('2. Tester le build: npm run build');
  console.log('3. Valider: node validate-complete.js');
}

console.log('\n🏁 Analyse terminée!');

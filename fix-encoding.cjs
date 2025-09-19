const fs = require('fs');
const path = require('path');

// Mappings des caractères mal encodés
const replacements = {
  'Ã¨': 'è',
  'Ã©': 'é', 
  'Ã ': 'à',
  'Ã´': 'ô',
  'Ã¢': 'â',
  'Ã¹': 'ù',
  'Ã»': 'û',
  'Ã®': 'î',
  'Ã¯': 'ï',
  'Ã«': 'ë',
  'Ã§': 'ç',
  'Ã‰': 'É',
  'Ãª': 'ê',
  'ÃŠ': 'Ê',
  'Ã€': 'À',
  'Ã‡': 'Ç',
  'Ã"': 'Ô',
  'Ã‚': 'Â',
  'Ã™': 'Ù',
  'Ã›': 'Û',
  'ÃŽ': 'Î',
  'Ã': 'Ï',
  'âœ…': '✅',
  'âŒ': '❌',
  'ðŸšª': '🚪',
  'ðŸ"„': '🔄'
};

// Fonction pour traiter un fichier
function fixFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let hasChanges = false;
    
    // Appliquer les corrections
    Object.keys(replacements).forEach(badChar => {
      const goodChar = replacements[badChar];
      if (newContent.includes(badChar)) {
        newContent = newContent.split(badChar).join(goodChar);
        hasChanges = true;
      }
    });
    
    // Sauvegarder si modifié
    if (hasChanges) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ ${path.basename(filePath)} corrigé`);
      return 1;
    }
    return 0;
  } catch (error) {
    console.error(`❌ Erreur avec ${filePath}:`, error.message);
    return 0;
  }
}

// Fonction récursive pour parcourir les dossiers
function processDirectory(dir) {
  let filesFixed = 0;
  
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Ignorer certains dossiers
        if (!['node_modules', '.git', 'dist', 'build', '.next'].includes(item)) {
          filesFixed += processDirectory(fullPath);
        }
      } else if (stat.isFile()) {
        // Traiter les fichiers avec les bonnes extensions
        const ext = path.extname(item);
        if (['.js', '.jsx', '.ts', '.tsx', '.html', '.css'].includes(ext)) {
          filesFixed += fixFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Erreur dossier ${dir}:`, error.message);
  }
  
  return filesFixed;
}

// Exécution
console.log('🔧 Correction des problèmes d\'encodage...');
const startTime = Date.now();
const filesFixed = processDirectory('.');
const duration = Date.now() - startTime;

console.log(`\n📊 Résultats:`);
console.log(`   • Fichiers corrigés: ${filesFixed}`);
console.log(`   • Temps: ${duration}ms`);
console.log(`\n🎉 Correction terminée!`);
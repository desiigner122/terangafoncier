const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.jsx');
let code = fs.readFileSync(appPath, 'utf8');

// 1. Trouver tous les ModernXXXDashboard utilisés dans le code
const dashboardRegex = /<Modern([A-Za-z0-9]+)Dashboard\b/g;
const usedDashboards = new Set();
let match;
while ((match = dashboardRegex.exec(code)) !== null) {
  usedDashboards.add(`Modern${match[1]}Dashboard`);
}

// 2. Trouver tous les imports existants
const importRegex = /import\s+(\w+)\s+from\s+['"][^'"]+['"]/g;
const imported = new Set();
while ((match = importRegex.exec(code)) !== null) {
  imported.add(match[1]);
}

// 3. Pour chaque dashboard utilisé mais non importé, générer l'import
let newImports = '';
usedDashboards.forEach(dash => {
  if (!imported.has(dash)) {
    // On suppose le chemin src/pages/dashboards/ModernXXXDashboard.jsx
    newImports += `import ${dash} from '@/pages/dashboards/${dash}';\n`;
  }
});

// 4. Ajouter les imports manquants après les imports existants
if (newImports) {
  // Trouver la fin du bloc d'import principal
  const lastImportIdx = code.lastIndexOf('import ');
  const nextLineIdx = code.indexOf('\n', lastImportIdx) + 1;
  code = code.slice(0, nextLineIdx) + newImports + code.slice(nextLineIdx);
  fs.writeFileSync(appPath, code, 'utf8');
  console.log('✅ Imports manquants ajoutés :\n' + newImports);
} else {
  console.log('Aucun import manquant détecté.');
}

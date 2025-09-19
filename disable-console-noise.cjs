const fs = require('fs');

// Désactiver tous les messages de console dans AutonomousAIService.js
const filePath = 'src/services/AutonomousAIService.js';
let content = fs.readFileSync(filePath, 'utf8');

// Remplacer tous les console.log par des commentaires (sauf s'ils sont déjà commentés)
content = content.replace(/(?<!\/\/ )console\.log\(/g, '// console.log(');

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Messages de console désactivés dans AutonomousAIService.js');

// Aussi désactiver dans d'autres services s'ils ont des messages bruyants
const otherFiles = [
  'src/services/AdvancedAIService.js',
  'src/services/AIService.js'
];

let totalDisabled = 0;

otherFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let fileContent = fs.readFileSync(file, 'utf8');
    const originalLength = fileContent.length;
    
    // Désactiver seulement les messages de démarrage/debug bruyants
    fileContent = fileContent.replace(/console\.log\('✅ AdvancedAIService/g, '// console.log(\'✅ AdvancedAIService');
    fileContent = fileContent.replace(/console\.log\('🧠/g, '// console.log(\'🧠');
    fileContent = fileContent.replace(/console\.log\('🔄/g, '// console.log(\'🔄');
    fileContent = fileContent.replace(/console\.log\('📊/g, '// console.log(\'📊');
    fileContent = fileContent.replace(/console\.log\('⚙️/g, '// console.log(\'⚙️');
    fileContent = fileContent.replace(/console\.log\('🤖/g, '// console.log(\'🤖');
    
    if (fileContent.length !== originalLength) {
      fs.writeFileSync(file, fileContent, 'utf8');
      console.log(`✅ Messages debug désactivés dans ${file}`);
      totalDisabled++;
    }
  }
});

console.log(`\n📊 Résumé: ${totalDisabled + 1} fichiers nettoyés`);
console.log('🔇 Console beaucoup plus silencieuse maintenant!');
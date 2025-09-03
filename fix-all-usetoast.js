// Script pour corriger tous les appels useToast problématiques
import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

// Fonction toast sécurisée à ajouter
const safeToastFunction = `
// Fonction toast sécurisée
const safeToast = (message, type = 'info') => {
  try {
    // Tenter d'utiliser le système de toast
    const { useToast } = require('@/components/ui/use-toast-simple');
    const { toast } = useToast();
    toast({
      title: type === 'error' ? 'Erreur' : 'Succès',
      description: message,
      variant: type === 'error' ? 'destructive' : 'default'
    });
  } catch (error) {
    // Fallback vers console et alerte native
    console.log(\`\${type.toUpperCase()}: \${message}\`);
    if (type === 'error') {
      alert(\`Erreur: \${message}\`);
    }
  }
};
`;

// Fichiers prioritaires avec problèmes connus
const priorityFiles = [
  'src/pages/solutions/dashboards/ParticulierDashboard.jsx',
  'src/pages/dashboards/ParticulierDashboard.jsx',
  'src/hooks/useUserStatusMonitor.jsx',
  'src/components/layout/ProtectedRoute.jsx'
];

console.log('🔧 CORRECTION GLOBALE USETOAST');
console.log('==============================');

priorityFiles.forEach(filePath => {
  try {
    if (require('fs').existsSync(filePath)) {
      let content = readFileSync(filePath, 'utf8');
      
      // Remplacer les imports useToast
      content = content.replace(
        /import\s*{\s*useToast\s*}\s*from\s*['"]@\/components\/ui\/use-toast-simple['"];?/g,
        '// Toast import removed - using safeToast instead'
      );
      
      // Remplacer les déclarations toast
      content = content.replace(
        /const\s*{\s*toast\s*}\s*=\s*useToast\(\);?/g,
        '// useToast removed - using safeToast instead'
      );
      
      // Ajouter la fonction safeToast au début si pas déjà présente
      if (!content.includes('const safeToast')) {
        const importIndex = content.indexOf('import');
        if (importIndex !== -1) {
          const endOfImports = content.indexOf('\n\n', importIndex);
          content = content.slice(0, endOfImports) + '\n' + safeToastFunction + content.slice(endOfImports);
        }
      }
      
      writeFileSync(filePath, content);
      console.log(`✅ Corrigé: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Erreur avec ${filePath}:`, error.message);
  }
});

console.log('\n🎯 Corrections appliquées aux fichiers prioritaires');
console.log('💡 Prochaine étape: Tester et pousser vers GitHub');

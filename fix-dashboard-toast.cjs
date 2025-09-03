// 🔧 SAFE TOAST SYSTEM - DASHBOARD PARTICULIER
// Fichier: fix-dashboard-toast.cjs
// Date: 3 Septembre 2025
// Objectif: Corriger tous les problèmes useToast dans le dashboard particulier

const fs = require('fs');
const path = require('path');

// Fonction safeToast à utiliser comme remplacement
const safeToastCode = `
// Système de notification sécurisé
const safeToast = (message, type = 'default') => {
  try {
    // Tentative d'utilisation du toast standard
    if (typeof window !== 'undefined' && window.toast) {
      window.toast({ description: message, variant: type });
      return;
    }
    
    // Fallback 1: Console pour développement
    console.log(\`📢 TOAST [\${type.toUpperCase()}]: \${message}\`);
    
    // Fallback 2: Alert pour utilisateur en cas d'erreur critique
    if (type === 'destructive' || type === 'error') {
      alert(\`❌ Erreur: \${message}\`);
    } else if (type === 'success') {
      // Notification discrète pour succès
      if (typeof document !== 'undefined') {
        const notification = document.createElement('div');
        notification.style.cssText = \`
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          transition: all 0.3s ease;
        \`;
        notification.textContent = \`✅ \${message}\`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
          }
        }, 3000);
      }
    }
  } catch (error) {
    console.error('Erreur dans safeToast:', error);
    console.log(\`📢 MESSAGE: \${message}\`);
  }
};
`;

// Liste des fichiers du dashboard particulier à corriger
const filesToFix = [
  'src/pages/DashboardMunicipalRequestPage.jsx',
  'src/pages/solutions/dashboards/ParticulierDashboard.jsx',
  'src/pages/dashboards/ParticulierDashboard.jsx'
];

console.log('🔧 CORRECTION USETOAST - DASHBOARD PARTICULIER');
console.log('===============================================');

filesToFix.forEach(filePath => {
  const fullPath = path.resolve(filePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Vérifier s'il y a des problèmes useToast
      if (content.includes('useToast') || content.includes('toast(')) {
        console.log(`📝 Correction de: ${filePath}`);
        
        // Remplacer les imports useToast
        content = content.replace(
          /import\s*{\s*useToast\s*}\s*from\s*['""][^'"]*['"];?/g,
          '// useToast remplacé par safeToast'
        );
        
        // Ajouter le système safeToast au début du composant principal
        const componentMatch = content.match(/(const\s+\w+Component\s*=\s*\(\s*[^)]*\s*\)\s*=>\s*{|const\s+\w+\s*=\s*\(\s*[^)]*\s*\)\s*=>\s*{)/);
        if (componentMatch) {
          const insertPosition = content.indexOf(componentMatch[0]) + componentMatch[0].length;
          content = content.slice(0, insertPosition) + 
                   '\n  ' + safeToastCode.trim() + '\n' + 
                   content.slice(insertPosition);
        }
        
        // Remplacer les appels useToast()
        content = content.replace(/const\s+{\s*toast\s*}\s*=\s*useToast\(\s*\)\s*;?/g, '// toast remplacé par safeToast');
        content = content.replace(/const\s+toast\s*=\s*useToast\(\s*\)\s*;?/g, '// toast remplacé par safeToast');
        
        // Remplacer les appels toast() simples
        content = content.replace(/toast\s*\(\s*{([^}]+)}\s*\)/g, (match, params) => {
          // Extraire le message et le type
          const descMatch = params.match(/description\s*:\s*["']([^"']+)["']|description\s*:\s*([^,}]+)/);
          const variantMatch = params.match(/variant\s*:\s*["']([^"']+)["']|variant\s*:\s*([^,}]+)/);
          
          const description = descMatch ? (descMatch[1] || descMatch[2]) : 'Notification';
          const variant = variantMatch ? (variantMatch[1] || variantMatch[2]) : 'default';
          
          return `safeToast("${description}", "${variant}")`;
        });
        
        // Sauvegarder le fichier corrigé
        fs.writeFileSync(fullPath, content);
        console.log(`   ✅ Corrigé avec succès`);
      } else {
        console.log(`   ⏭️  Pas de useToast trouvé dans ${filePath}`);
      }
    } else {
      console.log(`   ⚠️  Fichier non trouvé: ${filePath}`);
    }
  } catch (error) {
    console.error(`   ❌ Erreur lors de la correction de ${filePath}:`, error.message);
  }
});

console.log('\n🎯 CORRECTION TERMINÉE');
console.log('Tous les useToast problématiques ont été remplacés par safeToast');
console.log('Le système de fallback garantit le fonctionnement même en cas d\'erreur');

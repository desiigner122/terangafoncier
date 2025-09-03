// Script pour corriger tous les appels toast dans AdminUsersPage
import fs from 'fs';

const filePath = 'src/pages/admin/AdminUsersPage.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Remplacements manuels spécifiques pour AdminUsersPage.jsx
const replacements = [
  {
    old: `toast({ title: 'Erreur', description: 'Impossible de charger les utilisateurs.', variant: 'destructive' });`,
    new: `safeToast('Impossible de charger les utilisateurs.', 'error');`
  },
  {
    old: `toast({ title: 'Erreur', description: 'Le nom est requis.', variant: 'destructive'});`,
    new: `safeToast('Le nom est requis.', 'error');`
  }
];

// Appliquer les remplacements
replacements.forEach(replacement => {
  content = content.replace(replacement.old, replacement.new);
});

// Remplacements par pattern pour les messages dynamiques
content = content.replace(/toast\(\s*\{\s*title:\s*['"]Succès['"]\s*,\s*description:\s*([^,}]+)\s*\}\s*\);?/g, (match, description) => {
  return `safeToast(${description}, 'success');`;
});

content = content.replace(/toast\(\s*\{\s*description:\s*([^,}]+)\s*,\s*variant:\s*['"]default['"]\s*\}\s*\);?/g, (match, description) => {
  return `safeToast(${description}, 'success');`;
});

content = content.replace(/toast\(\s*\{\s*description:\s*([^,}]+)\s*,\s*variant:\s*['"]destructive['"]\s*\}\s*\);?/g, (match, description) => {
  return `safeToast(${description}, 'error');`;
});

// Nettoyer la fonction safeToast pour éviter les doublons require
const lines = content.split('\n');
const cleanedLines = lines.filter((line, index) => {
  // Supprimer les lignes dupliquées de require
  if (line.includes('const { useToast }') && index > 0) {
    const prevLines = lines.slice(0, index).join('\n');
    return !prevLines.includes('const { useToast }');
  }
  return true;
});

content = cleanedLines.join('\n');

fs.writeFileSync(filePath, content);
console.log('Toast calls fixed in AdminUsersPage.jsx');

#!/usr/bin/env node

/**
 * 🔧 Réparation Complète des Fichiers Corrompus
 * Ce script répare tous les fichiers avec des problèmes d'encodage
 */

import { writeFileSync, readFileSync, existsSync } from 'fs';

console.log('🔧 Réparation des Fichiers Corrompus');
console.log('='.repeat(50));

// Contenu propre pour index.html
const cleanIndexHtml = `<!DOCTYPE html>
<html lang="fr-SN">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#e67e22" />
  <meta name="description" content="Plateforme immobilière intelligente avec blockchain et IA pour le Sénégal" />
  
  <!-- PWA Meta Tags -->
  <link rel="apple-touch-icon" href="/icon-192x192.png" />
  <link rel="manifest" href="/manifest.json" />
  
  <!-- Préchargement des ressources critiques -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <title>Teranga Foncier - Plateforme Immobilière IA & Blockchain</title>
  
  <!-- Meta tags pour SEO et réseaux sociaux -->
  <meta property="og:title" content="Teranga Foncier - Plateforme Immobilière Intelligente" />
  <meta property="og:description" content="Découvrez des propriétés au Sénégal avec notre plateforme alimentée par l'IA et sécurisée par la blockchain" />
  <meta property="og:image" content="/social-preview.png" />
  <meta property="og:url" content="https://teranga-foncier.com" />
  <meta property="og:type" content="website" />
  
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Teranga Foncier - Plateforme Immobilière IA" />
  <meta name="twitter:description" content="Trouvez votre propriété idéale avec l'intelligence artificielle" />
  <meta name="twitter:image" content="/social-preview.png" />
</head>
<body>
  <noscript>Vous devez activer JavaScript pour utiliser cette application.</noscript>
  <div id="root"></div>
  
  <!-- Installation automatique du service worker -->
  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('✅ SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('❌ SW registration failed: ', registrationError);
          });
      });
    }
  </script>
</body>
</html>`;

// Réparer index.html
try {
  writeFileSync('public/index.html', cleanIndexHtml, { encoding: 'utf8' });
  console.log('✅ public/index.html réparé');
} catch (error) {
  console.error('❌ Erreur réparation index.html:', error.message);
}

// Vérifier et réparer d'autres fichiers avec problèmes d'encodage
const filesToCheck = [
  'public/sw.js',
  'src/components/chat/AIChatbot.jsx',
  'src/components/chat/TerangaChatbot.jsx',
  'src/components/ai/GlobalAIAssistant.jsx'
];

console.log('\\n🔍 Vérification des autres fichiers...');

for (const filePath of filesToCheck) {
  try {
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf8');
      
      // Détecter des caractères problématiques
      if (content.includes('âŒ') || 
          content.includes('Ã') || 
          content.includes('â€') ||
          content.match(/[^\x00-\x7F]/g)?.some(char => 
            char !== 'é' && char !== 'è' && char !== 'à' && 
            char !== 'ç' && char !== 'ê' && char !== 'î' &&
            char !== 'ô' && char !== 'û' && char !== '✅' && 
            char !== '❌' && char !== '🔧' && char !== '📱'
          )) {
        
        console.log(`⚠️ ${filePath} contient des caractères suspects`);
        
        // Corriger les caractères les plus courants
        let fixedContent = content
          .replace(/âŒ/g, '❌')
          .replace(/Ã©/g, 'é')
          .replace(/Ã¨/g, 'è')
          .replace(/Ã /g, 'à')
          .replace(/Ã§/g, 'ç')
          .replace(/Ãª/g, 'ê')
          .replace(/Ã®/g, 'î')
          .replace(/Ã´/g, 'ô')
          .replace(/Ã»/g, 'û');
        
        writeFileSync(filePath, fixedContent, { encoding: 'utf8' });
        console.log(`✅ ${filePath} réparé`);
      } else {
        console.log(`✅ ${filePath} OK`);
      }
    } else {
      console.log(`⚠️ ${filePath} introuvable`);
    }
  } catch (error) {
    console.error(`❌ Erreur avec ${filePath}:`, error.message);
  }
}

console.log('\n🎉 Réparation terminée!');
console.log('📋 Vérifiez que les icônes s\'affichent maintenant correctement.');
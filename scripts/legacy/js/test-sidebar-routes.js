/**
 * Script de vérification des routes du sidebar pour s'assurer qu'aucune ne cause de 404
 * Analyse toutes les routes définies dans sidebarConfig.js
 */

import fs from 'fs';
import path from 'path';

// Lire le fichier sidebarConfig.js
const sidebarConfigPath = path.join(process.cwd(), 'src/components/layout/sidebarConfig.js');
const appJsPath = path.join(process.cwd(), 'src/App.jsx');

console.log('🔍 VÉRIFICATION DES ROUTES SIDEBAR');
console.log('======================================\n');

// Lire sidebarConfig.js pour extraire les routes
const sidebarContent = fs.readFileSync(sidebarConfigPath, 'utf8');
const appContent = fs.readFileSync(appJsPath, 'utf8');

// Extraire toutes les routes href du sidebar config
const hrefMatches = sidebarContent.match(/href:\s*['"`]([^'"`]+)['"`]/g);
const sidebarRoutes = hrefMatches ? hrefMatches.map(match => {
    const routeMatch = match.match(/['"`]([^'"`]+)['"`]/);
    return routeMatch ? routeMatch[1] : null;
}).filter(route => route && route !== '#') : [];

console.log('📋 Routes trouvées dans sidebarConfig.js:');
sidebarRoutes.forEach(route => {
    console.log(`  - ${route}`);
});

console.log(`\n📊 Total: ${sidebarRoutes.length} routes à vérifier\n`);

// Vérifier chaque route dans App.jsx
console.log('✅ VÉRIFICATION DANS APP.JSX:');
console.log('================================\n');

sidebarRoutes.forEach(route => {
    // Nettoyer la route pour la recherche
    let searchRoute = route.replace(/^\//, ''); // Enlever le / initial
    
    // Gérer les routes spéciales
    if (searchRoute === 'acheteur') {
        // Dashboard redirect, normalement ok
        console.log(`✅ ${route} - Route de dashboard (redirect automatique)`);
    } else if (appContent.includes(`path="${searchRoute}"`)) {
        console.log(`✅ ${route} - Trouvée`);
    } else {
        // Vérifier si c'est une sous-route
        if (searchRoute.includes('/')) {
            const parts = searchRoute.split('/');
            const parentRoute = parts[0];
            const subRoute = parts.slice(1).join('/');
            
            if (appContent.includes(`path="${subRoute}"`)) {
                console.log(`✅ ${route} - Trouvée comme sous-route`);
            } else {
                console.log(`❌ ${route} - MANQUANTE - Peut causer 404`);
            }
        } else {
            console.log(`❌ ${route} - MANQUANTE - Peut causer 404`);
        }
    }
});

console.log('\n🎯 RÉSUMÉ:');
console.log('==========');
console.log('Si des routes sont marquées ❌ MANQUANTE, elles causeront des erreurs 404.');
console.log('Il faut soit:');
console.log('1. Créer les pages correspondantes et ajouter les routes dans App.jsx');
console.log('2. Corriger les liens dans sidebarConfig.js pour pointer vers des routes existantes');
#!/usr/bin/env node

/**
 * 🗺️ Mappeur de Dashboards - Analyse Complète
 * Ce script identifie tous les dashboards disponibles et leurs routes
 */

import { readdirSync, statSync, readFileSync } from 'fs';
import { join, relative } from 'path';

console.log('🗺️ Analyse des Dashboards Disponibles');
console.log('='.repeat(60));

const dashboards = [];

// Fonction pour scanner récursivement
function scanDirectory(dir, category = '') {
    try {
        const entries = readdirSync(dir);
        
        for (const entry of entries) {
            const fullPath = join(dir, entry);
            const stat = statSync(fullPath);
            
            if (stat.isDirectory()) {
                // Continuer la recherche dans les sous-dossiers
                const newCategory = category ? `${category}/${entry}` : entry;
                scanDirectory(fullPath, newCategory);
            } else if (entry.endsWith('Dashboard.jsx') || entry.includes('Dashboard')) {
                // Analyser le fichier dashboard
                const relativePath = relative(process.cwd(), fullPath);
                const content = readFileSync(fullPath, 'utf8');
                
                // Extraire des informations
                const componentName = entry.replace('.jsx', '');
                const role = extractRole(relativePath, content);
                const routes = extractRoutes(content);
                
                dashboards.push({
                    name: componentName,
                    path: relativePath,
                    category: category || 'general',
                    role: role,
                    routes: routes,
                    description: extractDescription(content)
                });
            }
        }
    } catch (error) {
        console.error(`Erreur scanning ${dir}:`, error.message);
    }
}

function extractRole(path, content) {
    // Extraire le rôle depuis le chemin
    if (path.includes('admin')) return 'Admin';
    if (path.includes('investisseur')) return 'Investisseur';
    if (path.includes('promoteur')) return 'Promoteur';
    if (path.includes('vendeur')) return 'Vendeur';
    if (path.includes('mairie')) return 'Mairie';
    if (path.includes('banque')) return 'Banque';
    if (path.includes('notaire')) return 'Notaire';
    if (path.includes('particulier')) return 'Particulier';
    if (path.includes('agent')) return 'Agent Foncier';
    
    // Essayer d'extraire depuis le contenu
    const roleMatch = content.match(/role.*['"](Admin|Investisseur|Promoteur|Vendeur|Mairie|Banque|Notaire|Particulier|Agent)['"]/i);
    return roleMatch ? roleMatch[1] : 'Unknown';
}

function extractRoutes(content) {
    const routes = [];
    
    // Chercher des routes dans le contenu
    const routeMatches = content.match(/to="([^"]+)"/g) || [];
    for (const match of routeMatches) {
        const route = match.match(/to="([^"]+)"/)[1];
        if (route.startsWith('/') && !routes.includes(route)) {
            routes.push(route);
        }
    }
    
    return routes;
}

function extractDescription(content) {
    // Essayer d'extraire une description depuis les commentaires ou le titre
    const titleMatch = content.match(/<h1[^>]*>([^<]+)<\/h1>/) || 
                      content.match(/title.*['"']([^'"]+)['"']/i) ||
                      content.match(/\/\*\*(.*?)\*\//s);
    
    if (titleMatch) {
        return titleMatch[1].replace(/\n|\*/g, '').trim().substring(0, 100);
    }
    
    return 'Dashboard sans description';
}

// Scanner les dossiers de dashboards
scanDirectory('src/pages/dashboards');
scanDirectory('src/pages', 'pages');

// Grouper par rôle
const dashboardsByRole = {};
for (const dashboard of dashboards) {
    const role = dashboard.role;
    if (!dashboardsByRole[role]) {
        dashboardsByRole[role] = [];
    }
    dashboardsByRole[role].push(dashboard);
}

// Afficher le résumé
console.log(`📊 ${dashboards.length} dashboards trouvés\n`);

// Afficher par rôle
for (const [role, roleDashboards] of Object.entries(dashboardsByRole)) {
    console.log(`👥 ${role} (${roleDashboards.length} dashboards)`);
    console.log('─'.repeat(40));
    
    for (const dashboard of roleDashboards) {
        console.log(`  📋 ${dashboard.name}`);
        console.log(`     📁 ${dashboard.path}`);
        console.log(`     📝 ${dashboard.description}`);
        if (dashboard.routes.length > 0) {
            console.log(`     🔗 Routes: ${dashboard.routes.join(', ')}`);
        }
        console.log('');
    }
    console.log('');
}

// Routes principales identifiées
console.log('🚀 ROUTES D\'ACCÈS PRINCIPALES');
console.log('='.repeat(60));

const mainRoutes = [
    { route: '/admin', role: 'Admin', description: 'Dashboard administrateur principal' },
    { route: '/dashboard', role: 'Particulier', description: 'Dashboard utilisateur standard' },
    { route: '/dashboard/investisseur', role: 'Investisseur', description: 'Dashboard investisseur' },
    { route: '/dashboard/promoteur', role: 'Promoteur', description: 'Dashboard promoteur' },
    { route: '/dashboard/vendeur', role: 'Vendeur', description: 'Dashboard vendeur' },
    { route: '/dashboard/banque', role: 'Banque', description: 'Dashboard banques' },
    { route: '/dashboard/mairie', role: 'Mairie', description: 'Dashboard mairie' },
    { route: '/dashboard/notaire', role: 'Notaire', description: 'Dashboard notaire' }
];

for (const route of mainRoutes) {
    console.log(`🌐 ${route.route}`);
    console.log(`   👤 Rôle: ${route.role}`);
    console.log(`   📝 ${route.description}`);
    console.log('');
}

console.log('💡 COMMENT TESTER LES DASHBOARDS');
console.log('='.repeat(60));
console.log('1. Créer un compte avec le rôle souhaité');
console.log('2. Se connecter à l\'application');
console.log('3. Naviguer vers la route correspondante');
console.log('4. Vérifier l\'affichage et les fonctionnalités');
console.log('');
console.log('📝 Les dashboards nécessitent une authentification valide');
console.log('🔒 Certains dashboards ont des restrictions par rôle');

export { dashboards, dashboardsByRole };
#!/usr/bin/env node

/**
 * 🔍 ANALYSE PAGE PAR PAGE - PLAN API EXHAUSTIF
 * Dashboard par dashboard, page par page
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 ANALYSE EXHAUSTIVE PAGE PAR PAGE - TERANGA FONCIER');
console.log('='.repeat(80));

// Structure pour collecter TOUTES les pages
const analysis = {
  dashboards: {},
  publicPages: [],
  apiEndpoints: new Set(),
  dataModels: new Set(),
  totalPages: 0
};

// Fonction pour analyser le contenu d'une page
function analyzePage(filePath, content) {
  const features = {
    crud: [],
    services: [],
    dataModels: [],
    apiCalls: [],
    components: []
  };

  // Détection CRUD
  if (content.match(/create|Create|POST/i)) features.crud.push('CREATE');
  if (content.match(/read|fetch|get|GET/i)) features.crud.push('READ');
  if (content.match(/update|edit|put|PUT/i)) features.crud.push('UPDATE');  
  if (content.match(/delete|remove|DELETE/i)) features.crud.push('DELETE');

  // Détection services
  if (content.includes('useState')) features.services.push('state_management');
  if (content.includes('useEffect')) features.services.push('lifecycle');
  if (content.includes('fetch') || content.includes('axios')) features.services.push('api_calls');
  if (content.includes('upload') || content.includes('Upload')) features.services.push('file_upload');
  if (content.includes('search') || content.includes('Search')) features.services.push('search');
  if (content.includes('filter') || content.includes('Filter')) features.services.push('filtering');
  if (content.includes('notification') || content.includes('Notification')) features.services.push('notifications');
  if (content.includes('message') || content.includes('Message')) features.services.push('messaging');
  if (content.includes('calendar') || content.includes('Calendar')) features.services.push('calendar');
  if (content.includes('chart') || content.includes('Chart')) features.services.push('analytics');
  if (content.includes('map') || content.includes('Map')) features.services.push('mapping');
  if (content.includes('payment') || content.includes('Payment')) features.services.push('payments');
  if (content.includes('blockchain') || content.includes('Blockchain')) features.services.push('blockchain');
  if (content.includes('ai') || content.includes('AI')) features.services.push('artificial_intelligence');

  // Détection modèles de données
  const dataModelPatterns = [
    'user', 'User', 'property', 'Property', 'terrain', 'Terrain',
    'client', 'Client', 'agent', 'Agent', 'commission', 'Commission',
    'transaction', 'Transaction', 'payment', 'Payment', 'contract', 'Contract',
    'document', 'Document', 'notification', 'Notification', 'message', 'Message',
    'project', 'Project', 'investment', 'Investment', 'loan', 'Loan',
    'survey', 'Survey', 'certificate', 'Certificate', 'permit', 'Permit'
  ];
  
  dataModelPatterns.forEach(model => {
    if (content.includes(model)) {
      features.dataModels.push(model.toLowerCase());
    }
  });

  return features;
}

// Analyser les dashboards
function analyzeDashboard(dashboardPath, role) {
  console.log(`\n📊 ANALYSE ${role.toUpperCase()} DASHBOARD`);
  console.log('-'.repeat(50));
  
  const dashboard = {
    role: role,
    pages: [],
    totalFeatures: {
      crud: new Set(),
      services: new Set(),
      dataModels: new Set()
    }
  };

  try {
    const files = fs.readdirSync(dashboardPath);
    
    files.forEach(file => {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        const filePath = path.join(dashboardPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const features = analyzePage(filePath, content);
        
        const page = {
          name: file.replace(/\.(jsx|js)$/, ''),
          file: file,
          features: features
        };
        
        dashboard.pages.push(page);
        analysis.totalPages++;
        
        // Agréger les fonctionnalités
        features.crud.forEach(c => dashboard.totalFeatures.crud.add(c));
        features.services.forEach(s => dashboard.totalFeatures.services.add(s));
        features.dataModels.forEach(m => dashboard.totalFeatures.dataModels.add(m));
        
        console.log(`  📄 ${page.name}`);
        if (features.crud.length > 0) {
          console.log(`     🔧 CRUD: ${features.crud.join(', ')}`);
        }
        if (features.services.length > 0) {
          console.log(`     ⚙️ Services: ${features.services.slice(0, 3).join(', ')}${features.services.length > 3 ? '...' : ''}`);
        }
        if (features.dataModels.length > 0) {
          console.log(`     📊 Models: ${[...new Set(features.dataModels)].slice(0, 3).join(', ')}`);
        }
      }
    });
  } catch (error) {
    console.log(`  ⚠️ Erreur lecture ${dashboardPath}: ${error.message}`);
  }
  
  analysis.dashboards[role] = dashboard;
  
  console.log(`\n  📈 RÉSUMÉ ${role.toUpperCase()}:`);
  console.log(`     Pages: ${dashboard.pages.length}`);
  console.log(`     CRUD: ${Array.from(dashboard.totalFeatures.crud).join(', ') || 'Aucun'}`);
  console.log(`     Services: ${Array.from(dashboard.totalFeatures.services).slice(0, 5).join(', ')}${dashboard.totalFeatures.services.size > 5 ? '...' : ''}`);
  console.log(`     Modèles: ${Array.from(dashboard.totalFeatures.dataModels).slice(0, 5).join(', ')}`);
}

// Analyser tous les dashboards
const dashboardsPath = path.join(__dirname, 'src', 'pages', 'dashboards');
const dashboardRoles = [
  'admin',
  'particulier', 
  'vendeur',
  'agent-foncier',
  'banques',
  'investisseur',
  'promoteur',
  'notaires',
  'geometres',
  'municipalite'
];

console.log('🚀 DÉBUT ANALYSE DASHBOARDS');

dashboardRoles.forEach(role => {
  const dashboardPath = path.join(dashboardsPath, role);
  if (fs.existsSync(dashboardPath)) {
    analyzeDashboard(dashboardPath, role);
  } else {
    console.log(`\n⚠️ Dashboard ${role} non trouvé: ${dashboardPath}`);
  }
});

// Analyser les pages publiques principales
console.log(`\n\n🌐 ANALYSE PAGES PUBLIQUES`);
console.log('-'.repeat(50));

const publicPagesPath = path.join(__dirname, 'src', 'pages');
const publicFiles = fs.readdirSync(publicPagesPath).filter(f => f.endsWith('.jsx'));

publicFiles.slice(0, 10).forEach(file => {
  try {
    const filePath = path.join(publicPagesPath, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const features = analyzePage(filePath, content);
    
    const page = {
      name: file.replace(/\.(jsx|js)$/, ''),
      features: features
    };
    
    analysis.publicPages.push(page);
    analysis.totalPages++;
    
    console.log(`  📄 ${page.name}`);
    if (features.services.length > 0) {
      console.log(`     ⚙️ ${features.services.slice(0, 3).join(', ')}`);
    }
  } catch (error) {
    console.log(`  ⚠️ Erreur ${file}: ${error.message}`);
  }
});

console.log(`     ... et ${publicFiles.length - 10} autres pages publiques`);

// Générer le rapport final
console.log(`\n\n📊 RAPPORT FINAL D'ANALYSE`);
console.log('='.repeat(60));

console.log(`\n🎯 STATISTIQUES GLOBALES:`);
console.log(`   📊 Dashboards analysés: ${Object.keys(analysis.dashboards).length}`);
console.log(`   📄 Pages totales: ${analysis.totalPages}`);
console.log(`   🌐 Pages publiques: ${analysis.publicPages.length}`);

// Calculer les besoins API par dashboard
console.log(`\n🔗 BESOINS API PAR DASHBOARD:`);

Object.keys(analysis.dashboards).forEach(role => {
  const dashboard = analysis.dashboards[role];
  console.log(`\n  🎭 ${role.toUpperCase()} (${dashboard.pages.length} pages):`);
  
  // Estimer les endpoints nécessaires
  const crudCount = dashboard.totalFeatures.crud.size;
  const servicesCount = dashboard.totalFeatures.services.size;
  const modelsCount = dashboard.totalFeatures.dataModels.size;
  
  const estimatedEndpoints = Math.max(5, modelsCount * 2 + servicesCount);
  
  console.log(`     📊 Modèles de données: ${modelsCount}`);
  console.log(`     🔧 Opérations CRUD: ${Array.from(dashboard.totalFeatures.crud).join(', ')}`);
  console.log(`     🌐 Endpoints estimés: ~${estimatedEndpoints}`);
  
  // Générer liste des endpoints suggérés
  const endpoints = [];
  if (dashboard.totalFeatures.crud.has('CREATE')) endpoints.push('POST');
  if (dashboard.totalFeatures.crud.has('READ')) endpoints.push('GET', 'GET/:id');
  if (dashboard.totalFeatures.crud.has('UPDATE')) endpoints.push('PUT/:id');
  if (dashboard.totalFeatures.crud.has('DELETE')) endpoints.push('DELETE/:id');
  
  if (endpoints.length > 0) {
    console.log(`     🔗 Endpoints requis: ${endpoints.join(', ')}`);
  }
});

// Sauvegarder l'analyse détaillée
const outputFile = path.join(__dirname, 'backend', 'DETAILED_PAGE_ANALYSIS.json');
const detailedAnalysis = {
  summary: {
    totalDashboards: Object.keys(analysis.dashboards).length,
    totalPages: analysis.totalPages,
    publicPages: analysis.publicPages.length,
    analyzedAt: new Date().toISOString()
  },
  dashboards: analysis.dashboards,
  publicPages: analysis.publicPages.slice(0, 20) // Limiter pour JSON
};

fs.writeFileSync(outputFile, JSON.stringify(detailedAnalysis, null, 2));

console.log(`\n💾 Analyse détaillée sauvegardée: ${outputFile}`);
console.log(`\n🎯 PROCHAINE ÉTAPE: Créer le plan de développement API basé sur cette analyse !`);
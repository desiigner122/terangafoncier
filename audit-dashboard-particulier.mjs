#!/usr/bin/env node

/**
 * 🔍 AUDIT COMPLET DU DASHBOARD PARTICULIER
 * ========================================
 * Script pour analyser toutes les pages et identifier les problèmes
 */

import fs from 'fs';
import path from 'path';

const dashboardDir = 'src/pages/dashboards/particulier';
const auditResults = {
  total: 0,
  withMockData: [],
  withRealData: [],
  nonFunctional: [],
  duplicates: [],
  missing: []
};

// Patterns pour détecter les données mockées
const mockDataPatterns = [
  /useState\s*\(\s*\[.*{/,
  /const\s+\w+\s*=\s*\[.*{/,
  /mockData|dummyData|fakeData|sampleData/i,
  /MOCK|DUMMY|FAKE|SAMPLE/,
  /\[.*{.*id.*:.*'[A-Z]+-\d+'/
];

// Patterns pour détecter l'intégration Supabase
const supabasePatterns = [
  /import.*supabase/i,
  /createClient/,
  /\.from\(/,
  /\.select\(/,
  /\.insert\(/,
  /\.update\(/,
  /\.delete\(/
];

// Patterns pour détecter les fonctionnalités non fonctionnelles
const nonFunctionalPatterns = [
  /TODO|FIXME|HACK/i,
  /console\.log.*not.*implement/i,
  /placeholder|coming soon/i,
  /disabled.*true/,
  /onClick.*=.*undefined/
];

function analyzeFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  
  const analysis = {
    file: fileName,
    path: filePath,
    lineCount: content.split('\n').length,
    hasMockData: false,
    hasSupabase: false,
    nonFunctional: [],
    mockDataCount: 0,
    supabaseIntegration: false
  };

  // Détecter les données mockées
  mockDataPatterns.forEach(pattern => {
    const matches = content.match(new RegExp(pattern.source, 'g'));
    if (matches) {
      analysis.hasMockData = true;
      analysis.mockDataCount += matches.length;
    }
  });

  // Détecter l'intégration Supabase
  supabasePatterns.forEach(pattern => {
    if (pattern.test(content)) {
      analysis.hasSupabase = true;
      analysis.supabaseIntegration = true;
    }
  });

  // Détecter les fonctionnalités non fonctionnelles
  nonFunctionalPatterns.forEach(pattern => {
    const matches = content.match(new RegExp(pattern.source, 'gi'));
    if (matches) {
      analysis.nonFunctional.push(...matches);
    }
  });

  return analysis;
}

function scanDirectory() {
  const files = [];
  
  // Lister tous les fichiers .jsx dans le répertoire
  try {
    const dirContents = fs.readdirSync(dashboardDir);
    dirContents.forEach(file => {
      if (file.endsWith('.jsx') && !file.includes('_OLD') && !file.includes('_BACKUP')) {
        files.push(path.join(dashboardDir, file));
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la lecture du répertoire:', error.message);
    return;
  }

  // Analyser chaque fichier
  files.forEach(filePath => {
    const analysis = analyzeFile(filePath);
    if (analysis) {
      auditResults.total++;
      
      if (analysis.hasMockData) {
        auditResults.withMockData.push(analysis);
      }
      
      if (analysis.hasSupabase) {
        auditResults.withRealData.push(analysis);
      }
      
      if (analysis.nonFunctional.length > 0) {
        auditResults.nonFunctional.push(analysis);
      }
    }
  });

  // Identifier les pages dupliquées
  const fileNames = files.map(f => path.basename(f).replace('.jsx', ''));
  const duplicateNames = fileNames.filter((name, index) => 
    fileNames.indexOf(name) !== index
  );

  auditResults.duplicates = duplicateNames;
}

function generateReport() {
  console.log('\n🔍 AUDIT COMPLET DU DASHBOARD PARTICULIER');
  console.log('==========================================\n');

  console.log(`📊 STATISTIQUES GÉNÉRALES`);
  console.log(`Total de pages analysées: ${auditResults.total}`);
  console.log(`Pages avec données mockées: ${auditResults.withMockData.length}`);
  console.log(`Pages avec données réelles: ${auditResults.withRealData.length}`);
  console.log(`Pages non fonctionnelles: ${auditResults.nonFunctional.length}`);
  console.log(`Pages dupliquées: ${auditResults.duplicates.length}\n`);

  console.log('🎭 PAGES AVEC DONNÉES MOCKÉES (À CORRIGER)');
  console.log('==========================================');
  auditResults.withMockData.forEach(page => {
    console.log(`❌ ${page.file}`);
    console.log(`   📁 ${page.path}`);
    console.log(`   📊 ${page.mockDataCount} structures de données mockées`);
    console.log(`   📝 ${page.lineCount} lignes`);
    console.log('');
  });

  console.log('✅ PAGES AVEC DONNÉES RÉELLES');
  console.log('==============================');
  auditResults.withRealData.forEach(page => {
    console.log(`✅ ${page.file}`);
    console.log(`   📁 ${page.path}`);
    console.log(`   🔗 Intégration Supabase active`);
    console.log('');
  });

  console.log('⚠️ PAGES NON FONCTIONNELLES');
  console.log('============================');
  auditResults.nonFunctional.forEach(page => {
    console.log(`⚠️ ${page.file}`);
    console.log(`   📁 ${page.path}`);
    console.log(`   🚫 Problèmes détectés: ${page.nonFunctional.join(', ')}`);
    console.log('');
  });

  if (auditResults.duplicates.length > 0) {
    console.log('🔄 PAGES DUPLIQUÉES');
    console.log('==================');
    auditResults.duplicates.forEach(duplicate => {
      console.log(`🔄 ${duplicate}`);
    });
    console.log('');
  }

  // Identifier les pages manquantes importantes
  const expectedPages = [
    'ParticulierOverview',
    'ParticulierDemandesTerrains', 
    'ParticulierConstructions',
    'ParticulierMesOffres',
    'ParticulierMessages',
    'ParticulierNotifications',
    'ParticulierDocuments',
    'ParticulierSettings',
    'ParticulierZonesCommunales',
    'ParticulierFinancement'
  ];

  const existingPages = auditResults.withMockData.concat(auditResults.withRealData)
    .map(p => p.file.replace('.jsx', ''));

  const missingPages = expectedPages.filter(page => 
    !existingPages.includes(page)
  );

  if (missingPages.length > 0) {
    console.log('🔍 PAGES MANQUANTES IMPORTANTES');
    console.log('===============================');
    missingPages.forEach(page => {
      console.log(`❓ ${page}.jsx`);
    });
    console.log('');
  }

  // Recommandations
  console.log('🎯 RECOMMANDATIONS PRIORITAIRES');
  console.log('===============================');
  console.log('1. 🔧 Corriger les pages avec données mockées');
  console.log('2. 🗑️ Supprimer ou consolider les pages dupliquées');
  console.log('3. ⚡ Activer les fonctionnalités non fonctionnelles');
  console.log('4. 📊 Créer les tables Supabase manquantes');
  console.log('5. 🧪 Tester toutes les fonctionnalités');
  console.log('');

  // Sauvegarder le rapport
  const reportData = {
    timestamp: new Date().toISOString(),
    ...auditResults,
    recommendations: [
      'Corriger les pages avec données mockées',
      'Supprimer ou consolider les pages dupliquées', 
      'Activer les fonctionnalités non fonctionnelles',
      'Créer les tables Supabase manquantes',
      'Tester toutes les fonctionnalités'
    ]
  };

  fs.writeFileSync('audit-dashboard-particulier.json', JSON.stringify(reportData, null, 2));
  console.log('📄 Rapport détaillé sauvegardé dans: audit-dashboard-particulier.json');
}

// Exécuter l'audit
scanDirectory();
generateReport();
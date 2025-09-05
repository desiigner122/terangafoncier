#!/usr/bin/env node

// ================================================================
// AUDIT COMPLET APPLICATION TERANGA FONCIER
// Analyse de tous les dashboards, rôles, fonctionnalités
// ================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🔍 AUDIT COMPLET TERANGA FONCIER");
console.log("=====================================");
console.log("");

// Structure attendue des rôles
const ROLES = {
  admin: "Administrateur système",
  agent_foncier: "Agent foncier certifié", 
  banque: "Institution bancaire",
  particulier: "Utilisateur particulier",
  vendeur: "Vendeur de terrains",
  investisseur: "Investisseur immobilier",
  notaire: "Notaire officiel",
  geometre: "Géomètre expert"
};

// Fonctionnalités par rôle
const FEATURES_BY_ROLE = {
  admin: [
    "dashboard", "users", "roles", "analytics", "reports", "logs", 
    "system_config", "ai_management", "backup", "security"
  ],
  agent_foncier: [
    "dashboard", "parcelles", "verifications", "signatures", "reports",
    "clients", "calendar", "documents", "ai_assistance"
  ],
  banque: [
    "dashboard", "credits", "evaluations", "portfolio", "analytics",
    "clients", "risk_analysis", "reports", "notifications"
  ],
  particulier: [
    "dashboard", "profile", "parcelles", "transactions", "documents",
    "messages", "notifications", "blog", "marketplace"
  ],
  vendeur: [
    "dashboard", "parcelles", "listings", "analytics", "messages",
    "documents", "ai_valuation", "marketing", "clients"
  ],
  investisseur: [
    "dashboard", "portfolio", "analytics", "market_data", "reports",
    "parcelles", "roi_calculator", "ai_insights", "news"
  ],
  notaire: [
    "dashboard", "contracts", "signatures", "legal_docs", "clients",
    "calendar", "archive", "templates", "validations"
  ],
  geometre: [
    "dashboard", "measurements", "maps", "technical_docs", "validations",
    "equipment", "projects", "clients", "certifications"
  ]
};

// Audit des fichiers existants
const auditResults = {
  dashboards: {},
  components: {},
  pages: {},
  missing: [],
  issues: [],
  recommendations: []
};

function scanDirectory(dir, basePath = '') {
  const files = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.join(basePath, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        files.push(...scanDirectory(fullPath, relativePath));
      } else if (entry.isFile() && (entry.name.endsWith('.jsx') || entry.name.endsWith('.js'))) {
        files.push({
          name: entry.name,
          path: relativePath,
          fullPath,
          type: entry.name.endsWith('.jsx') ? 'component' : 'script'
        });
      }
    }
  } catch (error) {
    console.log(`❌ Erreur lecture ${dir}: ${error.message}`);
  }
  
  return files;
}

// Scanner le projet
const srcFiles = scanDirectory(path.join(__dirname, 'src'));

console.log("📁 STRUCTURE FICHIERS DÉTECTÉE:");
console.log("===============================");

// Organiser par type
const filesByType = {
  pages: srcFiles.filter(f => f.path.includes('/pages/')),
  components: srcFiles.filter(f => f.path.includes('/components/')),
  context: srcFiles.filter(f => f.path.includes('/context/')),
  lib: srcFiles.filter(f => f.path.includes('/lib/')),
  hooks: srcFiles.filter(f => f.path.includes('/hooks/')),
  utils: srcFiles.filter(f => f.path.includes('/utils/'))
};

Object.entries(filesByType).forEach(([type, files]) => {
  console.log(`\n📂 ${type.toUpperCase()} (${files.length} fichiers):`);
  files.forEach(file => {
    console.log(`   ${file.path}`);
  });
});

// Analyser les dashboards existants
console.log("\n🎛️ DASHBOARDS EXISTANTS:");
console.log("========================");

const dashboardFiles = srcFiles.filter(f => 
  f.name.toLowerCase().includes('dashboard') || 
  f.path.toLowerCase().includes('dashboard')
);

dashboardFiles.forEach(file => {
  console.log(`✅ ${file.path}`);
  auditResults.dashboards[file.name] = file.path;
});

// Identifier les dashboards manquants
console.log("\n❌ DASHBOARDS MANQUANTS:");
console.log("========================");

Object.entries(ROLES).forEach(([role, description]) => {
  const expectedDashboard = `${role}Dashboard.jsx`;
  const exists = dashboardFiles.some(f => 
    f.name.toLowerCase().includes(role.toLowerCase()) && 
    f.name.includes('Dashboard')
  );
  
  if (!exists) {
    console.log(`❌ ${expectedDashboard} - ${description}`);
    auditResults.missing.push({
      type: 'dashboard',
      role,
      file: expectedDashboard,
      description
    });
  } else {
    console.log(`✅ Dashboard ${role} existe`);
  }
});

// Analyser les fonctionnalités
console.log("\n🔧 FONCTIONNALITÉS PAR RÔLE:");
console.log("============================");

Object.entries(FEATURES_BY_ROLE).forEach(([role, features]) => {
  console.log(`\n👤 ${role.toUpperCase()} (${ROLES[role]}):`);
  
  features.forEach(feature => {
    const featureFiles = srcFiles.filter(f => 
      f.name.toLowerCase().includes(feature.toLowerCase()) ||
      f.path.toLowerCase().includes(feature.toLowerCase())
    );
    
    if (featureFiles.length > 0) {
      console.log(`   ✅ ${feature} (${featureFiles.length} fichiers)`);
    } else {
      console.log(`   ❌ ${feature} - MANQUANT`);
      auditResults.missing.push({
        type: 'feature',
        role,
        feature,
        files: []
      });
    }
  });
});

// Recommandations
console.log("\n💡 RECOMMANDATIONS:");
console.log("===================");

const recommendations = [
  "1. Créer les dashboards manquants pour chaque rôle",
  "2. Implémenter le système de rôles dynamique",
  "3. Créer les composants de gestion des utilisateurs",
  "4. Implémenter la synchronisation temps réel Supabase",
  "5. Créer le système de notifications",
  "6. Implémenter les signatures électroniques",
  "7. Créer le système de messagerie",
  "8. Implémenter la gestion des parcelles",
  "9. Créer les systèmes d'analytics par rôle",
  "10. Implémenter l'IA pour chaque métier"
];

recommendations.forEach(rec => {
  console.log(`💡 ${rec}`);
  auditResults.recommendations.push(rec);
});

console.log("\n📊 RÉSUMÉ AUDIT:");
console.log("================");
console.log(`✅ Fichiers analysés: ${srcFiles.length}`);
console.log(`✅ Dashboards existants: ${dashboardFiles.length}`);
console.log(`❌ Dashboards manquants: ${auditResults.missing.filter(m => m.type === 'dashboard').length}`);
console.log(`❌ Fonctionnalités manquantes: ${auditResults.missing.filter(m => m.type === 'feature').length}`);
console.log(`💡 Recommandations: ${auditResults.recommendations.length}`);

// Sauvegarder le rapport
const reportPath = path.join(__dirname, 'AUDIT_COMPLET_RAPPORT.json');
fs.writeFileSync(reportPath, JSON.stringify(auditResults, null, 2));

console.log(`\n📄 Rapport sauvegardé: ${reportPath}`);
console.log("\n🚀 PRÊT POUR LA REFONTE COMPLÈTE !");

import fs from 'fs';

const template = (name, title, icon, color) => `import React from 'react';
import { motion } from 'framer-motion';
import { ${icon} } from 'lucide-react';

const ${name} = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-${color}-50 to-${color}-100 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">${title}</h1>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="text-center py-12">
            <${icon} className="h-16 w-16 text-${color}-600 mx-auto mb-4" />
            <p className="text-gray-600">Cette page est en cours de développement.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ${name};`;

const files = [
  // Banque
  ['src/pages/dashboards/banque/GuaranteesPage.jsx', 'GuaranteesPage', 'Gestion des Garanties', 'Shield', 'indigo'],
  ['src/pages/dashboards/banque/CompliancePage.jsx', 'CompliancePage', 'Conformité Bancaire', 'CheckCircle', 'indigo'],
  
  // Mairie
  ['src/pages/dashboards/mairie/MairieRequestsPage.jsx', 'MairieRequestsPage', 'Demandes Municipales', 'FileText', 'teal'],
  ['src/pages/dashboards/mairie/LandManagementPage.jsx', 'LandManagementPage', 'Gestion Foncière', 'Map', 'teal'],
  ['src/pages/dashboards/mairie/CadastrePage.jsx', 'CadastrePage', 'Cadastre Municipal', 'MapPin', 'teal'],
  ['src/pages/dashboards/mairie/DisputesPage.jsx', 'DisputesPage', 'Litiges Fonciers', 'AlertTriangle', 'teal'],
  ['src/pages/dashboards/mairie/UrbanPlanPage.jsx', 'UrbanPlanPage', 'Plan Urbanisme', 'Building', 'teal'],
  ['src/pages/dashboards/mairie/MairieReportsPage.jsx', 'MairieReportsPage', 'Rapports Municipaux', 'BarChart3', 'teal'],
  
  // Notaire
  ['src/pages/dashboards/notaire/CasesPage.jsx', 'CasesPage', 'Dossiers Notariaux', 'Folder', 'purple'],
  ['src/pages/dashboards/notaire/AuthenticationPage.jsx', 'AuthenticationPage', 'Authentification', 'Key', 'purple'],
  ['src/pages/dashboards/notaire/ArchivesPage.jsx', 'ArchivesPage', 'Archives Notariales', 'Archive', 'purple'],
  ['src/pages/dashboards/notaire/ComplianceCheckPage.jsx', 'ComplianceCheckPage', 'Vérification Conformité', 'Shield', 'purple'],
  
  // Solutions
  ['src/pages/solutions/dashboards/BanquesDashboardPage.jsx', 'BanquesDashboardPage', 'Solutions Banques', 'Building', 'indigo'],
  ['src/pages/solutions/dashboards/InvestisseursDashboardPage.jsx', 'InvestisseursDashboardPage', 'Solutions Investisseurs', 'TrendingUp', 'purple'],
  ['src/pages/solutions/dashboards/PromoteursDashboardPage.jsx', 'PromoteursDashboardPage', 'Solutions Promoteurs', 'Building', 'emerald'],
  ['src/pages/solutions/dashboards/MairiesDashboardPage.jsx', 'MairiesDashboardPage', 'Solutions Mairies', 'Building', 'teal'],
  ['src/pages/solutions/dashboards/NotairesDashboardPage.jsx', 'NotairesDashboardPage', 'Solutions Notaires', 'FileText', 'purple'],
  ['src/pages/solutions/dashboards/VendeurDashboardPage.jsx', 'VendeurDashboardPage', 'Solutions Vendeurs', 'Home', 'orange'],
  ['src/pages/solutions/dashboards/mairies/TerrainOversightPage.jsx', 'TerrainOversightPage', 'Supervision Terrain', 'Eye', 'teal'],
  ['src/pages/solutions/dashboards/mairies/TerrainAnalyticsPage.jsx', 'TerrainAnalyticsPage', 'Analytics Terrain', 'BarChart3', 'teal'],
  
  // Dashboards modernes
  ['src/pages/dashboards/ModernBanqueDashboard.jsx', 'ModernBanqueDashboard', 'Dashboard Banque Moderne', 'Building', 'indigo'],
  ['src/pages/dashboards/ModernNotaireDashboard.jsx', 'ModernNotaireDashboard', 'Dashboard Notaire Moderne', 'FileText', 'purple'],
  ['src/pages/dashboards/ModernPromoteurDashboard.jsx', 'ModernPromoteurDashboard', 'Dashboard Promoteur Moderne', 'Building', 'emerald'],
  ['src/pages/dashboards/ModernMairieDashboard.jsx', 'ModernMairieDashboard', 'Dashboard Mairie Moderne', 'Building', 'teal'],
  ['src/pages/dashboards/ModernAcheteurDashboard.jsx', 'ModernAcheteurDashboard', 'Dashboard Acheteur Moderne', 'Home', 'blue'],
  ['src/pages/dashboards/ModernVendeurDashboard.jsx', 'ModernVendeurDashboard', 'Dashboard Vendeur Moderne', 'Building', 'orange'],
  ['src/pages/dashboards/ModernInvestisseurDashboard.jsx', 'ModernInvestisseurDashboard', 'Dashboard Investisseur Moderne', 'TrendingUp', 'purple'],
  ['src/pages/dashboards/ModernGeometreDashboard.jsx', 'ModernGeometreDashboard', 'Dashboard Géomètre Moderne', 'Map', 'green'],
  ['src/pages/dashboards/ModernAgentFoncierDashboard.jsx', 'ModernAgentFoncierDashboard', 'Dashboard Agent Foncier Moderne', 'MapPin', 'cyan']
];

let created = 0;
files.forEach(([path, name, title, icon, color]) => {
  try {
    const dir = path.split('/').slice(0, -1).join('/');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, template(name, title, icon, color));
      console.log(`✅ ${path}`);
      created++;
    }
  } catch (e) {
    console.log(`❌ ${path}: ${e.message}`);
  }
});

console.log(`\\n🎉 ${created} fichiers créés!`);

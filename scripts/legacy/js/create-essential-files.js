import fs from 'fs';
import path from 'path';

console.log('🚀 CRÉATION RAPIDE DES FICHIERS MANQUANTS');
console.log('=========================================\n');

const createDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 ${dirPath}`);
  }
};

const createFile = (filePath, componentName, title, color = 'blue') => {
  const content = `import React from 'react';
import { motion } from 'framer-motion';
import { Building } from 'lucide-react';

const ${componentName} = () => {
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
            <Building className="h-16 w-16 text-${color}-600 mx-auto mb-4" />
            <p className="text-gray-600">Cette page est en cours de développement.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ${componentName};`;

  createDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  console.log(`✅ ${filePath}`);
};

// Créer tous les fichiers essentiels
const files = [
  ['src/pages/dashboards/AdminDashboard.jsx', 'AdminDashboard', 'Dashboard Administration', 'slate'],
  ['src/pages/dashboards/VendeurDashboard.jsx', 'VendeurDashboard', 'Dashboard Vendeur', 'orange'],
  ['src/pages/dashboards/InvestisseurDashboard.jsx', 'InvestisseurDashboard', 'Dashboard Investisseur', 'purple'],
  ['src/pages/dashboards/PromoteurDashboard.jsx', 'PromoteurDashboard', 'Dashboard Promoteur', 'emerald'],
  ['src/pages/dashboards/MunicipaliteDashboard.jsx', 'MunicipaliteDashboard', 'Dashboard Municipalité', 'teal'],
  ['src/components/parcels/ParcelCard.jsx', 'ParcelCard', 'Carte Parcelle', 'blue']
];

files.forEach(([filePath, component, title, color]) => {
  createFile(filePath, component, title, color);
});

console.log('\\n🎉 Fichiers essentiels créés!');
console.log('🚀 Testez maintenant: npm run build');

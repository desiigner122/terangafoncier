import React from 'react';
import { motion } from 'framer-motion';
import { Building, Calculator, FileText } from 'lucide-react';

const LandValuationPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Évaluation Foncière</h1>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="text-center py-12">
            <Calculator className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Module d'évaluation des biens immobiliers en cours de développement.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LandValuationPage;

import React from 'react';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const ModernAcheteurDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard Acheteur Moderne</h1>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="text-center py-12">
            <Home className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Cette page est en cours de développement.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernAcheteurDashboard;
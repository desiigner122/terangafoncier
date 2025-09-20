import React from 'react';
import { motion } from 'framer-motion';
import { Map } from 'lucide-react';

const ModernGeometreDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard GÃ©omÃ¨tre Moderne</h1>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="text-center py-12">
            <Map className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Cette page est en cours de dÃ©veloppement.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernGeometreDashboard;

import React from 'react';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { AIEstimationWidget, AIMarketInsights } from '../../../components/AIComponents';

const VendeurDashboardPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Solutions Vendeurs</h1>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          {/* 🚀 WIDGETS IA TERANGA - VENDEURS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AIEstimationWidget className="w-full" />
            <AIMarketInsights region="Dakar" className="w-full" />
          </div>
          
          <div className="text-center py-12">
            <Home className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <p className="text-gray-600">Cette page est en cours de développement.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VendeurDashboardPage;
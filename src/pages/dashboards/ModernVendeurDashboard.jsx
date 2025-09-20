import React from 'react';
import { motion } from 'framer-motion';
import { Building, PlusCircle, BarChart3 } from 'lucide-react';
import DashboardHeaderWrapper from '@/components/common/DashboardHeaderWrapper';
import { useNavigate } from 'react-router-dom';

const ModernVendeurDashboard = () => {
  const navigate = useNavigate();

  // Actions spécifiques pour le vendeur
  const customActions = [
    { 
      icon: PlusCircle, 
      title: 'Nouvelle Parcelle', 
      onClick: () => navigate('/seller/add-parcel'), 
      className: 'bg-green-500 text-white hover:bg-green-600' 
    },
    { 
      icon: BarChart3, 
      title: 'Analyses', 
      onClick: () => navigate('/seller/analytics'), 
      className: 'bg-blue-500 text-white hover:bg-blue-600' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header unifié moderne */}
      <DashboardHeaderWrapper 
        userRole="Vendeur"
        customActions={customActions}
        showQuickActions={true}
        showSearch={true}
        enableNotifications={true}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto p-6"
      >
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <p className="text-gray-600">Cette page est en cours de développement.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ModernVendeurDashboard;
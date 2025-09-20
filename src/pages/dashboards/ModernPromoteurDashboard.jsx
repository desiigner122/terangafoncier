import React from 'react';
import { motion } from 'framer-motion';
import { Building, Building2, Users, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardHeaderWrapper from "@/components/common/DashboardHeaderWrapper";

const ModernPromoteurDashboard = () => {
  const navigate = useNavigate();

  // Actions spécifiques pour le promoteur
  const customActions = [
    { 
      icon: Building2, 
      title: 'Nouveau Projet', 
      onClick: () => navigate('/developer/new-project'), 
      className: 'bg-purple-500 text-white hover:bg-purple-600' 
    },
    { 
      icon: Users, 
      title: 'Prospects', 
      onClick: () => navigate('/developer/prospects'), 
      className: 'bg-orange-500 text-white hover:bg-orange-600' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100">
      {/* Header unifié moderne */}
      <DashboardHeaderWrapper 
        userRole="Promoteur"
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
            <Building className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
            <p className="text-gray-600">Cette page est en cours de développement.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ModernPromoteurDashboard;

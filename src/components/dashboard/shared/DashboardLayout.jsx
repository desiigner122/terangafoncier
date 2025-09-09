import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DashboardLayout = ({ children, title, subtitle, userRole, stats = [] }) => {
  const getRoleColor = (role) => {
    const colors = {
      'Particulier': 'from-emerald-500 to-teal-500',
      'Vendeur Particulier': 'from-purple-500 to-indigo-500',
      'Vendeur Pro': 'from-orange-500 to-red-500',
      'Investisseur': 'from-blue-500 to-cyan-500',
      'Promoteur': 'from-yellow-500 to-orange-500',
      'Municipalité': 'from-green-500 to-emerald-500',
      'Admin': 'from-red-500 to-pink-500',
      'Banque': 'from-indigo-500 to-purple-500',
      'Notaire': 'from-gray-500 to-slate-500',
      'Géomètre': 'from-cyan-500 to-blue-500',
      'Agent Foncier': 'from-amber-500 to-yellow-500'
    };
    return colors[role] || 'from-gray-500 to-slate-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Section */}
      <div className={`bg-gradient-to-r ${getRoleColor(userRole)} text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{title}</h1>
                <p className="text-white/90 text-lg">{subtitle}</p>
                <Badge 
                  variant="secondary" 
                  className="mt-3 bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  {userRole}
                </Badge>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-white/80 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
      </div>

      {/* Stats Mobile View */}
      <div className="md:hidden px-6 py-4 bg-white border-b">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardLayout;

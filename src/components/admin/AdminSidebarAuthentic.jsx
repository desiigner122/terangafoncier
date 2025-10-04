/**
 * SIDEBAR ADMIN AUTHENTIQUE - EXTRAITE DU DASHBOARD PRINCIPAL
 * 
 * Cette sidebar est identique à celle du CompleteSidebarAdminDashboard
 * pour maintenir une cohérence parfaite sur toutes les pages admin.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft,
  ChevronRight,
  X,
  Shield,
  Bell,
  LogOut
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TerangaLogo from '@/components/ui/TerangaLogo';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const AdminSidebarAuthentic = ({ 
  navigationItems = [], 
  activeTab = 'overview',
  onTabChange = () => {},
  dashboardData = {},
  sidebarCollapsed = false,
  setSidebarCollapsed = () => {},
  mobileMenuOpen = false,
  setMobileMenuOpen = () => {}
}) => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      console.log('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg z-50
        ${sidebarCollapsed ? 'w-16' : 'w-80'}
        ${mobileMenuOpen ? 'translate-x-0' : 'lg:translate-x-0 -translate-x-full'}
        transition-all duration-300 ease-in-out
      `}
    >
      <div className="flex flex-col h-full">
        {/* Header Modernisé */}
        <div className="p-6 border-b border-gradient-to-r from-amber-100 to-yellow-100 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="flex-shrink-0">
                  <TerangaLogo className="h-12 w-12" showText={false} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-700 via-yellow-700 to-orange-700 bg-clip-text text-transparent">
                    Admin Panel
                  </h2>
                  <p className="text-sm font-medium text-amber-600">
                    Teranga Foncier - Administration
                  </p>
                </div>
              </motion.div>
            )}
            {sidebarCollapsed && (
              <div className="flex justify-center w-full">
                <TerangaLogo className="h-8 w-8" showText={false} />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex hover:bg-amber-100 text-amber-700 transition-colors"
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden hover:bg-amber-100 text-amber-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Modernisée */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-3 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    if (item.route) {
                      // Rediriger vers les pages modernisées
                      window.location.href = item.route;
                    } else if (item.isInternal || ['dashboard', 'overview'].includes(item.id)) {
                      // Rester sur cette page avec onglets internes
                      onTabChange(item.id);
                      setMobileMenuOpen(false);
                    } else {
                      // Fallback
                      onTabChange(item.id);
                      setMobileMenuOpen(false);
                    }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 text-amber-800 border border-amber-300 shadow-sm' 
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 hover:text-amber-700'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-amber-600' : 'text-gray-500'}`} />
                  
                  {!sidebarCollapsed && (
                    <>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.label}</p>
                        <p className="text-xs text-gray-500 truncate">{item.description}</p>
                      </div>
                      
                      {item.badge && (
                        <Badge 
                          className={`text-xs ${item.badgeColor || 'bg-blue-500'} text-white`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* User Section Modernisée */}
        <div className="p-4 border-t border-gradient-to-r from-amber-200 to-yellow-200 bg-gradient-to-br from-amber-25 to-yellow-25">
          {!sidebarCollapsed && (
            <motion.div 
              className="flex items-center space-x-3 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-amber-800 truncate">Administrateur</p>
                <p className="text-xs text-amber-600 truncate">admin@terangafoncier.sn</p>
              </div>
            </motion.div>
          )}
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="flex-1 hover:bg-amber-100 text-amber-700">
              <Bell className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-2 font-medium">Notifications</span>}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-red-100 text-red-600">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSidebarAuthentic;
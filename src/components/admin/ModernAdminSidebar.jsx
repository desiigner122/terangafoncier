/**
 * SIDEBAR MODERNE PARTAGÉE POUR TOUTES LES PAGES ADMIN MODERNISÉES
 * 
 * Cette sidebar est utilisée par toutes les pages Modern* pour une navigation cohérente
 * avec des données 100% réelles et des fonctionnalités IA/Blockchain.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Users, 
  Building2, 
  Activity, 
  BarChart3, 
  Settings,
  ArrowLeft,
  Database,
  Brain,
  Zap,
  Crown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';

const ModernAdminSidebar = ({ stats = {} }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      path: '/admin/dashboard',
      description: 'Vue d\'ensemble',
      badge: null
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: Users,
      path: '/admin/users',
      description: 'Gestion des comptes',
      badge: stats.newUsers > 0 ? stats.newUsers.toString() : null,
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'properties',
      label: 'Propriétés',
      icon: Building2,
      path: '/admin/parcels',
      description: 'Validation & gestion',
      badge: stats.pendingProperties > 0 ? stats.pendingProperties.toString() : null,
      badgeColor: 'bg-yellow-500'
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: Activity,
      path: '/admin/transactions',
      description: 'Suivi des échanges',
      badge: stats.pendingTransactions > 0 ? stats.pendingTransactions.toString() : null,
      badgeColor: 'bg-orange-500'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
      description: 'Analyses avancées',
      badge: 'AI',
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      path: '/admin/settings',
      description: 'Configuration',
      badge: null
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-72 bg-white shadow-lg border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-sm text-gray-600">Pages Modernisées</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/dashboard')}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Badges de statut */}
        <div className="flex flex-wrap gap-1">
          <Badge className="bg-green-100 text-green-800 text-xs">
            <Database className="h-3 w-3 mr-1" />
            100% Réel
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 text-xs">
            <Brain className="h-3 w-3 mr-1" />
            IA Active
          </Badge>
          <Badge className="bg-orange-100 text-orange-800 text-xs">
            <Zap className="h-3 w-3 mr-1" />
            Blockchain
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.path);
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200
                ${isActive 
                  ? 'bg-blue-50 border border-blue-200 text-blue-700 shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </div>
              
              {item.badge && (
                <Badge className={`text-xs ${item.badgeColor || 'bg-gray-500'} text-white`}>
                  {item.badge}
                </Badge>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Crown className="h-3 w-3" />
          <span>Version Pro • IA • Blockchain</span>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          Teranga Foncier Admin • 2025
        </div>
      </div>
    </div>
  );
};

export default ModernAdminSidebar;
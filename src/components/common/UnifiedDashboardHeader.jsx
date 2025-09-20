import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  User,
  Search,
  Settings,
  LogOut,
  ChevronDown,
  Home,
  MessageSquare,
  Heart,
  FileText,
  Zap,
  TrendingUp,
  Menu,
  X
} from 'lucide-react';

import { useAuth } from '@/contexts/TempSupabaseAuthContext';

const UnifiedDashboardHeader = ({ 
  title, 
  subtitle, 
  userRole,
  showQuickActions = true,
  showSearch = true,
  enableNotifications = true,
  customActions = []
}) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showQuickNav, setShowQuickNav] = useState(false);
  
  // Actions rapides par rôle
  const quickActions = {
    'Particulier': [
      { icon: Home, label: 'Parcelles', href: '/parcelles-vendeurs', color: 'bg-blue-500' },
      { icon: TrendingUp, label: 'Projets', href: '/promoters-projects', color: 'bg-green-500' },
      { icon: Heart, label: 'Favoris', href: '/favorites', color: 'bg-red-500' },
      { icon: FileText, label: 'Demandes', href: '/my-requests', color: 'bg-purple-500' }
    ],
    'Vendeur': [
      { icon: Home, label: 'Mes Parcelles', href: '/seller/parcels', color: 'bg-blue-500' },
      { icon: TrendingUp, label: 'Ventes', href: '/seller/sales', color: 'bg-green-500' },
      { icon: FileText, label: 'Contrats', href: '/seller/contracts', color: 'bg-purple-500' },
      { icon: User, label: 'Acheteurs', href: '/seller/buyers', color: 'bg-orange-500' }
    ],
    'Promoteur': [
      { icon: Home, label: 'Mes Projets', href: '/developer/projects', color: 'bg-blue-500' },
      { icon: TrendingUp, label: 'Ventes VEFA', href: '/developer/vefa-sales', color: 'bg-green-500' },
      { icon: FileText, label: 'Construction', href: '/developer/construction', color: 'bg-purple-500' },
      { icon: User, label: 'Clients', href: '/developer/clients', color: 'bg-orange-500' }
    ]
  };

  const roleQuickActions = quickActions[userRole] || [];

  // Notifications simulées
  const notifications = [
    { id: 1, title: 'Nouveau message', message: 'Vous avez reçu un message de...', time: '2 min', unread: true },
    { id: 2, title: 'Mise à jour parcelle', message: 'Statut de votre parcelle modifié', time: '1h', unread: true },
    { id: 3, title: 'Paiement confirmé', message: 'Votre paiement a été traité', time: '3h', unread: false }
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const userName = user?.email?.split('@')[0] || 'Utilisateur';
  const userInitials = userName.substring(0, 2).toUpperCase();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
            </motion.div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-sm text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Navigation mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setShowQuickNav(!showQuickNav)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              {showQuickNav ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Actions centrales */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Barre de recherche */}
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            )}

            {/* Actions rapides */}
            {showQuickActions && roleQuickActions.length > 0 && (
              <div className="flex items-center space-x-2">
                {roleQuickActions.slice(0, 3).map((action, index) => (
                  <motion.button
                    key={action.href}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(action.href)}
                    className={`${action.color} text-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow`}
                    title={action.label}
                  >
                    <action.icon className="w-4 h-4" />
                  </motion.button>
                ))}
                {roleQuickActions.length > 3 && (
                  <button className="text-gray-500 hover:text-gray-700 p-2">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            
            {/* Notifications */}
            {enableNotifications && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                  className="relative p-2 text-gray-500 hover:text-gray-700 bg-gray-50 rounded-lg"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                    2
                  </span>
                </motion.button>

                <AnimatePresence>
                  {showNotificationDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div key={notif.id} className={`p-3 border-b border-gray-50 hover:bg-gray-50 ${notif.unread ? 'bg-blue-50' : ''}`}>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium text-sm text-gray-900">{notif.title}</p>
                                <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                              </div>
                              <span className="text-xs text-gray-500">{notif.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-100">
                        <button 
                          onClick={() => navigate('/notifications')}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Voir toutes les notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Actions personnalisées */}
            {customActions.map((action, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={action.onClick}
                className={`p-2 rounded-lg ${action.className || 'text-gray-500 hover:text-gray-700 bg-gray-50'}`}
                title={action.title}
              >
                <action.icon className="w-5 h-5" />
              </motion.button>
            ))}

            {/* Menu utilisateur */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{userInitials}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                  >
                    <div className="p-4 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{userName}</p>
                      <p className="text-sm text-gray-500">{userRole}</p>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => navigate('/settings')}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Paramètres
                      </button>
                      <button
                        onClick={() => navigate('/messages')}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <MessageSquare className="w-4 h-4 mr-3" />
                        Messages
                      </button>
                    </div>
                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Se déconnecter
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Navigation mobile expandée */}
        <AnimatePresence>
          {showQuickNav && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 py-4"
            >
              <div className="grid grid-cols-2 gap-3">
                {roleQuickActions.map((action, index) => (
                  <motion.button
                    key={action.href}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      navigate(action.href);
                      setShowQuickNav(false);
                    }}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div className={`${action.color} text-white p-2 rounded-md`}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default UnifiedDashboardHeader;
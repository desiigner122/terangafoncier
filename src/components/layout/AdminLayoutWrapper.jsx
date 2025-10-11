/**
 * ADMIN LAYOUT WRAPPER - Utilise la sidebar de CompleteSidebarAdminDashboard
 * 
 * Ce composant extrait la sidebar et la structure de CompleteSidebarAdminDashboard
 * pour l'appliquer aux pages individuelles (AdminLeadsList, AdminPagesList, etc.)
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import TerangaLogo from '@/components/ui/TerangaLogo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { 
  ChevronLeft,
  ChevronRight,
  X,
  Home,
  Users,
  Building2,
  DollarSign,
  BarChart3,
  Flag,
  Settings,
  Bell,
  LogOut,
  User,
  Shield, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  PieChart,
  Globe,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Filter,
  Search,
  UserCheck,
  UserX,
  FileText,
  Mail,
  BookOpen,
  Crown,
  Activity,
  Zap,
  Database,
  Link,
  Archive,
  MessageSquare,
  Calendar,
  CreditCard,
  Briefcase,
  Coffee,
  ExternalLink
} from 'lucide-react';

const AdminLayoutWrapper = ({ children, activePageId = 'overview' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, profile, user } = useAuth();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalProperties: 0,
      totalTransactions: 0,
      pendingProperties: 0,
      newLeads: 0,
      activeSubscriptions: 0,
      totalBlogs: 0
    }
  });

  // Navigation items identiques à CompleteSidebarAdminDashboard
  const navigationItems = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: Home,
      description: 'Dashboard principal et statistiques',
      route: '/admin'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Statistiques et graphiques avancés',
      route: '/admin/analytics'
    },
    {
      id: 'validation',
      label: '⚠️ Validation',
      icon: AlertTriangle,
      description: 'Propriétés en attente d\'approbation',
      badge: dashboardData.stats?.pendingProperties > 0 ? dashboardData.stats.pendingProperties.toString() : null,
      badgeColor: 'bg-orange-500',
      route: '/admin/validation'
    },
    {
      id: 'reports',
      label: 'Signalements',
      icon: Flag,
      description: 'Modération et signalements',
      route: '/admin/reports'
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: Users,
      description: 'Gestion complète avec données réelles',
      badge: dashboardData.stats?.totalUsers > 0 ? dashboardData.stats.totalUsers.toString() : null,
      badgeColor: 'bg-blue-500',
      route: '/admin/users'
    },
    {
      id: 'subscriptions',
      label: 'Abonnements',
      icon: Crown,
      description: 'Plans et abonnements utilisateurs',
      route: '/admin/subscriptions'
    },
    {
      id: 'properties',
      label: 'Propriétés',
      icon: Building2,
      description: 'Gestion des propriétés',
      badge: dashboardData.stats?.totalProperties > 0 ? dashboardData.stats.totalProperties.toString() : null,
      badgeColor: 'bg-purple-500',
      route: '/admin/properties'
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: DollarSign,
      description: 'Historique des transactions',
      route: '/admin/transactions'
    },
    {
      id: 'financial',
      label: 'Finance',
      icon: DollarSign,
      description: 'Aperçu financier global',
      badge: 'RÉEL',
      badgeColor: 'bg-emerald-500',
      route: '/admin/revenue'
    },
    // PAGES PHASE 1
    {
      id: 'cms',
      label: '📄 Pages CMS',
      icon: FileText,
      description: 'Gestion des pages du site',
      badge: 'NEW',
      badgeColor: 'bg-green-500',
      route: '/admin/cms/pages'
    },
    {
      id: 'leads',
      label: '📧 Leads Marketing',
      icon: Mail,
      description: 'Inbox des contacts et leads',
      badge: dashboardData.stats?.newLeads > 0 ? dashboardData.stats.newLeads.toString() : null,
      badgeColor: 'bg-blue-500',
      route: '/admin/marketing/leads'
    },
    {
      id: 'blog',
      label: '📝 Blog',
      icon: BookOpen,
      description: 'Articles et contenus blog',
      route: '/admin/blog'
    },
    {
      id: 'support',
      label: 'Support',
      icon: MessageSquare,
      description: 'Tickets et support client',
      route: '/admin/support'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration système',
      route: '/admin/settings'
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleNavigation = (item) => {
    if (item.route && item.route !== location.pathname) {
      navigate(item.route);
    }
    setMobileMenuOpen(false);
  };

  // Déterminer la page active basée sur l'URL
  const getActivePage = () => {
    const path = location.pathname;
    return navigationItems.find(item => 
      item.route === path || 
      (item.id === 'cms' && path.includes('/admin/cms')) ||
      (item.id === 'leads' && path.includes('/admin/marketing'))
    ) || { id: 'overview' };
  };

  const activePage = getActivePage();

  // Sidebar Component (extraite de CompleteSidebarAdminDashboard)
  const Sidebar = () => (
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
        {/* Header */}
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

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-3 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage.id === item.id;
              
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: sidebarCollapsed ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => handleNavigation(item)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 shadow-md border border-amber-200' 
                        : 'hover:bg-gray-50 text-gray-700 hover:text-amber-700'
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-amber-600' : ''}`} />
                    {!sidebarCollapsed && (
                      <>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{item.label}</div>
                          <div className="text-xs opacity-70">{item.description}</div>
                        </div>
                        {item.badge && (
                          <Badge className={`text-xs ${item.badgeColor || 'bg-gray-500'} text-white`}>
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name || user?.email?.split('@')[0] || 'Administrateur'}
                </p>
                <p className="text-xs text-gray-500 truncate">Administrateur</p>
              </div>
            </div>
          )}
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {!sidebarCollapsed && 'Déconnexion'}
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-25 to-yellow-25">
      <Sidebar />
      
      {/* Mobile Menu Button */}
      <Button
        onClick={() => setMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden bg-white shadow-lg border border-gray-200"
        size="sm"
      >
        <Home className="h-4 w-4" />
      </Button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'}`}>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayoutWrapper;
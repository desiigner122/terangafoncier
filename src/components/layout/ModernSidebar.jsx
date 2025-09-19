import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Settings, User, Bell, LogOut, ChevronLeft, ChevronRight,
  LayoutDashboard, FileText, Users, Calendar, BarChart3, CreditCard,
  MessageSquare, Upload, Download, MapPin, Building, Banknote,
  Shield, Award, Target, TrendingUp, Package, Phone, Mail,
  Search, Filter, Plus, Edit, Trash2, Eye, Star, Heart,
  Clock, CheckCircle, AlertCircle, Info, X, Menu
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/hooks/useUser';
import { ROLES_CONFIG } from '@/lib/enhancedRbacConfig';

const ModernSidebar = ({ sidebarItems = [], currentPage = 'dashboard' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useUser();

  // Données utilisateur dynamiques
  const userName = profile?.full_name || profile?.name || user?.email?.split('@')[0] || 'Utilisateur';
  const userRole = profile?.role || 'PARTICULIER_SENEGAL';
  const userAvatar = profile?.avatar_url || null;
  
  // Protection robuste pour roleConfig avec fallback par défaut
  const roleConfig = ROLES_CONFIG[userRole] || ROLES_CONFIG.PARTICULIER_SENEGAL || ROLES_CONFIG.particulier_senegal || {
    name: "Particulier",
    color: "bg-blue-600",
    icon: "User",
    category: "acheteur",
    description: "Utilisateur particulier"
  };

  // Notifications non lues (simulé pour l'instant)
  const unreadNotifications = 3;
  const unreadMessages = 5;

  // Items par défaut du sidebar
  const defaultItems = [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      href: '/dashboard',
      badge: null
    },
    {
      id: 'parcels',
      label: 'Mes Terrains',
      icon: MapPin,
      href: '/mes-terrains',
      badge: null
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: CreditCard,
      href: '/transactions',
      badge: null
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      href: '/messages',
      badge: unreadMessages > 0 ? unreadMessages : null
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      href: '/documents',
      badge: null
    },
    {
      id: 'crm',
      label: 'CRM',
      icon: Users,
      href: '/crm',
      badge: null
    },
    {
      id: 'uploads',
      label: 'Fichiers',
      icon: Upload,
      href: '/uploads',
      badge: null
    },
    {
      id: 'export',
      label: 'Exports',
      icon: Download,
      href: '/export',
      badge: null
    },
    {
      id: 'calendar',
      label: 'Rendez-vous',
      icon: Calendar,
      href: '/rendez-vous',
      badge: null
    },
    {
      id: 'analytics',
      label: 'Statistiques',
      icon: BarChart3,
      href: '/statistiques',
      badge: null
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      href: '/notifications',
      badge: unreadNotifications > 0 ? unreadNotifications : null
    }
  ];

  // Utiliser les items personnalisés s'ils sont fournis, sinon utiliser les items par défaut
  const allItems = sidebarItems.length > 0 ? sidebarItems : defaultItems;

  // Gérer la déconnexion
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Gérer le toggle du submenu
  const toggleSubmenu = (itemId) => {
    setActiveSubmenu(activeSubmenu === itemId ? null : itemId);
  };

  // Vérifier si un item est actif
  const isActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0, width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-lg z-40 flex flex-col"
    >
      {/* Header avec profil utilisateur */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={profile?.avatar_url || userAvatar} alt={profile?.name || userName} />
                <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  {profile?.name ? 
                    profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                    (user?.email ? user.email.slice(0, 2).toUpperCase() : 'U')
                  }
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  Bonjour, {profile?.name || user?.email?.split('@')[0] || 'Utilisateur'} ðŸ‘‹
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {roleConfig.label}
                </p>
                {profile?.company && (
                  <p className="text-xs text-gray-400 truncate">
                    {profile.company}
                  </p>
                )}
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Barre de recherche rapide */}
        {!isCollapsed && (
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              YOUR_API_KEY="Recherche rapide..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {allItems.map((item) => (
          <div key={item.id}>
            <Link
              to={item.href}
              onClick={(e) => {
                if (item.submenu) {
                  e.preventDefault();
                  toggleSubmenu(item.id);
                }
              }}
              className={`
                group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                ${isActive(item.href)
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} flex-shrink-0`} />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="ml-2 px-2 py-0.5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  {item.submenu && (
                    <ChevronRight 
                      className={`w-4 h-4 transition-transform ${
                        activeSubmenu === item.id ? 'rotate-90' : ''
                      }`} 
                    />
                  )}
                </>
              )}
            </Link>

            {/* Submenu */}
            {item.submenu && !isCollapsed && (
              <AnimatePresence>
                {activeSubmenu === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-8 mt-2 space-y-1 overflow-hidden"
                  >
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.id}
                        to={subItem.href}
                        className={`
                          block px-3 py-2 text-sm rounded-md transition-colors
                          ${isActive(subItem.href)
                            ? 'bg-emerald-50 text-emerald-700 border-l-2 border-emerald-500'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ))}
      </nav>

      {/* Actions rapides */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-100 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <Button size="sm" variant="outline" className="p-2" title="Nouveau">
              <Plus className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="p-2" title="Upload">
              <Upload className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="p-2" title="Export">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Footer avec actions utilisateur */}
      <div className="p-4 border-t border-gray-100">
        <div className={`flex ${isCollapsed ? 'flex-col space-y-2' : 'items-center justify-between'}`}>
          {!isCollapsed && (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/profil')}
                className="p-2 hover:bg-gray-100"
                title="Mon profil"
              >
                <User className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/parametres')}
                className="p-2 hover:bg-gray-100"
                title="Paramètres"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="p-2 hover:bg-red-50 hover:text-red-600"
            title="Se déconnecter"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Déconnexion</span>}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernSidebar;

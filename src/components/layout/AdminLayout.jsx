import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home,
  Users,
  Building2,
  FileText,
  BarChart3,
  Settings,
  Mail,
  BookOpen,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TerangaLogo from '@/components/ui/TerangaLogo';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation items
  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      href: '/admin',
      badge: null
    },
    { 
      id: 'users', 
      label: 'Utilisateurs', 
      icon: Users, 
      href: '/admin/users',
      badge: null
    },
    { 
      id: 'properties', 
      label: 'Propriétés', 
      icon: Building2, 
      href: '/admin/properties',
      badge: null
    },
    { 
      id: 'cms', 
      label: 'CMS Pages', 
      icon: FileText, 
      href: '/admin/cms/pages',
      badge: null
    },
    { 
      id: 'marketing', 
      label: 'Marketing Leads', 
      icon: Mail, 
      href: '/admin/marketing/leads',
      badge: '🔥'
    },
    { 
      id: 'blog', 
      label: 'Blog', 
      icon: BookOpen, 
      href: '/admin/blog',
      badge: null
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      href: '/admin/analytics',
      badge: null
    },
    { 
      id: 'settings', 
      label: 'Paramètres', 
      icon: Settings, 
      href: '/admin/settings',
      badge: null
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const isActive = (href) => {
    if (href === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Desktop */}
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
                <div className="flex items-center space-x-3">
                  <TerangaLogo className="h-12 w-12" showText={false} />
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-700 via-yellow-700 to-orange-700 bg-clip-text text-transparent">
                      Admin Panel
                    </h2>
                    <p className="text-sm font-medium text-amber-600">
                      Teranga Foncier
                    </p>
                  </div>
                </div>
              )}
              
              {/* Toggle Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hidden lg:block p-2 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${active 
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                    ${sidebarCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="font-medium flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge variant={active ? "secondary" : "outline"} className="text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                  {profile?.email?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{profile?.email || 'Admin'}</p>
                  <p className="text-xs text-gray-500">Administrateur</p>
                </div>
              </div>
            )}
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className={`w-full ${sidebarCollapsed ? 'px-2' : ''}`}
            >
              <LogOut size={18} className={sidebarCollapsed ? '' : 'mr-2'} />
              {!sidebarCollapsed && 'Déconnexion'}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Overlay Mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'}`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <Button variant="ghost" size="icon">
              <Bell size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <User size={20} />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

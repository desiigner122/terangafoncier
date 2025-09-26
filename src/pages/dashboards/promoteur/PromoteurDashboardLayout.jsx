import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  BarChart3, 
  Users, 
  Calendar, 
  MapPin, 
  Calculator, 
  Target, 
  Briefcase, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Bell, 
  ChevronLeft, 
  Menu,
  Bot,
  Shield,
  Home,
  Search,
  Plus,
  Filter,
  Hammer,
  PieChart,
  ClipboardList,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const PromoteurDashboardLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActiveRoute = (path) => {
    if (path === '/promoteur') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const navigationItems = [
    // Vue d'ensemble
    {
      section: 'overview',
      title: 'Vue d\'ensemble',
      items: [
        { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3, path: '/promoteur' },
        { id: 'projects', label: 'Mes projets', icon: Building2, path: '/promoteur' },
        { id: 'performance', label: 'Performance', icon: TrendingUp, path: '/promoteur' }
      ]
    },
    // Développement
    {
      section: 'development',
      title: 'Développement',
      items: [
        { id: 'construction', label: 'Chantiers', icon: Hammer, path: '/promoteur/chantiers' },
        { id: 'planning', label: 'Planification', icon: Calendar, path: '/promoteur' },
        { id: 'resources', label: 'Ressources', icon: Truck, path: '/promoteur' }
      ]
    },
    // Commercial
    {
      section: 'commercial',
      title: 'Commercial',
      items: [
        { id: 'sales', label: 'Ventes', icon: TrendingUp, path: '/promoteur/ventes' },
        { id: 'clients', label: 'Clients', icon: Users, path: '/promoteur/clients' },
        { id: 'marketing', label: 'Marketing', icon: Target, path: '/promoteur' }
      ]
    },
    // Gestion
    {
      section: 'management',
      title: 'Gestion',
      items: [
        { id: 'finance', label: 'Finances', icon: DollarSign, path: '/promoteur/finances' },
        { id: 'documents', label: 'Documents', icon: FileText, path: '/promoteur' },
        { id: 'reports', label: 'Rapports', icon: ClipboardList, path: '/promoteur' }
      ]
    },
    // Technologie
    {
      section: 'technology',
      title: 'Technologie',
      items: [
        { id: 'ai', label: 'Assistant IA', icon: Bot, path: '/promoteur/ai' },
        { id: 'blockchain', label: 'Blockchain', icon: Shield, path: '/promoteur/blockchain' }
      ]
    },
    // Compte
    {
      section: 'account',
      title: 'Mon Compte',
      items: [
        { id: 'settings', label: 'Paramètres', icon: Settings, path: '/promoteur' },
        { id: 'notifications', label: 'Notifications', icon: Bell, path: '/promoteur' }
      ]
    }
  ];

  const userProfile = {
    name: 'Ibrahima Fall',
    role: 'Promoteur Immobilier',
    company: 'Fall Promotion SARL',
    avatar: '/api/placeholder/40/40',
    activeProjects: 8,
    totalProjects: 24
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        className="bg-white border-r border-gray-200 flex flex-col shadow-sm"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-gray-900">Promoteur</h1>
                  <p className="text-xs text-gray-500">Développement immobilier</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5"
            >
              {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-2 px-3">
            {navigationItems.map((section) => (
              <div key={section.section}>
                {!sidebarCollapsed && (
                  <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {section.title}
                  </h3>
                )}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.path);
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.path)}
                      className={`
                        w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors
                        ${isActive 
                          ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-600' 
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'} ${isActive ? 'text-orange-600' : 'text-gray-500'}`} />
                      {!sidebarCollapsed && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </button>
                  );
                })}
                {!sidebarCollapsed && <div className="h-4" />}
              </div>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={userProfile.avatar} />
              <AvatarFallback className="bg-orange-600 text-white">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">
                  {userProfile.name}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {userProfile.company}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                    {userProfile.role}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {userProfile.activeProjects} projets actifs
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {navigationItems
                .flatMap(section => section.items)
                .find(item => item.id === activeSection)?.label || 'Tableau de bord'}
            </h2>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {userProfile.activeProjects} projets en cours
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau projet
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoteurDashboardLayout;
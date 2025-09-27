import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  MapPin, 
  Ruler,
  Calculator,
  FileText, 
  Users, 
  BarChart3,
  Settings,
  Bell,
  Camera,
  Map,
  Building2,
  Target,
  Layers,
  Search,
  Satellite,
  Route,
  Award,
  Brain,
  Shield,
  Home,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Eye,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

const GeometreDashboardLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Navigation structure based on surveyor activities
  const navigationSections = [
    {
      title: "Tableau de Bord",
      items: [
        { id: 'overview', label: 'Vue d\'ensemble', icon: Home, path: '/dashboard/geometre' },
        { id: 'missions', label: 'Missions', icon: Target, path: '/dashboard/geometre/missions' },
        { id: 'calendar', label: 'Planning', icon: Calendar, path: '/dashboard/geometre/planning' }
      ]
    },
    {
      title: "Opérations",
      items: [
        { id: 'surveys', label: 'Levés topographiques', icon: Compass, path: '/dashboard/geometre/leves' },
        { id: 'measurements', label: 'Mesures & Bornage', icon: Ruler, path: '/dashboard/geometre/mesures' },
        { id: 'mapping', label: 'Cartographie', icon: Map, path: '/dashboard/geometre/cartes' },
        { id: 'calculations', label: 'Calculs', icon: Calculator, path: '/dashboard/geometre/calculs' }
      ]
    },
    {
      title: "Données & Outils",
      items: [
        { id: 'gis', label: 'SIG & Satellite', icon: Satellite, path: '/dashboard/geometre/sig' },
        { id: 'reports', label: 'Rapports', icon: FileText, path: '/dashboard/geometre/rapports' },
        { id: 'analytics', label: 'Analyses', icon: BarChart3, path: '/dashboard/geometre/analyses' },
        { id: 'photos', label: 'Documentation', icon: Camera, path: '/dashboard/geometre/documentation' }
      ]
    },
    {
      title: "Technologies",
      items: [
        { id: 'ai', label: 'Assistant IA', icon: Brain, path: '/dashboard/geometre/ai' },
        { id: 'blockchain', label: 'Blockchain', icon: Shield, path: '/dashboard/geometre/blockchain' }
      ]
    },
    {
      title: "Administration",
      items: [
        { id: 'clients', label: 'Clients', icon: Users, path: '/dashboard/geometre/clients' },
        { id: 'notifications', label: 'Notifications', icon: Bell, path: '/dashboard/geometre/notifications' },
        { id: 'settings', label: 'Paramètres', icon: Settings, path: '/dashboard/geometre/parametres' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280 }}
        className="bg-white border-r border-gray-200 flex flex-col relative z-20"
      >
        {/* Header Sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-gray-900">Géomètre</h1>
                  <p className="text-xs text-gray-500">Expert Topographe</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          {navigationSections.map((section, sectionIndex) => (
            <div key={section.title} className="mb-6">
              {!sidebarCollapsed && (
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {section.title}
                </h3>
              )}
              <nav className="space-y-1 px-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-green-50 text-green-700 border-r-2 border-green-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${sidebarCollapsed ? 'mx-auto' : 'mr-3'}`} />
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <Avatar className="w-8 h-8">
              <AvatarImage src="/api/placeholder/32/32" />
              <AvatarFallback className="bg-green-600 text-white text-sm">MA</AvatarFallback>
            </Avatar>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Mamadou Aly</p>
                <p className="text-xs text-gray-500 truncate">Géomètre Expert</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Géomètre</h1>
              <p className="text-gray-600">Gestion des levés topographiques et mesures</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Rechercher..." 
                  className="pl-10 w-64"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-green-600">
                  3
                </Badge>
              </Button>

              {/* Profile */}
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback className="bg-green-600 text-white">MA</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default GeometreDashboardLayout;
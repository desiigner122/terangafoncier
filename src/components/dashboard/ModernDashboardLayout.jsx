import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  MapPin, 
  Building, 
  Award,
  FileText,
  Calendar,
  Settings,
  Bell,
  User,
  ChevronLeft,
  Menu,
  BarChart3,
  MessageSquare,
  Clock,
  TrendingUp,
  Shield,
  HardHat,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';

const ModernDashboardLayout = ({ children, title, subtitle, userRole }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { user, profile } = useAuth();

  const getRoleColor = (role) => {
    const colors = {
      'Particulier': 'from-emerald-500 to-teal-500',
      'Acheteur': 'from-emerald-500 to-teal-500',
      'Vendeur': 'from-purple-500 to-indigo-500',
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

  const sidebarItems = [
    {
      title: 'Tableau de bord',
      href: '/acheteur',
      icon: Home,
      description: 'Vue d\'ensemble'
    },
    {
      title: 'Suivi des projets',
      icon: BarChart3,
      description: 'Tracking détaillé',
      subItems: [
        {
          title: 'Terrains Privés',
          href: '/acheteur/private-interests',
          icon: MapPin,
          description: 'Négociations en cours'
        },
        {
          title: 'Demandes Communales',
          href: '/acheteur/municipal-applications',
          icon: Building,
          description: 'Dossiers administratifs'
        },
        {
          title: 'Projets VEFA',
          href: '/acheteur/promoter-reservations',
          icon: Home,
          description: 'Constructions neuves'
        },
        {
          title: 'Propriétés NFT',
          href: '/acheteur/owned-properties',
          icon: Award,
          description: 'Portfolio blockchain'
        }
      ]
    },
    {
      title: 'Demande Construction',
      href: '/acheteur/construction-request',
      icon: HardHat,
      description: 'Permis de construire'
    },
    {
      title: 'Messages',
      href: '/messages',
      icon: MessageSquare,
      description: 'Communications',
      badge: '3'
    },
    {
      title: 'Calendrier',
      href: '/calendar',
      icon: Calendar,
      description: 'Rendez-vous'
    },
    {
      title: 'Documents',
      href: '/documents',
      icon: FileText,
      description: 'Mes documents'
    },
    {
      title: 'Paramètres',
      href: '/settings',
      icon: Settings,
      description: 'Configuration'
    }
  ];

  const isActiveRoute = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div 
        className={`bg-white border-r shadow-sm flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-72'
        }`}
        initial={false}
        animate={{ width: sidebarCollapsed ? 64 : 288 }}
      >
        {/* Header Sidebar */}
        <div className={`p-4 border-b ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div>
                <h2 className="font-bold text-lg text-gray-900">Teranga Foncier</h2>
                <p className="text-sm text-gray-600">Dashboard {userRole}</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2"
            >
              {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {sidebarItems.map((item, index) => (
              <div key={index}>
                {item.subItems ? (
                  <div className="space-y-1">
                    <div className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 ${
                      sidebarCollapsed ? 'justify-center' : ''
                    }`}>
                      <item.icon className="h-5 w-5 text-gray-500" />
                      {!sidebarCollapsed && (
                        <span className="ml-3">{item.title}</span>
                      )}
                    </div>
                    
                    <div className={`${sidebarCollapsed ? 'hidden' : 'ml-4 space-y-1'}`}>
                      {item.subItems.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.href}
                          className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            isActiveRoute(subItem.href)
                              ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <subItem.icon className="h-4 w-4 mr-3" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span>{subItem.title}</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {subItem.description}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActiveRoute(item.href)
                        ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${sidebarCollapsed ? 'justify-center' : ''}`}
                  >
                    <item.icon className="h-5 w-5" />
                    {!sidebarCollapsed && (
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span>{item.title}</span>
                          {item.badge && (
                            <Badge variant="destructive" className="ml-2 px-2 py-0.5 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div className={`p-4 border-t ${sidebarCollapsed ? 'px-2' : 'px-4'}`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="p-2 bg-gray-100 rounded-full">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Mon Compte</p>
                <p className="text-xs text-gray-500">Profil et paramètres</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header avec notifications et profil utilisateur */}
        <div className="bg-white border-b shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-600">{subtitle}</p>
              </div>
              
              {/* Actions header */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>
                
                {/* Messages */}
                <Button variant="ghost" size="sm" className="relative">
                  <MessageSquare className="h-5 w-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    5
                  </span>
                </Button>
                
                {/* Profil utilisateur */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {profile?.full_name || user?.email?.split('@')[0] || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-gray-500">{userRole}</p>
                  </div>
                  <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Banner de rôle avec gradient */}
        <div className={`bg-gradient-to-r ${getRoleColor(userRole)} text-white py-3 px-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {userRole}
              </Badge>
              <span className="text-sm opacity-90">Espace personnel</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboardLayout;
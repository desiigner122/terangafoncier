/**
 * AdminDashboardLayout - Wrapper réutilisable pour toutes les pages admin
 * 
 * Utilise la même sidebar que CompleteSidebarAdminDashboard
 * pour maintenir une cohérence visuelle à travers toute la section admin.
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminSidebarAuthentic from '@/components/admin/AdminSidebarAuthentic';

const AdminDashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Items de navigation (identiques à CompleteSidebarAdminDashboard)
  const navigationItems = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: 'LayoutDashboard',
      path: '/admin',
      notifications: 0
    },
    {
      id: 'cms',
      label: 'CMS',
      icon: 'FileText',
      path: '/admin/cms/pages',
      notifications: 0,
      submenu: [
        { id: 'pages', label: 'Pages', path: '/admin/cms/pages' }
      ]
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: 'TrendingUp',
      path: '/admin/marketing/leads',
      notifications: 0,
      submenu: [
        { id: 'leads', label: 'Leads', path: '/admin/marketing/leads' }
      ]
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: 'Users',
      path: '/admin/users',
      notifications: 0
    },
    {
      id: 'properties',
      label: 'Propriétés',
      icon: 'Building2',
      path: '/admin/properties',
      notifications: 0
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: 'CreditCard',
      path: '/admin/transactions',
      notifications: 0
    },
    {
      id: 'analytics',
      label: 'Analytiques',
      icon: 'BarChart3',
      path: '/admin/analytics',
      notifications: 0
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: 'Settings',
      path: '/admin/settings',
      notifications: 0
    }
  ];

  // Déterminer l'onglet actif basé sur l'URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/dashboard') return 'overview';
    if (path.startsWith('/admin/cms')) return 'cms';
    if (path.startsWith('/admin/marketing')) return 'marketing';
    if (path.startsWith('/admin/users')) return 'users';
    if (path.startsWith('/admin/properties')) return 'properties';
    if (path.startsWith('/admin/transactions')) return 'transactions';
    if (path.startsWith('/admin/analytics')) return 'analytics';
    if (path.startsWith('/admin/settings')) return 'settings';
    return 'overview';
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tabId) => {
    const item = navigationItems.find(i => i.id === tabId);
    if (item?.path) {
      navigate(item.path);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-25 to-yellow-25">
      {/* Sidebar */}
      <AdminSidebarAuthentic
        navigationItems={navigationItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'}
        min-h-screen
      `}>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;

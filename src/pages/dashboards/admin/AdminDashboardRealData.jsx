import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '@/config/api';
import { 
  Home, Users, Building2, DollarSign, BarChart3, Settings,
  TrendingUp, CheckCircle, MessageSquare, Download, Crown,
  Activity, Target, Bell, Database, Monitor
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Import des nouvelles pages admin
import RevenueManagementPage from '../../admin/RevenueManagementPage';
import PropertyManagementPage from '../../admin/PropertyManagementPage';
import SupportTicketsPage from '../../admin/SupportTicketsPage';
import BulkExportPage from '../../admin/BulkExportPage';
import UserManagementPage from '../../admin/UserManagementPage';
import SubscriptionManagementPage from '../../admin/SubscriptionManagementPage';

const AdminDashboardRealData = () => {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // États pour les données réelles
  const [dashboardStats, setDashboardStats] = useState({
    users: { total: 0, active: 0, new: 0, growth: 0 },
    properties: { total: 0, active: 0, pending: 0, sold: 0 },
    transactions: { total: 0, volume: 0, pending: 0, completed: 0 },
    revenue: { total: 0, monthly: 0, growth: 0, target: 0 }
  });

  const [recentActivity, setRecentActivity] = useState([]);

  // Charger les données réelles depuis l'API
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Charger les statistiques générales
        const statsResponse = await apiClient.get('/admin/analytics/overview');
        if (statsResponse.success) {
          setDashboardStats(statsResponse.data);
        }

        // Charger les données de revenus pour l'activité récente
        const revenueResponse = await apiClient.get('/admin/revenue/detailed');
        if (revenueResponse.success && revenueResponse.data.recentTransactions) {
          setRecentActivity(revenueResponse.data.recentTransactions);
        }

        setLoading(false);
      } catch (err) {
        console.error('Erreur chargement dashboard:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const menuItems = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: Home,
      description: 'Statistiques générales'
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: Users,
      description: 'Gestion des comptes',
      badge: dashboardStats.users.new.toString(),
      badgeColor: 'bg-blue-500'
    },
    {
      id: 'properties',
      label: 'Propriétés',
      icon: Building2,
      description: 'Validation & gestion',
      badge: dashboardStats.properties.pending.toString(),
      badgeColor: 'bg-yellow-500'
    },
    {
      id: 'revenue-management',
      label: 'Revenus',
      icon: TrendingUp,
      description: 'Analytics financiers',
      badge: 'NEW',
      badgeColor: 'bg-purple-500'
    },
    {
      id: 'property-management',
      label: 'Approbations',
      icon: CheckCircle,
      description: 'Approuver propriétés',
      badge: dashboardStats.properties.pending.toString(),
      badgeColor: 'bg-orange-500'
    },
    {
      id: 'support-tickets',
      label: 'Support',
      icon: MessageSquare,
      description: 'Tickets d\'assistance'
    },
    {
      id: 'subscriptions',
      label: 'Abonnements',
      icon: Crown,
      description: 'Gestion des plans'
    },
    {
      id: 'bulk-export',
      label: 'Exports',
      icon: Download,
      description: 'Export données'
    },
    {
      id: 'system',
      label: 'Système',
      icon: Settings,
      description: 'Configuration'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Rendu conditionnel basé sur l'onglet actif
  const renderContent = () => {
    switch (activeTab) {
      case 'revenue-management':
        return <RevenueManagementPage />;
      case 'property-management':
        return <PropertyManagementPage />;
      case 'support-tickets':
        return <SupportTicketsPage />;
      case 'bulk-export':
        return <BulkExportPage />;
      case 'users':
        return <UserManagementPage />;
      case 'subscriptions':
        return <SubscriptionManagementPage />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-600">Vue d'ensemble des données réelles de la plateforme</p>
        </div>
        <Button onClick={() => window.location.reload()}>
          Actualiser
        </Button>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.users.total}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.users.active} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propriétés</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.properties.total}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.properties.pending} en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.transactions.total}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.transactions.completed} complétées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(dashboardStats.revenue.total)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(dashboardStats.revenue.monthly)} ce mois
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activité récente */}
      <Card>
        <CardHeader>
          <CardTitle>Activité Récente</CardTitle>
          <CardDescription>Dernières transactions et événements</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{activity.type}</p>
                      <p className="text-sm text-gray-600">{activity.buyer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(activity.amount)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune activité récente</p>
          )}
        </CardContent>
      </Card>

      {/* Status système */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status Système</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>API Backend</span>
                <Badge variant="success">En ligne</Badge>
              </div>
              <div className="flex justify-between">
                <span>Base de données</span>
                <Badge variant="success">Connectée</Badge>
              </div>
              <div className="flex justify-between">
                <span>Dernière sauvegarde</span>
                <span className="text-sm text-gray-600">Il y a 2h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setActiveTab('property-management')}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Valider propriétés ({dashboardStats.properties.pending})
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setActiveTab('support-tickets')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Répondre aux tickets
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setActiveTab('bulk-export')}
            >
              <Download className="mr-2 h-4 w-4" />
              Exporter données
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des données réelles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur: {error}</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-sm text-gray-600">Données réelles</p>
          </div>
          
          <nav className="mt-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeTab === item.id ? 'bg-blue-50 border-r-2 border-blue-600 text-blue-600' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </div>
                {item.badge && (
                  <Badge className={item.badgeColor}>
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardRealData;
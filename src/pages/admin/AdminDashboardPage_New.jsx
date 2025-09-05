import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Building2, 
  MapPin, 
  TrendingUp, 
  AlertCircle, 
  DollarSign, 
  Calendar, 
  FileText, 
  Settings, 
  Eye, 
  Download, 
  Plus, 
  BarChart3, 
  Globe2, 
  Activity, 
  Zap, 
  Shield, 
  Bell, 
  ArrowRight, 
  ExternalLink
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeProjects: 0,
    monthlyRevenue: 0,
    systemHealth: 'Optimal'
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchSystemOverview = async () => {
      setLoading(true);
      try {
        // Statistiques générales du système
        const { data: usersData } = await supabase
          .from('users')
          .select('role', { count: 'exact' });

        const { data: projectsData } = await supabase
          .from('remote_construction_projects')
          .select('id, status', { count: 'exact' })
          .eq('status', 'in_progress');

        setSystemStats({
          totalUsers: usersData?.length || 0,
          activeProjects: projectsData?.length || 0,
          monthlyRevenue: 45800000, // 45.8M XOF
          systemHealth: 'Optimal'
        });

        // Activités récentes (simulation)
        setRecentActivities([
          { id: 1, type: 'user_register', description: 'Nouveau particulier inscrit', time: '2 min', user: 'Amadou Diallo' },
          { id: 2, type: 'project_update', description: 'Projet diaspora mis à jour', time: '15 min', user: 'Système' },
          { id: 3, type: 'payment_received', description: 'Paiement reçu - Frais construction', time: '1h', user: 'Fatou Sall' },
          { id: 4, type: 'FileText_uploaded', description: 'FileTexts notariaux uploadés', time: '2h', user: 'Maître Ba' }
        ]);

        // Alertes système
        setAlerts([
          { id: 1, type: 'info', message: '3 nouveaux projets diaspora en attente de validation', priority: 'medium' },
          { id: 2, type: 'success', message: 'Mise à jour des frais construction déployée avec succès', priority: 'low' },
          { id: 3, type: 'warning', message: '2 paiements en retard nécessitent un suivi', priority: 'high' }
        ]);

      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemOverview();
  }, []);

  const dashboardSections = [
    {
      title: 'Gestion Projets',
      description: 'Suivi projets diaspora et construction à distance',
      icon: Building2,
      link: '/admin/projects',
      color: 'bg-blue-500',
      stats: '12 actifs'
    },
    {
      title: 'Configuration Frais',
      description: 'Définir frais, commissions et barèmes tarifaires',
      icon: DollarSign,
      link: '/admin/pricing',
      color: 'bg-green-500',
      stats: '8 barèmes'
    },
    {
      title: 'Gestion Utilisateurs',
      description: 'Administration des rôles et permissions',
      icon: Users,
      link: '/admin/users',
      color: 'bg-purple-500',
      stats: `${systemStats.totalUsers} utilisateurs`
    },
    {
      title: 'Analytics & Rapports',
      description: 'Tableaux de bord et exports Excel',
      icon: BarChart3,
      link: '/admin/analytics',
      color: 'bg-orange-500',
      stats: 'Temps réel'
    },
    {
      title: 'Paramètres Système',
      description: 'Configuration générale et sécurité',
      icon: Settings,
      link: '/admin/settings',
      color: 'bg-gray-500',
      stats: 'Configuré'
    },
    {
      title: 'Notifications',
      description: 'Centre de notifications et alertes',
      icon: Bell,
      link: '/admin/notifications',
      color: 'bg-red-500',
      stats: `${alerts.length} alertes`
    }
  ];

  const quickActions = [
    { title: 'Nouveau Projet Diaspora', icon: Plus, action: 'create_project', color: 'bg-blue-600' },
    { title: 'Configurer Frais', icon: DollarSign, action: 'configure_fees', color: 'bg-green-600' },
    { title: 'Export Excel Global', icon: Download, action: 'export_excel', color: 'bg-purple-600' },
    { title: 'Vue Publique', icon: Eye, action: 'view_public', color: 'bg-orange-600' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord Administrateur</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble système - Teranga Foncier
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="w-3 h-3 mr-1" />
            Système Opérationnel
          </Badge>
          <Link to="/admin/settings">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Statistiques Principales */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +12% ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets Actifs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              Construction diaspora
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(systemStats.monthlyRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">
              XOF ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Santé Système</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemStats.systemHealth}</div>
            <p className="text-xs text-muted-foreground">
              Tous services OK
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions Rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Actions Rapides
            </CardTitle>
            <CardDescription>
              Accès direct aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform"
                >
                  <div className={`w-8 h-8 rounded-full ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{action.title}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sections Principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Modules de Gestion</CardTitle>
            <CardDescription>
              Accédez aux différents modules de l'administration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardSections.map((section, index) => (
                <Link key={index} to={section.link}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-lg ${section.color} flex items-center justify-center`}>
                          <section.icon className="w-5 h-5 text-white" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary">{section.stats}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activités et Alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activités Récentes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Activités Récentes
              </CardTitle>
              <CardDescription>
                Dernières actions sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <Button variant="outline" className="w-full">
                Voir toutes les activités
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Alertes Système */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Alertes Système
              </CardTitle>
              <CardDescription>
                Notifications importantes nécessitant votre attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                    alert.type === 'success' ? 'bg-green-50 border-green-400' :
                    'bg-blue-50 border-blue-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <Badge variant={
                        alert.priority === 'high' ? 'destructive' :
                        alert.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {alert.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <Button variant="outline" className="w-full">
                Centre de notifications
                <Bell className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bouton d'accès aux pages publiques */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <Globe2 className="w-12 h-12" />
              <div>
                <h3 className="text-xl font-bold">Aperçu Public</h3>
                <p className="text-blue-100">
                  Découvrez comment les visiteurs voient vos nouvelles fonctionnalités
                </p>
              </div>
              <Link to="/solutions">
                <Button variant="secondary" size="lg">
                  <Eye className="w-4 h-4 mr-2" />
                  Voir la page publique
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;

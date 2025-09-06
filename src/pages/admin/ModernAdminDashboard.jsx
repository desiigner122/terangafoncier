import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ExternalLink,
  Home,
  UserCheck,
  Hammer,
  Scale,
  Banknote,
  Landmark,
  Sprout,
  HardHat,
  UserCog,
  PenTool
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { ROLES, ROLES_CONFIG, ROLE_GROUPS } from '@/lib/enhancedRbacConfig';

const ModernAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // États pour les statistiques
  const [globalStats, setGlobalStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    monthlyRevenue: 0,
    activeTransactions: 0,
    landListings: 0,
    constructionProjects: 0
  });
  
  const [roleStats, setRoleStats] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [platformHealth, setPlatformHealth] = useState({
    status: 'optimal',
    uptime: '99.9%',
    alerts: []
  });
  
  const [subscriptionStats, setSubscriptionStats] = useState({
    totalRevenue: 0,
    activeSubscriptions: 0,
    byRole: {}
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Statistiques globales
      const { data: users } = await supabase.from('users').select('role, created_at');
      const { data: projects } = await supabase.from('remote_construction_projects').select('*');
      const { data: parcels } = await supabase.from('parcels').select('*');
      
      setGlobalStats({
        totalUsers: users?.length || 0,
        totalProjects: projects?.length || 0,
        monthlyRevenue: 125800000, // 125.8M XOF
        activeTransactions: 847,
        landListings: parcels?.length || 0,
        constructionProjects: projects?.filter(p => p.status === 'in_progress')?.length || 0
      });

      // Statistiques par rôle
      const roleBreakdown = {};
      Object.values(ROLES).forEach(role => {
        const roleUsers = users?.filter(u => u.role === role) || [];
        roleBreakdown[role] = {
          count: roleUsers.length,
          growth: Math.floor(Math.random() * 20) + 5, // Simulation croissance
          activeThisMonth: Math.floor(roleUsers.length * 0.7)
        };
      });
      setRoleStats(roleBreakdown);

      // Données de revenus
      setRevenueData([
        { month: 'Jan', revenus: 45000000, abonnements: 15000000, commissions: 30000000 },
        { month: 'Fév', revenus: 52000000, abonnements: 18000000, commissions: 34000000 },
        { month: 'Mar', revenus: 68000000, abonnements: 22000000, commissions: 46000000 },
        { month: 'Avr', revenus: 75000000, abonnements: 25000000, commissions: 50000000 },
        { month: 'Mai', revenus: 89000000, abonnements: 28000000, commissions: 61000000 },
        { month: 'Juin', revenus: 125800000, abonnements: 35000000, commissions: 90800000 }
      ]);

      // Statistiques abonnements
      const subscriptionRevenue = calculateSubscriptionRevenue(roleBreakdown);
      setSubscriptionStats(subscriptionRevenue);
      
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSubscriptionRevenue = (roleStats) => {
    let totalRevenue = 0;
    const byRole = {};
    
    Object.entries(ROLES_CONFIG).forEach(([role, config]) => {
      if (config.subscription) {
        const userCount = roleStats[role]?.count || 0;
        // Simulation: 60% des utilisateurs ont un abonnement payant
        const subscribedUsers = Math.floor(userCount * 0.6);
        
        // Prix moyen par rôle (simulation)
        const avgPrice = config.subscription.premium?.price || 
                        config.subscription.basic?.price || 
                        config.subscription.business?.price || 25000;
        
        const roleRevenue = subscribedUsers * avgPrice;
        totalRevenue += roleRevenue;
        
        byRole[role] = {
          subscribers: subscribedUsers,
          revenue: roleRevenue,
          averagePrice: avgPrice
        };
      }
    });
    
    return {
      totalRevenue,
      activeSubscriptions: Object.values(byRole).reduce((sum, r) => sum + r.subscribers, 0),
      byRole
    };
  };

  // Composant pour les stats rapides
  const QuickStatsCard = ({ title, value, icon: Icon, color, change, description }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-4 w-4 ${color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center space-x-2">
            <p className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '↗' : '↘'} {Math.abs(change)}% ce mois
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Composant pour stats par rôle
  const RoleStatsGrid = () => {
    const roleGroups = [
      { name: 'Acheteurs', roles: ROLE_GROUPS.ACHETEURS, color: 'bg-blue-500' },
      { name: 'Vendeurs', roles: ROLE_GROUPS.VENDEURS, color: 'bg-green-500' },
      { name: 'Construction', roles: ROLE_GROUPS.CONSTRUCTION, color: 'bg-orange-500' },
      { name: 'Finance', roles: ROLE_GROUPS.FINANCE, color: 'bg-purple-500' },
      { name: 'Juridique', roles: ROLE_GROUPS.JURIDIQUE, color: 'bg-gray-500' },
      { name: 'Institutions', roles: ROLE_GROUPS.INSTITUTIONS, color: 'bg-red-500' }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roleGroups.map((group, index) => {
          const totalUsers = group.roles.reduce((sum, role) => sum + (roleStats[role]?.count || 0), 0);
          const totalActive = group.roles.reduce((sum, role) => sum + (roleStats[role]?.activeThisMonth || 0), 0);
          
          return (
            <motion.div
              key={group.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <div className={`w-3 h-3 rounded-full ${group.color}`}></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total utilisateurs</span>
                      <span className="font-bold">{totalUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Actifs ce mois</span>
                      <span className="font-bold text-green-600">{totalActive}</span>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      {group.roles.map(role => {
                        const roleData = roleStats[role];
                        const config = ROLES_CONFIG[role];
                        return (
                          <div key={role} className="flex justify-between items-center text-xs">
                            <span className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${config?.color || 'bg-gray-400'}`}></div>
                              {config?.name}
                            </span>
                            <span className="font-medium">{roleData?.count || 0}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    );
  };

  // Composant Configuration Frais et Abonnements
  const PricingConfiguration = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Revenus des Abonnements
          </CardTitle>
          <CardDescription>
            Revenus générés par rôle et type d'abonnement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {(subscriptionStats.totalRevenue / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-green-600">Revenus Mensuels XOF</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {subscriptionStats.activeSubscriptions}
              </div>
              <div className="text-sm text-blue-600">Abonnements Actifs</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {subscriptionStats.activeSubscriptions > 0 ? 
                  Math.round(subscriptionStats.totalRevenue / subscriptionStats.activeSubscriptions).toLocaleString() : 0}
              </div>
              <div className="text-sm text-purple-600">Revenus Moyen/User XOF</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Revenus par Catégorie de Rôle</h4>
            {Object.entries(subscriptionStats.byRole).map(([role, data]) => {
              const config = ROLES_CONFIG[role];
              if (!config) return null;
              
              return (
                <div key={role} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${config.color}`}></div>
                    <div>
                      <div className="font-medium">{config.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {data.subscribers} abonnés actifs
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{(data.revenue / 1000).toFixed(0)}K XOF</div>
                    <div className="text-sm text-muted-foreground">
                      ~{(data.averagePrice / 1000).toFixed(0)}K/mois
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex gap-4">
            <Button className="flex-1">
              <Settings className="w-4 h-4 mr-2" />
              Configurer Tarifs
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Export Revenus
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrateur</h1>
          <p className="text-muted-foreground">
            Gestion complète de la plateforme Teranga Foncier
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link to="/">
              <Globe2 className="w-4 h-4 mr-2" />
              Voir le Site
            </Link>
          </Button>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Global
          </Button>
        </div>
      </div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
          <TabsTrigger value="management">Gestion</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickStatsCard
              title="Utilisateurs Total"
              value={globalStats.totalUsers.toLocaleString()}
              icon={Users}
              color="text-blue-600"
              change={12}
              description="Tous rôles confondus"
            />
            <QuickStatsCard
              title="Projets Construction"
              value={globalStats.constructionProjects}
              icon={Building2}
              color="text-orange-600"
              change={8}
              description="Projets diaspora actifs"
            />
            <QuickStatsCard
              title="Revenus Mensuels"
              value={`${(globalStats.monthlyRevenue / 1000000).toFixed(1)}M`}
              icon={DollarSign}
              color="text-green-600"
              change={23}
              description="XOF ce mois"
            />
            <QuickStatsCard
              title="Annonces Terrain"
              value={globalStats.landListings}
              icon={MapPin}
              color="text-purple-600"
              change={15}
              description="Terrains disponibles"
            />
          </div>

          {/* Graphique revenus */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution des Revenus</CardTitle>
              <CardDescription>Revenus mensuels par catégorie</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(value) => [`${(value / 1000000).toFixed(1)}M XOF`, '']} />
                  <Legend />
                  <Bar dataKey="abonnements" stackId="a" fill="#3b82f6" name="Abonnements" />
                  <Bar dataKey="commissions" stackId="a" fill="#10b981" name="Commissions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Utilisateurs */}
        <TabsContent value="users" className="space-y-6">
          <RoleStatsGrid />
        </TabsContent>

        {/* Revenus */}
        <TabsContent value="revenue" className="space-y-6">
          <PricingConfiguration />
        </TabsContent>

        {/* Gestion */}
        <TabsContent value="management" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Gestion Utilisateurs', description: 'Administration des comptes et rôles', icon: Users, link: '/admin/users', color: 'bg-blue-500' },
              { title: 'Configuration Frais', description: 'Tarifs et commissions', icon: DollarSign, link: '/admin/pricing', color: 'bg-green-500' },
              { title: 'Projets Construction', description: 'Suivi projets diaspora', icon: Building2, link: '/admin/projects', color: 'bg-orange-500' },
              { title: 'Analytics Avancés', description: 'Rapports et statistiques', icon: BarChart3, link: '/admin/analytics', color: 'bg-purple-500' },
              { title: 'Paramètres Système', description: 'Configuration plateforme', icon: Settings, link: '/admin/settings', color: 'bg-gray-500' },
              { title: 'Notifications', description: 'Centre de notifications', icon: Bell, link: '/admin/notifications', color: 'bg-red-500' }
            ].map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={module.link}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 rounded-lg ${module.color} flex items-center justify-center`}>
                          <module.icon className="w-5 h-5 text-white" />
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModernAdminDashboard;

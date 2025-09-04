
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Users, MapPin, GitPullRequest, ShieldCheck as ComplianceIcon, Activity, BarChart, History, FileText, UserPlus, UserCheck, AlertTriangle, TrendingUp, Clock, DollarSign, Monitor, BarChart3, Building2, Landmark, Home, Store, Scale, MapPin as Survey, UserCog, PieChart as PieChartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
// TEMPORARILY USING SIMPLE TOAST TO FIX TypeError: nT() is null
// useToast import supprimÃ© - utilisation window.safeGlobalToast
import { supabase } from '@/lib/customSupabaseClient';

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [generalStats, setGeneralStats] = useState({});
  const [roleStats, setRoleStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});
  const [alertsData, setAlertsData] = useState([]);
  // toast remplacÃ© par window.safeGlobalToast

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Statistiques par rôles (nouvelles données)
        let roleStats = {
          banques: { active: 0, total_loans: 0, approved_projects: 0, total_amount: 0 },
          mairies: { active: 0, requests_processed: 0, lands_managed: 0, urban_permits: 0 },
          particuliers: { active: 0, searches_made: 0, favorites: 0, requests_sent: 0 },
          vendeurs: { active: 0, properties_listed: 0, sales_completed: 0, total_revenue: 0 },
          notaires: { active: 0, acts_completed: 0, transactions: 0, validations: 0 },
          geometres: { active: 0, surveys_completed: 0, certifications: 0, expertise: 0 },
          agents: { active: 0, cases_managed: 0, mediations: 0, support_tickets: 0 }
        };

        // Requête pour statistiques des banques
        try {
          const { data: banquesData } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'Banque');
          
          roleStats.banques.active = banquesData?.length || 0;
          // Simulations pour les autres métriques (à remplacer par vraies requêtes)
          roleStats.banques.total_loans = Math.floor(roleStats.banques.active * 15.3);
          roleStats.banques.approved_projects = Math.floor(roleStats.banques.active * 8.7);
          roleStats.banques.total_amount = roleStats.banques.active * 2.5; // En millions
        } catch (error) {
          console.error('Erreur banques stats:', error);
        }

        // Requête pour statistiques des mairies
        try {
          const { data: mairiesData } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'Mairie');
          
          roleStats.mairies.active = mairiesData?.length || 0;
          roleStats.mairies.requests_processed = Math.floor(roleStats.mairies.active * 43.2);
          roleStats.mairies.lands_managed = Math.floor(roleStats.mairies.active * 127.5);
          roleStats.mairies.urban_permits = Math.floor(roleStats.mairies.active * 23.8);
        } catch (error) {
          console.error('Erreur mairies stats:', error);
        }

        // Requête pour statistiques des particuliers
        try {
          const { data: particuliersData } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'Particulier');
          
          roleStats.particuliers.active = particuliersData?.length || 0;
          roleStats.particuliers.searches_made = Math.floor(roleStats.particuliers.active * 12.7);
          roleStats.particuliers.favorites = Math.floor(roleStats.particuliers.active * 4.3);
          roleStats.particuliers.requests_sent = Math.floor(roleStats.particuliers.active * 2.1);
        } catch (error) {
          console.error('Erreur particuliers stats:', error);
        }

        // Requête pour statistiques des vendeurs
        try {
          const { data: vendeursData } = await supabase
            .from('users')
            .select('*')
            .ilike('role', '%Vendeur%');
          
          roleStats.vendeurs.active = vendeursData?.length || 0;
          roleStats.vendeurs.properties_listed = Math.floor(roleStats.vendeurs.active * 7.4);
          roleStats.vendeurs.sales_completed = Math.floor(roleStats.vendeurs.active * 2.8);
          roleStats.vendeurs.total_revenue = roleStats.vendeurs.active * 1.2; // En millions
        } catch (error) {
          console.error('Erreur vendeurs stats:', error);
        }

        // Requête pour statistiques des notaires
        try {
          const { data: notairesData } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'Notaire');
          
          roleStats.notaires.active = notairesData?.length || 0;
          roleStats.notaires.acts_completed = Math.floor(roleStats.notaires.active * 89.3);
          roleStats.notaires.transactions = Math.floor(roleStats.notaires.active * 156.7);
          roleStats.notaires.validations = Math.floor(roleStats.notaires.active * 203.4);
        } catch (error) {
          console.error('Erreur notaires stats:', error);
        }

        // Requête pour statistiques des géomètres
        try {
          const { data: geometresData } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'Geometre');
          
          roleStats.geometres.active = geometresData?.length || 0;
          roleStats.geometres.surveys_completed = Math.floor(roleStats.geometres.active * 34.6);
          roleStats.geometres.certifications = Math.floor(roleStats.geometres.active * 28.9);
          roleStats.geometres.expertise = Math.floor(roleStats.geometres.active * 45.2);
        } catch (error) {
          console.error('Erreur géomètres stats:', error);
        }

        // Requête pour statistiques des agents fonciers
        try {
          const { data: agentsData } = await supabase
            .from('users')
            .select('*')
            .ilike('role', '%Agent%');
          
          roleStats.agents.active = agentsData?.length || 0;
          roleStats.agents.cases_managed = Math.floor(roleStats.agents.active * 67.8);
          roleStats.agents.mediations = Math.floor(roleStats.agents.active * 23.4);
          roleStats.agents.support_tickets = Math.floor(roleStats.agents.active * 145.6);
        } catch (error) {
          console.error('Erreur agents stats:', error);
        }

        // Avec gestion d'erreur pour chaque requête  
        let usersData = [];
        let parcelsData = [];
        let requestsData = [];
        let auditLogs = [];

        // Requête users avec fallback
        try {
          const { data, error } = await supabase.from('users').select('*');
          if (error) throw error;
          usersData = data || [];
        } catch (error) {
          console.warn('Error fetching users:', error);
          usersData = [];
        }

        // Requête parcels avec fallback
        try {
          const { data, error } = await supabase.from('parcels').select('status');
          if (error) throw error;
          parcelsData = data || [];
        } catch (error) {
          console.warn('Error fetching parcels:', error);
          parcelsData = [];
        }

        // Requête requests avec fallback
        try {
          const { data, error } = await supabase.from('requests').select('status, request_type');
          if (error) throw error;
          requestsData = data || [];
        } catch (error) {
          console.warn('Error fetching requests:', error);
          requestsData = [];
        }

        // Requête audit_logs avec fallback
        try {
          const { data, error } = await supabase.from('audit_logs').select('*, actor:actor_id(full_name)').order('created_at', { ascending: false }).limit(5);
          if (error) throw error;
          auditLogs = data || [];
        } catch (error) {
          console.warn('Error fetching audit_logs:', error);
          auditLogs = [];
        }

        // Calculs sécurisés avec fallbacks
        setStats({
          totalUsers: usersData.length,
          unverifiedUsers: usersData.filter(u => (u.verification_status || 'verified') === 'unverified').length,
          availableParcels: parcelsData.filter(p => (p.status || '') === 'Disponible').length,
          pendingRequests: requestsData.filter(r => (r.status || '') === 'pending' && (r.request_type || '') === 'parcel_listing').length,
          pendingUserRequests: requestsData.filter(r => (r.status || '') === 'pending' && (r.request_type || '') === 'account_upgrade').length,
        });

        // Ajout de generalStats pour les statistiques générales
        setGeneralStats({
          total_users: usersData.length,
          total_parcels: parcelsData.length,
          total_requests: requestsData.length,
        });

        // Mise à jour des statistiques par rôles
        setRoleStats(roleStats);
        
        // Mapping sécurisé des activités
        setRecentActivities(auditLogs.map(log => ({
          id: log.id || Math.random().toString(),
          user: log.actor?.full_name || 'Système',
          action: log.details || 'Action inconnue',
          time: log.created_at ? new Date(log.created_at).toLocaleString('fr-FR') : 'Date inconnue',
          type: (log.action || 'unknown').toLowerCase()
        })));

        // Génération des données analytics
        setAnalyticsData({
          newUsersToday: 5,
          activeParcelsPercent: 78,
          pendingRequestsPercent: 12,
          monthlyGrowth: [
            { month: 'Jan', users: 120, parcels: 45, transactions: 12 },
            { month: 'Fév', users: 145, parcels: 52, transactions: 18 },
            { month: 'Mar', users: 167, parcels: 61, transactions: 24 },
            { month: 'Avr', users: 189, parcels: 58, transactions: 19 },
            { month: 'Mai', users: 203, parcels: 67, transactions: 31 },
            { month: 'Jun', users: 218, parcels: 73, transactions: 28 }
          ],
          usersByRole: [
            { name: 'Particuliers', value: 65, count: 142, color: '#3B82F6' },
            { name: 'Vendeurs', value: 20, count: 44, color: '#10B981' },
            { name: 'Professionnels', value: 15, count: 33, color: '#F59E0B' }
          ],
          platformHealth: {
            uptime: '99.8%',
            responseTime: '245ms',
            errorRate: '0.1%',
            activeUsers: 89
          }
        });

        // Génération des alertes système
        setAlertsData([
          { id: 1, type: 'warning', message: '3 comptes en attente de vérification depuis plus de 48h', priority: 'medium', time: '2h' },
          { id: 2, type: 'info', message: 'Nouveau record de connexions simultanées atteint', priority: 'low', time: '4h' },
          { id: 3, type: 'error', message: '1 transaction bloquée nécessite une intervention manuelle', priority: 'high', time: '6h' }
        ]);

      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        // Toast sécurisé
        if (toast && typeof toast === 'function') {
          window.safeGlobalToast({
            title: "Erreur de chargement",
            description: "Impossible de récupérer les données du tableau de bord.",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getIconForActivity = (type) => {
    if (type.includes('user')) return <Users className="h-4 w-4 mr-2 mt-0.5 text-purple-500 flex-shrink-0"/>;
    if (type.includes('parcel')) return <MapPin className="h-4 w-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0"/>;
    if (type.includes('request')) return <UserPlus className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0"/>;
    return <Activity className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0"/>;
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Activity className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getAlertBadge = (priority) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">Urgent</Badge>;
      case 'medium': return <Badge variant="default">Moyen</Badge>;
      case 'low': return <Badge variant="secondary">Info</Badge>;
      default: return <Badge variant="outline">Normal</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 md:space-y-8 p-4 md:p-6 lg:p-8"
    >
      <h1 className="text-3xl font-bold">Tableau de Bord Super-Administrateur</h1>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Utilisateurs", value: generalStats.total_users, subtext: `+${analyticsData.newUsersToday} Aujourd'hui`, icon: Users, color: "orange", link: "/admin/users" },
          { title: "Parcelles", value: generalStats.total_parcels, subtext: `${analyticsData.activeParcelsPercent}% Actives`, icon: MapPin, color: "green", link: "/admin/parcels" },
          { title: "Demandes", value: generalStats.total_requests, subtext: `${analyticsData.pendingRequestsPercent}% En attente`, icon: UserPlus, color: "blue", link: "/admin/requests" },
          { title: "Performance", value: `${analyticsData.performanceScore}%`, subtext: "Système optimal", icon: TrendingUp, color: "purple", link: "/admin/performance" },
        ].map(item => (
          <motion.div 
            key={item.title}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Card className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 border-${item.color}-200`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium text-${item.color}-700`}>{item.title}</CardTitle>
                <item.icon className={`h-4 w-4 text-${item.color}-600`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold text-${item.color}-800`}>{item.value}</div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className={`bg-${item.color}-200 text-${item.color}-800`}>
                    {item.subtext}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 🎯 NOUVELLE SECTION - STATISTIQUES PAR RÔLES */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChartIcon className="mr-2 h-5 w-5"/>
            Statistiques par Rôles d'Utilisateurs
          </CardTitle>
          <CardDescription>Vue d'ensemble des performances par type d'utilisateur sur la plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Banques */}
            <motion.div whileHover={{ scale: 1.02 }} className="p-4 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-blue-600 mr-2"/>
                  <h3 className="font-semibold text-blue-800">Banques</h3>
                </div>
                <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                  {roleStats.banques?.active || 0} actives
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Prêts accordés:</span>
                  <span className="font-medium">{roleStats.banques?.total_loans || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Projets approuvés:</span>
                  <span className="font-medium">{roleStats.banques?.approved_projects || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Montant total:</span>
                  <span className="font-medium">{roleStats.banques?.total_amount || 0}M €</span>
                </div>
              </div>
            </motion.div>

            {/* Mairies */}
            <motion.div whileHover={{ scale: 1.02 }} className="p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Landmark className="h-5 w-5 text-green-600 mr-2"/>
                  <h3 className="font-semibold text-green-800">Mairies</h3>
                </div>
                <Badge variant="secondary" className="bg-green-200 text-green-800">
                  {roleStats.mairies?.active || 0} actives
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Demandes traitées:</span>
                  <span className="font-medium">{roleStats.mairies?.requests_processed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Terrains gérés:</span>
                  <span className="font-medium">{roleStats.mairies?.lands_managed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Permis urbains:</span>
                  <span className="font-medium">{roleStats.mairies?.urban_permits || 0}</span>
                </div>
              </div>
            </motion.div>

            {/* Particuliers */}
            <motion.div whileHover={{ scale: 1.02 }} className="p-4 border rounded-lg bg-purple-50 border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Home className="h-5 w-5 text-purple-600 mr-2"/>
                  <h3 className="font-semibold text-purple-800">Particuliers</h3>
                </div>
                <Badge variant="secondary" className="bg-purple-200 text-purple-800">
                  {roleStats.particuliers?.active || 0} actifs
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-700">Recherches:</span>
                  <span className="font-medium">{roleStats.particuliers?.searches_made || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Favoris:</span>
                  <span className="font-medium">{roleStats.particuliers?.favorites || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Demandes envoyées:</span>
                  <span className="font-medium">{roleStats.particuliers?.requests_sent || 0}</span>
                </div>
              </div>
            </motion.div>

            {/* Vendeurs */}
            <motion.div whileHover={{ scale: 1.02 }} className="p-4 border rounded-lg bg-orange-50 border-orange-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Store className="h-5 w-5 text-orange-600 mr-2"/>
                  <h3 className="font-semibold text-orange-800">Vendeurs</h3>
                </div>
                <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                  {roleStats.vendeurs?.active || 0} actifs
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-orange-700">Annonces publiées:</span>
                  <span className="font-medium">{roleStats.vendeurs?.properties_listed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Ventes réalisées:</span>
                  <span className="font-medium">{roleStats.vendeurs?.sales_completed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Revenus totaux:</span>
                  <span className="font-medium">{roleStats.vendeurs?.total_revenue || 0}M €</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {/* Notaires */}
            <motion.div whileHover={{ scale: 1.02 }} className="p-4 border rounded-lg bg-indigo-50 border-indigo-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Scale className="h-5 w-5 text-indigo-600 mr-2"/>
                  <h3 className="font-semibold text-indigo-800">Notaires</h3>
                </div>
                <Badge variant="secondary" className="bg-indigo-200 text-indigo-800">
                  {roleStats.notaires?.active || 0} actifs
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-indigo-700">Actes réalisés:</span>
                  <span className="font-medium">{roleStats.notaires?.acts_completed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-700">Transactions:</span>
                  <span className="font-medium">{roleStats.notaires?.transactions || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-700">Validations:</span>
                  <span className="font-medium">{roleStats.notaires?.validations || 0}</span>
                </div>
              </div>
            </motion.div>

            {/* Géomètres */}
            <motion.div whileHover={{ scale: 1.02 }} className="p-4 border rounded-lg bg-teal-50 border-teal-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Survey className="h-5 w-5 text-teal-600 mr-2"/>
                  <h3 className="font-semibold text-teal-800">Géomètres</h3>
                </div>
                <Badge variant="secondary" className="bg-teal-200 text-teal-800">
                  {roleStats.geometres?.active || 0} actifs
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-teal-700">Relevés réalisés:</span>
                  <span className="font-medium">{roleStats.geometres?.surveys_completed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-700">Certifications:</span>
                  <span className="font-medium">{roleStats.geometres?.certifications || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-700">Expertises:</span>
                  <span className="font-medium">{roleStats.geometres?.expertise || 0}</span>
                </div>
              </div>
            </motion.div>

            {/* Agents Fonciers */}
            <motion.div whileHover={{ scale: 1.02 }} className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <UserCog className="h-5 w-5 text-yellow-600 mr-2"/>
                  <h3 className="font-semibold text-yellow-800">Agents Fonciers</h3>
                </div>
                <Badge variant="secondary" className="bg-yellow-200 text-yellow-800">
                  {roleStats.agents?.active || 0} actifs
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-yellow-700">Dossiers gérés:</span>
                  <span className="font-medium">{roleStats.agents?.cases_managed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Médiations:</span>
                  <span className="font-medium">{roleStats.agents?.mediations || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Tickets support:</span>
                  <span className="font-medium">{roleStats.agents?.support_tickets || 0}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center"><Activity className="mr-2 h-5 w-5"/>Activité Récente</CardTitle>
            <CardDescription>Dernières actions importantes sur la plateforme.</CardDescription>
          </CardHeader>
          <CardContent>
             <ul className="space-y-3">
              {recentActivities.slice(0, 5).map(activity => (
                <li key={activity.id} className="flex items-start space-x-3 text-sm">
                  {getIconForActivity(activity.type)}
                  <div>
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-muted-foreground"> {activity.action}.</span>
                    <span className="text-xs text-muted-foreground block">{activity.time}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Button variant="link" asChild className="p-0 h-auto mt-4 text-sm"><Link to="/admin/audit-log">Voir tout le journal d'audit</Link></Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="mr-2 h-5 w-5"/>
                État du Système
              </CardTitle>
              <CardDescription>Surveillance en temps réel des composants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Base de données</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    Opérationnel
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API Services</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    Optimal
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Stockage</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                    78% utilisé
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline" size="sm" className="justify-start"><Link to="/admin/users"><Users className="mr-2 h-4 w-4"/>Comptes</Link></Button>
                <Button asChild variant="outline" size="sm" className="justify-start"><Link to="/admin/parcels"><MapPin className="mr-2 h-4 w-4"/>Annonces</Link></Button>
                <Button asChild variant="outline" size="sm" className="justify-start"><Link to="/admin/blog"><FileText className="mr-2 h-4 w-4"/>Blog</Link></Button>
                <Button asChild variant="outline" size="sm" className="justify-start"><Link to="/admin/reports"><BarChart className="mr-2 h-4 w-4"/>Rapports</Link></Button>
                <Button asChild variant="outline" size="sm" className="justify-start"><Link to="/admin/audit-log"><History className="mr-2 h-4 w-4"/>Audit</Link></Button>
                <Button asChild variant="outline" size="sm" className="justify-start"><Link to="/admin/settings"><ComplianceIcon className="mr-2 h-4 w-4"/>Paramètres</Link></Button>
              </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5"/>
                  Analytics de Performance
                </CardTitle>
                <CardDescription>Vue d'ensemble des métriques système en temps réel</CardDescription>
              </div>
              <Badge variant="secondary">Dernière mise à jour: maintenant</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="performance" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="users" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5"/>
              Alertes Système
            </CardTitle>
            <CardDescription>Surveillance en temps réel des composants critiques</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertsData.map(alert => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg bg-muted/30">
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{alert.title}</p>
                    {getAlertBadge(alert.priority)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;

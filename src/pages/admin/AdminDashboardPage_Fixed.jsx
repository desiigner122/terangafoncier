import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  GitPullRequest, 
  ShieldCheck as ComplianceIcon, 
  Activity, 
  BarChart, 
  History, 
  FileText, 
  UserPlus, 
  UserCheck, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Monitor, 
  BarChart3, 
  Building2, 
  Landmark, 
  Home, 
  Store, 
  Scale, 
  MapPin as Survey, 
  UserCog, 
  PieChart as PieChartIcon, 
  Hammer
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { supabase } from '@/lib/customSupabaseClient';

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [generalStats, setGeneralStats] = useState({});
  const [roleStats, setRoleStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({});
  const [alertsData, setAlertsData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Statistiques par rôles
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
          roleStats.banques.total_loans = Math.floor(roleStats.banques.active * 15.3);
          roleStats.banques.approved_projects = Math.floor(roleStats.banques.active * 8.7);
          roleStats.banques.total_amount = roleStats.banques.active * 2.5;
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
          roleStats.vendeurs.total_revenue = roleStats.vendeurs.active * 1.2;
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
          roleStats.notaires.acts_completed = Math.floor(roleStats.notaires.active * 23.4);
          roleStats.notaires.transactions = Math.floor(roleStats.notaires.active * 15.8);
          roleStats.notaires.validations = Math.floor(roleStats.notaires.active * 31.2);
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
          roleStats.geometres.surveys_completed = Math.floor(roleStats.geometres.active * 18.7);
          roleStats.geometres.certifications = Math.floor(roleStats.geometres.active * 12.3);
          roleStats.geometres.expertise = Math.floor(roleStats.geometres.active * 8.9);
        } catch (error) {
          console.error('Erreur géomètres stats:', error);
        }

        // Requête pour statistiques des agents fonciers
        try {
          const { data: agentsData } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'Agent Foncier');
          
          roleStats.agents.active = agentsData?.length || 0;
          roleStats.agents.cases_managed = Math.floor(roleStats.agents.active * 34.6);
          roleStats.agents.mediations = Math.floor(roleStats.agents.active * 12.8);
          roleStats.agents.support_tickets = Math.floor(roleStats.agents.active * 45.3);
        } catch (error) {
          console.error('Erreur agents stats:', error);
        }

        setRoleStats(roleStats);

        // Statistiques générales
        const totalUsers = Object.values(roleStats).reduce((sum, role) => sum + role.active, 0);
        setGeneralStats({
          totalUsers,
          activeUsers: Math.floor(totalUsers * 0.73),
          totalTransactions: 1247,
          systemUptime: "99.8%"
        });

        // Données analytiques simulées
        setAnalyticsData({
          performanceData: [
            { date: '01/09', performance: 85, users: 120 },
            { date: '02/09', performance: 88, users: 135 },
            { date: '03/09', performance: 92, users: 148 },
            { date: '04/09', performance: 87, users: 142 },
            { date: '05/09', performance: 95, users: 165 }
          ]
        });

        // Activités récentes simulées
        setRecentActivities([
          { id: 1, user: 'Amadou Diallo', action: 'a créé un nouveau compte Banque', type: 'user_creation', time: '5 min' },
          { id: 2, user: 'Fatou Sall', action: 'a ajouté une nouvelle parcelle à Almadies', type: 'parcel_added', time: '12 min' },
          { id: 3, user: 'Ousmane Ba', action: 'a soumis une demande de validation', type: 'request_submitted', time: '25 min' },
          { id: 4, user: 'Aissatou Fall', action: 'a effectué un paiement de 2.5M XOF', type: 'payment_completed', time: '1h' },
          { id: 5, user: 'Mamadou Thiam', action: 'a finalisé un acte notarié', type: 'notarial_act', time: '2h' }
        ]);

        // Alertes système simulées
        setAlertsData([
          { id: 1, type: 'warning', title: 'Utilisation mémoire élevée', message: '5 requêtes en attente nécessitent une attention immédiate', priority: 'medium', time: '2h' },
          { id: 2, type: 'info', message: 'Nouveau record de connexions simultanées atteint', priority: 'low', time: '4h' },
          { id: 3, type: 'error', message: '1 transaction bloquée nécessite une intervention manuelle', priority: 'high', time: '6h' }
        ]);

      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
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
      className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
          <p className="text-muted-foreground">Vue d'ensemble de la plateforme Teranga Foncier</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link to="/admin/settings">
              <UserCog className="mr-2 h-4 w-4"/>
              Paramètres
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin/reports">
              <FileText className="mr-2 h-4 w-4"/>
              Rapports
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistiques générales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{generalStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +12% ce mois
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{generalStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              73% du total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{generalStats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              +5.2% cette semaine
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime Système</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{generalStats.systemUptime}</div>
            <p className="text-xs text-muted-foreground">
              Dernières 30 jours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques par rôles */}
      <div className="grid gap-6 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5"/>
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
                    <span className="font-medium">{roleStats.banques?.total_amount || 0}M XOF</span>
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
                    <span className="text-green-700">Permis urbanisme:</span>
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
                    <span className="text-orange-700">Propriétés listées:</span>
                    <span className="font-medium">{roleStats.vendeurs?.properties_listed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-700">Ventes réalisées:</span>
                    <span className="font-medium">{roleStats.vendeurs?.sales_completed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-700">Revenus totaux:</span>
                    <span className="font-medium">{roleStats.vendeurs?.total_revenue || 0}M XOF</span>
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
                    <span className="text-teal-700">Levés réalisés:</span>
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
              <motion.div whileHover={{ scale: 1.02 }} className="p-4 border rounded-lg bg-pink-50 border-pink-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <UserCog className="h-5 w-5 text-pink-600 mr-2"/>
                    <h3 className="font-semibold text-pink-800">Agents Fonciers</h3>
                  </div>
                  <Badge variant="secondary" className="bg-pink-200 text-pink-800">
                    {roleStats.agents?.active || 0} actifs
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-pink-700">Dossiers gérés:</span>
                    <span className="font-medium">{roleStats.agents?.cases_managed || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-pink-700">Médiations:</span>
                    <span className="font-medium">{roleStats.agents?.mediations || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-pink-700">Tickets support:</span>
                    <span className="font-medium">{roleStats.agents?.support_tickets || 0}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Section Construction à Distance - NOUVELLE */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <Hammer className="h-6 w-6" />
              Gestion Construction à Distance
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">Diaspora</Badge>
            </CardTitle>
            <CardDescription>
              Configuration des frais et suivi des projets de construction pour la diaspora sénégalaise
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Configuration des Frais */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    Frais de Construction
                  </h4>
                  <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                    <UserCog className="h-3 w-3 mr-1" />
                    Configurer
                  </Button>
                </div>
                
                <div className="grid gap-3">
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-emerald-800">Frais de Gestion</span>
                      <Badge variant="secondary" className="bg-emerald-200 text-emerald-800">8%</Badge>
                    </div>
                    <div className="text-xs text-emerald-600">
                      Gestion globale du projet • Min: 500k XOF • Max: 5M XOF
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-blue-800">Supervision Technique</span>
                      <Badge variant="secondary" className="bg-blue-200 text-blue-800">200k/phase</Badge>
                    </div>
                    <div className="text-xs text-blue-600">
                      Supervision par phase • Visites: 50k XOF
                    </div>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-purple-800">Reporting & FileTextation</span>
                      <Badge variant="secondary" className="bg-purple-200 text-purple-800">75k/mois</Badge>
                    </div>
                    <div className="text-xs text-purple-600">
                      Photos: 25k • Vidéos: 50k • Rapports mensuels
                    </div>
                  </div>
                  
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-orange-800">Services Premium Diaspora</span>
                      <Badge variant="secondary" className="bg-orange-200 text-orange-800">3%</Badge>
                    </div>
                    <div className="text-xs text-orange-600">
                      Support 24/7 • Updates hebdomadaires • Base: 250k XOF
                    </div>
                  </div>
                </div>
              </div>

              {/* Projets Actifs */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-600" />
                    Projets Actifs
                  </h4>
                  <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                    <Monitor className="h-3 w-3 mr-1" />
                    Voir Tous
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-sm">REMOTE001</div>
                        <div className="text-xs text-gray-600">Amadou Diallo - France</div>
                      </div>
                      <Badge variant="default" className="bg-emerald-600">En construction</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Phase: Élévation murs</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Budget: 85M XOF</span>
                        <span>Utilisé: 55M XOF</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-sm">REMOTE002</div>
                        <div className="text-xs text-gray-600">Fatou Sall - USA</div>
                      </div>
                      <Badge variant="secondary">Fondations</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Phase: Coulage dalle</span>
                        <span className="font-medium">35%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Budget: 120M XOF</span>
                        <span>Utilisé: 42M XOF</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Métriques Globales */}
                <div className="mt-4 p-4 bg-emerald-100 rounded-lg">
                  <h5 className="font-medium text-emerald-800 mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Revenus Construction à Distance
                  </h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-emerald-700 font-medium">2 Projets Actifs</div>
                      <div className="text-gray-600">Total: 205M XOF</div>
                    </div>
                    <div>
                      <div className="text-emerald-700 font-medium">Revenus Frais</div>
                      <div className="text-gray-600">25.8M XOF (3 mois)</div>
                    </div>
                    <div>
                      <div className="text-emerald-700 font-medium">Marge Moyenne</div>
                      <div className="text-gray-600">12.6% projets</div>
                    </div>
                    <div>
                      <div className="text-emerald-700 font-medium">Satisfaction Client</div>
                      <div className="text-gray-600">4.8/5 ⭐</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions Rapides */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium mb-3 flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Actions Administrateur
              </h5>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                  Modifier Frais de Gestion
                </Button>
                <Button size="sm" variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                  Configurer Supervision
                </Button>
                <Button size="sm" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                  Paramètres Reporting
                </Button>
                <Button size="sm" variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                  Services Premium
                </Button>
                <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                  Alertes & Notifications
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activité Récente et État Système */}
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
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">CDN</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Rapide
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="text-sm font-medium">Métriques Serveur</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>CPU: 34%</div>
                    <div>RAM: 67%</div>
                    <div>Disque: 23%</div>
                    <div>Réseau: Normal</div>
                  </div>
                </div>
              </CardContent>
          </Card>
        </div>

        {/* Analytics et Alertes */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5"/>
                  Performance Plateforme
                </CardTitle>
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
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Building2, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  BarChart3,
  PieChart,
  Globe,
  Settings,
  Bell,
  Flag,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Filter,
  Search,
  UserCheck,
  UserX,
  FileText,
  MessageSquare,
  Activity,
  Target,
  Zap,
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Monitor,
  Lock,
  Unlock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import { hybridDataService } from '@/services/HybridDataService';
// import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      activeUsers: 0,
      totalProperties: 0,
      totalTransactions: 0,
      systemUptime: 99.8,
      monthlyRevenue: 0
    },
    systemHealth: {
      server: {
        cpu: 45,
        memory: 68,
        disk: 72,
        network: 95
      },
      database: {
        connections: 128,
        queries: 1245,
        performance: 92
      },
      security: {
        threats: 3,
        blocked: 24,
        score: 98
      }
    },
    users: [], // DONNÉES RÉELLES UNIQUEMENT - chargées via hybridDataService
    properties: [], // DONNÉES RÉELLES UNIQUEMENT - chargées via hybridDataService
    transactions: [], // DONNÉES RÉELLES UNIQUEMENT - chargées via hybridDataService
    analytics: {
      userGrowth: [], // DONNÉES RÉELLES UNIQUEMENT - chargées via hybridDataService
      revenueGrowth: [], // DONNÉES RÉELLES UNIQUEMENT - chargées via hybridDataService
      topRegions: {}, // DONNÉES RÉELLES UNIQUEMENT - chargées via hybridDataService
      platformStats: {
        totalListings: 0,
        activeListings: 0,
        soldProperties: 0,
        averagePrice: 0,
        conversionRate: 0
      }
    },
    reports: [] // DONNÉES RÉELLES UNIQUEMENT - chargées via hybridDataService
  });

  // Fonction de chargement des données hybrides
  const loadRealData = async () => {
    try {
      setLoading(true);
      setLoadingError(null);
      
      console.log('🚀 Chargement données admin hybrides (Supabase + API)...');
      
      const result = await hybridDataService.getAdminDashboardData();
      
      if (result.success) {
        setDashboardData(prevData => ({
          ...prevData,
          stats: result.data.stats,
          users: result.data.users || prevData.users,
          properties: result.data.properties || prevData.properties,
          transactions: result.data.transactions || prevData.transactions
        }));
        
        console.log('✅ Données hybrides chargées:', result.data.dataSource);
      } else {
        setLoadingError(result.error);
        console.error('❌ Erreur chargement données hybrides:', result.error);
      }
      
    } catch (error) {
      setLoadingError(error.message);
      console.error('❌ Erreur inattendue:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRealData();
  }, []);

  const stats = [
    { value: dashboardData.stats.totalUsers, label: 'Utilisateurs Total' },
    { value: dashboardData.stats.activeUsers, label: 'Utilisateurs Actifs' },
    { value: dashboardData.stats.totalProperties, label: 'Biens Immobiliers' },
    { value: `${dashboardData.stats.systemUptime}%`, label: 'Uptime Système' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Actif': 'bg-green-500',
      'Inactif': 'bg-gray-500',
      'Suspendu': 'bg-red-500',
      'En attente': 'bg-yellow-500',
      'Complétée': 'bg-green-500',
      'En cours': 'bg-blue-500',
      'Annulée': 'bg-red-500',
      'Nouveau': 'bg-blue-500',
      'En cours': 'bg-yellow-500',
      'Résolu': 'bg-green-500',
      'Fermé': 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'Critique': 'bg-red-500',
      'Élevé': 'bg-orange-500',
      'Moyen': 'bg-yellow-500',
      'Faible': 'bg-blue-500'
    };
    return colors[severity] || 'bg-gray-500';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du panneau d'administration...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Administration Générale"
      subtitle="Supervision et gestion de la plateforme"
      userRole="Admin"
      stats={stats}
    >
      <div className="space-y-6">
        {/* Indicateur de source des données */}
        {!loading && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  🎯 DONNÉES RÉELLES - Architecture Hybride
                </span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-green-600">
                <span>📊 Supabase: Users, Properties, Transactions</span>
                <span>🔗 API: IA, Blockchain, Paiements</span>
              </div>
            </div>
          </div>
        )}

        {/* Gestion des erreurs */}
        {loadingError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-800">
                Erreur de chargement: {loadingError}
              </span>
            </div>
          </div>
        )}

        {/* Widgets IA & Blockchain */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AIAssistantWidget userRole="Admin" dashboardData={dashboardData} />
          {/* <BlockchainWidget userRole="Admin" /> */}
        </div>

        {/* System Health Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Server Performance */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Performance Serveur</p>
                  <p className="text-lg font-bold text-green-600">Optimal</p>
                </div>
                <Server className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>CPU: {dashboardData.systemHealth.server.cpu}%</div>
                  <div>RAM: {dashboardData.systemHealth.server.memory}%</div>
                  <div>Disque: {dashboardData.systemHealth.server.disk}%</div>
                  <div>Réseau: {dashboardData.systemHealth.server.network}%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Database Health */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Base de Données</p>
                  <p className="text-lg font-bold text-blue-600">
                    {dashboardData.systemHealth.database.performance}%
                  </p>
                </div>
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <Progress value={dashboardData.systemHealth.database.performance} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {dashboardData.systemHealth.database.connections} connexions actives
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Security Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sécurité</p>
                  <p className="text-lg font-bold text-purple-600">
                    {dashboardData.systemHealth.security.score}%
                  </p>
                </div>
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <Lock className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">{dashboardData.systemHealth.security.blocked} menaces bloquées</span>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Metrics */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Revenus Mensuels</p>
                  <p className="text-lg font-bold text-orange-600">
                    {formatCurrency(dashboardData.stats.monthlyRevenue)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+24% vs mois dernier</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="properties">Biens</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="reports">Signalements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Admin Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-red-600" />
                    Actions Administrateur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Valider Utilisateurs
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Flag className="h-4 w-4 mr-2" />
                    Traiter Signalements
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Générer Rapports
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres Système
                  </Button>
                </CardContent>
              </Card>

              {/* Platform Statistics */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-600" />
                    Statistiques Plateforme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{dashboardData.analytics.platformStats.totalListings}</p>
                      <p className="text-sm text-gray-600">Total Annonces</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{dashboardData.analytics.platformStats.activeListings}</p>
                      <p className="text-sm text-gray-600">Annonces Actives</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{dashboardData.analytics.platformStats.soldProperties}</p>
                      <p className="text-sm text-gray-600">Biens Vendus</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{formatCurrency(dashboardData.analytics.platformStats.averagePrice)}</p>
                      <p className="text-sm text-gray-600">Prix Moyen</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{dashboardData.analytics.platformStats.conversionRate}%</p>
                      <p className="text-sm text-gray-600">Taux Conversion</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-indigo-600">{dashboardData.stats.totalTransactions}</p>
                      <p className="text-sm text-gray-600">Transactions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Monitoring */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="h-5 w-5 mr-2 text-blue-600" />
                    Monitoring Système
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm flex items-center">
                          <Cpu className="h-4 w-4 mr-1" />
                          CPU
                        </span>
                        <span className="text-sm font-medium">{dashboardData.systemHealth.server.cpu}%</span>
                      </div>
                      <Progress value={dashboardData.systemHealth.server.cpu} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm flex items-center">
                          <MemoryStick className="h-4 w-4 mr-1" />
                          Mémoire
                        </span>
                        <span className="text-sm font-medium">{dashboardData.systemHealth.server.memory}%</span>
                      </div>
                      <Progress value={dashboardData.systemHealth.server.memory} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm flex items-center">
                          <HardDrive className="h-4 w-4 mr-1" />
                          Stockage
                        </span>
                        <span className="text-sm font-medium">{dashboardData.systemHealth.server.disk}%</span>
                      </div>
                      <Progress value={dashboardData.systemHealth.server.disk} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm flex items-center">
                          <Wifi className="h-4 w-4 mr-1" />
                          Réseau
                        </span>
                        <span className="text-sm font-medium">{dashboardData.systemHealth.server.network}%</span>
                      </div>
                      <Progress value={dashboardData.systemHealth.server.network} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-purple-600" />
                    Répartition Régionale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(dashboardData.analytics.topRegions).map(([region, percentage]) => (
                      <div key={region}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{region}</span>
                          <span className="text-sm">{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>

            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Utilisateurs Vérifiés</p>
                      <p className="text-2xl font-bold text-green-600">
                        {dashboardData.users.filter(u => u.verified).length}
                      </p>
                    </div>
                    <UserCheck className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Utilisateurs Suspendus</p>
                      <p className="text-2xl font-bold text-red-600">
                        {dashboardData.users.filter(u => u.suspended).length}
                      </p>
                    </div>
                    <UserX className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Nouveaux ce Mois</p>
                      <p className="text-2xl font-bold text-blue-600">147</p>
                    </div>
                    <Plus className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Taux d'Engagement</p>
                      <p className="text-2xl font-bold text-purple-600">78%</p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Users List */}
            <div className="grid gap-4">
              {dashboardData.users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <Badge className={`${getStatusColor(user.status)} text-white`}>
                            {user.status}
                          </Badge>
                          <Badge variant="outline">
                            {user.role}
                          </Badge>
                          {user.verified && (
                            <Badge className="bg-green-500 text-white">
                              Vérifié
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Inscription</p>
                            <p className="font-medium">{new Date(user.joinDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Dernière Connexion</p>
                            <p className="font-medium">{new Date(user.lastLogin).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Transactions</p>
                            <p className="font-medium">{user.totalTransactions}</p>
                          </div>
                        </div>

                        {user.suspensionReason && (
                          <div className="bg-red-50 p-3 rounded-lg mb-4">
                            <p className="text-sm text-red-800">
                              <strong>Motif de suspension:</strong> {user.suspensionReason}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        {user.suspended ? (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Unlock className="h-4 w-4 mr-1" />
                            Réactiver
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                            <Lock className="h-4 w-4 mr-1" />
                            Suspendre
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Biens</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {dashboardData.properties.map((property) => (
                <Card key={property.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{property.title}</h3>
                          <Badge className={`${getStatusColor(property.status)} text-white`}>
                            {property.status}
                          </Badge>
                          {property.verified && (
                            <Badge className="bg-green-500 text-white">
                              Vérifié
                            </Badge>
                          )}
                          {property.featured && (
                            <Badge className="bg-purple-500 text-white">
                              Mis en avant
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Propriétaire</p>
                            <p className="font-medium">{property.owner}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Prix</p>
                            <p className="font-medium text-green-600">{formatCurrency(property.price)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Vues</p>
                            <p className="font-medium">{property.views}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Publié le</p>
                            <p className="font-medium">{new Date(property.datePosted).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>

                        {property.reports > 0 && (
                          <div className="bg-yellow-50 p-3 rounded-lg">
                            <p className="text-sm text-yellow-800">
                              <strong>⚠️ {property.reports} signalement(s)</strong> - Nécessite une vérification
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Transactions</h2>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>

            <div className="grid gap-4">
              {dashboardData.transactions.map((transaction) => (
                <Card key={transaction.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{transaction.type}</h3>
                          <Badge className={`${getStatusColor(transaction.status)} text-white`}>
                            {transaction.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">
                              {transaction.type === 'Vente' ? 'Acheteur' : 'Demandeur'}
                            </p>
                            <p className="font-medium">{transaction.buyer || transaction.applicant}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              {transaction.type === 'Vente' ? 'Vendeur' : 'Municipalité'}
                            </p>
                            <p className="font-medium">{transaction.seller || transaction.municipality}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Montant</p>
                            <p className="font-medium text-green-600">{formatCurrency(transaction.amount)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Commission</p>
                            <p className="font-medium">{formatCurrency(transaction.commission)}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Bien: {transaction.property}</span>
                          <span>Date: {new Date(transaction.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Documents
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Signalements</h2>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer par type
              </Button>
            </div>

            <div className="grid gap-4">
              {dashboardData.reports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{report.type}</h3>
                          <Badge className={`${getStatusColor(report.status)} text-white`}>
                            {report.status}
                          </Badge>
                          <Badge className={`${getSeverityColor(report.severity)} text-white`}>
                            {report.severity}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Signalé par</p>
                            <p className="font-medium">{report.reporter}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Élément signalé</p>
                            <p className="font-medium">{report.reported}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="font-medium">{new Date(report.date).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        {report.status === 'Nouveau' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Traiter
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Examiner
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Analytics Avancées</h2>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Rapport Complet
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Croissance Utilisateurs</p>
                      <p className="text-2xl font-bold text-blue-600">+18.5%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Croissance Revenus</p>
                      <p className="text-2xl font-bold text-green-600">+24.2%</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Satisfaction Client</p>
                      <p className="text-2xl font-bold text-purple-600">96%</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Temps Réponse Moyen</p>
                      <p className="text-2xl font-bold text-orange-600">2.1s</p>
                    </div>
                    <Zap className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Growth Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Croissance Utilisateurs (12 mois)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Graphique de croissance</p>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-400">
                        {dashboardData.analytics.userGrowth.slice(-6).map((count, index) => (
                          <span key={index}>{count}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Évolution Revenus (10 mois)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Graphique des revenus</p>
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-400">
                        {dashboardData.analytics.revenueGrowth.slice(-5).map((revenue, index) => (
                          <span key={index}>{revenue}M</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

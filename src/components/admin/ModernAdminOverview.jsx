import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  // Analytics Icons
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Globe,
  Eye,
  
  // Business Icons
  DollarSign,
  Users,
  Building2,
  FileText,
  ShoppingCart,
  Crown,
  Award,
  Zap,
  
  // System Icons
  Server,
  Database,
  Shield,
  Lock,
  Wifi,
  HardDrive,
  Cpu,
  Monitor,
  
  // Action Icons
  UserCheck,
  Flag,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Edit,
  Download,
  Filter,
  
  // Navigation Icons
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Settings,
  Bell,
  MessageSquare,
  
  // Status Icons
  Check,
  X,
  Minus,
  AlertCircle,
  Info,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ModernAdminOverview = ({ 
  dashboardData, 
  loadingData, 
  onTabChange,
  pendingPropertiesCount = 0,
  pendingVerificationsCount = 0,
  urgentTicketsCount = 0,
  onNavigate
}) => {
  // Statistiques temps réel dérivées UNIQUEMENT des vraies données du dashboard.
  // La "charge système" nécessite un vrai monitoring -> null tant qu'il n'est pas branché.
  const realtimeStats = {
    onlineUsers: dashboardData?.stats?.activeUsers || 0,
    activeTransactions: dashboardData?.stats?.totalTransactions || 0,
    systemLoad: dashboardData?.systemHealth?.server?.cpu ?? null,
    alertsCount: pendingPropertiesCount + pendingVerificationsCount + urgentTicketsCount
  };

  const [quickActions, setQuickActions] = useState([
    { 
      id: 'property-validation', 
      title: `Valider ${pendingPropertiesCount} propriété${pendingPropertiesCount > 1 ? 's' : ''}`, 
      urgent: pendingPropertiesCount > 0, 
      count: pendingPropertiesCount,
      action: () => onNavigate && onNavigate('property-validation')
    },
    { 
      id: 'user-verifications', 
      title: `Vérifier ${pendingVerificationsCount} utilisateur${pendingVerificationsCount > 1 ? 's' : ''}`, 
      urgent: pendingVerificationsCount > 5, 
      count: pendingVerificationsCount,
      action: () => onNavigate && onNavigate('user-verifications')
    },
    { 
      id: 'urgent-tickets', 
      title: `Traiter ${urgentTicketsCount} ticket${urgentTicketsCount > 1 ? 's' : ''} urgent${urgentTicketsCount > 1 ? 's' : ''}`, 
      urgent: urgentTicketsCount > 0, 
      count: urgentTicketsCount,
      action: () => onNavigate && onNavigate('support')
    }
  ]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  };

  // Get trend icon and color
  const getTrendIndicator = (value, isPositiveGood = true) => {
    const isPositive = value > 0;
    const isGood = isPositiveGood ? isPositive : !isPositive;

    return {
      icon: isPositive ? TrendingUp : TrendingDown,
      color: isGood ? 'text-green-600' : 'text-red-600',
      bgColor: isGood ? 'bg-green-50' : 'bg-red-50',
      value: Math.abs(value)
    };
  };

  // Pastille de tendance : ne s'affiche QUE si une vraie variation est disponible.
  // (Aucune valeur de croissance codée en dur : nécessite un historique réel.)
  const TrendChip = ({ value, period }) => {
    if (value === null || value === undefined || Number.isNaN(value)) return null;
    const trend = getTrendIndicator(value);
    const TrendIcon = trend.icon;
    return (
      <div className="flex items-center">
        <div className={`flex items-center ${trend.color}`}>
          <TrendIcon className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">{value > 0 ? '+' : ''}{trend.value}%</span>
        </div>
        {period && <span className="text-xs text-gray-500 ml-2">{period}</span>}
      </div>
    );
  };

  // Formatage d'une date en libellé relatif ("il y a 5 min")
  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return "à l'instant";
    if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
    return `il y a ${Math.floor(diff / 86400)} j`;
  };

  const trends = dashboardData?.trends || {};
  const recentActivity = dashboardData?.recentActivity || [];
  const systemAlerts = dashboardData?.systemAlerts || [];
  const geography = dashboardData?.geography || [];

  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header avec indicateur temps réel */}
      <motion.div variants={cardVariants}>
        <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold flex items-center">
                  <Sparkles className="h-8 w-8 mr-3" />
                  Tableau de Bord Administrateur
                </h1>
                <p className="text-blue-100 text-lg">
                  Plateforme Teranga Foncier - Vue d'ensemble en temps réel
                </p>
              </div>
              <div className="text-right space-y-2">
                <div className="flex items-center text-green-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm">Système opérationnel</span>
                </div>
                <div className="text-blue-100 text-sm">
                  {new Date().toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Métriques principales */}
      <motion.div variants={cardVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenus */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Revenus Mensuels</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatCurrency(dashboardData?.stats?.monthlyRevenue || 0)}
                  </p>
                  <TrendChip value={trends.revenue ?? null} period="vs mois dernier" />
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Utilisateurs */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData?.stats?.totalUsers || 0}
                  </p>
                  <TrendChip value={trends.users ?? null} period="cette semaine" />
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Propriétés */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Propriétés Listées</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData?.stats?.totalProperties || 0}
                  </p>
                  <TrendChip value={trends.properties ?? null} period="ce mois" />
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Transactions</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData?.stats?.totalTransactions || 0}
                  </p>
                  <TrendChip value={trends.transactions ?? null} period="ce mois" />
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Status système et actions rapides */}
      <motion.div variants={cardVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* État du système */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Monitor className="h-5 w-5 mr-2 text-blue-600" />
                État du Système
              </CardTitle>
              <CardDescription>
                Performance et santé de la plateforme en temps réel
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const sh = dashboardData?.systemHealth;
                const fmt = (v) => (v === null || v === undefined ? 'N/D' : `${v}%`);
                if (!sh) {
                  return (
                    <div className="p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500">
                      Le monitoring système n'est pas encore branché à une source réelle.
                    </div>
                  );
                }
                return (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Server className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-lg font-bold text-green-600">{fmt(sh?.server?.uptime)}</p>
                      <p className="text-xs text-gray-600">Serveur</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-lg font-bold text-blue-600">{fmt(sh?.database?.uptime)}</p>
                      <p className="text-xs text-gray-600">Database</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-lg font-bold text-purple-600">{fmt(sh?.security?.score)}</p>
                      <p className="text-xs text-gray-600">Sécurité</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <Wifi className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-lg font-bold text-orange-600">{fmt(sh?.server?.network)}</p>
                      <p className="text-xs text-gray-600">Réseau</p>
                    </div>
                  </div>
                );
              })()}

              {/* Métriques détaillées */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Utilisateurs actifs</span>
                  <span className="font-medium">{realtimeStats.onlineUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Transactions totales</span>
                  <span className="font-medium">{realtimeStats.activeTransactions}</span>
                </div>
                {realtimeStats.systemLoad !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Charge système</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={realtimeStats.systemLoad} className="w-20 h-2" />
                      <span className="font-medium">{realtimeStats.systemLoad}%</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-red-600" />
                Actions Rapides
              </CardTitle>
              <CardDescription>
                Tâches nécessitant votre attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.filter(action => action.count > 0).map((action) => (
                <motion.div 
                  key={action.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={action.action}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${action.urgent ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`}></div>
                    <div>
                      <p className="text-sm font-medium">{action.title}</p>
                      {action.urgent && (
                        <p className="text-xs text-red-600 font-semibold">⚠️ Action urgente requise</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={action.urgent ? "destructive" : "secondary"}>
                      {action.count}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </motion.div>
              ))}

              {quickActions.filter(action => action.count > 0).length === 0 && (
                <div className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Toutes les actions sont à jour !</p>
                </div>
              )}

              {onTabChange && (
                <Button className="w-full mt-4" variant="outline" onClick={() => onTabChange('users')}>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Voir toutes les actions
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Graphiques et analytics */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
              Analytics Avancées
            </CardTitle>
            <CardDescription>
              Vue d'ensemble des performances de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="revenue" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="revenue">Revenus</TabsTrigger>
                <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                <TabsTrigger value="properties">Propriétés</TabsTrigger>
                <TabsTrigger value="geography">Géographie</TabsTrigger>
              </TabsList>

              <TabsContent value="revenue" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Revenus Aujourd'hui</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(dashboardData?.stats?.dailyRevenue || 0)}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Revenus Cette Semaine</p>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(dashboardData?.stats?.weeklyRevenue || 0)}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Revenus Mensuels</p>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(dashboardData?.stats?.monthlyRevenue || 0)}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Utilisateurs</p>
                    <p className="text-2xl font-bold text-blue-600">{dashboardData?.stats?.totalUsers ?? 0}</p>
                    <p className="text-xs text-gray-500">Inscrits sur la plateforme</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Utilisateurs Actifs</p>
                    <p className="text-2xl font-bold text-green-600">{dashboardData?.stats?.activeUsers ?? 0}</p>
                    <p className="text-xs text-gray-500">Comptes actifs</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600">Abonnements Actifs</p>
                    <p className="text-2xl font-bold text-purple-600">{dashboardData?.stats?.activeSubscriptions ?? 0}</p>
                    <p className="text-xs text-gray-500">En cours</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="properties" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Propriétés</p>
                    <p className="text-2xl font-bold text-orange-600">{dashboardData?.stats?.totalProperties ?? 0}</p>
                    <p className="text-xs text-gray-500">Biens listés</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Propriétés Vérifiées</p>
                    <p className="text-2xl font-bold text-green-600">{dashboardData?.stats?.verifiedProperties ?? 0}</p>
                    <p className="text-xs text-gray-500">Validées</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-gray-600">En Attente</p>
                    <p className="text-2xl font-bold text-yellow-600">{dashboardData?.stats?.pendingProperties ?? 0}</p>
                    <p className="text-xs text-gray-500">À valider</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="geography" className="space-y-4">
                {geography.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-500">
                    Aucune donnée géographique disponible.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {geography.map((g, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 truncate">{g.region}</p>
                        <p className="text-2xl font-bold text-gray-900">{g.percent}%</p>
                        <p className="text-xs text-gray-500">{g.count} bien{g.count > 1 ? 's' : ''}</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activité récente et alertes */}
      <motion.div variants={cardVariants}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activité récente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-indigo-600" />
                Activité Récente
              </CardTitle>
              <CardDescription>
                Dernières actions sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="p-6 text-center">
                  <Activity className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Aucune activité récente.</p>
                </div>
              ) : (
                recentActivity.map((activity, index) => {
                  const label = activity.label || 'Activité';
                  const initials = String(label).split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className={`text-xs ${
                          activity.type === 'property' ? 'bg-green-100 text-green-600' :
                          activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'transaction' ? 'bg-purple-100 text-purple-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{label}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{timeAgo(activity.created_at)}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Alertes système */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-red-600" />
                Alertes & Notifications
                <Badge variant="destructive" className="ml-2">
                  {realtimeStats.alertsCount}
                </Badge>
              </CardTitle>
              <CardDescription>
                Notifications importantes nécessitant votre attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {systemAlerts.length === 0 ? (
                <div className="p-6 text-center">
                  <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Aucune alerte active.</p>
                </div>
              ) : (
                systemAlerts.map((alert, index) => (
                  <div key={alert.id || index} className={`flex items-start space-x-3 p-3 rounded-lg ${
                    alert.type === 'error' ? 'bg-red-50 border border-red-200' :
                    alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}>
                    <div className={`mt-0.5 ${
                      alert.type === 'error' ? 'text-red-600' :
                      alert.type === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>
                      {alert.type === 'error' ? <XCircle className="h-4 w-4" /> :
                       alert.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                       <Info className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.title || alert.message}</p>
                      {alert.desc && <p className="text-xs text-gray-600">{alert.desc}</p>}
                      {alert.created_at && <p className="text-xs text-gray-500 mt-1">{timeAgo(alert.created_at)}</p>}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModernAdminOverview;
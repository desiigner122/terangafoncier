import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  FileText, 
  Users, 
  Map,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Target,
  Calendar,
  Activity,
  TreePine,
  Truck,
  Zap,
  Flag,
  Award,
  DollarSign,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MairieOverview = ({ dashboardStats }) => {
  const [timeFilter, setTimeFilter] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  // Handlers pour les actions rapides
  const handleNewRequest = () => {
    setIsLoading(true);
    // Simulation d'action
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Nouvelle demande",
        description: "Formulaire de demande communale ouvert",
        variant: "success"
      });
      setIsLoading(false);
      // Ici on pourrait ouvrir un modal ou naviguer vers le formulaire
    }, 1000);
  };

  const handleResolveConflict = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Résolution de conflit",
        description: "Module de médiation activé",
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleOpenCadastre = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Cadastre numérique",
        description: "Interface cadastrale chargée",
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleBlockchainNFT = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Blockchain NFT",
        description: "Module blockchain activé pour création NFT",
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleExportReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Rapport exporté",
        description: "Rapport municipal généré avec succès",
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  // Données statistiques principales
  const mainStats = [
    {
      title: 'Demandes en Cours',
      value: dashboardStats.pendingRequests,
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'bg-blue-500',
      description: 'Demandes communales actives'
    },
    {
      title: 'Territoire Géré',
      value: dashboardStats.territoryArea,
      change: '+0.5%',
      trend: 'up',
      icon: Map,
      color: 'bg-green-500',
      description: 'Surface municipale totale'
    },
    {
      title: 'Citoyens Actifs',
      value: dashboardStats.activeCitizens.toLocaleString(),
      change: '+3.2%',
      trend: 'up',
      icon: Users,
      color: 'bg-purple-500',
      description: 'Population engagée'
    },
    {
      title: 'Parcelles Gérées',
      value: dashboardStats.totalLandManaged,
      change: '+8.1%',
      trend: 'up',
      icon: Building2,
      color: 'bg-orange-500',
      description: 'Terrains sous gestion'
    }
  ];

  // Données graphiques
  const weeklyRequests = [
    { day: 'Lun', requests: 12, approvals: 8 },
    { day: 'Mar', requests: 19, approvals: 15 },
    { day: 'Mer', requests: 15, approvals: 12 },
    { day: 'Jeu', requests: 22, approvals: 18 },
    { day: 'Ven', requests: 18, approvals: 16 },
    { day: 'Sam', requests: 8, approvals: 6 },
    { day: 'Dim', requests: 5, approvals: 4 }
  ];

  const requestsByType = [
    { name: 'Attribution Communale', value: 45, color: '#3B82F6' },
    { name: 'Permis Construire', value: 30, color: '#10B981' },
    { name: 'Modification Cadastre', value: 15, color: '#F59E0B' },
    { name: 'Résolution Conflits', value: 10, color: '#EF4444' }
  ];

  const zoneUtilization = [
    { zone: 'Zone Résidentielle', utilized: 78, total: 100 },
    { zone: 'Zone Commerciale', utilized: 65, total: 100 },
    { zone: 'Zone Agricole', utilized: 45, total: 100 },
    { zone: 'Zone Industrielle', utilized: 82, total: 100 }
  ];

  // Demandes récentes
  const recentRequests = [
    {
      id: '#MR-2024-0987',
      applicant: 'Amadou Diallo',
      type: 'Attribution Communale',
      area: '1200m²',
      zone: 'Zone Résidentielle Nord',
      status: 'En Évaluation',
      priority: 'Moyenne',
      date: '2024-01-20',
      aiScore: 85
    },
    {
      id: '#MR-2024-0988',
      applicant: 'Fatou Seck',
      type: 'Permis de Construire',
      area: '800m²',
      zone: 'Zone Commerciale Centre',
      status: 'Approuvé',
      priority: 'Haute',
      date: '2024-01-19',
      aiScore: 92
    },
    {
      id: '#MR-2024-0989',
      applicant: 'Ibrahim Ndiaye',
      type: 'Modification Cadastre',
      area: '650m²',
      zone: 'Zone Mixte Sud',
      status: 'En Attente',
      priority: 'Normale',
      date: '2024-01-18',
      aiScore: 78
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approuvé': return 'bg-green-100 text-green-800';
      case 'En Évaluation': return 'bg-blue-100 text-blue-800';
      case 'En Attente': return 'bg-yellow-100 text-yellow-800';
      case 'Rejeté': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Haute': return 'bg-red-500';
      case 'Moyenne': return 'bg-orange-500';
      case 'Normale': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec actions rapides */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Vue d'ensemble</h2>
          <p className="text-gray-600 mt-1">Tableau de bord municipal - {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2 bg-white rounded-lg border p-1">
            {['24h', '7d', '30d', '90d'].map((period) => (
              <Button
                key={period}
                variant={timeFilter === period ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeFilter(period)}
                className={timeFilter === period ? 'bg-teal-600 text-white' : ''}
              >
                {period}
              </Button>
            ))}
          </div>
          <Button 
            className="bg-teal-600 hover:bg-teal-700"
            onClick={handleExportReport}
            disabled={isLoading}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Générer Rapport
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-4 w-4 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center space-x-2 mt-2">
                  <div className={`flex items-center text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </div>
                  <span className="text-sm text-gray-600">vs période précédente</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
              
              {/* Effet de gradient décoratif */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} rounded-full opacity-5 transform translate-x-16 -translate-y-16`} />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Évolution des demandes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 text-blue-600 mr-2" />
              Évolution des Demandes
            </CardTitle>
            <CardDescription>
              Demandes et approbations sur 7 jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyRequests}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="requests" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                  name="Demandes"
                />
                <Area 
                  type="monotone" 
                  dataKey="approvals" 
                  stackId="1"
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.3}
                  name="Approbations"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition par type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 text-purple-600 mr-2" />
              Types de Demandes
            </CardTitle>
            <CardDescription>
              Répartition mensuelle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={requestsByType}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {requestsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Utilisation des zones et demandes récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilisation des zones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Map className="h-5 w-5 text-green-600 mr-2" />
              Utilisation des Zones
            </CardTitle>
            <CardDescription>
              Taux d'occupation par zone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {zoneUtilization.map((zone, index) => (
              <div key={zone.zone} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{zone.zone}</span>
                  <span className="text-sm text-gray-600">{zone.utilized}%</span>
                </div>
                <Progress value={zone.utilized} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Demandes récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 text-orange-600 mr-2" />
              Demandes Récentes
            </CardTitle>
            <CardDescription>
              Dernières soumissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRequests.map((request) => (
              <div key={request.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {request.applicant}
                    </p>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(request.priority)}`} />
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{request.type} • {request.area}</p>
                  <p className="text-xs text-gray-500">{request.zone}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                      {request.status}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-gray-600">IA: {request.aiScore}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(request.date).toLocaleDateString('fr-FR', { 
                    day: '2-digit', 
                    month: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 text-yellow-600 mr-2" />
            Actions Rapides
          </CardTitle>
          <CardDescription>
            Raccourcis vers les fonctions principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-300"
              onClick={handleNewRequest}
              disabled={isLoading}
            >
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Nouvelle Demande</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-green-50 hover:border-green-300"
              onClick={handleResolveConflict}
              disabled={isLoading}
            >
              <Shield className="h-6 w-6 text-green-600" />
              <span className="text-sm">Résoudre Conflit</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-300"
              onClick={handleOpenCadastre}
              disabled={isLoading}
            >
              <Map className="h-6 w-6 text-purple-600" />
              <span className="text-sm">Cadastre Digital</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50 hover:border-orange-300"
              onClick={handleBlockchainNFT}
              disabled={isLoading}
            >
              <Award className="h-6 w-6 text-orange-600" />
              <span className="text-sm">Blockchain NFT</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MairieOverview;
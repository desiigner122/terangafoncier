import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  MapPin,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Target,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  Eye,
  FileText,
  Clock,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart as RechartsLine, 
  Line, 
  AreaChart, 
  Area, 
  BarChart as RechartsBar, 
  Bar, 
  PieChart as RechartsPie, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const MairieAnalytics = ({ dashboardStats }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeFilter, setTimeFilter] = useState('12m');
  const [reportType, setReportType] = useState('monthly');

  // Données pour les graphiques
  const monthlyRequests = [
    { month: 'Jan', requests: 45, approved: 38, rejected: 7 },
    { month: 'Fév', requests: 52, approved: 45, rejected: 7 },
    { month: 'Mar', requests: 48, approved: 41, rejected: 7 },
    { month: 'Avr', requests: 61, approved: 54, rejected: 7 },
    { month: 'Mai', requests: 55, approved: 48, rejected: 7 },
    { month: 'Jun', requests: 67, approved: 59, rejected: 8 },
    { month: 'Jul', requests: 58, approved: 52, rejected: 6 },
    { month: 'Aoû', requests: 63, approved: 56, rejected: 7 },
    { month: 'Sep', requests: 59, approved: 51, rejected: 8 },
    { month: 'Oct', requests: 64, approved: 57, rejected: 7 },
    { month: 'Nov', requests: 69, approved: 61, rejected: 8 },
    { month: 'Déc', requests: 72, approved: 65, rejected: 7 }
  ];

  const requestsByZone = [
    { zone: 'Résidentielle Nord', requests: 156, percentage: 35 },
    { zone: 'Commerciale Centre', requests: 98, percentage: 22 },
    { zone: 'Agricole Est', requests: 89, percentage: 20 },
    { zone: 'Industrielle Sud', requests: 67, percentage: 15 },
    { zone: 'Mixte Ouest', requests: 34, percentage: 8 }
  ];

  const requestsByType = [
    { name: 'Attribution Communale', value: 178, color: '#3B82F6' },
    { name: 'Permis Construire', value: 134, color: '#10B981' },
    { name: 'Modification Cadastre', value: 89, color: '#F59E0B' },
    { name: 'Résolution Conflits', value: 43, color: '#EF4444' }
  ];

  const processingTimes = [
    { type: 'Attribution Communale', avgDays: 18, target: 15, efficiency: 83 },
    { type: 'Permis Construire', avgDays: 22, target: 20, efficiency: 91 },
    { type: 'Modification Cadastre', avgDays: 16, target: 12, efficiency: 75 },
    { type: 'Résolution Conflits', avgDays: 45, target: 40, efficiency: 89 }
  ];

  const populationStats = [
    { quarter: 'Q1 2024', population: 8420, growth: 2.3 },
    { quarter: 'Q2 2024', population: 8498, growth: 2.1 },
    { quarter: 'Q3 2024', population: 8542, growth: 1.8 },
    { quarter: 'Q4 2024', population: 8601, growth: 2.0 }
  ];

  // KPIs principaux
  const mainKPIs = [
    {
      title: 'Demandes Traitées',
      value: '687',
      change: '+12.5%',
      trend: 'up',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Taux d\'Approbation',
      value: '87.3%',
      change: '+3.2%',
      trend: 'up',
      icon: Target,
      color: 'green'
    },
    {
      title: 'Délai Moyen',
      value: '19.5j',
      change: '-2.1j',
      trend: 'up',
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'Satisfaction',
      value: '4.2/5',
      change: '+0.3',
      trend: 'up',
      icon: Users,
      color: 'purple'
    }
  ];

  const getKPIColor = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      orange: 'text-orange-600 bg-orange-100',
      purple: 'text-purple-600 bg-purple-100'
    };
    return colors[color] || 'text-gray-600 bg-gray-100';
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analyses & Rapports</h2>
          <p className="text-gray-600 mt-1">
            Statistiques et indicateurs de performance municipale
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 mois</SelectItem>
              <SelectItem value="6m">6 mois</SelectItem>
              <SelectItem value="12m">12 mois</SelectItem>
              <SelectItem value="24m">24 mois</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Download className="h-4 w-4 mr-2" />
            Export Rapport
          </Button>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainKPIs.map((kpi, index) => {
          const TrendIcon = getTrendIcon(kpi.trend);
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{kpi.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                      <div className={`flex items-center space-x-1 mt-1 ${getTrendColor(kpi.trend)}`}>
                        <TrendIcon className="h-3 w-3" />
                        <span className="text-sm">{kpi.change}</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${getKPIColor(kpi.color)}`}>
                      <kpi.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="requests">Demandes</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="population">Population</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Évolution mensuelle des demandes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 text-blue-600 mr-2" />
                  Évolution des Demandes
                </CardTitle>
                <CardDescription>Demandes, approbations et rejets sur 12 mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyRequests}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
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
                      dataKey="approved" 
                      stackId="2"
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.3}
                      name="Approuvées"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Répartition par type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 text-purple-600 mr-2" />
                  Répartition par Type
                </CardTitle>
                <CardDescription>Distribution des types de demandes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={requestsByType}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {requestsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Résumé mensuel */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé Mensuel</CardTitle>
              <CardDescription>Principales métriques du mois en cours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">72</div>
                  <div className="text-sm text-gray-600">Nouvelles demandes</div>
                  <div className="text-xs text-green-600 mt-1">+8% vs mois précédent</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">65</div>
                  <div className="text-sm text-gray-600">Demandes approuvées</div>
                  <div className="text-xs text-green-600 mt-1">Taux: 90.3%</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">17.2j</div>
                  <div className="text-sm text-gray-600">Délai moyen traitement</div>
                  <div className="text-xs text-green-600 mt-1">-1.8j vs objectif</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analyse des demandes */}
        <TabsContent value="requests" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Évolution détaillée */}
            <Card>
              <CardHeader>
                <CardTitle>Tendances Détaillées</CardTitle>
                <CardDescription>Évolution mensuelle par statut</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLine data={monthlyRequests}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="requests" stroke="#3B82F6" name="Demandes" />
                    <Line type="monotone" dataKey="approved" stroke="#10B981" name="Approuvées" />
                    <Line type="monotone" dataKey="rejected" stroke="#EF4444" name="Rejetées" />
                  </RechartsLine>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top des motifs de rejet */}
            <Card>
              <CardHeader>
                <CardTitle>Motifs de Rejet</CardTitle>
                <CardDescription>Principales causes de rejet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { motif: 'Documents incomplets', count: 23, percentage: 35 },
                  { motif: 'Non-conformité urbanisme', count: 18, percentage: 27 },
                  { motif: 'Zone non disponible', count: 14, percentage: 21 },
                  { motif: 'Conflit parcellaire', count: 11, percentage: 17 }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{item.motif}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{item.count}</span>
                        <span className="text-xs text-gray-500">({item.percentage}%)</span>
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analyse par zones */}
        <TabsContent value="zones" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demandes par zone */}
            <Card>
              <CardHeader>
                <CardTitle>Demandes par Zone</CardTitle>
                <CardDescription>Répartition géographique des demandes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBar data={requestsByZone.slice(0, 4)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="zone" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="requests" fill="#3B82F6" />
                  </RechartsBar>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Statistiques zones */}
            <Card>
              <CardHeader>
                <CardTitle>Performance par Zone</CardTitle>
                <CardDescription>Taux d'approbation et délais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {requestsByZone.map((zone, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{zone.zone}</span>
                      <Badge variant="secondary">{zone.requests} demandes</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Taux approbation</span>
                        <p className="font-medium text-green-600">
                          {Math.floor(85 + Math.random() * 10)}%
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Délai moyen</span>
                        <p className="font-medium text-blue-600">
                          {Math.floor(15 + Math.random() * 10)}j
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Indicateurs de Performance</CardTitle>
              <CardDescription>Délais de traitement et efficacité par type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {processingTimes.map((item, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{item.type}</span>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600">
                          Actuel: <span className="font-medium">{item.avgDays}j</span>
                        </span>
                        <span className="text-gray-600">
                          Objectif: <span className="font-medium">{item.target}j</span>
                        </span>
                        <Badge className={`${
                          item.efficiency >= 90 ? 'bg-green-100 text-green-800' :
                          item.efficiency >= 80 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.efficiency}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={item.efficiency} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Population */}
        <TabsContent value="population" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Évolution population */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution Population</CardTitle>
                <CardDescription>Croissance démographique trimestrielle</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLine data={populationStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="population" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Population"
                    />
                  </RechartsLine>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Projections */}
            <Card>
              <CardHeader>
                <CardTitle>Projections Démographiques</CardTitle>
                <CardDescription>Estimations basées sur les tendances</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">8,735</div>
                  <div className="text-sm text-gray-600">Population estimée Q1 2025</div>
                  <div className="text-xs text-green-600 mt-1">+1.6% croissance projetée</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Densité actuelle</span>
                    <span className="font-medium">684 hab/km²</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Croissance annuelle</span>
                    <span className="font-medium text-green-600">+2.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Nouveaux logements requis</span>
                    <span className="font-medium text-orange-600">~45/an</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MairieAnalytics;
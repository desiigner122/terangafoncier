import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  LineChart,
  Activity,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  Target,
  Clock,
  Award,
  Zap,
  Filter,
  Download,
  Share,
  RefreshCw,
  Eye,
  Settings,
  ChevronUp,
  ChevronDown,
  Percent,
  Hash,
  Timer
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const GeometreAnalytics = () => {
  const [dateFilter, setDateFilter] = useState('30j');
  const [typeFilter, setTypeFilter] = useState('tous');

  // Données analytiques
  const kpiData = [
    {
      title: 'Revenus Totaux',
      value: '28.5M XOF',
      change: '+12.8%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Missions Complétées',
      value: '247',
      change: '+18.2%',
      trend: 'up', 
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Clients Actifs',
      value: '48',
      change: '+15.4%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Temps Moyen/Mission',
      value: '4.2 jours',
      change: '-8.5%',
      trend: 'down',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  // Données de performance mensuelle
  const monthlyData = [
    { month: 'Jan', missions: 18, revenus: 2.8, satisfaction: 4.5, clients: 12 },
    { month: 'Fév', missions: 22, revenus: 3.2, satisfaction: 4.6, clients: 15 },
    { month: 'Mar', missions: 25, revenus: 3.8, satisfaction: 4.7, clients: 18 },
    { month: 'Avr', missions: 28, revenus: 4.2, satisfaction: 4.8, clients: 22 },
    { month: 'Mai', missions: 24, revenus: 3.9, satisfaction: 4.6, clients: 19 },
    { month: 'Jun', missions: 32, revenus: 5.1, satisfaction: 4.9, clients: 28 },
    { month: 'Jul', missions: 35, revenus: 5.8, satisfaction: 4.8, clients: 31 },
    { month: 'Aoû', missions: 38, revenus: 6.2, satisfaction: 4.9, clients: 35 },
    { month: 'Sep', missions: 25, revenus: 4.5, satisfaction: 4.7, clients: 24 }
  ];

  // Répartition par type de mission
  const missionTypes = [
    { type: 'Topographie', count: 85, percentage: 34.4, revenue: '9.8M XOF', color: 'bg-blue-500' },
    { type: 'Cadastral', count: 52, percentage: 21.1, revenue: '7.2M XOF', color: 'bg-green-500' },
    { type: 'Bornage', count: 48, percentage: 19.4, revenue: '5.9M XOF', color: 'bg-purple-500' },
    { type: 'Plans', count: 35, percentage: 14.2, revenue: '4.1M XOF', color: 'bg-orange-500' },
    { type: 'Mesures', count: 27, percentage: 10.9, revenue: '1.5M XOF', color: 'bg-yellow-500' }
  ];

  // Top clients
  const topClients = [
    { name: 'Société IMMOGO', missions: 12, revenue: '8.5M XOF', satisfaction: 4.9 },
    { name: 'Ministère Industrie', missions: 8, revenue: '15.2M XOF', satisfaction: 4.8 },
    { name: 'Promoteur Sénégal', missions: 7, revenue: '6.8M XOF', satisfaction: 4.7 },
    { name: 'Arch. Mbaye & Associates', missions: 6, revenue: '3.2M XOF', satisfaction: 4.6 },
    { name: 'Coopérative Thiès', missions: 5, revenue: '1.9M XOF', satisfaction: 4.5 }
  ];

  // Zones géographiques
  const geoData = [
    { zone: 'Dakar', missions: 95, percentage: 38.5, revenue: '12.8M XOF' },
    { zone: 'Thiès', missions: 68, percentage: 27.5, revenue: '8.9M XOF' },
    { zone: 'Rufisque', missions: 42, percentage: 17.0, revenue: '4.2M XOF' },
    { zone: 'Kaolack', missions: 25, percentage: 10.1, revenue: '2.1M XOF' },
    { zone: 'Bargny', missions: 17, percentage: 6.9, revenue: '0.5M XOF' }
  ];

  // Tendances temporelles
  const weeklyTrends = [
    { day: 'Lun', missions: 8, efficiency: 85 },
    { day: 'Mar', missions: 12, efficiency: 92 },
    { day: 'Mer', missions: 15, efficiency: 88 },
    { day: 'Jeu', missions: 11, efficiency: 90 },
    { day: 'Ven', missions: 9, efficiency: 87 },
    { day: 'Sam', missions: 4, efficiency: 75 },
    { day: 'Dim', missions: 2, efficiency: 60 }
  ];

  const getTrendIcon = (trend) => {
    return trend === 'up' ? <ChevronUp className="h-4 w-4 text-green-600" /> : <ChevronDown className="h-4 w-4 text-red-600" />;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gray-50 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reporting</h1>
          <p className="text-gray-600 mt-1">Analyse de performance et indicateurs clés</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7j">7 jours</SelectItem>
              <SelectItem value="30j">30 jours</SelectItem>
              <SelectItem value="3m">3 mois</SelectItem>
              <SelectItem value="6m">6 mois</SelectItem>
              <SelectItem value="1a">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                      <Icon className={`h-5 w-5 ${kpi.color}`} />
                    </div>
                    <div className={`flex items-center ${getTrendColor(kpi.trend)}`}>
                      {getTrendIcon(kpi.trend)}
                      <span className="text-sm font-medium ml-1">{kpi.change}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    <p className="text-sm text-gray-600">{kpi.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="geographie">Géographie</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="operationnel">Opérationnel</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance mensuelle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Évolution Mensuelle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Graphique linéaire des performances</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">35</div>
                    <div className="text-xs text-gray-600">Missions/mois</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">6.2M</div>
                    <div className="text-xs text-gray-600">Revenus/mois</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">4.8</div>
                    <div className="text-xs text-gray-600">Satisfaction</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Répartition par type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Répartition par Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {missionTypes.map((type, index) => (
                    <div key={type.type} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${type.color}`}></div>
                        <span className="text-sm font-medium">{type.type}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">{type.count}</div>
                          <div className="text-xs text-gray-600">{type.percentage}%</div>
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${type.color}`}
                            style={{ width: `${type.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-sm font-medium text-gray-900 w-20 text-right">
                          {type.revenue}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Clients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Top Clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topClients.map((client, index) => (
                    <div key={client.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{client.name}</div>
                          <div className="text-xs text-gray-600">{client.missions} missions</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{client.revenue}</div>
                        <div className="flex items-center gap-1">
                          <Award className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs">{client.satisfaction}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Satisfaction Client */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Satisfaction Client
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">4.7</div>
                  <div className="text-sm text-gray-600 mb-4">Note moyenne sur 5</div>
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Award key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = rating === 5 ? 85 : rating === 4 ? 12 : rating === 3 ? 3 : 0;
                    const percentage = (count / 100 * 100);
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-sm w-8">{rating}★</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographie" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Répartition géographique */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Répartition Géographique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {geoData.map((zone, index) => (
                    <div key={zone.zone} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{zone.zone}</span>
                        <div className="text-right">
                          <span className="text-sm font-medium">{zone.missions} missions</span>
                          <div className="text-xs text-gray-600">{zone.revenue}</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${zone.percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600">{zone.percentage}% du total</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Carte géographique */}
            <Card>
              <CardHeader>
                <CardTitle>Carte des Interventions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Carte Interactive
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Visualisation des missions par zone géographique
                    </p>
                    <Button>
                      Ouvrir la Carte
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="finances" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenus par période */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Revenus par Période
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cette semaine</span>
                    <span className="font-medium">1.8M XOF</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ce mois</span>
                    <span className="font-medium">6.2M XOF</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ce trimestre</span>
                    <span className="font-medium">18.9M XOF</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cette année</span>
                    <span className="font-medium">47.3M XOF</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rentabilité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Percent className="h-5 w-5 mr-2" />
                  Rentabilité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-600">68%</div>
                  <div className="text-sm text-gray-600">Marge brute</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Chiffre d'affaires</span>
                    <span className="font-medium">28.5M XOF</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Coûts directs</span>
                    <span className="font-medium text-red-600">9.1M XOF</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium border-t pt-2">
                    <span>Bénéfice brut</span>
                    <span className="text-green-600">19.4M XOF</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Facturations en attente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Facturations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">24.2M XOF</div>
                    <div className="text-sm text-green-700">Facturé</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600">4.3M XOF</div>
                    <div className="text-sm text-yellow-700">En attente</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">0.8M XOF</div>
                    <div className="text-sm text-red-700">En retard</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operationnel" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Efficacité hebdomadaire */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Efficacité Hebdomadaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyTrends.map((day) => (
                    <div key={day.day} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium w-8">{day.day}</span>
                        <span className="text-sm text-gray-600">{day.missions} missions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${day.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12">{day.efficiency}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Temps de traitement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Timer className="h-5 w-5 mr-2" />
                  Temps de Traitement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">4.2</div>
                    <div className="text-sm text-blue-700">Jours/mission</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">92%</div>
                    <div className="text-sm text-green-700">Respect délais</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Topographie</span>
                    <span className="font-medium">3.8 jours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cadastral</span>
                    <span className="font-medium">5.2 jours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Bornage</span>
                    <span className="font-medium">2.5 jours</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Plans</span>
                    <span className="font-medium">6.1 jours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default GeometreAnalytics;
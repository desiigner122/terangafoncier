import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Map, 
  Compass, 
  Ruler, 
  Calculator, 
  FileText, 
  Camera, 
  MapPin, 
  Navigation, 
  Layers, 
  Target, 
  Grid, 
  Mountain, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Award, 
  Clock, 
  Star, 
  Phone, 
  Mail, 
  Calendar, 
  Download, 
  Upload, 
  Settings, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart as RechartsPieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { supabase } from '@/lib/supabase';

const GeometreDashboard = () => {
  const { user, profile } = useAuth();
  
  // États pour les métriques géomètre
  const [geometreMetrics, setGeometreMetrics] = useState({
    activeMissions: 15,           // Missions en cours
    completedSurveys: 89,         // Relevés terminés
    monthlyRevenue: 1250000,      // Revenus mensuels FCFA
    precision: 98.5,              // Précision moyenne (%)
    clientSatisfaction: 94,       // Satisfaction client
    responseTime: 1.8,            // Temps réponse (jours)
    technicalScore: 92,           // Score technique
    certifications: 6,            // Certifications actives
    totalArea: 1247,              // Superficie totale mesurée (hectares)
    avgProjectDuration: 12,       // Durée moyenne projet (jours)
    repeatClients: 68,            // % clients récurrents
    territoryMarketShare: 12.3    // Part de marché territoriale
  });

  // Données pour les graphiques
  const [chartData, setChartData] = useState({
    monthlyProjects: [
      { month: 'Sept', missions: 12, revenus: 980000, precision: 97.8 },
      { month: 'Oct', missions: 15, revenus: 1150000, precision: 98.1 },
      { month: 'Nov', missions: 18, revenus: 1320000, precision: 98.5 },
      { month: 'Déc', missions: 14, revenus: 1050000, precision: 98.3 },
      { month: 'Jan', missions: 16, revenus: 1200000, precision: 98.7 },
      { month: 'Fév', missions: 15, revenus: 1250000, precision: 98.5 }
    ],
    projectTypes: [
      { type: 'Bornage', count: 45, revenue: 2250000, color: '#0088FE' },
      { type: 'Lotissement', count: 12, revenue: 3600000, color: '#00C49F' },
      { type: 'Topographie', count: 18, revenue: 1800000, color: '#FFBB28' },
      { type: 'Cadastre', count: 8, revenue: 2400000, color: '#FF8042' },
      { type: 'Expertise', count: 6, revenue: 1950000, color: '#8884D8' }
    ],
    precisionTrends: [
      { zone: 'Dakar Plateau', precision: 99.1, projets: 24 },
      { zone: 'Almadies', precision: 98.8, projets: 18 },
      { zone: 'Yoff', precision: 98.5, projets: 15 },
      { zone: 'Ouakam', precision: 98.9, projets: 12 },
      { zone: 'Point E', precision: 99.0, projets: 20 }
    ]
  });

  // Missions actives du géomètre
  const [activeMissions, setActiveMissions] = useState([
    {
      id: 'GEO-001',
      type: 'Bornage',
      client: 'M. Amadou Diop',
      location: 'Almadies, Dakar',
      surface: '2.5 hectares',
      status: 'in_progress',
      progress: 75,
      deadline: '2024-03-15',
      priority: 'high',
      revenue: 450000,
      coordinates: { lat: 14.7167, lng: -17.4677 }
    },
    {
      id: 'GEO-002', 
      type: 'Lotissement',
      client: 'Société IMMODA',
      location: 'Diamniadio',
      surface: '15 hectares',
      status: 'planning',
      progress: 25,
      deadline: '2024-04-30',
      priority: 'medium',
      revenue: 2250000,
      coordinates: { lat: 14.7206, lng: -17.1847 }
    },
    {
      id: 'GEO-003',
      type: 'Topographie',
      client: 'Mairie de Rufisque',
      location: 'Centre-ville Rufisque',
      surface: '8.2 hectares',
      status: 'survey',
      progress: 60,
      deadline: '2024-03-25',
      priority: 'high',
      revenue: 820000,
      coordinates: { lat: 14.7167, lng: -17.2667 }
    }
  ]);

  // Équipements techniques
  const [equipments, setEquipments] = useState([
    {
      name: 'Station Totale Leica TS16',
      status: 'operational',
      lastCalibration: '2024-01-15',
      nextMaintenance: '2024-06-15',
      precision: '1mm + 1.5ppm',
      batteryLevel: 85
    },
    {
      name: 'GPS RTK Trimble R10',
      status: 'operational',
      lastCalibration: '2024-02-01',
      nextMaintenance: '2024-07-01',
      precision: '8mm + 1ppm',
      batteryLevel: 92
    },
    {
      name: 'Drone DJI Phantom 4 RTK',
      status: 'maintenance',
      lastCalibration: '2024-01-20',
      nextMaintenance: '2024-04-20',
      precision: '1.5cm + 1ppm',
      batteryLevel: 0
    }
  ]);

  useEffect(() => {
    loadGeometreData();
  }, []);

  const loadGeometreData = async () => {
    try {
      // Charger les données réelles depuis Supabase
      const { data: missions } = await supabase
        .from('geometric_missions')
        .select('*')
        .eq('geometre_id', user?.id)
        .order('created_at', { ascending: false });

      if (missions) {
        // Calculer métriques réelles
        const activeMissionsCount = missions.filter(m => m.status === 'active').length;
        const completedCount = missions.filter(m => m.status === 'completed').length;
        const totalRevenue = missions.reduce((sum, m) => sum + (m.amount || 0), 0);
        
        setGeometreMetrics(prev => ({
          ...prev,
          activeMissions: activeMissionsCount,
          completedSurveys: completedCount,
          monthlyRevenue: totalRevenue
        }));
      }
    } catch (error) {
      console.error('Erreur chargement données géomètre:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'planning': return <Calendar className="w-4 h-4" />;
      case 'survey': return <Compass className="w-4 h-4" />;
      case 'in_progress': return <Target className="w-4 h-4" />;
      case 'review': return <FileText className="w-4 h-4" />;
      case 'completed': return <Award className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      planning: { label: 'Planification', className: 'bg-blue-100 text-blue-800' },
      survey: { label: 'Relevé', className: 'bg-yellow-100 text-yellow-800' },
      in_progress: { label: 'En cours', className: 'bg-orange-100 text-orange-800' },
      review: { label: 'Vérification', className: 'bg-purple-100 text-purple-800' },
      completed: { label: 'Terminé', className: 'bg-green-100 text-green-800' }
    };
    
    const config = statusConfig[status] || statusConfig.planning;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      high: { label: 'Urgent', className: 'bg-red-100 text-red-800' },
      medium: { label: 'Moyen', className: 'bg-yellow-100 text-yellow-800' },
      low: { label: 'Normal', className: 'bg-green-100 text-green-800' }
    };
    
    const config = priorityConfig[priority] || priorityConfig.medium;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getEquipmentStatusBadge = (status) => {
    const statusConfig = {
      operational: { label: 'Opérationnel', className: 'bg-green-100 text-green-800' },
      maintenance: { label: 'Maintenance', className: 'bg-red-100 text-red-800' },
      calibration: { label: 'Étalonnage', className: 'bg-yellow-100 text-yellow-800' }
    };
    
    const config = statusConfig[status] || statusConfig.operational;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Géomètre */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-blue-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white">
                <Compass className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dashboard Géomètre-Expert
                </h1>
                <p className="text-gray-600">
                  Bonjour {profile?.first_name || 'Géomètre'}, gérez vos missions techniques
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter Rapport
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Mission
              </Button>
            </div>
          </div>
        </motion.div>

        {/* KPIs Géomètre */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Missions Actives */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Missions Actives</p>
                    <p className="text-3xl font-bold text-blue-600">{geometreMetrics.activeMissions}</p>
                    <p className="text-xs text-gray-500 mt-1">+3 cette semaine</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Revenus Mensuels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenus Mensuels</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(geometreMetrics.monthlyRevenue)}
                    </p>
                    <p className="text-xs text-green-500 mt-1">+15.3% vs mois dernier</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Précision Moyenne */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Précision Moyenne</p>
                    <p className="text-3xl font-bold text-purple-600">{geometreMetrics.precision}%</p>
                    <p className="text-xs text-purple-500 mt-1">Excellent niveau</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Satisfaction Client */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Satisfaction Client</p>
                    <p className="text-3xl font-bold text-yellow-600">{geometreMetrics.clientSatisfaction}%</p>
                    <p className="text-xs text-yellow-500 mt-1">Très satisfaisant</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Graphiques Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Mensuelle */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance Mensuelle
                </CardTitle>
                <CardDescription>
                  Évolution des missions et revenus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.monthlyProjects}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value, name) => [
                      name === 'missions' ? value : formatCurrency(value),
                      name === 'missions' ? 'Missions' : 'Revenus'
                    ]} />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="missions"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#93c5fd"
                      name="Missions"
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenus"
                      stackId="2"
                      stroke="#10b981"
                      fill="#86efac"
                      name="Revenus"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Répartition Types de Projets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Répartition Projets
                </CardTitle>
                <CardDescription>
                  Types de missions par volume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={chartData.projectTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ type, count }) => `${type}: ${count}`}
                    >
                      {chartData.projectTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, 'Projets']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Missions Actives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5" />
                Missions en Cours
              </CardTitle>
              <CardDescription>
                Suivi détaillé de vos projets actifs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeMissions.map((mission) => (
                  <div
                    key={mission.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getStatusIcon(mission.status)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{mission.type} - {mission.id}</h4>
                          <p className="text-gray-600">{mission.client}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(mission.status)}
                        {getPriorityBadge(mission.priority)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{mission.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Ruler className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">{mission.surface}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Échéance: {mission.deadline}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progression</span>
                        <span className="text-sm text-gray-600">{mission.progress}%</span>
                      </div>
                      <Progress value={mission.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(mission.revenue)}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Camera className="w-4 h-4 mr-2" />
                          Photos
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Rapport
                        </Button>
                        <Button size="sm" className="bg-blue-500 text-white">
                          <Navigation className="w-4 h-4 mr-2" />
                          Localiser
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Équipements et Outils */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Équipements Techniques
              </CardTitle>
              <CardDescription>
                État et maintenance de vos instruments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {equipments.map((equipment, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{equipment.name}</h4>
                      {getEquipmentStatusBadge(equipment.status)}
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Précision:</span>
                        <span className="font-medium">{equipment.precision}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Dernier étalonnage:</span>
                        <span>{equipment.lastCalibration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Prochaine maintenance:</span>
                        <span>{equipment.nextMaintenance}</span>
                      </div>
                    </div>

                    {equipment.status === 'operational' && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Batterie</span>
                          <span className="text-sm font-medium">{equipment.batteryLevel}%</span>
                        </div>
                        <Progress 
                          value={equipment.batteryLevel} 
                          className="h-2"
                        />
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Activity className="w-4 h-4 mr-2" />
                        Diagnostiquer
                      </Button>
                      {equipment.status === 'maintenance' && (
                        <Button size="sm" className="flex-1 bg-red-500 text-white">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Réparer
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistiques Zones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mountain className="w-5 h-5" />
                Analyse par Zones
              </CardTitle>
              <CardDescription>
                Précision et volume par secteur géographique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Zone</th>
                      <th className="text-left py-3 px-4">Précision</th>
                      <th className="text-left py-3 px-4">Projets</th>
                      <th className="text-left py-3 px-4">Performance</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.precisionTrends.map((zone, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{zone.zone}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold">{zone.precision}%</span>
                            {zone.precision > 98.5 ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">{zone.projets}</td>
                        <td className="py-3 px-4">
                          <Progress value={zone.precision} className="h-2 w-20" />
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            <Map className="w-4 h-4 mr-2" />
                            Voir Carte
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default GeometreDashboard;

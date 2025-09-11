/**
 * 📊 DASHBOARD MONITORING IA - TEMPS RÉEL
 * ====================================
 * 
 * Interface d'administration pour monitoring de l'IA
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Activity, 
  Zap, 
  Database, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  BarChart3,
  RefreshCw,
  Settings,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Users,
  DollarSign,
  Target
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AIMonitoringDashboard = () => {
  const [aiMetrics, setAiMetrics] = useState({
    status: 'operational',
    uptime: '99.8%',
    totalRequests: 15847,
    successRate: 98.5,
    averageResponseTime: 245,
    cacheHitRate: 78.3,
    activeUsers: 234,
    estimationsToday: 1247
  });

  const [performanceData, setPerformanceData] = useState([
    { time: '09:00', requests: 45, responseTime: 220, cacheHit: 75 },
    { time: '10:00', requests: 78, responseTime: 235, cacheHit: 80 },
    { time: '11:00', requests: 95, responseTime: 198, cacheHit: 85 },
    { time: '12:00', requests: 120, responseTime: 267, cacheHit: 76 },
    { time: '13:00', requests: 89, responseTime: 245, cacheHit: 82 },
    { time: '14:00', requests: 145, responseTime: 289, cacheHit: 73 },
    { time: '15:00', requests: 167, responseTime: 312, cacheHit: 69 }
  ]);

  const [dashboardUsage, setDashboardUsage] = useState([
    { name: 'Particulier', value: 35, color: '#8884d8' },
    { name: 'Agent', value: 28, color: '#82ca9d' },
    { name: 'Promoteur', value: 15, color: '#ffc658' },
    { name: 'Banque', value: 12, color: '#ff7300' },
    { name: 'Admin', value: 6, color: '#00c49f' },
    { name: 'Vendeur', value: 4, color: '#ffbb28' }
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Cache hit rate below 80%', time: '2 min ago' },
    { id: 2, type: 'info', message: 'New zone data available: Rufisque', time: '15 min ago' },
    { id: 3, type: 'success', message: 'Performance optimization completed', time: '1 hour ago' }
  ]);

  useEffect(() => {
    // Simulation mise à jour temps réel
    const interval = setInterval(() => {
      setAiMetrics(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 5),
        averageResponseTime: 200 + Math.floor(Math.random() * 100),
        estimationsToday: prev.estimationsToday + Math.floor(Math.random() * 3)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'operational': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <AlertCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Monitoring IA Teranga</h1>
              <p className="text-gray-600">Surveillance performance temps réel</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className={`${getStatusColor(aiMetrics.status)} bg-green-100`}>
              {aiMetrics.status.toUpperCase()}
            </Badge>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>

        {/* KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Requêtes Totales</p>
                    <p className="text-2xl font-bold text-gray-900">{aiMetrics.totalRequests.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1">↗ +5.2% vs hier</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taux de Réussite</p>
                    <p className="text-2xl font-bold text-gray-900">{aiMetrics.successRate}%</p>
                    <Progress value={aiMetrics.successRate} className="w-full h-2 mt-2" />
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Temps Réponse</p>
                    <p className="text-2xl font-bold text-gray-900">{aiMetrics.averageResponseTime}ms</p>
                    <p className="text-xs text-gray-500 mt-1">Moyenne dernière heure</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cache Hit Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{aiMetrics.cacheHitRate}%</p>
                    <Progress value={aiMetrics.cacheHitRate} className="w-full h-2 mt-2" />
                  </div>
                  <Database className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Graphiques performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Performance Temps Réel
              </CardTitle>
              <CardDescription>Requêtes et temps de réponse par heure</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="requests" 
                    stackId="1" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Usage par Dashboard
              </CardTitle>
              <CardDescription>Répartition des requêtes IA par type d'utilisateur</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboardUsage}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dashboardUsage.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Métriques avancées */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Utilisateurs Actifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {aiMetrics.activeUsers}
                </div>
                <p className="text-sm text-gray-600">En ligne maintenant</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Particuliers</span>
                    <span className="font-medium">127</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Agents</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Autres</span>
                    <span className="font-medium">18</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="mr-2 h-5 w-5" />
                Estimations Aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {aiMetrics.estimationsToday.toLocaleString()}
                </div>
                <p className="text-sm text-gray-600">Estimations générées</p>
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Valeur totale estimée</p>
                  <p className="text-lg font-semibold">1.2 Mrd FCFA</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cpu className="mr-2 h-5 w-5" />
                Système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CPU Usage</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory</span>
                    <span>62%</span>
                  </div>
                  <Progress value={62} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Uptime</span>
                    <span className="text-green-600">{aiMetrics.uptime}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Alertes & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">IA Teranga - Phase 1 Opérationnelle</h3>
                <p className="text-sm text-gray-600">Monitoring temps réel • Données Sénégal • Performance optimisée</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Système en ligne</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIMonitoringDashboard;

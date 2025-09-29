import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Cloud, 
  Smartphone, 
  Wifi, 
  Database,
  Server,
  Monitor,
  Zap,
  Shield,
  Lock,
  Key,
  Users,
  BarChart3,
  TrendingUp,
  Activity,
  Settings,
  Download,
  Upload,
  Cpu,
  HardDrive,
  Network,
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const AgentFoncierServicesDigitaux = () => {
  const [activeService, setActiveService] = useState('overview');

  // Données des services digitaux
  const servicesStats = {
    cloudStorage: { used: 45.2, total: 100, unit: 'GB' },
    apiCalls: { today: 2847, monthly: 45230 },
    uptime: 99.9,
    activeUsers: 156,
    digitalTransactions: 1284,
    automatedProcesses: 23
  };

  const digitalServices = [
    {
      id: 'cloud-storage',
      name: 'Stockage Cloud',
      description: 'Stockage sécurisé des documents fonciers',
      icon: Cloud,
      color: 'from-blue-500 to-cyan-600',
      status: 'active',
      usage: 78,
      metrics: {
        totalFiles: 15420,
        totalSize: '45.2 GB',
        lastBackup: '2024-03-01 14:30',
        syncStatus: 'Synchronisé'
      }
    },
    {
      id: 'mobile-app',
      name: 'Application Mobile',
      description: 'App mobile pour agents et clients',
      icon: Smartphone,
      color: 'from-green-500 to-emerald-600',
      status: 'active',
      usage: 92,
      metrics: {
        activeUsers: 234,
        dailyLogins: 89,
        appVersion: '2.1.4',
        lastUpdate: '2024-02-28'
      }
    },
    {
      id: 'api-services',
      name: 'Services API',
      description: 'APIs pour intégrations tierces',
      icon: Network,
      color: 'from-purple-500 to-indigo-600',
      status: 'active',
      usage: 65,
      metrics: {
        endpoints: 24,
        requests: '2.8K/jour',
        latency: '120ms',
        errorRate: '0.2%'
      }
    },
    {
      id: 'iot-monitoring',
      name: 'IoT Monitoring',
      description: 'Surveillance des capteurs terrain',
      icon: Wifi,
      color: 'from-orange-500 to-red-600',
      status: 'maintenance',
      usage: 45,
      metrics: {
        sensors: 67,
        dataPoints: '15M/jour',
        batteryLevel: '78%',
        connectivity: '94%'
      }
    },
    {
      id: 'automation',
      name: 'Automatisation',
      description: 'Processus automatisés',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      status: 'active',
      usage: 88,
      metrics: {
        workflows: 23,
        executions: '456/jour',
        successRate: '97.8%',
        timeSaved: '12h/jour'
      }
    },
    {
      id: 'analytics',
      name: 'Analytics Avancé',
      description: 'Intelligence des données',
      icon: BarChart3,
      color: 'from-teal-500 to-cyan-600',
      status: 'active',
      usage: 73,
      metrics: {
        datasets: 145,
        reports: 67,
        predictions: '89% précision',
        insights: 234
      }
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'api',
      message: 'Nouvelle intégration API avec le service cadastre',
      timestamp: '2024-03-01 10:30',
      status: 'success'
    },
    {
      id: 2,
      type: 'mobile',
      message: 'Mise à jour de l\'application mobile v2.1.4',
      timestamp: '2024-02-28 16:45',
      status: 'success'
    },
    {
      id: 3,
      type: 'cloud',
      message: 'Sauvegarde automatique terminée (45.2 GB)',
      timestamp: '2024-03-01 14:30',
      status: 'success'
    },
    {
      id: 4,
      type: 'iot',
      message: 'Maintenance des capteurs IoT programmée',
      timestamp: '2024-03-02 09:00',
      status: 'warning'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 bg-clip-text text-transparent">
            Services Digitaux
          </h1>
          <p className="text-slate-600">Infrastructure et solutions numériques avancées</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-600">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Service
          </Button>
        </div>
      </motion.div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { title: 'Uptime', value: `${servicesStats.uptime}%`, icon: Activity, color: 'from-green-500 to-emerald-600' },
          { title: 'Utilisateurs', value: servicesStats.activeUsers, icon: Users, color: 'from-blue-500 to-cyan-600' },
          { title: 'API Calls', value: `${(servicesStats.apiCalls.today / 1000).toFixed(1)}K`, icon: Network, color: 'from-purple-500 to-indigo-600' },
          { title: 'Stockage', value: `${servicesStats.cloudStorage.used}GB`, icon: HardDrive, color: 'from-orange-500 to-red-600' },
          { title: 'Transactions', value: servicesStats.digitalTransactions, icon: TrendingUp, color: 'from-teal-500 to-cyan-600' },
          { title: 'Processus Auto', value: servicesStats.automatedProcesses, icon: Zap, color: 'from-yellow-500 to-orange-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Services digitaux */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-600" />
              Infrastructure Digitale
            </CardTitle>
            <CardDescription>
              Gestion et monitoring de vos services numériques
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {digitalServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 border rounded-xl hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center`}>
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-slate-900 mb-2">{service.name}</h3>
                  <p className="text-sm text-slate-600 mb-4">{service.description}</p>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Utilisation</span>
                        <span className="font-medium">{service.usage}%</span>
                      </div>
                      <Progress value={service.usage} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {Object.entries(service.metrics).map(([key, value]) => (
                        <div key={key} className="bg-slate-50 p-2 rounded">
                          <p className="text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                          <p className="font-semibold text-slate-900">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm">
                      <Monitor className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activités récentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Activités Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900">{activity.message}</p>
                    <p className="text-xs text-slate-500">{activity.timestamp}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance système */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-green-600" />
              Performance Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'CPU', usage: 45, color: 'bg-blue-500' },
                { name: 'Mémoire', usage: 67, color: 'bg-green-500' },
                { name: 'Disque', usage: 23, color: 'bg-yellow-500' },
                { name: 'Réseau', usage: 78, color: 'bg-purple-500' }
              ].map((metric) => (
                <div key={metric.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{metric.name}</span>
                    <span>{metric.usage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${metric.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${metric.usage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-600" />
              Statut des Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'API Gateway', status: 'operational', uptime: '99.9%' },
                { name: 'Base de données', status: 'operational', uptime: '99.8%' },
                { name: 'Stockage Cloud', status: 'operational', uptime: '100%' },
                { name: 'Services IoT', status: 'maintenance', uptime: '95.2%' },
                { name: 'Analytics', status: 'operational', uptime: '99.7%' }
              ].map((service) => (
                <div key={service.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      service.status === 'operational' ? 'bg-green-500' : 
                      service.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="font-medium text-slate-900">{service.name}</span>
                  </div>
                  <span className="text-sm text-slate-600">{service.uptime}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AgentFoncierServicesDigitaux;
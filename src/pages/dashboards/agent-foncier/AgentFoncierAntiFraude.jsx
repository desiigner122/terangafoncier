import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Bell,
  FileText,
  User,
  Calendar,
  Clock,
  MapPin,
  Camera,
  Fingerprint,
  Scan,
  Target,
  TrendingUp,
  BarChart3,
  Activity,
  Users,
  Database,
  Zap,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Plus,
  ChevronRight,
  Ban,
  Flag
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AgentFoncierAntiFraude = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Alertes réelles (aucune table anti-fraude dédiée — aucune donnée fictive)
  const alertes = [];

  // Statistiques anti-fraude dérivées des données chargées (0 par défaut)
  const fraudeStats = {
    totalAlerts: alertes.length,
    criticalAlerts: alertes.filter(a => a.severity === 'critical').length,
    resolvedCases: alertes.filter(a => a.status === 'resolved').length,
    pendingCases: alertes.filter(a => a.status === 'pending').length,
    fraudePrevented: 0, // en FCFA
    detectionRate: 0,
    falsePositiveRate: 0,
    responseTime: 0 // en minutes
  };

  // Systèmes de détection (aucune donnée fictive)
  const detectionSystems = [];

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'investigating': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'monitoring': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Flag className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Bell className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredAlertes = alertes.filter(alerte => {
    const matchesFilter = activeFilter === 'all' || alerte.severity === activeFilter;
    const matchesSearch = alerte.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alerte.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-white to-red-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-orange-700 to-amber-700 bg-clip-text text-transparent">
            Anti-Fraude
          </h1>
          <p className="text-slate-600">Détection et prévention des fraudes immobilières</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </Button>
          <Button className="bg-gradient-to-r from-red-500 to-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Alerte
          </Button>
        </div>
      </motion.div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            title: 'Alertes Totales', 
            value: fraudeStats.totalAlerts, 
            change: null,
            icon: Bell, 
            color: 'from-blue-500 to-cyan-600' 
          },
          { 
            title: 'Alertes Critiques', 
            value: fraudeStats.criticalAlerts, 
            change: null,
            icon: AlertTriangle, 
            color: 'from-red-500 to-pink-600' 
          },
          { 
            title: 'Cas Résolus', 
            value: fraudeStats.resolvedCases, 
            change: null,
            icon: CheckCircle, 
            color: 'from-green-500 to-emerald-600' 
          },
          { 
            title: 'Taux Détection', 
            value: `${fraudeStats.detectionRate}%`, 
            change: null,
            icon: Target, 
            color: 'from-purple-500 to-indigo-600' 
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Alertes et filtres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Alertes de Sécurité
                </CardTitle>
                <CardDescription>
                  Surveillance en temps réel des activités suspectes
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualiser
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filtres */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher une alerte..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les alertes</SelectItem>
                  <SelectItem value="critical">Critiques</SelectItem>
                  <SelectItem value="high">Élevées</SelectItem>
                  <SelectItem value="medium">Moyennes</SelectItem>
                  <SelectItem value="low">Faibles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Liste des alertes */}
            <div className="space-y-4">
              {filteredAlertes.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-6">Aucune alerte disponible</p>
              )}
              {filteredAlertes.map((alerte, index) => (
                <motion.div
                  key={alerte.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getSeverityIcon(alerte.severity)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-slate-900">{alerte.title}</h3>
                          <Badge className={getSeverityColor(alerte.severity)}>
                            {alerte.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{alerte.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {alerte.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {alerte.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(alerte.status)}>
                        {alerte.status}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-slate-900">
                          Score: {alerte.riskScore}%
                        </div>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${
                              alerte.riskScore >= 80 ? 'bg-red-500' :
                              alerte.riskScore >= 60 ? 'bg-orange-500' :
                              alerte.riskScore >= 40 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${alerte.riskScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Preuves détectées:</p>
                        <div className="flex flex-wrap gap-1">
                          {alerte.evidence.map((evidence, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {evidence}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Systèmes de détection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="w-5 h-5 text-purple-600" />
              Systèmes de Détection
            </CardTitle>
            <CardDescription>
              Technologies IA pour la détection automatique
            </CardDescription>
          </CardHeader>
          <CardContent>
            {detectionSystems.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-6">Aucune donnée disponible</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {detectionSystems.map((system, index) => (
                <motion.div
                  key={system.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg ${
                        system.status === 'active' ? 'bg-green-100' : 'bg-yellow-100'
                      } flex items-center justify-center`}>
                        <system.icon className={`w-5 h-5 ${
                          system.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{system.name}</h3>
                        <p className="text-xs text-slate-600">{system.description}</p>
                      </div>
                    </div>
                    <Badge className={system.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {system.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Précision</span>
                      <span className="font-semibold">{system.accuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${system.accuracy}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Détections: {system.detected}</span>
                      <span>MAJ: {system.lastUpdate}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Métriques de performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Performance Mensuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[].length === 0 && (
                <p className="text-sm text-slate-500 text-center py-6">Aucune donnée disponible</p>
              )}
              {[].map((data, index) => (
                <div key={data.month} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">{data.month}</p>
                    <p className="text-sm text-slate-600">{data.fraud} fraudes détectées</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {(data.prevented / 1000000).toFixed(1)}M FCFA
                    </p>
                    <p className="text-xs text-slate-500">économisés</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Indicateurs Clés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[].length === 0 && (
                <p className="text-sm text-slate-500 text-center py-6">Aucune donnée disponible</p>
              )}
              {[].map((metric, index) => (
                <div key={metric.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{metric.name}</p>
                    <p className="text-lg font-bold text-slate-900">{metric.value}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    metric.trend === 'up' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-blue-600 rotate-180'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AgentFoncierAntiFraude;
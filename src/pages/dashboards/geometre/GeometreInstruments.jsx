import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Plus, 
  Search, 
  Filter,
  Compass,
  Satellite,
  Ruler,
  Camera,
  Zap,
  Battery,
  Wifi,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Wrench,
  Activity,
  BarChart3,
  MapPin,
  Target,
  Navigation,
  Radio,
  Thermometer,
  Gauge,
  Power,
  HardDrive,
  Cpu,
  Monitor,
  Bluetooth,
  Usb
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const GeometreInstruments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('tous');
  const [statusFilter, setStatusFilter] = useState('tous');

  // Données des instruments
  const instruments = []; // données graphiques réelles requises

  const getTypeIcon = (type) => {
    switch (type) {
      case 'station_totale': return Compass;
      case 'gps_rtk': return Satellite;
      case 'niveau': return Ruler;
      case 'drone': return Camera;
      case 'scanner_3d': return Activity;
      case 'telemetre': return Target;
      default: return Settings;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'utilise': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      case 'calibration': return 'bg-yellow-100 text-yellow-800';
      case 'panne': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'disponible': return 'Disponible';
      case 'utilise': return 'En cours d\'utilisation';
      case 'maintenance': return 'En maintenance';
      case 'calibration': return 'En calibration';
      case 'panne': return 'En panne';
      default: return status;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'station_totale': return 'Station Totale';
      case 'gps_rtk': return 'GPS RTK';
      case 'niveau': return 'Niveau Électronique';
      case 'drone': return 'Drone/UAV';
      case 'scanner_3d': return 'Scanner 3D';
      case 'telemetre': return 'Télémètre Laser';
      default: return type;
    }
  };

  const getBatteryColor = (level) => {
    if (level > 70) return 'text-green-600';
    if (level > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredInstruments = instruments.filter(instrument => {
    const matchesSearch = instrument.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instrument.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instrument.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'tous' || instrument.type === typeFilter;
    const matchesStatus = statusFilter === 'tous' || instrument.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Statistiques
  const stats = [
    {
      title: 'Total Instruments',
      value: instruments.length,
      icon: Settings,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Disponibles',
      value: instruments.filter(i => i.status === 'disponible').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'En Maintenance',
      value: instruments.filter(i => i.status === 'maintenance').length,
      icon: Wrench,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Batterie Moyenne',
      value: Math.round(instruments.reduce((acc, i) => acc + i.batteryLevel, 0) / instruments.length) + '%',
      icon: Battery,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Parc d'Instruments</h1>
          <p className="text-gray-600 mt-1">Gestion et maintenance des équipements topographiques</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Wrench className="h-4 w-4 mr-2" />
            Maintenance
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Instrument
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, modèle ou numéro de série..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type d'instrument" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous types</SelectItem>
                <SelectItem value="station_totale">Station Totale</SelectItem>
                <SelectItem value="gps_rtk">GPS RTK</SelectItem>
                <SelectItem value="niveau">Niveau Électronique</SelectItem>
                <SelectItem value="drone">Drone/UAV</SelectItem>
                <SelectItem value="scanner_3d">Scanner 3D</SelectItem>
                <SelectItem value="telemetre">Télémètre Laser</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous statuts</SelectItem>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="utilise">En cours d'utilisation</SelectItem>
                <SelectItem value="maintenance">En maintenance</SelectItem>
                <SelectItem value="calibration">En calibration</SelectItem>
                <SelectItem value="panne">En panne</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Instruments Tabs */}
      <Tabs defaultValue="inventaire" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventaire">Inventaire</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="calibration">Calibration</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="inventaire" className="mt-6">
          <div className="space-y-4">
            {filteredInstruments.map((instrument, index) => {
              const TypeIcon = getTypeIcon(instrument.type);
              
              return (
                <motion.div
                  key={instrument.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <TypeIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {instrument.name}
                              </h3>
                              <Badge variant="outline" className="font-mono text-xs">
                                {instrument.serialNumber}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">Informations</h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <div>Modèle: {instrument.model}</div>
                                  <div>Usage: {instrument.totalUsage}</div>
                                  <div>Assigné à: {instrument.assignedTo}</div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">État</h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Battery className={`h-3 w-3 ${getBatteryColor(instrument.batteryLevel)}`} />
                                    Batterie: {instrument.batteryLevel}%
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3" />
                                    {instrument.location}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-3 w-3" />
                                    Dernière utilisation: {instrument.lastUsed}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">Conditions</h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Thermometer className="h-3 w-3" />
                                    {instrument.temperature}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Gauge className="h-3 w-3" />
                                    {instrument.humidity} humidité
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">Connectivité</h4>
                                <div className="flex flex-wrap gap-1">
                                  {instrument.connectivity.map((conn, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {conn}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Battery Progress */}
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Niveau de batterie</span>
                                <span className={`font-medium ${getBatteryColor(instrument.batteryLevel)}`}>
                                  {instrument.batteryLevel}%
                                </span>
                              </div>
                              <Progress 
                                value={instrument.batteryLevel} 
                                className="h-2"
                              />
                            </div>

                            {/* Features */}
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Caractéristiques</h4>
                              <div className="flex flex-wrap gap-1">
                                {instrument.features.map((feature, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(instrument.status)}>
                              {getStatusText(instrument.status)}
                            </Badge>
                            <Badge variant="outline">
                              {getTypeText(instrument.type)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          Prochaine maintenance: {instrument.nextMaintenance}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Détails
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Wrench className="h-4 w-4 mr-2" />
                            Maintenance
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Activity className="h-4 w-4 mr-2" />
                            Historique
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wrench className="h-5 w-5 mr-2" />
                  Maintenances Planifiées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {instruments
                    .flatMap(i => i.maintenance.filter(m => m.status === 'Planifiée'))
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 5)
                    .map((maintenance, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{maintenance.type}</div>
                          <div className="text-xs text-gray-600">{maintenance.date}</div>
                        </div>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          {maintenance.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Maintenances en Cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {instruments
                    .flatMap(i => i.maintenance.filter(m => m.status === 'En cours'))
                    .map((maintenance, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{maintenance.type}</div>
                          <div className="text-xs text-gray-600">{maintenance.date}</div>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {maintenance.status}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calibration" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendrier de Calibration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {instruments
                    .sort((a, b) => new Date(a.nextMaintenance) - new Date(b.nextMaintenance))
                    .map((instrument) => (
                      <div key={instrument.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded">
                            {React.createElement(getTypeIcon(instrument.type), { className: "h-4 w-4 text-blue-600" })}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{instrument.name}</div>
                            <div className="text-xs text-gray-600">
                              Dernière: {instrument.lastCalibration}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{instrument.nextMaintenance}</div>
                          <Badge variant="outline" className="text-xs">
                            Calibration
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificats de Calibration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Gestion des Certificats
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Suivi des certificats de calibration et conformité
                  </p>
                  <Button>
                    Voir les Certificats
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Utilisation par Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['station_totale', 'gps_rtk', 'niveau', 'drone', 'scanner_3d', 'telemetre'].map((type) => {
                    const count = instruments.filter(i => i.type === type).length;
                    const percentage = (count / instruments.length * 100).toFixed(1);
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm">{getTypeText(type)}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium w-12">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>État du Parc</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">67%</div>
                    <div className="text-sm text-green-700">Disponibles</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">17%</div>
                    <div className="text-sm text-blue-700">En cours</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">16%</div>
                    <div className="text-sm text-red-700">Maintenance</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">72%</div>
                    <div className="text-sm text-purple-700">Batterie Moy.</div>
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

export default GeometreInstruments;
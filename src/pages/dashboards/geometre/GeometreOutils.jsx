import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Ruler, 
  MapPin, 
  Navigation, 
  Compass, 
  Calculator, 
  Map, 
  Satellite,
  Target,
  Layers,
  Zap,
  Download,
  Upload,
  Search,
  Filter,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings
} from 'lucide-react';

const GeometreOutils = () => {
  const [activeTab, setActiveTab] = useState('gps');
  const [selectedTool, setSelectedTool] = useState(null);

  // Outils GPS/GNSS
  const gpsTools = [
    {
      id: 'rtk-positioning',
      name: 'Positionnement RTK',
      description: 'Positionnement centimétrique en temps réel',
      status: 'active',
      accuracy: '2cm',
      lastUpdate: '15:30',
      satellites: 18,
      quality: 'Excellent'
    },
    {
      id: 'coordinate-converter',
      name: 'Convertisseur Coordonnées',
      description: 'Conversion entre systèmes de coordonnées',
      status: 'ready',
      fromSystem: 'WGS84',
      toSystem: 'UTM Zone 28N',
      lastConversion: 'Dakar - Almadies'
    },
    {
      id: 'datum-transform',
      name: 'Transformation Datum',
      description: 'Transformation entre différents datums',
      status: 'ready',
      accuracy: '1m',
      supportedDatums: ['WGS84', 'Clarke 1880', 'Airy 1830']
    }
  ];

  // Outils de mesure
  const measurementTools = [
    {
      id: 'distance-calculator',
      name: 'Calcul de Distance',
      description: 'Calcul de distances et azimuts',
      status: 'active',
      lastMeasurement: '1,247.65m',
      precision: '±5mm',
      type: 'Horizontale'
    },
    {
      id: 'area-calculator',
      name: 'Calcul de Surface',
      description: 'Calcul de superficies polygonales',
      status: 'ready',
      lastArea: '2,150.43m²',
      precision: '±0.1m²',
      method: 'Coordonnées'
    },
    {
      id: 'elevation-tool',
      name: 'Outils d\'Altitude',
      description: 'Gestion des altitudes et dénivelés',
      status: 'ready',
      altitudeSystem: 'NGF',
      precision: '±2cm',
      lastElevation: '45.67m'
    }
  ];

  // Outils SIG
  const sigTools = [
    {
      id: 'layer-manager',
      name: 'Gestionnaire de Couches',
      description: 'Gestion des couches cartographiques',
      status: 'active',
      activeLayers: 8,
      totalLayers: 15,
      lastUpdate: '14:45'
    },
    {
      id: 'spatial-analysis',
      name: 'Analyse Spatiale',
      description: 'Outils d\'analyse géospatiale',
      status: 'ready',
      analysisType: 'Buffer',
      lastAnalysis: 'Zone influence 500m',
      processingTime: '2.3s'
    },
    {
      id: 'map-export',
      name: 'Export Cartographique',
      description: 'Export de cartes et plans',
      status: 'ready',
      formats: ['PDF', 'DWG', 'PNG'],
      lastExport: 'Plan cadastral - Lot 15',
      resolution: '300 DPI'
    }
  ];

  // Statistiques d'utilisation
  const toolStats = {
    totalMeasurements: 1247,
    averageAccuracy: '3.2cm',
    activeTools: 12,
    weeklyUsage: 89,
    savedProjects: 45
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Zap className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'maintenance': return <Clock className="w-4 h-4" />;
      case 'offline': return <AlertTriangle className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Outils & Instruments</h1>
            <p className="text-gray-600">Vos outils de mesure et cartographie</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              <Zap className="w-3 h-3 mr-1" />
              {toolStats.activeTools} outils actifs
            </Badge>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mesures Totales</p>
                  <p className="text-2xl font-bold text-gray-900">{toolStats.totalMeasurements}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Ruler className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Précision Moyenne</p>
                  <p className="text-2xl font-bold text-gray-900">{toolStats.averageAccuracy}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usage Hebdomadaire</p>
                  <p className="text-2xl font-bold text-gray-900">{toolStats.weeklyUsage}h</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Projets Sauvés</p>
                  <p className="text-2xl font-bold text-gray-900">{toolStats.savedProjects}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Layers className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gps" className="flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              GPS/GNSS
            </TabsTrigger>
            <TabsTrigger value="measurement" className="flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Mesures
            </TabsTrigger>
            <TabsTrigger value="sig" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              SIG
            </TabsTrigger>
          </TabsList>

          {/* Outils GPS */}
          <TabsContent value="gps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Outils GPS/GNSS</CardTitle>
                <CardDescription>
                  Outils de positionnement et navigation satellite
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gpsTools.map((tool) => (
                    <motion.div
                      key={tool.id}
                      whileHover={{ scale: 1.02 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setSelectedTool(tool)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Navigation className="w-5 h-5 text-blue-600" />
                        </div>
                        <Badge className={getStatusColor(tool.status)}>
                          {getStatusIcon(tool.status)}
                          <span className="ml-1 capitalize">{tool.status}</span>
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{tool.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                      
                      <div className="space-y-2 text-xs">
                        {tool.accuracy && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Précision:</span>
                            <span className="font-medium">{tool.accuracy}</span>
                          </div>
                        )}
                        {tool.satellites && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Satellites:</span>
                            <span className="font-medium">{tool.satellites}</span>
                          </div>
                        )}
                        {tool.quality && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Qualité:</span>
                            <span className="font-medium text-green-600">{tool.quality}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button size="sm" className="w-full mt-4">
                        Utiliser
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Outils de mesure */}
          <TabsContent value="measurement" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Outils de Mesure</CardTitle>
                <CardDescription>
                  Calculateurs de distance, surface et altitude
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {measurementTools.map((tool) => (
                    <motion.div
                      key={tool.id}
                      whileHover={{ scale: 1.02 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Ruler className="w-5 h-5 text-green-600" />
                        </div>
                        <Badge className={getStatusColor(tool.status)}>
                          {getStatusIcon(tool.status)}
                          <span className="ml-1 capitalize">{tool.status}</span>
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{tool.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                      
                      <div className="space-y-2 text-xs">
                        {tool.lastMeasurement && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Dernière mesure:</span>
                            <span className="font-medium">{tool.lastMeasurement}</span>
                          </div>
                        )}
                        {tool.lastArea && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Dernière surface:</span>
                            <span className="font-medium">{tool.lastArea}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-500">Précision:</span>
                          <span className="font-medium text-blue-600">{tool.precision}</span>
                        </div>
                      </div>
                      
                      <Button size="sm" className="w-full mt-4">
                        Utiliser
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Outils SIG */}
          <TabsContent value="sig" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Outils SIG</CardTitle>
                <CardDescription>
                  Système d'Information Géographique et cartographie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sigTools.map((tool) => (
                    <motion.div
                      key={tool.id}
                      whileHover={{ scale: 1.02 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Map className="w-5 h-5 text-purple-600" />
                        </div>
                        <Badge className={getStatusColor(tool.status)}>
                          {getStatusIcon(tool.status)}
                          <span className="ml-1 capitalize">{tool.status}</span>
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{tool.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                      
                      <div className="space-y-2 text-xs">
                        {tool.activeLayers && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Couches actives:</span>
                            <span className="font-medium">{tool.activeLayers}/{tool.totalLayers}</span>
                          </div>
                        )}
                        {tool.lastAnalysis && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Dernière analyse:</span>
                            <span className="font-medium">{tool.lastAnalysis}</span>
                          </div>
                        )}
                        {tool.formats && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Formats:</span>
                            <span className="font-medium">{tool.formats.join(', ')}</span>
                          </div>
                        )}
                      </div>
                      
                      <Button size="sm" className="w-full mt-4">
                        Utiliser
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex flex-col">
                <Upload className="w-5 h-5 mb-1" />
                <span className="text-sm">Import Données</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <Download className="w-5 h-5 mb-1" />
                <span className="text-sm">Export Résultats</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <Settings className="w-5 h-5 mb-1" />
                <span className="text-sm">Calibrer GPS</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <Satellite className="w-5 h-5 mb-1" />
                <span className="text-sm">État Satellites</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeometreOutils;
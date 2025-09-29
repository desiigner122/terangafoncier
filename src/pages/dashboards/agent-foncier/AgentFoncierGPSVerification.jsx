import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  Satellite,
  Compass,
  Target,
  Map,
  Layers,
  Ruler,
  Camera,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Plus,
  Eye,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Route,
  Flag,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  Activity,
  TrendingUp,
  BarChart3,
  Globe,
  Wifi,
  Signal,
  Battery,
  Smartphone
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const AgentFoncierGPSVerification = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Statistiques GPS
  const gpsStats = {
    totalProperties: 2456,
    verifiedProperties: 2234,
    pendingVerification: 156,
    gpsAccuracy: 98.2,
    lastUpdate: '2024-03-01 15:30',
    activeSurveys: 23,
    completedSurveys: 145,
    averageAccuracy: 2.3 // en mètres
  };

  // Propriétés avec coordonnées GPS
  const properties = [
    {
      id: 1,
      reference: 'TF-2024-001',
      owner: 'Amadou Diallo',
      location: 'Dakar, Parcelles Assainies',
      coordinates: {
        lat: 14.7644,
        lng: -17.3844,
        accuracy: 1.2,
        elevation: 45
      },
      status: 'verified',
      surveyDate: '2024-02-28',
      area: 450, // m²
      boundaries: 'confirmed',
      conflicts: [],
      photos: 8,
      documents: ['Plan cadastral', 'Titre foncier', 'Photos terrain']
    },
    {
      id: 2,
      reference: 'TF-2024-002',
      owner: 'Fatou Seck',
      location: 'Thiès, Cité Malick Sy',
      coordinates: {
        lat: 14.7889,
        lng: -16.9317,
        accuracy: 3.5,
        elevation: 78
      },
      status: 'pending',
      surveyDate: '2024-03-01',
      area: 320,
      boundaries: 'disputed',
      conflicts: ['Chevauchement parcelle voisine'],
      photos: 12,
      documents: ['Plan provisoire', 'Demande titre']
    },
    {
      id: 3,
      reference: 'TF-2024-003',
      owner: 'Ousmane Ba',
      location: 'Saint-Louis, Sor',
      coordinates: {
        lat: 16.0378,
        lng: -16.4890,
        accuracy: 0.8,
        elevation: 12
      },
      status: 'verified',
      surveyDate: '2024-02-25',
      area: 678,
      boundaries: 'confirmed',
      conflicts: [],
      photos: 15,
      documents: ['Titre définitif', 'Levé topographique', 'Photos drone']
    },
    {
      id: 4,
      reference: 'TF-2024-004',
      owner: 'Awa Thiam',
      location: 'Kaolack, Médina',
      coordinates: {
        lat: 14.1592,
        lng: -16.0731,
        accuracy: 4.2,
        elevation: 23
      },
      status: 'investigating',
      surveyDate: '2024-03-01',
      area: 256,
      boundaries: 'unclear',
      conflicts: ['Coordonnées incohérentes', 'Limites floues'],
      photos: 6,
      documents: ['Plan ancien', 'Récépissé']
    },
    {
      id: 5,
      reference: 'TF-2024-005',
      owner: 'Mamadou Fall',
      location: 'Ziguinchor, Boucotte',
      coordinates: {
        lat: 12.5681,
        lng: -16.2733,
        accuracy: 2.1,
        elevation: 8
      },
      status: 'verified',
      surveyDate: '2024-02-20',
      area: 534,
      boundaries: 'confirmed',
      conflicts: [],
      photos: 10,
      documents: ['Titre foncier', 'Plan géomètre', 'Certificat GPS']
    }
  ];

  // Équipements GPS
  const gpsEquipment = [
    {
      id: 1,
      name: 'GPS Trimble R12',
      type: 'RTK',
      operator: 'Agent Samba',
      status: 'active',
      accuracy: '±2cm',
      battery: 87,
      lastCalibration: '2024-02-15',
      surveysToday: 5
    },
    {
      id: 2,
      name: 'GPS Leica GS18',
      type: 'GNSS',
      operator: 'Agent Ndiaye',
      status: 'active',
      accuracy: '±1cm',
      battery: 94,
      lastCalibration: '2024-02-10',
      surveysToday: 8
    },
    {
      id: 3,
      name: 'Drone DJI P4 RTK',
      type: 'Aerial',
      operator: 'Agent Diop',
      status: 'maintenance',
      accuracy: '±3cm',
      battery: 0,
      lastCalibration: '2024-01-20',
      surveysToday: 0
    },
    {
      id: 4,
      name: 'Smartphone Galaxy S23',
      type: 'Mobile',
      operator: 'Agent Cissé',
      status: 'active',
      accuracy: '±3m',
      battery: 76,
      lastCalibration: '2024-02-28',
      surveysToday: 3
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'investigating': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy <= 1) return 'text-green-600';
    if (accuracy <= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredProperties = properties.filter(property =>
    property.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-white to-green-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 via-blue-700 to-purple-700 bg-clip-text text-transparent">
            Vérification GPS
          </h1>
          <p className="text-slate-600">Géolocalisation et arpentage des propriétés foncières</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </Button>
          <Button className="bg-gradient-to-r from-green-500 to-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Relevé
          </Button>
        </div>
      </motion.div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            title: 'Propriétés Total', 
            value: gpsStats.totalProperties, 
            icon: MapPin, 
            color: 'from-blue-500 to-cyan-600',
            change: '+45'
          },
          { 
            title: 'Vérifiées', 
            value: gpsStats.verifiedProperties, 
            icon: CheckCircle, 
            color: 'from-green-500 to-emerald-600',
            change: '+12'
          },
          { 
            title: 'Précision GPS', 
            value: `${gpsStats.gpsAccuracy}%`, 
            icon: Target, 
            color: 'from-purple-500 to-indigo-600',
            change: '+0.3%'
          },
          { 
            title: 'Relevés Actifs', 
            value: gpsStats.activeSurveys, 
            icon: Activity, 
            color: 'from-orange-500 to-red-600',
            change: '+8'
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

      {/* Carte et propriétés */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Vue carte simulée */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5 text-green-600" />
                Carte Interactive
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Layers className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Crosshair className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg relative overflow-hidden">
              {/* Simulation d'une carte */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-green-200 via-blue-200 to-purple-200"></div>
              </div>
              
              {/* Points GPS simulés */}
              {properties.slice(0, 5).map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className={`absolute w-4 h-4 rounded-full cursor-pointer transform -translate-x-2 -translate-y-2 ${
                    property.status === 'verified' ? 'bg-green-500' :
                    property.status === 'pending' ? 'bg-yellow-500' :
                    'bg-red-500'
                  } shadow-lg hover:scale-125 transition-transform`}
                  style={{
                    left: `${20 + index * 15}%`,
                    top: `${30 + (index % 2) * 20}%`
                  }}
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-slate-700 opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                    {property.reference}
                  </div>
                </motion.div>
              ))}

              {/* Légende */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Vérifié</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>En attente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Enquête</span>
                </div>
              </div>

              {/* Coordonnées */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
                <div>Lat: 14.7644°N</div>
                <div>Lng: 17.3844°W</div>
                <div>Zoom: 12</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Détails propriété sélectionnée */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              {selectedProperty ? 'Détails Propriété' : 'Sélectionner une Propriété'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedProperty ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedProperty.reference}</h3>
                  <p className="text-slate-600">{selectedProperty.owner}</p>
                  <p className="text-sm text-slate-500">{selectedProperty.location}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Statut</span>
                    <Badge className={getStatusColor(selectedProperty.status)}>
                      {selectedProperty.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Superficie</span>
                    <span className="font-semibold">{selectedProperty.area} m²</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Précision GPS</span>
                    <span className={`font-semibold ${getAccuracyColor(selectedProperty.coordinates.accuracy)}`}>
                      ±{selectedProperty.coordinates.accuracy}m
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Altitude</span>
                    <span className="font-semibold">{selectedProperty.coordinates.elevation}m</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-2">Coordonnées</p>
                  <div className="bg-slate-50 p-2 rounded text-xs font-mono">
                    <div>Lat: {selectedProperty.coordinates.lat}°</div>
                    <div>Lng: {selectedProperty.coordinates.lng}°</div>
                  </div>
                </div>

                {selectedProperty.conflicts.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Conflits</p>
                    <div className="space-y-1">
                      {selectedProperty.conflicts.map((conflict, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs text-red-600 border-red-200">
                          {conflict}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Camera className="w-4 h-4 mr-1" />
                    Photos ({selectedProperty.photos})
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Navigation className="w-4 h-4 mr-1" />
                    Naviguer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Cliquez sur un point de la carte pour voir les détails</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Liste des propriétés */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="w-5 h-5 text-purple-600" />
                  Propriétés Géolocalisées
                </CardTitle>
                <CardDescription>
                  Gestion des coordonnées GPS des propriétés foncières
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
            {/* Barre de recherche */}
            <div className="mb-6">
              <Input
                placeholder="Rechercher par référence, propriétaire ou localisation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Tableau des propriétés */}
            <div className="space-y-3">
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-all duration-300"
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(property.status)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{property.reference}</h3>
                        <p className="text-sm text-slate-600">{property.owner}</p>
                        <p className="text-xs text-slate-500">{property.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-xs text-slate-500">Superficie</p>
                        <p className="font-semibold">{property.area}m²</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500">Précision</p>
                        <p className={`font-semibold ${getAccuracyColor(property.coordinates.accuracy)}`}>
                          ±{property.coordinates.accuracy}m
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500">Photos</p>
                        <p className="font-semibold">{property.photos}</p>
                      </div>
                      <Badge className={getStatusColor(property.status)}>
                        {property.status}
                      </Badge>
                    </div>
                  </div>

                  {property.conflicts.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600">
                          {property.conflicts.length} conflit(s) détecté(s)
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Équipements GPS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              Équipements GPS
            </CardTitle>
            <CardDescription>
              Statut et performance des appareils de géolocalisation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {gpsEquipment.map((equipment, index) => (
                <motion.div
                  key={equipment.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg ${
                      equipment.status === 'active' ? 'bg-green-100' : 'bg-orange-100'
                    } flex items-center justify-center`}>
                      {equipment.type === 'Mobile' ? (
                        <Smartphone className={`w-5 h-5 ${
                          equipment.status === 'active' ? 'text-green-600' : 'text-orange-600'
                        }`} />
                      ) : (
                        <Navigation className={`w-5 h-5 ${
                          equipment.status === 'active' ? 'text-green-600' : 'text-orange-600'
                        }`} />
                      )}
                    </div>
                    <Badge className={getStatusColor(equipment.status)}>
                      {equipment.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">{equipment.name}</h3>
                    <p className="text-xs text-slate-600">{equipment.operator}</p>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Précision</span>
                        <span className="font-semibold">{equipment.accuracy}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Batterie</span>
                        <span className="font-semibold">{equipment.battery}%</span>
                      </div>
                      <Progress value={equipment.battery} className="h-1" />
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Relevés aujourd'hui</span>
                        <span className="font-semibold">{equipment.surveysToday}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AgentFoncierGPSVerification;
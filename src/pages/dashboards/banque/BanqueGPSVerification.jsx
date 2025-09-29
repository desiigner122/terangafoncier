import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Satellite, 
  Navigation, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  Filter, 
  Map,
  Zap,
  Activity,
  Clock,
  Flag,
  Camera,
  Layers,
  Crosshair,
  Compass,
  RotateCcw,
  Download,
  Share2,
  Eye,
  Settings,
  RefreshCw,
  Globe,
  Ruler,
  Triangle,
  Building2,
  Home,
  DollarSign,
  Calculator,
  Shield,
  Award,
  Banknote
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const BanqueGPSVerification = ({ dashboardStats }) => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [mapView, setMapView] = useState('satellite');
  const [filterStatus, setFilterStatus] = useState('all');

  // Statistiques GPS bancaires
  const [gpsStats, setGpsStats] = useState({
    totalVerifications: 1467,
    successfulVerifications: 1389,
    conflictsDetected: 23,
    pendingVerifications: 55,
    accuracyRate: 98.8,
    averageProcessingTime: 1.8 // minutes
  });

  // Données des propriétés à vérifier (garanties bancaires)
  const [properties, setProperties] = useState([
    {
      id: 1,
      reference: 'GAR-001-2024',
      owner: 'M. Amadou Diallo',
      address: 'Villa Almadies, Parcelle VDN 47',
      coordinates: {
        latitude: 14.7167,
        longitude: -17.4677,
        precision: 1.2 // mètres
      },
      status: 'verified',
      area: 450, // m²
      lastVerified: '2024-01-20',
      conflicts: [],
      riskLevel: 'low',
      satelliteImageDate: '2024-01-15',
      creditAmount: 25000000,
      propertyValue: 45000000,
      mortgageRatio: 55.6, // %
      propertyType: 'Villa'
    },
    {
      id: 2,
      reference: 'GAR-002-2024',
      owner: 'Société Immobilière Sénégal',
      address: 'Complexe Commercial Diamniadio, Lot 12-15',
      coordinates: {
        latitude: 14.7200,
        longitude: -17.4700,
        precision: 2.1
      },
      status: 'conflict_detected',
      area: 2450,
      lastVerified: '2024-01-19',
      conflicts: ['Limite contestée', 'Construction non autorisée'],
      riskLevel: 'high',
      satelliteImageDate: '2024-01-10',
      creditAmount: 150000000,
      propertyValue: 285000000,
      mortgageRatio: 52.6,
      propertyType: 'Commercial'
    },
    {
      id: 3,
      reference: 'GAR-003-2024',
      owner: 'Coopérative Habitat Solidaire',
      address: 'Zone Habitat Social Rufisque, Bloc A-23',
      coordinates: {
        latitude: 14.7100,
        longitude: -17.4750,
        precision: 1.8
      },
      status: 'pending',
      area: 1200,
      lastVerified: null,
      conflicts: [],
      riskLevel: 'medium',
      satelliteImageDate: '2024-01-18',
      creditAmount: 75000000,
      propertyValue: 135000000,
      mortgageRatio: 55.6,
      propertyType: 'Collectif'
    },
    {
      id: 4,
      reference: 'GAR-004-2024',
      owner: 'Mme Fatou Mbaye',
      address: 'Appartement Parcelles Assainies, U15-89',
      coordinates: {
        latitude: 14.7180,
        longitude: -17.4650,
        precision: 1.5
      },
      status: 'verified',
      area: 85,
      lastVerified: '2024-01-20',
      conflicts: [],
      riskLevel: 'low',
      satelliteImageDate: '2024-01-16',
      creditAmount: 12000000,
      propertyValue: 22000000,
      mortgageRatio: 54.5,
      propertyType: 'Appartement'
    }
  ]);

  // Simulation de vérification GPS
  const handleGPSVerification = async (property) => {
    setSelectedProperty(property);
    setVerificationInProgress(true);
    
    // Simulation du processus de vérification bancaire
    setTimeout(() => {
      const hasConflict = Math.random() > 0.85;
      const updatedProperties = properties.map(p => 
        p.id === property.id 
          ? {
              ...p,
              status: hasConflict ? 'conflict_detected' : 'verified',
              lastVerified: new Date().toISOString().split('T')[0],
              conflicts: hasConflict ? ['Nouveau conflit géographique détecté'] : [],
              riskLevel: hasConflict ? 'high' : 'low'
            }
          : p
      );
      setProperties(updatedProperties);
      setVerificationInProgress(false);
    }, 4000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'conflict_detected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPropertyTypeIcon = (type) => {
    switch (type) {
      case 'Villa': return Home;
      case 'Commercial': return Building2;
      case 'Collectif': return Building2;
      case 'Appartement': return Home;
      default: return Home;
    }
  };

  const filteredProperties = properties.filter(property => {
    return filterStatus === 'all' || property.status === filterStatus;
  });

  const PropertyGPSCard = ({ property, onVerify }) => {
    const PropertyIcon = getPropertyTypeIcon(property.propertyType);
    
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
      >
        <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <PropertyIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {property.reference}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2 mt-1">
                    <Badge className={`text-xs ${getStatusColor(property.status)}`}>
                      {property.status === 'verified' ? 'Vérifié' :
                       property.status === 'conflict_detected' ? 'Conflit' : 'En attente'}
                    </Badge>
                    <Badge className={`text-xs bg-gray-100 ${getRiskColor(property.riskLevel)}`}>
                      Risque: {property.riskLevel}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {property.area} m²
                </div>
                <div className="text-xs text-gray-600">
                  ±{property.coordinates.precision}m
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{property.owner}</p>
                <p className="text-gray-600">{property.address}</p>
                <p className="text-blue-600 font-medium">{property.propertyType}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Lat:</span>
                  <span className="ml-1 font-mono text-xs">{property.coordinates.latitude.toFixed(4)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Lng:</span>
                  <span className="ml-1 font-mono text-xs">{property.coordinates.longitude.toFixed(4)}</span>
                </div>
              </div>

              <div className="pt-2 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Crédit:</span>
                  <span className="font-semibold text-blue-600">
                    {(property.creditAmount / 1000000).toFixed(1)}M CFA
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Valeur bien:</span>
                  <span className="font-semibold text-green-600">
                    {(property.propertyValue / 1000000).toFixed(1)}M CFA
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Ratio LTV:</span>
                  <span className="font-semibold text-purple-600">
                    {property.mortgageRatio.toFixed(1)}%
                  </span>
                </div>
              </div>

              {property.conflicts.length > 0 && (
                <div className="pt-2 border-t">
                  <p className="text-xs font-medium text-red-600 mb-1">Conflits détectés:</p>
                  {property.conflicts.map((conflict, index) => (
                    <div key={index} className="flex items-center space-x-1 text-xs text-red-600">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{conflict}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500">
                  {property.lastVerified ? 
                    `Vérifié le ${new Date(property.lastVerified).toLocaleDateString('fr-FR')}` :
                    'Jamais vérifié'
                  }
                </span>
                <Button 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onVerify(property);
                  }}
                  disabled={verificationInProgress}
                >
                  <Target className="h-4 w-4 mr-1" />
                  Vérifier
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header avec statistiques GPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Garanties Vérifiées</p>
                  <p className="text-2xl font-bold text-green-900">{gpsStats.successfulVerifications}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Conflits Détectés</p>
                  <p className="text-2xl font-bold text-red-900">{gpsStats.conflictsDetected}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Précision GPS</p>
                  <p className="text-2xl font-bold text-blue-900">{gpsStats.accuracyRate}%</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">En Attente</p>
                  <p className="text-2xl font-bold text-yellow-900">{gpsStats.pendingVerifications}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Interface principale de vérification GPS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Satellite className="h-5 w-5 text-blue-600" />
            <span>Vérification GPS des Garanties Bancaires</span>
          </CardTitle>
          <CardDescription>
            Validation géographique des biens immobiliers servant de garanties pour crédits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="verification">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="verification">Vérification</TabsTrigger>
              <TabsTrigger value="mapping">Cartographie</TabsTrigger>
              <TabsTrigger value="valuation">Évaluation</TabsTrigger>
              <TabsTrigger value="reports">Rapports</TabsTrigger>
            </TabsList>

            {/* Vérification GPS */}
            <TabsContent value="verification" className="space-y-6">
              {/* Filtres */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher une garantie..."
                    className="pl-10"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('all')}
                    size="sm"
                  >
                    Toutes
                  </Button>
                  <Button
                    variant={filterStatus === 'verified' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('verified')}
                    size="sm"
                  >
                    Vérifiées
                  </Button>
                  <Button
                    variant={filterStatus === 'conflict_detected' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('conflict_detected')}
                    size="sm"
                  >
                    Conflits
                  </Button>
                  <Button
                    variant={filterStatus === 'pending' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('pending')}
                    size="sm"
                  >
                    En attente
                  </Button>
                </div>
              </div>

              {/* Liste des garanties */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                layout
              >
                {filteredProperties.map((property) => (
                  <PropertyGPSCard
                    key={property.id}
                    property={property}
                    onVerify={handleGPSVerification}
                  />
                ))}
              </motion.div>

              {/* Interface de vérification en cours */}
              {verificationInProgress && selectedProperty && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                  <Card className="w-full max-w-lg m-4">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="h-5 w-5 text-blue-600" />
                        <span>Vérification GPS Garantie</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="inline-block"
                        >
                          <Satellite className="h-12 w-12 text-blue-600 mb-4" />
                        </motion.div>
                        <h3 className="text-lg font-semibold mb-2">
                          Analyse GPS: {selectedProperty.reference}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Vérification garantie bancaire et détection conflits...
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Validation coordonnées GPS</span>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Analyse imagerie satellite</span>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <RefreshCw className="h-4 w-4 text-blue-600" />
                          </motion.div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Évaluation valeur garantie</span>
                          <Clock className="h-4 w-4 text-yellow-600" />
                        </div>
                      </div>

                      <Progress value={80} className="mt-4" />
                      <p className="text-center text-sm text-gray-600">80% complété</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>

            {/* Cartographie */}
            <TabsContent value="mapping" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Map className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Vue Cadastrale</h3>
                    <p className="text-sm text-gray-600">Plan cadastral avec limites officielles</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Satellite className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Vue Satellite</h3>
                    <p className="text-sm text-gray-600">Imagerie satellite haute résolution</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Layers className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Analyse Superposée</h3>
                    <p className="text-sm text-gray-600">Cadastre + satellite + GPS</p>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Globe className="h-4 w-4" />
                <AlertTitle>Système GPS Bancaire</AlertTitle>
                <AlertDescription>
                  Validation géographique précise des garanties immobilières avec imagerie satellite 
                  pour sécuriser les crédits et évaluer les risques géographiques.
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* Évaluation */}
            <TabsContent value="valuation" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-green-700">Valeur Totale Garanties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-900 mb-2">
                      {(properties.reduce((sum, p) => sum + p.propertyValue, 0) / 1000000000).toFixed(1)}Md CFA
                    </div>
                    <p className="text-green-600">Portfolio total garanties</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-blue-700">Ratio LTV Moyen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-900 mb-2">
                      {(properties.reduce((sum, p) => sum + p.mortgageRatio, 0) / properties.length).toFixed(1)}%
                    </div>
                    <p className="text-blue-600">Loan-to-Value moyen</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {properties.map((property) => (
                  <Card key={property.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{property.reference}</h4>
                          <p className="text-sm text-gray-600">{property.owner}</p>
                          <p className="text-sm text-blue-600">{property.propertyType}</p>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <div className="text-sm">
                            <span className="text-gray-600">Valeur: </span>
                            <span className="font-semibold text-green-600">
                              {(property.propertyValue / 1000000).toFixed(1)}M CFA
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">LTV: </span>
                            <span className="font-semibold text-purple-600">
                              {property.mortgageRatio.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Rapports */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Download className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Rapport GPS</h3>
                    <p className="text-sm text-gray-600 mb-4">Vérifications garanties mensuelles</p>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Calculator className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Évaluation Portfolio</h3>
                    <p className="text-sm text-gray-600 mb-4">Analyse risques garanties</p>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Consulter
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BanqueGPSVerification;
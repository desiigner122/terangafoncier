import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin,
  Satellite,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Map,
  Camera,
  Upload,
  Download,
  Eye,
  Crosshair,
  Layers,
  Activity,
  Shield,
  Clock,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const VendeurGPSVerification = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Données de géolocalisation
  const [gpsData] = useState({
    stats: {
      totalProperties: 12,
      gpsVerified: 9,
      pendingVerification: 2,
      conflicts: 1,
      accuracy: 95.8
    },
    
    properties: [
      {
        id: 1,
        ref: 'ALM-001',
        name: 'Villa Almadies Premium',
        address: 'Route des Almadies, Dakar',
        coordinates: {
          lat: 14.7392,
          lng: -17.4942
        },
        status: 'Vérifié',
        accuracy: 98.5,
        lastVerification: '2024-09-26',
        satelliteImages: 3,
        conflicts: [],
        area: '500m²',
        boundariesVerified: true
      },
      {
        id: 2,
        ref: 'THI-007',
        name: 'Terrain Résidentiel Thiès',
        address: 'Quartier Médina, Thiès',
        coordinates: {
          lat: 14.7886,
          lng: -16.9317
        },
        status: 'Conflit détecté',
        accuracy: 85.2,
        lastVerification: '2024-09-25',
        satelliteImages: 2,
        conflicts: ['Chevauchement avec parcelle voisine', 'Limites imprécises'],
        area: '800m²',
        boundariesVerified: false
      },
      {
        id: 3,
        ref: 'SAL-003',
        name: 'Villa Saly Portudal',
        address: 'Station Balnéaire, Saly',
        coordinates: {
          lat: 14.4542,
          lng: -16.7617
        },
        status: 'En cours',
        accuracy: null,
        lastVerification: '2024-09-24',
        satelliteImages: 1,
        conflicts: [],
        area: '350m²',
        boundariesVerified: false
      }
    ]
  });

  const getStatusColor = (status) => {
    const colors = {
      'Vérifié': 'bg-green-100 text-green-800',
      'Conflit détecté': 'bg-red-100 text-red-800',
      'En cours': 'bg-yellow-100 text-yellow-800',
      'Non vérifié': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 95) return 'text-green-600';
    if (accuracy >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const PropertyGPSCard = ({ property }) => (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{property.name}</h3>
              <Badge className={getStatusColor(property.status)}>
                {property.status}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mb-1">Réf: {property.ref}</p>
            <p className="text-gray-500 text-sm mb-2">{property.address}</p>
            <p className="text-gray-500 text-sm">Superficie: {property.area}</p>
          </div>
          
          <div className="text-right">
            {property.accuracy && (
              <div className={`text-2xl font-bold ${getAccuracyColor(property.accuracy)}`}>
                {property.accuracy}%
              </div>
            )}
            <div className="text-xs text-gray-500">
              {property.accuracy ? 'Précision GPS' : 'En analyse'}
            </div>
          </div>
        </div>

        {/* Coordonnées GPS */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">Coordonnées GPS</span>
          </div>
          <div className="text-blue-700 text-sm font-mono">
            Lat: {property.coordinates.lat}, Lng: {property.coordinates.lng}
          </div>
        </div>

        {/* Conflits détectés */}
        {property.conflicts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="font-medium text-red-800">Conflits détectés</span>
            </div>
            <ul className="text-red-700 text-sm space-y-1">
              {property.conflicts.map((conflict, index) => (
                <li key={index}>• {conflict}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Informations de vérification */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Dernière vérification:</span>
            <div className="font-medium">{property.lastVerification}</div>
          </div>
          <div>
            <span className="text-gray-500">Images satellite:</span>
            <div className="font-medium">{property.satelliteImages}</div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              {property.boundariesVerified ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Clock className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm">Limites cadastrales vérifiées</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm">
            <Map className="w-4 h-4 mr-2" />
            Voir carte
          </Button>
          <Button size="sm" variant="outline">
            <Satellite className="w-4 h-4 mr-2" />
            Images satellite
          </Button>
          <Button size="sm" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Rapport GPS
          </Button>
          {property.conflicts.length > 0 && (
            <Button size="sm" variant="outline" className="text-red-600">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Résoudre
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header avec statistiques GPS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{gpsData.stats.totalProperties}</div>
            <div className="text-sm text-gray-600">Propriétés totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{gpsData.stats.gpsVerified}</div>
            <div className="text-sm text-gray-600">GPS vérifiées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{gpsData.stats.pendingVerification}</div>
            <div className="text-sm text-gray-600">En attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{gpsData.stats.conflicts}</div>
            <div className="text-sm text-gray-600">Conflits</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{gpsData.stats.accuracy}%</div>
            <div className="text-sm text-gray-600">Précision moyenne</div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets de fonctionnalités GPS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="verification">Vérification</TabsTrigger>
          <TabsTrigger value="mapping">Cartographie</TabsTrigger>
          <TabsTrigger value="satellite">Satellite</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="space-y-4">
            {gpsData.properties.map((property) => (
              <PropertyGPSCard key={property.id} property={property} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crosshair className="w-5 h-5" />
                Nouvelle Vérification GPS
              </CardTitle>
              <CardDescription>
                Lancez une vérification GPS pour une propriété
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Navigation className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Géolocalisation Précise</h4>
                      <p className="text-sm text-gray-600">Coordonnées exactes</p>
                    </div>
                  </div>
                  <Button className="w-full">
                    <MapPin className="w-4 h-4 mr-2" />
                    Localiser propriété
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Layers className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Limites Cadastrales</h4>
                      <p className="text-sm text-gray-600">Vérification des bornes</p>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Vérifier limites
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Activity className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Détection Conflits</h4>
                      <p className="text-sm text-gray-600">Chevauchements</p>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Analyser conflits
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Zap className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Vérification Express</h4>
                      <p className="text-sm text-gray-600">Analyse rapide IA</p>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Zap className="w-4 h-4 mr-2" />
                    Analyse rapide
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5" />
                Cartographie Interactive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg p-12 text-center">
                <Map className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Carte Interactive
                </h3>
                <p className="text-gray-600 mb-6">
                  Visualisez toutes vos propriétés sur une carte interactive avec GPS
                </p>
                <div className="flex justify-center gap-4">
                  <Button>
                    <Eye className="w-4 h-4 mr-2" />
                    Ouvrir carte
                  </Button>
                  <Button variant="outline">
                    <Layers className="w-4 h-4 mr-2" />
                    Couches satellite
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satellite" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Satellite className="w-5 h-5" />
                Images Satellite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Uploader Images Satellite
                  </h3>
                  <p className="text-gray-600 mb-4">
                    JPG, PNG jusqu'à 50MB - Résolution haute définition
                  </p>
                  <Button>
                    <Camera className="w-4 h-4 mr-2" />
                    Choisir images
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <Satellite className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Vue Satellite</h4>
                    <p className="text-sm text-gray-600">Images haute résolution</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <Layers className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Analyse Couches</h4>
                    <p className="text-sm text-gray-600">Superposition cadastrale</p>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <Activity className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold mb-1">Détection IA</h4>
                    <p className="text-sm text-gray-600">Changements automatiques</p>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendeurGPSVerification;
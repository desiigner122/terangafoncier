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
  Triangle
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const MairieGPSVerification = ({ dashboardStats }) => {
  const { profile } = useAuth();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [mapView, setMapView] = useState('satellite');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [resolvedThisMonth, setResolvedThisMonth] = useState(0);

  // Statistiques GPS (calculées sur les données réelles)
  const [gpsStats, setGpsStats] = useState({
    totalVerifications: 0,
    successfulVerifications: 0,
    conflictsDetected: 0,
    pendingVerifications: 0,
    accuracyRate: null,
    averageProcessingTime: null
  });

  // Propriétés à vérifier (chargées depuis Supabase)
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    loadGPSData();
  }, [profile]);

  const loadGPSData = async () => {
    setLoading(true);
    try {
      const communeCity = profile?.city || null;

      // Propriétés (filtrées par ville de la mairie si disponible)
      let propQuery = supabase
        .from('properties')
        .select('id, owner_id, title, name, type, surface, location, region, city, latitude, longitude, status, verification_status, created_at')
        .order('created_at', { ascending: false })
        .limit(200);
      if (communeCity) propQuery = propQuery.eq('city', communeCity);
      const { data: propsData } = await propQuery;
      const propsList = propsData || [];

      const propIds = propsList.map((p) => p.id);

      // Photos GPS (coordonnées + score qualité)
      let photosByProp = {};
      if (propIds.length > 0) {
        const { data: photos } = await supabase
          .from('property_photos')
          .select('property_id, url, is_primary, gps_latitude, gps_longitude, quality_score, created_at')
          .in('property_id', propIds);
        (photos || []).forEach((ph) => {
          const cur = photosByProp[ph.property_id];
          // Privilégier la photo primaire ou celle qui porte des coordonnées GPS
          if (!cur || ph.is_primary || (ph.gps_latitude != null && cur.gps_latitude == null)) {
            photosByProp[ph.property_id] = ph;
          }
        });
      }

      // Litiges ouverts (conflits réels) rattachés à ces propriétés
      let disputesByProp = {};
      if (propIds.length > 0) {
        const { data: disputes } = await supabase
          .from('disputes')
          .select('id, title, property_id, status, created_at')
          .in('property_id', propIds);
        (disputes || []).forEach((d) => {
          if (!disputesByProp[d.property_id]) disputesByProp[d.property_id] = [];
          disputesByProp[d.property_id].push(d);
        });
        // Résolus ce mois
        const startMonth = new Date();
        startMonth.setDate(1);
        startMonth.setHours(0, 0, 0, 0);
        const resolved = (disputes || []).filter(
          (d) => d.status === 'resolved' && d.created_at && new Date(d.created_at) >= startMonth
        ).length;
        setResolvedThisMonth(resolved);
      }

      // Noms des propriétaires
      let ownersById = {};
      const ownerIds = [...new Set(propsList.map((p) => p.owner_id).filter(Boolean))];
      if (ownerIds.length > 0) {
        const { data: owners } = await supabase
          .from('profiles')
          .select('id, full_name, first_name, last_name')
          .in('id', ownerIds);
        (owners || []).forEach((o) => {
          ownersById[o.id] =
            o.full_name ||
            [o.first_name, o.last_name].filter(Boolean).join(' ') ||
            null;
        });
      }

      // Construire la liste des propriétés à vérifier
      const mapped = propsList
        .map((p) => {
          const photo = photosByProp[p.id];
          const lat = photo?.gps_latitude ?? p.latitude ?? null;
          const lng = photo?.gps_longitude ?? p.longitude ?? null;
          if (lat == null || lng == null) return null; // pas de coordonnées => hors périmètre GPS

          const openDisputes = (disputesByProp[p.id] || []).filter((d) => d.status === 'open');
          const hasConflict = openDisputes.length > 0;
          const isVerified = p.verification_status === 'verified';
          const status = hasConflict ? 'conflict_detected' : isVerified ? 'verified' : 'pending';

          return {
            id: p.id,
            reference: p.title || p.name || `Parcelle ${String(p.id).slice(0, 8)}`,
            owner: ownersById[p.owner_id] || 'Propriétaire inconnu',
            address: p.location || [p.city, p.region].filter(Boolean).join(', ') || '—',
            coordinates: {
              latitude: Number(lat),
              longitude: Number(lng),
              qualityScore: photo?.quality_score ?? null
            },
            status,
            area: p.surface ?? null,
            lastVerified: isVerified ? (photo?.created_at || p.created_at) : null,
            conflicts: openDisputes.map((d) => d.title || 'Litige en cours'),
            riskLevel: hasConflict ? 'high' : isVerified ? 'low' : 'medium'
          };
        })
        .filter(Boolean);

      setProperties(mapped);

      // Statistiques réelles
      const verifiedCount = mapped.filter((m) => m.status === 'verified').length;
      const conflictCount = mapped.filter((m) => m.status === 'conflict_detected').length;
      const pendingCount = mapped.filter((m) => m.status === 'pending').length;
      const qualityScores = mapped
        .map((m) => m.coordinates.qualityScore)
        .filter((q) => q != null && !Number.isNaN(Number(q)));
      const avgQuality =
        qualityScores.length > 0
          ? Math.round(
              (qualityScores.reduce((a, b) => a + Number(b), 0) / qualityScores.length) * 10
            ) / 10
          : null;

      setGpsStats({
        totalVerifications: mapped.length,
        successfulVerifications: verifiedCount,
        conflictsDetected: conflictCount,
        pendingVerifications: pendingCount,
        accuracyRate: avgQuality,
        averageProcessingTime: null
      });
    } catch (err) {
      console.error('Erreur chargement données GPS:', err);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Vérification GPS réelle : marque la propriété comme vérifiée dans Supabase
  const handleGPSVerification = async (property) => {
    setSelectedProperty(property);
    setVerificationInProgress(true);
    try {
      await supabase
        .from('properties')
        .update({ verification_status: 'verified' })
        .eq('id', property.id);

      setProperties((prev) =>
        prev.map((p) =>
          p.id === property.id
            ? {
                ...p,
                status: p.conflicts.length > 0 ? 'conflict_detected' : 'verified',
                lastVerified: new Date().toISOString(),
                riskLevel: p.conflicts.length > 0 ? 'high' : 'low'
              }
            : p
        )
      );
      setGpsStats((s) => ({
        ...s,
        successfulVerifications:
          property.status === 'verified' ? s.successfulVerifications : s.successfulVerifications + 1,
        pendingVerifications:
          property.status === 'pending' ? Math.max(0, s.pendingVerifications - 1) : s.pendingVerifications
      }));
    } catch (err) {
      console.error('Erreur vérification GPS:', err);
    } finally {
      setVerificationInProgress(false);
    }
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

  const filteredProperties = properties.filter(property => {
    return filterStatus === 'all' || property.status === filterStatus;
  });

  const PropertyGPSCard = ({ property, onVerify }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
    >
      <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-teal-500">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-teal-100 p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-teal-600" />
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
                {property.area != null ? `${property.area} m²` : '—'}
              </div>
              <div className="text-xs text-gray-600">
                {property.coordinates.qualityScore != null
                  ? `Qualité: ${property.coordinates.qualityScore}`
                  : 'Qualité: —'}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="text-sm">
              <p className="font-medium text-gray-900">{property.owner}</p>
              <p className="text-gray-600">{property.address}</p>
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
                  <p className="text-green-600 text-sm font-medium">Vérifications Réussies</p>
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
                  <p className="text-blue-600 text-sm font-medium">Qualité GPS Moyenne</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {gpsStats.accuracyRate != null ? gpsStats.accuracyRate : '—'}
                  </p>
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
            <Satellite className="h-5 w-5 text-teal-600" />
            <span>Vérification GPS et Cartographie Satellitaire</span>
          </CardTitle>
          <CardDescription>
            Validation géographique des propriétés avec coordonnées GPS et imagerie satellite
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="verification">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="verification">Vérification</TabsTrigger>
              <TabsTrigger value="mapping">Cartographie</TabsTrigger>
              <TabsTrigger value="conflicts">Conflits</TabsTrigger>
              <TabsTrigger value="reports">Rapports</TabsTrigger>
            </TabsList>

            {/* Vérification GPS */}
            <TabsContent value="verification" className="space-y-6">
              {/* Filtres */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher une propriété..."
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

              {/* Liste des propriétés */}
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

              {!loading && filteredProperties.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Satellite className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Aucune parcelle géolocalisée</p>
                  <p className="text-sm">
                    Aucune propriété avec coordonnées GPS pour ce périmètre.
                  </p>
                </div>
              )}
              {loading && (
                <div className="text-center py-12 text-gray-400 text-sm">Chargement des données GPS…</div>
              )}

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
                        <Target className="h-5 w-5 text-teal-600" />
                        <span>Vérification GPS en cours</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="inline-block"
                        >
                          <Satellite className="h-12 w-12 text-teal-600 mb-4" />
                        </motion.div>
                        <h3 className="text-lg font-semibold mb-2">
                          Analyse GPS: {selectedProperty.reference}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Vérification coordonnées et détection conflits...
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
                          <span>Détection conflits</span>
                          <Clock className="h-4 w-4 text-yellow-600" />
                        </div>
                      </div>

                      <Progress value={75} className="mt-4" />
                      <p className="text-center text-sm text-gray-600">75% complété</p>
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
                    <Map className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Vue Cadastrale</h3>
                    <p className="text-sm text-gray-600">Plan cadastral officiel</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Satellite className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Vue Satellite</h3>
                    <p className="text-sm text-gray-600">Imagerie satellite haute résolution</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Layers className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Vue Hybride</h3>
                    <p className="text-sm text-gray-600">Combinaison carte + satellite</p>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Globe className="h-4 w-4" />
                <AlertTitle>Cartographie Intégrée</AlertTitle>
                <AlertDescription>
                  Utilisation des dernières images satellites et données GPS pour une précision maximale 
                  dans la localisation et vérification des propriétés foncières.
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* Conflits */}
            <TabsContent value="conflicts" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="text-red-700">Conflits Actifs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-900 mb-2">
                      {properties.filter(p => p.status === 'conflict_detected').length}
                    </div>
                    <p className="text-red-600">Nécessitent une intervention</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-green-700">Résolus ce mois</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-900 mb-2">{resolvedThisMonth}</div>
                    <p className="text-green-600">Conflits résolus</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                {properties
                  .filter(p => p.conflicts.length > 0)
                  .map((property) => (
                    <Card key={property.id} className="border-l-4 border-l-red-400">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{property.reference}</h4>
                            <p className="text-sm text-gray-600">{property.owner}</p>
                          </div>
                          <Badge className="bg-red-100 text-red-800">
                            Conflit actif
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          {property.conflicts.map((conflict, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm text-red-600">
                              <AlertTriangle className="h-4 w-4" />
                              <span>{conflict}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex space-x-2 mt-4">
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            <Flag className="h-4 w-4 mr-1" />
                            Signaler
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Examiner
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            </TabsContent>

            {/* Rapports */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Download className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Rapport GPS</h3>
                    <p className="text-sm text-gray-600 mb-4">Statistiques vérifications GPS</p>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Share2 className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Carte Conflits</h3>
                    <p className="text-sm text-gray-600 mb-4">Visualisation cartographique</p>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Partager
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

export default MairieGPSVerification;
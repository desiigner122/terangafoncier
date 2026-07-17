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
  Banknote,
  Loader2
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

const BanqueGPSVerification = ({ dashboardStats }) => {
  const { user } = useAuth();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [mapView, setMapView] = useState('satellite');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Statistiques GPS calculées à partir des données réelles (aucune valeur fabriquée)
  const [gpsStats, setGpsStats] = useState({
    totalVerifications: 0,
    successfulVerifications: 0,
    conflictsDetected: 0,
    pendingVerifications: 0,
    accuracyRate: null
  });

  // Garanties bancaires (table guarantees) enrichies des propriétés / prêts / photos GPS réels
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadGuaranteesGPS();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Une photo est "géolocalisée" si elle porte de vraies coordonnées GPS
  const hasGps = (coord) => coord?.latitude != null && coord?.longitude != null;

  const loadGuaranteesGPS = async () => {
    setLoading(true);
    try {
      // 1. Garanties de la banque
      const { data: guarantees, error: gErr } = await supabase
        .from('guarantees')
        .select('id, bank_id, loan_id, property_id, client_name, type, value, status, expiry_date, created_at')
        .eq('bank_id', user.id)
        .order('created_at', { ascending: false });

      if (gErr) throw gErr;

      const guarList = guarantees || [];
      const propertyIds = [...new Set(guarList.map((g) => g.property_id).filter(Boolean))];
      const loanIds = [...new Set(guarList.map((g) => g.loan_id).filter(Boolean))];

      // 2. Propriétés liées (localisation, surface, valeurs, coords cadastrales)
      let propsById = {};
      if (propertyIds.length > 0) {
        const { data: props } = await supabase
          .from('properties')
          .select('id, title, type, location, region, city, surface, latitude, longitude, estimated_value, market_value, price')
          .in('id', propertyIds);
        (props || []).forEach((p) => { propsById[p.id] = p; });
      }

      // 3. Prêts liés (montant du crédit pour le ratio LTV)
      let loansById = {};
      if (loanIds.length > 0) {
        const { data: loans } = await supabase
          .from('loans')
          .select('id, reference, amount, type')
          .in('id', loanIds);
        (loans || []).forEach((l) => { loansById[l.id] = l; });
      }

      // 4. Photos géolocalisées réelles (property_photos: gps_latitude/gps_longitude/quality_score)
      let photosByProperty = {};
      if (propertyIds.length > 0) {
        const { data: photos } = await supabase
          .from('property_photos')
          .select('id, property_id, gps_latitude, gps_longitude, quality_score, is_primary, created_at')
          .in('property_id', propertyIds);
        (photos || []).forEach((ph) => {
          if (!photosByProperty[ph.property_id]) photosByProperty[ph.property_id] = [];
          photosByProperty[ph.property_id].push(ph);
        });
      }

      // 5. Litiges réels sur ces propriétés (table disputes) = conflits géographiques constatés
      let disputesByProperty = {};
      if (propertyIds.length > 0) {
        const { data: disputes } = await supabase
          .from('disputes')
          .select('id, title, property_id, status')
          .in('property_id', propertyIds);
        (disputes || []).forEach((d) => {
          if (!disputesByProperty[d.property_id]) disputesByProperty[d.property_id] = [];
          disputesByProperty[d.property_id].push(d);
        });
      }

      const built = guarList.map((g) => {
        const prop = g.property_id ? propsById[g.property_id] : null;
        const loan = g.loan_id ? loansById[g.loan_id] : null;
        const photos = (g.property_id && photosByProperty[g.property_id]) || [];

        // Meilleure photo géolocalisée : primaire d'abord, sinon la première portant des coords
        const gpsPhoto =
          photos.find((ph) => ph.is_primary && ph.gps_latitude != null && ph.gps_longitude != null) ||
          photos.find((ph) => ph.gps_latitude != null && ph.gps_longitude != null) ||
          null;

        // Coordonnées : photo GPS réelle en priorité, sinon coords cadastrales de la propriété
        let coordinates = null;
        if (gpsPhoto) {
          coordinates = {
            latitude: Number(gpsPhoto.gps_latitude),
            longitude: Number(gpsPhoto.gps_longitude),
            quality: gpsPhoto.quality_score != null ? Number(gpsPhoto.quality_score) : null,
            source: 'photo'
          };
        } else if (prop?.latitude != null && prop?.longitude != null) {
          coordinates = {
            latitude: Number(prop.latitude),
            longitude: Number(prop.longitude),
            quality: null,
            source: 'cadastre'
          };
        }

        const openDisputes = (disputesByProperty[g.property_id] || []).filter(
          (d) => d.status !== 'resolved' && d.status !== 'closed'
        );
        const conflicts = openDisputes.map((d) => d.title || 'Litige en cours');

        // Statut de vérification GPS déterministe (aucun aléatoire)
        let status;
        if (conflicts.length > 0) status = 'conflict_detected';
        else if (coordinates) status = 'verified';
        else status = 'pending';

        const creditAmount = loan?.amount != null ? Number(loan.amount) : null;
        const propertyValue =
          g.value != null ? Number(g.value)
          : prop?.market_value != null ? Number(prop.market_value)
          : prop?.estimated_value != null ? Number(prop.estimated_value)
          : prop?.price != null ? Number(prop.price)
          : null;
        const mortgageRatio =
          creditAmount != null && propertyValue ? (creditAmount / propertyValue) * 100 : null;

        return {
          id: g.id,
          propertyId: g.property_id,
          reference: loan?.reference || `GAR-${String(g.id).slice(0, 8)}`,
          owner: g.client_name || '—',
          address: prop?.location || [prop?.city, prop?.region].filter(Boolean).join(', ') || '—',
          coordinates,
          status,
          area: prop?.surface != null ? Number(prop.surface) : null,
          lastVerified: gpsPhoto?.created_at || null,
          conflicts,
          riskLevel: conflicts.length > 0 ? 'high' : coordinates ? 'low' : 'medium',
          creditAmount,
          propertyValue,
          mortgageRatio,
          propertyType: prop?.type || g.type || 'Bien'
        };
      });

      setProperties(built);

      // Statistiques réelles
      const verified = built.filter((p) => p.status === 'verified').length;
      const conflict = built.filter((p) => p.status === 'conflict_detected').length;
      const pending = built.filter((p) => p.status === 'pending').length;
      const scored = built.filter((p) => p.coordinates?.quality != null);
      const avgQuality = scored.length > 0
        ? scored.reduce((s, p) => s + p.coordinates.quality, 0) / scored.length
        : null;

      setGpsStats({
        totalVerifications: built.length,
        successfulVerifications: verified,
        conflictsDetected: conflict,
        pendingVerifications: pending,
        accuracyRate: avgQuality != null ? Number(avgQuality.toFixed(1)) : null
      });
    } catch (error) {
      console.error('Erreur chargement vérifications GPS:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Vérification GPS : relit les coordonnées réelles de la propriété (aucun aléatoire)
  const handleGPSVerification = async (property) => {
    setSelectedProperty(property);
    setVerificationInProgress(true);

    try {
      let coordinates = property.coordinates;
      let lastVerified = property.lastVerified;

      if (property.propertyId) {
        const { data: photos } = await supabase
          .from('property_photos')
          .select('gps_latitude, gps_longitude, quality_score, is_primary, created_at')
          .eq('property_id', property.propertyId);

        const gpsPhoto =
          (photos || []).find((ph) => ph.is_primary && ph.gps_latitude != null && ph.gps_longitude != null) ||
          (photos || []).find((ph) => ph.gps_latitude != null && ph.gps_longitude != null) ||
          null;

        if (gpsPhoto) {
          coordinates = {
            latitude: Number(gpsPhoto.gps_latitude),
            longitude: Number(gpsPhoto.gps_longitude),
            quality: gpsPhoto.quality_score != null ? Number(gpsPhoto.quality_score) : null,
            source: 'photo'
          };
          lastVerified = gpsPhoto.created_at;
        }
      }

      const newStatus =
        property.conflicts.length > 0 ? 'conflict_detected' : coordinates ? 'verified' : 'pending';

      setProperties((prev) =>
        prev.map((p) =>
          p.id === property.id ? { ...p, coordinates, status: newStatus, lastVerified } : p
        )
      );
    } catch (error) {
      console.error('Erreur vérification GPS:', error);
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

  const getPropertyTypeIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('commerc') || t.includes('collectif') || t.includes('immeuble')) return Building2;
    return Home;
  };

  const filteredProperties = properties.filter((property) => {
    const matchStatus = filterStatus === 'all' || property.status === filterStatus;
    const q = searchTerm.trim().toLowerCase();
    const matchSearch =
      !q ||
      property.reference.toLowerCase().includes(q) ||
      property.owner.toLowerCase().includes(q) ||
      property.address.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const totalGuaranteeValue = properties.reduce((sum, p) => sum + (p.propertyValue || 0), 0);
  const ltvProps = properties.filter((p) => p.mortgageRatio != null);
  const avgLtv =
    ltvProps.length > 0
      ? ltvProps.reduce((sum, p) => sum + p.mortgageRatio, 0) / ltvProps.length
      : null;

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
                  {property.area != null ? `${property.area} m²` : '—'}
                </div>
                <div className="text-xs text-gray-600">
                  {property.coordinates?.quality != null
                    ? `Qualité ${property.coordinates.quality}`
                    : property.coordinates ? 'GPS OK' : 'Sans GPS'}
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
                  <span className="ml-1 font-mono text-xs">
                    {property.coordinates ? property.coordinates.latitude.toFixed(4) : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Lng:</span>
                  <span className="ml-1 font-mono text-xs">
                    {property.coordinates ? property.coordinates.longitude.toFixed(4) : '—'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Crédit:</span>
                  <span className="font-semibold text-blue-600">
                    {property.creditAmount != null
                      ? `${(property.creditAmount / 1000000).toFixed(1)}M CFA`
                      : '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Valeur bien:</span>
                  <span className="font-semibold text-green-600">
                    {property.propertyValue != null
                      ? `${(property.propertyValue / 1000000).toFixed(1)}M CFA`
                      : '—'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Ratio LTV:</span>
                  <span className="font-semibold text-purple-600">
                    {property.mortgageRatio != null
                      ? `${property.mortgageRatio.toFixed(1)}%`
                      : '—'}
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
              {loading ? (
                <div className="flex items-center justify-center py-16 text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Chargement des garanties...
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Satellite className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Aucune garantie à vérifier</p>
                  <p className="text-sm">
                    Les garanties immobilières associées à vos dossiers apparaîtront ici.
                  </p>
                </div>
              ) : (
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
                          Lecture des coordonnées géolocalisées de la propriété...
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Lecture coordonnées property_photos</span>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <RefreshCw className="h-4 w-4 text-blue-600" />
                          </motion.div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Contrôle des litiges associés</span>
                          <Clock className="h-4 w-4 text-yellow-600" />
                        </div>
                      </div>

                      <Progress value={80} className="mt-4" />
                      <p className="text-center text-sm text-gray-600">Vérification en cours...</p>
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
                      {totalGuaranteeValue > 0
                        ? `${(totalGuaranteeValue / 1000000000).toFixed(2)}Md CFA`
                        : '—'}
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
                      {avgLtv != null ? `${avgLtv.toFixed(1)}%` : '—'}
                    </div>
                    <p className="text-blue-600">Loan-to-Value moyen</p>
                  </CardContent>
                </Card>
              </div>

              {properties.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">
                  Aucune garantie à évaluer pour le moment.
                </div>
              ) : (
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
                                {property.propertyValue != null
                                  ? `${(property.propertyValue / 1000000).toFixed(1)}M CFA`
                                  : '—'}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">LTV: </span>
                              <span className="font-semibold text-purple-600">
                                {property.mortgageRatio != null
                                  ? `${property.mortgageRatio.toFixed(1)}%`
                                  : '—'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Rapports */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Download className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Rapport GPS</h3>
                    <p className="text-sm text-gray-600 mb-4">Vérifications garanties mensuelles</p>
                    <Button size="sm" disabled>
                      <Download className="h-4 w-4 mr-2" />
                      Bientôt disponible
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Calculator className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Évaluation Portfolio</h3>
                    <p className="text-sm text-gray-600 mb-4">Analyse risques garanties</p>
                    <Button size="sm" variant="outline" disabled>
                      <Eye className="h-4 w-4 mr-2" />
                      Bientôt disponible
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

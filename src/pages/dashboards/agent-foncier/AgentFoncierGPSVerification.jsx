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
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Mappe verification_status (properties) vers un statut d'affichage GPS
const mapVerifStatus = (vs) => {
  const v = (vs || '').toString().toLowerCase();
  if (['verified', 'confirmed', 'valid', 'validated', 'approved'].includes(v)) return 'verified';
  if (['rejected', 'disputed', 'fraud', 'investigating', 'conflict'].includes(v)) return 'investigating';
  return 'pending';
};

const AgentFoncierGPSVerification = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('map');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    let active = true;
    const loadProperties = async () => {
      setLoading(true);
      try {
        // Biens fonciers + photos GPS (coordonnées et qualité réelles)
        const { data: props, error } = await supabase
          .from('properties')
          .select('id, owner_id, title, name, type, surface, location, region, city, latitude, longitude, status, verification_status, created_at, property_photos(gps_latitude, gps_longitude, quality_score, is_primary)')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;

        // Noms des propriétaires
        const ownerIds = [...new Set((props || []).map(p => p.owner_id).filter(Boolean))];
        let ownerMap = {};
        if (ownerIds.length > 0) {
          const { data: profs } = await supabase
            .from('profiles')
            .select('id, full_name, first_name, last_name')
            .in('id', ownerIds);
          (profs || []).forEach(pr => {
            ownerMap[pr.id] = pr.full_name || [pr.first_name, pr.last_name].filter(Boolean).join(' ') || null;
          });
        }

        const mapped = (props || []).map((p) => {
          const photos = Array.isArray(p.property_photos) ? p.property_photos : [];
          const primary = photos.find(ph => ph.is_primary) || photos[0] || null;
          // Coordonnées: on privilégie celles du bien, sinon celles de la photo GPS
          const lat = p.latitude ?? primary?.gps_latitude ?? null;
          const lng = p.longitude ?? primary?.gps_longitude ?? null;
          // Qualité GPS: score réel de la photo primaire (0-100)
          const qualityScore = primary?.quality_score ?? null;
          return {
            id: p.id,
            reference: p.title || p.name || `#${String(p.id).slice(0, 8)}`,
            owner: ownerMap[p.owner_id] || '—',
            location: [p.city, p.region].filter(Boolean).join(', ') || p.location || '—',
            coordinates: { lat, lng, quality: qualityScore },
            status: mapVerifStatus(p.verification_status),
            area: p.surface ?? null,
            photos: photos.length,
            hasGps: lat != null && lng != null,
            conflicts: []
          };
        });

        if (active) setProperties(mapped);
      } catch (e) {
        if (active) setProperties([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadProperties();
    return () => { active = false; };
  }, [user?.id]);

  // Statistiques GPS dérivées des données réelles
  const withGps = properties.filter(p => p.hasGps);
  const verifiedCount = properties.filter(p => p.status === 'verified').length;
  const pendingCount = properties.filter(p => p.status === 'pending').length;
  const qualityVals = properties.map(p => p.coordinates.quality).filter(q => q != null);
  const avgQuality = qualityVals.length
    ? Math.round(qualityVals.reduce((a, b) => a + b, 0) / qualityVals.length)
    : null;

  const gpsStats = {
    totalProperties: properties.length,
    gpsCount: withGps.length,
    verifiedProperties: verifiedCount,
    pendingVerification: pendingCount,
    avgQuality
  };

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

  // Couleur de la qualité GPS (score 0-100 : plus haut = meilleur)
  const getQualityColor = (quality) => {
    if (quality == null) return 'text-slate-400';
    if (quality >= 80) return 'text-green-600';
    if (quality >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredProperties = properties.filter(property =>
    property.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Points affichables sur la carte : uniquement ceux avec coordonnées réelles
  const mapPoints = withGps.slice(0, 8);

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

      {/* Stats globales (dérivées des données réelles) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Propriétés Total',
            value: gpsStats.totalProperties,
            icon: MapPin,
            color: 'from-blue-500 to-cyan-600'
          },
          {
            title: 'Coordonnées GPS',
            value: gpsStats.gpsCount,
            icon: Satellite,
            color: 'from-green-500 to-emerald-600'
          },
          {
            title: 'Vérifiées',
            value: gpsStats.verifiedProperties,
            icon: CheckCircle,
            color: 'from-purple-500 to-indigo-600'
          },
          {
            title: 'Qualité moyenne',
            value: gpsStats.avgQuality != null ? `${gpsStats.avgQuality}%` : '—',
            icon: Target,
            color: 'from-orange-500 to-red-600'
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
                </div>
                <p className="text-sm text-slate-600">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{loading ? '—' : stat.value}</p>
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
        {/* Vue carte (points réels géolocalisés) */}
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
              {/* Fond de carte décoratif */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-green-200 via-blue-200 to-purple-200"></div>
              </div>

              {mapPoints.length > 0 ? (
                mapPoints.map((property, index) => (
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
                      left: `${15 + (index % 4) * 20}%`,
                      top: `${25 + Math.floor(index / 4) * 30}%`
                    }}
                    onClick={() => setSelectedProperty(property)}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-slate-700 opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                      {property.reference}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-slate-500">
                    <Satellite className="w-12 h-12 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">{loading ? 'Chargement des coordonnées…' : 'Aucune propriété géolocalisée'}</p>
                  </div>
                </div>
              )}

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

              {/* Coordonnées du point sélectionné */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
                {selectedProperty && selectedProperty.coordinates.lat != null ? (
                  <>
                    <div>Lat: {Number(selectedProperty.coordinates.lat).toFixed(4)}°</div>
                    <div>Lng: {Number(selectedProperty.coordinates.lng).toFixed(4)}°</div>
                  </>
                ) : (
                  <div className="text-slate-500">Sélectionner un point</div>
                )}
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
                    <span className="font-semibold">{selectedProperty.area != null ? `${selectedProperty.area} m²` : '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Qualité GPS</span>
                    <span className={`font-semibold ${getQualityColor(selectedProperty.coordinates.quality)}`}>
                      {selectedProperty.coordinates.quality != null ? `${selectedProperty.coordinates.quality}%` : '—'}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-600 mb-2">Coordonnées</p>
                  <div className="bg-slate-50 p-2 rounded text-xs font-mono">
                    {selectedProperty.coordinates.lat != null ? (
                      <>
                        <div>Lat: {selectedProperty.coordinates.lat}°</div>
                        <div>Lng: {selectedProperty.coordinates.lng}°</div>
                      </>
                    ) : (
                      <div className="text-slate-400">Coordonnées non renseignées</div>
                    )}
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
              {loading ? (
                <div className="text-center py-8 text-slate-500">Chargement des propriétés…</div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-40" />
                  <p>Aucune propriété à afficher</p>
                </div>
              ) : filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer"
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
                        <p className="font-semibold">{property.area != null ? `${property.area}m²` : '—'}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-500">Qualité GPS</p>
                        <p className={`font-semibold ${getQualityColor(property.coordinates.quality)}`}>
                          {property.coordinates.quality != null ? `${property.coordinates.quality}%` : '—'}
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

      {/* Équipements GPS — pas de table réelle : état honnête */}
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
            <div className="text-center py-8 text-slate-500">
              <Compass className="w-12 h-12 mx-auto mb-2 opacity-40" />
              <p>Suivi du parc d'équipements GPS bientôt disponible</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AgentFoncierGPSVerification;

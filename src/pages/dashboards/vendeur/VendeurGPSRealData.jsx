import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Satellite, Navigation, Map, Crosshair, Layers,
  AlertTriangle, CheckCircle, Clock, Download, Eye, Zap,
  Shield, Activity, Upload, FileText, Search, Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import VendeurSupabaseService from '@/services/VendeurSupabaseService';
import { toast } from 'sonner';

const VendeurGPSRealData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // États
  // `coordinates` contient les photos de terrains du vendeur (table property_photos),
  // chacune éventuellement géolocalisée via gps_latitude / gps_longitude / quality_score.
  const [coordinates, setCoordinates] = useState([]);
  const [properties, setProperties] = useState([]);
  // Les "conflits" réels disponibles dans le schéma sont les litiges (table disputes)
  // liés aux propriétés du vendeur — il n'existe pas de table de détection de
  // chevauchement de polygones cadastraux.
  const [disputes, setDisputes] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    gpsVerified: 0,
    pendingVerification: 0,
    conflicts: 0,
    averageAccuracy: 0
  });

  // Charger données GPS
  useEffect(() => {
    if (user) {
      loadAllData();
    }
  }, [user]);

  // Recalculer les statistiques dès que les données réelles changent
  useEffect(() => {
    computeStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates, properties, disputes]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([loadGPSData(), loadProperties(), loadDisputes()]);
    setLoading(false);
  };

  const loadGPSData = async () => {
    try {
      const result = await VendeurSupabaseService.getUserPhotos(user.id);
      if (!result.success) throw new Error(result.error || 'Erreur chargement des photos');
      setCoordinates(result.data || []);
    } catch (error) {
      console.error('Erreur chargement GPS:', error);
      toast.error('Erreur lors du chargement des coordonnées GPS');
    }
  };

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, location, status')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Erreur chargement propriétés:', error);
    }
  };

  const loadDisputes = async () => {
    try {
      const result = await VendeurSupabaseService.getDisputes(user.id);
      if (!result.success) throw new Error(result.error || 'Erreur chargement des litiges');
      setDisputes(result.data || []);
    } catch (error) {
      console.error('Erreur chargement litiges:', error);
    }
  };

  // Une photo est considérée "géolocalisée" si elle porte de vraies coordonnées GPS
  const hasGpsCoords = (coord) => coord?.gps_latitude != null && coord?.gps_longitude != null;

  const computeStats = () => {
    const geoTagged = coordinates.filter(hasGpsCoords);
    const pending = coordinates.filter((c) => !hasGpsCoords(c));
    const qualityScored = coordinates.filter((c) => c.quality_score != null);
    const avgQuality = qualityScored.length > 0
      ? qualityScored.reduce((sum, c) => sum + (c.quality_score || 0), 0) / qualityScored.length
      : 0;
    const openDisputes = disputes.filter((d) => d.status === 'open').length;

    setStats({
      totalProperties: properties.length,
      gpsVerified: geoTagged.length,
      pendingVerification: pending.length,
      conflicts: openDisputes,
      averageAccuracy: avgQuality.toFixed(1)
    });
  };

  // Mettre à jour les coordonnées GPS d'une photo existante (property_photos)
  const handleUpdatePhotoGPS = async (photoId, gpsData) => {
    try {
      const { data, error } = await supabase
        .from('property_photos')
        .update({
          gps_latitude: gpsData.latitude,
          gps_longitude: gpsData.longitude
        })
        .eq('id', photoId)
        .select()
        .single();

      if (error) throw error;

      toast.success('✅ Coordonnées GPS mises à jour');
      loadGPSData();

      return data;
    } catch (error) {
      console.error('Erreur mise à jour GPS:', error);
      toast.error('❌ Erreur lors de la mise à jour des coordonnées');
    }
  };

  // 1. Localiser une propriété avec GPS navigator (met à jour la photo principale
  // — ou à défaut la première photo — de la propriété sélectionnée)
  const handleLocateProperty = async (propertyId) => {
    if (!navigator.geolocation) {
      toast.error('❌ Géolocalisation non supportée par votre navigateur');
      return;
    }

    const propertyPhotos = coordinates.filter((c) => c.property_id === propertyId);
    const targetPhoto = propertyPhotos.find((p) => p.is_primary) || propertyPhotos[0];

    if (!targetPhoto) {
      toast.error('❌ Aucune photo pour cette propriété — ajoutez une photo avant de la géolocaliser');
      return;
    }

    toast.loading('📍 Acquisition de la position GPS...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        toast.dismiss();
        await handleUpdatePhotoGPS(targetPhoto.id, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        toast.success(`✅ Position GPS acquise (±${position.coords.accuracy?.toFixed(1) || '?'}m)`);
      },
      (error) => {
        toast.dismiss();
        console.error('Erreur géolocalisation:', error);
        toast.error('❌ Impossible d\'obtenir la position GPS');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Capturer/mettre à jour la position GPS d'une photo précise depuis la liste
  const handleGeolocatePhoto = async (photoId) => {
    if (!navigator.geolocation) {
      toast.error('❌ Géolocalisation non supportée par votre navigateur');
      return;
    }

    toast.loading('📍 Acquisition de la position GPS...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        toast.dismiss();
        await handleUpdatePhotoGPS(photoId, {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        toast.dismiss();
        console.error('Erreur géolocalisation:', error);
        toast.error('❌ Impossible d\'obtenir la position GPS');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // 2. Vérifier les limites cadastrales : le schéma ne contient aucune colonne de
  // polygone cadastral (boundary_polygon). On affiche donc la donnée réelle la plus
  // proche disponible — la surface déclarée de la propriété — ou un message honnête
  // indiquant que le relevé de polygone n'est pas encore disponible.
  const handleCheckBoundaries = (coordinateId) => {
    const coordinate = coordinates.find((c) => c.id === coordinateId);
    if (!coordinate) {
      toast.error('❌ Photo introuvable');
      return;
    }

    const surface = coordinate.property?.surface;
    if (surface) {
      toast.success(`📐 Surface déclarée de la propriété : ${Number(surface).toLocaleString('fr-FR')} m²`);
    } else {
      toast.info('ℹ️ Vérification des limites cadastrales bientôt disponible (relevé de polygone requis)');
    }
  };

  // 3. Analyser les conflits : basé sur les litiges réels enregistrés (table disputes)
  // pour la propriété de cette photo — il n'existe pas de détection automatique de
  // chevauchement de polygones dans le schéma actuel.
  const handleAnalyzeConflicts = (coordinateId) => {
    const coordinate = coordinates.find((c) => c.id === coordinateId);
    if (!coordinate) {
      toast.error('❌ Photo introuvable');
      return;
    }

    const relatedDisputes = disputes.filter((d) => d.property_id === coordinate.property_id);

    if (relatedDisputes.length === 0) {
      toast.success('✅ Aucun litige enregistré pour cette propriété');
    } else {
      const openCount = relatedDisputes.filter((d) => d.status === 'open').length;
      toast.warning(`⚠️ ${relatedDisputes.length} litige(s) enregistré(s) (${openCount} ouvert(s))`, {
        description: relatedDisputes.map((d) => d.title).join(', ')
      });
    }
  };

  // 4. Afficher sur Google Maps
  const handleShowOnMap = (coordinate) => {
    if (!hasGpsCoords(coordinate)) {
      toast.warning('⚠️ Aucune coordonnée GPS pour cette photo');
      return;
    }
    const url = `https://maps.google.com/?q=${coordinate.gps_latitude},${coordinate.gps_longitude}&t=m&z=18`;
    window.open(url, '_blank');
    toast.success('🗺️ Ouverture de Google Maps...');
  };

  // 5. Exporter en KML (uniquement les photos réellement géolocalisées)
  const handleExportKML = () => {
    const geoTagged = coordinates.filter(hasGpsCoords);

    if (geoTagged.length === 0) {
      toast.warning('⚠️ Aucune photo géolocalisée à exporter');
      return;
    }

    const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Photos GPS - ${user.email}</name>
    <description>Export des coordonnées GPS - ${new Date().toLocaleDateString('fr-FR')}</description>
    ${geoTagged.map(coord => `
    <Placemark>
      <name>${coord.property?.title || coord.property?.name || 'Sans titre'}</name>
      <description><![CDATA[
        <b>Localisation:</b> ${coord.property?.location || 'Non renseignée'}<br/>
        <b>Latitude:</b> ${coord.gps_latitude.toFixed(6)}°<br/>
        <b>Longitude:</b> ${coord.gps_longitude.toFixed(6)}°<br/>
        ${coord.quality_score != null ? `<b>Qualité photo:</b> ${coord.quality_score}<br/>` : ''}
        ${coord.property?.surface ? `<b>Surface déclarée:</b> ${coord.property.surface} m²<br/>` : ''}
        <b>Date ajout:</b> ${new Date(coord.created_at).toLocaleDateString('fr-FR')}
      ]]></description>
      <Point>
        <coordinates>${coord.gps_longitude},${coord.gps_latitude},0</coordinates>
      </Point>
    </Placemark>
    `).join('')}
  </Document>
</kml>`;

    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gps-coordinates-${new Date().toISOString().split('T')[0]}.kml`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('📥 Fichier KML téléchargé');
  };

  // 6. Importer KML : ne peut mettre à jour que des photos déjà existantes (une photo
  // ne peut pas être créée sans fichier réellement uploadé), en faisant correspondre
  // le nom du Placemark au titre d'une propriété du vendeur.
  const handleImportKML = async (file) => {
    try {
      const text = await file.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');

      const placemarks = xmlDoc.getElementsByTagName('Placemark');
      let imported = 0;
      let skipped = 0;

      for (let placemark of placemarks) {
        const name = placemark.getElementsByTagName('name')[0]?.textContent;

        const pointElement = placemark.getElementsByTagName('Point')[0];
        if (!pointElement) continue;

        const coordsText = pointElement.getElementsByTagName('coordinates')[0]?.textContent?.trim();
        if (!coordsText) continue;

        const [longitude, latitude] = coordsText.split(',').map(Number);

        const matchingProperty = properties.find((p) => p.title === name);
        const targetPhoto = matchingProperty
          ? coordinates.find((c) => c.property_id === matchingProperty.id && !hasGpsCoords(c))
          : null;

        if (targetPhoto) {
          await handleUpdatePhotoGPS(targetPhoto.id, { latitude, longitude });
          imported++;
        } else {
          skipped++;
        }
      }

      if (imported > 0) {
        toast.success(`✅ ${imported} photo(s) mise(s) à jour depuis le KML${skipped > 0 ? ` (${skipped} ignorée(s))` : ''}`);
      } else {
        toast.warning('⚠️ Aucune photo correspondante trouvée (vérifiez les titres de propriétés et ajoutez des photos au préalable)');
      }
      loadGPSData();
    } catch (error) {
      console.error('Erreur import KML:', error);
      toast.error('❌ Erreur lors de l\'import KML');
    }
  };

  // 7. Générer rapport GPS (texte détaillé basé sur les données réelles de la photo)
  const handleGenerateReport = async (coordinateId) => {
    try {
      const coordinate = coordinates.find((c) => c.id === coordinateId);
      if (!coordinate) {
        toast.error('❌ Photo introuvable');
        return;
      }

      const relatedDisputes = disputes.filter((d) => d.property_id === coordinate.property_id);
      const geoTagged = hasGpsCoords(coordinate);

      const report = `RAPPORT GPS DÉTAILLÉ
===================
Généré le: ${new Date().toLocaleString('fr-FR')}
Propriété: ${coordinate.property?.title || coordinate.property?.name || 'Sans titre'}

COORDONNÉES GPS
--------------
${geoTagged ? `Latitude: ${coordinate.gps_latitude.toFixed(6)}°
Longitude: ${coordinate.gps_longitude.toFixed(6)}°` : 'Aucune coordonnée GPS enregistrée pour cette photo'}
Localisation déclarée: ${coordinate.property?.location || 'Non renseignée'}

QUALITÉ PHOTO
-------------
Score qualité: ${coordinate.quality_score != null ? coordinate.quality_score : 'N/A'}
Photo principale: ${coordinate.is_primary ? 'Oui' : 'Non'}
Date ajout: ${new Date(coordinate.created_at).toLocaleString('fr-FR')}

SURFACE
-------
Surface déclarée: ${coordinate.property?.surface ? Number(coordinate.property.surface).toLocaleString('fr-FR') + ' m²' : 'N/A'}

LITIGES
-------
Litiges enregistrés: ${relatedDisputes.length}
${relatedDisputes.length > 0 ? relatedDisputes.map((d) => `  - ${d.title} (${d.status})`).join('\n') : 'Aucun'}

LIENS EXTERNES
-------------
${geoTagged ? `Google Maps: https://maps.google.com/?q=${coordinate.gps_latitude},${coordinate.gps_longitude}
Vue satellite: https://maps.google.com/?q=${coordinate.gps_latitude},${coordinate.gps_longitude}&t=k&z=18` : 'Non disponible (pas de coordonnées GPS)'}

---
Rapport généré par Teranga Foncier
`;

      // Télécharger rapport
      const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-gps-${(coordinate.property?.title || 'propriete').replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('📄 Rapport GPS généré et téléchargé');
    } catch (error) {
      console.error('Erreur génération rapport:', error);
      toast.error('❌ Erreur lors de la génération du rapport');
    }
  };

  // Filtrer coordonnées (photos)
  const filteredCoordinates = coordinates.filter(coord => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      coord.property?.title?.toLowerCase().includes(searchLower) ||
      coord.property?.name?.toLowerCase().includes(searchLower) ||
      coord.property?.location?.toLowerCase().includes(searchLower)
    );
  });

  // Obtenir couleur status
  const getStatusColor = (verified) => {
    return verified
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  // Obtenir couleur qualité (quality_score : plus haut = meilleur)
  const getQualityColor = (score) => {
    if (score == null) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données GPS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec statistiques GPS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4 text-center">
              <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{stats.totalProperties}</div>
              <div className="text-sm text-gray-600">Propriétés totales</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{stats.gpsVerified}</div>
              <div className="text-sm text-gray-600">Photos géolocalisées</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingVerification}</div>
              <div className="text-sm text-gray-600">Photos sans GPS</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{stats.conflicts}</div>
              <div className="text-sm text-gray-600">Litiges ouverts</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4 text-center">
              <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{stats.averageAccuracy}</div>
              <div className="text-sm text-gray-600">Qualité photo moyenne</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Onglets de fonctionnalités GPS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <Eye className="w-4 h-4 mr-2" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="verification">
            <Crosshair className="w-4 h-4 mr-2" />
            Vérification
          </TabsTrigger>
          <TabsTrigger value="mapping">
            <Map className="w-4 h-4 mr-2" />
            Cartographie
          </TabsTrigger>
          <TabsTrigger value="cadastre">
            <Layers className="w-4 h-4 mr-2" />
            Cadastre
          </TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          {/* Barre de recherche */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par titre ou localisation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={handleExportKML}
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter KML
                </Button>
                <label htmlFor="kml-import">
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Importer KML
                    </span>
                  </Button>
                </label>
                <input
                  id="kml-import"
                  type="file"
                  accept=".kml,.kmz"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleImportKML(e.target.files[0]);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Liste des coordonnées GPS */}
          <div className="space-y-4">
            {filteredCoordinates.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {searchTerm ? 'Aucun résultat' : 'Aucune photo de terrain'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm
                      ? 'Aucune photo ne correspond à votre recherche'
                      : 'Ajoutez des photos à vos propriétés pour commencer le suivi GPS'
                    }
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setActiveTab('verification')}>
                      <Navigation className="w-4 h-4 mr-2" />
                      Géolocaliser une propriété
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredCoordinates.map((coord, index) => (
                <motion.div
                  key={coord.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">
                              {coord.property?.title || coord.property?.name || 'Propriété sans titre'}
                            </h3>
                            <Badge className={getStatusColor(hasGpsCoords(coord))}>
                              {hasGpsCoords(coord) ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Géolocalisée
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 mr-1" />
                                  Sans GPS
                                </>
                              )}
                            </Badge>
                            {coord.is_primary && (
                              <Badge className="bg-blue-100 text-blue-700">
                                <Shield className="w-3 h-3 mr-1" />
                                Photo principale
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-1">
                            📍 {coord.property?.location || 'Localisation non renseignée'}
                          </p>
                        </div>

                        {coord.quality_score != null && (
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getQualityColor(coord.quality_score)}`}>
                              {coord.quality_score}
                            </div>
                            <div className="text-xs text-gray-500">Qualité photo</div>
                          </div>
                        )}
                      </div>

                      {/* Coordonnées GPS */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Navigation className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Coordonnées GPS</span>
                        </div>
                        {hasGpsCoords(coord) ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600">Latitude:</span>
                              <div className="font-mono font-medium text-blue-700">
                                {coord.gps_latitude.toFixed(6)}°
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Longitude:</span>
                              <div className="font-mono font-medium text-blue-700">
                                {coord.gps_longitude.toFixed(6)}°
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Aucune coordonnée GPS enregistrée pour cette photo</p>
                        )}
                      </div>

                      {/* Informations */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-500">Photo principale:</span>
                          <div className="font-medium">{coord.is_primary ? 'Oui' : 'Non'}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Ajoutée le:</span>
                          <div className="font-medium">
                            {new Date(coord.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>

                      {/* Surface déclarée */}
                      {coord.property?.surface && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Layers className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-green-800">Surface déclarée</span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-700">
                                {Number(coord.property.surface).toLocaleString('fr-FR')} m²
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        {!hasGpsCoords(coord) && (
                          <Button
                            size="sm"
                            onClick={() => handleGeolocatePhoto(coord.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Géolocaliser
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShowOnMap(coord)}
                        >
                          <Map className="w-4 h-4 mr-2" />
                          Voir sur carte
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShowOnMap(coord)}
                        >
                          <Satellite className="w-4 h-4 mr-2" />
                          Images satellite
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateReport(coord.id)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Rapport GPS
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Vérification GPS */}
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
              {/* Sélecteur de propriété */}
              {properties.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Sélectionner une propriété
                  </label>
                  <select
                    id="property-select"
                    className="w-full p-2 border rounded-lg"
                    defaultValue=""
                  >
                    <option value="" disabled>Choisir une propriété...</option>
                    {properties.map(prop => (
                      <option key={prop.id} value={prop.id}>
                        {prop.title} - {prop.location}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4 border-2 border-blue-200 bg-blue-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <Navigation className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Géolocalisation Précise</h4>
                      <p className="text-sm text-gray-600">Coordonnées exactes</p>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      const select = document.getElementById('property-select');
                      const propertyId = select?.value;
                      if (propertyId) {
                        handleLocateProperty(propertyId);
                      } else {
                        toast.warning('⚠️ Veuillez sélectionner une propriété');
                      }
                    }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Localiser propriété
                  </Button>
                </Card>

                <Card className="p-4 border-2 border-green-200 bg-green-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-600 p-2 rounded-lg">
                      <Layers className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Limites Cadastrales</h4>
                      <p className="text-sm text-gray-600">Surface déclarée</p>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      if (coordinates.length > 0) {
                        handleCheckBoundaries(coordinates[0].id);
                      } else {
                        toast.warning('⚠️ Aucune coordonnée disponible');
                      }
                    }}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Vérifier limites
                  </Button>
                </Card>

                <Card className="p-4 border-2 border-purple-200 bg-purple-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-600 p-2 rounded-lg">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Détection Litiges</h4>
                      <p className="text-sm text-gray-600">Litiges enregistrés</p>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => {
                      if (coordinates.length > 0) {
                        handleAnalyzeConflicts(coordinates[0].id);
                      } else {
                        toast.warning('⚠️ Aucune coordonnée disponible');
                      }
                    }}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Analyser litiges
                  </Button>
                </Card>

                <Card className="p-4 border-2 border-orange-200 bg-orange-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-orange-600 p-2 rounded-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Géolocalisation Express</h4>
                      <p className="text-sm text-gray-600">Position GPS rapide</p>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    onClick={() => {
                      const select = document.getElementById('property-select');
                      const propertyId = select?.value;
                      if (propertyId) {
                        handleLocateProperty(propertyId);
                      } else {
                        toast.warning('⚠️ Veuillez sélectionner une propriété');
                      }
                    }}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Localiser maintenant
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cartographie */}
        <TabsContent value="mapping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5" />
                Cartographie Interactive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-12 text-center border-2 border-dashed border-blue-300">
                <Map className="w-24 h-24 text-blue-400 mx-auto mb-4" />
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
                    Activer calques
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cadastre */}
        <TabsContent value="cadastre" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Satellite className="w-5 h-5" />
                Analyse Cadastrale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <Satellite className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Vue Satellite</h4>
                  <p className="text-sm text-gray-600">Images haute résolution</p>
                </Card>

                <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <Layers className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Analyse Couches</h4>
                  <p className="text-sm text-gray-600">Superposition cadastrale</p>
                </Card>

                <Card className="p-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <Activity className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Détection Litiges</h4>
                  <p className="text-sm text-gray-600">Bientôt disponible</p>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendeurGPSRealData;

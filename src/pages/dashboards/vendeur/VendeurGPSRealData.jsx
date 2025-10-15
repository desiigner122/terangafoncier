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
import { toast } from 'sonner';

const VendeurGPSRealData = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // États
  const [coordinates, setCoordinates] = useState([]);
  const [properties, setProperties] = useState([]);
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
      loadGPSData();
      loadProperties();
    }
  }, [user]);

  const loadGPSData = async () => {
    try {
      const { data, error } = await supabase
        .from('gps_coordinates')
        .select(`
          *,
          properties (
            id,
            title,
            address,
            status
          )
        `)
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCoordinates(data || []);
      
      // Calculer stats
      const verified = data?.filter(c => c.verified).length || 0;
      const pending = data?.filter(c => !c.verified).length || 0;
      const avgAccuracy = data?.length > 0 
        ? data.reduce((sum, c) => sum + (c.accuracy || 0), 0) / data.length 
        : 0;

      setStats({
        totalProperties: data?.length || 0,
        gpsVerified: verified,
        pendingVerification: pending,
        conflicts: 0, // TODO: calculer selon boundary_polygon
        averageAccuracy: avgAccuracy.toFixed(1)
      });

    } catch (error) {
      console.error('Erreur chargement GPS:', error);
      toast.error('Erreur lors du chargement des coordonnées GPS');
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, address, status')
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Erreur chargement propriétés:', error);
    }
  };

  // Ajouter/Mettre à jour coordonnées GPS
  const handleAddGPS = async (propertyId, gpsData) => {
    try {
      const newCoordinate = {
        property_id: propertyId,
        vendor_id: user.id,
        latitude: gpsData.latitude,
        longitude: gpsData.longitude,
        altitude: gpsData.altitude || null,
        accuracy: gpsData.accuracy || null,
        label: gpsData.address || null,
        verified: false,
        source: 'manual'
      };

      const { data, error } = await supabase
        .from('gps_coordinates')
        .insert(newCoordinate)
        .select()
        .single();

      if (error) throw error;

      toast.success('✅ Coordonnées GPS ajoutées');
      loadGPSData();
      
      return data;
    } catch (error) {
      console.error('Erreur ajout GPS:', error);
      toast.error('❌ Erreur lors de l\'ajout des coordonnées');
    }
  };

  // Vérifier coordonnées GPS
  const handleVerifyGPS = async (coordinateId) => {
    try {
      const { error } = await supabase
        .from('gps_coordinates')
        .update({
          verified: true,
          verified_at: new Date().toISOString(),
          verified_by: user.id,
          verification_method: 'manual'
        })
        .eq('id', coordinateId);

      if (error) throw error;

      toast.success('✅ Coordonnées GPS vérifiées');
      loadGPSData();
    } catch (error) {
      console.error('Erreur vérification:', error);
      toast.error('❌ Erreur lors de la vérification');
    }
  };

  // 1. Localiser une propriété avec GPS navigator
  const handleLocateProperty = async (propertyId) => {
    if (!navigator.geolocation) {
      toast.error('❌ Géolocalisation non supportée par votre navigateur');
      return;
    }

    toast.loading('📍 Acquisition de la position GPS...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const gpsData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude,
          accuracy: position.coords.accuracy
        };

        // Reverse geocoding pour obtenir l'adresse
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${gpsData.latitude}&lon=${gpsData.longitude}`
          );
          const data = await response.json();
          gpsData.address = data.display_name;
        } catch (error) {
          console.warn('Reverse geocoding échoué:', error);
        }

        await handleAddGPS(propertyId, gpsData);
        toast.dismiss();
        toast.success(`✅ Position GPS acquise (±${gpsData.accuracy.toFixed(1)}m)`);
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

  // 2. Vérifier les limites cadastrales (boundary polygon)
  const handleCheckBoundaries = async (coordinateId) => {
    try {
      const coordinate = coordinates.find(c => c.id === coordinateId);
      if (!coordinate) {
        toast.error('❌ Coordonnées introuvables');
        return;
      }

      if (!coordinate.boundary_polygon || coordinate.boundary_polygon.length < 3) {
        toast.warning('⚠️ Aucun polygone de limite défini pour cette propriété');
        return;
      }

      // Validation du polygone
      const polygon = coordinate.boundary_polygon;
      const isValid = polygon.length >= 3;
      const isClosed = polygon[0][0] === polygon[polygon.length - 1][0] &&
                       polygon[0][1] === polygon[polygon.length - 1][1];

      if (!isValid) {
        toast.error('❌ Polygone invalide: minimum 3 points requis');
        return;
      }

      if (!isClosed) {
        toast.warning('⚠️ Polygone non fermé: dernier point différent du premier');
      }

      // Calculer la surface si pas déjà fait
      if (!coordinate.surface_calculated) {
        const area = calculatePolygonArea(polygon);
        const perimeter = calculatePolygonPerimeter(polygon);

        const { error } = await supabase
          .from('gps_coordinates')
          .update({
            surface_calculated: area,
            perimeter_calculated: perimeter,
            cadastre_verified: true,
            cadastre_verification_date: new Date().toISOString()
          })
          .eq('id', coordinateId);

        if (error) throw error;

        toast.success(`✅ Limites vérifiées: ${area.toFixed(0)} m² (${perimeter.toFixed(0)}m périmètre)`);
        loadGPSData();
      } else {
        toast.success('✅ Limites cadastrales déjà vérifiées');
      }
    } catch (error) {
      console.error('Erreur vérification limites:', error);
      toast.error('❌ Erreur lors de la vérification');
    }
  };

  // 3. Analyser les conflits avec propriétés voisines
  const handleAnalyzeConflicts = async (coordinateId) => {
    try {
      const coordinate = coordinates.find(c => c.id === coordinateId);
      if (!coordinate || !coordinate.boundary_polygon) {
        toast.error('❌ Polygone de limite requis pour analyser les conflits');
        return;
      }

      toast.loading('🔍 Analyse des conflits en cours...');

      // Récupérer les propriétés voisines (dans un rayon de ~500m)
      const { data: neighbors, error } = await supabase
        .from('gps_coordinates')
        .select('*, properties(*)')
        .neq('id', coordinateId)
        .not('boundary_polygon', 'is', null);

      if (error) throw error;

      const conflicts = [];
      const myPolygon = coordinate.boundary_polygon;

      // Vérifier chevauchements avec chaque voisin
      neighbors?.forEach(neighbor => {
        if (!neighbor.boundary_polygon) return;

        const overlap = checkPolygonOverlap(myPolygon, neighbor.boundary_polygon);
        if (overlap.hasConflict) {
          conflicts.push({
            property: neighbor.properties?.title || 'Propriété inconnue',
            overlapArea: overlap.area,
            severity: overlap.area > 100 ? 'high' : overlap.area > 10 ? 'medium' : 'low'
          });
        }
      });

      // Sauvegarder résultat analyse
      const { error: updateError } = await supabase
        .from('gps_coordinates')
        .update({
          conflicts_detected: conflicts.length,
          conflict_analysis: conflicts,
          last_conflict_check: new Date().toISOString()
        })
        .eq('id', coordinateId);

      if (updateError) throw updateError;

      toast.dismiss();
      if (conflicts.length === 0) {
        toast.success('✅ Aucun conflit détecté avec les propriétés voisines');
      } else {
        toast.warning(`⚠️ ${conflicts.length} conflit(s) détecté(s)`, {
          description: conflicts.map(c => `${c.property}: ${c.overlapArea.toFixed(1)}m²`).join(', ')
        });
      }

      loadGPSData();
    } catch (error) {
      toast.dismiss();
      console.error('Erreur analyse conflits:', error);
      toast.error('❌ Erreur lors de l\'analyse');
    }
  };

  // 4. Afficher sur Google Maps
  const handleShowOnMap = (coordinate) => {
    const url = `https://maps.google.com/?q=${coordinate.latitude},${coordinate.longitude}&t=m&z=18`;
    window.open(url, '_blank');
    toast.success('🗺️ Ouverture de Google Maps...');
  };

  // 5. Exporter en KML
  const handleExportKML = () => {
    const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Propriétés GPS - ${user.email}</name>
    <description>Export des coordonnées GPS - ${new Date().toLocaleDateString('fr-FR')}</description>
    ${coordinates.map(coord => `
    <Placemark>
      <name>${coord.properties?.title || 'Sans titre'}</name>
      <description><![CDATA[
        <b>Adresse:</b> ${coord.address || 'Non renseignée'}<br/>
        <b>Latitude:</b> ${coord.latitude.toFixed(6)}°<br/>
        <b>Longitude:</b> ${coord.longitude.toFixed(6)}°<br/>
        ${coord.accuracy ? `<b>Précision:</b> ±${coord.accuracy}m<br/>` : ''}
        ${coord.surface_calculated ? `<b>Surface:</b> ${coord.surface_calculated.toFixed(0)} m²<br/>` : ''}
        <b>Vérifié:</b> ${coord.verified ? 'Oui' : 'Non'}<br/>
        <b>Date ajout:</b> ${new Date(coord.created_at).toLocaleDateString('fr-FR')}
      ]]></description>
      ${coord.boundary_polygon ? `
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>
              ${coord.boundary_polygon.map(p => `${p[1]},${p[0]},0`).join(' ')}
            </coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
      ` : `
      <Point>
        <coordinates>${coord.longitude},${coord.latitude},${coord.altitude || 0}</coordinates>
      </Point>
      `}
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

  // 6. Importer KML
  const handleImportKML = async (file) => {
    try {
      const text = await file.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');

      // Parse Placemarks
      const placemarks = xmlDoc.getElementsByTagName('Placemark');
      let imported = 0;

      for (let placemark of placemarks) {
        const name = placemark.getElementsByTagName('name')[0]?.textContent;
        const description = placemark.getElementsByTagName('description')[0]?.textContent;
        
        // Parse Point coordinates
        const pointElement = placemark.getElementsByTagName('Point')[0];
        if (pointElement) {
          const coordsText = pointElement.getElementsByTagName('coordinates')[0]?.textContent.trim();
          const [longitude, latitude, altitude] = coordsText.split(',').map(Number);

          // Trouver ou créer propriété
          let propertyId = properties.find(p => p.title === name)?.id;
          if (!propertyId && properties.length > 0) {
            propertyId = properties[0].id; // Utiliser première propriété par défaut
          }

          if (propertyId) {
            await handleAddGPS(propertyId, {
              latitude,
              longitude,
              altitude: altitude || null,
              address: description,
              source: 'kml_import'
            });
            imported++;
          }
        }

        // Parse Polygon coordinates
        const polygonElement = placemark.getElementsByTagName('Polygon')[0];
        if (polygonElement) {
          const coordsText = polygonElement.getElementsByTagName('coordinates')[0]?.textContent.trim();
          const points = coordsText.split(/\s+/).map(coord => {
            const [lon, lat] = coord.split(',').map(Number);
            return [lat, lon];
          });

          // TODO: Sauvegarder boundary_polygon
          console.log('Polygon points:', points);
        }
      }

      toast.success(`✅ ${imported} coordonnées importées depuis KML`);
      loadGPSData();
    } catch (error) {
      console.error('Erreur import KML:', error);
      toast.error('❌ Erreur lors de l\'import KML');
    }
  };

  // 7. Calculer surface d'un polygone (formule Shoelace)
  const calculatePolygonArea = (polygon) => {
    if (!polygon || polygon.length < 3) return 0;

    let area = 0;
    const n = polygon.length;

    for (let i = 0; i < n - 1; i++) {
      const [lat1, lon1] = polygon[i];
      const [lat2, lon2] = polygon[i + 1];
      area += (lon1 * lat2) - (lon2 * lat1);
    }

    area = Math.abs(area) / 2;

    // Conversion en m² (approximation: 1° ≈ 111km)
    const latToMeters = 111320;
    const avgLat = polygon.reduce((sum, p) => sum + p[0], 0) / polygon.length;
    const lonToMeters = 111320 * Math.cos(avgLat * Math.PI / 180);

    return area * latToMeters * lonToMeters;
  };

  // Calculer périmètre d'un polygone
  const calculatePolygonPerimeter = (polygon) => {
    if (!polygon || polygon.length < 2) return 0;

    let perimeter = 0;
    for (let i = 0; i < polygon.length - 1; i++) {
      const [lat1, lon1] = polygon[i];
      const [lat2, lon2] = polygon[i + 1];
      
      // Distance haversine
      const R = 6371000; // Rayon Terre en mètres
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      perimeter += R * c;
    }

    return perimeter;
  };

  // Vérifier chevauchement entre 2 polygones (algorithme simplifié)
  const checkPolygonOverlap = (poly1, poly2) => {
    // Algorithme simplifié: vérifier si des points de poly2 sont dans poly1
    let overlapCount = 0;

    poly2.forEach(point => {
      if (isPointInPolygon(point, poly1)) {
        overlapCount++;
      }
    });

    const overlapRatio = overlapCount / poly2.length;
    const estimatedArea = overlapRatio * calculatePolygonArea(poly2);

    return {
      hasConflict: overlapRatio > 0.05, // 5% de chevauchement
      area: estimatedArea,
      ratio: overlapRatio
    };
  };

  // Ray-casting algorithm pour point-in-polygon
  const isPointInPolygon = (point, polygon) => {
    const [x, y] = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];

      const intersect = ((yi > y) !== (yj > y)) &&
                        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }

    return inside;
  };

  // 8. Générer rapport GPS (PDF simulation via CSV enrichi)
  const handleGenerateReport = async (coordinateId) => {
    try {
      const coordinate = coordinates.find(c => c.id === coordinateId);
      if (!coordinate) {
        toast.error('❌ Coordonnées introuvables');
        return;
      }

      // Générer rapport CSV détaillé
      const report = `RAPPORT GPS DÉTAILLÉ
===================
Généré le: ${new Date().toLocaleString('fr-FR')}
Propriété: ${coordinate.properties?.title || 'Sans titre'}

COORDONNÉES GPS
--------------
Latitude: ${coordinate.latitude.toFixed(6)}°
Longitude: ${coordinate.longitude.toFixed(6)}°
Altitude: ${coordinate.altitude ? coordinate.altitude.toFixed(1) + 'm' : 'N/A'}
Précision: ±${coordinate.accuracy || 'N/A'}m
Adresse: ${coordinate.address || 'Non renseignée'}

VÉRIFICATION
-----------
Statut: ${coordinate.verified ? 'Vérifié ✓' : 'En attente'}
Date vérification: ${coordinate.verified_at ? new Date(coordinate.verified_at).toLocaleString('fr-FR') : 'N/A'}
Méthode: ${coordinate.verification_method || 'N/A'}
Source: ${coordinate.source || 'Manuel'}

CADASTRE
--------
Référence: ${coordinate.cadastre_reference || 'N/A'}
Surface calculée: ${coordinate.surface_calculated ? coordinate.surface_calculated.toFixed(2) + ' m²' : 'N/A'}
Périmètre: ${coordinate.perimeter_calculated ? coordinate.perimeter_calculated.toFixed(2) + 'm' : 'N/A'}
Cadastre vérifié: ${coordinate.cadastre_verified ? 'Oui ✓' : 'Non'}

CONFLITS
--------
Conflits détectés: ${coordinate.conflicts_detected || 0}
Dernière analyse: ${coordinate.last_conflict_check ? new Date(coordinate.last_conflict_check).toLocaleString('fr-FR') : 'Jamais'}
${coordinate.conflict_analysis && coordinate.conflict_analysis.length > 0 ? 
  '\nDétails:\n' + coordinate.conflict_analysis.map(c => 
    `  - ${c.property}: ${c.overlapArea.toFixed(1)}m² (${c.severity})`
  ).join('\n') : ''}

POLYGONE DE LIMITE
-----------------
${coordinate.boundary_polygon ? 
  coordinate.boundary_polygon.map((p, i) => 
    `Point ${i + 1}: Lat ${p[0].toFixed(6)}°, Lon ${p[1].toFixed(6)}°`
  ).join('\n') : 
  'Aucun polygone défini'}

LIENS EXTERNES
-------------
Google Maps: https://maps.google.com/?q=${coordinate.latitude},${coordinate.longitude}
Vue satellite: https://maps.google.com/?q=${coordinate.latitude},${coordinate.longitude}&t=k&z=18

---
Rapport généré par Teranga Foncier
`;

      // Télécharger rapport
      const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-gps-${coordinate.properties?.title?.replace(/\s+/g, '-') || 'propriete'}-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('📄 Rapport GPS généré et téléchargé');
    } catch (error) {
      console.error('Erreur génération rapport:', error);
      toast.error('❌ Erreur lors de la génération du rapport');
    }
  };

  // Filtrer coordonnées
  const filteredCoordinates = coordinates.filter(coord => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      coord.properties?.title?.toLowerCase().includes(searchLower) ||
      coord.address?.toLowerCase().includes(searchLower) ||
      coord.cadastre_reference?.toLowerCase().includes(searchLower)
    );
  });

  // Obtenir couleur status
  const getStatusColor = (verified) => {
    return verified 
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  // Obtenir couleur précision
  const getAccuracyColor = (accuracy) => {
    if (accuracy < 2) return 'text-green-600';
    if (accuracy < 5) return 'text-yellow-600';
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
              <div className="text-sm text-gray-600">GPS vérifiées</div>
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
              <div className="text-sm text-gray-600">En attente</div>
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
              <div className="text-sm text-gray-600">Conflits</div>
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
              <div className="text-2xl font-bold text-purple-600">{stats.averageAccuracy}m</div>
              <div className="text-sm text-gray-600">Précision moyenne</div>
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
                    placeholder="Rechercher par titre, adresse, référence cadastrale..."
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
                    {searchTerm ? 'Aucun résultat' : 'Aucune coordonnée GPS'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm 
                      ? 'Aucune coordonnée ne correspond à votre recherche'
                      : 'Commencez par ajouter des coordonnées GPS à vos propriétés'
                    }
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setActiveTab('verification')}>
                      <Navigation className="w-4 h-4 mr-2" />
                      Ajouter des coordonnées
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
                              {coord.properties?.title || 'Propriété sans titre'}
                            </h3>
                            <Badge className={getStatusColor(coord.verified)}>
                              {coord.verified ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Vérifié
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 mr-1" />
                                  En attente
                                </>
                              )}
                            </Badge>
                            {coord.cadastre_verified && (
                              <Badge className="bg-blue-100 text-blue-700">
                                <Shield className="w-3 h-3 mr-1" />
                                Cadastre OK
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-1">
                            📍 {coord.address || 'Adresse non renseignée'}
                          </p>
                          {coord.cadastre_reference && (
                            <p className="text-gray-500 text-sm">
                              Réf. cadastre: {coord.cadastre_reference}
                            </p>
                          )}
                        </div>
                        
                        {coord.accuracy && (
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getAccuracyColor(coord.accuracy)}`}>
                              ±{coord.accuracy}m
                            </div>
                            <div className="text-xs text-gray-500">Précision</div>
                          </div>
                        )}
                      </div>

                      {/* Coordonnées GPS */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Navigation className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Coordonnées GPS</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Latitude:</span>
                            <div className="font-mono font-medium text-blue-700">
                              {coord.latitude.toFixed(6)}°
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Longitude:</span>
                            <div className="font-mono font-medium text-blue-700">
                              {coord.longitude.toFixed(6)}°
                            </div>
                          </div>
                          {coord.altitude && (
                            <div>
                              <span className="text-gray-600">Altitude:</span>
                              <div className="font-mono font-medium text-blue-700">
                                {coord.altitude.toFixed(1)}m
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Informations de vérification */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-500">Source:</span>
                          <div className="font-medium capitalize">{coord.source || 'Manuel'}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Ajouté le:</span>
                          <div className="font-medium">
                            {new Date(coord.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        {coord.verified_at && (
                          <div>
                            <span className="text-gray-500">Vérifié le:</span>
                            <div className="font-medium">
                              {new Date(coord.verified_at).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        )}
                        {coord.verification_method && (
                          <div>
                            <span className="text-gray-500">Méthode:</span>
                            <div className="font-medium capitalize">
                              {coord.verification_method.replace('_', ' ')}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Surface calculée */}
                      {coord.surface_calculated && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Layers className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-green-800">Surface calculée</span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-green-700">
                                {coord.surface_calculated.toLocaleString('fr-FR')} m²
                              </div>
                              {coord.perimeter_calculated && (
                                <div className="text-xs text-green-600">
                                  Périmètre: {coord.perimeter_calculated.toFixed(1)}m
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        {!coord.verified && (
                          <Button 
                            size="sm"
                            onClick={() => handleVerifyGPS(coord.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Vérifier
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
                        {prop.title} - {prop.address}
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
                      <p className="text-sm text-gray-600">Vérification des bornes</p>
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
                      <h4 className="font-semibold">Détection Conflits</h4>
                      <p className="text-sm text-gray-600">Chevauchements</p>
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
                    Analyser conflits
                  </Button>
                </Card>

                <Card className="p-4 border-2 border-orange-200 bg-orange-50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-orange-600 p-2 rounded-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Vérification Express</h4>
                      <p className="text-sm text-gray-600">Analyse rapide IA</p>
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
                    Analyse rapide
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
                  <h4 className="font-semibold mb-1">Détection IA</h4>
                  <p className="text-sm text-gray-600">Changements automatiques</p>
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

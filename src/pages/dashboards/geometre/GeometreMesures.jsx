import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Ruler,
  Plus,
  Search,
  Download,
  Upload,
  Calculator,
  Compass,
  Map,
  Grid3X3,
  Target,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  Eye,
  FileText,
  Camera,
  Navigation,
  Layers,
  Building,
  Satellite,
  Settings,
  Share,
  Copy,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Normalise une ligne field_measurements (data jsonb) en objet d'affichage.
// Aucune valeur inventée : tout provient du jsonb `data` ou reste "—".
const mapMeasurement = (row) => {
  const d = (row && typeof row.data === 'object' && row.data) ? row.data : {};

  let coordinates = null;
  if (typeof d?.coordinates?.lat === 'number' && typeof d?.coordinates?.lng === 'number') {
    coordinates = { lat: d.coordinates.lat, lng: d.coordinates.lng };
  } else if (typeof d.latitude === 'number' && typeof d.longitude === 'number') {
    coordinates = { lat: d.latitude, lng: d.longitude };
  }

  return {
    id: row.id,
    property_id: row.property_id || null,
    created_at: row.created_at || null,
    title: d.title || d.name || 'Relevé de terrain',
    type: d.type || d.mission_type || 'autre',
    status: d.status || 'complete',
    date: row.created_at ? new Date(row.created_at).toLocaleDateString('fr-FR') : '—',
    location: d.location || '—',
    superficie: d.superficie || d.surface || '—',
    precision: d.precision || '—',
    points: typeof d.points === 'number' ? d.points : null,
    client: d.client || d.client_name || '—',
    coordinates,
    equipment: d.equipment || '—',
    operator: d.operator || '—',
    temperature: d.temperature || '—',
    humidity: d.humidity || '—',
    results: (d.results && typeof d.results === 'object') ? d.results : {}
  };
};

const GeometreMesures = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('tous');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [mesures, setMesures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMesures = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('field_measurements')
          .select('*')
          .eq('geometre_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMesures((data || []).map(mapMeasurement));
      } catch (err) {
        console.error('Erreur chargement mesures:', err);
        setMesures([]);
      } finally {
        setLoading(false);
      }
    };

    loadMesures();
  }, [user?.id]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'gps': return Satellite;
      case 'station_totale': return Compass;
      case 'nivellement': return Ruler;
      case 'drone': return Camera;
      case 'polygonation': return Grid3X3;
      case 'architectural': return Building;
      default: return Target;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete':
      case 'completed': return 'bg-green-100 text-green-800';
      case 'en_cours':
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'planifie':
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'erreur':
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'complete':
      case 'completed': return 'Terminé';
      case 'en_cours':
      case 'in_progress': return 'En cours';
      case 'planifie':
      case 'pending': return 'Planifié';
      case 'erreur':
      case 'cancelled': return 'Erreur';
      default: return status;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'gps': return 'GPS/GNSS';
      case 'station_totale': return 'Station Totale';
      case 'nivellement': return 'Nivellement';
      case 'drone': return 'Drone/UAV';
      case 'polygonation': return 'Polygonation';
      case 'architectural': return 'Architectural';
      default: return type;
    }
  };

  const isComplete = (s) => s === 'complete' || s === 'completed';
  const isInProgress = (s) => s === 'en_cours' || s === 'in_progress';

  const filteredMesures = mesures.filter(mesure => {
    const matchesSearch = mesure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mesure.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mesure.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'tous' || mesure.type === typeFilter;
    const matchesStatus = statusFilter === 'tous' ||
                          mesure.status === statusFilter ||
                          (statusFilter === 'complete' && isComplete(mesure.status)) ||
                          (statusFilter === 'en_cours' && isInProgress(mesure.status));

    return matchesSearch && matchesType && matchesStatus;
  });

  // Statistiques dérivées des données réelles (jamais fabriquées)
  const totalPoints = mesures.reduce((sum, m) => sum + (m.points || 0), 0);
  const stats = [
    {
      title: 'Total Mesures',
      value: mesures.length,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'En Cours',
      value: mesures.filter(m => isInProgress(m.status)).length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Terminées',
      value: mesures.filter(m => isComplete(m.status)).length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Points Relevés',
      value: totalPoints > 0 ? totalPoints.toLocaleString('fr-FR') : '—',
      icon: Map,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  // Types réellement présents dans les données (pour l'analytique)
  const presentTypes = Array.from(new Set(mesures.map(m => m.type)));

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
          <h1 className="text-3xl font-bold text-gray-900">Relevés & Mesures</h1>
          <p className="text-gray-600 mt-1">Données topographiques et géodésiques</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Mesure
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
                  placeholder="Rechercher par titre, client ou localisation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type de mesure" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous types</SelectItem>
                <SelectItem value="gps">GPS/GNSS</SelectItem>
                <SelectItem value="station_totale">Station Totale</SelectItem>
                <SelectItem value="nivellement">Nivellement</SelectItem>
                <SelectItem value="drone">Drone/UAV</SelectItem>
                <SelectItem value="polygonation">Polygonation</SelectItem>
                <SelectItem value="architectural">Architectural</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous statuts</SelectItem>
                <SelectItem value="complete">Terminé</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="planifie">Planifié</SelectItem>
                <SelectItem value="erreur">Erreur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mesures Tabs */}
      <Tabs defaultValue="liste" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="liste">Liste Détaillée</TabsTrigger>
          <TabsTrigger value="carte">Vue Carte</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="outils">Outils Calcul</TabsTrigger>
        </TabsList>

        <TabsContent value="liste" className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredMesures.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Ruler className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune mesure</h3>
                <p className="text-gray-500">
                  {mesures.length === 0
                    ? "Aucun relevé de terrain enregistré pour le moment."
                    : "Aucune mesure ne correspond à vos critères de recherche."}
                </p>
              </CardContent>
            </Card>
          ) : (
          <div className="space-y-4">
            {filteredMesures.map((mesure, index) => {
              const TypeIcon = getTypeIcon(mesure.type);
              const resultEntries = Object.entries(mesure.results).slice(0, 3);

              return (
                <motion.div
                  key={mesure.id}
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
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {mesure.title}
                            </h3>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-3 w-3" />
                                {mesure.location}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="h-3 w-3" />
                                {mesure.date}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Map className="h-3 w-3" />
                                {mesure.superficie}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Target className="h-3 w-3" />
                                {mesure.points !== null ? `${mesure.points} points` : '— points'}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">Informations Technique</h4>
                                <div className="text-xs text-gray-600 space-y-1">
                                  <div>Équipement: {mesure.equipment}</div>
                                  <div>Précision: {mesure.precision}</div>
                                  <div>Opérateur: {mesure.operator}</div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">Conditions Météo</h4>
                                <div className="text-xs text-gray-600 space-y-1">
                                  <div>Température: {mesure.temperature}</div>
                                  <div>Humidité: {mesure.humidity}</div>
                                  <div>Client: {mesure.client}</div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">Résultats</h4>
                                <div className="text-xs text-gray-600 space-y-1">
                                  {resultEntries.length > 0 ? (
                                    resultEntries.map(([key, value]) => (
                                      <div key={key}>{key}: {String(value)}</div>
                                    ))
                                  ) : (
                                    <div className="text-gray-400">Aucun résultat</div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(mesure.status)}>
                              {getStatusText(mesure.status)}
                            </Badge>
                            <Badge variant="outline">
                              {getTypeText(mesure.type)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          {mesure.coordinates
                            ? `Coordonnées: ${mesure.coordinates.lat.toFixed(4)}°N, ${mesure.coordinates.lng.toFixed(4)}°W`
                            : 'Coordonnées: —'}
                        </div>

                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Visualiser
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            Rapport
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="h-4 w-4 mr-2" />
                            Dupliquer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          )}
        </TabsContent>

        <TabsContent value="carte" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="h-5 w-5 mr-2" />
                Localisation des Mesures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Navigation className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Carte Interactive
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Visualisation géographique des relevés avec coordonnées précises
                  </p>
                  <Button>
                    Ouvrir Carte Complète
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type</CardTitle>
              </CardHeader>
              <CardContent>
                {mesures.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4">Aucune donnée disponible.</p>
                ) : (
                  <div className="space-y-4">
                    {presentTypes.map((type) => {
                      const count = mesures.filter(m => m.type === type).length;
                      const percentage = (count / mesures.length * 100).toFixed(1);
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
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Précision par Type</CardTitle>
              </CardHeader>
              <CardContent>
                {mesures.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4">Aucune donnée disponible.</p>
                ) : (
                  <div className="space-y-3">
                    {presentTypes.map((type) => {
                      // Précision réelle enregistrée pour ce type (première non vide)
                      const withPrecision = mesures.find(
                        m => m.type === type && m.precision && m.precision !== '—'
                      );
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm">{getTypeText(type)}</span>
                          <Badge variant="outline" className="bg-gray-50 text-gray-700">
                            {withPrecision ? withPrecision.precision : '—'}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="outils" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculateurs Géodésiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Calcul Coordonnées UTM
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Compass className="h-4 w-4 mr-2" />
                    Transformation Géodésique
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Ruler className="h-4 w-4 mr-2" />
                    Calcul Distance/Azimut
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Map className="h-4 w-4 mr-2" />
                    Calcul Surface Polygone
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Outils Export
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export DXF/DWG
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Export CSV/TXT
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share className="h-4 w-4 mr-2" />
                    Export KML/GPX
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Layers className="h-4 w-4 mr-2" />
                    Export Shapefile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default GeometreMesures;

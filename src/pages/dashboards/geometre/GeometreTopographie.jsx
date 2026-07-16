import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Plus,
  Search,
  Download,
  Upload,
  Eye,
  Edit,
  Share,
  Mountain,
  Navigation,
  Target,
  Map,
  MapPin,
  Ruler,
  Grid3X3,
  BarChart3,
  Settings,
  Camera,
  Zap,
  Maximize,
  Minimize,
  RotateCw,
  Move,
  Loader2,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const GeometreTopographie = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('tous');
  const [dataFilter, setDataFilter] = useState('tous');

  const [properties, setProperties] = useState([]);
  const [gpsPhotos, setGpsPhotos] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Topographie → sources réelles :
  //  - property_photos (gps_latitude / gps_longitude / quality_score) = points terrain géoréférencés
  //  - field_measurements (geometre_id) = relevés/mesures terrain
  //  - properties (surface, location, coordonnées) = contexte parcellaire
  useEffect(() => {
    const loadTopographie = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        // Mesures terrain du géomètre
        const { data: fm, error: fmError } = await supabase
          .from('field_measurements')
          .select('*')
          .eq('geometre_id', user.id)
          .order('created_at', { ascending: false });
        if (fmError) throw fmError;
        const fieldMeasurements = fm || [];

        // Parcelles gérées par le géomètre
        const { data: ownedProps, error: propError } = await supabase
          .from('properties')
          .select('*')
          .eq('owner_id', user.id);
        if (propError) throw propError;
        const owned = ownedProps || [];

        // Ensemble des parcelles référencées (possédées + issues des mesures)
        const allPropIds = [
          ...new Set([
            ...owned.map((p) => p.id),
            ...fieldMeasurements.map((m) => m.property_id)
          ].filter(Boolean))
        ];

        // Récupérer les parcelles référencées par les mesures mais non possédées
        let allProps = owned;
        const missingIds = allPropIds.filter((id) => !owned.some((p) => p.id === id));
        if (missingIds.length > 0) {
          const { data: extra } = await supabase
            .from('properties')
            .select('*')
            .in('id', missingIds);
          allProps = [...owned, ...(extra || [])];
        }

        // Photos géoréférencées (points GPS terrain) sur ces parcelles
        let photos = [];
        if (allPropIds.length > 0) {
          const { data: ph } = await supabase
            .from('property_photos')
            .select('*')
            .in('property_id', allPropIds);
          photos = (ph || []).filter(
            (p) => p.gps_latitude != null && p.gps_longitude != null
          );
        }

        setProperties(allProps);
        setMeasurements(fieldMeasurements);
        setGpsPhotos(photos);
      } catch (err) {
        console.error('Erreur chargement topographie:', err);
        setProperties([]);
        setMeasurements([]);
        setGpsPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    loadTopographie();
  }, [user?.id]);

  // ---- Helpers de formatage (aucune valeur fabriquée) ----
  const formatSurface = (value) => {
    if (value === null || value === undefined || value === '') return '—';
    const num = Number(value);
    if (Number.isNaN(num)) return '—';
    return `${num.toLocaleString('fr-FR')} m²`;
  };

  const formatDate = (value) => {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('fr-FR');
  };

  const propertyMap = React.useMemo(() => {
    const map = {};
    properties.forEach((p) => { map[p.id] = p; });
    return map;
  }, [properties]);

  // ---- Construction des « levés » à partir des vraies données ----
  // Un levé = une parcelle disposant de points GPS et/ou de mesures terrain.
  const leves = React.useMemo(() => {
    const leveIds = [
      ...new Set([
        ...gpsPhotos.map((p) => p.property_id),
        ...measurements.map((m) => m.property_id)
      ].filter(Boolean))
    ];

    return leveIds.map((pid) => {
      const prop = propertyMap[pid] || {};
      const propPhotos = gpsPhotos.filter((p) => p.property_id === pid);
      const propMeasures = measurements.filter((m) => m.property_id === pid);

      const qualityScores = propPhotos
        .map((p) => Number(p.quality_score))
        .filter((n) => !Number.isNaN(n));
      const avgQuality = qualityScores.length
        ? qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length
        : null;

      const dates = [
        ...propPhotos.map((p) => p.created_at),
        ...propMeasures.map((m) => m.created_at)
      ].filter(Boolean);
      const lastDate = dates.length ? dates.slice().sort().reverse()[0] : null;

      // Coordonnées réelles : celles de la parcelle, sinon moyenne des points GPS
      let lat = prop.latitude != null ? Number(prop.latitude) : null;
      let lng = prop.longitude != null ? Number(prop.longitude) : null;
      if ((lat == null || lng == null) && propPhotos.length > 0) {
        lat = propPhotos.reduce((s, p) => s + Number(p.gps_latitude), 0) / propPhotos.length;
        lng = propPhotos.reduce((s, p) => s + Number(p.gps_longitude), 0) / propPhotos.length;
      }

      return {
        id: pid,
        title: prop.title || prop.name || `Parcelle ${String(pid).slice(0, 8)}`,
        location: prop.location || [prop.city, prop.region].filter(Boolean).join(', ') || '—',
        region: prop.region || null,
        surface: prop.surface,
        pointsGPS: propPhotos.length,
        nbMesures: propMeasures.length,
        avgQuality,
        lat,
        lng,
        date: lastDate
      };
    });
  }, [gpsPhotos, measurements, propertyMap]);

  // Options de région dérivées des vraies données
  const regionOptions = [...new Set(leves.map((l) => l.region).filter(Boolean))];

  const filteredLeves = leves.filter((leve) => {
    const haystack = [leve.title, leve.location, leve.region]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'tous' || leve.region === regionFilter;
    const matchesData =
      dataFilter === 'tous' ||
      (dataFilter === 'gps' && leve.pointsGPS > 0) ||
      (dataFilter === 'mesures' && leve.nbMesures > 0);
    return matchesSearch && matchesRegion && matchesData;
  });

  // ---- Statistiques réelles ----
  const totalSurface = leves.reduce((sum, l) => {
    const n = Number(l.surface);
    return Number.isNaN(n) ? sum : sum + n;
  }, 0);

  const stats = [
    {
      title: 'Levés Géoréférencés',
      value: leves.length,
      icon: Mountain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Points GPS',
      value: gpsPhotos.length,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Mesures Terrain',
      value: measurements.length,
      icon: Ruler,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Surface Totale',
      value: totalSurface > 0 ? formatSurface(totalSurface) : '—',
      icon: Map,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

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
          <h1 className="text-3xl font-bold text-gray-900">Topographie</h1>
          <p className="text-gray-600 mt-1">Levés topographiques et modélisation du terrain</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Données
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Levé
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
                  placeholder="Rechercher par parcelle, localisation ou région..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Région" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Toutes régions</SelectItem>
                {regionOptions.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dataFilter} onValueChange={setDataFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type de données" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Toutes données</SelectItem>
                <SelectItem value="gps">Avec points GPS</SelectItem>
                <SelectItem value="mesures">Avec mesures terrain</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Topographie Tabs */}
      <Tabs defaultValue="leves" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="leves">Levés Topo</TabsTrigger>
          <TabsTrigger value="modelisation">Modélisation 3D</TabsTrigger>
          <TabsTrigger value="courbes">Courbes Niveau</TabsTrigger>
          <TabsTrigger value="calculs">Calculs Volumes</TabsTrigger>
        </TabsList>

        <TabsContent value="leves" className="mt-6">
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-gray-500">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Chargement des levés topographiques...
              </div>
            ) : filteredLeves.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-gray-500">
                  <Mountain className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium text-gray-700">Aucun levé topographique</p>
                  <p className="text-sm mt-1">
                    {searchTerm || regionFilter !== 'tous' || dataFilter !== 'tous'
                      ? 'Aucun levé ne correspond à vos critères.'
                      : 'Vos levés apparaîtront ici dès que des points GPS ou des mesures terrain seront enregistrés.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredLeves.map((leve, index) => {
                const hasCoords = leve.lat != null && leve.lng != null;
                return (
                  <motion.div
                    key={leve.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                              <Mountain className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {leve.title}
                              </h3>

                              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium text-gray-900">Localisation</h4>
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {leve.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Map className="h-3 w-3" />
                                      {formatSurface(leve.surface)}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium text-gray-900">Géoréférencement</h4>
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <div className="flex items-center gap-1">
                                      <Navigation className="h-3 w-3" />
                                      {hasCoords
                                        ? `${leve.lat.toFixed(5)}, ${leve.lng.toFixed(5)}`
                                        : 'Non renseigné'}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Target className="h-3 w-3" />
                                      {leve.pointsGPS} point{leve.pointsGPS > 1 ? 's' : ''} GPS
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium text-gray-900">Mesures terrain</h4>
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <div className="flex items-center gap-1">
                                      <Ruler className="h-3 w-3" />
                                      {leve.nbMesures} relevé{leve.nbMesures > 1 ? 's' : ''}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {formatDate(leve.date)}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium text-gray-900">Qualité</h4>
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <div>
                                      Score moyen:{' '}
                                      {leve.avgQuality != null
                                        ? leve.avgQuality.toFixed(1)
                                        : '—'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      Altimétrie / volumes : non disponibles
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div className="flex gap-2 flex-wrap justify-end">
                              {leve.pointsGPS > 0 && (
                                <Badge className="bg-green-100 text-green-800">
                                  Géoréférencé
                                </Badge>
                              )}
                              {leve.region && (
                                <Badge variant="outline">{leve.region}</Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-gray-500">
                            Dernière mise à jour : {formatDate(leve.date)}
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
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share className="h-4 w-4 mr-2" />
                              Partager
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="modelisation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Layers className="h-5 w-5 mr-2" />
                Modélisation 3D du Terrain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Mountain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Visualiseur 3D
                  </h3>
                  <p className="text-gray-600 mb-4">
                    La modélisation tridimensionnelle des surfaces sera disponible prochainement.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button disabled>
                      Bientôt disponible
                    </Button>
                    <Button variant="outline" disabled>
                      <Settings className="h-4 w-4 mr-2" />
                      Paramètres
                    </Button>
                  </div>
                </div>
              </div>

              {/* Outils 3D (interface — activation à venir) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <Button variant="outline" className="flex items-center gap-2" disabled>
                  <RotateCw className="h-4 w-4" />
                  Rotation
                </Button>
                <Button variant="outline" className="flex items-center gap-2" disabled>
                  <Move className="h-4 w-4" />
                  Panoramique
                </Button>
                <Button variant="outline" className="flex items-center gap-2" disabled>
                  <Maximize className="h-4 w-4" />
                  Zoom +
                </Button>
                <Button variant="outline" className="flex items-center gap-2" disabled>
                  <Minimize className="h-4 w-4" />
                  Zoom -
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courbes" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Génération Courbes de Niveau</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Équidistance (m)</label>
                    <Select defaultValue="0.5">
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir équidistance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.1">0.1 m</SelectItem>
                        <SelectItem value="0.25">0.25 m</SelectItem>
                        <SelectItem value="0.5">0.5 m</SelectItem>
                        <SelectItem value="1">1 m</SelectItem>
                        <SelectItem value="2">2 m</SelectItem>
                        <SelectItem value="5">5 m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Style de ligne</label>
                    <Select defaultValue="continue">
                      <SelectTrigger>
                        <SelectValue placeholder="Style de ligne" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="continue">Continue</SelectItem>
                        <SelectItem value="pointille">Pointillé</SelectItem>
                        <SelectItem value="mixte">Mixte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full" disabled>
                    <Zap className="h-4 w-4 mr-2" />
                    Générer les Courbes
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Nécessite des relevés d'altitude (non disponibles actuellement).
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analyse Altimétrique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="py-10 text-center text-gray-500">
                  <BarChart3 className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium text-gray-700">Aucune donnée altimétrique</p>
                  <p className="text-sm mt-1">
                    L'analyse des altitudes et pentes sera calculée à partir de
                    relevés d'altitude. Bientôt disponible.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calculs" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Calcul des Volumes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="py-10 text-center text-gray-500">
                  <Mountain className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium text-gray-700">Aucun calcul de volume</p>
                  <p className="text-sm mt-1">
                    Les volumes de remblai/déblai nécessitent un modèle
                    numérique de terrain. Bientôt disponible.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Méthodes de Calcul</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Méthode des Prismes
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Mountain className="h-4 w-4 mr-2" />
                    Interpolation TIN
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Layers className="h-4 w-4 mr-2" />
                    Modèle Numérique
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Target className="h-4 w-4 mr-2" />
                    Sections Transversales
                  </Button>
                  <p className="text-xs text-gray-500 text-center pt-2">
                    Méthodes disponibles prochainement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default GeometreTopographie;

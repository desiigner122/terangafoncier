import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Ruler,
  Map,
  FileText,
  Camera,
  Download,
  Upload,
  Eye,
  Plus,
  Search,
  Filter,
  Edit,
  MapPin,
  Compass,
  Square,
  RefreshCw,
  Calendar,
  User,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  Share2,
  Printer,
  BookOpen,
  Globe,
  Target,
  Calculator
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Superficie (m²) -> hectares avec 1 décimale
const toHectares = (m2) => {
  const n = Number(m2) || 0;
  return n / 10000;
};

// Libellé + couleur selon le verification_status réel de la propriété
const getStatusBadge = (status) => {
  switch (status) {
    case 'verified': return { label: 'Vérifié', className: 'bg-green-100 text-green-800' };
    case 'in_progress': return { label: 'En cours', className: 'bg-blue-100 text-blue-800' };
    case 'pending': return { label: 'En attente', className: 'bg-orange-100 text-orange-800' };
    case 'rejected': return { label: 'Rejeté', className: 'bg-red-100 text-red-800' };
    default: return { label: status || 'Non défini', className: 'bg-gray-100 text-gray-800' };
  }
};

const AgentFoncierCadastral = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plans');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(100);

  // Données réelles
  const [cadastralPlans, setCadastralPlans] = useState([]);
  const [gpsPoints, setGpsPoints] = useState([]);
  const [stats, setStats] = useState({
    totalPlans: 0,
    surfaceHa: 0,
    gpsPointsCount: 0,
    avgQuality: null
  });

  useEffect(() => {
    const loadCadastral = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Plans cadastraux = properties de l'agent (owner_id)
        const { data: props, error } = await supabase
          .from('properties')
          .select('id, title, name, type, surface, location, region, city, latitude, longitude, status, verification_status, created_at')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        const list = props || [];

        // Points GPS / relevés = property_photos géolocalisées de ces propriétés
        const ids = list.map((p) => p.id);
        const photosByProperty = {};
        let gpsList = [];
        if (ids.length > 0) {
          const { data: photos } = await supabase
            .from('property_photos')
            .select('id, property_id, gps_latitude, gps_longitude, quality_score, created_at')
            .in('property_id', ids)
            .order('created_at', { ascending: false });

          (photos || []).forEach((ph) => {
            photosByProperty[ph.property_id] = (photosByProperty[ph.property_id] || 0) + 1;
          });

          const titleById = {};
          list.forEach((p) => { titleById[p.id] = p.title || p.name || 'Parcelle'; });

          gpsList = (photos || [])
            .filter((ph) => ph.gps_latitude != null && ph.gps_longitude != null)
            .map((ph) => ({
              id: ph.id,
              parcel: titleById[ph.property_id] || 'Parcelle',
              lat: Number(ph.gps_latitude),
              lng: Number(ph.gps_longitude),
              quality: ph.quality_score != null ? Number(ph.quality_score) : null,
              date: ph.created_at ? new Date(ph.created_at).toLocaleDateString('fr-FR') : '—'
            }));
        }

        const plans = list.map((p) => ({
          id: p.id,
          title: p.title || p.name || 'Parcelle sans titre',
          type: p.type || 'Terrain',
          surface: p.surface,
          location: p.location || [p.city, p.region].filter(Boolean).join(', ') || '—',
          status: p.verification_status,
          date: p.created_at ? new Date(p.created_at).toLocaleDateString('fr-FR') : '—',
          hasGps: p.latitude != null && p.longitude != null,
          lat: p.latitude,
          lng: p.longitude,
          photosCount: photosByProperty[p.id] || 0
        }));

        // Stats calculées sur les vraies données
        const surfaceHa = list.reduce((sum, p) => sum + toHectares(p.surface), 0);
        const qualities = gpsList.map((g) => g.quality).filter((q) => q != null);
        const avgQuality = qualities.length
          ? Math.round(qualities.reduce((a, b) => a + b, 0) / qualities.length)
          : null;

        setCadastralPlans(plans);
        setGpsPoints(gpsList);
        setStats({
          totalPlans: plans.length,
          surfaceHa,
          gpsPointsCount: gpsList.length,
          avgQuality
        });
      } catch (e) {
        console.error('Erreur chargement cadastre agent:', e);
        setCadastralPlans([]);
        setGpsPoints([]);
        setStats({ totalPlans: 0, surfaceHa: 0, gpsPointsCount: 0, avgQuality: null });
      } finally {
        setLoading(false);
      }
    };

    loadCadastral();
  }, [user?.id]);

  const filteredPlans = cadastralPlans.filter((p) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      String(p.type).toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gray-50 p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastral & Topographie</h1>
          <p className="text-gray-600">Gestion des plans, mesures et relevés topographiques</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importer Plan
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Levé
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Plans / Parcelles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPlans}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Map className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Surfaces Cumulées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.surfaceHa > 0 ? `${stats.surfaceHa.toFixed(1)} ha` : '—'}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Square className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Points GPS</p>
                <p className="text-2xl font-bold text-gray-900">{stats.gpsPointsCount}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Qualité Moy. GPS</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgQuality != null ? `${stats.avgQuality}%` : '—'}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Compass className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Plans Cadastraux
          </TabsTrigger>
          <TabsTrigger value="measures" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Relevés GPS
          </TabsTrigger>
          <TabsTrigger value="viewer" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Visualiseur
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Outils
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Rapports
          </TabsTrigger>
        </TabsList>

        {/* Plans Cadastraux Tab */}
        <TabsContent value="plans" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Map className="h-5 w-5 mr-2" />
                  Plans Cadastraux
                </CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un plan..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredPlans.length === 0 ? (
                <div className="text-center py-16">
                  <Map className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Aucun plan cadastral</p>
                  <p className="text-sm text-gray-500">
                    Vos parcelles apparaîtront ici dès qu'elles seront enregistrées.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPlans.map((plan) => {
                    const badge = getStatusBadge(plan.status);
                    return (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                        onClick={() => setSelectedPlan(plan)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="bg-green-100 p-3 rounded-lg">
                              <Map className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{plan.title}</h3>
                              <p className="text-sm text-gray-600">
                                {plan.type}
                                {plan.surface ? ` • ${Number(plan.surface).toLocaleString('fr-FR')} m²` : ''}
                                {plan.photosCount ? ` • ${plan.photosCount} photo${plan.photosCount > 1 ? 's' : ''}` : ''}
                              </p>
                              <div className="flex items-center gap-4 mt-2 flex-wrap">
                                <Badge className={badge.className}>
                                  {badge.label}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  <Calendar className="h-3 w-3 inline mr-1" />
                                  {plan.date}
                                </span>
                                <span className="text-xs text-gray-500">
                                  <MapPin className="h-3 w-3 inline mr-1" />
                                  {plan.location}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              {plan.hasGps ? (
                                <span className="text-xs text-green-600 font-medium">
                                  <Target className="h-3 w-3 inline mr-1" />
                                  {Number(plan.lat).toFixed(4)}, {Number(plan.lng).toFixed(4)}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">Sans GPS</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relevés GPS Tab */}
        <TabsContent value="measures" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ruler className="h-5 w-5 mr-2" />
                  Relevés GPS Récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gpsPoints.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Aucun relevé GPS</p>
                    <p className="text-sm text-gray-500">
                      Les points géolocalisés de vos photos de parcelles s'afficheront ici.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {gpsPoints.slice(0, 12).map((point) => (
                      <div key={point.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{point.parcel}</p>
                          <p className="text-sm text-gray-600">Point GPS • {point.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {point.quality != null ? `Qualité ${point.quality}%` : 'Qualité —'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Calculateur Cadastral
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de calcul
                    </label>
                    <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>Surface polygonale</option>
                      <option>Distance entre points</option>
                      <option>Azimut et gisement</option>
                      <option>Coordonnées polaires</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Points de mesure
                    </label>
                    <textarea
                      className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
                      placeholder="Entrez les coordonnées (X, Y) séparées par des virgules..."
                    />
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Visualiseur Tab */}
        <TabsContent value="viewer" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Visualiseur de Plans
                </CardTitle>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Grille</span>
                    <Switch
                      checked={showGrid}
                      onCheckedChange={setShowGrid}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
                    <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(400, zoom + 25))}>
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative h-96 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Visualiseur de Plans Cadastraux</p>
                  <p className="text-sm text-gray-500">
                    {selectedPlan
                      ? `Plan sélectionné : ${selectedPlan.title}`
                      : 'Sélectionnez un plan pour l\'afficher'}
                  </p>
                  <Button className="mt-4 bg-green-600 hover:bg-green-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Charger un Plan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Outils Tab */}
        <TabsContent value="tools" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Instruments de Mesure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <RefreshCw className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Parc d'instruments</p>
                  <p className="text-sm text-gray-500">
                    Le suivi des instruments et étalonnages sera bientôt disponible.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Normes & Références
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">NGS - Nivellement Général du Sénégal</p>
                    <p className="text-sm text-blue-700">Système de référence altimétrique</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-900">UTM Zone 28N</p>
                    <p className="text-sm text-green-700">Projection cartographique officielle</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="font-medium text-orange-900">WGS84</p>
                    <p className="text-sm text-orange-700">Datum géodésique de référence</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Rapports Tab */}
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Rapports & Exportations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Download className="h-6 w-6 mb-2" />
                  <span>Rapport Mensuel</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Printer className="h-6 w-6 mb-2" />
                  <span>Fiche Technique</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Share2 className="h-6 w-6 mb-2" />
                  <span>Export KML</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Save className="h-6 w-6 mb-2" />
                  <span>Sauvegarde</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <Globe className="h-6 w-6 mb-2" />
                  <span>Export GeoJSON</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>Procès-verbal</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AgentFoncierCadastral;

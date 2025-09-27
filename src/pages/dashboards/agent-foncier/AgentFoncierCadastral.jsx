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
  Trash2,
  MapPin,
  Compass,
  Square,
  Triangle,
  Circle,
  Maximize,
  RefreshCw,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Grid3X3,
  Layers,
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
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';

const AgentFoncierCadastral = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('plans');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(100);

  // Données simulées
  const [cadastralPlans] = useState([
    {
      id: 'CAD-001',
      title: 'Secteur Nord - Dakar Plateau',
      type: 'Plan de masse',
      surface: '2.5 ha',
      parcels: 24,
      status: 'Validé',
      date: '2024-09-20',
      surveyor: 'M. Diop',
      progress: 100,
      coordinates: { lat: 14.6937, lng: -17.4441 }
    },
    {
      id: 'CAD-002', 
      title: 'Zone Industrielle - Rufisque',
      type: 'Levé topographique',
      surface: '5.2 ha',
      parcels: 8,
      status: 'En cours',
      date: '2024-09-25',
      surveyor: 'Mme Fall',
      progress: 75,
      coordinates: { lat: 14.7167, lng: -17.2667 }
    },
    {
      id: 'CAD-003',
      title: 'Résidentiel Almadies',
      type: 'Bornage',
      surface: '1.8 ha',
      parcels: 45,
      status: 'Révision',
      date: '2024-09-15',
      surveyor: 'M. Ndiaye',
      progress: 90,
      coordinates: { lat: 14.7644, lng: -17.5175 }
    },
    {
      id: 'CAD-004',
      title: 'Projet Diamniadio',
      type: 'Plan cadastral',
      surface: '12.0 ha',
      parcels: 156,
      status: 'Planifié',
      date: '2024-10-01',
      surveyor: 'Équipe Tech',
      progress: 25,
      coordinates: { lat: 14.7167, lng: -17.1833 }
    }
  ]);

  const [recentMeasures] = useState([
    { id: 1, parcel: 'PAR-A-001', type: 'Surface', value: '2450 m²', date: '2024-09-26', precision: '±0.5m' },
    { id: 2, parcel: 'PAR-B-023', type: 'Périmètre', value: '198.5 m', date: '2024-09-25', precision: '±0.2m' },
    { id: 3, parcel: 'PAR-C-112', type: 'Altitude', value: '45.2 m', date: '2024-09-24', precision: '±0.1m' },
    { id: 4, parcel: 'PAR-D-034', type: 'Orientation', value: '125.5°', date: '2024-09-24', precision: '±0.05°' },
    { id: 5, parcel: 'PAR-E-067', type: 'Distance', value: '87.3 m', date: '2024-09-23', precision: '±0.1m' }
  ]);

  const [surveyTools] = useState([
    { name: 'Station totale', status: 'Disponible', lastCalib: '2024-09-01', precision: '±2mm + 2ppm' },
    { name: 'GPS RTK', status: 'En service', lastCalib: '2024-08-15', precision: '±1cm' },
    { name: 'Niveau optique', status: 'Maintenance', lastCalib: '2024-07-30', precision: '±1mm/km' },
    { name: 'Distancemètre laser', status: 'Disponible', lastCalib: '2024-09-10', precision: '±1.5mm' }
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Validé': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Révision': return 'bg-orange-100 text-orange-800';
      case 'Planifié': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getToolStatusColor = (status) => {
    switch (status) {
      case 'Disponible': return 'bg-green-100 text-green-800';
      case 'En service': return 'bg-blue-100 text-blue-800';
      case 'Maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
                <p className="text-sm font-medium text-gray-600 mb-1">Plans Actifs</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">Surfaces Mesurées</p>
                <p className="text-2xl font-bold text-gray-900">156.8 ha</p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">Bornages</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">Précision Moy.</p>
                <p className="text-2xl font-bold text-gray-900">±0.8cm</p>
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
            Mesures
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
              <div className="space-y-4">
                {cadastralPlans.map((plan) => (
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
                          <p className="text-sm text-gray-600">{plan.type} • {plan.surface} • {plan.parcels} parcelles</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge className={getStatusColor(plan.status)}>
                              {plan.status}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {plan.date}
                            </span>
                            <span className="text-xs text-gray-500">
                              <User className="h-3 w-3 inline mr-1" />
                              {plan.surveyor}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{plan.progress}%</p>
                          <Progress value={plan.progress} className="w-20 h-2 mt-1" />
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
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mesures Tab */}
        <TabsContent value="measures" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ruler className="h-5 w-5 mr-2" />
                  Mesures Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentMeasures.map((measure) => (
                    <div key={measure.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{measure.parcel}</p>
                        <p className="text-sm text-gray-600">{measure.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{measure.value}</p>
                        <p className="text-xs text-gray-500">{measure.precision}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                  <p className="text-sm text-gray-500">Sélectionnez un plan pour l'afficher</p>
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
                <div className="space-y-4">
                  {surveyTools.map((tool, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{tool.name}</p>
                        <p className="text-sm text-gray-600">Précision: {tool.precision}</p>
                        <p className="text-xs text-gray-500">Dernier étalonnage: {tool.lastCalib}</p>
                      </div>
                      <Badge className={getToolStatusColor(tool.status)}>
                        {tool.status}
                      </Badge>
                    </div>
                  ))}
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
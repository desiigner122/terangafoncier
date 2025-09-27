import React, { useState } from 'react';
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
  Copy,
  Mountain,
  TrendingUp,
  TrendingDown,
  Navigation,
  Compass,
  Target,
  Map,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  Camera,
  Ruler,
  Grid3X3,
  BarChart3,
  Activity,
  Zap,
  Maximize,
  Minimize,
  RotateCw,
  Move
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const GeometreTopographie = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('tous');
  const [statusFilter, setStatusFilter] = useState('tous');

  // Données topographiques
  const levesTopo = [
    {
      id: 1,
      title: 'Levé Topographique - Almadies Bay',
      type: 'detail',
      status: 'complete',
      date: '2024-09-25',
      location: 'Almadies, Dakar',
      superficie: '2.5 ha',
      precision: '±2 cm',
      points: 1247,
      courbesNiveau: '0.5 m',
      altitudeMin: '2.1 m',
      altitudeMax: '15.8 m',
      denivele: '13.7 m',
      penteMax: '18%',
      penteMoyenne: '8%',
      client: 'Société IMMOGO',
      equipment: ['Station Totale Leica TS16', 'GPS RTK'],
      weather: { temp: '28°C', humidity: '65%', wind: '12 km/h' },
      operator: 'Géomètre Principal',
      icon: Mountain,
      volumeRemblai: '2,450 m³',
      volumeDeblai: '1,890 m³',
      progress: 100
    },
    {
      id: 2,
      title: 'Levé Altimétrique - Zone Industrielle',
      type: 'altimetrique',
      status: 'en_cours',
      date: '2024-09-30',
      location: 'Thiès',
      superficie: '15 ha',
      precision: '±1 cm',
      points: 2156,
      courbesNiveau: '0.25 m',
      altitudeMin: '45.2 m',
      altitudeMax: '67.8 m',
      denivele: '22.6 m',
      penteMax: '25%',
      penteMoyenne: '12%',
      client: 'Ministère Industrie',
      equipment: ['Niveau Électronique', 'GPS RTK', 'Station Totale'],
      weather: { temp: '26°C', humidity: '70%', wind: '8 km/h' },
      operator: 'Équipe Topographie',
      icon: BarChart3,
      volumeRemblai: '8,750 m³',
      volumeDeblai: '6,200 m³',
      progress: 75
    },
    {
      id: 3,
      title: 'Topographie Planimétrique - Rufisque',
      type: 'planimetrique',
      status: 'planifie',
      date: '2024-10-05',
      location: 'Rufisque',
      superficie: '800 m²',
      precision: '±1.5 cm',
      points: 89,
      courbesNiveau: 'N/A',
      altitudeMin: '12.5 m',
      altitudeMax: '14.2 m',
      denivele: '1.7 m',
      penteMax: '5%',
      penteMoyenne: '2%',
      client: 'M. Amadou Diallo',
      equipment: ['Station Totale', 'Récepteur GPS'],
      weather: { temp: 'N/A', humidity: 'N/A', wind: 'N/A' },
      operator: 'Assistant Géomètre',
      icon: Grid3X3,
      volumeRemblai: '45 m³',
      volumeDeblai: '32 m³',
      progress: 0
    },
    {
      id: 4,
      title: 'Levé Architectural - Villa Sacré-Cœur',
      type: 'architectural',
      status: 'complete',
      date: '2024-09-28',
      location: 'Sacré-Cœur, Dakar',
      superficie: '1,200 m²',
      precision: '±2 mm',
      points: 456,
      courbesNiveau: '0.1 m',
      altitudeMin: '18.2 m',
      altitudeMax: '23.5 m',
      denivele: '5.3 m',
      penteMax: '8%',
      penteMoyenne: '3%',
      client: 'Arch. Mbaye & Associates',
      equipment: ['Scanner 3D', 'Station Totale', 'Télémètre Laser'],
      weather: { temp: '27°C', humidity: '72%', wind: '5 km/h' },
      operator: 'Spécialiste Architecture',
      icon: Layers,
      volumeRemblai: '180 m³',
      volumeDeblai: '125 m³',
      progress: 100
    },
    {
      id: 5,
      title: 'Topographie Hydrographique - Bargny',
      type: 'hydrographique',
      status: 'en_cours',
      date: '2024-09-20',
      location: 'Bargny',
      superficie: '25 ha',
      precision: '±5 cm',
      points: 3245,
      courbesNiveau: '1 m',
      altitudeMin: '-2.5 m',
      altitudeMax: '8.7 m',
      denivele: '11.2 m',
      penteMax: '15%',
      penteMoyenne: '6%',
      client: 'Ministère Industrie',
      equipment: ['Sondeur Bathymétrique', 'GPS RTK', 'Station Totale'],
      weather: { temp: '29°C', humidity: '78%', wind: '15 km/h' },
      operator: 'Équipe Hydrographie',
      icon: Activity,
      volumeRemblai: '12,500 m³',
      volumeDeblai: '9,800 m³',
      progress: 60
    },
    {
      id: 6,
      title: 'Levé Drone - Cartographie Kaolack',
      type: 'drone',
      status: 'revision',
      date: '2024-09-18',
      location: 'Kaolack',
      superficie: '5.2 ha',
      precision: '±3 cm',
      points: 8500,
      courbesNiveau: '0.5 m',
      altitudeMin: '8.5 m',
      altitudeMax: '15.2 m',
      denivele: '6.7 m',
      penteMax: '12%',
      penteMoyenne: '4%',
      client: 'Coopérative Agricole',
      equipment: ['Drone DJI Phantom 4 RTK', 'GPS Base'],
      weather: { temp: '31°C', humidity: '68%', wind: '10 km/h' },
      operator: 'Pilote Drone Certifié',
      icon: Camera,
      volumeRemblai: '850 m³',
      volumeDeblai: '720 m³',
      progress: 90
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'detail': return Mountain;
      case 'altimetrique': return BarChart3;
      case 'planimetrique': return Grid3X3;
      case 'architectural': return Layers;
      case 'hydrographique': return Activity;
      case 'drone': return Camera;
      default: return Mountain;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800';
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      case 'planifie': return 'bg-yellow-100 text-yellow-800';
      case 'revision': return 'bg-purple-100 text-purple-800';
      case 'erreur': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'complete': return 'Terminé';
      case 'en_cours': return 'En cours';
      case 'planifie': return 'Planifié';
      case 'revision': return 'En révision';
      case 'erreur': return 'Erreur';
      default: return status;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'detail': return 'Topographie détaillée';
      case 'altimetrique': return 'Altimétrique';
      case 'planimetrique': return 'Planimétrique';
      case 'architectural': return 'Architectural';
      case 'hydrographique': return 'Hydrographique';
      case 'drone': return 'Photogrammétrie';
      default: return type;
    }
  };

  const filteredLeves = levesTopo.filter(leve => {
    const matchesSearch = leve.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leve.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leve.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'tous' || leve.type === typeFilter;
    const matchesStatus = statusFilter === 'tous' || leve.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Statistiques
  const stats = [
    {
      title: 'Total Levés',
      value: levesTopo.length,
      icon: Mountain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Points Mesurés',
      value: '16.1K',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Surface Totale',
      value: '69.9 ha',
      icon: Map,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Dénivelé Max',
      value: '22.6 m',
      icon: TrendingUp,
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
                  placeholder="Rechercher par titre, client ou localisation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type de levé" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous types</SelectItem>
                <SelectItem value="detail">Topographie détaillée</SelectItem>
                <SelectItem value="altimetrique">Altimétrique</SelectItem>
                <SelectItem value="planimetrique">Planimétrique</SelectItem>
                <SelectItem value="architectural">Architectural</SelectItem>
                <SelectItem value="hydrographique">Hydrographique</SelectItem>
                <SelectItem value="drone">Photogrammétrie</SelectItem>
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
                <SelectItem value="revision">En révision</SelectItem>
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
            {filteredLeves.map((leve, index) => {
              const TypeIcon = getTypeIcon(leve.type);
              
              return (
                <motion.div
                  key={leve.id}
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
                              {leve.title}
                            </h3>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">Localisation</h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <div className="flex items-center gap-1">
                                    <Navigation className="h-3 w-3" />
                                    {leve.location}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Map className="h-3 w-3" />
                                    {leve.superficie}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Target className="h-3 w-3" />
                                    {leve.points} points
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">Altimétrie</h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <div>Min: {leve.altitudeMin}</div>
                                  <div>Max: {leve.altitudeMax}</div>
                                  <div>Dénivelé: {leve.denivele}</div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">Pentes</h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <div>Max: {leve.penteMax}</div>
                                  <div>Moyenne: {leve.penteMoyenne}</div>
                                  <div>Courbes: {leve.courbesNiveau}</div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">Volumes</h4>
                                <div className="text-sm text-gray-600 space-y-1">
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3 text-green-600" />
                                    Remblai: {leve.volumeRemblai}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <TrendingDown className="h-3 w-3 text-red-600" />
                                    Déblai: {leve.volumeDeblai}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">Équipement Utilisé</h4>
                                <div className="flex flex-wrap gap-1">
                                  {leve.equipment.map((equip, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {equip}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-900">Conditions</h4>
                                <div className="text-xs text-gray-600">
                                  <div>Météo: {leve.weather.temp}, {leve.weather.humidity} humidité</div>
                                  <div>Opérateur: {leve.operator}</div>
                                  <div>Précision: {leve.precision}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-2">
                            <Badge className={getStatusColor(leve.status)}>
                              {getStatusText(leve.status)}
                            </Badge>
                            <Badge variant="outline">
                              {getTypeText(leve.type)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar pour les levés en cours */}
                      {leve.status === 'en_cours' && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Progression</span>
                            <span className="font-medium">{leve.progress}%</span>
                          </div>
                          <Progress value={leve.progress} className="h-2" />
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          Client: {leve.client} • Date: {leve.date}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Visualiser 3D
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
            })}
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
                    Visualiseur 3D Intégré
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Modélisation tridimensionnelle avec rendu des surfaces et volumes
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button>
                      Lancer le Visualiseur
                    </Button>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Paramètres
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Outils 3D */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <Button variant="outline" className="flex items-center gap-2">
                  <RotateCw className="h-4 w-4" />
                  Rotation
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Move className="h-4 w-4" />
                  Panoramique
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Maximize className="h-4 w-4" />
                  Zoom +
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
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
                  
                  <Button className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Générer les Courbes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analyse Altimétrique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">18.4 m</div>
                      <div className="text-sm text-blue-700">Altitude Moyenne</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">8.5%</div>
                      <div className="text-sm text-green-700">Pente Moyenne</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Point le plus bas</span>
                      <span className="font-medium">-2.5 m</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Point le plus haut</span>
                      <span className="font-medium">67.8 m</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Dénivelé total</span>
                      <span className="font-medium">70.3 m</span>
                    </div>
                  </div>
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
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">25,475 m³</div>
                      <div className="text-sm text-green-700">Volume Remblai</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-600">18,767 m³</div>
                      <div className="text-sm text-red-700">Volume Déblai</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Volume net</span>
                      <span className="font-medium text-green-600">+6,708 m³</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Coefficient foisonnement</span>
                      <span className="font-medium">1.25</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Volume transport</span>
                      <span className="font-medium">23,459 m³</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Méthodes de Calcul</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Méthode des Prismes
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mountain className="h-4 w-4 mr-2" />
                    Interpolation TIN
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Layers className="h-4 w-4 mr-2" />
                    Modèle Numérique
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Sections Transversales
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

export default GeometreTopographie;
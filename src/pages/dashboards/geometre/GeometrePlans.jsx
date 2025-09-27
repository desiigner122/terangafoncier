import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search, 
  Download,
  Upload,
  Eye,
  Edit,
  Share,
  Copy,
  Layers,
  Grid3X3,
  Route,
  Building,
  TreePine,
  Map,
  Ruler,
  Compass,
  Target,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  Printer,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Move,
  Square,
  Circle,
  Triangle,
  Pen,
  Eraser,
  Save,
  Undo,
  Redo,
  Maximize
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GeometrePlans = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('tous');
  const [statusFilter, setStatusFilter] = useState('tous');

  // Données des plans
  const plans = [
    {
      id: 1,
      title: 'Plan de Bornage - Parcelle A127',
      type: 'bornage',
      status: 'complete',
      date: '2024-09-25',
      lastModified: '2024-09-25 14:30',
      client: 'M. Amadou Diallo',
      location: 'Rufisque',
      echelle: '1:500',
      format: 'A3',
      superficie: '800 m²',
      version: '2.1',
      fileSize: '2.4 MB',
      description: 'Plan de bornage définitif avec implantation des bornes géodésiques',
      icon: Grid3X3,
      tags: ['Bornage', 'Géodésie', 'Parcelle'],
      layers: ['Fond de plan', 'Limites', 'Bornes', 'Cotes', 'Textes'],
      coordinates: 'UTM Zone 28N',
      projection: 'WGS84'
    },
    {
      id: 2,
      title: 'Plan Topographique - Almadies Bay',
      type: 'topographie',
      status: 'en_cours',
      date: '2024-09-30',
      lastModified: '2024-10-01 09:15',
      client: 'Société IMMOGO',
      location: 'Almadies, Dakar',
      echelle: '1:200',
      format: 'A1',
      superficie: '2.5 ha',
      version: '1.3',
      fileSize: '8.7 MB',
      description: 'Plan topographique détaillé pour projet résidentiel avec courbes de niveau',
      icon: Layers,
      tags: ['Topographie', 'Courbes niveau', 'Résidentiel'],
      layers: ['Topographie', 'Courbes niveau', 'Végétation', 'Bâti existant', 'Réseaux'],
      coordinates: 'UTM Zone 28N',
      projection: 'WGS84'
    },
    {
      id: 3,
      title: 'Plan de Lotissement - Thiès Centre',
      type: 'lotissement',
      status: 'revision',
      date: '2024-09-20',
      lastModified: '2024-09-28 16:45',
      client: 'Promoteur Sénégal SARL',
      location: 'Thiès',
      echelle: '1:1000',
      format: 'A0',
      superficie: '15 ha',
      version: '3.2',
      fileSize: '12.1 MB',
      description: 'Plan de lotissement 120 lots avec voirie, réseaux et espaces verts',
      icon: Route,
      tags: ['Lotissement', 'Urbanisme', 'Voirie'],
      layers: ['Parcelles', 'Voirie', 'Réseaux', 'Espaces verts', 'Équipements'],
      coordinates: 'UTM Zone 28N',
      projection: 'WGS84'
    },
    {
      id: 4,
      title: 'Plan Cadastral - Zone Industrielle',
      type: 'cadastral',
      status: 'planifie',
      date: '2024-10-05',
      lastModified: '2024-09-15 11:20',
      client: 'Ministère de l\'Industrie',
      location: 'Bargny',
      echelle: '1:2000',
      format: 'A1',
      superficie: '25 ha',
      version: '1.0',
      fileSize: '5.3 MB',
      description: 'Plan cadastral pour aménagement zone industrielle avec découpage parcellaire',
      icon: Building,
      tags: ['Cadastral', 'Industriel', 'Parcellaire'],
      layers: ['Cadastre', 'Parcelles', 'Voirie', 'Industrie', 'Infrastructure'],
      coordinates: 'UTM Zone 28N',
      projection: 'WGS84'
    },
    {
      id: 5,
      title: 'Plan Architectural - Villa Sacré-Cœur',
      type: 'architectural',
      status: 'complete',
      date: '2024-09-28',
      lastModified: '2024-09-28 17:00',
      client: 'Arch. Mbaye & Associates',
      location: 'Sacré-Cœur, Dakar',
      echelle: '1:100',
      format: 'A2',
      superficie: '1,200 m²',
      version: '2.0',
      fileSize: '4.8 MB',
      description: 'Plan architectural détaillé avec relevé de façades et coupes',
      icon: Building,
      tags: ['Architecture', 'Relevé', 'Façades'],
      layers: ['Plan masse', 'Façades', 'Coupes', 'Détails', 'Cotes'],
      coordinates: 'Local',
      projection: 'Lambert Conforme'
    },
    {
      id: 6,
      title: 'Plan Agricole - Parcelles Kaolack',
      type: 'agricole',
      status: 'complete',
      date: '2024-09-18',
      lastModified: '2024-09-20 10:30',
      client: 'Coopérative Agricole Thiès',
      location: 'Kaolack',
      echelle: '1:2500',
      format: 'A3',
      superficie: '5.2 ha',
      version: '1.1',
      fileSize: '3.2 MB',
      description: 'Plan de délimitation parcelles agricoles avec système d\'irrigation',
      icon: TreePine,
      tags: ['Agriculture', 'Irrigation', 'Parcellaire'],
      layers: ['Parcelles', 'Irrigation', 'Cultures', 'Chemins', 'Points eau'],
      coordinates: 'UTM Zone 28N',
      projection: 'WGS84'
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'bornage': return Grid3X3;
      case 'topographie': return Layers;
      case 'lotissement': return Route;
      case 'cadastral': return Map;
      case 'architectural': return Building;
      case 'agricole': return TreePine;
      default: return FileText;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800';
      case 'en_cours': return 'bg-blue-100 text-blue-800';
      case 'revision': return 'bg-yellow-100 text-yellow-800';
      case 'planifie': return 'bg-purple-100 text-purple-800';
      case 'erreur': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'complete': return 'Terminé';
      case 'en_cours': return 'En cours';
      case 'revision': return 'En révision';  
      case 'planifie': return 'Planifié';
      case 'erreur': return 'Erreur';
      default: return status;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'bornage': return 'Bornage';
      case 'topographie': return 'Topographie';
      case 'lotissement': return 'Lotissement';
      case 'cadastral': return 'Cadastral';
      case 'architectural': return 'Architectural';
      case 'agricole': return 'Agricole';
      default: return type;
    }
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'tous' || plan.type === typeFilter;
    const matchesStatus = statusFilter === 'tous' || plan.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Statistiques
  const stats = [
    {
      title: 'Total Plans',
      value: plans.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'En Cours',
      value: plans.filter(p => p.status === 'en_cours').length,
      icon: Clock,
      color: 'text-yellow-600',  
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Terminés',
      value: plans.filter(p => p.status === 'complete').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Taille Totale',
      value: '36.5 MB',
      icon: Settings,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
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
          <h1 className="text-3xl font-bold text-gray-900">Plans & Dessins</h1>
          <p className="text-gray-600 mt-1">Bibliothèque de plans techniques et topographiques</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer Plan
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Plan
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
                <SelectValue placeholder="Type de plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous types</SelectItem>
                <SelectItem value="bornage">Bornage</SelectItem>
                <SelectItem value="topographie">Topographie</SelectItem>
                <SelectItem value="lotissement">Lotissement</SelectItem>
                <SelectItem value="cadastral">Cadastral</SelectItem>
                <SelectItem value="architectural">Architectural</SelectItem>
                <SelectItem value="agricole">Agricole</SelectItem>
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
                <SelectItem value="revision">En révision</SelectItem>
                <SelectItem value="planifie">Planifié</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Plans Tabs */}
      <Tabs defaultValue="grille" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="grille">Vue Grille</TabsTrigger>
          <TabsTrigger value="liste">Vue Liste</TabsTrigger>
          <TabsTrigger value="editeur">Éditeur CAO</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="grille" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan, index) => {
              const TypeIcon = getTypeIcon(plan.type);
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      {/* Preview Image */}
                      <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        <TypeIcon className="h-12 w-12 text-gray-400" />
                      </div>

                      {/* Plan Info */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-gray-900 line-clamp-2">
                            {plan.title}
                          </h3>
                          <Badge className={getStatusColor(plan.status)}>
                            {getStatusText(plan.status)}
                          </Badge>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Client: {plan.client}</div>
                          <div>Localisation: {plan.location}</div>
                          <div>Échelle: {plan.echelle} • Format: {plan.format}</div>
                          <div>Version: {plan.version} • {plan.fileSize}</div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {plan.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="text-xs text-gray-500">
                          Modifié: {plan.lastModified}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="liste" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-medium text-gray-900">Plan</th>
                      <th className="text-left p-4 font-medium text-gray-900">Type</th>
                      <th className="text-left p-4 font-medium text-gray-900">Client</th>
                      <th className="text-left p-4 font-medium text-gray-900">Échelle</th>
                      <th className="text-left p-4 font-medium text-gray-900">Version</th>
                      <th className="text-left p-4 font-medium text-gray-900">Statut</th>
                      <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlans.map((plan) => {
                      const TypeIcon = getTypeIcon(plan.type);
                      return (
                        <tr key={plan.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded">
                                <TypeIcon className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{plan.title}</div>
                                <div className="text-sm text-gray-600">{plan.location}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">
                              {getTypeText(plan.type)}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-gray-900">
                            {plan.client}
                          </td>
                          <td className="p-4 text-sm">
                            <div>{plan.echelle}</div>
                            <div className="text-gray-600">{plan.format}</div>
                          </td>
                          <td className="p-4 text-sm">
                            <div className="font-medium">v{plan.version}</div>
                            <div className="text-gray-600">{plan.fileSize}</div>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(plan.status)}>
                              {getStatusText(plan.status)}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Printer className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editeur" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Toolbar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Outils CAO</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Navigation</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        <ZoomIn className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ZoomOut className="h-3 w-3" />  
                      </Button>
                      <Button variant="outline" size="sm">
                        <Move className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <RotateCw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Formes</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        <Square className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Circle className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Triangle className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Pen className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Édition</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Undo className="h-3 w-3 mr-2" />
                        Annuler
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Redo className="h-3 w-3 mr-2" />
                        Refaire
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Save className="h-3 w-3 mr-2" />
                        Sauvegarder
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Canvas Area */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Éditeur de Plans</CardTitle>
                    <Button variant="outline" size="sm">
                      <Maximize className="h-4 w-4 mr-2" />
                      Plein écran
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px] bg-white border rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Éditeur CAO Intégré
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Interface de dessin professionnel avec calques et outils géométriques
                      </p>
                      <Button>
                        Ouvrir un Plan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Template Bornage Standard', type: 'bornage', icon: Grid3X3 },
              { name: 'Template Topographique', type: 'topographie', icon: Layers },
              { name: 'Template Lotissement', type: 'lotissement', icon: Route },
              { name: 'Template Cadastral', type: 'cadastral', icon: Map },
              { name: 'Template Architectural', type: 'architectural', icon: Building },
              { name: 'Template Agricole', type: 'agricole', icon: TreePine }
            ].map((template, index) => {
              const Icon = template.icon;
              return (
                <motion.div
                  key={template.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Template professionnel prêt à l'emploi
                        </p>
                        <Button variant="outline" size="sm">
                          Utiliser ce Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default GeometrePlans;
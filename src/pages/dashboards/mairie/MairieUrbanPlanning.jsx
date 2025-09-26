import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2,
  Map,
  Layers,
  Zap,
  Target,
  Compass,
  Edit,
  Save,
  Plus,
  Trash2,
  Eye,
  Download,
  Upload,
  Settings,
  MapPin,
  Home,
  TreePine,
  Car,
  School,
  Heart,
  ShoppingCart,
  Factory,
  Wifi,
  Camera,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const MairieUrbanPlanning = ({ dashboardStats }) => {
  const [activeTab, setActiveTab] = useState('zones');
  const [selectedZone, setSelectedZone] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handlers pour les actions urbaines
  const handleViewDetails = (zone) => {
    setSelectedZone(zone);
    window.safeGlobalToast({
      title: "Détails de zone",
      description: `Affichage des détails pour ${zone.name}`,
      variant: "default"
    });
  };

  const handleEditZone = (zone) => {
    setSelectedZone(zone);
    setEditMode(true);
    window.safeGlobalToast({
      title: "Mode édition",
      description: `Édition de ${zone.name} activée`,
      variant: "default"
    });
  };

  const handleSaveZone = () => {
    setIsLoading(true);
    setTimeout(() => {
      setEditMode(false);
      window.safeGlobalToast({
        title: "Zone sauvegardée",
        description: "Les modifications ont été enregistrées",
        variant: "success"
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleDeleteZone = (zoneId) => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Zone supprimée",
        description: "La zone a été supprimée avec succès",
        variant: "success"
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleCreateNewZone = () => {
    setEditMode(true);
    setSelectedZone(null);
    window.safeGlobalToast({
      title: "Nouvelle zone",
      description: "Formulaire de création ouvert",
      variant: "default"
    });
  };

  const handleExportPlan = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Plan exporté",
        description: "Plan d'urbanisme téléchargé avec succès",
        variant: "success"
      });
      setIsLoading(false);
    }, 2000);
  };

  // Données des zones urbaines
  const urbanZones = [
    {
      id: 'zone-1',
      name: 'Zone Résidentielle Nord',
      type: 'Résidentielle',
      area: '3.2 km²',
      population: 15420,
      density: 'Moyenne',
      status: 'Développée',
      occupancyRate: 78,
      infrastructures: ['Écoles', 'Centres de santé', 'Transports'],
      constraints: ['Hauteur max 4 étages', 'Coefficient 0.6'],
      futureProjects: ['Extension réseau eau', 'Nouveau parc'],
      priority: 'Moyenne',
      color: '#10B981',
      developmentPlan: {
        current: 78,
        target: 85,
        timeline: '2024-2026'
      }
    },
    {
      id: 'zone-2',
      name: 'Zone Commerciale Centre',
      type: 'Commerciale',
      area: '1.8 km²',
      population: 8500,
      density: 'Élevée',
      status: 'En Expansion',
      occupancyRate: 92,
      infrastructures: ['Centre commercial', 'Parking', 'Éclairage LED'],
      constraints: ['Zone piétonne', 'Normes environnementales'],
      futureProjects: ['Marché moderne', 'Place publique'],
      priority: 'Haute',
      color: '#3B82F6',
      developmentPlan: {
        current: 92,
        target: 100,
        timeline: '2024-2025'
      }
    },
    {
      id: 'zone-3',
      name: 'Zone Agricole Est',
      type: 'Agricole',
      area: '5.1 km²',
      population: 3200,
      density: 'Faible',
      status: 'Préservée',
      occupancyRate: 45,
      infrastructures: ['Puits forés', 'Pistes rurales'],
      constraints: ['Protection sols fertiles', 'Irrigation obligatoire'],
      futureProjects: ['Coopérative moderne', 'Formation agriculteurs'],
      priority: 'Normale',
      color: '#22C55E',
      developmentPlan: {
        current: 45,
        target: 60,
        timeline: '2024-2027'
      }
    },
    {
      id: 'zone-4',
      name: 'Zone Industrielle Sud',
      type: 'Industrielle',
      area: '2.3 km²',
      population: 1800,
      density: 'Faible',
      status: 'En Développement',
      occupancyRate: 65,
      infrastructures: ['Usine traitement', 'Route industrielle'],
      constraints: ['Normes pollution', 'Zone tampon résidentielle'],
      futureProjects: ['Parc technologique', 'Centre logistique'],
      priority: 'Haute',
      color: '#F59E0B',
      developmentPlan: {
        current: 65,
        target: 85,
        timeline: '2024-2026'
      }
    }
  ];

  // Projets d'urbanisme
  const urbanProjects = [
    {
      id: 'proj-1',
      name: 'Nouveau Marché Central',
      zone: 'Zone Commerciale Centre',
      type: 'Infrastructure Commerciale',
      status: 'En Cours',
      progress: 65,
      budget: '450M FCFA',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      responsible: 'Direction Urbanisme',
      description: 'Construction d\'un marché moderne avec 200 étals'
    },
    {
      id: 'proj-2',
      name: 'Extension Réseau Électrique',
      zone: 'Zone Résidentielle Nord',
      type: 'Infrastructure Énergétique',
      status: 'Planifié',
      progress: 25,
      budget: '280M FCFA',
      startDate: '2024-03-01',
      endDate: '2024-08-15',
      responsible: 'Service Technique',
      description: 'Raccordement électrique des nouveaux quartiers'
    },
    {
      id: 'proj-3',
      name: 'Parc Technologique',
      zone: 'Zone Industrielle Sud',
      type: 'Développement Économique',
      status: 'Étude',
      progress: 10,
      budget: '1.2Md FCFA',
      startDate: '2024-06-01',
      endDate: '2025-12-31',
      responsible: 'Direction Économique',
      description: 'Centre d\'innovation et d\'incubation d\'entreprises'
    }
  ];

  // Réglementations urbaines
  const urbanRegulations = [
    {
      id: 'reg-1',
      title: 'Coefficient d\'Occupation du Sol',
      zones: ['Résidentielle', 'Commerciale'],
      description: 'Limite la densité de construction par zone',
      lastUpdate: '2024-01-10',
      status: 'Active'
    },
    {
      id: 'reg-2',
      title: 'Hauteur Maximale des Bâtiments',
      zones: ['Résidentielle'],
      description: 'Fixe les limites de hauteur selon les zones',
      lastUpdate: '2023-12-15',
      status: 'Active'
    },
    {
      id: 'reg-3',
      title: 'Espaces Verts Obligatoires',
      zones: ['Toutes zones'],
      description: 'Pourcentage minimum d\'espaces verts par projet',
      lastUpdate: '2024-01-05',
      status: 'En révision'
    }
  ];

  const getZoneTypeIcon = (type) => {
    switch (type) {
      case 'Résidentielle': return Home;
      case 'Commerciale': return ShoppingCart;
      case 'Agricole': return TreePine;
      case 'Industrielle': return Factory;
      default: return Building2;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Développée': return 'bg-green-100 text-green-800';
      case 'En Expansion': return 'bg-blue-100 text-blue-800';
      case 'En Développement': return 'bg-orange-100 text-orange-800';
      case 'Préservée': return 'bg-purple-100 text-purple-800';
      case 'En Cours': return 'bg-yellow-100 text-yellow-800';
      case 'Planifié': return 'bg-blue-100 text-blue-800';
      case 'Étude': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Haute': return 'bg-red-500';
      case 'Moyenne': return 'bg-orange-500';
      case 'Normale': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Planification Urbaine</h2>
          <p className="text-gray-600 mt-1">
            Gestion et développement du territoire municipal
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button 
            variant="outline"
            onClick={handleExportPlan}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Plan
          </Button>
          <Button 
            className="bg-teal-600 hover:bg-teal-700"
            onClick={handleCreateNewZone}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Projet
          </Button>
        </div>
      </div>

      {/* Tabs navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="zones">Zones Urbaines</TabsTrigger>
          <TabsTrigger value="projects">Projets</TabsTrigger>
          <TabsTrigger value="regulations">Réglementations</TabsTrigger>
          <TabsTrigger value="map">Carte Interactive</TabsTrigger>
        </TabsList>

        {/* Zones Urbaines */}
        <TabsContent value="zones" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {urbanZones.map((zone) => {
              const IconComponent = getZoneTypeIcon(zone.type);
              return (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => handleViewDetails(zone)}
                >
                  <Card className="h-full border-l-4" style={{ borderLeftColor: zone.color }}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${zone.color}20` }}
                          >
                            <IconComponent 
                              className="h-5 w-5" 
                              style={{ color: zone.color }}
                            />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{zone.name}</CardTitle>
                            <CardDescription>{zone.type}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(zone.priority)}`} />
                          <Badge className={getStatusColor(zone.status)}>
                            {zone.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Statistiques de base */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Surface</span>
                          <p className="font-medium text-gray-900">{zone.area}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Population</span>
                          <p className="font-medium text-gray-900">{zone.population.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Densité</span>
                          <p className="font-medium text-gray-900">{zone.density}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Occupation</span>
                          <p className="font-medium text-gray-900">{zone.occupancyRate}%</p>
                        </div>
                      </div>

                      {/* Barre de progression occupation */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Taux d'occupation</span>
                          <span className="text-sm font-medium text-gray-900">{zone.occupancyRate}%</span>
                        </div>
                        <Progress value={zone.occupancyRate} className="h-2" />
                      </div>

                      {/* Plan de développement */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Plan de développement</span>
                          <span className="text-xs text-gray-500">{zone.developmentPlan.timeline}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Actuel: {zone.developmentPlan.current}%</span>
                          <span className="text-sm">Cible: {zone.developmentPlan.target}%</span>
                        </div>
                        <Progress 
                          value={(zone.developmentPlan.current / zone.developmentPlan.target) * 100} 
                          className="h-1 mt-2" 
                        />
                      </div>

                      {/* Infrastructures */}
                      <div>
                        <span className="text-sm text-gray-600 mb-2 block">Infrastructures</span>
                        <div className="flex flex-wrap gap-1">
                          {zone.infrastructures.slice(0, 3).map((infra, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {infra}
                            </Badge>
                          ))}
                          {zone.infrastructures.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{zone.infrastructures.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Projets */}
        <TabsContent value="projects" className="space-y-6">
          <div className="space-y-6">
            {urbanProjects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>{project.zone} • {project.type}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{project.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Budget</span>
                      <p className="font-medium text-gray-900">{project.budget}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Début</span>
                      <p className="font-medium text-gray-900">
                        {new Date(project.startDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Fin prévue</span>
                      <p className="font-medium text-gray-900">
                        {new Date(project.endDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Responsable</span>
                      <p className="font-medium text-gray-900">{project.responsible}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Progression</span>
                      <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Réglementations */}
        <TabsContent value="regulations" className="space-y-6">
          <div className="space-y-4">
            {urbanRegulations.map((regulation) => (
              <Card key={regulation.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{regulation.title}</CardTitle>
                      <CardDescription>
                        Zones applicables: {regulation.zones.join(', ')}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(regulation.status)}>
                        {regulation.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-700 mb-4">{regulation.description}</p>
                  <div className="text-sm text-gray-600">
                    Dernière mise à jour: {new Date(regulation.lastUpdate).toLocaleDateString('fr-FR')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Carte Interactive */}
        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="h-5 w-5 text-blue-600 mr-2" />
                Carte Interactive du Territoire
              </CardTitle>
              <CardDescription>
                Visualisation géographique des zones et projets
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8 text-center">
                <Map className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Carte Interactive
                </h3>
                <p className="text-gray-600 mb-4">
                  Intégration avec système de cartographie avancé
                </p>
                <div className="flex justify-center space-x-3">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Camera className="h-4 w-4 mr-2" />
                    Vue Satellite
                  </Button>
                  <Button variant="outline">
                    <Layers className="h-4 w-4 mr-2" />
                    Calques
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configuration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog détails zone sélectionnée */}
      {selectedZone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{selectedZone.name}</h3>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedZone(null)}
                className="text-gray-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations détaillées */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Caractéristiques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Type</span>
                        <p className="font-medium text-gray-900">{selectedZone.type}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Surface</span>
                        <p className="font-medium text-gray-900">{selectedZone.area}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Population</span>
                        <p className="font-medium text-gray-900">{selectedZone.population.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Densité</span>
                        <p className="font-medium text-gray-900">{selectedZone.density}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Contraintes Réglementaires</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedZone.constraints.map((constraint, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm text-gray-700">{constraint}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Projets futurs */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Projets Futurs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedZone.futureProjects.map((project, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-700">{project}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Infrastructures Existantes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedZone.infrastructures.map((infra, index) => (
                        <Badge key={index} variant="secondary">
                          {infra}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setSelectedZone(null)}>
                Fermer
              </Button>
              <Button 
                className="bg-teal-600 hover:bg-teal-700"
                onClick={() => handleEditZone(selectedZone)}
                disabled={isLoading}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier Zone
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MairieUrbanPlanning;
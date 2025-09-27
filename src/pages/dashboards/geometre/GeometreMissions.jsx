import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target,
  MapPin,
  Calendar,
  Clock,
  Users,
  Eye,
  Edit,
  CheckCircle,
  AlertTriangle,
  Plus,
  Filter,
  Search,
  Download,
  Compass,
  Ruler,
  Map,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const GeometreMissions = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Données des missions
  const missions = [
    {
      id: 1,
      title: "Levé topographique complet",
      client: "Amadou Diallo",
      location: "Rufisque, Sénégal",
      type: "Topographie",
      status: "En cours",
      priority: "Haute",
      deadline: "2025-01-15",
      created: "2024-12-20",
      surface: "2.5 ha",
      progress: 75,
      budget: "450,000 XOF",
      coordinates: "14.7167° N, 17.4677° W",
      description: "Levé topographique détaillé pour projet de construction résidentielle"
    },
    {
      id: 2,
      title: "Bornage terrain résidentiel",
      client: "Fatou Sow",
      location: "Dakar, Plateau",
      type: "Bornage",
      status: "En attente",
      priority: "Moyenne",
      deadline: "2025-01-20",
      created: "2024-12-18",
      surface: "800 m²",
      progress: 0,
      budget: "180,000 XOF",
      coordinates: "14.6937° N, 17.4441° W",
      description: "Délimitation précise des bornes de propriété"
    },
    {
      id: 3,
      title: "Levé cadastral zone industrielle",
      client: "SARL Teranga Construction",
      location: "Thiès",
      type: "Cadastral",
      status: "Terminé",
      priority: "Haute",
      deadline: "2025-01-10",
      created: "2024-12-10",
      surface: "15 ha",
      progress: 100,
      budget: "850,000 XOF",
      coordinates: "14.7886° N, 16.9261° W",
      description: "Levé cadastral pour zone d'expansion industrielle"
    },
    {
      id: 4,
      title: "Mise à jour plan parcellaire",
      client: "Mairie de Guédiawaye",
      location: "Guédiawaye",
      type: "Mise à jour",
      status: "En révision",
      priority: "Moyenne",
      deadline: "2025-01-25",
      created: "2024-12-15",
      surface: "5.2 ha",
      progress: 90,
      budget: "320,000 XOF",
      coordinates: "14.7667° N, 17.4167° W",
      description: "Actualisation du plan parcellaire suite aux nouveaux aménagements"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En révision': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Haute': return 'bg-red-100 text-red-800';
      case 'Moyenne': return 'bg-orange-100 text-orange-800';
      case 'Basse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Topographie': return Compass;
      case 'Bornage': return Target;
      case 'Cadastral': return Map;
      case 'Mise à jour': return Edit;
      default: return FileText;
    }
  };

  const filteredMissions = () => {
    switch (activeTab) {
      case 'active': return missions.filter(m => m.status === 'En cours' || m.status === 'En révision');
      case 'pending': return missions.filter(m => m.status === 'En attente');
      case 'completed': return missions.filter(m => m.status === 'Terminé');
      default: return missions;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Missions</h1>
            <p className="text-gray-600 mt-1">Gestion de vos projets de mesure et topographie</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Mission
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input placeholder="Rechercher par client, localisation..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Toutes ({missions.length})</TabsTrigger>
            <TabsTrigger value="active">Actives ({missions.filter(m => m.status === 'En cours' || m.status === 'En révision').length})</TabsTrigger>
            <TabsTrigger value="pending">En attente ({missions.filter(m => m.status === 'En attente').length})</TabsTrigger>
            <TabsTrigger value="completed">Terminées ({missions.filter(m => m.status === 'Terminé').length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredMissions().map((mission, index) => {
              const TypeIcon = getTypeIcon(mission.type);
              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <TypeIcon className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{mission.title}</h3>
                            <p className="text-gray-600 mt-1">{mission.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {mission.client}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {mission.location}
                              </div>
                              <div className="flex items-center">
                                <Ruler className="w-4 h-4 mr-1" />
                                {mission.surface}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getStatusColor(mission.status)}>
                              {mission.status}
                            </Badge>
                            <Badge className={getPriorityColor(mission.priority)}>
                              {mission.priority}
                            </Badge>
                          </div>
                          <p className="text-lg font-bold text-gray-900">{mission.budget}</p>
                          <p className="text-sm text-gray-500">Budget alloué</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Date limite</p>
                          <div className="flex items-center mt-1">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {new Date(mission.deadline).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Type de mission</p>
                          <p className="text-sm text-gray-900 mt-1">{mission.type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Coordonnées</p>
                          <p className="text-sm text-gray-900 mt-1">{mission.coordinates}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-medium text-gray-600">Progression</span>
                          <span className="text-gray-900 font-medium">{mission.progress}%</span>
                        </div>
                        <Progress value={mission.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Créé le {new Date(mission.created).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Détails
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Modifier
                          </Button>
                          <Button size="sm">
                            <FileText className="w-4 h-4 mr-1" />
                            Rapport
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{missions.length}</p>
              <p className="text-sm text-gray-600">Total missions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {missions.filter(m => m.status === 'En cours').length}
              </p>
              <p className="text-sm text-gray-600">En cours</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {missions.filter(m => m.status === 'Terminé').length}
              </p>
              <p className="text-sm text-gray-600">Terminées</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {missions.filter(m => new Date(m.deadline) < new Date() && m.status !== 'Terminé').length}
              </p>
              <p className="text-sm text-gray-600">En retard</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GeometreMissions;
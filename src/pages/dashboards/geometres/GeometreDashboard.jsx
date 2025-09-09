import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  MapPin, 
  Ruler,
  Calculator,
  FileText, 
  Users, 
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Calendar,
  Camera,
  Map,
  Building2,
  Phone,
  Mail,
  Eye,
  Edit,
  Download,
  Plus,
  TrendingUp,
  BarChart3,
  Award,
  Shield,
  Target,
  Layers,
  Search,
  Filter,
  Satellite,
  Route
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';

const GeometreDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalMissions: 189,
      missionsActives: 15,
      missionsMois: 12,
      revenus: 8750000,
      precision: 99.8
    },
    missions: [
      {
        id: 1,
        numero: 'GEO-2024-0087',
        type: 'Levé Topographique',
        client: 'ABC Promotion',
        projet: 'Lotissement Saly Beach',
        superficie: '12.5 ha',
        localisation: 'Saly, Mbour',
        statut: 'En cours',
        progression: 65,
        dateDebut: '2024-03-10',
        dateFin: '2024-03-30',
        prix: 2500000,
        equipment: ['GPS RTK', 'Station Totale', 'Drone']
      },
      {
        id: 2,
        numero: 'GEO-2024-0082',
        type: 'Bornage',
        client: 'M. Amadou Diallo',
        projet: 'Délimitation Terrain Villa',
        superficie: '800 m²',
        localisation: 'Almadies, Dakar',
        statut: 'Finalisé',
        progression: 100,
        dateDebut: '2024-02-20',
        dateFin: '2024-03-05',
        prix: 650000,
        equipment: ['GPS', 'Bornes', 'Niveau']
      },
      {
        id: 3,
        numero: 'GEO-2024-0091',
        type: 'Plan Cadastral',
        client: 'Municipalité Thiès',
        projet: 'Mise à jour Cadastre Zone Industrielle',
        superficie: '45 ha',
        localisation: 'Thiès Est',
        statut: 'En attente',
        progression: 25,
        dateDebut: '2024-03-18',
        dateFin: '2024-04-25',
        prix: 4200000,
        equipment: ['Drone', 'GPS RTK', 'LIDAR']
      }
    ],
    equipment: [
      {
        id: 1,
        nom: 'Station Totale Leica TS16',
        type: 'Mesure',
        statut: 'Disponible',
        precision: '1mm + 1.5ppm',
        dernierEntretien: '2024-02-15',
        prochainEntretien: '2024-05-15',
        utilisationMois: 85
      },
      {
        id: 2,
        nom: 'GPS RTK Trimble R12',
        type: 'Positionnement',
        statut: 'En mission',
        precision: '10mm + 1ppm',
        dernierEntretien: '2024-01-20',
        prochainEntretien: '2024-04-20',
        utilisationMois: 92
      },
      {
        id: 3,
        nom: 'Drone DJI Phantom 4 RTK',
        type: 'Photogrammétrie',
        statut: 'Maintenance',
        precision: '3cm GSD',
        dernierEntretien: '2024-03-01',
        prochainEntretien: '2024-03-20',
        utilisationMois: 68
      }
    ],
    clients: [
      {
        id: 1,
        nom: 'ABC Promotion',
        email: 'contact@abc-promotion.sn',
        telephone: '+221 33 825 12 34',
        type: 'Promoteur',
        nbMissions: 8,
        valeurTotale: 15600000,
        derniereMission: '2024-03-10',
        specialite: 'Lotissements'
      },
      {
        id: 2,
        nom: 'Municipalité Thiès',
        email: 'technique@mairie-thies.sn',
        telephone: '+221 33 951 23 45',
        type: 'Administration',
        nbMissions: 12,
        valeurTotale: 8900000,
        derniereMission: '2024-03-18',
        specialite: 'Cadastre'
      }
    ],
    analytics: {
      typesMissions: {
        'Levés Topographiques': 35,
        'Bornages': 25,
        'Plans Cadastraux': 20,
        'Photogrammétrie': 15,
        'Études Techniques': 5
      },
      evolutionCA: [650, 720, 850, 780, 920, 875],
      satisfactionClient: 96,
      delaisMoyens: 18,
      precisionMoyenne: 99.8
    }
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const stats = [
    { value: dashboardData.stats.totalMissions, label: 'Total Missions' },
    { value: dashboardData.stats.missionsActives, label: 'Missions Actives' },
    { value: dashboardData.stats.missionsMois, label: 'Missions ce Mois' },
    { value: `${dashboardData.stats.precision}%`, label: 'Précision Moyenne' }
  ];

  const getStatutColor = (statut) => {
    const colors = {
      'En cours': 'bg-blue-500',
      'Finalisé': 'bg-green-500',
      'En attente': 'bg-yellow-500',
      'Suspendu': 'bg-red-500',
      'Disponible': 'bg-green-500',
      'En mission': 'bg-blue-500',
      'Maintenance': 'bg-orange-500',
      'Hors service': 'bg-red-500'
    };
    return colors[statut] || 'bg-gray-500';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre cabinet géomètre...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Cabinet Géomètre-Expert"
      subtitle="Mesures, relevés et études topographiques"
      userRole="Géomètre"
      stats={stats}
    >
      <div className="space-y-6">
        {/* Widgets IA & Blockchain */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AIAssistantWidget userRole="Géomètre" dashboardData={dashboardData} />
          <BlockchainWidget userRole="Géomètre" />
        </div>

        {/* Métriques Géomètre */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Revenus Mensuels</p>
                  <p className="text-lg font-bold text-indigo-600">
                    {formatCurrency(dashboardData.stats.revenus)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+18% vs mois dernier</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Délai Moyen</p>
                  <p className="text-lg font-bold text-blue-600">
                    {dashboardData.analytics.delaisMoyens} jours
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <Progress value={80} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Équipements Actifs</p>
                  <p className="text-lg font-bold text-green-600">
                    {dashboardData.equipment.filter(e => e.statut === 'Disponible' || e.statut === 'En mission').length}
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <Progress value={85} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Certifications</p>
                  <p className="text-lg font-bold text-purple-600">4</p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <Shield className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-purple-600">Ordre des Géomètres</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu Principal */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="missions">Missions</TabsTrigger>
            <TabsTrigger value="equipment">Équipements</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Actions Rapides */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Compass className="h-5 w-5 mr-2 text-indigo-600" />
                    Actions Rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle Mission
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Map className="h-4 w-4 mr-2" />
                    Consulter Plans
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Photos
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculatrice Géo
                  </Button>
                </CardContent>
              </Card>

              {/* Missions Actives */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Ruler className="h-5 w-5 mr-2 text-blue-600" />
                      Missions en Cours
                    </span>
                    <Button size="sm" variant="outline">Voir tout</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.missions.filter(m => m.statut === 'En cours').slice(0, 3).map((mission) => (
                      <div key={mission.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{mission.numero}</h4>
                            <p className="text-sm text-gray-600">{mission.type} - {mission.projet}</p>
                          </div>
                          <Badge className={`${getStatutColor(mission.statut)} text-white`}>
                            {mission.statut}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Surface: {mission.superficie}</span>
                          <span>Prix: {formatCurrency(mission.prix)}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progression</span>
                            <span>{mission.progression}%</span>
                          </div>
                          <Progress value={mission.progression} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Équipements & Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-green-600" />
                    État des Équipements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.equipment.slice(0, 3).map((eq) => (
                      <div key={eq.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-sm">{eq.nom}</h4>
                            <p className="text-xs text-gray-600">{eq.type}</p>
                          </div>
                          <Badge className={`${getStatutColor(eq.statut)} text-white text-xs`}>
                            {eq.statut}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          <p>Précision: {eq.precision}</p>
                          <p>Utilisation: {eq.utilisationMois}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                    Performance ce Mois
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Nouvelles missions</span>
                      <span className="font-bold text-green-600">+{dashboardData.stats.missionsMois}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Missions finalisées</span>
                      <span className="font-bold text-blue-600">9</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Revenus générés</span>
                      <span className="font-bold text-purple-600">{formatCurrency(dashboardData.stats.revenus)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Précision moyenne</span>
                      <span className="font-bold text-orange-600">{dashboardData.stats.precision}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Missions Tab */}
          <TabsContent value="missions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Missions</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Mission
                </Button>
              </div>
            </div>

            {/* Statistiques Missions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {dashboardData.missions.filter(m => m.statut === 'En cours').length}
                    </p>
                    <p className="text-sm text-gray-600">En Cours</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {dashboardData.missions.filter(m => m.statut === 'En attente').length}
                    </p>
                    <p className="text-sm text-gray-600">En Attente</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {dashboardData.missions.filter(m => m.statut === 'Finalisé').length}
                    </p>
                    <p className="text-sm text-gray-600">Finalisées</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(dashboardData.missions.reduce((sum, m) => sum + m.prix, 0))}
                    </p>
                    <p className="text-sm text-gray-600">CA Total</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des Missions */}
            <div className="grid gap-6">
              {dashboardData.missions.map((mission) => (
                <Card key={mission.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{mission.numero}</h3>
                          <Badge className={`${getStatutColor(mission.statut)} text-white`}>
                            {mission.statut}
                          </Badge>
                          <Badge variant="outline">
                            {mission.type}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Projet</p>
                            <p className="font-medium">{mission.projet}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Superficie</p>
                            <p className="font-medium text-green-600">{mission.superficie}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Prix</p>
                            <p className="font-medium text-blue-600">{formatCurrency(mission.prix)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Fin prévue</p>
                            <p className="font-medium">{new Date(mission.dateFin).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progression</span>
                            <span>{mission.progression}%</span>
                          </div>
                          <Progress value={mission.progression} className="h-3" />
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {mission.localisation}
                          </span>
                          <span>Client: {mission.client}</span>
                          <span>Équipements: {mission.equipment.join(', ')}</span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline">
                          <Map className="h-4 w-4 mr-1" />
                          Plan
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Équipements</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvel Équipement
              </Button>
            </div>

            <div className="grid gap-4">
              {dashboardData.equipment.map((eq) => (
                <Card key={eq.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{eq.nom}</h3>
                          <Badge className={`${getStatutColor(eq.statut)} text-white`}>
                            {eq.statut}
                          </Badge>
                          <Badge variant="outline">
                            {eq.type}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Précision</p>
                            <p className="font-medium">{eq.precision}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Dernier Entretien</p>
                            <p className="font-medium">{new Date(eq.dernierEntretien).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Prochain Entretien</p>
                            <p className="font-medium">{new Date(eq.prochainEntretien).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Utilisation</p>
                            <p className="font-medium">{eq.utilisationMois}%</p>
                          </div>
                        </div>

                        <div className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Taux d'utilisation</span>
                            <span>{eq.utilisationMois}%</span>
                          </div>
                          <Progress value={eq.utilisationMois} className="h-2" />
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Entretien
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Base Clients</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Client
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {dashboardData.clients.map((client) => (
                <Card key={client.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{client.nom}</h3>
                          <Badge variant="outline">
                            {client.type}
                          </Badge>
                          <Badge variant="secondary">
                            {client.specialite}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">{client.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Téléphone</p>
                            <p className="font-medium">{client.telephone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Nb Missions</p>
                            <p className="font-medium">{client.nbMissions}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Valeur Totale</p>
                            <p className="font-medium text-green-600">{formatCurrency(client.valeurTotale)}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Dernière mission: {new Date(client.derniereMission).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Appeler
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Dossier
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Analytics Géomètre</h2>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter Rapport
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Types de Missions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(dashboardData.analytics.typesMissions).map(([type, percentage]) => (
                      <div key={type}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{type}</span>
                          <span className="text-sm">{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performances Techniques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{dashboardData.analytics.precisionMoyenne}%</p>
                      <p className="text-sm text-gray-600">Précision moyenne</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{dashboardData.analytics.delaisMoyens}j</p>
                      <p className="text-sm text-gray-600">Délai moyen</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{dashboardData.analytics.satisfactionClient}%</p>
                      <p className="text-sm text-gray-600">Satisfaction client</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default GeometreDashboard;

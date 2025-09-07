import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Compass, FileText, Calendar, Plus, Eye, 
  Clock, CheckCircle, AlertCircle, Star, Filter, 
  ChevronRight, BarChart3, Target, Award, Settings,
  Package, Download, Phone, Mail, Globe, Briefcase,
  Shield, Calculator, Activity, Home, UserCheck,
  ClipboardList, Map, Ruler, Building, Navigation,
  DollarSign, TrendingUp, Camera, Layers, Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ModernSidebar from '@/components/layout/ModernSidebar';
import { useUser } from '@/hooks/useUser';

const ModernGeometreDashboard = () => {
  const { user, profile } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [dashboardData, setDashboardData] = useState({
    stats: {
      missionesEnCours: 18,
      plansFinalises: 8,
      revisionsEnCours: 5,
      rdvTerrain: 12,
      totalHonoraires: 15800000,
      clientsActifs: 45,
      surfaceMesuree: 125000,
      tauxPrecision: 99.8
    },
    missions: [
      {
        id: 1,
        type: 'Bornage',
        client: 'Amadou Diop',
        clientType: 'Particulier',
        propriete: 'Villa résidentielle',
        localisation: 'Almadies, Dakar',
        surface: 500,
        statut: 'Levé en cours',
        dateCommande: '2024-03-10',
        dateEcheance: '2024-03-25',
        honoraires: 850000,
        avancement: 65,
        coordonnees: { lat: 14.7392, lng: -17.4932 },
        equipesAssignees: ['Équipe A'],
        priorite: 'Normal'
      },
      {
        id: 2,
        type: 'Plan topographique',
        client: 'SARL Construction Plus',
        clientType: 'Entreprise',
        propriete: 'Terrain de construction',
        localisation: 'Guédiawaye',
        surface: 2500,
        statut: 'Calculs en cours',
        dateCommande: '2024-03-08',
        dateEcheance: '2024-03-30',
        honoraires: 1800000,
        avancement: 80,
        coordonnees: { lat: 14.7859, lng: -17.4056 },
        equipesAssignees: ['Équipe B'],
        priorite: 'Élevé'
      },
      {
        id: 3,
        type: 'Lotissement',
        client: 'Promoteur Immobilier Sénégal',
        clientType: 'Promoteur',
        propriete: 'Projet de lotissement',
        localisation: 'VDN, Dakar',
        surface: 15000,
        statut: 'Finalisé',
        dateCommande: '2024-02-15',
        dateEcheance: '2024-03-15',
        honoraires: 4500000,
        avancement: 100,
        coordonnees: { lat: 14.7167, lng: -17.4677 },
        equipesAssignees: ['Équipe A', 'Équipe C'],
        priorite: 'Élevé'
      }
    ],
    equipement: [
      {
        nom: 'Station totale Leica TS16',
        statut: 'Disponible',
        derniereUtilisation: '2024-03-14',
        prochaineMaintenance: '2024-04-15',
        precision: '1mm + 1.5ppm',
        utilisateur: null
      },
      {
        nom: 'GPS RTK Trimble R12',
        statut: 'En mission',
        derniereUtilisation: '2024-03-15',
        prochaineMaintenance: '2024-05-20',
        precision: '2cm',
        utilisateur: 'Équipe A'
      },
      {
        nom: 'Théodolite Topcon DT-209',
        statut: 'Maintenance',
        derniereUtilisation: '2024-03-10',
        prochaineMaintenance: '2024-03-18',
        precision: '9" angulaire',
        utilisateur: null
      }
    ],
    equipes: [
      {
        nom: 'Équipe A',
        chef: 'Moussa Sall',
        membres: ['Omar Dieng', 'Fatou Ba'],
        statut: 'Sur terrain',
        missionActuelle: 'Bornage Almadies',
        localisation: 'Almadies, Dakar',
        planning: [
          { date: '2024-03-20', mission: 'Bornage Almadies', duree: 'Journée complète' },
          { date: '2024-03-21', mission: 'Levé VDN', duree: 'Demi-journée' }
        ]
      },
      {
        nom: 'Équipe B',
        chef: 'Aissatou Ndiaye',
        membres: ['Mamadou Cissé', 'Aminata Diop'],
        statut: 'Bureau calculs',
        missionActuelle: 'Plan topographique Guédiawaye',
        localisation: 'Bureau',
        planning: [
          { date: '2024-03-20', mission: 'Calculs et plans', duree: 'Journée complète' },
          { date: '2024-03-21', mission: 'Terrain Thiès', duree: 'Journée complète' }
        ]
      },
      {
        nom: 'Équipe C',
        chef: 'Ibrahima Diallo',
        membres: ['Khady Sy', 'Cheikh Fall'],
        statut: 'Disponible',
        missionActuelle: null,
        localisation: 'Bureau',
        planning: [
          { date: '2024-03-20', mission: 'Formation GPS', duree: 'Matinée' },
          { date: '2024-03-21', mission: 'Disponible', duree: '-' }
        ]
      }
    ],
    statistiquesZones: [
      {
        zone: 'Dakar Centre',
        nombreMissions: 45,
        surfaceTotale: 25000,
        honorairesMoyens: 1200000,
        tempsDeProduction: 12,
        satisfaction: 95.2
      },
      {
        zone: 'Almadies/VDN',
        nombreMissions: 32,
        surfaceTotale: 18000,
        honorairesMoyens: 1500000,
        tempsDeProduction: 10,
        satisfaction: 97.8
      },
      {
        zone: 'Guédiawaye/Pikine',
        nombreMissions: 28,
        surfaceTotale: 35000,
        honorairesMoyens: 950000,
        tempsDeProduction: 15,
        satisfaction: 92.1
      }
    ],
    recentActivities: [
      {
        id: 1,
        type: 'mission_completed',
        title: 'Mission finalisée',
        description: 'Lotissement VDN - Promoteur Immobilier Sénégal',
        timestamp: '2024-03-15T16:30:00Z',
        icon: CheckCircle,
        amount: 4500000
      },
      {
        id: 2,
        type: 'field_work_started',
        title: 'Travaux terrain',
        description: 'Début bornage Almadies - Équipe A déployée',
        timestamp: '2024-03-15T08:00:00Z',
        icon: MapPin,
        amount: null
      },
      {
        id: 3,
        type: 'new_mission',
        title: 'Nouvelle mission',
        description: 'Plan topographique Guédiawaye - SARL Construction Plus',
        timestamp: '2024-03-14T14:20:00Z',
        icon: FileText,
        amount: 1800000
      }
    ]
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'finalisé':
        return 'bg-green-100 text-green-800';
      case 'levé en cours':
        return 'bg-blue-100 text-blue-800';
      case 'calculs en cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'en attente validation':
        return 'bg-orange-100 text-orange-800';
      case 'disponible':
        return 'bg-green-100 text-green-800';
      case 'en mission':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      case 'sur terrain':
        return 'bg-blue-100 text-blue-800';
      case 'bureau calculs':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'élevé':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'faible':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sidebarItems = [
    {
      id: 'missions',
      label: 'Missions',
      icon: Map,
      href: '/missions-topographie',
      badge: dashboardData.stats.missionesEnCours
    },
    {
      id: 'planning',
      label: 'Planning équipes',
      icon: Calendar,
      href: '/planning-equipes-terrain',
      badge: null
    },
    {
      id: 'equipment',
      label: 'Équipements',
      icon: Compass,
      href: '/gestion-equipements',
      badge: null
    },
    {
      id: 'clients',
      label: 'Mes clients',
      icon: Users,
      href: '/mes-clients-geometre',
      badge: null
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      <ModernSidebar 
        sidebarItems={sidebarItems} 
        currentPage="dashboard"
      />
      
      <div className="flex-1 ml-80 p-6 bg-gray-50 min-h-screen">
        <Helmet>
          <title>Dashboard Géomètre - Teranga Foncier</title>
          <meta name="description" content="Tableau de bord géomètre topographe sur Teranga Foncier" />
        </Helmet>

        {/* En-tête avec photo de profil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20 border-4 border-white/20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-white/20 text-white text-2xl">
                    {profile?.name ? 
                      profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                      (user?.email ? user.email.slice(0, 2).toUpperCase() : 'G')
                    }
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Bonjour, {profile?.name || user?.email?.split('@')[0] || 'Géomètre'} ! 🗺️
                  </h1>
                  <p className="text-orange-100 text-lg">Géomètre-Topographe</p>
                  {profile?.company && (
                    <p className="text-orange-200 flex items-center mt-1">
                      <Building className="w-4 h-4 mr-1" />
                      {profile.company}
                    </p>
                  )}
                  <p className="text-orange-200 flex items-center mt-1">
                    <Phone className="w-4 h-4 mr-1" />
                    +221 77 593 42 41
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">
                  {dashboardData.stats.surfaceMesuree.toLocaleString()} m²
                </div>
                <div className="text-orange-200">Surface mesurée ce mois</div>
                <div className="text-sm text-orange-300 mt-1">
                  {dashboardData.stats.tauxPrecision}% de précision
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistiques principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Missions en cours</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.missionesEnCours}
                  </p>
                  <p className="text-xs text-orange-600">
                    À finaliser
                  </p>
                </div>
                <Map className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">RDV terrain</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.rdvTerrain}
                  </p>
                  <p className="text-xs text-blue-600">
                    Cette semaine
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Plans finalisés</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.plansFinalises}
                  </p>
                  <p className="text-xs text-green-600">
                    Ce mois
                  </p>
                </div>
                <FileText className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Honoraires</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {(dashboardData.stats.totalHonoraires / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-purple-600">
                    XOF ce mois
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col space-y-2">
                  <Plus className="w-6 h-6" />
                  <span className="text-sm">Nouvelle mission</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <MapPin className="w-6 h-6" />
                  <span className="text-sm">Planning terrain</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Compass className="w-6 h-6" />
                  <span className="text-sm">État équipements</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <BarChart3 className="w-6 h-6" />
                  <span className="text-sm">Rapports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contenu principal avec onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="missions">Missions</TabsTrigger>
            <TabsTrigger value="equipes">Équipes</TabsTrigger>
            <TabsTrigger value="equipement">Équipement</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activités récentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Activités récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentActivities.map((activity) => {
                      const Icon = activity.icon;
                      return (
                        <div key={activity.id} className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {activity.description}
                            </p>
                            {activity.amount && (
                              <p className="text-sm font-semibold text-green-600">
                                {formatCurrency(activity.amount)}
                              </p>
                            )}
                            <p className="text-xs text-gray-400">
                              {new Date(activity.timestamp).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* État des équipes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    État des équipes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.equipes.map((equipe, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{equipe.nom}</h4>
                          <Badge className={getStatusColor(equipe.statut)}>
                            {equipe.statut}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p><span className="font-medium">Chef:</span> {equipe.chef}</p>
                          <p><span className="font-medium">Membres:</span> {equipe.membres.join(', ')}</p>
                          {equipe.missionActuelle && (
                            <p><span className="font-medium">Mission:</span> {equipe.missionActuelle}</p>
                          )}
                          <p><span className="font-medium">Localisation:</span> {equipe.localisation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Statistiques par zone */}
            <Card>
              <CardHeader>
                <CardTitle>Performance par zone géographique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {dashboardData.statistiquesZones.map((zone, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-lg mb-3">{zone.zone}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Missions:</span>
                          <span className="font-medium">{zone.nombreMissions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Surface totale:</span>
                          <span className="font-medium">{zone.surfaceTotale.toLocaleString()} m²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Honoraires moyens:</span>
                          <span className="font-medium text-green-600">{formatCurrency(zone.honorairesMoyens)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Temps production:</span>
                          <span className="font-medium">{zone.tempsDeProduction}j</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Satisfaction:</span>
                          <span className="font-medium text-blue-600">{zone.satisfaction}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Missions */}
          <TabsContent value="missions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Missions en cours</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle mission
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {dashboardData.missions.map((mission) => (
                <Card key={mission.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {mission.type.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{mission.type}</h3>
                            <p className="text-sm text-gray-600">{mission.client} • {mission.clientType}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(mission.statut)}>
                                {mission.statut}
                              </Badge>
                              <Badge className={getPriorityColor(mission.priorite)}>
                                Priorité {mission.priorite?.toLowerCase()}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-500">Propriété:</span>
                            <p className="font-medium">{mission.propriete}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Localisation:</span>
                            <p className="font-medium">{mission.localisation}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Surface:</span>
                            <p className="font-medium">{mission.surface.toLocaleString()} m²</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Honoraires:</span>
                            <p className="font-semibold text-green-600">{formatCurrency(mission.honoraires)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-500">Équipes assignées:</span>
                            <p className="font-medium">{mission.equipesAssignees.join(', ')}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Date commande:</span>
                            <p className="font-medium">{new Date(mission.dateCommande).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Échéance:</span>
                            <p className="font-medium">{new Date(mission.dateEcheance).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-500">Avancement</span>
                            <span className="font-medium">{mission.avancement}%</span>
                          </div>
                          <Progress value={mission.avancement} />
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline">
                          <MapPin className="w-4 h-4 mr-2" />
                          Localiser
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Plans
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Équipes */}
          <TabsContent value="equipes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gestion des équipes terrain</h2>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Planning semaine
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.equipes.map((equipe, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{equipe.nom}</h3>
                        <Badge className={getStatusColor(equipe.statut)}>
                          {equipe.statut}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Chef d'équipe:</span> {equipe.chef}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Membres:</span> {equipe.membres.join(', ')}
                      </p>
                    </div>

                    <div className="space-y-3 mb-4">
                      {equipe.missionActuelle && (
                        <div>
                          <span className="text-sm text-gray-500">Mission actuelle:</span>
                          <p className="font-medium text-blue-600">{equipe.missionActuelle}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-sm text-gray-500">Localisation:</span>
                        <p className="font-medium">{equipe.localisation}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Planning à venir:</h4>
                      <div className="space-y-2">
                        {equipe.planning.map((planItem, planIndex) => (
                          <div key={planIndex} className="text-xs p-2 bg-gray-50 rounded">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{new Date(planItem.date).toLocaleDateString('fr-FR')}</span>
                              <span className="text-gray-500">{planItem.duree}</span>
                            </div>
                            <p className="text-gray-600">{planItem.mission}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Planning
                      </Button>
                      <Button variant="outline" size="sm">
                        <MapPin className="w-4 h-4 mr-2" />
                        Localiser
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Équipement */}
          <TabsContent value="equipement" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">État des équipements</h2>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Maintenance
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.equipement.map((equip, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{equip.nom}</h3>
                        <Badge className={getStatusColor(equip.statut)}>
                          {equip.statut}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Précision: {equip.precision}
                      </p>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Dernière utilisation:</span>
                        <p className="font-medium">{new Date(equip.derniereUtilisation).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Prochaine maintenance:</span>
                        <p className="font-medium">{new Date(equip.prochaineMaintenance).toLocaleDateString('fr-FR')}</p>
                      </div>
                      {equip.utilisateur && (
                        <div>
                          <span className="text-sm text-gray-500">Utilisateur actuel:</span>
                          <p className="font-medium text-blue-600">{equip.utilisateur}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1" 
                        size="sm"
                        disabled={equip.statut === 'En mission' || equip.statut === 'Maintenance'}
                      >
                        <Compass className="w-4 h-4 mr-2" />
                        {equip.statut === 'Disponible' ? 'Assigner' : 'Occupé'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Entretien
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations maintenance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-medium text-red-900 mb-2">
                      🔧 Maintenance urgente
                    </h4>
                    <p className="text-red-800">
                      Le Théodolite Topcon DT-209 est actuellement en maintenance. 
                      Vérifiez l'état de calibrage avant remise en service.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">
                      ⏰ Maintenance prochaine
                    </h4>
                    <p className="text-yellow-800">
                      La Station totale Leica TS16 nécessitera une maintenance dans 30 jours. 
                      Planifiez l'intervention pour éviter les interruptions de mission.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">
                      ✅ Équipement optimal
                    </h4>
                    <p className="text-green-800">
                      Le GPS RTK Trimble R12 fonctionne parfaitement avec une précision de 2cm. 
                      Excellent pour les missions de bornage de précision.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ModernGeometreDashboard;

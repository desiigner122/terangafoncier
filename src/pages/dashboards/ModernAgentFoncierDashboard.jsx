import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, MapPin, Users, FileText, Plus, Eye, Clock, 
  CheckCircle, AlertCircle, Star, Filter, ChevronRight, 
  BarChart3, Target, Award, Settings, Package, Download,
  Phone, Mail, Globe, Briefcase, Shield, Calculator,
  Activity, UserCheck, ClipboardList, Building,
  DollarSign, TrendingUp, Key, Search, UserPlus,
  Camera, Calendar, Zap, Navigation
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

const ModernAgentFoncierDashboard = () => {
  const { user, profile } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [dashboardData, setDashboardData] = useState({
    stats: {
      biensGeres: 24,
      ventesEnCours: 8,
      nouveauxClients: 5,
      visitesPrevues: 12,
      commissionsMois: 8500000,
      tauxReussite: 89.5,
      clientsActifs: 45,
      biensVendus: 6
    },
    biens: [
      {
        id: 1,
        type: 'Villa',
        adresse: 'Almadies, Dakar',
        prix: 85000000,
        surface: 250,
        terrain: 500,
        statut: 'En vente',
        proprietaire: 'Amadou Diop',
        contactProprietaire: '+221 77 123 45 67',
        dateInscription: '2024-03-01',
        visites: 8,
        interessesActifs: 3,
        description: 'Villa moderne 4 chambres avec piscine',
        commission: 2550000,
        photos: 12,
        caracteristiques: ['4 chambres', '3 salles de bain', 'Piscine', 'Garage 2 voitures']
      },
      {
        id: 2,
        type: 'Appartement',
        adresse: 'VDN, Dakar',
        prix: 45000000,
        surface: 120,
        terrain: 0,
        statut: 'Promesse de vente',
        proprietaire: 'Fatou Sall',
        contactProprietaire: '+221 77 987 65 43',
        dateInscription: '2024-02-15',
        visites: 12,
        interessesActifs: 1,
        description: 'Appartement 3 pièces standing avec terrasse',
        commission: 1350000,
        photos: 8,
        caracteristiques: ['3 pièces', '2 salles de bain', 'Terrasse', 'Parking']
      },
      {
        id: 3,
        type: 'Terrain',
        adresse: 'Saly, Mbour',
        prix: 25000000,
        surface: 0,
        terrain: 800,
        statut: 'Vendu',
        proprietaire: 'Ousmane Cissé',
        contactProprietaire: '+221 77 456 78 90',
        dateInscription: '2024-01-20',
        visites: 6,
        interessesActifs: 0,
        description: 'Terrain constructible proche mer',
        commission: 750000,
        photos: 5,
        caracteristiques: ['Constructible', 'Proche mer', 'Titre foncier', 'Accès route']
      }
    ],
    clients: [
      {
        id: 1,
        nom: 'Mamadou Ba',
        type: 'Acheteur',
        telephone: '+221 77 234 56 78',
        email: 'mamadou.ba@email.com',
        budget: { min: 40000000, max: 80000000 },
        preferences: ['Villa', 'Almadies', 'VDN'],
        statut: 'Actif',
        dernierContact: '2024-03-15',
        biensVus: 5,
        notes: 'Intéressé par villa avec piscine, budget flexible'
      },
      {
        id: 2,
        nom: 'Aissatou Ndiaye',
        type: 'Vendeuse',
        telephone: '+221 77 345 67 89',
        email: 'aissatou.ndiaye@email.com',
        budget: null,
        preferences: null,
        statut: 'En négociation',
        dernierContact: '2024-03-14',
        biensVus: 0,
        notes: 'Souhaite vendre appartement VDN rapidement'
      },
      {
        id: 3,
        nom: 'Ibrahima Diop',
        type: 'Acheteur',
        telephone: '+221 77 456 78 90',
        email: 'ibrahima.diop@email.com',
        budget: { min: 20000000, max: 35000000 },
        preferences: ['Terrain', 'Saly', 'Mbour'],
        statut: 'Intéressé',
        dernierContact: '2024-03-13',
        biensVus: 3,
        notes: 'Recherche terrain pour résidence secondaire'
      }
    ],
    visites: [
      {
        id: 1,
        bien: 'Villa Almadies',
        adresse: 'Almadies, Dakar',
        client: 'Mamadou Ba',
        dateVisite: '2024-03-20',
        heureVisite: '14:00',
        statut: 'Programmée',
        typeVisite: 'Première visite',
        accompagnateur: 'Agent principal',
        notes: 'Client très intéressé, à budget'
      },
      {
        id: 2,
        bien: 'Appartement VDN',
        adresse: 'VDN, Dakar',
        client: 'Aminata Sy',
        dateVisite: '2024-03-21',
        heureVisite: '10:30',
        statut: 'Confirmée',
        typeVisite: 'Seconde visite',
        accompagnateur: 'Agent principal',
        notes: 'Visite avec famille, proche décision'
      },
      {
        id: 3,
        bien: 'Terrain Saly',
        adresse: 'Saly, Mbour',
        client: 'Ibrahima Diop',
        dateVisite: '2024-03-19',
        heureVisite: '16:00',
        statut: 'Effectuée',
        typeVisite: 'Première visite',
        accompagnateur: 'Agent principal',
        notes: 'Client satisfait, demande réflexion'
      }
    ],
    negociations: [
      {
        id: 1,
        bien: 'Villa Almadies',
        prixAffiche: 85000000,
        offreClient: 78000000,
        statut: 'En cours',
        client: 'Mamadou Ba',
        etape: 'Contre-proposition',
        derniereMaj: '2024-03-15',
        notes: 'Propriétaire ouvert à 82M, client peut monter à 80M'
      },
      {
        id: 2,
        bien: 'Appartement VDN',
        prixAffiche: 45000000,
        offreClient: 42000000,
        statut: 'Acceptée',
        client: 'Aminata Sy',
        etape: 'Promesse de vente',
        derniereMaj: '2024-03-14',
        notes: 'Accord trouvé à 43M, rendez-vous notaire prévu'
      }
    ],
    recentActivities: [
      {
        id: 1,
        type: 'visite_programmee',
        title: 'Visite programmée',
        description: 'Villa Almadies - Mamadou Ba demain 14h',
        timestamp: '2024-03-15T16:30:00Z',
        icon: Calendar,
        priority: 'high'
      },
      {
        id: 2,
        type: 'negociation_avancee',
        title: 'Négociation avancée',
        description: 'Appartement VDN - Promesse de vente signée',
        timestamp: '2024-03-15T10:15:00Z',
        icon: UserPlus,
        priority: 'medium'
      },
      {
        id: 3,
        type: 'nouveau_client',
        title: 'Nouveau client',
        description: 'Contact Ibrahima Diop pour terrain Saly',
        timestamp: '2024-03-14T14:20:00Z',
        icon: UserCheck,
        priority: 'medium'
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
      case 'en vente':
        return 'bg-blue-100 text-blue-800';
      case 'promesse de vente':
        return 'bg-yellow-100 text-yellow-800';
      case 'vendu':
        return 'bg-green-100 text-green-800';
      case 'retiré':
        return 'bg-red-100 text-red-800';
      case 'programmée':
        return 'bg-blue-100 text-blue-800';
      case 'confirmée':
        return 'bg-green-100 text-green-800';
      case 'effectuée':
        return 'bg-gray-100 text-gray-800';
      case 'annulée':
        return 'bg-red-100 text-red-800';
      case 'en cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'acceptée':
        return 'bg-green-100 text-green-800';
      case 'refusée':
        return 'bg-red-100 text-red-800';
      case 'actif':
        return 'bg-green-100 text-green-800';
      case 'intéressé':
        return 'bg-blue-100 text-blue-800';
      case 'en négociation':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'villa':
        return 'bg-purple-100 text-purple-800';
      case 'appartement':
        return 'bg-blue-100 text-blue-800';
      case 'terrain':
        return 'bg-green-100 text-green-800';
      case 'immeuble':
        return 'bg-orange-100 text-orange-800';
      case 'acheteur':
        return 'bg-blue-100 text-blue-800';
      case 'vendeur':
      case 'vendeuse':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sidebarItems = [
    {
      id: 'biens',
      label: 'Mes biens',
      icon: Home,
      href: '/mes-biens-immobiliers',
      badge: dashboardData.stats.biensGeres
    },
    {
      id: 'clients',
      label: 'Mes clients',
      icon: Users,
      href: '/mes-clients-immobilier',
      badge: dashboardData.stats.clientsActifs
    },
    {
      id: 'visites',
      label: 'Visites',
      icon: Calendar,
      href: '/planning-visites',
      badge: dashboardData.stats.visitesPrevues
    },
    {
      id: 'recherches',
      label: 'Recherches',
      icon: Search,
      href: '/recherches-mandats',
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
          <title>Dashboard Agent Foncier - Teranga Foncier</title>
          <meta name="description" content="Tableau de bord agent immobilier sur Teranga Foncier" />
        </Helmet>

        {/* En-tête avec photo de profil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20 border-4 border-white/20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-white/20 text-white text-2xl">
                    {profile?.name ? 
                      profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                      (user?.email ? user.email.slice(0, 2).toUpperCase() : 'A')
                    }
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Bonjour, {profile?.name || user?.email?.split('@')[0] || 'Agent'} ! 🏡
                  </h1>
                  <p className="text-blue-100 text-lg">Agent Immobilier</p>
                  {profile?.company && (
                    <p className="text-blue-200 flex items-center mt-1">
                      <Building className="w-4 h-4 mr-1" />
                      {profile.company}
                    </p>
                  )}
                  <p className="text-blue-200 flex items-center mt-1">
                    <Phone className="w-4 h-4 mr-1" />
                    +221 77 593 42 41
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">
                  {formatCurrency(dashboardData.stats.commissionsMois)}
                </div>
                <div className="text-blue-200">Commissions ce mois</div>
                <div className="text-sm text-blue-300 mt-1">
                  {dashboardData.stats.tauxReussite}% taux de réussite
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
                  <p className="text-sm text-gray-600 mb-1">Biens gérés</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.biensGeres}
                  </p>
                  <p className="text-xs text-blue-600">
                    Portefeuille actif
                  </p>
                </div>
                <Home className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ventes en cours</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.ventesEnCours}
                  </p>
                  <p className="text-xs text-orange-600">
                    Négociations actives
                  </p>
                </div>
                <UserPlus className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Visites prévues</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.visitesPrevues}
                  </p>
                  <p className="text-xs text-green-600">
                    Cette semaine
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nouveaux clients</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.nouveauxClients}
                  </p>
                  <p className="text-xs text-purple-600">
                    Ce mois
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
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
                  <span className="text-sm">Nouveau bien</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">Programmer visite</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <UserCheck className="w-6 h-6" />
                  <span className="text-sm">Ajouter client</span>
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
            <TabsTrigger value="biens">Mes biens</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
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

              {/* Négociations en cours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Négociations en cours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.negociations.map((nego) => (
                      <div key={nego.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{nego.bien}</h4>
                          <Badge className={getStatusColor(nego.statut)}>
                            {nego.statut}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Prix affiché:</span>
                            <p className="font-medium">{formatCurrency(nego.prixAffiche)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Offre client:</span>
                            <p className="font-medium text-blue-600">{formatCurrency(nego.offreClient)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Client:</span>
                            <p className="font-medium">{nego.client}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Étape:</span>
                            <p className="font-medium">{nego.etape}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{nego.notes}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Prochaines visites */}
            <Card>
              <CardHeader>
                <CardTitle>Prochaines visites</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.visites.filter(v => v.statut === 'Programmée' || v.statut === 'Confirmée').map((visite) => (
                    <div key={visite.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">{visite.bien}</span>
                          <Badge className={getStatusColor(visite.statut)} variant="outline">
                            {visite.statut}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {visite.client} • {visite.typeVisite}
                        </p>
                        <p className="text-xs text-gray-500">{visite.notes}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(visite.dateVisite).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-sm text-gray-500">{visite.heureVisite}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mes biens */}
          <TabsContent value="biens" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mes biens immobiliers</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau bien
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {dashboardData.biens.map((bien) => (
                <Card key={bien.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            {bien.type.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{bien.type} - {bien.adresse}</h3>
                            <p className="text-sm text-gray-600">Propriétaire: {bien.proprietaire}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(bien.statut)}>
                                {bien.statut}
                              </Badge>
                              <Badge className={getTypeColor(bien.type)} variant="outline">
                                {bien.type}
                              </Badge>
                              <Badge variant="outline">
                                {bien.photos} photos
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-500">Prix:</span>
                            <p className="font-semibold text-green-600">{formatCurrency(bien.prix)}</p>
                          </div>
                          {bien.surface > 0 && (
                            <div>
                              <span className="text-gray-500">Surface:</span>
                              <p className="font-medium">{bien.surface} m²</p>
                            </div>
                          )}
                          {bien.terrain > 0 && (
                            <div>
                              <span className="text-gray-500">Terrain:</span>
                              <p className="font-medium">{bien.terrain} m²</p>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-500">Commission:</span>
                            <p className="font-medium text-blue-600">{formatCurrency(bien.commission)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-500">Visites:</span>
                            <p className="font-medium">{bien.visites}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Intéressés actifs:</span>
                            <p className="font-medium text-orange-600">{bien.interessesActifs}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Date inscription:</span>
                            <p className="font-medium">{new Date(bien.dateInscription).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-gray-600 mb-2">{bien.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {bien.caracteristiques.map((carac, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {carac}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline">
                          <Camera className="w-4 h-4 mr-2" />
                          Photos
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="w-4 h-4 mr-2" />
                          Visite
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Clients */}
          <TabsContent value="clients" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mes clients</h2>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau client
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.clients.map((client) => (
                <Card key={client.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{client.nom}</h3>
                        <Badge className={getStatusColor(client.statut)}>
                          {client.statut}
                        </Badge>
                      </div>
                      <Badge className={getTypeColor(client.type)} variant="outline">
                        {client.type}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Téléphone:</span>
                        <p className="font-medium">{client.telephone}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Email:</span>
                        <p className="font-medium">{client.email}</p>
                      </div>
                      {client.budget && (
                        <div>
                          <span className="text-sm text-gray-500">Budget:</span>
                          <p className="font-medium text-green-600">
                            {formatCurrency(client.budget.min)} - {formatCurrency(client.budget.max)}
                          </p>
                        </div>
                      )}
                      {client.preferences && (
                        <div>
                          <span className="text-sm text-gray-500">Préférences:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {client.preferences.map((pref, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {pref}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <span className="text-sm text-gray-500">Dernier contact:</span>
                        <p className="font-medium">{new Date(client.dernierContact).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600">{client.notes}</p>
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Appeler
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Planning */}
          <TabsContent value="planning" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Planning des visites</h2>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Programmer visite
              </Button>
            </div>

            <div className="space-y-4">
              {dashboardData.visites.map((visite) => (
                <Card key={visite.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                            V
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{visite.bien}</h3>
                            <p className="text-sm text-gray-600">{visite.adresse}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(visite.statut)}>
                                {visite.statut}
                              </Badge>
                              <Badge variant="outline">{visite.typeVisite}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-500">Client:</span>
                            <p className="font-medium">{visite.client}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Date:</span>
                            <p className="font-medium">{new Date(visite.dateVisite).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Heure:</span>
                            <p className="font-medium">{visite.heureVisite}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Accompagnateur:</span>
                            <p className="font-medium">{visite.accompagnateur}</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <span className="text-sm text-gray-500">Notes:</span>
                          <p className="text-sm text-gray-600">{visite.notes}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="w-4 h-4 mr-2" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline">
                          <MapPin className="w-4 h-4 mr-2" />
                          Itinéraire
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ModernAgentFoncierDashboard;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Scale, Users, Calendar, Plus, Eye, 
  Clock, CheckCircle, AlertCircle, Star, Filter, 
  ChevronRight, BarChart3, Target, Award, Settings,
  Package, Download, Phone, Mail, Globe, Briefcase,
  Shield, Calculator, Activity, Home, UserCheck,
  ClipboardList, Stamp, Gavel, Building, MapPin,
  DollarSign, TrendingUp, Archive, BookOpen,
  ShieldCheck, Lock, Coins
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Helmet } from 'react-helmet-async';
import ModernSidebar from '@/components/layout/ModernSidebar';
import { useUser } from '@/hooks/useUser';

const ModernNotaireDashboard = () => {
  const { user, profile } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalActes: 248,
      actesEnCours: 15,
      actesFinalises: 12,
      rdvPrevus: 8,
      totalHonoraires: 45000000,
      clientsActifs: 156,
      dossiersMois: 28,
      tauxSatisfaction: 96.5
    },
    actes: [
      {
        id: 1,
        type: 'Vente immobilière',
        vendeur: 'Amadou Diop',
        acheteur: 'Fatou Sall',
        bien: 'Villa 4 pièces',
        localisation: 'Almadies, Dakar',
        prix: 85000000,
        statut: 'En préparation',
        dateSignature: '2024-03-25',
        honoraires: 2550000,
        documents: ['Titre foncier', 'Attestation fiscale', 'Plan cadastral'],
        avancement: 65
      },
      {
        id: 2,
        type: 'Succession',
        defunt: 'Ibrahima Ndiaye',
        heritiers: ['Aminata Ndiaye', 'Moussa Ndiaye', 'Aissatou Ndiaye'],
        bien: 'Maison familiale + Terrain',
        localisation: 'Plateau, Dakar',
        valeur: 120000000,
        statut: 'Inventaire en cours',
        dateSignature: '2024-04-10',
        honoraires: 4800000,
        documents: ['Acte de décès', 'Livret de famille', 'Titre foncier'],
        avancement: 40
      },
      {
        id: 3,
        type: 'Donation',
        donateur: 'Ousmane Cissé',
        donataire: 'Marième Cissé',
        bien: 'Appartement 3 pièces',
        localisation: 'VDN, Dakar',
        valeur: 45000000,
        statut: 'Finalisé',
        dateSignature: '2024-03-15',
        honoraires: 1350000,
        documents: ['Titre foncier', 'Consentement famille', 'Évaluation'],
        avancement: 100
      }
    ],
    rendezVous: [
      {
        id: 1,
        client: 'Mamadou Ba',
        type: 'Vente immobilière',
        date: '2024-03-20',
        heure: '09:00',
        statut: 'Confirmé',
        objet: 'Signature acte de vente villa Saly',
        duree: 90,
        documents: ['CNI', 'Titre foncier', 'Attestation fiscale']
      },
      {
        id: 2,
        client: 'Awa Diallo',
        type: 'Testament',
        date: '2024-03-20',
        heure: '14:30',
        statut: 'Confirmé',
        objet: 'Rédaction testament olographe',
        duree: 60,
        documents: ['CNI', 'Livret de famille']
      },
      {
        id: 3,
        client: 'SARL Construction Plus',
        type: 'Constitution société',
        date: '2024-03-21',
        heure: '10:00',
        statut: 'En attente',
        objet: 'Statuts et procès-verbal AG',
        duree: 120,
        documents: ['NINEA', 'Statuts projet', 'Pièces dirigeants']
      }
    ],
    statistiques: [
      {
        periode: 'Ce mois',
        actesRealises: 28,
        honoraires: 12500000,
        nouveauClients: 15,
        tauxReussite: 98.5
      },
      {
        periode: 'Mois dernier',
        actesRealises: 31,
        honoraires: 14200000,
        nouveauClients: 18,
        tauxReussite: 96.8
      },
      {
        periode: 'Année en cours',
        actesRealises: 248,
        honoraires: 125000000,
        nouveauClients: 156,
        tauxReussite: 97.2
      }
    ],
    typeActes: [
      {
        type: 'Ventes immobilières',
        nombre: 85,
        pourcentage: 34.3,
        honorairesMoyens: 3200000,
        couleur: 'blue'
      },
      {
        type: 'Successions',
        nombre: 52,
        pourcentage: 21.0,
        honorairesMoyens: 4800000,
        couleur: 'green'
      },
      {
        type: 'Donations',
        nombre: 38,
        pourcentage: 15.3,
        honorairesMoyens: 2100000,
        couleur: 'purple'
      },
      {
        type: 'Constitutions',
        nombre: 35,
        pourcentage: 14.1,
        honorairesMoyens: 1800000,
        couleur: 'orange'
      },
      {
        type: 'Autres',
        nombre: 38,
        pourcentage: 15.3,
        honorairesMoyens: 1500000,
        couleur: 'gray'
      }
    ],
    recentActivities: [
      {
        id: 1,
        type: 'acte_signe',
        title: 'Acte finalisé',
        description: 'Donation Ousmane Cissé - Marième Cissé',
        timestamp: '2024-03-15T14:30:00Z',
        icon: CheckCircle,
        amount: 1350000
      },
      {
        id: 2,
        type: 'rdv_programme',
        title: 'RDV programmé',
        description: 'Mamadou Ba - Vente immobilière villa Saly',
        timestamp: '2024-03-15T10:15:00Z',
        icon: Calendar,
        amount: null
      },
      {
        id: 3,
        type: 'nouveau_client',
        title: 'Nouveau client',
        description: 'SARL Construction Plus - Constitution',
        timestamp: '2024-03-14T16:45:00Z',
        icon: UserCheck,
        amount: null
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
      case 'en préparation':
        return 'bg-yellow-100 text-yellow-800';
      case 'inventaire en cours':
        return 'bg-blue-100 text-blue-800';
      case 'en attente signature':
        return 'bg-orange-100 text-orange-800';
      case 'confirmé':
        return 'bg-green-100 text-green-800';
      case 'en attente':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'vente immobilière':
        return 'bg-blue-100 text-blue-800';
      case 'succession':
        return 'bg-green-100 text-green-800';
      case 'donation':
        return 'bg-purple-100 text-purple-800';
      case 'testament':
        return 'bg-orange-100 text-orange-800';
      case 'constitution société':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sidebarItems = [
    {
      id: 'actes',
      label: 'Actes en cours',
      icon: FileText,
      href: '/actes-en-cours',
      badge: dashboardData.stats.actesEnCours
    },
    {
      id: 'rendez-vous',
      label: 'Rendez-vous',
      icon: Calendar,
      href: '/planning-rdv',
      badge: dashboardData.stats.rdvPrevus
    },
    {
      id: 'clients',
      label: 'Mes clients',
      icon: Users,
      href: '/mes-clients-notaire',
      badge: null
    },
    {
      id: 'archives',
      label: 'Archives',
      icon: Archive,
      href: '/archives-actes',
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
          <title>Dashboard Notaire - Teranga Foncier</title>
          <meta name="description" content="Tableau de bord notaire sur Teranga Foncier" />
        </Helmet>

        {/* En-tête avec photo de profil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20 border-4 border-white/20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-white/20 text-white text-2xl">
                    {profile?.name ? 
                      profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                      (user?.email ? user.email.slice(0, 2).toUpperCase() : 'N')
                    }
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Bonjour, Maître {profile?.name || user?.email?.split('@')[0] || 'Notaire'} ! ⚖️
                  </h1>
                  <p className="text-indigo-100 text-lg">Office Notarial</p>
                  {profile?.company && (
                    <p className="text-indigo-200 flex items-center mt-1">
                      <Building className="w-4 h-4 mr-1" />
                      {profile.company}
                    </p>
                  )}
                  <p className="text-indigo-200 flex items-center mt-1">
                    <Phone className="w-4 h-4 mr-1" />
                    +221 77 593 42 41
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">
                  {formatCurrency(dashboardData.stats.totalHonoraires)}
                </div>
                <div className="text-indigo-200">Honoraires cumulés</div>
                <div className="text-sm text-indigo-300 mt-1">
                  {dashboardData.stats.tauxSatisfaction}% satisfaction client
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
                  <p className="text-sm text-gray-600 mb-1">Actes en cours</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.actesEnCours}
                  </p>
                  <p className="text-xs text-orange-600">
                    À finaliser
                  </p>
                </div>
                <ClipboardList className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">RDV prévus</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.rdvPrevus}
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
                  <p className="text-sm text-gray-600 mb-1">Actes ce mois</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.dossiersMois}
                  </p>
                  <p className="text-xs text-green-600">
                    +8% vs mois dernier
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
                  <p className="text-sm text-gray-600 mb-1">Clients actifs</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.clientsActifs}
                  </p>
                  <p className="text-xs text-purple-600">
                    Portefeuille client
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
                  <span className="text-sm">Nouvel acte</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">Planning RDV</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Archive className="w-6 h-6" />
                  <span className="text-sm">Consulter archives</span>
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="actes">Actes</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="statistics">Statistiques</TabsTrigger>
            <TabsTrigger value="blockchain">🆕 Blockchain</TabsTrigger>
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

              {/* Répartition des actes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Répartition des actes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.typeActes.map((type, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{type.type}</span>
                          <span className="text-sm text-gray-500">{type.pourcentage}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Progress value={type.pourcentage} className="flex-1 mr-2" />
                          <span className="text-xs text-gray-500">{type.nombre}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Honoraires moyens: {formatCurrency(type.honorairesMoyens)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Aperçu des rendez-vous de la semaine */}
            <Card>
              <CardHeader>
                <CardTitle>Rendez-vous de la semaine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.rendezVous.slice(0, 3).map((rdv) => (
                    <div key={rdv.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">{rdv.client}</span>
                          <Badge className={getTypeColor(rdv.type)} variant="outline">
                            {rdv.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{rdv.objet}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(rdv.date).toLocaleDateString('fr-FR')} à {rdv.heure}
                        </p>
                        <p className="text-xs text-gray-500">{rdv.duree} min</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Actes */}
          <TabsContent value="actes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Actes en cours</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel acte
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {dashboardData.actes.map((acte) => (
                <Card key={acte.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {acte.type.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{acte.type}</h3>
                            <p className="text-sm text-gray-600">{acte.localisation}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(acte.statut)}>
                                {acte.statut}
                              </Badge>
                              <Badge variant="outline">
                                {acte.type === 'Vente immobilière' ? `${acte.vendeur} → ${acte.acheteur}` :
                                 acte.type === 'Succession' ? `${acte.heritiers?.length} héritiers` :
                                 acte.type === 'Donation' ? `${acte.donateur} → ${acte.donataire}` : 'Acte'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-500">Bien concerné:</span>
                            <p className="font-medium">{acte.bien}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Valeur/Prix:</span>
                            <p className="font-semibold text-green-600">
                              {formatCurrency(acte.prix || acte.valeur)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Honoraires:</span>
                            <p className="font-medium text-blue-600">{formatCurrency(acte.honoraires)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Date signature:</span>
                            <p className="font-medium">{new Date(acte.dateSignature).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-500">Avancement</span>
                            <span className="font-medium">{acte.avancement}%</span>
                          </div>
                          <Progress value={acte.avancement} />
                        </div>

                        <div className="mb-3">
                          <span className="text-sm text-gray-500">Documents requis:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {acte.documents.map((doc, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {doc}
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
                          <FileText className="w-4 h-4 mr-2" />
                          Documents
                        </Button>
                        <Button size="sm" variant="outline">
                          <Stamp className="w-4 h-4 mr-2" />
                          Avancer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Planning */}
          <TabsContent value="planning" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Planning des rendez-vous</h2>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau RDV
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.rendezVous.map((rdv) => (
                <Card key={rdv.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{rdv.client}</h3>
                        <Badge className={getStatusColor(rdv.statut)}>
                          {rdv.statut}
                        </Badge>
                      </div>
                      <Badge className={getTypeColor(rdv.type)} variant="outline">
                        {rdv.type}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Objet:</span>
                        <p className="font-medium">{rdv.objet}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-500">Date:</span>
                          <p className="font-medium">{new Date(rdv.date).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Heure:</span>
                          <p className="font-medium">{rdv.heure}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Durée:</span>
                          <p className="font-medium">{rdv.duree} min</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-sm text-gray-500">Documents à apporter:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rdv.documents.map((doc, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Détails
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Statistiques */}
          <TabsContent value="statistics" className="space-y-6">
            <h2 className="text-2xl font-bold">Statistiques et performance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dashboardData.statistiques.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg">{stat.periode}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Actes réalisés</p>
                        <p className="text-2xl font-bold text-blue-600">{stat.actesRealises}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Honoraires</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(stat.honoraires)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Nouveaux clients</p>
                        <p className="text-2xl font-bold text-purple-600">{stat.nouveauClients}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Taux de réussite</p>
                        <p className="text-2xl font-bold text-orange-600">{stat.tauxReussite}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Analyse de performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">
                      🎯 Excellente performance
                    </h4>
                    <p className="text-green-800">
                      Votre taux de satisfaction client de {dashboardData.stats.tauxSatisfaction}% est exceptionnel. 
                      Vous maintenez un excellent niveau de service avec {dashboardData.stats.dossiersMois} actes ce mois.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      📈 Croissance constante
                    </h4>
                    <p className="text-blue-800">
                      Vos honoraires annuels de {formatCurrency(dashboardData.stats.totalHonoraires)} reflètent 
                      une activité soutenue. Les ventes immobilières représentent votre principale source de revenus.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-2">
                      💼 Diversification recommandée
                    </h4>
                    <p className="text-purple-800">
                      Considérez le développement d'activités dans les successions et donations, 
                      qui offrent des honoraires moyens plus élevés et une clientèle fidèle.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blockchain Notaire */}
          <TabsContent value="blockchain" className="space-y-6">
            {/* Introduction Blockchain */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-purple-900">Services Notariaux Blockchain</CardTitle>
                    <CardDescription className="text-purple-700">
                      Révolutionnez vos services notariaux avec la blockchain : actes infalsifiables, 
                      signatures électroniques sécurisées et archivage décentralisé.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Statistiques Blockchain */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Actes Blockchain</p>
                      <p className="text-2xl font-bold text-purple-900">89</p>
                      <p className="text-xs text-green-600">↗ +24% ce mois</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Smart Contracts</p>
                      <p className="text-2xl font-bold text-blue-900">34</p>
                      <p className="text-xs text-green-600">↗ +18% ce mois</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Link className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Sécurité Garantie</p>
                      <p className="text-2xl font-bold text-green-900">100%</p>
                      <p className="text-xs text-green-600">0 falsification</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <Lock className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Économies</p>
                      <p className="text-2xl font-bold text-orange-900">2.8M</p>
                      <p className="text-xs text-green-600">FCFA économisés</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Coins className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Actes Blockchain Actifs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                    Actes Blockchain Actifs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium">Vente Villa Almadies</p>
                        <p className="text-sm text-gray-600">Smart Contract #BC001</p>
                        <Badge variant="outline" className="text-xs mt-1">Signature automatique</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-purple-900">85M FCFA</p>
                        <p className="text-xs text-green-600">Sécurisé</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Succession Plateau</p>
                        <p className="text-sm text-gray-600">Smart Contract #BC002</p>
                        <Badge variant="outline" className="text-xs mt-1">Distribution automatique</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-900">120M FCFA</p>
                        <p className="text-xs text-blue-600">En cours</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Donation VDN</p>
                        <p className="text-sm text-gray-600">Smart Contract #BC003</p>
                        <Badge variant="outline" className="text-xs mt-1">Transfert immédiat</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-900">45M FCFA</p>
                        <p className="text-xs text-green-600">Finalisé</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer nouvel acte blockchain
                  </Button>
                </CardContent>
              </Card>

              {/* Services Blockchain */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="w-5 h-5 text-blue-600" />
                    Services Blockchain Disponibles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <h4 className="font-medium">Actes Infalsifiables</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Enregistrement sécurisé et immuable de tous vos actes notariés
                      </p>
                      <Badge className="bg-purple-100 text-purple-800">Actif</Badge>
                    </div>

                    <div className="p-4 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <h4 className="font-medium">Signatures Électroniques</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Signatures légales sécurisées par cryptographie avancée
                      </p>
                      <Badge className="bg-blue-100 text-blue-800">Actif</Badge>
                    </div>

                    <div className="p-4 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Lock className="w-5 h-5 text-green-600" />
                        <h4 className="font-medium">Archivage Décentralisé</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Conservation permanente et accès universel aux documents
                      </p>
                      <Badge className="bg-green-100 text-green-800">Actif</Badge>
                    </div>

                    <div className="p-4 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Calculator className="w-5 h-5 text-orange-600" />
                        <h4 className="font-medium">Calculs Automatiques</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Honoraires et taxes calculés automatiquement par smart contract
                      </p>
                      <Badge className="bg-orange-100 text-orange-800">Disponible</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Avantages Blockchain */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-900">Avantages de la Blockchain Notariale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-green-900 mb-2">Sécurité Absolue</h4>
                    <p className="text-sm text-green-700">
                      Aucune falsification possible grâce à la cryptographie blockchain
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-blue-900 mb-2">Rapidité Optimale</h4>
                    <p className="text-sm text-blue-700">
                      Traitement automatique et signatures électroniques instantanées
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                      <Coins className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-purple-900 mb-2">Réduction des Coûts</h4>
                    <p className="text-sm text-purple-700">
                      Diminution des frais administratifs et d'archivage jusqu'à 40%
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

export default ModernNotaireDashboard;

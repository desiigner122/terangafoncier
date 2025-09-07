import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, FileText, Users, MapPin, Plus, Eye, 
  Calendar, Clock, CheckCircle, AlertCircle, Star, 
  Filter, ChevronRight, BarChart3, Target, Award,
  Settings, Package, Download, Phone, Mail, Globe,
  Briefcase, Shield, Calculator, Activity, Home,
  UserCheck, ClipboardList, Stamp, Zap, TrendingUp,
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

const ModernMairieDashboard = () => {
  const { user, profile } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalApplications: 156,
      pendingReview: 23,
      approvedToday: 8,
      avgProcessingTime: 5.2,
      totalRevenue: 125000000,
      activeDevelopments: 12,
      completionRate: 87.5,
      citizenSatisfaction: 91.2
    },
    applications: [
      {
        id: 1,
        applicantName: 'Amadou Diop',
        applicantType: 'Particulier',
        requestType: 'Permis de construire',
        propertyType: 'Villa résidentielle',
        propertyLocation: 'Almadies, Dakar',
        landSize: 500,
        constructionArea: 250,
        submissionDate: '2024-03-10',
        status: 'En attente de validation',
        priority: 'Normal',
        documentsComplete: true,
        estimatedCompletion: '2024-03-25',
        fees: 850000,
        inspector: 'M. Sall'
      },
      {
        id: 2,
        applicantName: 'SARL Construction Plus',
        applicantType: 'Entreprise',
        requestType: 'Permis de lotir',
        propertyType: 'Lotissement résidentiel',
        propertyLocation: 'Guédiawaye',
        landSize: 5000,
        constructionArea: 2500,
        submissionDate: '2024-03-08',
        status: 'Approuvé',
        priority: 'Élevé',
        documentsComplete: true,
        estimatedCompletion: '2024-03-20',
        fees: 4500000,
        inspector: 'Mme Ndiaye'
      },
      {
        id: 3,
        applicantName: 'Fatou Sall',
        applicantType: 'Diaspora',
        requestType: 'Certificat d\'urbanisme',
        propertyType: 'Terrain résidentiel',
        propertyLocation: 'VDN, Dakar',
        landSize: 300,
        constructionArea: 0,
        submissionDate: '2024-03-12',
        status: 'Documents manquants',
        priority: 'Normal',
        documentsComplete: false,
        estimatedCompletion: '2024-03-30',
        fees: 150000,
        inspector: 'M. Diouf'
      }
    ],
    developments: [
      {
        id: 1,
        projectName: 'Résidence Les Palmiers',
        developer: 'SARL BTP Excellence',
        location: 'Almadies, Dakar',
        type: 'Résidentiel',
        totalUnits: 24,
        completedUnits: 18,
        startDate: '2023-06-15',
        estimatedCompletion: '2024-06-15',
        status: 'En cours',
        progress: 75,
        lastInspection: '2024-03-10',
        nextMilestone: 'Finitions'
      },
      {
        id: 2,
        projectName: 'Centre Commercial Plateau',
        developer: 'Groupe Immobilier Sahel',
        location: 'Plateau, Dakar',
        type: 'Commercial',
        totalUnits: 1,
        completedUnits: 0,
        startDate: '2023-09-01',
        estimatedCompletion: '2024-12-01',
        status: 'En cours',
        progress: 45,
        lastInspection: '2024-03-05',
        nextMilestone: 'Structure'
      },
      {
        id: 3,
        projectName: 'Lotissement VDN Extension',
        developer: 'Promoteur Immobilier Sénégal',
        location: 'VDN, Dakar',
        type: 'Lotissement',
        totalUnits: 50,
        completedUnits: 50,
        startDate: '2022-12-01',
        estimatedCompletion: '2024-02-28',
        status: 'Terminé',
        progress: 100,
        lastInspection: '2024-02-25',
        nextMilestone: 'Livraison'
      }
    ],
    recentActivities: [
      {
        id: 1,
        type: 'application_approved',
        title: 'Permis approuvé',
        description: 'Permis de construire SARL Construction Plus',
        timestamp: '2024-03-15T14:30:00Z',
        icon: CheckCircle,
        applicant: 'SARL Construction Plus'
      },
      {
        id: 2,
        type: 'inspection_completed',
        title: 'Inspection terminée',
        description: 'Inspection Résidence Les Palmiers',
        timestamp: '2024-03-15T10:15:00Z',
        icon: Eye,
        applicant: 'SARL BTP Excellence'
      },
      {
        id: 3,
        type: 'application_submitted',
        title: 'Nouvelle demande',
        description: 'Certificat d\'urbanisme Fatou Sall',
        timestamp: '2024-03-14T16:45:00Z',
        icon: FileText,
        applicant: 'Fatou Sall'
      }
    ],
    departmentStats: [
      {
        department: 'Urbanisme',
        pendingApplications: 15,
        approvedThisMonth: 42,
        averageProcessingTime: 4.8,
        satisfaction: 89.5
      },
      {
        department: 'Construction',
        pendingApplications: 8,
        approvedThisMonth: 28,
        averageProcessingTime: 6.2,
        satisfaction: 92.1
      },
      {
        department: 'Lotissement',
        pendingApplications: 5,
        approvedThisMonth: 12,
        averageProcessingTime: 8.5,
        satisfaction: 88.7
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
      case 'approuvé':
        return 'bg-green-100 text-green-800';
      case 'en attente de validation':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejeté':
        return 'bg-red-100 text-red-800';
      case 'documents manquants':
        return 'bg-orange-100 text-orange-800';
      case 'en cours':
        return 'bg-blue-100 text-blue-800';
      case 'terminé':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
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
      id: 'applications',
      label: 'Demandes',
      icon: FileText,
      href: '/demandes-urbanisme',
      badge: dashboardData.stats.pendingReview
    },
    {
      id: 'developments',
      label: 'Projets en cours',
      icon: Building,
      href: '/projets-developpement',
      badge: dashboardData.stats.activeDevelopments
    },
    {
      id: 'inspections',
      label: 'Inspections',
      icon: Eye,
      href: '/programme-inspections',
      badge: null
    },
    {
      id: 'citizens',
      label: 'Citoyens',
      icon: Users,
      href: '/registre-citoyens',
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
          <title>Dashboard Mairie - Teranga Foncier</title>
          <meta name="description" content="Tableau de bord mairie sur Teranga Foncier" />
        </Helmet>

        {/* En-tête avec photo de profil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20 border-4 border-white/20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-white/20 text-white text-2xl">
                    {profile?.name ? 
                      profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                      (user?.email ? user.email.slice(0, 2).toUpperCase() : 'M')
                    }
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Bonjour, {profile?.name || user?.email?.split('@')[0] || 'Agent Municipal'} ! 🏛️
                  </h1>
                  <p className="text-green-100 text-lg">Administration Municipale</p>
                  {profile?.company && (
                    <p className="text-green-200 flex items-center mt-1">
                      <Building className="w-4 h-4 mr-1" />
                      {profile.company}
                    </p>
                  )}
                  <p className="text-green-200 flex items-center mt-1">
                    <Phone className="w-4 h-4 mr-1" />
                    +221 77 593 42 41
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">
                  {dashboardData.stats.totalApplications}
                </div>
                <div className="text-green-200">Dossiers traités</div>
                <div className="text-sm text-green-300 mt-1">
                  {dashboardData.stats.completionRate}% de réussite
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
                  <p className="text-sm text-gray-600 mb-1">En attente</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.pendingReview}
                  </p>
                  <p className="text-xs text-orange-600">
                    Demandes à traiter
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
                  <p className="text-sm text-gray-600 mb-1">Approuvés aujourd'hui</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.approvedToday}
                  </p>
                  <p className="text-xs text-green-600">
                    +3 depuis hier
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Délai moyen</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.avgProcessingTime}j
                  </p>
                  <p className="text-xs text-blue-600">
                    Temps de traitement
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Satisfaction</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.citizenSatisfaction}%
                  </p>
                  <p className="text-xs text-purple-600">
                    Note citoyens
                  </p>
                </div>
                <Star className="w-8 h-8 text-purple-500" />
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
                  <span className="text-sm">Nouvelle demande</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Eye className="w-6 h-6" />
                  <span className="text-sm">Programmer inspection</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Stamp className="w-6 h-6" />
                  <span className="text-sm">Valider permis</span>
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
            <TabsTrigger value="applications">Demandes</TabsTrigger>
            <TabsTrigger value="developments">Projets</TabsTrigger>
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
                            <p className="text-sm text-blue-600">
                              {activity.applicant}
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

              {/* Statistiques par département */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Performance des départements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.departmentStats.map((dept, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{dept.department}</h4>
                          <Badge variant="outline">{dept.satisfaction}% satisfaction</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">En attente:</span>
                            <p className="font-medium text-orange-600">{dept.pendingApplications}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Approuvés ce mois:</span>
                            <p className="font-medium text-green-600">{dept.approvedThisMonth}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Délai moyen:</span>
                            <p className="font-medium">{dept.averageProcessingTime}j</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Métriques de performance */}
            <Card>
              <CardHeader>
                <CardTitle>Métriques de performance mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {formatCurrency(dashboardData.stats.totalRevenue)}
                    </div>
                    <div className="text-sm text-gray-600">Revenus générés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {dashboardData.stats.totalApplications}
                    </div>
                    <div className="text-sm text-gray-600">Demandes traitées</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {dashboardData.stats.activeDevelopments}
                    </div>
                    <div className="text-sm text-gray-600">Projets actifs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {dashboardData.stats.completionRate}%
                    </div>
                    <div className="text-sm text-gray-600">Taux de réussite</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demandes */}
          <TabsContent value="applications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Demandes d'urbanisme</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle demande
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {dashboardData.applications.map((application) => (
                <Card key={application.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback>
                              {application.applicantName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">{application.applicantName}</h3>
                            <p className="text-sm text-gray-600">{application.applicantType}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getStatusColor(application.status)}>
                                {application.status}
                              </Badge>
                              <Badge className={getPriorityColor(application.priority)}>
                                Priorité {application.priority.toLowerCase()}
                              </Badge>
                              <Badge variant="outline">{application.requestType}</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <span className="text-gray-500">Type de bien:</span>
                            <p className="font-medium">{application.propertyType}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Localisation:</span>
                            <p className="font-medium">{application.propertyLocation}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Surface terrain:</span>
                            <p className="font-medium">{application.landSize} m²</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Surface construction:</span>
                            <p className="font-medium">{application.constructionArea} m²</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Frais:</span>
                            <p className="font-semibold text-green-600">{formatCurrency(application.fees)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Inspecteur:</span>
                            <p className="font-medium">{application.inspector}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Documents:</span>
                            <p className={`font-medium ${application.documentsComplete ? 'text-green-600' : 'text-red-600'}`}>
                              {application.documentsComplete ? 'Complets' : 'Manquants'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Échéance estimée:</span>
                            <p className="font-medium">{new Date(application.estimatedCompletion).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-gray-500">
                          Soumise le {new Date(application.submissionDate).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Examiner
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="w-4 h-4 mr-2" />
                          Documents
                        </Button>
                        <Button size="sm" variant="outline">
                          <Stamp className="w-4 h-4 mr-2" />
                          Valider
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Projets en développement */}
          <TabsContent value="developments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Projets en développement</h2>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter rapport
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.developments.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg mb-2">{project.projectName}</h3>
                      <p className="text-sm text-gray-600 mb-2">{project.developer}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        <Badge variant="outline">{project.type}</Badge>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Localisation:</span>
                        <span className="text-sm font-medium">{project.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Unités totales:</span>
                        <span className="text-sm font-medium">{project.totalUnits}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Unités terminées:</span>
                        <span className="text-sm font-medium text-green-600">{project.completedUnits}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Prochaine étape:</span>
                        <span className="text-sm font-medium">{project.nextMilestone}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Avancement</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Détails
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Programmer
                      </Button>
                    </div>

                    <div className="text-xs text-gray-500 mt-2">
                      Dernière inspection: {new Date(project.lastInspection).toLocaleDateString('fr-FR')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Statistiques */}
          <TabsContent value="statistics" className="space-y-6">
            <h2 className="text-2xl font-bold">Statistiques et analyses</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dashboardData.departmentStats.map((dept, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg">{dept.department}</h3>
                      <Badge variant="outline" className="mt-2">
                        {dept.satisfaction}% satisfaction
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Demandes en attente</p>
                        <p className="text-2xl font-bold text-orange-600">{dept.pendingApplications}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Approuvées ce mois</p>
                        <p className="text-2xl font-bold text-green-600">{dept.approvedThisMonth}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Délai moyen de traitement</p>
                        <p className="text-2xl font-bold text-blue-600">{dept.averageProcessingTime}j</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations d'amélioration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">
                      🎯 Performance excellente
                    </h4>
                    <p className="text-green-800">
                      Le département Construction maintient une satisfaction de 92.1% et un délai de traitement de 6.2 jours. 
                      Cette performance peut servir de modèle pour les autres départements.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">
                      ⚡ Optimisation recommandée
                    </h4>
                    <p className="text-yellow-800">
                      Le département Lotissement a un délai de traitement de 8.5 jours. 
                      Considérez l'allocation de ressources supplémentaires ou la simplification des procédures.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      📊 Charge de travail équilibrée
                    </h4>
                    <p className="text-blue-800">
                      Avec 23 demandes en attente au total, la charge de travail est bien répartie. 
                      Maintenez cette cadence pour conserver un service de qualité.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blockchain Mairie */}
          <TabsContent value="blockchain" className="space-y-6">
            {/* Introduction Blockchain */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Building className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-green-900">Administration Blockchain</CardTitle>
                    <CardDescription className="text-green-700">
                      Modernisez l'administration municipale avec des permis numériques infalsifiables, 
                      des processus automatisés et une transparence totale.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Statistiques Blockchain */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Permis Blockchain</p>
                      <p className="text-2xl font-bold text-green-900">78</p>
                      <p className="text-xs text-green-600">↗ +42% ce mois</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Processus Automatisés</p>
                      <p className="text-2xl font-bold text-blue-900">15</p>
                      <p className="text-xs text-green-600">100% optimisés</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Transparence</p>
                      <p className="text-2xl font-bold text-purple-900">100%</p>
                      <p className="text-xs text-green-600">Suivi public</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <ShieldCheck className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Économies</p>
                      <p className="text-2xl font-bold text-orange-900">3.8M</p>
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
              {/* Permis Blockchain Actifs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    Permis Blockchain Actifs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Permis de Construire</p>
                        <p className="text-sm text-gray-600">Villa Almadies - A. Diop</p>
                        <Badge variant="outline" className="text-xs mt-1">Traçabilité complète</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-900">ID: #BC567</p>
                        <p className="text-xs text-green-600">Actif</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Permis de Lotir</p>
                        <p className="text-sm text-gray-600">Lotissement Guédiawaye</p>
                        <Badge variant="outline" className="text-xs mt-1">Smart contract</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-900">ID: #BC568</p>
                        <p className="text-xs text-blue-600">Validé</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium">Certificat d'Urbanisme</p>
                        <p className="text-sm text-gray-600">Terrain VDN - F. Sall</p>
                        <Badge variant="outline" className="text-xs mt-1">Vérifié blockchain</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-purple-900">ID: #BC569</p>
                        <p className="text-xs text-orange-600">En attente</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Créer nouveau permis blockchain
                  </Button>
                </CardContent>
              </Card>

              {/* Services Blockchain Municipaux */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="w-5 h-5 text-blue-600" />
                    Services Blockchain Disponibles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-green-600" />
                        <h4 className="font-medium">Permis Numériques</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Permis et autorisations infalsifiables avec vérification instantanée
                      </p>
                      <Badge className="bg-green-100 text-green-800">78 permis actifs</Badge>
                    </div>

                    <div className="p-4 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <h4 className="font-medium">Processus Automatisés</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Validation automatique des critères et notification temps réel
                      </p>
                      <Badge className="bg-blue-100 text-blue-800">15 processus actifs</Badge>
                    </div>

                    <div className="p-4 border border-purple-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-purple-600" />
                        <h4 className="font-medium">Portail Citoyen</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Suivi transparent de toutes les demandes et décisions
                      </p>
                      <Badge className="bg-purple-100 text-purple-800">100% transparent</Badge>
                    </div>

                    <div className="p-4 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <Calculator className="w-5 h-5 text-orange-600" />
                        <h4 className="font-medium">Paiements Automatiques</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Calcul et perception automatique des taxes et droits
                      </p>
                      <Badge className="bg-orange-100 text-orange-800">Disponible</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Avantages Administration Blockchain */}
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Avantages de l'Administration Blockchain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                      <ShieldCheck className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-green-900 mb-2">Sécurité Renforcée</h4>
                    <p className="text-sm text-green-700">
                      Permis et documents administratifs infalsifiables et vérifiables
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                      <Zap className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-blue-900 mb-2">Efficacité Optimale</h4>
                    <p className="text-sm text-blue-700">
                      Processus automatisés réduisant les délais de 70%
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                      <Eye className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-purple-900 mb-2">Transparence Totale</h4>
                    <p className="text-sm text-purple-700">
                      Suivi public de toutes les décisions et processus administratifs
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

export default ModernMairieDashboard;

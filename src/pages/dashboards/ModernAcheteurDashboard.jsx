import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, MapPin, DollarSign, Clock, Building2, Plus, Heart, Search, 
  FileText, Camera, MessageSquare, Bell, TrendingUp, Shield, Globe,
  Phone, Calendar, Download, Star, AlertCircle, Eye, CreditCard,
  Users, BarChart3, Target, Award, Filter, ChevronRight,
  Bookmark, ShoppingCart, CheckCircle, ArrowUpRight
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
import { ROLES } from '@/lib/enhancedRbacConfig';

const ModernAcheteurDashboard = () => {
  const { user, profile } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const isDiaspora = user?.role === ROLES.PARTICULIER_DIASPORA;

  const [dashboardData, setDashboardData] = useState({
    stats: {
      savedProperties: 24,
      visitedProperties: 12,
      activeRequests: 5,
      budget: isDiaspora ? 50000000 : 25000000,
      completedPurchases: 2,
      diasporaInvestments: isDiaspora ? 3 : 0,
      portfolioValue: isDiaspora ? 85000000 : 0
    },
    recentProperties: [
      {
        id: 1,
        title: 'Terrain résidentiel Almadies',
        location: 'Almadies, Dakar',
        price: 15000000,
        size: '500m²',
        image: '/images/terrain1.jpg',
        status: 'Disponible',
        favorite: true,
        views: 45
      },
      {
        id: 2,
        title: 'Villa moderne Saly',
        location: 'Saly, Mbour',
        price: 35000000,
        size: '300m²',
        image: '/images/villa1.jpg',
        status: 'Négociation',
        favorite: false,
        views: 23
      },
      {
        id: 3,
        title: 'Appartement VDN',
        location: 'VDN, Dakar',
        price: 18000000,
        size: '120m²',
        image: '/images/appart1.jpg',
        status: 'Nouveau',
        favorite: true,
        views: 67
      }
    ],
    activeRequests: [
      {
        id: 1,
        type: 'Recherche terrain',
        location: 'Mbour',
        budget: '10-20M XOF',
        status: 'En cours',
        agent: 'Fatou Diop',
        lastUpdate: '2024-03-15'
      },
      {
        id: 2,
        type: 'Visite programmée',
        property: 'Villa Almadies',
        date: '2024-03-18',
        status: 'Confirmé',
        agent: 'Moussa Seck',
        lastUpdate: '2024-03-14'
      }
    ],
    recentActivities: [
      {
        id: 1,
        type: 'property_view',
        title: 'Propriété consultée',
        description: 'Terrain résidentiel Almadies',
        timestamp: '2024-03-15T14:30:00Z',
        icon: Eye
      },
      {
        id: 2,
        type: 'favorite_added',
        title: 'Ajouté aux favoris',
        description: 'Villa moderne Saly',
        timestamp: '2024-03-15T10:15:00Z',
        icon: Heart
      },
      {
        id: 3,
        type: 'message_received',
        title: 'Nouveau message',
        description: 'Message de votre agent Fatou Diop',
        timestamp: '2024-03-14T16:45:00Z',
        icon: MessageSquare
      }
    ],
    marketInsights: [
      {
        location: 'Almadies',
        averagePrice: 18500000,
        trend: '+5.2%',
        properties: 45
      },
      {
        location: 'Saly',
        averagePrice: 12300000,
        trend: '+3.8%',
        properties: 67
      },
      {
        location: 'VDN',
        averagePrice: 22000000,
        trend: '+2.1%',
        properties: 23
      }
    ]
  });

  useEffect(() => {
    // Simuler le chargement des données
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
      case 'disponible':
        return 'bg-green-100 text-green-800';
      case 'négociation':
        return 'bg-orange-100 text-orange-800';
      case 'nouveau':
        return 'bg-blue-100 text-blue-800';
      case 'en cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmé':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const sidebarItems = [
    {
      id: 'properties',
      label: 'Mes Recherches',
      icon: Search,
      href: '/mes-recherches',
      badge: dashboardData.stats.activeRequests
    },
    {
      id: 'favorites',
      label: 'Mes Favoris',
      icon: Heart,
      href: '/mes-favoris',
      badge: dashboardData.stats.savedProperties
    },
    ...(isDiaspora ? [{
      id: 'diaspora-investment',
      label: 'Investissements Diaspora',
      icon: Globe,
      href: '/diaspora-investment',
      badge: dashboardData.stats.diasporaInvestments
    }] : []),
    {
      id: 'municipal-requests',
      label: 'Demandes Communales',
      icon: Building2,
      href: '/demande-terrain-communal',
      badge: null
    },
    {
      id: 'visits',
      label: 'Mes Visites',
      icon: Calendar,
      href: '/mes-visites',
      badge: null
    },
    {
      id: 'purchases',
      label: 'Mes Achats',
      icon: ShoppingCart,
      href: '/mes-achats',
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
          <title>Dashboard Acheteur - Teranga Foncier</title>
          <meta name="description" content="Tableau de bord acheteur sur Teranga Foncier" />
        </Helmet>

        {/* En-tête avec photo de profil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
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
                    Bonjour, {profile?.name || user?.email?.split('@')[0] || 'Acheteur'} ! 👋
                  </h1>
                  <p className="text-blue-100 text-lg">
                    {isDiaspora ? 'Acheteur Diaspora' : 'Acheteur Particulier'}
                  </p>
                  {profile?.location && (
                    <p className="text-blue-200 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profile.location}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">
                  {formatCurrency(dashboardData.stats.budget)}
                </div>
                <div className="text-blue-200">Budget disponible</div>
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
                  <p className="text-sm text-gray-600 mb-1">Propriétés sauvées</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.savedProperties}
                  </p>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Propriétés visitées</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.visitedProperties}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Demandes actives</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.activeRequests}
                  </p>
                </div>
                <Search className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {isDiaspora ? 'Investissements' : 'Achats réalisés'}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isDiaspora ? dashboardData.stats.diasporaInvestments : dashboardData.stats.completedPurchases}
                  </p>
                </div>
                {isDiaspora ? 
                  <Globe className="w-8 h-8 text-purple-500" /> :
                  <CheckCircle className="w-8 h-8 text-purple-500" />
                }
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section spéciale Diaspora */}
        {isDiaspora && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Portfolio Diaspora</h3>
                    <p className="text-purple-100">Valeur totale de vos investissements au Sénégal</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold mb-1">
                      {formatCurrency(dashboardData.stats.portfolioValue)}
                    </div>
                    <div className="text-purple-200 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +12.5% cette année
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span>ROI Moyen</span>
                      <Badge className="bg-green-500">+15.2%</Badge>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span>Diversification</span>
                      <Badge className="bg-blue-500">3 secteurs</Badge>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span>Suivi</span>
                      <Badge className="bg-purple-500">Temps réel</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Contenu principal avec onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="properties">Propriétés</TabsTrigger>
            <TabsTrigger value="requests">Mes Demandes</TabsTrigger>
            <TabsTrigger value="insights">Marché</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activités récentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
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

              {/* Demandes actives */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Demandes en cours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.activeRequests.map((request) => (
                      <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{request.type}</h4>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          {request.location && (
                            <p><strong>Localisation:</strong> {request.location}</p>
                          )}
                          {request.budget && (
                            <p><strong>Budget:</strong> {request.budget}</p>
                          )}
                          {request.property && (
                            <p><strong>Propriété:</strong> {request.property}</p>
                          )}
                          {request.date && (
                            <p><strong>Date:</strong> {new Date(request.date).toLocaleDateString('fr-FR')}</p>
                          )}
                          <p><strong>Agent:</strong> {request.agent}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Propriétés */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Propriétés recommandées</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle recherche
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.recentProperties.map((property) => (
                <motion.div
                  key={property.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = '/api/placeholder/400/300';
                        }}
                      />
                      <div className="absolute top-4 right-4">
                        <Button
                          size="sm"
                          variant={property.favorite ? "default" : "outline"}
                          className="bg-white/80 hover:bg-white"
                        >
                          <Heart className={`w-4 h-4 ${property.favorite ? 'text-red-500 fill-current' : ''}`} />
                        </Button>
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge className={getStatusColor(property.status)}>
                          {property.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                      <p className="text-gray-600 flex items-center mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        {property.location}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(property.price)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {property.size}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Eye className="w-4 h-4 mr-1" />
                          {property.views} vues
                        </div>
                        <Button size="sm">
                          Voir détails
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Demandes */}
          <TabsContent value="requests" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mes Demandes</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle demande
              </Button>
            </div>

            <div className="space-y-4">
              {dashboardData.activeRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-lg font-semibold">{request.type}</h3>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          {request.location && (
                            <div>
                              <span className="text-gray-500">Localisation:</span>
                              <p className="font-medium">{request.location}</p>
                            </div>
                          )}
                          {request.budget && (
                            <div>
                              <span className="text-gray-500">Budget:</span>
                              <p className="font-medium">{request.budget}</p>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-500">Agent:</span>
                            <p className="font-medium">{request.agent}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Dernière MAJ:</span>
                            <p className="font-medium">{new Date(request.lastUpdate).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Contacter
                        </Button>
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Détails
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Insights marché */}
          <TabsContent value="insights" className="space-y-6">
            <h2 className="text-2xl font-bold">Insights du Marché</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dashboardData.marketInsights.map((insight, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">{insight.location}</h3>
                      <Badge variant="secondary" className="text-green-600">
                        {insight.trend}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Prix moyen</p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(insight.averagePrice)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Propriétés disponibles</p>
                        <p className="text-lg font-semibold">{insight.properties}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recommandations personnalisées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      💡 Opportunité d'investissement
                    </h4>
                    <p className="text-blue-800">
                      Les prix à Saly sont en hausse de 3.8%. C'est un bon moment pour investir dans cette zone.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">
                      📈 Tendance favorable
                    </h4>
                    <p className="text-green-800">
                      Votre budget de {formatCurrency(dashboardData.stats.budget)} vous permet d'accéder à 67% des propriétés disponibles.
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

export default ModernAcheteurDashboard;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, Building2, Users, TrendingUp, Plus, Eye, 
  Edit, Share2, MessageSquare, Calendar, FileText, Camera,
  BarChart3, Target, Award, MapPin, Clock, CheckCircle,
  AlertCircle, Star, Heart, Filter, ChevronRight, Upload,
  Phone, Mail, Globe, Package, CreditCard, Download
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

const ModernVendeurDashboard = () => {
  const { user, profile } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalProperties: 18,
      activeListings: 12,
      soldProperties: 6,
      totalRevenue: 124500000,
      averagePrice: 20750000,
      viewsThisMonth: 456,
      inquiriesThisMonth: 23,
      conversionRate: 12.5
    },
    properties: [
      {
        id: 1,
        title: 'Villa moderne Almadies',
        location: 'Almadies, Dakar',
        price: 45000000,
        size: '400m²',
        type: 'Villa',
        status: 'Actif',
        views: 234,
        inquiries: 12,
        image: '/images/villa1.jpg',
        postedDate: '2024-03-01',
        featured: true
      },
      {
        id: 2,
        title: 'Terrain résidentiel Saly',
        location: 'Saly, Mbour',
        price: 18000000,
        size: '600m²',
        type: 'Terrain',
        status: 'Négociation',
        views: 156,
        inquiries: 8,
        image: '/images/terrain1.jpg',
        postedDate: '2024-02-15',
        featured: false
      },
      {
        id: 3,
        title: 'Appartement VDN',
        location: 'VDN, Dakar',
        price: 25000000,
        size: '150m²',
        type: 'Appartement',
        status: 'Vendu',
        views: 189,
        inquiries: 15,
        image: '/images/appart1.jpg',
        postedDate: '2024-01-20',
        featured: false,
        soldDate: '2024-03-10'
      }
    ],
    recentInquiries: [
      {
        id: 1,
        propertyTitle: 'Villa moderne Almadies',
        buyerName: 'Aminata Diallo',
        buyerType: 'Particulier Diaspora',
        message: 'Intéressée par une visite la semaine prochaine',
        timestamp: '2024-03-15T14:30:00Z',
        status: 'Nouveau',
        budget: '40-50M XOF'
      },
      {
        id: 2,
        propertyTitle: 'Terrain résidentiel Saly',
        buyerName: 'Moussa Seck',
        buyerType: 'Investisseur',
        message: 'Demande de négociation sur le prix',
        timestamp: '2024-03-14T16:45:00Z',
        status: 'En cours',
        budget: '15-20M XOF'
      },
      {
        id: 3,
        propertyTitle: 'Appartement VDN',
        buyerName: 'Fatou Ba',
        buyerType: 'Particulier',
        message: 'Demande d\'informations sur le financement',
        timestamp: '2024-03-13T11:20:00Z',
        status: 'Répondu',
        budget: '20-25M XOF'
      }
    ],
    marketTrends: [
      {
        location: 'Almadies',
        averagePrice: 35000000,
        trend: '+8.5%',
        yourAverage: 42000000,
        performance: 'Supérieur'
      },
      {
        location: 'Saly',
        averagePrice: 15000000,
        trend: '+5.2%',
        yourAverage: 18000000,
        performance: 'Supérieur'
      },
      {
        location: 'VDN',
        averagePrice: 28000000,
        trend: '+3.1%',
        yourAverage: 25000000,
        performance: 'Comparable'
      }
    ],
    recentActivities: [
      {
        id: 1,
        type: 'inquiry',
        title: 'Nouvelle demande',
        description: 'Aminata Diallo s\'intéresse à votre villa',
        timestamp: '2024-03-15T14:30:00Z',
        icon: MessageSquare
      },
      {
        id: 2,
        type: 'view',
        title: 'Propriété consultée',
        description: 'Terrain Saly vu 15 fois aujourd\'hui',
        timestamp: '2024-03-15T10:15:00Z',
        icon: Eye
      },
      {
        id: 3,
        type: 'sale',
        title: 'Vente réalisée',
        description: 'Appartement VDN vendu avec succès',
        timestamp: '2024-03-10T16:45:00Z',
        icon: CheckCircle
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
      case 'actif':
        return 'bg-green-100 text-green-800';
      case 'négociation':
        return 'bg-orange-100 text-orange-800';
      case 'vendu':
        return 'bg-blue-100 text-blue-800';
      case 'nouveau':
        return 'bg-purple-100 text-purple-800';
      case 'en cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'répondu':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance.toLowerCase()) {
      case 'supérieur':
        return 'text-green-600';
      case 'comparable':
        return 'text-blue-600';
      case 'inférieur':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const sidebarItems = [
    {
      id: 'properties',
      label: 'Mes Biens',
      icon: Building2,
      href: '/mes-biens',
      badge: dashboardData.stats.activeListings
    },
    {
      id: 'intelligent-parcels',
      label: 'Parcelles Intelligentes',
      icon: Target,
      href: '/terrain-intelligent',
      badge: null
    },
    {
      id: 'inquiries',
      label: 'Demandes & CRM',
      icon: MessageSquare,
      href: '/crm',
      badge: dashboardData.stats.inquiriesThisMonth
    },
    {
      id: 'analytics',
      label: 'Analyses',
      icon: BarChart3,
      href: '/mes-analyses',
      badge: null
    },
    {
      id: 'marketing',
      label: 'Marketing',
      icon: Share2,
      href: '/marketing',
      badge: null
    },
    {
      id: 'valuation',
      label: 'Évaluation IA',
      icon: DollarSign,
      href: '/evaluation-ia',
      badge: null
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
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
          <title>Dashboard Vendeur - Teranga Foncier</title>
          <meta name="description" content="Tableau de bord vendeur sur Teranga Foncier" />
        </Helmet>

        {/* En-tête avec photo de profil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20 border-4 border-white/20">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-white/20 text-white text-2xl">
                    {profile?.name ? 
                      profile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
                      (user?.email ? user.email.slice(0, 2).toUpperCase() : 'V')
                    }
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Bonjour, {profile?.name || user?.email?.split('@')[0] || 'Vendeur'} ! 🏡
                  </h1>
                  <p className="text-green-100 text-lg">Vendeur Professionnel</p>
                  {profile?.company && (
                    <p className="text-green-200 flex items-center mt-1">
                      <Building2 className="w-4 h-4 mr-1" />
                      {profile.company}
                    </p>
                  )}
                  {profile?.location && (
                    <p className="text-green-200 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profile.location}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">
                  {formatCurrency(dashboardData.stats.totalRevenue)}
                </div>
                <div className="text-green-200">Chiffre d'affaires total</div>
                <div className="text-sm text-green-300 mt-1">
                  {dashboardData.stats.conversionRate}% taux de conversion
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
                  <p className="text-sm text-gray-600 mb-1">Biens actifs</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.activeListings}
                  </p>
                  <p className="text-xs text-green-600">
                    +2 ce mois
                  </p>
                </div>
                <Building2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Vues ce mois</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.viewsThisMonth}
                  </p>
                  <p className="text-xs text-blue-600">
                    +15% vs mois dernier
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
                  <p className="text-sm text-gray-600 mb-1">Demandes reçues</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.inquiriesThisMonth}
                  </p>
                  <p className="text-xs text-purple-600">
                    5 nouvelles
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Biens vendus</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardData.stats.soldProperties}
                  </p>
                  <p className="text-xs text-orange-600">
                    Cette année
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-orange-500" />
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
                  <span className="text-sm">Ajouter un bien</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Camera className="w-6 h-6" />
                  <span className="text-sm">Ajouter photos</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <BarChart3 className="w-6 h-6" />
                  <span className="text-sm">Voir analyses</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col space-y-2">
                  <Target className="w-6 h-6" />
                  <span className="text-sm">Promouvoir</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contenu principal avec onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="properties">Mes Biens</TabsTrigger>
            <TabsTrigger value="inquiries">Demandes</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
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

              {/* Performance du marché */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance vs Marché
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.marketTrends.map((trend, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{trend.location}</h4>
                          <Badge className={`${getPerformanceColor(trend.performance)} bg-transparent`}>
                            {trend.performance}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Marché:</span>
                            <p className="font-medium">{formatCurrency(trend.averagePrice)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Vos prix:</span>
                            <p className="font-medium">{formatCurrency(trend.yourAverage)}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-green-600">
                          Tendance marché: {trend.trend}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mes Biens */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Mes Biens</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrer
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un bien
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dashboardData.properties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="flex">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-32 h-32 object-cover"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/200/200';
                      }}
                    />
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{property.title}</h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {property.location}
                          </p>
                        </div>
                        {property.featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xl font-bold text-green-600">
                          {formatCurrency(property.price)}
                        </div>
                        <Badge className={getStatusColor(property.status)}>
                          {property.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-3">
                        <div>
                          <span className="block">{property.views}</span>
                          <span>Vues</span>
                        </div>
                        <div>
                          <span className="block">{property.inquiries}</span>
                          <span>Demandes</span>
                        </div>
                        <div>
                          <span className="block">{property.size}</span>
                          <span>Taille</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3 mr-1" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          Voir
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-3 h-3 mr-1" />
                          Partager
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Demandes */}
          <TabsContent value="inquiries" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Demandes reçues</h2>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </Button>
            </div>

            <div className="space-y-4">
              {dashboardData.recentInquiries.map((inquiry) => (
                <Card key={inquiry.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>
                              {inquiry.buyerName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{inquiry.buyerName}</h3>
                            <p className="text-sm text-gray-600">{inquiry.buyerType}</p>
                          </div>
                          <Badge className={getStatusColor(inquiry.status)}>
                            {inquiry.status}
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <p className="font-medium text-sm text-gray-700 mb-1">
                            Propriété: {inquiry.propertyTitle}
                          </p>
                          <p className="text-sm text-gray-600 mb-2">
                            Budget: {inquiry.budget}
                          </p>
                          <p className="text-sm">{inquiry.message}</p>
                        </div>
                        
                        <p className="text-xs text-gray-400">
                          {new Date(inquiry.timestamp).toLocaleString('fr-FR')}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-2" />
                          Appeler
                        </Button>
                        <Button size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Répondre
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analyses */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analyses de Performance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatCurrency(dashboardData.stats.averagePrice)}
                  </div>
                  <div className="text-sm text-gray-600">Prix moyen</div>
                  <div className="text-xs text-green-600 mt-1">+8.5% vs marché</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {dashboardData.stats.conversionRate}%
                  </div>
                  <div className="text-sm text-gray-600">Taux de conversion</div>
                  <div className="text-xs text-blue-600 mt-1">Très bon</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {Math.round(dashboardData.stats.viewsThisMonth / dashboardData.stats.activeListings)}
                  </div>
                  <div className="text-sm text-gray-600">Vues moyennes/bien</div>
                  <div className="text-xs text-purple-600 mt-1">Excellente visibilité</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recommandations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">
                      📈 Performance excellente
                    </h4>
                    <p className="text-green-800">
                      Vos prix sont 15% au-dessus de la moyenne du marché, ce qui indique une excellente valorisation de vos biens.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      💡 Optimisation suggérée
                    </h4>
                    <p className="text-blue-800">
                      Ajoutez plus de photos pour vos biens les moins consultés. Les annonces avec 8+ photos reçoivent 40% de vues en plus.
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

export default ModernVendeurDashboard;

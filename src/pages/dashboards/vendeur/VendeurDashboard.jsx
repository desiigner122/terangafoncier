import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  MapPin, 
  Upload, 
  Edit, 
  Eye, 
  DollarSign,
  FileText, 
  Camera,
  Building2,
  Users,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Filter,
  Bell,
  User,
  Share2,
  BarChart3,
  MessageSquare,
  Settings,
  Download,
  Star,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';

const VendeurDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [verificationStatus, setVerificationStatus] = useState('verified');
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalProperties: 12,
      activeListings: 8,
      pendingApproval: 2,
      soldProperties: 15,
      totalRevenue: 250000000,
      monthlyViews: 1245
    },
    properties: [
      {
        id: 1,
        title: 'Terrain résidentiel Sacré-CÅ“ur',
        location: 'Sacré-CÅ“ur, Dakar',
        price: 35000000,
        size: '800mÂ²',
        status: 'Actif',
        views: 156,
        inquiries: 12,
        datePosted: '2024-03-15',
        verificationStatus: 'Vérifié',
        photos: 8,
        type: 'Résidentiel'
      },
      {
        id: 2,
        title: 'Parcelle commerciale Plateau',
        location: 'Plateau, Dakar',
        price: 85000000,
        size: '1200mÂ²',
        status: 'En attente',
        views: 89,
        inquiries: 5,
        datePosted: '2024-03-18',
        verificationStatus: 'En cours',
        photos: 6,
        type: 'Commercial'
      }
    ],
    analytics: {
      viewsThisMonth: 1245,
      inquiriesThisMonth: 45,
      averageViewsPerListing: 155,
      conversionRate: 12.5,
      topPerformingProperty: 'Terrain résidentiel Sacré-CÅ“ur'
    },
    inquiries: [
      {
        id: 1,
        propertyTitle: 'Terrain résidentiel Sacré-CÅ“ur',
        buyerName: 'M. Diallo',
        message: 'Intéressé par une visite cette semaine',
        date: '2024-03-20',
        status: 'Nouveau',
        phone: '+221 77 123 45 67'
      },
      {
        id: 2,
        propertyTitle: 'Parcelle commerciale Plateau',
        buyerName: 'Mme Fall',
        message: 'Possibilité de négociation du prix?',
        date: '2024-03-19',
        status: 'Répondu',
        phone: '+221 76 987 65 43'
      }
    ]
  });

  useEffect(() => {
    // Simulation chargement des données
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const stats = [
    { value: dashboardData.stats.totalProperties, label: 'Total Biens' },
    { value: dashboardData.stats.activeListings, label: 'Annonces Actives' },
    { value: dashboardData.stats.soldProperties, label: 'Vendus' },
    { value: dashboardData.stats.monthlyViews, label: 'Vues/Mois' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Actif': 'bg-green-500',
      'En attente': 'bg-yellow-500',
      'Rejeté': 'bg-red-500',
      'Vendu': 'bg-blue-500',
      'Suspendu': 'bg-gray-500',
      'Vérifié': 'bg-green-500',
      'En cours': 'bg-yellow-500',
      'Nouveau': 'bg-blue-500',
      'Répondu': 'bg-green-500'
    };
    return colors[status] || 'bg-gray-500';
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre espace vendeur...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête du Dashboard */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Espace Vendeur</h1>
            <p className="text-white/90 text-lg">Gestion de vos biens immobiliers</p>
            <Badge variant="secondary" className="mt-3 bg-white/20 text-white border-white/30">
              Vendeur Particulier
            </Badge>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-white/80 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Widgets IA & Blockchain */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AIAssistantWidget userRole="Vendeur" dashboardData={dashboardData} />
        <BlockchainWidget userRole="Vendeur" />
      </div>

      {/* Status & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Verification Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  verificationStatus === 'verified' ? 'bg-green-500' :
                  verificationStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <p className="font-medium">Profil Vérifié</p>
                  <p className="text-sm text-gray-600">
                    {verificationStatus === 'verified' ? 'Certifié' : 'En attente'}
                  </p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>

          {/* Revenue This Month */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Revenus Mois</p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatCurrency(dashboardData.stats.totalRevenue / 10)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          {/* Pending Approval */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">En Attente</p>
                  <p className="text-lg font-bold text-yellow-600">
                    {dashboardData.stats.pendingApproval}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          {/* New Inquiries */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nouvelles Demandes</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {dashboardData.inquiries.filter(inq => inq.status === 'Nouveau').length}
                  </p>
                </div>
                <MessageSquare className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="properties">Mes Biens</TabsTrigger>
            <TabsTrigger value="inquiries">Demandes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2 text-blue-600" />
                    Actions Rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Ajouter un Bien
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Ajouter Photos
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier Listing
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Voir Analytics
                  </Button>
                </CardContent>
              </Card>

              {/* Performance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Taux de conversion</span>
                        <span className="text-sm font-medium">{dashboardData.analytics.conversionRate}%</span>
                      </div>
                      <Progress value={dashboardData.analytics.conversionRate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Vues moyennes</span>
                        <span className="text-sm font-medium">{dashboardData.analytics.averageViewsPerListing}</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Taux réponse</span>
                        <span className="text-sm font-medium">95%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-purple-600" />
                    Activité Récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Nouvelle demande reçue</p>
                        <p className="text-xs text-gray-500">Il y a 1 heure</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Bien ajouté avec succès</p>
                        <p className="text-xs text-gray-500">Il y a 3 heures</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Vérification en cours</p>
                        <p className="text-xs text-gray-500">Hier</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Properties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-600" />
                  Biens les Plus Performants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardData.properties.slice(0, 2).map((property) => (
                    <div key={property.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{property.title}</h4>
                          <p className="text-sm text-gray-600">{property.location}</p>
                        </div>
                        <Badge className={`${getStatusColor(property.status)} text-white`}>
                          {property.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>ðŸ‘ï¸ {property.views} vues</span>
                        <span>ðŸ“§ {property.inquiries} demandes</span>
                        <span className="font-bold text-blue-600">{formatCurrency(property.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mes Biens Immobiliers</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter Bien
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {dashboardData.properties.map((property) => (
                <Card key={property.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{property.title}</h3>
                          <Badge className={`${getStatusColor(property.status)} text-white`}>
                            {property.status}
                          </Badge>
                          <Badge className={`${getStatusColor(property.verificationStatus)} text-white`}>
                            {property.verificationStatus}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Localisation</p>
                            <p className="font-medium">{property.location}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Prix</p>
                            <p className="font-medium text-blue-600">{formatCurrency(property.price)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Surface</p>
                            <p className="font-medium">{property.size}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Type</p>
                            <p className="font-medium">{property.type}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {property.views} vues
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {property.inquiries} demandes
                          </span>
                          <span className="flex items-center">
                            <Camera className="h-4 w-4 mr-1" />
                            {property.photos} photos
                          </span>
                          <span>Publié le {new Date(property.datePosted).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-4 w-4 mr-1" />
                          Partager
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Stats
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Demandes d'Acheteurs</h2>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer par statut
              </Button>
            </div>

            <div className="grid gap-4">
              {dashboardData.inquiries.map((inquiry) => (
                <Card key={inquiry.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold">{inquiry.propertyTitle}</h3>
                          <Badge className={`${getStatusColor(inquiry.status)} text-white`}>
                            {inquiry.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Acheteur</p>
                            <p className="font-medium">{inquiry.buyerName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Téléphone</p>
                            <p className="font-medium">{inquiry.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="font-medium">{new Date(inquiry.date).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Message:</p>
                          <p className="text-sm">{inquiry.message}</p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Répondre
                        </Button>
                        <Button size="sm" variant="outline">
                          <User className="h-4 w-4 mr-1" />
                          Profil
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
              <h2 className="text-2xl font-bold">Analytics & Performance</h2>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Vues ce mois</p>
                      <p className="text-2xl font-bold text-blue-600">{dashboardData.analytics.viewsThisMonth}</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">+15% vs mois dernier</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Demandes ce mois</p>
                      <p className="text-2xl font-bold text-emerald-600">{dashboardData.analytics.inquiriesThisMonth}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-emerald-600" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">+8% vs mois dernier</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Taux conversion</p>
                      <p className="text-2xl font-bold text-purple-600">{dashboardData.analytics.conversionRate}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">+2.3% vs mois dernier</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Revenus totaux</p>
                      <p className="text-xl font-bold text-green-600">{formatCurrency(dashboardData.stats.totalRevenue)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">+12% vs mois dernier</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart YOUR_API_KEY */}
            <Card>
              <CardHeader>
                <CardTitle>Performance des Annonces</CardTitle>
                <CardDescription>Évolution des vues et demandes sur les 6 derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Graphique de performance</p>
                    <p className="text-sm text-gray-400">Intégration charts Ï  venir</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Paramètres du Vendeur</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Gérez vos préférences de notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Nouvelles demandes</span>
                    <Button size="sm" variant="outline">Activé</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Vues de biens</span>
                    <Button size="sm" variant="outline">Activé</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rappels de vérification</span>
                    <Button size="sm" variant="outline">Activé</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Confidentialité</CardTitle>
                  <CardDescription>Contrôlez la visibilité de vos informations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Profil public</span>
                    <Button size="sm" variant="outline">Activé</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Contact direct</span>
                    <Button size="sm" variant="outline">Activé</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Statistiques publiques</span>
                    <Button size="sm" variant="outline">Désactivé</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default VendeurDashboard;

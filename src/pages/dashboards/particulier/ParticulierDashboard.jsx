import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  MapPin, 
  Heart, 
  Search, 
  FileText, 
  CreditCard,
  Building2,
  Globe,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Filter,
  Bell,
  User,
  Bookmark,
  Eye,
  MessageSquare,
  Calculator
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';

const ParticulierDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [subscriptionStatus, setSubscriptionStatus] = useState('inactive');
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      savedProperties: 24,
      demandesCommunales: 3,
      demandesConstruction: 2,
      projetsPromoteurs: 5,
      budget: 25000000,
      completedPurchases: 0
    },
    favoriteProperties: [
      {
        id: 1,
        title: 'Terrain résidentiel Almadies',
        location: 'Almadies, Dakar',
        price: 15000000,
        size: '500m²',
        image: '/images/terrain1.jpg',
        status: 'Disponible',
        views: 45,
        saved: true
      }
    ],
    demandesCommunales: [
      {
        id: 1,
        zone: 'Zone A - Thiès Centre',
        surface: '300m²',
        status: 'En attente',
        submissionDate: '2024-03-10',
        estimatedPrice: 8500000,
        priority: 'Medium'
      }
    ],
    demandesConstruction: [
      {
        id: 1,
        type: 'Villa R+1',
        promoteur: 'Teranga Construction',
        budget: 35000000,
        status: 'Devis reçu',
        submissionDate: '2024-03-08',
        estimatedDuration: '8 mois'
      }
    ],
    projetsPromoteurs: [
      {
        id: 1,
        title: 'Résidence Les Palmiers',
        promoteur: 'ABC Promotion',
        location: 'Liberté 6, Dakar',
        priceRange: '12M - 25M FCFA',
        completion: 65,
        status: 'En construction',
        myParticipation: 15000000
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
    { value: dashboardData.stats.savedProperties, label: 'Favoris' },
    { value: dashboardData.stats.demandesCommunales, label: 'Demandes Communales' },
    { value: dashboardData.stats.demandesConstruction, label: 'Constructions' },
    { value: dashboardData.stats.projetsPromoteurs, label: 'Projets Suivis' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Disponible': 'bg-green-500',
      'En attente': 'bg-yellow-500',
      'Approuvé': 'bg-green-500',
      'Rejeté': 'bg-red-500',
      'En construction': 'bg-blue-500',
      'Devis reçu': 'bg-orange-500'
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Mon Espace Particulier"
      subtitle="Acheteur & Investisseur Personnel"
      userRole="Particulier"
      stats={stats}
    >
      <div className="space-y-6">
        {/* Widgets IA & Blockchain */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AIAssistantWidget userRole="Particulier" dashboardData={dashboardData} />
          <BlockchainWidget userRole="Particulier" />
        </div>

        {/* Status & Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Verification Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  verificationStatus === 'verified' ? 'bg-green-500' :
                  verificationStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <p className="font-medium">Vérification Identité</p>
                  <p className="text-sm text-gray-600">
                    {verificationStatus === 'verified' ? 'Vérifiée' :
                     verificationStatus === 'pending' ? 'En cours' : 'Requise'}
                  </p>
                </div>
                {verificationStatus !== 'verified' && (
                  <Button size="sm" variant="outline">
                    <User className="h-4 w-4 mr-1" />
                    Compléter
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  subscriptionStatus === 'active' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div>
                  <p className="font-medium">Abonnement Communal</p>
                  <p className="text-sm text-gray-600">
                    {subscriptionStatus === 'active' ? 'Actif' : 'Inactif'}
                  </p>
                </div>
                {subscriptionStatus !== 'active' && (
                  <Button size="sm" variant="outline">
                    <CreditCard className="h-4 w-4 mr-1" />
                    S'abonner
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Budget Tracker */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Budget Total</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {formatCurrency(dashboardData.stats.budget)}
                  </p>
                </div>
                <Calculator className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="communal">Demandes Communales</TabsTrigger>
            <TabsTrigger value="construction">Construction</TabsTrigger>
            <TabsTrigger value="projets">Projets Promoteurs</TabsTrigger>
            <TabsTrigger value="favoris">Mes Favoris</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2 text-emerald-600" />
                    Actions Rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Recherche Avancée
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Parcourir Carte
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Nouvelle Demande
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculateur Crédit
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Activité Récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Terrain ajouté aux favoris</p>
                        <p className="text-xs text-gray-500">Il y a 2 heures</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Demande communale soumise</p>
                        <p className="text-xs text-gray-500">Hier</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium">Devis construction reçu</p>
                        <p className="text-xs text-gray-500">Il y a 3 jours</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Market Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
                    Insights Marché
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Prix moyen Dakar</span>
                        <span className="text-sm font-medium">+12%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Demande vs Offre</span>
                        <span className="text-sm font-medium">Fort</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Taux crédit</span>
                        <span className="text-sm font-medium">7.5%</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Demandes Communales Tab */}
          <TabsContent value="communal" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Demandes Terrains Communaux</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Demande
              </Button>
            </div>

            {subscriptionStatus !== 'active' && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">Abonnement requis</p>
                      <p className="text-sm text-yellow-700">
                        Souscrivez à un abonnement pour soumettre des demandes de terrains communaux.
                      </p>
                    </div>
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                      S'abonner maintenant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {dashboardData.demandesCommunales.map((demande) => (
                <Card key={demande.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{demande.zone}</h3>
                        <p className="text-gray-600">Surface: {demande.surface}</p>
                        <p className="text-gray-600">Prix estimé: {formatCurrency(demande.estimatedPrice)}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(demande.status)} text-white`}>
                          {demande.status}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-2">
                          Soumise le {new Date(demande.submissionDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Construction Tab */}
          <TabsContent value="construction" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Demandes de Construction</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Demande
              </Button>
            </div>

            <div className="grid gap-4">
              {dashboardData.demandesConstruction.map((demande) => (
                <Card key={demande.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{demande.type}</h3>
                        <p className="text-gray-600">Promoteur: {demande.promoteur}</p>
                        <p className="text-gray-600">Budget: {formatCurrency(demande.budget)}</p>
                        <p className="text-gray-600">Durée estimée: {demande.estimatedDuration}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(demande.status)} text-white`}>
                          {demande.status}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-2">
                          Soumise le {new Date(demande.submissionDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Projets Promoteurs Tab */}
          <TabsContent value="projets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Projets Promoteurs</h2>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Parcourir Projets
              </Button>
            </div>

            <div className="grid gap-4">
              {dashboardData.projetsPromoteurs.map((projet) => (
                <Card key={projet.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{projet.title}</h3>
                        <p className="text-gray-600">Promoteur: {projet.promoteur}</p>
                        <p className="text-gray-600">Localisation: {projet.location}</p>
                        <p className="text-gray-600">Prix: {projet.priceRange}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(projet.status)} text-white`}>
                          {projet.status}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-2">
                          Ma participation: {formatCurrency(projet.myParticipation)}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Avancement</span>
                        <span>{projet.completion}%</span>
                      </div>
                      <Progress value={projet.completion} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Favoris Tab */}
          <TabsContent value="favoris" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mes Terrains Favoris</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.favoriteProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-200 relative">
                    <div className="absolute top-2 right-2">
                      <Button size="sm" variant="ghost" className="bg-white/80 hover:bg-white">
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className={`${getStatusColor(property.status)} text-white`}>
                        {property.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{property.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg text-emerald-600">
                          {formatCurrency(property.price)}
                        </p>
                        <p className="text-sm text-gray-500">{property.size}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">{property.views}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button size="sm" className="flex-1">
                        Voir Détails
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ParticulierDashboard;

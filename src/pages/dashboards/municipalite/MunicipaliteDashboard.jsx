import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  MapPin, 
  FileText, 
  Users,
  Shield, 
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  Eye,
  Edit,
  Download,
  Filter,
  Search,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  TrendingUp,
  Globe,
  Calendar,
  Hammer,
  CreditCard,
  DollarSign,
  Archive,
  Flag,
  Target,
  Users2,
  Briefcase,
  Home,
  TreePine,
  Zap,
  Truck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';

const MunicipaliteDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalRequests: 245,
      pendingRequests: 38,
      approvedRequests: 187,
      rejectedRequests: 20,
      monthlyRevenue: 0, // Gratuit pour mairies
      totalLandArea: 15420
    },
    communalRequests: [
      {
        id: 1,
        applicantName: 'M. Amadou Diallo',
        applicantPhone: '+221 77 123 45 67',
        requestedArea: '500m²',
        zone: 'Zone A - Résidentielle',
        submissionDate: '2024-03-18',
        status: 'En attente',
        purpose: 'Construction villa familiale',
        priority: 'Normal',
        estimatedPrice: 12500000,
        documents: ['CNI', 'Justificatif revenus', 'Plan construction']
      },
      {
        id: 2,
        applicantName: 'Mme Fatou Fall',
        applicantPhone: '+221 76 987 65 43',
        requestedArea: '300m²',
        zone: 'Zone B - Commerciale',
        submissionDate: '2024-03-17',
        status: 'Approuvé',
        purpose: 'Commerce de proximité',
        priority: 'Urgent',
        estimatedPrice: 8500000,
        documents: ['CNI', 'Registre commerce', 'Étude faisabilité']
      },
      {
        id: 3,
        applicantName: 'M. Ousmane Sy',
        applicantPhone: '+221 78 456 78 90',
        requestedArea: '200m²',
        zone: 'Zone C - Artisanale',
        submissionDate: '2024-03-16',
        status: 'Rejeté',
        purpose: 'Atelier mécanique',
        priority: 'Normal',
        estimatedPrice: 5000000,
        documents: ['CNI', 'Autorisation environnementale'],
        rejectionReason: 'Zone non compatible avec activité'
      }
    ],
    landInventory: [
      {
        id: 1,
        zone: 'Zone A - Résidentielle',
        totalArea: '5000m²',
        availableArea: '2800m²',
        allocatedArea: '2200m²',
        averagePrice: 25000,
        parcels: 45,
        availableParcels: 28
      },
      {
        id: 2,
        zone: 'Zone B - Commerciale',
        totalArea: '3500m²',
        availableArea: '1200m²',
        allocatedArea: '2300m²',
        averagePrice: 35000,
        parcels: 25,
        availableParcels: 8
      },
      {
        id: 3,
        zone: 'Zone C - Artisanale',
        totalArea: '4200m²',
        availableArea: '3100m²',
        allocatedArea: '1100m²',
        averagePrice: 15000,
        parcels: 35,
        availableParcels: 26
      }
    ],
    analytics: {
      monthlyRequests: [15, 22, 28, 35, 31, 38],
      requestsByZone: {
        'Zone A - Résidentielle': 45,
        'Zone B - Commerciale': 30,
        'Zone C - Artisanale': 25
      },
      approvalRate: 85,
      averageProcessingTime: 12
    },
    infrastructure: [
      {
        id: 1,
        name: 'Route Principale Nord',
        type: 'Transport',
        status: 'En cours',
        completion: 65,
        budget: 250000000,
        startDate: '2024-01-15',
        endDate: '2024-08-30'
      },
      {
        id: 2,
        name: 'Réseau Électrique Zone B',
        type: 'Énergie',
        status: 'Planifié',
        completion: 10,
        budget: 180000000,
        startDate: '2024-04-01',
        endDate: '2024-12-31'
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
    { value: dashboardData.stats.totalRequests, label: 'Total Demandes' },
    { value: dashboardData.stats.pendingRequests, label: 'En Attente' },
    { value: dashboardData.stats.approvedRequests, label: 'Approuvées' },
    { value: `${Math.round(dashboardData.stats.totalLandArea / 1000)}k m²`, label: 'Terrain Total' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'En attente': 'bg-yellow-500',
      'Approuvé': 'bg-green-500',
      'Rejeté': 'bg-red-500',
      'En cours': 'bg-blue-500',
      'Terminé': 'bg-purple-500',
      'Planifié': 'bg-orange-500',
      'Urgent': 'bg-red-500',
      'Normal': 'bg-blue-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Urgent': 'bg-red-500',
      'Normal': 'bg-blue-500',
      'Faible': 'bg-gray-500'
    };
    return colors[priority] || 'bg-gray-500';
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de l'espace municipal...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Espace Municipalité"
      subtitle="Gestion des terrains communaux - Accès Gratuit"
      userRole="Municipalité"
      stats={stats}
    >
      <div className="space-y-6">
        {/* Widgets IA & Blockchain */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AIAssistantWidget userRole="Municipalité" dashboardData={dashboardData} />
          <BlockchainWidget userRole="Municipalité" />
        </div>

        {/* Municipal Services Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Taux d'Approbation</p>
                  <p className="text-lg font-bold text-green-600">
                    {dashboardData.analytics.approvalRate}%
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <Progress value={dashboardData.analytics.approvalRate} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Temps Traitement</p>
                  <p className="text-lg font-bold text-blue-600">
                    {dashboardData.analytics.averageProcessingTime} jours
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">-2 jours vs mois dernier</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Terrain Disponible</p>
                  <p className="text-lg font-bold text-orange-600">
                    {Math.round(dashboardData.landInventory.reduce((sum, land) => 
                      sum + parseInt(land.availableArea), 0) / 1000)}k m²
                  </p>
                </div>
                <Home className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mt-2">
                <Progress value={65} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Projets Infrastructure</p>
                  <p className="text-lg font-bold text-purple-600">
                    {dashboardData.infrastructure.length}
                  </p>
                </div>
                <Hammer className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <Plus className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-purple-600">1 nouveau ce mois</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="requests">Demandes</TabsTrigger>
            <TabsTrigger value="inventory">Inventaire</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="analytics">Rapports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2 text-green-600" />
                    Actions Rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Traiter Demandes
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Gérer Zones
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Voir Statistiques
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter Données
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Requests */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-blue-600" />
                      Demandes Récentes
                    </span>
                    <Button size="sm" variant="outline">
                      Voir tout
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.communalRequests.slice(0, 3).map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{request.applicantName}</h4>
                            <p className="text-sm text-gray-600">{request.zone}</p>
                          </div>
                          <Badge className={`${getStatusColor(request.status)} text-white`}>
                            {request.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Surface: {request.requestedArea}</p>
                            <p className="text-gray-600">Usage: {request.purpose}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Soumise: {new Date(request.submissionDate).toLocaleDateString('fr-FR')}</p>
                            <p className="text-gray-600">Prix: {formatCurrency(request.estimatedPrice)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Land Zones Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                  Aperçu des Zones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {dashboardData.landInventory.map((zone) => (
                    <div key={zone.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3">{zone.zone}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Disponible</span>
                          <span className="font-medium">{zone.availableArea}</span>
                        </div>
                        <Progress 
                          value={(parseInt(zone.availableArea) / parseInt(zone.totalArea)) * 100} 
                          className="h-2" 
                        />
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Prix/m²: {formatCurrency(zone.averagePrice)}</span>
                          <span>Parcelles: {zone.availableParcels}/{zone.parcels}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Demandes de Terrains Communaux</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">En Attente</p>
                      <p className="text-2xl font-bold text-yellow-600">{dashboardData.stats.pendingRequests}</p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Approuvées</p>
                      <p className="text-2xl font-bold text-green-600">{dashboardData.stats.approvedRequests}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Rejetées</p>
                      <p className="text-2xl font-bold text-red-600">{dashboardData.stats.rejectedRequests}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Total</p>
                      <p className="text-2xl font-bold text-blue-600">{dashboardData.stats.totalRequests}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Requests List */}
            <div className="grid gap-4">
              {dashboardData.communalRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{request.applicantName}</h3>
                          <Badge className={`${getStatusColor(request.status)} text-white`}>
                            {request.status}
                          </Badge>
                          <Badge className={`${getPriorityColor(request.priority)} text-white`}>
                            {request.priority}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Téléphone</p>
                            <p className="font-medium">{request.applicantPhone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Zone demandée</p>
                            <p className="font-medium">{request.zone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Surface</p>
                            <p className="font-medium">{request.requestedArea}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Prix estimé</p>
                            <p className="font-medium text-green-600">{formatCurrency(request.estimatedPrice)}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1">Usage prévu:</p>
                          <p className="text-sm">{request.purpose}</p>
                        </div>

                        {request.rejectionReason && (
                          <div className="bg-red-50 p-3 rounded-lg mb-4">
                            <p className="text-sm text-red-800">
                              <strong>Motif de rejet:</strong> {request.rejectionReason}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Soumise le {new Date(request.submissionDate).toLocaleDateString('fr-FR')}</span>
                          <span>Documents: {request.documents.length}</span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        {request.status === 'En attente' && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approuver
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                              <XCircle className="h-4 w-4 mr-1" />
                              Rejeter
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Documents
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Inventaire des Terrains</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier Prix
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter Zone
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {dashboardData.landInventory.map((zone) => (
                <Card key={zone.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-4">{zone.zone}</h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div>
                            <p className="text-sm text-gray-600">Surface Totale</p>
                            <p className="font-medium text-blue-600">{zone.totalArea}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Disponible</p>
                            <p className="font-medium text-green-600">{zone.availableArea}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Allouée</p>
                            <p className="font-medium text-orange-600">{zone.allocatedArea}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Prix/m²</p>
                            <p className="font-medium">{formatCurrency(zone.averagePrice)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Occupation</span>
                              <span>{Math.round((parseInt(zone.allocatedArea) / parseInt(zone.totalArea)) * 100)}%</span>
                            </div>
                            <Progress 
                              value={(parseInt(zone.allocatedArea) / parseInt(zone.totalArea)) * 100} 
                              className="h-3" 
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Parcelles disponibles</span>
                              <span>{zone.availableParcels}/{zone.parcels}</span>
                            </div>
                            <Progress 
                              value={(zone.availableParcels / zone.parcels) * 100} 
                              className="h-3" 
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <MapPin className="h-4 w-4 mr-1" />
                          Voir Carte
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Statistiques
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Infrastructure Tab */}
          <TabsContent value="infrastructure" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Projets d'Infrastructure</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Projet
                </Button>
              </div>
            </div>

            {/* Infrastructure Types */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Truck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium">Transport</p>
                  <p className="text-sm text-gray-600">2 projets</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <p className="font-medium">Énergie</p>
                  <p className="text-sm text-gray-600">1 projet</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <TreePine className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium">Environnement</p>
                  <p className="text-sm text-gray-600">0 projet</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Users2 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="font-medium">Social</p>
                  <p className="text-sm text-gray-600">0 projet</p>
                </CardContent>
              </Card>
            </div>

            {/* Infrastructure Projects */}
            <div className="grid gap-6">
              {dashboardData.infrastructure.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{project.name}</h3>
                          <Badge className={`${getStatusColor(project.status)} text-white`}>
                            {project.status}
                          </Badge>
                          <Badge variant="outline">
                            {project.type}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Budget</p>
                            <p className="font-medium">{formatCurrency(project.budget)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Début</p>
                            <p className="font-medium">{new Date(project.startDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Fin prévue</p>
                            <p className="font-medium">{new Date(project.endDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Avancement</p>
                            <p className="font-medium">{project.completion}%</p>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progression</span>
                            <span>{project.completion}%</span>
                          </div>
                          <Progress value={project.completion} className="h-3" />
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Planning
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
              <h2 className="text-2xl font-bold">Rapports & Analytics</h2>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter Rapport
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Demandes/Mois</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {dashboardData.analytics.monthlyRequests[dashboardData.analytics.monthlyRequests.length - 1]}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Taux Approbation</p>
                      <p className="text-2xl font-bold text-green-600">{dashboardData.analytics.approvalRate}%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Temps Moyen</p>
                      <p className="text-2xl font-bold text-orange-600">{dashboardData.analytics.averageProcessingTime}j</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Satisfaction</p>
                      <p className="text-2xl font-bold text-purple-600">94%</p>
                    </div>
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Demandes par Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(dashboardData.analytics.requestsByZone).map(([zone, percentage]) => (
                      <div key={zone}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{zone}</span>
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
                  <CardTitle>Évolution Mensuelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Graphique des demandes</p>
                      <div className="flex space-x-2 mt-2 text-sm text-gray-400">
                        {dashboardData.analytics.monthlyRequests.map((count, index) => (
                          <span key={index}>{count}</span>
                        ))}
                      </div>
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

export default MunicipaliteDashboard;

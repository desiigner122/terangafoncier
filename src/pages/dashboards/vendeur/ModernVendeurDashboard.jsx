import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  // Core Icons
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
  Globe,
  
  // AI & Blockchain Icons
  Brain,
  Zap,
  Shield,
  Lock,
  Unlock,
  Database,
  Network,
  Cpu,
  Activity,
  Target,
  Layers,
  HardDrive,
  Server,
  Wifi,
  
  // Advanced Features
  Calculator,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  Rocket,
  PieChart,
  LineChart,
  BarChart4
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';
import { OpenAIService } from '../../../services/ai/OpenAIService';

const ModernVendeurDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [verificationStatus, setVerificationStatus] = useState('verified');
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState([]);
  const [blockchainTransactions, setBlockchainTransactions] = useState([]);
  const [aiPriceRecommendations, setAiPriceRecommendations] = useState([]);

  // Fonctions de gestion IA avancées
  const handleAIPropertyAnalysis = async (property) => {
    console.log('Analyse IA de la propriété:', property.title);
    try {
      const analysis = await OpenAIService.analyzeProperty({
        title: property.title,
        location: property.location,
        price: property.price,
        size: property.size,
        type: property.type,
        marketData: dashboardData.marketTrends
      });
      setAiInsights(prev => [...prev, analysis]);
    } catch (error) {
      console.error('Erreur analyse IA:', error);
    }
  };

  const handleAIPriceOptimization = async () => {
    console.log('Optimisation prix IA');
    try {
      const recommendations = await OpenAIService.optimizePricing({
        properties: dashboardData.properties,
        marketData: dashboardData.marketTrends,
        location: 'Dakar, Sénégal'
      });
      setAiPriceRecommendations(recommendations);
    } catch (error) {
      console.error('Erreur optimisation prix IA:', error);
    }
  };

  const handleBlockchainVerification = (property) => {
    console.log('Vérification blockchain propriété:', property.title);
    // Simulation vérification blockchain
    const transaction = {
      id: `TX${Date.now()}`,
      propertyId: property.id,
      type: 'verification',
      status: 'confirmed',
      blockHeight: Math.floor(Math.random() * 100000),
      hash: `0x${Math.random().toString(16).slice(2, 18)}`,
      timestamp: new Date().toISOString()
    };
    setBlockchainTransactions(prev => [transaction, ...prev]);
  };

  const handleSmartContractCreation = (property) => {
    console.log('Création smart contract pour:', property.title);
    // Simulation création smart contract
    const contract = {
      id: `SC${Date.now()}`,
      propertyId: property.id,
      type: 'sale_contract',
      status: 'deployed',
      address: `0x${Math.random().toString(16).slice(2, 42)}`,
      network: 'TerangaChain',
      gasUsed: Math.floor(Math.random() * 50000),
      timestamp: new Date().toISOString()
    };
    setBlockchainTransactions(prev => [contract, ...prev]);
  };

  // Fonctions de gestion classiques améliorées
  const handleAddProperty = () => {
    console.log('Ajouter un bien avec IA');
    setActiveTab('ai-listing');
  };

  const handleAddPhotos = () => {
    console.log('Ajouter des photos avec analyse IA');
    // TODO: Intégrer analyse d'images IA
  };

  const handleEditListing = () => {
    console.log('Modifier listing avec recommandations IA');
    setActiveTab('ai-optimization');
  };

  const handleViewAnalytics = () => {
    console.log('Voir analytics IA/Blockchain');
    setActiveTab('analytics');
  };

  const handleViewProperty = (property) => {
    console.log('Voir propriété avec données blockchain:', property.title);
    handleBlockchainVerification(property);
  };

  const handleEditProperty = (property) => {
    console.log('Éditer propriété avec IA:', property.title);
    handleAIPropertyAnalysis(property);
  };

  const handleDeleteProperty = (property) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${property.title}" ? Cette action sera enregistrée sur la blockchain.`)) {
      setDashboardData(prev => ({
        ...prev,
        properties: prev.properties.filter(p => p.id !== property.id)
      }));
      
      // Enregistrer suppression sur blockchain
      const transaction = {
        id: `TX${Date.now()}`,
        propertyId: property.id,
        type: 'property_deleted',
        status: 'confirmed',
        hash: `0x${Math.random().toString(16).slice(2, 18)}`,
        timestamp: new Date().toISOString()
      };
      setBlockchainTransactions(prev => [transaction, ...prev]);
      console.log('Propriété supprimée et enregistrée sur blockchain');
    }
  };

  const handleShareProperty = (property) => {
    console.log('Partager propriété avec certificat blockchain:', property.title);
    // Générer certificat blockchain pour partage
    handleBlockchainVerification(property);
  };

  // Données dashboard enrichies avec IA/Blockchain
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalProperties: 12,
      activeListings: 8,
      pendingApproval: 2,
      soldProperties: 15,
      totalRevenue: 250000000,
      monthlyViews: 1245,
      blockchainVerified: 10,
      aiOptimized: 6,
      smartContracts: 4
    },
    aiMetrics: {
      priceAccuracy: 94.5,
      marketTrendPrediction: 87.2,
      listingOptimization: 91.8,
      photoQualityScore: 88.3
    },
    blockchainMetrics: {
      verificationRate: 95.8,
      transactionSpeed: 2.3, // seconds
      smartContractsActive: 12,
      networkUptime: 99.9
    },
    marketTrends: {
      priceGrowth: 12.5,
      demandIndex: 85,
      competitorCount: 23,
      averageSaleTime: 45 // days
    },
    properties: [
      {
        id: 1,
        title: 'Terrain résidentiel Sacré-Cœur',
        location: 'Sacré-Cœur, Dakar',
        price: 85000000,
        size: '500m²',
        type: 'Terrain',
        status: 'active',
        photos: 8,
        views: 145,
        datePosted: '2024-02-15',
        aiScore: 92,
        blockchainVerified: true,
        smartContract: true,
        priceRecommendation: 82000000,
        marketPosition: 'optimal'
      },
      {
        id: 2,
        title: 'Villa moderne Almadies',
        location: 'Almadies, Dakar',
        price: 350000000,
        size: '300m²',
        type: 'Villa',
        status: 'active',
        photos: 15,
        views: 89,
        datePosted: '2024-02-20',
        aiScore: 88,
        blockchainVerified: true,
        smartContract: false,
        priceRecommendation: 345000000,
        marketPosition: 'competitive'
      },
      {
        id: 3,
        title: 'Appartement haut standing Mermoz',
        location: 'Mermoz, Dakar',
        price: 125000000,
        size: '120m²',
        type: 'Appartement',
        status: 'pending',
        photos: 12,
        views: 67,
        datePosted: '2024-02-25',
        aiScore: 85,
        blockchainVerified: false,
        smartContract: false,
        priceRecommendation: 130000000,
        marketPosition: 'underpriced'
      }
    ]
  });

  // Génération d'insights IA
  const generateAIInsights = async () => {
    try {
      const insights = await OpenAIService.generateVendorInsights({
        properties: dashboardData.properties,
        stats: dashboardData.stats,
        marketTrends: dashboardData.marketTrends
      });
      setAiInsights(insights);
    } catch (error) {
      console.error('Erreur génération insights IA:', error);
      // Fallback avec insights mockup
      setAiInsights([
        {
          type: 'opportunity',
          title: 'Prix optimal détecté',
          description: 'L\'appartement Mermoz pourrait être vendu 4% plus cher selon l\'analyse marché IA',
          priority: 'high',
          action: 'Ajuster le prix à 130M XOF',
          impact: '+5M XOF de revenus potentiels'
        },
        {
          type: 'success',
          title: 'Performance marketing excellente',
          description: 'La villa Almadies génère 40% plus de vues que la moyenne du secteur',
          priority: 'low',
          action: 'Maintenir la stratégie actuelle'
        },
        {
          type: 'warning',
          title: 'Certification blockchain recommandée',
          description: '1 propriété non vérifiée sur blockchain, risque de confiance réduit',
          priority: 'medium',
          action: 'Lancer vérification blockchain'
        }
      ]);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      await generateAIInsights();
      // Simulation données blockchain
      setBlockchainTransactions([
        {
          id: 'TX001',
          type: 'property_verified',
          status: 'confirmed',
          property: 'Terrain Sacré-Cœur',
          hash: '0xabcd...1234',
          timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'SC001',
          type: 'smart_contract',
          status: 'deployed',
          property: 'Villa Almadies',
          address: '0x5678...efgh',
          timestamp: new Date(Date.now() - 172800000).toISOString()
        }
      ]);
      setLoading(false);
    };
    
    loadDashboard();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getAIScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMarketPositionColor = (position) => {
    switch (position) {
      case 'optimal': return 'text-green-600 bg-green-100';
      case 'competitive': return 'text-blue-600 bg-blue-100';
      case 'underpriced': return 'text-orange-600 bg-orange-100';
      case 'overpriced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Brain className="h-12 w-12 text-purple-600 animate-pulse mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Initialisation IA & Blockchain...
              </h3>
              <p className="text-gray-600">
                Analyse intelligente de votre portefeuille immobilier
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header avec IA/Blockchain */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Building2 className="h-8 w-8 text-purple-600" />
                Dashboard Vendeur IA
                <Badge className="bg-purple-100 text-purple-800 text-xs">
                  <Brain className="h-3 w-3 mr-1" />
                  IA Activée
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Blockchain
                </Badge>
              </h1>
              <p className="text-gray-600">
                Gestion intelligente de vos biens immobiliers avec IA et blockchain
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleAIPriceOptimization}
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Optimiser Prix IA
              </Button>
              <Button 
                onClick={handleAddProperty}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4" />
                Nouveau Bien IA
              </Button>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation Tabs */}
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Insights IA
            </TabsTrigger>
            <TabsTrigger value="blockchain" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Blockchain
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="ai-listing" className="flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              Listing IA
            </TabsTrigger>
            <TabsTrigger value="smart-contracts" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Smart Contracts
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards avec IA/Blockchain */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stats classiques */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-full bg-purple-50">
                        <Building2 className="h-6 w-6 text-purple-600" />
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        +12% ce mois
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {dashboardData.stats.totalProperties}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Propriétés totales
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats IA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-full bg-purple-50">
                        <Brain className="h-6 w-6 text-purple-600" />
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">
                        IA Active
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {dashboardData.aiMetrics.priceAccuracy}%
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Précision prix IA
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats Blockchain */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="hover:shadow-lg transition-shadow border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-full bg-blue-50">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        Vérifié
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {dashboardData.stats.blockchainVerified}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Biens certifiés blockchain
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Revenus */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-full bg-green-50">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        +18% ce mois
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {formatCurrency(dashboardData.stats.totalRevenue)}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Revenus totaux
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Actions Rapides IA/Blockchain */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-purple-600" />
                    Actions IA Rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" onClick={handleAddProperty}>
                    <Brain className="h-4 w-4 mr-2" />
                    Listing IA Optimisé
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={handleAddPhotos}>
                    <Camera className="h-4 w-4 mr-2" />
                    Analyse Photos IA
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={handleAIPriceOptimization}>
                    <Calculator className="h-4 w-4 mr-2" />
                    Optimisation Prix
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={handleViewAnalytics}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Prédictions Marché
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-600" />
                    Actions Blockchain
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('blockchain')}>
                    <Database className="h-4 w-4 mr-2" />
                    Vérifier Propriétés
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('smart-contracts')}>
                    <Network className="h-4 w-4 mr-2" />
                    Smart Contracts
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => console.log('Historique blockchain')}>
                    <Clock className="h-4 w-4 mr-2" />
                    Historique Blockchain
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => console.log('NFT propriétés')}>
                    <Star className="h-4 w-4 mr-2" />
                    Créer NFT Propriété
                  </Button>
                </CardContent>
              </Card>

              {/* Widget IA Assistant */}
              <AIAssistantWidget />
            </div>

            {/* Propriétés avec scores IA */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Mes Biens Immobiliers
                    <Badge className="bg-purple-100 text-purple-800 text-xs">
                      IA Optimisé
                    </Badge>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => console.log('Filtrer avec IA')}>
                      <Filter className="h-4 w-4 mr-2" />
                      Filtre IA
                    </Button>
                    <Button onClick={handleAddProperty} className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter Bien IA
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.properties.map((property) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="font-semibold text-lg text-gray-900">
                              {property.title}
                            </h3>
                            <Badge className={getAIScoreColor(property.aiScore)}>
                              <Brain className="h-3 w-3 mr-1" />
                              Score IA: {property.aiScore}
                            </Badge>
                            <Badge className={getMarketPositionColor(property.marketPosition)}>
                              {property.marketPosition}
                            </Badge>
                            {property.blockchainVerified && (
                              <Badge className="bg-blue-100 text-blue-800">
                                <Shield className="h-3 w-3 mr-1" />
                                Vérifié
                              </Badge>
                            )}
                            {property.smartContract && (
                              <Badge className="bg-green-100 text-green-800">
                                <Network className="h-3 w-3 mr-1" />
                                Smart Contract
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <p className="font-medium text-gray-900">Prix</p>
                              <p>{formatCurrency(property.price)}</p>
                              {property.priceRecommendation !== property.price && (
                                <p className="text-purple-600 text-xs flex items-center">
                                  <Lightbulb className="h-3 w-3 mr-1" />
                                  IA: {formatCurrency(property.priceRecommendation)}
                                </p>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Localisation</p>
                              <p>{property.location}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Taille</p>
                              <p>{property.size}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Vues</p>
                              <p className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {property.views}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button size="sm" variant="outline" onClick={() => handleEditProperty(property)}>
                            <Brain className="h-4 w-4 mr-1" />
                            Analyse IA
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleViewProperty(property)}>
                            <Shield className="h-4 w-4 mr-1" />
                            Vérifier Blockchain
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleSmartContractCreation(property)}>
                            <Network className="h-4 w-4 mr-1" />
                            Smart Contract
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleShareProperty(property)}>
                            <Share2 className="h-4 w-4 mr-1" />
                            Partager
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights IA */}
          <TabsContent value="ai-insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Insights IA */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Recommandations IA
                  </CardTitle>
                  <CardDescription>
                    Insights intelligents pour optimiser vos ventes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence>
                    {aiInsights.map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Alert className={`${
                          insight.priority === 'high' ? 'border-red-200 bg-red-50' :
                          insight.priority === 'medium' ? 'border-orange-200 bg-orange-50' :
                          'border-green-200 bg-green-50'
                        }`}>
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${
                              insight.type === 'opportunity' ? 'bg-green-100 text-green-600' :
                              insight.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {insight.type === 'opportunity' ? <TrendingUp className="h-4 w-4" /> :
                               insight.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                               <CheckCircle className="h-4 w-4" />}
                            </div>
                            <div className="flex-1">
                              <AlertTitle className="text-sm font-semibold">
                                {insight.title}
                              </AlertTitle>
                              <AlertDescription className="text-sm mt-2">
                                {insight.description}
                              </AlertDescription>
                              {insight.impact && (
                                <p className="text-sm font-medium text-green-600 mt-2">
                                  💡 Impact: {insight.impact}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-3">
                                <Button size="sm" className="text-xs">
                                  {insight.action}
                                </Button>
                                <Badge variant="outline" className="text-xs">
                                  {insight.priority}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </Alert>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Métriques IA */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Performance IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Précision Prix</span>
                        <span className="text-sm text-gray-600">{dashboardData.aiMetrics.priceAccuracy}%</span>
                      </div>
                      <Progress value={dashboardData.aiMetrics.priceAccuracy} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Prédiction Tendances</span>
                        <span className="text-sm text-gray-600">{dashboardData.aiMetrics.marketTrendPrediction}%</span>
                      </div>
                      <Progress value={dashboardData.aiMetrics.marketTrendPrediction} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Optimisation Listings</span>
                        <span className="text-sm text-gray-600">{dashboardData.aiMetrics.listingOptimization}%</span>
                      </div>
                      <Progress value={dashboardData.aiMetrics.listingOptimization} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Qualité Photos</span>
                        <span className="text-sm text-gray-600">{dashboardData.aiMetrics.photoQualityScore}%</span>
                      </div>
                      <Progress value={dashboardData.aiMetrics.photoQualityScore} className="h-2" />
                    </div>
                  </div>

                  {/* Actions IA avancées */}
                  <div className="pt-4 border-t space-y-2">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={handleAIPriceOptimization}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Lancer Optimisation Complète
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => console.log('Analyse marché IA')}
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Analyse Marché Avancée
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Blockchain */}
          <TabsContent value="blockchain" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Statut Blockchain */}
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Statut Blockchain
                  </CardTitle>
                  <CardDescription>
                    Vérification et certification de vos propriétés
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-blue-600">
                        {dashboardData.blockchainMetrics.verificationRate}%
                      </h3>
                      <p className="text-sm text-gray-600">Taux de vérification</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h3 className="text-2xl font-bold text-green-600">
                        {dashboardData.blockchainMetrics.transactionSpeed}s
                      </h3>
                      <p className="text-sm text-gray-600">Temps de transaction</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Actions Blockchain</h4>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => console.log('Vérifier toutes propriétés')}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Vérifier Toutes les Propriétés
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => console.log('Créer certificat propriété')}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Créer Certificat de Propriété
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => console.log('Historique transactions')}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Historique Transactions
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Transactions Blockchain */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Transactions Récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {blockchainTransactions.map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'property_verified' ? 'bg-green-100 text-green-600' :
                          transaction.type === 'smart_contract' ? 'bg-blue-100 text-blue-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {transaction.type === 'property_verified' ? <CheckCircle className="h-4 w-4" /> :
                           transaction.type === 'smart_contract' ? <Network className="h-4 w-4" /> :
                           <Database className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {transaction.type === 'property_verified' ? 'Propriété Vérifiée' :
                             transaction.type === 'smart_contract' ? 'Smart Contract Créé' :
                             'Transaction Blockchain'}
                          </p>
                          <p className="text-xs text-gray-600">
                            {transaction.property || `ID: ${transaction.id}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.timestamp).toLocaleString('fr-FR')}
                          </p>
                        </div>
                        <Badge 
                          className={
                            transaction.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'deployed' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Widget Blockchain */}
            <BlockchainWidget />
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tendances Marché */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Tendances Marché IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Croissance Prix</span>
                          <span className="text-sm text-gray-600 flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
                            +{dashboardData.marketTrends.priceGrowth}%
                          </span>
                        </div>
                        <Progress value={dashboardData.marketTrends.priceGrowth * 8} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Index Demande</span>
                          <span className="text-sm text-gray-600">{dashboardData.marketTrends.demandIndex}/100</span>
                        </div>
                        <Progress value={dashboardData.marketTrends.demandIndex} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-2xl font-bold text-blue-600">
                          {dashboardData.marketTrends.competitorCount}
                        </h3>
                        <p className="text-sm text-gray-600">Concurrents actifs</p>
                      </div>
                      
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <h3 className="text-2xl font-bold text-orange-600">
                          {dashboardData.marketTrends.averageSaleTime}j
                        </h3>
                        <p className="text-sm text-gray-600">Temps vente moyen</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-3">Prédictions IA</h4>
                    <div className="space-y-2">
                      <Alert className="border-blue-200 bg-blue-50">
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Tendance haussière prévue</strong> - Les prix devraient augmenter de 8-12% dans les 6 prochains mois selon l'analyse IA.
                        </AlertDescription>
                      </Alert>
                      <Alert className="border-green-200 bg-green-50">
                        <TrendingUp className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Demande élevée détectée</strong> - Zone Almadies particulièrement attractive pour les investisseurs.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Actions Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => console.log('Rapport performance IA')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Rapport Performance
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => console.log('Analyse concurrence IA')}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Analyse Concurrence
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => console.log('Prédictions marché')}
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Prédictions Marché
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => console.log('Export données')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exporter Données
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Listing IA */}
          <TabsContent value="ai-listing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-purple-600" />
                  Création de Listing Optimisé IA
                </CardTitle>
                <CardDescription>
                  Créez des annonces optimisées grâce à l'intelligence artificielle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="border-purple-200 bg-purple-50 mb-6">
                  <Brain className="h-4 w-4" />
                  <AlertTitle>Assistant IA Activé</AlertTitle>
                  <AlertDescription>
                    L'IA vous aidera à optimiser le prix, la description et le positionnement de votre propriété.
                  </AlertDescription>
                </Alert>
                
                <div className="text-center py-12">
                  <Rocket className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Interface de Listing IA
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Fonctionnalité en cours de développement
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Démarrer Assistant IA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Smart Contracts */}
          <TabsContent value="smart-contracts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-blue-600" />
                  Gestion Smart Contracts
                </CardTitle>
                <CardDescription>
                  Automatisez vos transactions immobilières avec les smart contracts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-2xl font-bold text-blue-600">
                      {dashboardData.blockchainMetrics.smartContractsActive}
                    </h3>
                    <p className="text-sm text-gray-600">Contrats Actifs</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h3 className="text-2xl font-bold text-green-600">
                      {dashboardData.blockchainMetrics.networkUptime}%
                    </h3>
                    <p className="text-sm text-gray-600">Disponibilité Réseau</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h3 className="text-2xl font-bold text-purple-600">
                      {dashboardData.stats.smartContracts}
                    </h3>
                    <p className="text-sm text-gray-600">Mes Contrats</p>
                  </div>
                </div>
                
                <div className="text-center py-12">
                  <Network className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Interface Smart Contracts
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Gérez vos contrats intelligents en toute sécurité
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer Smart Contract
                    </Button>
                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir Mes Contrats
                    </Button>
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
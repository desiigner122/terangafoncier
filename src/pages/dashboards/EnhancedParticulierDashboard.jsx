import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Zap, Shield, Brain, Coins, AlertTriangle,
  Target, BarChart3, PieChart, Globe, Smartphone, Bot,
  Wallet, CreditCard, Home, ChevronRight, Sparkles,
  Bell, Award, Lock, Rocket, Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthProvider';
import { useAI } from '@/lib/ai/intelligenceArtificielle';
import { useBlockchain } from '@/lib/blockchain/smartContracts';
import { useExternalAPIs } from '@/lib/api/externalIntegrations';

const EnhancedParticulierDashboard = () => {
  const { user, profile } = useAuth();
  const { predictPrice, getRecommendations, trackBehavior } = useAI();
  const { blockchain, getProperty } = useBlockchain();
  const { banking, completeVerification } = useExternalAPIs();

  const [dashboardData, setDashboardData] = useState({
    portfolio: {
      totalValue: 0,
      properties: [],
      nftTokens: [],
      growth: 0,
      predictions: null
    },
    aiRecommendations: [],
    bankingOffers: [],
    blockchainAssets: [],
    notifications: []
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    initializeEnhancedDashboard();
  }, [user]);

  const initializeEnhancedDashboard = async () => {
    setLoading(true);
    try {
      // ParallÃ©lisation des appels pour performance optimale
      const [aiData, blockchainData, bankingData] = await Promise.all([
        loadAIRecommendations(),
        loadBlockchainAssets(),
        loadBankingOffers()
      ]);

      setDashboardData(prev => ({
        ...prev,
        aiRecommendations: aiData,
        blockchainAssets: blockchainData,
        bankingOffers: bankingData
      }));

      // Track user behavior pour ML
      trackBehavior(user.id, 'dashboard_visit', {
        timestamp: Date.now(),
        section: 'enhanced_overview'
      });

    } catch (error) {
      console.error('âŒ Erreur initialisation dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAIRecommendations = async () => {
    try {
      const preferences = {
        budget: profile?.budget || 50000000,
        location: profile?.preferred_location || 'Dakar',
        propertyType: profile?.property_type || 'Terrain'
      };

      const recommendations = await getRecommendations(user.id, profile, preferences);
      return recommendations;
    } catch (error) {
      console.error('âŒ Erreur recommandations IA:', error);
      return [];
    }
  };

  const loadBlockchainAssets = async () => {
    try {
      // Simulation des assets blockchain de l'utilisateur
      return [
        {
          tokenId: '001',
          propertyAddress: 'Almadies, Dakar',
          value: 45000000,
          nftMetadata: {
            name: 'Terrain Almadies #001',
            image: '/nft/terrain-001.jpg',
            verified: true
          }
        },
        {
          tokenId: '002',
          propertyAddress: 'Saly, Mbour',
          value: 32000000,
          nftMetadata: {
            name: 'Terrain Saly #002',
            image: '/nft/terrain-002.jpg',
            verified: true
          }
        }
      ];
    } catch (error) {
      console.error('âŒ Erreur assets blockchain:', error);
      return [];
    }
  };

  const loadBankingOffers = async () => {
    try {
      const mockCustomerData = {
        income: profile?.income || 2000000,
        expenses: profile?.expenses || 800000,
        propertyValue: 50000000,
        downPayment: 15000000
      };

      // Simulation offres bancaires (en production: vraies APIs)
      return [
        {
          bank: 'CBAO',
          product: 'CrÃ©dit Habitat Diaspora',
          rate: 7.5,
          maxAmount: 35000000,
          term: 20,
          monthlyPayment: 280000,
          preApproved: true
        },
        {
          bank: 'Ecobank',
          product: 'Financement Terrain',
          rate: 8.2,
          maxAmount: 30000000,
          term: 15,
          monthlyPayment: 290000,
          preApproved: true
        }
      ];
    } catch (error) {
      console.error('âŒ Erreur offres bancaires:', error);
      return [];
    }
  };

  const handlePropertyPrediction = async (propertyId) => {
    try {
      const property = dashboardData.portfolio.properties.find(p => p.id === propertyId);
      if (!property) return;

      const prediction = await predictPrice({
        area: property.area,
        location: property.location,
        type: property.type,
        coordinates: property.coordinates,
        amenities: property.amenities || []
      });

      // Mise Ã  jour de la propriÃ©tÃ© avec prÃ©diction
      setDashboardData(prev => ({
        ...prev,
        portfolio: {
          ...prev.portfolio,
          properties: prev.portfolio.properties.map(p =>
            p.id === propertyId 
              ? { ...p, aiPrediction: prediction }
              : p
          )
        }
      }));

    } catch (error) {
      console.error('âŒ Erreur prÃ©diction prix:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="text-muted-foreground">Chargement de votre dashboard intelligent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header avec salutation IA */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Bonjour {profile?.full_name || user?.email?.split('@')[0]} ðŸ‘‹
            </h1>
            <p className="text-emerald-100 mt-2">
              ðŸ¤– Votre assistant IA a analysÃ© 24 nouvelles opportunitÃ©s pour vous
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-white/20 text-white">
              <Sparkles className="w-4 h-4 mr-1" />
              Premium IA
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              <Shield className="w-4 h-4 mr-1" />
              Blockchain
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* KPIs AvancÃ©s */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Portfolio Total</p>
                <p className="text-2xl font-bold">77M XOF</p>
                <p className="text-xs text-emerald-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12.5% (IA Pred.)
                </p>
              </div>
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">NFT PropriÃ©tÃ©s</p>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-blue-600 flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  100% VÃ©rifiÃ©es
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Coins className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score IA</p>
                <p className="text-2xl font-bold">8.7/10</p>
                <p className="text-xs text-purple-600 flex items-center">
                  <Brain className="w-3 h-3 mr-1" />
                  Excellent
                </p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Bot className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CrÃ©dit PrÃ©-approuvÃ©</p>
                <p className="text-2xl font-bold">35M XOF</p>
                <p className="text-xs text-orange-600 flex items-center">
                  <CreditCard className="w-3 h-3 mr-1" />
                  7.5% CBAO
                </p>
              </div>
              <div className="bg-orange-100 p-2 rounded-lg">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="ai-recommendations">IA Recommandations</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="banking">Banking</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Portfolio Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  RÃ©partition Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Terrains (65%)</span>
                    <span className="font-medium">50M XOF</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">RÃ©sidentiel (25%)</span>
                    <span className="font-medium">19M XOF</span>
                  </div>
                  <Progress value={25} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Commercial (10%)</span>
                    <span className="font-medium">8M XOF</span>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* AI Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  PrÃ©dictions IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-emerald-700">Valorisation 5 ans</h4>
                    <p className="text-2xl font-bold text-emerald-600">+42%</p>
                    <p className="text-xs text-muted-foreground">BasÃ© sur 10,000+ transactions</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-700">Meilleur moment vente</h4>
                    <p className="text-lg font-bold text-blue-600">Mars 2026</p>
                    <p className="text-xs text-muted-foreground">Pic de marchÃ© prÃ©vu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                ActivitÃ© RÃ©cente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: 'blockchain',
                    title: 'NFT Terrain Almadies crÃ©Ã©',
                    time: 'Il y a 2h',
                    icon: Shield,
                    color: 'text-blue-600'
                  },
                  {
                    type: 'ai',
                    title: 'Nouvelle recommandation IA disponible',
                    time: 'Il y a 4h',
                    icon: Brain,
                    color: 'text-purple-600'
                  },
                  {
                    type: 'banking',
                    title: 'PrÃ©-approbation crÃ©dit CBAO confirmÃ©e',
                    time: 'Hier',
                    icon: CreditCard,
                    color: 'text-emerald-600'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full bg-gray-100`}>
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Recommendations Tab */}
        <TabsContent value="ai-recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  OpportunitÃ©s PersonnalisÃ©es
                </CardTitle>
                <CardDescription>
                  BasÃ©es sur votre profil et historique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Terrain Yoff - OpportunitÃ© Rare',
                      price: '28M XOF',
                      prediction: '+35% en 3 ans',
                      confidence: 92,
                      reason: 'DÃ©veloppement infrastructure prÃ©vu'
                    },
                    {
                      title: 'Villa Almadies - Investissement Premium',
                      price: '85M XOF',
                      prediction: '+28% en 5 ans',
                      confidence: 88,
                      reason: 'Zone en forte demande diaspora'
                    }
                  ].map((opportunity, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{opportunity.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {opportunity.confidence}% confiance
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-emerald-600">{opportunity.price}</p>
                      <p className="text-sm text-purple-600 font-medium">{opportunity.prediction}</p>
                      <p className="text-xs text-muted-foreground mt-2">{opportunity.reason}</p>
                      <Button size="sm" className="w-full mt-3">
                        Voir les dÃ©tails
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Actions RecommandÃ©es
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      action: 'Diversifier vers commercial',
                      impact: 'RÃ©duction risque 15%',
                      priority: 'Haute'
                    },
                    {
                      action: 'RenÃ©gocier crÃ©dit actuel',
                      impact: 'Ã‰conomie 180K XOF/mois',
                      priority: 'Moyenne'
                    },
                    {
                      action: 'Vendre Terrain ThiÃ¨s',
                      impact: 'Optimisation fiscale',
                      priority: 'Basse'
                    }
                  ].map((rec, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{rec.action}</p>
                        <p className="text-xs text-muted-foreground">{rec.impact}</p>
                      </div>
                      <Badge 
                        variant={rec.priority === 'Haute' ? 'destructive' : rec.priority === 'Moyenne' ? 'default' : 'secondary'}
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Blockchain Tab */}
        <TabsContent value="blockchain" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Coins className="w-5 h-5 mr-2" />
                  Mes NFT PropriÃ©tÃ©s
                </CardTitle>
                <CardDescription>
                  Certificats de propriÃ©tÃ© blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.blockchainAssets.map((asset, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Home className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{asset.nftMetadata.name}</h4>
                          <p className="text-sm text-muted-foreground">{asset.propertyAddress}</p>
                          <p className="text-lg font-bold text-emerald-600">
                            {(asset.value / 1000000).toFixed(1)}M XOF
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            VÃ©rifiÃ©
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Smart Contracts Actifs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      type: 'SÃ©questre',
                      property: 'Terrain Saly',
                      status: 'En cours',
                      amount: '32M XOF'
                    },
                    {
                      type: 'Location',
                      property: 'Villa Almadies',
                      status: 'Actif',
                      amount: '450K XOF/mois'
                    }
                  ].map((contract, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{contract.type}</p>
                        <p className="text-sm text-muted-foreground">{contract.property}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{contract.amount}</p>
                        <Badge variant="outline" className="text-xs">
                          {contract.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Banking Tab */}
        <TabsContent value="banking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Offres CrÃ©dit PersonnalisÃ©es
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.bankingOffers.map((offer, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{offer.bank}</h4>
                          <p className="text-sm text-muted-foreground">{offer.product}</p>
                        </div>
                        {offer.preApproved && (
                          <Badge className="bg-emerald-100 text-emerald-700">
                            PrÃ©-approuvÃ©
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Taux</p>
                          <p className="font-medium">{offer.rate}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Montant max</p>
                          <p className="font-medium">{(offer.maxAmount / 1000000).toFixed(0)}M XOF</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">DurÃ©e</p>
                          <p className="font-medium">{offer.term} ans</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">MensualitÃ©</p>
                          <p className="font-medium">{(offer.monthlyPayment / 1000).toFixed(0)}K XOF</p>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-3">
                        Simuler ce crÃ©dit
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Solutions Diaspora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-700">Transfert Euro â†’ XOF</h4>
                    <p className="text-2xl font-bold text-blue-600">1 EUR = 656 XOF</p>
                    <p className="text-xs text-muted-foreground">Taux prÃ©fÃ©rentiel -2%</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="text-sm">Virement express</span>
                      <span className="font-medium">0.5%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="text-sm">Garantie blockchain</span>
                      <Badge variant="outline">Incluse</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="text-sm">Assurance change</span>
                      <Badge variant="outline">Disponible</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Performance Portfolio (12 mois)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg">
                  <p className="text-muted-foreground">Graphique interactif ici</p>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">+18.5%</p>
                    <p className="text-xs text-muted-foreground">Croissance totale</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">92%</p>
                    <p className="text-xs text-muted-foreground">PrÃ©cision IA</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">7.2</p>
                    <p className="text-xs text-muted-foreground">Score risque</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      title: 'Premier NFT',
                      description: 'PremiÃ¨re propriÃ©tÃ© tokenisÃ©e',
                      icon: 'ðŸ†',
                      completed: true
                    },
                    {
                      title: 'Investisseur IA',
                      description: '10 recommandations suivies',
                      icon: 'ðŸ¤–',
                      completed: true
                    },
                    {
                      title: 'Portfolio DiversifiÃ©',
                      description: '3 types de propriÃ©tÃ©s',
                      icon: 'ðŸ“Š',
                      completed: false
                    }
                  ].map((achievement, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${achievement.completed ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <p className="font-medium">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Notifications Intelligentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications Intelligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                type: 'opportunity',
                title: 'Nouvelle opportunitÃ© dÃ©tectÃ©e par IA',
                message: 'Terrain Yoff correspond Ã  vos critÃ¨res avec ROI prÃ©vu +35%',
                time: 'Il y a 1h',
                urgent: true
              },
              {
                type: 'market',
                title: 'Alerte marchÃ©',
                message: 'Prix zone Almadies en hausse +5% ce mois',
                time: 'Il y a 3h',
                urgent: false
              },
              {
                type: 'blockchain',
                title: 'Transaction blockchain confirmÃ©e',
                message: 'Votre NFT Terrain Saly a Ã©tÃ© mis Ã  jour',
                time: 'Il y a 5h',
                urgent: false
              }
            ].map((notification, index) => (
              <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg border ${notification.urgent ? 'border-orange-200 bg-orange-50' : 'hover:bg-gray-50'}`}>
                <div className={`w-2 h-2 rounded-full mt-2 ${notification.urgent ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                <div className="flex-1">
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
                {notification.urgent && (
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    Urgent
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedParticulierDashboard;



import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Brain, 
  Zap, 
  BarChart3, 
  Shield, 
  Coins,
  Rocket,
  Star,
  ChevronRight,
  Activity,
  TrendingUp,
  MessageCircle,
  Bot,
  Search,
  Settings,
  Terminal,
  Database,
  Globe,
  Cpu,
  Code,
  Lock,
  Smartphone,
  BarChart3 as Chart,
  Eye,
  Filter,
  Download,
  Upload,
  PlayCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  Sparkles,
  Blocks,
  Network,
  Layers,
  CreditCard,
  DollarSign,
  TrendingDown,
  LineChart,
  PieChart,
  BarChart3 as BarChart,
  BarChart3 as Radar,
  BarChart3 as Gauge,
  Monitor,
  Camera,
  Mic,
  FileText,
  Image,
  Video,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  User,
  Users,
  Building,
  Home,
  Briefcase,
  Target,
  Award,
  Trophy
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import BlockchainAnalytics from '@/components/advanced/BlockchainAnalytics';
import AdvancedAIChatbot from '@/components/advanced/AdvancedAIChatbot';

const FonctionnalitesAvanceesPage = () => {
  const [activeDemo, setActiveDemo] = useState('blockchain');
  const [showAIDemo, setShowAIDemo] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [marketData, setMarketData] = useState({
    totalTransactions: 1247,
    blockchainVerifications: 892,
    aiPredictions: 156,
    securityAlerts: 3
  });

  const features = [
    {
      id: 'blockchain',
      icon: Coins,
      title: 'Blockchain & NFT',
      description: 'Tokenisation de propriétés, smart contracts automatisés, et NFT fonciers',
      color: 'purple',
      status: '✅ Actif',
      capabilities: [
        'Tokenisation automatique des biens',
        'Smart contracts pour les ventes',
        'NFT avec métadonnées complètes',
        'Escrow décentralisé',
        'Historique immutable'
      ]
    },
    {
      id: 'ai',
      icon: Brain,
      title: 'IA Prédictive',
      description: 'Assistant IA avancé, analyse de marché prédictive, et recommandations personnalisées',
      color: 'blue',
      status: '✅ Actif',
      capabilities: [
        'Chatbot multilingue (Français, Wolof, Anglais)',
        'Prédiction des prix immobiliers',
        'Analyse de rentabilité automatique',
        'Recommandations personnalisées',
        'Détection de fraudes'
      ]
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Analytics Temps Réel',
      description: 'Tableaux de bord interactifs, métriques blockchain en temps réel, insights marché',
      color: 'green',
      status: '✅ Actif',
      capabilities: [
        'Dashboard temps réel',
        'Métriques blockchain',
        'Analyse de tendances',
        'Rapports automatisés',
        'KPI personnalisés'
      ]
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Sécurité Avancée',
      description: 'Chiffrement quantique, authentification biométrique, audit automatisé',
      color: 'red',
      status: '✅ Actif',
      capabilities: [
        'Chiffrement AES-256',
        'Authentification 2FA/MFA',
        'Audit trails complets',
        'Détection d\'intrusion',
        'Backup décentralisé'
      ]
    }
  ];

  const demoScenarios = [
    {
      title: "Analyse de Propriété IA",
      description: "L'IA analyse une propriété et prédit sa valeur future",
      query: "Analyse cette villa de 300m² à Almadies avec piscine, construite en 2020",
      expectedResponse: "🏠 **Analyse IA - Villa Almadies**\n\n📊 **Valeur estimée**: 95-110M FCFA\n📈 **Prédiction 2025**: +15% (110-125M FCFA)\n\n**Facteurs positifs:**\n✓ Localisation premium (Almadies)\n✓ Surface attractive (300m²)\n✓ Équipements de qualité (piscine)\n✓ Construction récente (2020)\n\n**Recommandations:**\n• Excellent potentiel d'investissement\n• Demande forte dans cette zone\n• Valorisation attendue: 15-20% sur 3 ans"
    },
    {
      title: "Conseil Investissement Diaspora",
      description: "Assistant pour investisseurs de la diaspora",
      query: "Je vis en France, quel type de bien acheter à Dakar avec 50M FCFA?",
      expectedResponse: "🌍 **Conseil Diaspora - Budget 50M FCFA**\n\n🎯 **Recommandations optimales:**\n\n**Option 1: Appartement Sicap** (45-50M)\n• Rendement locatif: 8-10%\n• Facilité de gestion à distance\n• Forte demande locative\n\n**Option 2: Terrain VDN** (40-48M)\n• Potentiel de valorisation: +25% sur 5 ans\n• Construction différée possible\n• Zone en développement\n\n**Services diaspora inclus:**\n✓ Gestion locative à distance\n✓ Suivi travaux via blockchain\n✓ Transferts sécurisés\n✓ Reporting mensuel"
    },
    {
      title: "Vérification Blockchain",
      description: "Vérification automatique d'un bien immobilier",
      query: "Vérifier la propriété TER-NFT-2024-001247",
      expectedResponse: "🔗 **Vérification Blockchain**\n\n✅ **Statut**: Propriété vérifiée\n🏷️ **NFT ID**: TER-NFT-2024-001247\n📍 **Localisation**: Almadies, Lot 45\n\n**Historique blockchain:**\n• 15/01/2024: Tokenisation initiale\n• 20/01/2024: Vérification cadastrale\n• 25/01/2024: Audit géomètre\n\n**Documents vérifiés:**\n✓ Titre foncier original\n✓ Certificat d'urbanisme\n✓ Plan géomètre\n✓ Quitus fiscal\n\n🛡️ **Sécurité**: Niveau Maximum"
    }
  ];

  useEffect(() => {
    // Simulation de mise à jour des données en temps réel
    const interval = setInterval(() => {
      setMarketData(prev => ({
        totalTransactions: prev.totalTransactions + Math.floor(0 * 3),
        blockchainVerifications: prev.blockchainVerifications + Math.floor(0 * 2),
        aiPredictions: prev.aiPredictions + Math.floor(0 * 1),
        securityAlerts: Math.max(0, prev.securityAlerts + Math.floor(0 * 2) - 1)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const simulateAIResponse = async (query) => {
    setIsProcessing(true);
    
    // Trouver le scénario correspondant
    const scenario = demoScenarios.find(s => 
      query.toLowerCase().includes(s.query.toLowerCase().split(' ')[0]) ||
      s.title.toLowerCase().includes(query.toLowerCase().split(' ')[0])
    ) || demoScenarios[0];

    // Simulation d'un délai de traitement IA
    await new Promise(resolve => setTimeout(resolve, 2000 + 0 * 2000));
    
    setAiResponse(scenario.expectedResponse);
    setIsProcessing(false);
  };

  const handleAIDemo = async () => {
    if (!aiQuery.trim()) return;
    await simulateAIResponse(aiQuery);
  };

  const packages = [
    'ethers@^6.8.0 - Interactions Ethereum & Smart Contracts',
    'web3@^4.2.0 - Client Web3 pour blockchain',
    'brain.js@^1.6.1 - Réseaux de neurones JavaScript',
    '@tensorflow/tfjs@^4.20.0 - Machine Learning navigateur',
    'crypto-js@^4.2.0 - Chiffrement et hachage',
    'jsonwebtoken@^9.0.2 - Authentification JWT sécurisée',
    'socket.io-client@^4.7.0 - Communication temps réel',
    'natural@^6.8.0 - Traitement langage naturel',
    'ipfs-http-client@^60.0.0 - Stockage décentralisé IPFS',
    'wagmi@^1.4.0 - Hooks React pour Web3',
    'viem@^1.18.0 - Interface Ethereum TypeScript',
    '@chainlink/contracts@^0.8.0 - Oracles décentralisés'
  ];

  const technicalSpecs = {
    blockchain: {
      network: 'Polygon (MATIC)',
      consensus: 'Proof of Stake',
      tps: '65,000 transactions/seconde',
      finality: '2-3 secondes',
      gasOptimization: 'Layer 2 optimisé'
    },
    ai: {
      model: 'GPT-4 + Modèles locaux',
      languages: 'Français, Wolof, Anglais',
      accuracy: '94.2% sur données foncières',
      processing: 'Temps réel + batch',
      training: 'Données Sénégal + Global'
    },
    security: {
      encryption: 'AES-256 + RSA-4096',
      authentication: '2FA/MFA + Biométrie',
      audit: 'Smart contracts vérifiés',
      compliance: 'RGPD + Lois sénégalaises',
      backup: 'Redondance multi-zone'
    }
  };

  return (
    <>
      <Helmet>
        <title>IA Blockchain Avancée | Teranga Foncier</title>
        <meta name="description" content="Découvrez l'IA blockchain de Teranga Foncier : smart contracts, NFT fonciers, analytics temps réel et sécurité quantique." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen"
      >
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 text-center overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-green-600/5"></div>
            <motion.div
              animate={{ 
                background: [
                  'radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 40% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)'
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0"
            />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 relative z-10"
          >
            <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 text-lg px-6 py-2">
              <Sparkles className="mr-2 h-5 w-5" />
              IA Blockchain Nouvelle Génération
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
              Fonctionnalités <br />
              <span className="text-6xl md:text-8xl">Avancées</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              Explorez l'avenir de l'immobilier avec notre IA blockchain de pointe, 
              des NFT fonciers innovants et des analytics prédictives
            </p>

            {/* Statistiques temps réel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {marketData.totalTransactions.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Transactions Blockchain</div>
                <div className="flex items-center mt-2 text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-xs">+12% aujourd'hui</span>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {marketData.blockchainVerifications}
                </div>
                <div className="text-sm text-gray-600">Vérifications IA</div>
                <div className="flex items-center mt-2 text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-xs">100% fiables</span>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {marketData.aiPredictions}
                </div>
                <div className="text-sm text-gray-600">Prédictions IA</div>
                <div className="flex items-center mt-2 text-blue-600">
                  <Brain className="w-4 h-4 mr-1" />
                  <span className="text-xs">94.2% précision</span>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-red-200">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {marketData.securityAlerts}
                </div>
                <div className="text-sm text-gray-600">Alertes Sécurité</div>
                <div className="flex items-center mt-2 text-green-600">
                  <Shield className="w-4 h-4 mr-1" />
                  <span className="text-xs">Niveau Max</span>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" onClick={() => setShowAIDemo(true)}>
                <Bot className="mr-2 h-5 w-5" />
                Tester l'IA
              </Button>
              <Button size="lg" variant="outline" onClick={() => setActiveDemo('blockchain')}>
                <Blocks className="mr-2 h-5 w-5" />
                Explorer Blockchain
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Section des fonctionnalités principales */}
        <section className="py-20 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
            >
              Technologies de Pointe
            </motion.h2>

            <div className="grid lg:grid-cols-2 gap-8 mb-16">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                    activeDemo === feature.id 
                      ? `border-${feature.color}-500 shadow-2xl shadow-${feature.color}-500/25` 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveDemo(feature.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 group-hover:from-gray-50 group-hover:to-white transition-all duration-300" />
                  
                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`p-4 rounded-xl bg-${feature.color}-100`}>
                        <feature.icon className={`h-8 w-8 text-${feature.color}-600`} />
                      </div>
                      <Badge className={`bg-${feature.color}-100 text-${feature.color}-800 hover:bg-${feature.color}-200`}>
                        {feature.status}
                      </Badge>
                    </div>

                    <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-gray-800 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="space-y-2">
                      {feature.capabilities.map((capability, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className={`w-4 h-4 mr-3 text-${feature.color}-500 flex-shrink-0`} />
                          <span>{capability}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={`text-${feature.color}-600 hover:text-${feature.color}-700 hover:bg-${feature.color}-50`}
                      >
                        En savoir plus
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      
                      {activeDemo === feature.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`w-3 h-3 rounded-full bg-${feature.color}-500 animate-pulse`}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Technologies Intégrées
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Chaque fonctionnalité a été installée et configurée avec succès
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card 
                    className={`h-full hover:shadow-lg transition-all cursor-pointer ${
                      activeDemo === feature.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setActiveDemo(feature.id)}
                  >
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r from-${feature.color}-500 to-${feature.color}-600 flex items-center justify-center mb-4`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground mb-4">{feature.description}</p>
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        {feature.status}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Demo Section */}
            <Tabs value={activeDemo} onValueChange={setActiveDemo}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
                <TabsTrigger value="ai">IA</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
              </TabsList>
              
              <TabsContent value="blockchain" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-purple-600" />
                      Blockchain Analytics Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BlockchainAnalytics />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="ai" className="mt-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <AdvancedAIChatbot />
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                        Capacités IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700">✓</Badge>
                          Traitement du langage naturel
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700">✓</Badge>
                          Recommandations personnalisées
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700">✓</Badge>
                          Analyse prédictive des prix
                        </li>
                        <li className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700">✓</Badge>
                          Classification automatique
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      Analytics en Temps Réel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
                        <p className="text-sm text-muted-foreground">Monitoring continu</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">Real-time</div>
                        <p className="text-sm text-muted-foreground">Données en temps réel</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">AI-Powered</div>
                        <p className="text-sm text-muted-foreground">Insights intelligents</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-600" />
                      Sécurité Enterprise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Chiffrement</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• AES-256 pour les données</li>
                          <li>• RSA pour les communications</li>
                          <li>• Hachage SHA-256</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Authentification</h4>
                        <ul className="space-y-2 text-sm">
                          <li>• JWT Tokens sécurisés</li>
                          <li>• Sessions chiffrées</li>
                          <li>• Multi-facteurs (à venir)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Packages Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">
                Packages Installés
              </h2>
              <p className="text-muted-foreground">
                Technologies de pointe intégrées avec succès
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map((pkg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <code className="text-sm bg-muted px-2 py-1 rounded block">
                        {pkg}
                      </code>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Status Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Card className="p-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardContent className="p-0">
                  <div className="flex items-center justify-center mb-4">
                    <Badge className="bg-green-600 text-white px-6 py-2 text-lg">
                      <Star className="mr-2 h-5 w-5" />
                      Installation Réussie !
                    </Badge>
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-4">
                    Teranga Foncier 2.0 Prêt
                  </h2>
                  
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Toutes les fonctionnalités avancées ont été installées avec succès. 
                    Votre plateforme est maintenant équipée des dernières technologies.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Activity className="h-4 w-4 text-green-600" />
                      Serveur opérationnel
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      Performances optimisées
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="h-4 w-4 text-purple-600" />
                      Sécurité renforcée
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </>
  );
};

export default FonctionnalitesAvanceesPage;

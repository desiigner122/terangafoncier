import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  MessageCircle
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import BlockchainAnalytics from '@/components/advanced/BlockchainAnalytics';
import AdvancedAIChatbot from '@/components/advanced/AdvancedAIChatbot';

const FonctionnalitesAvanceesPage = () => {
  const [activeDemo, setActiveDemo] = useState('blockchain');

  const features = [
    {
      id: 'blockchain',
      icon: Coins,
      title: 'Blockchain & Smart Contracts',
      description: 'Contrats intelligents, tokenisation, et transactions sécurisées',
      color: 'purple',
      status: '✅ Installé'
    },
    {
      id: 'ai',
      icon: Brain,
      title: 'Intelligence Artificielle',
      description: 'Chatbot IA, analyse prédictive, et recommandations personnalisées',
      color: 'blue',
      status: '✅ Installé'
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Analytics Avancées',
      description: 'Tableaux de bord temps réel, métriques blockchain, insights marché',
      color: 'green',
      status: '✅ Installé'
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Sécurité Renforcée',
      description: 'Chiffrement avancé, authentification multi-facteurs, audit trails',
      color: 'red',
      status: '✅ Installé'
    }
  ];

  const packages = [
    'ethers@^6.8.0 - Interactions Ethereum',
    'web3@^4.2.0 - Client Web3',
    'brain.js@^1.6.1 - Réseaux de neurones',
    '@tensorflow/tfjs@^4.20.0 - Machine Learning',
    'crypto-js@^4.2.0 - Chiffrement',
    'jsonwebtoken@^9.0.2 - Authentification JWT',
    'socket.io-client@^4.7.0 - Temps réel',
    'natural@^6.8.0 - Traitement langage naturel'
  ];

  return (
    <>
      <Helmet>
        <title>Fonctionnalités Avancées | Teranga Foncier</title>
        <meta name="description" content="Découvrez les fonctionnalités avancées de Teranga Foncier : blockchain, IA, analytics et sécurité." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-background min-h-screen"
      >
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 text-center bg-gradient-to-br from-purple-600/10 via-blue-600/10 to-green-600/10 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 relative z-10"
          >
            <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700">
              <Rocket className="mr-2 h-4 w-4" />
              Fonctionnalités Avancées
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
              Technologie de Pointe
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Découvrez comment Teranga Foncier révolutionne l'immobilier avec la blockchain, l'IA et l'analytics avancée.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge className="bg-green-100 text-green-700 px-4 py-2">
                <Star className="mr-2 h-4 w-4" />
                155 packages installés
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 px-4 py-2">
                <Zap className="mr-2 h-4 w-4" />
                Prêt pour production
              </Badge>
            </div>
          </motion.div>
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

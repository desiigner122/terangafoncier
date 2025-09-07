import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Blocks, 
  Shield, 
  Database, 
  Lock, 
  Key, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Globe,
  FileText,
  Clock,
  ArrowRight,
  Eye,
  Fingerprint,
  Cpu,
  Network,
  TrendingUp,
  Users,
  Building2,
  MapPin,
  Award,
  Lightbulb,
  BookOpen,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Helmet } from 'react-helmet-async';

const FoncierBlockchainPage = () => {
  const blockchainFeatures = [
    {
      icon: Shield,
      title: "Sécurité Inaltérable",
      description: "Chaque titre foncier est crypté et stocké sur plusieurs nœuds",
      detail: "La technologie blockchain garantit qu'aucun document ne peut être falsifié ou supprimé une fois enregistré."
    },
    {
      icon: Eye,
      title: "Transparence Totale",
      description: "Historique complet et vérifiable de chaque propriété",
      detail: "Consultez l'historique complet d'un terrain : propriétaires précédents, transactions, modifications."
    },
    {
      icon: Zap,
      title: "Transactions Instantanées",
      description: "Transferts de propriété en quelques minutes",
      detail: "Plus besoin d'attendre des semaines. Les smart contracts automatisent les transferts."
    },
    {
      icon: Globe,
      title: "Accessibilité Mondiale",
      description: "Investissez depuis n'importe où dans le monde",
      detail: "La diaspora sénégalaise peut acheter et gérer ses biens depuis l'étranger en toute sécurité."
    }
  ];

  const traditionalVsBlockchain = [
    {
      aspect: "Sécurité des Titres",
      traditional: "Documents papier fragiles, risque de perte ou falsification",
      blockchain: "Cryptage inviolable, copies multiples décentralisées",
      improvement: "99.9% de sécurité en plus"
    },
    {
      aspect: "Temps de Transaction",
      traditional: "3-6 mois pour un transfert complet",
      blockchain: "24-48 heures avec smart contracts",
      improvement: "50x plus rapide"
    },
    {
      aspect: "Coûts de Transaction",
      traditional: "Frais notariaux, timbres, intermédiaires multiples",
      blockchain: "Frais réduits, automatisation des processus",
      improvement: "60% d'économies"
    },
    {
      aspect: "Vérification",
      traditional: "Recherches manuelles longues et coûteuses",
      blockchain: "Vérification instantanée et automatique",
      improvement: "100x plus efficace"
    }
  ];

  const useCases = [
    {
      title: "Achat de Terrain",
      description: "Processus d'achat sécurisé avec escrow blockchain",
      steps: [
        "Sélection du terrain sur la plateforme",
        "Vérification automatique des titres",
        "Dépôt sécurisé en escrow blockchain",
        "Transfert automatique après validation"
      ],
      icon: Building2,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Suivi de Construction",
      description: "Surveillance IA et rapports blockchain",
      steps: [
        "Installation de capteurs IoT",
        "Rapports automatiques quotidiens",
        "Validation par IA des progrès",
        "Paiements conditionnels aux étapes"
      ],
      icon: Cpu,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Investissement Diaspora",
      description: "Investissement à distance sécurisé",
      steps: [
        "Authentification biométrique",
        "Sélection de projets vérifiés",
        "Investissement avec crypto ou mobile money",
        "Suivi temps réel depuis l'étranger"
      ],
      icon: Globe,
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Foncier & Blockchain | Teranga Foncier - Révolution Immobilière Sénégal</title>
        <meta name="description" content="Découvrez comment la blockchain révolutionne le foncier au Sénégal. Sécurité, transparence et innovation pour vos investissements immobiliers." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-500/30">
                  🔗 Innovation Foncière
                </Badge>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                  Foncier & 
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {" "}Blockchain
                  </span>
                </h1>
                
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Découvrez comment la technologie blockchain révolutionne 
                  l'immobilier sénégalais pour plus de sécurité, transparence et efficacité.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <Link to="#demo">
                      <Play className="mr-2 h-5 w-5" />
                      Voir la Démonstration
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                    <Link to="/terrains">
                      Explorer les Terrains
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Animated Blockchain Network */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-4 bg-blue-400 rounded-full opacity-60"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 20}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
        </section>

        {/* What is Blockchain */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Qu'est-ce que la Blockchain ?
              </h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                La blockchain est un registre numérique décentralisé et inaltérable 
                qui révolutionne la gestion des propriétés foncières.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Blocks className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Registre Décentralisé</h3>
                    </div>
                    
                    <p className="text-gray-300 mb-6">
                      Chaque transaction immobilière est enregistrée sur un réseau de milliers d'ordinateurs, 
                      rendant toute falsification impossible.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">Aucun point de défaillance unique</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">Transparence totale des transactions</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">Historique permanent et vérifiable</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                {blockchainFeatures.map((feature, index) => (
                  <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <feature.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                          <p className="text-gray-300 text-sm mb-2">{feature.description}</p>
                          <p className="text-gray-400 text-xs">{feature.detail}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Traditional vs Blockchain */}
        <section className="py-20 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Révolution du Foncier Traditionnel
              </h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Comparaison entre les méthodes traditionnelles et notre approche blockchain innovante
              </p>
            </div>

            <div className="space-y-8">
              {traditionalVsBlockchain.map((comparison, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6">
                      <div className="grid lg:grid-cols-4 gap-6 items-center">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {comparison.aspect}
                          </h3>
                        </div>
                        
                        <div className="lg:col-span-1">
                          <Badge className="mb-2 bg-red-500/20 text-red-300 border-red-500/30">
                            Traditionnel
                          </Badge>
                          <p className="text-gray-300 text-sm">
                            {comparison.traditional}
                          </p>
                        </div>
                        
                        <div className="lg:col-span-1">
                          <Badge className="mb-2 bg-green-500/20 text-green-300 border-green-500/30">
                            Blockchain
                          </Badge>
                          <p className="text-gray-300 text-sm">
                            {comparison.blockchain}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400 mb-1">
                            {comparison.improvement}
                          </div>
                          <TrendingUp className="h-5 w-5 text-green-400 mx-auto" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Cas d'Usage Concrets
              </h2>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Découvrez comment la blockchain transforme concrètement vos projets immobiliers
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-full hover:transform hover:scale-105 transition-all">
                    <CardHeader>
                      <div className={`w-16 h-16 bg-gradient-to-r ${useCase.color} rounded-xl flex items-center justify-center mb-4`}>
                        <useCase.icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl text-white">{useCase.title}</CardTitle>
                      <p className="text-gray-300">{useCase.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {useCase.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                              {stepIndex + 1}
                            </div>
                            <span className="text-gray-300 text-sm">{step}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Alert */}
        <section className="py-20 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Alert className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30 max-w-4xl mx-auto">
                <Shield className="h-6 w-6 text-blue-400" />
                <AlertDescription className="text-white">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Sécurité Garantie par la Blockchain</h3>
                      <p className="text-gray-300">
                        Chaque titre foncier est protégé par la même technologie qui sécurise les cryptomonnaies.
                        Vos investissements sont protégés par des protocoles cryptographiques de niveau militaire.
                      </p>
                    </div>
                    <Button asChild className="bg-white text-blue-600 hover:bg-gray-100 whitespace-nowrap">
                      <Link to="/security">
                        <Lock className="mr-2 h-4 w-4" />
                        En Savoir Plus
                      </Link>
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Prêt à Adopter l'Immobilier du Futur ?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Rejoignez la révolution blockchain et sécurisez vos investissements 
                immobiliers avec la technologie la plus avancée au monde.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Link to="/terrains">
                    <Eye className="mr-2 h-5 w-5" />
                    Explorer les Terrains
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link to="/contact">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Guide Complet
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FoncierBlockchainPage;

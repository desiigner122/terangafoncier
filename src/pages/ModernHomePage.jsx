import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle, 
  Globe, 
  Smartphone, 
  TrendingUp, 
  Users, 
  Shield, 
  Star, 
  Play, 
  MapPin, 
  Home, 
  Building, 
  CreditCard, 
  Clock, 
  Eye, 
  Award, 
  Target, 
  Zap,
  Landmark,
  Phone,
  Lock,
  Coins,
  FileText,
  Database,
  Blocks,
  Brain,
  Cpu,
  Rocket,
  Sparkles,
  Layers,
  Activity,
  DollarSign,
  Camera,
  MessageSquare,
  BarChart3,
  Calendar,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';
import ModernHeroSliderFixed from '@/components/home/ModernHeroSliderFixed';
import MarketTickerBar from '@/components/home/MarketTickerBar';

const ModernHomePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Blockchain Features principales
  const blockchainFeatures = [
    {
      icon: Blocks,
      title: "Titres Blockchain NFT",
      description: "Chaque propriété est tokenisée en NFT sur la blockchain Ethereum pour une sécurité absolue et une propriété prouvée.",
      stats: ["2,847 Titres", "100% Sécurisés", "0 Fraude"],
      color: "from-blue-600 to-purple-600",
      delay: 0.1
    },
    {
      icon: Lock,
      title: "Smart Contracts Automatisés",
      description: "Contrats intelligents pour automatiser les paiements échelonnés, l'escrow et les transferts de propriété.",
      stats: ["892 Contrats", "2.4B CFA", "99.8% Fiabilité"],
      color: "from-emerald-600 to-teal-600",
      delay: 0.2
    },
    {
      icon: Brain,
      title: "IA de Surveillance", 
      description: "Intelligence artificielle pour le suivi de construction par satellite et analyse automatique des progrès.",
      stats: ["456 Projets", "97.8% Précision", "24/7 Monitoring"],
      color: "from-purple-600 to-pink-600",
      delay: 0.3
    },
    {
      icon: Globe,
      title: "Accès Mondial Diaspora",
      description: "Plateforme accessible depuis 50+ pays pour les Sénégalais de la diaspora avec support multidevise.",
      stats: ["50+ Pays", "8.2K Utilisateurs", "15 Devises"],
      color: "from-orange-600 to-red-600",
      delay: 0.4
    }
  ];

  // Solutions par secteur
  const sectorSolutions = [
    {
      title: "Particuliers & Diaspora",
      description: "Achat de terrain à distance, construction surveillée, paiements sécurisés",
      icon: Users,
      features: ["Visite virtuelle 360°", "Suivi construction IA", "Paiements échelonnés", "Support 24/7"],
      color: "bg-gradient-to-br from-blue-500 to-cyan-500"
    },
    {
      title: "Mairies & Collectivités",
      description: "Gestion numérique des terrains communaux, demandes en ligne, traçabilité",
      icon: Landmark,
      features: ["Cadastre numérique", "Demandes automatisées", "Suivi transparent", "Revenus optimisés"],
      color: "bg-gradient-to-br from-emerald-500 to-teal-500"
    },
    {
      title: "Banques & Institutions",
      description: "Outils d'évaluation, gestion des prêts, analyse de risque blockchain",
      icon: Building,
      features: ["Évaluation automatique", "Scoring blockchain", "Portfolio management", "API integration"],
      color: "bg-gradient-to-br from-purple-500 to-pink-500"
    },
    {
      title: "Promoteurs & Investisseurs", 
      description: "Dashboard analytics, opportunités d'investissement, outils de développement",
      icon: TrendingUp,
      features: ["Market intelligence", "ROI calculator", "Projet management", "Investment tracking"],
      color: "bg-gradient-to-br from-orange-500 to-red-500"
    }
  ];

  // Statistiques en temps réel
  const liveStats = [
    { label: "Transactions Blockchain", value: "2,847", prefix: "", icon: Database, trend: "+12%" },
    { label: "Fonds Sécurisés", value: "2.4", prefix: "B CFA", icon: Lock, trend: "+8.5%" },
    { label: "Projets Surveillés", value: "456", prefix: "", icon: Camera, trend: "+15%" },
    { label: "Utilisateurs Actifs", value: "8.2", prefix: "K", icon: Users, trend: "+22%" },
    { label: "Smart Contracts", value: "892", prefix: "", icon: Coins, trend: "+18%" },
    { label: "Précision IA", value: "97.8", prefix: "%", icon: Brain, trend: "+0.3%" }
  ];

  return (
    <>
      <Helmet>
        <title>Teranga Foncier - Plateforme Blockchain Immobilière Sénégal</title>
        <meta name="description" content="La première plateforme blockchain pour l'immobilier au Sénégal. Achetez, vendez et gérez vos propriétés avec la sécurité de la blockchain et l'IA." />
        <meta name="keywords" content="blockchain, immobilier, Sénégal, NFT, smart contracts, diaspora, terrains, construction" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section avec Slider Moderne */}
        <ModernHeroSliderFixed />

        {/* Market Ticker Bar */}
        <MarketTickerBar />

        {/* Stats en Temps Réel */}
        <section id="live-stats" className="py-16 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible['live-stats'] ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Données en Temps Réel
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Suivez l'évolution de notre écosystème blockchain immobilier
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {liveStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isVisible['live-stats'] ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
                    <CardContent className="p-6">
                      <stat.icon className="h-8 w-8 mx-auto mb-3 text-blue-400" />
                      <div className="text-2xl font-bold text-white mb-1">
                        {stat.value}<span className="text-lg">{stat.prefix}</span>
                      </div>
                      <div className="text-xs text-white/70 mb-2">{stat.label}</div>
                      <Badge className={`text-xs ${stat.trend.includes('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} border-0`}>
                        {stat.trend}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Fonctionnalités Blockchain Principales */}
        <section id="blockchain-features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible['blockchain-features'] ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-blue-100 text-blue-800 border-0">
                🚀 Innovation Blockchain
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                L'Immobilier Révolutionné
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez comment la blockchain, l'IA et les smart contracts transforment 
                l'investissement immobilier au Sénégal
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {blockchainFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isVisible['blockchain-features'] ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: feature.delay }}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6`}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        {feature.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {feature.description}
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {feature.stats.map((stat, idx) => (
                          <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg font-bold text-gray-900">{stat}</div>
                          </div>
                        ))}
                      </div>

                      <Button 
                        className={`w-full bg-gradient-to-r ${feature.color} text-white hover:shadow-lg transition-all duration-300`}
                      >
                        En Savoir Plus
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions par Secteur */}
        <section id="sector-solutions" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible['sector-solutions'] ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Solutions sur Mesure
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des outils spécialisés pour chaque acteur de l'écosystème immobilier sénégalais
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {sectorSolutions.map((solution, index) => (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible['sector-solutions'] ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                    <div className={`h-2 ${solution.color}`} />
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-2xl ${solution.color} flex items-center justify-center mb-6`}>
                        <solution.icon className="h-8 w-8 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {solution.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6">
                        {solution.description}
                      </p>

                      <div className="space-y-3 mb-8">
                        {solution.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                        Découvrir la Solution
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Appel à l'Action Principal */}
        <section id="main-cta" className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible['main-cta'] ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-6 py-2">
                ✨ Rejoignez la Révolution
              </Badge>
              
              <h2 className="text-4xl lg:text-6xl font-bold mb-6">
                Prêt à Investir dans
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  l'Avenir de l'Immobilier ?
                </span>
              </h2>
              
              <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
                Rejoignez plus de 8,200 Sénégalais qui font confiance à notre plateforme blockchain 
                pour leurs investissements immobiliers
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold border-0"
                >
                  <Link to="/register">
                    Créer mon Compte Gratuit
                    <Rocket className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button 
                  asChild
                  variant="outline" 
                  size="lg"
                  className="border-white/30 text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm px-8 py-4 text-lg font-semibold"
                >
                  <Link to="/blockchain">
                    <Play className="mr-2 h-5 w-5" />
                    Voir la Démo Blockchain
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

export default ModernHomePage;

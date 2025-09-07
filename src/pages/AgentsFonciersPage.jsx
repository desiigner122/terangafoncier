import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Home, 
  Key, 
  TrendingUp, 
  Users, 
  DollarSign, 
  CheckCircle, 
  ArrowRight, 
  Award, 
  Zap, 
  Globe, 
  Smartphone, 
  Star, 
  Phone, 
  Mail, 
  Calculator, 
  Target, 
  Clock, 
  BarChart3, 
  Activity, 
  Shield, 
  Eye, 
  FileText, 
  MapPin, 
  Camera, 
  Video, 
  Headphones, 
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';

const AgentsFonciersPage = () => {
  const [activeService, setActiveService] = useState(0);

  const businessMetrics = [
    {
      title: "Commissions Moyennes",
      value: "+278%",
      description: "Augmentation des commissions grâce au volume de transactions",
      icon: DollarSign,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Ventes Mensuelles",
      value: "+189%",
      description: "Croissance du nombre de ventes réalisées par mois",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Clients Premium",
      value: "1.8K+",
      description: "Nouveaux clients haut de gamme via notre plateforme",
      icon: Users,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Cycle de Vente",
      value: "-45%",
      description: "Réduction du temps de vente grâce aux outils digitaux",
      icon: Clock,
      color: "from-orange-500 to-red-500"
    }
  ];

  const services = [
    {
      icon: Eye,
      title: "Lead Management IA",
      description: "Système intelligent de gestion et qualification des prospects",
      features: ["Scoring automatique", "Nurturing personnalisé", "Relances programmées", "Analytics conversion"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Camera,
      title: "Visites virtuelles 360°",
      description: "Tours virtuels immersifs pour présentation à distance",
      features: ["Caméras 360° fournies", "Plateforme hébergement", "Partage multi-canaux", "Analytics visiteurs"],
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Shield,
      title: "Sécurisation transactions",
      description: "Processus sécurisé de A à Z avec garanties légales",
      features: ["Vérification titres", "Assurance transaction", "Suivi notarial", "Garantie paiement"],
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: BarChart3,
      title: "CRM immobilier avancé",
      description: "Plateforme complète de gestion de votre activité",
      features: ["Pipeline ventes", "Reporting temps réel", "Agenda intelligent", "Mobile app"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const advantages = [
    {
      icon: Target,
      title: "Inventory premium exclusif",
      description: "Accès prioritaire à +15,000 biens immobiliers de qualité supérieure",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Globe,
      title: "Clientèle diaspora qualifiée",
      description: "Base de 25,000+ acheteurs diaspora pré-qualifiés avec pouvoir d'achat élevé",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Zap,
      title: "Outils digitaux fournis",
      description: "Suite complète : CRM, visites 360°, marketing automation, app mobile",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Award,
      title: "Formation continue",
      description: "Programme de formation aux techniques de vente moderne et digital",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Users,
      title: "Commissions attractives",
      description: "Structure de commissionnement progressive jusqu'à 4% sur les ventes",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Activity,
      title: "Support marketing",
      description: "Campagnes publicitaires, contenus visuels et stratégies digitales inclus",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const digitalTools = [
    {
      title: "CRM Immobilier Pro",
      description: "Gestion complète de vos prospects, clients et transactions avec IA intégrée",
      icon: BarChart3
    },
    {
      title: "App Mobile Agent",
      description: "Application dédiée pour gérer votre activité en mobilité complète",
      icon: Smartphone
    },
    {
      title: "Plateforme Visites 360°",
      description: "Création et diffusion de visites virtuelles immersives haute qualité",
      icon: Camera
    },
    {
      title: "Marketing Automation",
      description: "Campagnes automatisées par email, SMS et réseaux sociaux",
      icon: Activity
    }
  ];

  const successStories = [
    {
      agent: "Fatima Ndiaye",
      specialite: "Almadies & Ngor",
      results: "+340% commissions en 12 mois",
      details: "Focus clientèle diaspora Europe",
      growth: "+340%",
      volume: "€2.8M vendus/mois"
    },
    {
      agent: "Moussa Diallo", 
      specialite: "Diamniadio & Lac Rose",
      results: "€950K commissions/an",
      details: "Spécialiste terrains + construction",
      growth: "+256%",
      volume: "€4.1M vendus/mois"
    },
    {
      agent: "Aïssatou Ba",
      specialite: "Dakar Plateau",
      results: "1,200 clients diaspora acquis",
      details: "Expert immobilier commercial",
      growth: "+189%",
      volume: "€1.9M vendus/mois"
    }
  ];

  const packages = [
    {
      name: "Agent Solo",
      price: "0 FCFA/mois",
      commission: "2.5% commission",
      description: "Pour agents indépendants",
      features: [
        "Accès inventory complet",
        "CRM de base inclus",
        "Formation 2 jours",
        "Support 5j/7",
        "App mobile agent",
        "Leads partagés"
      ],
      color: "from-blue-500 to-cyan-500",
      popular: false
    },
    {
      name: "Agent Pro",
      price: "89.000 FCFA/mois",
      commission: "3.5% commission",
      description: "Pour agents expérimentés",
      features: [
        "Tout Solo inclus",
        "Leads exclusifs zone",
        "Visites 360° illimitées",
        "Marketing automation",
        "Support prioritaire 24/7",
        "Formation avancée mensuelle",
        "Matériel photo/vidéo fourni"
      ],
      color: "from-purple-500 to-indigo-500",
      popular: true
    },
    {
      name: "Agent Elite",
      price: "149.000 FCFA/mois", 
      commission: "4% commission",
      description: "Pour top performers",
      features: [
        "Tout Pro inclus",
        "Territoire exclusif",
        "Assistant virtuel IA",
        "Campagnes publicitaires",
        "Account manager dédié",
        "Formations sur mesure",
        "Garantie revenus minimum"
      ],
      color: "from-emerald-500 to-teal-500",
      popular: false
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Candidature express",
      description: "Dossier en ligne en 10 minutes avec vérification automatique",
      icon: FileText
    },
    {
      step: "2",
      title: "Formation accélérée",
      description: "Formation de 2 jours sur nos outils et méthodes de vente",
      icon: Award
    },
    {
      step: "3",
      title: "Premiers leads",
      description: "Attribution de vos premiers prospects qualifiés dans les 48h",
      icon: Target
    },
    {
      step: "4",
      title: "Performance tracking",
      description: "Suivi quotidien de vos performances et optimisation continue",
      icon: TrendingUp
    }
  ];

  const territories = [
    { name: "Almadies", agents: 3, potential: "€850K/mois", status: "Ouvert" },
    { name: "Ngor", agents: 2, potential: "€650K/mois", status: "Limité" },
    { name: "Diamniadio", agents: 5, potential: "€1.2M/mois", status: "Ouvert" },
    { name: "Lac Rose", agents: 1, potential: "€400K/mois", status: "Prioritaire" },
    { name: "Saly", agents: 4, potential: "€980K/mois", status: "Ouvert" },
    { name: "Mbour", agents: 2, potential: "€520K/mois", status: "Ouvert" }
  ];

  return (
    <>
      <Helmet>
        <title>Agents Fonciers Partenaires - Teranga Foncier | +278% commissions garanties</title>
        <meta name="description" content="Rejoignez +120 agents partenaires : 15K biens exclusifs, 25K clients diaspora, CRM fourni, 4% commission. Boostez vos revenus de +278%." />
        <meta property="og:title" content="Agents Fonciers - Multipliez vos commissions par 3.5" />
        <meta property="og:description" content="Inventory premium, clients diaspora qualifiés, outils digitaux fournis. Formation et support inclus." />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section Agents Fonciers */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-20">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.08'%3E%3Cpath d='M0 40L40 0h40v40L40 80H0V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Hero Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm font-medium">
                    🏘️ Réseau Agents Fonciers Premium
                  </Badge>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                    +278% de{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      commissions
                    </span>
                    <br />
                    avec la diaspora
                  </h1>
                  
                  <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                    Rejoignez +120 agents qui ont transformé leur activité : 
                    15K biens exclusifs, 25K clients diaspora et outils digitaux fournis.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                  >
                    <Link to="/contact">
                      Rejoindre le Réseau
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
                  >
                    Guide Agent Pro
                    <FileText className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-6 pt-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Formation incluse</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Leads exclusifs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Jusqu'à 4% commission</span>
                  </div>
                </div>
              </motion.div>

              {/* Hero Visual - Agent Dashboard */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                  {/* Agent Dashboard Mockup */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">Agent Dashboard</h3>
                      <Badge className="bg-green-500 text-white">Fatima N.</Badge>
                    </div>
                    
                    {/* Performance Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">€2.8M</div>
                            <div className="text-sm text-blue-100">Vendus/mois</div>
                          </div>
                          <DollarSign className="w-8 h-8 text-blue-200" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">24</div>
                            <div className="text-sm text-emerald-100">Ventes ce mois</div>
                          </div>
                          <Home className="w-8 h-8 text-emerald-200" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Pipeline */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Pipeline actuel</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                          <span className="text-sm font-medium">Villa Almadies</span>
                          <Badge className="bg-green-500 text-white text-xs">Closing</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                          <span className="text-sm font-medium">Terrain Diamniadio</span>
                          <Badge className="bg-orange-500 text-white text-xs">Négociation</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="text-sm font-medium">Duplex Ngor</span>
                          <Badge className="bg-blue-500 text-white text-xs">Visite</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl shadow-lg"
                >
                  <Home className="w-6 h-6" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3 rounded-xl shadow-lg"
                >
                  <Key className="w-6 h-6" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Business Metrics */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Performance de nos agents partenaires
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Résultats moyens constatés après 8 mois dans notre réseau
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {businessMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${metric.color} flex items-center justify-center mx-auto mb-4`}>
                        <metric.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {metric.value}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {metric.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {metric.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Interactive */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Plateforme Agent Immobilier 360°
              </h2>
              <p className="text-xl text-gray-600">
                Tous les outils pour maximiser vos ventes et commissions
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Services List */}
              <div className="space-y-4">
                {services.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`cursor-pointer transition-all duration-300 ${
                      activeService === index ? 'scale-105' : ''
                    }`}
                    onClick={() => setActiveService(index)}
                  >
                    <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${
                      activeService === index ? 'ring-2 ring-blue-500 shadow-2xl' : ''
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center flex-shrink-0`}>
                            <service.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {service.title}
                            </h3>
                            <p className="text-gray-600 mb-3">
                              {service.description}
                            </p>
                            {activeService === index && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                                className="space-y-2"
                              >
                                {service.features.map((feature, fIndex) => (
                                  <div key={fIndex} className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-sm text-gray-700">{feature}</span>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Feature Visual */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:sticky lg:top-8"
              >
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                  <div className="text-center">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${services[activeService].color} flex items-center justify-center mx-auto mb-6`}>
                      {React.createElement(services[activeService].icon, { className: "w-10 h-10 text-white" })}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {services[activeService].title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {services[activeService].description}
                    </p>
                    <Button 
                      asChild
                      className={`bg-gradient-to-r ${services[activeService].color} text-white hover:opacity-90`}
                    >
                      <Link to="/contact">
                        Accéder aux outils
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Territories Available */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Territoires Disponibles
              </h2>
              <p className="text-xl text-gray-600">
                Zones exclusives avec potentiel de revenus garantis
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {territories.map((territory, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{territory.name}</h3>
                        <Badge 
                          className={`${
                            territory.status === 'Ouvert' ? 'bg-green-500' :
                            territory.status === 'Prioritaire' ? 'bg-blue-500' :
                            'bg-orange-500'
                          } text-white`}
                        >
                          {territory.status}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Agents actifs:</span>
                          <span className="font-semibold">{territory.agents}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Potentiel:</span>
                          <span className="font-semibold text-green-600">{territory.potential}</span>
                        </div>
                        <Button 
                          asChild
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        >
                          <Link to="/contact">
                            Candidater pour cette zone
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Succès de nos agents stars
              </h2>
              <p className="text-xl text-gray-600">
                Des carrières transformées grâce à notre écosystème
              </p>
            </motion.div>

            <div className="space-y-8">
              {successStories.map((story, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-6 gap-6 items-center">
                        <div className="md:col-span-2">
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <Home className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{story.agent}</h3>
                              <p className="text-sm text-gray-600">{story.specialite}</p>
                            </div>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {story.results}
                          </h4>
                          <p className="text-gray-600">{story.details}</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {story.growth}
                          </div>
                          <div className="text-sm text-gray-500">Croissance</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {story.volume}
                          </div>
                          <div className="text-sm text-gray-500">Volume</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Rejoindre en 4 étapes simples
              </h2>
              <p className="text-xl text-gray-600">
                De la candidature aux premières ventes en moins d'une semaine
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto text-white">
                      <step.icon className="w-8 h-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-800">
                      {step.step}
                    </div>
                    {index < processSteps.length - 1 && (
                      <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300"></div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Packages Agent Immobilier
              </h2>
              <p className="text-xl text-gray-600">
                Formules adaptées à votre niveau d'expérience et ambitions
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`relative ${pkg.popular ? 'scale-105' : ''}`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1">
                        ⭐ Plus populaire
                      </Badge>
                    </div>
                  )}
                  
                  <Card className={`h-full border-0 shadow-lg ${
                    pkg.popular ? 'ring-2 ring-purple-500 shadow-xl' : ''
                  }`}>
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center mx-auto mb-4`}>
                        <Home className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {pkg.name}
                      </CardTitle>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-gray-900">
                          {pkg.price}
                        </div>
                        <div className="text-lg font-semibold text-green-600">
                          {pkg.commission}
                        </div>
                      </div>
                      <p className="text-gray-600">{pkg.description}</p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <ul className="space-y-3 mb-8">
                        {pkg.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        asChild
                        className={`w-full ${
                          pkg.popular 
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' 
                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                        } text-white`}
                      >
                        <Link to="/contact">
                          Candidater maintenant
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Prêt à transformer votre carrière ?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                +120 agents nous font confiance. Candidature express en 10 minutes 
                et formation gratuite pour démarrer immédiatement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg"
                >
                  <Link to="/contact">
                    Candidater Maintenant
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
                >
                  <Link to="/contact">
                    Guide Carrière Agent
                    <FileText className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
              
              {/* Contact Info */}
              <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>agents@terangafoncier.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>+221 77 593 42 41</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AgentsFonciersPage;

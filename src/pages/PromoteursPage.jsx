import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  Globe, 
  CheckCircle, 
  ArrowRight, 
  Award, 
  Zap, 
  Shield, 
  Target, 
  Star, 
  Phone, 
  Mail, 
  Calculator, 
  Eye, 
  FileText, 
  BarChart3, 
  Activity, 
  Home, 
  MapPin, 
  Camera, 
  CreditCard, 
  AlertTriangle, 
  Smartphone, 
  Video, 
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';

const PromoteursPage = () => {
  const [activeService, setActiveService] = useState(0);

  const businessMetrics = [
    {
      title: "Pré-ventes",
      value: "+245%",
      description: "Augmentation des ventes sur plans grâce à la diaspora",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Délai Commercial",
      value: "-58%",
      description: "Réduction du temps de commercialisation des programmes",
      icon: Clock,
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Acheteurs Diaspora",
      value: "15K+",
      description: "Investisseurs diaspora actifs dans notre réseau",
      icon: Globe,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "ROI Campagnes",
      value: "+189%",
      description: "Retour sur investissement marketing digital",
      icon: DollarSign,
      color: "from-orange-500 to-red-500"
    }
  ];

  const services = [
    {
      icon: Target,
      title: "Commercialisation diaspora",
      description: "Stratégie de vente ciblée vers 15K+ investisseurs diaspora qualifiés",
      features: ["Base diaspora exclusive", "Segmentation géographique", "Marketing personnalisé", "Suivi conversion"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Camera,
      title: "Marketing immobilier 360°",
      description: "Campagnes visuelles haut de gamme pour valoriser vos programmes",
      features: ["Photos architecturales 4K", "Vidéos drones cinéma", "Visites virtuelles 3D", "Brochures premium"],
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: CreditCard,
      title: "Solutions financement",
      description: "Partenariats bancaires pour faciliter l'achat de vos clients",
      features: ["12 banques partenaires", "Pré-accords de crédit", "Financement diaspora", "Garanties projets"],
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: BarChart3,
      title: "Analytics & reporting",
      description: "Tableaux de bord temps réel sur performance commerciale",
      features: ["Dashboard temps réel", "Conversion tracking", "ROI détaillé", "Optimisation continue"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const advantages = [
    {
      icon: Globe,
      title: "Marché diaspora captif",
      description: "Accès exclusif à 15,000+ investisseurs diaspora avec projet concret",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Commercialisation accélérée",
      description: "Réduction de 58% du délai de commercialisation grâce à notre réseau",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Shield,
      title: "Garantie de vente",
      description: "Engagement sur objectifs commerciaux avec garantie de résultats",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Award,
      title: "Expertise sectorielle",
      description: "15 ans d'expérience en promotion immobilière et marketing diaspora",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Activity,
      title: "Outils digitaux avancés",
      description: "Plateforme complète : CRM, automation, analytics et IA prédictive",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Users,
      title: "Partenariat win-win",
      description: "Rémunération au succès alignée sur vos objectifs commerciaux",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const projectTypes = [
    {
      type: "Résidences haut standing",
      diaspora: "78%",
      delai: "4-6 mois",
      commission: "3-5%",
      demand: "Très forte"
    },
    {
      type: "Programmes familiaux",
      diaspora: "65%",
      delai: "6-8 mois", 
      commission: "2.5-4%",
      demand: "Forte"
    },
    {
      type: "Investissement locatif",
      diaspora: "85%",
      delai: "3-5 mois",
      commission: "4-6%",
      demand: "Excellente"
    },
    {
      type: "Complexes commerciaux",
      diaspora: "45%",
      delai: "8-12 mois",
      commission: "5-7%",
      demand: "Sélective"
    },
    {
      type: "Lotissements premium",
      diaspora: "72%",
      delai: "2-4 mois",
      commission: "2-3%",
      demand: "Très forte"
    },
    {
      type: "Projets mixtes",
      diaspora: "60%",
      delai: "6-10 mois",
      commission: "3.5-5.5%",
      demand: "Modérée"
    }
  ];

  const successStories = [
    {
      promoteur: "Groupe Sahel Immobilier",
      projet: "Résidence Les Jardins d'Almadies",
      resultat: "100% vendu en 4 mois vs 18 mois prévu",
      details: "142 logements, 89% acheteurs diaspora",
      performance: "+340%",
      chiffre: "€28M CA"
    },
    {
      promoteur: "SOPIC Développement",
      projet: "Complexe Lac Rose Village",
      resultat: "85% pré-commercialisé avant livraison",
      details: "Villas + commerces, ciblage diaspora US",
      performance: "+267%",
      chiffre: "€45M CA"
    },
    {
      promoteur: "Teranga Construction",
      projet: "Tours Plateau Business",
      resultat: "ROI marketing +450% vs traditionnel",
      details: "Bureaux + commerces, diaspora européenne",
      performance: "+189%",
      chiffre: "€67M CA"
    }
  ];

  const packages = [
    {
      name: "Starter",
      price: "2% commission",
      description: "Pour premiers programmes",
      features: [
        "Base diaspora accès",
        "Marketing digital de base",
        "Photos HD incluses",
        "Reporting mensuel",
        "Support 5j/7",
        "1 campagne par trimestre"
      ],
      color: "from-blue-500 to-cyan-500",
      popular: false
    },
    {
      name: "Premium",
      price: "3.5% commission",
      description: "Pour promoteurs établis",
      features: [
        "Tout Starter inclus",
        "Ciblage diaspora avancé",
        "Vidéos drone 4K",
        "Visites virtuelles 3D",
        "Partenariats bancaires",
        "Support 24/7",
        "Account manager dédié",
        "Garantie objectifs"
      ],
      color: "from-purple-500 to-indigo-500",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Sur mesure",
      description: "Pour grands groupes",
      features: [
        "Tout Premium inclus",
        "Stratégie sur mesure",
        "Équipe dédiée",
        "Campagnes internationales",
        "Analytics avancées",
        "Formations équipes",
        "SLA garantis",
        "Exclusivités territoriales"
      ],
      color: "from-emerald-500 to-teal-500",
      popular: false
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Audit de projet",
      description: "Analyse complète de votre programme et définition de la stratégie optimale",
      icon: FileText
    },
    {
      step: "2",
      title: "Création des supports",
      description: "Production des visuels, vidéos et supports marketing haut de gamme",
      icon: Camera
    },
    {
      step: "3",
      title: "Lancement commercial",
      description: "Déploiement des campagnes ciblées vers notre réseau diaspora",
      icon: Target
    },
    {
      step: "4",
      title: "Suivi & optimisation",
      description: "Monitoring continu et ajustements pour maximiser les ventes",
      icon: BarChart3
    }
  ];

  const territories = [
    { 
      zone: "Almadies", 
      projets: 8, 
      taux: "89%", 
      delai: "4.2 mois",
      description: "Zone premium, forte demande villas"
    },
    { 
      zone: "Diamniadio", 
      projets: 12, 
      taux: "76%", 
      delai: "5.8 mois",
      description: "Nouvelle ville, programmes familiaux"
    },
    { 
      zone: "Lac Rose", 
      projets: 5, 
      taux: "92%", 
      delai: "3.1 mois",
      description: "Résidences secondaires diaspora"
    },
    { 
      zone: "Saly", 
      projets: 9, 
      taux: "85%", 
      delai: "4.7 mois",
      description: "Investissement locatif touristique"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Promoteurs Immobiliers - Teranga Foncier | +245% de pré-ventes diaspora</title>
        <meta name="description" content="Accélérez vos ventes : 15K+ investisseurs diaspora, -58% délai commercial, marketing premium inclus. Garantie objectifs commerciaux." />
        <meta property="og:title" content="Promoteurs - Multipliez vos pré-ventes par 3.5" />
        <meta property="og:description" content="Réseau diaspora exclusif, commercialisation accélérée, partenariats bancaires. ROI +189% garanti." />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section Promoteurs */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-20">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.08'%3E%3Cpath d='M0 0h80v80H0V0zm20 20h40v40H20V20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
                    🏗️ Partenariat Promoteurs Premium
                  </Badge>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                    +245% de{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      pré-ventes
                    </span>
                    <br />
                    avec la diaspora
                  </h1>
                  
                  <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                    Accélérez vos ventes grâce à notre réseau de 15,000+ investisseurs 
                    diaspora qualifiés. Délai commercial réduit de 58%.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                  >
                    <Link to="/contact">
                      Audit Gratuit Projet
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
                    asChild
                  >
                    <Link to="/success-stories">
                      Success Stories
                      <Eye className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-6 pt-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">15K+ diaspora</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Garantie objectifs</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">ROI +189%</span>
                  </div>
                </div>
              </motion.div>

              {/* Hero Visual - Developer Dashboard */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                  {/* Developer Dashboard Mockup */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">Project Dashboard</h3>
                      <Badge className="bg-green-500 text-white">En commercialisation</Badge>
                    </div>
                    
                    {/* Project Card */}
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Résidence Almadies</h4>
                        <Badge className="bg-green-500 text-white text-xs">89% vendu</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>CA réalisé: <span className="font-bold text-green-600">€28M</span></div>
                        <div>Objectif: <span className="font-bold text-blue-600">€32M</span></div>
                        <div>Délai: <span className="font-bold">4 mois</span></div>
                        <div>Diaspora: <span className="font-bold">89%</span></div>
                      </div>
                    </div>
                    
                    {/* Performance Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">+245%</div>
                            <div className="text-sm text-blue-100">Pré-ventes</div>
                          </div>
                          <TrendingUp className="w-8 h-8 text-blue-200" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">-58%</div>
                            <div className="text-sm text-emerald-100">Délai commercial</div>
                          </div>
                          <Clock className="w-8 h-8 text-emerald-200" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Recent Sales */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Ventes récentes</h4>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded text-sm">
                          <span>🏠 Villa T4 - Paris</span>
                          <span className="font-bold text-green-600">€580K</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm">
                          <span>🏠 Duplex - London</span>
                          <span className="font-bold text-blue-600">€420K</span>
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
                  <Building2 className="w-6 h-6" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3 rounded-xl shadow-lg"
                >
                  <Globe className="w-6 h-6" />
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
                Performance de nos promoteurs partenaires
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Résultats moyens constatés après 12 mois de partenariat
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
                Suite Complète Promotion Immobilière
              </h2>
              <p className="text-xl text-gray-600">
                Tous les outils pour optimiser la commercialisation de vos programmes
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
                        Audit gratuit projet
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Solutions de Financement et Paiement Échelonné */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 text-sm font-medium mb-4">
                💳 Solutions de Financement
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Paiement Échelonné & Financement Bancaire
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Facilitez l'acquisition pour vos clients avec nos solutions de financement flexibles et nos partenariats bancaires exclusifs
              </p>
            </motion.div>

            {/* Options de Paiement */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              {/* Paiement Échelonné */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                  <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Calculator className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Paiement Échelonné</CardTitle>
                        <p className="text-emerald-100">Flexibilité maximale pour vos clients</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-emerald-50 rounded-lg">
                          <div className="text-2xl font-bold text-emerald-600">10%</div>
                          <div className="text-sm text-gray-600">Apport initial</div>
                        </div>
                        <div className="text-center p-4 bg-emerald-50 rounded-lg">
                          <div className="text-2xl font-bold text-emerald-600">36 mois</div>
                          <div className="text-sm text-gray-600">Durée max</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Options disponibles :</h4>
                        <ul className="space-y-3">
                          {[
                            "Paiement en 3, 6, 12, 24 ou 36 mensualités",
                            "Taux préférentiel 0% sur 12 mois",
                            "Possibilité de remboursement anticipé",
                            "Assurance crédit incluse",
                            "Gestion automatisée des échéances"
                          ].map((feature, index) => (
                            <li key={index} className="flex items-center space-x-3">
                              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="w-5 h-5 text-emerald-600" />
                          <span className="font-semibold text-emerald-800">Avantage Promoteur</span>
                        </div>
                        <p className="text-emerald-700 text-sm">
                          +47% de conversion grâce à la facilité de paiement. Règlement immédiat pour le promoteur.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Financement Bancaire */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Financement Bancaire</CardTitle>
                        <p className="text-blue-100">Partenariats bancaires exclusifs</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">12</div>
                          <div className="text-sm text-gray-600">Banques partenaires</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">72h</div>
                          <div className="text-sm text-gray-600">Pré-accord</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Banques partenaires :</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            "CBAO Groupe Attijariwafa Bank",
                            "Société Générale Sénégal",
                            "Ecobank Sénégal",
                            "BICIS (BNP Paribas)",
                            "BOA Sénégal",
                            "UBA Sénégal"
                          ].map((bank, index) => (
                            <div key={index} className="flex items-center space-x-2 p-2 bg-blue-50 rounded">
                              <Shield className="w-4 h-4 text-blue-500" />
                              <span className="text-sm text-gray-700">{bank}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Services inclus :</h4>
                        <ul className="space-y-2">
                          {[
                            "Pré-qualification de crédit en 72h",
                            "Taux préférentiels négociés",
                            "Financement jusqu'à 85% du projet",
                            "Accompagnement dossier complet",
                            "Assurance crédit groupe"
                          ].map((service, index) => (
                            <li key={index} className="flex items-center space-x-3">
                              <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Simulateur de Financement */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-12"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Simulateur de Financement</h3>
                <p className="text-gray-600">Calculez les mensualités pour vos clients</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Prix du bien</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="25,000,000" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="absolute right-3 top-3 text-gray-500">FCFA</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Apport initial</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="2,500,000" 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="absolute right-3 top-3 text-gray-500">FCFA</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Durée</label>
                  <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>15 ans</option>
                    <option>20 ans</option>
                    <option>25 ans</option>
                    <option>30 ans</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 text-lg font-semibold">
                  <Calculator className="mr-2 w-5 h-5" />
                  Calculer les mensualités
                </Button>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">1,125,000</div>
                    <div className="text-sm text-gray-600">Mensualité estimée</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600">6.5%</div>
                    <div className="text-sm text-gray-600">Taux préférentiel</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">85%</div>
                    <div className="text-sm text-gray-600">Financement max</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Prêt à faciliter l'acquisition pour vos clients ?</h3>
                <p className="text-lg mb-6 opacity-90">
                  Intégrez nos solutions de financement dès aujourd'hui
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                    <Link to="/contact">
                      <Phone className="mr-2 w-5 h-5" />
                      Parler à un expert
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                    <Link to="/demo">
                      <Smartphone className="mr-2 w-5 h-5" />
                      Demander une démo
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Project Types */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Types de Programmes Optimaux
              </h2>
              <p className="text-xl text-gray-600">
                Performance par typologie de projet immobilier
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectTypes.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{project.type}</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Part diaspora:</span>
                            <span className="font-semibold text-blue-600">{project.diaspora}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Délai moyen:</span>
                            <span className="font-semibold text-emerald-600">{project.delai}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Commission:</span>
                            <span className="font-semibold text-purple-600">{project.commission}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Demande:</span>
                            <Badge 
                              className={`${
                                project.demand === 'Très forte' || project.demand === 'Excellente' ? 'bg-green-500' :
                                project.demand === 'Forte' ? 'bg-blue-500' :
                                project.demand === 'Modérée' ? 'bg-orange-500' :
                                'bg-purple-500'
                              } text-white`}
                            >
                              {project.demand}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          asChild
                          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        >
                          <Link to="/contact">
                            Analyser mon projet
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

        {/* Territories Performance */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Performance par Territoire
              </h2>
              <p className="text-xl text-gray-600">
                Taux de réussite et délais par zone géographique
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {territories.map((territory, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{territory.zone}</h3>
                      <div className="space-y-3 mb-4">
                        <div>
                          <div className="text-3xl font-bold text-green-600">{territory.taux}</div>
                          <div className="text-sm text-gray-500">Taux de réussite</div>
                        </div>
                        <div>
                          <div className="text-xl font-semibold text-blue-600">{territory.delai}</div>
                          <div className="text-sm text-gray-500">Délai moyen</div>
                        </div>
                        <div>
                          <div className="text-lg font-medium text-gray-700">{territory.projets} projets</div>
                          <div className="text-sm text-gray-500">En cours</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{territory.description}</p>
                      <Button 
                        asChild
                        size="sm"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                      >
                        <Link to="/contact">
                          Analyser cette zone
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Succès de nos promoteurs partenaires
              </h2>
              <p className="text-xl text-gray-600">
                Programmes immobiliers qui ont dépassé tous les objectifs
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
                              <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{story.promoteur}</h3>
                              <p className="text-sm text-gray-600">{story.projet}</p>
                            </div>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {story.resultat}
                          </h4>
                          <p className="text-gray-600">{story.details}</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {story.performance}
                          </div>
                          <div className="text-sm text-gray-500">Performance</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {story.chiffre}
                          </div>
                          <div className="text-sm text-gray-500">Chiffre d'affaires</div>
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
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Partenariat en 4 étapes
              </h2>
              <p className="text-xl text-gray-600">
                De l'audit initial au lancement commercial en 3 semaines
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
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Packages Commercialisation
              </h2>
              <p className="text-xl text-gray-600">
                Solutions adaptées à la taille et ambition de vos programmes
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
                        ⭐ Plus choisi
                      </Badge>
                    </div>
                  )}
                  
                  <Card className={`h-full border-0 shadow-lg ${
                    pkg.popular ? 'ring-2 ring-purple-500 shadow-xl' : ''
                  }`}>
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center mx-auto mb-4`}>
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {pkg.name}
                      </CardTitle>
                      <div className="text-2xl font-bold text-gray-900">
                        {pkg.price}
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
                          Audit projet gratuit
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
                Prêt à révolutionner vos ventes ?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Rejoignez Sahel, SOPIC et +25 promoteurs qui ont boosté leurs ventes 
                avec notre réseau diaspora. Audit gratuit de votre projet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg"
                >
                  <Link to="/contact">
                    Audit Gratuit Projet
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
                >
                  <Link to="/success-stories">
                    Success Stories
                    <Eye className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
              
              {/* Contact Info */}
              <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>promoteurs@terangafoncier.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>+221 77 593 42 41</span>
                </div>
              </div>
              
              {/* Guarantee */}
              <div className="mt-8 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Audit sans engagement • Garantie objectifs commerciaux</span>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PromoteursPage;

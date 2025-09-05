import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Home, 
  TrendingUp, 
  Users, 
  Clock, 
  Globe, 
  CheckCircle, 
  ArrowRight, 
  Award, 
  Zap, 
  Shield, 
  Camera, 
  Star, 
  Phone, 
  Mail, 
  Calculator, 
  Target, 
  FileText, 
  BarChart3, 
  Activity, 
  Eye, 
  MapPin, 
  Building2, 
  CreditCard, 
  AlertTriangle, 
  Smartphone, 
  Video, 
  Headphones
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';

const VendeursPage = () => {
  const [activeService, setActiveService] = useState(0);

  const businessMetrics = [
    {
      title: "Prix de Vente",
      value: "+34%",
      description: "Augmentation moyenne du prix de vente grâce à notre marketing",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Délai de Vente",
      value: "-67%",
      description: "Réduction du temps de vente grâce à notre réseau qualifié",
      icon: Clock,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Acheteurs Qualifiés",
      value: "25K+",
      description: "Base d'acheteurs pré-qualifiés avec financement confirmé",
      icon: Users,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Ventes Diaspora",
      value: "89%",
      description: "Pourcentage de ventes réalisées avec clients diaspora",
      icon: Globe,
      color: "from-orange-500 to-red-500"
    }
  ];

  const services = [
    {
      icon: Camera,
      title: "Marketing immobilier premium",
      description: "Photos 4K, vidéos drone, visites virtuelles 360° et brochures professionnelles",
      features: ["Photos HD professionnelles", "Vidéos drone 4K", "Visite virtuelle 360°", "Brochures design"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Target,
      title: "Ciblage acheteurs diaspora",
      description: "Exposition prioritaire auprès de 25,000+ acheteurs diaspora qualifiés",
      features: ["Base diaspora exclusive", "Targeting géographique", "Campagnes personnalisées", "Suivi prospects"],
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Shield,
      title: "Sécurisation transaction",
      description: "Processus sécurisé avec vérification légale et accompagnement notarial",
      features: ["Vérification titres", "Due diligence complète", "Accompagnement notaire", "Assurance vente"],
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: BarChart3,
      title: "Estimation IA précise",
      description: "Valorisation optimale basée sur l'IA et données marché temps réel",
      features: ["Algorithme IA avancé", "Données marché live", "Comparaisons automatiques", "Ajustements dynamiques"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const advantages = [
    {
      icon: DollarSign,
      title: "Valorisation optimale",
      description: "Notre IA d'estimation augmente le prix de vente de +34% en moyenne",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Globe,
      title: "Marché diaspora exclusif",
      description: "Accès à 25K+ acheteurs diaspora avec pouvoir d'achat supérieur",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Vente accélérée",
      description: "Délai de vente réduit de 67% grâce à notre réseau qualifié",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Award,
      title: "Service premium inclus",
      description: "Photos pro, vidéos drone, marketing digital, tout inclus sans frais",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Shield,
      title: "Sécurité maximale",
      description: "Transaction 100% sécurisée avec vérifications légales poussées",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Headphones,
      title: "Accompagnement dédié",
      description: "Conseiller personnel disponible 7j/7 pour suivre votre vente",
      color: "from-pink-500 to-rose-500"
    }
  ];

  const marketingFeatures = [
    {
      title: "Photos Professionnelles 4K",
      description: "Shootings photo haute définition avec éclairage professionnel et retouches",
      icon: Camera
    },
    {
      title: "Vidéos Drone Cinématiques",
      description: "Prises de vue aériennes spectaculaires pour valoriser votre propriété",
      icon: Video
    },
    {
      title: "Visites Virtuelles 360°",
      description: "Immersion complète pour acheteurs diaspora ne pouvant se déplacer",
      icon: Eye
    },
    {
      title: "Campagnes Digitales Ciblées",
      description: "Publicités Facebook, Instagram et Google Ads vers diaspora qualifiée",
      icon: Activity
    }
  ];

  const successStories = [
    {
      vendeur: "Madame Diouf",
      bien: "Villa 4 pièces Almadies",
      resultat: "Vendue +45% prix initial en 3 semaines",
      details: "Acquéreur diaspora parisienne",
      gain: "+€127K",
      delai: "3 semaines"
    },
    {
      vendeur: "Monsieur Kane",
      bien: "Terrain 500m² Diamniadio", 
      resultat: "Surenchère de 3 acheteurs diaspora",
      details: "Vente finale +38% estimation",
      gain: "+€85K",
      delai: "10 jours"
    },
    {
      vendeur: "Famille Ba",
      bien: "Duplex Ngor bord de mer",
      resultat: "Vente record zone en 2 mois",
      details: "Acheteur investisseur US",
      gain: "+€194K",
      delai: "2 mois"
    }
  ];

  const packages = [
    {
      name: "Essentiel",
      price: "2% commission",
      originalPrice: "3% classique",
      description: "Pour biens standards",
      features: [
        "Photos HD professionnelles",
        "Estimation IA précise",
        "Exposition diaspora",
        "Accompagnement vente",
        "Sécurisation transaction",
        "Marketing digital de base"
      ],
      color: "from-blue-500 to-cyan-500",
      popular: false
    },
    {
      name: "Premium",
      price: "2.5% commission",
      originalPrice: "4% classique",
      description: "Pour biens haut de gamme",
      features: [
        "Tout Essentiel inclus",
        "Vidéos drone 4K",
        "Visite virtuelle 360°",
        "Brochure design premium",
        "Campagnes pub ciblées",
        "Conseiller dédié 24/7",
        "Staging virtuel inclus"
      ],
      color: "from-purple-500 to-indigo-500",
      popular: true
    },
    {
      name: "Elite",
      price: "3% commission",
      originalPrice: "5% classique",
      description: "Pour propriétés d'exception",
      features: [
        "Tout Premium inclus",
        "Shooting architectural pro",
        "Vidéo cinématique",
        "Relations presse incluses",
        "Événement privé VIP",
        "Concierge service",
        "Garantie vente 90 jours"
      ],
      color: "from-emerald-500 to-teal-500",
      popular: false
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Estimation gratuite IA",
      description: "Évaluation précise de votre bien en 24h avec notre algorithme avancé",
      icon: Calculator
    },
    {
      step: "2",
      title: "Shooting premium",
      description: "Photos 4K, vidéos drone et visite 360° réalisés par nos équipes",
      icon: Camera
    },
    {
      step: "3",
      title: "Marketing ciblé",
      description: "Diffusion auprès de 25K+ acheteurs diaspora pré-qualifiés",
      icon: Target
    },
    {
      step: "4",
      title: "Vente sécurisée",
      description: "Accompagnement complet jusqu'à la signature chez le notaire",
      icon: Users
    }
  ];

  const propertyTypes = [
    { type: "Villas", commission: "2-3%", delai: "21 jours", demande: "Très forte" },
    { type: "Terrains", commission: "1.5-2.5%", delai: "14 jours", demande: "Excellente" },
    { type: "Appartements", commission: "2-3%", delai: "28 jours", demande: "Forte" },
    { type: "Immeubles", commission: "2.5-3.5%", delai: "45 jours", demande: "Modérée" },
    { type: "Commerces", commission: "3-4%", delai: "60 jours", demande: "Sélective" },
    { type: "Industriel", commission: "2-3%", delai: "90 jours", demande: "Spécialisée" }
  ];

  return (
    <>
      <Helmet>
        <title>Vendeurs Immobilier - Teranga Foncier | +34% prix de vente garantis</title>
        <meta name="description" content="Vendez +34% plus cher en -67% de temps : 25K acheteurs diaspora, marketing premium, IA d'estimation. Commission réduite 2-3% vs 5% classique." />
        <meta property="og:title" content="Vendeurs - Vendez +34% plus cher, 67% plus vite" />
        <meta property="og:description" content="Réseau exclusif diaspora, marketing 4K inclus, vente sécurisée. Estimation gratuite en 24h." />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section Vendeurs */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-24 pb-20">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.08'%3E%3Cpath d='M0 0h40l40 40v40H40L0 40V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm font-medium">
                    🏡 Vente Immobilière Premium
                  </Badge>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                    Vendez{" "}
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      +34% plus cher
                    </span>
                    <br />
                    67% plus vite
                  </h1>
                  
                  <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                    Accédez à 25,000+ acheteurs diaspora qualifiés. Marketing premium 
                    inclus et commission réduite à 2-3% vs 5% classique.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild
                    size="lg" 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                  >
                    <Link to="/contact">
                      Estimation Gratuite
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold"
                  >
                    Voir les Vendeurs
                    <Eye className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-6 pt-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">Estimation 24h</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">Marketing inclus</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">Commission réduite</span>
                  </div>
                </div>
              </motion.div>

              {/* Hero Visual - Sale Dashboard */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                  {/* Sale Dashboard Mockup */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">Vente Dashboard</h3>
                      <Badge className="bg-green-500 text-white">En vente</Badge>
                    </div>
                    
                    {/* Property Card */}
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">Villa Almadies</h4>
                        <Badge className="bg-blue-500 text-white text-xs">Premium</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Prix estimé: <span className="font-bold text-green-600">€340K</span></div>
                        <div>Intérêt: <span className="font-bold text-blue-600">127%</span></div>
                        <div>Vues: <span className="font-bold">2,450</span></div>
                        <div>Contacts: <span className="font-bold">34</span></div>
                      </div>
                    </div>
                    
                    {/* Performance Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">+34%</div>
                            <div className="text-sm text-green-100">Prix optimisé</div>
                          </div>
                          <TrendingUp className="w-8 h-8 text-green-200" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">21j</div>
                            <div className="text-sm text-blue-100">Délai moyen</div>
                          </div>
                          <Clock className="w-8 h-8 text-blue-200" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Recent Interest */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Intérêt récent</h4>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm">
                          <span>👤 Diaspora Paris</span>
                          <Badge className="bg-green-500 text-white text-xs">Qualifié</Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-purple-50 rounded text-sm">
                          <span>👤 Investisseur NY</span>
                          <Badge className="bg-orange-500 text-white text-xs">Intéressé</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-xl shadow-lg"
                >
                  <DollarSign className="w-6 h-6" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-xl shadow-lg"
                >
                  <Home className="w-6 h-6" />
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
                Résultats de nos vendeurs
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Performance moyenne constatée vs vente traditionnelle
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
                Service Vente Premium Complet
              </h2>
              <p className="text-xl text-gray-600">
                Tout inclus pour valoriser et vendre votre bien rapidement
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
                      activeService === index ? 'ring-2 ring-green-500 shadow-2xl' : ''
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
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
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
                        Estimation gratuite
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Property Types */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Types de Biens Recherchés
              </h2>
              <p className="text-xl text-gray-600">
                Délais et commissions par type de propriété
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {propertyTypes.map((property, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{property.type}</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Commission:</span>
                            <span className="font-semibold text-green-600">{property.commission}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Délai moyen:</span>
                            <span className="font-semibold text-blue-600">{property.delai}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Demande:</span>
                            <Badge 
                              className={`${
                                property.demande === 'Très forte' || property.demande === 'Excellente' ? 'bg-green-500' :
                                property.demande === 'Forte' ? 'bg-blue-500' :
                                property.demande === 'Modérée' ? 'bg-orange-500' :
                                'bg-purple-500'
                              } text-white`}
                            >
                              {property.demande}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          asChild
                          className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                        >
                          <Link to="/contact">
                            Estimer mon {property.type.toLowerCase()}
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
                Ventes remarquables récentes
              </h2>
              <p className="text-xl text-gray-600">
                Propriétaires qui ont fait le bon choix
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
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                              <Home className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{story.vendeur}</h3>
                              <p className="text-sm text-gray-600">{story.bien}</p>
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
                            {story.gain}
                          </div>
                          <div className="text-sm text-gray-500">Gain supplémentaire</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {story.delai}
                          </div>
                          <div className="text-sm text-gray-500">Délai vente</div>
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
                Vente en 4 étapes simples
              </h2>
              <p className="text-xl text-gray-600">
                De l'estimation à la signature en 3 semaines moyenne
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
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto text-white">
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
                Commissions Transparentes
              </h2>
              <p className="text-xl text-gray-600">
                Jusqu'à 40% d'économies vs agences traditionnelles
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
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1">
                        ⭐ Plus choisi
                      </Badge>
                    </div>
                  )}
                  
                  <Card className={`h-full border-0 shadow-lg ${
                    pkg.popular ? 'ring-2 ring-green-500 shadow-xl' : ''
                  }`}>
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center mx-auto mb-4`}>
                        <DollarSign className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {pkg.name}
                      </CardTitle>
                      <div className="space-y-1">
                        <div className="text-2xl font-bold text-green-600">
                          {pkg.price}
                        </div>
                        <div className="text-sm text-gray-500 line-through">
                          {pkg.originalPrice}
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
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                        } text-white`}
                      >
                        <Link to="/contact">
                          Estimation gratuite
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
        <section className="py-20 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
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
                Prêt à vendre au meilleur prix ?
              </h2>
              <p className="text-xl mb-8 text-green-100">
                Estimation gratuite en 24h. Nos experts analysent votre bien 
                et vous proposent la stratégie optimale de vente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold shadow-lg"
                >
                  <Link to="/contact">
                    Estimation Gratuite 24h
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold"
                >
                  <Link to="/contact">
                    Parler à un Expert
                    <Phone className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
              
              {/* Contact Info */}
              <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>vendeurs@terangafoncier.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5" />
                  <span>+221 77 987 65 43</span>
                </div>
              </div>
              
              {/* Guarantee */}
              <div className="mt-8 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Estimation sans engagement • Confidentialité garantie</span>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default VendeursPage;

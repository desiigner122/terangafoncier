import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Compass, 
  Ruler, 
  Target, 
  Satellite, 
  Camera, 
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
  TrendingUp, 
  Users, 
  BarChart3, 
  Activity, 
  DollarSign, 
  Building2, 
  Eye, 
  Map, 
  Navigation, 
  Layers, 
  Scan, 
  FileText, 
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';

const GeometresPage = () => {
  const [activeService, setActiveService] = useState(0);

  const businessMetrics = [
    {
      title: "Missions Mensuelles",
      value: "+234%",
      description: "Augmentation du nombre de missions de géomètrage par mois",
      icon: MapPin,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Revenus Moyens",
      value: "+145%",
      description: "Croissance des honoraires grâce au volume d'affaires",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Clients Actifs",
      value: "1.2K+",
      description: "Nouveaux clients générés via notre écosystème immobilier",
      icon: Users,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Délais Réduits",
      value: "-58%",
      description: "Réduction des délais grâce aux outils digitaux avancés",
      icon: Clock,
      color: "from-orange-500 to-red-500"
    }
  ];

  const services = [
    {
      icon: Satellite,
      title: "Géomètrage satellite",
      description: "Levés topographiques haute précision avec technologie satellite et drones",
      features: ["Imagerie satellite 4K", "Précision centimétrique", "Livraison 48h", "Plans 3D inclus"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Scan,
      title: "Scanning 3D",
      description: "Relevés laser 3D pour modélisations architecturales et BIM",
      features: ["Scanner laser mobile", "Nuages de points", "Modèles BIM", "Réalité augmentée"],
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Map,
      title: "Cartographie avancée",
      description: "Cartographie digitale avec SIG et géolocalisation GPS précise",
      features: ["SIG professionnel", "Géoréférencement", "Couches thématiques", "Export multi-formats"],
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Eye,
      title: "Supervision projet",
      description: "Suivi en temps réel des projets avec reporting automatisé",
      features: ["Dashboard temps réel", "Alertes automatiques", "Rapports PDF", "App mobile"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const advantages = [
    {
      icon: Target,
      title: "Missions garanties",
      description: "Accès prioritaire à +800 projets immobiliers nécessitant un géomètre",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Outils dernière génération",
      description: "Équipements fournis : drones, scanners 3D, GPS RTK et logiciels SIG premium",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Globe,
      title: "Marché diaspora",
      description: "Spécialisation sur projets diaspora avec protocoles adaptés aux clients distants",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Award,
      title: "Certification qualité",
      description: "Label Teranga Géomètres avec formation continue et certification ISO",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Activity,
      title: "Workflow optimisé",
      description: "Plateforme intégrée pour devis, planification, exécution et facturation",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: BarChart3,
      title: "Analytics business",
      description: "Suivi performance, rentabilité par mission et forecasting intelligent",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const equipmentFeatures = [
    {
      title: "Drones Professionnels",
      description: "DJI Phantom 4 RTK et Matrice 300 avec caméras multispectrale haute résolution",
      icon: Navigation
    },
    {
      title: "Scanner Laser 3D",
      description: "Leica BLK360 pour relevés architecturaux et modélisation BIM complète",
      icon: Scan
    },
    {
      title: "GPS RTK",
      description: "Récepteurs Trimble avec précision centimétrique pour géoréférencement",
      icon: Satellite
    },
    {
      title: "Logiciels SIG",
      description: "Suite complète ArcGIS Pro, AutoCAD Civil 3D et solutions cloud dédiées",
      icon: Layers
    }
  ];

  const successStories = [
    {
      geometre: "Cabinet Diallo & Associés",
      location: "Dakar",
      results: "+280% missions en 10 mois",
      details: "Spécialisation projets Almadies",
      growth: "+280%",
      volume: "85 missions/mois"
    },
    {
      geometre: "Geo-Tech Sénégal",
      location: "Thiès",
      results: "€180K revenus additionnels/an",
      details: "Focus développements diaspora",
      growth: "+190%",
      volume: "65 missions/mois"
    },
    {
      geometre: "Cabinet Ba Géomètres",
      location: "Saint-Louis",
      results: "650 nouveaux clients acquis",
      details: "Couverture Nord Sénégal",
      growth: "+156%",
      volume: "45 missions/mois"
    }
  ];

  const packages = [
    {
      name: "Starter",
      price: "199.000 FCFA/mois",
      description: "Pour géomètres indépendants",
      features: [
        "Jusqu'à 30 missions/mois",
        "Drone DJI Mini 3 Pro inclus",
        "Logiciel SIG de base",
        "Support 5j/7",
        "Formation 1 jour",
        "Templates rapports"
      ],
      color: "from-blue-500 to-cyan-500",
      popular: false
    },
    {
      name: "Professional",
      price: "399.000 FCFA/mois",
      description: "Pour cabinets établis",
      features: [
        "Missions illimitées",
        "Scanner 3D + Drone RTK",
        "Suite SIG complète",
        "Support 24/7",
        "Formation avancée 3 jours",
        "Équipe dédiée",
        "Assurance matériel incluse"
      ],
      color: "from-purple-500 to-indigo-500",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Sur mesure",
      description: "Pour grands cabinets",
      features: [
        "Flotte équipements",
        "Solutions sur mesure",
        "Multi-sites",
        "Formation équipes",
        "Account manager",
        "Développements spécifiques",
        "SLA premium"
      ],
      color: "from-emerald-500 to-teal-500",
      popular: false
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Évaluation gratuite",
      description: "Audit de votre activité et définition du plan d'équipement optimal",
      icon: Target
    },
    {
      step: "2",
      title: "Formation technique",
      description: "Formation de 1 à 3 jours sur nos équipements et plateforme",
      icon: Award
    },
    {
      step: "3",
      title: "Première mission",
      description: "Accompagnement sur votre première mission pour garantir la qualité",
      icon: MapPin
    },
    {
      step: "4",
      title: "Montée en charge",
      description: "Développement progressif jusqu'à 85+ missions par mois",
      icon: TrendingUp
    }
  ];

  return (
    <>
      <Helmet>
        <title>Partenariat Géomètres - Teranga Foncier | +234% de missions garanties</title>
        <meta name="description" content="Rejoignez +30 géomètres partenaires : équipements fournis, 800+ projets/mois, formation incluse. Boostez vos revenus de +145% avec la diaspora." />
        <meta property="og:title" content="Partenariat Géomètres - Multipliez vos missions par 3" />
        <meta property="og:description" content="Drones, scanners 3D, GPS RTK fournis. Accès à 800+ projets mensuels. Formation et certification incluses." />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section Géomètres */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-24 pb-20">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.08'%3E%3Cpath d='M0 0l40 40L0 80V0zm40 0l40 40-40 40V0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
                    📐 Partenariat Géomètres Premium
                  </Badge>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                    +234% de missions{" "}
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      garanties
                    </span>
                    <br />
                    avec nos équipements
                  </h1>
                  
                  <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                    Rejoignez +30 géomètres qui ont transformé leur activité : 
                    drones, scanners 3D et 800+ projets mensuels fournis.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild
                    size="lg" 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                  >
                    <Link to="/contact">
                      Devenir Partenaire
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold"
                  >
                    Catalogue Équipements
                    <Camera className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-6 pt-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">Équipements fournis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">Formation incluse</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">Missions garanties</span>
                  </div>
                </div>
              </motion.div>

              {/* Hero Visual - Geo Dashboard */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                  {/* Geo Dashboard Mockup */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">Geo Dashboard</h3>
                      <Badge className="bg-green-500 text-white">En mission</Badge>
                    </div>
                    
                    {/* Map Mockup */}
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-4 h-32 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-blue-500 text-white text-xs">GPS RTK</Badge>
                      </div>
                    </div>
                    
                    {/* Metrics Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">85</div>
                            <div className="text-sm text-green-100">Missions/mois</div>
                          </div>
                          <MapPin className="w-8 h-8 text-green-200" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">±2cm</div>
                            <div className="text-sm text-blue-100">Précision</div>
                          </div>
                          <Target className="w-8 h-8 text-blue-200" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Equipment Status */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Équipements actifs</h4>
                      <div className="flex space-x-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Drone RTK</Badge>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">Scanner 3D</Badge>
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
                  <Compass className="w-6 h-6" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-xl shadow-lg"
                >
                  <Satellite className="w-6 h-6" />
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
                Performance de nos géomètres partenaires
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Résultats moyens constatés après 8 mois de partenariat
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
                Services Géomètres Avancés
              </h2>
              <p className="text-xl text-gray-600">
                Technologies de pointe pour géomètrage haute précision
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
                        Découvrir les équipements
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Equipment Features */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Équipements Haute Technologie
              </h2>
              <p className="text-xl text-gray-600">
                Matériel professionnel fourni et maintenu par nos équipes
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {equipmentFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
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
                Succès de nos géomètres
              </h2>
              <p className="text-xl text-gray-600">
                Des cabinets transformés grâce à nos équipements et missions
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
                              <Compass className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{story.geometre}</h3>
                              <p className="text-sm text-gray-600">{story.location}</p>
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
                Démarrage en 4 étapes
              </h2>
              <p className="text-xl text-gray-600">
                De l'évaluation aux premières missions en 2 semaines
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
                Packages Équipements + Missions
              </h2>
              <p className="text-xl text-gray-600">
                Solutions complètes avec matériel inclus et missions garanties
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
                        <Compass className="w-8 h-8 text-white" />
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
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                        } text-white`}
                      >
                        <Link to="/contact">
                          Commencer maintenant
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
                Prêt à transformer votre activité ?
              </h2>
              <p className="text-xl mb-8 text-green-100">
                +30 géomètres nous font confiance. Évaluation gratuite de votre 
                potentiel et plan d'équipement personnalisé.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold shadow-lg"
                >
                  <Link to="/contact">
                    Évaluation Gratuite
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
                    Catalogue Équipements
                    <Camera className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
              
              {/* Contact Info */}
              <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>geometres@terangafoncier.com</span>
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

export default GeometresPage;

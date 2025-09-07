import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  Shield, 
  FileText, 
  Clock, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  Award, 
  Zap, 
  Globe, 
  Smartphone, 
  Briefcase, 
  Star, 
  Phone, 
  Mail, 
  Calculator, 
  Target, 
  BarChart3, 
  Activity, 
  DollarSign, 
  Building2, 
  Eye, 
  Stamp, 
  Lock, 
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';

const NotairesPage = () => {
  const [activeService, setActiveService] = useState(0);

  const businessMetrics = [
    {
      title: "Actes Traités",
      value: "+156%",
      description: "Augmentation du volume d'actes immobiliers traités mensuellement",
      icon: FileText,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Revenus Moyens",
      value: "+89%",
      description: "Croissance des honoraires grâce au volume additionnel",
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Clients Diaspora",
      value: "850+",
      description: "Nouveaux clients diaspora traités via notre plateforme",
      icon: Globe,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Temps Traitement",
      value: "-67%",
      description: "Réduction du temps de traitement grâce à la digitalisation",
      icon: Clock,
      color: "from-orange-500 to-red-500"
    }
  ];

  const services = [
    {
      icon: Stamp,
      title: "Authentification numérique",
      description: "Signature électronique certifiée et horodatage sécurisé pour tous vos actes",
      features: ["Signature électronique qualifiée", "Horodatage certifié", "Archivage sécurisé", "Conformité légale"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Globe,
      title: "Actes diaspora",
      description: "Traitement spécialisé des transactions internationales avec la diaspora sénégalaise",
      features: ["Visioconférence notariale", "Vérification d'identité", "Procurations distance", "Suivi temps réel"],
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Shield,
      title: "Sécurisation avancée",
      description: "Vérification automatisée des titres et due diligence intelligente",
      features: ["Vérification titres IA", "Due diligence auto", "Alerte fraudes", "Traçabilité complète"],
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Activity,
      title: "Workflow optimisé",
      description: "Processus entièrement digitalisés pour une efficacité maximale",
      features: ["Agenda intelligent", "Rappels automatiques", "Templates actes", "Reporting avancé"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const advantages = [
    {
      icon: Users,
      title: "Flux clients garanti",
      description: "Accès à +15,000 investisseurs actifs générant 200+ actes/mois en moyenne",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Digitalisation complète",
      description: "Plateforme tout-en-un : agenda, signatures, archivage et facturation automatisés",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Award,
      title: "Expertise diaspora",
      description: "Formation et outils spécialisés pour traiter efficacement les dossiers internationaux",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Target,
      title: "Revenus prévisibles",
      description: "Honoraires garantis avec notre modèle de partenariat exclusif par zone",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Lock,
      title: "Sécurité renforcée",
      description: "Outils IA de détection de fraudes et vérification automatisée des FileTexts",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: BarChart3,
      title: "Analytics business",
      description: "Tableaux de bord détaillés sur votre activité et opportunités de croissance",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const digitalFeatures = [
    {
      title: "Signature Électronique Qualifiée",
      description: "Conformité totale avec la réglementation OHADA et reconnaissance internationale",
      icon: Stamp
    },
    {
      title: "Visioconférence Notariale",
      description: "Réception de clients diaspora en toute sécurité avec enregistrement certifié",
      icon: Eye
    },
    {
      title: "Archivage Numérique",
      description: "Stockage sécurisé et recherche instantanée de tous vos actes avec backup automatique",
      icon: FileText
    },
    {
      title: "Workflow Intelligent",
      description: "Automatisation des tâches répétitives et optimisation de vos processus métier",
      icon: Activity
    }
  ];

  const successStories = [
    {
      notaire: "Me. Fatou Diop",
      location: "Dakar Plateau",
      results: "+240% d'actes immobiliers en 8 mois",
      details: "Spécialisation diaspora européenne",
      growth: "+240%",
      volume: "180 actes/mois"
    },
    {
      notaire: "Me. Mamadou Kane",
      location: "Almadies",
      results: "€450K d'honoraires additionnels/an",
      details: "Focus clientèle Amérique du Nord",
      growth: "+189%",
      volume: "125 actes/mois"
    },
    {
      notaire: "Me. Aissatou Sy",
      location: "Guédiawaye",
      results: "950 nouveaux clients diaspora",
      details: "Couverture Afrique de l'Ouest",
      growth: "+156%",
      volume: "95 actes/mois"
    }
  ];

  const packages = [
    {
      name: "Solo",
      price: "149.000 FCFA/mois",
      description: "Pour notaires individuels",
      features: [
        "Jusqu'à 50 actes/mois",
        "Signature électronique",
        "Visioconférence incluse",
        "Support 5j/7",
        "Formation de base",
        "Templates d'actes"
      ],
      color: "from-blue-500 to-cyan-500",
      popular: false
    },
    {
      name: "Cabinet",
      price: "299.000 FCFA/mois",
      description: "Pour cabinets 2-5 notaires",
      features: [
        "Actes illimités",
        "Multi-utilisateurs",
        "Analytics avancées", 
        "Support prioritaire 24/7",
        "Formation approfondie",
        "API personnalisée",
        "Account manager dédié"
      ],
      color: "from-purple-500 to-indigo-500",
      popular: true
    },
    {
      name: "Réseau",
      price: "Sur mesure",
      description: "Pour réseaux/groupes",
      features: [
        "Solution multi-cabinets",
        "Personnalisation complète",
        "Intégration ERP",
        "Support technique dédié",
        "Formation sur site",
        "SLA garantis",
        "Développements spécifiques"
      ],
      color: "from-emerald-500 to-teal-500",
      popular: false
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Inscription rapide",
      description: "Créez votre profil notaire en 5 minutes avec vérification automatique",
      icon: FileText
    },
    {
      step: "2", 
      title: "Formation express",
      description: "Formation de 2h sur nos outils et processus diaspora",
      icon: Award
    },
    {
      step: "3",
      title: "Premier mandat",
      description: "Recevez votre premier dossier dans les 48h après validation",
      icon: Users
    },
    {
      step: "4",
      title: "Croissance garantie",
      description: "Montée en charge progressive jusqu'à 200+ actes/mois",
      icon: TrendingUp
    }
  ];

  return (
    <>
      <Helmet>
        <title>Partenariat Notaires - Teranga Foncier | +156% d'actes immobiliers</title>
        <meta name="description" content="Rejoignez +50 notaires partenaires : +15K clients actifs, digitalisation complète, revenus garantis. Boostez vos honoraires de +89% avec la diaspora." />
        <meta property="og:title" content="Partenariat Notaires - Multipliez vos actes par 2.5" />
        <meta property="og:description" content="Plateforme notariale digitale : visioconférence, signature électronique, clients diaspora. +156% d'actes en moyenne." />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section Notaires */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-20">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.08'%3E%3Cpath d='M20 20h20v20H20V20zm20 20h20v20H40V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
                    ⚖️ Partenariat Notarial Premium
                  </Badge>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                    Multipliez vos{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      actes par 2.5
                    </span>
                    <br />
                    avec la diaspora
                  </h1>
                  
                  <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                    Rejoignez +50 notaires partenaires qui ont transformé leur pratique 
                    grâce à notre écosystème digital et nos 15,000+ clients actifs.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                  >
                    <Link to="/contact">
                      Devenir Partenaire
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
                  >
                    Guide Notaire Digital
                    <FileText className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap items-center gap-6 pt-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Conformité OHADA</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Signature qualifiée</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Formation incluse</span>
                  </div>
                </div>
              </motion.div>

              {/* Hero Visual - Notarial Dashboard */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                  {/* Notarial Dashboard Mockup */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">Cabinet Digital</h3>
                      <Badge className="bg-blue-500 text-white">Me. Diop</Badge>
                    </div>
                    
                    {/* Metrics Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">156</div>
                            <div className="text-sm text-blue-100">Actes ce mois</div>
                          </div>
                          <FileText className="w-8 h-8 text-blue-200" />
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-2xl font-bold">€89K</div>
                            <div className="text-sm text-emerald-100">Honoraires</div>
                          </div>
                          <TrendingUp className="w-8 h-8 text-emerald-200" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Recent Activities */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Activité récente</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded">
                          <Stamp className="w-4 h-4 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Acte signé - Paris</p>
                            <p className="text-xs text-gray-500">Il y a 15 min</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-2 bg-green-50 rounded">
                          <Globe className="w-4 h-4 text-green-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Vente diaspora - NY</p>
                            <p className="text-xs text-gray-500">Il y a 1h</p>
                          </div>
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
                  <Scale className="w-6 h-6" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3 rounded-xl shadow-lg"
                >
                  <Stamp className="w-6 h-6" />
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
                Résultats de nos notaires partenaires
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Performance moyenne constatée après 6 mois de partenariat
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
                Plateforme Notariale Complète
              </h2>
              <p className="text-xl text-gray-600">
                Tous les outils pour transformer votre pratique notariale
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
                        En savoir plus
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Digital Features */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Technologie Notariale Avancée
              </h2>
              <p className="text-xl text-gray-600">
                Outils conformes aux standards internationaux et réglementation OHADA
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {digitalFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
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
                Témoignages de nos notaires
              </h2>
              <p className="text-xl text-gray-600">
                Des cabinets transformés en quelques mois
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
                              <Scale className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{story.notaire}</h3>
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
                          <div className="text-sm text-gray-500">Moyenne</div>
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
                Démarrage en 4 étapes simples
              </h2>
              <p className="text-xl text-gray-600">
                De l'inscription aux premiers mandats en moins d'une semaine
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
                Tarifs Transparents
              </h2>
              <p className="text-xl text-gray-600">
                Solutions adaptées à tous les types de cabinets notariaux
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
                        <Scale className="w-8 h-8 text-white" />
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
                Rejoignez la révolution notariale
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                +50 notaires nous font déjà confiance. Première consultation gratuite 
                pour analyser le potentiel de croissance de votre cabinet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg"
                >
                  <Link to="/contact">
                    Consultation Gratuite
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
                    FileTextation
                    <FileText className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
              
              {/* Contact Info */}
              <div className="mt-12 flex flex-col md:flex-row justify-center items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>notaires@terangafoncier.com</span>
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

export default NotairesPage;

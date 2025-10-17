import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Building, 
  Eye, 
  CreditCard, 
  Shield, 
  Phone, 
  CheckCircle, 
  ArrowRight, 
  Play, 
  Clock, 
  Users, 
  Camera, 
  Video, 
  FileText, 
  TrendingUp, 
  Star, 
  MapPin, 
  Home, 
  Smartphone, 
  Target, 
  Award, 
  Zap, 
  Activity, 
  Monitor, 
  BarChart3, 
  Headphones
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SEO from '@/components/SEO';

const DiasporaPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  const processSteps = [
    {
      icon: MapPin,
      title: "Choisissez votre terrain",
      description: "Parcourez notre catalogue de 15,000+ terrains avec photos, vidéos et données GPS précises"
    },
    {
      icon: CreditCard,
      title: "Paiement flexible",
      description: "Payez en plusieurs fois avec prélèvement automatique mensuel depuis votre banque internationale"
    },
    {
      icon: FileText,
      title: "Sécurisation notariale",
      description: "Tous vos FileTexts sont traités par nos notaires partenaires certifiés au Sénégal"
    },
    {
      icon: Building,
      title: "Construction supervisée",
      description: "Suivez votre chantier en temps réel avec photos, vidéos et rapports d'avancement quotidiens"
    },
    {
      icon: Home,
      title: "Livraison clés en main",
      description: "Recevez votre propriété terminée avec toutes les finitions selon vos spécifications"
    }
  ];

  const features = {
    achat: [
      {
        icon: Globe,
        title: "Achat depuis l'étranger",
        description: "Achetez votre terrain au Sénégal depuis n'importe quel pays du monde en toute sécurité",
        color: "from-blue-500 to-cyan-500"
      },
      {
        icon: CreditCard,
        title: "Paiements échelonnés",
        description: "Étalez vos paiements sur 12 à 60 mois avec prélèvement automatique international",
        color: "from-emerald-500 to-teal-500"
      },
      {
        icon: Shield,
        title: "Sécurité garantie",
        description: "Toutes les transactions sont sécurisées par nos notaires et assurances partenaires",
        color: "from-purple-500 to-indigo-500"
      },
      {
        icon: Eye,
        title: "Visite virtuelle 360°",
        description: "Visitez votre terrain à distance avec notre technologie de réalité virtuelle",
        color: "from-orange-500 to-red-500"
      }
    ],
    construction: [
      {
        icon: Camera,
        title: "Suivi photo quotidien",
        description: "Recevez des photos haute définition de l'avancement de vos travaux chaque jour",
        color: "from-green-500 to-emerald-500"
      },
      {
        icon: Video,
        title: "Vidéos hebdomadaires",
        description: "Vidéos détaillées de votre chantier avec commentaires du chef de projet",
        color: "from-pink-500 to-rose-500"
      },
      {
        icon: Phone,
        title: "Réunions virtuelles",
        description: "Rencontrez votre équipe construction via visioconférence chaque semaine",
        color: "from-cyan-500 to-blue-500"
      },
      {
        icon: FileText,
        title: "Rapports détaillés",
        description: "Recevez des rapports complets sur l'avancement et la qualité des travaux",
        color: "from-indigo-500 to-purple-500"
      }
    ],
    suivi: [
      {
        icon: Smartphone,
        title: "App mobile dédiée",
        description: "Suivez votre projet 24/7 depuis votre smartphone où que vous soyez dans le monde",
        color: "from-teal-500 to-green-500"
      },
      {
        icon: Clock,
        title: "Temps réel",
        description: "Notifications instantanées à chaque étape importante de votre projet",
        color: "from-yellow-500 to-orange-500"
      },
      {
        icon: Users,
        title: "Équipe dédiée",
        description: "Une équipe de 5 professionnels assignée exclusivement à votre projet",
        color: "from-red-500 to-pink-500"
      },
      {
        icon: BarChart3,
        title: "Analytics avancées",
        description: "Tableaux de bord détaillés sur les coûts, délais et qualité de construction",
        color: "from-violet-500 to-purple-500"
      }
    ]
  };

  const testimonials = [
    {
      name: "Aminata Sy",
      location: "Paris, France",
      project: "Villa 4 pièces à Saly",
      content: "J'ai acheté et construit ma maison depuis la France. Le suivi était parfait, j'avais l'impression d'être sur place !",
      image: "/api/YOUR_API_KEY/60/60",
      rating: 5
    },
    {
      name: "Mamadou Diop", 
      location: "New York, USA",
      project: "Terrain + Duplex à Diamniadio",
      content: "Paiements échelonnés parfaits pour mon budget. L'équipe est très professionnelle et disponible 24/7.",
      image: "/api/YOUR_API_KEY/60/60",
      rating: 5
    },
    {
      name: "Fatou Ba",
      location: "London, UK",
      project: "Villa 6 pièces à Almadies",
      content: "Les vidéos quotidiennes m'ont permis de suivre chaque détail. Ma maison est exactement comme je l'avais imaginée !",
      image: "/api/YOUR_API_KEY/60/60",
      rating: 5
    }
  ];

  const stats = [
    { number: "2.5K+", label: "Projets diaspora réalisés", icon: Home },
    { number: "45", label: "Pays couverts", icon: Globe },
    { number: "98%", label: "Projets livrés à temps", icon: Clock },
    { number: "24/7", label: "Support multilingue", icon: Headphones }
  ];

  return (
    <>
      <SEO
        title="Solutions Diaspora - Investir et Construire au Sénégal depuis l'Étranger"
        description="Solutions complètes pour la diaspora sénégalaise. Achetez des terrains, construisez à distance, suivez vos projets en temps réel. Investissez au Sénégal depuis n'importe où dans le monde."
        keywords="diaspora sénégal, investir au sénégal, construire maison sénégal, immobilier diaspora, terrain pour diaspora"
        canonicalUrl="https://www.terangafoncier.sn/diaspora"
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section Diaspora */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-20">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-16.569 13.431-30 30-30v60c-16.569 0-30-13.431-30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
                    🌍 Solutions Diaspora
                  </Badge>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                    Construisez au{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Sénégal
                    </span>
                    <br />
                    depuis l'étranger
                  </h1>
                  
                  <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                    Achetez votre terrain, construisez votre maison et suivez votre projet 
                    en temps réel, où que vous soyez dans le monde.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                  >
                    <Link to="/parcelles">
                      Voir les Terrains
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  
                  <Button 
                    asChild
                    variant="outline" 
                    size="lg"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold"
                  >
                    <Link to="/contact">
                      Consultation Gratuite
                      <Phone className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </div>

                {/* Trust Indicators Diaspora */}
                <div className="flex flex-wrap items-center gap-6 pt-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Paiements internationaux</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Suivi temps réel</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Équipe dédiée</span>
                  </div>
                </div>
              </motion.div>

              {/* Hero Visual avec Dashboard */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                  {/* Mobile Mockup */}
                  <div className="bg-gray-900 rounded-xl p-4">
                    <div className="bg-white rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Mon Projet</h3>
                        <Badge className="bg-green-500 text-white">En cours</Badge>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Construction: 65%</span>
                          <span>65/100 jours</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{width: '65%'}}></div>
                        </div>
                      </div>
                      
                      {/* Recent Updates */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded">
                          <Camera className="w-4 h-4 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-xs font-medium">Photos quotidiennes</p>
                            <p className="text-xs text-gray-500">Il y a 2h</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 p-2 bg-purple-50 rounded">
                          <Video className="w-4 h-4 text-purple-600" />
                          <div className="flex-1">
                            <p className="text-xs font-medium">Rapport hebdomadaire</p>
                            <p className="text-xs text-gray-500">Hier</p>
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
                  <Globe className="w-6 h-6" />
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-3 rounded-xl shadow-lg"
                >
                  <Monitor className="w-6 h-6" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Diaspora */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center text-white"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-blue-100 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Diaspora avec Tabs */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Nos Services Diaspora
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Une solution complète pour investir au Sénégal depuis l'étranger 
                avec un suivi professionnel à chaque étape.
              </p>
            </motion.div>

            <Tabs defaultValue="achat" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-12">
                <TabsTrigger value="achat" className="text-lg py-3">
                  🏡 Achat à Distance
                </TabsTrigger>
                <TabsTrigger value="construction" className="text-lg py-3">
                  🏗️ Construction Surveillée
                </TabsTrigger>
                <TabsTrigger value="suivi" className="text-lg py-3">
                  📱 Suivi Temps Réel
                </TabsTrigger>
              </TabsList>
              
              {Object.entries(features).map(([key, featureList]) => (
                <TabsContent key={key} value={key} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    {featureList.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                          <CardContent className="p-6">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                              <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                              {feature.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              {feature.description}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Process Steps Interactive */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Votre projet en 5 étapes simples
              </h2>
              <p className="text-xl text-gray-600">
                De l'achat à la livraison, un processus transparent et sécurisé
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`text-center cursor-pointer transition-all duration-300 ${
                    activeStep === index ? 'scale-105' : ''
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className={`relative mb-6 ${activeStep === index ? 'scale-110' : ''} transition-transform`}>
                    <div className={`w-16 h-16 ${
                      activeStep === index 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                        : 'bg-gray-300'
                    } rounded-full flex items-center justify-center mx-auto text-white transition-all duration-300`}>
                      <step.icon className="w-8 h-8" />
                    </div>
                    <div className={`absolute -top-2 -right-2 w-6 h-6 ${
                      activeStep === index ? 'bg-yellow-400' : 'bg-gray-200'
                    } rounded-full flex items-center justify-center text-xs font-bold text-gray-800 transition-all duration-300`}>
                      {index + 1}
                    </div>
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200"></div>
                    )}
                  </div>
                  <h3 className={`text-lg font-semibold mb-3 transition-colors ${
                    activeStep === index ? 'text-blue-600' : 'text-gray-900'
                  }`}>
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

        {}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                La diaspora témoigne
              </h2>
              <p className="text-xl text-gray-600">
                Des projets réussis aux quatre coins du monde
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      
                      <p className="text-gray-700 italic mb-4">"{testimonial.content}"</p>
                      
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {testimonial.project}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Diaspora */}
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
                Prêt à construire au Sénégal ?
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Rejoignez plus de 2,500 membres de la diaspora qui ont déjà 
                concrétisé leur rêve immobilier avec Teranga Foncier
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg"
                >
                  <Link to="/register">
                    Démarrer Mon Projet
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
                    Consultation Gratuite
                    <Phone className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
              
              {/* Quick Stats */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-2xl font-bold mb-1">45</h3>
                  <p className="text-sm text-blue-100">Pays couverts</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-2xl font-bold mb-1">98%</h3>
                  <p className="text-sm text-blue-100">Projets livrés</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-2xl font-bold mb-1">24/7</h3>
                  <p className="text-sm text-blue-100">Support dédié</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default DiasporaPage;

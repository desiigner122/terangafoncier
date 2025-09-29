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
  Blocks
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';
import MarketTickerBar from '@/components/home/MarketTickerBar';
import LiveMetricsBar from '@/components/home/LiveMetricsBar';
import AILiveMetricsBar from '@/components/home/AILiveMetricsBar';
import ProblemSolutionSection from '@/components/home/sections/ProblemSolutionSection';
import MarketBlockchainSection from '@/components/home/sections/MarketBlockchainSection';
import CommunalLandsPreview from '@/components/home/CommunalLandsPreview';
import SellersPreview from '@/components/home/SellersPreview';
import DiasporaPreview from '@/components/home/DiasporaPreview';
import CitiesPreview from '@/components/home/CitiesPreview';
import DashboardProcessInfo from '@/components/home/DashboardProcessInfo';

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentStat, setCurrentStat] = useState(0);

  const testimonials = [
    {
      name: "Aminata Diallo",
      role: "Diaspora - France", 
      content: "Financement bancaire approuvé en 48h et suivi construction en temps réel depuis Paris. Révolutionnaire !",
      rating: 5,
      avatar: "/api/YOUR_API_KEY/60/60"
    },
    {
      name: "Moussa Seck",
      role: "Investisseur - Dakar",
      content: "Partenariat bancaire UBA facilite tout. NFT blockchain sécurise mes investissements terrains.",
      rating: 5,
      avatar: "/api/YOUR_API_KEY/60/60"
    },
    {
      name: "Fatou Ba",
      role: "Diaspora - USA",
      content: "Crédit Agricole approuve directement sur plateforme. Photos quotidiennes de ma construction !",
      rating: 5,
      avatar: "/api/YOUR_API_KEY/60/60"
    },
    {
      name: "Ibrahim Touré",
      role: "Mairie - Thiès",
      content: "Demandes de terrains communaux simplifiées. Blockchain transparent pour tous citoyens.",
      rating: 5,
      avatar: "/api/YOUR_API_KEY/60/60"
    }
  ];

  const stats = [
    { number: "15K+", label: "Terrains disponibles", icon: MapPin, color: "text-blue-600" },
    { number: "8.2K", label: "Sénégalais connectés", icon: Users, color: "text-emerald-600" },
    { number: "12", label: "Banques partenaires", icon: CreditCard, color: "text-indigo-600" },
    { number: "95%", label: "Projets financés", icon: TrendingUp, color: "text-green-600" },
    { number: "24/7", label: "Suivi construction", icon: Shield, color: "text-purple-600" }
  ];

  const mainFeatures = [
    {
      icon: Database,
      title: "Blockchain NFT",
      description: "Vos propriétés sont tokenisées en NFT sur blockchain pour une sécurité maximale et une traçabilité totale",
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50",
      isNew: true
    },
    {
      icon: CreditCard,
      title: "Financement Bancaire",
      description: "Obtenez un crédit immobilier directement via notre plateforme avec nos banques partenaires",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      isNew: true
    },
    {
      icon: Globe,
      title: "Achat à Distance",
      description: "Achetez votre terrain au Sénégal depuis n'importe où dans le monde avec visite virtuelle 360°",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      icon: Building,
      title: "Construction Surveillée", 
      description: "Suivez votre projet de construction en temps réel avec photos quotidiennes et vidéos hebdomadaires",
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      icon: Landmark,
      title: "Terrains Communaux",
      description: "Accédez aux terrains communaux jusqu'à 70% moins chers avec processus transparent",
      color: "from-indigo-500 to-purple-500",
      bgColor: "from-indigo-50 to-purple-50",
      isNew: true
    },
    {
      icon: Lock,
      title: "Escrow Intelligent",
      description: "Transactions sécurisées par smart contracts avec libération automatique des fonds",
      color: "from-purple-500 to-pink-500", 
      bgColor: "from-purple-50 to-pink-50",
      isNew: true
    },
    {
      icon: Phone,
      title: "Support Diaspora",
      description: "Service dédié à la diaspora avec conseils personnalisés et accompagnement complet",
      color: "from-rose-500 to-red-500",
      bgColor: "from-rose-50 to-red-50"
    },
    {
      icon: Coins,
      title: "Paiement Échelonné",
      description: "Payez votre terrain en plusieurs fois avec des plans de financement flexibles",
      color: "from-amber-500 to-yellow-500",
      bgColor: "from-amber-50 to-yellow-50"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Choisissez votre terrain",
      description: "Parcourez notre catalogue de 15,000+ terrains avec photos, vidéos et visites virtuelles 360°"
    },
    {
      step: "02", 
      title: "Paiement flexible",
      description: "Payez en plusieurs fois avec notre système de prélèvement automatique sécurisé"
    },
    {
      step: "03",
      title: "Sécurisation notariale", 
      description: "Tous vos FileTexts sont traités par nos notaires partenaires certifiés"
    },
    {
      step: "04",
      title: "Suivi de construction",
      description: "Suivez votre chantier 24/7 avec photos quotidiennes et rapports d'avancement"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Helmet>
        <title>Teranga Foncier | Plateforme Blockchain Immobilière Sénégal</title>
        <meta name="description" content="La première plateforme blockchain du Sénégal pour l'immobilier sécurisé. Terrains vérifiés, transactions transparentes, construction intelligente." />
        <meta name="keywords" content="blockchain, immobilier, Sénégal, terrains, propriétés, crypto, sécurité" />
        <meta property="og:title" content="Teranga Foncier | Blockchain Immobilier Sénégal" />
        <meta property="og:description" content="Plateforme blockchain révolutionnaire pour l'immobilier sécurisé au Sénégal." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.terangafoncier.com" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Market Ticker Bar - Marché foncier entre menu et hero */}
        <MarketTickerBar />

        {/* Hero Section Simple */}
        <section className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }} 
              className="text-center max-w-4xl mx-auto"
            >
              {/* Teranga Foncier Brand */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mb-6"
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 via-green-500 to-red-500 rounded-xl flex items-center justify-center shadow-xl">
                    <Building className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 bg-clip-text text-transparent text-center sm:text-left leading-relaxed py-2">
                    Teranga Foncier
                  </h2>
                </div>
              </motion.div>

              <Badge className="mb-6 bg-gradient-to-r from-yellow-500 to-red-500 text-white border-0 px-6 py-2 text-lg shadow-lg">
                🇸🇳 Powered by Blockchain
              </Badge>
              
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-green-200 bg-clip-text text-transparent leading-tight">
                L'Immobilier Sénégalais
                <span className="block text-4xl lg:text-6xl">Réinventé</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                Investissez dans des terrains au Sénégal avec la sécurité de la blockchain, la transparence des smart contracts et l'innovation de l'IA.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white font-bold px-10 py-6 text-lg transform hover:scale-105 transition-all duration-300 shadow-2xl border-0">
                  <Link to="/terrains">Explorer les Terrains<Building className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-slate-400 text-black hover:bg-slate-800 hover:text-white backdrop-blur-sm px-8 py-6 text-lg font-semibold bg-white/90">
                  <Link to="/blockchain"><Play className="mr-2 h-5 w-5" />Voir la Blockchain</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Live Metrics Bar - Métriques IA en temps réel juste sous le hero */}
        <AILiveMetricsBar />

        {/* Market Blockchain Section */}
        <MarketBlockchainSection />

        {/* Problem & Solution Section */}
        <ProblemSolutionSection />

        {/* Aperçus Simplifiés */}
        
        {/* Construction Diaspora - Aperçu */}
        <DiasporaPreview />

        {/* Terrains Communaux - Aperçu */}
        <CommunalLandsPreview />

        {/* Vendeurs - Aperçu */}
        <SellersPreview />

        {/* Villes Populaires - Aperçu */}
        <CitiesPreview />

        {/* Information Processus Dashboard */}
        <DashboardProcessInfo />

        {}
        <section className="py-20 bg-gray-50">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-2">
                🚀 Innovation Blockchain
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
                Fonctionnalités Révolutionnaires
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Découvrez comment nous révolutionnons l'immobilier sénégalais avec la blockchain et l'IA
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {mainFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="relative group"
                >
                  <Card className="h-full p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm shadow-lg">
                    {feature.isNew && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 animate-pulse shadow-lg">
                          🆕 Nouveau
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-0">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="mt-4 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:w-full transition-all duration-300"></div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Blockchain Innovation */}
        <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 mb-4">
                🚀 Innovation Blockchain
              </Badge>
              <h2 className="text-5xl font-bold mb-6">
                Révolution <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Blockchain</span>
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Première plateforme foncière au Sénégal à intégrer la technologie blockchain pour une sécurité et transparence absolues
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
              >
                <div className="bg-yellow-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">NFT Propriétés</h3>
                <p className="text-blue-100 mb-4">
                  Chaque propriété est tokenisée en NFT unique, garantissant l'authenticité et la propriété exclusive sur la blockchain.
                </p>
                <ul className="space-y-2 text-sm text-blue-200">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Propriété 100% vérifiable</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Transfert instantané</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Valeur certifiée</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
              >
                <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Smart Contracts</h3>
                <p className="text-blue-100 mb-4">
                  Contrats intelligents automatisés qui exécutent les transactions en toute sécurité sans intermédiaire.
                </p>
                <ul className="space-y-2 text-sm text-blue-200">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Exécution automatique</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Zéro manipulation</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Transparence totale</li>
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
              >
                <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <Coins className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Escrow Décentralisé</h3>
                <p className="text-blue-100 mb-4">
                  Système d'escrow décentralisé qui protège acheteurs et vendeurs avec libération automatique des fonds.
                </p>
                <ul className="space-y-2 text-sm text-blue-200">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Fonds sécurisés</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Libération automatique</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-400" /> Zéro litige</li>
                </ul>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-white mb-4">
                  🎯 Pourquoi la Blockchain ?
                </h3>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Sécurité Absolue</h4>
                    <p className="text-yellow-100 text-sm">
                      Données immuables et chiffrées, impossibles à falsifier ou pirater
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Transparence Totale</h4>
                    <p className="text-yellow-100 text-sm">
                      Toutes les transactions sont publiques et vérifiables par tous
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Coûts Réduits</h4>
                    <p className="text-yellow-100 text-sm">
                      Élimination des intermédiaires traditionnels et frais cachés
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Accès Global</h4>
                    <p className="text-yellow-100 text-sm">
                      Investissez depuis n'importe où dans le monde, 24h/24 et 7j/7
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Nos clients témoignent
              </h2>
              <p className="text-xl text-gray-600">
                Découvrez pourquoi plus de 8000 Sénégalais nous font confiance
              </p>
            </motion.div>

            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-lg text-gray-700 mb-6 italic">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              <div className="flex items-center justify-center">
                <img 
                  src={testimonials[currentTestimonial].avatar}
                  alt={testimonials[currentTestimonial].name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </div>
            </motion.div>

            {}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-emerald-500 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section Moderne */}
        <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 relative overflow-hidden">
          {/* Background Pattern */}
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
                Prêt à investir au Sénégal ?
              </h2>
              <p className="text-xl mb-8 text-emerald-100">
                Rejoignez des milliers de Sénégalais qui construisent leur avenir 
                grâce à Teranga Foncier
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold shadow-lg"
                >
                  <Link to="/register">
                    Commencer Gratuitement
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  size="lg" 
                  className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg font-semibold bg-black/20 backdrop-blur-sm"
                >
                  <Link to="/contact">
                    Parler à un Expert
                  </Link>
                </Button>
              </div>
              
              {/* Quick Links */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">🏡 Pour Particuliers</h3>
                  <p className="text-sm text-emerald-100">Achat, construction, suivi temps réel</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">🌍 Diaspora</h3>
                  <p className="text-sm text-emerald-100">Solutions spéciales depuis l'étranger</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">🤝 Professionnels</h3>
                  <p className="text-sm text-emerald-100">Rejoignez notre réseau d'experts</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
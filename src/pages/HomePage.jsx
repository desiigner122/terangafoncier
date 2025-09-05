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
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';
import ModernHeroSlider from '@/components/home/ModernHeroSlider';
import PopularCities from '@/components/home/PopularCities';
import FeaturedParcels from '@/components/home/FeaturedParcels';
import ProblemSolutionSection from '@/components/home/sections/ProblemSolutionSection';
import DiasporaConstructionSection from '@/components/home/sections/DiasporaConstructionSection';
import CommunalLandSection from '@/components/home/sections/CommunalLandSection';

const HomePage = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentStat, setCurrentStat] = useState(0);

  const testimonials = [
    {
      name: "Aminata Diallo",
      role: "Diaspora - France", 
      content: "J'ai acheté mon terrain depuis Paris et suivi ma construction en temps réel. Incroyable !",
      rating: 5,
      avatar: "/api/placeholder/60/60"
    },
    {
      name: "Moussa Seck",
      role: "Investisseur - Dakar",
      content: "La plateforme m'a permis de diversifier mon portefeuille immobilier facilement.",
      rating: 5,
      avatar: "/api/placeholder/60/60"
    },
    {
      name: "Fatou Ba",
      role: "Diaspora - USA",
      content: "Paiements échelonnés parfaits, suivi photo quotidien. Je recommande !",
      rating: 5,
      avatar: "/api/placeholder/60/60"
    }
  ];

  const stats = [
    { number: "15K+", label: "Terrains disponibles", icon: MapPin, color: "text-blue-600" },
    { number: "8.2K", label: "Sénégalais connectés", icon: Users, color: "text-emerald-600" },
    { number: "95%", label: "Satisfaction client", icon: Star, color: "text-yellow-600" },
    { number: "24/7", label: "Support disponible", icon: Shield, color: "text-purple-600" }
  ];

  const mainFeatures = [
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
      icon: CreditCard,
      title: "Paiements Flexibles",
      description: "Paiements échelonnés de 12 à 60 mois avec prélèvement automatique sécurisé",
      color: "from-purple-500 to-indigo-500", 
      bgColor: "from-purple-50 to-indigo-50"
    },
    {
      icon: Shield,
      title: "Sécurité Totale",
      description: "Toutes vos transactions sont sécurisées par nos notaires et géomètres certifiés",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50"
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
        <title>Teranga Foncier - Votre terrain au Sénégal depuis le monde entier</title>
        <meta name="description" content="Achetez, construisez et suivez votre projet immobilier au Sénégal en toute sécurité, où que vous soyez dans le monde. Paiements échelonnés et suivi temps réel." />
        <meta property="og:title" content="Teranga Foncier - Votre terrain au Sénégal depuis le monde entier" />
        <meta property="og:description" content="La plateforme #1 pour investir dans l'immobilier sénégalais depuis l'étranger avec sécurité totale." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://www.terangafoncier.com" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Modern Hero Slider */}
        <ModernHeroSlider />

        {/* Stats rapides */}
        <section className="py-12 bg-gray-50 border-b">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Section Problèmes/Solutions */}
        <ProblemSolutionSection />

        {/* Villes Populaires */}
        <PopularCities />

        {/* Section Demandes Communales */}
        <CommunalLandSection />

        {/* Section Diaspora Construction */}
        <DiasporaConstructionSection />

        {/* Terrains en Vedette */}
        <FeaturedParcels />

        {/* Testimonials Dynamiques */}
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

            {/* Testimonial Indicators */}
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
                  className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg font-semibold"
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
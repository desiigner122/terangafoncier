import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle, 
  Globe, 
  Smartphone, 
  TrendingUp, 
  Users, 
  Shield, 
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
  ChevronLeft,
  ChevronRight,
  Play,
  Star,
  Banknote,
  Camera,
  FileCheck,
  MessageSquare,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const ModernHeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      title: "Achetez Votre Terrain au Sénégal",
      subtitle: "Depuis N'importe Où Dans le Monde",
      description: "La première plateforme sécurisée pour acheter, vérifier et suivre votre investissement foncier au Sénégal en toute confiance.",
      features: [
        { icon: Shield, text: "Vérification notariale" },
        { icon: Globe, text: "Accessible 24/7 depuis l'étranger" },
        { icon: CreditCard, text: "Paiements sécurisés et échelonnés" },
        { icon: Eye, text: "Suivi en temps réel" }
      ],
      primaryAction: {
        text: "Découvrir les Terrains",
        href: "/parcelles",
        icon: ArrowRight
      },
      secondaryAction: {
        text: "Comment ça Marche",
        href: "/how-it-works",
        icon: Play
      },
      bgGradient: "from-emerald-600 via-teal-600 to-blue-600",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    },
    {
      id: 2,
      title: "Construction à Distance",
      subtitle: "Pilotez Vos Travaux Depuis l'Étranger",
      description: "Suivez en temps réel la construction de votre maison au Sénégal avec des rapports photo/vidéo quotidiens et un suivi professionnel.",
      features: [
        { icon: Camera, text: "Rapports photo/vidéo quotidiens" },
        { icon: Users, text: "Équipe de construction certifiée" },
        { icon: Smartphone, text: "App mobile dédiée" },
        { icon: MessageSquare, text: "Support direct avec l'équipe" }
      ],
      primaryAction: {
        text: "Lancer Mon Projet",
        href: "/solutions/construction-distance",
        icon: Home
      },
      secondaryAction: {
        text: "Voir les Réalisations",
        href: "/portfolio",
        icon: Eye
      },
      bgGradient: "from-blue-600 via-purple-600 to-pink-600",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    },
    {
      id: 3,
      title: "Demandes Communales",
      subtitle: "Terrains Municipaux Disponibles",
      description: "Accédez aux terrains mis à disposition par les municipalités sénégalaises. Process transparent et prix préférentiels.",
      features: [
        { icon: Landmark, text: "Partenariat avec les mairies" },
        { icon: FileCheck, text: "Documents officiels garantis" },
        { icon: Banknote, text: "Prix préférentiels" },
        { icon: Target, text: "Zones stratégiques" }
      ],
      primaryAction: {
        text: "Voir les Villes",
        href: "/villes",
        icon: MapPin
      },
      secondaryAction: {
        text: "Faire une Demande",
        href: "/demande-communale",
        icon: FileCheck
      },
      bgGradient: "from-orange-500 via-red-500 to-pink-500",
      image: "https://images.unsplash.com/photo-1590736969955-71cc94901144?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
    },
    {
      id: 4,
      title: "Solutions Professionnelles",
      subtitle: "Pour Banques, Promoteurs & Investisseurs",
      description: "Outils d'analyse, évaluation des risques, et tableau de bord pour optimiser vos investissements immobiliers au Sénégal.",
      features: [
        { icon: TrendingUp, text: "Analytics avancées" },
        { icon: Shield, text: "Évaluation des risques" },
        { icon: Briefcase, text: "Gestion de portefeuille" },
        { icon: Award, text: "Support premium" }
      ],
      primaryAction: {
        text: "Découvrir les Solutions",
        href: "/solutions",
        icon: Briefcase
      },
      secondaryAction: {
        text: "Demander une Démo",
        href: "/contact",
        icon: Phone
      },
      bgGradient: "from-gray-800 via-gray-900 to-black",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2326&q=80"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].bgGradient} opacity-85`} />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                
                {/* Left Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-white"
                >
                  <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    ✨ Nouveau
                  </Badge>
                  
                  <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                    {slides[currentSlide].title}
                  </h1>
                  
                  <h2 className="text-xl lg:text-2xl font-medium mb-6 text-white/90">
                    {slides[currentSlide].subtitle}
                  </h2>
                  
                  <p className="text-lg mb-8 text-white/80 max-w-2xl">
                    {slides[currentSlide].description}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {slides[currentSlide].features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          <feature.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm text-white/90">{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Button 
                      asChild 
                      size="lg" 
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 px-8 py-4 text-lg font-semibold border-0"
                    >
                      <Link to={slides[currentSlide].primaryAction.href}>
                        {slides[currentSlide].primaryAction.text}
                        {React.createElement(slides[currentSlide].primaryAction.icon, { className: "ml-2 h-5 w-5" })}
                      </Link>
                    </Button>
                    
                    <Button 
                      asChild 
                      variant="outline" 
                      size="lg"
                      className="border-white/30 text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm px-8 py-4 text-lg font-semibold"
                    >
                      <Link to={slides[currentSlide].secondaryAction.href}>
                        {React.createElement(slides[currentSlide].secondaryAction.icon, { className: "mr-2 h-5 w-5" })}
                        {slides[currentSlide].secondaryAction.text}
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Right Content - Stats/Visual */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="hidden lg:block"
                >
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                    <CardContent className="p-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold mb-2">2,500+</div>
                          <div className="text-sm text-white/80">Clients Satisfaits</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold mb-2">98%</div>
                          <div className="text-sm text-white/80">Taux de Satisfaction</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold mb-2">24/7</div>
                          <div className="text-sm text-white/80">Support Premium</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold mb-2">50+</div>
                          <div className="text-sm text-white/80">Projets Livrés</div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t border-white/20">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-white/90">4.9/5 - 1,200+ avis</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-4">
          {/* Prev/Next Buttons */}
          <button
            onClick={prevSlide}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Auto-play Indicator */}
      <div className="absolute top-8 right-8 z-20">
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          {isAutoPlaying ? <Zap className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
      </div>
    </section>
  );
};

export default ModernHeroSlider;

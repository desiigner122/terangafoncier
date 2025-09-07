import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, ArrowRight, Users, Building2, Hammer, Blocks, Globe, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const BinanceStyleHeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      title: "288,067,087 Utilisateurs nous font confiance",
      subtitle: "La plateforme foncière blockchain #1 au Sénégal",
      description: "Achetez, vendez et construisez en toute sécurité avec la technologie blockchain et l'intelligence artificielle",
      primaryAction: { text: "Commencer", href: "/register" },
      secondaryAction: { text: "Voir les terrains", href: "/terrains" },
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      stats: [
        { label: "Transactions sécurisées", value: "2.4B FCFA" },
        { label: "Utilisateurs actifs", value: "8,200+" },
        { label: "Projets surveillés", value: "456" }
      ],
      gradient: "from-blue-600 via-purple-600 to-blue-800"
    },
    {
      id: 2,
      title: "Nouvelle section: Projets & Demandes",
      subtitle: "Connectez-vous avec les meilleurs promoteurs",
      description: "Découvrez nos projets immobiliers blockchain et soumettez vos demandes de construction",
      primaryAction: { text: "Voir les projets", href: "/promoters-projects" },
      secondaryAction: { text: "Faire une demande", href: "/promoter-requests" },
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      stats: [
        { label: "Projets disponibles", value: "125" },
        { label: "Promoteurs certifiés", value: "45" },
        { label: "Demandes traitées", value: "1,200+" }
      ],
      gradient: "from-emerald-600 via-teal-600 to-emerald-800",
      isNew: true
    },
    {
      id: 3,
      title: "Construction suivie par IA",
      subtitle: "Surveillance satellite en temps réel",
      description: "Suivez l'avancement de votre construction avec photos quotidiennes et rapports automatisés",
      primaryAction: { text: "En savoir plus", href: "/guide-projets" },
      secondaryAction: { text: "Voir démo", href: "#demo" },
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      stats: [
        { label: "Précision IA", value: "97.8%" },
        { label: "Projets suivis", value: "456" },
        { label: "Rapports générés", value: "12,000+" }
      ],
      gradient: "from-purple-600 via-pink-600 to-purple-800"
    },
    {
      id: 4,
      title: "NFT Propriétés & Smart Contracts",
      subtitle: "Révolution blockchain immobilière",
      description: "Chaque propriété tokenisée en NFT avec contrats intelligents pour paiements automatisés",
      primaryAction: { text: "Explorer NFT", href: "/nft-properties" },
      secondaryAction: { text: "Smart contracts", href: "/smart-contracts" },
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      stats: [
        { label: "NFT créés", value: "2,847" },
        { label: "Smart contracts", value: "892" },
        { label: "Sécurité", value: "100%" }
      ],
      gradient: "from-orange-600 via-red-600 to-orange-800"
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8 }}
          className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient}`}
        >
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
          <div className="absolute inset-0 bg-black/40" />

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">
              {/* Left Content */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-white space-y-6"
              >
                {slides[currentSlide].isNew && (
                  <Badge variant="secondary" className="bg-yellow-500 text-black mb-4">
                    <Blocks className="w-3 h-3 mr-1" />
                    Nouveau
                  </Badge>
                )}
                
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  {slides[currentSlide].title}
                </h1>
                
                <h2 className="text-xl md:text-2xl font-medium text-gray-200">
                  {slides[currentSlide].subtitle}
                </h2>
                
                <p className="text-lg text-gray-300 max-w-xl">
                  {slides[currentSlide].description}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    size="lg" 
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold text-lg px-8 py-4 h-auto"
                    asChild
                  >
                    <Link to={slides[currentSlide].primaryAction.href}>
                      {slides[currentSlide].primaryAction.text}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-gray-900 font-semibold text-lg px-8 py-4 h-auto"
                    asChild
                  >
                    <Link to={slides[currentSlide].secondaryAction.href}>
                      {slides[currentSlide].secondaryAction.text}
                    </Link>
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-6">
                  {slides[currentSlide].stats.map((stat, index) => (
                    <div key={index} className="text-center lg:text-left">
                      <div className="text-2xl font-bold text-yellow-400">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-300">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right Content - Visual */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="hidden lg:flex justify-center items-center"
              >
                <div className="relative">
                  <div className="w-96 h-96 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-80 h-80 rounded-full bg-gradient-to-br from-yellow-400/30 to-orange-500/30 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        {currentSlide === 0 && <Users className="w-20 h-20 text-yellow-400 mx-auto" />}
                        {currentSlide === 1 && <Building2 className="w-20 h-20 text-yellow-400 mx-auto" />}
                        {currentSlide === 2 && <Hammer className="w-20 h-20 text-yellow-400 mx-auto" />}
                        {currentSlide === 3 && <Blocks className="w-20 h-20 text-yellow-400 mx-auto" />}
                        <div className="text-white text-center">
                          <div className="text-3xl font-bold">{slides[currentSlide].stats[0].value}</div>
                          <div className="text-sm opacity-80">{slides[currentSlide].stats[0].label}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        {/* Dots Indicator */}
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-yellow-400 scale-125' : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-all duration-200 flex items-center justify-center"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-all duration-200 flex items-center justify-center"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default BinanceStyleHeroSlider;

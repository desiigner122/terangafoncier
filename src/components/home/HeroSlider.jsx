import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Users, 
  Award, 
  Shield,
  TrendingUp,
  Star,
  Camera,
  Play
} from 'lucide-react';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Votre terrain au Sénégal depuis le monde entier",
      subtitle: "Achetez, construisez et suivez votre projet immobilier en temps réel",
      description: "La première plateforme digitale sécurisée pour investir dans le foncier sénégalais. Construction à distance avec suivi live.",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      cta: "Découvrir les Terrains",
      ctaLink: "/parcelles",
      badge: "🌍 Diaspora",
      features: ["Suivi Temps Réel", "Paiement Échelonné", "Garantie Anti-Fraude"]
    },
    {
      id: 2,
      title: "Terrains Intelligents avec Options de Paiement",
      subtitle: "Achat direct, financement bancaire ou paiements échelonnés",
      description: "Découvrez notre nouveau système de terrains intelligents avec plusieurs options de financement adaptées à vos besoins.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      cta: "Voir Terrain Exemple",
      ctaLink: "/terrain-intelligent/TF-2024-001",
      badge: "✨ Nouveau",
      features: ["3 Options de Paiement", "Simulation Instantanée", "Support Bancaire"]
    },
    {
      id: 3,
      title: "Demandes de Terrains Communaux",
      subtitle: "Accédez aux terrains des mairies partenaires",
      description: "Soumettez vos demandes directement aux mairies pour des parcelles spécifiques dans les zones d'extension urbaine.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      cta: "Explorer les Villes",
      ctaLink: "/villes-partenaires",
      badge: "🏛️ Officiel",
      features: ["Accès Direct Mairies", "Prix Préférentiels", "Procédures Simplifiées"]
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[70vh] min-h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Image de fond */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          
          {/* Contenu */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <Badge variant="secondary" className="mb-4 bg-primary/20 text-primary border-primary/30">
                    {slides[currentSlide].badge}
                  </Badge>
                  
                  <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    {slides[currentSlide].title}
                  </h1>
                  
                  <h2 className="text-xl lg:text-2xl text-gray-200 mb-6 font-medium">
                    {slides[currentSlide].subtitle}
                  </h2>
                  
                  <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                    {slides[currentSlide].description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {slides[currentSlide].features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-white text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
                      <Link to={slides[currentSlide].ctaLink}>
                        {slides[currentSlide].cta}
                      </Link>
                    </Button>
                    
                    <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                      <Play className="h-4 w-4 mr-2" />
                      Voir la Démo
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-primary scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Stats overlay */}
      <div className="absolute bottom-8 right-8 hidden lg:block">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">2,500+</div>
              <div className="text-xs text-gray-300">Terrains Vérifiés</div>
            </div>
            <div>
              <div className="text-2xl font-bold">1,200+</div>
              <div className="text-xs text-gray-300">Clients Satisfaits</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;

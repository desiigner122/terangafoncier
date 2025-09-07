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
  Pause,
  Star,
  Banknote,
  Camera,
  FileCheck,
  MessageSquare,
  Briefcase,
  Coins,
  Database,
  Lock,
  Blocks
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
      title: "Terrains Sécurisés par Blockchain",
      subtitle: "La Révolution Foncière au Sénégal",
      description: "Investissez dans des terrains authentifiés par la technologie blockchain. Chaque titre est vérifié, sécurisé et inaltérable.",
      features: [
        { icon: Blocks, text: "Vérification Blockchain", color: "text-blue-400" },
        { icon: Shield, text: "Titres Inaltérables", color: "text-green-400" },
        { icon: Globe, text: "Investissement depuis l'Étranger", color: "text-purple-400" }
      ],
      cta: { text: "Explorer les Terrains", link: "/terrains", color: "bg-gradient-to-r from-blue-600 to-purple-600" },
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
      bgGradient: "from-blue-900 via-purple-900 to-blue-900",
      stats: [
        { label: "Terrains Vérifiés", value: "2,847", icon: CheckCircle },
        { label: "Hash Blockchain", value: "156K+", icon: Database },
        { label: "Investisseurs", value: "1,200+", icon: Users }
      ]
    },
    {
      id: 2,
      title: "Demandes de Terrains Communaux",
      subtitle: "Processus Numérisé et Transparent",
      description: "Demandez des terrains communaux directement en ligne. Suivi en temps réel de votre dossier avec les mairies partenaires.",
      features: [
        { icon: Landmark, text: "Mairies Partenaires", color: "text-emerald-400" },
        { icon: FileCheck, text: "Dossiers Numériques", color: "text-blue-400" },
        { icon: Clock, text: "Suivi en Temps Réel", color: "text-orange-400" }
      ],
      cta: { text: "Faire une Demande", link: "/demande-terrain-communal", color: "bg-gradient-to-r from-emerald-600 to-teal-600" },
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
      bgGradient: "from-emerald-900 via-teal-900 to-emerald-900",
      stats: [
        { label: "Mairies Connectées", value: "45", icon: Building },
        { label: "Demandes Traitées", value: "3,200+", icon: FileCheck },
        { label: "Délai Moyen", value: "21 jours", icon: Clock }
      ]
    },
    {
      id: 3,
      title: "Smart Contracts Immobiliers",
      subtitle: "Achat Automatisé et Sécurisé",
      description: "Utilisez les contrats intelligents pour automatiser vos achats. Paiements échelonnés, conditions vérifiées automatiquement.",
      features: [
        { icon: Coins, text: "Paiements Automatiques", color: "text-yellow-400" },
        { icon: Lock, text: "Escrow Décentralisé", color: "text-red-400" },
        { icon: Zap, text: "Exécution Instantanée", color: "text-cyan-400" }
      ],
      cta: { text: "Découvrir les Smart Contracts", link: "/smart-contracts", color: "bg-gradient-to-r from-yellow-600 to-orange-600" },
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
      bgGradient: "from-yellow-900 via-orange-900 to-yellow-900",
      stats: [
        { label: "Contrats Actifs", value: "892", icon: Coins },
        { label: "Fonds Sécurisés", value: "2.4B CFA", icon: Lock },
        { label: "Transactions", value: "5,600+", icon: Zap }
      ]
    },
    {
      id: 4,
      title: "Suivi de Construction Intelligent",
      subtitle: "IA et Satellite pour la Diaspora",
      description: "Suivez votre construction depuis l'étranger avec l'IA et l'imagerie satellite. Rapports automatiques et alertes en temps réel.",
      features: [
        { icon: Camera, text: "Surveillance Satellite", color: "text-indigo-400" },
        { icon: TrendingUp, text: "Analyse IA des Progrès", color: "text-pink-400" },
        { icon: MessageSquare, text: "Rapports Automatiques", color: "text-cyan-400" }
      ],
      cta: { text: "Voir la Démonstration", link: "/solutions/diaspora", color: "bg-gradient-to-r from-indigo-600 to-pink-600" },
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop",
      bgGradient: "from-indigo-900 via-pink-900 to-indigo-900",
      stats: [
        { label: "Projets Surveillés", value: "456", icon: Camera },
        { label: "Images/Jour", value: "2,400+", icon: Eye },
        { label: "Précision IA", value: "97.8%", icon: Target }
      ]
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 bg-gradient-to-br ${currentSlideData.bgGradient}`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={currentSlideData.image}
              alt={currentSlideData.title}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Blockchain Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="border border-white/20 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <Blocks className="w-4 h-4 text-white/30" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Content */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-white"
                >
                  <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-sm">
                    {currentSlideData.subtitle}
                  </Badge>
                  
                  <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    {currentSlideData.title}
                  </h1>
                  
                  <p className="text-xl mb-8 text-gray-200 leading-relaxed">
                    {currentSlideData.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {currentSlideData.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className={`p-2 rounded-lg bg-white/10 backdrop-blur-sm ${feature.color || 'text-white'}`}>
                          <feature.icon className="w-5 h-5" />
                        </div>
                        <span className="text-lg font-medium">{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <Link to={currentSlideData.cta.link}>
                      <Button 
                        size="lg" 
                        className={`${currentSlideData.cta.color} text-white border-0 hover:scale-105 transition-transform duration-300 shadow-2xl`}
                      >
                        {currentSlideData.cta.text}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Right Column - Stats */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="space-y-6"
                >
                  {currentSlideData.stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    >
                      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-white/20">
                              <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="text-3xl font-bold">{stat.value}</div>
                              <div className="text-gray-300">{stat.label}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-125' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Auto-play Control */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="absolute top-8 right-8 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ModernHeroSlider;

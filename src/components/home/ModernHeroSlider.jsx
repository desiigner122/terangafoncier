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
import { supabase } from '@/lib/supabaseClient';

const ModernHeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [platformStats, setPlatformStats] = useState({
    verifiedProperties: 0,
    blockchainHashes: 0,
    registeredUsers: 0,
    communalRequests: 0,
    smartContracts: 0,
    blockchainTransactions: 0,
    constructionProjects: 0,
    reviewsCount: 0,
    averageRating: 0
  });

  useEffect(() => {
    const loadPlatformStats = async () => {
      try {
        const [
          verifiedRes,
          hashRes,
          usersRes,
          communalRes,
          contractsRes,
          txRes,
          constructionRes,
          reviewsRes
        ] = await Promise.all([
          supabase.from('properties').select('id', { count: 'exact', head: true }).eq('verification_status', 'verified'),
          supabase.from('properties').select('id', { count: 'exact', head: true }).not('blockchain_hash', 'is', null),
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('communal_requests').select('id', { count: 'exact', head: true }),
          supabase.from('properties').select('id', { count: 'exact', head: true }).not('smart_contract_address', 'is', null),
          supabase.from('blockchain_transactions').select('id', { count: 'exact', head: true }),
          supabase.from('construction_requests').select('id', { count: 'exact', head: true }),
          supabase.from('reviews').select('rating')
        ]);

        const ratings = (reviewsRes.data || []).map((r) => r.rating).filter((r) => typeof r === 'number');
        const averageRating = ratings.length > 0
          ? Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10) / 10
          : 0;

        setPlatformStats({
          verifiedProperties: verifiedRes.count || 0,
          blockchainHashes: hashRes.count || 0,
          registeredUsers: usersRes.count || 0,
          communalRequests: communalRes.count || 0,
          smartContracts: contractsRes.count || 0,
          blockchainTransactions: txRes.count || 0,
          constructionProjects: constructionRes.count || 0,
          reviewsCount: ratings.length,
          averageRating
        });
      } catch (error) {
        console.error('Erreur chargement statistiques plateforme:', error);
      }
    };

    loadPlatformStats();
  }, []);

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
        { label: "Terrains Vérifiés", value: platformStats.verifiedProperties.toLocaleString('fr-FR'), icon: CheckCircle },
        { label: "Hash Blockchain", value: platformStats.blockchainHashes.toLocaleString('fr-FR'), icon: Database },
        { label: "Investisseurs", value: platformStats.registeredUsers.toLocaleString('fr-FR'), icon: Users }
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
        { label: "Demandes Traitées", value: platformStats.communalRequests.toLocaleString('fr-FR'), icon: FileCheck }
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
        { label: "Contrats Actifs", value: platformStats.smartContracts.toLocaleString('fr-FR'), icon: Coins },
        { label: "Transactions", value: platformStats.blockchainTransactions.toLocaleString('fr-FR'), icon: Zap }
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
        { label: "Projets Surveillés", value: platformStats.constructionProjects.toLocaleString('fr-FR'), icon: Camera }
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
                          <div className="text-3xl font-bold mb-2">{platformStats.registeredUsers.toLocaleString('fr-FR')}</div>
                          <div className="text-sm text-white/80">Clients Inscrits</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold mb-2">{platformStats.verifiedProperties.toLocaleString('fr-FR')}</div>
                          <div className="text-sm text-white/80">Terrains Vérifiés</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold mb-2">{platformStats.constructionProjects.toLocaleString('fr-FR')}</div>
                          <div className="text-sm text-white/80">Projets Diaspora</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold mb-2">{platformStats.reviewsCount.toLocaleString('fr-FR')}</div>
                          <div className="text-sm text-white/80">Avis Clients</div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-white/20">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.round(platformStats.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}`}
                              />
                            ))}
                          </div>
                          <span className="text-white/90">
                            {platformStats.reviewsCount > 0
                              ? `${platformStats.averageRating}/5 - ${platformStats.reviewsCount.toLocaleString('fr-FR')} avis`
                              : 'Pas encore d\'avis'}
                          </span>
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

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  BarChart3, 
  Zap, 
  Shield, 
  Eye,
  Target,
  Globe,
  Activity,
  Layers,
  Cpu,
  Database,
  Network,
  Bot,
  BarChart3 as ChartBar,
  PieChart,
  LineChart,
  DollarSign,
  MapPin,
  Building,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Headphones
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AILiveMetricsBar from '@/components/home/AILiveMetricsBar';
import AIChatbot from '@/components/chat/AIChatbot';

const TerangaAIPage = () => {
  const [selectedFeature, setSelectedFeature] = useState('market-analysis');
  const [animationState, setAnimationState] = useState('idle');
  const navigate = useNavigate();

  useEffect(() => {
    // Animation de démonstration
    const interval = setInterval(() => {
      setAnimationState(prev => prev === 'idle' ? 'analyzing' : 'idle');
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const aiFeatures = [
    {
      id: 'market-analysis',
      title: 'Analyse de Marché IA',
      description: 'Intelligence artificielle avancée pour analyser les tendances immobilières en temps réel',
      icon: BarChart3,
      color: 'cyan',
      features: [
        'Analyse prédictive des prix',
        'Détection des tendances émergentes',
        'Évaluation automatique des zones',
        'Rapports intelligents personnalisés'
      ],
      metrics: {
        precision: '94.2%',
        speed: '0.3s',
        data: '50k+ points analysés/jour'
      }
    },
    {
      id: 'blockchain-analytics',
      title: 'Analytics Blockchain',
      description: 'Surveillance et analyse des transactions blockchain pour la transparence totale',
      icon: Zap,
      color: 'blue',
      features: [
        'Monitoring temps réel des transactions',
        'Analyse des smart contracts',
        'Métriques de performance réseau',
        'Sécurité et auditabilité'
      ],
      metrics: {
        transactions: '15,247',
        uptime: '99.97%',
        security: '98.5%'
      }
    },
    {
      id: 'predictive-pricing',
      title: 'Prédictions de Prix',
      description: 'Modèles d\'apprentissage automatique pour prédire l\'évolution des prix immobiliers',
      icon: TrendingUp,
      color: 'green',
      features: [
        'Prédictions à court et long terme',
        'Facteurs d\'influence identifiés',
        'Scénarios multiples',
        'Alertes de variations importantes'
      ],
      metrics: {
        accuracy: '91.8%',
        horizon: '12 mois',
        update: 'Temps réel'
      }
    },
    {
      id: 'smart-recommendations',
      title: 'Recommandations Intelligentes',
      description: 'Système de recommandation personnalisé basé sur vos préférences et le marché',
      icon: Target,
      color: 'purple',
      features: [
        'Profiling utilisateur avancé',
        'Recommandations contextuelles',
        'Optimisation de portefeuille',
        'Alertes d\'opportunités'
      ],
      metrics: {
        satisfaction: '96.3%',
        opportunities: '23 détectées',
        match: '89.7%'
      }
    },
    {
      id: 'risk-assessment',
      title: 'Évaluation des Risques',
      description: 'Intelligence artificielle pour identifier et quantifier les risques d\'investissement',
      icon: Shield,
      color: 'orange',
      features: [
        'Analyse multi-factorielle',
        'Score de risque dynamique',
        'Monitoring continu',
        'Stratégies de mitigation'
      ],
      metrics: {
        factors: '25+ analysés',
        detection: '98.1%',
        prevention: '92.4%'
      }
    },
    {
      id: 'automated-monitoring',
      title: 'Surveillance Automatisée',
      description: 'Monitoring 24/7 de vos investissements avec alertes intelligentes',
      icon: Eye,
      color: 'pink',
      features: [
        'Surveillance 24/7',
        'Alertes intelligentes',
        'Rapports automatiques',
        'Détection d\'anomalies'
      ],
      metrics: {
        monitoring: '24/7',
        response: '<1min',
        accuracy: '97.8%'
      }
    }
  ];

  const aiCapabilities = [
    {
      title: 'Deep Learning',
      description: 'Réseaux de neurones profonds pour l\'analyse prédictive',
      icon: Brain,
      color: 'text-cyan-400'
    },
    {
      title: 'Natural Language Processing',
      description: 'Compréhension et traitement du langage naturel',
      icon: Bot,
      color: 'text-blue-400'
    },
    {
      title: 'Computer Vision',
      description: 'Analyse automatique d\'images et de documents',
      icon: Eye,
      color: 'text-green-400'
    },
    {
      title: 'Real-time Analytics',
      description: 'Traitement et analyse en temps réel des données',
      icon: Activity,
      color: 'text-purple-400'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      cyan: {
        bg: 'bg-cyan-500/20',
        text: 'text-cyan-400',
        border: 'border-cyan-500/30',
        gradient: 'from-cyan-500 to-blue-600'
      },
      blue: {
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        gradient: 'from-blue-500 to-indigo-600'
      },
      green: {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        border: 'border-green-500/30',
        gradient: 'from-green-500 to-emerald-600'
      },
      purple: {
        bg: 'bg-purple-500/20',
        text: 'text-purple-400',
        border: 'border-purple-500/30',
        gradient: 'from-purple-500 to-pink-600'
      },
      orange: {
        bg: 'bg-orange-500/20',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        gradient: 'from-orange-500 to-red-600'
      },
      pink: {
        bg: 'bg-pink-500/20',
        text: 'text-pink-400',
        border: 'border-pink-500/30',
        gradient: 'from-pink-500 to-rose-600'
      }
    };
    return colorMap[color] || colorMap.cyan;
  };

  const selectedFeatureData = aiFeatures.find(f => f.id === selectedFeature);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec métriques IA en temps réel */}
      <AILiveMetricsBar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-cyan-500/20 rounded-xl">
                  <Brain className="h-8 w-8 text-cyan-400" />
                </div>
                <span className="text-cyan-400 font-semibold text-lg">Teranga AI</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Intelligence Artificielle
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  + Blockchain
                </span>
                <span className="block text-3xl lg:text-4xl text-gray-300">
                  pour l'Immobilier
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Révolutionnez vos investissements immobiliers avec notre technologie d'IA de pointe 
                combinée à la sécurité blockchain. Analyses prédictives, recommandations intelligentes 
                et monitoring 24/7.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold hover:scale-105 transition-transform duration-200 flex items-center gap-3"
                >
                  <Sparkles className="h-5 w-5" />
                  Découvrir l'IA
                  <ArrowRight className="h-5 w-5" />
                </button>
                
                <button className="px-8 py-4 border border-gray-600 rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center gap-3">
                  <Activity className="h-5 w-5" />
                  Voir la Démo
                </button>
              </div>
            </motion.div>

            {/* Visualisation IA interactive */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-96 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl border border-cyan-500/20 overflow-hidden">
                {/* Simulation du cerveau IA */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={animationState === 'analyzing' ? { scale: [1, 1.1, 1], rotate: [0, 180, 360] } : {}}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="relative"
                  >
                    <Brain className="h-32 w-32 text-cyan-400" />
                    
                    {/* Particules d'analyse */}
                    {animationState === 'analyzing' && (
                      <>
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{
                              scale: [0, 1, 0],
                              x: [0, Math.cos(i * Math.PI / 4) * 60],
                              y: [0, Math.sin(i * Math.PI / 4) * 60]
                            }}
                            transition={{ duration: 1.5, delay: i * 0.1 }}
                            style={{
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)'
                            }}
                          />
                        ))}
                      </>
                    )}
                  </motion.div>
                </div>

                {/* Métriques flottantes */}
                <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-400 mb-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold">IA Active</span>
                  </div>
                  <div className="text-xs text-gray-300">Précision: 94.2%</div>
                </div>

                <div className="absolute bottom-4 right-4 bg-black/30 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-sm font-semibold text-cyan-400">15,247</div>
                  <div className="text-xs text-gray-300">Transactions analysées</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités IA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <Cpu className="h-8 w-8 text-cyan-500" />
              <h2 className="text-4xl font-bold text-gray-900">
                Fonctionnalités IA Avancées
              </h2>
            </motion.div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez comment notre intelligence artificielle révolutionne 
              l'analyse et la gestion immobilière au Sénégal
            </p>
          </div>

          {/* Sélecteur de fonctionnalités */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {aiFeatures.map((feature) => {
              const IconComponent = feature.icon;
              const colors = getColorClasses(feature.color);
              
              return (
                <motion.div
                  key={feature.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFeature(feature.id)}
                  className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 ${
                    selectedFeature === feature.id 
                      ? `${colors.border} ${colors.bg} shadow-lg` 
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className={`p-3 rounded-lg mb-4 w-fit ${colors.bg}`}>
                    <IconComponent className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                  
                  {selectedFeature === feature.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 pt-4 border-t border-gray-200"
                    >
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {Object.entries(feature.metrics).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className={`font-bold ${colors.text}`}>{value}</div>
                            <div className="text-xs text-gray-500 capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Détails de la fonctionnalité sélectionnée */}
          {selectedFeatureData && (
            <motion.div
              key={selectedFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-r from-gray-900 to-slate-800 rounded-2xl p-8 text-white"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-r ${getColorClasses(selectedFeatureData.color).gradient}`}>
                      <selectedFeatureData.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{selectedFeatureData.title}</h3>
                      <p className="text-gray-300">{selectedFeatureData.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {selectedFeatureData.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Visualisation des métriques */}
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(selectedFeatureData.metrics).map(([key, value], index) => (
                      <motion.div
                        key={key}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center p-4 bg-white/10 rounded-xl backdrop-blur-sm"
                      >
                        <div className="text-2xl font-bold text-cyan-400">{value}</div>
                        <div className="text-sm text-gray-300 capitalize">{key}</div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="p-6 bg-white/5 rounded-xl backdrop-blur-sm">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-cyan-400" />
                      Performance en Temps Réel
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Précision</span>
                        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                            initial={{ width: 0 }}
                            animate={{ width: '94%' }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Vitesse</span>
                        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: '98%' }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Fiabilité</span>
                        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-purple-400 to-pink-500"
                            initial={{ width: 0 }}
                            animate={{ width: '96%' }}
                            transition={{ duration: 1, delay: 0.4 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Section Capacités IA */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Technologies IA de Pointe
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nos algorithmes d'intelligence artificielle utilisent les dernières avancées 
              en machine learning et deep learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiCapabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">
                  <capability.icon className={`h-12 w-12 ${capability.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {capability.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {capability.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Brain className="h-16 w-16 mx-auto mb-6 text-cyan-200" />
            <h2 className="text-4xl font-bold mb-6">
              Prêt à Révolutionner vos Investissements ?
            </h2>
            <p className="text-xl mb-8 text-cyan-100">
              Rejoignez les investisseurs qui utilisent déjà l'IA et la blockchain 
              pour maximiser leurs rendements immobiliers
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-white text-cyan-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-3 justify-center"
              >
                <Sparkles className="h-5 w-5" />
                Commencer Gratuitement
              </button>
              
              <button className="px-8 py-4 border-2 border-white rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center gap-3 justify-center">
                <Headphones className="h-5 w-5" />
                Parler à un Expert
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Chatbot IA */}
      <AIChatbot />
    </div>
  );
};

export default TerangaAIPage;

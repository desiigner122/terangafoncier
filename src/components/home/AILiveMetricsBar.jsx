import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Building, 
  Hammer, 
  Clock, 
  Eye,
  TrendingUp,
  Users,
  CheckCircle,
  Calendar,
  Target,
  Brain,
  BarChart3,
  Zap,
  Shield,
  Globe,
  AlertTriangle,
  Activity,
  DollarSign
} from 'lucide-react';
import StatsService from '../../services/StatsService';

const AILiveMetricsBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({ verifiedProperties: 0, totalProperties: 0, regions: 0, articles: 0, reviews: 0, avgRating: null });

  // Horloge + chargement des vrais compteurs plateforme
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    let active = true;
    StatsService.getPlatformStats().then(({ stats: s }) => {
      if (active) setStats(s);
    });

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  // Métriques : compteurs réels Supabase là où c'est disponible,
  // valeurs indicatives statiques ailleurs (plus de données générées aléatoirement).
  const satisfaction = stats.avgRating ? `${stats.avgRating}/5` : '—';
  const aiMetrics = [
    {
      label: "Terrains Vérifiés",
      value: `${stats.verifiedProperties}`,
      subtext: "Vérification documentaire complète",
      trend: "Données réelles",
      icon: Brain,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
      pulse: true,
      category: "ai"
    },
    {
      label: "Terrains Répertoriés",
      value: `${stats.totalProperties}`,
      subtext: "Total des biens sur la plateforme",
      trend: "Données réelles",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      pulse: false,
      category: "prediction"
    },
    {
      label: "Régions Couvertes",
      value: `${stats.regions}`,
      subtext: "Zones géographiques actives",
      trend: "Sénégal",
      icon: Globe,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      pulse: false,
      category: "sentiment"
    },
    {
      label: "Satisfaction Clients",
      value: satisfaction,
      subtext: `${stats.reviews} avis vérifiés`,
      trend: "Avis clients",
      icon: BarChart3,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      pulse: false,
      category: "blockchain"
    },
    {
      label: "Articles & Guides",
      value: `${stats.articles}`,
      subtext: "Contenus experts publiés",
      trend: "Blog Teranga",
      icon: Shield,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      pulse: false,
      category: "smart_contracts"
    },
    {
      label: "Vérification Sécurisée",
      value: "24/7",
      subtext: "Contrôle documentaire continu",
      trend: "Sécurité",
      icon: Eye,
      color: "text-pink-400",
      bgColor: "bg-pink-500/20",
      pulse: true,
      category: "monitoring"
    }
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getMetricStatusColor = (category) => {
    const colors = {
      ai: 'text-cyan-400',
      prediction: 'text-green-400',
      sentiment: 'text-emerald-400',
      blockchain: 'text-yellow-400',
      smart_contracts: 'text-blue-400',
      monitoring: 'text-pink-400',
      opportunities: 'text-purple-400',
      diaspora: 'text-orange-400',
      risk: 'text-red-400',
      network: 'text-teal-400'
    };
    return colors[category] || 'text-gray-400';
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 border-y border-gray-700/50 py-3 overflow-hidden relative">
      {/* Header avec indicateurs IA */}
      <div className="absolute top-2 left-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-cyan-400" />
          <span className="text-cyan-400 text-xs font-semibold">TERANGA AI</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-400" />
          <span className="text-blue-400 text-xs">BLOCKCHAIN</span>
        </div>
      </div>

      {/* Indicateur temps réel */}
      <div className="absolute top-2 right-4 flex items-center gap-4">
        <div className="flex items-center gap-2 text-green-400 text-xs">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>LIVE - {formatTime(currentTime)}</span>
        </div>
        <div className="flex items-center gap-2 text-cyan-400 text-xs">
          <Activity className="h-3 w-3" />
          <span>AI ACTIVE</span>
        </div>
      </div>

      {/* Métriques défilantes */}
      <div className="flex animate-scroll mt-6">
        {[...aiMetrics, ...aiMetrics].map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <motion.div 
              key={index} 
              className="flex items-center mx-6 whitespace-nowrap group hover:scale-105 transition-transform duration-300 min-w-max"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${metric.bgColor} mr-4 relative overflow-hidden`}>
                <IconComponent className={`h-6 w-6 ${metric.color} relative z-10`} />
                {metric.pulse && (
                  <div className={`absolute inset-0 rounded-xl ${metric.bgColor} animate-ping opacity-40`}></div>
                )}
                
                {/* Indicateur de performance IA */}
                {metric.category === 'ai' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-white text-sm font-semibold">{metric.label}:</span>
                  <span className="text-white font-bold text-lg">{metric.value}</span>
                  {metric.pulse && (
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs font-medium">LIVE</span>
                    </div>
                  )}
                  
                  {/* Badge catégorie */}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getMetricStatusColor(metric.category)} bg-current bg-opacity-20`}>
                    {metric.category.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-400">{metric.subtext}</span>
                  <span className="text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">
                    {metric.trend}
                  </span>
                  
                  {/* Barre de confiance pour les prédictions IA */}
                  {metric.category === 'prediction' && metric.aiData && (
                    <div className="flex items-center gap-1">
                      <div className="w-12 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-400 transition-all duration-1000"
                          style={{ width: `${metric.aiData * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Barre de progression globale IA */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
        <motion.div 
          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: '92%' }}
          transition={{ duration: 2, ease: "easeOut" }}
        ></motion.div>
      </div>
    </div>
  );
};

export default AILiveMetricsBar;

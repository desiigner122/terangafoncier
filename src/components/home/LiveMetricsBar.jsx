import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Target
} from 'lucide-react';

const LiveMetricsBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mettre à jour l'heure toutes les secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const liveMetrics = [
    { 
      label: "Terrains Actuels Disponibles", 
      value: "1,247", 
      location: "Dakar, Thiès, Saint-Louis",
      trend: "+47 aujourd'hui", 
      icon: Building, 
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      pulse: true
    },
    { 
      label: "Projets en Cours", 
      value: "89", 
      location: "Construction active",
      trend: "12 démarrés cette semaine", 
      icon: Hammer, 
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      pulse: true
    },
    { 
      label: "Terrains Communaux Disponibles", 
      value: "156", 
      location: "45 mairies connectées",
      trend: "+23 nouvelles parcelles", 
      icon: MapPin, 
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      pulse: false
    },
    { 
      label: "Visites Planifiées Aujourd'hui", 
      value: "34", 
      location: "Région de Dakar",
      trend: "18h30 prochaine visite", 
      icon: Calendar, 
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      pulse: false
    },
    { 
      label: "Projets Livrés ce Mois", 
      value: "12", 
      location: "Délai moyen: 5.8 mois",
      trend: "2 livrés cette semaine", 
      icon: CheckCircle, 
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      pulse: false
    },
    { 
      label: "Investisseurs Actifs", 
      value: "284", 
      location: "En ligne maintenant",
      trend: "+12 nouveaux ce mois", 
      icon: Users, 
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
      pulse: true
    },
    { 
      label: "Transactions en Cours", 
      value: "67", 
      location: "Smart contracts actifs",
      trend: "8.4M CFA en escrow", 
      icon: TrendingUp, 
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      pulse: true
    },
    { 
      label: "Surveillance IA Active", 
      value: "45", 
      location: "Projets surveillés 24/7",
      trend: "97.8% précision", 
      icon: Eye, 
      color: "text-pink-400",
      bgColor: "bg-pink-500/20",
      pulse: false
    }
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 border-y border-gray-700/50 py-3 overflow-hidden relative">
      {/* Indicateur temps réel */}
      <div className="absolute top-2 right-4 flex items-center gap-2 text-green-400 text-xs">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span>LIVE - {formatTime(currentTime)}</span>
      </div>

      <div className="flex animate-scroll">
        {[...liveMetrics, ...liveMetrics].map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <motion.div 
              key={index} 
              className="flex items-center mx-6 whitespace-nowrap group hover:scale-105 transition-transform duration-300 min-w-max"
              whileHover={{ scale: 1.05 }}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${metric.bgColor} mr-4 relative`}>
                <IconComponent className={`h-5 w-5 ${metric.color}`} />
                {metric.pulse && (
                  <div className={`absolute inset-0 rounded-xl ${metric.bgColor} animate-ping opacity-30`}></div>
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
                </div>
                
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-400">{metric.location}</span>
                  <span className="text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">
                    {metric.trend}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveMetricsBar;

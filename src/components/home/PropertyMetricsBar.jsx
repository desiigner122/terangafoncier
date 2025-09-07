import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  MapPin, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Star,
  Globe,
  Hammer,
  Target
} from 'lucide-react';

const PropertyMetricsBar = () => {
  const metricsData = [
    { 
      label: "Parcelles Disponibles", 
      value: "2,847", 
      trend: "+12.5%", 
      icon: Building, 
      color: "text-blue-400",
      bgColor: "bg-blue-500/20"
    },
    { 
      label: "Projets en Cours", 
      value: "156", 
      trend: "+8.2%", 
      icon: Hammer, 
      color: "text-orange-400",
      bgColor: "bg-orange-500/20"
    },
    { 
      label: "Terrains Communaux", 
      value: "89", 
      trend: "+23.1%", 
      icon: MapPin, 
      color: "text-green-400",
      bgColor: "bg-green-500/20"
    },
    { 
      label: "Promoteurs Actifs", 
      value: "124", 
      trend: "+5.8%", 
      icon: Users, 
      color: "text-purple-400",
      bgColor: "bg-purple-500/20"
    },
    { 
      label: "Projets Achevés", 
      value: "892", 
      trend: "+15.3%", 
      icon: CheckCircle, 
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20"
    },
    { 
      label: "Taux de Réussite", 
      value: "98.7%", 
      trend: "+0.3%", 
      icon: Star, 
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20"
    },
    { 
      label: "Villes Couvertes", 
      value: "47", 
      trend: "+3", 
      icon: Globe, 
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20"
    },
    { 
      label: "Délai Moyen", 
      value: "6.2 mois", 
      trend: "-0.8 mois", 
      icon: Clock, 
      color: "text-pink-400",
      bgColor: "bg-pink-500/20"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-slate-700/50 py-4 overflow-hidden">
      <div className="flex animate-scroll-slow">
        {[...metricsData, ...metricsData].map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <motion.div 
              key={index} 
              className="flex items-center mx-8 whitespace-nowrap group hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${metric.bgColor} mr-3`}>
                <IconComponent className={`h-4 w-4 ${metric.color}`} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-slate-300 text-sm font-medium mr-2">{metric.label}:</span>
                  <span className="text-white font-bold mr-2">{metric.value}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    metric.trend.startsWith('+') || metric.trend.startsWith('-0') 
                      ? 'text-green-400 bg-green-500/20' 
                      : 'text-red-400 bg-red-500/20'
                  }`}>
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

export default PropertyMetricsBar;

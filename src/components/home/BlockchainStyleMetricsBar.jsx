import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Building2, Users, Hammer, Blocks, Database, Shield, Eye, Camera, MapPin, CreditCard, AlertTriangle, Home, Globe, BarChart3, Zap, Target, Award, CheckCircle, XCircle, Clock, DollarSign, Percent, Activity } from 'lucide-react';

const BlockchainStyleMetricsBar = () => {
  const [currentMetricIndex, setCurrentMetricIndex] = useState(0);

  // Métriques style blockchain avec données immobilières
  const metrics = [
    // Terrains & Propriétés
    { icon: MapPin, label: "Terrains Disponibles", value: "1,284", change: "+8.2%", isPositive: true, color: "text-blue-400", category: "Terrains" },
    { icon: Home, label: "Propriétés Vendues", value: "2,847", change: "+15.3%", isPositive: true, color: "text-green-400", category: "Ventes" },
    { icon: Building2, label: "Projets Actifs", value: "125", change: "+12.5%", isPositive: true, color: "text-purple-400", category: "Projets" },
    { icon: Hammer, label: "Constructions en cours", value: "456", change: "+22.1%", isPositive: true, color: "text-orange-400", category: "Construction" },
    
    // Financement & Crédits
    { icon: CreditCard, label: "Taux Crédit Habitat", value: "6.5%", change: "-0.3%", isPositive: true, color: "text-cyan-400", category: "Crédit" },
    { icon: DollarSign, label: "Fonds Sécurisés", value: "2.4B FCFA", change: "+11.8%", isPositive: true, color: "text-yellow-400", category: "Finance" },
    { icon: Percent, label: "Taux Financement", value: "7.2%", change: "-0.1%", isPositive: true, color: "text-pink-400", category: "Financement" },
    { icon: BarChart3, label: "ROI Moyen", value: "18.5%", change: "+2.1%", isPositive: true, color: "text-indigo-400", category: "Rendement" },
    
    // Blockchain & Sécurité
    { icon: Blocks, label: "NFT Propriétés", value: "2,847", change: "+15.2%", isPositive: true, color: "text-violet-400", category: "NFT" },
    { icon: Shield, label: "Transactions Sécurisées", value: "8,923", change: "+9.8%", isPositive: true, color: "text-emerald-400", category: "Sécurité" },
    { icon: Database, label: "Smart Contracts", value: "892", change: "+18.7%", isPositive: true, color: "text-teal-400", category: "Blockchain" },
    { icon: Eye, label: "Fraudes Évitées", value: "247", change: "+45.2%", isPositive: true, color: "text-red-400", category: "Protection" },
    
    // Utilisateurs & Activité
    { icon: Users, label: "Utilisateurs Actifs", value: "8.2K", change: "+28.4%", isPositive: true, color: "text-blue-300", category: "Utilisateurs" },
    { icon: Globe, label: "Diaspora Connectée", value: "3.1K", change: "+34.6%", isPositive: true, color: "text-green-300", category: "Diaspora" },
    { icon: Camera, label: "Suivis IA", value: "1,245", change: "+19.3%", isPositive: true, color: "text-purple-300", category: "IA" },
    { icon: Activity, label: "Alertes Temps Réel", value: "156", change: "+67.8%", isPositive: true, color: "text-orange-300", category: "Alertes" },
    
    // Problèmes Résolus
    { icon: XCircle, label: "Doubles Ventes Évitées", value: "89", change: "↓-78%", isPositive: true, color: "text-red-300", category: "Protection" },
    { icon: AlertTriangle, label: "Fraudes Détectées", value: "23", change: "↓-65%", isPositive: true, color: "text-yellow-300", category: "Détection" },
    { icon: CheckCircle, label: "Vérifications Complètes", value: "98.7%", change: "+1.2%", isPositive: true, color: "text-emerald-300", category: "Vérification" },
    { icon: Clock, label: "Délais Réduits", value: "72h", change: "↓-60%", isPositive: true, color: "text-cyan-300", category: "Efficacité" }
  ];

  // Animation continue des métriques
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetricIndex((prev) => (prev + 1) % metrics.length);
    }, 2500); // Change toutes les 2.5 secondes

    return () => clearInterval(interval);
  }, [metrics.length]);

  // Métriques populaires (fixes sur desktop)
  const popularMetrics = metrics.slice(0, 6);

  return (
    <div className="bg-gray-900 border-t border-gray-800 py-3 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Section Populaire */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400 font-medium text-sm">Populaire</span>
              <div className="w-px h-4 bg-gray-700"></div>
            </div>

            {/* Desktop - Métriques fixes */}
            <div className="hidden xl:flex items-center space-x-6">
              {popularMetrics.map((metric, index) => (
                <motion.div
                  key={`${metric.label}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2 group cursor-pointer hover:bg-gray-800/50 px-2 py-1 rounded"
                >
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-sm font-medium whitespace-nowrap">
                      {metric.label.split(' ')[0]}
                    </span>
                    <span className="text-gray-300 text-sm font-semibold">
                      {metric.value}
                    </span>
                    <span className={`text-xs flex items-center ${
                      metric.isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.change.includes('↓') ? (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      )}
                      {metric.change}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tablet - Métriques moyennes */}
            <div className="hidden lg:flex xl:hidden items-center space-x-4">
              {popularMetrics.slice(0, 4).map((metric, index) => (
                <motion.div
                  key={`${metric.label}-tablet-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-sm font-medium">
                      {metric.label.split(' ')[0]}
                    </span>
                    <span className="text-gray-300 text-sm">
                      {metric.value}
                    </span>
                    <span className={`text-xs ${
                      metric.isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile & Small Tablet - Métrique rotative */}
            <div className="lg:hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMetricIndex}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center space-x-2"
                >
                  {React.createElement(metrics[currentMetricIndex].icon, { 
                    className: `w-4 h-4 ${metrics[currentMetricIndex].color}` 
                  })}
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-sm font-medium">
                      {metrics[currentMetricIndex].label}
                    </span>
                    <span className="text-gray-300 text-sm font-semibold">
                      {metrics[currentMetricIndex].value}
                    </span>
                    <span className={`text-xs flex items-center ${
                      metrics[currentMetricIndex].isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metrics[currentMetricIndex].change.includes('↓') ? (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      )}
                      {metrics[currentMetricIndex].change}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded bg-gray-800 text-gray-400`}>
                    {metrics[currentMetricIndex].category}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Section Nouveau Listing */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-gray-400 text-sm">Nouveau listing</span>
            <div className="w-px h-4 bg-gray-700"></div>
            <a 
              href="/terrains" 
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center group"
            >
              Voir plus de 350 terrains
              <TrendingUp className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Progress bar pour mobile */}
        <div className="lg:hidden mt-2">
          <div className="w-full bg-gray-800 rounded-full h-1">
            <motion.div
              className="bg-gradient-to-r from-blue-400 to-purple-400 h-1 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "linear" }}
              key={currentMetricIndex}
            />
          </div>
        </div>

        {/* Indicateurs de catégories */}
        <div className="hidden xl:flex justify-center mt-2 space-x-4">
          {["Terrains", "Finance", "Blockchain", "Protection"].map((category, index) => (
            <div key={category} className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                index === 0 ? 'bg-blue-400' :
                index === 1 ? 'bg-green-400' :
                index === 2 ? 'bg-purple-400' : 'bg-orange-400'
              }`} />
              <span className="text-xs text-gray-500">{category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlockchainStyleMetricsBar;

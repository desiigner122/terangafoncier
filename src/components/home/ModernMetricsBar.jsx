import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Building2, Users, Hammer, Blocks, Database, Shield, Eye, Camera } from 'lucide-react';

const ModernMetricsBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const metrics = [
    {
      icon: Building2,
      label: "Projets Disponibles",
      value: "125",
      change: "+12.5%",
      isPositive: true,
      color: "text-blue-400"
    },
    {
      icon: Hammer,
      label: "Demandes Actives", 
      value: "1,284",
      change: "+18.7%",
      isPositive: true,
      color: "text-emerald-400"
    },
    {
      icon: Users,
      label: "Promoteurs Certifiés",
      value: "45",
      change: "+8.9%",
      isPositive: true,
      color: "text-purple-400"
    },
    {
      icon: Blocks,
      label: "NFT Propriétés",
      value: "2,847",
      change: "+15.2%",
      isPositive: true,
      color: "text-yellow-400"
    },
    {
      icon: Database,
      label: "Fonds Sécurisés",
      value: "2.4B FCFA",
      change: "+11.3%",
      isPositive: true,
      color: "text-green-400"
    },
    {
      icon: Camera,
      label: "Projets Surveillés IA",
      value: "456",
      change: "+22.1%",
      isPositive: true,
      color: "text-orange-400"
    },
    {
      icon: Shield,
      label: "Transactions Sécurisées",
      value: "8,923",
      change: "+9.8%",
      isPositive: true,
      color: "text-cyan-400"
    },
    {
      icon: Eye,
      label: "Vues Propriétés",
      value: "45.2K",
      change: "+28.4%",
      isPositive: true,
      color: "text-pink-400"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % metrics.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [metrics.length]);

  return (
    <div className="bg-gray-900 border-t border-gray-800 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Populaire Label */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400 font-medium text-sm">Populaire</span>
              <div className="w-px h-4 bg-gray-700"></div>
            </div>

            {/* Desktop - Show all metrics */}
            <div className="hidden lg:flex items-center space-x-8">
              {metrics.slice(0, 5).map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2 group cursor-pointer"
                >
                  <metric.icon className={`w-4 h-4 ${metric.color}`} />
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-sm font-medium">
                      {metric.label.split(' ')[0]}
                    </span>
                    <span className="text-gray-300 text-sm">
                      {metric.value}
                    </span>
                    <span className={`text-xs flex items-center ${
                      metric.isPositive ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {metric.isPositive ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {metric.change}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mobile - Rotating metrics */}
            <div className="lg:hidden">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-2"
              >
                {React.createElement(metrics[currentIndex].icon, { 
                  className: `w-4 h-4 ${metrics[currentIndex].color}` 
                })}
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm font-medium">
                    {metrics[currentIndex].label}
                  </span>
                  <span className="text-gray-300 text-sm">
                    {metrics[currentIndex].value}
                  </span>
                  <span className={`text-xs flex items-center ${
                    metrics[currentIndex].isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {metrics[currentIndex].isPositive ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {metrics[currentIndex].change}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right side link */}
          <div className="hidden sm:block">
            <a 
              href="/dashboard" 
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center"
            >
              Voir toutes les statistiques
              <TrendingUp className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>

        {/* Progress bar for mobile rotation */}
        <div className="lg:hidden mt-2">
          <div className="w-full bg-gray-800 rounded-full h-1">
            <motion.div
              className="bg-yellow-400 h-1 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
              key={currentIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernMetricsBar;

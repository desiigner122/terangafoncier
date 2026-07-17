import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Coins } from 'lucide-react';
import StatsService from '../../services/StatsService';

const formatFCFA = (n) => {
  if (!n) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M FCFA`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k FCFA`;
  return `${n} FCFA`;
};

const MarketTickerBar = () => {
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    let active = true;
    StatsService.getRegionMarket().then((regions) => {
      if (!active) return;
      setMarketData(regions.map(r => ({
        location: r.region,
        price: `${formatFCFA(r.avgPricePerM2)}/m²`,
        type: `${r.count} bien${r.count > 1 ? 's' : ''}`
      })));
    });
    return () => { active = false; };
  }, []);

  // Ne rien afficher tant qu'aucune donnée marché réelle n'est disponible
  if (marketData.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 text-white border-b border-blue-800 overflow-hidden relative">
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Pattern de fond blockchain */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="border-r border-blue-400/20 h-full relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Coins className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Label */}
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              <BarChart3 className="w-4 h-4 text-green-400" />
              <span className="text-xs font-medium">MARCHÉ FONCIER EN TEMPS RÉEL</span>
            </div>

            {/* Ticker qui défile */}
            <div className="flex-1 mx-6 overflow-hidden">
              <motion.div
                className="flex gap-8"
                animate={{ x: '-100%' }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear",
                  },
                }}
                style={{ width: '200%' }}
              >
                {/* Première série */}
                {marketData.map((item, index) => (
                  <div key={`first-${index}`} className="flex items-center gap-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-sm">{item.location}</span>
                        <span className="text-xs opacity-75">({item.type})</span>
                      </div>
                      <span className="text-sm font-bold text-blue-200">{item.price}</span>
                      <div className="flex items-center gap-1 text-green-400">
                        <TrendingUp className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Deuxième série (pour le défilement continu) */}
                {marketData.map((item, index) => (
                  <div key={`second-${index}`} className="flex items-center gap-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg backdrop-blur-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-sm">{item.location}</span>
                        <span className="text-xs opacity-75">({item.type})</span>
                      </div>
                      <span className="text-sm font-bold text-blue-200">{item.price}</span>
                      <div className="flex items-center gap-1 text-green-400">
                        <TrendingUp className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Statut blockchain */}
            <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-300">BLOCKCHAIN ACTIF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTickerBar;

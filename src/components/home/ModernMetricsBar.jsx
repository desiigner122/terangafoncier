import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Building2, Users, Hammer, Blocks, Database, Shield, Eye, Camera } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const ModernMetricsBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [counts, setCounts] = useState({
    properties: null,
    constructionRequests: null,
    promoters: null,
    nftProperties: null,
    securedFundsTotal: null,
    aiMonitored: null,
    transactions: null,
    propertyViews: null
  });

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [
          propertiesRes,
          requestsRes,
          promotersRes,
          nftRes,
          securedFundsRes,
          aiRes,
          txRes,
          viewsRes
        ] = await Promise.allSettled([
          supabase.from('properties').select('id', { count: 'exact', head: true }),
          supabase.from('construction_requests').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('account_type', 'promoteur'),
          supabase.from('properties').select('id', { count: 'exact', head: true }).not('nft_token_id', 'is', null),
          supabase.from('properties').select('estimated_value').not('smart_contract_address', 'is', null),
          supabase.from('properties').select('id', { count: 'exact', head: true }).not('ai_score', 'is', null),
          supabase.from('blockchain_transactions').select('id', { count: 'exact', head: true }),
          supabase.from('properties').select('views_count')
        ]);

        const securedFundsTotal = securedFundsRes.status === 'fulfilled'
          ? (securedFundsRes.value.data || []).reduce((sum, row) => sum + (row.estimated_value || 0), 0)
          : 0;

        const propertyViews = viewsRes.status === 'fulfilled'
          ? (viewsRes.value.data || []).reduce((sum, row) => sum + (row.views_count || 0), 0)
          : 0;

        setCounts({
          properties: propertiesRes.status === 'fulfilled' ? (propertiesRes.value.count || 0) : 0,
          constructionRequests: requestsRes.status === 'fulfilled' ? (requestsRes.value.count || 0) : 0,
          promoters: promotersRes.status === 'fulfilled' ? (promotersRes.value.count || 0) : 0,
          nftProperties: nftRes.status === 'fulfilled' ? (nftRes.value.count || 0) : 0,
          securedFundsTotal,
          aiMonitored: aiRes.status === 'fulfilled' ? (aiRes.value.count || 0) : 0,
          transactions: txRes.status === 'fulfilled' ? (txRes.value.count || 0) : 0,
          propertyViews
        });
      } catch (error) {
        console.error('Erreur chargement métriques modernes:', error);
      }
    };

    loadCounts();
  }, []);

  const fmt = (value) => (value === null ? '…' : value.toLocaleString('fr-FR'));
  const fmtFCFA = (value) => (value === null ? '…' : `${(value / 1_000_000_000).toFixed(1)}B FCFA`);

  const metrics = [
    {
      icon: Building2,
      label: "Projets Disponibles",
      value: fmt(counts.properties),
      color: "text-blue-400"
    },
    {
      icon: Hammer,
      label: "Demandes Actives",
      value: fmt(counts.constructionRequests),
      color: "text-emerald-400"
    },
    {
      icon: Users,
      label: "Promoteurs Certifiés",
      value: fmt(counts.promoters),
      color: "text-purple-400"
    },
    {
      icon: Blocks,
      label: "NFT Propriétés",
      value: fmt(counts.nftProperties),
      color: "text-yellow-400"
    },
    {
      icon: Database,
      label: "Fonds Sécurisés",
      value: fmtFCFA(counts.securedFundsTotal),
      color: "text-green-400"
    },
    {
      icon: Camera,
      label: "Projets Surveillés IA",
      value: fmt(counts.aiMonitored),
      color: "text-orange-400"
    },
    {
      icon: Shield,
      label: "Transactions Sécurisées",
      value: fmt(counts.transactions),
      color: "text-cyan-400"
    },
    {
      icon: Eye,
      label: "Vues Propriétés",
      value: fmt(counts.propertyViews),
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

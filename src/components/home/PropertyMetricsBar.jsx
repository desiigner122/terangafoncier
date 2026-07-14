import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building,
  MapPin,
  Users,
  Globe,
  Hammer,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const PropertyMetricsBar = () => {
  const [metricsData, setMetricsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const [
          parcellesRes,
          projetsRes,
          projetsAchevesRes,
          communauxRes,
          promoteursRes,
          propertiesForCitiesRes
        ] = await Promise.all([
          supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'available'),
          supabase.from('developer_projects').select('id', { count: 'exact', head: true }),
          supabase.from('developer_projects').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
          supabase.from('communal_requests').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('account_type', 'promoteur'),
          supabase.from('properties').select('city')
        ]);

        const villesCouvertes = new Set(
          (propertiesForCitiesRes.data || []).map((p) => p.city).filter(Boolean)
        ).size;

        setMetricsData([
          {
            label: "Parcelles Disponibles",
            value: `${parcellesRes.count || 0}`,
            icon: Building,
            color: "text-blue-400",
            bgColor: "bg-blue-500/20"
          },
          {
            label: "Projets en Cours",
            value: `${projetsRes.count || 0}`,
            icon: Hammer,
            color: "text-orange-400",
            bgColor: "bg-orange-500/20"
          },
          {
            label: "Terrains Communaux",
            value: `${communauxRes.count || 0}`,
            icon: MapPin,
            color: "text-green-400",
            bgColor: "bg-green-500/20"
          },
          {
            label: "Promoteurs Actifs",
            value: `${promoteursRes.count || 0}`,
            icon: Users,
            color: "text-purple-400",
            bgColor: "bg-purple-500/20"
          },
          {
            label: "Projets Achevés",
            value: `${projetsAchevesRes.count || 0}`,
            icon: CheckCircle,
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/20"
          },
          {
            label: "Villes Couvertes",
            value: `${villesCouvertes}`,
            icon: Globe,
            color: "text-cyan-400",
            bgColor: "bg-cyan-500/20"
          }
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement des métriques:', error);
        setMetricsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading || metricsData.length === 0) {
    return (
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-slate-700/50 py-4 overflow-hidden">
        <div className="flex justify-center">
          <span className="text-slate-400 text-sm">
            {loading ? 'Chargement des statistiques…' : 'Statistiques indisponibles pour le moment.'}
          </span>
        </div>
      </div>
    );
  }

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

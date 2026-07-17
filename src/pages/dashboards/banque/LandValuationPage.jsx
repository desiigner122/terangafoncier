import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Building,
  Calculator,
  Search,
  MapPin,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Loader2,
  XCircle,
  Eye,
  Layers
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const formatXOF = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n === 0) return '—';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0
  }).format(n);
};

// Écart entre valeur de marché et prix affiché (donnée réelle, pas de fabrication)
const gapMeta = (price, market) => {
  const p = Number(price);
  const m = Number(market);
  if (!Number.isFinite(p) || !Number.isFinite(m) || p <= 0 || m <= 0) {
    return { label: '—', cls: 'text-gray-400' };
  }
  const pct = ((m - p) / p) * 100;
  const sign = pct > 0 ? '+' : '';
  const cls = pct > 0 ? 'text-emerald-600' : pct < 0 ? 'text-red-600' : 'text-gray-500';
  return { label: `${sign}${pct.toFixed(1)} %`, cls };
};

const scoreMeta = (score) => {
  const s = Number(score);
  if (!Number.isFinite(s)) return { label: '—', cls: 'bg-gray-100 text-gray-500' };
  if (s >= 75) return { label: `${Math.round(s)}`, cls: 'bg-emerald-100 text-emerald-700' };
  if (s >= 50) return { label: `${Math.round(s)}`, cls: 'bg-amber-100 text-amber-700' };
  return { label: `${Math.round(s)}`, cls: 'bg-red-100 text-red-700' };
};

const LandValuationPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Évaluation foncière : la banque consulte les biens du marché avec leurs
      // valeurs réelles (table `properties`). Colonnes réelles utilisées :
      // estimated_value, market_value, ai_score, price, surface, location, region,
      // city, type, verification_status. Aucune colonne bank_id ici ; RLS = lisible
      // par tout authentifié. Aucune valeur fabriquée : les champs absents restent vides.
      const { data: rows, error: fetchError } = await supabase
        .from('properties')
        .select(
          'id, title, name, type, price, surface, location, region, city, ' +
            'status, verification_status, ai_score, estimated_value, market_value, created_at'
        )
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Erreur chargement properties:', fetchError);
        setError("Impossible de charger les biens à évaluer.");
        setData([]);
      } else {
        setData(rows || []);
      }
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors du chargement.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) loadProperties();
  }, [user?.id, loadProperties]);

  const regions = useMemo(() => {
    const set = new Set();
    data.forEach((p) => p.region && set.add(p.region));
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return data.filter((p) => {
      if (regionFilter !== 'all' && p.region !== regionFilter) return false;
      if (!term) return true;
      return (
        (p.title || p.name || '').toLowerCase().includes(term) ||
        (p.location || '').toLowerCase().includes(term) ||
        (p.city || '').toLowerCase().includes(term)
      );
    });
  }, [data, search, regionFilter]);

  const stats = useMemo(() => {
    const total = data.length;
    const evaluated = data.filter(
      (p) => Number(p.estimated_value) > 0 || Number(p.market_value) > 0
    ).length;
    const totalEstimated = data.reduce(
      (sum, p) => sum + (Number(p.estimated_value) || Number(p.market_value) || 0),
      0
    );
    const scored = data.filter((p) => Number.isFinite(Number(p.ai_score)));
    const avgScore = scored.length
      ? Math.round(scored.reduce((s, p) => s + Number(p.ai_score), 0) / scored.length)
      : null;
    return { total, evaluated, totalEstimated, avgScore };
  }, [data]);

  const statCards = [
    { label: 'Biens répertoriés', value: stats.total, icon: Building, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Biens évalués', value: stats.evaluated, icon: Calculator, color: 'text-blue-600', bg: 'bg-blue-50' },
    {
      label: 'Valeur estimée totale',
      value: stats.totalEstimated > 0 ? formatXOF(stats.totalEstimated) : '—',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Score IA moyen',
      value: stats.avgScore != null ? `${stats.avgScore}/100` : '—',
      icon: Sparkles,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Évaluation Foncière</h1>
            <p className="text-gray-600">
              Valeurs estimées, valeurs de marché et scores IA des biens immobiliers
            </p>
          </div>
          <button
            onClick={loadProperties}
            disabled={loading}
            className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {loading ? '—' : card.value}
                  </p>
                </div>
                <div className={`${card.bg} p-3 rounded-lg`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Filtres + Contenu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par bien, ville ou localisation..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Toutes les régions</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="h-10 w-10 text-indigo-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500">Chargement des biens...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-1">{error}</p>
              <button onClick={loadProperties} className="text-indigo-600 hover:underline mt-2">
                Réessayer
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Building className="h-16 w-16 text-indigo-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {data.length === 0 ? 'Aucun bien à évaluer' : 'Aucun résultat'}
              </h3>
              <p className="text-gray-500">
                {data.length === 0
                  ? 'Les biens immobiliers et leurs évaluations apparaîtront ici.'
                  : 'Aucun bien ne correspond à votre recherche.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="py-3 px-3 font-medium">Bien</th>
                    <th className="py-3 px-3 font-medium">Localisation</th>
                    <th className="py-3 px-3 font-medium">Prix affiché</th>
                    <th className="py-3 px-3 font-medium">Valeur estimée</th>
                    <th className="py-3 px-3 font-medium">Valeur de marché</th>
                    <th className="py-3 px-3 font-medium">Écart</th>
                    <th className="py-3 px-3 font-medium">Score IA</th>
                    <th className="py-3 px-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const gap = gapMeta(p.price, p.market_value);
                    const score = scoreMeta(p.ai_score);
                    return (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                              <Layers className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-900 block">
                                {p.title || p.name || 'Bien'}
                              </span>
                              {p.surface ? (
                                <span className="text-xs text-gray-400">
                                  {p.surface} m²{p.type ? ` · ${p.type}` : ''}
                                </span>
                              ) : p.type ? (
                                <span className="text-xs text-gray-400">{p.type}</span>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            {p.city || p.location || p.region || '—'}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-gray-700">{formatXOF(p.price)}</td>
                        <td className="py-3 px-3 font-semibold text-gray-900">
                          {formatXOF(p.estimated_value)}
                        </td>
                        <td className="py-3 px-3 text-gray-700">{formatXOF(p.market_value)}</td>
                        <td className={`py-3 px-3 font-medium ${gap.cls}`}>{gap.label}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 py-1 rounded-full text-xs font-semibold ${score.cls}`}
                          >
                            {score.label}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-end">
                            <button
                              title="Détails"
                              className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LandValuationPage;

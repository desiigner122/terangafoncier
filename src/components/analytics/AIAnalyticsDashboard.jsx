import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Activity,
  Zap,
  Shield,
  Globe,
  MapPin,
  DollarSign,
  Users,
  Building,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Layers
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { advancedAIService } from '@/services/AdvancedAIService';
import { supabase } from '@/lib/supabaseClient';
import { EmptyState } from '@/components/ui/EmptyState';

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const AIAnalyticsDashboard = () => {
  const [aiInsights, setAiInsights] = useState(null);
  const [blockchainMetrics, setBlockchainMetrics] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedZone, setSelectedZone] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);

  // Données pour les graphiques - chargées depuis Supabase (vide par défaut)
  const [priceEvolutionData, setPriceEvolutionData] = useState([]);
  const [zonePerformanceData, setZonePerformanceData] = useState([]);
  const [blockchainActivityData, setBlockchainActivityData] = useState([]);
  const [aiPredictionAccuracy, setAiPredictionAccuracy] = useState([]);
  const [marketSentimentData, setMarketSentimentData] = useState([]);

  useEffect(() => {
    loadAnalyticsData();

    // Auto-refresh des données
    const interval = setInterval(loadAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, [selectedTimeframe, selectedZone]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const [insights, blockchain] = await Promise.all([
        advancedAIService.generateMarketInsights(),
        advancedAIService.getBlockchainMetrics()
      ]);

      setAiInsights(insights);
      setBlockchainMetrics(blockchain);
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
    } finally {
      setIsLoading(false);
      loadChartsData();
    }
  };

  const loadChartsData = async () => {
    // Prix moyen des biens et performance par zone, calculés à partir des propriétés réelles
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const [propertiesRes, transactionsRes] = await Promise.all([
        supabase
          .from('properties')
          .select('id, price, location, created_at')
          .gte('created_at', sixMonthsAgo.toISOString())
          .order('created_at', { ascending: true })
          .limit(1000),
        supabase
          .from('blockchain_transactions')
          .select('id, amount, status, created_at')
          .order('created_at', { ascending: false })
          .limit(500)
      ]);

      const properties = propertiesRes.data || [];
      const transactions = transactionsRes.data || [];

      // Évolution du prix moyen par mois
      const monthBuckets = {};
      properties.forEach((p) => {
        if (!p.created_at || !p.price) return;
        const d = new Date(p.created_at);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (!monthBuckets[key]) {
          monthBuckets[key] = { label: MONTH_LABELS[d.getMonth()], total: 0, count: 0, sortKey: d.getFullYear() * 12 + d.getMonth() };
        }
        monthBuckets[key].total += Number(p.price) || 0;
        monthBuckets[key].count += 1;
      });
      setPriceEvolutionData(
        Object.values(monthBuckets)
          .sort((a, b) => a.sortKey - b.sortKey)
          .map((b) => ({ month: b.label, price: Math.round(b.total / b.count) }))
      );

      // Performance par zone (nombre de biens et prix moyen réels)
      const zoneBuckets = {};
      properties.forEach((p) => {
        const zone = p.location || 'Non renseigné';
        if (!zoneBuckets[zone]) zoneBuckets[zone] = { zone, total: 0, count: 0 };
        zoneBuckets[zone].total += Number(p.price) || 0;
        zoneBuckets[zone].count += 1;
      });
      setZonePerformanceData(
        Object.values(zoneBuckets)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
          .map((z) => ({ zone: z.zone, volume: z.count, avgPrice: Math.round(z.total / z.count) }))
      );

      // Activité blockchain des dernières 24h, répartie en tranches de 4h
      const now = new Date();
      const buckets = Array.from({ length: 6 }, (_, i) => ({
        time: `${(i * 4).toString().padStart(2, '0')}:00`,
        transactions: 0
      }));
      transactions.forEach((tx) => {
        if (!tx.created_at) return;
        const d = new Date(tx.created_at);
        const hoursAgo = (now - d) / 3600000;
        if (hoursAgo < 0 || hoursAgo > 24) return;
        const bucketIndex = Math.min(5, Math.floor(d.getHours() / 4));
        buckets[bucketIndex].transactions += 1;
      });
      setBlockchainActivityData(buckets);
    } catch (error) {
      console.error('Erreur chargement graphiques analytics:', error);
      setPriceEvolutionData([]);
      setZonePerformanceData([]);
      setBlockchainActivityData([]);
    }

    // Précision des modèles IA, calculée à partir des analyses réelles
    try {
      const { data, error } = await supabase
        .from('ai_analyses')
        .select('analysis_type, confidence_score')
        .limit(200);
      if (error) throw error;

      const accuracyColors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];
      const accBuckets = {};
      (data || []).forEach((a) => {
        const type = a.analysis_type || 'Général';
        if (!accBuckets[type]) accBuckets[type] = { total: 0, count: 0 };
        accBuckets[type].total += Number(a.confidence_score) || 0;
        accBuckets[type].count += 1;
      });
      setAiPredictionAccuracy(
        Object.entries(accBuckets).map(([category, v], index) => ({
          category,
          accuracy: Math.round((v.total / v.count) * 1000) / 10,
          color: accuracyColors[index % accuracyColors.length]
        }))
      );
    } catch (error) {
      setAiPredictionAccuracy([]);
    }

    // Sentiment marché : aucune source de données fiable disponible pour l'instant
    setMarketSentimentData([]);
  };

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-16 w-16 text-cyan-500 animate-pulse mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyse IA en cours...</h2>
          <p className="text-gray-600">Traitement des données blockchain et marché</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-cyan-500" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Teranga AI Analytics</h1>
                <p className="text-gray-600">Intelligence Artificielle + Blockchain pour l'immobilier</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sélecteur de période */}
            <select 
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="24h">Dernières 24h</option>
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">3 derniers mois</option>
            </select>
            
            {/* Status IA */}
            <div className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 text-sm font-medium">IA Active</span>
            </div>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-100 rounded-lg">
                  <Brain className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Confiance IA</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {((aiInsights?.confidenceScore || 0) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="w-16 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{value: (aiInsights?.confidenceScore || 0) * 100}]}>
                    <RadialBar dataKey="value" fill="#06B6D4" />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Transactions Blockchain</p>
                <p className="text-2xl font-bold text-gray-900">
                  {blockchainMetrics?.totalTransactions ?? 0}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Prédiction Prix</p>
                <p className="text-2xl font-bold text-gray-900">
                  {aiInsights?.pricePredictions?.shortTerm?.prediction ?? 'N/A'}
                </p>
              </div>
            </div>
            <p className="text-sm text-green-600">
              {aiInsights?.pricePredictions?.shortTerm?.confidence
                ? `Confiance: ${Math.round(aiInsights.pricePredictions.shortTerm.confidence * 100)}%`
                : 'Confiance: N/A'}
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Smart Contracts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {blockchainMetrics?.smartContractsActive ?? 0}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Évolution des prix avec prédictions IA */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Prédictions Prix IA</h3>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-cyan-500" />
              <span className="text-sm text-cyan-600">Modèle Neural</span>
            </div>
          </div>
          
          {priceEvolutionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceEvolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#10B981"
                  strokeWidth={3}
                  name="Prix Moyen Réel"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              icon={TrendingUp}
              title="Aucune donnée de prix"
              description="Pas assez de biens enregistrés sur les 6 derniers mois pour tracer une évolution des prix."
            />
          )}
        </div>

        {/* Activité Blockchain temps réel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Activité Blockchain</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600">Temps réel</span>
            </div>
          </div>

          {blockchainActivityData.some((b) => b.transactions > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={blockchainActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="time" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="transactions"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  name="Transactions"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              icon={Zap}
              title="Aucune transaction blockchain"
              description="Aucune transaction blockchain enregistrée sur les dernières 24 heures."
            />
          )}
        </div>
      </div>

      {/* Performances par zone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Zones (IA)</h3>

          {zonePerformanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={zonePerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="zone" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="volume" fill="#10B981" name="Nombre de biens" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              icon={BarChart3}
              title="Aucune donnée de zone"
              description="Aucune propriété avec localisation renseignée n'a été trouvée."
            />
          )}
        </div>

        {/* Sentiment du marché */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Sentiment Marché IA</h3>

          {marketSentimentData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={marketSentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {marketSentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>

              <div className="mt-4 space-y-2">
                {marketSentimentData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                      <span className="text-sm text-gray-600">{item.sentiment}</span>
                    </div>
                    <span className="text-sm font-semibold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              icon={PieChart}
              title="Aucune donnée de sentiment"
              description="Aucune analyse de sentiment marché n'est disponible pour le moment."
            />
          )}
        </div>
      </div>

      {/* Précision modèles IA */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Précision Modèles IA</h3>

        {aiPredictionAccuracy.length === 0 ? (
          <EmptyState
            icon={Brain}
            title="Aucune analyse IA disponible"
            description="Aucune analyse IA enregistrée ne permet de calculer la précision des modèles."
          />
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiPredictionAccuracy.map((model, index) => (
            <motion.div 
              key={index}
              className="text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={model.color}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${model.accuracy * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold" style={{color: model.color}}>
                    {model.accuracy}%
                  </span>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900">{model.category}</h4>
              <p className="text-sm text-gray-600">Précision modèle</p>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalyticsDashboard;

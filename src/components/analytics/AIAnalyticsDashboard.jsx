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
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { advancedAIService } from '@/services/AdvancedAIService';

const AIAnalyticsDashboard = () => {
  const [aiInsights, setAiInsights] = useState(null);
  const [blockchainMetrics, setBlockchainMetrics] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedZone, setSelectedZone] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);

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
    }
  };

  // Données pour les graphiques
  const priceEvolutionData = [
    { month: 'Jan', price: 650000, prediction: 660000, confidence: 0.92 },
    { month: 'Fév', price: 665000, prediction: 675000, confidence: 0.89 },
    { month: 'Mar', price: 678000, prediction: 690000, confidence: 0.91 },
    { month: 'Avr', price: 685000, prediction: 705000, confidence: 0.88 },
    { month: 'Mai', price: 692000, prediction: 720000, confidence: 0.85 },
    { month: 'Jun', price: 708000, prediction: 735000, confidence: 0.87 }
  ];

  const zonePerformanceData = [
    { zone: 'Almadies', performance: 95, growth: 12.5, volume: 245 },
    { zone: 'Ngor', performance: 92, growth: 11.8, volume: 189 },
    { zone: 'VDN', performance: 88, growth: 9.2, volume: 312 },
    { zone: 'Sicap', performance: 85, growth: 8.7, volume: 278 },
    { zone: 'Diamniadio', performance: 90, growth: 15.3, volume: 156 }
  ];

  const blockchainActivityData = [
    { time: '00:00', transactions: 45, volume: 2.1, contracts: 12 },
    { time: '04:00', transactions: 32, volume: 1.8, contracts: 8 },
    { time: '08:00', transactions: 78, volume: 4.2, contracts: 23 },
    { time: '12:00', transactions: 95, volume: 5.8, contracts: 31 },
    { time: '16:00', transactions: 87, volume: 4.9, contracts: 28 },
    { time: '20:00', transactions: 65, volume: 3.5, contracts: 18 }
  ];

  const aiPredictionAccuracy = [
    { category: 'Prix', accuracy: 94.2, color: '#10B981' },
    { category: 'Demande', accuracy: 89.7, color: '#3B82F6' },
    { category: 'Tendances', accuracy: 91.5, color: '#8B5CF6' },
    { category: 'Risques', accuracy: 87.3, color: '#F59E0B' }
  ];

  const marketSentimentData = [
    { sentiment: 'Très Optimiste', value: 35, color: '#10B981' },
    { sentiment: 'Optimiste', value: 42, color: '#3B82F6' },
    { sentiment: 'Neutre', value: 18, color: '#6B7280' },
    { sentiment: 'Pessimiste', value: 5, color: '#F59E0B' }
  ];

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
                    {((aiInsights?.confidenceScore || 0.89) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="w-16 h-16">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[{value: (aiInsights?.confidenceScore || 0.89) * 100}]}>
                    <RadialBar dataKey="value" fill="#06B6D4" />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <p className="text-sm text-green-600">+2.3% vs hier</p>
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
                  {blockchainMetrics?.totalTransactions || '15,247'}
                </p>
              </div>
            </div>
            <p className="text-sm text-blue-600">+89 transactions/h</p>
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
                  {aiInsights?.pricePredictions?.shortTerm?.prediction || '+2.5%'}
                </p>
              </div>
            </div>
            <p className="text-sm text-green-600">Confiance: 92%</p>
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
                  {blockchainMetrics?.smartContractsActive || '89'}
                </p>
              </div>
            </div>
            <p className="text-sm text-purple-600">100% automatisé</p>
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
                name="Prix Réel"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="prediction" 
                stroke="#06B6D4" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Prédiction IA"
                dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
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
              <Area 
                type="monotone" 
                dataKey="contracts" 
                stroke="#8B5CF6" 
                fill="#8B5CF6"
                fillOpacity={0.3}
                name="Smart Contracts"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performances par zone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Zones (IA)</h3>
          
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
              <Bar dataKey="performance" fill="#10B981" name="Score Performance" />
              <Bar dataKey="growth" fill="#06B6D4" name="Croissance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment du marché */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Sentiment Marché IA</h3>
          
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
        </div>
      </div>

      {/* Précision modèles IA */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Précision Modèles IA</h3>
        
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
      </div>
    </div>
  );
};

export default AIAnalyticsDashboard;

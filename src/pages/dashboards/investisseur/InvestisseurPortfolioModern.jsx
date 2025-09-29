import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  PieChart,
  Eye,
  Edit,
  MoreVertical,
  Plus,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MapPin,
  Award,
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart3
} from 'lucide-react';

const InvestisseurPortfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('performance');

  // Données détaillées du portefeuille
  const portfolioData = {
    summary: {
      totalValue: 2485000000, // 2.48 milliards FCFA
      totalInvested: 1850000000, // 1.85 milliards FCFA
      totalGain: 635000000, // 635 millions FCFA
      overallROI: 34.3,
      activeInvestments: 12,
      completedInvestments: 8
    },
    investments: [
      {
        id: 1,
        name: 'Résidence Almadies Premium',
        type: 'Résidentiel',
        category: 'Appartements de luxe',
        location: 'Almadies, Dakar',
        invested: 450000000,
        currentValue: 720000000,
        gain: 270000000,
        roi: 60.0,
        status: 'Actif',
        performance: 'Excellent',
        startDate: '2023-01-15',
        expectedDuration: '24 mois',
        completionRate: 75,
        risk: 'Faible',
        lastUpdate: '2024-03-20',
        description: '50 appartements haut standing avec vue mer',
        keyMetrics: {
          occupancyRate: 92,
          rentalYield: 8.5,
          appreciation: 15.2
        }
      },
      {
        id: 2,
        name: 'Centre Commercial Plateau',
        type: 'Commercial',
        category: 'Commerce de détail',
        location: 'Plateau, Dakar',
        invested: 680000000,
        currentValue: 850000000,
        gain: 170000000,
        roi: 25.0,
        status: 'Actif',
        performance: 'Bon',
        startDate: '2022-08-10',
        expectedDuration: '36 mois',
        completionRate: 85,
        risk: 'Moyen',
        lastUpdate: '2024-03-19',
        description: 'Centre commercial avec 40 boutiques',
        keyMetrics: {
          occupancyRate: 88,
          rentalYield: 12.3,
          appreciation: 8.7
        }
      },
      {
        id: 3,
        name: 'Lotissement Saly Beach',
        type: 'Foncier',
        category: 'Terrain résidentiel',
        location: 'Saly, Mbour',
        invested: 320000000,
        currentValue: 385000000,
        gain: 65000000,
        roi: 20.3,
        status: 'Actif',
        performance: 'Satisfaisant',
        startDate: '2023-05-20',
        expectedDuration: '18 mois',
        completionRate: 60,
        risk: 'Faible',
        lastUpdate: '2024-03-18',
        description: '150 lots avec accès plage privée',
        keyMetrics: {
          soldLots: 90,
          reservedLots: 35,
          appreciation: 12.1
        }
      },
      {
        id: 4,
        name: 'Tours de Bureaux Diamniadio',
        type: 'Commercial',
        category: 'Bureaux',
        location: 'Diamniadio',
        invested: 400000000,
        currentValue: 530000000,
        gain: 130000000,
        roi: 32.5,
        status: 'Actif',
        performance: 'Très bon',
        startDate: '2022-11-05',
        expectedDuration: '30 mois',
        completionRate: 90,
        risk: 'Moyen',
        lastUpdate: '2024-03-17',
        description: 'Complexe de bureaux modernes',
        keyMetrics: {
          occupancyRate: 95,
          rentalYield: 10.8,
          appreciation: 18.5
        }
      }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPerformanceColor = (performance) => {
    const colors = {
      'Excellent': 'bg-green-100 text-green-800 border-green-200',
      'Très bon': 'bg-blue-100 text-blue-800 border-blue-200',
      'Bon': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Satisfaisant': 'bg-orange-100 text-orange-800 border-orange-200',
      'Préoccupant': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[performance] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRiskColor = (risk) => {
    const colors = {
      'Faible': 'text-green-600',
      'Moyen': 'text-yellow-600',
      'Élevé': 'text-red-600'
    };
    return colors[risk] || 'text-gray-600';
  };

  const filteredInvestments = portfolioData.investments.filter(investment => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'residential') return investment.type === 'Résidentiel';
    if (activeFilter === 'commercial') return investment.type === 'Commercial';
    if (activeFilter === 'land') return investment.type === 'Foncier';
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Mon Portefeuille
              </h1>
              <p className="text-gray-600 mt-1">Gestion complète de vos investissements immobiliers</p>
            </div>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg">
              <Plus className="w-5 h-5" />
              <span className="font-medium">Nouvel Investissement</span>
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <Briefcase className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-blue-700">
                  {formatCurrency(portfolioData.summary.totalValue).slice(0, -8)}Md
                </span>
              </div>
              <p className="text-blue-600 text-sm font-medium mt-1">Valeur Totale</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center justify-between">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold text-green-700">
                  +{portfolioData.summary.overallROI}%
                </span>
              </div>
              <p className="text-green-600 text-sm font-medium mt-1">ROI Global</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center justify-between">
                <Building2 className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold text-purple-700">
                  {portfolioData.summary.activeInvestments}
                </span>
              </div>
              <p className="text-purple-600 text-sm font-medium mt-1">Investissements Actifs</p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <div className="flex items-center justify-between">
                <DollarSign className="w-8 h-8 text-emerald-600" />
                <span className="text-2xl font-bold text-emerald-700">
                  {formatCurrency(portfolioData.summary.totalGain).slice(0, -8)}M
                </span>
              </div>
              <p className="text-emerald-600 text-sm font-medium mt-1">Gains Totaux</p>
            </div>
          </div>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un investissement..."
                  className="pl-10 pr-4 py-2 bg-white/60 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {[
                { id: 'all', label: 'Tous', count: portfolioData.investments.length },
                { id: 'residential', label: 'Résidentiel', count: 1 },
                { id: 'commercial', label: 'Commercial', count: 2 },
                { id: 'land', label: 'Foncier', count: 1 }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeFilter === filter.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-white/60 text-gray-600 hover:bg-white hover:text-blue-600'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Investments Grid */}
        <div className="grid gap-6">
          {filteredInvestments.map((investment, index) => (
            <motion.div
              key={investment.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{investment.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPerformanceColor(investment.performance)}`}>
                      {investment.performance}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-1">{investment.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {investment.location}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {investment.expectedDuration}
                    </span>
                    <span className={`font-medium ${getRiskColor(investment.risk)}`}>
                      Risque: {investment.risk}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Eye className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Edit className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Investi</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(investment.invested).slice(0, -8)}M
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Valeur Actuelle</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(investment.currentValue).slice(0, -8)}M
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Gain</p>
                  <p className="text-xl font-bold text-purple-600 flex items-center justify-center">
                    +{formatCurrency(investment.gain).slice(0, -8)}M
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">ROI</p>
                  <p className="text-xl font-bold text-orange-600">+{investment.roi}%</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progression du projet</span>
                  <span className="text-sm font-medium text-gray-700">{investment.completionRate}%</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full h-2 transition-all duration-1000"
                    style={{ width: `${investment.completionRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                {investment.type === 'Résidentiel' && (
                  <>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Taux d'occupation</p>
                      <p className="font-bold text-gray-800">{investment.keyMetrics.occupancyRate}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Rendement locatif</p>
                      <p className="font-bold text-gray-800">{investment.keyMetrics.rentalYield}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Plus-value</p>
                      <p className="font-bold text-gray-800">{investment.keyMetrics.appreciation}%</p>
                    </div>
                  </>
                )}
                {investment.type === 'Commercial' && (
                  <>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Taux d'occupation</p>
                      <p className="font-bold text-gray-800">{investment.keyMetrics.occupancyRate}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Rendement</p>
                      <p className="font-bold text-gray-800">{investment.keyMetrics.rentalYield}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Appréciation</p>
                      <p className="font-bold text-gray-800">{investment.keyMetrics.appreciation}%</p>
                    </div>
                  </>
                )}
                {investment.type === 'Foncier' && (
                  <>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Lots vendus</p>
                      <p className="font-bold text-gray-800">{investment.keyMetrics.soldLots}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Réservés</p>
                      <p className="font-bold text-gray-800">{investment.keyMetrics.reservedLots}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Appréciation</p>
                      <p className="font-bold text-gray-800">{investment.keyMetrics.appreciation}%</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestisseurPortfolio;
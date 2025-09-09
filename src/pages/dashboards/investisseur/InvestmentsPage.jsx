import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart,
  BarChart3,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  MapPin,
  Percent
} from 'lucide-react';

const InvestmentsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [investments, setInvestments] = useState([]);
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 2450000,
    monthlyReturn: 8.5,
    yearlyReturn: 15.2,
    totalInvestments: 12
  });

  useEffect(() => {
    // Simulation des données d'investissements
    const mockInvestments = [
      {
        id: 1,
        property: "Villa Moderna Almadies",
        location: "Almadies, Dakar",
        investmentAmount: 500000,
        currentValue: 620000,
        returnRate: 24.0,
        status: "active",
        type: "residential",
        duration: "24 mois"
      },
      {
        id: 2,
        property: "Complexe Commercial VDN",
        location: "VDN, Dakar",
        investmentAmount: 800000,
        currentValue: 920000,
        returnRate: 15.0,
        status: "active",
        type: "commercial",
        duration: "18 mois"
      },
      {
        id: 3,
        property: "Résidence Teranga Heights",
        location: "Mermoz, Dakar",
        investmentAmount: 300000,
        currentValue: 285000,
        returnRate: -5.0,
        status: "under_review",
        type: "residential",
        duration: "6 mois"
      },
      {
        id: 4,
        property: "Centre d'Affaires Plateau",
        location: "Plateau, Dakar",
        investmentAmount: 1200000,
        currentValue: 1380000,
        returnRate: 15.0,
        status: "active",
        type: "office",
        duration: "36 mois"
      }
    ];
    setInvestments(mockInvestments);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'under_review': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'residential': return Building;
      case 'commercial': return BarChart3;
      case 'office': return Activity;
      default: return Building;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes Investissements
          </h1>
          <p className="text-gray-600">
            Gérez et suivez vos investissements immobiliers en temps réel
          </p>
        </motion.div>

        {/* Portfolio Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valeur Totale</p>
                <p className="text-2xl font-bold text-gray-900">
                  {portfolioStats.totalValue.toLocaleString()} FCFA
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rendement Mensuel</p>
                <p className="text-2xl font-bold text-green-600">
                  +{portfolioStats.monthlyReturn}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rendement Annuel</p>
                <p className="text-2xl font-bold text-blue-600">
                  +{portfolioStats.yearlyReturn}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Investissements</p>
                <p className="text-2xl font-bold text-gray-900">
                  {portfolioStats.totalInvestments}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <PieChart className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Portfolio Détaillé
              </h2>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {['1M', '3M', '6M', '1A', 'Tout'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedPeriod === period
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Nouvel Investissement
            </button>
          </div>
        </motion.div>

        {/* Investments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Propriété
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Investissement
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Valeur Actuelle
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Rendement
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Durée
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {investments.map((investment, index) => {
                  const TypeIcon = getTypeIcon(investment.type);
                  return (
                    <motion.tr
                      key={investment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <TypeIcon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {investment.property}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              {investment.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {investment.investmentAmount.toLocaleString()} FCFA
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {investment.currentValue.toLocaleString()} FCFA
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {investment.returnRate >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
                          )}
                          <span className={`text-sm font-medium ${
                            investment.returnRate >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {investment.returnRate > 0 ? '+' : ''}{investment.returnRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(investment.status)}`}>
                          {investment.status === 'active' ? 'Actif' : 
                           investment.status === 'under_review' ? 'En Révision' : 'Terminé'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {investment.duration}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Performance Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Performance du Portfolio
          </h3>
          <div className="h-64 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Graphique de performance en cours de développement</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InvestmentsPage;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Percent,
  Clock,
  PieChart,
  BarChart3,
  Info,
  AlertCircle,
  CheckCircle,
  Calendar,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const RoiCalculatorPage = () => {
  const [inputs, setInputs] = useState({
    initialInvestment: 500000,
    monthlyContribution: 25000,
    expectedReturn: 12,
    investmentPeriod: 5,
    inflationRate: 3,
    taxRate: 10,
    propertyAppreciation: 8,
    rentalYield: 6
  });

  const [results, setResults] = useState({});
  const [selectedScenario, setSelectedScenario] = useState('optimistic');

  const scenarios = {
    conservative: {
      label: 'Conservateur',
      color: 'blue',
      multiplier: 0.8,
      description: 'Scénario prudent avec rendements modérés'
    },
    realistic: {
      label: 'Réaliste',
      color: 'green',
      multiplier: 1.0,
      description: 'Scénario basé sur les tendances historiques'
    },
    optimistic: {
      label: 'Optimiste',
      color: 'purple',
      multiplier: 1.2,
      description: 'Scénario avec conditions favorables'
    }
  };

  useEffect(() => {
    calculateROI();
  }, [inputs, selectedScenario]);

  const calculateROI = () => {
    const scenario = scenarios[selectedScenario];
    const adjustedReturn = inputs.expectedReturn * scenario.multiplier;
    const adjustedAppreciation = inputs.propertyAppreciation * scenario.multiplier;
    
    // Calculs de base
    const monthlyRate = adjustedReturn / 100 / 12;
    const totalMonths = inputs.investmentPeriod * 12;
    
    // Valeur future avec contributions mensuelles
    const futureValue = inputs.initialInvestment * Math.pow(1 + monthlyRate, totalMonths) +
                       inputs.monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    const totalInvested = inputs.initialInvestment + (inputs.monthlyContribution * totalMonths);
    const totalGain = futureValue - totalInvested;
    const totalROI = (totalGain / totalInvested) * 100;
    
    // Valeur avec appréciation immobilière
    const appreciationRate = adjustedAppreciation / 100;
    const propertyValue = inputs.initialInvestment * Math.pow(1 + appreciationRate, inputs.investmentPeriod);
    
    // Revenus locatifs
    const annualRental = inputs.initialInvestment * (inputs.rentalYield / 100);
    const totalRentalIncome = annualRental * inputs.investmentPeriod;
    
    // Impact inflation et taxes
    const inflationAdjustedValue = futureValue / Math.pow(1 + inputs.inflationRate / 100, inputs.investmentPeriod);
    const afterTaxValue = totalGain * (1 - inputs.taxRate / 100);
    
    setResults({
      futureValue,
      totalInvested,
      totalGain,
      totalROI,
      propertyValue,
      totalRentalIncome,
      inflationAdjustedValue,
      afterTaxValue,
      monthlyPassiveIncome: totalRentalIncome / totalMonths,
      breakEvenTime: totalInvested / (annualRental / 12),
      annualizedReturn: Math.pow(futureValue / inputs.initialInvestment, 1 / inputs.investmentPeriod) - 1
    });
  };

  const handleInputChange = (field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (value) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Calculateur de Rentabilité (ROI)
          </h1>
          <p className="text-gray-600">
            Analysez et projettez la rentabilité de vos investissements immobiliers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-6">
                <Calculator className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Paramètres d'Investissement
                </h2>
              </div>

              <div className="space-y-6">
                {/* Investment Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investissement Initial (FCFA)
                  </label>
                  <input
                    type="number"
                    value={inputs.initialInvestment}
                    onChange={(e) => handleInputChange('initialInvestment', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Monthly Contribution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contribution Mensuelle (FCFA)
                  </label>
                  <input
                    type="number"
                    value={inputs.monthlyContribution}
                    onChange={(e) => handleInputChange('monthlyContribution', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Expected Return */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rendement Attendu (% annuel)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.expectedReturn}
                    onChange={(e) => handleInputChange('expectedReturn', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Investment Period */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Période d'Investissement (années)
                  </label>
                  <input
                    type="number"
                    value={inputs.investmentPeriod}
                    onChange={(e) => handleInputChange('investmentPeriod', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Property Appreciation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appréciation Immobilière (% annuel)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.propertyAppreciation}
                    onChange={(e) => handleInputChange('propertyAppreciation', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Rental Yield */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rendement Locatif (% annuel)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.rentalYield}
                    onChange={(e) => handleInputChange('rentalYield', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Advanced Parameters */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Paramètres Avancés</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Taux d'Inflation (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={inputs.inflationRate}
                        onChange={(e) => handleInputChange('inflationRate', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Taux d'Imposition (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={inputs.taxRate}
                        onChange={(e) => handleInputChange('taxRate', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {/* Scenario Selector */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scénarios de Projection</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(scenarios).map(([key, scenario]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedScenario(key)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedScenario === key
                        ? `border-${scenario.color}-500 bg-${scenario.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h4 className={`font-medium text-${scenario.color}-600 mb-1`}>
                      {scenario.label}
                    </h4>
                    <p className="text-sm text-gray-600">{scenario.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Key Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Valeur Future</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(results.futureValue || 0)}
                    </p>
                    <div className="flex items-center mt-2">
                      <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">
                        +{formatPercent(results.totalROI || 0)}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Gain Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(results.totalGain || 0)}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Investi: {formatCurrency(results.totalInvested || 0)}
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
                    <p className="text-sm text-gray-600">Valeur Immobilière</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(results.propertyValue || 0)}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Appréciation: {inputs.propertyAppreciation}%/an
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenus Locatifs</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(results.totalRentalIncome || 0)}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {formatCurrency(results.monthlyPassiveIncome || 0)}/mois
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Analyse Détaillée</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-4">Métriques Clés</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rendement Annualisé:</span>
                      <span className="font-medium">
                        {formatPercent((results.annualizedReturn || 0) * 100)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Seuil de Rentabilité:</span>
                      <span className="font-medium">
                        {(results.breakEvenTime || 0).toFixed(1)} mois
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Valeur Ajustée Inflation:</span>
                      <span className="font-medium">
                        {formatCurrency(results.inflationAdjustedValue || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Gain Après Impôts:</span>
                      <span className="font-medium">
                        {formatCurrency(results.afterTaxValue || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-4">Recommandations</h4>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span className="text-sm text-gray-600">
                        Rentabilité attractive pour un investissement long terme
                      </span>
                    </div>
                    <div className="flex items-start">
                      <Info className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      <span className="text-sm text-gray-600">
                        Diversifiez votre portefeuille pour réduire les risques
                      </span>
                    </div>
                    <div className="flex items-start">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5" />
                      <span className="text-sm text-gray-600">
                        Considérez l'impact de l'inflation sur vos projections
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium text-gray-700 mb-4">Évolution de l'Investissement</h4>
                <div className="h-64 bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Graphique d'évolution en cours de développement</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Visualisation de la croissance de votre investissement
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RoiCalculatorPage;

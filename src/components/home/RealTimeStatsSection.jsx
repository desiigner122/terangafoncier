import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, BarChart3, PieChart, LineChart, Users, Building2, MapPin, Shield, AlertTriangle, CheckCircle, Globe, Zap, Target, Award, Clock, DollarSign, Eye, Database, Blocks, Camera, CreditCard, Home, Hammer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const RealTimeStatsSection = () => {
  const [animatedValues, setAnimatedValues] = useState({});
  const [activeChart, setActiveChart] = useState('terrains');

  // Données temps réel avec animation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedValues(prev => ({
        ...prev,
        usersOnline: Math.floor(Math.random() * 50) + 120,
        activeTransactions: Math.floor(Math.random() * 10) + 15,
        newListings: Math.floor(Math.random() * 5) + 8
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Statistiques principales
  const mainStats = [
    {
      title: "Parcelles Disponibles",
      value: "1,284",
      change: "+8.2%",
      isPositive: true,
      icon: MapPin,
      color: "from-blue-500 to-cyan-500",
      description: "Terrains vérifiés blockchain",
      details: [
        { label: "Dakar", value: "456", percentage: 35 },
        { label: "Thiès", value: "321", percentage: 25 },
        { label: "Mbour", value: "289", percentage: 23 },
        { label: "Autres", value: "218", percentage: 17 }
      ]
    },
    {
      title: "Propriétés Vendues",
      value: "2,847",
      change: "+15.3%",
      isPositive: true,
      icon: Home,
      color: "from-emerald-500 to-teal-500",
      description: "Ventes sécurisées cette année",
      details: [
        { label: "Q1 2025", value: "892", percentage: 31 },
        { label: "Q2 2025", value: "756", percentage: 27 },
        { label: "Q3 2025", value: "623", percentage: 22 },
        { label: "Q4 2025", value: "576", percentage: 20 }
      ]
    },
    {
      title: "Transactions Blockchain",
      value: "8,923",
      change: "+22.1%",
      isPositive: true,
      icon: Blocks,
      color: "from-purple-500 to-pink-500",
      description: "Smart contracts exécutés",
      details: [
        { label: "NFT Mint", value: "2,847", percentage: 32 },
        { label: "Transferts", value: "3,456", percentage: 39 },
        { label: "Escrow", value: "1,789", percentage: 20 },
        { label: "Autres", value: "831", percentage: 9 }
      ]
    },
    {
      title: "Fraudes Évitées",
      value: "247",
      change: "+45.2%",
      isPositive: true,
      icon: Shield,
      color: "from-red-500 to-orange-500",
      description: "Tentatives bloquées par l'IA",
      details: [
        { label: "Doubles ventes", value: "89", percentage: 36 },
        { label: "Faux docs", value: "67", percentage: 27 },
        { label: "Usurpation", value: "54", percentage: 22 },
        { label: "Autres", value: "37", percentage: 15 }
      ]
    }
  ];

  // Métriques en temps réel
  const liveMetrics = [
    { 
      label: "Utilisateurs en ligne", 
      value: animatedValues.usersOnline || 142, 
      icon: Users, 
      color: "text-green-400",
      trend: "+12"
    },
    { 
      label: "Transactions actives", 
      value: animatedValues.activeTransactions || 23, 
      icon: Activity, 
      color: "text-blue-400",
      trend: "+5"
    },
    { 
      label: "Nouvelles annonces", 
      value: animatedValues.newListings || 12, 
      icon: Building2, 
      color: "text-purple-400",
      trend: "+3"
    },
    { 
      label: "Suivis IA actifs", 
      value: 89, 
      icon: Camera, 
      color: "text-orange-400",
      trend: "+7"
    }
  ];

  // Problèmes résolus par la plateforme
  const problemsSolved = [
    {
      problem: "Fraude Foncière",
      solution: "Blockchain NFT + Vérification IA",
      impact: "89% de réduction",
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600",
      stats: "247 fraudes évitées ce mois"
    },
    {
      problem: "Doubles Ventes",
      solution: "Smart Contracts automatisés",
      impact: "95% d'élimination",
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
      stats: "0 double vente depuis 6 mois"
    },
    {
      problem: "Accès Diaspora",
      solution: "Plateforme globale + Support 24/7",
      impact: "3,100+ connectés",
      icon: Globe,
      color: "bg-blue-100 text-blue-600",
      stats: "50+ pays couverts"
    },
    {
      problem: "Délais Longs",
      solution: "Processus digitalisé + IA",
      impact: "72h vs 3 mois",
      icon: Clock,
      color: "bg-purple-100 text-purple-600",
      stats: "60% de temps économisé"
    }
  ];

  // Données de performance
  const performanceData = [
    { month: "Jan", terrains: 180, ventes: 95, satisfaction: 94 },
    { month: "Fév", terrains: 220, ventes: 128, satisfaction: 96 },
    { month: "Mar", terrains: 290, ventes: 167, satisfaction: 97 },
    { month: "Avr", terrains: 340, ventes: 203, satisfaction: 98 },
    { month: "Mai", terrains: 410, ventes: 245, satisfaction: 97 },
    { month: "Juin", terrains: 485, ventes: 289, satisfaction: 99 }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Données en <span className="text-blue-600">Temps Réel</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Suivez l'évolution de l'écosystème immobilier blockchain du Sénégal avec des métriques en direct
          </p>
        </motion.div>

        {/* Métriques temps réel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {liveMetrics.map((metric, index) => (
            <Card key={metric.label} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <motion.div 
                  className="text-2xl font-bold text-gray-900"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  {metric.value}
                </motion.div>
                <div className="text-sm text-gray-600">{metric.label}</div>
                <Badge variant="secondary" className="mt-1 text-xs bg-green-100 text-green-600">
                  {metric.trend} aujourd'hui
                </Badge>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Statistiques principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {mainStats.map((stat, index) => (
            <Card key={stat.title} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardHeader className={`bg-gradient-to-r ${stat.color} text-white pb-3`}>
                <div className="flex items-center justify-between">
                  <stat.icon className="w-8 h-8" />
                  <Badge className={`${stat.isPositive ? 'bg-green-500' : 'bg-red-500'} text-white border-0`}>
                    {stat.change}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold">{stat.title}</CardTitle>
                <p className="text-sm opacity-90">{stat.description}</p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="text-3xl font-bold text-gray-900 mb-4">{stat.value}</div>
                <div className="space-y-2">
                  {stat.details.map((detail, idx) => (
                    <div key={detail.label} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{detail.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{detail.value}</span>
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${stat.color} h-2 rounded-full`}
                            style={{ width: `${detail.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Problèmes résolus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Problèmes <span className="text-red-600">Résolus</span> par la Plateforme
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problemsSolved.map((item, index) => (
              <Card key={item.problem} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-full ${item.color} mb-4`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">{item.problem}</h4>
                  <p className="text-gray-600 text-sm mb-3">{item.solution}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Impact:</span>
                      <span className="font-bold text-green-600">{item.impact}</span>
                    </div>
                    <p className="text-xs text-gray-500">{item.stats}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Graphique de performance simplifié */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
            Performance 2025
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {performanceData.map((data, index) => (
              <div key={data.month} className="text-center">
                <div className="text-sm text-gray-500 mb-2">{data.month}</div>
                <div className="space-y-2">
                  <div className="bg-blue-100 rounded p-2">
                    <div className="text-xs text-blue-600">Terrains</div>
                    <div className="font-bold text-blue-800">{data.terrains}</div>
                  </div>
                  <div className="bg-green-100 rounded p-2">
                    <div className="text-xs text-green-600">Ventes</div>
                    <div className="font-bold text-green-800">{data.ventes}</div>
                  </div>
                  <div className="bg-purple-100 rounded p-2">
                    <div className="text-xs text-purple-600">Satisfaction</div>
                    <div className="font-bold text-purple-800">{data.satisfaction}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RealTimeStatsSection;

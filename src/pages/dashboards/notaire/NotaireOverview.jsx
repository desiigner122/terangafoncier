import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  FileText, 
  Users, 
  Stamp,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Target,
  Calendar,
  Activity,
  DollarSign,
  ArrowUp,
  ArrowDown,
  BookOpen,
  Award,
  Plus,
  Bot,
  Download,
  Gavel,
  PenTool
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const NotaireOverview = ({ dashboardStats }) => {
  const [timeFilter, setTimeFilter] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  // Handlers pour les actions rapides
  const handleNewTransaction = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Nouvelle transaction",
        description: "Formulaire de transaction notariale ouvert",
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleDocumentAuthentication = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Authentification document",
        description: "Module d'authentification activé",
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleArchiveSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Recherche archives",
        description: "Moteur de recherche d'archives ouvert",
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleBlockchainVerification = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Vérification blockchain",
        description: "Module blockchain de vérification activé",
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleExportReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Rapport exporté",
        description: "Rapport notarial généré avec succès",
        variant: "success"
      });
      setIsLoading(false);
    }, 2000);
  };

  // Données statistiques principales - Transactions de terrains via plateforme
  const mainStats = [
    {
      title: 'Transactions Terrains',
      value: dashboardStats.totalCases || 147,
      change: '+23',
      trend: 'up',
      icon: BookOpen,
      color: 'bg-green-500',
      description: 'Total transactions terrains via plateforme',
      action: 'Voir tous'
    },
    {
      title: 'En Cours',
      value: dashboardStats.activeCases || 32,
      change: '+8',
      trend: 'up',
      icon: FileText,
      color: 'bg-orange-500',
      description: 'Dossiers terrains en cours',
      action: 'Gérer'
    },
    {
      title: 'Revenus Terrains',
      value: `${((dashboardStats.monthlyRevenue || 45000000) / 1000000).toFixed(1)}M FCFA`,
      change: '+18.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-blue-500',
      description: 'Revenus transactions terrains',
      action: 'Rapport'
    },
    {
      title: 'Titres Transférés',
      value: (dashboardStats.documentsAuthenticated || 156).toLocaleString(),
      change: '+34',
      trend: 'up',
      icon: Stamp,
      color: 'bg-purple-500',
      description: 'Titres fonciers transférés ce mois',
      action: 'Certifier'
    }
  ];

  // Données pour les graphiques - Transactions de terrains
  const revenueEvolutionData = [
    { month: 'Jan', revenue: 18400000, cases: 28, landArea: 145.2 },
    { month: 'Fév', revenue: 21200000, cases: 32, landArea: 167.8 },
    { month: 'Mar', revenue: 24800000, cases: 35, landArea: 189.5 },
    { month: 'Avr', revenue: 19400000, cases: 24, landArea: 156.3 },
    { month: 'Mai', revenue: 28200000, cases: 41, landArea: 218.7 },
    { month: 'Jun', revenue: 32100000, cases: 47, landArea: 245.1 }
  ];

  const caseTypesData = [
    { name: 'Ventes Immobilières', value: 45, color: '#F59E0B' },
    { name: 'Successions', value: 25, color: '#10B981' },
    { name: 'Donations', value: 18, color: '#3B82F6' },
    { name: 'Autres Actes', value: 12, color: '#8B5CF6' }
  ];

  const clientSatisfactionData = [
    { category: 'Rapidité', score: 95 },
    { category: 'Qualité Service', score: 98 },
    { category: 'Communication', score: 92 },
    { category: 'Transparence', score: 96 }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête avec filtres temporels */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Vue d'ensemble Notariale</h2>
          <p className="text-gray-600 mt-1">
            Tableau de bord de gestion notariale et transactions foncières
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          {['7d', '30d', '90d', '1y'].map((period) => (
            <Button
              key={period}
              variant="outline"
              size="sm"
              className={timeFilter === period ? 'bg-amber-600 text-white' : ''}
              onClick={() => setTimeFilter(period)}
            >
              {period}
            </Button>
          ))}
          <Button 
            className="bg-amber-600 hover:bg-amber-700"
            onClick={handleExportReport}
            disabled={isLoading}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Générer Rapport
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === 'up' ? (
                        <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">ce mois</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">{stat.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      window.safeGlobalToast({
                        title: "Détails consultés",
                        description: `Affichage des détails pour ${stat.title}`,
                        variant: "success"
                      });
                    }}
                  >
                    Détails
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => {
                      window.safeGlobalToast({
                        title: "Action exécutée",
                        description: `${stat.action || 'Action'} pour ${stat.title}`,
                        variant: "success"
                      });
                    }}
                  >
                    {stat.action || 'Action'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Graphiques et analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des revenus */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-amber-600" />
              Évolution des Revenus
            </CardTitle>
            <CardDescription>
              Performance mensuelle des honoraires notariaux
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueEvolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'cases' ? value : `${(value / 1000000).toFixed(1)}M FCFA`,
                    name === 'cases' ? 'Nombre de dossiers' : 'Revenus'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#F59E0B" 
                  fill="#F59E0B" 
                  fillOpacity={0.1}
                />
                <Line 
                  type="monotone" 
                  dataKey="cases" 
                  stroke="#D97706" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Types d'actes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gavel className="h-5 w-5 mr-2 text-purple-600" />
              Répartition des Actes
            </CardTitle>
            <CardDescription>
              Distribution par type d'acte notarié
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={caseTypesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {caseTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {caseTypesData.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Satisfaction clients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="h-5 w-5 mr-2 text-green-600" />
            Satisfaction Clients
          </CardTitle>
          <CardDescription>
            Scores de satisfaction par catégorie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientSatisfactionData.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.category}</p>
                    <p className="text-sm text-gray-500">Score de satisfaction</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Progress value={item.score} className="w-24" />
                  <span className="text-sm font-medium text-gray-900 w-12">
                    {item.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-orange-600" />
            Actions Rapides
          </CardTitle>
          <CardDescription>
            Raccourcis vers les fonctions principales notariales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-amber-50 hover:border-amber-300"
              onClick={handleNewTransaction}
              disabled={isLoading}
            >
              <FileText className="h-6 w-6 text-amber-600" />
              <span className="text-sm">Nouvelle Transaction</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-300"
              onClick={handleDocumentAuthentication}
              disabled={isLoading}
            >
              <Stamp className="h-6 w-6 text-purple-600" />
              <span className="text-sm">Authentifier Doc</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-300"
              onClick={handleArchiveSearch}
              disabled={isLoading}
            >
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Rechercher Archives</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-green-50 hover:border-green-300"
              onClick={handleBlockchainVerification}
              disabled={isLoading}
            >
              <Shield className="h-6 w-6 text-green-600" />
              <span className="text-sm">Vérification Blockchain</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-red-50 hover:border-red-300"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  window.safeGlobalToast({
                    title: "Nouveau dossier",
                    description: "Création d'un nouveau dossier notarial",
                    variant: "success"
                  });
                  setIsLoading(false);
                }, 1000);
              }}
              disabled={isLoading}
            >
              <Plus className="h-6 w-6 text-red-600" />
              <span className="text-sm">Nouveau Dossier</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-indigo-50 hover:border-indigo-300"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  window.safeGlobalToast({
                    title: "Planificateur ouvert",
                    description: "Module de planification des rendez-vous",
                    variant: "success"
                  });
                  setIsLoading(false);
                }, 1000);
              }}
              disabled={isLoading}
            >
              <Calendar className="h-6 w-6 text-indigo-600" />
              <span className="text-sm">Planifier RDV</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-pink-50 hover:border-pink-300"
              onClick={() => {
                setIsLoading(true);
                setTimeout(() => {
                  window.safeGlobalToast({
                    title: "Assistant IA activé",
                    description: "Intelligence artificielle notariale",
                    variant: "success"
                  });
                  setIsLoading(false);
                }, 1000);
              }}
              disabled={isLoading}
            >
              <Bot className="h-6 w-6 text-pink-600" />
              <span className="text-sm">Assistant IA</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-yellow-50 hover:border-yellow-300"
              onClick={handleExportReport}
              disabled={isLoading}
            >
              <Download className="h-6 w-6 text-yellow-600" />
              <span className="text-sm">Exporter Rapports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotaireOverview;
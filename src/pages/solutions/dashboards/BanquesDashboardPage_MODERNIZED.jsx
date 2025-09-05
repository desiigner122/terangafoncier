import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Badge, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../../../components/ui';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  Users, 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target, 
  Activity, 
  Banknote, 
  Calculator, 
  PieChart as PieChartIcon, 
  BarChart3, 
  Wallet, 
  Building2, 
  HandCoins, 
  Receipt, 
  Download, 
  Search, 
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BanquesDashboardPage = () => {
  const [banqueMetrics, setBanqueMetrics] = useState({
    creditsImmobiliers: 1847,
    montantTotal: 98500000000,
    tauxApprobation: 78.5,
    delaiTraitement: 15,
    clientsActifs: 12450,
    portefeuilleRisque: 2.3,
    revenus: 4750000000,
    croissance: 12.8
  });

  const [chartData, setChartData] = useState({
    evolutionCredits: [
      { mois: 'Jan', credits: 145, montant: 7800000000, approuves: 114, refuses: 31 },
      { mois: 'Fév', credits: 162, montant: 8900000000, approuves: 128, refuses: 34 },
      { mois: 'Mar', credits: 178, montant: 9200000000, approuves: 142, refuses: 36 },
      { mois: 'Avr', credits: 195, montant: 10100000000, approuves: 156, refuses: 39 },
      { mois: 'Mai', credits: 188, montant: 9800000000, approuves: 149, refuses: 39 },
      { mois: 'Jun', credits: 203, montant: 11200000000, approuves: 164, refuses: 39 }
    ],
    typesCredits: [
      { type: 'Acquisition', nombre: 486, pourcentage: 45.2, montant: 28500000000, couleur: '#10B981' },
      { type: 'Construction', nombre: 312, pourcentage: 29.0, montant: 22100000000, couleur: '#3B82F6' },
      { type: 'Rénovation', nombre: 187, pourcentage: 17.4, montant: 9800000000, couleur: '#F59E0B' },
      { type: 'Refinancement', nombre: 92, pourcentage: 8.4, montant: 4200000000, couleur: '#EF4444' }
    ],
    risquePortefeuille: [
      { trimestre: 'Q1', taux: 2.1, provisions: 890000000, recouvrements: 450000000 },
      { trimestre: 'Q2', taux: 2.3, provisions: 920000000, recouvrements: 480000000 },
      { trimestre: 'Q3', taux: 2.0, provisions: 850000000, recouvrements: 520000000 },
      { trimestre: 'Q4', taux: 2.2, provisions: 900000000, recouvrements: 495000000 }
    ],
    performanceAgences: [
      { agence: 'Dakar Plateau', credits: 425, montant: 18500000000, taux: 85.2 },
      { agence: 'Almadies', credits: 387, montant: 21200000000, taux: 82.1 },
      { agence: 'Parcelles', credits: 356, montant: 16800000000, taux: 79.8 },
      { agence: 'Guédiawaye', credits: 298, montant: 14200000000, taux: 75.4 },
      { agence: 'Thiès', credits: 245, montant: 12100000000, taux: 73.2 },
      { agence: 'Saint-Louis', credits: 136, montant: 8900000000, taux: 71.8 }
    ]
  });

  const [demandesCredits, setDemandesCredits] = useState([
    {
      id: 1,
      client: 'Mme Fatou DIOP',
      type: 'Acquisition',
      montant: 45000000,
      statut: 'En analyse',
      agence: 'Dakar Plateau',
      delai: 8,
      score: 785,
      garantie: 'Hypothèque',
      progression: 65
    },
    {
      id: 2,
      client: 'M. Abdou NDIAYE',
      type: 'Construction',
      montant: 72000000,
      statut: 'Approuvé',
      agence: 'Almadies',
      delai: 12,
      score: 820,
      garantie: 'Hypothèque + Caution',
      progression: 95
    },
    {
      id: 3,
      client: 'SCI Les Palmiers',
      type: 'Promotion',
      montant: 185000000,
      statut: 'En attente docs',
      agence: 'Parcelles',
      delai: 3,
      score: 742,
      garantie: 'Nantissement',
      progression: 25
    },
    {
      id: 4,
      client: 'Mme Aïssa FALL',
      type: 'Rénovation',
      montant: 28000000,
      statut: 'En analyse',
      agence: 'Guédiawaye',
      delai: 6,
      score: 698,
      garantie: 'Hypothèque',
      progression: 45
    }
  ]);

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulation de données temps réel
    const interval = setInterval(() => {
      setBanqueMetrics(prev => ({
        ...prev,
        creditsImmobiliers: prev.creditsImmobiliers + Math.floor(Math.random() * 5) - 2,
        tauxApprobation: 75 + Math.random() * 8,
        portefeuilleRisque: 2.0 + Math.random() * 0.6
      }));
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleSimulatedAction = (message) => {
    window.safeGlobalToast({ title: "Action Simulée", description: message });
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'Approuvé': return 'bg-green-100 text-green-800';
      case 'En analyse': return 'bg-blue-100 text-blue-800';
      case 'En attente docs': return 'bg-yellow-100 text-yellow-800';
      case 'Refusé': return 'bg-red-100 text-red-800';
      case 'Suspendu': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 800) return 'text-green-600 font-bold';
    if (score >= 700) return 'text-blue-600 font-bold';
    if (score >= 600) return 'text-orange-600 font-bold';
    return 'text-red-600 font-bold';
  };

  const formatMontant = (montant) => {
    if (montant >= 1000000000) {
      return (montant / 1000000000).toFixed(1) + 'Md';
    } else if (montant >= 1000000) {
      return (montant / 1000000).toFixed(0) + 'M';
    }
    return montant.toLocaleString();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* KPIs Principaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium">Crédits Immobiliers</p>
                      <p className="text-3xl font-bold">{banqueMetrics.creditsImmobiliers.toLocaleString()}</p>
                      <p className="text-emerald-100 text-xs mt-1">Dossiers actifs</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Building2 className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Montant Total</p>
                      <p className="text-3xl font-bold">{formatMontant(banqueMetrics.montantTotal)}</p>
                      <p className="text-blue-100 text-xs mt-1">FCFA engagés</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Banknote className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-violet-500 to-purple-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-violet-100 text-sm font-medium">Taux d'Approbation</p>
                      <p className="text-3xl font-bold">{banqueMetrics.tauxApprobation.toFixed(1)}%</p>
                      <p className="text-violet-100 text-xs mt-1">Performance commerciale</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Risque Portefeuille</p>
                      <p className="text-3xl font-bold">{banqueMetrics.portefeuilleRisque.toFixed(1)}%</p>
                      <p className="text-orange-100 text-xs mt-1">Taux de défaut</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Shield className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Graphiques Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Évolution Crédits */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Évolution des Crédits Immobiliers
                  </CardTitle>
                  <CardDescription className="text-emerald-100">
                    Montants et nombre de dossiers par mois
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData.evolutionCredits}>
                      <defs>
                        <linearGradient id="colorMontant" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorCredits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mois" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'montant' ? formatMontant(value) + ' FCFA' : value,
                          name === 'montant' ? 'Montant' : 'Nombre'
                        ]}
                      />
                      <Legend />
                      <Area 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="montant" 
                        stroke="#10B981" 
                        fillOpacity={1} 
                        fill="url(#colorMontant)" 
                        name="Montant (Md FCFA)"
                      />
                      <Area 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="credits" 
                        stroke="#3B82F6" 
                        fillOpacity={1} 
                        fill="url(#colorCredits)" 
                        name="Nombre de crédits"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Types de Crédits */}
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Répartition Types de Crédits
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Distribution par finalité de financement
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData.typesCredits}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, pourcentage }) => `${type} (${pourcentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="nombre"
                      >
                        {chartData.typesCredits.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.couleur} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [
                          value + ' crédits',
                          'Nombre'
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {chartData.typesCredits.map((type, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: type.couleur }}
                          ></div>
                          <span>{type.type}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{type.nombre} crédits</div>
                          <div className="text-xs text-gray-500">{formatMontant(type.montant)} FCFA</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'evaluations':
        return (
          <div className="space-y-8">
            {/* Demandes de Crédits */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Demandes de Crédits en Traitement
                </CardTitle>
                <CardDescription className="text-violet-100">
                  Pipeline des dossiers en cours d'instruction
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {demandesCredits.map((demande) => (
                    <motion.div
                      key={demande.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gradient-to-r from-gray-50 to-violet-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-violet-500" />
                            {demande.client}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {demande.type} • {formatMontant(demande.montant)} FCFA • {demande.agence}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatutColor(demande.statut)}>
                            {demande.statut}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Calculator className="h-3 w-3" />
                          Score: <span className={getScoreColor(demande.score)}>{demande.score}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          {demande.garantie}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {demande.delai} jours
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${demande.progression}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Avancement: {demande.progression}%
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Performance des Agences */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Performance par Agence Bancaire
                </CardTitle>
                <CardDescription className="text-cyan-100">
                  Analyse comparative des agences pour les crédits immobiliers
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.performanceAgences} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="agence" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'montant' ? formatMontant(value) + ' FCFA' : 
                        name === 'taux' ? value + '%' : value,
                        name === 'montant' ? 'Montant' : 
                        name === 'taux' ? 'Taux approbation' : 'Nombre'
                      ]}
                    />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="credits" 
                      fill="#06B6D4" 
                      name="Nombre crédits"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      yAxisId="right"
                      dataKey="taux" 
                      fill="#10B981" 
                      name="Taux approbation (%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        );
      case 'reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Rapports et Analyses Avancées</CardTitle>
              <CardDescription>Générez des rapports personnalisés et accédez à des analyses approfondies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-md">
                <h3 className="font-semibold text-sm mb-2">Rapport de Portefeuille Mensuel</h3>
                <p className="text-xs text-muted-foreground mb-2">Synthèse de la performance, évaluation des risques et évolution de la valeur de votre portefeuille.</p>
                <Button onClick={() => handleSimulatedAction("Génération du rapport de portefeuille (Septembre 2025).")}>
                  <Download className="mr-2 h-4 w-4"/>Générer Rapport (Sept 2025)
                </Button>
              </div>
              <div className="p-4 border rounded-md">
                <h3 className="font-semibold text-sm mb-2">Analyse de Risque par Zone</h3>
                <p className="text-xs text-muted-foreground mb-2">Comparez les niveaux de risque, les types de litiges fréquents et les tendances d'évolution par zone géographique.</p>
                <Select onValueChange={(value) => handleSimulatedAction(`Génération rapport risque pour ${value}.`)}>
                  <SelectTrigger className="w-full sm:w-[220px]">
                    <SelectValue placeholder="Sélectionner une zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dakar_plateau">Dakar Plateau</SelectItem>
                    <SelectItem value="almadies">Almadies</SelectItem>
                    <SelectItem value="diamniadio_pole">Diamniadio Pôle Urbain</SelectItem>
                    <SelectItem value="saly_portudal">Saly Portudal</SelectItem>
                    <SelectItem value="thies_ville">Thiès Ville</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 border rounded-md">
                <h3 className="font-semibold text-sm mb-2">Simulation de Scénarios de Portefeuille</h3>
                <p className="text-xs text-muted-foreground mb-2">Testez l'impact de l'ajout ou de la cession d'actifs sur la performance globale de votre portefeuille.</p>
                <Button variant="outline" onClick={() => handleSimulatedAction("Ouverture du module de simulation de scénarios.")}>
                  Lancer une Simulation
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      default: 
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* En-tête Dashboard */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Dashboard Bancaire Immobilier
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Plateforme de gestion des crédits immobiliers, analyse des risques et 
            monitoring de la performance du portefeuille bancaire
          </motion.p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-primary flex items-center">
              <Banknote className="h-6 w-6 mr-3 text-emerald-600"/>
              Institutions Financières
            </h2>
            <p className="text-muted-foreground">Outils et analyses pour la gestion des actifs fonciers et l'évaluation des risques.</p>
          </div>
          <Button onClick={() => handleSimulatedAction("Nouvelle évaluation de crédit immobilier.")}>
            <PlusCircle className="mr-2 h-4 w-4"/> Nouveau Crédit
          </Button>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {['overview', 'evaluations', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab === 'overview' ? 'Vue d\'ensemble' : tab === 'evaluations' ? 'Crédits Détaillés' : 'Rapports & Analyses'}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {renderTabContent()}
        </div>

        {/* Métriques Complémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm font-medium">Clients Actifs</p>
                  <p className="text-3xl font-bold">{banqueMetrics.clientsActifs.toLocaleString()}</p>
                  <p className="text-teal-100 text-xs mt-1">Base clientèle</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <Users className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Délai Traitement</p>
                  <p className="text-3xl font-bold">{banqueMetrics.delaiTraitement}</p>
                  <p className="text-indigo-100 text-xs mt-1">jours moyens</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Revenus Crédits</p>
                  <p className="text-3xl font-bold">{formatMontant(banqueMetrics.revenus)}</p>
                  <p className="text-green-100 text-xs mt-1">FCFA semestriel</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <DollarSign className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-rose-500 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium">Croissance</p>
                  <p className="text-3xl font-bold">{banqueMetrics.croissance.toFixed(1)}%</p>
                  <p className="text-pink-100 text-xs mt-1">Évolution annuelle</p>
                </div>
                <div className="bg-white/20 p-3 rounded-lg">
                  <TrendingUp className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BanquesDashboardPage;

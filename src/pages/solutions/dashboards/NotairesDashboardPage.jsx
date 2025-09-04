import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileClock, Search, PlusCircle, Users, Gavel, Scale, Download, History, Eye, 
  CheckCircle, XCircle, AlertTriangle, Clock, FileText, Stamp, Shield, 
  TrendingUp, BarChart3, Activity, Calendar, Archive, BookOpen, Award, 
  Target, Zap, Monitor, FileCheck, Timer, AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const NotairesDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dossiers');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDossier, setCurrentDossier] = useState(null);

  // Analytics juridiques avancées
  const [legalAnalytics, setLegalAnalytics] = useState({
    totalActes: 347,
    monthlyActes: 45,
    averageProcessingTime: 7.5,
    complianceRate: 96.8,
    pendingDossiers: 12,
    authenticatedThisWeek: 8,
    revenueThisMonth: 2100000,
    clientSatisfaction: 94,
    performanceScore: 92,
    urgentCases: 3,
    complexCases: 5,
    standardCases: 28
  });

  // Données graphiques pour analytics juridiques
  const [chartData, setChartData] = useState({
    weeklyActivity: [
      { day: 'Lun', actes: 12, verifications: 8, consultations: 15 },
      { day: 'Mar', actes: 15, verifications: 10, consultations: 12 },
      { day: 'Mer', actes: 8, verifications: 6, consultations: 18 },
      { day: 'Jeu', actes: 18, verifications: 12, consultations: 10 },
      { day: 'Ven', actes: 22, verifications: 15, consultations: 8 },
      { day: 'Sam', actes: 5, verifications: 3, consultations: 20 }
    ],
    dossierDistribution: [
      { type: 'Vente immobilière', count: 156, percentage: 45, color: '#8884d8' },
      { type: 'Succession', count: 89, percentage: 26, color: '#82ca9d' },
      { type: 'Donation', count: 52, percentage: 15, color: '#ffc658' },
      { type: 'Hypothèque', count: 35, percentage: 10, color: '#ff7300' },
      { type: 'Autres', count: 15, percentage: 4, color: '#00ff88' }
    ],
    processingTimes: [
      { month: 'Jan', temps: 8.2, dossiers: 38 },
      { month: 'Fév', temps: 7.8, dossiers: 42 },
      { month: 'Mar', temps: 7.5, dossiers: 45 },
      { month: 'Avr', temps: 7.2, dossiers: 48 },
      { month: 'Mai', temps: 7.0, dossiers: 52 },
      { month: 'Juin', temps: 7.5, dossiers: 45 }
    ]
  });

  // Timeline workflow juridique
  const [workflowActivities, setWorkflowActivities] = useState([
    {
      id: 1,
      type: 'authentication',
      title: 'Acte authentifié',
      description: 'Vente Villa Almadies - 180M FCFA',
      time: 'Il y a 30 minutes',
      status: 'completed',
      priority: 'normal',
      clientName: 'M. Diallo'
    },
    {
      id: 2,
      type: 'verification',
      title: 'Vérification en cours',
      description: 'Succession - Terrain Yoff',
      time: 'Il y a 1 heure',
      status: 'in_progress',
      priority: 'high',
      clientName: 'Mme. Fall'
    },
    {
      id: 3,
      type: 'consultation',
      title: 'Consultation programmée',
      description: 'Donation entre vifs - Bureau Plateau',
      time: 'Demain 10h',
      status: 'scheduled',
      priority: 'medium',
      clientName: 'SCI Teranga'
    },
    {
      id: 4,
      type: 'compliance',
      title: 'Contrôle conformité',
      description: 'Hypothèque conventionnelle - Appartement',
      time: 'Il y a 2 heures',
      status: 'review',
      priority: 'high',
      clientName: 'M. Niang'
    }
  ]);

  const getWorkflowIcon = (type) => {
    switch (type) {
      case 'authentication': return <Stamp className="h-4 w-4 text-green-500" />;
      case 'verification': return <Shield className="h-4 w-4 text-blue-500" />;
      case 'consultation': return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'compliance': return <FileCheck className="h-4 w-4 text-yellow-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case 'in_progress': return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'scheduled': return <Badge className="bg-purple-100 text-purple-800">Programmé</Badge>;
      case 'review': return <Badge className="bg-yellow-100 text-yellow-800">À réviser</Badge>;
      case 'Terminé': return <Badge variant="default" className="bg-green-100 text-green-800">{status}</Badge>;
      case 'En cours': case 'Confirmée': return <Badge variant="default">{status}</Badge>;
      case 'Nouveau': return <Badge className="bg-orange-100 text-orange-800">{status}</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">Urgent</Badge>;
      case 'medium': return <Badge variant="default">Moyen</Badge>;
      case 'low': return <Badge variant="secondary">Normal</Badge>;
      default: return <Badge variant="outline">Standard</Badge>;
    }
  };

  const handleAction = (action, dossierId = '') => {
    window.safeGlobalToast({
      title: "Action Simulée",
      description: `${action} ${dossierId ? `pour le dossier ${dossierId}` : ''}`,
    });
  };
  
  const openModal = (dossier) => {
    setCurrentDossier(dossier);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
      setIsModalOpen(false);
      setCurrentDossier(null);
  }

  const handleDecision = (decision) => {
    if (!currentDossier) return;
    window.safeGlobalToast({
        title: "Décision Enregistrée",
        description: `La décision '${decision}' a été enregistrée pour le dossier ${currentDossier.id}.`,
    });
    closeModal();
  };

  const stats = [
    { 
      title: "Actes Authentifiés", 
      value: legalAnalytics.totalActes, 
      subtext: `+${legalAnalytics.monthlyActes} ce mois`,
      icon: Stamp, 
      color: "text-green-500",
      gradient: "from-green-50 to-green-100 border-green-200"
    },
    { 
      title: "Temps Moyen Traitement", 
      value: `${legalAnalytics.averageProcessingTime}j`, 
      subtext: "-0.5j vs mois dernier",
      icon: Timer, 
      color: "text-blue-500",
      gradient: "from-blue-50 to-blue-100 border-blue-200"
    },
    { 
      title: "Taux de Conformité", 
      value: `${legalAnalytics.complianceRate}%`, 
      subtext: "Excellent niveau",
      icon: Shield, 
      color: "text-purple-500",
      gradient: "from-purple-50 to-purple-100 border-purple-200"
    },
    { 
      title: "Dossiers en Attente", 
      value: legalAnalytics.pendingDossiers, 
      subtext: `${legalAnalytics.urgentCases} urgents`,
      icon: FileClock, 
      color: "text-orange-500",
      gradient: "from-orange-50 to-orange-100 border-orange-200"
    },
  ];

  const recentActivities = [
    { id: 'ACT-001', type: 'Vérification', parcelRef: 'dk-alm-002', status: 'En cours', date: 'Aujourd\'hui' },
    { id: 'ACT-002', type: 'Authentification', parcelRef: 'sly-ngp-010', status: 'Terminé', date: 'Hier' },
    { id: 'ACT-003', type: 'Demande de certification', parcelRef: 'dmn-cit-005', status: 'Nouveau', date: 'Il y a 2 jours' },
    { id: 'ACT-004', type: 'Consultation', parcelRef: 'ths-ext-021', status: 'Confirmée', date: 'Demain à 10h' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Card className={`bg-gradient-to-br ${stat.gradient}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Analytics Juridiques Avancées */}
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="mr-2 h-5 w-5"/>
                        Analytics d'Activité Hebdomadaire
                      </CardTitle>
                      <CardDescription>Performance et charge de travail par jour</CardDescription>
                    </div>
                    <Badge variant="secondary">Semaine courante</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.weeklyActivity}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="actes" fill="#8884d8" name="Actes" />
                        <Bar dataKey="verifications" fill="#82ca9d" name="Vérifications" />
                        <Bar dataKey="consultations" fill="#ffc658" name="Consultations" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5"/>
                    Performance Mensuelle
                  </CardTitle>
                  <CardDescription>Indicateurs clés de performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Objectif mensuel</span>
                      <span className="text-sm text-muted-foreground">
                        {legalAnalytics.monthlyActes}/50 actes
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(legalAnalytics.monthlyActes / 50) * 100}%` }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">90% de l'objectif atteint</p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Satisfaction client</span>
                      <Badge className="bg-green-100 text-green-800">{legalAnalytics.clientSatisfaction}%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Revenus ce mois</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {(legalAnalytics.revenueThisMonth / 1000).toFixed(0)}K FCFA
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Score performance</span>
                      <Badge variant="secondary">{legalAnalytics.performanceScore}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Distribution des Dossiers et Temps de Traitement */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5"/>
                    Répartition des Dossiers
                  </CardTitle>
                  <CardDescription>Types d'actes traités cette année</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.dossierDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ type, percentage }) => `${type}: ${percentage}%`}
                        >
                          {chartData.dossierDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Timer className="mr-2 h-5 w-5"/>
                    Évolution Temps de Traitement
                  </CardTitle>
                  <CardDescription>Optimisation des délais sur 6 mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData.processingTimes}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'temps' ? `${value} jours` : value,
                            name === 'temps' ? 'Temps moyen' : 'Nb dossiers'
                          ]}
                        />
                        <Line type="monotone" dataKey="temps" stroke="#8884d8" strokeWidth={2} />
                        <Line type="monotone" dataKey="dossiers" stroke="#82ca9d" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="mr-2 h-5 w-5"/>
                      Accès Rapides
                    </CardTitle>
                    <CardDescription>Actions fréquentes et outils essentiels</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex-col" onClick={() => handleAction("Lancement d'une nouvelle procédure.")}>
                      <PlusCircle className="h-6 w-6 mb-1"/>
                      Nouvelle Procédure
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => handleAction("Recherche dans les archives.")}>
                      <Archive className="h-6 w-6 mb-1"/>
                      Archives
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => handleAction("Ouverture du module de conformité.")}>
                      <Shield className="h-6 w-6 mb-1"/>
                      Conformité
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => handleAction("Téléchargement des modèles d'actes.")}>
                      <Download className="h-6 w-6 mb-1"/>
                      Modèles
                    </Button>
                </CardContent>
            </Card>
          </>
        );
      case 'dossiers':
        return (
          <>
            {/* Timeline Workflow Juridique */}
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5"/>
                    Timeline Workflow Juridique
                  </CardTitle>
                  <CardDescription>Suivi en temps réel des procédures et actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {workflowActivities.map(activity => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        {getWorkflowIcon(activity.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <div className="flex items-center space-x-2">
                              {getPriorityBadge(activity.priority)}
                              {getStatusBadge(activity.status)}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                            <Badge variant="outline" className="text-xs">
                              {activity.clientName}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="mr-2 h-5 w-5"/>
                    État des Dossiers
                  </CardTitle>
                  <CardDescription>Répartition par statut et priorité</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Dossiers urgents</span>
                      <Badge variant="destructive">{legalAnalytics.urgentCases}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Dossiers complexes</span>
                      <Badge className="bg-yellow-100 text-yellow-800">{legalAnalytics.complexCases}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Dossiers standard</span>
                      <Badge className="bg-green-100 text-green-800">{legalAnalytics.standardCases}</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Actions Rapides</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleAction("Nouveaux dossiers urgents")}>
                        <AlertCircle className="mr-2 h-4 w-4"/>
                        Traiter urgents ({legalAnalytics.urgentCases})
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleAction("Planification consultations")}>
                        <Calendar className="mr-2 h-4 w-4"/>
                        Programmer consultations
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => handleAction("Génération rapport")}>
                        <BarChart3 className="mr-2 h-4 w-4"/>
                        Rapport d'activité
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Table Gestion Dossiers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5"/>
                  Gestion des Dossiers Actifs
                </CardTitle>
                <CardDescription>Suivi des dernières opérations et demandes avec actions.</CardDescription>
                <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 mt-2">
                  <Input type="search" placeholder="Rechercher par réf, client, type..." className="w-full sm:w-[300px]" />
                  <Select>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filtrer par statut" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">Tous statuts</SelectItem>
                          <SelectItem value="nouveau">Nouveau</SelectItem>
                          <SelectItem value="en_cours">En cours</SelectItem>
                          <SelectItem value="termine">Terminé</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                  </Select>
                  <Select>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Type de procédure" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="all">Tous types</SelectItem>
                          <SelectItem value="vente">Vente immobilière</SelectItem>
                          <SelectItem value="succession">Succession</SelectItem>
                          <SelectItem value="donation">Donation</SelectItem>
                          <SelectItem value="hypotheque">Hypothèque</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2 font-medium">Référence</th>
                        <th className="text-left py-2 px-2 font-medium">Type</th>
                        <th className="text-left py-2 px-2 font-medium">Client</th>
                        <th className="text-left py-2 px-2 font-medium">Parcelle</th>
                        <th className="text-left py-2 px-2 font-medium">Statut</th>
                        <th className="text-left py-2 px-2 font-medium">Priorité</th>
                        <th className="text-right py-2 px-2 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivities.map(activity => (
                        <tr key={activity.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-2 font-medium font-mono text-sm">{activity.id}</td>
                          <td className="py-3 px-2">
                            <Badge variant="outline" className="text-xs">
                              {activity.type}
                            </Badge>
                          </td>
                          <td className="py-3 px-2 font-medium">
                            {['M. Diallo', 'Mme. Fall', 'SCI Teranga', 'M. Niang'][Math.floor(Math.random() * 4)]}
                          </td>
                          <td className="py-3 px-2 font-mono text-sm text-primary hover:underline">
                            <Link to={`/parcelles/${activity.parcelRef}`}>
                              {activity.parcelRef}
                            </Link>
                          </td>
                          <td className="py-3 px-2">
                            {getStatusBadge(activity.status)}
                          </td>
                          <td className="py-3 px-2">
                            {getPriorityBadge(['high', 'medium', 'low'][Math.floor(Math.random() * 3)])}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <Button variant="ghost" size="sm" onClick={() => openModal(activity)}>
                                <Eye className="h-4 w-4"/>
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => openModal(activity)}>
                                Instruire
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 md:p-6 lg:p-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold flex items-center"><Scale className="h-8 w-8 mr-3 text-indigo-600"/>Tableau de Bord Notaire</h1>
        </div>
        <Button onClick={() => handleAction("Lancement d'une nouvelle procédure d'authentification")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Nouvelle Procédure
        </Button>
      </div>

       <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['dossiers', 'overview'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab === 'dossiers' ? 'Gestion des Dossiers' : 'Vue d\'ensemble'}
            </button>
          ))}
        </nav>
      </div>

       <div className="mt-6">
        {renderTabContent()}
      </div>
    </motion.div>
    
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Instruction du Dossier: {currentDossier?.id}</DialogTitle>
          <DialogDescription>
            Examinez les documents et statuez sur le dossier.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <p><span className="font-semibold">Parcelle:</span> <Link to={`/parcelles/${currentDossier?.parcelRef}`} className="text-primary underline">{currentDossier?.parcelRef}</Link></p>
          <p><span className="font-semibold">Type de procédure:</span> {currentDossier?.type}</p>
          <div className="space-y-2 pt-2">
            <h4 className="font-semibold">Documents à vérifier (Simulation)</h4>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Acte de vente préliminaire <Button variant="link" size="sm" className="p-0 h-auto ml-2" onClick={() => handleAction("Visualisation de l'acte de vente.")}>Voir</Button></li>
              <li>Certificat de propriété <Button variant="link" size="sm" className="p-0 h-auto ml-2" onClick={() => handleAction("Visualisation du certificat.")}>Voir</Button></li>
              <li>Rapport de conformité urbanisme <Badge variant="success">Conforme</Badge></li>
            </ul>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
            <Button type="button" variant="destructive" onClick={() => handleDecision('Rejet avec réserves')}>Rejeter avec Réserves</Button>
            <div className="space-x-2">
                <Button type="button" variant="outline" onClick={closeModal}>Fermer</Button>
                <Button type="button" onClick={() => handleDecision('Validé et authentifié')}>Valider et Authentifier</Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default NotairesDashboardPage;

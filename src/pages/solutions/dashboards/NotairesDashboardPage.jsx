import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { 
  FileClock, 
  Search, 
  PlusCircle, 
  Users, 
  Gavel, 
  Scale, 
  Download, 
  History, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Stamp, 
  Shield, 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Calendar, 
  Archive, 
  BookOpen, 
  Award, 
  Target, 
  Zap, 
  Monitor, 
  FileCheck, 
  Timer, 
  AlertCircle
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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dossiers');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDossier, setCurrentDossier] = useState(null);

  // Analytics juridiques avancées
  const [legalAnalytics, setLegalAnalytics] = useState({
    totalActes: 0,
    monthlyActes: 0,
    averageProcessingTime: 7.5,
    complianceRate: 96.8,
    pendingDossiers: 0,
    authenticatedThisWeek: 0,
    revenueThisMonth: 0,
    clientSatisfaction: 94,
    performanceScore: 92,
    urgentCases: 0,
    complexCases: 0,
    standardCases: 0
  });

  // Données graphiques pour analytics juridiques
  const [chartData, setChartData] = useState({
    weeklyActivity: [],
    dossierDistribution: [],
    processingTimes: []
  });

  // Timeline workflow juridique
  const [workflowActivities, setWorkflowActivities] = useState([]);

  // Charger les données depuis Supabase
  useEffect(() => {
    if (user) {
      loadNotaryData();
    }
  }, [user]);

  const loadNotaryData = async () => {
    try {
      // Récupérer les transactions pour simuler les actes notariés
      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          *,
          parcels(
            id,
            title,
            price,
            location,
            region,
            departement,
            commune
          )
        `)
        .order('created_at', { ascending: false });

      if (transactionsError) {
        console.error('Erreur lors du chargement des transactions:', transactionsError);
        return;
      }

      // Récupérer les demandes pour simuler les dossiers en cours
      const { data: requests, error: requestsError } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('Erreur lors du chargement des demandes:', requestsError);
        return;
      }

      // Calculer les métriques
      const totalActes = transactions?.length || 0;
      const thisMonth = new Date();
      thisMonth.setMonth(thisMonth.getMonth());
      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - 7);

      const monthlyActes = transactions?.filter(t => {
        const created = new Date(t.created_at);
        return created.getMonth() === thisMonth.getMonth() && 
               created.getFullYear() === thisMonth.getFullYear();
      })?.length || 0;

      const authenticatedThisWeek = transactions?.filter(t => {
        const created = new Date(t.created_at);
        return created >= thisWeek;
      })?.length || 0;

      const pendingDossiers = requests?.filter(r => r.status === 'pending')?.length || 0;
      const revenueThisMonth = transactions?.filter(t => {
        const created = new Date(t.created_at);
        return created.getMonth() === thisMonth.getMonth() && 
               created.getFullYear() === thisMonth.getFullYear();
      }).reduce((sum, t) => sum + (t.amount * 0.02 || 0), 0) || 0; // 2% commission notariale

      setLegalAnalytics({
        totalActes,
        monthlyActes,
        averageProcessingTime: 7.5,
        complianceRate: 96.8,
        pendingDossiers,
        authenticatedThisWeek,
        revenueThisMonth,
        clientSatisfaction: 94,
        performanceScore: 92,
        urgentCases: Math.floor(pendingDossiers * 0.25),
        complexCases: Math.floor(pendingDossiers * 0.4),
        standardCases: Math.ceil(pendingDossiers * 0.35)
      });

      // Générer les données de graphiques
      generateChartData(transactions, requests);
      generateWorkflowActivities(transactions, requests);

    } catch (error) {
      console.error('Erreur lors du chargement des données notariales:', error);
    }
  };

  const generateChartData = (transactions, requests) => {
    // Activité hebdomadaire
    const weeklyActivity = [
      { day: 'Lun', actes: 0, verifications: 0, consultations: 0 },
      { day: 'Mar', actes: 0, verifications: 0, consultations: 0 },
      { day: 'Mer', actes: 0, verifications: 0, consultations: 0 },
      { day: 'Jeu', actes: 0, verifications: 0, consultations: 0 },
      { day: 'Ven', actes: 0, verifications: 0, consultations: 0 },
      { day: 'Sam', actes: 0, verifications: 0, consultations: 0 }
    ];

    // Remplir avec des données basées sur les transactions
    transactions?.forEach(t => {
      const day = new Date(t.created_at).getDay();
      if (day >= 1 && day <= 6) {
        const dayIndex = day - 1;
        weeklyActivity[dayIndex].actes += 1;
        if (t.status === 'pending') weeklyActivity[dayIndex].verifications += 1;
        else weeklyActivity[dayIndex].consultations += 1;
      }
    });

    // Distribution des dossiers par région
    const regions = [...new Set(transactions?.map(t => t.parcels?.region).filter(Boolean))];
    const dossierDistribution = regions.slice(0, 5).map((region, index) => {
      const count = transactions?.filter(t => t.parcels?.region === region)?.length || 0;
      const percentage = transactions?.length ? (count / transactions.length) * 100 : 0;
      const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88'];
      
      return {
        type: `Dossiers ${region}`,
        count,
        percentage: Math.round(percentage),
        color: colors[index % colors.length]
      };
    });

    // Temps de traitement par mois (simulé)
    const processingTimes = [
      { month: 'Jan', temps: 8.2, dossiers: Math.floor(Math.random() * 20) + 30 },
      { month: 'Fév', temps: 7.8, dossiers: Math.floor(Math.random() * 20) + 35 },
      { month: 'Mar', temps: 7.5, dossiers: Math.floor(Math.random() * 20) + 40 },
      { month: 'Avr', temps: 7.2, dossiers: Math.floor(Math.random() * 20) + 45 },
      { month: 'Mai', temps: 7.0, dossiers: Math.floor(Math.random() * 20) + 50 },
      { month: 'Juin', temps: 7.5, dossiers: transactions?.length || 45 }
    ];

    setChartData({
      weeklyActivity,
      dossierDistribution,
      processingTimes
    });
  };

  const generateWorkflowActivities = (transactions, requests) => {
    const activities = [];
    
    // Ajouter quelques transactions récentes comme activités
    transactions?.slice(0, 3).forEach((transaction, index) => {
      activities.push({
        id: activities.length + 1,
        type: transaction.status === 'completed' ? 'authentication' : 'verification',
        title: transaction.status === 'completed' ? 'Acte authentifié' : 'Vérification en cours',
        description: `${transaction.parcels?.title || 'Transaction'} - ${transaction.amount ? (transaction.amount / 1000000).toFixed(1) + 'M FCFA' : 'Montant non spécifié'}`,
        time: getTimeAgo(transaction.created_at),
        status: transaction.status === 'completed' ? 'completed' : 'in_progress',
        priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'normal',
        clientName: `Client ${transaction.id.slice(0, 8)}`
      });
    });

    // Ajouter quelques demandes comme consultations
    requests?.slice(0, 2).forEach((request, index) => {
      activities.push({
        id: activities.length + 1,
        type: 'consultation',
        title: 'Consultation programmée',
        description: `${request.request_type} - ${request.message?.substring(0, 50) || 'Demande en attente'}`,
        time: 'Demain 10h',
        status: 'scheduled',
        priority: 'medium',
        clientName: `Demandeur ${request.id.slice(0, 8)}`
      });
    });

    setWorkflowActivities(activities);
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} minutes`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)} heures`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)} jours`;
  };

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
            Examinez les FileTexts et statuez sur le dossier.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <p><span className="font-semibold">Parcelle:</span> <Link to={`/parcelles/${currentDossier?.parcelRef}`} className="text-primary underline">{currentDossier?.parcelRef}</Link></p>
          <p><span className="font-semibold">Type de procédure:</span> {currentDossier?.type}</p>
          <div className="space-y-2 pt-2">
            <h4 className="font-semibold">FileTexts à vérifier (Simulation)</h4>
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

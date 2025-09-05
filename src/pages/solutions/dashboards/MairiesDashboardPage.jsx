import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
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
  Landmark, 
  FileSignature, 
  LandPlot, 
  AlertTriangle, 
  Map as MapIcon, 
  Library, 
  Construction, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle, 
  UserCheck, 
  Building, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Calendar, 
  Target, 
  Globe, 
  Shield
} from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { sampleParcels, sampleRequests, sampleUsers } from '@/data';
import { LoadingSpinner } from '@/components/ui/spinner';
import { InstructionModal, AttributionModal, GenericActionModal } from './mairies/MairiesDashboardModals';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const MairiesDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ type: null, data: null });
  const [municipalParcels, setMunicipalParcels] = useState([]);
  const [requestsForTable, setRequestsForTable] = useState([]);
  const [attributionParcel, setAttributionParcel] = useState('');
  const navigate = useNavigate();

  // États pour analytics avancés
  const [analytics, setAnalytics] = useState({
    totalRequests: 0,
    newRequests: 0,
    processedRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    avgProcessingTime: 0,
    municipalLands: 0,
    availableLands: 0,
    attributedLands: 0,
    activeCitizens: 0,
    monthlyGrowth: 0,
    satisfactionRate: 0
  });

  const [chartData, setChartData] = useState({
    monthlyRequests: [],
    requestsByType: [],
    processingTime: [],
    landDistribution: [],
    citizenActivity: [],
    performanceMetrics: []
  });

  const [activityTimeline, setActivityTimeline] = useState([]);

  const openModal = (type, data) => {
    setModalContent({ type, data });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent({ type: null, data: null });
  };

  const handleOpenInstructionModal = (request) => {
    const user = sampleUsers.find(u => u.id === request.user_id);
    const parcel = sampleParcels.find(p => p.id === request.parcel_id);
    
    const modalType = request.request_type === 'Attribution de terrain' ? 'attribution' : 'permit';
    openModal(modalType, { request, user, parcel });
  };

  const handleDecision = (request, decision, note) => {
    const newHistoryEntry = {
      date: new Date(),
      action: `Demande ${decision}`,
      agent: 'Agent Mairie',
      note: note || `La demande a été ${decision}.`
    };
    
    setRequestsForTable(prev => prev.map(req => 
      req.id === request.id ? 
        {...req, status: decision, history: [...(req.history || []), newHistoryEntry]} : 
        req
    ));
    closeModal();
    
    if (typeof window !== 'undefined' && window.safeGlobalToast) {
      window.safeGlobalToast({
        title: `Demande ${decision}`,
        description: `La demande #${request.id} a été ${decision}.`,
      });
    }
  };

  const handleContactApplicant = (userId, requestId) => {
    if (typeof window !== 'undefined' && window.safeGlobalToast) {
      window.safeGlobalToast({
        title: "Contact Demandeur",
        description: `Prise de contact avec le demandeur pour la demande #${requestId}.`,
      });
    }
  };

  const handleAttribution = (request) => {
    if (!attributionParcel) {
      if (typeof window !== 'undefined' && window.safeGlobalToast) {
        window.safeGlobalToast({
          title: "Erreur",
          description: "Veuillez sélectionner une parcelle à attribuer.",
          variant: 'destructive'
        });
      }
      return;
    }

    const decision = 'Approuvée';
    const newHistoryEntry = {
      date: new Date(),
      action: 'Parcelle Attribuée',
      agent: 'Agent Mairie',
      note: `Parcelle ${attributionParcel} attribuée au demandeur.`
    };
    
    setRequestsForTable(prev => prev.map(req => 
      req.id === request.id ? 
        {...req, status: decision, history: [...(req.history || []), newHistoryEntry]} : 
        req
    ));
    closeModal();
    
    if (typeof window !== 'undefined' && window.safeGlobalToast) {
      window.safeGlobalToast({
        title: "Parcelle Attribuée",
        description: `La parcelle ${attributionParcel} a été attribuée au demandeur pour le dossier ${request.id}.`,
      });
    }
    setAttributionParcel('');
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Simulation de chargement des données
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mairieName = "Mairie de Saly";
        const mairieParcels = sampleParcels.filter(p => p.ownerType === 'Mairie' && p.zone === 'Saly');
        const requestsForMairie = sampleRequests.map(r => ({...r, history: r.history || []}))
                                                .filter(r => r.recipient === mairieName || 
                                                        sampleParcels.find(p => p.id === r.parcel_id)?.zone === 'Saly');
        
        setMunicipalParcels(mairieParcels);
        setRequestsForTable(requestsForMairie);

        // Générer les analytics avancés
        generateAdvancedAnalytics(requestsForMairie, mairieParcels);
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const generateAdvancedAnalytics = (requests, parcels) => {
    // Calcul des métriques de base
    const totalRequests = requests.length;
    const newRequests = requests.filter(r => r.status === 'Nouvelle').length;
    const processedRequests = requests.filter(r => r.status !== 'Nouvelle').length;
    const approvedRequests = requests.filter(r => r.status === 'Approuvée').length;
    const rejectedRequests = requests.filter(r => r.status === 'Rejetée').length;
    const municipalLands = parcels.length;
    const availableLands = parcels.filter(p => p.status === 'Disponible').length;
    const attributedLands = parcels.filter(p => p.status === 'Attribuée').length;

    // Calculs avancés
    const avgProcessingTime = calculateAverageProcessingTime(requests);
    const monthlyGrowth = calculateMonthlyGrowth(requests);
    const satisfactionRate = calculateSatisfactionRate(requests);
    const activeCitizens = calculateActiveCitizens(requests);

    setAnalytics({
      totalRequests,
      newRequests,
      processedRequests,
      approvedRequests,
      rejectedRequests,
      avgProcessingTime,
      municipalLands,
      availableLands,
      attributedLands,
      activeCitizens,
      monthlyGrowth,
      satisfactionRate
    });

    // Génération des données pour graphiques
    setChartData({
      monthlyRequests: generateMonthlyRequestsData(requests),
      requestsByType: generateRequestsByTypeData(requests),
      processingTime: generateProcessingTimeData(requests),
      landDistribution: generateLandDistributionData(parcels),
      citizenActivity: generateCitizenActivityData(requests),
      performanceMetrics: generatePerformanceMetricsData(requests)
    });

    // Timeline d'activité
    setActivityTimeline(generateActivityTimeline(requests));
  };

  const calculateAverageProcessingTime = (requests) => {
    const processedRequests = requests.filter(r => r.status !== 'Nouvelle' && r.created_at);
    if (processedRequests.length === 0) return 0;
    
    const totalDays = processedRequests.reduce((sum, req) => {
      const created = new Date(req.created_at);
      const processed = new Date(); // Simulation
      const diffTime = Math.abs(processed - created);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return sum + diffDays;
    }, 0);
    
    return Math.round(totalDays / processedRequests.length);
  };

  const calculateMonthlyGrowth = (requests) => {
    const thisMonth = new Date();
    const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1);
    
    const thisMonthReqs = requests.filter(r => 
      new Date(r.created_at) >= lastMonth
    ).length;
    
    const prevMonthReqs = requests.filter(r => {
      const reqDate = new Date(r.created_at);
      return reqDate < lastMonth && reqDate >= new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1);
    }).length;
    
    return prevMonthReqs > 0 ? ((thisMonthReqs - prevMonthReqs) / prevMonthReqs * 100) : 0;
  };

  const calculateSatisfactionRate = (requests) => {
    const approvedReqs = requests.filter(r => r.status === 'Approuvée').length;
    const totalProcessed = requests.filter(r => r.status !== 'Nouvelle').length;
    return totalProcessed > 0 ? Math.round((approvedReqs / totalProcessed) * 100) : 0;
  };

  const calculateActiveCitizens = (requests) => {
    const uniqueUsers = new Set(requests.map(r => r.user_id));
    return uniqueUsers.size;
  };

  const generateMonthlyRequestsData = (requests) => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        month: date.toLocaleDateString('fr-FR', { month: 'short' }),
        nouvelles: requests.filter(r => {
          const reqDate = new Date(r.created_at);
          return reqDate.getMonth() === date.getMonth() && 
                 reqDate.getFullYear() === date.getFullYear() &&
                 r.status === 'Nouvelle';
        }).length,
        traitees: requests.filter(r => {
          const reqDate = new Date(r.created_at);
          return reqDate.getMonth() === date.getMonth() && 
                 reqDate.getFullYear() === date.getFullYear() &&
                 r.status !== 'Nouvelle';
        }).length
      });
    }
    return months;
  };

  const generateRequestsByTypeData = (requests) => {
    const types = {};
    requests.forEach(req => {
      const type = req.request_type || 'Autre';
      types[type] = (types[type] || 0) + 1;
    });
    
    return Object.entries(types).map(([type, count]) => ({
      name: type,
      value: count,
      color: getTypeColor(type)
    }));
  };

  const generateProcessingTimeData = (requests) => {
    return requests.slice(0, 10).map((req, index) => ({
      demande: `#${req.id}`,
      temps: Math.floor(Math.random() * 15) + 1, // Simulation
      objectif: 7
    }));
  };

  const generateLandDistributionData = (parcels) => {
    const zones = {};
    parcels.forEach(parcel => {
      const zone = parcel.zone || 'Autre';
      if (!zones[zone]) {
        zones[zone] = { disponibles: 0, attribuees: 0 };
      }
      if (parcel.status === 'Disponible') {
        zones[zone].disponibles++;
      } else if (parcel.status === 'Attribuée') {
        zones[zone].attribuees++;
      }
    });
    
    return Object.entries(zones).map(([zone, data]) => ({
      zone,
      disponibles: data.disponibles,
      attribuees: data.attribuees
    }));
  };

  const generateCitizenActivityData = (requests) => {
    const activity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      activity.push({
        jour: date.toLocaleDateString('fr-FR', { weekday: 'short' }),
        demandes: Math.floor(Math.random() * 5) + 1 // Simulation
      });
    }
    return activity;
  };

  const generatePerformanceMetricsData = (requests) => {
    return [
      { metric: 'Taux d\'approbation', valeur: 85, objectif: 80 },
      { metric: 'Délai moyen', valeur: 7, objectif: 10 },
      { metric: 'Satisfaction citoyens', valeur: 92, objectif: 85 },
      { metric: 'Efficacité traitement', valeur: 78, objectif: 75 }
    ];
  };

  const generateActivityTimeline = (requests) => {
    const activities = [];
    
    requests.slice(0, 8).forEach(req => {
      activities.push({
        id: `req-${req.id}`,
        type: 'Demande',
        title: `Demande ${req.request_type || 'générale'}`,
        description: `Statut: ${req.status}`,
        date: new Date(req.created_at),
        icon: FileSignature,
        color: req.status === 'Nouvelle' ? 'blue' : 
               req.status === 'Approuvée' ? 'green' : 'red'
      });
    });
    
    return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const getTypeColor = (type) => {
    const colors = {
      'Attribution de terrain': '#3b82f6',
      'Permis de construire': '#10b981',
      'Certificat d\'urbanisme': '#f59e0b',
      'Autorisation de lotir': '#ef4444',
      'Autre': '#8b5cf6'
    };
    return colors[type] || '#6b7280';
  };

  const renderModalContent = () => {
    if (!isModalOpen || !modalContent?.data?.request) return null;
    
    const { type, data } = modalContent;
    const { request } = data;

    switch (type) {
      case 'permit':
        return <InstructionModal 
                 content={data} 
                 onDecision={(decision, note) => handleDecision(request, decision, note)}
                 onContact={() => handleContactApplicant(request.user_id, request.id)}
                 onAction={(title, desc) => {
                   if (typeof window !== 'undefined' && window.safeGlobalToast) {
                     window.safeGlobalToast({ title, description: desc, variant: 'destructive'});
                   }
                 }}
                 onClose={closeModal} 
               />;
      case 'attribution':
         return <AttributionModal
                 content={data} 
                 municipalParcels={municipalParcels}
                 attributionParcel={attributionParcel}
                 setAttributionParcel={setAttributionParcel}
                 onAttribution={() => handleAttribution(request)}
                 onDecision={(decision) => handleDecision(request, decision, "La demande d'attribution a été rejetée.")}
                 onContact={() => handleContactApplicant(request.user_id, request.id)}
                 onClose={closeModal} 
               />;
      case 'generic':
      default:
        return <GenericActionModal content={data} onClose={closeModal} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8"
      >
        {/* En-tête */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center">
              <Landmark className="h-10 w-10 mr-3 text-blue-600"/>
              Centre de Gestion Municipale
            </h1>
            <p className="text-gray-600 mt-2">
              Plateforme intelligente de gestion du foncier et des services citoyens - Mairie de Saly
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              asChild 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Link to="/dashboard/mairie-requests">
                <FileSignature className="mr-2 h-4 w-4"/> 
                Gérer les Demandes
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* KPIs principaux */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Nouvelles Demandes</CardTitle>
              <FileSignature className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{analytics.newRequests}</div>
              <div className="flex items-center text-xs text-blue-600 mt-2">
                {analytics.monthlyGrowth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {Math.abs(analytics.monthlyGrowth).toFixed(1)}% ce mois
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Terrains Disponibles</CardTitle>
              <LandPlot className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">{analytics.availableLands}</div>
              <div className="flex items-center text-xs text-emerald-600 mt-2">
                <Building className="h-3 w-3 mr-1" />
                {analytics.municipalLands} total patrimoine
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700">Délai Moyen</CardTitle>
              <Clock className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">{analytics.avgProcessingTime}j</div>
              <div className="flex items-center text-xs text-amber-600 mt-2">
                <Target className="h-3 w-3 mr-1" />
                Objectif: 10 jours
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Taux Satisfaction</CardTitle>
              <UserCheck className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{analytics.satisfactionRate}%</div>
              <div className="flex items-center text-xs text-purple-600 mt-2">
                <CheckCircle className="h-3 w-3 mr-1" />
                {analytics.activeCitizens} citoyens actifs
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Graphiques principaux */}
          <div className="lg:col-span-2 space-y-8">
            {/* Activité mensuelle */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Évolution des Demandes
                  </CardTitle>
                  <CardDescription>
                    Nouvelles demandes vs demandes traitées par mois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData.monthlyRequests}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="nouvelles" 
                        stackId="1"
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.6}
                        name="Nouvelles"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="traitees" 
                        stackId="1"
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.6}
                        name="Traitées"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Distribution des terrains */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-emerald-600" />
                    Distribution Territoriale
                  </CardTitle>
                  <CardDescription>
                    Répartition des terrains par zone géographique
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.landDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="zone" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="disponibles" fill="#10b981" name="Disponibles" />
                      <Bar dataKey="attribuees" fill="#3b82f6" name="Attribuées" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-8">
            {/* Types de demandes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-purple-600" />
                    Types de Demandes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={chartData.requestsByType}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={(entry) => `${entry.name}: ${entry.value}`}
                      >
                        {chartData.requestsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Timeline d'activité */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    Activité Récente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activityTimeline.slice(0, 6).map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className={`p-2 rounded-full ${
                        activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        activity.color === 'green' ? 'bg-emerald-100 text-emerald-600' :
                        activity.color === 'red' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {activity.date.toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {activityTimeline.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune activité récente</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Outils rapides */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-orange-600" />
                    Outils d'Urbanisme
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start hover:bg-blue-50"
                  >
                    <Link to="/dashboard/cadastre">
                      <MapIcon className="mr-2 h-4 w-4"/> 
                      Consulter le Cadastre
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start hover:bg-emerald-50"
                  >
                    <Link to="/dashboard/urban-plan">
                      <Library className="mr-2 h-4 w-4"/> 
                      Plan d'Urbanisme
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start hover:bg-amber-50"
                  >
                    <Link to="/dashboard/disputes">
                      <Construction className="mr-2 h-4 w-4"/> 
                      Gestion Litiges
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Section demandes récentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSignature className="h-5 w-5 text-indigo-600" />
                Demandes Récentes à Traiter
              </CardTitle>
              <CardDescription>
                Dernières demandes nécessitant votre attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="p-3 text-left font-medium">ID</th>
                      <th className="p-3 text-left font-medium">Demandeur</th>
                      <th className="p-3 text-left font-medium">Type</th>
                      <th className="p-3 text-left font-medium">Statut</th>
                      <th className="p-3 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requestsForTable.slice(0, 6).map((req, index) => {
                      const user = sampleUsers.find(u => u.id === req.user_id);
                      return (
                        <motion.tr 
                          key={req.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-3 font-medium">#{req.id}</td>
                          <td className="p-3">{user?.name || 'N/A'}</td>
                          <td className="p-3 capitalize">{req.request_type}</td>
                          <td className="p-3">
                            <Badge 
                              variant={
                                req.status === 'Nouvelle' ? 'default' :
                                req.status === 'Approuvée' ? 'default' :
                                'secondary'
                              }
                              className={
                                req.status === 'Nouvelle' ? 'bg-blue-100 text-blue-800' :
                                req.status === 'Approuvée' ? 'bg-emerald-100 text-emerald-800' :
                                'bg-red-100 text-red-800'
                              }
                            >
                              {req.status}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleOpenInstructionModal(req)}
                              className="hover:bg-blue-50"
                            >
                              Instruire
                            </Button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
                  <Link to="/dashboard/mairie-requests">
                    Voir toutes les demandes ({requestsForTable.length})
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl" onOpenAutoFocus={(e) => e.preventDefault()}>
          {renderModalContent()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MairiesDashboardPage;

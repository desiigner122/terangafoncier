
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { 
  UserCheck, 
  MapPin, 
  FileText, 
  BarChart2, 
  CalendarDays, 
  MessageSquare, 
  Search, 
  Filter, 
  Check, 
  X, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Eye, 
  Phone, 
  Mail, 
  Clock, 
  Building, 
  Map, 
  Star, 
  Award, 
  Target, 
  Zap, 
  Activity, 
  Timer, 
  AlertCircle, 
  CheckCircle, 
  Calendar, 
  Home, 
  Briefcase, 
  PieChart as PieChartIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { AIEstimationWidget, AIMarketInsights } from '@/components/AIComponents';

// Fonctions utilitaires
const getActivityIcon = (type) => {
  switch (type) {
    case 'meeting': return <Users className="h-4 w-4 text-blue-500" />;
    case 'visit': return <Home className="h-4 w-4 text-green-500" />;
    case 'negotiation': return <DollarSign className="h-4 w-4 text-purple-500" />;
    case 'followup': return <Phone className="h-4 w-4 text-orange-500" />;
    default: return <Activity className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'scheduled': return <Badge className="bg-blue-100 text-blue-800">Programmé</Badge>;
    case 'confirmed': return <Badge className="bg-green-100 text-green-800">Confirmé</Badge>;
    case 'in_progress': return <Badge className="bg-purple-100 text-purple-800">En cours</Badge>;
    case 'pending': return <Badge className="bg-orange-100 text-orange-800">En attente</Badge>;
    case 'completed': return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
    case 'Validée': case 'Traitée': return <Badge variant="default" className="bg-green-100 text-green-800">{status}</Badge>;
    case 'Rejetée': return <Badge variant="destructive">{status}</Badge>;
    case 'Nouvelle': return <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>;
    case 'En cours': default: return <Badge variant="secondary">{status}</Badge>;
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

const AGENT_NAME = 'Bob Martin';

const AgentDashboardPage = () => {
  // Métriques avancées pour agent foncier
  const [agentMetrics, setAgentMetrics] = useState({
    totalMandats: 24,
    activeProspects: 18,
    monthlyCommissions: 850000,
    conversionRate: 15.8,
    averageResponseTime: 2.5,
    clientSatisfaction: 92,
    marketKnowledge: 88,
    monthlyVisits: 42,
    closedDeals: 6,
    pipeline: 12,
    performanceScore: 89,
    territoryMarketShare: 8.5
  });

  // Données graphiques pour analytics immobilières
  const [chartData, setChartData] = useState({
    salesPerformance: [
      { month: 'Jan', commissions: 650000, deals: 4, prospects: 12 },
      { month: 'Fév', commissions: 720000, deals: 5, prospects: 15 },
      { month: 'Mar', commissions: 580000, deals: 3, prospects: 18 },
      { month: 'Avr', commissions: 850000, deals: 6, prospects: 22 },
      { month: 'Mai', commissions: 920000, deals: 7, prospects: 18 },
      { month: 'Juin', commissions: 780000, deals: 5, prospects: 20 }
    ],
    propertyTypes: [
      { type: 'Résidentiel', mandats: 12, percentage: 50, color: '#8884d8' },
      { type: 'Commercial', mandats: 6, percentage: 25, color: '#82ca9d' },
      { type: 'Terrain', mandats: 4, percentage: 17, color: '#ffc658' },
      { type: 'Investissement', mandats: 2, percentage: 8, color: '#ff7300' }
    ],
    marketTrends: [
      { zone: 'Almadies', prix: 180000, evolution: 5.2, demande: 'Forte' },
      { zone: 'Plateau', prix: 220000, evolution: 3.8, demande: 'Modérée' },
      { zone: 'Yoff', prix: 95000, evolution: 8.1, demande: 'Très forte' },
      { zone: 'Ouakam', prix: 150000, evolution: 2.5, demande: 'Stable' }
    ]
  });

  // Pipeline et activités client
  const [clientActivities, setClientActivities] = useState([
    {
      id: 1,
      type: 'meeting',
      title: 'RDV client Villa Almadies',
      clientName: 'M. Diallo',
      property: 'Villa 4 pièces - 180M FCFA',
      time: 'Aujourd\'hui 15h',
      status: 'scheduled',
      priority: 'high'
    },
    {
      id: 2,
      type: 'visit',
      title: 'Visite guidée Appartement',
      clientName: 'Mme. Fall',
      property: 'App 3 pièces Plateau - 95M FCFA',
      time: 'Demain 10h',
      status: 'confirmed',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'negotiation',
      title: 'Négociation en cours',
      clientName: 'SCI Teranga',
      property: 'Bureau commercial - 250M FCFA',
      time: 'Il y a 2h',
      status: 'in_progress',
      priority: 'high'
    },
    {
      id: 4,
      type: 'followup',
      title: 'Suivi post-visite',
      clientName: 'M. Niang',
      property: 'Terrain Yoff - 45M FCFA',
      time: 'Il y a 1 jour',
      status: 'pending',
      priority: 'medium'
    }
  ]);

  // KPI Data
  const kpiData = [
    { 
      title: "Mandats Actifs", 
      value: agentMetrics.totalMandats, 
      subtext: `${agentMetrics.activeProspects} prospects`,
      icon: Briefcase, 
      trend: "+3", 
      trendColor: "text-green-500", 
      gradient: "from-blue-50 to-blue-100 border-blue-200"
    },
    { 
      title: "Commissions (Mois)", 
      value: `${(agentMetrics.monthlyCommissions / 1000).toFixed(0)}K`, 
      subtext: `${agentMetrics.closedDeals} ventes finalisées`,
      icon: DollarSign, 
      trend: "+12%", 
      trendColor: "text-green-500", 
      gradient: "from-green-50 to-green-100 border-green-200"
    },
    { 
      title: "Taux Conversion", 
      value: `${agentMetrics.conversionRate}%`, 
      subtext: "Excellent performance",
      icon: Target, 
      trend: "+2.1%", 
      trendColor: "text-green-500", 
      gradient: "from-purple-50 to-purple-100 border-purple-200"
    },
    { 
      title: "Score Performance", 
      value: `${agentMetrics.performanceScore}%`, 
      subtext: `${agentMetrics.monthlyVisits} visites/mois`,
      icon: Star, 
      trend: "Stable", 
      trendColor: "text-blue-500", 
      gradient: "from-orange-50 to-orange-100 border-orange-200"
    },
  ];
  const [activeTab, setActiveTab] = useState('overview');
  const [agentParcels, setAgentParcels] = useState([]);
  const [agentRequests, setAgentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        // Parcelles assignées à l'agent
        const { data: parcels, error: parcelsError } = await supabase.from('parcels').select('*').eq('agent_assigned', AGENT_NAME).limit(12);
        if (parcelsError) throw parcelsError;
        setAgentParcels(parcels);
        // Demandes assignées à l'agent ou non assignées
        const { data: requests, error: requestsError } = await supabase.from('requests').select('*').or(`agent_assigned.eq.${AGENT_NAME},agent_assigned.is.null`).limit(5);
        if (requestsError) throw requestsError;
        setAgentRequests(requests);
      } catch (err) {
        setFetchError(err.message);
        setAgentParcels([]);
        setAgentRequests([]);
        console.error('Erreur lors du chargement des données agent:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSimulatedAction = (message) => {
    window.safeGlobalToast({ title: "Action Simulée", description: message });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Validée': case 'Traitée': return 'success';
      case 'Rejetée': return 'destructive';
      case 'Nouvelle': return 'warning';
      case 'En cours': default: return 'secondary';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* Analytics Performance Commerciale */}
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <BarChart2 className="mr-2 h-5 w-5"/>
                        Performance Commerciale
                      </CardTitle>
                      <CardDescription>Évolution commissions, deals et prospects sur 6 mois</CardDescription>
                    </div>
                    <Badge variant="secondary">Mise à jour temps réel</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData.salesPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [
                            name === 'commissions' ? `${(value / 1000).toFixed(0)}K FCFA` : value,
                            name === 'commissions' ? 'Commissions' : name === 'deals' ? 'Ventes' : 'Prospects'
                          ]}
                        />
                        <Area type="monotone" dataKey="commissions" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="deals" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                        <Area type="monotone" dataKey="prospects" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5"/>
                    Objectifs Mensuels
                  </CardTitle>
                  <CardDescription>Progression vers vos targets commerciaux</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Commissions</span>
                      <span className="text-sm text-muted-foreground">
                        850K / 1M FCFA
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">85% de l'objectif atteint</p>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Satisfaction client</span>
                      <Badge className="bg-green-100 text-green-800">{agentMetrics.clientSatisfaction}%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Part de marché</span>
                      <Badge className="bg-blue-100 text-blue-800">{agentMetrics.territoryMarketShare}%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Temps de réponse</span>
                      <Badge variant="secondary">{agentMetrics.averageResponseTime}h</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Types de Biens et Tendances Marché */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChartIcon className="mr-2 h-5 w-5"/>
                    Répartition Portefeuille
                  </CardTitle>
                  <CardDescription>Types de biens en mandats par catégorie</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.propertyTypes}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="mandats"
                          label={({ type, percentage }) => `${type}: ${percentage}%`}
                        >
                          {chartData.propertyTypes.map((entry, index) => (
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
                    <Map className="mr-2 h-5 w-5"/>
                    Tendances Marché par Zone
                  </CardTitle>
                  <CardDescription>Prix moyens et évolution par secteur géographique</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {chartData.marketTrends.map((trend, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                        <div>
                          <p className="font-medium text-sm">{trend.zone}</p>
                          <p className="text-xs text-muted-foreground">
                            {(trend.prix / 1000).toFixed(0)}K FCFA/m²
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <Badge variant={trend.evolution > 5 ? "default" : "secondary"} className="text-xs">
                              {trend.evolution > 0 ? '+' : ''}{trend.evolution}%
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {trend.demande}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pipeline Client et Outils Rapides */}
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5"/>
                    Pipeline Client Actif
                  </CardTitle>
                  <CardDescription>Activités et rendez-vous en cours avec vos prospects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {clientActivities.map(activity => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <div className="flex items-center space-x-2">
                              {getPriorityBadge(activity.priority)}
                              {getStatusBadge(activity.status)}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{activity.property}</p>
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
                    <Zap className="mr-2 h-5 w-5"/>
                    Outils Rapides
                  </CardTitle>
                  <CardDescription>Actions fréquentes et raccourcis essentiels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleSimulatedAction("Ajout nouveau prospect")}>
                    <Users className="mr-2 h-4 w-4"/>
                    Nouveau Prospect
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleSimulatedAction("Planification visite")}>
                    <Calendar className="mr-2 h-4 w-4"/>
                    Programmer Visite
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleSimulatedAction("Études de marché")}>
                    <BarChart2 className="mr-2 h-4 w-4"/>
                    Étude de Marché
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleSimulatedAction("Rapport d'activité")}>
                    <FileText className="mr-2 h-4 w-4"/>
                    Rapport Mensuel
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleSimulatedAction("Contact propriétaires")}>
                    <Phone className="mr-2 h-4 w-4"/>
                    Contacter Clients
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        );
      case 'requests':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5"/>
                Demandes Clients Actives
              </CardTitle>
              <CardDescription>Gestion et suivi de vos prospects avec actions prioritaires</CardDescription>
              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 mt-2">
                <Input type="search" YOUR_API_KEY="Rechercher par client, parcelle..." className="max-w-xs" />
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]"><SelectValue YOUR_API_KEY="Filtrer par type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="visit">Visite</SelectItem>
                    <SelectItem value="buy">Achat</SelectItem>
                    <SelectItem value="sell">Mandat vente</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]"><SelectValue YOUR_API_KEY="Filtrer par statut" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="nouvelle">Nouvelle</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="traitee">Traitée</SelectItem>
                    <SelectItem value="prioritaire">Prioritaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                </div>
              ) : fetchError ? (
                <div className="text-center py-8 text-red-600">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Erreur : {fetchError}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-semibold">Client</th>
                        <th className="text-left p-2 font-semibold">Contact</th>
                        <th className="text-left p-2 font-semibold">Bien Recherché</th>
                        <th className="text-left p-2 font-semibold">Type</th>
                        <th className="text-left p-2 font-semibold">Statut</th>
                        <th className="text-left p-2 font-semibold">Priorité</th>
                        <th className="text-left p-2 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agentRequests.map((req) => (
                        <tr key={req.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-2 font-medium">{req.user_name || 'Client Prospect'}</td>
                          <td className="p-2">
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Phone className="h-3 w-3"/>
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Mail className="h-3 w-3"/>
                              </Button>
                            </div>
                          </td>
                          <td className="p-2">
                            <Link to={`/parcelles/${req.parcel_id}`} className="text-primary hover:underline font-mono text-xs">
                              {req.parcel_id}
                            </Link>
                            <p className="text-xs text-muted-foreground">Budget: {Math.floor(Math.random() * 200) + 50}M FCFA</p>
                          </td>
                          <td className="p-2">
                            <Badge variant="outline" className="text-xs">
                              {req.request_type || 'Information'}
                            </Badge>
                          </td>
                          <td className="p-2">{getStatusBadge(req.status)}</td>
                          <td className="p-2">{getPriorityBadge(['high', 'medium', 'low'][Math.floor(Math.random() * 3)])}</td>
                          <td className="p-2">
                            <div className="flex items-center space-x-1">
                              <Button variant="ghost" size="sm" title="Programmer RDV" onClick={() => handleSimulatedAction(`Programmer RDV avec ${req.user_name}`)}>
                                <Calendar className="h-4 w-4"/>
                              </Button>
                              <Button variant="ghost" size="sm" title="Valider" onClick={() => handleSimulatedAction(`Valider la demande ${req.id}`)}>
                                <Check className="h-4 w-4 text-green-600"/>
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleSimulatedAction(`Négocier avec ${req.user_name}`)}>
                                Négocier
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'parcels':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5"/>
                Portfolio de Mandats
              </CardTitle>
              <CardDescription>Gestion avancée de vos biens en mandat avec métriques de performance</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                </div>
              ) : fetchError ? (
                <div className="text-center py-8 text-red-600">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Erreur : {fetchError}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {agentParcels.map(p => (
                    <Card key={p.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base text-primary hover:underline">
                            <Link to={`/parcelles/${p.id}`}>
                              {p.name || p.location_name}
                            </Link>
                          </CardTitle>
                          <Badge variant={p.status === 'Disponible' ? 'default' : 'secondary'} className="text-xs">
                            {p.status}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">
                          📍 {p.zone} • {p.area_sqm} m²
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 text-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Prix:</span>
                          <span className="font-bold text-green-600">
                            {new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(p.price)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Commission:</span>
                          <span className="font-medium">
                            {(p.price * 0.03 / 1000000).toFixed(1)}M FCFA
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Vues:</span>
                          <Badge variant="outline" className="text-xs">
                            {Math.floor(Math.random() * 100) + 20}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Intérêt:</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs">{(Math.random() * 5).toFixed(1)}</span>
                          </div>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="flex-1" onClick={() => handleSimulatedAction(`Promouvoir ${p.name}`)}>
                            <Eye className="h-3 w-3 mr-1"/>
                            Promouvoir
                          </Button>
                          <Button size="sm" variant="default" className="flex-1" onClick={() => handleSimulatedAction(`Gérer ${p.name}`)}>
                            <BarChart2 className="h-3 w-3 mr-1"/>
                            Analytics
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center">
            <UserCheck className="h-8 w-8 mr-3 text-cyan-600"/>
            Tableau de Bord Agent Foncier
          </h1>
          <p className="text-muted-foreground">Gérez vos clients, vos parcelles et vos performances.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Card className={`bg-gradient-to-br ${kpi.gradient}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className="h-4 w-4 text-cyan-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{kpi.subtext}</p>
                  {kpi.trend && (
                    <Badge variant="secondary" className={`text-xs ${kpi.trendColor}`}>
                      {kpi.trend}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 🚀 WIDGETS IA TERANGA - SPÉCIALISATION AGENTS */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <AIEstimationWidget className="w-full" />
        <AIMarketInsights region="Dakar" className="w-full" />
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['overview', 'requests', 'parcels'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab === 'overview' ? 'Vue d\'ensemble' : tab === 'requests' ? 'Demandes Clients' : 'Mes Mandats'}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {renderTabContent()}
      </div>
    </motion.div>
  );
};

export default AgentDashboardPage;


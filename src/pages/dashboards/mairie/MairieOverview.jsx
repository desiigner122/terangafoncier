import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  FileText,
  Users,
  Map,
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Target,
  Calendar,
  Activity,
  TreePine,
  Truck,
  Zap,
  Flag,
  Award,
  DollarSign,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

// Palette de couleurs réutilisée pour les graphiques dynamiques
const TYPE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6', '#EC4899'];

const MairieOverview = ({ dashboardStats }) => {
  const { profile } = useAuth();
  const [timeFilter, setTimeFilter] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  // Données réelles chargées depuis Supabase
  const [dataLoading, setDataLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingRequests: 0,
    approvedRequests: 0,
    openDisputes: 0,
    totalRequests: 0
  });
  const [weeklyRequests, setWeeklyRequests] = useState([]);
  const [requestsByType, setRequestsByType] = useState([]);
  const [zoneUtilization, setZoneUtilization] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        // Les mairies gèrent les demandes de LEUR commune (si connue), sinon toutes
        const commune = profile?.city || profile?.commune || null;

        let requestsQuery = supabase
          .from('communal_requests')
          .select('id, applicant_name, commune, zone, type, surface, status, priority, ai_score, created_at')
          .order('created_at', { ascending: false });
        if (commune) {
          requestsQuery = requestsQuery.eq('commune', commune);
        }

        const [requestsRes, disputesRes] = await Promise.all([
          requestsQuery,
          supabase.from('disputes').select('id, status')
        ]);

        const requests = requestsRes.data || [];
        const disputes = disputesRes.data || [];

        // --- KPI principaux (agrégats réels) ---
        const pending = requests.filter((r) => r.status === 'pending').length;
        const approved = requests.filter((r) => r.status === 'approved').length;
        const openDisputes = disputes.filter((d) => d.status === 'open').length;
        setStats({
          pendingRequests: pending,
          approvedRequests: approved,
          openDisputes,
          totalRequests: requests.length
        });

        // --- Évolution des demandes sur 7 jours (créées vs approuvées) ---
        const dayLabels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
        const week = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setHours(0, 0, 0, 0);
          d.setDate(d.getDate() - i);
          const next = new Date(d);
          next.setDate(next.getDate() + 1);
          const dayReqs = requests.filter((r) => {
            const c = new Date(r.created_at);
            return c >= d && c < next;
          });
          week.push({
            day: dayLabels[d.getDay()],
            requests: dayReqs.length,
            approvals: dayReqs.filter((r) => r.status === 'approved').length
          });
        }
        setWeeklyRequests(week);

        // --- Répartition par type ---
        const typeMap = {};
        requests.forEach((r) => {
          const key = r.type || 'Non spécifié';
          typeMap[key] = (typeMap[key] || 0) + 1;
        });
        setRequestsByType(
          Object.entries(typeMap).map(([name, value], idx) => ({
            name,
            value,
            color: TYPE_COLORS[idx % TYPE_COLORS.length]
          }))
        );

        // --- Répartition des demandes par zone (part relative réelle) ---
        const zoneMap = {};
        requests.forEach((r) => {
          const key = r.zone || 'Non spécifiée';
          zoneMap[key] = (zoneMap[key] || 0) + 1;
        });
        const total = requests.length || 1;
        setZoneUtilization(
          Object.entries(zoneMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([zone, count]) => ({
              zone,
              count,
              share: Math.round((count / total) * 100)
            }))
        );

        // --- Demandes récentes ---
        setRecentRequests(requests.slice(0, 4));
      } catch (error) {
        console.error('Erreur chargement données mairie:', error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [profile]);

  // Handlers pour les actions rapides
  const handleNewRequest = () => {
    setIsLoading(true);
    // Simulation d'action
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Nouvelle demande",
        description: "Formulaire de demande communale ouvert",
        variant: "success"
      });
      setIsLoading(false);
      // Ici on pourrait ouvrir un modal ou naviguer vers le formulaire
    }, 1000);
  };

  const handleResolveConflict = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Résolution de conflit",
        description: "Module de médiation activé",
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleOpenCadastre = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Cadastre numérique",
        description: "Interface cadastrale chargée",
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleBlockchainNFT = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Blockchain NFT",
        description: "Module blockchain activé pour création NFT",
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
        description: "Rapport municipal généré avec succès",
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  // Données statistiques principales (agrégats réels communal_requests / disputes)
  const mainStats = [
    {
      title: 'Demandes en Cours',
      value: stats.pendingRequests,
      icon: FileText,
      color: 'bg-blue-500',
      description: 'Demandes communales en attente'
    },
    {
      title: 'Attributions',
      value: stats.approvedRequests,
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Parcelles attribuées (approuvées)'
    },
    {
      title: 'Litiges Ouverts',
      value: stats.openDisputes,
      icon: Shield,
      color: 'bg-red-500',
      description: 'Conflits fonciers en cours'
    },
    {
      title: 'Total Demandes',
      value: stats.totalRequests,
      icon: Building2,
      color: 'bg-orange-500',
      description: 'Toutes demandes communales'
    }
  ];

  // Statuts réels: 'pending' | 'approved' | 'rejected' | ...
  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved': return 'Approuvé';
      case 'pending': return 'En Attente';
      case 'rejected': return 'Rejeté';
      case 'in_review':
      case 'evaluation': return 'En Évaluation';
      default: return status || 'Inconnu';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'in_review':
      case 'evaluation': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    const p = (priority || '').toString().toLowerCase();
    if (p === 'haute' || p === 'high') return 'bg-red-500';
    if (p === 'moyenne' || p === 'medium') return 'bg-orange-500';
    if (p === 'normale' || p === 'basse' || p === 'low') return 'bg-green-500';
    return 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec actions rapides */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Vue d'ensemble</h2>
          <p className="text-gray-600 mt-1">Tableau de bord municipal - {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2 bg-white rounded-lg border p-1">
            {['24h', '7d', '30d', '90d'].map((period) => (
              <Button
                key={period}
                variant={timeFilter === period ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeFilter(period)}
                className={timeFilter === period ? 'bg-teal-600 text-white' : ''}
              >
                {period}
              </Button>
            ))}
          </div>
          <Button 
            className="bg-teal-600 hover:bg-teal-700"
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
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-4 w-4 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {dataLoading ? '—' : stat.value}
                </div>
                <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
              </CardContent>
              
              {/* Effet de gradient décoratif */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} rounded-full opacity-5 transform translate-x-16 -translate-y-16`} />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Évolution des demandes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 text-blue-600 mr-2" />
              Évolution des Demandes
            </CardTitle>
            <CardDescription>
              Demandes et approbations sur 7 jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!dataLoading && weeklyRequests.every((d) => d.requests === 0) ? (
              <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">
                Aucune demande sur les 7 derniers jours
              </div>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyRequests}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="requests" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                  name="Demandes"
                />
                <Area 
                  type="monotone" 
                  dataKey="approvals" 
                  stackId="1"
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.3}
                  name="Approbations"
                />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Répartition par type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 text-purple-600 mr-2" />
              Types de Demandes
            </CardTitle>
            <CardDescription>
              Répartition mensuelle
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!dataLoading && requestsByType.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-sm text-gray-500">
                Aucune demande à catégoriser
              </div>
            ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={requestsByType}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {requestsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Utilisation des zones et demandes récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilisation des zones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Map className="h-5 w-5 text-green-600 mr-2" />
              Utilisation des Zones
            </CardTitle>
            <CardDescription>
              Répartition des demandes par zone
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!dataLoading && zoneUtilization.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                Aucune zone renseignée
              </div>
            ) : (
              zoneUtilization.map((zone) => (
                <div key={zone.zone} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{zone.zone}</span>
                    <span className="text-sm text-gray-600">{zone.count} demande{zone.count > 1 ? 's' : ''} ({zone.share}%)</span>
                  </div>
                  <Progress value={zone.share} className="h-2" />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Demandes récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 text-orange-600 mr-2" />
              Demandes Récentes
            </CardTitle>
            <CardDescription>
              Dernières soumissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!dataLoading && recentRequests.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                Aucune demande récente
              </div>
            ) : (
              recentRequests.map((request) => (
                <div key={request.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {request.applicant_name || 'Demandeur inconnu'}
                      </p>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(request.priority)}`} />
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      {request.type || 'Type non spécifié'}
                      {request.surface ? ` • ${request.surface}m²` : ''}
                    </p>
                    <p className="text-xs text-gray-500">{request.zone || '—'}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                        {getStatusLabel(request.status)}
                      </Badge>
                      {request.ai_score != null && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-gray-600">IA: {request.ai_score}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {request.created_at
                      ? new Date(request.created_at).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit'
                        })
                      : ''}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 text-yellow-600 mr-2" />
            Actions Rapides
          </CardTitle>
          <CardDescription>
            Raccourcis vers les fonctions principales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-300"
              onClick={handleNewRequest}
              disabled={isLoading}
            >
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Nouvelle Demande</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-green-50 hover:border-green-300"
              onClick={handleResolveConflict}
              disabled={isLoading}
            >
              <Shield className="h-6 w-6 text-green-600" />
              <span className="text-sm">Résoudre Conflit</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-300"
              onClick={handleOpenCadastre}
              disabled={isLoading}
            >
              <Map className="h-6 w-6 text-purple-600" />
              <span className="text-sm">Cadastre Digital</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-orange-50 hover:border-orange-300"
              onClick={handleBlockchainNFT}
              disabled={isLoading}
            >
              <Award className="h-6 w-6 text-orange-600" />
              <span className="text-sm">Blockchain NFT</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MairieOverview;
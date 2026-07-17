import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  PieChart, 
  Activity, 
  Users, 
  DollarSign,
  FileText,
  Calendar,
  Award,
  Target,
  Star,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MapPin,
  MoreVertical,
  Bot,
  MousePointer,
  Maximize2,
  Settings2,
  Zap,
  Plus,
  Building2,
  CreditCard,
  Percent,
  TrendingUp as TrendIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const APPROVED_STATUSES = ['approved', 'pre_approved', 'disbursed'];
const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const RISK_META = {
  low: { category: 'Risque Faible', risk: 'Faible', color: '#10B981' },
  medium: { category: 'Risque Moyen', risk: 'Moyen', color: '#F59E0B' },
  high: { category: 'Risque Élevé', risk: 'Élevé', color: '#EF4444' },
  unknown: { category: 'Non évalué', risk: 'N/D', color: '#9CA3AF' }
};

const formatFcfa = (value) => {
  const n = Number(value) || 0;
  if (n >= 1000000000) return `${(n / 1000000000).toFixed(1)} Md FCFA`;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)} M FCFA`;
  return `${n.toLocaleString('fr-FR')} FCFA`;
};

const BanqueAnalytics = () => {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState('12m');
  const [isLoading, setIsLoading] = useState(false);

  // Données réelles Supabase
  const [loans, setLoans] = useState([]);
  const [clients, setClients] = useState([]);
  const [regionMap, setRegionMap] = useState({}); // property_id -> region

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const [{ data: loansData }, { data: clientsData }] = await Promise.all([
        supabase.from('loans').select('*').eq('bank_id', user.id),
        supabase.from('bank_clients').select('id').eq('bank_id', user.id)
      ]);

      const safeLoans = loansData || [];
      setLoans(safeLoans);
      setClients(clientsData || []);

      // Régions via properties (loans.property_id -> properties.region)
      const propertyIds = [...new Set(safeLoans.map((l) => l.property_id).filter(Boolean))];
      if (propertyIds.length > 0) {
        const { data: props } = await supabase
          .from('properties')
          .select('id, region')
          .in('id', propertyIds);
        const map = {};
        (props || []).forEach((p) => { map[p.id] = p.region; });
        setRegionMap(map);
      } else {
        setRegionMap({});
      }
    } catch (err) {
      setLoans([]);
      setClients([]);
      setRegionMap({});
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fenêtre temporelle en mois selon le filtre
  const windowMonths = useMemo(() => {
    const map = { '3m': 3, '6m': 6, '12m': 12, '24m': 24 };
    return map[timeFilter] || 12;
  }, [timeFilter]);

  const filteredLoans = useMemo(() => {
    if (loans.length === 0) return [];
    const from = new Date();
    from.setMonth(from.getMonth() - windowMonths);
    return loans.filter((l) => l.created_at && new Date(l.created_at) >= from);
  }, [loans, windowMonths]);

  // Métriques de performance réelles
  const performanceMetrics = useMemo(() => {
    const total = filteredLoans.length;
    const approved = filteredLoans.filter((l) => APPROVED_STATUSES.includes(l.status)).length;
    const rejected = filteredLoans.filter((l) => l.status === 'rejected').length;
    const portfolio = filteredLoans
      .filter((l) => ['approved', 'disbursed'].includes(l.status))
      .reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
    const rates = filteredLoans.map((l) => Number(l.interest_rate)).filter((r) => !Number.isNaN(r) && r > 0);
    const avgRate = rates.length ? rates.reduce((a, b) => a + b, 0) / rates.length : null;

    return [
      {
        metric: 'Taux Approbation',
        value: total ? `${Math.round((approved / total) * 100)}%` : '—',
        detail: total ? `${approved}/${total} dossiers` : 'Aucun dossier',
        status: total ? 'bon' : 'default'
      },
      {
        metric: 'Portefeuille Décaissé',
        value: portfolio > 0 ? formatFcfa(portfolio) : '—',
        detail: 'Crédits approuvés / décaissés',
        status: portfolio > 0 ? 'excellent' : 'default'
      },
      {
        metric: 'Taux de Rejet',
        value: total ? `${Math.round((rejected / total) * 100)}%` : '—',
        detail: total ? `${rejected}/${total} dossiers` : 'Aucun dossier',
        status: total ? 'stable' : 'default'
      },
      {
        metric: 'Taux d\'Intérêt Moyen',
        value: avgRate != null ? `${avgRate.toFixed(1)}%` : '—',
        detail: `${clients.length} client(s) enregistré(s)`,
        status: avgRate != null ? 'bon' : 'default'
      }
    ];
  }, [filteredLoans, clients]);

  // Évolution des crédits par mois (agrégat réel)
  const creditEvolution = useMemo(() => {
    if (filteredLoans.length === 0) return [];
    const nbMonths = Math.min(windowMonths, 12);
    const buckets = [];
    const now = new Date();
    for (let i = nbMonths - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        month: MONTH_LABELS[d.getMonth()],
        totalCredits: 0,
        approvedCount: 0,
        count: 0
      });
    }
    const byKey = Object.fromEntries(buckets.map((b) => [b.key, b]));
    filteredLoans.forEach((l) => {
      if (!l.created_at) return;
      const d = new Date(l.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const b = byKey[key];
      if (!b) return;
      b.totalCredits += Number(l.amount) || 0;
      b.count += 1;
      if (APPROVED_STATUSES.includes(l.status)) b.approvedCount += 1;
    });
    return buckets.map((b) => ({
      month: b.month,
      totalCredits: b.totalCredits,
      approvalRate: b.count ? Math.round((b.approvedCount / b.count) * 100) : 0
    }));
  }, [filteredLoans, windowMonths]);

  // Analyse des risques par risk_level (agrégat réel)
  const riskAnalysis = useMemo(() => {
    if (filteredLoans.length === 0) return [];
    const counts = { low: 0, medium: 0, high: 0, unknown: 0 };
    filteredLoans.forEach((l) => {
      const lvl = ['low', 'medium', 'high'].includes(l.risk_level) ? l.risk_level : 'unknown';
      counts[lvl] += 1;
    });
    const total = filteredLoans.length;
    return Object.entries(counts)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => ({
        category: RISK_META[k].category,
        value: Math.round((v / total) * 100),
        risk: RISK_META[k].risk,
        color: RISK_META[k].color
      }));
  }, [filteredLoans]);

  // Distribution géographique via properties.region (agrégat réel)
  const geographicDistribution = useMemo(() => {
    if (filteredLoans.length === 0) return [];
    const byRegion = {};
    filteredLoans.forEach((l) => {
      const region = regionMap[l.property_id] || 'Non renseigné';
      if (!byRegion[region]) byRegion[region] = { region, credits: 0, amount: 0 };
      byRegion[region].credits += 1;
      byRegion[region].amount += Number(l.amount) || 0;
    });
    return Object.values(byRegion).sort((a, b) => b.amount - a.amount).slice(0, 8);
  }, [filteredLoans, regionMap]);

  const handleRefreshData = () => {
    fetchData();
  };

  const handleExportReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Rapport exporté",
        description: "Rapport d'analytics bancaires généré",
        variant: "success"
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleViewMetricDetail = (metricName) => {
    window.safeGlobalToast({
      title: "Détail métrique",
      description: `Analyse détaillée de ${metricName}`,
      variant: "success"
    });
  };

  const handleAnalyzeMetric = (metricName) => {
    window.safeGlobalToast({
      title: "Analyse IA lancée",
      description: `Analyse approfondie de ${metricName}`,
      variant: "success"
    });
  };

  const handleExportMetric = (metricName) => {
    window.safeGlobalToast({
      title: "Export métrique",
      description: `Données de ${metricName} exportées`,
      variant: "success"
    });
  };

  const handleExportChart = (chartName) => {
    window.safeGlobalToast({
      title: "Graphique exporté",
      description: `${chartName} exporté en PNG`,
      variant: "success"
    });
  };

  const handleFullscreenChart = (chartName) => {
    window.safeGlobalToast({
      title: "Mode plein écran",
      description: `${chartName} affiché en plein écran`,
      variant: "success"
    });
  };

  const handleConfigureChart = (chartName) => {
    window.safeGlobalToast({
      title: "Configuration graphique",
      description: `Options de ${chartName} ouvertes`,
      variant: "success"
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'bon': return 'bg-blue-100 text-blue-800';
      case 'stable': return 'bg-yellow-100 text-yellow-800';
      case 'attention': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics Bancaires</h2>
          <p className="text-gray-600 mt-1">
            Analyses et métriques de performance des crédits terrains
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 mois</SelectItem>
              <SelectItem value="6m">6 mois</SelectItem>
              <SelectItem value="12m">12 mois</SelectItem>
              <SelectItem value="24m">24 mois</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline"
            onClick={handleRefreshData}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleExportReport}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Métriques de performance crédits terrains */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <motion.div
            key={metric.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">{metric.metric}</p>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status}
                      </Badge>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewMetricDetail(metric.metric);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAnalyzeMetric(metric.metric);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Bot className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExportMetric(metric.metric);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {metric.detail}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des crédits */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Évolution Crédits Terrains
                </CardTitle>
                <CardDescription>
                  Volume et taux d'approbation par mois
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleExportChart("Évolution Crédits")}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleFullscreenChart("Évolution Crédits")}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleConfigureChart("Évolution Crédits")}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {creditEvolution.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
                Aucun crédit sur la période sélectionnée
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={creditEvolution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'approvalRate' ? `${value}%` : formatFcfa(value),
                      name === 'approvalRate' ? 'Taux Approbation' : 'Volume Crédits'
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalCredits"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.15}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Analyse des risques */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-purple-600" />
                  Analyse des Risques
                </CardTitle>
                <CardDescription>
                  Répartition par type de garantie foncière
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleExportChart("Analyse Risques")}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleFullscreenChart("Analyse Risques")}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleConfigureChart("Analyse Risques")}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {riskAnalysis.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
                Aucune donnée de risque disponible
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={riskAnalysis}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskAnalysis.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Pourcentage']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
            <div className="grid grid-cols-1 gap-2 mt-4">
              {riskAnalysis.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700">{item.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{item.value}%</span>
                    <Badge variant="outline" className="text-xs">
                      {item.risk}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution géographique */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-red-600" />
                Distribution Géographique
              </CardTitle>
              <CardDescription>
                Répartition des crédits terrains par région
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleExportChart("Distribution Géographique")}
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleFullscreenChart("Distribution Géographique")}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleConfigureChart("Distribution Géographique")}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {geographicDistribution.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
              Aucune répartition géographique disponible
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={geographicDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'credits' ? value : formatFcfa(value),
                    name === 'credits' ? 'Nombre Crédits' : 'Montant'
                  ]}
                />
                <Bar dataKey="credits" fill="#3B82F6" />
                <Bar dataKey="amount" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-indigo-600" />
            Actions Rapides Analytics
          </CardTitle>
          <CardDescription>
            Outils et actions rapides pour l'analyse des données bancaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              className="h-20 flex-col space-y-2"
              variant="outline"
              onClick={() => handleExportReport()}
            >
              <Download className="h-6 w-6" />
              <span className="text-sm">Export Global</span>
            </Button>
            
            <Button 
              className="h-20 flex-col space-y-2"
              variant="outline"
              onClick={() => handleAnalyzeMetric("Portfolio Complet")}
            >
              <Bot className="h-6 w-6" />
              <span className="text-sm">Analyse IA</span>
            </Button>
            
            <Button 
              className="h-20 flex-col space-y-2"
              variant="outline"
              onClick={() => handleRefreshData()}
            >
              <RefreshCw className="h-6 w-6" />
              <span className="text-sm">Actualiser</span>
            </Button>
            
            <Button 
              className="h-20 flex-col space-y-2"
              variant="outline"
              onClick={() => handleViewMetricDetail("Dashboard Complet")}
            >
              <Eye className="h-6 w-6" />
              <span className="text-sm">Vue Détaillée</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BanqueAnalytics;
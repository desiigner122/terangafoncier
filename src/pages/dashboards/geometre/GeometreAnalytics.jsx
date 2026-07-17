import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Users,
  MapPin,
  DollarSign,
  Target,
  Clock,
  Award,
  Download,
  RefreshCw,
  Percent,
  Timer,
  Layers,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

// Formatage monétaire honnête (XOF)
const formatXOF = (amount) => {
  const n = Number(amount) || 0;
  if (n === 0) return '0 XOF';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M XOF`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K XOF`;
  return `${n.toLocaleString('fr-FR')} XOF`;
};

// Libellés FR pour les types de mission réels
const TYPE_LABELS = {
  bornage: 'Bornage',
  'levé_topo': 'Levé topographique',
  leve_topo: 'Levé topographique',
  implantation: 'Implantation',
  division: 'Division',
  topographie: 'Topographie',
  cadastral: 'Cadastral'
};

const TYPE_COLORS = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-yellow-500', 'bg-pink-500'];

const typeLabel = (t) => TYPE_LABELS[t] || (t ? t.charAt(0).toUpperCase() + t.slice(1) : 'Autre');

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const weekdayIndex = (dateStr) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return -1;
  return (d.getDay() + 6) % 7; // Lundi = 0
};

const isThisMonth = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
};

const monthKey = (dateStr) => {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${d.getMonth()}`;
};

const GeometreAnalytics = () => {
  const { user } = useAuth();
  const geometreId = user?.id;

  const [dateFilter, setDateFilter] = useState('30j');
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [measures, setMeasures] = useState([]);

  const loadData = React.useCallback(async () => {
    if (!geometreId) return;
    setLoading(true);
    try {
      const [missionsRes, contactsRes, measuresRes] = await Promise.all([
        supabase
          .from('survey_missions')
          .select('id, client_id, client_name, title, mission_type, location, status, scheduled_date, price, progress, created_at, updated_at')
          .eq('geometre_id', geometreId),
        supabase
          .from('crm_contacts')
          .select('id, name, status, created_at')
          .eq('owner_id', geometreId),
        supabase
          .from('field_measurements')
          .select('id, created_at')
          .eq('geometre_id', geometreId)
      ]);
      setMissions(missionsRes.data || []);
      setContacts(contactsRes.data || []);
      setMeasures(measuresRes.data || []);
    } catch (e) {
      setMissions([]);
      setContacts([]);
      setMeasures([]);
    } finally {
      setLoading(false);
    }
  }, [geometreId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Agrégats réels calculés à partir des données Supabase
  const analytics = useMemo(() => {
    const completed = missions.filter((m) => m.status === 'completed');
    const active = missions.filter((m) => m.status === 'pending' || m.status === 'in_progress');
    const revenuePrice = (m) => Number(m.price) || 0;

    // Revenu réalisé = missions terminées
    const revenusTotal = completed.reduce((s, m) => s + revenuePrice(m), 0);
    const revenusThisMonth = completed
      .filter((m) => isThisMonth(m.created_at))
      .reduce((s, m) => s + revenuePrice(m), 0);

    const completedThisMonth = completed.filter((m) => isThisMonth(m.created_at)).length;
    const contactsThisMonth = contacts.filter((c) => isThisMonth(c.created_at)).length;
    const measuresThisMonth = measures.filter((m) => isThisMonth(m.created_at)).length;

    // KPI
    const kpis = [
      {
        title: 'Revenus (missions terminées)',
        value: formatXOF(revenusTotal),
        change: revenusThisMonth > 0 ? `+${formatXOF(revenusThisMonth)} ce mois` : 'Aucun ce mois',
        icon: DollarSign,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      {
        title: 'Missions Complétées',
        value: String(completed.length),
        change: completedThisMonth > 0 ? `+${completedThisMonth} ce mois` : 'Aucune ce mois',
        icon: Target,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      {
        title: 'Clients (CRM)',
        value: String(contacts.length),
        change: contactsThisMonth > 0 ? `+${contactsThisMonth} ce mois` : 'Aucun ce mois',
        icon: Users,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      },
      {
        title: 'Mesures Terrain',
        value: String(measures.length),
        change: measuresThisMonth > 0 ? `+${measuresThisMonth} ce mois` : 'Aucune ce mois',
        icon: Layers,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      }
    ];

    // Répartition par type de mission
    const typeMap = new Map();
    missions.forEach((m) => {
      const key = m.mission_type || 'autre';
      const cur = typeMap.get(key) || { count: 0, revenue: 0 };
      cur.count += 1;
      cur.revenue += revenuePrice(m);
      typeMap.set(key, cur);
    });
    const totalMissions = missions.length;
    const missionTypes = Array.from(typeMap.entries())
      .map(([type, v], i) => ({
        type: typeLabel(type),
        count: v.count,
        percentage: totalMissions ? Math.round((v.count / totalMissions) * 1000) / 10 : 0,
        revenue: formatXOF(v.revenue),
        color: TYPE_COLORS[i % TYPE_COLORS.length]
      }))
      .sort((a, b) => b.count - a.count);

    // Top clients (par nombre de missions)
    const clientMap = new Map();
    missions.forEach((m) => {
      const key = m.client_name || m.client_id || 'Client inconnu';
      const cur = clientMap.get(key) || { name: m.client_name || 'Client inconnu', missions: 0, revenue: 0 };
      cur.missions += 1;
      cur.revenue += revenuePrice(m);
      clientMap.set(key, cur);
    });
    const topClients = Array.from(clientMap.values())
      .map((c) => ({ ...c, revenueLabel: formatXOF(c.revenue) }))
      .sort((a, b) => b.missions - a.missions || b.revenue - a.revenue)
      .slice(0, 5);

    // Répartition géographique (par location)
    const geoMap = new Map();
    missions.forEach((m) => {
      const key = m.location || 'Non précisé';
      const cur = geoMap.get(key) || { missions: 0, revenue: 0 };
      cur.missions += 1;
      cur.revenue += revenuePrice(m);
      geoMap.set(key, cur);
    });
    const geoData = Array.from(geoMap.entries())
      .map(([zone, v]) => ({
        zone,
        missions: v.missions,
        percentage: totalMissions ? Math.round((v.missions / totalMissions) * 1000) / 10 : 0,
        revenue: formatXOF(v.revenue)
      }))
      .sort((a, b) => b.missions - a.missions)
      .slice(0, 6);

    // Moyennes mensuelles réelles
    const monthsSet = new Set(missions.map((m) => monthKey(m.created_at)).filter(Boolean));
    const nbMonths = monthsSet.size || 1;
    const avgMissionsPerMonth = Math.round(totalMissions / nbMonths);
    const avgRevenuePerMonth = revenusTotal / nbMonths;
    const completionRate = totalMissions ? Math.round((completed.length / totalMissions) * 100) : 0;

    // Revenus par période (missions terminées, par created_at)
    const now = new Date();
    const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const sumCompletedSince = (start) => completed
      .filter((m) => new Date(m.created_at) >= start)
      .reduce((s, m) => s + revenuePrice(m), 0);
    const revenusPeriode = {
      semaine: formatXOF(sumCompletedSince(startOfWeek)),
      mois: formatXOF(sumCompletedSince(startOfMonth)),
      trimestre: formatXOF(sumCompletedSince(startOfQuarter)),
      annee: formatXOF(sumCompletedSince(startOfYear))
    };

    // Activité hebdomadaire (missions par jour de la semaine)
    const weekly = WEEKDAYS.map((day) => ({ day, missions: 0 }));
    missions.forEach((m) => {
      const idx = weekdayIndex(m.scheduled_date || m.created_at);
      if (idx >= 0) weekly[idx].missions += 1;
    });
    const maxWeekly = Math.max(1, ...weekly.map((w) => w.missions));

    return {
      kpis,
      missionTypes,
      topClients,
      geoData,
      avgMissionsPerMonth,
      avgRevenuePerMonth,
      completionRate,
      revenusPeriode,
      revenusTotal,
      weekly,
      maxWeekly,
      totalMissions,
      hasData: missions.length > 0
    };
  }, [missions, contacts, measures]);

  const EmptyBlock = ({ icon: Icon, message }) => (
    <div className="text-center py-8 text-gray-500">
      <Icon className="h-10 w-10 text-gray-300 mx-auto mb-3" />
      <p className="text-sm">{message}</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gray-50 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reporting</h1>
          <p className="text-gray-600 mt-1">Analyse de performance et indicateurs clés</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7j">7 jours</SelectItem>
              <SelectItem value="30j">30 jours</SelectItem>
              <SelectItem value="3m">3 mois</SelectItem>
              <SelectItem value="6m">6 mois</SelectItem>
              <SelectItem value="1a">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={loadData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Chargement des données...
        </div>
      ) : (
      <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {analytics.kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                      <Icon className={`h-5 w-5 ${kpi.color}`} />
                    </div>
                    <span className="text-xs font-medium text-gray-500">{kpi.change}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    <p className="text-sm text-gray-600">{kpi.title}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="geographie">Géographie</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="operationnel">Opérationnel</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance mensuelle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Moyennes & Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Graphique d'évolution</p>
                    <p className="text-gray-500 text-sm">Bientôt disponible</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-600">{analytics.avgMissionsPerMonth}</div>
                    <div className="text-xs text-gray-600">Missions/mois</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">{formatXOF(analytics.avgRevenuePerMonth)}</div>
                    <div className="text-xs text-gray-600">Revenus/mois</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">{analytics.completionRate}%</div>
                    <div className="text-xs text-gray-600">Taux complétion</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Répartition par type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Répartition par Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.missionTypes.length === 0 ? (
                  <EmptyBlock icon={PieChart} message="Aucune mission enregistrée" />
                ) : (
                  <div className="space-y-4">
                    {analytics.missionTypes.map((type) => (
                      <div key={type.type} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded ${type.color}`}></div>
                          <span className="text-sm font-medium">{type.type}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">{type.count}</div>
                            <div className="text-xs text-gray-600">{type.percentage}%</div>
                          </div>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${type.color}`}
                              style={{ width: `${type.percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-sm font-medium text-gray-900 w-20 text-right">
                            {type.revenue}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Clients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Top Clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.topClients.length === 0 ? (
                  <EmptyBlock icon={Users} message="Aucune mission cliente enregistrée" />
                ) : (
                  <div className="space-y-4">
                    {analytics.topClients.map((client, index) => (
                      <div key={client.name + index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-medium text-sm">{client.name}</div>
                            <div className="text-xs text-gray-600">{client.missions} mission{client.missions > 1 ? 's' : ''}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{client.revenueLabel}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Satisfaction Client — aucune source de notation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Satisfaction Client
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EmptyBlock
                  icon={Award}
                  message="Évaluations non disponibles — bientôt disponible"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographie" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Répartition géographique */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Répartition Géographique
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.geoData.length === 0 ? (
                  <EmptyBlock icon={MapPin} message="Aucune localisation de mission" />
                ) : (
                  <div className="space-y-4">
                    {analytics.geoData.map((zone) => (
                      <div key={zone.zone} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{zone.zone}</span>
                          <div className="text-right">
                            <span className="text-sm font-medium">{zone.missions} mission{zone.missions > 1 ? 's' : ''}</span>
                            <div className="text-xs text-gray-600">{zone.revenue}</div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${zone.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600">{zone.percentage}% du total</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Carte géographique */}
            <Card>
              <CardHeader>
                <CardTitle>Carte des Interventions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Carte Interactive
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Visualisation des missions par zone géographique
                    </p>
                    <p className="text-gray-500 text-sm">Bientôt disponible</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="finances" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenus par période */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Revenus par Période
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-500 mb-3">Missions terminées</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cette semaine</span>
                    <span className="font-medium">{analytics.revenusPeriode.semaine}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ce mois</span>
                    <span className="font-medium">{analytics.revenusPeriode.mois}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ce trimestre</span>
                    <span className="font-medium">{analytics.revenusPeriode.trimestre}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cette année</span>
                    <span className="font-medium">{analytics.revenusPeriode.annee}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chiffre d'affaires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Percent className="h-5 w-5 mr-2" />
                  Chiffre d'affaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-600">{formatXOF(analytics.revenusTotal)}</div>
                  <div className="text-sm text-gray-600">Revenu réalisé total</div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Missions terminées</span>
                    <span className="font-medium">{analytics.completionRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 border-t pt-2">
                    <span>Marge & coûts</span>
                    <span>Non disponible</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Facturations — aucune source de facturation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Facturations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EmptyBlock
                  icon={Clock}
                  message="Suivi de facturation bientôt disponible"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operationnel" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activité hebdomadaire */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Activité Hebdomadaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.totalMissions === 0 ? (
                  <EmptyBlock icon={Activity} message="Aucune mission planifiée" />
                ) : (
                  <div className="space-y-4">
                    {analytics.weekly.map((day) => (
                      <div key={day.day} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium w-8">{day.day}</span>
                          <span className="text-sm text-gray-600">{day.missions} mission{day.missions > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(day.missions / analytics.maxWeekly) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Temps de traitement — aucune source de durée fiable */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Timer className="h-5 w-5 mr-2" />
                  Temps de Traitement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EmptyBlock
                  icon={Timer}
                  message="Mesure des délais bientôt disponible"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </>
      )}
    </motion.div>
  );
};

export default GeometreAnalytics;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Map,
  Users,
  FileText,
  DollarSign,
  Target,
  Filter,
  Download,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const formatXOFShort = (value) => {
  if (!value || value <= 0) return '—';
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}Md`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return `${Math.round(value)}`;
};

// Delta honnête entre deux valeurs (période courante vs précédente).
// Retourne null si aucune base de comparaison (pas de fabrication).
const computeChange = (current, previous, lowerIsBetter = false) => {
  if (previous === undefined || previous === null || previous === 0) return null;
  const pct = ((current - previous) / previous) * 100;
  if (!isFinite(pct)) return null;
  const rounded = Math.round(pct * 10) / 10;
  const trend = rounded >= 0 ? 'up' : 'down';
  const positive = lowerIsBetter ? rounded <= 0 : rounded >= 0;
  return {
    label: `${rounded >= 0 ? '+' : ''}${rounded}%`,
    trend,
    positive
  };
};

const AgentFoncierAnalytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState([]);
  const [zoneAnalysis, setZoneAnalysis] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [geoDistribution, setGeoDistribution] = useState([]);
  const [typeDocuments, setTypeDocuments] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    let isMounted = true;

    const loadData = async () => {
      setLoading(true);
      try {
        const agentId = user.id;

        const [missionsRes, contactsRes, propertiesRes, documentsRes] = await Promise.all([
          supabase.from('agent_missions')
            .select('id, mission_type, status, commission, created_at, updated_at')
            .eq('agent_id', agentId),
          supabase.from('crm_contacts')
            .select('id, created_at')
            .eq('owner_id', agentId),
          supabase.from('properties')
            .select('id, price, estimated_value, region, location, created_at')
            .eq('owner_id', agentId),
          supabase.from('documents')
            .select('id, type, created_at')
            .eq('owner_id', agentId)
        ]);

        if (!isMounted) return;

        const missions = missionsRes.data || [];
        const contacts = contactsRes.data || [];
        const properties = propertiesRes.data || [];
        const documents = documentsRes.data || [];

        // --- Bornes de périodes (mois courant vs mois précédent) ---
        const now = new Date();
        const curStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const inCur = (d) => d && new Date(d) >= curStart;
        const inPrev = (d) => d && new Date(d) >= prevStart && new Date(d) < curStart;

        // --- KPI 1 : Revenus (commissions réelles missions terminées) ---
        const completed = missions.filter(m => m.status === 'completed');
        const totalRevenue = completed.reduce((s, m) => s + (Number(m.commission) || 0), 0);
        const revCur = completed.filter(m => inCur(m.updated_at || m.created_at))
          .reduce((s, m) => s + (Number(m.commission) || 0), 0);
        const revPrev = completed.filter(m => inPrev(m.updated_at || m.created_at))
          .reduce((s, m) => s + (Number(m.commission) || 0), 0);

        // --- KPI 2 : Terrains évalués (properties avec estimated_value) ---
        const evaluated = properties.filter(p => p.estimated_value != null && Number(p.estimated_value) > 0);
        const evalCur = evaluated.filter(p => inCur(p.created_at)).length;
        const evalPrev = evaluated.filter(p => inPrev(p.created_at)).length;
        const terrainsCount = evaluated.length > 0 ? evaluated.length : properties.length;

        // --- KPI 3 : Nouveaux clients (crm_contacts ce mois) ---
        const clientsCur = contacts.filter(c => inCur(c.created_at)).length;
        const clientsPrev = contacts.filter(c => inPrev(c.created_at)).length;

        // --- KPI 4 : Temps moyen / dossier (jours entre création et clôture) ---
        const durations = completed
          .map(m => {
            if (!m.created_at || !m.updated_at) return null;
            const days = (new Date(m.updated_at) - new Date(m.created_at)) / 86400000;
            return days >= 0 ? days : null;
          })
          .filter(v => v != null);
        const avgDuration = durations.length
          ? durations.reduce((a, b) => a + b, 0) / durations.length
          : null;
        const durCur = completed
          .filter(m => inCur(m.updated_at))
          .map(m => (new Date(m.updated_at) - new Date(m.created_at)) / 86400000)
          .filter(v => v >= 0);
        const durPrev = completed
          .filter(m => inPrev(m.updated_at))
          .map(m => (new Date(m.updated_at) - new Date(m.created_at)) / 86400000)
          .filter(v => v >= 0);
        const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

        setKpis([
          {
            title: 'Revenus (commissions)',
            value: formatXOFShort(totalRevenue),
            unit: totalRevenue > 0 ? 'XOF' : '',
            change: computeChange(revCur, revPrev),
            icon: DollarSign,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          {
            title: evaluated.length > 0 ? 'Terrains Évalués' : 'Terrains Gérés',
            value: terrainsCount > 0 ? String(terrainsCount) : '—',
            change: computeChange(evalCur, evalPrev),
            icon: Map,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
          },
          {
            title: 'Nouveaux Clients (mois)',
            value: contacts.length > 0 ? String(clientsCur) : '—',
            change: computeChange(clientsCur, clientsPrev),
            icon: Users,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          },
          {
            title: 'Temps Moyen/Dossier',
            value: avgDuration != null ? avgDuration.toFixed(1) : '—',
            unit: avgDuration != null ? 'jours' : '',
            change: computeChange(avg(durCur), avg(durPrev), true),
            icon: Target,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
          }
        ]);

        // --- Analyse par zone (groupement réel des properties par région/localité) ---
        const zoneMap = new Map();
        properties.forEach(p => {
          const key = p.region || p.location || 'Non renseigné';
          if (!zoneMap.has(key)) zoneMap.set(key, { zone: key, terrains: 0, sumValue: 0, valued: 0 });
          const z = zoneMap.get(key);
          z.terrains += 1;
          const v = Number(p.estimated_value) || Number(p.price) || 0;
          if (v > 0) { z.sumValue += v; z.valued += 1; }
        });
        const zones = Array.from(zoneMap.values())
          .map(z => ({
            zone: z.zone,
            terrains: z.terrains,
            avgValue: z.valued > 0 ? z.sumValue / z.valued : 0
          }))
          .sort((a, b) => b.avgValue - a.avgValue);
        // Statut relatif (tertiles) sur les zones ayant une valeur
        const valuedZones = zones.filter(z => z.avgValue > 0);
        zones.forEach((z, i) => {
          if (z.avgValue <= 0) { z.status = 'low'; return; }
          const rank = valuedZones.indexOf(z);
          const third = Math.ceil(valuedZones.length / 3);
          z.status = rank < third ? 'high' : rank < third * 2 ? 'medium' : 'low';
        });
        setZoneAnalysis(zones);

        // --- Tendances mensuelles (agrégation réelle sur 6 mois glissants) ---
        const trends = [];
        for (let i = 5; i >= 0; i--) {
          const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
          const within = (d) => d && new Date(d) >= start && new Date(d) < end;
          trends.push({
            month: MONTH_LABELS[start.getMonth()],
            terrains: properties.filter(p => within(p.created_at)).length,
            revenus: completed
              .filter(m => within(m.updated_at || m.created_at))
              .reduce((s, m) => s + (Number(m.commission) || 0), 0),
            clients: contacts.filter(c => within(c.created_at)).length
          });
        }
        setMonthlyTrends(trends);

        // --- Répartition géographique (top régions réelles en %) ---
        const totalProps = properties.length;
        const geo = Array.from(zoneMap.values())
          .map(z => ({ zone: z.zone, count: z.terrains }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
          .map((z, i) => ({
            zone: z.zone,
            percentage: totalProps > 0 ? Math.round((z.count / totalProps) * 100) : 0,
            color: ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-gray-500'][i]
          }));
        setGeoDistribution(geo);

        // --- Types de documents (groupement réel) ---
        const docMap = new Map();
        documents.forEach(d => {
          const key = d.type || 'Autres';
          docMap.set(key, (docMap.get(key) || 0) + 1);
        });
        const totalDocs = documents.length;
        const docColors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-gray-500'];
        const docs = Array.from(docMap.entries())
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count)
          .map((d, i) => ({
            ...d,
            percentage: totalDocs > 0 ? Math.round((d.count / totalDocs) * 100) : 0,
            color: docColors[i % docColors.length]
          }));
        setTypeDocuments(docs);
      } catch (error) {
        console.error('Erreur AgentFoncierAnalytics:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Agent Foncier</h1>
          <p className="text-gray-600">Analyse des performances et tendances</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{kpi.title}</p>
                    <div className="flex items-baseline space-x-1">
                      <p className="text-2xl font-bold text-gray-900">
                        {kpi.value}
                      </p>
                      {kpi.unit && (
                        <span className="text-sm text-gray-500">{kpi.unit}</span>
                      )}
                    </div>
                    <div className="flex items-center mt-2 h-5">
                      {kpi.change ? (
                        <>
                          {kpi.change.trend === 'up' ? (
                            <TrendingUp className={`h-4 w-4 mr-1 ${kpi.change.positive ? 'text-green-500' : 'text-red-500'}`} />
                          ) : (
                            <TrendingDown className={`h-4 w-4 mr-1 ${kpi.change.positive ? 'text-green-500' : 'text-red-500'}`} />
                          )}
                          <span className={`text-sm ${kpi.change.positive ? 'text-green-600' : 'text-red-600'}`}>
                            {kpi.change.label}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">vs mois préc.</span>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">Pas d'historique</span>
                      )}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                    <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="zones" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="zones">Analyse par Zones</TabsTrigger>
          <TabsTrigger value="tendances">Tendances</TabsTrigger>
          <TabsTrigger value="documents">Types Documents</TabsTrigger>
          <TabsTrigger value="predictions">Prédictions IA</TabsTrigger>
        </TabsList>

        <TabsContent value="zones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Performance par Zone Géographique
              </CardTitle>
            </CardHeader>
            <CardContent>
              {zoneAnalysis.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  Aucun terrain enregistré pour le moment.
                </p>
              ) : (
                <div className="space-y-4">
                  {zoneAnalysis.map((zone, index) => (
                    <motion.div
                      key={zone.zone}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${
                          zone.status === 'high' ? 'bg-green-500' :
                          zone.status === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <h4 className="font-medium text-gray-900">{zone.zone}</h4>
                          <p className="text-sm text-gray-600">{zone.terrains} terrain(s) géré(s)</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {zone.avgValue > 0 ? `${formatXOFShort(zone.avgValue)} XOF` : '—'}
                        </p>
                        <p className="text-xs text-gray-500">valeur moyenne</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tendances" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution Mensuelle (6 mois)</CardTitle>
              </CardHeader>
              <CardContent>
                {monthlyTrends.every(t => t.terrains === 0 && t.revenus === 0 && t.clients === 0) ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    Pas encore de données sur les 6 derniers mois.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {monthlyTrends.map((trend) => (
                      <div key={trend.month} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">{trend.month}</span>
                        <div className="flex space-x-4 text-sm">
                          <span className="text-green-600">{trend.terrains} terrains</span>
                          <span className="text-blue-600">
                            {trend.revenus > 0 ? `${(trend.revenus / 1000000).toFixed(1)}M XOF` : '—'}
                          </span>
                          <span className="text-purple-600">{trend.clients} clients</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition Géographique</CardTitle>
              </CardHeader>
              <CardContent>
                {geoDistribution.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    Aucune donnée géographique disponible.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {geoDistribution.map((g) => (
                      <div key={g.zone} className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 truncate max-w-[45%]">{g.zone}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className={`${g.color} h-2 rounded-full`} style={{ width: `${g.percentage}%` }}></div>
                          </div>
                          <span className="text-sm font-medium">{g.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Répartition des Types de Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {typeDocuments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  Aucun document enregistré pour le moment.
                </p>
              ) : (
                <div className="space-y-4">
                  {typeDocuments.map((doc, index) => (
                    <motion.div
                      key={doc.type}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded ${doc.color}`}></div>
                        <div>
                          <h4 className="font-medium text-gray-900">{doc.type}</h4>
                          <p className="text-sm text-gray-600">{doc.count} document(s)</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{doc.percentage}%</Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Prédictions IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <Target className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Bientôt disponible</p>
                <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                  Les prédictions et recommandations basées sur l'IA seront générées à partir de
                  vos données réelles (missions, terrains, marché) dès que le moteur d'analyse
                  prédictive sera activé.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentFoncierAnalytics;

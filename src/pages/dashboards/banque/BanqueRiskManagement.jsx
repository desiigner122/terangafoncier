import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Target,
  RefreshCw,
  CreditCard,
  MoreHorizontal,
  Calculator,
  BarChart3,
  Loader2,
  Inbox
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Cell,
  Pie
} from 'recharts';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Interprétation retenue : risk_score (0-100) = score de solidité/qualité du dossier
// (plus haut = meilleur / moins risqué). Le niveau de risque en est dérivé de façon cohérente.
const scoreToLevel = (score) => {
  if (score === null || score === undefined || Number.isNaN(Number(score))) return 'Inconnu';
  const s = Number(score);
  if (s >= 80) return 'Faible';
  if (s >= 60) return 'Modéré';
  if (s >= 40) return 'Élevé';
  return 'Très Élevé';
};

const BanqueRiskManagement = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState([]);
  const [loans, setLoans] = useState([]);

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [assessRes, loansRes] = await Promise.all([
        supabase
          .from('risk_assessments')
          .select('*')
          .eq('bank_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('loans')
          .select('*')
          .eq('bank_id', user.id)
          .order('created_at', { ascending: false })
      ]);

      if (assessRes.error) throw assessRes.error;
      if (loansRes.error) throw loansRes.error;

      setAssessments(assessRes.data || []);
      setLoans(loansRes.data || []);
    } catch (err) {
      console.error('Erreur chargement risques:', err);
      setAssessments([]);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const formatCurrency = (value) => {
    const num = Number(value) || 0;
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}Md XOF`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M XOF`;
    return `${num.toLocaleString('fr-FR')} XOF`;
  };

  const getRiskLevelColor = (level) => {
    const colors = {
      'Faible': 'bg-green-100 text-green-800 border-green-200',
      'Modéré': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Élevé': 'bg-red-100 text-red-800 border-red-200',
      'Très Élevé': 'bg-purple-100 text-purple-800 border-purple-200',
      'Inconnu': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[level] || colors['Inconnu'];
  };

  const getScoreColor = (score) => {
    if (score === null || score === undefined) return 'text-gray-500';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[severity] || colors.medium;
  };

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#3B82F6'];

  // Map loan_id -> loan (pour enrichir les évaluations avec référence / client / montant / type)
  const loanMap = useMemo(() => {
    const m = {};
    loans.forEach((l) => { m[l.id] = l; });
    return m;
  }, [loans]);

  // Score de risque global = moyenne des risk_score réels
  const globalRisk = useMemo(() => {
    const scored = assessments.filter((a) => a.risk_score !== null && a.risk_score !== undefined);
    if (scored.length === 0) return { score: null, level: '—', count: 0 };
    const avg = scored.reduce((sum, a) => sum + Number(a.risk_score), 0) / scored.length;
    const rounded = Math.round(avg * 10) / 10;
    return { score: rounded, level: scoreToLevel(rounded), count: scored.length };
  }, [assessments]);

  // Exposition totale = somme des montants de crédits (loans réels)
  const totalExposure = useMemo(
    () => loans.reduce((sum, l) => sum + (Number(l.amount) || 0), 0),
    [loans]
  );

  // Nombre d'évaluations à risque élevé (score < 40)
  const highRiskCount = useMemo(
    () => assessments.filter((a) => a.risk_score !== null && Number(a.risk_score) < 40).length,
    [assessments]
  );

  // Répartition par catégorie = regroupement des crédits par type,
  // score moyen issu des risk_assessments rattachées (loan_id)
  const creditCategories = useMemo(() => {
    const groups = {};
    loans.forEach((l) => {
      const key = l.type || 'Non catégorisé';
      if (!groups[key]) groups[key] = { exposure: 0, clients: new Set(), loanIds: [] };
      groups[key].exposure += Number(l.amount) || 0;
      if (l.client_id) groups[key].clients.add(l.client_id);
      groups[key].loanIds.push(l.id);
    });

    return Object.entries(groups).map(([category, g]) => {
      const catAssess = assessments.filter(
        (a) => g.loanIds.includes(a.loan_id) && a.risk_score !== null && a.risk_score !== undefined
      );
      const score = catAssess.length
        ? Math.round(catAssess.reduce((s, a) => s + Number(a.risk_score), 0) / catAssess.length)
        : null;
      return {
        category,
        exposure: g.exposure,
        clients: g.clients.size,
        evaluations: catAssess.length,
        score,
        riskLevel: score === null ? 'Inconnu' : scoreToLevel(score)
      };
    });
  }, [loans, assessments]);

  // Évolution mensuelle réelle : score moyen + nombre d'évaluations par mois (risk_assessments.created_at)
  const riskEvolution = useMemo(() => {
    const months = {};
    assessments.forEach((a) => {
      if (!a.created_at || a.risk_score === null || a.risk_score === undefined) return;
      const d = new Date(a.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!months[key]) months[key] = { total: 0, count: 0, label: d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }) };
      months[key].total += Number(a.risk_score);
      months[key].count += 1;
    });
    return Object.keys(months)
      .sort()
      .map((k) => ({
        month: months[k].label,
        riskScore: Math.round((months[k].total / months[k].count) * 10) / 10,
        evaluations: months[k].count
      }));
  }, [assessments]);

  // Alertes réelles = évaluations à risque (score < 60), enrichies via loans
  const alerts = useMemo(() => {
    return assessments
      .filter((a) => a.risk_score !== null && Number(a.risk_score) < 60)
      .slice(0, 20)
      .map((a) => {
        const loan = loanMap[a.loan_id] || {};
        const score = Number(a.risk_score);
        const severity = score < 40 ? 'high' : 'medium';
        const clientName = loan.client_name || 'Client';
        const ref = loan.reference ? ` (${loan.reference})` : '';
        let factorText = '';
        if (a.factors) {
          try {
            const f = typeof a.factors === 'string' ? JSON.parse(a.factors) : a.factors;
            if (Array.isArray(f)) factorText = f.join(', ');
            else if (f && typeof f === 'object') factorText = Object.values(f).filter((v) => typeof v === 'string').join(', ');
          } catch { /* ignore */ }
        }
        return {
          id: a.id,
          severity,
          title: `Dossier à surveiller — ${clientName}${ref}`,
          description: factorText || `Score de risque ${score}/100 — niveau ${scoreToLevel(score)}`,
          timestamp: a.created_at ? new Date(a.created_at) : null
        };
      });
  }, [assessments, loanMap]);

  const hasData = assessments.length > 0 || loans.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-3 text-gray-600">Chargement des données de risque...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-purple-600" />
            Gestion des Risques
          </h2>
          <p className="text-gray-600 mt-1">
            Analyse et surveillance des risques de crédit
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline" disabled title="Bientôt disponible">
            <Calculator className="h-4 w-4 mr-2" />
            Stress Test
          </Button>
          <Button onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Alertes de risque (réelles : évaluations à risque) */}
      {alerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Alertes de Risque ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity === 'high' ? 'Élevé' : 'Moyen'}
                    </Badge>
                    <div>
                      <h4 className="font-medium text-gray-900">{alert.title}</h4>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métriques principales (données réelles) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score de Risque Moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {globalRisk.score === null ? '—' : `${globalRisk.score}/100`}
                </p>
                <div className="flex items-center mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">
                    {globalRisk.level}
                  </span>
                </div>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Exposition Totale</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loans.length === 0 ? '—' : formatCurrency(totalExposure)}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600 font-medium">
                    {loans.length} crédit{loans.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dossiers Évalués</p>
                <p className="text-2xl font-bold text-gray-900">
                  {globalRisk.count}
                </p>
                <div className="flex items-center mt-1">
                  <BarChart3 className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">Évaluations</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Risque Élevé</p>
                <p className="text-2xl font-bold text-gray-900">
                  {highRiskCount}
                </p>
                <div className="flex items-center mt-1">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-yellow-600 font-medium">Score &lt; 40</span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {!hasData && (
        <Card>
          <CardContent className="py-16 text-center">
            <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Aucune donnée de risque</h3>
            <p className="text-gray-600 mt-1">
              Les évaluations de risque et crédits apparaîtront ici dès qu'ils seront enregistrés.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Onglets principaux */}
      {hasData && (
      <Tabs defaultValue="portfolio" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="portfolio">Portefeuille</TabsTrigger>
          <TabsTrigger value="evolution">Évolution</TabsTrigger>
          <TabsTrigger value="stress">Stress Tests</TabsTrigger>
          <TabsTrigger value="monitoring">Surveillance</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-6">
          {creditCategories.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-600">
                Aucun crédit à catégoriser pour le moment.
              </CardContent>
            </Card>
          ) : (
          <>
          {/* Répartition du risque par catégorie */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Expositions</CardTitle>
                <CardDescription>Par type de crédit</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={creditCategories.map((cat) => ({
                        name: cat.category,
                        value: cat.exposure
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {creditCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution des Scores</CardTitle>
                <CardDescription>Score de risque moyen par type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={creditCategories.filter((c) => c.score !== null)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Détail par catégorie */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse Détaillée par Type</CardTitle>
              <CardDescription>Métriques de risque par type de crédit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {creditCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{category.category}</h4>
                        <p className="text-sm text-gray-600">{category.clients} client{category.clients > 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-gray-600">Exposition</p>
                        <p className="font-semibold">{formatCurrency(category.exposure)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Score</p>
                        <p className={`font-semibold ${getScoreColor(category.score)}`}>
                          {category.score === null ? '—' : category.score}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600">Évaluations</p>
                        <p className="font-semibold">{category.evaluations}</p>
                      </div>
                      <div className="text-center">
                        <Badge className={getRiskLevelColor(category.riskLevel)}>
                          {category.riskLevel}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </>
          )}
        </TabsContent>

        <TabsContent value="evolution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution du Risque</CardTitle>
              <CardDescription>Score de risque moyen et volume d'évaluations par mois</CardDescription>
            </CardHeader>
            <CardContent>
              {riskEvolution.length === 0 ? (
                <div className="py-12 text-center text-gray-600">
                  Pas encore assez d'historique d'évaluations pour tracer une tendance.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={riskEvolution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="riskScore" stroke="#8B5CF6" strokeWidth={3} name="Score de Risque Moyen" />
                    <Line yAxisId="right" type="monotone" dataKey="evaluations" stroke="#3B82F6" strokeWidth={2} name="Nombre d'évaluations" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tests de Résistance</CardTitle>
              <CardDescription>Analyse d'impact des scénarios de stress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-16 text-center">
                <Calculator className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Bientôt disponible</h3>
                <p className="text-gray-600 mt-1">
                  Le moteur de stress test (scénarios de récession, taux, défaillance) sera
                  connecté prochainement. Aucune donnée simulée n'est affichée.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Surveillance Continue</CardTitle>
              <CardDescription>Dossiers à risque issus des évaluations réelles</CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="py-12 text-center text-gray-600">
                  Aucun dossier à risque à surveiller pour le moment.
                </div>
              ) : (
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            alert.severity === 'high' ? 'bg-red-100' : 'bg-yellow-100'
                          }`}>
                            <AlertTriangle className={`h-6 w-6 ${
                              alert.severity === 'high' ? 'text-red-600' : 'text-yellow-600'
                            }`} />
                          </div>
                          <div>
                            <h4 className="font-semibold">{alert.title}</h4>
                            <p className="text-sm text-gray-600">{alert.description}</p>
                            {alert.timestamp && (
                              <p className="text-xs text-gray-500 mt-1">
                                {alert.timestamp.toLocaleString('fr-FR')}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity === 'high' ? 'Élevé' : 'Moyen'}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      )}
    </div>
  );
};

export default BanqueRiskManagement;

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Brain,
  FileText,
  AlertTriangle,
  CheckCircle,
  Upload,
  Eye,
  Network,
  TrendingUp,
  Clock,
  Download,
  Archive,
  FileCheck,
  CreditCard,
  Receipt,
  Calculator,
  DollarSign,
  Percent,
  Loader2
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// --- Helpers d'affichage (statuts réels de la table disputes / risk_assessments) ---
const OPEN_DISPUTE = (status) =>
  !['resolved', 'closed', 'rejected'].includes((status || '').toLowerCase());

const getDisputeStatusColor = (status) => {
  const s = (status || '').toLowerCase();
  if (['resolved', 'closed'].includes(s)) return 'bg-green-100 text-green-800';
  if (['rejected', 'fraud', 'fraud_detected'].includes(s)) return 'bg-red-100 text-red-800';
  return 'bg-yellow-100 text-yellow-800';
};

const getDisputeStatusLabel = (status) => {
  const s = (status || '').toLowerCase();
  if (['resolved', 'closed'].includes(s)) return 'Résolu';
  if (s === 'rejected') return 'Rejeté';
  if (s === 'open') return 'Ouvert';
  if (['pending', 'in_progress', 'investigating'].includes(s)) return 'En instruction';
  return status || 'Inconnu';
};

const getRiskColor = (risk) => {
  switch ((risk || '').toLowerCase()) {
    case 'very_low':
    case 'low':
    case 'faible':
      return 'text-green-600';
    case 'medium':
    case 'moyen':
      return 'text-yellow-600';
    case 'high':
    case 'élevé':
    case 'critical':
      return 'text-red-600';
    default: return 'text-gray-600';
  }
};

// Extraction lisible des parties d'un litige (jsonb)
const formatParties = (parties) => {
  if (!parties) return '—';
  try {
    if (Array.isArray(parties)) {
      const names = parties.map((p) => (typeof p === 'string' ? p : p?.name || p?.role)).filter(Boolean);
      return names.length ? names.join(', ') : '—';
    }
    if (typeof parties === 'object') {
      const names = Object.values(parties)
        .map((v) => (typeof v === 'string' ? v : v?.name))
        .filter((x) => typeof x === 'string');
      return names.length ? names.join(', ') : '—';
    }
    return String(parties);
  } catch {
    return '—';
  }
};

const BanqueAntiFraude = ({ dashboardStats }) => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('scanner');

  const [loading, setLoading] = useState(true);
  const [disputes, setDisputes] = useState([]);
  const [riskAssessments, setRiskAssessments] = useState([]);
  const [clients, setClients] = useState([]);

  // --- Chargement des données réelles (anti-fraude = litiges + évaluations de risque) ---
  const fetchData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [disputesRes, riskRes, clientsRes] = await Promise.all([
        // Litiges / anti-fraude : table disputes (schéma partagé, non filtrée par bank_id)
        supabase
          .from('disputes')
          .select('id, title, property_id, status, parties, created_at')
          .order('created_at', { ascending: false }),
        // Évaluations de risque de la banque (filtré par bank_id dans le code)
        supabase
          .from('risk_assessments')
          .select('id, client_id, loan_id, risk_level, risk_score, factors, created_at')
          .eq('bank_id', user.id)
          .order('created_at', { ascending: false }),
        // Clients de la banque pour le score moyen réel
        supabase
          .from('bank_clients')
          .select('client_id, name, credit_score')
          .eq('bank_id', user.id)
      ]);

      setDisputes(disputesRes.data || []);
      setRiskAssessments(riskRes.data || []);
      setClients(clientsRes.data || []);
    } catch (err) {
      console.error('Erreur chargement anti-fraude:', err);
      setDisputes([]);
      setRiskAssessments([]);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // --- Agrégats réels (aucun chiffre fabriqué) ---
  const metrics = useMemo(() => {
    const openDisputes = disputes.filter((d) => OPEN_DISPUTE(d.status)).length;
    const resolvedDisputes = disputes.filter((d) => !OPEN_DISPUTE(d.status)).length;
    const inInvestigation = disputes.filter((d) =>
      ['pending', 'in_progress', 'investigating', 'open'].includes((d.status || '').toLowerCase())
    ).length;

    const totalRisk = riskAssessments.length;
    const highRisk = riskAssessments.filter((r) =>
      ['high', 'critical', 'élevé'].includes((r.risk_level || '').toLowerCase())
    ).length;
    const scores = riskAssessments.map((r) => Number(r.risk_score)).filter((n) => !Number.isNaN(n));
    const avgRiskScore = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null;

    const clientScores = clients.map((c) => Number(c.credit_score)).filter((n) => !Number.isNaN(n) && n > 0);
    const avgClientScore = clientScores.length
      ? Math.round(clientScores.reduce((a, b) => a + b, 0) / clientScores.length)
      : null;

    return {
      openDisputes,
      resolvedDisputes,
      inInvestigation,
      totalRisk,
      highRisk,
      avgRiskScore,
      avgClientScore
    };
  }, [disputes, riskAssessments, clients]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const DocumentScanCard = ({ title, description, icon: Icon }) => (
    <Card className="h-full opacity-70">
      <CardContent className="p-6 text-center">
        <Icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <Badge variant="outline" className="text-gray-500">Bientôt disponible</Badge>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header avec agrégats réels (litiges + risques) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Litiges Résolus</p>
                  <p className="text-2xl font-bold text-green-900">{metrics.resolvedDisputes}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Litiges Ouverts</p>
                  <p className="text-2xl font-bold text-red-900">{metrics.openDisputes}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Score Risque Moyen</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {metrics.avgRiskScore != null ? `${metrics.avgRiskScore}/100` : '—'}
                  </p>
                </div>
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">En Instruction</p>
                  <p className="text-2xl font-bold text-yellow-900">{metrics.inInvestigation}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Interface principale anti-fraude */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Système Anti-Fraude Bancaire</span>
          </CardTitle>
          <CardDescription>
            Suivi des litiges immobiliers et des évaluations de risque pour les crédits immobiliers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="scanner">Scanner IA</TabsTrigger>
              <TabsTrigger value="credit-analysis">Analyse Risque</TabsTrigger>
              <TabsTrigger value="analyses">Litiges</TabsTrigger>
              <TabsTrigger value="reports">Rapports</TabsTrigger>
            </TabsList>

            {/* Scanner de documents avec IA — pas d'intégration OCR/IA active */}
            <TabsContent value="scanner" className="space-y-6">
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertTitle>Analyse documentaire par IA</AlertTitle>
                <AlertDescription>
                  Le module d'analyse automatique des documents (OCR, détection de falsification,
                  vérification blockchain) n'est pas encore connecté. Il sera disponible prochainement.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DocumentScanCard
                  title="Analyse Bulletin Salaire"
                  description="Vérification revenus et authenticité"
                  icon={Receipt}
                />
                <DocumentScanCard
                  title="Vérification Titre Foncier"
                  description="Contrôle authenticité garantie immobilière"
                  icon={FileCheck}
                />
                <DocumentScanCard
                  title="Analyse Relevé Bancaire"
                  description="Vérification flux financiers et cohérence"
                  icon={CreditCard}
                />
              </div>

              <div className="border-2 border-dashed border-gray-300 bg-gray-50 p-8 rounded-lg text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Dépôt de document</h3>
                <p className="text-gray-500">Fonctionnalité d'analyse automatique bientôt disponible</p>
              </div>
            </TabsContent>

            {/* Analyse de risque — dérivée des données réelles */}
            <TabsContent value="credit-analysis" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-6 text-center">
                    <Calculator className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-green-900 mb-2">Score Client Moyen</h3>
                    <p className="text-2xl font-bold text-green-900">
                      {metrics.avgClientScore != null ? metrics.avgClientScore : '—'}
                    </p>
                    <p className="text-sm text-green-600">
                      {clients.length ? `${clients.length} client(s)` : 'Aucun client'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-6 text-center">
                    <Percent className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-blue-900 mb-2">Évaluations de Risque</h3>
                    <p className="text-2xl font-bold text-blue-900">{metrics.totalRisk}</p>
                    <p className="text-sm text-blue-600">
                      {metrics.highRisk} à risque élevé
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-6 text-center">
                    <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-purple-900 mb-2">Score Risque Moyen</h3>
                    <p className="text-2xl font-bold text-purple-900">
                      {metrics.avgRiskScore != null ? `${metrics.avgRiskScore}/100` : '—'}
                    </p>
                    <p className="text-sm text-purple-600">Sur les évaluations réalisées</p>
                  </CardContent>
                </Card>
              </div>

              {riskAssessments.length === 0 ? (
                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertTitle>Évaluation des risques</AlertTitle>
                  <AlertDescription>
                    Aucune évaluation de risque enregistrée pour le moment.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {riskAssessments.slice(0, 10).map((r) => (
                    <Card key={r.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            Évaluation {r.loan_id ? `crédit #${String(r.loan_id).slice(0, 8)}` : `client #${String(r.client_id || '').slice(0, 8)}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {r.created_at ? new Date(r.created_at).toLocaleDateString('fr-FR') : ''}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-semibold ${getRiskColor(r.risk_level)}`}>
                            {r.risk_level || '—'}
                          </p>
                          <p className="text-xs text-gray-600">
                            {r.risk_score != null ? `${r.risk_score}/100` : '—'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Litiges réels (table disputes) */}
            <TabsContent value="analyses" className="space-y-6">
              {disputes.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">Aucun litige</h3>
                  <p className="text-sm text-gray-500">Aucun litige anti-fraude enregistré pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {disputes.map((dispute, idx) => (
                    <motion.div
                      key={dispute.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <FileText className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {dispute.title || 'Litige sans titre'}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Parties: {formatParties(dispute.parties)}
                                </p>
                                {dispute.property_id && (
                                  <p className="text-xs text-blue-600">
                                    Propriété #{String(dispute.property_id).slice(0, 8)}
                                  </p>
                                )}
                                <p className="text-xs text-gray-500">
                                  {dispute.created_at
                                    ? new Date(dispute.created_at).toLocaleDateString('fr-FR')
                                    : ''}
                                </p>
                              </div>
                            </div>

                            <Badge className={getDisputeStatusColor(dispute.status)}>
                              {getDisputeStatusLabel(dispute.status)}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Rapports */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Rapport Anti-Fraude</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {disputes.length} litige(s) · {metrics.openDisputes} ouvert(s)
                    </p>
                    <Button size="sm" disabled>
                      <Download className="h-4 w-4 mr-2" />
                      Bientôt disponible
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Archive className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Historique des Évaluations</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {riskAssessments.length} évaluation(s) de risque
                    </p>
                    <Button size="sm" variant="outline" onClick={() => setSelectedTab('credit-analysis')}>
                      <Eye className="h-4 w-4 mr-2" />
                      Consulter
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BanqueAntiFraude;

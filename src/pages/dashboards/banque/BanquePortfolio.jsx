import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  Target,
  CheckCircle,
  Eye,
  Download,
  RefreshCw,
  Banknote,
  Shield,
  Activity,
  FileText,
  Loader2,
  Inbox
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Statuts loans considérés comme "portefeuille actif"
const ACTIVE_STATUSES = ['approved', 'disbursed'];
const PENDING_STATUSES = ['pending', 'evaluating', 'pre_approved'];

const DIST_COLORS = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500'];

const BanquePortfolio = ({ dashboardStats }) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [guarantees, setGuarantees] = useState([]);
  const [properties, setProperties] = useState([]);

  const fetchPortfolio = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [loansRes, guaranteesRes] = await Promise.all([
        supabase
          .from('loans')
          .select('*')
          .eq('bank_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('guarantees')
          .select('*')
          .eq('bank_id', user.id)
      ]);

      if (loansRes.error) throw loansRes.error;
      if (guaranteesRes.error) throw guaranteesRes.error;

      const loansData = loansRes.data || [];
      setLoans(loansData);
      setGuarantees(guaranteesRes.data || []);

      // Récupération des biens liés (pour la répartition géographique réelle)
      const propertyIds = [...new Set(loansData.map(l => l.property_id).filter(Boolean))];
      if (propertyIds.length > 0) {
        const { data: propsData, error: propsError } = await supabase
          .from('properties')
          .select('id, region, city, title')
          .in('id', propertyIds);
        if (propsError) throw propsError;
        setProperties(propsData || []);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.error('Erreur chargement portefeuille:', err);
      setLoans([]);
      setGuarantees([]);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // ---------- Dérivations réelles ----------
  const activeLoans = useMemo(
    () => loans.filter(l => ACTIVE_STATUSES.includes(l.status)),
    [loans]
  );

  // Valeur de garantie agrégée par loan_id (pour LTV réel)
  const guaranteeByLoan = useMemo(() => {
    const map = {};
    guarantees.forEach(g => {
      if (!g.loan_id) return;
      map[g.loan_id] = (map[g.loan_id] || 0) + (Number(g.value) || 0);
    });
    return map;
  }, [guarantees]);

  const propertyById = useMemo(() => {
    const map = {};
    properties.forEach(p => { map[p.id] = p; });
    return map;
  }, [properties]);

  const portfolioData = useMemo(() => {
    const totalCreditVolume = activeLoans.reduce((s, l) => s + (Number(l.amount) || 0), 0);
    const totalGuaranteeValue = guarantees.reduce((s, g) => s + (Number(g.value) || 0), 0);
    const pendingApplications = loans.filter(l => PENDING_STATUSES.includes(l.status)).length;
    const averageCreditAmount = activeLoans.length ? totalCreditVolume / activeLoans.length : 0;

    const totalLoans = loans.length;
    const rejectedCount = loans.filter(l => l.status === 'rejected').length;
    const approvalRate = totalLoans ? (activeLoans.length / totalLoans) * 100 : 0;
    const rejectionRate = totalLoans ? (rejectedCount / totalLoans) * 100 : 0;

    const ratedLoans = activeLoans.filter(l => l.interest_rate != null);
    const avgInterestRate = ratedLoans.length
      ? ratedLoans.reduce((s, l) => s + Number(l.interest_rate), 0) / ratedLoans.length
      : null;

    const durLoans = activeLoans.filter(l => l.duration_months != null);
    const avgDuration = durLoans.length
      ? durLoans.reduce((s, l) => s + Number(l.duration_months), 0) / durLoans.length
      : null;

    return {
      totalCreditVolume,
      activeCreditFiles: activeLoans.length,
      pendingApplications,
      averageCreditAmount,
      totalGuaranteeValue,
      approvalRate,
      rejectionRate,
      avgInterestRate,
      avgDuration
    };
  }, [activeLoans, guarantees, loans]);

  // Répartition par type de crédit (réelle, à partir de loans.type)
  const creditDistribution = useMemo(() => {
    const total = portfolioData.totalCreditVolume;
    const groups = {};
    activeLoans.forEach(l => {
      const key = l.type || 'Non spécifié';
      if (!groups[key]) groups[key] = { type: key, amount: 0, count: 0, riskLevels: {} };
      groups[key].amount += Number(l.amount) || 0;
      groups[key].count += 1;
      const rl = l.risk_level || 'inconnu';
      groups[key].riskLevels[rl] = (groups[key].riskLevels[rl] || 0) + 1;
    });
    return Object.values(groups)
      .map((g, i) => {
        // niveau de risque dominant du groupe
        const dominant = Object.entries(g.riskLevels).sort((a, b) => b[1] - a[1])[0]?.[0] || 'inconnu';
        return {
          ...g,
          percentage: total ? (g.amount / total) * 100 : 0,
          avgAmount: g.count ? g.amount / g.count : 0,
          riskLevel: dominant,
          color: DIST_COLORS[i % DIST_COLORS.length]
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [activeLoans, portfolioData.totalCreditVolume]);

  // Répartition géographique réelle (par région des biens financés)
  const geoDistribution = useMemo(() => {
    const groups = {};
    let counted = 0;
    activeLoans.forEach(l => {
      const prop = propertyById[l.property_id];
      const region = prop?.region || prop?.city;
      if (!region) return;
      groups[region] = (groups[region] || 0) + 1;
      counted += 1;
    });
    return Object.entries(groups)
      .map(([region, count]) => ({ region, count, percentage: counted ? (count / counted) * 100 : 0 }))
      .sort((a, b) => b.count - a.count);
  }, [activeLoans, propertyById]);

  // Buckets de risque pour l'onglet Performance
  const riskBuckets = useMemo(() => {
    const b = { low: 0, medium: 0, high: 0, other: 0 };
    activeLoans.forEach(l => {
      const rl = (l.risk_level || '').toLowerCase();
      if (rl === 'low' || rl === 'faible') b.low += 1;
      else if (rl === 'medium' || rl === 'moyen') b.medium += 1;
      else if (rl === 'high' || rl === 'élevé' || rl === 'eleve') b.high += 1;
      else b.other += 1;
    });
    return b;
  }, [activeLoans]);

  // ---------- Helpers ----------
  const formatMillions = (value) => {
    const num = Number(value) || 0;
    return (num / 1000000).toFixed(num >= 1000000 ? 0 : 1);
  };

  const formatBillions = (value) => ((Number(value) || 0) / 1000000000).toFixed(2);

  const riskLabel = (risk) => {
    const map = {
      low: 'Faible', faible: 'Faible',
      medium: 'Moyen', moyen: 'Moyen',
      high: 'Élevé', 'élevé': 'Élevé', eleve: 'Élevé'
    };
    return map[(risk || '').toLowerCase()] || (risk || 'Non évalué');
  };

  const getRiskColor = (risk) => {
    switch ((risk || '').toLowerCase()) {
      case 'low': case 'faible': return 'text-green-600';
      case 'medium': case 'moyen': return 'text-yellow-600';
      case 'high': case 'élevé': case 'eleve': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const statusLabel = (status) => {
    const map = {
      approved: 'Approuvé',
      disbursed: 'Décaissé',
      pending: 'En attente',
      evaluating: 'En évaluation',
      pre_approved: 'Pré-approuvé',
      rejected: 'Rejeté'
    };
    return map[status] || status || '—';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'disbursed': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'pre_approved': return 'bg-indigo-100 text-indigo-800';
      case 'evaluating': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (value) => {
    if (!value) return '—';
    try {
      return new Date(value).toLocaleDateString('fr-FR');
    } catch {
      return '—';
    }
  };

  // Carte d'un crédit actif (données réelles loans + garantie liée)
  const LoanCard = ({ loan }) => {
    const guaranteeValue = guaranteeByLoan[loan.id];
    const ltv = guaranteeValue ? Math.round((Number(loan.amount) / guaranteeValue) * 100) : null;
    const prop = propertyById[loan.property_id];
    const location = prop?.title || prop?.city || prop?.region || loan.purpose || '—';

    return (
      <motion.div whileHover={{ scale: 1.02 }} className="cursor-pointer">
        <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {loan.reference || `LOAN-${String(loan.id).slice(0, 8)}`}
                </CardTitle>
                <CardDescription className="flex items-center space-x-2 mt-1">
                  <Badge className={getStatusColor(loan.status)}>
                    {statusLabel(loan.status)}
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-700">
                    {riskLabel(loan.risk_level)}
                  </Badge>
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-green-600">
                  {formatMillions(loan.amount)}M CFA
                </div>
                <div className="text-xs text-gray-600">
                  LTV: {ltv != null ? `${ltv}%` : '—'}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{loan.client_name || '—'}</p>
                <p className="text-gray-600">{location}</p>
                {loan.type && <p className="text-blue-600 text-xs">{loan.type}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Taux d'intérêt:</span>
                  <div className="font-semibold text-blue-600">
                    {loan.interest_rate != null ? `${loan.interest_rate}%` : '—'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Durée:</span>
                  <div className="font-semibold text-gray-900">
                    {loan.duration_months != null ? `${loan.duration_months} mois` : '—'}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Garantie associée:</span>
                  <span className="font-semibold text-green-700">
                    {guaranteeValue ? `${formatMillions(guaranteeValue)}M CFA` : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Créé le:</span>
                  <span>{formatDate(loan.created_at)}</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Détails
                </Button>
                <Button size="sm" variant="outline">
                  <FileText className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Chargement du portefeuille...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Volume Total Crédits</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {portfolioData.totalCreditVolume > 0 ? `${formatBillions(portfolioData.totalCreditVolume)}Md CFA` : '—'}
                  </p>
                </div>
                <Banknote className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Dossiers Actifs</p>
                  <p className="text-2xl font-bold text-green-900">{portfolioData.activeCreditFiles}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Valeur Garanties</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {portfolioData.totalGuaranteeValue > 0 ? `${formatBillions(portfolioData.totalGuaranteeValue)}Md CFA` : '—'}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Demandes en Attente</p>
                  <p className="text-2xl font-bold text-yellow-900">{portfolioData.pendingApplications}</p>
                </div>
                <Target className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Interface principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-blue-600" />
            <span>Gestion Portfolio Crédits Fonciers</span>
          </CardTitle>
          <CardDescription>
            Suivi et gestion du portefeuille de crédits fonciers (dossiers approuvés et décaissés)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="credits">Crédits Actifs</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Répartition par type */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Répartition par Type de Crédit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {creditDistribution.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Inbox className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>Aucun crédit actif dans le portefeuille</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {creditDistribution.map((type, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                <div className={`w-4 h-4 rounded ${type.color}`}></div>
                                <span className="text-sm font-medium">{type.type}</span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold">
                                  {formatMillions(type.amount)}M CFA
                                </div>
                                <div className="text-xs text-gray-500">
                                  {type.count} dossier{type.count > 1 ? 's' : ''}
                                </div>
                              </div>
                            </div>
                            <Progress value={type.percentage} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Risque: <span className={getRiskColor(type.riskLevel)}>{riskLabel(type.riskLevel)}</span></span>
                              <span>{type.percentage.toFixed(1)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Métriques clés (dérivées réelles) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Indicateurs du Portefeuille</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Taux d'approbation</span>
                        <span className="font-semibold text-green-600">{portfolioData.approvalRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={portfolioData.approvalRate} className="h-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Taux de rejet</span>
                        <span className="font-semibold text-red-600">{portfolioData.rejectionRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={portfolioData.rejectionRate} className="h-2 bg-red-100" />

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Taux d'intérêt moyen</span>
                        <span className="font-semibold text-blue-600">
                          {portfolioData.avgInterestRate != null ? `${portfolioData.avgInterestRate.toFixed(2)}%` : '—'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Durée moyenne</span>
                        <span className="font-semibold text-gray-900">
                          {portfolioData.avgDuration != null ? `${Math.round(portfolioData.avgDuration)} mois` : '—'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Crédit moyen</span>
                        <span className="font-semibold text-gray-900">
                          {portfolioData.averageCreditAmount > 0 ? `${formatMillions(portfolioData.averageCreditAmount)}M CFA` : '—'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Crédits Actifs */}
            <TabsContent value="credits" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Crédits Actifs du Portefeuille</h3>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={fetchPortfolio}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser
                  </Button>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>

              {activeLoans.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <Inbox className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Aucun crédit actif</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Les dossiers approuvés ou décaissés apparaîtront ici.
                  </p>
                </div>
              ) : (
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
                  {activeLoans.map((loan) => (
                    <LoanCard key={loan.id} loan={loan} />
                  ))}
                </motion.div>
              )}
            </TabsContent>

            {/* Performance */}
            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-green-700">Risque Faible</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-900 mb-2">{riskBuckets.low}</div>
                    <p className="text-green-600">Dossiers à faible risque</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <CardTitle className="text-yellow-700">Risque Moyen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-900 mb-2">{riskBuckets.medium}</div>
                    <p className="text-yellow-600">Dossiers à surveiller</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="text-red-700">Risque Élevé</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-900 mb-2">{riskBuckets.high}</div>
                    <p className="text-red-600">Dossiers à risque élevé</p>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Synthèse du Portefeuille</AlertTitle>
                <AlertDescription>
                  {portfolioData.activeCreditFiles > 0 ? (
                    <>
                      Le portefeuille compte {portfolioData.activeCreditFiles} crédit{portfolioData.activeCreditFiles > 1 ? 's' : ''} actif{portfolioData.activeCreditFiles > 1 ? 's' : ''} pour
                      un volume de {formatBillions(portfolioData.totalCreditVolume)}Md CFA
                      {portfolioData.avgInterestRate != null && <>, à un taux moyen de {portfolioData.avgInterestRate.toFixed(2)}%</>}.
                      {riskBuckets.other > 0 && <> {riskBuckets.other} dossier(s) sans niveau de risque renseigné.</>}
                    </>
                  ) : (
                    <>Aucun crédit actif dans le portefeuille pour le moment.</>
                  )}
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span>Volume par Type</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {creditDistribution.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>Aucune donnée disponible</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {creditDistribution.map((type, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="text-sm">{type.type}</span>
                            <span className="font-semibold">{formatMillions(type.amount)}M CFA</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="h-5 w-5 text-green-600" />
                      <span>Répartition Géographique</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {geoDistribution.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>Localisation des biens indisponible</p>
                        <p className="text-sm text-gray-400 mt-1">Bientôt disponible</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {geoDistribution.map((geo, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="text-sm">{geo.region}</span>
                            <span className="font-semibold">{geo.percentage.toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                    )}
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

export default BanquePortfolio;

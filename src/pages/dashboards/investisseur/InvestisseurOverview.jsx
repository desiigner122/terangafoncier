import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  DollarSign,
  Building,
  BarChart3,
  Target,
  Calendar,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus,
  Filter,
  Download,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
// Layout géré par CompleteSidebarInvestisseurDashboard

const InvestisseurOverview = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [investments, setInvestments] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      try {
        // Investissements de l'investisseur (filtré par investor_id = user.id)
        // Enrichis avec la localisation réelle via la table properties
        let investmentsData = [];
        if (user?.id) {
          const { data, error } = await supabase
            .from('investments')
            .select('id, property_id, title, type, amount, current_value, roi, status, invested_at, properties(location, city, region)')
            .eq('investor_id', user.id)
            .order('invested_at', { ascending: false });
          if (!error && data) investmentsData = data;
        }

        // Opportunités ouvertes (catalogue public — lecture publique)
        const { data: oppData } = await supabase
          .from('investment_opportunities')
          .select('id, title, location, region, type, expected_roi, min_investment, risk_level, status, created_at')
          .eq('status', 'open')
          .order('created_at', { ascending: false })
          .limit(5);

        // Activités récentes réelles (financial_transactions filtré par user_id)
        let activitiesData = [];
        if (user?.id) {
          const { data: txData } = await supabase
            .from('financial_transactions')
            .select('id, type, transaction_type, amount, description, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5);
          if (txData) activitiesData = txData;
        }

        if (!cancelled) {
          setInvestments(investmentsData);
          setOpportunities(oppData || []);
          setActivities(activitiesData);
        }
      } catch (e) {
        console.error('Erreur chargement overview investisseur:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => { cancelled = true; };
  }, [user?.id]);

  // --- Agrégats réels (aucun chiffre fabriqué) ---
  const activeInvestments = investments.filter((i) => i.status === 'active');
  const totalValue = activeInvestments.reduce((s, i) => s + (Number(i.current_value) || 0), 0);
  const totalInvested = activeInvestments.reduce((s, i) => s + (Number(i.amount) || 0), 0);
  const totalCount = investments.length;
  const activeCount = activeInvestments.length;
  const gainAbs = totalValue - totalInvested;
  const gainPct = totalInvested > 0 ? (gainAbs / totalInvested) * 100 : null;

  const roiValues = investments
    .map((i) => Number(i.roi))
    .filter((v) => !Number.isNaN(v));
  const roiMoyen = roiValues.length
    ? roiValues.reduce((a, b) => a + b, 0) / roiValues.length
    : null;

  const openOpportunitiesCount = opportunities.length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatPct = (v) => (v == null ? '—' : `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'pending': return 'En attente';
      case 'sold': return 'Vendu';
      default: return status || '—';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'terrain': return 'Terrain';
      case 'immobilier': return 'Immobilier';
      case 'projet': return 'Projet';
      default: return type || '—';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'faible': return 'bg-green-100 text-green-800';
      case 'moyen': return 'bg-yellow-100 text-yellow-800';
      case 'eleve': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLabel = (risk) => {
    switch (risk) {
      case 'faible': return 'Faible';
      case 'moyen': return 'Modéré';
      case 'eleve': return 'Élevé';
      default: return risk || '—';
    }
  };

  const getLocation = (inv) => {
    const p = inv.properties;
    if (!p) return null;
    return p.location || p.city || p.region || null;
  };

  const relativeTime = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${Math.max(mins, 1)} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} h`;
    const days = Math.floor(hrs / 24);
    return `${days} j`;
  };

  // Heuristique d'affichage (entrée/sortie) — le montant reste la donnée réelle
  const isPositiveActivity = (a) => {
    const t = `${a.type || ''} ${a.transaction_type || ''}`.toLowerCase();
    return /(return|dividend|dividende|sale|vente|gain|revenu|income|credit|remboursement)/.test(t);
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="space-y-6">
        {/* En-tête avec statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Portefeuille Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalValue > 0 ? formatCurrency(totalValue) : '—'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {gainPct == null ? (
                  <span className="text-sm text-gray-500">Valeur des investissements actifs</span>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className={`text-sm font-medium ${gainPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPct(gainPct)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">plus-value</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Investissements</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">
                  {activeCount} actif{activeCount > 1 ? 's' : ''}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Plus-value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalInvested > 0 ? formatCurrency(gainAbs) : '—'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {gainPct == null ? (
                  <span className="text-sm text-gray-500">Aucun investissement actif</span>
                ) : (
                  <>
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className={`text-sm font-medium ${gainPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPct(gainPct)}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">sur investi</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ROI Moyen</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {roiMoyen == null ? '—' : `${roiMoyen.toFixed(1)}%`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={roiMoyen == null ? 0 : Math.min(Math.max((roiMoyen / 18) * 100, 0), 100)} className="h-2" />
                <span className="text-sm text-gray-600 mt-1">Objectif: 18%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Investissements actifs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mes Investissements Actifs</CardTitle>
                    <CardDescription>
                      Performance de vos investissements en cours
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Tout voir
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {activeInvestments.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 text-sm">
                    Aucun investissement actif pour le moment.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeInvestments.map((investment) => {
                      const roi = Number(investment.roi);
                      const location = getLocation(investment);
                      return (
                        <motion.div
                          key={investment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">{investment.title || 'Investissement'}</h3>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                {location || '—'}
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(investment.status)}>
                                {getStatusLabel(investment.status)}
                              </Badge>
                              <p className="text-sm text-gray-500 mt-1">{getTypeLabel(investment.type)}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Investi</p>
                              <p className="font-semibold">{formatCurrency(investment.amount)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Valeur actuelle</p>
                              <p className="font-semibold">{formatCurrency(investment.current_value)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">ROI actuel</p>
                              <p className={`font-semibold ${!Number.isNaN(roi) && roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {Number.isNaN(roi) ? '—' : formatPct(roi)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Opportunités ouvertes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Opportunités Ouvertes
                  {openOpportunitiesCount > 0 && (
                    <Badge variant="secondary">{openOpportunitiesCount}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {opportunities.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    Aucune opportunité ouverte actuellement.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {opportunities.map((opportunity) => (
                      <div key={opportunity.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{opportunity.title}</h4>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {opportunity.location || opportunity.region || '—'}
                        </p>

                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Min. investissement:</span>
                            <span className="font-medium">
                              {opportunity.min_investment != null ? formatCurrency(opportunity.min_investment) : '—'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">ROI attendu:</span>
                            <span className="font-medium text-green-600">
                              {opportunity.expected_roi != null ? `${opportunity.expected_roi}%` : '—'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Risque:</span>
                            <Badge className={`${getRiskColor(opportunity.risk_level)} text-xs`}>
                              {getRiskLabel(opportunity.risk_level)}
                            </Badge>
                          </div>
                        </div>

                        <Button size="sm" className="w-full mt-3">
                          <Plus className="w-3 h-3 mr-1" />
                          Investir
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activités récentes */}
            <Card>
              <CardHeader>
                <CardTitle>Activités Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <div className="text-center py-6 text-gray-500 text-sm">
                    Aucune activité récente.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activities.map((activity) => {
                      const positive = isPositiveActivity(activity);
                      return (
                        <div key={activity.id} className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            positive ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            {positive ? (
                              <ArrowUpRight className="w-4 h-4 text-green-600" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.type || activity.transaction_type || 'Transaction'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{activity.description || '—'}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${
                              positive ? 'text-green-600' : 'text-blue-600'
                            }`}>
                              {positive ? '+' : '-'}{formatCurrency(activity.amount)}
                            </p>
                            <p className="text-xs text-gray-500">{relativeTime(activity.created_at)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>
              Gérez rapidement vos investissements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col">
                <Plus className="w-6 h-6 mb-2" />
                Nouvel Investissement
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <BarChart3 className="w-6 h-6 mb-2" />
                Analyser Marché
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <Download className="w-6 h-6 mb-2" />
                Exporter Rapport
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <Calendar className="w-6 h-6 mb-2" />
                Planifier RDV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestisseurOverview;

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Scale,
  Users,
  FileText,
  RefreshCw,
  Loader2,
  Inbox
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const CompliancePage = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loans, setLoans] = useState([]);
  const [guarantees, setGuarantees] = useState([]);
  const [clients, setClients] = useState([]);
  const [disputes, setDisputes] = useState([]);

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const [loansRes, guaranteesRes, clientsRes] = await Promise.all([
        supabase
          .from('loans')
          .select('*')
          .eq('bank_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('guarantees')
          .select('*')
          .eq('bank_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('bank_clients')
          .select('client_id, name, credit_score, status, client_type')
          .eq('bank_id', user.id)
      ]);

      if (loansRes.error) throw loansRes.error;

      const loanList = loansRes.data || [];
      setLoans(loanList);
      setGuarantees(guaranteesRes.data || []);
      setClients(clientsRes.data || []);

      // Litiges / anti-fraude : la table disputes n'est pas scopée par banque
      // (schéma partagé property_id). On restreint aux biens liés aux dossiers
      // de crédit de la banque afin de rester pertinent.
      const propertyIds = [...new Set(loanList.map((l) => l.property_id).filter(Boolean))];
      if (propertyIds.length > 0) {
        const { data: disputesData } = await supabase
          .from('disputes')
          .select('id, title, property_id, status, parties')
          .in('property_id', propertyIds)
          .order('created_at', { ascending: false });
        setDisputes(disputesData || []);
      } else {
        setDisputes([]);
      }
    } catch (err) {
      console.error('Erreur chargement conformité:', err);
      setError("Impossible de charger les données de conformité.");
      setLoans([]);
      setGuarantees([]);
      setClients([]);
      setDisputes([]);
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
    const now = new Date();
    const totalLoans = loans.length;
    const compliant = loans.filter((l) => ['approved', 'disbursed'].includes(l.status)).length;
    const toReview = loans.filter((l) =>
      ['pending', 'evaluating', 'pre_approved'].includes(l.status)
    ).length;
    const rejected = loans.filter((l) => l.status === 'rejected').length;

    // Taux de traitement conforme : ratio réel dossiers approuvés / total.
    const complianceRate = totalLoans ? Math.round((compliant / totalLoans) * 100) : null;

    const highRiskLoans = loans.filter((l) =>
      ['high', 'critical', 'élevé'].includes((l.risk_level || '').toLowerCase())
    ).length;

    const expiredGuarantees = guarantees.filter(
      (g) => g.expiry_date && new Date(g.expiry_date) < now
    ).length;

    // KYC/LCB : clients sans statut vérifié ni score de crédit connu.
    const unverifiedClients = clients.filter(
      (c) => (c.status || '').toLowerCase() !== 'active' && (c.status || '').toLowerCase() !== 'verified'
    ).length;

    const openDisputes = disputes.filter(
      (d) => !['resolved', 'closed', 'rejected'].includes((d.status || '').toLowerCase())
    ).length;

    return {
      totalLoans,
      compliant,
      toReview,
      rejected,
      complianceRate,
      highRiskLoans,
      expiredGuarantees,
      unverifiedClients,
      openDisputes,
      totalClients: clients.length
    };
  }, [loans, guarantees, clients, disputes]);

  const alerts = useMemo(() => {
    const list = [];
    if (metrics.highRiskLoans > 0) {
      list.push({
        icon: AlertTriangle,
        color: 'text-red-600 bg-red-100',
        label: `${metrics.highRiskLoans} dossier(s) de crédit à risque élevé`,
        detail: 'Contrôle renforcé LCB-FT recommandé.'
      });
    }
    if (metrics.expiredGuarantees > 0) {
      list.push({
        icon: Scale,
        color: 'text-orange-600 bg-orange-100',
        label: `${metrics.expiredGuarantees} garantie(s) expirée(s)`,
        detail: 'Régularisation nécessaire pour maintenir la couverture.'
      });
    }
    if (metrics.unverifiedClients > 0) {
      list.push({
        icon: Users,
        color: 'text-yellow-600 bg-yellow-100',
        label: `${metrics.unverifiedClients} client(s) non vérifié(s)`,
        detail: 'Vérification KYC à finaliser.'
      });
    }
    if (metrics.openDisputes > 0) {
      list.push({
        icon: FileText,
        color: 'text-purple-600 bg-purple-100',
        label: `${metrics.openDisputes} litige(s) ouvert(s)`,
        detail: 'Suivi anti-fraude en cours.'
      });
    }
    return list;
  }, [metrics]);

  const kpis = [
    {
      label: 'Dossiers conformes',
      value: metrics.compliant,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'À réviser',
      value: metrics.toReview,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      label: 'Rejets réglementaires',
      value: metrics.rejected,
      icon: XCircle,
      color: 'text-red-600 bg-red-100'
    },
    {
      label: 'Litiges ouverts',
      value: metrics.openDisputes,
      icon: Scale,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-indigo-600" />
              Conformité Bancaire
            </h1>
            <p className="text-gray-600 mt-1">
              Suivi réglementaire (LCB-FT, KYC, litiges) de votre portefeuille
            </p>
          </div>
          <Button variant="outline" onClick={fetchData} disabled={loading} className="bg-white">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin mb-3" />
            <p>Chargement des données de conformité...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-red-500">
            <AlertTriangle className="h-10 w-10 mb-3" />
            <p>{error}</p>
            <Button variant="outline" onClick={fetchData} className="mt-4">
              Réessayer
            </Button>
          </div>
        ) : (
          <>
            {/* Taux de conformité global */}
            <Card>
              <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="p-4 rounded-xl bg-indigo-100">
                  <ShieldCheck className="h-10 w-10 text-indigo-600" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-sm text-gray-500">Taux de traitement conforme</p>
                  <p className="text-4xl font-bold text-gray-900">
                    {metrics.complianceRate === null ? '—' : `${metrics.complianceRate}%`}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {metrics.totalLoans === 0
                      ? 'Aucun dossier de crédit enregistré'
                      : `${metrics.compliant} conforme(s) sur ${metrics.totalLoans} dossier(s)`}
                  </p>
                </div>
                {metrics.complianceRate !== null && (
                  <div className="w-full sm:w-56">
                    <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${metrics.complianceRate}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((kpi) => (
                <Card key={kpi.label}>
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${kpi.color}`}>
                      <kpi.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{kpi.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Alertes de conformité */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Alertes de conformité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                      <CheckCircle className="h-12 w-12 mb-3 text-green-400" />
                      <p className="font-medium">Aucune alerte de conformité</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Aucun point de vigilance détecté sur votre portefeuille.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {alerts.map((a, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                        >
                          <div className={`p-2 rounded-lg ${a.color}`}>
                            <a.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{a.label}</p>
                            <p className="text-sm text-gray-500">{a.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Litiges / anti-fraude */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5 text-purple-600" />
                    Litiges liés au portefeuille
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {disputes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                      <Inbox className="h-12 w-12 mb-3 text-gray-300" />
                      <p className="font-medium">Aucun litige</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Aucun litige n'est associé aux biens de vos dossiers de crédit.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {disputes.slice(0, 8).map((d) => {
                        const open = !['resolved', 'closed', 'rejected'].includes(
                          (d.status || '').toLowerCase()
                        );
                        return (
                          <div
                            key={d.id}
                            className="flex items-start justify-between gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                          >
                            <div>
                              <p className="font-medium text-gray-900">{d.title || 'Litige'}</p>
                              <p className="text-xs text-gray-400">Bien : {d.property_id || '—'}</p>
                            </div>
                            <Badge
                              className={`border-0 ${
                                open
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {d.status || '—'}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contrôle KYC / clients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Contrôle KYC des clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                {clients.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <Inbox className="h-12 w-12 mb-3 text-gray-300" />
                    <p className="font-medium">Aucun client enregistré</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Les contrôles KYC apparaîtront ici dès l'ajout de clients.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-gray-50 text-center">
                      <p className="text-sm text-gray-500">Clients suivis</p>
                      <p className="text-2xl font-bold text-gray-900">{metrics.totalClients}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50 text-center">
                      <p className="text-sm text-gray-500">Vérifiés</p>
                      <p className="text-2xl font-bold text-green-700">
                        {metrics.totalClients - metrics.unverifiedClients}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-yellow-50 text-center">
                      <p className="text-sm text-gray-500">À vérifier</p>
                      <p className="text-2xl font-bold text-yellow-700">
                        {metrics.unverifiedClients}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default CompliancePage;

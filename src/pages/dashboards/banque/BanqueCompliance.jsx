import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Upload,
  Eye,
  Filter,
  Search,
  RefreshCw,
  Calendar,
  Target,
  Activity,
  BarChart3,
  PieChart,
  TrendingUp,
  Award,
  Zap,
  Lock,
  Unlock,
  Settings,
  Bell,
  Users,
  Building,
  MapPin,
  DollarSign,
  Percent,
  Calculator,
  CreditCard,
  Banknote,
  Star,
  Flag
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// --- Helpers d'affichage (statuts réels des tables loans / guarantees / disputes) ---
const LOAN_STATUS_LABELS = {
  pending: 'En attente',
  evaluating: 'En évaluation',
  pre_approved: 'Pré-approuvé',
  approved: 'Approuvé',
  rejected: 'Rejeté',
  disbursed: 'Décaissé'
};

const getLoanStatusColor = (status) => ({
  approved: 'bg-green-100 text-green-800',
  disbursed: 'bg-green-100 text-green-800',
  pre_approved: 'bg-blue-100 text-blue-800',
  evaluating: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800'
}[status] || 'bg-gray-100 text-gray-800');

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Élevé': return 'text-red-600';
    case 'Moyen': return 'text-yellow-600';
    case 'Faible': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

const getRiskColor = (risk) => {
  switch ((risk || '').toLowerCase()) {
    case 'très faible':
    case 'very_low':
    case 'low':
    case 'faible':
      return 'text-green-600';
    case 'moyen':
    case 'medium':
      return 'text-yellow-600';
    case 'élevé':
    case 'high':
      return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const formatAmount = (amount) => {
  const n = Number(amount) || 0;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M CFA`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k CFA`;
  return `${n} CFA`;
};

const BanqueCompliance = ({ dashboardStats }) => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [guarantees, setGuarantees] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [clients, setClients] = useState([]);

  // --- Chargement des données réelles filtrées par bank_id (loans, guarantees) ---
  const fetchComplianceData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [loansRes, guaranteesRes, clientsRes] = await Promise.all([
        supabase.from('loans').select('*').eq('bank_id', user.id).order('created_at', { ascending: false }),
        supabase.from('guarantees').select('*').eq('bank_id', user.id).order('created_at', { ascending: false }),
        supabase.from('bank_clients').select('client_id, name, credit_score, status, client_type').eq('bank_id', user.id)
      ]);

      const loanList = loansRes.data || [];
      const clientList = clientsRes.data || [];

      // Enrichissement du score client (credit_score) pour le contrôle KYC/LCB
      const clientMap = {};
      clientList.forEach((c) => { clientMap[c.client_id] = c; });

      const enrichedLoans = loanList.map((l) => ({
        ...l,
        clientScore: clientMap[l.client_id]?.credit_score ?? null
      }));

      setLoans(enrichedLoans);
      setGuarantees(guaranteesRes.data || []);
      setClients(clientList);

      // Litiges / anti-fraude : table disputes (non filtrée par bank_id — schéma partagé)
      const { data: disputesData } = await supabase
        .from('disputes')
        .select('id, title, property_id, status, parties')
        .order('created_at', { ascending: false });
      setDisputes(disputesData || []);
    } catch (err) {
      console.error('Erreur chargement conformité:', err);
      setLoans([]);
      setGuarantees([]);
      setClients([]);
      setDisputes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplianceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // --- Agrégats réels (aucun chiffre fabriqué) ---
  const metrics = useMemo(() => {
    const now = new Date();
    const totalLoans = loans.length;
    const compliantLoans = loans.filter((l) => ['approved', 'disbursed'].includes(l.status)).length;
    const pendingLoans = loans.filter((l) => ['pending', 'evaluating', 'pre_approved'].includes(l.status)).length;
    const rejectedLoans = loans.filter((l) => l.status === 'rejected').length;
    const processingRate = totalLoans ? Math.round((compliantLoans / totalLoans) * 100) : null;

    const totalGuarantees = guarantees.length;
    const validGuarantees = guarantees.filter((g) => !g.expiry_date || new Date(g.expiry_date) > now).length;
    const guaranteeRate = totalGuarantees ? Math.round((validGuarantees / totalGuarantees) * 100) : null;

    const openDisputes = disputes.filter(
      (d) => !['resolved', 'closed', 'rejected'].includes((d.status || '').toLowerCase())
    ).length;

    return {
      totalLoans,
      compliantLoans,
      pendingLoans,
      rejectedLoans,
      processingRate,
      totalGuarantees,
      validGuarantees,
      guaranteeRate,
      openDisputes,
      totalClients: clients.length
    };
  }, [loans, guarantees, disputes, clients]);

  // --- Alertes de conformité dérivées des données réelles ---
  const complianceAlerts = useMemo(() => {
    const now = new Date();
    const alerts = [];

    guarantees.forEach((g) => {
      if (!g.expiry_date) return;
      const exp = new Date(g.expiry_date);
      const days = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
      if (days < 0) {
        alerts.push({
          id: `GUA-EXP-${g.id}`,
          type: 'Garantie Expirée',
          title: `Garantie expirée — ${g.client_name || g.type || 'Garantie'}`,
          description: `La garantie (${formatAmount(g.value)}) a expiré le ${exp.toLocaleDateString('fr-FR')}.`,
          priority: 'Élevé',
          dueDate: g.expiry_date
        });
      } else if (days <= 30) {
        alerts.push({
          id: `GUA-SOON-${g.id}`,
          type: 'Échéance Proche',
          title: `Garantie à renouveler — ${g.client_name || g.type || 'Garantie'}`,
          description: `Expiration dans ${days} jour(s) (${formatAmount(g.value)}).`,
          priority: 'Moyen',
          dueDate: g.expiry_date
        });
      }
    });

    if (metrics.pendingLoans > 0) {
      alerts.push({
        id: 'LOAN-PENDING',
        type: 'Dossiers à Traiter',
        title: `${metrics.pendingLoans} dossier(s) de crédit en cours`,
        description: 'Des dossiers sont en attente ou en évaluation et requièrent un contrôle de conformité.',
        priority: 'Moyen',
        dueDate: null
      });
    }

    if (metrics.openDisputes > 0) {
      alerts.push({
        id: 'DISPUTE-OPEN',
        type: 'Anti-fraude',
        title: `${metrics.openDisputes} litige(s) ouvert(s)`,
        description: 'Des litiges anti-fraude sont ouverts et doivent être instruits.',
        priority: 'Élevé',
        dueDate: null
      });
    }

    return alerts;
  }, [guarantees, metrics.pendingLoans, metrics.openDisputes]);

  return (
    <div className="space-y-6">
      {/* Header avec agrégats réels */}
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
                  <p className="text-green-600 text-sm font-medium">Dossiers Conformes</p>
                  <p className="text-2xl font-bold text-green-900">
                    {metrics.processingRate === null ? '—' : `${metrics.processingRate}%`}
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    {metrics.compliantLoans}/{metrics.totalLoans} dossiers approuvés
                  </p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Garanties Valides</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {metrics.guaranteeRate === null ? '—' : `${metrics.guaranteeRate}%`}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {metrics.validGuarantees}/{metrics.totalGuarantees} garanties
                  </p>
                </div>
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Litiges Ouverts</p>
                  <p className="text-2xl font-bold text-purple-900">{metrics.openDisputes}</p>
                  <p className="text-xs text-purple-700 mt-1">Anti-fraude</p>
                </div>
                <Flag className="h-8 w-8 text-purple-600" />
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
                  <p className="text-yellow-600 text-sm font-medium">Clients Suivis</p>
                  <p className="text-2xl font-bold text-yellow-900">{metrics.totalClients}</p>
                  <p className="text-xs text-yellow-700 mt-1">Portefeuille KYC</p>
                </div>
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Alertes prioritaires (dérivées des données réelles) */}
      {complianceAlerts.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Alertes de Conformité</AlertTitle>
          <AlertDescription className="text-yellow-700">
            {complianceAlerts.length} alerte(s) active(s) nécessitent votre attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Interface principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Conformité et Rapports Réglementaires</span>
          </CardTitle>
          <CardDescription>
            Gestion de la conformité bancaire et reporting BCEAO pour les crédits fonciers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-end mb-4">
            <Button size="sm" variant="outline" onClick={fetchComplianceData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
          <Tabs defaultValue="kyc">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="kyc">Contrôle KYC/LCB</TabsTrigger>
              <TabsTrigger value="alerts">Alertes</TabsTrigger>
              <TabsTrigger value="audit">Synthèse</TabsTrigger>
              <TabsTrigger value="reports">Rapports</TabsTrigger>
            </TabsList>

            {/* Contrôle KYC/LCB sur les dossiers de crédit réels (loans) */}
            <TabsContent value="kyc" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Contrôle KYC/LCB — Dossiers de Crédit</h3>
              </div>

              <Card>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="p-8 text-center text-gray-500">Chargement…</div>
                  ) : loans.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      Aucun dossier de crédit à contrôler pour le moment.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Réf. Dossier</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Score Client</TableHead>
                          <TableHead>Risque</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loans.map((loan) => (
                          <TableRow key={loan.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{loan.client_name || 'Client inconnu'}</div>
                                <div className="text-sm text-gray-500">
                                  {new Date(loan.created_at).toLocaleDateString('fr-FR')}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-blue-100 text-blue-800">
                                {loan.reference || '—'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="font-semibold">{formatAmount(loan.amount)}</div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getLoanStatusColor(loan.status)}>
                                {LOAN_STATUS_LABELS[loan.status] || loan.status || '—'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {loan.clientScore != null ? (
                                <div className="flex items-center space-x-2">
                                  <Progress value={loan.clientScore} className="h-2 w-16" />
                                  <span className="text-sm font-medium">{loan.clientScore}</span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className={`font-semibold ${getRiskColor(loan.risk_level)}`}>
                                {loan.risk_level || '—'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <FileText className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Alertes */}
            <TabsContent value="alerts" className="space-y-6">
              {complianceAlerts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Aucune alerte de conformité active.
                </div>
              ) : (
                <div className="space-y-4">
                  {complianceAlerts.map((alert) => (
                    <Card key={alert.id} className="border-l-4 border-l-yellow-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                              {alert.title}
                            </CardTitle>
                            <CardDescription className="flex items-center space-x-2 mt-1">
                              <Badge className="bg-orange-100 text-orange-800">
                                {alert.type}
                              </Badge>
                              <Badge className={`${getPriorityColor(alert.priority)} bg-gray-100`}>
                                {alert.priority}
                              </Badge>
                            </CardDescription>
                          </div>
                          {alert.dueDate && (
                            <div className="text-right">
                              <div className="text-sm font-semibold text-red-600">
                                {new Date(alert.dueDate).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600 mb-4">{alert.description}</p>
                        <div className="flex space-x-2">
                          <Button size="sm">Traiter</Button>
                          <Button size="sm" variant="outline">Rappeler plus tard</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Synthèse (compteurs réels de dossiers) */}
            <TabsContent value="audit" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-green-700">Dossiers Approuvés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-900 mb-2">{metrics.compliantLoans}</div>
                    <p className="text-green-600">Approuvés ou décaissés</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-blue-700">En Cours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-900 mb-2">{metrics.pendingLoans}</div>
                    <p className="text-blue-600">En attente ou en évaluation</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="text-red-700">Rejetés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-900 mb-2">{metrics.rejectedLoans}</div>
                    <p className="text-red-600">Dossiers refusés</p>
                  </CardContent>
                </Card>
              </div>

              {metrics.totalLoans > 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Conformité du portefeuille</AlertTitle>
                  <AlertDescription>
                    {metrics.processingRate}% des {metrics.totalLoans} dossier(s) de crédit sont approuvés ou décaissés.
                    {metrics.totalGuarantees > 0 && ` ${metrics.validGuarantees}/${metrics.totalGuarantees} garantie(s) sont valides.`}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Portefeuille vide</AlertTitle>
                  <AlertDescription>
                    Aucun dossier de crédit enregistré pour établir une synthèse de conformité.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Rapports réglementaires : aucune source de données à ce jour */}
            <TabsContent value="reports" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Rapports Réglementaires</h3>
              </div>
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  <FileText className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                  <p className="font-medium text-gray-700">Reporting réglementaire BCEAO</p>
                  <p className="text-sm mt-1">
                    La génération et le suivi des déclarations réglementaires seront bientôt disponibles.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BanqueCompliance;

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Search,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  MapPin,
  MessageSquare,
  DollarSign,
  Building,
  Calculator,
  CreditCard,
  TrendingUp,
  Target,
  Shield,
  Globe,
  Home,
  RefreshCw,
  BarChart3,
  PieChart,
  ArrowUpRight,
  CheckSquare,
  PhoneCall,
  Loader2,
  Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// --- Correspondances statuts réels (loans.status) ---
const STATUS_LABELS = {
  pending: 'En attente',
  evaluating: 'En évaluation',
  pre_approved: 'Pré-approuvé',
  approved: 'Approuvé',
  rejected: 'Rejeté',
  disbursed: 'Décaissé'
};

const STATUS_STAGE = {
  pending: 1,
  evaluating: 2,
  pre_approved: 3,
  approved: 4,
  disbursed: 5,
  rejected: 0
};

const getStatusColor = (status) => {
  switch (status) {
    case 'approved':
    case 'disbursed':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'evaluating':
      return 'bg-blue-100 text-blue-800';
    case 'pre_approved':
      return 'bg-emerald-100 text-emerald-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// --- Correspondances risque / priorité ---
const RISK_LABELS = {
  low: 'Faible',
  medium: 'Moyen',
  high: 'Élevé',
  very_low: 'Très Faible'
};

const getRiskLabel = (risk) => RISK_LABELS[risk] || risk || '—';

const getRiskColor = (risk) => {
  switch (risk) {
    case 'low':
    case 'very_low':
    case 'Faible':
    case 'Très Faible':
      return 'text-green-600';
    case 'medium':
    case 'Moyen':
      return 'text-yellow-600';
    case 'high':
    case 'Élevé':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const getPriority = (risk) => {
  switch (risk) {
    case 'high':
      return 'Haute';
    case 'medium':
      return 'Moyenne';
    default:
      return 'Normale';
  }
};

// --- Helpers d'affichage (aucune valeur fabriquée) ---
const fmtM = (v) => (v != null && !isNaN(v) ? `${(Number(v) / 1000000).toFixed(0)}M` : '—');
const fmtFull = (v) => (v != null && !isNaN(v) ? Number(v).toLocaleString() : '—');

// Mensualité par amortissement constant (calcul financier réel, non fabriqué)
const computeMonthlyPayment = (principal, annualRatePct, months) => {
  if (!principal || !months) return null;
  const r = (Number(annualRatePct) || 0) / 100 / 12;
  if (r === 0) return Math.round(principal / months);
  return Math.round((principal * r) / (1 - Math.pow(1 + r, -months)));
};

const BanqueCreditRequests = () => {
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'table'

  const [creditRequests, setCreditRequests] = useState([]);

  // --- Chargement des dossiers de crédit réels (loans) filtrés par bank_id ---
  const fetchCreditRequests = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data: loans, error } = await supabase
        .from('loans')
        .select('*')
        .eq('bank_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const loanList = loans || [];

      // Enrichissement optionnel via properties (bien financé) et bank_clients (profil emprunteur)
      const propertyIds = [...new Set(loanList.map((l) => l.property_id).filter(Boolean))];
      const clientIds = [...new Set(loanList.map((l) => l.client_id).filter(Boolean))];

      let propMap = {};
      let clientMap = {};

      if (propertyIds.length) {
        const { data: props } = await supabase
          .from('properties')
          .select('id, title, name, type, location, region, city, surface, estimated_value, market_value, blockchain_hash')
          .in('id', propertyIds);
        (props || []).forEach((p) => { propMap[p.id] = p; });
      }

      if (clientIds.length) {
        const { data: clients } = await supabase
          .from('bank_clients')
          .select('client_id, name, email, phone, credit_score')
          .eq('bank_id', user.id)
          .in('client_id', clientIds);
        (clients || []).forEach((c) => { clientMap[c.client_id] = c; });
      }

      const mapped = loanList.map((loan) => {
        const property = propMap[loan.property_id] || null;
        const client = clientMap[loan.client_id] || null;
        const propertyValue = property?.estimated_value ?? property?.market_value ?? null;
        const amount = loan.amount ?? 0;
        const ltvRatio = propertyValue ? Math.round((amount / propertyValue) * 100) : null;

        return {
          id: loan.id,
          applicantName: loan.client_name || client?.name || 'Client inconnu',
          applicantPhone: client?.phone || null,
          applicantEmail: client?.email || null,
          creditType: loan.type || 'Crédit',
          platformRef: loan.reference || null,
          requestedAmount: amount,
          propertyValue,
          ltvRatio,
          landLocation: property?.location || property?.city || property?.region || null,
          landArea: property?.surface ? `${property.surface}m²` : null,
          landTitle: property?.blockchain_hash || null,
          zoning: property?.type || null,
          purpose: loan.purpose || null,
          status: loan.status || 'pending',
          statusLabel: STATUS_LABELS[loan.status] || loan.status || '—',
          priority: getPriority(loan.risk_level),
          submissionDate: loan.created_at,
          creditScore: client?.credit_score ?? null,
          riskLevel: loan.risk_level || null,
          advisorNotes: loan.purpose || null,
          processingStage: STATUS_STAGE[loan.status] ?? 0,
          interestRate: loan.interest_rate ?? null,
          proposedTerm: loan.duration_months ?? null,
          monthlyPayment: computeMonthlyPayment(amount, loan.interest_rate, loan.duration_months)
        };
      });

      setCreditRequests(mapped);
    } catch (err) {
      console.error('Erreur chargement demandes de crédit:', err);
      setCreditRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditRequests();
  }, [user?.id]);

  // --- Statistiques calculées sur les données réelles ---
  const creditStats = useMemo(() => {
    const total = creditRequests.length;
    const approved = creditRequests.filter((r) => ['approved', 'disbursed'].includes(r.status)).length;
    const pending = creditRequests.filter((r) => ['pending', 'evaluating', 'pre_approved'].includes(r.status)).length;
    const rejected = creditRequests.filter((r) => r.status === 'rejected').length;
    const totalVolume = creditRequests.reduce((sum, r) => sum + (r.requestedAmount || 0), 0);
    const decided = approved + rejected;
    return {
      totalRequests: total,
      approvedCredits: approved,
      pendingReview: pending,
      rejectedRequests: rejected,
      totalVolume,
      averageAmount: total ? Math.round(totalVolume / total) : 0,
      approvalRate: decided ? Math.round((approved / decided) * 100) : 0
    };
  }, [creditRequests]);

  // --- Actions réelles (mise à jour du statut dans loans) ---
  const updateLoanStatus = async (requestId, newStatus, successTitle) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('loans')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', requestId)
        .eq('bank_id', user.id);
      if (error) throw error;

      setCreditRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? { ...r, status: newStatus, statusLabel: STATUS_LABELS[newStatus] || newStatus, processingStage: STATUS_STAGE[newStatus] ?? r.processingStage }
            : r
        )
      );
      setSelectedRequest((prev) =>
        prev && prev.id === requestId
          ? { ...prev, status: newStatus, statusLabel: STATUS_LABELS[newStatus] || newStatus }
          : prev
      );

      window.safeGlobalToast?.({ title: successTitle, variant: 'success' });
    } catch (err) {
      console.error('Erreur mise à jour statut:', err);
      window.safeGlobalToast?.({ title: 'Erreur', description: "Impossible de mettre à jour le dossier", variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveCredit = (requestId) => updateLoanStatus(requestId, 'approved', 'Crédit approuvé');
  const handleRejectCredit = (requestId) => updateLoanStatus(requestId, 'rejected', 'Crédit rejeté');
  const handleLandValuation = (requestId) => updateLoanStatus(requestId, 'evaluating', 'Dossier mis en évaluation');

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };

  const handleScheduleCall = () => {
    // Pas d'intégration calendrier/téléphonie côté backend pour l'instant
    window.safeGlobalToast?.({
      title: 'Bientôt disponible',
      description: "La programmation d'appel sera disponible prochainement",
      variant: 'default'
    });
  };

  const handleCreateNewRequest = () => {
    window.safeGlobalToast?.({
      title: 'Bientôt disponible',
      description: "La création de dossier depuis cette interface arrive bientôt",
      variant: 'default'
    });
  };

  const filteredRequests = creditRequests.filter((request) => {
    const matchesSearch =
      request.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(request.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.platformRef || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Composant de carte de demande moderne
  const CreditRequestCard = ({ request }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="cursor-pointer"
      >
        <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="font-semibold">
                    {request.applicantName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {request.applicantName}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(request.status)}>
                      {request.statusLabel}
                    </Badge>
                    {request.platformRef && (
                      <Badge variant="outline" className="text-xs">
                        {request.platformRef}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {fmtM(request.requestedAmount)} CFA
                </div>
                <div className="text-xs text-gray-600">
                  LTV: {request.ltvRatio != null ? `${request.ltvRatio}%` : '—'}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Informations bien */}
              <div className="text-sm">
                <div className="flex items-center space-x-2 text-gray-600 mb-1">
                  <MapPin className="h-3 w-3" />
                  <span>{request.landLocation || 'Localisation non renseignée'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 mb-1">
                  <Building className="h-3 w-3" />
                  <span>{request.creditType}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Home className="h-3 w-3" />
                  <span>{[request.landArea, request.zoning].filter(Boolean).join(' • ') || '—'}</span>
                </div>
              </div>

              {/* Progression du dossier */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progression:</span>
                  <span className="font-semibold">{Math.round((request.processingStage / 5) * 100)}%</span>
                </div>
                <Progress value={(request.processingStage / 5) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Étape {request.processingStage}/5</span>
                  <span>Risque: {getRiskLabel(request.riskLevel)}</span>
                </div>
              </div>

              {/* Métriques clés */}
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-semibold text-blue-600">{request.creditScore ?? '—'}</div>
                  <div className="text-xs text-gray-600">Score</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className={`font-semibold ${getRiskColor(request.riskLevel)}`}>
                    {getRiskLabel(request.riskLevel)}
                  </div>
                  <div className="text-xs text-gray-600">Risque</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="font-semibold text-green-600">
                    {request.interestRate != null ? `${request.interestRate}%` : '—'}
                  </div>
                  <div className="text-xs text-gray-600">Taux</div>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleViewDetails(request)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Détails
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isLoading}
                  onClick={() => handleApproveCredit(request.id)}
                >
                  <CheckCircle className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedRequest(request)}
                >
                  <MessageSquare className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Demandes</p>
                  <p className="text-2xl font-bold text-blue-900">{creditStats.totalRequests}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <div className="flex items-center text-xs text-blue-700">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>{creditStats.pendingReview} en cours de traitement</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Taux d'Approbation</p>
                  <p className="text-2xl font-bold text-green-900">{creditStats.approvalRate}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <Progress value={creditStats.approvalRate} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Volume Total</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {creditStats.totalVolume ? `${(creditStats.totalVolume / 1000000000).toFixed(2)}Md CFA` : '—'}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="mt-2">
                <div className="flex items-center text-xs text-yellow-700">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>Moy: {fmtM(creditStats.averageAmount)} CFA</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Dossiers Rejetés</p>
                  <p className="text-2xl font-bold text-purple-900">{creditStats.rejectedRequests}</p>
                </div>
                <XCircle className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-2">
                <div className="flex items-center text-xs text-purple-700">
                  <Target className="h-3 w-3 mr-1" />
                  <span>{creditStats.approvedCredits} approuvés</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Header principal */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion Avancée des Crédits Fonciers</h2>
          <p className="text-gray-600 mt-1">
            Interface unifiée pour les dossiers de financement immobilier
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline" onClick={fetchCreditRequests} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Actualiser
          </Button>
          <Button
            onClick={handleCreateNewRequest}
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Demande
          </Button>
        </div>
      </div>

      {/* Interface principale avec onglets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <span>Centre de Gestion des Crédits</span>
          </CardTitle>
          <CardDescription>
            Traitement des dossiers de financement immobilier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dashboard">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="requests">Demandes</TabsTrigger>
              <TabsTrigger value="analysis">Analyse</TabsTrigger>
              <TabsTrigger value="reports">Rapports</TabsTrigger>
            </TabsList>

            {/* Onglet Dashboard */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* Filtres et vue */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Rechercher demandes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="evaluating">En évaluation</SelectItem>
                      <SelectItem value="pre_approved">Pré-approuvé</SelectItem>
                      <SelectItem value="approved">Approuvé</SelectItem>
                      <SelectItem value="rejected">Rejeté</SelectItem>
                      <SelectItem value="disbursed">Décaissé</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-full lg:w-48">
                      <SelectValue placeholder="Priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes priorités</SelectItem>
                      <SelectItem value="Haute">Haute</SelectItem>
                      <SelectItem value="Moyenne">Moyenne</SelectItem>
                      <SelectItem value="Normale">Normale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Alertes prioritaires */}
              {filteredRequests.filter((r) => r.priority === 'Haute').length > 0 && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-800">Demandes Prioritaires</AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    {filteredRequests.filter((r) => r.priority === 'Haute').length} demande(s) à risque élevé nécessitent une attention immédiate.
                  </AlertDescription>
                </Alert>
              )}

              {/* Affichage des demandes */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <Loader2 className="h-8 w-8 animate-spin mb-3" />
                  <p>Chargement des dossiers de crédit...</p>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-1">Aucune demande de crédit</h3>
                  <p className="text-gray-500">
                    {creditRequests.length === 0
                      ? "Aucun dossier de crédit n'est encore enregistré pour votre banque."
                      : 'Aucun dossier ne correspond aux filtres sélectionnés.'}
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  layout
                >
                  {filteredRequests.map((request) => (
                    <CreditRequestCard key={request.id} request={request} />
                  ))}
                </motion.div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Demandeur</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>LTV</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Progression</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRequests.map((request) => (
                            <TableRow key={request.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback className="text-xs">
                                      {request.applicantName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{request.applicantName}</div>
                                    <div className="text-sm text-gray-500">{request.platformRef || request.id}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{request.creditType}</div>
                                  <div className="text-sm text-gray-500">{request.landLocation || '—'}</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium text-green-600">
                                  {fmtM(request.requestedAmount)} CFA
                                </div>
                                <div className="text-sm text-gray-500">
                                  Bien: {fmtM(request.propertyValue)} CFA
                                </div>
                              </TableCell>
                              <TableCell>
                                {request.ltvRatio != null ? (
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">{request.ltvRatio}%</span>
                                    <div className={`w-2 h-2 rounded-full ${
                                      request.ltvRatio <= 70 ? 'bg-green-500' :
                                      request.ltvRatio <= 80 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`} />
                                  </div>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(request.status)}>
                                  {request.statusLabel}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <Progress value={(request.processingStage / 5) * 100} className="h-2 w-16" />
                                  <span className="text-xs text-gray-500">
                                    {request.processingStage}/5
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewDetails(request)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={isLoading}
                                    onClick={() => handleApproveCredit(request.id)}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedRequest(request)}
                                  >
                                    <MessageSquare className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Onglet Demandes (vue détaillée) */}
            <TabsContent value="requests" className="space-y-6">
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Vue Détaillée des Demandes</h3>
                <p className="text-gray-600">
                  Ouvrez un dossier depuis l'onglet Dashboard pour consulter le détail complet.
                </p>
              </div>
            </TabsContent>

            {/* Onglet Analyse */}
            <TabsContent value="analysis" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="h-5 w-5 text-blue-600" />
                      <span>Répartition par Statut</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {creditStats.totalRequests === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-6">Aucune donnée disponible</p>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Approuvés / Décaissés</span>
                          <span className="font-semibold text-green-600">{creditStats.approvedCredits}</span>
                        </div>
                        <Progress value={(creditStats.approvedCredits / creditStats.totalRequests) * 100} className="h-2" />

                        <div className="flex justify-between items-center">
                          <span className="text-sm">En cours</span>
                          <span className="font-semibold text-yellow-600">{creditStats.pendingReview}</span>
                        </div>
                        <Progress value={(creditStats.pendingReview / creditStats.totalRequests) * 100} className="h-2" />

                        <div className="flex justify-between items-center">
                          <span className="text-sm">Rejetés</span>
                          <span className="font-semibold text-red-600">{creditStats.rejectedRequests}</span>
                        </div>
                        <Progress value={(creditStats.rejectedRequests / creditStats.totalRequests) * 100} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-green-600" />
                      <span>Indicateurs de Portefeuille</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Volume total financé:</span>
                        <span className="font-semibold">{fmtM(creditStats.totalVolume)} CFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Montant moyen:</span>
                        <span className="font-semibold">{fmtM(creditStats.averageAmount)} CFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taux d'approbation:</span>
                        <span className="font-semibold text-green-600">{creditStats.approvalRate}%</span>
                      </div>
                      <Progress value={creditStats.approvalRate} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Rapports */}
            <TabsContent value="reports" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <Download className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold mb-1">Rapport Mensuel</h3>
                    <p className="text-sm text-gray-600">Bientôt disponible</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold mb-1">Analyse Risques</h3>
                    <p className="text-sm text-gray-600">Bientôt disponible</p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold mb-1">Rapport Portefeuille</h3>
                    <p className="text-sm text-gray-600">Bientôt disponible</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal de détails avancé */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="font-semibold">
                    {selectedRequest.applicantName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold">{selectedRequest.applicantName}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(selectedRequest.status)}>
                      {selectedRequest.statusLabel}
                    </Badge>
                    {selectedRequest.platformRef && (
                      <Badge variant="outline">{selectedRequest.platformRef}</Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedRequest(null)}
                className="p-2"
              >
                <XCircle className="h-5 w-5" />
              </Button>
            </div>

            {/* Progression du dossier */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Progression du Dossier</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    Étape {selectedRequest.processingStage}/5
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress value={(selectedRequest.processingStage / 5) * 100} className="h-3" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Soumission</span>
                    <span>Vérification</span>
                    <span>Évaluation</span>
                    <span>Approbation</span>
                    <span>Finalisation</span>
                  </div>
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Statut actuel: <strong>{selectedRequest.statusLabel}</strong>
                      {selectedRequest.riskLevel && (
                        <> — Niveau de risque: <strong>{getRiskLabel(selectedRequest.riskLevel)}</strong></>
                      )}
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informations demandeur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profil Demandeur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Contact</label>
                    <p className="font-medium">{selectedRequest.applicantPhone || '—'}</p>
                    <p className="text-sm text-gray-600">{selectedRequest.applicantEmail || '—'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Score de crédit</label>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{selectedRequest.creditScore ?? '—'}</span>
                      {selectedRequest.creditScore != null && (
                        <div className={`w-2 h-2 rounded-full ${
                          selectedRequest.creditScore >= 750 ? 'bg-green-500' :
                          selectedRequest.creditScore >= 650 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Niveau de risque</label>
                    <p className={`font-medium ${getRiskColor(selectedRequest.riskLevel)}`}>
                      {getRiskLabel(selectedRequest.riskLevel)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Détails du crédit */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Conditions Financières
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Montant demandé</label>
                    <p className="font-medium text-lg text-blue-600">
                      {fmtM(selectedRequest.requestedAmount)} FCFA
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Valeur du bien</label>
                    <p className="font-medium">
                      {fmtM(selectedRequest.propertyValue)} FCFA
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Ratio LTV</label>
                    <p className="font-medium">{selectedRequest.ltvRatio != null ? `${selectedRequest.ltvRatio}%` : '—'}</p>
                    {selectedRequest.ltvRatio != null && (
                      <Progress value={selectedRequest.ltvRatio} className="h-2 mt-1" />
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Taux proposé</label>
                    <p className="font-medium text-green-600">
                      {selectedRequest.interestRate != null ? `${selectedRequest.interestRate}%` : '—'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Durée</label>
                    <p className="font-medium">
                      {selectedRequest.proposedTerm != null ? `${selectedRequest.proposedTerm} mois` : '—'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Mensualité estimée</label>
                    <p className="font-medium">
                      {selectedRequest.monthlyPayment != null ? `${fmtFull(selectedRequest.monthlyPayment)} FCFA` : '—'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Informations bien */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Détails du Bien
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Localisation</label>
                    <p className="font-medium">{selectedRequest.landLocation || '—'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Superficie</label>
                    <p className="font-medium">{selectedRequest.landArea || '—'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Référence blockchain</label>
                    <p className="font-medium text-xs break-all">{selectedRequest.landTitle || '—'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Type de bien</label>
                    <p className="font-medium">{selectedRequest.zoning || '—'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Objet du financement</label>
                    <p className="font-medium">{selectedRequest.purpose || '—'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Documents et actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 p-3 bg-gray-50 rounded">
                    <CheckSquare className="h-4 w-4 text-gray-400" />
                    <span>Gestion documentaire bientôt disponible</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Notes et Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Objet / Notes</label>
                    <p className="text-sm bg-blue-50 p-3 rounded">
                      {selectedRequest.advisorNotes || 'Aucune note'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                      onClick={() => handleApproveCredit(selectedRequest.id)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approuver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-600"
                      disabled={isLoading}
                      onClick={() => handleRejectCredit(selectedRequest.id)}
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Rejeter
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isLoading}
                      onClick={() => handleLandValuation(selectedRequest.id)}
                    >
                      <Calculator className="h-3 w-3 mr-1" />
                      Évaluer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleScheduleCall}
                    >
                      <PhoneCall className="h-3 w-3 mr-1" />
                      Appeler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default BanqueCreditRequests;

import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Link2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Hash,
  Zap,
  Activity,
  DollarSign,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Search,
  Filter,
  TrendingUp,
  Server,
  Lock,
  Unlock,
  Package,
  HardDrive,
  Globe
} from 'lucide-react';

import { useAuth } from '@/contexts/UnifiedAuthContext';
import NotaireSupabaseService from '@/services/NotaireSupabaseService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const blockchainNetworks = [
  { value: 'polygon', label: 'Polygon (MATIC)', color: 'bg-purple-100 text-purple-700', icon: '⬡' },
  { value: 'ethereum', label: 'Ethereum (ETH)', color: 'bg-blue-100 text-blue-700', icon: '◆' },
  { value: 'binance', label: 'BSC (BNB)', color: 'bg-amber-100 text-amber-700', icon: '●' },
  { value: 'avalanche', label: 'Avalanche (AVAX)', color: 'bg-red-100 text-red-700', icon: '▲' }
];

const verificationStatusStyles = {
  pending: { label: 'En attente', className: 'bg-amber-100 text-amber-800', icon: Clock },
  verified: { label: 'Vérifié', className: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  failed: { label: 'Échec', className: 'bg-red-100 text-red-800', icon: AlertCircle },
  expired: { label: 'Expiré', className: 'bg-slate-100 text-slate-700', icon: Clock }
};

const NotaireBlockchainModernized = () => {
  const { dashboardStats } = useOutletContext() || {};
  const { user } = useAuth();

  const [authentications, setAuthentications] = useState([]);
  const [authStats, setAuthStats] = useState({
    totalDocuments: 0,
    authenticatedDocs: 0,
    pendingAuth: 0,
    blockchainCost: 0,
    successRate: 0
  });
  const [selectedAuth, setSelectedAuth] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [networkFilter, setNetworkFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('documents');
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  useEffect(() => {
    if (user) {
      loadBlockchainData(true);
    }
  }, [user]);

  const loadBlockchainData = async (initial = false) => {
    if (!user) return;
    initial ? setIsLoading(true) : setIsRefreshing(true);

    try {
      const [authResult, statsResult] = await Promise.all([
        NotaireSupabaseService.getDocumentAuthentications(user.id),
        NotaireSupabaseService.getAuthenticationStats(user.id)
      ]);

      if (authResult?.success) {
        setAuthentications(authResult.data || []);
      }

      if (statsResult?.success) {
        setAuthStats(prev => ({ ...prev, ...statsResult.data }));
      }
    } catch (error) {
      console.error('Erreur chargement données blockchain:', error);
      window.safeGlobalToast?.({
        title: 'Erreur de chargement',
        description: 'Impossible de récupérer les authentifications blockchain.',
        variant: 'destructive'
      });
    } finally {
      initial ? setIsLoading(false) : setIsRefreshing(false);
    }
  };

  const filteredAuthentications = useMemo(() => {
    return authentications.filter((auth) => {
      const matchesSearch =
        !searchTerm ||
        auth.transaction_hash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auth.document_hash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auth.notarial_documents?.document_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesNetwork = networkFilter === 'all' || auth.blockchain_network === networkFilter;
      const matchesStatus = statusFilter === 'all' || auth.verification_status === statusFilter;

      return matchesSearch && matchesNetwork && matchesStatus;
    });
  }, [authentications, searchTerm, networkFilter, statusFilter]);

  const formatCurrency = (amount) => {
    if (!amount || Number.isNaN(Number(amount))) return '0 FCFA';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateHash = (hash) => {
    if (!hash) return 'N/A';
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;
  };

  const getNetworkInfo = (network) => {
    return blockchainNetworks.find((n) => n.value === network) || blockchainNetworks[0];
  };

  const getStatusInfo = (status) => {
    return verificationStatusStyles[status] || verificationStatusStyles.pending;
  };

  const handleAuthenticateDocument = async (documentId) => {
    try {
      const result = await NotaireSupabaseService.authenticateDocument(user.id, documentId);
      if (result.success) {
        window.safeGlobalToast?.({
          title: 'Authentification lancée',
          description: 'Le document est en cours d\'authentification sur la blockchain.',
          variant: 'success'
        });
        await loadBlockchainData(false);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      window.safeGlobalToast?.({
        title: 'Erreur',
        description: 'Impossible d\'authentifier le document.',
        variant: 'destructive'
      });
    }
  };

  const monthlyAuthTrend = useMemo(() => {
    const last6Months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });

      const monthAuths = authentications.filter((auth) => {
        const authDate = new Date(auth.authenticated_at);
        return (
          authDate.getFullYear() === date.getFullYear() &&
          authDate.getMonth() === date.getMonth()
        );
      });

      last6Months.push({
        month: monthLabel,
        count: monthAuths.length,
        verified: monthAuths.filter((a) => a.verification_status === 'verified').length,
        cost: monthAuths.reduce((sum, a) => sum + (a.total_cost || 0), 0)
      });
    }

    return last6Months;
  }, [authentications]);

  const maxMonthlyCount = Math.max(...monthlyAuthTrend.map((m) => m.count), 1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Centre Blockchain</h2>
          <p className="text-gray-600">
            Authentification décentralisée et traçabilité immutable des actes notariaux
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" />
            Réseau actif
          </Badge>
          <Button variant="outline" onClick={() => loadBlockchainData(false)} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documents authentifiés</CardTitle>
            <Shield className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{authStats.authenticatedDocs}</div>
            <p className="text-xs text-muted-foreground">
              Sur {authStats.totalDocuments} documents traités
            </p>
            <Progress value={authStats.successRate} className="mt-3" />
            <p className="text-xs text-gray-500 mt-1">Taux de succès: {authStats.successRate}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{authStats.pendingAuth}</div>
            <p className="text-xs text-muted-foreground">
              Authentifications blockchain en cours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Coûts blockchain</CardTitle>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(authStats.blockchainCost)}</div>
            <p className="text-xs text-muted-foreground">
              Frais totaux d'authentification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Réseau préféré</CardTitle>
            <Link2 className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⬡</span>
              <div>
                <div className="text-xl font-bold">Polygon</div>
                <p className="text-xs text-muted-foreground">Réseau principal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full">
          <TabsTrigger value="documents">Documents authentifiés</TabsTrigger>
          <TabsTrigger value="analytics">Analytics blockchain</TabsTrigger>
          <TabsTrigger value="network">Réseaux & coûts</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <CardTitle>Historique d'authentification</CardTitle>
                  <CardDescription>
                    Suivi en temps réel des documents authentifiés sur la blockchain
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAuthDialog(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Nouveau document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Rechercher par hash, nom..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                    icon={<Search className="h-4 w-4" />}
                  />
                </div>
                <Select value={networkFilter} onValueChange={setNetworkFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Réseau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les réseaux</SelectItem>
                    {blockchainNetworks.map((net) => (
                      <SelectItem key={net.value} value={net.value}>
                        {net.icon} {net.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    {Object.entries(verificationStatusStyles).map(([key, info]) => (
                      <SelectItem key={key} value={key}>
                        {info.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-[500px]">
                {filteredAuthentications.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Hash transaction</TableHead>
                        <TableHead>Réseau</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Coût</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAuthentications.map((auth) => {
                        const statusInfo = getStatusInfo(auth.verification_status);
                        const networkInfo = getNetworkInfo(auth.blockchain_network);
                        const StatusIcon = statusInfo.icon;

                        return (
                          <TableRow key={auth.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileCheck className="h-4 w-4 text-gray-500" />
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {auth.notarial_documents?.document_name || 'Document'}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {auth.notarial_documents?.document_type || 'Type inconnu'}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Hash className="h-3 w-3 text-gray-400" />
                                <code className="text-xs font-mono text-gray-700">
                                  {truncateHash(auth.transaction_hash)}
                                </code>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={networkInfo.color}>
                                {networkInfo.icon} {networkInfo.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${statusInfo.className} flex items-center gap-1 w-fit`}>
                                <StatusIcon className="h-3 w-3" />
                                {statusInfo.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {formatDate(auth.authenticated_at)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(auth.total_cost)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedAuth(auth)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Détails
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-sm text-gray-500">
                    <Shield className="h-8 w-8 mb-2 text-gray-400" />
                    {searchTerm || networkFilter !== 'all' || statusFilter !== 'all'
                      ? 'Aucun résultat ne correspond aux filtres appliqués'
                      : 'Aucune authentification blockchain disponible'}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tendance mensuelle</CardTitle>
                <CardDescription>Evolution des authentifications sur 6 mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end gap-3">
                  {monthlyAuthTrend.map((item) => (
                    <div key={item.month} className="flex-1 flex flex-col items-center justify-end">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-purple-500 to-purple-300 transition-all"
                        style={{ height: `${Math.max(10, (item.count / maxMonthlyCount) * 100)}%` }}
                      />
                      <div className="mt-3 text-xs font-medium text-gray-700">{item.month}</div>
                      <Badge className="mt-1 bg-slate-100 text-slate-700" variant="secondary">
                        {item.count} docs
                      </Badge>
                      <div className="text-[11px] text-gray-500">{item.verified} vérifiés</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par réseau</CardTitle>
                <CardDescription>Distribution des authentifications par blockchain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {blockchainNetworks.map((network) => {
                  const count = authentications.filter(
                    (a) => a.blockchain_network === network.value
                  ).length;
                  const percentage = authentications.length
                    ? Math.round((count / authentications.length) * 100)
                    : 0;

                  return (
                    <div key={network.value} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{network.icon}</span>
                          <span className="text-sm font-medium">{network.label}</span>
                        </div>
                        <Badge variant="outline">{count} docs</Badge>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="text-xs text-gray-500">{percentage}% du total</div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Indicateurs de performance</CardTitle>
              <CardDescription>Métriques clés de l'activité blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 rounded-lg border bg-gradient-to-br from-emerald-50 to-white">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> Taux de succès
                  </div>
                  <div className="mt-2 text-3xl font-bold text-gray-900">
                    {authStats.successRate}%
                  </div>
                  <Progress value={authStats.successRate} className="mt-3" />
                </div>

                <div className="p-4 rounded-lg border bg-gradient-to-br from-amber-50 to-white">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                    <Clock className="h-4 w-4" /> En attente
                  </div>
                  <div className="mt-2 text-3xl font-bold text-gray-900">
                    {authStats.pendingAuth}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Documents en traitement</p>
                </div>

                <div className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-white">
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                    <Activity className="h-4 w-4" /> Coût moyen
                  </div>
                  <div className="mt-2 text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      authStats.totalDocuments
                        ? authStats.blockchainCost / authStats.totalDocuments
                        : 0
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Par authentification</p>
                </div>

                <div className="p-4 rounded-lg border bg-gradient-to-br from-purple-50 to-white">
                  <div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                    <TrendingUp className="h-4 w-4" /> Croissance
                  </div>
                  <div className="mt-2 text-3xl font-bold text-gray-900">
                    +{monthlyAuthTrend.length > 1 ? Math.round(((monthlyAuthTrend[monthlyAuthTrend.length - 1].count - monthlyAuthTrend[0].count) / Math.max(1, monthlyAuthTrend[0].count)) * 100) : 0}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Sur 6 mois</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration des réseaux blockchain</CardTitle>
              <CardDescription>
                Réseaux disponibles et frais d'authentification associés
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {blockchainNetworks.map((network) => (
                <div key={network.value} className="p-4 rounded-lg border hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{network.icon}</div>
                      <div>
                        <div className="font-semibold text-gray-900">{network.label}</div>
                        <div className="text-sm text-gray-500">
                          {network.value === 'polygon' && 'Réseau principal - Frais faibles'}
                          {network.value === 'ethereum' && 'Sécurité maximale - Frais élevés'}
                          {network.value === 'binance' && 'Alternative rapide - Frais modérés'}
                          {network.value === 'avalanche' && 'Haute performance - Frais bas'}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={network.color}>
                        {network.value === 'polygon' ? 'Actif' : 'Disponible'}
                      </Badge>
                      <div className="text-sm font-semibold text-gray-900">
                        {network.value === 'polygon' && '5 000 FCFA'}
                        {network.value === 'ethereum' && '15 000 FCFA'}
                        {network.value === 'binance' && '7 500 FCFA'}
                        {network.value === 'avalanche' && '6 000 FCFA'}
                      </div>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                    <div>
                      <div className="font-medium">Temps moyen</div>
                      <div className="text-gray-900 font-semibold">
                        {network.value === 'polygon' && '2-5 min'}
                        {network.value === 'ethereum' && '10-15 min'}
                        {network.value === 'binance' && '3-7 min'}
                        {network.value === 'avalanche' && '1-3 min'}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Finalité</div>
                      <div className="text-gray-900 font-semibold">
                        {network.value === 'polygon' && '128 blocs'}
                        {network.value === 'ethereum' && '12 blocs'}
                        {network.value === 'binance' && '15 blocs'}
                        {network.value === 'avalanche' && '1 sec'}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Fiabilité</div>
                      <div className="text-gray-900 font-semibold">
                        {network.value === 'polygon' && '99.9%'}
                        {network.value === 'ethereum' && '100%'}
                        {network.value === 'binance' && '99.8%'}
                        {network.value === 'avalanche' && '99.9%'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Coûts par mois</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {monthlyAuthTrend.map((item) => (
                    <div key={item.month} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.month}</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(item.cost)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Informations techniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">Chiffrement</div>
                        <div className="text-gray-600">SHA-256 + Keccak-256</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Server className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">Infrastructure</div>
                        <div className="text-gray-600">Nœuds distribués multi-région</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-emerald-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">Protocole</div>
                        <div className="text-gray-600">ERC-721 (NFT) + IPFS</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <HardDrive className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">Stockage</div>
                        <div className="text-gray-600">Décentralisé (IPFS + Arweave)</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">Performance</div>
                        <div className="text-gray-600">~2000 TPS (Polygon)</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">Smart Contracts</div>
                        <div className="text-gray-600">Solidity v0.8.20+</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog détails authentification */}
      {selectedAuth && (
        <Dialog open={!!selectedAuth} onOpenChange={() => setSelectedAuth(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de l'authentification blockchain</DialogTitle>
              <DialogDescription>
                Informations complètes sur l'authentification du document
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-medium text-gray-500">Document</div>
                  <div className="mt-1 font-semibold text-gray-900">
                    {selectedAuth.notarial_documents?.document_name || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Type</div>
                  <div className="mt-1 font-semibold text-gray-900">
                    {selectedAuth.notarial_documents?.document_type || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Réseau blockchain</div>
                  <Badge className={getNetworkInfo(selectedAuth.blockchain_network).color}>
                    {getNetworkInfo(selectedAuth.blockchain_network).icon}{' '}
                    {getNetworkInfo(selectedAuth.blockchain_network).label}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Statut</div>
                  <Badge className={getStatusInfo(selectedAuth.verification_status).className}>
                    {getStatusInfo(selectedAuth.verification_status).label}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Hash de transaction</div>
                <code className="block p-3 bg-gray-100 rounded text-xs font-mono break-all">
                  {selectedAuth.transaction_hash}
                </code>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Hash du document</div>
                <code className="block p-3 bg-gray-100 rounded text-xs font-mono break-all">
                  {selectedAuth.document_hash}
                </code>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-sm font-medium text-gray-500">Date authentification</div>
                  <div className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedAuth.authenticated_at)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Frais d'authentification</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">
                    {formatCurrency(selectedAuth.authentication_fee)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Frais réseau</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">
                    {formatCurrency(selectedAuth.network_fee)}
                  </div>
                </div>
              </div>

              {selectedAuth.block_number && (
                <div>
                  <div className="text-sm font-medium text-gray-500">Bloc #</div>
                  <div className="mt-1 font-semibold text-gray-900">
                    {selectedAuth.block_number.toLocaleString('fr-FR')}
                  </div>
                </div>
              )}

              {selectedAuth.ipfs_hash && (
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">IPFS Hash</div>
                  <code className="block p-3 bg-gray-100 rounded text-xs font-mono break-all">
                    {selectedAuth.ipfs_hash}
                  </code>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default NotaireBlockchainModernized;

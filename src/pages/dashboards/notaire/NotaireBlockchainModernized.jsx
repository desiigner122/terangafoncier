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
  RefreshCw,
  Eye,
  Search,
  TrendingUp,
  Server,
  Lock,
  Package,
  HardDrive,
  Globe,
  Boxes
} from 'lucide-react';

import supabase from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
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
  DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

// Réseaux blockchain supportés — contenu ÉDITORIAL (capacités de la plateforme),
// pas une métrique. Aucune colonne "network" n'existe dans le schéma réel.
const blockchainNetworks = [
  { value: 'polygon', label: 'Polygon (MATIC)', color: 'bg-purple-100 text-purple-700', icon: '⬡' },
  { value: 'ethereum', label: 'Ethereum (ETH)', color: 'bg-blue-100 text-blue-700', icon: '◆' },
  { value: 'binance', label: 'BSC (BNB)', color: 'bg-amber-100 text-amber-700', icon: '●' },
  { value: 'avalanche', label: 'Avalanche (AVAX)', color: 'bg-red-100 text-red-700', icon: '▲' }
];

// Statuts réels de document_authentication.verification_status
const verificationStatusStyles = {
  pending: { label: 'En attente', className: 'bg-amber-100 text-amber-800', icon: Clock },
  verified: { label: 'Vérifié', className: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  rejected: { label: 'Rejeté', className: 'bg-red-100 text-red-800', icon: AlertCircle }
};

// Statuts réels (indicatifs) de blockchain_transactions.status
const txStatusStyles = {
  pending: { label: 'En attente', className: 'bg-amber-100 text-amber-800' },
  confirmed: { label: 'Confirmée', className: 'bg-emerald-100 text-emerald-800' },
  completed: { label: 'Complétée', className: 'bg-emerald-100 text-emerald-800' },
  success: { label: 'Réussie', className: 'bg-emerald-100 text-emerald-800' },
  failed: { label: 'Échouée', className: 'bg-red-100 text-red-800' }
};

const NotaireBlockchainModernized = () => {
  useOutletContext();
  const { user } = useAuth();

  const [authentications, setAuthentications] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [authStats, setAuthStats] = useState({
    totalDocuments: 0,
    authenticatedDocs: 0,
    pendingAuth: 0,
    rejectedDocs: 0,
    successRate: 0,
    totalTransactions: 0
  });
  const [selectedAuth, setSelectedAuth] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('documents');

  useEffect(() => {
    if (user) {
      loadBlockchainData(true);
    }
  }, [user]);

  const loadBlockchainData = async (initial = false) => {
    if (!user) return;
    initial ? setIsLoading(true) : setIsRefreshing(true);

    try {
      const [authRes, txRes] = await Promise.all([
        supabase
          .from('document_authentication')
          .select('id, document_name, document_type, verification_status, authenticity_hash, property_id, verified_at, created_at')
          .eq('notaire_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('blockchain_transactions')
          .select('id, property_id, amount, status, transaction_hash, block_number, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
      ]);

      if (authRes.error) throw authRes.error;
      if (txRes.error) throw txRes.error;

      const auths = authRes.data || [];
      const txs = txRes.data || [];

      setAuthentications(auths);
      setTransactions(txs);

      const total = auths.length;
      const verified = auths.filter((a) => a.verification_status === 'verified').length;
      const pending = auths.filter((a) => a.verification_status === 'pending').length;
      const rejected = auths.filter((a) => a.verification_status === 'rejected').length;

      setAuthStats({
        totalDocuments: total,
        authenticatedDocs: verified,
        pendingAuth: pending,
        rejectedDocs: rejected,
        successRate: total > 0 ? Math.round((verified / total) * 100) : 0,
        totalTransactions: txs.length
      });
    } catch (error) {
      console.error('Erreur chargement données blockchain:', error);
      window.safeGlobalToast?.({
        title: 'Erreur de chargement',
        description: 'Impossible de récupérer les données blockchain.',
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
        auth.authenticity_hash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auth.document_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auth.document_type?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || auth.verification_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [authentications, searchTerm, statusFilter]);

  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return transactions;
    return transactions.filter((tx) =>
      tx.transaction_hash?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  const formatCurrency = (amount) => {
    if (!amount || Number.isNaN(Number(amount))) return '—';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateHash = (hash) => {
    if (!hash) return '—';
    if (hash.length <= 16) return hash;
    return `${hash.substring(0, 8)}...${hash.substring(hash.length - 6)}`;
  };

  const getStatusInfo = (status) => {
    return verificationStatusStyles[status] || verificationStatusStyles.pending;
  };

  const getTxStatusInfo = (status) => {
    return txStatusStyles[status] || { label: status || 'Inconnu', className: 'bg-slate-100 text-slate-700' };
  };

  // Tendance mensuelle réelle des authentifications (created_at)
  const monthlyAuthTrend = useMemo(() => {
    const last6Months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });

      const monthAuths = authentications.filter((auth) => {
        const authDate = new Date(auth.verified_at || auth.created_at);
        return (
          authDate.getFullYear() === date.getFullYear() &&
          authDate.getMonth() === date.getMonth()
        );
      });

      const monthTxs = transactions.filter((tx) => {
        const txDate = new Date(tx.created_at);
        return (
          txDate.getFullYear() === date.getFullYear() &&
          txDate.getMonth() === date.getMonth()
        );
      });

      last6Months.push({
        month: monthLabel,
        count: monthAuths.length,
        verified: monthAuths.filter((a) => a.verification_status === 'verified').length,
        txVolume: monthTxs.reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
      });
    }

    return last6Months;
  }, [authentications, transactions]);

  const maxMonthlyCount = Math.max(...monthlyAuthTrend.map((m) => m.count), 1);

  const statusDistribution = useMemo(() => {
    const total = authentications.length;
    return Object.entries(verificationStatusStyles).map(([key, info]) => {
      const count = authentications.filter((a) => a.verification_status === key).length;
      return {
        key,
        label: info.label,
        count,
        percentage: total ? Math.round((count / total) * 100) : 0
      };
    });
  }, [authentications]);

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
              Authentifications en cours de vérification
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documents rejetés</CardTitle>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{authStats.rejectedDocs}</div>
            <p className="text-xs text-muted-foreground">
              Authentifications non validées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Transactions blockchain</CardTitle>
            <Boxes className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{authStats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              Enregistrées on-chain
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-1 sm:grid-cols-4 w-full">
          <TabsTrigger value="documents">Documents authentifiés</TabsTrigger>
          <TabsTrigger value="transactions">Transactions on-chain</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="network">Réseaux & infos</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <CardTitle>Historique d'authentification</CardTitle>
                  <CardDescription>
                    Documents notariaux authentifiés et leur empreinte cryptographique
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Rechercher par nom, type, empreinte..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                    icon={<Search className="h-4 w-4" />}
                  />
                </div>
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
                        <TableHead>Empreinte (hash)</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAuthentications.map((auth) => {
                        const statusInfo = getStatusInfo(auth.verification_status);
                        const StatusIcon = statusInfo.icon;

                        return (
                          <TableRow key={auth.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileCheck className="h-4 w-4 text-gray-500" />
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {auth.document_name || 'Document'}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {auth.document_type || 'Type inconnu'}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Hash className="h-3 w-3 text-gray-400" />
                                <code className="text-xs font-mono text-gray-700">
                                  {truncateHash(auth.authenticity_hash)}
                                </code>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${statusInfo.className} flex items-center gap-1 w-fit`}>
                                <StatusIcon className="h-3 w-3" />
                                {statusInfo.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {formatDate(auth.verified_at || auth.created_at)}
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
                    {searchTerm || statusFilter !== 'all'
                      ? 'Aucun résultat ne correspond aux filtres appliqués'
                      : 'Aucune authentification de document disponible'}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transactions blockchain</CardTitle>
              <CardDescription>
                Transactions enregistrées on-chain associées à votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Rechercher par hash de transaction..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                    icon={<Search className="h-4 w-4" />}
                  />
                </div>
              </div>

              <ScrollArea className="h-[500px]">
                {filteredTransactions.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hash transaction</TableHead>
                        <TableHead>Bloc</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((tx) => {
                        const txStatus = getTxStatusInfo(tx.status);
                        return (
                          <TableRow key={tx.id} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Hash className="h-3 w-3 text-gray-400" />
                                <code className="text-xs font-mono text-gray-700">
                                  {truncateHash(tx.transaction_hash)}
                                </code>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {tx.block_number ? `#${Number(tx.block_number).toLocaleString('fr-FR')}` : '—'}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(tx.amount)}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${txStatus.className} w-fit`}>
                                {txStatus.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {formatDate(tx.created_at)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center text-sm text-gray-500">
                    <Link2 className="h-8 w-8 mb-2 text-gray-400" />
                    {searchTerm
                      ? 'Aucune transaction ne correspond à la recherche'
                      : 'Aucune transaction blockchain enregistrée'}
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
                {authentications.length ? (
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
                ) : (
                  <div className="h-64 flex items-center justify-center text-sm text-gray-500">
                    Aucune donnée d'authentification à afficher
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par statut</CardTitle>
                <CardDescription>Distribution des authentifications de documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {authentications.length ? (
                  statusDistribution.map((item) => (
                    <div key={item.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.label}</span>
                        <Badge variant="outline">{item.count} docs</Badge>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                      <div className="text-xs text-gray-500">{item.percentage}% du total</div>
                    </div>
                  ))
                ) : (
                  <div className="h-40 flex items-center justify-center text-sm text-gray-500">
                    Aucune authentification enregistrée
                  </div>
                )}
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
                    <Activity className="h-4 w-4" /> Transactions on-chain
                  </div>
                  <div className="mt-2 text-3xl font-bold text-gray-900">
                    {authStats.totalTransactions}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Total enregistrées</p>
                </div>

                <div className="p-4 rounded-lg border bg-gradient-to-br from-purple-50 to-white">
                  <div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                    <TrendingUp className="h-4 w-4" /> Croissance
                  </div>
                  <div className="mt-2 text-3xl font-bold text-gray-900">
                    {monthlyAuthTrend.length > 1
                      ? `${monthlyAuthTrend[monthlyAuthTrend.length - 1].count - monthlyAuthTrend[0].count >= 0 ? '+' : ''}${Math.round(((monthlyAuthTrend[monthlyAuthTrend.length - 1].count - monthlyAuthTrend[0].count) / Math.max(1, monthlyAuthTrend[0].count)) * 100)}%`
                      : '—'}
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
              <CardTitle>Réseaux blockchain supportés</CardTitle>
              <CardDescription>
                Réseaux compatibles avec la plateforme d'authentification (information)
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
                    <Badge className={network.color}>
                      {network.value === 'polygon' ? 'Recommandé' : 'Compatible'}
                    </Badge>
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
                <CardTitle className="text-base">Volume transactions / mois</CardTitle>
                <CardDescription>Montants on-chain enregistrés</CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length ? (
                  <div className="space-y-3">
                    {monthlyAuthTrend.map((item) => (
                      <div key={item.month} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.month}</span>
                        <span className="font-semibold text-gray-900">
                          {item.txVolume ? formatCurrency(item.txVolume) : '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-sm text-gray-500">
                    Aucune transaction enregistrée
                  </div>
                )}
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
              <DialogTitle>Détails de l'authentification</DialogTitle>
              <DialogDescription>
                Informations complètes sur l'authentification du document
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-medium text-gray-500">Document</div>
                  <div className="mt-1 font-semibold text-gray-900">
                    {selectedAuth.document_name || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Type</div>
                  <div className="mt-1 font-semibold text-gray-900">
                    {selectedAuth.document_type || '—'}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Statut</div>
                  <Badge className={getStatusInfo(selectedAuth.verification_status).className}>
                    {getStatusInfo(selectedAuth.verification_status).label}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Bien lié</div>
                  <div className="mt-1 text-sm text-gray-900">
                    {selectedAuth.property_id || '—'}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm font-medium text-gray-500 mb-2">Empreinte du document (hash)</div>
                <code className="block p-3 bg-gray-100 rounded text-xs font-mono break-all">
                  {selectedAuth.authenticity_hash || '—'}
                </code>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-sm font-medium text-gray-500">Date de vérification</div>
                  <div className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedAuth.verified_at)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Date de création</div>
                  <div className="mt-1 text-sm text-gray-900">
                    {formatDate(selectedAuth.created_at)}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
};

export default NotaireBlockchainModernized;

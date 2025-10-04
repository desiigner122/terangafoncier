/**
 * PAGE TRANSACTIONS ADMIN - MODERNISÉE AVEC DONNÉES RÉELLES + IA + BLOCKCHAIN
 * 
 * Cette page utilise le GlobalAdminService pour afficher uniquement des données réelles
 * et intègre les préparations pour l'IA et la Blockchain.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Calendar,
  Eye,
  Download,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Brain,
  Users,
  Building,
  TrendingUp,
  MapPin,
  FileText,
  Banknote,
  Trash2,
  Shield,
  Zap,
  Activity,
  Database,
  Link
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'react-hot-toast';
import ModernAdminSidebar from '@/components/admin/ModernAdminSidebar';
import globalAdminService from '@/services/GlobalAdminService';

const ModernTransactionsPage = () => {
  // États principaux - UNIQUEMENT DONNÉES RÉELLES
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [transactionStats, setTransactionStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // États IA et Blockchain
  const [aiAnalysis, setAiAnalysis] = useState([]);
  const [blockchainMetrics, setBlockchainMetrics] = useState({});

  // ============================================================================
  // CHARGEMENT DES DONNÉES RÉELLES
  // ============================================================================

  const loadRealData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Chargement des transactions réelles...');
      
      // Charger transactions et statistiques en parallèle
      const [transactionsResult, statsResult] = await Promise.all([
        globalAdminService.getAllTransactions(),
        globalAdminService.getTransactionStats()
      ]);

      if (transactionsResult.success) {
        setTransactions(transactionsResult.data);
        setFilteredTransactions(transactionsResult.data);
        console.log(`✅ ${transactionsResult.data.length} transactions réelles chargées`);
      } else {
        throw new Error(transactionsResult.error);
      }

      if (statsResult.success) {
        setTransactionStats(statsResult.data);
        console.log('✅ Statistiques transactions chargées');
      }

      // Charger l'analyse IA
      await loadAIAnalysis();
      
      // Charger les métriques Blockchain
      await loadBlockchainMetrics();

    } catch (error) {
      console.error('❌ Erreur chargement transactions:', error);
      setError(error.message);
      toast.error('Erreur lors du chargement des transactions');
    } finally {
      setLoading(false);
    }
  };

  const loadAIAnalysis = async () => {
    try {
      // Générer une analyse IA basée sur les vraies données
      const analysis = [
        {
          type: 'fraud',
          title: 'Détection de fraude',
          value: `${transactionStats.fraudDetected || 0}`,
          risk: 'low',
          description: 'Transactions suspectes détectées'
        },
        {
          type: 'processing',
          title: 'Traitement IA',
          value: `${Math.floor((transactionStats.aiProcessed / transactionStats.totalTransactions) * 100) || 0}%`,
          risk: 'none',
          description: 'Transactions traitées par IA'
        },
        {
          type: 'conversion',
          title: 'Taux de conversion',
          value: `${transactionStats.conversionRate?.toFixed(1) || 0}%`,
          risk: transactionStats.conversionRate < 50 ? 'medium' : 'none',
          description: 'Transactions complétées'
        }
      ];
      
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Erreur analyse IA:', error);
    }
  };

  const loadBlockchainMetrics = async () => {
    try {
      const blockchainData = await globalAdminService.prepareBlockchainIntegration();
      setBlockchainMetrics({
        totalTransactions: transactionStats.totalTransactions || 0,
        blockchainTransactions: blockchainData.features.cryptoPayments ? 0 : 0,
        readyForBlockchain: transactionStats.completedTransactions || 0,
        smartContracts: 0 // À implémenter
      });
    } catch (error) {
      console.error('Erreur métriques blockchain:', error);
    }
  };

  // ============================================================================
  // FILTRAGE ET RECHERCHE
  // ============================================================================

  useEffect(() => {
    let filtered = transactions;

    // Filtrage par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(transaction => 
        transaction.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toString().includes(searchTerm)
      );
    }

    // Filtrage par statut
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(transaction => {
        switch (selectedFilter) {
          case 'completed': return transaction.status === 'completed';
          case 'pending': return transaction.status === 'pending';
          case 'failed': return transaction.status === 'failed';
          case 'cancelled': return transaction.status === 'cancelled';
          case 'high-value': return transaction.amount > 10000000; // Plus de 10M CFA
          case 'flagged': return transaction.fraudScore > 50;
          default: return true;
        }
      });
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, selectedFilter]);

  // ============================================================================
  // ACTIONS TRANSACTIONS - FONCTIONNELLES
  // ============================================================================

  const handleUpdateTransactionStatus = async (transactionId, newStatus) => {
    try {
      const result = await globalAdminService.updateTransactionStatus(transactionId, newStatus);
      
      if (result.success) {
        toast.success(result.message);
        await loadRealData(); // Recharger les données
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleExportTransactions = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Type,Montant,Statut,Utilisateur,Email,Propriété,Date,Score Fraude\n"
      + filteredTransactions.map(t => 
          `${t.id},${t.type},${t.amount},${t.status},${t.user.name},${t.user.email},${t.property.title},${new Date(t.createdAt).toLocaleDateString()},${t.fraudScore}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Export des transactions lancé');
  };

  // ============================================================================
  // CHARGEMENT INITIAL
  // ============================================================================

  useEffect(() => {
    loadRealData();
  }, []);

  // ============================================================================
  // COMPOSANTS DE RENDU
  // ============================================================================

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Transactions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-3xl font-bold text-blue-600">
                {loading ? '...' : transactionStats.totalTransactions?.toLocaleString() || 0}
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* Completed Transactions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions Complétées</p>
              <p className="text-3xl font-bold text-green-600">
                {loading ? '...' : transactionStats.completedTransactions?.toLocaleString() || 0}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus Totaux</p>
              <p className="text-3xl font-bold text-purple-600">
                {loading ? '...' : `${(transactionStats.totalRevenue / 1000000)?.toFixed(1) || 0}M`}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      {/* Monthly Revenue */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus Mensuels</p>
              <p className="text-3xl font-bold text-orange-600">
                {loading ? '...' : `${(transactionStats.monthlyRevenue / 1000000)?.toFixed(1) || 0}M`}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFiltersAndActions = () => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Gestion des Transactions
            </CardTitle>
            <CardDescription>
              {filteredTransactions.length} transaction(s) trouvée(s) • Données réelles uniquement
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadRealData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button onClick={handleExportTransactions} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par ID, utilisateur, email ou propriété..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Filtre */}
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les transactions</SelectItem>
              <SelectItem value="completed">Complétées</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="failed">Échouées</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
              <SelectItem value="high-value">Haute valeur ({'>'}10M)</SelectItem>
              <SelectItem value="flagged">Signalées (IA)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800', label: 'Complétée', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente', icon: Clock },
      failed: { color: 'bg-red-100 text-red-800', label: 'Échouée', icon: XCircle },
      cancelled: { color: 'bg-gray-100 text-gray-800', label: 'Annulée', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getRiskBadge = (fraudScore) => {
    if (fraudScore >= 70) {
      return <Badge className="bg-red-100 text-red-800">Risque Élevé</Badge>;
    } else if (fraudScore >= 40) {
      return <Badge className="bg-yellow-100 text-yellow-800">Risque Moyen</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Risque Faible</Badge>;
  };

  const formatAmount = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M CFA`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(0)}k CFA`;
    }
    return `${amount.toLocaleString()} CFA`;
  };

  const renderTransactionsTable = () => (
    <Card>
      <CardHeader>
        <CardTitle>Liste des Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Chargement des transactions réelles...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <span>Erreur: {error}</span>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-gray-500">
            <CreditCard className="h-6 w-6 mr-2" />
            <span>Aucune transaction trouvée</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Transaction</th>
                  <th className="text-left py-3 px-4">Utilisateur</th>
                  <th className="text-left py-3 px-4">Propriété</th>
                  <th className="text-left py-3 px-4">Montant</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-left py-3 px-4">Risque IA</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">#{transaction.id}</p>
                        <p className="text-sm text-gray-600 capitalize">{transaction.type}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                            {transaction.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{transaction.user.name}</p>
                          <p className="text-xs text-gray-600">{transaction.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-sm">{transaction.property.title}</p>
                        <p className="text-xs text-gray-600">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          {transaction.property.location}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-green-600">
                        {formatAmount(transaction.amount)}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="py-4 px-4">
                      {getRiskBadge(transaction.fraudScore)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowViewModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {transaction.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUpdateTransactionStatus(transaction.id, 'completed')}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUpdateTransactionStatus(transaction.id, 'failed')}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderAIAnalysis = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Analyse IA des Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiAnalysis.map((analysis, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{analysis.title}</h4>
                <Shield className={`h-4 w-4 ${
                  analysis.risk === 'high' ? 'text-red-600' : 
                  analysis.risk === 'medium' ? 'text-yellow-600' : 'text-green-600'
                }`} />
              </div>
              <p className="text-2xl font-bold text-blue-600">{analysis.value}</p>
              <p className="text-sm text-gray-600">{analysis.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // ============================================================================
  // MODALES
  // ============================================================================

  const renderViewModal = () => (
    <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Détails Transaction</DialogTitle>
        </DialogHeader>
        {selectedTransaction && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Informations Transaction</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">ID Transaction</label>
                    <p className="font-mono">#{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type</label>
                    <p className="capitalize">{selectedTransaction.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Montant</label>
                    <p className="text-lg font-semibold text-green-600">
                      {formatAmount(selectedTransaction.amount)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Statut</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedTransaction.status)}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Utilisateur</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {selectedTransaction.user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedTransaction.user.name}</p>
                      <p className="text-sm text-gray-600">{selectedTransaction.user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Propriété</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Titre</label>
                  <p>{selectedTransaction.property.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Type</label>
                  <p className="capitalize">{selectedTransaction.property.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Localisation</label>
                  <p>{selectedTransaction.property.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Prix</label>
                  <p className="font-semibold">{formatAmount(selectedTransaction.property.price)}</p>
                </div>
              </div>
            </div>

            {/* Section IA */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Analyse IA</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Score de Fraude</label>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          selectedTransaction.fraudScore >= 70 ? 'bg-red-600' :
                          selectedTransaction.fraudScore >= 40 ? 'bg-yellow-600' : 'bg-green-600'
                        }`}
                        style={{ width: `${selectedTransaction.fraudScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{selectedTransaction.fraudScore}%</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Niveau de Risque</label>
                  <p className="capitalize font-medium">{selectedTransaction.riskLevel}</p>
                </div>
              </div>
            </div>

            {/* Section Blockchain (préparation) */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">État Blockchain</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Hash Blockchain</label>
                  <p className="text-sm font-mono">
                    {selectedTransaction.blockchainHash || 'Non enregistré'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Confirmé</label>
                  <p className="text-sm">
                    {selectedTransaction.blockchainConfirmed ? '✅ Oui' : '❌ Non'}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Date de création</label>
                  <p>{new Date(selectedTransaction.createdAt).toLocaleString('fr-FR')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  // ============================================================================
  // RENDU PRINCIPAL
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <ModernAdminSidebar stats={{
        newUsers: 0,
        pendingProperties: 0,
        pendingTransactions: transactionStats.pendingTransactions || 0
      }} />
      
      {/* Contenu principal */}
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Transactions</h1>
            <p className="text-gray-600">
              Administrez toutes les transactions avec des données réelles • IA • Blockchain
            </p>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Database className="h-3 w-3 mr-1" />
            Données Réelles
          </Badge>
        </div>

      {/* Stats Cards */}
      {renderStatsCards()}

      {/* AI Analysis */}
      {renderAIAnalysis()}

      {/* Filters and Actions */}
      {renderFiltersAndActions()}

        {/* Transactions Table */}
        {renderTransactionsTable()}

        {/* Modales */}
        {renderViewModal()}
      </div>
    </div>
  );
};

export default ModernTransactionsPage;
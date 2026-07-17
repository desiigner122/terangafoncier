import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Repeat, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Eye,
  MoreHorizontal,
  RefreshCw,
  Globe,
  Smartphone,
  Building2,
  User,
  Zap,
  Shield,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const BanqueTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Normalise une ligne financial_transactions vers la forme attendue par le rendu.
  // Colonnes réelles: type, transaction_type, amount, currency, status, category,
  // description, client_name, created_at. (Pas de fees/channel/location/reference/comptes.)
  const mapTransaction = (t) => ({
    id: t.id,
    type: t.type || 'transfer',
    amount: Number(t.amount) || 0,
    currency: t.currency || 'XOF',
    description: t.description || 'Transaction',
    clientName: t.client_name || '—',
    status: t.status || 'pending',
    category: t.category || '',
    date: t.created_at ? new Date(t.created_at) : null,
    // Champs sans colonne dédiée dans le schéma réel -> valeurs honnêtes
    channel: t.transaction_type || '—',
    reference: t.id,
    fees: null,
    location: null,
    fromAccount: null,
    toAccount: null,
    exchangeRate: null,
    propertyId: t.property_id || null
  });

  const fetchTransactions = async () => {
    if (!user?.id) {
      setTransactions([]);
      setFilteredTransactions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map(mapTransaction);
      setTransactions(mapped);
      setFilteredTransactions(mapped);
    } catch (e) {
      console.error('Erreur chargement transactions:', e);
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Filtrage des transactions
  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(tx =>
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(tx => tx.type === filterType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(tx => tx.status === filterStatus);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, filterType, filterStatus]);

  const getTransactionIcon = (type, category) => {
    if (category === 'diaspora') return Globe;
    if (category === 'blockchain') return Zap;
    if (category === 'mobile_payment') return Smartphone;
    if (category === 'business') return Building2;
    
    switch (type) {
      case 'credit': return ArrowDownLeft;
      case 'debit': return ArrowUpRight;
      case 'transfer': return Repeat;
      default: return CreditCard;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || colors.pending;
  };

  const getTypeColor = (type) => {
    const colors = {
      credit: 'text-green-600',
      debit: 'text-red-600',
      transfer: 'text-blue-600'
    };
    return colors[type] || 'text-gray-600';
  };

  const formatAmount = (amount, currency = 'XOF') => {
    if (amount === null || amount === undefined || isNaN(Number(amount))) return '—';
    return `${Number(amount).toLocaleString()} ${currency}`;
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const completedStatuses = ['completed', 'success', 'succeeded', 'paid'];
  const stats = {
    total: transactions.length,
    completed: transactions.filter(t => completedStatuses.includes(t.status)).length,
    pending: transactions.filter(t => t.status === 'pending').length,
    failed: transactions.filter(t => ['failed', 'error', 'cancelled'].includes(t.status)).length,
    totalVolume: transactions
      .filter(t => completedStatuses.includes(t.status))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
    creditVolume: transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <CreditCard className="h-8 w-8 mr-3 text-blue-600" />
            Transactions Bancaires
          </h2>
          <p className="text-gray-600 mt-1">
            Suivez et gérez toutes les transactions de vos clients
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={fetchTransactions} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Complétées</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Échouées</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Volume Total</p>
                <p className="text-lg font-bold text-purple-600">
                  {(stats.totalVolume / 1000000).toFixed(1)}M XOF
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Volume Crédits</p>
                <p className="text-lg font-bold text-orange-600">
                  {(stats.creditVolume / 1000000).toFixed(1)}M XOF
                </p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="credit">Crédits</SelectItem>
                  <SelectItem value="debit">Débits</SelectItem>
                  <SelectItem value="transfer">Virements</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Statut..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="completed">Complétées</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="failed">Échouées</SelectItem>
                  <SelectItem value="cancelled">Annulées</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une transaction..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des transactions */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => {
          const IconComponent = getTransactionIcon(transaction.type, transaction.category);
          
          return (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewTransaction(transaction)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'credit' ? 'bg-green-100' :
                        transaction.type === 'debit' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <IconComponent className={`h-5 w-5 ${
                          transaction.type === 'credit' ? 'text-green-600' :
                          transaction.type === 'debit' ? 'text-red-600' : 'text-blue-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {transaction.description}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className={`text-lg font-bold ${getTypeColor(transaction.type)}`}>
                              {transaction.type === 'debit' ? '-' : '+'}
                              {formatAmount(transaction.amount, transaction.currency)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <span>ID: {transaction.id}</span>
                            <span>Client: {transaction.clientName}</span>
                            <span>Canal: {transaction.channel}</span>
                            <span>{formatDate(transaction.date)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                              {transaction.status === 'completed' ? 'Complétée' :
                               transaction.status === 'pending' ? 'En attente' :
                               transaction.status === 'failed' ? 'Échouée' : 'Annulée'}
                            </Badge>
                            {transaction.fees > 0 && (
                              <span className="text-xs text-gray-500">
                                Frais: {formatAmount(transaction.fees)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="ghost" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        handleViewTransaction(transaction);
                      }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredTransactions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {loading ? 'Chargement des transactions...' : 'Aucune transaction trouvée'}
            </h3>
            <p className="text-gray-600">
              {loading
                ? 'Récupération des données en cours.'
                : searchTerm || filterType !== 'all' || filterStatus !== 'all'
                  ? 'Aucune transaction ne correspond à vos critères.'
                  : 'Aucune transaction disponible pour le moment.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal détails transaction */}
      {showTransactionModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Détails Transaction - {selectedTransaction.id}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTransactionModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Informations Générales</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">ID Transaction</label>
                      <p className="text-sm font-mono">{selectedTransaction.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Type</label>
                      <p className="text-sm capitalize">{selectedTransaction.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Montant</label>
                      <p className={`text-sm font-bold ${getTypeColor(selectedTransaction.type)}`}>
                        {selectedTransaction.type === 'debit' ? '-' : '+'}
                        {formatAmount(selectedTransaction.amount, selectedTransaction.currency)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Frais</label>
                      <p className="text-sm">{formatAmount(selectedTransaction.fees)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Statut</label>
                      <Badge className={`text-xs ${getStatusColor(selectedTransaction.status)}`}>
                        {selectedTransaction.status === 'completed' ? 'Complétée' :
                         selectedTransaction.status === 'pending' ? 'En attente' :
                         selectedTransaction.status === 'failed' ? 'Échouée' : 'Annulée'}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Détails Technique</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Client</label>
                      <p className="text-sm">{selectedTransaction.clientName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Référence</label>
                      <p className="text-sm font-mono">{selectedTransaction.reference}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Canal</label>
                      <p className="text-sm capitalize">{selectedTransaction.channel}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Localisation</label>
                      <p className="text-sm">{selectedTransaction.location || '—'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Date</label>
                      <p className="text-sm">{formatDate(selectedTransaction.date)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedTransaction.fromAccount && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Comptes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Compte expéditeur</label>
                      <p className="text-sm font-mono bg-gray-50 p-2 rounded">{selectedTransaction.fromAccount}</p>
                    </div>
                    {selectedTransaction.toAccount && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Compte destinataire</label>
                        <p className="text-sm font-mono bg-gray-50 p-2 rounded">{selectedTransaction.toAccount}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BanqueTransactions;
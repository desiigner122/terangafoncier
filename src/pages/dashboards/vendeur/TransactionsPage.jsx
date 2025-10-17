import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Download,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  Copy,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

/**
 * Page historique complet des transactions blockchain
 */
const TransactionsPage = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 20;

  // Charger les transactions depuis Supabase
  useEffect(() => {
    if (user) loadTransactions();
  }, [user]);

  // Filtrer les transactions
  useEffect(() => {
    let filtered = [...transactions];

    // Filtre par recherche
    if (searchQuery) {
      filtered = filtered.filter(tx =>
        tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.property.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tx => tx.status === statusFilter);
    }

    // Filtre par type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(tx => tx.type === typeFilter);
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter, transactions]);

  const loadTransactions = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blockchain_transactions')
        .select(`
          id,
          transaction_hash,
          transaction_type,
          status,
          block_number,
          gas_used,
          confirmations,
          value,
          created_at,
          terrain_id,
          terrain:terrains ( id, titre, localisation )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) {
        throw error;
      }

      const normalizedTransactions = (data || []).map((tx) => {
        const rawGas = tx.gas_used !== null && tx.gas_used !== undefined ? Number(tx.gas_used) : 0;
        const blockNumber = tx.block_number !== null && tx.block_number !== undefined ? Number(tx.block_number) : 0;
        const hash = tx.transaction_hash || 'hash-inconnu';
        const propertyLabel = tx.terrain?.titre
          || tx.transaction_data?.property_title
          || tx.property_title
          || 'Propriété';

        return {
          id: tx.id,
          hash,
          type: tx.transaction_type || 'verification',
          status: tx.status || 'pending',
          blockNumber,
          gasUsed: Number.isFinite(rawGas) ? rawGas : 0,
          confirmations: tx.confirmations ?? 0,
          value: tx.value ?? null,
          timestamp: tx.created_at || new Date().toISOString(),
          property: propertyLabel,
          propertyId: tx.terrain_id || tx.terrain?.id || null,
          location: tx.terrain?.localisation || null,
        };
      });

      setTransactions(normalizedTransactions);
    } catch (error) {
      console.error('Erreur chargement transactions blockchain:', error);
      setTransactions([]);
      toast.error("Impossible de charger les transactions blockchain.");
    } finally {
      setIsLoading(false);
    }
  };

  // Export CSV
  const exportToCSV = () => {
    const headers = ['Hash', 'Propriété', 'Type', 'Statut', 'Bloc', 'Gas', 'Confirmations', 'Date'];
    const rows = filteredTransactions.map(tx => [
      tx.hash,
      tx.property,
      tx.type,
      tx.status,
      tx.blockNumber,
      tx.gasUsed,
      tx.confirmations,
      format(new Date(tx.timestamp), 'dd/MM/yyyy HH:mm')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_blockchain_${Date.now()}.csv`;
    link.click();

    if (window.safeGlobalToast) {
      window.safeGlobalToast({
        title: "Export réussi",
        description: `${filteredTransactions.length} transactions exportées.`
      });
    }
  };

  // Copier hash
  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    if (window.safeGlobalToast) {
      window.safeGlobalToast({
        title: "Hash copié",
        description: "Le hash de transaction a été copié."
      });
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Types de transaction
  const transactionTypes = {
    verification: { label: 'Vérification', color: 'bg-blue-100 text-blue-800' },
    nft_mint: { label: 'Création NFT', color: 'bg-purple-100 text-purple-800' },
    ownership_transfer: { label: 'Transfert', color: 'bg-orange-100 text-orange-800' },
    smart_contract: { label: 'Smart Contract', color: 'bg-green-100 text-green-800' }
  };

  // Statuts
  const statusConfig = {
    confirmed: { label: 'Confirmé', icon: CheckCircle, color: 'text-green-600' },
    pending: { label: 'En cours', icon: Clock, color: 'text-yellow-600' },
    failed: { label: 'Échoué', icon: XCircle, color: 'text-red-600' }
  };

  // Statistiques
  const stats = {
    total: transactions.length,
    confirmed: transactions.filter(tx => tx.status === 'confirmed').length,
    pending: transactions.filter(tx => tx.status === 'pending').length,
    thisMonth: transactions.filter(tx => {
      const txDate = new Date(tx.timestamp);
      const now = new Date();
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Historique Blockchain
        </h1>
        <p className="text-gray-600 mt-2">
          Toutes vos transactions sur la blockchain TerangaChain
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Total</div>
                <div className="text-2xl font-bold">{stats.total}</div>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Confirmées</div>
                <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">En cours</div>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Ce mois</div>
                <div className="text-2xl font-bold text-purple-600">{stats.thisMonth}</div>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher hash ou propriété..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtre statut */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="confirmed">Confirmées</SelectItem>
                <SelectItem value="pending">En cours</SelectItem>
                <SelectItem value="failed">Échouées</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtre type */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="verification">Vérification</SelectItem>
                <SelectItem value="nft_mint">NFT</SelectItem>
                <SelectItem value="ownership_transfer">Transfert</SelectItem>
                <SelectItem value="smart_contract">Smart Contract</SelectItem>
              </SelectContent>
            </Select>

            {/* Export */}
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des transactions */}
      <Card>
        <CardHeader>
          <CardTitle>
            Transactions ({filteredTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Hash</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Propriété</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Type</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Statut</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Bloc</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Gas</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Confirmations</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Date</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((tx) => {
                  const StatusIcon = statusConfig[tx.status].icon;
                  return (
                    <tr key={tx.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyHash(tx.hash)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-3 text-sm">{tx.property}</td>
                      <td className="p-3">
                        <Badge className={transactionTypes[tx.type].color}>
                          {transactionTypes[tx.type].label}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <StatusIcon className={`w-4 h-4 ${statusConfig[tx.status].color}`} />
                          <span className="text-sm">{statusConfig[tx.status].label}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm">#{tx.blockNumber.toLocaleString()}</td>
                      <td className="p-3 text-sm">{tx.gasUsed} ETH</td>
                      <td className="p-3 text-sm">{tx.confirmations}</td>
                      <td className="p-3 text-sm">
                        {format(new Date(tx.timestamp), 'dd/MM/yyyy HH:mm')}
                      </td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`https://terangachain.com/tx/${tx.hash}`, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Page {currentPage} sur {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;

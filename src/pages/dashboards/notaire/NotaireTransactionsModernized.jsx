import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  DollarSign,
  Calendar,
  MapPin,
  User,
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
  Download,
  Upload,
  Stamp,
  Scale,
  PenTool,
  BookOpen,
  Globe,
  Lock,
  Unlock,
  RefreshCw,
  Copy,
  ExternalLink,
  Settings,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  Link2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import supabase from '@/lib/supabaseClient';
import CreateActDialog from '@/components/notaire/CreateActDialog';

const NotaireTransactionsModernized = () => {
  const { dashboardStats } = useOutletContext();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  // Statuts réels de la table notarial_acts
  const statusOptions = [
    { value: 'all', label: 'Tous les statuts', color: 'bg-gray-100 text-gray-800' },
    { value: 'draft', label: 'Brouillon', color: 'bg-gray-100 text-gray-800' },
    { value: 'in_progress', label: 'En cours', color: 'bg-blue-100 text-blue-800' },
    { value: 'signed', label: 'Signé', color: 'bg-purple-100 text-purple-800' },
    { value: 'completed', label: 'Terminé', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Annulé', color: 'bg-red-100 text-red-800' }
  ];

  // Types d'actes notariés
  const actTypes = [
    'vente_immobiliere',
    'succession',
    'donation',
    'acte_propriete',
    'hypotheque',
    'servitude',
    'partage',
    'constitution_societe'
  ];

  // Chargement des données depuis Supabase (table réelle notarial_acts)
  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notarial_acts')
        .select(`
          id,
          notaire_id,
          client_id,
          property_id,
          act_type,
          reference,
          client_name,
          status,
          notary_fees,
          amount,
          client_satisfaction,
          signed_at,
          created_at,
          updated_at,
          property:properties(id, title, name, type, surface, location, region, city, price)
        `)
        .eq('notaire_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTransactions(data || []);
      setFilteredTransactions(data || []);
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
      window.safeGlobalToast?.({
        title: "Erreur de chargement",
        description: "Impossible de charger les transactions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrage des transactions (colonnes réelles)
  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.client_name?.toLowerCase().includes(term) ||
        transaction.reference?.toLowerCase().includes(term) ||
        transaction.property?.location?.toLowerCase().includes(term) ||
        transaction.property?.title?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, transactions]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + transactionsPerPage);

  const handleCreateTransaction = async () => {
    setShowCreateDialog(true);
  };

  const handleActCreated = (newAct) => {
    // Recharger les données réelles depuis Supabase
    loadTransactions();
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption || statusOptions[0];
  };

  const formatCurrency = (amount) => {
    if (!amount) return '—';
    return `${(amount / 1000000).toFixed(1)}M FCFA`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Étapes du processus dérivées du statut réel (aucune date fabriquée)
  const getProcessSteps = (transaction) => {
    const status = transaction?.status;
    return [
      { step: 'Dossier constitué', completed: true },
      { step: 'En cours de traitement', completed: ['in_progress', 'signed', 'completed'].includes(status) },
      { step: 'Signature des parties', completed: ['signed', 'completed'].includes(status) || !!transaction?.signed_at },
      { step: 'Authentification / clôture', completed: status === 'completed' }
    ];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Transactions Notariales</h2>
          <p className="text-gray-600">Gestion des actes et transactions en cours</p>
        </div>
        <Button onClick={handleCreateTransaction} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Acte
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Actes</p>
                <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Cours</p>
                <p className="text-2xl font-bold text-gray-900">
                  {transactions.filter(t => ['draft', 'in_progress', 'signed'].includes(t.status)).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Terminés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {transactions.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valeur Totale</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0))}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par client, référence ou propriété..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Actes Notariés ({filteredTransactions.length})</CardTitle>
          <CardDescription>
            Liste de tous vos actes notariaux avec leur statut actuel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune transaction trouvée</h3>
              <p className="text-gray-600 mb-4">
                {transactions.length === 0
                  ? "Vous n'avez pas encore d'actes notariaux enregistrés."
                  : "Aucune transaction ne correspond à vos critères de recherche."
                }
              </p>
              <Button onClick={handleCreateTransaction} className="bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4 mr-2" />
                Créer le premier acte
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Référence</TableHead>
                      <TableHead>Client / Propriété</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Valeur</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((transaction) => {
                      const statusBadge = getStatusBadge(transaction.status);
                      const propertyLocation = transaction.property?.location || transaction.property?.city;
                      return (
                        <TableRow key={transaction.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            {transaction.reference || `ACT-${transaction.id?.substring(0, 8)}`}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{transaction.client_name || '—'}</p>
                              {(transaction.property?.title || propertyLocation) && (
                                <p className="text-sm text-gray-600 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {transaction.property?.title || propertyLocation}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {transaction.act_type?.replace(/_/g, ' ') || '—'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusBadge.color}>
                              {statusBadge.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-semibold">{formatCurrency(transaction.amount)}</div>
                              {transaction.notary_fees && (
                                <div className="text-xs text-gray-600">
                                  Frais: {formatCurrency(transaction.notary_fees)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{formatDate(transaction.created_at)}</div>
                              {transaction.signed_at && (
                                <div className="text-xs text-gray-600 flex items-center mt-1">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Signé: {formatDate(transaction.signed_at)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewTransaction(transaction)}
                                title="Voir détails"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-600">
                    Affichage de {startIndex + 1} à {Math.min(startIndex + transactionsPerPage, filteredTransactions.length)} sur {filteredTransactions.length} transactions
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} sur {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog de détails de transaction */}
      {selectedTransaction && (
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="flex items-center space-x-2">
                    <span>Acte {selectedTransaction.reference || `ACT-${selectedTransaction.id?.substring(0, 8)}`}</span>
                  </DialogTitle>
                  <DialogDescription>
                    {selectedTransaction.client_name || 'Client non renseigné'} • Créé le {formatDate(selectedTransaction.created_at)}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne gauche - Informations principales */}
              <div className="lg:col-span-2 space-y-6">
                {/* Étapes du processus (dérivées du statut réel) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">État d'avancement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {getProcessSteps(selectedTransaction).map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className={`text-sm ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                            {item.step}
                          </span>
                          {item.completed && (
                            <CheckCircle className="h-3 w-3 text-green-500 ml-auto" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Informations détaillées */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations de l'acte</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Type d'acte</Label>
                        <p className="mt-1 font-medium">{selectedTransaction.act_type?.replace(/_/g, ' ') || '—'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Statut actuel</Label>
                        <div className="mt-1">
                          <Badge className={getStatusBadge(selectedTransaction.status).color}>
                            {getStatusBadge(selectedTransaction.status).label}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Date de signature</Label>
                        <p className="mt-1 flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(selectedTransaction.signed_at)}</span>
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Satisfaction client</Label>
                        <p className="mt-1">
                          {selectedTransaction.client_satisfaction != null
                            ? `${selectedTransaction.client_satisfaction}%`
                            : '—'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Client */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Client</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedTransaction.client_name ? (
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <User className="h-8 w-8 p-2 bg-white rounded-full" />
                          <div>
                            <p className="font-medium">{selectedTransaction.client_name}</p>
                            <p className="text-sm text-gray-600">Client de l'acte</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Aucun client renseigné.</p>
                    )}
                    <p className="text-xs text-gray-400 mt-3">
                      Le détail des parties (vendeur, acquéreur, banque) sera disponible prochainement.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Colonne droite - Données financières et propriété */}
              <div className="space-y-6">
                {/* Informations financières (colonnes réelles) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Données financières</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Montant de la transaction</Label>
                      <p className="mt-1 text-xl font-bold text-green-600">{formatCurrency(selectedTransaction.amount)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Frais notariaux</Label>
                      <p className="mt-1 font-medium">{formatCurrency(selectedTransaction.notary_fees)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Propriété liée (jointure properties) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Propriété</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedTransaction.property ? (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Désignation</Label>
                          <p className="mt-1">{selectedTransaction.property.title || selectedTransaction.property.name || '—'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Localisation</Label>
                          <p className="mt-1 flex items-start space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                            <span>
                              {[selectedTransaction.property.location, selectedTransaction.property.city, selectedTransaction.property.region]
                                .filter(Boolean).join(', ') || '—'}
                            </span>
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Surface</Label>
                          <p className="mt-1">{selectedTransaction.property.surface ? `${selectedTransaction.property.surface} m²` : '—'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Type</Label>
                          <p className="mt-1">{selectedTransaction.property.type || '—'}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Aucune propriété liée à cet acte.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      La gestion documentaire de l'acte sera disponible prochainement.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de création d'acte */}
      <CreateActDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onActCreated={handleActCreated}
        notaireId={user?.id}
      />
    </div>
  );
};

export default NotaireTransactionsModernized;

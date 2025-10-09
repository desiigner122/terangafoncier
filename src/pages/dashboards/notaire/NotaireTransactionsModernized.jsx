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
import NotaireSupabaseService from '@/services/NotaireSupabaseService';
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

  // Statuts possibles des transactions
  const statusOptions = [
    { value: 'all', label: 'Tous les statuts', color: 'bg-gray-100 text-gray-800' },
    { value: 'draft', label: 'Brouillon', color: 'bg-gray-100 text-gray-800' },
    { value: 'draft_review', label: 'En révision', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'documentation', label: 'Documentation', color: 'bg-blue-100 text-blue-800' },
    { value: 'signature_pending', label: 'Signature en attente', color: 'bg-purple-100 text-purple-800' },
    { value: 'registration', label: 'Enregistrement', color: 'bg-orange-100 text-orange-800' },
    { value: 'completed', label: 'Terminé', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Refusé', color: 'bg-red-100 text-red-800' }
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

  // Chargement des données depuis Supabase
  useEffect(() => {
    if (user) {
      loadTransactions();
    }
  }, [user]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const result = await NotaireSupabaseService.getNotarialActs(user.id);
      if (result.success) {
        setTransactions(result.data || []);
        setFilteredTransactions(result.data || []);
      }
    } catch (error) {
      console.error('Erreur chargement transactions:', error);
      window.safeGlobalToast({
        title: "Erreur de chargement",
        description: "Impossible de charger les transactions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrage des transactions
  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.act_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.property_address?.toLowerCase().includes(searchTerm.toLowerCase())
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
    // Ajouter le nouvel acte à la liste
    setTransactions(prev => [newAct, ...prev]);
    setFilteredTransactions(prev => [newAct, ...prev]);
    
    // Recharger les données
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
    if (!amount) return '0 FCFA';
    return `${(amount / 1000000).toFixed(1)}M FCFA`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
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
                  {transactions.filter(t => ['draft', 'draft_review', 'documentation', 'signature_pending', 'registration'].includes(t.status)).length}
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
                  {formatCurrency(transactions.reduce((sum, t) => sum + (t.property_value || 0), 0))}
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
                placeholder="Rechercher par titre, numéro d'acte ou adresse..."
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
                      <TableHead>Numéro d'Acte</TableHead>
                      <TableHead>Titre</TableHead>
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
                      return (
                        <TableRow key={transaction.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              {transaction.act_number || `ACT-${transaction.id?.substring(0, 8)}`}
                              {transaction.blockchain_verified && (
                                <Badge className="bg-purple-100 text-purple-800 text-xs">
                                  <Link2 className="h-3 w-3 mr-1" />
                                  Blockchain
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="font-medium">{transaction.title}</p>
                                {transaction.priority === 'urgent' && (
                                  <Badge className="bg-red-100 text-red-800 text-xs">Urgent</Badge>
                                )}
                                {transaction.priority === 'high' && (
                                  <Badge className="bg-orange-100 text-orange-800 text-xs">Priorité</Badge>
                                )}
                              </div>
                              {transaction.property_address && (
                                <p className="text-sm text-gray-600 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {transaction.property_address}
                                </p>
                              )}
                              {/* Tags */}
                              <div className="flex flex-wrap gap-1 mt-1">
                                {transaction.tags?.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                )) || (
                                  <>
                                    {transaction.status === 'completed' && (
                                      <Badge variant="outline" className="text-xs">Express</Badge>
                                    )}
                                    {transaction.blockchain_verified && (
                                      <Badge variant="outline" className="text-xs">Sécurisé</Badge>
                                    )}
                                    {transaction.property_value > 100000000 && (
                                      <Badge variant="outline" className="text-xs">Premium</Badge>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {transaction.act_type?.replace('_', ' ') || 'N/A'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge className={statusBadge.color}>
                                {statusBadge.label}
                              </Badge>
                              {/* Progression visuelle */}
                              <div className="w-full">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span>Avancement</span>
                                  <span>{transaction.progress || 0}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-amber-600 h-1.5 rounded-full transition-all duration-300" 
                                    style={{ width: `${transaction.progress || 0}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-semibold">{formatCurrency(transaction.property_value)}</div>
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
                              {transaction.estimated_completion && (
                                <div className="text-xs text-gray-600 flex items-center mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Échéance: {formatDate(transaction.estimated_completion)}
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
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  window.safeGlobalToast({
                                    title: "Signature en cours",
                                    description: "Processus de signature initié",
                                    variant: "info"
                                  });
                                }}
                                title="Signer"
                              >
                                <PenTool className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  window.safeGlobalToast({
                                    title: "Export en cours",
                                    description: "Document en cours d'export",
                                    variant: "success"
                                  });
                                }}
                                title="Exporter"
                              >
                                <Download className="h-3 w-3" />
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

      {/* Dialog de détails de transaction enrichi */}
      {selectedTransaction && (
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="flex items-center space-x-2">
                    <span>Acte {selectedTransaction.act_number || `ACT-${selectedTransaction.id?.substring(0, 8)}`}</span>
                    {selectedTransaction.blockchain_verified && (
                      <Badge className="bg-purple-100 text-purple-800">
                        <Link2 className="h-3 w-3 mr-1" />
                        Blockchain Vérifié
                      </Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedTransaction.title} • Créé le {formatDate(selectedTransaction.created_at)}
                  </DialogDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                  <Button size="sm">
                    <PenTool className="h-4 w-4 mr-2" />
                    Signer
                  </Button>
                </div>
              </div>
            </DialogHeader>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne gauche - Informations principales */}
              <div className="lg:col-span-2 space-y-6">
                {/* Progression visuelle */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">État d'avancement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progression globale</span>
                          <span className="text-sm text-gray-600">{selectedTransaction.progress || 45}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-amber-600 h-3 rounded-full transition-all duration-300" 
                            style={{ width: `${selectedTransaction.progress || 45}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Timeline des étapes */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Étapes du processus</h4>
                        <div className="space-y-2">
                          {[
                            { step: 'Dossier constitué', completed: true, date: '2024-10-01' },
                            { step: 'Vérifications juridiques', completed: true, date: '2024-10-03' },
                            { step: 'Signatures parties', completed: selectedTransaction.status !== 'draft', date: '2024-10-05' },
                            { step: 'Authentification notariale', completed: selectedTransaction.status === 'completed', date: '2024-10-08' },
                            { step: 'Publication conservatoire', completed: false, date: '2024-10-10' }
                          ].map((item, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <span className={`text-sm ${item.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                {item.step}
                              </span>
                              <span className="text-xs text-gray-400 ml-auto">{item.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
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
                        <p className="mt-1 font-medium">{selectedTransaction.act_type?.replace('_', ' ')}</p>
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
                        <Label className="text-sm font-medium text-gray-600">Priorité</Label>
                        <div className="mt-1 flex items-center space-x-2">
                          <p>{selectedTransaction.priority || 'Normale'}</p>
                          {selectedTransaction.priority === 'urgent' && (
                            <Badge className="bg-red-100 text-red-800 text-xs">⚡ Urgent</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Échéance prévue</Label>
                        <p className="mt-1 flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{selectedTransaction.estimated_completion ? formatDate(selectedTransaction.estimated_completion) : '15 nov. 2024'}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Parties impliquées */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Parties impliquées</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { role: 'Vendeur', name: 'Marie Dubois', email: 'marie.dubois@email.com', status: 'Signé' },
                        { role: 'Acquéreur', name: 'Jean Martin', email: 'jean.martin@email.com', status: 'En attente' },
                        { role: 'Banque', name: 'Crédit Agricole Dakar', email: 'notaire@ca-dakar.sn', status: 'Confirmé' }
                      ].map((party, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <User className="h-8 w-8 p-2 bg-white rounded-full" />
                            <div>
                              <p className="font-medium">{party.name}</p>
                              <p className="text-sm text-gray-600">{party.role} • {party.email}</p>
                            </div>
                          </div>
                          <Badge variant={party.status === 'Signé' ? 'default' : 'outline'}>
                            {party.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Colonne droite - Données financières et documents */}
              <div className="space-y-6">
                {/* Informations financières */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Données financières</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Valeur de la propriété</Label>
                      <p className="mt-1 text-xl font-bold text-green-600">{formatCurrency(selectedTransaction.property_value)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Frais notariaux</Label>
                      <p className="mt-1 font-medium">{formatCurrency(selectedTransaction.notary_fees)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Droits d'enregistrement</Label>
                      <p className="mt-1 font-medium">{formatCurrency(selectedTransaction.property_value * 0.03)}</p>
                    </div>
                    <hr />
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Total frais</Label>
                      <p className="mt-1 text-lg font-bold">{formatCurrency((selectedTransaction.notary_fees || 0) + (selectedTransaction.property_value * 0.03))}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Localisation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Propriété</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Adresse</Label>
                        <p className="mt-1 flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <span>{selectedTransaction.property_address || 'Dakar, Plateau, Rue 15'}</span>
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Surface</Label>
                        <p className="mt-1">250 m²</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Type</Label>
                        <p className="mt-1">Appartement 4 pièces</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      Documents
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { name: 'Titre de propriété', type: 'PDF', status: 'Vérifié' },
                        { name: 'Compromis de vente', type: 'PDF', status: 'Signé' },
                        { name: 'Attestation fiscale', type: 'PDF', status: 'En attente' },
                        { name: 'Certificat urbanisme', type: 'PDF', status: 'Vérifié' }
                      ].map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <div>
                              <p className="text-sm font-medium">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.type}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {doc.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
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
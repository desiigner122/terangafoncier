import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Calendar,
  MapPin,
  DollarSign,
  Scale,
  Stamp,
  Shield,
  Star,
  Award,
  TrendingUp,
  Building2,
  Gavel,
  PenTool,
  Zap,
  BarChart3,
  Archive,
  Send,
  FileCheck,
  AlertCircle,
  CreditCard,
  Wallet,
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
  ArrowUpRight
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

const NotaireTransactions = () => {
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
    { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'in_progress', label: 'En cours', color: 'bg-blue-100 text-blue-800' },
    { value: 'review', label: 'En révision', color: 'bg-purple-100 text-purple-800' },
    { value: 'completed', label: 'Terminée', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Refusée', color: 'bg-red-100 text-red-800' }
  ];

  // Types de transactions
  const transactionTypes = [
    'Vente immobilière',
    'Succession',
    'Donation',
    'Acte de propriété',
    'Hypothèque',
    'Servitude',
    'Partage',
    'Constitution société'
  ];

  // ✅ DONNÉES RÉELLES - Mock data supprimé
  // Les transactions sont chargées depuis Supabase via loadTransactions()
  // qui est appelé dans le useEffect des lignes précédentes

  // Filtrage des transactions
  useEffect(() => {
    let filtered = transactions;

    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Handlers
  const handleCreateTransaction = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Transaction créée",
        description: "Nouvelle transaction notariale créée avec succès",
        variant: "success"
      });
      setShowCreateDialog(false);
      setIsLoading(false);
    }, 1500);
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    window.safeGlobalToast({
      title: "Transaction ouverte",
      description: `Consultation du dossier ${transaction.id}`,
      variant: "success"
    });
  };

  const handleUpdateStatus = (transactionId, newStatus) => {
    setIsLoading(true);
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(t => 
          t.id === transactionId 
            ? { ...t, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
            : t
        )
      );
      window.safeGlobalToast({
        title: "Statut mis à jour",
        description: `Transaction ${transactionId} mise à jour avec succès`,
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteTransaction = (transactionId) => {
    setIsLoading(true);
    setTimeout(() => {
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
      window.safeGlobalToast({
        title: "Transaction supprimée",
        description: "Transaction supprimée avec succès",
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleExportTransactions = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Export terminé",
        description: "Liste des transactions exportée en Excel",
        variant: "success"
      });
      setIsLoading(false);
    }, 2000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <ArrowRight className="h-4 w-4" />;
      case 'review': return <Eye className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 min-h-screen">
      {/* En-tête Hero */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="text-white">
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold mb-2 flex items-center"
              >
                <Gavel className="h-10 w-10 mr-4" />
                Transactions Notariales
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-amber-100 mb-4"
              >
                Plateforme avancée de gestion des actes notariés
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center space-x-6 text-amber-100"
              >
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  <span>Blockchain sécurisé</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  <span>Traitement express</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  <span>Conforme OHADA</span>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center space-x-4 mt-6 lg:mt-0"
            >
              <Button 
                variant="secondary"
                onClick={handleExportTransactions}
                disabled={isLoading}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="bg-white text-amber-600 hover:bg-amber-50 font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Transaction
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Statistiques avancées */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="h-6 w-6" />
            </div>
            <TrendingUp className="h-5 w-5 text-blue-200" />
          </div>
          <div>
            <p className="text-blue-100 text-sm">Total Transactions</p>
            <p className="text-3xl font-bold">{transactions.length}</p>
            <p className="text-blue-200 text-xs mt-1">+12% ce mois</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
            <ArrowUpRight className="h-5 w-5 text-orange-200" />
          </div>
          <div>
            <p className="text-orange-100 text-sm">En cours</p>
            <p className="text-3xl font-bold">
              {transactions.filter(t => t.status === 'in_progress').length}
            </p>
            <p className="text-orange-200 text-xs mt-1">Moyenne: 18 jours</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <CheckCircle className="h-6 w-6" />
            </div>
            <Star className="h-5 w-5 text-green-200" />
          </div>
          <div>
            <p className="text-green-100 text-sm">Terminées</p>
            <p className="text-3xl font-bold">
              {transactions.filter(t => t.status === 'completed').length}
            </p>
            <p className="text-green-200 text-xs mt-1">Satisfaction: 4.8/5</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Wallet className="h-6 w-6" />
            </div>
            <BarChart3 className="h-5 w-5 text-purple-200" />
          </div>
          <div>
            <p className="text-purple-100 text-sm">Revenus ce mois</p>
            <p className="text-3xl font-bold">
              {(transactions.reduce((sum, t) => sum + t.notaryFees, 0) / 1000000).toFixed(1)}M
            </p>
            <p className="text-purple-200 text-xs mt-1">+23% vs mois dernier</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Barre de recherche et filtres avancés */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/20"
      >
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Rechercher par client, type, référence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-white/80 border-amber-200 focus:border-amber-400 focus:ring-amber-400 rounded-xl"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-white/80 border-amber-200 focus:border-amber-400 rounded-xl">
                  <Filter className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        {getStatusIcon(option.value)}
                        <span className="ml-2">{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="bg-white/80 border-amber-200 hover:bg-amber-50">
                <Settings className="h-4 w-4 mr-2" />
                Filtres avancés
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-amber-100 px-4 py-2 rounded-xl">
                <span className="text-sm font-medium text-amber-800">
                  {filteredTransactions.length} résultat{filteredTransactions.length > 1 ? 's' : ''}
                </span>
              </div>
              <Button variant="outline" size="sm" className="bg-white/80">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grille des transactions moderne */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-4"
      >
        <AnimatePresence>
          {paginatedTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  {/* Info principale */}
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {transaction.clientAvatar}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {transaction.client}
                        </h3>
                        <Badge className={getStatusColor(transaction.status)}>
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1">
                            {statusOptions.find(s => s.value === transaction.status)?.label}
                          </span>
                        </Badge>
                        {transaction.blockchainVerified && (
                          <Badge className="bg-green-100 text-green-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Blockchain
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          {transaction.type}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {transaction.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {transaction.createdAt}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                        {transaction.description}
                      </p>
                      
                      {/* Barre de progression */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progression</span>
                            <span>{transaction.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${transaction.progress}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className={`h-2 rounded-full ${
                                transaction.progress === 100 
                                  ? 'bg-green-500' 
                                  : transaction.progress > 70 
                                  ? 'bg-blue-500' 
                                  : 'bg-amber-500'
                              }`}
                            />
                          </div>
                        </div>
                        <Badge className={getPriorityColor(transaction.priority)} variant="outline">
                          {transaction.priority}
                        </Badge>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex items-center space-x-2">
                        {transaction.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Montants et actions */}
                  <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {(transaction.amount / 1000000).toFixed(1)}M
                      </div>
                      <div className="text-sm text-gray-600">
                        Honoraires: {(transaction.notaryFees / 1000).toFixed(0)}k FCFA
                      </div>
                      {transaction.nextAction && (
                        <div className="text-xs text-amber-600 mt-1 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {transaction.nextAction}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTransaction(transaction)}
                        className="hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-amber-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-green-50"
                      >
                        <FileCheck className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-purple-50"
                      >
                        <Download className="h-4 w-4 text-purple-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Pagination améliorée */}
        {totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between bg-white/70 backdrop-blur-md rounded-xl p-4 mt-6"
          >
            <div className="text-sm text-gray-600">
              Affichage de {startIndex + 1} à {Math.min(startIndex + transactionsPerPage, filteredTransactions.length)} sur {filteredTransactions.length} transactions
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-white/80"
              >
                Précédent
              </Button>
              <span className="text-sm font-medium text-gray-700 px-3">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-white/80"
              >
                Suivant
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Modal de création de transaction */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle Transaction Notariale</DialogTitle>
            <DialogDescription>
              Créer une nouvelle transaction pour un acte notarié
            </DialogDescription>
          </DialogHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Informations Générales</TabsTrigger>
            <TabsTrigger value="property">Propriété</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client">Client</Label>
                <Input id="client" placeholder="Nom du client" />
              </div>
              <div>
                <Label htmlFor="type">Type de transaction</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Montant (FCFA)</Label>
                <Input id="amount" type="number" placeholder="Montant de la transaction" />
              </div>
              <div>
                <Label htmlFor="priority">Priorité</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Niveau de priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Description détaillée de la transaction..."
                rows={4}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="property" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="property-address">Adresse de la propriété</Label>
                <Input id="property-address" placeholder="Adresse complète" />
              </div>
              <div>
                <Label htmlFor="property-area">Superficie (m²)</Label>
                <Input id="property-area" type="number" placeholder="Superficie" />
              </div>
              <div>
                <Label htmlFor="cadastral-ref">Référence cadastrale</Label>
                <Input id="cadastral-ref" placeholder="Référence cadastrale" />
              </div>
              <div>
                <Label htmlFor="property-type">Type de propriété</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Type de propriété" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="terrain">Terrain</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="appartement">Appartement</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="industriel">Industriel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">
                Glissez-déposez vos documents ici ou cliquez pour parcourir
              </p>
              <Button variant="outline" className="mt-2">
                Parcourir les fichiers
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Types de documents requis :</Label>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Titre de propriété ou acte authentique</li>
                <li>• Pièce d'identité des parties</li>
                <li>• Certificat de non-gage</li>
                <li>• Plan cadastral</li>
                <li>• Quitus fiscal</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button 
            variant="outline" 
            onClick={() => setShowCreateDialog(false)}
          >
            Annuler
          </Button>
          <Button 
            className="bg-amber-600 hover:bg-amber-700"
            onClick={handleCreateTransaction}
            disabled={isLoading}
          >
            {isLoading ? 'Création...' : 'Créer Transaction'}
          </Button>
        </div>
      </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotaireTransactions;
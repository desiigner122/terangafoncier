import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, Plus, Search, Filter, Eye, Edit2, Trash2, 
  FileText, Calendar, Clock, User, Users, MapPin, 
  TrendingUp, AlertCircle, CheckCircle, XCircle, 
  ArrowRight, Download, Upload, Phone, Mail, Home,
  DollarSign, Percent, Shield, Link2, BookOpen, FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext.jsx';
import { NotaireSupabaseService } from '@/services/NotaireSupabaseService';

/**
 * NotaireCasesModernized.jsx
 * Gestion complète des dossiers notariaux avec données Supabase réelles
 * Remplace toutes les données mockées par des interactions database
 */

export default function NotaireCasesModernized() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // États principaux
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // États de filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  // États de dialogs
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // États de pagination
  const [currentPage, setCurrentPage] = useState(1);
  const casesPerPage = 10;

  // États du formulaire de création
  const [newCase, setNewCase] = useState({
    title: '',
    case_type: 'vente_terrain',
    buyer_name: '',
    seller_name: '',
    property_address: '',
    property_value: '',
    priority: 'medium',
    due_date: '',
    description: ''
  });

  /**
   * 🔄 CHARGEMENT DES DONNÉES SUPABASE
   */
  useEffect(() => {
    if (user?.id) {
      loadCases();
    }
  }, [user]);

  const loadCases = async () => {
    setIsLoading(true);
    try {
      console.log('📋 Loading cases for notaire:', user.id);
      
      // Use getAssignedCases which queries purchase_cases via purchase_case_participants
      const result = await NotaireSupabaseService.getAssignedCases(user.id);
      
      console.log('📊 Result:', result);
      console.log('📊 First case data:', result.data?.[0]);
      
      if (result.success) {
        // Transform purchase_cases data to match expected case format
        const transformedCases = result.data.map(purchaseCase => {
          console.log('💰 Price fields:', {
            final_price: purchaseCase.final_price,
            proposed_price: purchaseCase.proposed_price,
            notaire_fees: purchaseCase.notaire_fees,
            purchase_price: purchaseCase.purchase_price,
            amount: purchaseCase.amount
          });
          
          return {
            id: purchaseCase.id,
            case_number: purchaseCase.case_number,
            title: `Vente ${purchaseCase.parcelle?.title || 'Terrain'} - ${purchaseCase.parcelle?.location || 'Location'}`,
            case_type: 'vente_terrain',
            status: purchaseCase.status || 'open',
            priority: purchaseCase.priority || 'medium',
            progress: calculateProgress(purchaseCase.status),
            opened_date: purchaseCase.created_at,
            due_date: purchaseCase.estimated_completion_date,
            last_activity: purchaseCase.updated_at || purchaseCase.created_at,
            buyer_name: purchaseCase.buyer?.full_name || 'Acheteur',
            seller_name: purchaseCase.seller?.full_name || 'Vendeur',
            property_address: purchaseCase.parcelle?.location || 'N/A',
            property_value: purchaseCase.final_price || purchaseCase.proposed_price || purchaseCase.purchase_price || purchaseCase.amount || 0,
            notary_fees: purchaseCase.notaire_fees || purchaseCase.notary_fees || 0,
            next_action: getNextAction(purchaseCase.status),
            documents_count: 0,
            completed_documents: 0,
            // Keep original data for details
            _original: purchaseCase
          };
        });
        
        console.log('✅ Transformed cases:', transformedCases.length);
        setCases(transformedCases);
        setFilteredCases(transformedCases);
      } else {
        console.error('❌ Error loading cases:', result.error);
        window.safeGlobalToast?.({
          title: "Erreur de chargement",
          description: result.error || "Impossible de charger les dossiers",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('❌ Exception loading cases:', error);
      window.safeGlobalToast?.({
        title: "Erreur système",
        description: "Une erreur est survenue lors du chargement",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper: Calculate progress percentage based on status
  const calculateProgress = (status) => {
    const progressMap = {
      'initiated': 10,
      'buyer_verification': 20,
      'seller_notification': 30,
      'document_collection': 40,
      'title_verification': 50,
      'contract_preparation': 60,
      'deposit_pending': 70,
      'contract_validation': 75,
      'appointment_scheduling': 80,
      'final_payment': 85,
      'signature': 90,
      'registration': 95,
      'completed': 100
    };
    return progressMap[status] || 0;
  };

  // Helper: Get next action based on status
  const getNextAction = (status) => {
    const actionsMap = {
      'initiated': 'Vérifier nouveau dossier',
      'buyer_verification': 'Vérifier identité acheteur',
      'seller_notification': 'Attendre confirmation vendeur',
      'document_collection': 'Collecter documents',
      'title_verification': 'Vérifier titre au cadastre',
      'contract_preparation': 'Préparer acte de vente',
      'deposit_pending': 'Attendre paiement acompte',
      'contract_validation': 'Valider contrat',
      'appointment_scheduling': 'Planifier RDV signature',
      'final_payment': 'Attendre paiement solde',
      'signature': 'Procéder à la signature',
      'registration': 'Enregistrer aux impôts',
      'completed': 'Dossier clôturé'
    };
    return actionsMap[status] || 'En attente';
  };

  /**
   * 🔍 FILTRAGE ET TRI
   */
  useEffect(() => {
    let filtered = [...cases];

    // Recherche textuelle
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.title?.toLowerCase().includes(search) ||
        c.case_number?.toLowerCase().includes(search) ||
        c.buyer_name?.toLowerCase().includes(search) ||
        c.seller_name?.toLowerCase().includes(search) ||
        c.property_address?.toLowerCase().includes(search)
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Filtre par priorité
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(c => c.priority === priorityFilter);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.opened_date) - new Date(a.opened_date);
        case 'date_asc':
          return new Date(a.opened_date) - new Date(b.opened_date);
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'progress':
          return (b.progress || 0) - (a.progress || 0);
        default:
          return 0;
      }
    });

    setFilteredCases(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, priorityFilter, sortBy, cases]);

  /**
   * 📄 PAGINATION
   */
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);
  const startIndex = (currentPage - 1) * casesPerPage;
  const paginatedCases = filteredCases.slice(startIndex, startIndex + casesPerPage);

  /**
   * ➕ CRÉATION D'UN NOUVEAU DOSSIER
   */
  const handleCreateCase = async () => {
    if (!newCase.title || !newCase.buyer_name || !newCase.seller_name) {
      window.safeGlobalToast?.({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await NotaireSupabaseService.createCase(user.id, newCase);
      if (result.success) {
        window.safeGlobalToast?.({
          title: "Dossier créé",
          description: `Dossier ${result.data.case_number} créé avec succès`,
          variant: "success"
        });
        setShowCreateDialog(false);
        setNewCase({
          title: '',
          case_type: 'vente_terrain',
          buyer_name: '',
          seller_name: '',
          property_address: '',
          property_value: '',
          priority: 'medium',
          due_date: '',
          description: ''
        });
        loadCases(); // Recharger la liste
      } else {
        window.safeGlobalToast?.({
          title: "Erreur de création",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur création dossier:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 🗑️ SUPPRESSION D'UN DOSSIER
   */
  const handleDeleteCase = async () => {
    if (!selectedCase) return;

    setIsLoading(true);
    try {
      const result = await NotaireSupabaseService.deleteCase(selectedCase.id);
      if (result.success) {
        window.safeGlobalToast?.({
          title: "Dossier supprimé",
          description: "Le dossier a été archivé avec succès",
          variant: "success"
        });
        setShowDeleteDialog(false);
        setSelectedCase(null);
        loadCases();
      } else {
        window.safeGlobalToast?.({
          title: "Erreur de suppression",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur suppression dossier:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * ✏️ MISE À JOUR DU STATUT
   */
  const handleUpdateStatus = async (caseId, newStatus) => {
    setIsLoading(true);
    try {
      const result = await NotaireSupabaseService.updateCaseStatus(caseId, newStatus);
      if (result.success) {
        window.safeGlobalToast?.({
          title: "Statut mis à jour",
          description: "Le statut du dossier a été modifié",
          variant: "success"
        });
        loadCases();
      }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 🎨 FONCTIONS D'AFFICHAGE
   */
  const getStatusConfig = (status) => {
    const configs = {
      new: { label: 'Nouveau', color: 'bg-blue-500', icon: Plus },
      in_progress: { label: 'En cours', color: 'bg-yellow-500', icon: ArrowRight },
      documents_pending: { label: 'Docs en attente', color: 'bg-orange-500', icon: FileText },
      review: { label: 'Révision', color: 'bg-purple-500', icon: Eye },
      signature_pending: { label: 'Signature', color: 'bg-indigo-500', icon: Edit2 },
      completed: { label: 'Terminé', color: 'bg-green-500', icon: CheckCircle },
      archived: { label: 'Archivé', color: 'bg-gray-500', icon: BookOpen }
    };
    return configs[status] || configs.new;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      high: { label: 'Haute', color: 'bg-red-500 text-white' },
      medium: { label: 'Moyenne', color: 'bg-yellow-500 text-white' },
      low: { label: 'Basse', color: 'bg-green-500 text-white' }
    };
    return configs[priority] || configs.medium;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  /**
   * 📊 STATISTIQUES RAPIDES
   */
  const stats = {
    total: cases.length,
    active: cases.filter(c => c.status === 'in_progress').length,
    pending: cases.filter(c => c.status === 'documents_pending' || c.status === 'signature_pending').length,
    completed: cases.filter(c => c.status === 'completed').length,
    highPriority: cases.filter(c => c.priority === 'high').length,
    totalValue: cases.reduce((sum, c) => sum + (parseFloat(c.property_value) || 0), 0)
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto">
      {/* En-tête avec statistiques */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-indigo-600" />
              Gestion des Dossiers
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Suivi complet de vos dossiers notariaux • Données en temps réel
            </p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau Dossier
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">En cours</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.active}</p>
              </div>
              <ArrowRight className="h-8 w-8 text-yellow-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">En attente</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Terminés</p>
                <p className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">Priorité haute</p>
                <p className="text-xl sm:text-2xl font-bold text-red-700 dark:text-red-300">{stats.highPriority}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Valeur totale</p>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                  {(stats.totalValue / 1000000).toFixed(1)}M
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Barre de filtres et recherche */}
      <Card className="p-3 sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Rechercher un dossier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="new">Nouveau</option>
            <option value="in_progress">En cours</option>
            <option value="documents_pending">Docs en attente</option>
            <option value="review">Révision</option>
            <option value="signature_pending">Signature</option>
            <option value="completed">Terminé</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">Toutes priorités</option>
            <option value="high">Haute</option>
            <option value="medium">Moyenne</option>
            <option value="low">Basse</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="date_desc">Plus récent</option>
            <option value="date_asc">Plus ancien</option>
            <option value="priority">Par priorité</option>
            <option value="progress">Par progression</option>
          </select>
        </div>
      </Card>

      {/* Liste des dossiers */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredCases.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Aucun dossier trouvé
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
              ? 'Essayez de modifier vos filtres de recherche'
              : 'Commencez par créer votre premier dossier'}
          </p>
          {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-5 w-5 mr-2" />
              Créer un dossier
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {paginatedCases.map((caseItem, index) => {
              const statusConfig = getStatusConfig(caseItem.status);
              const priorityConfig = getPriorityConfig(caseItem.priority);
              const daysUntilDue = calculateDaysUntilDue(caseItem.due_date);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={caseItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4" style={{ borderLeftColor: statusConfig.color.replace('bg-', '#').replace('-500', '') }}>
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      {/* Informations principales */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${statusConfig.color} bg-opacity-10`}>
                            <StatusIcon className={`h-5 w-5 ${statusConfig.color.replace('bg-', 'text-')}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {caseItem.title}
                              </h3>
                              <Badge className={priorityConfig.color}>
                                {priorityConfig.label}
                              </Badge>
                              <Badge variant="outline" className="font-mono text-xs">
                                {caseItem.case_number}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-500" />
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400 text-xs">Acheteur</p>
                                  <p className="font-medium text-gray-700 dark:text-gray-300">{caseItem.buyer_name}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-green-500" />
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400 text-xs">Vendeur</p>
                                  <p className="font-medium text-gray-700 dark:text-gray-300">{caseItem.seller_name}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-purple-500" />
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400 text-xs">Propriété</p>
                                  <p className="font-medium text-gray-700 dark:text-gray-300 truncate">
                                    {caseItem.property_address || 'Non définie'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-yellow-500" />
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400 text-xs">Valeur</p>
                                  <p className="font-medium text-gray-700 dark:text-gray-300">
                                    {formatCurrency(caseItem.property_value)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Progression */}
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Progression</span>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                  {caseItem.progress || 0}%
                                </span>
                              </div>
                              <Progress value={caseItem.progress || 0} className="h-2" />
                            </div>

                            {/* Informations supplémentaires */}
                            <div className="flex flex-wrap items-center gap-4 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Ouvert: {formatDate(caseItem.opened_date)}
                              </div>
                              {caseItem.due_date && (
                                <div className={`flex items-center gap-1 ${daysUntilDue < 0 ? 'text-red-600' : daysUntilDue < 7 ? 'text-orange-600' : ''}`}>
                                  <Clock className="h-3 w-3" />
                                  Échéance: {formatDate(caseItem.due_date)}
                                  {daysUntilDue !== null && (
                                    <span className="font-semibold">
                                      ({daysUntilDue < 0 ? `${Math.abs(daysUntilDue)}j retard` : `${daysUntilDue}j restants`})
                                    </span>
                                  )}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                Docs: {caseItem.completed_documents || 0}/{caseItem.documents_count || 0}
                              </div>
                              {caseItem.notary_fees && (
                                <div className="flex items-center gap-1 text-green-600">
                                  <TrendingUp className="h-3 w-3" />
                                  Honoraires: {formatCurrency(caseItem.notary_fees)}
                                </div>
                              )}
                            </div>

                            {/* Prochaine action */}
                            {caseItem.next_action && (
                              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4" />
                                  {caseItem.next_action}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => navigate(`/notaire/cases/${caseItem.id}`)}
                          className="gap-2"
                        >
                          <FolderOpen className="h-4 w-4" />
                          Ouvrir
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedCase(caseItem);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Aperçu
                        </Button>
                        <select
                          value={caseItem.status}
                          onChange={(e) => handleUpdateStatus(caseItem.id, e.target.value)}
                          className="px-2 py-1 text-xs border rounded"
                        >
                          <option value="new">Nouveau</option>
                          <option value="in_progress">En cours</option>
                          <option value="documents_pending">Docs en attente</option>
                          <option value="review">Révision</option>
                          <option value="signature_pending">Signature</option>
                          <option value="completed">Terminé</option>
                        </select>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedCase(caseItem);
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Dialog de création */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouveau dossier</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour créer un dossier notarial
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Titre du dossier *</Label>
              <Input
                id="title"
                placeholder="Ex: Vente Terrain Résidentiel - Ouakam"
                value={newCase.title}
                onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="case_type">Type de dossier</Label>
                <select
                  id="case_type"
                  value={newCase.case_type}
                  onChange={(e) => setNewCase({ ...newCase, case_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="vente_terrain">Vente terrain</option>
                  <option value="vente_immobilier">Vente immobilier</option>
                  <option value="succession">Succession</option>
                  <option value="donation">Donation</option>
                  <option value="hypotheque">Hypothèque</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <Label htmlFor="priority">Priorité</Label>
                <select
                  id="priority"
                  value={newCase.priority}
                  onChange={(e) => setNewCase({ ...newCase, priority: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="buyer_name">Nom de l'acheteur *</Label>
                <Input
                  id="buyer_name"
                  placeholder="Nom complet"
                  value={newCase.buyer_name}
                  onChange={(e) => setNewCase({ ...newCase, buyer_name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="seller_name">Nom du vendeur *</Label>
                <Input
                  id="seller_name"
                  placeholder="Nom complet"
                  value={newCase.seller_name}
                  onChange={(e) => setNewCase({ ...newCase, seller_name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="property_address">Adresse de la propriété</Label>
              <Input
                id="property_address"
                placeholder="Adresse complète"
                value={newCase.property_address}
                onChange={(e) => setNewCase({ ...newCase, property_address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label htmlFor="property_value">Valeur (FCFA)</Label>
                <Input
                  id="property_value"
                  type="number"
                  placeholder="0"
                  value={newCase.property_value}
                  onChange={(e) => setNewCase({ ...newCase, property_value: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="due_date">Date d'échéance</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newCase.due_date}
                  onChange={(e) => setNewCase({ ...newCase, due_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Description du dossier..."
                rows={3}
                value={newCase.description}
                onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateCase} disabled={isLoading}>
              {isLoading ? 'Création...' : 'Créer le dossier'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de détails */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              {selectedCase?.title}
            </DialogTitle>
            <DialogDescription>
              Dossier {selectedCase?.case_number}
            </DialogDescription>
          </DialogHeader>

          {selectedCase && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 h-auto">
                  <TabsTrigger value="general">Général</TabsTrigger>
                  <TabsTrigger value="parties">Parties</TabsTrigger>
                  <TabsTrigger value="property">Propriété</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Statut</p>
                      <Badge className={getStatusConfig(selectedCase.status).color}>
                        {getStatusConfig(selectedCase.status).label}
                      </Badge>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Priorité</p>
                      <Badge className={getPriorityConfig(selectedCase.priority).color}>
                        {getPriorityConfig(selectedCase.priority).label}
                      </Badge>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date d'ouverture</p>
                      <p className="font-semibold">{formatDate(selectedCase.opened_date)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Échéance</p>
                      <p className="font-semibold">{formatDate(selectedCase.due_date)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg col-span-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Progression</p>
                      <Progress value={selectedCase.progress || 0} className="h-2 mb-1" />
                      <p className="text-sm font-semibold">{selectedCase.progress || 0}%</p>
                    </div>
                  </div>

                  {selectedCase.next_action && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Prochaine action: {selectedCase.next_action}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="parties" className="space-y-4 mt-4">
                  <Card className="p-4">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-500" />
                      Acheteur
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">{selectedCase.buyer_name}</p>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-500" />
                      Vendeur
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">{selectedCase.seller_name}</p>
                  </Card>
                </TabsContent>

                <TabsContent value="property" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {selectedCase.property_address && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Adresse
                        </p>
                        <p className="font-semibold">{selectedCase.property_address}</p>
                      </div>
                    )}
                    
                    {selectedCase.property_value && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Valeur de la propriété
                        </p>
                        <p className="font-semibold text-lg text-green-600">
                          {formatCurrency(selectedCase.property_value)}
                        </p>
                      </div>
                    )}

                    {selectedCase.notary_fees && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Honoraires notariaux
                        </p>
                        <p className="font-semibold text-lg text-purple-600">
                          {formatCurrency(selectedCase.notary_fees)}
                        </p>
                      </div>
                    )}

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Documents
                      </p>
                      <p className="font-semibold">
                        {selectedCase.completed_documents || 0} / {selectedCase.documents_count || 0} complétés
                      </p>
                      {selectedCase.documents_count > 0 && (
                        <Progress 
                          value={(selectedCase.completed_documents / selectedCase.documents_count) * 100} 
                          className="h-2 mt-2"
                        />
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir archiver le dossier "{selectedCase?.case_number}" ?
              Cette action peut être annulée depuis les archives.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteCase} disabled={isLoading}>
              {isLoading ? 'Suppression...' : 'Archiver'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

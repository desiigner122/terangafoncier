import React, { useState, useEffect } from 'react';
import {
  Briefcase, Plus, Search, Eye, Edit2, Trash2,
  FileText, Calendar, User,
  AlertCircle, CheckCircle, XCircle,
  ArrowRight, DollarSign, TrendingUp, Shield, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext.jsx';
import supabase from '@/lib/supabaseClient';

/**
 * NotaireCasesModernized.jsx
 * Gestion des dossiers / actes notariaux — reconnecté à la table réelle `notarial_acts`.
 * Colonnes réelles : id, notaire_id, client_id, property_id, act_type, reference, client_name,
 *   status ('draft'|'in_progress'|'signed'|'completed'|'cancelled'), notary_fees, amount,
 *   client_satisfaction, signed_at, created_at, updated_at.
 * Les champs sans source réelle (progression détaillée, échéance, documents, parties multiples,
 * priorité) ont été retirés ou remplacés par un affichage honnête dérivé du statut.
 */

const ACT_TYPE_LABELS = {
  vente_immobiliere: 'Vente immobilière',
  vente_terrain: 'Vente terrain',
  succession: 'Succession',
  donation: 'Donation',
  hypotheque: 'Hypothèque',
  bail: 'Bail',
  partage: 'Partage',
  constitution_societe: 'Constitution société',
  autre: 'Autre'
};

// Progression dérivée du statut réel (encodage visuel du workflow, pas une métrique fabriquée)
const STATUS_PROGRESS = {
  draft: 10,
  in_progress: 50,
  signed: 80,
  completed: 100,
  cancelled: 0
};

export default function NotaireCasesModernized() {
  const { user } = useAuth();

  // États principaux
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // États de filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  // États de dialogs
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // États de pagination
  const [currentPage, setCurrentPage] = useState(1);
  const casesPerPage = 10;

  // États du formulaire de création (colonnes réelles uniquement)
  const [newCase, setNewCase] = useState({
    act_type: 'vente_immobiliere',
    reference: '',
    client_name: '',
    amount: '',
    notary_fees: ''
  });

  /**
   * 🔄 CHARGEMENT DES DONNÉES SUPABASE (notarial_acts, filtré par notaire_id)
   */
  useEffect(() => {
    if (user?.id) {
      loadCases();
    }
  }, [user]);

  const loadCases = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notarial_acts')
        .select('id, notaire_id, client_id, property_id, act_type, reference, client_name, status, notary_fees, amount, client_satisfaction, signed_at, created_at, updated_at')
        .eq('notaire_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCases(data || []);
      setFilteredCases(data || []);
    } catch (error) {
      console.error('Erreur chargement dossiers:', error);
      window.safeGlobalToast?.({
        title: "Erreur de chargement",
        description: error.message || "Impossible de charger les dossiers",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
        c.reference?.toLowerCase().includes(search) ||
        c.client_name?.toLowerCase().includes(search) ||
        (ACT_TYPE_LABELS[c.act_type] || c.act_type || '').toLowerCase().includes(search)
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Filtre par type d'acte
    if (typeFilter !== 'all') {
      filtered = filtered.filter(c => c.act_type === typeFilter);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'date_asc':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'amount_desc':
          return (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0);
        case 'fees_desc':
          return (parseFloat(b.notary_fees) || 0) - (parseFloat(a.notary_fees) || 0);
        default:
          return 0;
      }
    });

    setFilteredCases(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, sortBy, cases]);

  /**
   * 📄 PAGINATION
   */
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);
  const startIndex = (currentPage - 1) * casesPerPage;
  const paginatedCases = filteredCases.slice(startIndex, startIndex + casesPerPage);

  /**
   * ➕ CRÉATION D'UN NOUVEL ACTE (notarial_acts)
   */
  const handleCreateCase = async () => {
    if (!newCase.client_name || !newCase.act_type) {
      window.safeGlobalToast?.({
        title: "Champs requis",
        description: "Le client et le type d'acte sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Générer une référence si non fournie
      let reference = newCase.reference?.trim();
      if (!reference) {
        const year = new Date().getFullYear();
        const sequence = cases.length + 1;
        reference = `ACT-${year}-${String(sequence).padStart(3, '0')}`;
      }

      const { data, error } = await supabase
        .from('notarial_acts')
        .insert({
          notaire_id: user.id,
          act_type: newCase.act_type,
          reference,
          client_name: newCase.client_name,
          amount: parseFloat(newCase.amount) || 0,
          notary_fees: parseFloat(newCase.notary_fees) || 0,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      window.safeGlobalToast?.({
        title: "Dossier créé",
        description: `Acte ${data.reference} créé avec succès`,
        variant: "success"
      });
      setShowCreateDialog(false);
      setNewCase({
        act_type: 'vente_immobiliere',
        reference: '',
        client_name: '',
        amount: '',
        notary_fees: ''
      });
      loadCases();
    } catch (error) {
      console.error('Erreur création dossier:', error);
      window.safeGlobalToast?.({
        title: "Erreur de création",
        description: error.message,
        variant: "destructive"
      });
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
      const { error } = await supabase
        .from('notarial_acts')
        .delete()
        .eq('id', selectedCase.id);

      if (error) throw error;

      window.safeGlobalToast?.({
        title: "Dossier supprimé",
        description: "L'acte a été supprimé avec succès",
        variant: "success"
      });
      setShowDeleteDialog(false);
      setSelectedCase(null);
      loadCases();
    } catch (error) {
      console.error('Erreur suppression dossier:', error);
      window.safeGlobalToast?.({
        title: "Erreur de suppression",
        description: error.message,
        variant: "destructive"
      });
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
      const updates = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };
      // Renseigner la date de signature si l'acte est signé
      if (newStatus === 'signed') {
        updates.signed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('notarial_acts')
        .update(updates)
        .eq('id', caseId);

      if (error) throw error;

      window.safeGlobalToast?.({
        title: "Statut mis à jour",
        description: "Le statut du dossier a été modifié",
        variant: "success"
      });
      loadCases();
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      window.safeGlobalToast?.({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 🎨 FONCTIONS D'AFFICHAGE
   */
  const getStatusConfig = (status) => {
    const configs = {
      draft: { label: 'Brouillon', color: 'bg-gray-500', icon: Edit2 },
      in_progress: { label: 'En cours', color: 'bg-yellow-500', icon: ArrowRight },
      signed: { label: 'Signé', color: 'bg-indigo-500', icon: Shield },
      completed: { label: 'Terminé', color: 'bg-green-500', icon: CheckCircle },
      cancelled: { label: 'Annulé', color: 'bg-red-500', icon: XCircle }
    };
    return configs[status] || configs.draft;
  };

  const getActTypeLabel = (type) => ACT_TYPE_LABELS[type] || type || 'Acte';

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  /**
   * 📊 STATISTIQUES RAPIDES (dérivées des données réelles)
   */
  const stats = {
    total: cases.length,
    active: cases.filter(c => c.status === 'in_progress').length,
    draft: cases.filter(c => c.status === 'draft').length,
    signed: cases.filter(c => c.status === 'signed').length,
    completed: cases.filter(c => c.status === 'completed').length,
    totalValue: cases.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0)
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* En-tête avec statistiques */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-indigo-600" />
              Gestion des Dossiers
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Suivi complet de vos actes notariaux
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">En cours</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.active}</p>
              </div>
              <ArrowRight className="h-8 w-8 text-yellow-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Brouillons</p>
                <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{stats.draft}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Signés</p>
                <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{stats.signed}</p>
              </div>
              <Shield className="h-8 w-8 text-indigo-500" />
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Terminés</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
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
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <option value="draft">Brouillon</option>
            <option value="in_progress">En cours</option>
            <option value="signed">Signé</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">Tous les types</option>
            {Object.entries(ACT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="date_desc">Plus récent</option>
            <option value="date_asc">Plus ancien</option>
            <option value="amount_desc">Montant décroissant</option>
            <option value="fees_desc">Honoraires décroissants</option>
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
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'Essayez de modifier vos filtres de recherche'
              : 'Commencez par créer votre premier dossier'}
          </p>
          {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
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
              const progress = STATUS_PROGRESS[caseItem.status] ?? 0;
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={caseItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-indigo-500">
                    <div className="flex items-start justify-between gap-4">
                      {/* Informations principales */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${statusConfig.color} bg-opacity-10`}>
                            <StatusIcon className={`h-5 w-5 ${statusConfig.color.replace('bg-', 'text-')}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center flex-wrap gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {getActTypeLabel(caseItem.act_type)}
                              </h3>
                              <Badge className={`${statusConfig.color} text-white`}>
                                {statusConfig.label}
                              </Badge>
                              {caseItem.reference && (
                                <Badge variant="outline" className="font-mono text-xs">
                                  {caseItem.reference}
                                </Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-500" />
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400 text-xs">Client</p>
                                  <p className="font-medium text-gray-700 dark:text-gray-300">{caseItem.client_name || '—'}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-green-500" />
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400 text-xs">Type d'acte</p>
                                  <p className="font-medium text-gray-700 dark:text-gray-300">{getActTypeLabel(caseItem.act_type)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-yellow-500" />
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400 text-xs">Montant</p>
                                  <p className="font-medium text-gray-700 dark:text-gray-300">
                                    {caseItem.amount ? formatCurrency(caseItem.amount) : '—'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-purple-500" />
                                <div>
                                  <p className="text-gray-500 dark:text-gray-400 text-xs">Honoraires</p>
                                  <p className="font-medium text-gray-700 dark:text-gray-300">
                                    {caseItem.notary_fees ? formatCurrency(caseItem.notary_fees) : '—'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Progression (dérivée du statut) */}
                            <div className="mt-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">Avancement</span>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                  {progress}%
                                </span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>

                            {/* Informations supplémentaires */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Créé: {formatDate(caseItem.created_at)}
                              </div>
                              {caseItem.signed_at && (
                                <div className="flex items-center gap-1 text-indigo-600">
                                  <Shield className="h-3 w-3" />
                                  Signé: {formatDate(caseItem.signed_at)}
                                </div>
                              )}
                              {caseItem.client_satisfaction != null && (
                                <div className="flex items-center gap-1 text-green-600">
                                  <Star className="h-3 w-3" />
                                  Satisfaction: {caseItem.client_satisfaction}%
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedCase(caseItem);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        <select
                          value={caseItem.status}
                          onChange={(e) => handleUpdateStatus(caseItem.id, e.target.value)}
                          className="px-2 py-1 text-xs border rounded"
                        >
                          <option value="draft">Brouillon</option>
                          <option value="in_progress">En cours</option>
                          <option value="signed">Signé</option>
                          <option value="completed">Terminé</option>
                          <option value="cancelled">Annulé</option>
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
              Remplissez les informations pour créer un acte notarial
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="act_type">Type d'acte *</Label>
                <select
                  id="act_type"
                  value={newCase.act_type}
                  onChange={(e) => setNewCase({ ...newCase, act_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {Object.entries(ACT_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="reference">Référence</Label>
                <Input
                  id="reference"
                  placeholder="Auto-générée si vide"
                  value={newCase.reference}
                  onChange={(e) => setNewCase({ ...newCase, reference: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="client_name">Nom du client *</Label>
              <Input
                id="client_name"
                placeholder="Nom complet"
                value={newCase.client_name}
                onChange={(e) => setNewCase({ ...newCase, client_name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Montant de la transaction (FCFA)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={newCase.amount}
                  onChange={(e) => setNewCase({ ...newCase, amount: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="notary_fees">Honoraires notariaux (FCFA)</Label>
                <Input
                  id="notary_fees"
                  type="number"
                  placeholder="0"
                  value={newCase.notary_fees}
                  onChange={(e) => setNewCase({ ...newCase, notary_fees: e.target.value })}
                />
              </div>
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
              {selectedCase && getActTypeLabel(selectedCase.act_type)}
            </DialogTitle>
            <DialogDescription>
              {selectedCase?.reference ? `Référence ${selectedCase.reference}` : 'Acte notarial'}
            </DialogDescription>
          </DialogHeader>

          {selectedCase && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">Général</TabsTrigger>
                  <TabsTrigger value="client">Client</TabsTrigger>
                  <TabsTrigger value="transaction">Transaction</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Statut</p>
                      <Badge className={`${getStatusConfig(selectedCase.status).color} text-white`}>
                        {getStatusConfig(selectedCase.status).label}
                      </Badge>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Type d'acte</p>
                      <p className="font-semibold">{getActTypeLabel(selectedCase.act_type)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date de création</p>
                      <p className="font-semibold">{formatDate(selectedCase.created_at)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date de signature</p>
                      <p className="font-semibold">{formatDate(selectedCase.signed_at)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Satisfaction client</p>
                      <p className="font-semibold">
                        {selectedCase.client_satisfaction != null ? `${selectedCase.client_satisfaction}%` : '—'}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Avancement</p>
                      <Progress value={STATUS_PROGRESS[selectedCase.status] ?? 0} className="h-2 mb-1" />
                      <p className="text-sm font-semibold">{STATUS_PROGRESS[selectedCase.status] ?? 0}%</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="client" className="space-y-4 mt-4">
                  <Card className="p-4">
                    <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-500" />
                      Client
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      {selectedCase.client_name || 'Non renseigné'}
                    </p>
                  </Card>
                </TabsContent>

                <TabsContent value="transaction" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Montant de la transaction
                      </p>
                      <p className="font-semibold text-lg text-green-600">
                        {selectedCase.amount ? formatCurrency(selectedCase.amount) : '—'}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Honoraires notariaux
                      </p>
                      <p className="font-semibold text-lg text-purple-600">
                        {selectedCase.notary_fees ? formatCurrency(selectedCase.notary_fees) : '—'}
                      </p>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Référence
                      </p>
                      <p className="font-semibold font-mono">{selectedCase.reference || '—'}</p>
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
              Êtes-vous sûr de vouloir supprimer le dossier "{selectedCase?.reference || getActTypeLabel(selectedCase?.act_type)}" ?
              Cette action est définitive.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteCase} disabled={isLoading}>
              {isLoading ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

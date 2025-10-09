import React, { useState, useEffect } from 'react';
import { 
  Archive, Search, Filter, Download, Eye, FileText, 
  Calendar, DollarSign, Clock, User, MapPin, TrendingUp,
  Undo2, BookOpen, CheckCircle, AlertCircle, BarChart3,
  Folder, Hash, Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/UnifiedAuthContext.jsx';
import { NotaireSupabaseService } from '@/services/NotaireSupabaseService';

/**
 * NotaireArchivesModernized.jsx
 * Archives notariales numériques avec recherche full-text et données Supabase réelles
 * Remplace NotaireArchives.jsx (mock data)
 */

export default function NotaireArchivesModernized() {
  const { user } = useAuth();

  // États principaux
  const [archives, setArchives] = useState([]);
  const [filteredArchives, setFilteredArchives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // États de filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  // États de pagination
  const [currentPage, setCurrentPage] = useState(1);
  const archivesPerPage = 12;

  /**
   * 🔄 CHARGEMENT DONNÉES SUPABASE
   */
  useEffect(() => {
    if (user?.id) {
      loadArchives();
    }
  }, [user]);

  const loadArchives = async () => {
    setIsLoading(true);
    try {
      const result = await NotaireSupabaseService.getArchives(user.id, {
        search: searchTerm,
        year: yearFilter !== 'all' ? yearFilter : null,
        type: typeFilter !== 'all' ? typeFilter : null
      });

      if (result.success) {
        setArchives(result.data);
        setFilteredArchives(result.data);
      } else {
        window.safeGlobalToast?.({
          title: "Erreur de chargement",
          description: result.error || "Impossible de charger les archives",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur chargement archives:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 🔍 FILTRAGE ET TRI
   */
  useEffect(() => {
    let filtered = [...archives];

    // Recherche full-text (déjà gérée par Supabase search_vector)
    if (searchTerm && !archives.length) {
      // La recherche est faite côté serveur, recharger
      loadArchives();
      return;
    }

    // Filtre par année (côté client pour filtrage instantané)
    if (yearFilter !== 'all') {
      filtered = filtered.filter(a => {
        const year = new Date(a.archive_date).getFullYear().toString();
        return year === yearFilter;
      });
    }

    // Filtre par type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(a => a.act_type === typeFilter);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_desc':
          return new Date(b.archive_date) - new Date(a.archive_date);
        case 'date_asc':
          return new Date(a.archive_date) - new Date(b.archive_date);
        case 'amount_desc':
          return (b.notary_fees || 0) - (a.notary_fees || 0);
        case 'amount_asc':
          return (a.notary_fees || 0) - (b.notary_fees || 0);
        default:
          return 0;
      }
    });

    setFilteredArchives(filtered);
    setCurrentPage(1);
  }, [yearFilter, typeFilter, sortBy]);

  /**
   * 📄 PAGINATION
   */
  const totalPages = Math.ceil(filteredArchives.length / archivesPerPage);
  const startIndex = (currentPage - 1) * archivesPerPage;
  const paginatedArchives = filteredArchives.slice(startIndex, startIndex + archivesPerPage);

  /**
   * 📊 STATISTIQUES
   */
  const stats = {
    total: archives.length,
    thisYear: archives.filter(a => new Date(a.archive_date).getFullYear() === new Date().getFullYear()).length,
    totalValue: archives.reduce((sum, a) => sum + (parseFloat(a.property_value) || 0), 0),
    totalFees: archives.reduce((sum, a) => sum + (parseFloat(a.notary_fees) || 0), 0),
    avgDuration: archives.length > 0 
      ? Math.round(archives.reduce((sum, a) => sum + (parseInt(a.duration_days) || 0), 0) / archives.length)
      : 0
  };

  /**
   * 🎨 FONCTIONS D'AFFICHAGE
   */
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

  const getTypeLabel = (type) => {
    const types = {
      vente_terrain: 'Vente Terrain',
      vente_immobiliere: 'Vente Immobilière',
      succession: 'Succession',
      donation: 'Donation',
      hypotheque: 'Hypothèque',
      bail: 'Bail',
      autre: 'Autre'
    };
    return types[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      vente_terrain: 'bg-green-100 text-green-700',
      vente_immobiliere: 'bg-blue-100 text-blue-700',
      succession: 'bg-purple-100 text-purple-700',
      donation: 'bg-pink-100 text-pink-700',
      hypotheque: 'bg-orange-100 text-orange-700',
      bail: 'bg-indigo-100 text-indigo-700',
      autre: 'bg-gray-100 text-gray-700'
    };
    return colors[type] || colors.autre;
  };

  // Années disponibles pour le filtre
  const availableYears = [...new Set(archives.map(a => new Date(a.archive_date).getFullYear()))].sort((a, b) => b - a);

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Archive className="h-8 w-8 text-amber-600" />
              Archives Notariales
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Consultation et gestion des actes archivés • Recherche full-text
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
                </div>
                <Archive className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Cette année</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.thisYear}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Valeur totale</p>
                  <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
                    {(stats.totalValue / 1000000000).toFixed(1)}Md
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Honoraires</p>
                  <p className="text-xl font-bold text-amber-700 dark:text-amber-300">
                    {(stats.totalFees / 1000000).toFixed(1)}M
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Durée moy.</p>
                  <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{stats.avgDuration}j</p>
                </div>
                <Clock className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Barre de recherche et filtres */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Rechercher (numéro, client, adresse...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  loadArchives();
                }
              }}
              className="pl-10"
            />
          </div>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">Toutes les années</option>
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">Tous les types</option>
            <option value="vente_terrain">Vente Terrain</option>
            <option value="vente_immobiliere">Vente Immobilière</option>
            <option value="succession">Succession</option>
            <option value="donation">Donation</option>
            <option value="hypotheque">Hypothèque</option>
            <option value="bail">Bail</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="date_desc">Plus récent</option>
            <option value="date_asc">Plus ancien</option>
            <option value="amount_desc">Montant décroissant</option>
            <option value="amount_asc">Montant croissant</option>
          </select>
        </div>
      </Card>

      {/* Liste des archives */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      ) : filteredArchives.length === 0 ? (
        <Card className="p-12 text-center">
          <Archive className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Aucune archive trouvée
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || yearFilter !== 'all' || typeFilter !== 'all'
              ? 'Essayez de modifier vos critères de recherche'
              : 'Aucun acte archivé pour le moment'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {paginatedArchives.map((archive, index) => (
                <motion.div
                  key={archive.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-200 cursor-pointer h-full"
                        onClick={() => {
                          setSelectedArchive(archive);
                          setShowDetailsDialog(true);
                        }}>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={getTypeColor(archive.act_type)}>
                          {getTypeLabel(archive.act_type)}
                        </Badge>
                        <span className="text-xs text-gray-500 font-mono">
                          {archive.act_number}
                        </span>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{archive.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <User className="h-4 w-4" />
                        <span className="truncate">{archive.client_name}</span>
                      </div>

                      {archive.property_address && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{archive.property_address}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>Archivé: {formatDate(archive.archive_date)}</span>
                      </div>

                      {archive.notary_fees && (
                        <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                          <DollarSign className="h-4 w-4" />
                          <span>{formatCurrency(archive.notary_fees)}</span>
                        </div>
                      )}

                      {archive.document_count > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <FileText className="h-4 w-4" />
                          <span>{archive.document_count} documents</span>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedArchive(archive);
                            setShowDetailsDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.safeGlobalToast?.({
                              title: "Téléchargement",
                              description: "Génération du PDF en cours...",
                              variant: "success"
                            });
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

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

      {/* Dialog détails */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              {selectedArchive?.title}
            </DialogTitle>
            <DialogDescription>
              Archive {selectedArchive?.act_number}
            </DialogDescription>
          </DialogHeader>

          {selectedArchive && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Type d'acte</p>
                    <Badge className={getTypeColor(selectedArchive.act_type)}>
                      {getTypeLabel(selectedArchive.act_type)}
                    </Badge>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Numéro d'acte</p>
                    <p className="font-mono font-semibold">{selectedArchive.act_number}</p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Client
                  </p>
                  <p className="font-semibold">{selectedArchive.client_name}</p>
                </div>

                {selectedArchive.property_address && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Adresse de la propriété
                    </p>
                    <p className="font-semibold">{selectedArchive.property_address}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date de completion</p>
                    <p className="font-semibold">{formatDate(selectedArchive.completion_date)}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date d'archivage</p>
                    <p className="font-semibold">{formatDate(selectedArchive.archive_date)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {selectedArchive.property_value && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Valeur propriété</p>
                      <p className="font-semibold text-lg text-green-600">
                        {formatCurrency(selectedArchive.property_value)}
                      </p>
                    </div>
                  )}
                  {selectedArchive.notary_fees && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Honoraires notariaux</p>
                      <p className="font-semibold text-lg text-purple-600">
                        {formatCurrency(selectedArchive.notary_fees)}
                      </p>
                    </div>
                  )}
                </div>

                {selectedArchive.document_count > 0 && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Documents archivés
                    </p>
                    <p className="font-semibold">{selectedArchive.document_count} documents</p>
                  </div>
                )}

                {selectedArchive.notes && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Notes</p>
                    <p className="text-sm">{selectedArchive.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Undo2 className="h-4 w-4 mr-2" />
                    Restaurer
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

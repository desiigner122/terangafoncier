/**
 * ========================================
 * AdminPagesList - Liste pages CMS
 * ========================================
 * Date: 10 Octobre 2025
 * Fonctionnalités: CRUD pages, recherche, filtres, publication
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminCMS } from '@/hooks/admin';
import { 
  FileText, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  Archive,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const AdminPagesList = () => {
  const { pages, loading, error, loadPages, publishPage, deletePage } = useAdminCMS();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);
  const [publishingId, setPublishingId] = useState(null);

  // Charger pages au montage
  useEffect(() => {
    loadPages();
  }, []);

  // Filtrer pages
  const filteredPages = pages.filter(page => {
    const matchSearch = (page.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (page.slug || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || page.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Gérer publication
  const handlePublish = async (pageId) => {
    setPublishingId(pageId);
    
    const result = await publishPage(pageId);
    
    if (result.success) {
      toast.success("Page publiée avec succès");
    } else {
      toast.error(result.error || "Erreur lors de la publication");
    }
    
    setPublishingId(null);
  };

  // Gérer suppression
  const handleDeleteConfirm = async () => {
    if (!pageToDelete) return;
    
    const result = await deletePage(pageToDelete.id);
    
    if (result.success) {
      toast.success(`"${pageToDelete.title}" a été supprimée`);
    } else {
      toast.error(result.error || "Erreur lors de la suppression");
    }
    
    setDeleteDialogOpen(false);
    setPageToDelete(null);
  };

  // Status badge
  const getStatusBadge = (status) => {
    const variants = {
      published: { variant: "success", icon: CheckCircle, label: "Publié" },
      draft: { variant: "warning", icon: Clock, label: "Brouillon" },
      archived: { variant: "secondary", icon: Archive, label: "Archivé" }
    };
    
    const config = variants[status] || variants.draft;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 mb-4">Erreur: {error}</p>
          <Button onClick={() => loadPages()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages CMS</h1>
          <p className="text-gray-500 mt-1">
            Gérez toutes les pages du site (Solutions, Guides, Outils)
          </p>
        </div>
        <Link to="/admin/cms/pages/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle Page
          </Button>
        </Link>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher par titre ou slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="published">Publiés</SelectItem>
            <SelectItem value="draft">Brouillons</SelectItem>
            <SelectItem value="archived">Archivés</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Total Pages</p>
          <p className="text-2xl font-bold text-gray-900">{pages.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600">Publiées</p>
          <p className="text-2xl font-bold text-green-700">
            {pages.filter(p => p.status === 'published').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-600">Brouillons</p>
          <p className="text-2xl font-bold text-yellow-700">
            {pages.filter(p => p.status === 'draft').length}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Archivées</p>
          <p className="text-2xl font-bold text-gray-700">
            {pages.filter(p => p.status === 'archived').length}
          </p>
        </div>
      </div>

      {/* Liste pages */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucune page trouvée
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Essayez de modifier vos filtres'
              : 'Créez votre première page pour commencer'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Link to="/admin/cms/pages/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Créer une page
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Publié le
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modifié le
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {page.title}
                        </div>
                        {page.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {page.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                      /{page.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(page.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(page.published_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(page.updated_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {/* Voir sur le site */}
                      {page.status === 'published' && (
                        <a
                          href={`/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Voir sur le site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      
                      {/* Éditer */}
                      <Link to={`/admin/cms/pages/${page.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </Link>
                      
                      {/* Publier/Dépublier */}
                      {page.status === 'draft' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePublish(page.id)}
                          disabled={publishingId === page.id}
                          title="Publier"
                        >
                          {publishingId === page.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                          ) : (
                            <Eye className="w-4 h-4 text-green-600" />
                          )}
                        </Button>
                      ) : page.status === 'published' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Publié"
                          disabled
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                      )}
                      
                      {/* Supprimer */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setPageToDelete(page);
                          setDeleteDialogOpen(true);
                        }}
                        className="text-red-600 hover:text-red-700"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog suppression */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer cette page ?</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer "{pageToDelete?.title}" ? 
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPagesList;

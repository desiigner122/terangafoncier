import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Upload,
  Download,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  Building2,
  Shield,
  Star,
  Folder,
  Archive,
  Share2,
  Paperclip,
  RefreshCw,
  File,
  Image,
  FileSpreadsheet,
  FileImage
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';
import ParticulierSupabaseService from '@/services/ParticulierSupabaseService';

// Libellés lisibles pour les types de documents réels (colonne documents.type)
const TYPE_LABELS = {
  identite: 'Pièces d\'identité',
  residence: 'Justificatifs de résidence',
  financier: 'Documents financiers',
  technique: 'Documents techniques',
  demande: 'Demandes officielles',
  autre: 'Autres'
};

const ParticulierDocuments = () => {
  const { user } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('mes_documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Formulaire upload (colonnes réelles: name, type, url, status)
  const [uploadForm, setUploadForm] = useState({
    nom: '',
    type_document: '',
    file: null
  });

  useEffect(() => {
    if (user?.id) {
      loadDocuments();
    }
  }, [user?.id]);

  const loadDocuments = async () => {
    try {
      setLoading(true);

      // Table réelle: documents (owner_id, name, type, url, status, created_at)
      const result = await ParticulierSupabaseService.getDocuments(user.id);

      if (!result?.success) {
        throw new Error(result?.error || 'Erreur de chargement');
      }

      setDocuments(result.data || []);
    } catch (error) {
      console.error('Erreur chargement documents:', error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadForm.file || !uploadForm.nom) {
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(20);

      // Upload vers Supabase Storage
      const fileExt = uploadForm.file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, uploadForm.file);

      if (uploadError) throw uploadError;

      setUploadProgress(60);

      // URL publique du fichier stocké
      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(uploadData.path);

      // Enregistrer les métadonnées dans la table réelle "documents"
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert([{
          owner_id: user.id,
          name: uploadForm.nom,
          type: uploadForm.type_document || 'autre',
          url: publicUrlData?.publicUrl || uploadData.path,
          status: 'pending'
        }])
        .select()
        .single();

      if (docError) throw docError;

      setUploadProgress(100);
      setDocuments(prev => [docData, ...prev]);
      setIsUploadModalOpen(false);
      setUploadForm({
        nom: '',
        type_document: '',
        file: null
      });
    } catch (error) {
      console.error('Erreur upload document:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const downloadDocument = (document) => {
    if (!document?.url) return;
    // La colonne url contient l'URL publique du fichier stocké
    window.open(document.url, '_blank', 'noopener,noreferrer');
  };

  const deleteDocument = async (documentId) => {
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)
        .eq('owner_id', user.id);

      if (error) throw error;

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const getFileIcon = (nameOrUrl) => {
    const ext = (nameOrUrl || '').split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return FileText;
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)) return FileImage;
    if (['xls', 'xlsx', 'csv'].includes(ext)) return FileSpreadsheet;
    if (['doc', 'docx'].includes(ext)) return FileText;
    return File;
  };

  const getStatusBadge = (status) => {
    const configs = {
      'pending': { label: 'En attente', variant: 'secondary', icon: Clock },
      'active': { label: 'Actif', variant: 'default', icon: CheckCircle },
      'validated': { label: 'Validé', variant: 'default', icon: CheckCircle },
      'approved': { label: 'Approuvé', variant: 'default', icon: CheckCircle },
      'rejected': { label: 'Rejeté', variant: 'destructive', icon: AlertTriangle },
      'archived': { label: 'Archivé', variant: 'outline', icon: Archive },
      // Compat valeurs francophones éventuelles
      'Validé': { label: 'Validé', variant: 'default', icon: CheckCircle },
      'Approuvé': { label: 'Approuvé', variant: 'default', icon: CheckCircle },
      'En cours': { label: 'En cours', variant: 'secondary', icon: Clock },
      'En révision': { label: 'En révision', variant: 'secondary', icon: AlertTriangle }
    };

    const config = configs[status] || { label: status || 'En attente', variant: 'secondary', icon: Clock };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isValidated = (status) => ['validated', 'approved', 'active', 'Validé', 'Approuvé'].includes(status);
  const isPending = (status) => ['pending', 'En cours', 'En révision'].includes(status);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'tous' || doc.type === filterType;

    return matchesSearch && matchesFilter;
  });

  // Regroupement par type de document (la table réelle n'a pas de "dossier de référence")
  const groupedDocuments = filteredDocuments.reduce((groups, doc) => {
    const key = doc.type || 'autre';
    if (!groups[key]) groups[key] = [];
    groups[key].push(doc);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600">Chargement des documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
          <p className="text-slate-600 mt-1">
            Gérez vos documents et pièces justificatives
          </p>
        </div>

        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nouveau Document</DialogTitle>
              <DialogDescription>
                Téléchargez un nouveau document dans votre dossier
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du document</Label>
                <Input
                  id="nom"
                  value={uploadForm.nom}
                  onChange={(e) => setUploadForm(prev => ({...prev, nom: e.target.value}))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type de document</Label>
                <Select value={uploadForm.type_document} onValueChange={(value) => setUploadForm(prev => ({...prev, type_document: value}))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="identite">Pièce d'identité</SelectItem>
                    <SelectItem value="residence">Justificatif de résidence</SelectItem>
                    <SelectItem value="financier">Document financier</SelectItem>
                    <SelectItem value="technique">Document technique</SelectItem>
                    <SelectItem value="demande">Demande officielle</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Fichier</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setUploadForm(prev => ({...prev, file: e.target.files[0]}))}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                />
                <p className="text-xs text-slate-500">
                  Formats acceptés: PDF, Word, Excel, Images (max 10MB)
                </p>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <Label>Progression</Label>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsUploadModalOpen(false)}
                disabled={isUploading}
              >
                Annuler
              </Button>
              <Button onClick={handleFileUpload} disabled={isUploading || !uploadForm.file || !uploadForm.nom}>
                {isUploading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Upload...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Télécharger
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Documents</p>
                <p className="text-2xl font-bold text-slate-900">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-slate-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Validés</p>
                <p className="text-2xl font-bold text-green-600">
                  {documents.filter(d => isValidated(d.status)).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">En cours</p>
                <p className="text-2xl font-bold text-orange-600">
                  {documents.filter(d => isPending(d.status)).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Catégories</p>
                <p className="text-2xl font-bold text-blue-600">
                  {Object.keys(groupedDocuments).length}
                </p>
              </div>
              <Folder className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom ou type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les types</SelectItem>
                <SelectItem value="identite">Pièces d'identité</SelectItem>
                <SelectItem value="residence">Résidence</SelectItem>
                <SelectItem value="financier">Documents financiers</SelectItem>
                <SelectItem value="technique">Documents techniques</SelectItem>
                <SelectItem value="demande">Demandes officielles</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={loadDocuments}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents groupés par type */}
      <div className="space-y-6">
        {Object.keys(groupedDocuments).length > 0 ? (
          Object.entries(groupedDocuments).map(([typeKey, docs]) => (
            <Card key={typeKey}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Folder className="h-5 w-5 mr-2 text-blue-600" />
                  {TYPE_LABELS[typeKey] || typeKey}
                  <Badge variant="outline" className="ml-2">
                    {docs.length} document{docs.length > 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {docs.map((document) => {
                    const FileIcon = getFileIcon(document.url || document.name);

                    return (
                      <motion.div
                        key={document.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                            <FileIcon className="h-5 w-5 text-blue-600" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-900 truncate">
                              {document.name}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                              <span>{formatDate(document.created_at)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            {getStatusBadge(document.status)}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 ml-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadDocument(document)}
                            disabled={!document.url}
                          >
                            <Download className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteDocument(document.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Aucun document trouvé
              </h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || filterType !== 'tous' ?
                  'Aucun document ne correspond à vos critères.' :
                  'Vous n\'avez pas encore téléchargé de documents.'
                }
              </p>
              {!searchTerm && filterType === 'tous' && (
                <Button onClick={() => setIsUploadModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter votre premier document
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ParticulierDocuments;

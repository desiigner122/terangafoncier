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

  // Formulaire upload
  const [uploadForm, setUploadForm] = useState({
    nom: '',
    type_document: '',
    description: '',
    dossier_reference: '',
    file: null
  });

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      console.log('📊 Chargement des documents depuis Supabase...');

      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDocuments(data || []);
      console.log(`✅ ${(data || []).length} documents chargés depuis Supabase`);
    } catch (error) {
      console.error('❌ Erreur chargement documents:', error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadForm.file || !uploadForm.nom) {
      console.error('❌ Fichier ou nom manquant');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Upload vers Supabase Storage
      const fileExt = uploadForm.file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      console.log('📤 Upload du fichier vers Supabase Storage...');

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, uploadForm.file, {
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 50); // 50% pour l'upload
          }
        });

      if (uploadError) throw uploadError;

      // Enregistrer les métadonnées dans la base
      console.log('💾 Enregistrement des métadonnées...');

      const { data: docData, error: docError } = await supabase
        .from('user_documents')
        .insert([{
          user_id: user.id,
          nom: uploadForm.nom,
          type_document: uploadForm.type_document,
          description: uploadForm.description,
          dossier_reference: uploadForm.dossier_reference,
          nom_fichier: uploadForm.file.name,
          chemin_fichier: uploadData.path,
          taille_fichier: uploadForm.file.size,
          type_mime: uploadForm.file.type,
          statut: 'actif'
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
        description: '',
        dossier_reference: '',
        file: null
      });

      console.log('✅ Document uploadé avec succès');
    } catch (error) {
      console.error('❌ Erreur upload document:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const downloadDocument = async (document) => {
    try {
      console.log('📥 Téléchargement du document...');

      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.chemin_fichier);

      if (error) throw error;

      // Créer un lien de téléchargement
      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.nom_fichier || document.nom;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('✅ Document téléchargé');
    } catch (error) {
      console.error('❌ Erreur téléchargement:', error);
    }
  };

  const deleteDocument = async (documentId) => {
    try {
      console.log('🗑️ Suppression du document...');

      const { error } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', documentId)
        .eq('user_id', user.id);

      if (error) throw error;

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      console.log('✅ Document supprimé');
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
    }
  };

  // État des documents utilisateur
  const [sampleDocuments, setSampleDocuments] = useState([
    {
      id: 'DOC-001',
      nom: 'Demande initiale terrain communal',
      type_document: 'demande',
      nom_fichier: 'demande_terrain_DT-2024-001.pdf',
      taille_fichier: 2400000, // 2.4 MB
      type_mime: 'application/pdf',
      dossier_reference: 'DT-2024-001',
      statut: 'Validé',
      description: 'Demande officielle de terrain communal avec toutes les pièces justificatives',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z'
    },
    {
      id: 'DOC-002',
      nom: 'Copie CNI légalisée',
      type_document: 'identite',
      nom_fichier: 'cni_legalisee.pdf',
      taille_fichier: 850000, // 850 KB
      type_mime: 'application/pdf',
      dossier_reference: 'DT-2024-001',
      statut: 'Approuvé',
      description: 'Carte d\'identité nationale légalisée en mairie',
      created_at: '2024-01-15T11:15:00Z',
      updated_at: '2024-01-16T09:20:00Z'
    },
    {
      id: 'DOC-003',
      nom: 'Certificat de résidence',
      type_document: 'residence',
      nom_fichier: 'certificat_residence.pdf',
      taille_fichier: 650000, // 650 KB
      type_mime: 'application/pdf',
      dossier_reference: 'DT-2024-001',
      statut: 'En cours',
      description: 'Certificat de résidence délivré par les autorités locales',
      created_at: '2024-01-16T14:45:00Z',
      updated_at: '2024-01-16T14:45:00Z'
    },
    {
      id: 'DOC-004',
      nom: 'Justificatif de revenus',
      type_document: 'financier',
      nom_fichier: 'bulletin_salaire_dec2023.pdf',
      taille_fichier: 420000, // 420 KB
      type_mime: 'application/pdf',
      dossier_reference: 'DT-2024-001',
      statut: 'Validé',
      description: 'Bulletin de salaire de décembre 2023',
      created_at: '2024-01-18T08:30:00Z',
      updated_at: '2024-01-20T16:10:00Z'
    },
    {
      id: 'DOC-005',
      nom: 'Plans architecturaux préliminaires',
      type_document: 'technique',
      nom_fichier: 'plans_maison_r1.dwg',
      taille_fichier: 3200000, // 3.2 MB
      type_mime: 'application/dwg',
      dossier_reference: 'PC-2024-007',
      statut: 'En révision',
      description: 'Plans préliminaires de la maison R+1 avec jardin',
      created_at: '2024-01-22T16:20:00Z',
      updated_at: '2024-01-25T11:35:00Z'
    }
  ]);

  useEffect(() => {
    if (user?.id) {
      loadDocuments();
    }
  }, [user?.id]);



  const getFileIcon = (mimeType) => {
    if (mimeType?.includes('pdf')) return FileText;
    if (mimeType?.includes('image')) return FileImage;
    if (mimeType?.includes('sheet') || mimeType?.includes('excel')) return FileSpreadsheet;
    if (mimeType?.includes('word')) return FileText;
    return File;
  };

  const getStatusBadge = (statut) => {
    const configs = {
      'actif': { label: 'Actif', variant: 'default', icon: CheckCircle },
      'Validé': { label: 'Validé', variant: 'default', icon: CheckCircle },
      'Approuvé': { label: 'Approuvé', variant: 'default', icon: CheckCircle },
      'En cours': { label: 'En cours', variant: 'secondary', icon: Clock },
      'En révision': { label: 'En révision', variant: 'secondary', icon: AlertTriangle },
      'Rejeté': { label: 'Rejeté', variant: 'destructive', icon: AlertTriangle },
      'archive': { label: 'Archivé', variant: 'outline', icon: Archive }
    };

    const config = configs[statut] || configs.actif;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.dossier_reference?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'tous' || doc.type_document === filterType;

    return matchesSearch && matchesFilter;
  });

  const groupedDocuments = filteredDocuments.reduce((groups, doc) => {
    const key = doc.dossier_reference || 'Autres';
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
                <Label htmlFor="dossier">Dossier de référence (optionnel)</Label>
                <Input
                  id="dossier"
                  value={uploadForm.dossier_reference}
                  onChange={(e) => setUploadForm(prev => ({...prev, dossier_reference: e.target.value}))}
                  placeholder="Ex: DT-2024-001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optionnelle)</Label>
                <Input
                  id="description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({...prev, description: e.target.value}))}
                />
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
                  {documents.filter(d => d.statut === 'Validé' || d.statut === 'Approuvé').length}
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
                  {documents.filter(d => d.statut === 'En cours' || d.statut === 'En révision').length}
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
                <p className="text-sm text-slate-600">Dossiers</p>
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
                  placeholder="Rechercher par nom, description ou référence..."
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

      {/* Documents groupés par dossier */}
      <div className="space-y-6">
        {Object.keys(groupedDocuments).length > 0 ? (
          Object.entries(groupedDocuments).map(([dossier, docs]) => (
            <Card key={dossier}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Folder className="h-5 w-5 mr-2 text-blue-600" />
                  {dossier}
                  <Badge variant="outline" className="ml-2">
                    {docs.length} document{docs.length > 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {docs.map((document) => {
                    const FileIcon = getFileIcon(document.type_mime);
                    
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
                              {document.nom}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                              <span>{formatFileSize(document.taille_fichier)}</span>
                              <span>{formatDate(document.created_at)}</span>
                              {document.description && (
                                <span className="truncate">{document.description}</span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {getStatusBadge(document.statut)}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 ml-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadDocument(document)}
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
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  Search,
  Download,
  Upload,
  Eye,
  Filter,
  SortAsc,
  SortDesc,
  Archive,
  CheckCircle,
  Clock,
  FileImage,
  FileText as FilePdf,
  FileSpreadsheet,
  Folder,
  FolderOpen,
  Calendar,
  MapPin,
  Tag,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Déduit le format (extension) à partir de l'URL réelle, sinon du type
const getFormat = (url, type) => {
  if (url) {
    const clean = url.split('?')[0];
    const ext = clean.split('.').pop();
    if (ext && ext.length <= 5 && !ext.includes('/')) return ext.toUpperCase();
  }
  return (type || 'FICHIER').toUpperCase();
};

const getFileIcon = (format) => {
  switch ((format || '').toLowerCase()) {
    case 'pdf': return FilePdf;
    case 'docx':
    case 'doc': return FileText;
    case 'xlsx':
    case 'xls':
    case 'csv': return FileSpreadsheet;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp': return FileImage;
    default: return FileText;
  }
};

// Libellé + couleur d'après le status réel (documents.status)
const getStatusMeta = (statut) => {
  switch ((statut || '').toLowerCase()) {
    case 'validated':
    case 'valide':
    case 'validé':
    case 'approved':
    case 'approuvé': return { label: 'Validé', color: 'bg-green-100 text-green-800' };
    case 'in_progress':
    case 'en_cours': return { label: 'En cours', color: 'bg-blue-100 text-blue-800' };
    case 'pending':
    case 'en_attente': return { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' };
    case 'rejected':
    case 'refuse':
    case 'refusé':
    case 'expired':
    case 'expiré': return { label: 'Refusé / Expiré', color: 'bg-red-100 text-red-800' };
    case 'draft':
    case 'brouillon': return { label: 'Brouillon', color: 'bg-gray-100 text-gray-800' };
    default: return { label: statut || 'Non défini', color: 'bg-gray-100 text-gray-800' };
  }
};

const isValidatedStatus = (s) =>
  ['validated', 'valide', 'validé', 'approved', 'approuvé'].includes((s || '').toLowerCase());
const isPendingStatus = (s) =>
  ['pending', 'en_attente', 'in_progress', 'en_cours', 'draft', 'brouillon'].includes((s || '').toLowerCase());

const formatDate = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('fr-FR');
  } catch {
    return '—';
  }
};

const AgentFoncierDocuments = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [activeTab, setActiveTab] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    const loadDocuments = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Documents de l'agent : documents filtré par owner_id
        const { data: docs, error } = await supabase
          .from('documents')
          .select('id, owner_id, property_id, name, type, url, status, created_at')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const list = docs || [];

        // Localisation réelle via la propriété liée (property_id -> properties.location)
        const propIds = [...new Set(list.map((d) => d.property_id).filter(Boolean))];
        let locationByProperty = {};
        if (propIds.length > 0) {
          const { data: props } = await supabase
            .from('properties')
            .select('id, title, location, city, region')
            .in('id', propIds);
          (props || []).forEach((p) => {
            locationByProperty[p.id] =
              p.location || [p.city, p.region].filter(Boolean).join(', ') || p.title || null;
          });
        }

        setDocuments(
          list.map((d) => ({
            id: d.id,
            nom: d.name || 'Document sans nom',
            type: d.type || 'Document',
            format: getFormat(d.url, d.type),
            url: d.url || null,
            statut: d.status || null,
            date: d.created_at,
            location: d.property_id ? locationByProperty[d.property_id] || null : null
          }))
        );
      } catch (e) {
        console.error('Erreur chargement documents agent:', e);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [user?.id]);

  // Statistiques réelles calculées sur les documents chargés
  const now = Date.now();
  const totalDocuments = documents.length;
  const enAttente = documents.filter((d) => isPendingStatus(d.statut)).length;
  const valides = documents.filter((d) => isValidatedStatus(d.statut)).length;
  const recents = documents.filter(
    (d) => d.date && new Date(d.date).getTime() > now - 30 * 24 * 60 * 60 * 1000
  ).length;

  const documentStats = [
    { title: 'Total Documents', value: totalDocuments, icon: FileText, color: 'bg-blue-100 text-blue-600' },
    { title: 'En Attente', value: enAttente, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Validés', value: valides, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
    { title: 'Récents (30j)', value: recents, icon: Sparkles, color: 'bg-purple-100 text-purple-600' }
  ];

  // Dossiers = regroupement réel par type de document
  const folders = Object.entries(
    documents.reduce((acc, d) => {
      const key = d.type || 'Autres';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  ).map(([nom, count]) => ({ nom, count }));

  const filteredDocuments = documents
    .filter((doc) => {
      if (activeTab === 'recents') {
        return doc.date && new Date(doc.date).getTime() > now - 30 * 24 * 60 * 60 * 1000;
      }
      if (activeTab === 'en_attente') return isPendingStatus(doc.statut);
      if (activeTab === 'valides') return isValidatedStatus(doc.statut);
      return true; // 'tous'
    })
    .filter((doc) => (selectedFolder ? doc.type === selectedFolder : true))
    .filter((doc) => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        doc.nom.toLowerCase().includes(q) ||
        (doc.type || '').toLowerCase().includes(q) ||
        (doc.location || '').toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      if (sortBy === 'nom') return order * a.nom.localeCompare(b.nom);
      if (sortBy === 'date') return order * (new Date(a.date || 0) - new Date(b.date || 0));
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gray-50 p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <FileText className="h-8 w-8 mr-3 text-blue-600" />
            Gestion Documents
          </h1>
          <p className="text-gray-600">Centre de gestion documentaire foncière</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Document
          </Button>
        </div>
      </div>

      {/* Statistiques Documents (réelles) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {documentStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Dossiers (types réels) */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <Folder className="h-4 w-4 mr-2" />
                Dossiers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {folders.length === 0 ? (
                <div className="text-center py-6 text-sm text-gray-500">
                  <Folder className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  Aucun dossier
                </div>
              ) : (
                <div className="space-y-2">
                  {folders.map((folder, index) => {
                    const Icon = selectedFolder === folder.nom ? FolderOpen : Folder;
                    return (
                      <motion.button
                        key={folder.nom}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() =>
                          setSelectedFolder(folder.nom === selectedFolder ? null : folder.nom)
                        }
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedFolder === folder.nom
                            ? 'bg-green-50 border border-green-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-blue-600" />
                            <div>
                              <div className="font-medium text-sm text-gray-900">{folder.nom}</div>
                              <div className="text-xs text-gray-500">
                                {folder.count} document{folder.count > 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-3 py-1"
                  >
                    <option value="date">Date</option>
                    <option value="nom">Nom</option>
                  </select>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="tous">Tous</TabsTrigger>
                  <TabsTrigger value="recents">Récents</TabsTrigger>
                  <TabsTrigger value="en_attente">En attente</TabsTrigger>
                  <TabsTrigger value="valides">Validés</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {filteredDocuments.map((doc, index) => {
                  const FileIcon = getFileIcon(doc.format);
                  const statusMeta = getStatusMeta(doc.statut);

                  return (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-green-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gray-100">
                            <FileIcon className="h-6 w-6 text-gray-600" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 truncate">{doc.nom}</h4>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                <span className="truncate">{doc.type}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{doc.location || '—'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(doc.date)}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={statusMeta.color} variant="secondary">
                                {statusMeta.label}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {doc.format}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 ml-4">
                          <div className="flex gap-1">
                            {doc.url && (
                              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" title="Prévisualiser">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </a>
                            )}
                            {doc.url && (
                              <a href={doc.url} download>
                                <Button variant="ghost" size="sm" title="Télécharger">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {filteredDocuments.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {documents.length === 0 ? 'Aucun document' : 'Aucun document trouvé'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {documents.length === 0
                        ? "Vous n'avez pas encore de document. Importez-en un pour commencer."
                        : 'Aucun document ne correspond à vos critères de recherche'}
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un document
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentFoncierDocuments;

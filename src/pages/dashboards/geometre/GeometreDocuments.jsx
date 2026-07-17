import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Share2,
  Calendar,
  CheckCircle,
  FolderOpen,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Normalise une ligne `documents` en objet d'affichage.
// Colonnes réelles : name, type, url, status, owner_id, property_id, created_at.
// Tout champ absent du schéma (taille, client, confidentialité) reste "—" : jamais inventé.
const mapDocument = (row) => {
  const createdLabel = row.created_at
    ? new Date(row.created_at).toLocaleDateString('fr-FR')
    : '—';

  // Format déduit de l'extension réelle du fichier (url/name), sinon "—".
  const source = row.url || row.name || '';
  const extMatch = source.match(/\.([a-zA-Z0-9]{1,5})(?:\?|$)/);
  const format = extMatch ? extMatch[1].toUpperCase() : '—';

  return {
    id: row.id,
    name: row.name || 'Document sans titre',
    type: row.type || 'autre',
    // La catégorie de filtrage s'appuie sur le `type` réel du document.
    category: row.type || 'autre',
    url: row.url || null,
    property_id: row.property_id || null,
    status: row.status || 'complete',
    format,
    createdAt: row.created_at || null,
    dateLabel: createdLabel,
    // Champs non présents dans le schéma `documents` -> état honnête.
    size: '—',
    client: '—'
  };
};

const GeometreDocuments = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDocuments((data || []).map(mapDocument));
      } catch (err) {
        console.error('Erreur chargement documents:', err);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [user?.id]);

  // Catégories construites à partir des types réellement présents en base.
  const categories = useMemo(() => {
    const types = Array.from(new Set(documents.map(d => d.type).filter(Boolean)));
    return [
      { value: 'all', label: 'Tous les documents' },
      ...types.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))
    ];
  }, [documents]);

  const statusColors = {
    'complete': 'bg-green-100 text-green-800',
    'completed': 'bg-green-100 text-green-800',
    'validated': 'bg-emerald-100 text-emerald-800',
    'approuvé': 'bg-emerald-100 text-emerald-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'en_cours': 'bg-blue-100 text-blue-800',
    'revision': 'bg-orange-100 text-orange-800',
    'pending': 'bg-purple-100 text-purple-800',
    'draft': 'bg-gray-100 text-gray-800',
    'rejected': 'bg-red-100 text-red-800',
    'cancelled': 'bg-red-100 text-red-800'
  };

  const isInProgress = (s) => ['in_progress', 'en_cours', 'revision', 'pending'].includes(s);
  const isFinalized = (s) => ['complete', 'completed', 'validated', 'approuvé'].includes(s);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const DocumentCard = ({ document: doc }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-blue-600" />
        </div>
        <Badge className={statusColors[doc.status] || 'bg-gray-100 text-gray-800'}>
          {String(doc.status).replace('_', ' ')}
        </Badge>
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {doc.name}
      </h3>

      <div className="space-y-1 text-sm text-gray-600 mb-3">
        <p>Type: {doc.type}</p>
        <p>Format: {doc.format} • {doc.size}</p>
        <p>Créé: {doc.dateLabel}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex space-x-2">
          {doc.url ? (
            <>
              <Button size="sm" variant="outline" asChild>
                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4" />
                </a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={doc.url} download>
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" variant="outline" disabled>
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" disabled>
                <Download className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button size="sm" variant="outline">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-1">
          <Button size="sm" variant="ghost">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-800">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600">Gestion centralisée de vos documents géométriques</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Upload className="h-4 w-4 mr-2" />
          Télécharger un document
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-blue-600">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-orange-600">
                  {documents.filter(d => isInProgress(d.status)).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Finalisés</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {documents.filter(d => isFinalized(d.status)).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taille totale</p>
                {/* Aucune colonne de taille dans `documents` -> état honnête */}
                <p className="text-2xl font-bold text-green-600">—</p>
              </div>
              <FolderOpen className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher des documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-60">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Plus de filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Onglets de contenu */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="recent">Récents</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Chargement des documents...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map(doc => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments
              .slice()
              .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
              .slice(0, 6)
              .map(doc => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {!loading && filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document trouvé</h3>
          <p className="text-gray-600">
            {documents.length === 0
              ? "Vous n'avez pas encore de documents. Téléchargez votre premier document."
              : 'Essayez de modifier vos critères de recherche'}
          </p>
        </div>
      )}
    </div>
  );
};

export default GeometreDocuments;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  Calendar,
  MapPin,
  User,
  Building,
  Folder,
  Eye,
  Edit,
  Trash2,
  Share,
  Archive,
  CheckCircle,
  Clock,
  AlertTriangle,
  PaperclipIcon,
  ImageIcon,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Modèles de rapports : catalogue statique (aucune table matériel/modèles réelle).
// Descriptif des modèles proposés — ne prétend à aucune métrique temps réel.
const reportTemplates = [
  {
    id: 1,
    name: 'Levé Topographique Standard',
    description: 'Modèle pour levés topographiques classiques',
    category: 'topographie'
  },
  {
    id: 2,
    name: 'Plan Cadastral Officiel',
    description: 'Modèle conforme aux normes cadastrales',
    category: 'cadastre'
  },
  {
    id: 3,
    name: 'Certificat de Bornage',
    description: 'Modèle standard de bornage',
    category: 'bornage'
  }
];

const GeometreRapports = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        // Rapports/documents du géomètre (owner_id) + propriété liée pour la localisation
        const { data, error } = await supabase
          .from('documents')
          .select('*, properties(title, name, location)')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReports(data || []);
      } catch (err) {
        console.error('Erreur chargement rapports:', err);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [user?.id]);

  // Un statut est-il considéré comme finalisé/terminé ?
  const isCompleted = (status) => {
    const s = (status || '').toLowerCase();
    return ['completed', 'terminé', 'termine', 'valide', 'validé', 'finalisé', 'finalise', 'approuvé', 'approuve', 'signé', 'signe'].includes(s);
  };

  // Libellé lisible du statut réel (vocabulaire variable en base)
  const getStatusLabel = (status) => {
    if (!status) return '—';
    const s = status.toLowerCase();
    if (['completed', 'terminé', 'termine', 'finalisé', 'finalise'].includes(s)) return 'Terminé';
    if (['in_progress', 'en_cours', 'en cours'].includes(s)) return 'En cours';
    if (['pending', 'en_attente', 'draft', 'brouillon'].includes(s)) return 'En attente';
    if (['review', 'révision', 'revision'].includes(s)) return 'En révision';
    if (['cancelled', 'annulé', 'annule'].includes(s)) return 'Annulé';
    return status;
  };

  const getStatusColor = (status) => {
    const label = getStatusLabel(status);
    switch (label) {
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'En attente': return 'bg-gray-100 text-gray-800';
      case 'En révision': return 'bg-yellow-100 text-yellow-800';
      case 'Annulé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    const label = getStatusLabel(status);
    switch (label) {
      case 'Terminé': return <CheckCircle className="w-4 h-4" />;
      case 'En cours': return <Clock className="w-4 h-4" />;
      case 'En révision': return <Edit className="w-4 h-4" />;
      case 'Annulé': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = () => 'bg-blue-100 text-blue-800';

  // Localisation réelle depuis la propriété liée (sinon état honnête)
  const getLocation = (report) => report.properties?.location || '—';

  // Format déduit de l'extension réelle du fichier (url/name), sinon état honnête
  const getFormat = (report) => {
    const source = report.url || report.name || '';
    const match = source.match(/\.([a-z0-9]{2,5})(?:\?|$)/i);
    return match ? match[1].toUpperCase() : '—';
  };

  // Statistiques agrégées à partir des VRAIES données (aucun chiffre fabriqué)
  const now = new Date();
  const reportStats = {
    totalReports: reports.length,
    thisMonth: reports.filter(r => {
      const d = new Date(r.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
    pending: reports.filter(r => !isCompleted(r.status)).length,
    completed: reports.filter(r => isCompleted(r.status)).length
  };

  // Catégories dynamiques dérivées des VRAIS types présents en base
  const categoryCounts = reports.reduce((acc, r) => {
    const key = r.type || 'autre';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const categories = Object.keys(categoryCounts).sort();

  const filteredReports = reports.filter(report => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (report.name || '').toLowerCase().includes(term) ||
      getLocation(report).toLowerCase().includes(term) ||
      (report.type || '').toLowerCase().includes(term);
    const matchesCategory = selectedCategory === 'all' || (report.type || 'autre') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rapports & Documents</h1>
            <p className="text-gray-600">Gestion de vos rapports et documents techniques</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Importer
            </Button>
            <Button size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Nouveau rapport
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rapports</p>
                  <p className="text-2xl font-bold text-gray-900">{reportStats.totalReports}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ce Mois</p>
                  <p className="text-2xl font-bold text-gray-900">{reportStats.thisMonth}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold text-gray-900">{reportStats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Terminés</p>
                  <p className="text-2xl font-bold text-gray-900">{reportStats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Liste des rapports */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Mes Rapports</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filtres par catégorie (types réels présents en base) */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                  >
                    Tous ({reportStats.totalReports})
                  </Button>
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat} ({categoryCounts[cat]})
                    </Button>
                  ))}
                </div>

                {/* Liste des rapports */}
                {loading ? (
                  <div className="flex items-center justify-center py-12 text-gray-500">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Chargement des rapports...
                  </div>
                ) : filteredReports.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rapport</h3>
                    <p className="text-gray-600">
                      Vos rapports et documents techniques apparaîtront ici.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReports.map((report) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{report.name || 'Document sans titre'}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {getLocation(report)}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {formatDate(report.created_at)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {report.type && (
                              <Badge className={getCategoryColor()}>
                                {report.type}
                              </Badge>
                            )}
                            <Badge className={getStatusColor(report.status)}>
                              {getStatusIcon(report.status)}
                              <span className="ml-1">{getStatusLabel(report.status)}</span>
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                          <div>
                            <span className="text-gray-500">Type:</span>
                            <span className="ml-1 font-medium">{report.type || '—'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Format:</span>
                            <span className="ml-1 font-medium">{getFormat(report)}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end">
                          <div className="flex space-x-2">
                            {report.url && (
                              <>
                                <Button variant="outline" size="sm" asChild>
                                  <a href={report.url} target="_blank" rel="noopener noreferrer">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Voir
                                  </a>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                  <a href={report.url} download>
                                    <Download className="w-4 h-4 mr-2" />
                                    Télécharger
                                  </a>
                                </Button>
                              </>
                            )}
                            <Button variant="outline" size="sm">
                              <Share className="w-4 h-4 mr-2" />
                              Partager
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Modèles (catalogue statique) */}
            <Card>
              <CardHeader>
                <CardTitle>Modèles de Rapports</CardTitle>
                <CardDescription>Modèles types proposés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-1">{template.name}</h4>
                      <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                      <Button size="sm" className="w-full mt-2">
                        Utiliser
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Nouveau rapport
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Importer documents
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Archive className="w-4 h-4 mr-2" />
                    Archiver anciens
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export groupé
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeometreRapports;

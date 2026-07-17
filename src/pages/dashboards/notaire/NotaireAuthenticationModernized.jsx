import React, { useState, useEffect } from 'react';
import {
  Stamp,
  Shield,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Search,
  RefreshCw,
  Copy,
  Award
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import supabase from '@/lib/supabaseClient';

const NotaireAuthenticationModernized = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [authentications, setAuthentications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Statuts d'authentification (verification_status réel : pending | verified | rejected)
  const statusOptions = [
    { value: 'all', label: 'Tous les statuts', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'verified', label: 'Vérifié', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejeté', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    if (user) {
      loadAuthenticationData();
    }
  }, [user]);

  const loadAuthenticationData = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const [authResult, docsResult] = await Promise.all([
        supabase
          .from('document_authentication')
          .select('id, document_name, document_type, verification_status, authenticity_hash, verified_at, created_at, property_id')
          .eq('notaire_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('documents')
          .select('id, name, type, status, url, property_id, created_at')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false })
      ]);

      if (authResult.error) throw authResult.error;
      if (docsResult.error) throw docsResult.error;

      setAuthentications(authResult.data || []);
      setDocuments(docsResult.data || []);
    } catch (error) {
      console.error('Erreur chargement authentification:', error);
      window.safeGlobalToast?.({
        title: "Erreur de chargement",
        description: "Impossible de charger les données d'authentification",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthenticateDocument = async (doc) => {
    if (!user?.id) return;
    try {
      // Enregistre une demande d'authentification. Le hash d'authenticité est
      // calculé/apposé côté serveur lors de la vérification réelle — on ne
      // fabrique aucun hash ici.
      const { error } = await supabase
        .from('document_authentication')
        .insert({
          notaire_id: user.id,
          property_id: doc.property_id || null,
          document_name: doc.name || 'Document',
          document_type: doc.type || null,
          verification_status: 'pending',
          authenticity_hash: null
        });

      if (error) throw error;

      await loadAuthenticationData();
      window.safeGlobalToast?.({
        title: "Authentification demandée",
        description: "Le document a été soumis pour vérification d'authenticité",
        variant: "success"
      });
    } catch (error) {
      console.error('Erreur authentification:', error);
      window.safeGlobalToast?.({
        title: "Erreur d'authentification",
        description: "Impossible de soumettre le document",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption || statusOptions[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      window.safeGlobalToast?.({
        title: "Copié",
        description: "Hash copié dans le presse-papiers",
        variant: "success"
      });
    } catch (error) {
      console.error('Erreur copie:', error);
    }
  };

  // Filtrage
  const filteredAuthentications = authentications.filter(auth => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = auth.document_name?.toLowerCase().includes(term) ||
                         auth.authenticity_hash?.toLowerCase().includes(term);
    const matchesFilter = statusFilter === 'all' || auth.verification_status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const verifiedCount = authentications.filter(a => a.verification_status === 'verified').length;
  const pendingCount = authentications.filter(a => a.verification_status === 'pending').length;
  const rejectedCount = authentications.filter(a => a.verification_status === 'rejected').length;
  const successRate = authentications.length > 0
    ? Math.round((verifiedCount / authentications.length) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Authentification des Documents</h2>
          <p className="text-gray-600">Vérification et authentification des documents notariaux</p>
        </div>
        <Button onClick={loadAuthenticationData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Statistiques d'authentification */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Authentifiés</p>
                <p className="text-2xl font-bold text-gray-900">{verifiedCount}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejetés</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de succès</p>
                <p className="text-2xl font-bold text-gray-900">{successRate}%</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerte sécurité */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          L'authentification garantit l'intégrité et la traçabilité de vos documents notariaux.
          Chaque document vérifié reçoit une empreinte cryptographique (hash d'authenticité) inaltérable.
        </AlertDescription>
      </Alert>

      {/* Filtres */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom de document ou hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="authentications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="authentications">Authentifications ({filteredAuthentications.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
        </TabsList>

        {/* Onglet Authentifications */}
        <TabsContent value="authentications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des Authentifications</CardTitle>
              <CardDescription>
                Toutes les demandes de vérification d'authenticité de vos documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAuthentications.length === 0 ? (
                <div className="text-center py-12">
                  <Stamp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune authentification trouvée</h3>
                  <p className="text-gray-600">
                    {authentications.length === 0
                      ? "Vous n'avez pas encore d'authentification de documents."
                      : "Aucune authentification ne correspond à vos critères."
                    }
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Document</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Hash d'authenticité</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAuthentications.map((auth) => {
                        const statusBadge = getStatusBadge(auth.verification_status);
                        return (
                          <TableRow key={auth.id}>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span className="font-medium">{auth.document_name || 'Document'}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {auth.document_type || '—'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={statusBadge.color}>
                                {statusBadge.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {auth.authenticity_hash ? (
                                <div className="flex items-center space-x-2">
                                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {auth.authenticity_hash.substring(0, 10)}...
                                  </code>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(auth.authenticity_hash)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {formatDate(auth.verified_at || auth.created_at)}
                            </TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Documents */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents Disponibles</CardTitle>
              <CardDescription>
                Liste des documents prêts pour l'authentification
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document disponible</h3>
                  <p className="text-gray-600">
                    Aucun document n'est disponible pour l'authentification.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{doc.name || 'Document'}</h3>
                              <p className="text-sm text-gray-600">{doc.type || '—'}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Statut:</span>
                            <Badge variant="outline">{doc.status || '—'}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Ajouté le:</span>
                            <span>{formatDate(doc.created_at)}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleAuthenticateDocument(doc)}
                          >
                            <Stamp className="h-4 w-4 mr-2" />
                            Authentifier
                          </Button>
                          {doc.url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(doc.url, '_blank')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotaireAuthenticationModernized;

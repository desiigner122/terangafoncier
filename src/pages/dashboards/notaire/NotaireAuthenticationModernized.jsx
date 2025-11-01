import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Stamp, 
  Shield, 
  FileText, 
  Upload, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  Hash,
  Lock,
  Unlock,
  Link,
  Search,
  Filter,
  Plus,
  RefreshCw,
  ExternalLink,
  Copy,
  Settings,
  Zap,
  Award,
  Calculator,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  DollarSign
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import NotaireSupabaseService from '@/services/NotaireSupabaseService';

const NotaireAuthenticationModernized = () => {
  const { dashboardStats } = useOutletContext();
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [authentications, setAuthentications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [authStats, setAuthStats] = useState({
    totalDocuments: 0,
    authenticatedDocs: 0,
    pendingAuth: 0,
    blockchainCost: 0,
    successRate: 0
  });

  // Statuts d'authentification
  const statusOptions = [
    { value: 'all', label: 'Tous les statuts', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'verified', label: 'Vérifié', color: 'bg-green-100 text-green-800' },
    { value: 'failed', label: 'Échec', color: 'bg-red-100 text-red-800' },
    { value: 'expired', label: 'Expiré', color: 'bg-gray-100 text-gray-800' }
  ];

  // Chargement des données
  useEffect(() => {
    if (user) {
      loadAuthenticationData();
    }
  }, [user]);

  const loadAuthenticationData = async () => {
    setIsLoading(true);
    try {
      const [docsResult, authResult, statsResult] = await Promise.all([
        NotaireSupabaseService.getNotarialDocuments(user.id),
        NotaireSupabaseService.getDocumentAuthentications(user.id),
        NotaireSupabaseService.getAuthenticationStats(user.id)
      ]);

      if (docsResult.success) {
        setDocuments(docsResult.data || []);
      }
      if (authResult.success) {
        setAuthentications(authResult.data || []);
      }
      if (statsResult.success) {
        setAuthStats(statsResult.data || authStats);
      }
    } catch (error) {
      console.error('Erreur chargement authentification:', error);
      window.safeGlobalToast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données d'authentification",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthenticateDocument = async (documentId) => {
    try {
      const result = await NotaireSupabaseService.authenticateDocument(user.id, documentId);
      if (result.success) {
        await loadAuthenticationData();
        window.safeGlobalToast({
          title: "Authentification lancée",
          description: "Le document est en cours d'authentification blockchain",
          variant: "success"
        });
      }
    } catch (error) {
      console.error('Erreur authentification:', error);
      window.safeGlobalToast({
        title: "Erreur d'authentification",
        description: "Impossible d'authentifier le document",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption || statusOptions[0];
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 FCFA';
    return `${amount.toLocaleString()} FCFA`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      window.safeGlobalToast({
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
    const matchesSearch = auth.document_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         auth.transaction_hash?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || auth.verification_status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Authentification Blockchain</h2>
          <p className="text-gray-600">Authentification sécurisée des documents notariaux</p>
        </div>
        <Button onClick={loadAuthenticationData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Statistiques d'authentification */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{documents.length}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Authentifiés</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {authentications.filter(a => a.verification_status === 'verified').length}
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">En attente</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {authentications.filter(a => a.verification_status === 'pending').length}
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Taux de succès</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {authentications.length > 0 
                    ? Math.round((authentications.filter(a => a.verification_status === 'verified').length / authentications.length) * 100)
                    : 0
                  }%
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Coût Total</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {formatCurrency(authentications.reduce((sum, a) => sum + (a.total_cost || 0), 0))}
                </p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerte blockchain */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          L'authentification blockchain garantit l'intégrité et la traçabilité de vos documents notariaux sur le réseau Polygon.
          Chaque authentification génère une preuve cryptographique inaltérable.
        </AlertDescription>
      </Alert>

      {/* Filtres */}
      <Card>
        <CardContent className="p-3 sm:p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
      <Tabs defaultValue="authentications" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="authentications">Authentifications ({filteredAuthentications.length})</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
        </TabsList>

        {/* Onglet Authentifications */}
        <TabsContent value="authentications" className="space-y-4 sm:space-y-6">
          {/* Simulateur de coût et statistiques blockchain */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Simulateur de Coût Blockchain</span>
                </CardTitle>
                <CardDescription>
                  Estimez le coût d'authentification de vos documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-sm font-medium">Type de document</Label>
                    <Select defaultValue="acte-vente">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acte-vente">Acte de vente</SelectItem>
                        <SelectItem value="contrat">Contrat</SelectItem>
                        <SelectItem value="testament">Testament</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Réseau blockchain</Label>
                    <Select defaultValue="polygon">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="polygon">Polygon (Rapide)</SelectItem>
                        <SelectItem value="ethereum">Ethereum (Sécurisé)</SelectItem>
                        <SelectItem value="bsc">BSC (Économique)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Coût estimé</span>
                    <span className="text-lg font-bold text-purple-600">0.25 MATIC</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">≈ Équivalent FCFA</span>
                    <span className="font-semibold">150 FCFA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Temps d'exécution</span>
                    <span className="text-sm font-medium">~30 secondes</span>
                  </div>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <Stamp className="h-4 w-4 mr-2" />
                  Authentifier maintenant
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>État du Réseau Blockchain</span>
                </CardTitle>
                <CardDescription>
                  Statut en temps réel des réseaux blockchain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { 
                    name: 'Polygon', 
                    status: 'Opérationnel', 
                    gasPrice: '35 Gwei', 
                    blockTime: '2.1s',
                    load: 65,
                    color: 'bg-green-500'
                  },
                  { 
                    name: 'Ethereum', 
                    status: 'Congestionné', 
                    gasPrice: '125 Gwei', 
                    blockTime: '12.8s',
                    load: 85,
                    color: 'bg-orange-500'
                  },
                  { 
                    name: 'BSC', 
                    status: 'Opérationnel', 
                    gasPrice: '8 Gwei', 
                    blockTime: '3.2s',
                    load: 45,
                    color: 'bg-green-500'
                  }
                ].map((network, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${network.color}`}></div>
                        <span className="font-medium">{network.name}</span>
                      </div>
                      <Badge variant={network.status === 'Opérationnel' ? 'default' : 'secondary'}>
                        {network.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Gas Price:</span>
                        <span className="ml-2 font-medium">{network.gasPrice}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Block Time:</span>
                        <span className="ml-2 font-medium">{network.blockTime}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Charge réseau</span>
                        <span>{network.load}%</span>
                      </div>
                      <Progress value={network.load} className="h-1" />
                    </div>
                  </div>
                ))}

                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Recommandation</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Utilisez <strong>Polygon</strong> pour des coûts optimaux avec une bonne vitesse.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historique des Authentifications</CardTitle>
              <CardDescription>
                Toutes les authentifications blockchain de vos documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAuthentications.length === 0 ? (
                <div className="text-center py-12">
                  <Stamp className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune authentification trouvée</h3>
                  <p className="text-gray-600">
                    {authentications.length === 0
                      ? "Vous n'avez pas encore d'authentifications blockchain."
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
                        <TableHead>Statut</TableHead>
                        <TableHead>Hash Transaction</TableHead>
                        <TableHead>Réseau</TableHead>
                        <TableHead>Coût</TableHead>
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
                              <Badge className={statusBadge.color}>
                                {statusBadge.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {auth.transaction_hash ? (
                                <div className="flex items-center space-x-2">
                                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {auth.transaction_hash.substring(0, 10)}...
                                  </code>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(auth.transaction_hash)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {auth.blockchain_network || 'Polygon'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {formatCurrency(auth.total_cost)}
                            </TableCell>
                            <TableCell>
                              {formatDate(auth.authenticated_at)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {auth.transaction_hash && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => window.open(`https://polygonscan.com/tx/${auth.transaction_hash}`, '_blank')}
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
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
                  <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document disponible</h3>
                  <p className="text-gray-600">
                    Aucun document n'est disponible pour l'authentification.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-3 sm:p-4 lg:p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{doc.document_name}</h3>
                              <p className="text-sm text-gray-600">{doc.document_type}</p>
                            </div>
                          </div>
                          <Badge className={doc.authenticated ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {doc.authenticated ? 'Authentifié' : 'Non authentifié'}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Statut:</span>
                            <Badge variant="outline">{doc.status}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Taille:</span>
                            <span>{doc.file_size ? `${(doc.file_size / 1024).toFixed(1)} KB` : 'N/A'}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Upload:</span>
                            <span>{formatDate(doc.upload_date)}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleAuthenticateDocument(doc.id)}
                            disabled={doc.authenticated}
                          >
                            <Stamp className="h-4 w-4 mr-2" />
                            {doc.authenticated ? 'Authentifié' : 'Authentifier'}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Analytics */}
        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {/* Graphique des authentifications par mois */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Authentifications par mois</span>
                </CardTitle>
                <CardDescription>
                  Évolution de vos authentifications blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: 'Octobre', count: 28, growth: '+15%' },
                    { month: 'Septembre', count: 24, growth: '+8%' },
                    { month: 'Août', count: 22, growth: '+12%' },
                    { month: 'Juillet', count: 19, growth: '+5%' }
                  ].map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 text-sm font-medium">{data.month}</div>
                        <div className="flex-1">
                          <Progress value={(data.count / 30) * 100} className="h-2" />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{data.count}</span>
                        <Badge variant="outline" className="text-green-600">
                          {data.growth}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Répartition par type de document */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Types de documents</span>
                </CardTitle>
                <CardDescription>
                  Répartition de vos authentifications par type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'Actes de vente', count: 45, percentage: 45, color: 'bg-blue-500' },
                    { type: 'Contrats', count: 28, percentage: 28, color: 'bg-green-500' },
                    { type: 'Testaments', count: 15, percentage: 15, color: 'bg-purple-500' },
                    { type: 'Autres', count: 12, percentage: 12, color: 'bg-gray-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${item.color}`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{item.type}</span>
                          <span className="text-sm text-gray-600">{item.count}</span>
                        </div>
                        <Progress value={item.percentage} className="h-1" />
                      </div>
                      <span className="text-sm font-semibold">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Coûts et économies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Analyse des coûts</span>
                </CardTitle>
                <CardDescription>
                  Optimisation et économies blockchain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">2,450 FCFA</div>
                    <div className="text-sm text-green-700">Économisé ce mois</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">8,750 FCFA</div>
                    <div className="text-sm text-blue-700">Coût total</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Coût moyen par auth.</span>
                    <span className="font-semibold">125 FCFA</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Réseau le plus utilisé</span>
                    <span className="font-semibold text-purple-600">Polygon</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Temps moyen</span>
                    <span className="font-semibold">45 secondes</span>
                  </div>
                </div>

                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    Vous économisez 23% en utilisant Polygon au lieu d'Ethereum.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Fiabilité et performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Performance & Fiabilité</span>
                </CardTitle>
                <CardDescription>
                  Indicateurs de qualité de service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Taux de succès</span>
                      <span className="text-sm font-semibold text-green-600">99.2%</span>
                    </div>
                    <Progress value={99.2} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Vitesse moyenne</span>
                      <span className="text-sm font-semibold text-blue-600">⚡ Excellent</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Sécurité</span>
                      <span className="text-sm font-semibold text-purple-600">🛡️ Maximale</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-600">0</div>
                    <div className="text-xs text-green-700">Échecs</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-600">93</div>
                    <div className="text-xs text-blue-700">Succès</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotaireAuthenticationModernized;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Stamp, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download, 
  Upload,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  Star,
  Zap,
  Lock,
  Unlock,
  FileText,
  Image,
  Film,
  Music,
  Archive,
  Hash,
  Fingerprint,
  Award,
  Edit,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NotaireAuthentication = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const documentsPerPage = 10;

  // Statuts d'authentification
  const authStatuses = [
    { value: 'all', label: 'Tous les statuts', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'verifying', label: 'Vérification', color: 'bg-blue-100 text-blue-800' },
    { value: 'authenticated', label: 'Authentifié', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejeté', color: 'bg-red-100 text-red-800' },
    { value: 'expired', label: 'Expiré', color: 'bg-orange-100 text-orange-800' }
  ];

  // Types de documents
  const documentTypes = [
    { value: 'titre_propriete', label: 'Titre de propriété', icon: FileText },
    { value: 'acte_vente', label: 'Acte de vente', icon: FileText },
    { value: 'testament', label: 'Testament', icon: FileText },
    { value: 'procuration', label: 'Procuration', icon: FileText },
    { value: 'certificat', label: 'Certificat', icon: Award },
    { value: 'plan_cadastral', label: 'Plan cadastral', icon: Image },
    { value: 'photo', label: 'Photo/Image', icon: Image },
    { value: 'autre', label: 'Autre', icon: Archive }
  ];

  // Données simulées des documents
  const mockDocuments = [
    {
      id: 'DOC-001',
      name: 'Titre propriété Villa Almadies',
      type: 'titre_propriete',
      client: 'Famille Diallo',
      status: 'authenticated',
      uploadDate: '2024-01-15',
      authDate: '2024-01-16',
      fileSize: '2.4 MB',
      fileType: 'PDF',
      blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      notarySignature: 'Signature numérique valide',
      securityLevel: 'high',
      authenticity: 98,
      integrity: 100,
      confidentiality: 95
    },
    {
      id: 'DOC-002',
      name: 'Acte de vente Terrain Parcelles',
      type: 'acte_vente',
      client: 'M. Ndiaye',
      status: 'verifying',
      uploadDate: '2024-01-18',
      authDate: null,
      fileSize: '1.8 MB',
      fileType: 'PDF',
      blockchainHash: null,
      notarySignature: 'En cours de vérification',
      securityLevel: 'medium',
      authenticity: 85,
      integrity: 92,
      confidentiality: 88
    },
    {
      id: 'DOC-003',
      name: 'Testament Succession Seck',
      type: 'testament',
      client: 'Héritiers Seck',
      status: 'pending',
      uploadDate: '2024-01-20',
      authDate: null,
      fileSize: '1.2 MB',
      fileType: 'PDF',
      blockchainHash: null,
      notarySignature: 'En attente',
      securityLevel: 'high',
      authenticity: 0,
      integrity: 0,
      confidentiality: 0
    },
    {
      id: 'DOC-004',
      name: 'Plan cadastral Lot 456',
      type: 'plan_cadastral',
      client: 'SARLU Teranga',
      status: 'rejected',
      uploadDate: '2024-01-22',
      authDate: '2024-01-23',
      fileSize: '5.6 MB',
      fileType: 'PDF',
      blockchainHash: null,
      notarySignature: 'Signature invalide',
      securityLevel: 'low',
      authenticity: 45,
      integrity: 67,
      confidentiality: 78
    }
  ];

  useEffect(() => {
    setDocuments(mockDocuments);
    setFilteredDocuments(mockDocuments);
  }, []);

  // Filtrage des documents
  useEffect(() => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    setFilteredDocuments(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, documents]);

  // Pagination
  const totalPages = Math.ceil(filteredDocuments.length / documentsPerPage);
  const startIndex = (currentPage - 1) * documentsPerPage;
  const paginatedDocuments = filteredDocuments.slice(startIndex, startIndex + documentsPerPage);

  // Handlers
  const handleAuthenticateDocument = (documentId) => {
    setIsLoading(true);
    setTimeout(() => {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { 
                ...doc, 
                status: 'authenticated',
                authDate: new Date().toISOString().split('T')[0],
                blockchainHash: '0x' + Math.random().toString(16).substr(2, 40),
                authenticity: 95 + Math.random() * 5,
                integrity: 95 + Math.random() * 5,
                confidentiality: 90 + Math.random() * 10
              }
            : doc
        )
      );
      window.safeGlobalToast({
        title: "Document authentifié",
        description: `Document ${documentId} authentifié avec succès`,
        variant: "success"
      });
      setIsLoading(false);
    }, 2000);
  };

  const handleRejectDocument = (documentId) => {
    setIsLoading(true);
    setTimeout(() => {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { 
                ...doc, 
                status: 'rejected',
                authDate: new Date().toISOString().split('T')[0],
                notarySignature: 'Document rejeté - Non conforme'
              }
            : doc
        )
      );
      window.safeGlobalToast({
        title: "Document rejeté",
        description: `Document ${documentId} rejeté`,
        variant: "destructive"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    window.safeGlobalToast({
      title: "Document ouvert",
      description: `Consultation du document ${document.id}`,
      variant: "success"
    });
  };

  const handleDownloadDocument = (documentId) => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Téléchargement démarré",
        description: `Téléchargement du document ${documentId}`,
        variant: "success"
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleBulkAuthentication = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Authentification en lot",
        description: "Traitement par lot des documents en attente",
        variant: "success"
      });
      setIsLoading(false);
    }, 3000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'verifying': return <Zap className="h-4 w-4" />;
      case 'authenticated': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    const statusOption = authStatuses.find(s => s.value === status);
    return statusOption ? statusOption.color : 'bg-gray-100 text-gray-800';
  };

  const getSecurityLevelColor = (level) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentTypeIcon = (type) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType ? docType.icon : FileText;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Authentification de Documents</h2>
          <p className="text-gray-600 mt-1">
            Vérification et authentification numérique des documents notariaux
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button 
            variant="outline"
            onClick={handleBulkAuthentication}
            disabled={isLoading}
          >
            <Stamp className="h-4 w-4 mr-2" />
            Authentification en lot
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => setShowUploadDialog(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Nouveau Document
          </Button>
        </div>
      </div>

      {/* Statistiques d'authentification */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Authentifiés</p>
                <p className="text-2xl font-bold text-green-600">
                  {documents.filter(d => d.status === 'authenticated').length}
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
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {documents.filter(d => d.status === 'verifying' || d.status === 'pending').length}
                </p>
              </div>
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux succès</p>
                <p className="text-2xl font-bold text-purple-600">
                  {documents.length > 0 ? Math.round((documents.filter(d => d.status === 'authenticated').length / documents.length) * 100) : 0}%
                </p>
              </div>
              <Star className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  {authStatuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              {filteredDocuments.length} document(s) trouvé(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des documents */}
      <Card>
        <CardHeader>
          <CardTitle>Documents à Authentifier</CardTitle>
          <CardDescription>
            Gestion de l'authentification et vérification des documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Sécurité</TableHead>
                <TableHead>Authenticity</TableHead>
                <TableHead>Date Upload</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDocuments.map((document) => {
                const DocIcon = getDocumentTypeIcon(document.type);
                return (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <DocIcon className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{document.name}</p>
                          <p className="text-sm text-gray-500">
                            {document.fileSize} • {document.fileType}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {documentTypes.find(dt => dt.value === document.type)?.label}
                    </TableCell>
                    <TableCell>{document.client}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(document.status)}>
                        {getStatusIcon(document.status)}
                        <span className="ml-1">
                          {authStatuses.find(s => s.value === document.status)?.label}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSecurityLevelColor(document.securityLevel)}>
                        {document.securityLevel === 'high' && <Shield className="h-3 w-3 mr-1" />}
                        {document.securityLevel === 'medium' && <Lock className="h-3 w-3 mr-1" />}
                        {document.securityLevel === 'low' && <Unlock className="h-3 w-3 mr-1" />}
                        {document.securityLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={document.authenticity} className="w-16 h-2" />
                        <span className="text-sm font-medium">{document.authenticity}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{document.uploadDate}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedDocument(document);
                            window.safeGlobalToast({
                              title: "Document consulté",
                              description: `Ouverture de ${document.name}`,
                              variant: "success"
                            });
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsLoading(true);
                            setTimeout(() => {
                              window.safeGlobalToast({
                                title: "Document téléchargé",
                                description: `${document.name} téléchargé`,
                                variant: "success"
                              });
                              setIsLoading(false);
                            }, 1500);
                          }}
                          disabled={isLoading}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsLoading(true);
                            setTimeout(() => {
                              window.safeGlobalToast({
                                title: "Document modifié",
                                description: `${document.name} mis à jour`,
                                variant: "success"
                              });
                              setIsLoading(false);
                            }, 1000);
                          }}
                          disabled={isLoading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {document.status === 'pending' || document.status === 'verifying' ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setIsLoading(true);
                                setTimeout(() => {
                                  window.safeGlobalToast({
                                    title: "Document authentifié",
                                    description: `${document.name} authentifié avec succès`,
                                    variant: "success"
                                  });
                                  setIsLoading(false);
                                }, 2000);
                              }}
                              disabled={isLoading}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setIsLoading(true);
                                setTimeout(() => {
                                  window.safeGlobalToast({
                                    title: "Document rejeté",
                                    description: `${document.name} refusé`,
                                    variant: "destructive"
                                  });
                                  setIsLoading(false);
                                }, 1000);
                              }}
                              disabled={isLoading}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Page {currentPage} sur {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Métriques de sécurité */}
      {selectedDocument && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Fingerprint className="h-5 w-5 mr-2 text-blue-600" />
              Analyse de Sécurité - {selectedDocument.name}
            </CardTitle>
            <CardDescription>
              Détails de l'authentification et de la vérification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Authenticité</span>
                    <span className="text-sm text-gray-600">{selectedDocument.authenticity}%</span>
                  </div>
                  <Progress value={selectedDocument.authenticity} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Intégrité</span>
                    <span className="text-sm text-gray-600">{selectedDocument.integrity}%</span>
                  </div>
                  <Progress value={selectedDocument.integrity} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Confidentialité</span>
                    <span className="text-sm text-gray-600">{selectedDocument.confidentiality}%</span>
                  </div>
                  <Progress value={selectedDocument.confidentiality} className="h-2" />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Hash Blockchain</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    <code className="text-xs text-gray-600 break-all">
                      {selectedDocument.blockchainHash || 'Non disponible'}
                    </code>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Signature Notariale</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedDocument.notarySignature}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Date d'authentification</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedDocument.authDate || 'Non authentifié'}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Niveau de sécurité</Label>
                  <Badge className={`mt-1 ${getSecurityLevelColor(selectedDocument.securityLevel)}`}>
                    {selectedDocument.securityLevel}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal d'upload de document */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nouveau Document à Authentifier</DialogTitle>
            <DialogDescription>
              Uploader un nouveau document pour authentification notariale
            </DialogDescription>
          </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="doc-name">Nom du document</Label>
              <Input id="doc-name" placeholder="Nom du document" />
            </div>
            <div>
              <Label htmlFor="doc-type">Type de document</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="doc-client">Client</Label>
            <Input id="doc-client" placeholder="Nom du client" />
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">
              Glissez-déposez votre document ici ou cliquez pour parcourir
            </p>
            <Button variant="outline" className="mt-2">
              Parcourir les fichiers
            </Button>
          </div>
          
          <div>
            <Label htmlFor="doc-notes">Notes (optionnel)</Label>
            <Textarea 
              id="doc-notes" 
              placeholder="Notes ou commentaires sur le document..."
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button 
            variant="outline" 
            onClick={() => setIsAuthenticateModalOpen(false)}
          >
            Annuler
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
          >
            {isLoading ? 'Upload...' : 'Uploader Document'}
          </Button>
        </div>
      </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotaireAuthentication;
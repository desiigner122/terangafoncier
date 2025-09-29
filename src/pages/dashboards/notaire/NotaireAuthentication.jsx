import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Target,
  Scan,
  QrCode,
  Key,
  UserCheck,
  FileCheck,
  Globe,
  Cpu,
  Database,
  TrendingUp,
  BarChart3,
  Activity,
  Settings,
  MoreHorizontal,
  Copy,
  ExternalLink,
  RefreshCw,
  Calendar,
  MapPin,
  Building2,
  Users,
  CheckCheck,
  AlertCircle,
  Info,
  HelpCircle,
  Layers,
  FileSignature,
  ShieldCheck,
  Verified,
  BadgeCheck,
  CreditCard,
  Wallet,
  Timer,
  ArrowRight,
  Plus,
  Minus,
  X,
  ChevronDown,
  ChevronUp
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

  // Données simulées enrichies des documents
  const mockDocuments = [
    {
      id: 'AUTH-2024-001',
      name: 'Titre propriété Villa Almadies',
      type: 'titre_propriete',
      client: 'Famille Diallo',
      clientAvatar: 'FD',
      status: 'authenticated',
      uploadDate: '2024-01-15',
      authDate: '2024-01-16',
      fileSize: '2.4 MB',
      fileType: 'PDF',
      blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      notarySignature: 'Signature numérique valide - Maître Diop',
      securityLevel: 'high',
      authenticity: 98,
      integrity: 100,
      confidentiality: 95,
      aiVerification: 'Conforme',
      biometricCheck: true,
      watermarkValid: true,
      timestampVerified: true,
      qrCodeValid: true,
      digitalSignature: 'RSA-2048 Valide',
      certificationLevel: 'Premium',
      processingTime: '2 heures',
      expiryDate: '2029-01-16',
      tags: ['Blockchain', 'IA Vérifié', 'Premium'],
      location: 'Almadies, Dakar',
      transactionRef: 'TXN-2024-001'
    },
    {
      id: 'AUTH-2024-002',
      name: 'Acte de vente Terrain Parcelles',
      type: 'acte_vente',
      client: 'M. Ndiaye',
      clientAvatar: 'MN',
      status: 'verifying',
      uploadDate: '2024-01-18',
      authDate: null,
      fileSize: '1.8 MB',
      fileType: 'PDF',
      blockchainHash: null,
      notarySignature: 'En cours de vérification...',
      securityLevel: 'medium',
      authenticity: 85,
      integrity: 92,
      confidentiality: 88,
      aiVerification: 'En cours',
      biometricCheck: true,
      watermarkValid: true,
      timestampVerified: false,
      qrCodeValid: null,
      digitalSignature: 'En attente',
      certificationLevel: 'Standard',
      processingTime: 'En cours (6h)',
      expiryDate: null,
      tags: ['En cours', 'IA Analyse'],
      location: 'Parcelles Assainies',
      transactionRef: 'TXN-2024-002'
    },
    {
      id: 'AUTH-2024-003',
      name: 'Testament Succession Seck',
      type: 'testament',
      client: 'Héritiers Seck',
      clientAvatar: 'HS',
      status: 'pending',
      uploadDate: '2024-01-20',
      authDate: null,
      fileSize: '1.2 MB',
      fileType: 'PDF',
      blockchainHash: null,
      notarySignature: 'En attente de traitement',
      securityLevel: 'high',
      authenticity: 0,
      integrity: 0,
      confidentiality: 0,
      aiVerification: 'En attente',
      biometricCheck: false,
      watermarkValid: null,
      timestampVerified: null,
      qrCodeValid: null,
      digitalSignature: 'Non vérifié',
      certificationLevel: 'Premium',
      processingTime: 'Non démarré',
      expiryDate: null,
      tags: ['Attente', 'Succession'],
      location: 'Plateau, Dakar',
      transactionRef: 'TXN-2024-003'
    },
    {
      id: 'AUTH-2024-004',
      name: 'Plan cadastral Lot 456',
      type: 'plan_cadastral',
      client: 'SARLU Teranga',
      clientAvatar: 'ST',
      status: 'rejected',
      uploadDate: '2024-01-22',
      authDate: '2024-01-23',
      fileSize: '5.6 MB',
      fileType: 'PDF',
      blockchainHash: null,
      notarySignature: 'Document non conforme - Signature invalide',
      securityLevel: 'low',
      authenticity: 45,
      integrity: 67,
      confidentiality: 78,
      aiVerification: 'Non conforme',
      biometricCheck: false,
      watermarkValid: false,
      timestampVerified: false,
      qrCodeValid: false,
      digitalSignature: 'Invalide',
      certificationLevel: 'Rejeté',
      processingTime: '4 heures',
      expiryDate: null,
      tags: ['Rejeté', 'Non conforme'],
      location: 'Médina, Dakar',
      transactionRef: 'TXN-2024-004'
    },
    {
      id: 'AUTH-2024-005',
      name: 'Contrat Hypothèque Sacré-Cœur',
      type: 'acte_vente',
      client: 'Banque Atlantique',
      clientAvatar: 'BA',
      status: 'authenticated',
      uploadDate: '2024-01-25',
      authDate: '2024-01-25',
      fileSize: '3.1 MB',
      fileType: 'PDF',
      blockchainHash: '0xabcd1234efgh5678ijkl9012mnop3456qrst7890',
      notarySignature: 'Authentifié - Signature électronique valide',
      securityLevel: 'high',
      authenticity: 96,
      integrity: 98,
      confidentiality: 94,
      aiVerification: 'Conforme',
      biometricCheck: true,
      watermarkValid: true,
      timestampVerified: true,
      qrCodeValid: true,
      digitalSignature: 'ECDSA-256 Valide',
      certificationLevel: 'Premium',
      processingTime: '1.5 heures',
      expiryDate: '2029-01-25',
      tags: ['Express', 'Bancaire', 'Blockchain'],
      location: 'Sacré-Cœur, Dakar',
      transactionRef: 'TXN-2024-005'
    },
    {
      id: 'AUTH-2024-006',
      name: 'Statuts SARL TechSen',
      type: 'certificat',
      client: 'StartUp TechSen',
      clientAvatar: 'TS',
      status: 'authenticated',
      uploadDate: '2024-01-28',
      authDate: '2024-01-28',
      fileSize: '2.8 MB',
      fileType: 'PDF',
      blockchainHash: '0xtech789startup123innovation456digital789',
      notarySignature: 'Authentifié - Constitution société conforme',
      securityLevel: 'high',
      authenticity: 99,
      integrity: 100,
      confidentiality: 97,
      aiVerification: 'Excellent',
      biometricCheck: true,
      watermarkValid: true,
      timestampVerified: true,
      qrCodeValid: true,
      digitalSignature: 'Ed25519 Valide',
      certificationLevel: 'Premium+',
      processingTime: '45 minutes',
      expiryDate: '2034-01-28',
      tags: ['Startup', 'Express', 'Premium+'],
      location: 'Mermoz, Dakar',
      transactionRef: 'TXN-2024-006'
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
    <div className="space-y-8 p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header Hero Authentification */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="text-white">
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold mb-2 flex items-center"
              >
                <ShieldCheck className="h-10 w-10 mr-4" />
                Authentification Numérique
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-purple-100 mb-4"
              >
                Vérification IA avancée et certification blockchain
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center space-x-6 text-purple-100"
              >
                <div className="flex items-center">
                  <Cpu className="h-5 w-5 mr-2" />
                  <span>IA Advanced</span>
                </div>
                <div className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  <span>QR Verification</span>
                </div>
                <div className="flex items-center">
                  <Fingerprint className="h-5 w-5 mr-2" />
                  <span>Biometric Check</span>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center space-x-4 mt-6 lg:mt-0"
            >
              <Button 
                variant="secondary"
                onClick={handleBulkAuthentication}
                disabled={isLoading}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Scan className="h-4 w-4 mr-2" />
                Authentification Lot
              </Button>
              <Button 
                onClick={() => setShowUploadDialog(true)}
                className="bg-white text-purple-600 hover:bg-purple-50 font-semibold"
              >
                <Upload className="h-4 w-4 mr-2" />
                Nouveau Document
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Métriques d'authentification avancées */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileSignature className="h-6 w-6" />
            </div>
            <TrendingUp className="h-5 w-5 text-blue-200" />
          </div>
          <div>
            <p className="text-blue-100 text-sm">Documents Total</p>
            <p className="text-3xl font-bold">{documents.length}</p>
            <p className="text-blue-200 text-xs mt-1">+8 cette semaine</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <BadgeCheck className="h-6 w-6" />
            </div>
            <CheckCheck className="h-5 w-5 text-green-200" />
          </div>
          <div>
            <p className="text-green-100 text-sm">Authentifiés</p>
            <p className="text-3xl font-bold">
              {documents.filter(d => d.status === 'authenticated').length}
            </p>
            <p className="text-green-200 text-xs mt-1">Moyenne: 2.1h</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Timer className="h-6 w-6" />
            </div>
            <Activity className="h-5 w-5 text-amber-200" />
          </div>
          <div>
            <p className="text-amber-100 text-sm">En traitement</p>
            <p className="text-3xl font-bold">
              {documents.filter(d => d.status === 'verifying' || d.status === 'pending').length}
            </p>
            <p className="text-amber-200 text-xs mt-1">Délai moyen: 4.2h</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <BarChart3 className="h-6 w-6" />
            </div>
            <Star className="h-5 w-5 text-purple-200" />
          </div>
          <div>
            <p className="text-purple-100 text-sm">Taux de Réussite</p>
            <p className="text-3xl font-bold">
              {documents.length > 0 ? Math.round((documents.filter(d => d.status === 'authenticated').length / documents.length) * 100) : 0}%
            </p>
            <p className="text-purple-200 text-xs mt-1">↑5% ce mois</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Interface de recherche et filtres modernisée */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/20"
      >
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Rechercher par nom, client, type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-white/80 border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48 bg-white/80 border-purple-200 focus:border-purple-400 rounded-xl">
                  <Filter className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  {authStatuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center">
                        {getStatusIcon(status.value)}
                        <span className="ml-2">{status.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="bg-white/80 border-purple-200 hover:bg-purple-50">
                <Settings className="h-4 w-4 mr-2" />
                Filtres IA
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 px-4 py-2 rounded-xl">
                <span className="text-sm font-medium text-purple-800">
                  {filteredDocuments.length} document{filteredDocuments.length > 1 ? 's' : ''}
                </span>
              </div>
              <Button variant="outline" size="sm" className="bg-white/80">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grille moderne des documents d'authentification */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-4"
      >
        <AnimatePresence>
          {paginatedDocuments.map((document, index) => {
            const DocIcon = getDocumentTypeIcon(document.type);
            return (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                    {/* Informations document */}
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {document.clientAvatar}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <DocIcon className="h-5 w-5 text-gray-600" />
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {document.name}
                          </h3>
                          <Badge className={getStatusColor(document.status)}>
                            {getStatusIcon(document.status)}
                            <span className="ml-1">
                              {authStatuses.find(s => s.value === document.status)?.label}
                            </span>
                          </Badge>
                          {document.blockchainHash && (
                            <Badge className="bg-green-100 text-green-800">
                              <Database className="h-3 w-3 mr-1" />
                              Blockchain
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {document.client}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {document.uploadDate}
                          </div>
                          <div className="flex items-center">
                            <Archive className="h-4 w-4 mr-1" />
                            {document.fileSize} • {document.fileType}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {document.location}
                          </div>
                        </div>
                        
                        {/* Métriques de sécurité */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-green-700">Authenticité</span>
                              <span className="text-xs text-green-600">{document.authenticity}%</span>
                            </div>
                            <div className="w-full bg-green-200 rounded-full h-1.5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${document.authenticity}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className="bg-green-500 h-1.5 rounded-full"
                              />
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-blue-700">Intégrité</span>
                              <span className="text-xs text-blue-600">{document.integrity}%</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-1.5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${document.integrity}%` }}
                                transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                                className="bg-blue-500 h-1.5 rounded-full"
                              />
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-purple-700">Confidentialité</span>
                              <span className="text-xs text-purple-600">{document.confidentiality}%</span>
                            </div>
                            <div className="w-full bg-purple-200 rounded-full h-1.5">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${document.confidentiality}%` }}
                                transition={{ duration: 1, delay: index * 0.1 + 0.4 }}
                                className="bg-purple-500 h-1.5 rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Vérifications techniques */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {document.biometricCheck && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              <Fingerprint className="h-3 w-3 mr-1" />
                              Biométrie ✓
                            </Badge>
                          )}
                          {document.qrCodeValid && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                              <QrCode className="h-3 w-3 mr-1" />
                              QR Code ✓
                            </Badge>
                          )}
                          {document.watermarkValid && (
                            <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                              <Eye className="h-3 w-3 mr-1" />
                              Filigrane ✓
                            </Badge>
                          )}
                          {document.timestampVerified && (
                            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                              <Clock className="h-3 w-3 mr-1" />
                              Horodatage ✓
                            </Badge>
                          )}
                        </div>
                        
                        {/* Tags */}
                        <div className="flex items-center space-x-2">
                          {document.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Section droite - Actions et infos */}
                    <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {document.certificationLevel}
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          Traitement: {document.processingTime}
                        </div>
                        <Badge className={getSecurityLevelColor(document.securityLevel)}>
                          <Shield className="h-3 w-3 mr-1" />
                          {document.securityLevel}
                        </Badge>
                        {document.expiryDate && (
                          <div className="text-xs text-gray-500 mt-1">
                            Expire: {document.expiryDate}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDocument(document)}
                          className="hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-green-50"
                        >
                          <Download className="h-4 w-4 text-green-600" />
                        </Button>
                        {document.status === 'pending' || document.status === 'verifying' ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAuthenticateDocument(document.id)}
                              className="hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRejectDocument(document.id)}
                              className="hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-purple-50"
                          >
                            <Scan className="h-4 w-4 text-purple-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* Pagination améliorée */}
        {totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between bg-white/70 backdrop-blur-md rounded-xl p-4 mt-6"
          >
            <div className="text-sm text-gray-600">
              Affichage de {startIndex + 1} à {Math.min(startIndex + documentsPerPage, filteredDocuments.length)} sur {filteredDocuments.length} documents
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-white/80"
              >
                Précédent
              </Button>
              <span className="text-sm font-medium text-gray-700 px-3">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-white/80"
              >
                Suivant
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>

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
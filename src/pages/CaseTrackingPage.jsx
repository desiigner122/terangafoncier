import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, Clock, FileText, Home, User, AlertCircle, Banknote, ArrowRight,
  ExternalLink, Shield, Upload, Download, Eye, MessageSquare, Calendar,
  TrendingUp, Users, FileCheck, MapPin, PenTool, CreditCard, ArrowRightLeft,
  Bell, UserCheck, Heart, FileSignature, Scale, X, XCircle, UserMinus, 
  AlertTriangle, Building2, Phone, Mail
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { terangaBlockchain as blockchain } from '@/services/TerangaBlockchainService';
import PurchaseWorkflowService from '@/services/PurchaseWorkflowService';
import BlockchainVerification from '@/components/blockchain/BlockchainVerification';

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR', {
  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
});

const getStatusInfo = (status) => {
  const iconMap = {
    FileText, Clock, CheckCircle, AlertCircle, UserCheck, Bell, MessageSquare, 
    Heart, FileSignature, Scale, FileCheck, MapPin, Calendar, PenTool, 
    CreditCard, ArrowRightLeft, X, XCircle, UserMinus, AlertTriangle
  };

  const statusConfig = PurchaseWorkflowService.WORKFLOW_STATUSES[status?.toUpperCase()];
  if (!statusConfig) return { icon: FileText, color: 'text-gray-500' };

  const IconComponent = iconMap[statusConfig.icon] || FileText;
  const colorMap = {
    blue: 'text-blue-500 bg-blue-50',
    yellow: 'text-yellow-500 bg-yellow-50', 
    purple: 'text-purple-500 bg-purple-50',
    orange: 'text-orange-500 bg-orange-50',
    green: 'text-green-500 bg-green-50',
    indigo: 'text-indigo-500 bg-indigo-50',
    red: 'text-red-500 bg-red-50',
    cyan: 'text-cyan-500 bg-cyan-50',
    emerald: 'text-emerald-500 bg-emerald-50',
    violet: 'text-violet-500 bg-violet-50',
    pink: 'text-pink-500 bg-pink-50',
    gray: 'text-gray-500 bg-gray-50'
  };

  return { 
    icon: IconComponent, 
    color: colorMap[statusConfig.color] || 'text-gray-500',
    config: statusConfig
  };
};

const CaseTrackingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-3/4" />
    <Skeleton className="h-6 w-1/2" />
    <Card>
      <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  </div>
);

const CaseTrackingPage = () => {
  const { id } = useParams();
  const [purchaseCase, setPurchaseCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('timeline');
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchPurchaseCase = async () => {
      setLoading(true);
      try {
        // Essayer d'abord de récupérer un dossier d'achat complet
        const caseResult = await PurchaseWorkflowService.getCaseDetails(id);
        
        if (caseResult.success) {
          setPurchaseCase(caseResult.case);
        } else {
          // Fallback vers l'ancien système de requests
          const { data, error } = await supabase
            .from('requests')
            .select(`
              *,
              buyer:user_id(*),
              seller:recipient(*),
              parcelle:parcel_id(*)
            `)
            .eq('id', id)
            .single();
          
          if (error) throw error;
          
          // Convertir en format dossier d'achat pour compatibilité
          setPurchaseCase({
            id: data.id,
            request_id: data.id,
            buyer: data.buyer,
            seller: data.seller,
            parcelle: data.parcelle,
            status: data.status,
            phase: 1,
            progress_percentage: 25,
            history: data.history || [],
            documents: [],
            created_at: data.created_at,
            legacy_request: true
          });
        }
      } catch (err) {
        console.error('Erreur lors du chargement du dossier:', err);
        setPurchaseCase(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPurchaseCase();
    }
  }, [id]);

  const handleStatusUpdate = async (newStatus, notes = '') => {
    if (!purchaseCase || purchaseCase.legacy_request) return;
    
    try {
      const result = await PurchaseWorkflowService.updateCaseStatus(
        purchaseCase.id, 
        newStatus, 
        'User', 
        notes
      );
      
      if (result.success) {
        // Recharger les données du dossier
        const updatedCase = await PurchaseWorkflowService.getCaseDetails(purchaseCase.id);
        if (updatedCase.success) {
          setPurchaseCase(updatedCase.case);
        }
        
        window.safeGlobalToast?.({ 
          title: 'Statut mis à jour', 
          description: `Le dossier est maintenant au statut: ${newStatus}` 
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      window.safeGlobalToast?.({ 
        variant: 'destructive', 
        title: 'Erreur', 
        description: error.message 
      });
    }
  };

  const handleDocumentUpload = async (event, documentType) => {
    const file = event.target.files[0];
    if (!file || !purchaseCase) return;

    setUploadingDocument(true);
    try {
      // Upload vers Supabase Storage
      const fileName = `${purchaseCase.id}/${documentType}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('purchase-documents')
        .upload(fileName, file);

      if (error) throw error;

      // Enregistrer dans la base
      const { error: dbError } = await supabase
        .from('purchase_case_documents')
        .insert({
          case_id: purchaseCase.id,
          document_type: documentType,
          document_name: file.name,
          file_path: data.path,
          file_size: file.size,
          file_type: file.type,
          uploaded_by: supabase.auth.user()?.id
        });

      if (dbError) throw dbError;

      window.safeGlobalToast?.({ 
        title: 'Document uploadé', 
        description: `${file.name} a été ajouté au dossier` 
      });

      // Recharger le dossier pour afficher le nouveau document
      const updatedCase = await PurchaseWorkflowService.getCaseDetails(purchaseCase.id);
      if (updatedCase.success) {
        setPurchaseCase(updatedCase.case);
      }
    } catch (error) {
      window.safeGlobalToast?.({ 
        variant: 'destructive', 
        title: 'Erreur upload', 
        description: error.message 
      });
    } finally {
      setUploadingDocument(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim() || !purchaseCase) return;

    try {
      await PurchaseWorkflowService.addWorkflowHistory(
        purchaseCase.id,
        purchaseCase.status,
        'User',
        newComment
      );

      setNewComment('');
      
      // Recharger l'historique
      const updatedCase = await PurchaseWorkflowService.getCaseDetails(purchaseCase.id);
      if (updatedCase.success) {
        setPurchaseCase(updatedCase.case);
      }

      window.safeGlobalToast?.({ 
        title: 'Commentaire ajouté', 
        description: 'Votre commentaire a été ajouté au dossier' 
      });
    } catch (error) {
      window.safeGlobalToast?.({ 
        variant: 'destructive', 
        title: 'Erreur', 
        description: 'Impossible d\'ajouter le commentaire' 
      });
    }
  };

  if (loading) return (
    <div className="container mx-auto py-8 px-4">
      <CaseTrackingSkeleton />
    </div>
  );

  if (!purchaseCase) return (
    <div className="container mx-auto py-10 text-center">
      <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h2 className="text-2xl font-semibold text-destructive mb-2">Dossier non trouvé</h2>
      <p className="text-gray-600 mb-4">Le dossier demandé n'existe pas ou vous n'avez pas les permissions pour le consulter.</p>
      <Link to="/my-requests" className="text-primary hover:underline">
        <Button variant="outline">
          <Home className="mr-2 h-4 w-4" />
          Retour à mes demandes
        </Button>
      </Link>
    </div>
  );
  
  const currentStatusInfo = getStatusInfo(purchaseCase.status);
  const pendingPayments = purchaseCase.payments?.filter(p => p.status === 'En attente') || [];
  const nextPossibleStatuses = currentStatusInfo.config?.nextStatuses || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-8 px-4"
    >
      {/* En-tête du dossier */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              {purchaseCase.legacy_request ? 'Suivi de Demande' : 'Dossier d\'Achat'} : {purchaseCase.id}
            </h1>
            <p className="text-muted-foreground">
              {purchaseCase.legacy_request 
                ? 'Historique complet de votre demande'
                : 'Suivi complet de votre processus d\'achat immobilier'
              }
            </p>
          </div>
          <Link to="/my-requests">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Mes demandes
            </Button>
          </Link>
        </div>

        {/* Carte de statut et progression */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${currentStatusInfo.color}`}>
                  <currentStatusInfo.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {currentStatusInfo.config?.label || purchaseCase.status}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {currentStatusInfo.config?.description || 'Statut de la demande'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {purchaseCase.progress_percentage || 0}%
                </div>
                <div className="text-sm text-gray-600">Progression</div>
              </div>
            </div>
            
            <Progress value={purchaseCase.progress_percentage || 0} className="mb-4" />
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Phase {purchaseCase.phase || 1}/4</span>
              {purchaseCase.estimated_completion && (
                <span>
                  Estimation: {formatDate(purchaseCase.estimated_completion)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="timeline">Chronologie</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="blockchain">🔗 Blockchain</TabsTrigger>
        </TabsList>

        {/* Timeline du dossier */}
        <TabsContent value="timeline" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Chronologie Détaillée
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l border-gray-200 ml-3">
                    <AnimatePresence>
                      {(purchaseCase.history || []).sort((a,b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date)).map((item, index) => {
                        const statusInfo = getStatusInfo(item.new_status || item.status);
                        const isCurrentStatus = item.new_status === purchaseCase.status || item.status === purchaseCase.status;
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="mb-8 ml-6"
                          >
                            <div className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-7 ring-4 ring-white ${statusInfo.color}`}>
                              <statusInfo.icon className="w-4 h-4" />
                            </div>
                            
                            <div className={`p-4 rounded-lg border ${isCurrentStatus ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold">
                                  {statusInfo.config?.label || item.new_status || item.status}
                                  {isCurrentStatus && (
                                    <Badge variant="default" className="ml-2">Actuel</Badge>
                                  )}
                                </h3>
                                <time className="text-sm text-gray-500">
                                  {formatDate(item.created_at || item.date)}
                                </time>
                              </div>
                              
                              <p className="text-gray-600 mb-2">
                                {item.notes || item.note}
                              </p>
                              
                              <div className="flex items-center text-sm text-gray-500">
                                <User className="w-4 h-4 mr-1" />
                                {item.updated_by}
                                {statusInfo.config?.duration && (
                                  <>
                                    <Clock className="w-4 h-4 ml-4 mr-1" />
                                    {statusInfo.config.duration}
                                  </>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Colonne de droite - Infos dossier */}
            <div className="space-y-6">
              {/* Détails du dossier */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Détails du Dossier
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-semibold capitalize">
                      {purchaseCase.legacy_request ? purchaseCase.request_type : 'Achat immobilier'}
                    </span>
                  </div>
                  
                  {purchaseCase.purchase_price && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prix:</span>
                      <span className="font-semibold">
                        {purchaseCase.purchase_price.toLocaleString()} FCFA
                      </span>
                    </div>
                  )}
                  
                  {purchaseCase.payment_method && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paiement:</span>
                      <span className="font-semibold capitalize">
                        {purchaseCase.payment_method.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                  
                  {purchaseCase.parcelle_id && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Parcelle:</span>
                      <Link 
                        to={`/parcelles/${purchaseCase.parcelle_id}`} 
                        className="font-semibold text-primary hover:underline"
                      >
                        {purchaseCase.parcelle?.title || purchaseCase.parcelle_id}
                      </Link>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Créé le:</span>
                    <span className="font-semibold">
                      {formatDate(purchaseCase.created_at)}
                    </span>
                  </div>
                  
                  {(purchaseCase.nft_token_id || purchaseCase.nft_tx_hash) && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        {purchaseCase.nft_token_id && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Shield className="w-3 h-3" /> NFT #{purchaseCase.nft_token_id}
                          </Badge>
                        )}
                        {purchaseCase.nft_tx_hash && (
                          <a
                            href={`${blockchain?.networks?.[blockchain?.currentNetwork]?.blockExplorer || 'https://polygonscan.com'}/tx/${purchaseCase.nft_tx_hash}`}
                            target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                          >
                            <ExternalLink className="w-3 h-3" /> Transaction
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Paiements en attente */}
              {pendingPayments.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-700">
                      <Banknote className="mr-2 h-5 w-5"/>
                      Paiements Requis
                    </CardTitle>
                    <CardDescription>
                      Des paiements sont nécessaires pour faire avancer le dossier.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {pendingPayments.map(payment => (
                        <li key={payment.id} className="flex justify-between items-center text-sm">
                          <span>{payment.description}</span>
                          <span className="font-bold">
                            {payment.amount.toLocaleString()} FCFA
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to={`/payment/${pendingPayments[0].id}`}>
                        Effectuer le paiement <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* Ajout de commentaire */}
              {!purchaseCase.legacy_request && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Ajouter un commentaire
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Textarea
                      placeholder="Votre commentaire ou question..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button onClick={addComment} disabled={!newComment.trim()}>
                      Ajouter le commentaire
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        {/* Onglet Documents */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents du Dossier
              </CardTitle>
              <CardDescription>
                Gérez tous les documents liés à votre dossier d'achat
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Upload de documents */}
              {!purchaseCase.legacy_request && (
                <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">Ajouter un document</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Glissez-déposez vos fichiers ou cliquez pour parcourir
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(PurchaseWorkflowService.REQUIRED_DOCUMENTS).map(([key, doc]) => (
                        <div key={key} className="relative">
                          <input
                            type="file"
                            id={`upload-${key}`}
                            className="hidden"
                            onChange={(e) => handleDocumentUpload(e, key)}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          />
                          <label
                            htmlFor={`upload-${key}`}
                            className="block p-3 text-center border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <FileText className="w-5 h-5 mx-auto mb-1" />
                            <div className="text-xs font-medium">{doc.name}</div>
                            {doc.required && (
                              <div className="text-xs text-red-500">Requis</div>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Liste des documents */}
              <div className="space-y-3">
                {(purchaseCase.documents || []).length > 0 ? (
                  purchaseCase.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileCheck className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium">{doc.document_name}</div>
                          <div className="text-sm text-gray-600">
                            {PurchaseWorkflowService.REQUIRED_DOCUMENTS[doc.document_type]?.name || doc.document_type}
                            • {doc.file_size ? Math.round(doc.file_size / 1024) : 0} KB
                            • {formatDate(doc.uploaded_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          doc.verification_status === 'verified' ? 'default' :
                          doc.verification_status === 'rejected' ? 'destructive' : 'secondary'
                        }>
                          {doc.verification_status === 'verified' ? 'Vérifié' :
                           doc.verification_status === 'rejected' ? 'Rejeté' : 'En attente'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Aucun document uploadé pour ce dossier</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Participants */}
        <TabsContent value="participants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participants au Dossier
              </CardTitle>
              <CardDescription>
                Toutes les personnes impliquées dans ce dossier d'achat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Acheteur */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {purchaseCase.buyer?.full_name || purchaseCase.buyer?.name || 'Acheteur'}
                    </div>
                    <div className="text-sm text-gray-600">Acheteur principal</div>
                    {purchaseCase.buyer?.email && (
                      <div className="text-xs text-gray-500">{purchaseCase.buyer.email}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge>Acheteur</Badge>
                  {purchaseCase.buyer?.phone && (
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Vendeur */}
              {purchaseCase.seller && (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Building2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {purchaseCase.seller?.full_name || purchaseCase.seller?.name || 'Vendeur'}
                      </div>
                      <div className="text-sm text-gray-600">Vendeur</div>
                      {purchaseCase.seller?.email && (
                        <div className="text-xs text-gray-500">{purchaseCase.seller.email}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Vendeur</Badge>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Participants additionnels */}
              {(purchaseCase.participants || []).map((participant, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">{participant.contact_name}</div>
                      <div className="text-sm text-gray-600 capitalize">{participant.role.replace('_', ' ')}</div>
                      {participant.contact_email && (
                        <div className="text-xs text-gray-500">{participant.contact_email}</div>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {participant.role.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Actions */}
        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Actions Disponibles
              </CardTitle>
              <CardDescription>
                Actions que vous pouvez effectuer sur ce dossier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!purchaseCase.legacy_request && nextPossibleStatuses.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Faire évoluer le statut :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {nextPossibleStatuses.map(statusKey => {
                      const statusInfo = PurchaseWorkflowService.WORKFLOW_STATUSES[statusKey.toUpperCase()];
                      if (!statusInfo) return null;

                      return (
                        <Button
                          key={statusKey}
                          variant="outline"
                          className="justify-start h-auto p-4"
                          onClick={() => handleStatusUpdate(statusKey, `Mise à jour vers ${statusInfo.label}`)}
                        >
                          <div className="text-left">
                            <div className="font-medium">{statusInfo.label}</div>
                            <div className="text-sm text-gray-600">{statusInfo.description}</div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Actions générales :</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger le récapitulatif
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contacter le support
                  </Button>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Planifier un RDV
                  </Button>
                </div>
              </div>

              {/* Actions d'urgence */}
              {!purchaseCase.legacy_request && purchaseCase.status !== 'completed' && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Actions d'urgence :</strong>
                    <div className="mt-2 space-x-2">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleStatusUpdate('cancelled', 'Dossier annulé par l\'utilisateur')}
                      >
                        Annuler le dossier
                      </Button>
                      <Button variant="outline" size="sm">
                        Signaler un problème
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Blockchain */}
        <TabsContent value="blockchain" className="space-y-6">
          <BlockchainVerification 
            caseId={purchaseCase?.id} 
            className="shadow-lg"
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default CaseTrackingPage;
/**
 * NotaireCaseDetailModern.jsx
 * 
 * Page de suivi détaillé optimisée pour le notaire
 * Version simplifiée qui fonctionne avec le système purchase_case_participants
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileText, Users, MessageSquare, Calendar, DollarSign,
  CheckCircle, Clock, AlertCircle, TrendingUp, MapPin, Phone, Mail,
  Send, Paperclip, Download, Upload, Eye, Trash2, User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import TimelineTrackerModern from '@/components/purchase/TimelineTrackerModern';
import PurchaseCaseMessaging from '@/components/messaging/PurchaseCaseMessaging';
import WorkflowStatusService from '@/services/WorkflowStatusService';
import ContractGenerator from '@/components/purchase/ContractGenerator';
import AppointmentScheduler from '@/components/purchase/AppointmentScheduler';

const STATUS_META = {
  initiated: { label: 'Initié', color: 'bg-gray-500', progress: 10 },
  buyer_verification: { label: 'Vérification acheteur', color: 'bg-blue-500', progress: 20 },
  seller_notification: { label: 'Notification vendeur', color: 'bg-indigo-500', progress: 30 },
  document_collection: { label: 'Collecte documents', color: 'bg-purple-500', progress: 40 },
  title_verification: { label: 'Vérification titre', color: 'bg-pink-500', progress: 50 },
  contract_preparation: { label: 'Préparation contrat', color: 'bg-cyan-500', progress: 60 },
  preliminary_agreement: { label: 'Accord préliminaire', color: 'bg-teal-500', progress: 65 },
  deposit_pending: { label: 'Acompte en attente', color: 'bg-yellow-500', progress: 70 },
  contract_validation: { label: 'Validation contrat', color: 'bg-orange-500', progress: 75 },
  appointment_scheduling: { label: 'Planification RDV', color: 'bg-amber-500', progress: 80 },
  final_payment: { label: 'Paiement final', color: 'bg-lime-500', progress: 85 },
  signature: { label: 'Signature', color: 'bg-green-500', progress: 90 },
  registration: { label: 'Enregistrement', color: 'bg-emerald-500', progress: 95 },
  completed: { label: 'Terminé', color: 'bg-green-600', progress: 100 },
  cancelled: { label: 'Annulé', color: 'bg-red-500', progress: 0 }
};

const NotaireCaseDetailModern = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [documents, setDocuments] = useState([]);
  const [showContractDialog, setShowContractDialog] = useState(false);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (caseId && user) {
      loadCaseDetails();
    }
  }, [caseId, user]);

  const loadCaseDetails = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading case details for:', caseId);

      // Charger le dossier complet avec toutes les relations
      const { data: purchaseCase, error } = await supabase
        .from('purchase_cases')
        .select(`
          *,
          buyer:profiles!buyer_id(id, full_name, email, phone, avatar_url),
          seller:profiles!seller_id(id, full_name, email, phone, avatar_url),
          parcelle:parcels!parcelle_id(id, title, location, surface)
        `)
        .eq('id', caseId)
        .single();

      if (error) throw error;

      console.log('✅ Case loaded:', purchaseCase);
      
      setCaseData(purchaseCase);

      // Charger les documents
      loadDocuments();

    } catch (error) {
      console.error('❌ Error loading case:', error);
      window.safeGlobalToast?.({
        title: "Erreur",
        description: "Impossible de charger le dossier",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const { data: docsData, error } = await supabase
        .from('purchase_case_documents')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('📄 Documents loaded:', docsData?.length, docsData);

      // Charger les profils des uploaders
      if (docsData && docsData.length > 0) {
        const uploaderIds = [...new Set(docsData.map(d => d.uploaded_by).filter(Boolean))];
        
        console.log('👤 Loading profiles for uploader IDs:', uploaderIds);
        
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', uploaderIds);

        console.log('👤 Uploader profiles loaded:', profilesData);

        // Mapper les profils aux documents
        const profilesMap = {};
        (profilesData || []).forEach(profile => {
          profilesMap[profile.id] = profile;
        });

        const docsWithUploaders = docsData.map(doc => ({
          ...doc,
          uploader: profilesMap[doc.uploaded_by] || null,
          uploaded_by_name: profilesMap[doc.uploaded_by]?.full_name || profilesMap[doc.uploaded_by]?.email || 'Utilisateur'
        }));

        console.log('✅ Documents with uploaders:', docsWithUploaders);
        setDocuments(docsWithUploaders);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      setDocuments([]);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      
      const { error } = await supabase
        .from('purchase_cases')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId);

      if (error) throw error;

      // Recharger les données
      await loadCaseDetails();
      
      window.safeGlobalToast?.({
        title: "Statut mis à jour",
        description: `Le dossier est maintenant en: ${WorkflowStatusService.getLabel(newStatus)}`,
        variant: "success"
      });

      setShowStatusDialog(false);
    } catch (error) {
      console.error('Error updating status:', error);
      window.safeGlobalToast?.({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleValidateDocuments = async () => {
    try {
      // Valider tous les documents en attente
      const { error } = await supabase
        .from('purchase_case_documents')
        .update({ status: 'approved' })
        .eq('case_id', caseId)
        .eq('status', 'pending');

      if (error) throw error;

      await loadDocuments();
      
      window.safeGlobalToast?.({
        title: "Documents validés",
        description: "Tous les documents en attente ont été validés",
        variant: "success"
      });
    } catch (error) {
      console.error('Error validating documents:', error);
      window.safeGlobalToast?.({
        title: "Erreur",
        description: "Impossible de valider les documents",
        variant: "destructive"
      });
    }
  };

  const getAvailableStatusTransitions = () => {
    if (!caseData?.status) return [];
    
    const currentIndex = WorkflowStatusService.chronologicalOrder.indexOf(caseData.status);
    if (currentIndex === -1) return WorkflowStatusService.chronologicalOrder;
    
    // Permettre d'avancer au statut suivant ou de revenir en arrière
    return WorkflowStatusService.chronologicalOrder.slice(
      Math.max(0, currentIndex - 1),
      Math.min(WorkflowStatusService.chronologicalOrder.length, currentIndex + 3)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <AlertCircle className="h-16 w-16 text-gray-400" />
        <p className="text-xl text-gray-600">Dossier introuvable</p>
        <Button onClick={() => navigate('/notaire/cases')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux dossiers
        </Button>
      </div>
    );
  }

  const statusConfig = STATUS_META[caseData.status] || STATUS_META.initiated;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/notaire/cases')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {caseData.case_number}
                </h1>
                <Badge className={statusConfig.color}>
                  {statusConfig.label}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {caseData.parcelle?.title} - {caseData.parcelle?.location}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Progression</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {statusConfig.progress}%
              </span>
            </div>
            <Progress value={statusConfig.progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Informations générales */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Informations du dossier
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Numéro de dossier</p>
                      <p className="font-semibold">{caseData.case_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Statut</p>
                      <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prix d'achat</p>
                      <p className="font-semibold text-lg text-green-600">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'XOF',
                          minimumFractionDigits: 0
                        }).format(caseData.purchase_price || 0)}
                      </p>
                    </div>
                    {caseData.notaire_fees && (
                      <div>
                        <p className="text-sm text-gray-500">Frais de notaire</p>
                        <p className="font-semibold text-lg text-blue-600">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'XOF',
                            minimumFractionDigits: 0
                          }).format(caseData.notaire_fees)}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Date de création</p>
                      <p className="font-semibold">
                        {new Date(caseData.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dernière mise à jour</p>
                      <p className="font-semibold">
                        {new Date(caseData.updated_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Informations terrain */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Terrain
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Titre</p>
                      <p className="font-semibold">{caseData.parcelle?.title || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Localisation</p>
                      <p className="font-semibold">{caseData.parcelle?.location || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Surface</p>
                      <p className="font-semibold">{caseData.parcelle?.surface || 'N/A'} m²</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions contextuelles */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actions disponibles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {/* Générer/Préparer Contrat */}
                      <Dialog open={showContractDialog} onOpenChange={setShowContractDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full justify-start gap-2">
                            <FileText className="h-4 w-4" />
                            Préparer le contrat
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Génération de contrat</DialogTitle>
                            <DialogDescription>
                              Générez les documents officiels pour ce dossier
                            </DialogDescription>
                          </DialogHeader>
                          <ContractGenerator
                            purchaseRequest={{ id: caseId }}
                            buyer={caseData?.buyer}
                            seller={caseData?.seller}
                            property={caseData?.parcelle}
                            onContractGenerated={() => {
                              setShowContractDialog(false);
                              loadDocuments();
                            }}
                          />
                        </DialogContent>
                      </Dialog>

                      {/* Planifier RDV/Signature */}
                      <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full justify-start gap-2">
                            <Calendar className="h-4 w-4" />
                            Planifier la signature
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Planifier un rendez-vous</DialogTitle>
                            <DialogDescription>
                              Créez un rendez-vous de signature avec toutes les parties
                            </DialogDescription>
                          </DialogHeader>
                          <AppointmentScheduler
                            purchaseRequestId={caseId}
                            userId={user?.id}
                            onAppointmentCreated={() => {
                              setShowAppointmentDialog(false);
                              window.safeGlobalToast?.({
                                title: "Rendez-vous créé",
                                description: "Le rendez-vous a été planifié avec succès",
                                variant: "success"
                              });
                            }}
                          />
                        </DialogContent>
                      </Dialog>

                      {/* Valider Documents */}
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={handleValidateDocuments}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Valider les documents
                      </Button>

                      {/* Changer le statut */}
                      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full justify-start gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Changer le statut
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Mettre à jour le statut du dossier</DialogTitle>
                            <DialogDescription>
                              Statut actuel: {WorkflowStatusService.getLabel(caseData?.status)}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Nouveau statut</Label>
                              <div className="grid gap-2">
                                {getAvailableStatusTransitions().map((status) => (
                                  <Button
                                    key={status}
                                    variant={caseData?.status === status ? "default" : "outline"}
                                    className="justify-start"
                                    onClick={() => handleStatusUpdate(status)}
                                    disabled={updatingStatus || caseData?.status === status}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {WorkflowStatusService.getLabel(status)}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => setActiveTab('documents')}
                      >
                        <Upload className="h-4 w-4" />
                        Télécharger un document
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messages">
                <PurchaseCaseMessaging
                  caseId={caseId}
                  caseNumber={caseData?.case_number}
                  buyerInfo={{
                    id: caseData?.buyer?.id,
                    name: caseData?.buyer?.full_name || caseData?.buyer?.email
                  }}
                  sellerInfo={{
                    id: caseData?.seller?.id,
                    name: caseData?.seller?.full_name || caseData?.seller?.email
                  }}
                />
              </TabsContent>

              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Documents du dossier
                      </span>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Upload className="h-4 w-4" />
                        Uploader
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {documents.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="h-16 w-16 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">Aucun document pour le moment</p>
                        <p className="text-sm mt-1">Les documents ajoutés au dossier apparaîtront ici</p>
                        <Button className="mt-4 gap-2" variant="outline">
                          <Upload className="h-4 w-4" />
                          Ajouter le premier document
                        </Button>
                      </div>
                    ) : (
                      <ScrollArea className="h-[500px]">
                        <div className="space-y-3">
                          {documents.map((doc) => (
                            <Card key={doc.id} className="border-l-4 border-l-blue-500">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-3 flex-1">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-sm truncate">
                                        {doc.file_name || 'Document sans nom'}
                                      </h4>
                                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">
                                          {doc.document_type || doc.file_type || doc.mime_type || 'Type inconnu'}
                                        </span>
                                        {doc.file_size && (
                                          <span>{(doc.file_size / 1024).toFixed(0)} Ko</span>
                                        )}
                                        {doc.created_at && (
                                          <span>
                                            {new Date(doc.created_at).toLocaleDateString('fr-FR', {
                                              day: 'numeric',
                                              month: 'short',
                                              year: 'numeric'
                                            })}
                                          </span>
                                        )}
                                      </div>
                                      {doc.uploaded_by_name && (
                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                          <User className="h-3 w-3" />
                                          Ajouté par {doc.uploaded_by_name}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline" title="Prévisualiser">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" title="Télécharger">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" title="Supprimer">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    )}

                    {documents.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{documents.length} document(s) au total</span>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Upload className="h-4 w-4" />
                            Ajouter un document
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique du dossier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TimelineTrackerModern
                      currentStatus={caseData?.status || 'initiated'}
                      paymentMethod={caseData?.payment_method || 'one_time'}
                      financingApproved={caseData?.financing_approved || false}
                      completedStages={WorkflowStatusService.getCompletedStages(caseData?.status || 'initiated')}
                      history={[]}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Participants */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participants
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Acheteur */}
                {caseData.buyer && (
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Avatar>
                      <AvatarFallback className="bg-blue-500 text-white">
                        {caseData.buyer.full_name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Acheteur</p>
                      <p className="font-semibold">{caseData.buyer.full_name || caseData.buyer.email}</p>
                      {caseData.buyer.email && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3" />
                          {caseData.buyer.email}
                        </p>
                      )}
                      {caseData.buyer.phone && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {caseData.buyer.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Vendeur */}
                {caseData.seller && (
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Avatar>
                      <AvatarFallback className="bg-green-500 text-white">
                        {caseData.seller.full_name?.charAt(0) || 'V'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Vendeur</p>
                      <p className="font-semibold">{caseData.seller.full_name || caseData.seller.email}</p>
                      {caseData.seller.email && (
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Mail className="h-3 w-3" />
                          {caseData.seller.email}
                        </p>
                      )}
                      {caseData.seller.phone && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {caseData.seller.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotaireCaseDetailModern;

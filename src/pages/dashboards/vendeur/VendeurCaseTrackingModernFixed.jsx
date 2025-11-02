/**
 * Page de suivi de dossier d'achat - Vendeur (Version Refondée)
 * Utilise les vrais statuts du workflow et supporte financement bancaire
 * @author Teranga Foncier Team
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Home, User, FileText, MessageSquare, Calendar, DollarSign,
  MapPin, Phone, Mail, Download, Upload, Send, Clock, CheckCircle,
  AlertCircle, Package, Building2, Eye, Edit, Trash2, Plus, X,
  FileCheck, CreditCard, Receipt, Banknote, TrendingUp, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import AppointmentScheduler from '@/components/purchase/AppointmentScheduler';
import ContractGenerator from '@/components/purchase/ContractGenerator';
import TimelineTrackerModern from '@/components/purchase/TimelineTrackerModern';
import SellerActionButtonsSection from '@/components/purchase/SellerActionButtonsSection';
import BankFinancingSection from '@/components/purchase/BankFinancingSection';
import UploadDocumentsModal from '@/components/modals/UploadDocumentsModal';
import NotarySelectionModal from '@/components/modals/NotarySelectionModal';
import WorkflowStatusService from '@/services/WorkflowStatusService';
import RealtimeNotificationService from '@/services/RealtimeNotificationService';
import NotaireAssignmentService from '@/services/NotaireAssignmentService';
import useRealtimeCaseSync from '@/hooks/useRealtimeCaseSync';

const VendeurCaseTrackingModernFixed = () => {
  const { caseNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [purchaseCase, setPurchaseCase] = useState(null);
  const [purchaseRequest, setPurchaseRequest] = useState(null);
  const [property, setProperty] = useState(null);
  const [buyer, setBuyer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [history, setHistory] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [notaireAssignment, setNotaireAssignment] = useState(null);

  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadModalConfig, setUploadModalConfig] = useState(null);
  const [showNotaryModal, setShowNotaryModal] = useState(false);
  const [showApproveNotaireDialog, setShowApproveNotaireDialog] = useState(false);
  const [isApprovingNotaire, setIsApprovingNotaire] = useState(false);

  // Use unified realtime sync hook
  useRealtimeCaseSync(purchaseCase?.id, () => loadCaseData());

  useEffect(() => {
    if (user && caseNumber) {
      loadCaseData();
    }
  }, [user, caseNumber]);

  const loadCaseData = async () => {
    try {
      setLoading(true);

      // 1. Charger le dossier d'achat (purchase_case) par case_number
      const { data: caseData, error: caseError } = await supabase
        .from('purchase_cases')
        .select('*')
        .eq('case_number', caseNumber)
        .single();

      if (caseError) {
        console.error('❌ Erreur chargement dossier:', caseError);
        toast.error('Dossier introuvable');
        setLoading(false);
        return;
      }

      setPurchaseCase(caseData);

      // 2. Charger la demande d'achat (request) si disponible
      let requestData = null;
      if (caseData?.request_id) {
        const { data: rData, error: requestError } = await supabase
          .from('requests')
          .select('*')
          .eq('id', caseData.request_id)
          .single();

        if (!requestError && rData) {
          requestData = rData;
          setPurchaseRequest(rData);
        }
      }

      // 3. Charger la parcelle (property)
      let propertyData = null;
      console.log('🏠 Tentative chargement propriété - parcelle_id:', caseData?.parcelle_id);
      console.log('🏠 Tentative chargement propriété - parcel_id:', caseData?.parcel_id);
      console.log('🏠 Tentative chargement propriété - property_id:', requestData?.property_id);
      
      // Essayer avec parcelle_id du case (ancien nom de colonne)
      const parcelIdToUse = caseData?.parcelle_id || caseData?.parcel_id;
      
      if (parcelIdToUse) {
        const { data: pData, error: propertyError } = await supabase
          .from('parcels')
          .select('*')
          .eq('id', parcelIdToUse)
          .single();

        if (!propertyError && pData) {
          console.log('✅ Propriété chargée depuis parcelle_id:', pData);
          propertyData = pData;
          setProperty(pData);
        } else {
          console.warn('⚠️ Erreur chargement propriété par parcelle_id:', propertyError);
        }
      }
      
      // Si pas trouvée, essayer avec property_id de la request
      if (!propertyData && requestData?.property_id) {
        const { data: pData, error: propertyError } = await supabase
          .from('parcels')
          .select('*')
          .eq('id', requestData.property_id)
          .single();

        if (!propertyError && pData) {
          console.log('✅ Propriété chargée depuis property_id:', pData);
          propertyData = pData;
          setProperty(pData);
        } else {
          console.warn('⚠️ Erreur chargement propriété par property_id:', propertyError);
        }
      }
      
      if (!propertyData) {
        console.error('❌ Aucune propriété trouvée pour ce dossier');
      }

      // 4. Charger le profil de l'acheteur
      if (requestData?.user_id) {
        const { data: buyerData, error: buyerError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', requestData.user_id)
          .single();

        if (!buyerError && buyerData) {
          setBuyer(buyerData);
        }
      }

      // 5. Charger les documents
      try {
        const { data: docsData, error: docsError } = await supabase
          .from('documents_administratifs')
          .select('*')
          .eq('purchase_request_id', caseData.request_id)
          .order('created_at', { ascending: false });

        if (!docsError) {
          setDocuments(docsData || []);
        }
      } catch (error) {
        console.warn('⚠️ Erreur documents:', error);
      }

      // 6. Charger les rendez-vous
      try {
        const { data: aptsData, error: aptsError } = await supabase
          .from('calendar_appointments')
          .select('*')
          .eq('purchase_request_id', caseData.request_id)
          .order('start_time', { ascending: true });

        if (!aptsError) {
          setAppointments(aptsData || []);
        }
      } catch (error) {
        console.warn('⚠️ Erreur rendez-vous:', error);
      }

      // 7. Charger l'historique
      try {
        const { data: historyData, error: historyError } = await supabase
          .from('purchase_case_history')
          .select('*')
          .eq('case_id', caseData.id)
          .order('created_at', { ascending: false });

        if (!historyError) {
          setHistory(historyData || []);
        }
      } catch (error) {
        console.warn('⚠️ Erreur historique:', error);
      }

      // 7b. Charger le timeline (événements réels)
      try {
        const { data: timelineData, error: timelineError } = await supabase
          .from('purchase_case_timeline')
          .select('*')
          .eq('case_id', caseData.id)
          .order('created_at', { ascending: false});
        
        if (!timelineError) {
          setTimeline(timelineData || []);
          console.log('📊 Timeline chargé:', timelineData?.length, 'événements');
        }
      } catch (error) {
        console.warn('⚠️ Erreur timeline:', error);
      }

      // 8. Charger les paiements (si user_id disponible)
      if (requestData?.user_id) {
        try {
          const { data: paymentsData, error: paymentsError } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', requestData.user_id)
            .order('created_at', { ascending: false});

          if (!paymentsError) {
            setPayments(paymentsData || []);
          }
        } catch (error) {
          console.warn('⚠️ Erreur paiements:', error);
        }
      }

      // 9. Charger l'assignation notaire
      if (caseData?.id) {
        try {
          const { data: assignmentData, error: assignmentError } = await supabase
            .from('notaire_case_assignments')
            .select(`
              *,
              notaire:profiles!notaire_id(id, full_name, email, phone, avatar_url)
            `)
            .eq('case_id', caseData.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (!assignmentError && assignmentData) {
            console.log('👨‍⚖️ Assignation notaire chargée:', assignmentData);
            // Stocker l'assignation dans le state (on va l'ajouter)
            setNotaireAssignment(assignmentData);
          }
        } catch (error) {
          console.warn('⚠️ Aucune assignation notaire:', error);
        }
      }

    } catch (error) {
      console.error('❌ Erreur chargement dossier:', error);
      toast.error('Erreur lors du chargement du dossier');
    } finally {
      setLoading(false);
    }
  };

  // Charger les messages du dossier (côté vendeur) - doit être au niveau racine des hooks
  useEffect(() => {
    const fetchMessages = async () => {
      if (!purchaseCase?.id) {
        setMessages([]);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('purchase_case_messages')
          .select('*')
          .eq('case_id', purchaseCase.id)
          .order('created_at', { ascending: false });
        if (!error) setMessages(data || []);
      } catch (err) {
        console.warn('⚠️ Erreur chargement messages (vendeur):', err);
      }
    };
    fetchMessages();
  }, [purchaseCase?.id]);

  // Realtime: messages (vendeur)
  useEffect(() => {
    if (!purchaseCase?.id) return;

    const channel = supabase
      .channel(`seller-case-messages-${purchaseCase.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'purchase_case_messages',
        filter: `case_id=eq.${purchaseCase.id}`
      }, (payload) => {
        setMessages((prev) => [payload.new, ...(prev || [])]);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'purchase_case_messages',
        filter: `case_id=eq.${purchaseCase.id}`
      }, (payload) => {
        const updated = payload.new;
        setMessages((prev) => (prev || []).map((m) => m.id === updated.id ? updated : m));
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'purchase_case_messages',
        filter: `case_id=eq.${purchaseCase.id}`
      }, (payload) => {
        const removed = payload.old;
        setMessages((prev) => (prev || []).filter((m) => m.id !== removed.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [purchaseCase?.id]);

  // Realtime: documents (vendeur)
  useEffect(() => {
    if (!purchaseCase?.request_id) return;
    const channel = supabase
      .channel(`seller-case-docs-${purchaseCase.request_id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'documents_administratifs',
        filter: `purchase_request_id=eq.${purchaseCase.request_id}`
      }, () => {
        (async () => {
          const { data, error } = await supabase
            .from('documents_administratifs')
            .select('*')
            .eq('purchase_request_id', purchaseCase.request_id)
            .order('created_at', { ascending: false });
          if (!error) setDocuments(data || []);
        })();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [purchaseCase?.request_id]);

  // Handler pour les actions du vendeur
  const handleSellerAction = async (action) => {
    console.log('🔔 Action vendeur:', action);
    
    switch (action.id) {
      case 'select_notary':
        setShowNotaryModal(true);
        break;
      
      case 'upload_title_deed':
        setUploadModalConfig({
          documentTypes: ['title_deed', 'land_certificate', 'tax_receipts'],
          action: action,
          nextStatus: 'seller_documents_submitted'
        });
        setShowUploadModal(true);
        break;
      
      case 'validate_contract':
        toast.info('Validation du contrat - Fonctionnalité en cours d\'implémentation');
        // TODO: Utiliser ContractGenerator existant pour afficher et valider le contrat
        break;
      
      case 'confirm_appointment':
        toast.info('Confirmation rendez-vous - Fonctionnalité en cours d\'implémentation');
        // TODO: Utiliser AppointmentScheduler existant
        break;
      
      default:
        toast.info('Action non implémentée: ' + action.label);
    }
  };

  // Handler pour succès upload
  const handleDocumentUploadSuccess = async () => {
    toast.success('Documents uploadés avec succès !');
    setShowUploadModal(false);
    setUploadModalConfig(null);
    await loadCaseData(); // Recharger les données
  };

  // Handler pour succès sélection notaire
  const handleNotarySelected = async (notary) => {
    toast.success(`Notaire ${notary.profile?.full_name} proposé !`);
    setShowNotaryModal(false);
    await loadCaseData(); // Recharger les données
  };

  const handleApproveNotaire = async () => {
    if (!notaireAssignment) {
      toast.error('Aucune assignation notaire trouvée');
      return;
    }

    try {
      setIsApprovingNotaire(true);

      const result = await NotaireAssignmentService.approveNotaire(
        notaireAssignment.id,
        user.id,
        'seller'
      );

      if (result.success) {
        if (result.bothApproved) {
          toast.success('Notaire approuvé ! Les deux parties ont approuvé. Le notaire peut maintenant accepter le dossier.');
        } else {
          toast.success('Notaire approuvé ! En attente de l\'approbation de l\'acheteur.');
        }
        
        setShowApproveNotaireDialog(false);
        await loadCaseData();
      } else {
        toast.error(result.error || 'Erreur lors de l\'approbation');
      }
    } catch (error) {
      console.error('❌ Erreur approbation notaire:', error);
      toast.error('Erreur lors de l\'approbation du notaire');
    } finally {
      setIsApprovingNotaire(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        case_id: purchaseCase?.id,
        sent_by: user.id,
        message: newMessage.trim(),
        message_type: 'text',
      };

      const { error } = await supabase
        .from('purchase_case_messages')
        .insert([messageData]);

      if (error) throw error;

      setNewMessage('');
      toast.success('Message envoyé');
      loadCaseData();
    } catch (error) {
      console.error('❌ Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const uploadDocument = async (file, documentType) => {
    try {
      const fileName = `${Date.now()}_${file.name}`;
      // Do not prefix with bucket name; use a path compatible with RLS like userId/caseId/filename
      const filePath = `${user.id}/${purchaseCase.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, { upsert: true, contentType: file.type || undefined });

      if (uploadError) throw uploadError;

      // Try to get a public URL (works only if bucket/object is public)
      const { data: publicData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const { data: docData, error: docError } = await supabase
        .from('documents_administratifs')
        .insert([{
          user_id: user.id,
          purchase_request_id: purchaseCase.request_id,
          file_name: file.name,
          title: file.name,
          document_type: documentType,
          file_format: file.type.split('/')[1] || null,
          file_size: `${(file.size / 1024).toFixed(2)} KB`,
          storage_path: filePath,
          document_url: publicData?.publicUrl || null,
          status: 'pending',
          uploaded_by: user.id,
        }])
        .select()
        .single();

      if (docError) throw docError;

      toast.success('Document téléchargé avec succès');
      // Don't call loadCaseData() - Realtime subscription will update documents
    } catch (error) {
      console.error('❌ Erreur upload document:', error);
      toast.error('Erreur lors du téléchargement du document');
    }
  };

  // ✅ CORRECTION: Utiliser le vrai progress_percentage du dossier
  const calculateProgress = () => {
    if (purchaseCase?.progress_percentage !== undefined && purchaseCase?.progress_percentage !== null) {
      return purchaseCase.progress_percentage;
    }
    // Fallback: calculer à partir du statut
    return WorkflowStatusService.calculateProgressFromStatus(purchaseCase?.status || 'initiated');
  };

  const calculatePaymentsProgress = () => {
    if (!payments || payments.length === 0) return 0;
    const paid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
    const total = purchaseCase?.purchase_price || purchaseCase?.negotiated_price || purchaseCase?.amount || 1;
    return (paid / total) * 100;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const getStatusColor = (status) => {
    return WorkflowStatusService.getColor(status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!purchaseCase) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Dossier introuvable</h2>
        <Button onClick={() => navigate('/vendeur/purchase-requests')}>
          Retour aux demandes d'achat
        </Button>
      </div>
    );
  }

  const progress = calculateProgress();
  const paymentsProgress = calculatePaymentsProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/vendeur/purchase-requests')}
            className="mb-3 sm:mb-4 text-xs sm:text-sm"
            size="sm"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Retour aux demandes</span>
            <span className="sm:hidden">Retour</span>
          </Button>

          <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                {property?.title || 'Propriété'}
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="line-clamp-1">{property?.location || 'Localisation non disponible'}</span>
              </p>
            </div>

            <div className="text-left sm:text-right w-full sm:w-auto">
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">
                {formatPrice(purchaseCase?.negotiated_price || purchaseCase?.purchase_price || purchaseCase?.amount || 0)}
              </div>
              <p className="text-xs sm:text-sm text-gray-500">Montant du dossier</p>
              <Badge className={cn('mt-2', getStatusColor(purchaseCase?.status))}>
                {WorkflowStatusService.getLabel(purchaseCase?.status || 'initiated')}
              </Badge>
            </div>
          </div>

          {/* Barre de progression - Utilise le vrai progress_percentage */}
          <Card className="mt-4 sm:mt-6">
            <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm font-medium">
                  <span className="hidden sm:inline">Progression du dossier </span>
                  <span className="sm:hidden">Progression </span>
                  (Phase {purchaseCase?.phase || 1})
                </span>
                <span className="text-xs sm:text-sm font-bold text-purple-600">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2 sm:h-3" />
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {/* Colonne gauche */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Section Boutons d'Actions */}
            <SellerActionButtonsSection
              currentStatus={purchaseCase?.status}
              caseData={purchaseCase}
              onActionClick={handleSellerAction}
              loading={false}
            />

            {/* Card d'approbation notaire si assignation en attente */}
            {notaireAssignment && !notaireAssignment.seller_approved && (
              <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <User className="h-5 w-5" />
                    Notaire proposé - Approbation requise
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-lg">
                          {notaireAssignment.notaire?.full_name || 'Notaire'}
                        </p>
                        {notaireAssignment.notaire?.email && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                            <Mail className="h-4 w-4" />
                            {notaireAssignment.notaire.email}
                          </p>
                        )}
                        {notaireAssignment.notaire?.phone && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                            <Phone className="h-4 w-4" />
                            {notaireAssignment.notaire.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className={`h-4 w-4 ${notaireAssignment.buyer_approved ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={notaireAssignment.buyer_approved ? 'text-green-700 dark:text-green-400' : 'text-gray-500'}>
                          {notaireAssignment.buyer_approved ? 'Approuvé par l\'acheteur' : 'En attente de l\'acheteur'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-blue-700 dark:text-blue-400 font-semibold">
                          Votre approbation est requise
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowApproveNotaireDialog(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver ce notaire
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                  Suivi du dossier
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 lg:p-6">
                <TimelineTrackerModern
                  currentStatus={purchaseCase?.status || 'initiated'}
                  paymentMethod={purchaseCase?.payment_method || 'one_time'}
                  financingApproved={purchaseCase?.financing_approved || false}
                  completedStages={WorkflowStatusService.getCompletedStages(purchaseCase?.status || 'initiated')}
                  history={history}
                  timeline={timeline}
                />
              </CardContent>
            </Card>

            {/* Section Financement Bancaire - Affichée si payment_method='bank_financing' */}
            <BankFinancingSection
              paymentMethod={purchaseCase?.payment_method}
              financingApproved={purchaseCase?.financing_approved}
              bankName={purchaseCase?.metadata?.bank_name || null}
              loanAmount={purchaseCase?.metadata?.loan_amount || null}
              approvedAmount={purchaseCase?.metadata?.approved_amount || null}
              estimatedDisbursementDate={purchaseCase?.metadata?.estimated_disbursement_date || null}
              conditions={purchaseCase?.metadata?.financing_conditions || []}
            />

            {/* Tabs */}
            <Card>
              <CardContent className="pt-4 sm:pt-6 p-3 sm:p-4 lg:p-6">
                <Tabs defaultValue="documents">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1 sm:gap-0 h-auto sm:h-10">
                    <TabsTrigger value="documents" className="text-xs sm:text-sm px-2 py-2 sm:py-0">
                      <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Documents</span>
                      <span className="sm:hidden">Docs</span>
                    </TabsTrigger>
                    <TabsTrigger value="messages" className="text-xs sm:text-sm px-2 py-2 sm:py-0">
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden lg:inline">Messages ({messages.length})</span>
                      <span className="lg:hidden">Msg ({messages.length})</span>
                    </TabsTrigger>
                    <TabsTrigger value="appointments" className="text-xs sm:text-sm px-2 py-2 sm:py-0">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">RDV</span>
                      <span className="sm:hidden">📅</span>
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="text-xs sm:text-sm px-2 py-2 sm:py-0">
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Paiements</span>
                      <span className="sm:hidden">💰</span>
                    </TabsTrigger>
                    <TabsTrigger value="history" className="text-xs sm:text-sm px-2 py-2 sm:py-0">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Historique</span>
                      <span className="sm:hidden">⏱️</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Documents */}
                  <TabsContent value="documents" className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Documents du dossier</h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Télécharger un document</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Fichier</Label>
                              <Input 
                                type="file" 
                                onChange={(e) => e.target.files?.[0] && uploadDocument(e.target.files[0], 'other')} 
                              />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <ScrollArea className="h-96">
                      <div className="space-y-3 pr-4">
                        {documents.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Aucun document
                          </div>
                        ) : (
                          documents.map((doc) => (
                            <Card key={doc.id} className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                                  <div>
                                    <p className="font-medium">{doc.title}</p>
                                    <p className="text-sm text-gray-500">{doc.file_size}</p>
                                  </div>
                                </div>
                                <Badge className={getStatusColor(doc.status)}>
                                  {doc.status}
                                </Badge>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* Messages */}
                  <TabsContent value="messages" className="space-y-4">
                    <ScrollArea className="h-96 border rounded-lg p-4">
                      <div className="space-y-4 pr-4">
                        {messages.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Aucun message
                          </div>
                        ) : (
                          messages.map((msg) => (
                            <div key={msg.id} className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                {msg.sent_by === user.id ? (
                                  <AvatarImage src={user?.avatar_url} alt={user?.full_name || 'Vous'} />
                                ) : (
                                  <AvatarImage src={buyer?.avatar_url} alt={buyer?.full_name || 'Acheteur'} />
                                )}
                                <AvatarFallback>
                                  {msg.sent_by === user.id
                                    ? (user?.full_name?.split(' ')?.map(n => n[0]).join('').toUpperCase() || 'V')
                                    : (buyer?.full_name?.split(' ')?.map(n => n[0]).join('').toUpperCase() || 'A')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{msg.sent_by === user.id ? 'Vous' : (buyer?.full_name || 'Acheteur')}</p>
                                <p className="text-sm text-gray-700">{msg.message || msg.content}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {msg.created_at && format(new Date(msg.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>

                    {buyer && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Votre message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                        />
                        <Button onClick={(e) => { e.preventDefault(); sendMessage(); }} type="button" size="sm">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Rendez-vous */}
                  <TabsContent value="appointments" className="space-y-4">
                    <ScrollArea className="h-96">
                      <div className="space-y-3 pr-4">
                        {appointments.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Aucun rendez-vous
                          </div>
                        ) : (
                          appointments.map((apt) => (
                            <Card key={apt.id} className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-sm">{apt.title || 'Rendez-vous'}</p>
                                  <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {apt.start_time && format(new Date(apt.start_time), 'dd MMM yyyy à HH:mm', { locale: fr })}
                                  </p>
                                  {apt.location && (
                                    <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {apt.location}
                                    </p>
                                  )}
                                </div>
                                <Badge className={getStatusColor(apt.status)}>
                                  {apt.status || 'planned'}
                                </Badge>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* Paiements */}
                  <TabsContent value="payments" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Progression des paiements</span>
                          <span className="text-sm text-gray-600">{Math.round(paymentsProgress)}%</span>
                        </div>
                        <Progress value={paymentsProgress} className="h-2" />
                      </div>

                      <ScrollArea className="h-80">
                        <div className="space-y-3 pr-4">
                          {payments.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              Aucun paiement
                            </div>
                          ) : (
                            payments.map((payment) => (
                              <Card key={payment.id} className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{formatPrice(payment.amount)}</p>
                                    <p className="text-sm text-gray-500">
                                      {payment.created_at && format(new Date(payment.created_at), 'dd MMM yyyy', { locale: fr })}
                                    </p>
                                  </div>
                                  <Badge className={getStatusColor(payment.status)}>
                                    {payment.status}
                                  </Badge>
                                </div>
                              </Card>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  {/* Historique */}
                  <TabsContent value="history" className="space-y-4">
                    <ScrollArea className="h-96">
                      <div className="space-y-3 pr-4">
                        {history.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            Aucun historique
                          </div>
                        ) : (
                          history.map((entry) => (
                            <Card key={entry.id} className="p-4">
                              <div className="flex gap-3">
                                <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-sm">{entry.action}</p>
                                  <p className="text-sm text-gray-600">{entry.description}</p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {entry.created_at && format(new Date(entry.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite - Infos acheteur et actions */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Infos acheteur */}
            <Card>
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-base sm:text-lg">Acheteur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6 pt-0">
                {buyer ? (
                  <>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                        <AvatarImage src={buyer?.avatar_url} alt={buyer?.full_name} />
                        <AvatarFallback className="text-xs sm:text-sm">
                          {buyer?.full_name?.split(' ')?.map(n => n[0]).join('').toUpperCase() || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base truncate">
                          {buyer?.full_name || 'Acheteur'}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{buyer?.email}</p>
                      </div>
                    </div>
                    {buyer?.phone && (
                      <Button variant="outline" className="w-full text-xs sm:text-sm" size="sm">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        {buyer?.phone}
                      </Button>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">Acheteur non disponible</p>
                )}
              </CardContent>
            </Card>

            {/* Infos propriété */}
            <Card>
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-base sm:text-lg">Propriété</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6 pt-0">
                {property ? (
                  <>
                    {/* Image de la propriété - Support multi-format */}
                    {(() => {
                      // Gérer plusieurs formats d'image possibles
                      let imageUrl = null;
                      if (property?.image_url || property?.photo_url) {
                        imageUrl = property.image_url || property.photo_url;
                      } else if (property?.image || property?.photo) {
                        imageUrl = property.image || property.photo;
                      } else if (property?.images && Array.isArray(property.images) && property.images.length > 0) {
                        imageUrl = property.images[0];
                      } else if (property?.images && typeof property.images === 'string') {
                        try {
                          const parsed = JSON.parse(property.images);
                          if (Array.isArray(parsed) && parsed.length > 0) {
                            imageUrl = parsed[0];
                          }
                        } catch (e) {
                          imageUrl = property.images;
                        }
                      }

                      return imageUrl ? (
                        <div className="w-full h-32 sm:h-40 rounded-lg overflow-hidden bg-gray-100">
                          <img 
                            src={imageUrl} 
                            alt={property.title || property.name || 'Propriété'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('❌ Erreur chargement image:', e.target.src);
                              e.target.style.display = 'none';
                              e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
                            }}
                          />
                          <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                            <Building2 className="w-12 h-12 text-gray-300" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-32 sm:h-40 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Building2 className="w-12 h-12 text-gray-300" />
                        </div>
                      );
                    })()}
                    {/* Référence */}
                    {property.id && (
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Référence</p>
                        <p className="font-mono text-xs font-semibold text-gray-700">{property.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Titre</p>
                      <p className="font-semibold text-sm sm:text-base break-words">{property.title || property.name || 'Sans titre'}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Localisation</p>
                      <p className="font-semibold text-sm sm:text-base break-words">{property.location || property.address || property.commune || property.city || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Surface</p>
                      <p className="font-semibold text-sm sm:text-base">{property.surface || property.area || property.size || property.superficie || 'N/A'} m²</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Prix initial</p>
                      <p className="font-semibold text-base sm:text-lg">
                        {formatPrice(property.price || property.prix || 0)}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">Propriété non disponible</p>
                )}
              </CardContent>
            </Card>

            {/* Prochains rendez-vous */}
            {appointments.length > 0 && (
              <Card>
                <CardHeader className="p-3 sm:p-4 lg:p-6">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Rendez-vous planifiés</span>
                    <span className="sm:hidden">RDV</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4 lg:p-6 pt-0">
                  {appointments.slice(0, 3).map((apt) => (
                    <div key={apt.id} className="p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="font-medium text-xs sm:text-sm line-clamp-2">{apt.title}</p>
                      <p className="text-[10px] sm:text-xs text-gray-600 mt-1 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                        {format(new Date(apt.start_time), 'dd MMM yyyy à HH:mm', { locale: fr })}
                      </p>
                      {apt.location && (
                        <p className="text-[10px] sm:text-xs text-gray-600 mt-1 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                          <span className="line-clamp-1">{apt.location}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardHeader className="p-3 sm:p-4 lg:p-6">
                <CardTitle className="text-base sm:text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-4 lg:p-6 pt-0">
                {purchaseCase && (
                  <>
                    {purchaseRequest?.id ? (
                      <AppointmentScheduler
                        purchaseRequestId={purchaseRequest.id}
                        userId={user.id}
                        onAppointmentCreated={() => {
                          // Appointment created - Realtime subscription will update
                        }}
                      />
                    ) : (
                      <Button disabled className="w-full gap-2 text-xs sm:text-sm" size="sm">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        Rendez-vous indisponible
                      </Button>
                    )}

                    <ContractGenerator
                      purchaseRequest={purchaseRequest}
                      buyer={buyer}
                      seller={user}
                      property={property}
                      onContractGenerated={() => {
                        // Contract generated - Realtime subscription will update
                      }}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showUploadModal && uploadModalConfig && (
        <UploadDocumentsModal
          isOpen={showUploadModal}
          onClose={() => {
            setShowUploadModal(false);
            setUploadModalConfig(null);
          }}
          caseData={purchaseCase}
          documentTypes={uploadModalConfig.documentTypes}
          action={uploadModalConfig.action}
          nextStatus={uploadModalConfig.nextStatus}
          onSuccess={handleDocumentUploadSuccess}
        />
      )}

      {showNotaryModal && purchaseCase && (
        <NotarySelectionModal
          isOpen={showNotaryModal}
          onClose={() => setShowNotaryModal(false)}
          caseId={purchaseCase.id}
          onNotarySelected={handleNotarySelected}
        />
      )}

      {/* Dialog d'approbation notaire */}
      <Dialog open={showApproveNotaireDialog} onOpenChange={setShowApproveNotaireDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approuver le notaire proposé</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Confirmez-vous que vous acceptez le notaire <strong>{notaireAssignment?.notaire?.full_name}</strong> pour ce dossier ?
            </p>
            
            {notaireAssignment?.buyer_approved && (
              <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  L'acheteur a déjà approuvé ce notaire
                </p>
              </div>
            )}

            <p className="text-xs text-gray-500">
              Une fois les deux parties (vous et l'acheteur) approuvées, le notaire pourra accepter le dossier et commencer la préparation du contrat.
            </p>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowApproveNotaireDialog(false)}
                disabled={isApprovingNotaire}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleApproveNotaire}
                disabled={isApprovingNotaire}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isApprovingNotaire ? 'Approbation...' : 'Confirmer l\'approbation'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendeurCaseTrackingModernFixed;

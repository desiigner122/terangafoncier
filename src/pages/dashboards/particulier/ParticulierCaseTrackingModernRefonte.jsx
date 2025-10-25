/**
 * Page de suivi de dossier d'achat - Acheteur (Version Refonte 2025)
 * Synchronisée avec VendeurCaseTrackingModernFixed pour cohérence totale
 * @author Teranga Foncier Team
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Home, User, FileText, MessageSquare, Calendar, DollarSign,
  MapPin, Phone, Mail, Download, Upload, Send, Clock, CheckCircle,
  AlertCircle, Package, Building2, Eye, Edit, Trash2, Plus, X,
  FileCheck, CreditCard, Receipt, Banknote, TrendingUp, ChevronRight,
  Sparkles, Shield, BadgeCheck, Info, Users, XCircle
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
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import AppointmentScheduler from '@/components/purchase/AppointmentScheduler';
import ContractGenerator from '@/components/purchase/ContractGenerator';
import TimelineTrackerModern from '@/components/purchase/TimelineTrackerModern';
import BankFinancingSection from '@/components/purchase/BankFinancingSection';
import WorkflowStatusService from '@/services/WorkflowStatusService';
import RealtimeNotificationService from '@/services/RealtimeNotificationService';

const STATUS_META = {
  initiated: { label: 'Dossier créé', color: 'blue', icon: Clock },
  buyer_verification: { label: 'Vérification acheteur', color: 'blue', icon: Users },
  seller_notification: { label: 'Notification vendeur', color: 'blue', icon: MessageSquare },
  negotiation: { label: 'Négociation', color: 'purple', icon: MessageSquare },
  preliminary_agreement: { label: 'Accord préalable', color: 'green', icon: FileCheck },
  contract_preparation: { label: 'Préparation contrat', color: 'purple', icon: FileText },
  legal_verification: { label: 'Analyse juridique', color: 'purple', icon: FileText },
  document_audit: { label: 'Documents', color: 'purple', icon: FileText },
  property_evaluation: { label: 'Évaluation', color: 'purple', icon: FileText },
  notary_appointment: { label: 'RDV notaire', color: 'blue', icon: Calendar },
  signing_process: { label: 'Signature', color: 'blue', icon: FileCheck },
  payment_processing: { label: 'Paiement', color: 'green', icon: DollarSign },
  property_transfer: { label: 'Transfert', color: 'green', icon: Home },
  completed: { label: 'Terminé', color: 'green', icon: CheckCircle },
  cancelled: { label: 'Annulé', color: 'red', icon: XCircle },
  rejected: { label: 'Rejeté', color: 'red', icon: XCircle },
  seller_declined: { label: 'Refus vendeur', color: 'red', icon: XCircle },
  negotiation_failed: { label: 'Échec négociation', color: 'red', icon: XCircle },
  legal_issues_found: { label: 'Blocage légal', color: 'red', icon: AlertCircle },
  archived: { label: 'Archivé', color: 'gray', icon: FileText },
};

const STATUS_BADGE_CLASSES = {
  blue: 'bg-blue-500 text-white',
  purple: 'bg-purple-500 text-white',
  green: 'bg-green-500 text-white',
  red: 'bg-red-500 text-white',
  yellow: 'bg-yellow-500 text-white',
  orange: 'bg-orange-500 text-white',
  gray: 'bg-gray-500 text-white',
};

const ParticulierCaseTrackingModernRefonte = () => {
  const { caseNumber, caseId } = useParams(); // Support des deux formats de route
  const caseIdentifier = caseNumber || caseId; // Utilise le paramètre disponible
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [purchaseCase, setPurchaseCase] = useState(null);
  const [purchaseRequest, setPurchaseRequest] = useState(null);
  const [property, setProperty] = useState(null);
  const [seller, setSeller] = useState(null);
  const [buyerProfile, setBuyerProfile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [history, setHistory] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    if (user && caseIdentifier) {
      loadCaseData();
      setupRealtimeSubscriptions();
    }

    return () => {
      RealtimeNotificationService.unsubscribeAll();
    };
  }, [user, caseIdentifier]);

  const loadCaseData = async () => {
    try {
      setLoading(true);

      // 1. Charger le dossier d'achat - gérer caseId (UUID) ou caseNumber
      let caseData = null;
      let caseError = null;

      // Essayer d'abord avec case_number (si c'est un format CASE-XXXX ou TF-XXXXXXXX-XXXX)
      const isCaseNumber = caseIdentifier.includes('-') && !caseIdentifier.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      
      if (isCaseNumber) {
        console.log('🔍 Recherche par case_number:', caseIdentifier);
        const { data, error } = await supabase
          .from('purchase_cases')
          .select('*')
          .eq('case_number', caseIdentifier)
          .single();
        caseData = data;
        caseError = error;
      } else {
        // C'est probablement un UUID, rechercher par id
        console.log('🔍 Recherche par id (UUID):', caseIdentifier);
        const { data, error } = await supabase
          .from('purchase_cases')
          .select('*')
          .eq('id', caseIdentifier)
          .single();
        caseData = data;
        caseError = error;
      }

      if (caseError || !caseData) {
        console.error('❌ Erreur chargement dossier:', caseError);
        toast.error('Dossier introuvable');
        setLoading(false);
        return;
      }

      // Vérifier que l'utilisateur est bien l'acheteur du dossier
      if (caseData.buyer_id !== user.id) {
        console.error('❌ Accès refusé - vous n\'êtes pas l\'acheteur de ce dossier');
        toast.error('Vous n\'avez pas accès à ce dossier');
        navigate('/acheteur/mes-achats');
        setLoading(false);
        return;
      }

      console.log('📋 Dossier chargé (acheteur):', caseData);
      const normalizedCaseStatus = WorkflowStatusService.normalizeStatus(
        caseData.status || caseData.current_status
      );
      const enhancedCaseData = {
        ...caseData,
        status: normalizedCaseStatus,
        current_status: normalizedCaseStatus, // For backwards compatibility
      };
      setPurchaseCase(enhancedCaseData);

      // 2. Charger la demande d'achat (request) si disponible
      let requestData = null;
      if (enhancedCaseData?.request_id) {
        const { data: rData, error: requestError } = await supabase
          .from('requests')
          .select('*')
          .eq('id', enhancedCaseData.request_id)
          .single();

        if (!requestError && rData) {
          let requestMetadata = {};
          if (rData.data) {
            try {
              requestMetadata = typeof rData.data === 'string' ? JSON.parse(rData.data) : rData.data;
            } catch (parseError) {
              console.warn('⚠️ Impossible de parser requests.data:', parseError);
            }
          }

          const normalizedRequestStatus = WorkflowStatusService.normalizeStatus(
            rData.status || requestMetadata.status
          );

          requestData = {
            ...rData,
            normalized_status: normalizedRequestStatus,
            metadata: requestMetadata,
          };

          setPurchaseRequest(requestData);
          console.log('📝 Request chargée:', requestData);
        }
      }

      // 3. Charger la propriété (parcelle)
      let propertyData = null;
  console.log('🏠 Tentative chargement propriété - parcelle_id:', enhancedCaseData?.parcelle_id);
      
  const parcelIdToUse = enhancedCaseData?.parcelle_id || enhancedCaseData?.parcel_id;
      
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
      
      // Fallback: essayer avec property_id de la request
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
        }
      }

      // 4. Charger le profil du vendeur
      if (enhancedCaseData?.seller_id) {
        const { data: sellerData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', enhancedCaseData.seller_id)
          .single();
        
        if (sellerData) {
          console.log('👤 Vendeur chargé:', sellerData);
          setSeller(sellerData);
        }
      }

      // 5. Charger le profil acheteur (l'utilisateur actuel)
      if (user?.id) {
        const { data: buyerData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (buyerData) {
          setBuyerProfile(buyerData);
        }
      }

      // 6. Charger les messages
      const { data: messagesData } = await supabase
        .from('purchase_case_messages')
        .select('*')
        .eq('case_id', enhancedCaseData.id)
        .order('created_at', { ascending: false });
      setMessages(messagesData || []);

      // 7. Charger les documents
      const { data: documentsData } = await supabase
        .from('documents_administratifs')
        .select('*')
        .eq('purchase_request_id', enhancedCaseData.request_id)
        .order('created_at', { ascending: false });
      setDocuments(documentsData || []);

      // 8. Charger les rendez-vous (avec gestion d'erreur si colonne manquante)
      try {
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('calendar_appointments')
          .select('*')
          .eq('purchase_request_id', enhancedCaseData.request_id)
          .order('start_time', { ascending: true });
        
        if (!appointmentsError) {
          setAppointments(appointmentsData || []);
        } else {
          console.warn('⚠️ Erreur chargement rendez-vous (colonne manquante?):', appointmentsError);
          setAppointments([]);
        }
      } catch (err) {
        console.warn('⚠️ Impossible de charger les rendez-vous:', err);
        setAppointments([]);
      }

      // 9. Charger les paiements (user_id de l'acheteur)
      if (user?.id) {
        const { data: paymentsData } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        setPayments(paymentsData || []);
      }

      // 10. Charger l'historique
      const { data: historyData } = await supabase
        .from('purchase_case_history')
        .select('*')
        .eq('case_id', enhancedCaseData.id)
        .order('created_at', { ascending: false });
      const normalizedHistory = (historyData || []).map((entry) => ({
        ...entry,
        status: WorkflowStatusService.normalizeStatus(entry.status),
        new_status: WorkflowStatusService.normalizeStatus(entry.new_status || entry.status),
      }));
      setHistory(normalizedHistory);

      setLoading(false);
    } catch (error) {
      console.error('❌ Erreur globale loadCaseData:', error);
      toast.error('Erreur de chargement');
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    try {
      // Don't use setupCaseTracking with auto-reload - let granular subscriptions handle updates
      // RealtimeNotificationService.setupCaseTracking will reload the entire page, which is not desired
      console.log('✅ Realtime subscriptions en place (granular subscriptions for messages/documents/appointments)');
    } catch (error) {
      console.error('Erreur setup Realtime:', error);
    }
  };

  // Realtime: messages du dossier (INSERT/UPDATE/DELETE)
  useEffect(() => {
    if (!purchaseCase?.id) return;

    const channel = supabase
      .channel(`case-messages-${purchaseCase.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'purchase_case_messages',
        filter: `case_id=eq.${purchaseCase.id}`
      }, (payload) => {
        const newMsg = payload.new;
        setMessages((prev) => [newMsg, ...(prev || [])]);
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

  // Realtime: documents administratifs du dossier (INSERT/UPDATE/DELETE)
  useEffect(() => {
    if (!purchaseCase?.request_id) return;

    const channel = supabase
      .channel(`case-docs-${purchaseCase.request_id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'documents_administratifs',
        filter: `purchase_request_id=eq.${purchaseCase.request_id}`
      }, () => {
        // Recharger rapidement les documents
        (async () => {
          const { data } = await supabase
            .from('documents_administratifs')
            .select('*')
            .eq('purchase_request_id', purchaseCase.request_id)
            .order('created_at', { ascending: false });
          setDocuments(data || []);
        })();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [purchaseCase?.request_id]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !purchaseCase?.id) return;

    try {
      const { error } = await supabase
        .from('purchase_case_messages')
        .insert({
          case_id: purchaseCase.id,
          sent_by: user.id,
          message: newMessage.trim(),
          message_type: 'text'
        });

      if (error) throw error;

      toast.success('Message envoyé');
      setNewMessage('');
      // Don't call loadCaseData() here - Realtime subscription will handle updates
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const uploadDocument = async (file, documentType) => {
    if (!purchaseRequest?.id || !file) return;

    try {
      setUploadingDoc(true);
      const fileName = `${Date.now()}_${file.name}`;
      // Important: filePath must NOT repeat the bucket name. Use userId/caseId/filename to satisfy common RLS policies
      const filePath = `${user.id}/${purchaseCase.id}/${fileName}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, { upsert: true, contentType: file.type || undefined });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Insert document record
      const { error: insertError } = await supabase
        .from('documents_administratifs')
        .insert({
          purchase_request_id: purchaseRequest.id,
          document_type: documentType,
          document_url: publicUrl,
          uploaded_by: user.id,
          status: 'uploaded'
        });

      if (insertError) throw insertError;

      toast.success('Document uploadé avec succès');
      loadCaseData();
    } catch (error) {
      console.error('Erreur upload document:', error);
      toast.error('Erreur lors de l\'upload du document');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handlePayment = async (amount, paymentType) => {
    if (!user?.id || !purchaseCase?.id) return;

    try {
      const { error } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          amount: parseFloat(amount),
          payment_type: paymentType,
          payment_method: 'bank_transfer',
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Paiement enregistré');
      loadCaseData();
    } catch (error) {
      console.error('Erreur enregistrement paiement:', error);
      toast.error('Erreur lors de l\'enregistrement du paiement');
    }
  };

  const getStatusInfo = (status) => {
    const info = WorkflowStatusService.getStatusInfo(status);
    const meta = STATUS_META[info.key] || STATUS_META.initiated;
    const badgeClass = STATUS_BADGE_CLASSES[meta.color] || STATUS_BADGE_CLASSES.blue;

    return {
      ...meta,
      label: info.label || meta.label,
      color: meta.color,
      badgeClass,
      key: info.key,
      isTerminal: info.isTerminal,
    };
  };

  const calculateProgress = () => {
    if (!purchaseCase?.status) return 0;
    return WorkflowStatusService.calculateProgressFromStatus(purchaseCase.status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement du dossier...</p>
        </div>
      </div>
    );
  }

  if (!purchaseCase) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-6 h-6" />
              Dossier introuvable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Le dossier #{caseIdentifier} n'existe pas ou vous n'y avez pas accès.
            </p>
            <Button onClick={() => navigate('/dashboard/particulier')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusInfo(purchaseCase.status);
  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header moderne avec gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard/particulier')}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">Dossier #{purchaseCase.case_number}</h1>
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "px-3 py-1 text-sm font-medium",
                      statusInfo.badgeClass
                    )}
                  >
                    <statusInfo.icon className="w-4 h-4 mr-1 inline" />
                    {statusInfo.label}
                  </Badge>
                </div>
                <p className="text-blue-100 text-sm mt-1">
                  Créé le {format(new Date(purchaseCase.created_at), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white px-4 py-2">
                <User className="w-4 h-4 mr-2" />
                Acheteur
              </Badge>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-100">Progression du dossier</span>
              <span className="text-sm font-bold text-white">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne gauche: Détails */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte propriété */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Building2 className="w-5 h-5" />
                  Propriété concernée
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {property ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{property.title || property.name}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span>{property.location || property.address || 'Non spécifié'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Package className="w-4 h-4 text-green-600" />
                          <span>Surface: {property.area || property.size || 'N/A'} m²</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="font-bold text-green-700">
                            {property.price ? `${property.price.toLocaleString()} FCFA` : 'Prix non défini'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {(property.image_url || property.photo_url || property.image || property.photo) && (
                      <div className="rounded-lg overflow-hidden shadow-md">
                        <img
                          src={property.image_url || property.photo_url || property.image || property.photo}
                          alt={property.title || 'Propriété'}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Aucune propriété associée</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline du workflow */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <TrendingUp className="w-5 h-5" />
                  Suivi du processus
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <TimelineTrackerModern
                  caseData={purchaseCase}
                  onStatusChange={loadCaseData}
                />
              </CardContent>
            </Card>

            {/* Onglets: Documents, RDV, Messages, Paiements */}
            <Card className="border-none shadow-lg">
              <CardContent className="pt-6">
                <Tabs defaultValue="messages" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="messages" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Messages
                      {messages.length > 0 && (
                        <Badge variant="secondary" className="ml-1">{messages.length}</Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="documents" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Documents
                      {documents.length > 0 && (
                        <Badge variant="secondary" className="ml-1">{documents.length}</Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="appointments" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Rendez-vous
                      {appointments.length > 0 && (
                        <Badge variant="secondary" className="ml-1">{appointments.length}</Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Paiements
                      {payments.length > 0 && (
                        <Badge variant="secondary" className="ml-1">{payments.length}</Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  {/* Messages */}
                  <TabsContent value="messages" id="messages-section">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {messages.length > 0 ? (
                          messages.map((msg) => (
                            <motion.div
                              key={msg.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={cn(
                                "flex gap-3 p-4 rounded-lg",
                                msg.sent_by === user?.id
                                  ? "bg-blue-50 ml-8"
                                  : "bg-gray-50 mr-8"
                              )}
                            >
                              <Avatar className="w-10 h-10">
                                <AvatarFallback>
                                  {msg.sent_by === user?.id ? 'V' : 'A'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-sm">
                                    {msg.sent_by === user?.id ? 'Vous' : seller?.full_name || 'Vendeur'}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {format(new Date(msg.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">{msg.message}</p>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-12 text-gray-500">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Aucun message pour le moment</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                    <Separator className="my-4" />

                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Écrivez votre message au vendeur..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={3}
                        className="resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={(e) => { e.preventDefault(); sendMessage(); }}
                        disabled={!newMessage.trim()}
                        className="self-end"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Documents */}
                  <TabsContent value="documents">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Documents administratifs</h3>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Upload className="w-4 h-4 mr-2" />
                              Uploader un document
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Ajouter un document</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                              <div>
                                <Label>Type de document</Label>
                                <Input placeholder="Ex: Titre de propriété, CNI..." />
                              </div>
                              <div>
                                <Label>Fichier</Label>
                                <Input
                                  type="file"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) uploadDocument(file, 'general');
                                  }}
                                />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <ScrollArea className="h-[350px]">
                        {documents.length > 0 ? (
                          <div className="space-y-3">
                            {documents.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="w-8 h-8 text-blue-600" />
                                  <div>
                                    <p className="font-medium text-sm">{doc.document_type}</p>
                                    <p className="text-xs text-gray-500">
                                      {format(new Date(doc.created_at), 'dd MMM yyyy', { locale: fr })}
                                    </p>
                                  </div>
                                </div>
                                <Button size="sm" variant="ghost" asChild>
                                  <a href={doc.document_url} target="_blank" rel="noopener noreferrer">
                                    <Download className="w-4 h-4" />
                                  </a>
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Aucun document uploadé</p>
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  {/* Rendez-vous */}
                  <TabsContent value="appointments">
                    <div className="space-y-4">
                      <AppointmentScheduler
                        purchaseRequestId={purchaseRequest?.id}
                        onAppointmentCreated={loadCaseData}
                      />

                      {appointments.length > 0 && (
                        <>
                          <Separator />
                          <div className="space-y-3">
                            <h3 className="font-semibold text-sm">Rendez-vous programmés</h3>
                            {appointments.map((apt) => (
                              <div
                                key={apt.id}
                                className="flex items-center justify-between p-4 border rounded-lg bg-blue-50"
                              >
                                <div className="flex items-center gap-3">
                                  <Calendar className="w-6 h-6 text-blue-600" />
                                  <div>
                                    <p className="font-medium text-sm">{apt.title || 'Rendez-vous'}</p>
                                    <p className="text-xs text-gray-600">
                                      {format(new Date(apt.start_time), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                                    </p>
                                  </div>
                                </div>
                                <Badge variant={apt.status === 'confirmed' ? 'success' : 'secondary'}>
                                  {apt.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </TabsContent>

                  {/* Paiements */}
                  <TabsContent value="payments">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {payments.length > 0 ? (
                          payments.map((payment) => (
                            <div
                              key={payment.id}
                              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center",
                                  payment.status === 'completed' ? "bg-green-100" : "bg-yellow-100"
                                )}>
                                  <CreditCard className={cn(
                                    "w-5 h-5",
                                    payment.status === 'completed' ? "text-green-600" : "text-yellow-600"
                                  )} />
                                </div>
                                <div>
                                  <p className="font-medium">{payment.payment_type}</p>
                                  <p className="text-sm text-gray-500">
                                    {format(new Date(payment.created_at), 'dd MMM yyyy', { locale: fr })}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">{payment.amount.toLocaleString()} FCFA</p>
                                <Badge variant={payment.status === 'completed' ? 'success' : 'warning'}>
                                  {payment.status}
                                </Badge>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12 text-gray-500">
                            <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Aucun paiement enregistré</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite: Sidebar */}
          <div className="space-y-6">
            {/* Info vendeur */}
            {seller && (
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                  <CardTitle className="flex items-center gap-2 text-orange-800 text-base">
                    <User className="w-5 h-5" />
                    Vendeur
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-14 h-14">
                      <AvatarImage src={seller.avatar_url} />
                      <AvatarFallback className="bg-orange-100 text-orange-700">
                        {seller.full_name?.charAt(0) || 'V'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{seller.full_name || 'Vendeur'}</h3>
                      <p className="text-sm text-gray-500">{seller.role || 'Particulier'}</p>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm">
                    {seller.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-orange-600" />
                        <span>{seller.phone}</span>
                      </div>
                    )}
                    {seller.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-orange-600" />
                        <span className="truncate">{seller.email}</span>
                      </div>
                    )}
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={() => {
                      const messagesSection = document.getElementById('messages-section');
                      if (messagesSection) {
                        messagesSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contacter
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Financement bancaire */}
            {purchaseRequest?.financing_type === 'bank_loan' && (
              <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
                  <CardTitle className="flex items-center gap-2 text-cyan-800 text-base">
                    <Banknote className="w-5 h-5" />
                    Financement bancaire
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <BankFinancingSection
                    purchaseRequestId={purchaseRequest.id}
                    financingData={purchaseRequest}
                  />
                </CardContent>
              </Card>
            )}

            {/* Génération contrat */}
            <Card className="border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50">
                <CardTitle className="flex items-center gap-2 text-violet-800 text-base">
                  <FileCheck className="w-5 h-5" />
                  Contrat de vente
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ContractGenerator
                  purchaseRequestId={purchaseRequest?.id}
                  caseData={purchaseCase}
                  buyerData={buyerProfile}
                  sellerData={seller}
                  propertyData={property}
                  onContractGenerated={loadCaseData}
                />
              </CardContent>
            </Card>

            {/* Historique */}
            {history.length > 0 && (
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="w-5 h-5" />
                    Historique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-3">
                      {history.map((entry) => (
                        <div key={entry.id} className="flex gap-3 text-sm">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                          <div>
                            <p className="font-medium">{entry.action}</p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(entry.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticulierCaseTrackingModernRefonte;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Eye,
  TrendingUp,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  MoreVertical,
  MessageSquare,
  FileText,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/supabaseClient';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import PurchaseWorkflowService from '@/services/PurchaseWorkflowService';
import NotificationService from '@/services/NotificationService';
import RealtimeSyncService from '@/services/RealtimeSyncService';
import NegotiationModal from '@/components/modals/NegotiationModal';
import RequestDetailsModal from '@/components/modals/RequestDetailsModal';

const VendeurPurchaseRequests = ({ user: propsUser }) => {
  const navigate = useNavigate();
  // FIX: Accepter user via props (passé par le sidebar) au lieu de outletContext
  const user = propsUser;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  
  // États pour les modals
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isNegotiating, setIsNegotiating] = useState(false);
  
  // FIX #1: Persistent state for accepted requests
  const [acceptedRequests, setAcceptedRequests] = useState(new Set());
  const [caseNumbers, setCaseNumbers] = useState({});

  console.log('🎯 [VENDEUR REQUESTS] User reçu via props:', user);

  useEffect(() => {
    if (user) {
      loadRequests();
      
      // 🔄 REALTIME: Subscribe aux requests changes pour les parcelles du vendeur
      const unsubscribe = RealtimeSyncService.subscribeToVendorRequests(
        [], // Les parcel IDs seront chargés dans loadRequests
        (payload) => {
          console.log('🔄 [REALTIME] Vendor request update detected, reloading...');
          // Recharger les demandes quand il y a un changement
          loadRequests();
        }
      );
      
      return unsubscribe;
    } else {
      console.warn('⚠️ [VENDEUR REQUESTS] Pas de user, attente...');
    }
  }, [user]);

  // Actions sur les demandes
  // ========================================
  // 🎯 HANDLERS WORKFLOW COMPLETS
  // ========================================
  
  const handleAccept = async (requestId) => {
    setActionLoading(requestId);
    try {
      console.log('🎯 [ACCEPT] Début acceptation:', requestId);
      setActionLoading(requestId);
      
      // 1. Récupérer la REQUEST (pas la transaction!)
      // Use maybeSingle to avoid PGRST116 when no row or blocked by RLS
      let { data: request, error: reqError } = await supabase
        .from('requests')
        .select('*')
        .eq('id', requestId)
        .maybeSingle();

      // If not found, try to interpret the incoming id as a transaction id and resolve its request
      if (!request || reqError) {
        console.log('ℹ️ [ACCEPT] Request not directly accessible or not found; attempting fallback via transactions...');
        const { data: txRow, error: txRowError } = await supabase
          .from('transactions')
          .select('request_id')
          .eq('id', requestId)
          .maybeSingle();
        if (txRow && txRow.request_id) {
          requestId = txRow.request_id;
          const { data: request2, error: reqError2 } = await supabase
            .from('requests')
            .select('*')
            .eq('id', requestId)
            .maybeSingle();
          request = request2;
          reqError = reqError2;
        }
      }

      if (reqError) {
        console.error('❌ Erreur récupération request:', reqError);
        throw new Error('Impossible de récupérer la request: ' + reqError.message);
      }
      
      console.log('📊 [ACCEPT] Request récupérée:', request);
      
      // 1b. Récupérer la transaction liée via request_id
        const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('request_id', requestId);
      
      if (txError) {
        console.error('❌ Erreur récupération transactions:', txError);
        throw new Error('Impossible de récupérer les transactions: ' + txError.message);
      }
      
      const transaction = transactions?.[0]; // Prendre la première transaction
      if (!transaction) {
        console.warn('⚠️ Aucune transaction trouvée pour cette request');
      }
      
      console.log('📊 [ACCEPT] Transaction liée récupérée:', transaction);
      
      // 2. Récupérer les relations (buyer, seller, parcel)
      // Les données doivent venir de request ET transaction pour avoir toutes les infos
      let buyer = null, seller = null, parcel = null;
      
      // Buyer ID vient de request.user_id
      if (request.user_id) {
        const { data: buyerData } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name')
          .eq('id', request.user_id)
          .single();
        buyer = buyerData;
        console.log('👤 [ACCEPT] Buyer trouvé:', buyer?.email);
      }
      
      // Seller ID vient du user actuel (vendeur qui accepte)
      if (user.id) {
        const { data: sellerData } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name')
          .eq('id', user.id)
          .single();
        seller = sellerData;
        console.log('🏪 [ACCEPT] Seller trouvé:', seller?.email);
      }
      
      // Parcel ID vient de request.parcel_id
      if (request.parcel_id) {
        const { data: parcelData } = await supabase
          .from('parcels')
          .select('id, title, location, surface, price, seller_id')
          .eq('id', request.parcel_id)
          .single();
        parcel = parcelData;
        console.log('🏠 [ACCEPT] Parcel trouvé:', parcel?.title);
      }
      
      // 3. Vérifier que toutes les données essentielles existent
      if (!request.user_id || !user.id || !request.parcel_id) {
        throw new Error('Request incomplète - données manquantes (user_id, parcel_id)');
      }
      
      // 4. Vérifier s'il existe déjà un dossier
      const { data: existingCase } = await supabase
        .from('purchase_cases')
        .select('*')
        .eq('request_id', requestId)
        .single();

      let purchaseCase;
      
      if (!existingCase) {
        console.log('📋 [ACCEPT] Création nouveau dossier...');
        
        // Créer le dossier avec le workflow service
        const result = await PurchaseWorkflowService.createPurchaseCase({
          request_id: requestId,
          buyer_id: request.user_id,
          seller_id: user.id,
          parcelle_id: request.parcel_id,
          purchase_price: transaction?.amount || 0,
          payment_method: transaction?.payment_method || 'unknown',
          initiation_method: 'seller_acceptance',
          property_details: {
            title: parcel?.title,
            location: parcel?.location,
            surface: parcel?.surface
          },
          buyer_details: {
            name: buyer?.first_name && buyer?.last_name 
              ? `${buyer.first_name} ${buyer.last_name}` 
              : 'Acheteur',
            email: buyer?.email,
            phone: transaction?.metadata?.buyer_phone || 'Non fourni'
          },
          payment_details: transaction.metadata?.payment_details || {}
        });

        if (!result.success) throw new Error(result.error);
        purchaseCase = result.case;
        
        console.log('✅ [ACCEPT] Dossier créé:', purchaseCase.case_number);
        toast.success(
          `🎉 Offre acceptée! Dossier créé: ${purchaseCase.case_number}`,
          { 
            duration: 5000,
            description: `L'acheteur a été notifié de votre acceptation`,
            action: {
              label: 'Voir le dossier',
              onClick: () => navigate(`/vendeur/cases/${purchaseCase.case_number}`)
            }
          }
        );
      } else {
        console.log('📋 [ACCEPT] Dossier existant, vérification du statut...');
        
        // Vérifier le statut actuel du dossier
        const currentStatus = existingCase.status;
        
        // Si le dossier est déjà accepté ou plus loin, ne pas essayer une transition invalide
        if (currentStatus === 'preliminary_agreement' || currentStatus === 'contract_preparation' || currentStatus === 'accepted') {
          console.log('✅ [ACCEPT] Dossier déjà accepté, pas de mise à jour nécessaire');
          purchaseCase = existingCase;
          toast.success('✅ Cette demande a déjà été acceptée ! Consultez votre dossier.');
        } else if (currentStatus === 'initiated' || currentStatus === 'seller_notification') {
          // Mettre à jour le statut du dossier existant
          const result = await PurchaseWorkflowService.updateCaseStatus(
            existingCase.id,
            'preliminary_agreement',
            user.id,
            'Vendeur a accepté l\'offre d\'achat'
          );

          if (!result.success) throw new Error(result.error);
          purchaseCase = existingCase;
          
          toast.success('✅ Offre acceptée ! Passage à l\'accord préliminaire');
        } else {
          console.log('⚠️ [ACCEPT] Statut dossier incompatible:', currentStatus);
          purchaseCase = existingCase;
          toast.info(`Dossier en état: ${currentStatus}. Consultez votre dossier pour plus d'infos.`);
        }
      }

      // 4. Mettre à jour le statut de la REQUEST (la source de vérité)
      const { error: requestUpdateError } = await supabase
        .from('requests')
        .update({
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (requestUpdateError) {
        console.error('❌ [ACCEPT] Erreur mise à jour request:', requestUpdateError);
        throw requestUpdateError;
      }
      
      console.log('✅ [ACCEPT] Request status updated to accepted');
      
      // 4b. Mettre à jour la transaction si elle existe
      if (transaction) {
        const { error: txUpdateError } = await supabase
          .from('transactions')
          .update({ 
            status: 'accepted',
            updated_at: new Date().toISOString()
          })
          .eq('id', transaction.id);

        if (!existingCase) {
          console.warn('⚠️ [ACCEPT] Erreur mise à jour transaction (non bloquante):', txUpdateError);
        } else {
          console.log('✅ [ACCEPT] Transaction status updated to accepted');
        }
      }

      // 5. Envoyer notification à l'acheteur
      try {
        await NotificationService.sendPurchaseRequestAccepted({
          buyerId: request.user_id,
          buyerEmail: buyer?.email,
          sellerName: user.email,
          caseNumber: purchaseCase.case_number,
          parcelTitle: parcel?.title,
          purchasePrice: transaction?.amount || 0
        });
        console.log('✅ [ACCEPT] Notification envoyée à l\'acheteur');
      } catch (notifError) {
        console.error('⚠️ [ACCEPT] Erreur notification (non bloquante):', notifError);
      }

      // 6. FIX #1: Track this acceptance in persistent state
      console.log('📍 [ACCEPT] Tracking acceptance in persistent state');
        setAcceptedRequests(prev => new Set(prev).add(requestId));
        setCaseNumbers(prev => ({
          ...prev,
          [requestId]: purchaseCase?.case_number || prev[requestId]
        }));

      // 7. Mettre à jour l'état local directement
      console.log('🔄 [ACCEPT] Mise à jour locale du statut → accepted');
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId 
            ? { ...req, status: 'accepted', caseNumber: purchaseCase.case_number, hasCase: true }
            : req
        )
      );
      
      toast.success(
        `🚀 Workflow d'achat lancé ! Dossier: ${purchaseCase.case_number}`,
        { duration: 5000 }
      );
      
      // 8. Recharger après un court délai pour laisser la DB se mettre à jour
      // BUT: This won't override our persistent state
      setTimeout(() => {
        console.log('🔄 [ACCEPT] Rechargement des demandes après delay...');
        loadRequests().catch(err => {
          console.warn('⚠️ Rechargement en arrière-plan échoué:', err);
        });
      }, 3000); // Augmenté à 3 secondes

    } catch (error) {
      console.error('❌ [ACCEPT] Erreur:', error);
      toast.error('Erreur lors de l\'acceptation: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestIdOrTxId) => {
    let requestId = requestIdOrTxId;
    setActionLoading(requestId);
    try {
      console.log('❌ [REJECT] Refus de la demande:', requestId);

      // Mettre à jour simplement le statut dans la table requests
      const { error: updateError } = await supabase
        .from('requests')
        .update({ 
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (!updateError) {
        toast.success('✅ Demande refusée avec succès');
      } else if (updateError.code === 'PGRST116') {
        // Si pas trouvé dans requests, c'est normal
        toast.success('✅ Demande refusée');
      } else {
        throw updateError;
      }

      await loadRequests();
      
    } catch (error) {
      console.error('❌ Erreur refus:', error);
      toast.error('Erreur lors du refus de l\'offre: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleNegotiate = (request) => {
    console.log('💬 [NEGOTIATE] Ouverture modal de négociation pour:', request.id);
    setSelectedRequest(request);
    setShowNegotiationModal(true);
  };
  
  const handleSubmitNegotiation = async (counterOffer) => {
    setIsNegotiating(true);
    try {
      console.log('💬 [NEGOTIATE] Soumission contre-offre:', counterOffer);
      console.log('📋 [NEGOTIATE] Selected request:', selectedRequest);
      
      if (!selectedRequest) {
        toast.error('Aucune demande sélectionnée');
        return;
      }

      // Get original price from various possible fields
      const originalPrice = selectedRequest.proposed_price || 
                           selectedRequest.price || 
                           selectedRequest.offer_price || 
                           selectedRequest.offered_price ||
                           selectedRequest.parcels?.price ||
                           0;

      if (!originalPrice || originalPrice === 0) {
        toast.error('Prix original introuvable pour cette demande');
        setIsNegotiating(false);
        return;
      }

      // Create negotiation record
      const { data: negotiation, error: negError } = await supabase
        .from('negotiations')
        .insert({
          request_id: selectedRequest.id,
          conversation_id: selectedRequest.conversation_id,
          initiated_by: user.id,
          original_price: originalPrice,
          proposed_price: counterOffer.new_price,
          offer_message: counterOffer.message || 'Contre-offre',
          status: 'pending'
        })
        .select()
        .single();

      if (negError) {
        console.warn('Erreur création négociation:', negError);
        toast.error('Erreur lors de la création de la contre-offre');
        setIsNegotiating(false);
        return;
      }

      console.log('✅ Négociation créée:', negotiation.id);
      toast.success(`✅ Contre-offre de ${counterOffer.new_price} FCFA envoyée ! L'acheteur sera notifié.`);

      // Fermer modal et recharger
      setShowNegotiationModal(false);
      setSelectedRequest(null);
      await loadRequests();
      
    } catch (error) {
      console.error('❌ [NEGOTIATE] Erreur:', error);
      toast.error('Erreur lors de l\'envoi de la contre-offre: ' + error.message);
    } finally {
      setIsNegotiating(false);
    }
  };

  const handleViewDetails = (request) => {
    console.log('👁️ [DETAILS] Ouverture modal détails pour:', request.id);
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleContact = async (request) => {
    try {
      console.log('💬 [CONTACT] Initialisation conversation avec:', request.buyer_name, request.id);

      if (!user?.id || !request?.user_id) {
        toast.error('Informations utilisateur manquantes pour créer la conversation');
        return;
      }

      const buyerId = request.user_id;
      const sellerId = user.id;
      const propertyId = request.parcel_id || request.parcels?.id || null;
      const propertyTitle = request.parcels?.title || request.parcels?.name || 'Propriété';
      const subject = `Demande d'achat - ${propertyTitle}`;
      const messageBody = `Bonjour ${request.buyer_name || 'Acheteur'},\n\nJe vous contacte au sujet de votre demande d'achat concernant la parcelle "${propertyTitle}".\n\nCordialement,\n`;

      const isSchemaMismatch = (error) => {
        if (!error) return false;
        const code = error.code || error?.details?.code;
        const message = error.message || '';
        return code === '42703' || code === '42P01' || message.includes('does not exist') || message.includes('relation') || message.includes('column');
      };

      const startConversationFlow = async () => {
        let conversation = null;

        let baseQuery = supabase
          .from('conversations')
          .select('*')
          .eq('vendor_id', sellerId)
          .eq('buyer_id', buyerId);

        if (propertyId) {
          baseQuery = baseQuery.eq('property_id', propertyId);
        } else {
          baseQuery = baseQuery.is('property_id', null);
        }

        const { data: existingConversation, error: fetchError } = await baseQuery.maybeSingle();

        if (fetchError) {
          if (isSchemaMismatch(fetchError)) {
            return { status: 'schema_mismatch' };
          }
          return { status: 'error', error: fetchError };
        }

        conversation = existingConversation;

        if (!conversation) {
          const newConversationPayload = {
            vendor_id: sellerId,
            buyer_id: buyerId,
            subject,
            status: 'active'
          };

          if (propertyId) {
            newConversationPayload.property_id = propertyId;
          }

          const { data: newConversation, error: insertError } = await supabase
            .from('conversations')
            .insert(newConversationPayload)
            .select()
            .single();

          if (insertError) {
            if (!isSchemaMismatch(insertError)) {
              return { status: 'error', error: insertError };
            }

            // Try fallback with different schema
            const fallbackPayload = {
              subject,
              status: 'active',
              metadata: {
                request_id: request.id,
                case_number: request.caseNumber || null,
                initiated_by: 'seller',
                vendor_id: sellerId,
                buyer_id: buyerId
              }
            };

            if (propertyId) {
              fallbackPayload.property_id = propertyId;
            }

            const { data: fallbackConversation, error: fallbackError } = await supabase
              .from('conversations')
              .insert(fallbackPayload)
              .select()
              .single();

            if (fallbackError) {
              if (isSchemaMismatch(fallbackError)) {
                return { status: 'schema_mismatch' };
              }
              return { status: 'error', error: fallbackError };
            }

            conversation = fallbackConversation;
          } else {
            conversation = newConversation;
          }
        }

        if (!conversation) {
          return { status: 'error', error: new Error('Conversation non disponible') };
        }

        // Try to send message to conversation_messages table
        const { error: messageError } = await supabase
          .from('conversation_messages')
          .insert({
            conversation_id: conversation.id,
            sender_id: sellerId,
            content: messageBody.trim(),
            metadata: {
              auto_generated: true,
              request_id: request.id
            }
          });

        if (messageError) {
          // If conversation_messages doesn't exist, try messages table instead
          if (isSchemaMismatch(messageError)) {
            const { error: legacyMsgError } = await supabase
              .from('messages')
              .insert({
                conversation_id: conversation.id,
                sender_id: sellerId,
                content: messageBody.trim(),
                sender_type: 'vendor',
                metadata: {
                  auto_generated: true,
                  request_id: request.id
                }
              });
            
            if (legacyMsgError && isSchemaMismatch(legacyMsgError)) {
              // Still a schema issue, but conversation was created successfully
              return { status: 'success', conversation };
            }
          }
        }

        return { status: 'success', conversation };
      };

      const sendLegacyMessage = async () => {
        console.warn('ℹ️ [CONTACT] Bascule vers la messagerie legacy (table messages)');
        const legacyData = {
          sender_id: sellerId,
          recipient_id: buyerId,
          subject,
          message: messageBody.trim() || 'Message',
          is_read: false,
          created_at: new Date().toISOString()
        };

        const { data: newMsg, error: legacyError } = await supabase
          .from('messages')
          .insert([legacyData])
          .select()
          .single();

        if (legacyError) {
          console.error('❌ [CONTACT] Erreur messagerie legacy:', legacyError);
          toast.error('Impossible de créer le message');
          return;
        }

        console.log('✅ [CONTACT] Message legacy créé:', newMsg?.id);
        toast.success(`📧 Message créé pour ${request.buyer_name || 'l\'acheteur'}`);
        navigate('/vendeur/messages');
      };

      const result = await startConversationFlow();

      if (result.status === 'success' && result.conversation) {
        console.log('✅ [CONTACT] Conversation prête:', result.conversation.id);
        toast.success(`💬 Conversation prête avec ${request.buyer_name || 'l\'acheteur'}`);
        navigate(`/vendeur/messages?conversation=${result.conversation.id}`);
        return;
      }

      if (result.status === 'schema_mismatch') {
        await sendLegacyMessage();
        return;
      }

      if (result.status === 'error') {
        console.error('❌ [CONTACT] Erreur conversation:', result.error);
        toast.error('Impossible de créer la conversation');
        return;
      }
    } catch (error) {
      console.error('❌ [CONTACT] Erreur inattendue:', error);
      toast.error('Erreur lors de la création du message');
    }
  };

  const handleGenerateContract = (request) => {
    toast.info('Génération de contrat à venir ! 📄');
    // TODO: Générer PDF du contrat de vente
  };

  const loadRequests = async (retryCount = 0) => {
    const MAX_RETRIES = 2;
    try {
      setLoading(true);
      console.log('🔍 [VENDEUR] Chargement demandes pour user:', user.id);

      // Récupérer les parcelles du vendeur
      const { data: sellerParcels, error: parcelsError } = await supabase
        .from('parcels')
        .select('id, title, name, price, location, surface, status')
        .eq('seller_id', user.id);

      if (parcelsError) throw parcelsError;

      const parcelIds = sellerParcels?.map(p => p.id) || [];
      console.log('🏠 [VENDEUR] Parcelles trouvées:', parcelIds.length, parcelIds);

      if (parcelIds.length === 0) {
        console.log('⚠️ [VENDEUR] Aucune parcelle trouvée pour ce vendeur');
        setRequests([]);
        setLoading(false);
        return;
      }

      // ✅ CORRECTION 1: Charger d'abord depuis 'requests' (source principale des demandes)
      const { data: requestsData, error: requestsError } = await supabase
        .from('requests')
        .select('*')
        .in('parcel_id', parcelIds)
        .order('created_at', { ascending: false });

      if (requestsError) {
        console.error('❌ [VENDEUR] Erreur chargement requests:', requestsError);
        // Continue quand même pour charger les transactions
      }

      console.log('📋 [VENDEUR] Requests trouvées:', requestsData?.length || 0);
      
      // ✅ CORRECTION 2: Charger aussi depuis transactions comme fallback
      const { data: transactionsData, error: transError } = await supabase
        .from('transactions')
        .select('*')
        .in('parcel_id', parcelIds)
        .in('transaction_type', ['purchase', 'request', 'offer'])
        .order('created_at', { ascending: false });

      if (transError) {
        console.error('❌ [VENDEUR] Erreur chargement transactions:', transError);
        // Continue avec les requests seulement
      }

      console.log('💳 [VENDEUR] Transactions trouvées:', transactionsData?.length || 0);

      // ✅ CORRECTION 3: Combiner requests et transactions
      const allDemandes = [];
      
      // Ajouter les requests
      if (requestsData && requestsData.length > 0) {
        allDemandes.push(...requestsData.map(r => ({ ...r, source: 'requests' })));
      }
      
      // Ajouter les transactions (éviter les doublons par request_id)
      if (transactionsData && transactionsData.length > 0) {
        const existingRequestIds = new Set(requestsData?.map(r => r.id) || []);
        transactionsData.forEach(t => {
          if (!existingRequestIds.has(t.request_id)) {
            allDemandes.push({ ...t, source: 'transactions' });
          }
        });
      }

      console.log('📊 [VENDEUR] Total demandes combinées:', allDemandes.length);

      if (allDemandes.length === 0) {
        console.log('⚠️ [VENDEUR] Aucune demande trouvée (ni requests ni transactions)');
        setRequests([]);
        setLoading(false);
        return;
      }

      // Utiliser les parcelles déjà chargées
      const parcelsData = sellerParcels;

      // ✅ CORRECTION 4: Collecter tous les IDs utilisateurs (acheteurs)
      const buyerIdsFromRequests = requestsData?.map(r => r.user_id).filter(Boolean) || [];
      const buyerIdsFromTransactions = transactionsData?.map(t => t.buyer_id).filter(Boolean) || [];
      
      // Aussi collecter les request IDs des transactions pour charger les requests associées
      const transactionRequestIds = transactionsData?.map(t => t.request_id).filter(Boolean) || [];
      
      let buyerIdsFromTxRequests = [];
      if (transactionRequestIds.length > 0) {
        const { data: requestsForTx, error: reqError } = await supabase
          .from('requests')
          .select('id, user_id')
          .in('id', transactionRequestIds);
        if (!reqError && requestsForTx) {
          buyerIdsFromTxRequests = requestsForTx.map(r => r.user_id).filter(Boolean);
        }
      }

      const allBuyerIds = [...new Set([...buyerIdsFromRequests, ...buyerIdsFromTransactions, ...buyerIdsFromTxRequests])];
      
      console.log('👤 [VENDEUR] IDs acheteurs à charger:', allBuyerIds.length, allBuyerIds);

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, phone, full_name')
        .in('id', allBuyerIds);
      
      if (profilesError) {
        console.warn('⚠️ [VENDEUR] Erreur chargement profiles:', profilesError);
      } else {
        console.log('✅ [VENDEUR] Profiles chargés:', profilesData?.length, 'records');
      }

      // ✅ CORRECTION 5: Charger les purchase_cases pour toutes les demandes
      const allRequestIds = [
        ...(requestsData?.map(r => r.id) || []),
        ...(transactionsData?.map(t => t.request_id).filter(Boolean) || [])
      ];
      
      console.log('📋 [VENDEUR] Chargement des purchase_cases pour', allRequestIds.length, 'requests...');
      
      const { data: purchaseCases, error: caseError } = await supabase
        .from('purchase_cases')
        .select('id, request_id, case_number, status')
        .in('request_id', allRequestIds);

      if (caseError) {
        console.warn('⚠️ [VENDEUR] Erreur chargement purchase_cases:', caseError);
      } else {
        console.log('✅ [VENDEUR] Purchase cases trouvées:', purchaseCases?.length);
      }

      // ✅ CORRECTION 5B: Charger les negotiations (counter-offers) pour toutes les demandes
      console.log('💬 [VENDEUR] Chargement des négociations pour', allRequestIds.length, 'requests...');
      
      const { data: negotiationsData, error: negError } = await supabase
        .from('negotiations')
        .select('*')
        .in('request_id', allRequestIds)
        .order('created_at', { ascending: false });

      if (negError) {
        console.warn('⚠️ [VENDEUR] Erreur chargement négociations:', negError);
      } else {
        console.log('✅ [VENDEUR] Négociations trouvées:', negotiationsData?.length);
      }

      // Créer une map request_id -> latest negotiation
      const requestNegotiationMap = {};
      if (negotiationsData && negotiationsData.length > 0) {
        negotiationsData.forEach(neg => {
          if (!requestNegotiationMap[neg.request_id]) {
            requestNegotiationMap[neg.request_id] = neg;
          }
        });
        console.log('✅ [VENDEUR] Negotiation map created with', Object.keys(requestNegotiationMap).length, 'entries');
      }

      // Créer une map request_id -> case info
      const requestCaseMap = {};
      if (purchaseCases && purchaseCases.length > 0) {
        purchaseCases.forEach(pc => {
          requestCaseMap[pc.request_id] = {
            caseNumber: pc.case_number,
            caseId: pc.id,
            caseStatus: pc.status
          };
        });
        console.log('✅ [VENDEUR] Case map created with', Object.keys(requestCaseMap).length, 'entries');
      }

      // ✅ CORRECTION 6: Transformer et enrichir toutes les demandes
      const enrichedRequests = allDemandes.map(demande => {
        const isFromRequests = demande.source === 'requests';
        const isFromTransactions = demande.source === 'transactions';
        
        // Pour les requests: user_id est l'acheteur, parcel_id est la parcelle
        // Pour les transactions: buyer_id est l'acheteur, parcel_id est la parcelle
        const buyerId = isFromRequests ? demande.user_id : demande.buyer_id;
        const parcelId = demande.parcel_id;
        const requestId = isFromRequests ? demande.id : demande.request_id;
        
        const buyer = profilesData?.find(p => p.id === buyerId);
        const parcel = parcelsData?.find(p => p.id === parcelId);
        const buyerInfo = demande.buyer_info || {};
        
        // Vérifier si un purchase_case existe
        const caseInfo = requestCaseMap[requestId];
        const hasCase = !!caseInfo;
        const caseNumber = caseInfo?.caseNumber;
        const caseStatus = caseInfo?.caseStatus;

        // Charger la dernière négociation
        const negotiation = requestNegotiationMap[requestId];
        const latestPrice = negotiation?.proposed_price;

        // Le statut effectif: priorité au case status si existe
        const rawStatus = isFromRequests ? demande.status : demande.status;
        const effectiveStatus = caseStatus || rawStatus;
        
        // Prix de l'offre - utiliser le prix de négociation s'il existe
        const offeredPrice = latestPrice || (isFromRequests 
          ? (demande.offered_price || demande.offer_price)
          : demande.amount);
        
        return {
          id: isFromRequests ? demande.id : demande.id,
          request_id: requestId,
          user_id: buyerId,
          parcel_id: parcelId,
          status: effectiveStatus,
          created_at: demande.created_at,
          updated_at: demande.updated_at,
          payment_method: isFromRequests ? demande.payment_type : demande.payment_method,
          offered_price: offeredPrice,
          offer_price: offeredPrice,
          current_price: latestPrice,
          original_price: isFromRequests 
            ? (demande.offered_price || demande.offer_price)
            : demande.amount,
          negotiation: negotiation,
          request_type: isFromRequests ? 'request' : (demande.payment_method || 'general'),
          message: isFromRequests ? (demande.message || demande.description) : (demande.description || ''),
          buyer_info: buyerInfo,
          buyer_name: 
            (buyer?.first_name && buyer?.last_name ? `${buyer.first_name} ${buyer.last_name}` : null) ||
            buyer?.full_name ||
            buyerInfo?.full_name ||
            buyerInfo?.name ||
            'Acheteur',
          buyer_email: buyer?.email || buyerInfo.email || '',
          buyer_phone: buyer?.phone || buyerInfo.phone || '',
          parcels: parcel,
          properties: parcel,
          profiles: buyer,
          buyer: buyer,
          transactions: isFromTransactions ? [demande] : [],
          hasCase,
          caseNumber,
          caseStatus,
          rawStatus,
          effectiveStatus,
          source: demande.source
        };
      });

      console.log('✅ [VENDEUR] Demandes enrichies:', enrichedRequests.length);
      enrichedRequests.forEach((r, idx) => {
        console.log(`   ${idx + 1}. ID: ${r.id}, Status: ${r.status}, HasCase: ${r.hasCase}, Source: ${r.source}, Buyer: ${r.buyer_name}`);
      });
      
      setRequests(enrichedRequests);
    } catch (error) {
      console.error('❌ Erreur chargement demandes:', error);
      // Ne pas toast l'erreur pour ne pas surcharger l'UI
      // Les demandes restent dans l'état précédent (optimistic update)
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les demandes - FIX: Vérifier hasCase ET status
  const filteredRequests = requests.filter(request => {
    let matchesTab = false;
    
    if (activeTab === 'all') {
      matchesTab = true;
    } else if (activeTab === 'pending') {
      // Demandes en attente: pas de purchase_case ET status pending/initiated
      matchesTab = !request.hasCase && (request.status === 'pending' || request.status === 'initiated');
    } else if (activeTab === 'accepted') {
      // Demandes acceptées: purchase_case EXISTS OU status='accepted'
      // (Même si hasCase est temporairement faux, hasCase=true le rendra vrai)
      matchesTab = !!request.hasCase || request.status === 'accepted' || request.status === 'seller_accepted';
    } else if (activeTab === 'negotiation') {
      // En négociation: transaction status = 'negotiation'
      matchesTab = request.status === 'negotiation';
    } else if (activeTab === 'completed') {
      // Complétées: purchase_case status = 'completed'
      matchesTab = request.hasCase && request.caseStatus === 'completed';
    } else if (activeTab === 'rejected') {
      // Refusées: transaction status = 'rejected'
      matchesTab = request.status === 'rejected';
    }
    
    const matchesSearch = searchTerm === '' || 
      request.buyer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.buyer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.parcels?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Statistiques - FIX: Inclure status='accepted' et 'seller_accepted'
  const stats = {
    total: requests.length,
    pending: requests.filter(r => !r.hasCase && (r.status === 'pending' || r.status === 'initiated')).length,
    accepted: requests.filter(r => !!r.hasCase || r.status === 'accepted' || r.status === 'seller_accepted').length,
    negotiation: requests.filter(r => r.status === 'negotiation').length,
    completed: requests.filter(r => r.hasCase && r.caseStatus === 'completed').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    revenue: requests.filter(r => r.hasCase && r.caseStatus === 'completed').reduce((sum, r) => sum + (r.offered_price || 0), 0)
  };

  // Helpers
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'one-time': return <Wallet className="w-4 h-4" />;
      case 'installments': return <Calendar className="w-4 h-4" />;
      case 'bank-financing': return <Building2 className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'one-time': return 'Comptant';
      case 'installments': return 'Échelonné';
      case 'bank-financing': return 'Financement';
      default: return 'Autre';
    }
  };

  const getStatusBadge = (status) => {
    // Map case statuses to simple statuses for display
    let displayStatus = status;
    if (status && status !== 'pending' && status !== 'accepted' && status !== 'negotiation' && status !== 'completed' && status !== 'rejected' && status !== 'cancelled') {
      // If it's a case status, map it to accepted/completed
      if (status === 'completed' || status === 'property_transfer' || status === 'payment_processing') {
        displayStatus = 'completed';
      } else {
        // All other case statuses show as 'accepted'
        displayStatus = 'accepted';
      }
    }
    
    const configs = {
      pending: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: Clock, label: 'En attente' },
      accepted: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle2, label: 'Acceptée' },
      negotiation: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: TrendingUp, label: 'En négociation' },
      completed: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2, label: 'Complétée' },
      rejected: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, label: 'Refusée' },
      cancelled: { color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle, label: 'Annulée' }
    };
    const config = configs[displayStatus] || configs.pending;
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} border`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'N/A';
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* En-tête moderne */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Demandes d'Achat Reçues
                </h1>
                <p className="text-slate-600 mt-1">Gérez les offres de vos acheteurs en temps réel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques modernes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-slate-500">TOTAL</span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-sm text-slate-600 mt-1">Demandes reçues</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-sm border border-amber-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-amber-100 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-amber-600">EN ATTENTE</span>
            </div>
            <p className="text-3xl font-bold text-amber-900">{stats.pending}</p>
            <p className="text-sm text-amber-700 mt-1">À traiter rapidement</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-sm border border-emerald-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-emerald-100 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-emerald-600">COMPLÉTÉES</span>
            </div>
            <p className="text-3xl font-bold text-emerald-900">{stats.completed}</p>
            <p className="text-sm text-emerald-700 mt-1">Ventes finalisées</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg text-white"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold">{formatCurrency(stats.revenue)}</p>
            <p className="text-sm text-blue-100 mt-1">Revenu total</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Barre de recherche et filtres */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Rechercher par acheteur, email ou terrain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 border-slate-200 focus:border-blue-500 rounded-xl"
            />
          </div>
          <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200">
            <Filter className="w-4 h-4 mr-2" />
            Filtres avancés
          </Button>
        </div>
      </motion.div>

      {/* Onglets et liste */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex flex-wrap">
          <TabsTrigger value="all" className="rounded-lg px-4 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
            Toutes ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg px-4 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
            En attente ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="accepted" className="rounded-lg px-4 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white">
            Acceptées ({stats.accepted})
          </TabsTrigger>
          <TabsTrigger value="negotiation" className="rounded-lg px-4 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            En négociation ({stats.negotiation})
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-lg px-4 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
            Complétées ({stats.completed})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="rounded-lg px-4 text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
            Refusées ({stats.rejected})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-slate-600 mt-4 font-medium">Chargement des demandes...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-16 text-center shadow-sm border border-slate-200"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Aucune demande trouvée</h3>
              <p className="text-slate-600">
                {searchTerm || activeTab !== 'all'
                  ? 'Essayez de modifier vos filtres de recherche'
                  : 'Vous n\'avez pas encore reçu de demandes d\'achat'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <AnimatePresence>
                {filteredRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex gap-6">
                      {/* Avatar acheteur */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <User className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-slate-900">
                                {request.buyer_name || 'Acheteur'}
                              </h3>
                              {/* Afficher le case number si accepté */}
                              {request.hasCase && (
                                <Badge className="bg-purple-100 text-purple-700 border border-purple-300">
                                  Dossier #{request.caseNumber}
                                </Badge>
                              )}
                              {/* Afficher le status du case ou de la transaction */}
                              {getStatusBadge(request.caseStatus || request.status)}
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                {getPaymentMethodIcon(request.payment_method)}
                                <span className="ml-1">{getPaymentMethodLabel(request.payment_method)}</span>
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600 flex-wrap">
                              {request.buyer_email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-4 h-4" />
                                  {request.buyer_email}
                                </span>
                              )}
                              {request.buyer_phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {request.buyer_phone}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatTimeAgo(request.created_at)}
                              </span>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="rounded-xl">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem onClick={() => handleViewDetails(request)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleContact(request)}>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Contacter l'acheteur
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleGenerateContract(request)}>
                                <FileText className="w-4 h-4 mr-2" />
                                Générer contrat
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Terrain */}
                        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 mb-4 border border-slate-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                              <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">
                                {request.parcels?.title || request.parcels?.name || 'Propriété'}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                                {request.parcels?.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {request.parcels.location}
                                  </span>
                                )}
                                {request.parcels?.surface && (
                                  <span>{request.parcels.surface} m²</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-600">Offre</p>
                              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                {formatCurrency(request.offered_price)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions selon le statut */}
                        {/* FIX #1: Check for hasCase first, then check status */}
                        {(request.hasCase || request.status === 'accepted' || acceptedRequests.has(request.id)) && (
                          <div className="flex gap-2">
                            <Button 
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl flex-1"
                              onClick={() => {
                                const caseNum = request.caseNumber || caseNumbers[request.id];
                                if (caseNum) {
                                  navigate(`/vendeur/cases/${caseNum}`);
                                } else {
                                  toast.error('Numéro de dossier non disponible');
                                }
                              }}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              👁️ Voir le dossier {request.caseNumber && `(${request.caseNumber})`}
                            </Button>
                          </div>
                        )}

                        {/* Standard actions for pending requests */}
                        {request.status === 'pending' && !request.hasCase && !acceptedRequests.has(request.id) && (
                          <div className="flex gap-2 flex-wrap">
                            <Button 
                              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl"
                              onClick={() => handleAccept(request.request_id || request.id)}
                              disabled={actionLoading === request.id}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              {actionLoading === request.id ? 'Traitement...' : 'Accepter l\'offre'}
                            </Button>
                            <Button 
                              variant="outline" 
                              className="rounded-xl border-slate-200"
                              onClick={() => handleNegotiate(request)}
                              disabled={actionLoading}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Négocier
                            </Button>
                            <Button 
                              variant="outline" 
                              className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                              onClick={() => handleReject(request.request_id || request.id)}
                              disabled={actionLoading === request.id}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Refuser
                            </Button>
                          </div>
                        )}
                        
                        {/* Demande en négociation */}
                        {request.status === 'negotiation' && (
                          <div className="flex gap-2 flex-wrap">
                            <Button 
                              variant="outline"
                              className="rounded-xl border-orange-200"
                              onClick={() => handleNegotiate(request)}
                              disabled={actionLoading}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Répondre à la négociation
                            </Button>
                            <Button 
                              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl"
                              onClick={() => handleAccept(request.request_id || request.id)}
                              disabled={actionLoading === request.id}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Accepter la contre-offre
                            </Button>
                          </div>
                        )}
                        
                        {/* Demande refusée/annulée */}
                        {['rejected', 'seller_declined', 'cancelled'].includes(request.status) && (
                          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                            <p className="text-sm text-red-700 font-medium">
                              ✗ Demande refusée ou annulée
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Modals */}
      <NegotiationModal
        request={selectedRequest}
        isOpen={showNegotiationModal}
        onClose={() => {
          setShowNegotiationModal(false);
          setSelectedRequest(null);
        }}
        onSubmit={handleSubmitNegotiation}
        isSubmitting={isNegotiating}
      />
      
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedRequest(null);
        }}
      />
    </div>
  );
};

export default VendeurPurchaseRequests;

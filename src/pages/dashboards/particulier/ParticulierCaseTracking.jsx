/**
 * Page de suivi du dossier d'achat pour les acheteurs
 * Affiche le workflow comme un suivi de colis avec messagerie, documents et historique
 * Equivalent de VendeurCaseTracking.jsx mais pour les acheteurs (particuliers)
 * @author Teranga Foncier Team
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { useMaintenanceMode } from '@/contexts/MaintenanceContext';
import { supabase } from '@/lib/supabaseClient';
import { PurchaseWorkflowService } from '@/services/PurchaseWorkflowService';
import { RealtimeSyncService } from '@/services/RealtimeSyncService';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  Home,
  User,
  FileText,
  MessageSquare,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Download,
  Upload,
  Send,
  Clock,
} from 'lucide-react';

const ParticulierCaseTracking = () => {
  const { caseNumber } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const maintenanceMode = useMaintenanceMode();

  const [purchaseCase, setPurchaseCase] = useState(null);
  const [request, setRequest] = useState(null);
  const [seller, setSeller] = useState(null);
  const [parcel, setParcel] = useState(null);
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [unsubscribe, setUnsubscribe] = useState(null);

  // Charger les données du dossier
  useEffect(() => {
    if (user && caseNumber) {
      loadCaseData();
      subscribeToUpdates();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, caseNumber]);

  const subscribeToUpdates = () => {
    if (!user) return;

    console.log(`🟢 [BUYER TRACKING] Subscribe to case: ${caseNumber}`);
    
    const unsub = RealtimeSyncService.subscribeToCaseUpdates(
      caseNumber,
      (payload) => {
        console.log('🔄 [BUYER TRACKING] Case update received:', payload);
        loadCaseData();
      }
    );

    setUnsubscribe(() => unsub);
  };

  const loadCaseData = async () => {
    try {
      setLoading(true);
      console.log('📁 [BUYER CASE TRACKING] Chargement dossier:', caseNumber);

      // 1. Charger le dossier
      const { data: caseData, error: caseError } = await supabase
        .from('purchase_cases')
        .select('*')
        .eq('case_number', caseNumber)
        .eq('buyer_id', user.id)
        .single();

      if (caseError) throw caseError;
      setPurchaseCase(caseData);
      console.log('✅ [BUYER CASE] Dossier chargé:', caseData);

      // 2. Charger la demande/transaction
      const { data: requestData } = await supabase
        .from('requests')
        .select('*')
        .eq('id', caseData.request_id)
        .single();

      if (requestData) {
        setRequest(requestData);
      }

      // 3. Charger les données du vendeur
      const { data: sellerData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', caseData.seller_id)
        .single();

      if (sellerData) {
        setSeller(sellerData);
      }

      // 4. Charger la parcelle
      const { data: parcelData } = await supabase
        .from('parcels')
        .select('*')
        .eq('id', caseData.parcel_id)
        .single();

      if (parcelData) {
        setParcel(parcelData);
      }

      // 5. Charger l'historique du workflow
      const { data: historyData } = await supabase
        .from('purchase_case_history')
        .select('*')
        .eq('case_id', caseData.id)
        .order('created_at', { ascending: true });

      setHistory(historyData || []);
      console.log('✅ [BUYER CASE] Histoire chargée:', historyData?.length);

      // 6. Charger les messages
      const { data: messagesData } = await supabase
        .from('purchase_case_messages')
        .select('*')
        .eq('case_id', caseData.id)
        .order('created_at', { ascending: true });

      setMessages(messagesData || []);
      console.log('✅ [BUYER CASE] Messages chargés:', messagesData?.length);

      // 7. Charger les documents
      const { data: docsData } = await supabase
        .from('documents_administratifs')
        .select('*')
        .eq('purchase_request_id', caseData.request_id)
        .order('created_at', { ascending: false });

      setDocuments(docsData || []);
      console.log('✅ [BUYER CASE] Documents chargés:', docsData?.length);
    } catch (error) {
      console.error('❌ Erreur chargement dossier:', error);
      toast.error('Erreur lors du chargement du dossier');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    try {
      const { error } = await supabase
        .from('purchase_case_messages')
        .insert({
          case_id: purchaseCase.id,
          sender_id: user.id,
          message: newMessage,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      setNewMessage('');
      await loadCaseData();
      toast.success('Message envoyé');
    } catch (error) {
      console.error('❌ Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <Circle className="w-8 h-8 text-blue-600" />
        </div>
      </div>
    );
  }

  if (!purchaseCase) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg font-semibold mb-4">Dossier introuvable</p>
        <Button onClick={() => navigate('/acheteur/mes-achats')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à mes demandes
        </Button>
      </div>
    );
  }

  // Récupérer l'info du statut courant
  const statusInfo = PurchaseWorkflowService.WORKFLOW_STATUSES[purchaseCase.status.toUpperCase()];

  // Obtenir toutes les étapes du workflow
  const allSteps = Object.values(PurchaseWorkflowService.WORKFLOW_STATUSES)
    .sort((a, b) => a.order - b.order)
    .filter(s => !s.final);

  // Trouver l'index du statut courant
  const currentStepIndex = allSteps.findIndex(s => s.key === purchaseCase.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/acheteur/mes-achats')}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dossier {purchaseCase.case_number}</h1>
                <p className="text-sm text-slate-600">
                  Créé le {new Date(purchaseCase.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            <Badge
              className="text-lg px-4 py-2"
              style={{
                backgroundColor: `${statusInfo?.color || 'gray'}20`,
                color: statusInfo?.color || 'gray',
                border: `2px solid ${statusInfo?.color || 'gray'}40`,
              }}
            >
              {statusInfo?.label || purchaseCase.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche: Progression du workflow */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progression du workflow */}
            <Card>
              <CardHeader>
                <CardTitle>Progression du dossier</CardTitle>
                <CardDescription>Suivi de votre demande d'achat</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {allSteps.map((step, index) => (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 mb-6 last:mb-0"
                    >
                      {/* Timeline indicator */}
                      <div className="flex flex-col items-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            index <= currentStepIndex
                              ? 'bg-green-100'
                              : 'bg-slate-100'
                          }`}
                        >
                          {index <= currentStepIndex ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <Circle className="w-6 h-6 text-slate-400" />
                          )}
                        </motion.div>
                        {index < allSteps.length - 1 && (
                          <div
                            className={`w-1 h-12 ${
                              index < currentStepIndex ? 'bg-green-400' : 'bg-slate-200'
                            }`}
                          />
                        )}
                      </div>

                      {/* Step content */}
                      <div className="flex-1 pt-1">
                        <h3 className="font-semibold text-slate-900">{step.label}</h3>
                        <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                        {index <= currentStepIndex && (
                          <p className="text-xs text-green-600 mt-2">✓ Complété</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Historique des actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Historique
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {history.length > 0 ? (
                    history.map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-l-2 border-blue-400 pl-4 pb-4"
                      >
                        <p className="font-semibold text-slate-900">{event.action}</p>
                        <p className="text-sm text-slate-600">{event.description}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(event.created_at).toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-slate-600">Aucun historique disponible</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite: Informations et actions */}
          <div className="space-y-6">
            {/* Informations de la parcelle */}
            {parcel && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Propriété
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Titre</p>
                    <p className="font-semibold text-slate-900">{parcel.title || parcel.name}</p>
                  </div>
                  {parcel.location && (
                    <div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-slate-600 mt-0.5" />
                        <span className="text-sm text-slate-700">{parcel.location}</span>
                      </div>
                    </div>
                  )}
                  {parcel.surface && (
                    <div>
                      <p className="text-sm text-slate-600">Surface</p>
                      <p className="font-semibold">{parcel.surface} m²</p>
                    </div>
                  )}
                  {parcel.price && (
                    <div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-600" />
                        <span className="font-semibold">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(parcel.price)}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Informations du vendeur */}
            {seller && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Vendeur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Nom</p>
                    <p className="font-semibold text-slate-900">{seller.first_name} {seller.last_name}</p>
                  </div>
                  {seller.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-600" />
                      <a href={`mailto:${seller.email}`} className="text-blue-600 hover:underline text-sm">
                        {seller.email}
                      </a>
                    </div>
                  )}
                  {seller.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-600" />
                      <a href={`tel:${seller.phone}`} className="text-blue-600 hover:underline text-sm">
                        {seller.phone}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documents ({documents.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map((doc, index) => (
                      <a
                        key={index}
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded text-blue-600 hover:underline text-sm"
                      >
                        <Download className="w-4 h-4" />
                        {doc.file_name}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 text-sm">Aucun document disponible</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Messages section - Full width */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages list */}
            <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto space-y-4">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.sender_id === user.id ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`flex-1 rounded-lg px-4 py-2 ${
                        msg.sender_id === user.id
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-slate-200 text-slate-900'
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.created_at).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-slate-600 py-4">Aucun message</p>
              )}
            </div>

            {/* Message input */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Votre message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
                rows={3}
              />
              <Button
                onClick={sendMessage}
                disabled={sendingMessage || !newMessage.trim()}
                className="self-end"
              >
                <Send className="w-4 h-4 mr-2" />
                Envoyer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParticulierCaseTracking;

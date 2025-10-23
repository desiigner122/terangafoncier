/**
 * Page de suivi du dossier d'achat immobilier
 * Affiche le workflow comme un suivi de colis avec messagerie, documents et historique
 * @author Teranga Foncier Team
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { useMaintenanceMode } from '@/contexts/MaintenanceContext';
import { supabase } from '@/lib/supabaseClient';
import { PurchaseWorkflowService } from '@/services/PurchaseWorkflowService';
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

const VendeurCaseTracking = () => {
  const { caseNumber } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const maintenanceMode = useMaintenanceMode();

  const [purchaseCase, setPurchaseCase] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [buyer, setBuyer] = useState(null);
  const [parcel, setParcel] = useState(null);
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Charger les données du dossier
  useEffect(() => {
    if (user && caseNumber) {
      loadCaseData();
    }
  }, [user, caseNumber]);

  const loadCaseData = async () => {
    try {
      setLoading(true);
      console.log('📁 [CASE TRACKING] Chargement dossier:', caseNumber);

      // 1. Charger le dossier
      const { data: caseData, error: caseError } = await supabase
        .from('purchase_cases')
        .select('*')
        .eq('case_number', caseNumber)
        .single();

      if (caseError) throw caseError;
      setPurchaseCase(caseData);
      console.log('✅ [CASE] Dossier chargé:', caseData);

      // 2. Charger la transaction
      const { data: txData } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', caseData.request_id)
        .single();

      if (txData) {
        setTransaction(txData);
      }

      // 3. Charger les données de l'acheteur
      const { data: buyerData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', caseData.buyer_id)
        .single();

      if (buyerData) {
        setBuyer(buyerData);
      }

      // 4. Charger la parcelle
      const { data: parcelData } = await supabase
        .from('parcels')
        .select('*')
        .eq('id', caseData.parcelle_id)
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

      // 6. Charger les messages
      const { data: messagesData } = await supabase
        .from('purchase_case_messages')
        .select('*')
        .eq('case_id', caseData.id)
        .order('created_at', { ascending: true });

      setMessages(messagesData || []);

      // 7. Charger les documents
      const { data: docsData } = await supabase
        .from('documents_administratifs')
        .select('*')
        .eq('purchase_request_id', caseData.request_id)
        .order('created_at', { ascending: false });

      setDocuments(docsData || []);
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
        <Button onClick={() => navigate('/vendeur/purchase-requests')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux demandes
        </Button>
      </div>
    );
  }

  // Récupérer l'info du statut courant
  const statusInfo = PurchaseWorkflowService.WORKFLOW_STATUSES[purchaseCase.status.toUpperCase()];

  // Obtenir toutes les étapes du workflow
  const allSteps = Object.values(PurchaseWorkflowService.WORKFLOW_STATUSES)
    .sort((a, b) => a.order - b.order)
    .filter(s => !s.final); // Exclure les statuts finaux pour simplifier

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
                onClick={() => navigate('/vendeur/purchase-requests')}
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
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Workflow Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Suivi du dossier
                </CardTitle>
                <CardDescription>
                  Progression de votre demande d'achat comme un suivi de colis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {allSteps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const isNext = index === currentStepIndex + 1;

                    return (
                      <div key={step.key}>
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                                isCompleted
                                  ? 'bg-emerald-100 border-emerald-500'
                                  : isCurrent
                                  ? 'bg-blue-100 border-blue-500'
                                  : 'bg-slate-100 border-slate-300'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-6 h-6 text-emerald-600" />
                              ) : (
                                <Circle
                                  className={`w-6 h-6 ${
                                    isCurrent ? 'text-blue-600' : 'text-slate-400'
                                  }`}
                                />
                              )}
                            </motion.div>
                            {index < allSteps.length - 1 && (
                              <div
                                className={`w-1 h-12 my-2 ${
                                  isCompleted ? 'bg-emerald-300' : 'bg-slate-200'
                                }`}
                              />
                            )}
                          </div>
                          <div className="flex-1 pb-8">
                            <h3 className="font-semibold text-slate-900">{step.label}</h3>
                            <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                            <p className="text-xs text-slate-500 mt-2">Durée: {step.duration}</p>
                            
                            {/* Afficher la date pour les étapes complétées */}
                            {isCompleted && (
                              <div className="mt-2 text-xs text-emerald-600 font-medium">
                                ✓ Complété
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Messages, Documents, History */}
            <Card>
              <CardHeader>
                <CardTitle>Détails et communication</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="messages" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="messages">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Messagerie ({messages.length})
                    </TabsTrigger>
                    <TabsTrigger value="documents">
                      <FileText className="w-4 h-4 mr-2" />
                      Documents ({documents.length})
                    </TabsTrigger>
                    <TabsTrigger value="history">
                      <Clock className="w-4 h-4 mr-2" />
                      Historique
                    </TabsTrigger>
                  </TabsList>

                  {/* Onglet Messages */}
                  <TabsContent value="messages" className="space-y-4">
                    <div className="bg-slate-50 rounded-lg p-4 h-64 overflow-y-auto space-y-4">
                      {messages.length === 0 ? (
                        <p className="text-center text-slate-500 text-sm">Aucun message pour le moment</p>
                      ) : (
                        messages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-3 rounded-lg ${
                              msg.sender_id === user.id
                                ? 'bg-blue-100 ml-8'
                                : 'bg-white border border-slate-200 mr-8'
                            }`}
                          >
                            <p className="text-sm text-slate-900">{msg.message}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(msg.created_at).toLocaleString('fr-FR')}
                            </p>
                          </motion.div>
                        ))
                      )}
                    </div>

                    {/* Zone de saisie */}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="resize-none"
                        rows={2}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sendingMessage}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Onglet Documents */}
                  <TabsContent value="documents" className="space-y-4">
                    {documents.length === 0 ? (
                      <p className="text-center text-slate-500 text-sm py-8">Aucun document pour le moment</p>
                    ) : (
                      <div className="space-y-2">
                        {documents.map((doc) => (
                          <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="font-medium text-sm text-slate-900">{doc.document_name}</p>
                                <p className="text-xs text-slate-500">{doc.document_type}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* Onglet Historique */}
                  <TabsContent value="history" className="space-y-2">
                    {history.length === 0 ? (
                      <p className="text-center text-slate-500 text-sm py-8">Aucun historique pour le moment</p>
                    ) : (
                      history.map((entry) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-3 bg-slate-50 rounded-lg border-l-4 border-blue-500"
                        >
                          <p className="font-medium text-sm text-slate-900">{entry.status}</p>
                          <p className="text-xs text-slate-600 mt-1">{entry.notes}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            {new Date(entry.created_at).toLocaleString('fr-FR')}
                          </p>
                        </motion.div>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale - Informations */}
          <div className="space-y-6">
            {/* Infos de la transaction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Détails de l'offre
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600 font-medium">Montant</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {transaction ? `${transaction.amount?.toLocaleString('fr-FR')} FCFA` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">Mode de paiement</p>
                  <p className="text-slate-900">{transaction?.payment_method || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">Début</p>
                  <p className="text-sm text-slate-900">
                    {purchaseCase ? new Date(purchaseCase.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Infos de l'acheteur */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Acheteur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-slate-600 font-medium">Nom</p>
                  <p className="text-slate-900 font-medium">
                    {buyer ? `${buyer.first_name || ''} ${buyer.last_name || ''}`.trim() : 'N/A'}
                  </p>
                </div>
                {buyer?.email && (
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Email</p>
                    <a href={`mailto:${buyer.email}`} className="text-blue-600 hover:underline text-sm">
                      <Mail className="w-4 h-4 inline mr-1" />
                      {buyer.email}
                    </a>
                  </div>
                )}
                {buyer?.phone && (
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Téléphone</p>
                    <a href={`tel:${buyer.phone}`} className="text-blue-600 hover:underline text-sm">
                      <Phone className="w-4 h-4 inline mr-1" />
                      {buyer.phone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Infos de la propriété */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Propriété
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {parcel && (
                  <>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">Titre</p>
                      <p className="text-slate-900 font-medium">{parcel.title || parcel.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">Localisation</p>
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {parcel.location}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">Surface</p>
                      <p className="text-slate-900">{parcel.surface} m²</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-medium">Prix du bien</p>
                      <p className="text-slate-900">{parcel.price?.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendeurCaseTracking;

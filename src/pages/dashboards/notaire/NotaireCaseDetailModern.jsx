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
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
// import ContextualActionsPanel from '@/components/unified/ContextualActionsPanel';
// import PurchaseCaseMessaging from '@/components/messaging/PurchaseCaseMessaging';

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
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

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
      
      // Charger les messages
      loadMessages();

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

      // Charger les profils des uploaders
      if (docsData && docsData.length > 0) {
        const uploaderIds = [...new Set(docsData.map(d => d.uploaded_by).filter(Boolean))];
        
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', uploaderIds);

        // Mapper les profils aux documents
        const profilesMap = {};
        (profilesData || []).forEach(profile => {
          profilesMap[profile.id] = profile;
        });

        const docsWithUploaders = docsData.map(doc => ({
          ...doc,
          uploaded_by_name: profilesMap[doc.uploaded_by]?.full_name || 'Utilisateur'
        }));

        setDocuments(docsWithUploaders);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      setDocuments([]);
    }
  };

  const loadMessages = async () => {
    try {
      // Charger les messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('purchase_case_messages')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // Charger les profils des expéditeurs (utiliser sent_by qui est NOT NULL)
      if (messagesData && messagesData.length > 0) {
        const senderIds = [...new Set(messagesData.map(m => m.sent_by || m.sender_id).filter(Boolean))];
        
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url')
          .in('id', senderIds);

        // Mapper les profils aux messages
        const profilesMap = {};
        (profilesData || []).forEach(profile => {
          profilesMap[profile.id] = profile;
        });

        const messagesWithSenders = messagesData.map(msg => ({
          ...msg,
          sender_id: msg.sent_by || msg.sender_id, // Normaliser à sender_id
          sender: profilesMap[msg.sent_by || msg.sender_id] || null,
          content: msg.message || msg.content // Normaliser à content pour l'affichage
        }));

        setMessages(messagesWithSenders);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setSendingMessage(true);
      
      const { error } = await supabase
        .from('purchase_case_messages')
        .insert({
          case_id: caseId,
          sent_by: user.id,
          message: newMessage.trim(),
          message_type: 'text'
        });

      if (error) throw error;

      setNewMessage('');
      loadMessages();
      
      window.safeGlobalToast?.({
        title: "Message envoyé",
        variant: "success"
      });
    } catch (error) {
      console.error('Error sending message:', error);
      window.safeGlobalToast?.({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive"
      });
    } finally {
      setSendingMessage(false);
    }
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

                {/* Actions contextuelles - TODO: Implémenter */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actions disponibles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <FileText className="h-4 w-4" />
                        Préparer le contrat
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <Calendar className="h-4 w-4" />
                        Planifier la signature
                      </Button>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Valider les documents
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="messages">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Messages du dossier
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Messages list */}
                    <ScrollArea className="h-[400px] pr-4 mb-4">
                      <div className="space-y-4">
                        {messages.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>Aucun message pour le moment</p>
                            <p className="text-sm">Envoyez le premier message ci-dessous</p>
                          </div>
                        ) : (
                          messages.map((message) => {
                            const isOwnMessage = message.sender_id === user?.id;
                            return (
                              <div
                                key={message.id}
                                className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
                              >
                                <Avatar className="h-8 w-8 flex-shrink-0">
                                  {message.sender?.avatar_url ? (
                                    <img src={message.sender.avatar_url} alt={message.sender.full_name} />
                                  ) : (
                                    <AvatarFallback className={isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-300'}>
                                      {message.sender?.full_name?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div className={`flex-1 max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                                  <div className={`rounded-lg p-3 ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                                    <p className="text-xs font-medium mb-1 opacity-80">
                                      {message.sender?.full_name || 'Utilisateur'}
                                    </p>
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                  </div>
                                  <span className="text-xs text-gray-500 mt-1 px-1">
                                    {message.created_at ? new Date(message.created_at).toLocaleString('fr-FR', {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }) : ''}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </ScrollArea>

                    <Separator className="my-4" />

                    {/* Message input */}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Tapez votre message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="min-h-[80px] resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (newMessage.trim()) sendMessage();
                          }
                        }}
                      />
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={sendMessage}
                          disabled={sendingMessage || !newMessage.trim()}
                          size="icon"
                          className="h-10 w-10"
                        >
                          {sendingMessage ? (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          title="Joindre un fichier"
                          disabled
                        >
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Appuyez sur Entrée pour envoyer, Shift+Entrée pour un saut de ligne
                    </p>
                  </CardContent>
                </Card>
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
                    <ScrollArea className="h-[500px] pr-4">
                      <div className="space-y-6">
                        {/* Timeline vertical */}
                        <div className="relative pl-8 space-y-8">
                          {/* Ligne verticale */}
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                          {/* Event: Case created */}
                          <div className="relative">
                            <div className="absolute left-[-1.45rem] top-1 w-6 h-6 rounded-full bg-blue-500 border-4 border-white dark:border-gray-900 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-sm">Dossier créé</h4>
                                <span className="text-xs text-gray-500">
                                  {caseData.created_at ? new Date(caseData.created_at).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }) : 'Date inconnue'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Le dossier {caseData.case_number} a été créé
                              </p>
                            </div>
                          </div>

                          {/* Event: Current status */}
                          <div className="relative">
                            <div className={`absolute left-[-1.45rem] top-1 w-6 h-6 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center ${STATUS_META[caseData.status]?.color || 'bg-gray-400'}`}>
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-sm">
                                  {STATUS_META[caseData.status]?.label || caseData.status}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {caseData.updated_at ? new Date(caseData.updated_at).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }) : 'En cours'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Statut actuel du dossier
                              </p>
                            </div>
                          </div>

                          {/* Event: Notaire assignation */}
                          <div className="relative">
                            <div className="absolute left-[-1.45rem] top-1 w-6 h-6 rounded-full bg-green-500 border-4 border-white dark:border-gray-900 flex items-center justify-center">
                              <User className="w-3 h-3 text-white" />
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-sm">Notaire assigné</h4>
                                <span className="text-xs text-gray-500">Confirmé</span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Vous êtes le notaire en charge de ce dossier
                              </p>
                            </div>
                          </div>

                          {/* Placeholder for future events */}
                          {messages.length > 0 && (
                            <div className="relative">
                              <div className="absolute left-[-1.45rem] top-1 w-6 h-6 rounded-full bg-purple-500 border-4 border-white dark:border-gray-900 flex items-center justify-center">
                                <MessageSquare className="w-3 h-3 text-white" />
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-sm">{messages.length} message(s) échangé(s)</h4>
                                  <span className="text-xs text-gray-500">
                                    {messages[messages.length - 1]?.created_at ? 
                                      new Date(messages[messages.length - 1].created_at).toLocaleDateString('fr-FR', {
                                        day: 'numeric',
                                        month: 'short'
                                      }) : ''}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Dernier message envoyé
                                </p>
                              </div>
                            </div>
                          )}

                          {documents.length > 0 && (
                            <div className="relative">
                              <div className="absolute left-[-1.45rem] top-1 w-6 h-6 rounded-full bg-orange-500 border-4 border-white dark:border-gray-900 flex items-center justify-center">
                                <FileText className="w-3 h-3 text-white" />
                              </div>
                              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-sm">{documents.length} document(s) ajouté(s)</h4>
                                  <span className="text-xs text-gray-500">Disponibles</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Documents du dossier disponibles
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </ScrollArea>
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

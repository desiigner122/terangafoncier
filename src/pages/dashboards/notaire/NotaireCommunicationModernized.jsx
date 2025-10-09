import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Send, 
  Search, 
  Filter, 
  Phone, 
  Video, 
  Mail, 
  FileText, 
  Paperclip, 
  MoreVertical, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  UserCheck,
  Building,
  Scale,
  Plus,
  RefreshCw,
  Archive,
  Star,
  Flag,
  Eye,
  Download,
  Smile,
  ThumbsUp,
  Heart,
  X,
  Image,
  Upload
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import NotaireSupabaseService from '@/services/NotaireSupabaseService';

const NotaireCommunicationModernized = () => {
  const { dashboardStats } = useOutletContext();
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeChannel, setActiveChannel] = useState('messages');
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageReactions, setMessageReactions] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  
  // Emojis couramment utilisés
  const commonEmojis = [
    '👍', '👎', '❤️', '😊', '😂', '🎉', '✅', '❌', 
    '📁', '📄', '🏠', '🔑', '💰', '📞', '✉️', '⚠️',
    '🔔', '⏰', '📅', '✍️', '🤝', '💼', '🏛️', '⚖️'
  ];
  
  // États pour les données réelles
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [communicationStats, setCommunicationStats] = useState({
    totalConversations: 0,
    unreadMessages: 0,
    activeThreads: 0,
    pendingResponses: 0
  });

  // Chargement des données depuis Supabase
  useEffect(() => {
    if (user) {
      loadCommunications();
    }
  }, [user]);

  const loadCommunications = async () => {
    setIsLoading(true);
    try {
      const result = await NotaireSupabaseService.getTripartiteCommunications(user.id);
      if (result.success) {
        const communications = result.data || {};
        setConversations(communications.conversations || []);
        setMessages(communications.messages || {});
        setCommunicationStats(communications.stats || communicationStats);
        
        // Sélectionner la première conversation si elle existe
        if (communications.conversations && communications.conversations.length > 0 && !selectedConversation) {
          setSelectedConversation(communications.conversations[0]);
        }
      }
    } catch (error) {
      console.error('Erreur chargement communications:', error);
      window.safeGlobalToast({
        title: "Erreur de chargement",
        description: "Impossible de charger les communications",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if ((!messageText.trim() && attachments.length === 0) || !selectedConversation) return;

    try {
      const result = await NotaireSupabaseService.sendTripartiteMessage(user.id, {
        case_id: selectedConversation.case_id,
        content: messageText,
        message_type: 'message',
        attachments: attachments,
        recipients: selectedConversation.participants?.filter(p => p.id !== user.id) || []
      });

      if (result.success) {
        setMessageText('');
        setAttachments([]);
        // Recharger les messages
        await loadCommunications();
        window.safeGlobalToast({
          title: "Message envoyé",
          description: "Votre message a été envoyé avec succès",
          variant: "success"
        });
      }
    } catch (error) {
      console.error('Erreur envoi message:', error);
      window.safeGlobalToast({
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer le message",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newAttachments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setAttachments(prev => [...prev, ...newAttachments]);
  };

  const removeAttachment = (attachmentId) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const addReaction = (messageId, emoji) => {
    setMessageReactions(prev => ({
      ...prev,
      [messageId]: {
        ...prev[messageId],
        [emoji]: (prev[messageId]?.[emoji] || 0) + 1
      }
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getParticipantIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'notaire': return <Scale className="h-4 w-4" />;
      case 'banque': return <Building className="h-4 w-4" />;
      case 'client': return <UserCheck className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getParticipantColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'notaire': return 'bg-amber-100 text-amber-700';
      case 'banque': return 'bg-blue-100 text-blue-700';
      case 'client': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleInitiateCall = (type) => {
    if (!selectedConversation) return;
    
    const conversationName = selectedConversation.subject || 'Conversation';
    const participants = selectedConversation.participants?.map(p => p.name).join(', ') || 'participants';
    
    // Créer un lien de visioconférence (exemple avec Google Meet)
    const meetingUrl = `https://meet.google.com/new`;
    
    // Copier le lien dans le clipboard
    navigator.clipboard.writeText(meetingUrl).then(() => {
      window.safeGlobalToast({
        title: type === 'audio' ? "Appel vocal" : "Appel vidéo",
        description: `Lien de ${type === 'audio' ? 'l\'appel' : 'visioconférence'} copié dans le presse-papier`,
        variant: "success"
      });
      
      // Envoyer le lien dans le chat
      setMessageText(`📞 ${type === 'audio' ? 'Appel vocal' : 'Visioconférence'} : ${meetingUrl}`);
    }).catch(() => {
      // Si le clipboard ne marche pas, ouvrir directement
      window.open(meetingUrl, '_blank');
      window.safeGlobalToast({
        title: type === 'audio' ? "Appel vocal" : "Appel vidéo",
        description: `Ouverture de ${type === 'audio' ? 'l\'appel' : 'la visioconférence'}...`,
        variant: "info"
      });
    });
    
    setShowCallDialog(false);
  };

  // Filtrage des conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.participants?.some(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || conv.type?.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Communication Tripartite</h2>
          <p className="text-gray-600">Interface de communication Notaire-Banque-Client</p>
        </div>
        <Button onClick={loadCommunications} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Statistiques de communication */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversations</p>
                <p className="text-2xl font-bold text-gray-900">{conversations.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages non lus</p>
                <p className="text-2xl font-bold text-gray-900">{communicationStats.unreadMessages}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Threads actifs</p>
                <p className="text-2xl font-bold text-gray-900">{communicationStats.activeThreads}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En attente de réponse</p>
                <p className="text-2xl font-bold text-gray-900">{communicationStats.pendingResponses}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interface de messagerie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Liste des conversations */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Conversations</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher conversations, messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Recherche avancée */}
                {showAdvancedSearch && (
                  <div className="p-3 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex space-x-2">
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="unread">Non lus</SelectItem>
                          <SelectItem value="urgent">Urgents</SelectItem>
                          <SelectItem value="archived">Archivés</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={activeChannel} onValueChange={setActiveChannel}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Canal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="messages">Messages</SelectItem>
                          <SelectItem value="documents">Documents</SelectItem>
                          <SelectItem value="notifications">Notifications</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-between">
                      <Button size="sm" variant="outline" onClick={() => {
                        setSearchTerm('');
                        setFilterType('all');
                        setActiveChannel('messages');
                      }}>
                        Réinitialiser
                      </Button>
                      <Button size="sm" onClick={() => {
                        window.safeGlobalToast({
                          title: "Recherche appliquée",
                          description: "Filtres de recherche mis à jour",
                          variant: "success"
                        });
                      }}>
                        Appliquer
                      </Button>
                    </div>
                  </div>
                )}
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrer par type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les conversations</SelectItem>
                    <SelectItem value="tripartite">Tripartite</SelectItem>
                    <SelectItem value="banque-client">Banque-Client</SelectItem>
                    <SelectItem value="notaire-client">Notaire-Client</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[450px]">
                {filteredConversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune conversation trouvée</p>
                  </div>
                ) : (
                  <div className="space-y-2 p-2">
                    {filteredConversations.map((conversation) => (
                      <motion.div
                        key={conversation.id}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation?.id === conversation.id
                            ? 'bg-amber-50 border-2 border-amber-200'
                            : 'hover:bg-gray-50 border-2 border-transparent'
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {conversation.subject || 'Sans objet'}
                          </h4>
                          {conversation.unread > 0 && (
                            <Badge className="bg-red-500 text-white text-xs">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1 mb-2">
                          {conversation.participants?.slice(0, 3).map((participant, index) => (
                            <div key={index} className={`px-2 py-1 rounded text-xs ${getParticipantColor(participant.role)}`}>
                              {participant.role}
                            </div>
                          ))}
                        </div>
                        
                        <p className="text-xs text-gray-600 truncate mb-2">
                          {conversation.lastMessage || 'Aucun message'}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            {conversation.timestamp && formatTime(conversation.timestamp)}
                          </span>
                          {conversation.priority && (
                            <Badge className={`text-xs ${getPriorityColor(conversation.priority)}`}>
                              {conversation.priority}
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Zone de chat */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            {selectedConversation ? (
              <>
                {/* En-tête de conversation */}
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {selectedConversation.subject || 'Conversation'}
                      </CardTitle>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          {selectedConversation.participants?.map((participant, index) => (
                            <div key={index} className="flex items-center space-x-1">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {participant.name?.charAt(0) || participant.role?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">
                                {participant.name} ({participant.role})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <Separator />

                {/* Messages */}
                <CardContent className="flex-1 p-4">
                  <ScrollArea className="h-[300px] mb-4">
                    {messages[selectedConversation.id]?.length > 0 ? (
                      <div className="space-y-4">
                        {messages[selectedConversation.id].map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.isNotaire ? 'justify-end' : 'justify-start'} group`}
                          >
                            <div className={`max-w-[70%] ${
                              message.isNotaire 
                                ? 'bg-amber-100 text-amber-900' 
                                : 'bg-gray-100 text-gray-900'
                            } rounded-lg p-3 relative`}>
                              {/* Actions hover */}
                              <div className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 bg-white shadow-sm"
                                  onClick={() => addReaction(message.id, '👍')}
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 bg-white shadow-sm"
                                  onClick={() => addReaction(message.id, '❤️')}
                                >
                                  <Heart className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 bg-white shadow-sm"
                                  onClick={() => addReaction(message.id, '😊')}
                                >
                                  <Smile className="h-3 w-3" />
                                </Button>
                              </div>

                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-medium">
                                  {message.sender} ({message.role})
                                </span>
                                <span className="text-xs text-opacity-60">
                                  {message.timestamp}
                                </span>
                              </div>
                              
                              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                              
                              {/* Pièces jointes enrichies */}
                              {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  {message.attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center space-x-2 p-2 bg-white bg-opacity-50 rounded border">
                                      {attachment.type?.startsWith('image/') ? (
                                        <Image className="h-4 w-4 text-blue-500" />
                                      ) : (
                                        <FileText className="h-4 w-4 text-gray-500" />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">{attachment.name}</p>
                                        <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                                      </div>
                                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                        <Download className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Réactions */}
                              {messageReactions[message.id] && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {Object.entries(messageReactions[message.id]).map(([emoji, count]) => (
                                    <span key={emoji} className="inline-flex items-center px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs">
                                      {emoji} {count}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Indicateur de lecture */}
                              {message.isNotaire && (
                                <div className="flex justify-end mt-1">
                                  <div className="flex items-center space-x-1">
                                    {message.read ? (
                                      <>
                                        <CheckCircle className="h-3 w-3 text-blue-500" />
                                        <span className="text-xs text-blue-500">Lu</span>
                                      </>
                                    ) : (
                                      <>
                                        <Clock className="h-3 w-3 text-gray-400" />
                                        <span className="text-xs text-gray-400">Envoyé</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Aucun message dans cette conversation</p>
                      </div>
                    )}
                  </ScrollArea>

                  {/* Zone de saisie enrichie */}
                  <div className="space-y-3">
                    {/* Pièces jointes */}
                    {attachments.length > 0 && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Pièces jointes ({attachments.length})</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setAttachments([])}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-white rounded border">
                              {attachment.type?.startsWith('image/') ? (
                                <Image className="h-4 w-4 text-blue-500" />
                              ) : (
                                <FileText className="h-4 w-4 text-gray-500" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{attachment.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeAttachment(attachment.id)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Zone de saisie principale */}
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <Textarea
                          placeholder="Tapez votre message... (Shift+Entrée pour un saut de ligne)"
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="min-h-[80px] resize-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                        />
                        
                        {/* Barre d'outils */}
                        <div className="flex items-center justify-between mt-2 px-2">
                          <div className="flex items-center space-x-2">
                            <input
                              type="file"
                              id="file-upload"
                              multiple
                              onChange={handleFileUpload}
                              className="hidden"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => document.getElementById('file-upload').click()}
                              className="h-8 w-8 p-0"
                            >
                              <Paperclip className="h-4 w-4" />
                            </Button>
                            <div className="relative">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="h-8 w-8 p-0"
                              >
                                <Smile className="h-4 w-4" />
                              </Button>
                              {showEmojiPicker && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="absolute bottom-full left-0 mb-2 p-3 bg-white rounded-lg shadow-xl border z-50 w-64"
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-medium text-gray-700">Émojis fréquents</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setShowEmojiPicker(false)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-8 gap-1">
                                    {commonEmojis.map((emoji, index) => (
                                      <button
                                        key={index}
                                        onClick={() => handleEmojiSelect(emoji)}
                                        className="text-xl hover:bg-gray-100 rounded p-1 transition-colors"
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{messageText.length}/1000</span>
                            {attachments.length > 0 && (
                              <span>• {attachments.length} fichier(s)</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleInitiateCall('audio')}
                          title="Démarrer un appel vocal"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={sendMessage}
                          disabled={!messageText.trim() && attachments.length === 0}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sélectionnez une conversation
                  </h3>
                  <p className="text-gray-600">
                    Choisissez une conversation dans la liste pour commencer à discuter
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotaireCommunicationModernized;
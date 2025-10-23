import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, Search, Filter, MoreVertical,
  Phone, Video, Paperclip, Image as ImageIcon, Smile,
  Check, CheckCheck, Clock, Pin, Archive, Trash2,
  Star, Bell, BellOff, User, Users, Info, X,
  ArrowLeft, Download, Eye, RefreshCw, AlertCircle,
  Building
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';

const ParticulierMessagesModern = ({ onUnreadChange }) => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  
  // États
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [stats, setStats] = useState({
    totalConversations: 0,
    unreadCount: 0,
    todayMessages: 0,
    responseTime: '0h'
  });

  // Charger conversations
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  // Sélectionner conversation si paramètre query présent
  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId && conversations.length > 0) {
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }
  }, [searchParams, conversations]);

  // Charger messages quand conversation sélectionnée
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  // Auto-scroll vers le bas
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      
      console.log('📊 Chargement des conversations acheteur...', user.id);
      
      // Charger vraies conversations acheteur depuis Supabase
      const { data: conversationsData, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('buyer_id', user.id)
        .eq('is_archived_buyer', false)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur chargement conversations:', error);
        // Utiliser données mockées si erreur
        setConversations(getMockConversations());
        setStats({
          totalConversations: 3,
          unreadCount: 2,
          todayMessages: 5,
          responseTime: '2h'
        });
        setLoading(false);
        return;
      }

      // Fetch vendor profiles separately
      const vendorIds = conversationsData?.map(c => c.vendor_id).filter(Boolean) || [];
      const propertyIds = conversationsData?.map(c => c.property_id).filter(Boolean) || [];

      let profilesMap = {};
      let propertiesMap = {};

      if (vendorIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, avatar_url')
          .in('id', vendorIds);
        
        profiles?.forEach(p => {
          profilesMap[p.id] = p;
        });
      }

      if (propertyIds.length > 0) {
        const { data: properties } = await supabase
          .from('properties')
          .select('id, title, reference')
          .in('id', propertyIds);
        
        properties?.forEach(p => {
          propertiesMap[p.id] = p;
        });
      }

      // Mapper les données: vendor_id est le vendeur
      const formattedConversations = (conversationsData || []).map(conv => {
        const vendor = profilesMap[conv.vendor_id] || {};
        const property = propertiesMap[conv.property_id] || {};
        return {
          id: conv.id,
          thread_id: conv.thread_id || conv.id,
          vendor_id: conv.vendor_id,
          recipient_id: conv.vendor_id,
          vendor_name: `${vendor?.first_name || ''} ${vendor?.last_name || ''}`.trim() || 'Vendeur',
          vendor_email: vendor?.email || '',
          vendor_avatar: vendor?.avatar_url,
          property_title: property?.title || 'Propriété',
          property_id: property?.reference || '',
          subject: conv.subject || property?.title || 'Conversation Teranga',
          last_message: conv.last_message_preview || conv.last_message || '',
          last_message_time: conv.updated_at,
          unread_count: conv.unread_count_buyer || 0,
          is_pinned: conv.is_pinned_buyer || false,
          is_archived: conv.is_archived_buyer || false,
          status: 'active'
        };
      });

      setConversations(formattedConversations.length > 0 ? formattedConversations : getMockConversations());

      // Calculer stats
      const unreadCount = formattedConversations.reduce((sum, c) => sum + c.unread_count, 0);
      
      setStats({
        totalConversations: formattedConversations.length || 3,
        unreadCount: unreadCount || 2,
        todayMessages: 5,
        responseTime: '2h'
      });

      // Notifier le parent du compteur non lus
      if (onUnreadChange) {
        onUnreadChange(unreadCount);
      }
      
      console.log('✅', formattedConversations.length, 'conversations chargées');
      
    } catch (error) {
      console.error('❌ Erreur chargement conversations:', error);
      setConversations(getMockConversations());
      setStats({
        totalConversations: 3,
        unreadCount: 2,
        todayMessages: 5,
        responseTime: '2h'
      });
    } finally {
      setLoading(false);
    }
  };

  const getMockConversations = () => [
    {
      id: 'mock-1',
      thread_id: 'mock-thread-1',
      vendor_id: 'vendor-1',
      recipient_id: 'vendor-1',
      vendor_name: 'Amadou Diallo',
      vendor_email: 'amadou@example.com',
      vendor_avatar: null,
      property_title: 'Terrain Almadies 500m²',
      property_id: 'TER-001',
      subject: 'Demande d\'information',
      last_message: 'Bonjour, je suis intéressé par votre terrain...',
      last_message_time: new Date().toISOString(),
      unread_count: 2,
      is_pinned: false,
      is_archived: false,
      status: 'active'
    },
    {
      id: 'mock-2',
      thread_id: 'mock-thread-2',
      vendor_id: 'vendor-2',
      recipient_id: 'vendor-2',
      vendor_name: 'Fatou Ndiaye',
      vendor_email: 'fatou@example.com',
      vendor_avatar: null,
      property_title: 'Villa Mermoz 4 pièces',
      property_id: 'VIL-002',
      subject: 'Visite du bien',
      last_message: 'La visite est confirmée pour demain à 10h',
      last_message_time: new Date(Date.now() - 3600000).toISOString(),
      unread_count: 0,
      is_pinned: true,
      is_archived: false,
      status: 'active'
    },
    {
      id: 'mock-3',
      thread_id: 'mock-thread-3',
      vendor_id: 'vendor-3',
      recipient_id: 'vendor-3',
      vendor_name: 'Moussa Sarr',
      vendor_email: 'moussa@example.com',
      vendor_avatar: null,
      property_title: 'Appartement Plateau 3 pièces',
      property_id: 'APP-003',
      subject: 'Négociation prix',
      last_message: 'Je peux proposer 45M pour un paiement comptant',
      last_message_time: new Date(Date.now() - 86400000).toISOString(),
      unread_count: 0,
      is_pinned: false,
      is_archived: false,
      status: 'active'
    }
  ];

  const loadMessages = async (conversation) => {
    try {
      console.log('📨 Chargement messages conversation:', conversation.thread_id);
      
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', conversation.thread_id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Erreur chargement messages:', error);
        // Utiliser messages mockés
        setMessages(getMockMessages(conversation));
        return;
      }

      // Transformer les messages de la BDD vers le format d'affichage
      const formattedMessages = messagesData?.map(msg => ({
        id: msg.id,
        conversation_id: conversation.thread_id,
        sender_id: msg.sender_id,
        sender_type: msg.sender_id === user.id ? 'buyer' : 'vendor',
        sender_name: msg.sender_id === user.id ? 'Vous' : conversation.vendor_name || 'Vendeur',
        content: msg.message, // Le champ 'message' de la table devient 'content' pour l'affichage
        subject: msg.subject,
        sent_at: msg.created_at,
        read_at: msg.read_at,
        attachments: msg.attachments || []
      })) || [];

      setMessages(formattedMessages.length > 0 ? formattedMessages : getMockMessages(conversation));
      
      // Marquer messages comme lus
      if (conversation.unread_count > 0) {
        await markAsRead(conversation.id);
      }
      
    } catch (error) {
      console.error('❌ Erreur chargement messages:', error);
      setMessages(getMockMessages(conversation));
    }
  };

  const getMockMessages = (conversation) => [
    {
      id: 'msg-1',
      sender_id: user.id,
      sender_type: 'buyer',
      content: `Bonjour, je suis intéressé par ${conversation.property_title}. Pouvez-vous me donner plus d'informations?`,
      created_at: new Date(Date.now() - 7200000).toISOString(),
      is_read: true
    },
    {
      id: 'msg-2',
      sender_id: conversation.vendor_id,
      sender_type: 'vendor',
      content: `Bonjour! Merci pour votre intérêt. Le terrain fait 500m² et est situé dans un quartier résidentiel calme.`,
      created_at: new Date(Date.now() - 5400000).toISOString(),
      is_read: true
    },
    {
      id: 'msg-3',
      sender_id: user.id,
      sender_type: 'buyer',
      content: 'Serait-il possible d\'organiser une visite cette semaine?',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      is_read: true
    }
  ];

  const markAsRead = async (conversationId) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ unread_count_buyer: 0 })
        .eq('id', conversationId);

      if (!error) {
        // Mettre à jour local
        setConversations(prev => prev.map(c => 
          c.id === conversationId ? { ...c, unread_count: 0 } : c
        ));
      }
    } catch (error) {
      console.error('❌ Erreur mark as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const threadId = selectedConversation.thread_id || selectedConversation.id;
      const recipientId = selectedConversation.vendor_id;
      const subject = selectedConversation.subject || selectedConversation.property_title || 'Message acheteur';

      if (!recipientId) {
        toast.error('Destinataire introuvable pour cette conversation');
        return;
      }

      // Envoyer via Supabase avec les bons champs
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          subject,
          message: newMessage.trim(),
          thread_id: threadId,
          status: 'sent'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur envoi message:', error);
        toast.error('Erreur lors de l\'envoi du message');
        return;
      }

      // Ajouter le message à l'interface avec le bon format
      const formattedMessage = {
        id: data.id,
        conversation_id: threadId,
        sender_id: user.id,
        sender_type: 'buyer',
        sender_name: 'Vous',
        content: newMessage.trim(),
        subject,
        sent_at: data.created_at,
        read_at: null,
        attachments: []
      };

      setMessages(prev => [...prev, formattedMessage]);
      setNewMessage('');
      
      // Mettre à jour la conversation
      await supabase
        .from('conversations')
        .update({
          last_message_preview: newMessage.trim(),
          last_message: newMessage.trim(),
          updated_at: new Date().toISOString(),
          unread_count_vendor: (selectedConversation.unread_count_vendor || 0) + 1
        })
        .eq('id', selectedConversation.id);

      // Mettre à jour localement
      setConversations(prev => prev.map(c =>
        c.id === selectedConversation.id
          ? { ...c, last_message: newMessage.trim(), last_message_time: data.created_at, unread_count: 0 }
          : c
      ));

      toast.success('Message envoyé avec succès');
      
    } catch (error) {
      console.error('❌ Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'À l\'instant';
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.property_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.last_message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Sidebar - Liste des conversations */}
      <div className="w-96 border-r border-slate-200 bg-white/80 backdrop-blur-sm flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Messages</h2>
              <p className="text-sm text-slate-500">
                {stats.unreadCount > 0 
                  ? `${stats.unreadCount} non lu${stats.unreadCount > 1 ? 's' : ''}`
                  : 'Toutes les conversations'
                }
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Rechercher conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-50 border-slate-200"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <MessageSquare className="h-12 w-12 text-slate-300 mb-3" />
                <p className="text-sm text-slate-600">Aucune conversation</p>
                <p className="text-xs text-slate-400 mt-1">
                  Contactez des vendeurs pour commencer
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredConversations.map((conv) => (
                  <motion.button
                    key={conv.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onClick={() => setSelectedConversation(conv)}
                    className={`
                      w-full p-3 rounded-lg text-left transition-all mb-2
                      ${selectedConversation?.id === conv.id
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                        : 'bg-white hover:bg-slate-50 border border-slate-200'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="relative">
                        <Avatar className="h-11 w-11 ring-2 ring-white">
                          <AvatarImage src={conv.vendor_avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                            {conv.vendor_name?.charAt(0) || 'V'}
                          </AvatarFallback>
                        </Avatar>
                        {conv.unread_count > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white">
                              {conv.unread_count > 9 ? '9+' : conv.unread_count}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className={`font-semibold text-sm truncate ${
                            selectedConversation?.id === conv.id ? 'text-white' : 'text-slate-900'
                          }`}>
                            {conv.vendor_name}
                          </h4>
                          <span className={`text-[11px] ml-2 ${
                            selectedConversation?.id === conv.id ? 'text-white/80' : 'text-slate-500'
                          }`}>
                            {formatTime(conv.last_message_time)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 mb-1">
                          <Building className={`h-3 w-3 ${
                            selectedConversation?.id === conv.id ? 'text-white/60' : 'text-slate-400'
                          }`} />
                          <span className={`text-[11px] truncate ${
                            selectedConversation?.id === conv.id ? 'text-white/80' : 'text-slate-600'
                          }`}>
                            {conv.property_title}
                          </span>
                        </div>

                        <p className={`text-xs truncate ${
                          selectedConversation?.id === conv.id ? 'text-white/70' : 'text-slate-500'
                        }`}>
                          {conv.last_message}
                        </p>
                      </div>

                      {conv.is_pinned && (
                        <Pin className={`h-3 w-3 ml-1 ${
                          selectedConversation?.id === conv.id ? 'text-white' : 'text-blue-600'
                        }`} />
                      )}
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Zone de conversation */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header conversation */}
            <div className="p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
                    <AvatarImage src={selectedConversation.vendor_avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
                      {selectedConversation.vendor_name?.charAt(0) || 'V'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {selectedConversation.vendor_name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Building className="h-3 w-3" />
                      <span>{selectedConversation.property_title}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowInfo(!showInfo)}>
                    <Info className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-slate-50/50">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((message) => {
                  const isMe = message.sender_id === user.id || message.sender_type === 'buyer';
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`
                        max-w-md p-3 rounded-2xl
                        ${isMe 
                          ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white rounded-br-sm' 
                          : 'bg-white border border-slate-200 text-slate-900 rounded-bl-sm shadow-sm'
                        }
                      `}>
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center gap-1 mt-1 text-[11px] ${
                          isMe ? 'text-white/70 justify-end' : 'text-slate-400'
                        }`}>
                          <span>{formatTime(message.created_at)}</span>
                          {isMe && (
                            <CheckCheck className={`h-3 w-3 ${message.is_read ? 'text-blue-200' : 'text-white/50'}`} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input message */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="flex items-end gap-2 max-w-4xl mx-auto">
                <Button variant="ghost" size="sm" className="mb-2">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="mb-2">
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Écrire un message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    className="pr-10 py-6 border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <Smile className="h-4 w-4 text-slate-400" />
                  </Button>
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-6 py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          // État vide
          <div className="flex-1 flex items-center justify-center bg-slate-50/50">
            <div className="text-center">
              <MessageSquare className="h-20 w-20 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                Sélectionnez une conversation
              </h3>
              <p className="text-sm text-slate-500">
                Choisissez un vendeur pour commencer la discussion
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Panel info (optionnel) */}
      <AnimatePresence>
        {showInfo && selectedConversation && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="w-80 border-l border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Informations</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowInfo(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Vendeur */}
              <div className="text-center pb-4 border-b border-slate-200">
                <Avatar className="h-16 w-16 mx-auto mb-2 ring-2 ring-blue-500/20">
                  <AvatarImage src={selectedConversation.vendor_avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white text-xl">
                    {selectedConversation.vendor_name?.charAt(0) || 'V'}
                  </AvatarFallback>
                </Avatar>
                <h4 className="font-semibold text-slate-900">{selectedConversation.vendor_name}</h4>
                <p className="text-sm text-slate-500">{selectedConversation.vendor_email}</p>
              </div>

              {/* Propriété */}
              <div>
                <h5 className="text-xs font-semibold text-slate-700 uppercase mb-2">Propriété</h5>
                <Card className="p-3">
                  <div className="flex items-start gap-2">
                    <Building className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-slate-900">{selectedConversation.property_title}</p>
                      <p className="text-xs text-slate-500">Réf: {selectedConversation.property_id}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Pin className="h-4 w-4 mr-2" />
                  Épingler la conversation
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <BellOff className="h-4 w-4 mr-2" />
                  Désactiver les notifications
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600" size="sm">
                  <Archive className="h-4 w-4 mr-2" />
                  Archiver la conversation
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParticulierMessagesModern;

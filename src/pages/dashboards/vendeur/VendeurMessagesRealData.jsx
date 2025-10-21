import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, Search, Filter, MoreVertical,
  Phone, Video, Paperclip, Image as ImageIcon, Smile,
  Check, CheckCheck, Clock, Pin, Archive, Trash2,
  Star, Bell, BellOff, User, Users, Info, X,
  ArrowLeft, Download, Eye, RefreshCw, AlertCircle
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

const VendeurMessagesRealData = () => {
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
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  // Auto-scroll vers le bas
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      
      // Charger vraies conversations vendeur depuis Supabase
      // Conversations utilise vendor_id et buyer_id (vendeur = participant2, acheteur = participant1)
      const { data: conversationsData, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('vendor_id', user.id)
        .eq('is_archived_vendor', false)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Fetch buyer profiles separately
      const buyerIds = conversationsData?.map(c => c.buyer_id).filter(Boolean) || [];
      const propertyIds = conversationsData?.map(c => c.property_id).filter(Boolean) || [];

      let profilesMap = {};
      let propertiesMap = {};

      if (buyerIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, avatar_url')
          .in('id', buyerIds);
        
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

      // Mapper les données: buyer_id est l'acheteur
      const formattedConversations = (conversationsData || []).map(conv => {
        const buyer = profilesMap[conv.buyer_id] || {};
        const property = propertiesMap[conv.property_id] || {};
        return {
          id: conv.id,
          buyer_name: `${buyer?.first_name || ''} ${buyer?.last_name || ''}`.trim() || 'Utilisateur',
          buyer_email: buyer?.email || '',
          buyer_avatar: buyer?.avatar_url,
          property_title: property?.title || 'Propriété',
          property_id: property?.reference || '',
          last_message: conv.last_message_preview || '',
          last_message_time: conv.updated_at,
          unread_count: conv.unread_count_vendor || 0,
          is_pinned: conv.is_pinned_vendor || false,
          is_archived: conv.is_archived_vendor || false,
          status: 'active'
        };
      });

      setConversations(formattedConversations);

      // Calculer stats
      const unreadCount = formattedConversations.reduce((sum, c) => sum + c.unread_count, 0);
      const todayMessages = await getTodayMessagesCount();
      
      setStats({
        totalConversations: formattedConversations.length,
        unreadCount,
        todayMessages,
        responseTime: '2h' // À calculer vraiment
      });

      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
      toast.error('Erreur lors du chargement des conversations');
      setLoading(false);
    }
  };

  const getTodayMessagesCount = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('messages_vendeur')
        .select('id')
        .eq('sender_id', user.id)
        .gte('created_at', today.toISOString());

      if (error) throw error;
      return data?.length || 0;
    } catch (error) {
      console.error('Erreur comptage messages:', error);
      return 0;
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      // Charger vraies messages depuis Supabase
      const { data: messagesData, error } = await supabase
        .from('messages_vendeur')
        .select(`
          *,
          sender:profiles!messages_vendeur_sender_id_fkey(
            id,
            first_name,
            last_name,
            role
          )
        `)
        .eq('thread_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages = (messagesData || []).map(msg => ({
        id: msg.id,
        conversation_id: msg.conversation_id,
        sender_type: msg.sender?.role === 'vendeur' ? 'vendor' : 'buyer',
        content: msg.content,
        sent_at: msg.created_at,
        read_at: msg.read_at,
        attachments: msg.attachments || []
      }));

      setMessages(formattedMessages);

      // Marquer comme lu
      markAsRead(conversationId);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      toast.error('Erreur lors du chargement des messages');
    }
  };

  const markAsRead = async (conversationId) => {
    try {
      // Marquer messages comme lus
      const { error } = await supabase
        .from('messages_vendeur')
        .update({ read_at: new Date().toISOString() })
        .eq('thread_id', conversationId)
        .is('read_at', null)
        .neq('sender_id', user.id);

      if (error) throw error;

      // Mettre à jour le compteur local
      setConversations(prev => prev.map(c => 
        c.id === conversationId ? { ...c, unread_count: 0 } : c
      ));

      // Mettre à jour stats
      setStats(prev => ({
        ...prev,
        unreadCount: Math.max(0, prev.unreadCount - (selectedConversation?.unread_count || 0))
      }));
    } catch (error) {
      console.error('Erreur marquage lu:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      // Envoyer via Supabase
      const { data, error } = await supabase
        .from('messages_vendeur')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          content: newMessage.trim(),
          read_at: null
        })
        .select()
        .single();

      if (error) throw error;

      const message = {
        id: data.id,
        conversation_id: selectedConversation.id,
        sender_type: 'vendor',
        content: newMessage.trim(),
        sent_at: data.created_at,
        read_at: null,
        attachments: []
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');

      // Mettre à jour conversation
      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          last_message: message.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedConversation.id);

      if (updateError) throw updateError;

      // Mettre à jour localement
      setConversations(prev => prev.map(c =>
        c.id === selectedConversation.id
          ? { ...c, last_message: message.content, last_message_time: message.sent_at }
          : c
      ));

      toast.success('Message envoyé');
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi');
    }
  };

  const handlePinConversation = async (conversationId) => {
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      const newPinnedState = !conversation.is_pinned;

      const { error } = await supabase
        .from('conversations')
        .update({ is_pinned_by_p2: newPinnedState })
        .eq('id', conversationId);

      if (error) throw error;

      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, is_pinned: newPinnedState } : c
      ));

      toast.success(newPinnedState ? 'Conversation épinglée' : 'Conversation désépinglée');
    } catch (error) {
      console.error('Erreur épinglage:', error);
      toast.error('Erreur lors de l\'épinglage');
    }
  };

  const handleArchiveConversation = async (conversationId) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ is_archived_by_p2: true })
        .eq('id', conversationId);

      if (error) throw error;

      setConversations(prev => prev.filter(c => c.id !== conversationId));
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
      }

      toast.success('Conversation archivée');
    } catch (error) {
      console.error('Erreur archivage:', error);
      toast.error('Erreur lors de l\'archivage');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now - messageDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;
    return messageDate.toLocaleDateString('fr-FR');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredConversations = conversations
    .filter(c => !c.is_archived)
    .filter(c =>
      c.buyer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.property_title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Pinned first
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      // Then by time
      return new Date(b.last_message_time) - new Date(a.last_message_time);
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] p-6 max-w-7xl mx-auto">
      <Card className="h-full flex flex-col">
        {/* Header avec stats */}
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                Messages
              </CardTitle>
              <CardDescription>
                {stats.unreadCount > 0 ? (
                  <span className="text-red-600 font-semibold">
                    {stats.unreadCount} message{stats.unreadCount > 1 ? 's' : ''} non lu{stats.unreadCount > 1 ? 's' : ''}
                  </span>
                ) : (
                  'Toutes vos conversations'
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.totalConversations}</p>
                <p className="text-xs text-gray-600">Conversations</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{stats.todayMessages}</p>
                <p className="text-xs text-gray-600">Aujourd'hui</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.responseTime}</p>
                <p className="text-xs text-gray-600">Temps réponse</p>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Corps principal */}
        <CardContent className="flex-1 p-0 flex overflow-hidden">
          {/* Liste conversations */}
          <div className="w-96 border-r flex flex-col">
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversations list */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Aucune conversation</p>
                  </div>
                ) : (
                  filteredConversations.map((conv, index) => (
                    <motion.div
                      key={conv.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors ${
                        selectedConversation?.id === conv.id
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={conv.buyer_avatar} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {getInitials(conv.buyer_name)}
                            </AvatarFallback>
                          </Avatar>
                          {conv.unread_count > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white font-semibold">
                                {conv.unread_count}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-gray-900 truncate">
                              {conv.buyer_name}
                            </p>
                            {conv.is_pinned && <Pin className="h-4 w-4 text-blue-600" />}
                          </div>
                          <p className="text-sm text-gray-600 mb-1 truncate">
                            {conv.property_title}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {conv.last_message || 'Aucun message'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTime(conv.last_message_time)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Zone de chat */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedConversation.buyer_avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getInitials(selectedConversation.buyer_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedConversation.buyer_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedConversation.property_title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowInfo(!showInfo)}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Aucun message dans cette conversation</p>
                      </div>
                    ) : (
                      messages.map((msg, index) => {
                        const isVendor = msg.sender_type === 'vendor';
                        
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex ${isVendor ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] ${isVendor ? 'order-2' : 'order-1'}`}>
                              <div
                                className={`rounded-lg p-3 ${
                                  isVendor
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                }`}
                              >
                                <p className="text-sm">{msg.content}</p>
                              </div>
                              <div className="flex items-center gap-1 mt-1 px-1">
                                <span className="text-xs text-gray-500">
                                  {formatTime(msg.sent_at)}
                                </span>
                                {isVendor && (
                                  msg.read_at ? (
                                    <CheckCheck className="h-3 w-3 text-blue-600" />
                                  ) : (
                                    <Check className="h-3 w-3 text-gray-400" />
                                  )
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input zone */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button variant="ghost" size="sm">
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Sélectionnez une conversation</p>
                  <p className="text-sm">pour commencer à chatter</p>
                </div>
              </div>
            )}
          </div>

          {/* Info sidebar */}
          <AnimatePresence>
            {showInfo && selectedConversation && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="w-80 border-l p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Informations</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowInfo(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="text-center pb-4 border-b">
                    <Avatar className="w-20 h-20 mx-auto mb-3">
                      <AvatarImage src={selectedConversation.buyer_avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                        {getInitials(selectedConversation.buyer_name)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-gray-900">
                      {selectedConversation.buyer_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedConversation.buyer_email}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Propriété</p>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium">{selectedConversation.property_title}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        Réf: {selectedConversation.property_id}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handlePinConversation(selectedConversation.id)}
                    >
                      <Pin className="h-4 w-4 mr-2" />
                      {selectedConversation.is_pinned ? 'Désépingler' : 'Épingler'}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleArchiveConversation(selectedConversation.id)}
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Archiver
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendeurMessagesRealData;

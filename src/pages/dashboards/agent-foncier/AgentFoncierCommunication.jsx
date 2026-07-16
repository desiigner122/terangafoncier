import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  Phone,
  Video,
  Bell,
  Clock,
  Check,
  CheckCheck,
  Plus,
  Paperclip,
  Smile,
  MoreVertical,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

// Initiales à partir d'un nom (ex: "Amadou Diallo" -> "AD")
const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Horodatage relatif lisible à partir d'une date réelle
const formatRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const d = new Date(date);
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  if (isToday) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  if (isYesterday) return 'Hier';
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
};

// Durée lisible à partir d'un nombre de millisecondes (temps de réponse réel)
const formatDuration = (ms) => {
  if (!ms || ms <= 0) return '—';
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rem = minutes % 60;
  return rem > 0 ? `${hours}h${String(rem).padStart(2, '0')}` : `${hours}h`;
};

const AgentFoncierCommunication = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [stats, setStats] = useState({
    totalMessages: 0,
    messagesNonLus: 0,
    conversationsActives: 0,
    tempsReponse: '—'
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation?.id) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Calcule le temps de réponse moyen réel de l'agent
  // (délai entre un message reçu et la réponse de l'agent)
  const computeAvgResponse = (messagesByConversation) => {
    const deltas = [];
    messagesByConversation.forEach(convMessages => {
      let pendingIncomingAt = null;
      convMessages.forEach(m => {
        const isAgent = m.sender_id === user.id;
        if (!isAgent) {
          if (pendingIncomingAt === null) pendingIncomingAt = new Date(m.created_at).getTime();
        } else if (pendingIncomingAt !== null) {
          const delta = new Date(m.created_at).getTime() - pendingIncomingAt;
          if (delta > 0) deltas.push(delta);
          pendingIncomingAt = null;
        }
      });
    });
    if (deltas.length === 0) return '—';
    const avg = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    return formatDuration(avg);
  };

  const loadConversations = async () => {
    try {
      setLoading(true);

      // 1) Conversations auxquelles l'agent participe
      const { data: participations, error: partError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);
      if (partError) throw partError;

      const conversationIds = [...new Set((participations || []).map(p => p.conversation_id).filter(Boolean))];
      if (conversationIds.length === 0) {
        setConversations([]);
        setStats({ totalMessages: 0, messagesNonLus: 0, conversationsActives: 0, tempsReponse: '—' });
        setLoading(false);
        return;
      }

      // 2) Détails des conversations + participants
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('*, participants:conversation_participants(user_id)')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });
      if (convError) throw convError;

      // 3) Profils des interlocuteurs, biens liés et messages
      const otherParticipantIds = [...new Set(
        (convData || []).flatMap(c =>
          (c.participants || [])
            .map(p => p.user_id)
            .filter(id => id && id !== user.id)
        )
      )];
      const propertyIds = [...new Set((convData || []).map(c => c.property_id).filter(Boolean))];

      const [profilesRes, propertiesRes, messagesRes] = await Promise.all([
        otherParticipantIds.length > 0
          ? supabase.from('profiles').select('id, full_name, first_name, last_name, avatar_url, city, region').in('id', otherParticipantIds)
          : Promise.resolve({ data: [] }),
        propertyIds.length > 0
          ? supabase.from('properties').select('id, title, name, location').in('id', propertyIds)
          : Promise.resolve({ data: [] }),
        supabase
          .from('messages')
          .select('id, conversation_id, sender_id, content, read, created_at')
          .in('conversation_id', conversationIds)
          .order('created_at', { ascending: true })
      ]);

      const profilesById = new Map((profilesRes.data || []).map(p => [p.id, p]));
      const propertiesById = new Map((propertiesRes.data || []).map(p => [p.id, p]));

      // Grouper les messages par conversation
      const messagesByConversation = new Map();
      (messagesRes.data || []).forEach(msg => {
        if (!messagesByConversation.has(msg.conversation_id)) {
          messagesByConversation.set(msg.conversation_id, []);
        }
        messagesByConversation.get(msg.conversation_id).push(msg);
      });

      const formatted = (convData || []).map(conv => {
        const otherId = (conv.participants || [])
          .map(p => p.user_id)
          .find(id => id && id !== user.id);
        const participant = otherId ? profilesById.get(otherId) : null;
        const property = conv.property_id ? propertiesById.get(conv.property_id) : null;
        const convMessages = messagesByConversation.get(conv.id) || [];
        const lastMessage = convMessages[convMessages.length - 1];
        const unread = convMessages.filter(m => !m.read && m.sender_id !== user.id).length;

        const name = participant
          ? (participant.full_name
              || `${participant.first_name || ''} ${participant.last_name || ''}`.trim()
              || 'Interlocuteur')
          : 'Interlocuteur';

        return {
          id: conv.id,
          contactId: otherId || null,
          name,
          avatar: participant?.avatar_url || null,
          subject: conv.subject || property?.title || property?.name || 'Conversation',
          location: property?.location || participant?.city || participant?.region || '',
          lastMessage: lastMessage?.content || '',
          timestamp: formatRelativeTime(lastMessage?.created_at || conv.updated_at || conv.created_at),
          unread
        };
      });

      // Stats dérivées de la vraie donnée
      const totalMessages = (messagesRes.data || []).length;
      const messagesNonLus = (messagesRes.data || []).filter(m => !m.read && m.sender_id !== user.id).length;
      const tempsReponse = computeAvgResponse(messagesByConversation);

      setConversations(formatted);
      setStats({
        totalMessages,
        messagesNonLus,
        conversationsActives: formatted.length,
        tempsReponse
      });
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
      setConversations([]);
      setStats({ totalMessages: 0, messagesNonLus: 0, conversationsActives: 0, tempsReponse: '—' });
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id, conversation_id, sender_id, content, read, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (error) throw error;

      const formatted = (data || []).map(msg => ({
        id: msg.id,
        sender: msg.sender_id === user.id ? 'me' : 'client',
        content: msg.content,
        read: msg.read,
        timestamp: formatRelativeTime(msg.created_at)
      }));

      setMessages(formatted);
      markConversationRead(conversationId);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      setMessages([]);
    }
  };

  // Marquer comme lus les messages reçus
  const markConversationRead = async (conversationId) => {
    try {
      const { data: convBefore } = await supabase
        .from('messages')
        .select('id')
        .eq('conversation_id', conversationId)
        .eq('read', false)
        .neq('sender_id', user.id);
      const readCount = (convBefore || []).length;
      if (readCount === 0) return;

      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .eq('read', false)
        .neq('sender_id', user.id);

      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, unread: 0 } : c
      ));
      setStats(prev => ({
        ...prev,
        messagesNonLus: Math.max(0, prev.messagesNonLus - readCount)
      }));
    } catch (error) {
      console.error('Erreur marquage lu:', error);
    }
  };

  const handleSendMessage = async () => {
    const content = newMessage.trim();
    if (!content || !selectedConversation || sending) return;

    try {
      setSending(true);
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          content,
          read: false
        })
        .select()
        .single();
      if (error) throw error;

      setMessages(prev => [...prev, {
        id: data.id,
        sender: 'me',
        content: data.content,
        read: false,
        timestamp: formatRelativeTime(data.created_at)
      }]);
      setNewMessage('');

      // Rafraîchir l'activité de la conversation
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedConversation.id);

      setConversations(prev => prev.map(c =>
        c.id === selectedConversation.id
          ? { ...c, lastMessage: content, timestamp: formatRelativeTime(data.created_at) }
          : c
      ));
      setStats(prev => ({ ...prev, totalMessages: prev.totalMessages + 1 }));
    } catch (error) {
      console.error('Erreur envoi message:', error);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statCards = [
    { title: 'Total Messages', value: stats.totalMessages, icon: MessageSquare, color: 'from-blue-500 to-cyan-600' },
    { title: 'Non Lus', value: stats.messagesNonLus, icon: Bell, color: 'from-red-500 to-pink-600' },
    { title: 'Conversations', value: stats.conversationsActives, icon: Users, color: 'from-green-500 to-emerald-600' },
    { title: 'Tps Réponse', value: stats.tempsReponse, icon: Clock, color: 'from-purple-500 to-indigo-600' }
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 bg-clip-text text-transparent">
            Communication
          </h1>
          <p className="text-slate-600">Messagerie et suivi des échanges</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Phone className="w-4 h-4 mr-2" />
            Appeler
          </Button>
          <Button variant="outline">
            <Video className="w-4 h-4 mr-2" />
            Visio
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-600">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Interface de messagerie */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]"
      >
        {/* Liste des conversations */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 overflow-y-auto max-h-[480px]">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm font-medium text-slate-600">Aucune conversation</p>
                  <p className="text-xs text-slate-400">Vos échanges apparaîtront ici</p>
                </div>
              ) : filteredConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center space-x-3 p-3 cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? 'bg-amber-50 border-r-2 border-amber-500'
                      : 'hover:bg-slate-50'
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.avatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                        {getInitials(conversation.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 truncate">{conversation.name}</p>
                      <div className="flex items-center space-x-1">
                        {conversation.unread > 0 && (
                          <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 truncate">{conversation.subject}</p>
                    <p className="text-sm text-slate-500 truncate">{conversation.lastMessage || 'Aucun message'}</p>
                    <p className="text-xs text-slate-400">{conversation.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Zone de chat */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              {/* Header du chat */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedConversation.avatar || undefined} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                          {getInitials(selectedConversation.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{selectedConversation.name}</h3>
                      <p className="text-sm text-slate-600">{selectedConversation.subject}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-slate-500">
                      <MessageSquare className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                      <p className="text-sm">Aucun message dans cette conversation</p>
                    </div>
                  </div>
                ) : messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'me'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-xs ${message.sender === 'me' ? 'text-amber-100' : 'text-slate-500'}`}>
                          {message.timestamp}
                        </p>
                        {message.sender === 'me' && (
                          <div className="ml-2">
                            {message.read ? (
                              <CheckCheck className="w-3 h-3 text-amber-100" />
                            ) : (
                              <Check className="w-3 h-3 text-amber-100" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Zone de saisie */}
              <div className="border-t p-4">
                <div className="flex items-end space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[40px] max-h-[120px] resize-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <Button variant="ghost" size="sm">
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="bg-gradient-to-r from-amber-500 to-orange-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-slate-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium">Sélectionnez une conversation</p>
                <p className="text-sm">Choisissez une conversation pour commencer à chatter</p>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default AgentFoncierCommunication;

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Video,
  Phone,
  Mail,
  Users,
  Calendar,
  Clock,
  FileText,
  Send,
  Paperclip,
  Search,
  Filter,
  Star,
  MapPin,
  Building,
  User,
  CheckCircle,
  Circle,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';

const GeometreCommunication = () => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [meetings, setMeetings] = useState([]);

  // Chargement des conversations réelles (conversation_participants + conversations + messages)
  useEffect(() => {
    if (user?.id) {
      loadConversations();
      loadUpcomingMeetings();
    }
  }, [user?.id]);

  // Chargement des messages de la conversation sélectionnée
  useEffect(() => {
    if (activeChat?.id) {
      loadMessages(activeChat.id);
    } else {
      setMessages([]);
    }
  }, [activeChat?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);

      // Conversations réelles auxquelles le géomètre participe
      const { data: participations, error: partError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);
      if (partError) throw partError;

      const conversationIds = [...new Set((participations || []).map(p => p.conversation_id).filter(Boolean))];
      if (conversationIds.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const { data: conversationsData, error: convError } = await supabase
        .from('conversations')
        .select('*, participants:conversation_participants(user_id)')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });
      if (convError) throw convError;

      // Autres participants (interlocuteurs) et propriétés liées
      const otherParticipantIds = [...new Set(
        (conversationsData || []).flatMap(c =>
          (c.participants || []).map(p => p.user_id).filter(id => id && id !== user.id)
        )
      )];
      const propertyIds = [...new Set((conversationsData || []).map(c => c.property_id).filter(Boolean))];

      const [profilesRes, propertiesRes, messagesRes] = await Promise.all([
        otherParticipantIds.length > 0
          ? supabase.from('profiles').select('id, first_name, last_name, full_name, email, role, avatar_url').in('id', otherParticipantIds)
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
      const allMessages = messagesRes.data || [];

      const messagesByConversation = new Map();
      allMessages.forEach(msg => {
        if (!messagesByConversation.has(msg.conversation_id)) {
          messagesByConversation.set(msg.conversation_id, []);
        }
        messagesByConversation.get(msg.conversation_id).push(msg);
      });

      const formatted = (conversationsData || []).map(conv => {
        const otherId = (conv.participants || []).map(p => p.user_id).find(id => id && id !== user.id);
        const participant = otherId ? profilesById.get(otherId) : null;
        const property = conv.property_id ? propertiesById.get(conv.property_id) : null;
        const convMessages = messagesByConversation.get(conv.id) || [];
        const lastMessage = convMessages[convMessages.length - 1];
        const unread = convMessages.filter(m => !m.read && m.sender_id !== user.id).length;

        const name = participant
          ? (participant.full_name
              || `${participant.first_name || ''} ${participant.last_name || ''}`.trim()
              || participant.email
              || 'Interlocuteur')
          : (conv.subject || 'Conversation');

        return {
          id: conv.id,
          name,
          contact: participant?.email || '',
          role: participant?.role || '',
          avatar_url: participant?.avatar_url || '',
          lastMessage: lastMessage?.content || '',
          timestamp: formatTimestamp(lastMessage?.created_at || conv.updated_at),
          unread,
          project: property?.title || property?.name || conv.subject || ''
        };
      });

      setConversations(formatted);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
      toast.error('Erreur lors du chargement des conversations');
      setConversations([]);
    } finally {
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
        timestamp: formatTime(msg.created_at),
        type: 'text'
      }));
      setMessages(formatted);

      // Marquer les messages reçus comme lus
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .eq('read', false)
        .neq('sender_id', user.id);

      setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, unread: 0 } : c));
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      toast.error('Erreur lors du chargement des messages');
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat || sending) return;
    try {
      setSending(true);
      const content = message.trim();
      const { data, error } = await supabase
        .from('messages')
        .insert({ conversation_id: activeChat.id, sender_id: user.id, content, read: false })
        .select()
        .single();
      if (error) throw error;

      setMessages(prev => [...prev, {
        id: data.id,
        sender: 'me',
        content,
        timestamp: formatTime(data.created_at),
        type: 'text'
      }]);
      setMessage('');

      // Mettre à jour l'horodatage d'activité de la conversation
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', activeChat.id);

      setConversations(prev => prev.map(c =>
        c.id === activeChat.id ? { ...c, lastMessage: content, timestamp: formatTimestamp(data.created_at) } : c
      ));
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  // RDV à venir = missions planifiées réelles (survey_missions.scheduled_date à venir)
  const loadUpcomingMeetings = async () => {
    try {
      const nowIso = new Date().toISOString();
      const { data, error } = await supabase
        .from('survey_missions')
        .select('id, title, client_name, mission_type, location, scheduled_date, status')
        .eq('geometre_id', user.id)
        .not('scheduled_date', 'is', null)
        .gte('scheduled_date', nowIso)
        .order('scheduled_date', { ascending: true })
        .limit(10);
      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      console.error('Erreur chargement RDV:', error);
      setMeetings([]);
    }
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();
    if (isToday) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    if (isYesterday) return 'Hier';
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const getTypeIcon = (role) => {
    switch ((role || '').toLowerCase()) {
      case 'promoteur':
      case 'architecte':
      case 'banque':
      case 'entreprise': return Building;
      case 'notaire':
      case 'agent_foncier':
      case 'partenaire': return Users;
      default: return User;
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).filter(Boolean).join('').toUpperCase().slice(0, 2);
  };

  const filteredConversations = conversations.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.project || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
            Communication Professionnelle
          </h1>
          <p className="text-gray-600 mt-2">
            Messagerie avec vos clients et partenaires
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
            onClick={loadConversations}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Messages</CardTitle>
                <Badge className="bg-red-100 text-red-800">
                  {conversations.filter(c => c.unread > 0).length} non lus
                </Badge>
              </div>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-3 text-blue-500" />
                  <p className="text-sm text-gray-500">Chargement...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 font-medium">Aucune conversation</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Vos échanges avec vos clients apparaîtront ici
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredConversations.map((conv) => {
                    const TypeIcon = getTypeIcon(conv.role);
                    return (
                      <div
                        key={conv.id}
                        onClick={() => setActiveChat(conv)}
                        className={`p-4 cursor-pointer border-l-4 transition-all duration-200 ${
                          activeChat?.id === conv.id
                            ? 'bg-blue-50 border-blue-500'
                            : 'hover:bg-gray-50 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                              {conv.avatar_url ? (
                                <img src={conv.avatar_url} alt={conv.name} className="w-full h-full object-cover" />
                              ) : (
                                <TypeIcon className="h-6 w-6 text-white" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900 truncate">{conv.name}</h4>
                              <span className="text-xs text-gray-500">{conv.timestamp}</span>
                            </div>
                            {conv.role && (
                              <p className="text-sm text-gray-600 truncate capitalize">{conv.role}</p>
                            )}
                            <p className="text-sm text-gray-500 truncate mt-1">
                              {conv.lastMessage || 'Aucun message'}
                            </p>
                            {conv.project && (
                              <p className="text-xs text-blue-600 mt-1">{conv.project}</p>
                            )}
                          </div>
                          {conv.unread > 0 && (
                            <div className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                              {conv.unread}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          {activeChat ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg h-full">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                        {activeChat.avatar_url ? (
                          <img src={activeChat.avatar_url} alt={activeChat.name} className="w-full h-full object-cover" />
                        ) : (
                          React.createElement(getTypeIcon(activeChat.role), { className: "h-5 w-5 text-white" })
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{activeChat.name}</h3>
                      <p className="text-sm text-gray-600">
                        {[activeChat.role, activeChat.project].filter(Boolean).join(' • ')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex flex-col h-96">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-sm text-gray-500">Aucun message pour l'instant</p>
                      <p className="text-xs text-gray-400 mt-1">Envoyez le premier message</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                          msg.sender === 'me'
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-white/80' : 'text-gray-500'}`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 flex gap-2">
                    <Textarea
                      placeholder="Tapez votre message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg h-full flex items-center justify-center">
              <CardContent className="text-center">
                <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Sélectionnez une conversation</h3>
                <p className="text-gray-600">Choisissez un contact pour commencer à discuter</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* RDV / Missions planifiées à venir (survey_missions.scheduled_date) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Rendez-vous & missions à venir</CardTitle>
          </CardHeader>
          <CardContent>
            {meetings.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-600 font-medium">Aucun rendez-vous planifié</p>
                <p className="text-xs text-gray-500 mt-1">
                  Les missions avec une date programmée apparaîtront ici
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{meeting.title || 'Mission'}</h4>
                          {meeting.mission_type && (
                            <Badge variant="outline" className="capitalize">
                              {String(meeting.mission_type).replace(/_/g, ' ')}
                            </Badge>
                          )}
                        </div>
                        {meeting.client_name && (
                          <p className="text-sm text-gray-600 mb-1">{meeting.client_name}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(meeting.scheduled_date).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(meeting.scheduled_date)}
                          </div>
                          {meeting.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {meeting.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default GeometreCommunication;

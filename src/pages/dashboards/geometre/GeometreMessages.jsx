import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Users,
  CheckCheck,
  Circle,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';

const GeometreMessages = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Charger les conversations réelles du géomètre
  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user]);

  // Charger les messages quand une conversation est sélectionnée
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  // Auto-scroll vers le dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);

      // 1) Conversations auxquelles le géomètre participe (schéma réel :
      // conversation_participants → conversations)
      const { data: participations, error: partError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);
      if (partError) throw partError;

      const conversationIds = [...new Set((participations || []).map(p => p.conversation_id))];
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

      // 2) Autres participants (le client/interlocuteur) et propriétés liées
      const otherParticipantIds = [...new Set(
        (conversationsData || []).flatMap(c =>
          (c.participants || [])
            .map(p => p.user_id)
            .filter(id => id && id !== user.id)
        )
      )];
      const propertyIds = [...new Set((conversationsData || []).map(c => c.property_id).filter(Boolean))];

      const [profilesRes, propertiesRes, messagesRes] = await Promise.all([
        otherParticipantIds.length > 0
          ? supabase.from('profiles').select('id, first_name, last_name, full_name, email, avatar_url, city').in('id', otherParticipantIds)
          : Promise.resolve({ data: [] }),
        propertyIds.length > 0
          ? supabase.from('properties').select('id, title, name, location, city').in('id', propertyIds)
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
        const unreadCount = convMessages.filter(m => !m.read && m.sender_id !== user.id).length;

        const clientName = participant
          ? (participant.full_name
              || `${participant.first_name || ''} ${participant.last_name || ''}`.trim()
              || participant.email
              || 'Interlocuteur')
          : 'Interlocuteur';

        return {
          id: conv.id,
          client: {
            name: clientName,
            avatar: participant?.avatar_url || '',
            location: participant?.city || property?.city || property?.location || ''
          },
          lastMessage: lastMessage?.content || '',
          timestamp: lastMessage?.created_at || conv.updated_at || conv.created_at,
          unreadCount,
          project: conv.subject || property?.title || property?.name || 'Conversation'
        };
      });

      setConversations(formatted);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
      toast.error('Erreur lors du chargement des conversations');
      setConversations([]);
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

      // Le type d'expéditeur est déduit par comparaison d'id (fiable)
      const formatted = (data || []).map(msg => ({
        id: msg.id,
        sender: msg.sender_id === user.id ? 'geometre' : 'client',
        content: msg.content,
        timestamp: msg.created_at,
        // 'messages' n'a qu'un booléen 'read' (pas de timestamp de lecture) :
        // read → double coche bleue, sinon envoyé
        status: msg.read ? 'read' : 'sent'
      }));

      setMessages(formatted);

      // Marquer comme lus les messages reçus
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .eq('read', false)
        .neq('sender_id', user.id);

      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ));
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      toast.error('Erreur lors du chargement des messages');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const content = newMessage.trim();
    try {
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
        sender: 'geometre',
        content,
        timestamp: data.created_at,
        status: 'sent'
      }]);
      setNewMessage('');

      // Mettre à jour l'activité de la conversation (schéma réel : updated_at)
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedConversation.id);

      setConversations(prev => prev.map(c =>
        c.id === selectedConversation.id
          ? { ...c, lastMessage: content, timestamp: data.created_at }
          : c
      ));
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error("Erreur lors de l'envoi du message");
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (conv.project || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <Circle className="h-3 w-3 text-gray-400" />;
      case 'delivered': return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read': return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default: return null;
    }
  };

  const ConversationItem = ({ conversation }) => (
    <motion.div
      whileHover={{ x: 5 }}
      onClick={() => setSelectedConversation(conversation)}
      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
        selectedConversation?.id === conversation.id ? 'bg-blue-50 border-r-4 border-r-blue-500' : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={conversation.client.avatar} />
            <AvatarFallback>
              {conversation.client.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 truncate">
              {conversation.client.name}
            </h3>
            {conversation.timestamp && (
              <span className="text-xs text-gray-500">
                {new Date(conversation.timestamp).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 truncate mt-1">
            {conversation.lastMessage || 'Aucun message'}
          </p>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              {conversation.client.location && (
                <>
                  <MapPin className="h-3 w-3" />
                  <span>{conversation.client.location}</span>
                </>
              )}
            </div>
            {conversation.unreadCount > 0 && (
              <Badge className="bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const Message = ({ message }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${message.sender === 'geometre' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        message.sender === 'geometre'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-900'
      }`}>
        <p className="text-sm">{message.content}</p>
        <div className={`flex items-center justify-between mt-1 text-xs ${
          message.sender === 'geometre' ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span>
            {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          {message.sender === 'geometre' && getMessageStatusIcon(message.status)}
        </div>
      </div>
    </motion.div>
  );

  const selectedConv = selectedConversation;

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Liste des conversations */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
            <Button size="sm" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Nouveau
            </Button>
          </div>

          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Rechercher une conversation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              Chargement...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-16 px-4">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Aucune conversation</p>
              <p className="text-sm text-gray-400 mt-1">
                Vos échanges avec vos clients apparaîtront ici.
              </p>
            </div>
          ) : (
            filteredConversations.map(conversation => (
              <ConversationItem key={conversation.id} conversation={conversation} />
            ))
          )}
        </div>
      </div>

      {/* Zone de conversation */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* En-tête de conversation */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConv.client.avatar} />
                    <AvatarFallback>
                      {selectedConv.client.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConv.client.name}</h3>
                    <p className="text-sm text-gray-600">{selectedConv.project}</p>
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
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-16">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun message dans cette conversation</p>
                </div>
              ) : (
                messages.map(message => (
                  <Message key={message.id} message={message} />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-end space-x-2">
                <Button size="sm" variant="outline">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <Textarea
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[44px] max-h-32 resize-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                <Button size="sm" variant="outline">
                  <Smile className="h-4 w-4" />
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
              <p className="text-sm">pour afficher les messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeometreMessages;

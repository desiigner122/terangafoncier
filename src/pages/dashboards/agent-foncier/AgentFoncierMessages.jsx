import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Search,
  Plus,
  Send,
  Paperclip,
  MapPin,
  Check,
  CheckCheck,
  Star,
  Archive,
  Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

const AgentFoncierMessages = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageFilter, setMessageFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Charger les conversations réelles de l'agent
  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user]);

  // Charger les messages quand une conversation est sélectionnée
  useEffect(() => {
    if (selectedConversation?.id) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);

      // 1) Conversations auxquelles l'agent participe (conversation_participants)
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

      // 2) Détails des conversations + tous les participants
      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('*, participants:conversation_participants(user_id)')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });
      if (convError) throw convError;

      // 3) Autres participants (les clients), biens liés et messages en une passe
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

      // Grouper les messages par conversation (dernier message + non-lus réels)
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

        const clientName = participant
          ? (participant.full_name
              || `${participant.first_name || ''} ${participant.last_name || ''}`.trim()
              || 'Client')
          : 'Client';

        return {
          id: conv.id,
          clientName,
          avatar: getInitials(clientName),
          avatarUrl: participant?.avatar_url || null,
          // subject réel de la conversation, sinon titre du bien lié
          subject: conv.subject || property?.title || property?.name || 'Conversation',
          // localisation issue du bien lié ou du profil client (pas de valeur inventée)
          location: property?.location || participant?.city || participant?.region || '',
          lastMessage: lastMessage?.content || '',
          lastMessageTime: lastMessage?.created_at || conv.updated_at || conv.created_at,
          timestamp: formatRelativeTime(lastMessage?.created_at || conv.updated_at || conv.created_at),
          unread
        };
      });

      setConversations(formatted);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
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

      const formatted = (data || []).map(msg => ({
        id: msg.id,
        // L'expéditeur est déduit de l'id (fiable), pas d'un rôle deviné
        sender: msg.sender_id === user.id ? 'agent' : 'client',
        content: msg.content,
        read: msg.read,
        timestamp: formatRelativeTime(msg.created_at),
        created_at: msg.created_at
      }));

      setMessages(formatted);
      markConversationRead(conversationId);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      setMessages([]);
    }
  };

  // Marquer comme lus les messages reçus (non envoyés par l'agent)
  const markConversationRead = async (conversationId) => {
    try {
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .eq('read', false)
        .neq('sender_id', user.id);

      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, unread: 0 } : c
      ));
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
        sender: 'agent',
        content: data.content,
        read: false,
        timestamp: formatRelativeTime(data.created_at),
        created_at: data.created_at
      }]);
      setNewMessage('');

      // Rafraîchir l'activité de la conversation (schéma réel: updated_at)
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedConversation.id);

      setConversations(prev => prev.map(c =>
        c.id === selectedConversation.id
          ? { ...c, lastMessage: content, timestamp: formatRelativeTime(data.created_at), lastMessageTime: data.created_at }
          : c
      ));
    } catch (error) {
      console.error('Erreur envoi message:', error);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const matchesFilter = messageFilter === 'all' ||
      (messageFilter === 'unread' && conv.unread > 0);

    const matchesSearch = conv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.subject.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white">
      <div className="flex h-full">
        {/* Liste des conversations */}
        <div className="w-1/3 border-r bg-gray-50">
          {/* Header conversations */}
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-1" />
                Nouveau
              </Button>
            </div>

            {/* Barre de recherche */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Filtres */}
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'Tous', count: conversations.length },
                { key: 'unread', label: 'Non lus', count: conversations.filter(c => c.unread > 0).length }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setMessageFilter(filter.key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    messageFilter === filter.key
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>

          {/* Liste des conversations */}
          <div className="overflow-y-auto h-full">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <Mail className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Aucune conversation</p>
              </div>
            ) : filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b cursor-pointer transition-colors ${
                  selectedConversation?.id === conversation.id
                    ? 'bg-green-50 border-green-200'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
                    {conversation.avatarUrl ? (
                      <img src={conversation.avatarUrl} alt={conversation.clientName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-medium text-green-700">
                        {conversation.avatar}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 truncate">
                        {conversation.clientName}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {conversation.unread > 0 && (
                          <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                            {conversation.unread}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1 truncate">{conversation.subject}</p>
                    {conversation.location && (
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{conversation.location}</span>
                      </div>
                    )}
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage || 'Aucun message'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Zone de conversation */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header conversation */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
                      {selectedConversation.avatarUrl ? (
                        <img src={selectedConversation.avatarUrl} alt={selectedConversation.clientName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-medium text-green-700">
                          {selectedConversation.avatar}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedConversation.clientName}</h3>
                      <p className="text-sm text-gray-600">{selectedConversation.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Mail className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">Aucun message dans cette conversation</p>
                    </div>
                  </div>
                ) : messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'agent'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-end mt-1 space-x-1">
                        <span className={`text-xs ${
                          message.sender === 'agent' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </span>
                        {message.sender === 'agent' && (
                          message.read
                            ? <CheckCheck className="h-3 w-3 text-green-100" />
                            : <Check className="h-3 w-3 text-green-100" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newMessage.trim()) {
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!newMessage.trim() || sending}
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sélectionnez une conversation
                </h3>
                <p className="text-gray-600">
                  Choisissez une conversation dans la liste pour commencer à échanger
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentFoncierMessages;

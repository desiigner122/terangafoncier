import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Send,
  Search,
  MoreVertical,
  Paperclip,
  Reply,
  Forward,
  Star,
  Check,
  CheckCheck,
  Circle,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import VendeurSupabaseService from '@/services/VendeurSupabaseService';
import { toast } from 'sonner';

const InvestisseurMessages = () => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Données réelles : conversations (conversation_participants + conversations)
  // et messages (table 'messages'), filtrées par participation de l'investisseur.
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  // Filtre actif : 'all' | 'unread'  (pas de colonne "important" dans le schéma réel)
  const [activeFilter, setActiveFilter] = useState('all');

  // Charger les conversations réelles de l'investisseur connecté
  useEffect(() => {
    if (user?.id) {
      loadConversations();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Charger les messages de la conversation sélectionnée
  useEffect(() => {
    if (selectedConversation?.id) {
      loadMessages(selectedConversation.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);

      const { success, data: conversationsData, error } =
        await VendeurSupabaseService.getConversations(user.id);
      if (!success) throw new Error(error || 'Erreur chargement conversations');

      if (!conversationsData || conversationsData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const conversationIds = conversationsData.map(c => c.id);

      // Autres participants (interlocuteurs) de chaque conversation
      const otherParticipantIds = [...new Set(
        conversationsData.flatMap(c =>
          (c.participants || [])
            .map(p => p.user_id)
            .filter(id => id && id !== user.id)
        )
      )];

      const propertyIds = [...new Set(conversationsData.map(c => c.property_id).filter(Boolean))];

      const [profilesRes, propertiesRes, messagesRes] = await Promise.all([
        otherParticipantIds.length > 0
          ? supabase.from('profiles')
              .select('id, first_name, last_name, full_name, email, avatar_url')
              .in('id', otherParticipantIds)
          : Promise.resolve({ data: [] }),
        propertyIds.length > 0
          ? supabase.from('properties').select('id, title').in('id', propertyIds)
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

      const formatted = conversationsData.map(conv => {
        const otherId = (conv.participants || [])
          .map(p => p.user_id)
          .find(id => id && id !== user.id);
        const participant = otherId ? profilesById.get(otherId) : null;
        const property = conv.property_id ? propertiesById.get(conv.property_id) : null;
        const convMessages = messagesByConversation.get(conv.id) || [];
        const lastMessage = convMessages[convMessages.length - 1];
        const unreadCount = convMessages.filter(m => !m.read && m.sender_id !== user.id).length;

        const name = participant
          ? (participant.full_name
              || `${participant.first_name || ''} ${participant.last_name || ''}`.trim()
              || participant.email
              || 'Utilisateur')
          : 'Utilisateur';

        return {
          id: conv.id,
          from: name,
          avatar: participant?.avatar_url || null,
          subject: property?.title || conv.subject || 'Conversation',
          preview: lastMessage?.content || '',
          timestamp: lastMessage?.created_at || conv.updated_at || conv.created_at,
          read: unreadCount === 0,
          unreadCount
        };
      });

      setConversations(formatted);
      setLoading(false);
    } catch (err) {
      console.error('Erreur chargement conversations:', err);
      toast.error('Erreur lors du chargement des messages');
      setConversations([]);
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setMessagesLoading(true);
      const { success, data: messagesData, error } =
        await VendeurSupabaseService.getMessages(conversationId);
      if (!success) throw new Error(error || 'Erreur chargement messages');

      const formatted = (messagesData || []).map(msg => ({
        id: msg.id,
        content: msg.content,
        sent_at: msg.created_at,
        isMine: msg.sender_id === user.id,
        read: msg.read
      }));

      setMessages(formatted);
      setMessagesLoading(false);

      // Marquer comme lus les messages reçus
      await markConversationRead(conversationId);
    } catch (err) {
      console.error('Erreur chargement messages:', err);
      toast.error('Erreur lors du chargement de la conversation');
      setMessages([]);
      setMessagesLoading(false);
    }
  };

  const markConversationRead = async (conversationId) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .eq('read', false)
        .neq('sender_id', user.id);
      if (error) throw error;

      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, read: true, unreadCount: 0 } : c
      ));
    } catch (err) {
      console.error('Erreur marquage lu:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;
    try {
      setSending(true);
      const content = newMessage.trim();
      const { success, data, error } = await VendeurSupabaseService.sendMessage(
        selectedConversation.id,
        user.id,
        content
      );
      if (!success) throw new Error(error || 'Erreur envoi message');

      setMessages(prev => [...prev, {
        id: data.id,
        content,
        sent_at: data.created_at,
        isMine: true,
        read: false
      }]);
      setNewMessage('');

      // Mettre à jour l'activité de la conversation (updated_at) et l'aperçu local
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedConversation.id);

      setConversations(prev => prev.map(c =>
        c.id === selectedConversation.id
          ? { ...c, preview: content, timestamp: data.created_at }
          : c
      ));

      setSending(false);
    } catch (err) {
      console.error('Erreur envoi message:', err);
      toast.error('Erreur lors de l\'envoi du message');
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const hours = diff / (1000 * 60 * 60);

    if (hours < 1) return 'À l\'instant';
    if (hours < 24) return `${Math.floor(hours)}h`;
    if (hours < 48) return 'Hier';
    return date.toLocaleDateString('fr-FR');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredConversations = conversations
    .filter(c => activeFilter === 'all' ? true : !c.read)
    .filter(c =>
      c.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

  const unreadTotal = conversations.filter(c => !c.read).length;

  if (loading) {
    return (
      <div className="w-full h-full bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white">
      <div className="flex h-full">
        {/* Liste des conversations */}
        <div className="w-1/3 border-r bg-gray-50">
          {/* Header liste */}
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            </div>

            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher des messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtres */}
          <div className="p-4 bg-white border-b">
            <div className="flex space-x-2">
              <Badge
                onClick={() => setActiveFilter('all')}
                className={`cursor-pointer ${activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}
              >
                Tous ({conversations.length})
              </Badge>
              <Badge
                onClick={() => setActiveFilter('unread')}
                className={`cursor-pointer ${activeFilter === 'unread' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-800'}`}
              >
                Non lus ({unreadTotal})
              </Badge>
            </div>
          </div>

          {/* Liste conversations */}
          <div className="overflow-y-auto h-full">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Aucun message</p>
                <p className="text-sm text-gray-500 mt-1">
                  Vos conversations apparaîtront ici.
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
                    selectedConversation?.id === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-white'
                  } ${!conv.read ? 'font-semibold' : ''}`}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-sm font-medium text-gray-600">
                      {conv.avatar ? (
                        <img
                          src={conv.avatar}
                          alt={conv.from}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        getInitials(conv.from) || <User className="h-5 w-5 text-gray-500" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm truncate ${!conv.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                          {conv.from}
                        </p>
                        <div className="flex items-center space-x-1">
                          {!conv.read ? (
                            <Circle className="h-2 w-2 text-blue-600 fill-current" />
                          ) : (
                            <CheckCheck className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      </div>

                      <p className={`text-sm mb-1 truncate ${!conv.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                        {conv.subject}
                      </p>

                      <p className="text-xs text-gray-500 truncate mb-2">
                        {conv.preview || 'Aucun message'}
                      </p>

                      <div className="flex items-center justify-between">
                        {conv.unreadCount > 0 ? (
                          <Badge className="text-xs bg-red-100 text-red-800">
                            {conv.unreadCount} non lu{conv.unreadCount > 1 ? 's' : ''}
                          </Badge>
                        ) : <span />}
                        <span className="text-xs text-gray-500">
                          {formatTime(conv.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Contenu de la conversation */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Header conversation */}
              <div className="p-6 border-b bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                      {selectedConversation.avatar ? (
                        <img
                          src={selectedConversation.avatar}
                          alt={selectedConversation.from}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        getInitials(selectedConversation.from) || <User className="h-6 w-6 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedConversation.from}</h3>
                      <p className="text-sm text-gray-600">{selectedConversation.subject}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Forward className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Fil de messages réel */}
              <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">Aucun message dans cette conversation</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${msg.isMine ? 'order-2' : 'order-1'}`}>
                          <div className={`rounded-lg p-3 ${msg.isMine ? 'bg-blue-600 text-white' : 'bg-white border text-gray-900'}`}>
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                          </div>
                          <div className="flex items-center gap-1 mt-1 px-1 justify-end">
                            <span className="text-xs text-gray-500">{formatTime(msg.sent_at)}</span>
                            {msg.isMine && (
                              msg.read
                                ? <CheckCheck className="h-3 w-3 text-blue-600" />
                                : <Check className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Zone de réponse (envoi réel dans 'messages') */}
              <div className="p-6 border-t bg-gray-50">
                <div className="space-y-3">
                  <textarea
                    placeholder="Tapez votre réponse..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sending}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        {sending ? 'Envoi...' : 'Envoyer'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Aucune conversation sélectionnée */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez un message</h3>
                <p className="text-gray-600">Choisissez une conversation dans la liste pour la lire</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestisseurMessages;

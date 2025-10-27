/**
 * Messagerie Vendeur Modernisée
 * Design moderne avec filtres avancés, pièces jointes, statuts, recherche
 * @author Teranga Foncier Team
 */
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, Search, Filter, MoreVertical, Paperclip, 
  Image as ImageIcon, File, X, Check, CheckCheck, Clock, Star,
  Archive, Trash2, Pin, Bell, BellOff, Users, User, Phone, Video,
  Download, Eye, RefreshCw, AlertCircle, ChevronLeft, ChevronRight,
  FileText, Smile, AtSign, Hash
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const VendeurMessagesModern = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // États
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [attachments, setAttachments] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    starred: 0,
    archived: 0,
  });

  // Charger conversations
  useEffect(() => {
    if (user) {
      loadConversations();
      const interval = setInterval(loadConversations, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  // Filtrer conversations
  useEffect(() => {
    filterConversations();
  }, [conversations, searchTerm, activeFilter]);

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
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  // Auto-scroll vers le bas
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      
      // Charger simplement les conversations sans relations complexes
      const { data: conversationsData, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('vendor_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (!conversationsData || conversationsData.length === 0) {
        setConversations([]);
        setStats({ total: 0, unread: 0, starred: 0, archived: 0 });
        setLoading(false);
        return;
      }

      // Charger les profils des acheteurs séparément
      const buyerIds = [...new Set(conversationsData.map(c => c.buyer_id).filter(Boolean))];
      let buyerMap = {};
      
      if (buyerIds.length > 0) {
        const { data: buyers } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, avatar_url, phone')
          .in('id', buyerIds);
        
        if (buyers) {
          buyers.forEach(b => {
            buyerMap[b.id] = b;
          });
        }
      }

      // Charger les propriétés séparément
      const propertyIds = [...new Set(conversationsData.map(c => c.property_id).filter(Boolean))];
      let propertyMap = {};
      
      if (propertyIds.length > 0) {
        const { data: properties } = await supabase
          .from('properties')
          .select('id, title, location, price, images')
          .in('id', propertyIds);
        
        if (properties) {
          properties.forEach(p => {
            propertyMap[p.id] = p;
          });
        }
      }

      // Enrichir les conversations avec les données chargées
      const enrichedConversations = conversationsData.map(c => ({
        ...c,
        buyer: buyerMap[c.buyer_id],
        property: propertyMap[c.property_id]
      }));

      // Calculer stats
      const stats = {
        total: enrichedConversations.length || 0,
        unread: enrichedConversations.filter(c => c.unread_count_vendor > 0).length || 0,
        starred: enrichedConversations.filter(c => c.is_starred_vendor).length || 0,
        archived: enrichedConversations.filter(c => c.is_archived_vendor).length || 0,
      };

      setConversations(enrichedConversations);
      setStats(stats);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
      toast.error('Erreur lors du chargement des conversations');
    } finally {
      setLoading(false);
    }
  };

  const filterConversations = () => {
    let filtered = conversations;

    // Filtre par catégorie
    switch (activeFilter) {
      case 'unread':
        filtered = conversations.filter(c => c.unread_count_vendor > 0);
        break;
      case 'starred':
        filtered = conversations.filter(c => c.is_starred_vendor);
        break;
      case 'archived':
        filtered = conversations.filter(c => c.is_archived_vendor);
        break;
      default:
        filtered = conversations.filter(c => !c.is_archived_vendor);
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(c => {
        const buyerName = `${c.buyer?.first_name} ${c.buyer?.last_name}`.toLowerCase();
        const propertyTitle = c.property?.title?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return buyerName.includes(search) || propertyTitle.includes(search);
      });
    }

    setFilteredConversations(filtered);
  };

  const loadMessages = async (conversationId) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      toast.error('Erreur lors du chargement des messages');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return;
    if (!selectedConversation) return;

    try {
      const messageData = {
        conversation_id: selectedConversation.id,
        sender_id: user.id,
        receiver_id: selectedConversation.buyer_id,
        content: newMessage.trim(),
        status: 'sent',
        read: false,
        attachments: attachments.length > 0 ? attachments : null,
      };

      const { data, error } = await supabase
        .from('messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour la conversation
      await supabase
        .from('conversations')
        .update({
          last_message: newMessage.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedConversation.id);

      setMessages([...messages, data]);
      setNewMessage('');
      setAttachments([]);
      scrollToBottom();
      toast.success('Message envoyé');
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const markAsRead = async (conversationId) => {
    try {
      await supabase
        .from('conversations')
        .update({ unread_count_vendor: 0 })
        .eq('id', conversationId);

      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .eq('receiver_id', user.id);

      loadConversations();
    } catch (error) {
      console.error('Erreur marquage lu:', error);
    }
  };

  const toggleStar = async (conversationId) => {
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      await supabase
        .from('conversations')
        .update({ is_starred_vendor: !conversation.is_starred_vendor })
        .eq('id', conversationId);

      loadConversations();
      toast.success(conversation.is_starred_vendor ? 'Étoile retirée' : 'Conversation marquée');
    } catch (error) {
      console.error('Erreur étoile:', error);
      toast.error('Erreur lors du marquage');
    }
  };

  const toggleArchive = async (conversationId) => {
    try {
      const conversation = conversations.find(c => c.id === conversationId);
      await supabase
        .from('conversations')
        .update({ is_archived_vendor: !conversation.is_archived_vendor })
        .eq('id', conversationId);

      loadConversations();
      toast.success(conversation.is_archived_vendor ? 'Désarchivée' : 'Conversation archivée');
    } catch (error) {
      console.error('Erreur archivage:', error);
      toast.error('Erreur lors de l\'archivage');
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const newAttachments = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getMessageStatus = (message) => {
    if (message.read) return { icon: CheckCheck, color: 'text-blue-500' };
    if (message.status === 'sent') return { icon: Check, color: 'text-gray-400' };
    return { icon: Clock, color: 'text-gray-400' };
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messagerie</h1>
            <p className="text-sm text-gray-500 mt-1">
              {stats.unread > 0 && `${stats.unread} message${stats.unread > 1 ? 's' : ''} non lu${stats.unread > 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="pl-10 w-64"
              />
            </div>

            {/* Actions */}
            <Button variant="outline" size="sm" onClick={loadConversations}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-2 mt-4">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveFilter('all')}
          >
            Toutes ({stats.total})
          </Button>
          <Button
            variant={activeFilter === 'unread' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveFilter('unread')}
          >
            Non lus ({stats.unread})
          </Button>
          <Button
            variant={activeFilter === 'starred' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveFilter('starred')}
          >
            <Star className="w-4 h-4 mr-1" />
            Favoris ({stats.starred})
          </Button>
          <Button
            variant={activeFilter === 'archived' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveFilter('archived')}
          >
            <Archive className="w-4 h-4 mr-1" />
            Archivées ({stats.archived})
          </Button>
        </div>
      </div>

      {/* Corps principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Liste conversations */}
        <div className="w-96 bg-white border-r flex flex-col">
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm">Aucune conversation</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg cursor-pointer transition-colors mb-1 ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.buyer?.avatar_url} />
                          <AvatarFallback>
                            {conversation.buyer?.first_name?.[0]}{conversation.buyer?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.unread_count_vendor > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                            {conversation.unread_count_vendor}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm truncate">
                            {conversation.buyer?.first_name} {conversation.buyer?.last_name}
                          </h4>
                          <div className="flex items-center gap-1">
                            {conversation.is_starred_vendor && (
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            )}
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(conversation.updated_at), { 
                                addSuffix: true,
                                locale: fr 
                              })}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 truncate mb-1">
                          {conversation.property?.title}
                        </p>

                        <p className="text-sm text-gray-700 truncate">
                          {conversation.last_message || 'Pas de message'}
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleStar(conversation.id)}>
                            <Star className="w-4 h-4 mr-2" />
                            {conversation.is_starred_vendor ? 'Retirer l\'étoile' : 'Ajouter aux favoris'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleArchive(conversation.id)}>
                            <Archive className="w-4 h-4 mr-2" />
                            {conversation.is_archived_vendor ? 'Désarchiver' : 'Archiver'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Zone messages */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Header conversation */}
            <div className="bg-white border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={selectedConversation.buyer?.avatar_url} />
                    <AvatarFallback>
                      {selectedConversation.buyer?.first_name?.[0]}{selectedConversation.buyer?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {selectedConversation.buyer?.first_name} {selectedConversation.buyer?.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">{selectedConversation.property?.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/vendeur/dossier/${selectedConversation.id}`)}
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwn = message.sender_id === user.id;
                  const status = getMessageStatus(message);
                  const StatusIcon = status.icon;

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-md ${isOwn ? 'bg-blue-500 text-white' : 'bg-white'} rounded-2xl px-4 py-2 shadow-sm`}>
                        <p className="text-sm">{message.content}</p>
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {message.attachments.map((att, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <Paperclip className="w-3 h-3" />
                                <span>{att.name}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs opacity-70">
                            {format(new Date(message.created_at), 'HH:mm')}
                          </span>
                          {isOwn && <StatusIcon className={`w-3 h-3 ${status.color}`} />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Zone saisie */}
            <div className="bg-white border-t p-4">
              {attachments.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {attachments.map((att, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 text-sm">
                      <File className="w-4 h-4" />
                      <span>{att.name}</span>
                      <span className="text-gray-500">({formatFileSize(att.size)})</span>
                      <button onClick={() => removeAttachment(idx)}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-5 h-5" />
                </Button>

                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Écrire un message..."
                  className="flex-1"
                />

                <Button onClick={sendMessage} disabled={!newMessage.trim() && attachments.length === 0}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Sélectionnez une conversation pour commencer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendeurMessagesModern;

/**
 * Messagerie Vendeur - Nouvelle Version Moderne
 * Basée sur le modèle acheteur avec adaptations vendeur
 * - unread_count_vendor au lieu de unread_count_buyer
 * - vendor_name/avatar au lieu de buyer
 * - Realtime subscriptions, deep-link, info panel
 * @author Teranga Foncier Team
 */
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, Search, MoreVertical,
  Phone, Video, Paperclip, Image as ImageIcon, Smile,
  Check, CheckCheck, Clock, Pin, Archive, Trash2,
  Star, Bell, BellOff, User, Users, Info, X,
  ArrowLeft, Download, Eye, RefreshCw, AlertCircle,
  Building, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const VendeurMessagesModern = ({ onUnreadChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // États conversations
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [stats, setStats] = useState({ totalConversations: 0, unreadCount: 0 });

  // États création conversation
  const [showCreate, setShowCreate] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerProfile, setBuyerProfile] = useState(null);
  const [vendorProperties, setVendorProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [creating, setCreating] = useState(false);

  // Charger conversations vendeur
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  // Deep-link fallback: charge conversation par ID si présent dans URL
  const fetchedIdsRef = useRef(new Set());
  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (!conversationId) return;

    const existing = conversations.find(c => String(c.id) === String(conversationId));
    if (existing) {
      setSelectedConversation(existing);
      return;
    }

    if (fetchedIdsRef.current.has(conversationId)) return;
    fetchedIdsRef.current.add(conversationId);

    const fetchById = async () => {
      try {
        const { data: conv, error } = await supabase
          .from('conversations')
          .select('id, vendor_id, buyer_id, property_id, updated_at, unread_count_vendor, unread_count_buyer')
          .eq('id', conversationId)
          .single();
        if (error || !conv) return;

        // Enrichir avec acheteur et propriété
        const [{ data: buyer }, { data: property }] = await Promise.all([
          supabase.from('profiles').select('id, first_name, last_name, email, avatar_url').eq('id', conv.buyer_id).single(),
          supabase.from('properties').select('id, title, reference').eq('id', conv.property_id).single()
        ]);

        const enriched = {
          id: conv.id,
          buyer_id: conv.buyer_id,
          buyer_name: `${buyer?.first_name || ''} ${buyer?.last_name || ''}`.trim() || 'Acheteur',
          buyer_email: buyer?.email || '',
          buyer_avatar: buyer?.avatar_url,
          property_title: property?.title || 'Propriété',
          property_id: property?.reference || '',
          subject: property?.title || 'Conversation Teranga',
          last_message: 'Ouvrir la conversation',
          last_message_time: conv.updated_at,
          unread_count: conv.unread_count_vendor || 0,
          is_pinned: false,
          is_archived: false,
          status: 'active'
        };

        setConversations(prev => {
          const exists = prev.some(c => c.id === enriched.id);
          return exists ? prev : [enriched, ...prev];
        });
        setSelectedConversation(enriched);
      } catch (err) {
        console.warn('⚠️ Fallback fetch conversation vendeur échoué:', err);
      }
    };

    fetchById();
  }, [searchParams, conversations]);

  // Charger messages et marquer comme lus
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  // Auto-scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Realtime: nouvelles conversations
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`public:conversations:vendor_${user.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversations',
        filter: `vendor_id=eq.${user.id}`
      }, (payload) => {
        setConversations(prev =>
          prev.map(c => c.id === payload.new.id ? { ...c, ...payload.new } : c)
        );
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user]);

  // Realtime: nouveaux messages dans conversation sélectionnée
  useEffect(() => {
    if (!selectedConversation) return;
    const channel = supabase
      .channel(`conversation_messages:${selectedConversation.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'conversation_messages',
        filter: `conversation_id=eq.${selectedConversation.id}`
      }, (payload) => {
        setMessages(prev => [...prev, {
          id: payload.new.id,
          sender_id: payload.new.sender_id,
          content: payload.new.content,
          created_at: payload.new.created_at,
          read_at: payload.new.read_at,
          is_read: payload.new.is_read
        }]);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversation_messages',
        filter: `conversation_id=eq.${selectedConversation.id}`
      }, (payload) => {
        setMessages(prev => prev.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m));
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [selectedConversation]);

  // Realtime: nouveaux messages sur TOUTES conversations (notifications)
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`all_vendor_messages:${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'conversation_messages'
      }, (payload) => {
        // Vérifier si c'est une conversation du vendeur actuel
        const isFromVendorConversation = conversations.some(c => c.id === payload.new.conversation_id);
        if (!isFromVendorConversation) return;

        // Si c'est pas la conversation sélectionnée, afficher notification
        if (selectedConversation?.id !== payload.new.conversation_id && payload.new.sender_id !== user.id) {
          const conv = conversations.find(c => c.id === payload.new.conversation_id);
          if (conv) {
            toast.info(`📨 ${conv.buyer_name}: ${payload.new.content.substring(0, 40)}...`, {
              duration: 4000,
              action: {
                label: 'Voir',
                onClick: () => setSelectedConversation(conv)
              }
            });
          }
        }

        // Mise à jour du compte non lus
        setConversations(prev => prev.map(c => 
          c.id === payload.new.conversation_id 
            ? { ...c, unread_count: (c.unread_count || 0) + 1 }
            : c
        ));
      })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user, conversations, selectedConversation]);

  const loadConversations = async () => {
    try {
      setLoading(true);

      // Charger conversations du vendeur
      const { data: conversationsData, error } = await supabase
        .from('conversations')
        .select('id, vendor_id, buyer_id, property_id, updated_at, unread_count_vendor, unread_count_buyer, is_pinned_vendor, is_archived_vendor')
        .eq('vendor_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur chargement conversations:', error);
        setConversations([]);
        setLoading(false);
        return;
      }

      if (!conversationsData || conversationsData.length === 0) {
        setConversations([]);
        setStats({ totalConversations: 0, unreadCount: 0 });
        setLoading(false);
        return;
      }

      // Charger profils acheteurs et propriétés
      const buyerIds = [...new Set(conversationsData.map(c => c.buyer_id).filter(Boolean))];
      const propertyIds = [...new Set(conversationsData.map(c => c.property_id).filter(Boolean))];
      let buyerMap = {}, propertyMap = {};

      if (buyerIds.length > 0) {
        const { data: buyers } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, avatar_url')
          .in('id', buyerIds);
        buyers?.forEach(b => {
          buyerMap[b.id] = b;
        });
      }

      if (propertyIds.length > 0) {
        const { data: properties } = await supabase
          .from('properties')
          .select('id, title, reference')
          .in('id', propertyIds);
        properties?.forEach(p => {
          propertyMap[p.id] = p;
        });
      }

      // Charger derniers messages
      let lastMessagesMap = {};
      const { data: allMessages } = await supabase
        .from('conversation_messages')
        .select('id, conversation_id, content, created_at')
        .in('conversation_id', conversationsData.map(c => c.id))
        .order('created_at', { ascending: false });

      allMessages?.forEach(msg => {
        if (!lastMessagesMap[msg.conversation_id]) {
          lastMessagesMap[msg.conversation_id] = msg;
        }
      });

      // Formater conversations
      const formatted = conversationsData.map(c => ({
        id: c.id,
        buyer_id: c.buyer_id,
        buyer_name: `${buyerMap[c.buyer_id]?.first_name || ''} ${buyerMap[c.buyer_id]?.last_name || ''}`.trim() || 'Acheteur',
        buyer_email: buyerMap[c.buyer_id]?.email || '',
        buyer_avatar: buyerMap[c.buyer_id]?.avatar_url,
        property_title: propertyMap[c.property_id]?.title || 'Propriété',
        property_id: propertyMap[c.property_id]?.reference || '',
        subject: propertyMap[c.property_id]?.title || 'Conversation Teranga',
        last_message: lastMessagesMap[c.id]?.content || 'Pas de message',
        last_message_time: lastMessagesMap[c.id]?.created_at || c.updated_at,
        unread_count: c.unread_count_vendor || 0,
        is_pinned: c.is_pinned_vendor || false,
        is_archived: c.is_archived_vendor || false,
        status: 'active'
      }));

      setConversations(formatted);
      const unread = formatted.reduce((s, c) => s + c.unread_count, 0);
      setStats({ totalConversations: formatted.length, unreadCount: unread });
      if (onUnreadChange) onUnreadChange(unread);
      console.log('✅ Compteur messages mis à jour:', unread);
    } catch (error) {
      console.error('❌ Erreur conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversation) => {
    try {
      const { data, error } = await supabase
        .from('conversation_messages')
        .select('id, sender_id, content, is_read, read_at, created_at')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Erreur messages:', error);
        setMessages([]);
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('❌ Erreur chargement messages:', error);
    }
  };

  const markAsRead = async (conversationId) => {
    try {
      // Marquer conversation comme lue (unread_count_vendor = 0)
      await supabase
        .from('conversations')
        .update({ unread_count_vendor: 0 })
        .eq('id', conversationId);

      // Marquer messages comme lus
      await supabase
        .from('conversation_messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id);

      // Mise à jour locale
      setConversations(prev => prev.map(c => 
        c.id === conversationId ? { ...c, unread_count: 0 } : c
      ));
      setMessages(prev => prev.map(m =>
        m.sender_id !== user.id ? { ...m, is_read: true } : m
      ));

      // Mettre à jour stats et hook
      const newUnread = conversations.reduce((s, c) => s + (c.id === conversationId ? 0 : c.unread_count), 0);
      setStats(prev => ({ ...prev, unreadCount: newUnread }));
      if (onUnreadChange) onUnreadChange(newUnread);
    } catch (error) {
      console.error('❌ Erreur mark as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const { data: inserted, error } = await supabase
        .from('conversation_messages')
        .insert({
          conversation_id: selectedConversation.id,
          sender_id: user.id,
          content: newMessage.trim(),
          is_read: false
        })
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour conversation
      await supabase
        .from('conversations')
        .update({
          updated_at: new Date().toISOString(),
          unread_count_buyer: (selectedConversation.unread_count_buyer || 0) + 1
        })
        .eq('id', selectedConversation.id);

      setMessages(prev => [...prev, {
        id: inserted.id,
        sender_id: inserted.sender_id,
        content: inserted.content,
        created_at: inserted.created_at,
        read_at: null,
        is_read: false
      }]);
      setNewMessage('');

      // Mettre à jour la conversation dans la liste (last_message)
      setConversations(prev => prev.map(c => 
        c.id === selectedConversation.id 
          ? { ...c, last_message: inserted.content, last_message_time: inserted.created_at }
          : c
      ));

      toast.success('Message envoyé');
    } catch (error) {
      console.error('❌ Erreur envoi:', error);
      toast.error('Erreur lors de l\'envoi');
    }
  };

  const loadVendorProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title')
        .eq('owner_id', user.id)
        .order('title', { ascending: true });
      if (error) throw error;
      setVendorProperties(data || []);
    } catch (e) {
      console.error('❌ Erreur propriétés vendeur:', e);
      toast.error('Impossible de charger vos propriétés');
    }
  };

  const lookupBuyerByEmail = async () => {
    if (!buyerEmail?.trim()) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url')
        .ilike('email', buyerEmail.trim())
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      setBuyerProfile(data);
      if (!data) toast.error('Aucun acheteur trouvé');
    } catch (e) {
      console.error('❌ Erreur recherche acheteur:', e);
      toast.error('Erreur lors de la recherche');
    }
  };

  const createOrOpenConversation = async () => {
    if (!selectedPropertyId || !buyerProfile?.id) {
      toast.error('Sélectionnez une propriété et un acheteur');
      return;
    }

    setCreating(true);
    try {
      // Vérifier si existe déjà
      const { data: existing } = await supabase
        .from('conversations')
        .select('id')
        .eq('vendor_id', user.id)
        .eq('buyer_id', buyerProfile.id)
        .eq('property_id', selectedPropertyId)
        .maybeSingle();

      let conversationId = existing?.id;
      if (!conversationId) {
        const { data: inserted, error: insertError } = await supabase
          .from('conversations')
          .insert({
            vendor_id: user.id,
            buyer_id: buyerProfile.id,
            property_id: selectedPropertyId,
            unread_count_vendor: 0,
            unread_count_buyer: 0,
            updated_at: new Date().toISOString(),
          })
          .select('id')
          .single();
        if (insertError) throw insertError;
        conversationId = inserted.id;
      }

      await loadConversations();
      const conv = conversations.find(c => c.id === conversationId);
      if (conv) {
        setSelectedConversation(conv);
      } else {
        setSearchParams({ conversation: conversationId });
      }

      setShowCreate(false);
      setBuyerEmail('');
      setBuyerProfile(null);
      setSelectedPropertyId('');
      toast.success('Conversation prête');
    } catch (e) {
      console.error('❌ Erreur création:', e);
      toast.error('Impossible de créer la conversation');
    } finally {
      setCreating(false);
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

  const searchLower = (searchTerm || '').toLowerCase();
  const filteredConversations = conversations.filter(conv =>
    (conv.buyer_name || '').toLowerCase().includes(searchLower) ||
    (conv.property_title || '').toLowerCase().includes(searchLower) ||
    (conv.last_message || '').toLowerCase().includes(searchLower)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 w-full bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col">
      <div className="flex-1 min-h-0 flex max-w-full w-full mx-auto">
        {/* Sidebar - Liste conversations (responsive) */}
        <div className="w-full sm:w-80 md:w-96 border-r border-slate-200 bg-white/80 backdrop-blur-sm flex flex-col min-w-0">
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Messages</h2>
              <p className="text-sm text-slate-500">
                {stats.unreadCount > 0 ? `${stats.unreadCount} non lu${stats.unreadCount > 1 ? 's' : ''}` : 'Toutes les conversations'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => { setBuyerEmail(''); setBuyerProfile(null); setSelectedPropertyId(''); setShowCreate(true); loadVendorProperties(); }}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={loadConversations}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
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
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <MessageSquare className="h-12 w-12 text-slate-300 mb-3" />
                <p className="text-sm text-slate-600">Aucune conversation</p>
                <p className="text-xs text-slate-400 mt-1">Démarrez une conversation avec un acheteur</p>
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
                          <AvatarImage src={conv.buyer_avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                            {conv.buyer_name?.charAt(0) || 'A'}
                          </AvatarFallback>
                        </Avatar>
                        {conv.unread_count > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white">{conv.unread_count > 9 ? '9+' : conv.unread_count}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className={`font-semibold text-sm truncate ${
                            selectedConversation?.id === conv.id ? 'text-white' : 'text-slate-900'
                          }`}>
                            {conv.buyer_name}
                          </h4>
                          <span className={`text-[11px] ml-2 ${
                            selectedConversation?.id === conv.id ? 'text-white/80' : 'text-slate-500'
                          }`}>
                            {formatDistanceToNow(new Date(conv.last_message_time), { addSuffix: true, locale: fr })}
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
                          {conv.last_message || 'Pas de message'}
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

      {/* Zone conversation (responsive) */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
                    <AvatarImage src={selectedConversation.buyer_avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white">
                      {selectedConversation.buyer_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-900">{selectedConversation.buyer_name}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Building className="h-3 w-3" />
                      <span>{selectedConversation.property_title}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm"><Phone className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm"><Video className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowInfo(!showInfo)}><Info className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-slate-50/50">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((message) => {
                  const isMe = message.sender_id === user.id;
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

            {/* Input */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="flex items-end gap-2 max-w-4xl mx-auto">
                <Button variant="ghost" size="sm" className="mb-2"><Paperclip className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="mb-2"><ImageIcon className="h-4 w-4" /></Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Écrire un message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    className="pr-10 py-6 border-slate-300"
                  />
                  <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
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
          <div className="flex-1 flex items-center justify-center bg-slate-50/50">
            <div className="text-center">
              <MessageSquare className="h-20 w-20 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Sélectionnez une conversation</h3>
              <p className="text-sm text-slate-500">Choisissez un acheteur pour commencer la discussion</p>
            </div>
          </div>
        )}
      </div>

      {/* Info Panel */}
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
              {/* Acheteur */}
              <div className="text-center pb-4 border-b border-slate-200">
                <Avatar className="h-16 w-16 mx-auto mb-2 ring-2 ring-blue-500/20">
                  <AvatarImage src={selectedConversation.buyer_avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white text-xl">
                    {selectedConversation.buyer_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h4 className="font-semibold text-slate-900">{selectedConversation.buyer_name}</h4>
                <p className="text-sm text-slate-500">{selectedConversation.buyer_email}</p>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog nouvelle conversation */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-sm text-slate-600">Sélectionner une propriété</label>
              <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une propriété" />
                </SelectTrigger>
                <SelectContent>
                  {vendorProperties.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-slate-600">Email de l'acheteur</label>
              <div className="flex gap-2">
                <Input
                  placeholder="acheteur@email.com"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  onBlur={lookupBuyerByEmail}
                />
                <Button variant="outline" onClick={lookupBuyerByEmail}>Rechercher</Button>
              </div>
              {buyerProfile && (
                <div className="mt-2 text-sm text-slate-600">
                  ✅ {buyerProfile.first_name} {buyerProfile.last_name}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Annuler</Button>
            <Button onClick={createOrOpenConversation} disabled={creating}>
              {creating ? 'Ouverture...' : 'Ouvrir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default VendeurMessagesModern;

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Send, Search, Filter, MoreVertical,
  Phone, Video, Paperclip, Image as ImageIcon, Smile,
  Check, CheckCheck, Clock, Pin, Archive, Trash2,
  Star, Bell, BellOff, User, Users, Info, X,
  ArrowLeft, Download, Eye, RefreshCw, AlertCircle,
  Building, Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader as UIDialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
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
  // Nouveau: création conversation
  const [showCreate, setShowCreate] = useState(false);
  const [vendorEmail, setVendorEmail] = useState('');
  const [buyerParcels, setBuyerParcels] = useState([]);
  const [selectedParcelId, setSelectedParcelId] = useState('');
  const [creating, setCreating] = useState(false);

  // Charger conversations
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  // Charger les parcelles liées aux demandes de l'acheteur (pour lier une conversation)
  useEffect(() => {
    const loadBuyerParcels = async () => {
      try {
        if (!user?.id) return;
        const { data: reqs, error: reqErr } = await supabase
          .from('requests')
          .select('id, parcel_id')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(50);
        if (reqErr) return;
        const parcelIds = [...new Set((reqs || []).map(r => r.parcel_id).filter(Boolean))];
        if (parcelIds.length === 0) { setBuyerParcels([]); return; }
        const { data: parcels } = await supabase
          .from('parcels')
          .select('id, title, seller_id')
          .in('id', parcelIds);
        setBuyerParcels(parcels || []);
      } catch (e) {
        console.warn('⚠️ Chargement parcelles acheteur échoué:', e);
      }
    };
    loadBuyerParcels();
  }, [user?.id]);

  // Sélectionner conversation si paramètre query présent (avec fallback fetch si absente en mémoire)
  const fetchedIdsRef = useRef(new Set());
  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (!conversationId) return;

    // Si déjà chargée dans la liste, sélectionner
    const existing = conversations.find(c => String(c.id) === String(conversationId));
    if (existing) {
      setSelectedConversation(existing);
      return;
    }

    // Fallback: éviter boucles, fetch one-shot la conversation par ID et l'ajouter à la liste
    if (fetchedIdsRef.current.has(conversationId)) return;
    fetchedIdsRef.current.add(conversationId);

    const fetchById = async () => {
      try {
        const { data: conv, error } = await supabase
          .from('conversations')
          .select('id, vendor_id, buyer_id, property_id, updated_at, unread_count_buyer')
          .eq('id', conversationId)
          .single();
        if (error || !conv) return;

        // Enrichir vendeur et propriété
        const [{ data: vendor }, { data: property }] = await Promise.all([
          supabase.from('profiles').select('id, first_name, last_name, email, avatar_url').eq('id', conv.vendor_id).single(),
          supabase.from('properties').select('id, title, reference').eq('id', conv.property_id).single()
        ]);

        const enriched = {
          id: conv.id,
          thread_id: conv.id,
          vendor_id: conv.vendor_id,
          recipient_id: conv.vendor_id,
          vendor_name: `${vendor?.first_name || ''} ${vendor?.last_name || ''}`.trim() || 'Vendeur',
          vendor_email: vendor?.email || '',
          vendor_avatar: vendor?.avatar_url,
          property_title: property?.title || 'Propriété',
          property_id: property?.reference || '',
          subject: property?.title || 'Conversation Teranga',
          last_message: 'Ouvrir la conversation',
          last_message_time: conv.updated_at,
          unread_count: conv.unread_count_buyer || 0,
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
        console.warn('⚠️ Fallback fetch conversation acheteur échoué:', err);
      }
    };

    fetchById();
  }, [searchParams, conversations]);

  // Charger messages quand conversation sélectionnée
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
      // Mark as read when opening
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  // Auto-scroll vers le bas
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Realtime subscription for buyer messages
  useEffect(() => {
    if (!selectedConversation) return;
    const channel = supabase
      .channel(`buyer_conversation_messages:${selectedConversation.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'conversation_messages', filter: `conversation_id=eq.${selectedConversation.id}` },
        (payload) => {
          const m = payload.new;
          setMessages(prev => [...prev, {
            id: m.id,
            conversation_id: m.conversation_id,
            sender_id: m.sender_id,
            sender_type: m.sender_id === user.id ? 'buyer' : 'vendor',
            sender_name: m.sender_id === user.id ? 'Vous' : selectedConversation.vendor_name || 'Vendeur',
            content: m.content,
            subject: selectedConversation.subject,
            sent_at: m.created_at,
            read_at: m.read_at,
            attachments: []
          }]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'conversation_messages', filter: `conversation_id=eq.${selectedConversation.id}` },
        (payload) => {
          const m = payload.new;
          setMessages(prev => prev.map(msg => msg.id === m.id ? {
            ...msg,
            content: m.content,
            read_at: m.read_at
          } : msg));
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedConversation, user]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      
      console.log('📊 Chargement des conversations acheteur...', user.id);
      
      // Charger vraies conversations acheteur depuis Supabase
      const { data: conversationsData, error } = await supabase
        .from('conversations')
        .select('id, vendor_id, buyer_id, property_id, updated_at, unread_count_vendor, unread_count_buyer, is_pinned_buyer, is_archived_buyer')
        .eq('buyer_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur chargement conversations:', error);
        setConversations([]);
        setStats({
          totalConversations: 0,
          unreadCount: 0,
          todayMessages: 0,
          responseTime: '0h'
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

      // Load last message for each conversation
      let lastMessagesMap = {};
      const conversationIds = conversationsData?.map(c => c.id) || [];
      
      if (conversationIds.length > 0) {
        const { data: allMessages } = await supabase
          .from('conversation_messages')
          .select('id, conversation_id, content, created_at')
          .in('conversation_id', conversationIds)
          .order('created_at', { ascending: false });
        
        if (allMessages) {
          allMessages.forEach(msg => {
            if (!lastMessagesMap[msg.conversation_id]) {
              lastMessagesMap[msg.conversation_id] = msg;
            }
          });
        }
      }

      // Mapper les données: vendor_id est le vendeur
      const formattedConversations = (conversationsData || []).map(conv => {
        const vendor = profilesMap[conv.vendor_id] || {};
        const property = propertiesMap[conv.property_id] || {};
        const lastMsg = lastMessagesMap[conv.id];
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
          subject: property?.title || 'Conversation Teranga',
          last_message: lastMsg?.content || 'Pas de message',
          last_message_time: lastMsg?.created_at || conv.updated_at,
          unread_count: conv.unread_count_buyer || 0,
          is_pinned: conv.is_pinned_buyer || false,
          is_archived: conv.is_archived_buyer || false,
          status: 'active'
        };
      });

  setConversations(formattedConversations);

      // Calculer stats
      const unreadCount = formattedConversations.reduce((sum, c) => sum + c.unread_count, 0);
      
      setStats({
        totalConversations: formattedConversations.length || 0,
        unreadCount: unreadCount || 0,
        todayMessages: 0,
        responseTime: '0h'
      });

      // Notifier le parent du compteur non lus
      if (onUnreadChange) {
        onUnreadChange(unreadCount);
      }
      
  console.log('✅', formattedConversations.length, 'conversations chargées');
      
    } catch (error) {
      console.error('❌ Erreur chargement conversations:', error);
      setConversations([]);
      setStats({
        totalConversations: 0,
        unreadCount: 0,
        todayMessages: 0,
        responseTime: '0h'
      });
    } finally {
      setLoading(false);
    }
  };

  // Suppression des mock conversations

  const loadMessages = async (conversation) => {
    try {
      console.log('📨 Chargement messages conversation:', conversation.id);
      const { data: messagesData, error } = await supabase
        .from('conversation_messages')
        .select('id, conversation_id, sender_id, content, is_read, read_at, created_at, updated_at')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Erreur chargement messages:', error);
        setMessages([]);
        return;
      }

      // Transformer les messages de la BDD vers le format d'affichage
      const formattedMessages = (messagesData || []).map(msg => ({
        id: msg.id,
        conversation_id: msg.conversation_id,
        sender_id: msg.sender_id,
        sender_type: msg.sender_id === user.id ? 'buyer' : 'vendor',
        sender_name: msg.sender_id === user.id ? 'Vous' : conversation.vendor_name || 'Vendeur',
        content: msg.content,
        subject: conversation.subject,
        sent_at: msg.created_at,
        read_at: msg.read_at,
        attachments: []
      }));

      setMessages(formattedMessages);
      
      // Marquer messages comme lus
      if (conversation.unread_count > 0) {
        await markAsRead(conversation.id);
      }
      
    } catch (error) {
      console.error('❌ Erreur chargement messages:', error);
      setMessages([]);
    }
  };
  // Suppression des mock messages

  const markAsRead = async (conversationId) => {
    try {
      const { error: convError } = await supabase
        .from('conversations')
        .update({ unread_count_buyer: 0 })
        .eq('id', conversationId);

      if (convError) throw convError;

      const { error: msgError } = await supabase
        .from('conversation_messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id);

      if (msgError) throw msgError;

      {
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
  const conversationId = selectedConversation.id;
  const recipientId = selectedConversation.vendor_id;
  const subject = selectedConversation.subject || selectedConversation.property_title || 'Message acheteur';

      if (!recipientId) {
        toast.error('Destinataire introuvable pour cette conversation');
        return;
      }

      // Envoyer via Supabase dans conversation_messages
      const { data: inserted, error: messageError } = await supabase
        .from('conversation_messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: newMessage.trim(),
          is_read: false
        })
        .select()
        .single();

      if (messageError) {
        console.error('❌ Erreur envoi message:', messageError);
        toast.error('Erreur lors de l\'envoi du message');
        return;
      }

      // Ajouter le message à l'interface avec le bon format
      const formattedMessage = {
        id: inserted.id,
        conversation_id: conversationId,
        sender_id: user.id,
        sender_type: 'buyer',
        sender_name: 'Vous',
        content: newMessage.trim(),
        subject,
        sent_at: inserted.created_at,
        read_at: null,
        attachments: []
      };

      setMessages(prev => [...prev, formattedMessage]);
      setNewMessage('');
      
      // Mettre à jour la conversation
      await supabase
        .from('conversations')
        .update({
          updated_at: new Date().toISOString(),
          unread_count_vendor: (selectedConversation.unread_count_vendor || 0) + 1
        })
        .eq('id', conversationId);

      // Mettre à jour localement
      setConversations(prev => prev.map(c =>
        c.id === conversationId
          ? { ...c, last_message: newMessage.trim(), last_message_time: inserted.created_at, unread_count: 0 }
          : c
      ));

      toast.success('Message envoyé avec succès');
      
    } catch (error) {
      console.error('❌ Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const createOrOpenConversation = async () => {
    try {
      if (!user?.id) return;
      if (!selectedParcelId && !vendorEmail.trim()) {
        toast.error('Sélectionnez une propriété ou entrez l\'email du vendeur');
        return;
      }
      setCreating(true);

      // Trouver vendor_id
      let vendorId = null;
      if (selectedParcelId) {
        const parcel = buyerParcels.find(p => String(p.id) === String(selectedParcelId));
        vendorId = parcel?.seller_id || null;
      }
      if (!vendorId && vendorEmail.trim()) {
        const { data: vendor } = await supabase
          .from('profiles')
          .select('id, email')
          .eq('email', vendorEmail.trim())
          .single();
        vendorId = vendor?.id || null;
      }

      if (!vendorId) {
        toast.error('Vendeur introuvable');
        setCreating(false);
        return;
      }

      // Vérifier conversation existante
      let existing = null;
      if (selectedParcelId) {
        const { data: convs } = await supabase
          .from('conversations')
          .select('id')
          .eq('vendor_id', vendorId)
          .eq('buyer_id', user.id)
          .eq('property_id', selectedParcelId)
          .limit(1);
        existing = convs && convs[0];
      } else {
        const { data: convs } = await supabase
          .from('conversations')
          .select('id')
          .eq('vendor_id', vendorId)
          .eq('buyer_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        existing = convs && convs[0];
      }

      let conversationId = existing?.id;
      if (!conversationId) {
        const { data: inserted, error: upErr } = await supabase
          .from('conversations')
          .upsert({
            vendor_id: vendorId,
            buyer_id: user.id,
            property_id: selectedParcelId || null,
            updated_at: new Date().toISOString(),
            unread_count_vendor: 0,
            unread_count_buyer: 0
          })
          .select('id')
          .single();
        if (upErr) throw upErr;
        conversationId = inserted.id;
      }

      setShowCreate(false);
      setVendorEmail('');
      setSelectedParcelId('');
      // Naviguer en deep-link
      window.location.assign(`/acheteur/messages?conversation=${conversationId}`);
    } catch (e) {
      console.error('❌ Création/ouverture conversation:', e);
      toast.error('Impossible d\'ouvrir la conversation');
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
    (conv.vendor_name || '').toLowerCase().includes(searchLower) ||
    (conv.property_title || '').toLowerCase().includes(searchLower) ||
    (conv.last_message || '').toLowerCase().includes(searchLower)
  );

  return (
    <div className="h-full min-h-0 flex bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Sidebar - Liste des conversations */}
      <div className="w-full sm:w-80 md:w-96 border-r border-slate-200 bg-white/80 backdrop-blur-sm flex flex-col min-w-0">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">Messages</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {stats.unreadCount > 0 
                  ? `${stats.unreadCount} non lu${stats.unreadCount > 1 ? 's' : ''}`
                  : 'Toutes les conversations'
                }
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => setShowCreate(true)} className="h-8 w-8 p-0 sm:h-9 sm:w-9">
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 sm:h-9 sm:w-9">
                <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 sm:pl-10 bg-slate-50 border-slate-200 text-xs sm:text-sm"
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
  <div className="flex-1 flex flex-col min-w-0">
        {selectedConversation ? (
          <>
            {/* Header conversation */}
            <div className="p-3 sm:p-4 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-blue-500/20 flex-shrink-0">
                    <AvatarImage src={selectedConversation.vendor_avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white text-xs sm:text-sm">
                      {selectedConversation.vendor_name?.charAt(0) || 'V'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                      {selectedConversation.vendor_name}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500">
                      <Building className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                      <span className="truncate">{selectedConversation.property_title}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hidden sm:flex sm:h-9 sm:w-9">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hidden sm:flex sm:h-9 sm:w-9">
                    <Video className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowInfo(!showInfo)} className="h-8 w-8 p-0 sm:h-9 sm:w-9">
                    <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-2 sm:p-3 lg:p-4 bg-slate-50/50">
              <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
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
                          <span>{formatTime(message.sent_at)}</span>
                          {isMe && (
                            <CheckCheck className={`h-3 w-3 ${message.read_at ? 'text-blue-200' : 'text-white/50'}`} />
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

      {/* Dialog nouvelle conversation */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <UIDialogHeader>
            <DialogTitle>Nouvelle conversation</DialogTitle>
          </UIDialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-sm text-slate-600">Sélectionner une propriété (optionnel)</label>
              <select
                className="mt-1 w-full border rounded-md p-2 text-sm"
                value={selectedParcelId}
                onChange={(e) => setSelectedParcelId(e.target.value)}
              >
                <option value="">Aucune</option>
                {buyerParcels.map(p => (
                  <option key={p.id} value={p.id}>{p.title || `Parcelle ${p.id}`}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-600">Email du vendeur (optionnel)</label>
              <Input
                placeholder="vendeur@exemple.com"
                value={vendorEmail}
                onChange={(e) => setVendorEmail(e.target.value)}
              />
              <p className="text-xs text-slate-500 mt-1">Choisissez soit une propriété liée à vos demandes, soit entrez l'email du vendeur.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Annuler</Button>
            <Button onClick={createOrOpenConversation} disabled={creating}>
              {creating ? 'Ouverture…' : 'Ouvrir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParticulierMessagesModern;

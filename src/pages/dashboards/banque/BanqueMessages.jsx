import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  Paperclip,
  MoreHorizontal,
  Phone,
  Video,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Plus,
  Calendar,
  DollarSign,
  Building,
  MapPin,
  FileText,
  Users,
  Target,
  TrendingUp,
  Activity,
  Mail,
  Smartphone,
  Globe,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Share2,
  Download,
  Upload,
  Zap,
  Shield,
  Bell,
  Settings,
  Edit3,
  Eye,
  ChevronDown,
  ChevronRight,
  UserCheck,
  UserX,
  Briefcase,
  CreditCard,
  PieChart,
  BarChart3,
  RefreshCw,
  ExternalLink,
  Bookmark,
  Flag,
  Hash,
  AtSign
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

// Templates de messages bancaires : contenu éditorial statique et réutilisable
// (aucune donnée chiffrée fabriquée ici), affiché tel quel et inséré dans la saisie.
const messageTemplates = [
  {
    id: 'welcome',
    name: 'Bienvenue client',
    category: 'Onboarding',
    content: 'Bienvenue ! Votre conseiller dédié vous accompagnera dans tous vos projets immobiliers.'
  },
  {
    id: 'credit_approved',
    name: 'Crédit approuvé',
    category: 'Crédit',
    content: 'Excellente nouvelle ! Votre demande de crédit immobilier a été approuvée. Nous vous contactons pour finaliser les modalités.'
  },
  {
    id: 'documents_needed',
    name: 'Documents requis',
    category: 'Documentation',
    content: 'Pour finaliser votre dossier, nous avons besoin des documents suivants : - Bulletin de salaire (3 derniers) - Relevé de compte (6 mois) - Justificatif de domicile'
  },
  {
    id: 'meeting_reminder',
    name: 'Rappel RDV',
    category: 'Rendez-vous',
    content: 'Rappel : Votre rendez-vous avec votre conseiller est prévu prochainement. Merci d\'apporter les documents demandés.'
  }
];

// Calcule le temps de réponse moyen RÉEL de la banque : délai entre le dernier
// message reçu d'un interlocuteur et la réponse suivante envoyée par la banque,
// à partir des messages effectivement chargés. Retourne '—' si aucune paire
// question/réponse n'existe (aucune métrique inventée).
const computeAverageResponseTime = (messagesByConversation, bankId) => {
  const deltas = [];
  messagesByConversation.forEach(convMessages => {
    const sorted = [...convMessages].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      if (prev.sender_id !== bankId && curr.sender_id === bankId) {
        deltas.push(new Date(curr.created_at) - new Date(prev.created_at));
      }
    }
  });
  if (deltas.length === 0) return '—';
  const avgMs = deltas.reduce((sum, d) => sum + d, 0) / deltas.length;
  const avgHours = avgMs / 3600000;
  if (avgHours < 1) return `${Math.round(avgMs / 60000)}min`;
  if (avgHours < 24) return `${avgHours.toFixed(1)}h`;
  return `${Math.round(avgHours / 24)}j`;
};

const BanqueMessages = () => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [sending, setSending] = useState(false);

  // Activités réelles (crédits) de l'interlocuteur sélectionné, tirées de 'loans'.
  const [clientActivities, setClientActivities] = useState([]);

  // Statistiques de communication calculées à partir des VRAIES données chargées.
  const [commStats, setCommStats] = useState({
    totalConversations: 0,
    activeClients: 0,
    unreadCount: 0,
    averageResponseTime: '—',
    messagesSent: 0,
    responseRate: null
  });

  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user?.id]);

  useEffect(() => {
    if (selectedConversation?.id) {
      loadMessages(selectedConversation.id);
      loadClientActivities(selectedConversation.participantId);
    } else {
      setMessages([]);
      setClientActivities([]);
    }
  }, [selectedConversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      setLoading(true);

      // 1) Conversations réelles auxquelles la banque participe
      const { data: participations, error: partError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);
      if (partError) throw partError;

      const conversationIds = [...new Set((participations || []).map(p => p.conversation_id))];
      if (conversationIds.length === 0) {
        setConversations([]);
        setCommStats({ totalConversations: 0, activeClients: 0, unreadCount: 0, averageResponseTime: '—', messagesSent: 0, responseRate: null });
        setLoading(false);
        return;
      }

      const { data: conversationsData, error: convError } = await supabase
        .from('conversations')
        .select('*, participants:conversation_participants(user_id)')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });
      if (convError) throw convError;

      // 2) Interlocuteurs (autres participants) + propriétés liées + messages
      const otherParticipantIds = [...new Set(
        (conversationsData || []).flatMap(c =>
          (c.participants || []).map(p => p.user_id).filter(id => id && id !== user.id)
        )
      )];
      const propertyIds = [...new Set((conversationsData || []).map(c => c.property_id).filter(Boolean))];

      const [profilesRes, propertiesRes, clientsRes, messagesRes] = await Promise.all([
        otherParticipantIds.length > 0
          ? supabase.from('profiles').select('id, first_name, last_name, full_name, email, phone, avatar_url, role').in('id', otherParticipantIds)
          : Promise.resolve({ data: [] }),
        propertyIds.length > 0
          ? supabase.from('properties').select('id, title, location').in('id', propertyIds)
          : Promise.resolve({ data: [] }),
        // Enrichissement CRM réel via bank_clients (crédit, statut, type) filtré par bank_id
        otherParticipantIds.length > 0
          ? supabase.from('bank_clients').select('client_id, client_type, status, credit_score, total_credits, created_at').eq('bank_id', user.id).in('client_id', otherParticipantIds)
          : Promise.resolve({ data: [] }),
        supabase
          .from('messages')
          .select('id, conversation_id, sender_id, content, read, created_at')
          .in('conversation_id', conversationIds)
          .order('created_at', { ascending: true })
      ]);

      const profilesById = new Map((profilesRes.data || []).map(p => [p.id, p]));
      const propertiesById = new Map((propertiesRes.data || []).map(p => [p.id, p]));
      const clientsById = new Map((clientsRes.data || []).map(c => [c.client_id, c]));
      const allMessages = messagesRes.data || [];

      const messagesByConversation = new Map();
      allMessages.forEach(msg => {
        if (!messagesByConversation.has(msg.conversation_id)) {
          messagesByConversation.set(msg.conversation_id, []);
        }
        messagesByConversation.get(msg.conversation_id).push(msg);
      });

      const nameFromProfile = (p) => {
        if (!p) return 'Interlocuteur';
        return (p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim()) || p.email || 'Interlocuteur';
      };

      const formatted = (conversationsData || []).map(conv => {
        const otherId = (conv.participants || []).map(p => p.user_id).find(id => id && id !== user.id);
        const profile = otherId ? profilesById.get(otherId) : null;
        const property = conv.property_id ? propertiesById.get(conv.property_id) : null;
        const client = otherId ? clientsById.get(otherId) : null;
        const convMessages = messagesByConversation.get(conv.id) || [];
        const lastMessage = convMessages[convMessages.length - 1];
        const unread = convMessages.filter(m => !m.read && m.sender_id !== user.id).length;

        return {
          id: conv.id,
          participantId: otherId || null,
          contact: nameFromProfile(profile),
          type: client?.client_type || (profile?.role ? profile.role : 'Contact'),
          email: profile?.email || '',
          phone: profile?.phone || '',
          avatar: profile?.avatar_url || null,
          property: property?.title || conv.subject || '',
          propertyLocation: property?.location || '',
          lastMessage: lastMessage?.content || 'Aucun message',
          lastMessageTime: lastMessage?.created_at || conv.updated_at,
          unread,
          priority: unread > 0 ? 'high' : 'normal',
          // Champs CRM RÉELS issus de bank_clients (null si non client de la banque)
          status: client?.status || null,
          creditScore: client?.credit_score ?? null,
          totalCredits: client?.total_credits ?? null,
          clientSince: client?.created_at ? new Date(client.created_at).getFullYear() : null
        };
      });

      setConversations(formatted);

      // Sélection par défaut : première conversation
      if (formatted.length > 0) {
        setSelectedConversation(prev => prev || formatted[0]);
      }

      // Stats réelles
      const unreadCount = formatted.reduce((s, c) => s + c.unread, 0);
      const activeClients = otherParticipantIds.length;
      const messagesSent = allMessages.filter(m => m.sender_id === user.id).length;
      const respondedConvs = conversationIds.filter(cid =>
        (messagesByConversation.get(cid) || []).some(m => m.sender_id === user.id)
      ).length;
      const responseRate = conversationIds.length > 0
        ? Math.round((respondedConvs / conversationIds.length) * 100)
        : null;
      const averageResponseTime = computeAverageResponseTime(messagesByConversation, user.id);

      setCommStats({
        totalConversations: formatted.length,
        activeClients,
        unreadCount,
        averageResponseTime,
        messagesSent,
        responseRate
      });

      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
      window.safeGlobalToast?.({
        title: 'Erreur',
        description: 'Impossible de charger les conversations',
        variant: 'destructive'
      });
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
        sender: msg.sender_id === user.id ? 'Banque' : (selectedConversation?.contact || 'Interlocuteur'),
        text: msg.content,
        timestamp: msg.created_at,
        isClient: msg.sender_id !== user.id,
        status: msg.read ? 'read' : 'delivered'
      }));
      setMessages(formatted);

      // Marquer comme lus les messages reçus
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .eq('read', false)
        .neq('sender_id', user.id);

      setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, unread: 0 } : c));
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    }
  };

  // Activités récentes RÉELLES de l'interlocuteur : ses dossiers de crédit (loans)
  // gérés par cette banque. Pas de source => liste vide (état honnête).
  const loadClientActivities = async (participantId) => {
    if (!participantId) {
      setClientActivities([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('loans')
        .select('id, reference, type, amount, status, created_at')
        .eq('bank_id', user.id)
        .eq('client_id', participantId)
        .order('created_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      setClientActivities(data || []);
    } catch (error) {
      console.error('Erreur chargement activités:', error);
      setClientActivities([]);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || sending) return;
    try {
      setSending(true);
      const content = messageText.trim();
      const { data, error } = await supabase
        .from('messages')
        .insert({ conversation_id: selectedConversation.id, sender_id: user.id, content, read: false })
        .select()
        .single();
      if (error) throw error;

      setMessages(prev => [...prev, {
        id: data.id,
        sender: 'Banque',
        text: content,
        timestamp: data.created_at,
        isClient: false,
        status: 'delivered'
      }]);
      setMessageText('');

      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedConversation.id);

      setConversations(prev => prev.map(c =>
        c.id === selectedConversation.id
          ? { ...c, lastMessage: content, lastMessageTime: data.created_at }
          : c
      ));
      setCommStats(prev => ({ ...prev, messagesSent: prev.messagesSent + 1 }));

      window.safeGlobalToast?.({
        title: 'Message envoyé',
        description: 'Votre message a été envoyé avec succès',
        variant: 'success'
      });
    } catch (error) {
      console.error('Erreur envoi message:', error);
      window.safeGlobalToast?.({
        title: 'Erreur',
        description: "Impossible d'envoyer le message",
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  const handleUseTemplate = (template) => {
    setMessageText(template.content);
    setSelectedTemplate('');
  };

  const handleStartRecording = () => {
    setIsRecording(!isRecording);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'Approuvé':
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending':
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'Rejeté': return 'bg-red-100 text-red-800';
      case 'evaluating':
      case 'Documenté': return 'bg-blue-100 text-blue-800';
      case 'disbursed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = (value) => {
    if (value === null || value === undefined) return '—';
    const n = Number(value);
    if (Number.isNaN(n)) return '—';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M FCFA`;
    return `${n.toLocaleString('fr-FR')} FCFA`;
  };

  const formatTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const d = new Date(date);
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}j`;
    return d.toLocaleDateString('fr-FR');
  };

  const getInitials = (name) => (name || '?')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const filteredConversations = conversations
    .filter(conv => {
      if (filterStatus === 'unread') return conv.unread > 0;
      if (filterStatus === 'priority') return conv.priority === 'high';
      return true;
    })
    .filter(conv =>
      conv.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conv.type || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

  const selected = selectedConversation
    ? conversations.find(c => c.id === selectedConversation.id) || selectedConversation
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Chargement des conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Conversations</p>
                  <p className="text-2xl font-bold text-blue-900">{commStats.totalConversations}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Interlocuteurs</p>
                  <p className="text-2xl font-bold text-green-900">{commStats.activeClients}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Temps de Réponse</p>
                  <p className="text-2xl font-bold text-yellow-900">{commStats.averageResponseTime}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-sm font-medium">Messages non lus</p>
                  <p className="text-2xl font-bold text-red-900">{commStats.unreadCount}</p>
                </div>
                <Bell className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Header principal */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Communication CRM Bancaire</h2>
          <p className="text-gray-600 mt-1">
            Gestion des communications clients, partenaires et prospects
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline" onClick={loadConversations}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Interface principale avec onglets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <span>Centre de Communication CRM</span>
          </CardTitle>
          <CardDescription>
            Interface unifiée pour la gestion des communications bancaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="conversations">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="conversations">Conversations</TabsTrigger>
              <TabsTrigger value="crm">CRM Client</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Onglet Conversations */}
            <TabsContent value="conversations" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
                {/* Liste des conversations */}
                <Card className="lg:col-span-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Conversations</CardTitle>
                      <Badge variant="secondary">{conversations.length}</Badge>
                    </div>

                    {/* Recherche et filtres */}
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Rechercher conversations..."
                          className="pl-9"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant={filterStatus === 'all' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFilterStatus('all')}
                        >
                          Tous
                        </Button>
                        <Button
                          variant={filterStatus === 'unread' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFilterStatus('unread')}
                        >
                          Non lus
                        </Button>
                        <Button
                          variant={filterStatus === 'priority' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setFilterStatus('priority')}
                        >
                          Priorité
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1 max-h-[500px] overflow-y-auto">
                      {filteredConversations.length === 0 ? (
                        <div className="text-center text-gray-500 py-12 px-4">
                          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-sm">Aucune conversation</p>
                        </div>
                      ) : filteredConversations.map((conv) => (
                        <motion.div
                          key={conv.id}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => setSelectedConversation(conv)}
                          className={`p-4 cursor-pointer transition-all duration-200 border-l-4 ${
                            selected?.id === conv.id
                              ? 'bg-blue-50 border-l-blue-600 shadow-sm'
                              : 'border-l-transparent hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={conv.avatar} />
                                <AvatarFallback className="text-sm font-semibold">
                                  {getInitials(conv.contact)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-sm text-gray-900">{conv.contact}</p>
                                <div className="flex items-center space-x-2">
                                  {conv.type && (
                                    <Badge variant="outline" className="text-xs">
                                      {conv.type}
                                    </Badge>
                                  )}
                                  {conv.priority === 'high' && (
                                    <Flag className="h-3 w-3 text-red-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">{formatTime(conv.lastMessageTime)}</p>
                              {conv.unread > 0 && (
                                <Badge className="bg-red-500 text-white text-xs mt-1">
                                  {conv.unread}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {conv.lastMessage}
                          </p>

                          <div className="flex items-center justify-between text-xs">
                            {conv.status ? (
                              <Badge className={getStatusColor(conv.status)}>
                                {conv.status}
                              </Badge>
                            ) : <span />}
                            {conv.property && (
                              <div className="text-gray-500 text-right">
                                <div>{conv.property}</div>
                                {conv.propertyLocation && <div>{conv.propertyLocation}</div>}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Zone de conversation avancée */}
                <div className="lg:col-span-2 space-y-4">
                  {selected ? (
                    <>
                      {/* Header conversation avec détails client */}
                      <Card>
                        <CardHeader className="border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={selected.avatar} />
                                <AvatarFallback className="font-semibold">
                                  {getInitials(selected.contact)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {selected.contact}
                                </h3>
                                <div className="flex items-center space-x-2 mb-1">
                                  {selected.type && (
                                    <Badge variant="outline">{selected.type}</Badge>
                                  )}
                                  {selected.status && (
                                    <Badge className={getStatusColor(selected.status)}>
                                      {selected.status}
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {[selected.phone, selected.email].filter(Boolean).join(' • ') || '—'}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowClientDetails(!showClientDetails)}
                              >
                                {showClientDetails ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          {/* Détails client étendus (données réelles bank_clients) */}
                          {showClientDetails && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-4 p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Client depuis:</span>
                                  <div className="font-semibold">{selected.clientSince || '—'}</div>
                                </div>
                                <div>
                                  <span className="text-gray-600">Total crédits:</span>
                                  <div className="font-semibold text-green-600">
                                    {formatAmount(selected.totalCredits)}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-600">Score crédit:</span>
                                  <div className="font-semibold">
                                    {selected.creditScore ?? '—'}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-600">Statut:</span>
                                  <div className="font-semibold">{selected.status || '—'}</div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </CardHeader>
                      </Card>

                      {/* Zone de messages */}
                      <Card className="flex-1">
                        <CardContent className="p-4">
                          <div className="space-y-4 max-h-[400px] overflow-y-auto">
                            {messages.length === 0 ? (
                              <div className="text-center text-gray-500 py-12">
                                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                <p className="text-sm">Aucun message dans cette conversation</p>
                              </div>
                            ) : messages.map((message) => (
                              <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${message.isClient ? 'justify-start' : 'justify-end'}`}
                              >
                                <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                                  message.isClient
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'bg-blue-600 text-white'
                                }`}>
                                  <p className="text-sm">{message.text}</p>
                                  <div className={`text-xs mt-2 flex items-center justify-between ${
                                    message.isClient ? 'text-gray-500' : 'text-blue-100'
                                  }`}>
                                    <span>{formatTime(message.timestamp)}</span>
                                    {!message.isClient && (
                                      <div className="flex items-center space-x-1">
                                        {message.status === 'delivered' && <CheckCircle className="h-3 w-3" />}
                                        {message.status === 'read' && <CheckCircle className="h-3 w-3 text-blue-300" />}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                          </div>

                          {/* Zone de saisie avancée */}
                          <div className="border-t pt-4 mt-4 space-y-3">
                            {/* Barre d'outils */}
                            <div className="flex items-center space-x-2 text-sm">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedTemplate(selectedTemplate ? '' : 'show')}
                              >
                                <FileText className="h-3 w-3 mr-1" />
                                Templates
                              </Button>
                            </div>

                            {/* Templates rapides */}
                            {selectedTemplate && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="border rounded-lg p-3 bg-gray-50"
                              >
                                <div className="grid grid-cols-2 gap-2">
                                  {messageTemplates.slice(0, 4).map((template) => (
                                    <Button
                                      key={template.id}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleUseTemplate(template)}
                                      className="text-xs text-left justify-start"
                                    >
                                      <Zap className="h-3 w-3 mr-1" />
                                      {template.name}
                                    </Button>
                                  ))}
                                </div>
                              </motion.div>
                            )}

                            {/* Saisie du message */}
                            <div className="flex items-center space-x-2">
                              <Textarea
                                placeholder="Tapez votre message... (Ctrl+Entrée pour envoyer)"
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && e.ctrlKey) {
                                    handleSendMessage();
                                  }
                                }}
                                className="flex-1 min-h-[80px] resize-none"
                              />
                              <Button onClick={handleSendMessage} disabled={sending || !messageText.trim()} className="self-end">
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Card className="h-full">
                      <CardContent className="flex items-center justify-center h-[500px]">
                        <div className="text-center text-gray-500">
                          <MessageSquare className="h-16 w-16 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Sélectionnez une conversation</h3>
                          <p>Choisissez un contact pour commencer la communication</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Onglet CRM Client */}
            <TabsContent value="crm" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span>Profil Client Détaillé</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selected ? (
                      <div className="space-y-4">
                        <div className="text-center pb-4 border-b">
                          <Avatar className="w-20 h-20 mx-auto mb-3">
                            <AvatarImage src={selected.avatar} />
                            <AvatarFallback className="text-lg">
                              {getInitials(selected.contact)}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-semibold text-lg">{selected.contact}</h3>
                          {selected.status && (
                            <Badge className={getStatusColor(selected.status)}>
                              {selected.status}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total crédits:</span>
                            <span className="font-semibold text-green-600">
                              {formatAmount(selected.totalCredits)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Client depuis:</span>
                            <span className="font-semibold">{selected.clientSince || '—'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Score crédit:</span>
                            <span className="font-semibold">{selected.creditScore ?? '—'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-semibold">{selected.email || '—'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Téléphone:</span>
                            <span className="font-semibold">{selected.phone || '—'}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <User className="h-12 w-12 mx-auto mb-4" />
                        <p>Sélectionnez un client pour voir son profil</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      <span>Dossiers de crédit</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!selected ? (
                      <div className="text-center text-gray-500 py-8">
                        <Activity className="h-12 w-12 mx-auto mb-4" />
                        <p>Sélectionnez un client</p>
                      </div>
                    ) : clientActivities.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <FileText className="h-12 w-12 mx-auto mb-4" />
                        <p>Aucun dossier de crédit pour ce client</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {clientActivities.map((loan) => (
                          <div key={loan.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {loan.reference || 'Dossier'} {loan.type ? `— ${loan.type}` : ''}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-gray-600">
                                <Calendar className="h-3 w-3" />
                                <span>{loan.created_at ? new Date(loan.created_at).toLocaleDateString('fr-FR') : '—'}</span>
                                {loan.amount != null && (
                                  <>
                                    <DollarSign className="h-3 w-3" />
                                    <span>{formatAmount(loan.amount)}</span>
                                  </>
                                )}
                              </div>
                              {loan.status && (
                                <Badge className={getStatusColor(loan.status)}>
                                  {loan.status}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Templates */}
            <TabsContent value="templates" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {messageTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold">{template.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {template.content}
                      </p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUseTemplate(template)}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Utiliser
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Onglet Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Messages envoyés</p>
                        <p className="text-2xl font-bold text-blue-600">{commStats.messagesSent}</p>
                      </div>
                      <Send className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mt-1">Total sur vos conversations</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Taux de réponse</p>
                        <p className="text-2xl font-bold text-green-600">
                          {commStats.responseRate != null ? `${commStats.responseRate}%` : '—'}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="mt-2">
                      {commStats.responseRate != null && (
                        <Progress value={commStats.responseRate} className="h-2" />
                      )}
                      <p className="text-xs text-gray-500 mt-1">Conversations avec réponse</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Temps moyen</p>
                        <p className="text-2xl font-bold text-yellow-600">{commStats.averageResponseTime}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mt-1">Délai de réponse observé</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Non lus</p>
                        <p className="text-2xl font-bold text-red-600">{commStats.unreadCount}</p>
                      </div>
                      <Bell className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mt-1">Messages en attente</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertTitle>Performance Communication</AlertTitle>
                <AlertDescription>
                  {commStats.totalConversations > 0 ? (
                    <>
                      {commStats.totalConversations} conversation{commStats.totalConversations > 1 ? 's' : ''} en cours,
                      {' '}{commStats.messagesSent} message{commStats.messagesSent > 1 ? 's' : ''} envoyé{commStats.messagesSent > 1 ? 's' : ''}
                      {commStats.averageResponseTime !== '—' ? `, temps de réponse moyen ${commStats.averageResponseTime}.` : '.'}
                    </>
                  ) : (
                    'Aucune conversation pour le moment.'
                  )}
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BanqueMessages;

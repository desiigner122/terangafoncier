/**
 * PAGE SUPPORT CLIENT - SYSTÈME DE TICKETS COMPLET
 * - Création ticket (bug, feature, question, aide)
 * - Historique tickets avec statuts
 * - Chat temps réel avec support
 * - Base de connaissances (FAQ)
 * - Contact direct (email, téléphone, WhatsApp)
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Send, Phone, Mail, HelpCircle, Bug, 
  Lightbulb, AlertCircle, CheckCircle, Clock, X,
  Search, Filter, Download, ExternalLink, Copy,
  ChevronDown, ChevronUp, Paperclip, Image as ImageIcon,
  FileText, Video, Headphones, MessageCircle, Zap,
  BookOpen, Users, Shield, RefreshCw, Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import VendeurSupabaseService from '@/services/VendeurSupabaseService';

// La table réelle `support_tickets` n'a pas de colonne `type` : le type
// (bug/fonctionnalité/question/aide) est encodé au début du `title` sous la
// forme "[type] Sujet" et re-décodé à la lecture. Aucune donnée inventée :
// c'est le choix réel de l'utilisateur, simplement stocké dans une colonne existante.
const TITLE_TYPE_REGEX = /^\[(bug|feature|question|help)\]\s*/i;

const parseTicketTitle = (ticket) => {
  const title = ticket.title || '';
  const match = title.match(TITLE_TYPE_REGEX);
  const type = match ? match[1].toLowerCase() : 'question';
  const subject = match ? title.slice(match[0].length) : (title || 'Sans sujet');
  // Pas de colonne `ticket_number` réelle : on dérive une référence lisible
  // de l'id réel (déterministe, pas aléatoire).
  const ticket_number = ticket.id ? `TK-${ticket.id.slice(0, 8).toUpperCase()}` : '';
  return { ...ticket, type, subject, ticket_number };
};

const VendeurSupport = () => {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // States dialogs
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false);
  const [showTicketDetailDialog, setShowTicketDetailDialog] = useState(false);
  
  // Formulaire nouveau ticket
  const [newTicket, setNewTicket] = useState({
    subject: '',
    type: 'question', // bug, feature, question, help
    priority: 'normal', // low, normal, high, urgent
    description: '',
    attachments: []
  });
  
  // Filtres
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    avgResponseTime: '0h'
  });
  
  // FAQ
  const faqs = [
    {
      category: 'Compte & Paiement',
      questions: [
        {
          q: 'Comment puis-je modifier mes informations de paiement ?',
          a: 'Rendez-vous dans Paramètres > Paiement. Vous pouvez ajouter ou modifier vos méthodes de paiement (carte bancaire, Wave, Orange Money).'
        },
        {
          q: 'Comment obtenir une facture pour mes transactions ?',
          a: 'Dans la section Transactions, cliquez sur le bouton "Télécharger" à côté de chaque transaction. La facture PDF sera générée automatiquement.'
        },
        {
          q: 'Quels sont les frais de commission ?',
          a: 'Les frais varient selon le type de propriété : 3% pour terrains, 5% pour maisons/appartements. Détails complets dans notre Guide Tarifaire.'
        }
      ]
    },
    {
      category: 'Propriétés & Annonces',
      questions: [
        {
          q: 'Combien de temps prend la vérification d\'une propriété ?',
          a: 'La vérification standard prend 24-48h. La vérification blockchain peut prendre jusqu\'à 72h selon la complexité du dossier.'
        },
        {
          q: 'Comment optimiser la visibilité de mes annonces ?',
          a: 'Utilisez l\'Assistant IA pour optimiser vos descriptions, ajoutez des photos HD (min 5), activez la géolocalisation GPS, et certifiez sur blockchain.'
        },
        {
          q: 'Puis-je modifier une annonce après publication ?',
          a: 'Oui, accédez à Mes Propriétés > Menu (⋮) > Modifier. Les modifications majeures peuvent nécessiter une re-vérification.'
        }
      ]
    },
    {
      category: 'Sécurité & Fraude',
      questions: [
        {
          q: 'Comment fonctionne l\'anti-fraude ?',
          a: 'Notre système vérifie automatiquement les documents (IA + blockchain), compare avec registres officiels, et valide la géolocalisation GPS réelle.'
        },
        {
          q: 'Que faire si je détecte une fraude ?',
          a: 'Créez immédiatement un ticket priorité "Urgent" avec type "Sécurité". Notre équipe réagit sous 1h pour les cas urgents.'
        },
        {
          q: 'Mes données sont-elles sécurisées ?',
          a: 'Oui. Chiffrement SSL 256-bit, stockage certifié ISO 27001, conformité RGPD, et authentification 2FA disponible.'
        }
      ]
    },
    {
      category: 'Blockchain & Certification',
      questions: [
        {
          q: 'Qu\'est-ce que la certification blockchain ?',
          a: 'Enregistrement immuable de votre titre de propriété sur la blockchain Teranga. Preuve infalsifiable, traçabilité complète, reconnaissance légale.'
        },
        {
          q: 'Combien coûte la certification blockchain ?',
          a: 'Tarifs : 50,000 FCFA terrains < 500m², 100,000 FCFA > 500m², 150,000 FCFA constructions. Inclut vérification + enregistrement + certificat.'
        }
      ]
    }
  ];

  useEffect(() => {
    if (user) {
      loadTickets();
    }
  }, [user]);

  useEffect(() => {
    filterTickets();
  }, [tickets, statusFilter, typeFilter, searchTerm]);

  useEffect(() => {
    if (showTicketDetailDialog && selectedTicket?.id) {
      loadTicketMessages(selectedTicket.id);
    } else {
      setTicketMessages([]);
    }
  }, [showTicketDetailDialog, selectedTicket?.id]);

  const loadTicketMessages = async (ticketId) => {
    try {
      setLoadingMessages(true);
      const { data, error } = await supabase
        .from('support_ticket_messages')
        .select('id, ticket_id, sender_id, content, created_at')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTicketMessages(data || []);
    } catch (error) {
      console.error('Erreur chargement messages ticket:', error);
      setTicketMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const loadTickets = async () => {
    try {
      setLoading(true);

      const result = await VendeurSupabaseService.getSupportTickets(user.id);
      if (!result.success) throw new Error(result.error || 'Erreur inconnue');

      let parsedTickets = (result.data || []).map(parseTicketTitle);

      // Enrichissement avec les vrais messages (support_ticket_messages) :
      // nombre de réponses + date de première réponse de l'équipe support.
      if (parsedTickets.length > 0) {
        const ticketIds = parsedTickets.map((t) => t.id);
        const { data: messages, error: messagesError } = await supabase
          .from('support_ticket_messages')
          .select('ticket_id, sender_id, created_at')
          .in('ticket_id', ticketIds)
          .order('created_at', { ascending: true });

        if (!messagesError && messages) {
          const messagesByTicket = {};
          messages.forEach((m) => {
            if (!messagesByTicket[m.ticket_id]) messagesByTicket[m.ticket_id] = [];
            messagesByTicket[m.ticket_id].push(m);
          });

          parsedTickets = parsedTickets.map((t) => {
            const msgs = messagesByTicket[t.id] || [];
            const staffMsg = msgs.find((m) => m.sender_id !== t.user_id);
            return {
              ...t,
              messageCount: msgs.length,
              first_response_at: staffMsg ? staffMsg.created_at : null,
            };
          });
        }
      }

      setTickets(parsedTickets);
      calculateStats(parsedTickets);
    } catch (error) {
      console.error('Erreur chargement tickets:', error);
      toast.error('Erreur lors du chargement des tickets');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      open: data.filter(t => t.status === 'open').length,
      inProgress: data.filter(t => t.status === 'in_progress').length,
      resolved: data.filter(t => t.status === 'resolved').length,
      avgResponseTime: calculateAvgResponseTime(data)
    };
    setStats(stats);
  };

  const calculateAvgResponseTime = (data) => {
    const respondedTickets = data.filter(t => t.first_response_at);
    if (respondedTickets.length === 0) return '0h';

    const totalHours = respondedTickets.reduce((sum, t) => {
      const created = new Date(t.created_at);
      const responded = new Date(t.first_response_at);
      const hours = (responded - created) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);

    const avgHours = Math.round(totalHours / respondedTickets.length);
    return avgHours < 24 ? `${avgHours}h` : `${Math.round(avgHours / 24)}j`;
  };

  const filterTickets = () => {
    let filtered = [...tickets];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(t => t.type === typeFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.ticket_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.description) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      // La colonne réelle est `title` (pas `subject`/`type`/`ticket_number`) :
      // on encode le type choisi dans le title (voir parseTicketTitle).
      const title = `[${newTicket.type}] ${newTicket.subject}`;

      const result = await VendeurSupabaseService.createSupportTicket({
        user_id: user.id,
        title,
        description: newTicket.description,
        priority: newTicket.priority,
        status: 'open'
      });

      if (!result.success) throw new Error(result.error || 'Erreur inconnue');

      toast.success('✅ Ticket créé ! Notre équipe vous répondra sous 24h.');
      setShowNewTicketDialog(false);
      setNewTicket({
        subject: '',
        type: 'question',
        priority: 'normal',
        description: '',
        attachments: []
      });
      loadTickets();

      // TODO: Envoyer email confirmation
      
    } catch (error) {
      console.error('Erreur création ticket:', error);
      toast.error('Erreur lors de la création du ticket');
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      bug: Bug,
      feature: Lightbulb,
      question: HelpCircle,
      help: MessageCircle
    };
    const Icon = icons[type] || HelpCircle;
    return <Icon className="h-4 w-4" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      bug: 'bg-red-100 text-red-800 border-red-200',
      feature: 'bg-blue-100 text-blue-800 border-blue-200',
      question: 'bg-purple-100 text-purple-800 border-purple-200',
      help: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type) => {
    const labels = {
      bug: 'Bug',
      feature: 'Fonctionnalité',
      question: 'Question',
      help: 'Aide'
    };
    return labels[type] || type;
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
      resolved: 'bg-green-100 text-green-800 border-green-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      open: 'Ouvert',
      in_progress: 'En cours',
      resolved: 'Résolu',
      closed: 'Fermé'
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      open: Clock,
      in_progress: RefreshCw,
      resolved: CheckCircle,
      closed: X
    };
    const Icon = icons[status] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-gray-600',
      normal: 'text-blue-600',
      high: 'text-orange-600',
      urgent: 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papier');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Headphones className="h-8 w-8 text-blue-600" />
            Support Client
          </h1>
          <p className="text-gray-600 mt-1">
            Besoin d'aide ? Notre équipe est là pour vous 24/7
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => loadTickets()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button
            onClick={() => setShowNewTicketDialog(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Nouveau ticket
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-700">{stats.total}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">Total tickets</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-700">{stats.open}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">Ouverts</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <RefreshCw className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-blue-700">{stats.inProgress}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">En cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-700">{stats.resolved}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">Résolus</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-purple-700">{stats.avgResponseTime}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">Temps réponse</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principal */}
      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tickets">Mes Tickets</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Direct</TabsTrigger>
          <TabsTrigger value="resources">Ressources</TabsTrigger>
        </TabsList>

        {/* Onglet Tickets */}
        <TabsContent value="tickets" className="space-y-4">
          {/* Filtres */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un ticket..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="open">Ouverts</SelectItem>
                    <SelectItem value="in_progress">En cours</SelectItem>
                    <SelectItem value="resolved">Résolus</SelectItem>
                    <SelectItem value="closed">Fermés</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="feature">Fonctionnalité</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                    <SelectItem value="help">Aide</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {filteredTickets.length} ticket(s) trouvé(s)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Liste tickets */}
          {filteredTickets.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Aucun ticket trouvé
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-4">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'Essayez de modifier vos filtres'
                    : 'Vous n\'avez pas encore créé de ticket'}
                </p>
                <Button
                  onClick={() => setShowNewTicketDialog(true)}
                  className="bg-blue-600"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Créer mon premier ticket
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => {
                    setSelectedTicket(ticket);
                    setShowTicketDetailDialog(true);
                  }}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`${getTypeColor(ticket.type)} flex items-center gap-1`}>
                              {getTypeIcon(ticket.type)}
                              {getTypeLabel(ticket.type)}
                            </Badge>
                            <Badge className={`${getStatusColor(ticket.status)} flex items-center gap-1`}>
                              {getStatusIcon(ticket.status)}
                              {getStatusLabel(ticket.status)}
                            </Badge>
                            {ticket.priority === 'urgent' && (
                              <Badge className="bg-red-100 text-red-800">
                                ⚡ Urgent
                              </Badge>
                            )}
                          </div>

                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {ticket.subject}
                          </h3>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {ticket.description}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {ticket.ticket_number}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                            </span>
                            {ticket.messageCount > 0 && (
                              <span className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {ticket.messageCount} réponse(s)
                              </span>
                            )}
                          </div>
                        </div>

                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Onglet FAQ */}
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Questions Fréquentes
              </CardTitle>
              <CardDescription>
                Trouvez rapidement des réponses aux questions les plus courantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {faqs.map((category, idx) => (
                <div key={idx} className="mb-6 last:mb-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                    {category.category}
                  </h3>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, qIdx) => (
                      <AccordionItem key={qIdx} value={`faq-${idx}-${qIdx}`}>
                        <AccordionTrigger className="text-left">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-700">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Contact Direct */}
        <TabsContent value="contact" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Téléphone</h3>
                <p className="text-gray-600 mb-4">
                  Lun-Ven: 8h-20h<br />
                  Sam-Dim: 9h-18h
                </p>
                <a href="tel:+221338234567" className="text-blue-600 font-semibold hover:underline">
                  +221 33 823 45 67
                </a>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => copyToClipboard('+221338234567')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copier
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">WhatsApp</h3>
                <p className="text-gray-600 mb-4">
                  Réponse rapide<br />
                  24/7 disponible
                </p>
                <a 
                  href="https://wa.me/221775551234" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 font-semibold hover:underline"
                >
                  +221 77 555 12 34
                </a>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => window.open('https://wa.me/221775551234', '_blank')}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ouvrir
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="pt-6 text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <p className="text-gray-600 mb-4">
                  Réponse sous 24h<br />
                  Support prioritaire
                </p>
                <a href="mailto:support@teranga-foncier.sn" className="text-purple-600 font-semibold hover:underline">
                  support@teranga-foncier.sn
                </a>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => copyToClipboard('support@teranga-foncier.sn')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copier
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Ressources */}
        <TabsContent value="resources" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  Tutoriels Vidéo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span>🎬 Comment ajouter une propriété</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span>🎬 Utiliser l'anti-fraude</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span>🎬 Blockchain expliquée</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a href="/guide" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span>📖 Guide complet vendeur</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span>📖 API Documentation</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span>📖 Conditions Générales</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog Nouveau Ticket */}
      <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Créer un nouveau ticket
            </DialogTitle>
            <DialogDescription>
              Décrivez votre problème ou question. Notre équipe vous répondra rapidement.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Sujet *</Label>
              <Input
                id="subject"
                placeholder="Ex: Problème d'upload de photo"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select 
                  value={newTicket.type} 
                  onValueChange={(value) => setNewTicket({ ...newTicket, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">🐛 Bug</SelectItem>
                    <SelectItem value="feature">💡 Fonctionnalité</SelectItem>
                    <SelectItem value="question">❓ Question</SelectItem>
                    <SelectItem value="help">💬 Aide</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Priorité *</Label>
                <Select 
                  value={newTicket.priority} 
                  onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🔵 Faible</SelectItem>
                    <SelectItem value="normal">🟢 Normale</SelectItem>
                    <SelectItem value="high">🟠 Élevée</SelectItem>
                    <SelectItem value="urgent">🔴 Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Décrivez votre problème en détail..."
                rows={6}
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Plus vous donnez de détails, plus nous pourrons vous aider rapidement
              </p>
            </div>

            <div>
              <Label>Pièces jointes (optionnel)</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Cliquez pour joindre des fichiers
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Images, PDF, vidéos (max 10MB)
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTicketDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateTicket} className="bg-blue-600">
              <Send className="h-4 w-4 mr-2" />
              Envoyer le ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Détail Ticket */}
      <Dialog open={showTicketDetailDialog} onOpenChange={setShowTicketDetailDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Ticket #{selectedTicket?.ticket_number}
            </DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getTypeColor(selectedTicket.type)}>
                  {getTypeLabel(selectedTicket.type)}
                </Badge>
                <Badge className={getStatusColor(selectedTicket.status)}>
                  {getStatusLabel(selectedTicket.status)}
                </Badge>
                {selectedTicket.priority === 'urgent' && (
                  <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                )}
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">{selectedTicket.subject}</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  Créé le {new Date(selectedTicket.created_at).toLocaleString('fr-FR')}
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Réponses de l'équipe support</h4>
                {loadingMessages ? (
                  <div className="text-center text-muted-foreground py-8">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
                    Chargement des réponses...
                  </div>
                ) : ticketMessages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    Aucune réponse pour le moment. Notre équipe vous répondra sous 24h.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ticketMessages.map((msg) => {
                      const isOwn = msg.sender_id === selectedTicket.user_id;
                      return (
                        <div
                          key={msg.id}
                          className={`rounded-lg p-3 ${isOwn ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-100'}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-700">
                              {isOwn ? 'Vous' : 'Équipe support'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(msg.created_at).toLocaleString('fr-FR')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendeurSupport;

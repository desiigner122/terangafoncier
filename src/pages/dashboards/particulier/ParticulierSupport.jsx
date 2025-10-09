import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  FileText,
  User,
  Calendar,
  Tag,
  Send,
  Paperclip,
  Loader2,
  HelpCircle,
  BookOpen,
  Video,
  ExternalLink
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from 'react-hot-toast';

const ParticulierSupport = () => {
  const { user, profile } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'general',
    priority: 'normal',
    description: '',
    attachments: []
  });

  const [ticketMessages, setTicketMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const categories = [
    { value: 'general', label: 'Question générale', color: 'bg-blue-100 text-blue-800' },
    { value: 'technique', label: 'Problème technique', color: 'bg-red-100 text-red-800' },
    { value: 'demande', label: 'Demande de terrain', color: 'bg-green-100 text-green-800' },
    { value: 'financement', label: 'Financement', color: 'bg-purple-100 text-purple-800' },
    { value: 'compte', label: 'Compte utilisateur', color: 'bg-orange-100 text-orange-800' }
  ];

  const priorities = [
    { value: 'low', label: 'Faible', color: 'bg-gray-100 text-gray-800' },
    { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'Élevée', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  const statuses = [
    { value: 'ouvert', label: 'Ouvert', color: 'bg-green-100 text-green-800' },
    { value: 'en_cours', label: 'En cours', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'en_attente', label: 'En attente', color: 'bg-orange-100 text-orange-800' },
    { value: 'ferme', label: 'Fermé', color: 'bg-gray-100 text-gray-800' }
  ];

  useEffect(() => {
    if (user?.id) {
      loadTickets();
    }
  }, [user?.id]);

  const loadTickets = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTickets(data || []);

    } catch (error) {
      console.error('Erreur chargement tickets:', error);
      toast.error('Erreur lors du chargement des tickets');
    } finally {
      setLoading(false);
    }
  };

  const loadTicketMessages = async (ticketId) => {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setTicketMessages(data || []);

    } catch (error) {
      console.error('Erreur chargement messages:', error);
      toast.error('Erreur lors du chargement des messages');
    }
  };

  const createTicket = async (e) => {
    e.preventDefault();
    
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('support_tickets')
        .insert([{
          user_id: user.id,
          subject: newTicket.subject,
          category: newTicket.category,
          priority: newTicket.priority,
          description: newTicket.description,
          status: 'ouvert'
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Ticket créé avec succès');
      
      // Réinitialiser le formulaire
      setNewTicket({
        subject: '',
        category: 'general',
        priority: 'normal',
        description: '',
        attachments: []
      });
      
      setShowNewTicket(false);
      loadTickets();

    } catch (error) {
      console.error('Erreur création ticket:', error);
      toast.error('Erreur lors de la création du ticket');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      const { error } = await supabase
        .from('support_messages')
        .insert([{
          ticket_id: selectedTicket.id,
          user_id: user.id,
          message: newMessage,
          is_from_user: true
        }]);

      if (error) throw error;

      setNewMessage('');
      loadTicketMessages(selectedTicket.id);
      toast.success('Message envoyé');

    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getCategoryInfo = (category) => {
    return categories.find(c => c.value === category) || categories[0];
  };

  const getPriorityInfo = (priority) => {
    return priorities.find(p => p.value === priority) || priorities[1];
  };

  const getStatusInfo = (status) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  const getTimeAgo = (date) => {
    if (!date) return 'Maintenant';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}j`;
  };

  if (selectedTicket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSelectedTicket(null)}
          >
            ← Retour aux tickets
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {selectedTicket.subject}
                </CardTitle>
                <CardDescription>
                  Ticket #{selectedTicket.id} • Créé le {new Date(selectedTicket.created_at).toLocaleDateString('fr-FR')}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className={getCategoryInfo(selectedTicket.category).color}>
                  {getCategoryInfo(selectedTicket.category).label}
                </Badge>
                <Badge className={getPriorityInfo(selectedTicket.priority).color}>
                  {getPriorityInfo(selectedTicket.priority).label}
                </Badge>
                <Badge className={getStatusInfo(selectedTicket.status).color}>
                  {getStatusInfo(selectedTicket.status).label}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 whitespace-pre-wrap">
              {selectedTicket.description}
            </p>
          </CardContent>
        </Card>

        {/* Messages du ticket */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Conversation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {ticketMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.is_from_user ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.is_from_user
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.is_from_user ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {getTimeAgo(message.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {selectedTicket.status !== 'ferme' && (
              <form onSubmit={sendMessage} className="mt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support Client</h1>
          <p className="text-slate-600 mt-1">
            Obtenez de l'aide pour vos questions et problèmes
          </p>
        </div>
        
        <Button onClick={() => setShowNewTicket(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau ticket
        </Button>
      </div>

      {/* Contacts rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Phone className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">Téléphone</h3>
            <p className="text-sm text-slate-600">+221 33 XXX XX XX</p>
            <p className="text-xs text-slate-500 mt-1">Lun-Ven 8h-18h</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">Email</h3>
            <p className="text-sm text-slate-600">support@terangafoncier.sn</p>
            <p className="text-xs text-slate-500 mt-1">Réponse sous 24h</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold">Chat en ligne</h3>
            <p className="text-sm text-slate-600">Assistance immédiate</p>
            <p className="text-xs text-slate-500 mt-1">Disponible maintenant</p>
          </CardContent>
        </Card>
      </div>

      {/* Ressources d'aide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="h-5 w-5 mr-2" />
            Ressources d'aide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <BookOpen className="h-6 w-6 text-blue-600 mb-2" />
              <span className="font-semibold">Guide utilisateur</span>
              <span className="text-sm text-slate-600">Documentation complète</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <Video className="h-6 w-6 text-green-600 mb-2" />
              <span className="font-semibold">Tutoriels vidéo</span>
              <span className="text-sm text-slate-600">Apprenez en regardant</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <HelpCircle className="h-6 w-6 text-purple-600 mb-2" />
              <span className="font-semibold">FAQ</span>
              <span className="text-sm text-slate-600">Questions fréquentes</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Nouveau ticket modal */}
      {showNewTicket && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Créer un nouveau ticket</h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowNewTicket(false)}
                >
                  ×
                </Button>
              </div>

              <form onSubmit={createTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sujet *
                  </label>
                  <Input
                    placeholder="Résumé de votre problème"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Priorité
                    </label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                    >
                      {priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description détaillée *
                  </label>
                  <Textarea
                    placeholder="Décrivez votre problème en détail..."
                    value={newTicket.description}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                    rows={6}
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Création...
                      </>
                    ) : (
                      'Créer le ticket'
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowNewTicket(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Recherche et filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Rechercher dans vos tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Tous les statuts</option>
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des tickets */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-slate-600">Chargement des tickets...</p>
          </div>
        </div>
      ) : filteredTickets.length > 0 ? (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Card 
              key={ticket.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                setSelectedTicket(ticket);
                loadTicketMessages(ticket.id);
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900">
                        {ticket.subject}
                      </h3>
                      <Badge className={getStatusInfo(ticket.status).color}>
                        {getStatusInfo(ticket.status).label}
                      </Badge>
                    </div>
                    
                    <p className="text-slate-600 text-sm mb-2 line-clamp-2">
                      {ticket.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        #{ticket.id}
                      </span>
                      <span className="flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {getCategoryInfo(ticket.category).label}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {getTimeAgo(ticket.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getPriorityInfo(ticket.priority).color}>
                      {getPriorityInfo(ticket.priority).label}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Aucun ticket trouvé
            </h3>
            <p className="text-slate-600 mb-4">
              Vous n'avez pas encore créé de ticket de support.
            </p>
            <Button onClick={() => setShowNewTicket(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer votre premier ticket
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ParticulierSupport;
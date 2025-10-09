import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TicketIcon, 
  Search, 
  Filter, 
  Send, 
  Plus, 
  Eye, 
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  User,
  Calendar,
  Tag,
  Paperclip,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';

const ParticulierTicketsSupport = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [priorityFilter, setPriorityFilter] = useState('toutes');
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState({});
  
  // État nouveau ticket
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'normale',
    attachments: []
  });

  useEffect(() => {
    if (user) {
      loadTickets();
    }
  }, [user]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      
      const { data: ticketsData, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          messages:support_ticket_messages(
            id,
            content,
            sender_type,
            created_at,
            sender:profiles(first_name, last_name, avatar_url)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTickets(ticketsData || []);
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement tickets:', error);
      toast.error('Erreur lors du chargement des tickets');
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.title.trim() || !newTicket.description.trim() || !newTicket.category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      // Créer le ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from('support_tickets')
        .insert([
          {
            title: newTicket.title,
            description: newTicket.description,
            category: newTicket.category,
            priority: newTicket.priority,
            status: 'nouveau',
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (ticketError) throw ticketError;

      // Créer le premier message
      const { error: messageError } = await supabase
        .from('support_ticket_messages')
        .insert([
          {
            ticket_id: ticketData.id,
            content: newTicket.description,
            sender_type: 'user',
            sender_id: user.id
          }
        ]);

      if (messageError) throw messageError;

      // Réinitialiser le formulaire
      setNewTicket({
        title: '',
        description: '',
        category: '',
        priority: 'normale',
        attachments: []
      });

      setShowNewTicketModal(false);
      toast.success('Ticket créé avec succès');
      
      // Recharger les tickets
      loadTickets();
    } catch (error) {
      console.error('Erreur création ticket:', error);
      toast.error('Erreur lors de la création du ticket');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      const { error } = await supabase
        .from('support_ticket_messages')
        .insert([
          {
            ticket_id: selectedTicket.id,
            content: newMessage.trim(),
            sender_type: 'user',
            sender_id: user.id
          }
        ]);

      if (error) throw error;

      setNewMessage('');
      toast.success('Message envoyé');
      
      // Recharger les tickets pour mettre à jour les messages
      loadTickets();
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    }
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDetails(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      nouveau: 'bg-blue-100 text-blue-800 border-blue-200',
      en_cours: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      en_attente: 'bg-orange-100 text-orange-800 border-orange-200',
      resolu: 'bg-green-100 text-green-800 border-green-200',
      ferme: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || colors.nouveau;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      basse: 'bg-green-100 text-green-800',
      normale: 'bg-blue-100 text-blue-800',
      haute: 'bg-orange-100 text-orange-800',
      critique: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.normale;
  };

  const getStatusIcon = (status) => {
    const icons = {
      nouveau: Clock,
      en_cours: RefreshCw,
      en_attente: AlertTriangle,
      resolu: CheckCircle,
      ferme: XCircle
    };
    const Icon = icons[status] || Clock;
    return <Icon className="h-4 w-4" />;
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'tous' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'toutes' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: tickets.length,
    nouveau: tickets.filter(t => t.status === 'nouveau').length,
    en_cours: tickets.filter(t => t.status === 'en_cours').length,
    resolu: tickets.filter(t => t.status === 'resolu').length
  };

  const toggleExpanded = (ticketId) => {
    setIsExpanded(prev => ({
      ...prev,
      [ticketId]: !prev[ticketId]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Chargement des tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <TicketIcon className="h-8 w-8 mr-3 text-blue-600" />
            Support & Tickets
          </h2>
          <p className="text-gray-600 mt-1">Gérez vos demandes de support et suivez leur progression</p>
        </div>
        
        <Button onClick={() => setShowNewTicketModal(true)} className="mt-4 lg:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Ticket
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <TicketIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nouveaux</p>
                <p className="text-2xl font-bold text-blue-600">{stats.nouveau}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.en_cours}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Résolus</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolu}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les statuts</SelectItem>
                  <SelectItem value="nouveau">Nouveau</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="resolu">Résolu</SelectItem>
                  <SelectItem value="ferme">Fermé</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toutes">Toutes priorités</SelectItem>
                  <SelectItem value="basse">Basse</SelectItem>
                  <SelectItem value="normale">Normale</SelectItem>
                  <SelectItem value="haute">Haute</SelectItem>
                  <SelectItem value="critique">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans vos tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des tickets */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <TicketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun ticket trouvé</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Aucun ticket ne correspond à votre recherche.' : 'Vous n\'avez pas encore créé de ticket de support.'}
              </p>
              <Button onClick={() => setShowNewTicketModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un ticket
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                        <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1">
                            {ticket.status === 'nouveau' ? 'Nouveau' :
                             ticket.status === 'en_cours' ? 'En cours' :
                             ticket.status === 'en_attente' ? 'En attente' :
                             ticket.status === 'resolu' ? 'Résolu' : 'Fermé'}
                          </span>
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority === 'basse' ? 'Basse' :
                           ticket.priority === 'normale' ? 'Normale' :
                           ticket.priority === 'haute' ? 'Haute' : 'Critique'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {isExpanded[ticket.id] ? ticket.description : 
                         `${ticket.description.substring(0, 150)}${ticket.description.length > 150 ? '...' : ''}`}
                      </p>
                      
                      {ticket.description.length > 150 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toggleExpanded(ticket.id)}
                          className="text-blue-600 hover:text-blue-700 p-0"
                        >
                          {isExpanded[ticket.id] ? (
                            <>
                              Voir moins <ChevronUp className="h-4 w-4 ml-1" />
                            </>
                          ) : (
                            <>
                              Voir plus <ChevronDown className="h-4 w-4 ml-1" />
                            </>
                          )}
                        </Button>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-1" />
                          {ticket.category === 'technique' ? 'Technique' :
                           ticket.category === 'compte' ? 'Compte' :
                           ticket.category === 'facturation' ? 'Facturation' :
                           ticket.category === 'information' ? 'Information' : ticket.category}
                        </div>
                        {ticket.messages && (
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {ticket.messages.length} message{ticket.messages.length > 1 ? 's' : ''}
                          </div>
                        )}
                        {ticket.assigned_to && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {ticket.assigned_to}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTicket(ticket)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal nouveau ticket */}
      <Dialog open={showNewTicketModal} onOpenChange={setShowNewTicketModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer un nouveau ticket</DialogTitle>
            <DialogDescription>
              Décrivez votre problème ou votre demande en détail
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre du ticket *</Label>
              <Input
                id="title"
                value={newTicket.title}
                onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Résumez votre problème en quelques mots"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Catégorie *</Label>
              <Select value={newTicket.category} onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technique">Problème technique</SelectItem>
                  <SelectItem value="compte">Compte utilisateur</SelectItem>
                  <SelectItem value="facturation">Facturation</SelectItem>
                  <SelectItem value="information">Demande d'information</SelectItem>
                  <SelectItem value="fonctionnalite">Nouvelle fonctionnalité</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="priority">Priorité</Label>
              <Select value={newTicket.priority} onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basse">Basse</SelectItem>
                  <SelectItem value="normale">Normale</SelectItem>
                  <SelectItem value="haute">Haute</SelectItem>
                  <SelectItem value="critique">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Description détaillée *</Label>
              <Textarea
                id="description"
                value={newTicket.description}
                onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez votre problème en détail : quand cela s'est-il produit, que faisiez-vous, quels messages d'erreur avez-vous vus, etc."
                rows={6}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTicketModal(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateTicket}>
              Créer le ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal détails ticket */}
      <Dialog open={showTicketDetails} onOpenChange={setShowTicketDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          {selectedTicket && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-xl">{selectedTicket.title}</DialogTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={`text-xs ${getStatusColor(selectedTicket.status)}`}>
                        {getStatusIcon(selectedTicket.status)}
                        <span className="ml-1">
                          {selectedTicket.status === 'nouveau' ? 'Nouveau' :
                           selectedTicket.status === 'en_cours' ? 'En cours' :
                           selectedTicket.status === 'en_attente' ? 'En attente' :
                           selectedTicket.status === 'resolu' ? 'Résolu' : 'Fermé'}
                        </span>
                      </Badge>
                      <Badge className={`text-xs ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority === 'basse' ? 'Basse' :
                         selectedTicket.priority === 'normale' ? 'Normale' :
                         selectedTicket.priority === 'haute' ? 'Haute' : 'Critique'}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        #{selectedTicket.id} • {new Date(selectedTicket.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowTicketDetails(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              
              <ScrollArea className="flex-1 max-h-96">
                <div className="space-y-4">
                  {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                    selectedTicket.messages.map((message, index) => (
                      <div key={message.id} className="flex space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.sender?.avatar_url} />
                          <AvatarFallback className={message.sender_type === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}>
                            {message.sender_type === 'user' ? 'U' : 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium">
                              {message.sender_type === 'user' ? 'Vous' : 'Support'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(message.created_at).toLocaleString('fr-FR')}
                            </span>
                          </div>
                          <div className={`p-3 rounded-lg ${message.sender_type === 'user' ? 'bg-blue-50' : 'bg-green-50'}`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Aucun message dans ce ticket</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {selectedTicket.status !== 'ferme' && (
                <>
                  <Separator />
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Tapez votre message..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParticulierTicketsSupport;
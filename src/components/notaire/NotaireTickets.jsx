import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Search, Filter, Clock, CheckCircle, XCircle, AlertCircle, Send, Paperclip, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/config/supabase';

/**
 * NotaireTickets - Système de tickets support pour notaires
 * Permet de créer, suivre et gérer les demandes de support
 */
export default function NotaireTickets() {
  const { user } = useAuth();
  
  // États
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  // Formulaire nouveau ticket
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'technical',
    priority: 'medium',
    description: ''
  });
  
  // Message de réponse
  const [replyMessage, setReplyMessage] = useState('');

  /**
   * Charger les tickets depuis Supabase
   */
  useEffect(() => {
    if (user?.id) {
      loadTickets();
    }
  }, [user]);

  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
      setFilteredTickets(data || []);
    } catch (error) {
      console.error('Erreur chargement tickets:', error);
      window.safeGlobalToast?.({
        title: "Erreur",
        description: "Impossible de charger les tickets",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Filtrer les tickets
   */
  useEffect(() => {
    let filtered = [...tickets];

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.ticket_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  }, [searchTerm, statusFilter, priorityFilter, tickets]);

  /**
   * Créer un nouveau ticket
   */
  const handleCreateTicket = async () => {
    if (!newTicket.subject || !newTicket.description) {
      window.safeGlobalToast?.({
        title: "Champs manquants",
        description: "Veuillez remplir le sujet et la description",
        variant: "destructive"
      });
      return;
    }

    try {
      const ticketNumber = `TKT-${Date.now().toString().slice(-8)}`;
      
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          ticket_number: ticketNumber,
          subject: newTicket.subject,
          category: newTicket.category,
          priority: newTicket.priority,
          description: newTicket.description,
          status: 'open',
          messages: [
            {
              from: 'user',
              message: newTicket.description,
              timestamp: new Date().toISOString()
            }
          ]
        })
        .select()
        .single();

      if (error) throw error;

      setTickets(prev => [data, ...prev]);
      setShowCreateDialog(false);
      setNewTicket({ subject: '', category: 'technical', priority: 'medium', description: '' });
      
      window.safeGlobalToast?.({
        title: "Ticket créé",
        description: `Votre ticket ${ticketNumber} a été créé avec succès`,
        variant: "success"
      });
    } catch (error) {
      console.error('Erreur création ticket:', error);
      window.safeGlobalToast?.({
        title: "Erreur",
        description: "Impossible de créer le ticket",
        variant: "destructive"
      });
    }
  };

  /**
   * Envoyer une réponse
   */
  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    try {
      const updatedMessages = [
        ...(selectedTicket.messages || []),
        {
          from: 'user',
          message: replyMessage,
          timestamp: new Date().toISOString()
        }
      ];

      const { error } = await supabase
        .from('support_tickets')
        .update({ messages: updatedMessages })
        .eq('id', selectedTicket.id);

      if (error) throw error;

      setSelectedTicket(prev => ({ ...prev, messages: updatedMessages }));
      setReplyMessage('');
      
      window.safeGlobalToast?.({
        title: "Message envoyé",
        description: "Votre message a été ajouté au ticket",
        variant: "success"
      });
    } catch (error) {
      console.error('Erreur envoi message:', error);
    }
  };

  /**
   * Configurations d'affichage
   */
  const getStatusConfig = (status) => {
    const configs = {
      open: { label: 'Ouvert', color: 'bg-blue-500', icon: Clock, textColor: 'text-blue-700' },
      in_progress: { label: 'En cours', color: 'bg-yellow-500', icon: AlertCircle, textColor: 'text-yellow-700' },
      resolved: { label: 'Résolu', color: 'bg-green-500', icon: CheckCircle, textColor: 'text-green-700' },
      closed: { label: 'Fermé', color: 'bg-gray-500', icon: XCircle, textColor: 'text-gray-700' }
    };
    return configs[status] || configs.open;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: <Badge className="bg-gray-100 text-gray-700">Basse</Badge>,
      medium: <Badge className="bg-blue-100 text-blue-700">Normale</Badge>,
      high: <Badge className="bg-orange-100 text-orange-700">Haute</Badge>,
      urgent: <Badge className="bg-red-100 text-red-700">Urgente</Badge>
    };
    return badges[priority] || badges.medium;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      technical: 'Technique',
      billing: 'Facturation',
      feature: 'Fonctionnalité',
      bug: 'Bug',
      other: 'Autre'
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            Support & Tickets
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Créez et suivez vos demandes de support
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau ticket
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{tickets.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ouverts</p>
                <p className="text-2xl font-bold text-blue-600">
                  {tickets.filter(t => t.status === 'open').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {tickets.filter(t => t.status === 'in_progress').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Résolus</p>
                <p className="text-2xl font-bold text-green-600">
                  {tickets.filter(t => t.status === 'resolved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">Tous les statuts</option>
              <option value="open">Ouvert</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolu</option>
              <option value="closed">Fermé</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">Toutes les priorités</option>
              <option value="low">Basse</option>
              <option value="medium">Normale</option>
              <option value="high">Haute</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des tickets */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredTickets.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun ticket</h3>
          <p className="text-gray-500 mb-4">Créez votre premier ticket de support</p>
          <Button onClick={() => setShowCreateDialog(true)}>Créer un ticket</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTickets.map((ticket, index) => {
            const statusConfig = getStatusConfig(ticket.status);
            const StatusIcon = statusConfig.icon;

            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setShowDetailsDialog(true);
                      }}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`p-3 rounded-lg ${statusConfig.color} bg-opacity-10`}>
                          <StatusIcon className={`h-6 w-6 ${statusConfig.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {ticket.ticket_number}
                            </h3>
                            <Badge variant="outline">{getCategoryLabel(ticket.category)}</Badge>
                            {getPriorityBadge(ticket.priority)}
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-1">{ticket.subject}</p>
                          <p className="text-sm text-gray-500">
                            Créé le {new Date(ticket.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={statusConfig.textColor}>{statusConfig.label}</Badge>
                        {ticket.messages && (
                          <p className="text-sm text-gray-500 mt-2">
                            {ticket.messages.length} message(s)
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Dialog Créer ticket */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer un nouveau ticket</DialogTitle>
            <DialogDescription>
              Décrivez votre problème ou votre demande en détail
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Sujet *</label>
              <Input
                placeholder="Résumé du problème..."
                value={newTicket.subject}
                onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Catégorie</label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="technical">Technique</option>
                  <option value="billing">Facturation</option>
                  <option value="feature">Fonctionnalité</option>
                  <option value="bug">Bug</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Priorité</label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="low">Basse</option>
                  <option value="medium">Normale</option>
                  <option value="high">Haute</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description *</label>
              <Textarea
                placeholder="Décrivez votre problème en détail..."
                value={newTicket.description}
                onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Annuler</Button>
            <Button onClick={handleCreateTicket}>Créer le ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Détails ticket */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedTicket?.ticket_number}</DialogTitle>
            <DialogDescription>{selectedTicket?.subject}</DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                {getPriorityBadge(selectedTicket.priority)}
                <Badge>{getCategoryLabel(selectedTicket.category)}</Badge>
                <Badge className={getStatusConfig(selectedTicket.status).textColor}>
                  {getStatusConfig(selectedTicket.status).label}
                </Badge>
              </div>
              
              <ScrollArea className="h-[400px] border rounded-lg p-4">
                <div className="space-y-4">
                  {selectedTicket.messages?.map((msg, idx) => (
                    <div key={idx} className={`p-3 rounded-lg ${msg.from === 'user' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{msg.from === 'user' ? 'Vous' : 'Support'}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {selectedTicket.status !== 'closed' && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Votre message..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                  />
                  <Button onClick={handleSendReply}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

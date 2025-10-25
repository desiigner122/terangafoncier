import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LifeBuoy,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Bug,
  HelpCircle,
  FileQuestion,
  Inbox,
  Send,
  Paperclip
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabaseClient';

const ParticulierTickets = () => {
  const { user } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newTicketOpen, setNewTicketOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadTickets();
    }
  }, [user]);

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
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      open: { label: 'Ouvert', color: 'bg-blue-100 text-blue-800', icon: Inbox },
      in_progress: { label: 'En cours', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      resolved: { label: 'Résolu', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      closed: { label: 'Fermé', color: 'bg-gray-100 text-gray-800', icon: CheckCircle }
    };
    const cfg = config[status] || config.open;
    const Icon = cfg.icon;
    return (
      <Badge className={cfg.color}>
        <Icon className="h-3 w-3 mr-1" />
        {cfg.label}
      </Badge>
    );
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support & Assistance</h1>
          <p className="text-gray-600 mt-2">Créez un ticket ou suivez vos demandes d'assistance</p>
        </div>
        <Dialog open={newTicketOpen} onOpenChange={setNewTicketOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un Ticket de Support</DialogTitle>
              <DialogDescription>Décrivez votre problème ou votre question</DialogDescription>
            </DialogHeader>
            <NewTicketForm user={user} onSuccess={() => { setNewTicketOpen(false); loadTickets(); }} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Tickets</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
          <div className="text-sm text-gray-600">Ouverts</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-2xl font-bold text-yellow-600">{stats.in_progress}</div>
          <div className="text-sm text-gray-600">En cours</div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          <div className="text-sm text-gray-600">Résolus</div>
        </CardContent></Card>
      </div>

      {/* Liste tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Mes Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <LifeBuoy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun ticket</h3>
              <p className="text-gray-600">Vous n'avez pas encore créé de ticket de support</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map(ticket => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusBadge(ticket.status)}
                          <span className="text-xs text-gray-500">#{ticket.id.substring(0, 8)}</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{ticket.subject}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{ticket.description}</p>
                        <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                          <span>{new Date(ticket.created_at).toLocaleDateString('fr-FR')}</span>
                          <span className="px-2 py-1 bg-gray-100 rounded">{ticket.category}</span>
                          {ticket.priority && (
                            <span className={`px-2 py-1 rounded ${
                              ticket.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              ticket.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100'
                            }`}>
                              {ticket.priority}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Voir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const NewTicketForm = ({ user, onSuccess }) => {
  const [formData, setFormData] = useState({
    category: '',
    priority: 'normal',
    subject: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { error } = await supabase.from('support_tickets').insert({
        user_id: user.id,
        user_type: 'particulier',
        ...formData
      });

      if (error) throw error;

      window.safeGlobalToast({ description: 'Ticket créé avec succès', variant: 'success' });
      onSuccess();
    } catch (error) {
      console.error('Erreur création ticket:', error);
      window.safeGlobalToast({ description: 'Erreur lors de la création du ticket', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Catégorie</Label>
        <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
          <SelectTrigger><SelectValue placeholder="Sélectionnez" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="question">Question</SelectItem>
            <SelectItem value="bug">Bug / Problème technique</SelectItem>
            <SelectItem value="demande">Demande</SelectItem>
            <SelectItem value="reclamation">Réclamation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Priorité</Label>
        <Select value={formData.priority} onValueChange={(v) => setFormData({...formData, priority: v})}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Basse</SelectItem>
            <SelectItem value="normal">Normale</SelectItem>
            <SelectItem value="high">Haute</SelectItem>
            <SelectItem value="urgent">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Sujet</Label>
        <Input
          required
          value={formData.subject}
          onChange={(e) => setFormData({...formData, subject: e.target.value})}
          placeholder="Décrivez brièvement votre demande"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Décrivez votre problème ou votre question en détail"
          rows={5}
        />
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Création...' : 'Créer le Ticket'}
      </Button>
    </form>
  );
};

export default ParticulierTickets;

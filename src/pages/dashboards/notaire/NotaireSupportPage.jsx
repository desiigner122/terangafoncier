import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Ticket, 
  Plus, 
  Search, 
  Filter, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Send,
  Paperclip,
  User,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import NotaireSupabaseService from '@/services/NotaireSupabaseService';
import supabase from '@/lib/supabaseClient';

const NotaireSupportPage = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // ✅ DONNÉES RÉELLES - Chargement depuis Supabase
  useEffect(() => {
    if (user) {
      loadTickets();
    }
  }, [user]);

  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const result = await NotaireSupabaseService.getSupportTickets(user.id);
      if (result.success) {
        setTickets(result.data || []);
      } else {
        console.error('Erreur lors du chargement:', result.error);
        setTickets([]);
      }
    } catch (error) {
      console.error('Erreur chargement tickets:', error);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (ticket) => {
    try {
      if (!ticket) return;
      const { data, error } = await supabase
        .from('ticket_responses')
        .select('*')
        .eq('ticket_id', ticket.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      setMessages(data || []);
    } catch (e) {
      console.error('Erreur chargement messages:', e);
      setMessages([]);
    }
  };

  const statusConfig = {
    open: { label: 'Ouvert', color: 'blue', icon: AlertCircle },
    in_progress: { label: 'En cours', color: 'yellow', icon: Clock },
    resolved: { label: 'Résolu', color: 'green', icon: CheckCircle2 },
    closed: { label: 'Fermé', color: 'gray', icon: XCircle }
  };

  const priorityConfig = {
    low: { label: 'Basse', color: 'gray' },
    medium: { label: 'Moyenne', color: 'yellow' },
    high: { label: 'Haute', color: 'red' }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesSearch = (ticket.subject || ticket.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (ticket.ticket_number || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  useEffect(() => {
    if (selectedTicket) {
      loadMessages(selectedTicket);
    } else {
      setMessages([]);
    }
  }, [selectedTicket]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    try {
      const result = await NotaireSupabaseService.respondToTicket(selectedTicket.id, user.id, newMessage, false);
      if (result.success) {
        setNewMessage('');
        await loadMessages(selectedTicket);
        await loadTickets();
      }
    } catch (e) {
      console.error('Erreur envoi message:', e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Ticket className="text-blue-600" size={32} />
              Support Client
            </h1>
            <p className="text-slate-600 mt-1">
              Gérez vos tickets et demandes de support
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewTicketModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            Nouveau Ticket
          </motion.button>
        </div>
      </motion.div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Tickets Ouverts', value: tickets.filter(t => t.status === 'open').length, color: 'blue', icon: AlertCircle },
          { label: 'En Cours', value: tickets.filter(t => t.status === 'in_progress').length, color: 'yellow', icon: Clock },
          { label: 'Résolus', value: tickets.filter(t => t.status === 'resolved').length, color: 'green', icon: CheckCircle2 },
          { label: 'Total', value: tickets.length, color: 'indigo', icon: Ticket }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-md border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
              </div>
              <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                <stat.icon className={`text-${stat.color}-600`} size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filtres et Recherche */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl p-4 shadow-md border border-slate-200 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un ticket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status === 'all' ? 'Tous' : statusConfig[status]?.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Liste des tickets et détails */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des tickets */}
        <div className="lg:col-span-1 space-y-4">
            {filteredTickets.map((ticket, index) => {
            const StatusIcon = statusConfig[ticket.status].icon;
            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedTicket(ticket)}
                className={`bg-white rounded-xl p-4 shadow-md border-2 cursor-pointer transition-all hover:shadow-lg ${
                  selectedTicket?.id === ticket.id
                    ? 'border-blue-600'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-1">{ticket.subject || ticket.title}</h3>
                    <p className="text-sm text-slate-600">{ticket.ticket_number || ticket.id}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${priorityConfig[ticket.priority].color}-100 text-${priorityConfig[ticket.priority].color}-700`}>
                    {priorityConfig[ticket.priority].label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                  <User size={14} />
                  <span>{ticket.user_id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-${statusConfig[ticket.status].color}-100 text-${statusConfig[ticket.status].color}-700`}>
                    <StatusIcon size={14} />
                    {statusConfig[ticket.status].label}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <MessageSquare size={14} />
                    {ticket.messages_count?.[0]?.count ?? ticket.messages_count ?? 0}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Détails du ticket */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden"
            >
              {/* En-tête du ticket */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedTicket.subject || selectedTicket.title}</h2>
                    <p className="text-blue-100">{selectedTicket.ticket_number || selectedTicket.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20`}>
                    {statusConfig[selectedTicket.status].label}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-blue-100">Utilisateur</p>
                    <p className="font-semibold">{selectedTicket.user_id}</p>
                  </div>
                  <div>
                    <p className="text-blue-100">Catégorie</p>
                    <p className="font-semibold">{selectedTicket.category}</p>
                  </div>
                  <div>
                    <p className="text-blue-100">Priorité</p>
                    <p className="font-semibold">{priorityConfig[selectedTicket.priority].label}</p>
                  </div>
                  <div>
                    <p className="text-blue-100">Assigné à</p>
                    <p className="font-semibold">{selectedTicket.assigned_to || 'Non assigné'}</p>
                  </div>
                </div>
              </div>

              {/* Timeline des messages */}
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.is_staff ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.is_staff ? 'bg-blue-100' : 'bg-slate-100'} rounded-lg p-4`}>
                        <div className="flex items-center gap-2 mb-2">
                          <User size={16} className="text-slate-600" />
                          <span className="font-semibold text-sm text-slate-800">{message.is_staff ? 'Support' : 'Vous'}</span>
                          <span className="text-xs text-slate-500">
                            {new Date(message.created_at).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-slate-700">{message.message}</p>
                        {Array.isArray(message.attachments) && message.attachments.length > 0 && (
                          <div className="mt-2 flex items-center gap-2">
                            <Paperclip size={14} className="text-slate-500" />
                            {message.attachments.map((file, idx) => (
                              <span key={idx} className="text-xs text-blue-600 hover:underline cursor-pointer">
                                {file}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zone de réponse */}
              <div className="border-t border-slate-200 p-4 bg-slate-50">
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                    <Paperclip size={20} className="text-slate-600" />
                  </button>
                  <input
                    type="text"
                    placeholder="Tapez votre réponse..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Send size={20} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-12 text-center">
              <Ticket size={64} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                Sélectionnez un ticket
              </h3>
              <p className="text-slate-500">
                Cliquez sur un ticket pour voir les détails et la conversation
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Nouveau Ticket */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Nouveau Ticket</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Titre</label>
                <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Technique</option>
                  <option>Facturation</option>
                  <option>Formation</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priorité</label>
                <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Basse</option>
                  <option>Moyenne</option>
                  <option>Haute</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea rows="4" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Créer le Ticket
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default NotaireSupportPage;

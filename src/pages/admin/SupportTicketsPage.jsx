import React, { useState, useEffect } from 'react';
import { FaTicketAlt, FaReply, FaClock, FaCheckCircle, FaExclamationTriangle, FaUser, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';

const SupportTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [newStatus, setNewStatus] = useState('in_progress');
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });

  // Charger les tickets
  useEffect(() => {
    fetchTickets();
  }, [currentPage, filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      
      // Build Supabase query
      let query = supabase
        .from('support_tickets')
        .select(`
          *,
          user:profiles!user_id (
            id,
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }

      // Pagination
      const from = (currentPage - 1) * 20;
      const to = from + 19;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setTickets(data || []);
      setTotalPages(Math.ceil((count || 0) / 20));
      
      console.log('✅ Support tickets loaded from Supabase:', data?.length);
      
    } catch (error) {
      console.error('❌ Error loading support tickets:', error);
      toast.error('Erreur lors du chargement des tickets');
    } finally {
      setLoading(false);
    }
  };

  // Répondre à un ticket
  const handleResponse = async () => {
    if (!selectedTicket || !responseMessage.trim()) {
      toast.error('Message de réponse requis');
      return;
    }

    try {
      // Update ticket status and add response using Supabase
      const { error } = await supabase
        .from('support_tickets')
        .update({
          status: newStatus,
          internal_note: internalNote,
          admin_response: responseMessage,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedTicket.id);

      if (error) throw error;

      toast.success('Réponse envoyée avec succès');
      setShowResponseModal(false);
      setSelectedTicket(null);
      setResponseMessage('');
      setInternalNote('');
      fetchTickets(); // Recharger la liste
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'envoi de la réponse');
    }
  };

  // Ouvrir le modal de réponse
  const openResponseModal = (ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status === 'open' ? 'in_progress' : ticket.status);
    setShowResponseModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'open': 'bg-blue-100 text-blue-800',
      'in_progress': 'bg-yellow-100 text-yellow-800',
      'resolved': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800'
    };

    return badges[status] || badges.open;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };

    return badges[priority] || badges.medium;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <FaTicketAlt className="w-4 h-4" />;
      case 'in_progress':
        return <FaClock className="w-4 h-4" />;
      case 'resolved':
        return <FaCheckCircle className="w-4 h-4" />;
      case 'closed':
        return <FaCheckCircle className="w-4 h-4" />;
      default:
        return <FaTicketAlt className="w-4 h-4" />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <FaExclamationTriangle className="w-4 h-4" />;
      case 'medium':
        return <FaClock className="w-4 h-4" />;
      case 'low':
        return <FaCheckCircle className="w-4 h-4" />;
      default:
        return <FaClock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tickets Support
            </h1>
            <p className="text-gray-600">
              Gérez les demandes d'assistance des utilisateurs
            </p>
          </div>

          {/* Filtres */}
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="open">Ouvert</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolu</option>
              <option value="closed">Fermé</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les priorités</option>
              <option value="high">Élevée</option>
              <option value="medium">Moyenne</option>
              <option value="low">Faible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ouverts</p>
              <p className="text-2xl font-bold text-blue-600">
                {tickets.filter(t => t.status === 'open').length}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaTicketAlt className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-yellow-600">
                {tickets.filter(t => t.status === 'in_progress').length}
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaClock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Résolus</p>
              <p className="text-2xl font-bold text-green-600">
                {tickets.filter(t => t.status === 'resolved').length}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaCheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Priorité Élevée</p>
              <p className="text-2xl font-bold text-red-600">
                {tickets.filter(t => t.priority === 'high').length}
              </p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FaExclamationTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des tickets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Tickets Support
          </h3>
        </div>

        {tickets.length === 0 ? (
          <div className="p-8 text-center">
            <FaTicketAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun ticket trouvé
            </h3>
            <p className="text-gray-600">
              Aucun ticket ne correspond aux filtres sélectionnés.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <h4 className="text-lg font-semibold text-gray-900 mr-3">
                        #{ticket.id} - {ticket.subject}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(ticket.status)} mr-2`}>
                        {getStatusIcon(ticket.status)}
                        <span className="ml-1 capitalize">{ticket.status.replace('_', ' ')}</span>
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(ticket.priority)}`}>
                        {getPriorityIcon(ticket.priority)}
                        <span className="ml-1 capitalize">{ticket.priority}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaUser className="w-4 h-4 mr-2" />
                        {ticket.user_first_name} {ticket.user_last_name}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaCalendarAlt className="w-4 h-4 mr-2" />
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Catégorie:</strong> {ticket.category}
                      </div>
                      {ticket.assigned_admin_name && (
                        <div className="text-sm text-gray-600">
                          <strong>Assigné à:</strong> {ticket.assigned_admin_name}
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        <strong>Email:</strong> {ticket.user_email}
                      </div>
                      {ticket.last_response_at && (
                        <div className="text-sm text-gray-600">
                          <strong>Dernière réponse:</strong> {new Date(ticket.last_response_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {ticket.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-6">
                    <button
                      onClick={() => openResponseModal(ticket)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaReply className="w-4 h-4 mr-2" />
                      Répondre
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              
              <span className="text-sm text-gray-700">
                Page {currentPage} sur {totalPages}
              </span>
              
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de réponse */}
      {showResponseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Répondre au ticket #{selectedTicket?.id}
            </h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{selectedTicket?.subject}</h4>
              <p className="text-sm text-gray-600 mb-2">
                De: {selectedTicket?.user_first_name} {selectedTicket?.user_last_name} ({selectedTicket?.user_email})
              </p>
              <p className="text-sm text-gray-700">{selectedTicket?.description}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau statut
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="in_progress">En cours</option>
                <option value="resolved">Résolu</option>
                <option value="closed">Fermé</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Réponse <span className="text-red-500">*</span>
              </label>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Votre réponse à l'utilisateur..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note interne (optionnel)
              </label>
              <textarea
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Note interne pour l'équipe support..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setSelectedTicket(null);
                  setResponseMessage('');
                  setInternalNote('');
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleResponse}
                disabled={!responseMessage.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Envoyer la réponse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicketsPage;
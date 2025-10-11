import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

/**
 * Hook personnalisé pour la gestion des tickets de support
 */
export const useAdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all', // all, open, in_progress, resolved, closed
    priority: 'all', // all, urgent, high, normal, low
    searchTerm: ''
  });

  // Récupérer tous les tickets
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch support tickets without FK join (FK constraint doesn't exist)
      let query = supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      // Filtres
      if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }

      const { data: tickets, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Fetch profiles for assigned_to lookup
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nom, email, full_name');

      // Create lookup map
      const profilesMap = (profiles || []).reduce((map, p) => {
        map[p.id] = p;
        return map;
      }, {});

      // Attach assigned_admin data manually
      const enrichedTickets = (tickets || []).map(ticket => ({
        ...ticket,
        assigned_admin: ticket.assigned_to ? profilesMap[ticket.assigned_to] : null
      }));

      // Recherche
      let filteredData = enrichedTickets;
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredData = filteredData.filter(ticket => 
          ticket.subject?.toLowerCase().includes(searchLower) ||
          ticket.message?.toLowerCase().includes(searchLower) ||
          ticket.user?.name?.toLowerCase().includes(searchLower)
        );
      }

      setTickets(filteredData);
    } catch (err) {
      console.error('Erreur tickets:', err);
      setError(err.message);
      toast.error('Erreur lors du chargement des tickets');
    } finally {
      setLoading(false);
    }
  };

  // Répondre à un ticket
  const replyToTicket = async (ticketId, message) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      await supabase.from('ticket_responses').insert({
        ticket_id: ticketId,
        author_id: currentUser.id,
        message: message,
        is_admin: true
      });

      await supabase.from('support_tickets').update({ 
        status: 'in_progress',
        updated_at: new Date().toISOString()
      }).eq('id', ticketId);

      await supabase.from('admin_actions').insert({
        admin_id: currentUser.id,
        action_type: 'ticket_replied',
        target_id: ticketId,
        target_type: 'ticket'
      });

      toast.success('Réponse envoyée');
      await fetchTickets();
    } catch (err) {
      console.error('Erreur réponse:', err);
      toast.error('Erreur lors de l\'envoi de la réponse');
    }
  };

  // Changer le statut
  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      await supabase.from('support_tickets').update({ 
        status: newStatus,
        updated_at: new Date().toISOString(),
        closed_at: newStatus === 'closed' ? new Date().toISOString() : null
      }).eq('id', ticketId);

      await supabase.from('admin_actions').insert({
        admin_id: currentUser.id,
        action_type: 'ticket_status_changed',
        target_id: ticketId,
        target_type: 'ticket',
        details: { new_status: newStatus }
      });

      toast.success(`Statut changé: ${newStatus}`);
      await fetchTickets();
    } catch (err) {
      console.error('Erreur statut:', err);
      toast.error('Erreur lors du changement de statut');
    }
  };

  // Assigner à un admin
  const assignTicket = async (ticketId, adminId) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      await supabase.from('support_tickets').update({ 
        assigned_to: adminId,
        updated_at: new Date().toISOString()
      }).eq('id', ticketId);

      await supabase.from('admin_actions').insert({
        admin_id: currentUser.id,
        action_type: 'ticket_assigned',
        target_id: ticketId,
        target_type: 'ticket',
        details: { assigned_to: adminId }
      });

      toast.success('Ticket assigné');
      await fetchTickets();
    } catch (err) {
      console.error('Erreur assignation:', err);
      toast.error('Erreur lors de l\'assignation');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  return {
    tickets,
    loading,
    error,
    filters,
    setFilters,
    replyToTicket,
    updateTicketStatus,
    assignTicket,
    refetch: fetchTickets
  };
};

export default useAdminTickets;

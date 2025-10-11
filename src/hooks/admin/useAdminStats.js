import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

/**
 * Hook personnalisé pour les statistiques du dashboard admin
 * Récupère toutes les statistiques en temps réel depuis Supabase
 */
export const useAdminStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    newUsersToday: 0,
    newUsersWeek: 0,
    newUsersMonth: 0,
    
    totalProperties: 0,
    pendingProperties: 0,
    verifiedProperties: 0,
    rejectedProperties: 0,
    reportedProperties: 0,
    
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    urgentTickets: 0,
    
    totalReports: 0,
    pendingReports: 0,
    reviewingReports: 0,
    resolvedReports: 0,
    
    unreadNotifications: 0,
    totalActions: 0,
    
    usersByRole: {
      admin: 0,
      vendeur: 0,
      acheteur: 0,
      notaire: 0,
      banque: 0,
      agent_foncier: 0
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer toutes les statistiques
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Dates pour les filtres
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      // 1. Statistiques utilisateurs
      const { data: allUsers, error: usersError } = await supabase
        .from('profiles')
        .select('id, role, created_at, suspended_at');

      if (usersError) throw usersError;

      // 2. Statistiques propriétés
      const { data: allProperties, error: propertiesError } = await supabase
        .from('properties')
        .select('id, verification_status, reported, created_at');

      if (propertiesError) throw propertiesError;

      // 3. Statistiques tickets
      const { data: allTickets, error: ticketsError } = await supabase
        .from('support_tickets')
        .select('id, status, priority');

      if (ticketsError) throw ticketsError;

      // 4. Statistiques signalements
      const { data: allReports, error: reportsError } = await supabase
        .from('property_reports')
        .select('id, status');

      if (reportsError) throw reportsError;

      // 5. Notifications non lues (pour l'admin connecté)
      const { data: { user } } = await supabase.auth.getUser();
      let unreadCount = 0;
      
      if (user) {
        const { count, error: notifError } = await supabase
          .from('admin_notifications')
          .select('id', { count: 'exact' })
          .limit(0)
          .eq('admin_id', user.id)
          .eq('read', false);

        if (!notifError) unreadCount = count || 0;
      }

      // 6. Total actions admin
      const { count: actionsCount, error: actionsError } = await supabase
        .from('admin_actions')
  .select('id', { count: 'exact' })
  .limit(0);

      // Calculer les statistiques
      const calculatedStats = {
        // Utilisateurs
        totalUsers: allUsers?.length || 0,
        activeUsers: allUsers?.filter(u => !u.suspended_at).length || 0,
        suspendedUsers: allUsers?.filter(u => u.suspended_at).length || 0,
        newUsersToday: allUsers?.filter(u => new Date(u.created_at) >= today).length || 0,
        newUsersWeek: allUsers?.filter(u => new Date(u.created_at) >= weekAgo).length || 0,
        newUsersMonth: allUsers?.filter(u => new Date(u.created_at) >= monthAgo).length || 0,
        
        // Propriétés
        totalProperties: allProperties?.length || 0,
        pendingProperties: allProperties?.filter(p => p.verification_status === 'pending').length || 0,
        verifiedProperties: allProperties?.filter(p => p.verification_status === 'verified').length || 0,
        rejectedProperties: allProperties?.filter(p => p.verification_status === 'rejected').length || 0,
        reportedProperties: allProperties?.filter(p => p.reported === true).length || 0,
        
        // Tickets
        totalTickets: allTickets?.length || 0,
        openTickets: allTickets?.filter(t => t.status === 'open').length || 0,
        inProgressTickets: allTickets?.filter(t => t.status === 'in_progress').length || 0,
        resolvedTickets: allTickets?.filter(t => t.status === 'resolved' || t.status === 'closed').length || 0,
        urgentTickets: allTickets?.filter(t => t.priority === 'urgent').length || 0,
        
        // Signalements
        totalReports: allReports?.length || 0,
        pendingReports: allReports?.filter(r => r.status === 'pending').length || 0,
        reviewingReports: allReports?.filter(r => r.status === 'reviewing').length || 0,
        resolvedReports: allReports?.filter(r => r.status === 'resolved' || r.status === 'dismissed').length || 0,
        
        // Autres
        unreadNotifications: unreadCount,
        totalActions: actionsCount || 0,
        
        // Par rôle
        usersByRole: {
          admin: allUsers?.filter(u => u.role === 'admin').length || 0,
          vendeur: allUsers?.filter(u => u.role === 'vendeur').length || 0,
          acheteur: allUsers?.filter(u => u.role === 'acheteur').length || 0,
          notaire: allUsers?.filter(u => u.role === 'notaire').length || 0,
          banque: allUsers?.filter(u => u.role === 'banque').length || 0,
          agent_foncier: allUsers?.filter(u => u.role === 'agent_foncier').length || 0
        }
      };

      setStats(calculatedStats);
    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Charger les stats au montage du composant
  useEffect(() => {
    fetchStats();

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};

export default useAdminStats;

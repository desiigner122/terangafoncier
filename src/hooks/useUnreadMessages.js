/**
 * useUnreadMessages Hook - Phase 5
 * Gère le compteur de messages non lus avec realtime
 * @author Teranga Foncier Team
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

/**
 * Hook pour gérer les messages non lus d'un dossier
 * @param {string} caseId - ID du dossier
 * @param {string} userId - ID de l'utilisateur actuel
 * @returns {Object} { unreadCount, markAsRead, loading, error }
 */
export const useUnreadMessages = (caseId, userId) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Charger le compteur de messages non lus
   */
  const loadUnreadCount = useCallback(async () => {
    if (!caseId || !userId) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: rpcError } = await supabase.rpc('count_unread_messages', {
        p_case_id: caseId,
        p_user_id: userId
      });

      if (rpcError) throw rpcError;

      setUnreadCount(data || 0);
      console.log('📬 Messages non lus chargés:', data);
    } catch (err) {
      console.error('❌ Erreur chargement messages non lus:', err);
      setError(err);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [caseId, userId]);

  /**
   * Marquer tous les messages comme lus
   */
  const markAsRead = useCallback(async () => {
    if (!caseId || !userId) return;

    try {
      const { data, error: rpcError } = await supabase.rpc('mark_messages_as_read', {
        p_case_id: caseId,
        p_user_id: userId
      });

      if (rpcError) throw rpcError;

      console.log('✅ Messages marqués comme lus:', data, 'messages');
      setUnreadCount(0); // Reset count immédiatement
    } catch (err) {
      console.error('❌ Erreur marquage messages lus:', err);
      setError(err);
    }
  }, [caseId, userId]);

  /**
   * Charger count au mount et quand caseId/userId changent
   */
  useEffect(() => {
    loadUnreadCount();
  }, [loadUnreadCount]);

  /**
   * Realtime: Écouter nouveaux messages
   */
  useEffect(() => {
    if (!caseId) return;

    const channel = supabase
      .channel(`unread-messages-${caseId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'purchase_case_messages',
          filter: `case_id=eq.${caseId}`
        },
        (payload) => {
          console.log('🔔 Nouveau message détecté:', payload);
          
          // Si le message n'est pas envoyé par l'utilisateur actuel, incrémenter
          if (payload.new.sent_by !== userId) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'purchase_case_messages',
          filter: `case_id=eq.${caseId}`
        },
        (payload) => {
          // Si read_by a changé, recharger le count
          if (payload.new.read_by !== payload.old.read_by) {
            console.log('🔄 Statut de lecture changé, rechargement count');
            loadUnreadCount();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [caseId, userId, loadUnreadCount]);

  return {
    unreadCount,
    markAsRead,
    loading,
    error,
    refresh: loadUnreadCount
  };
};

/**
 * Hook pour compter TOUS les messages non lus (tous dossiers)
 * @param {string} userId - ID de l'utilisateur actuel
 * @returns {Object} { totalUnread, loading, error, refresh }
 */
export const useAllUnreadMessages = (userId) => {
  const [totalUnread, setTotalUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Charger le compteur total
   */
  const loadTotalUnread = useCallback(async () => {
    if (!userId) {
      setTotalUnread(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: rpcError } = await supabase.rpc('count_all_unread_messages', {
        p_user_id: userId
      });

      if (rpcError) throw rpcError;

      setTotalUnread(data || 0);
      console.log('📬 Total messages non lus:', data);
    } catch (err) {
      console.error('❌ Erreur chargement total messages non lus:', err);
      setError(err);
      setTotalUnread(0);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Charger au mount et quand userId change
   */
  useEffect(() => {
    loadTotalUnread();
  }, [loadTotalUnread]);

  /**
   * Realtime: Écouter TOUS les messages (tous dossiers user)
   */
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`all-unread-messages-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'purchase_case_messages'
        },
        (payload) => {
          // Recharger le count total sur tout changement
          console.log('🔄 Message changé, rechargement count total');
          loadTotalUnread();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, loadTotalUnread]);

  return {
    totalUnread,
    loading,
    error,
    refresh: loadTotalUnread
  };
};

export default useUnreadMessages;

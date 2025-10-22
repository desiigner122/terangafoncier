import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

/**
 * Hook pour charger les compteurs de notifications et messages non lus
 * Utilise les vraies tables de la base de données
 */
export const useUnreadCounts = () => {
  const { user } = useAuth();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadUnreadCounts = async () => {
    if (!user?.id) {
      setUnreadMessagesCount(0);
      setUnreadNotificationsCount(0);
      setLoading(false);
      return;
    }

    try {
      // Messages non lus depuis purchase_case_messages
      const { count: messagesCount, error: messagesError } = await supabase
        .from('purchase_case_messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .is('read_at', null);

      if (messagesError) {
        console.warn('Error loading messages count:', messagesError);
      } else {
        setUnreadMessagesCount(messagesCount || 0);
      }

      // Messages administratifs non lus
      const { count: adminMessagesCount, error: adminError } = await supabase
        .from('messages_administratifs')
        .select('*', { count: 'exact', head: true })
        .eq('destinataire_id', user.id)
        .eq('statut', 'non_lu');

      if (!adminError && adminMessagesCount) {
        setUnreadMessagesCount((prev) => prev + (adminMessagesCount || 0));
      }

      // Notifications non lues (si la table existe)
      const { count: notificationsCount, error: notifError } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (!notifError) {
        setUnreadNotificationsCount(notificationsCount || 0);
      }

      // Fallback: si pas de table notifications, compter les nouveaux dossiers
      if (notifError && notifError.code === 'PGRST204') {
        // Compter les nouveaux purchase_requests en attente
        const { count: requestsCount } = await supabase
          .from('purchase_requests')
          .select('*', { count: 'exact', head: true })
          .eq('seller_id', user.id)
          .eq('status', 'pending');

        setUnreadNotificationsCount(requestsCount || 0);
      }
    } catch (error) {
      console.error('Error loading unread counts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger au montage
  useEffect(() => {
    loadUnreadCounts();
  }, [user?.id]);

  // Souscriptions en temps réel
  useEffect(() => {
    if (!user?.id) return;

    // Messages en temps réel
    const messagesChannel = supabase
      .channel('messages_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'purchase_case_messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          console.log('📩 New message received');
          loadUnreadCounts();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'purchase_case_messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          console.log('📩 Message updated');
          loadUnreadCounts();
        }
      )
      .subscribe();

    // Messages administratifs en temps réel
    const adminMessagesChannel = supabase
      .channel('admin_messages_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages_administratifs',
          filter: `destinataire_id=eq.${user.id}`,
        },
        () => {
          console.log('📬 New admin message received');
          loadUnreadCounts();
        }
      )
      .subscribe();

    // Notifications en temps réel (si table existe)
    const notificationsChannel = supabase
      .channel('notifications_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          console.log('🔔 Notification changed');
          loadUnreadCounts();
        }
      )
      .subscribe();

    return () => {
      messagesChannel.unsubscribe();
      adminMessagesChannel.unsubscribe();
      notificationsChannel.unsubscribe();
    };
  }, [user?.id]);

  return {
    unreadMessagesCount,
    unreadNotificationsCount,
    loading,
    reload: loadUnreadCounts,
  };
};

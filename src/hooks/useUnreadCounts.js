import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

/**
 * Hook pour charger les compteurs de notifications et messages non lus
 * Utilise les vraies tables de la base de données
 */
export const useUnreadCounts = () => {
  const { user, profile } = useAuth();
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const computeRequestNotificationFallback = async () => {
    if (!user?.id) {
      return 0;
    }

    try {
      const normalizedRole = String(profile?.role || '').toLowerCase();
      const isSeller = ['vendeur', 'seller'].includes(normalizedRole);

      if (isSeller) {
        const { data: propertyRows, error: propertiesError } = await supabase
          .from('properties')
          .select('id')
          .eq('owner_id', user.id);

        if (!propertiesError) {
          const propertyIds = (propertyRows || []).map((row) => row.id);

          if (propertyIds.length > 0) {
            const { count, error: requestCountError } = await supabase
              .from('purchase_requests')
              .select('id', { count: 'exact', head: true })
              .in('property_id', propertyIds)
              .in('status', ['pending', 'waiting_response', 'negotiation', 'in_progress']);

            if (!requestCountError && count) {
              return count;
            }
          }
        }

        const { data: parcelRows, error: parcelsError } = await supabase
          .from('parcels')
          .select('id')
          .eq('owner_id', user.id);

        if (!parcelsError) {
          const parcelIds = (parcelRows || []).map((row) => row.id);

          if (parcelIds.length > 0) {
            const { count: legacySellerCount, error: legacySellerError } = await supabase
              .from('requests')
              .select('id', { count: 'exact', head: true })
              .in('parcel_id', parcelIds);

            if (!legacySellerError && legacySellerCount) {
              return legacySellerCount;
            }
          }
        }
      } else {
        const { count, error: buyerCountError } = await supabase
          .from('purchase_requests')
          .select('id', { count: 'exact', head: true })
          .eq('buyer_id', user.id);

        if (!buyerCountError && count) {
          return count;
        }

        const { count: legacyBuyerCount, error: legacyBuyerError } = await supabase
          .from('requests')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (!legacyBuyerError && legacyBuyerCount) {
          return legacyBuyerCount;
        }
      }
    } catch (error) {
      console.error('Erreur calcul fallback notifications:', error);
    }

    return 0;
  };

  const loadUnreadCounts = async () => {
    if (!user?.id) {
      setUnreadMessagesCount(0);
      setUnreadNotificationsCount(0);
      setLoading(false);
      return;
    }

    try {
      // Messages non lus (nouveau système): utiliser la table conversations
      // Vendeur: unread_count_vendor | Acheteur: unread_count_buyer
      const normalizedRole = String(profile?.role || '').toLowerCase();
      const isSeller = ['vendeur', 'seller'].includes(normalizedRole);

      if (isSeller) {
        const { count, error } = await supabase
          .from('conversations')
          .select('id', { count: 'exact', head: true })
          .eq('vendor_id', user.id)
          .gt('unread_count_vendor', 0);
        if (!error) setUnreadMessagesCount(count || 0); else setUnreadMessagesCount(0);
      } else {
        const { count, error } = await supabase
          .from('conversations')
          .select('id', { count: 'exact', head: true })
          .eq('buyer_id', user.id)
          .gt('unread_count_buyer', 0);
        if (!error) setUnreadMessagesCount(count || 0); else setUnreadMessagesCount(0);
      }

      // Messages administratifs non lus (si table existe encore)
      try {
        const { count: adminMessagesCount, error: adminError } = await supabase
          .from('messages_administratifs')
          .select('*', { count: 'exact', head: true })
          .eq('destinataire_id', user.id)
          .eq('statut', 'non_lu');
        if (!adminError && adminMessagesCount) {
          setUnreadMessagesCount((prev) => prev + (adminMessagesCount || 0));
        }
      } catch (e) {
        // Ignorer si la table n'existe pas
      }

      // Notifications non lues (si la table existe)
      let notificationsCountValue = 0;
      let requireFallback = false;

      try {
        const { count: notificationsCount, error: notifError } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_read', false);

        if (notifError) {
          requireFallback = true;
          if (!['PGRST204', '42P01'].includes(notifError.code)) {
            console.error('Erreur chargement notifications (count):', notifError);
          }
        } else {
          notificationsCountValue = notificationsCount || 0;
          requireFallback = notificationsCountValue === 0;
        }
      } catch (error) {
        console.error('Erreur accès notifications:', error);
        requireFallback = true;
      }

      if (requireFallback) {
        const fallbackCount = await computeRequestNotificationFallback();
        notificationsCountValue = fallbackCount;
      }

      setUnreadNotificationsCount(notificationsCountValue);
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

    // Conversations en temps réel (unread counts)
    const conversationsChannel = supabase
      .channel('conversations_realtime_counts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `vendor_id=eq.${user.id}`,
        },
        () => {
          console.log('🗨️ Conversations changed (vendor)');
          loadUnreadCounts();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `buyer_id=eq.${user.id}`,
        },
        () => {
          console.log('🗨️ Conversations changed (buyer)');
          loadUnreadCounts();
        }
      )
      .subscribe();

    // Messages en temps réel (insert/update) — déclenche recalcul
    const messagesChannel = supabase
      .channel('conversation_messages_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversation_messages',
        },
        () => {
          console.log('📩 Conversation message changed');
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
      conversationsChannel.unsubscribe();
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

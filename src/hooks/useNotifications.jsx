/**
 * useNotifications.jsx
 * 
 * Hook personnalisé pour gérer les notifications realtime
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import NotificationService from '@/services/NotificationService';
import { toast } from 'sonner';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef(null);

  // Charger les notifications initiales
  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const result = await NotificationService.getUserNotifications(user.id, 50, 0);
      
      if (result.success) {
        setNotifications(result.notifications || []);
        const unread = (result.notifications || []).filter(n => !n.in_app_read).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('❌ Erreur chargement notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Souscrire aux nouvelles notifications
  useEffect(() => {
    if (!user?.id) return;

    console.log('📡 [useNotifications] Souscription pour user:', user.id);

    // Charger les notifications initiales
    loadNotifications();

    // Souscrire aux nouvelles notifications
    channelRef.current = NotificationService.subscribeToUserNotifications(
      user.id,
      (newNotification) => {
        console.log('🔔 [useNotifications] Nouvelle notification reçue:', newNotification);
        
        // Ajouter la notification à la liste
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);

        // Afficher un toast
        toast.info(newNotification.title, {
          description: newNotification.message,
          duration: 5000
        });
      }
    );

    // Cleanup
    return () => {
      if (channelRef.current) {
        const channelName = `user-notifications:${user.id}`;
        NotificationService.unsubscribe(channelName);
        channelRef.current = null;
      }
    };
  }, [user?.id, loadNotifications]);

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId) => {
    if (!user?.id) return;

    try {
      const result = await NotificationService.markNotificationAsRead(notificationId, user.id);
      
      if (result.success) {
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, in_app_read: true, read_at: new Date().toISOString() } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('❌ Erreur marquage notification:', error);
    }
  }, [user?.id]);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Pas de méthode markAllAsRead dans NotificationService actuel
      // On marque chaque notification individuellement
      const unreadNotifications = notifications.filter(n => !n.in_app_read);
      
      await Promise.all(
        unreadNotifications.map(n => 
          NotificationService.markNotificationAsRead(n.id, user.id)
        )
      );

      setNotifications(prev =>
        prev.map(n => ({
          ...n,
          in_app_read: true,
          read_at: n.read_at || new Date().toISOString()
        }))
      );
      setUnreadCount(0);
      
      toast.success('Toutes les notifications marquées comme lues');
    } catch (error) {
      console.error('❌ Erreur marquage toutes notifications:', error);
      toast.error('Erreur lors du marquage des notifications');
    }
  }, [user?.id, notifications]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: loadNotifications
  };
};

export default useNotifications;

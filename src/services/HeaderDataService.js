import { supabase } from '@/lib/supabase';

/**
 * Service pour charger les vrais messages et notifications de Supabase
 * Remplace les données mockées des headers
 */

/**
 * Charger les messages non lus de l'utilisateur courant
 */
export const loadUnreadMessages = async (userId) => {
  try {
    if (!userId) return [];

    // Charger les messages où l'utilisateur est destinataire et pas lus
    const { data: messages, error } = await supabase
      .from('messages')
      .select('id, sender_id, content, created_at, sender:sender_id(full_name, avatar_url)')
      .eq('recipient_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Erreur chargement messages:', error);
      return [];
    }

    return messages || [];
  } catch (error) {
    console.error('Erreur service messages:', error);
    return [];
  }
};

/**
 * Charger les notifications non lues de l'utilisateur courant
 */
export const loadUnreadNotifications = async (userId) => {
  try {
    if (!userId) return [];

    // Charger les notifications non lues
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('id, type, title, message, priority, created_at')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Erreur chargement notifications:', error);
      return [];
    }

    return notifications || [];
  } catch (error) {
    console.error('Erreur service notifications:', error);
    return [];
  }
};

/**
 * Charger les conversations en cours
 */
export const loadConversations = async (userId) => {
  try {
    if (!userId) return [];

    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        id,
        name,
        last_message,
        last_message_at,
        unread_count,
        participants(user_id, full_name, avatar_url)
      `)
      .contains('participant_ids', [userId])
      .order('last_message_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Erreur chargement conversations:', error);
      return [];
    }

    return conversations || [];
  } catch (error) {
    console.error('Erreur service conversations:', error);
    return [];
  }
};

/**
 * Marquer un message comme lu
 */
export const markMessageAsRead = async (messageId) => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) {
      console.error('Erreur marquer message lu:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur service mark read:', error);
    return false;
  }
};

/**
 * Marquer une notification comme lue
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Erreur marquer notif lue:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur service mark notif:', error);
    return false;
  }
};

export default {
  loadUnreadMessages,
  loadUnreadNotifications,
  loadConversations,
  markMessageAsRead,
  markNotificationAsRead
};


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BellRing, 
  BellOff, 
  CheckCheck, 
  Trash2, 
  ArrowRight
} from 'lucide-react';
// useToast import supprimé - utilisation window.safeGlobalToast
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';

const formatDate = (dateString) => {
  if (!dateString) return 'Date inconnue';
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.round((now - date) / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSeconds < 60) return `Il y a quelques secondes`;
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  if (diffDays === 1) return `Hier`;
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
};

const NotificationItem = ({ notification, onMarkRead, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.3 }}
    className={cn(
      "flex items-start gap-4 p-4 border-b last:border-b-0 transition-colors",
      !notification.read && "bg-primary/5 hover:bg-primary/10"
    )}
  >
    <div className={cn("mt-1 relative", !notification.read ? "text-primary" : "text-muted-foreground")}>
      <BellRing className="h-5 w-5" />
      {!notification.read && <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-red-500"></span>}
    </div>
    <div className="flex-grow">
      <p className={cn("text-sm", !notification.read && "font-semibold")}>
        {notification.content}
      </p>
      <span className="text-xs text-muted-foreground">{formatDate(notification.created_at)}</span>
    </div>
    <div className="flex flex-col sm:flex-row gap-1 items-center">
      {notification.link && (
        <Button variant="outline" size="xs" asChild>
          <Link to={notification.link}>Voir <ArrowRight className="h-3 w-3 ml-1"/></Link>
        </Button>
      )}
      {!notification.read && (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onMarkRead(notification.id)} title="Marquer comme lu">
          <CheckCheck className="h-4 w-4" />
        </Button>
      )}
      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(notification.id)} title="Supprimer">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  </motion.div>
);

const NotificationsSkeleton = () => (
  <div className="space-y-2">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex items-start gap-4 p-4 border-b">
        <Skeleton className="h-5 w-5 rounded-full mt-1" />
        <div className="flex-grow space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
    ))}
  </div>
);

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // toast remplacé par window.safeGlobalToast

  const fetchNotifications = async () => {
    if (!user) {
        setError("Veuillez vous connecter pour voir vos notifications.");
        setLoading(false);
        return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      setError("Impossible de charger vos notifications.");
    } else {
      setNotifications(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleMarkRead = async (notificationId) => {
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId);
    if(error) {
      window.safeGlobalToast({ title: "Erreur", description: "Impossible de marquer la notification comme lue.", variant: "destructive" });
    } else {
      fetchNotifications();
    }
  };

   const handleMarkAllRead = async () => {
      if (!user) return;
      const { error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id).eq('is_read', false);
      if(error) {
         window.safeGlobalToast({ title: "Erreur", description: "Impossible de marquer toutes les notifications comme lues.", variant: "destructive" });
      } else {
         window.safeGlobalToast({ title: "Notifications marquées comme lues." });
         fetchNotifications();
      }
   };

  const handleDelete = async (notificationId) => {
    const { error } = await supabase.from('notifications').delete().eq('id', notificationId);
    if(error) {
      window.safeGlobalToast({ title: "Erreur", description: "Impossible de supprimer la notification.", variant: "destructive" });
    } else {
      window.safeGlobalToast({ title: "Notification supprimée." });
      fetchNotifications();
    }
  };

   const handleDeleteAll = async () => {
      if (!user) return;
      const { error } = await supabase.from('notifications').delete().eq('user_id', user.id);
       if(error) {
         window.safeGlobalToast({ title: "Erreur", description: "Impossible de supprimer toutes les notifications.", variant: "destructive" });
      } else {
         window.safeGlobalToast({ title: "Toutes les notifications ont été supprimées." });
         fetchNotifications();
      }
   };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 max-w-4xl"
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center">
             <BellRing className="h-7 w-7 mr-2"/> Notifications
             {unreadCount > 0 && <Badge variant="destructive" className="ml-2">{unreadCount}</Badge>}
          </h1>
          <p className="text-muted-foreground">Restez informé des mises à jour importantes.</p>
        </div>
         <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
                 <CheckCheck className="h-4 w-4 mr-1"/> Tout marquer comme lu
             </Button>
             <Button variant="destructive" size="sm" onClick={handleDeleteAll} disabled={notifications.length === 0}>
                 <Trash2 className="h-4 w-4 mr-1"/> Tout supprimer
             </Button>
         </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <NotificationsSkeleton />
          ) : error ? (
            <div className="text-center py-10 text-destructive px-4">
              <p>{error}</p>
              {!user && <Button asChild className="mt-4"><Link to="/login">Se Connecter</Link></Button>}
            </div>
          ) : notifications.length > 0 ? (
            <motion.div layout className="divide-y">
              {notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 px-4">
              <BellOff className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Aucune notification</h2>
              <p className="text-muted-foreground">Vous n'avez aucune nouvelle notification pour le moment.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NotificationsPage;






import React, { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { 
  // Navigation Icons
  Home,
  Users,
  Building2,
  DollarSign,
  BarChart3,
  Flag,
  Settings,
  Bell,
  LogOut,
  User,
  
  // Content Icons
  Shield, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  PieChart,
  Globe,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Filter,
  Search,
  UserCheck,
  UserX,
  Crown,
  FileText,
  MessageSquare,
  Activity,
  Target,
  Zap,
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Monitor,
  Lock,
  Unlock,
  Mail,
  BookOpen,
  
  // UI Icons
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { logger } from '@/lib/logger';

/** Section « Notifications » du tableau de bord administrateur. */
const AdminNotificationsSection = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loadingNotifs, setLoadingNotifs] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    setLoadingNotifs(true);
    try {
      let query = supabase
        .from('admin_notifications')
        .select('*')
        .eq('admin_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (filter === 'unread') {
        query = query.eq('read', false);
      } else if (filter === 'read') {
        query = query.eq('read', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      logger.error('Erreur chargement notifications:', error);
      toast.error('Erreur chargement notifications');
    } finally {
      setLoadingNotifs(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await supabase
        .from('admin_notifications')
        .update({ read: true })
        .eq('id', notificationId);
      loadNotifications();
      toast.success('Notification marquée comme lue');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const markAllAsRead = async () => {
    try {
      await supabase
        .from('admin_notifications')
        .update({ read: true })
        .eq('admin_id', user?.id)
        .eq('read', false);
      loadNotifications();
      toast.success('Toutes les notifications marquées comme lues');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await supabase
        .from('admin_notifications')
        .delete()
        .eq('id', notificationId);
      loadNotifications();
      toast.success('Notification supprimée');
    } catch (error) {
      toast.error('Erreur suppression');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      new_user: <Users className="h-5 w-5 text-blue-500" />,
      new_property: <Building2 className="h-5 w-5 text-purple-500" />,
      new_report: <Flag className="h-5 w-5 text-red-500" />,
      new_ticket: <MessageSquare className="h-5 w-5 text-green-500" />
    };
    return icons[type] || <Bell className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Centre de Notifications</h2>
        <div className="flex space-x-2">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="all">Toutes</option>
            <option value="unread">Non lues</option>
            <option value="read">Lues</option>
          </select>
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            Tout marquer comme lu
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{notifications.length}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{notifications.filter(n => !n.read).length}</p>
              <p className="text-sm text-gray-600">Non lues</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{notifications.filter(n => n.read).length}</p>
              <p className="text-sm text-gray-600">Lues</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{notifications.filter(n => n.created_at >= new Date(Date.now() - 24*60*60*1000).toISOString()).length}</p>
              <p className="text-sm text-gray-600">Dernières 24h</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {loadingNotifs ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune notification</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card key={notif.id} className={!notif.read ? 'border-blue-500 border-l-4' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{notif.title}</h3>
                        {!notif.read && (
                          <Badge className="bg-blue-500 text-white">Nouveau</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(notif.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {!notif.read && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => markAsRead(notif.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600"
                      onClick={() => deleteNotification(notif.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminNotificationsSection;

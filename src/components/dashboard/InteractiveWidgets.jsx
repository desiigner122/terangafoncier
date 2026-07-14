import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Clock,
  Calendar,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  CreditCard,
  FileText,
  MapPin,
  Building,
  Home,
  Award,
  Bell,
  CheckCircle,
  Target,
  BarChart3,
  PieChart,
  Activity,
  MessageSquare
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

// Widget Prochaines Échéances
export const UpcomingDeadlinesWidget = ({ className = "" }) => {
  const { user } = useAuth();
  const [deadlines, setDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeadlines = async () => {
      if (!user?.id) {
        setDeadlines([]);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .eq('read', false)
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) throw error;
        setDeadlines(data || []);
      } catch (error) {
        console.error('Erreur chargement échéances:', error);
        setDeadlines([]);
      } finally {
        setLoading(false);
      }
    };

    loadDeadlines();
  }, [user?.id]);

  const getPriorityColor = (type) => {
    switch (type) {
      case 'urgent':
      case 'alert':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'reminder':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'documents': return <FileText className="h-4 w-4" />;
      case 'negotiation': return <MessageSquare className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatRelativeTime = (dateStr) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    return `il y a ${diffDays}j`;
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Clock className="h-5 w-5 mr-2 text-orange-600" />
          Prochaines Échéances
          {deadlines.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {deadlines.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {!loading && deadlines.length === 0 && (
            <div className="text-center py-6">
              <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <p className="text-sm text-gray-600">Aucune échéance en attente</p>
            </div>
          )}
          {deadlines.map((deadline) => (
            <div
              key={deadline.id}
              className={`p-3 rounded-lg border-l-4 ${getPriorityColor(deadline.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  <div className="mt-0.5">
                    {getTypeIcon(deadline.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{deadline.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{deadline.message}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {deadline.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    {formatRelativeTime(deadline.created_at)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link to="/dashboard/acheteur/calendar">
            <Button variant="outline" className="w-full" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Voir calendrier complet
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

// Widget Actions Urgentes
export const UrgentActionsWidget = ({ className = "" }) => {
  const { user } = useAuth();
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActions = async () => {
      if (!user?.id) {
        setActions([]);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .eq('read', false)
          .in('type', ['urgent', 'alert', 'warning'])
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setActions(data || []);
      } catch (error) {
        console.error('Erreur chargement actions urgentes:', error);
        setActions([]);
      } finally {
        setLoading(false);
      }
    };

    loadActions();
  }, [user?.id]);

  const handleActionClick = async (action) => {
    // Marquer comme traité (lu) dans Supabase et retirer de la liste
    setActions(prev => prev.filter(a => a.id !== action.id));
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', action.id);
      if (error) throw error;
    } catch (error) {
      console.error('Erreur mise à jour notification:', error);
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
          Actions Urgentes
          {actions.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {actions.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => (
            <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{action.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{action.message}</p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {action.type}
                </Badge>
              </div>
              <Button
                size="sm"
                className="ml-3"
                onClick={() => handleActionClick(action)}
              >
                Traiter
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          ))}
        </div>
        {!loading && actions.length === 0 && (
          <div className="text-center py-6">
            <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <p className="text-sm text-gray-600">Toutes les actions sont à jour !</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Widget Progression Globale
export const GlobalProgressWidget = ({ className = "" }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.id) {
        setProjects([]);
        setLoading(false);
        return;
      }
      try {
        const buildCategory = (name, rows, doneStatuses) => {
          const total = rows.length;
          const active = rows.filter(r => !doneStatuses.includes(r.status)).length;
          const done = total - active;
          const progress = total > 0 ? Math.round((done / total) * 100) : 0;
          return { name, progress, total, active };
        };

        const [{ data: financements, error: eFin }, { data: communales, error: eCom }, { data: constructions, error: eCons }, { data: proprietes, error: eProp }] = await Promise.all([
          supabase.from('demandes_financement').select('id, status').eq('user_id', user.id),
          supabase.from('communal_requests').select('id, status').eq('applicant_id', user.id),
          supabase.from('construction_requests').select('id, status').eq('user_id', user.id),
          supabase.from('properties').select('id, status, nft_token_id').eq('owner_id', user.id)
        ]);

        if (eFin) throw eFin;
        if (eCom) throw eCom;
        if (eCons) throw eCons;
        if (eProp) throw eProp;

        const categories = [];
        if ((financements || []).length > 0) {
          categories.push(buildCategory('Financements', financements, ['approved', 'completed', 'rejected']));
        }
        if ((communales || []).length > 0) {
          categories.push(buildCategory('Demandes Communales', communales, ['approved', 'completed', 'rejected']));
        }
        if ((constructions || []).length > 0) {
          categories.push(buildCategory('Projets Construction', constructions, ['completed', 'rejected']));
        }
        const nftProperties = (proprietes || []).filter(p => p.nft_token_id);
        if (nftProperties.length > 0) {
          categories.push(buildCategory('Propriétés NFT', nftProperties, ['sold']));
        }

        setProjects(categories);
      } catch (error) {
        console.error('Erreur chargement progression globale:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user?.id]);

  const totalProgress = projects.length > 0
    ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)
    : 0;

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          Progression Globale
          <Badge variant="secondary" className="ml-2">{totalProgress}%</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-2">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${totalProgress}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold">{totalProgress}%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {!loading && projects.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Aucune activité suivie pour le moment
              </p>
            )}
            {projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{project.name}</span>
                  <div className="flex items-center space-x-2">
                    <span>{project.active}/{project.total} actifs</span>
                    <span className="text-blue-600">{project.progress}%</span>
                  </div>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Widget Mini Calendrier
export const MiniCalendarWidget = ({ className = "" }) => {
  const [currentDate] = useState(new Date());
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      if (!user?.id) {
        setEvents([]);
        return;
      }
      try {
        const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
        const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1).toISOString();

        const { data, error } = await supabase
          .from('notifications')
          .select('id, title, type, created_at')
          .eq('user_id', user.id)
          .gte('created_at', start)
          .lt('created_at', end)
          .order('created_at', { ascending: true });

        if (error) throw error;

        const mapped = (data || []).map((n) => ({
          date: new Date(n.created_at).getDate(),
          type: n.type,
          title: n.title
        }));
        setEvents(mapped);
      } catch (error) {
        console.error('Erreur chargement événements calendrier:', error);
        setEvents([]);
      }
    };

    loadEvents();
  }, [user?.id, currentDate]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const hasEvent = (day) => {
    return events.find(event => event.date === day);
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-600" />
            {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </div>
          <Badge variant="secondary">{events.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
          {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, index) => (
            <div key={index} className="font-medium text-gray-500 p-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="h-8"></div>
          ))}
          
          {days.map((day) => {
            const event = hasEvent(day);
            const isToday = day === currentDate.getDate();
            
            return (
              <div
                key={day}
                className={`h-8 flex items-center justify-center text-sm relative cursor-pointer rounded ${
                  isToday ? 'bg-blue-600 text-white' :
                  event ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                  'hover:bg-gray-100'
                }`}
                title={event?.title}
              >
                {day}
                {event && (
                  <div className={`absolute top-0 right-0 w-2 h-2 rounded-full ${
                    event.type === 'payment' ? 'bg-red-500' :
                    event.type === 'deadline' ? 'bg-orange-500' :
                    'bg-green-500'
                  }`}></div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 space-y-2">
          {events.slice(0, 3).map((event, index) => (
            <div key={index} className="flex items-center text-xs">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                event.type === 'payment' ? 'bg-red-500' :
                event.type === 'deadline' ? 'bg-orange-500' :
                'bg-green-500'
              }`}></div>
              <span>{event.date}/{currentDate.getMonth() + 1} - {event.title}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
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

// Widget Prochaines Échéances
export const UpcomingDeadlinesWidget = ({ className = "" }) => {
  const [deadlines, setDeadlines] = useState([
    {
      id: 1,
      title: 'Paiement VEFA Villa',
      description: 'Étape finitions - Villa Cité Jardin',
      dueDate: '2025-10-30',
      amount: 11250000,
      type: 'payment',
      priority: 'high',
      category: 'VEFA'
    },
    {
      id: 2,
      title: 'Documents Mbour',
      description: 'Certificat célibat + Quitus fiscal',
      dueDate: '2025-09-30',
      type: 'documents',
      priority: 'urgent',
      category: 'Communal'
    },
    {
      id: 3,
      title: 'Réponse offre Almadies',
      description: 'Contre-offre terrain 500m²',
      dueDate: '2025-10-05',
      type: 'negotiation',
      priority: 'medium',
      category: 'Privé'
    }
  ]);

  const getDaysUntil = (date) => {
    const today = new Date();
    const target = new Date(date);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
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

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Clock className="h-5 w-5 mr-2 text-orange-600" />
          Prochaines Échéances
          <Badge variant="destructive" className="ml-2">
            {deadlines.filter(d => getDaysUntil(d.dueDate) <= 7).length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {deadlines.slice(0, 4).map((deadline) => {
            const daysUntil = getDaysUntil(deadline.dueDate);
            return (
              <div 
                key={deadline.id}
                className={`p-3 rounded-lg border-l-4 ${getPriorityColor(deadline.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <div className="mt-0.5">
                      {getTypeIcon(deadline.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{deadline.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{deadline.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {deadline.category}
                        </Badge>
                        {deadline.amount && (
                          <span className="text-xs font-medium text-green-600">
                            {(deadline.amount / 1000000).toFixed(1)}M FCFA
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${
                      daysUntil <= 3 ? 'text-red-600' : 
                      daysUntil <= 7 ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      {daysUntil <= 0 ? 'Aujourd\'hui' : 
                       daysUntil === 1 ? 'Demain' : 
                       `${daysUntil}j`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(deadline.dueDate).toLocaleDateString('fr-FR', { 
                        day: '2-digit', 
                        month: 'short' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
  const [actions, setActions] = useState([
    {
      id: 1,
      title: 'Compléter dossier Mbour',
      description: '3 documents manquants',
      actionUrl: '/dashboard/acheteur/municipal-applications',
      actionText: 'Téléverser',
      priority: 'urgent',
      category: 'Documents'
    },
    {
      id: 2,
      title: 'Répondre à l\'offre',
      description: 'Terrain Almadies - Vendeur attend réponse',
      actionUrl: '/dashboard/acheteur/private-interests',
      actionText: 'Négocier',
      priority: 'high',
      category: 'Négociation'
    },
    {
      id: 3,
      title: 'Planifier visite chantier',
      description: 'Villa VEFA - Étape finitions',
      actionUrl: '/dashboard/acheteur/promoter-reservations',
      actionText: 'Planifier',
      priority: 'medium',
      category: 'Suivi'
    }
  ]);

  const handleActionClick = (action) => {
    // Marquer comme traité et rediriger
    setActions(prev => prev.filter(a => a.id !== action.id));
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
          Actions Urgentes
          <Badge variant="destructive" className="ml-2">
            {actions.filter(a => a.priority === 'urgent').length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => (
            <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{action.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {action.category}
                </Badge>
              </div>
              <Link to={action.actionUrl}>
                <Button 
                  size="sm"
                  className="ml-3"
                  onClick={() => handleActionClick(action)}
                >
                  {action.actionText}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
        {actions.length === 0 && (
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
  const [projects, setProjects] = useState([
    { name: 'Terrains Privés', progress: 60, total: 3, active: 2 },
    { name: 'Demandes Communales', progress: 40, total: 2, active: 2 },
    { name: 'Projets VEFA', progress: 75, total: 2, active: 1 },
    { name: 'Propriétés NFT', progress: 90, total: 2, active: 2 }
  ]);

  const totalProgress = Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length);

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
  const [events] = useState([
    { date: 25, type: 'meeting', title: 'Visite chantier' },
    { date: 28, type: 'deadline', title: 'Documents Mbour' },
    { date: 30, type: 'payment', title: 'Paiement VEFA' }
  ]);

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
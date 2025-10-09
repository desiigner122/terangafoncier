import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon,
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  MapPin,
  User,
  Building2,
  Phone,
  Video,
  MessageSquare,
  Bell,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ParticulierCalendar = () => {
  const { user } = useOutletContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [filterType, setFilterType] = useState('all');
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Événements du calendrier
  const events = [
    {
      id: 1,
      title: "Visite Villa Almadies",
      type: "visit",
      date: "2024-03-22",
      time: "10:00",
      duration: "1h",
      location: "Almadies, Dakar",
      agent: "Fatou Diop",
      agentPhone: "+221 77 123 45 67",
      property: "Villa moderne avec piscine",
      status: "confirmed",
      priority: "high",
      notes: "Première visite - Vérifier les documents de propriété",
      reminderSet: true
    },
    {
      id: 2,
      title: "Rdv Négociation Duplex",
      type: "meeting",
      date: "2024-03-23",
      time: "14:30",
      duration: "45min",
      location: "Bureau Teranga",
      agent: "Ousmane Diallo",
      agentPhone: "+221 77 888 99 00",
      property: "Duplex standing avec terrasse",
      status: "pending",
      priority: "medium",
      notes: "Négociation finale du prix",
      reminderSet: true
    },
    {
      id: 3,
      title: "Signature promesse de vente",
      type: "contract",
      date: "2024-03-25",
      time: "16:00",
      duration: "2h",
      location: "Étude notariale Maître Sow",
      agent: "Aissatou Ndiaye",
      agentPhone: "+221 78 555 44 33",
      property: "Terrain constructible vue mer",
      status: "confirmed",
      priority: "high",
      notes: "Apporter pièces d'identité et chèque de garantie",
      reminderSet: true
    },
    {
      id: 4,
      title: "Visite Appartement Plateau",
      type: "visit",
      date: "2024-03-26",
      time: "09:30",
      duration: "45min",
      location: "Plateau, Dakar",
      agent: "Mamadou Ba",
      agentPhone: "+221 76 987 65 43",
      property: "Appartement neuf 3 pièces",
      status: "confirmed",
      priority: "medium",
      notes: "Deuxième visite avec expert bâtiment",
      reminderSet: false
    },
    {
      id: 5,
      title: "Appel de suivi",
      type: "call",
      date: "2024-03-27",
      time: "11:00",
      duration: "30min",
      location: "Téléphone",
      agent: "Service Client",
      agentPhone: "+221 77 000 00 00",
      property: null,
      status: "pending",
      priority: "low",
      notes: "Point sur avancement dossier financement",
      reminderSet: true
    }
  ];

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'visit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'meeting': return 'bg-green-100 text-green-800 border-green-200';
      case 'contract': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'call': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'visit': return <Eye className="w-4 h-4" />;
      case 'meeting': return <User className="w-4 h-4" />;
      case 'contract': return <Building2 className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      default: return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return 'Inconnu';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const filteredEvents = events.filter(event => {
    if (filterType === 'all') return true;
    return event.type === filterType;
  });

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const EventCard = ({ event }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="mb-3 hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded-full ${getEventTypeColor(event.type)}`}>
                {getEventTypeIcon(event.type)}
              </div>
              <h3 className="font-semibold text-sm">{event.title}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(event.status)}>
                {getStatusText(event.status)}
              </Badge>
              {event.reminderSet && <Bell className="w-4 h-4 text-blue-500" />}
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{event.time} ({event.duration})</span>
              <span className={`ml-2 font-medium ${getPriorityColor(event.priority)}`}>
                {event.priority === 'high' ? 'Urgent' : event.priority === 'medium' ? 'Normal' : 'Faible'}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{event.agent}</span>
              <span className="text-slate-500">• {event.agentPhone}</span>
            </div>
            
            {event.property && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">{event.property}</span>
              </div>
            )}
          </div>
          
          {event.notes && (
            <div className="mt-3 p-2 bg-slate-50 rounded text-sm text-slate-700">
              <strong>Notes:</strong> {event.notes}
            </div>
          )}
          
          <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="outline">
              <Edit className="w-3 h-3 mr-1" />
              Modifier
            </Button>
            <Button size="sm" variant="outline">
              <MessageSquare className="w-3 h-3 mr-1" />
              Message
            </Button>
            {event.type === 'call' ? (
              <Button size="sm" variant="outline">
                <Phone className="w-3 h-3 mr-1" />
                Appeler
              </Button>
            ) : (
              <Button size="sm" variant="outline">
                <Video className="w-3 h-3 mr-1" />
                Visio
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const CalendarDay = ({ day, isCurrentMonth, events }) => {
    const isToday = day && isCurrentMonth && 
      day === new Date().getDate() && 
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear();
    
    return (
      <div className={`min-h-24 border border-slate-200 p-1 ${
        !isCurrentMonth ? 'bg-slate-50 text-slate-400' : 'bg-white'
      } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}>
        {day && (
          <>
            <div className={`text-sm font-medium mb-1 ${
              isToday ? 'text-blue-700' : 'text-slate-700'
            }`}>
              {day}
            </div>
            <div className="space-y-1">
              {events.slice(0, 2).map((event, index) => (
                <div 
                  key={index}
                  className={`text-xs p-1 rounded truncate ${getEventTypeColor(event.type)}`}
                >
                  {event.time} {event.title}
                </div>
              ))}
              {events.length > 2 && (
                <div className="text-xs text-slate-500 font-medium">
                  +{events.length - 2} autres
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Jours du mois précédent
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    const daysFromPrevMonth = firstDay === 0 ? 6 : firstDay - 1;
    
    for (let i = daysFromPrevMonth; i > 0; i--) {
      const day = prevMonth.getDate() - i + 1;
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), day);
      days.push(
        <CalendarDay 
          key={`prev-${day}`} 
          day={day} 
          isCurrentMonth={false}
          events={getEventsForDate(date)}
        />
      );
    }
    
    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      days.push(
        <CalendarDay 
          key={day} 
          day={day} 
          isCurrentMonth={true}
          events={getEventsForDate(date)}
        />
      );
    }
    
    // Jours du mois suivant
    const totalCells = 42; // 6 semaines x 7 jours
    const remainingCells = totalCells - days.length;
    
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
      days.push(
        <CalendarDay 
          key={`next-${day}`} 
          day={day} 
          isCurrentMonth={false}
          events={getEventsForDate(date)}
        />
      );
    }
    
    return days;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Calendrier</h1>
          <p className="text-slate-600 mt-1">{filteredEvents.length} événements ce mois</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les événements</SelectItem>
              <SelectItem value="visit">Visites</SelectItem>
              <SelectItem value="meeting">Réunions</SelectItem>
              <SelectItem value="contract">Contrats</SelectItem>
              <SelectItem value="call">Appels</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Nouvel événement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Créer un événement</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouvel événement à votre calendrier
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input id="title" placeholder="Titre de l'événement" />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Type d'événement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visit">Visite</SelectItem>
                      <SelectItem value="meeting">Réunion</SelectItem>
                      <SelectItem value="contract">Contrat</SelectItem>
                      <SelectItem value="call">Appel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="time">Heure</Label>
                    <Input id="time" type="time" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Lieu</Label>
                  <Input id="location" placeholder="Lieu de l'événement" />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Notes supplémentaires" />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">Créer</Button>
                  <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendrier */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{formatDate(currentDate)}</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                    Aujourd'hui
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* En-têtes des jours */}
              <div className="grid grid-cols-7 gap-0 mb-2">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                  <div key={day} className="p-2 text-center font-medium text-slate-600 text-sm">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Grille du calendrier */}
              <div className="grid grid-cols-7 gap-0 border border-slate-200">
                {renderCalendar()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des événements */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Événements à venir</CardTitle>
              <CardDescription>
                Vos prochains rendez-vous et activités
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Aucun événement prévu</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEvents.slice(0, 10).map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistiques rapides */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Visites prévues</span>
                  <Badge variant="outline">
                    {events.filter(e => e.type === 'visit').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Réunions</span>
                  <Badge variant="outline">
                    {events.filter(e => e.type === 'meeting').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Contrats</span>
                  <Badge variant="outline">
                    {events.filter(e => e.type === 'contract').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Appels</span>
                  <Badge variant="outline">
                    {events.filter(e => e.type === 'call').length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ParticulierCalendar;
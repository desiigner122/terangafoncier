import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  Phone, 
  Check, 
  X, 
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  MoreVertical
} from 'lucide-react';
import { useUser } from '@/hooks/useUserFixed';

const CalendarPage = () => {
  const { user, profile } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Types de rendez-vous
  const appointmentTypes = {
    visite: { color: 'bg-blue-500', label: 'Visite terrain' },
    reunion: { color: 'bg-green-500', label: 'Réunion' },
    signature: { color: 'bg-purple-500', label: 'Signature' },
    expertise: { color: 'bg-orange-500', label: 'Expertise' },
    consultation: { color: 'bg-cyan-500', label: 'Consultation' },
    negociation: { color: 'bg-red-500', label: 'Négociation' }
  };

  // Données simulées pour les rendez-vous
  const mockAppointments = [
    {
      id: 1,
      title: 'Visite terrain Almadies',
      type: 'visite',
      date: new Date(2024, 8, 10, 14, 0), // 10 septembre 2024, 14h00
      duration: 120, // minutes
      location: 'Almadies, Dakar',
      locationType: 'physical',
      attendees: [
        { id: 1, name: 'Amadou Diallo', role: 'PROMOTEUR', avatar: null },
        { id: 2, name: 'Vous', role: profile?.role || 'USER', avatar: null }
      ],
      description: 'Visite du terrain de 500m² avec le promoteur pour évaluer le potentiel de construction.',
      status: 'confirmed',
      organizer: 'Amadou Diallo',
      notes: 'Apporter les plans cadastraux'
    },
    {
      id: 2,
      title: 'Signature contrat de vente',
      type: 'signature',
      date: new Date(2024, 8, 12, 10, 30),
      duration: 90,
      location: 'Étude Me. Fatou Sall',
      locationType: 'physical',
      attendees: [
        { id: 1, name: 'Me. Fatou Sall', role: 'NOTAIRE', avatar: null },
        { id: 2, name: 'Ibrahima Ndiaye', role: 'VENDEUR', avatar: null },
        { id: 3, name: 'Vous', role: profile?.role || 'USER', avatar: null }
      ],
      description: 'Signature définitive du contrat de vente pour le terrain à Ouakam.',
      status: 'pending',
      organizer: 'Me. Fatou Sall',
      notes: 'Apporter pièce d\'identité et justificatifs de revenus'
    },
    {
      id: 3,
      title: 'Consultation financement',
      type: 'consultation',
      date: new Date(2024, 8, 15, 9, 0),
      duration: 60,
      location: 'En ligne',
      locationType: 'video',
      attendees: [
        { id: 1, name: 'Mme. Aida Sarr', role: 'BANQUE', avatar: null },
        { id: 2, name: 'Vous', role: profile?.role || 'USER', avatar: null }
      ],
      description: 'Discussion sur les options de financement pour l\'achat du terrain.',
      status: 'confirmed',
      organizer: 'Mme. Aida Sarr',
      notes: 'Préparer dossier financier complet'
    },
    {
      id: 4,
      title: 'Expertise géomètre',
      type: 'expertise',
      date: new Date(2024, 8, 18, 15, 30),
      duration: 180,
      location: 'Terrain Ngor',
      locationType: 'physical',
      attendees: [
        { id: 1, name: 'Samba Diop', role: 'GEOMETRE', avatar: null },
        { id: 2, name: 'Vous', role: profile?.role || 'USER', avatar: null }
      ],
      description: 'Mesure et bornage du terrain avec établissement du plan topographique.',
      status: 'confirmed',
      organizer: 'Samba Diop',
      notes: 'Rendez-vous sur site à 15h30 précises'
    }
  ];

  useEffect(() => {
    // Simuler le chargement des rendez-vous
    setTimeout(() => {
      setAppointments(mockAppointments);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Obtenir les jours du mois
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Jours du mois précédent
    const previousMonth = new Date(year, month - 1, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, previousMonth.getDate() - i),
        isCurrentMonth: false
      });
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true
      });
    }

    // Jours du mois suivant pour compléter la grille
    const remainingCells = 42 - days.length; // 6 semaines × 7 jours
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false
      });
    }

    return days;
  };

  // Obtenir les rendez-vous d'une date
  const getAppointmentsForDate = (date) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toDateString() === date.toDateString();
    });
  };

  // Naviguer dans les mois
  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  // Formater l'heure
  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Obtenir le label du statut
  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      default: return 'Inconnu';
    }
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-primary" />
            Calendrier
          </h1>
          <p className="text-gray-600 mt-2">Gérez vos rendez-vous et planifiez vos activités</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau RDV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendrier principal */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h2>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => navigateMonth(-1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigateMonth(1)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant={viewMode === 'month' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('month')}
                >
                  Mois
                </Button>
                <Button 
                  variant={viewMode === 'week' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('week')}
                >
                  Semaine
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {dayNames.map(day => (
                <div key={day} className="p-2 text-center text-sm font-semibold text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map((day, index) => {
                const dayAppointments = getAppointmentsForDate(day.date);
                const isToday = day.date.toDateString() === new Date().toDateString();
                const isSelected = day.date.toDateString() === selectedDate.toDateString();

                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`min-h-[80px] p-1 border rounded cursor-pointer transition-colors ${
                      !day.isCurrentMonth 
                        ? 'bg-gray-50 text-gray-400' 
                        : isSelected
                        ? 'bg-primary/10 border-primary'
                        : isToday
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedDate(day.date)}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-blue-600' : day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {day.date.getDate()}
                    </div>
                    
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map(appointment => {
                        const typeConfig = appointmentTypes[appointment.type];
                        return (
                          <div
                            key={appointment.id}
                            className={`text-xs p-1 rounded text-white truncate ${typeConfig.color}`}
                            title={appointment.title}
                          >
                            {formatTime(appointment.date)} {appointment.title}
                          </div>
                        );
                      })}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayAppointments.length - 2} autre(s)
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar avec détails des rendez-vous */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {getAppointmentsForDate(selectedDate).length > 0 ? (
              getAppointmentsForDate(selectedDate).map(appointment => {
                const typeConfig = appointmentTypes[appointment.type];
                
                return (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${typeConfig.color}`}></div>
                        <h4 className="font-semibold text-sm">{appointment.title}</h4>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(appointment.status)} text-white border-0`}
                      >
                        {getStatusLabel(appointment.status)}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {formatTime(appointment.date)} ({appointment.duration}min)
                      </div>
                      <div className="flex items-center gap-2">
                        {appointment.locationType === 'video' ? (
                          <Video className="w-3 h-3" />
                        ) : (
                          <MapPin className="w-3 h-3" />
                        )}
                        {appointment.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        {appointment.attendees.length} participant(s)
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 mt-2 line-clamp-2">
                      {appointment.description}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <Badge variant="outline" className="text-xs">
                        {typeConfig.label}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Aucun rendez-vous ce jour</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="w-3 h-3 mr-1" />
                  Créer un RDV
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Prochains rendez-vous */}
      <Card>
        <CardHeader>
          <CardTitle>Prochains rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {appointments
              .filter(apt => new Date(apt.date) > new Date())
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 6)
              .map(appointment => {
                const typeConfig = appointmentTypes[appointment.type];
                
                return (
                  <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${typeConfig.color}`}></div>
                          <h4 className="font-semibold text-sm">{appointment.title}</h4>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {typeConfig.label}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-xs text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-3 h-3" />
                          {new Date(appointment.date).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {formatTime(appointment.date)}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {appointment.location}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {appointment.attendees.slice(0, 3).map((attendee, index) => (
                            <Avatar key={attendee.id} className="w-6 h-6 border-2 border-white">
                              <AvatarImage src={attendee.avatar} />
                              <AvatarFallback className="text-xs">
                                {attendee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {appointment.attendees.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                              <span className="text-xs">+{appointment.attendees.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          Détails
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;

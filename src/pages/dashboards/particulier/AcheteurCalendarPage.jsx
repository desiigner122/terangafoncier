import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ModernDashboardLayout from '@/components/dashboard/ModernDashboardLayout';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import ParticulierSupabaseService from '@/services/ParticulierSupabaseService';

// Statuts réels de property_visits : pending | confirmed | completed | cancelled
const STATUS_CONFIG = {
  pending: { color: 'bg-yellow-500', label: 'En attente' },
  confirmed: { color: 'bg-green-500', label: 'Confirmée' },
  completed: { color: 'bg-blue-500', label: 'Terminée' },
  cancelled: { color: 'bg-red-500', label: 'Annulée' }
};

const monthNames = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];
const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const AcheteurCalendarPage = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const loadVisits = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const res = await ParticulierSupabaseService.getMyVisits(user.id);
      if (res?.success) {
        setVisits(res.data || []);
      } else {
        setVisits([]);
      }
      setIsLoading(false);
    };
    loadVisits();
  }, [user?.id]);

  // Date effective d'une visite : date confirmée sinon date demandée
  const getVisitDate = (visit) => {
    const raw = visit.confirmed_date || visit.requested_date || visit.created_at;
    return raw ? new Date(raw) : null;
  };

  const getStatusConfig = (status) =>
    STATUS_CONFIG[status] || { color: 'bg-gray-500', label: status || 'Inconnu' };

  const getPropertyLabel = (visit) => {
    const p = visit.property;
    if (!p) return 'Bien immobilier';
    return p.title || p.name || p.location || 'Bien immobilier';
  };

  const getVisitLocation = (visit) => {
    const p = visit.property;
    if (!p) return '—';
    return p.location || [p.city, p.region].filter(Boolean).join(', ') || '—';
  };

  const formatTime = (date) =>
    date ? date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    const previousMonth = new Date(year, month, 0);
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, previousMonth.getDate() - i),
        isCurrentMonth: false
      });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
    }
    return days;
  };

  const getVisitsForDate = (date) =>
    visits.filter((v) => {
      const d = getVisitDate(v);
      return d && d.toDateString() === date.toDateString();
    });

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const upcomingVisits = visits
    .map((v) => ({ v, d: getVisitDate(v) }))
    .filter(({ d }) => d && d > new Date())
    .sort((a, b) => a.d - b.d)
    .slice(0, 6);

  return (
    <ModernDashboardLayout>
      <div className="space-y-6">
        {/* Header de la page */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Calendrier</h1>
              <p className="text-gray-600 mt-1">Vos visites de biens et rendez-vous</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
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
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {dayNames.map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-semibold text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth(currentMonth).map((day, index) => {
                      const dayVisits = getVisitsForDate(day.date);
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
                          <div
                            className={`text-sm font-medium mb-1 ${
                              isToday
                                ? 'text-blue-600'
                                : day.isCurrentMonth
                                ? 'text-gray-900'
                                : 'text-gray-400'
                            }`}
                          >
                            {day.date.getDate()}
                          </div>

                          <div className="space-y-1">
                            {dayVisits.slice(0, 2).map((visit) => {
                              const cfg = getStatusConfig(visit.status);
                              const d = getVisitDate(visit);
                              return (
                                <div
                                  key={visit.id}
                                  className={`text-xs p-1 rounded text-white truncate ${cfg.color}`}
                                  title={getPropertyLabel(visit)}
                                >
                                  {formatTime(d)} {getPropertyLabel(visit)}
                                </div>
                              );
                            })}
                            {dayVisits.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{dayVisits.length - 2} autre(s)
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Sidebar : visites de la date sélectionnée */}
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
                  {getVisitsForDate(selectedDate).length > 0 ? (
                    getVisitsForDate(selectedDate).map((visit) => {
                      const cfg = getStatusConfig(visit.status);
                      const d = getVisitDate(visit);
                      return (
                        <motion.div
                          key={visit.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${cfg.color}`}></div>
                              <h4 className="font-semibold text-sm">{getPropertyLabel(visit)}</h4>
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-xs ${cfg.color} text-white border-0`}
                            >
                              {cfg.label}
                            </Badge>
                          </div>

                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {formatTime(d) || 'Heure à confirmer'}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              {getVisitLocation(visit)}
                            </div>
                            {visit.owner?.full_name && (
                              <div className="flex items-center gap-2">
                                <User className="w-3 h-3" />
                                {visit.owner.full_name}
                              </div>
                            )}
                          </div>

                          {visit.visitor_notes && (
                            <p className="text-xs text-gray-700 mt-2 line-clamp-2">
                              {visit.visitor_notes}
                            </p>
                          )}
                          {visit.owner_instructions && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2 flex items-start gap-1">
                              <FileText className="w-3 h-3 mt-0.5 shrink-0" />
                              {visit.owner_instructions}
                            </p>
                          )}
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">Aucune visite ce jour</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Prochaines visites */}
            <Card>
              <CardHeader>
                <CardTitle>Prochaines visites</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingVisits.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {upcomingVisits.map(({ v: visit, d }) => {
                      const cfg = getStatusConfig(visit.status);
                      return (
                        <Card key={visit.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${cfg.color}`}></div>
                                <h4 className="font-semibold text-sm">{getPropertyLabel(visit)}</h4>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {cfg.label}
                              </Badge>
                            </div>

                            <div className="space-y-2 text-xs text-gray-600">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="w-3 h-3" />
                                {d.toLocaleDateString('fr-FR')}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                {formatTime(d) || 'Heure à confirmer'}
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3" />
                                {getVisitLocation(visit)}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Aucune visite planifiée</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Demandez une visite depuis la fiche d'un bien.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </ModernDashboardLayout>
  );
};

export default AcheteurCalendarPage;

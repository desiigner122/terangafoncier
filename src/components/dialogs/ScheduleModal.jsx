import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Home,
  CheckCircle,
  Bell
} from 'lucide-react';
import { format, addDays, setHours, setMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

/**
 * Modal de planification de rendez-vous/visites
 */
const ScheduleModal = ({ 
  open, 
  onOpenChange,
  prospect = null,
  property = null
}) => {
  const { user } = useAuth();
  const [date, setDate] = useState(addDays(new Date(), 1));
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState(property?.location || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Créneaux horaires disponibles
  const timeSlots = [];
  for (let hour = 8; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(timeString);
    }
  }

  // Durées disponibles
  const durations = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 heure' },
    { value: 90, label: '1h30' },
    { value: 120, label: '2 heures' }
  ];

  // Créer le rendez-vous
  const handleSchedule = async () => {
    if (!date || !time) return;

    setLoading(true);
    try {
      // Combiner date et heure
      const [hours, minutes] = time.split(':').map(Number);
      const scheduledDateTime = setMinutes(setHours(date, hours), minutes);

      // Insérer dans Supabase
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          seller_id: user.id,
          prospect_id: prospect?.id,
          property_id: property?.id,
          scheduled_at: scheduledDateTime.toISOString(),
          duration,
          location,
          notes,
          status: 'scheduled',
          reminder_sent: false,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Toast de succès
      if (window.safeGlobalToast) {
        window.safeGlobalToast({
          title: "Rendez-vous planifié !",
          description: `Visite programmée le ${format(scheduledDateTime, "EEEE d MMMM à HH:mm", { locale: fr })}.`,
        });
      }

      // Fermer et réinitialiser
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Erreur planification RDV:', error);
      if (window.safeGlobalToast) {
        window.safeGlobalToast({
          title: "Erreur",
          description: "Impossible de planifier le rendez-vous.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDate(addDays(new Date(), 1));
    setTime('10:00');
    setDuration(60);
    setLocation(property?.location || '');
    setNotes('');
  };

  // Calculer l'heure de fin
  const getEndTime = () => {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const endDate = addMinutes(setMinutes(setHours(new Date(), hours), minutes), duration);
    return format(endDate, 'HH:mm');
  };

  const addMinutes = (date, minutes) => {
    return new Date(date.getTime() + minutes * 60000);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <CalendarIcon className="w-6 h-6 mr-2 text-orange-600" />
            Planifier un Rendez-vous
          </DialogTitle>
          <DialogDescription>
            Organisez une visite de propriété avec votre prospect
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations contextuelles */}
          {(prospect || property) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prospect && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center text-blue-900 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    <span className="font-semibold">Prospect</span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{prospect.name}</div>
                    <div className="text-blue-700">{prospect.email}</div>
                    <div className="text-blue-700">{prospect.phone}</div>
                  </div>
                </div>
              )}

              {property && (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-center text-orange-900 mb-2">
                    <Home className="w-4 h-4 mr-2" />
                    <span className="font-semibold">Propriété</span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{property.title}</div>
                    <div className="text-orange-700">{property.location}</div>
                    <div className="text-orange-700 font-semibold">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'XOF',
                        minimumFractionDigits: 0
                      }).format(property.price)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Calendrier et heure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calendrier */}
            <div>
              <Label className="mb-3 block">Date de la visite *</Label>
              <div className="border rounded-lg p-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  locale={fr}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Les dimanches sont indisponibles
              </p>
            </div>

            {/* Heure et durée */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="time">Heure de début *</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {slot}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Durée *</Label>
                <Select value={duration.toString()} onValueChange={(val) => setDuration(Number(val))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((dur) => (
                      <SelectItem key={dur.value} value={dur.value.toString()}>
                        {dur.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Résumé heure */}
              {time && (
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Créneau</div>
                      <div className="text-lg font-bold text-orange-600">
                        {time} - {getEndTime()}
                      </div>
                    </div>
                    <Clock className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              )}

              {/* Date sélectionnée */}
              {date && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Date choisie</div>
                  <div className="font-semibold text-blue-900">
                    {format(date, "EEEE d MMMM yyyy", { locale: fr })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lieu */}
          <div>
            <Label htmlFor="location">Lieu de rendez-vous *</Label>
            <div className="relative mt-2">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="location"
                placeholder="Adresse complète de la propriété"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Informations complémentaires (code d'accès, parking, etc.)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-2"
            />
          </div>

          {/* Options de rappel */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Bell className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-yellow-900 mb-1">
                  Rappels automatiques
                </div>
                <div className="text-sm text-yellow-800 space-y-1">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Email de confirmation immédiat</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Rappel SMS 24h avant</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Rappel email 2h avant</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Résumé final */}
          {date && time && location && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="font-semibold text-green-900 mb-3">
                📅 Résumé du rendez-vous
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date :</span>
                  <span className="font-medium">
                    {format(date, "EEEE d MMMM yyyy", { locale: fr })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Heure :</span>
                  <span className="font-medium">{time} - {getEndTime()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durée :</span>
                  <span className="font-medium">
                    {durations.find(d => d.value === duration)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lieu :</span>
                  <span className="font-medium">{location}</span>
                </div>
                {prospect && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avec :</span>
                    <span className="font-medium">{prospect.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSchedule}
              disabled={loading || !date || !time || !location}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Planification...' : 'Confirmer le rendez-vous'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleModal;

/**
 * Composant de prise de rendez-vous
 * Permet de planifier des visites, signatures, réunions
 */
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Video, Phone, Users, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

const APPOINTMENT_TYPES = [
  { value: 'viewing', label: 'Visite du bien', icon: MapPin, color: 'blue' },
  { value: 'meeting', label: 'Réunion', icon: Users, color: 'purple' },
  { value: 'signing', label: 'Signature', icon: Calendar, color: 'green' },
  { value: 'inspection', label: 'Inspection', icon: MapPin, color: 'orange' },
  { value: 'consultation', label: 'Consultation', icon: Phone, color: 'indigo' },
];

const LOCATION_TYPES = [
  { value: 'physical', label: 'En personne', icon: MapPin },
  { value: 'virtual', label: 'Visioconférence', icon: Video },
  { value: 'phone', label: 'Téléphone', icon: Phone },
];

export const AppointmentScheduler = ({ purchaseRequestId, userId, onAppointmentCreated }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    appointment_type: 'viewing',
    location_type: 'physical',
    location: '',
    meeting_url: '',
    start_time: '',
    end_time: '',
    attendees: [],
    notes: '',
  });

  React.useEffect(() => {
    if (open && purchaseRequestId) {
      loadAppointments();
    }
  }, [open, purchaseRequestId]);

  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('calendar_appointments')
        .select('*')
        .eq('purchase_request_id', purchaseRequestId)
        .order('start_time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Erreur chargement rendez-vous:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate that we have a valid purchase_request_id
      if (!purchaseRequestId || purchaseRequestId === 'undefined') {
        toast.error('Demande d\'achat introuvable. Impossible de créer le rendez-vous.');
        setLoading(false);
        return;
      }

      // Log for debugging
      console.log('📋 Creating appointment with purchase_request_id:', purchaseRequestId);

      const appointmentData = {
        user_id: userId,
        title: formData.title,
        description: formData.description,
        appointment_type: formData.appointment_type,
        location_type: formData.location_type,
        location: formData.location_type === 'physical' ? formData.location : null,
        meeting_url: formData.location_type === 'virtual' ? formData.meeting_url : null,
        start_time: formData.start_time,
        end_time: formData.end_time,
        notes: formData.notes,
        status: 'scheduled',
        created_by: userId,
        purchase_request_id: purchaseRequestId,
      };

      const { data, error } = await supabase
        .from('calendar_appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Rendez-vous créé avec succès');
      setOpen(false);
      resetForm();
      loadAppointments();
      if (onAppointmentCreated) onAppointmentCreated(data);
    } catch (error) {
      console.error('Erreur création rendez-vous:', error);
      toast.error('Erreur lors de la création du rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      appointment_type: 'viewing',
      location_type: 'physical',
      location: '',
      meeting_url: '',
      start_time: '',
      end_time: '',
      attendees: [],
      notes: '',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800',
      no_show: 'bg-orange-100 text-orange-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type) => {
    const typeData = APPOINTMENT_TYPES.find(t => t.value === type);
    return typeData ? typeData.icon : Calendar;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Calendar className="w-4 h-4" />
          Planifier un rendez-vous
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestion des rendez-vous</DialogTitle>
          <DialogDescription>
            Planifiez des visites, signatures et réunions pour ce dossier
          </DialogDescription>
        </DialogHeader>

        {/* Liste des rendez-vous existants */}
        {appointments.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-sm">Rendez-vous planifiés</h3>
            {appointments.map((apt) => {
              const TypeIcon = getTypeIcon(apt.appointment_type);
              return (
                <Card key={apt.id} className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <TypeIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{apt.title}</h4>
                          <Badge className={getStatusColor(apt.status)}>
                            {apt.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{apt.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(apt.start_time), 'dd MMM yyyy', { locale: fr })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(apt.start_time), 'HH:mm')} - {format(new Date(apt.end_time), 'HH:mm')}
                          </span>
                          {apt.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {apt.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Formulaire nouveau rendez-vous */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Titre du rendez-vous*</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Visite du terrain"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Détails du rendez-vous..."
                rows={3}
              />
            </div>

            <div>
              <Label>Type de rendez-vous*</Label>
              <Select
                value={formData.appointment_type}
                onValueChange={(value) => setFormData({ ...formData, appointment_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APPOINTMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Modalité*</Label>
              <Select
                value={formData.location_type}
                onValueChange={(value) => setFormData({ ...formData, location_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCATION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.location_type === 'physical' && (
              <div className="col-span-2">
                <Label htmlFor="location">Lieu*</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Adresse du rendez-vous"
                  required
                />
              </div>
            )}

            {formData.location_type === 'virtual' && (
              <div className="col-span-2">
                <Label htmlFor="meeting_url">Lien de visioconférence*</Label>
                <Input
                  id="meeting_url"
                  type="url"
                  value={formData.meeting_url}
                  onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
                  placeholder="https://meet.google.com/..."
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="start_time">Date et heure de début*</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="end_time">Date et heure de fin*</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notes supplémentaires..."
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer le rendez-vous'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentScheduler;

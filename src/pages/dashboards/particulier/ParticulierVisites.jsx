import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Eye,
  MessageSquare,
  Phone,
  Navigation,
  AlertCircle,
  Filter,
  Search,
  Plus,
  Edit
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ParticulierVisites = () => {
  const outletContext = useOutletContext();
  const { user } = outletContext || {};
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) {
      loadVisits();
    }
  }, [user]);

  const loadVisits = async () => {
    try {
      setLoading(true);
      console.log('📅 Chargement des visites...');

      const { data: visitsData, error } = await supabase
        .from('visits')
        .select(`
          *,
          property:properties(
            id,
            title,
            city,
            address,
            surface_area,
            images,
            location_lat,
            location_lng
          ),
          owner:profiles!owner_id(
            id,
            full_name,
            email,
            phone
          )
        `)
        .eq('visitor_id', user.id)
        .order('requested_date', { ascending: true });

      if (error) throw error;

      setVisits(visitsData || []);
      console.log('✅ Visites chargées:', visitsData?.length || 0);
    } catch (error) {
      console.error('❌ Erreur chargement visites:', error);
      window.safeGlobalToast({
        description: 'Erreur lors du chargement des visites',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      confirmed: { label: 'Confirmée', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      completed: { label: 'Effectuée', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getVisitsForDate = (date) => {
    return visits.filter(visit => {
      const visitDate = new Date(visit.requested_date || visit.confirmed_date);
      return visitDate.toDateString() === date.toDateString();
    });
  };

  const now = new Date();
  const upcomingVisits = visits.filter(v => {
    const visitDate = new Date(v.confirmed_date || v.requested_date);
    return visitDate >= now && (v.status === 'confirmed' || v.status === 'pending');
  });
  
  const pastVisits = visits.filter(v => {
    const visitDate = new Date(v.confirmed_date || v.requested_date);
    return visitDate < now || v.status === 'completed' || v.status === 'cancelled';
  });

  const stats = {
    total: visits.length,
    upcoming: upcomingVisits.length,
    pending: visits.filter(v => v.status === 'pending').length,
    confirmed: visits.filter(v => v.status === 'confirmed').length,
    completed: visits.filter(v => v.status === 'completed').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visites Planifiées</h1>
          <p className="text-gray-600 mt-2">Gérez vos rendez-vous de visite de terrains</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <Plus className="h-4 w-4 mr-2" />
          Demander une visite
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Visites</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
            <div className="text-sm text-gray-600">À venir</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">En attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Effectuées</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendrier</CardTitle>
            <CardDescription>Sélectionnez une date</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                hasVisit: (date) => getVisitsForDate(date).length > 0
              }}
              modifiersStyles={{
                hasVisit: {
                  fontWeight: 'bold',
                  backgroundColor: '#3b82f6',
                  color: 'white'
                }
              }}
            />

            {/* Visites du jour sélectionné */}
            {getVisitsForDate(selectedDate).length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold text-sm text-gray-900">
                  Visites du {selectedDate.toLocaleDateString('fr-FR')}
                </h4>
                {getVisitsForDate(selectedDate).map(visit => (
                  <div key={visit.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="font-medium text-sm">{visit.property?.title}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {new Date(visit.confirmed_date || visit.requested_date).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Liste des visites */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mes Visites</CardTitle>
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="upcoming">À venir ({stats.upcoming})</TabsTrigger>
                <TabsTrigger value="pending">En attente ({stats.pending})</TabsTrigger>
                <TabsTrigger value="past">Passées</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-4 mt-6">
                {upcomingVisits.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune visite à venir</h3>
                    <p className="text-gray-600">Planifiez une visite pour découvrir un terrain</p>
                  </div>
                ) : (
                  upcomingVisits.map((visit) => (
                    <VisitCard key={visit.id} visit={visit} onUpdate={loadVisits} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4 mt-6">
                {visits.filter(v => v.status === 'pending').length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune visite en attente</h3>
                    <p className="text-gray-600">Toutes vos visites ont été confirmées ou traitées</p>
                  </div>
                ) : (
                  visits.filter(v => v.status === 'pending').map((visit) => (
                    <VisitCard key={visit.id} visit={visit} onUpdate={loadVisits} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="past" className="space-y-4 mt-6">
                {pastVisits.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune visite passée</h3>
                    <p className="text-gray-600">Votre historique de visites apparaîtra ici</p>
                  </div>
                ) : (
                  pastVisits.map((visit) => (
                    <VisitCard key={visit.id} visit={visit} onUpdate={loadVisits} isPast />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const VisitCard = ({ visit, onUpdate, isPast = false }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const visitDate = new Date(visit.confirmed_date || visit.requested_date);
  const isToday = visitDate.toDateString() === new Date().toDateString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className={`hover:shadow-lg transition-shadow ${isToday ? 'border-2 border-blue-500' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex space-x-4 flex-1">
              {visit.property?.images?.[0] && (
                <img
                  src={visit.property.images[0]}
                  alt={visit.property.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {visit.property?.title || 'Terrain'}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {visit.property?.city} • {visit.property?.surface_area}m²
                    </div>
                  </div>
                  {visit.status && visit.status}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
                    <div>
                      <div className="font-medium">
                        {visitDate.toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-xs text-gray-600">
                        {visitDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  
                  {visit.owner && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-green-600" />
                      <div>
                        <div className="font-medium">{visit.owner.full_name}</div>
                        <div className="text-xs text-gray-600">{visit.owner.phone}</div>
                      </div>
                    </div>
                  )}
                </div>

                {visit.owner_instructions && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs text-blue-600 mb-1">Instructions du propriétaire</div>
                    <p className="text-sm text-gray-700">{visit.owner_instructions}</p>
                  </div>
                )}

                <div className="flex items-center space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Voir le terrain
                  </Button>
                  <Button variant="outline" size="sm">
                    <Navigation className="h-4 w-4 mr-2" />
                    Itinéraire
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contacter
                  </Button>
                  {!isPast && visit.status === 'pending' && (
                    <Button variant="outline" size="sm" className="text-red-600">
                      <XCircle className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                  )}
                  {!isPast && visit.status === 'confirmed' && (
                    <Button variant="outline" size="sm" className="text-blue-600">
                      <Edit className="h-4 w-4 mr-2" />
                      Reprogrammer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ParticulierVisites;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  MapPin,
  Calendar,
  Clock,
  Users,
  Eye,
  Edit,
  CheckCircle,
  AlertTriangle,
  Plus,
  Filter,
  Search,
  Download,
  Compass,
  Ruler,
  Map,
  FileText,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const GeometreMissions = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMissions = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('survey_missions')
          .select('*')
          .eq('geometre_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMissions(data || []);
      } catch (err) {
        console.error('Erreur chargement missions:', err);
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadMissions();
  }, [user?.id]);

  // Libellé lisible pour le statut réel (pending/in_progress/completed/cancelled)
  const getStatusLabel = (status) => {
    switch (status) {
      case 'in_progress': return 'En cours';
      case 'pending': return 'En attente';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status || '—';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Libellé lisible pour le type de mission réel (bornage/levé_topo/implantation/division...)
  const getTypeLabel = (type) => {
    switch (type) {
      case 'bornage': return 'Bornage';
      case 'levé_topo': return 'Levé topographique';
      case 'implantation': return 'Implantation';
      case 'division': return 'Division';
      default: return type || 'Mission';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'levé_topo': return Compass;
      case 'bornage': return Target;
      case 'division': return Map;
      case 'implantation': return Ruler;
      default: return FileText;
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === '') return '—';
    const num = Number(price);
    if (Number.isNaN(num)) return '—';
    return `${num.toLocaleString('fr-FR')} XOF`;
  };

  const formatDate = (value) => {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('fr-FR');
  };

  const filteredMissions = () => {
    let list = missions;

    switch (activeTab) {
      case 'active':
        list = list.filter(m => m.status === 'in_progress');
        break;
      case 'pending':
        list = list.filter(m => m.status === 'pending');
        break;
      case 'completed':
        list = list.filter(m => m.status === 'completed');
        break;
      default:
        break;
    }

    const term = searchTerm.trim().toLowerCase();
    if (term) {
      list = list.filter(m =>
        (m.title || '').toLowerCase().includes(term) ||
        (m.client_name || '').toLowerCase().includes(term) ||
        (m.location || '').toLowerCase().includes(term)
      );
    }

    return list;
  };

  const overdueCount = missions.filter(
    m => m.scheduled_date && new Date(m.scheduled_date) < new Date() && m.status !== 'completed' && m.status !== 'cancelled'
  ).length;

  const visibleMissions = filteredMissions();

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Missions</h1>
            <p className="text-gray-600 mt-1">Gestion de vos projets de mesure et topographie</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Mission
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher par client, localisation..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Toutes ({missions.length})</TabsTrigger>
            <TabsTrigger value="active">Actives ({missions.filter(m => m.status === 'in_progress').length})</TabsTrigger>
            <TabsTrigger value="pending">En attente ({missions.filter(m => m.status === 'pending').length})</TabsTrigger>
            <TabsTrigger value="completed">Terminées ({missions.filter(m => m.status === 'completed').length})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-gray-500">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Chargement des missions...
              </div>
            ) : visibleMissions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-gray-500">
                  <Target className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium text-gray-700">Aucune mission</p>
                  <p className="text-sm mt-1">
                    {searchTerm
                      ? 'Aucune mission ne correspond à votre recherche.'
                      : 'Vos missions apparaîtront ici une fois créées.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              visibleMissions.map((mission, index) => {
                const TypeIcon = getTypeIcon(mission.mission_type);
                return (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            <div className="p-3 bg-green-50 rounded-lg">
                              <TypeIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{mission.title || 'Mission sans titre'}</h3>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Users className="w-4 h-4 mr-1" />
                                  {mission.client_name || '—'}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {mission.location || '—'}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className={getStatusColor(mission.status)}>
                                {getStatusLabel(mission.status)}
                              </Badge>
                            </div>
                            <p className="text-lg font-bold text-gray-900">{formatPrice(mission.price)}</p>
                            <p className="text-sm text-gray-500">Montant</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Date prévue</p>
                            <div className="flex items-center mt-1">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="text-sm text-gray-900">
                                {formatDate(mission.scheduled_date)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Type de mission</p>
                            <p className="text-sm text-gray-900 mt-1">{getTypeLabel(mission.mission_type)}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="font-medium text-gray-600">Progression</span>
                            <span className="text-gray-900 font-medium">{mission.progress ?? 0}%</span>
                          </div>
                          <Progress value={mission.progress ?? 0} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Créé le {formatDate(mission.created_at)}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Détails
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-1" />
                              Modifier
                            </Button>
                            <Button size="sm">
                              <FileText className="w-4 h-4 mr-1" />
                              Rapport
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </TabsContent>
        </Tabs>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{missions.length}</p>
              <p className="text-sm text-gray-600">Total missions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {missions.filter(m => m.status === 'in_progress').length}
              </p>
              <p className="text-sm text-gray-600">En cours</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">
                {missions.filter(m => m.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Terminées</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{overdueCount}</p>
              <p className="text-sm text-gray-600">En retard</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GeometreMissions;

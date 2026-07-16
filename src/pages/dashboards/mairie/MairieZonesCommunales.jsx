import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Eye,
  Filter,
  Search,
  Download,
  Users,
  Building,
  Ruler,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const MairieZonesCommunales = ({ dashboardStats }) => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('zones');
  const [requests, setRequests] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorData, setErrorData] = useState(null);
  const [search, setSearch] = useState('');

  // Chargement réel : les zones communales sont dérivées des demandes de
  // terrains communaux (communal_requests) regroupées par zone/commune.
  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorData(null);
    try {
      let query = supabase
        .from('communal_requests')
        .select('id, applicant_id, applicant_name, commune, zone, type, surface, status, priority, ai_score, created_at, updated_at')
        .order('created_at', { ascending: false });

      // Les mairies gèrent les demandes de leur commune si connue
      if (profile?.city) {
        query = query.eq('commune', profile.city);
      }

      const { data, error } = await query;
      if (error) throw error;

      const rows = data || [];
      setRequests(rows);

      // Regroupement par zone
      const map = new Map();
      rows.forEach((r) => {
        const key = r.zone || 'Zone non spécifiée';
        if (!map.has(key)) {
          map.set(key, {
            id: key,
            title: key,
            commune: r.commune || (profile?.city ?? '—'),
            requests: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
            surface: 0,
            lastDate: r.created_at
          });
        }
        const g = map.get(key);
        g.requests += 1;
        g.surface += Number(r.surface) || 0;
        if (r.status === 'approved') g.approved += 1;
        else if (r.status === 'pending') g.pending += 1;
        else if (r.status === 'rejected') g.rejected += 1;
        if (r.created_at && (!g.lastDate || r.created_at > g.lastDate)) g.lastDate = r.created_at;
      });
      setZones(Array.from(map.values()).sort((a, b) => b.requests - a.requests));
    } catch (err) {
      console.error('Erreur chargement zones communales:', err);
      setErrorData(err.message || 'Erreur de chargement');
      setRequests([]);
      setZones([]);
    } finally {
      setLoading(false);
    }
  }, [profile?.city]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved': return 'Approuvée';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejetée';
      default: return status || '—';
    }
  };

  const formatDate = (value) => {
    if (!value) return '—';
    try {
      return new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return '—';
    }
  };

  const calculateProgress = (zone) => {
    return zone.requests > 0 ? (zone.approved / zone.requests) * 100 : 0;
  };

  // Statistiques dérivées des données réelles
  const totalRequests = requests.length;
  const totalApproved = requests.filter((r) => r.status === 'approved').length;
  const totalPending = requests.filter((r) => r.status === 'pending').length;

  const filteredZones = zones.filter((z) =>
    !search || (z.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (z.commune || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Zones Communales</h2>
          <p className="text-gray-600 mt-1">
            Zones dérivées des demandes de terrains communaux
            {profile?.city ? ` — ${profile.city}` : ''}
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline" disabled={zones.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques (données réelles) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Zones Actives</p>
                <p className="text-2xl font-bold text-green-600">{loading ? '—' : zones.length}</p>
              </div>
              <Building className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Demandes</p>
                <p className="text-2xl font-bold text-blue-600">{loading ? '—' : totalRequests}</p>
              </div>
              <Ruler className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-purple-600">{loading ? '—' : totalPending}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attributions</p>
                <p className="text-2xl font-bold text-orange-600">{loading ? '—' : totalApproved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="zones">Mes Zones</TabsTrigger>
          <TabsTrigger value="candidatures">Candidatures</TabsTrigger>
          <TabsTrigger value="parametres">Paramètres</TabsTrigger>
        </TabsList>

        {/* Liste des zones */}
        <TabsContent value="zones" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher une zone..."
                  className="pl-10 w-80"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Chargement des zones...
            </div>
          ) : errorData ? (
            <Card>
              <CardContent className="p-10 text-center text-gray-500">
                <AlertTriangle className="h-8 w-8 mx-auto mb-3 text-red-400" />
                Impossible de charger les zones communales.
              </CardContent>
            </Card>
          ) : filteredZones.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center text-gray-500">
                <MapPin className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                Aucune zone communale.
                <p className="text-sm mt-1">
                  Les zones apparaîtront dès que des demandes de terrains communaux seront enregistrées.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredZones.map((zone) => (
                <Card key={zone.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{zone.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            <MapPin className="h-3 w-3 mr-1" />
                            {zone.commune}
                          </Badge>
                        </div>

                        <p className="text-gray-600 mb-4">
                          Dernière demande : {formatDate(zone.lastDate)}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Ruler className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {zone.surface > 0 ? `${zone.surface.toLocaleString()} m²` : '—'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{zone.requests} demandes</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{zone.pending} en attente</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{zone.approved} attribuées</span>
                          </div>
                        </div>

                        {/* Barre de progression : attributions / demandes */}
                        <div className="mb-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Parcelles attribuées</span>
                            <span>{zone.approved}/{zone.requests}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${calculateProgress(zone)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setActiveTab('candidatures'); setSearch(zone.title); }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Voir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Candidatures */}
        <TabsContent value="candidatures" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidatures Récentes</CardTitle>
              <CardDescription>Demandes de parcelles communales</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12 text-gray-500">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Chargement...
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                  Aucune candidature.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidat</TableHead>
                      <TableHead>Zone</TableHead>
                      <TableHead>Surface</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.slice(0, 50).map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.applicant_name || '—'}</TableCell>
                        <TableCell>{r.zone || '—'}</TableCell>
                        <TableCell>{r.surface ? `${Number(r.surface).toLocaleString()} m²` : '—'}</TableCell>
                        <TableCell>{formatDate(r.created_at)}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(r.status)}>
                            {getStatusLabel(r.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres */}
        <TabsContent value="parametres" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres des Zones Communales</CardTitle>
              <CardDescription>Configuration générale (bientôt disponible)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Publication automatique</h4>
                  <p className="text-sm text-gray-600">Publier automatiquement les nouvelles zones</p>
                </div>
                <Switch disabled />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Notifications candidatures</h4>
                  <p className="text-sm text-gray-600">Recevoir des notifications pour chaque nouvelle candidature</p>
                </div>
                <Switch disabled />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Validation automatique</h4>
                  <p className="text-sm text-gray-600">Valider automatiquement les candidatures conformes</p>
                </div>
                <Switch disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MairieZonesCommunales;

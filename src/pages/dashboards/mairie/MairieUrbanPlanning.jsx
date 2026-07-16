import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Map,
  Layers,
  Edit,
  Plus,
  Eye,
  Download,
  Settings,
  Home,
  TreePine,
  Factory,
  Camera,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ShoppingCart,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Couleur d'accent par type de zone
const TYPE_COLORS = {
  'Résidentielle': '#10B981',
  'residential': '#10B981',
  'Commerciale': '#3B82F6',
  'commercial': '#3B82F6',
  'Agricole': '#22C55E',
  'agricole': '#22C55E',
  'Industrielle': '#F59E0B',
  'industrial': '#F59E0B'
};

const MairieUrbanPlanning = ({ dashboardStats, profile: profileProp }) => {
  const { profile: profileCtx } = useAuth();
  const profile = profileProp || profileCtx;

  const [activeTab, setActiveTab] = useState('zones');
  const [selectedZone, setSelectedZone] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [properties, setProperties] = useState([]);

  // Chargement des données réelles (communal_requests + properties)
  useEffect(() => {
    let active = true;
    const load = async () => {
      setIsLoading(true);
      try {
        let reqQuery = supabase
          .from('communal_requests')
          .select('id, applicant_name, commune, zone, type, surface, status, priority, ai_score, created_at')
          .order('created_at', { ascending: false });
        // Les mairies gèrent les zones de leur commune si connue
        if (profile?.city) {
          reqQuery = reqQuery.eq('commune', profile.city);
        }

        let propQuery = supabase
          .from('properties')
          .select('id, title, name, type, price, surface, location, region, city, status, verification_status, estimated_value, created_at')
          .order('created_at', { ascending: false })
          .limit(50);
        if (profile?.city) {
          propQuery = propQuery.eq('city', profile.city);
        }

        const [{ data: reqData }, { data: propData }] = await Promise.all([reqQuery, propQuery]);
        if (!active) return;
        setRequests(Array.isArray(reqData) ? reqData : []);
        setProperties(Array.isArray(propData) ? propData : []);
      } catch (e) {
        if (!active) return;
        setRequests([]);
        setProperties([]);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [profile?.city]);

  // Agrégation des zones urbaines à partir des demandes communales réelles (regroupées par zone)
  const urbanZones = useMemo(() => {
    const map = new Map();
    requests.forEach((r) => {
      const key = r.zone || 'Zone non précisée';
      if (!map.has(key)) {
        map.set(key, {
          id: `zone-${key}`,
          name: key,
          commune: r.commune || null,
          types: {},
          totalSurface: 0,
          total: 0,
          approved: 0,
          pending: 0,
          rejected: 0
        });
      }
      const z = map.get(key);
      z.total += 1;
      if (r.type) z.types[r.type] = (z.types[r.type] || 0) + 1;
      const s = Number(r.surface);
      if (!Number.isNaN(s)) z.totalSurface += s;
      if (r.status === 'approved') z.approved += 1;
      else if (r.status === 'rejected') z.rejected += 1;
      else if (r.status === 'pending') z.pending += 1;
    });

    return Array.from(map.values()).map((z) => {
      const dominantType = Object.entries(z.types).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
      const approvalRate = z.total ? Math.round((z.approved / z.total) * 100) : 0;
      return {
        ...z,
        type: dominantType,
        approvalRate,
        color: TYPE_COLORS[dominantType] || '#0d9488'
      };
    }).sort((a, b) => b.total - a.total);
  }, [requests]);

  const getZoneTypeIcon = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('résidentiel') || t.includes('residential') || t.includes('habitat')) return Home;
    if (t.includes('commerc')) return ShoppingCart;
    if (t.includes('agric')) return TreePine;
    if (t.includes('industri')) return Factory;
    return Building2;
  };

  const getRequestStatusBadge = (rate) => {
    if (rate >= 66) return 'bg-green-100 text-green-800';
    if (rate >= 33) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPropertyStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'available':
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'sold':
      case 'vendu': return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'en_cours': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatXOF = (v) => {
    const n = Number(v);
    if (!v || Number.isNaN(n)) return '—';
    return `${n.toLocaleString('fr-FR')} FCFA`;
  };

  const handleViewDetails = (zone) => setSelectedZone(zone);

  const notifySoon = (label) => {
    window.safeGlobalToast?.({
      title: label,
      description: 'Bientôt disponible',
      variant: 'default'
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Planification Urbaine</h2>
          <p className="text-gray-600 mt-1">
            Gestion et développement du territoire municipal
            {profile?.city ? ` — ${profile.city}` : ''}
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline" onClick={() => notifySoon('Export du plan')}>
            <Download className="h-4 w-4 mr-2" />
            Export Plan
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => notifySoon('Nouveau projet')}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Projet
          </Button>
        </div>
      </div>

      {/* Tabs navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="zones">Zones Urbaines</TabsTrigger>
          <TabsTrigger value="projects">Parcelles / Projets</TabsTrigger>
          <TabsTrigger value="regulations">Réglementations</TabsTrigger>
          <TabsTrigger value="map">Carte Interactive</TabsTrigger>
        </TabsList>

        {/* Zones Urbaines — agrégées depuis communal_requests */}
        <TabsContent value="zones" className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Chargement des zones...
            </div>
          ) : urbanZones.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-gray-500">
                <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-700">Aucune zone communale</p>
                <p className="text-sm mt-1">
                  Les zones apparaîtront ici dès qu'une demande de terrain communal sera enregistrée
                  {profile?.city ? ` pour ${profile.city}` : ''}.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {urbanZones.map((zone) => {
                const IconComponent = getZoneTypeIcon(zone.type);
                return (
                  <motion.div
                    key={zone.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => handleViewDetails(zone)}
                  >
                    <Card className="h-full border-l-4" style={{ borderLeftColor: zone.color }}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg" style={{ backgroundColor: `${zone.color}20` }}>
                              <IconComponent className="h-5 w-5" style={{ color: zone.color }} />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{zone.name}</CardTitle>
                              <CardDescription>{zone.type}</CardDescription>
                            </div>
                          </div>
                          <Badge className={getRequestStatusBadge(zone.approvalRate)}>
                            {zone.approvalRate}% approuvé
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Statistiques réelles */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Demandes</span>
                            <p className="font-medium text-gray-900">{zone.total}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Surface cumulée</span>
                            <p className="font-medium text-gray-900">
                              {zone.totalSurface ? `${zone.totalSurface.toLocaleString('fr-FR')} m²` : '—'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Approuvées</span>
                            <p className="font-medium text-green-700">{zone.approved}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">En attente</span>
                            <p className="font-medium text-yellow-700">{zone.pending}</p>
                          </div>
                        </div>

                        {/* Taux d'approbation réel */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Taux d'approbation</span>
                            <span className="text-sm font-medium text-gray-900">{zone.approvalRate}%</span>
                          </div>
                          <Progress value={zone.approvalRate} className="h-2" />
                        </div>

                        {zone.rejected > 0 && (
                          <p className="text-xs text-gray-500">{zone.rejected} demande(s) rejetée(s)</p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Parcelles / Projets — depuis properties (territoire réel) */}
        <TabsContent value="projects" className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Chargement des parcelles...
            </div>
          ) : properties.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-gray-500">
                <Map className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-700">Aucune parcelle enregistrée</p>
                <p className="text-sm mt-1">
                  Les parcelles et projets fonciers du territoire s'afficheront ici dès leur enregistrement.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {properties.map((prop) => (
                <Card key={prop.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{prop.title || prop.name || 'Parcelle'}</CardTitle>
                        <CardDescription>
                          {[prop.type, prop.city || prop.location, prop.region].filter(Boolean).join(' • ') || '—'}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        {prop.verification_status && (
                          <Badge variant="secondary">{prop.verification_status}</Badge>
                        )}
                        <Badge className={getPropertyStatusColor(prop.status)}>
                          {prop.status || '—'}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => notifySoon('Détail parcelle')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Prix</span>
                        <p className="font-medium text-gray-900">{formatXOF(prop.price)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Valeur estimée</span>
                        <p className="font-medium text-gray-900">{formatXOF(prop.estimated_value)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Surface</span>
                        <p className="font-medium text-gray-900">
                          {prop.surface ? `${Number(prop.surface).toLocaleString('fr-FR')} m²` : '—'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Enregistrée le</span>
                        <p className="font-medium text-gray-900">
                          {prop.created_at ? new Date(prop.created_at).toLocaleDateString('fr-FR') : '—'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Réglementations — pas de table source */}
        <TabsContent value="regulations" className="space-y-6">
          <Card>
            <CardContent className="py-16 text-center text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium text-gray-700">Réglementations d'urbanisme</p>
              <p className="text-sm mt-1">
                Le référentiel réglementaire municipal (COS, hauteurs, espaces verts) sera bientôt disponible.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Carte Interactive */}
        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="h-5 w-5 text-blue-600 mr-2" />
                Carte Interactive du Territoire
              </CardTitle>
              <CardDescription>
                Visualisation géographique des zones et parcelles
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8 text-center">
                <Map className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Carte Interactive
                </h3>
                <p className="text-gray-600 mb-4">
                  La cartographie géolocalisée du territoire sera bientôt disponible.
                </p>
                <div className="flex justify-center space-x-3">
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => notifySoon('Vue satellite')}>
                    <Camera className="h-4 w-4 mr-2" />
                    Vue Satellite
                  </Button>
                  <Button variant="outline" onClick={() => notifySoon('Calques')}>
                    <Layers className="h-4 w-4 mr-2" />
                    Calques
                  </Button>
                  <Button variant="outline" onClick={() => notifySoon('Configuration')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configuration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog détails zone sélectionnée */}
      {selectedZone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{selectedZone.name}</h3>
              <Button variant="ghost" onClick={() => setSelectedZone(null)} className="text-gray-600">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Caractéristiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Type dominant</span>
                      <p className="font-medium text-gray-900">{selectedZone.type}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Commune</span>
                      <p className="font-medium text-gray-900">{selectedZone.commune || '—'}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Surface cumulée</span>
                      <p className="font-medium text-gray-900">
                        {selectedZone.totalSurface ? `${selectedZone.totalSurface.toLocaleString('fr-FR')} m²` : '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Demandes totales</span>
                      <p className="font-medium text-gray-900">{selectedZone.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Traitement des demandes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-gray-700">{selectedZone.approved} approuvée(s)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-gray-700">{selectedZone.pending} en attente</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <X className="h-4 w-4 text-red-600" />
                      <span className="text-gray-700">{selectedZone.rejected} rejetée(s)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setSelectedZone(null)}>
                Fermer
              </Button>
              <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => notifySoon('Modification de zone')}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier Zone
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MairieUrbanPlanning;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Map,
  Plus,
  Search,
  Upload,
  MapPin,
  FileText,
  Eye,
  Edit,
  Download,
  Layers,
  Target,
  Building,
  Ruler,
  Navigation,
  Satellite,
  Loader2,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const GeometreCadastral = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('tous');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [parcelles, setParcelles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cadastre → table réelle `properties` (parcelles gérées par le géomètre, owner_id = user.id)
  useEffect(() => {
    const loadParcelles = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setParcelles(data || []);
      } catch (err) {
        console.error('Erreur chargement parcelles:', err);
        setParcelles([]);
      } finally {
        setLoading(false);
      }
    };

    loadParcelles();
  }, [user?.id]);

  // ---- Helpers de formatage (aucune valeur fabriquée) ----
  const formatSurface = (value) => {
    if (value === null || value === undefined || value === '') return '—';
    const num = Number(value);
    if (Number.isNaN(num)) return '—';
    return `${num.toLocaleString('fr-FR')} m²`;
  };

  const formatPrice = (value) => {
    if (value === null || value === undefined || value === '') return '—';
    const num = Number(value);
    if (Number.isNaN(num)) return '—';
    return `${num.toLocaleString('fr-FR')} XOF`;
  };

  const formatDate = (value) => {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('fr-FR');
  };

  const getLieu = (parcelle) =>
    parcelle.location || [parcelle.city, parcelle.region].filter(Boolean).join(', ') || '—';

  const getTitre = (parcelle) =>
    parcelle.title || parcelle.name || `Parcelle ${String(parcelle.id).slice(0, 8)}`;

  const getVerificationColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationLabel = (status) => {
    switch (status) {
      case 'verified': return 'Vérifiée';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejetée';
      default: return status || 'Non vérifiée';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-blue-100 text-blue-800';
      case 'sold': return 'bg-gray-100 text-gray-800';
      case 'reserved': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Options de filtres dérivées des vraies données (pas d'énumération codée en dur)
  const typeOptions = [...new Set(parcelles.map(p => p.type).filter(Boolean))];
  const verificationOptions = [...new Set(parcelles.map(p => p.verification_status).filter(Boolean))];

  const filteredParcelles = parcelles.filter(parcelle => {
    const haystack = [
      getTitre(parcelle),
      getLieu(parcelle),
      parcelle.type,
      parcelle.region,
      parcelle.city
    ].filter(Boolean).join(' ').toLowerCase();

    const matchesSearch = haystack.includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'tous' || parcelle.type === typeFilter;
    const matchesStatus = statusFilter === 'tous' || parcelle.verification_status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // ---- Statistiques réelles (agrégats calculés sur les vraies parcelles) ----
  const totalSurface = parcelles.reduce((sum, p) => {
    const n = Number(p.surface);
    return Number.isNaN(n) ? sum : sum + n;
  }, 0);

  const totalValeur = parcelles.reduce((sum, p) => {
    const n = Number(p.price);
    return Number.isNaN(n) ? sum : sum + n;
  }, 0);

  const nbVerifiees = parcelles.filter(p => p.verification_status === 'verified').length;

  const stats = [
    {
      title: 'Total Parcelles',
      value: parcelles.length,
      icon: Map,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Parcelles Vérifiées',
      value: nbVerifiees,
      icon: ShieldCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Surface Totale',
      value: totalSurface > 0 ? formatSurface(totalSurface) : '—',
      icon: Ruler,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Valeur Totale',
      value: totalValeur > 0 ? formatPrice(totalValeur) : '—',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gray-50 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cadastre & Foncier</h1>
          <p className="text-gray-600 mt-1">Gestion du patrimoine foncier et cadastral</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Cadastre
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Parcelle
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par titre, type ou localisation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type de bien" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous types</SelectItem>
                {typeOptions.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Vérification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous statuts</SelectItem>
                {verificationOptions.map((s) => (
                  <SelectItem key={s} value={s}>{getVerificationLabel(s)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cadastral Tabs */}
      <Tabs defaultValue="parcelles" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="parcelles">Parcelles</TabsTrigger>
          <TabsTrigger value="carte">Carte Cadastrale</TabsTrigger>
          <TabsTrigger value="repartition">Répartition</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="parcelles" className="mt-6">
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-gray-500">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Chargement des parcelles...
              </div>
            ) : filteredParcelles.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-gray-500">
                  <Map className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium text-gray-700">Aucune parcelle</p>
                  <p className="text-sm mt-1">
                    {searchTerm || typeFilter !== 'tous' || statusFilter !== 'tous'
                      ? 'Aucune parcelle ne correspond à vos critères.'
                      : 'Vos parcelles cadastrales apparaîtront ici une fois enregistrées.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredParcelles.map((parcelle, index) => {
                const hasCoords = parcelle.latitude != null && parcelle.longitude != null;
                return (
                  <motion.div
                    key={parcelle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                              <Building className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-2 flex-wrap">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {getTitre(parcelle)}
                                </h3>
                                {parcelle.type && (
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {parcelle.type}
                                  </Badge>
                                )}
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium text-gray-900">Identification</h4>
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-3 w-3" />
                                      {getLieu(parcelle)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Ruler className="h-3 w-3" />
                                      {formatSurface(parcelle.surface)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Navigation className="h-3 w-3" />
                                      {hasCoords
                                        ? `${Number(parcelle.latitude).toFixed(4)}, ${Number(parcelle.longitude).toFixed(4)}`
                                        : 'Coordonnées non renseignées'}
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium text-gray-900">Statut</h4>
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="h-3 w-3" />
                                      {getVerificationLabel(parcelle.verification_status)}
                                    </div>
                                    {parcelle.region && (
                                      <div className="text-xs text-gray-500">
                                        Région: {parcelle.region}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium text-gray-900">Valorisation</h4>
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <div>Valeur: {formatPrice(parcelle.price)}</div>
                                    <div className="text-xs text-gray-500">
                                      Enregistré: {formatDate(parcelle.created_at)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div className="flex gap-2 flex-wrap justify-end">
                              <Badge className={getVerificationColor(parcelle.verification_status)}>
                                {getVerificationLabel(parcelle.verification_status)}
                              </Badge>
                              {parcelle.status && (
                                <Badge className={getStatusColor(parcelle.status)}>
                                  {parcelle.status}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end pt-4 border-t">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Détails
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Modifier
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4 mr-2" />
                              Certificat
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="carte" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="h-5 w-5 mr-2" />
                Carte Cadastrale Interactive
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Satellite className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Visualisation Cadastrale
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Carte interactive avec parcelles, limites et superposition satellite
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button>
                      Ouvrir Carte
                    </Button>
                    <Button variant="outline">
                      <Layers className="h-4 w-4 mr-2" />
                      Calques
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repartition" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type de Bien</CardTitle>
              </CardHeader>
              <CardContent>
                {typeOptions.length === 0 ? (
                  <p className="text-sm text-gray-500 py-6 text-center">Aucune parcelle enregistrée.</p>
                ) : (
                  <div className="space-y-4">
                    {typeOptions.map((type) => {
                      const count = parcelles.filter(p => p.type === type).length;
                      return (
                        <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Building className="h-5 w-5 text-gray-600" />
                            <span className="font-medium capitalize">{type}</span>
                          </div>
                          <Badge variant="outline">{count} parcelle{count > 1 ? 's' : ''}</Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Région</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const regions = [...new Set(parcelles.map(p => p.region).filter(Boolean))];
                  if (regions.length === 0) {
                    return <p className="text-sm text-gray-500 py-6 text-center">Aucune région renseignée.</p>;
                  }
                  return (
                    <div className="space-y-3">
                      {regions.map((region) => {
                        const count = parcelles.filter(p => p.region === region).length;
                        const percentage = parcelles.length
                          ? (count / parcelles.length * 100).toFixed(1)
                          : '0.0';
                        return (
                          <div key={region} className="flex items-center justify-between">
                            <span className="text-sm">{region}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium w-12">{percentage}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Valeurs Foncières</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Analyse des Valeurs
                  </h3>
                  <p className="text-gray-600">
                    Évolution des prix au m² par zone et par usage — bientôt disponible.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Indicateurs du Portefeuille</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Parcelles enregistrées</span>
                    <span className="font-medium">{parcelles.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Parcelles vérifiées</span>
                    <span className="font-medium">{nbVerifiees}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Surface totale</span>
                    <span className="font-medium">{totalSurface > 0 ? formatSurface(totalSurface) : '—'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Valeur totale</span>
                    <span className="font-medium">{totalValeur > 0 ? formatPrice(totalValeur) : '—'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default GeometreCadastral;

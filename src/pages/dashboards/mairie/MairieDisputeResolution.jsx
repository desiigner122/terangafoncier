import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  MessageSquare,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Flag,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Gavel,
  Scale,
  Target,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Libellés d'affichage pour les statuts réels de la table `disputes`
const STATUS_LABELS = {
  open: 'En cours',
  resolved: 'Résolu',
  pending: 'En attente',
  closed: 'Clôturé'
};

const statusLabel = (status) => STATUS_LABELS[status] || (status || 'Inconnu');

// Normalise le champ jsonb `parties` (formes possibles : tableau d'objets,
// tableau de chaînes, ou chaîne JSON) vers un tableau { name, role, contact }.
const normalizeParties = (parties) => {
  if (!parties) return [];
  let arr = parties;
  if (typeof arr === 'string') {
    try { arr = JSON.parse(arr); } catch { return []; }
  }
  if (!Array.isArray(arr)) {
    if (Array.isArray(arr?.parties)) arr = arr.parties;
    else return [];
  }
  return arr.map((p) => {
    if (typeof p === 'string') return { name: p, role: '', contact: '' };
    if (!p || typeof p !== 'object') return { name: '—', role: '', contact: '' };
    return {
      name: p.name || p.nom || p.fullName || p.full_name || '—',
      role: p.role || p.type || p.qualite || '',
      contact: p.contact || p.phone || p.telephone || p.email || ''
    };
  });
};

const MairieDisputeResolution = ({ dashboardStats }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('disputes');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDispute, setSelectedDispute] = useState(null);

  const [disputes, setDisputes] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState(null);
  const [actioningId, setActioningId] = useState(null);

  const loadDisputes = useCallback(async () => {
    setLoadingData(true);
    setErrorData(null);
    try {
      const { data, error } = await supabase
        .from('disputes')
        .select('id, title, property_id, status, parties, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mapped = (data || []).map((d) => {
        const isResolved = d.status === 'resolved' || d.status === 'closed';
        return {
          id: d.id,
          title: d.title || 'Litige sans titre',
          propertyId: d.property_id || null,
          status: d.status || 'open',
          statusText: statusLabel(d.status),
          parties: normalizeParties(d.parties),
          createdAt: d.created_at,
          updatedAt: d.updated_at,
          isResolved,
          // Champs non présents dans la table réelle -> valeurs honnêtes
          resolutionProgress: isResolved ? 100 : null
        };
      });
      setDisputes(mapped);
    } catch (err) {
      console.error('Erreur chargement litiges:', err);
      setErrorData(err.message || 'Erreur de chargement des litiges');
      setDisputes([]);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    loadDisputes();
  }, [loadDisputes]);

  // Traitement = update du statut vers 'resolved'
  const handleResolve = async (dispute) => {
    if (!dispute?.id) return;
    setActioningId(dispute.id);
    try {
      const { error } = await supabase
        .from('disputes')
        .update({ status: 'resolved', updated_at: new Date().toISOString() })
        .eq('id', dispute.id);
      if (error) throw error;
      await loadDisputes();
      setSelectedDispute(null);
    } catch (err) {
      console.error('Erreur résolution litige:', err);
      setErrorData(err.message || 'Erreur lors de la mise à jour du litige');
    } finally {
      setActioningId(null);
    }
  };

  // Statistiques calculées à partir des vraies données
  const totalDisputes = disputes.length;
  const openCount = disputes.filter((d) => !d.isResolved).length;
  const resolvedCount = disputes.filter((d) => d.isResolved).length;
  const successRate = totalDisputes > 0 ? Math.round((resolvedCount / totalDisputes) * 100) : null;

  const now = new Date();
  const resolvedThisMonth = disputes.filter((d) => {
    if (!d.isResolved || !d.updatedAt) return false;
    const dt = new Date(d.updatedAt);
    return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
  }).length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimelineStatus = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-blue-500';
      case 'upcoming': return 'bg-gray-300';
      default: return 'bg-gray-300';
    }
  };

  // Chronologie construite à partir des seules dates réelles disponibles
  const buildTimeline = (dispute) => {
    const events = [];
    if (dispute.createdAt) {
      events.push({ date: dispute.createdAt, event: 'Litige enregistré', status: 'completed' });
    }
    if (dispute.updatedAt && dispute.updatedAt !== dispute.createdAt) {
      events.push({
        date: dispute.updatedAt,
        event: dispute.isResolved ? 'Litige résolu' : 'Dernière mise à jour',
        status: dispute.isResolved ? 'completed' : 'pending'
      });
    }
    return events;
  };

  const filteredDisputes = disputes.filter((dispute) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      dispute.title.toLowerCase().includes(q) ||
      dispute.parties.some((party) => (party.name || '').toLowerCase().includes(q));
    const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Résolution de Conflits</h2>
          <p className="text-gray-600 mt-1">
            Médiation et arbitrage des litiges fonciers
          </p>
        </div>

        <Button className="bg-teal-600 hover:bg-teal-700 mt-4 lg:mt-0" disabled title="Bientôt disponible">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Conflit
        </Button>
      </div>

      {errorData && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-sm text-red-700 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {errorData}
          </CardContent>
        </Card>
      )}

      {/* Statistiques rapides (calculées sur les vraies données) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Conflits</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loadingData ? '—' : totalDisputes}
                </p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Cours</p>
                <p className="text-2xl font-bold text-orange-600">
                  {loadingData ? '—' : openCount}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Résolus</p>
                <p className="text-2xl font-bold text-green-600">
                  {loadingData ? '—' : resolvedCount}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux Réussite</p>
                <p className="text-2xl font-bold text-purple-600">
                  {loadingData || successRate === null ? '—' : `${successRate}%`}
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="disputes">Conflits Actifs</TabsTrigger>
          <TabsTrigger value="mediation">Types de Médiation</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
        </TabsList>

        {/* Conflits Actifs */}
        <TabsContent value="disputes" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Rechercher par titre ou parties..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="open">En cours</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="resolved">Résolu</SelectItem>
                    <SelectItem value="closed">Clôturé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste des conflits */}
          {loadingData ? (
            <Card>
              <CardContent className="p-12 flex items-center justify-center text-gray-500">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Chargement des litiges...
              </CardContent>
            </Card>
          ) : filteredDisputes.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                <Scale className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                <p className="font-medium text-gray-600">Aucun litige à afficher</p>
                <p className="text-sm mt-1">
                  {disputes.length === 0
                    ? "Aucun litige n'est enregistré pour le moment."
                    : 'Aucun litige ne correspond à votre recherche.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredDisputes.map((dispute) => (
                <Card key={dispute.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {dispute.title}
                          </h3>
                          <Badge className={getStatusColor(dispute.status)}>
                            {dispute.statusText}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Soumis le{' '}
                              {dispute.createdAt
                                ? new Date(dispute.createdAt).toLocaleDateString('fr-FR')
                                : '—'}
                            </span>
                          </div>
                          {dispute.propertyId && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>Bien lié</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedDispute(dispute)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!dispute.isResolved && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResolve(dispute)}
                            disabled={actioningId === dispute.id}
                            title="Marquer comme résolu"
                          >
                            {actioningId === dispute.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Parties impliquées */}
                    <div className="mb-4">
                      <span className="text-sm text-gray-600 mb-2 block">Parties impliquées:</span>
                      {dispute.parties.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {dispute.parties.map((party, index) => (
                            <div key={index} className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full">
                              <Users className="h-3 w-3 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">{party.name}</span>
                              {party.role && (
                                <span className="text-xs text-gray-500">({party.role})</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Aucune partie renseignée</span>
                      )}
                    </div>

                    {/* Progression */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Progression de résolution</span>
                        <span className="text-sm font-medium text-gray-900">
                          {dispute.resolutionProgress === null
                            ? dispute.statusText
                            : `${dispute.resolutionProgress}%`}
                        </span>
                      </div>
                      {dispute.resolutionProgress !== null && (
                        <Progress value={dispute.resolutionProgress} className="h-2" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Types de Médiation (catalogue informatif statique) */}
        <TabsContent value="mediation" className="space-y-6">
          <Card>
            <CardContent className="p-4 text-sm text-gray-500 flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 text-gray-400" />
              Catalogue indicatif des dispositifs de médiation proposés par la commune.
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                id: 'mediation-1',
                type: 'Médiation Communautaire',
                description: "Résolution à l'amiable avec sages du quartier",
                duration: '15-30 jours',
                cost: 'Gratuit'
              },
              {
                id: 'mediation-2',
                type: 'Arbitrage Juridique',
                description: 'Procédure formelle avec conseiller juridique',
                duration: '30-60 jours',
                cost: '50 000 FCFA'
              },
              {
                id: 'mediation-3',
                type: 'Expertise Technique',
                description: 'Intervention géomètre et expert foncier',
                duration: '45-90 jours',
                cost: '150 000 FCFA'
              }
            ].map((mediation) => (
              <Card key={mediation.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    {mediation.type}
                  </CardTitle>
                  <CardDescription>{mediation.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Durée indicative</span>
                      <p className="font-medium text-gray-900">{mediation.duration}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Coût</span>
                      <p className="font-medium text-gray-900">{mediation.cost}</p>
                    </div>
                  </div>

                  <Button className="w-full bg-teal-600 hover:bg-teal-700" disabled title="Bientôt disponible">
                    Choisir cette médiation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Statistiques (calculées sur les vraies données) */}
        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Statut</CardTitle>
              </CardHeader>
              <CardContent>
                {totalDisputes === 0 ? (
                  <p className="text-sm text-gray-500">Aucune donnée disponible.</p>
                ) : (
                  <div className="space-y-4">
                    {[
                      { key: 'open', label: 'En cours', color: 'bg-blue-600' },
                      { key: 'pending', label: 'En attente', color: 'bg-yellow-500' },
                      { key: 'resolved', label: 'Résolus', color: 'bg-green-600' },
                      { key: 'closed', label: 'Clôturés', color: 'bg-gray-500' }
                    ]
                      .map((s) => ({
                        ...s,
                        count: disputes.filter((d) => d.status === s.key).length
                      }))
                      .filter((s) => s.count > 0)
                      .map((s) => {
                        const pct = Math.round((s.count / totalDisputes) * 100);
                        return (
                          <div key={s.key} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{s.label}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div className={`${s.color} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-sm font-medium">{s.count} ({pct}%)</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {loadingData ? '—' : resolvedThisMonth}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">Conflits résolus ce mois</div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {loadingData ? '—' : openCount}
                  </div>
                  <div className="text-sm text-gray-600">En cours de traitement</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog détails conflit */}
      {selectedDispute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedDispute.title}
              </h3>
              <Button
                variant="ghost"
                onClick={() => setSelectedDispute(null)}
                className="text-gray-600"
              >
                ×
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Chronologie du Conflit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {buildTimeline(selectedDispute).map((event, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-1 ${getTimelineStatus(event.status)}`} />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{event.event}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(event.date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Informations détaillées */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations Détaillées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">Statut</span>
                    <p className="font-medium text-gray-900">{selectedDispute.statusText}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Bien concerné</span>
                    <p className="font-medium text-gray-900">
                      {selectedDispute.propertyId || 'Non rattaché à un bien'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Parties impliquées</span>
                    {selectedDispute.parties.length > 0 ? (
                      <div className="space-y-1 mt-1">
                        {selectedDispute.parties.map((party, index) => (
                          <p key={index} className="font-medium text-gray-900 text-sm">
                            {party.name}
                            {party.role ? ` — ${party.role}` : ''}
                            {party.contact ? ` (${party.contact})` : ''}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="font-medium text-gray-400">Aucune partie renseignée</p>
                    )}
                  </div>
                  {!selectedDispute.isResolved && (
                    <Button
                      className="w-full bg-teal-600 hover:bg-teal-700"
                      onClick={() => handleResolve(selectedDispute)}
                      disabled={actioningId === selectedDispute.id}
                    >
                      {actioningId === selectedDispute.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Marquer comme résolu
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MairieDisputeResolution;

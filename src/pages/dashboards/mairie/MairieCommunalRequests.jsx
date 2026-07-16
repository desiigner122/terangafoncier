import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  MapPin,
  Calendar,
  Star,
  Download,
  Upload,
  MessageSquare,
  Phone,
  Mail,
  Flag,
  Building,
  Users,
  Activity,
  Loader2,
  Inbox
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Correspondance statut base -> libellé FR affiché
const STATUS_LABELS = {
  pending: 'En Attente',
  in_review: 'En Évaluation',
  evaluation: 'En Évaluation',
  approved: 'Approuvé',
  rejected: 'Rejeté',
  cancelled: 'Annulé'
};

const getStatusLabel = (status) => STATUS_LABELS[status] || (status || '—');

// Correspondance priorité base -> libellé FR affiché
const PRIORITY_LABELS = {
  high: 'Haute',
  medium: 'Moyenne',
  normal: 'Normale',
  low: 'Normale'
};

const getPriorityLabel = (priority) => PRIORITY_LABELS[priority] || (priority || 'Normale');

const MairieCommunalRequests = ({ dashboardStats, profile: profileProp }) => {
  const { user, profile: profileCtx } = useAuth();
  const profile = profileProp || profileCtx;

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [requests, setRequests] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState(null);
  const [actioningId, setActioningId] = useState(null);

  // Chargement des demandes communales réelles
  const fetchRequests = useCallback(async () => {
    setLoadingData(true);
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
      setRequests(data || []);
    } catch (err) {
      console.error('Erreur chargement communal_requests:', err);
      setErrorData(err.message || 'Erreur de chargement');
      setRequests([]);
    } finally {
      setLoadingData(false);
    }
  }, [profile?.city]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Mise à jour réelle du statut (approuver / rejeter)
  const updateStatus = async (requestId, newStatus, labels) => {
    setActioningId(requestId);
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('communal_requests')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', requestId);
      if (error) throw error;

      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
      );
      setSelectedRequest((prev) =>
        prev && prev.id === requestId ? { ...prev, status: newStatus } : prev
      );

      window.safeGlobalToast?.({
        title: labels.title,
        description: labels.description,
        variant: labels.variant
      });
    } catch (err) {
      console.error('Erreur mise à jour statut:', err);
      window.safeGlobalToast?.({
        title: 'Erreur',
        description: "La mise à jour du statut a échoué",
        variant: 'destructive'
      });
    } finally {
      setActioningId(null);
      setIsLoading(false);
    }
  };

  const handleApproveRequest = (requestId) =>
    updateStatus(requestId, 'approved', {
      title: 'Demande approuvée',
      description: 'La demande a été approuvée avec succès',
      variant: 'success'
    });

  const handleRejectRequest = (requestId) =>
    updateStatus(requestId, 'rejected', {
      title: 'Demande rejetée',
      description: 'La demande a été rejetée',
      variant: 'destructive'
    });

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };

  const handleCreateNewRequest = () => {
    window.safeGlobalToast?.({
      title: 'Bientôt disponible',
      description: "La création de demande communale depuis la mairie sera bientôt disponible",
      variant: 'default'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_review':
      case 'evaluation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'normal':
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getAIScoreColor = (score) => {
    if (score == null) return 'text-gray-400';
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatSurface = (surface) => {
    if (surface == null || surface === '') return '—';
    return `${surface} m²`;
  };

  const filteredRequests = requests.filter((request) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (request.applicant_name || '').toLowerCase().includes(q) ||
      String(request.id || '').toLowerCase().includes(q) ||
      (request.type || '').toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getRequestsByStatus = (status) => {
    if (status === 'all') return filteredRequests;
    return filteredRequests.filter((request) => request.status === status);
  };

  const RequestDetailsDialog = () => (
    <Dialog open={selectedRequest !== null} onOpenChange={() => setSelectedRequest(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {selectedRequest && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-blue-600" />
                <span>Détails de la Demande {selectedRequest.id}</span>
                <Badge className={`${getStatusColor(selectedRequest.status)} border`}>
                  {getStatusLabel(selectedRequest.status)}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                {selectedRequest.created_at
                  ? `Soumise le ${new Date(selectedRequest.created_at).toLocaleDateString('fr-FR')}`
                  : 'Date de soumission inconnue'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Informations demandeur */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <User className="h-5 w-5 text-blue-600 mr-2" />
                    Informations Demandeur
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nom complet</label>
                    <p className="text-gray-900">{selectedRequest.applicant_name || '—'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Commune</label>
                    <p className="text-gray-900 flex items-center">
                      <Building className="h-4 w-4 mr-2 text-teal-600" />
                      {selectedRequest.commune || '—'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Identifiant demandeur</label>
                    <p className="text-gray-900 text-sm">{selectedRequest.applicant_id || 'Non renseigné'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Détails de la demande */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Building className="h-5 w-5 text-green-600 mr-2" />
                    Détails Demande
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Type de demande</label>
                    <p className="text-gray-900">{selectedRequest.type || '—'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Surface demandée</label>
                    <p className="text-gray-900">{formatSurface(selectedRequest.surface)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Zone</label>
                    <p className="text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                      {selectedRequest.zone || '—'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Évaluation IA */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Star className="h-5 w-5 text-yellow-600 mr-2" />
                    Évaluation IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl font-bold text-gray-900">
                      {selectedRequest.ai_score != null ? `${selectedRequest.ai_score}%` : '—'}
                    </div>
                    <div className={`text-sm font-medium ${getAIScoreColor(selectedRequest.ai_score)}`}>
                      Score de compatibilité
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Priorité</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedRequest.priority)}`} />
                      <span className="text-gray-900">{getPriorityLabel(selectedRequest.priority)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Dernière mise à jour</label>
                    <p className="text-gray-900">
                      {selectedRequest.updated_at
                        ? new Date(selectedRequest.updated_at).toLocaleDateString('fr-FR')
                        : '—'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Suivi */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Activity className="h-5 w-5 text-purple-600 mr-2" />
                    Suivi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Statut actuel</span>
                    <Badge className={`${getStatusColor(selectedRequest.status)} border`}>
                      {getStatusLabel(selectedRequest.status)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Date de soumission</span>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedRequest.created_at
                        ? new Date(selectedRequest.created_at).toLocaleDateString('fr-FR')
                        : '—'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 pt-2">
                    Le suivi détaillé par étapes sera bientôt disponible.
                  </p>
                </CardContent>
              </Card>

              {/* Actions de traitement */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MessageSquare className="h-5 w-5 text-orange-600 mr-2" />
                    Traitement de la Demande
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleApproveRequest(selectedRequest.id)}
                      disabled={isLoading || selectedRequest.status === 'approved'}
                    >
                      {actioningId === selectedRequest.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Approuver
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                      onClick={() => handleRejectRequest(selectedRequest.id)}
                      disabled={isLoading || selectedRequest.status === 'rejected'}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rejeter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Demandes Communales</h2>
          <p className="text-gray-600 mt-1">
            Gestion des demandes d'attribution foncière communale
            {profile?.city ? ` — ${profile.city}` : ''}
          </p>
        </div>

        <Button
          onClick={handleCreateNewRequest}
          className="bg-teal-600 hover:bg-teal-700 mt-4 lg:mt-0"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Demande
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, ID ou type de demande..."
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
                <SelectItem value="pending">En Attente</SelectItem>
                <SelectItem value="in_review">En Évaluation</SelectItem>
                <SelectItem value="approved">Approuvé</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes priorités</SelectItem>
                <SelectItem value="high">Haute</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="normal">Normale</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Onglets par statut */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            Toutes ({filteredRequests.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            En Attente ({getRequestsByStatus('pending').length})
          </TabsTrigger>
          <TabsTrigger value="in_review">
            En Évaluation ({getRequestsByStatus('in_review').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approuvées ({getRequestsByStatus('approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejetées ({getRequestsByStatus('rejected').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardContent className="p-0">
              {loadingData ? (
                <div className="flex items-center justify-center py-16 text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin mr-3" />
                  Chargement des demandes...
                </div>
              ) : errorData ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <AlertTriangle className="h-10 w-10 text-red-400 mb-3" />
                  <p className="text-gray-700 font-medium">Impossible de charger les demandes</p>
                  <p className="text-sm text-gray-500 mt-1">{errorData}</p>
                  <Button variant="outline" className="mt-4" onClick={fetchRequests}>
                    Réessayer
                  </Button>
                </div>
              ) : getRequestsByStatus(activeTab).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Inbox className="h-10 w-10 text-gray-300 mb-3" />
                  <p className="text-gray-700 font-medium">Aucune demande</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Aucune demande communale ne correspond à ces critères pour le moment.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Demandeur</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Zone</TableHead>
                      <TableHead>Surface</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Score IA</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getRequestsByStatus(activeTab).map((request) => (
                      <TableRow key={request.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{request.applicant_name || '—'}</div>
                            <div className="text-sm text-gray-600">{request.commune || ''}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="text-sm font-medium">{request.type || '—'}</div>
                            <div className="flex items-center mt-1">
                              <div className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(request.priority)}`} />
                              <span className="text-xs text-gray-600">{getPriorityLabel(request.priority)}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">{request.zone || '—'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-gray-900">{formatSurface(request.surface)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(request.status)} border`}>
                            {getStatusLabel(request.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className={`text-sm font-medium ${getAIScoreColor(request.ai_score)}`}>
                            {request.ai_score != null ? `${request.ai_score}%` : '—'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-900">
                            {request.created_at
                              ? new Date(request.created_at).toLocaleDateString('fr-FR')
                              : '—'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(request)}
                              title="Voir les détails"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {request.status !== 'approved' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:bg-green-50"
                                onClick={() => handleApproveRequest(request.id)}
                                disabled={isLoading}
                                title="Approuver"
                              >
                                {actioningId === request.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                            {request.status !== 'rejected' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => handleRejectRequest(request.id)}
                                disabled={isLoading}
                                title="Rejeter"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog de détails */}
      <RequestDetailsDialog />
    </div>
  );
};

export default MairieCommunalRequests;

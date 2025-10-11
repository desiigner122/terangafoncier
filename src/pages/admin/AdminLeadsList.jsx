import { useState, useEffect } from 'react';
import { useAdminLeads } from '@/hooks/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Mail, 
  Phone, 
  Calendar,
  Filter,
  Search,
  UserPlus,
  MessageSquare,
  Trash2,
  CheckCircle,
  Clock,
  TrendingUp,
  XCircle,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS_CONFIG = {
  new: { 
    label: 'Nouveau', 
    color: 'bg-blue-100 text-blue-800 border-blue-200', 
    icon: Clock 
  },
  contacted: { 
    label: 'Contacté', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
    icon: MessageSquare 
  },
  qualified: { 
    label: 'Qualifié', 
    color: 'bg-purple-100 text-purple-800 border-purple-200', 
    icon: Target 
  },
  converted: { 
    label: 'Converti', 
    color: 'bg-green-100 text-green-800 border-green-200', 
    icon: CheckCircle 
  },
  lost: { 
    label: 'Perdu', 
    color: 'bg-gray-100 text-gray-800 border-gray-200', 
    icon: XCircle 
  }
};

const SOURCE_LABELS = {
  contact_form: 'Formulaire contact',
  property_inquiry: 'Demande propriété',
  phone_call: 'Appel téléphonique',
  email: 'Email direct',
  chat: 'Chat en ligne',
  referral: 'Référence',
  other: 'Autre'
};

export default function AdminLeadsList() {
  const { 
    leads, 
    stats, 
    loading, 
    error,
    loadLeads,
    updateLeadStatus,
    assignLead,
    addNotes,
    deleteLead,
    loadStats,
    loadTeamMembers
  } = useAdminLeads();

  const [teamMembers, setTeamMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [assignedFilter, setAssignedFilter] = useState('all');
  
  // Dialogs
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  
  // Form states
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [notesText, setNotesText] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    loadLeads();
    loadStats();
    loadTeamMembersData();
  }, []);

  const loadTeamMembersData = async () => {
    const result = await loadTeamMembers();
    if (result.success) {
      setTeamMembers(result.data);
    }
  };

  // Filtered leads
  const filteredLeads = (leads || []).filter(lead => {
    const matchesSearch = 
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.payload?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.payload?.phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    const matchesAssigned = 
      assignedFilter === 'all' || 
      (assignedFilter === 'unassigned' && !lead.assigned_to) ||
      (assignedFilter !== 'unassigned' && lead.assigned_to === assignedFilter);
    
    return matchesSearch && matchesStatus && matchesSource && matchesAssigned;
  });

  const handleStatusChange = async (leadId, newStatus) => {
    setUpdatingStatus(leadId);
    const result = await updateLeadStatus(leadId, newStatus);
    setUpdatingStatus(null);
    
    if (result.success) {
      toast.success('Statut mis à jour');
      loadStats(); // Refresh stats
    } else {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const handleAssignLead = async () => {
    if (!selectedLead || !selectedAssignee) return;
    
    const result = await assignLead(selectedLead.id, selectedAssignee);
    
    if (result.success) {
      toast.success('Lead assigné avec succès');
      setAssignDialogOpen(false);
      setSelectedLead(null);
      setSelectedAssignee('');
    } else {
      toast.error('Erreur lors de l\'assignation');
    }
  };

  const handleAddNotes = async () => {
    if (!selectedLead || !notesText.trim()) return;
    
    const result = await addNotes(selectedLead.id, notesText);
    
    if (result.success) {
      toast.success('Notes ajoutées');
      setNotesDialogOpen(false);
      setSelectedLead(null);
      setNotesText('');
    } else {
      toast.error('Erreur lors de l\'ajout des notes');
    }
  };

  const handleDeleteLead = async () => {
    if (!selectedLead) return;
    
    const result = await deleteLead(selectedLead.id);
    
    if (result.success) {
      toast.success('Lead supprimé');
      setDeleteDialogOpen(false);
      setSelectedLead(null);
      loadStats(); // Refresh stats
    } else {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openAssignDialog = (lead) => {
    setSelectedLead(lead);
    setSelectedAssignee(lead.assigned_to || '');
    setAssignDialogOpen(true);
  };

  const openNotesDialog = (lead) => {
    setSelectedLead(lead);
    setNotesText(lead.notes || '');
    setNotesDialogOpen(true);
  };

  const openDeleteDialog = (lead) => {
    setSelectedLead(lead);
    setDeleteDialogOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAssigneeName = (userId) => {
    if (!userId) return 'Non assigné';
    const member = teamMembers?.find(m => m.user_id === userId);
    return member?.name || 'Utilisateur inconnu';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-2">Erreur de chargement</p>
          <p className="text-sm text-gray-500">{error}</p>
          <Button onClick={() => loadLeads()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  const conversionRate = stats?.total > 0 
    ? (((stats?.converted || 0) / stats.total) * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads Marketing</h1>
            <p className="text-gray-500 mt-1">Gérez vos prospects et opportunités</p>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Leads
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Nouveaux
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.new || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Convertis
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.converted || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Taux de conversion
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, email, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Source Filter */}
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sources</SelectItem>
                {Object.entries(SOURCE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Assigned Filter */}
            <Select value={assignedFilter} onValueChange={setAssignedFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les assignés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les assignés</SelectItem>
                <SelectItem value="unassigned">Non assignés</SelectItem>
                {teamMembers?.map((member) => (
                  <SelectItem key={member.user_id} value={member.user_id}>
                    {member.name}
                  </SelectItem>
                )) || null}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' || sourceFilter !== 'all'
                  ? 'Aucun lead trouvé'
                  : 'Aucun lead'}
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || sourceFilter !== 'all'
                  ? 'Essayez de modifier vos filtres'
                  : 'Les leads des formulaires apparaîtront ici'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Source</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Statut</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Assigné à</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => {
                    const StatusIcon = STATUS_CONFIG[lead.status]?.icon || Clock;
                    
                    return (
                      <tr key={lead.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {lead.payload?.name || lead.email}
                            </div>
                            {lead.email && (
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {lead.email}
                              </div>
                            )}
                            {lead.payload?.phone && (
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {lead.payload.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            {SOURCE_LABELS[lead.source] || lead.source}
                          </div>
                          {lead.form_name && (
                            <div className="text-xs text-gray-500">{lead.form_name}</div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Select
                            value={lead.status}
                            onValueChange={(newStatus) => handleStatusChange(lead.id, newStatus)}
                            disabled={updatingStatus === lead.id}
                          >
                            <SelectTrigger className="w-[140px]">
                              <div className="flex items-center gap-2">
                                <StatusIcon className="h-3 w-3" />
                                <span>{STATUS_CONFIG[lead.status]?.label}</span>
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                                const Icon = config.icon;
                                return (
                                  <SelectItem key={key} value={key}>
                                    <div className="flex items-center gap-2">
                                      <Icon className="h-3 w-3" />
                                      {config.label}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            {getAssigneeName(lead.assigned_to)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-600">
                            {formatDate(lead.created_at)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openAssignDialog(lead)}
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openNotesDialog(lead)}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openDeleteDialog(lead)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner le lead</DialogTitle>
            <DialogDescription>
              Assignez ce lead à un membre de l'équipe
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Membre de l'équipe</Label>
              <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Sélectionner un membre" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers?.map((member) => (
                    <SelectItem key={member.user_id} value={member.user_id}>
                      {member.name} - {member.role}
                    </SelectItem>
                  )) || null}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAssignLead} disabled={!selectedAssignee}>
              Assigner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du lead</DialogTitle>
            <DialogDescription>
              {selectedLead?.payload?.name || selectedLead?.email} - {selectedLead?.source}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Informations du contact */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-sm">Informations de contact</h3>
              {selectedLead?.payload?.name && (
                <div>
                  <Label className="text-xs text-gray-500">Nom</Label>
                  <p className="text-sm font-medium">{selectedLead.payload.name}</p>
                </div>
              )}
              <div>
                <Label className="text-xs text-gray-500">Email</Label>
                <p className="text-sm font-medium">{selectedLead?.email}</p>
              </div>
              {selectedLead?.payload?.phone && (
                <div>
                  <Label className="text-xs text-gray-500">Téléphone</Label>
                  <p className="text-sm font-medium">{selectedLead.payload.phone}</p>
                </div>
              )}
              {selectedLead?.payload?.preferred_contact && (
                <div>
                  <Label className="text-xs text-gray-500">Contact préféré</Label>
                  <p className="text-sm font-medium">{selectedLead.payload.preferred_contact}</p>
                </div>
              )}
            </div>

            {/* Détails de la demande */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-sm">Détails de la demande</h3>
              {selectedLead?.payload?.subject && (
                <div>
                  <Label className="text-xs text-gray-500">Sujet</Label>
                  <p className="text-sm font-medium">{selectedLead.payload.subject}</p>
                </div>
              )}
              {selectedLead?.payload?.category && (
                <div>
                  <Label className="text-xs text-gray-500">Catégorie</Label>
                  <p className="text-sm font-medium capitalize">{selectedLead.payload.category}</p>
                </div>
              )}
              {selectedLead?.payload?.urgency && (
                <div>
                  <Label className="text-xs text-gray-500">Urgence</Label>
                  <p className="text-sm font-medium capitalize">{selectedLead.payload.urgency}</p>
                </div>
              )}
              {selectedLead?.payload?.message && (
                <div>
                  <Label className="text-xs text-gray-500">Message</Label>
                  <p className="text-sm whitespace-pre-wrap bg-white p-3 rounded border">
                    {selectedLead.payload.message}
                  </p>
                </div>
              )}
            </div>

            {/* Notes internes */}
            <div>
              <Label>Notes internes</Label>
              <Textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                placeholder="Ajoutez des notes sur ce lead..."
                rows={4}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>
              Fermer
            </Button>
            <Button onClick={handleAddNotes}>
              Enregistrer les notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce lead ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="py-4">
              <p className="text-sm font-medium">
                {selectedLead.payload?.name || selectedLead.email}
              </p>
              <p className="text-sm text-gray-500">{selectedLead.email}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteLead}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

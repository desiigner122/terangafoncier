import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  TrendingUp,
  Calendar,
  Download,
  Upload,
  FileText,
  Star,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  UserPlus,
  Building2,
  Briefcase,
  Smartphone,
  Globe,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  client_type: 'standard',
  status: 'active',
  credit_score: ''
};

const BanqueClients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientLoans, setClientLoans] = useState([]);
  const [loansLoading, setLoansLoading] = useState(false);

  // Formulaire ajout / édition
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'
  const [formData, setFormData] = useState(emptyForm);
  const [formSaving, setFormSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Chargement des clients réels (bank_clients filtré par bank_id)
  const fetchClients = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bank_clients')
        .select('*')
        .eq('bank_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error('Erreur chargement clients:', err);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user?.id]);

  // Filtrage des clients
  useEffect(() => {
    let filtered = clients;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(client =>
        (client.name || '').toLowerCase().includes(term) ||
        (client.email || '').toLowerCase().includes(term) ||
        (client.phone || '').includes(searchTerm)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(client => client.status === filterStatus);
    }

    setFilteredClients(filtered);
  }, [clients, searchTerm, filterStatus]);

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDate = (value) => {
    if (!value) return '—';
    try {
      return new Date(value).toLocaleDateString('fr-FR');
    } catch {
      return '—';
    }
  };

  const formatAmount = (value) => {
    if (value === null || value === undefined || value === '') return '—';
    const num = Number(value);
    if (Number.isNaN(num)) return '—';
    return num.toLocaleString('fr-FR');
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      suspended: 'bg-red-100 text-red-800 border-red-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || colors.inactive;
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Actif',
      pending: 'En attente',
      suspended: 'Suspendu',
      inactive: 'Inactif'
    };
    return labels[status] || status || '—';
  };

  const getAccountTypeColor = (type) => {
    const colors = {
      premium: 'bg-purple-100 text-purple-800',
      business: 'bg-blue-100 text-blue-800',
      diaspora: 'bg-green-100 text-green-800',
      standard: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.standard;
  };

  const getAccountTypeLabel = (type) => {
    const labels = {
      premium: 'Premium',
      business: 'Business',
      diaspora: 'Diaspora',
      standard: 'Standard'
    };
    return labels[type] || type || 'Standard';
  };

  const getCreditScoreColor = (score) => {
    if (score >= 800) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 600) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Ouvrir la fiche client + charger ses crédits réels (loans)
  const handleViewClient = async (client) => {
    setSelectedClient(client);
    setShowClientModal(true);
    setClientLoans([]);

    if (!client.client_id) return;
    setLoansLoading(true);
    try {
      const { data, error } = await supabase
        .from('loans')
        .select('*')
        .eq('bank_id', user.id)
        .eq('client_id', client.client_id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setClientLoans(data || []);
    } catch (err) {
      console.error('Erreur chargement crédits client:', err);
      setClientLoans([]);
    } finally {
      setLoansLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormMode('create');
    setFormData(emptyForm);
    setEditingId(null);
    setShowFormModal(true);
  };

  const openEditModal = (client) => {
    setFormMode('edit');
    setFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      client_type: client.client_type || 'standard',
      status: client.status || 'active',
      credit_score: client.credit_score ?? ''
    });
    setEditingId(client.id);
    setShowFormModal(true);
  };

  const handleSaveClient = async () => {
    if (!user?.id || !formData.name.trim()) {
      window.safeGlobalToast?.({
        title: 'Champ requis',
        description: 'Le nom du client est obligatoire.',
        variant: 'destructive'
      });
      return;
    }
    setFormSaving(true);
    try {
      const payload = {
        bank_id: user.id,
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        client_type: formData.client_type,
        status: formData.status,
        credit_score: formData.credit_score === '' ? null : Number(formData.credit_score)
      };

      if (formMode === 'create') {
        const { error } = await supabase.from('bank_clients').insert([payload]);
        if (error) throw error;
        window.safeGlobalToast?.({
          title: 'Client ajouté',
          description: `${payload.name} a été ajouté à votre portefeuille.`,
          variant: 'success'
        });
      } else {
        const { error } = await supabase
          .from('bank_clients')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', editingId)
          .eq('bank_id', user.id);
        if (error) throw error;
        window.safeGlobalToast?.({
          title: 'Client mis à jour',
          description: `Les informations de ${payload.name} ont été enregistrées.`,
          variant: 'success'
        });
      }

      setShowFormModal(false);
      await fetchClients();
    } catch (err) {
      console.error('Erreur enregistrement client:', err);
      window.safeGlobalToast?.({
        title: 'Erreur',
        description: "Impossible d'enregistrer le client.",
        variant: 'destructive'
      });
    } finally {
      setFormSaving(false);
    }
  };

  const handleDeleteClient = async (client) => {
    if (!window.confirm(`Supprimer le client ${client.name} ?`)) return;
    try {
      const { error } = await supabase
        .from('bank_clients')
        .delete()
        .eq('id', client.id)
        .eq('bank_id', user.id);
      if (error) throw error;
      window.safeGlobalToast?.({
        title: 'Client supprimé',
        description: `${client.name} a été retiré du portefeuille.`,
        variant: 'success'
      });
      await fetchClients();
    } catch (err) {
      console.error('Erreur suppression client:', err);
      window.safeGlobalToast?.({
        title: 'Erreur',
        description: 'Impossible de supprimer le client.',
        variant: 'destructive'
      });
    }
  };

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    pending: clients.filter(c => c.status === 'pending').length,
    suspended: clients.filter(c => c.status === 'suspended').length,
    totalCredits: clients.reduce((sum, c) => sum + (Number(c.total_credits) || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 mr-3 text-blue-600" />
            Gestion des Clients
          </h2>
          <p className="text-gray-600 mt-1">
            Gérez votre portefeuille client et leurs informations bancaires
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button onClick={openCreateModal}>
            <UserPlus className="h-4 w-4 mr-2" />
            Nouveau Client
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspendus</p>
                <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Crédits Totaux</p>
                <p className="text-lg font-bold text-purple-600">
                  {stats.totalCredits > 0 ? `${formatAmount(stats.totalCredits)} XOF` : '—'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par statut..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les clients</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="suspended">Suspendus</SelectItem>
                  <SelectItem value="inactive">Inactifs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des clients */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Chargement des clients...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredClients.map((client) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                          {getInitials(client.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {client.name || 'Client sans nom'}
                          </h3>
                          <Badge className={`text-xs ${getStatusColor(client.status)}`}>
                            {getStatusLabel(client.status)}
                          </Badge>
                          {client.client_type && (
                            <Badge className={`text-xs ${getAccountTypeColor(client.client_type)}`}>
                              {getAccountTypeLabel(client.client_type)}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {client.email || '—'}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {client.phone || '—'}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            Ajouté le {formatDate(client.created_at)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                          <div>
                            <span className="text-gray-500">Score de crédit: </span>
                            {client.credit_score != null ? (
                              <span className={`font-semibold ${getCreditScoreColor(client.credit_score)}`}>
                                {client.credit_score}
                              </span>
                            ) : (
                              <span className="font-semibold text-gray-400">—</span>
                            )}
                          </div>
                          <div>
                            <span className="text-gray-500">Crédits totaux: </span>
                            <span className="font-semibold text-green-600">
                              {client.total_credits ? `${formatAmount(client.total_credits)} XOF` : '—'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">ID client: </span>
                            <span className="font-semibold">{client.client_id ? 'Lié' : 'Externe'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewClient(client)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(client)}
                        className="text-gray-600 hover:text-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClient(client)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredClients.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all'
                ? 'Aucun client ne correspond à votre recherche.'
                : 'Commencez par ajouter des clients à votre portefeuille.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal ajout / édition client */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {formMode === 'create' ? 'Nouveau Client' : 'Modifier le Client'}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFormModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nom complet *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Amadou Diallo"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@exemple.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Téléphone</label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+221 77 000 00 00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Type de client</label>
                  <Select
                    value={formData.client_type}
                    onValueChange={(v) => setFormData({ ...formData, client_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="diaspora">Diaspora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Statut</label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="suspended">Suspendu</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Score de crédit</label>
                <Input
                  type="number"
                  value={formData.credit_score}
                  onChange={(e) => setFormData({ ...formData, credit_score: e.target.value })}
                  placeholder="Ex: 750"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowFormModal(false)} disabled={formSaving}>
                Annuler
              </Button>
              <Button onClick={handleSaveClient} disabled={formSaving}>
                {formSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {formMode === 'create' ? 'Ajouter' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal détails client */}
      {showClientModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Détails Client - {selectedClient.name}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowClientModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="loans">Crédits</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Informations Client</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Nom complet</label>
                          <p className="text-sm">{selectedClient.name || '—'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Email</label>
                          <p className="text-sm">{selectedClient.email || '—'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Téléphone</label>
                          <p className="text-sm">{selectedClient.phone || '—'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Type de client</label>
                          <p className="text-sm">{getAccountTypeLabel(selectedClient.client_type)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Informations Bancaires</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Statut</label>
                          <p className="text-sm">{getStatusLabel(selectedClient.status)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Crédits totaux</label>
                          <p className="text-sm font-semibold text-green-600">
                            {selectedClient.total_credits
                              ? `${formatAmount(selectedClient.total_credits)} XOF`
                              : '—'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Score de crédit</label>
                          <p className={`text-sm font-semibold ${getCreditScoreColor(selectedClient.credit_score)}`}>
                            {selectedClient.credit_score ?? '—'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Client depuis</label>
                          <p className="text-sm">{formatDate(selectedClient.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="loans">
                  <div className="space-y-4">
                    {loansLoading ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-spin" />
                        <p className="text-gray-600">Chargement des crédits...</p>
                      </div>
                    ) : clientLoans.length > 0 ? (
                      clientLoans.map((loan) => (
                        <Card key={loan.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium">
                                  {loan.type || 'Crédit'}{loan.reference ? ` · ${loan.reference}` : ''}
                                </h5>
                                <p className="text-sm text-gray-600">
                                  Montant: {formatAmount(loan.amount)} XOF
                                </p>
                              </div>
                              <Badge className={getStatusColor(
                                ['approved', 'disbursed'].includes(loan.status) ? 'active'
                                  : loan.status === 'rejected' ? 'suspended'
                                  : 'pending'
                              )}>
                                {loan.status || '—'}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          {selectedClient.client_id
                            ? 'Aucun crédit en cours pour ce client'
                            : 'Client externe non lié à un dossier de crédit'}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="documents">
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Gestion documentaire bientôt disponible</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BanqueClients;

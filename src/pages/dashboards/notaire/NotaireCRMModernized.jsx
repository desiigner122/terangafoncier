import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Building,
  MessageSquare,
  Phone,
  Video,
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  Star,
  Clock,
  MapPin,
  Filter,
  Search,
  Plus,
  Edit,
  Edit3,
  Trash2,
  Eye,
  Send,
  Mail,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  UserPlus,
  CreditCard,
  Home,
  Building2,
  UserCheck,
  Briefcase,
  Calculator,
  BarChart3,
  PieChart,
  Hash,
  AtSign,
  Archive
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import CreateClientDialog from '@/components/notaire/CreateClientDialog';

// Statuts d'actes considérés comme "actifs" / "finalisés"
const ACTIVE_STATUSES = ['draft', 'in_progress'];
const COMPLETED_STATUSES = ['signed', 'completed'];

const formatFCFA = (value) => {
  const n = Number(value) || 0;
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M FCFA`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k FCFA`;
  return `${n.toLocaleString('fr-FR')} FCFA`;
};

const NotaireCRMModernized = () => {
  const { dashboardStats } = useOutletContext();
  const { user, profile } = useAuth();
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState('clients');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateClientDialog, setShowCreateClientDialog] = useState(false);

  // États pour les données réelles
  const [clients, setClients] = useState([]);
  const [acts, setActs] = useState([]);
  const [crmStats, setCrmStats] = useState({
    totalClients: 0,
    activeFiles: 0,
    completedTransactions: 0,
    monthlyRevenue: 0,
    avgSatisfaction: null,
    retentionRate: null
  });

  // Chargement des données réelles depuis Supabase
  useEffect(() => {
    if (user?.id) {
      loadCRMData();
    }
  }, [user?.id]);

  const loadCRMData = async () => {
    setIsLoading(true);
    try {
      // 1. Clients notariaux réels (clients_notaire : id, notaire_id, client_id, name, status, created_at)
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients_notaire')
        .select('id, notaire_id, client_id, name, status, created_at')
        .eq('notaire_id', user.id)
        .order('created_at', { ascending: false });
      if (clientsError) throw clientsError;

      // 2. Actes notariaux réels (pour agréger transactions/revenus par client)
      const { data: actsData, error: actsError } = await supabase
        .from('notarial_acts')
        .select('id, client_id, client_name, act_type, reference, status, notary_fees, amount, client_satisfaction, signed_at, created_at')
        .eq('notaire_id', user.id)
        .order('created_at', { ascending: false });
      if (actsError) throw actsError;
      const allActs = actsData || [];
      setActs(allActs);

      // 3. Profils des clients (email / téléphone / localisation) via client_id -> profiles.id
      const clientProfileIds = (clientsData || []).map(c => c.client_id).filter(Boolean);
      const profilesById = {};
      if (clientProfileIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, email, phone, city, region, full_name')
          .in('id', clientProfileIds);
        (profilesData || []).forEach(p => { profilesById[p.id] = p; });
      }

      // Agrégation des actes par client
      const actsByClient = {};
      allActs.forEach(a => {
        if (!a.client_id) return;
        (actsByClient[a.client_id] = actsByClient[a.client_id] || []).push(a);
      });

      const enrichedClients = (clientsData || []).map(c => {
        const clientActs = actsByClient[c.client_id] || [];
        const activeActs = clientActs.filter(a => ACTIVE_STATUSES.includes(a.status));
        const completedActs = clientActs.filter(a => COMPLETED_STATUSES.includes(a.status));
        const totalRevenue = clientActs.reduce((s, a) => s + (Number(a.amount) || 0), 0);
        const satVals = clientActs.map(a => a.client_satisfaction).filter(v => v != null);
        const avgSat = satVals.length
          ? Math.round(satVals.reduce((s, v) => s + Number(v), 0) / satVals.length)
          : null;
        const p = profilesById[c.client_id] || {};
        return {
          ...c,
          client_status: c.status,
          email: p.email || null,
          phone: p.phone || null,
          city: p.city || null,
          region: p.region || null,
          total_acts: clientActs.length,
          active_acts: activeActs.length,
          completed_acts: completedActs.length,
          total_revenue: totalRevenue,
          avg_act_value: clientActs.length ? Math.round(totalRevenue / clientActs.length) : 0,
          satisfaction_score: avgSat,
          acts: clientActs
        };
      });

      setClients(enrichedClients);
      setSelectedClient(prev => {
        if (!prev) return prev;
        // Rafraîchir la sélection courante avec les données ré-agrégées
        return enrichedClients.find(c => c.id === prev.id) || prev;
      });

      // Statistiques globales réelles
      const activeFiles = allActs.filter(a => ACTIVE_STATUSES.includes(a.status)).length;
      const completedTransactions = allActs.filter(a => COMPLETED_STATUSES.includes(a.status)).length;

      const now = new Date();
      const monthlyRevenue = allActs
        .filter(a => {
          const d = a.signed_at ? new Date(a.signed_at) : new Date(a.created_at);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((s, a) => s + (Number(a.amount) || 0), 0);

      const globalSatVals = allActs.map(a => a.client_satisfaction).filter(v => v != null);
      const avgSatisfaction = globalSatVals.length
        ? Math.round(globalSatVals.reduce((s, v) => s + Number(v), 0) / globalSatVals.length)
        : null;

      const clientsWithActs = enrichedClients.filter(c => c.total_acts > 0).length;
      const loyalClients = enrichedClients.filter(c => c.total_acts >= 2).length;
      const retentionRate = clientsWithActs > 0
        ? Math.round((loyalClients / clientsWithActs) * 100)
        : null;

      setCrmStats({
        totalClients: enrichedClients.length,
        activeFiles,
        completedTransactions,
        monthlyRevenue,
        avgSatisfaction,
        retentionRate
      });
    } catch (error) {
      console.error('Erreur chargement données CRM:', error);
      window.safeGlobalToast?.({
        title: "Erreur de chargement",
        description: "Impossible de charger les données CRM",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClient = () => {
    setShowCreateClientDialog(true);
  };

  const handleClientCreated = () => {
    // Recharger la liste et les stats depuis la source réelle
    loadCRMData();
  };

  const handleContactClient = (client, method) => {
    window.safeGlobalToast?.({
      title: `Contact ${method}`,
      description: `Contacter ${client.name || 'le client'} par ${method}`,
      variant: "info"
    });
  };

  // Filtrage des clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || client.client_status === filterType;
    return matchesSearch && matchesFilter;
  });

  // Actes actifs réels (onglet Dossiers)
  const activeActs = acts.filter(a => ACTIVE_STATUSES.includes(a.status));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête CRM */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">CRM Notarial</h2>
          <p className="text-gray-600">Gestion des clients et de leurs dossiers</p>
        </div>
        <Button onClick={handleAddClient} className="bg-amber-600 hover:bg-amber-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Nouveau Client
        </Button>
      </div>

      {/* Statistiques CRM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{crmStats.totalClients}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dossiers Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{crmStats.activeFiles}</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Dossiers Finalisés</p>
                <p className="text-2xl font-bold text-gray-900">{crmStats.completedTransactions}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus du mois</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crmStats.monthlyRevenue > 0 ? formatFCFA(crmStats.monthlyRevenue) : '—'}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clients">Clients ({filteredClients.length})</TabsTrigger>
          <TabsTrigger value="files">Dossiers Actifs ({activeActs.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {activeTab === 'clients' && (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">Tous les clients</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
              <option value="prospect">Prospects</option>
            </select>
          )}
        </div>

        {/* Onglet Clients */}
        <TabsContent value="clients" className="space-y-6">
          {filteredClients.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
                <p className="text-gray-600 mb-4">
                  {clients.length === 0
                    ? "Vous n'avez pas encore de clients dans votre base de données."
                    : "Aucun client ne correspond à vos critères de recherche."
                  }
                </p>
                <Button onClick={handleAddClient} className="bg-amber-600 hover:bg-amber-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ajouter un client
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <motion.div
                  key={client.id}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedClient(client)}
                >
                  <Card className={`h-full hover:shadow-lg transition-all duration-300 border-l-4 ${
                    selectedClient?.id === client.id ? 'border-l-amber-600 bg-amber-50' : 'border-l-gray-300'
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="font-semibold bg-amber-100 text-amber-700">
                              {client.name?.split(' ').map(n => n[0]).join('') || 'C'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg font-semibold text-gray-900">
                              {client.name || 'Client'}
                            </CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={
                                client.client_status === 'active' ? 'bg-green-100 text-green-800' :
                                client.client_status === 'prospect' ? 'bg-blue-100 text-blue-800' :
                                client.client_status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {client.client_status || 'actif'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-sm font-medium">
                              {client.satisfaction_score != null ? `${client.satisfaction_score}%` : '—'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {client.total_acts || 0} transaction(s)
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Localisation client (profil) */}
                        {(client.city || client.region) && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {[client.city, client.region].filter(Boolean).join(', ')}
                          </div>
                        )}

                        {/* Informations de contact */}
                        <div className="space-y-2">
                          {client.email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2" />
                              {client.email}
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              {client.phone}
                            </div>
                          )}
                          {!client.email && !client.phone && (
                            <div className="text-sm text-gray-400">Contact non renseigné</div>
                          )}
                        </div>

                        {/* Synthèse dossiers */}
                        <div className="border-t pt-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Revenus générés:</span>
                            <span className="font-medium">
                              {client.total_revenue > 0 ? formatFCFA(client.total_revenue) : '—'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Dossiers actifs:</span>
                            <Badge className="bg-blue-100 text-blue-800">
                              {client.active_acts || 0}
                            </Badge>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContactClient(client, 'téléphone');
                            }}
                          >
                            <Phone className="h-3 w-3 mr-1" />
                            Appeler
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContactClient(client, 'email');
                            }}
                          >
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Onglet Dossiers Actifs */}
        <TabsContent value="files" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dossiers en Cours</CardTitle>
              <CardDescription>
                Actes notariaux actuellement en préparation ou en cours de traitement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeActs.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun dossier actif</h3>
                    <p className="text-gray-600">
                      Tous vos dossiers sont à jour ou aucun dossier n'est en cours.
                    </p>
                  </div>
                ) : (
                  activeActs.map((act) => (
                    <Card key={act.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {act.client_name || 'Client'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Type: {act.act_type || 'Acte notarial'}
                            </p>
                          </div>
                          <Badge className={
                            act.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {act.status === 'in_progress' ? 'En cours' : 'Brouillon'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <span className="text-sm text-gray-600">Montant:</span>
                            <p className="font-semibold text-green-600">
                              {act.amount ? formatFCFA(act.amount) : '—'}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Émoluments:</span>
                            <p className="font-medium">
                              {act.notary_fees ? formatFCFA(act.notary_fees) : '—'}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Référence:</span>
                            <p className="font-medium">
                              {act.reference || `REF-${act.id?.toString().substring(0, 8)}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            Créé le {new Date(act.created_at).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              Voir
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Analyses */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Client</CardTitle>
                <CardDescription>Analyse des relations clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Taux de fidélisation</span>
                    <span className="font-medium">
                      {crmStats.retentionRate != null ? `${crmStats.retentionRate}%` : '—'}
                    </span>
                  </div>
                  <Progress value={crmStats.retentionRate || 0} className="h-2" />
                  <p className="text-xs text-gray-500">
                    Part des clients ayant au moins deux dossiers.
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-600">Satisfaction moyenne</span>
                    <span className="font-medium">
                      {crmStats.avgSatisfaction != null ? `${crmStats.avgSatisfaction}%` : '—'}
                    </span>
                  </div>
                  <Progress value={crmStats.avgSatisfaction || 0} className="h-2" />
                  <p className="text-xs text-gray-500">
                    Moyenne de satisfaction sur les actes notariaux.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activité des Dossiers</CardTitle>
                <CardDescription>Répartition des actes notariaux</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Dossiers actifs</span>
                    <span className="font-medium">{crmStats.activeFiles}</span>
                  </div>
                  <Progress
                    value={acts.length ? Math.round((crmStats.activeFiles / acts.length) * 100) : 0}
                    className="h-2"
                  />

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-600">Dossiers finalisés</span>
                    <span className="font-medium">{crmStats.completedTransactions}</span>
                  </div>
                  <Progress
                    value={acts.length ? Math.round((crmStats.completedTransactions / acts.length) * 100) : 0}
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500">
                    Total des actes: {acts.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog détails client enrichi */}
      {selectedClient && (
        <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="font-semibold bg-amber-100 text-amber-700 text-xl">
                      {selectedClient.name?.split(' ').map(n => n[0]).join('') || 'C'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-2xl">{selectedClient.name || 'Client'}</DialogTitle>
                    <DialogDescription className="flex items-center space-x-2">
                      <Badge className={
                        selectedClient.client_status === 'active' ? 'bg-green-100 text-green-800' :
                        selectedClient.client_status === 'prospect' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {selectedClient.client_status || 'actif'}
                      </Badge>
                      {selectedClient.satisfaction_score != null && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{selectedClient.satisfaction_score}%</span>
                        </div>
                      )}
                    </DialogDescription>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                </div>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne gauche - Informations personnelles */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations personnelles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Email</Label>
                      <p className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedClient.email || 'Non renseigné'}</span>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Téléphone</Label>
                      <p className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedClient.phone || 'Non renseigné'}</span>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Localisation</Label>
                      <p className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span>
                          {[selectedClient.city, selectedClient.region].filter(Boolean).join(', ') || 'Non renseignée'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Date d'ajout</Label>
                      <p className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>
                          {selectedClient.created_at
                            ? new Date(selectedClient.created_at).toLocaleDateString('fr-FR')
                            : '—'}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Notaire en charge */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Notaire en charge</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'N'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{profile?.full_name || 'Notaire'}</p>
                        <p className="text-sm text-gray-600">Notaire</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Colonne centrale - Historique transactions réel */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Historique des actes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {(!selectedClient.acts || selectedClient.acts.length === 0) ? (
                          <div className="text-center py-8 text-gray-500 text-sm">
                            Aucun acte enregistré pour ce client.
                          </div>
                        ) : (
                          selectedClient.acts.map((act) => (
                            <div key={act.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4 text-blue-500" />
                                  <span className="font-medium text-sm">
                                    {act.act_type || 'Acte notarial'}
                                  </span>
                                </div>
                                <Badge variant={COMPLETED_STATUSES.includes(act.status) ? 'default' : 'outline'}>
                                  {act.status === 'completed' ? 'Terminé' :
                                   act.status === 'signed' ? 'Signé' :
                                   act.status === 'in_progress' ? 'En cours' :
                                   act.status === 'cancelled' ? 'Annulé' : 'Brouillon'}
                                </Badge>
                              </div>
                              {act.reference && (
                                <p className="text-xs text-gray-600 mb-1">{act.reference}</p>
                              )}
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-green-600">
                                  {act.amount ? formatFCFA(act.amount) : '—'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(act.signed_at || act.created_at).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Colonne droite - Statistiques réelles */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statistiques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Actes totaux</span>
                        <span className="font-semibold">{selectedClient.total_acts || 0}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Dossiers actifs</span>
                        <span className="font-semibold text-blue-600">{selectedClient.active_acts || 0}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Dossiers finalisés</span>
                        <span className="font-semibold text-green-600">{selectedClient.completed_acts || 0}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Revenus générés</span>
                        <span className="font-semibold text-green-600">
                          {selectedClient.total_revenue > 0 ? formatFCFA(selectedClient.total_revenue) : '—'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Satisfaction</span>
                        <span className="font-semibold text-purple-600">
                          {selectedClient.satisfaction_score != null ? `${selectedClient.satisfaction_score}%` : '—'}
                        </span>
                      </div>
                      {selectedClient.satisfaction_score != null && (
                        <Progress value={selectedClient.satisfaction_score} className="h-2" />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions rapides */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Actions rapides</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Nouveau dossier
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        RDV
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Facturation
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        <Archive className="h-4 w-4 mr-2" />
                        Archiver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de création de client */}
      <CreateClientDialog
        open={showCreateClientDialog}
        onOpenChange={setShowCreateClientDialog}
        onClientCreated={handleClientCreated}
        notaireId={user?.id}
      />
    </div>
  );
};

export default NotaireCRMModernized;

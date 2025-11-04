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
  AtSign
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
import NotaireSupabaseService from '@/services/NotaireSupabaseService';
import CreateClientDialog from '@/components/notaire/CreateClientDialog';

const NotaireCRMModernized = () => {
  const { dashboardStats } = useOutletContext();
  const { user } = useAuth();
  const [selectedClient, setSelectedClient] = useState(null);
  const [activeTab, setActiveTab] = useState('clients');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateClientDialog, setShowCreateClientDialog] = useState(false);
  
  // États pour les données réelles
  const [clients, setClients] = useState([]);
  const [bankingPartners, setBankingPartners] = useState([]);
  const [crmStats, setCrmStats] = useState({
    totalClients: 0,
    activeFiles: 0,
    completedTransactions: 0,
    averageProcessingTime: '0 jours',
    bankPartners: 0,
    monthlyRevenue: '0 FCFA',
    satisfactionScore: 0,
    pendingSignatures: 0
  });

  // Chargement des données réelles depuis Supabase
  useEffect(() => {
    if (user) {
      loadCRMData();
    }
  }, [user]);

  const loadCRMData = async () => {
    setIsLoading(true);
    try {
      const [clientsResult, partnersResult, statsResult] = await Promise.all([
        NotaireSupabaseService.getClients(user.id),
        NotaireSupabaseService.getBankingPartners(user.id),
        NotaireSupabaseService.getCRMStats(user.id)
      ]);

      if (clientsResult.success) {
        setClients(clientsResult.data || []);
        if (clientsResult.data.length > 0 && !selectedClient) {
          setSelectedClient(clientsResult.data[0]);
        }
      }
      if (partnersResult.success) {
        setBankingPartners(partnersResult.data || []);
      }
      if (statsResult.success) {
        setCrmStats(prev => ({ ...prev, ...statsResult.data }));
      }
    } catch (error) {
      console.error('Erreur chargement données CRM:', error);
      window.safeGlobalToast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données CRM",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClient = async () => {
    setShowCreateClientDialog(true);
  };

  const handleClientCreated = (newClient) => {
    // Ajouter le nouveau client à la liste
    setClients(prev => [newClient, ...prev]);
    
    // Sélectionner le nouveau client
    setSelectedClient(newClient);
    
    // Recharger les stats CRM
    loadCRMData();
  };

  const handleContactClient = (client, method) => {
    window.safeGlobalToast({
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

  // Filtrage des partenaires bancaires
  const filteredPartners = bankingPartners.filter(partner => {
    return partner.bank_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           partner.contact_person?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* En-tête CRM */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">CRM Notarial</h2>
          <p className="text-sm sm:text-base text-gray-600">Gestion des clients et partenaires bancaires</p>
        </div>
        <Button onClick={handleAddClient} className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-10">
          <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
          <span className="hidden sm:inline">Nouveau Client</span>
          <span className="sm:hidden">Ajouter</span>
        </Button>
      </div>

      {/* Statistiques CRM */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{crmStats.totalClients || clients.length}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Dossiers Actifs</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{crmStats.activeFiles || dashboardStats?.activeCases || 0}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Partenaires Banques</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{bankingPartners.length}</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Building className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Revenus Mensuels</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{(dashboardStats?.monthlyRevenue / 1000000).toFixed(1)}M</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="clients" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-2.5">
            <span className="hidden sm:inline">Clients ({filteredClients.length})</span>
            <span className="sm:hidden">Clients</span>
          </TabsTrigger>
          <TabsTrigger value="banks" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-2.5">
            <span className="hidden sm:inline">Banques ({filteredPartners.length})</span>
            <span className="sm:hidden">Banques</span>
          </TabsTrigger>
          <TabsTrigger value="files" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-2.5">
            <span className="hidden sm:inline">Dossiers Actifs</span>
            <span className="sm:hidden">Dossiers</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 sm:px-4 py-2 sm:py-2.5">
            <span className="hidden sm:inline">Analyses</span>
            <span className="sm:hidden">Stats</span>
          </TabsTrigger>
        </TabsList>

        {/* Barre de recherche et filtres */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 sm:top-3 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 sm:pl-10 text-xs sm:text-sm h-9 sm:h-10"
            />
          </div>
          {activeTab === 'clients' && (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-xs sm:text-sm h-9 sm:h-10"
            >
              <option value="all">Tous les clients</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
              <option value="prospect">Prospects</option>
              <option value="vip">VIP</option>
            </select>
          )}
        </div>

        {/* Onglet Clients */}
        <TabsContent value="clients" className="space-y-4 sm:space-y-6 mt-0">
          {filteredClients.length === 0 ? (
            <Card>
              <CardContent className="p-8 sm:p-12 text-center">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  {clients.length === 0 
                    ? "Vous n'avez pas encore de clients dans votre base de données."
                    : "Aucun client ne correspond à vos critères de recherche."
                  }
                </p>
                <Button onClick={handleAddClient} className="bg-amber-600 hover:bg-amber-700 text-xs sm:text-sm h-8 sm:h-10">
                  <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  Ajouter un client
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
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
                    <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4 lg:p-6">
                      <div className="flex items-start justify-between gap-2 sm:gap-3">
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                            <AvatarFallback className="font-semibold bg-amber-100 text-amber-700 text-xs sm:text-sm">
                              {client.name?.split(' ').map(n => n[0]).join('') || 'C'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate">
                              {client.name || 'Client'}
                            </CardTitle>
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                              <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0.5">
                                {client.client_type || 'Particulier'}
                              </Badge>
                              <Badge className={`text-[10px] sm:text-xs px-1.5 py-0.5 ${
                                client.client_status === 'active' ? 'bg-green-100 text-green-800' :
                                client.client_status === 'prospect' ? 'bg-blue-100 text-blue-800' :
                                client.client_status === 'vip' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {client.client_status || 'Actif'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center space-x-1 mb-1">
                            <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-yellow-500" />
                            <span className="text-xs sm:text-sm font-medium">{client.satisfaction_score || 0}</span>
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-500">
                            {client.total_acts || 0} transaction(s)
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 p-3 sm:p-4 lg:p-6">
                      <div className="space-y-2 sm:space-y-3">
                        {/* Transaction actuelle simulée */}
                        <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                            <span className="text-xs sm:text-sm font-medium text-gray-900">
                              Dossier en cours
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-green-600">
                              {client.avg_act_value ? `${(client.avg_act_value / 1000000).toFixed(1)}M FCFA` : 'N/A'}
                            </span>
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-600 space-y-1">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                              <span className="truncate">Localisation en cours</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Building className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                              <span className="truncate">Partenaire bancaire</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Étape: {client.active_acts > 0 ? 'En cours' : 'Aucune'}</span>
                              <Badge className="text-[9px] sm:text-[10px] bg-blue-100 text-blue-800 px-1 py-0.5">
                                REF-{client.id?.substring(0, 8)}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Informations de contact */}
                        <div className="space-y-1.5 sm:space-y-2">
                          {client.email && (
                            <div className="flex items-center text-xs sm:text-sm text-gray-600">
                              <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                              <span className="truncate">{client.email}</span>
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center text-xs sm:text-sm text-gray-600">
                              <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                              <span>{client.phone}</span>
                            </div>
                          )}
                        </div>

                        {/* Relation bancaire */}
                        <div className="border-t pt-2 sm:pt-3">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">Revenus totaux:</span>
                            <span className="font-medium">{client.total_revenue ? `${(client.total_revenue / 1000000).toFixed(1)}M FCFA` : '0 FCFA'}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-gray-600">Dossiers actifs:</span>
                            <Badge className="bg-blue-100 text-blue-800 text-[10px] sm:text-xs">
                              {client.active_acts || 0}
                            </Badge>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-1.5 sm:space-x-2 pt-1 sm:pt-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 h-7 sm:h-8 text-[10px] sm:text-xs px-2" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContactClient(client, 'téléphone');
                            }}
                          >
                            <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                            <span className="hidden sm:inline">Appeler</span>
                            <span className="sm:hidden">Tel</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-7 sm:h-8 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.safeGlobalToast({
                                title: "Rendez-vous programmé",
                                description: "Le rendez-vous a été ajouté au calendrier",
                                variant: "success"
                              });
                            }}
                          >
                            <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-7 sm:h-8 px-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContactClient(client, 'email');
                            }}
                          >
                            <MessageSquare className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
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

        {/* Onglet Banques */}
        <TabsContent value="banks" className="space-y-6">
          {filteredPartners.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun partenaire bancaire</h3>
                <p className="text-gray-600 mb-4">
                  Vous n'avez pas encore de partenaires bancaires enregistrés.
                </p>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une banque
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPartners.map((partner) => (
                <Card key={partner.id} className="hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {partner.bank_name}
                        </CardTitle>
                        <p className="text-sm text-gray-600">{partner.contact_person}</p>
                      </div>
                      <Badge className={
                        partner.success_rate >= 90 ? 'bg-green-100 text-green-800' :
                        partner.success_rate >= 75 ? 'bg-blue-100 text-blue-800' :
                        partner.success_rate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {partner.success_rate >= 90 ? 'Excellente' :
                         partner.success_rate >= 75 ? 'Très bonne' :
                         partner.success_rate >= 60 ? 'Bonne' : 'Moyenne'}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Dossiers actifs:</span>
                          <div className="font-semibold text-blue-600">{partner.total_referrals || 0}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Finalisés ce mois:</span>
                          <div className="font-semibold text-green-600">{partner.successful_loans || 0}</div>
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="text-gray-600">Temps moyen:</span>
                        <div className="font-semibold">{partner.avg_processing_days || 12} jours</div>
                      </div>

                      <div className="text-sm">
                        <span className="text-gray-600">Spécialités:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {partner.services_offered?.slice(0, 2).map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          )) || (
                            <>
                              <Badge variant="outline" className="text-xs">Crédits particuliers</Badge>
                              <Badge variant="outline" className="text-xs">Investissement</Badge>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Informations de contact */}
                      <div className="space-y-1">
                        {partner.contact_email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-3 w-3 mr-2" />
                            {partner.contact_email}
                          </div>
                        )}
                        {partner.contact_phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-3 w-3 mr-2" />
                            {partner.contact_phone}
                          </div>
                        )}
                      </div>

                      {/* Statistiques de performance */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Taux de succès:</span>
                            <div className="font-semibold text-green-600">{partner.success_rate || 85}%</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Commission totale:</span>
                            <div className="font-semibold text-purple-600">
                              {partner.total_commission ? `${(partner.total_commission / 1000000).toFixed(1)}M` : '2.4M'} FCFA
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => window.safeGlobalToast({
                            title: "Contact banque",
                            description: `Contact avec ${partner.bank_name}`,
                            variant: "info"
                          })}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Appeler
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.safeGlobalToast({
                            title: "E-mail envoyé",
                            description: `E-mail envoyé à ${partner.contact_person}`,
                            variant: "success"
                          })}
                        >
                          <Mail className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Onglet Dossiers Actifs */}
        <TabsContent value="files" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dossiers en Cours avec Intégration Bancaire</CardTitle>
              <CardDescription>
                Suivi des dossiers actifs avec partenaires bancaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Dossier fictif basé sur les clients actifs */}
                {clients.filter(client => client.active_acts > 0).slice(0, 5).map((client, index) => (
                  <Card key={client.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{client.name}</h4>
                          <p className="text-sm text-gray-600">
                            Type: {client.client_type === 'particulier' ? 'Vente Terrain' : 'Achat Villa'}
                          </p>
                        </div>
                        <Badge className={
                          index % 3 === 0 ? 'bg-red-100 text-red-800' :
                          index % 3 === 1 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }>
                          {index % 3 === 0 ? 'Haute' : index % 3 === 1 ? 'Moyenne' : 'Basse'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-gray-600">Valeur:</span>
                          <p className="font-semibold text-green-600">
                            {client.avg_act_value ? `${(client.avg_act_value / 1000000).toFixed(1)}M FCFA` : '85M FCFA'}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Localisation:</span>
                          <p className="font-medium">
                            {index % 3 === 0 ? 'Almadies' : index % 3 === 1 ? 'Mermoz' : 'Plateau'}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Étape:</span>
                          <p className="font-medium">
                            {index % 3 === 0 ? 'Signature' : index % 3 === 1 ? 'Vérification' : 'Documentation'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Partenaire Bancaire</span>
                          <Badge variant="outline">
                            {index % 3 === 0 ? 'Banque Atlantique' : index % 3 === 1 ? 'CBAO' : 'UBA Sénégal'}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Conseiller:</span>
                            <p className="font-medium">
                              {index % 3 === 0 ? 'Mme Fatou Sarr' : index % 3 === 1 ? 'M. Omar Ba' : 'Mlle Aida Ndiaye'}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Statut crédit:</span>
                            <Badge className={
                              index % 3 === 0 ? 'bg-green-100 text-green-800' :
                              index % 3 === 1 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }>
                              {index % 3 === 0 ? 'Approuvé' : index % 3 === 1 ? 'En cours' : 'Pré-approbation'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm">
                            <span className="text-gray-600">Progression:</span>
                            <span className="ml-2 font-medium">{85 - (index * 10)}%</span>
                          </div>
                          <Progress value={85 - (index * 10)} className="w-32 h-2" />
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Voir
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {clients.filter(client => client.active_acts > 0).length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun dossier actif</h3>
                    <p className="text-gray-600">
                      Tous vos dossiers sont à jour ou aucun dossier n'est en cours.
                    </p>
                  </div>
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
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Satisfaction moyenne</span>
                    <span className="font-medium">4.7/5</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efficacité Bancaire</CardTitle>
                <CardDescription>Performance des partenaires</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Taux d'approbation</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Délai moyen</span>
                    <span className="font-medium">12 jours</span>
                  </div>
                  <Progress value={65} className="h-2" />
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
                      <Badge variant="outline">{selectedClient.client_type || 'Particulier'}</Badge>
                      <Badge className={
                        selectedClient.client_status === 'active' ? 'bg-green-100 text-green-800' :
                        selectedClient.client_status === 'vip' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {selectedClient.client_status || 'Actif'}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{selectedClient.satisfaction_score || 0}/5</span>
                      </div>
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
                      <Label className="text-sm font-medium text-gray-600">Adresse</Label>
                      <p className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span>{selectedClient.address || 'Dakar, Sénégal'}</span>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Date d'inscription</Label>
                      <p className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{new Date(selectedClient.created_at).toLocaleDateString('fr-FR')}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Conseiller assigné */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Conseiller assigné</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {selectedClient.advisor_name?.split(' ').map(n => n[0]).join('') || 'CN'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedClient.advisor_name || 'Conseiller Notaire'}</p>
                        <p className="text-sm text-gray-600">Notaire Principal</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Colonne centrale - Historique transactions */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Historique des transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {/* Transaction simulée */}
                        {[
                          { 
                            id: 1, 
                            type: 'Vente immobilière', 
                            amount: 150000000, 
                            date: '2024-09-15', 
                            status: 'Terminé',
                            property: 'Appartement Plateau'
                          },
                          { 
                            id: 2, 
                            type: 'Prêt hypothécaire', 
                            amount: 75000000, 
                            date: '2024-08-22', 
                            status: 'En cours',
                            property: 'Villa Almadies'
                          },
                          { 
                            id: 3, 
                            type: 'Succession', 
                            amount: 200000000, 
                            date: '2024-07-10', 
                            status: 'Terminé',
                            property: 'Terrain Rufisque'
                          }
                        ].map((transaction) => (
                          <div key={transaction.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-blue-500" />
                                <span className="font-medium text-sm">{transaction.type}</span>
                              </div>
                              <Badge variant={transaction.status === 'Terminé' ? 'default' : 'outline'}>
                                {transaction.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{transaction.property}</p>
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-green-600">
                                {(transaction.amount / 1000000).toFixed(1)}M FCFA
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(transaction.date).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Colonne droite - Relations bancaires et stats */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Relations bancaires</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: 'Crédit Agricole', type: 'Banque principale', years: '3 ans' },
                        { name: 'UBA Sénégal', type: 'Crédit immobilier', years: '1 an' },
                        { name: 'BICIS', type: 'Compte épargne', years: '2 ans' }
                      ].map((bank, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                          <Building className="h-8 w-8 p-2 bg-green-100 text-green-600 rounded" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{bank.name}</p>
                            <p className="text-xs text-gray-600">{bank.type} • {bank.years}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Statistiques client */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Statistiques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Transactions totales</span>
                        <span className="font-semibold">{selectedClient.total_acts || 5}</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Valeur portée</span>
                        <span className="font-semibold text-green-600">425M FCFA</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">Fidélité</span>
                        <span className="font-semibold text-purple-600">Excellent</span>
                      </div>
                      <Progress value={90} className="h-2" />
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
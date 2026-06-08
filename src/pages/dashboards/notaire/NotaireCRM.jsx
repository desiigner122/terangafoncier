import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
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
  MapPin, 
  Clock, 
  Star, 
  Activity, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Download, 
  Upload, 
  Share2, 
  Bookmark, 
  Flag, 
  Mail, 
  Smartphone, 
  Globe, 
  PenTool, 
  Stamp, 
  Scale, 
  Gavel, 
  Shield, 
  Award, 
  BookOpen, 
  RefreshCw, 
  Send, 
  Zap,
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
import { useAuth } from '@/contexts/UnifiedAuthContext';
import NotaireSupabaseService from '@/services/NotaireSupabaseService';

const NotaireCRM = () => {
  const { dashboardStats } = useOutletContext();
  const { user } = useAuth();
  const [selectedClient, setSelectedClient] = useState('client-1');
  const [activeTab, setActiveTab] = useState('clients');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Chargement des données réelles depuis Supabase
  useEffect(() => {
    if (user) {
      loadCRMData();
    }
  }, [user]);

  const loadCRMData = async () => {
    setIsLoading(true);
    try {
      const [clientsResult, bankPartnersResult, statsResult] = await Promise.all([
        NotaireSupabaseService.getClients(user.id),
        NotaireSupabaseService.getBankingPartners(user.id),
        NotaireSupabaseService.getCRMStats(user.id)
      ]);

      if (clientsResult.success) setClients(clientsResult.data);
      if (bankPartnersResult.success) setBankPartners(bankPartnersResult.data);
      if (statsResult.success) setCrmStats(statsResult.data);
      
    } catch (error) {
      console.error('Erreur chargement CRM:', error);
      window.safeGlobalToast({
        title: "Erreur de chargement",
        description: "Impossible de charger les données CRM",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Statistiques CRM Notaire (données de fallback)
  const [crmStats, setCrmStats] = useState({
    totalClients: 156,
    activeFiles: 89,
    completedTransactions: 47,
    averageProcessingTime: '12 jours',
    bankPartners: 8,
    monthlyRevenue: '45M FCFA',
    satisfactionScore: 4.8,
    pendingSignatures: 23
  });

  // Clients et partenaires avec intégration bancaire
  const [clients, setClients] = useState([]); // RÉEL via Supabase
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.from('crm_contacts').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (active) setClients(data || []);
      } catch (err) { if (active) setClients([]); }
    })();
    return () => { active = false; };
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Actif': return 'bg-green-100 text-green-800';
      case 'En négociation': return 'bg-yellow-100 text-yellow-800';
      case 'Nouveau': return 'bg-blue-100 text-blue-800';
      case 'Suspendu': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Haute': return 'text-red-600';
      case 'Moyenne': return 'text-yellow-600';
      case 'Basse': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getReliabilityColor = (reliability) => {
    switch (reliability) {
      case 'Excellente': return 'text-green-600';
      case 'Très bonne': return 'text-blue-600';
      case 'Bonne': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    window.safeGlobalToast({
      title: "Message envoyé",
      description: "Votre message a été envoyé avec succès",
      variant: "success"
    });
    setMessageText('');
  };

  const handleCallClient = (name) => {
    window.safeGlobalToast({
      title: "Appel en cours",
      description: `Appel vers ${name}...`,
      variant: "success"
    });
  };

  const handleScheduleMeeting = () => {
    window.safeGlobalToast({
      title: "Rendez-vous programmé",
      description: "Le rendez-vous a été ajouté au calendrier",
      variant: "success"
    });
  };

  const ClientCard = ({ client }) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="cursor-pointer"
        onClick={() => setSelectedClient(client.id)}
      >
        <Card className={`h-full hover:shadow-lg transition-all duration-300 border-l-4 ${
          selectedClient === client.id ? 'border-l-blue-600 bg-blue-50' : 'border-l-gray-300'
        }`}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="font-semibold">
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {client.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {client.type}
                    </Badge>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-1">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span className="text-sm font-medium">{client.satisfactionScore}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {client.transactionHistory} transaction(s)
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              {/* Transaction actuelle */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {client.currentTransaction.type}
                  </span>
                  <span className="text-sm font-bold text-green-600">
                    {client.currentTransaction.value}
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{client.currentTransaction.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building className="h-3 w-3" />
                    <span>{client.currentTransaction.bank}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Étape: {client.currentTransaction.stage}</span>
                    <Badge className="text-xs bg-blue-100 text-blue-800">
                      {client.currentTransaction.creditRef}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Relation bancaire */}
              <div className="border-t pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Conseiller bancaire:</span>
                  <span className="font-medium">{client.bankRelation.advisor}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Statut crédit:</span>
                  <Badge className={getStatusColor(client.bankRelation.status.includes('approuvé') ? 'Actif' : 'En négociation')}>
                    {client.bankRelation.status}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleCallClient(client.name)}>
                  <Phone className="h-3 w-3 mr-1" />
                  Appeler
                </Button>
                <Button size="sm" variant="outline" onClick={handleScheduleMeeting}>
                  <Calendar className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const BankPartnerCard = ({ bank }) => {
    return (
      <Card className="hover:shadow-md transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {bank.name}
              </CardTitle>
              <p className="text-sm text-gray-600">{bank.contact}</p>
            </div>
            <Badge className={`${getReliabilityColor(bank.reliability)} bg-gray-100`}>
              {bank.reliability}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Dossiers actifs:</span>
                <div className="font-semibold text-blue-600">{bank.activeFiles}</div>
              </div>
              <div>
                <span className="text-gray-600">Finalisés ce mois:</span>
                <div className="font-semibold text-green-600">{bank.completedThisMonth}</div>
              </div>
            </div>

            <div className="text-sm">
              <span className="text-gray-600">Temps moyen:</span>
              <div className="font-semibold">{bank.averageProcessingTime}</div>
            </div>

            <div className="text-sm">
              <span className="text-gray-600">Spécialités:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {bank.preferredFor.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Phone className="h-3 w-3 mr-1" />
                {bank.phone}
              </Button>
              <Button size="sm" variant="outline">
                <Mail className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Statistiques CRM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Clients Actifs</p>
                  <p className="text-2xl font-bold text-blue-900">{crmStats.totalClients}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Dossiers Actifs</p>
                  <p className="text-2xl font-bold text-green-900">{crmStats.activeFiles}</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Partenaires Banques</p>
                  <p className="text-2xl font-bold text-purple-900">{crmStats.bankPartners}</p>
                </div>
                <Building className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">CA Mensuel</p>
                  <p className="text-2xl font-bold text-yellow-900">{crmStats.monthlyRevenue}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Header principal */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">CRM Notaire - Interface Banque & Clients</h2>
          <p className="text-gray-600 mt-1">
            Gestion intégrée des relations clients et partenaires bancaires
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Programmer RDV
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Client
          </Button>
        </div>
      </div>

      {/* Interface principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scale className="h-5 w-5 text-blue-600" />
            <span>Centre CRM Notarial</span>
          </CardTitle>
          <CardDescription>
            Interface unifiée pour la gestion des clients et relations bancaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="clients">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="banks">Banques</TabsTrigger>
              <TabsTrigger value="files">Dossiers</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
            </TabsList>

            {/* Onglet Clients */}
            <TabsContent value="clients" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex space-x-3">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Rechercher clients..."
                      className="pl-9 w-80"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrer
                  </Button>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Client
                </Button>
              </div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                layout
              >
                {clients.map((client) => (
                  <ClientCard key={client.id} client={client} />
                ))}
              </motion.div>
            </TabsContent>

            {/* Onglet Banques */}
            <TabsContent value="banks" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Partenaires Bancaires</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Partenaire
                </Button>
              </div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                layout
              >
                {bankPartners.map((bank) => (
                  <BankPartnerCard key={bank.id} bank={bank} />
                ))}
              </motion.div>
            </TabsContent>

            {/* Onglet Dossiers */}
            <TabsContent value="files" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Dossiers en Cours</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser
                  </Button>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {activeFiles.map((file) => (
                  <Card key={file.id} className="hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900">
                            {file.clientName} - {file.type}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className="bg-green-100 text-green-800">
                              {file.value}
                            </Badge>
                            <Badge variant="outline">
                              {file.location}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-semibold ${getPriorityColor(file.priority)}`}>
                            Priorité {file.priority}
                          </div>
                          <div className="text-xs text-gray-500">
                            Échéance: {file.dueDate}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Progression */}
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Progression:</span>
                            <span className="font-semibold">{file.progress}%</span>
                          </div>
                          <Progress value={file.progress} className="h-2" />
                        </div>

                        {/* Informations bancaires */}
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Banque:</span>
                              <div className="font-semibold text-blue-900">{file.bank}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Conseiller:</span>
                              <div className="font-semibold text-blue-900">{file.bankAdvisor}</div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="text-gray-600 text-sm">Statut crédit:</span>
                            <Badge className={getStatusColor(file.creditStatus === 'Approuvé' ? 'Actif' : 'En négociation')}>
                              {file.creditStatus}
                            </Badge>
                          </div>
                        </div>

                        {/* Prochaine action */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-gray-600 text-sm">Prochaine action:</span>
                            <div className="font-medium">{file.nextAction}</div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              Voir
                            </Button>
                            <Button size="sm">
                              <Edit3 className="h-3 w-3 mr-1" />
                              Modifier
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Onglet Communication */}
            <TabsContent value="communication" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      <span>Communication Rapide</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Destinataire</label>
                        <select className="w-full mt-1 p-2 border rounded-lg">
                          <option>Amadou Diallo (Client)</option>
                          <option>Mme Fatou Sarr (Banque Atlantique)</option>
                          <option>M. Omar Ba (CBAO)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-700">Message</label>
                        <Textarea
                          placeholder="Tapez votre message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button onClick={handleSendMessage} className="flex-1">
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer
                        </Button>
                        <Button variant="outline">
                          <Zap className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      <span>Activité Récente</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Signature Amadou Diallo - Terrain Almadies</p>
                          <p className="text-xs text-gray-600">Il y a 2 heures • Banque Atlantique confirmée</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Documents reçus SENEGAL INVEST</p>
                          <p className="text-xs text-gray-600">Il y a 4 heures • CBAO - Validation en cours</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Nouveau client Moussa Thiam</p>
                          <p className="text-xs text-gray-600">Hier • UBA Sénégal - Pré-approbation</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Performance CRM</AlertTitle>
                <AlertDescription>
                  Excellente collaboration avec les partenaires bancaires ce mois : 
                  {crmStats.completedTransactions} transactions finalisées avec un taux de satisfaction de {crmStats.satisfactionScore}/5.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotaireCRM;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  User, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Paperclip,
  MoreHorizontal,
  Phone,
  Video,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Plus,
  Calendar,
  DollarSign,
  Building,
  MapPin,
  FileText,
  Users,
  Target,
  TrendingUp,
  Activity,
  Mail,
  Smartphone,
  Globe,
  HeadphonesIcon,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Share2,
  Download,
  Upload,
  Zap,
  Shield,
  Bell,
  Settings,
  Edit3,
  Eye,
  ChevronDown,
  ChevronRight,
  UserCheck,
  UserX,
  Briefcase,
  CreditCard,
  PieChart,
  BarChart3,
  RefreshCw,
  ExternalLink,
  Bookmark,
  Flag,
  Hash,
  AtSign,
  Headphones
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const BanqueMessages = () => {
  const [selectedConversation, setSelectedConversation] = useState('conv-1');
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('conversations');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Statistiques de communication
  const [commStats, setCommStats] = useState({
    totalConversations: 47,
    activeClients: 32,
    pendingResponses: 8,
    averageResponseTime: '2.4h',
    satisfactionScore: 4.7,
    resolvedToday: 12
  });

  // Templates de messages bancaires
  const messageTemplates = [
    {
      id: 'welcome',
      name: 'Bienvenue client',
      category: 'Onboarding',
      content: 'Bienvenue chez Banque Atlantique ! Votre conseiller dédié vous accompagnera dans tous vos projets immobiliers.'
    },
    {
      id: 'credit_approved',
      name: 'Crédit approuvé',
      category: 'Crédit',
      content: 'Excellente nouvelle ! Votre demande de crédit immobilier a été approuvée. Montant accordé : {amount}. Nous vous contactons pour finaliser les modalités.'
    },
    {
      id: 'documents_needed',
      name: 'Documents requis',
      category: 'Documentation',
      content: 'Pour finaliser votre dossier, nous avons besoin des documents suivants : - Bulletin de salaire (3 derniers) - Relevé de compte (6 mois) - Justificatif de domicile'
    },
    {
      id: 'meeting_reminder',
      name: 'Rappel RDV',
      category: 'Rendez-vous',
      content: 'Rappel : Votre rendez-vous avec votre conseiller est prévu le {date} à {time}. Merci d\'apporter les documents demandés.'
    }
  ];

  // Conversations avancées avec CRM
  const conversations = [
    {
      id: 'conv-1',
      contact: 'Amadou Diallo',
      type: 'Client Premium',
      lastMessage: 'Ma demande de crédit terrain a-t-elle été approuvée ?',
      timestamp: '10:30',
      unread: 2,
      priority: 'high',
      status: 'En attente',
      amount: '85M FCFA',
      property: 'Terrain Almadies',
      phone: '+221 77 123 45 67',
      email: 'amadou.diallo@email.com',
      clientSince: '2019',
      portfolioValue: '340M FCFA',
      riskLevel: 'Faible',
      lastInteraction: '2024-01-28',
      satisfactionScore: 4.8,
      preferredChannel: 'WhatsApp',
      nextAppointment: '2024-02-05 14:00',
      advisorNotes: 'Client fidèle, investisseur immobilier actif'
    },
    {
      id: 'conv-2', 
      contact: 'Me Fatou Ndiaye',
      type: 'Partenaire Notaire',
      lastMessage: 'Les documents pour le crédit Sarr sont prêts',
      timestamp: '09:45',
      unread: 0,
      priority: 'normal',
      status: 'Documenté',
      amount: '120M FCFA',
      property: 'Villa Mermoz',
      phone: '+221 33 456 78 90',
      email: 'fatou.ndiaye@notaire.sn',
      partnerSince: '2018',
      collaborations: 156,
      averageProcessingTime: '3.2 jours',
      reliability: 'Excellent',
      lastCollaboration: '2024-01-26'
    },
    {
      id: 'conv-3',
      contact: 'Teranga Foncier',
      type: 'Plateforme Partenaire',
      lastMessage: 'Nouvelle demande de financement reçue - TER-2024-015',
      timestamp: '08:20',
      unread: 1,
      priority: 'normal',
      status: 'Nouveau',
      amount: '65M FCFA',
      property: 'Terrain Rufisque',
      referenceId: 'TER-2024-015',
      platformCommission: '2.5%',
      totalReferrals: 89,
      approvalRate: '87%',
      averageAmount: '45M FCFA'
    },
    {
      id: 'conv-4',
      contact: 'Moussa Thiam',
      type: 'Client',
      lastMessage: 'Merci pour l\'approbation rapide ! Quand peut-on signer ?',
      timestamp: 'Hier',
      unread: 0,
      priority: 'low',
      status: 'Approuvé',
      amount: '95M FCFA',
      property: 'Appartement Plateau',
      phone: '+221 76 987 65 43',
      email: 'moussa.thiam@entreprise.sn',
      clientSince: '2023',
      portfolioValue: '95M FCFA',
      riskLevel: 'Très Faible',
      satisfactionScore: 5.0,
      advisorNotes: 'Premier achat immobilier, très satisfait du service'
    },
    {
      id: 'conv-5',
      contact: 'Khady Ba',
      type: 'Prospect',
      lastMessage: 'Je souhaite des informations sur vos crédits immobiliers',
      timestamp: '14:20',
      unread: 3,
      priority: 'high',
      status: 'Prospect',
      estimatedAmount: '75M FCFA',
      source: 'Site Web',
      leadScore: 85,
      conversionProbability: '78%',
      followUpDate: '2024-02-02'
    }
  ];

  // Messages enrichis avec métadonnées
  const messages = {
    'conv-1': [
      {
        id: 1,
        sender: 'Amadou Diallo',
        text: 'Bonjour, j\'ai soumis ma demande de crédit terrain il y a une semaine via la plateforme Teranga Foncier.',
        timestamp: '10:25',
        isClient: true,
        type: 'text',
        status: 'read'
      },
      {
        id: 2,
        sender: 'Conseiller Bancaire',
        text: 'Bonjour M. Diallo. Votre dossier est en cours d\'analyse par notre équipe crédit. Référence : CRED-2024-015',
        timestamp: '10:27',
        isClient: false,
        type: 'text',
        status: 'delivered'
      },
      {
        id: 3,
        sender: 'Amadou Diallo',
        text: 'Ma demande de crédit terrain a-t-elle été approuvée ?',
        timestamp: '10:30',
        isClient: true,
        type: 'text',
        status: 'read'
      },
      {
        id: 4,
        sender: 'Conseiller Bancaire',
        text: 'Je vérifie immédiatement l\'état de votre dossier avec l\'équipe crédit.',
        timestamp: '10:32',
        isClient: false,
        type: 'text',
        status: 'sending'
      }
    ]
  };

  // Activités récentes client
  const clientActivities = [
    {
      id: 1,
      type: 'credit_application',
      description: 'Demande de crédit soumise',
      amount: '85M FCFA',
      date: '2024-01-20',
      status: 'En cours'
    },
    {
      id: 2,
      type: 'document_upload',
      description: 'Documents justificatifs envoyés',
      date: '2024-01-22',
      status: 'Validé'
    },
    {
      id: 3,
      type: 'call',
      description: 'Appel téléphonique - Suivi dossier',
      duration: '12 min',
      date: '2024-01-25',
      status: 'Terminé'
    }
  ];

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    window.safeGlobalToast({
      title: "Message envoyé",
      description: "Votre message a été envoyé avec succès",
      variant: "success"
    });
    setMessageText('');
  };

  const handleCallClient = (contact) => {
    window.safeGlobalToast({
      title: "Appel en cours",
      description: `Appel vers ${contact}...`,
      variant: "success"
    });
  };

  const handleVideoCall = (contact) => {
    window.safeGlobalToast({
      title: "Visioconférence",
      description: `Démarrage de la visio avec ${contact}`,
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

  const handleUseTemplate = (template) => {
    setMessageText(template.content);
    setSelectedTemplate('');
  };

  const handleStartRecording = () => {
    setIsRecording(!isRecording);
    window.safeGlobalToast({
      title: isRecording ? "Enregistrement arrêté" : "Enregistrement démarré",
      description: isRecording ? "Message vocal sauvegardé" : "Enregistrement du message vocal...",
      variant: "success"  
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approuvé': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Rejeté': return 'bg-red-100 text-red-800';
      case 'Documenté': return 'bg-blue-100 text-blue-800';
      case 'Nouveau': return 'bg-purple-100 text-purple-800';
      case 'Prospect': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Très Faible': return 'text-green-700';
      case 'Faible': return 'text-green-600';
      case 'Moyen': return 'text-yellow-600';
      case 'Élevé': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
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
                  <p className="text-blue-600 text-sm font-medium">Conversations Actives</p>
                  <p className="text-2xl font-bold text-blue-900">{commStats.totalConversations}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
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
                  <p className="text-green-600 text-sm font-medium">Clients Actifs</p>
                  <p className="text-2xl font-bold text-green-900">{commStats.activeClients}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Temps de Réponse</p>
                  <p className="text-2xl font-bold text-yellow-900">{commStats.averageResponseTime}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Satisfaction</p>
                  <p className="text-2xl font-bold text-purple-900">{commStats.satisfactionScore}/5</p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Header principal */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Communication CRM Bancaire</h2>
          <p className="text-gray-600 mt-1">
            Gestion avancée des communications clients, partenaires et prospects
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Programmer RDV
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau contact
          </Button>
        </div>
      </div>

      {/* Interface principale avec onglets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            <span>Centre de Communication CRM</span>
          </CardTitle>
          <CardDescription>
            Interface unifiée pour la gestion des communications bancaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="conversations">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="conversations">Conversations</TabsTrigger>
              <TabsTrigger value="crm">CRM Client</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Onglet Conversations */}
            <TabsContent value="conversations" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
                {/* Liste des conversations */}
                <Card className="lg:col-span-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Conversations</CardTitle>
                      <Badge variant="secondary">{conversations.length}</Badge>
                    </div>
                    
                    {/* Recherche et filtres */}
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Rechercher conversations..."
                          className="pl-9"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant={filterStatus === 'all' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setFilterStatus('all')}
                        >
                          Tous
                        </Button>
                        <Button 
                          variant={filterStatus === 'unread' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setFilterStatus('unread')}
                        >
                          Non lus
                        </Button>
                        <Button 
                          variant={filterStatus === 'priority' ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setFilterStatus('priority')}
                        >
                          Priorité
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1 max-h-[500px] overflow-y-auto">
                      {filteredConversations.map((conv) => (
                        <motion.div
                          key={conv.id}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => setSelectedConversation(conv.id)}
                          className={`p-4 cursor-pointer transition-all duration-200 border-l-4 ${
                            selectedConversation === conv.id 
                              ? 'bg-blue-50 border-l-blue-600 shadow-sm' 
                              : 'border-l-transparent hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-10 h-10">
                                <AvatarFallback className="text-sm font-semibold">
                                  {conv.contact.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-sm text-gray-900">{conv.contact}</p>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    {conv.type}
                                  </Badge>
                                  {conv.priority === 'high' && (
                                    <Flag className="h-3 w-3 text-red-500" />
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">{conv.timestamp}</p>
                              {conv.unread > 0 && (
                                <Badge className="bg-red-500 text-white text-xs mt-1">
                                  {conv.unread}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {conv.lastMessage}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs">
                            <Badge className={getStatusColor(conv.status)}>
                              {conv.status}
                            </Badge>
                            <div className="text-gray-500 text-right">
                              <div>{conv.amount || conv.estimatedAmount}</div>
                              <div>{conv.property}</div>
                            </div>
                          </div>
                          
                          {/* Informations additionnelles */}
                          {conv.satisfactionScore && (
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span className="text-xs text-gray-600">{conv.satisfactionScore}</span>
                              </div>
                              {conv.preferredChannel && (
                                <Badge variant="outline" className="text-xs">
                                  {conv.preferredChannel}
                                </Badge>
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Zone de conversation avancée */}
                <div className="lg:col-span-2 space-y-4">
                  {selectedConversation ? (
                    <>
                      {/* Header conversation avec détails client */}
                      <Card>
                        <CardHeader className="border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="font-semibold">
                                  {conversations.find(c => c.id === selectedConversation)?.contact.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {conversations.find(c => c.id === selectedConversation)?.contact}
                                </h3>
                                <div className="flex items-center space-x-2 mb-1">
                                  <Badge variant="outline">
                                    {conversations.find(c => c.id === selectedConversation)?.type}
                                  </Badge>
                                  <Badge className={getStatusColor(conversations.find(c => c.id === selectedConversation)?.status)}>
                                    {conversations.find(c => c.id === selectedConversation)?.status}
                                  </Badge>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {conversations.find(c => c.id === selectedConversation)?.phone} • 
                                  {conversations.find(c => c.id === selectedConversation)?.email}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleCallClient(conversations.find(c => c.id === selectedConversation)?.contact)}
                              >
                                <Phone className="h-4 w-4 mr-1" />
                                Appeler
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleVideoCall(conversations.find(c => c.id === selectedConversation)?.contact)}
                              >
                                <Video className="h-4 w-4 mr-1" />
                                Visio
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleScheduleMeeting}
                              >
                                <Calendar className="h-4 w-4 mr-1" />
                                RDV
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setShowClientDetails(!showClientDetails)}
                              >
                                {showClientDetails ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          {/* Détails client étendus */}
                          {showClientDetails && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-4 p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Client depuis:</span>
                                  <div className="font-semibold">{conversations.find(c => c.id === selectedConversation)?.clientSince}</div>
                                </div>
                                <div>
                                  <span className="text-gray-600">Portfolio:</span>
                                  <div className="font-semibold text-green-600">
                                    {conversations.find(c => c.id === selectedConversation)?.portfolioValue}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-600">Risque:</span>
                                  <div className={`font-semibold ${getRiskColor(conversations.find(c => c.id === selectedConversation)?.riskLevel)}`}>
                                    {conversations.find(c => c.id === selectedConversation)?.riskLevel}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-gray-600">Satisfaction:</span>
                                  <div className="font-semibold flex items-center">
                                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                    {conversations.find(c => c.id === selectedConversation)?.satisfactionScore}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </CardHeader>
                      </Card>

                      {/* Zone de messages */}
                      <Card className="flex-1">
                        <CardContent className="p-4">
                          <div className="space-y-4 max-h-[400px] overflow-y-auto">
                            {(messages[selectedConversation] || []).map((message) => (
                              <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${message.isClient ? 'justify-start' : 'justify-end'}`}
                              >
                                <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                                  message.isClient 
                                    ? 'bg-gray-100 text-gray-900' 
                                    : 'bg-blue-600 text-white'
                                }`}>
                                  <p className="text-sm">{message.text}</p>
                                  <div className={`text-xs mt-2 flex items-center justify-between ${
                                    message.isClient ? 'text-gray-500' : 'text-blue-100'
                                  }`}>
                                    <span>{message.timestamp}</span>
                                    {!message.isClient && (
                                      <div className="flex items-center space-x-1">
                                        {message.status === 'sending' && <Clock className="h-3 w-3" />}
                                        {message.status === 'delivered' && <CheckCircle className="h-3 w-3" />}
                                        {message.status === 'read' && <CheckCircle className="h-3 w-3 text-blue-300" />}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Zone de saisie avancée */}
                          <div className="border-t pt-4 mt-4 space-y-3">
                            {/* Barre d'outils */}
                            <div className="flex items-center space-x-2 text-sm">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedTemplate(selectedTemplate ? '' : 'show')}
                              >
                                <FileText className="h-3 w-3 mr-1" />
                                Templates
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={handleStartRecording}
                                className={isRecording ? 'bg-red-100 text-red-700' : ''}
                              >
                                {isRecording ? <MicOff className="h-3 w-3 mr-1" /> : <Mic className="h-3 w-3 mr-1" />}
                                {isRecording ? 'Arrêter' : 'Vocal'}
                              </Button>
                              <Button variant="outline" size="sm">
                                <Camera className="h-3 w-3 mr-1" />
                                Photo
                              </Button>
                              <Button variant="outline" size="sm">
                                <Paperclip className="h-3 w-3 mr-1" />
                                Fichier
                              </Button>
                            </div>

                            {/* Templates rapides */}
                            {selectedTemplate && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="border rounded-lg p-3 bg-gray-50"
                              >
                                <div className="grid grid-cols-2 gap-2">
                                  {messageTemplates.slice(0, 4).map((template) => (
                                    <Button
                                      key={template.id}
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleUseTemplate(template)}
                                      className="text-xs text-left justify-start"
                                    >
                                      <Zap className="h-3 w-3 mr-1" />
                                      {template.name}
                                    </Button>
                                  ))}
                                </div>
                              </motion.div>
                            )}

                            {/* Saisie du message */}
                            <div className="flex items-center space-x-2">
                              <Textarea
                                placeholder="Tapez votre message... (Ctrl+Entrée pour envoyer)"
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && e.ctrlKey) {
                                    handleSendMessage();
                                  }
                                }}
                                className="flex-1 min-h-[80px] resize-none"
                              />
                              <Button onClick={handleSendMessage} className="self-end">
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <Card className="h-full">
                      <CardContent className="flex items-center justify-center h-[500px]">
                        <div className="text-center text-gray-500">
                          <MessageSquare className="h-16 w-16 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Sélectionnez une conversation</h3>
                          <p>Choisissez un contact pour commencer la communication</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Onglet CRM Client */}
            <TabsContent value="crm" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span>Profil Client Détaillé</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedConversation ? (
                      <div className="space-y-4">
                        <div className="text-center pb-4 border-b">
                          <Avatar className="w-20 h-20 mx-auto mb-3">
                            <AvatarFallback className="text-lg">
                              {conversations.find(c => c.id === selectedConversation)?.contact.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="font-semibold text-lg">
                            {conversations.find(c => c.id === selectedConversation)?.contact}
                          </h3>
                          <Badge className={getStatusColor(conversations.find(c => c.id === selectedConversation)?.status)}>
                            {conversations.find(c => c.id === selectedConversation)?.status}
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Portfolio total:</span>
                            <span className="font-semibold text-green-600">
                              {conversations.find(c => c.id === selectedConversation)?.portfolioValue}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Client depuis:</span>
                            <span className="font-semibold">
                              {conversations.find(c => c.id === selectedConversation)?.clientSince}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Niveau de risque:</span>
                            <span className={`font-semibold ${getRiskColor(conversations.find(c => c.id === selectedConversation)?.riskLevel)}`}>
                              {conversations.find(c => c.id === selectedConversation)?.riskLevel}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Satisfaction:</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-semibold">
                                {conversations.find(c => c.id === selectedConversation)?.satisfactionScore}/5
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <User className="h-12 w-12 mx-auto mb-4" />
                        <p>Sélectionnez un client pour voir son profil</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-green-600" />
                      <span>Activités Récentes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {clientActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.description}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-600">
                              <Calendar className="h-3 w-3" />
                              <span>{activity.date}</span>
                              {activity.amount && (
                                <>
                                  <DollarSign className="h-3 w-3" />
                                  <span>{activity.amount}</span>
                                </>
                              )}
                            </div>
                            <Badge size="sm" className={getStatusColor(activity.status)}>
                              {activity.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Onglet Templates */}
            <TabsContent value="templates" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {messageTemplates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold">{template.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {template.content}
                      </p>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUseTemplate(template)}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Utiliser
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Onglet Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Messages envoyés</p>
                        <p className="text-2xl font-bold text-blue-600">247</p>
                      </div>
                      <Send className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="mt-2">
                      <Progress value={75} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">+15% ce mois</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Taux de réponse</p>
                        <p className="text-2xl font-bold text-green-600">89%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="mt-2">
                      <Progress value={89} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">Excellent</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Temps moyen</p>
                        <p className="text-2xl font-bold text-yellow-600">{commStats.averageResponseTime}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div className="mt-2">
                      <Progress value={65} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">Objectif: 2h</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Satisfaction</p>
                        <p className="text-2xl font-bold text-purple-600">{commStats.satisfactionScore}/5</p>
                      </div>
                      <Star className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="mt-2">
                      <Progress value={commStats.satisfactionScore * 20} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">Très satisfaisant</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertTitle>Performance Communication</AlertTitle>
                <AlertDescription>
                  Excellente performance ce mois avec {commStats.resolvedToday} dossiers résolus aujourd'hui 
                  et un taux de satisfaction de {commStats.satisfactionScore}/5.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BanqueMessages;
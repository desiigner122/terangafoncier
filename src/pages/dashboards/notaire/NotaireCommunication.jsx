import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Filter, 
  Phone, 
  Video, 
  Calendar, 
  FileText, 
  Users, 
  Building, 
  Scale, 
  Gavel, 
  Stamp, 
  PenTool, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Star, 
  Plus, 
  Eye, 
  Download, 
  Upload, 
  Share2, 
  RefreshCw, 
  Bell, 
  Flag, 
  Bookmark, 
  Edit3, 
  Zap, 
  Mic, 
  MicOff, 
  Camera, 
  Paperclip, 
  ChevronDown, 
  ChevronRight,
  DollarSign,
  MapPin,
  Activity,
  Target,
  Hash,
  AtSign,
  UserCheck,
  CreditCard,
  Shield
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const NotaireCommunication = ({ dashboardStats }) => {
  const [selectedConversation, setSelectedConversation] = useState('conv-1');
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeChannel, setActiveChannel] = useState('messages');
  const [showDetails, setShowDetails] = useState(false);

  // Statistiques de communication
  const [commStats, setCommStats] = useState({
    totalConversations: 34,
    clientConversations: 20,
    bankConversations: 14,
    pendingSignatures: 8,
    averageResponseTime: '45 min',
    satisfactionScore: 4.9,
    resolvedToday: 7
  });

  // Conversations tripartites (Notaire-Banque-Client)
  const [conversations, setConversations] = useState([
    {
      id: 'conv-1',
      type: 'Tripartite',
      participants: [
        { name: 'Amadou Diallo', role: 'Client', avatar: 'AD' },
        { name: 'Mme Fatou Sarr', role: 'Conseiller Banque Atlantique', avatar: 'FS' },
        { name: 'Me Ousmane Kane', role: 'Notaire', avatar: 'OK' }
      ],
      subject: 'Finalisation Achat Terrain Almadies',
      lastMessage: 'Les documents sont prêts pour la signature définitive',
      timestamp: '10:30',
      unread: 2,
      priority: 'Haute',
      status: 'Signature en cours',
      transactionValue: '85M FCFA',
      dossierRef: 'NOT-2024-015',
      creditRef: 'CRED-2024-015',
      location: 'Almadies, Dakar',
      stage: 'Signature',
      progress: 90
    },
    {
      id: 'conv-2',
      type: 'Banque-Client',
      participants: [
        { name: 'SENEGAL INVEST', role: 'Client Entreprise', avatar: 'SI' },
        { name: 'M. Omar Ba', role: 'Directeur CBAO', avatar: 'OB' },
        { name: 'Me Ousmane Kane', role: 'Notaire', avatar: 'OK' }
      ],
      subject: 'Acquisition Villa Mermoz - Validation Documents',
      lastMessage: 'Expertise technique validée, crédit approuvé sous conditions',
      timestamp: '09:15',
      unread: 0,
      priority: 'Moyenne',
      status: 'Validation banque',
      transactionValue: '120M FCFA',
      dossierRef: 'NOT-2024-012',
      creditRef: 'CBAO-2024-008',
      location: 'Mermoz, Dakar',
      stage: 'Validation',
      progress: 75
    },
    {
      id: 'conv-3',
      type: 'Client Direct',
      participants: [
        { name: 'Moussa Thiam', role: 'Primo-accédant', avatar: 'MT' },
        { name: 'Me Ousmane Kane', role: 'Notaire', avatar: 'OK' }
      ],
      subject: 'Premier Achat - Accompagnement Complet',
      lastMessage: 'Rendez-vous avec UBA programmé pour demain',
      timestamp: '08:45',
      unread: 1,
      priority: 'Normale',
      status: 'Accompagnement',
      transactionValue: '95M FCFA',
      dossierRef: 'NOT-2024-018',
      creditRef: 'En attente',
      location: 'Plateau, Dakar',
      stage: 'Constitution dossier',
      progress: 40
    }
  ]);

  // Messages avec contexte notarial
  const [messages, setMessages] = useState({
    'conv-1': [
      {
        id: 1,
        sender: 'Amadou Diallo',
        role: 'Client',
        text: 'Bonjour, quand pouvons-nous procéder à la signature définitive ?',
        timestamp: '09:30',
        type: 'text',
        isNotaire: false
      },
      {
        id: 2,
        sender: 'Mme Fatou Sarr',
        role: 'Banque Atlantique',
        text: 'Le déblocage des fonds est confirmé. Tous les documents bancaires sont prêts.',
        timestamp: '09:35',
        type: 'text',
        isNotaire: false,
        attachments: ['Accord_Credit_Final.pdf', 'Conditions_Deblocage.pdf']
      },
      {
        id: 3,
        sender: 'Me Ousmane Kane',
        role: 'Notaire',
        text: 'Parfait ! J\'ai préparé l\'acte authentique. Nous pouvons programmer la signature pour vendredi 14h.',
        timestamp: '09:40',
        type: 'text',
        isNotaire: true
      },
      {
        id: 4,
        sender: 'Me Ousmane Kane',
        role: 'Notaire',
        text: 'Voici le projet d\'acte pour validation avant signature.',
        timestamp: '10:15',
        type: 'document',
        isNotaire: true,
        attachments: ['Projet_Acte_Authentique.pdf'],
        documentType: 'Acte authentique'
      },
      {
        id: 5,
        sender: 'Amadou Diallo',
        role: 'Client',
        text: 'Document validé. Confirmo pour vendredi 14h. Merci pour l\'accompagnement !',
        timestamp: '10:30',
        type: 'text',
        isNotaire: false
      }
    ]
  });

  // Templates de communication notariale
  const [messageTemplates, setMessageTemplates] = useState([
    {
      id: 'signature_ready',
      name: 'Signature Prête',
      category: 'Actes',
      content: 'L\'acte authentique est finalisé. Nous pouvons programmer la signature. Merci de confirmer votre disponibilité.',
      usageCount: 45
    },
    {
      id: 'documents_needed',
      name: 'Documents Manquants',
      category: 'Documentation',
      content: 'Pour finaliser le dossier, nous avons besoin des pièces suivantes : [Liste des documents]. Merci de les transmettre au plus tôt.',
      usageCount: 32
    },
    {
      id: 'bank_validation',
      name: 'Validation Bancaire',
      category: 'Banque',
      content: 'Le dossier a été transmis à la banque pour validation. Le conseiller vous contactera sous 48h pour la suite de la procédure.',
      usageCount: 28
    },
    {
      id: 'completion',
      name: 'Transaction Finalisée',
      category: 'Clôture',
      content: 'Félicitations ! La transaction est officiellement finalisée. Les clés vous seront remises selon les modalités convenues.',
      usageCount: 67
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Signature en cours': return 'bg-green-100 text-green-800';
      case 'Validation banque': return 'bg-yellow-100 text-yellow-800';
      case 'Accompagnement': return 'bg-blue-100 text-blue-800';
      case 'Documents manquants': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Haute': return 'text-red-600';
      case 'Moyenne': return 'text-yellow-600';
      case 'Normale': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Tripartite': return 'bg-purple-100 text-purple-800';
      case 'Banque-Client': return 'bg-blue-100 text-blue-800';
      case 'Client Direct': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    window.safeGlobalToast({
      title: "Message envoyé",
      description: "Votre message a été transmis à tous les participants",
      variant: "success"
    });
    setMessageText('');
  };

  const handleScheduleSignature = () => {
    window.safeGlobalToast({
      title: "Signature programmée",
      description: "Invitation de signature envoyée aux participants",
      variant: "success"
    });
  };

  const handleCallParticipant = (name) => {
    window.safeGlobalToast({
      title: "Appel en cours",
      description: `Conférence téléphonique avec ${name}...`,
      variant: "success"
    });
  };

  const handleUseTemplate = (template) => {
    setMessageText(template.content);
  };

  const ConversationCard = ({ conversation }) => {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        onClick={() => setSelectedConversation(conversation.id)}
        className={`cursor-pointer transition-all duration-200 border-l-4 ${
          selectedConversation === conversation.id 
            ? 'bg-blue-50 border-l-blue-600 shadow-sm' 
            : 'border-l-transparent hover:bg-gray-50'
        }`}
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={getTypeColor(conversation.type)}>
                    {conversation.type}
                  </Badge>
                  {conversation.priority !== 'Normale' && (
                    <Flag className={`h-3 w-3 ${getPriorityColor(conversation.priority)}`} />
                  )}
                </div>
                <CardTitle className="text-sm font-semibold text-gray-900">
                  {conversation.subject}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className={getStatusColor(conversation.status)}>
                    {conversation.status}
                  </Badge>
                  <span className="text-xs text-gray-500">{conversation.dossierRef}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                {conversation.unread > 0 && (
                  <Badge className="bg-red-500 text-white text-xs mt-1">
                    {conversation.unread}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Participants */}
            <div className="flex -space-x-2 mb-3">
              {conversation.participants.map((participant, index) => (
                <Avatar key={index} className="w-6 h-6 border-2 border-white">
                  <AvatarFallback className="text-xs">
                    {participant.avatar}
                  </AvatarFallback>
                </Avatar>
              ))}
              <div className="ml-3">
                <p className="text-xs text-gray-600">
                  {conversation.participants.length} participant(s)
                </p>
              </div>
            </div>

            {/* Dernier message */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {conversation.lastMessage}
            </p>

            {/* Informations transaction */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Valeur:</span>
                <span className="font-semibold text-green-600">{conversation.transactionValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Localisation:</span>
                <span className="font-medium">{conversation.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Progression:</span>
                <span className="font-medium">{conversation.progress}%</span>
              </div>
              <Progress value={conversation.progress} className="h-1" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Statistiques de communication */}
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
                  <p className="text-blue-600 text-sm font-medium">Conversations</p>
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
                  <p className="text-green-600 text-sm font-medium">Signatures Pending</p>
                  <p className="text-2xl font-bold text-green-900">{commStats.pendingSignatures}</p>
                </div>
                <PenTool className="h-8 w-8 text-green-600" />
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
                  <p className="text-yellow-600 text-sm font-medium">Temps Réponse</p>
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
          <h2 className="text-3xl font-bold text-gray-900">Communication Notariale Intégrée</h2>
          <p className="text-gray-600 mt-1">
            Interface tripartite Notaire - Banque - Client avec gestion des actes
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Programmer Signature
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Dossier
          </Button>
        </div>
      </div>

      {/* Interface principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        {/* Liste des conversations */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Dossiers Actifs</CardTitle>
              <Badge variant="secondary">{conversations.length}</Badge>
            </div>
            
            {/* Recherche et filtres */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Rechercher dossiers..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-1">
                <Button 
                  variant={filterType === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilterType('all')}
                >
                  Tous
                </Button>
                <Button 
                  variant={filterType === 'tripartite' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilterType('tripartite')}
                >
                  Tripartite
                </Button>
                <Button 
                  variant={filterType === 'urgent' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilterType('urgent')}
                >
                  Urgent
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1 max-h-[500px] overflow-y-auto">
              {conversations.map((conversation) => (
                <ConversationCard key={conversation.id} conversation={conversation} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Zone de conversation */}
        <div className="lg:col-span-2 space-y-4">
          {selectedConversation ? (
            <>
              {/* Header conversation détaillée */}
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {conversations.find(c => c.id === selectedConversation)?.subject}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(conversations.find(c => c.id === selectedConversation)?.status)}>
                          {conversations.find(c => c.id === selectedConversation)?.status}
                        </Badge>
                        <Badge variant="outline">
                          {conversations.find(c => c.id === selectedConversation)?.dossierRef}
                        </Badge>
                        <Badge variant="outline">
                          {conversations.find(c => c.id === selectedConversation)?.transactionValue}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCallParticipant('tous les participants')}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Conférence
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleScheduleSignature}
                      >
                        <PenTool className="h-4 w-4 mr-1" />
                        Signature
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowDetails(!showDetails)}
                      >
                        {showDetails ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Participants détaillés */}
                  <div className="flex items-center space-x-4 pt-3">
                    {conversations.find(c => c.id === selectedConversation)?.participants.map((participant, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {participant.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{participant.name}</p>
                          <p className="text-xs text-gray-600">{participant.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Détails du dossier */}
                  {showDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Localisation:</span>
                          <div className="font-semibold">{conversations.find(c => c.id === selectedConversation)?.location}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Crédit Réf:</span>
                          <div className="font-semibold text-blue-600">
                            {conversations.find(c => c.id === selectedConversation)?.creditRef}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Étape:</span>
                          <div className="font-semibold">{conversations.find(c => c.id === selectedConversation)?.stage}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Progression:</span>
                          <div className="font-semibold text-green-600">
                            {conversations.find(c => c.id === selectedConversation)?.progress}%
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
                  <div className="space-y-4 max-h-[350px] overflow-y-auto">
                    {(messages[selectedConversation] || []).map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.isNotaire ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] space-y-2`}>
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="font-medium">{message.sender}</span>
                            <Badge variant="outline" className="text-xs">
                              {message.role}
                            </Badge>
                            <span className="text-gray-500">{message.timestamp}</span>
                          </div>
                          
                          <div className={`p-3 rounded-lg shadow-sm ${
                            message.isNotaire 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.text}</p>
                            
                            {message.attachments && (
                              <div className="mt-3 space-y-1">
                                {message.attachments.map((attachment, index) => (
                                  <div key={index} className={`flex items-center space-x-2 p-2 rounded text-xs ${
                                    message.isNotaire ? 'bg-blue-700' : 'bg-white border'
                                  }`}>
                                    <FileText className="h-3 w-3" />
                                    <span className="flex-1">{attachment}</span>
                                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {message.documentType && (
                              <div className="mt-2">
                                <Badge className="bg-green-600 text-white text-xs">
                                  {message.documentType}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Zone de saisie notariale */}
                  <div className="border-t pt-4 mt-4 space-y-3">
                    {/* Templates rapides */}
                    <div className="flex space-x-2 text-sm overflow-x-auto">
                      {messageTemplates.slice(0, 4).map((template) => (
                        <Button
                          key={template.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleUseTemplate(template)}
                          className="whitespace-nowrap"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          {template.name}
                        </Button>
                      ))}
                    </div>

                    {/* Barre d'outils notariale */}
                    <div className="flex items-center space-x-2 text-sm">
                      <Button variant="outline" size="sm">
                        <Stamp className="h-3 w-3 mr-1" />
                        Acte
                      </Button>
                      <Button variant="outline" size="sm">
                        <PenTool className="h-3 w-3 mr-1" />
                        Signature
                      </Button>
                      <Button variant="outline" size="sm">
                        <Shield className="h-3 w-3 mr-1" />
                        Certificat
                      </Button>
                      <Button variant="outline" size="sm">
                        <Paperclip className="h-3 w-3 mr-1" />
                        Fichier
                      </Button>
                    </div>

                    {/* Saisie du message */}
                    <div className="flex items-end space-x-2">
                      <Textarea
                        placeholder="Message à tous les participants..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="flex-1 min-h-[60px] resize-none"
                      />
                      <Button onClick={handleSendMessage}>
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
                  <Scale className="h-16 w-16 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Sélectionnez un dossier</h3>
                  <p>Choisissez une conversation pour gérer la communication tripartite</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Communication Efficace</AlertTitle>
        <AlertDescription>
          {commStats.resolvedToday} dossiers traités aujourd'hui avec un temps de réponse moyen de {commStats.averageResponseTime}. 
          Satisfaction client: {commStats.satisfactionScore}/5.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default NotaireCommunication;
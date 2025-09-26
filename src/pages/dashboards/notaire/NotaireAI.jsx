import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Brain, 
  Sparkles, 
  MessageSquare, 
  FileText, 
  Search,
  Lightbulb,
  Target,
  Zap,
  Award,
  TrendingUp,
  Shield,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const NotaireAI = () => {
  const [aiAssistant, setAiAssistant] = useState({
    status: 'active',
    queries: 156,
    accuracy: 94.8,
    timesSaved: 245
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAITool, setSelectedAITool] = useState('document_analysis');

  // Outils IA disponibles
  const aiTools = [
    {
      id: 'document_analysis',
      name: 'Analyse de Documents',
      description: 'Analyse automatique et extraction de données des documents légaux',
      icon: FileText,
      status: 'active',
      usage: 89,
      accuracy: 96.5
    },
    {
      id: 'legal_research',
      name: 'Recherche Juridique',
      description: 'Assistant de recherche dans la jurisprudence et la législation',
      icon: Search,
      status: 'active',
      usage: 67,
      accuracy: 92.1
    },
    {
      id: 'contract_review',
      name: 'Révision Contrats',
      description: 'Vérification automatique de clauses et conformité légale',
      icon: Shield,
      status: 'active',
      usage: 78,
      accuracy: 94.8
    },
    {
      id: 'risk_assessment',
      name: 'Évaluation Risques',
      description: 'Analyse des risques légaux et financiers des transactions',
      icon: AlertTriangle,
      status: 'beta',
      usage: 45,
      accuracy: 88.3
    },
    {
      id: 'predictive_analytics',
      name: 'Analytics Prédictives',
      description: 'Prédictions sur les tendances du marché immobilier',
      icon: TrendingUp,
      status: 'beta',
      usage: 34,
      accuracy: 85.7
    },
    {
      id: 'automated_drafting',
      name: 'Rédaction Automatisée',
      description: 'Génération automatique de brouillons d\'actes notariés',
      icon: Bot,
      status: 'experimental',
      usage: 12,
      accuracy: 82.4
    }
  ];

  // Recommandations IA
  const aiRecommendations = [
    {
      type: 'efficiency',
      title: 'Optimisation du workflow',
      description: 'L\'IA recommande d\'automatiser la vérification des documents d\'identité pour gagner 15 minutes par dossier',
      priority: 'high',
      impact: 'Gain de temps: 2.5h/jour',
      action: 'Activer la vérification automatique'
    },
    {
      type: 'compliance',
      title: 'Alerte conformité',
      description: 'Nouveaux critères de conformité détectés dans 3 dossiers récents',
      priority: 'medium',
      impact: 'Réduction des risques légaux',
      action: 'Réviser les dossiers signalés'
    },
    {
      type: 'opportunity',
      title: 'Opportunité de revenus',
      description: 'L\'IA identifie une hausse de 20% des demandes de succession dans votre secteur',
      priority: 'low',
      impact: 'Revenus potentiels: +850K FCFA/mois',
      action: 'Développer l\'offre succession'
    }
  ];

  // Messages d'exemple pour le chat IA
  const exampleMessages = [
    {
      role: 'user',
      content: 'Analyse le document de vente immobilière pour Mme Diallo',
      timestamp: '14:30'
    },
    {
      role: 'assistant',
      content: 'Document analysé avec succès. Voici les points clés identifiés:\n\n• Propriété: Villa 4 chambres, Almadies\n• Prix: 85M FCFA\n• Statut légal: Conforme\n• Documents requis: Titre foncier (✓), Certificat non-gage (⚠️ manquant)\n\nRecommandation: Demander le certificat de non-gage avant signature.',
      timestamp: '14:31'
    }
  ];

  useEffect(() => {
    setChatMessages(exampleMessages);
  }, []);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    setIsProcessing(true);
    const newMessage = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');

    // Simulation de réponse IA
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant',
        content: 'Je traite votre demande... Analyse en cours des documents et recherche dans la base juridique.',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
      
      window.safeGlobalToast({
        title: "Assistant IA",
        description: "Réponse générée avec succès",
        variant: "success"
      });
    }, 2000);
  };

  const handleActivateTool = (toolId) => {
    setIsProcessing(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Outil IA activé",
        description: `${aiTools.find(t => t.id === toolId)?.name} est maintenant actif`,
        variant: "success"
      });
      setIsProcessing(false);
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-blue-100 text-blue-800';
      case 'experimental': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Assistant IA Notarial</h2>
          <p className="text-gray-600 mt-1">
            Intelligence artificielle pour optimiser votre pratique notariale
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Badge className="bg-green-100 text-green-800">
            <Bot className="h-3 w-3 mr-1" />
            IA Active
          </Badge>
          <Button 
            variant="outline"
            disabled={isProcessing}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurer IA
          </Button>
        </div>
      </div>

      {/* Statistiques IA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Requêtes traitées</p>
                <p className="text-2xl font-bold">{aiAssistant.queries}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Précision IA</p>
                <p className="text-2xl font-bold text-green-600">{aiAssistant.accuracy}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Temps économisé</p>
                <p className="text-2xl font-bold text-purple-600">{aiAssistant.timesSaved}h</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Statut système</p>
                <p className="text-2xl font-bold text-green-600">Optimal</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">Chat IA</TabsTrigger>
          <TabsTrigger value="tools">Outils IA</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics IA</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2 text-blue-600" />
                Assistant IA Conversationnel
              </CardTitle>
              <CardDescription>
                Posez vos questions sur vos dossiers, la législation ou demandez une analyse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Messages */}
                <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                        <p className="text-sm">L'assistant réfléchit...</p>
                        <div className="flex space-x-1 mt-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Posez votre question à l'IA..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isProcessing}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={isProcessing || !currentMessage.trim()}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full ${selectedAITool === tool.id ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <tool.icon className="h-8 w-8 text-blue-600" />
                      <Badge className={getStatusColor(tool.status)}>
                        {tool.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Utilisation</span>
                          <span className="text-sm font-medium">{tool.usage}%</span>
                        </div>
                        <Progress value={tool.usage} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Précision</span>
                          <span className="text-sm font-medium text-green-600">{tool.accuracy}%</span>
                        </div>
                        <Progress value={tool.accuracy} className="h-2" />
                      </div>
                      
                      <Button 
                        className="w-full"
                        variant={selectedAITool === tool.id ? "default" : "outline"}
                        onClick={() => {
                          setSelectedAITool(tool.id);
                          handleActivateTool(tool.id);
                        }}
                        disabled={isProcessing}
                      >
                        {tool.status === 'active' ? (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Utiliser
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Activer
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="space-y-4">
            {aiRecommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Lightbulb className="h-5 w-5 text-yellow-600" />
                          <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{rec.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-green-700">{rec.impact}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        className="ml-4"
                        onClick={() => {
                          window.safeGlobalToast({
                            title: "Action planifiée",
                            description: rec.action,
                            variant: "success"
                          });
                        }}
                      >
                        {rec.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  Apprentissage IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Modèles entraînés</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Données traitées</span>
                    <span className="font-semibold">2.4M documents</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amélioration mensuelle</span>
                    <span className="font-semibold text-green-600">+3.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-orange-600" />
                  Impact Business
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Temps économisé/mois</span>
                    <span className="font-semibold">68 heures</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Erreurs évitées</span>
                    <span className="font-semibold">45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Revenus additionnels</span>
                    <span className="font-semibold text-green-600">1.2M FCFA</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotaireAI;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain,
  MessageSquare,
  Lightbulb,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RefreshCw,
  Download,
  Settings,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MairieAI = ({ dashboardStats }) => {
  const [activeTab, setActiveTab] = useState('assistant');
  const [aiQuery, setAiQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // Suggestions IA prédéfinies
  const aiSuggestions = [
    {
      id: 'sugg-1',
      category: 'Optimisation',
      title: 'Réduction délais traitement',
      description: 'Optimiser le processus d\'attribution communale pour réduire les délais de 25%',
      impact: 'Haute',
      confidence: 92,
      timeline: '2-3 mois',
      resources: ['Formation équipe', 'Digitalisation processus'],
      status: 'Recommandé'
    },
    {
      id: 'sugg-2',
      category: 'Prédiction',
      title: 'Zones à forte demande',
      description: 'La Zone Résidentielle Nord connaîtra une hausse de 35% des demandes au Q2',
      impact: 'Moyenne',
      confidence: 87,
      timeline: '3-6 mois',
      resources: ['Étude faisabilité', 'Plan d\'extension'],
      status: 'En analyse'
    },
    {
      id: 'sugg-3',
      category: 'Alerte',
      title: 'Saturation Zone Commerciale',
      description: 'La Zone Commerciale Centre atteindra sa capacité maximale d\'ici 8 mois',
      impact: 'Haute',
      confidence: 94,
      timeline: '6-8 mois',
      resources: ['Plan urbanisme', 'Extension zone'],
      status: 'Critique'
    },
    {
      id: 'sugg-4',
      category: 'Efficacité',
      title: 'Automatisation validation',
      description: 'Automatiser 60% des validations de conformité avec l\'IA',
      impact: 'Moyenne',
      confidence: 89,
      timeline: '4-6 mois',
      resources: ['Système IA', 'Base données'],
      status: 'Planifié'
    }
  ];

  // Analyses IA récentes
  const aiAnalyses = [
    {
      id: 'analysis-1',
      type: 'Analyse Prédictive',
      title: 'Prévision demandes Février 2024',
      result: '78 demandes attendues (+8% vs Janvier)',
      accuracy: '91%',
      date: '2024-01-22',
      details: 'Basé sur historique 24 mois + événements locaux + saisonnalité'
    },
    {
      id: 'analysis-2',
      type: 'Détection Anomalies',
      title: 'Pics inhabituels Zone Agricole',
      result: 'Augmentation 150% demandes agricoles détectée',
      accuracy: '96%',
      date: '2024-01-21',
      details: 'Corrélation avec nouveau programme gouvernemental agricole'
    },
    {
      id: 'analysis-3',
      type: 'Optimisation Ressources',
      title: 'Allocation personnel février',
      result: 'Redistribution recommandée : +2 agents zone commerciale',
      accuracy: '88%',
      date: '2024-01-20',
      details: 'Analyse charge travail + prévisions demandes + capacité équipe'
    }
  ];

  // Conversation avec l'assistant IA
  const conversationExample = [
    {
      type: 'user',
      message: 'Quelles sont les tendances actuelles des demandes foncières ?',
      timestamp: '14:30'
    },
    {
      type: 'ai',
      message: 'Basé sur l\'analyse des 12 derniers mois, voici les principales tendances :\n\n• **Augmentation de 23%** des demandes dans la Zone Résidentielle Nord\n• **Stabilisation** des demandes commerciales (+2%)\n• **Émergence** de demandes mixtes (résidentiel-commercial) : +45%\n• **Délais de traitement** réduits de 18% grâce aux optimisations\n\nRecommandation : Préparer l\'extension de la Zone Nord pour répondre à la demande croissante.',
      timestamp: '14:31',
      confidence: 94
    },
    {
      type: 'user',
      message: 'Comment optimiser les délais de traitement des permis de construire ?',
      timestamp: '14:35'
    },
    {
      type: 'ai',
      message: 'Voici mes recommandations pour optimiser les délais :\n\n**1. Automatisation (Impact: -40% délais)**\n• Validation automatique documents standards\n• Pré-évaluation conformité urbanisme\n\n**2. Réorganisation processus (Impact: -25% délais)**\n• Traitement parallèle des étapes\n• Priorisation intelligente\n\n**3. Formation équipe (Impact: -15% délais)**\n• Spécialisation par type de demande\n• Outils d\'aide à la décision\n\n**Délai cible**: Passer de 22j à 14j moyenne',
      timestamp: '14:36',
      confidence: 91
    }
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Optimisation': return 'bg-blue-100 text-blue-800';
      case 'Prédiction': return 'bg-purple-100 text-purple-800';
      case 'Alerte': return 'bg-red-100 text-red-800';
      case 'Efficacité': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Recommandé': return 'bg-green-100 text-green-800';
      case 'En analyse': return 'bg-blue-100 text-blue-800';
      case 'Critique': return 'bg-red-100 text-red-800';
      case 'Planifié': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'Haute': return 'text-red-600';
      case 'Moyenne': return 'text-orange-600';
      case 'Faible': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleSendMessage = () => {
    if (aiQuery.trim()) {
      const newMessage = {
        type: 'user',
        message: aiQuery,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory([...chatHistory, newMessage]);
      setAiQuery('');

      // Simulation réponse IA après délai
      setTimeout(() => {
        const aiResponse = {
          type: 'ai',
          message: 'Je traite votre demande et analyse les données municipales pertinentes. Voici ma réponse basée sur l\'analyse des données...',
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          confidence: Math.floor(85 + Math.random() * 15)
        };
        setChatHistory(prev => [...prev, aiResponse]);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Assistant IA Municipal</h2>
          <p className="text-gray-600 mt-1">
            Intelligence artificielle pour l'aide à la décision municipale
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Badge className="bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            IA Active
          </Badge>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </Button>
        </div>
      </div>

      {/* Indicateurs IA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suggestions Actives</p>
                <p className="text-2xl font-bold text-blue-600">12</p>
              </div>
              <Lightbulb className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Précision Moyenne</p>
                <p className="text-2xl font-bold text-green-600">92.3%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Temps Économisé</p>
                <p className="text-2xl font-bold text-purple-600">124h</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Optimisations</p>
                <p className="text-2xl font-bold text-orange-600">8</p>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs IA */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assistant">Assistant Conversationnel</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions IA</TabsTrigger>
          <TabsTrigger value="analyses">Analyses Prédictives</TabsTrigger>
          <TabsTrigger value="training">Formation IA</TabsTrigger>
        </TabsList>

        {/* Assistant Conversationnel */}
        <TabsContent value="assistant" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 text-purple-600 mr-2" />
                    Assistant IA Municipal
                  </CardTitle>
                  <CardDescription>
                    Posez vos questions sur la gestion municipale et foncière
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {/* Zone de conversation */}
                  <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-4">
                    {conversationExample.concat(chatHistory).map((message, index) => (
                      <div key={index} className={`mb-4 ${
                        message.type === 'user' ? 'text-right' : 'text-left'
                      }`}>
                        <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
                          message.type === 'user' 
                            ? 'bg-teal-600 text-white rounded-br-none'
                            : 'bg-white border rounded-bl-none'
                        }`}>
                          {message.type === 'ai' && (
                            <div className="flex items-center space-x-2 mb-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-purple-100 text-purple-600">
                                  <Brain className="h-3 w-3" />
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-600">Assistant IA</span>
                              {message.confidence && (
                                <Badge variant="secondary" className="text-xs">
                                  {message.confidence}% confiance
                                </Badge>
                              )}
                            </div>
                          )}
                          <div className="whitespace-pre-line text-sm">
                            {message.message}
                          </div>
                          <div className={`text-xs mt-1 ${
                            message.type === 'user' ? 'text-teal-200' : 'text-gray-500'
                          }`}>
                            {message.timestamp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Interface de saisie */}
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Posez votre question à l'IA municipale..."
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsListening(!isListening)}
                      className={isListening ? 'bg-red-100 text-red-600' : ''}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsSpeaking(!isSpeaking)}
                      className={isSpeaking ? 'bg-blue-100 text-blue-600' : ''}
                    >
                      {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    
                    <Button onClick={handleSendMessage} className="bg-teal-600 hover:bg-teal-700">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Raccourcis rapides */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Questions Rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    'Analyse des délais actuels',
                    'Prévisions demandes février',
                    'Optimisation ressources',
                    'Zones à surveiller',
                    'Rapport mensuel automatique',
                    'Indicateurs performance'
                  ].map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left"
                      onClick={() => setAiQuery(question)}
                    >
                      <MessageSquare className="h-3 w-3 mr-2" />
                      {question}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Suggestions IA */}
        <TabsContent value="suggestions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getCategoryColor(suggestion.category)}>
                          {suggestion.category}
                        </Badge>
                        <Badge className={getStatusColor(suggestion.status)}>
                          {suggestion.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {suggestion.confidence}%
                      </div>
                      <div className="text-xs text-gray-600">confiance</div>
                    </div>
                  </div>
                  <CardDescription>{suggestion.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Impact</span>
                      <p className={`font-medium ${getImpactColor(suggestion.impact)}`}>
                        {suggestion.impact}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Délai</span>
                      <p className="font-medium text-gray-900">{suggestion.timeline}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-gray-600 mb-2 block">Ressources nécessaires:</span>
                    <div className="flex flex-wrap gap-1">
                      {suggestion.resources.map((resource, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {resource}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Progress value={suggestion.confidence} className="h-2" />

                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Approuver
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Détails
                    </Button>
                    <Button size="sm" variant="outline">
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      Rejeter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analyses Prédictives */}
        <TabsContent value="analyses" className="space-y-6">
          <div className="space-y-4">
            {aiAnalyses.map((analysis) => (
              <Card key={analysis.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary">{analysis.type}</Badge>
                        <span className="text-sm text-gray-600">
                          {new Date(analysis.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {analysis.title}
                      </h3>
                      <p className="text-gray-700 mb-2">{analysis.result}</p>
                      <p className="text-sm text-gray-600">{analysis.details}</p>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-green-600">
                        {analysis.accuracy}
                      </div>
                      <div className="text-xs text-gray-600">précision</div>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Formation IA */}
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="h-5 w-5 text-blue-600 mr-2" />
                Entraînement et Amélioration IA
              </CardTitle>
              <CardDescription>
                Configuration et amélioration continue de l'assistant IA
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">2,847</div>
                  <div className="text-sm text-gray-600">Décisions analysées</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">96.2%</div>
                  <div className="text-sm text-gray-600">Précision actuelle</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">45</div>
                  <div className="text-sm text-gray-600">Modèles entraînés</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Apprentissage automatique</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Suggestions proactives</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Analyse prédictive avancée</span>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Notifications automatiques</span>
                  <Switch />
                </div>
              </div>

              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Relancer Entraînement IA
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MairieAI;
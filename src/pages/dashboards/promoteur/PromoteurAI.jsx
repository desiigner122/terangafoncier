import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Bot, 
  Send, 
  Mic, 
  FileText, 
  Settings,
  Zap,
  Lightbulb,
  BarChart3,
  Target,
  TrendingUp,
  Users,
  Building,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Brain,
  Search,
  Filter,
  Download,
  Plus,
  Star
} from 'lucide-react';

const PromoteurAI = () => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  // Conversation avec l'IA
  const [conversation, setConversation] = useState([
    {
      id: 1,
      type: 'ai',
      message: 'Bonjour ! Je suis votre assistant IA spécialisé dans la promotion immobilière. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: '10:30',
      avatar: '🤖'
    },
    {
      id: 2,
      type: 'user',
      message: 'Peux-tu analyser les performances de mes projets ce mois ?',
      timestamp: '10:32',
      avatar: '👤'
    },
    {
      id: 3,
      type: 'ai',
      message: 'Bien sûr ! Voici une analyse de vos 4 projets actifs ce mois :\n\n📊 **Résidence Teranga** : 75% d\'avancement, ROI projeté de -37% (attention needed)\n🏡 **Villa Duplex Mermoz** : Terminé avec succès, ROI réalisé de +56%\n🏢 **Appartements VDN** : 45% d\'avancement, dépassement budget de 15%\n🏭 **Entrepôt Logistics** : 35% d\'avancement, risque de retard détecté\n\n💡 **Recommandation** : Priorité sur la Résidence Teranga pour optimiser les coûts.',
      timestamp: '10:33',
      avatar: '🤖',
      attachments: ['analyse_projets_dec.pdf', 'recommandations_ai.xlsx']
    }
  ]);

  // Analyses IA disponibles
  const aiAnalyses = [
    {
      id: 1,
      title: 'Analyse Prédictive des Ventes',
      description: 'Prévisions de demande et optimisation des prix',
      icon: <TrendingUp className="w-6 h-6" />,
      status: 'Terminé',
      confidence: 94,
      insights: [
        'Augmentation de 23% de la demande prévue pour Q1 2025',
        'Prix optimal pour VDN: 47M FCFA (+4% du prix actuel)',
        'Meilleure période de lancement: Mars-Avril 2025'
      ],
      actions: ['Ajuster pricing', 'Planifier marketing', 'Optimiser stock'],
      lastUpdate: '2024-12-10'
    },
    {
      id: 2,
      title: 'Optimisation des Coûts',
      description: 'Identification des économies potentielles',
      icon: <DollarSign className="w-6 h-6" />,
      status: 'En cours',
      confidence: 87,
      insights: [
        'Économies de 125M FCFA possibles sur matériaux',
        'Négociation fournisseurs recommandée',
        'Optimisation main-d\'œuvre: -12% coûts'
      ],
      actions: ['Négocier contrats', 'Revoir planning', 'Auditer fournisseurs'],
      lastUpdate: '2024-12-09'
    },
    {
      id: 3,
      title: 'Analyse de la Concurrence',
      description: 'Positionnement et avantages concurrentiels',
      icon: <Target className="w-6 h-6" />,
      status: 'Nouveau',
      confidence: 91,
      insights: [
        'Avantage prix de 8% vs concurrence directe',
        'Différenciation forte sur finitions haut de gamme',
        'Opportunité sur segment investisseurs'
      ],
      actions: ['Renforcer USP', 'Cibler investisseurs', 'Campagne différenciation'],
      lastUpdate: '2024-12-11'
    },
    {
      id: 4,
      title: 'Satisfaction Client',
      description: 'Analyse des retours et prédiction NPS',
      icon: <Users className="w-6 h-6" />,
      status: 'Terminé',
      confidence: 89,
      insights: [
        'NPS actuel: 76 (excellent)',
        'Satisfaction finitions: 4.8/5',
        'Point d\'amélioration: délais de livraison'
      ],
      actions: ['Améliorer planning', 'Formation équipes', 'Process qualité'],
      lastUpdate: '2024-12-08'
    }
  ];

  // Suggestions IA
  const aiSuggestions = [
    {
      id: 1,
      category: 'Marketing',
      title: 'Campagne ciblée investisseurs',
      description: 'Lancer une campagne spécifique pour attirer les investisseurs institutionnels',
      priority: 'Haute',
      impact: 'Revenue +15%',
      effort: 'Moyen',
      roi: '280%'
    },
    {
      id: 2,
      category: 'Opérations',
      title: 'Optimisation planning chantier',
      description: 'Réorganiser les phases pour réduire les temps morts de 20%',
      priority: 'Haute',
      impact: 'Coût -8%',
      effort: 'Faible',
      roi: '340%'
    },
    {
      id: 3,
      category: 'Finance',
      title: 'Renégociation fournisseurs',
      description: 'Réviser les contrats avec les 3 principaux fournisseurs',
      priority: 'Moyenne',
      impact: 'Coût -12%',
      effort: 'Élevé',
      roi: '220%'
    },
    {
      id: 4,
      category: 'Client',
      title: 'Programme de parrainage',
      description: 'Mettre en place un système de récompenses pour les références',
      priority: 'Moyenne',
      impact: 'Leads +25%',
      effort: 'Moyen',
      roi: '180%'
    }
  ];

  // Métriques IA
  const aiMetrics = {
    totalAnalyses: 47,
    activeModels: 12,
    accuracy: 94.2,
    timeSaved: 156,
    costsOptimized: 285000000,
    revenueGenerated: 420000000,
    predictions: 23,
    automations: 8
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: conversation.length + 1,
      type: 'user',
      message: message,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      avatar: '👤'
    };

    setConversation([...conversation, newMessage]);
    setMessage('');

    // Simuler une réponse de l'IA
    setTimeout(() => {
      const aiResponse = {
        id: conversation.length + 2,
        type: 'ai',
        message: 'Je traite votre demande... Voici une analyse basée sur vos données actuelles.',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        avatar: '🤖'
      };
      setConversation(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Nouveau': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Haute': return 'bg-red-100 text-red-800';
      case 'Moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'Faible': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assistant IA Promoteur</h1>
            <p className="text-gray-600">Intelligence artificielle pour optimiser vos projets immobiliers</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-purple-100 text-purple-800">
              <Brain className="w-3 h-3 mr-1" />
              {aiMetrics.accuracy}% précision
            </Badge>
            <Button>
              <Sparkles className="w-4 h-4 mr-2" />
              Nouvelle analyse
            </Button>
          </div>
        </div>

        {/* Métriques IA */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Analyses Réalisées</p>
                  <p className="text-2xl font-bold text-gray-900">{aiMetrics.totalAnalyses}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-purple-600 font-medium">
                  {aiMetrics.activeModels} modèles actifs
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Temps Économisé</p>
                  <p className="text-2xl font-bold text-gray-900">{aiMetrics.timeSaved}h</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-blue-600 font-medium">
                  Ce mois
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Coûts Optimisés</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(aiMetrics.costsOptimized)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">
                  Économies détectées
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Précision IA</p>
                  <p className="text-2xl font-bold text-gray-900">{aiMetrics.accuracy}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={aiMetrics.accuracy} className="h-2" />
                <span className="text-xs text-gray-500 mt-1">Fiabilité des prédictions</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat IA
            </TabsTrigger>
            <TabsTrigger value="analyses" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analyses
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configuration
            </TabsTrigger>
          </TabsList>

          {/* Chat IA */}
          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-purple-600" />
                  Assistant IA Promoteur
                </CardTitle>
                <CardDescription>
                  Posez vos questions sur vos projets, finances, marketing ou opérations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Zone de conversation */}
                <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="space-y-4">
                    {conversation.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white border border-gray-200'
                        }`}>
                          <div className="flex items-start space-x-2">
                            <span className="text-lg">{msg.avatar}</span>
                            <div className="flex-1">
                              <p className="text-sm whitespace-pre-line">{msg.message}</p>
                              <p className={`text-xs mt-1 ${
                                msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {msg.timestamp}
                              </p>
                              {msg.attachments && (
                                <div className="mt-2 space-y-1">
                                  {msg.attachments.map((file, index) => (
                                    <div key={index} className="flex items-center space-x-1 text-xs bg-gray-100 rounded px-2 py-1">
                                      <FileText className="w-3 h-3" />
                                      <span>{file}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Zone de saisie */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Tapez votre message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                  <Button variant="outline">
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>

                {/* Suggestions rapides */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">Suggestions :</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Analyse ROI projets',
                      'Optimisation coûts',
                      'Prévisions ventes',
                      'Benchmark concurrence',
                      'Satisfaction clients'
                    ].map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setMessage(suggestion)}
                        className="text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analyses IA */}
          <TabsContent value="analyses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Analyses IA Disponibles</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {aiAnalyses.map((analysis) => (
                    <motion.div
                      key={analysis.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className="border rounded-lg p-6 cursor-pointer hover:shadow-md transition-all"
                      onClick={() => setSelectedAnalysis(analysis)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                            {analysis.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{analysis.title}</h3>
                            <p className="text-sm text-gray-600">{analysis.description}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(analysis.status)}>
                          {analysis.status}
                        </Badge>
                      </div>

                      {/* Niveau de confiance */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Confiance IA</span>
                          <span className="font-medium">{analysis.confidence}%</span>
                        </div>
                        <Progress value={analysis.confidence} className="h-2" />
                      </div>

                      {/* Insights clés */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Insights clés :</p>
                        <ul className="space-y-1">
                          {analysis.insights.slice(0, 2).map((insight, index) => (
                            <li key={index} className="text-xs text-gray-600 flex items-start">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Actions recommandées */}
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Actions recommandées :</p>
                        <div className="flex flex-wrap gap-1">
                          {analysis.actions.slice(0, 2).map((action, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Mis à jour: {new Date(analysis.lastUpdate).toLocaleDateString('fr-FR')}
                        </span>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <ArrowRight className="w-4 h-4 mr-1" />
                          Voir détails
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suggestions IA */}
          <TabsContent value="suggestions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                  Recommandations IA
                </CardTitle>
                <CardDescription>
                  Suggestions personnalisées pour optimiser vos performances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiSuggestions.map((suggestion) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border rounded-lg p-6 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{suggestion.title}</h3>
                            <Badge className={getPriorityColor(suggestion.priority)}>
                              {suggestion.priority}
                            </Badge>
                            <Badge variant="outline">
                              {suggestion.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">ROI {suggestion.roi}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-600">{suggestion.impact}</p>
                          <p className="text-xs text-blue-700">Impact</p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <p className="text-sm font-medium text-orange-600">{suggestion.effort}</p>
                          <p className="text-xs text-orange-700">Effort</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-600">{suggestion.roi}</p>
                          <p className="text-xs text-green-700">ROI estimé</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">Recommandation IA</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Plus de détails
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Appliquer
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration IA */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration de l'IA</CardTitle>
                <CardDescription>
                  Personnalisez les paramètres de votre assistant IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Modèles actifs */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Modèles Actifs</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: 'Prédiction Ventes', status: 'Actif', accuracy: 94 },
                        { name: 'Optimisation Coûts', status: 'Actif', accuracy: 87 },
                        { name: 'Analyse Concurrence', status: 'Actif', accuracy: 91 },
                        { name: 'Satisfaction Client', status: 'Actif', accuracy: 89 }
                      ].map((model, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{model.name}</h4>
                            <Badge className="bg-green-100 text-green-800">{model.status}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Précision: {model.accuracy}%</span>
                            <Button variant="outline" size="sm">
                              <Settings className="w-4 h-4 mr-1" />
                              Config
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notifications */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Notifications IA</h3>
                    <div className="space-y-3">
                      {[
                        'Alertes de performance de projet',
                        'Recommandations d\'optimisation',
                        'Prédictions de marché',
                        'Analyses de risque'
                      ].map((notification, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm text-gray-700">{notification}</span>
                          <Button variant="outline" size="sm">
                            Activé
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Données d'entraînement */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Sources de Données</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">98%</p>
                        <p className="text-sm text-blue-700">Données Projets</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">95%</p>
                        <p className="text-sm text-green-700">Données Finances</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">92%</p>
                        <p className="text-sm text-purple-700">Données Marché</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default PromoteurAI;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Activity, 
  MessageSquare, 
  Send, 
  Bot,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Zap,
  Target,
  Eye,
  Download,
  Upload,
  Settings,
  RefreshCw,
  Lightbulb,
  BarChart3,
  PieChart,
  Calculator,
  Shield,
  Star,
  Users,
  DollarSign,
  FileText,
  Clock,
  Sparkles,
  Cpu,
  Database,
  Network,
  Search,
  Filter,
  Award,
  BookOpen,
  Mic,
  MicOff
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const BanqueAI = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModel, setSelectedModel] = useState('credit-analyzer');
  const [isListening, setIsListening] = useState(false);

  // Données IA spécifiques aux crédits terrains
  const aiData = {
    models: [
      {
        name: 'Analyseur de Crédit Terrain',
        id: 'credit-analyzer',
        accuracy: 94.7,
        status: 'active',
        description: 'Évalue la solvabilité pour crédits terrains',
        lastTrained: '2024-01-20'
      },
      {
        name: 'Prédicteur de Défaut',
        id: 'default-predictor',
        accuracy: 91.2,
        status: 'active',
        description: 'Prédit les risques de défaut de paiement',
        lastTrained: '2024-01-18'
      },
      {
        name: 'Évaluateur Foncier',
        id: 'land-valuator',
        accuracy: 87.8,
        status: 'training',
        description: 'Estimation automatique de valeur foncière',
        lastTrained: '2024-01-15'
      }
    ],
    recommendations: [
      {
        id: 'REC-001',
        type: 'Optimisation Portfolio',
        priority: 'high',
        title: 'Diversification Géographique Recommandée',
        description: 'Augmenter les crédits dans les régions de Thiès et Saint-Louis pour réduire la concentration à Dakar',
        confidence: 89,
        potentialImpact: '+12% ROI',
        aiModel: 'Portfolio Optimizer'
      },
      {
        id: 'REC-002',
        type: 'Gestion Risque',
        priority: 'medium',
        title: 'Ajustement Critères LTV',
        description: 'Réduire le LTV maximal pour terrains non-titrés de 80% à 70%',
        confidence: 76,
        potentialImpact: '-15% risque défaut',
        aiModel: 'Risk Analyzer'
      },
      {
        id: 'REC-003',
        type: 'Efficacité Opérationnelle',
        priority: 'low',
        title: 'Automatisation Évaluation',
        description: 'Déployer l\'IA pour pré-évaluer 80% des demandes de crédit',
        confidence: 82,
        potentialImpact: '-40% temps traitement',
        aiModel: 'Process Optimizer'
      }
    ],
    analytics: {
      totalPredictions: 15847,
      accuracyRate: 92.3,
      processedToday: 234,
      savedTime: 1560, // heures
      automatedDecisions: 78
    }
  };

  const predefinedQuestions = [
    "Analyser le risque de défaut pour les crédits terrains de cette région",
    "Recommander une stratégie d'optimisation du portefeuille",
    "Évaluer la tendance du marché foncier à Dakar",
    "Calculer le LTV optimal pour les terrains commerciaux",
    "Prédire l'évolution des taux de défaut pour les 6 prochains mois"
  ];

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    const userMessage = { role: 'user', content: chatMessage, timestamp: new Date() };
    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage('');
    setIsProcessing(true);

    // Simulation de réponse IA
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant',
        content: generateAIResponse(chatMessage),
        timestamp: new Date(),
        confidence: Math.floor(Math.random() * 20) + 80,
        model: selectedModel
      };
      setChatHistory(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 2000);
  };

  const generateAIResponse = (message) => {
    if (message.toLowerCase().includes('risque')) {
      return "Analyse de risque terminée. Basé sur les données historiques de 15,847 transactions, le risque de défaut pour cette catégorie est de 2.3% ± 0.4%. Recommandation: Approuver avec LTV maximal de 75%.";
    } else if (message.toLowerCase().includes('portefeuille')) {
      return "Analyse du portefeuille: Concentration de 68% sur Dakar. Recommandation: Diversifier vers Thiès (+15%) et Saint-Louis (+12%) pour optimiser le ratio risque/rendement. ROI potentiel: +8.5%.";
    } else if (message.toLowerCase().includes('éval')) {
      return "Évaluation foncière IA: Terrain analysé. Valeur estimée entre 18.2M et 22.8M FCFA (moyenne: 20.5M). Confiance: 89%. Facteurs clés: proximité transport, infrastructures, zonage.";
    }
    return "Analyse en cours... L'IA TerangaCredit traite votre demande avec les dernières données du marché foncier sénégalais.";
  };

  const handlePredefinedQuestion = (question) => {
    setChatMessage(question);
  };

  const handleTrainModel = (modelId) => {
    setIsProcessing(true);
    setTimeout(() => {
      window.safeGlobalToast({
        title: "Entraînement lancé",
        description: `Modèle ${modelId} en cours d'entraînement`,
        variant: "success"
      });
      setIsProcessing(false);
    }, 1500);
  };

  const handleExportPredictions = () => {
    window.safeGlobalToast({
      title: "Prédictions exportées",
      description: "Rapport IA généré et téléchargé",
      variant: "success"
    });
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    window.safeGlobalToast({
      title: isListening ? "Écoute arrêtée" : "Écoute activée",
      description: isListening ? "Reconnaissance vocale désactivée" : "Parlez maintenant...",
      variant: "success"
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModelStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">TerangaCredit IA</h2>
          <p className="text-gray-600 mt-1">
            Assistant IA avancé pour l'analyse et la décision de crédit terrain
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aiData.models.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline"
            onClick={handleExportPredictions}
          >
            <Download className="h-4 w-4 mr-2" />
            Export IA
          </Button>
        </div>
      </div>

      {/* Statistiques IA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Prédictions Totales</p>
                <p className="text-xl font-bold">{aiData.analytics.totalPredictions.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Précision IA</p>
                <p className="text-xl font-bold">{aiData.analytics.accuracyRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Traitées Aujourd'hui</p>
                <p className="text-xl font-bold">{aiData.analytics.processedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Temps Économisé</p>
                <p className="text-xl font-bold">{aiData.analytics.savedTime}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Automatisation</p>
                <p className="text-xl font-bold">{aiData.analytics.automatedDecisions}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chat">Assistant IA</TabsTrigger>
          <TabsTrigger value="models">Modèles IA</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                    Chat avec TerangaCredit IA
                  </CardTitle>
                  <CardDescription>
                    Posez vos questions sur l'analyse de crédit et la gestion des risques
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    {chatHistory.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Bonjour ! Je suis votre assistant IA TerangaCredit.</p>
                        <p className="text-sm">Posez-moi des questions sur l'analyse de crédit terrain.</p>
                      </div>
                    )}
                    
                    {chatHistory.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white border shadow-sm'
                        }`}>
                          {message.role === 'assistant' && (
                            <div className="flex items-center mb-2">
                              <Bot className="h-4 w-4 mr-2 text-purple-600" />
                              <span className="text-xs text-gray-500">
                                TerangaCredit IA {message.confidence && `• ${message.confidence}% confiance`}
                              </span>
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="bg-white border shadow-sm p-3 rounded-lg">
                          <div className="flex items-center">
                            <Bot className="h-4 w-4 mr-2 text-purple-600 animate-pulse" />
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Tapez votre question..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleVoiceToggle}
                      className={isListening ? 'bg-red-100' : ''}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button onClick={handleSendMessage} disabled={isProcessing || !chatMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                    Questions Suggérées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {predefinedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handlePredefinedQuestion(question)}
                        className="w-full text-left justify-start h-auto p-3 text-wrap"
                      >
                        <div className="text-xs">{question}</div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiData.models.map((model) => (
              <Card key={model.id} className="border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {model.description}
                      </CardDescription>
                    </div>
                    <Badge className={getModelStatusColor(model.status)}>
                      {model.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Précision</span>
                        <span className="text-sm font-medium">{model.accuracy}%</span>
                      </div>
                      <Progress value={model.accuracy} className="h-2" />
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Dernière formation: {model.lastTrained}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTrainModel(model.id)}
                        disabled={model.status === 'training'}
                      >
                        <Cpu className="h-3 w-3 mr-1" />
                        {model.status === 'training' ? 'Formation...' : 'Former'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        Détails
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-indigo-600" />
                Recommandations IA
              </CardTitle>
              <CardDescription>
                Suggestions intelligentes basées sur l'analyse des données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiData.recommendations.map((rec) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{rec.title}</h3>
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority}
                          </Badge>
                          <Badge variant="outline">
                            {rec.confidence}% confiance
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>Impact: {rec.potentialImpact}</span>
                          <span>Modèle: {rec.aiModel}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Analyser
                        </Button>
                        <Button size="sm">
                          <CheckCircle className="h-3 w-3 mr-1" />
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
      </Tabs>
    </div>
  );
};

export default BanqueAI;
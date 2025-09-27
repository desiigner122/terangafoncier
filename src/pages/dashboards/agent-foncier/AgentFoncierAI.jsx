import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Lightbulb, 
  Target, 
  TrendingUp, 
  MessageCircle, 
  FileText,
  Zap,
  BarChart3,
  Map,
  Calculator,
  Search,
  Download,
  Upload,
  Eye,
  Settings,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Camera,
  Layers,
  Bot,
  Sparkles,
  Cpu,
  Database,
  LineChart,
  PieChart,
  Globe,
  MapPin,
  Building2,
  Ruler,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';

const AgentFoncierAI = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assistant');
  const [chatInput, setChatInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Données simulées pour l'IA
  const [aiMetrics] = useState({
    accuracyRate: 94.5,
    predictionsGenerated: 1247,
    timesSaved: 156,
    reportsGenerated: 89
  });

  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      type: 'ai',
      message: 'Bonjour ! Je suis votre assistant IA foncier. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: '09:00'
    },
    {
      id: 2,
      type: 'user',
      message: 'Peux-tu analyser le marché des Almadies ?',
      timestamp: '09:01'
    },
    {
      id: 3,
      type: 'ai',
      message: 'Analyse du marché des Almadies terminée ! La zone montre une croissance de +15% avec une forte demande pour les terrains avec vue mer. Prix moyen: 1.2M XOF/m². Recommandation: Excellent moment pour les évaluations premium.',
      timestamp: '09:02'
    }
  ]);

  const [marketPredictions] = useState([
    {
      zone: 'Almadies',
      currentPrice: '1.2M XOF/m²',
      prediction: '+15%',
      confidence: 92,
      trend: 'up',
      timeframe: '6 mois',
      factors: ['Vue mer', 'Infrastructures', 'Demande diaspora'],
      color: 'green'
    },
    {
      zone: 'Dakar Plateau',
      currentPrice: '850K XOF/m²',
      prediction: '+8%',
      confidence: 88,
      trend: 'up',
      timeframe: '6 mois',
      factors: ['Zone commerciale', 'Transport', 'Bureaux'],
      color: 'blue'
    },
    {
      zone: 'Parcelles Assainies',
      currentPrice: '420K XOF/m²',
      prediction: '+12%',
      confidence: 85,
      trend: 'up',
      timeframe: '8 mois',
      factors: ['Accessibilité', 'Projets résidentiels'],
      color: 'purple'
    },
    {
      zone: 'Rufisque',
      currentPrice: '280K XOF/m²',
      prediction: '+5%',
      confidence: 78,
      trend: 'stable',
      timeframe: '12 mois',
      factors: ['Zone industrielle', 'Transport en développement'],
      color: 'orange'
    }
  ]);

  const [aiFeatures] = useState([
    {
      title: 'Évaluation Automatique',
      description: 'IA calcule la valeur basée sur 50+ critères',
      icon: Calculator,
      accuracy: '94.5%',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Analyse de Marché',
      description: 'Prédictions basées sur big data',
      icon: BarChart3,
      accuracy: '91.2%',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Détection Fraude',
      description: 'Identifie les documents suspects',
      icon: AlertTriangle,
      accuracy: '98.7%',
      color: 'bg-red-50 text-red-600'
    },
    {
      title: 'Reconnaissance Image',
      description: 'Analyse automatique des plans',
      icon: Camera,
      accuracy: '89.3%',
      color: 'bg-purple-50 text-purple-600'
    }
  ]);

  const [aiRecommendations] = useState([
    {
      priority: 'haute',
      title: 'Opportunité Almadies',
      description: 'Forte demande détectée pour terrains vue mer. Recommandation d\'évaluation premium.',
      action: 'Programmer visite',
      confidence: 94
    },
    {
      priority: 'moyenne',
      title: 'Tendance Rufisque',
      description: 'Développement infrastructure détecté. Surveillez évolution prix.',
      action: 'Analyser zone',
      confidence: 82
    },
    {
      priority: 'faible',
      title: 'Documentation Manquante',
      description: '3 dossiers clients nécessitent documents additionnels.',
      action: 'Relancer clients',
      confidence: 76
    }
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    setIsProcessing(true);
    
    // Ajouter message utilisateur
    const userMessage = {
      id: chatHistory.length + 1,
      type: 'user',
      message: chatInput,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setChatInput('');
    
    // Simuler réponse IA
    setTimeout(() => {
      const aiResponse = {
        id: chatHistory.length + 2,
        type: 'ai',
        message: 'Analyse en cours... Basé sur votre question, je recommande une approche méthodique en tenant compte des facteurs de marché actuels.',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gray-50 p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Brain className="h-8 w-8 mr-3 text-blue-600" />
            IA Foncière
          </h1>
          <p className="text-gray-600">Intelligence artificielle pour l'expertise foncière avancée</p>
        </div>
        <div className="flex gap-3">
          <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
            <Sparkles className="h-3 w-3 mr-1" />
            IA Avancée
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Métriques IA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Précision IA</p>
                <p className="text-2xl font-bold text-gray-900">{aiMetrics.accuracyRate}%</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Prédictions</p>
                <p className="text-2xl font-bold text-gray-900">{aiMetrics.predictionsGenerated}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Temps Économisé</p>
                <p className="text-2xl font-bold text-gray-900">{aiMetrics.timesSaved}h</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Rapports Auto</p>
                <p className="text-2xl font-bold text-gray-900">{aiMetrics.reportsGenerated}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="assistant" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Assistant IA
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Prédictions
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Fonctionnalités
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics IA
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Rapports Auto
          </TabsTrigger>
        </TabsList>

        {/* Assistant IA */}
        <TabsContent value="assistant" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Conversation avec l'IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    {chatHistory.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.type === 'user' 
                            ? 'bg-green-600 text-white' 
                            : 'bg-white border shadow-sm'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${
                            msg.type === 'user' ? 'text-green-100' : 'text-gray-500'
                          }`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="bg-white border shadow-sm px-4 py-2 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                            <span className="text-sm text-gray-600">L'IA réfléchit...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Posez une question à l'IA..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isProcessing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Recommandations IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiRecommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 border rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={
                            rec.priority === 'haute' ? 'bg-red-100 text-red-800' :
                            rec.priority === 'moyenne' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {rec.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">{rec.confidence}%</span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{rec.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                        <Button variant="outline" size="sm" className="text-xs">
                          {rec.action}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Prédictions */}
        <TabsContent value="predictions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Prédictions de Marché IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {marketPredictions.map((pred, index) => (
                  <motion.div
                    key={pred.zone}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{pred.zone}</h3>
                      <Badge className={`bg-${pred.color}-100 text-${pred.color}-800`}>
                        {pred.prediction}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Prix actuel:</span>
                        <span className="font-medium">{pred.currentPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Confiance:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={pred.confidence} className="w-16 h-2" />
                          <span className="text-sm font-medium">{pred.confidence}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Échéance:</span>
                        <span className="font-medium">{pred.timeframe}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 block mb-2">Facteurs clés:</span>
                        <div className="flex flex-wrap gap-1">
                          {pred.factors.map((factor, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fonctionnalités */}
        <TabsContent value="features" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${feature.color}`}>
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {feature.accuracy}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <Button variant="outline" className="w-full">
                      Utiliser cette fonctionnalité
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Analytics IA */}
        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance IA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Précision Évaluations</span>
                      <span className="text-sm font-medium">94.5%</span>
                    </div>
                    <Progress value={94.5} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Prédictions Correctes</span>
                      <span className="text-sm font-medium">91.2%</span>
                    </div>
                    <Progress value={91.2} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Détection Fraude</span>
                      <span className="text-sm font-medium">98.7%</span>
                    </div>
                    <Progress value={98.7} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Utilisation IA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Requêtes Aujourd'hui</p>
                      <p className="text-2xl font-bold text-blue-600">247</p>
                    </div>
                    <Cpu className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">Temps Économisé</p>
                      <p className="text-2xl font-bold text-green-600">12.5h</p>
                    </div>
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Rapports Auto */}
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Génération Automatique de Rapports
                </span>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Download className="h-4 w-4 mr-2" />
                  Nouveau Rapport
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Button variant="outline" className="h-32 flex flex-col items-center justify-center">
                  <BarChart3 className="h-8 w-8 mb-2 text-blue-600" />
                  <span className="font-medium">Rapport d'Expertise</span>
                  <span className="text-sm text-gray-500">IA + Données marché</span>
                </Button>
                <Button variant="outline" className="h-32 flex flex-col items-center justify-center">
                  <LineChart className="h-8 w-8 mb-2 text-green-600" />
                  <span className="font-medium">Analyse Tendances</span>
                  <span className="text-sm text-gray-500">Prédictions 6 mois</span>
                </Button>
                <Button variant="outline" className="h-32 flex flex-col items-center justify-center">
                  <PieChart className="h-8 w-8 mb-2 text-purple-600" />
                  <span className="font-medium">Portfolio Analysis</span>
                  <span className="text-sm text-gray-500">Performance clients</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AgentFoncierAI;
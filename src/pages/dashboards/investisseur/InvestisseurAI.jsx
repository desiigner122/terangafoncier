import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Bot, 
  Send, 
  Mic, 
  Paperclip, 
  TrendingUp, 
  Calculator, 
  BarChart3, 
  PieChart,
  Building,
  MapPin,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Lightbulb,
  FileText,
  Zap,
  Brain,
  TrendingDown,
  ArrowUpRight
} from 'lucide-react';
// Layout géré par CompleteSidebarInvestisseurDashboard

const InvestisseurAI = () => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      type: 'ai',
      message: 'Bonjour ! Je suis votre assistant IA spécialisé en investissement immobilier. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: '10:30'
    },
    {
      id: 2,
      type: 'user',
      message: 'Peux-tu analyser la performance de mon portefeuille ce mois ?',
      timestamp: '10:32'
    },
    {
      id: 3,
      type: 'ai',
      message: 'Votre portefeuille a une excellente performance ce mois avec +8.5% de croissance. Voici l\'analyse détaillée:\n\n✅ Résidence Les Almadies: +12% (construction avance bien)\n✅ Centre Commercial Liberté 6: +6% (nouveaux locataires)\n⚠️ Entrepôt Rufisque: +2% (retard mineur)\n\nRecommandation: Considérez diversifier avec plus de commercial.',
      timestamp: '10:33'
    }
  ]);

  // Outils IA disponibles
  const aiTools = [
    {
      id: 'market-analysis',
      title: 'Analyse de Marché',
      description: 'Tendances immobilières en temps réel',
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600',
      status: 'active'
    },
    {
      id: 'roi-calculator',
      title: 'Calculateur ROI IA',
      description: 'Prédictions de rentabilité avancées',
      icon: Calculator,
      color: 'bg-green-100 text-green-600',
      status: 'active'
    },
    {
      id: 'risk-assessment',
      title: 'Évaluation des Risques',
      description: 'Analyse prédictive des risques',
      icon: AlertTriangle,
      color: 'bg-orange-100 text-orange-600',
      status: 'active'
    },
    {
      id: 'opportunity-finder',
      title: 'Détecteur d\'opportunités',
      description: 'IA trouve les meilleures affaires',
      icon: Target,
      color: 'bg-purple-100 text-purple-600',
      status: 'beta'
    },
    {
      id: 'portfolio-optimizer',
      title: 'Optimiseur de Portefeuille',
      description: 'Recommandations personnalisées',
      icon: Brain,
      color: 'bg-pink-100 text-pink-600',
      status: 'active'
    },
    {
      id: 'document-analyzer',
      title: 'Analyseur de Documents',
      description: 'Analyse automatique des contrats',
      icon: FileText,
      color: 'bg-indigo-100 text-indigo-600',
      status: 'coming-soon'
    }
  ];

  // Analyses récentes
  const recentAnalyses = [
    {
      id: 1,
      title: 'Analyse Quartier Almadies',
      type: 'Marché Local',
      result: 'Tendance haussière +15%',
      confidence: 89,
      date: '2 heures',
      positive: true
    },
    {
      id: 2,
      title: 'ROI Projet Commercial VDN',
      type: 'Calculateur ROI',
      result: 'ROI prévu: 22.5%',
      confidence: 94,
      date: '5 heures',
      positive: true
    },
    {
      id: 3,
      title: 'Risque Secteur Industriel',
      type: 'Évaluation Risque',
      result: 'Risque modéré - Monitor',
      confidence: 76,
      date: '1 jour',
      positive: false
    }
  ];

  // Recommandations IA
  const aiRecommendations = [
    {
      id: 1,
      type: 'opportunity',
      title: 'Opportunité Détectée',
      description: 'Villa moderne à VDN - Prix sous-évalué de 15%',
      action: 'Analyser maintenant',
      priority: 'high',
      potential: '+18% ROI estimé'
    },
    {
      id: 2,
      type: 'diversification',
      title: 'Diversification Recommandée',
      description: 'Votre portefeuille manque d\'exposition aux bureaux',
      action: 'Voir options',
      priority: 'medium',
      potential: 'Réduction risque 12%'
    },
    {
      id: 3,
      type: 'optimization',
      title: 'Optimisation Fiscale',
      description: 'Restructuration possible pour économiser 2.1M XOF/an',
      action: 'Planifier',
      priority: 'high',
      potential: 'Économies fiscales'
    }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: chatHistory.length + 1,
      type: 'user',
      message: message,
      timestamp: new Date().toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    setChatHistory([...chatHistory, newMessage]);
    setMessage('');

    // Simulation réponse IA
    setTimeout(() => {
      const aiResponse = {
        id: chatHistory.length + 2,
        type: 'ai',
        message: 'Je traite votre demande... Voici mes recommandations basées sur l\'analyse de vos données et les tendances du marché actuel.',
        timestamp: new Date().toLocaleTimeString('fr-FR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800 text-xs">Actif</Badge>;
      case 'beta': return <Badge className="bg-blue-100 text-blue-800 text-xs">Bêta</Badge>;
      case 'coming-soon': return <Badge className="bg-gray-100 text-gray-800 text-xs">Bientôt</Badge>;
      default: return null;
    }
  };

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assistant IA Investissement</h1>
            <p className="text-gray-600">Intelligence artificielle pour optimiser vos investissements</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              <Zap className="w-3 h-3 mr-1" />
              IA Active
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Chat IA
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Outils IA
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analyses
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Recommandations
            </TabsTrigger>
          </TabsList>

          {/* Chat IA */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bot className="w-5 h-5 mr-2 text-blue-600" />
                      Assistant IA Investissement
                    </CardTitle>
                    <CardDescription>
                      Posez vos questions sur vos investissements et le marché immobilier
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {/* Zone de chat */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {chatHistory.map((chat) => (
                        <div
                          key={chat.id}
                          className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex items-start space-x-2 max-w-[80%] ${
                            chat.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                          }`}>
                            <Avatar className="w-8 h-8">
                              {chat.type === 'ai' ? (
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                  <Bot className="w-4 h-4 text-white" />
                                </div>
                              ) : (
                                <AvatarFallback>AC</AvatarFallback>
                              )}
                            </Avatar>
                            <div className={`rounded-lg p-3 ${
                              chat.type === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              <p className="text-sm whitespace-pre-line">{chat.message}</p>
                              <p className={`text-xs mt-1 ${
                                chat.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {chat.timestamp}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Zone de saisie */}
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 relative">
                          <Input
                            placeholder="Posez votre question sur vos investissements..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="pr-10"
                          />
                        </div>
                        <Button variant="outline" size="sm">
                          <Mic className="w-4 h-4" />
                        </Button>
                        <Button onClick={handleSendMessage}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Suggestions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle>Questions Suggérées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      'Analyse ma performance ce mois',
                      'Trouve-moi de nouvelles opportunités',
                      'Évalue le risque de mon portefeuille',
                      'Optimise ma stratégie fiscale',
                      'Compare les quartiers de Dakar',
                      'Prédis les tendances 2025'
                    ].map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-sm"
                        onClick={() => setMessage(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Outils IA */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${tool.color}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          {getStatusBadge(tool.status)}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{tool.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                        <Button 
                          size="sm" 
                          className="w-full"
                          disabled={tool.status === 'coming-soon'}
                        >
                          {tool.status === 'coming-soon' ? 'Bientôt disponible' : 'Utiliser'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Analyses */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analyses Récentes</CardTitle>
                  <CardDescription>
                    Résultats des dernières analyses IA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAnalyses.map((analysis) => (
                      <div key={analysis.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{analysis.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {analysis.type}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <p className={`text-sm font-medium ${
                            analysis.positive ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {analysis.result}
                          </p>
                          <span className="text-xs text-gray-500">{analysis.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${analysis.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-600">{analysis.confidence}% confiance</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance IA</CardTitle>
                  <CardDescription>
                    Statistiques de votre assistant IA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">94%</p>
                        <p className="text-xs text-gray-600">Précision analyses</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">87</p>
                        <p className="text-xs text-gray-600">Analyses ce mois</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Analyses de marché</span>
                          <span>32</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Calculateurs ROI</span>
                          <span>28</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '58%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Évaluations risque</span>
                          <span>27</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-600 h-2 rounded-full" style={{ width: '56%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recommandations */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommandations IA Personnalisées</CardTitle>
                <CardDescription>
                  Suggestions basées sur votre profil et les tendances du marché
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiRecommendations.map((rec) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {rec.type === 'opportunity' && <Target className="w-5 h-5 text-purple-600" />}
                          {rec.type === 'diversification' && <PieChart className="w-5 h-5 text-blue-600" />}
                          {rec.type === 'optimization' && <TrendingUp className="w-5 h-5 text-green-600" />}
                          <div>
                            <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                            <p className="text-sm text-gray-600">{rec.description}</p>
                          </div>
                        </div>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority === 'high' ? 'Priorité élevée' : 
                           rec.priority === 'medium' ? 'Priorité moyenne' : 'Priorité faible'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-green-600">
                            {rec.potential}
                          </span>
                        </div>
                        <Button size="sm">
                          <ArrowUpRight className="w-4 h-4 mr-2" />
                          {rec.action}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InvestisseurAI;
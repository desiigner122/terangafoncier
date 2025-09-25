import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Brain, 
  Sparkles, 
  MessageSquare, 
  TrendingUp, 
  Target, 
  Lightbulb,
  Camera,
  DollarSign,
  Users,
  Calendar,
  MapPin,
  Star,
  ArrowRight,
  Zap,
  ChevronRight,
  Wand2,
  BarChart3,
  Search,
  Eye,
  Clock,
  Award,
  Rocket,
  Send
} from 'lucide-react';

const VendeurAI = () => {
  const [activeTab, setActiveTab] = useState('assistant');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message: "Bonjour ! Je suis votre assistant IA pour l'immobilier. Comment puis-je vous aider aujourd'hui ?",
      time: '10:00'
    }
  ]);

  const [aiInsights, setAiInsights] = useState({
    propertyScore: 87,
    marketTrend: 'hausse',
    competitiveness: 92,
    recommendations: [
      {
        id: 1,
        type: 'pricing',
        title: 'Optimisation des prix',
        description: 'Vos prix sont 8% sous le marché. Une augmentation de 12M FCFA pourrait générer 25% de revenus supplémentaires.',
        impact: 'Élevé',
        priority: 'Urgent',
        action: 'Ajuster les prix'
      },
      {
        id: 2,
        type: 'photos',
        title: 'Amélioration des photos',
        description: 'Ajoutez 4 photos supplémentaires pour vos propriétés principales. Impact estimé : +35% de vues.',
        impact: 'Moyen',
        priority: 'Important',
        action: 'Planifier shooting'
      },
      {
        id: 3,
        type: 'description',
        title: 'Descriptions optimisées',
        description: 'Vos descriptions pourraient être enrichies avec des mots-clés performants identifiés par l\'IA.',
        impact: 'Moyen',
        priority: 'Normal',
        action: 'Réécrire descriptions'
      }
    ],
    marketAnalysis: {
      averagePrice: '145M FCFA',
      avgTimeOnMarket: '45 jours',
      competitorCount: 23,
      demandLevel: 'Forte'
    }
  });

  const quickActions = [
    {
      title: 'Évaluer un bien',
      description: 'Estimation instantanée par IA',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Analyser la concurrence',
      description: 'Étude comparative du marché',
      icon: BarChart3,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Optimiser les photos',
      description: 'Suggestions d\'amélioration',
      icon: Camera,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Prédire les tendances',
      description: 'Analyse prédictive du marché',
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      type: 'user',
      message: chatMessage,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, newMessage]);
    setChatMessage('');

    // Simulation de réponse IA
    setTimeout(() => {
      const aiResponse = {
        type: 'ai',
        message: 'Je traite votre demande... Voici mes recommandations basées sur l\'analyse des données du marché immobilier sénégalais.',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="mr-3 h-8 w-8 text-purple-600" />
            Assistant IA TerangaFoncier
          </h1>
          <p className="text-gray-600 mt-1">
            Intelligence artificielle dédiée à l'optimisation de vos ventes immobilières
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-100 text-green-800">
            <Zap className="w-3 h-3 mr-1" />
            IA Active
          </Badge>
        </div>
      </div>

      {/* Score IA global */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Score IA Global</h3>
                  <p className="text-gray-600">Performance optimisée par l'intelligence artificielle</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-4xl font-bold text-purple-600">{aiInsights.propertyScore}/100</div>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600">+5 points ce mois</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <Progress value={aiInsights.propertyScore} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assistant">Assistant IA</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="optimization">Optimisation</TabsTrigger>
          <TabsTrigger value="predictions">Prédictions</TabsTrigger>
        </TabsList>

        {/* Assistant IA */}
        <TabsContent value="assistant" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Chat IA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Conversation avec l'IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
                <div className="space-y-4">
                  {chatHistory.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-200'
                      }`}>
                        {msg.type === 'ai' && (
                          <div className="flex items-center mb-1">
                            <Bot className="w-4 h-4 text-purple-600 mr-1" />
                            <span className="text-xs font-medium text-purple-600">Assistant IA</span>
                          </div>
                        )}
                        <p className="text-sm">{msg.message}</p>
                        <div className={`text-xs mt-1 ${
                          msg.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          {msg.time}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Input
                  placeholder="Posez votre question à l'IA..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Analyse du marché
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Prix moyen secteur</span>
                    <span className="font-bold">{aiInsights.marketAnalysis.averagePrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Temps moyen vente</span>
                    <span className="font-bold">{aiInsights.marketAnalysis.avgTimeOnMarket}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Concurrents actifs</span>
                    <span className="font-bold">{aiInsights.marketAnalysis.competitorCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Niveau de demande</span>
                    <Badge className={aiInsights.marketAnalysis.demandLevel === 'Forte' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                      {aiInsights.marketAnalysis.demandLevel}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Performance comparative
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Compétitivité</span>
                      <span className="text-sm font-bold">{aiInsights.competitiveness}%</span>
                    </div>
                    <Progress value={aiInsights.competitiveness} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Qualité des annonces</span>
                      <span className="text-sm font-bold">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Engagement client</span>
                      <span className="text-sm font-bold">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommandations IA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                Recommandations prioritaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-medium text-gray-900 mr-2">{rec.title}</h4>
                          <Badge variant={rec.priority === 'Urgent' ? 'destructive' : rec.priority === 'Important' ? 'default' : 'secondary'}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Impact: {rec.impact}</span>
                          <Button size="sm" variant="outline">
                            {rec.action}
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimisation */}
        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Prix optimaux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">+15M</div>
                  <p className="text-sm text-gray-600">Augmentation recommandée</p>
                  <Button className="mt-4" size="sm">
                    <Wand2 className="w-4 h-4 mr-1" />
                    Appliquer
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600">
                  <Camera className="w-5 h-5 mr-2" />
                  Qualité photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">73%</div>
                  <p className="text-sm text-gray-600">Score actuel</p>
                  <Button className="mt-4" size="sm" variant="outline">
                    <Rocket className="w-4 h-4 mr-1" />
                    Améliorer
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <Clock className="w-5 h-5 mr-2" />
                  Timing optimal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <div className="text-3xl font-bold text-purple-600 mb-2">14h-16h</div>
                  <p className="text-sm text-gray-600">Meilleur créneau</p>
                  <Button className="mt-4" size="sm" variant="outline">
                    <Calendar className="w-4 h-4 mr-1" />
                    Planifier
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Prédictions */}
        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Prédictions marché (3 mois)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-green-900">Évolution prix</h4>
                  <p className="text-2xl font-bold text-green-600">+12%</p>
                  <p className="text-sm text-green-700">Hausse prévue</p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-medium text-blue-900">Demande</h4>
                  <p className="text-2xl font-bold text-blue-600">Forte</p>
                  <p className="text-sm text-blue-700">Tendance maintenue</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-medium text-purple-900">Temps vente</h4>
                  <p className="text-2xl font-bold text-purple-600">35j</p>
                  <p className="text-sm text-purple-700">Réduction prévue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendeurAI;
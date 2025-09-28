import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Target,
  Search,
  Bot,
  Zap,
  DollarSign,
  MapPin,
  Building2,
  Eye,
  Heart,
  Calculator,
  Star,
  Send,
  Mic,
  Image,
  FileText,
  BarChart3,
  PieChart,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Lightbulb
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const ParticulierAI = () => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');

  // Suggestions de l'IA pour particuliers
  const aiSuggestions = [
    {
      id: 1,
      title: "Estimation automatique",
      description: "Estimez la valeur de votre bien en quelques clics",
      icon: Calculator,
      action: "Estimer mon bien",
      category: "Évaluation"
    },
    {
      id: 2,
      title: "Recherche intelligente",
      description: "Trouvez le bien idéal selon vos critères",
      icon: Search,
      action: "Rechercher",
      category: "Recherche"
    },
    {
      id: 3,
      title: "Analyse de marché",
      description: "Tendances et opportunités dans votre secteur",
      icon: TrendingUp,
      action: "Analyser",
      category: "Marché"
    },
    {
      id: 4,
      title: "Conseils personnalisés",
      description: "Recommandations adaptées à votre profil",
      icon: Lightbulb,
      action: "Obtenir des conseils",
      category: "Conseil"
    }
  ];

  // Conversations récentes avec l'IA
  const recentChats = [
    {
      id: 1,
      title: "Estimation appartement Dakar",
      preview: "Basé sur les données du marché, votre appartement...",
      timestamp: "Il y a 2 heures",
      status: "completed"
    },
    {
      id: 2,
      title: "Recherche villa avec jardin",
      preview: "Je vous ai trouvé 15 propriétés correspondant...",
      timestamp: "Hier",
      status: "completed"
    },
    {
      id: 3,
      title: "Analyse quartier Almadies",
      preview: "Le quartier des Almadies présente...",
      timestamp: "Il y a 3 jours",
      status: "pending"
    }
  ];

  // Insights IA
  const aiInsights = [
    {
      type: "opportunity",
      title: "Opportunité détectée",
      message: "Le marché dans votre zone de recherche a baissé de 5% ce mois-ci",
      action: "Voir les biens",
      icon: TrendingDown,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      type: "recommendation",
      title: "Recommandation IA",
      message: "3 nouveaux biens correspondent parfaitement à vos critères",
      action: "Consulter",
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      type: "alert",
      title: "Alerte prix",
      message: "Un bien de votre liste de favoris a baissé son prix de 10%",
      action: "Voir l'offre",
      icon: DollarSign,
      color: "text-orange-600",
      bg: "bg-orange-50"
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Logic pour envoyer le message à l'IA
      console.log('Message envoyé:', message);
      setMessage('');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Assistant IA Immobilier</h1>
          <p className="text-slate-600 mt-1">Intelligence artificielle pour vos décisions immobilières</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Sparkles className="w-3 h-3 mr-1" />
            IA PRO Activée
          </Badge>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Brain className="w-4 h-4 mr-2" />
            Nouvelle conversation
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat IA
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Suggestions
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="h-96">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-600" />
                    Conversation avec l'IA
                  </CardTitle>
                  <CardDescription>
                    Posez vos questions sur l'immobilier, je suis là pour vous aider
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col h-full p-0">
                  {/* Zone de chat */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-slate-100 rounded-2xl p-4 max-w-sm">
                          <p className="text-sm text-slate-800">Bonjour ! Je suis votre assistant IA immobilier. Comment puis-je vous aider aujourd'hui ?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Input de chat */}
                  <div className="border-t p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <Textarea
                          placeholder="Posez votre question sur l'immobilier..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="resize-none pr-20"
                          rows={2}
                        />
                        <div className="absolute right-2 bottom-2 flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Mic className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Image className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <Button 
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Calculator className="w-4 h-4 mr-2" />
                    Estimer un bien
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Search className="w-4 h-4 mr-2" />
                    Recherche intelligente
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analyse de marché
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Conseils quartier
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiSuggestions.map((suggestion) => {
              const Icon = suggestion.icon;
              return (
                <motion.div
                  key={suggestion.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                          <Icon className="w-6 h-6 text-purple-600" />
                        </div>
                        <Badge variant="outline">{suggestion.category}</Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{suggestion.title}</h3>
                      <p className="text-slate-600 text-sm mb-4">{suggestion.description}</p>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        {suggestion.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="space-y-4">
            {aiInsights.map((insight, index) => {
              const Icon = insight.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl ${insight.bg}`}>
                            <Icon className={`w-5 h-5 ${insight.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{insight.title}</h3>
                            <p className="text-slate-600 mb-3">{insight.message}</p>
                            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                              {insight.action}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="space-y-4">
            {recentChats.map((chat) => (
              <Card key={chat.id} className="cursor-pointer hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{chat.title}</h3>
                        <Badge className={
                          chat.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }>
                          {chat.status === 'completed' ? 'Terminé' : 'En cours'}
                        </Badge>
                      </div>
                      <p className="text-slate-600 text-sm mb-2">{chat.preview}</p>
                      <span className="text-xs text-slate-500">{chat.timestamp}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParticulierAI;
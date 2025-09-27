import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain,
  MessageSquare,
  Zap,
  Calculator,
  Map,
  FileText,
  Camera,
  TrendingUp,
  Target,
  Compass,
  Send,
  Mic,
  Paperclip,
  Sparkles,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GeometreAI = () => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');

  // Suggestions de l'IA
  const aiSuggestions = [
    {
      title: "Calcul de surface optimisé",
      description: "Optimiser le calcul de surface pour la parcelle A127",
      icon: Calculator,
      action: "Analyser maintenant",
      status: "Nouveau"
    },
    {
      title: "Précision GPS améliorée",
      description: "Correction atmosphérique pour les relevés de ce matin",
      icon: Target,
      action: "Appliquer corrections",
      status: "Recommandé"
    },
    {
      title: "Rapport automatique",
      description: "Générer le rapport de bornage pour M. Diallo",
      icon: FileText,
      action: "Générer rapport",
      status: "Prêt"
    }
  ];

  // Historique des conversations
  const chatHistory = [
    {
      id: 1,
      type: 'user',
      message: "Comment calculer la surface d'un terrain irrégulier avec 7 points GPS ?",
      time: "10:30"
    },
    {
      id: 2,
      type: 'ai',
      message: "Pour calculer la surface d'un polygone irrégulier avec 7 points GPS, je recommande la méthode de Gauss (formule du lacet). Voici les étapes:\n\n1. Ordonnez vos points dans le sens horaire ou anti-horaire\n2. Appliquez la formule: S = ½|Σ(xi(yi+1 - yi-1))|\n3. Convertissez les coordonnées GPS en mètres si nécessaire\n\nVoulez-vous que je calcule automatiquement avec vos coordonnées ?",
      time: "10:31"
    },
    {
      id: 3,
      type: 'user',
      message: "Oui, voici mes coordonnées : (14.7167, -17.4677), (14.7170, -17.4680), ...",
      time: "10:32"
    },
    {
      id: 4,
      type: 'ai',
      message: "Calcul en cours... ✨\n\nRésultat : Surface = 2,847 m² (0,28 ha)\n\nPrécision estimée : ±0.5%\nMéthode utilisée : Formule de Gauss avec correction géodésique\n\nVoulez-vous que je génère un rapport détaillé ?",
      time: "10:33"
    }
  ];

  // Outils IA disponibles
  const aiTools = [
    {
      name: "Calcul de surface intelligent",
      description: "Calcul automatique avec correction d'erreurs",
      icon: Calculator,
      color: "bg-blue-50 text-blue-600",
      usage: "156 fois ce mois"
    },
    {
      name: "Optimisation de parcours",
      description: "Route optimale pour les relevés terrain",
      icon: Map,
      color: "bg-green-50 text-green-600",
      usage: "89 fois ce mois"
    },
    {
      name: "Analyse de précision",
      description: "Évaluation de la qualité des mesures",
      icon: Target,
      color: "bg-purple-50 text-purple-600",
      usage: "203 fois ce mois"
    },
    {
      name: "Génération de rapports",
      description: "Rapports automatiques personnalisés",
      icon: FileText,
      color: "bg-orange-50 text-orange-600",
      usage: "127 fois ce mois"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Nouveau': return 'bg-blue-100 text-blue-800';
      case 'Recommandé': return 'bg-green-100 text-green-800';
      case 'Prêt': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assistant IA</h1>
            <p className="text-gray-600 mt-1">Intelligence artificielle pour géomètres experts</p>
          </div>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <Sparkles className="w-4 h-4 mr-1" />
            IA Activée
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat">Chat IA</TabsTrigger>
                <TabsTrigger value="tools">Outils</TabsTrigger>
                <TabsTrigger value="analysis">Analyses</TabsTrigger>
              </TabsList>

              <TabsContent value="chat">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-blue-600" />
                      Conversation avec l'IA
                    </CardTitle>
                    <CardDescription>
                      Posez vos questions techniques et obtenez des réponses expertes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {chatHistory.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.type === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-line">{msg.message}</p>
                            <p className={`text-xs mt-1 ${
                              msg.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                            }`}>
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Posez votre question technique..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button size="sm">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button size="sm">
                        <Mic className="w-4 h-4" />
                      </Button>
                      <Button>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tools">
                <div className="space-y-4">
                  {aiTools.map((tool, index) => {
                    const Icon = tool.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-lg ${tool.color}`}>
                                  <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                                  <p className="text-gray-600 text-sm">{tool.description}</p>
                                  <p className="text-xs text-gray-500 mt-1">{tool.usage}</p>
                                </div>
                              </div>
                              <Button variant="outline">
                                Utiliser
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="analysis">
                <Card>
                  <CardHeader>
                    <CardTitle>Analyses en cours</CardTitle>
                    <CardDescription>
                      Analyses automatiques de vos données géodésiques
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-orange-500" />
                        <div>
                          <p className="font-medium">Analyse de précision GPS</p>
                          <p className="text-sm text-gray-600">Parcelle A127 - En cours...</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium">Optimisation du parcours</p>
                          <p className="text-sm text-gray-600">Route optimale générée pour demain</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="font-medium">Détection d'anomalie</p>
                          <p className="text-sm text-gray-600">Point GPS aberrant détecté - Position 7</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Suggestions IA */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                  Suggestions IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiSuggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon;
                    return (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-purple-50 rounded-lg">
                            <Icon className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm">{suggestion.title}</h4>
                              <Badge className={getStatusColor(suggestion.status)}>
                                {suggestion.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">
                              {suggestion.description}
                            </p>
                            <Button size="sm" variant="outline" className="w-full">
                              {suggestion.action}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Performance IA */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Performance IA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Précision moyenne</span>
                    <span className="font-bold text-green-600">97.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Temps de réponse</span>
                    <span className="font-bold text-blue-600">1.2s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Requêtes ce mois</span>
                    <span className="font-bold text-purple-600">1,247</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Économie de temps</span>
                    <span className="font-bold text-orange-600">23.5h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeometreAI;
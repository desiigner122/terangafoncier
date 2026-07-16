/**
 * IA FONCIÈRE (Agent Foncier) - VERSION DONNÉES RÉELLES SUPABASE
 * - Métriques IA : compteurs RÉELS (ai_analyses, ai_chat_history, properties.ai_score).
 * - Assistant IA : historique réel (ai_chat_history, user_id). Aucun moteur IA n'est
 *   câblé sur cette instance : on n'invente PAS de réponse, on enregistre le message
 *   et on informe honnêtement l'utilisateur.
 * - Prédictions / Marché : prix RÉELS par région via StatsService.getRegionMarket
 *   (calculés depuis properties). Aucune prédiction/confiance/facteur fabriqués.
 * - Recommandations : pas de source de suggestions générées → état honnête.
 * - Fonctionnalités : catalogue statique (descriptions d'outils), pas de taux de
 *   précision fabriqués.
 * - Analytics : compteurs réels, pas de Math.random ni de valeurs codées en dur.
 */

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
  Calculator,
  Download,
  AlertTriangle,
  Camera,
  Bot,
  Sparkles,
  Cpu,
  LineChart,
  PieChart,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import StatsService from '@/services/StatsService';
import { toast } from 'react-hot-toast';

const AgentFoncierAI = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assistant');
  const [chatInput, setChatInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [chatHistory, setChatHistory] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [analyses, setAnalyses] = useState([]);

  // Métriques IA RÉELLES (aucun chiffre fabriqué)
  const [aiMetrics, setAiMetrics] = useState({
    avgAiScore: null,        // properties.ai_score moyen
    totalAnalyses: 0,        // ai_analyses
    totalMessages: 0,        // ai_chat_history
    propertiesTracked: 0     // properties de l'agent
  });

  // Catalogue STATIQUE de fonctionnalités (descriptions d'outils, pas de taux fabriqués)
  const aiFeatures = [
    {
      title: 'Évaluation Automatique',
      description: "Estimation de valeur assistée à partir des critères du terrain",
      icon: Calculator,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Analyse de Marché',
      description: 'Comparaison aux prix réels par région (données properties)',
      icon: BarChart3,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Détection Fraude',
      description: "Repérage d'incohérences documentaires et de litiges",
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600'
    },
    {
      title: 'Reconnaissance Image',
      description: 'Analyse assistée des plans et photos GPS',
      icon: Camera,
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Historique de chat réel (ai_chat_history : id, user_id, role, content, created_at)
      const { data: chatData } = await supabase
        .from('ai_chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      setChatHistory(
        (chatData || []).map((m) => ({
          id: m.id,
          type: m.role === 'user' ? 'user' : 'ai',
          message: m.content,
          timestamp: m.created_at
            ? new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            : ''
        }))
      );

      // Analyses IA réelles (ai_analyses : id, user_id, property_id, result jsonb, created_at)
      const { data: analysesData } = await supabase
        .from('ai_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setAnalyses(analysesData || []);

      // Propriétés de l'agent pour le score IA réel (properties.ai_score)
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('id, ai_score')
        .eq('owner_id', user.id);

      const scored = (propertiesData || []).filter(
        (p) => typeof p.ai_score === 'number' && p.ai_score !== null
      );
      const avgAiScore = scored.length > 0
        ? Math.round(scored.reduce((s, p) => s + p.ai_score, 0) / scored.length)
        : null;

      setAiMetrics({
        avgAiScore,
        totalAnalyses: analysesData?.length || 0,
        totalMessages: chatData?.length || 0,
        propertiesTracked: propertiesData?.length || 0
      });

      // Marché réel par région (prix/m² calculés depuis properties)
      const market = await StatsService.getRegionMarket();
      setMarketData(
        (market || [])
          .filter((m) => m.avgPricePerM2 > 0)
          .sort((a, b) => b.avgPricePerM2 - a.avgPricePerM2)
      );
    } catch (error) {
      console.error('Erreur chargement IA agent foncier:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isProcessing) return;
    setIsProcessing(true);
    const userMessage = chatInput.trim();
    setChatInput('');

    try {
      const nowLabel = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

      // Affichage optimiste + enregistrement réel du message utilisateur
      setChatHistory((prev) => [
        ...prev,
        { id: `local-${Date.now()}`, type: 'user', message: userMessage, timestamp: nowLabel }
      ]);

      await supabase.from('ai_chat_history').insert({
        user_id: user.id,
        role: 'user',
        content: userMessage
      });

      // Aucun moteur IA n'est câblé sur cette instance : on n'invente pas de réponse.
      const notConnectedMessage =
        "L'assistant IA conversationnel n'est pas encore connecté à un moteur d'intelligence artificielle sur votre compte (intégration à venir). Votre message a bien été enregistré.";

      setChatHistory((prev) => [
        ...prev,
        {
          id: `local-ai-${Date.now()}`,
          type: 'ai',
          message: notConnectedMessage,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      await supabase.from('ai_chat_history').insert({
        user_id: user.id,
        role: 'assistant',
        content: notConnectedMessage
      });

      setAiMetrics((prev) => ({ ...prev, totalMessages: prev.totalMessages + 2 }));
    } catch (error) {
      console.error('Erreur envoi message IA:', error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatXOF = (n) => {
    if (!n) return '—';
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M XOF/m²`;
    if (n >= 1_000) return `${Math.round(n / 1_000)}K XOF/m²`;
    return `${n} XOF/m²`;
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

      {/* Métriques IA — compteurs RÉELS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Score IA moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {aiMetrics.avgAiScore !== null ? `${aiMetrics.avgAiScore}%` : '—'}
                </p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">Analyses IA</p>
                <p className="text-2xl font-bold text-gray-900">{aiMetrics.totalAnalyses}</p>
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
                <p className="text-sm font-medium text-gray-600 mb-1">Messages IA</p>
                <p className="text-2xl font-bold text-gray-900">{aiMetrics.totalMessages}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Terrains suivis</p>
                <p className="text-2xl font-bold text-gray-900">{aiMetrics.propertiesTracked}</p>
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
            Marché
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
                    {chatHistory.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                        <Brain className="h-10 w-10 mb-3 text-gray-300" />
                        <p className="text-sm">Aucune conversation pour le moment.</p>
                        <p className="text-xs mt-1">Posez votre première question ci-dessous.</p>
                      </div>
                    ) : (
                      chatHistory.map((msg) => (
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
                            <p className="text-sm whitespace-pre-line">{msg.message}</p>
                            <p className={`text-xs mt-1 ${
                              msg.type === 'user' ? 'text-green-100' : 'text-gray-500'
                            }`}>
                              {msg.timestamp}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="bg-white border shadow-sm px-4 py-2 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                            <span className="text-sm text-gray-600">Enregistrement...</span>
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
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                      disabled={isProcessing}
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
                  {/* Aucune source de suggestions générées : état honnête */}
                  <div className="flex flex-col items-center justify-center text-center text-gray-500 py-8">
                    <Sparkles className="h-8 w-8 mb-2 text-gray-300" />
                    <p className="text-sm">
                      Les recommandations personnalisées seront disponibles une fois le moteur IA connecté.
                    </p>
                    <p className="text-xs mt-1">Bientôt disponible.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Marché (prix réels par région) */}
        <TabsContent value="predictions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Marché par région (prix réels)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {marketData.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center text-gray-500 py-10">
                  <LineChart className="h-10 w-10 mb-3 text-gray-300" />
                  <p className="text-sm">Aucune donnée de marché disponible pour le moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {marketData.map((m, index) => (
                    <motion.div
                      key={m.region}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{m.region}</h3>
                        <Badge className="bg-blue-100 text-blue-800">
                          {m.count} bien{m.count > 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Prix moyen /m² :</span>
                          <span className="font-medium">{formatXOF(m.avgPricePerM2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Prix moyen bien :</span>
                          <span className="font-medium">
                            {m.avgPrice ? `${(m.avgPrice / 1_000_000).toFixed(1)}M XOF` : '—'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Taux de vérification :</span>
                          <div className="flex items-center gap-2">
                            <Progress value={m.verificationRate} className="w-16 h-2" />
                            <span className="text-sm font-medium">{m.verificationRate}%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
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
                      <Badge variant="outline" className="text-gray-500">
                        Bientôt
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <Button variant="outline" className="w-full" disabled>
                      Bientôt disponible
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Analytics IA — compteurs RÉELS */}
        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activité IA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Analyses enregistrées</span>
                    <span className="font-bold text-blue-600">{aiMetrics.totalAnalyses}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Messages échangés</span>
                    <span className="font-bold text-purple-600">{aiMetrics.totalMessages}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Terrains suivis</span>
                    <span className="font-bold text-orange-600">{aiMetrics.propertiesTracked}</span>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Score IA moyen (terrains)</span>
                      <span className="text-sm font-medium">
                        {aiMetrics.avgAiScore !== null ? `${aiMetrics.avgAiScore}%` : '—'}
                      </span>
                    </div>
                    {aiMetrics.avgAiScore !== null && (
                      <Progress value={aiMetrics.avgAiScore} className="h-2" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Analyses récentes</CardTitle>
              </CardHeader>
              <CardContent>
                {analyses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center text-gray-500 py-8">
                    <Cpu className="h-8 w-8 mb-2 text-gray-300" />
                    <p className="text-sm">Aucune analyse IA enregistrée pour le moment.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analyses.slice(0, 5).map((a) => (
                      <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-800">
                          {a.result?.title || a.result?.type || 'Analyse IA'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {a.created_at ? new Date(a.created_at).toLocaleDateString('fr-FR') : '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
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
                <Button className="bg-green-600 hover:bg-green-700" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Nouveau Rapport
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Button variant="outline" className="h-32 flex flex-col items-center justify-center" disabled>
                  <BarChart3 className="h-8 w-8 mb-2 text-blue-600" />
                  <span className="font-medium">Rapport d'Expertise</span>
                  <span className="text-sm text-gray-500">Bientôt disponible</span>
                </Button>
                <Button variant="outline" className="h-32 flex flex-col items-center justify-center" disabled>
                  <LineChart className="h-8 w-8 mb-2 text-green-600" />
                  <span className="font-medium">Analyse Tendances</span>
                  <span className="text-sm text-gray-500">Bientôt disponible</span>
                </Button>
                <Button variant="outline" className="h-32 flex flex-col items-center justify-center" disabled>
                  <PieChart className="h-8 w-8 mb-2 text-purple-600" />
                  <span className="font-medium">Portfolio Analysis</span>
                  <span className="text-sm text-gray-500">Bientôt disponible</span>
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

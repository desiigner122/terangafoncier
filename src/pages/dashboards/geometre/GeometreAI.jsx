/**
 * GEOMETRE AI - VERSION DONNÉES RÉELLES SUPABASE
 * - Chat IA : historique réel (ai_chat_history, user_id). Aucun moteur IA n'est câblé
 *   sur cette instance : on n'invente PAS de réponse, on enregistre le message et on
 *   informe honnêtement l'utilisateur.
 * - Analyses : ai_analyses (user_id, property_id, result jsonb), état vide honnête.
 * - Performance IA : compteurs réels (analyses, messages, score IA properties.ai_score).
 * - Outils / Suggestions : catalogue statique de fonctionnalités (pas de compteur
 *   d'usage fabriqué, pas de suggestion inventée sur des parcelles fictives).
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Target,
  Calculator,
  Map,
  FileText,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  Mic,
  Paperclip
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

const GeometreAI = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [chatHistory, setChatHistory] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    totalMessages: 0,
    avgAiScore: null,
    propertiesAnalyzed: 0
  });

  // Catalogue STATIQUE de fonctionnalités (descriptions d'outils, pas de donnée
  // temps réel : aucun compteur d'usage fabriqué).
  const aiTools = [
    {
      name: "Calcul de surface intelligent",
      description: "Calcul automatique de surface (formule de Gauss / lacet) avec contrôle d'erreurs",
      icon: Calculator,
      color: "bg-blue-50 text-blue-600"
    },
    {
      name: "Optimisation de parcours",
      description: "Route optimale pour enchaîner les relevés terrain",
      icon: Map,
      color: "bg-green-50 text-green-600"
    },
    {
      name: "Analyse de précision",
      description: "Évaluation de la qualité et de la cohérence des mesures GPS",
      icon: Target,
      color: "bg-purple-50 text-purple-600"
    },
    {
      name: "Génération de rapports",
      description: "Rapports de bornage / levé automatiques et personnalisés",
      icon: FileText,
      color: "bg-orange-50 text-orange-600"
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
          time: m.created_at
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

      // Propriétés du géomètre pour le score IA réel (properties.ai_score)
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

      const propertiesAnalyzed = new Set(
        (analysesData || []).map((a) => a.property_id).filter(Boolean)
      ).size;

      setStats({
        totalAnalyses: analysesData?.length || 0,
        totalMessages: chatData?.length || 0,
        avgAiScore,
        propertiesAnalyzed
      });
    } catch (error) {
      console.error('Erreur chargement IA géomètre:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    setSending(true);
    const userMessage = message.trim();
    setMessage('');

    try {
      const nowLabel = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

      // Affichage optimiste + enregistrement réel du message utilisateur
      setChatHistory((prev) => [
        ...prev,
        { id: `local-${Date.now()}`, type: 'user', message: userMessage, time: nowLabel }
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
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      await supabase.from('ai_chat_history').insert({
        user_id: user.id,
        role: 'assistant',
        content: notConnectedMessage
      });

      setStats((prev) => ({ ...prev, totalMessages: prev.totalMessages + 2 }));
    } catch (error) {
      console.error('Erreur envoi message IA:', error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  const getAnalysisTitle = (analysis) => {
    const r = analysis.result || {};
    return r.title || r.type || 'Analyse IA';
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
            IA
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
                      Posez vos questions techniques. Vos messages sont enregistrés.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {loading ? (
                        <p className="text-sm text-gray-500 text-center py-8">Chargement…</p>
                      ) : chatHistory.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-8">
                          <Brain className="w-10 h-10 mb-3 text-gray-300" />
                          <p className="text-sm">Aucune conversation pour le moment.</p>
                          <p className="text-xs mt-1">Posez votre première question ci-dessous.</p>
                        </div>
                      ) : (
                        chatHistory.map((msg) => (
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
                        ))
                      )}
                    </div>

                    {/* Input */}
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Posez votre question technique..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                        className="flex-1"
                        disabled={sending}
                      />
                      <Button size="sm" variant="outline" disabled>
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" disabled>
                        <Mic className="w-4 h-4" />
                      </Button>
                      <Button onClick={handleSend} disabled={sending || !message.trim()}>
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
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-lg ${tool.color}`}>
                                  <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                                  <p className="text-gray-600 text-sm">{tool.description}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-gray-500">Bientôt</Badge>
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
                    <CardTitle>Analyses IA</CardTitle>
                    <CardDescription>
                      Analyses enregistrées sur vos données géodésiques
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <p className="text-sm text-gray-500 py-6 text-center">Chargement…</p>
                    ) : analyses.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center text-gray-500 py-10">
                        <Sparkles className="w-10 h-10 mb-3 text-gray-300" />
                        <p className="text-sm">Aucune analyse IA enregistrée pour le moment.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {analyses.map((analysis) => {
                          const status = analysis.result?.status || 'completed';
                          const Icon = status === 'in_progress'
                            ? Clock
                            : status === 'error'
                              ? AlertCircle
                              : CheckCircle;
                          const iconColor = status === 'in_progress'
                            ? 'text-orange-500'
                            : status === 'error'
                              ? 'text-red-500'
                              : 'text-green-500';
                          return (
                            <div key={analysis.id} className="flex items-center space-x-3">
                              <Icon className={`w-5 h-5 ${iconColor}`} />
                              <div>
                                <p className="font-medium">{getAnalysisTitle(analysis)}</p>
                                <p className="text-sm text-gray-600">
                                  {analysis.result?.summary
                                    || (analysis.created_at
                                      ? new Date(analysis.created_at).toLocaleDateString('fr-FR')
                                      : '—')}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Colonne latérale */}
          <div>
            {/* Suggestions IA — pas de source de suggestions générées : état honnête */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                  Suggestions IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center text-center text-gray-500 py-6">
                  <Sparkles className="w-8 h-8 mb-2 text-gray-300" />
                  <p className="text-sm">Les suggestions personnalisées seront disponibles une fois le moteur IA connecté.</p>
                  <p className="text-xs mt-1">Bientôt disponible.</p>
                </div>
              </CardContent>
            </Card>

            {/* Performance IA — compteurs RÉELS */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Activité IA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Analyses enregistrées</span>
                    <span className="font-bold text-blue-600">{stats.totalAnalyses}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Messages échangés</span>
                    <span className="font-bold text-purple-600">{stats.totalMessages}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Propriétés analysées</span>
                    <span className="font-bold text-orange-600">{stats.propertiesAnalyzed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Score IA moyen</span>
                    <span className="font-bold text-green-600">
                      {stats.avgAiScore !== null ? `${stats.avgAiScore}%` : '—'}
                    </span>
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

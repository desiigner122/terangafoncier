import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  BarChart3, 
  MessageCircle, 
  TrendingUp, 
  Coins,
  Activity,
  Zap
} from 'lucide-react';
import AdvancedAIChatbot from '@/components/advanced/AdvancedAIChatbot';
import BlockchainAnalytics from '@/components/advanced/BlockchainAnalytics';

const AdvancedFeaturesWidget = ({ showChatbot = true, showAnalytics = true, compact = false }) => {
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {/* Quick Actions */}
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Fonctionnalités Avancées</h3>
                  <Badge className="bg-green-100 text-green-700 text-xs">Actives</Badge>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-2 text-xs"
              >
                <Brain className="h-3 w-3" />
                Chat IA
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-2 text-xs"
              >
                <BarChart3 className="h-3 w-3" />
                Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fonctionnalités Avancées</h2>
          <p className="text-muted-foreground">Intelligence artificielle et blockchain intégrées</p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <Activity className="mr-1 h-3 w-3" />
          Actives
        </Badge>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* AI Chatbot */}
        {showChatbot && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <AdvancedAIChatbot />
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Performances IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">98.7%</div>
                  <p className="text-xs text-muted-foreground">Précision IA</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">24/7</div>
                  <p className="text-xs text-muted-foreground">Disponibilité</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Recommandations</span>
                  <Badge className="bg-blue-100 text-blue-700">✓ Actif</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Analyse prédictive</span>
                  <Badge className="bg-green-100 text-green-700">✓ Actif</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Chat intelligent</span>
                  <Badge className="bg-purple-100 text-purple-700">✓ Actif</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Blockchain Analytics */}
      {showAnalytics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-purple-600" />
                Analytics Blockchain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BlockchainAnalytics />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Integration Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-green-800 mb-1">
                  Intégration Réussie ! 🎉
                </h3>
                <p className="text-sm text-green-600">
                  Toutes les fonctionnalités avancées sont opérationnelles
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-green-700">155 packages</div>
                <div className="text-xs text-green-600">installés</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AdvancedFeaturesWidget;
